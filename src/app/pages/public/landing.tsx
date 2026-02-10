import React, { lazy, Suspense } from "react";
import { pageSEO } from "@/app/config/seo.config";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { BookingModal } from "@/app/components/layout/booking-modal";
import { DemoVideoModal } from "@/app/components/layout/demo-video-modal";
import { DemoAccessModal } from "@/app/components/layout/demo-access-modal";
import { LeadPopup } from "@/app/components/layout/lead-popup";
import { HeroV2 } from "@/app/components/sections/hero-v2";
import { LogoMarquee } from "@/app/components/sections/logo-marquee";
import { ProblemSectionV2 } from "@/app/components/sections/problem-v2";
import { DashboardPreviewV2 } from "@/app/components/sections/dashboard-preview-v2";
import { SignalRadar } from "@/app/components/sections/signal-radar";
import { RoleSelectionV2 } from "@/app/components/sections/role-selection-v2";
import { StickyMobileCta } from "@/app/components/layout/sticky-mobile-cta";
import { useSEO } from "@/app/hooks/useSEO";
import { useSchemaOrg } from "@/app/hooks/useSchemaOrg";
import { useLanguage } from "@/app/LanguageContext";

type LazyComponent<TProps = Record<string, unknown>> = React.ComponentType<TProps>;

// Helper to load named exports via React.lazy without repeating boilerplate.
function lazyNamed<TProps>(
  importer: () => Promise<Record<string, LazyComponent<TProps>>>,
  exportName: string
) {
  return lazy(() =>
    importer().then((module) => ({
      default: module[exportName] as LazyComponent<TProps>,
    }))
  );
}

const CaseStudiesSection = lazyNamed(
  () => import("@/app/components/sections/case-studies-v2"),
  "CaseStudiesSectionV2"
);
const FAQ = lazyNamed(
  () => import("@/app/components/sections/faq-v2"),
  "FAQV2"
);
const PurchaseSection = lazyNamed(
  () => import("@/app/components/sections/pricing"),
  "PurchaseSection"
);
const TrustCenter = lazyNamed(
  () => import("@/app/components/sections/trust-center"),
  "TrustCenter"
);
const CtaSection = lazyNamed(
  () => import("@/app/components/sections/cta-section-v2"),
  "CtaSectionV2"
);
const LeadCaptureSection = lazyNamed(
  () => import("@/app/components/sections/lead-capture"),
  "LeadCaptureSection"
);

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
        {/* 1. HERO — Outcome promise + dual CTA */}
        <HeroV2 />
        
        {/* 2. SOCIAL PROOF — Client logos */}
        <LogoMarquee />
        
        {/* 3. PROBLEM — Build pain awareness */}
        <ProblemSectionV2 />

        {/* 4. VISUAL PROOF — See the solution immediately */}
        <DashboardPreviewV2 />

        {/* 5. HOW IT WORKS + WHAT WE MEASURE */}
        <SignalRadar />

        {/* 6. SOCIAL PROOF — Real client results */}
        <LazySection>
          <CaseStudiesSection />
        </LazySection>

        {/* 7. PERSONALIZATION — Role-based value */}
        <RoleSelectionV2 />

        {/* 8. INVESTMENT — Pricing calculator */}
        <LazySection>
          <PurchaseSection />
        </LazySection>

        {/* 9. OBJECTION HANDLING — FAQ */}
        <LazySection>
          <FAQ />
        </LazySection>

        {/* 10. COMPLIANCE — GDPR, data handling */}
        <LazySection>
          <TrustCenter />
        </LazySection>

        {/* 11. FINAL CTA — Clear next step */}
        <LazySection>
          <CtaSection />
        </LazySection>

        {/* 12. SOFT CAPTURE — E-book for undecided */}
        <LazySection>
          <LeadCaptureSection />
        </LazySection>
      </main>
      <Footer />
      <StickyMobileCta />

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
