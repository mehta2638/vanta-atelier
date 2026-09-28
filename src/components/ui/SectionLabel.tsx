/** Технический заголовок раздела: «01 — Подход» с линией до края. */
export function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 text-label text-muted ${className}`}>
      <span className="text-offwhite/80">{index}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </div>
  );
}
