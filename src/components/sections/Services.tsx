"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { cars, services, type Service } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskLine, Reveal } from "@/components/ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;
const items = services.items;

/**
 * 04 — Услуги. Журнальное «оглавление работ».
 * Desktop: слева закреплённый кадр текущей работы, справа список;
 * активная строка — под курсором или проходящая центр экрана.
 * Mobile: компактные строки с миниатюрой.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const current = hover ?? active;

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative border-t border-line bg-black py-[clamp(112px,18vh,220px)]"
    >
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="04">{services.label}</SectionLabel>
            <h2 id="services-title" className="mt-8 text-display text-[clamp(44px,6.6vw,112px)] md:mt-10">
              <MaskLine>{services.title.lead}</MaskLine>
              <MaskLine delay={0.08}>
                <span className="text-serif-accent text-[1.12em]">{services.title.accent}</span>
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4 lg:pb-4">
            <p className="max-w-[400px] text-[15px] leading-[1.65] text-muted lg:ml-auto">{services.lead}</p>
          </Reveal>
        </div>

        <div className="mt-[clamp(56px,10vh,120px)] grid gap-x-[6vw] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <StickyFrame current={current} />

          <ol className="border-t border-line" onPointerLeave={() => setHover(null)}>
            {items.map((item, i) => (
              <Row
                key={item.id}
                item={item}
                index={i}
                active={current === i}
                dimmed={hover !== null && hover !== i}
                onHover={() => setHover(i)}
                onCenter={setActive}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Кадр текущей работы (desktop)
   ───────────────────────────────────────────── */
function StickyFrame({ current }: { current: number }) {
  const item = items[current];
  return (
    <div className="max-lg:hidden">
      <div className="sticky top-[calc(var(--header-h)+32px)]">
        <div className="relative aspect-4/5 overflow-hidden bg-graphite-900">
          {items.map((it, i) => (
            <div
              key={it.id}
              className={`absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-out-expo ${
                i === current ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
              }`}
            >
              <Image
                src={it.image.src}
                alt={i === current ? it.image.alt : ""}
                fill
                sizes="(min-width: 1024px) 38vw, 1px"
                placeholder="blur"
                className="object-cover"
              />
            </div>
          ))}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.8),transparent_45%)]"
          />
          {/* Метки обреза */}
          {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "right-3 bottom-3 border-r border-b"].map((c) => (
            <span key={c} aria-hidden className={`absolute size-3.5 border-offwhite/40 ${c}`} />
          ))}

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease }}
                className="flex items-baseline gap-4"
              >
                <span className="font-serif text-[72px] leading-none">0{current + 1}</span>
                <span className="text-serif-accent text-[26px] text-offwhite/70">{item.en}</span>
              </motion.p>
            </AnimatePresence>
            <p className="text-label text-offwhite/45">/ 0{items.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Строка работы
   ───────────────────────────────────────────── */
function Row({
  item,
  index,
  active,
  dimmed,
  onHover,
  onCenter,
}: {
  item: Service;
  index: number;
  active: boolean;
  dimmed: boolean;
  onHover: () => void;
  onCenter: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Строка «активна», когда проходит узкую полосу в центре экрана
  const centered = useInView(ref, { margin: "-48% 0px -48% 0px" });
  useEffect(() => {
    if (centered) onCenter(index);
  }, [centered, onCenter, index]);

  return (
    <li
      ref={ref}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover()}
      className={`group relative border-b border-line transition-opacity duration-500 ${dimmed ? "lg:opacity-40" : ""}`}
    >
      {/* Линия активной строки */}
      <span
        aria-hidden
        className={`absolute -top-px left-0 h-px w-full origin-left bg-offwhite/70 transition-transform duration-700 ease-out-expo max-lg:hidden ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />

      <div className="grid grid-cols-[1fr_88px] gap-x-5 py-7 sm:grid-cols-[1fr_120px] lg:grid-cols-[56px_1fr] lg:gap-x-6 lg:py-10">
        <span className="font-mono text-[12px] text-subtle max-lg:hidden lg:pt-3">0{index + 1}</span>

        <div className="min-w-0">
          <p className="font-mono text-[11px] text-subtle lg:hidden">0{index + 1}</p>
          <h3 className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:mt-0">
            <span
              className="font-display text-[clamp(26px,6.4vw,34px)] leading-[1.05] font-medium tracking-[-0.03em] lg:text-[clamp(32px,2.7vw,46px)]"
            >
              {item.title}
            </span>
            <span className="text-serif-accent text-[18px] text-offwhite/40 max-sm:hidden lg:text-[22px]">
              {item.en}
            </span>
          </h3>

          <p
            className={`mt-4 max-w-[52ch] text-[14px] leading-[1.65] transition-colors duration-500 lg:text-[15px] ${
              active ? "text-offwhite/70" : "text-muted"
            }`}
          >
            {item.text}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[12px]">
            <span className="text-offwhite/85">{item.price}</span>
            <span className="text-offwhite/45">{item.duration}</span>
            <Chapters ids={item.chapters} />
          </div>
        </div>

        {/* Миниатюра (mobile / tablet) */}
        <div className="relative aspect-square self-start overflow-hidden lg:hidden">
          <Image
            src={item.image.src}
            alt=""
            fill
            sizes="120px"
            style={{ objectPosition: item.image.position }}
            className="object-cover"
          />
        </div>
      </div>
    </li>
  );
}

/** Метки глав I · II · III: включённые — в цвете своей машины */
function Chapters({ ids }: { ids: Service["chapters"] }) {
  return (
    <span className="flex items-center gap-3" aria-label={`${services.chaptersLabel}: ${ids.length}`}>
      <span className="text-label text-[10px] text-offwhite/30 max-sm:hidden">{services.chaptersLabel}</span>
      {cars.map((car) => {
        const on = ids.includes(car.id);
        return (
          <span
            key={car.id}
            title={`${car.brand} ${car.model}`}
            className={`accent-${car.id} font-serif text-[16px] leading-none ${
              on ? "text-(--accent)" : "text-offwhite/15"
            }`}
          >
            {car.numeral}
          </span>
        );
      })}
    </span>
  );
}
