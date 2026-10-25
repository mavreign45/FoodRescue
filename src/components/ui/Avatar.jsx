import { cn } from "@/utils/cn";
import { initials } from "@/utils/format";

const TONES = [
  "bg-forest-100 text-forest-700",
  "bg-coral-100 text-coral-700",
  "bg-gold-100 text-[#806014]",
  "bg-[#e9e4f2] text-[#5d4b7a]",
];

const SIZES = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-[11px]",
  lg: "size-12 text-sm",
};

export function Avatar({ name, size = "md", className }) {
  const hash = [...(name ?? "")]
    .reduce((total, character) => total + character.charCodeAt(0), 0);
  const tone = TONES[hash % TONES.length];

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold tracking-wide",
        SIZES[size],
        tone,
        className,
      )}
    >
      {initials(name) || "FR"}
    </span>
  );
}
