// Crea las tablas en la base de datos de DATABASE_URL (Supabase).
import { readFileSync } from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Define DATABASE_URL antes de ejecutar este script.");
  process.exit(1);
}
const sql = postgres(url, { prepare: false, max: 1 });
await sql.unsafe(readFileSync(new URL("../src/db/schema.sql", import.meta.url), "utf8"));
await sql.end();
console.log("Esquema aplicado.");
