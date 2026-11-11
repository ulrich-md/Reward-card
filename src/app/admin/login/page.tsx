import { Phone, Sheet } from "@/components/ui";
import { LoginForm } from "./form";

export const metadata = { title: "Entrar · Reward Card" };

export default function Page() {
  return (
    <Phone>
      <header className="px-6 pb-8 pt-14">
        <p className="text-sm font-medium text-mist">Reward Card</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Panel de la agencia</h1>
      </header>
      <Sheet>
        <LoginForm />
      </Sheet>
    </Phone>
  );
}
