import React, { useState } from "react";
import { Check, Shield, Users, Target, ArrowRight, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { useModal } from "@/app/ModalContext";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

type Role = "ceo" | "hr";
type BenefitItem = string | { title: string; desc?: string };

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
      cta: t.valueByRole?.cta?.ceo,
    },
    hr: {
      icon: Users,
      title: t.valueByRole.hr.title,
      desc: t.valueByRole.hr.desc,
      list: t.valueByRole.hr.list,
      cta: t.valueByRole?.cta?.hr,
    },
  };

  const current = roleData[activeRole];
  const Icon = current.icon;

  return (
    <section className="section-spacing bg-brand-background-secondary" id="value-by-role">
      <div className="container-default max-w-[1120px] mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white backdrop-blur-sm rounded-full border border-brand-primary/20 mb-10 shadow-sm">
            <span className="font-mono text-[11px] font-bold text-brand-primary tracking-[0.15em] uppercase">
              {t.valueByRole.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 md:mb-8 tracking-[-0.015em] leading-[1.1]">
            {t.valueByRole.title}
          </h2>
          <p className="text-brand-text-secondary text-xl leading-[1.7] font-medium">
            {t.valueByRole.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex bg-white p-1.5 md:p-2 rounded-xl shadow-md border border-brand-border">
            <RoleTabButton
              active={activeRole === "ceo"}
              onClick={() => setActiveRole("ceo")}
              icon={Target}
              label={t.valueByRole?.tabs?.ceo}
            />
            <RoleTabButton
              active={activeRole === "hr"}
              onClick={() => setActiveRole("hr")}
              icon={Users}
              label={t.valueByRole?.tabs?.hr}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-brand-border overflow-hidden">
            
            {/* Content Header */}
            <div className="p-12 border-b border-brand-border bg-gradient-to-r from-brand-background-secondary/50 to-transparent">
              <div className="flex items-start gap-6">
                <div className="p-5 bg-brand-primary/10 rounded-xl text-brand-primary ring-1 ring-brand-primary/20">
                  <Icon className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-brand-text-primary mb-4 tracking-[-0.01em]">
                    {current.title}
                  </h3>
                  <p className="text-brand-text-secondary text-xl leading-[1.7] max-w-2xl font-medium">
                    {current.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="p-12">
              <ul className="grid md:grid-cols-1 gap-8">
                {current.list
                  .filter(Boolean)
                  .map((item: BenefitItem, index: number) => (
                    <BenefitListItem key={index} item={item} />
                  ))}
              </ul>

              {/* CTA */}
              <div className="mt-12 pt-10 border-t border-brand-border flex flex-col sm:flex-row items-center gap-5">
                <Button
                  onClick={openBooking}
                  size="lg"
                >
                  {activeRole === "ceo" ? t.valueByRole?.cta?.ceo : t.valueByRole?.cta?.hr}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <span className="text-sm text-brand-text-muted">
                  {t.valueByRole?.ctaNote}
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

type RoleTabButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label?: string;
};

function RoleTabButton({ active, onClick, icon: Icon, label }: RoleTabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-8 py-4 rounded-lg text-base font-bold transition-all",
        active
          ? "bg-brand-primary text-white shadow-md"
          : "text-brand-text-secondary hover:text-brand-primary hover:bg-brand-background-secondary"
      )}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

type BenefitListItemProps = {
  item: BenefitItem;
};

function BenefitListItem({ item }: BenefitListItemProps) {
  const title = typeof item === "string" ? item : item?.title;
  const desc = typeof item === "string" ? "" : item?.desc;
  if (!title) return null;

  return (
    <li className="flex items-start gap-5">
      <div className="mt-1.5 p-2 rounded-full bg-brand-primary text-white shrink-0">
        <Check className="w-5 h-5" />
      </div>
      <div>
        <strong className="block text-brand-text-primary text-lg font-bold mb-2 tracking-[-0.005em]">
          {title}
        </strong>
        {desc && (
          <p className="text-[15px] text-brand-text-secondary leading-[1.7]">
            {desc}
          </p>
        )}
      </div>
    </li>
  );
}
