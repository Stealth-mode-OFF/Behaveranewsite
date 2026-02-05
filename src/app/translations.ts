export type Language = "en" | "cz" | "de";

export const translations = {
  en: {
    radar: {
      badge: "Full Spectrum Analysis",
      title: "Signal",
      titleHighlight: "Radar",
      subtitle: "Echo Pulse continuously monitors key areas of work reality. No noise. Just clear signals where support or tools are missing.",
      summary: "From mood and stress to recognition and growth — we measure what matters.",
      accordionLabel: "View all 9 signals we monitor →",
      coreInsightLabel: "Core Insight",
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
      title: "Scientific tool, not a 'survey'.",
      subtitle: "We're not another happiness survey. We measure what actually affects performance and team stability.",
      cards: [
        {
          title: "Signal, not satisfaction",
          desc: "We don't care if people are satisfied. We track risks, blockers, and what prevents performance."
        },
        {
          title: "90 seconds a month",
          desc: "No hour-long surveys. Short pulses that don't burden people - yet still give relevant data."
        },
        {
          title: "Scientific foundation",
          desc: "Based on the Job Demands-Resources model. We measure the balance between what you ask from people and what you give them."
        }
      ]
    },
    czechReality: {
      title: "Most companies today fall into one of two patterns.",
      subtitle: "Whether we talk to corporations or fast-growing startups - we hit the same problem. Leadership doesn't see what's happening in teams until it's too late.",
      diagnosisLabel: "Result:",
      archetypeA: {
        title: "A) Stable, but tired",
        point1: {
          title: "Everything runs, but nothing moves.",
          desc: "People are loyal but out of energy. Processes work, but initiative is missing. Changes hit silent 'but we've always done it this way'."
        },
        point2: {
          title: "Leadership is far from reality.",
          desc: "Management learns about problems only when they escalate. Missing continuous overview of what troubles people."
        },
        diagnosis: "Loss of competitiveness - slowly but surely."
      },
      archetypeB: {
        title: "B) Fast, but fragile",
        point1: {
          title: "Everyone's going full throttle, no one's keeping up.",
          desc: "Young team, high tempo, eternal feeling of 'I can't keep up'. No time for reflection. Problems are swept under the rug."
        },
        point2: {
          title: "Success depends on a few people.",
          desc: "Results grow, but depend on individuals on the edge of burnout. One departure and the system collapses."
        },
        diagnosis: "Risk that key people leave without warning."
      },
      synthesis: {
        title: "In both cases the same thing is missing: continuous visibility.",
        desc: "You don't need more motivation. You need to know what's happening - before it becomes a problem."
      }
    },
    roleSelection: {
      title: "Everyone sees the company from a different angle.",
      subtitle: "Select your role and see what specifically Echo Pulse gives you.",
      benefits: [
        "I want a productive team",
        "I want to know what blocks performance",
        "I want visibility without blind spots"
      ],
      investor: {
        role: "Investor",
        title: "Company health overview",
        list: [
          "Early warning before problems",
          "Risks caught in time"
        ],
        cta: "Check portfolio health"
      },
      ceo: {
        role: "CEO / Owner",
        title: "Unfiltered overview",
        list: [
          "You see what's happening in teams",
          "You solve problems before they escalate"
        ],
        cta: "How it helps leadership"
      },
      hr: {
        role: "HR / People Ops",
        title: "Data instead of guesses",
        list: [
          "Arguments leadership understands",
          "Less firefighting, more prevention"
        ],
        cta: "How it helps HR"
      },
      teamLeader: {
        role: "Team Leader",
        title: "Feedback from team",
        list: [
          "You know what troubles people",
          "You catch burnout early"
        ],
        cta: "How it helps managers"
      }
    },
    valueByRole: {
      badge: "By role",
      title: "One tool, different benefits.",
      subtitle: "CEO needs overview for decisions. HR needs a prevention tool. Echo Pulse gives both - without unnecessary noise.",
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
    blog: {
      title: "Blog",
      pageTitle: "Insights & Analysis",
      pageSubtitle: "Deep dives into organizational psychology, leadership data, and the future of work.",
      defaultTag: "Insight",
      backToList: "Back to Insights",
      loading: "Loading...",
      notFound: "Post not found",
      seoTitle: "Blog & Insights",
      seoDescription: "Practical articles on engagement, retention, and organizational psychology.",
      seoKeywords: "employee engagement, HR analytics, burnout prevention, organizational psychology, retention strategies"
    },
    caseStudies: {
      loading: "Loading...",
      notFound: "Case study not found",
      backToList: "Back to Success Stories",
      resultsLabel: "Results",
      industryLabel: "Industry",
      challengeTitle: "The Challenge",
      solutionTitle: "The Solution"
    },
    research: {
      seoTitle: "Echo Pulse system architecture",
      seoDescription: "Evidence base and methodology behind the early-warning system.",
      seoKeywords: "organizational psychology, JD-R model, predictive analytics, burnout detection",
      unavailableTitle: "Research content is available in Czech",
      unavailableBody: "This page is currently maintained in Czech only. Switch to Czech to view the full research content.",
      switchToCz: "Switch to Czech",
      backToHome: "Back to home"
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
      badge: "Hard Data",
      title: "Calculate Your",
      titleHighlight: "ROI",
      subtitle: "See the financial impact of turnover on your organization.",
      sliders: {
        companySize: "Company Size",
        employees: "Employees",
        avgAnnualCost: "Avg. Annual Cost",
        annualTurnover: "Annual Turnover"
      },
      boardReport: {
        title: "Board Report",
        subtitle: "Get a PDF summary for your leadership team.",
        button: "Generate Report",
        buttonGenerating: "Generating..."
      },
      metrics: {
        annualLoss: "Annual Loss from Turnover",
        recoverableRevenue: "Recoverable with Echo Pulse"
      },
      cta: {
        button: "See How It Works"
      }
    }
  },
  cz: {
    radar: {
      badge: "Kompletní přehled",
      title: "9 oblastí,",
      titleHighlight: "které rozhodují o stabilitě týmu",
      subtitle: "Echo Pulse průběžně sleduje 9 klíčových oblastí pracovního života. Bez zbytečného šumu - jen signály, které vám řeknou, kde to drhne.",
      summary: "Od nálady a stresu po uznání a růst - měříme to, na čem záleží.",
      accordionLabel: "Zobrazit všech 9 signálů →",
      coreInsightLabel: "Klíčový signál",
      methodology: "Postaveno na výzkumech Job Demands-Resources (JD-R), Self-Determination Theory a Equity Theory.",
      signals: {
        mood: { title: "Nálada v týmu", question: "Jak se lidé doopravdy cítí?", metrics: ["Pohoda", "Energie", "Motivace"] },
        stress: { title: "Stres a tlak", question: "Pomáhá tlak výkonu, nebo lidi vypaluje?", metrics: ["Chronický stres", "Přetížení", "Odpočinek"] },
        workload: { title: "Vytížení", question: "Stíhají to, co mají?", metrics: ["Zátěž", "Priority", "Tempo"] },
        tools: { title: "Podpora", question: "Mají, co potřebují, aby mohli pracovat?", metrics: ["Nástroje", "Zdroje", "Překážky"] },
        recognition: { title: "Uznání", question: "Ví lidé, že jejich práce má smysl?", metrics: ["Zpětná vazba", "Ocenění", "Dopad"] },
        growth: { title: "Rozvoj", question: "Využíváme potenciál lidí naplno?", metrics: ["Autonomie", "Výzvy", "Růst"] },
        rewards: { title: "Odměňování", question: "Berou lidé odměnu jako férovou?", metrics: ["Mzda", "Spravedlnost", "Transparentnost"] },
        benefits: { title: "Benefity", question: "Používají lidé benefity, které nabízíme?", metrics: ["Využití", "Spokojenost", "Hodnota"] },
        evp: { title: "Hodnoty firmy", question: "Děláme to, co říkáme?", metrics: ["Důvěra", "Soulad", "Hrdost"] }
      }
    },
    header: {
      product: "Produkt",
      solutions: "Řešení",
      pricing: "Ceník",
      about: "O nás",
      login: "Přihlásit se",
      bookDemo: "Vyzkoušet zdarma",
      nav: {
        problem: "Problém",
        solution: "Řešení",
        impact: "Výsledky"
      },
    },
    hero: {
      badge: "Průběžný feedback od týmu",
      title: "Mějte přehled,",
      titleHighlight: "co se ve firmě skutečně děje",
      subtitle: "Roční průzkumy zachytí problém, až když je pozdě. Echo Pulse vám dává průběžné signály - víte, kde to drhne, dřív než začnou výpovědi.",
      primaryCta: "Zarezervovat ukázku (30 min)",
      secondaryCta: "Prohlédnout demo",
      riskReversal: "Žádné závazky. Po 30 minutách budete vědět, jestli to dává smysl pro vaši firmu.",
      trust: {
        security: "GDPR compliant",
        support: "Česká podpora",
        implementation: "Start do 1 hodiny",
        languages: "CZ / EN / DE"
      },
    },
    problems: {
      badge: "Proč to řešit",
      title: "Lidé neodcházejí ze dne na den.",
      subtitle: "Rozhodnutí odejít zraje měsíce. Problém je, že o tom většinou nevíte - dokud nedostanete výpověď.",
      items: [
        {
          title: "Skryté důvody",
          value: "70%+",
          desc: "Skutečné důvody odchodu se nedozvíte z exit interview. Ty zůstávají v hlavách lidí a v soukromých rozhovorech.",
        },
        {
          title: "Ztráta výkonu",
          value: "-20%",
          desc: "Člověk, který už vnitřně rezignoval, pracuje na zlomek svého potenciálu. A často to trvá měsíce.",
        },
        {
          title: "Zpoždění reakce",
          value: "6+ měs.",
          desc: "Průměrná doba, než si management všimne problému a začne ho řešit. Do té doby už je často pozdě.",
        },
      ],
      ctaBox: {
        title: "Na tohle intuice nestačí.",
        desc: "Potřebujete průběžná data. Jinak jen hádáte, proč lidé ztrácejí motivaci."
      }
    },
    howItWorks: {
      badge: "Jak to funguje",
      stepLabel: "Krok",
      title: "Jak to",
      titleHighlight: "funguje",
      subtitle: "Žádné komplikované nastavování. Propojíte Echo Pulse s komunikačním nástrojem, který už používáte, a během hodiny máte první data.",
      steps: {
        step1: {
          title: "Rozumí kontextu",
          desc: "Echo Pulse nepočítá jen slova. Chápe, co lidé říkají mezi řádky - a z tisíců odpovědí vybere to, co opravdu potřebujete vědět."
        },
        step2: {
          title: "Běží na autopilota",
          desc: "Krátké otázky chodí automaticky přes Slack, Teams nebo e-mail. Lidé odpoví za minutu. Vy nemusíte nic rozesílat.",
          highlight: "Systém hlídá, aby to lidi neobtěžovalo - a vy dostáváte čistá data."
        },
        step3: {
          title: "Navrhuje, co dělat",
          desc: "Nejde jen o grafy. Echo Pulse řekne manažerům konkrétně, co mají udělat a proč."
        },
        step4: {
          title: "Garantovaná anonymita",
          desc: "Lidé vědí, že jejich odpovědi nikdo nespojí s jejich jménem. Proto odpovídají upřímně."
        }
      }
    },
    methodology: {
      title: "Vědecký nástroj, ne 'dotazník'.",
      subtitle: "Nejsme další happiness survey. Měříme to, co skutečně ovlivňuje výkon a stabilitu týmu.",
      cards: [
        {
          title: "Signál, ne spokojenost",
          desc: "Nezajímá nás, jestli jsou lidé spokojeni. Sledujeme rizika, překážky a to, co brání výkonu."
        },
        {
          title: "90 sekund měsíčně",
          desc: "Žádné hodinové dotazníky. Krátké pulzy, které lidi nezatěžují - a přesto dávají relevantní data."
        },
        {
          title: "Vědecký základ",
          desc: "Vycházíme z modelu Job Demands-Resources. Měříme rovnováhu mezi tím, co od lidí chcete, a tím, co jim dáváte."
        }
      ]
    },
    czechReality: {
      title: "Většina firem dnes spadá do jednoho ze dvou vzorců.",
      subtitle: "Ať mluvíme s korporátem, nebo s rychle rostoucím startupem - narážíme na stejný problém. Vedení nevidí, co se děje v týmech, dokud není pozdě.",
      diagnosisLabel: "Výsledek:",
      archetypeA: {
        title: "A) Stabilní, ale unavená",
        point1: {
          title: "Všechno běží, ale nic se nehýbe.",
          desc: "Lidé jsou loajální, ale už nemají energii. Procesy fungují, ale chybí iniciativa. Změny narážejí na tiché 'ale vždycky to tak bylo'."
        },
        point2: {
          title: "Vedení je daleko od reality.",
          desc: "Management se dozvídá o problémech, až když eskalují. Chybí průběžný přehled o tom, co lidi trápí."
        },
        diagnosis: "Ztráta konkurenceschopnosti - pomalu, ale jistě."
      },
      archetypeB: {
        title: "B) Rychlá, ale křehká",
        point1: {
          title: "Všichni jedou naplno, nikdo nestíhá.",
          desc: "Mladý tým, vysoké tempo, věčný pocit 'nestíhám'. Na reflexi není čas. Problémy se zametají pod koberec."
        },
        point2: {
          title: "Úspěch stojí na pár lidech.",
          desc: "Výsledky rostou, ale závisí na jednotlivcích, kteří jsou na hranici vyhoření. Stačí jeden odchod a systém se sesype."
        },
        diagnosis: "Riziko, že klíčoví lidé odejdou bez varování."
      },
      synthesis: {
        title: "V obou případech chybí to samé: průběžný přehled.",
        desc: "Nepotřebujete víc motivace. Potřebujete vědět, co se děje - dřív, než to bude problém."
      }
    },
    roleSelection: {
      title: "Každý se na firmu dívá z jiného úhlu.",
      subtitle: "Vyberte svou roli a uvidíte, co konkrétně vám Echo Pulse dá.",
      benefits: [
        "Chci mít produktivní tým",
        "Chci vědět, co blokuje výkon",
        "Chci přehled bez slepých míst"
      ],
      investor: {
        role: "Investor",
        title: "Přehled o zdraví firmy",
        list: [
          "Včasné varování před problémy",
          "Rizika zachycená včas"
        ],
        cta: "Zkontrolovat zdraví portfolia"
      },
      ceo: {
        role: "CEO / Majitel",
        title: "Přehled bez filtru",
        list: [
          "Vidíte, co se děje v týmech",
          "Řešíte problémy dřív, než eskalují"
        ],
        cta: "Jak to pomůže vedení"
      },
      hr: {
        role: "HR / People Ops",
        title: "Data místo dohadů",
        list: [
          "Argumenty, kterým vedení rozumí",
          "Méně hašení, víc prevence"
        ],
        cta: "Jak to pomůže HR"
      },
      teamLeader: {
        role: "Team Leader",
        title: "Zpětná vazba od týmu",
        list: [
          "Víte, co lidi trápí",
          "Zachytíte vyhoření včas"
        ],
        cta: "Jak to pomůže manažerům"
      }
    },
    valueByRole: {
      title: "Jeden nástroj, různé přínosy.",
      subtitle: "CEO potřebuje přehled pro rozhodování. HR potřebuje nástroj na prevenci. Echo Pulse dává obojí - bez zbytečného šumu.",
      badge: "Podle role",
      tabs: {
        ceo: "CEO / Vedení",
        hr: "HR / People Ops"
      },
      cta: {
        ceo: "Sjednat CEO demo",
        hr: "Sjednat HR demo"
      },
      ctaNote: "20 min • Přizpůsobeno vaší roli",
      ceo: {
        title: "Pro vedení firmy",
        desc: "Konec domněnek o tom, jak to lidé mají. Vidíte přesně, která oddělení jsou přetížená, kde hrozí odchody a kde se nedaří komunikovat strategii.",
        list: [
          { title: "Včasné varování", desc: "Identifikujete lidi v riziku odchodu s měsíčním předstihem." },
          { title: "Realita strategie", desc: "Zjistíte, jestli týmy chápou vaše priority - nebo jedou na setrvačníku." },
          { title: "Návratnost investic", desc: "Méně neplánovaných odchodů = menší náklady na nábor a zaučení." }
        ]
      },
      hr: {
        title: "Pro HR a People Ops",
        desc: "Přestaňte být ti, co řeší problémy. S průběžnými daty jste strategický partner, ne hasič.",
        list: [
          { title: "Data, ne dojmy", desc: "Když jdete za vedením, máte čísla - ne stížnosti z kuchyňky." },
          { title: "Automatický sběr", desc: "Žádné ruční rozesílání. Systém běží sám, vy řešíte výsledky." },
          { title: "Rostoucí důvěra", desc: "Lidé vidí, že se něco děje. Ochota sdílet pravdu roste." }
        ]
      },
      bottomBadge: "Pro firmy od 30 do 350 lidí"
    },
    dashboard: {
      badge: "Přehled pro vedení",
      title: "Vidíte to, co se dřív říkalo",
      titleHighlight: "jen u kávy.",
      subtitle: "Echo Pulse sbírá rozptýlené signály a ukazuje je na jednom místě. Jasně a bez zbytečných grafů.",
      watchDemo: "Přehrát demo",
      features: [
        { title: "Nálada podle týmů", desc: "Okamžitý přehled, jak se cítí jednotlivá oddělení. Rozděleno podle lokality, seniority nebo manažera." },
        { title: "Varování před problémy", desc: "Systém upozorní, když něco nesedí - přetížení, napětí v týmu, nebo výrazný pokles energie." },
        { title: "Priority pro akci", desc: "Nevíte, co řešit první? Echo seřadí problémy podle dopadu na byznys a rizika odchodu." }
      ]
    },
    purchase: {
      title: "Ceník podle velikosti firmy",
      subtitle: "Orientační odhad se odvíjí od počtu zaměstnanců. Finální rozsah a cena se potvrdí po krátké konzultaci.",
      badge: "Ceník",
      configTitle: "Nastavení tarifu",
      billingMonthly: "Měsíčně",
      billingYearly: "Ročně (-20%)",
      companySizeLabel: "Velikost firmy",
      employeesLabel: "zaměstnanců",
      estimatedLabel: "Odhad investice",
      perMonthLabel: "Kč / měsíc",
      priceCapped: "Cena zastropovaná na {cap} zaměstnancích",
      basePriceLabel: "Základní cena",
      vatLabel: "DPH (21%)",
      features: [
        "Průběžné pulzy a analýza signálů",
        "Dashboard pro vedení a HR",
        "Akční doporučení pro manažery",
        "Bezpečné zpracování dat (GDPR)"
      ],
      button: "Chci nabídku na míru",
      guaranteeShort: "Finální rozsah a cena se potvrdí po úvodní konzultaci."
    },
    trustCenter: {
      badge: "Trust Center",
      title: "Bezpečnost práce s daty",
      subtitle: "Transparentně popisujeme, jak nakládáme s osobními údaji, jaké povinnosti přebíráme a jak chráníme důvěrné informace.",
      highlights: [
        "Zpracování osobních údajů probíhá v souladu s GDPR a platnými právními předpisy.",
        "Správcem údajů je Behavera s.r.o., Křižíkova 148/34, Karlín, Praha 8.",
        "Pověřenec pro ochranu osobních údajů: gdpr@behavera.com.",
        "Údaje uchováváme po dobu registrace a následně 6 měsíců, poté je anonymizujeme nebo vymažeme.",
        "Agregované statistiky jsou anonymizované a neobsahují osobní údaje.",
        "Subjekty údajů mají právo na přístup, přenos, opravu, výmaz a odvolání souhlasu."
      ],
      privacyFallbackTitle: "Zásady ochrany osobních údajů",
      termsFallbackTitle: "Obchodní a produktové podmínky",
      contentFallback: "Obsah připravujeme."
    },
    cta: {
      title: "Nečekejte na další výpověď.",
      subtitle: "Každý nečekaný odchod stojí měsíce práce a statisíce korun. Začněte mít přehled - ještě dnes.",
      primary: "Zarezervovat ukázku",
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
    blog: {
      title: "Blog",
      pageTitle: "Analýzy a poznatky",
      pageSubtitle: "Praktické články o psychologii práce, vedení a datově řízeném řízení lidí.",
      defaultTag: "Poznatky",
      backToList: "Zpět na články",
      loading: "Načítání...",
      notFound: "Článek nebyl nalezen",
      seoTitle: "Blog & Insights",
      seoDescription: "Praktické články o engagementu, retenci a organizační psychologii.",
      seoKeywords: "engagement, HR analytika, prevence vyhoření, organizační psychologie, retence"
    },
    caseStudies: {
      loading: "Načítání...",
      notFound: "Případová studie nebyla nalezena",
      backToList: "Zpět na případové studie",
      resultsLabel: "Výsledky",
      industryLabel: "Odvětví",
      challengeTitle: "Výzva",
      solutionTitle: "Řešení"
    },
    research: {
      seoTitle: "Architektura systému Echo Pulse",
      seoDescription: "Detekční engine založený na JD-R Model, Self-Determination Theory a Affective Events Theory.",
      seoKeywords: "organizational intelligence, predictive analytics, burnout detection, JD-R model",
      unavailableTitle: "Obsah výzkumu je dostupný pouze česky",
      unavailableBody: "Tuto stránku aktuálně udržujeme jen v češtině. Přepněte jazyk na češtinu pro zobrazení celého obsahu.",
      switchToCz: "Přepnout do češtiny",
      backToHome: "Zpět na hlavní stránku"
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
      title: "Získat přístup k demo",
      subtitle: "Pošleme vám personalizovaný odkaz na demo",
      emailLabel: "Pracovní email",
      phoneLabel: "Telefon",
      sizeLabel: "Velikost firmy",
      roleLabel: "Vaše role",
      submit: "Poslat demo",
      successTitle: "Zkontrolujte email!",
      successMessage: "Odkaz na demo je na cestě.",
      errorInvalidEmail: "Zadejte prosím platný email.",
      errorInvalidPhone: "Zadejte prosím platné české telefonní číslo.",
      errorRequired: "Toto pole je povinné.",
      errorGeneric: "Odeslání se nezdařilo. Zkuste to prosím znovu.",
      companySizePlaceholder: "Vyberte velikost",
      rolePlaceholder: "Vyberte roli",
      roles: {
        ceo: "CEO / Zakladatel",
        hr: "HR / Lidé a kultura",
        leader: "Týmový lídr",
        other: "Jiné"
      },
      sizes: {
        xs: "10–30 zaměstnanců",
        sm: "31–50 zaměstnanců",
        md: "51–100 zaměstnanců",
        lg: "101–200 zaměstnanců",
        xl: "201–350 zaměstnanců",
        xxl: "350+ zaměstnanců"
      }
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
      badge: "Tvrdá data",
      title: "Spočítejte si svou",
      titleHighlight: "návratnost",
      subtitle: "Podívejte se, kolik vás fluktuace skutečně stojí.",
      sliders: {
        companySize: "Velikost firmy",
        employees: "Počet zaměstnanců",
        avgAnnualCost: "Průměrné roční náklady",
        annualTurnover: "Roční fluktuace"
      },
      boardReport: {
        title: "Report pro vedení",
        subtitle: "PDF shrnutí pro váš leadership tým.",
        button: "Vygenerovat report",
        buttonGenerating: "Generuji..."
      },
      metrics: {
        annualLoss: "Roční ztráta z fluktuace",
        recoverableRevenue: "Zachránitelné s Echo Pulse"
      },
      cta: {
        button: "Jak to funguje"
      }
    }
  },
  de: {
    radar: {
      badge: "Vollspektrumanalyse",
      title: "Signal",
      titleHighlight: "Radar",
      subtitle: "Echo Pulse überwacht kontinuierlich die wichtigsten Bereiche der Arbeitsrealität. Kein Rauschen. Nur klare Signale, wo Unterstützung oder Tools fehlen.",
      summary: "Von Stimmung und Stress bis Anerkennung und Wachstum — wir messen, was zählt.",
      accordionLabel: "Alle 9 überwachten Signale anzeigen →",
      coreInsightLabel: "Kernsignal",
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
      badge: "Kontinuierliches Team-Feedback",
      title: "Wissen Sie, was",
      titleHighlight: "wirklich in Ihrem Unternehmen passiert",
      subtitle: "Jährliche Umfragen erfassen Probleme zu spät. Echo Pulse gibt Ihnen kontinuierliche Signale - Sie wissen, wo es hakt, bevor Kündigungen kommen.",
      primaryCta: "Demo buchen (30 Min)",
      secondaryCta: "Demo erkunden",
      riskReversal: "Keine Verpflichtung. Nach 30 Minuten wissen Sie, ob es für Ihr Unternehmen Sinn macht.",
      trust: {
        security: "DSGVO-konform",
        support: "Lokaler Support",
        implementation: "Start in 1 Stunde",
        languages: "CZ / EN / DE"
      },
    },
    problems: {
      badge: "Warum das lösen",
      title: "Menschen kündigen nicht von heute auf morgen.",
      subtitle: "Die Entscheidung zu gehen reift monatelang. Das Problem ist, dass Sie es meist nicht wissen - bis Sie die Kündigung bekommen.",
      items: [
        {
          title: "Versteckte Gründe",
          value: "70%+",
          desc: "Die wahren Kündigungsgründe erfahren Sie nicht aus Exit-Interviews. Sie bleiben in den Köpfen der Menschen und in privaten Gesprächen.",
        },
        {
          title: "Leistungsverlust",
          value: "-20%",
          desc: "Jemand, der innerlich bereits gekündigt hat, arbeitet nur mit einem Bruchteil seines Potenzials. Und das dauert oft Monate.",
        },
        {
          title: "Verzögerte Reaktion",
          value: "6+ Mo.",
          desc: "Durchschnittliche Zeit, bis das Management ein Problem bemerkt und es angeht. Bis dahin ist es oft zu spät.",
        },
      ],
      ctaBox: {
        title: "Für das reicht Intuition nicht aus.",
        desc: "Sie brauchen kontinuierliche Daten. Sonst raten Sie nur, warum Menschen die Motivation verlieren."
      }
    },
    howItWorks: {
      badge: "So funktioniert es",
      stepLabel: "Schritt",
      title: "So funktioniert",
      titleHighlight: "es",
      subtitle: "Keine komplizierte Einrichtung. Verbinden Sie Echo Pulse mit dem Kommunikationstool, das Sie bereits nutzen, und Sie haben innerhalb einer Stunde erste Daten.",
      steps: {
        step1: {
          title: "Versteht den Kontext",
          desc: "Echo Pulse zählt nicht nur Wörter. Es versteht, was Menschen zwischen den Zeilen sagen - und wählt aus tausenden Antworten aus, was Sie wirklich wissen müssen."
        },
        step2: {
          title: "Läuft auf Autopilot",
          desc: "Kurze Fragen gehen automatisch über Slack, Teams oder E-Mail raus. Menschen antworten in einer Minute. Sie müssen nichts versenden.",
          highlight: "Das System stellt sicher, dass Menschen nicht gestört werden - und Sie saubere Daten bekommen."
        },
        step3: {
          title: "Schlägt vor, was zu tun ist",
          desc: "Es sind nicht nur Grafiken. Echo Pulse sagt Managern konkret, was zu tun ist und warum."
        },
        step4: {
          title: "Garantierte Anonymität",
          desc: "Menschen wissen, dass ihre Antworten nicht mit ihrem Namen verknüpft werden. Deshalb antworten sie ehrlich."
        }
      }
    },
    methodology: {
      title: "Wissenschaftliches Tool, keine 'Umfrage'.",
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
      badge: "Nach Rolle",
      tabs: {
        ceo: "CEO / Geschäftsführung",
        hr: "HR / People Ops"
      },
      cta: {
        ceo: "CEO-Demo vereinbaren",
        hr: "HR-Demo vereinbaren"
      },
      ctaNote: "20 Min • Auf Ihre Rolle zugeschnitten",
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
      badge: "Preise",
      configTitle: "Plan konfigurieren",
      billingMonthly: "Monatlich",
      billingYearly: "Jährlich (-20%)",
      companySizeLabel: "Unternehmensgröße",
      employeesLabel: "Mitarbeitende",
      estimatedLabel: "Geschätzte Investition",
      perMonthLabel: "CZK / Monat",
      priceCapped: "Preis gedeckelt bei {cap} Mitarbeitenden",
      basePriceLabel: "Grundpreis",
      vatLabel: "MwSt. (21%)",
      features: [
        "Laufende Puls-Erhebungen und Signalanalyse",
        "Dashboard für Führung und HR",
        "Konkrete Handlungsempfehlungen",
        "Sichere Datenverarbeitung (DSGVO)"
      ],
      button: "Individuelles Angebot anfordern",
      guaranteeShort: "Finaler Umfang und Preis nach dem Erstgespräch."
    },
    trustCenter: {
      badge: "Trust center",
      title: "Datensicherheit und Datenschutz",
      subtitle: "Wir erklären transparent, wie wir personenbezogene Daten verarbeiten, welche Verantwortung wir übernehmen und wie wir vertrauliche Informationen schützen.",
      highlights: [
        "Die Verarbeitung personenbezogener Daten erfolgt gemäß DSGVO und geltenden Gesetzen.",
        "Datenverantwortlicher: Behavera s.r.o., Křižíkova 148/34, Karlín, Prag 8.",
        "Datenschutzkontakt: gdpr@behavera.com.",
        "Daten werden während der Registrierung und anschließend 6 Monate gespeichert, danach anonymisiert oder gelöscht.",
        "Aggregierte Statistiken sind anonymisiert und enthalten keine personenbezogenen Daten.",
        "Betroffene haben Rechte auf Auskunft, Übertragbarkeit, Berichtigung, Löschung und Widerruf der Einwilligung."
      ],
      privacyFallbackTitle: "Datenschutzerklärung",
      termsFallbackTitle: "Allgemeine Geschäftsbedingungen",
      contentFallback: "Inhalt folgt in Kürze."
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
    blog: {
      title: "Blog",
      pageTitle: "Insights & Analysen",
      pageSubtitle: "Praxisnahe Artikel zu Organisationspsychologie, Leadership-Daten und der Zukunft der Arbeit.",
      defaultTag: "Insight",
      backToList: "Zurück zu Insights",
      loading: "Wird geladen...",
      notFound: "Beitrag nicht gefunden",
      seoTitle: "Blog & Insights",
      seoDescription: "Praktische Artikel zu Engagement, Retention und Organisationspsychologie.",
      seoKeywords: "employee engagement, HR analytics, burnout prevention, organizational psychology, retention strategies"
    },
    caseStudies: {
      loading: "Wird geladen...",
      notFound: "Fallstudie nicht gefunden",
      backToList: "Zurück zu Erfolgsgeschichten",
      resultsLabel: "Ergebnisse",
      industryLabel: "Branche",
      challengeTitle: "Herausforderung",
      solutionTitle: "Lösung"
    },
    research: {
      seoTitle: "Architektur des Echo-Pulse-Systems",
      seoDescription: "Evidenzbasis und Methodik des Early-Warning-Systems.",
      seoKeywords: "Organisationspsychologie, JD-R Modell, predictive analytics, burnout detection",
      unavailableTitle: "Forschungsinhalte nur auf Tschechisch verfügbar",
      unavailableBody: "Diese Seite wird derzeit nur auf Tschechisch gepflegt. Wechseln Sie zu Tschechisch, um den vollständigen Inhalt zu sehen.",
      switchToCz: "Auf Tschechisch umschalten",
      backToHome: "Zur Startseite"
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
      title: "Demo-Zugang erhalten",
      subtitle: "Wir senden Ihnen einen personalisierten Demo-Link",
      emailLabel: "Geschäftliche E-Mail",
      phoneLabel: "Telefon",
      sizeLabel: "Unternehmensgröße",
      roleLabel: "Ihre Rolle",
      submit: "Demo senden",
      successTitle: "Bitte prüfen Sie Ihren Posteingang!",
      successMessage: "Der Demo-Link ist unterwegs.",
      errorInvalidEmail: "Bitte geben Sie eine gültige E-Mail ein.",
      errorInvalidPhone: "Bitte geben Sie eine gültige Telefonnummer ein.",
      errorRequired: "Dieses Feld ist erforderlich.",
      errorGeneric: "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
      companySizePlaceholder: "Größe auswählen",
      rolePlaceholder: "Rolle auswählen",
      roles: {
        ceo: "CEO / Founder",
        hr: "HR / People Ops",
        leader: "Teamleiter",
        other: "Andere"
      },
      sizes: {
        xs: "10–30 Mitarbeitende",
        sm: "31–50 Mitarbeitende",
        md: "51–100 Mitarbeitende",
        lg: "101–200 Mitarbeitende",
        xl: "201–350 Mitarbeitende",
        xxl: "350+ Mitarbeitende"
      }
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
      badge: "Harte Daten",
      title: "Berechnen Sie Ihren",
      titleHighlight: "ROI",
      subtitle: "Sehen Sie die finanziellen Auswirkungen von Fluktuation.",
      sliders: {
        companySize: "Unternehmensgröße",
        employees: "Mitarbeiter",
        avgAnnualCost: "Durchschn. Jahreskosten",
        annualTurnover: "Jährliche Fluktuation"
      },
      boardReport: {
        title: "Vorstandsbericht",
        subtitle: "PDF-Zusammenfassung für Ihr Leadership-Team.",
        button: "Bericht generieren",
        buttonGenerating: "Wird generiert..."
      },
      metrics: {
        annualLoss: "Jährlicher Verlust durch Fluktuation",
        recoverableRevenue: "Einsparbar mit Echo Pulse"
      },
      cta: {
        button: "So funktioniert es"
      }
    }
  }
};
