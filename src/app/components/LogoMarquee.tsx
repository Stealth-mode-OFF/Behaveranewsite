import React from "react";
import { cn } from "./ui/utils";
import { useLanguage } from "../LanguageContext";

const logos = [
  { name: "PwC", className: "font-serif font-bold tracking-tight" },
  { name: "Vodafone", className: "font-sans font-bold" },
  { name: "Notino", className: "font-sans font-medium tracking-wide" },
  { name: "365.bank", className: "font-mono font-bold" },
  { name: "O2", className: "font-sans font-extrabold" },
  { name: "Prusa", className: "font-sans font-black tracking-tighter" },
  { name: "Lidl", className: "font-sans font-bold italic" },
  { name: "Valxon", className: "font-sans font-bold" },
  { name: "Medevio", className: "font-sans font-medium" },
  { name: "Teya", className: "font-sans font-bold tracking-wide" },
  { name: "Sprinx", className: "font-sans font-bold" },
  { name: "Martinus", className: "font-serif font-bold" },
  { name: "Optimio", className: "font-sans font-bold tracking-tight" },
  { name: "Effectix", className: "font-sans font-bold" },
  { name: "Socialmind", className: "font-sans font-medium" },
];

export function LogoMarquee() {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-[#0f1115] border-b border-white/5 relative z-20 overflow-hidden">
      <div className="container-default">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Label - Static Anchor */}
            <div className="shrink-0 text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest border-l-2 border-brand-primary pl-3 py-1">
                {t.data.trustedBy}
            </div>
            
            {/* Marquee Container */}
            <div className="w-full overflow-hidden relative mask-linear-fade">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0f1115] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0f1115] to-transparent z-10" />
                
                <div className="w-full inline-flex flex-nowrap">
                    <ul className="flex items-center [&_li]:mx-8 animate-infinite-scroll">
                    {logos.map((logo, index) => (
                        <li key={index}>
                        <span className={cn("text-lg text-slate-600 font-bold opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default uppercase grayscale hover:grayscale-0", logo.className)}>
                            {logo.name}
                        </span>
                        </li>
                    ))}
                    </ul>
                    <ul className="flex items-center [&_li]:mx-8 animate-infinite-scroll" aria-hidden="true">
                    {logos.map((logo, index) => (
                        <li key={`duplicate-${index}`}>
                        <span className={cn("text-lg text-slate-600 font-bold opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default uppercase grayscale hover:grayscale-0", logo.className)}>
                            {logo.name}
                        </span>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
