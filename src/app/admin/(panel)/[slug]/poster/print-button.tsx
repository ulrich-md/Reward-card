"use client";

import { Icon } from "@/components/ui";

export function PrintButton() {
  return (
    <button type="button" className="btn btn-accent btn-sm" onClick={() => window.print()}>
      <Icon name="printer" size={16} /> Imprimir
    </button>
  );
}
