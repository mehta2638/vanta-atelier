import { site } from "@/content/site";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={`${site.name} — на главную`}
      className={`group inline-flex items-baseline gap-2.5 ${className}`}
    >
      <span className="font-display text-[19px] font-semibold tracking-[0.34em] md:text-[21px]">
        {site.name}
      </span>
      <span className="text-label hidden text-muted sm:inline">
        {site.descriptor}
      </span>
    </a>
  );
}
