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
