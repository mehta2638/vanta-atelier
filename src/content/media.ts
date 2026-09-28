/**
 * Единый реестр изображений. Только Porsche 911, BMW и Mercedes.
 *
 * Замена на финальные фото: положите файл в `src/assets/media/` с тем же
 * именем (или поменяйте импорт) и обновите `alt`. Размеры и blur-placeholder
 * Next.js посчитает сам.
 *
 * Обложка hero — два слоя одного кадра одинакового размера:
 * `porsche-cover.jpg` (фон) и `porsche-cover-cut.webp` (машина с прозрачным фоном).
 * Между ними лежит типографика, поэтому при замене нужны оба файла
 * с одинаковыми пропорциями 4:5.
 *
 * Временные фото — Unsplash (Unsplash License), id в `credit`.
 * На сайте кадры проходят единую монохромную обработку (утилита `grade`).
 */
import type { StaticImageData } from "next/image";

import porscheCover from "@/assets/media/porsche-cover.jpg";
import porscheCoverCut from "@/assets/media/porsche-cover-cut.webp";
import porscheRear from "@/assets/media/porsche-rear.jpg";
import porscheSide from "@/assets/media/porsche-side.jpg";
import bmwFront from "@/assets/media/bmw-front.jpg";
import bmwMotion from "@/assets/media/bmw-motion.jpg";
import mercFront from "@/assets/media/merc-front.jpg";
import mercYacht from "@/assets/media/merc-yacht.jpg";
import mercCls from "@/assets/media/merc-cls.jpg";
import detailHeadlight from "@/assets/media/detail-headlight.jpg";
import detailBody from "@/assets/media/detail-body.jpg";
import detailWheel from "@/assets/media/detail-wheel.jpg";
import detailInterior from "@/assets/media/detail-interior.jpg";
import detailLight from "@/assets/media/detail-light.jpg";
import detailPaint from "@/assets/media/detail-paint.jpg";

export type Media = {
  src: StaticImageData;
  alt: string;
  /** object-position для кадрирования */
  position?: string;
  credit?: string;
};

export const cover = {
  photo: {
    src: porscheCover,
    alt: "Чёрный Porsche 911 GT3 RS на набережной на фоне порта",
    credit: "unsplash 1580274455191",
  },
  cutout: { src: porscheCoverCut, alt: "" },
} satisfies Record<string, Media>;

export const media = {
  porsche: {
    main: {
      src: porscheRear,
      alt: "Porsche 911 Turbo S сзади: световая полоса фонарей и капли на мокром кузове",
      position: "50% 50%",
      credit: "unsplash 1611651338412",
    },
    alt: {
      src: porscheSide,
      alt: "Чёрный Porsche 911 на городской улице",
      position: "50% 72%",
      credit: "unsplash 1611821064430",
    },
  },
  bmw: {
    main: {
      src: bmwMotion,
      alt: "Тёмный BMW M4 в движении на загородной дороге",
      position: "48% 60%",
      credit: "unsplash 1556189250",
    },
    alt: {
      src: bmwFront,
      alt: "BMW M4: решётка радиатора и фара крупным планом",
      position: "35% 45%",
      credit: "unsplash 1614026480209",
    },
  },
  mercedes: {
    main: {
      src: mercYacht,
      alt: "Mercedes-AMG GT на набережной у яхт",
      position: "50% 70%",
      credit: "unsplash 1617814076367",
    },
    alt: {
      src: mercFront,
      alt: "Mercedes-AMG GT анфас: вертикальная решётка и звезда",
      position: "50% 55%",
      credit: "unsplash 1583267746897",
    },
    studio: {
      src: mercCls,
      alt: "Чёрный седан Mercedes в тёмной студии, контровой свет по линии кузова",
      position: "50% 62%",
      credit: "unsplash 1485291571150",
    },
  },
} satisfies Record<string, Record<string, Media>>;

/** Крупные планы для «Анатомии» — кропы из оригиналов тех же съёмок */
export const details = {
  headlight: {
    src: detailHeadlight,
    alt: "Светодиодная фара BMW M4 крупным планом",
    credit: "unsplash 1614026480209, кроп",
  },
  body: {
    src: detailBody,
    alt: "Линия плеча чёрного Mercedes в студийном свете",
    credit: "unsplash 1485291571150, кроп",
  },
  wheel: {
    src: detailWheel,
    alt: "Колёсный диск Mercedes в луче студийного света",
    credit: "unsplash 1485291571150, кроп",
  },
  interior: {
    src: detailInterior,
    alt: "Стёганая кожа сиденья Mercedes-AMG с контрастной строчкой",
    credit: "unsplash 1605437241278, кроп",
  },
  light: {
    src: detailLight,
    alt: "Сквозная световая полоса и надпись PORSCHE на корме 911 Turbo S",
    credit: "unsplash 1611651338412, кроп",
  },
  paint: {
    src: detailPaint,
    alt: "Капли воды на крышке моторного отсека и заднем стекле Porsche 911",
    credit: "unsplash 1611651338412, кроп",
  },
} satisfies Record<string, Media>;
