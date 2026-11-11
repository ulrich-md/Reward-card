import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Poster } from "@/components/poster";
import { Loading } from "@/components/ui";
import { ownerBusinessId } from "@/lib/auth";
import { businessById } from "@/lib/loyalty";

export const metadata = { title: "Cartel · Reward Card", robots: { index: false } };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const id = await ownerBusinessId();
  const business = id ? await businessById(id) : null;
  if (!business) redirect("/");
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col lg:max-w-6xl lg:p-6">
      <Poster business={business} backHref="/panel" />
    </main>
  );
}
