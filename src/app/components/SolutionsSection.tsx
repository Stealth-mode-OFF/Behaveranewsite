import React from "react";
import { Activity, HeartPulse, UserCheck, GraduationCap, Compass, ShieldCheck } from "lucide-react";

const solutions = [
  {
    title: "Echo Pulse (Engagement)",
    description:
      "AI a behaviorální věda odhalí skryté bloky během několika minut. Vedoucí získají jasné kroky, co dělat dál a kde tým brzdí výkon.",
    icon: Activity
  },
  {
    title: "Well-being Index",
    description:
      "Měříme 12 oblastí well-beingu. Zjistíte, kde hrozí vyhoření, ztráta engagementu nebo pokles výkonu, a dostanete doporučení na míru.",
    icon: HeartPulse
  },
  {
    title: "Recruitment",
    description:
      "Vyberte si lidi, kteří vám opravdu sednou do role i do týmu. Herní assessmenty odhalí, jak člověk přemýšlí a co ho motivuje.",
    icon: UserCheck
  },
  {
    title: "Development",
    description:
      "Posuďte potenciál lídrů i jednotlivců podle chování ve hrách, které simulují pracovní den. Rozvoj plánujte na základě dat.",
    icon: GraduationCap
  },
  {
    title: "Culture Fit",
    description:
      "Neměříme osobnost, ale preference. Porovnáme týmy a jejich vedoucí, a předpovíme, jak budou spolupracovat.",
    icon: Compass
  },
  {
    title: "Leadership Competencies",
    description:
      "Měříme 24 oblastí manažerských faktorů. Získáte jistotu, kdy se lidem jejich přístup vyplatí a kdy je naopak brzdí.",
    icon: ShieldCheck
  }
];

export function SolutionsSection() {
  return (
    <section className="section-spacing bg-brand-background-primary border-t border-brand-border" id="solutions">
      <div className="container-default">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
              Řešení, která mění data v akci
            </h2>
            <p className="text-lg text-brand-text-secondary leading-relaxed">
              Od rychlých pulsů po hluboké diagnostiky. Vyberte si nástroje, které vám dají jistotu při náboru,
              rozvoji i vedení lidí.
            </p>
          </div>
          <div className="text-sm font-mono uppercase tracking-widest text-brand-text-muted">
            Produkty a metodiky Behavera
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <div
                key={solution.title}
              className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
                <div className="w-12 h-12 rounded-xl bg-brand-primary text-white flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-brand-text-primary mb-3">{solution.title}</h3>
                <p className="text-sm text-brand-text-secondary leading-relaxed">{solution.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
