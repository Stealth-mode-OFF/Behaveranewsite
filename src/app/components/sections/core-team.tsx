import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { Linkedin } from 'lucide-react';

// Team member images from src/assets
import igorImg from '@/assets/imgi_23_63f4a99d1dc162409a74256f_igor.webp';
import dusanImg from '@/assets/imgi_24_63f4ab8c6a107ed7cce0bcba_dusan.webp';
import janaImg from '@/assets/imgi_25_686d2af4b3022512644e32a4_jana.webp';
import veronikaImg from '@/assets/imgi_26_686d156a1cb983f39a6e470a_veru.webp';
import josefImg from '@/assets/imgi_27_68e777c37c3e0ee92d4a6b2f_Pepa.webp';
import igorTreslinImg from '@/assets/imgi_28_686d181e2536dd17ff0dda8c_Untitled design (30).webp';
import jiriImg from '@/assets/imgi_22_68d3e452ae5a2da9698ea094_Untitled design (45) (1).webp';

interface TeamMember {
  name: string;
  role: string;
  focus: string;
  bio: string;
  linkedin?: string;
  isFounder?: boolean;
  isInvestor?: boolean;
}

const translations = {
  cz: {
    badge: 'Náš tým',
    title: 'Lidé za',
    titleHighlight: 'Echo Pulse',
    subtitle: 'Psychologie × Data × AI. Zkušenosti z reálného byznysu.',
    founderLabel: 'Co-founder',
    investorLabel: 'Investor',
    team: [
      {
        name: 'Jiří Valena',
        role: 'CEO',
        focus: 'Growth · Sales · Leadership',
        bio: 'Ex-hockey. Teď skóruje v B2B.',
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
      },
      {
        name: 'Igor Kubíček',
        role: 'Head of Product',
        focus: 'HR Analytics · Digital Learning',
        bio: '40 knih/měsíc. Vysvětlí i multivarianty.',
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        isFounder: true,
      },
      {
        name: 'Dušan Švancara',
        role: 'CTO',
        focus: 'AI · Security · Infrastructure',
        bio: 'Systémy běží. Vždy.',
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        isFounder: true,
      },
      {
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        focus: 'Partnerships · Strategy',
        bio: 'Najde cestu k zákazníkovi. Na kole i v dealu.',
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
      },
      {
        name: 'Veronika Nováková',
        role: 'Customer Success',
        focus: 'HR Advisory · Content',
        bio: 'Propojuje lidi s produktem.',
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
      },
      {
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise · Relationships',
        bio: 'Kajakář. Směr drží i v jednání.',
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
      },
      {
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        bio: '4× exit: Zomato, Dáme Jídlo, Foodora, Teya.',
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
        isInvestor: true,
      },
    ],
  },
  en: {
    badge: 'Our Team',
    title: 'The people behind',
    titleHighlight: 'Echo Pulse',
    subtitle: 'Psychology × Data × AI. Real business experience.',
    founderLabel: 'Co-founder',
    investorLabel: 'Investor',
    team: [
      {
        name: 'Jiří Valena',
        role: 'CEO',
        focus: 'Growth · Sales · Leadership',
        bio: 'Ex-hockey player. Now scores in B2B.',
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
      },
      {
        name: 'Igor Kubíček',
        role: 'Head of Product',
        focus: 'HR Analytics · Digital Learning',
        bio: '40 books/month. Makes stats simple.',
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        isFounder: true,
      },
      {
        name: 'Dušan Švancara',
        role: 'CTO',
        focus: 'AI · Security · Infrastructure',
        bio: 'Systems run. Always.',
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        isFounder: true,
      },
      {
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        focus: 'Partnerships · Strategy',
        bio: 'Finds the path. On bike and in deals.',
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
      },
      {
        name: 'Veronika Nováková',
        role: 'Customer Success',
        focus: 'HR Advisory · Content',
        bio: 'Connects people with product.',
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
      },
      {
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise · Relationships',
        bio: 'Kayaker. Keeps direction in deals too.',
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
      },
      {
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        bio: '4× exit: Zomato, Dáme Jídlo, Foodora, Teya.',
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
        isInvestor: true,
      },
    ],
  },
  de: {
    badge: 'Unser Team',
    title: 'Die Menschen hinter',
    titleHighlight: 'Echo Pulse',
    subtitle: 'Psychologie × Daten × KI. Echte Geschäftserfahrung.',
    founderLabel: 'Mitgründer',
    investorLabel: 'Investor',
    team: [
      {
        name: 'Jiří Valena',
        role: 'CEO',
        focus: 'Growth · Sales · Leadership',
        bio: 'Ex-Eishockey. Trifft jetzt im B2B.',
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
      },
      {
        name: 'Igor Kubíček',
        role: 'Head of Product',
        focus: 'HR Analytics · Digital Learning',
        bio: '40 Bücher/Monat. Macht Statistik einfach.',
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        isFounder: true,
      },
      {
        name: 'Dušan Švancara',
        role: 'CTO',
        focus: 'AI · Security · Infrastructure',
        bio: 'Systeme laufen. Immer.',
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        isFounder: true,
      },
      {
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        focus: 'Partnerships · Strategy',
        bio: 'Findet den Weg. Auf dem Rad und im Deal.',
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
      },
      {
        name: 'Veronika Nováková',
        role: 'Customer Success',
        focus: 'HR Advisory · Content',
        bio: 'Verbindet Menschen mit Produkt.',
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
      },
      {
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise · Relationships',
        bio: 'Kajakfahrer. Hält Kurs auch im Vertrieb.',
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
      },
      {
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        bio: '4× Exit: Zomato, Dáme Jídlo, Foodora, Teya.',
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
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

  // Split team: founders first, then core team, then investor
  const founders = t.team.filter(m => m.isFounder);
  const coreTeam = t.team.filter(m => !m.isFounder && !m.isInvestor);
  const investors = t.team.filter(m => m.isInvestor);

  return (
    <section id="team" className="py-24 md:py-32 bg-brand-background-primary">
      <div className="container-default">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-text-primary text-white text-xs font-medium tracking-wide uppercase mb-6">
            {t.badge}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-4 tracking-tight">
            {t.title}{' '}
            <span className="text-brand-primary">
              {t.titleHighlight}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-brand-text-secondary max-w-xl mx-auto font-light">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Leadership Row - CEO + Founders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6"
        >
          {/* CEO - First position */}
          {coreTeam.filter(m => m.role === 'CEO').map((member) => (
            <TeamCard key={member.name} member={member} size="large" founderLabel={t.founderLabel} investorLabel={t.investorLabel} />
          ))}
          {/* Co-founders */}
          {founders.map((member) => (
            <TeamCard key={member.name} member={member} size="large" founderLabel={t.founderLabel} investorLabel={t.investorLabel} />
          ))}
        </motion.div>

        {/* Core Team Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5"
        >
          {coreTeam.filter(m => m.role !== 'CEO').map((member) => (
            <TeamCard key={member.name} member={member} size="medium" founderLabel={t.founderLabel} investorLabel={t.investorLabel} />
          ))}
          {/* Investor at the end */}
          {investors.map((member) => (
            <TeamCard key={member.name} member={member} size="medium" founderLabel={t.founderLabel} investorLabel={t.investorLabel} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

interface TeamCardProps {
  member: TeamMember;
  size: 'large' | 'medium';
  founderLabel: string;
  investorLabel: string;
}

function TeamCard({ member, size, founderLabel, investorLabel }: TeamCardProps) {
  const isLarge = size === 'large';
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-brand-border/50 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-300"
    >
      {/* Badge */}
      {(member.isFounder || member.isInvestor) && (
        <div className="absolute top-3 left-3 z-20">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${
            member.isInvestor 
              ? 'bg-amber-500/90 text-white' 
              : 'bg-brand-primary/90 text-white'
          }`}>
            {member.isInvestor ? investorLabel : founderLabel}
          </span>
        </div>
      )}

      {/* LinkedIn Icon - Top Right */}
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm text-brand-text-muted hover:text-brand-primary hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={`${member.name} LinkedIn`}
        >
          <Linkedin className="w-4 h-4" />
        </a>
      )}

      {/* Image Container - Unified square aspect ratio for all cards */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-background-secondary to-brand-primary/5 aspect-square">
        <img
          src={teamImages[member.name]}
          alt={member.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
          style={{ aspectRatio: '1 / 1', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
        />
        {/* Bottom Gradient for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Content Overlay - On image */}
        <div className={`absolute inset-x-0 bottom-0 ${isLarge ? 'p-5 md:p-6' : 'p-3 md:p-4'}`}>
          <h3 className={`font-bold text-white leading-tight ${isLarge ? 'text-xl md:text-2xl' : 'text-sm md:text-base'}`}>
            {member.name}
          </h3>
          <p className={`font-medium text-white/90 mt-0.5 ${isLarge ? 'text-sm md:text-base' : 'text-xs'}`}>
            {member.role}
          </p>
          <p className={`text-white/60 mt-1 ${isLarge ? 'text-xs md:text-sm' : 'text-[10px] md:text-xs hidden md:block'}`}>
            {member.focus}
          </p>
          
          {/* Bio - visible on large cards */}
          {isLarge && (
            <p className="text-sm text-white/70 mt-3 leading-relaxed hidden md:block">
              {member.bio}
            </p>
          )}
        </div>
      </div>
      
      {/* Bio for medium cards - below image on mobile */}
      {!isLarge && (
        <div className="p-3 bg-white md:hidden">
          <p className="text-[11px] text-brand-text-secondary leading-relaxed line-clamp-2">
            {member.bio}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default CoreTeamSection;
