import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

export function Logo({ className, invert = false, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="FoodRescue home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-[11px] shadow-sm transition-transform duration-300 group-hover:-rotate-3",
          invert ? "bg-cream-50" : "bg-forest-900",
        )}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 32 32"
          className="size-[23px]"
          fill="none"
        >
          <path
            d="M22.2 7.2c-6.2-.4-10.4 2.7-10.9 7.1-.3 3.2 2 5.8 5.1 6 4.9.4 7.4-3.9 7.4-8.7 0-1.7-.3-3.6-1.6-4.4Z"
            fill={invert ? "#1B3325" : "#F7F1E6"}
          />
          <path
            d="M10.3 25.2c.9-4.2 3.4-7.6 6.9-9.8"
            stroke="#E87B5A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-[21px] font-semibold leading-none tracking-[-0.045em]",
          invert ? "text-cream-50" : "text-forest-950",
        )}
      >
        FoodRescue
      </span>
    </Link>
  );
}
