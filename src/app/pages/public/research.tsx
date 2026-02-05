import React from 'react';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { ArrowRight, BookOpen, Brain, Scale, Zap, Users, TrendingUp, ExternalLink, AlertTriangle, Database, FileText, Microscope, Target, BarChart3, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/app/hooks/useSEO';
import { useLanguage } from '@/app/LanguageContext';

const ModelCard = ({ 
  icon: Icon, 
  title, 
  authors, 
  year, 
  construct, 
  mapping,
  color,
  gradient
}: { 
  icon: React.ElementType;
  title: string;
  authors: string;
  year: string;
  construct: string;
  mapping: string;
  color: string;
  gradient: string;
}) => (
  <div className="group bg-white rounded-2xl border border-brand-border/50 overflow-hidden hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all duration-300">
    <div className={`h-2 ${gradient}`} />
    <div className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary mb-1 tracking-tight">{title}</h3>
          <p className="text-sm text-brand-text-muted font-mono">{authors} ({year})</p>
        </div>
      </div>
      <div className="space-y-5">
        <div>
          <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-2">Konstrukt</p>
          <p className="text-sm text-brand-text-secondary leading-relaxed">{construct}</p>
        </div>
        <div className="bg-gradient-to-br from-brand-background-secondary to-brand-background-muted/30 rounded-xl p-5 border-l-4 border-brand-primary">
          <p className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.15em] mb-2">Mapování → Systém</p>
          <p className="text-sm text-brand-text-primary font-medium leading-relaxed">{mapping}</p>
        </div>
      </div>
    </div>
  </div>
);

const EvidenceCard = ({ 
  type, 
  value, 
  metric, 
  implication, 
  source 
}: { 
  type: string;
  value: string; 
  metric: string; 
  implication: string;
  source: string;
}) => (
  <div className="group bg-white rounded-2xl p-6 border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-accent/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-brand-primary to-brand-accent bg-clip-text text-transparent tracking-tight">{value}</div>
        <span className="text-[10px] font-mono font-bold text-white bg-brand-primary px-2.5 py-1 rounded-full uppercase tracking-wider">{type}</span>
      </div>
      <div className="mb-4">
        <p className="text-brand-text-primary font-bold mb-2">{metric}</p>
        <p className="text-sm text-brand-text-secondary leading-relaxed">{implication}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-brand-text-muted font-mono pt-4 border-t border-brand-border/30">
        <BarChart3 className="w-3.5 h-3.5" />
        {source}
      </div>
    </div>
  </div>
);

export const ResearchPage = () => {
  const { t, language, setLanguage } = useLanguage();
  const isCz = language === 'cz';

  useSEO({
    title: isCz ? 'Architektura systému Echo Pulse' : t.research.seoTitle,
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
                  className="h-12 px-8 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-lg"
                >
                  {t.research.switchToCz}
                </button>
                <Link to="/" className="text-brand-primary font-semibold">
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-brand-background-secondary/30 to-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        
        {/* Hero Section - System Architecture Focus */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 max-w-5xl py-16 relative">
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg text-xs font-mono font-bold mb-8 shadow-lg shadow-brand-primary/20">
                <Microscope className="w-4 h-4" />
                SYSTEM ARCHITECTURE
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-6 tracking-tight leading-[1.1]">
                Architektura<br />
                <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">detekčního systému</span>
              </h1>
              <p className="text-lg md:text-xl text-brand-text-secondary max-w-3xl leading-relaxed">
                Echo Pulse je organizační early-warning systém měřící signály spojené s engagement, rizikem vyhoření, manažerským dopadem a latentní nestabilitou. Detekční model je založen na validovaných konstruktech z organizační psychologie.
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brand-text-primary">40+ let</div>
                    <div className="text-xs text-brand-text-muted">validovaného výzkumu</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brand-text-primary">3 hlavní</div>
                    <div className="text-xs text-brand-text-muted">teoretické modely</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brand-text-primary">183K+</div>
                    <div className="text-xs text-brand-text-muted">business units</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Macro Evidence Section - Reframed */}
        <section className="bg-white py-20 mb-0 border-y border-brand-border/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/5 rounded-full text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-4">
                <BarChart3 className="w-3.5 h-3.5" />
                Makro Evidence
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">Ekonomický kontext měření</h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto">
                Organizační signály nejsou abstraktní metriky. Mají ekonomický dopad měřitelný v miliardách.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EvidenceCard 
                type="META"
                value="$8.8T" 
                metric="Globální ekonomická ztráta"
                implication="Disengagement není HR problém. Je to business risk."
                source="Gallup State of Workplace 2023" 
              />
              <EvidenceCard 
                type="META"
                value="23%" 
                metric="Rozdíl v ziskovosti Q1 vs Q4" 
                implication="Engagement predikuje finanční výkon. Oboustranně."
                source="Gallup Q12 Meta-Analysis" 
              />
              <EvidenceCard 
                type="REPORT"
                value="52%" 
                metric="Preventabilní odchody" 
                implication="Majorita fluktuace je detekovatelná před rozhodnutím."
                source="Gallup Exit Research" 
              />
              <EvidenceCard 
                type="STUDY"
                value="70%" 
                metric="Vliv manažera na engagement"
                implication="Organizační systém se lokalizuje v manažerské linii."
                source="Gallup Manager Impact Study" 
              />
            </div>
            <div className="flex items-center justify-center gap-3 mt-10 pt-8 border-t border-brand-border/30">
              <Database className="w-4 h-4 text-brand-text-muted" />
              <p className="text-xs text-brand-text-muted font-mono">
                Založeno na meta-analýzách Gallup: 183,806 business units | 3.3M+ respondentů | 50+ zemí
              </p>
            </div>
          </div>
        </section>

        {/* Core Models Section - Primary Engine */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-md">
                I. PRIMÁRNÍ MODELY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                Detekční engine
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto leading-relaxed">
                Tři validované teoretické rámce tvoří základ detekčního systému. Každý model mapuje na specifické signály v dashboardu.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <ModelCard 
                icon={Scale}
                title="JD-R Model"
                authors="Demerouti & Bakker"
                year="2001"
                construct="Burnout vzniká při asymetrii mezi job demands (zátěž, časová tíseň, emoční náročnost) a job resources (autonomie, podpora, feedback, nástroje). Engagement vzniká při dostatku zdrojů."
                mapping="Signály: Workload Balance, Team Support, Manager Quality, Resource Adequacy → Burnout Risk Index"
                color="bg-blue-500"
                gradient="bg-gradient-to-r from-blue-400 to-blue-600"
              />
              <ModelCard 
                icon={Brain}
                title="Self-Determination Theory"
                authors="Deci & Ryan"
                year="1985"
                construct="Intrinsická motivace závisí na saturaci tří psychologických potřeb: autonomie (kontrola nad prací), kompetence (růst, mastery), relatedness (sounáležitost). Deficit v jedné oblasti degraduje celkovou motivaci."
                mapping="Signály: Decision Authority, Growth Opportunity, Team Belonging → Motivation Decay Alerts"
                color="bg-emerald-500"
                gradient="bg-gradient-to-r from-emerald-400 to-emerald-600"
              />
              <ModelCard 
                icon={Zap}
                title="Affective Events Theory"
                authors="Weiss & Cropanzano"
                year="1996"
                construct="Emoční reakce na pracovní události předchází behaviorálním změnám. Negativní afekt má 5× větší váhu než pozitivní. Kumulace drobných negativních událostí (daily hassles) predikuje burnout a turnover."
                mapping="Signály: Mood Tracking, Frustration Triggers, Event Sentiment → Early Warning Threshold"
                color="bg-violet-500"
                gradient="bg-gradient-to-r from-violet-400 to-violet-600"
              />
            </div>
          </div>
        </section>

        {/* Supporting Constructs Section */}
        <section className="bg-gradient-to-b from-brand-background-secondary/50 to-white py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                II. PODPŮRNÉ KONSTRUKTY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                Validační rámce
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto leading-relaxed">
                Modifikující faktory a validační rámce. Informují interpretaci primárních signálů.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="group bg-white rounded-2xl p-8 border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Users className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary text-lg">Psychological Safety</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-brand-text-muted font-mono">Edmondson (1999) | ASQ</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Týmy s high psychological safety reportují chyby 3× častěji, inovují rychleji a mají nižší burnout. Konstrukt informuje anonymizační protokol.
                  </p>
                  <div className="pt-4 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary font-medium">→ Systémová implementace: 100% anonymita, agregace min. 5 respondentů</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-8 border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                    <TrendingUp className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary text-lg">Equity Theory</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-brand-text-muted font-mono">Adams (1963) | JAP</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Vnímaná nespravedlnost (input/output ratio vs. referent) má silnější prediktivní validitu pro turnover než absolutní kompenzace. Detekuje se rychleji než skutečný odchod.
                  </p>
                  <div className="pt-4 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary font-medium">→ Signál: Recognition Gap, Fairness Perception Index</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-8 border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                    <FileText className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary text-lg">Survey Fatigue Research</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-brand-text-muted font-mono">Galesic & Bosnjak (2009) | Public Opinion Quarterly</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Response quality degraduje exponenciálně s délkou dotazníku. Optimum: 1-3 otázky/session. Longform surveys (30+ položek) indukují satisficing behavior.
                  </p>
                  <div className="pt-4 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary font-medium">→ Systémová implementace: 1 otázka/den, rotační design, completion time &lt; 30s</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-8 border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                    <AlertTriangle className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-brand-text-primary text-lg">Turnover Cost Studies</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-brand-text-muted font-mono">SHRM Benchmarking | Gallup</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Náklady na replacement: 50-200% ročního platu zaměstnance (role-dependent). 52% preventabilních odchodů. ROI early detection: 10-25× náklady na intervenci.
                  </p>
                  <div className="pt-4 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary font-medium">→ Ekonomické zdůvodnění systému: cost-benefit ratio 1:15 (median)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Method & Validity Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-white rounded-2xl border border-brand-border/50 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-brand-primary to-brand-primary-hover p-8 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                  III. METODA A VALIDITA
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Vědecká metodologie
                </h2>
              </div>
              <div className="p-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                        <Database className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h3 className="font-bold text-brand-text-primary text-lg">Sběr dat</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-brand-text-secondary">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 shrink-0" />
                        <span>Pulse design: 1× měsíčně, 1–3 minuty, rotační model otázek</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 shrink-0" />
                        <span>Agregace: minimum 5 respondentů/segment pro anonymitu</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 shrink-0" />
                        <span>Frekvence: měsíční reporting, kvartální trend analýza</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-success mt-0.5 shrink-0" />
                        <span>Protokol: end-to-end encryption, GDPR-compliant storage</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                        <Target className="w-5 h-5 text-brand-primary" />
                      </div>
                      <h3 className="font-bold text-brand-text-primary text-lg">Prediktivní validita</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-brand-text-secondary">
                      <li className="flex items-start gap-3">
                        <div className="px-2 py-0.5 bg-brand-primary/10 rounded text-xs font-mono font-bold text-brand-primary shrink-0">0.78</div>
                        <span>Mood decline predikuje turnover (t+30d, AUC)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="px-2 py-0.5 bg-brand-primary/10 rounded text-xs font-mono font-bold text-brand-primary shrink-0">0.72</div>
                        <span>JD-R imbalance predikuje burnout (t+60d, r)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="px-2 py-0.5 bg-brand-primary/10 rounded text-xs font-mono font-bold text-brand-primary shrink-0">-0.64</div>
                        <span>SDT deficit koreluje s performance drop (r)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="px-2 py-0.5 bg-brand-primary/10 rounded text-xs font-mono font-bold text-brand-primary shrink-0">0.69</div>
                        <span>Manažerský rating predikuje team engagement (β)</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-10 pt-8 border-t border-brand-border/30 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-brand-text-muted shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-text-muted leading-relaxed">
                    Korelační koeficienty a AUC hodnoty jsou založeny na interních validačních studiích (N=4,200+ respondentů, 18 organizací). Externí publikace v přípravě.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boundaries Section */}
        <section className="bg-gradient-to-br from-brand-primary to-brand-primary-hover py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent" />
          <div className="container mx-auto px-4 max-w-5xl relative">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-white mb-4">
                IV. HRANICE SYSTÉMU
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Co Echo Pulse není
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Jasné vymezení systému zajišťuje správné použití a etickou implementaci.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">Není náhradou klinické diagnostiky</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Systém detekuje rizikové signály. Není substitute za profesionální psychologickou nebo lékařskou intervenci při klinickém burnoutu nebo duševním onemocnění.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">Není performance management tool</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Měří organizační zdraví a signály dysfunkce. Není navržen pro individuální hodnocení výkonu ani pro KPI tracking.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">Není universal engagement survey</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Zaměřuje se na prediktivní signály (turnover, burnout, manažerský dopad). Nezahrnuje broad satisfaction metrics nebo kompletní culture assessment.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-3">Není real-time monitoring</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Pulse design vyžaduje minimální týdenní window pro validní agregaci. Není vhodný pro immediate crisis detection (potřebuje jiné protokoly).
                </p>
              </div>
            </div>
            <p className="text-center text-white/60 text-sm mt-10 max-w-2xl mx-auto">
              Tyto hranice zajišťují, že systém je používán účelně a ethicky. Určují také komplementární nástroje, které organizace potřebuje vedle Echo Pulse.
            </p>
          </div>
        </section>

        {/* Model → Signal → Action Mapping */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-4">
                V. KOMPLETNÍ MAPOVÁNÍ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-4 tracking-tight">
                Model → Signál → Akce
              </h2>
              <p className="text-brand-text-secondary max-w-2xl mx-auto leading-relaxed">
                Jak se teoretický konstrukt promítá do dashboardu a konkrétního manažerského kroku.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-brand-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">JD-R Model</h3>
                      <p className="text-sm text-white/70 font-mono">Demands-Resources Balance</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3">SIGNÁLY V SYSTÉMU</p>
                      <ul className="space-y-2 text-sm text-brand-text-secondary">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Workload Pressure Index</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Resource Adequacy Score</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Time Scarcity Alerts</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Support Network Quality</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3">DASHBOARD ELEMENT</p>
                      <ul className="space-y-2 text-sm text-brand-text-secondary">
                        <li>• Burnout Risk Heatmap (týmy)</li>
                        <li>• 4-týdenní trend: Demands/Resources</li>
                        <li>• Priority Alert: High-Risk Individuals</li>
                      </ul>
                    </div>
                    <div className="bg-brand-background-secondary/50 rounded-xl p-5">
                      <p className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.15em] mb-3">AKČNÍ VÝSTUP</p>
                      <ul className="space-y-2 text-sm text-brand-text-primary font-medium">
                        <li>→ Realokace úkolů v týmu</li>
                        <li>→ 1:1 s high-risk zaměstnancem</li>
                        <li>→ Process automation prioritization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Self-Determination Theory</h3>
                      <p className="text-sm text-white/70 font-mono">Autonomy, Competence, Relatedness</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3">SIGNÁLY V SYSTÉMU</p>
                      <ul className="space-y-2 text-sm text-brand-text-secondary">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Decision Authority Level</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Growth Opportunity Perception</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Team Belonging Index</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Skill-Challenge Match</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3">DASHBOARD ELEMENT</p>
                      <ul className="space-y-2 text-sm text-brand-text-secondary">
                        <li>• Motivation Decay Alerts</li>
                        <li>• SDT Needs Radar (3 dimenze)</li>
                        <li>• Growth Gap Analysis</li>
                      </ul>
                    </div>
                    <div className="bg-brand-background-secondary/50 rounded-xl p-5">
                      <p className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.15em] mb-3">AKČNÍ VÝSTUP</p>
                      <ul className="space-y-2 text-sm text-brand-text-primary font-medium">
                        <li>→ Career development plan</li>
                        <li>→ Autonomy rozšíření (delegace)</li>
                        <li>→ Team-building akce (relatedness)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-brand-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">Affective Events Theory</h3>
                      <p className="text-sm text-white/70 font-mono">Emotional Signal Processing</p>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3">SIGNÁLY V SYSTÉMU</p>
                      <ul className="space-y-2 text-sm text-brand-text-secondary">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>Daily Mood Tracking</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>Frustration Trigger Detection</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>Positive Event Frequency</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>Emotional Volatility Index</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold text-brand-text-muted uppercase tracking-[0.15em] mb-3">DASHBOARD ELEMENT</p>
                      <ul className="space-y-2 text-sm text-brand-text-secondary">
                        <li>• Early Warning Threshold (mood slope)</li>
                        <li>• Event Sentiment Timeline</li>
                        <li>• Negativity Bias Indicator</li>
                      </ul>
                    </div>
                    <div className="bg-brand-background-secondary/50 rounded-xl p-5">
                      <p className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-[0.15em] mb-3">AKČNÍ VÝSTUP</p>
                      <ul className="space-y-2 text-sm text-brand-text-primary font-medium">
                        <li>→ Immediate manažer check-in</li>
                        <li>→ Process friction identification</li>
                        <li>→ Recognition intervention</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical CTA */}
        <section className="py-20 bg-gradient-to-b from-brand-background-secondary/30 to-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-white rounded-2xl border border-brand-border/50 p-10 md:p-14 shadow-xl shadow-brand-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-accent/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="max-w-2xl mx-auto text-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary text-white rounded-lg text-xs font-mono font-bold uppercase tracking-wider mb-6 shadow-md">
                  <Microscope className="w-3.5 h-3.5" />
                  IMPLEMENTACE
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary mb-6 tracking-tight">
                  Posouzení vhodnosti systému<br />pro vaši organizaci
                </h2>
                <p className="text-brand-text-secondary leading-relaxed mb-10">
                  30minutová technická konzultace. Probereme strukturu vašich dat, 
                  agregační protokol, hranice použitelnosti a očekávanou prediktivní sílu 
                  pro váš organizační kontext.
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
                    to="/blog"
                    className="inline-flex items-center justify-center gap-2 bg-brand-background-secondary text-brand-primary px-8 py-4 rounded-xl font-bold hover:bg-brand-background-muted transition-colors border border-brand-border"
                  >
                    Další články
                  </Link>
                </div>
                <p className="text-xs text-brand-text-muted mt-8">
                  Systém není vhodný pro všechny organizace. Konzultace určuje fit.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
