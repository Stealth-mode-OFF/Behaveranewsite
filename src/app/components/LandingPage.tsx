import React from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { LogoMarquee } from "./LogoMarquee";
import { RoleSelection } from "./RoleSelection";
import { AboutSection } from "./AboutSection";
import { ProblemSection } from "./ProblemSection";
import { LeadCaptureSection } from "./LeadCaptureSection";
import { MethodologySection } from "./MethodologySection";
import { SignalRadar } from "./SignalRadar";
import { CzechRealitySection } from "./CzechRealitySection";
import { DecisionLock } from "./DecisionLock";
import { HowItWorks } from "./HowItWorks";
import { DashboardPreview } from "./DashboardPreview";
import { ValueByRole } from "./ValueByRole";
import { CaseStudiesSection } from "./CaseStudiesSection";
import { SolutionsSection } from "./SolutionsSection";
import { AIReadinessBanner } from "./AIReadinessBanner";
import { PurchaseSection } from "./PurchaseSection";
import { BlogSection } from "./BlogSection";
import { ContentLibrary } from "./ContentLibrary";
import { TrustCenter } from "./TrustCenter";
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
        <RoleSelection />
        <LogoMarquee />
        <AboutSection />
        <ProblemSection />
        <LeadCaptureSection />
        <MethodologySection />
        <SignalRadar />
        <DecisionLock />
        <CzechRealitySection />
        <HowItWorks />
        <DashboardPreview />
        <ValueByRole />
        <CaseStudiesSection />
        <SolutionsSection />
        <AIReadinessBanner />
        <PurchaseSection />
        <BlogSection />
        <ContentLibrary />
        <TrustCenter />
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
