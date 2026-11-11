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
import { BrandMark, Content, ErrorText, Hero, Icon, IconBubble, Sheet, StampCard } from "@/components/ui";
import { parseScannedCode } from "@/lib/util";

type BusinessInfo = { name: string; icon: string; stampsRequired: number; rewardText: string };

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
        <Hero>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandMark icon={business.icon} size={40} />
              <div className="leading-tight">
                <p className="font-display font-semibold">{business.name}</p>
                <p className="eyebrow mt-0.5 text-white/55">Escáner</p>
              </div>
            </div>
            <form action={staffLogoutAction.bind(null, slug)}>
              <button className="btn btn-glass btn-sm">Salir</button>
            </form>
          </div>

          <div className="mx-auto mt-6 w-full max-w-sm lg:mt-10">
            <Camera onCode={lookup} paused={pending} />
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-white/65">
              <Icon name="scan" size={16} />
              {pending ? "Buscando tarjeta…" : "Apunta al código QR de la tarjeta del cliente"}
            </p>
          </div>
        </Hero>

        <Sheet>
          <p className="eyebrow text-stone">Sin cámara</p>
          <h2 className="mt-1 text-xl font-semibold">Busca al cliente</h2>
          <p className="mb-4 mt-1 text-sm text-stone">Escribe el código de la tarjeta o su celular.</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
              if (q) lookup(q);
            }}
          >
            <input
              name="q"
              aria-label="Código o celular"
              className="field tabular"
              placeholder="Código o celular"
              autoComplete="off"
              required
            />
            <button className="btn btn-ink shrink-0" disabled={pending}>
              Buscar
            </button>
          </form>
          <div className="mt-4 empty:hidden">
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
        <p className="eyebrow text-white/55">Cliente · celular termina en {member.phoneEnd}</p>
        <h1 className="mt-2 text-4xl font-medium leading-[1.05] lg:text-6xl">{member.name}</h1>
        <div className="mt-7 lg:mt-12 lg:max-w-md">
          <StampCard
            title="Tarjeta de sellos"
            filled={member.stamps}
            total={business.stampsRequired}
            icon={business.icon}
            highlight={justStamped}
            footer={`Al completar: ${business.rewardText}`}
          />
        </div>
      </Hero>

      <Content>
        <section className="card">
          <div aria-live="polite" className="mb-4 space-y-3 empty:hidden">
            {message ? (
              <p className="flex items-center gap-2 rounded-2xl bg-ok-soft px-4 py-3 text-sm font-medium text-ok">
                <Icon name="check" size={18} /> {message}
              </p>
            ) : null}
            <ErrorText>{error}</ErrorText>
          </div>

          <button
            className="btn btn-ink w-full py-5 text-lg"
            disabled={pending}
            onClick={() => act(() => staffStampAction(slug, member.id), true)}
          >
            <Icon name="plus" /> Dar un sello
          </button>

          {member.rewardsAvailable > 0 ? (
            <div className="row mt-3 !bg-lime/40">
              <IconBubble name="gift" tone="bg-lime text-ink" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{business.rewardText}</p>
                <p className="text-sm text-stone">
                  {member.rewardsAvailable === 1
                    ? "1 recompensa lista"
                    : `${member.rewardsAvailable} recompensas listas`}
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
        </section>

        {member.coupons.length > 0 ? (
          <section className="card">
            <p className="eyebrow mb-3 text-stone">Cupones</p>
            <ul className="space-y-2">
              {member.coupons.map((c) => (
                <li key={c.id} className="row">
                  <IconBubble name="tag" tone="bg-white text-ink shadow-[0_0_0_1px_rgb(10_11_13/0.06)]" />
                  <div className={`min-w-0 flex-1 ${c.redeemed ? "opacity-55" : ""}`}>
                    <p className="truncate font-semibold">{c.title}</p>
                    {c.description ? <p className="truncate text-sm text-stone">{c.description}</p> : null}
                  </div>
                  {c.redeemed ? (
                    <span className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold text-stone">Usado</span>
                  ) : (
                    <button
                      className="btn btn-ink btn-sm shrink-0"
                      disabled={pending}
                      onClick={() => act(() => staffRedeemCouponAction(slug, member.id, c.id))}
                    >
                      Canjear
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <button
          className="btn btn-ghost w-full !bg-white"
          onClick={() => {
            setMember(null);
            setMessage(null);
            setError(null);
          }}
        >
          <Icon name="scan" size={18} /> Siguiente cliente
        </button>
      </Content>
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
    <div className="relative aspect-square overflow-hidden rounded-[20px] bg-black/40 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)]">
      <video ref={videoRef} className="size-full object-cover" muted playsInline />
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-white/65">
          No se pudo abrir la cámara. Revisa el permiso del navegador o busca al cliente por código o celular.
        </div>
      ) : (
        <div
          aria-hidden
          className="viewfinder pointer-events-none absolute inset-10"
        />
      )}
    </div>
  );
}
