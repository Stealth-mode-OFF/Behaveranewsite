export type Language = "en" | "cz" | "de";

export const translations = {
  en: {
    radar: {
      badge: "Full Spectrum Analysis",
      title: "9 Dimensions",
      titleHighlight: "of Work Reality",
      subtitle: "Echo Pulse continuously monitors 9 critical dimensions of work reality. No noise. Just clear signals where friction is building.",
      methodology: "Methodology grounded in Job Demands–Resources (JD-R), Self-Determination Theory, and Equity Theory.",
      signals: {
        mood: { title: "Emotional State", question: "How is the team actually feeling?", metrics: ["Well-being", "Valence", "Affect"] },
        stress: { title: "Stress & Pressure", question: "Is pressure driving performance or burnout?", metrics: ["Chronic Stress", "Spillover", "Recovery"] },
        workload: { title: "Capacity & Load", question: "Are demands matching capacity?", metrics: ["Cognitive Load", "Priorities", "Pace"] },
        tools: { title: "Enablement", question: "Do they have what they need to win?", metrics: ["Friction", "Resources", "Barriers"] },
        recognition: { title: "Recognition", question: "Is good work being seen?", metrics: ["Visibility", "Appreciation", "Impact"] },
        growth: { title: "Potential", question: "Are we using their full capability?", metrics: ["Autonomy", "Challenge", "Fit"] },
        rewards: { title: "Fairness", question: "Is the exchange perceived as fair?", metrics: ["Compensation", "Equity", "Hygiene"] },
        benefits: { title: "Benefits", question: "Do perks actually matter?", metrics: ["Relevance", "Utility", "ROI"] },
        evp: { title: "Values & Loyalty", question: "Do we walk the talk?", metrics: ["Pride", "Alignment", "Promise"] }
      }
    },
    header: {
      product: "Product",
      solutions: "Solutions",
      pricing: "Pricing",
      about: "About",
      login: "Log in",
      bookDemo: "Book a Demo",
      nav: {
        problem: "Problem",
        solution: "Solution",
        impact: "Impact"
      },
    },
    hero: {
      badge: "Continuous Insight System • V2.0",
      title: "Manage culture",
      titleHighlight: "exactly like finance.",
      subtitle: "Real data instead of feelings. Echo Pulse replaces annual surveys with a continuous signal system, giving leadership certainty that the company is sustainable.",
      primaryCta: "Schedule Consultation",
      secondaryCta: "Demo (3 min)",
      riskReversal: "No commitment. Leave with a clear picture of what's happening in your company.",
      trust: {
        security: "Data Security (GDPR)",
        support: "Native Support",
        implementation: "48h Implementation"
      },
    },
    problems: {
      badge: "Critical System Blindness",
      title: "The silent killer of stability.",
      subtitle: "Intuition and delayed feedback create management blindness. Traditional tools measure consequences, not causes.",
      items: [
        {
          title: "Hidden Reasons",
          value: "72%",
          desc: "Exit reasons you'll never hear in exit interviews. They stay in private chats.",
        },
        {
          title: "Productivity Loss",
          value: "-24%",
          desc: "Average performance drop during 'Quiet Quitting'.",
        },
        {
          title: "Detection Delay",
          value: "8.5mo",
          desc: "Time a problem exists before management notices and acts.",
        },
      ],
      ctaBox: {
        title: "You can't manage this with 'gut feeling'.",
        desc: "You need hard data. Without it, you're just guessing why people leave."
      }
    },
    howItWorks: {
      title: "Operating System",
      titleHighlight: "for your culture.",
      subtitle: "One system to replace annual surveys, random 1:1s, and assumptions. Structured data you can build decisions on.",
      steps: {
        step1: {
          title: "Contextual Intelligence",
          desc: "Echo Pulse doesn't just count keywords. It understands context, sarcasm, and urgency. From thousands of answers, it extracts 3 priorities you must address immediately."
        },
        step2: {
          title: "Auto-Pilot",
          desc: "Feedback without forms. Echo Pulse asks automatically where people work (Slack, Teams, Email). Short pulses. Real answers. No admin.",
          highlight: "System watches rhythm and fatigue. You get clean signals."
        },
        step3: {
          title: "Action Playbooks",
          desc: "From problem to solution. Echo suggests concrete steps for managers."
        },
        step4: {
          title: "100% Anonymity",
          desc: "We guarantee a 'Psychological Safety Layer'. Employees know they can speak openly without risk."
        }
      }
    },
    methodology: {
      title: "Scientific Instrument, Not a 'Happiness Survey'.",
      subtitle: "We separate signal from noise. Echo Pulse is designed to protect people's time and deliver valid data for decision making.",
      cards: [
        {
          title: "We Don't Hunt 'Happiness'",
          desc: "We don't care about superficial satisfaction, but functional stability. We measure risks, friction, and performance barriers. Data, not feelings."
        },
        {
          title: "90 Seconds a Month",
          desc: "Maximum respect for focus. No 20-minute surveys. Our 'Low-Friction' protocol guarantees high response rates without annoyance."
        },
        {
          title: "Core: JD-R Model",
          desc: "Everything is built on the Job Demands-Resources model. We measure the balance between demands on employees and the resources you provide."
        }
      ]
    },
    czechReality: {
      title: "Most companies today are in one of two extremes.",
      subtitle: "The market is polarizing. Whether we talk to corporations or tech companies, we see the same pattern. The capacity to see reality in time is missing.",
      archetypeA: {
        title: "A) Burnout Stability",
        point1: {
          title: "Inertia and fatigue.",
          desc: "People are loyal but passive. Processes are followed, but energy is missing. Changes face 'silent resistance'."
        },
        point2: {
          title: "Slow leadership reaction.",
          desc: "Management is detached from the 'production line'. They learn about problems only when it's too late."
        },
        diagnosis: "Loss of competitiveness without warning."
      },
      archetypeB: {
        title: "B) Speed on Credit",
        point1: {
          title: "Adrenaline blindness.",
          desc: "Young management, extreme pace. Everyone is 'swamped'. No time for reflection."
        },
        point2: {
          title: "Fragile success.",
          desc: "Results grow, but culture crumbles. People run on credit. The first crisis can cause collapse."
        },
        diagnosis: "Risk of sudden departure of key talents."
      },
      synthesis: {
        title: "Regardless of scenario, the solution isn't 'motivation'.",
        desc: "You need an early warning system. A stabilizer in chaos."
      }
    },
    roleSelection: {
      title: "You see the company from a different position.",
      subtitle: "We account for that. Choose your perspective.",
      investor: {
        role: "Investor",
        title: "Asset Protection",
        list: [
          "Risk Prediction",
          "Portfolio Health Visibility"
        ],
        cta: "Check portfolio health"
      },
      ceo: {
        role: "CEO / Owner",
        title: "Strategic Control",
        list: [
          "Early Warning Signals",
          "Eliminating Management Blind Spots"
        ],
        cta: "See company from above"
      },
      hr: {
        role: "HR / People Ops",
        title: "Data over Impressions",
        list: [
          "Arguments backed by hard data",
          "Less firefighting, more prevention"
        ],
        cta: "Get data for leadership"
      },
      teamLeader: {
        role: "Team Leader",
        title: "Team Performance",
        list: [
          "Instant Feedback Loop",
          "Early Burnout Detection"
        ],
        cta: "Improve team health"
      }
    },
    valueByRole: {
      title: "One platform, two different outputs.",
      subtitle: "CEO needs a signal for decisions. HR needs a tool for prevention. Echo Pulse delivers both without creating information noise.",
      ceo: {
        title: "For CEO & Executives",
        desc: "The definitive end of 'gut feeling management'. See exactly which departments are overloaded, where turnover threatens, and where strategy communication fails.",
        list: [
          { title: "Retention Radar", desc: "Identify key people at risk of leaving 3 months in advance." },
          { title: "Strategy Audit", desc: "Real data on whether teams understand your priorities or run on inertia." },
          { title: "Investment Protection", desc: "Protect recruitment and onboarding costs by reducing turnover." }
        ]
      },
      hr: {
        title: "For HR Management",
        desc: "Shift from 'firefighting' to prevention. Get data that makes leadership treat you as a strategic partner, not admin.",
        list: [
          { title: "Data over Impressions", desc: "When you go to the CEO with a problem, bring hard numbers, not 'kitchen complaints'." },
          { title: "Pulse Automation", desc: "No manual survey sending. System runs itself, you solve results." },
          { title: "Culture of Trust", desc: "Employees see things changing. Willingness to share truth grows." }
        ]
      },
      bottomBadge: "Designed for companies from 30 to 350 employees"
    },
    dashboard: {
      badge: "Executive Visibility",
      title: "See what only colleagues",
      titleHighlight: "at the coffee machine saw before.",
      subtitle: "Echo Pulse aggregates fragmented signals into one understandable dashboard.",
      features: [
        { title: "Mood X-Ray", desc: "Instant overview of how different teams feel. Breakdown by department, location, or seniority." },
        { title: "Toxic Spot Detection", desc: "System alerts on anomalies indicating bullying, burnout, or management failure." },
        { title: "Intervention Prioritization", desc: "Don't know what to solve first? Echo ranks problems by business impact and turnover risk." }
      ]
    },
    cta: {
      title: "Don't wait for the next resignation.",
      subtitle: "Blindness costs companies millions annually in lost productivity and hiring. Regain control in 48 hours.",
      primary: "Schedule Consultation",
      secondary: "or",
      secondaryLink: "+420 777 123 456",
      benefits: [
        { title: "No Commitment", desc: "Initial consultation and demo are free. Understand system logic in 20 minutes." },
        { title: "Privacy Guarantee", desc: "Full GDPR and ISO 27001 compliance. Your data is safe on European servers." },
        { title: "Fast Start", desc: "Implementation needs no IT department. We connect to your existing tools (M365, Slack)." }
      ]
    },
    footer: {
      rights: "Behavera s.r.o. All rights reserved.",
      legal: ["Terms", "Privacy"],
      links: ["Product", "Pricing", "About", "Contact"]
    },
    booking: {
        title: "Schedule Consultation",
        desc: "Select a time that works for you. We'll show you how Echo Pulse can help your specific situation.",
    },
    demoVideo: {
        title: "See Echo Pulse in Action",
    },
    decisionLock: {
      title: "Both extremes share the same issue: leadership loses visibility.",
      subtitle: "Echo Pulse restores visibility without slowing the company.",
      cta: "I want to see signals from our reality"
    },
    faq: {
      title: "FAQ",
      desc: "Have more questions? Our support team is ready to help.",
      contact: "Contact us →",
      items: [
        { q: "How complex is implementation?", a: "Minimal. Echo Pulse is a cloud solution. Just upload employee list and start measuring in 24 hours." },
        { q: "Is feedback truly anonymous?", a: "Yes, anonymity is key. Results are aggregated, never showing individual answers if group has fewer than 5 members." },
        { q: "How often are surveys sent?", a: "You set the frequency. We recommend short 'pulse' surveys every 14 days or month." },
        { q: "How much does it cost?", a: "Price depends on employee count. We offer transparent monthly or yearly subscription." },
        { q: "Integration with Slack/Teams?", a: "Yes, Echo Pulse sends notifications and surveys directly to tools you already use." }
      ]
    },
    leadPopup: {
      badge: "New Study 2026",
      title: "People leave even good companies. Why?",
      subtitle: "Exclusive data from 50+ companies. Uncover the real reasons for performance drops that annual surveys miss.",
      emailPlaceholder: "name@company.com",
      inputLabel: "Where should we send the E-book?",
      cta: "Download Study for Free",
      socialProofPre: "Already downloaded by",
      socialProofCount: "1,200+",
      socialProofPost: "leaders",
      quote: "Data that changes how we view people management.",
      successTitle: "E-book is on the way!",
      successMessage: "Check your inbox. We've just sent you the study.",
      close: "Close"
    },
    data: {
      trustedBy: "Trusted by HR Leaders"
    },
    forms: {
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone Number",
      workEmail: "Work Email",
      submit: "Submit"
    },
    calculator: {
      sliders: {
        companySize: "Company Size"
      }
    }
  },
  cz: {
    radar: {
      badge: "Full Spectrum Analysis",
      title: "9 dimenzí",
      titleHighlight: "pracovní reality",
      subtitle: "Echo Pulse kontinuálně monitoruje 9 kritických dimenzí pracovní reality. Žádný šum. Jen jasné signály tam, kde vzniká tření.",
      methodology: "Metodika podložena modely Job Demands–Resources (JD-R), Self-Determination Theory a Equity Theory.",
      signals: {
        mood: { title: "Emoční stav", question: "Jak se tým skutečně cítí?", metrics: ["Well-being", "Valence", "Afekt"] },
        stress: { title: "Stres a tlak", question: "Je tlak motorem nebo cestou k vyhoření?", metrics: ["Chronický stres", "Přetížení", "Regenerace"] },
        workload: { title: "Kapacita a zátěž", question: "Odpovídají nároky kapacitám?", metrics: ["Kognitivní zátěž", "Priority", "Tempo"] },
        tools: { title: "Podpora a nástroje", question: "Mají lidé to, co potřebují k výsledkům?", metrics: ["Tření", "Zdroje", "Bariéry"] },
        recognition: { title: "Uznání a zpětná vazba", question: "Je dobrá práce vidět?", metrics: ["Viditelnost", "Ocenění", "Dopad"] },
        growth: { title: "Potenciál", question: "Využíváme naplno jejich schopnosti?", metrics: ["Autonomie", "Výzvy", "Soulad"] },
        rewards: { title: "Odměňování", question: "Je směna vnímána jako férová?", metrics: ["Kompenzace", "Spravedlnost", "Hygiena"] },
        benefits: { title: "Benefity", question: "Mají benefity reálnou hodnotu?", metrics: ["Relevance", "Užitečnost", "ROI"] },
        evp: { title: "Hodnoty a loajalita", question: "Žijeme to, co hlásáme?", metrics: ["Hrdost", "Soulad", "Slib"] }
      }
    },
    header: {
      product: "Produkt",
      solutions: "Řešení",
      pricing: "Ceník",
      about: "O nás",
      login: "Přihlásit se",
      bookDemo: "Rezervovat demo",
      nav: {
        problem: "Problém",
        solution: "Řešení",
        impact: "Dopad"
      },
    },
    hero: {
      badge: "Systém Kontinuálního Vhledu • V2.0",
      title: "Odhalte včas",
      titleHighlight: "problémy ve svých týmech",
      subtitle: "Bez průběžných signálů vedete firmu naslepo — a platíte to v odchodech, výkonu a chaotických prioritách.",
      primaryCta: "Domluvit online schůzku (30 minut)",
      secondaryCta: "Získat přístup do demo aplikace",
      riskReversal: "Bez závazku. Odejdete s jasným obrazem, co se ve firmě děje a kde se láme udržitelnost.",
      trust: {
        security: "Bezpečnost dat (GDPR)",
        support: "Podpora v češtině",
        implementation: "Implementace 1 hodina"
      },
    },
    problems: {
      badge: "Kritická systémová slepota",
      title: "Tichý zabiják stability.",
      subtitle: "Intuice a zpožděná zpětná vazba vytvářejí manažerskou slepotu. Tradiční nástroje měří následky, ne příčiny.",
      items: [
        {
          title: "Skryté důvody",
          value: "72%",
          desc: "Důvody odchodů, které se nikdy nedozvíte z exit interview. Zůstávají v soukromých chatech.",
        },
        {
          title: "Ztráta produktivity",
          value: "-24%",
          desc: "Průměrný pokles výkonu zaměstnance v období 'tiché výpovědi' (Quiet Quitting).",
        },
        {
          title: "Zpoždění detekce",
          value: "8,5 měs.",
          desc: "Doba, po kterou problém existuje, než si ho management všimne a začne řešit.",
        },
      ],
      ctaBox: {
        title: "Tohle nelze 'uřídit' citem.",
        desc: "Potřebujete tvrdá data. Bez nich jen hádáte, proč lidé odcházejí."
      }
    },
    howItWorks: {
      title: "Operační systém",
      titleHighlight: "pro vaši kulturu.",
      subtitle: "Jeden systém, který nahradí výroční průzkumy, náhodné 1:1 konverzace a domněnky. Strukturovaná data, na kterých můžete stavět rozhodnutí.",
      steps: {
        step1: {
          title: "Kontextová inteligence",
          desc: "Echo Pulse nepočítá jen klíčová slova. Chápe kontext, sarkasmus a naléhavost. Z tisíců odpovědí vytáhne 3 priority, které musíte řešit hned."
        },
        step2: {
          title: "Autopilot",
          desc: "Zpětná vazba bez formulářů. Echo Pulse se ptá automaticky tam, kde lidé pracují (Slack, Teams, E-mail). Krátké pulsy. Reálné odpovědi. Žádná administrativa.",
          highlight: "Systém hlídá rytmus a únavu respondentů. Vy dostáváte čisté signály."
        },
        step3: {
          title: "Akční plány",
          desc: "Od problému k řešení. Echo navrhne konkrétní kroky pro manažery."
        },
        step4: {
          title: "100% Anonymita",
          desc: "Garantujeme 'vrstvu psychologického bezpečí'. Zaměstnanci ví, že mohou mluvit otevřeně bez rizika."
        }
      }
    },
    methodology: {
      title: "Vědecký nástroj, ne 'dotazník'.",
      subtitle: "Oddělujeme signál od šumu. Echo Pulse transformuje pocity na řídicí systém.",
      cards: [
        {
          title: "Data (Signál)",
          desc: "Ne měření spokojenosti. Sledujeme tvrdé metriky udržitelnosti a rizika vyhoření. (90s / měsíc)"
        },
        {
          title: "Analýza (Kontext)",
          desc: "Ne reporty. Dostáváte rozhodovací kontext. Systém automaticky identifikuje priority."
        },
        {
          title: "Akce (Dopad)",
          desc: "Ne kampaně. Průběžná viditelnost a konkrétní 'Action Plans' pro manažery."
        }
      ]
    },
    czechReality: {
      title: "Většina českých firem je dnes v jednom ze dvou extrémů.",
      subtitle: "Náš trh se polarizuje. Ať už mluvíme s korporacemi nebo technologickými firmami, narážíme na stejný vzorec. Chybí schopnost vidět realitu včas.",
      archetypeA: {
        title: "A) Vyhořelá stabilita",
        point1: {
          title: "Setrvačnost a únava.",
          desc: "Lidé jsou loajální, ale pasivní. Procesy se dodržují, ale chybí energie. Změny narážejí na 'tichý odpor'."
        },
        point2: {
          title: "Pomalá reakce vedení.",
          desc: "Management je odtržený od 'výrobní linky'. O problémech se dozvídá, až když je pozdě."
        },
        diagnosis: "Ztráta konkurenceschopnosti bez varování."
      },
      archetypeB: {
        title: "B) Rychlost na dluh",
        point1: {
          title: "Adrenalinová slepota.",
          desc: "Mladý management, extrémní tempo. Všichni 'nestíhají'. Není čas na reflexi."
        },
        point2: {
          title: "Křehký úspěch.",
          desc: "Výsledky rostou, ale kultura se drolí. Lidé jedou na dluh. První krize může způsobit kolaps."
        },
        diagnosis: "Riziko náhlého odchodu klíčových talentů."
      },
      synthesis: {
        title: "Bez ohledu na scénář, řešení není 'motivace'.",
        desc: "Potřebujete systém včasného varování. Stabilizátor v chaosu."
      }
    },
    roleSelection: {
      title: "Díváte se na firmu z jiné pozice.",
      subtitle: "My s tím počítáme. Vyberte si perspektivu.",
      investor: {
        role: "Investor",
        title: "Ochrana investice",
        list: [
          "Predikce rizik",
          "Viditelnost zdraví portfolia"
        ],
        cta: "Zkontrolovat zdraví portfolia"
      },
      ceo: {
        role: "CEO / Majitel",
        title: "Strategická kontrola",
        list: [
          "Signály včasného varování",
          "Eliminace slepých míst v managementu"
        ],
        cta: "Chci vidět firmu z výšky"
      },
      hr: {
        role: "HR / People Ops",
        title: "Data místo dojmů",
        list: [
          "Argumenty podložené tvrdými daty",
          "Méně hašení požárů, více prevence"
        ],
        cta: "Chci mít data pro vedení"
      },
      teamLeader: {
        role: "Team Leader",
        title: "Výkon týmu",
        list: [
          "Okamžitá zpětná vazba",
          "Včasná detekce vyhoření"
        ],
        cta: "Zlepšit zdraví týmu"
      }
    },
    valueByRole: {
      title: "Jedna platforma, dva různé výstupy.",
      subtitle: "CEO potřebuje signál k rozhodnutí. HR potřebuje nástroj k prevenci. Echo Pulse doručuje obojí, aniž by vytvářel informační šum.",
      ceo: {
        title: "Pro CEO a vedení",
        desc: "Definitivní konec 'pocitového managementu'. Vidíte přesně, která oddělení jsou přetížená, kde hrozí odchody a kde selhává komunikace strategie.",
        list: [
          { title: "Retenční radar", desc: "Identifikace klíčových lidí v riziku odchodu 3 měsíce předem." },
          { title: "Audit strategie", desc: "Reálná data o tom, zda týmy chápou vaše priority, nebo jedou na setrvačnost." },
          { title: "Investiční ochrana", desc: "Ochrana nákladů na nábor a onboarding skrze snížení fluktuace." }
        ]
      },
      hr: {
        title: "Pro HR Management",
        desc: "Posun od 'hašení požárů' k prevenci. Získáte data, díky kterým vás bude vedení brát jako strategického partnera, ne jako administrativu.",
        list: [
          { title: "Data místo dojmů", desc: "Když jdete za CEO s problémem, nesete tvrdá čísla, ne 'stížnosti z kuchyňky'." },
          { title: "Automatizace pulsů", desc: "Žádné ruční rozesílání dotazníků. Systém běží sám, vy řešíte jen výsledky." },
          { title: "Kultura důvěry", desc: "Zaměstnanci vidí, že se věci mění. Tím roste ochota sdílet pravdu." }
        ]
      },
      bottomBadge: "Navrženo pro firmy od 30 do 350 zaměstnanců"
    },
    dashboard: {
      badge: "Exekutivní přehled",
      title: "Vidíte to, co dřív viděli jen",
      titleHighlight: "kolegové u kávovaru.",
      subtitle: "Echo Pulse agreguje fragmentované signály do jednoho srozumitelného dashboardu.",
      features: [
        { title: "Rentgen nálady", desc: "Okamžitý přehled o tom, jak se cítí různé týmy. Rozklíčování dle oddělení, lokality nebo seniority." },
        { title: "Detekce toxických ohnisek", desc: "Systém upozorní na anomálie, které naznačují šikanu, vyhoření nebo selhání manažera." },
        { title: "Prioritizace zásahů", desc: "Nevíte, co řešit dřív? Echo seřadí problémy podle dopadu na byznys a rizika odchodů." }
      ]
    },
    cta: {
      title: "Nečekejte na další výpověď.",
      subtitle: "Slepota stojí české firmy miliony ročně na ztracené produktivitě a náboru. Získejte kontrolu zpět během 48 hodin.",
      primary: "Sjednat konzultaci",
      secondary: "nebo",
      secondaryLink: "+420 777 123 456",
      benefits: [
        { title: "Bez závazků", desc: "Úvodní konzultace a demo ukázka jsou zdarma. Pochopíte logiku systému za 20 minut." },
        { title: "Garance soukromí", desc: "Plný soulad s GDPR a ISO 27001. Vaše data jsou v bezpečí na evropských serverech." },
        { title: "Rychlý start", desc: "Implementace nevyžaduje IT oddělení. Napojíme se na vaše stávající nástroje (M365, Slack)." }
      ]
    },
    footer: {
      rights: "Behavera s.r.o. Všechna práva vyhrazena.",
      legal: ["Podmínky", "Soukromí"],
      links: ["Produkt", "Ceník", "O nás", "Kontakt"]
    },
    booking: {
        title: "Sjednat konzultaci",
        desc: "Vyberte si čas, který vám vyhovuje. Ukážeme vám, jak Echo Pulse může pomoci vaší konkrétní situaci.",
    },
    demoVideo: {
        title: "Podívejte se na Echo Pulse v akci",
    },
    decisionLock: {
      title: "V obou extrémech (vyhoření i hyper-růst) je problém stejný: vedení ztrácí viditelnost.",
      subtitle: "Echo Pulse vám vrátí průběžné signály bez toho, aby zpomalil firmu.",
      cta: "Chci vidět signály z naší reality"
    },
    faq: {
      title: "Odstraňte rizika, ne jen otázky",
      desc: "Nejčastější obavy, které řešíme s CEO a HR řediteli.",
      contact: "Napište nám →",
      items: [
        { q: "Bude to lidi otravovat?", a: "Ne. Systém používá 'Low-Friction' protokol. Žádné dlouhé dotazníky, jen 90 vteřin měsíčně. Udržíme zátěž respondentů nízko." },
        { q: "Vyžaduje to složitou IT implementaci?", a: "Ne. Jsme cloudová služba. Napojíme se na vaše systémy (M365/Slack) bez zásahu IT. Nevyžaduje to projekt." },
        { q: "Je to skutečně anonymní?", a: "Absolutně. Garantujeme 'vrstvu bezpečí'. Nikdo z vedení neuvidí individuální odpovědi. Lidé to ví a věří tomu." },
        { q: "Přidělá to práci manažerům?", a: "Naopak. Echo Pulse za ně dělá analytickou práci a dává jim návod. Nezvyšuje to práci manažerům." },
        { q: "Co když nebudou výsledky hezké?", a: "To je cíl. Chcete vidět realitu, abyste ji mohli změnit. Lepší vědět teď, než řešit výpovědi." }
      ]
    },
    leadPopup: {
      badge: "Nová studie 2026",
      title: "Lidé odcházejí i z dobrých firem. Proč?",
      subtitle: "Exkluzivní data z 50+ českých firem. Odhalte skutečné důvody poklesu výkonu, které v ročních průzkumech nenajdete.",
      emailPlaceholder: "name@company.com",
      inputLabel: "Kam máme E-book poslat?",
      cta: "Stáhnout studii zdarma",
      socialProofPre: "Již stáhlo",
      socialProofCount: "1 200+",
      socialProofPost: "lídrů",
      quote: "Data, která mění pohled na řízení lidí v Česku.",
      successTitle: "E-book je na cestě!",
      successMessage: "Zkontrolujte svou e-mailovou schránku. Právě jsme vám studii odeslali.",
      close: "Zavřít"
    },
    data: {
      trustedBy: "VYUŽÍVÁNO HR LÍDRY"
    },
    forms: {
      firstName: "Jméno",
      lastName: "Příjmení",
      phone: "Telefonní číslo",
      workEmail: "Pracovní email",
      submit: "Odeslat"
    },
    calculator: {
      sliders: {
        companySize: "Velikost firmy"
      }
    }
  },
  de: {
    radar: {
      badge: "Vollspektrumanalyse",
      title: "9 Dimensionen",
      titleHighlight: "der Arbeitsrealität",
      subtitle: "Echo Pulse überwacht kontinuierlich 9 kritische Dimensionen der Arbeitsrealität. Kein Rauschen. Nur klare Signale, wo Reibung entsteht.",
      methodology: "Methodik basierend auf Job Demands–Resources (JD-R), Self-Determination Theory und Equity Theory.",
      signals: {
        mood: { title: "Emotionaler Zustand", question: "Wie fühlt sich das Team wirklich?", metrics: ["Wohlbefinden", "Valenz", "Affekt"] },
        stress: { title: "Stress & Druck", question: "Treibt Druck Leistung oder Burnout?", metrics: ["Chronischer Stress", "Spillover", "Erholung"] },
        workload: { title: "Kapazität & Last", question: "Passen Anforderungen zu Kapazitäten?", metrics: ["Kognitive Last", "Prioritäten", "Tempo"] },
        tools: { title: "Befähigung", question: "Haben sie, was sie brauchen?", metrics: ["Reibung", "Ressourcen", "Barrieren"] },
        recognition: { title: "Anerkennung", question: "Wird gute Arbeit gesehen?", metrics: ["Sichtbarkeit", "Wertschätzung", "Wirkung"] },
        growth: { title: "Potenzial", question: "Nutzen wir ihre volle Fähigkeit?", metrics: ["Autonomie", "Herausforderung", "Passung"] },
        rewards: { title: "Fairness", question: "Wird der Austausch als fair empfunden?", metrics: ["Vergütung", "Gerechtigkeit", "Hygiene"] },
        benefits: { title: "Benefits", question: "Zählen die Vorteile wirklich?", metrics: ["Relevanz", "Nutzen", "ROI"] },
        evp: { title: "Werte & Loyalität", question: "Leben wir, was wir sagen?", metrics: ["Stolz", "Ausrichtung", "Versprechen"] }
      }
    },
    header: {
      product: "Produkt",
      solutions: "Lösungen",
      pricing: "Preise",
      about: "Über uns",
      login: "Einloggen",
      bookDemo: "Demo buchen",
      nav: {
        problem: "Problem",
        solution: "Lösung",
        impact: "Wirkung"
      },
    },
    hero: {
      badge: "Kontinuierliches Einsichtssystem • V2.0",
      title: "Managen Sie Kultur",
      titleHighlight: "genau wie Finanzen.",
      subtitle: "Echte Daten statt Gefühle. Echo Pulse ersetzt jährliche Umfragen durch ein kontinuierliches Signalsystem und gibt der Führung Sicherheit.",
      primaryCta: "Beratung vereinbaren",
      secondaryCta: "Demo (3 Min)",
      riskReversal: "Keine Verpflichtung. Verlassen Sie das Gespräch mit einem klaren Bild.",
      trust: {
        security: "Datensicherheit (DSGVO)",
        support: "Nativer Support",
        implementation: "48h Implementierung"
      },
    },
    problems: {
      badge: "Kritische Systemblindheit",
      title: "Der stille Killer der Stabilität.",
      subtitle: "Intuition und verzögertes Feedback schaffen Management-Blindheit. Traditionelle Tools messen Folgen, nicht Ursachen.",
      items: [
        {
          title: "Verborgene Gründe",
          value: "72%",
          desc: "Kündigungsgründe, die Sie nie in Exit-Interviews hören. Sie bleiben in privaten Chats.",
        },
        {
          title: "Produktivitätsverlust",
          value: "-24%",
          desc: "Durchschnittlicher Leistungsabfall während 'Quiet Quitting'.",
        },
        {
          title: "Erkennungsverzögerung",
          value: "8.5Mon",
          desc: "Zeit, die ein Problem existiert, bevor das Management es bemerkt und handelt.",
        },
      ],
      ctaBox: {
        title: "Das lässt sich nicht mit 'Bauchgefühl' managen.",
        desc: "Sie brauchen harte Daten. Ohne sie raten Sie nur, warum Leute gehen."
      }
    },
    howItWorks: {
      title: "Betriebssystem",
      titleHighlight: "für Ihre Kultur.",
      subtitle: "Ein System, das jährliche Umfragen, zufällige 1:1s und Vermutungen ersetzt. Strukturierte Daten, auf denen Sie Entscheidungen aufbauen können.",
      steps: {
        step1: {
          title: "Kontextuelle Intelligenz",
          desc: "Echo Pulse zählt nicht nur Keywords. Es versteht Kontext, Sarkasmus und Dringlichkeit. Aus Tausenden von Antworten extrahiert es 3 Prioritäten, die Sie sofort angehen müssen."
        },
        step2: {
          title: "Auto-Pilot",
          desc: "Feedback ohne Formulare. Echo Pulse fragt automatisch dort, wo Leute arbeiten (Slack, Teams, E-Mail). Kurze Impulse. Echte Antworten. Keine Admin.",
          highlight: "Das System überwacht Rhythmus und Müdigkeit. Sie erhalten saubere Signale."
        },
        step3: {
          title: "Action Playbooks",
          desc: "Vom Problem zur Lösung. Echo schlägt konkrete Schritte für Manager vor."
        },
        step4: {
          title: "100% Anonymität",
          desc: "Wir garantieren eine 'Psychological Safety Layer'. Mitarbeiter wissen, dass sie offen und ohne Risiko sprechen können."
        }
      }
    },
    methodology: {
      title: "Wissenschaftliches Instrument, keine 'Happiness Survey'.",
      subtitle: "Wir trennen Signal von Rauschen. Echo Pulse schützt die Zeit Ihrer Mitarbeiter und liefert valide Daten für Entscheidungen.",
      cards: [
        {
          title: "Wir suchen kein 'Glück'",
          desc: "Uns interessiert nicht oberflächliche Zufriedenheit, sondern funktionale Stabilität. Wir messen Risiken, Reibung und Leistungsbarrieren."
        },
        {
          title: "90 Sekunden pro Monat",
          desc: "Maximaler Respekt für Fokus. Keine 20-Minuten-Umfragen. Unser 'Low-Friction'-Protokoll garantiert hohe Rücklaufquoten ohne Störung."
        },
        {
          title: "Kern: JD-R Modell",
          desc: "Alles basiert auf dem Job Demands-Resources Modell. Wir messen die Balance zwischen Anforderungen und Ressourcen."
        }
      ]
    },
    czechReality: {
      title: "Die meisten Unternehmen befinden sich heute in einem von zwei Extremen.",
      subtitle: "Der Markt polarisiert sich. Ob wir mit Konzernen oder Tech-Unternehmen sprechen, wir sehen das gleiche Muster. Die Fähigkeit, die Realität rechtzeitig zu sehen, fehlt.",
      archetypeA: {
        title: "A) Burnout-Stabilität",
        point1: {
          title: "Trägheit und Müdigkeit.",
          desc: "Leute sind loyal, aber passiv. Prozesse werden befolgt, aber Energie fehlt. Veränderungen stoßen auf 'stillen Widerstand'."
        },
        point2: {
          title: "Langsame Führungsreaktion.",
          desc: "Das Management ist von der 'Produktionslinie' abgekoppelt. Sie erfahren von Problemen erst, wenn es zu spät ist."
        },
        diagnosis: "Verlust der Wettbewerbsfähigkeit ohne Vorwarnung."
      },
      archetypeB: {
        title: "B) Geschwindigkeit auf Kredit",
        point1: {
          title: "Adrenalin-Blindheit.",
          desc: "Junges Management, extremes Tempo. Alle sind 'überlastet'. Keine Zeit für Reflexion."
        },
        point2: {
          title: "Zerbrechlicher Erfolg.",
          desc: "Ergebnisse wachsen, aber die Kultur bröckelt. Menschen laufen auf Kredit. Die erste Krise kann einen Kollaps verursachen."
        },
        diagnosis: "Risiko des plötzlichen Weggangs von Schlüsseltalenten."
      },
      synthesis: {
        title: "Unabhängig vom Szenario ist die Lösung nicht 'Motivation'.",
        desc: "Sie brauchen ein Frühwarnsystem. Einen Stabilisator im Chaos."
      }
    },
    roleSelection: {
      title: "Sie sehen das Unternehmen aus einer anderen Position.",
      subtitle: "Wir berücksichtigen das. Wählen Sie Ihre Perspektive.",
      investor: {
        role: "Investor",
        title: "Investitionsschutz",
        list: [
          "Risikoprognose",
          "Portfolio-Gesundheit sichtbar machen"
        ],
        cta: "Portfolio-Gesundheit prüfen"
      },
      ceo: {
        role: "CEO / Eigentümer",
        title: "Strategische Kontrolle",
        list: [
          "Frühwarnsignale",
          "Beseitigung von Management-Blind-Spots"
        ],
        cta: "Unternehmen von oben sehen"
      },
      hr: {
        role: "HR / People Ops",
        title: "Daten statt Eindrücke",
        list: [
          "Argumente gestützt durch harte Daten",
          "Weniger Feuerlöschen, mehr Prävention"
        ],
        cta: "Daten für die Führung erhalten"
      },
      teamLeader: {
        role: "Teamleiter",
        title: "Teamleistung",
        list: [
          "Sofortiges Feedback",
          "Früherkennung von Burnout"
        ],
        cta: "Teamgesundheit verbessern"
      }
    },
    valueByRole: {
      title: "Eine Plattform, zwei verschiedene Ergebnisse.",
      subtitle: "CEO braucht ein Signal für Entscheidungen. HR braucht ein Werkzeug zur Prävention. Echo Pulse liefert beides ohne Informationsrauschen.",
      ceo: {
        title: "Für CEO & Geschäftsführung",
        desc: "Das definitive Ende des 'Bauchgefühl-Managements'. Sehen Sie genau, welche Abteilungen überlastet sind, wo Fluktuation droht und wo Strategiekommunikation scheitert.",
        list: [
          { title: "Retention Radar", desc: "Identifizierung von Schlüsselpersonen mit Abwanderungsrisiko 3 Monate im Voraus." },
          { title: "Strategie-Audit", desc: "Echte Daten darüber, ob Teams Ihre Prioritäten verstehen oder auf Trägheit laufen." },
          { title: "Investitionsschutz", desc: "Schutz der Rekrutierungs- und Onboarding-Kosten durch Reduzierung der Fluktuation." }
        ]
      },
      hr: {
        title: "Für HR Management",
        desc: "Weg vom 'Feuerlöschen' hin zur Prävention. Erhalten Sie Daten, mit denen die Führung Sie als strategischen Partner behandelt, nicht als Admin.",
        list: [
          { title: "Daten über Eindrücke", desc: "Wenn Sie mit einem Problem zum CEO gehen, bringen Sie harte Zahlen, keine 'Küchenbeschwerden'." },
          { title: "Puls-Automatisierung", desc: "Kein manuelles Versenden von Umfragen. Das System läuft von selbst, Sie lösen Ergebnisse." },
          { title: "Vertrauenskultur", desc: "Mitarbeiter sehen, dass sich Dinge ändern. Die Bereitschaft, die Wahrheit zu teilen, wächst." }
        ]
      },
      bottomBadge: "Entwickelt für Unternehmen von 30 bis 350 Mitarbeitern"
    },
    dashboard: {
      badge: "Executive Visibility",
      title: "Sehen Sie, was früher nur",
      titleHighlight: "Kollegen an der Kaffeemaschine sahen.",
      subtitle: "Echo Pulse aggregiert fragmentierte Signale in einem verständlichen Dashboard.",
      features: [
        { title: "Stimmungs-Röntgen", desc: "Sofortiger Überblick, wie sich verschiedene Teams fühlen. Aufschlüsselung nach Abteilung, Standort oder Seniorität." },
        { title: "Erkennung toxischer Herde", desc: "System warnt vor Anomalien, die auf Mobbing, Burnout oder Führungsversagen hinweisen." },
        { title: "Interventions-Priorisierung", desc: "Wissen nicht, was zuerst lösen? Echo ordnet Probleme nach Geschäftsauswirkung und Fluktuationsrisiko." }
      ]
    },
    cta: {
      title: "Warten Sie nicht auf die nächste Kündigung.",
      subtitle: "Blindheit kostet Unternehmen jährlich Millionen an verlorener Produktivität und Neueinstellungen. Gewinnen Sie die Kontrolle in 48 Stunden zurück.",
      primary: "Beratung vereinbaren",
      secondary: "oder",
      secondaryLink: "+420 777 123 456",
      benefits: [
        { title: "Keine Verpflichtung", desc: "Erstberatung und Demo sind kostenlos. Verstehen Sie die Systemlogik in 20 Minuten." },
        { title: "Datenschutz-Garantie", desc: "Volle DSGVO- und ISO 27001-Konformität. Ihre Daten sind sicher auf europäischen Servern." },
        { title: "Schnellstart", desc: "Implementierung benötigt keine IT-Abteilung. Wir verbinden uns mit Ihren bestehenden Tools (M365, Slack)." }
      ]
    },
    footer: {
      rights: "Behavera s.r.o. Alle Rechte vorbehalten.",
      legal: ["AGB", "Datenschutz"],
      links: ["Produkt", "Preise", "Über uns", "Kontakt"]
    },
    booking: {
        title: "Beratung vereinbaren",
        desc: "Wählen Sie eine Zeit, die Ihnen passt. Wir zeigen Ihnen, wie Echo Pulse in Ihrer spezifischen Situation helfen kann.",
    },
    demoVideo: {
        title: "Sehen Sie Echo Pulse in Aktion",
    },
    decisionLock: {
      title: "In beiden Extremen (Burnout & Hyperwachstum) ist das Problem gleich: Die Führung verliert die Sicht.",
      subtitle: "Echo Pulse gibt Ihnen kontinuierliche Signale zurück, ohne das Unternehmen zu verlangsamen.",
      cta: "Ich möchte Signale aus unserer Realität sehen"
    },
    faq: {
      title: "Häufige Fragen",
      desc: "Haben Sie weitere Fragen? Unser Support-Team hilft Ihnen gerne.",
      contact: "Schreiben Sie uns →",
      items: [
        { q: "Wie komplex ist die Implementierung?", a: "Minimal. Echo Pulse ist eine Cloud-Lösung. Laden Sie einfach die Mitarbeiterliste hoch und beginnen Sie in 24 Stunden mit der Messung." },
        { q: "Ist Feedback wirklich anonym?", a: "Ja, Anonymität ist der Schlüssel. Ergebnisse werden aggregiert, niemals werden einzelne Antworten angezeigt, wenn die Gruppe weniger als 5 Mitglieder hat." },
        { q: "Wie oft werden Umfragen gesendet?", a: "Sie legen die Häufigkeit fest. Wir empfehlen kurze 'Puls'-Umfragen alle 14 Tage oder monatlich." },
        { q: "Wie viel kostet Echo Pulse?", a: "Der Preis hängt von der Mitarbeiterzahl ab. Wir bieten transparente monatliche oder jährliche Abonnements." },
        { q: "Integration mit Slack/Teams?", a: "Ja, Echo Pulse sendet Benachrichtigungen und Umfragen direkt an Tools, die Sie bereits verwenden." }
      ]
    },
    leadPopup: {
      badge: "Neue Studie 2026",
      title: "Menschen verlassen auch gute Firmen. Warum?",
      subtitle: "Exklusive Daten von 50+ Unternehmen. Entdecken Sie die wahren Gründe für Leistungsabfall, die Jahresumfragen übersehen.",
      emailPlaceholder: "name@company.com",
      inputLabel: "Wohin sollen wir das E-Book senden?",
      cta: "Studie kostenlos herunterladen",
      socialProofPre: "Bereits von",
      socialProofCount: "1.200+",
      socialProofPost: "Führungskräften genutzt",
      quote: "Daten, die den Blick auf Personalmanagement verändern.",
      successTitle: "E-Book ist unterwegs!",
      successMessage: "Prüfen Sie Ihren Posteingang. Wir haben Ihnen die Studie gerade gesendet.",
      close: "Schließen"
    },
    data: {
      trustedBy: "VON HR-LEADERN GENUTZT"
    },
    forms: {
      firstName: "Vorname",
      lastName: "Nachname",
      phone: "Telefonnummer",
      workEmail: "Arbeits-E-Mail",
      submit: "Absenden"
    },
    calculator: {
      sliders: {
        companySize: "Unternehmensgröße"
      }
    }
  }
};
