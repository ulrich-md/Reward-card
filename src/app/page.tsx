import { Hero, Phone, Sheet, Wordmark } from "@/components/ui";
import { AccessForm } from "./access-form";

export const metadata = { title: "Entrar · Reward Card" };

export default function Page() {
  return (
    <Phone>
      <Hero>
        <Wordmark />
        <h1 className="mt-10 text-4xl font-medium leading-[1.05] text-balance lg:mt-16 lg:text-6xl">
          El programa de sellos de tu <span className="em">negocio</span>
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/65 lg:text-lg">
          Entra para ver a tus clientes, lanzar cupones e imprimir el cartel del mostrador.
        </p>
      </Hero>
      <Sheet>
        <p className="eyebrow text-stone">Acceso</p>
        <h2 className="mt-1 text-2xl font-semibold">Entrar</h2>
        <p className="mb-5 mt-1 text-sm text-stone">Usa el código de acceso que te dio tu agencia.</p>
        <AccessForm />
      </Sheet>
    </Phone>
  );
}
