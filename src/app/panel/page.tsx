import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BusinessDashboard } from "@/components/business-dashboard";
import { Loading } from "@/components/ui";
import { ownerBusinessId } from "@/lib/auth";
import { businessById } from "@/lib/loyalty";

export const metadata = { title: "Mi negocio · Reward Card", robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Owner />
    </Suspense>
  );
}

async function Owner() {
  const id = await ownerBusinessId();
  const business = id ? await businessById(id) : null;
  if (!business) redirect("/");
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col lg:max-w-6xl lg:p-6">
      <BusinessDashboard business={business} mode="owner" />
    </main>
  );
}
