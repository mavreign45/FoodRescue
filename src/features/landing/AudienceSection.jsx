import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sampleAudiences } from "@/data/landing";
import { cn } from "@/utils/cn";

function AudienceCard({ audience, index, tinted }) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[2rem] border border-forest-900/10 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        tinted ? "bg-forest-100/70" : "bg-coral-50/80",
      )}
    >
      <div className="relative h-56 overflow-hidden sm:h-64">
        <img
          src={audience.image}
          alt={audience.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-forest-950/5 to-transparent"
        />
        <div className="absolute left-5 top-5">
          <span className="inline-flex rounded-full border border-white/30 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-forest-900 backdrop-blur">
            {audience.eyebrow}
          </span>
        </div>
        <span className="absolute right-5 top-5 font-display text-[2rem] leading-none text-white/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="absolute bottom-5 left-5 flex items-center gap-2 text-[10.5px] font-medium uppercase tracking-[0.14em] text-cream-100">
          <span className="size-1.5 rounded-full bg-forest-300" />
          Interactive sample workspace
        </p>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 className="max-w-md text-[clamp(1.7rem,3vw,2.3rem)] leading-[1.08] text-forest-950">
          {audience.title}
        </h3>
        <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-ink-soft">
          {audience.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {audience.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-2.5 text-[12.5px] font-medium text-forest-900"
            >
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-white text-forest-700 shadow-sm">
                <Check aria-hidden="true" size={10} strokeWidth={2.7} />
              </span>
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-forest-900/10 pt-6">
          <Button
            to={audience.to}
            variant="dark"
            trailingIcon={ArrowUpRight}
            size="sm"
            className="h-10 px-4"
          >
            {audience.cta}
          </Button>
          <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-ink-soft/50">
            No sign-up needed
          </span>
        </div>
      </div>
    </article>
  );
}

export function AudienceSection() {
  return (
    <section className="bg-cream-50 py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Made for both sides of the handover"
          title={
            <>
              One platform.{" "}
              <span className="italic text-coral-600">Two good stories.</span>
            </>
          }
          description="Whether you have trays to pass on or plates to fill, everything you need for a safe, timely pickup lives in one place."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <AudienceCard
            audience={sampleAudiences.donors}
            index={0}
            tinted={false}
          />
          <AudienceCard
            audience={sampleAudiences.organizations}
            index={1}
            tinted
          />
        </div>
      </Container>
    </section>
  );
}
