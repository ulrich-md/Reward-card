"use client";

import { useActionState, useState, useTransition } from "react";
import {
  activateWalletAction,
  createCouponAction,
  regenerateAccessAction,
  resetPinAction,
  toggleCouponAction,
  type AccessState,
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
    <form action={action} className="space-y-3 rounded-2xl p-4 shadow-[inset_0_0_0_1px_rgb(10_11_13/0.08)]">
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

export function AccessCodeForm({ slug, hasCode }: { slug: string; hasCode: boolean }) {
  const [state, action] = useActionState<AccessState>(regenerateAccessAction.bind(null, slug), undefined);
  return (
    <form action={action} className="space-y-3">
      {state?.code ? (
        <div className="rounded-2xl bg-fog p-4 shadow-[inset_0_0_0_1px_rgb(10_11_13/0.06)]">
          <p className="eyebrow text-stone">Código de acceso</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="font-mono text-lg font-semibold tracking-wider">{state.code}</p>
            <CopyButton text={state.code} />
          </div>
        </div>
      ) : (
        <p className="text-sm text-stone">
          {hasCode
            ? "Ya tiene un código. Si lo cambias, el anterior deja de funcionar."
            : "Todavía no tiene código. Créalo y envíaselo al dueño del negocio."}
        </p>
      )}
      <ErrorText>{state?.error}</ErrorText>
      <OkText>{state?.ok}</OkText>
      <Submit className="btn btn-ink btn-sm" pendingText="Creando…">
        {hasCode || state?.code ? "Cambiar el código" : "Crear código de acceso"}
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
