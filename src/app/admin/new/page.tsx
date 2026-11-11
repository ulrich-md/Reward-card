import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Loading, Phone, Sheet } from "@/components/ui";
import { isAdmin } from "@/lib/auth";
import { NewBusinessForm } from "./form";

export const metadata = { title: "Nuevo negocio · Reward Card" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <New />
    </Suspense>
  );
}

async function New() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <Phone wide>
      <header className="px-6 pb-7 pt-8">
        <Link href="/admin" className="text-sm font-medium text-mist">
          ← Negocios
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Nuevo negocio</h1>
      </header>
      <Sheet>
        <NewBusinessForm />
      </Sheet>
    </Phone>
  );
}
