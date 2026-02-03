import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, BarChart, Lock, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { toast } from "sonner";
import { useLanguage } from "../LanguageContext";

export function AIReadinessAudit() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [email, setEmail] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Hardcoded 5 strategic questions for the lead magnet
  const questions = [
    {
      question: "Where do you look for people data?",
      options: [
        { label: "Spreadsheets. Honestly, it's a bit chaotic.", score: 0 },
        { label: "HRIS system, but we don't use it much.", score: 10 },
        { label: "Centralized dashboard we trust.", score: 20 }
      ]
    },
    {
      question: "Do you know who is at risk of leaving?",
      options: [
        { label: "No. I find out when they resign.", score: 0 },
        { label: "I have a gut feeling.", score: 10 },
        { label: "Yes, we have predictive risk indicators.", score: 20 }
      ]
    },
    {
      question: "Do you know the cost of losing a senior expert?",
      options: [
        { label: "No idea.", score: 0 },
        { label: "Rough estimate.", score: 10 },
        { label: "Yes, precise calculation.", score: 20 }
      ]
    },
    {
      question: "Action on dissatisfaction?",
      options: [
        { label: "Reactive counter-offers.", score: 0 },
        { label: "Ad-hoc conversations.", score: 10 },
        { label: "Proactive retention system.", score: 20 }
      ]
    },
    {
      question: "Is retention a manager KPI?",
      options: [
        { label: "No, HR owns it.", score: 0 },
        { label: "Encouraged, but not measured.", score: 10 },
        { label: "Yes, key responsibility.", score: 20 }
      ]
    }
  ];

  const handleAnswer = (score: number) => {
    setTotalScore(prev => prev + score);
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getResult = () => {
    // Simplified logic for wireframe
    if (totalScore >= 80) return { label: "Pioneer", color: "text-emerald-600", bg: "bg-emerald-50", msg: "You are ahead of the curve." };
    if (totalScore >= 40) return { label: "Evolving", color: "text-amber-600", bg: "bg-amber-50", msg: "Good foundation, room to grow." };
    return { label: "Legacy", color: "text-red-600", bg: "bg-red-50", msg: "High risk of talent loss." };
  };

  const handleUnlock = () => {
    if (!email || !email.includes('@')) {
        toast.error("Please enter a valid work email.");
        return;
    }
    setIsUnlocking(true);
    setTimeout(() => {
        setIsUnlocking(false);
        toast.success("Audit sent!", { description: `Report sent to ${email}` });
        setEmail("");
    }, 1500);
  };

  const result = getResult();

  return (
    <section className="section-spacing bg-white border-b border-slate-200" id="audit">
      <div className="container-default">
        <div className="max-w-2xl mx-auto">
            {!isFinished ? (
              <div className="card-base p-8 shadow-xl shadow-indigo-100/50">
                 <div className="flex justify-between items-center mb-8">
                    <div className="inline-flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-caption">
                        <BarChart className="w-4 h-4" />
                        Readiness Audit
                    </div>
                    <span className="text-caption font-mono">Q{currentStep + 1}/{questions.length}</span>
                 </div>

                 <div className="mb-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-indigo-600" 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep) / questions.length) * 100}%` }}
                    />
                 </div>

                 <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-h3 font-bold text-slate-900 mb-8 mt-6">
                            {questions[currentStep].question}
                        </h3>
                        <div className="space-y-3">
                            {questions[currentStep].options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option.score)}
                                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all flex justify-between items-center group"
                                >
                                    <span className="font-medium text-body text-slate-700 group-hover:text-indigo-900">{option.label}</span>
                                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                 </AnimatePresence>
              </div>
            ) : (
                <div className="card-base p-8 text-center shadow-xl">
                    <div className="mb-6">
                        <span className="text-caption font-bold text-slate-400 uppercase tracking-widest block mb-2">Your Result</span>
                        <h3 className={cn("text-h1 font-bold mb-4 tracking-tighter", result.color)}>{result.label}</h3>
                        <p className="text-body text-slate-500">{result.msg}</p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 mb-6 text-left">
                        <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-body">
                             <Lock className="w-4 h-4" />
                             Unlock Full Report
                        </div>
                        <ul className="space-y-2 mb-6">
                            <li className="flex gap-2 text-caption text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Action Plan</li>
                            <li className="flex gap-2 text-caption text-slate-600"><Check className="w-4 h-4 text-emerald-500" /> Benchmark Data</li>
                        </ul>
                        <div className="flex gap-2">
                            <input 
                                type="email" 
                                placeholder="Work Email" 
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-body focus:ring-2 focus:ring-indigo-600 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Button onClick={handleUnlock} disabled={isUnlocking} className="bg-slate-900 text-white text-body">
                                {isUnlocking ? <Loader2 className="animate-spin w-4 h-4" /> : "Unlock"}
                            </Button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => { setIsFinished(false); setCurrentStep(0); setTotalScore(0); }}
                        className="text-caption font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-3 h-3" /> Retake
                    </button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
}
