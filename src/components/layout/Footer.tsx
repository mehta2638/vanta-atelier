import { cars, cta, nav, site } from "@/content/site";

/**
 * Footer как выходные данные журнала: колонки навигации, глав и контактов,
 * внизу — вордмарк во всю ширину, обрезанный по нижнему краю.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-black pt-[clamp(64px,10vh,112px)]">
      <div className="container-x">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <p className="text-label text-offwhite/55">Выпуск N°01 · MMXXVI</p>
            <p className="mt-5 max-w-[30ch] font-display text-[clamp(26px,2.4vw,34px)] leading-[1.1] tracking-[-0.03em]">
              Частное ателье детейлинга для трёх характеров.
            </p>
            <a
              href={cta.href}
              className="group mt-7 inline-flex items-baseline gap-3 border-b border-line-strong pb-1.5 text-[15px] transition-colors hover:border-offwhite/70"
            >
              {cta.label}
              <span aria-hidden className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>

          <nav aria-label="Навигация в подвале" className="lg:col-span-2 lg:col-start-6">
            <p className="text-label text-offwhite/55">Разделы</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="group flex items-baseline gap-3 text-[15px] text-offwhite/80 transition-colors hover:text-offwhite">
                    <span className="font-mono text-[11px] text-offwhite/55">{item.n}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <p className="text-label text-offwhite/55">Главы</p>
            <ul className="mt-5 space-y-3">
              {cars.map((car) => (
                <li key={car.id} className={`accent-${car.id} flex items-baseline gap-3 text-[15px] text-offwhite/80`}>
                  <span aria-hidden className="w-6 font-serif text-[17px] text-(--accent)">
                    {car.numeral}
                  </span>
                  {car.brand} {car.model}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-label text-offwhite/55">Контакты</p>
            <dl className="mt-5 space-y-3 font-mono text-[13px]">
              <div className="flex justify-between gap-4 lg:block">
                <dt className="sr-only">Телефон</dt>
                <dd>
                  <a href={site.phoneHref} className="text-offwhite/85 transition-colors hover:text-offwhite">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Telegram</dt>
                <dd className="text-offwhite/85">{site.telegram}</dd>
              </div>
              <div>
                <dt className="sr-only">Часы работы</dt>
                <dd className="text-offwhite/55">{site.hours}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-[clamp(56px,9vh,96px)] flex flex-col gap-3 border-t border-line pt-6 text-[12px] text-offwhite/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} VANTA Atelier — демонстрационный концепт. Контакты — заглушки.</p>
          <p>Фото — временные, Unsplash</p>
          <a href="#top" className="text-label self-start text-offwhite/70 transition-colors hover:text-offwhite sm:self-auto">
            Наверх ↑
          </a>
        </div>
      </div>

      {/* Вордмарк во всю ширину, срезан по нижнему краю */}
      <p
        aria-hidden
        className="pointer-events-none mt-6 -mb-[0.2em] text-center font-display text-[29vw] leading-[0.8] font-semibold tracking-[0.02em] text-offwhite/[0.06] select-none"
      >
        VANTA
      </p>
    </footer>
  );
}
