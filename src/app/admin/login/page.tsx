import { Hero, Phone, Sheet, Wordmark } from "@/components/ui";
import { LoginForm } from "./form";

export const metadata = { title: "Entrar · Reward Card" };

export default function Page() {
  return (
    <Phone>
      <Hero>
        <Wordmark />
        <h1 className="mt-10 text-4xl font-medium leading-[1.05] lg:mt-16 lg:text-6xl">
          Panel de la <span className="em">agencia</span>
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/65 lg:text-lg">
          Crea negocios, lanza cupones y mira cómo vuelven sus clientes.
        </p>
      </Hero>
      <Sheet>
        <p className="eyebrow text-stone">Acceso</p>
        <h2 className="mb-5 mt-1 text-2xl font-semibold">Entrar</h2>
        <LoginForm />
      </Sheet>
    </Phone>
  );
}
