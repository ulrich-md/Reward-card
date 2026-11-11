"use client";

import { useActionState, useState } from "react";
import { enrollAction, type FormState } from "@/app/actions";
import { Submit } from "@/components/submit";
import { ErrorText } from "@/components/ui";

export function EnrollForm({
  slug,
  businessName,
  dial,
  example,
}: {
  slug: string;
  businessName: string;
  dial: string;
  example: string;
}) {
  const [state, action] = useActionState<FormState, FormData>(enrollAction.bind(null, slug), undefined);
  // Campos controlados: React vacía los formularios tras una acción y, si hubo
  // un error, el cliente no debe volver a escribir todo.
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="name">
          Nombre
        </label>
        <input id="name" name="name" className="field" autoComplete="given-name" required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Celular
        </label>
        <div className="flex gap-2">
          <span className="field tabular w-auto shrink-0 text-stone">+{dial}</span>
          <input
            id="phone"
            name="phone"
            className="field tabular"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={example}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm leading-snug text-stone">
        <input type="checkbox" name="consent" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-black" />
        <span>
          Autorizo a {businessName} a guardar mi nombre y celular para gestionar mi tarjeta y enviarme avisos de mis
          recompensas.
        </span>
      </label>
      <ErrorText>{state?.error}</ErrorText>
      <Submit pendingText="Creando tu tarjeta…">Obtener mi tarjeta</Submit>
      <p className="text-center text-xs text-stone">
        ¿Ya tienes tarjeta? Usa el mismo celular y la recuperas.
      </p>
    </form>
  );
}
