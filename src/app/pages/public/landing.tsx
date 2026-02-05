import React from "react";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { BookingModal } from "@/app/components/layout/booking-modal";
import { DemoVideoModal } from "@/app/components/layout/demo-video-modal";
import { DemoAccessModal } from "@/app/components/layout/demo-access-modal";
import { LeadPopup } from "@/app/components/layout/lead-popup";
import { Hero } from "@/app/components/sections/hero";
import { LogoMarquee } from "@/app/components/sections/logo-marquee";
import { ProblemSection } from "@/app/components/sections/problem";
import { HowItWorks } from "@/app/components/sections/how-it-works";
import { DashboardPreview } from "@/app/components/sections/dashboard-preview";
import { SignalRadar } from "@/app/components/sections/signal-radar";
import { RoleSelection } from "@/app/components/sections/role-selection";
import { ValueByRole } from "@/app/components/sections/value-by-role";
import { MethodologySection } from "@/app/components/sections/methodology";
import { CaseStudiesSection } from "@/app/components/sections/case-studies";
import { FAQ } from "@/app/components/sections/faq";
import { PurchaseSection } from "@/app/components/sections/pricing";
import { TrustCenter } from "@/app/components/sections/trust-center";
import { CtaSection } from "@/app/components/sections/cta-section";
import { LeadCaptureSection } from "@/app/components/sections/lead-capture";
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
        {/* 1. HERO — Outcome promise + primary CTA */}
        <Hero />
        
        {/* 2. SOCIAL PROOF — Client logos */}
        <LogoMarquee />
        
        {/* 3. PROBLEM — Build pain awareness */}
        <ProblemSection />
        
        {/* 4. SOLUTION — Show simplicity */}
        <HowItWorks />
        
        {/* 5. VISUAL PROOF — See it in action */}
        <DashboardPreview />
        
        {/* 6. WHAT WE MEASURE — Scientific backing */}
        <SignalRadar />
        
        {/* 7. PERSONALIZATION — CEO vs HR paths */}
        <RoleSelection />
        <ValueByRole />
        
        {/* 8. AUTHORITY — Research foundation */}
        <MethodologySection />
        
        {/* 9. SOCIAL PROOF — Real results */}
        <CaseStudiesSection />
        
        {/* 10. OBJECTION HANDLING — Address concerns */}
        <FAQ />
        
        {/* 11. INVESTMENT — Pricing with trust signals */}
        <PurchaseSection />
        
        {/* 12. COMPLIANCE — GDPR, data handling */}
        <TrustCenter />
        
        {/* 13. FINAL CTA — Clear next step */}
        <CtaSection />
        
        {/* 14. SOFT CAPTURE — E-book for undecided */}
        <LeadCaptureSection />
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
