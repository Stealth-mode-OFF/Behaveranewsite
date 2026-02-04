import React from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LogoMarquee } from "./LogoMarquee";
import { RoleSelection } from "./RoleSelection";
import { ProblemSection } from "./ProblemSection";
import { LeadCaptureSection } from "./LeadCaptureSection";
import { MethodologySection } from "./MethodologySection";
import { SignalRadar } from "./SignalRadar";
import { HowItWorks } from "./HowItWorks";
import { DashboardPreview } from "./DashboardPreview";
import { ValueByRole } from "./ValueByRole";
import { CaseStudiesSection } from "./CaseStudiesSection";
import { PurchaseSection } from "./PurchaseSection";
import { TrustCenter } from "./TrustCenter";
import { CtaSection } from "./CtaSection";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";
import { DemoVideoModal } from "./DemoVideoModal";
import { DemoAccessModal } from "./DemoAccessModal";
import { LeadPopup } from "./LeadPopup";
import { useSEO } from "@/app/hooks/useSEO";

export function LandingPage() {
  useSEO({
    title: 'Echo Pulse — Continuous Employee Insight System',
    description: 'Zachyťte signály disengagementu, burnoutu a odchodů dřív, než se projeví ve výsledcích. Vědecky validovaný systém pro prediktivní HR analytics.',
    keywords: 'employee engagement, HR analytics, burnout prevention, turnover prediction, people analytics, continuous feedback, Echo Pulse, Behavera',
    ogType: 'website',
  });

  return (
    <>
      <Header />
      <main>
        <Hero />
        <LogoMarquee />
        <RoleSelection />
        <ProblemSection />
        <LeadCaptureSection />
        <MethodologySection />
        <SignalRadar />
        <HowItWorks />
        <DashboardPreview />
        <ValueByRole />
        <CaseStudiesSection />
        <PurchaseSection />
        <TrustCenter />
        <CtaSection />
        <FAQ />
      </main>
      <Footer />

      {/* Modals */}
      <BookingModal />
      <DemoVideoModal />
      <DemoAccessModal />
      <LeadPopup />
    </>
  );
}
