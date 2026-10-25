import { cn } from "@/utils/cn";
import { SampleBadge } from "./Badge";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  sample = false,
  className,
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-forest-900/10 bg-white p-5 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {Icon ? (
          <span className="grid size-10 place-items-center rounded-xl bg-forest-50 text-forest-700">
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
          </span>
        ) : (
          <span />
        )}
        {sample ? <SampleBadge label="Sample" className="py-1" /> : null}
      </div>
      <p className="mt-4 font-display text-[2rem] leading-none tracking-tight text-forest-950">
        {value}
      </p>
      <p className="mt-1.5 text-[13px] font-medium text-forest-900">{label}</p>
      {detail ? (
        <p className="mt-1 text-[11.5px] leading-snug text-ink-soft">{detail}</p>
      ) : null}
    </div>
  );
}
