import {
  ArrowUpRight,
  ClipboardList,
  Handshake,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryIcon } from "@/components/food/CategoryIcon";
import { FOOD_CATEGORIES } from "@/constants/food";
import { howItWorksSteps } from "@/data/landing";
import { cn } from "@/utils/cn";

const STEP_ICONS = {
  list: ClipboardList,
  match: Sparkles,
  collect: Handshake,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From surplus to supper,{" "}
              <span className="italic text-forest-600">in three steps.</span>
            </>
          }
          description="A simple handover, with the details that matter built in. No calls around town and no guessing what needs collecting."
          action={
            <Button
              to="/discover"
              variant="secondary"
              trailingIcon={ArrowUpRight}
            >
              Browse sample listings
            </Button>
          }
        />

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {howItWorksSteps.map((step) => {
            const Icon = STEP_ICONS[step.id] ?? ClipboardList;
            const featured = step.id === "match";

            return (
              <article
                key={step.id}
                className={cn(
                  "relative flex min-h-[300px] flex-col overflow-hidden rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 sm:p-7",
                  featured
                    ? "border-forest-800 bg-forest-900 text-cream-50 shadow-lift"
                    : "border-forest-900/10 bg-white text-forest-950 shadow-card hover:shadow-lift",
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -right-12 -top-12 size-40 rounded-full",
                    featured ? "bg-forest-800/70" : "bg-cream-100/80",
                  )}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-xl",
                      featured
                        ? "bg-gold-400/15 text-gold-300"
                        : "bg-forest-100 text-forest-700",
                    )}
                  >
                    <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
                  </span>
                  <span
                    className={cn(
                      "font-display text-[2.6rem] leading-none tracking-tight",
                      featured ? "text-cream-50/15" : "text-forest-900/10",
                    )}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className={cn(
                    "relative mt-8 text-[26px] leading-tight",
                    featured ? "text-cream-50" : "text-forest-950",
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "relative mt-3 text-[13.5px] leading-relaxed",
                    featured ? "text-cream-200/75" : "text-ink-soft",
                  )}
                >
                  {step.description}
                </p>

                <div className="relative mt-auto pt-7">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold",
                      featured
                        ? "border-white/15 bg-white/[0.07] text-cream-100"
                        : "border-forest-900/10 bg-cream-50 text-forest-700",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full",
                        featured ? "bg-gold-400" : "bg-forest-500",
                      )}
                    />
                    {step.highlight}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-forest-900/10 pt-8 sm:flex-row sm:justify-center sm:gap-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
            What gets rescued
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FOOD_CATEGORIES.map((category) => (
              <span
                key={category.value}
                className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-white/60 px-3 py-1.5 text-[11.5px] font-medium text-forest-800"
              >
                <CategoryIcon
                  category={category.value}
                  size={12}
                  className="text-forest-500"
                />
                {category.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
