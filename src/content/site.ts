/**
 * Тексты и данные сайта. Демонстрационный концепт:
 * контакты — заглушки, без реальных достижений, наград и клиентов.
 */
import { details, media, type Media } from "./media";

export const site = {
  name: "VANTA",
  descriptor: "Atelier",
  phone: "+7 (900) 000-00-00",
  phoneHref: "tel:+79000000000",
  hours: "По записи, ежедневно",
};

export const nav = [
  { label: "Главы", href: "#chapters" },
  { label: "Анатомия", href: "#anatomy" },
  { label: "Трансформация", href: "#transformation" },
  { label: "Услуги", href: "#services" },
  { label: "Форматы", href: "#formats" },
];

export const hero = {
  issue: "Выпуск N°01",
  chapter: "Глава I — Точность",
  cover: "911",
  model: "Porsche 911 GT3 RS",
  line: { lead: "Точность,", accent: "доведённая до", highlight: "блеска." },
  lead: "Частное ателье детейлинга для трёх характеров: Porsche 911, BMW M и Mercedes-AMG.",
  cta: { label: "Записаться в ателье", href: "#contact" },
};

export type Car = {
  id: "porsche" | "bmw" | "mercedes";
  numeral: string;
  brand: string;
  model: string;
  /** Архетип одним словом */
  archetype: string;
  /** Три ключевых слова характера */
  keywords: [string, string, string];
  motto: string;
  chapter: string;
  program: string[];
  focus: string;
  images: { main: Media; alt: Media };
};

export const cars: Car[] = [
  {
    id: "porsche",
    numeral: "I",
    brand: "Porsche",
    model: "911",
    archetype: "Точность",
    keywords: ["Precision", "Icon", "Engineering"],
    motto: "Силуэт, в котором нечего убрать.",
    chapter:
      "Линия 911 почти не менялась шестьдесят лет — поэтому любая голограмма на задних крыльях видна сразу. Полируем изгибы малым диаметром, вручную, и оставляем лаку максимум толщины.",
    program: ["Коррекция ЛКП", "PPF на фронт", "Керамика кузова"],
    focus: "Задние крылья · капот · арки",
    images: media.porsche,
  },
  {
    id: "bmw",
    numeral: "II",
    brand: "BMW",
    model: "M",
    archetype: "Контроль",
    keywords: ["Aggression", "Control", "Performance"],
    motto: "Агрессия, которую держат в руках.",
    chapter:
      "Острые кромки бампера, сетки воздухозаборников и карбон — зоны, где скорость оставляет следы первой. Сначала защищаем фронт полиуретаном, затем доводим фактуру: глянец там, где он нужен, сатин — там, где он честнее.",
    program: ["Полиуретан фронт", "Сатин-плёнка", "Керамика дисков"],
    focus: "Бампер · пороги · карбон",
    images: media.bmw,
  },
  {
    id: "mercedes",
    numeral: "III",
    brand: "Mercedes",
    model: "AMG",
    archetype: "Присутствие",
    keywords: ["Elegance", "Luxury", "Presence"],
    motto: "Спокойствие большой плоскости.",
    chapter:
      "Длинный капот и крыша работают как зеркало: они показывают любую паутину от моек. Здесь нужна многоэтапная коррекция и глубокий глянец, а внутри — деликатный уход за кожей Nappa.",
    program: ["Многоэтапная полировка", "Керамика", "Уход за салоном"],
    focus: "Капот · крыша · кожа салона",
    images: media.mercedes,
  },
];

export const chapters = {
  label: "Главы",
  title: ["Мы не работаем", "со всеми."],
  lead: "Ателье сосредоточено на трёх немецких автомобилях. Не потому, что другие хуже, — а потому что каждую из этих линий мы хотим знать до миллиметра.",
};

export type Detail = {
  id: string;
  title: string;
  en: string;
  source: string;
  /** Машина-источник: определяет цвет акцента детали */
  car: Car["id"];
  text: string;
  note: string;
  image: Media;
  /** Форма, через которую кадр раскрывается при скролле */
  reveal: "lens" | "line" | "circle" | "diamond" | "slit" | "rise";
};

export const anatomy = {
  label: "Анатомия",
  title: ["Качество живёт", "в деталях."],
  lead: "Шесть мест, по которым видно, был ли автомобиль в руках мастера. Листайте — деталь за деталью.",
  items: [
    {
      id: "headlight",
      title: "Фара",
      en: "Headlight",
      source: "BMW M4",
      car: "bmw",
      text: "Поликарбонат мутнеет от ультрафиолета и песка. Полируем оптику и закрываем плёнкой — свет снова режет темноту.",
      note: "Оптика · полировка + PPF",
      image: details.headlight,
      reveal: "lens",
    },
    {
      id: "body",
      title: "Кузов",
      en: "Body line",
      source: "Mercedes CLS",
      car: "mercedes",
      text: "Линия плеча — место, где видна каждая волна лака. Коррекция идёт по свету, а не по таймеру.",
      note: "Лак · многоэтапная коррекция",
      image: details.body,
      reveal: "line",
    },
    {
      id: "wheel",
      title: "Колесо",
      en: "Wheel",
      source: "Mercedes CLS",
      car: "mercedes",
      text: "Тормозная пыль въедается в лак дисков. Снимаем колёса, чистим изнутри и защищаем керамикой.",
      note: "Диски · деконтаминация + керамика",
      image: details.wheel,
      reveal: "circle",
    },
    {
      id: "interior",
      title: "Салон",
      en: "Interior",
      source: "Mercedes-AMG",
      car: "mercedes",
      text: "Кожа Nappa не терпит агрессивной химии. Только pH-нейтральные составы, мягкие щётки и терпение.",
      note: "Кожа · очистка + защита",
      image: details.interior,
      reveal: "diamond",
    },
    {
      id: "light",
      title: "Отражение",
      en: "Reflection",
      source: "Porsche 911 Turbo S",
      car: "porsche",
      text: "Отражение — главный инструмент контроля. Если полоса света ломается на панели, работа не закончена.",
      note: "Контроль · инспекционный свет",
      image: details.light,
      reveal: "slit",
    },
    {
      id: "paint",
      title: "Покрытие",
      en: "Coating",
      source: "Porsche 911 Turbo S",
      car: "porsche",
      text: "Керамика превращает воду в капли, а грязь — в гостя. Слой в пару микрон, который видно с первого дождя.",
      note: "ЛКП · керамическое покрытие",
      image: details.paint,
      reveal: "rise",
    },
  ] satisfies Detail[],
};

export const transformation = {
  label: "Трансформация",
  car: "Porsche 911 GT3 Touring",
  title: { lead: "Свет", accent: "не врёт." },
  lead: "Тест 50/50 — так детейлеры проверяют работу. Лента делит панель: слева лак как есть, справа — после коррекции. Под точечной лампой разницу не спрятать.",
  hint: { mouse: "проведите лампой по кузову", touch: "лампу можно перетащить" },
  sides: { before: "До коррекции", after: "После" },
  tape: "VANTA · ТЕСТ 50/50 · ",
  peel: "Снять ленту",
  reset: "Вернуть ленту",
  done: "Коррекция в два этапа · керамика",
  disclaimer: "Визуализация: состояние «до» смоделировано",
};

/* ─────────────────────────────────────────────
   04 — Услуги
   ───────────────────────────────────────────── */
export type Service = {
  id: string;
  title: string;
  en: string;
  text: string;
  duration: string;
  price: string;
  /** Для каких глав (автомобилей) услуга входит в базовую программу */
  chapters: Car["id"][];
  image: Media;
};

export const services = {
  label: "Услуги",
  title: { lead: "Шесть работ.", accent: "Одна мера." },
  lead: "Каждую работу мы делаем одинаково тщательно — меняется только то, что нужно именно вашему автомобилю. Цены — ориентир, итог фиксируем после осмотра.",
  chaptersLabel: "В программе глав",
  items: [
    {
      id: "wash",
      title: "Мойка и деконтаминация",
      en: "Decontamination",
      text: "Двухфазная мойка, глина и составы от металлических вкраплений. Поверхность становится чистой на ощупь, а не только на вид.",
      duration: "3–4 ч",
      price: "от 6 000 ₽",
      chapters: ["porsche", "bmw", "mercedes"],
      image: details.paint,
    },
    {
      id: "correction",
      title: "Коррекция ЛКП",
      en: "Paint correction",
      text: "Одно- и многоэтапная полировка. Убираем голограммы и паутину, снимая микроны, — толщину лака замеряем до и после.",
      duration: "1–3 дня",
      price: "от 35 000 ₽",
      chapters: ["porsche", "mercedes"],
      image: details.body,
    },
    {
      id: "ceramic",
      title: "Керамическое покрытие",
      en: "Ceramic coating",
      text: "Твёрдый слой в пару микрон поверх лака: гидрофобность, химическая стойкость и глубокий «мокрый» глянец.",
      duration: "2–3 дня",
      price: "от 45 000 ₽",
      chapters: ["porsche", "bmw", "mercedes"],
      image: details.light,
    },
    {
      id: "ppf",
      title: "Полиуретан",
      en: "Paint protection film",
      text: "Прозрачная броня от сколов и песка — на фронт или кузов целиком. Глянец, мат или сатин, с заворотом кромок.",
      duration: "2–5 дней",
      price: "от 90 000 ₽",
      chapters: ["porsche", "bmw"],
      image: details.headlight,
    },
    {
      id: "interior",
      title: "Салон и кожа",
      en: "Interior & leather",
      text: "Очистка и защита кожи Nappa, алькантары и открытых пор дерева. Только pH-нейтральные составы и мягкие щётки.",
      duration: "1 день",
      price: "от 18 000 ₽",
      chapters: ["mercedes"],
      image: details.interior,
    },
    {
      id: "wheels",
      title: "Диски и оптика",
      en: "Wheels & optics",
      text: "Снимаем колёса, чистим изнутри и покрываем керамикой. Полируем помутневшую оптику и закрываем плёнкой.",
      duration: "1 день",
      price: "от 12 000 ₽",
      chapters: ["bmw", "mercedes"],
      image: details.wheel,
    },
  ] satisfies Service[],
};

/* ─────────────────────────────────────────────
   05 — Форматы работ (конфигуратор)
   Цены — ориентиры «от» для демонстрационного концепта.
   ───────────────────────────────────────────── */
export type Format = {
  id: "essential" | "signature" | "atelier";
  name: string;
  subtitle: string;
  duration: string;
  includes: string[];
  /** Ориентир стоимости «от», ₽, по автомобилю */
  price: Record<Car["id"], number>;
};

export const formats = {
  label: "Форматы",
  title: { lead: "Соберите", accent: "свою программу." },
  lead: "Три формата работы для каждого из трёх автомобилей. Выберите машину и глубину — состав и ориентир стоимости обновятся.",
  carLabel: "Автомобиль",
  formatLabel: "Формат",
  priceLabel: "Ориентир",
  note: "Итоговая смета — после осмотра и замера толщины ЛКП. Доплат по ходу работ не бывает.",
  cta: { label: "Записаться на осмотр", href: "#contact" },
  items: [
    {
      id: "essential",
      name: "Essential",
      subtitle: "Уход и блеск",
      duration: "2 дня",
      includes: [
        "Мойка и деконтаминация",
        "Одноэтапная полировка",
        "Керамика кузова, 1 слой",
        "Очистка дисков",
      ],
      price: { porsche: 42000, bmw: 38000, mercedes: 44000 },
    },
    {
      id: "signature",
      name: "Signature",
      subtitle: "Коррекция и защита",
      duration: "5 дней",
      includes: [
        "Двухэтапная коррекция ЛКП",
        "Полиуретан на фронт",
        "Керамика кузова, 2 слоя",
        "Керамика дисков и оптика",
      ],
      price: { porsche: 165000, bmw: 150000, mercedes: 175000 },
    },
    {
      id: "atelier",
      name: "Atelier",
      subtitle: "Полная программа",
      duration: "8–10 дней",
      includes: [
        "Многоэтапная коррекция ЛКП",
        "Полиуретан на весь кузов",
        "Керамика поверх плёнки",
        "Салон и кожа",
        "Фотоотчёт по каждому этапу",
      ],
      price: { porsche: 520000, bmw: 480000, mercedes: 560000 },
    },
  ] satisfies Format[],
};
