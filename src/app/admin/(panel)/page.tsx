import { count, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { adminLogoutAction } from "@/app/actions";
import { AdminBody, AdminHeader, Panel, Stat } from "@/components/admin";
import { Icon, Loading } from "@/components/ui";
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
    <>
      <AdminHeader>
        <div className="flex items-center justify-between lg:hidden">
          <p className="text-sm font-medium text-mist">Reward Card</p>
          <form action={adminLogoutAction}>
            <button className="btn btn-smoke btn-sm">Salir</button>
          </form>
        </div>
        <div className="mt-8 flex items-end justify-between lg:mt-0">
          <div>
            <h1 className="hidden text-3xl font-semibold tracking-tight lg:block">Negocios</h1>
            <p className="text-sm text-mist lg:mt-1">
              <span className="lg:hidden">Clientes con tarjeta</span>
              <span className="hidden lg:inline">Resumen de todos los programas que gestionas</span>
            </p>
            <p className="tabular mt-1 text-6xl font-semibold tracking-tight lg:hidden">
              {totalMembers.toLocaleString("es")}
            </p>
          </div>
          <Link href="/admin/new" className="btn btn-accent hidden lg:inline-flex">
            <Icon name="plus" size={18} /> Nuevo negocio
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:mt-8 lg:grid-cols-3 lg:gap-4">
          <div className="hidden lg:block">
            <Stat label="Clientes con tarjeta" value={totalMembers.toLocaleString("es")} />
          </div>
          <Stat label="Negocios" value={rows.length} />
          <Stat label="Sellos dados" value={totalStamps.toLocaleString("es")} />
        </div>
      </AdminHeader>

      <AdminBody>
        <Panel title="Tus negocios">
          {rows.length === 0 ? (
            <div className="rounded-3xl bg-fog px-6 py-10 text-center">
              <p className="text-lg font-semibold">Crea tu primer negocio</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-stone">
                Define su tarjeta de sellos y obtén el código QR para el mostrador en menos de un minuto.
              </p>
              <Link href="/admin/new" className="btn btn-ink mt-5">
                <Icon name="plus" size={18} /> Nuevo negocio
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[1fr_140px_120px_100px_24px] gap-4 border-b border-line pb-2 text-xs font-medium uppercase tracking-wide text-stone lg:grid">
                <span>Negocio</span>
                <span>País</span>
                <span className="text-right">Clientes</span>
                <span className="text-right">Sellos</span>
                <span />
              </div>
              <ul className="divide-y divide-line">
                {rows.map(({ business: b, members: n, stamps }) => (
                  <li key={b.id}>
                    <Link
                      href={`/admin/${b.slug}`}
                      className="-mx-2 flex items-center gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-fog lg:grid lg:grid-cols-[1fr_140px_120px_100px_24px] lg:gap-4"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <span
                          aria-hidden
                          className="flex size-11 shrink-0 items-center justify-center rounded-full text-xl"
                          style={{ background: b.color, color: inkOn(b.color) }}
                        >
                          {b.emoji}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{b.name}</span>
                          <span className="block truncate text-sm text-stone">
                            <span className="lg:hidden">{COUNTRIES[b.country as Country]?.name} · </span>
                            {b.stampsRequired} sellos → {b.rewardText}
                          </span>
                        </span>
                      </span>
                      <span className="hidden text-sm text-stone lg:block">
                        {COUNTRIES[b.country as Country]?.name}
                      </span>
                      <span className="tabular shrink-0 text-right">
                        <span className="font-semibold">{n}</span>
                        <span className="text-sm text-stone lg:hidden"> clientes</span>
                      </span>
                      <span className="tabular hidden text-right text-stone lg:block">{stamps}</span>
                      <Icon name="chevron" size={18} className="hidden text-stone lg:block" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Panel>
      </AdminBody>
    </>
  );
}
