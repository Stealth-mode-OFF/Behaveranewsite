import React, { useState } from "react";
import { Check, ShieldCheck, Star } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { useLanguage } from "../LanguageContext";

export function PurchaseSection() {
  const { t } = useLanguage();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [employeeCount, setEmployeeCount] = useState(50);
  
  const PRICE_CAP = 14900;
  const pricePerPerson = billingInterval === 'monthly' ? 129 : 99;
  
  const rawPrice = pricePerPerson * employeeCount;
  const isCapped = rawPrice > PRICE_CAP;
  const basePrice = Math.min(rawPrice, PRICE_CAP);
  const vat = basePrice * 0.21;
  const totalPrice = basePrice + vat;

  return (
    <section className="section-spacing bg-white" id="pricing">
      <div className="container-default">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-caption font-bold uppercase tracking-widest mb-6 border border-slate-200">
             <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
             Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            {t.purchase.title}
          </h2>
          <p className="text-body text-slate-500">
            {t.purchase.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto card-base p-8 md:p-12 shadow-xl shadow-slate-200/50">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Configuration */}
                <div>
                    <h3 className="text-h3 text-slate-900 mb-6">Configure Plan</h3>
                    
                    {/* Billing Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg mb-8 w-fit">
                        <button 
                            onClick={() => setBillingInterval('monthly')}
                            className={cn(
                                "px-4 py-2 rounded-md text-caption font-semibold transition-all",
                                billingInterval === 'monthly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBillingInterval('yearly')}
                            className={cn(
                                "px-4 py-2 rounded-md text-caption font-semibold transition-all",
                                billingInterval === 'yearly' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            Yearly (-20%)
                        </button>
                    </div>

                    {/* Slider */}
                    <div className="mb-8">
                         <div className="flex justify-between items-end mb-4">
                            <label className="text-caption font-bold text-slate-700">Company Size</label>
                            <div className="text-h3 font-mono text-slate-900">{employeeCount} <span className="text-body font-sans text-slate-400 font-normal">employees</span></div>
                         </div>
                         <input 
                            type="range" 
                            min="10" 
                            max="350" 
                            step="5"
                            value={employeeCount}
                            onChange={(e) => setEmployeeCount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                         />
                    </div>

                    <div className="space-y-3">
                        {t.purchase.features.slice(0, 4).map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span className="text-body text-slate-600">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Box */}
                <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 flex flex-col justify-between">
                    <div>
                        <span className="text-caption font-bold text-slate-400 uppercase tracking-widest block mb-4">Estimated Investment</span>
                        
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-h1 font-bold text-slate-900 tracking-tight">
                                {basePrice.toLocaleString()}
                            </span>
                            <span className="text-body font-semibold text-slate-500">CZK / mo</span>
                        </div>
                        
                         {isCapped && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-caption font-bold uppercase tracking-wider mb-6">
                                <ShieldCheck className="w-3 h-3" />
                                Price Capped at {PRICE_CAP.toLocaleString()}
                            </div>
                        )}
                        
                        <div className="pt-6 border-t border-slate-200 space-y-2">
                             <div className="flex justify-between text-body">
                                <span className="text-slate-500">Base Price</span>
                                <span className="font-medium text-slate-900">{basePrice.toLocaleString()} CZK</span>
                             </div>
                             <div className="flex justify-between text-body">
                                <span className="text-slate-500">VAT (21%)</span>
                                <span className="font-medium text-slate-900">{vat.toLocaleString(undefined, { maximumFractionDigits: 0 })} CZK</span>
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <Button className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all text-body">
                            {t.purchase.button}
                        </Button>
                        <p className="text-center text-caption text-slate-400 mt-4 font-medium">
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
