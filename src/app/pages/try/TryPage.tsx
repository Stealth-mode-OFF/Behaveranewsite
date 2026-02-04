import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { DemoRequestModal } from "../../components/DemoRequestModal";
import { useModal } from "../../ModalContext";

const sampleQuestions = [
  "Mám jasno v tom, jaké jsou priority našeho týmu.",
  "Mám realistickou kapacitu na svou práci.",
  "Vím, na koho se obrátit, když narazím na problém.",
  "Dostávám pravidelnou a férovou zpětnou vazbu.",
  "Vnímám, že naše spolupráce v týmu funguje.",
];

export function TryPage() {
  const { openDemoRequest } = useModal();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="py-24 border-b border-brand-border">
          <div className="container-default text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-6">
              Vyzkoušejte Echo Pulse na vlastní kůži
            </h1>
            <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
              Krátká ukázka toho, jak vypadá průběžný pulse – bez složitostí, bez dlouhých dotazníků.
            </p>
          </div>
        </section>

        <section className="py-24">
          <div className="container-default max-w-4xl">
            <div className="bg-brand-background-secondary border border-brand-border rounded-lg p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-brand-text-primary mb-2">
                  Ukázka otázky
                </h2>
                <p className="text-brand-text-secondary">
                  Odpovědi jsou anonymní. Vyberte, jak moc souhlasíte:
                </p>
              </div>

              <div className="space-y-6">
                {sampleQuestions.map((question) => (
                  <div key={question} className="bg-white border border-brand-border rounded-lg p-6">
                    <p className="text-brand-text-primary font-medium mb-4">{question}</p>
                    <div className="grid grid-cols-5 gap-2 text-xs text-brand-text-muted">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div
                          key={value}
                          className="h-10 rounded-md border border-brand-border bg-brand-background-secondary flex items-center justify-center font-semibold text-brand-text-secondary"
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 text-center">
                <p className="text-brand-text-secondary">
                  Chcete vidět výsledky a doporučení?
                </p>
                <Button
                  onClick={openDemoRequest}
                  className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg"
                >
                  Chci demo přístup
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <DemoRequestModal />
    </>
  );
}
