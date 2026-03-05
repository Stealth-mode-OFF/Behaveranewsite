import { lazy, Suspense, useState, useCallback, useEffect, type ComponentType, type ReactNode } from "react";
import { pageSEO } from "@/app/seo.config";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { AnnouncementBar, ANNOUNCEMENT_BAR_HEIGHT } from "@/app/components/layout/announcement-bar";

import { StickyMobileCta } from "@/app/components/layout/sticky-mobile-cta";
import { useModal } from "@/app/contexts/modal-context";
import { useSEO } from "@/app/hooks/use-seo";
import { useSchemaOrg } from "@/app/hooks/use-schema-org";
import { useLanguage } from "@/app/contexts/language-context";
import { SITE_ORIGIN } from "@/lib/urls";

type LazyComponent<TProps = Record<string, unknown>> = ComponentType<TProps>;

// Helper to load named exports via React.lazy without repeating boilerplate.
function lazyNamed<TProps = Record<string, unknown>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importer: () => Promise<any>,
  exportName: string
) {
  return lazy(() =>
    importer().then((module: Record<string, unknown>) => ({
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
const CtaSection = lazyNamed(
  () => import("@/app/components/sections/cta-section"),
  "CtaSection"
);

const Hero = lazyNamed(
  () => import("@/app/components/sections/hero"),
  "Hero"
);
const LogoMarquee = lazyNamed(
  () => import("@/app/components/sections/logo-marquee"),
  "LogoMarquee"
);
const ProblemSection = lazyNamed(
  () => import("@/app/components/sections/problem"),
  "ProblemSection"
);
const RoleSelection = lazyNamed(
  () => import("@/app/components/sections/role-selection"),
  "RoleSelection"
);
const SignalRadar = lazyNamed(
  () => import("@/app/components/sections/signal-radar"),
  "SignalRadar"
);
const DashboardPreview = lazyNamed(
  () => import("@/app/components/sections/dashboard-preview"),
  "DashboardPreview"
);


export function LandingPage() {
  const { language } = useLanguage();
  const { openSignup, openDemo } = useModal();

  // Auto-open modals or scroll to section based on URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('signup') === '1') {
      openSignup('direct_link');
      window.history.replaceState({}, '', '/');
    } else if (params.get('demo') === '1') {
      openDemo('direct_link');
      window.history.replaceState({}, '', '/');
    } else if (params.get('scroll')) {
      const target = params.get('scroll');
      window.history.replaceState({}, '', '/');
      // Small delay to let lazy sections render
      setTimeout(() => {
        const el = target ? document.getElementById(target) : null;
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }

    // Handle hash navigation (e.g. /#about, /#blog from other pages)
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const seo = pageSEO.home[language] || pageSEO.home.en;
  const [bannerVisible, setBannerVisible] = useState(() => {
    try { return sessionStorage.getItem("announcement_dismissed") !== "1"; } catch { return true; }
  });
  const handleBannerVisibility = useCallback((v: boolean) => setBannerVisible(v), []);
  const topOffset = bannerVisible ? ANNOUNCEMENT_BAR_HEIGHT : 0;
  
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
      <AnnouncementBar onVisibilityChange={handleBannerVisibility} />
      <Header topOffset={topOffset} />
      <main style={{ paddingTop: topOffset }}>
        {/* 1. HERO — Outcome promise + dual CTA */}
        <LazySection>
          <Hero />
        </LazySection>

        {/* 2. SOCIAL PROOF — Client logos + stat counters */}
        <LazySection>
          <LogoMarquee />
        </LazySection>

        {/* 3. PROBLEM — Build pain awareness */}
        <LazySection>
          <ProblemSection />
        </LazySection>

        {/* 4. PERSONALIZATION — Role-based value (moved up) */}
        <LazySection>
          <RoleSelection />
        </LazySection>

        {/* 5. HOW IT WORKS + WHAT WE MEASURE */}
        <LazySection>
          <SignalRadar />
        </LazySection>

        {/* 6. VISUAL PROOF — See the dashboard */}
        <LazySection>
          <DashboardPreview />
        </LazySection>

        {/* 7. SOCIAL PROOF — Real client results */}
        <LazySection>
          <CaseStudiesSection />
        </LazySection>

        {/* 8. INVESTMENT — Pricing calculator */}
        <LazySection>
          <PurchaseSection />
        </LazySection>

        {/* 9. OBJECTION HANDLING — FAQ + trust badges */}
        <LazySection>
          <FAQ />
        </LazySection>

        {/* 10. FINAL CTA + lead capture */}
        <LazySection>
          <CtaSection />
        </LazySection>
      </main>
      <Footer />
      <StickyMobileCta />
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
