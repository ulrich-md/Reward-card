import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminBody, AdminHeader } from "@/components/admin";
import { Icon, Loading } from "@/components/ui";
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
    <>
      <AdminHeader>
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-mist hover:text-white">
          <Icon name="back" size={16} /> Negocios
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Nuevo negocio</h1>
        <p className="mt-1 text-sm text-mist">Define la tarjeta y mira a la vez cómo la verá el cliente.</p>
      </AdminHeader>
      <AdminBody>
        <NewBusinessForm />
      </AdminBody>
    </>
  );
}
