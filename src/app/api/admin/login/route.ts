import { NextResponse } from "next/server";
import { SESSION_COOKIE, adminPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (password !== adminPassword())
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  const { token, maxAge } = await createToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
