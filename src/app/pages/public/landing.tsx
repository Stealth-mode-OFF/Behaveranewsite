import { lazy, Suspense, type ComponentType, type ReactNode } from "react";
import { pageSEO } from "@/app/seo.config";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { BookingModal } from "@/app/components/layout/booking-modal";
import { LeadPopup } from "@/app/components/layout/lead-popup";
import { Hero } from "@/app/components/sections/hero";
import { LogoMarquee } from "@/app/components/sections/logo-marquee";
import { ProblemSection } from "@/app/components/sections/problem";
import { DashboardPreview } from "@/app/components/sections/dashboard-preview";
import { SignalRadar } from "@/app/components/sections/signal-radar";
import { RoleSelection } from "@/app/components/sections/role-selection";
import { StickyMobileCta } from "@/app/components/layout/sticky-mobile-cta";
import { useSEO } from "@/app/hooks/useSEO";
import { useSchemaOrg } from "@/app/hooks/useSchemaOrg";
import { useLanguage } from "@/app/LanguageContext";
import { SITE_ORIGIN } from "@/lib/urls";

type LazyComponent<TProps = Record<string, unknown>> = ComponentType<TProps>;

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
  () => import("@/app/components/sections/case-studies"),
  "CaseStudiesSection"
);
const FAQ = lazyNamed(
  () => import("@/app/components/sections/faq"),
  "FAQ"
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
  () => import("@/app/components/sections/cta-section"),
  "CtaSection"
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
	    canonicalUrl: `${SITE_ORIGIN}/`,
	  });
  
  // Inject Schema.org JSON-LD for AI discoverability
  useSchemaOrg();

  return (
    <>
      <Header />
      <main>
        {/* 1. HERO — Outcome promise + dual CTA */}
        <Hero />
        
        {/* 2. SOCIAL PROOF — Client logos */}
        <LogoMarquee />
        
        {/* 3. PROBLEM — Build pain awareness */}
        <ProblemSection />

        {/* 4. VISUAL PROOF — See the solution immediately */}
        <DashboardPreview />

        {/* 5. HOW IT WORKS + WHAT WE MEASURE */}
        <SignalRadar />

        {/* 6. SOCIAL PROOF — Real client results */}
        <LazySection>
          <CaseStudiesSection />
        </LazySection>

        {/* 7. PERSONALIZATION — Role-based value */}
        <RoleSelection />

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
      <LeadPopup />
    </>
  );
}

function LazySection({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="section-spacing" aria-hidden="true" />}>
      {children}
    </Suspense>
  );
}
