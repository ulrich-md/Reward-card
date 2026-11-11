import Link from "next/link";
import { Icon, StampCard, brandStyle } from "@/components/ui";
import { ACCENT, CARD_COLORS, GRAPHITE, PAPER, STATUS, contrast, type Swatch } from "@/lib/palette";
import { inkOn } from "@/lib/util";

export const metadata = { title: "Paleta · Reward Card" };

const PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: "Texto blanco sobre Tinta", fg: "#ffffff", bg: "#0a0b0d" },
  { label: "Bruma sobre Tinta", fg: "#8b919c", bg: "#0a0b0d" },
  { label: "Bruma sobre Carbón", fg: "#8b919c", bg: "#131519" },
  { label: "Cobalto claro sobre Tinta", fg: "#94a6ff", bg: "#0a0b0d" },
  { label: "Blanco sobre Cobalto", fg: "#ffffff", bg: "#3355ff" },
  { label: "Tinta sobre Papel", fg: "#0a0b0d", bg: "#ffffff" },
  { label: "Piedra sobre Papel", fg: "#646972", bg: "#ffffff" },
  { label: "Piedra sobre Niebla", fg: "#646972", bg: "#f3f3f1" },
  { label: "Cobalto sobre Cobalto suave", fg: "#3355ff", bg: "#e9edff" },
  { label: "Tinta sobre Lima", fg: "#0a0b0d", bg: "#c8f169" },
  { label: "Correcto sobre su fondo", fg: "#0f7a4f", bg: "#e8f6ef" },
  { label: "Aviso sobre su fondo", fg: "#955600", bg: "#fff3dc" },
  { label: "Error sobre su fondo", fg: "#c2362b", bg: "#fdecea" },
];

function Swatches({ title, note, items }: { title: string; note: string; items: Swatch[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-mist">{note}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((s) => (
          <li key={s.token} className="overflow-hidden rounded-3xl bg-coal ring-1 ring-white/5">
            <div
              className="flex h-24 items-end p-3 text-xs font-semibold"
              style={{ background: s.hex, color: inkOn(s.hex) }}
            >
              <span className="tabular uppercase">{s.hex}</span>
            </div>
            <div className="p-3">
              <p className="font-semibold">{s.name}</p>
              <p className="font-mono text-xs text-mist">{s.token}</p>
              <p className="mt-2 text-xs leading-snug text-mist">{s.use}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-14 px-6 py-12 lg:px-10 lg:py-16">
      <header>
        <p className="text-sm font-medium text-mist">
          <span className="mr-2 inline-block size-2.5 rounded-full bg-cobalt" />
          Reward Card · Sistema de color
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight lg:text-6xl">Grafito y Cobalto</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mist">
          Una base neutra en dos mitades, oscura y clara, con un solo color de acento. El cobalto marca lo que se puede
          tocar o está activo; la lima aparece únicamente cuando hay un premio.
        </p>

        {/* Proporción de uso */}
        <div className="mt-8 flex h-16 overflow-hidden rounded-3xl text-xs font-semibold ring-1 ring-white/10">
          <div className="flex w-[34%] items-end bg-ink p-3">Grafito</div>
          <div className="flex w-[8%] items-end bg-coal p-3" />
          <div className="flex w-[8%] items-end bg-smoke p-3" />
          <div className="flex w-[30%] items-end bg-paper p-3 text-ink">Papel</div>
          <div className="flex w-[8%] items-end bg-fog p-3" />
          <div className="flex w-[9%] items-end bg-cobalt p-3">Cobalto</div>
          <div className="flex w-[3%] items-end bg-lime p-3" />
        </div>
        <p className="mt-2 text-sm text-mist">
          Proporción orientativa: neutros en casi toda la pantalla, cobalto en torno a una décima parte, lima como
          excepción.
        </p>
      </header>

      <Swatches
        title="Grafito"
        note="Superficies oscuras. Cada nivel es un poco más claro que el anterior: en oscuro la elevación se marca con luz, no con sombra."
        items={GRAPHITE}
      />
      <Swatches
        title="Papel"
        note="Superficies claras, con un gris ligeramente cálido para que el blanco no deslumbre."
        items={PAPER}
      />
      <Swatches
        title="Acento y premio"
        note="Un solo acento para la plataforma. La lima no es un segundo acento: tiene un único trabajo."
        items={ACCENT}
      />
      <Swatches title="Estados" note="Cada estado tiene un tono para el texto y un fondo suave a juego." items={STATUS} />

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Colores de tarjeta para los negocios</h2>
        <p className="mt-1 max-w-xl text-sm text-mist">
          Cada negocio elige uno. El texto y los sellos pasan solos a oscuro o claro según el color.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CARD_COLORS.map((c, i) => (
            <li key={c.hex} style={brandStyle(c.hex)}>
              <StampCard title={c.name} filled={3 + (i % 4)} total={8} emoji="☕" footer={c.hex.toUpperCase()} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">En uso</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="grid-texture space-y-5 rounded-[32px] bg-coal p-6 ring-1 ring-white/5">
            <p className="text-xs font-medium uppercase tracking-wide text-mist">Sobre oscuro</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn btn-accent">
                <Icon name="plus" size={18} /> Acción principal
              </button>
              <button className="btn btn-smoke">Secundaria</button>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-cobalt-300">
                Enlace <Icon name="chevron" size={16} />
              </span>
            </div>
            <div className="glass flex w-fit gap-1 rounded-full p-1.5">
              <span className="flex items-center gap-2 rounded-full bg-cobalt px-5 py-3 text-sm font-semibold">
                <Icon name="store" size={18} /> Activo
              </span>
              <span className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                <Icon name="plus" size={18} /> Inactivo
              </span>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink">
              <Icon name="gift" size={16} /> Tienes un café gratis por canjear
            </p>
          </div>

          <div className="sheet space-y-4 rounded-[32px] p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-stone">Sobre claro</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn btn-ink">Acción principal</button>
              <button className="btn btn-ghost">Secundaria</button>
              <span className="rounded-full bg-cobalt-soft px-3 py-1 text-xs font-semibold text-cobalt">Nuevo</span>
            </div>
            <input className="field" placeholder="Campo de texto" aria-label="Campo de ejemplo" />
            <p className="flex items-center gap-2 rounded-2xl bg-ok-soft px-4 py-3 text-sm font-medium text-ok">
              <Icon name="check" size={18} /> Sello añadido: 3 de 10
            </p>
            <p className="rounded-2xl bg-warn-soft px-4 py-3 text-sm font-medium text-warn">
              Esta tarjeta acaba de recibir un sello.
            </p>
            <p className="rounded-2xl bg-bad-soft px-4 py-3 text-sm font-medium text-bad">PIN incorrecto.</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Contraste</h2>
        <p className="mt-1 max-w-xl text-sm text-mist">
          Calculado con la fórmula de WCAG. El mínimo para texto normal es 4,5.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAIRS.map((p) => {
            const ratio = contrast(p.fg, p.bg);
            return (
              <li
                key={p.label}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ring-1 ring-white/10"
                style={{ background: p.bg, color: p.fg }}
              >
                <span className="text-sm font-medium">{p.label}</span>
                <span className="tabular shrink-0 text-sm font-semibold">
                  {ratio.toFixed(1).replace(".", ",")} {ratio >= 4.5 ? "✓" : "✗"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <Link href="/" className="btn btn-smoke">
        <Icon name="back" size={18} /> Volver al inicio
      </Link>
    </main>
  );
}
