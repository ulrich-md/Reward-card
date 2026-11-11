import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

const ADMIN_COOKIE = "rc_admin";
const STAFF_COOKIE = "rc_staff";
const isProd = process.env.NODE_ENV === "production";

function secret(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s && isProd) throw new Error("Falta SESSION_SECRET.");
  return new TextEncoder().encode(s ?? "dev-secret-solo-para-desarrollo-local");
}

function adminPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p && isProd) throw new Error("Falta ADMIN_PASSWORD.");
  return p ?? "admin";
}

async function setSession(name: string, claims: Record<string, string>, days: number) {
  const token = await new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${days}d`)
    .sign(secret());
  // «Secure» solo si la petición llegó por HTTPS: así la sesión también
  // funciona al probar un build de producción por HTTP en la red local.
  const https = (await headers()).get("x-forwarded-proto")?.split(",")[0].trim() === "https";
  (await cookies()).set(name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: https,
    path: "/",
    maxAge: days * 86400,
  });
}

async function readSession(name: string): Promise<Record<string, unknown> | null> {
  const token = (await cookies()).get(name)?.value;
  if (!token) return null;
  try {
    return (await jwtVerify(token, secret())).payload;
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (!safeEqual(password, adminPassword())) return false;
  await setSession(ADMIN_COOKIE, { role: "admin" }, 7);
  return true;
}

export async function isAdmin(): Promise<boolean> {
  return (await readSession(ADMIN_COOKIE))?.role === "admin";
}

export async function logoutAdmin() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export function hashPin(pin: string): string {
  const salt = randomBytes(12).toString("hex");
  return `${salt}:${scryptSync(pin, salt, 32).toString("hex")}`;
}

export function verifyPin(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  return safeEqual(scryptSync(pin, salt, 32).toString("hex"), hash);
}

export async function loginStaff(businessId: string) {
  await setSession(STAFF_COOKIE, { biz: businessId }, 30);
}

/** Id del negocio para el que este dispositivo tiene sesión de personal. */
export async function staffBusinessId(): Promise<string | null> {
  const biz = (await readSession(STAFF_COOKIE))?.biz;
  return typeof biz === "string" ? biz : null;
}

export async function logoutStaff() {
  (await cookies()).delete(STAFF_COOKIE);
}

// Freno simple contra adivinar PIN o contraseña: 8 intentos por clave cada 10 min.
// Vive en memoria del proceso; suficiente para la demo.
const attempts = new Map<string, { n: number; until: number }>();
export function tooManyAttempts(key: string): boolean {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.until < now) {
    attempts.set(key, { n: 1, until: now + 10 * 60_000 });
    return false;
  }
  a.n += 1;
  return a.n > 8;
}
export function clearAttempts(key: string) {
  attempts.delete(key);
}
