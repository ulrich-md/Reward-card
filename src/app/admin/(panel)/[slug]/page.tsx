import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { BusinessDashboard } from "@/components/business-dashboard";
import { Loading } from "@/components/ui";
import { isAdmin } from "@/lib/auth";
import { businessBySlug } from "@/lib/loyalty";

type Props = { params: Promise<{ slug: string }> };

export const metadata = { title: "Negocio · Reward Card" };

export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({ params }: Props) {
  if (!(await isAdmin())) redirect("/");
  const { slug } = await params;
  const business = await businessBySlug(slug);
  if (!business) notFound();
  return <BusinessDashboard business={business} mode="agency" />;
}
