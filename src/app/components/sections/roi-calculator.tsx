import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PieChart, Download } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";
import { toast } from "sonner";
import { useModal } from "@/app/ModalContext";
import { useLanguage } from "@/app/LanguageContext";

export function ROICalculator() {
  const [employees, setEmployees] = useState(150);
  const [currency, setCurrency] = useState<'EUR' | 'CZK'>('CZK');
  const [salary, setSalary] = useState(840000); 
  const [turnover, setTurnover] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const { openBooking } = useModal();
  const { t } = useLanguage();
  
  const EXCHANGE_RATE = 25;

  const toggleCurrency = (newCurrency: 'EUR' | 'CZK') => {
    if (currency === newCurrency) return;
    setCurrency(newCurrency);
    if (newCurrency === 'CZK') {
        setSalary(Math.round(salary * EXCHANGE_RATE));
    } else {
        setSalary(Math.round(salary / EXCHANGE_RATE));
    }
  };

  const replacementCost = salary * 0.33;
  const employeesLeaving = Math.ceil(employees * (turnover / 100));
  const totalLoss = employeesLeaving * replacementCost;
  const potentialSavings = totalLoss * 0.40;

  const AnimatedNumber = ({ value }: { value: number }) => (
    <span>
        {currency === 'EUR' ? '€' : ''}
        {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        {currency === 'CZK' ? ' Kč' : ''}
    </span>
  );

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
        setIsGenerating(false);
        toast.success(t.calculator.boardReport.button, {
            description: "Detailed report saved to your device."
        });
    }, 1500);
  };

  return (
    <section className="section-spacing bg-white border-b border-brand-border" id="roi">
      <div className="container-default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-background-secondary text-brand-text-secondary rounded-full text-caption font-bold uppercase tracking-widest mb-6 border border-brand-border">
              <PieChart className="w-3.5 h-3.5" />
              {t.calculator.badge}
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-primary mb-6">
              {t.calculator.title} <span className="text-brand-accent">{t.calculator.titleHighlight}</span>
            </h2>
            
            <p className="text-body text-brand-text-muted mb-8">
              {t.calculator.subtitle}
            </p>

            <div className="card-base p-6 bg-brand-background-secondary">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-brand-border flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-primary text-body">{t.calculator.boardReport.title}</h4>
                        <p className="text-caption text-brand-text-muted">{t.calculator.boardReport.subtitle}</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className="w-full bg-white border-brand-border text-brand-text-muted hover:bg-brand-background-secondary font-semibold text-body"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                >
                    {isGenerating ? t.calculator.boardReport.buttonGenerating : t.calculator.boardReport.button}
                </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="card-base p-0 overflow-hidden shadow-xl shadow-brand-primary/10">
              {/* Header / Results Area */}
              <div className="bg-brand-primary p-8 text-white">
                <div className="flex justify-end mb-8">
                    <div className="flex bg-white/10 rounded-lg p-1 border border-white/10">
                        <button 
                            onClick={() => toggleCurrency('EUR')}
                            className={cn(
                                "px-3 py-1 rounded text-caption font-bold transition-all",
                                currency === 'EUR' ? "bg-white text-brand-primary" : "text-white/90 hover:text-white"
                            )}
                        >
                            EUR
                        </button>
                        <button 
                            onClick={() => toggleCurrency('CZK')}
                            className={cn(
                                "px-3 py-1 rounded text-caption font-bold transition-all",
                                currency === 'CZK' ? "bg-white text-brand-primary" : "text-white/90 hover:text-white"
                            )}
                        >
                            CZK
                        </button>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="border-l-2 border-white/20 pl-6">
                         <div className="text-caption text-brand-accent font-bold uppercase tracking-widest mb-2">
                            {t.calculator.metrics.annualLoss}
                         </div>
                         <div className="text-h1 font-bold text-red-400 font-mono tracking-tight">
                            <AnimatedNumber value={totalLoss} />
                         </div>
                    </div>
                    
                    <div className="border-l-2 border-emerald-500 pl-6">
                        <div className="text-caption text-emerald-400 font-bold uppercase tracking-widest mb-2">
                            {t.calculator.metrics.recoverableRevenue}
                        </div>
                        <div className="text-h1 font-bold text-white font-mono tracking-tight">
                            <AnimatedNumber value={potentialSavings} />
                         </div>
                    </div>
                </div>
              </div>

              {/* Sliders Area */}
              <div className="p-8 md:p-10 bg-white">
                 <div className="space-y-8">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-body font-bold text-brand-primary">{t.calculator.sliders.employees}</label>
                            <span className="font-mono text-h3 font-bold text-brand-primary">{employees}</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="350" 
                            value={employees} 
                            onChange={(e) => setEmployees(Number(e.target.value))}
                            className="w-full h-2 bg-brand-background-secondary rounded-lg appearance-none cursor-pointer accent-brand-primary"
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-body font-bold text-brand-primary">{t.calculator.sliders.avgAnnualCost}</label>
                            <span className="font-mono text-h3 font-bold text-brand-primary">
                                {currency === 'EUR' ? '€' : ''}{salary.toLocaleString()}{currency === 'CZK' ? ' Kč' : ''}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={currency === 'EUR' ? 30000 : 480000} 
                            max={currency === 'EUR' ? 120000 : 3000000} 
                            value={salary} 
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="w-full h-2 bg-brand-background-secondary rounded-lg appearance-none cursor-pointer accent-brand-primary"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-body font-bold text-brand-primary">{t.calculator.sliders.annualTurnover}</label>
                            <span className="font-mono text-h3 font-bold text-brand-primary">{turnover}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={turnover} 
                            onChange={(e) => setTurnover(Number(e.target.value))}
                            className="w-full h-2 bg-brand-background-secondary rounded-lg appearance-none cursor-pointer accent-brand-primary"
                        />
                    </div>
                 </div>

                 <div className="mt-10 pt-8 border-t border-brand-border flex justify-end">
                    <Button 
                        onClick={openBooking}
                        className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg text-body"
                    >
                        {t.calculator.cta.button} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                 </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
