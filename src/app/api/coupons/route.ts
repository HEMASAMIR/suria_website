import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { couponDiscount, findCoupon } from "@/lib/orders";

export async function POST(req: Request) {
  const { code, subtotal } = (await req.json().catch(() => ({}))) as { code?: string; subtotal?: number };
  const db = await readDB();
  const coupon = findCoupon(db, code);
  const r = couponDiscount(coupon, Number(subtotal) || 0);
  if (r.error) return NextResponse.json({ error: r.error }, { status: 400 });
  return NextResponse.json({ code: coupon!.code, discount: r.discount });
}
