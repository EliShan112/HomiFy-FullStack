"use client";

import { useEffect } from "react";

export default function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutside: () => void,
  active: boolean = true
) {
  useEffect(() => {
    if (!active) return;

    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) onOutside();
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside, active]);
}
