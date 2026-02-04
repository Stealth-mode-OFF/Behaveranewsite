import React from 'react';
import { ExecutiveSummary, SystemAlert, KeyConcept, ProtocolStep, DataPoint } from './ArticleRichContent';
import { Link } from 'react-router-dom';

export interface Article {
  id: string;
  category: string;
  role: string;
  title: string;
  excerpt: string;
  readTime: string;
  content: React.ReactNode;
}

// Citation helper component
const Citation = ({ source, url }: { source: string; url?: string }) => (
  <span className="text-brand-text-secondary text-sm italic">
    {url ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-brand-primary">
        [{source}]
      </a>
    ) : (
      <span>[{source}]</span>
    )}
  </span>
);

export const articles: Article[] = [
    {
      id: 'eight-trillion-problem',
      category: 'Research',
      role: 'HR Leaders',
      title: 'Osm bilionů dolarů problém, o kterém nikdo nemluví',
      excerpt: 'Největší meta-analýza v historii HR ukazuje šokující čísla o disengagementu. A hlavně — co s tím.',
      readTime: '6 min',
      content: (
        <>
          <p className="text-xl font-medium text-brand-text-primary leading-relaxed mb-8">
            V roce 2023 vydal Gallup svou "State of the Global Workplace" zprávu. Jedno číslo v ní vyčnívá nad ostatními: <strong>$8.8 bilionů ročně</strong>. Tolik stojí globální disengagement — ztráta produktivity, vyšší fluktuace, více chyb, horší zákaznický servis.
          </p>

          <DataPoint value="$8.8T" label="Roční globální ztráta z disengagementu (Gallup, 2023)" />

          <p className="mb-6">
            Pro kontext: to je víc než HDP Japonska a Německa dohromady. Každý rok.
          </p>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Odkud tahle čísla jsou?</h2>
          <p className="mb-6">
            Gallupova Q12 meta-analýza z roku 2020 zkoumala <strong>183,806 business units</strong> a <strong>3.3 milionů zaměstnanců</strong> napříč 73 zeměmi. To není průzkum mezi přáteli. Je to pravděpodobně největší studie o pracovní spokojenosti v historii.
          </p>

          <div className="my-8 bg-brand-background-secondary p-6 rounded-lg border border-brand-border">
            <h3 className="font-bold text-brand-text-primary mb-4 uppercase tracking-wide text-xs">Klíčové výsledky meta-analýzy</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">+23%</span>
                <span>vyšší profitabilita u engagovaných týmů</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">+18%</span>
                <span>vyšší produktivita (sales)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">-43%</span>
                <span>nižší turnover v low-turnover organizacích</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">-28%</span>
                <span>méně krádeží a nehod</span>
              </li>
            </ul>
            <p className="text-xs text-brand-text-secondary mt-4 italic">
              Zdroj: Harter, J.K. et al. (2020). The Relationship Between Engagement at Work and Organizational Outcomes. Gallup Q12 Meta-Analysis.
            </p>
          </div>

          <SystemAlert title="Proč je tohle důležité?">
            Protože to není korelace. Meta-analýza s tímto vzorkem už může mluvit o <strong>kauzalitě</strong>. Engagement způsobuje lepší výsledky — ne naopak.
          </SystemAlert>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">52 % odchodů šlo zabránit</h2>
          <p className="mb-6">
            Další šokující číslo z Gallup výzkumu: více než polovina zaměstnanců, kteří odešli, říká, že jejich manažer nebo organizace mohla udělat něco, aby je udržela. Ale nikdo se nezeptal.
          </p>

          <KeyConcept title="Exit interview je nejdražší forma feedback">
            Když se člověka ptáte "proč odcházíš?" v den výpovědi, je už pozdě. SHRM odhaduje náklady na náhradu na <strong>50-200% ročního platu</strong>. U senior rolí to může být 3-4× roční plat.
          </KeyConcept>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Co na to věda? Tři teorie za jedním číslem</h2>
          <p className="mb-6">
            Ta čísla nejsou náhoda. Za 40+ let výzkumu organizační psychologie vznikly modely, které přesně vysvětlují, proč disengagement vzniká a jak mu předcházet.
          </p>

          <div className="grid md:grid-cols-1 gap-6 my-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">1. JD-R Model (Demerouti & Bakker, 2001)</h4>
              <p className="text-sm text-blue-900/80 mb-3">
                Job Demands-Resources model říká: <strong>burnout vzniká, když požadavky práce převýší zdroje</strong> (podpora, nástroje, autonomie). Engagement vzniká opačně.
              </p>
              <p className="text-xs text-blue-800/60 italic">
                Jeden z nejvíce citovaných modelů v organizační psychologii.
              </p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
              <h4 className="font-bold text-emerald-800 mb-2">2. Self-Determination Theory (Deci & Ryan, 1985)</h4>
              <p className="text-sm text-emerald-900/80 mb-3">
                Lidé potřebují tři věci: <strong>autonomii</strong> (rozhodovat), <strong>kompetenci</strong> (růst), a <strong>sounáležitost</strong> (patřit někam). Když některá chybí, vnitřní motivace padá.
              </p>
              <p className="text-xs text-emerald-800/60 italic">
                10,000+ studií za 40 let. Jeden z nejrobustnějších modelů motivace.
              </p>
            </div>
            <div className="bg-violet-50 p-6 rounded-lg border border-violet-100">
              <h4 className="font-bold text-violet-800 mb-2">3. Affective Events Theory (Weiss & Cropanzano, 1996)</h4>
              <p className="text-sm text-violet-900/80 mb-3">
                Emoce jsou <strong>nejrychlejší signál změny</strong>. Denní "hassles" se kumulují — a negativní události mají 5× větší dopad než pozitivní.
              </p>
              <p className="text-xs text-violet-800/60 italic">
                Proto se ptáme na emoce jako první. Jsou early warning system.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Co to znamená prakticky?</h2>
          <p className="mb-6">
            Pokud máte firmu se 100 zaměstnanci a průměrným platem 50,000 Kč měsíčně, ztráta jen 5 % fluktuace navíc vás ročně může stát <strong>miliony korun</strong>. A to nepočítám ztrátu know-how, morálku zbytku týmu, ani čas na zapracování.
          </p>

          <ProtocolStep number="01" title="Přestaňte měřit jednou ročně">
            Roční survey je pitva, ne prevence. Potřebujete průběžné signály.
          </ProtocolStep>
          
          <ProtocolStep number="02" title="Měřte to, co předpovídá">
            Nespokojenost s platem je symptom. Chybějící autonomie, neférové uznání, přetížení — to jsou příčiny.
          </ProtocolStep>
          
          <ProtocolStep number="03" title="Reagujte rychle">
            Data jsou bezcenná, pokud je nikdo nevidí včas. Měsíční latence = měsíční ztráta.
          </ProtocolStep>

          <div className="mt-12 p-8 bg-[#2E1065] rounded-xl">
            <h3 className="text-white font-bold text-xl mb-4">$8.8 bilionů není nevyhnutelných</h3>
            <p className="text-brand-text-inverse-secondary mb-6">
              Gallup odhaduje, že <strong>70 % variace v engagementu</strong> závisí na manažerovi. Ne na benefitech, ne na firemní kultuře abstraktně — na konkrétním člověku, který vede tým.
            </p>
            <p className="text-brand-text-inverse-secondary mb-0">
              Pokud máte dobrá data a dáte je do ruky správným lidem ve správný čas, polovina těch bilionů může zůstat ve firmách místo toho, aby protékala prsty.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-brand-border">
            <h4 className="text-sm font-bold text-brand-text-primary uppercase tracking-wide mb-4">Zdroje a další čtení</h4>
            <ul className="text-sm text-brand-text-secondary space-y-2">
              <li>• Gallup (2023). State of the Global Workplace Report</li>
              <li>• Harter, J.K. et al. (2020). Q12 Meta-Analysis: The Relationship Between Engagement at Work and Organizational Outcomes</li>
              <li>• Deci, E.L. & Ryan, R.M. (2000). The "what" and "why" of goal pursuits. Psychological Inquiry, 11(4)</li>
              <li>• Demerouti, E. et al. (2001). The job demands-resources model of burnout. Journal of Applied Psychology</li>
              <li>• Weiss, H.M. & Cropanzano, R. (1996). Affective Events Theory. Research in Organizational Behavior</li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: 'emotions-predict-turnover',
      category: 'Research',
      role: 'HR Leaders',
      title: 'Proč emoce předpovídají odchody lépe než engagement score',
      excerpt: 'Affective Events Theory vysvětluje, proč je nálada v pondělí lepší prediktor než roční průzkum. A proč negativní zážitky mají 5× větší dopad.',
      readTime: '5 min',
      content: (
        <>
          <p className="text-xl font-medium text-brand-text-primary leading-relaxed mb-8">
            V roce 1996 publikovali Howard Weiss a Russell Cropanzano teorii, která změnila pohled na pracoviště: <strong>Affective Events Theory</strong>. Jejich hlavní argument? Emoce nejsou vedlejší produkt práce — jsou jejím primárním signálem.
          </p>

          <DataPoint value="5×" label="Větší dopad negativních vs. pozitivních událostí (Weiss & Cropanzano, 1996)" />

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Co je Affective Events Theory?</h2>
          <p className="mb-6">
            AET říká jednoduchou věc: pracovní prostředí generuje události, události vyvolávají emoce, a emoce ovlivňují chování a postoje. Zní to triviálně. Ale většina HR nástrojů tenhle řetězec ignoruje.
          </p>

          <div className="my-8 bg-violet-50 p-6 rounded-lg border border-violet-200">
            <h3 className="font-bold text-violet-900 mb-4">Řetězec AET</h3>
            <div className="flex flex-col md:flex-row items-center gap-4 text-center">
              <div className="bg-white rounded-lg p-4 flex-1 border border-violet-100">
                <div className="text-2xl mb-2">🏢</div>
                <div className="font-bold text-violet-800">Pracovní prostředí</div>
                <div className="text-xs text-violet-600">Kultura, procesy, vedení</div>
              </div>
              <div className="text-violet-400 font-bold">→</div>
              <div className="bg-white rounded-lg p-4 flex-1 border border-violet-100">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-bold text-violet-800">Afektivní události</div>
                <div className="text-xs text-violet-600">Denní "hassles" a "uplifts"</div>
              </div>
              <div className="text-violet-400 font-bold">→</div>
              <div className="bg-white rounded-lg p-4 flex-1 border border-violet-100">
                <div className="text-2xl mb-2">💭</div>
                <div className="font-bold text-violet-800">Emoce</div>
                <div className="text-xs text-violet-600">Frustrace, radost, úzkost</div>
              </div>
              <div className="text-violet-400 font-bold">→</div>
              <div className="bg-white rounded-lg p-4 flex-1 border border-violet-100">
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-bold text-violet-800">Chování</div>
                <div className="text-xs text-violet-600">Výkon, odchod, sabotáž</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Proč negativní zážitky dominují?</h2>
          <p className="mb-6">
            Výzkum konzistentně ukazuje, že <strong>negativní události mají asymetricky větší dopad</strong> než pozitivní. Jeden špatný meeting může zkazit celý den. Jeden neférový komentář od šéfa může přebít měsíc dobrých zkušeností.
          </p>

          <SystemAlert title="Klíčový insight">
            Proto se roční engagement survey nezachytí problém včas. Negativní události se kumulují pod prahem viditelnosti — a pak přijde výpověď "z ničeho nic".
          </SystemAlert>

          <KeyConcept title="'Hassles' vs. 'Uplifts'">
            AET rozlišuje mezi denními frustrujícími událostmi (hassles) a pozitivními (uplifts). Příklad hassle: "Opět nefunguje tool, který potřebuji k práci." Příklad uplift: "Kolega mi pomohl s problémem, aniž by se ho to týkalo."
          </KeyConcept>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Co to znamená pro měření?</h2>
          <p className="mb-6">
            Pokud chcete zachytit skutečný stav týmu, musíte měřit častěji a blíž k emocím. Ne jednou za rok otázkou "Jak jste spokojeni s prací?" Ale průběžně: "Jak se dnes cítíte? Co vám bránilo v práci?"
          </p>

          <ProtocolStep number="01" title="Měřte emoce, ne jen názory">
            Otázka "Jak se cítíte?" je rychlejší a přesnější než "Jak hodnotíte vedení od 1 do 10?"
          </ProtocolStep>
          
          <ProtocolStep number="02" title="Sledujte trendy, ne jen snímky">
            Důležitější než absolutní hodnota je směr. Padající nálada po 3 týdny = red flag.
          </ProtocolStep>
          
          <ProtocolStep number="03" title="Identifikujte hassles rychle">
            Když 5 lidí z 10 zmíní stejnou frustraci, máte strukturální problém.
          </ProtocolStep>

          <div className="mt-12 p-8 bg-[#2E1065] rounded-xl">
            <h3 className="text-white font-bold text-xl mb-4">Emoce jako Early Warning System</h3>
            <p className="text-brand-text-inverse-secondary mb-0">
              Než se frustrace projeví ve výkonu nebo rozhodnutí odejít, ukáže se v náladě. Proto Echo Pulse 
              začíná emocionální otázkou. Chytáme signál týdny předtím, než se stane problémem.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-brand-border">
            <h4 className="text-sm font-bold text-brand-text-primary uppercase tracking-wide mb-4">Zdroje</h4>
            <ul className="text-sm text-brand-text-secondary space-y-2">
              <li>• Weiss, H.M. & Cropanzano, R. (1996). Affective Events Theory: A theoretical discussion. Research in Organizational Behavior, 18, 1-74</li>
              <li>• Ashkanasy, N.M. & Daus, C.S. (2002). Emotion in the workplace: The new challenge for managers. Academy of Management Executive</li>
              <li>• Basch, J. & Fisher, C.D. (2000). Affective events–emotions matrix: A classification of work events and associated emotions</li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: 'preventable-turnover',
      category: 'Research',
      role: 'CEO & Founders',
      title: '52% odchodů šlo zabránit. Nikdo se nezeptal.',
      excerpt: 'Gallup data ukazují, že většina zaměstnanců, kteří odešli, říká, že firma mohla něco udělat. Ale exit interview přišel pozdě.',
      readTime: '5 min',
      content: (
        <>
          <ExecutiveSummary points={[
            "52% zaměstnanců říká, že jejich odchodu šlo předejít (Gallup).",
            "Průměrný náklad na náhradu: 50-200% ročního platu (SHRM).",
            "70% variace v engagementu závisí na přímém manažerovi."
          ]} />

          <p className="text-xl font-medium text-brand-text-primary leading-relaxed mb-8">
            Představte si, že polovina požárů ve vašem městě vznikla z opakovaných příčin, o kterých hasiči věděli — ale nikdo nezavolal, dokud nehořelo. Přesně tak funguje turnover ve většině firem.
          </p>

          <DataPoint value="52%" label="Odchodů, kterým šlo zabránit podle samotných zaměstnanců (Gallup)" />

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Proč exit interview nefunguje</h2>
          <p className="mb-6">
            Exit interview má zásadní problém: přichází ve chvíli, kdy už je rozhodnutí učiněno. Člověk, který odchází, nemá důvod být zcela upřímný. Často zjednoduší odpověď na "lepší příležitost" — i když skutečný důvod je jiný.
          </p>

          <div className="my-8 bg-brand-background-secondary p-6 rounded-lg border border-brand-border">
            <h3 className="font-bold text-brand-text-primary mb-4 uppercase tracking-wide text-xs">Co lidé říkají vs. co myslí</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="font-bold text-red-800 mb-2">Co říkají při odchodu</div>
                <ul className="text-sm text-red-900/80 space-y-1">
                  <li>• "Lepší příležitost"</li>
                  <li>• "Více peněz"</li>
                  <li>• "Čas na změnu"</li>
                </ul>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                <div className="font-bold text-emerald-800 mb-2">Co skutečně cítili</div>
                <ul className="text-sm text-emerald-900/80 space-y-1">
                  <li>• "Šéf mě nikdy nepodpořil"</li>
                  <li>• "Moje práce nebyla vidět"</li>
                  <li>• "Neměl jsem šanci růst"</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Matematika turnoveru</h2>
          <p className="mb-6">
            SHRM (Society for Human Resource Management) odhaduje náklady na náhradu zaměstnance na <strong>50-200% jeho ročního platu</strong>. Pro seniorní role nebo specialisty to může být ještě více.
          </p>

          <KeyConcept title="Náklady turnoveru (příklad)">
            Firma se 100 zaměstnanci, průměrný plat 600,000 Kč/rok, 15% roční fluktuace:
            <br /><br />
            15 odchodů × 600,000 Kč = <strong>9 mil. Kč ročně</strong>
            <br />
            Pokud 52% šlo zabránit = <strong>4.7 mil. Kč ztráta, které šlo předejít</strong>
          </KeyConcept>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">70% variace = manažer</h2>
          <p className="mb-6">
            Gallup zjistil, že <strong>70% variace v engagementu mezi týmy</strong> lze vysvětlit jediným faktorem: kvalitou přímého manažera. Ne benefity. Ne firemní kultura abstraktně. Konkrétní člověk, který vede tým.
          </p>

          <SystemAlert title="Implikace pro vedení">
            Pokud máte problém s retencí, možná nepotřebujete nový wellbeing program. Možná potřebujete lepší data o tom, jak vaši manažeři skutečně vedou — a kde potřebují podporu.
          </SystemAlert>

          <ProtocolStep number="01" title="Přestaňte čekat na exit">
            Ptejte se průběžně. Ne jednou za rok. Ne až při odchodu.
          </ProtocolStep>
          
          <ProtocolStep number="02" title="Dávejte data manažerům">
            Engagement není problém HR oddělení. Je to operativní metrika pro každý tým.
          </ProtocolStep>
          
          <ProtocolStep number="03" title="Sledujte leading indicators">
            Klesající energie, narůstající frustrace z nástrojů, pocit neférovosti — to jsou signály před odchodem.
          </ProtocolStep>

          <div className="mt-12 p-8 bg-[#2E1065] rounded-xl">
            <h3 className="text-white font-bold text-xl mb-4">Prevence je levnější než reakce</h3>
            <p className="text-brand-text-inverse-secondary mb-0">
              Cena za ztrátu jednoho klíčového člověka může být milion korun. Cena za průběžné měření a intervenci? 
              Zlomek. Otázka není, jestli si to můžete dovolit. Otázka je, jestli si můžete dovolit nevědět.
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-brand-border">
            <h4 className="text-sm font-bold text-brand-text-primary uppercase tracking-wide mb-4">Zdroje</h4>
            <ul className="text-sm text-brand-text-secondary space-y-2">
              <li>• Gallup (2019). "This Fixable Problem Costs U.S. Businesses $1 Trillion"</li>
              <li>• SHRM (2022). Benchmarking Human Capital Metrics</li>
              <li>• Harter, J.K. & Mann, A. (2017). "The Right Culture: Not Just About Employee Satisfaction"</li>
            </ul>
          </div>
        </>
      )
    },
    {
      category: 'System Error',
      role: 'HR Leaders',
      title: 'Přestaňte měřit spokojenost. Začněte vidět realitu.',
      excerpt: 'Engagement survey je zpětné zrcátko. Pokud řídíte podle něj, narazíte. Potřebujete prediktivní systém.',
      readTime: '4 min',
      content: (
        <>
          <p className="text-xl font-medium text-brand-text-primary leading-relaxed mb-8">
            Kolikrát jste už slyšeli tuhle větu: „Potřebujeme zlepšit engagement." A kolikrát jste na to udělali průzkum, workshop, iniciativu... a za půl roku zjistili, že se v podstatě nic nezměnilo?
          </p>

          <SystemAlert title="Kritická chyba">
            Tohle není kritika vaší práce. Je to kritika <strong>nástrojů, se kterými pracujete</strong>. Problém není v tom, že byste nedělali dost. Problém je v tom, že měříte špatnou věc ve špatný čas.
          </SystemAlert>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Engagement surveys jsou pitva, ne prevence</h2>
          <p className="mb-6">
            Roční engagement survey je jako lékařská prohlídka jednou za rok. Užitečná? Jistě. Ale když vám najdou problém, často už běží měsíce. A než zpracujete výsledky, připravíte akční plány a začnete cokoliv měnit, je tu další čtvrtletí. Kontext se změnil. Priorita se posunula.
          </p>
          <p className="mb-6">
            Tím nechci říct, že surveys jsou k ničemu. Ale <strong>pokud jsou jediný zdroj</strong>, pak je vaše HR v podstatě slepé 90 % času.
          </p>

          <div className="my-8 bg-brand-background-secondary p-6 rounded-lg border border-brand-border">
             <h3 className="font-bold text-brand-text-primary mb-4 uppercase tracking-wide text-xs">Neviditelná rizika</h3>
             <ul className="space-y-2">
                <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Workload eskaluje rychleji než tým roste</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Manažeři neví, jak dávat zpětnou vazbu</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Lidi nejsou přetížení prací, ale <strong>chybějícími nástroji a procesní frustrací</strong></span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Odměňování není vnímáno jako neférové kvůli penězům, ale kvůli neviditelnosti úsilí</span>
                </li>
             </ul>
          </div>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Exit interview je nejdražší forma zpětné vazby</h2>
          <p className="mb-6">
            „Proč odcházíš?" ... „Lepší příležitost."
          </p>
          <p className="mb-6">
            A vy víte, že to není celá pravda. Ale člověk, který odchází, už nemá důvod být upřímný. Často ani nevíte, co se pokazilo, protože problém nebyl okamžitý – byl postupný. Jenže vy jste neměli šanci to vidět. Protože neměříte průběžně. Měříte v kampani.
          </p>

          <KeyConcept title="Změna paradigmatu">
             HR není kampaň. HR je systém. Teambuildingy a wellbeing programy často řeší symptom, ne příčinu. Příčina je v procesech, nástrojích a viditelnosti práce.
          </KeyConcept>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Co kdybyste místo reportování problémů pomáhali je předcházet?</h2>
          <p className="mb-6">
            Teď trávíte čas zpracováním dat z průzkumů a vysvětlováním, co se stalo. Ale co kdybyste místo toho trávili čas <strong>identifikací slabých signálů</strong> dřív, než se stanou problémy?
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                  <h4 className="font-bold text-red-800 mb-2">Reaktivní HR</h4>
                  <ul className="text-sm space-y-2 text-red-900/80">
                      <li>• Řešení výpovědí</li>
                      <li>• Roční průzkumy</li>
                      <li>• Hašení požárů</li>
                  </ul>
              </div>
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                  <h4 className="font-bold text-emerald-800 mb-2">Preventivní HR</h4>
                  <ul className="text-sm space-y-2 text-emerald-900/80">
                      <li>• Detekce rizika vyhoření</li>
                      <li>• Průběžná optimalizace procesů</li>
                      <li>• Strategické poradenství</li>
                  </ul>
              </div>
          </div>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Echo Pulse není engagement survey. Je to řídicí systém.</h2>
          <p className="mb-6">
            Představte si, že místo jednou ročně dostáváte signály průběžně. Kde workload stoupá, ale podpora ne. Kde lidi ztrácí důvěru v prioritizaci. Ne jako velká čísla v prezentaci. Ale jako <strong>živé trendy</strong>, se kterými můžete pracovat v reálném čase.
          </p>

          <h2 className="text-2xl font-bold text-brand-text-primary mt-12 mb-6">Co to znamená pro vaši roli?</h2>
          <p className="mb-6">
            Místo toho, abyste reagovali na výsledky surveys, začnete spoluvytvářet strategie na základě živých dat:
          </p>

          <ProtocolStep number="01" title="Poradenství pro vedení">
             „Vidíme signály, že investice do nového nástroje má okamžitý pozitivní dopad na vnímání workloadu."
          </ProtocolStep>
          
          <ProtocolStep number="02" title="Podpora manažerů">
             „Tým XY začíná ztrácet důvěru v prioritizaci – je čas na intervenční rozhovor, ne až za měsíc."
          </ProtocolStep>
          
          <ProtocolStep number="03" title="Systémové změny">
             „Uznání za práci nefunguje v oddělení Y, i když děláme recognition program – je tam strukturální problém, ne problém motivace."
          </ProtocolStep>

          <div className="mt-12 p-8 bg-[#2E1065] rounded-xl text-center">
              <h3 className="text-white font-bold text-xl mb-4">Přestaňte být reportéři. Staňte se architekty systémů.</h3>
              <p className="text-brand-text-inverse-secondary mb-0">
                  Dobrý HR nepotřebuje víc dat. Potřebuje správná data ve správný čas. Prevence je levnější než reakce. A systém je silnější než kampaň.
              </p>
          </div>
        </>
      )
    },
    {
      id: 'decision-latency',
      category: 'Leadership',
      role: 'CEO & Founders',
      title: 'Slepý úhel CEO: Cena za pozdní rozhodnutí',
      excerpt: 'Finanční výsledky vidíte měsíčně. Kulturní rozpad vidíte až ve výpovědích. Jak zkrátit zpětnou vazbu?',
      readTime: '4 min',
      content: (
        <>
          <ExecutiveSummary points={[
            "Rostoucí firma ztrácí neformální tok informací.",
            "CEO často 'létá naslepo' v oblasti lidského kapitálu.",
            "Potřebujete dashboard pro kulturu, stejně jako máte pro finance."
          ]} />

          <p className="text-xl text-brand-text-secondary leading-relaxed mb-8">
             Když jste měli 10 lidí, věděli jste o každém problému u oběda. Teď máte 100 lidí a o problémech se dozvídáte, až když vám klíčový člověk položí výpověď na stůl.
          </p>

          <DataPoint value="6-9 měsíců" label="Náklady na náhradu klíčového experta" />

          <SystemAlert title="Informační vakuum">
             Manažeři vám filtrují zprávy. Chtějí vypadat, že mají věci pod kontrolou. K vám se dostanou jen "vyčištěná" data. To je nebezpečné.
          </SystemAlert>

          <KeyConcept title="Kultura je řídicí systém">
             Kultura není o ovoci v kuchyňce. Je to operační systém firmy. Pokud je pomalý, zabugovaný a padá, vaše strategie nebude fungovat.
          </KeyConcept>

          <h3 className="text-brand-text-primary font-bold text-2xl mt-12 mb-6">Jak obnovit viditelnost</h3>

          <div className="mt-8">
              <ProtocolStep number="01" title="Data > Intuice">
                  Intuice škáluje špatně. Potřebujete tvrdá data o měkkých věcech.
              </ProtocolStep>
              
              <ProtocolStep number="02" title="Leading vs. Lagging">
                  Finance jsou lagging (co se stalo). Kulturní signály jsou leading (co se stane). Sledujte signály.
              </ProtocolStep>
          </div>
        </>
      )
    },
    {
      id: 'silent-exit',
      category: 'Management',
      role: 'Team Leads',
      title: 'Tichý odchod: Selhání detekce',
      excerpt: 'Vaši nejlepší lidé nedělají scény. Prostě odejdou. Zjistěte proč dřív, než podepíší jinde.',
      readTime: '3 min',
      content: (
        <>
           <ExecutiveSummary points={[
            "High-performers neodchází kvůli penězům, ale kvůli bariérám v práci.",
            "Tichý odchod (Quiet Quitting) je obranný mechanismus.",
            "Manažer potřebuje 'radar', ne jen 'dveře otevřené'."
          ]} />

          <p className="text-xl text-brand-text-secondary leading-relaxed mb-8">
            "Myslel jsem, že je spokojený." Věta, kterou říká manažer poté, co ztratil svého nejlepšího člověka. Je to selhání detekce.
          </p>

          <SystemAlert title="Varovný signál">
             Nejlepší lidé si nestěžují nahlas. Když narazí na překážku, kterou management neřeší, prostě omezí svůj investovaný výkon (Quiet Quitting) a začnou hledat jinde.
          </SystemAlert>

          <h3 className="text-brand-text-primary font-bold text-2xl mt-12 mb-6">Co ve skutečnosti řídí retenci?</h3>
          <p className="text-brand-text-secondary mb-6">
            Není to plat (pokud je tržní). Je to pocit "Progress". Že se věci hýbou. Že překážky mizí. Že jejich práce má dopad.
          </p>

          <div className="mt-8">
              <ProtocolStep number="01" title="Identifikujte bariéry">
                  Zeptejte se týmu: "Co vám tento týden bránilo v práci?" A pak to odstraňte.
              </ProtocolStep>
              
              <ProtocolStep number="02" title="Uznejte 'neviditelnou' práci">
                  Echo Pulse ukazuje, kdo koho oceňuje. Často zjistíte, že firmu drží lidi, o kterých nevíte.
              </ProtocolStep>
          </div>
        </>
      )
    }
];