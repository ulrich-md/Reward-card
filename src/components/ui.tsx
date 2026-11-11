import {
  ArrowLeft,
  Check,
  ChevronRight,
  Gift,
  LogOut,
  Plus,
  Printer,
  QrCode,
  ScanLine,
  Star,
  Store,
  Tag,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { StampIcon } from "@/lib/stamps";
import { inkOn } from "@/lib/util";

/** Variables CSS de marca para un negocio. */
export function brandStyle(color: string): CSSProperties {
  return { "--accent": color, "--on-accent": inkOn(color) } as CSSProperties;
}

/**
 * Marco de las pantallas públicas sobre fondo claro. En móvil: panel oscuro
 * arriba y tarjetas debajo. En escritorio: panel a la izquierda y tarjetas a
 * la derecha.
 */
export function Phone({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={style}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col lg:max-w-6xl lg:flex-row lg:items-stretch lg:gap-6 lg:p-6"
    >
      {children}
    </div>
  );
}

/** Panel oscuro destacado, con grano y brillo del color de marca. */
export function Hero({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <header
      className={`hero rounded-b-[40px] px-6 pb-9 pt-7 lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:justify-center lg:rounded-[40px] lg:p-14 ${className}`}
    >
      {children}
    </header>
  );
}

/** Columna de contenido claro junto al panel. */
export function Content({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex-1 space-y-4 px-4 pb-10 pt-4 lg:w-[460px] lg:flex-none lg:self-center lg:p-0 ${className}`}>
      {children}
    </div>
  );
}

/** Contenido en una sola tarjeta blanca. */
export function Sheet({ children }: { children: ReactNode }) {
  return (
    <Content>
      <div className="card">{children}</div>
    </Content>
  );
}

/** Marca del negocio: su sello dentro de un círculo con su color. */
export function BrandMark({ icon, size = 44 }: { icon: string; size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-accent text-on-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.35)]"
      style={{ width: size, height: size }}
    >
      <StampIcon name={icon} size={Math.round(size * 0.46)} />
    </span>
  );
}

/** Marca de la plataforma. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-[15px] font-semibold tracking-tight ${className}`}>
      <span aria-hidden className="flex size-6 items-center justify-center rounded-lg bg-cobalt text-white">
        <Check size={14} strokeWidth={3} />
      </span>
      Reward Card
    </span>
  );
}

export function StampGrid({
  filled,
  total,
  icon,
  highlight,
}: {
  filled: number;
  total: number;
  icon: string;
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
          className={`flex aspect-square w-full max-w-16 items-center justify-center justify-self-center rounded-full ${
            i < filled
              ? `bg-on-accent text-accent ${highlight === i ? "pop" : ""}`
              : "border border-dashed border-on-accent/40"
          }`}
        >
          {i < filled ? (
            <StampIcon name={icon} size={20} />
          ) : (
            <span className="font-mono text-[11px] font-medium opacity-45">{i + 1}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/** Tarjeta de sellos con forma de pase: color de marca, muescas y pie punteado. */
export function StampCard({
  title,
  filled,
  total,
  icon,
  footer,
  highlight,
}: {
  title: string;
  filled: number;
  total: number;
  icon: string;
  footer: ReactNode;
  highlight?: number;
}) {
  return (
    <div style={{ filter: "drop-shadow(0 20px 28px color-mix(in srgb, var(--accent, #3355ff) 30%, transparent))" }}>
      <div className="pass rounded-[28px] bg-accent text-on-accent">
        <div className="p-5 pb-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="eyebrow truncate opacity-80">{title}</span>
            <span className="tabular shrink-0 font-display text-sm font-semibold">
              {filled} / {total}
            </span>
          </div>
          <StampGrid filled={filled} total={total} icon={icon} highlight={highlight} />
        </div>
        <div className="flex h-[58px] items-center border-t border-dashed border-on-accent/35 px-5">
          <p className="truncate text-sm font-medium">{footer}</p>
        </div>
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div role="status" aria-label="Cargando" className="mx-auto w-full max-w-md space-y-4 p-4 lg:max-w-6xl lg:p-6">
      <div className="skeleton h-72 w-full rounded-[40px]" />
      <div className="skeleton h-40 w-full rounded-[28px]" />
    </div>
  );
}

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-2xl bg-bad-soft px-4 py-3 text-sm font-medium text-bad">
      {children}
    </p>
  );
}

const ICONS = {
  store: Store,
  plus: Plus,
  logout: LogOut,
  check: Check,
  gift: Gift,
  tag: Tag,
  user: UserPlus,
  star: Star,
  back: ArrowLeft,
  printer: Printer,
  scan: ScanLine,
  chevron: ChevronRight,
  qr: QrCode,
  wallet: Wallet,
} satisfies Record<string, LucideIcon>;
export type IconName = keyof typeof ICONS;

/** Iconos de interfaz: un solo juego, mismo trazo en toda la app. */
export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  const Cmp = ICONS[name];
  return <Cmp aria-hidden size={size} strokeWidth={1.75} className={`shrink-0 ${className}`} />;
}

/** Icono dentro de un círculo, para filas de lista. */
export function IconBubble({ name, tone = "bg-fog text-ink" }: { name: IconName; tone?: string }) {
  return (
    <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${tone}`}>
      <Icon name={name} size={18} />
    </span>
  );
}
