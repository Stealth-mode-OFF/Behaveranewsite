import React from "react";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ProblemSection } from "./ProblemSection";
import { MethodologySection } from "./MethodologySection";
import { SignalRadar } from "./SignalRadar";
import { DashboardPreview } from "./DashboardPreview";
import { CaseStudiesSection } from "./CaseStudiesSection";
import { TrustCenter } from "./TrustCenter";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";
import { DemoVideoModal } from "./DemoVideoModal";
import { DemoAccessModal } from "./DemoAccessModal";
import { useSEO } from "@/app/hooks/useSEO";

/**
 * Enterprise Landing Page Structure
 * 
 * 6 Conceptual Layers (intelligence system narrative):
 * 1. HERO - Statement of reality + position
 * 2. PROBLEM - The cost of invisible signals (data layer)
 * 3. SYSTEM - How Echo Pulse works (methodology + signal radar)
 * 4. INTERFACE - Dashboard as control surface
 * 5. EVIDENCE - Case studies + trust signals
 * 6. ACTION - Single clear CTA
 * 
 * Removed: LogoMarquee, RoleSelection, LeadCaptureSection, 
 *          HowItWorks, ValueByRole, PurchaseSection, FAQ, LeadPopup
 */

export function LandingPage() {
  useSEO({
    title: 'Echo Pulse — Continuous Employee Insight System',
    description: 'Detect signals of disengagement, burnout, and attrition before they impact results. A scientifically validated system for predictive HR intelligence.',
    keywords: 'employee engagement, HR analytics, burnout prevention, turnover prediction, people analytics, continuous feedback, Echo Pulse, Behavera',
    ogType: 'website',
  });

  return (
    <>
      <Header />
      <main className="bg-[#FAFAFA]">
        {/* Layer 1: Statement */}
        <Hero />
        
        {/* Layer 2: The Problem (Data) */}
        <ProblemSection />
        
        {/* Layer 3: The System (How) */}
        <MethodologySection />
        <SignalRadar />
        
        {/* Layer 4: The Interface */}
        <DashboardPreview />
        
        {/* Layer 5: Evidence */}
        <CaseStudiesSection />
        <TrustCenter />
        
        {/* Layer 6: Action */}
        <CtaSection />
      </main>
      <Footer />

      {/* Modals */}
      <BookingModal />
      <DemoVideoModal />
      <DemoAccessModal />
    </>
  );
}
