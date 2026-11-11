import type { ReactNode } from "react";

/** Cabecera del panel: panel oscuro con título y cifras. */
export function AdminHeader({ children }: { children: ReactNode }) {
  return (
    <header className="hero rounded-b-[36px] px-6 pb-7 pt-7 lg:rounded-[36px] lg:p-10">{children}</header>
  );
}

export function AdminBody({ children }: { children: ReactNode }) {
  return <div className="flex-1 space-y-4 px-4 pb-32 pt-4 lg:space-y-6 lg:px-0 lg:pb-0 lg:pt-6">{children}</div>;
}

export function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-stone">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Cifra dentro del panel oscuro, sobre vidrio. */
export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="glass rounded-3xl p-4 lg:p-5">
      <p className="eyebrow text-white/60">{label}</p>
      <p className="figure mt-2 text-3xl lg:text-5xl">{value}</p>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-fog px-4 py-6 text-center text-sm text-stone">{children}</p>;
}
