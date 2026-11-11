import type { CSSProperties, ReactNode } from "react";
import { inkOn } from "@/lib/util";

/** Variables CSS de marca para un negocio. */
export function brandStyle(color: string): CSSProperties {
  return { "--accent": color, "--on-accent": inkOn(color) } as CSSProperties;
}

/** Resplandor suave con el color de marca detrás del contenido. */
export function Glow() {
  return (
    <div
      aria-hidden
      className="no-print pointer-events-none fixed -top-48 left-1/2 -z-10 size-[560px] -translate-x-1/4 rounded-full bg-accent opacity-[0.13] blur-[130px]"
    />
  );
}

/**
 * Marco de las pantallas públicas. En móvil: cabecera oscura y hoja blanca
 * debajo. En escritorio: dos columnas, con la hoja como tarjeta a la derecha.
 */
export function Phone({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={style}
      className="relative isolate mx-auto flex min-h-dvh w-full max-w-md flex-col lg:max-w-5xl lg:flex-row lg:items-center lg:gap-14 lg:px-10 lg:py-12"
    >
      <Glow />
      {children}
    </div>
  );
}

export function Hero({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <header className={`px-6 pb-7 pt-8 lg:min-w-0 lg:flex-1 lg:p-0 ${className}`}>{children}</header>;
}

export function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sheet flex-1 px-5 pb-10 pt-3 lg:w-[440px] lg:flex-none lg:p-8 ${className}`}>
      <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line lg:hidden" />
      {children}
    </div>
  );
}

export function Avatar({ emoji, size = 44 }: { emoji: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-on-accent"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {emoji}
    </span>
  );
}

export function StampGrid({
  filled,
  total,
  emoji,
  highlight,
}: {
  filled: number;
  total: number;
  emoji: string;
  /** Índice del sello recién añadido, para animarlo. */
  highlight?: number;
}) {
  const cols = total <= 6 ? total : Math.ceil(total / 2);
  return (
    <div
      role="img"
      aria-label={`${filled} de ${total} sellos`}
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`flex aspect-square max-h-20 items-center justify-center justify-self-center rounded-full text-lg ${
            i < filled
              ? `bg-on-accent text-accent ${highlight === i ? "pop" : ""}`
              : "border-2 border-dashed border-on-accent/30"
          }`}
          style={{ width: "100%" }}
        >
          {i < filled ? <span className="scale-90">{emoji}</span> : null}
        </span>
      ))}
    </div>
  );
}

/** Tarjeta de sellos con el color de la marca. */
export function StampCard({
  title,
  filled,
  total,
  emoji,
  footer,
  highlight,
}: {
  title?: string;
  filled: number;
  total: number;
  emoji: string;
  footer?: ReactNode;
  highlight?: number;
}) {
  return (
    <div className="rounded-[28px] bg-accent p-5 text-on-accent shadow-[0_24px_60px_-28px_var(--accent)] lg:p-6">
      {title ? (
        <div className="mb-4 flex items-baseline justify-between gap-3 text-sm font-semibold">
          <span className="truncate">{title}</span>
          <span className="tabular shrink-0">
            {filled} / {total}
          </span>
        </div>
      ) : null}
      <StampGrid filled={filled} total={total} emoji={emoji} highlight={highlight} />
      {footer ? <p className="mt-4 text-sm font-medium opacity-75">{footer}</p> : null}
    </div>
  );
}

export function Loading() {
  return (
    <div role="status" aria-label="Cargando" className="mx-auto w-full max-w-md space-y-4 px-6 pt-10 lg:max-w-5xl">
      <div className="skeleton h-12 w-48" />
      <div className="skeleton h-24 w-64" />
      <div className="skeleton h-44 w-full max-w-md" />
    </div>
  );
}

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {children}
    </p>
  );
}

const ICONS = {
  store: "M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3 1.3 3 3 3 3-1.3 3-3 1.3 3 3 3 3-1.3 3-3M9 20v-5h6v5",
  plus: "M12 5v14M5 12h14",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  check: "M20 6L9 17l-5-5",
  gift: "M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H8.5a2.5 2.5 0 110-5C11 2 12 7 12 7zM12 7h3.5a2.5 2.5 0 100-5C13 2 12 7 12 7z",
  tag: "M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8zM7 7h.01",
  user: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6",
  star: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z",
  back: "M19 12H5M12 19l-7-7 7-7",
  printer: "M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z",
  scan: "M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2M7 12h10",
  chevron: "M9 18l6-6-6-6",
} as const;
export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d={ICONS[name]} />
    </svg>
  );
}
