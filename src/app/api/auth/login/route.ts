import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, createCustomerToken } from "@/lib/auth";
import { mutateDB, readDB } from "@/lib/db";
import { checkPassword, clearFailures, normalizePhone, publicCustomer, recordFailure, tooManyAttempts } from "@/lib/customers";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { login?: string; password?: string };
  const raw = body.login?.trim() ?? "";
  const key = raw.toLowerCase();
  if (tooManyAttempts(key)) return NextResponse.json({ error: "محاولات كتير — جربي تاني بعد 10 دقايق" }, { status: 429 });

  const db = await readDB();
  const phone = normalizePhone(raw);
  const c = db.customers.find((x) => (raw.includes("@") ? x.email === key : x.phone === phone));
  if (!c || !(await checkPassword(body.password ?? "", c.passwordHash))) {
    recordFailure(key);
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
  }
  clearFailures(key);
  await mutateDB((d) => {
    const x = d.customers.find((y) => y.id === c.id);
    if (x) x.lastLoginAt = new Date().toISOString();
  });
  const { token, maxAge } = await createCustomerToken(c.id);
  const res = NextResponse.json({ customer: publicCustomer(c) });
  res.cookies.set(CUSTOMER_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge });
  return res;
}
