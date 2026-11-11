"use client";

import { useActionState, useState } from "react";
import { createBusinessAction, type FormState } from "@/app/actions";
import { Submit } from "@/components/submit";
import { BrandMark, ErrorText, StampCard, brandStyle } from "@/components/ui";
import { STAMPS, StampIcon } from "@/lib/stamps";
import { CARD_COLORS } from "@/lib/palette";

const COLORS = CARD_COLORS.map((c) => c.hex);
const ICONS = Object.keys(STAMPS);

export function NewBusinessForm() {
  const [state, action] = useActionState<FormState, FormData>(createBusinessAction, undefined);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [stamps, setStamps] = useState(10);
  const [reward, setReward] = useState("");
  const [country, setCountry] = useState("CR");
  const [pin, setPin] = useState("");
  const preview = Math.min(3, stamps - 1);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
      {/* Vista previa: arriba en móvil, fija a la derecha en escritorio */}
      <div style={brandStyle(color)} className="hero rounded-[32px] p-5 lg:sticky lg:top-6 lg:order-last lg:p-6">
        <p className="eyebrow mb-4 text-white/55">Así la ve el cliente</p>
        <div className="mb-5 flex items-center gap-3">
          <BrandMark icon={icon} />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display font-semibold">{name || "Nombre del negocio"}</p>
            <p className="text-sm text-white/60">Hola, María</p>
          </div>
        </div>
        <p className="figure mb-5 text-6xl">
          {preview}
          <span className="text-3xl text-white/40"> / {stamps}</span>
        </p>
        <StampCard
          title="Tarjeta de sellos"
          filled={preview}
          total={stamps}
          icon={icon}
          footer={`Al completar: ${reward || "tu recompensa"}`}
        />
      </div>

      <div className="card space-y-5">
        <div>
          <label className="label" htmlFor="name">
            Nombre del negocio
          </label>
          <input id="name" name="name" className="field" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
        </div>

        <div>
          <label className="label" htmlFor="country">
            País
          </label>
          <select id="country" name="country" className="field" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="CR">Costa Rica</option>
            <option value="MX">México</option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className="label">Color de la tarjeta</legend>
            <input type="hidden" name="color" value={color} />
            <div className="flex flex-wrap gap-2">
              {CARD_COLORS.map(({ name, hex: c }) => (
                <button
                  key={c}
                  type="button"
                  title={name}
                  aria-label={`Color ${name}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  className={`size-11 rounded-full border border-black/10 transition-shadow duration-200 ${color === c ? "ring-2 ring-ink ring-offset-2" : ""}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label">Sello</legend>
            <input type="hidden" name="icon" value={icon} />
            <div className="flex flex-wrap gap-2">
              {ICONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  title={STAMPS[key].label}
                  aria-label={`Sello ${STAMPS[key].label}`}
                  aria-pressed={icon === key}
                  onClick={() => setIcon(key)}
                  className={`flex size-11 items-center justify-center rounded-full transition-colors duration-200 ${
                    icon === key ? "bg-ink text-white" : "bg-fog text-ink hover:bg-line"
                  }`}
                >
                  <StampIcon name={key} size={20} />
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div>
          <label className="label" htmlFor="stampsRequired">
            Sellos para completar la tarjeta: <span className="tabular font-semibold text-black">{stamps}</span>
          </label>
          <input
            id="stampsRequired"
            name="stampsRequired"
            type="range"
            min={2}
            max={12}
            value={stamps}
            onChange={(e) => setStamps(Number(e.target.value))}
            className="w-full accent-black"
          />
        </div>

        <div>
          <label className="label" htmlFor="rewardText">
            Recompensa al completarla
          </label>
          <input
            id="rewardText"
            name="rewardText"
            className="field"
            placeholder="un café gratis"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            maxLength={80}
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="pin">
            PIN del personal (4 a 8 dígitos)
          </label>
          <input
            id="pin"
            name="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="field tabular"
            inputMode="numeric"
            pattern="\d{4,8}"
            maxLength={8}
            autoComplete="off"
            required
          />
          <p className="mt-1.5 text-xs text-stone">
            Los empleados lo usan para abrir el escáner. Anótalo: no se vuelve a mostrar.
          </p>
        </div>

        <ErrorText>{state?.error}</ErrorText>
        <Submit pendingText="Creando…" className="btn btn-ink w-full lg:w-auto">
          Crear negocio
        </Submit>
      </div>
    </form>
  );
}
