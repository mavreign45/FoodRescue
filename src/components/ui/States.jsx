import { cn } from "@/utils/cn";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-3xl border border-dashed border-forest-900/20 bg-white/55 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-14 place-items-center rounded-2xl bg-forest-100 text-forest-700">
          <Icon aria-hidden="true" size={25} strokeWidth={1.6} />
        </span>
      ) : null}
      <h3 className="mt-5 text-xl text-forest-950">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "We couldn't load this yet",
  description = "Something went wrong while fetching the latest information. Please try again.",
  onRetry,
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center rounded-3xl border border-coral-200/80 bg-coral-50/60 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-white text-coral-600 shadow-sm">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="size-6"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 8v5" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="0.8" fill="currentColor" stroke="none" />
          <path
            d="M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <h3 className="mt-5 text-xl text-forest-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        {description}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-forest-900 px-5 text-sm font-medium text-cream-50 transition hover:bg-forest-800"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
