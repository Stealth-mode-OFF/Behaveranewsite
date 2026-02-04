import React from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ArrowRight, BookOpen, Brain, Scale, Zap, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/app/hooks/useSEO';

const TheoryCard = ({ 
  icon: Icon, 
  title, 
  authors, 
  year, 
  description, 
  keyInsight,
  color 
}: { 
  icon: React.ElementType;
  title: string;
  authors: string;
  year: string;
  description: string;
  keyInsight: string;
  color: string;
}) => (
  <div className="bg-white rounded-2xl border border-brand-border/50 overflow-hidden hover:shadow-lg transition-shadow">
    <div className={`h-2 ${color}`} />
    <div className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 text-brand-primary`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-text-primary mb-1">{title}</h3>
          <p className="text-sm text-brand-text-secondary">{authors} ({year})</p>
        </div>
      </div>
      <p className="text-brand-text-secondary mb-6 leading-relaxed">{description}</p>
      <div className="bg-brand-background-secondary rounded-xl p-4 border-l-4 border-brand-primary">
        <p className="text-sm font-medium text-brand-text-primary">
          <span className="text-brand-primary">→</span> {keyInsight}
        </p>
      </div>
    </div>
  </div>
);

const StatCard = ({ value, label, source }: { value: string; label: string; source: string }) => (
  <div className="bg-white rounded-xl p-6 border border-brand-border/50 text-center hover:shadow-md transition-shadow">
    <div className="text-3xl md:text-4xl font-bold text-brand-primary mb-2">{value}</div>
    <div className="text-brand-text-primary font-medium mb-2">{label}</div>
    <div className="text-xs text-brand-text-secondary">{source}</div>
  </div>
);

export const ResearchPage = () => {
  useSEO({
    title: 'Vědecké základy Echo Pulse',
    description: 'Stojíme na 40+ letech validovaného výzkumu organizační psychologie. JD-R Model, Self-Determination Theory, Affective Events Theory — věda, která předpovídá odchody a burnout.',
    keywords: 'JD-R model, Self-Determination Theory, Affective Events Theory, employee engagement research, burnout prevention, Gallup Q12, organizational psychology',
    ogType: 'website',
  });

  return (
    <div className="min-h-screen flex flex-col bg-brand-background-primary">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 max-w-5xl mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              Věda za produktem
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mb-6">
              Proč to funguje?<br />
              <span className="text-brand-primary">Vědecké základy Echo Pulse</span>
            </h1>
            <p className="text-xl text-brand-text-secondary max-w-3xl mx-auto leading-relaxed">
              Nejsme startup, co si vymyslel vlastní metriky. Stojíme na 40+ letech výzkumu 
              organizační psychologie. Tady je přehled teorií, které Echo Pulse používá — 
              a proč na tom záleží pro vaši firmu.
            </p>
          </div>
        </section>

        {/* Key Stats Section */}
        <section className="bg-gradient-to-b from-brand-background-secondary to-brand-background-primary py-16 mb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl font-bold text-brand-text-primary text-center mb-12">
              Čísla, která mluví za sebe
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                value="$8.8T" 
                label="Roční ztráta z disengagementu" 
                source="Gallup State of the Workplace 2023" 
              />
              <StatCard 
                value="23%" 
                label="Vyšší zisk u engagovaných týmů" 
                source="Gallup Q12 Meta-Analysis" 
              />
              <StatCard 
                value="52%" 
                label="Odchodům šlo zabránit" 
                source="Gallup Exit Research" 
              />
              <StatCard 
                value="70%" 
                label="Variace v engagementu = manažer" 
                source="Gallup Manager Study" 
              />
            </div>
            <p className="text-center text-sm text-brand-text-secondary mt-8">
              Data z meta-analýzy 183,806 business units a 3.3+ milionů zaměstnanců
            </p>
          </div>
        </section>

        {/* Core Theories Section */}
        <section className="container mx-auto px-4 max-w-6xl mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-text-primary mb-4">
              Tři pilíře, na kterých stojíme
            </h2>
            <p className="text-brand-text-secondary max-w-2xl mx-auto">
              Každá otázka v Echo Pulse, každý algoritmus, každá doporučení — 
              všechno vychází z validovaných psychologických modelů.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <TheoryCard 
              icon={Scale}
              title="JD-R Model"
              authors="Demerouti, Bakker"
              year="2001"
              description="Job Demands-Resources model říká jednoduchou věc: burnout vzniká, když požadavky práce (stres, tlak, deadlines) převýší zdroje (podpora, nástroje, autonomie). Engagement vzniká opačně — když máte dost zdrojů."
              keyInsight="Echo měří balance demands vs. resources v reálném čase. Když se láme, víte to první."
              color="bg-blue-500"
            />
            <TheoryCard 
              icon={Brain}
              title="Self-Determination Theory"
              authors="Deci & Ryan"
              year="1985"
              description="Lidé potřebují tři věci: autonomii (rozhodovat o své práci), kompetenci (růst a učit se), a sounáležitost (být součástí něčeho). Když některá chybí, motivace klesá."
              keyInsight="Neptáme se 'jsi spokojený?' ale 'máš co potřebuješ k tomu, abys mohl růst?'"
              color="bg-emerald-500"
            />
            <TheoryCard 
              icon={Zap}
              title="Affective Events Theory"
              authors="Weiss & Cropanzano"
              year="1996"
              description="Emoce jsou nejrychlejší signál změny. Než se frustrace projeví ve výkonu nebo rozhodnutí odejít, ukáže se v náladě. Denní 'hassles' se kumulují — a negativní události mají 5× větší dopad než pozitivní."
              keyInsight="Proto Echo začíná emocionální otázkou. Chytáme signál týdny předtím, než se stane problémem."
              color="bg-violet-500"
            />
          </div>
        </section>

        {/* Why It Matters Section */}
        <section className="bg-[#2E1065] py-20 mb-20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Proč na teorii záleží v praxi?
            </h2>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Většina HR nástrojů měří 'engagement score' bez jasného vysvětlení, co to vlastně znamená. 
              My víme přesně, proč se ptáme na to, co se ptáme — a co s odpovědí dělat.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="font-bold text-white mb-2">Validované otázky</h3>
                <p className="text-white/70 text-sm">
                  Každá otázka má za sebou desítky studií. Není to brainstorming.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-bold text-white mb-2">Prediktivní síla</h3>
                <p className="text-white/70 text-sm">
                  Víme, které signály předpovídají burnout, turnover, nebo tiché odcházení.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-2xl mb-3">🔧</div>
                <h3 className="font-bold text-white mb-2">Akční doporučení</h3>
                <p className="text-white/70 text-sm">
                  Neříkáme 'engagement je 67%'. Říkáme co dělat. Konkrétně.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Research Section */}
        <section className="container mx-auto px-4 max-w-5xl mb-20">
          <h2 className="text-2xl font-bold text-brand-text-primary text-center mb-12">
            Další výzkum, který používáme
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-brand-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-brand-text-primary">Psychological Safety</h3>
              </div>
              <p className="text-sm text-brand-text-secondary mb-3">
                Edmondsonová (1999) prokázala, že týmy s psychologickým bezpečím se učí rychleji, 
                inovují více a dělají méně chyb. Proto garantujeme 100% anonymitu.
              </p>
              <p className="text-xs text-brand-text-secondary italic">
                "Psychological Safety and Learning Behavior in Work Teams" — Administrative Science Quarterly
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-brand-border/50">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-brand-text-primary">Equity Theory</h3>
              </div>
              <p className="text-sm text-brand-text-secondary mb-3">
                Adams (1963) ukázal, že lidé neustále porovnávají svůj effort vs. reward — s kolegy, 
                trhem, minulostí. Vnímaná neférovost zabíjí motivaci rychleji než nízký plat.
              </p>
              <p className="text-xs text-brand-text-secondary italic">
                "Toward an Understanding of Inequity" — Journal of Abnormal Psychology
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-brand-border/50">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-brand-text-primary">Turnover Cost Research</h3>
              </div>
              <p className="text-sm text-brand-text-secondary mb-3">
                SHRM a Gallup odhadují náklady na náhradu zaměstnance na 50-200% jeho ročního platu. 
                A 52% odchodů šlo předejít — nikdo se ale nezeptal včas.
              </p>
              <p className="text-xs text-brand-text-secondary italic">
                SHRM Benchmarking Data & Gallup "This Fixable Problem Costs Businesses $1 Trillion"
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-brand-border/50">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-brand-text-primary">Survey Fatigue Research</h3>
              </div>
              <p className="text-sm text-brand-text-secondary mb-3">
                Galesic & Bosnjak (2009) prokázali, že kvalita odpovědí dramaticky klesá s délkou dotazníku. 
                Proto má Echo jednu otázku denně, ne 50 otázek ročně.
              </p>
              <p className="text-xs text-brand-text-secondary italic">
                "Effects of Questionnaire Length on Participation and Indicators of Response Quality"
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-brand-primary to-brand-primary-dark rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Chcete vidět vědu v praxi?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              30minutová konzultace. Ukážeme vám, jak Echo Pulse používá tyto principy 
              k detekci rizik ve vaší firmě. Bez závazků.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/#booking" 
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-primary px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-colors"
              >
                Rezervovat konzultaci
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/blog" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors border border-white/20"
              >
                Číst další články
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
