import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ChevronRight,
  LayoutGrid,
  MapPin,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getListings } from "@/services/listingsService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  CATEGORY_LABELS,
  DIETARY_LABELS,
  DISTANCE_OPTIONS,
  FOOD_CATEGORIES,
  SORT_OPTIONS,
} from "@/constants/food";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge, SampleBadge } from "@/components/ui/Badge";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { FoodCardSkeleton } from "@/components/ui/Skeleton";
import { FoodCard } from "@/components/food/FoodCard";
import { CategoryIcon } from "@/components/food/CategoryIcon";
import { Select } from "@/components/ui/Form";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";

const INITIAL_FILTERS = {
  category: "all",
  distance: "any",
  dietary: "any",
  sort: "deadline",
};

function CategoryChip({ selected, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] font-medium transition",
        selected
          ? "border-forest-900 bg-forest-900 text-cream-50 shadow-sm"
          : "border-forest-900/10 bg-white text-ink-soft hover:border-forest-300 hover:text-forest-900",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function DiscoverPage() {
  const [searchParams] = useSearchParams();
  const preview = import.meta.env.DEV ? searchParams.get("preview") : null;
  const { data, isLoading, error, retry } = useAsyncData(getListings, []);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [reserved, setReserved] = useState(() => new Set());
  const searchRef = useRef(null);
  const { toast } = useToast();

  const listings = data?.items ?? [];

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const filteredListings = useMemo(() => {
    const search = deferredQuery.trim().toLowerCase();
    const maxDistance =
      filters.distance === "any" ? Infinity : Number(filters.distance);

    return listings
      .filter((listing) => {
        if (
          listing.status !== "available" &&
          listing.status !== "reserved"
        ) {
          return false;
        }
        if (filters.category !== "all" && listing.category !== filters.category) {
          return false;
        }
        if (listing.distance_km > maxDistance) return false;
        if (
          filters.dietary !== "any" &&
          !(listing.dietary_tags ?? []).includes(filters.dietary)
        ) {
          return false;
        }

        if (!search) return true;

        const haystack = [
          listing.title,
          listing.donor_name,
          listing.description,
          CATEGORY_LABELS[listing.category],
          ...(listing.dietary_tags ?? []).map((tag) => DIETARY_LABELS[tag]),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      })
      .sort((a, b) => {
        if (filters.sort === "distance") return a.distance_km - b.distance_km;
        if (filters.sort === "portions") return b.portions - a.portions;
        return new Date(a.pickup_window_end) - new Date(b.pickup_window_end);
      });
  }, [listings, deferredQuery, filters]);

  const hasFilters =
    filters.category !== "all" ||
    filters.distance !== "any" ||
    filters.dietary !== "any" ||
    query.trim().length > 0;

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setQuery("");
  };

  const handleReserve = (listing) => {
    setReserved((current) => new Set(current).add(listing.id));
    toast({
      title: "Sample request saved",
      description: `${listing.title} is marked on this screen only. No request was sent to a real donor.`,
      tone: "info",
    });
  };

  const showLoading = isLoading || preview === "loading";
  const showError = preview === "error" || Boolean(error);
  const forceEmpty = preview === "empty";

  const visibleListings = forceEmpty ? [] : filteredListings;
  const filterCount = [
    filters.category !== "all",
    filters.distance !== "any",
    filters.dietary !== "any",
    query.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="pb-20 sm:pb-24">
      <div className="border-b border-forest-900/10 bg-[linear-gradient(180deg,rgba(225,237,227,0.55),rgba(252,250,244,0))]">
        <Container className="pt-8 pb-8 sm:pt-12 sm:pb-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-soft">
            <Link to="/" className="transition hover:text-forest-900">
              Home
            </Link>
            <ChevronRight aria-hidden="true" size={11} className="text-ink-soft/50" />
            <span className="font-medium text-forest-800">Discover food</span>
          </nav>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
                <span aria-hidden="true" className="h-px w-6 bg-forest-400" />
                Nearby surplus, ready to collect
              </p>
              <h1 className="text-[clamp(2.6rem,5.6vw,4.3rem)] leading-[0.99] text-forest-950">
                Find good food,{" "}
                <span className="italic text-coral-600">close to home.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                Browse surplus from local bakeries, kitchens and grocers. Every
                listing shows the pickup deadline, distance and allergens up
                front — so you can plan a collection with confidence.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
              <SampleBadge label="Sample listings" />
              <Badge tone="forest" className="bg-white/70">
                <MapPin aria-hidden="true" size={12} />
                Riverside &amp; nearby
              </Badge>
            </div>
          </div>

          <div className="mt-6">
            <InlineNotice tone="sample">
              This is a prototype food discovery feed. Listings, donors and
              distances are sample content; reservation actions stay on this
              screen.
            </InlineNotice>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mt-8 rounded-3xl border border-forest-900/10 bg-white/80 p-3.5 shadow-card backdrop-blur sm:p-4">
          <div className="flex flex-col gap-2.5 xl:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-500"
              />
              <label htmlFor="food-search" className="sr-only">
                Search sample food listings
              </label>
              <input
                ref={searchRef}
                id="food-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search food, donors or neighbourhoods"
                className="h-12 w-full rounded-2xl border border-forest-900/12 bg-cream-50/60 pl-11 pr-14 text-sm text-forest-950 outline-none transition placeholder:text-ink-soft/55 hover:border-forest-900/20 focus:border-forest-500 focus:bg-white focus:ring-4 focus:ring-forest-500/10 [&::-webkit-search-cancel-button]:hidden"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-soft transition hover:bg-cream-100 hover:text-forest-900"
                >
                  <X aria-hidden="true" size={14} />
                </button>
              ) : (
                <kbd className="pointer-events-none absolute right-3.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-forest-900/15 bg-white px-1.5 py-1 font-sans text-[10px] font-medium text-ink-soft sm:block">
                  /
                </kbd>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:w-[560px]">
              <Select
                aria-label="Maximum distance"
                value={filters.distance}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    distance: event.target.value,
                  }))
                }
                className="h-12 rounded-2xl bg-white"
              >
                {DISTANCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>

              <Select
                aria-label="Dietary requirement"
                value={filters.dietary}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    dietary: event.target.value,
                  }))
                }
                className="h-12 rounded-2xl bg-white"
              >
                <option value="any">All dietary needs</option>
                {Object.entries(DIETARY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>

              <div className="col-span-2 sm:col-span-1">
                <Select
                  aria-label="Sort listings"
                  value={filters.sort}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      sort: event.target.value,
                    }))
                  }
                  className="h-12 rounded-2xl bg-white"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto border-t border-forest-900/8 pt-3 no-scrollbar">
            <CategoryChip
              selected={filters.category === "all"}
              onClick={() =>
                setFilters((current) => ({ ...current, category: "all" }))
              }
              icon={<LayoutGrid aria-hidden="true" size={13} />}
              label="All food"
            />
            {FOOD_CATEGORIES.map((category) => (
              <CategoryChip
                key={category.value}
                selected={filters.category === category.value}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    category: category.value,
                  }))
                }
                icon={<CategoryIcon category={category.value} size={13} />}
                label={category.label}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[12.5px] text-ink-soft">
              <span className="font-semibold text-forest-950">
                {showLoading ? "—" : visibleListings.length}
              </span>{" "}
              sample {visibleListings.length === 1 ? "listing" : "listings"}
              {!showLoading && hasFilters ? " match your filters" : " nearby"}
            </p>
            {filterCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-2.5 py-1 text-[10.5px] font-semibold text-forest-700">
                <SlidersHorizontal aria-hidden="true" size={11} />
                {filterCount} active
              </span>
            ) : null}
          </div>

          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11.5px] font-medium text-forest-700 transition hover:bg-forest-100"
            >
              <RotateCcw aria-hidden="true" size={12} />
              Reset filters
            </button>
          ) : null}
        </div>

        <div className="mt-4">
          {showLoading ? (
            <div
              aria-busy="true"
              aria-label="Loading sample listings"
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <FoodCardSkeleton key={index} />
              ))}
            </div>
          ) : showError ? (
            <ErrorState
              title="The food board didn't load"
              description="We couldn't fetch the sample listings. Check your connection and try again."
              onRetry={retry}
            />
          ) : visibleListings.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={hasFilters ? "No listings match that search" : "The board is quiet right now"}
              description={
                hasFilters
                  ? "Try widening the distance, choosing another category, or clearing your search."
                  : "There are no sample listings available at the moment. Check back shortly or refresh the board."
              }
              action={
                hasFilters ? (
                  <Button
                    onClick={resetFilters}
                    variant="dark"
                    icon={RotateCcw}
                    size="sm"
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button onClick={retry} variant="dark" size="sm">
                    Refresh listings
                  </Button>
                )
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleListings.map((listing) => (
                <FoodCard
                  key={listing.id}
                  listing={listing}
                  onReserve={handleReserve}
                  isReserved={reserved.has(listing.id)}
                />
              ))}
            </div>
          )}
        </div>

        {!showLoading && !showError && visibleListings.length > 0 ? (
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-[11px] text-ink-soft/70">
            <MapPin aria-hidden="true" size={12} />
            Distances are measured from Riverside city centre in this sample
            dataset.
          </p>
        ) : null}
      </Container>
    </div>
  );
}
