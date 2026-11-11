import type { CSSProperties, ReactNode } from "react";
import { inkOn } from "@/lib/util";

/** Variables CSS de marca para un negocio. */
export function brandStyle(color: string): CSSProperties {
  return { "--accent": color, "--on-accent": inkOn(color) } as CSSProperties;
}

/** Columna centrada de ancho de móvil; el fondo oscuro ocupa toda la pantalla. */
export function Phone({ children, style, wide }: { children: ReactNode; style?: CSSProperties; wide?: boolean }) {
  return (
    <div style={style} className={`mx-auto flex min-h-dvh w-full flex-col ${wide ? "max-w-2xl" : "max-w-md"}`}>
      {children}
    </div>
  );
}

export function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sheet flex-1 px-5 pb-10 pt-3 ${className}`}>
      <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />
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
          className={`flex aspect-square items-center justify-center rounded-full text-lg ${
            i < filled
              ? `bg-on-accent text-accent ${highlight === i ? "pop" : ""}`
              : "border-2 border-dashed border-on-accent/30"
          }`}
        >
          {i < filled ? <span className="scale-90">{emoji}</span> : null}
        </span>
      ))}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-mist" role="status">
      Cargando…
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
