import { FlaskConical } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  LISTING_STATUS_LABELS,
  RESERVATION_STATUS_LABELS,
} from "@/constants/food";

const TONES = {
  neutral: "border-forest-900/10 bg-cream-100 text-ink-soft",
  forest: "border-forest-200 bg-forest-100 text-forest-800",
  coral: "border-coral-200 bg-coral-50 text-coral-700",
  gold: "border-gold-300/70 bg-gold-100 text-[#7a5a11]",
  white: "border-white/25 bg-white/90 text-forest-900",
  dark: "border-forest-800 bg-forest-900 text-cream-50",
  outline: "border-forest-900/15 bg-transparent text-ink-soft",
};

export function Badge({ children, tone = "neutral", icon: Icon, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
    >
      {Icon ? <Icon aria-hidden="true" size={12} strokeWidth={2.1} /> : null}
      {children}
    </span>
  );
}

const STATUS_STYLES = {
  available: { tone: "forest", dot: "bg-forest-500" },
  reserved: { tone: "gold", dot: "bg-gold-500" },
  collected: { tone: "forest", dot: "bg-forest-700" },
  expired: { tone: "neutral", dot: "bg-ink-soft/50" },
  cancelled: { tone: "neutral", dot: "bg-ink-soft/40" },
  pending: { tone: "gold", dot: "bg-gold-500" },
  approved: { tone: "forest", dot: "bg-forest-500" },
  declined: { tone: "coral", dot: "bg-coral-500" },
};

export function StatusBadge({ status, type = "listing", className }) {
  const labels =
    type === "reservation" ? RESERVATION_STATUS_LABELS : LISTING_STATUS_LABELS;
  const style = STATUS_STYLES[status] ?? {
    tone: "neutral",
    dot: "bg-ink-soft/40",
  };

  return (
    <Badge tone={style.tone} className={className}>
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", style.dot)}
      />
      {labels[status] ?? status}
    </Badge>
  );
}

export function SampleBadge({
  label = "Sample data",
  className,
  title,
  tone = "default",
}) {
  const tones = {
    default: "border-coral-300 bg-coral-50 text-coral-700",
    light: "border-white/25 bg-white/10 text-cream-100 backdrop-blur-md",
  };

  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
        tones[tone] ?? tones.default,
        className,
      )}
    >
      <FlaskConical aria-hidden="true" size={11} strokeWidth={2} />
      {label}
    </span>
  );
}
