"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { transformation as copy } from "@/content/site";
import { transformationMedia as media } from "@/content/media";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

/** Линия ленты: x в % ширины сцены сверху и снизу */
const TAPE = { top: 49, bottom: 55 };
/** Как долго после действия пользователя лампа не уходит в автопилот */
const IDLE_MS = 2400;

/**
 * 03 — Трансформация. Тест 50/50 под инспекционной лампой.
 *
 * Слои (снизу вверх): «после» → «до», обрезанное по ленте (+ паутина и мутный
 * ореол под лампой) → резкий блик на стороне «после» → общее затемнение
 * с «дырой» под лампой → лента → текст.
 *
 * Всё, что движется за лампой, двигается только transform'ом —
 * без перерисовки масок, поэтому дёшево и на телефоне.
 */
export function Transformation() {
  const stageRef = useRef<HTMLElement>(null);
  // Предпочтение reduced-motion известно только в браузере — учитываем
  // его после монтирования, чтобы разметка совпадала с серверной
  const prefersReduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  const reduce = mounted && prefersReduced;
  const inView = useInView(stageRef, { margin: "200px 0px" });

  const [size, setSize] = useState({ w: 1440, h: 900 });
  const sizeRef = useRef(size);
  const [coarse, setCoarse] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [touched, setTouched] = useState(false);
  const [peeled, setPeeled] = useState(false);
  const [busy, setBusy] = useState(false);

  // ── Лампа: цель + пружина (инерция) ──────────
  const tx = useMotionValue(size.w * 0.5);
  const ty = useMotionValue(size.h * 0.55);
  const sx = useSpring(tx, { stiffness: 60, damping: 17, mass: 0.9 });
  const sy = useSpring(ty, { stiffness: 60, damping: 17, mass: 0.9 });
  const still = reduce || lowPower;
  const lx = still ? tx : sx;
  const ly = still ? ty : sy;
  const swirlRotate = useTransform(lx, (v) => v * 0.03);

  const lastInput = useRef(-Infinity);
  const dragging = useRef(false);

  // ── Лента ─────────────────────────────────────
  const ta = useMotionValue(TAPE.top);
  const tb = useMotionValue(TAPE.bottom);
  const peel = useMotionValue(0); // 0 — на месте, 1 — снята (снизу вверх)
  const edge = useMotionValue(0); // световая кромка во время reveal
  const flash = useMotionValue(0);
  const beforeClip = useTransform([ta, tb], ([a, b]) => `polygon(0 0, ${a}% 0, ${b}% 100%, 0 100%)`);
  const afterClip = useTransform([ta, tb], ([a, b]) => `polygon(${a}% 0, 100% 0, 100% 100%, ${b}% 100%)`);

  // Размер сцены и тип указателя
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      sizeRef.current = { w, h };
      setSize({ w, h });
      if (performance.now() - lastInput.current > IDLE_MS) park(w, h);
    });
    ro.observe(el);
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    setMounted(true);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Точка «на ленте»: половина пятна на «до», половина — на «после» */
  function park(w: number, h: number) {
    const yp = h > w ? 0.5 : 0.56;
    const xp = (TAPE.top + (TAPE.bottom - TAPE.top) * yp) / 100;
    tx.set(w * xp);
    ty.set(h * yp);
  }

  // ── Автопилот лампы + мягкая деградация ────────
  useEffect(() => {
    if (!inView || still) return;
    let raf = 0;
    const t0 = performance.now();
    let prev = t0;
    const deltas: number[] = [];

    const loop = (now: number) => {
      // Замер первых кадров: если устройство не тянет — лампа паркуется
      if (deltas.length < 90) {
        deltas.push(now - prev);
        if (deltas.length === 90) {
          const median = [...deltas].sort((a, b) => a - b)[45];
          if (median > 30) {
            setLowPower(true);
            park(sizeRef.current.w, sizeRef.current.h);
            return;
          }
        }
      }
      prev = now;

      if (!dragging.current && now - lastInput.current > IDLE_MS) {
        const { w, h } = sizeRef.current;
        const portrait = h > w;
        const t = (now - t0) / 1000;
        // Медленная «восьмёрка» вдоль линии кузова
        const x = 0.5 + (portrait ? 0.3 : 0.28) * Math.sin(t * 0.3);
        const y = (portrait ? 0.5 : 0.55) + (portrait ? 0.06 : 0.08) * Math.sin(t * 0.6 + 1.1);
        tx.set(w * x);
        ty.set(h * y);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, still]);

  const moveTo = (clientX: number, clientY: number) => {
    const r = stageRef.current!.getBoundingClientRect();
    tx.set(clientX - r.left);
    ty.set(clientY - r.top);
    lastInput.current = performance.now();
    if (!touched) setTouched(true);
  };

  // ── Снять / вернуть ленту ──────────────────────
  async function onPeel() {
    if (busy) return;
    setBusy(true);
    if (reduce) {
      peel.set(1);
      ta.set(-20);
      tb.set(-20);
    } else {
      await animate(peel, 1, { duration: 0.45, ease: [0.65, 0, 0.35, 1] });
      edge.set(1);
      animate(flash, [0, 0.07, 0], { duration: 1, ease: "easeInOut" });
      await Promise.all([
        animate(ta, -14, { duration: 0.95, ease: [0.76, 0, 0.24, 1] }),
        animate(tb, -6, { duration: 0.95, ease: [0.76, 0, 0.24, 1] }),
      ]);
      animate(edge, 0, { duration: 0.35 });
    }
    setPeeled(true);
    setBusy(false);
  }

  async function onReset() {
    if (busy) return;
    setBusy(true);
    setPeeled(false);
    if (reduce) {
      ta.set(TAPE.top);
      tb.set(TAPE.bottom);
      peel.set(0);
    } else {
      await Promise.all([
        animate(ta, TAPE.top, { duration: 0.8, ease }),
        animate(tb, TAPE.bottom, { duration: 0.8, ease }),
      ]);
      await animate(peel, 0, { duration: 0.4, ease });
    }
    setBusy(false);
  }

  // Геометрия ленты. В portrait лента лежит только на машине (как на кузове),
  // чтобы не перечёркивать заголовок и текст; в landscape — на всю высоту кадра.
  const portrait = size.h > size.w;
  const span = portrait ? { from: 21, to: 80 } : { from: 0, to: 100 };
  const mid = (span.from + span.to) / 2;
  const tapeW = size.w < 640 ? 11 : 15;
  const dx = ((TAPE.bottom - TAPE.top) / 100) * size.w;
  const angle = (Math.atan2(size.h, dx) * 180) / Math.PI;
  const length = (Math.hypot(size.h, dx) * (span.to - span.from)) / 100;
  const tapeTextLeft = useTransform([ta, tb], ([a, b]) => `${(a as number) + ((b as number) - (a as number)) * (mid / 100)}%`);
  const tapeTextOpacity = useTransform(peel, [0, 0.15], [1, 0]);
  const sideLeft = useTransform(ta, (v) => `${v}%`);
  const sideOpacity = useTransform(peel, [0, 0.3], [1, 0]);

  return (
    <section
      id="transformation"
      ref={stageRef}
      aria-labelledby="transformation-title"
      onPointerMove={(e) => e.pointerType === "mouse" && moveTo(e.clientX, e.clientY)}
      className="accent-porsche relative h-svh min-h-[620px] overflow-hidden bg-black select-none [--lamp:clamp(240px,62vw,300px)] sm:[--lamp:clamp(280px,34vmin,440px)] [@media(pointer:fine)]:cursor-none"
    >
      {/* ── «После» — база ───────────────────── */}
      <Scene kind="after" />

      {/* ── «До» — слева от ленты ─────────────── */}
      <motion.div style={{ clipPath: beforeClip }} className="absolute inset-0 overflow-hidden">
        <Scene kind="before" />
        {/* Мутный лак рассеивает свет: широкое мягкое пятно */}
        <Follow x={lx} y={ly} className="size-[calc(var(--lamp)*1.4)] bg-[radial-gradient(circle,rgb(237_235_230/0.16)_0%,rgb(237_235_230/0.06)_34%,transparent_68%)]" />
        {/* Паутина царапин вокруг точки света */}
        <Follow x={lx} y={ly} rotate={still ? undefined : swirlRotate} className="size-[calc(var(--lamp)*1.35)] opacity-90">
          <Image src={media.swirls} alt="" fill sizes="440px" className="object-contain" />
        </Follow>
      </motion.div>

      {/* ── «После»: резкий точечный блик ───────── */}
      <motion.div style={{ clipPath: afterClip }} className="absolute inset-0 overflow-hidden">
        <Follow
          x={lx}
          y={ly}
          className="size-[calc(var(--lamp)*0.55)] bg-[radial-gradient(circle,rgb(255_255_255/0.95)_0%,rgb(255_255_255/0.6)_4%,rgb(255_255_255/0.1)_12%,transparent_30%)]"
        />
      </motion.div>

      {/* Общее затемнение: светло только там, где лампа */}
      <Follow
        x={lx}
        y={ly}
        className="size-[300vmax] bg-[radial-gradient(circle,transparent_0%,transparent_2.4%,rgb(10_10_11/0.62)_8.5%)]"
      />
      <motion.div aria-hidden style={{ opacity: flash }} className="pointer-events-none absolute inset-0 bg-offwhite" />

      {/* ── Лента ─────────────────────────────── */}
      <Tape ta={ta} tb={tb} peel={peel} edge={edge} tapeW={tapeW} size={size} span={span} />
      <motion.div
        aria-hidden
        style={{ left: tapeTextLeft, top: `${mid}%`, width: length, height: tapeW, rotate: angle, opacity: tapeTextOpacity }}
        className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 items-center overflow-hidden whitespace-nowrap"
      >
        <span className="font-mono text-[7px] tracking-[0.3em] text-black/45 uppercase sm:text-[8px]">
          {copy.tape.repeat(24)}
        </span>
      </motion.div>

      {/* Подписи сторон у верхнего края ленты */}
      <motion.div
        aria-hidden
        style={{ left: sideLeft, opacity: sideOpacity }}
        className="pointer-events-none absolute top-[calc(var(--header-h)+clamp(52px,9vh,88px))] flex -translate-x-1/2 items-center gap-10 text-label sm:gap-14 whitespace-nowrap"
      >
        <span className="text-offwhite/55">← {copy.sides.before}</span>
        <span className="text-(--accent)">{copy.sides.after} →</span>
      </motion.div>

      {/* Mobile: «ручка» лампы для перетаскивания */}
      {coarse && (
        <motion.div
          aria-hidden
          style={{ x: lx, y: ly }}
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            moveTo(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => dragging.current && moveTo(e.clientX, e.clientY)}
          onPointerUp={() => {
            dragging.current = false;
            lastInput.current = performance.now();
          }}
          onPointerCancel={() => (dragging.current = false)}
          className="absolute top-0 left-0 z-20 -mt-8 -ml-8 flex size-16 touch-none items-center justify-center"
        >
          <span className="size-11 rounded-full border border-offwhite/50" />
        </motion.div>
      )}

      {/* ── Тонировка под текст ────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_10_11/0.85)_0%,transparent_24%,transparent_58%,rgb(10_10_11/0.92)_100%)]"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 overflow-hidden" />

      {/* ── Текст ─────────────────────────────── */}
      <div className="pointer-events-none relative flex h-full flex-col">
        <div className="container-x flex items-center gap-4 pt-[calc(var(--header-h)+clamp(8px,2vh,24px))]">
          <SectionLabel index="03">{copy.label}</SectionLabel>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <p className="text-label text-offwhite/45 max-sm:hidden">{copy.car}</p>
        </div>

        <div className="flex-1" />

        <div className="container-x grid gap-6 pb-[max(24px,env(safe-area-inset-bottom))] lg:grid-cols-[1fr_auto] lg:items-end lg:pb-[clamp(28px,5vh,56px)]">
          <h2 id="transformation-title" className="text-display text-[clamp(52px,15vw,88px)] sm:text-[clamp(72px,min(9vw,15vh),168px)]">
            {copy.title.lead}{" "}
            <span className="text-serif-accent text-[1.1em] text-(--accent)">{copy.title.accent}</span>
          </h2>

          <div className="pointer-events-auto lg:w-[380px] lg:pb-3 [@media(pointer:fine)]:cursor-auto">
            <p className="text-[14px] leading-[1.6] text-offwhite/65 max-sm:hidden">{copy.lead}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 max-sm:mt-0">
              {peeled ? (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease }}
                    className="text-label w-full text-(--accent)"
                  >
                    {copy.done}
                  </motion.p>
                  <Button
                    href="#transformation"
                    variant="ghost"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      onReset();
                    }}
                    className="max-sm:w-full"
                  >
                    {copy.reset}
                  </Button>
                </>
              ) : (
                <Button
                  href="#transformation"
                  size="lg"
                  aria-disabled={busy}
                  onClick={(e) => {
                    e.preventDefault();
                    onPeel();
                  }}
                  className="max-sm:w-full"
                >
                  {copy.peel}
                </Button>
              )}
              {!peeled && (
                <p
                  className={`text-label flex items-center gap-2 text-offwhite/45 transition-opacity duration-700 max-sm:hidden ${
                    touched ? "opacity-0" : ""
                  }`}
                >
                  <span className="size-1.5 animate-pulse rounded-full bg-offwhite/70" />
                  {coarse ? copy.hint.touch : copy.hint.mouse}
                </p>
              )}
            </div>
            <p className="text-label mt-5 text-[9px] text-offwhite/30">{copy.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Кадр сцены: wide для landscape, tall для portrait (скрытый не загружается) */
function Scene({ kind }: { kind: "before" | "after" }) {
  return (
    <>
      {(["wide", "tall"] as const).map((v) => {
        const img = media[v][kind];
        return (
          <Image
            key={v}
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            placeholder={kind === "after" ? "blur" : "empty"}
            className={`object-cover ${v === "wide" ? "portrait:hidden" : "landscape:hidden"}`}
          />
        );
      })}
    </>
  );
}

/** Элемент, центр которого следует за лампой (только transform) */
function Follow({
  x,
  y,
  rotate,
  className = "",
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate?: MotionValue<number>;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      aria-hidden
      style={{ x, y, rotate, translateX: "-50%", translateY: "-50%" }}
      className={`pointer-events-none absolute top-0 left-0 will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Малярная лента: матовая полоса вдоль диагонали, снимается снизу вверх */
function Tape({
  ta,
  tb,
  peel,
  edge,
  tapeW,
  size,
  span,
}: {
  ta: MotionValue<number>;
  tb: MotionValue<number>;
  peel: MotionValue<number>;
  edge: MotionValue<number>;
  tapeW: number;
  size: { w: number; h: number };
  span: { from: number; to: number };
}) {
  const d = (tapeW / 2 / size.w) * 100;
  const points = useTransform([ta, tb, peel], ([a, b, p]) => {
    const A = a as number, B = b as number;
    const at = (y: number) => A + (B - A) * (y / 100);
    const y0 = span.from;
    const y1 = span.to - (p as number) * (span.to - span.from);
    return `${at(y0) - d},${y0} ${at(y0) + d},${y0} ${at(y1) + d},${y1} ${at(y1) - d},${y1}`;
  });
  const edgeX1 = useTransform(ta, (v) => v);
  const edgeX2 = useTransform(tb, (v) => v);

  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full [filter:drop-shadow(0_1px_1.5px_rgb(0_0_0/0.55))]"
    >
      <motion.polygon points={points} fill="#d6d0c2" fillOpacity="0.9" />
      {/* Световая кромка финального прохода */}
      <motion.line
        x1={edgeX1}
        y1={0}
        x2={edgeX2}
        y2={100}
        stroke="#edebe6"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        style={{ opacity: edge }}
      />
    </svg>
  );
}
