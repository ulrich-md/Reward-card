"use client";

import { useActionState, useState } from "react";
import { accessAction, type FormState } from "@/app/actions";
import { Submit } from "@/components/submit";
import { ErrorText } from "@/components/ui";

export function AccessForm() {
  const [state, action] = useActionState<FormState, FormData>(accessAction, undefined);
  const [value, setValue] = useState("");
  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          autoComplete="current-password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <ErrorText>{state?.error}</ErrorText>
      <Submit>Entrar</Submit>
    </form>
  );
}
