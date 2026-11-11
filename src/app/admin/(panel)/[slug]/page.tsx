import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminBody, AdminHeader, Empty, Panel, Stat } from "@/components/admin";
import { Avatar, Icon, Loading, brandStyle, type IconName } from "@/components/ui";
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

const EVENT_LABEL: Record<string, { icon: IconName; text: string; tone: string }> = {
  enrolled: { icon: "user", text: "Nueva tarjeta", tone: "bg-cobalt-soft text-cobalt" },
  stamp: { icon: "check", text: "Sello", tone: "bg-fog text-stone" },
  reward_earned: { icon: "star", text: "Tarjeta completa", tone: "bg-warn-soft text-warn" },
  reward_redeemed: { icon: "gift", text: "Recompensa entregada", tone: "bg-ok-soft text-ok" },
  coupon_redeemed: { icon: "tag", text: "Cupón canjeado", tone: "bg-cobalt-soft text-cobalt" },
};

const fmtTime = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Costa_Rica",
});
const fmtDay = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", timeZone: "America/Costa_Rica" });

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
      .where(
        and(
          eq(events.businessId, business.id),
          eq(events.type, "stamp"),
          gte(events.createdAt, sql`now() - interval '7 days'`),
        ),
      ),
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
    <div style={brandStyle(business.color)} className="flex flex-1 flex-col">
      <AdminHeader>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-mist hover:text-white">
          <Icon name="back" size={16} /> Negocios
        </Link>
        <div className="mt-5 flex items-center gap-4">
          <Avatar emoji={business.emoji} size={56} />
          <div className="min-w-0 leading-tight">
            <h1 className="truncate text-2xl font-semibold tracking-tight lg:text-3xl">{business.name}</h1>
            <p className="mt-1 text-sm text-mist">
              {business.stampsRequired} sellos → {business.rewardText}
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:mt-8 lg:grid-cols-4 lg:gap-4">
          <Stat label="Clientes con tarjeta" value={stats.members} />
          <Stat label="Sellos, últimos 7 días" value={week.n} />
          <Stat label="Sellos totales" value={stats.stamps} />
          <Stat label="Premios por entregar" value={stats.pending} />
        </div>
      </AdminHeader>

      <AdminBody>
        <div className="grid gap-9 lg:grid-cols-3 lg:items-start lg:gap-6">
        {/* Columna de acciones: primero en móvil, a la derecha en escritorio */}
        <div className="space-y-9 lg:col-start-3 lg:row-start-1 lg:space-y-6">
          <Panel
            title="Código para el mostrador"
            description="El cliente lo escanea con su cámara y crea su tarjeta."
          >
            <div
              role="img"
              aria-label="Código QR de alta"
              className="mx-auto w-44 rounded-3xl border border-line p-3 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <Link href={`/admin/${business.slug}/poster`} className="btn btn-ink btn-sm mt-4 w-full">
              <Icon name="printer" size={16} /> Imprimir cartel
            </Link>
            <div className="mt-4 space-y-3">
              <LinkRow label="Alta de clientes" url={joinUrl} />
              <LinkRow label="Escáner del personal (pide PIN)" url={staffUrl} />
            </div>
          </Panel>

          <Panel title="Cupones" description="Cada cliente puede usar un cupón una sola vez.">
            {couponList.length > 0 ? (
              <ul className="mb-5 divide-y divide-line">
                {couponList.map(({ coupon: c, expired }) => (
                  <li key={c.id} className="flex items-center gap-3 py-3">
                    <div className={`min-w-0 flex-1 ${c.active && !expired ? "" : "opacity-45"}`}>
                      <p className="truncate font-medium">{c.title}</p>
                      <p className="truncate text-sm text-stone">
                        {expired ? "Vencido" : c.expiresAt ? `Vence el ${fmtDay.format(c.expiresAt)}` : "Sin vencimiento"}
                        {c.description ? ` · ${c.description}` : ""}
                      </p>
                    </div>
                    <CouponToggle slug={business.slug} couponId={c.id} active={c.active} />
                  </li>
                ))}
              </ul>
            ) : null}
            <CouponForm slug={business.slug} />
          </Panel>

          <Panel title="Apple Wallet y Google Wallet">
            {business.walletTemplateId ? (
              <p className="text-sm text-stone">
                Activa con {provider?.name ?? "el proveedor"}. Los clientes nuevos reciben el botón «Añadir a mi
                Wallet».
              </p>
            ) : provider ? (
              <>
                <p className="mb-4 text-sm text-stone">
                  Publica el diseño de esta tarjeta en {provider.name} para que los clientes nuevos puedan guardarla
                  en su Wallet. Consume créditos de tu cuenta.
                </p>
                <WalletButton slug={business.slug} />
              </>
            ) : (
              <p className="text-sm text-stone">
                Sin configurar. Por ahora los clientes usan su tarjeta web; al añadir la clave de Pass Studio
                aparecerá aquí el botón para activarla.
              </p>
            )}
          </Panel>

          <Panel title="PIN del personal" description="Cámbialo si un empleado deja el negocio.">
            <PinResetForm slug={business.slug} />
          </Panel>
        </div>

        <div className="space-y-9 lg:col-span-2 lg:row-start-1 lg:space-y-6">
          <Panel title="Actividad reciente">
            {recent.length === 0 ? (
              <Empty>Aquí aparecerán los sellos y canjes del negocio.</Empty>
            ) : (
              <ul className="divide-y divide-line">
                {recent.map((e) => {
                  const label = EVENT_LABEL[e.type] ?? { icon: "check" as const, text: e.type, tone: "bg-fog" };
                  return (
                    <li key={e.id} className="flex items-center gap-3 py-3">
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${label.tone}`}>
                        <Icon name={label.icon} size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{e.name ?? "Cliente"}</p>
                        <p className="truncate text-sm text-stone">
                          {label.text}
                          {e.detail ? ` · ${e.detail}` : ""}
                        </p>
                      </div>
                      <time className="tabular shrink-0 text-sm text-stone">{fmtTime.format(e.at)}</time>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Clientes"
            description={
              stats.members > memberList.length ? `Se muestran los ${memberList.length} más recientes.` : undefined
            }
          >
            {memberList.length === 0 ? (
              <Empty>Todavía nadie ha creado su tarjeta. Imprime el cartel y ponlo en caja.</Empty>
            ) : (
              <ul className="divide-y divide-line">
                {memberList.map((m) => (
                  <li key={m.id} className="flex items-center gap-3 py-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fog text-sm font-semibold uppercase text-stone">
                      {m.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{m.name}</p>
                      <p className="tabular text-sm text-stone">{m.phone}</p>
                    </div>
                    {m.rewardsAvailable > 0 ? (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">
                        <Icon name="gift" size={14} /> {m.rewardsAvailable}
                      </span>
                    ) : null}
                    <div className="w-24 shrink-0">
                      <p className="tabular text-right text-sm font-semibold">
                        {m.stamps} / {business.stampsRequired}
                      </p>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-fog">
                        <div
                          className="h-full rounded-full bg-ink"
                          style={{ width: `${(m.stamps / business.stampsRequired) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
        </div>
      </AdminBody>
    </div>
  );
}

function LinkRow({ label, url }: { label: string; url: string }) {
  return (
    <div className="rounded-2xl bg-fog p-3">
      <p className="text-xs font-medium text-stone">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <a href={url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium underline">
          {url.replace(/^https?:\/\//, "")}
        </a>
        <CopyButton text={url} />
      </div>
    </div>
  );
}
