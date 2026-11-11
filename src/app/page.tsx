import Link from "next/link";
import { BrandMark, Content, Hero, Icon, IconBubble, Phone, StampCard, Wordmark, brandStyle } from "@/components/ui";

const STEPS = [
  { icon: "qr", title: "Escanea", text: "El cliente lee el código del mostrador con su cámara." },
  { icon: "user", title: "Se registra", text: "Nombre y celular. Diez segundos, sin descargar nada." },
  { icon: "gift", title: "Vuelve", text: "Un sello por visita y su premio al completar la tarjeta." },
] as const;

export default function Home() {
  return (
    <Phone>
      <Hero>
        <Wordmark />
        <h1 className="mt-10 text-[2.6rem] font-medium leading-[1.02] text-balance lg:mt-16 lg:text-7xl">
          Tarjetas de sellos que viven en el <span className="em">teléfono</span> de tus clientes.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-white/65 lg:text-lg">
          Sin app ni tarjetas de cartón. El cliente escanea un código, guarda su tarjeta y gana un sello en cada visita.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 lg:mt-12">
          <Link href="/admin" className="btn btn-white">
            Entrar al panel <Icon name="chevron" size={16} />
          </Link>
          <Link href="/paleta" className="btn btn-glass">
            Sistema de color
          </Link>
        </div>
      </Hero>

      <Content>
        <div className="card" style={brandStyle("#ffd84d")}>
          <div className="mb-5 flex items-center gap-3">
            <BrandMark icon="coffee" />
            <div className="leading-tight">
              <p className="font-display font-semibold">Café de ejemplo</p>
              <p className="text-sm text-stone">Así ve su tarjeta un cliente</p>
            </div>
          </div>
          <StampCard title="Tus sellos" filled={7} total={10} icon="coffee" footer="Te faltan 3 para un café gratis" />
        </div>

        <div className="card">
          <p className="eyebrow mb-3 text-stone">Cómo funciona</p>
          <ol className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={s.title} className="row">
                <IconBubble name={s.icon} tone="bg-white text-ink shadow-[0_0_0_1px_rgb(10_11_13/0.06)]" />
                <p className="min-w-0 flex-1 text-sm leading-snug text-stone">
                  <b className="block font-display text-[15px] font-semibold text-ink">{s.title}</b>
                  {s.text}
                </p>
                <span className="font-mono text-xs text-stone">0{i + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </Content>
    </Phone>
  );
}
