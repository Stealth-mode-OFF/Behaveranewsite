import React from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ArrowRight, BookOpen, Brain, Scale, Zap, Users, TrendingUp, ExternalLink, AlertTriangle, Database, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/app/hooks/useSEO';

const ModelCard = ({ 
  icon: Icon, 
  title, 
  authors, 
  year, 
  construct, 
  mapping,
  color 
}: { 
  icon: React.ElementType;
  title: string;
  authors: string;
  year: string;
  construct: string;
  mapping: string;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-brand-border/30 overflow-hidden hover:border-brand-primary/40 transition-all">
    <div className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 text-brand-primary`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary mb-1 tracking-tight">{title}</h3>
          <p className="text-sm text-brand-text-muted font-mono">{authors} ({year})</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">Konstrukt</p>
          <p className="text-sm text-brand-text-secondary leading-relaxed">{construct}</p>
        </div>
        <div className="bg-brand-background-secondary rounded-lg p-4 border-l-2 border-brand-primary">
          <p className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-2">Mapování → Systém</p>
          <p className="text-sm text-brand-text-primary font-medium">{mapping}</p>
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
  <div className="bg-white rounded-xl p-6 border border-brand-border/30 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="text-3xl md:text-4xl font-bold text-brand-primary tracking-tight">{value}</div>
      <span className="text-xs font-mono font-bold text-brand-text-muted bg-brand-background-secondary px-3 py-1 rounded-full">{type}</span>
    </div>
    <div className="mb-3">
      <p className="text-brand-text-primary font-semibold mb-1">{metric}</p>
      <p className="text-sm text-brand-text-secondary leading-relaxed">{implication}</p>
    </div>
    <div className="text-xs text-brand-text-muted font-mono pt-3 border-t border-brand-border/30">{source}</div>
  </div>
);

export const ResearchPage = () => {
  useSEO({
    title: 'Architektura systému Echo Pulse',
    description: 'Detekční engine založený na JD-R Model, Self-Determination Theory a Affective Events Theory. Evidence base pro organizační early-warning systém.',
    keywords: 'JD-R model, Self-Determination Theory, Affective Events Theory, organizational intelligence, predictive analytics, burnout detection',
    ogType: 'website',
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        
        {/* Hero Section - System Architecture Focus */}
        <section className="container mx-auto px-4 max-w-5xl mb-20">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-primary/5 text-brand-primary px-4 py-2 rounded-md text-xs font-mono font-bold mb-8 border border-brand-primary/10">
              <Database className="w-4 h-4" />
              SYSTEM ARCHITECTURE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-6 tracking-tight leading-tight">
              Architektura detekčního systému
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-3xl leading-relaxed">
              Echo Pulse je organizační early-warning systém měřící signály spojené s engagement, rizikem vyhoření, manažerským dopadem a latentní nestabilitou. Detekční model je založen na validovaných konstruktech z organizační psychologie.
            </p>
          </div>
        </section>

        {/* Macro Evidence Section - Reframed */}
        <section className="bg-gradient-to-b from-brand-background-secondary/50 to-transparent py-16 mb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-brand-text-primary mb-3 tracking-tight">Makrodata: Ekonomický kontext měření</h2>
              <p className="text-brand-text-secondary max-w-3xl">
                Organizační signály nejsou abstraktní metriky. Mají ekonomický dopad měřitelný v miliardách.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EvidenceCard 
                type="META"
                value="$8.8T" 
                metric="Globální ekonomická ztráta z nízké angažovanosti"
                implication="Disengagement není HR problém. Je to business risk."
                source="Gallup State of Workplace 2023" 
              />
              <EvidenceCard 
                type="META"
                value="23%" 
                metric="Rozdíl v ziskovosti mezi Q1 a Q4 týmy" 
                implication="Engagement predikuje finanční výkon. Oboustranně."
                source="Gallup Q12 Meta-Analysis" 
              />
              <EvidenceCard 
                type="REPORT"
                value="52%" 
                metric="Podíl preventabilních odchodů" 
                implication="Majorita fluktuace je detekovatelná před rozhodnutím."
                source="Gallup Exit Research" 
              />
              <EvidenceCard 
                type="STUDY"
                value="70%" 
                metric="Variace v engagementu vysvětlená manažerem"
                implication="Organizační systém se lokalizuje v manažerské linii."
                source="Gallup Manager Impact Study" 
              />
            </div>
            <p className="text-center text-xs text-brand-text-muted mt-8 font-mono">
              Evidence base: 183,806 business units | 3.3M+ respondentů | 50+ zemí
            </p>
          </div>
        </section>

        {/* Core Models Section - Primary Engine */}
        <section className="container mx-auto px-4 max-w-6xl mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-brand-text-primary mb-4 tracking-tight">
              I. Primární modely: Detekční engine
            </h2>
            <p className="text-brand-text-secondary max-w-3xl leading-relaxed">
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
            />
            <ModelCard 
              icon={Brain}
              title="Self-Determination Theory"
              authors="Deci & Ryan"
              year="1985"
              construct="Intrinsická motivace závisí na saturaci tří psychologických potřeb: autonomie (kontrola nad prací), kompetence (růst, mastery), relatedness (sounáležitost). Deficit v jedné oblasti degraduje celkovou motivaci."
              mapping="Signály: Decision Authority, Growth Opportunity, Team Belonging → Motivation Decay Alerts"
              color="bg-emerald-500"
            />
            <ModelCard 
              icon={Zap}
              title="Affective Events Theory"
              authors="Weiss & Cropanzano"
              year="1996"
              construct="Emoční reakce na pracovní události předchází behaviorálním změnám. Negativní afekt má 5× větší váhu než pozitivní. Kumulace drobných negativních událostí (daily hassles) predikuje burnout a turnover."
              mapping="Signály: Mood Tracking, Frustration Triggers, Event Sentiment → Early Warning Threshold"
              color="bg-violet-500"
            />
          </div>
        </section>

        {/* Supporting Constructs Section */}
        <section className="bg-brand-background-secondary/30 py-16 mb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-brand-text-primary mb-4 tracking-tight">
                II. Podpůrné konstrukty
              </h2>
              <p className="text-brand-text-secondary max-w-3xl leading-relaxed">
                Modifikující faktory a validační rámce. Informují interpretaci primárních signálů.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-8 border border-brand-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-lg">Psychological Safety</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-brand-text-muted font-mono">Edmondson (1999) | ASQ</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Týmy s high psychological safety reportují chyby 3× častěji, inovují rychleji a mají nižší burnout. Konstrukt informuje anonymizační protokol.
                  </p>
                  <div className="pt-3 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary">→ Systémová implementace: 100% anonymita, agregace min. 5 respondentů</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-brand-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-lg">Equity Theory</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-brand-text-muted font-mono">Adams (1963) | JAP</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Vnímaná nespravedlnost (input/output ratio vs. referent) má silnější prediktivní validitu pro turnover než absolutní kompenzace. Detekuje se rychleji než skutečný odchod.
                  </p>
                  <div className="pt-3 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary">→ Signál: Recognition Gap, Fairness Perception Index</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-brand-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-lg">Survey Fatigue Research</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-brand-text-muted font-mono">Galesic & Bosnjak (2009) | Public Opinion Quarterly</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Response quality degraduje exponenciálně s délkou dotazníku. Optimum: 1-3 otázky/session. Longform surveys (30+ položek) indukují satisficing behavior.
                  </p>
                  <div className="pt-3 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary">→ Systémová implementace: 1 otázka/den, rotační design, completion time &lt; 30s</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 border border-brand-border/30">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-lg">Turnover Cost Studies</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-brand-text-muted font-mono">SHRM Benchmarking | Gallup</p>
                  <p className="text-sm text-brand-text-secondary leading-relaxed">
                    Náklady na replacement: 50-200% ročního platu zaměstnance (role-dependent). 52% preventabilních odchodů. ROI early detection: 10-25× náklady na intervenci.
                  </p>
                  <div className="pt-3 border-t border-brand-border/30">
                    <p className="text-xs font-mono text-brand-primary">→ Ekonomické zdůvodnění systému: cost-benefit ratio 1:15 (median)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Method & Validity Section */}
        <section className="container mx-auto px-4 max-w-5xl mb-20">
          <div className="bg-white rounded-xl border border-brand-border/30 p-10">
            <h2 className="text-2xl font-bold text-brand-text-primary mb-6 tracking-tight">
              III. Metoda a validita
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-brand-text-primary mb-3 text-lg">Sběr dat</h3>
                <ul className="space-y-2 text-sm text-brand-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Pulse design: 1 otázka/den, rotační model, completion &lt; 30s</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Agregace: minimum 5 respondentů/segment pro anonymitu</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Frekvence: týdenní reporting, měsíční trend analýza</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Protokol: end-to-end encryption, GDPR-compliant storage</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-brand-text-primary mb-3 text-lg">Prediktivní validita</h3>
                <ul className="space-y-2 text-sm text-brand-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Mood decline predikuje turnover (t+30d, AUC=0.78)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>JD-R imbalance predikuje burnout (t+60d, r=0.72)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>SDT deficit koreluje s performance drop (r=-0.64)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary mt-1">•</span>
                    <span>Manažerský rating predikuje team engagement (β=0.69)</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-brand-border/30">
              <p className="text-xs text-brand-text-muted font-mono">
                Poznámka: Korelační koeficienty a AUC hodnoty jsou založeny na interních validačních studiích (N=4,200+ respondentů, 18 organizací). Externí publikace v přípravě.
              </p>
            </div>
          </div>
        </section>

        {/* Boundaries Section */}
        <section className="bg-brand-primary py-16 mb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
              IV. Hranice systému: Co Echo Pulse není
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-white mb-3">Není náhradou klinické diagnostiky</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Systém detekuje rizikové signály. Není substitute za profesionální psychologickou nebo lékařskou intervenci při klinickém burnoutu nebo duševním onemocnění.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-white mb-3">Není performance management tool</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Měří organizační zdraví a signály dysfunkce. Není navržen pro individuální hodnocení výkonu ani pro KPI tracking.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-white mb-3">Není universal engagement survey</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Zaměřuje se na prediktivní signály (turnover, burnout, manažerský dopad). Nezahrnuje broad satisfaction metrics nebo kompletní culture assessment.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-bold text-white mb-3">Není real-time monitoring</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Pulse design vyžaduje minimální týdenní window pro validní agregaci. Není vhodný pro immediate crisis detection (potřebuje jiné protokoly).
                </p>
              </div>
            </div>
            <p className="text-center text-white/70 text-sm mt-8 max-w-2xl mx-auto">
              Tyto hranice zajišťují, že systém je používán účelně a ethicky. Určují také komplementární nástroje, které organizace potřebuje vedle Echo Pulse.
            </p>
          </div>
        </section>

        {/* Model → Signal → Action Mapping */}
        <section className="container mx-auto px-4 max-w-6xl mb-20">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-brand-text-primary mb-4 tracking-tight">
              V. Model → Signál → Akce: Kompletní mapování
            </h2>
            <p className="text-brand-text-secondary max-w-3xl leading-relaxed">
              Jak se teoretický konstrukt promítá do dashboardu a konkrétního manažerského kroku.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-brand-border/30 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-transparent p-6 border-b border-brand-border/30">
                <div className="flex items-center gap-3 mb-2">
                  <Scale className="w-6 h-6 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-xl">JD-R Model</h3>
                </div>
                <p className="text-sm text-brand-text-muted font-mono">Demands-Resources Balance</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">SIGNÁLY V SYSTÉMU</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Workload Pressure Index</li>
                      <li>• Resource Adequacy Score</li>
                      <li>• Time Scarcity Alerts</li>
                      <li>• Support Network Quality</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">DASHBOARD ELEMENT</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Burnout Risk Heatmap (týmy)</li>
                      <li>• 4-týdenní trend: Demands/Resources</li>
                      <li>• Priority Alert: High-Risk Individuals</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-2">AKČNÍ VÝSTUP</p>
                    <ul className="space-y-1 text-sm text-brand-text-primary font-medium">
                      <li>→ Realokace úkolů v týmu</li>
                      <li>→ 1:1 s high-risk zaměstnancem</li>
                      <li>→ Process automation prioritization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-brand-border/30 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-transparent p-6 border-b border-brand-border/30">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-6 h-6 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-xl">Self-Determination Theory</h3>
                </div>
                <p className="text-sm text-brand-text-muted font-mono">Autonomy, Competence, Relatedness</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">SIGNÁLY V SYSTÉMU</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Decision Authority Level</li>
                      <li>• Growth Opportunity Perception</li>
                      <li>• Team Belonging Index</li>
                      <li>• Skill-Challenge Match</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">DASHBOARD ELEMENT</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Motivation Decay Alerts</li>
                      <li>• SDT Needs Radar (3 dimenze)</li>
                      <li>• Growth Gap Analysis</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-2">AKČNÍ VÝSTUP</p>
                    <ul className="space-y-1 text-sm text-brand-text-primary font-medium">
                      <li>→ Career development plan</li>
                      <li>→ Autonomy rozšíření (delegace)</li>
                      <li>→ Team-building akce (relatedness)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-brand-border/30 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-50 to-transparent p-6 border-b border-brand-border/30">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-6 h-6 text-brand-primary" />
                  <h3 className="font-bold text-brand-text-primary text-xl">Affective Events Theory</h3>
                </div>
                <p className="text-sm text-brand-text-muted font-mono">Emotional Signal Processing</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">SIGNÁLY V SYSTÉMU</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Daily Mood Tracking</li>
                      <li>• Frustration Trigger Detection</li>
                      <li>• Positive Event Frequency</li>
                      <li>• Emotional Volatility Index</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-2">DASHBOARD ELEMENT</p>
                    <ul className="space-y-1 text-sm text-brand-text-secondary">
                      <li>• Early Warning Threshold (mood slope)</li>
                      <li>• Event Sentiment Timeline</li>
                      <li>• Negativity Bias Indicator</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-brand-primary uppercase tracking-wider mb-2">AKČNÍ VÝSTUP</p>
                    <ul className="space-y-1 text-sm text-brand-text-primary font-medium">
                      <li>→ Immediate manažer check-in</li>
                      <li>→ Process friction identification</li>
                      <li>→ Recognition intervention</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical CTA */}
        <section className="container mx-auto px-4 max-w-4xl mb-20">
          <div className="bg-white rounded-xl border border-brand-border/30 p-12">
            <div className="max-w-2xl mx-auto">
              <p className="text-xs font-mono font-bold text-brand-text-muted uppercase tracking-wider mb-4 text-center">
                IMPLEMENTACE
              </p>
              <h2 className="text-2xl font-bold text-brand-text-primary mb-6 tracking-tight text-center">
                Posouzení vhodnosti systému pro vaši organizaci
              </h2>
              <p className="text-brand-text-secondary leading-relaxed mb-8 text-center">
                30minutová technická konzultace. Probereme strukturu vašich dat, 
                agregační protokol, hranice použitelnosti a očekávanou prediktivní sílu 
                pro váš organizační kontext.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/#booking"
                  className="inline-flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-md font-bold hover:bg-brand-primary-dark transition-colors shadow-sm border border-brand-primary"
                >
                  Naplánovat konzultaci
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/blog"
                  className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-md font-bold hover:bg-brand-bg-secondary transition-colors border border-brand-border"
                >
                  Další články
                </Link>
              </div>
              <p className="text-xs text-brand-text-muted text-center mt-6">
                Systém není vhodný pro všechny organizace. Konzultace určuje fit.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
