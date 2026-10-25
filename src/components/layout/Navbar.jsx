import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { Container } from "./Container";

const NAV_LINKS = [
  { label: "Discover food", to: "/discover", end: false },
  { label: "How it works", to: "/#how-it-works", end: true },
  { label: "For donors", to: "/donor", end: true },
  { label: "For organizations", to: "/organization", end: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-cream-50/90 backdrop-blur-md transition-shadow duration-300",
        scrolled
          ? "border-forest-900/10 shadow-[0_8px_30px_-24px_rgba(14,31,22,0.5)]"
          : "border-transparent",
      )}
    >
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Logo onClick={() => setOpen(false)} />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                  isActive && !link.to.includes("#")
                    ? "bg-forest-100/90 text-forest-950"
                    : "text-ink-soft hover:bg-forest-900/[0.04] hover:text-forest-950",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button
            to="/discover"
            variant="primary"
            size="sm"
            trailingIcon={ArrowUpRight}
            className="h-10 px-4"
          >
            Find food nearby
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-full border border-forest-900/10 bg-white/60 text-forest-900 transition hover:bg-white lg:hidden"
        >
          {open ? (
            <X aria-hidden="true" size={19} />
          ) : (
            <Menu aria-hidden="true" size={19} />
          )}
        </button>
      </Container>

      <div
        id="mobile-navigation"
        className={cn(
          "overflow-hidden border-t border-forest-900/10 bg-cream-50 transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[420px] opacity-100" : "max-h-0 border-transparent opacity-0",
        )}
      >
        <Container className="py-4">
          <nav aria-label="Mobile primary" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl px-3 py-3 text-sm font-medium text-forest-900 transition hover:bg-forest-100/70"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-forest-900/10 pt-4">
            <Button
              to="/discover"
              variant="primary"
              className="w-full"
              trailingIcon={ArrowUpRight}
            >
              Find food nearby
            </Button>
            <p className="mt-3 text-center text-[11px] text-ink-soft">
              Prototype preview · sample data
            </p>
          </div>
        </Container>
      </div>
    </header>
  );
}
