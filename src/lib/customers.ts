import "server-only";
import { cookies } from "next/headers";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { CUSTOMER_COOKIE, verifyCustomerToken } from "./auth";
import { readDB } from "./db";
import type { Customer, PublicCustomer } from "./types";

const scryptAsync = promisify(scrypt) as (pw: string, salt: string, len: number) => Promise<Buffer>;

export async function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(pw, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function checkPassword(pw: string, stored: string) {
  const [salt, hex] = stored.split(":");
  if (!salt || !hex) return false;
  const hash = await scryptAsync(pw, salt, 64);
  const want = Buffer.from(hex, "hex");
  return want.length === hash.length && timingSafeEqual(want, hash);
}

export function publicCustomer(c: Customer): PublicCustomer {
  const { passwordHash, ...rest } = c;
  void passwordHash;
  return rest;
}

export const PHONE_RE = /^01[0125]\d{8}$/;
export const normalizePhone = (p: string) =>
  p.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).replace(/\D/g, "").replace(/^20(?=1)/, "0");

/** The signed-in customer for the current request, or null. */
export async function currentCustomer(): Promise<PublicCustomer | null> {
  const jar = await cookies();
  const id = await verifyCustomerToken(jar.get(CUSTOMER_COOKIE)?.value);
  if (!id) return null;
  const db = await readDB();
  const c = db.customers.find((x) => x.id === id);
  return c ? publicCustomer(c) : null;
}

// Very small in-memory brute-force guard: 8 failed attempts per key per 10 minutes.
const attempts = new Map<string, { n: number; until: number }>();
export function tooManyAttempts(key: string) {
  const a = attempts.get(key);
  return !!a && a.n >= 8 && a.until > Date.now();
}
export function recordFailure(key: string) {
  const a = attempts.get(key);
  if (!a || a.until < Date.now()) attempts.set(key, { n: 1, until: Date.now() + 10 * 60_000 });
  else a.n += 1;
}
export const clearFailures = (key: string) => attempts.delete(key);
