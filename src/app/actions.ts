"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, schema } from "@/db";
import type { Business, Member } from "@/db/schema";
import {
  clearAttempts,
  hashAccessCode,
  hashPin,
  isAdmin,
  loginAdmin,
  loginOwner,
  loginStaff,
  logoutAdmin,
  logoutOwner,
  logoutStaff,
  missingConfig,
  ownerBusinessId,
  staffBusinessId,
  tooManyAttempts,
  verifyPin,
} from "@/lib/auth";
import {
  addStamp,
  businessBySlug,
  couponsFor,
  enroll,
  findMember,
  redeemCoupon,
  redeemReward,
} from "@/lib/loyalty";
import { STAMPS } from "@/lib/stamps";
import { COUNTRIES, isHexColor, newCode, slugify } from "@/lib/util";
import { walletProvider } from "@/lib/wallet";

const { businesses, coupons, members } = schema;

export type FormState = { error?: string; ok?: string } | undefined;
export type AccessState = { error?: string; ok?: string; code?: string } | undefined;

async function clientKey(scope: string): Promise<string> {
  const h = await headers();
  return `${scope}:${h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local"}`;
}

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

// ───────────── Administración (agencia) ─────────────

/**
 * Entrada única. La misma casilla sirve para la agencia (su contraseña) y para
 * cada negocio (su código de acceso); según cuál sea, se abre un panel u otro.
 */
export async function accessAction(_: FormState, fd: FormData): Promise<FormState> {
  const problem = missingConfig();
  if (problem) return { error: problem };
  const key = await clientKey("access");
  if (tooManyAttempts(key)) return { error: "Demasiados intentos. Espera unos minutos." };
  const input = str(fd, "password");
  if (!input) return { error: "Escribe tu contraseña." };

  if (await loginAdmin(input)) {
    clearAttempts(key);
    redirect("/admin");
  }
  const db = await getDb();
  const [business] = await db
    .select({ id: businesses.id })
    .from(businesses)
    .where(eq(businesses.accessHash, hashAccessCode(input)))
    .limit(1);
  if (!business) return { error: "Contraseña incorrecta." };
  clearAttempts(key);
  await loginOwner(business.id);
  redirect("/panel");
}

export async function ownerLogoutAction() {
  await logoutOwner();
  redirect("/");
}

export async function adminLogoutAction() {
  await logoutAdmin();
  redirect("/");
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/");
}

/** El negocio, si quien llama es la agencia o el dueño de ese negocio. */
async function manageable(slug: string): Promise<Business | null> {
  const business = await businessBySlug(slug);
  if (!business) return null;
  if (await isAdmin()) return business;
  return (await ownerBusinessId()) === business.id ? business : null;
}

function refresh(slug: string) {
  revalidatePath(`/admin/${slug}`);
  revalidatePath("/panel");
}

export async function createBusinessAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(fd, "name");
  const country = str(fd, "country");
  const color = str(fd, "color");
  const icon = str(fd, "icon");
  const rewardText = str(fd, "rewardText");
  const stampsRequired = Number(str(fd, "stampsRequired"));
  const pin = str(fd, "pin");

  if (name.length < 2 || name.length > 60) return { error: "Escribe el nombre del negocio." };
  if (!(country in COUNTRIES)) return { error: "Elige el país." };
  if (!isHexColor(color)) return { error: "El color no es válido." };
  if (!(icon in STAMPS)) return { error: "Elige el sello de la tarjeta." };
  if (!Number.isInteger(stampsRequired) || stampsRequired < 2 || stampsRequired > 12)
    return { error: "Los sellos por tarjeta deben estar entre 2 y 12." };
  if (rewardText.length < 2 || rewardText.length > 80) return { error: "Describe la recompensa." };
  if (!/^\d{4,8}$/.test(pin)) return { error: "El PIN del personal debe tener de 4 a 8 dígitos." };

  const base = slugify(name);
  if (!base) return { error: "El nombre debe incluir letras o números." };
  const db = await getDb();
  // «new» y «login» son rutas del panel: un negocio con ese nombre quedaría inaccesible.
  const reserved = new Set(["new", "login"]);
  let slug = reserved.has(base) ? `${base}-1` : base;
  for (let i = 2; (await businessBySlug(slug)) !== null; i++) slug = `${base}-${i}`;

  await db
    .insert(businesses)
    .values({ slug, name, country, color, icon, stampsRequired, rewardText, pinHash: hashPin(pin) });
  redirect(`/admin/${slug}`);
}

export async function createCouponAction(slug: string, _: FormState, fd: FormData): Promise<FormState> {
  const business = await manageable(slug);
  if (!business) return { error: "No tienes acceso a este negocio." };
  const title = str(fd, "title");
  const description = str(fd, "description");
  const expires = str(fd, "expiresAt");
  if (title.length < 2 || title.length > 60) return { error: "Escribe el título del cupón." };
  if (description.length > 160) return { error: "La descripción es demasiado larga." };
  let expiresAt: Date | null = null;
  if (expires) {
    // Vence al final del día indicado (UTC-6, válido para Costa Rica y centro de México).
    expiresAt = new Date(`${expires}T23:59:59-06:00`);
    if (Number.isNaN(expiresAt.getTime())) return { error: "La fecha no es válida." };
    if (expiresAt.getTime() < Date.now()) return { error: "La fecha de vencimiento ya pasó." };
  }
  const db = await getDb();
  await db.insert(coupons).values({ businessId: business.id, title, description, expiresAt });
  refresh(slug);
  return { ok: "Cupón creado. Ya aparece en las tarjetas de los clientes." };
}

export async function toggleCouponAction(slug: string, couponId: string, active: boolean) {
  const business = await manageable(slug);
  if (!business) return;
  const db = await getDb();
  await db
    .update(coupons)
    .set({ active })
    .where(and(eq(coupons.id, couponId), eq(coupons.businessId, business.id)));
  refresh(slug);
}

export async function resetPinAction(slug: string, _: FormState, fd: FormData): Promise<FormState> {
  const business = await manageable(slug);
  if (!business) return { error: "No tienes acceso a este negocio." };
  const pin = str(fd, "pin");
  if (!/^\d{4,8}$/.test(pin)) return { error: "El PIN debe tener de 4 a 8 dígitos." };
  const db = await getDb();
  await db.update(businesses).set({ pinHash: hashPin(pin) }).where(eq(businesses.id, business.id));
  return { ok: "PIN actualizado." };
}

/**
 * Crea (o cambia) el código con el que entra el dueño del negocio. Solo lo
 * puede hacer la agencia. El código se muestra una vez: se guarda su huella.
 */
export async function regenerateAccessAction(slug: string): Promise<AccessState> {
  await requireAdmin();
  const business = await businessBySlug(slug);
  if (!business) return { error: "Negocio no encontrado." };
  const raw = newCode(12);
  const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
  const db = await getDb();
  await db.update(businesses).set({ accessHash: hashAccessCode(code) }).where(eq(businesses.id, business.id));
  refresh(slug);
  return { ok: "Código creado. Cópialo ahora: no se vuelve a mostrar.", code };
}

export async function activateWalletAction(slug: string): Promise<FormState> {
  await requireAdmin();
  const business = await businessBySlug(slug);
  if (!business) return { error: "Negocio no encontrado." };
  if (business.walletTemplateId) return { ok: "La tarjeta de Wallet ya está activa." };
  const provider = walletProvider();
  if (!provider) return { error: "Falta configurar la clave de Pass Studio (PASS_STUDIO_API_KEY)." };
  try {
    const templateId = await provider.createTemplate(business);
    const db = await getDb();
    await db.update(businesses).set({ walletTemplateId: templateId }).where(eq(businesses.id, business.id));
  } catch (err) {
    console.error("[wallet] crear plantilla falló:", err);
    return { error: `${provider.name} rechazó la solicitud. Revisa el registro del servidor.` };
  }
  revalidatePath(`/admin/${slug}`);
  return { ok: "Tarjeta de Wallet activada para los próximos clientes." };
}

// ───────────── Alta de clientes ─────────────

export async function enrollAction(slug: string, _: FormState, fd: FormData): Promise<FormState> {
  const business = await businessBySlug(slug);
  if (!business) return { error: "Este programa ya no está disponible." };
  if (fd.get("consent") !== "on") return { error: "Necesitamos tu autorización para crear la tarjeta." };
  const result = await enroll(business, str(fd, "name"), str(fd, "phone"));
  if (!result.ok) return { error: result.error };
  redirect(`/c/${result.member.token}`);
}

// ───────────── Personal del negocio (escáner) ─────────────

export async function staffLoginAction(slug: string, _: FormState, fd: FormData): Promise<FormState> {
  const business = await businessBySlug(slug);
  if (!business) return { error: "Negocio no encontrado." };
  const key = await clientKey(`pin:${business.id}`);
  if (tooManyAttempts(key)) return { error: "Demasiados intentos. Espera unos minutos." };
  if (!verifyPin(str(fd, "pin"), business.pinHash)) return { error: "PIN incorrecto." };
  clearAttempts(key);
  await loginStaff(business.id);
  redirect(`/s/${slug}`);
}

export async function staffLogoutAction(slug: string) {
  await logoutStaff();
  redirect(`/s/${slug}`);
}

export type MemberView = {
  id: string;
  name: string;
  phoneEnd: string;
  stamps: number;
  rewardsAvailable: number;
  coupons: { id: string; title: string; description: string; redeemed: boolean }[];
};
export type StaffResult =
  | { ok: true; member: MemberView; message?: string; rewardEarned?: boolean }
  | { ok: false; error: string };

async function staffBusiness(slug: string): Promise<Business | null> {
  const business = await businessBySlug(slug);
  if (!business || (await staffBusinessId()) !== business.id) return null;
  return business;
}

async function view(business: Business, m: Member): Promise<MemberView> {
  const list = await couponsFor(business.id, m.id);
  return {
    id: m.id,
    name: m.name,
    phoneEnd: m.phone.slice(-4),
    stamps: m.stamps,
    rewardsAvailable: m.rewardsAvailable,
    coupons: list.map((c) => ({ id: c.id, title: c.title, description: c.description, redeemed: c.redeemed })),
  };
}

const NO_SESSION: StaffResult = { ok: false, error: "La sesión caducó. Vuelve a entrar con el PIN." };

async function memberOf(business: Business, memberId: string): Promise<Member | null> {
  const db = await getDb();
  const [m] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.businessId, business.id)));
  return m ?? null;
}

export async function staffLookupAction(slug: string, query: string): Promise<StaffResult> {
  const business = await staffBusiness(slug);
  if (!business) return NO_SESSION;
  const member = await findMember(business, query);
  if (!member) return { ok: false, error: "No encontramos esa tarjeta en este negocio." };
  return { ok: true, member: await view(business, member) };
}

export async function staffStampAction(slug: string, memberId: string): Promise<StaffResult> {
  const business = await staffBusiness(slug);
  if (!business) return NO_SESSION;
  const result = await addStamp(business, memberId);
  if (!result.ok) return result;
  return {
    ok: true,
    member: await view(business, result.member),
    rewardEarned: result.rewardEarned,
    message: result.rewardEarned
      ? `¡Tarjeta completa! Ganó: ${business.rewardText}`
      : `Sello añadido: ${result.member.stamps} de ${business.stampsRequired}`,
  };
}

export async function staffRedeemRewardAction(slug: string, memberId: string): Promise<StaffResult> {
  const business = await staffBusiness(slug);
  if (!business) return NO_SESSION;
  const result = await redeemReward(business, memberId);
  if (!result.ok) return result;
  return {
    ok: true,
    member: await view(business, result.member),
    message: `Recompensa entregada: ${business.rewardText}`,
  };
}

export async function staffRedeemCouponAction(slug: string, memberId: string, couponId: string): Promise<StaffResult> {
  const business = await staffBusiness(slug);
  if (!business) return NO_SESSION;
  const result = await redeemCoupon(business, memberId, couponId);
  if (!result.ok) return result;
  const member = await memberOf(business, memberId);
  if (!member) return { ok: false, error: "Tarjeta no encontrada." };
  return { ok: true, member: await view(business, member), message: "Cupón canjeado." };
}
