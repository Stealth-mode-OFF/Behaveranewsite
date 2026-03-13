import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/contexts/language-context";
import { Header } from "@/app/components/layout/header";
import { Footer } from "@/app/components/layout/footer";
import { useSEO } from "@/app/hooks/use-seo";
import { cn } from "@/app/components/ui/utils";
import {
  ChevronDown,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Users,
  Mail,
  Calendar,
  CheckCircle2,
  Shield,
  Clock,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Timer,
  Rocket,
  BookOpen,
  HelpCircle,
  Play,
  ExternalLink,
  Monitor,
  Volume2,
  Eye,
  Phone,
  Search,
  CircleCheck,
  Circle,
  PartyPopper,
} from "lucide-react";
import { SITE_ORIGIN } from "@/lib/urls";
import veronikaImg from "@/assets/team/veronika.webp";

/* ═══════════════════════════════════════════
 * TABS CONFIG
 * ═══════════════════════════════════════════ */
const tabs = {
  cz: [
    { id: "start", label: "Začínáme", icon: Rocket },
    { id: "comms", label: "Komunikace", icon: MessageSquare },
    { id: "templates", label: "Šablony", icon: Mail },
    { id: "cycle", label: "Cyklus", icon: Calendar },
    { id: "topics", label: "Témata", icon: BookOpen },
    { id: "demo", label: "Vyzkoušet", icon: Play },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ],
  en: [
    { id: "start", label: "Get started", icon: Rocket },
    { id: "comms", label: "Communication", icon: MessageSquare },
    { id: "templates", label: "Templates", icon: Mail },
    { id: "cycle", label: "Cycle", icon: Calendar },
    { id: "topics", label: "Topics", icon: BookOpen },
    { id: "demo", label: "Try it", icon: Play },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ],
  de: [
    { id: "start", label: "Loslegen", icon: Rocket },
    { id: "comms", label: "Kommunikation", icon: MessageSquare },
    { id: "templates", label: "Vorlagen", icon: Mail },
    { id: "cycle", label: "Zyklus", icon: Calendar },
    { id: "topics", label: "Themen", icon: BookOpen },
    { id: "demo", label: "Testen", icon: Play },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ],
};

type Step = { num: string; title: string; desc: string; why?: string; link?: string; linkLabel?: string };
type Guideline = { icon: typeof MessageSquare; title: string; desc: string };
type Template = { id: string; label: string; subject: string; body: string };
type Week = { week: string; title: string; color: string; items: string[] };
type Topic = { emoji: string; name: string; desc: string; detail?: string; useCases?: string[]; demoUrl?: string };
type FaqEntry = { q: string; a: string };
type Demo = { title: string; subtitle: string; dashboard: { title: string; desc: string; url: string; login: string; password: string }; chatbot: { title: string; desc: string }; signup: { title: string; desc: string; url: string; label: string }; note: string };

type UILabels = { quickFacts: string; copied: string; subject: string; copyEmail: string; openDashboard: string; showCreds: string; password: string; copy: string; topicsCount: string; useFor: string; demo: string; searchFaq: string; progress: string; allDone: string; markDone: string };

type Copy = {
  meta: { title: string; description: string };
  hero: { badge: string; title: string; subtitle: string };
  start: { title: string; steps: Step[]; tips: string[]; helpText: string };
  comms: { title: string; intro: string; guidelines: Guideline[]; timing: { best: string; worst: string; why: string }; followUp: { title: string; items: string[] }; nextTab: string };
  templates: { title: string; subtitle: string; workflow: string[]; list: Template[]; nextTab: string };
  cycle: { title: string; subtitle: string; weeks: Week[]; note: string; nextTab: string };
  topicsList: Topic[];
  demoSection: Demo;
  faq: { title: string; items: FaqEntry[]; contact: string };
  cta: { title: string; subtitle: string; contactName: string; contactRole: string; contactEmail: string; contactPhone: string; consult: string; consultUrl: string };
  nextLabels: Record<string, string>;
  ui: UILabels;
};

/* ═══════════════════════════════════════════
 * COPY — CZ
 * ═══════════════════════════════════════════ */
const cz: Copy = {
  meta: {
    title: "Echo Pulse Guide — Praktický průvodce spuštěním | Behavera",
    description: "Krok za krokem od účtu po první výsledky. Email šablony, komunikační tipy, FAQ a demo přístup pro zákazníky Echo Pulse.",
  },
  hero: {
    badge: "Echo Pulse Guide",
    title: "Spusťte svůj první Pulse",
    subtitle: "Vše, co potřebujete — od nastavení účtu po komunikaci výsledků. Na jednom místě.",
  },
  start: {
    title: "Jak začít — krok za krokem",
    steps: [
      {
        num: "1", title: "Přihlaste se do účtu",
        desc: "Pilotní zákazníci: přihlaste se na app.behavera.com s údaji, které jste dostali emailem od Behavery. Noví zákazníci: registrujte se na behavera.com/start a založte si účet.",
        why: "Pilot je bezplatný zkušební provoz — vše nastavíme za vás. Self-service registrace je pro ty, kdo chtějí začít hned sami.",
        link: "https://app.behavera.com/login",
        linkLabel: "Přihlásit se",
      },
      {
        num: "2", title: "Nastavte firmu a týmy",
        desc: "V nastavení přidejte lokace, vytvořte oddělení a týmy (min. 3 lidé v týmu pro anonymitu). Přidejte zaměstnance do týmů.",
        why: "Správná struktura týmů umožní segmentovat výsledky a porovnávat oddělení. Minimum 3 lidé v týmu zajistí anonymitu odpovědí.",
      },
      {
        num: "3", title: "Vytvořte Iniciativu",
        desc: "V záložce Initiatives klikněte New Initiative \u2192 Employee Engagement. Pojmenujte ji (např. podle týmu nebo oddělení).",
        why: "Iniciativa je v\u00e1\u0161 projekt/kampan\u011b \u2014 seskupuje lidi a Pulsy dohromady. M\u016f\u017eete m\u00edt v\u00edce Iniciativ pro r\u016fzn\u00e9 t\u00fdmy nebo oddělení.",
      },
      {
        num: "4", title: "Připravte komunikaci",
        desc: "Nejdřív oslovte lídry (viz tab Komunikace). Celofiremní email pošlete 24\u201348h před spuštěním. Nejlepší čas: úterý/středa ráno.",
        why: "Důvěra začíná u lídrů. Když manažer osobně vyzve k vyplnění, response rate výrazně roste. Viz naše šablony v tabu \u0160ablony.",
      },
      {
        num: "5", title: "Pozvěte lidi",
        desc: "Anonymně: zkopírujte odkaz z Iniciativy \u2192 pošlete přes Slack/email. Nebo přidejte emaily přímo do Iniciativy \u2192 klikněte Spustit.",
        why: "Anonymní odkaz má vyšší response rate \u2014 lidé se nebojí, že budou identifikováni.",
      },
      {
        num: "6", title: "Začněte Quick Scanem",
        desc: "Quick Scan je celkový přehled angažovanosti napříč všemi 9 oblastmi. Odhalí největší mezery a ukáže, kam se zaměřit v dalším Pulsu.",
        why: "Nemusíte hádat, kde je problém. Quick Scan vám dá objektivní obrázek za 7 dní a jasný směr pro další kroky.",
      },
      {
        num: "7", title: "Získejte výsledky",
        desc: "Za 7 dní uvidíte na dashboardu: Engagement Score, silné stránky, rizika a konkrétní doporučení v Playbooku.",
        why: "Playbook obsahuje cílené tipy na základě vašich dat \u2014 čím více komentářů zaměstnanci napíší, tím konkrétnější doporučení dostanete.",
      },
      {
        num: "8", title: "Komunikujte a opakujte",
        desc: "Sdílejte výsledky s týmem, představte konkrétní kroky. Další Pulse pošlete za měsíc na konkrétní téma dle výsledků.",
        why: "Pravidelnost buduje důvěru. Zaměstnanci uvidí, že jejich hlas má smysl, a příště odpoví ještě ochotněji.",
      },
    ],
    tips: [
      "\u23f1 Vyplnění: 2\u20133 min na osobu, mobilní, bez přihlášení",
      "\ud83d\udd12 100 % anonymní \u2014 nikdo neuvidí individuální odpovědi",
      "\ud83d\udcc5 Pulse otevřený 7 dní, ale komunikujte deadline 2\u20133 dny",
      "\ud83d\udd14 Auto-reminders: den 2 v 8:00 a poslední den v 8:00",
      "\ud83d\udcca Response rate průměrně 85 %+",
      "\ud83c\udf0d Česky i anglicky \u2014 zaměstnanec si vybere jazyk",
    ],
    helpText: "Potřebujete pomoct s nastavením? Ozvěte se Veronice:",
  },
  comms: {
    title: "Jak komunikovat Echo Pulse",
    intro: "Úspěch stojí na tom, jak Echo Pulse představíte. Začněte u lídrů, pak teprve celofiremně.",
    guidelines: [
      {
        icon: MessageSquare,
        title: "Řekněte \u201eCo\u201c a \u201eProč\u201c",
        desc: "Vysvětlete záměr. Chcete pochopit, jak se lidem pracuje \u2014 a zlepšit to. Jednoduše, lidsky, bez HR žargonu. Příklad: \u201eChceme vědět, co si opravdu myslíte. Echo Pulse nám pomůže pochopit, co vás motivuje a co vás brzdí. Vaše zpětná vazba je pro nás důležitá a chceme s ní aktivně pracovat.\u201c",
      },
      {
        icon: Eye,
        title: "Vysvětlete anonymitu",
        desc: "Odpovědi jsou anonymní \u2014 manažer/HR neuvidí individuální odpovědi. Data jsou agregovaná za tým (min. 3 lidé). Cílem není ukazovat prstem, ale zlepšit pracovní podmínky. Vytvořte bezpečný prostor pro upřímnou zpětnou vazbu.",
      },
      {
        icon: Timer,
        title: "Zdůrazněte jednoduchost",
        desc: "3 minuty, na mobilu, bez přihlášení. Pošlete 5min blocker do kalendáře. Kreativní pobídky fungují: \u201eDej nám zpětnou vazbu, než se ti ohřeje oběd.\u201c Spojte to s rutinou (standup, retro).",
      },
      {
        icon: Clock,
        title: "Krátký deadline",
        desc: "Většina lidí odpoví do 48h. Delší okno = méně naléhavé. Pulse je otevřený 7 dní, ale komunikujte 2\u20133.",
      },
      {
        icon: MessageCircle,
        title: "Povzbuďte komentáře",
        desc: "Čím více komentářů zaměstnanci napíší, tím konkrétnější a lépe cílené tipy dostanete v Playbooku. Bez komentářů zůstávají doporučení obecnější. Připomeňte, že komentáře jsou anonymní.",
      },
      {
        icon: Users,
        title: "Zapojte lídry",
        desc: "Nejvíce lidi motivuje, když je k vyplnění vyzve jejich přímý nadřízený a vysvětlí, proč právě jejich hlas je důležitý. Krátká zmínka na meetingu stačí.",
      },
      {
        icon: Volume2,
        title: "Mluvte jednoduše",
        desc: "Vynechte HR a business žargon. Používejte srozumitelný, lidský jazyk. Lidé reagují lépe na autentickou komunikaci než na firemní fráze.",
      },
    ],
    timing: {
      best: "\u2705 Úterý/středa, 9:30\u201311:00 nebo 13:00\u201315:00",
      worst: "\ud83d\udeab Pondělí (dohánění), pátek (víkend), hned po obědě",
      why: "Úterý/středa ráno mají nejvyšší response rate. Pondělí lidé dohánějí po víkendu, pátek už myslí na víkend.",
    },
    followUp: {
      title: "Po Pulsu \u2014 jak sdílet výsledky",
      items: [
        "\ud83d\ude4f Poděkujte za účast a sdílejte response rate \u2014 oceňte, že si lidé našli čas",
        "\ud83d\udcca Shrňte výsledky \u2014 co funguje, kde jsou slabiny. Buďte konkrétní, ne obecnější",
        "\ud83c\udfaf Představte 1\u20132 konkrétní kroky + časový plán. Nemusíte řešit vše najednou",
        "\ud83d\udcac Buďte upřímní o tom, co teď řešit nejde (a kdy se vrátíte). Transparentnost buduje důvěru",
        "\ud83d\udd01 Používejte \u201eŘekli jste / Udělali jsme\u201c příběhy \u2014 ukazují, že zpětná vazba má reálný dopad",
        "\u267b\ufe0f Opakujte měsíčně \u2014 jednorázový průzkum nestačí. Pravidelnost je klíč ke změně",
      ],
    },
    nextTab: "\u2192 Připravte si email šablony",
  },
  templates: {
    title: "Email šablony \u2014 kopíruj & pošli",
    subtitle: "Upravte [závorky] a odešlete.",
    workflow: [
      "1\ufe0f\u20e3 Před spuštěním \u2192 pošlete \u201ePro lídry\u201c",
      "2\ufe0f\u20e3 V den spuštění \u2192 pošlete \u201ePro zaměstnance\u201c",
      "3\ufe0f\u20e3 Den 2\u20133 \u2192 Reminder",
      "4\ufe0f\u20e3 Po uzavření \u2192 Po výsledcích",
    ],
    list: [
      {
        id: "leaders-cz",
        label: "Pro lídry",
        subject: "\ud83d\udc4b Spouštíme Echo Pulse \u2014 jak můžete pomoct",
        body: `Ahoj všichni,

[datum] spouštíme Echo Pulse \u2013 3-minutový dotazník, který nám pomůže lépe porozumět, jak se lidé v týmu cítí, co jim pomáhá a motivuje a co je naopak blokuje od většího zapojení.

Zprávu k Behaveře pošle HR celofiremně \u2013 od vás ale velmi pomůže, když ji v týmu připomenete a povzbudíte své lidi, aby dotazník vyplnili.

\ud83d\udd0d Proč to děláme:
\u2022 Angažované týmy mají prokazatelně vyšší produktivitu i retenci (Gallup, State of the Global Workplace).
\u2022 Většina zaměstnanců své obavy aktivně nesdílí \u2013 bez bezpečného kanálu zpětné vazby zůstávají problémy skryté.
\u2022 Pravidelné pulse surveys jsou běžnou praxí ve firmách, které aktivně pracují s angažovaností.

\ud83d\udca1 Co to přinese vám:
\u2022 Včasnější zachycení změn v týmu \u2013 dřív, než klíčový člověk ztrácí motivaci.
\u2022 Silnější důvěru \u2013 lidé uvidí, že jim nasloucháte.
\u2022 Jasný směr \u2013 podle výsledků dostanete konkrétní návrhy, jak reagovat.

\ud83d\udee0 Co je vaše role:
1. Krátce Echo Pulse připomenout na týmovém setkání nebo v chatu.
2. Podpořit otevřenost \u2013 že zpětná vazba má smysl a komentáře dávají lepší kontext.
3. Vyhodnotit výsledky \u2013 dostanete agregovaná data a doporučení.

Díky, že to podporujete! \ud83d\udcac`,
      },
      {
        id: "employees-cz",
        label: "Pro zaměstnance",
        subject: "Jak se vám v práci daří \u2013 pomozte nám to zjistit",
        body: `Ahoj všichni,

chceme, aby se u nás nejen dobře pracovalo, ale i dobře cítilo. Aby měl každý z vás prostor růst, soustředit se a spolupracovat.

Proto spouštíme Echo Pulse od Behavery \u2013 pravidelný, rychlý a anonymní dotazník, který nám pomůže lépe porozumět tomu, co vám pomáhá nejen při práci, ale i se zde cítit dobře.

\ud83d\udca1 Proč má smysl se zapojit:
\u2022 Umožní vám říct, co vám dává energii \u2013 i co by šlo dělat jinak a lépe.
\u2022 Pomůže nám vytvářet prostředí, které podporuje váš rozvoj i každodenní pohodu.
\u2022 Váš hlas ovlivní fungování naší firmy \u2013 dívejme se společně dopředu!

\u2705 Co vás čeká:
\u23f1 Jen ~3 minuty
\ud83d\udcf1 Lze vyplnit z mobilu
\ud83d\udcca Výsledky uvidíme jen jako týmový souhrn (anonymně)
\ud83d\udda5\ufe0f Souhrnné výsledky představíme na Town Hallu/All-hands příští týden

\ud83d\udd50 Pozvánka vám přijde [datum] do e-mailu. Odpovídejte do: [datum].

Děkujeme, že nám pomáháte tvořit prostředí, kde se dá nejen pracovat, ale i růst a spolupracovat! \ud83d\ude4c`,
      },
      {
        id: "reminder-cz",
        label: "Reminder",
        subject: "\u23f0 Zbývá [X] dní \u2014 Echo Pulse",
        body: `Ahoj,

rychlé připomenutí \u2014 Echo Pulse je stále otevřený a zatím odpovědělo [X %] lidí.

Pokud jsi ještě nestihl/a, zabere ti to jen 3 minuty:

[ODKAZ NA PULSE]

\ud83d\udcc5 Uzavírá se: [datum]

Každý hlas počítá \u2014 díky! \ud83d\udcac`,
      },
      {
        id: "results-cz",
        label: "Po výsledcích",
        subject: "\ud83d\udcca Výsledky Echo Pulse \u2014 co jsme zjistili",
        body: `Ahoj všichni,

děkujeme za účast v Echo Pulse \u2014 zapojilo se [X %] z vás, což je skvělé! \ud83c\udf89

\ud83d\udcca Co jsme zjistili:
\u2022 \u2705 Silné stránky: [doplňte]
\u2022 \u26a0\ufe0f Oblasti ke zlepšení: [doplňte]

\ud83c\udfaf Co s tím uděláme:
\u2022 [Konkrétní krok 1]
\u2022 [Konkrétní krok 2]
\u2022 [Časový plán]

\ud83d\udcac Chceme být transparentní: [co teď řešit nemůžeme a proč]

Další Pulse plánujeme na [datum]. Vaše zpětná vazba má smysl \u2014 díky! \ud83d\ude4f`,
      },
    ],
    nextTab: "\u2192 Podívejte se na měsíční cyklus",
  },
  cycle: {
    title: "Měsíční Echo Cyklus",
    subtitle: "Doporučený rytmus. Přizpůsobte svému tempu \u2014 důležitá je konzistence.",
    weeks: [
      {
        week: "Týden 1",
        title: "Příprava & spuštění",
        color: "#7C3AED",
        items: [
          "Den 1: Připravte Iniciativu, aktualizujte seznam lidí",
          "Den 1: Zvolte téma \u2014 Quick Scan (poprvé) nebo dle výsledků",
          "Den 1: Pošlete email lídrům (šablona \u201ePro lídry\u201c)",
          "Den 2: Spusťte Pulse (úterý/středa ráno je ideální)",
          "Den 3\u20135: Posílejte remindery, zapojte lídry",
        ],
      },
      {
        week: "Týden 2",
        title: "Analýza & sdílení",
        color: "#2563EB",
        items: [
          "Den 1: Projděte dashboard \u2014 témata, silné stránky, rizika",
          "Den 2\u20133: Prioritizujte 1\u20132 realistická zlepšení",
          "Den 3: Slaďte se s manažery na dalším postupu",
          "Den 4: Komunikujte výsledky \u2014 Town Hall, newsletter, 1:1",
        ],
      },
      {
        week: "Týden 3\u20134",
        title: "Akce & follow-up",
        color: "#059669",
        items: [
          "Implementujte změny \u2014 i malé kroky budují důvěru",
          "Průběžně informujte co se zlepšilo a co je v procesu",
          "Používejte \u201eŘekli jste / Udělali jsme\u201c příběhy",
          "Plánujte téma dalšího Pulsu dle aktuálních dat",
        ],
      },
    ],
    note: "Tip: nemusíte čekat celý měsíc. Pokud máte akutní téma (restrukturalizace, nový management), spusťte Pulse dřív.",
    nextTab: "\u2192 Prozkoumejte témata měření",
  },
  topicsList: [
    { emoji: "\ud83d\udd2e", name: "Rychlý Scan", desc: "Celkový přehled angažovanosti \u2014 váš výchozí bod", detail: "Tento první Pulse vám dá jasný, objektivní obrázek napříč všemi oblastmi. Použijte ho k detekci největších mezer a rozhodnutí, kam se zaměřit příště.", useCases: ["Úvodní měření pro nové zákazníky", "Čtvrtletní benchmark celkové angažovanosti", "Rychlé srovnání mezi týmy"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-initial?x_lang=cs" },
    { emoji: "\ud83d\udca5", name: "Stres", desc: "Emocionální stránka práce, vyhoření", detail: "Odhalte tlak dříve, než naruší výkon. Měří emocionální stránku práce \u2014 jak se lidé cítí, jak je práce ovlivňuje. Zjistěte, zda vaše kultura pomáhá lidem se zotavit, nebo je vyhoří.", useCases: ["Po náročném období / restrukturalizaci", "Detekce rizika vyhoření", "Vyhodnocení work-life balance iniciativ"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-stress?x_lang=cs" },
    { emoji: "\ud83e\udde0", name: "Pracovní zátěž", desc: "Čas, soustředění, plánování", detail: "Dekódujte tok práce. Zaměřuje se na procesy \u2014 kolik práce lidé mají, jak je organizovaná, zda zvládají čas a plánování. Odhalte, zda bariéry jsou chaos, kapacita, nebo nedostatek jasnosti.", useCases: ["Optimalizace procesů a meetingů", "Plánování kapacit před růstem", "Identifikace bottlenecků v týmu"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-workload?x_lang=cs" },
    { emoji: "\ud83e\uddf0", name: "Nástroje", desc: "Technologie, podpora, zaškolení", detail: "Odhalte, co pomáhá a co brzdí. Zjistěte, zda mají lidé správné technologie, podporu a zpětnou vazbu k skvělé práci.", useCases: ["Před nákupem nových nástrojů", "Po implementaci nového software", "Evaluace onboarding procesu"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-tools?x_lang=cs" },
    { emoji: "\ud83d\udcb8", name: "Odměny", desc: "Transparentnost, férovost odměňování", detail: "Podívejte se za výplatní pásku. Měří, jak férově, motivačně a transparentně vnímají zaměstnanci odměňování. Není to jen o penězích \u2014 jde o transparentnost a spravedlnost.", useCases: ["Před revizí mzdové politiky", "Analýza spokojenosti s comp & ben", "Identifikace rizika odchodu kvůli odměnám"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-pay?x_lang=cs" },
    { emoji: "\ud83e\udd38", name: "Benefity", desc: "Co lidi nabíjí vs. co nikdo nechce", detail: "Konec generickým perkům. Zjistěte, které benefity opravdu energizují váš tým a které jen existují na papíře.", useCases: ["Redesign benefitního balíčku", "Porovnání potřeb různých skupin", "ROI analýza stávajících benefitů"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-perks?x_lang=cs" },
    { emoji: "\ud83c\udfc5", name: "Uznání", desc: "Pocit ocenění = retence + výkon", detail: "Aby ocenění opravdu fungovalo. Ukáže, zda se tým cítí skutečně oceněn, nebo zda pochvala míjí cíl. Uznání je nástroj produktivity a retence.", useCases: ["Vyhodnocení recognition programu", "Identifikace \u201etichých\u201c přispěvatelů", "Posílení kultury zpětné vazby"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-recognition?x_lang=cs" },
    { emoji: "\ud83d\udc41\ufe0f\u200d\ud83d\udde8\ufe0f", name: "Potenciál", desc: "Autonomie, růst, skrytí lídři", detail: "Podpořte růst zevnitř. Zjistěte, zda lidé cítí, že využívají své silné stránky, zda práce pomáhá jejich rozvoji a zda mají autonomii.", useCases: ["Identifikace high-potentials", "Plánování kariérních drah", "Evaluace L&D programů"] },
    { emoji: "\ud83d\udcab", name: "Hodnoty", desc: "EVP slib vs. realita, employer brand", detail: "Zesílte autentické příběhy zaměstnanců. Měří, jak silně se zaměstnanci ztotožňují s tím, co firma hlásá vs. co reálně dělá.", useCases: ["Audit employer brandu", "Příprava EVP strategie", "Měření cultural fit po M&A"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-values?x_lang=cs" },
  ],
  demoSection: {
    title: "Vyzkoušejte si Echo Pulse",
    subtitle: "Podívejte se na dashboard s reálnými daty nebo si vyzkoušejte, jak vypadá dotazník z pohledu zaměstnance.",
    dashboard: {
      title: "Demo dashboard",
      desc: "Přihlaste se a prozkoumejte výsledky, trendy, komentáře a doporučení Playbooku.",
      url: "https://app.behavera.com/login",
      login: "pulsedemocs@behavera.com",
      password: "showdemo",
    },
    chatbot: {
      title: "Zkuste si dotazník",
      desc: "Vyzkoušejte, jak vypadá Echo Pulse z pohledu zaměstnance \u2014 vyberte si téma a chatujte.",
    },
    signup: {
      title: "Chcete vlastní účet?",
      desc: "Registrujte se a spusťte svůj první Pulse.",
      url: "https://www.behavera.com/start",
      label: "Zaregistrovat se",
    },
    note: "Demo účet je sdílený \u2014 vaše odpovědi se neukládají a historie chatů se nezachová.",
  },
  faq: {
    title: "Často kladené otázky",
    items: [
      { q: "Jak dlouho trvá vyplnění?", a: "2\u20133 minuty. Funguje na mobilu, bez přihlášení. Zaměstnanci nepotřebují účet ani instalaci." },
      { q: "Je to anonymní?", a: "Ano, 100 %. Nikdo neuvidí individuální odpovědi. Data jsou agregovaná za tým (min. 3 lidé). Manažeři vidí pouze souhrnné výsledky." },
      { q: "Jak dlouho je Pulse otevřený?", a: "7 dní. Automatické remindery den 2 a poslední den v 8:00. Doporučujeme komunikovat deadline 2\u20133 dny \u2014 kratší okno = vyšší naléhavost." },
      { q: "Jak často posílat Pulse?", a: "Ideálně měsíčně. Pravidelnost buduje důvěru a umožňuje sledovat trendy. Začněte Quick Scanem, pak cílte na konkrétní oblasti dle výsledků." },
      { q: "Potřebuji instalovat software?", a: "Ne. Vše běží v prohlížeči. Mobile-first design, zaměstnanci nepotřebují účet ani instalaci." },
      { q: "Jsou data bezpečná?", a: "Ano. GDPR compliant, AES-256 šifrování, data uložená v EU (Frankfurt, AWS). Plná GDPR compliance." },
      { q: "Mohu přizpůsobit témata?", a: "Ano, můžete si vybrat z 9 témat podle potřeb vašeho týmu. První Pulse doporučujeme Quick Scan pro celkový přehled." },
      { q: "Co když někdo neodpoví?", a: "Automatické remindery pomohou. Nejvíc ale motivuje osobní výzva od přímého nadřízeného s vysvětlením, proč je zpětná vazba důležitá." },
      { q: "Co zaměstnance čeká?", a: "Krátký, interaktivní dotazník formou chatbota. 2\u20133 minuty, česky nebo anglicky, na mobilu nebo počítači. Žádné přihlášení, žádná instalace." },
      { q: "Jak sdílet výsledky?", a: "Na dashboardu uvidíte Engagement Score, silné stránky, rizika a konkrétní doporučení v Playbooku. Sdílejte na Town Hallu, v newsletteru nebo 1:1. Buďte transparentní \u2014 sdílejte silné stránky i slabiny." },
      { q: "Co je Playbook?", a: "Playbook jsou automaticky generovaná doporučení na základě vašich dat. Čím více komentářů zaměstnanci napíší, tím konkrétnější a cílenější tipy dostanete." },
      { q: "Kolik to stojí?", a: "99\u2013129 CZK/zaměstnance/měsíc podle velikosti firmy. Kontaktujte nás pro konkrétní nabídku." },
      { q: "Co uvidím na dashboardu?", a: "Engagement Score (celkové skóre angažovanosti), silné stránky a rizika podle témat, srovnání mezi týmy, trendy v čase a komentáře zaměstnanců. Playbook pak nabídne konkrétní doporučení ke každému identifikovanému riziku." },
      { q: "Jak interpretovat Engagement Score?", a: "Score je na škále 0\u2013100. Nad 70 = silná angažovanost, 50\u201370 = prostor ke zlepšení, pod 50 = potřeba akce. Důležitější než absolutní číslo je trend \u2014 sledujte, jak se score mění měsíc od měsíce." },
      { q: "Co dělat při nízké účasti?", a: "1) Požádejte lídry o osobní připomínku v týmu. 2) Pošlete reminder s aktuálním % účasti. 3) Zdůrazněte, že zabere jen 3 min. 4) Spojte vyplnění s konkrétním momentem (standup, oběd). 5) U dalšího Pulsu začněte komunikaci dřív a zapojte lídry od začátku." },
      { q: "Co když jsou výsledky špatné?", a: "Špatné výsledky jsou cenná data, ne důvod k panice. 1) Sdílejte je transparentně \u2014 zamlčování podkopává důvěru. 2) Vyberte 1\u20132 nejkritičtější oblasti. 3) Představte konkrétní plán. 4) Komunikujte, co řešit nemůžete a proč. 5) Sledujte zlepšení v dalším Pulsu." },
      { q: "Jaké role existují v systému?", a: "Admin (HR/CEO): plný přístup k nastavení, iniciativám a výsledkům. Manager: vidí výsledky svého týmu. Zaměstnanec: vyplňuje dotazník, nepotřebuje účet." },
      { q: "Jak přidám nebo odeberu zaměstnance?", a: "V nastavení \u2192 People. Přidejte jméno a email, nebo importujte CSV. Odebrání: klikněte na zaměstnance a zvolte Remove. Změny se projeví v dalším Pulsu." },
      { q: "Podporujete Slack nebo Teams?", a: "Pozvánky a remindery lze posílat přes email i Slack. Integraci s Microsoft Teams připravujeme. Pro Slack stačí zkopírovat odkaz z Iniciativy a poslat do kanálu." },
    ],
    contact: "Nenašli jste odpověď?",
  },
  cta: {
    title: "Potřebujete pomoct?",
    subtitle: "Ozvěte se Veronice — pomůže s nastavením i interpretací výsledků.",
    contactName: "Veronika Nováková",
    contactRole: "Customer Success",
    contactEmail: "veronika.novakova@behavera.com",
    contactPhone: "+420 775 922 506",
    consult: "Domluvit konzultaci",
    consultUrl: "/?demo=1",
  },
  nextLabels: {
    start: "Jak komunikovat \u2192",
    comms: "Email šablony \u2192",
    templates: "Měsíční cyklus \u2192",
    cycle: "Témata měření \u2192",
    topics: "Vyzkoušejte demo \u2192",
    demo: "Časté otázky \u2192",
  },
  ui: {
    quickFacts: "Rychlý přehled",
    copied: "Zkopírováno!",
    subject: "Předmět",
    copyEmail: "Kopírovat email",
    openDashboard: "Otevřít dashboard",
    showCreds: "Zobrazit přihlašovací údaje",
    password: "Heslo",
    copy: "Kopírovat",
    topicsCount: "témat, která Echo Pulse měří",
    useFor: "Použijte k:",
    demo: "Demo",
    searchFaq: "Hledat v otázkách…",
    progress: "hotovo",
    allDone: "Vše připraveno!",
    markDone: "Označit jako hotové",
  },
};

/* ═══════════════════════════════════════════
 * COPY — EN
 * ═══════════════════════════════════════════ */
const en: Copy = {
  meta: {
    title: "Echo Pulse Guide \u2014 Practical Launch Manual | Behavera",
    description: "Step by step from account to first results. Email templates, communication tips, FAQ and demo access for Echo Pulse customers.",
  },
  hero: {
    badge: "Echo Pulse Guide",
    title: "Launch your first Pulse",
    subtitle: "Everything you need \u2014 from account setup to communicating results. All in one place.",
  },
  start: {
    title: "How to get started \u2014 step by step",
    steps: [
      {
        num: "1", title: "Log in to your account",
        desc: "Pilot customers: log in at app.behavera.com with the credentials you received from Behavera. New customers: sign up at behavera.com/start to create your account.",
        why: "A pilot is a free trial — we set everything up for you. Self-service signup is for those who want to get started on their own.",
        link: "https://app.behavera.com/login",
        linkLabel: "Log in",
      },
      {
        num: "2", title: "Set up company & teams",
        desc: "Add locations, create departments and teams (min. 3 people per team for anonymity). Add employees to teams.",
        why: "Proper team structure allows you to segment results and compare departments. Minimum 3 people per team ensures anonymity.",
      },
      {
        num: "3", title: "Create an Initiative",
        desc: "Go to Initiatives \u2192 New Initiative \u2192 Employee Engagement. Name it (e.g., by team or department).",
        why: "An Initiative is your project/campaign \u2014 it groups people and Pulses together. You can have multiple Initiatives for different teams.",
      },
      {
        num: "4", title: "Prepare communication",
        desc: "Brief leaders first (see Communication tab). Send company-wide email 24\u201348h before launch. Best time: Tuesday/Wednesday morning.",
        why: "Trust starts with leaders. When a manager personally asks people to participate, response rate jumps significantly. See our templates in the Templates tab.",
      },
      {
        num: "5", title: "Invite your people",
        desc: "Anonymous: copy link from Initiative \u2192 send via Slack/email. Or add emails directly to Initiative \u2192 click Run.",
        why: "Anonymous links have higher response rates \u2014 people aren\u2019t worried about being identified.",
      },
      {
        num: "6", title: "Start with Quick Scan",
        desc: "Quick Scan is a full engagement overview across all 9 areas. It reveals biggest gaps and shows where to focus next.",
        why: "No need to guess where the problem is. Quick Scan gives you an objective picture in 7 days and a clear direction for next steps.",
      },
      {
        num: "7", title: "Get results",
        desc: "Within 7 days: Engagement Score, strengths, risks, and specific recommendations in your Playbook.",
        why: "Playbook contains targeted tips based on your data \u2014 the more comments employees write, the more specific the recommendations.",
      },
      {
        num: "8", title: "Communicate & repeat",
        desc: "Share results with your team, present concrete steps. Send next Pulse in a month on a specific topic based on results.",
        why: "Consistency builds trust. Employees see their voice matters and respond even more willingly next time.",
      },
    ],
    tips: [
      "\u23f1 Takes 2\u20133 min per person, mobile, no login",
      "\ud83d\udd12 100% anonymous \u2014 no one sees individual answers",
      "\ud83d\udcc5 Pulse open 7 days, but communicate 2\u20133 day deadline",
      "\ud83d\udd14 Auto-reminders: day 2 at 8:00 AM and last day at 8:00 AM",
      "\ud83d\udcca Average response rate 85%+",
      "\ud83c\udf0d Czech and English \u2014 employees choose their language",
    ],
    helpText: "Need help with setup? Reach out to Veronika:",
  },
  comms: {
    title: "How to communicate Echo Pulse",
    intro: "Success depends on how you introduce it. Start with leaders, then go company-wide.",
    guidelines: [
      {
        icon: MessageSquare,
        title: "Explain the \u201cWhat\u201d and \u201cWhy\u201d",
        desc: "Share your intent. You want to understand how people feel at work \u2014 and improve it. Simple, human, no HR jargon. Example: \u201cWe want to know what you really think. Echo Pulse helps us understand what motivates you and what\u2019s holding you back. Your feedback matters and we\u2019ll act on it.\u201d",
      },
      {
        icon: Eye,
        title: "Explain anonymity",
        desc: "Responses are anonymous \u2014 managers/HR cannot see individual answers. Data is aggregated per team (min. 3 people). The goal isn\u2019t pointing fingers but improving conditions. Create a safe space for honest feedback.",
      },
      {
        icon: Timer,
        title: "Emphasize simplicity",
        desc: "3 minutes, on mobile, no login. Send a 5-min calendar blocker. Creative nudges work: \u201cGive us feedback before your lunch gets cold.\u201d Pair it with a routine (standup, retro).",
      },
      {
        icon: Clock,
        title: "Short deadline",
        desc: "Most people respond within 48h. Longer window = less urgency. Pulse open 7 days, communicate 2\u20133.",
      },
      {
        icon: MessageCircle,
        title: "Encourage comments",
        desc: "The more comments employees write, the more specific and targeted tips you\u2019ll get in the Playbook. Without comments, recommendations stay general. Remind people that comments are anonymous too.",
      },
      {
        icon: Users,
        title: "Get leaders involved",
        desc: "People are most motivated when their direct manager asks them to participate and explains why their voice specifically matters. A brief mention in a meeting is enough.",
      },
      {
        icon: Volume2,
        title: "Keep it simple",
        desc: "Skip HR and business jargon. Use clear, human language. People respond better to authentic communication than corporate phrases.",
      },
    ],
    timing: {
      best: "\u2705 Tuesday/Wednesday, 9:30\u201311:00 AM or 1:00\u20133:00 PM",
      worst: "\ud83d\udeab Monday (catching up), Friday (weekend mode), right after lunch",
      why: "Tuesday/Wednesday mornings have the highest response rates. Monday people are catching up, Friday they\u2019re already thinking about the weekend.",
    },
    followUp: {
      title: "After the Pulse \u2014 how to share results",
      items: [
        "\ud83d\ude4f Thank participants and share response rate \u2014 appreciate that people took the time",
        "\ud83d\udcca Summarize results \u2014 what works, where the risks are. Be specific, not generic",
        "\ud83c\udfaf Present 1\u20132 concrete steps + timeline. You don\u2019t need to fix everything at once",
        "\ud83d\udcac Be honest about what you can\u2019t fix now (and when you\u2019ll revisit). Transparency builds trust",
        "\ud83d\udd01 Use \u201cYou Said / We Did\u201d stories \u2014 show that feedback has real impact",
        "\u267b\ufe0f Repeat monthly \u2014 one-off surveys don\u2019t work. Consistency is key to change",
      ],
    },
    nextTab: "\u2192 Get email templates ready",
  },
  templates: {
    title: "Email templates \u2014 copy & send",
    subtitle: "Customize the [brackets] and send.",
    workflow: [
      "1\ufe0f\u20e3 Before launch \u2192 send \u201cFor leaders\u201d",
      "2\ufe0f\u20e3 On launch day \u2192 send \u201cFor employees\u201d",
      "3\ufe0f\u20e3 Day 2\u20133 \u2192 Reminder",
      "4\ufe0f\u20e3 After closing \u2192 After results",
    ],
    list: [
      {
        id: "leaders-en",
        label: "For leaders",
        subject: "\ud83d\udc4b Echo Pulse is launching \u2013 here\u2019s how you can support it",
        body: `Hi everyone,

Between [insert date], we're launching Echo Pulse \u2013 a short 3-minute survey to help us better understand how people in our teams are feeling, what motivates them, and what might be getting in their way.

\ud83d\udd14 What you need to know:
HR will send out a company-wide message, but your support as a leader makes a big difference. A quick reminder in your team meeting or Slack can really boost participation.

\ud83d\udd0d Why are we doing this?
\u2022 Engaged teams show measurably higher productivity and retention (Gallup, State of the Global Workplace).
\u2022 Most employees don\u2019t actively share concerns \u2013 without a safe feedback channel, problems stay hidden.
\u2022 Regular pulse surveys are standard practice in companies that actively manage engagement.

\ud83d\udca1 Why it matters for you:
\u2022 Spot early signs of disengagement \u2013 before motivation drops or someone key leaves.
\u2022 Build trust \u2013 just launching the survey signals that feedback is welcome.
\u2022 Get clear next steps \u2013 aggregated data and concrete suggestions based on identified risks.

\ud83d\udee0 How you can help:
1. Mention the survey briefly in your team meeting or Slack.
2. Encourage honest, open feedback \u2013 let your team know their input matters.
3. Once results come in, we'll share insights and suggestions with you.

Thanks for helping us make this meaningful! \ud83d\udcac`,
      },
      {
        id: "employees-en",
        label: "For employees",
        subject: "How are you doing at work? Help us find out.",
        body: `Hi everyone,

We want our workplace to be not only productive but also a place where people feel good. A space where everyone can grow, focus, and collaborate.

That's why we're launching Echo Pulse by Behavera \u2013 a regular, quick, and anonymous survey that helps us better understand what supports your performance and well-being at work.

\ud83d\udca1 Why it's worth participating:
\u2022 It gives you space to share what energizes you \u2013 and what could be done differently.
\u2022 It helps us build an environment that supports your growth and everyday well-being.
\u2022 Your voice drives real change \u2013 we're shaping the future together.

\u2705 What to expect:
\u23f1 Just ~3 minutes
\ud83d\udcf1 Accessible on mobile
\ud83d\udcca Results will be shared only as a team summary
\ud83d\udda5\ufe0f Aggregated results will be presented at next week's Town Hall

\ud83d\udd50 Please fill it out by: [insert date]

[PULSE LINK]

Thank you for helping us build a workplace where people can thrive! \ud83d\ude4c`,
      },
      {
        id: "reminder-en",
        label: "Reminder",
        subject: "\u23f0 [X] days left \u2014 Echo Pulse",
        body: `Hi,

Quick reminder \u2014 Echo Pulse is still open and [X%] of people have responded so far.

If you haven't had a chance yet, it only takes 3 minutes:

[PULSE LINK]

\ud83d\udcc5 Closes: [date]

Every voice counts \u2014 thanks! \ud83d\udcac`,
      },
      {
        id: "results-en",
        label: "After results",
        subject: "\ud83d\udcca Echo Pulse Results \u2014 what we learned",
        body: `Hi everyone,

Thank you for participating in Echo Pulse \u2014 [X%] of you responded, which is amazing! \ud83c\udf89

\ud83d\udcca What we found:
\u2022 \u2705 Strengths: [fill in]
\u2022 \u26a0\ufe0f Areas for improvement: [fill in]

\ud83c\udfaf What we'll do about it:
\u2022 [Concrete step 1]
\u2022 [Concrete step 2]
\u2022 [Timeline]

\ud83d\udcac To be transparent: [what we can't address now and why]

Next Pulse planned for [date]. Your feedback matters \u2014 thanks! \ud83d\ude4f`,
      },
    ],
    nextTab: "\u2192 See the monthly cycle",
  },
  cycle: {
    title: "Monthly Echo Cycle",
    subtitle: "Recommended rhythm. Adjust to your pace \u2014 consistency is what matters.",
    weeks: [
      {
        week: "Week 1",
        title: "Prepare & launch",
        color: "#7C3AED",
        items: [
          "Day 1: Prepare Initiative, update people list",
          "Day 1: Choose topic \u2014 Quick Scan (first time) or based on results",
          "Day 1: Send email to leaders (\u201cFor leaders\u201d template)",
          "Day 2: Launch Pulse (Tuesday/Wednesday morning is ideal)",
          "Day 3\u20135: Send reminders, get leaders involved",
        ],
      },
      {
        week: "Week 2",
        title: "Analyze & share",
        color: "#2563EB",
        items: [
          "Day 1: Review dashboard \u2014 themes, strengths, risks",
          "Day 2\u20133: Prioritize 1\u20132 realistic improvements",
          "Day 3: Align with managers on next steps",
          "Day 4: Communicate results \u2014 Town Hall, newsletter, 1:1",
        ],
      },
      {
        week: "Week 3\u20134",
        title: "Action & follow-up",
        color: "#059669",
        items: [
          "Implement changes \u2014 even small wins build trust",
          "Keep people informed on progress",
          "Use \u201cYou Said / We Did\u201d stories",
          "Plan next Pulse topic based on current data",
        ],
      },
    ],
    note: "Tip: you don\u2019t have to wait a full month. If there\u2019s an urgent topic (restructuring, new management), launch a Pulse sooner.",
    nextTab: "\u2192 Explore measurement topics",
  },
  topicsList: [
    { emoji: "\ud83d\udd2e", name: "Quick Scan", desc: "Full engagement overview \u2014 your starting point", detail: "Your first Pulse gives you a clear, objective picture across all areas. Use it to detect the biggest gaps and decide where to focus next.", useCases: ["Initial measurement for new customers", "Quarterly overall engagement benchmark", "Quick comparison between teams"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-initial?x_lang=en" },
    { emoji: "\ud83d\udca5", name: "Stress", desc: "Emotional side of work, burnout", detail: "Reveal pressure before it hurts performance. Measures the emotional side of work \u2014 how people feel, how work affects them. Find out if your culture helps people recover or burns them out.", useCases: ["After a tough period / restructuring", "Burnout risk detection", "Evaluating work-life balance initiatives"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-stress?x_lang=en" },
    { emoji: "\ud83e\udde0", name: "Workload", desc: "Time, focus, planning", detail: "Decode the flow of work. Focuses on processes \u2014 how much work people have, how it\u2019s organized, whether they manage time and planning. Discover if barriers are chaos, capacity, or lack of clarity.", useCases: ["Process and meeting optimization", "Capacity planning before growth", "Identifying team bottlenecks"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-workload?x_lang=en" },
    { emoji: "\ud83e\uddf0", name: "Tools & Support", desc: "Tech, support, onboarding", detail: "Discover what helps and what blocks. Find out if people have the right technology, support, and feedback to do great work.", useCases: ["Before purchasing new tools", "After new software implementation", "Evaluating onboarding process"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-tools?x_lang=en" },
    { emoji: "\ud83d\udcb8", name: "Pay", desc: "Transparency, fairness of compensation", detail: "Look beyond the paycheck. Measures how fairly, motivationally and transparently employees perceive compensation. It\u2019s not just about money \u2014 it\u2019s about transparency and fairness.", useCases: ["Before salary policy revision", "Comp & ben satisfaction analysis", "Identifying attrition risk from pay"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-pay?x_lang=en" },
    { emoji: "\ud83e\udd38", name: "Perks & Benefits", desc: "What energizes vs. what nobody uses", detail: "End generic perks. Find out which benefits truly energize your team and which just exist on paper.", useCases: ["Benefits package redesign", "Comparing needs across groups", "ROI analysis of current benefits"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-perks?x_lang=en" },
    { emoji: "\ud83c\udfc5", name: "Recognition", desc: "Feeling valued = retention + performance", detail: "Make appreciation actually work. Shows whether the team feels truly valued, or if praise misses the mark. Recognition is a tool for productivity and retention.", useCases: ["Evaluating recognition program", "Identifying \u201cquiet\u201d contributors", "Strengthening feedback culture"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-recognition?x_lang=en" },
    { emoji: "\ud83d\udc41\ufe0f\u200d\ud83d\udde8\ufe0f", name: "Potential", desc: "Autonomy, growth, hidden leaders", detail: "Support growth from within. Find out if people feel they\u2019re using their strengths, if work supports their development, and if they have autonomy.", useCases: ["Identifying high-potentials", "Career path planning", "Evaluating L&D programs"] },
    { emoji: "\ud83d\udcab", name: "Values", desc: "EVP promise vs. reality, employer brand", detail: "Amplify authentic employee stories. Measures how strongly employees identify with what the company claims vs. what it actually does.", useCases: ["Employer brand audit", "EVP strategy preparation", "Measuring cultural fit post-M&A"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-values?x_lang=en" },
  ],
  demoSection: {
    title: "Try Echo Pulse yourself",
    subtitle: "Explore the dashboard with real data or experience the survey from an employee\u2019s perspective.",
    dashboard: {
      title: "Demo dashboard",
      desc: "Log in and explore results, trends, comments and Playbook recommendations.",
      url: "https://app.behavera.com/login",
      login: "pulsedemocs@behavera.com",
      password: "showdemo",
    },
    chatbot: {
      title: "Try the survey",
      desc: "Experience Echo Pulse from an employee\u2019s perspective \u2014 pick a topic and chat.",
    },
    signup: {
      title: "Want your own account?",
      desc: "Sign up and launch your first Pulse.",
      url: "https://www.behavera.com/start",
      label: "Sign up",
    },
    note: "The demo account is shared \u2014 your responses won\u2019t be saved and chat history resets between sessions.",
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { q: "How long does it take?", a: "2\u20133 minutes. Works on mobile, no login required. Employees don\u2019t need an account or installation." },
      { q: "Is it anonymous?", a: "Yes, 100%. No one sees individual responses. Data is aggregated per team (min. 3 people). Managers only see summary results." },
      { q: "How long is the Pulse open?", a: "7 days. Auto-reminders on day 2 and last day at 8:00 AM. We recommend communicating a 2\u20133 day deadline \u2014 shorter window = more urgency." },
      { q: "How often should we send?", a: "Ideally monthly. Consistency builds trust and enables trend tracking. Start with Quick Scan, then target specific areas based on results." },
      { q: "Do I need to install software?", a: "No. Everything runs in the browser. Mobile-first design, employees don\u2019t need an account or installation." },
      { q: "Is data secure?", a: "Yes. GDPR compliant, AES-256 encryption, data stored in EU (Frankfurt, AWS). Full GDPR compliance." },
      { q: "Can I customize topics?", a: "Yes, you can choose from 9 topics based on your team\u2019s needs. We recommend Quick Scan first for a full overview." },
      { q: "What if someone doesn\u2019t respond?", a: "Auto-reminders help. But the most effective is a personal nudge from their direct manager explaining why feedback matters." },
      { q: "What do employees experience?", a: "A short, interactive chatbot-style survey. 2\u20133 minutes, in Czech or English, on mobile or desktop. No login, no installation." },
      { q: "How to share results?", a: "On the dashboard you\u2019ll see Engagement Score, strengths, risks and specific Playbook recommendations. Share at Town Hall, in newsletter, or 1:1. Be transparent \u2014 share both strengths and weaknesses." },
      { q: "What is the Playbook?", a: "Playbook contains auto-generated recommendations based on your data. The more comments employees write, the more specific and targeted the tips." },
      { q: "How much does it cost?", a: "Pricing depends on company size. Contact us for a specific quote tailored to your needs." },
      { q: "What does the dashboard show?", a: "Engagement Score (overall engagement metric), strengths and risks by topic, team comparisons, trends over time, and employee comments. The Playbook provides specific recommendations for each identified risk." },
      { q: "How to interpret the Engagement Score?", a: "Score is on a 0\u2013100 scale. Above 70 = strong engagement, 50\u201370 = room for improvement, below 50 = action needed. More important than the absolute number is the trend \u2014 track how the score changes month to month." },
      { q: "What to do about low response rates?", a: "1) Ask leaders for a personal reminder. 2) Send a reminder with current % participation. 3) Emphasize it takes only 3 min. 4) Link completion to a specific moment (standup, lunch). 5) For the next Pulse, start communication earlier and involve leaders from the start." },
      { q: "What if results are negative?", a: "Negative results are valuable data, not a reason to panic. 1) Share them transparently \u2014 hiding them undermines trust. 2) Pick 1\u20132 most critical areas. 3) Present a concrete plan. 4) Communicate what you can\u2019t fix and why. 5) Track improvement in the next Pulse." },
      { q: "What user roles exist?", a: "Admin (HR/CEO): full access to settings, initiatives and results. Manager: sees their team\u2019s results. Employee: fills out the survey, no account needed." },
      { q: "How to add or remove employees?", a: "Go to Settings \u2192 People. Add name and email, or import CSV. To remove: click on the employee and choose Remove. Changes take effect in the next Pulse." },
      { q: "Do you support Slack or Teams?", a: "Invitations and reminders can be sent via email and Slack. Microsoft Teams integration is coming soon. For Slack, just copy the link from the Initiative and post it to your channel." },
    ],
    contact: "Didn\u2019t find your answer?",
  },
  cta: {
    title: "Need help?",
    subtitle: "Reach out to Veronika — she\u2019ll help with setup and results interpretation.",
    contactName: "Veronika Nováková",
    contactRole: "Customer Success",
    contactEmail: "veronika.novakova@behavera.com",
    contactPhone: "+420 775 922 506",
    consult: "Book a consultation",
    consultUrl: "/?demo=1",
  },
  nextLabels: {
    start: "How to communicate \u2192",
    comms: "Email templates \u2192",
    templates: "Monthly cycle \u2192",
    cycle: "Measurement topics \u2192",
    topics: "Try the demo \u2192",
    demo: "FAQ \u2192",
  },
  ui: {
    quickFacts: "Quick facts",
    copied: "Copied!",
    subject: "Subject",
    copyEmail: "Copy email",
    openDashboard: "Open dashboard",
    showCreds: "Show login credentials",
    password: "Password",
    copy: "Copy",
    topicsCount: "topics Echo Pulse measures",
    useFor: "Use for:",
    demo: "Demo",
    searchFaq: "Search questions…",
    progress: "done",
    allDone: "All set!",
    markDone: "Mark as done",
  },
};

/* ═══════════════════════════════════════════
 * COPY — DE (German)
 * Uses EN as base with German translations
 * ═══════════════════════════════════════════ */
const de: Copy = {
  ...en,
  meta: {
    title: "Echo Pulse Guide \u2014 Praktischer Leitfaden | Behavera",
    description: "Schritt f\u00fcr Schritt vom Konto bis zu den ersten Ergebnissen. E-Mail-Vorlagen, Kommunikationstipps, FAQ und Demo-Zugang.",
  },
  hero: {
    badge: "Echo Pulse Guide",
    title: "Starten Sie Ihren ersten Pulse",
    subtitle: "Alles was Sie brauchen \u2014 von der Kontoeinrichtung bis zur Ergebniskommunikation. An einem Ort.",
  },
  start: {
    ...en.start,
    title: "So starten Sie \u2014 Schritt f\u00fcr Schritt",
    steps: en.start.steps.map((s, i) => ({
      ...s,
      title: [
        "In Ihr Konto einloggen", "Unternehmen & Teams einrichten", "Initiative erstellen",
        "Kommunikation vorbereiten", "Mitarbeiter einladen", "Mit Quick Scan starten",
        "Ergebnisse erhalten", "Kommunizieren & wiederholen"
      ][i],
      why: [
        "Ein Pilot ist ein kostenloser Testbetrieb \u2014 wir richten alles f\u00fcr Sie ein. Self-Service-Registrierung ist f\u00fcr diejenigen, die sofort selbst starten m\u00f6chten.",
        "Korrekte Teamstruktur erm\u00f6glicht segmentierte Ergebnisse. Minimum 3 Personen pro Team f\u00fcr Anonymit\u00e4t.",
        "Eine Initiative ist Ihr Projekt \u2014 sie gruppiert Personen und Pulses zusammen.",
        "Vertrauen beginnt bei den F\u00fchrungskr\u00e4ften. Pers\u00f6nliche Einladung erh\u00f6ht die Antwortquote deutlich.",
        "Anonyme Links haben h\u00f6here Antwortquoten \u2014 Mitarbeiter f\u00fchlen sich sicherer.",
        "Quick Scan gibt Ihnen in 7 Tagen ein objektives Bild und klare Richtung f\u00fcr n\u00e4chste Schritte.",
        "Playbook enth\u00e4lt gezielte Tipps basierend auf Ihren Daten \u2014 mehr Kommentare = bessere Empfehlungen.",
        "Regelm\u00e4\u00dfigkeit baut Vertrauen auf. Mitarbeiter sehen, dass ihre Stimme z\u00e4hlt.",
      ][i],
      linkLabel: i === 0 ? "Einloggen" : s.linkLabel,
    })),
    tips: [
      "\u23f1 Ausf\u00fcllen: 2\u20133 Min. pro Person, mobil, ohne Anmeldung",
      "\ud83d\udd12 100 % anonym \u2014 niemand sieht individuelle Antworten",
      "\ud83d\udcc5 Pulse 7 Tage offen, kommunizieren Sie 2\u20133 Tage Frist",
      "\ud83d\udd14 Auto-Erinnerungen: Tag 2 um 8:00 und letzter Tag um 8:00",
      "\ud83d\udcca Durchschnittliche Antwortquote 85 %+",
      "\ud83c\udf0d Tschechisch und Englisch \u2014 Mitarbeiter w\u00e4hlen ihre Sprache",
    ],
    helpText: "Brauchen Sie Hilfe bei der Einrichtung? Kontaktieren Sie Veronika:",
  },
  comms: {
    ...en.comms,
    title: "Wie Sie Echo Pulse kommunizieren",
    intro: "Der Erfolg h\u00e4ngt davon ab, wie Sie es vorstellen. Beginnen Sie bei den F\u00fchrungskr\u00e4ften, dann unternehmensweit.",
    guidelines: en.comms.guidelines.map((g, i) => ({
      ...g,
      title: [
        "Erkl\u00e4ren Sie das \u201eWas\u201c und \u201eWarum\u201c",
        "Erkl\u00e4ren Sie die Anonymit\u00e4t",
        "Betonen Sie die Einfachheit",
        "Kurze Frist",
        "Ermutigen Sie Kommentare",
        "F\u00fchrungskr\u00e4fte einbeziehen",
        "Sprechen Sie einfach",
      ][i],
      desc: [
        "Teilen Sie Ihre Absicht mit. Sie m\u00f6chten verstehen, wie sich die Menschen bei der Arbeit f\u00fchlen \u2014 und es verbessern. Einfach, menschlich, ohne HR-Jargon. Beispiel: \u201eWir m\u00f6chten wissen, was Sie wirklich denken. Echo Pulse hilft uns zu verstehen, was Sie motiviert und was Sie zur\u00fckh\u00e4lt.\u201c",
        "Antworten sind anonym \u2014 Vorgesetzte/HR k\u00f6nnen keine individuellen Antworten sehen. Daten werden pro Team aggregiert (min. 3 Personen). Ziel ist nicht, mit dem Finger zu zeigen, sondern Bedingungen zu verbessern.",
        "3 Minuten, am Handy, ohne Anmeldung. Senden Sie einen 5-Min-Kalenderblocker. Kreative Anst\u00f6\u00dfe funktionieren: \u201eGeben Sie uns Feedback, bevor Ihr Mittagessen kalt wird.\u201c Verbinden Sie es mit einer Routine (Standup, Retro).",
        "Die meisten antworten innerhalb von 48h. L\u00e4ngeres Zeitfenster = weniger Dringlichkeit. Pulse ist 7 Tage offen, kommunizieren Sie 2\u20133.",
        "Je mehr Kommentare die Mitarbeiter schreiben, desto spezifischere und gezieltere Tipps erhalten Sie im Playbook. Ohne Kommentare bleiben Empfehlungen allgemein. Erinnern Sie daran, dass Kommentare ebenfalls anonym sind.",
        "Am meisten motiviert es, wenn der direkte Vorgesetzte um Teilnahme bittet und erkl\u00e4rt, warum gerade ihre Stimme wichtig ist. Eine kurze Erw\u00e4hnung im Meeting gen\u00fcgt.",
        "Verzichten Sie auf HR- und Business-Jargon. Verwenden Sie klare, menschliche Sprache. Menschen reagieren besser auf authentische Kommunikation als auf Unternehmensphrasen.",
      ][i],
    })),
    timing: {
      best: "\u2705 Dienstag/Mittwoch, 9:30\u201311:00 oder 13:00\u201315:00",
      worst: "\ud83d\udeab Montag (Aufholen), Freitag (Wochenend-Modus), direkt nach dem Mittagessen",
      why: "Dienstag/Mittwoch-Vormittage haben die h\u00f6chsten Antwortquoten.",
    },
    followUp: {
      title: "Nach dem Pulse \u2014 Ergebnisse teilen",
      items: [
        "\ud83d\ude4f Bedanken Sie sich f\u00fcr die Teilnahme und teilen Sie die Antwortquote \u2014 w\u00fcrdigen Sie, dass sich die Leute Zeit genommen haben",
        "\ud83d\udcca Fassen Sie die Ergebnisse zusammen \u2014 was funktioniert, wo die Risiken liegen. Seien Sie konkret",
        "\ud83c\udfaf Stellen Sie 1\u20132 konkrete Schritte + Zeitplan vor. Sie m\u00fcssen nicht alles auf einmal l\u00f6sen",
        "\ud83d\udcac Seien Sie ehrlich dar\u00fcber, was Sie jetzt nicht \u00e4ndern k\u00f6nnen (und wann Sie darauf zur\u00fcckkommen). Transparenz baut Vertrauen auf",
        "\ud83d\udd01 Verwenden Sie \u201eIhr habt gesagt / Wir haben gemacht\u201c-Geschichten \u2014 zeigen Sie, dass Feedback echte Wirkung hat",
        "\u267b\ufe0f Wiederholen Sie monatlich \u2014 einmalige Umfragen reichen nicht. Regelm\u00e4\u00dfigkeit ist der Schl\u00fcssel zur Ver\u00e4nderung",
      ],
    },
    nextTab: "\u2192 E-Mail-Vorlagen vorbereiten",
  },
  templates: {
    title: "E-Mail-Vorlagen \u2014 kopieren & senden",
    subtitle: "Passen Sie die [Klammern] an und senden Sie.",
    workflow: [
      "1\ufe0f\u20e3 Vor dem Start \u2192 \u201eF\u00fcr F\u00fchrungskr\u00e4fte\u201c senden",
      "2\ufe0f\u20e3 Am Starttag \u2192 \u201eF\u00fcr Mitarbeiter\u201c senden",
      "3\ufe0f\u20e3 Tag 2\u20133 \u2192 Erinnerung",
      "4\ufe0f\u20e3 Nach Abschluss \u2192 Nach Ergebnissen",
    ],
    list: [
      {
        id: "leaders-de",
        label: "F\u00fcr F\u00fchrungskr\u00e4fte",
        subject: "\ud83d\udc4b Echo Pulse startet \u2013 so k\u00f6nnen Sie unterst\u00fctzen",
        body: `Hallo zusammen,

am [Datum] starten wir Echo Pulse \u2013 eine kurze 3-min\u00fctige Umfrage, die uns hilft besser zu verstehen, wie sich die Menschen in unseren Teams f\u00fchlen, was sie motiviert und was sie m\u00f6glicherweise bremst.

\ud83d\udd14 Was Sie wissen m\u00fcssen:
HR wird eine unternehmensweite Nachricht versenden, aber Ihre Unterst\u00fctzung als F\u00fchrungskraft macht einen gro\u00dfen Unterschied. Eine kurze Erinnerung im Team-Meeting oder Slack kann die Beteiligung deutlich steigern.

\ud83d\udd0d Warum machen wir das?
\u2022 Engagierte Teams zeigen nachweislich h\u00f6here Produktivit\u00e4t und Bindung (Gallup, State of the Global Workplace).
\u2022 Die meisten Mitarbeiter teilen Bedenken nicht aktiv \u2013 ohne einen sicheren Feedback-Kanal bleiben Probleme verborgen.
\u2022 Regelm\u00e4\u00dfige Pulse Surveys sind Standard in Unternehmen, die aktiv mit Engagement arbeiten.

\ud83d\udca1 Warum es f\u00fcr Sie wichtig ist:
\u2022 Fr\u00fchzeitig Anzeichen von Desengagement erkennen \u2013 bevor die Motivation sinkt oder jemand Wichtiges geht.
\u2022 Vertrauen aufbauen \u2013 allein der Start der Umfrage signalisiert, dass Feedback willkommen ist.
\u2022 Klare n\u00e4chste Schritte \u2013 aggregierte Daten und konkrete Vorschl\u00e4ge basierend auf identifizierten Risiken.

\ud83d\udee0 Wie Sie helfen k\u00f6nnen:
1. Erw\u00e4hnen Sie die Umfrage kurz in Ihrem Team-Meeting oder Slack.
2. F\u00f6rdern Sie ehrliches, offenes Feedback \u2013 lassen Sie Ihr Team wissen, dass ihre Meinung z\u00e4hlt.
3. Sobald die Ergebnisse vorliegen, teilen wir Erkenntnisse und Vorschl\u00e4ge mit Ihnen.

Danke f\u00fcr Ihre Unterst\u00fctzung! \ud83d\udcac`,
      },
      {
        id: "employees-de",
        label: "F\u00fcr Mitarbeiter",
        subject: "Wie geht es Ihnen bei der Arbeit? Helfen Sie uns, es herauszufinden.",
        body: `Hallo zusammen,

wir m\u00f6chten, dass unser Arbeitsplatz nicht nur produktiv ist, sondern auch ein Ort, an dem sich Menschen wohlf\u00fchlen. Ein Raum, in dem jeder wachsen, sich konzentrieren und zusammenarbeiten kann.

Deshalb starten wir Echo Pulse von Behavera \u2013 eine regelm\u00e4\u00dfige, schnelle und anonyme Umfrage, die uns hilft besser zu verstehen, was Ihre Leistung und Ihr Wohlbefinden bei der Arbeit unterst\u00fctzt.

\ud83d\udca1 Warum es sich lohnt, mitzumachen:
\u2022 Es gibt Ihnen Raum zu teilen, was Sie antreibt \u2013 und was anders gemacht werden k\u00f6nnte.
\u2022 Es hilft uns, ein Umfeld zu schaffen, das Ihre Entwicklung und Ihr t\u00e4gliches Wohlbefinden unterst\u00fctzt.
\u2022 Ihre Stimme bewirkt echte Ver\u00e4nderung \u2013 wir gestalten die Zukunft gemeinsam.

\u2705 Was Sie erwartet:
\u23f1 Nur ~3 Minuten
\ud83d\udcf1 Auf dem Handy ausf\u00fcllbar
\ud83d\udcca Ergebnisse werden nur als Teamzusammenfassung geteilt
\ud83d\udda5\ufe0f Aggregierte Ergebnisse werden beim n\u00e4chsten Town Hall vorgestellt

\ud83d\udd50 Bitte f\u00fcllen Sie es bis zum [Datum] aus.

[PULSE LINK]

Danke, dass Sie uns helfen, einen Arbeitsplatz zu schaffen, an dem Menschen aufbl\u00fchen k\u00f6nnen! \ud83d\ude4c`,
      },
      {
        id: "reminder-de",
        label: "Erinnerung",
        subject: "\u23f0 Noch [X] Tage \u2014 Echo Pulse",
        body: `Hallo,

kurze Erinnerung \u2014 Echo Pulse ist noch offen und [X %] der Mitarbeiter haben bisher geantwortet.

Falls Sie es noch nicht geschafft haben, dauert es nur 3 Minuten:

[PULSE LINK]

\ud83d\udcc5 Schlie\u00dft am: [Datum]

Jede Stimme z\u00e4hlt \u2014 danke! \ud83d\udcac`,
      },
      {
        id: "results-de",
        label: "Nach Ergebnissen",
        subject: "\ud83d\udcca Echo Pulse Ergebnisse \u2014 was wir gelernt haben",
        body: `Hallo zusammen,

vielen Dank f\u00fcr die Teilnahme an Echo Pulse \u2014 [X %] von Ihnen haben geantwortet, das ist gro\u00dfartig! \ud83c\udf89

\ud83d\udcca Was wir herausgefunden haben:
\u2022 \u2705 St\u00e4rken: [ausf\u00fcllen]
\u2022 \u26a0\ufe0f Verbesserungsbereiche: [ausf\u00fcllen]

\ud83c\udfaf Was wir tun werden:
\u2022 [Konkreter Schritt 1]
\u2022 [Konkreter Schritt 2]
\u2022 [Zeitplan]

\ud83d\udcac Um transparent zu sein: [was wir jetzt nicht \u00e4ndern k\u00f6nnen und warum]

N\u00e4chster Pulse geplant f\u00fcr [Datum]. Ihr Feedback ist wichtig \u2014 danke! \ud83d\ude4f`,
      },
    ],
    nextTab: "\u2192 Monatszyklus ansehen",
  },
  cycle: {
    ...en.cycle,
    title: "Monatlicher Echo-Zyklus",
    subtitle: "Empfohlener Rhythmus. Passen Sie ihn an Ihr Tempo an \u2014 Konsistenz ist entscheidend.",
    weeks: [
      {
        week: "Woche 1",
        title: "Vorbereitung & Start",
        color: "#7C3AED",
        items: [
          "Tag 1: Initiative vorbereiten, Personenliste aktualisieren",
          "Tag 1: Thema w\u00e4hlen \u2014 Quick Scan (beim ersten Mal) oder basierend auf Ergebnissen",
          "Tag 1: E-Mail an F\u00fchrungskr\u00e4fte senden (Vorlage \u201eF\u00fcr F\u00fchrungskr\u00e4fte\u201c)",
          "Tag 2: Pulse starten (Dienstag/Mittwoch morgens ist ideal)",
          "Tag 3\u20135: Erinnerungen senden, F\u00fchrungskr\u00e4fte einbeziehen",
        ],
      },
      {
        week: "Woche 2",
        title: "Analyse & Teilen",
        color: "#2563EB",
        items: [
          "Tag 1: Dashboard pr\u00fcfen \u2014 Themen, St\u00e4rken, Risiken",
          "Tag 2\u20133: 1\u20132 realistische Verbesserungen priorisieren",
          "Tag 3: Mit F\u00fchrungskr\u00e4ften n\u00e4chste Schritte abstimmen",
          "Tag 4: Ergebnisse kommunizieren \u2014 Town Hall, Newsletter, 1:1",
        ],
      },
      {
        week: "Woche 3\u20134",
        title: "Aktion & Follow-up",
        color: "#059669",
        items: [
          "Ver\u00e4nderungen umsetzen \u2014 auch kleine Erfolge bauen Vertrauen auf",
          "Laufend informieren, was sich verbessert hat und was in Arbeit ist",
          "\u201eIhr habt gesagt / Wir haben gemacht\u201c-Geschichten verwenden",
          "Thema f\u00fcr den n\u00e4chsten Pulse basierend auf aktuellen Daten planen",
        ],
      },
    ],
    note: "Tipp: Sie m\u00fcssen nicht einen ganzen Monat warten. Bei dringenden Themen starten Sie den Pulse fr\u00fcher.",
    nextTab: "\u2192 Messthemen erkunden",
  },
  topicsList: [
    { emoji: "\ud83d\udd2e", name: "Quick Scan", desc: "Gesamter Engagement-\u00dcberblick \u2014 Ihr Ausgangspunkt", detail: "Ihr erster Pulse gibt Ihnen ein klares, objektives Bild \u00fcber alle Bereiche. Nutzen Sie ihn, um die gr\u00f6\u00dften L\u00fccken zu erkennen und zu entscheiden, worauf Sie sich als N\u00e4chstes konzentrieren.", useCases: ["Erstmessung f\u00fcr neue Kunden", "Vierterlj\u00e4hrlicher Engagement-Benchmark", "Schneller Vergleich zwischen Teams"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-initial?x_lang=en" },
    { emoji: "\ud83d\udca5", name: "Stress", desc: "Emotionale Seite der Arbeit, Burnout", detail: "Erkennen Sie Druck, bevor er die Leistung beeintr\u00e4chtigt. Misst die emotionale Seite der Arbeit \u2014 wie sich Menschen f\u00fchlen, wie die Arbeit sie beeinflusst.", useCases: ["Nach einer schwierigen Phase / Umstrukturierung", "Burnout-Risiko-Erkennung", "Bewertung von Work-Life-Balance-Initiativen"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-stress?x_lang=en" },
    { emoji: "\ud83e\udde0", name: "Arbeitsbelastung", desc: "Zeit, Fokus, Planung", detail: "Entschl\u00fcsseln Sie den Arbeitsfluss. Konzentriert sich auf Prozesse \u2014 wie viel Arbeit die Menschen haben, wie sie organisiert ist, ob sie Zeit und Planung managen.", useCases: ["Prozess- und Meeting-Optimierung", "Kapazit\u00e4tsplanung vor Wachstum", "Identifizierung von Team-Engp\u00e4ssen"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-workload?x_lang=en" },
    { emoji: "\ud83e\uddf0", name: "Tools & Unterst\u00fctzung", desc: "Technologie, Support, Onboarding", detail: "Finden Sie heraus, was hilft und was blockiert. Erfahren Sie, ob die Menschen die richtige Technologie, Unterst\u00fctzung und Feedback haben.", useCases: ["Vor dem Kauf neuer Tools", "Nach neuer Software-Implementierung", "Bewertung des Onboarding-Prozesses"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-tools?x_lang=en" },
    { emoji: "\ud83d\udcb8", name: "Verg\u00fctung", desc: "Transparenz, Fairness der Bezahlung", detail: "Schauen Sie \u00fcber den Gehaltszettel hinaus. Misst, wie fair, motivierend und transparent Mitarbeiter die Verg\u00fctung wahrnehmen.", useCases: ["Vor \u00dcberarbeitung der Gehaltspolitik", "Zufriedenheitsanalyse Comp & Ben", "Identifizierung von Fluktuationsrisiko durch Bezahlung"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-pay?x_lang=en" },
    { emoji: "\ud83e\udd38", name: "Benefits", desc: "Was motiviert vs. was niemand nutzt", detail: "Schluss mit generischen Perks. Finden Sie heraus, welche Benefits Ihr Team wirklich antreiben und welche nur auf dem Papier existieren.", useCases: ["Neugestaltung des Benefits-Pakets", "Vergleich der Bed\u00fcrfnisse verschiedener Gruppen", "ROI-Analyse bestehender Benefits"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-perks?x_lang=en" },
    { emoji: "\ud83c\udfc5", name: "Anerkennung", desc: "Wertsch\u00e4tzung = Bindung + Leistung", detail: "Machen Sie Wertsch\u00e4tzung wirkungsvoll. Zeigt, ob sich das Team wirklich gesch\u00e4tzt f\u00fchlt oder ob Lob ins Leere geht.", useCases: ["Bewertung des Anerkennungsprogramms", "Identifizierung \u201estiller\u201c Beitragender", "St\u00e4rkung der Feedback-Kultur"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-recognition?x_lang=en" },
    { emoji: "\ud83d\udc41\ufe0f\u200d\ud83d\udde8\ufe0f", name: "Potenzial", desc: "Autonomie, Wachstum, verborgene F\u00fchrer", detail: "F\u00f6rdern Sie Wachstum von innen. Erfahren Sie, ob Menschen das Gef\u00fchl haben, ihre St\u00e4rken zu nutzen, ob die Arbeit ihre Entwicklung f\u00f6rdert und ob sie Autonomie haben.", useCases: ["Identifizierung von High-Potentials", "Karrierepfad-Planung", "Bewertung von L&D-Programmen"] },
    { emoji: "\ud83d\udcab", name: "Werte", desc: "EVP-Versprechen vs. Realit\u00e4t, Arbeitgebermarke", detail: "Verst\u00e4rken Sie authentische Mitarbeitergeschichten. Misst, wie stark sich Mitarbeiter mit dem identifizieren, was das Unternehmen sagt vs. was es tut.", useCases: ["Audit der Arbeitgebermarke", "EVP-Strategievorbereitung", "Messung des Cultural Fit nach M&A"], demoUrl: "https://bibi.behavera.com/free/behiro/pulse-showcase-values?x_lang=en" },
  ],
  demoSection: {
    ...en.demoSection,
    title: "Probieren Sie Echo Pulse aus",
    subtitle: "Erkunden Sie das Dashboard mit echten Daten oder erleben Sie die Umfrage aus Mitarbeitersicht.",
    dashboard: {
      ...en.demoSection.dashboard,
      title: "Demo-Dashboard",
      desc: "Melden Sie sich an und erkunden Sie Ergebnisse, Trends, Kommentare und Playbook-Empfehlungen.",
    },
    chatbot: {
      title: "Umfrage ausprobieren",
      desc: "Erleben Sie Echo Pulse aus Mitarbeitersicht \u2014 w\u00e4hlen Sie ein Thema und chatten Sie.",
    },
    signup: {
      ...en.demoSection.signup,
      title: "Eigenes Konto erstellen?",
      desc: "Registrieren Sie sich und starten Sie Ihren ersten Pulse.",
      label: "Registrieren",
    },
    note: "Das Demo-Konto ist geteilt \u2014 Ihre Antworten werden nicht gespeichert.",
  },
  faq: {
    title: "H\u00e4ufig gestellte Fragen",
    items: [
      { q: "Wie lange dauert das Ausf\u00fcllen?", a: "2\u20133 Minuten. Funktioniert auf dem Handy, ohne Anmeldung. Mitarbeiter brauchen kein Konto und keine Installation." },
      { q: "Ist es anonym?", a: "Ja, 100 %. Niemand sieht individuelle Antworten. Daten werden pro Team aggregiert (min. 3 Personen). F\u00fchrungskr\u00e4fte sehen nur zusammengefasste Ergebnisse." },
      { q: "Wie lange ist der Pulse offen?", a: "7 Tage. Automatische Erinnerungen an Tag 2 und am letzten Tag um 8:00 Uhr. Wir empfehlen, eine Frist von 2\u20133 Tagen zu kommunizieren \u2014 k\u00fcrzeres Zeitfenster = mehr Dringlichkeit." },
      { q: "Wie oft soll ich senden?", a: "Idealerweise monatlich. Regelm\u00e4\u00dfigkeit baut Vertrauen auf und erm\u00f6glicht Trendverfolgung. Starten Sie mit Quick Scan, dann gezielt auf Bereiche basierend auf Ergebnissen." },
      { q: "Muss ich Software installieren?", a: "Nein. Alles l\u00e4uft im Browser. Mobile-First-Design, Mitarbeiter brauchen kein Konto und keine Installation." },
      { q: "Sind die Daten sicher?", a: "Ja. DSGVO-konform, AES-256-Verschl\u00fcsselung, Daten in der EU gespeichert (Frankfurt, AWS). Volle DSGVO-Compliance." },
      { q: "Kann ich Themen anpassen?", a: "Ja, Sie k\u00f6nnen aus 9 Themen basierend auf den Bed\u00fcrfnissen Ihres Teams w\u00e4hlen. Wir empfehlen zuerst Quick Scan f\u00fcr einen Gesamt\u00fcberblick." },
      { q: "Was, wenn jemand nicht antwortet?", a: "Automatische Erinnerungen helfen. Am effektivsten ist aber ein pers\u00f6nlicher Hinweis vom direkten Vorgesetzten, warum Feedback wichtig ist." },
      { q: "Was erleben die Mitarbeiter?", a: "Eine kurze, interaktive Chatbot-Umfrage. 2\u20133 Minuten, auf Tschechisch oder Englisch, auf dem Handy oder Desktop. Keine Anmeldung, keine Installation." },
      { q: "Wie teile ich die Ergebnisse?", a: "Auf dem Dashboard sehen Sie Engagement Score, St\u00e4rken, Risiken und spezifische Playbook-Empfehlungen. Teilen Sie beim Town Hall, im Newsletter oder 1:1. Seien Sie transparent \u2014 teilen Sie St\u00e4rken und Schw\u00e4chen." },
      { q: "Was ist das Playbook?", a: "Das Playbook enth\u00e4lt automatisch generierte Empfehlungen basierend auf Ihren Daten. Je mehr Kommentare Mitarbeiter schreiben, desto spezifischer und gezielter die Tipps." },
      { q: "Was kostet es?", a: "Kontaktieren Sie uns f\u00fcr ein individuelles Angebot basierend auf Ihrer Unternehmensgr\u00f6\u00dfe." },
      { q: "Was zeigt das Dashboard?", a: "Engagement Score (Gesamtkennzahl), St\u00e4rken und Risiken nach Thema, Teamvergleiche, Trends \u00fcber die Zeit und Mitarbeiterkommentare. Das Playbook bietet spezifische Empfehlungen f\u00fcr jedes identifizierte Risiko." },
      { q: "Wie interpretiere ich den Engagement Score?", a: "\u00dcber 70 = starkes Engagement, 50\u201370 = Verbesserungspotenzial, unter 50 = Handlungsbedarf. Wichtiger als die absolute Zahl ist der Trend \u2014 verfolgen Sie, wie sich der Score monatlich ver\u00e4ndert." },
      { q: "Was tun bei niedriger Beteiligung?", a: "1) Bitten Sie F\u00fchrungskr\u00e4fte um pers\u00f6nliche Erinnerung. 2) Senden Sie eine Erinnerung mit aktuellem Teilnahme-%. 3) Betonen Sie, dass es nur 3 Min. dauert. 4) Verkn\u00fcpfen Sie das Ausf\u00fcllen mit einem bestimmten Moment (Standup, Mittagessen). 5) Beim n\u00e4chsten Pulse fr\u00fcher kommunizieren." },
      { q: "Was, wenn die Ergebnisse negativ sind?", a: "Negative Ergebnisse sind wertvolle Daten, kein Grund zur Panik. 1) Transparent teilen. 2) 1\u20132 kritischste Bereiche w\u00e4hlen. 3) Konkreten Plan vorstellen. 4) Kommunizieren, was Sie nicht \u00e4ndern k\u00f6nnen und warum. 5) Verbesserung im n\u00e4chsten Pulse verfolgen." },
      { q: "Welche Benutzerrollen gibt es?", a: "Admin (HR/CEO): voller Zugriff auf Einstellungen, Initiativen und Ergebnisse. Manager: sieht die Ergebnisse seines Teams. Mitarbeiter: f\u00fcllt die Umfrage aus, kein Konto n\u00f6tig." },
      { q: "Wie f\u00fcge ich Mitarbeiter hinzu oder entferne sie?", a: "Gehen Sie zu Einstellungen \u2192 People. Name und E-Mail hinzuf\u00fcgen oder CSV importieren. Zum Entfernen: auf den Mitarbeiter klicken und Remove w\u00e4hlen. \u00c4nderungen gelten ab dem n\u00e4chsten Pulse." },
      { q: "Unterst\u00fctzen Sie Slack oder Teams?", a: "Einladungen und Erinnerungen k\u00f6nnen per E-Mail und Slack gesendet werden. Microsoft Teams-Integration kommt bald. F\u00fcr Slack kopieren Sie einfach den Link aus der Initiative und posten ihn in Ihrem Kanal." },
    ],
    contact: "Keine Antwort gefunden?",
  },
  cta: {
    title: "Brauchen Sie Hilfe?",
    subtitle: "Kontaktieren Sie Veronika \u2014 sie hilft bei Einrichtung und Ergebnisinterpretation.",
    contactName: "Veronika Nováková",
    contactRole: "Customer Success",
    contactEmail: "veronika.novakova@behavera.com",
    contactPhone: "+420 775 922 506",
    consult: "Beratung buchen",
    consultUrl: "/?demo=1",
  },
  nextLabels: {
    start: "Wie kommunizieren \u2192",
    comms: "E-Mail-Vorlagen \u2192",
    templates: "Monatszyklus \u2192",
    cycle: "Messthemen \u2192",
    topics: "Demo ausprobieren \u2192",
    demo: "FAQ \u2192",
  },
  ui: {
    quickFacts: "Kurzübersicht",
    copied: "Kopiert!",
    subject: "Betreff",
    copyEmail: "E-Mail kopieren",
    openDashboard: "Dashboard öffnen",
    showCreds: "Zugangsdaten anzeigen",
    password: "Passwort",
    copy: "Kopieren",
    topicsCount: "Themen, die Echo Pulse misst",
    useFor: "Verwenden f\u00fcr:",
    demo: "Demo",
    searchFaq: "In Fragen suchen…",
    progress: "erledigt",
    allDone: "Alles bereit!",
    markDone: "Als erledigt markieren",
  },
};

const allCopy = { cz, en, de };

/* ═══════════════════════════════════════════
 * SHARED COMPONENTS
 * ═══════════════════════════════════════════ */

function CopyButton({ text, label, copiedLabel = "Copied!" }: { text: string; label: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all", copied ? "bg-green-100 text-green-700" : "bg-brand-background-secondary text-brand-text-muted hover:bg-brand-accent/10 hover:text-brand-accent")}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? copiedLabel : label}
    </button>
  );
}

function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-brand-border last:border-0">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between py-4 text-left gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-lg">
        <span className="font-semibold text-base text-brand-text-primary group-hover:text-brand-accent transition-colors">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-brand-text-muted shrink-0 transition-transform duration-300", isOpen && "rotate-180 text-brand-accent")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <p className="pb-4 text-sm text-brand-text-body leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NextTabButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="mt-8 pt-6 border-t border-brand-border flex justify-end">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-brand-primary text-white hover:bg-brand-primary/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2">
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
 * TAB PANELS
 * ═══════════════════════════════════════════ */

const STORAGE_KEY = "echo-pulse-steps";
function useCheckedSteps(total: number) {
  const [checked, setChecked] = useState<Set<number>>(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? new Set(JSON.parse(raw)) : new Set(); } catch { return new Set(); }
  });
  const toggle = useCallback((idx: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);
  return { checked, toggle, count: checked.size, total };
}

function StartPanel({ c, onNext }: { c: Copy; onNext: () => void }) {
  const { checked, toggle, count, total } = useCheckedSteps(c.start.steps.length);
  const pct = Math.round((count / total) * 100);
  const allDone = count === total;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{c.start.title}</h2>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-brand-text-muted font-medium">{count}/{total} {c.ui.progress}</span>
          {allDone && (
            <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
              <PartyPopper className="w-4 h-4" /> {c.ui.allDone}
            </motion.span>
          )}
        </div>
        <div className="h-2 rounded-full bg-brand-background-secondary overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full transition-colors duration-500", allDone ? "bg-emerald-500" : "bg-brand-primary")}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {c.start.steps.map((s, idx) => {
          const isDone = checked.has(idx);
          return (
            <motion.div
              key={s.num}
              layout
              className={cn(
                "flex gap-3 p-4 rounded-xl border transition-all duration-300",
                isDone ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-brand-border hover:border-brand-accent/30 hover:shadow-sm"
              )}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="mt-0.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-full"
                aria-label={c.ui.markDone}
              >
                {isDone ? (
                  <CircleCheck className="w-7 h-7 text-emerald-500" />
                ) : (
                  <Circle className="w-7 h-7 text-brand-border hover:text-brand-accent transition-colors" />
                )}
              </button>
              <div className={cn("flex-1 transition-opacity duration-300", isDone && "opacity-60")}>
                <h3 className={cn("font-bold text-base mb-1", isDone ? "text-emerald-700 line-through decoration-emerald-300" : "text-brand-text-primary")}>
                  <span className="text-brand-text-muted mr-1.5">{s.num}.</span>{s.title}
                </h3>
                <p className="text-sm text-brand-text-body">{s.desc}</p>
                {s.why && !isDone && <p className="text-[13px] text-brand-text-primary/60 mt-1.5 italic">{s.why}</p>}
                {s.link && !isDone && (
                  <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-brand-accent border border-brand-accent/30 hover:bg-brand-accent/10 transition-colors">
                    {s.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="p-4 rounded-xl bg-brand-accent/5 border border-brand-accent/20 mb-4">
        <h3 className="font-bold text-base text-brand-text-primary mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-brand-accent" /> {c.ui.quickFacts}</h3>
        <ul className="space-y-1">
          {c.start.tips.map((tip, i) => {
            const parts = tip.match(/^(\S+)\s(.+)$/);
            if (parts) {
              return <li key={i} className="text-sm text-brand-text-body"><span aria-hidden="true">{parts[1]}</span> {parts[2]}</li>;
            }
            return <li key={i} className="text-sm text-brand-text-body">{tip}</li>;
          })}
        </ul>
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
        <img src={veronikaImg} alt={c.cta.contactName} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="text-left">
          <p className="text-sm text-brand-text-body">{c.start.helpText}</p>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <a href={`mailto:${c.cta.contactEmail}`} className="text-sm font-medium text-brand-accent hover:text-brand-primary transition-colors">{c.cta.contactEmail}</a>
            <a href={`tel:${c.cta.contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-brand-primary transition-colors"><Phone className="w-3 h-3" />{c.cta.contactPhone}</a>
          </div>
        </div>
      </div>
      <NextTabButton label={c.nextLabels.start} onClick={onNext} />
    </div>
  );
}

function CommsPanel({ c, onNext }: { c: Copy; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{c.comms.title}</h2>
      <p className="text-sm text-brand-text-body mb-6">{c.comms.intro}</p>
      <div className="space-y-3 mb-6">
        {c.comms.guidelines.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white border border-brand-border">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-brand-accent/10">
                <Icon className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <h3 className="font-bold text-base text-brand-text-primary mb-1">{g.title}</h3>
                <p className="text-sm text-brand-text-body">{g.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm">{c.comms.timing.best}</div>
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm">{c.comms.timing.worst}</div>
      </div>
      <p className="text-[13px] text-brand-text-primary/60 mb-6 ml-1">{c.comms.timing.why}</p>
      <div className="p-4 rounded-xl bg-brand-background-secondary border border-brand-border">
        <h3 className="font-bold text-base mb-3">{c.comms.followUp.title}</h3>
        <ul className="space-y-1.5">
          {c.comms.followUp.items.map((item, i) => {
            const parts = item.match(/^(\S+)\s(.+)$/);
            if (parts) {
              return <li key={i} className="text-sm text-brand-text-body"><span aria-hidden="true">{parts[1]}</span> {parts[2]}</li>;
            }
            return <li key={i} className="text-sm text-brand-text-body">{item}</li>;
          })}
        </ul>
      </div>
      <NextTabButton label={c.nextLabels.comms} onClick={onNext} />
    </div>
  );
}

function TemplatesPanel({ c, lang, onNext }: { c: Copy; lang: string; onNext: () => void }) {
  const [active, setActive] = useState(0);
  const t = c.templates.list[active];
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">{c.templates.title}</h2>
      <p className="text-sm text-brand-text-body mb-4">{c.templates.subtitle}</p>

      <div className="p-3 rounded-xl bg-brand-primary/5 border border-brand-primary/20 mb-5">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {c.templates.workflow.map((step, i) => (
            <span key={i} className="text-xs text-brand-text-body">{step}</span>
          ))}
        </div>
      </div>

      {/* #14 ARIA sub-tabs */}
      <div role="tablist" aria-label="Email templates" className="flex flex-wrap gap-1.5 mb-4">
        {c.templates.list.map((tpl, idx) => (
          <button
            key={tpl.id}
            type="button"
            role="tab"
            id={`tpl-tab-${tpl.id}`}
            aria-selected={active === idx}
            aria-controls={`tpl-panel-${tpl.id}`}
            tabIndex={active === idx ? 0 : -1}
            onClick={() => setActive(idx)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2", active === idx ? "bg-brand-primary text-white" : "bg-brand-background-secondary text-brand-text-muted hover:bg-brand-accent/10")}
          >
            {tpl.label}
          </button>
        ))}
      </div>

      <motion.div
        key={t.id}
        role="tabpanel"
        id={`tpl-panel-${t.id}`}
        aria-labelledby={`tpl-tab-${t.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl bg-white border-2 border-brand-primary/20 overflow-hidden shadow-sm"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-brand-primary/5 border-b border-brand-primary/20">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="text-xs font-medium text-brand-text-primary truncate">{c.ui.subject}: {t.subject}</span>
          </div>
          <CopyButton text={t.subject} label={c.ui.copy} copiedLabel={c.ui.copied} />
        </div>
        <div className="p-4">
          <div className="flex justify-end mb-3 pb-3 border-b border-brand-border">
            <CopyButton text={t.body} label={c.ui.copyEmail} copiedLabel={c.ui.copied} />
          </div>
          <pre className="whitespace-pre-wrap text-sm text-brand-text-body leading-relaxed font-sans">{t.body}</pre>
        </div>
      </motion.div>
      <NextTabButton label={c.nextLabels.templates} onClick={onNext} />
    </div>
  );
}

function CyclePanel({ c, onNext }: { c: Copy; onNext: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">{c.cycle.title}</h2>
      <p className="text-sm text-brand-text-body mb-8">{c.cycle.subtitle}</p>
      {/* Vertical timeline */}
      <div className="relative pl-8 space-y-8 mb-6">
        {/* Timeline line */}
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-[#7C3AED] via-[#2563EB] to-[#059669]" />
        {c.cycle.weeks.map((week, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.35 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-8 top-1 w-[27px] h-[27px] rounded-full border-[3px] border-white flex items-center justify-center shadow-sm" style={{ backgroundColor: week.color }}>
              <Calendar className="w-3 h-3 text-white" />
            </div>
            <div className="p-5 rounded-xl bg-white border border-brand-border hover:shadow-md transition-shadow duration-300" style={{ borderLeftColor: week.color, borderLeftWidth: 3 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide" style={{ color: week.color }}>{week.week}</span>
                <span className="text-xs text-brand-text-muted">—</span>
                <h3 className="font-bold text-base text-brand-text-primary">{week.title}</h3>
              </div>
              <ul className="space-y-2">
                {week.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-brand-text-body">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: week.color }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="text-[13px] text-brand-text-primary/60 italic">{c.cycle.note}</p>
      <NextTabButton label={c.nextLabels.cycle} onClick={onNext} />
    </div>
  );
}

function TopicsPanel({ c, lang, onNext }: { c: Copy; lang: string; onNext: () => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const preparingLabel = lang === "cz" ? "Připravujeme" : lang === "de" ? "In Vorbereitung" : "Coming soon";
  return (
    <div>
      <h2 className="text-2xl font-bold mb-5">{c.topicsList.length} {c.ui.topicsCount}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {c.topicsList.map((t, idx) => {
          const isOpen = expanded === idx;
          return (
            <motion.div
              key={idx}
              layout
              className={cn(
                "rounded-xl bg-white border border-brand-border overflow-hidden transition-all duration-200 hover:shadow-md hover:border-brand-accent/30",
                isOpen && "sm:col-span-2 border-brand-accent/30 shadow-md"
              )}
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">{t.emoji}</span>
                  <div>
                    <h3 className="font-bold text-base text-brand-text-primary group-hover:text-brand-accent transition-colors">{t.name}</h3>
                    <p className="text-sm text-brand-text-body">{t.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {t.demoUrl ? (
                    <a
                      href={t.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-brand-accent hover:bg-brand-accent/10 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      {c.ui.demo}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-brand-text-muted/50 cursor-default" title={preparingLabel}>
                      <Play className="w-3 h-3" />
                      {c.ui.demo}
                    </span>
                  )}
                  <ChevronDown className={cn("w-4 h-4 text-brand-text-muted transition-transform duration-300", isOpen && "rotate-180 text-brand-accent")} />
                </div>
              </button>
              <AnimatePresence>
                {isOpen && t.detail && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 border-t border-brand-border">
                      <p className="text-sm text-brand-text-body mt-3 leading-relaxed">{t.detail}</p>
                      {t.useCases && (
                        <div className="mt-3">
                          <span className="text-xs font-bold text-brand-text-muted uppercase tracking-wide">{c.ui.useFor}</span>
                          <ul className="mt-1.5 space-y-1">
                            {t.useCases.map((uc, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-brand-text-body">
                                <CheckCircle2 className="w-3 h-3 text-brand-accent shrink-0" />
                                {uc}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <NextTabButton label={c.nextLabels.topics} onClick={onNext} />
    </div>
  );
}

function DemoPanel({ c, lang, onNext }: { c: Copy; lang: string; onNext: () => void }) {
  const [showCreds, setShowCreds] = useState(false);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">{c.demoSection.title}</h2>
      <p className="text-sm text-brand-text-body mb-6">{c.demoSection.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-5 rounded-xl bg-white border border-brand-border">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-3">
            <Monitor className="w-5 h-5 text-brand-primary" />
          </div>
          <h3 className="font-bold text-base text-brand-text-primary mb-1">{c.demoSection.dashboard.title}</h3>
          <p className="text-sm text-brand-text-body mb-4">{c.demoSection.dashboard.desc}</p>
          <a href={c.demoSection.dashboard.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold bg-brand-primary text-white hover:bg-brand-primary/90 transition-all mb-3">
            <ExternalLink className="w-4 h-4" />
            {c.ui.openDashboard}
          </a>
          <div>
            <button type="button" onClick={() => setShowCreds(!showCreds)} className="text-xs text-brand-text-muted hover:text-brand-accent transition-colors flex items-center gap-1">
              <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", showCreds && "rotate-180")} />
              {c.ui.showCreds}
            </button>
            <AnimatePresence>
              {showCreds && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="mt-2 p-3 rounded-lg bg-brand-background-secondary text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-muted">Login:</span>
                      <span className="font-mono text-brand-text-primary">{c.demoSection.dashboard.login}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-text-muted">{c.ui.password}:</span>
                      <span className="font-mono text-brand-text-primary">{c.demoSection.dashboard.password}</span>
                    </div>
                    <CopyButton text={`${c.demoSection.dashboard.login}\n${c.demoSection.dashboard.password}`} label={c.ui.copy} copiedLabel={c.ui.copied} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-brand-border">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5 text-brand-accent" />
          </div>
          <h3 className="font-bold text-base text-brand-text-primary mb-1">{c.demoSection.chatbot.title}</h3>
          <p className="text-sm text-brand-text-body mb-4">{c.demoSection.chatbot.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {c.topicsList.filter(t => t.demoUrl).map((t, idx) => (
              <a key={idx} href={t.demoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-brand-background-secondary text-xs font-medium text-brand-text-primary hover:bg-brand-accent/10 hover:text-brand-accent transition-all border border-brand-border">
                <span aria-hidden="true">{t.emoji}</span> {t.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 border border-brand-primary/20 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <h3 className="font-bold text-base text-brand-text-primary">{c.demoSection.signup.title}</h3>
            <p className="text-sm text-brand-text-body">{c.demoSection.signup.desc}</p>
          </div>
          <a href={c.demoSection.signup.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shrink-0">
            <Rocket className="w-4 h-4" /> {c.demoSection.signup.label}
          </a>
        </div>
      </div>

      <p className="text-xs text-brand-text-muted flex items-start gap-1.5">
        <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {c.demoSection.note}
      </p>
      <NextTabButton label={c.nextLabels.demo} onClick={onNext} />
    </div>
  );
}

function FaqPanel({ c }: { c: Copy }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? c.faq.items.filter(item => {
        const q = search.toLowerCase();
        return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      })
    : c.faq.items;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{c.faq.title}</h2>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpenIdx(null); }}
          placeholder={c.ui.searchFaq}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-white text-sm text-brand-text-primary placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
        />
        {search && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-text-muted">
            {filtered.length}/{c.faq.items.length}
          </span>
        )}
      </div>
      <div className="rounded-xl bg-white border border-brand-border px-5">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-brand-text-muted">{c.faq.contact}</p>
        ) : (
          filtered.map((item, idx) => (
            <FaqItem key={item.q} q={item.q} a={item.a} isOpen={openIdx === idx} onToggle={() => setOpenIdx(openIdx === idx ? null : idx)} />
          ))
        )}
      </div>
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-sm text-brand-text-muted">{c.faq.contact}</p>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
          <img src={veronikaImg} alt={c.cta.contactName} className="w-10 h-10 rounded-full object-cover shrink-0" />
          <div className="text-left">
            <p className="text-sm font-semibold text-brand-text-primary">{c.cta.contactName}</p>
            <div className="flex flex-wrap items-center gap-3 mt-0.5">
              <a href={`mailto:${c.cta.contactEmail}`} className="text-sm text-brand-accent hover:text-brand-primary transition-colors">{c.cta.contactEmail}</a>
              <a href={`tel:${c.cta.contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-1 text-sm text-brand-accent hover:text-brand-primary transition-colors"><Phone className="w-3 h-3" />{c.cta.contactPhone}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
 * MAIN PAGE
 * ═══════════════════════════════════════════ */
const TAB_ORDER = ["start", "comms", "templates", "cycle", "topics", "demo", "faq"];

export function EchoPulsePage() {
  const { language } = useLanguage();
  const lang = language as "cz" | "en";
  const c = allCopy[lang] || allCopy.en;
  const tabConfig = tabs[lang] || tabs.en;
  const [activeTab, setActiveTab] = useState("start");
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(() => new Set(["start"]));
  const tabBarRef = useRef<HTMLDivElement>(null);

  useSEO({
    title: c.meta.title,
    description: c.meta.description,
    ogType: "website",
    canonicalUrl: `${SITE_ORIGIN}/guide`,
  });

  const switchTab = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setVisitedTabs(prev => { const next = new Set(prev); next.add(tabId); return next; });
    requestAnimationFrame(() => {
      if (tabBarRef.current) {
        const stickyOffset = 64;
        const barTop = tabBarRef.current.offsetTop - stickyOffset;
        window.scrollTo({ top: barTop, behavior: "instant" });
      }
    });
  }, []);

  const goNextTab = useCallback(() => {
    const idx = TAB_ORDER.indexOf(activeTab);
    if (idx < TAB_ORDER.length - 1) {
      switchTab(TAB_ORDER[idx + 1]);
    }
  }, [activeTab, switchTab]);

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent) => {
    const idx = TAB_ORDER.indexOf(activeTab);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = TAB_ORDER[(idx + 1) % TAB_ORDER.length];
      switchTab(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length];
      switchTab(prev);
    } else if (e.key === "Home") {
      e.preventDefault();
      switchTab(TAB_ORDER[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      switchTab(TAB_ORDER[TAB_ORDER.length - 1]);
    }
  }, [activeTab, switchTab]);

  return (
    <>
      {/* #4 Skip-to-content */}
      <a href="#guide-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-primary focus:text-white focus:text-sm focus:font-bold">
        {lang === "cz" ? "Přeskočit na obsah" : lang === "de" ? "Zum Inhalt springen" : "Skip to content"}
      </a>
      <Header />
      <main id="guide-content" className="pt-24 pb-16">
        {/* HERO */}
        <section className="py-10 md:py-14 bg-gradient-to-b from-[#FAFAFA] via-white to-white border-b border-brand-border">
          <div className="container-default max-w-[960px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-background-secondary text-brand-text-muted font-mono text-[10px] font-bold uppercase tracking-[0.15em] mb-4 border border-brand-border">
              <Sparkles className="w-3 h-3 text-brand-accent" />
              {c.hero.badge}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-3">
              {c.hero.title}
            </h1>
            <p className="text-base text-brand-text-body max-w-lg mx-auto mb-4">{c.hero.subtitle}</p>
            <div className="flex items-center justify-center gap-3 text-xs text-brand-text-muted">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-background-secondary border border-brand-border">
                <Users className="w-3 h-3" /> {lang === "de" ? "F\u00fcr HR & F\u00fchrungskr\u00e4fte" : lang === "cz" ? "Pro HR & lídry" : "For HR & Leaders"}
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-background-secondary border border-brand-border">
                <Clock className="w-3 h-3" /> {lang === "de" ? "~10 Min. Lesezeit" : lang === "cz" ? "~10 min čtení" : "~10 min read"}
              </span>
            </div>
          </div>
        </section>

        {/* TABS + CONTENT */}
        <div className="container-default max-w-[960px] mx-auto mt-8">
          {/* #2 ARIA tablist + #23 focus-visible + #5 type="button" + keyboard nav */}
          <div
            ref={tabBarRef}
            role="tablist"
            aria-label="Guide sections"
            onKeyDown={handleTabKeyDown}
            className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm border border-brand-border rounded-xl p-1.5 flex gap-1 overflow-x-auto mb-8 shadow-sm"
          >
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isVisited = visitedTabs.has(tab.id) && !isActive;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => switchTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                    isActive
                      ? "bg-brand-primary text-white shadow-sm"
                      : "text-brand-text-muted hover:bg-brand-background-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isVisited && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* #2 ARIA tabpanel + #22 consistent spacing */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              tabIndex={0}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="pt-2"
            >
              {activeTab === "start" && <StartPanel c={c} onNext={goNextTab} />}
              {activeTab === "comms" && <CommsPanel c={c} onNext={goNextTab} />}
              {activeTab === "templates" && <TemplatesPanel c={c} lang={lang} onNext={goNextTab} />}
              {activeTab === "cycle" && <CyclePanel c={c} onNext={goNextTab} />}
              {activeTab === "topics" && <TopicsPanel c={c} lang={lang} onNext={goNextTab} />}
              {activeTab === "demo" && <DemoPanel c={c} lang={lang} onNext={goNextTab} />}
              {activeTab === "faq" && <FaqPanel c={c} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* BOTTOM CTA — Veronika contact card */}
        <section className="mt-16 py-10 bg-gradient-to-b from-brand-primary via-[#1a0a3e] to-[#0d0520] text-white text-center">
          <div className="container-default max-w-[600px] mx-auto">
            <h2 className="text-2xl font-bold tracking-tight mb-2">{c.cta.title}</h2>
            <p className="text-sm text-white/80 mb-6">{c.cta.subtitle}</p>

            {/* Veronika contact card */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <img src={veronikaImg} alt={c.cta.contactName} className="w-16 h-16 rounded-full object-cover border-2 border-white/20" />
              <div>
                <p className="font-bold text-white">{c.cta.contactName}</p>
                <p className="text-xs text-white/50">{c.cta.contactRole}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`mailto:${c.cta.contactEmail}`} className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-8 text-sm font-bold bg-white text-brand-primary hover:bg-white/90 transition-all">
                <Mail className="w-4 h-4" /> {c.cta.contactEmail}
              </a>
              <a href={`tel:${c.cta.contactPhone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-8 text-sm font-bold bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all">
                <Phone className="w-4 h-4" /> {c.cta.contactPhone}
              </a>
            </div>
            <div className="mt-4">
              <a href={c.cta.consultUrl} className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" /> {c.cta.consult}
              </a>
            </div>

            <div className="flex items-center justify-center gap-5 mt-6 text-xs text-white/40">
              <span className="flex items-center gap-1" title={lang === "cz" ? "Splňujeme GDPR" : lang === "de" ? "DSGVO-konform" : "GDPR compliant"}><Shield className="w-3 h-3" /> GDPR</span>
              <span className="flex items-center gap-1" title={lang === "cz" ? "Data šifrována AES-256" : lang === "de" ? "AES-256-Verschlüsselung" : "AES-256 encryption"}><Clock className="w-3 h-3" /> AES-256</span>
              <span className="flex items-center gap-1" title={lang === "cz" ? "Data uložena v EU" : lang === "de" ? "Daten in der EU gespeichert" : "Data stored in EU"}><CheckCircle2 className="w-3 h-3" /> EU data</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
