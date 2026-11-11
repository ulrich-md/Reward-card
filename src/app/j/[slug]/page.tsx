import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, Loading, Phone, Sheet, StampGrid, brandStyle } from "@/components/ui";
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
      <header className="px-6 pb-7 pt-8">
        <div className="flex items-center gap-3">
          <Avatar emoji={business.emoji} />
          <span className="text-lg font-semibold">{business.name}</span>
        </div>
        <h1 className="mt-7 text-3xl font-semibold leading-tight tracking-tight">
          Junta {business.stampsRequired} sellos y llévate {business.rewardText}.
        </h1>
        <div className="mt-6 rounded-[28px] bg-accent p-5 text-on-accent">
          <StampGrid filled={1} total={business.stampsRequired} emoji={business.emoji} />
        </div>
      </header>

      <Sheet>
        <h2 className="text-xl font-semibold">Crea tu tarjeta</h2>
        <p className="mb-5 mt-1 text-sm text-neutral-500">Tarda diez segundos y no necesitas descargar nada.</p>
        <EnrollForm slug={business.slug} businessName={business.name} dial={country.dial} example={country.example} />
      </Sheet>
    </Phone>
  );
}
