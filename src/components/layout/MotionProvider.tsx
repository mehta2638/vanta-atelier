"use client";

import { useSyncExternalStore } from "react";
import { MotionConfig } from "motion/react";

/**
 * reducedMotion="user": при системной настройке «Уменьшить движение»
 * motion отключает анимации трансформаций (появления, перелистывания,
 * пружины), оставляя смену прозрачности. CSS-анимации гасятся в globals.css.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const QUERY = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Предпочтение пользователя, безопасное для гидратации: на сервере и при
 * гидратации — false, сразу после — реальное значение (без рассинхрона HTML).
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Декоративный параллакс, привязанный к скроллу, MotionConfig не затрагивает.
 * Возвращает диапазон без движения, если пользователь просит меньше анимаций.
 */
export function useParallax<T>(values: T[], rest: T): T[] {
  const reduce = usePrefersReducedMotion();
  return reduce ? values.map(() => rest) : values;
}
