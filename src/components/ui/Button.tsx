import type { ComponentProps } from "react";

type Common = {
  variant?: "solid" | "ghost";
  size?: "md" | "lg";
};

/** С href — ссылка (навигация), без href — настоящая <button> (действие) */
type Props =
  | (Common & ComponentProps<"a"> & { href: string })
  | (Common & ComponentProps<"button"> & { href?: undefined });

const sizes = {
  md: "h-11 px-5 text-[13px]",
  lg: "h-14 px-7 text-[14px]",
};

/**
 * Solid — off-white плашка с чёрным текстом; при hover снизу поднимается
 * чуть более тёмный off-white (нейтрально, без цвета глав). Ghost — тонкая рамка.
 */
export function Button(props: Props) {
  const { variant = "solid", size = "md", className = "", children } = props;
  const base =
    "group/btn relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-colors duration-500 ease-out-expo";
  const look =
    variant === "solid"
      ? "bg-offwhite text-black"
      : "border border-line-strong text-offwhite hover:border-offwhite/40";

  const inner = (
    <>
      {variant === "solid" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 translate-y-full rounded-full bg-[#cfccc4] transition-transform duration-500 ease-out-expo group-hover/btn:translate-y-0"
        />
      )}
      <span>{children}</span>
      <Arrow />
    </>
  );
  const cls = `${base} ${sizes[size]} ${look} ${className}`;

  if (props.href !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <a className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
  return (
    <button type="button" className={`${cls} cursor-pointer disabled:cursor-default`} {...rest}>
      {inner}
    </button>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`relative inline-flex size-3.5 overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 14 14"
        className="absolute inset-0 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-full"
      >
        <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg
        viewBox="0 0 14 14"
        className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0"
      >
        <path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}
