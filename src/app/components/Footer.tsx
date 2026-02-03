import React from "react";
import { useLanguage } from "../LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 md:py-24 text-sm text-slate-500">
      <div className="container-default">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="font-bold text-slate-900 tracking-tight">Echo Pulse</span>
            </div>
            
            <div className="flex gap-8">
                {t.footer.links.map((link, i) => (
                    <a key={i} href="#" className="hover:text-slate-900 transition-colors font-medium">{link}</a>
                ))}
            </div>

            <div className="text-right flex flex-col items-end gap-2">
                <p>{t.footer.rights}</p>
                <div className="flex gap-6 justify-end">
                    {t.footer.legal.map((item, i) => (
                        <a key={i} href="#" className="hover:text-slate-900 transition-colors">{item}</a>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}
