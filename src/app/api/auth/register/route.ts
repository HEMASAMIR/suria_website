import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, createCustomerToken } from "@/lib/auth";
import { mutateDB, uid } from "@/lib/db";
import { PHONE_RE, hashPassword, normalizePhone, publicCustomer } from "@/lib/customers";
import type { Customer } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { name?: string; phone?: string; email?: string; password?: string };
  const name = body.name?.trim() ?? "";
  const phone = normalizePhone(body.phone ?? "");
  const email = body.email?.trim().toLowerCase() || undefined;
  const password = body.password ?? "";

  if (name.length < 2) return NextResponse.json({ error: "اكتبي اسمك بالكامل" }, { status: 400 });
  if (!PHONE_RE.test(phone)) return NextResponse.json({ error: "رقم الموبايل غير صحيح" }, { status: 400 });
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "كلمة السر لازم تكون 6 حروف أو أكتر" }, { status: 400 });

  const passwordHash = await hashPassword(password);
  try {
    const customer = await mutateDB((db) => {
      if (db.customers.some((c) => c.phone === phone)) throw new Error("الرقم ده متسجل قبل كده — جربي تسجيل الدخول");
      if (email && db.customers.some((c) => c.email === email)) throw new Error("البريد ده متسجل قبل كده");
      const now = new Date().toISOString();
      const c: Customer = { id: uid("cu"), name, phone, email, passwordHash, createdAt: now, lastLoginAt: now };
      db.customers.unshift(c);
      // Link earlier guest orders placed with the same phone.
      db.orders.forEach((o) => { if (!o.customerId && o.customer.phone === phone) o.customerId = c.id; });
      return c;
    });
    const { token, maxAge } = await createCustomerToken(customer.id);
    const res = NextResponse.json({ customer: publicCustomer(customer) });
    res.cookies.set(CUSTOMER_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
    return res;
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
