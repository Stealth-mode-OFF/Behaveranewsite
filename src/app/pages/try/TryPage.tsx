import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { DemoRequestModal } from "../../components/DemoRequestModal";
import { QuestionnairePreview } from "../../components/QuestionnairePreview";
import { useModal } from "../../ModalContext";
import { useLanguage } from "../../LanguageContext";

export function TryPage() {
  const { openDemoRequest } = useModal();
  const { t } = useLanguage();
  const copy = t.tryPage || {};

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="py-24 border-b border-brand-border">
          <div className="container-default text-center">
            {copy.badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-background-muted text-brand-text-secondary text-xs font-bold uppercase tracking-widest mb-6 border border-brand-border">
                {copy.badge}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-6">
              {copy.title}
            </h1>
            <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
              {copy.subtitle}
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container-default max-w-4xl">
            <QuestionnairePreview />

            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="text-brand-text-secondary">
                {copy.ctaTitle}
              </p>
              <Button
                onClick={openDemoRequest}
                className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg"
              >
                {copy.ctaButton}
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <DemoRequestModal />
    </>
  );
}
