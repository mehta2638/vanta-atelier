"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { anatomy, type Detail } from "@/content/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskLine, Reveal } from "@/components/ui/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;
/** Где на кадре горит фонарь — возвращаем ему цвет, как в главе I */
const lampGlow: Partial<Record<Detail["id"], string>> = {};

const lineColor: Record<Detail["car"], string> = {
  porsche: "#8e1f2d",
  bmw: "#1f4f8f",
  mercedes: "#a8845a",
};
const items = anatomy.items;
const N = items.length;

/**
 * Анатомия: закреплённая сцена, в которой крупные планы проявляются
 * по очереди — каждый через свою форму (линза, линия, круг, ромб, прочерк, подъём).
 * Предыдущий кадр отступает в темноту, подпись и оглавление меняются синхронно.
 */
export function Anatomy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: g } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(g, "change", (v) => setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N * 1.0001)))));
  // Прогресс плавно меняет цвет вслед за машиной-источником детали
  const fill = useTransform(
    g,
    items.map((_, i) => (i + 0.5) / N),
    items.map((it) => lineColor[it.car]),
  );

  return (
    <section id="anatomy" aria-labelledby="anatomy-title" className="relative bg-black">
      <div className="container-x pt-[clamp(112px,18vh,220px)] pb-[clamp(48px,8vh,96px)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index="02">{anatomy.label}</SectionLabel>
            <h2 id="anatomy-title" className="mt-8 text-display text-[clamp(44px,6.6vw,112px)] md:mt-10">
              <MaskLine>{anatomy.title[0]}</MaskLine>
              <MaskLine delay={0.08}>
                <span className="text-offwhite/35">в </span>
                <span className="text-serif-accent text-[1.12em] text-offwhite">деталях.</span>
              </MaskLine>
            </h2>
          </div>
          <Reveal delay={0.2} className="lg:col-span-4 lg:pb-4">
            <p className="max-w-[380px] text-[15px] leading-[1.65] text-muted lg:ml-auto">{anatomy.lead}</p>
          </Reveal>
        </div>
      </div>

      <div ref={ref} style={{ height: `${N * 90 + 100}svh` }} className="relative">
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Кадры */}
          {items.map((item, i) => (
            <Frame key={item.id} item={item} index={i} g={g} />
          ))}

          {/* Затемнение под подписью */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.9)_0%,rgb(0_0_0/0.5)_30%,transparent_55%)] lg:bg-[linear-gradient(to_top_right,rgb(0_0_0/0.85)_0%,transparent_45%)]"
          />

          {/* Прогресс сверху */}
          <div className="container-x absolute inset-x-0 top-[calc(var(--header-h)+8px)]">
            <div className="relative h-px bg-line">
              <motion.span style={{ scaleX: g, backgroundColor: fill }} className="absolute inset-0 origin-left" />
            </div>
          </div>

          <Caption item={items[active]} index={active} />
          <Index active={active} />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Геометрия кадров: у каждой детали своё место и форма
   ───────────────────────────────────────────── */
const geometry: Record<Detail["reveal"], string> = {
  // фара — линза справа сверху
  lens: "left-0 top-[16%] w-full aspect-[1.84] lg:left-[38%] lg:top-[13%] lg:w-[54vw]",
  // линия кузова — широкая лента
  line: "-left-[30vw] top-[20%] w-[160vw] h-[40vw] lg:left-0 lg:top-[16%] lg:w-full lg:h-[25vw]",
  // колесо — круг
  circle: "left-1/2 top-[12%] w-[80vw] aspect-square -translate-x-1/2 lg:left-auto lg:right-[9%] lg:top-1/2 lg:w-[64vh] lg:translate-x-0 lg:-translate-y-1/2",
  // салон — ромб раскрывается в прямоугольник
  diamond: "left-0 top-[14%] w-full aspect-[1.53] lg:left-[36%] lg:top-[11%] lg:w-[52vw]",
  // световая полоса — прочерк
  slit: "-left-[25vw] top-[24%] w-[150vw] h-[35vw] lg:left-0 lg:top-[25%] lg:w-full lg:h-[23.5vw]",
  // покрытие — поднимается на весь экран
  rise: "inset-0",
};

function clipFor(kind: Detail["reveal"], r: number) {
  switch (kind) {
    case "lens":
      return `ellipse(${r * 72}% ${r * 72}% at 55% 50%)`;
    case "line":
      return `inset(${(1 - r) * 50}% 0 ${(1 - r) * 50}% 0)`;
    case "circle":
      return `circle(${r * 50}% at 50% 50%)`;
    case "diamond":
      return `polygon(50% ${50 - 100 * r}%, ${50 + 100 * r}% 50%, 50% ${50 + 100 * r}%, ${50 - 100 * r}% 50%)`;
    case "slit":
      return `inset(${(1 - r) * 46}% ${(1 - r) * 100}% ${(1 - r) * 46}% 0)`;
    case "rise":
      return `inset(${(1 - r) * 100}% 0 0 0)`;
  }
}

function Frame({ item, index, g }: { item: Detail; index: number; g: MotionValue<number> }) {
  const start = index / N;
  const seg = 1 / N;
  // Проявление — первые 55% своего отрезка
  const r = useTransform(g, [start, start + seg * 0.55], [0, 1], { clamp: true });
  // Уход — когда проявляется следующий кадр
  const next = useTransform(g, [start + seg, start + seg * 1.55], [0, 1], { clamp: true });
  const clipPath = useTransform(r, (v) => clipFor(item.reveal, v));
  const imgScale = useTransform(r, [0, 1], [1.35, 1]);
  const opacity = useTransform(next, [0, 1], [1, index === N - 1 ? 1 : 0]);
  const scale = useTransform(next, [0, 1], [1, 0.94]);
  const brackets = useTransform(r, [0.7, 1], [0, 1]);

  return (
    <motion.div style={{ opacity, scale }} className={`accent-${item.car} absolute ${geometry[item.reveal]}`}>
      <motion.div style={{ clipPath }} className="absolute inset-0 overflow-hidden">
        <motion.div style={{ scale: imgScale }} className="absolute inset-0">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes={item.reveal === "circle" ? "(min-width: 1024px) 64vh, 80vw" : "(min-width: 1024px) 60vw, 150vw"}
            placeholder="blur"
            className="object-cover"
          />
          {lampGlow[item.id] && (
            <div
              aria-hidden
              style={{ backgroundImage: `radial-gradient(${lampGlow[item.id]!.replaceAll("_", " ")}, var(--color-porsche) 0%, transparent 100%)` }}
              className="absolute inset-0 opacity-75 mix-blend-color"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Фокус-скобки инспекции */}
      {item.reveal !== "circle" && item.reveal !== "rise" && (
        <motion.div aria-hidden style={{ opacity: brackets }} className="pointer-events-none absolute -inset-2.5 max-lg:hidden">
          {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "right-0 bottom-0 border-r border-b"].map((c) => (
            <span key={c} className={`absolute size-5 border-(--accent-line) ${c}`} />
          ))}
        </motion.div>
      )}
      {item.reveal === "circle" && (
        <motion.svg aria-hidden style={{ opacity: brackets }} viewBox="0 0 100 100" className="pointer-events-none absolute -inset-4 size-[calc(100%+2rem)]">
          <circle cx="50" cy="50" r="49.5" fill="none" stroke="var(--accent-line)" strokeOpacity="0.9" strokeWidth="0.2" strokeDasharray="0.6 1.4" vectorEffect="non-scaling-stroke" />
        </motion.svg>
      )}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Подпись текущей детали
   ───────────────────────────────────────────── */
function Caption({ item, index }: { item: Detail; index: number }) {
  return (
    <div className="container-x absolute inset-x-0 bottom-0 pb-[max(24px,env(safe-area-inset-bottom))] lg:pb-12">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease }}
          className={`accent-${item.car} max-w-[460px]`}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-[clamp(44px,5vw,72px)] leading-none text-(--accent)">
              0{index + 1}
            </span>
            <span className="text-label text-subtle">/ 0{N}</span>
            <span className="text-label ml-auto text-offwhite/45 lg:ml-6">{item.source}</span>
          </div>
          <h3 className="mt-4 flex items-baseline gap-4">
            <span className="text-display text-[clamp(44px,5.6vw,88px)]">{item.title}</span>
            <span className="text-serif-accent text-[clamp(20px,1.8vw,28px)] whitespace-nowrap text-offwhite/50">{item.en}</span>
          </h3>
          <p className="mt-4 text-[15px] leading-[1.6] text-offwhite/70">{item.text}</p>
          <p className="text-label mt-5 border-t border-(--accent-line)/60 pt-4 text-(--accent)">{item.note}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Оглавление деталей справа (desktop) */
function Index({ active }: { active: number }) {
  return (
    <ol className="absolute top-1/2 right-(--gutter) hidden -translate-y-1/2 space-y-3 lg:block" aria-label="Детали">
      {items.map((item, i) => (
        <li
          key={item.id}
          className={`accent-${item.car} flex items-center justify-end gap-3 text-label transition-colors duration-500 ${
            i === active ? "text-offwhite" : "text-offwhite/30"
          }`}
        >
          <span>{item.title}</span>
          <span
            aria-hidden
            className={`h-px transition-all duration-500 ease-out-expo ${
              i === active ? "w-10 bg-(--accent)" : "w-4 bg-current"
            }`}
          />
        </li>
      ))}
    </ol>
  );
}
