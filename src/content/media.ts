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
import porscheStudio from "@/assets/media/porsche-studio.webp";
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
import trAfterWide from "@/assets/media/transformation-after-wide.jpg";
import trBeforeWide from "@/assets/media/transformation-before-wide.jpg";
import trAfterTall from "@/assets/media/transformation-after-tall.jpg";
import trBeforeTall from "@/assets/media/transformation-before-tall.jpg";
import trSwirls from "@/assets/media/transformation-swirls.webp";
import svcWash from "@/assets/media/service-wash.jpg";
import svcCorrection from "@/assets/media/service-correction.jpg";
import svcCeramic from "@/assets/media/service-ceramic.jpg";
import svcPpf from "@/assets/media/service-ppf.jpg";
import svcInterior from "@/assets/media/service-interior.jpg";
import svcWheels from "@/assets/media/service-wheels.jpg";

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
/**
 * Крупные планы для «Анатомии». Единая обработка запечена в файлы
 * (как у фотосерии «Услуг»): цвет ~20%, контраст, виньетка — утилита `grade` не нужна.
 * Форматы под геометрию кадров: фара 1.84:1, кузов 4:1, колесо 1:1,
 * салон 1.53:1, отражение ~4.3:1, покрытие — полноэкранный 16:10.
 */
export const details = {
  headlight: {
    src: detailHeadlight,
    alt: "Светодиодная фара BMW M5 и глянцевый капот крупным планом",
    credit: "unsplash 1683791738119, кроп",
  },
  body: {
    src: detailBody,
    alt: "Передок Porsche 911: световая полоса на капоте, фара и грань крыла",
    credit: "unsplash 1727947347770, кроп",
  },
  wheel: {
    src: detailWheel,
    alt: "Колесо Porsche 911 RS: центральная гайка, спицы и суппорт",
    credit: "unsplash 1637087867447, кроп",
  },
  interior: {
    src: detailInterior,
    alt: "Стёганая кожа сиденья Mercedes-AMG с контрастной строчкой",
    credit: "unsplash 1605437241278, кроп",
  },
  light: {
    src: detailLight,
    alt: "Силуэт чёрного Mercedes CLS: полоса студийного света вдоль линии кузова",
    credit: "unsplash 1485291571150, кроп",
  },
  paint: {
    src: detailPaint,
    alt: "Капли воды на тёмном лаке двери и ручке — макро",
    credit: "unsplash 1550565076, кроп",
  },
} satisfies Record<string, Media>;

/**
 * Сцена «Трансформация» (тест 50/50).
 * after — исходный кадр; before смоделирован из него же (скрипт генерации:
 * пониженный контраст, мутные отражения, пыль и пятна). Монохром запечён в файлы.
 * При замене: пары before/after должны совпадать пиксель в пиксель.
 * wide — для landscape, tall — для portrait.
 */
export const transformationMedia = {
  wide: {
    after: { src: trAfterWide, alt: "Чёрный Porsche 911 GT3 Touring после коррекции лака" },
    before: { src: trBeforeWide, alt: "" },
  },
  tall: {
    after: { src: trAfterTall, alt: "Чёрный Porsche 911 GT3 Touring после коррекции лака" },
    before: { src: trBeforeTall, alt: "" },
  },
  /** Паутина царапин вокруг точечного источника света */
  swirls: trSwirls,
  credit: "unsplash 1611821064430",
};

/**
 * Фотосерия «04 — Услуги». Единая обработка запечена в файлы:
 * кадр 4:5 по композиции, приглушённый цвет (~20%), общая виньетка.
 * Поэтому на эти кадры НЕ нужна утилита `grade`.
 * position — кадрирование квадратной миниатюры на mobile/tablet
 * (в кадре 4:5 на desktop изображение показывается целиком).
 * Новые фото: 1200×1500, та же обработка — иначе серия развалится.
 */
export const serviceMedia = {
  wash: {
    src: svcWash,
    alt: "BMW X6 под активной пеной в тёмном моечном боксе",
    position: "58% 42%",
    credit: "unsplash 1633014041037",
  },
  correction: {
    src: svcCorrection,
    alt: "Мастер полирует чёрный кузов, в отражении на панели видны голограммы",
    position: "50% 30%",
    credit: "unsplash 1708805282706 (паутина царапин добавлена при обработке)",
  },
  ceramic: {
    src: svcCeramic,
    alt: "Капли воды собираются в бусины на чёрном лаке после керамики",
    position: "50% 40%",
    credit: "unsplash 1608382247609",
  },
  ppf: {
    src: svcPpf,
    alt: "Нанесение защитной плёнки на фару Mercedes",
    position: "40% 42%",
    credit: "unsplash 1632823469850",
  },
  interior: {
    src: svcInterior,
    alt: "Руль Porsche GT: алькантара, красная строчка, переключатели режимов",
    position: "40% 34%",
    credit: "unsplash 1699325565626",
  },
  wheels: {
    src: svcWheels,
    alt: "Колесо Porsche: карбон-керамический диск, суппорт и центральная гайка",
    position: "50% 50%",
    credit: "unsplash 1695270939393",
  },
} satisfies Record<string, Media>;

/**
 * Porsche 911 GT3 RS без фона, кадр по машине (2208×1200, ≈1.84:1).
 * Вырезан из того же кадра, что и обложка. Используется в «Протоколе»
 * (координаты меток — в % от этого кадра) и в финальной сцене.
 * При замене сохраните пропорции, иначе метки «Протокола» съедут.
 */
export const studioCar = {
  src: porscheStudio,
  alt: "Чёрный Porsche 911 GT3 RS в тёмной студии",
  credit: "unsplash 1580274455191, вырезка",
};
