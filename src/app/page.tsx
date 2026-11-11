import Link from "next/link";
import { Phone, StampGrid, brandStyle } from "@/components/ui";

export default function Home() {
  return (
    <Phone style={brandStyle("#c8f169")}>
      <main className="flex flex-1 flex-col justify-between px-6 pb-10 pt-14">
        <div>
          <p className="text-sm font-medium text-mist">Reward Card</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
            Tarjetas de sellos que viven en el teléfono de tus clientes.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-mist">
            Sin app ni tarjetas de cartón. El cliente escanea un código, guarda su tarjeta y gana un sello en cada
            visita.
          </p>
        </div>

        <div className="my-10 rounded-[28px] bg-accent p-5 text-on-accent">
          <div className="mb-4 flex items-baseline justify-between">
            <span className="text-sm font-semibold">Café de ejemplo</span>
            <span className="tabular text-sm font-semibold">7 / 10</span>
          </div>
          <StampGrid filled={7} total={10} emoji="☕" />
          <p className="mt-4 text-sm font-medium opacity-70">Al completar: un café gratis</p>
        </div>

        <Link href="/admin" className="btn btn-accent w-full">
          Entrar al panel
        </Link>
      </main>
    </Phone>
  );
}
