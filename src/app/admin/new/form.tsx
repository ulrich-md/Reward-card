"use client";

import { useActionState, useState } from "react";
import { createBusinessAction, type FormState } from "@/app/actions";
import { Submit } from "@/components/submit";
import { ErrorText, StampGrid, brandStyle } from "@/components/ui";

const COLORS = ["#c8f169", "#ffd84d", "#7cc4ff", "#ff9d7a", "#c4a5ff", "#1f6f54", "#b3261e", "#111827"];
const EMOJIS = ["☕", "🍔", "🍕", "🌮", "🍦", "🥐", "💈", "💅", "🧺", "🐾"];

export function NewBusinessForm() {
  const [state, action] = useActionState<FormState, FormData>(createBusinessAction, undefined);
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [stamps, setStamps] = useState(10);
  const [reward, setReward] = useState("");
  const [country, setCountry] = useState("CR");
  const [pin, setPin] = useState("");

  return (
    <form action={action} className="space-y-5">
      <div style={brandStyle(color)} className="rounded-[28px] bg-accent p-5 text-on-accent">
        <div className="mb-4 flex items-baseline justify-between text-sm font-semibold">
          <span>{name || "Nombre del negocio"}</span>
          <span className="tabular">3 / {stamps}</span>
        </div>
        <StampGrid filled={3} total={stamps} emoji={emoji} />
        <p className="mt-4 text-sm font-medium opacity-75">Al completar: {reward || "tu recompensa"}</p>
      </div>

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

      <fieldset>
        <legend className="label">Color de la tarjeta</legend>
        <input type="hidden" name="color" value={color} />
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={`size-10 rounded-full border border-black/10 ${color === c ? "ring-2 ring-black ring-offset-2" : ""}`}
              style={{ background: c }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Sello</legend>
        <input type="hidden" name="emoji" value={emoji} />
        <div className="flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={emoji === e}
              onClick={() => setEmoji(e)}
              className={`flex size-10 items-center justify-center rounded-full bg-fog text-xl ${emoji === e ? "ring-2 ring-black ring-offset-2" : ""}`}
            >
              {e}
            </button>
          ))}
        </div>
      </fieldset>

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
        <input id="pin" name="pin" value={pin} onChange={(e) => setPin(e.target.value)} className="field tabular" inputMode="numeric" pattern="\d{4,8}" maxLength={8} autoComplete="off" required />
        <p className="mt-1.5 text-xs text-neutral-500">Los empleados lo usan para abrir el escáner. Anótalo: no se vuelve a mostrar.</p>
      </div>

      <ErrorText>{state?.error}</ErrorText>
      <Submit pendingText="Creando…">Crear negocio</Submit>
    </form>
  );
}
