import type { ReactNode } from "react";

export function AdminHeader({ children }: { children: ReactNode }) {
  return <header className="px-6 pb-7 pt-8 lg:px-0 lg:pb-8 lg:pt-0">{children}</header>;
}

export function AdminBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`admin-body ${className}`}>
      <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line lg:hidden" />
      {children}
    </div>
  );
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
    <section className="panel">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-3xl bg-coal p-4 lg:p-6">
      <p className="text-xs text-mist lg:text-sm">{label}</p>
      <p className="tabular mt-1 text-2xl font-semibold lg:mt-2 lg:text-4xl">{value}</p>
      {hint ? <p className="mt-1 hidden text-sm text-mist lg:block">{hint}</p> : null}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-fog px-4 py-6 text-center text-sm text-neutral-500">{children}</p>;
}
