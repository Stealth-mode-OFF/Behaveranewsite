import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
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
  { name: "StartupJobs", src: startupjobsLogo },
  { name: "Raynet", src: raynetLogo },
];

export function LogoMarquee() {
  const { t, language } = useLanguage();

  const title = {
    cz: 'Svěřili nám svou důvěru',
    en: 'Trusted by leading companies',
    de: 'Von führenden Unternehmen vertraut',
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-brand-background-secondary border-b border-brand-border relative z-20 overflow-hidden">
      <div className="container-default">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-brand-text-secondary tracking-tight">
            {title[language] || title.en}
          </h2>
        </motion.div>
        
        {/* Marquee Container */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-background-secondary via-brand-background-secondary/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-background-secondary via-brand-background-secondary/80 to-transparent z-10" />
          
          <div className="w-full inline-flex flex-nowrap">
            <ul className="flex items-center [&_li]:mx-6 md:[&_li]:mx-10 animate-infinite-scroll">
              {clientLogos.map((logo, index) => (
                <li key={index}>
                  <div className="h-10 md:h-12 flex items-center">
                    <img
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      className="h-10 md:h-12 w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <ul className="flex items-center [&_li]:mx-6 md:[&_li]:mx-10 animate-infinite-scroll" aria-hidden="true">
              {clientLogos.map((logo, index) => (
                <li key={`duplicate-${index}`}>
                  <div className="h-10 md:h-12 flex items-center">
                    <img
                      src={logo.src}
                      alt=""
                      className="h-10 md:h-12 w-auto object-contain opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
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
