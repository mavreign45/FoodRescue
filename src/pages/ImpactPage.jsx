import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { getImpactSummary } from "@/services/impactService";
import { useAsyncData } from "@/hooks/useAsyncData";
import { CATEGORY_LABELS } from "@/constants/food";
import { formatNumber } from "@/utils/format";
import { Container } from "@/components/layout/Container";
import { Badge, SampleBadge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { InlineNotice } from "@/components/ui/InlineNotice";
import { ErrorState } from "@/components/ui/States";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { CollectionsTable } from "@/components/dashboard/CollectionsTable";
import { CategoryIcon } from "@/components/food/CategoryIcon";

const METHODOLOGY_ICONS = [PackageCheck, ShieldCheck, Leaf];

function ImpactSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading impact data">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    </div>
  );
}

function WeeklyChart({ series }) {
  const max = Math.max(...series.map((week) => week.portions));

  return (
    <div>
      <div
        role="img"
        aria-label="Weekly portions redistributed across eight sample weeks"
        className="flex h-56 items-end gap-2 sm:gap-3"
      >
        {series.map((week) => (
          <div
            key={week.label}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="text-[10px] font-semibold text-forest-800 opacity-0 transition group-hover:opacity-100">
              {week.portions}
            </span>
            <div
              title={`${week.label}: ${week.portions} portions across ${week.collections} collections`}
              className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-forest-600 to-forest-400 transition group-hover:from-forest-700 group-hover:to-forest-500"
              style={{ height: `${Math.max(6, (week.portions / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 border-t border-forest-900/8 pt-2 sm:gap-3">
        {series.map((week) => (
          <div key={week.label} className="flex-1 text-center">
            <p className="text-[9.5px] font-semibold uppercase tracking-wide text-ink-soft">
              {week.label}
            </p>
            <p className="mt-0.5 text-[9px] text-ink-soft/60">
              {week.collections} pickups
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImpactPage() {
  const { data, isLoading, error, retry } = useAsyncData(getImpactSummary, []);

  if (error) {
    return (
      <Container className="py-16">
        <ErrorState
          title="The impact data didn't load"
          description="We couldn't fetch the sample impact figures. Check your connection and try again."
          onRetry={retry}
        />
      </Container>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="pb-20">
        <div className="border-b border-forest-900/10 bg-[linear-gradient(180deg,rgba(225,237,227,0.55),rgba(252,250,244,0))]">
          <Container className="pt-8 pb-8">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-4 h-14 w-96 max-w-full" />
            <Skeleton className="mt-4 h-4 w-full max-w-xl" />
          </Container>
        </div>
        <Container className="pt-8">
          <ImpactSkeleton />
        </Container>
      </div>
    );
  }

  const { summary, weekly_series, category_breakdown, recent_collections, top_donors, methodology } = data;
  const maxCategoryPortions = Math.max(
    ...category_breakdown.map((item) => item.portions),
  );

  return (
    <div className="pb-20 sm:pb-24">
      <div className="border-b border-forest-900/10 bg-[linear-gradient(180deg,rgba(225,237,227,0.55),rgba(252,250,244,0))]">
        <Container className="pt-8 pb-8 sm:pt-12 sm:pb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-600">
                <span aria-hidden="true" className="h-px w-6 bg-forest-400" />
                Impact dashboard
              </p>
              <h1 className="text-[clamp(2.6rem,5.6vw,4.3rem)] leading-[0.99] text-forest-950">
                The numbers behind{" "}
                <span className="italic text-coral-600">the neighbourhood.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
                Every verified pickup leaves a record — how much food moved,
                where it went, and what that saved from the waste stream.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <SampleBadge label="Sample figures" />
              <Badge tone="forest" className="bg-white/70">
                {summary.period_label}
              </Badge>
            </div>
          </div>

          <div className="mt-6">
            <InlineNotice tone="sample">
              These are illustrative prototype figures, not live impact
              metrics. The connected dashboard will be served by{" "}
              <code className="rounded bg-coral-100/70 px-1 py-0.5 text-[10.5px] font-medium">
                GET /impact/summary
              </code>
              .
            </InlineNotice>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={PackageCheck}
            label="Completed collections"
            value={formatNumber(summary.completed_collections)}
            detail="Verified handovers"
            sample
          />
          <StatCard
            icon={UtensilsCrossed}
            label="Portions redistributed"
            value={formatNumber(summary.portions_redistributed)}
            detail="Across all food categories"
            sample
          />
          <StatCard
            icon={Leaf}
            label="Waste diverted (est.)"
            value={`${formatNumber(summary.estimated_waste_diverted_kg)} kg`}
            detail="Backend weight estimates"
            sample
          />
          <StatCard
            icon={Users}
            label="Community partners"
            value={formatNumber(summary.partner_organizations)}
            detail={`${summary.active_donors} active donor kitchens`}
            sample
          />
        </div>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <section
            aria-labelledby="weekly-heading"
            className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="weekly-heading"
                    className="text-[21px] leading-tight text-forest-950"
                  >
                    Portions shared per week
                  </h2>
                  <SampleBadge label="Sample trend" />
                </div>
                <p className="mt-1 text-[11.5px] text-ink-soft">
                  Weekly sample trend across the last eight weeks.
                </p>
              </div>
              <span className="grid size-9 place-items-center rounded-xl bg-forest-100 text-forest-700">
                <BarChart3 aria-hidden="true" size={16} strokeWidth={1.8} />
              </span>
            </div>

            <div className="mt-6">
              <WeeklyChart series={weekly_series} />
            </div>
          </section>

          <section
            aria-labelledby="categories-heading"
            className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card sm:p-6"
          >
            <h2
              id="categories-heading"
              className="text-[21px] leading-tight text-forest-950"
            >
              Where it goes
            </h2>
            <p className="mt-1 text-[11.5px] text-ink-soft">
              Portions redistributed by food category.
            </p>

            <ul className="mt-5 space-y-4">
              {category_breakdown.map((item) => (
                <li key={item.category}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-forest-900">
                      <CategoryIcon
                        category={item.category}
                        size={13}
                        className="text-forest-500"
                      />
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </p>
                    <p className="text-[11px] font-semibold text-forest-950">
                      {formatNumber(item.portions)}
                      <span className="ml-1 font-normal text-ink-soft/70">
                        portions
                      </span>
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-100">
                    <div
                      className="h-full rounded-full bg-forest-500"
                      style={{
                        width: `${Math.max(
                          4,
                          Math.round((item.portions / maxCategoryPortions) * 100),
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[9.5px] text-ink-soft/70">
                    {item.collections} collections · {item.kg} kg est. diverted
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <section
            aria-labelledby="recent-heading"
            className="overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-card"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-forest-900/8 p-4 sm:p-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    id="recent-heading"
                    className="text-[21px] leading-tight text-forest-950"
                  >
                    Recent completed collections
                  </h2>
                  <SampleBadge label="Sample log" />
                </div>
                <p className="mt-1 text-[11.5px] text-ink-soft">
                  The latest verified handovers across the network.
                </p>
              </div>
              <Badge tone="forest">
                {recent_collections.length} recent
              </Badge>
            </div>
            <CollectionsTable
              collections={recent_collections}
              note="Estimated waste diverted is a backend calculation. Values are illustrative."
            />
          </section>

          <div className="space-y-5">
            <section
              aria-labelledby="donors-heading"
              className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card"
            >
              <h2
                id="donors-heading"
                className="text-[21px] leading-tight text-forest-950"
              >
                Generous kitchens
              </h2>
              <p className="mt-1 text-[11.5px] text-ink-soft">
                Most-shared sample donors in this preview.
              </p>

              <ul className="mt-4 space-y-3">
                {top_donors.map((donor, index) => (
                  <li
                    key={donor.name}
                    className="flex items-center gap-3"
                  >
                    <span className="w-4 text-[10px] font-semibold text-ink-soft/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Avatar name={donor.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-forest-950">
                        {donor.name}
                      </p>
                      <p className="text-[10px] text-ink-soft">
                        {donor.collections} collections
                      </p>
                    </div>
                    <p className="shrink-0 text-[11.5px] font-semibold text-forest-800">
                      {formatNumber(donor.portions)}
                      <span className="ml-1 font-normal text-ink-soft/70">
                        portions
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="methodology-heading"
              className="rounded-3xl border border-forest-900/10 bg-white p-5 shadow-card"
            >
              <h2
                id="methodology-heading"
                className="text-[21px] leading-tight text-forest-950"
              >
                How impact is measured
              </h2>
              <p className="mt-1 text-[11.5px] text-ink-soft">
                So the numbers stay honest as the network grows.
              </p>

              <ul className="mt-4 space-y-3.5">
                {methodology.map((item, index) => {
                  const Icon = METHODOLOGY_ICONS[index] ?? ShieldCheck;
                  return (
                    <li key={item.title} className="flex gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-forest-50 text-forest-700">
                        <Icon aria-hidden="true" size={14} strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-[12px] font-semibold text-forest-950">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[10.5px] leading-relaxed text-ink-soft">
                          {item.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="flex items-center justify-between gap-3 rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/60 p-4">
              <p className="text-[11px] leading-relaxed text-ink-soft">
                This dashboard is a prototype. Real figures will come from the
                impact API once collections are live.
              </p>
              <Link
                to="/discover"
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-forest-700 transition hover:text-forest-900"
              >
                Food board
                <ArrowUpRight aria-hidden="true" size={12} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
