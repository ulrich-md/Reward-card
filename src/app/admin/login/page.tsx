import { Hero, Phone, Sheet } from "@/components/ui";
import { LoginForm } from "./form";

export const metadata = { title: "Entrar · Reward Card" };

export default function Page() {
  return (
    <Phone>
      <Hero className="pt-14">
        <p className="text-sm font-medium text-mist">
          <span className="mr-2 inline-block size-2.5 rounded-full bg-lime" />
          Reward Card
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:mt-4 lg:text-5xl">Panel de la agencia</h1>
        <p className="mt-3 hidden max-w-md text-lg text-mist lg:block">
          Crea negocios, lanza cupones y mira cómo vuelven sus clientes.
        </p>
      </Hero>
      <Sheet>
        <h2 className="mb-4 text-xl font-semibold">Entrar</h2>
        <LoginForm />
      </Sheet>
    </Phone>
  );
}
