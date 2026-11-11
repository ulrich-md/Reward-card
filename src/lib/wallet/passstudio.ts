import "server-only";
import type { WalletProvider } from "./index";

// Integración con la API REST de Pass Studio, escrita a partir de su
// documentación pública. AÚN NO SE HA PROBADO contra la API real (hace falta
// una clave): los nombres de campo de `design` y el uso de /loyalty/points
// para el saldo de sellos hay que validarlos con la primera llamada.
const BASE = process.env.PASS_STUDIO_BASE_URL ?? "https://www.passstudio.online/api/v1";

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.PASS_STUDIO_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Pass Studio ${method} ${path} → ${res.status}: ${text.slice(0, 300)}`);
  return (text ? JSON.parse(text) : {}) as T;
}

export const passStudio: WalletProvider = {
  name: "Pass Studio",

  async createTemplate(business) {
    const out = await call<{ pass: { passId: string } }>("POST", "/passes", {
      name: business.name,
      passType: "loyalty",
      status: "active",
      distributionMode: "unique",
      clientRequestId: `business-${business.id}`,
      design: {
        organizationName: business.name,
        title: business.name,
        backgroundColor: business.color,
        stampGrid: { count: business.stampsRequired, stamp: business.emoji },
      },
    });
    return out.pass.passId;
  },

  async issue(business, member) {
    const out = await call<{ instanceId: string; addToWalletUrl: string }>(
      "POST",
      `/passes/${business.walletTemplateId}/issue`,
      { phone: member.phone, barcodeValue: member.code, sendEmail: false },
    );
    return { instanceId: out.instanceId, url: out.addToWalletUrl };
  },

  async sync(_business, member, change) {
    if (!member.walletInstanceId) return;
    if (change.delta !== 0) {
      await call("POST", "/loyalty/points", { instanceId: member.walletInstanceId, delta: change.delta });
    }
    if (change.message) {
      await call("PATCH", "/instances/fields", {
        instanceId: member.walletInstanceId,
        fields: {},
        message: change.message,
      });
    }
  },
};
