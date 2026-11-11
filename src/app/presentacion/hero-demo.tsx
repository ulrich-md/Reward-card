"use client";

import { useState } from "react";
import { BrandMark, Icon, IconBubble, StampCard, brandStyle } from "@/components/ui";

const TOTAL = 8;
const REWARD = "un café gratis";

/**
 * Demostración de la portada: el visitante da sellos y ve cómo responde la
 * tarjeta del cliente. Todo ocurre en el navegador; no guarda nada.
 */
export function HeroDemo() {
  const [stamps, setStamps] = useState(5);
  const [rewards, setRewards] = useState(0);
  const [given, setGiven] = useState(0);
  const [last, setLast] = useState<number | undefined>();

  function stamp() {
    setGiven((n) => n + 1);
    if (stamps + 1 >= TOTAL) {
      setStamps(0);
      setRewards((n) => n + 1);
      setLast(undefined);
    } else {
      setLast(stamps);
      setStamps(stamps + 1);
    }
  }

  const message =
    given === 0
      ? "Pulsa el botón para probarlo"
      : stamps === 0
        ? `¡Tarjeta completa! Ganó ${REWARD}`
        : `Sello añadido: ${stamps} de ${TOTAL}`;

  return (
    <div style={brandStyle("#ffd84d")} className="grid gap-3 lg:grid-cols-12 lg:gap-4">
      {/* Lo que ve el cliente */}
      <div className="hero rise rounded-[20px] p-5 lg:col-span-5 lg:row-span-2 lg:p-7" style={{ animationDelay: "80ms" }}>
        <p className="eyebrow text-white/55">El teléfono del cliente</p>
        <div className="mt-5 flex items-center gap-3">
          <BrandMark icon="coffee" />
          <div className="leading-tight">
            <p className="font-display font-semibold">Café Central</p>
            <p className="text-sm text-white/60">Hola, María</p>
          </div>
        </div>
        <p className="figure mt-6 text-7xl" aria-live="polite">
          {stamps}
          <span className="text-3xl text-white/40"> / {TOTAL}</span>
        </p>
        <div className="mt-2 min-h-9">
          {rewards > 0 ? (
            <p className="pop inline-flex items-center gap-2 rounded-full bg-lime px-3.5 py-1.5 text-sm font-semibold text-ink">
              <Icon name="gift" size={16} />
              {rewards === 1 ? `Tienes ${REWARD}` : `Tienes ${rewards} premios`} por canjear
            </p>
          ) : (
            <p className="text-sm text-white/65">
              Le faltan {TOTAL - stamps} para <span className="em text-base text-white">{REWARD}</span>
            </p>
          )}
        </div>
        <div className="mt-5">
          <StampCard
            title="Tarjeta de sellos"
            filled={stamps}
            total={TOTAL}
            icon="coffee"
            highlight={last}
            footer={`Al completar: ${REWARD}`}
          />
        </div>
      </div>

      {/* Lo que hace el personal */}
      <div className="card rise lg:col-span-4" style={{ animationDelay: "120ms" }}>
        <p className="eyebrow text-stone">El escáner del personal</p>
        <div className="row mt-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-sm font-semibold shadow-[0_0_0_1px_rgb(10_11_13/0.06)]">
            M
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">María Rojas</p>
            <p className="font-mono text-xs text-stone">Tarjeta escaneada</p>
          </div>
        </div>
        <button type="button" onClick={stamp} className="btn btn-ink mt-3 w-full py-4 text-base">
          <Icon name="plus" size={18} /> Dar un sello
        </button>
        <p
          role="status"
          className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
            given === 0 ? "bg-fog text-stone" : "bg-ok-soft text-ok"
          }`}
        >
          {given === 0 ? null : <Icon name="check" size={16} />}
          {message}
        </p>
      </div>

      {/* Cartel del mostrador */}
      <div className="card rise flex flex-col items-center justify-center text-center lg:col-span-3" style={{ animationDelay: "160ms" }}>
        <span className="flex size-24 items-center justify-center rounded-2xl shadow-[0_0_0_1px_rgb(10_11_13/0.1)]">
          <Icon name="qr" size={68} />
        </span>
        <p className="mt-4 font-display font-semibold leading-tight">Cartel para el mostrador</p>
        <p className="mt-1 text-sm text-stone">Se escanea con la cámara</p>
      </div>

      {/* Cupón */}
      <div className="card rise lg:col-span-4" style={{ animationDelay: "200ms" }}>
        <p className="eyebrow text-stone">Cupones</p>
        <div className="row mt-4">
          <IconBubble name="tag" tone="bg-white text-ink shadow-[0_0_0_1px_rgb(10_11_13/0.06)]" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">2×1 en capuchinos</p>
            <p className="truncate text-sm text-stone">De lunes a jueves</p>
          </div>
          <span className="shrink-0 rounded-full bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">Disponible</span>
        </div>
      </div>

      {/* Contador de la demostración */}
      <div className="card rise !bg-ink text-white lg:col-span-3" style={{ animationDelay: "240ms" }}>
        <p className="eyebrow text-white/55">En esta prueba</p>
        <p className="figure mt-3 text-5xl">{given}</p>
        <p className="mt-1 text-sm text-white/65">{given === 1 ? "sello dado" : "sellos dados"}</p>
      </div>
    </div>
  );
}
