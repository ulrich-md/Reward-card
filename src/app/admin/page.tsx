import { count, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { adminLogoutAction } from "@/app/actions";
import { Loading, Phone, Sheet } from "@/components/ui";
import { getDb, schema } from "@/db";
import { isAdmin } from "@/lib/auth";
import { COUNTRIES, inkOn, type Country } from "@/lib/util";

export const metadata = { title: "Negocios · Reward Card" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const db = await getDb();
  const { businesses, members } = schema;
  const rows = await db
    .select({
      business: businesses,
      members: count(members.id),
      stamps: sql<number>`coalesce(sum(${members.totalStamps}), 0)::int`,
    })
    .from(businesses)
    .leftJoin(members, eq(members.businessId, businesses.id))
    .groupBy(businesses.id)
    .orderBy(desc(businesses.createdAt));
  const totalMembers = rows.reduce((n, r) => n + r.members, 0);
  const totalStamps = rows.reduce((n, r) => n + r.stamps, 0);

  return (
    <Phone wide>
      <header className="px-6 pb-7 pt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-mist">Reward Card</p>
          <form action={adminLogoutAction}>
            <button className="btn btn-smoke btn-sm">Salir</button>
          </form>
        </div>
        <p className="mt-8 text-sm text-mist">Clientes con tarjeta</p>
        <p className="tabular mt-1 text-6xl font-semibold tracking-tight">{totalMembers.toLocaleString("es")}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-coal p-4">
            <p className="text-sm text-mist">Negocios</p>
            <p className="tabular mt-1 text-2xl font-semibold">{rows.length}</p>
          </div>
          <div className="rounded-3xl bg-coal p-4">
            <p className="text-sm text-mist">Sellos dados</p>
            <p className="tabular mt-1 text-2xl font-semibold">{totalStamps.toLocaleString("es")}</p>
          </div>
        </div>
      </header>

      <Sheet>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Negocios</h2>
          <Link href="/admin/new" className="btn btn-ink btn-sm">
            Nuevo negocio
          </Link>
        </div>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500">
            Todavía no hay negocios. Crea el primero para generar su tarjeta de sellos.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map(({ business: b, members: n, stamps }) => (
              <li key={b.id}>
                <Link href={`/admin/${b.slug}`} className="flex items-center gap-3 py-3">
                  <span
                    aria-hidden
                    className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
                    style={{ background: b.color, color: inkOn(b.color) }}
                  >
                    {b.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{b.name}</p>
                    <p className="text-sm text-neutral-500">
                      {COUNTRIES[b.country as Country]?.name} · {b.stampsRequired} sellos
                    </p>
                  </div>
                  <div className="tabular shrink-0 text-right">
                    <p className="font-semibold">{n} clientes</p>
                    <p className="text-sm text-neutral-500">{stamps} sellos</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Sheet>
    </Phone>
  );
}
