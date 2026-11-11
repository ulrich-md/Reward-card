"use client";

import { useActionState } from "react";
import { adminLoginAction, type FormState } from "@/app/actions";
import { Submit } from "@/components/submit";
import { ErrorText } from "@/components/ui";

export function LoginForm() {
  const [state, action] = useActionState<FormState, FormData>(adminLoginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <input id="password" name="password" type="password" className="field" autoComplete="current-password" required />
      </div>
      <ErrorText>{state?.error}</ErrorText>
      <Submit>Entrar</Submit>
    </form>
  );
}
