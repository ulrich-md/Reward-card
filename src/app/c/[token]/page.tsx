import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/auto-refresh";
import { Avatar, Hero, Icon, Loading, Phone, Sheet, StampCard, brandStyle } from "@/components/ui";
import { businessById, couponsFor, memberByToken } from "@/lib/loyalty";
import { qrSvg } from "@/lib/qr";

type Props = { params: Promise<{ token: string }> };

export const metadata = { title: "Mi tarjeta", robots: { index: false } };

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Card params={params} />
    </Suspense>
  );
}

async function Card({ params }: Props) {
  const { token } = await params;
  const member = await memberByToken(token);
  if (!member) notFound();
  const business = await businessById(member.businessId);
  if (!business) notFound();
  const [coupons, qr] = await Promise.all([couponsFor(business.id, member.id), qrSvg(member.code)]);
  const left = business.stampsRequired - member.stamps;
  const firstName = member.name.split(" ")[0];

  return (
    <Phone style={brandStyle(business.color)}>
      <AutoRefresh />
      <Hero>
        <div className="flex items-center gap-3">
          <Avatar emoji={business.emoji} />
          <div className="leading-tight">
            <p className="font-semibold">{business.name}</p>
            <p className="text-sm text-mist">Hola, {firstName}</p>
          </div>
        </div>

        <p className="mt-8 text-sm text-mist lg:mt-12">Tus sellos</p>
        <p className="tabular mt-1 text-6xl font-semibold tracking-tight lg:text-8xl">
          {member.stamps}
          <span className="text-3xl text-mist lg:text-4xl"> / {business.stampsRequired}</span>
        </p>

        {member.rewardsAvailable > 0 ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink">
            <Icon name="gift" size={16} />
            {member.rewardsAvailable === 1 ? "Tienes" : `Tienes ${member.rewardsAvailable} ×`} {business.rewardText} por
            canjear
          </p>
        ) : null}

        <div className="mt-6 lg:mt-8 lg:max-w-md">
          <StampCard
            filled={member.stamps}
            total={business.stampsRequired}
            emoji={business.emoji}
            footer={`${left === 1 ? "Te falta 1 sello" : `Te faltan ${left} sellos`} para ${business.rewardText}`}
          />
        </div>
      </Hero>

      <Sheet>
        <div className="flex flex-col items-center">
          <div
            role="img"
            aria-label="Código QR de tu tarjeta"
            className="w-52 rounded-3xl border border-line p-4 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <p className="tabular mt-3 font-mono text-lg font-semibold tracking-[0.2em]">{member.code}</p>
          <p className="mt-1 text-sm text-neutral-500">Muestra este código en caja para recibir tu sello</p>
          {member.walletUrl ? (
            <a href={member.walletUrl} className="btn btn-ink mt-5 w-full">
              Añadir a mi Wallet
            </a>
          ) : (
            <p className="mt-4 rounded-2xl bg-fog px-4 py-3 text-center text-sm text-neutral-600">
              Guarda esta página en tu pantalla de inicio para tener tu tarjeta siempre a mano.
            </p>
          )}
        </div>

        <h2 className="mb-2 mt-8 text-lg font-semibold">Cupones</h2>
        {coupons.length === 0 ? (
          <p className="text-sm text-neutral-500">Aquí verás las promociones de {business.name}.</p>
        ) : (
          <ul className="divide-y divide-line">
            {coupons.map((c) => (
              <li key={c.id} className={`flex items-center gap-3 py-3 ${c.redeemed ? "opacity-45" : ""}`}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-fog">
                  <Icon name="tag" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{c.title}</p>
                  <p className="truncate text-sm text-neutral-500">
                    {c.description ||
                      (c.expiresAt ? `Válido hasta el ${c.expiresAt.toLocaleDateString("es", { day: "numeric", month: "long", timeZone: "America/Costa_Rica" })}` : "Sin fecha de vencimiento")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    c.redeemed ? "bg-fog text-neutral-500" : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {c.redeemed ? "Usado" : "Disponible"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Sheet>
    </Phone>
  );
}
