import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Avatar, Loading, Phone, Sheet, brandStyle } from "@/components/ui";
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
        <header className="px-6 pb-8 pt-10">
          <Avatar emoji={business.emoji} size={56} />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">{business.name}</h1>
          <p className="mt-1 text-mist">Escáner del personal</p>
        </header>
        <Sheet>
          <h2 className="mb-4 text-xl font-semibold">Entra con el PIN del local</h2>
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
          emoji: business.emoji,
          stampsRequired: business.stampsRequired,
          rewardText: business.rewardText,
        }}
      />
    </Phone>
  );
}
