import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AutoRefresh } from "@/components/auto-refresh";
import { BrandMark, Content, Hero, Icon, IconBubble, Loading, Phone, StampCard, brandStyle } from "@/components/ui";
import { businessById, couponsFor, memberByToken } from "@/lib/loyalty";
import { qrSvg } from "@/lib/qr";

type Props = { params: Promise<{ token: string }> };

export const metadata = { title: "Mi tarjeta", robots: { index: false } };

const fmtDay = new Intl.DateTimeFormat("es", { day: "numeric", month: "long", timeZone: "America/Costa_Rica" });

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
          <BrandMark icon={business.icon} />
          <div className="leading-tight">
            <p className="font-display font-semibold">{business.name}</p>
            <p className="text-sm text-white/60">Hola, {firstName}</p>
          </div>
        </div>

        <div className="mt-9 text-center lg:mt-14 lg:text-left">
          <p className="eyebrow text-white/55">Tus sellos</p>
          <p className="figure mt-2 text-[5.5rem] lg:text-[9rem]">
            {member.stamps}
            <span className="text-4xl text-white/40 lg:text-6xl"> / {business.stampsRequired}</span>
          </p>
          {member.rewardsAvailable > 0 ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink">
              <Icon name="gift" size={16} />
              {member.rewardsAvailable === 1 ? "Tienes" : `Tienes ${member.rewardsAvailable} ×`} {business.rewardText}{" "}
              por canjear
            </p>
          ) : (
            <p className="mt-3 text-white/65">
              {left === 1 ? "Te falta 1 sello" : `Te faltan ${left} sellos`} para{" "}
              <span className="em text-lg text-white">{business.rewardText}</span>
            </p>
          )}
        </div>

        <div className="mt-8 lg:mt-12 lg:max-w-md">
          <StampCard
            title="Tarjeta de sellos"
            filled={member.stamps}
            total={business.stampsRequired}
            icon={business.icon}
            footer={`Al completar: ${business.rewardText}`}
          />
        </div>
      </Hero>

      <Content>
        <section className="card flex flex-col items-center text-center">
          <p className="eyebrow text-stone">Tu código</p>
          <div
            role="img"
            aria-label="Código QR de tu tarjeta"
            className="mt-4 w-48 rounded-2xl bg-white p-4 shadow-[0_0_0_1px_rgb(10_11_13/0.08)] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <p className="tabular mt-4 font-mono text-lg font-semibold tracking-[0.25em]">{member.code}</p>
          <p className="mt-1 text-sm text-stone">Muéstralo en caja para recibir tu sello</p>
          {member.walletUrl ? (
            <a href={member.walletUrl} className="btn btn-ink mt-5 w-full">
              <Icon name="wallet" size={18} /> Añadir a mi Wallet
            </a>
          ) : (
            <p className="mt-4 w-full rounded-2xl bg-fog px-4 py-3 text-sm text-stone">
              Guarda esta página en tu pantalla de inicio para tenerla siempre a mano.
            </p>
          )}
        </section>

        <section className="card">
          <p className="eyebrow mb-3 text-stone">Cupones</p>
          {coupons.length === 0 ? (
            <p className="text-sm text-stone">Aquí verás las promociones de {business.name}.</p>
          ) : (
            <ul className="space-y-2">
              {coupons.map((c) => (
                <li key={c.id} className={`row ${c.redeemed ? "opacity-55" : ""}`}>
                  <IconBubble name="tag" tone="bg-white text-ink shadow-[0_0_0_1px_rgb(10_11_13/0.06)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.title}</p>
                    <p className="truncate text-sm text-stone">
                      {c.description ||
                        (c.expiresAt ? `Válido hasta el ${fmtDay.format(c.expiresAt)}` : "Sin fecha de vencimiento")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      c.redeemed ? "bg-line text-stone" : "bg-ok-soft text-ok"
                    }`}
                  >
                    {c.redeemed ? "Usado" : "Disponible"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Content>
    </Phone>
  );
}
