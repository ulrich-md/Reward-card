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
  return drizzle(client, { schema });
}

export async function getDb(): Promise<Db> {
  // Los datos son siempre por petición: nunca se leen al prerenderizar.
  await connection();
  return (globalForDb.__rcDb ??= create());
}

export { schema };
