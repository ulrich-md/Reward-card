/**
 * Paleta «Grafito y Cobalto». Los valores también están como variables en
 * src/app/globals.css; si cambias uno, cámbialo en los dos sitios.
 */
export type Swatch = { name: string; token: string; hex: string; use: string };

export const GRAPHITE: Swatch[] = [
  { name: "Tinta", token: "ink", hex: "#0a0b0d", use: "Paneles destacados, texto y botón principal." },
  { name: "Carbón", token: "coal", hex: "#131519", use: "Parte alta del degradado de los paneles." },
  { name: "Humo", token: "smoke", hex: "#1d2026", use: "Superficies dentro de un panel oscuro." },
  { name: "Pizarra", token: "slate", hex: "#2a2e36", use: "Estado al pasar el cursor sobre el botón principal." },
  { name: "Bruma", token: "mist", hex: "#8b919c", use: "Texto secundario dentro de paneles oscuros." },
];

export const PAPER: Swatch[] = [
  { name: "Papel", token: "paper", hex: "#ffffff", use: "Tarjetas y campos con foco." },
  { name: "Niebla", token: "fog", hex: "#f1f1ee", use: "Fondo de la app, campos y filas." },
  { name: "Línea", token: "line", hex: "#e3e3de", use: "Separadores y bordes en claro." },
  { name: "Piedra", token: "stone", hex: "#646972", use: "Texto secundario sobre claro." },
];

export const ACCENT: Swatch[] = [
  { name: "Cobalto", token: "cobalt", hex: "#3355ff", use: "Enlaces, insignias, foco y marca de la plataforma." },
  { name: "Cobalto claro", token: "cobalt-300", hex: "#94a6ff", use: "Acento dentro de paneles oscuros." },
  { name: "Cobalto suave", token: "cobalt-soft", hex: "#e9edff", use: "Fondo de etiquetas e iconos sobre claro." },
  { name: "Lima", token: "lime", hex: "#c8f169", use: "Solo para premios: recompensa lista o tarjeta completa." },
];

export const STATUS: Swatch[] = [
  { name: "Correcto", token: "ok", hex: "#0f7a4f", use: "Confirmaciones: sello añadido, cupón disponible." },
  { name: "Correcto suave", token: "ok-soft", hex: "#e8f6ef", use: "Fondo de los avisos de confirmación." },
  { name: "Aviso", token: "warn", hex: "#955600", use: "Hitos y advertencias." },
  { name: "Aviso suave", token: "warn-soft", hex: "#fff3dc", use: "Fondo de los avisos." },
  { name: "Error", token: "bad", hex: "#c2362b", use: "Errores de formulario y acciones fallidas." },
  { name: "Error suave", token: "bad-soft", hex: "#fdecea", use: "Fondo de los mensajes de error." },
];

/** Colores que un negocio puede elegir para su tarjeta de sellos. */
export const CARD_COLORS: { name: string; hex: string }[] = [
  { name: "Cobalto", hex: "#3355ff" },
  { name: "Lima", hex: "#c8f169" },
  { name: "Sol", hex: "#ffd84d" },
  { name: "Coral", hex: "#ff8a65" },
  { name: "Lila", hex: "#b9a2ff" },
  { name: "Bosque", hex: "#1f6f54" },
  { name: "Vino", hex: "#a8322d" },
  { name: "Grafito", hex: "#2a2e36" },
];

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contraste WCAG entre dos colores (de 1 a 21). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
