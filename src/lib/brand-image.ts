import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Ruta pública de una imagen de public/brand si el archivo existe, o null.
 * Se evalúa al compilar, así que tras añadir una imagen hay que volver a publicar.
 */
export function brandImage(file: string): string | null {
  return existsSync(path.join(process.cwd(), "public", "brand", file)) ? `/brand/${file}` : null;
}
