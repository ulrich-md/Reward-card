import { Suspense } from "react";
import { adminLogoutAction } from "@/app/actions";
import { Icon, Wordmark } from "@/components/ui";
import { BottomNav, SideNav } from "./nav";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh lg:flex lg:gap-6 lg:p-6">
      <aside className="card no-print sticky top-6 hidden h-[calc(100dvh-48px)] w-64 shrink-0 flex-col !p-4 lg:flex">
        <Wordmark className="px-3 pb-7 pt-3" />
        <Suspense>
          <SideNav />
        </Suspense>
        <form action={adminLogoutAction} className="mt-auto">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-stone transition-colors duration-200 hover:bg-fog hover:text-ink">
            <Icon name="logout" size={18} />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="mx-auto flex min-h-dvh w-full min-w-0 max-w-md flex-col lg:min-h-0 lg:max-w-none lg:flex-1">
        {children}
      </main>

      <Suspense>
        <BottomNav />
      </Suspense>
    </div>
  );
}
