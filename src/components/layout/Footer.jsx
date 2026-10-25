import { Link } from "react-router-dom";
import { ArrowUpRight, Heart } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { SampleBadge } from "@/components/ui/Badge";

const EXPLORE_LINKS = [
  { label: "Discover food", to: "/discover" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Our approach", to: "/#impact" },
];

const WORKSPACE_LINKS = [
  { label: "Donor dashboard", to: "/donor" },
  { label: "Organization dashboard", to: "/organization" },
  { label: "Create a donation", to: "/donor#new-donation" },
];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-forest-950 text-cream-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-32 size-[420px] rounded-full bg-forest-800/40 blur-3xl"
      />
      <Container className="relative z-10 py-14 sm:py-16">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16">
          <div className="max-w-sm">
            <Logo invert />
            <p className="mt-5 font-display text-2xl leading-snug text-cream-50">
              Good food.
              <br />
              <span className="italic text-forest-300">Better endings.</span>
            </p>
            <p className="mt-4 text-[13px] leading-relaxed text-cream-200/65">
              A frontend prototype connecting surplus food from local kitchens
              with the community organizations that can put it to good use.
            </p>
            <div className="mt-5">
              <SampleBadge label="Prototype build" tone="light" />
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-300">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-[13px] text-cream-200/75 transition hover:text-cream-50"
                  >
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={12}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-300">
              Sample workspaces
            </h3>
            <ul className="mt-4 space-y-2.5">
              {WORKSPACE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-[13px] text-cream-200/75 transition hover:text-cream-50"
                  >
                    {link.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={12}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 text-[11.5px] leading-relaxed text-cream-200/55 md:flex-row md:items-start md:justify-between">
          <p className="max-w-2xl">
            <span className="font-semibold text-cream-100">A note on the data:</span>{" "}
            this is a frontend prototype. Listings, organizations, match scores
            and impact figures shown here are sample content, not live data.
            Match scores are supplied by the future backend; nothing is ranked
            in the browser.
          </p>
          <p className="flex shrink-0 items-center gap-1.5">
            Made with
            <Heart aria-hidden="true" size={12} className="fill-coral-400 text-coral-400" />
            for local communities
          </p>
        </div>
      </Container>
    </footer>
  );
}
