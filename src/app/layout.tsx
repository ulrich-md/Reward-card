import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Cuatro voces: titulares y cifras, texto de interfaz, énfasis editorial y datos.
const display = Bricolage_Grotesque({ variable: "--font-display-src", subsets: ["latin"] });
const sans = Hanken_Grotesk({ variable: "--font-sans-src", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif-src", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ variable: "--font-mono-src", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reward Card",
  description: "Tarjetas de sellos y recompensas digitales para negocios.",
};

export const viewport: Viewport = {
  themeColor: "#0a0b0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
