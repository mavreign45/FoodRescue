import { ArrowUpRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SampleBadge } from "@/components/ui/Badge";
import {
  sampleImpactDisclaimer,
  sampleImpactStats,
} from "@/data/landing";

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="grain relative overflow-hidden bg-forest-950 py-20 text-cream-50 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 size-[420px] rounded-full border border-white/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 top-16 size-[260px] rounded-full border border-white/[0.04]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-20 size-[460px] rounded-full bg-forest-800/35 blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-300">
              <span aria-hidden="true" className="h-px w-6 bg-forest-400" />
              The impact we&rsquo;re building toward
            </p>
            <h2 className="max-w-xl text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.03] text-cream-50">
              Small rescues.
              <br />
              A{" "}
              <span className="italic text-forest-300">
                noticeably better
              </span>{" "}
              neighbourhood.
            </h2>
          </div>

          <div className="max-w-md lg:pb-1">
            <SampleBadge label="Sample figures, not live data" tone="light" />
            <p className="mt-4 text-[14px] leading-relaxed text-cream-200/65">
              This is how we picture a thriving local food network. The numbers
              below illustrate the prototype&rsquo;s future impact dashboard —
              they are not real FoodRescue results.
            </p>
            <Button
              to="/impact"
              variant="cream"
              size="sm"
              trailingIcon={ArrowUpRight}
              className="mt-5"
            >
              See the impact dashboard
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {sampleImpactStats.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative bg-forest-950 p-5 transition-colors duration-300 hover:bg-forest-900/70 sm:p-7"
            >
              <span className="text-[10px] font-semibold tracking-[0.18em] text-forest-400/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-8 font-display text-[clamp(2rem,4vw,3.1rem)] leading-none tracking-tight text-cream-50">
                {stat.value}
              </p>
              <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-forest-200">
                {stat.label}
              </p>
              <p className="mt-1.5 text-[11.5px] leading-snug text-cream-200/50">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-2 text-[11.5px] text-cream-200/45 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <FlaskConical aria-hidden="true" size={13} />
            {sampleImpactDisclaimer}
          </p>
          <p>Figures will be served by the impact API — never hardcoded in the UI.</p>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md font-display text-[22px] italic leading-snug text-forest-200 sm:text-2xl">
            &ldquo;The measure of a good kitchen is what it passes on.&rdquo;
          </p>
          <p className="max-w-xs text-[12px] leading-relaxed text-cream-200/50">
            Every listing records portions, collection status and an estimated
            waste diversion — so good work can be seen and repeated.
          </p>
        </div>
      </Container>
    </section>
  );
}
