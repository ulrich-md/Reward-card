"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Refresca la página cada pocos segundos para que el cliente vea su sello al instante. */
export function AutoRefresh({ seconds = 4 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [router, seconds]);
  return null;
}
