import React from "react";
import { Check, Shield, Users, Target } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export function ValueByRole() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white border-t border-slate-200" id="value-by-role">
      <div className="container-default">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                {t.valueByRole.title}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
                {t.valueByRole.subtitle}
            </p>
        </div>

        {/* The Comparative Grid - Strict "Spec Sheet" Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl max-w-6xl mx-auto">
            
            {/* CEO Column - Strategic / Dark Mode (The Boardroom) */}
            <div className="bg-[#0f172a] p-10 md:p-14 flex flex-col h-full border-b lg:border-b-0 lg:border-r border-white/5 relative group">
                {/* Subtle sheen */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="flex items-center gap-4 mb-10 relative z-10">
                    <div className="p-3 bg-white/10 rounded-lg text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">
                            {t.valueByRole.ceo.title}
                        </h3>
                        <div className="h-0.5 w-12 bg-blue-500/50" />
                    </div>
                </div>

                <div className="mb-12 flex-1 relative z-10">
                    <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
                        {t.valueByRole.ceo.desc}
                    </p>
                </div>

                <div className="border-t border-white/10 pt-10 relative z-10">
                    <ul className="space-y-8">
                        {t.valueByRole.ceo.list.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="mt-1.5 p-1 rounded-full bg-blue-500/20 text-blue-400 shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <strong className="block text-white text-base font-bold uppercase tracking-wide mb-2">{item.title}</strong>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* HR Column - Operational / Light Mode (The Field) */}
            <div className="bg-white p-10 md:p-14 flex flex-col h-full relative">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-violet-50 border border-violet-100 rounded-lg text-violet-600">
                        <Users className="w-6 h-6" />
                    </div>
                     <div>
                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider mb-1">
                            {t.valueByRole.hr.title}
                        </h3>
                        <div className="h-0.5 w-12 bg-violet-200" />
                    </div>
                </div>

                 <div className="mb-12 flex-1">
                    <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed">
                        {t.valueByRole.hr.desc}
                    </p>
                </div>

                <div className="border-t border-slate-100 pt-10">
                    <ul className="space-y-8">
                        {t.valueByRole.hr.list.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="mt-1.5 p-1 rounded-full bg-violet-50 text-violet-600 shrink-0">
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <strong className="block text-slate-900 text-base font-bold uppercase tracking-wide mb-2">{item.title}</strong>
                                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>

        {/* Bottom Stabilizer */}
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-50 rounded-full text-xs font-medium text-slate-500 border border-slate-200 uppercase tracking-wide">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.valueByRole.bottomBadge}</span>
            </div>
        </div>

      </div>
    </section>
  );
}
