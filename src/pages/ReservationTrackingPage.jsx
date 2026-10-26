import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CircleX,
  Clock3,
  ClipboardList,
  Lock,
  MapPin,
  MessageSquareText,
  QrCode,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { getReservation, updateRequestStatus } from "@/services/reservationsService";
import { useAsyncData } from "@/hooks/useAsyncData";
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
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/utils/cn";

const STEP_DEFINITIONS = [
  {
    code: "requested",
    label: "Request sent",
    description: "You asked to collect this food.",
  },
  {
    code: "approved",
    label: "Donor approved",
    description: "The donor confirmed your request.",
  },
  {
    code: "pickup",
    label: "Pickup window",
    description: "Collect within the agreed window.",
  },
  {
    code: "collected",
    label: "Pickup verified",
    description: "The donor confirms the handover.",
  },
];

const STATUS_BANNER = {
  pending: {
    tone: "gold",
    title: "Waiting for the donor",
    description:
      "Your request is with the donor. This page updates as soon as they respond.",
  },
  approved: {
    tone: "forest",
    title: "Approved — collect during the window",
    description:
      "The donor has confirmed. Arrive within the pickup window below and follow the instructions.",
  },
  collected: {
    tone: "dark",
    title: "Collected and verified",
    description:
      "The handover is complete and counted toward your impact record.",
  },
  declined: {
    tone: "coral",
    title: "Request declined",
    description:
      "The donor couldn't fulfil this request. Other nearby listings may fit.",
  },
  cancelled: {
    tone: "neutral",
    title: "Request cancelled",
    description: "This reservation was cancelled before collection.",
  },
};

function TimelineStep({ definition, state, time }) {
  const done = state === "done";
  const current = state === "current";
  const stopped = state === "stopped";

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {definition.code !== "collected" ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-[13px] top-8 h-[calc(100%-28px)] w-px",
            done ? "bg-forest-500" : "bg-forest-900/10",
          )}
        />
      ) : null}

      <span
        className={cn(
          "relative z-10 grid size-7 shrink-0 place-items-center rounded-full border-2",
          done && "border-forest-600 bg-forest-600 text-cream-50",
          current && "border-forest-600 bg-white text-forest-600",
          stopped && "border-coral-300 bg-coral-50 text-coral-600",
          state === "pending" && "border-forest-900/15 bg-white text-ink-soft/40",
        )}
      >
        {done ? (
          <CheckCircle2 aria-hidden="true" size={14} />
        ) : stopped ? (
          <X aria-hidden="true" size={13} />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "size-2 rounded-full",
              current ? "animate-pulse bg-forest-500" : "bg-ink-soft/25",
            )}
          />
        )}
      </span>

      <div className={cn("min-w-0 flex-1", (stopped || state === "pending") && "opacity-55")}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p
            className={cn(
              "text-[13.5px] font-semibold",
              done || current ? "text-forest-950" : "text-ink-soft",
            )}
          >
            {definition.label}
            {current ? (
              <span className="ml-2 rounded-full bg-forest-100 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-forest-700">
                Current
              </span>
            ) : null}
          </p>
          {time ? (
            <span className="text-[10px] text-ink-soft/70">
              {formatDateTime(time)}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft">
          {definition.description}
        </p>
      </div>
    </li>
  );
}

function TrackingSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" aria-busy="true" aria-label="Loading reservation">
      <div className="space-y-4">
        <Skeleton className="h-24 rounded-3xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-3xl" />
        <Skeleton className="h-56 rounded-3xl" />
      </div>
    </div>
  );
}

export function ReservationTrackingPage() {
  const { requestId } = useParams();
  const { toast } = useToast();
  const { data, isLoading, error, retry } = useAsyncData(
    () => getReservation(requestId),
    [requestId],
  );
  const [local, setLocal] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setLocal(null);
  }, [data]);

  const reservation = local ?? data;

  const handleCancel = async () => {
    if (!reservation) return;
    setCancelling(true);

    try {
      const updated = await updateRequestStatus(reservation.id, "cancelled");
      setLocal(updated);
      toast({
        title: "Sample request cancelled",
        description:
          "The reservation is marked cancelled in this preview. No donor was notified.",
        tone: "info",
      });
    } catch (cancelError) {
      toast({
        title: "That action didn't go through",
        description: cancelError.message || "Please try again in a moment.",
        tone: "error",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState
          title="We couldn't find that reservation"
          description="It may not exist in the sample data, or the link is out of date."
          onRetry={retry}
        />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button to="/discover" variant="secondary" size="sm" icon={ArrowLeft}>
            Back to the food board
          </Button>
          <Button to="/organization" variant="secondary" size="sm">
            Open the organization workspace
          </Button>
        </div>
      </Container>
    );
  }

  if (isLoading || !reservation) {
    return (
      <Container className="py-10">
        <TrackingSkeleton />
      </Container>
    );
  }

  const events = Object.fromEntries(
    (reservation.timeline ?? []).map((event) => [event.code, event]),
  );
  const stopped =
    reservation.status === "declined" || reservation.status === "cancelled";
  const banner =
    STATUS_BANNER[reservation.status] ?? STATUS_BANNER.pending;
  const canCancel = ["pending", "approved"].includes(reservation.status);

  const stepState = (code) => {
    switch (code) {
      case "requested":
        return "done";
      case "approved":
        if (events.approved) return "done";
        if (stopped) return "stopped";
        if (reservation.status === "pending") return "current";
        return "pending";
      case "pickup":
        if (events.collected) return "done";
        if (stopped) return "stopped";
        if (events.approved) return "current";
        return "pending";
      case "collected":
        if (events.collected) return "done";
        return stopped ? "stopped" : "pending";
      default:
        return "pending";
    }
  };

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
          <Link to="/organization" className="transition hover:text-forest-900">
            Organization workspace
          </Link>
          <span aria-hidden="true" className="text-ink-soft/40">
            /
          </span>
          <span className="font-medium text-forest-800">
            Reservation {reservation.id}
          </span>
        </nav>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.17em] text-forest-600">
              <span aria-hidden="true" className="h-px w-5 bg-forest-400" />
              Reservation tracking
            </p>
            <h1 className="text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.05] text-forest-950">
              {reservation.listing_title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge
                status={reservation.status}
                type="reservation"
                className="px-3 py-1.5 text-[11.5px]"
              />
              <span className="text-[11px] text-ink-soft">
                {formatNumber(reservation.portions_requested)} portions ·{" "}
                {reservation.donor_name}
              </span>
            </div>
          </div>
          <SampleBadge label="Sample reservation" />
        </div>

        <div
          className={cn(
            "mt-6 rounded-2xl border px-4 py-3.5",
            banner.tone === "gold" && "border-gold-300/70 bg-gold-100/70",
            banner.tone === "forest" && "border-forest-200 bg-forest-50",
            banner.tone === "dark" && "border-forest-800 bg-forest-900 text-cream-50",
            banner.tone === "coral" && "border-coral-200 bg-coral-50",
            banner.tone === "neutral" && "border-forest-900/10 bg-cream-100",
          )}
        >
          <p
            className={cn(
              "text-[13px] font-semibold",
              banner.tone === "dark" ? "text-cream-50" : "text-forest-950",
            )}
          >
            {banner.title}
          </p>
          <p
            className={cn(
              "mt-0.5 text-[11.5px] leading-relaxed",
              banner.tone === "dark" ? "text-cream-200/75" : "text-ink-soft",
            )}
          >
            {banner.description}
          </p>
        </div>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="space-y-5">
            <section
              aria-labelledby="timeline-heading"
              className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2
                    id="timeline-heading"
                    className="text-[21px] leading-tight text-forest-950"
                  >
                    Status timeline
                  </h2>
                  <p className="mt-1 text-[11.5px] text-ink-soft">
                    Where this reservation is, step by step.
                  </p>
                </div>
                <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <Timer aria-hidden="true" size={16} strokeWidth={1.8} />
                </span>
              </div>

              <ol className="mt-6">
                {STEP_DEFINITIONS.map((definition) => (
                  <TimelineStep
                    key={definition.code}
                    definition={definition}
                    state={stepState(definition.code)}
                    time={events[definition.code]?.at}
                  />
                ))}
              </ol>
            </section>

            <section
              aria-labelledby="verification-heading"
              className="overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-card"
            >
              {events.collected ? (
                <div className="flex items-start gap-3.5 p-5 sm:p-6">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <ShieldCheck aria-hidden="true" size={20} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h2
                      id="verification-heading"
                      className="text-[16px] font-semibold text-forest-950"
                    >
                      Pickup verified
                    </h2>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                      Verified by {reservation.donor_name} on{" "}
                      {formatDateTime(reservation.collected_at)}. The{" "}
                      {portionLabel(reservation.portions_requested)} are
                      counted toward your impact record.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1.5 text-[10.5px] font-semibold text-forest-700">
                      <QrCode aria-hidden="true" size={12} />
                      Code {reservation.verification_code}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-dashed border-forest-300 bg-forest-50 text-forest-600">
                      <QrCode aria-hidden="true" size={20} strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2
                        id="verification-heading"
                        className="text-[16px] font-semibold text-forest-950"
                      >
                        Pickup verification
                        <span className="ml-2 align-middle rounded-full bg-cream-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                          Placeholder
                        </span>
                      </h2>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                        When the backend is connected, the donor confirms the
                        handover here — with a code or a scan — and the
                        collection becomes part of the impact record.
                      </p>

                      {events.approved ? (
                        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-forest-900/8 bg-cream-50 px-3.5 py-3">
                          <div>
                            <p className="text-[9.5px] font-semibold uppercase tracking-[0.13em] text-ink-soft/70">
                              Sample verification code
                            </p>
                            <p className="mt-1 font-display text-xl tracking-[0.14em] text-forest-950">
                              {reservation.verification_code}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Button
                              variant="secondary"
                              size="sm"
                              disabled
                              icon={Lock}
                              className="h-9"
                            >
                              Verify pickup
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section
              aria-labelledby="pickup-details-heading"
              className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card"
            >
              <div className="flex items-center gap-3.5">
                {reservation.listing_photo_url ? (
                  <img
                    src={reservation.listing_photo_url}
                    alt=""
                    className="size-16 shrink-0 rounded-2xl object-cover"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-600">
                    {reservation.donor_name}
                  </p>
                  <p className="mt-0.5 truncate text-[14px] font-semibold text-forest-950">
                    {reservation.listing_title}
                  </p>
                </div>
              </div>

              <h2
                id="pickup-details-heading"
                className="mt-5 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-soft/70"
              >
                Pickup details
              </h2>
              <dl className="mt-3 space-y-3 text-[12px]">
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-ink-soft">
                    <Clock3 aria-hidden="true" size={12} />
                    Window
                  </dt>
                  <dd className="text-right font-medium text-forest-950">
                    {formatPickupWindow(
                      reservation.pickup_window_start,
                      reservation.pickup_window_end,
                    )}
                    <DeadlineChip
                      deadline={reservation.pickup_window_end}
                      className="mt-1.5"
                    />
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex shrink-0 items-center gap-1.5 text-ink-soft">
                    <MapPin aria-hidden="true" size={12} />
                    Address
                  </dt>
                  <dd className="text-right font-medium text-forest-950">
                    {reservation.pickup_address}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="flex shrink-0 items-center gap-1.5 text-ink-soft">
                    <CalendarClock aria-hidden="true" size={12} />
                    Requested
                  </dt>
                  <dd className="text-right font-medium text-forest-950">
                    {formatDateTime(reservation.requested_at)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 rounded-xl bg-cream-50 px-3.5 py-3">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                  <ClipboardList aria-hidden="true" size={11} />
                  Donor instructions
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">
                  {reservation.pickup_instructions}
                </p>
              </div>

              {reservation.message ? (
                <div className="mt-3 rounded-xl border border-forest-900/8 bg-white px-3.5 py-3">
                  <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
                    <MessageSquareText aria-hidden="true" size={11} />
                    Your note
                  </p>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-soft">
                    &ldquo;{reservation.message}&rdquo;
                  </p>
                </div>
              ) : null}
            </section>

            {canCancel ? (
              <div className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card">
                <p className="text-[13px] font-semibold text-forest-950">
                  Plans changed?
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">
                  You can withdraw this request until the pickup is verified.
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  icon={CircleX}
                  loading={cancelling}
                  disabled={cancelling}
                  onClick={handleCancel}
                  className="mt-3"
                >
                  {cancelling ? "Cancelling…" : "Cancel request"}
                </Button>
              </div>
            ) : (
              <div className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-gold-100 text-gold-600">
                    <Sparkles aria-hidden="true" size={16} />
                  </span>
                  <p className="text-[12px] leading-relaxed text-ink-soft">
                    This collection is{" "}
                    <span className="font-semibold text-forest-950">
                      {reservation.status === "collected" ? "complete" : "closed"}
                    </span>
                    . Completed pickups appear on the impact dashboard.
                  </p>
                </div>
                <Button
                  to="/impact"
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                >
                  View impact dashboard
                </Button>
              </div>
            )}

            <InlineNotice tone="sample">
              Reservation tracking is simulated. Statuses update in this
              preview only — nothing is sent to the donor.
            </InlineNotice>
          </aside>
        </div>
      </Container>
    </div>
  );
}
