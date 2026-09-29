"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { finale, site } from "@/content/site";
import { studioCar } from "@/content/media";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MaskLine } from "@/components/ui/Reveal";
import { Arrow } from "@/components/ui/Button";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * 07 — Финальная сцена. Тот же Porsche, что на обложке, но уже в студии:
 * один источник верхнего света, отражение в полу, крупный заголовок.
 * Форма — демо: ничего не отправляет.
 */
export function Finale() {
  return (
    <section
      id="contact"
      aria-labelledby="finale-title"
      className="accent-porsche relative flex min-h-svh flex-col overflow-hidden border-t border-line bg-black"
    >
      {/* ── Студия ─────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Софтбокс: узкая полоса света сверху и её пятно */}
        <span className="absolute top-0 left-1/2 h-px w-[46vw] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgb(237_235_230/0.55),transparent)]" />
        <span className="absolute -top-[30vh] left-1/2 h-[90vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgb(237_235_230/0.07),transparent_62%)]" />
        
      </div>

      <div className="container-x relative flex flex-1 flex-col pt-[calc(var(--header-h)+clamp(24px,5vh,56px))] pb-[max(24px,env(safe-area-inset-bottom))] lg:pb-10">
        <div className="flex items-center gap-4">
          <SectionLabel index="07">{finale.label}</SectionLabel>
          <span aria-hidden className="h-px flex-1 bg-line" />
          <p className="text-label text-offwhite/40 max-sm:hidden">Porsche 911 GT3 RS</p>
        </div>

        <h2 id="finale-title" className="relative z-10 mt-8 text-display text-[clamp(46px,12.5vw,80px)] lg:mt-10 lg:text-[clamp(80px,8.4vw,156px)]">
          <MaskLine>{finale.title.lead}</MaskLine>
          <MaskLine delay={0.08}>
            <span className="text-serif-accent text-[1.1em]">
              {finale.title.accent.replace(/\.$/, "")}
              <span className="text-(--accent)">.</span>
            </span>
          </MaskLine>
        </h2>

        {/* ── Автомобиль ───────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.6, ease }}
          className="relative -mx-[6vw] mt-2 aspect-[2208/1200] lg:mx-0 lg:-mt-[7vw] lg:ml-auto lg:w-[66vw] lg:-mr-[2vw]"
        >
          <Image
            src={studioCar.src}
            alt={studioCar.alt}
            fill
            sizes="(min-width: 1024px) 66vw, 112vw"
            className="object-contain [filter:grayscale(0.85)_brightness(0.72)_contrast(1.1)]"
          />
          {/* Верхний свет ложится на кузов */}
          <div
            aria-hidden
            style={{ maskImage: `url(${studioCar.src.src})`, WebkitMaskImage: `url(${studioCar.src.src})` }}
            className="car-mask absolute inset-0 bg-[linear-gradient(to_bottom,rgb(237_235_230/0.22),transparent_55%)]"
          />
          {/* Отражение в полу */}
          <div aria-hidden className="floor-reflection absolute inset-x-0 top-[96%] h-full">
            <Image src={studioCar.src} alt="" fill sizes="(min-width: 1024px) 66vw, 112vw" className="object-contain [filter:grayscale(1)_brightness(0.5)]" />
          </div>
        </motion.div>

        {/* ── Форма и контакты ─────────────── */}
        <div className="relative z-10 mt-[clamp(28px,4vw,56px)] grid gap-10 border-t border-line pt-8 lg:grid-cols-12 lg:gap-x-[4vw] lg:pt-10">
          <div className="lg:col-span-8">
            <p className="max-w-[46ch] text-[15px] leading-[1.6] text-offwhite/65">{finale.lead}</p>
            <DemoForm />
          </div>
          <Contacts className="lg:col-span-4" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Демо-форма
   ───────────────────────────────────────────── */
function DemoForm() {
  const [sent, setSent] = useState(false);
  const [car, setCar] = useState(finale.carOptions[0]);

  return (
    <div className="mt-8">
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            role="status"
            className="flex min-h-[152px] flex-col justify-center border-l border-(--accent) pl-6"
          >
            <p className="text-display text-[clamp(28px,3vw,40px)]">{finale.success.title}</p>
            <p className="mt-2 text-[14px] text-offwhite/55">{finale.success.text}</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-label mt-5 self-start text-offwhite/50 underline-offset-4 transition-colors hover:text-offwhite hover:underline"
            >
              {finale.success.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field name="name" label={finale.fields.name} autoComplete="name" />
              <Field name="phone" label={finale.fields.phone} type="tel" autoComplete="tel" inputMode="tel" pattern="[0-9+()\\-\\s]{6,}" />
            </div>

            <fieldset>
              <legend className="text-label text-offwhite/40">{finale.fields.car}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {finale.carOptions.map((c) => (
                  <label
                    key={c}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offwhite/70 ${
                      car === c ? "border-offwhite/70 text-offwhite" : "border-line-strong text-offwhite/50 hover:text-offwhite/80"
                    }`}
                  >
                    <input type="radio" name="car" value={c} checked={car === c} onChange={() => setCar(c)} className="sr-only" />
                    {c}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
              <button
                type="submit"
                className="group/btn relative isolate inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-offwhite px-8 text-[14px] font-medium text-black max-sm:w-full"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 translate-y-full rounded-full bg-[#cfccc4] transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0"
                />
                {finale.cta}
                <Arrow />
              </button>
              <p className="max-w-[34ch] text-[12px] leading-[1.5] text-offwhite/40">{finale.note}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ name, label, ...rest }: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="group block">
      <span className="text-label text-offwhite/40 transition-colors group-focus-within:text-offwhite/70">{label}</span>
      <input
        name={name}
        required
        {...rest}
        className="mt-2 block w-full border-b border-line-strong bg-transparent pb-3 text-[17px] text-offwhite outline-none transition-colors placeholder:text-offwhite/20 focus:border-offwhite/70"
      />
    </label>
  );
}

/* ─────────────────────────────────────────────
   Контакты
   ───────────────────────────────────────────── */
function Contacts({ className = "" }: { className?: string }) {
  const rows: [string, React.ReactNode][] = [
    [
      "Телефон",
      <a key="p" href={site.phoneHref} className="transition-colors hover:text-offwhite">
        {site.phone}
      </a>,
    ],
    ["Telegram", site.telegram],
    ["Часы", site.hours],
  ];
  return (
    <div className={className}>
      <p className="text-label text-offwhite/40">{finale.contactsLabel}</p>
      <dl className="mt-3 border-t border-line">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5">
            <dt className="text-label text-offwhite/35">{k}</dt>
            <dd className="text-right font-mono text-[13px] text-offwhite/85">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[11px] leading-[1.5] text-offwhite/30">{finale.demo}</p>
    </div>
  );
}
