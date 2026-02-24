/**
 * AboutUnfoldSection — landing page team overview
 * Leadership row (CEO, Head of Product, CTO) always visible.
 * Remaining team revealed via "Show more" toggle.
 * 6 members total. Only Igor K and Dušan have the co-founder badge.
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Linkedin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';

import jiriImg from '@/assets/team/jiri.webp';
import igorImg from '@/assets/team/igor.webp';
import dusanImg from '@/assets/team/dusan.webp';
import janaImg from '@/assets/team/jana.webp';
import veronikaImg from '@/assets/team/veronika.webp';
import josefImg from '@/assets/team/josef.webp';

/* ── Types ────────────────────────────────────────────────── */
type TeamMember = {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  founder?: boolean;
};

/* ── Team data ────────────────────────────────────────────── */
const LEADERSHIP: TeamMember[] = [
  { name: 'Jiří Valena', role: 'CEO', image: jiriImg, linkedin: 'https://www.linkedin.com/in/valenajiri/' },
  { name: 'Igor Kubíček', role: 'Head of Product', image: igorImg, linkedin: 'https://www.linkedin.com/in/igorkubicek/', founder: true },
  { name: 'Dušan Švancara', role: 'CTO', image: dusanImg, linkedin: 'https://www.linkedin.com/in/dusan-svancara/', founder: true },
];

const REST_OF_TEAM: TeamMember[] = [
  { name: 'Jana Šrámková', role: 'Go-to-Market', image: janaImg, linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/' },
  { name: 'Veronika Nováková', role: 'Customer Success', image: veronikaImg, linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/' },
  { name: 'Josef Hofman', role: 'Sales', image: josefImg, linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/' },
];

/* ── Short bios per language ──────────────────────────────── */
const bios: Record<string, Record<string, string>> = {
  cz: {
    'Jiří Valena': 'Ex-hokejista. Teď skóruje v B2B.',
    'Igor Kubíček': '40 knih/měsíc. Vysvětlí i multivarianty.',
    'Dušan Švancara': 'Systémy běží. Vždy.',
    'Jana Šrámková': 'Najde cestu k zákazníkovi. Na kole i v dealu.',
    'Veronika Nováková': 'Propojuje lidi s produktem.',
    'Josef Hofman': 'Kajakář. Směr drží i v jednání.',
  },
  en: {
    'Jiří Valena': 'Ex-hockey player. Now scores in B2B.',
    'Igor Kubíček': '40 books/month. Makes stats simple.',
    'Dušan Švancara': 'Systems run. Always.',
    'Jana Šrámková': 'Finds the path. On bike and in deals.',
    'Veronika Nováková': 'Connects people with product.',
    'Josef Hofman': 'Kayaker. Keeps direction in deals too.',
  },
  de: {
    'Jiří Valena': 'Ex-Eishockeyspieler. Punktet jetzt im B2B.',
    'Igor Kubíček': '40 Bücher/Monat. Erklärt auch Multivarianten.',
    'Dušan Švancara': 'Systeme laufen. Immer.',
    'Jana Šrámková': 'Findet den Weg. Auf dem Rad und im Deal.',
    'Veronika Nováková': 'Verbindet Menschen mit dem Produkt.',
    'Josef Hofman': 'Kajakfahrer. Hält auch im Deal den Kurs.',
  },
};

const SECTION_ID = 'about';

/* ── Translations ─────────────────────────────────────────── */
const translations = {
  cz: {
    badge: 'O nás',
    title: 'Tým za',
    highlight: 'Behaverou',
    subtitle:
      'Malý seniorní tým, který kombinuje zkušenosti z HR, technologií a B2B prodeje. Pomáháme firmám porozumět svým lidem dřív, než je pozdě.',
    story:
      'Pomáháme vedení firem zachytit tiché signály v týmech dřív, než přerostou ve fluktuaci, vyhoření nebo výkonový propad. Kombinujeme AI pulse, behaviorální data a jasné akční kroky pro manažery.',
    showMore: 'Zobrazit celý tým',
    showLess: 'Skrýt',
    demoCta: 'Domluvit konzultaci',
    founderBadge: 'Co-founder',
  },
  en: {
    badge: 'About Us',
    title: 'The Team Behind',
    highlight: 'Behavera',
    subtitle:
      "A compact senior team combining deep expertise in HR, technology, and B2B sales. We help companies understand their people before it's too late.",
    story:
      'We help leadership teams detect silent risk signals before they turn into turnover, burnout, or performance drops. We combine AI pulse surveys, behavioral data, and concrete action guidance for managers.',
    showMore: 'Show full team',
    showLess: 'Show less',
    demoCta: 'Book a consultation',
    founderBadge: 'Co-founder',
  },
  de: {
    badge: 'Über uns',
    title: 'Das Team hinter',
    highlight: 'Behavera',
    subtitle:
      'Ein kompaktes Senior-Team mit Expertise in HR, Technologie und B2B-Vertrieb. Wir helfen Unternehmen, ihre Mitarbeiter besser zu verstehen.',
    story:
      'Wir helfen Führungsteams, stille Risikosignale frühzeitig zu erkennen, bevor sie zu Fluktuation, Burnout oder Leistungseinbruch werden. Mit AI-Pulse, Verhaltensdaten und klaren Handlungsschritten.',
    showMore: 'Ganzes Team anzeigen',
    showLess: 'Weniger anzeigen',
    demoCta: 'Beratung buchen',
    founderBadge: 'Mitgründer',
  },
};

/* ── Animations ───────────────────────────────────────────── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ── Member card ──────────────────────────────────────────── */
function MemberCard({
  member,
  bio,
  founderLabel,
}: {
  member: TeamMember;
  bio: string;
  founderLabel: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex flex-col items-center text-center p-5 md:p-6 rounded-2xl border bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-brand-border/30 hover:border-brand-primary/30 hover:shadow-brand-primary/5"
    >
      {/* Photo */}
      <div className="relative mb-4">
        <div className="w-22 h-22 md:w-24 md:h-24 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white transition-all duration-300 ring-brand-border/30 group-hover:ring-brand-primary/50">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
          />
        </div>
        {member.founder && (
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-brand-primary text-[9px] font-bold uppercase tracking-wider text-white whitespace-nowrap shadow-sm">
            {founderLabel}
          </span>
        )}
      </div>

      {/* Info */}
      <h3 className="text-sm font-bold text-brand-text-primary leading-tight">
        {member.name}
      </h3>
      <p className="text-xs font-semibold mt-0.5 text-brand-primary">
        {member.role}
      </p>
      {bio && (
        <p className="text-[11px] text-brand-text-muted mt-2 leading-relaxed italic">
          {bio}
        </p>
      )}

      {/* LinkedIn */}
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 p-1.5 rounded-lg text-brand-text-muted/50 hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
        aria-label={`${member.name} LinkedIn`}
      >
        <Linkedin className="w-3.5 h-3.5" />
      </a>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────── */
export function AboutUnfoldSection() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const text = translations[language] || translations.en;
  const langBios = bios[language] || bios.en;
  const [expanded, setExpanded] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    if (expanded && gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setExpanded((v) => !v);
  };

  return (
    <section id={SECTION_ID} className="section-spacing bg-white">
      <div className="container-default">

        {/* ── Header ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[11px] font-bold uppercase tracking-[0.15em] mb-6 border border-brand-border">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
            {text.badge}
          </div>

          <h2 className="text-h2 text-brand-text-primary mb-4">
            {text.title}{' '}
            <span className="bg-gradient-to-r from-brand-accent to-brand-primary bg-clip-text text-transparent">
              {text.highlight}
            </span>
          </h2>

          <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto leading-relaxed">
            {text.subtitle}
          </p>
        </motion.div>

        {/* ── Mission statement ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto mb-14 md:mb-16"
        >
          <div className="absolute -left-3 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-brand-accent to-brand-primary" />
          <p className="pl-6 text-lg md:text-xl text-brand-text-secondary leading-relaxed italic">
            {text.story}
          </p>
        </motion.div>

        {/* ── Leadership row (always visible) ──────────────── */}
        <div ref={gridRef}>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 max-w-3xl mx-auto mb-4"
          >
            {LEADERSHIP.map((m) => (
              <MemberCard
                key={m.name}
                member={m}
                bio={langBios[m.name] || ''}
                founderLabel={text.founderBadge}
              />
            ))}
          </motion.div>
        </div>

        {/* ── Expandable rest of team ─────────────────────── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="rest-team"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 max-w-3xl mx-auto mt-5"
              >
                {REST_OF_TEAM.map((m) => (
                  <MemberCard
                    key={m.name}
                    member={m}
                    bio={langBios[m.name] || ''}
                    founderLabel={text.founderBadge}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Show more / less toggle ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mt-8 mb-12"
        >
          <button
            onClick={toggleExpand}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-brand-primary bg-brand-primary/[0.06] hover:bg-brand-primary/[0.12] border border-brand-primary/20 hover:border-brand-primary/40 transition-all duration-200 cursor-pointer"
          >
            {expanded ? text.showLess : text.showMore}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        </motion.div>

        {/* ── CTA ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={() => openBooking('about_unfold_demo')}
          >
            {text.demoCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
