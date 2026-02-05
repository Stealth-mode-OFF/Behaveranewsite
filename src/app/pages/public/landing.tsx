import React, { lazy, Suspense } from "react";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { BookingModal } from "@/app/components/layout/booking-modal";
import { DemoVideoModal } from "@/app/components/layout/demo-video-modal";
import { DemoAccessModal } from "@/app/components/layout/demo-access-modal";
import { LeadPopup } from "@/app/components/layout/lead-popup";
import { HeroV2 } from "@/app/components/sections/hero-v2";
import { LogoMarquee } from "@/app/components/sections/logo-marquee";
import { ProblemSectionV2 } from "@/app/components/sections/problem-v2";
import { HowItWorksV2 } from "@/app/components/sections/how-it-works-v2";
import { DashboardPreviewV2 } from "@/app/components/sections/dashboard-preview-v2";
import { SignalRadar } from "@/app/components/sections/signal-radar";
import { RoleSelectionV2 } from "@/app/components/sections/role-selection-v2";
import { ValueByRole } from "@/app/components/sections/value-by-role";
import { MethodologySection } from "@/app/components/sections/methodology";
const CaseStudiesSection = lazy(() =>
  import("@/app/components/sections/case-studies-v2").then((module) => ({
    default: module.CaseStudiesSectionV2,
  }))
);
const FAQ = lazy(() =>
  import("@/app/components/sections/faq-v2").then((module) => ({
    default: module.FAQV2,
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
  import("@/app/components/sections/cta-section-v2").then((module) => ({
    default: module.CtaSectionV2,
  }))
);
const LeadCaptureSection = lazy(() =>
  import("@/app/components/sections/lead-capture").then((module) => ({
    default: module.LeadCaptureSection,
  }))
);
const CoreTeamSection = lazy(() =>
  import("@/app/components/sections/core-team").then((module) => ({
    default: module.CoreTeamSection,
  }))
);
const BuiltWithSection = lazy(() =>
  import("@/app/components/sections/built-with").then((module) => ({
    default: module.BuiltWithSection,
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
        <HeroV2 />
        
        {/* 2. SOCIAL PROOF — Client logos */}
        <LogoMarquee />
        
        {/* 3. PROBLEM — Build pain awareness */}
        <ProblemSectionV2 />
        
        {/* 4. SOLUTION — Show simplicity */}
        <HowItWorksV2 />
        
        {/* 5. VISUAL PROOF — See it in action */}
        <DashboardPreviewV2 />
        
        {/* 6. WHAT WE MEASURE — Scientific backing */}
        <SignalRadar />
        
        {/* 7. PERSONALIZATION — CEO vs HR paths */}
        <RoleSelectionV2 />
        <ValueByRole />
        
        {/* 8. AUTHORITY — Research foundation */}
        <MethodologySection />
        
        {/* 9. TEAM — Build trust with real people */}
        <LazySection>
          <CoreTeamSection />
        </LazySection>
        
        {/* 10. SOCIAL PROOF — Real results */}
        <LazySection>
          <CaseStudiesSection />
        </LazySection>
        
        {/* 11. OBJECTION HANDLING — Address concerns */}
        <LazySection>
          <FAQ />
        </LazySection>
        
        {/* 12. INVESTMENT — Pricing with trust signals */}
        <LazySection>
          <PurchaseSection />
        </LazySection>
        
        {/* 13. COMPLIANCE — GDPR, data handling */}
        <LazySection>
          <TrustCenter />
        </LazySection>
        
        {/* 14. FINAL CTA — Clear next step */}
        <LazySection>
          <CtaSection />
        </LazySection>
        
        {/* 15. SOFT CAPTURE — E-book for undecided */}
        <LazySection>
          <LeadCaptureSection />
        </LazySection>
        
        {/* 16. BUILT WITH — Tech stack transparency */}
        <LazySection>
          <BuiltWithSection />
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
