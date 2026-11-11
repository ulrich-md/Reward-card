import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Avatar, Loading, Phone, Sheet, brandStyle } from "@/components/ui";
import { getDb, schema } from "@/db";
import { isAdmin } from "@/lib/auth";
import { businessBySlug } from "@/lib/loyalty";
import { qrSvg } from "@/lib/qr";
import { walletProvider } from "@/lib/wallet";
import { CopyButton, CouponForm, CouponToggle, PinResetForm, WalletButton } from "./forms";

type Props = { params: Promise<{ slug: string }> };

export const metadata = { title: "Negocio · Reward Card" };

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Detail params={params} />
    </Suspense>
  );
}

const EVENT_LABEL: Record<string, { icon: string; text: string }> = {
  enrolled: { icon: "👋", text: "Nueva tarjeta" },
  stamp: { icon: "✔️", text: "Sello" },
  reward_earned: { icon: "🎉", text: "Tarjeta completa" },
  reward_redeemed: { icon: "🎁", text: "Recompensa entregada" },
  coupon_redeemed: { icon: "🏷️", text: "Cupón canjeado" },
};

const fmtTime = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Costa_Rica",
});

async function Detail({ params }: Props) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const business = await businessBySlug(slug);
  if (!business) notFound();

  const db = await getDb();
  const { members, events, coupons } = schema;
  const [[stats], [week], couponList, recent, memberList] = await Promise.all([
    db
      .select({
        members: count(),
        stamps: sql<number>`coalesce(sum(${members.totalStamps}), 0)::int`,
        pending: sql<number>`coalesce(sum(${members.rewardsAvailable}), 0)::int`,
      })
      .from(members)
      .where(eq(members.businessId, business.id)),
    db
      .select({ n: count() })
      .from(events)
      .where(and(eq(events.businessId, business.id), eq(events.type, "stamp"), gte(events.createdAt, sql`now() - interval '7 days'`))),
    db
      .select({ coupon: coupons, expired: sql<boolean>`coalesce(${coupons.expiresAt} < now(), false)` })
      .from(coupons)
      .where(eq(coupons.businessId, business.id))
      .orderBy(desc(coupons.createdAt)),
    db
      .select({ id: events.id, type: events.type, detail: events.detail, at: events.createdAt, name: members.name })
      .from(events)
      .leftJoin(members, eq(members.id, events.memberId))
      .where(eq(events.businessId, business.id))
      .orderBy(desc(events.createdAt))
      .limit(12),
    db.select().from(members).where(eq(members.businessId, business.id)).orderBy(desc(members.createdAt)).limit(50),
  ]);

  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const joinUrl = `${origin}/j/${business.slug}`;
  const staffUrl = `${origin}/s/${business.slug}`;
  const qr = await qrSvg(joinUrl);
  const provider = walletProvider();

  return (
    <Phone wide style={brandStyle(business.color)}>
      <header className="px-6 pb-7 pt-8">
        <Link href="/admin" className="text-sm font-medium text-mist">
          ← Negocios
        </Link>
        <div className="mt-5 flex items-center gap-3">
          <Avatar emoji={business.emoji} size={52} />
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-2xl font-semibold tracking-tight">{business.name}</h1>
            <p className="text-sm text-mist">
              {business.stampsRequired} sellos → {business.rewardText}
            </p>
          </div>
        </div>
        <p className="mt-7 text-sm text-mist">Clientes con tarjeta</p>
        <p className="tabular mt-1 text-6xl font-semibold tracking-tight">{stats.members}</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            ["Sellos (7 días)", week.n],
            ["Sellos totales", stats.stamps],
            ["Premios por entregar", stats.pending],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-coal p-4">
              <p className="text-xs text-mist">{label}</p>
              <p className="tabular mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </header>

      <Sheet className="space-y-9">
        <section>
          <h2 className="text-lg font-semibold">Código para el mostrador</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Imprímelo y ponlo en caja. El cliente lo escanea con su cámara y crea su tarjeta.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div
              role="img"
              aria-label="Código QR de alta"
              className="w-40 shrink-0 rounded-3xl border border-line p-3 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <div className="w-full min-w-0 space-y-3">
              <LinkRow label="Alta de clientes" url={joinUrl} />
              <LinkRow label="Escáner del personal (pide PIN)" url={staffUrl} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Cupones</h2>
          <p className="mb-4 mt-1 text-sm text-neutral-500">
            Cada cliente puede usar un cupón una sola vez. Aparecen en su tarjeta al instante.
          </p>
          {couponList.length > 0 ? (
            <ul className="mb-5 divide-y divide-line">
              {couponList.map(({ coupon: c, expired }) => {
                return (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    <div className={`min-w-0 flex-1 ${c.active && !expired ? "" : "opacity-45"}`}>
                      <p className="font-medium">{c.title}</p>
                      <p className="truncate text-sm text-neutral-500">
                        {expired
                          ? "Vencido"
                          : c.expiresAt
                            ? `Vence el ${c.expiresAt.toLocaleDateString("es", { day: "numeric", month: "long", timeZone: "America/Costa_Rica" })}`
                            : "Sin vencimiento"}
                        {c.description ? ` · ${c.description}` : ""}
                      </p>
                    </div>
                    <CouponToggle slug={business.slug} couponId={c.id} active={c.active} />
                  </li>
                );
              })}
            </ul>
          ) : null}
          <CouponForm slug={business.slug} />
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold">Actividad reciente</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-neutral-500">Aquí aparecerán los sellos y canjes del negocio.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((e) => {
                const label = EVENT_LABEL[e.type] ?? { icon: "•", text: e.type };
                return (
                  <li key={e.id} className="flex items-center gap-3 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fog">{label.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{e.name ?? "Cliente"}</p>
                      <p className="truncate text-sm text-neutral-500">
                        {label.text}
                        {e.detail ? ` · ${e.detail}` : ""}
                      </p>
                    </div>
                    <time className="tabular shrink-0 text-sm text-neutral-500">{fmtTime.format(e.at)}</time>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold">Clientes</h2>
          {memberList.length === 0 ? (
            <p className="text-sm text-neutral-500">Todavía nadie ha creado su tarjeta.</p>
          ) : (
            <ul className="divide-y divide-line">
              {memberList.map((m) => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="tabular text-sm text-neutral-500">{m.phone}</p>
                  </div>
                  <p className="tabular shrink-0 text-right font-semibold">
                    {m.stamps} / {business.stampsRequired}
                    {m.rewardsAvailable > 0 ? <span className="ml-2">🎁 {m.rewardsAvailable}</span> : null}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {stats.members > memberList.length ? (
            <p className="mt-2 text-sm text-neutral-500">Se muestran los {memberList.length} más recientes.</p>
          ) : null}
        </section>

        <section>
          <h2 className="text-lg font-semibold">Apple Wallet y Google Wallet</h2>
          {business.walletTemplateId ? (
            <p className="mt-1 text-sm text-neutral-500">
              Activa con {provider?.name ?? "el proveedor"}. Los clientes nuevos reciben el botón «Añadir a mi Wallet».
            </p>
          ) : provider ? (
            <>
              <p className="mb-4 mt-1 text-sm text-neutral-500">
                Publica el diseño de esta tarjeta en {provider.name} para que los clientes nuevos puedan guardarla en
                su Wallet. Consume créditos de tu cuenta.
              </p>
              <WalletButton slug={business.slug} />
            </>
          ) : (
            <p className="mt-1 text-sm text-neutral-500">
              Sin configurar. Por ahora los clientes usan su tarjeta web; al añadir la clave de Pass Studio aparecerá
              aquí el botón para activarla.
            </p>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Cambiar el PIN del personal</h2>
          <PinResetForm slug={business.slug} />
        </section>
      </Sheet>
    </Phone>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="rounded-2xl bg-fog p-3">
      <p className="text-xs font-medium text-neutral-500">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <a href={url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium underline">
          {url.replace(/^https?:\/\//, "")}
        </a>
        <CopyButton text={url} />
      </div>
    </div>
  );
}
