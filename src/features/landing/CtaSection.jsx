import { ArrowUpRight, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SampleBadge } from "@/components/ui/Badge";

export function CtaSection() {
  return (
    <section className="pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grain relative overflow-hidden rounded-[2.5rem] bg-forest-950 px-6 py-16 shadow-lift sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <img
            src="/images/market.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/93 to-forest-950/55"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-16 size-80 rounded-full border border-white/10"
          />

          <div className="relative z-10 max-w-2xl">
            <SampleBadge label="Prototype preview" tone="light" />
            <h2 className="mt-5 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] text-cream-50">
              There&rsquo;s a better place
              <br />
              for <span className="italic text-forest-300">good food.</span>
            </h2>
            <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-cream-200/70">
              Explore the sample listings, step into a donor or organization
              workspace, and see how a local handover comes together.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                to="/discover"
                size="lg"
                trailingIcon={ArrowUpRight}
              >
                Find food nearby
              </Button>
              <Button
                to="/donor"
                size="lg"
                variant="secondary"
                icon={ChefHat}
              >
                Share surplus food
              </Button>
            </div>

            <p className="mt-8 text-[11px] uppercase tracking-[0.14em] text-cream-200/40">
              Sample data only · no sign-up required for this preview
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
