import { count, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { adminLogoutAction } from "@/app/actions";
import { AdminBody, AdminHeader, Panel, Stat } from "@/components/admin";
import { BrandMark, Icon, Loading, Wordmark, brandStyle } from "@/components/ui";
import { getDb, schema } from "@/db";
import { isAdmin } from "@/lib/auth";
import { COUNTRIES, type Country } from "@/lib/util";

export const metadata = { title: "Negocios · Reward Card" };

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  if (!(await isAdmin())) redirect("/");
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
          <Wordmark />
          <form action={adminLogoutAction}>
            <button className="btn btn-glass btn-sm">Salir</button>
          </form>
        </div>
        <div className="mt-8 flex items-end justify-between gap-4 lg:mt-0">
          <div>
            <p className="eyebrow text-white/55">Resumen</p>
            <h1 className="mt-2 text-4xl font-medium leading-[1.05] lg:text-5xl">
              Tus <span className="em">negocios</span>
            </h1>
          </div>
          <Link href="/admin/new" className="btn btn-white hidden lg:inline-flex">
            <Icon name="plus" size={18} /> Nuevo negocio
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-3 gap-2.5 lg:mt-9 lg:gap-4">
          <Stat label="Clientes" value={totalMembers.toLocaleString("es")} />
          <Stat label="Negocios" value={rows.length} />
          <Stat label="Sellos" value={totalStamps.toLocaleString("es")} />
        </div>
      </AdminHeader>

      <AdminBody>
        <Panel title="Programas activos">
          {rows.length === 0 ? (
            <div className="rounded-2xl bg-fog px-6 py-10 text-center">
              <p className="font-display text-lg font-semibold">Crea tu primer negocio</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-stone">
                Define su tarjeta de sellos y obtén el código para el mostrador en menos de un minuto.
              </p>
              <Link href="/admin/new" className="btn btn-ink mt-5">
                <Icon name="plus" size={18} /> Nuevo negocio
              </Link>
            </div>
          ) : (
            <>
              <div className="eyebrow hidden grid-cols-[1fr_140px_100px_100px_20px] gap-4 px-3.5 pb-2 text-stone lg:grid">
                <span>Negocio</span>
                <span>País</span>
                <span className="text-right">Clientes</span>
                <span className="text-right">Sellos</span>
                <span />
              </div>
              <ul className="space-y-2">
                {rows.map(({ business: b, members: n, stamps }) => (
                  <li key={b.id} style={brandStyle(b.color)}>
                    <Link
                      href={`/admin/${b.slug}`}
                      className="row transition-colors duration-200 hover:bg-line/70 lg:grid lg:grid-cols-[1fr_140px_100px_100px_20px] lg:gap-4"
                    >
                      <span className="flex min-w-0 flex-1 items-center gap-3">
                        <BrandMark icon={b.icon} />
                        <span className="min-w-0">
                          <span className="block truncate font-display font-semibold">{b.name}</span>
                          <span className="block truncate text-sm text-stone">
                            {b.stampsRequired} sellos · {b.rewardText}
                          </span>
                        </span>
                      </span>
                      <span className="hidden text-sm text-stone lg:block">{COUNTRIES[b.country as Country]?.name}</span>
                      <span className="tabular shrink-0 text-right">
                        <span className="font-display font-semibold">{n}</span>
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
