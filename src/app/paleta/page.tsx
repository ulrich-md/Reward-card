import Link from "next/link";
import { Icon, StampCard, Wordmark, brandStyle } from "@/components/ui";
import { ACCENT, CARD_COLORS, GRAPHITE, PAPER, STATUS, contrast, type Swatch } from "@/lib/palette";
import { inkOn } from "@/lib/util";

export const metadata = { title: "Paleta · Reward Card" };

const PAIRS: { label: string; fg: string; bg: string }[] = [
  { label: "Tinta sobre Niebla", fg: "#0a0b0d", bg: "#f1f1ee" },
  { label: "Tinta sobre Papel", fg: "#0a0b0d", bg: "#ffffff" },
  { label: "Piedra sobre Papel", fg: "#646972", bg: "#ffffff" },
  { label: "Piedra sobre Niebla", fg: "#646972", bg: "#f1f1ee" },
  { label: "Cobalto sobre Papel", fg: "#3355ff", bg: "#ffffff" },
  { label: "Cobalto sobre Cobalto suave", fg: "#3355ff", bg: "#e9edff" },
  { label: "Blanco sobre Tinta", fg: "#ffffff", bg: "#0a0b0d" },
  { label: "Bruma sobre Tinta", fg: "#8b919c", bg: "#0a0b0d" },
  { label: "Blanco sobre Cobalto", fg: "#ffffff", bg: "#3355ff" },
  { label: "Tinta sobre Lima", fg: "#0a0b0d", bg: "#c8f169" },
  { label: "Correcto sobre su fondo", fg: "#0f7a4f", bg: "#e8f6ef" },
  { label: "Aviso sobre su fondo", fg: "#955600", bg: "#fff3dc" },
  { label: "Error sobre su fondo", fg: "#c2362b", bg: "#fdecea" },
];

function Swatches({ title, note, items }: { title: string; note: string; items: Swatch[] }) {
  return (
    <section>
      <h2 className="text-2xl font-medium">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-stone">{note}</p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((s) => (
          <li key={s.token} className="card overflow-hidden !p-0">
            <div className="flex h-24 items-end p-3" style={{ background: s.hex, color: inkOn(s.hex) }}>
              <span className="font-mono text-xs font-medium uppercase">{s.hex}</span>
            </div>
            <div className="p-4">
              <p className="font-display font-semibold">{s.name}</p>
              <p className="font-mono text-xs text-stone">{s.token}</p>
              <p className="mt-2 text-xs leading-snug text-stone">{s.use}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-14 p-4 pb-16 lg:p-6 lg:pb-20">
      <header className="hero rounded-[24px] p-7 lg:rounded-[24px] lg:p-14">
        <Wordmark />
        <p className="eyebrow mt-10 text-white/55 lg:mt-16">Sistema de color</p>
        <h1 className="mt-2 text-5xl font-medium leading-[1.02] lg:text-7xl">
          Grafito y <span className="em">Cobalto</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 lg:text-lg">
          Fondo claro, paneles de grafito para lo importante y un solo acento. El cobalto marca enlaces e insignias; la
          lima aparece únicamente cuando hay un premio.
        </p>

        <div className="mt-9 flex h-14 overflow-hidden rounded-2xl font-mono text-[11px] font-medium uppercase tracking-wider shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]">
          <div className="flex w-[46%] items-end bg-fog p-2.5 text-ink">Niebla</div>
          <div className="flex w-[16%] items-end bg-paper p-2.5 text-ink">Papel</div>
          <div className="flex w-[26%] items-end bg-ink p-2.5">Tinta</div>
          <div className="flex w-[9%] items-end bg-cobalt p-2.5" />
          <div className="flex w-[3%] items-end bg-lime p-2.5" />
        </div>
        <p className="mt-2 text-sm text-white/55">
          Proporción orientativa: claros en la mayor parte, grafito en los paneles, cobalto y lima como excepción.
        </p>
      </header>

      <Swatches
        title="Papel"
        note="La base. Un gris cálido de fondo y blanco para las tarjetas, que se separan con una sombra muy leve."
        items={PAPER}
      />
      <Swatches
        title="Grafito"
        note="Negro suavizado para paneles, texto y el botón principal. Los paneles llevan degradado y grano para no verse planos."
        items={GRAPHITE}
      />
      <Swatches
        title="Acento y premio"
        note="Un solo acento para la plataforma. La lima no es un segundo acento: tiene un único trabajo."
        items={ACCENT}
      />
      <Swatches title="Estados" note="Cada estado tiene un tono para el texto y un fondo suave a juego." items={STATUS} />

      <section>
        <h2 className="text-2xl font-medium">Colores de tarjeta para los negocios</h2>
        <p className="mt-1 max-w-xl text-sm text-stone">
          Cada negocio elige uno. El texto y los sellos pasan solos a oscuro o claro según el color.
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARD_COLORS.map((c, i) => (
            <li key={c.hex} style={brandStyle(c.hex)}>
              <StampCard title={c.name} filled={3 + (i % 4)} total={8} icon="coffee" footer={c.hex.toUpperCase()} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-medium">Tipografía</h2>
        <p className="mt-1 max-w-xl text-sm text-stone">Cuatro voces, cada una con un papel.</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="card">
            <p className="eyebrow text-stone">Bricolage Grotesque · titulares y cifras</p>
            <p className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight">Junta diez sellos</p>
            <p className="figure mt-3 text-7xl">7 / 10</p>
          </div>
          <div className="card">
            <p className="eyebrow text-stone">Instrument Serif · énfasis</p>
            <p className="mt-3 font-display text-4xl font-medium leading-tight tracking-tight">
              y llévate <span className="em">un café gratis</span>
            </p>
            <p className="eyebrow mt-6 text-stone">Hanken Grotesk · interfaz</p>
            <p className="mt-2 text-base leading-relaxed">
              Muestra tu tarjeta en caja en cada visita. El personal la escanea y el sello aparece al instante.
            </p>
            <p className="eyebrow mt-6 text-stone">JetBrains Mono · datos</p>
            <p className="mt-2 font-mono text-sm tracking-[0.2em]">SE92HGJK · 11 NOV, 12:11</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-medium">En uso</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="card space-y-4">
            <p className="eyebrow text-stone">Sobre claro</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn btn-ink">
                <Icon name="plus" size={18} /> Acción principal
              </button>
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

          <div className="hero space-y-5 rounded-[20px] p-6">
            <p className="eyebrow text-white/55">Sobre un panel</p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn btn-white">Acción principal</button>
              <button className="btn btn-glass">Vidrio</button>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-cobalt-300">
                Enlace <Icon name="chevron" size={16} />
              </span>
            </div>
            <div className="glass-dark flex w-fit gap-1 rounded-full p-1.5">
              <span className="flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink">
                <Icon name="store" size={18} /> Activo
              </span>
              <span className="flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-white/80">
                <Icon name="plus" size={18} /> Inactivo
              </span>
            </div>
            <div className="glass w-fit rounded-2xl p-4">
              <p className="eyebrow text-white/60">Clientes</p>
              <p className="figure mt-2 text-4xl">128</p>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink">
              <Icon name="gift" size={16} /> Tienes un café gratis por canjear
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-medium">Contraste</h2>
        <p className="mt-1 max-w-xl text-sm text-stone">
          Calculado con la fórmula de WCAG. El mínimo para texto normal es 4,5.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PAIRS.map((p) => {
            const ratio = contrast(p.fg, p.bg);
            return (
              <li
                key={p.label}
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-[0_0_0_1px_rgb(10_11_13/0.08)]"
                style={{ background: p.bg, color: p.fg }}
              >
                <span className="text-sm font-medium">{p.label}</span>
                <span className="shrink-0 font-mono text-sm font-medium">
                  {ratio.toFixed(1).replace(".", ",")} {ratio >= 4.5 ? "✓" : "✗"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <Link href="/" className="btn btn-ink">
        <Icon name="back" size={18} /> Volver al inicio
      </Link>
    </main>
  );
}
