import React from 'react';
import { ExecutiveSummary, SystemAlert, KeyConcept, ProtocolStep, DataPoint } from './ArticleRichContent';

export interface Article {
  id: string;
  category: string;
  role: string;
  title: string;
  excerpt: string;
  readTime: string;
  content: React.ReactNode;
}

export const articles: Article[] = [
    {
      id: 'engagement-illusion',
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