"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cars, hero } from "@/content/site";
import { cover } from "@/content/media";
import { Button } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Обложка выпуска. Три слоя одного кадра: фото → «911» → машина без фона.
 * Цифры стоят за кузовом и выезжают из-за крыши.
 *
 * Сцена масштабируется от ширины (--w) и привязана к линии колёс (--yc),
 * поэтому композиция одинакова на любом экране:
 * portrait-телефон, планшет и landscape-desktop получают свои значения.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "14%"]);
  const numY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-30%"]);
  const furnitureOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

  // Цифры едва смещаются за курсором — глубина между слоями
  const mx = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 50, damping: 20 });
  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    mx.set((e.clientX / window.innerWidth - 0.5) * -24);
  };

  const [, bmw, mercedes] = cars;

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="accent-porsche relative h-svh min-h-[600px] overflow-hidden bg-black"
    >
      {/* ── Сцена ─────────────────────────────── */}
      <motion.div
        style={{ y: stageY }}
        className="cover-stage cover-open absolute left-1/2 -translate-x-1/2 [--w:134vw] [--yc:60svh] sm:[--w:108vw] sm:[--yc:64svh] landscape:[--w:80vw] landscape:[--yc:89svh]"
      >
        <div className="cover-mask absolute inset-0">
          <Image
            src={cover.photo.src}
            alt={cover.photo.alt}
            fill
            preload
            placeholder="blur"
            sizes="(orientation: landscape) 80vw, 134vw"
            // Фон темнее машины — кузов «выходит» из кадра
            style={{ filter: "grayscale(1) contrast(1.1) brightness(0.5)" }}
            className="object-cover"
          />
        </div>
        {/* Едва заметный бордовый ореол за кузовом */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_46%_20%_at_54%_50%,var(--color-porsche-glow),transparent_72%)] opacity-50 mix-blend-screen"
        />

        {/* «911» — между фоном и машиной */}
        <motion.div style={{ y: numY, x: smx }} className="absolute inset-x-0 bottom-[57.5%]">
          <motion.p
            aria-hidden
            initial={reduce ? false : { y: "45%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.8, delay: 1.1, ease }}
            className="text-center font-display text-[calc(var(--w)*0.33)] leading-[0.72] font-semibold tracking-[-0.07em] text-offwhite"
          >
            {hero.cover}
          </motion.p>
        </motion.div>

        <Image
          src={cover.cutout.src}
          alt=""
          fill
          sizes="(orientation: landscape) 80vw, 134vw"
          className="grade pointer-events-none object-cover"
        />
      </motion.div>

      {/* Световая «щель» перед раскрытием кадра */}
      <span
        aria-hidden
        className="slit-h pointer-events-none absolute inset-x-0 top-[calc(var(--yc)-var(--w)*0.2)] h-px bg-offwhite [--w:134vw] [--yc:60svh] sm:[--w:108vw] sm:[--yc:64svh] landscape:[--w:80vw] landscape:[--yc:89svh]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(10_10_11/0.85)_0%,transparent_18%,transparent_62%,rgb(10_10_11/0.8)_86%,#0a0a0b_100%)]"
      />
      <motion.div
        aria-hidden
        style={{ opacity: shade }}
        className="pointer-events-none absolute inset-0 bg-black"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 overflow-hidden" />

      {/* ── Журнальная вёрстка ────────────────── */}
      <motion.div
        style={{ opacity: furnitureOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="container-x relative flex h-full flex-col pt-[calc(var(--header-h)+clamp(12px,2.4vh,32px))] pb-[max(20px,env(safe-area-inset-bottom))] lg:pb-[clamp(24px,4vh,44px)]">
          <Fade delay={2.1} className="flex items-center gap-4">
            <p className="text-label text-offwhite/70">{hero.issue}</p>
            <span aria-hidden className="relative h-px flex-1 bg-line-strong">
              <span className="absolute inset-y-0 left-0 w-16 bg-(--accent-line)" />
            </span>
            <p className="text-label text-offwhite/45">
              <span className="max-sm:hidden">Porsche · BMW · Mercedes — </span>MMXXVI
            </p>
          </Fade>

          {/* Desktop: «В этом выпуске» — справа сверху */}
          <Fade
            delay={2.4}
            className="pointer-events-auto absolute top-[calc(var(--header-h)+clamp(40px,6vh,64px))] right-(--gutter) hidden w-[250px] lg:block"
          >
            <p className="text-label text-offwhite/45">В этом выпуске</p>
            <ul className="mt-4 space-y-3">
              {[bmw, mercedes].map((car) => (
                <li key={car.id} className={`accent-${car.id}`}>
                  <a
                    href="#chapters"
                    className="group flex items-center gap-4 border-t border-line pt-3 transition-colors duration-500 hover:border-(--accent-line)"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden">
                      <Image
                        src={car.images.alt.src}
                        alt=""
                        fill
                        sizes="56px"
                        style={{ objectPosition: car.images.alt.position }}
                        className="grade object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
                      />
                    </span>
                    <span>
                      <span className="flex items-baseline gap-2">
                        <span className="font-serif text-[15px] text-(--accent)">{car.numeral}</span>
                        <span className="text-[13px] text-offwhite/80">
                          {car.brand} {car.model}
                        </span>
                      </span>
                      <span className="text-serif-accent block text-[22px] leading-tight text-offwhite/90 transition-colors group-hover:text-offwhite">
                        {car.archetype}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Fade>

          {/* Desktop: подпись главы — слева по центру */}
          <Fade
            delay={2.3}
            className="absolute top-[46%] left-(--gutter) hidden max-w-[220px] lg:block"
          >
            <p className="text-label text-(--accent)">{hero.chapter}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-offwhite/55">{hero.model}</p>
          </Fade>

          <div className="flex-1" />

          {/* Низ обложки */}
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <h1 className="text-display text-[clamp(38px,10.6vw,56px)] sm:text-[clamp(48px,min(5.6vw,9vh),92px)]">
              <span className="sr-only">VANTA Atelier — </span>
              <Line delay={2}>{hero.line.lead}</Line>
              <Line delay={2.12}>
                <span className="text-serif-accent text-[1.12em] leading-[0.85]">
                  {hero.line.accent} <span className="text-(--accent)">{hero.line.highlight}</span>
                </span>
              </Line>
            </h1>

            <Fade delay={2.5} className="pointer-events-auto lg:max-w-[340px] lg:pb-2">
              <p className="mb-6 text-[14px] leading-[1.6] text-offwhite/60 max-lg:hidden">
                {hero.lead}
              </p>
              <Button href={hero.cta.href} size="lg" className="w-full sm:w-auto">
                {hero.cta.label}
              </Button>
            </Fade>
          </div>

          {/* Mobile: строка выпуска */}
          <Fade
            delay={2.6}
            className="mt-6 flex items-center justify-between border-t border-line pt-4 lg:hidden"
          >
            <p className="text-label text-offwhite/55">{hero.model}</p>
            <p className="text-label text-offwhite/40">
              <span className="text-(--accent)">I</span> / III
            </p>
          </Fade>
        </div>
      </motion.div>
    </section>
  );
}

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pt-[0.06em] pb-[0.14em] -mb-[0.14em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, delay, ease }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function Fade({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
