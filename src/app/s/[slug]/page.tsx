import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BrandMark, Hero, Loading, Phone, Sheet, brandStyle } from "@/components/ui";
import { staffBusinessId } from "@/lib/auth";
import { businessBySlug } from "@/lib/loyalty";
import { PinForm } from "./pin-form";
import { Scanner } from "./scanner";

type Props = { params: Promise<{ slug: string }> };

export const metadata = { title: "Escáner", robots: { index: false } };

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Staff params={params} />
    </Suspense>
  );
}

async function Staff({ params }: Props) {
  const { slug } = await params;
  const business = await businessBySlug(slug);
  if (!business) notFound();
  const signedIn = (await staffBusinessId()) === business.id;

  if (!signedIn) {
    return (
      <Phone style={brandStyle(business.color)}>
        <Hero>
          <BrandMark icon={business.icon} size={56} />
          <h1 className="mt-6 text-4xl font-medium leading-[1.05] lg:text-6xl">{business.name}</h1>
          <p className="eyebrow mt-3 text-white/55">Escáner del personal</p>
        </Hero>
        <Sheet>
          <p className="eyebrow text-stone">Acceso</p>
          <h2 className="mb-5 mt-1 text-2xl font-semibold">Entra con el PIN del local</h2>
          <PinForm slug={business.slug} />
        </Sheet>
      </Phone>
    );
  }

  return (
    <Phone style={brandStyle(business.color)}>
      <Scanner
        slug={business.slug}
        business={{
          name: business.name,
          icon: business.icon,
          stampsRequired: business.stampsRequired,
          rewardText: business.rewardText,
        }}
      />
    </Phone>
  );
}
