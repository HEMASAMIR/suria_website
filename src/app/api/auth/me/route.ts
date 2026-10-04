import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CUSTOMER_COOKIE, verifyCustomerToken } from "@/lib/auth";
import { mutateDB } from "@/lib/db";
import { PHONE_RE, checkPassword, hashPassword, normalizePhone, publicCustomer } from "@/lib/customers";

const unauth = () => NextResponse.json({ error: "سجّلي دخولك الأول" }, { status: 401 });

async function customerId() {
  const jar = await cookies();
  return verifyCustomerToken(jar.get(CUSTOMER_COOKIE)?.value);
}

/** Update profile / address, or change password. */
export async function PUT(req: Request) {
  const id = await customerId();
  if (!id) return unauth();
  const body = (await req.json().catch(() => ({}))) as {
    name?: string; phone?: string; email?: string;
    address?: { governorate: string; city: string; address: string };
    currentPassword?: string; newPassword?: string;
  };
  const newHash = body.newPassword ? await hashPassword(body.newPassword) : null;
  if (body.newPassword && body.newPassword.length < 6) return NextResponse.json({ error: "كلمة السر الجديدة لازم تكون 6 حروف أو أكتر" }, { status: 400 });

  try {
    const pub = await mutateDB(async (db) => {
      const c = db.customers.find((x) => x.id === id);
      if (!c) throw new Error("الحساب غير موجود");
      if (newHash) {
        if (!(await checkPassword(body.currentPassword ?? "", c.passwordHash))) throw new Error("كلمة السر الحالية غلط");
        c.passwordHash = newHash;
      }
      if (body.name !== undefined) {
        if (body.name.trim().length < 2) throw new Error("اكتبي اسمك بالكامل");
        c.name = body.name.trim();
      }
      if (body.phone !== undefined) {
        const phone = normalizePhone(body.phone);
        if (!PHONE_RE.test(phone)) throw new Error("رقم الموبايل غير صحيح");
        if (db.customers.some((x) => x.id !== id && x.phone === phone)) throw new Error("الرقم ده مستخدم في حساب تاني");
        c.phone = phone;
      }
      if (body.email !== undefined) {
        const email = body.email.trim().toLowerCase() || undefined;
        if (email && db.customers.some((x) => x.id !== id && x.email === email)) throw new Error("البريد ده مستخدم في حساب تاني");
        c.email = email;
      }
      if (body.address) c.address = { governorate: body.address.governorate, city: body.address.city.trim(), address: body.address.address.trim() };
      return publicCustomer(c);
    });
    return NextResponse.json({ customer: pub });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(CUSTOMER_COOKIE);
  return res;
}
