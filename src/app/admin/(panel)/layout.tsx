import { Suspense } from "react";
import { adminLogoutAction } from "@/app/actions";
import { Glow, Icon } from "@/components/ui";
import { BottomNav, SideNav } from "./nav";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-dvh lg:flex">
      <Glow />
      <aside className="no-print sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/5 p-5 lg:flex">
        <p className="px-4 pb-8 pt-3 text-lg font-semibold tracking-tight">
          <span className="mr-2 inline-block size-3 rounded-full bg-cobalt" />
          Reward Card
        </p>
        <Suspense>
          <SideNav />
        </Suspense>
        <form action={adminLogoutAction} className="mt-auto">
          <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-mist hover:bg-coal hover:text-white">
            <Icon name="logout" size={18} />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="mx-auto flex min-h-dvh w-full min-w-0 max-w-md flex-col lg:max-w-6xl lg:px-10 lg:py-10">
        {children}
      </main>

      <Suspense>
        <BottomNav />
      </Suspense>
    </div>
  );
}
