"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Инерционная прокрутка только для мыши/трекпада и без reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: 0, duration: 1.4 },
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
