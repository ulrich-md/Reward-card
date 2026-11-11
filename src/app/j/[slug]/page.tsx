import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrandMark, Hero, Loading, Phone, Sheet, StampCard, brandStyle } from "@/components/ui";
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
          <BrandMark icon={business.icon} />
          <span className="font-display text-lg font-semibold">{business.name}</span>
        </div>
        <h1 className="mt-8 text-4xl font-medium leading-[1.05] text-balance lg:mt-14 lg:text-6xl">
          Junta {business.stampsRequired} sellos y llévate <span className="em">{business.rewardText}</span>.
        </h1>
        <p className="mt-4 hidden text-lg text-white/65 lg:block">
          Tu tarjeta vive en tu teléfono: sin app y sin cartón que perder.
        </p>
        <div className="mt-7 lg:mt-12 lg:max-w-md">
          <StampCard
            title="Ejemplo de tarjeta"
            filled={1}
            total={business.stampsRequired}
            icon={business.icon}
            footer={`Al completar: ${business.rewardText}`}
          />
        </div>
      </Hero>

      <Sheet>
        <p className="eyebrow text-stone">Diez segundos</p>
        <h2 className="mt-1 text-2xl font-semibold">Crea tu tarjeta</h2>
        <p className="mb-5 mt-1 text-sm text-stone">No necesitas descargar nada.</p>
        <EnrollForm slug={business.slug} businessName={business.name} dial={country.dial} example={country.example} />
      </Sheet>
    </Phone>
  );
}
