import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';

import jiriImg from '@/assets/team/jiri.webp';
import igorImg from '@/assets/team/igor.webp';
import dusanImg from '@/assets/team/dusan.webp';
import janaImg from '@/assets/team/jana.webp';
import veronikaImg from '@/assets/team/veronika.webp';
import josefImg from '@/assets/team/josef.webp';
import igorTreslinImg from '@/assets/team/igor-treslin.webp';

type TeamMember = {
  name: string;
  role: string;
  image: string;
  founder?: boolean;
};

const TEAM: TeamMember[] = [
  { name: 'Jiří Valena', role: 'CEO', image: jiriImg, founder: true },
  { name: 'Igor Kubíček', role: 'Head of Product, Co-founder', image: igorImg, founder: true },
  { name: 'Dušan Švancara', role: 'CTO, Co-founder', image: dusanImg, founder: true },
  { name: 'Jana Šrámková', role: 'Go-to-Market', image: janaImg },
  { name: 'Veronika Nováková', role: 'Customer Success', image: veronikaImg },
  { name: 'Josef Hofman', role: 'Sales', image: josefImg },
  { name: 'Igor Třeslín', role: 'Investor & Advisor', image: igorTreslinImg },
];

const SECTION_ID = 'about';

const PILLAR_ICONS = [Zap, Target, ShieldCheck] as const;

const translations = {
  cz: {
    badge: 'O nás',
    title: 'Tým za',
    highlight: 'Behaverou',
    subtitle:
      'Malý seniorní tým, který kombinuje zkušenosti z HR, technologií a B2B prodeje. Pomáháme firmám porozumět svým lidem dřív, než je pozdě.',
    story:
      'Pomáháme vedení firem zachytit tiché signály v týmech dřív, než přerostou v fluktuaci, vyhoření nebo výkonový propad. Kombinujeme AI pulse, behaviorální data a jasné akční kroky pro manažery.',
    pillars: [
      { title: 'Rychlost', desc: 'Signál z týmu během minut, ne čtvrtletí.' },
      { title: 'Praktičnost', desc: 'Každý insight má konkrétní doporučení.' },
      { title: 'Důvěra', desc: 'Anonymita a GDPR jako výchozí standard.' },
    ],
    demoCta: 'Domluvit konzultaci',
  },
  en: {
    badge: 'About Us',
    title: 'The Team Behind',
    highlight: 'Behavera',
    subtitle:
      'A compact senior team combining deep expertise in HR, technology, and B2B sales. We help companies understand their people before it\'s too late.',
    story:
      'We help leadership teams detect silent risk signals before they turn into turnover, burnout, or performance drops. We combine AI pulse surveys, behavioral data, and concrete action guidance for managers.',
    pillars: [
      { title: 'Speed', desc: 'Team signal in minutes, not quarters.' },
      { title: 'Practicality', desc: 'Every insight maps to a clear action.' },
      { title: 'Trust', desc: 'Anonymity and GDPR by default.' },
    ],
    demoCta: 'Book a consultation',
  },
  de: {
    badge: 'Über uns',
    title: 'Das Team hinter',
    highlight: 'Behavera',
    subtitle:
      'Ein kompaktes Senior-Team mit Expertise in HR, Technologie und B2B-Vertrieb. Wir helfen Unternehmen, ihre Mitarbeiter besser zu verstehen.',
    story:
      'Wir helfen Führungsteams, stille Risikosignale in Teams frühzeitig zu erkennen, bevor sie zu Fluktuation, Burnout oder Leistungseinbruch werden. Mit AI-Pulse, Verhaltensdaten und klaren Handlungsschritten.',
    pillars: [
      { title: 'Geschwindigkeit', desc: 'Team-Signale in Minuten statt Quartalen.' },
      { title: 'Praktikabilität', desc: 'Jeder Insight führt zu klaren Maßnahmen.' },
      { title: 'Vertrauen', desc: 'Anonymität und DSGVO als Standard.' },
    ],
    demoCta: 'Beratung buchen',
  },
};

/* ── Stagger children animation ────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function AboutUnfoldSection() {
  const { language } = useLanguage();
  const { openBooking } = useModal();
  const text = translations[language] || translations.en;

  return (
    <section id={SECTION_ID} className="section-spacing bg-white">
      <div className="container-default">

        {/* ── Header (centered, matching other sections) ────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-20"
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

        {/* ── Mission statement ─────────────────────────────────── */}
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

        {/* ── 3 Pillars ────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-3 gap-4 md:gap-6 mb-16 md:mb-20"
        >
          {PILLAR_ICONS.map((Icon, index) => {
            const pillar = text.pillars[index];
            return (
              <motion.div
                key={pillar.title}
                variants={itemVariants}
                className="group rounded-2xl border border-brand-border bg-brand-background-secondary/40 p-6 md:p-7 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/[0.08] flex items-center justify-center mb-4 group-hover:bg-brand-primary/[0.14] transition-colors">
                  <Icon className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-base font-bold text-brand-text-primary mb-1.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-brand-text-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Team Grid ────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10 max-w-4xl mx-auto mb-12 md:mb-16"
        >
          {TEAM.map((member) => (
            <motion.div
              key={member.name}
              variants={itemVariants}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-3">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-brand-border group-hover:ring-brand-accent/50 transition-all duration-300 shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                {member.founder && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-brand-primary text-[9px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
                    Co-founder
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold text-brand-text-primary leading-tight">
                {member.name}
              </div>
              <div className="text-xs text-brand-text-muted mt-0.5">
                {member.role}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CTA ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Button
            onClick={() => openBooking('about_unfold_demo')}
            size="lg"
            className="h-12 px-8 text-base"
          >
            {text.demoCta}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
