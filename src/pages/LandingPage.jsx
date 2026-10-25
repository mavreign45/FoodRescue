import { HeroSection } from "@/features/landing/HeroSection";
import { HowItWorks } from "@/features/landing/HowItWorks";
import { ImpactSection } from "@/features/landing/ImpactSection";
import { AudienceSection } from "@/features/landing/AudienceSection";
import { CtaSection } from "@/features/landing/CtaSection";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <ImpactSection />
      <AudienceSection />
      <CtaSection />
    </>
  );
}
