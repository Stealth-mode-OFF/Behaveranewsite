import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LogoMarquee } from "./components/LogoMarquee";
import { RoleSelection } from "./components/RoleSelection";
import { ProblemSection } from "./components/ProblemSection";
import { MethodologySection } from "./components/MethodologySection";
import { SignalRadar } from "./components/SignalRadar";
import { CzechRealitySection } from "./components/CzechRealitySection";
import { DecisionLock } from "./components/DecisionLock";
import { HowItWorks } from "./components/HowItWorks";
import { DashboardPreview } from "./components/DashboardPreview";
import { ValueByRole } from "./components/ValueByRole";
import { BlogSection } from "./components/BlogSection";
import { CtaSection } from "./components/CtaSection";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { LanguageProvider } from "./LanguageContext";
import { ModalProvider } from "./ModalContext";
import { BookingModal } from "./components/BookingModal";
import { DemoVideoModal } from "./components/DemoVideoModal";
import { LeadPopup } from "./components/LeadPopup";
import { Toaster } from "sonner";

function App() {
  return (
    <LanguageProvider>
      <ModalProvider>
        <div className="min-h-screen bg-brand-background-primary font-sans text-brand-text-primary">
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
            <ValueByRole />
            <BlogSection />
            <CtaSection />
            <FAQ />
          </main>
          <Footer />

          <BookingModal />
          <DemoVideoModal />
          <LeadPopup />
          <Toaster position="top-center" richColors />
        </div>
      </ModalProvider>
    </LanguageProvider>
  );
}

export default App;
