import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, Hero, Loading, Phone, Sheet, StampCard, brandStyle } from "@/components/ui";
import { businessBySlug } from "@/lib/loyalty";
import { COUNTRIES, type Country } from "@/lib/util";
import { EnrollForm } from "./form";

type Props = { params: Promise<{ slug: string }> };

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Join params={params} />
    </Suspense>
  );
}

async function Join({ params }: Props) {
  const { slug } = await params;
  const business = await businessBySlug(slug);
  if (!business) notFound();
  const country = COUNTRIES[business.country as Country];

  return (
    <Phone style={brandStyle(business.color)}>
      <Hero>
        <div className="flex items-center gap-3">
          <Avatar emoji={business.emoji} />
          <span className="text-lg font-semibold">{business.name}</span>
        </div>
        <h1 className="mt-7 text-3xl font-semibold leading-tight tracking-tight text-balance lg:text-5xl">
          Junta {business.stampsRequired} sellos y llévate {business.rewardText}.
        </h1>
        <p className="mt-3 hidden text-lg text-mist lg:block">
          Tu tarjeta vive en tu teléfono: sin app y sin cartón que perder.
        </p>
        <div className="mt-6 lg:mt-10 lg:max-w-md">
          <StampCard
            title="Ejemplo de tarjeta"
            filled={1}
            total={business.stampsRequired}
            emoji={business.emoji}
            footer={`Al completar: ${business.rewardText}`}
          />
        </div>
      </Hero>

      <Sheet>
        <h2 className="text-xl font-semibold">Crea tu tarjeta</h2>
        <p className="mb-5 mt-1 text-sm text-stone">Tarda diez segundos y no necesitas descargar nada.</p>
        <EnrollForm slug={business.slug} businessName={business.name} dial={country.dial} example={country.example} />
      </Sheet>
    </Phone>
  );
}
