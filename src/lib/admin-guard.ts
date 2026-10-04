import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "./auth";
import type { CollectionName } from "./types";

export async function isAdmin() {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

export const unauthorized = () => NextResponse.json({ error: "غير مصرح" }, { status: 401 });

export const COLLECTIONS: Record<CollectionName, string> = {
  products: "p",
  categories: "cat",
  shipping: "sh",
  orders: "o",
  customers: "cu",
  coupons: "cp",
  testimonials: "t",
  expenses: "ex",
};

export const isCollection = (c: string): c is CollectionName => c in COLLECTIONS;
