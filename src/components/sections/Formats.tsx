"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { cars, formats, type Format } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskLine, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;
/** Кольцо фокуса на подписи, когда фокус у визуально скрытого radio */
const focusRing =
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-offwhite/70";

/**
 * 05 — Форматы. Конфигуратор: автомобиль × глубина работы.
 * Цвет секции следует за выбранной машиной (переход — через CSS-переменные).
 */
export function Formats() {
  const [carIdx, setCarIdx] = useState(0);
  const [fmtIdx, setFmtIdx] = useState(1);
  const formatName = `format-${useId()}`;
  const car = cars[carIdx];
  const format = formats.items[fmtIdx];

  return (
    <section
      id="formats"
      aria-labelledby="formats-title"
      className={`accent-${car.id} relative border-t border-line bg-graphite-950 py-[clamp(112px,18vh,220px)]`}
    >
      <div className="container-x">
        {/* Вступление зеркально «Главам»: лид слева, заголовок справа */}
        <SectionLabel index="05">{formats.label}</SectionLabel>
        <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end">
          <Reveal delay={0.2} className="lg:order-1 lg:col-span-4 lg:pb-4">
            <p className="max-w-[360px] border-l border-(--accent-line) pl-5 text-[15px] leading-[1.65] text-muted transition-colors duration-700">
              {formats.lead}
            </p>
          </Reveal>
          <div className="lg:order-2 lg:col-span-8 lg:text-right">
            <h2 id="formats-title" className="text-display text-[clamp(44px,6.6vw,112px)]">
              <MaskLine>{formats.title.lead}</MaskLine>
              <MaskLine delay={0.08}>
                <span className="text-serif-accent text-[1.12em] text-(--accent) transition-colors duration-700">
                  {formats.title.accent}
                </span>
              </MaskLine>
            </h2>
          </div>
        </div>

        <div className="mt-[clamp(56px,10vh,112px)] grid gap-10 lg:grid-cols-12 lg:gap-[4vw]">
          {/* ── Кадр автомобиля ─────────────────── */}
          <div className="lg:col-span-7">
            <CarSelector value={carIdx} onChange={setCarIdx} className="mb-6 lg:hidden" />
            <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)]">
              <figure className="relative aspect-4/3 overflow-hidden bg-black lg:aspect-5/4">
                {cars.map((c, i) => (
                  <div
                    key={c.id}
                    className={`absolute inset-0 transition-[opacity,transform] duration-1000 ease-out-expo ${
                      i === carIdx ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"
                    }`}
                  >
                    <Image
                      src={c.images.main.src}
                      alt={i === carIdx ? c.images.main.alt : ""}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      style={{ objectPosition: c.images.main.position }}
                      className="grade object-cover"
                    />
                  </div>
                ))}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.85)_0%,transparent_50%),linear-gradient(to_bottom,rgb(10_10_11/0.5)_0%,transparent_25%)]"
                />

                <figcaption className="absolute inset-0 flex flex-col justify-end p-5 sm:justify-between sm:p-7">
                  <p className="text-label flex items-center gap-3 text-offwhite/60 max-sm:hidden">
                    <span className="h-px w-6 bg-(--accent-line) transition-colors duration-700" />
                    Фокус · {car.focus}
                  </p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <p className="font-serif text-[clamp(28px,3vw,44px)] leading-none text-(--accent)">
                        {car.numeral}
                      </p>
                      <p className="mt-2 flex flex-wrap items-baseline gap-x-4">
                        <span className="text-display text-[clamp(40px,5.6vw,88px)]">
                          {car.brand} {car.model}
                        </span>
                        <span className="text-serif-accent text-[clamp(22px,2.2vw,34px)] text-offwhite/70">
                          {car.archetype}
                        </span>
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </figcaption>
              </figure>
            </div>
          </div>

          {/* ── Конфигурация ─────────────────────── */}
          <div className="lg:col-span-5">
            <CarSelector value={carIdx} onChange={setCarIdx} className="max-lg:hidden" />

            <fieldset className="mt-2 min-w-0 lg:mt-12">
            <legend className="text-label text-offwhite/55">{formats.formatLabel}</legend>
            <div className="mt-4 border-t border-line">
              {formats.items.map((f, i) => (
                <FormatRow
                  key={f.id}
                  name={formatName}
                  format={f}
                  active={i === fmtIdx}
                  onSelect={() => setFmtIdx(i)}
                />
              ))}
            </div>
            </fieldset>

            <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-label text-offwhite/55">
                  {formats.priceLabel} · {car.brand} {car.model} · {format.name}
                </p>
                <p className="mt-3 font-display text-[clamp(40px,4.4vw,64px)] leading-none tracking-[-0.04em]">
                  <span className="text-serif-accent mr-3 text-[0.62em] text-offwhite/50">от</span>
                  <Price value={format.price[car.id]} />
                  <span className="ml-2 text-[0.5em] text-offwhite/50">₽</span>
                </p>
              </div>
              <p className="font-mono text-[12px] text-offwhite/50">{format.duration}</p>
            </div>

            <p className="mt-6 max-w-[44ch] text-[13px] leading-[1.6] text-offwhite/55">{formats.note}</p>
            <Button href={formats.cta.href} size="lg" className="mt-8 max-sm:w-full">
              {formats.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Выбор автомобиля
   ───────────────────────────────────────────── */
function CarSelector({
  value,
  onChange,
  className = "",
}: {
  value: number;
  onChange: (i: number) => void;
  className?: string;
}) {
  // У каждой копии (mobile / desktop) своя группа — иначе radio с одним name слились бы
  const name = `car-${useId()}`;
  return (
    <fieldset className={`min-w-0 ${className}`}>
      <legend className="text-label text-offwhite/55">{formats.carLabel}</legend>
      <div className="mt-4 grid grid-cols-3 border-b border-line">
        {cars.map((c, i) => {
          const on = i === value;
          return (
            <label
              key={c.id}
              className={`accent-${c.id} group relative flex cursor-pointer items-baseline gap-2.5 pb-4 text-left ${focusRing}`}
            >
              <input
                type="radio"
                name={name}
                value={c.id}
                checked={on}
                onChange={() => onChange(i)}
                className="sr-only"
              />
              <span
                className={`font-serif text-[18px] transition-colors duration-500 ${
                  on ? "text-(--accent)" : "text-offwhite/55 group-hover:text-(--accent)"
                }`}
              >
                {c.numeral}
              </span>
              <span
                className={`text-[14px] transition-colors duration-500 sm:text-[15px] ${
                  on ? "text-offwhite" : "text-offwhite/55 group-hover:text-offwhite/80"
                }`}
              >
                {c.brand}
                <span className="max-sm:hidden"> {c.model}</span>
              </span>
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-px h-px origin-left bg-(--accent) transition-transform duration-700 ease-out-expo ${
                  on ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ─────────────────────────────────────────────
   Формат работы
   ───────────────────────────────────────────── */
function FormatRow({
  name,
  format,
  active,
  onSelect,
}: {
  name: string;
  format: Format;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div className="border-b border-line">
      <label className={`group flex w-full cursor-pointer items-baseline gap-4 py-5 text-left ${focusRing}`}>
        <input
          type="radio"
          name={name}
          value={format.id}
          checked={active}
          onChange={onSelect}
          className="sr-only"
        />
        <span
          aria-hidden
          className={`relative top-[-0.2em] size-2 shrink-0 self-center rounded-full border transition-colors duration-500 ${
            active ? "border-(--accent) bg-(--accent)" : "border-offwhite/30"
          }`}
        />
        <span
          className={`font-display text-[clamp(26px,2.4vw,34px)] leading-none font-medium tracking-[-0.03em] transition-colors duration-500 ${
            active ? "text-offwhite" : "text-offwhite/55 group-hover:text-offwhite/80"
          }`}
        >
          {format.name}
        </span>
        <span className="text-serif-accent text-[18px] text-offwhite/55 max-sm:hidden">{format.subtitle}</span>
        <span className="ml-auto font-mono text-[11px] text-offwhite/55">{format.duration}</span>
      </label>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease }}
            className="overflow-hidden"
          >
            <p className="text-serif-accent -mt-1 pl-6 text-[18px] text-offwhite/55 sm:hidden">{format.subtitle}</p>
            <ul className="grid gap-2.5 pt-2 pb-6 pl-6">
              {format.includes.map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease }}
                  className="flex items-center gap-3 text-[14px] text-offwhite/75"
                >
                  <span aria-hidden className="h-px w-3 bg-(--accent-line) transition-colors duration-700" />
                  {line}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Цифры цены «перекатываются» к новому значению */
function Price({ value }: { value: number }) {
  const mv = useSpring(value, { stiffness: 90, damping: 22 });
  useEffect(() => {
    mv.set(value);
  }, [mv, value]);
  const text = useTransform(mv, (v) =>
    String(Math.round(v / 1000) * 1000).replace(/\B(?=(\d{3})+(?!\d))/g, " "),
  );
  return <motion.span className="tabular-nums">{text}</motion.span>;
}
