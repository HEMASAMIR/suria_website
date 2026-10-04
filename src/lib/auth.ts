// Edge/Node-agnostic HMAC session token (used by proxy.ts and route handlers).
export const SESSION_COOKIE = "zona_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

const secret = () => process.env.ADMIN_SECRET || "zona-dev-secret-change-me";
export const adminPassword = () => process.env.ADMIN_PASSWORD || "zona2026";

const enc = new TextEncoder();

export async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  return { token: `${payload}.${await sign(payload)}`, maxAge: MAX_AGE };
}

export async function verifyToken(token?: string | null) {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  if (!payload.startsWith("admin.")) return false;
  const exp = Number(payload.split(".")[1]);
  if (!exp || exp < Date.now() / 1000) return false;
  return (await sign(payload)) === token.slice(i + 1);
}

/* ---------------- Customer sessions ---------------- */
export const CUSTOMER_COOKIE = "zona_customer";
const CUSTOMER_MAX_AGE = 60 * 60 * 24 * 30;

export async function createCustomerToken(id: string) {
  const exp = Math.floor(Date.now() / 1000) + CUSTOMER_MAX_AGE;
  const payload = `cust.${id}.${exp}`;
  return { token: `${payload}.${await sign(payload)}`, maxAge: CUSTOMER_MAX_AGE };
}

/** Returns the customer id for a valid token, otherwise null. */
export async function verifyCustomerToken(token?: string | null) {
  if (!token) return null;
  const i = token.lastIndexOf(".");
  if (i < 0) return null;
  const payload = token.slice(0, i);
  const [kind, id, exp] = payload.split(".");
  if (kind !== "cust" || !id || !(Number(exp) > Date.now() / 1000)) return null;
  return (await sign(payload)) === token.slice(i + 1) ? id : null;
}
