import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useModal } from "../ModalContext";

export function AIReadinessBanner() {
  const { openBooking } = useModal();

  return (
    <section className="section-spacing bg-[#0a0a0a] border-t border-white/5" id="ai-readiness">
      <div className="container-default">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-6 border border-white/10">
              <Sparkles className="w-4 h-4" />
              AI Readiness
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Je Vaše firma připravena na éru AI?
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Získejte exkluzivní přístup k nástroji, který během pár minut nabídne jasný a praktický přehled o stavu
              Vaší firmy – vytvořený na míru pro CEO a lídry.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-white">
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Zjistěte, jak Vaši lidé obstojí v době umělé inteligence. Získáte stručný report, který vám pomůže
              nastavit priority a investice do rozvoje lidí.
            </p>
            <Button
              onClick={openBooking}
              className="w-full h-12 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-lg"
            >
              Chci AI readiness audit
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
