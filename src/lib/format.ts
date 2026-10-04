import type { OrderStatus, PaymentMethod } from "./types";

export const egp = (n: number) =>
  `${Math.round(n).toLocaleString("en-US")} ج.م`;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" });

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("ar-EG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  pending: { label: "قيد المراجعة", tone: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300" },
  confirmed: { label: "تم التأكيد", tone: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" },
  shipped: { label: "تم الشحن", tone: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300" },
  delivered: { label: "تم التسليم", tone: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" },
  cancelled: { label: "ملغي", tone: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300" },
  returned: { label: "مرتجع", tone: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300" },
};

export const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

export const PAYMENT: Record<PaymentMethod, string> = {
  cod: "الدفع عند الاستلام",
  instapay: "InstaPay",
  vodafone_cash: "فودافون كاش",
};
