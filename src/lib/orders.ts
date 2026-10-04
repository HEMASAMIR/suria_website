import "server-only";
import type { Coupon, DB, Order, OrderStatus } from "./types";

export function couponDiscount(coupon: Coupon | undefined, subtotal: number): { discount: number; error?: string } {
  if (!coupon || !coupon.active) return { discount: 0, error: "الكود غير صحيح" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return { discount: 0, error: "الكود منتهي" };
  if (coupon.usageLimit && coupon.used >= coupon.usageLimit) return { discount: 0, error: "الكود استُخدم بالكامل" };
  if (subtotal < coupon.minOrder) return { discount: 0, error: `الحد الأدنى للطلب ${coupon.minOrder} ج.م` };
  const d = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  return { discount: Math.min(Math.round(d), subtotal) };
}

export const findCoupon = (db: DB, code?: string) =>
  code ? db.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase()) : undefined;

const INACTIVE: OrderStatus[] = ["cancelled", "returned"];

/** Apply a status change, restoring stock once when an order is cancelled/returned. */
export function applyStatus(db: DB, order: Order, status: OrderStatus, note?: string) {
  if (order.status === status) return;
  const restoring = INACTIVE.includes(status) && !order.stockRestored;
  const reTaking = !INACTIVE.includes(status) && order.stockRestored;
  if (restoring || reTaking) {
    for (const it of order.items) {
      const p = db.products.find((x) => x.id === it.productId);
      if (p) p.stock = Math.max(0, p.stock + (restoring ? it.qty : -it.qty));
    }
    order.stockRestored = restoring;
  }
  order.status = status;
  order.history.push({ status, at: new Date().toISOString(), note });
}

export const orderProfit = (o: Order) =>
  o.items.reduce((s, it) => s + (it.price - it.cost) * it.qty, 0) - o.discount;
