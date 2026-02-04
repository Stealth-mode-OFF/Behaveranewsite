import React, { useState } from "react";
import { Check, Shield, Users, Target, ArrowRight } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useModal } from "../ModalContext";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

type Role = "ceo" | "hr";

export function ValueByRole() {
  const { t } = useLanguage();
  const { openBooking } = useModal();
  const [activeRole, setActiveRole] = useState<Role>("ceo");

  const roleData = {
    ceo: {
      icon: Target,
      title: t.valueByRole.ceo.title,
      desc: t.valueByRole.ceo.desc,
      list: t.valueByRole.ceo.list,
      cta: "See CEO Dashboard",
      ctaCz: "Zobrazit pohled CEO",
    },
    hr: {
      icon: Users,
      title: t.valueByRole.hr.title,
      desc: t.valueByRole.hr.desc,
      list: t.valueByRole.hr.list,
      cta: "See HR Dashboard",
      ctaCz: "Zobrazit pohled HR",
    },
  };

  const current = roleData[activeRole];
  const Icon = current.icon;

  return (
    <section className="py-24 bg-brand-background-secondary" id="value-by-role">
      <div className="container-default">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
            {t.valueByRole.title}
          </h2>
          <p className="text-brand-text-secondary text-lg leading-relaxed">
            {t.valueByRole.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white p-1.5 rounded-xl shadow-sm border border-brand-border">
            <button
              onClick={() => setActiveRole("ceo")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all",
                activeRole === "ceo"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-brand-text-secondary hover:text-brand-primary hover:bg-brand-background-secondary"
              )}
            >
              <Target className="w-4 h-4" />
              CEO / Vedení
            </button>
            <button
              onClick={() => setActiveRole("hr")}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all",
                activeRole === "hr"
                  ? "bg-brand-primary text-white shadow-md"
                  : "text-brand-text-secondary hover:text-brand-primary hover:bg-brand-background-secondary"
              )}
            >
              <Users className="w-4 h-4" />
              HR / People Ops
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-brand-border overflow-hidden">
            
            {/* Content Header */}
            <div className="p-8 md:p-10 border-b border-brand-border bg-gradient-to-r from-brand-background-secondary/50 to-transparent">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-text-primary mb-3">
                    {current.title}
                  </h3>
                  <p className="text-brand-text-secondary text-lg leading-relaxed max-w-2xl">
                    {current.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="p-8 md:p-10">
              <ul className="grid md:grid-cols-1 gap-6">
                {current.list
                  .filter(Boolean)
                  .map((item: any, index: number) => {
                    const title = typeof item === "string" ? item : item?.title;
                    const desc = typeof item === "string" ? "" : item?.desc;
                    if (!title) return null;
                    return (
                      <li key={index} className="flex items-start gap-4">
                        <div className="mt-1 p-1.5 rounded-full bg-brand-primary text-white shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="block text-brand-text-primary text-base font-bold mb-1">
                            {title}
                          </strong>
                          {desc && (
                            <p className="text-sm text-brand-text-secondary leading-relaxed">
                              {desc}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-brand-border flex flex-col sm:flex-row items-center gap-4">
                <Button
                  onClick={openBooking}
                  className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg"
                >
                  {activeRole === "ceo" ? "Schedule CEO Demo" : "Schedule HR Demo"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <span className="text-sm text-brand-text-muted">
                  20 min • Personalized for your role
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-brand-text-muted border border-brand-border">
            <Shield className="w-3.5 h-3.5 text-brand-primary" />
            <span>{t.valueByRole.bottomBadge}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
