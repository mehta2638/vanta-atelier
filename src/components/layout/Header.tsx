"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav, site } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > 480 && y > prev);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: hidden && !open ? "-100%" : 0 }}
        transition={{
          opacity: { duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] },
          y: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
            solid && !open
              ? "border-line bg-black/75 backdrop-blur-md"
              : "border-transparent bg-transparent"
          }`}
        />
        <div className="container-x relative flex h-(--header-h) items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative py-2 text-[13px] text-offwhite/70 transition-colors duration-300 hover:text-offwhite"
                  >
                    {item.label}
                    <span className="absolute inset-x-0 bottom-0.5 h-px origin-right scale-x-0 bg-offwhite/60 transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            <a
              href={site.phoneHref}
              className="hidden font-mono text-[12px] tracking-wide text-offwhite/70 transition-colors hover:text-offwhite xl:block"
            >
              {site.phone}
            </a>
            <Button href="#contact" className="max-md:hidden">
              Записаться
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="group -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
            >
              <span className="text-label text-offwhite/80">{open ? "Закрыть" : "Меню"}</span>
              <span aria-hidden className="relative block h-2.5 w-6">
                <span
                  className={`absolute left-0 h-px w-full bg-offwhite transition-transform duration-500 ease-out-expo ${
                    open ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-px bg-offwhite transition-all duration-500 ease-out-expo ${
                    open ? "top-1/2 w-full -rotate-45" : "top-full w-2/3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
