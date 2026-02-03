import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, PieChart, Download } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { toast } from "sonner";
import { useModal } from "../ModalContext";
import { useLanguage } from "../LanguageContext";

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
    <section className="section-spacing bg-white border-b border-slate-200" id="roi">
      <div className="container-default">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-caption font-bold uppercase tracking-widest mb-6 border border-slate-200">
              <PieChart className="w-3.5 h-3.5" />
              Hard Data
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
              Calculate Your <span className="text-indigo-600">ROI</span>
            </h2>
            
            <p className="text-body text-slate-500 mb-8">
              See the financial impact of turnover on your organization.
            </p>

            <div className="card-base p-6 bg-slate-50">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-body">{t.calculator.boardReport.title}</h4>
                        <p className="text-caption text-slate-500">{t.calculator.boardReport.subtitle}</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    className="w-full bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-body"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                >
                    {isGenerating ? t.calculator.boardReport.buttonGenerating : t.calculator.boardReport.button}
                </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="card-base p-0 overflow-hidden shadow-xl shadow-slate-200/50">
              {/* Header / Results Area */}
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex justify-end mb-8">
                    <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                        <button 
                            onClick={() => toggleCurrency('EUR')}
                            className={cn(
                                "px-3 py-1 rounded text-caption font-bold transition-all",
                                currency === 'EUR' ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
                            )}
                        >
                            EUR
                        </button>
                        <button 
                            onClick={() => toggleCurrency('CZK')}
                            className={cn(
                                "px-3 py-1 rounded text-caption font-bold transition-all",
                                currency === 'CZK' ? "bg-white text-slate-900" : "text-slate-400 hover:text-white"
                            )}
                        >
                            CZK
                        </button>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="border-l-2 border-slate-700 pl-6">
                         <div className="text-caption text-slate-400 font-bold uppercase tracking-widest mb-2">
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
                            <label className="text-body font-bold text-slate-900">Employees</label>
                            <span className="font-mono text-h3 font-bold text-slate-900">{employees}</span>
                        </div>
                        <input 
                            type="range" 
                            min="10" 
                            max="350" 
                            value={employees} 
                            onChange={(e) => setEmployees(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                    
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-body font-bold text-slate-900">Avg. Annual Cost</label>
                            <span className="font-mono text-h3 font-bold text-slate-900">
                                {currency === 'EUR' ? '€' : ''}{salary.toLocaleString()}{currency === 'CZK' ? ' Kč' : ''}
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min={currency === 'EUR' ? 30000 : 480000} 
                            max={currency === 'EUR' ? 120000 : 3000000} 
                            value={salary} 
                            onChange={(e) => setSalary(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-body font-bold text-slate-900">Annual Turnover</label>
                            <span className="font-mono text-h3 font-bold text-slate-900">{turnover}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="50" 
                            value={turnover} 
                            onChange={(e) => setTurnover(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                    </div>
                 </div>

                 <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                    <Button 
                        onClick={openBooking}
                        className="h-12 px-8 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-lg text-body"
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
