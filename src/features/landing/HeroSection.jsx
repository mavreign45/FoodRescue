import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChefHat,
  ClipboardList,
  Clock3,
  MapPin,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SampleBadge } from "@/components/ui/Badge";
import { DeadlineChip } from "@/components/ui/DeadlineChip";
import { Container } from "@/components/layout/Container";
import { heroBenefits, heroProofPoints } from "@/data/landing";
import { sampleListings } from "@/data/listings";
import { formatTime, portionLabel } from "@/utils/format";

const featured = sampleListings[0];

const PROOF_ICONS = [ChefHat, Clock3, Users];
const BENEFIT_ICONS = [ShieldAlert, MapPin, ClipboardList];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,_rgba(196,219,201,0.55),_transparent_68%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 size-[500px] rounded-full bg-[radial-gradient(circle,_rgba(247,201,184,0.32),_transparent_70%)]"
      />

      <Container className="relative">
        <div className="grid items-center gap-14 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-12 lg:pb-24 lg:pt-20">
          <div className="relative z-10">
            <div className="animate-rise flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest-900/10 bg-white/65 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-forest-700 backdrop-blur-sm">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-forest-400 opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-forest-500" />
                </span>
                Local food rescue, made simple
              </span>
              <SampleBadge label="Prototype · sample data" />
            </div>

            <h1 className="animate-rise mt-7 text-[clamp(3rem,7.3vw,5.5rem)] font-[480] leading-[0.96] tracking-[-0.045em] text-forest-950 [animation-delay:80ms]">
              Good food belongs on plates,{" "}
              <span className="relative inline-block italic text-coral-600">
                not in bins.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 18"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-3 w-full text-coral-300"
                >
                  <path
                    d="M3 12.5C70 4.5 174 3.5 297 8.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="animate-rise mt-7 max-w-lg text-[16px] leading-relaxed text-ink-soft sm:text-[17px] [animation-delay:150ms]">
              FoodRescue helps local bakeries, kitchens and grocers share good
              surplus with nearby community organizations — before it becomes
              waste.
            </p>

            <div className="animate-rise mt-8 flex flex-wrap items-center gap-3 [animation-delay:220ms]">
              <Button
                to="/discover"
                size="lg"
                trailingIcon={ArrowUpRight}
                className="min-w-[180px]"
              >
                Find food nearby
              </Button>
              <Button
                to="/donor"
                size="lg"
                variant="secondary"
                icon={ChefHat}
              >
                Share your surplus
              </Button>
            </div>

            <ul className="animate-rise mt-8 flex flex-col gap-2.5 [animation-delay:280ms]">
              {heroProofPoints.map((point, index) => {
                const Icon = PROOF_ICONS[index] ?? Check;
                return (
                  <li
                    key={point}
                    className="flex items-center gap-2.5 text-[12.5px] text-ink-soft"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-forest-100 text-forest-700">
                      <Icon aria-hidden="true" size={11} strokeWidth={2} />
                    </span>
                    {point}
                  </li>
                );
              })}
            </ul>

            <a
              href="#how-it-works"
              className="animate-rise mt-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-600 transition hover:text-forest-900 [animation-delay:340ms]"
            >
              See how it works
              <span className="grid size-7 place-items-center rounded-full border border-forest-900/15">
                <ArrowDown aria-hidden="true" size={12} />
              </span>
            </a>
          </div>

          <div className="animate-scale-in relative mx-auto w-full max-w-[500px] pb-14 lg:pb-10 [animation-delay:180ms]">
            <div
              aria-hidden="true"
              className="absolute -inset-x-4 bottom-8 top-14 rotate-2 rounded-[999px_999px_2.5rem_2.5rem] border border-forest-400/25"
            />
            <div
              aria-hidden="true"
              className="absolute -right-3 -top-3 size-24 rounded-full bg-gold-300/35 blur-2xl"
            />

            <div className="relative overflow-hidden rounded-[190px_190px_2rem_2rem] border-[6px] border-white/80 shadow-lift">
              <img
                src="/images/hero-bread.jpg"
                alt="Freshly baked sourdough loaves on a bakery counter"
                className="aspect-[4/4.5] h-full w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-forest-950/55 via-transparent to-forest-950/5"
              />

              <div className="absolute left-5 top-5">
                <SampleBadge label="Sample listing" tone="light" />
              </div>

              <div className="absolute bottom-20 left-5 right-5 flex items-end justify-between gap-3 text-cream-50 sm:bottom-5">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-cream-100/80">
                    <MapPin aria-hidden="true" size={12} />
                    Riverside
                  </p>
                  <p className="mt-1 font-display text-[22px] leading-tight">
                    Today&rsquo;s rescue
                  </p>
                </div>
                <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] backdrop-blur-sm">
                  Pickup by {formatTime(featured.pickup_window_end)}
                </span>
              </div>
            </div>

            <div className="absolute -bottom-2 left-1/2 w-[calc(100%-1.5rem)] max-w-[400px] -translate-x-1/2 rounded-2xl border border-white bg-white/95 p-3.5 shadow-float backdrop-blur sm:left-auto sm:right-[-22px] sm:translate-x-0">
              <div className="flex items-center gap-3">
                <img
                  src={featured.photo_url}
                  alt=""
                  className="size-14 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-forest-500" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-600">
                      Available now
                    </p>
                  </div>
                  <p className="mt-1 truncate font-display text-[16px] leading-tight text-forest-950">
                    {featured.title}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-ink-soft">
                    {featured.donor_name} · {featured.distance_km} km
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
                <span className="text-[11.5px] font-medium text-forest-900">
                  {portionLabel(featured.portions)}
                </span>
                <DeadlineChip deadline={featured.pickup_window_end} />
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-y border-forest-900/10 bg-cream-100/55">
        <Container>
          <div className="grid divide-y divide-forest-900/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {heroBenefits.map((benefit, index) => {
              const Icon = BENEFIT_ICONS[index] ?? Check;
              return (
                <div
                  key={benefit}
                  className="flex items-center justify-center gap-3 px-4 py-5 sm:px-6"
                >
                  <Icon
                    aria-hidden="true"
                    size={17}
                    strokeWidth={1.7}
                    className="text-forest-600"
                  />
                  <p className="text-[12px] font-medium text-forest-900">
                    {benefit}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
