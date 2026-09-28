"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
};

/** Мягкое появление при попадании во вьюпорт (один раз). */
export function Reveal({ children, delay = 0, y = 24, className, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}

/** Строка, выезжающая из-под маски — для крупных заголовков. */
export function MaskLine({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    // Наблюдаем за внешней маской: сам текст спрятан за overflow и
    // IntersectionObserver считает его невидимым.
    <motion.span
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      className={`block overflow-hidden pt-[0.06em] pb-[0.12em] -mb-[0.12em] ${className}`}
    >
      <motion.span
        variants={{ hidden: { y: "110%" }, shown: { y: 0 } }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
        className="block"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}
