import Link from "next/link";
import { brandImage } from "@/lib/brand-image";
import { HeroDemo } from "./hero-demo";
import { BrandMark, Icon, Wordmark, brandStyle, type IconName } from "@/components/ui";

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "star", title: "Tarjetas de sellos", text: "Tú decides cuántos sellos y qué premio. El progreso se actualiza solo en el teléfono del cliente." },
  { icon: "tag", title: "Cupones", text: "Lanza una promoción y aparece al instante en todas las tarjetas. Cada cliente la usa una vez." },
  { icon: "scan", title: "Escáner para el personal", text: "Se abre en cualquier celular con un PIN. Sin equipos ni instalaciones." },
  { icon: "qr", title: "Cartel para el mostrador", text: "Un código listo para imprimir. El cliente lo escanea y tiene su tarjeta en diez segundos." },
  { icon: "user", title: "Base de clientes", text: "Nombre y celular de cada persona que vuelve, con su historial de visitas y canjes." },
  { icon: "store", title: "Varios negocios", text: "Un solo panel para todas las marcas que gestionas, cada una con su color y su programa." },
];

const STEPS = [
  { title: "El cliente escanea", text: "Lee el código del mostrador con la cámara. No descarga ninguna app." },
  { title: "Crea su tarjeta", text: "Escribe su nombre y su celular. La tarjeta queda guardada en su teléfono." },
  { title: "Gana en cada visita", text: "El personal escanea su tarjeta y el sello aparece al momento." },
];

export const metadata = { title: "Reward Card · Tarjetas de sellos digitales" };

export default function Presentation() {
  const counterPhoto = brandImage("counter.jpg");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 lg:px-6">
      <nav className="flex items-center justify-between py-5">
        <Wordmark />
        <div className="flex items-center gap-1 text-sm font-semibold">
          <a href="#ventajas" className="hidden rounded-full px-4 py-2 text-stone transition-colors hover:text-ink sm:block">
            Ventajas
          </a>
          <a href="#como-funciona" className="hidden rounded-full px-4 py-2 text-stone transition-colors hover:text-ink sm:block">
            Cómo funciona
          </a>
          <Link href="/" className="btn btn-ink btn-sm ml-2">
            Entrar
          </Link>
        </div>
      </nav>

      <header className="pb-6 pt-10 text-center lg:pb-10 lg:pt-20">
        <p className="rise mx-auto inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium shadow-[0_0_0_1px_rgb(10_11_13/0.08)]">
          <span className="size-1.5 rounded-full bg-cobalt" />
          Fidelización para negocios locales
        </p>
        <h1
          className="rise mx-auto mt-6 max-w-4xl text-[2.7rem] font-medium leading-[1.02] text-balance lg:text-[5.25rem]"
          style={{ animationDelay: "40ms" }}
        >
          La tarjeta de sellos, ahora en el <span className="em">teléfono</span> de tus clientes.
        </h1>
        <p
          className="rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone lg:text-lg"
          style={{ animationDelay: "80ms" }}
        >
          Sin app y sin cartón. Tus clientes escanean un código, guardan su tarjeta y vuelven por su premio.
        </p>
        <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "120ms" }}>
          <Link href="/" className="btn btn-ink">
            Crear un programa <Icon name="chevron" size={16} />
          </Link>
          <a href="#como-funciona" className="btn btn-ghost !bg-white">
            Ver cómo funciona
          </a>
        </div>
      </header>

      <section aria-label="Demostración interactiva" className="pt-4">
        <p className="eyebrow mb-3 text-center text-stone">Pruébalo: da un sello y mira la tarjeta</p>
        <HeroDemo />
      </section>

      <section id="ventajas" className="scroll-mt-6 pt-16 lg:pt-24">
        <p className="eyebrow text-stone">Ventajas</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-medium leading-tight text-balance lg:text-5xl">
          Todo lo que hace una tarjeta de cartón, y lo que no puede hacer.
        </h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-[20px] bg-line shadow-[0_0_0_1px_var(--color-line)] sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <li key={f.title} className="bg-white p-6 lg:p-8">
              <span className="flex size-10 items-center justify-center rounded-xl bg-ink text-white">
                <Icon name={f.icon} size={18} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="como-funciona" className="scroll-mt-6 grid gap-8 pt-16 lg:grid-cols-2 lg:gap-12 lg:pt-24">
        <div
          role="img"
          aria-label="Cartel con código QR sobre el mostrador de un negocio"
          className="photo hero min-h-72 rounded-[24px] lg:min-h-[520px]"
          style={counterPhoto ? { backgroundImage: `url(${counterPhoto})` } : undefined}
        >
          {counterPhoto ? null : (
            // Sin fotografía todavía: se muestra el cartel del mostrador.
            <div className="flex h-full min-h-72 items-center justify-center p-8 lg:min-h-[520px]" style={brandStyle("#ffd84d")}>
              <div className="w-56 -rotate-3 rounded-2xl bg-white p-6 text-center text-ink shadow-2xl">
                <span className="inline-flex">
                  <BrandMark icon="coffee" size={40} />
                </span>
                <p className="mt-3 font-display text-lg font-medium leading-tight">
                  Junta 10 sellos y llévate <span className="em">un café gratis</span>
                </p>
                <span className="mx-auto mt-4 flex size-28 items-center justify-center rounded-xl shadow-[0_0_0_1px_rgb(10_11_13/0.1)]">
                  <Icon name="qr" size={84} />
                </span>
                <p className="eyebrow mt-3 text-stone">Escanea con tu cámara</p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <p className="eyebrow text-stone">Cómo funciona</p>
          <h2 className="mt-2 text-3xl font-medium leading-tight text-balance lg:text-5xl">
            Tres pasos, <span className="em">diez segundos</span>.
          </h2>
          <ol className="mt-8 space-y-px overflow-hidden rounded-[20px] bg-line shadow-[0_0_0_1px_var(--color-line)]">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex gap-5 bg-white p-5 lg:p-6">
                <span className="figure text-4xl text-stone">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hero mt-16 rounded-[24px] px-6 py-12 text-center lg:mt-24 lg:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-medium leading-tight text-balance lg:text-5xl">
          Lanza el programa de tu negocio <span className="em">hoy</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">
          Define la tarjeta, imprime el cartel y empieza a dar sellos en la siguiente venta.
        </p>
        <Link href="/" className="btn btn-white mt-8">
          Entrar al panel <Icon name="chevron" size={16} />
        </Link>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 pt-8 text-sm text-stone">
        <Wordmark className="text-ink" />
        <div className="flex gap-5">
          <Link href="/paleta" className="transition-colors hover:text-ink">
            Sistema de diseño
          </Link>
          <Link href="/" className="transition-colors hover:text-ink">
            Panel
          </Link>
        </div>
      </footer>
    </div>
  );
}
