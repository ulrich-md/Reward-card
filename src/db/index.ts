import "server-only";
import { readFileSync } from "node:fs";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { connection } from "next/server";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import * as schema from "./schema";

// Con DATABASE_URL se usa Postgres (Supabase). Sin ella, una base local
// embebida (PGlite) en .data/ para desarrollar y enseñar la demo sin cuentas.
export type Db = PgliteDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { __rcDb?: Promise<Db> };

async function create(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: postgres } = await import("postgres");
    const { drizzle } = await import("drizzle-orm/postgres-js");
    // prepare:false es necesario con el pooler de Supabase en modo transacción.
    const client = postgres(url, { prepare: false, max: 5 });
    return drizzle(client, { schema }) as unknown as Db;
  }
  if (process.env.VERCEL) {
    throw new Error("Falta DATABASE_URL: en producción se necesita la base de datos de Supabase.");
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const dir = path.join(process.cwd(), ".data", "pglite");
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  await client.exec(readFileSync(path.join(process.cwd(), "src/db/schema.sql"), "utf8"));
  const db = drizzle(client, { schema });
  await seedDemo(db);
  return db;
}

/**
 * Negocio de prueba para la base local (nunca se crea en Supabase). Sus
 * credenciales son públicas a propósito: código DEMO-CAFE-2026 y PIN 1234.
 */
async function seedDemo(db: Db) {
  const existing = await db.select({ id: schema.businesses.id }).from(schema.businesses).limit(1);
  if (existing.length > 0) return;
  const { hashAccessCode, hashPin } = await import("@/lib/auth");
  await db.insert(schema.businesses).values({
    slug: "cafe-demo",
    name: "Café Demo",
    country: "CR",
    color: "#ffd84d",
    icon: "coffee",
    stampsRequired: 8,
    rewardText: "un café gratis",
    pinHash: hashPin("1234"),
    accessHash: hashAccessCode("DEMO-CAFE-2026"),
  });
}

export async function getDb(): Promise<Db> {
  // Los datos son siempre por petición: nunca se leen al prerenderizar.
  await connection();
  return (globalForDb.__rcDb ??= create());
}

export { schema };
