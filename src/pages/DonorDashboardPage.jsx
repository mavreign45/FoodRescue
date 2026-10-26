import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Inbox,
  PackageOpen,
  Plus,
  ShoppingBasket,
  Sparkles,
  X,
} from "lucide-react";
import { getDonorWorkspace } from "@/services/donorService";
import { updateRequestStatus } from "@/services/reservationsService";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  CATEGORY_LABELS,
} from "@/constants/food";
import {
  formatDate,
  formatDay,
  formatNumber,
  formatTime,
  portionLabel,
} from "@/utils/format";
import { Container } from "@/components/layout/Container";
import { WorkspaceHeader } from "@/components/dashboard/WorkspaceHeader";
import { DonationForm } from "@/components/dashboard/DonationForm";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { DeadlineChip } from "@/components/ui/DeadlineChip";
import { Avatar } from "@/components/ui/Avatar";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { CategoryIcon } from "@/components/food/CategoryIcon";

function DonorListingRow({ listing }) {
  const active = listing.status === "available" || listing.status === "reserved";
  const reserved = listing.portions_reserved ?? 0;

  return (
    <article className="flex gap-3 rounded-2xl border border-forest-900/8 p-3 transition hover:border-forest-900/15 hover:bg-cream-50/60">
      <div className="relative size-[68px] shrink-0 overflow-hidden rounded-xl bg-cream-100">
        <img
          src={listing.photo_url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-1 left-1 grid size-5 place-items-center rounded-md bg-white/90 text-forest-700 backdrop-blur">
          <CategoryIcon category={listing.category} size={11} />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5">
          <h3 className="min-w-0 truncate text-[14.5px] font-semibold text-forest-950">
            {listing.title}
          </h3>
          <StatusBadge status={listing.status} />
        </div>

        <p className="mt-1 text-[11px] text-ink-soft">
          {CATEGORY_LABELS[listing.category] ?? listing.category} ·{" "}
          {portionLabel(listing.portions)}
          {reserved > 0 ? ` · ${reserved} reserved` : ""}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          {active ? (
            <>
              <span className="inline-flex items-center gap-1 text-[10.5px] text-ink-soft">
                <Clock3 aria-hidden="true" size={11} />
                Pickup by {formatDay(listing.pickup_window_end)},{" "}
                {formatTime(listing.pickup_window_end)}
              </span>
              <DeadlineChip deadline={listing.pickup_window_end} />
            </>
          ) : listing.status === "collected" ? (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-forest-600">
              <Check aria-hidden="true" size={11} />
              Collected {formatDate(listing.collected_at)}
            </span>
          ) : (
            <span className="text-[10.5px] text-ink-soft/70">
              Window closed {formatDate(listing.pickup_window_end)}
            </span>
          )}
        </div>

        {active && reserved > 0 ? (
          <div className="mt-2">
            <div className="h-1 overflow-hidden rounded-full bg-cream-200">
              <div
                className="h-full rounded-full bg-forest-500"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((reserved / listing.portions) * 100),
                  )}%`,
                }}
              />
            </div>
            <p className="mt-1 text-[9.5px] text-ink-soft/70">
              {reserved} of {listing.portions} portions allocated
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function RequestCard({ request, onRespond, busy }) {
  const pending = request.status === "pending";

  return (
    <article className="rounded-2xl border border-forest-900/10 bg-white p-4 shadow-[0_1px_2px_rgba(24,36,29,0.03)]">
      <div className="flex gap-3">
        <Avatar name={request.organization_name} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[13px] font-semibold text-forest-950">
                {request.organization_name}
              </p>
              <p className="mt-0.5 text-[10.5px] text-ink-soft">
                {request.contact_name} · {formatNumber(request.portions_requested)}{" "}
                portions requested
              </p>
            </div>
            <StatusBadge status={request.status} type="reservation" />
          </div>

          <div className="mt-2.5 rounded-xl bg-cream-50 px-3 py-2.5">
            <p className="text-[11.5px] font-medium text-forest-900">
              {request.listing_title}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-soft">
              &ldquo;{request.message}&rdquo;
            </p>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] text-ink-soft">
              <Clock3 aria-hidden="true" size={10.5} />
              Pickup {formatDay(request.pickup_window_end)} ·{" "}
              {formatTime(request.pickup_window_end)}
            </span>

            {pending ? (
              <div className="ml-auto flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRespond(request, "declined")}
                  className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium text-ink-soft transition hover:bg-coral-50 hover:text-coral-700 disabled:opacity-50"
                  aria-label={`Decline request from ${request.organization_name}`}
                >
                  <X aria-hidden="true" size={12} />
                  Decline
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onRespond(request, "approved")}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-forest-900 px-3 text-[11px] font-medium text-cream-50 transition hover:bg-forest-800 disabled:opacity-50"
                  aria-label={`Approve request from ${request.organization_name}`}
                >
                  {busy ? (
                    <span className="size-3 animate-spin rounded-full border-[1.5px] border-cream-50/30 border-t-cream-50" />
                  ) : (
                    <Check aria-hidden="true" size={12} />
                  )}
                  Approve
                </button>
              </div>
            ) : request.status === "approved" ? (
              <Link
                to={`/tracking/${request.id}`}
                className="ml-auto inline-flex items-center gap-1 rounded-full bg-forest-50 px-2.5 py-1.5 text-[9.5px] font-medium text-forest-700 transition hover:bg-forest-100"
              >
                Track pickup
                <ArrowUpRight aria-hidden="true" size={10} />
              </Link>
            ) : (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-1 text-[9.5px] font-medium text-ink-soft">
                Resolved
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function DonorDashboardPage() {
  const { data, isLoading, error, retry } = useAsyncData(getDonorWorkspace, []);
  const [workspace, setWorkspace] = useState(null);
  const [busyRequestId, setBusyRequestId] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!data) return;
    setWorkspace({
      profile: data.profile,
      listings: data.listings,
      requests: data.requests,
      summary: data.summary,
    });
  }, [data]);

  const listings = workspace?.listings ?? [];
  const requests = workspace?.requests ?? [];
  const profile = workspace?.profile;
  const summary = workspace?.summary;

  const activeListings = listings.filter(
    (listing) => listing.status === "available" || listing.status === "reserved",
  );
  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );
  const portionsReady = activeListings.reduce(
    (total, listing) =>
      total + Math.max(0, listing.portions - (listing.portions_reserved ?? 0)),
    0,
  );

  const orderedRequests = useMemo(
    () =>
      [...requests].sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (b.status === "pending" && a.status !== "pending") return 1;
        return new Date(b.requested_at) - new Date(a.requested_at);
      }),
    [requests],
  );

  const handleCreated = (listing) => {
    setWorkspace((current) =>
      current
        ? { ...current, listings: [listing, ...current.listings] }
        : current,
    );
    toast({
      title: "Sample donation published",
      description:
        "The listing has been added to this preview only. Nothing was sent to the API.",
    });
  };

  const handleRespond = async (request, status) => {
    setBusyRequestId(request.id);

    try {
      await updateRequestStatus(request.id, status);

      setWorkspace((current) => {
        if (!current) return current;

        const nextRequests = current.requests.map((item) =>
          item.id === request.id
            ? { ...item, status, decided_at: new Date().toISOString() }
            : item,
        );

        const nextListings =
          status === "approved"
            ? current.listings.map((listing) => {
                if (listing.id !== request.listing_id) return listing;
                const allocated = Math.min(
                  listing.portions,
                  (listing.portions_reserved ?? 0) +
                    request.portions_requested,
                );
                return {
                  ...listing,
                  portions_reserved: allocated,
                  status:
                    allocated >= listing.portions
                      ? "reserved"
                      : listing.status,
                };
              })
            : current.listings;

        return {
          ...current,
          requests: nextRequests,
          listings: nextListings,
        };
      });

      toast({
        title:
          status === "approved"
            ? "Sample request approved"
            : "Sample request declined",
        description:
          status === "approved"
            ? `${request.organization_name} is marked for collection. No real organization was notified.`
            : `The request from ${request.organization_name} was declined in this preview.`,
        tone: status === "approved" ? "success" : "info",
      });
    } catch (actionError) {
      toast({
        title: "That action didn't go through",
        description:
          actionError.message || "Please try again in a moment.",
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
          title="We couldn't open the donor workspace"
          description="The sample workspace didn't load. Check your connection and try again."
          onRetry={retry}
        />
      </Container>
    );
  }

  if (isLoading || !workspace || !profile) {
    return (
      <Container className="py-10">
        <DashboardSkeleton />
      </Container>
    );
  }

  return (
    <div className="pb-20 sm:pb-24">
      <WorkspaceHeader
        eyebrow="Donor workspace"
        name={profile.name}
        description="A quick look at what's ready to leave your kitchen, who wants it, and how much has already reached the community."
        actions={
          <>
            <Button
              href="#new-donation"
              variant="primary"
              icon={Plus}
            >
              New donation
            </Button>
            <Button
              to="/discover"
              variant="secondary"
              trailingIcon={ArrowUpRight}
            >
              Food board
            </Button>
          </>
        }
        noticeTitle="You're previewing the donor workspace"
        notice="Everything here is sample data. Publishing a donation or responding to a request updates this screen only — no donors, organizations or APIs are contacted."
      />

      <Container className="pt-7">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={PackageOpen}
            label="Active listings"
            value={formatNumber(activeListings.length)}
            detail="Visible to nearby organizations"
          />
          <StatCard
            icon={ShoppingBasket}
            label="Portions ready"
            value={formatNumber(portionsReady)}
            detail="Still available to request"
          />
          <StatCard
            icon={Inbox}
            label="Requests to review"
            value={formatNumber(pendingRequests.length)}
            detail="Waiting on your response"
          />
          <StatCard
            icon={Sparkles}
            label="Portions collected"
            value={formatNumber(summary?.collected_portions_this_month ?? 0)}
            detail={`${summary?.period_label ?? "This month"} · illustrative`}
            sample
          />
        </div>

        <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div id="new-donation" className="scroll-mt-28">
            <DonationForm profile={profile} onCreated={handleCreated} />
          </div>

          <div className="space-y-5">
            <section
              aria-labelledby="donor-listings-heading"
              className="rounded-3xl border border-forest-900/10 bg-white p-4 shadow-card sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="donor-listings-heading"
                      className="text-[21px] leading-tight text-forest-950"
                    >
                      Your listings
                    </h2>
                    <Badge tone="forest">{activeListings.length} active</Badge>
                  </div>
                  <p className="mt-1 text-[11.5px] text-ink-soft">
                    Open, reserved and recently completed donations.
                  </p>
                </div>
                <span className="rounded-full bg-cream-100 px-2.5 py-1 text-[10px] font-medium text-ink-soft">
                  {listings.length} total
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {listings.length === 0 ? (
                  <EmptyState
                    icon={PackageOpen}
                    title="No listings yet"
                    description="Share your first surplus donation to see it appear here."
                    className="border-0 bg-cream-50 py-10"
                    action={
                      <Button href="#new-donation" size="sm" icon={Plus}>
                        Create a donation
                      </Button>
                    }
                  />
                ) : (
                  listings.map((listing) => (
                    <DonorListingRow key={listing.id} listing={listing} />
                  ))
                )}
              </div>
            </section>

            <section
              aria-labelledby="donor-requests-heading"
              className="rounded-3xl border border-forest-900/10 bg-white p-4 shadow-card sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="donor-requests-heading"
                      className="text-[21px] leading-tight text-forest-950"
                    >
                      Incoming requests
                    </h2>
                    {pendingRequests.length > 0 ? (
                      <Badge tone="gold">
                        {pendingRequests.length} waiting
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11.5px] text-ink-soft">
                    Organizations hoping to collect from your kitchen.
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {orderedRequests.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No requests just yet"
                    description="When an organization requests one of your listings, it will appear here for review."
                    className="border-0 bg-cream-50 py-10"
                  />
                ) : (
                  orderedRequests.map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      busy={busyRequestId === request.id}
                      onRespond={handleRespond}
                    />
                  ))
                )}
              </div>

              <p className="mt-3 text-center text-[10px] leading-relaxed text-ink-soft/65">
                Approvals and declines in this prototype never leave the page.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
