import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Users, 
  Target, 
  BarChart, 
  ShieldCheck, 
  ArrowRight,
  type LucideIcon 
} from "lucide-react";
import { useLanguage } from "@/app/contexts/language-context";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { trackRoleSelected } from "@/lib/analytics";

type RoleConfig = {
  id: string;
  icon: LucideIcon;
  label: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  benefits: string[];
  cta: string;
  color: string;
};

/**
 * Role Selection - iOS Segmented Control Style
 * 
 * Features:
 * - Horizontal segmented control for role selection
 * - Animated content panel that changes based on selection
 * - Reduced cognitive load (select first, see benefits)
 * - Clean iPad Pro aesthetic
 */
export function RoleSelection() {
  const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const { t, language } = useLanguage();

  const [activeRole, setActiveRole] = useState("ceo");

  const roles: RoleConfig[] = [
    {
      id: "ceo",
      icon: Briefcase,
      label: language === 'cz' ? 'CEO / Founder' : language === 'de' ? 'CEO / Gründer' : 'CEO / Founder',
      shortLabel: 'CEO',
      title: t.roleSelection?.ceo?.title || "See what you're missing",
      subtitle: language === 'cz'
        ? "Získejte přehled o náladě v týmu a rizicích odchodů bez toho, abyste museli spoléhat jen na intuici."
        : language === 'de'
        ? "Verschaffen Sie sich Einblick in die Teamstimmung und Abwanderungsrisiken — ohne sich nur auf Ihr Bauchgefühl verlassen zu müssen."
        : "Get visibility into team sentiment and departure risks without relying on gut feel alone.",
      benefits: t.roleSelection?.ceo?.list || [
        "Real-time team pulse",
        "Data-driven people decisions"
      ],
      cta: t.roleSelection?.ceo?.cta || "Learn more",
      color: "bg-brand-primary",
    },
    {
      id: "hr",
      icon: Users,
      label: language === 'cz' ? 'HR Leader' : language === 'de' ? 'HR Leiter' : 'HR Leader',
      shortLabel: 'HR',
      title: t.roleSelection?.hr?.title || "Prevent turnover proactively",
      subtitle: language === 'cz'
        ? "Přestaňte hasit požáry. Identifikujte rizikové jedince a týmy předtím, než dají výpověď."
        : language === 'de'
        ? "Schluss mit dem Feuerlöschen. Identifizieren Sie gefährdete Mitarbeiter und Teams, bevor sie kündigen."
        : "Stop firefighting. Identify at-risk individuals and teams before they hand in their notice.",
      benefits: t.roleSelection?.hr?.list || [
        "Predictive attrition alerts",
        "Actionable engagement insights"
      ],
      cta: t.roleSelection?.hr?.cta || "Learn more",
      color: "bg-brand-accent-hover",
    },
    {
      id: "teamLeader",
      icon: Target,
      label: language === 'cz' ? 'Team Lead' : language === 'de' ? 'Team Lead' : 'Team Lead',
      shortLabel: 'Lead',
      title: t.roleSelection?.teamLeader?.title || "Build a thriving team",
      subtitle: language === 'cz'
        ? "Pochopte dynamiku vašeho týmu a získejte nástroje pro budování zdravého pracovního prostředí."
        : language === 'de'
        ? "Verstehen Sie die Dynamik Ihres Teams und erhalten Sie Werkzeuge für ein gesundes Arbeitsumfeld."
        : "Understand your team dynamics and get tools to build a healthy work environment.",
      benefits: t.roleSelection?.teamLeader?.list || [
        "Team health visibility",
        "Concrete improvement actions"
      ],
      cta: t.roleSelection?.teamLeader?.cta || "Learn more",
      color: "bg-brand-warning",
    },
  ];

  const activeRoleData = roles.find(r => r.id === activeRole) || roles[1];

  return (
    <section className="section-spacing bg-gradient-to-b from-brand-primary to-brand-background-dark relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="container-default relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="section-badge section-badge-dark">
            {language === 'cz' ? 'Pro každou roli' : language === 'de' ? 'Für jede Rolle' : 'For every role'}
          </div>
          <h2 className="text-h2 text-white mb-4">
            {t.roleSelection?.title || "Everyone sees the company"}
            <span className="bg-gradient-to-r from-brand-accent to-brand-accent/60 bg-clip-text text-transparent">
              {t.roleSelection?.titleHighlight || " from a different angle."}
            </span>
          </h2>
          <p className="text-body-lg text-brand-text-on-dark leading-relaxed mb-10 md:mb-14">
            {t.roleSelection?.subtitle || "Select your role to see how Behavera helps you specifically."}
          </p>
        </motion.div>

        {/* Segmented Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.3, ease: MOTION_EASE }}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = activeRole === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => { setActiveRole(role.id); trackRoleSelected(role.id); }}
                  className={cn(
                    "relative px-4 sm:px-6 py-3 min-h-[44px] rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2",
                    isActive 
                      ? "text-brand-primary" 
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {/* Animated background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="segmentBg"
                      className="absolute inset-0 bg-white rounded-xl shadow-lg"
                      transition={{ duration: 0.3, ease: MOTION_EASE }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={cn(
                      "w-4 h-4 transition-colors duration-200",
                      isActive ? "text-brand-primary" : ""
                    )} />
                    <span className="hidden sm:inline">{role.label}</span>
                    <span className="sm:hidden">{role.shortLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: MOTION_EASE }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 sm:p-12"
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left: Content */}
              <div>
                {/* Role Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    activeRoleData.color
                  )}>
                    <activeRoleData.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-[0.15em] text-brand-accent">
                    {activeRoleData.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-h3 text-white mb-4">
                  {activeRoleData.title}
                </h3>

                {/* Subtitle */}
                <p className="text-body-lg text-brand-text-on-dark leading-relaxed mb-8">
                  {activeRoleData.subtitle}
                </p>

                {/* CTA */}
                <Button asChild size="default" className="bg-white text-brand-primary hover:bg-white/90 font-semibold">
                  <a href="https://app.behavera.com/echo-pulse/try" target="_blank" rel="noopener noreferrer">
                    {activeRoleData.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>

              {/* Right: Benefits List */}
              <div className="space-y-4">
                {activeRoleData.benefits.map((benefit, index) => {
                  const Icon = index === 0 ? BarChart : ShieldCheck;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1, duration: 0.3, ease: MOTION_EASE }}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-accent/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-brand-accent" />
                      </div>
                      <span className="text-white font-medium pt-2">
                        {benefit}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
