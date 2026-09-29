"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "motion/react";
import { protocol, type ProtocolMark, type ProtocolStage } from "@/content/site";
import { studioCar } from "@/content/media";
import { SectionLabel } from "@/components/ui/SectionLabel";

const ease = [0.22, 1, 0.36, 1] as const;
const stages = protocol.stages;
const N = stages.length;

/**
 * 06 — Протокол. Одна закреплённая сцена «документации ателье»:
 * огромный номер этапа, автомобиль-схема с технической разметкой,
 * шкала этапов. Этапы сменяются прокруткой.
 */
export function Protocol() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => setActive(Math.min(N - 1, Math.max(0, Math.floor(v * N)))));
  const stage = stages[active];

  return (
    <section id="protocol" aria-labelledby="protocol-title" className="accent-porsche relative border-t border-line bg-black">
      <h2 id="protocol-title" className="sr-only">
        {protocol.label}: {protocol.title.lead} {protocol.title.accent}
      </h2>

      <div ref={ref} style={{ height: `${N * 75 + 30}svh` }} className="relative">
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-[calc(var(--header-h)+12px)] pb-[max(18px,env(safe-area-inset-bottom))] lg:pb-8">
          {/* Шапка листа */}
          <div className="container-x flex items-center gap-4">
            <SectionLabel index="06">{protocol.label}</SectionLabel>
            <span aria-hidden className="h-px flex-1 bg-line" />
            <p className="text-label text-offwhite/55 max-md:hidden">{protocol.doc}</p>
            <p aria-hidden className="text-label text-offwhite/60 tabular-nums">
              Лист {stage.n} / 0{N}
            </p>
          </div>

          {/* Сцена */}
          <div className="container-x grid min-h-0 flex-1 content-center gap-y-6 pt-4 lg:grid-cols-12 lg:items-center lg:gap-x-[3vw] lg:pt-0">
            <Scene stage={stage} index={active} className="lg:order-2 lg:col-span-7" />
            <Copy stage={stage} className="lg:order-1 lg:col-span-5" />
          </div>

          <Timeline active={active} progress={p} />

          {/* Весь протокол для скринридера: визуально этапы сменяются по скроллу */}
          <ol className="sr-only">
            {stages.map((st) => (
              <li key={st.n}>
                <h3>
                  {st.n}. {st.title}
                </h3>
                <p>{st.text}</p>
                <dl>
                  {st.specs.map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* Номер, название, текст, параметры */
function Copy({ stage, className = "" }: { stage: ProtocolStage; className?: string }) {
  return (
    <div aria-hidden className={`relative ${className}`}>
      <div className="flex items-end gap-5 lg:block">
        {/* Огромный номер — «перелистывается» */}
        <div className="relative shrink-0 overflow-hidden leading-none">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={stage.n}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-60%", opacity: 0 }}
              transition={{ duration: 0.8, ease }}
              className="font-display text-[clamp(104px,30vw,150px)] leading-[0.8] font-medium tracking-[-0.07em] tabular-nums lg:text-[clamp(160px,min(17vw,30vh),300px)]"
            >
              {stage.n}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.n}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease }}
            className="pb-2 lg:mt-8 lg:pb-0"
          >
            <h3 className="flex flex-wrap items-baseline gap-x-4">
              <span className="text-display text-[clamp(34px,9vw,44px)] lg:text-[clamp(40px,3.6vw,60px)]">{stage.title}</span>
              <span className="text-serif-accent text-[20px] text-offwhite/55 lg:text-[26px]">{stage.en}</span>
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stage.n}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <p className="mt-3 max-w-[40ch] text-[14px] leading-[1.6] text-offwhite/65 lg:mt-5 lg:text-[15px]">{stage.text}</p>
          <dl className="mt-5 max-w-[440px] border-t border-line max-[360px]:hidden lg:mt-8">
            {stage.specs.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-line py-2.5">
                <dt className="text-label text-offwhite/55">{k}</dt>
                <dd className="font-mono text-[12px] text-offwhite/80">{v}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Автомобиль-схема с разметкой этапа */
function Scene({ stage, index, className = "" }: { stage: ProtocolStage; index: number; className?: string }) {
  const mask = { maskImage: `url(${studioCar.src.src})`, WebkitMaskImage: `url(${studioCar.src.src})` };
  return (
    <div className={`relative self-center ${className}`}>
      {/* Рамка листа: метки обреза и оси */}
      <div aria-hidden className="pointer-events-none absolute -inset-x-2 -inset-y-4 lg:-inset-x-6 lg:-inset-y-10">
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "right-0 bottom-0 border-r border-b"].map((c) => (
          <span key={c} className={`absolute size-3 border-offwhite/30 ${c}`} />
        ))}
        <span className="absolute inset-x-6 top-1/2 h-px bg-[repeating-linear-gradient(90deg,rgb(237_235_230/0.12)_0_6px,transparent_6px_12px)]" />
        <span className="absolute inset-y-6 left-1/2 w-px bg-[repeating-linear-gradient(180deg,rgb(237_235_230/0.08)_0_6px,transparent_6px_12px)]" />
      </div>

      <div className="relative aspect-[2208/1200]">
        <div aria-hidden className="absolute inset-x-[4%] bottom-[-4%] h-[18%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.9),transparent_70%)]" />
        <Image
          src={studioCar.src}
          alt={studioCar.alt}
          fill
          sizes="(min-width: 1024px) 56vw, 92vw"
          className={`object-contain transition-[filter] duration-1000 ${
            index === 0 ? "[filter:grayscale(1)_brightness(0.55)]" : "[filter:grayscale(1)_brightness(0.8)]"
          }`}
        />

        {/* 01 — скан инспекционным светом, только по кузову */}
        {index === 0 && (
          <div aria-hidden style={mask} className="car-mask pointer-events-none absolute inset-0 overflow-hidden">
            <span className="scan-band absolute inset-y-0 w-[16%] bg-[linear-gradient(90deg,transparent,rgb(237_235_230/0.45),transparent)]" />
          </div>
        )}
        {/* 04 — финальный проход света */}
        {index === 3 && (
          <div aria-hidden style={mask} className="car-mask pointer-events-none absolute inset-0 overflow-hidden">
            <span className="sweep-band absolute -inset-y-[20%] w-[22%] rotate-[14deg] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.6),transparent)]" />
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={stage.n} initial="hidden" animate="shown" exit="hidden" className="absolute inset-0">
            {stage.marks.map((m, i) => (
              <Mark key={m.label} mark={m} kind={index} i={i} />
            ))}
            {index === 3 && <Approved />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Mark({ mark, kind, i }: { mark: ProtocolMark; kind: number; i: number }) {
  const left = mark.side !== "right";
  return (
    <motion.div
      variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 } }}
      transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
      style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
      className={`absolute flex -translate-y-1/2 items-center ${
        left ? "-translate-x-[calc(100%-4px)] flex-row-reverse" : "-translate-x-1"
      } ${i > 2 ? "max-sm:hidden" : ""}`}
    >
      {/* 01 — точка замера, 02 — пунктирное кольцо маскировки, 03 — зона работы */}
      {kind === 1 ? (
        <span className="size-6 shrink-0 rounded-full border border-dashed border-offwhite/70" />
      ) : (
        <span className="relative flex size-2 shrink-0 items-center justify-center">
          <span className={`absolute size-2 rounded-full ${kind === 2 ? "bg-(--accent)" : "bg-offwhite"}`} />
          <span className="ping-ring absolute size-2 rounded-full border border-offwhite/60" />
        </span>
      )}
      <motion.span
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease }}
        className={`h-px w-[clamp(18px,3vw,44px)] bg-offwhite/50 ${left ? "origin-right" : "origin-left"}`}
      />
      <span className={`px-2 whitespace-nowrap [text-shadow:0_1px_8px_rgb(0_0_0/0.9)] ${left ? "text-right" : ""}`}>
        <span className="text-label block text-offwhite/70">{mark.label}</span>
        {mark.value && <span className="block font-mono text-[11px] text-offwhite sm:text-[13px]">{mark.value}</span>}
      </span>
    </motion.div>
  );
}

/** 04 — отметка о выдаче */
function Approved() {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, scale: 1.08 }, shown: { opacity: 1, scale: 1 } }}
      transition={{ duration: 0.7, delay: 0.5, ease }}
      className="absolute top-[4%] right-[2%] border border-offwhite/40 px-3 py-2 text-right"
    >
      <p className="text-label text-offwhite/55">Контроль</p>
      <p className="font-mono text-[12px] text-offwhite">Пройден · 04/04</p>
    </motion.div>
  );
}

/* Шкала этапов */
function Timeline({ active, progress }: { active: number; progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="container-x mt-4 lg:mt-6">
      <div className="relative h-px bg-line-strong">
        <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-offwhite/70" />
        {stages.map((s, i) => (
          <span
            key={s.n}
            aria-hidden
            style={{ left: `${(i / N) * 100}%` }}
            className={`absolute top-1/2 size-[7px] -translate-y-1/2 rounded-full border transition-colors duration-500 ${
              i <= active ? "border-(--accent) bg-(--accent)" : "border-offwhite/40 bg-black"
            }`}
          />
        ))}
      </div>
      <ol className="mt-3 grid grid-cols-4">
        {stages.map((s, i) => (
          <li
            key={s.n}
            className={`flex items-baseline gap-2 transition-colors duration-500 ${i === active ? "text-offwhite" : "text-offwhite/55"}`}
          >
            <span className="font-mono text-[11px]">{s.n}</span>
            <span className="text-label max-sm:hidden">{s.title}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
