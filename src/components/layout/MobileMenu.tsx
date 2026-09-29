"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion } from "motion/react";
import { cta, nav, site } from "@/content/site";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

/** Фокусируемые элементы меню и шапки (кнопка «Закрыть» живёт в шапке) */
const FOCUSABLE = "header a[href], header button, #mobile-menu a[href], #mobile-menu button";

export function MobileMenu({
  onClose,
  toggleRef,
}: {
  onClose: () => void;
  toggleRef: RefObject<HTMLButtonElement | null>;
}) {
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Фокус в меню — один раз при открытии
  useEffect(() => {
    firstLink.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Фокус остаётся внутри меню и шапки; фон закрыт через inert
      const items = [...document.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (current === first || !items.includes(current!))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !items.includes(current!))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, toggleRef]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-label="Меню"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-40 flex flex-col bg-graphite-950 pt-(--header-h) lg:hidden"
    >
      <nav aria-label="Мобильная навигация" className="container-x flex-1 pt-10">
        <ul className="border-t border-line">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden border-b border-line">
              <motion.a
                ref={i === 0 ? firstLink : undefined}
                href={item.href}
                onClick={onClose}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease }}
                className="flex items-baseline justify-between py-5"
              >
                <span className="text-display text-[clamp(40px,11vw,64px)]">{item.label}</span>
                <span className="text-label text-subtle">{item.n}</span>
              </motion.a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="container-x space-y-6 pb-[max(28px,env(safe-area-inset-bottom))]"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="space-y-1.5">
            <p className="text-label text-subtle">Телефон</p>
            <a href={site.phoneHref} className="font-mono text-[15px] whitespace-nowrap">
              {site.phone}
            </a>
          </div>
          <p className="text-label whitespace-nowrap text-subtle">{site.hours}</p>
        </div>
        <Button href={cta.href} size="lg" onClick={onClose} className="w-full">
          {cta.label}
        </Button>
      </motion.div>
    </motion.div>
  );
}
