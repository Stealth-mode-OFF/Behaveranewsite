import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown, ShieldCheck, Brain, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useLanguage } from '@/app/contexts/language-context';
import { useModal } from '@/app/contexts/modal-context';
import { HOME_SECTION_IDS, ROUTES } from '@/app/config/routes';

import josefImg from '@/assets/team/josef.webp';
import veronikaImg from '@/assets/team/veronika.webp';
import jiriImg from '@/assets/team/jiri.webp';
import janaImg from '@/assets/team/jana.webp';

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

const TEAM: TeamMember[] = [
  { name: 'Josef Hofman', role: 'Founder & Product', image: josefImg },
  { name: 'Jiří', role: 'CEO & Strategy', image: jiriImg },
  { name: 'Veronika', role: 'Customer Success', image: veronikaImg },
  { name: 'Jana', role: 'Operations', image: janaImg },
];

export function AboutUnfoldSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const { openBooking } = useModal();

  const text = {
    cz: {
      badge: 'Poznejte nás',
      title: 'About Behavera',
      highlight: 'v jedné vrstvě navíc',
      subtitle:
        'Nechtěli jsme další korporátní stránku. Tohle je živá sekce, která se rozbalí jen když ji opravdu chcete vidět.',
      unfold: 'Rozbalit About',
      fold: 'Sbalit sekci',
      storyTitle: 'Proč Behavera vznikla',
      story:
        'Pomáháme vedení firem zachytit tiché signály v týmech dřív, než přerostou v fluktuaci, vyhoření nebo výkonový propad. Kombinujeme AI pulse, behaviorální data a jasné akční kroky pro manažery.',
      pillars: [
        { title: 'Rychlost', desc: 'Signál z týmu během minut, ne čtvrtletí.' },
        { title: 'Praktičnost', desc: 'Každý insight má konkrétní doporučení.' },
        { title: 'Důvěra', desc: 'Anonymita a GDPR jako výchozí standard.' },
      ],
      teamTitle: 'Core tým',
      teamSubtitle: 'Malý seniorní tým, který dodává rychle a kvalitně.',
      teamCta: 'Celý profil týmu',
      demoCta: 'Domluvit konzultaci',
    },
    en: {
      badge: 'Meet the Team',
      title: 'About Behavera',
      highlight: 'unfolded on demand',
      subtitle:
        'No disconnected “about page” feeling. This section unfolds only when you want it, while staying inside the main experience.',
      unfold: 'Unfold About',
      fold: 'Fold section',
      storyTitle: 'Why Behavera exists',
      story:
        'We help leadership teams detect silent team risk signals before they turn into turnover, burnout, or performance drops. We combine AI pulse, behavioral insight, and concrete action guidance.',
      pillars: [
        { title: 'Speed', desc: 'Team signal in minutes, not quarters.' },
        { title: 'Practicality', desc: 'Every insight maps to a clear action.' },
        { title: 'Trust', desc: 'Anonymity and GDPR by default.' },
      ],
      teamTitle: 'Core team',
      teamSubtitle: 'A compact senior team shipping fast and clean.',
      teamCta: 'Full team profile',
      demoCta: 'Book a consultation',
    },
    de: {
      badge: 'Lernen Sie uns kennen',
      title: 'Über Behavera',
      highlight: 'bei Bedarf aufklappbar',
      subtitle:
        'Kein harter Seitenwechsel. Diese Sektion entfaltet sich direkt auf der Startseite, wenn Sie mehr Kontext möchten.',
      unfold: 'About aufklappen',
      fold: 'Sektion zuklappen',
      storyTitle: 'Warum Behavera entstanden ist',
      story:
        'Wir helfen Führungsteams, stille Risikosignale in Teams früh zu erkennen, bevor sie zu Fluktuation, Burnout oder Leistungseinbruch werden. Mit AI-Pulse, Verhaltensdaten und klaren Handlungsschritten.',
      pillars: [
        { title: 'Geschwindigkeit', desc: 'Team-Signale in Minuten statt Quartalen.' },
        { title: 'Praktikabilität', desc: 'Jeder Insight führt zu klaren Maßnahmen.' },
        { title: 'Vertrauen', desc: 'Anonymität und DSGVO als Standard.' },
      ],
      teamTitle: 'Kernteam',
      teamSubtitle: 'Ein kompaktes Senior-Team mit hoher Liefergeschwindigkeit.',
      teamCta: 'Komplettes Teamprofil',
      demoCta: 'Beratung buchen',
    },
  }[language] || {
    badge: 'Meet the Team',
    title: 'About Behavera',
    highlight: 'unfolded on demand',
    subtitle:
      'No disconnected “about page” feeling. This section unfolds only when you want it, while staying inside the main experience.',
    unfold: 'Unfold About',
    fold: 'Fold section',
    storyTitle: 'Why Behavera exists',
    story:
      'We help leadership teams detect silent team risk signals before they turn into turnover, burnout, or performance drops. We combine AI pulse, behavioral insight, and concrete action guidance.',
    pillars: [
      { title: 'Speed', desc: 'Team signal in minutes, not quarters.' },
      { title: 'Practicality', desc: 'Every insight maps to a clear action.' },
      { title: 'Trust', desc: 'Anonymity and GDPR by default.' },
    ],
    teamTitle: 'Core team',
    teamSubtitle: 'A compact senior team shipping fast and clean.',
    teamCta: 'Full team profile',
    demoCta: 'Book a consultation',
  };

  useEffect(() => {
    const openAbout = () => {
      setIsOpen(true);
      const el = document.getElementById(HOME_SECTION_IDS.about);
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 84;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    window.addEventListener('behavera:about:open', openAbout);
    return () => window.removeEventListener('behavera:about:open', openAbout);
  }, []);

  return (
    <section id={HOME_SECTION_IDS.about} className="section-spacing bg-gradient-to-b from-white via-brand-background-secondary/25 to-white">
      <div className="container-default max-w-6xl">
        <div className="rounded-3xl border border-brand-border/60 bg-white shadow-[0_24px_60px_-32px_rgba(10,13,23,0.35)] overflow-hidden">
          <div className="px-6 md:px-10 pt-8 md:pt-10 pb-7 md:pb-8 relative">
            <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-brand-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-36 w-36 rounded-full bg-brand-accent/15 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-brand-primary/[0.04] px-3 py-1.5 mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-brand-primary">{text.badge}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-text-primary leading-tight">
                  {text.title}{' '}
                  <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                    {text.highlight}
                  </span>
                </h2>
                <p className="mt-3 text-brand-text-secondary max-w-2xl leading-relaxed">{text.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full border border-brand-border bg-white hover:border-brand-primary/40 hover:text-brand-primary transition-colors text-sm font-semibold"
              >
                {isOpen ? text.fold : text.unfold}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="about-unfold-content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden border-t border-brand-border/60"
              >
                <div className="px-6 md:px-10 py-8 md:py-10 grid lg:grid-cols-[1.15fr_1fr] gap-8 md:gap-10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-brand-text-primary mb-3">{text.storyTitle}</h3>
                    <p className="text-brand-text-secondary leading-relaxed mb-6">{text.story}</p>

                    <div className="grid sm:grid-cols-3 gap-3 mb-7">
                      {[ShieldCheck, Brain, Users].map((Icon, index) => {
                        const pillar = text.pillars[index];
                        return (
                          <div key={pillar.title} className="rounded-xl border border-brand-border/60 bg-brand-background-secondary/45 p-4">
                            <Icon className="w-4 h-4 text-brand-primary mb-2" />
                            <div className="text-sm font-semibold text-brand-text-primary mb-1">{pillar.title}</div>
                            <p className="text-xs text-brand-text-muted leading-relaxed">{pillar.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button onClick={() => openBooking('about_unfold_demo')} className="h-10 px-5">
                        {text.demoCta}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                      <Link
                        to={ROUTES.team}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
                      >
                        {text.teamCta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-[0.12em] font-semibold text-brand-text-muted mb-2">{text.teamTitle}</h4>
                    <p className="text-sm text-brand-text-secondary mb-4">{text.teamSubtitle}</p>

                    <div className="grid grid-cols-2 gap-3">
                      {TEAM.map((member) => (
                        <div key={member.name} className="group rounded-xl border border-brand-border/60 bg-white p-3 hover:border-brand-primary/30 transition-colors">
                          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-brand-background-secondary mb-2.5">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="text-sm font-semibold text-brand-text-primary leading-tight">{member.name}</div>
                          <div className="text-xs text-brand-text-muted mt-1">{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
