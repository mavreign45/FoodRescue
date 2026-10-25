import {
  CheckCircle2,
  CircleAlert,
  FlaskConical,
  Info,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/utils/cn";

const TONES = {
  info: {
    icon: Info,
    container: "border-forest-900/10 bg-cream-100/70 text-ink-soft",
    iconClass: "text-forest-600",
    titleClass: "text-forest-950",
  },
  sample: {
    icon: FlaskConical,
    container: "border-dashed border-coral-300/80 bg-coral-50/70 text-coral-700",
    iconClass: "text-coral-600",
    titleClass: "text-coral-700",
  },
  tip: {
    icon: Lightbulb,
    container: "border-gold-300/60 bg-gold-100/60 text-[#6d520f]",
    iconClass: "text-gold-600",
    titleClass: "text-[#5d460d]",
  },
  success: {
    icon: CheckCircle2,
    container: "border-forest-200 bg-forest-50 text-forest-800",
    iconClass: "text-forest-600",
    titleClass: "text-forest-900",
  },
  warning: {
    icon: CircleAlert,
    container: "border-coral-200 bg-coral-50 text-coral-700",
    iconClass: "text-coral-600",
    titleClass: "text-coral-700",
  },
};

export function InlineNotice({
  tone = "info",
  title,
  children,
  className,
  icon,
}) {
  const style = TONES[tone] ?? TONES.info;
  const Icon = icon ?? style.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border px-4 py-3.5",
        style.container,
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        size={17}
        strokeWidth={1.9}
        className={cn("mt-0.5 shrink-0", style.iconClass)}
      />
      <div className="min-w-0 text-[13px] leading-relaxed">
        {title ? (
          <p className={cn("font-semibold", style.titleClass)}>{title}</p>
        ) : null}
        <div className={cn(title && "mt-0.5")}>{children}</div>
      </div>
    </div>
  );
}
