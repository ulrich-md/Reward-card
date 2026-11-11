import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Poster } from "@/components/poster";
import { Loading } from "@/components/ui";
import { isAdmin } from "@/lib/auth";
import { businessBySlug } from "@/lib/loyalty";

type Props = { params: Promise<{ slug: string }> };

export const metadata = { title: "Cartel · Reward Card" };

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: Props) {
  if (!(await isAdmin())) redirect("/");
  const { slug } = await params;
  const business = await businessBySlug(slug);
  if (!business) notFound();
  return <Poster business={business} backHref={`/admin/${business.slug}`} />;
}
