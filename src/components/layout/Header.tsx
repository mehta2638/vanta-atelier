"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { cta, nav, sections, site, type SectionId } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection();
  const current = sections.find((x) => x.id === active);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    setHidden(y > 480 && y > prev);
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    // Пока открыто меню, страница под ним недоступна для клавиатуры и скринридера
    for (const el of document.querySelectorAll<HTMLElement>("main, footer")) el.inert = open;
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
          <div className="flex min-w-0 items-center gap-5">
            <Logo />
            {/* Где я: номер и название текущего раздела (визуальная подсказка) */}
            <p
              aria-hidden
              className={`flex min-w-0 items-center gap-3 transition-opacity duration-500 ${
                current && !open ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="h-3 w-px bg-line-strong" />
              <span className="font-mono text-[11px] whitespace-nowrap text-offwhite/80 tabular-nums">
                {current?.n ?? "01"}
                <span className="text-offwhite/55"> / 0{sections.length}</span>
              </span>
              <span className="text-label truncate text-offwhite/55 max-sm:hidden lg:max-xl:hidden">{current?.label}</span>
            </p>
          </div>

          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => {
                const on = item.id === active;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={on ? "true" : undefined}
                      className={`group relative flex items-baseline gap-2 py-2 text-[13px] transition-colors duration-300 hover:text-offwhite ${
                        on ? "text-offwhite" : "text-offwhite/70"
                      }`}
                    >
                      <span className={`font-mono text-[11px] transition-colors ${on ? "text-offwhite/80" : "text-offwhite/55"}`}>
                        {item.n}
                      </span>
                      {item.label}
                      <span
                        aria-hidden
                        className={`absolute inset-x-0 bottom-0.5 h-px bg-offwhite/60 transition-transform duration-500 ease-out-expo ${
                          on ? "origin-left scale-x-100" : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-6">
            <a
              href={site.phoneHref}
              className="hidden font-mono text-[12px] tracking-wide text-offwhite/70 transition-colors hover:text-offwhite xl:block"
            >
              {site.phone}
            </a>
            <Button href={cta.href} className="max-md:hidden">
              {cta.label}
            </Button>
            <button
              ref={toggleRef}
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

      <AnimatePresence>{open && <MobileMenu onClose={() => setOpen(false)} toggleRef={toggleRef} />}</AnimatePresence>
    </>
  );
}

/**
 * Активный раздел — тот, что пересекает середину экрана.
 * Закреплённые сцены длинные, поэтому узкая полоса в центре надёжнее порогов видимости.
 */
function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    const els = sections
      .map((x) => document.getElementById(x.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // Над первым разделом (обложка) индикатор скрыт
    const hero = document.getElementById("top");
    const heroIo = hero
      ? new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "-50% 0px -50% 0px" })
      : null;
    if (hero) heroIo!.observe(hero);
    return () => {
      io.disconnect();
      heroIo?.disconnect();
    };
  }, []);
  return active;
}
