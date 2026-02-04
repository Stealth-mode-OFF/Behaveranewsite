import React, { useState } from "react";
import { Check, ShieldCheck, Star } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useLanguage } from "../LanguageContext";

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

  return (
    <section className="section-spacing bg-white" id="pricing">
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

        <div className="max-w-4xl mx-auto card-base p-8 md:p-12 shadow-xl shadow-brand-primary/5">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Configuration */}
                <div>
                    <h3 className="text-h3 text-brand-text-primary mb-6">{t.purchase.configTitle}</h3>
                    
                    {/* Billing Toggle */}
                    <div className="flex bg-brand-background-secondary p-1 rounded-lg mb-8 w-fit border border-brand-border/50">
                        <button 
                            onClick={() => setBillingInterval('monthly')}
                            className={cn(
                                "px-4 py-2 rounded-md text-caption font-semibold transition-all",
                                billingInterval === 'monthly' ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted hover:text-brand-text-primary"
                            )}
                        >
                            {t.purchase.billingMonthly}
                        </button>
                        <button 
                            onClick={() => setBillingInterval('yearly')}
                            className={cn(
                                "px-4 py-2 rounded-md text-caption font-semibold transition-all",
                                billingInterval === 'yearly' ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted hover:text-brand-text-primary"
                            )}
                        >
                            {t.purchase.billingYearly}
                        </button>
                    </div>

                    {/* Slider */}
                    <div className="mb-8">
                         <div className="flex justify-between items-end mb-4">
                            <label className="text-caption font-bold text-brand-text-secondary">{t.purchase.companySizeLabel}</label>
                            <div className="text-h3 font-mono text-brand-text-primary">{employeeCount} <span className="text-body font-sans text-brand-text-muted font-normal">{t.purchase.employeesLabel}</span></div>
                         </div>
                         <input 
                            type="range" 
                            min="10" 
                            max="350" 
                            step="5"
                            value={employeeCount}
                            onChange={(e) => setEmployeeCount(Number(e.target.value))}
                            className="w-full h-2 bg-brand-background-secondary rounded-lg appearance-none cursor-pointer accent-brand-primary"
                         />
                    </div>

                    <div className="space-y-3">
                        {t.purchase.features.slice(0, 4).map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-brand-primary shrink-0" />
                                <span className="text-body text-brand-text-secondary">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Box */}
                <div className="bg-brand-background-secondary rounded-xl p-8 border border-brand-border flex flex-col justify-between">
                    <div>
                    <span className="text-caption font-bold text-brand-text-muted uppercase tracking-widest block mb-4">{t.purchase.estimatedLabel}</span>
                        
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-h1 font-bold text-brand-text-primary tracking-tight">
                                {basePrice.toLocaleString()}
                            </span>
                            <span className="text-body font-semibold text-brand-text-muted">{t.purchase.perMonthLabel}</span>
                        </div>
                        
                        {isCapped && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-success/10 text-brand-success rounded-full text-caption font-bold uppercase tracking-wider mb-6 border border-brand-success/20">
                                <ShieldCheck className="w-3 h-3" />
                                {t.purchase.priceCapped.replace("{cap}", String(BILLABLE_EMPLOYEE_CAP))}
                            </div>
                        )}
                        
                        <div className="pt-6 border-t border-brand-border space-y-2">
                             <div className="flex justify-between text-body">
                                <span className="text-brand-text-muted">{t.purchase.basePriceLabel}</span>
                                <span className="font-medium text-brand-text-primary">{basePrice.toLocaleString()} CZK</span>
                             </div>
                             <div className="flex justify-between text-body">
                                <span className="text-brand-text-muted">{t.purchase.vatLabel}</span>
                                <span className="font-medium text-brand-text-primary">{vat.toLocaleString(undefined, { maximumFractionDigits: 0 })} CZK</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <Button className="w-full" size="default">
                            {t.purchase.button}
                        </Button>
                        <p className="text-center text-caption text-brand-text-muted mt-4 font-medium">
                            {t.purchase.guaranteeShort}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
