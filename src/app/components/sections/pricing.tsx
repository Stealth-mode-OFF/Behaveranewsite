import React, { useState } from "react";
import { Check, ShieldCheck, Star, Users, Zap } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { useLanguage } from "@/app/LanguageContext";

export function PurchaseSection() {
  const { t } = useLanguage();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [employeeCount, setEmployeeCount] = useState(50);
  
  const BILLABLE_EMPLOYEE_CAP = 200;
  const pricePerPerson = billingInterval === 'monthly' ? 129 : 99;
  
  const billableEmployees = Math.min(employeeCount, BILLABLE_EMPLOYEE_CAP);
  const rawPrice = pricePerPerson * billableEmployees;
  const isCapped = employeeCount > BILLABLE_EMPLOYEE_CAP;
  const priceCap = BILLABLE_EMPLOYEE_CAP * pricePerPerson;
  const basePrice = Math.min(rawPrice, priceCap);
  const vat = basePrice * 0.21;
  const totalPrice = basePrice + vat;
  
  // Calculate savings
  const yearlySavings = billingInterval === 'yearly' ? (129 - 99) * billableEmployees * 12 : 0;

  return (
    <section className="section-spacing bg-gradient-to-b from-white to-brand-background-secondary" id="pricing">
      <div className="container-default">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-background-secondary text-brand-text-secondary text-caption font-bold uppercase tracking-widest mb-6 border border-brand-border">
             <Star className="w-3.5 h-3.5 fill-current text-brand-warning" />
             {t.purchase.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary mb-4">
            {t.purchase.title}
          </h2>
          <p className="text-body text-brand-text-secondary">
            {t.purchase.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-2xl shadow-brand-primary/10 border border-brand-border">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Configuration */}
                <div>
                    <h3 className="text-xl font-bold text-brand-text-primary mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-brand-primary" />
                        {t.purchase.configTitle}
                    </h3>
                    
                    {/* Billing Toggle */}
                    <div className="flex bg-brand-background-muted p-1.5 rounded-xl mb-8 w-fit border border-brand-border">
                        <button 
                            onClick={() => setBillingInterval('monthly')}
                            className={cn(
                                "px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                                billingInterval === 'monthly' 
                                  ? "bg-brand-primary text-white shadow-md" 
                                  : "text-brand-text-secondary hover:text-brand-primary hover:bg-white/50"
                            )}
                        >
                            {t.purchase.billingMonthly}
                        </button>
                        <button 
                            onClick={() => setBillingInterval('yearly')}
                            className={cn(
                                "px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                                billingInterval === 'yearly' 
                                  ? "bg-brand-primary text-white shadow-md" 
                                  : "text-brand-text-secondary hover:text-brand-primary hover:bg-white/50"
                            )}
                        >
                            {t.purchase.billingYearly}
                        </button>
                    </div>

                    {/* Slider */}
                    <div className="mb-8">
                         <div className="flex justify-between items-end mb-4">
                            <label className="text-caption font-bold text-brand-text-secondary uppercase tracking-wider">{t.purchase.companySizeLabel}</label>
                            <div className="text-2xl font-bold font-mono text-brand-primary">{employeeCount} <span className="text-sm font-sans text-brand-text-muted font-medium">{t.purchase.employeesLabel}</span></div>
                         </div>
                         
                         {/* Custom Slider Track */}
                         <div className="relative pt-2 pb-4">
                           <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-gradient-to-r from-brand-background-muted via-brand-border to-brand-background-muted rounded-full" />
                           <div 
                             className="absolute top-1/2 -translate-y-1/2 left-0 h-3 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-150"
                             style={{ width: `${((employeeCount - 10) / (350 - 10)) * 100}%` }}
                           />
                           <input 
                              type="range" 
                              min="10" 
                              max="350" 
                              step="5"
                              value={employeeCount}
                              onChange={(e) => setEmployeeCount(Number(e.target.value))}
                              className="relative w-full h-8 sm:h-3 appearance-none cursor-pointer bg-transparent z-10
                                [&::-webkit-slider-thumb]:appearance-none
                                [&::-webkit-slider-thumb]:w-10
                                [&::-webkit-slider-thumb]:h-10
                                [&::-webkit-slider-thumb]:sm:w-6
                                [&::-webkit-slider-thumb]:sm:h-6
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
                                [&::-moz-range-thumb]:sm:w-6
                                [&::-moz-range-thumb]:sm:h-6
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
                         <div className="flex justify-between text-xs text-brand-text-muted font-medium mt-1">
                           <span>10</span>
                           <span>100</span>
                           <span>200</span>
                           <span>350+</span>
                         </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-brand-border">
                        {t.purchase.features.slice(0, 4).map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-brand-primary" />
                                </div>
                                <span className="text-sm text-brand-text-secondary">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Box */}
                <div className="bg-gradient-to-br from-brand-primary to-brand-primary-hover rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-6">
                            <Zap className="w-4 h-4 text-brand-accent" />
                            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{t.purchase.estimatedLabel}</span>
                        </div>
                        
                        {/* Price per person */}
                        <div className="mb-2">
                            <span className="text-sm text-white/60">
                                {pricePerPerson} CZK × {billableEmployees} {t.purchase.employeesLabel}
                            </span>
                        </div>
                        
                        <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-5xl md:text-6xl font-bold text-white tracking-tight transition-all duration-300">
                                {basePrice.toLocaleString()}
                            </span>
                            <span className="text-lg font-medium text-white/70">{t.purchase.perMonthLabel}</span>
                        </div>
                        
                        {billingInterval === 'yearly' && yearlySavings > 0 && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-success/20 text-brand-success rounded-full text-sm font-bold mb-4 border border-brand-success/30">
                                <Check className="w-4 h-4" />
                                Ušetříte {yearlySavings.toLocaleString()} CZK/rok
                            </div>
                        )}
                        
                        {isCapped && (
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white rounded-full text-sm font-bold mb-4 border border-white/20">
                                <ShieldCheck className="w-4 h-4" />
                                {t.purchase.priceCapped.replace("{cap}", String(BILLABLE_EMPLOYEE_CAP))}
                            </div>
                        )}
                        
                        <div className="pt-4 border-t border-white/10 space-y-2">
                             <div className="flex justify-between text-sm">
                                <span className="text-white/60">{t.purchase.basePriceLabel}</span>
                                <span className="font-medium text-white">{basePrice.toLocaleString()} CZK</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-white/60">{t.purchase.vatLabel}</span>
                                <span className="font-medium text-white">{vat.toLocaleString(undefined, { maximumFractionDigits: 0 })} CZK</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 relative">
                        <Button 
                            className="w-full bg-white text-brand-primary hover:bg-white/90 font-bold shadow-lg" 
                            size="lg"
                        >
                            {t.purchase.button}
                        </Button>
                        <p className="text-center text-xs text-white/60 mt-4">
                            {t.purchase.guaranteeShort}
                        </p>
                        
                        {/* Trust Signals */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/70">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
                                    <span>GDPR</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="w-3.5 h-3.5 text-brand-success" />
                                    <span>Bez závazků</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Zap className="w-3.5 h-3.5 text-brand-warning" />
                                    <span>Start do 1h</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
