import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import pwcLogo from "@/assets/logos/normalized/pwc.png";
import vodafoneLogo from "@/assets/logos/normalized/vodafone.png";
import notinoLogo from "@/assets/logos/normalized/notino.png";
import o2Logo from "@/assets/logos/normalized/o2.png";
import lidlLogo from "@/assets/logos/normalized/lidl.png";
import prusaLogo from "@/assets/logos/normalized/prusa.png";
import valxonLogo from "@/assets/logos/normalized/valxon.png";
import medevioLogo from "@/assets/logos/normalized/medevio.png";
import teyaLogo from "@/assets/logos/normalized/teya.png";
import sprinxLogo from "@/assets/logos/normalized/sprinx.png";
import martinusLogo from "@/assets/logos/normalized/martinus.png";
import optimioLogo from "@/assets/logos/normalized/optimio.png";
import effectixLogo from "@/assets/logos/normalized/effectix.png";
import socialmindLogo from "@/assets/logos/normalized/socialmind.png";
import hajdukLogo from "@/assets/logos/normalized/hajduk-partners.png";
import websupportLogo from "@/assets/logos/normalized/websupport.png";
import untitledLogo from "@/assets/logos/normalized/untitled-ui.png";

const logos = [
  { name: "PwC", src: pwcLogo },
  { name: "Vodafone", src: vodafoneLogo },
  { name: "Notino", src: notinoLogo },
  { name: "O2", src: o2Logo },
  { name: "Lidl", src: lidlLogo },
  { name: "Prusa", src: prusaLogo },
  { name: "Valxon", src: valxonLogo },
  { name: "Medevio", src: medevioLogo },
  { name: "Teya", src: teyaLogo },
  { name: "Sprinx", src: sprinxLogo },
  { name: "Martinus", src: martinusLogo },
  { name: "Optimio", src: optimioLogo },
  { name: "Effectix", src: effectixLogo },
  { name: "Socialmind", src: socialmindLogo },
  { name: "Hajduk & Partners", src: hajdukLogo },
  { name: "Websupport", src: websupportLogo },
  { name: "Untitled UI", src: untitledLogo },
];

export function LogoMarquee() {
  const { t } = useLanguage();

  return (
    <section className="py-10 bg-white border-b border-brand-border relative z-20 overflow-hidden">
      <div className="container-default">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            
            {/* Label - Static Anchor */}
            <div className="shrink-0 text-[11px] font-mono font-bold text-brand-text-muted uppercase tracking-widest border-l-2 border-brand-border-strong pl-3 py-1">
                {t.data.trustedBy}
            </div>
            
            {/* Marquee Container */}
            <div className="w-full overflow-hidden relative mask-linear-fade">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
                
                <div className="w-full inline-flex flex-nowrap">
                    <ul className="flex items-center [&_li]:mx-8 animate-infinite-scroll">
                    {logos.map((logo, index) => (
                        <li key={index}>
                        <div className="h-12 flex items-center">
                          <img
                            src={logo.src}
                            alt={`${logo.name} logo`}
                            className="h-12 w-auto object-contain opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            loading="lazy"
                          />
                        </div>
                        </li>
                    ))}
                    </ul>
                    <ul className="flex items-center [&_li]:mx-8 animate-infinite-scroll" aria-hidden="true">
                    {logos.map((logo, index) => (
                        <li key={`duplicate-${index}`}>
                        <div className="h-12 flex items-center">
                          <img
                            src={logo.src}
                            alt=""
                            className="h-12 w-auto object-contain opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                            loading="lazy"
                          />
                        </div>
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
