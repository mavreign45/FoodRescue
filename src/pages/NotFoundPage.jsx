import { ArrowLeft, Compass, Sprout } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SampleBadge } from "@/components/ui/Badge";

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-forest-100 text-forest-700">
        <Sprout aria-hidden="true" size={28} strokeWidth={1.6} />
      </span>
      <p className="mt-6 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-forest-500">
        Page not found
      </p>
      <h1 className="mt-3 max-w-xl text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] text-forest-950">
        This plate is{" "}
        <span className="italic text-coral-600">still empty.</span>
      </h1>
      <p className="mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft">
        The page you were looking for isn&rsquo;t here. Head back to the food
        board or return to the beginning.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/discover" icon={Compass}>
          Explore food
        </Button>
        <Button to="/" variant="secondary" icon={ArrowLeft}>
          Back home
        </Button>
      </div>
      <div className="mt-10">
        <SampleBadge label="Prototype navigation" />
      </div>
    </Container>
  );
}
