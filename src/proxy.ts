import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const ok = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);
  const isLogin = req.nextUrl.pathname === "/admin/login";
  if (!ok && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
  if (ok && isLogin) return NextResponse.redirect(new URL("/admin", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
