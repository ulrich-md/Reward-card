import { randomBytes, randomInt } from "node:crypto";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I/L

export function newCode(length = 8): string {
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return out;
}

export function newToken(): string {
  return randomBytes(18).toString("base64url");
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export const COUNTRIES = {
  CR: { name: "Costa Rica", dial: "506", digits: 8, example: "8888 8888" },
  MX: { name: "México", dial: "52", digits: 10, example: "55 1234 5678" },
} as const;
export type Country = keyof typeof COUNTRIES;

/** Devuelve el teléfono en formato E.164 o null si no es válido para el país. */
export function normalizePhone(raw: string, country: Country): string | null {
  const c = COUNTRIES[country];
  let d = raw.replace(/\D/g, "");
  if (d.length === c.digits + c.dial.length && d.startsWith(c.dial)) d = d.slice(c.dial.length);
  if (d.length !== c.digits) return null;
  return `+${c.dial}${d}`;
}

/** Extrae el código de tarjeta de lo que lea el escáner (código suelto o URL). */
export function parseScannedCode(raw: string): string | null {
  const last = raw.trim().split(/[/?#=]/).filter(Boolean).pop() ?? "";
  const code = last.toUpperCase();
  return /^[A-Z0-9]{6,12}$/.test(code) ? code : null;
}

/** Texto legible (oscuro o claro) sobre un color de marca. */
export function inkOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#0c0d0f";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4 ? "#0c0d0f" : "#ffffff";
}

export function isHexColor(v: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(v);
}
