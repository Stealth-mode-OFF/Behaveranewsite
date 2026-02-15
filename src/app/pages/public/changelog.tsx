import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { useSEO } from '@/app/hooks/useSEO';
import { SITE_ORIGIN } from '@/lib/urls';
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Brain, 
  BarChart3, 
  Users,
  ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  title: string;
  description: string;
  changes: string[];
  icon: ReactNode;
}

const translations = {
  cz: {
    backHome: 'Zpět domů',
    badge: 'Co je nového',
    title: 'Changelog',
    subtitle: 'Sledujte vývoj Echo Pulse. Pravidelné aktualizace a nové funkce.',
    newBadge: 'Nové',
    improvementBadge: 'Vylepšení',
    fixBadge: 'Opravy',
    entries: [
      {
        version: '2.4.0',
        date: 'Červen 2025',
        type: 'major',
        title: 'AI Coaching Companion',
        description: 'Nový AI asistent pro personalizované koučování manažerů na základě jejich behaviorálních dat.',
        changes: [
          'AI doporučení pro rozvoj leadershipu',
          'Personalizované akční plány',
          'Integrace s 1:1 schůzkami',
          'Real-time feedback loop',
        ],
        icon: <Brain className="w-5 h-5" />,
      },
      {
        version: '2.3.0',
        date: 'Květen 2025',
        type: 'major',
        title: 'Prediktivní Attrition Model',
        description: 'Predikujte riziko odchodu klíčových zaměstnanců na základě dlouhodobých trendů v datech.',
        changes: [
          'Risk score pro každý tým',
          'Faktory ovlivňující retenci',
          'Automatické alerty pro HR',
          'Integrace s Slack/Teams',
        ],
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        version: '2.2.0',
        date: 'Duben 2025',
        type: 'minor',
        title: 'Team Dynamics Dashboard',
        description: 'Nový pohled na dynamiku týmu a kolaboraci mezi členy.',
        changes: [
          'Vizualizace týmových interakcí',
          'Identifikace silos',
          'Collaboration health score',
          'Export do PDF reportů',
        ],
        icon: <Users className="w-5 h-5" />,
      },
      {
        version: '2.1.0',
        date: 'Březen 2025',
        type: 'minor',
        title: 'Enhanced Security & GDPR',
        description: 'Rozšířené bezpečnostní funkce a plná shoda s GDPR.',
        changes: [
          'Rozšířené šifrování a bezpečnostní audit',
          'Šifrování end-to-end',
          'Automatická anonymizace dat',
          'Right to be forgotten workflow',
        ],
        icon: <Shield className="w-5 h-5" />,
      },
      {
        version: '2.0.0',
        date: 'Únor 2025',
        type: 'major',
        title: 'Echo Pulse 2.0 Launch',
        description: 'Kompletně přepracovaná platforma s novým UI a AI capabilities.',
        changes: [
          'Nový moderní dashboard',
          'AI-powered insights',
          'Mobile-first responsive design',
          'Rychlost načítání 2x rychlejší',
        ],
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        version: '1.9.0',
        date: 'Leden 2025',
        type: 'minor',
        title: 'Performance Optimizations',
        description: 'Významné zrychlení platformy a snížení doby načítání.',
        changes: [
          'Lazy loading komponent',
          'Optimalizované API dotazy',
          'CDN pro statické soubory',
          'Komprese obrázků',
        ],
        icon: <Zap className="w-5 h-5" />,
      },
    ],
  },
  en: {
    backHome: 'Back home',
    badge: "What's new",
    title: 'Changelog',
    subtitle: 'Follow Echo Pulse development. Regular updates and new features.',
    newBadge: 'New',
    improvementBadge: 'Improvement',
    fixBadge: 'Fixes',
    entries: [
      {
        version: '2.4.0',
        date: 'June 2025',
        type: 'major',
        title: 'AI Coaching Companion',
        description: 'New AI assistant for personalized manager coaching based on their behavioral data.',
        changes: [
          'AI recommendations for leadership development',
          'Personalized action plans',
          'Integration with 1:1 meetings',
          'Real-time feedback loop',
        ],
        icon: <Brain className="w-5 h-5" />,
      },
      {
        version: '2.3.0',
        date: 'May 2025',
        type: 'major',
        title: 'Predictive Attrition Model',
        description: 'Predict key employee departure risk based on long-term data trends.',
        changes: [
          'Risk score for each team',
          'Factors affecting retention',
          'Automatic alerts for HR',
          'Slack/Teams integration',
        ],
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        version: '2.2.0',
        date: 'April 2025',
        type: 'minor',
        title: 'Team Dynamics Dashboard',
        description: 'New view of team dynamics and collaboration between members.',
        changes: [
          'Visualization of team interactions',
          'Silo identification',
          'Collaboration health score',
          'Export to PDF reports',
        ],
        icon: <Users className="w-5 h-5" />,
      },
      {
        version: '2.1.0',
        date: 'March 2025',
        type: 'minor',
        title: 'Enhanced Security & GDPR',
        description: 'Extended security features and full GDPR compliance.',
        changes: [
          'Extended encryption and security audit',
          'End-to-end encryption',
          'Automatic data anonymization',
          'Right to be forgotten workflow',
        ],
        icon: <Shield className="w-5 h-5" />,
      },
      {
        version: '2.0.0',
        date: 'February 2025',
        type: 'major',
        title: 'Echo Pulse 2.0 Launch',
        description: 'Completely redesigned platform with new UI and AI capabilities.',
        changes: [
          'New modern dashboard',
          'AI-powered insights',
          'Mobile-first responsive design',
          '2x faster loading speed',
        ],
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        version: '1.9.0',
        date: 'January 2025',
        type: 'minor',
        title: 'Performance Optimizations',
        description: 'Significant platform speed improvements and reduced loading times.',
        changes: [
          'Lazy loading components',
          'Optimized API queries',
          'CDN for static files',
          'Image compression',
        ],
        icon: <Zap className="w-5 h-5" />,
      },
    ],
  },
  de: {
    backHome: 'Zurück zur Startseite',
    badge: 'Was gibt es Neues',
    title: 'Changelog',
    subtitle: 'Verfolgen Sie die Entwicklung von Echo Pulse. Regelmäßige Updates und neue Funktionen.',
    newBadge: 'Neu',
    improvementBadge: 'Verbesserung',
    fixBadge: 'Korrekturen',
    entries: [
      {
        version: '2.4.0',
        date: 'Juni 2025',
        type: 'major',
        title: 'AI Coaching Companion',
        description: 'Neuer KI-Assistent für personalisiertes Manager-Coaching basierend auf Verhaltensdaten.',
        changes: [
          'KI-Empfehlungen für Leadership-Entwicklung',
          'Personalisierte Aktionspläne',
          'Integration mit 1:1-Meetings',
          'Echtzeit-Feedback-Loop',
        ],
        icon: <Brain className="w-5 h-5" />,
      },
      {
        version: '2.3.0',
        date: 'Mai 2025',
        type: 'major',
        title: 'Prädiktives Attrition-Modell',
        description: 'Vorhersage des Abgangsrisikos von Schlüsselmitarbeitern basierend auf langfristigen Datentrends.',
        changes: [
          'Risiko-Score für jedes Team',
          'Faktoren, die die Bindung beeinflussen',
          'Automatische Benachrichtigungen für HR',
          'Slack/Teams-Integration',
        ],
        icon: <BarChart3 className="w-5 h-5" />,
      },
      {
        version: '2.2.0',
        date: 'April 2025',
        type: 'minor',
        title: 'Team Dynamics Dashboard',
        description: 'Neue Ansicht der Teamdynamik und Zusammenarbeit zwischen Mitgliedern.',
        changes: [
          'Visualisierung von Teaminteraktionen',
          'Silo-Identifikation',
          'Collaboration Health Score',
          'Export in PDF-Berichte',
        ],
        icon: <Users className="w-5 h-5" />,
      },
      {
        version: '2.1.0',
        date: 'März 2025',
        type: 'minor',
        title: 'Erweiterte Sicherheit & DSGVO',
        description: 'Erweiterte Sicherheitsfunktionen und vollständige DSGVO-Konformität.',
        changes: [
          'Erweitertes Sicherheitsaudit und Verschlüsselung',
          'Ende-zu-Ende-Verschlüsselung',
          'Automatische Datenanonymisierung',
          'Recht auf Vergessenwerden Workflow',
        ],
        icon: <Shield className="w-5 h-5" />,
      },
      {
        version: '2.0.0',
        date: 'Februar 2025',
        type: 'major',
        title: 'Echo Pulse 2.0 Launch',
        description: 'Komplett neu gestaltete Plattform mit neuem UI und KI-Funktionen.',
        changes: [
          'Neues modernes Dashboard',
          'KI-gestützte Insights',
          'Mobile-first responsive Design',
          '2x schnellere Ladegeschwindigkeit',
        ],
        icon: <Sparkles className="w-5 h-5" />,
      },
      {
        version: '1.9.0',
        date: 'Januar 2025',
        type: 'minor',
        title: 'Performance-Optimierungen',
        description: 'Signifikante Plattform-Geschwindigkeitsverbesserungen und reduzierte Ladezeiten.',
        changes: [
          'Lazy Loading von Komponenten',
          'Optimierte API-Abfragen',
          'CDN für statische Dateien',
          'Bildkomprimierung',
        ],
        icon: <Zap className="w-5 h-5" />,
      },
    ],
  },
};

function getTypeBadge(type: string, t: typeof translations.cz) {
  switch (type) {
    case 'major':
      return (
        <span className="px-2 py-0.5 text-xs font-bold bg-brand-primary text-white rounded">
          {t.newBadge}
        </span>
      );
    case 'minor':
      return (
        <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-400 rounded">
          {t.improvementBadge}
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 text-xs font-bold bg-brand-text-muted/20 text-brand-text-muted rounded">
          {t.fixBadge}
        </span>
      );
  }
}

export function ChangelogPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useSEO({
    title: `${t.title} | Echo Pulse`,
    description: t.subtitle,
    ogType: 'website',
    canonicalUrl: `${SITE_ORIGIN}/changelog`,
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backHome}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              {t.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-4">
              {t.title}
            </h1>
            <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand-primary/50 via-brand-border/30 to-transparent transform md:-translate-x-1/2" />

            {t.entries.map((entry, index) => (
              <motion.div
                key={entry.version}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative pl-8 md:pl-0 pb-12 ${
                  index % 2 === 0 ? 'md:pr-[50%] md:text-right' : 'md:pl-[50%]'
                }`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute top-0 w-4 h-4 rounded-full bg-brand-primary border-4 border-brand-background-primary ${
                    index % 2 === 0
                      ? 'left-0 md:left-1/2 md:-translate-x-1/2'
                      : 'left-0 md:left-1/2 md:-translate-x-1/2'
                  }`}
                />

                {/* Content card */}
                <div
                  className={`bg-brand-background-secondary/50 backdrop-blur-sm border border-brand-border/30 rounded-2xl p-6 hover:border-brand-primary/30 transition-all duration-300 ${
                    index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`flex items-center gap-3 mb-3 ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}
                  >
                    <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                      {entry.icon}
                    </div>
                    <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-mono text-brand-text-muted">
                          v{entry.version}
                        </span>
                        {getTypeBadge(entry.type as string, t)}
                      </div>
                      <span className="text-xs text-brand-text-muted">
                        {entry.date}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-brand-text-primary mb-2">
                    {entry.title}
                  </h3>
                  <p className="text-brand-text-secondary mb-4">
                    {entry.description}
                  </p>

                  {/* Changes list */}
                  <ul
                    className={`space-y-1 ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}
                  >
                    {entry.changes.map((change, i) => (
                      <li
                        key={i}
                        className="text-sm text-brand-text-muted flex items-center gap-2"
                        style={{
                          justifyContent:
                            index % 2 === 0 ? 'flex-end' : 'flex-start',
                        }}
                      >
                        {index % 2 === 0 ? (
                          <>
                            {change}
                            <span className="text-brand-primary">•</span>
                          </>
                        ) : (
                          <>
                            <span className="text-brand-primary">•</span>
                            {change}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
