"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { cars, chapters } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskLine, Reveal } from "@/components/ui/Reveal";

/**
 * Три главы — три разных разворота.
 * Desktop: закреплённая горизонтальная лента. Mobile: полноэкранные листы,
 * которые наезжают друг на друга.
 *
 * Каждая глава получает `p` — локальный прогресс 0→1
 * (0.5 — глава точно в кадре) и сама решает, как на него реагировать.
 */
export function Characters() {
  return (
    <section id="chapters" aria-labelledby="chapters-title" className="relative bg-black">
      <Intro />
      <DesktopTrack />
      <MobileStack />
    </section>
  );
}

const CHAPTERS = [ChapterPorsche, ChapterBmw, ChapterMercedes];

function Intro() {
  return (
    <div className="container-x pt-[clamp(112px,18vh,220px)] pb-[clamp(64px,12vh,140px)]">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <SectionLabel index="01">{chapters.label}</SectionLabel>
          <h2 id="chapters-title" className="mt-8 text-display text-[clamp(44px,6.6vw,112px)] md:mt-10">
            <MaskLine>{chapters.title[0]}</MaskLine>
            <MaskLine delay={0.08}>
              <span className="text-offwhite/35">со </span>
              <span className="text-serif-accent text-[1.12em] text-offwhite">всеми.</span>
            </MaskLine>
          </h2>
        </div>
        <Reveal delay={0.2} className="lg:col-span-4 lg:pb-4">
          <p className="max-w-[400px] text-[15px] leading-[1.65] text-muted lg:ml-auto">
            {chapters.lead}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop: горизонтальная лента
   ───────────────────────────────────────────── */
function DesktopTrack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: g } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Каждая глава немного «задерживается» в кадре
  const x = useTransform(g, [0, 0.1, 0.42, 0.58, 0.9, 1], ["0vw", "0vw", "-100vw", "-100vw", "-200vw", "-200vw"]);
  const [active, setActive] = useState(0);
  useMotionValueEvent(g, "change", (v) => setActive(v < 0.26 ? 0 : v < 0.74 ? 1 : 2));

  return (
    <div ref={ref} className="relative h-[380vh] max-lg:hidden">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          {CHAPTERS.map((Chapter, i) => (
            <DesktopSlot key={i} g={g} index={i}>
              {(p) => <Chapter p={p} />}
            </DesktopSlot>
          ))}
        </motion.div>

        {/* Оглавление-прогресс */}
        <nav aria-label="Главы" className="container-x absolute inset-x-0 bottom-7 z-20">
          <div className="relative h-px bg-line-strong">
            <motion.span style={{ scaleX: g }} className="absolute inset-0 origin-left bg-offwhite/70" />
          </div>
          <ol className="mt-4 grid grid-cols-3">
            {cars.map((car, i) => (
              <li
                key={car.id}
                className={`flex items-baseline gap-3 transition-colors duration-500 ${
                  i === 1 ? "justify-center" : i === 2 ? "justify-end" : ""
                } ${active === i ? "text-offwhite" : "text-offwhite/35"}`}
              >
                <span className="font-serif text-[16px] text-titanium">{car.numeral}</span>
                <span className="text-label">
                  {car.brand} {car.model}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}

function DesktopSlot({
  g,
  index,
  children,
}: {
  g: MotionValue<number>;
  index: number;
  children: (p: MotionValue<number>) => React.ReactNode;
}) {
  const centers = [0.05, 0.5, 0.95];
  const c = centers[index];
  const p = useTransform(g, [c - 0.45, c, c + 0.45], [0, 0.5, 1]);
  return <div className="relative h-full w-screen shrink-0 overflow-hidden">{children(p)}</div>;
}

/* ─────────────────────────────────────────────
   Mobile / tablet: листы, наезжающие друг на друга
   ───────────────────────────────────────────── */
function MobileStack() {
  return (
    <div className="lg:hidden">
      {CHAPTERS.map((Chapter, i) => (
        <MobileSlot key={i}>{(p) => <Chapter p={p} />}</MobileSlot>
      ))}
    </div>
  );
}

function MobileSlot({ children }: { children: (p: MotionValue<number>) => React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Лист «прилипает», только когда долистан до своего низа:
  // top = 100svh − высота листа. Так высокий лист читается целиком,
  // а следующий наезжает на него уже после.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} className="sticky top-0 min-h-svh overflow-hidden">
      {children(p)}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Общие мелочи
   ───────────────────────────────────────────── */
function ChapterHead({ index, tone = "text-offwhite/55" }: { index: number; tone?: string }) {
  const car = cars[index];
  return (
    <div className={`flex items-center gap-3 text-label whitespace-nowrap max-sm:text-[10px] max-sm:tracking-[0.08em] sm:gap-4 ${tone}`}>
      <span className="text-titanium">Глава {car.numeral}</span>
      <span aria-hidden className="h-px flex-1 bg-current opacity-30" />
      <span>{car.keywords.join(" · ")}</span>
    </div>
  );
}

function Spec({ index, className = "" }: { index: number; className?: string }) {
  const car = cars[index];
  return (
    <dl className={`grid grid-cols-[88px_1fr] gap-y-3 border-t border-current/15 pt-4 text-[13px] ${className}`}>
      <dt className="text-label opacity-50">Программа</dt>
      <dd>{car.program.join(" · ")}</dd>
      <dt className="text-label opacity-50">Фокус</dt>
      <dd>{car.focus}</dd>
    </dl>
  );
}

/* ─────────────────────────────────────────────
   I · Porsche 911 — точность, чертёж, симметрия
   ───────────────────────────────────────────── */
const annotations = [
  { label: "Антикрыло", x: 24, y: 28, side: "right" },
  { label: "Сквозной фонарь", x: 76, y: 46, side: "left" },
  { label: "Решётка мотора", x: 40, y: 36, side: "right" },
] as const;

function ChapterPorsche({ p }: { p: MotionValue<number> }) {
  const car = cars[0];
  const reveal = useTransform(p, [0.18, 0.42], [0, 1]);
  const clipPath = useTransform(reveal, (v) => `inset(${(1 - v) * 50}% 0 ${(1 - v) * 50}% 0)`);
  const imgScale = useTransform(p, [0.2, 0.5, 1], [1.2, 1.04, 1]);
  const marks = useTransform(p, [0.36, 0.48], [0, 1]);
  const titleY = useTransform(p, [0, 0.5, 1], ["30%", "0%", "-20%"]);

  return (
    <div className="blueprint relative flex min-h-svh flex-col bg-black px-(--gutter) pt-[calc(var(--header-h)+20px)] pb-12 lg:h-full lg:pb-[104px]">
      <ChapterHead index={0} />

      <div className="relative mt-8 flex flex-1 flex-col lg:mt-0 lg:grid lg:grid-cols-[1fr_minmax(0,50vw)_1fr] lg:items-center lg:gap-10">
        {/* Левая колонка: архетип */}
        <div className="order-2 mt-8 lg:order-none lg:mt-0 lg:self-center">
          <p className="text-serif-accent text-[clamp(40px,4.4vw,72px)] leading-none">{car.archetype}</p>
          <p className="mt-4 max-w-[26ch] text-[15px] leading-[1.6] text-offwhite/60">{car.motto}</p>
        </div>

        {/* Кадр-чертёж */}
        <div className="relative order-1 lg:order-none">
          <motion.figure style={{ clipPath }} className="relative aspect-3/2 overflow-hidden">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image
                src={car.images.main.src}
                alt={car.images.main.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                style={{ objectPosition: car.images.main.position }}
                className="grade object-cover"
              />
            </motion.div>
          </motion.figure>

          {/* Метки обреза и размерная линия */}
          <motion.div aria-hidden style={{ opacity: marks }} className="pointer-events-none absolute -inset-3 lg:-inset-5">
            {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "right-0 bottom-0 border-r border-b"].map((c) => (
              <span key={c} className={`absolute size-4 border-titanium/70 ${c}`} />
            ))}
          </motion.div>
          <motion.div aria-hidden style={{ opacity: marks }} className="absolute inset-x-0 -top-8 flex items-center gap-3 text-label text-titanium/80 max-lg:hidden">
            <span className="h-px flex-1 bg-titanium/40" />
            <span>Силуэт с 1963 года</span>
            <span className="h-px flex-1 bg-titanium/40" />
          </motion.div>

          {/* Выноски */}
          {annotations.map((a, i) => (
            <Annotation key={a.label} {...a} n={i + 1} progress={marks} />
          ))}
        </div>

        {/* Правая колонка: текст главы */}
        <div className="order-3 mt-6 text-offwhite/80 lg:order-none lg:mt-0 lg:self-center">
          <p className="text-[15px] leading-[1.65] text-offwhite/60 max-sm:line-clamp-4">{car.chapter}</p>
          <Spec index={0} className="mt-6" />
        </div>
      </div>

      {/* Название — поверх нижнего края кадра */}
      <motion.h3
        style={{ y: titleY }}
        className="order-last mt-8 text-center text-display text-[clamp(56px,15vw,96px)] lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-[112px] lg:mt-0 lg:text-[clamp(96px,10vw,176px)]"
      >
        {car.brand} <span className="text-serif-accent">{car.model}</span>
      </motion.h3>
    </div>
  );
}

function Annotation({
  label,
  x,
  y,
  side,
  n,
  progress,
}: {
  label: string;
  x: number;
  y: number;
  side: "left" | "right";
  n: number;
  progress: MotionValue<number>;
}) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div
      className={`pointer-events-none absolute flex -translate-y-1/2 items-center ${side === "left" ? "flex-row-reverse translate-x-1" : "-translate-x-1"} ${n > 2 ? "max-sm:hidden" : ""}`}
      style={side === "left" ? { right: `${100 - x}%`, top: `${y}%` } : { left: `${x}%`, top: `${y}%` }}
    >
      <span className="relative z-10 block size-2 shrink-0 rounded-full border border-offwhite bg-black" />
      <span className="relative h-px w-[clamp(24px,4vw,56px)]">
        <motion.span style={{ width }} className={`absolute top-0 block h-px bg-offwhite/60 ${side === "left" ? "right-0" : "left-0"}`} />
      </span>
      <motion.span
        style={{ opacity: progress }}
        className="px-2 text-label whitespace-nowrap text-offwhite/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.9)]"
      >
        <span className="text-titanium">0{n}</span> {label}
      </motion.span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   II · BMW M — агрессия, диагональ, контраст
   ───────────────────────────────────────────── */
function ChapterBmw({ p }: { p: MotionValue<number> }) {
  const car = cars[1];
  const open = useTransform(p, [0.15, 0.45], [0, 1]);
  const clipDesktop = useTransform(open, (v) => `polygon(0 0, ${62 * v}% 0, ${46 * v}% 100%, 0 100%)`);
  const imgX = useTransform(p, [0, 1], ["8%", "-8%"]);
  const wordX = useTransform(p, [0, 0.5, 1], ["22%", "0%", "-14%"]);
  const lineScale = useTransform(p, [0.3, 0.55], [0, 1]);

  return (
    <div className="relative flex min-h-svh flex-col bg-[#050505] lg:h-full">
      {/* Кадр: на desktop — диагональный срез, на mobile — скошенный низ */}
      <motion.div
        style={{ clipPath: clipDesktop }}
        className="absolute inset-0 max-lg:hidden"
      >
        <motion.div style={{ x: imgX }} className="absolute -inset-x-[10%] inset-y-0">
          <Image
            src={car.images.main.src}
            alt={car.images.main.alt}
            fill
            sizes="80vw"
            style={{ objectPosition: car.images.main.position, filter: "grayscale(1) contrast(1.35) brightness(0.8)" }}
            className="object-cover"
          />
        </motion.div>
      </motion.div>
      <div className="relative h-[54svh] overflow-hidden [clip-path:polygon(0_0,100%_0,100%_74%,0_100%)] lg:hidden">
        <motion.div style={{ x: imgX }} className="absolute -inset-x-[10%] inset-y-0">
          <Image
            src={car.images.main.src}
            alt=""
            fill
            sizes="120vw"
            style={{ objectPosition: car.images.main.position, filter: "grayscale(1) contrast(1.35) brightness(0.8)" }}
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Титановая кромка по диагонали */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full max-lg:hidden" preserveAspectRatio="none" viewBox="0 0 100 100">
        <motion.line
          x1="62" y1="0" x2="46" y2="100"
          stroke="var(--color-titanium)" strokeWidth="0.12" vectorEffect="non-scaling-stroke"
          style={{ pathLength: lineScale }}
        />
      </svg>

      {/* Линии скорости */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden max-lg:hidden">
        {[22, 38, 71].map((top, i) => (
          <span
            key={top}
            className="speed-line absolute right-0 h-px w-[40vw] bg-linear-to-r from-transparent via-offwhite/40 to-transparent"
            style={{ top: `${top}%`, animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </div>

      <div className="relative flex flex-1 flex-col px-(--gutter) pt-8 pb-12 lg:pt-[calc(var(--header-h)+20px)] lg:pb-[104px]">
        <div className="lg:ml-auto lg:w-[34%]">
          <ChapterHead index={1} />
          <p className="mt-6 text-[15px] leading-[1.65] text-offwhite/65 max-sm:line-clamp-4 lg:mt-10">{car.chapter}</p>
          <Spec index={1} className="mt-6 text-offwhite/80" />
        </div>

        <div className="flex-1" />

        {/* Огромное слово со сдвигом — «входит» в кадр */}
        <motion.p
          style={{ x: wordX, skewX: -10 }}
          className="mt-8 pr-[0.06em] text-right font-display text-[clamp(56px,15.5vw,120px)] leading-[0.8] font-semibold tracking-[-0.055em] uppercase lg:mt-0 lg:text-[14vw]"
        >
          {car.archetype}
        </motion.p>
        <div className="mt-5 flex items-baseline justify-between gap-6 lg:mt-7">
          <h3 className="shrink-0 text-display text-[clamp(28px,3vw,48px)] whitespace-nowrap">
            {car.brand} <span className="text-titanium">{car.model}</span>
          </h3>
          <p className="text-serif-accent text-right text-[clamp(20px,1.8vw,28px)] text-offwhite/70">{car.motto}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   III · Mercedes-AMG — присутствие, воздух, отпечаток
   ───────────────────────────────────────────── */
function ChapterMercedes({ p }: { p: MotionValue<number> }) {
  const car = cars[2];
  const printY = useTransform(p, [0, 0.5, 1], ["14%", "0%", "-6%"]);
  const imgScale = useTransform(p, [0, 0.5], [1.18, 1]);
  const textOpacity = useTransform(p, [0.25, 0.45], [0, 1]);
  const stripX = useTransform(p, [0, 1], ["10%", "-10%"]);

  return (
    <div className="relative flex min-h-svh flex-col bg-[#12110f] text-[#ece6dc] lg:h-full">
      <div className="relative grid flex-1 gap-10 px-(--gutter) pt-[calc(var(--header-h)+20px)] pb-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-[6vw] lg:pb-[104px]">
        <motion.div style={{ opacity: textOpacity }} className="order-2 lg:order-none lg:max-w-[46vw]">
          <ChapterHead index={2} tone="text-[#ece6dc]/55" />
          <h3 className="mt-8 lg:mt-12">
            <span className="text-label block tracking-[0.4em] text-[#ece6dc]/60">
              {car.brand} — {car.model}
            </span>
            <span className="text-serif-accent mt-3 block text-[clamp(52px,14vw,88px)] leading-[0.95] lg:text-[clamp(88px,7.8vw,152px)]">
              {car.archetype}
            </span>
          </h3>
          <p className="mt-6 max-w-[40ch] font-serif text-[clamp(19px,1.5vw,24px)] leading-[1.45] text-[#ece6dc]/75">
            {car.chapter}
          </p>
          <Spec index={2} className="mt-8 max-w-[520px] text-[#ece6dc]/80" />

          {/* Кинематографичная полоска — студийный кадр */}
          <div className="relative mt-10 aspect-[21/6] max-w-[520px] overflow-hidden max-lg:hidden">
            <motion.div style={{ x: stripX }} className="absolute -inset-x-[12%] inset-y-0">
              <Image
                src={car.images.alt.src}
                alt={car.images.alt.alt}
                fill
                sizes="560px"
                style={{ objectPosition: "50% 55%" }}
                className="grade object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Отпечаток в паспарту */}
        <motion.figure style={{ y: printY }} className="order-1 mx-auto w-[78vw] max-w-[420px] lg:order-none lg:mx-0 lg:w-auto lg:max-w-none">
          <div className="bg-[#1c1a17] p-[clamp(10px,1vw,16px)] shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)]">
            <div className="relative aspect-3/4 overflow-hidden lg:h-[68vh] lg:w-auto">
              <motion.div style={{ scale: imgScale }} className="absolute inset-0">
                <Image
                  src={car.images.main.src}
                  alt={car.images.main.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 78vw"
                  style={{ objectPosition: car.images.main.position, filter: "grayscale(1) sepia(0.12) contrast(1.05) brightness(0.85)" }}
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
          <figcaption className="text-serif-accent mt-4 text-[17px] text-[#ece6dc]/55">
            AMG GT на набережной. Серия «{car.archetype}».
          </figcaption>
        </motion.figure>
      </div>
    </div>
  );
}
