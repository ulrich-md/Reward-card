"use client";

import { useActionState, useState, useTransition } from "react";
import {
  activateWalletAction,
  createCouponAction,
  resetPinAction,
  toggleCouponAction,
  type FormState,
} from "@/app/actions";
import { Submit } from "@/components/submit";
import { ErrorText } from "@/components/ui";

function OkText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="status" className="rounded-2xl bg-ok-soft px-4 py-3 text-sm font-medium text-ok">
      {children}
    </p>
  );
}

export function CouponForm({ slug }: { slug: string }) {
  const [state, action] = useActionState<FormState, FormData>(createCouponAction.bind(null, slug), undefined);
  return (
    <form action={action} className="space-y-3 rounded-3xl border border-line p-4">
      <p className="font-semibold">Nuevo cupón</p>
      <div>
        <label className="label" htmlFor="title">
          Título
        </label>
        <input id="title" name="title" className="field" placeholder="2×1 en capuchinos" maxLength={60} required />
      </div>
      <div>
        <label className="label" htmlFor="description">
          Condiciones (opcional)
        </label>
        <input id="description" name="description" className="field" placeholder="Solo de lunes a jueves" maxLength={160} />
      </div>
      <div>
        <label className="label" htmlFor="expiresAt">
          Vence el (opcional)
        </label>
        <input id="expiresAt" name="expiresAt" type="date" className="field" />
      </div>
      <ErrorText>{state?.error}</ErrorText>
      <OkText>{state?.ok}</OkText>
      <Submit className="btn btn-ink btn-sm" pendingText="Creando…">
        Crear cupón
      </Submit>
    </form>
  );
}

export function CouponToggle({ slug, couponId, active }: { slug: string; couponId: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      className="btn btn-ghost btn-sm shrink-0"
      disabled={pending}
      onClick={() => start(() => toggleCouponAction(slug, couponId, !active))}
    >
      {active ? "Pausar" : "Reactivar"}
    </button>
  );
}

export function PinResetForm({ slug }: { slug: string }) {
  const [state, action] = useActionState<FormState, FormData>(resetPinAction.bind(null, slug), undefined);
  return (
    <form action={action} className="space-y-3">
      <div className="flex gap-2">
        <input
          name="pin"
          aria-label="Nuevo PIN"
          className="field tabular"
          placeholder="Nuevo PIN"
          inputMode="numeric"
          pattern="\d{4,8}"
          maxLength={8}
          autoComplete="off"
          required
        />
        <Submit className="btn btn-ghost shrink-0" pendingText="Guardando…">
          Guardar
        </Submit>
      </div>
      <ErrorText>{state?.error}</ErrorText>
      <OkText>{state?.ok}</OkText>
    </form>
  );
}

export function WalletButton({ slug }: { slug: string }) {
  const [state, action] = useActionState<FormState>(activateWalletAction.bind(null, slug), undefined);
  return (
    <form action={action} className="space-y-3">
      <ErrorText>{state?.error}</ErrorText>
      <OkText>{state?.ok}</OkText>
      <Submit className="btn btn-ink btn-sm" pendingText="Publicando…">
        Activar tarjeta de Wallet
      </Submit>
    </form>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-ink btn-sm shrink-0"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* sin permiso de portapapeles: el enlace sigue visible para copiarlo a mano */
        }
      }}
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
