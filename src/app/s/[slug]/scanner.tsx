"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import {
  staffLogoutAction,
  staffLookupAction,
  staffRedeemCouponAction,
  staffRedeemRewardAction,
  staffStampAction,
  type MemberView,
  type StaffResult,
} from "@/app/actions";
import { Avatar, ErrorText, Hero, Icon, Sheet, StampCard } from "@/components/ui";
import { parseScannedCode } from "@/lib/util";

type BusinessInfo = { name: string; emoji: string; stampsRequired: number; rewardText: string };

export function Scanner({ slug, business }: { slug: string; business: BusinessInfo }) {
  const [member, setMember] = useState<MemberView | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [justStamped, setJustStamped] = useState<number | undefined>();
  const [pending, startTransition] = useTransition();

  const apply = useCallback((result: StaffResult, stamped = false) => {
    if (!result.ok) {
      setError(result.error);
      setMessage(null);
      return;
    }
    setError(null);
    setMessage(result.message ?? null);
    if (result.message) navigator.vibrate?.(60);
    setJustStamped(stamped && !result.rewardEarned ? result.member.stamps - 1 : undefined);
    setMember(result.member);
  }, []);

  const lookup = useCallback(
    (query: string) => {
      startTransition(async () => apply(await staffLookupAction(slug, query)));
    },
    [slug, apply],
  );

  if (!member) {
    return (
      <>
        <div className="lg:min-w-0 lg:flex-1">
        <header className="flex items-center justify-between px-6 pb-4 pt-6 lg:px-0 lg:pt-0">
          <div className="flex items-center gap-3">
            <Avatar emoji={business.emoji} size={40} />
            <div className="leading-tight">
              <p className="font-semibold">{business.name}</p>
              <p className="text-sm text-mist">Escáner</p>
            </div>
          </div>
          <form action={staffLogoutAction.bind(null, slug)}>
            <button className="btn btn-smoke btn-sm">Salir</button>
          </form>
        </header>

        <div className="px-6 pb-6 lg:max-w-md lg:px-0 lg:pb-0">
          <Camera onCode={lookup} paused={pending} />
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-mist">
            <Icon name="scan" size={16} />
            {pending ? "Buscando tarjeta…" : "Apunta al código QR de la tarjeta del cliente"}
          </p>
        </div>
        </div>

        <Sheet>
          <h2 className="text-lg font-semibold">¿No se puede escanear?</h2>
          <p className="mb-4 mt-1 text-sm text-stone">Escribe el código de la tarjeta o el celular del cliente.</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
              if (q) lookup(q);
            }}
          >
            <input name="q" className="field tabular" placeholder="Código o celular" autoComplete="off" required />
            <button className="btn btn-ink shrink-0" disabled={pending}>
              Buscar
            </button>
          </form>
          <div className="mt-4">
            <ErrorText>{error}</ErrorText>
          </div>
        </Sheet>
      </>
    );
  }

  const act = (fn: () => Promise<StaffResult>, stamped = false) =>
    startTransition(async () => apply(await fn(), stamped));

  return (
    <>
      <Hero>
        <p className="text-sm text-mist">Cliente · celular termina en {member.phoneEnd}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight lg:text-5xl">{member.name}</h1>
        <div className="mt-6 lg:mt-8 lg:max-w-md">
          <StampCard
            title="Sellos"
            filled={member.stamps}
            total={business.stampsRequired}
            emoji={business.emoji}
            highlight={justStamped}
            footer={`Al completar: ${business.rewardText}`}
          />
        </div>
      </Hero>

      <Sheet>
        <div aria-live="polite" className="mb-4 space-y-3 empty:hidden">
          {message ? (
            <p className="flex items-center gap-2 rounded-2xl bg-ok-soft px-4 py-3 text-sm font-medium text-ok">
              <Icon name="check" size={18} /> {message}
            </p>
          ) : null}
          <ErrorText>{error}</ErrorText>
        </div>

        <button
          className="btn btn-accent w-full py-5 text-lg"
          disabled={pending}
          onClick={() => act(() => staffStampAction(slug, member.id), true)}
        >
          Dar un sello
        </button>

        {member.rewardsAvailable > 0 ? (
          <div className="mt-4 flex items-center gap-3 rounded-3xl bg-fog p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
              <Icon name="gift" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{business.rewardText}</p>
              <p className="text-sm text-stone">
                {member.rewardsAvailable === 1 ? "1 recompensa lista" : `${member.rewardsAvailable} recompensas listas`}
              </p>
            </div>
            <button
              className="btn btn-ink btn-sm shrink-0"
              disabled={pending}
              onClick={() => act(() => staffRedeemRewardAction(slug, member.id))}
            >
              Entregar
            </button>
          </div>
        ) : null}

        {member.coupons.length > 0 ? (
          <>
            <h2 className="mb-1 mt-7 text-lg font-semibold">Cupones</h2>
            <ul className="divide-y divide-line">
              {member.coupons.map((c) => (
                <li key={c.id} className="flex items-center gap-3 py-3">
                  <div className={`min-w-0 flex-1 ${c.redeemed ? "opacity-45" : ""}`}>
                    <p className="font-medium">{c.title}</p>
                    {c.description ? <p className="truncate text-sm text-stone">{c.description}</p> : null}
                  </div>
                  {c.redeemed ? (
                    <span className="text-sm font-medium text-stone">Usado</span>
                  ) : (
                    <button
                      className="btn btn-ghost btn-sm shrink-0"
                      disabled={pending}
                      onClick={() => act(() => staffRedeemCouponAction(slug, member.id, c.id))}
                    >
                      Canjear
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <button
          className="btn btn-ghost mt-8 w-full"
          onClick={() => {
            setMember(null);
            setMessage(null);
            setError(null);
          }}
        >
          Siguiente cliente
        </button>
      </Sheet>
    </>
  );
}

function Camera({ onCode, paused }: { onCode: (code: string) => void; paused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onCodeRef = useRef(onCode);
  const pausedRef = useRef(paused);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onCodeRef.current = onCode;
    pausedRef.current = paused;
  }, [onCode, paused]);

  useEffect(() => {
    let scanner: { stop(): void; destroy(): void } | undefined;
    let cancelled = false;
    let last = "";
    let lastAt = 0;

    (async () => {
      try {
        const { default: QrScanner } = await import("qr-scanner");
        if (cancelled || !videoRef.current) return;
        const s = new QrScanner(
          videoRef.current,
          (result) => {
            const code = parseScannedCode(result.data);
            const now = Date.now();
            // Evita lanzar la misma lectura varias veces seguidas.
            if (!code || pausedRef.current || (code === last && now - lastAt < 3000)) return;
            last = code;
            lastAt = now;
            onCodeRef.current(code);
          },
          { preferredCamera: "environment", maxScansPerSecond: 8, returnDetailedScanResult: true },
        );
        scanner = s;
        await s.start();
        if (cancelled) s.destroy();
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      scanner?.stop();
      scanner?.destroy();
    };
  }, []);

  return (
    <div className="relative aspect-square overflow-hidden rounded-[32px] bg-coal">
      <video ref={videoRef} className="size-full object-cover" muted playsInline />
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-mist">
          No se pudo abrir la cámara. Revisa el permiso del navegador o busca al cliente por código o celular.
        </div>
      ) : (
        <div aria-hidden className="pointer-events-none absolute inset-10 rounded-3xl border-2 border-white/70" />
      )}
    </div>
  );
}
