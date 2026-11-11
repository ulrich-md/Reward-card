"use client";

import { useActionState } from "react";
import { staffLoginAction, type FormState } from "@/app/actions";
import { Submit } from "@/components/submit";
import { ErrorText } from "@/components/ui";

export function PinForm({ slug }: { slug: string }) {
  const [state, action] = useActionState<FormState, FormData>(staffLoginAction.bind(null, slug), undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="pin">
          PIN
        </label>
        <input
          id="pin"
          name="pin"
          className="field tabular text-center text-2xl tracking-[0.4em]"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          pattern="\d{4,8}"
          maxLength={8}
          required
        />
      </div>
      <ErrorText>{state?.error}</ErrorText>
      <Submit>Entrar</Submit>
    </form>
  );
}
