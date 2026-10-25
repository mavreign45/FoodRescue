import {
  ArrowUpRight,
  Check,
  Clock3,
  Heart,
  MapPin,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/utils/cn";
import {
  ALLERGEN_LABELS,
  CATEGORY_LABELS,
  DIETARY_LABELS,
} from "@/constants/food";
import {
  formatTime,
  portionLabel,
} from "@/utils/format";
import { Badge } from "@/components/ui/Badge";
import { DeadlineChip } from "@/components/ui/DeadlineChip";
import { CategoryIcon } from "./CategoryIcon";

export function FoodCard({
  listing,
  onReserve,
  isReserved = false,
  onToggleSave,
  isSaved = false,
}) {
  const dietaryTags = listing.dietary_tags ?? [];
  const allergens = listing.allergens ?? [];
  const visibleTags = dietaryTags.slice(0, 3);
  const extraTagCount = dietaryTags.length - visibleTags.length;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        <img
          src={listing.photo_url}
          alt={`${listing.title} from ${listing.donor_name}`}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-forest-950/60 via-forest-950/0 to-forest-950/5"
        />

        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <Badge tone="white" icon={undefined} className="backdrop-blur-md">
            <CategoryIcon category={listing.category} size={12} />
            {CATEGORY_LABELS[listing.category] ?? listing.category}
          </Badge>
          {onToggleSave ? (
            <button
              type="button"
              onClick={() => onToggleSave(listing.id)}
              aria-label={
                isSaved
                  ? `Remove ${listing.title} from saved listings`
                  : `Save ${listing.title} for later`
              }
              aria-pressed={isSaved}
              className={cn(
                "grid size-8 place-items-center rounded-full shadow-sm backdrop-blur transition",
                isSaved
                  ? "bg-coral-500 text-white"
                  : "bg-white/85 text-forest-900 hover:bg-white",
              )}
            >
              <Heart
                aria-hidden="true"
                size={14}
                className={isSaved ? "fill-current" : ""}
              />
            </button>
          ) : null}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-forest-950/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
            <MapPin aria-hidden="true" size={11} />
            {listing.distance_km} km
          </span>
          <DeadlineChip deadline={listing.pickup_window_end} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-forest-600">
          {listing.donor_name}
          <span aria-hidden="true" className="size-0.5 rounded-full bg-forest-400" />
          <span className="font-medium normal-case tracking-normal text-ink-soft">
            {listing.pickup_address?.split(",").slice(-1)[0]?.trim() || "Local pickup"}
          </span>
        </p>

        <h3 className="mt-2 line-clamp-2 text-[21px] leading-[1.18] text-forest-950">
          {listing.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-soft">
          {listing.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cream-100 px-2.5 py-1 text-[10.5px] font-medium text-forest-700"
            >
              {DIETARY_LABELS[tag] ?? tag}
            </span>
          ))}
          {extraTagCount > 0 ? (
            <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10.5px] font-medium text-ink-soft">
              +{extraTagCount}
            </span>
          ) : null}
          {allergens.length > 0 ? (
            <span
              title={`Contains ${allergens
                .map((allergen) => ALLERGEN_LABELS[allergen] ?? allergen)
                .join(", ")}`}
              className="inline-flex items-center gap-1 rounded-full bg-coral-50 px-2.5 py-1 text-[10.5px] font-medium text-coral-700"
            >
              <TriangleAlert aria-hidden="true" size={10} />
              Contains {ALLERGEN_LABELS[allergens[0]] ?? allergens[0]}
              {allergens.length > 1 ? ` +${allergens.length - 1}` : ""}
            </span>
          ) : null}
        </div>

        <div className="mt-auto border-t border-forest-900/8 pt-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-display text-[17px] leading-none text-forest-950">
                {portionLabel(listing.portions)}
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-ink-soft">
                <Clock3 aria-hidden="true" size={11} />
                Pickup from {formatTime(listing.pickup_window_start)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onReserve?.(listing)}
              disabled={isReserved}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium transition",
                isReserved
                  ? "bg-forest-100 text-forest-700"
                  : "bg-forest-900 text-cream-50 hover:bg-forest-800",
              )}
            >
              {isReserved ? (
                <>
                  <Check aria-hidden="true" size={13} />
                  Request sent
                </>
              ) : (
                <>
                  Reserve
                  <ArrowUpRight aria-hidden="true" size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
