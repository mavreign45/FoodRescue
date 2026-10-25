import { cn } from "@/utils/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  invert = false,
  className,
  titleClassName,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]",
              invert ? "text-forest-300" : "text-forest-600",
              align === "center" && "justify-center",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-px w-6",
                invert ? "bg-forest-400" : "bg-forest-400/70",
              )}
            />
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "text-[clamp(2rem,4vw,3.25rem)] leading-[1.04]",
            invert ? "text-cream-50" : "text-forest-950",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-xl text-[15px] leading-relaxed sm:text-base",
              invert ? "text-cream-200/80" : "text-ink-soft",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
