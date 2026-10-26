import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  History as HistoryIcon,
  Inbox,
  MapPin,
  Sparkles,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { getOrganizationWorkspace } from "@/services/organizationService";
import {
  createReservation,
  updateRequestStatus,
} from "@/services/reservationsService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  formatDay,
  formatNumber,
  formatPickupWindow,
  formatRelativeTime,
  formatTime,
  portionLabel,
} from "@/utils/format";
import { Container } from "@/components/layout/Container";
import { WorkspaceHeader } from "@/components/dashboard/WorkspaceHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge, SampleBadge, StatusBadge } from "@/components/ui/Badge";
import { MatchScore } from "@/components/ui/MatchScore";
import { DeadlineChip } from "@/components/ui/DeadlineChip";
import { CollectionsTable } from "@/components/dashboard/CollectionsTable";
import { Avatar } from "@/components/ui/Avatar";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";

const ACTIVE_REQUEST_STATUSES = ["pending", "approved"];

function RecommendationCard({ recommendation, requested, busy, onRequest }) {
  const { listing, match_score, match_reasons } = recommendation;
  const available = Math.max(
    0,
    listing.portions - (listing.portions_reserved ?? 0),
  );

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex gap-3.5 p-4 sm:p-5">
        <div className="relative size-[88px] shrink-0 overflow-hidden rounded-2xl bg-cream-100 sm:size-24">
          <img
            src={listing.photo_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-0.5 rounded-full bg-forest-950/60 px-2 py-0.5 text-[9.5px] font-medium text-white backdrop-blur">
            <MapPin aria-hidden="true" size={9} />
            {listing.distance_km} km
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-600">
                {listing.donor_name}
              </p>
              <h3 className="mt-1 line-clamp-2 text-[17.5px] leading-[1.2] text-forest-950">
                {listing.title}
              </h3>
            </div>
            <MatchScore score={match_score} size={56} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-cream-100 px-2 py-0.5 text-[10px] font-medium text-forest-700">
              {portionLabel(available)} available
            </span>
            <DeadlineChip deadline={listing.pickup_window_end} />
          </div>
        </div>
      </div>

      <div className="mx-4 rounded-xl border border-forest-900/5 bg-forest-50/80 px-3 py-2.5 sm:mx-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-forest-500">
          Why it&rsquo;s a fit
        </p>
        <p className="mt-1 line-clamp-2 text-[10.5px] leading-relaxed text-forest-800">
          {match_reasons.slice(0, 2).join(" · ")}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-ink-soft/60">
            Pickup window
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-forest-900">
            {formatPickupWindow(
              listing.pickup_window_start,
              listing.pickup_window_end,
            )}
          </p>
        </div>
        <Button
          size="sm"
          variant={requested ? "soft" : "dark"}
          icon={requested ? Check : undefined}
          loading={busy}
          disabled={requested || available === 0 || busy}
          onClick={() => onRequest(recommendation)}
          aria-label={
            requested
              ? `Request already active for ${listing.title}`
              : `Request ${available} portions of ${listing.title}`
          }
          className="shrink-0"
        >
          {requested
            ? "Request active"
            : available === 0
              ? "Fully reserved"
              : "Request portions"}
        </Button>
      </div>
    </article>
  );
}

function OrganizationRequestCard({ request, busy, onCancel }) {
  const canCancel = ACTIVE_REQUEST_STATUSES.includes(request.status);

  return (
    <article className="rounded-2xl border border-forest-900/8 bg-cream-50/50 p-3.5">
      <div className="flex gap-3">
        <Avatar name={request.donor_name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-forest-600">
                {request.donor_name}
              </p>
              <h3 className="mt-0.5 truncate text-[13.5px] font-semibold text-forest-950">
                {request.listing_title}
              </h3>
            </div>
            <StatusBadge status={request.status} type="reservation" />
          </div>

          <p className="mt-1 text-[10.5px] text-ink-soft">
            {formatNumber(request.portions_requested)} portions · requested{" "}
            {formatRelativeTime(request.requested_at)}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 pt-2.5">
            <span className="text-[10px] leading-snug text-ink-soft">
              Pickup {formatDay(request.pickup_window_end)},{" "}
              {formatTime(request.pickup_window_start)} –{" "}
              {formatTime(request.pickup_window_end)}
            </span>
            <div className="flex items-center gap-1">
              <Link
                to={`/tracking/${request.id}`}
                className="inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium text-forest-700 transition hover:bg-forest-50"
              >
                View
                <ArrowUpRight aria-hidden="true" size={10} />
              </Link>
              {canCancel ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onCancel(request)}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium text-ink-soft transition hover:bg-coral-50 hover:text-coral-700 disabled:opacity-50"
                >
                  {busy ? (
                    <span className="size-2.5 animate-spin rounded-full border border-ink-soft/30 border-t-ink-soft" />
                  ) : (
                    <X aria-hidden="true" size={10} />
                  )}
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function CollectionHistory({ collections }) {
  return (
    <section
      aria-labelledby="collection-history-heading"
      className="overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-forest-900/8 p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="collection-history-heading"
              className="text-[21px] leading-tight text-forest-950"
            >
              Collection history
            </h2>
            <SampleBadge label="Sample log" />
          </div>
          <p className="mt-1 text-[11.5px] text-ink-soft">
            Completed handovers from the past few weeks.
          </p>
        </div>
        <Badge tone="forest" icon={BadgeCheck}>
          {collections.length} collected
        </Badge>
      </div>

      <CollectionsTable
        collections={collections}
        note="Estimated waste diverted is a backend calculation. Values are illustrative."
      />
    </section>
  );
}

export function OrganizationDashboardPage() {
  const { data, isLoading, error, retry } = useAsyncData(
    getOrganizationWorkspace,
    [],
  );
  const [workspace, setWorkspace] = useState(null);
  const [busyMatchId, setBusyMatchId] = useState(null);
  const [busyRequestId, setBusyRequestId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;
    setWorkspace({
      profile: data.profile,
      recommendations: data.recommendations,
      requests: data.requests,
      collection_history: data.collection_history,
    });
  }, [data]);

  const profile = workspace?.profile;
  const recommendations = workspace?.recommendations ?? [];
  const requests = workspace?.requests ?? [];
  const collections = workspace?.collection_history ?? [];

  const openRequests = requests.filter((request) =>
    ACTIVE_REQUEST_STATUSES.includes(request.status),
  );
  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );
  const requestedListingIds = useMemo(
    () => {
      const set = new Set();
      for (const request of requests) {
        if (ACTIVE_REQUEST_STATUSES.includes(request.status)) {
          set.add(request.listing_id);
        }
      }
      return set;
    },
    [requests],
  );
  const portionsCollected = collections.reduce(
    (total, item) => total + item.portions,
    0,
  );

  const orderedRequests = useMemo(() => {
    const rank = { pending: 0, approved: 1, cancelled: 2 };
    return [...requests].sort(
      (a, b) =>
        (rank[a.status] ?? 3) - (rank[b.status] ?? 3) ||
        new Date(b.requested_at) - new Date(a.requested_at),
    );
  }, [requests]);

  const handleRequest = async (recommendation) => {
    const { listing } = recommendation;
    const available = Math.max(
      0,
      listing.portions - (listing.portions_reserved ?? 0),
    );
    if (available === 0) return;

    setBusyMatchId(recommendation.match_id);

    try {
      const result = await createReservation({
        listing_id: listing.id,
        listing_title: listing.title,
        donor_id: listing.donor_id,
        donor_name: listing.donor_name,
        portions_requested: available,
        pickup_window_start: listing.pickup_window_start,
        pickup_window_end: listing.pickup_window_end,
        message: "Requested from the recommended food board.",
      });

      setWorkspace((current) =>
        current
          ? { ...current, requests: [result, ...current.requests] }
          : current,
      );
      toast({
        title: "Sample reservation requested",
        description: `${available} portions of ${listing.title} are marked as requested on this screen. No donor was contacted.`,
      });
    } catch (requestError) {
      toast({
        title: "Couldn't create the sample request",
        description: requestError.message || "Please try again in a moment.",
        tone: "error",
      });
    } finally {
      setBusyMatchId(null);
    }
  };

  const handleCancelRequest = async (request) => {
    setBusyRequestId(request.id);

    try {
      await updateRequestStatus(request.id, "cancelled");
      setWorkspace((current) =>
        current
          ? {
              ...current,
              requests: current.requests.map((item) =>
                item.id === request.id
                  ? { ...item, status: "cancelled" }
                  : item,
              ),
            }
          : current,
      );
      toast({
        title: "Sample request cancelled",
        description: `${request.listing_title} is no longer marked as reserved on this screen.`,
        tone: "info",
      });
    } catch (actionError) {
      toast({
        title: "That action didn't go through",
        description: actionError.message || "Please try again in a moment.",
        tone: "error",
      });
    } finally {
      setBusyRequestId(null);
    }
  };

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState
          title="We couldn't open the organization workspace"
          description="The sample workspace didn't load. Check your connection and try again."
          onRetry={retry}
        />
      </Container>
    );
  }

  if (isLoading || !workspace || !profile) {
    return <Container className="py-10"><DashboardSkeleton /></Container>;
  }

  return (
    <div className="pb-20 sm:pb-24">
      <WorkspaceHeader
        eyebrow="Organization workspace"
        name={profile.name}
        description="Recommendations from the matching service, the requests you're waiting on, and a record of every collection."
        actions={
          <>
            <Badge
              tone="forest"
              icon={BadgeCheck}
              className="h-10 gap-1.5 px-3.5 text-[11px]"
              title="Verification status is sample data in this prototype"
            >
              Verified partner
            </Badge>
            <Button
              to="/discover"
              variant="secondary"
              trailingIcon={ArrowUpRight}
            >
              Browse food board
            </Button>
          </>
        }
        noticeTitle="You're previewing the organization workspace"
        notice="The match scores, reasons and collection history below are sample backend output. Requests made here update this screen only — no donor or API is contacted."
      />

      <Container className="pt-7">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={Sparkles}
            label="Recommended matches"
            value={formatNumber(recommendations.length)}
            detail="Ranked by the backend"
          />
          <StatCard
            icon={Inbox}
            label="Open requests"
            value={formatNumber(openRequests.length)}
            detail={`${pendingRequests.length} pending · ${
              openRequests.length - pendingRequests.length
            } approved`}
          />
          <StatCard
            icon={HistoryIcon}
            label="Collections logged"
            value={formatNumber(collections.length)}
            detail="In the recent sample log"
          />
          <StatCard
            icon={UtensilsCrossed}
            label="Portions collected"
            value={formatNumber(portionsCollected)}
            detail="Across sample collections"
            sample
          />
        </div>

        <section
          aria-labelledby="recommendations-heading"
          className="mt-10"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-forest-600">
                <span aria-hidden="true" className="h-px w-5 bg-forest-400" />
                Matched to your service
              </p>
              <h2
                id="recommendations-heading"
                className="text-[clamp(1.7rem,3vw,2.3rem)] leading-tight text-forest-950"
              >
                Recommended for{" "}
                <span className="italic text-coral-600">your kitchen.</span>
              </h2>
              <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-ink-soft">
                Match scores and reasons come from the backend matching
                service. This prototype displays sample output — it never
                calculates or re-ranks a score in the browser.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge tone="gold" icon={Sparkles}>
                Backend-ranked
              </Badge>
              <SampleBadge label="Sample scores" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.match_id}
                recommendation={recommendation}
                requested={requestedListingIds.has(recommendation.listing.id)}
                busy={busyMatchId === recommendation.match_id}
                onRequest={handleRequest}
              />
            ))}
          </div>
        </section>

        <div className="mt-8 grid items-start gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <section
            aria-labelledby="organization-requests-heading"
            className="rounded-3xl border border-forest-900/10 bg-white p-4 shadow-card sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="organization-requests-heading"
                    className="text-[21px] leading-tight text-forest-950"
                  >
                    Reservation requests
                  </h2>
                  {openRequests.length > 0 ? (
                    <Badge tone="forest">{openRequests.length} open</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-[11.5px] text-ink-soft">
                  Your sample requests and their current status.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              {orderedRequests.length === 0 ? (
                <EmptyState
                  icon={Inbox}
                  title="No reservations yet"
                  description="Request a recommended listing and it will appear here."
                  className="border-0 bg-cream-50 py-10"
                />
              ) : (
                orderedRequests.map((request) => (
                  <OrganizationRequestCard
                    key={request.id}
                    request={request}
                    busy={busyRequestId === request.id}
                    onCancel={handleCancelRequest}
                  />
                ))
              )}
            </div>

            <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-soft/65">
              Open a request to see its status timeline and pickup details.
            </p>
          </section>

          <CollectionHistory collections={collections} />
        </div>
      </Container>
    </div>
  );
}
