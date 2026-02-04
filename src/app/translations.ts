export type Language = "en" | "cz" | "de";

export const translations = {
  en: {
    radar: {
      badge: "Full Spectrum Analysis",
      title: "Signal",
      titleHighlight: "Radar",
      subtitle: "Echo Pulse continuously monitors key areas of work reality. No noise. Just clear signals where support or tools are missing.",
      methodology: "Built on 40+ years of validated research: JD-R Model (Demerouti & Bakker), Self-Determination Theory (Deci & Ryan), and Affective Events Theory (Weiss & Cropanzano).",
      signals: {
        mood: { title: "How people feel", question: "How is the team actually feeling?", metrics: ["Mood", "Energy", "Stability"] },
        stress: { title: "Stress & Pressure", question: "Is pressure driving performance or burnout?", metrics: ["Chronic Stress", "Spillover", "Recovery"] },
        workload: { title: "Capacity & Load", question: "Are demands matching capacity?", metrics: ["Cognitive Load", "Priorities", "Pace"] },
        tools: { title: "Enablement", question: "Do they have what they need to win?", metrics: ["Leadership Support", "Tools", "Helpers"] },
        recognition: { title: "Recognition", question: "Is good work being seen?", metrics: ["Visibility", "Appreciation", "Impact"] },
        growth: { title: "Potential", question: "Are we using their full capability?", metrics: ["Career Growth", "Challenges", "Stagnation"] },
        rewards: { title: "Fairness", question: "Is the exchange perceived as fair?", metrics: ["Fairness", "Transparency", "Bonuses"] },
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
      badge: "Clarity before problems hit",
      title: "Keep teams stable and",
      titleHighlight: "performance on track",
      subtitle: "Spot turnover risk, overload, and misalignment early — before it shows in results.",
      primaryCta: "Schedule a 30‑min consultation",
      secondaryCta: "See a 3‑min demo",
      riskReversal: "No commitment. Leave with a clear view of what’s at risk and what to fix first.",
      trust: {
        security: "Data Security (GDPR)",
        support: "Native Support",
        implementation: "48h Implementation",
        languages: "CZ / EN"
      },
    },
    problems: {
      badge: "Critical System Blindness",
      title: "The silent killer of stability.",
      subtitle: "Estimates and incomplete feedback create management blindness. Traditional tools measure consequences, not causes.",
      items: [
        {
          title: "Hidden Reasons",
          value: "Unseen",
          desc: "Departure reasons rarely surface in exit interviews. They stay in private chats.",
        },
        {
          title: "Productivity Loss",
          value: "Quiet Decline",
          desc: "Engagement drops quietly before anyone notices the impact.",
        },
        {
          title: "Detection Delay",
          value: "Too Late",
          desc: "Issues grow silently before management reacts.",
        },
      ],
      ctaBox: {
        title: "You can't manage this with assumptions.",
        desc: "You need hard data. Without it, you're just guessing why people leave."
      }
    },
    howItWorks: {
      badge: "Process",
      stepLabel: "Step",
      title: "Operating System",
      titleHighlight: "for your culture.",
      subtitle: "One system instead of annual surveys and assumptions. Clear priorities for leadership.",
      steps: {
        step1: {
          title: "Connect",
          desc: "Connect Echo Pulse to Slack or Teams. No IT required. 5-minute setup."
        },
        step2: {
          title: "Listen",
          desc: "AI continuously monitors signals from daily work. No surveys needed."
        },
        step3: {
          title: "Act",
          desc: "Receive weekly priority alerts and concrete action recommendations. 100% anonymous."
        }
      }
    },
    methodology: {
      title: "Scientific Instrument, Not a 'Happiness Survey'.",
      subtitle: "Built on 40+ years of validated organizational psychology research. Data from 183,000+ business units shows: engaged teams deliver 23% higher profit (Gallup Q12 Meta-Analysis, 2020).",
      cards: [
        {
          title: "We Don't Hunt 'Happiness'",
          desc: "We don't care about superficial satisfaction, but functional stability. We measure risks, friction, and performance barriers. Data, not feelings."
        },
        {
          title: "90 Seconds a Month",
          desc: "Research shows response quality drops dramatically with survey length (Galesic & Bosnjak, 2009). One question daily, not 50 questions yearly."
        },
        {
          title: "Core: JD-R Model",
          desc: "Built on the Job Demands-Resources model (Demerouti & Bakker, 2001). Burnout occurs when demands exceed resources. Engagement when resources exceed demands."
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
      title: "View the company from your perspective.",
      subtitle: "Pick your role and see the benefit in seconds.",
      benefits: [
        "I want a productive team",
        "I need to know what blocks performance",
        "I want full visibility"
      ],
      investor: {
        role: "Investor",
        title: "Asset Protection",
        list: [
          "Portfolio health at a glance",
          "Risks flagged early"
        ],
        cta: "Check portfolio health"
      },
      ceo: {
        role: "CEO / Owner",
        title: "Strategic Control",
        list: [
          "Early risk signals",
          "Clear priorities for leadership"
        ],
        cta: "See company from above"
      },
      hr: {
        role: "HR / People Ops",
        title: "Data over Impressions",
        list: [
          "Data to influence leadership",
          "Prevention over firefighting"
        ],
        cta: "Get data for leadership"
      },
      teamLeader: {
        role: "Team Leader",
        title: "Team Performance",
        list: [
          "Fast feedback loop",
          "Early overload detection"
        ],
        cta: "Improve team health"
      }
    },
    valueByRole: {
      badge: "By role",
      title: "One platform, two different outputs.",
      subtitle: "CEO needs clarity for decisions. HR needs prevention. Echo Pulse delivers both without noise.",
      tabs: {
        ceo: "CEO / Leadership",
        hr: "HR / People Ops"
      },
      cta: {
        ceo: "Schedule CEO demo",
        hr: "Schedule HR demo"
      },
      ctaNote: "20 min • Personalized for your role",
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
      watchDemo: "Watch demo",
      features: [
        { title: "Mood X-Ray", desc: "Instant overview of how different teams feel. Breakdown by department, location, or seniority." },
        { title: "Toxic Spot Detection", desc: "System alerts on anomalies indicating bullying, burnout, or management failure." },
        { title: "Intervention Prioritization", desc: "Don't know what to solve first? Echo ranks problems by business impact and turnover risk." }
      ]
    },
    purchase: {
      badge: "Pricing",
      title: "Pricing based on company size",
      subtitle: "Estimate is driven by employee count. Final scope and price are confirmed after a short consultation.",
      configTitle: "Configure plan",
      billingMonthly: "Monthly",
      billingYearly: "Yearly (-20%)",
      companySizeLabel: "Company size",
      employeesLabel: "employees",
      estimatedLabel: "Estimated investment",
      perMonthLabel: "CZK / mo",
      priceCapped: "Price capped at {cap} employees",
      basePriceLabel: "Base price",
      vatLabel: "VAT (21%)",
      features: [
        "Continuous pulses and signal analysis",
        "Executive and HR dashboards",
        "Actionable recommendations for managers",
        "Secure data handling (GDPR)"
      ],
      button: "Request a tailored quote",
      guaranteeShort: "Final scope and price are confirmed after the intro call."
    },
    trustCenter: {
      badge: "Trust center",
      title: "Data security and privacy",
      subtitle: "We explain transparently how we process personal data, what responsibilities we take, and how we protect confidential information.",
      highlights: [
        "Personal data processing follows GDPR and applicable legislation.",
        "Data controller: Behavera s.r.o., Křižíkova 148/34, Karlín, Prague 8.",
        "Data protection contact: gdpr@behavera.com.",
        "We store data during registration and for 6 months afterwards, then anonymize or delete it.",
        "Aggregated statistics are anonymized and do not contain personal data.",
        "Data subjects have rights to access, portability, rectification, deletion, and withdrawal of consent."
      ],
      privacyFallbackTitle: "Privacy policy",
      termsFallbackTitle: "Terms and conditions",
      contentFallback: "Content coming soon."
    },
    cta: {
      title: "Don't wait for the next resignation.",
      subtitle: "Blindness costs companies millions annually in lost productivity and hiring. Regain control in 48 hours.",
      primary: "Schedule Consultation",
      demoButton: "Try the demo",
      secondary: "or call us",
      secondaryLink: "+420 777 123 456",
      benefits: [
        { title: "No Commitment", desc: "Initial consultation and demo are free. Understand system logic in 20 minutes." },
        { title: "Privacy Guarantee", desc: "GDPR compliance with clear data-handling rules. Your data stays on EU servers." },
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
    demoRequest: {
      title: "Get demo access",
      subtitle: "We'll send you a personalized demo link",
      emailLabel: "Work email",
      phoneLabel: "Phone",
      sizeLabel: "Company size",
      roleLabel: "Your role",
      submit: "Send me the demo",
      successTitle: "Check your inbox!",
      successMessage: "Demo link is on its way.",
      errorInvalidEmail: "Please enter a valid email.",
      errorInvalidPhone: "Please enter a valid phone number.",
      errorRequired: "This field is required.",
      errorGeneric: "Submission failed. Please try again.",
      companySizePlaceholder: "Select size",
      rolePlaceholder: "Select role",
      roles: {
        ceo: "CEO / Founder",
        hr: "HR / People Ops",
        leader: "Team Leader",
        other: "Other"
      },
      sizes: {
        xs: "10-30 employees",
        sm: "31-50 employees",
        md: "51-100 employees",
        lg: "101-200 employees",
        xl: "201-350 employees",
        xxl: "350+ employees"
      }
    },
    tryPage: {
      badge: "Interactive Preview",
      title: "Try Echo Pulse yourself",
      subtitle: "See what your employees would experience",
      ctaTitle: "Want to see the results?",
      ctaButton: "Get full demo access"
    },
    leadCapture: {
      badge: "Free E-book",
      title: "Get a practical guide to managing teams by signals.",
      subtitle: "We'll send you an ebook with concrete tips to quickly spot what's not working. No spam.",
      nameLabel: "Name (optional)",
      namePlaceholder: "Your name",
      emailLabel: "Work email",
      emailPlaceholder: "name@company.com",
      submit: "Get the e-book",
      successTitle: "E-book is on the way.",
      successMessage: "Check your inbox.",
      consent: "By submitting, you agree to data processing for ebook delivery.",
      errorInvalid: "Please enter a valid email.",
      errorGeneric: "Something went wrong. Please try again."
    },
    demoModal: {
      choiceTitle: "How would you like to see Echo Pulse?",
      choiceSubtitle: "Choose what works best for you",
      selfServe: {
        title: "Watch demo video",
        subtitle: "3 minutes – quick overview",
        features: ["Instant access", "No registration", "Core features"],
        cta: "Play now"
      },
      liveDemo: {
        title: "Live demo with expert",
        subtitle: "30 minutes – personalized",
        features: ["Get your questions answered", "Specific use-cases", "No commitment"],
        cta: "Book a time"
      },
      videoTitle: "Echo Pulse – Demo",
      recommended: "Recommended"
    },
    demoChoiceModal: {
      title: "How would you like to explore Echo Pulse?",
      subtitle: "Choose the path that works for you",
      selfServe: {
        badge: "Instant Access",
        title: "Explore on your own",
        subtitle: "Get access to our demo app with real data",
        features: [
          "Complete demo environment",
          "Unlimited time to explore",
          "Real company data"
        ],
        cta: "Get access",
        note: "Requires work email + phone"
      },
      guided: {
        badge: "Recommended",
        title: "Consultation with expert",
        subtitle: "20min video call with our consultant",
        features: [
          "Personalized walkthrough",
          "All your questions answered",
          "Specific use-cases for your industry"
        ],
        cta: "Pick a time",
        note: "No commitment"
      }
    },
    demoAccess: {
      badge: "Full Demo Access",
      title: "Try Echo Pulse",
      titleHighlight: "with real data",
      subtitle: "Explore the dashboard our clients see. No limits, no time restrictions.",
      features: [
        { icon: "monitor", text: "Complete demo environment" },
        { icon: "clock", text: "Unlimited access" },
        { icon: "users", text: "Real company data" }
      ],
      emailLabel: "Work email",
      emailPlaceholder: "john.smith@company.com",
      phoneLabel: "Phone",
      phonePlaceholder: "+420 777 888 999",
      companyLabel: "Company name (optional)",
      companyPlaceholder: "Your Company Ltd.",
      submitCta: "Get access",
      submitting: "Submitting...",
      noSpam: "No spam. We only use your data for verification.",
      errors: {
        workEmailRequired: "Please enter a work email (not gmail, yahoo...)",
        phoneRequired: "Phone is required",
        generic: "Something went wrong. Please try again."
      },
      successTitle: "Your access is ready!",
      successSubtitle: "Use these credentials to log into the demo:",
      credentials: {
        urlLabel: "Demo app",
        emailLabel: "Login email",
        passwordLabel: "Password"
      },
      copyButton: "Copy",
      copied: "Copied!",
      openDemo: "Open demo app",
      upsellTitle: "Want a guided tour?",
      upsellText: "Book a 20min consultation and we'll show you what Echo Pulse reveals in your company.",
      upsellCta: "Book consultation"
    },
    bookingModal: {
      badge: "Personal Consultation",
      title: "20 minutes that will",
      titleHighlight: "change how you see data",
      subtitle: "Video call with our consultant. We'll show you what Echo Pulse reveals in your company.",
      benefits: [
        { icon: "target", text: "Personalized demo for your industry" },
        { icon: "users", text: "All your questions answered" },
        { icon: "shield", text: "No commitment, no hard-sell" }
      ],
      duration: "20 minutes",
      format: "Video call (Google Meet / Zoom)",
      cta: "Pick a time",
      calendarTitle: "Choose an available slot",
      calendarSubtitle: "Loading calendar...",
      back: "Back"
    },
    data: {
      trustedBy: "Trusted by leading companies"
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
      title: "Radar",
      titleHighlight: "aktivních signálů",
      subtitle: "Echo Pulse kontinuálně monitoruje klíčové oblasti pracovní reality. Žádný šum. Jen jasné signály tam, kde chybí podpora, nástroje nebo vedení.",
      methodology: "40+ let validovaného výzkumu: JD-R Model (Demerouti & Bakker), Self-Determination Theory (Deci & Ryan), Affective Events Theory (Weiss & Cropanzano).",
      signals: {
        mood: { title: "Jak se lidé cítí", question: "Jak se tým skutečně cítí?", metrics: ["Nálada", "Energie", "Stabilita"] },
        stress: { title: "Stres a tlak", question: "Je tlak motorem nebo cestou k vyhoření?", metrics: ["Chronický stres", "Přetížení", "Regenerace"] },
        workload: { title: "Kapacita a zátěž", question: "Odpovídají nároky kapacitám?", metrics: ["Kognitivní zátěž", "Priority", "Tempo"] },
        tools: { title: "Podpora a nástroje", question: "Mají lidé to, co potřebují k výsledkům?", metrics: ["Podpora vedení", "Nástroje", "Pomůcky"] },
        recognition: { title: "Uznání a zpětná vazba", question: "Je dobrá práce vidět?", metrics: ["Viditelnost", "Ocenění", "Dopad"] },
        growth: { title: "Potenciál", question: "Využíváme naplno jejich schopnosti?", metrics: ["Kariérní posun", "Výzvy", "Stagnace"] },
        rewards: { title: "Odměňování", question: "Je směna vnímána jako férová?", metrics: ["Férovost", "Transparentnost", "Bonusy"] },
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
      badge: "Continuous Insight System • Věda v praxi",
      title: "Víte, kdo vám zítra",
      titleHighlight: "podá výpověď?",
      subtitle: "Emoce jsou nejrychlejší signál změny. Echo Pulse je zachytí dřív, než se projeví ve výkonu nebo fluktuaci. 2 minuty měsíčně. Nulová administrativa. Konkrétní kroky pro manažery.",
      primaryCta: "20min konzultace zdarma",
      secondaryCta: "Projít si demo sám",
      riskReversal: "Žádný závazek. Ukážeme vám, co ve firmě nevidíte — a co s tím udělat jako první.",
      trust: {
        security: "GDPR & anonymita",
        support: "Česká podpora",
        implementation: "Spuštění do 48h",
        languages: "CZ / EN / DE"
      },
    },
    problems: {
      badge: "Kritická systémová slepota",
      title: "Tichý zabiják stability.",
      subtitle: "Odhady a neúplná zpětná vazba vytvářejí manažerskou slepotu. Tradiční nástroje měří následky, ne příčiny.",
      items: [
        {
          title: "Skryté důvody",
          value: "Neviditelné",
          desc: "Důvody odchodů se často neobjeví v exit interview. Zůstávají v soukromých chatech.",
        },
        {
          title: "Ztráta produktivity",
          value: "Tichý pokles",
          desc: "Výkon klesá dřív, než si někdo všimne, že lidé odpojují pozornost.",
        },
        {
          title: "Zpoždění detekce",
          value: "Pozdě",
          desc: "Problémy rostou potichu, než je vedení stihne zachytit.",
        },
      ],
      ctaBox: {
        title: "Tohle nejde řídit přes dojmy.",
        desc: "Potřebujete tvrdá data. Bez nich jen hádáte, proč lidé odcházejí."
      }
    },
    howItWorks: {
      title: "Operační systém",
      titleHighlight: "pro vaši kulturu.",
      subtitle: "Jeden systém místo ročních průzkumů a domněnek. Vedení dostává jasné priority.",
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
      subtitle: "40+ let výzkumu organizační psychologie. Data z 183,000+ týmů ukazují: engagované týmy mají o 23% vyšší ziskovost (Gallup Q12 Meta-Analysis, 2020).",
      cards: [
        {
          title: "Signál, ne šum",
          desc: "Neměříme spokojenost. Sledujeme metriky stability, podpory a rizik vyhoření podle JD-R modelu (Demerouti & Bakker, 2001)."
        },
        {
          title: "90 sekund / měsíc",
          desc: "Výzkum ukazuje dramatický pokles kvality odpovědí s délkou dotazníku. Proto jedna otázka denně, ne 50 otázek ročně."
        },
        {
          title: "Emoce jako radar",
          desc: "Affective Events Theory (Weiss & Cropanzano) říká, že emoce jsou nejrychlejší signál. Chytáme problém týdny předtím, než se projeví v chování."
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
      title: "Podívejte se na firmu z jiného pohledu.",
      subtitle: "Vyberte roli a uvidíte přínos během pár sekund.",
      benefits: [
        "Chci mít produktivní tým",
        "Chci vědět, co blokuje výkon",
        "Chci přehled bez slepých míst"
      ],
      investor: {
        role: "Investor",
        title: "Ochrana investice",
        list: [
          "Zdraví portfolia na očích",
          "Rizika zachycená včas"
        ],
        cta: "Zkontrolovat zdraví portfolia"
      },
      ceo: {
        role: "CEO / Majitel",
        title: "Strategická kontrola",
        list: [
          "Signály včasného varování",
          "Jasné priority pro vedení"
        ],
        cta: "Chci vidět firmu z výšky"
      },
      hr: {
        role: "HR / People Ops",
        title: "Data místo dojmů",
        list: [
          "Data pro rozhodnutí vedení",
          "Prevence místo hašení"
        ],
        cta: "Chci mít data pro vedení"
      },
      teamLeader: {
        role: "Team Leader",
        title: "Výkon týmu",
        list: [
          "Rychlá zpětná vazba",
          "Včasné zachycení přetížení"
        ],
        cta: "Zlepšit zdraví týmu"
      }
    },
    valueByRole: {
      title: "Jedna platforma, dva různé výstupy.",
      subtitle: "CEO potřebuje jasno pro rozhodnutí. HR potřebuje prevenci. Echo Pulse dodá obojí bez šumu.",
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
      watchDemo: "Přehrát demo",
      features: [
        { title: "Rentgen nálady", desc: "Okamžitý přehled o tom, jak se cítí různé týmy. Rozklíčování dle oddělení, lokality nebo seniority." },
        { title: "Detekce toxických ohnisek", desc: "Systém upozorní na anomálie, které naznačují šikanu, vyhoření nebo selhání manažera." },
        { title: "Prioritizace zásahů", desc: "Nevíte, co řešit dřív? Echo seřadí problémy podle dopadu na byznys a rizika odchodů." }
      ]
    },
    purchase: {
      title: "Ceník podle velikosti firmy",
      subtitle: "Orientační odhad se odvíjí od počtu zaměstnanců. Finální rozsah a cena se potvrdí po krátké konzultaci.",
      features: [
        "Průběžné pulsy a analýza signálů",
        "Dashboard pro vedení a HR",
        "Akční doporučení pro manažery",
        "Bezpečné zpracování dat (GDPR)"
      ],
      button: "Chci nabídku na míru",
      guaranteeShort: "Finální rozsah a cena se potvrdí po úvodní konzultaci."
    },
    cta: {
      title: "Nečekejte na další výpověď.",
      subtitle: "Slepota stojí české firmy miliony ročně na ztracené produktivitě a náboru. Získejte kontrolu zpět během 48 hodin.",
      primary: "Sjednat konzultaci",
      demoButton: "Vyzkoušet demo",
      secondary: "nebo zavolejte",
      secondaryLink: "+420 777 123 456",
      benefits: [
        { title: "Bez závazků", desc: "Úvodní konzultace a demo ukázka jsou zdarma. Pochopíte logiku systému za 20 minut." },
        { title: "Garance soukromí", desc: "Soulad s GDPR a jasná pravidla práce s daty. Vaše data zůstávají na evropských serverech." },
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
    demoRequest: {
      title: "Get Demo Access",
      titleCz: "Získat přístup k demo",
      subtitle: "We'll send you a personalized demo link",
      subtitleCz: "Pošleme vám personalizovaný odkaz na demo",
      emailLabel: "Work email",
      emailLabelCz: "Pracovní email",
      phoneLabel: "Phone",
      phoneLabelCz: "Telefon",
      sizeLabel: "Company size",
      sizeLabelCz: "Velikost firmy",
      roleLabel: "Your role",
      roleLabelCz: "Vaše role",
      submit: "Send me the demo",
      submitCz: "Poslat demo",
      successTitle: "Check your inbox!",
      successTitleCz: "Zkontrolujte email!",
      successMessage: "Demo link is on its way.",
      successMessageCz: "Odkaz na demo je na cestě.",
      roles: {
        ceo: "CEO / Founder",
        hr: "HR / People Ops",
        leader: "Team Leader",
        other: "Other"
      },
      sizes: {
        xs: "10-30 employees",
        sm: "31-50 employees",
        md: "51-100 employees",
        lg: "101-200 employees",
        xl: "201-350 employees",
        xxl: "350+ employees"
      }
    },
    tryPage: {
      badge: "Interactive Preview",
      badgeCz: "Interaktivní ukázka",
      title: "Try Echo Pulse yourself",
      titleCz: "Vyzkoušejte Echo Pulse na vlastní kůži",
      subtitle: "See what your employees would experience",
      subtitleCz: "Podívejte se, co zažijí vaši zaměstnanci",
      ctaTitle: "Want to see the results?",
      ctaTitleCz: "Chcete vidět výsledky?",
      ctaButton: "Get full demo access",
      ctaButtonCz: "Získat plný přístup k demo"
    },
    leadCapture: {
      badge: "E-book zdarma",
      title: "Získejte praktický přehled, jak řídit tým podle signálů.",
      subtitle: "Pošleme vám e-book s konkrétními tipy, jak rychle odhalit, co a proč ve firmě nefunguje. Bez spamu.",
      nameLabel: "Jméno (volitelné)",
      namePlaceholder: "Vaše jméno",
      emailLabel: "Pracovní e-mail",
      emailPlaceholder: "name@company.com",
      submit: "Chci e-book",
      successTitle: "E-book je na cestě.",
      successMessage: "Zkontrolujte prosím e-mailovou schránku.",
      consent: "Odesláním souhlasíte se zpracováním kontaktních údajů pro doručení e-booku.",
      errorInvalid: "Zadejte prosím platný e-mail.",
      errorGeneric: "Odeslání se nepodařilo."
    },
    demoModal: {
      choiceTitle: "Jak chcete vidět Echo Pulse?",
      choiceSubtitle: "Vyberte si, co vám vyhovuje",
      selfServe: {
        title: "Pustit demo video",
        subtitle: "3 minuty – základní přehled",
        features: ["Okamžitě", "Bez registrace", "Přehled funkcí"],
        cta: "Přehrát teď"
      },
      liveDemo: {
        title: "Živé demo s expertem",
        subtitle: "30 minut – personalizované",
        features: ["Odpovědi na dotazy", "Konkrétní use-cases", "Žádné závazky"],
        cta: "Rezervovat termín"
      },
      videoTitle: "Echo Pulse – Demo",
      recommended: "Doporučeno"
    },
    demoChoiceModal: {
      title: "Jak chcete poznat Echo Pulse?",
      subtitle: "Vyberte si cestu, která vám vyhovuje",
      selfServe: {
        badge: "Okamžitý přístup",
        title: "Projít si demo sám",
        subtitle: "Získejte přístup k demo aplikaci s reálnými daty",
        features: [
          "Kompletní demo prostředí",
          "Neomezený čas na prozkoumání",
          "Reálná firemní data"
        ],
        cta: "Získat přístup",
        note: "Vyžaduje pracovní email + telefon"
      },
      guided: {
        badge: "Doporučujeme",
        title: "Konzultace s expertem",
        subtitle: "20min video hovor s naším konzultantem",
        features: [
          "Personalizovaná ukázka",
          "Odpovědi na vaše dotazy",
          "Konkrétní use-cases pro váš obor"
        ],
        cta: "Vybrat termín",
        note: "Žádné závazky"
      }
    },
    demoAccess: {
      badge: "Plný přístup k demo",
      title: "Vyzkoušejte Echo Pulse",
      titleHighlight: "na reálných datech",
      subtitle: "Projděte si dashboard, který vidí naši klienti. Žádné omezení, žádný časový limit.",
      features: [
        { icon: "monitor", text: "Kompletní demo prostředí" },
        { icon: "clock", text: "Neomezený přístup" },
        { icon: "users", text: "Reálná firemní data" }
      ],
      emailLabel: "Pracovní email",
      emailPlaceholder: "jan.novak@firma.cz",
      phoneLabel: "Telefon",
      phonePlaceholder: "+420 777 888 999",
      companyLabel: "Název firmy (volitelné)",
      companyPlaceholder: "Vaše firma s.r.o.",
      submitCta: "Získat přístup",
      submitting: "Odesílám...",
      noSpam: "Žádný spam. Údaje použijeme pouze pro ověření.",
      errors: {
        workEmailRequired: "Prosím zadejte pracovní email (ne gmail, yahoo...)",
        phoneRequired: "Telefon je povinný",
        generic: "Něco se pokazilo. Zkuste to prosím znovu."
      },
      successTitle: "Váš přístup je připraven!",
      successSubtitle: "Použijte tyto údaje pro přihlášení do demo prostředí:",
      credentials: {
        urlLabel: "Demo aplikace",
        emailLabel: "Přihlašovací email",
        passwordLabel: "Heslo"
      },
      copyButton: "Kopírovat",
      copied: "Zkopírováno!",
      openDemo: "Otevřít demo aplikaci",
      upsellTitle: "Chcete průvodce?",
      upsellText: "Rezervujte si 20min konzultaci a ukážeme vám, co Echo Pulse odhalí ve vaší firmě.",
      upsellCta: "Rezervovat konzultaci"
    },
    bookingModal: {
      badge: "Osobní konzultace",
      title: "20 minut, které",
      titleHighlight: "změní váš pohled na data",
      subtitle: "Video hovor s naším konzultantem. Ukážeme vám, co Echo Pulse odhalí ve vaší firmě.",
      benefits: [
        { icon: "target", text: "Personalizovaná ukázka pro váš obor" },
        { icon: "users", text: "Odpovědi na všechny vaše dotazy" },
        { icon: "shield", text: "Žádné závazky, žádný hard-sell" }
      ],
      duration: "20 minut",
      format: "Video hovor (Google Meet / Zoom)",
      cta: "Vybrat termín",
      calendarTitle: "Vyberte si volný termín",
      calendarSubtitle: "Kalendář se načítá...",
      back: "Zpět"
    },
    data: {
      trustedBy: "DŮVĚŘUJÍ NÁM VELKÉ FIRMY"
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
      title: "Signal",
      titleHighlight: "Radar",
      subtitle: "Echo Pulse überwacht kontinuierlich die wichtigsten Bereiche der Arbeitsrealität. Kein Rauschen. Nur klare Signale, wo Unterstützung oder Tools fehlen.",
      methodology: "40+ Jahre validierte Forschung: JD-R Modell (Demerouti & Bakker), Self-Determination Theory (Deci & Ryan), Affective Events Theory (Weiss & Cropanzano).",
      signals: {
        mood: { title: "Wie sich Menschen fühlen", question: "Wie fühlt sich das Team wirklich?", metrics: ["Stimmung", "Energie", "Stabilität"] },
        stress: { title: "Stress & Druck", question: "Treibt Druck Leistung oder Burnout?", metrics: ["Chronischer Stress", "Spillover", "Erholung"] },
        workload: { title: "Kapazität & Last", question: "Passen Anforderungen zu Kapazitäten?", metrics: ["Kognitive Last", "Prioritäten", "Tempo"] },
        tools: { title: "Befähigung", question: "Haben sie, was sie brauchen?", metrics: ["Führungssupport", "Tools", "Hilfsmittel"] },
        recognition: { title: "Anerkennung", question: "Wird gute Arbeit gesehen?", metrics: ["Sichtbarkeit", "Wertschätzung", "Wirkung"] },
        growth: { title: "Potenzial", question: "Nutzen wir ihre volle Fähigkeit?", metrics: ["Karriere", "Herausforderungen", "Stagnation"] },
        rewards: { title: "Fairness", question: "Wird der Austausch als fair empfunden?", metrics: ["Fairness", "Transparenz", "Boni"] },
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
        implementation: "48h Implementierung",
        languages: "CZ / EN"
      },
    },
    problems: {
      badge: "Kritische Systemblindheit",
      title: "Der stille Killer der Stabilität.",
      subtitle: "Schätzungen, Vermutungen und unvollständiges Feedback schaffen Management-Blindheit. Traditionelle Tools messen Folgen, nicht Ursachen.",
      items: [
        {
          title: "Verborgene Gründe",
          value: "Unsichtbar",
          desc: "Kündigungsgründe tauchen oft nicht in Exit-Interviews auf. Sie bleiben in privaten Chats.",
        },
        {
          title: "Produktivitätsverlust",
          value: "Leiser Rückgang",
          desc: "Engagement sinkt leise, bevor jemand die Auswirkungen sieht.",
        },
        {
          title: "Erkennungsverzögerung",
          value: "Zu spät",
          desc: "Probleme wachsen still, bevor das Management reagiert.",
        },
      ],
      ctaBox: {
        title: "Das lässt sich nicht mit Annahmen steuern.",
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
      subtitle: "40+ Jahre validierte Organisationspsychologie. Daten von 183.000+ Teams zeigen: Engagierte Teams liefern 23% höhere Rentabilität (Gallup Q12 Meta-Analysis, 2020).",
      cards: [
        {
          title: "Wir suchen kein 'Glück'",
          desc: "Uns interessiert nicht oberflächliche Zufriedenheit, sondern funktionale Stabilität. Wir messen Risiken, Reibung und Leistungsbarrieren."
        },
        {
          title: "90 Sekunden pro Monat",
          desc: "Forschung zeigt einen dramatischen Qualitätsabfall bei längeren Umfragen (Galesic & Bosnjak, 2009). Eine Frage täglich, nicht 50 Fragen jährlich."
        },
        {
          title: "Kern: JD-R Modell",
          desc: "Aufgebaut auf dem Job Demands-Resources Modell (Demerouti & Bakker, 2001). Burnout entsteht wenn Anforderungen Ressourcen übersteigen."
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
      title: "Sehen Sie das Unternehmen aus Ihrer Perspektive.",
      subtitle: "Wählen Sie Ihren Blickwinkel und erhalten Sie konkrete Antworten.",
      benefits: [
        "Ich will ein produktives Team",
        "Ich will wissen, was und warum nicht funktioniert",
        "Ich will volle Transparenz"
      ],
      investor: {
        role: "Investor",
        title: "Investitionsschutz",
        list: [
          "Risikoprognose",
          "Kontinuierliches Monitoring der Portfolio-Gesundheit"
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
      watchDemo: "Demo ansehen",
      features: [
        { title: "Stimmungs-Röntgen", desc: "Sofortiger Überblick, wie sich verschiedene Teams fühlen. Aufschlüsselung nach Abteilung, Standort oder Seniorität." },
        { title: "Erkennung toxischer Herde", desc: "System warnt vor Anomalien, die auf Mobbing, Burnout oder Führungsversagen hinweisen." },
        { title: "Interventions-Priorisierung", desc: "Wissen nicht, was zuerst lösen? Echo ordnet Probleme nach Geschäftsauswirkung und Fluktuationsrisiko." }
      ]
    },
    purchase: {
      title: "Preis nach Unternehmensgröße",
      subtitle: "Die Schätzung richtet sich nach der Mitarbeiterzahl. Endgültiger Umfang und Preis nach einem kurzen Gespräch.",
      features: [
        "Laufende Puls-Erhebungen und Signalanalyse",
        "Dashboard für Führung und HR",
        "Konkrete Handlungsempfehlungen",
        "Sichere Datenverarbeitung (DSGVO)"
      ],
      button: "Individuelles Angebot anfordern",
      guaranteeShort: "Finaler Umfang und Preis nach dem Erstgespräch."
    },
    cta: {
      title: "Warten Sie nicht auf die nächste Kündigung.",
      subtitle: "Blindheit kostet Unternehmen jährlich Millionen an verlorener Produktivität und Neueinstellungen. Gewinnen Sie die Kontrolle in 48 Stunden zurück.",
      primary: "Beratung vereinbaren",
      demoButton: "Demo testen",
      secondary: "oder rufen Sie an",
      secondaryLink: "+420 777 123 456",
      benefits: [
        { title: "Keine Verpflichtung", desc: "Erstberatung und Demo sind kostenlos. Verstehen Sie die Systemlogik in 20 Minuten." },
        { title: "Datenschutz-Garantie", desc: "DSGVO-Konformität und klare Regeln für den Datenumgang. Ihre Daten bleiben auf EU-Servern." },
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
    demoRequest: {
      title: "Get Demo Access",
      titleCz: "Získat přístup k demo",
      subtitle: "We'll send you a personalized demo link",
      subtitleCz: "Pošleme vám personalizovaný odkaz na demo",
      emailLabel: "Work email",
      emailLabelCz: "Pracovní email",
      phoneLabel: "Phone",
      phoneLabelCz: "Telefon",
      sizeLabel: "Company size",
      sizeLabelCz: "Velikost firmy",
      roleLabel: "Your role",
      roleLabelCz: "Vaše role",
      submit: "Send me the demo",
      submitCz: "Poslat demo",
      successTitle: "Check your inbox!",
      successTitleCz: "Zkontrolujte email!",
      successMessage: "Demo link is on its way.",
      successMessageCz: "Odkaz na demo je na cestě.",
      roles: {
        ceo: "CEO / Founder",
        hr: "HR / People Ops",
        leader: "Team Leader",
        other: "Other"
      },
      sizes: {
        xs: "10-30 employees",
        sm: "31-50 employees",
        md: "51-100 employees",
        lg: "101-200 employees",
        xl: "201-350 employees",
        xxl: "350+ employees"
      }
    },
    tryPage: {
      badge: "Interactive Preview",
      badgeCz: "Interaktivní ukázka",
      title: "Try Echo Pulse yourself",
      titleCz: "Vyzkoušejte Echo Pulse na vlastní kůži",
      subtitle: "See what your employees would experience",
      subtitleCz: "Podívejte se, co zažijí vaši zaměstnanci",
      ctaTitle: "Want to see the results?",
      ctaTitleCz: "Chcete vidět výsledky?",
      ctaButton: "Get full demo access",
      ctaButtonCz: "Získat plný přístup k demo"
    },
    leadCapture: {
      badge: "Kostenloses E-Book",
      title: "Praktischer Leitfaden: Teams nach Signalen steuern.",
      subtitle: "Wir schicken Ihnen ein E-Book mit konkreten Tipps, wie Sie schnell erkennen, was und warum etwas nicht funktioniert. Kein Spam.",
      nameLabel: "Name (optional)",
      namePlaceholder: "Ihr Name",
      emailLabel: "Geschäftliche E-Mail",
      emailPlaceholder: "name@company.com",
      submit: "E-Book erhalten",
      successTitle: "E-Book ist unterwegs.",
      successMessage: "Bitte prüfen Sie Ihr Postfach.",
      consent: "Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Kontaktdaten für die E-Book-Zustellung zu.",
      errorInvalid: "Bitte geben Sie eine gültige E-Mail ein.",
      errorGeneric: "Senden fehlgeschlagen."
    },
    demoModal: {
      choiceTitle: "Wie möchten Sie Echo Pulse sehen?",
      choiceSubtitle: "Wählen Sie, was am besten passt",
      selfServe: {
        title: "Demo-Video ansehen",
        subtitle: "3 Minuten – Kurzüberblick",
        features: ["Sofortiger Zugang", "Ohne Registrierung", "Kernfunktionen"],
        cta: "Jetzt abspielen"
      },
      liveDemo: {
        title: "Live-Demo mit Experten",
        subtitle: "30 Minuten – personalisiert",
        features: ["Ihre Fragen beantwortet", "Konkrete Use-Cases", "Keine Verpflichtung"],
        cta: "Termin buchen"
      },
      videoTitle: "Echo Pulse – Demo",
      recommended: "Empfohlen"
    },
    demoChoiceModal: {
      title: "Wie möchten Sie Echo Pulse kennenlernen?",
      subtitle: "Wählen Sie den Weg, der zu Ihnen passt",
      selfServe: {
        badge: "Sofortiger Zugang",
        title: "Selbst erkunden",
        subtitle: "Erhalten Sie Zugang zur Demo-App mit echten Daten",
        features: [
          "Komplette Demo-Umgebung",
          "Unbegrenzte Zeit zum Erkunden",
          "Echte Unternehmensdaten"
        ],
        cta: "Zugang erhalten",
        note: "Erfordert Geschäfts-E-Mail + Telefon"
      },
      guided: {
        badge: "Empfohlen",
        title: "Beratung mit Experten",
        subtitle: "20min Videoanruf mit unserem Berater",
        features: [
          "Personalisierte Führung",
          "Alle Ihre Fragen beantwortet",
          "Spezifische Use-Cases für Ihre Branche"
        ],
        cta: "Termin wählen",
        note: "Keine Verpflichtung"
      }
    },
    demoAccess: {
      badge: "Voller Demo-Zugang",
      title: "Testen Sie Echo Pulse",
      titleHighlight: "mit echten Daten",
      subtitle: "Erkunden Sie das Dashboard, das unsere Kunden sehen. Keine Einschränkungen, kein Zeitlimit.",
      features: [
        { icon: "monitor", text: "Komplette Demo-Umgebung" },
        { icon: "clock", text: "Unbegrenzter Zugang" },
        { icon: "users", text: "Echte Unternehmensdaten" }
      ],
      emailLabel: "Geschäfts-E-Mail",
      emailPlaceholder: "max.mustermann@firma.de",
      phoneLabel: "Telefon",
      phonePlaceholder: "+49 170 123 4567",
      companyLabel: "Firmenname (optional)",
      companyPlaceholder: "Ihre Firma GmbH",
      submitCta: "Zugang erhalten",
      submitting: "Wird gesendet...",
      noSpam: "Kein Spam. Wir verwenden Ihre Daten nur zur Verifizierung.",
      errors: {
        workEmailRequired: "Bitte geben Sie eine Geschäfts-E-Mail ein (nicht gmail, yahoo...)",
        phoneRequired: "Telefon ist erforderlich",
        generic: "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
      },
      successTitle: "Ihr Zugang ist bereit!",
      successSubtitle: "Verwenden Sie diese Zugangsdaten für die Demo:",
      credentials: {
        urlLabel: "Demo-App",
        emailLabel: "Login-E-Mail",
        passwordLabel: "Passwort"
      },
      copyButton: "Kopieren",
      copied: "Kopiert!",
      openDemo: "Demo-App öffnen",
      upsellTitle: "Möchten Sie eine geführte Tour?",
      upsellText: "Buchen Sie eine 20min Beratung und wir zeigen Ihnen, was Echo Pulse in Ihrem Unternehmen aufdeckt.",
      upsellCta: "Beratung buchen"
    },
    bookingModal: {
      badge: "Persönliche Beratung",
      title: "20 Minuten, die",
      titleHighlight: "Ihren Blick auf Daten verändern",
      subtitle: "Videoanruf mit unserem Berater. Wir zeigen Ihnen, was Echo Pulse in Ihrem Unternehmen aufdeckt.",
      benefits: [
        { icon: "target", text: "Personalisierte Demo für Ihre Branche" },
        { icon: "users", text: "Alle Ihre Fragen beantwortet" },
        { icon: "shield", text: "Keine Verpflichtung, kein Hard-Sell" }
      ],
      duration: "20 Minuten",
      format: "Videoanruf (Google Meet / Zoom)",
      cta: "Termin wählen",
      calendarTitle: "Wählen Sie einen verfügbaren Termin",
      calendarSubtitle: "Kalender wird geladen...",
      back: "Zurück"
    },
    data: {
      trustedBy: "VON FÜHRENDEN UNTERNEHMEN GENUTZT"
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
