import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

/*
 * Шрифты хранятся в проекте (src/app/fonts): сборка не зависит от Google Fonts.
 * Это те же variable-шрифты Google Fonts (лицензия OFL — рядом с файлами),
 * обрезанные до латиницы + кириллицы и до используемого диапазона весов.
 * Также в набор добавлены ₽, № и стрелки, которых нет в стандартных подмножествах.
 */
const interTight = localFont({
  src: "./fonts/InterTight.woff2",
  weight: "400 600",
  variable: "--font-inter-tight",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/Inter.woff2",
  weight: "400 600",
  variable: "--font-inter",
  display: "swap",
});

const cormorant = localFont({
  src: [
    { path: "./fonts/CormorantGaramond.woff2", weight: "300 400", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic.woff2", weight: "300 400", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const jetbrains = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  weight: "400 500",
  variable: "--font-jetbrains",
  display: "swap",
  adjustFontFallback: false,
});

const title = "VANTA Atelier — Porsche, BMW, Mercedes";
const description =
  "Концепт частного ателье детейлинга для Porsche 911, BMW M и Mercedes-AMG: коррекция ЛКП, керамика, полиуретан.";

/** Абсолютный адрес нужен превью в мессенджерах. На Vercel берётся из окружения. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

// Изображения превью и иконки подключаются файлами в app/: opengraph-image.jpg, icon.svg, apple-icon.png
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "VANTA Atelier",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${interTight.variable} ${inter.variable} ${jetbrains.variable} ${cormorant.variable} antialiased`}
    >
      <body>
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
