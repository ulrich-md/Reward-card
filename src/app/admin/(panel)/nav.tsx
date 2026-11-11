"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/admin", label: "Negocios", icon: "store" },
  { href: "/admin/new", label: "Nuevo negocio", icon: "plus" },
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
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
              active ? "bg-cobalt text-white" : "text-mist hover:bg-coal hover:text-white"
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

/** Barra flotante inferior en móvil. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Principal"
      className="no-print fixed inset-x-0 bottom-5 z-20 mx-auto flex w-fit gap-1 rounded-full p-1.5 shadow-2xl glass lg:hidden"
    >
      {ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${
              active ? "bg-cobalt text-white" : "text-white"
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
