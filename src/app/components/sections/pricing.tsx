import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Check, ShieldCheck, Star, Users, Zap, Sparkles, ArrowRight, Gift, Clock, Rocket, Heart } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { useLanguage } from "@/app/contexts/language-context";
import { trackPricingBillingToggle, trackPricingSliderChanged } from "@/lib/analytics";

const MOTION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Animated counter hook ─── */
function useAnimatedNumber(value: number, duration = 0.5) {
  const motionVal = useMotionValue(value);
  const [display, setDisplay] = useState(value.toLocaleString());
  
  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString()),
    });
    return controls.stop;
  }, [value, motionVal, duration]);
  
  return display;
}

/* ─── Pricing-specific translations ─── */
const pricingCopy = {
  cz: {
    popularBadge: "Nejoblíbenější",
    perPerson: "za osobu",
    perMonth: "/ měsíc",
    noCard: "Bez platební karty · Bez závazků",
    startIn: "Start do 1 hodiny",
    allInclusive: "Vše v jednom balíčku:",
    extraFeatures: [
      "AI-analýza 24/7 v reálném čase",
      "Neomezené pulzy a signály",
      "Dashboard pro CEO, HR i manažery",
      "Akční doporučení na míru",
      "Onboarding a podpora zdarma",
      "Integrace s Slack, WhatsApp - připravujeme",
      "Export reportů a dat",
    ],
    ctaPrimary: "Objednat pro celou firmu",
    ctaSecondary: "Otestovat 1 tým zdarma →",
    trustLine: "Už přes 50 firem důvěřuje Behavera",
    roiTitle: "Proč se to vyplatí",
    roiDesc: "Průměrná mzda v ČR: 48 295 Kč (ČSÚ, Q3 2025). Ztráta jednoho člověka stojí 6–9 měsíčních platů. Behavera pro 50 lidí: ~4 950 Kč/měsíc.",
    roiSource: "Zdroj: ČSÚ, Gallup 2024",
  },
  en: {
    popularBadge: "Most popular",
    perPerson: "per person",
    perMonth: "/ month",
    noCard: "No credit card · No commitment",
    startIn: "Live in under 1 hour",
    allInclusive: "Everything included:",
    extraFeatures: [
      "24/7 real-time AI analysis",
      "Unlimited pulses & signals",
      "Dashboards for CEO, HR & managers",
      "Tailored action recommendations",
      "Free onboarding & support",
      "Slack, WhatsApp integrations (coming soon)",
      "Export reports & raw data",
    ],
    ctaPrimary: "Order for your company",
    ctaSecondary: "Test 1 team for free →",
    trustLine: "Already trusted by 50+ companies",
    roiTitle: "Why it pays off",
    roiDesc: "Average CZ wage: CZK 48,295 (CZSO, Q3 2025). Losing one person costs 6–9 months' salary. Behavera for 50 people: ~CZK 4,950/mo.",
    roiSource: "Source: CZSO, Gallup 2024",
  },
  de: {
    popularBadge: "Beliebteste",
    perPerson: "pro Person",
    perMonth: "/ Monat",
    noCard: "Keine Kreditkarte · Keine Verpflichtung",
    startIn: "In unter 1 Stunde live",
    allInclusive: "Alles inklusive:",
    extraFeatures: [
      "24/7 KI-Analyse in Echtzeit",
      "Unbegrenzte Pulsmessungen & Signale",
      "Dashboards für CEO, HR & Manager",
      "Maßgeschneiderte Handlungsempfehlungen",
      "Kostenloses Onboarding & Support",
      "Slack, WhatsApp Integrationen (in Vorbereitung)",
      "Datenexport & Berichte",
    ],
    ctaPrimary: "Für Ihr Unternehmen bestellen",
    ctaSecondary: "1 Team kostenlos testen →",
    trustLine: "Über 50 Unternehmen vertrauen Behavera",
    roiTitle: "Warum es sich rechnet",
    roiDesc: "Durchschnittlicher CZ-Lohn: 48.295 CZK (CZSO, Q3 2025). Ein Abgang kostet 6–9 Monatsgehälter. Behavera für 50 MA: ~4.950 CZK/Monat.",
    roiSource: "Quelle: CZSO, Gallup 2024",
  },
};

export function PurchaseSection() {
  const { t, language } = useLanguage();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [employeeCount, setEmployeeCount] = useState(50);
  
  const pc = pricingCopy[language] || pricingCopy.en;
  const isEur = language === 'en' || language === 'de';
  
  const BILLABLE_EMPLOYEE_CAP = 200;
  const monthlyPrice = isEur ? 5 : 129;
  const yearlyPrice = isEur ? 4 : 99;
  const pricePerPerson = billingInterval === 'monthly' ? monthlyPrice : yearlyPrice;
  
  const billableEmployees = Math.min(employeeCount, BILLABLE_EMPLOYEE_CAP);
  const rawPrice = pricePerPerson * billableEmployees;
  const isCapped = employeeCount > BILLABLE_EMPLOYEE_CAP;
  const priceCap = BILLABLE_EMPLOYEE_CAP * pricePerPerson;
  const basePrice = Math.min(rawPrice, priceCap);
  const vat = basePrice * 0.21;
  const totalPrice = basePrice + vat;
  
  // Calculate savings
  const yearlySavings = billingInterval === 'yearly' ? (monthlyPrice - yearlyPrice) * billableEmployees * 12 : 0;
  
  // Animated price display
  const animatedBase = useAnimatedNumber(basePrice);
  const animatedSavings = useAnimatedNumber(yearlySavings);

  return (
    <section className="section-spacing bg-brand-background-secondary/25 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 left-[8%] h-44 w-44 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="absolute top-1/3 right-[6%] h-56 w-56 rounded-full bg-brand-primary/[0.12] blur-3xl" />
      </div>
      <div className="container-default relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: MOTION_EASE }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="section-badge">
             <Star className="w-3.5 h-3.5 fill-current text-brand-warning" />
             {t.purchase.badge}
          </div>
          <h2 className="text-h2 text-brand-text-primary mb-4">
            {t.purchase.title}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {t.purchase.titleHighlight}
            </span>
          </h2>
          <p className="text-body text-brand-text-secondary mb-10 md:mb-14">
            {t.purchase.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease: MOTION_EASE }}
          className="max-w-5xl mx-auto section-shell p-4 sm:p-6 md:p-8"
        >
          {/* Billing Toggle — centered above the card */}
          <div className="flex justify-center mb-8">
            <div className="relative flex surface-elevated p-1.5 rounded-2xl shadow-lg shadow-brand-primary/[0.08]">
              <button 
                onClick={() => { setBillingInterval('monthly'); trackPricingBillingToggle('monthly'); }}
                className={cn(
                  "px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2",
                  billingInterval === 'monthly'
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                    : "text-brand-text-secondary hover:text-brand-primary"
                )}
              >
                {t.purchase.billingMonthly}
              </button>
              <button 
                onClick={() => { setBillingInterval('yearly'); trackPricingBillingToggle('yearly'); }}
                className={cn(
                  "px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2",
                  billingInterval === 'yearly'
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                    : "text-brand-text-secondary hover:text-brand-primary"
                )}
              >
                {t.purchase.billingYearly}
                {billingInterval === 'yearly' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: MOTION_EASE }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-badge font-bold text-white bg-gradient-to-r from-brand-success to-brand-success rounded-full shadow-md shadow-brand-success/30 ml-1"
                  >
                    <Gift className="w-3 h-3" />
                    -20%
                  </motion.span>
                )}
              </button>
            </div>
          </div>

          {/* Main pricing card */}
          <div className="surface-elevated rounded-3xl shadow-2xl shadow-brand-primary/[0.10] overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              
              {/* LEFT: Configuration (3 cols) */}
              <div className="lg:col-span-3 p-5 sm:p-8 md:p-10">
                <h3 className="text-xl font-bold text-brand-text-primary mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-primary" />
                  {t.purchase.configTitle}
                </h3>
                <p className="text-caption text-brand-text-muted mb-6 md:mb-8">
                  {pc.noCard}
                </p>
                
                {/* Slider */}
                <div className="mb-8 md:mb-10">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-caption font-bold text-brand-text-secondary uppercase tracking-wider">{t.purchase.companySizeLabel}</label>
                    <motion.div 
                      key={employeeCount}
                      initial={{ scale: 1.2, color: 'var(--color-brand-accent)' }}
                      animate={{ scale: 1, color: 'var(--color-brand-primary)' }}
                      className="text-2xl font-bold font-mono"
                    >
                      {employeeCount} <span className="text-sm font-sans text-brand-text-muted font-medium">{t.purchase.employeesLabel}</span>
                    </motion.div>
                  </div>
                  
                  {/* Custom Slider Track */}
                  <div className="relative pt-2 pb-4">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-gradient-to-r from-brand-background-muted via-brand-border to-brand-background-muted rounded-full" />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 left-0 h-3 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary rounded-full transition-all duration-150"
                      style={{ width: `${((employeeCount - 10) / (350 - 10)) * 100}%` }}
                    />
                    <input 
                      type="range" 
                      min="10" 
                      max="350" 
                      step="5"
                      value={employeeCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setEmployeeCount(val);
                      }}
                      onMouseUp={() => trackPricingSliderChanged(employeeCount)}
                      onTouchEnd={() => trackPricingSliderChanged(employeeCount)}
                      className="relative w-full h-8 sm:h-3 appearance-none cursor-pointer bg-transparent z-10
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-10
                        [&::-webkit-slider-thumb]:h-10
                        [&::-webkit-slider-thumb]:sm:w-7
                        [&::-webkit-slider-thumb]:sm:h-7
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:border-4
                        [&::-webkit-slider-thumb]:border-brand-primary
                        [&::-webkit-slider-thumb]:shadow-lg
                        [&::-webkit-slider-thumb]:shadow-brand-primary/30
                        [&::-webkit-slider-thumb]:cursor-grab
                        [&::-webkit-slider-thumb]:active:cursor-grabbing
                        [&::-webkit-slider-thumb]:hover:scale-110
                        [&::-webkit-slider-thumb]:transition-transform
                        [&::-moz-range-thumb]:w-10
                        [&::-moz-range-thumb]:h-10
                        [&::-moz-range-thumb]:sm:w-7
                        [&::-moz-range-thumb]:sm:h-7
                        [&::-moz-range-thumb]:rounded-full
                        [&::-moz-range-thumb]:bg-white
                        [&::-moz-range-thumb]:border-4
                        [&::-moz-range-thumb]:border-brand-primary
                        [&::-moz-range-thumb]:shadow-lg
                        [&::-moz-range-thumb]:cursor-grab
                      "
                    />
                  </div>
                  
                  {/* Scale Labels */}
                  <div className="flex justify-between text-badge sm:text-caption text-brand-text-muted font-medium mt-1 px-0.5">
                    <span>10</span>
                    <span>100</span>
                    <span>200</span>
                    <span>350+</span>
                  </div>
                </div>

                {/* All-inclusive features */}
                <div>
                  <h4 className="text-caption font-bold text-brand-text-primary mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-warning" />
                    {pc.allInclusive}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {pc.extraFeatures.map((feature: string, i: number) => (
                      <motion.div 
                        key={feature} 
                        className="flex items-start gap-2.5"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i, duration: 0.3, ease: MOTION_EASE }}
                      >
                        <div className="w-4.5 h-4.5 rounded-full bg-brand-success/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-brand-success" />
                        </div>
                        <span className="text-caption text-brand-text-secondary leading-snug">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Summary (2 cols) */}
              <div className="lg:col-span-2 bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary-hover p-5 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-20 left-0 w-32 h-32 bg-white/[0.03] rounded-full -translate-x-1/2" />
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-brand-accent/10 rounded-full blur-xl" />
                
                <div className="relative">
                  {/* Popular badge */}
                  {billingInterval === 'yearly' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: MOTION_EASE }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent rounded-full text-badge font-bold mb-5"
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {pc.popularBadge}
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-4 h-4 text-brand-accent" />
                    <span className="text-badge font-bold text-white/70 uppercase tracking-widest">{t.purchase.estimatedLabel}</span>
                  </div>
                  
                  {/* Per-person price */}
                  <div className="mb-1">
                    <span className="text-body-sm text-white/50">
                      {isEur ? `€${pricePerPerson}` : `${pricePerPerson} Kč`} {pc.perPerson} {pc.perMonth}
                    </span>
                  </div>
                  
                  {/* Animated total price */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <motion.span 
                      key={`price-${basePrice}`}
                      initial={{ opacity: 0.5, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-display text-white"
                    >
                      {isEur ? `€${animatedBase}` : animatedBase}
                    </motion.span>
                    <span className="text-lg font-medium text-white/60">{t.purchase.perMonthLabel}</span>
                  </div>
                  
                  {/* Price per person detail */}
                  <p className="text-caption text-white/40 mb-4">
                    × {billableEmployees} {t.purchase.employeesLabel}
                  </p>
                  
                  {/* Savings badge */}
                  <AnimatePresence>
                    {billingInterval === 'yearly' && yearlySavings > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, height: 0 }}
                        animate={{ opacity: 1, scale: 1, height: 'auto' }}
                        exit={{ opacity: 0, scale: 0.9, height: 0 }}
                        className="mb-5"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/20 to-white/10 text-white rounded-xl text-sm font-bold border border-white/20 backdrop-blur-sm">
                          <Gift className="w-4 h-4 text-brand-accent" />
                          {language === 'de'
                            ? `Sparen Sie €${animatedSavings}/Jahr`
                            : language === 'en'
                            ? `Save €${animatedSavings}/year`
                            : `Ušetříte ${animatedSavings} Kč/rok`}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isCapped && (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-full text-sm font-bold mb-4 border border-white/20">
                      <ShieldCheck className="w-4 h-4" />
                      {t.purchase.priceCapped.replace("{cap}", String(BILLABLE_EMPLOYEE_CAP))}
                    </div>
                  )}
                  
                  {/* Price breakdown */}
                  <div className="pt-4 border-t border-white/10 space-y-2 mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">{t.purchase.basePriceLabel}</span>
                      <span className="font-medium text-white">{isEur ? `€${animatedBase}` : `${animatedBase} Kč`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">{t.purchase.vatLabel}</span>
                      <span className="font-medium text-white">{isEur ? `€${vat.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : `${vat.toLocaleString(undefined, { maximumFractionDigits: 0 })} Kč`}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 relative space-y-3">
                  <Button asChild size="default" className="w-full bg-white text-brand-primary hover:bg-white/90 font-bold shadow-xl shadow-black/10 group btn-shine">
                    <a href="https://www.behavera.com/start" target="_blank" rel="noopener noreferrer">
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      {pc.ctaPrimary}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                  
                  <a
                    href="https://app.behavera.com/echo-pulse/try"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center text-caption text-white/50 hover:text-white transition-colors duration-200 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 focus-visible:ring-offset-2"
                  >
                    {pc.ctaSecondary}
                  </a>
                  
                  {/* Bottom trust */}
                  <div className="pt-5 border-t border-white/10">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-badge text-white/60">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                        <span>GDPR</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-brand-success" />
                        <span>{pc.noCard.split('·')[1]?.trim()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-warning" />
                        <span>{pc.startIn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ROI callout below card — CZSO-backed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: MOTION_EASE }}
            className="mt-8 max-w-lg mx-auto text-center"
          >
            <div className="px-6 py-4 rounded-2xl bg-brand-success/[0.06] border border-brand-success/15">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-brand-success" />
                <span className="text-sm font-bold text-brand-success">{pc.roiTitle}</span>
              </div>
              <p className="text-caption text-brand-text-secondary leading-relaxed">
                {pc.roiDesc}
              </p>
              <p className="text-xs text-brand-text-muted mt-2">{pc.roiSource}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
