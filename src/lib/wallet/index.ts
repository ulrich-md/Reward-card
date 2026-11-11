import "server-only";
import type { Business, Member } from "@/db/schema";
import { passStudio } from "./passstudio";

/**
 * Capa de emisión de tarjetas de Wallet. Hoy hay un proveedor (Pass Studio,
 * para la demo). Para pasar a Google Wallet directo y a certificado propio de
 * Apple basta con añadir otro proveedor que cumpla esta interfaz.
 */
export interface WalletProvider {
  name: string;
  /** Crea y publica el diseño de tarjeta del negocio. Devuelve su id. */
  createTemplate(business: Business): Promise<string>;
  /** Emite la tarjeta de un cliente. Devuelve el enlace "Añadir a Wallet". */
  issue(business: Business, member: Member): Promise<{ instanceId: string; url: string }>;
  /** Refleja en la tarjeta un cambio de saldo, con aviso opcional al cliente. */
  sync(business: Business, member: Member, change: { delta: number; message?: string }): Promise<void>;
}

export function walletProvider(): WalletProvider | null {
  return process.env.PASS_STUDIO_API_KEY ? passStudio : null;
}
