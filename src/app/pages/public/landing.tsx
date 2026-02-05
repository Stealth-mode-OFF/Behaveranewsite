import React, { lazy, Suspense } from "react";
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
const CaseStudiesSection = lazy(() =>
  import("@/app/components/sections/case-studies").then((module) => ({
    default: module.CaseStudiesSection,
  }))
);
const FAQ = lazy(() =>
  import("@/app/components/sections/faq").then((module) => ({
    default: module.FAQ,
  }))
);
const PurchaseSection = lazy(() =>
  import("@/app/components/sections/pricing").then((module) => ({
    default: module.PurchaseSection,
  }))
);
const TrustCenter = lazy(() =>
  import("@/app/components/sections/trust-center").then((module) => ({
    default: module.TrustCenter,
  }))
);
const CtaSection = lazy(() =>
  import("@/app/components/sections/cta-section").then((module) => ({
    default: module.CtaSection,
  }))
);
const LeadCaptureSection = lazy(() =>
  import("@/app/components/sections/lead-capture").then((module) => ({
    default: module.LeadCaptureSection,
  }))
);
import { useSEO } from "@/app/hooks/useSEO";
import { useSchemaOrg } from "@/app/hooks/useSchemaOrg";
import { useLanguage } from "@/app/LanguageContext";
import { pageSEO } from "@/app/config/seo.config";

export function LandingPage() {
  const { language } = useLanguage();
  const seo = pageSEO.home[language] || pageSEO.home.en;
  
  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(', '),
    ogType: 'website',
    canonicalUrl: 'https://echopulse.cz/',
  });
  
  // Inject Schema.org JSON-LD for AI discoverability
  useSchemaOrg();

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
        <LazySection>
          <CaseStudiesSection />
        </LazySection>
        
        {/* 10. OBJECTION HANDLING — Address concerns */}
        <LazySection>
          <FAQ />
        </LazySection>
        
        {/* 11. INVESTMENT — Pricing with trust signals */}
        <LazySection>
          <PurchaseSection />
        </LazySection>
        
        {/* 12. COMPLIANCE — GDPR, data handling */}
        <LazySection>
          <TrustCenter />
        </LazySection>
        
        {/* 13. FINAL CTA — Clear next step */}
        <LazySection>
          <CtaSection />
        </LazySection>
        
        {/* 14. SOFT CAPTURE — E-book for undecided */}
        <LazySection>
          <LeadCaptureSection />
        </LazySection>
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

function LazySection({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="section-spacing" aria-hidden="true" />}>
      {children}
    </Suspense>
  );
}
