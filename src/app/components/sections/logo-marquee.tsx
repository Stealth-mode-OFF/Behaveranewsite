import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import pwcLogo from "@/assets/logos/normalized/pwc.png";
import vodafoneLogo from "@/assets/logos/normalized/vodafone.png";
import notinoLogo from "@/assets/logos/normalized/notino.png";
import o2Logo from "@/assets/logos/normalized/o2.png";
import lidlLogo from "@/assets/logos/normalized/lidl.png";
import prusaLogo from "@/assets/logos/normalized/prusa.png";
import teyaLogo from "@/assets/logos/normalized/teya.png";
import martinusLogo from "@/assets/logos/normalized/martinus.png";
import startupjobsLogo from "@/assets/logos/normalized/startupjobs.png";
import raynetLogo from "@/assets/logos/normalized/raynet.png";

// Export logos for reuse in other components
export const clientLogos = [
  { name: "PwC", src: pwcLogo },
  { name: "Vodafone", src: vodafoneLogo },
  { name: "Notino", src: notinoLogo },
  { name: "O2", src: o2Logo },
  { name: "Lidl", src: lidlLogo },
  { name: "Prusa", src: prusaLogo },
  { name: "Teya", src: teyaLogo },
  { name: "Martinus", src: martinusLogo },
  { name: "StartupJobs", src: startupjobsLogo },
  { name: "Raynet", src: raynetLogo },
];

export function LogoMarquee() {
  const { t, language } = useLanguage();

  const title = {
    cz: "Důvěřuje nám 50+ firem v Česku",
    en: "Trusted by 50+ companies in the Czech Republic",
    de: "Über 50 Unternehmen in Tschechien vertrauen uns",
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-brand-background-secondary border-b border-brand-border relative z-20 overflow-hidden">
      <div className="container-default">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-6"
        >
          <h2 className="text-center text-sm font-medium text-brand-text-muted uppercase tracking-widest">
            {title[language] || title.en}
          </h2>
        </motion.div>
        
        {/* Marquee Container */}
        <div className="relative marquee-container">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <div className="w-full inline-flex flex-nowrap overflow-hidden">
            <ul className="flex items-center [&_li]:mx-8 md:[&_li]:mx-12 animate-infinite-scroll shrink-0">
              {clientLogos.map((logo, index) => (
                <li key={index} className="shrink-0">
                  <div className="w-[100px] md:w-[120px] h-[32px] md:h-[40px] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      className="max-w-full max-h-full w-auto h-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <ul className="flex items-center [&_li]:mx-8 md:[&_li]:mx-12 animate-infinite-scroll shrink-0" aria-hidden="true">
              {clientLogos.map((logo, index) => (
                <li key={`duplicate-${index}`} className="shrink-0">
                  <div className="w-[100px] md:w-[120px] h-[32px] md:h-[40px] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt=""
                      className="max-w-full max-h-full w-auto h-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
