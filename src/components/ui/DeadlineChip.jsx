import { Clock3 } from "lucide-react";
import { cn } from "@/utils/cn";
import { getDeadlineMeta } from "@/utils/format";

const URGENCY_STYLES = {
  urgent: "bg-coral-500 text-white",
  soon: "bg-gold-500 text-forest-950",
  normal: "bg-white/95 text-forest-900 shadow-sm backdrop-blur",
  past: "bg-forest-950/65 text-cream-100 backdrop-blur",
};

export function DeadlineChip({ deadline, className }) {
  const meta = getDeadlineMeta(deadline);

  return (
    <span
      title={
        deadline
          ? `Pickup deadline: ${new Date(deadline).toLocaleString()}`
          : undefined
      }
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        URGENCY_STYLES[meta.urgency],
        className,
      )}
    >
      <Clock3 aria-hidden="true" size={12} strokeWidth={2.2} />
      {meta.label}
    </span>
  );
}
