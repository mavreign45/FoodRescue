import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  ShieldAlert,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { getListing } from "@/services/listingsService";
import { createReservation } from "@/services/reservationsService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  ALLERGEN_LABELS,
  CATEGORY_LABELS,
  DIETARY_LABELS,
} from "@/constants/food";
import {
  formatDateTime,
  formatNumber,
  formatPickupWindow,
  portionLabel,
} from "@/utils/format";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge, SampleBadge, StatusBadge } from "@/components/ui/Badge";
import { DeadlineChip } from "@/components/ui/DeadlineChip";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { ErrorState } from "@/components/ui/States";
import { Skeleton } from "@/components/ui/Skeleton";
import { CategoryIcon } from "@/components/food/CategoryIcon";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";

function DetailsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]" aria-busy="true" aria-label="Loading listing">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="space-y-4 pt-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-2 gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    </div>
  );
}

function MetaTile({ icon: Icon, label, children }) {
  return (
    <div className="rounded-2xl border border-forest-900/10 bg-white p-4">
      <span className="grid size-8 place-items-center rounded-lg bg-forest-50 text-forest-700">
        <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
      </span>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
        {label}
      </p>
      <p className="mt-1 text-[12.5px] font-semibold leading-snug text-forest-950">
        {children}
      </p>
    </div>
  );
}

export function FoodDetailsPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: listing, isLoading, error, retry } = useAsyncData(
    () => getListing(listingId),
    [listingId],
  );
  const [requesting, setRequesting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState(null);

  const handleRequest = async () => {
    if (!listing) return;

    const available = Math.max(
      0,
      listing.portions - (listing.portions_reserved ?? 0),
    );
    if (available === 0) return;

    setRequesting(true);

    try {
      const request = await createReservation({
        listing_id: listing.id,
        listing_title: listing.title,
        listing_photo_url: listing.photo_url,
        listing_category: listing.category,
        donor_id: listing.donor_id,
        donor_name: listing.donor_name,
        portions_requested: available,
        pickup_window_start: listing.pickup_window_start,
        pickup_window_end: listing.pickup_window_end,
        pickup_address: listing.pickup_address,
        pickup_instructions: listing.pickup_instructions,
        distance_km: listing.distance_km,
        message: "Requested from the food details page.",
      });

      setCreatedRequest(request);
      toast({
        title: "Sample reservation created",
        description:
          "The request is tracked in this preview. No donor was notified.",
      });
    } catch (requestError) {
      toast({
        title: "We couldn't create that request",
        description: requestError.message || "Please try again in a moment.",
        tone: "error",
      });
    } finally {
      setRequesting(false);
    }
  };

  const backToDiscover = (
    <Button to="/discover" variant="secondary" size="sm" icon={ArrowLeft}>
      Back to the food board
    </Button>
  );

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState
          title="We couldn't find that listing"
          description="It may have been collected, withdrawn, or this sample link may not exist."
          onRetry={retry}
        />
        <div className="mt-6 flex justify-center">{backToDiscover}</div>
      </Container>
    );
  }

  if (isLoading || !listing) {
    return (
      <Container className="py-10">
        <DetailsSkeleton />
      </Container>
    );
  }

  const available = Math.max(
    0,
    listing.portions - (listing.portions_reserved ?? 0),
  );
  const canRequest =
    available > 0 &&
    ["available", "reserved"].includes(listing.status);
  const allergens = listing.allergens ?? [];
  const dietaryTags = listing.dietary_tags ?? [];

  return (
    <div className="pb-20 sm:pb-24">
      <Container className="pt-7 sm:pt-9">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[11px] text-ink-soft"
        >
          <Link to="/" className="transition hover:text-forest-900">
            Home
          </Link>
          <span aria-hidden="true" className="text-ink-soft/40">
            /
          </span>
          <Link to="/discover" className="transition hover:text-forest-900">
            Discover food
          </Link>
          <span aria-hidden="true" className="text-ink-soft/40">
            /
          </span>
          <span className="max-w-[240px] truncate font-medium text-forest-800">
            {listing.title}
          </span>
        </nav>

        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-forest-900/10 shadow-card">
              <img
                src={listing.photo_url}
                alt={`${listing.title} from ${listing.donor_name}`}
                className="aspect-[4/3] w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-950/45 via-transparent to-transparent"
              />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <Badge tone="white" className="backdrop-blur-md">
                  <CategoryIcon category={listing.category} size={12} />
                  {CATEGORY_LABELS[listing.category] ?? listing.category}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-cream-100/90">
                    <MapPin aria-hidden="true" size={12} />
                    {listing.pickup_address}
                  </p>
                  <p className="mt-1 font-display text-xl leading-tight">
                    {listing.donor_name}
                  </p>
                </div>
                <DeadlineChip deadline={listing.pickup_window_end} />
              </div>
            </div>

            <div className="mt-4">
              <InlineNotice tone="sample">
                This is a sample listing. Photos, quantities and windows are
                illustrative until the listing API is connected.
              </InlineNotice>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={listing.status} />
              <SampleBadge label="Sample listing" />
            </div>

            <h1 className="mt-4 text-[clamp(2rem,4vw,3rem)] leading-[1.02] text-forest-950">
              {listing.title}
            </h1>

            <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-soft">
              {listing.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MetaTile icon={Timer} label="Prepared">
                {formatDateTime(listing.prepared_at)}
              </MetaTile>
              <MetaTile icon={CalendarClock} label="Pickup window">
                {formatPickupWindow(
                  listing.pickup_window_start,
                  listing.pickup_window_end,
                )}
              </MetaTile>
              <MetaTile icon={UtensilsCrossed} label="Quantity">
                {portionLabel(listing.portions)}
                {available > 0 ? (
                  <span className="mt-0.5 block text-[10.5px] font-normal text-ink-soft">
                    {formatNumber(available)} still available
                  </span>
                ) : (
                  <span className="mt-0.5 block text-[10.5px] font-normal text-coral-600">
                    Fully allocated
                  </span>
                )}
              </MetaTile>
              <MetaTile icon={MapPin} label="Distance">
                {listing.distance_km} km
                <span className="mt-0.5 block text-[10.5px] font-normal text-ink-soft">
                  from Riverside centre
                </span>
              </MetaTile>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2">
                <ShieldAlert
                  aria-hidden="true"
                  size={15}
                  className="text-coral-600"
                />
                <h2 className="font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-forest-900">
                  Allergens
                </h2>
              </div>
              {allergens.length > 0 ? (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {allergens.map((allergen) => (
                    <span
                      key={allergen}
                      className="rounded-full border border-coral-200 bg-coral-50 px-3 py-1.5 text-[11px] font-semibold text-coral-700"
                    >
                      {ALLERGEN_LABELS[allergen] ?? allergen}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-[11px] font-semibold text-forest-700">
                  <CheckCircle2 aria-hidden="true" size={12} />
                  No known allergens listed
                </p>
              )}

              {dietaryTags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cream-100 px-3 py-1.5 text-[11px] font-medium text-forest-700"
                    >
                      {DIETARY_LABELS[tag] ?? tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="mt-6 rounded-2xl border border-forest-900/10 bg-white p-4 shadow-card">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <ClipboardList aria-hidden="true" size={16} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="text-[13px] font-semibold text-forest-950">
                    Pickup instructions
                  </h2>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                    {listing.pickup_instructions}
                  </p>
                  <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-forest-700">
                    <Clock3 aria-hidden="true" size={12} />
                    {formatPickupWindow(
                      listing.pickup_window_start,
                      listing.pickup_window_end,
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {createdRequest ? (
                <div className="rounded-2xl border border-forest-200 bg-forest-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      aria-hidden="true"
                      size={20}
                      className="mt-0.5 shrink-0 text-forest-600"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold text-forest-950">
                        Sample reservation created
                      </p>
                      <p className="mt-1 text-[12px] leading-relaxed text-forest-800">
                        {portionLabel(available)} of {listing.title} requested
                        from {listing.donor_name}. This preview doesn&rsquo;t
                        notify anyone.
                      </p>
                      <Button
                        to={`/tracking/${createdRequest.id}`}
                        size="sm"
                        variant="dark"
                        trailingIcon={ArrowUpRight}
                        className="mt-3"
                      >
                        Track this request
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between",
                  )}
                >
                  <Button
                    onClick={handleRequest}
                    loading={requesting}
                    disabled={!canRequest || requesting}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {!canRequest && available === 0
                      ? "Fully reserved"
                      : requesting
                        ? "Sending request…"
                        : `Request ${formatNumber(available)} portions`}
                  </Button>
                  <button
                    type="button"
                    onClick={() => navigate("/discover")}
                    className="text-[12px] font-medium text-ink-soft transition hover:text-forest-900"
                  >
                    Keep browsing the board
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
