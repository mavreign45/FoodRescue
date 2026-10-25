import { cn } from "@/utils/cn";

export function MatchScore({ score, size = 68, className }) {
  const normalized = Math.max(0, Math.min(100, Number(score) || 0));
  const strokeWidth = size >= 64 ? 5 : 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (normalized / 100) * circumference;
  const color =
    normalized >= 90
      ? "var(--color-forest-600)"
      : normalized >= 80
        ? "var(--color-gold-600)"
        : "var(--color-forest-400)";

  return (
    <div
      role="img"
      aria-label={`${normalized}% match score, calculated by the backend`}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <svg
        aria-hidden="true"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-cream-200)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-semibold leading-none text-forest-950"
          style={{ fontSize: size * 0.28 }}
        >
          {normalized}
          <span className="text-[0.55em]">%</span>
        </span>
        <span className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
          match
        </span>
      </div>
    </div>
  );
}
