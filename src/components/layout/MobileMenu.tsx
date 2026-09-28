"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { nav, site } from "@/content/site";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
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
                href={item.href}
                onClick={onClose}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.06, ease }}
                className="flex items-baseline justify-between py-5"
              >
                <span className="text-display text-[clamp(40px,11vw,64px)]">{item.label}</span>
                <span className="text-label text-subtle">0{i + 1}</span>
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
        <Button href="#contact" size="lg" onClick={onClose} className="w-full">
          Записаться на осмотр
        </Button>
      </motion.div>
    </motion.div>
  );
}
