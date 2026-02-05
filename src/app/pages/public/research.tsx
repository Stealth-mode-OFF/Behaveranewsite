import React from 'react';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { 
  ArrowRight, 
  Brain, 
  Scale, 
  Zap, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Database, 
  FileText, 
  Microscope, 
  Target, 
  BarChart3, 
  Shield, 
  Clock, 
  CheckCircle2,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';
import { motion } from 'framer-motion';

// Primary Model Card Component
const PrimaryModelCard = ({ 
  icon: Icon, 
  title, 
  authors, 
  year, 
  description, 
  signals,
  color,
  borderColor,
  index
}: { 
  icon: React.ElementType;
  title: string;
  authors: string;
  year: string;
  description: string;
  signals: string[];
  color: string;
  borderColor: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className={`group relative bg-white rounded-3xl overflow-hidden border-2 ${borderColor} hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500`}
  >
    {/* Gradient Header */}
    <div className={`${color} p-8 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="relative flex items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{title}</h3>
          <p className="text-sm text-white/70 font-mono">{authors}, {year}</p>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-8">
      <p className="text-brand-text-secondary leading-relaxed mb-6">{description}</p>
      
      {/* Signals */}
      <div className="space-y-3">
        <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em]">Signály v systému</p>
        <div className="flex flex-wrap gap-2">
          {signals.map((signal, i) => (
            <span 
              key={i}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${color} text-white`}
            >
              {signal}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

// Evidence Stat Card
const EvidenceStat = ({ value, label, source }: { value: string; label: string; source: string }) => (
  <div className="text-center p-6">
    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-brand-primary to-brand-accent bg-clip-text text-transparent mb-2">
      {value}
    </div>
    <p className="text-sm text-brand-text-primary font-medium mb-1">{label}</p>
    <p className="text-xs text-brand-text-muted font-mono">{source}</p>
  </div>
);

// Supporting Construct Card
const SupportCard = ({ 
  icon: Icon, 
  title, 
  citation, 
  description, 
  implementation,
  index
}: { 
  icon: React.ElementType;
  title: string;
  citation: string;
  description: string;
  implementation: string;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group bg-white rounded-2xl p-6 border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-start gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:scale-105 transition-all duration-300">
        <Icon className="w-6 h-6 text-brand-primary group-hover:text-white transition-colors" />
      </div>
      <div>
        <h3 className="font-bold text-brand-text-primary text-lg">{title}</h3>
        <p className="text-xs text-brand-text-muted font-mono">{citation}</p>
      </div>
    </div>
    <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">{description}</p>
    <div className="flex items-start gap-2 pt-4 border-t border-brand-border/30">
      <ChevronRight className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
      <p className="text-xs text-brand-primary font-medium">{implementation}</p>
    </div>
  </motion.div>
);

// Boundary Item
const BoundaryItem = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex items-start gap-4 p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-white mb-1">{title}</h4>
      <p className="text-sm text-white/70 leading-relaxed">{description}</p>
    </div>
  </div>
);

export const ResearchPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const isCz = language === 'cz';

  useSEO({
    title: isCz ? 'Vědecký základ | Echo Pulse' : t.research.seoTitle,
    description: isCz
      ? 'Detekční engine založený na JD-R Model, Self-Determination Theory a Affective Events Theory. Evidence base pro organizační early-warning systém.'
      : t.research.seoDescription,
    keywords: isCz
      ? 'JD-R model, Self-Determination Theory, Affective Events Theory, organizational intelligence, predictive analytics, burnout detection'
      : t.research.seoKeywords,
    ogType: 'website',
  });

  if (!isCz) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-background-primary">
        <Header />
        <main className="flex-1 pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="bg-white border border-brand-border rounded-2xl p-10 shadow-sm">
              <h1 className="text-3xl font-bold text-brand-text-primary mb-4">
                {t.research.unavailableTitle}
              </h1>
              <p className="text-brand-text-secondary leading-relaxed mb-8">
                {t.research.unavailableBody}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setLanguage('cz')}
                  className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg transition-colors"
                >
                  {t.research.switchToCz}
                </button>
                <Link to="/" className="text-brand-primary font-semibold hover:underline">
                  {t.research.backToHome}
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1">
        
        {/* Hero Section - Clean & Professional */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-background-secondary/50 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 max-w-5xl relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-xs font-mono font-bold mb-8 shadow-lg shadow-brand-primary/20">
                <Microscope className="w-4 h-4" />
                VĚDECKÝ ZÁKLAD
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 tracking-tight leading-[1.1]">
                Architektura detekčního
                <span className="block bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
                  systému Echo Pulse
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-brand-text-secondary max-w-3xl mx-auto leading-relaxed mb-12">
                Organizační early-warning systém měřící signály spojené s engagement, 
                rizikem vyhoření a manažerským dopadem. Založeno na 40+ letech 
                validovaného výzkumu v organizační psychologii.
              </p>
              
              {/* Key Numbers */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">3</div>
                  <div className="text-sm text-brand-text-muted">Primární modely</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">40+</div>
                  <div className="text-sm text-brand-text-muted">Let výzkumu</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-1">183K+</div>
                  <div className="text-sm text-brand-text-muted">Business units</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Evidence Strip - Compact */}
        <section className="bg-white border-y border-brand-border/50 py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-border/30">
              <EvidenceStat value="$8.8T" label="Globální ztráta z disengagement" source="Gallup 2023" />
              <EvidenceStat value="23%" label="Rozdíl v ziskovosti Q1 vs Q4" source="Q12 Meta-Analysis" />
              <EvidenceStat value="52%" label="Preventabilních odchodů" source="Exit Research" />
              <EvidenceStat value="70%" label="Vliv manažera na engagement" source="Manager Impact" />
            </div>
          </div>
        </section>

        {/* Primary Models Section */}
        <section className="py-24 bg-gradient-to-b from-brand-background-secondary/30 to-transparent">
          <div className="container mx-auto px-4 max-w-6xl">
            {/* Section Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                01 — PRIMÁRNÍ MODELY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                Detekční engine
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">
                Tři validované teoretické rámce tvoří základ systému. 
                Každý model mapuje na specifické signály v dashboardu.
              </p>
            </motion.div>

            {/* Model Cards */}
            <div className="grid lg:grid-cols-3 gap-8">
              <PrimaryModelCard 
                icon={Scale}
                title="JD-R Model"
                authors="Demerouti & Bakker"
                year="2001"
                description="Burnout vzniká při asymetrii mezi job demands (zátěž, časová tíseň) a job resources (autonomie, podpora, nástroje). Engagement vzniká při dostatku zdrojů."
                signals={['Workload Balance', 'Team Support', 'Manager Quality', 'Burnout Risk']}
                color="bg-blue-500"
                borderColor="border-blue-200"
                index={0}
              />
              <PrimaryModelCard 
                icon={Brain}
                title="Self-Determination"
                authors="Deci & Ryan"
                year="1985"
                description="Intrinsická motivace závisí na saturaci tří psychologických potřeb: autonomie, kompetence a sounáležitost. Deficit v jedné oblasti degraduje celkovou motivaci."
                signals={['Decision Authority', 'Growth Opportunity', 'Team Belonging', 'Motivation']}
                color="bg-emerald-500"
                borderColor="border-emerald-200"
                index={1}
              />
              <PrimaryModelCard 
                icon={Zap}
                title="Affective Events"
                authors="Weiss & Cropanzano"
                year="1996"
                description="Emoční reakce na pracovní události předchází behaviorálním změnám. Negativní afekt má 5× větší váhu. Kumulace drobných negativních událostí predikuje burnout."
                signals={['Mood Tracking', 'Frustration Triggers', 'Event Sentiment', 'Early Warning']}
                color="bg-violet-500"
                borderColor="border-violet-200"
                index={2}
              />
            </div>
          </div>
        </section>

        {/* Supporting Constructs */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                02 — PODPŮRNÉ KONSTRUKTY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                Validační rámce
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">
                Modifikující faktory informující interpretaci primárních signálů.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <SupportCard 
                icon={Users}
                title="Psychological Safety"
                citation="Edmondson (1999) | ASQ"
                description="Týmy s high psychological safety reportují chyby 3× častěji, inovují rychleji a mají nižší burnout."
                implementation="100% anonymita, agregace min. 5 respondentů"
                index={0}
              />
              <SupportCard 
                icon={TrendingUp}
                title="Equity Theory"
                citation="Adams (1963) | JAP"
                description="Vnímaná nespravedlnost má silnější prediktivní validitu pro turnover než absolutní kompenzace."
                implementation="Recognition Gap, Fairness Perception Index"
                index={1}
              />
              <SupportCard 
                icon={FileText}
                title="Survey Fatigue Research"
                citation="Galesic & Bosnjak (2009)"
                description="Response quality degraduje s délkou dotazníku. Optimum: 1-3 otázky/session, completion time < 30s."
                implementation="1 otázka/den, rotační design"
                index={2}
              />
              <SupportCard 
                icon={AlertTriangle}
                title="Turnover Cost Studies"
                citation="SHRM Benchmarking | Gallup"
                description="Náklady na replacement: 50-200% ročního platu. 52% preventabilních odchodů. ROI early detection: 10-25×."
                implementation="Cost-benefit ratio 1:15 (median)"
                index={3}
              />
            </div>
          </div>
        </section>

        {/* Methodology & Validity */}
        <section className="py-24 bg-gradient-to-b from-brand-background-secondary/50 to-transparent">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl border border-brand-border/50 overflow-hidden shadow-xl shadow-brand-primary/5"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-brand-primary to-brand-primary-hover p-8 md:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                  03 — METODA & VALIDITA
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Vědecká metodologie
                </h2>
              </div>
              
              {/* Content */}
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Data Collection */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                        <Database className="w-6 h-6 text-brand-primary" />
                      </div>
                      <h3 className="font-bold text-brand-text-primary text-xl">Sběr dat</h3>
                    </div>
                    <ul className="space-y-4">
                      {[
                        'Pulse design: 1× měsíčně, 1–3 minuty',
                        'Agregace: minimum 5 respondentů/segment',
                        'Měsíční reporting, kvartální trend analýza',
                        'End-to-end encryption, GDPR-compliant'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-brand-success mt-0.5 flex-shrink-0" />
                          <span className="text-brand-text-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Predictive Validity */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                        <Target className="w-6 h-6 text-brand-primary" />
                      </div>
                      <h3 className="font-bold text-brand-text-primary text-xl">Prediktivní validita</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { value: '0.78', label: 'Mood decline → turnover (t+30d, AUC)' },
                        { value: '0.72', label: 'JD-R imbalance → burnout (t+60d, r)' },
                        { value: '-0.64', label: 'SDT deficit → performance drop (r)' },
                        { value: '0.69', label: 'Manager rating → team engagement (β)' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-16 py-2 bg-brand-primary/10 rounded-lg text-center">
                            <span className="text-sm font-mono font-bold text-brand-primary">{item.value}</span>
                          </div>
                          <span className="text-sm text-brand-text-secondary">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Footnote */}
                <div className="mt-10 pt-6 border-t border-brand-border/30 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand-text-muted flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-text-muted leading-relaxed">
                    Korelační koeficienty a AUC hodnoty jsou založeny na interních validačních studiích 
                    (N=4,200+ respondentů, 18 organizací). Externí publikace v přípravě.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* System Boundaries */}
        <section className="py-24 bg-gradient-to-br from-brand-primary via-brand-primary-hover to-brand-primary relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container mx-auto px-4 max-w-5xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                04 — HRANICE SYSTÉMU
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Co Echo Pulse není
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Jasné vymezení systému zajišťuje správné použití a etickou implementaci.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <BoundaryItem 
                icon={AlertTriangle}
                title="Není náhradou klinické diagnostiky"
                description="Systém detekuje rizikové signály, není substitute za profesionální psychologickou intervenci."
              />
              <BoundaryItem 
                icon={BarChart3}
                title="Není performance management tool"
                description="Měří organizační zdraví. Není navržen pro individuální hodnocení výkonu."
              />
              <BoundaryItem 
                icon={FileText}
                title="Není universal engagement survey"
                description="Zaměřuje se na prediktivní signály. Nezahrnuje broad satisfaction metrics."
              />
              <BoundaryItem 
                icon={Clock}
                title="Není real-time monitoring"
                description="Pulse design vyžaduje minimální týdenní window pro validní agregaci."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-b from-brand-background-secondary/30 to-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-3xl p-10 md:p-14 shadow-2xl shadow-brand-primary/10 border border-brand-border/50 overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-brand-accent/10 via-brand-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-full text-xs font-mono font-bold mb-6 shadow-md">
                  <Lightbulb className="w-4 h-4" />
                  DALŠÍ KROK
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-6 tracking-tight">
                  Posouzení vhodnosti systému
                  <br />
                  <span className="text-brand-primary">pro vaši organizaci</span>
                </h2>
                <p className="text-brand-text-secondary leading-relaxed mb-10">
                  30minutová technická konzultace. Probereme strukturu vašich dat, 
                  agregační protokol a očekávanou prediktivní sílu pro váš organizační kontext.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/#booking"
                    className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-primary-hover transition-colors shadow-lg shadow-brand-primary/20"
                  >
                    Naplánovat konzultaci
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/"
                    className="inline-flex items-center justify-center gap-2 bg-brand-background-secondary text-brand-primary px-8 py-4 rounded-xl font-bold hover:bg-brand-background-muted transition-colors border border-brand-border"
                  >
                    Zpět na hlavní stránku
                  </Link>
                </div>
                <p className="text-xs text-brand-text-muted mt-8">
                  Systém není vhodný pro všechny organizace. Konzultace určuje fit.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
