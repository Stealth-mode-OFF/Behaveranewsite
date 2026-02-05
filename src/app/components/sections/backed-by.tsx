import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { Linkedin, ExternalLink } from 'lucide-react';

// Igor Třeslín photo
import igorTreslinImg from '@/assets/imgi_28_686d181e2536dd17ff0dda8c_Untitled design (30).png';

interface Backer {
  name: string;
  role: string;
  bio: string;
  exits: string[];
  linkedin?: string;
}

const translations = {
  cz: {
    badge: 'Backed by',
    title: 'Investoři & Advisoři',
    subtitle: 'Zkušenosti z úspěšných exitů a globálního scale-upu.',
    backers: [
      {
        name: 'Igor Třeslín',
        role: 'Lead Investor & Strategic Advisor',
        bio: 'Sériový podnikatel s track recordem 4 úspěšných exitů. Pomáhá nám budovat globálně škálovatelný produkt.',
        exits: ['Zomato', 'Dáme Jídlo', 'Foodora', 'Teya'],
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
      },
    ],
  },
  en: {
    badge: 'Backed by',
    title: 'Investors & Advisors',
    subtitle: 'Experience from successful exits and global scale-up.',
    backers: [
      {
        name: 'Igor Třeslín',
        role: 'Lead Investor & Strategic Advisor',
        bio: 'Serial entrepreneur with a track record of 4 successful exits. Helping us build a globally scalable product.',
        exits: ['Zomato', 'Dáme Jídlo', 'Foodora', 'Teya'],
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
      },
    ],
  },
  de: {
    badge: 'Unterstützt von',
    title: 'Investoren & Berater',
    subtitle: 'Erfahrung aus erfolgreichen Exits und globalem Scale-up.',
    backers: [
      {
        name: 'Igor Třeslín',
        role: 'Lead Investor & Strategischer Berater',
        bio: 'Serienunternehmer mit einer Erfolgsbilanz von 4 erfolgreichen Exits. Er hilft uns, ein global skalierbares Produkt aufzubauen.',
        exits: ['Zomato', 'Dáme Jídlo', 'Foodora', 'Teya'],
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
      },
    ],
  },
};

export function BackedBySection() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-brand-background-secondary to-brand-background-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4">
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Backer Card */}
        {t.backers.map((backer, index) => (
          <motion.div
            key={backer.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative group"
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-brand-background-tertiary/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-brand-border/30 hover:border-brand-primary/40 transition-all duration-300">
              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden ring-4 ring-brand-primary/20 group-hover:ring-brand-primary/40 transition-all duration-300">
                  <img
                    src={igorTreslinImg}
                    alt={backer.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Investor badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg whitespace-nowrap">
                  Lead Investor
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-brand-text-primary">
                    {backer.name}
                  </h3>
                  {backer.linkedin && (
                    <a
                      href={backer.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-text-muted hover:text-brand-primary transition-colors"
                      aria-label={`${backer.name} LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-brand-primary font-medium mb-4">
                  {backer.role}
                </p>
                <p className="text-brand-text-secondary text-lg mb-6 max-w-xl">
                  {backer.bio}
                </p>

                {/* Exit logos/badges */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  {backer.exits.map((exit) => (
                    <span
                      key={exit}
                      className="px-4 py-2 bg-brand-background-primary/80 border border-brand-border/40 rounded-lg text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary hover:border-brand-primary/40 transition-all duration-200"
                    >
                      {exit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Future: More backers teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-brand-text-muted">
            {language === 'cz'
              ? '+ další strategičtí poradci'
              : language === 'de'
              ? '+ weitere strategische Berater'
              : '+ more strategic advisors'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
