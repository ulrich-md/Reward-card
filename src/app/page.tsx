import Link from "next/link";
import { Avatar, Hero, Icon, Phone, StampCard, brandStyle } from "@/components/ui";

const STEPS = [
  { icon: "scan", title: "Escanea", text: "El cliente lee el QR del mostrador con su cámara." },
  { icon: "user", title: "Se registra", text: "Nombre y celular. Diez segundos, sin descargar nada." },
  { icon: "gift", title: "Vuelve", text: "Un sello por visita y su premio al completar la tarjeta." },
] as const;

export default function Home() {
  return (
    <Phone style={brandStyle("#c8f169")}>
      <Hero className="flex flex-1 flex-col pt-14 lg:block">
        <p className="text-sm font-medium text-mist">
          <span className="mr-2 inline-block size-2.5 rounded-full bg-lime" />
          Reward Card
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-balance lg:mt-5 lg:text-6xl">
          Tarjetas de sellos que viven en el teléfono de tus clientes.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-mist lg:max-w-lg lg:text-lg">
          Sin app ni tarjetas de cartón. El cliente escanea un código, guarda su tarjeta y gana un sello en cada visita.
        </p>

        <ul className="mt-8 space-y-4 lg:mt-10">
          {STEPS.map((s) => (
            <li key={s.title} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-coal text-lime">
                <Icon name={s.icon} size={18} />
              </span>
              <p className="text-sm leading-snug text-mist">
                <b className="block text-base font-semibold text-white">{s.title}</b>
                {s.text}
              </p>
            </li>
          ))}
        </ul>

        <Link href="/admin" className="btn btn-accent mt-10 w-full lg:w-auto">
          Entrar al panel
        </Link>
      </Hero>

      {/* Muestra de la tarjeta del cliente */}
      <div className="mx-6 mb-10 rounded-[36px] bg-coal p-6 ring-1 ring-white/5 lg:m-0 lg:w-[400px] lg:flex-none lg:p-8">
        <div className="flex items-center gap-3">
          <Avatar emoji="☕" />
          <div className="leading-tight">
            <p className="font-semibold">Café de ejemplo</p>
            <p className="text-sm text-mist">Hola, María</p>
          </div>
        </div>
        <p className="mt-7 text-sm text-mist">Tus sellos</p>
        <p className="tabular mb-6 mt-1 text-6xl font-semibold tracking-tight">
          7<span className="text-3xl text-mist"> / 10</span>
        </p>
        <StampCard filled={7} total={10} emoji="☕" footer="Te faltan 3 sellos para un café gratis" />
      </div>
    </Phone>
  );
}
