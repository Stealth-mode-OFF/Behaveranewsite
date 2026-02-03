import React from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LogoMarquee } from "./LogoMarquee";
import { RoleSelection } from "./RoleSelection";
import { ProblemSection } from "./ProblemSection";
import { MethodologySection } from "./MethodologySection";
import { SignalRadar } from "./SignalRadar";
import { CzechRealitySection } from "./CzechRealitySection";
import { DecisionLock } from "./DecisionLock";
import { HowItWorks } from "./HowItWorks";
import { DashboardPreview } from "./DashboardPreview";
import { YearlyImpactSection } from "./YearlyImpactSection";
import { ValueByRole } from "./ValueByRole";
import { BlogSection } from "./BlogSection";
import { DataSafetySection } from "./DataSafetySection";
import { CtaSection } from "./CtaSection";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";
import { DemoVideoModal } from "./DemoVideoModal";
import { LeadPopup } from "./LeadPopup";

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <RoleSelection />
        <ProblemSection />
        <MethodologySection />
        <SignalRadar />
        <DecisionLock />
        <CzechRealitySection />
        <HowItWorks />
        <DashboardPreview />
        <YearlyImpactSection />
        <ValueByRole />
        <BlogSection />
        <DataSafetySection />
        <CtaSection />
        <FAQ />
      </main>
      <Footer />

      <BookingModal />
      <DemoVideoModal />
      <LeadPopup />
    </>
  );
}
