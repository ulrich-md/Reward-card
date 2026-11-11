import "server-only";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import type { Business, Coupon, Member } from "@/db/schema";
import { newCode, newToken, normalizePhone, type Country } from "./util";
import { walletProvider } from "./wallet";

const { businesses, members, coupons, couponRedemptions, events } = schema;

/** Segundos mínimos entre dos sellos a la misma tarjeta (evita el doble escaneo). */
const STAMP_COOLDOWN_S = 30;

export type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

export async function businessBySlug(slug: string): Promise<Business | null> {
  const db = await getDb();
  const [b] = await db.select().from(businesses).where(eq(businesses.slug, slug)).limit(1);
  return b ?? null;
}

export async function businessById(id: string): Promise<Business | null> {
  const db = await getDb();
  const [b] = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1);
  return b ?? null;
}

export async function memberByToken(token: string): Promise<Member | null> {
  const db = await getDb();
  const [m] = await db.select().from(members).where(eq(members.token, token)).limit(1);
  return m ?? null;
}

async function logEvent(businessId: string, memberId: string | null, type: string, detail?: string) {
  const db = await getDb();
  await db.insert(events).values({ businessId, memberId, type, detail });
}

/** La Wallet nunca debe impedir dar un sello: los fallos solo se registran. */
async function walletSync(business: Business, member: Member, change: { delta: number; message?: string }) {
  const provider = walletProvider();
  if (!provider || !member.walletInstanceId) return;
  try {
    await provider.sync(business, member, change);
  } catch (err) {
    console.error("[wallet] sync falló:", err);
  }
}

/** Alta de un cliente. Si el teléfono ya existe en el negocio, devuelve su tarjeta. */
export async function enroll(business: Business, rawName: string, rawPhone: string): Promise<Result<{ member: Member }>> {
  const name = rawName.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60) return { ok: false, error: "Escribe tu nombre." };
  const phone = normalizePhone(rawPhone, business.country as Country);
  if (!phone) return { ok: false, error: "Revisa el número de teléfono." };

  const db = await getDb();
  const existing = await db
    .select()
    .from(members)
    .where(and(eq(members.businessId, business.id), eq(members.phone, phone)))
    .limit(1);
  if (existing[0]) return { ok: true, member: existing[0] };

  const [created] = await db
    .insert(members)
    .values({ businessId: business.id, name, phone, code: newCode(), token: newToken() })
    .onConflictDoNothing()
    .returning();
  if (!created) {
    // Otra petición registró el mismo teléfono a la vez.
    const [again] = await db
      .select()
      .from(members)
      .where(and(eq(members.businessId, business.id), eq(members.phone, phone)))
      .limit(1);
    return again ? { ok: true, member: again } : { ok: false, error: "No se pudo crear la tarjeta. Inténtalo de nuevo." };
  }
  await logEvent(business.id, created.id, "enrolled");

  let member = created;
  const provider = walletProvider();
  if (provider && business.walletTemplateId) {
    try {
      const issued = await provider.issue(business, member);
      [member] = await db
        .update(members)
        .set({ walletInstanceId: issued.instanceId, walletUrl: issued.url })
        .where(eq(members.id, member.id))
        .returning();
    } catch (err) {
      console.error("[wallet] emisión falló:", err);
    }
  }
  return { ok: true, member };
}

/** Busca una tarjeta del negocio por código escaneado o por teléfono. */
export async function findMember(business: Business, query: string): Promise<Member | null> {
  const db = await getDb();
  const q = query.trim();
  const phone = normalizePhone(q, business.country as Country);
  const [m] = await db
    .select()
    .from(members)
    .where(
      and(
        eq(members.businessId, business.id),
        phone ? or(eq(members.phone, phone), eq(members.code, q.toUpperCase())) : eq(members.code, q.toUpperCase()),
      ),
    )
    .limit(1);
  return m ?? null;
}

export async function addStamp(
  business: Business,
  memberId: string,
): Promise<Result<{ member: Member; rewardEarned: boolean }>> {
  const db = await getDb();
  const completes = sql`${members.stamps} + 1 >= ${business.stampsRequired}`;
  const [updated] = await db
    .update(members)
    .set({
      stamps: sql`case when ${completes} then 0 else ${members.stamps} + 1 end`,
      rewardsAvailable: sql`${members.rewardsAvailable} + case when ${completes} then 1 else 0 end`,
      totalStamps: sql`${members.totalStamps} + 1`,
      lastStampAt: sql`now()`,
    })
    .where(
      and(
        eq(members.id, memberId),
        eq(members.businessId, business.id),
        or(
          isNull(members.lastStampAt),
          sql`${members.lastStampAt} < now() - make_interval(secs => ${STAMP_COOLDOWN_S})`,
        ),
      ),
    )
    .returning();

  if (!updated) {
    const [m] = await db
      .select({ id: members.id })
      .from(members)
      .where(and(eq(members.id, memberId), eq(members.businessId, business.id)));
    return {
      ok: false,
      error: m ? "Esta tarjeta acaba de recibir un sello. Espera unos segundos." : "Tarjeta no encontrada.",
    };
  }

  const rewardEarned = updated.stamps === 0;
  await logEvent(business.id, updated.id, "stamp");
  if (rewardEarned) await logEvent(business.id, updated.id, "reward_earned");
  await walletSync(business, updated, {
    delta: rewardEarned ? -(business.stampsRequired - 1) : 1,
    message: rewardEarned
      ? `¡Completaste tu tarjeta! Tienes: ${business.rewardText}`
      : `Nuevo sello: ${updated.stamps} de ${business.stampsRequired}`,
  });
  return { ok: true, member: updated, rewardEarned };
}

export async function redeemReward(business: Business, memberId: string): Promise<Result<{ member: Member }>> {
  const db = await getDb();
  const [updated] = await db
    .update(members)
    .set({ rewardsAvailable: sql`${members.rewardsAvailable} - 1` })
    .where(and(eq(members.id, memberId), eq(members.businessId, business.id), gt(members.rewardsAvailable, 0)))
    .returning();
  if (!updated) return { ok: false, error: "Esta tarjeta no tiene recompensas por canjear." };
  await logEvent(business.id, updated.id, "reward_redeemed", business.rewardText);
  await walletSync(business, updated, { delta: 0, message: `Recompensa canjeada: ${business.rewardText}` });
  return { ok: true, member: updated };
}

/** Cupones vigentes del negocio, con marca de si este cliente ya lo canjeó. */
export async function couponsFor(businessId: string, memberId: string): Promise<(Coupon & { redeemed: boolean })[]> {
  const db = await getDb();
  const rows = await db
    .select({ coupon: coupons, redeemedAt: couponRedemptions.redeemedAt })
    .from(coupons)
    .leftJoin(
      couponRedemptions,
      and(eq(couponRedemptions.couponId, coupons.id), eq(couponRedemptions.memberId, memberId)),
    )
    .where(
      and(
        eq(coupons.businessId, businessId),
        eq(coupons.active, true),
        or(isNull(coupons.expiresAt), sql`${coupons.expiresAt} > now()`),
      ),
    )
    .orderBy(desc(coupons.createdAt));
  return rows.map((r) => ({ ...r.coupon, redeemed: r.redeemedAt !== null }));
}

export async function redeemCoupon(business: Business, memberId: string, couponId: string): Promise<Result<object>> {
  const db = await getDb();
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(
      and(
        eq(coupons.id, couponId),
        eq(coupons.businessId, business.id),
        eq(coupons.active, true),
        or(isNull(coupons.expiresAt), sql`${coupons.expiresAt} > now()`),
      ),
    );
  if (!coupon) return { ok: false, error: "Este cupón ya no está disponible." };
  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberId), eq(members.businessId, business.id)));
  if (!member) return { ok: false, error: "Tarjeta no encontrada." };

  const inserted = await db.insert(couponRedemptions).values({ couponId, memberId }).onConflictDoNothing().returning();
  if (inserted.length === 0) return { ok: false, error: "Este cliente ya usó este cupón." };
  await logEvent(business.id, memberId, "coupon_redeemed", coupon.title);
  await walletSync(business, member, { delta: 0, message: `Cupón canjeado: ${coupon.title}` });
  return { ok: true };
}
