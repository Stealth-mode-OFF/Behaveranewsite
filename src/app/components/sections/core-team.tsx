import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { Linkedin } from 'lucide-react';

// Team member images from src/assets
import igorImg from '@/assets/imgi_23_63f4a99d1dc162409a74256f_igor.png';
import dusanImg from '@/assets/imgi_24_63f4ab8c6a107ed7cce0bcba_dusan.png';
import janaImg from '@/assets/imgi_25_686d2af4b3022512644e32a4_jana.png';
import veronikaImg from '@/assets/imgi_26_686d156a1cb983f39a6e470a_veru.png';
import josefImg from '@/assets/imgi_27_68e777c37c3e0ee92d4a6b2f_Pepa.png';
import igorTreslinImg from '@/assets/imgi_28_686d181e2536dd17ff0dda8c_Untitled design (30).png';
import jiriImg from '@/assets/imgi_22_68d3e452ae5a2da9698ea094_Untitled design (45) (1).png';

interface TeamMember {
  name: string;
  role: string;
  expertise: string;
  bio: string;
  image: string;
  linkedin?: string;
  isFounder?: boolean;
  isInvestor?: boolean;
}

const translations = {
  cz: {
    badge: 'Tým Behavera',
    title: 'Lidé, kteří stojí za',
    titleHighlight: 'Echo Pulse',
    subtitle: 'Kombinujeme psychologii, data science, HR a AI s reálnými zkušenostmi z podnikání a leadershipu.',
    founderLabel: 'Spoluzakladatel',
    investorLabel: 'Investor & Advisor',
    team: [
      {
        name: 'Jiří Valena',
        role: 'CEO',
        expertise: 'Strategic Growth, Sales, Leadership',
        bio: 'Amatérský hokejista s cílevědomostí, která boduje i v businessu.',
        linkedin: 'https://linkedin.com/in/jirivalena',
      },
      {
        name: 'Igor Kubíček',
        role: 'Head of Product & Co-founder',
        expertise: 'HR Data Analytics, Product Content, Digital Learning',
        bio: 'Přečte 40 knih za měsíc a multivariantní analýzu vysvětlí, aniž by vás bolela hlava.',
        linkedin: 'https://linkedin.com/in/igorkubicek',
        isFounder: true,
      },
      {
        name: 'Dušan Švancara',
        role: 'CTO & Co-founder',
        expertise: 'Tech Development, AI Automation, Data Security',
        bio: 'Díky Dušanovi všechno běží jako švýcarské hodinky.',
        linkedin: 'https://linkedin.com/in/dusansvancara',
        isFounder: true,
      },
      {
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        expertise: 'Sales, Partnerships, Strategic Growth',
        bio: 'Vášnivá cyklistka, která přesně ví, kde a jak může Behavera zákazníkovi nejvíc pomoci.',
        linkedin: 'https://linkedin.com/in/janasramkova',
      },
      {
        name: 'Veronika Nováková',
        role: 'Customer Success',
        expertise: 'HR Advisory, Content Writing, Product Testing',
        bio: 'Stejně jako ve svých obrazech, Veronika propojuje lidi, nástroje a smysl.',
        linkedin: 'https://linkedin.com/in/veronikanovakova',
      },
      {
        name: 'Josef Hofman',
        role: 'Sales Partner',
        expertise: 'Relationship Building, Client Acquisition',
        bio: 'Josefův smysl pro směr a disciplínu pochází z kajakářství; bojový duch si nechává pro dojo.',
        linkedin: 'https://linkedin.com/in/josefhofman',
      },
      {
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        expertise: 'Serial Entrepreneur',
        bio: 'Založil a dovedl k úspěšnému exitu Lunchtime (Zomato), Pizzatime (Dáme Jídlo), Foodora a Storyous (Teya).',
        linkedin: 'https://linkedin.com/in/igortreslin',
        isInvestor: true,
      },
    ],
  },
  en: {
    badge: 'Behavera Team',
    title: 'The people behind',
    titleHighlight: 'Echo Pulse',
    subtitle: 'We combine psychology, data science, HR, and AI with real-world business and leadership experience.',
    founderLabel: 'Co-founder',
    investorLabel: 'Investor & Advisor',
    team: [
      {
        name: 'Jiří Valena',
        role: 'CEO',
        expertise: 'Strategic Growth, Sales, Leadership',
        bio: "An amateur hockey player with a goal drive that scores in business too.",
        linkedin: 'https://linkedin.com/in/jirivalena',
      },
      {
        name: 'Igor Kubíček',
        role: 'Head of Product & Co-founder',
        expertise: 'HR Data Analytics, Product Content, Digital Learning',
        bio: 'Can get through 40 books a month and still explain multivariate analysis without giving you a headache.',
        linkedin: 'https://linkedin.com/in/igorkubicek',
        isFounder: true,
      },
      {
        name: 'Dušan Švancara',
        role: 'CTO & Co-founder',
        expertise: 'Tech Development, AI Automation, Data Security',
        bio: 'Thanks to Dušan, everything runs like Swiss clockwork.',
        linkedin: 'https://linkedin.com/in/dusansvancara',
        isFounder: true,
      },
      {
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        expertise: 'Sales, Partnerships, Strategic Growth',
        bio: 'Passionate cyclist who knows exactly how and where Behavera can help the customer most.',
        linkedin: 'https://linkedin.com/in/janasramkova',
      },
      {
        name: 'Veronika Nováková',
        role: 'Customer Success',
        expertise: 'HR Advisory, Content Writing, Product Testing',
        bio: 'Just like in her paintings, Veronika draws a line between people, tools, and purpose.',
        linkedin: 'https://linkedin.com/in/veronikanovakova',
      },
      {
        name: 'Josef Hofman',
        role: 'Sales Partner',
        expertise: 'Relationship Building, Client Acquisition',
        bio: "Josef's sense of direction and sales discipline come from kayaking; fighting he keeps only for the dojo.",
        linkedin: 'https://linkedin.com/in/josefhofman',
      },
      {
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        expertise: 'Serial Entrepreneur',
        bio: 'Founded and led several ventures to successful exit—including Lunchtime (Zomato), Pizzatime (Dáme Jídlo), Foodora, and Storyous (Teya).',
        linkedin: 'https://linkedin.com/in/igortreslin',
        isInvestor: true,
      },
    ],
  },
  de: {
    badge: 'Behavera Team',
    title: 'Die Menschen hinter',
    titleHighlight: 'Echo Pulse',
    subtitle: 'Wir kombinieren Psychologie, Data Science, HR und KI mit echter Geschäfts- und Führungserfahrung.',
    founderLabel: 'Mitgründer',
    investorLabel: 'Investor & Berater',
    team: [
      {
        name: 'Jiří Valena',
        role: 'CEO',
        expertise: 'Strategic Growth, Sales, Leadership',
        bio: 'Ein Amateur-Eishockeyspieler mit einem Zielstrebigkeit, die auch im Business punktet.',
        linkedin: 'https://linkedin.com/in/jirivalena',
      },
      {
        name: 'Igor Kubíček',
        role: 'Head of Product & Co-founder',
        expertise: 'HR Data Analytics, Product Content, Digital Learning',
        bio: 'Liest 40 Bücher im Monat und erklärt multivariate Analysen, ohne dass Ihnen der Kopf raucht.',
        linkedin: 'https://linkedin.com/in/igorkubicek',
        isFounder: true,
      },
      {
        name: 'Dušan Švancara',
        role: 'CTO & Co-founder',
        expertise: 'Tech Development, AI Automation, Data Security',
        bio: 'Dank Dušan läuft alles wie ein Schweizer Uhrwerk.',
        linkedin: 'https://linkedin.com/in/dusansvancara',
        isFounder: true,
      },
      {
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        expertise: 'Sales, Partnerships, Strategic Growth',
        bio: 'Leidenschaftliche Radfahrerin, die genau weiß, wo und wie Behavera dem Kunden am meisten helfen kann.',
        linkedin: 'https://linkedin.com/in/janasramkova',
      },
      {
        name: 'Veronika Nováková',
        role: 'Customer Success',
        expertise: 'HR Advisory, Content Writing, Product Testing',
        bio: 'Wie in ihren Gemälden verbindet Veronika Menschen, Werkzeuge und Zweck.',
        linkedin: 'https://linkedin.com/in/veronikanovakova',
      },
      {
        name: 'Josef Hofman',
        role: 'Sales Partner',
        expertise: 'Relationship Building, Client Acquisition',
        bio: 'Josefs Orientierungssinn und Vertriebsdisziplin stammen vom Kajakfahren; Kampf reserviert er für das Dojo.',
        linkedin: 'https://linkedin.com/in/josefhofman',
      },
      {
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        expertise: 'Serial Entrepreneur',
        bio: 'Gründete und führte mehrere Unternehmen zum erfolgreichen Exit—darunter Lunchtime (Zomato), Pizzatime (Dáme Jídlo), Foodora und Storyous (Teya).',
        linkedin: 'https://linkedin.com/in/igortreslin',
        isInvestor: true,
      },
    ],
  },
};

// Map images to team members
const teamImages: Record<string, string> = {
  'Jiří Valena': jiriImg,
  'Igor Kubíček': igorImg,
  'Dušan Švancara': dusanImg,
  'Jana Šrámková': janaImg,
  'Veronika Nováková': veronikaImg,
  'Josef Hofman': josefImg,
  'Igor Třeslín': igorTreslinImg,
};

export function CoreTeamSection() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="team" className="py-20 md:py-28 bg-gradient-to-b from-brand-background-primary to-brand-background-secondary">
      <div className="container-default">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
            {t.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text-primary mb-4">
            {t.title}{' '}
            <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {t.team.map((member, index) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="group relative bg-white rounded-2xl border border-brand-border hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Founder/Investor Badge */}
              {(member.isFounder || member.isInvestor) && (
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    member.isInvestor 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {member.isInvestor ? t.investorLabel : t.founderLabel}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-56 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 overflow-hidden">
                <img
                  src={teamImages[member.name]}
                  alt={member.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-brand-text-primary">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-brand-primary">
                      {member.role}
                    </p>
                  </div>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-brand-background-secondary hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-primary transition-colors"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <p className="text-xs text-brand-text-muted mb-3 font-medium">
                  {member.expertise}
                </p>
                
                <p className="text-sm text-brand-text-secondary leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Collaboration note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-brand-text-muted mt-12"
        >
          {language === 'cz' 
            ? 'Spolupracujeme také s předními psychology, marketingovými specialisty a lídry z různých oborů.'
            : language === 'de'
            ? 'Wir arbeiten auch mit führenden Psychologen, Marketingspezialisten und Führungskräften aus verschiedenen Bereichen zusammen.'
            : 'We also collaborate with leading psychologists, marketing specialists, and leaders from diverse fields.'
          }
        </motion.p>
      </div>
    </section>
  );
}

export default CoreTeamSection;
