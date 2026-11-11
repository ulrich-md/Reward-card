"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Negocios", icon: "store" },
  { href: "/admin/new", label: "Nuevo", icon: "plus" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname !== "/admin/new" : pathname === href;
}

export function SideNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Principal" className="space-y-1">
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
              active ? "bg-ink text-white" : "text-stone hover:bg-fog hover:text-ink"
            }`}
          >
            <Icon name={item.icon} size={18} />
            {item.label === "Nuevo" ? "Nuevo negocio" : item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Barra flotante de vidrio oscuro en móvil. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="glass-dark no-print fixed inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] z-20 mx-auto flex w-fit gap-1 rounded-full p-1.5 lg:hidden"
    >
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200 ${
              active ? "bg-white text-ink" : "text-white/80"
            }`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
