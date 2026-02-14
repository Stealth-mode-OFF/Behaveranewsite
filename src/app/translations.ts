export type Language = "en" | "cz" | "de";

type Translations = {
  header: {
    bookDemo: string;
  };
  problems: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: Array<{ title: string; value: string; desc: string }>;
    ctaBox: { label: string; title: string; desc: string };
  };
  dashboard: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    features: Array<{ title: string; desc: string }>;
  };
  purchase: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    configTitle: string;
    billingMonthly: string;
    billingYearly: string;
    companySizeLabel: string;
    employeesLabel: string;
    estimatedLabel: string;
    perMonthLabel: string;
    priceCapped: string;
    basePriceLabel: string;
    vatLabel: string;
    features: string[];
    button: string;
    guaranteeShort: string;
  };
  faq: {
    title: string;
    titleHighlight: string;
    desc: string;
    contact: string;
    items: Array<{ q: string; a: string }>;
  };
  roleSelection: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    investor: { title: string; list: string[]; cta: string };
    ceo: { title: string; list: string[]; cta: string };
    hr: { title: string; list: string[]; cta: string };
    teamLeader: { title: string; list: string[]; cta: string };
  };
  trustCenter: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    guarantees: Array<{ icon: string; title: string; desc: string; detail: string }>;
    complianceBadges: Array<{ label: string; sub: string }>;
    expandLabel: string;
    collapseLabel: string;
    legalDocsTitle: string;
    dpoLabel: string;
    privacyFallbackTitle: string;
    termsFallbackTitle: string;
    contentFallback: string;
  };
  blog: {
    title: string;
    pageTitle: string;
    pageSubtitle: string;
    defaultTag: string;
    backToList: string;
    loading: string;
    notFound: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  };
  caseStudies: {
    loading: string;
    notFound: string;
    backToList: string;
    resultsLabel: string;
    industryLabel: string;
    challengeTitle: string;
    solutionTitle: string;
  };
  leadPopup: {
    badge: string;
    title: string;
    subtitle: string;
    ebookTitle: string;
    emailPlaceholder: string;
    inputLabel: string;
    cta: string;
    noSpam: string;
    marketingConsent: string;
    socialProofPre: string;
    socialProofCount: string;
    socialProofPost: string;
    quote: string;
    successTitle: string;
    successMessage: string;
    downloadButton: string;
    downloadNote: string;
    close: string;
  };
};

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      bookDemo: "Book a Demo",
    },
    problems: {
      badge: "Turnover cost",
      title: "People don't leave",
      titleHighlight: " overnight.",
      subtitle: "The decision to leave takes months to ripen. The problem? You usually don't know — until you get the resignation.",
      items: [
        {
          title: "UNWANTED ATTRITION",
          value: "6–9× salary",
          desc: "Replacing one employee costs 6–9× their monthly salary on average. Senior roles cost even more. That's not just hiring costs — it's lost know-how, broken team dynamics, and months before the new person reaches full productivity. For someone earning €3,000/month, that’s €18–27k per departure. [Source: SHRM, Gallup]",
        },
        {
          title: "PERFORMANCE LOSS",
          value: "–21%",
          desc: "Actively disengaged teams show 21% lower profitability and significantly lower productivity. Engaged employees are up to 20% more productive. But you don't see the problem — and most companies only find out at exit interviews, when it's too late to change anything. [Source: Gallup State of the Workplace]",
        },
        {
          title: "MANAGER IMPACT",
          value: "70%",
          desc: "Up to 70% of the variance in employee engagement is attributable to the direct manager. Your message is filtered through them. When a manager lacks visibility into what's blocking their people, quiet quitting and burnout spread silently — and you lose people you didn’t have to lose. [Source: Gallup]",
        },
      ],
      ctaBox: {
        label: "Before → After",
        title: "Today you guess. Tomorrow you'll know.",
        desc: "Without Echo Pulse: you react to resignations. With Echo Pulse: you see risks in your dashboard months ahead and know where to act.",
      },
    },
    dashboard: {
      badge: "See it in action",
      title: "One dashboard. Zero guesswork.",
      titleHighlight: "Everything your leadership needs.",
      subtitle: "Echo Pulse collects scattered signals and shows them in one place. Clear, real-time, and ready to act on.",
      features: [
        { title: "Mood by team", desc: "Instant overview of how each department feels. Broken down by location, seniority, or manager." },
        { title: "Warning before problems", desc: "The system alerts when something's off - overload, team tension, or significant energy drop." },
        { title: "Action priorities", desc: "Don't know what to solve first? Echo ranks problems by business impact and departure risk." },
      ],
    },
    purchase: {
      badge: "Pricing",
      title: "Pricing based on",
      titleHighlight: " company size",
      subtitle: "From €4 / employee / month on yearly plan. Estimate is driven by employee count.",
      configTitle: "Configure plan",
      billingMonthly: "Monthly",
      billingYearly: "Yearly (-20%)",
      companySizeLabel: "Company size",
      employeesLabel: "employees",
      estimatedLabel: "Estimated investment",
      perMonthLabel: "/ mo",
      priceCapped: "Price capped at {cap} employees",
      basePriceLabel: "Base price",
      vatLabel: "VAT (21%)",
      features: [
        "Continuous pulses and signal analysis",
        "Executive and HR dashboards",
        "Actionable recommendations for managers",
        "Secure data handling (GDPR)",
      ],
      button: "Book a demo",
      guaranteeShort: "Final scope and price are confirmed after the intro call.",
    },
    faq: {
      title: "Remove risks,",
      titleHighlight: " not just questions",
      desc: "Most common concerns we address with CEOs and HR directors.",
      contact: "Write to us →",
      items: [
        { q: "Will it annoy people?", a: "No. The system uses a 'Low-Friction' protocol. No long surveys, just 1–3 minutes once a month. We keep respondent burden low." },
        { q: "Does it require complex IT implementation?", a: "No. We're a cloud service. We connect to your systems (M365/Slack) without IT intervention. No project required." },
        { q: "Is it truly anonymous?", a: "Absolutely. We guarantee a 'safety layer'. No one from leadership sees individual responses. People know this and trust it." },
        { q: "Will it add work for managers?", a: "The opposite. Echo Pulse does the analytical work for them and gives them guidance. It doesn't increase manager workload." },
        { q: "What if the results aren't pretty?", a: "That's the point. You want to see reality so you can change it. Better to know now than deal with resignations." },
      ],
    },
    roleSelection: {
      title: "One tool.",
      titleHighlight: " Different answers.",
      subtitle: "Whether you're a CEO, HR, or team lead — Echo Pulse gives you exactly what you need. No noise.",
      investor: {
        title: "Company health overview",
        list: ["Early warning before problems", "Risks caught in time"],
        cta: "Check portfolio health",
      },
      ceo: {
        title: "See what no one tells you",
        list: ["Real-time visibility into every team", "Spot problems months before they escalate"],
        cta: "Book CEO demo",
      },
      hr: {
        title: "Data that leadership actually listens to",
        list: ["Numbers instead of gut feelings", "Less firefighting, more prevention"],
        cta: "Book HR demo",
      },
      teamLeader: {
        title: "Know what your team won't say out loud",
        list: ["Anonymous, honest feedback every month", "Catch burnout before it's too late"],
        cta: "Book team lead demo",
      },
    },
    trustCenter: {
      badge: "Trust Center",
      title: "Your data is safe",
      titleHighlight: " with us",
      subtitle: "We handle sensitive people data. That's why security isn't just a feature - it's the foundation of everything we do. Audit-ready from day one.",
      guarantees: [
        {
          icon: "server",
          title: "Data stays in the EU",
          desc: "All data is stored exclusively on servers within the European Union. No transfers outside EU/EEA.",
          detail: "Frankfurt (AWS eu-central-1), AES-256 encryption at rest and in transit",
        },
        {
          icon: "eye",
          title: "100% employee anonymity",
          desc: "Managers never see individual responses. Results are shown only in aggregate form from 5+ people.",
          detail: "Aggregation from 5+ respondents, k-anonymity — individuals cannot be re-identified",
        },
        {
          icon: "lock",
          title: "GDPR by design",
          desc: "Legitimate interest under Art. 6(1)(f) GDPR. No employee consent required - processing goes via the employer.",
          detail: "DPIA completed, DPO available, data subject rights fully covered",
        },
        {
          icon: "users",
          title: "Audit-ready compliance",
          desc: "Complete documentation: processing records, DPIA, data processing agreements, technical measures.",
          detail: "Full audit trail of all access, contractual SLA with guaranteed availability",
        },
      ],
      complianceBadges: [
        { label: "GDPR", sub: "Full compliance" },
        { label: "ISO 27001", sub: "Aligned processes" },
        { label: "EU hosting", sub: "Frankfurt, AWS" },
        { label: "Encryption", sub: "AES-256 / TLS 1.3" },
      ],
      expandLabel: "Show security details",
      collapseLabel: "Hide details",
      legalDocsTitle: "Legal documents",
      dpoLabel: "Data Protection Officer:",
      privacyFallbackTitle: "Privacy policy",
      termsFallbackTitle: "Terms and conditions",
      contentFallback: "Content coming soon.",
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
      seoKeywords: "employee engagement, HR analytics, burnout prevention, organizational psychology, retention strategies",
    },
    caseStudies: {
      loading: "Loading...",
      notFound: "Case study not found",
      backToList: "Back to Success Stories",
      resultsLabel: "Results",
      industryLabel: "Industry",
      challengeTitle: "The Challenge",
      solutionTitle: "The Solution",
    },
    leadPopup: {
      badge: "New Study 2026",
      title: "People leave even good companies. Why?",
      subtitle: "A practical guide to turnover prevention. Uncover the real reasons for performance drops that annual surveys miss.",
      ebookTitle: "People leave even good companies",
      emailPlaceholder: "name@company.com",
      inputLabel: "Your e-mail",
      cta: "Download free e-book",
      noSpam: "No spam. We respect your privacy.",
      marketingConsent: "I agree to receive occasional tips and product news. You can unsubscribe anytime.",
      socialProofPre: "Already used by",
      socialProofCount: "dozens of",
      socialProofPost: "companies",
      quote: "Data that changes how we view people management.",
      successTitle: "Download started!",
      successMessage: "If the download didn't start, click the button below.",
      downloadButton: "Download PDF",
      downloadNote: "Direct download • PDF • 4.3 MB",
      close: "Close",
    },
  },
  cz: {
    header: {
      bookDemo: "Domluvit demo",
    },
    problems: {
      badge: "Náklady na odchody",
      title: "Lidé neodcházejí",
      titleHighlight: " ze dne na den.",
      subtitle: "Rozhodnutí odejít zraje měsíce. Problém? Většinou to nevíte — dokud nedostanete výpověď.",
      items: [
        {
          title: "NECHTĚNÁ FLUKTUACE",
          value: "6–9× mzda",
          desc: "Nahradit jednoho zaměstnance stojí průměrně 6–9× jeho měsíční mzdu. U seniorních pozic i více. Nejde jen o náklady na nábor — je to ztráta know-how, rozpadlá dynamika týmu a měsíce, než se nový člověk dostane na plný výkon. U pozice s platem 60 tis. Kč/měsíc to znamená 360–540 tis. Kč na jednom odchodu. Zdroj: SHRM, Gallup.",
        },
        {
          title: "POKLES VÝKONU",
          value: "–21%",
          desc: "Aktivně neangažované týmy mají o 21 % nižší ziskovost a výrazně nižší produktivitu. Angažovaní zaměstnanci jsou až o 20 % produktivnější. Jenže problém nevidíte - a většina firem se to dozví až na exit interview, kdy je pozdě cokoliv měnit. Zdroj: Gallup, State of the Workplace.",
        },
        {
          title: "VLIV MANAŽERA",
          value: "70%",
          desc: "Až 70 % variability v engagementu zaměstnanců závisí na přímém nadřízeném. Váš vzkaz prochází přes něj. Když manažer nemá přehled o tom, co jeho lidi brzdí, quiet quitting a vyhoření se šíří potichu — a zbytečně přicházíte o lidi, které jste nemuseli ztratit. Zdroj: Gallup.",
        },
      ],
      ctaBox: {
        label: "Před → Po",
        title: "Dnes hádáte. Zítra budete vědět.",
        desc: "Bez Echo Pulse: reagujete na výpovědi. S Echo Pulse: vidíte rizika v dashboardu měsíce předem a víte, kam jít.",
      },
    },
    dashboard: {
      badge: "Pohled do praxe",
      title: "Jeden dashboard.",
      titleHighlight: "Žádné hádání.",
      subtitle: "Echo Pulse sbírá rozptýlené signály a ukazuje je na jednom místě. Jasně, v reálném čase, připravené k akci.",
      features: [
        { title: "Nálada podle týmů", desc: "Okamžitý přehled, jak se cítí jednotlivá oddělení. Rozděleno podle lokality, seniority nebo manažera." },
        { title: "Varování před problémy", desc: "Systém upozorní, když něco nesedí - přetížení, napětí v týmu, nebo výrazný pokles energie." },
        { title: "Priority pro akci", desc: "Nevíte, co řešit první? Echo seřadí problémy podle dopadu na byznys a rizika odchodu." },
      ],
    },
    purchase: {
      badge: "Ceník",
      title: "Ceník podle",
      titleHighlight: " velikosti firmy",
      subtitle: "Od 99 Kč / zaměstnanec / měsíc při ročním tarifu. Orientační odhad se odvíjí od počtu zaměstnanců.",
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
        "Bezpečné zpracování dat (GDPR)",
      ],
      button: "Domluvit demo",
      guaranteeShort: "Finální rozsah a cena se potvrdí po úvodní konzultaci.",
    },
    faq: {
      title: "Odstraňte rizika,",
      titleHighlight: " ne jen otázky",
      desc: "Nejčastější obavy, které řešíme s CEO a HR řediteli.",
      contact: "Napište nám →",
      items: [
        { q: "Bude to lidi otravovat?", a: "Ne. Systém používá 'Low-Friction' protokol. Žádné dlouhé dotazníky, jen 1–3 minuty jednou za měsíc. Udržíme zátěž respondentů nízko." },
        { q: "Vyžaduje to složitou IT implementaci?", a: "Ne. Jsme cloudová služba. Napojíme se na vaše systémy (M365/Slack) bez zásahu IT. Nevyžaduje to projekt." },
        { q: "Je to skutečně anonymní?", a: "Absolutně. Garantujeme 'vrstvu bezpečí'. Nikdo z vedení neuvidí individuální odpovědi. Lidé to ví a věří tomu." },
        { q: "Přidělá to práci manažerům?", a: "Naopak. Echo Pulse za ně dělá analytickou práci a dává jim návod. Nezvyšuje to práci manažerům." },
        { q: "Co když nebudou výsledky hezké?", a: "To je cíl. Chcete vidět realitu, abyste ji mohli změnit. Lepší vědět teď, než řešit výpovědi." },
      ],
    },
    roleSelection: {
      title: "Jeden nástroj.",
      titleHighlight: " Různé odpovědi.",
      subtitle: "Ať jste CEO, HR nebo team lead — Echo Pulse vám dá přesně to, co potřebujete. Bez šumu.",
      investor: {
        title: "Přehled o zdraví firmy",
        list: ["Včasné varování před problémy", "Rizika zachycená včas"],
        cta: "Zkontrolovat zdraví portfolia",
      },
      ceo: {
        title: "Zjistěte, co vám nikdo neřekne",
        list: ["Přehled o každém týmu v reálném čase", "Problémy zachytíte měsíce předem"],
        cta: "Demo pro CEO",
      },
      hr: {
        title: "Data, kterým vedení uvěří",
        list: ["Čísla místo pocitů", "Méně hašení, víc prevence"],
        cta: "Demo pro HR",
      },
      teamLeader: {
        title: "Zjistěte, co vám tým neřekne nahlas",
        list: ["Anonymní, upřímný feedback každý měsíc", "Zachyťte vyhoření dřív, než bude pozdě"],
        cta: "Demo pro team leadery",
      },
    },
    trustCenter: {
      badge: "Trust Center",
      title: "Vaše data jsou",
      titleHighlight: " u nás v bezpečí",
      subtitle: "Pracujeme s citlivými daty o lidech. Proto bezpečnost není jen funkce - je to základ všeho, co děláme. Připraveni na GDPR audit.",
      guarantees: [
        {
          icon: "server",
          title: "Data zůstávají v EU",
          desc: "Veškerá data jsou uložena výhradně na serverech v Evropské unii. Žádný transfer mimo EU/EEA.",
          detail: "Frankfurt (AWS eu-central-1), šifrování AES-256 at rest i in transit",
        },
        {
          icon: "eye",
          title: "100% anonymita zaměstnanců",
          desc: "Manažeři nikdy nevidí individuální odpovědi. Výsledky se zobrazují pouze v agregované podobě od 5 lidí výše.",
          detail: "Agregace od 5+ respondentů, k-anonymita — nelze zpětně identifikovat jednotlivce",
        },
        {
          icon: "lock",
          title: "GDPR by design",
          desc: "Oprávněný zájem dle čl. 6(1)(f) GDPR. Žádný souhlas zaměstnanců není potřeba - zpracování jde přes zaměstnavatele.",
          detail: "DPIA zpracována, DPO k dispozici, práva subjektů plně zajištěna",
        },
        {
          icon: "users",
          title: "Připraveni na kontrolu ÚOOÚ",
          desc: "Máme kompletní dokumentaci: záznamy o zpracování, DPIA, smlouvy o zpracování, technická opatření.",
          detail: "Auditní trail všech přístupů, smluvní SLA s garantovanou dostupností",
        },
      ],
      complianceBadges: [
        { label: "GDPR", sub: "Plný soulad" },
        { label: "ISO 27001", sub: "Procesy dle standardu" },
        { label: "EU hosting", sub: "Frankfurt, AWS" },
        { label: "Šifrování", sub: "AES-256 / TLS 1.3" },
      ],
      expandLabel: "Zobrazit detaily zabezpečení",
      collapseLabel: "Skrýt detaily",
      legalDocsTitle: "Právní dokumenty",
      dpoLabel: "Pověřenec pro ochranu osobních údajů:",
      privacyFallbackTitle: "Zásady ochrany osobních údajů",
      termsFallbackTitle: "Obchodní a produktové podmínky",
      contentFallback: "Obsah připravujeme.",
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
      seoKeywords: "engagement, HR analytika, prevence vyhoření, organizační psychologie, retence",
    },
    caseStudies: {
      loading: "Načítání...",
      notFound: "Případová studie nebyla nalezena",
      backToList: "Zpět na případové studie",
      resultsLabel: "Výsledky",
      industryLabel: "Odvětví",
      challengeTitle: "Výzva",
      solutionTitle: "Řešení",
    },
    leadPopup: {
      badge: "Nová studie 2026",
      title: "Lidé odcházejí i z dobrých firem. Proč?",
      subtitle: "Praktický průvodce prevencí fluktuace. Odhalte skutečné důvody poklesu výkonu, které v ročních průzkumech nenajdete.",
      ebookTitle: "Lidé odcházejí i z dobrých firem",
      emailPlaceholder: "name@company.com",
      inputLabel: "Váš e-mail",
      cta: "Stáhnout e-book zdarma",
      noSpam: "Žádný spam. Respektujeme vaše soukromí.",
      marketingConsent: "Souhlasím se zasíláním občasných tipů a novinek. Odhlásit se můžete kdykoliv.",
      socialProofPre: "Již využívají",
      socialProofCount: "desítky",
      socialProofPost: "českých firem",
      quote: "Data, která mění pohled na řízení lidí v Česku.",
      successTitle: "Stahování začalo!",
      successMessage: "Pokud se stahování nespustilo, klikněte na tlačítko níže.",
      downloadButton: "Stáhnout PDF",
      downloadNote: "Přímé stažení • PDF • 4.3 MB",
      close: "Zavřít",
    },
  },
  de: {
    header: {
      bookDemo: "Demo buchen",
    },
    problems: {
      badge: "Fluktuationskosten",
      title: "Menschen kündigen nicht",
      titleHighlight: " von heute auf morgen.",
      subtitle: "Die Entscheidung zu gehen reift monatelang. Das Problem ist, dass Sie es meist nicht wissen - bis Sie die Kündigung bekommen.",
      items: [
        {
          title: "UNGEWOLLTE FLUKTUATION",
          value: "6–9× Monatsgehalt",
          desc: "Der Ersatz einer Person kostet durchschnittlich 6–9× das Monatsgehalt. Bei Senior-Positionen auch mehr. Das sind nicht nur Recruitingkosten — es ist verlorenes Know-how, zerstörte Teamdynamik und Monate, bis die neue Person volle Leistung erreicht. Bei einem Gehalt von €3.000/Monat sind das €18–27k pro Abgang. [Quelle: SHRM, Gallup]",
        },
        {
          title: "LEISTUNGSVERLUST",
          value: "–21%",
          desc: "Aktiv unengagierte Teams zeigen 21 % geringere Profitabilität und deutlich niedrigere Produktivität. Engagierte Mitarbeiter sind bis zu 20 % produktiver. Aber Sie sehen das Problem nicht — und die meisten Unternehmen erfahren es erst im Exit-Interview, wenn es zu spät ist, etwas zu ändern. [Quelle: Gallup State of the Workplace]",
        },
        {
          title: "MANAGER-EINFLUSS",
          value: "70%",
          desc: "Bis zu 70 % der Varianz im Employee Engagement hängen vom direkten Vorgesetzten ab. Ihre Botschaft wird durch ihn gefiltert. Wenn eine Führungskraft keinen Einblick hat, breiten sich Quiet Quitting und Burnout still aus — und Sie verlieren Menschen, die Sie nicht hätten verlieren müssen. [Quelle: Gallup]",
        },
      ],
      ctaBox: {
        label: "Vorher → Nachher",
        title: "Heute raten Sie. Morgen werden Sie wissen.",
        desc: "Ohne Echo Pulse: Sie reagieren auf Kündigungen. Mit Echo Pulse: Sie sehen Risiken im Dashboard Monate vorher und wissen, wo Sie handeln müssen.",
      },
    },
    dashboard: {
      badge: "Überblick für die Führung",
      title: "Sehen Sie, was früher nur",
      titleHighlight: "beim Kaffee gesagt wurde.",
      subtitle: "Echo Pulse sammelt verstreute Signale und zeigt sie an einem Ort. Klar und ohne unnötige Grafiken.",
      features: [
        { title: "Stimmung nach Team", desc: "Sofortiger Überblick, wie sich jede Abteilung fühlt. Aufgeschlüsselt nach Standort, Seniorität oder Manager." },
        { title: "Warnung vor Problemen", desc: "Das System warnt, wenn etwas nicht stimmt - Überlastung, Team-Spannungen oder deutlicher Energie-Abfall." },
        { title: "Handlungs-Prioritäten", desc: "Wissen nicht, was zuerst lösen? Echo ordnet Probleme nach Business-Impact und Abgangsrisiko." },
      ],
    },
    purchase: {
      badge: "Preise",
      title: "Preis nach",
      titleHighlight: " Unternehmensgröße",
      subtitle: "Ab €4 / Mitarbeitende / Monat im Jahrestarif. Die Schätzung richtet sich nach der Mitarbeiterzahl.",
      configTitle: "Plan konfigurieren",
      billingMonthly: "Monatlich",
      billingYearly: "Jährlich (-20%)",
      companySizeLabel: "Unternehmensgröße",
      employeesLabel: "Mitarbeitende",
      estimatedLabel: "Geschätzte Investition",
      perMonthLabel: "/ Monat",
      priceCapped: "Preis gedeckelt bei {cap} Mitarbeitenden",
      basePriceLabel: "Grundpreis",
      vatLabel: "MwSt. (21%)",
      features: [
        "Laufende Puls-Erhebungen und Signalanalyse",
        "Dashboard für Führung und HR",
        "Konkrete Handlungsempfehlungen",
        "Sichere Datenverarbeitung (DSGVO)",
      ],
      button: "Demo buchen",
      guaranteeShort: "Finaler Umfang und Preis nach dem Erstgespräch.",
    },
    faq: {
      title: "Risiken beseitigen,",
      titleHighlight: " nicht nur Fragen",
      desc: "Die häufigsten Bedenken, die wir mit CEOs und HR-Leitern besprechen.",
      contact: "Schreiben Sie uns →",
      items: [
        { q: "Wird es die Leute nerven?", a: "Nein. Das System nutzt ein 'Low-Friction'-Protokoll. Keine langen Umfragen, nur 1–3 Minuten einmal im Monat. Wir halten die Belastung niedrig." },
        { q: "Erfordert es komplexe IT-Implementierung?", a: "Nein. Wir sind ein Cloud-Service. Wir verbinden uns mit Ihren Systemen (M365/Slack) ohne IT-Eingriff. Kein Projekt erforderlich." },
        { q: "Ist es wirklich anonym?", a: "Absolut. Wir garantieren eine 'Sicherheitsschicht'. Niemand aus der Führung sieht einzelne Antworten. Menschen wissen das und vertrauen darauf." },
        { q: "Bedeutet es mehr Arbeit für Manager?", a: "Im Gegenteil. Echo Pulse übernimmt die analytische Arbeit und gibt Anleitungen. Es erhöht nicht die Manager-Arbeitslast." },
        { q: "Was wenn die Ergebnisse nicht schön sind?", a: "Das ist der Punkt. Sie wollen Realität sehen, um sie ändern zu können. Besser jetzt wissen als Kündigungen lösen." },
      ],
    },
    roleSelection: {
      title: "Jeder sieht das Unternehmen",
      titleHighlight: " aus einem anderen Blickwinkel.",
      subtitle: "Wählen Sie Ihre Rolle und sehen Sie, was Echo Pulse Ihnen konkret bietet.",
      investor: {
        title: "Überblick über Unternehmensgesundheit",
        list: ["Frühwarnung vor Problemen", "Risiken rechtzeitig erkannt"],
        cta: "Portfolio-Gesundheit prüfen",
      },
      ceo: {
        title: "Ungefilterter Überblick",
        list: ["Sie sehen, was in den Teams passiert", "Sie lösen Probleme, bevor sie eskalieren"],
        cta: "Wie es der Führung hilft",
      },
      hr: {
        title: "Daten statt Vermutungen",
        list: ["Argumente, die die Führung versteht", "Weniger Feuerlöschen, mehr Prävention"],
        cta: "Wie es HR hilft",
      },
      teamLeader: {
        title: "Feedback vom Team",
        list: ["Sie wissen, was Menschen belastet", "Sie erkennen Burnout früh"],
        cta: "Wie es Managern hilft",
      },
    },
    trustCenter: {
      badge: "Trust Center",
      title: "Ihre Daten sind",
      titleHighlight: " bei uns sicher",
      subtitle: "Wir arbeiten mit sensiblen Personaldaten. Deshalb ist Sicherheit keine Funktion - sie ist das Fundament unserer Arbeit. Audit-bereit ab Tag eins.",
      guarantees: [
        {
          icon: "server",
          title: "Daten bleiben in der EU",
          desc: "Alle Daten werden ausschließlich auf Servern in der Europäischen Union gespeichert. Kein Transfer außerhalb der EU/des EWR.",
          detail: "Frankfurt (AWS eu-central-1), AES-256-Verschlüsselung at rest und in transit",
        },
        {
          icon: "eye",
          title: "100% Mitarbeiter-Anonymität",
          desc: "Manager sehen niemals individuelle Antworten. Ergebnisse werden nur in aggregierter Form ab 5+ Personen angezeigt.",
          detail: "Aggregation ab 5+ Teilnehmern, k-Anonymität — Einzelpersonen können nicht re-identifiziert werden",
        },
        {
          icon: "lock",
          title: "DSGVO by Design",
          desc: "Berechtigtes Interesse gem. Art. 6(1)(f) DSGVO. Keine Mitarbeiter-Einwilligung erforderlich - Verarbeitung erfolgt über den Arbeitgeber.",
          detail: "DSFA durchgeführt, DSB verfügbar, Betroffenenrechte vollständig gewährleistet",
        },
        {
          icon: "users",
          title: "Audit-bereite Compliance",
          desc: "Vollständige Dokumentation: Verarbeitungsverzeichnis, DSFA, Auftragsverarbeitungsverträge, technische Maßnahmen.",
          detail: "Vollständiger Audit-Trail aller Zugriffe, vertragliche SLA mit garantierter Verfügbarkeit",
        },
      ],
      complianceBadges: [
        { label: "DSGVO", sub: "Volle Konformität" },
        { label: "ISO 27001", sub: "Angelehnte Prozesse" },
        { label: "EU-Hosting", sub: "Frankfurt, AWS" },
        { label: "Verschlüsselung", sub: "AES-256 / TLS 1.3" },
      ],
      expandLabel: "Sicherheitsdetails anzeigen",
      collapseLabel: "Details ausblenden",
      legalDocsTitle: "Rechtliche Dokumente",
      dpoLabel: "Datenschutzbeauftragter:",
      privacyFallbackTitle: "Datenschutzerklärung",
      termsFallbackTitle: "Allgemeine Geschäftsbedingungen",
      contentFallback: "Inhalt folgt in Kürze.",
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
      seoKeywords: "employee engagement, HR analytics, burnout prevention, organizational psychology, retention strategies",
    },
    caseStudies: {
      loading: "Wird geladen...",
      notFound: "Fallstudie nicht gefunden",
      backToList: "Zurück zu Erfolgsgeschichten",
      resultsLabel: "Ergebnisse",
      industryLabel: "Branche",
      challengeTitle: "Herausforderung",
      solutionTitle: "Lösung",
    },
    leadPopup: {
      badge: "Neue Studie 2026",
      title: "Menschen verlassen auch gute Firmen. Warum?",
      subtitle: "Ein praktischer Leitfaden zur Fluktuationsprävention. Entdecken Sie die wahren Gründe für Leistungsabfall, die Jahresumfragen übersehen.",
      ebookTitle: "Menschen verlassen auch gute Firmen",
      emailPlaceholder: "name@company.com",
      inputLabel: "Ihre E-Mail",
      cta: "Kostenloses E-Book herunterladen",
      noSpam: "Kein Spam. Wir respektieren Ihre Privatsphäre.",
      marketingConsent: "Ich stimme dem gelegentlichen Erhalt von Tipps und Produktneuigkeiten zu. Abmeldung jederzeit möglich.",
      socialProofPre: "Bereits von",
      socialProofCount: "dutzenden",
      socialProofPost: "Unternehmen genutzt",
      quote: "Daten, die den Blick auf Personalmanagement verändern.",
      successTitle: "Download gestartet!",
      successMessage: "Falls der Download nicht gestartet ist, klicken Sie auf die Schaltfläche unten.",
      downloadButton: "PDF herunterladen",
      downloadNote: "Direkter Download • PDF • 4.3 MB",
      close: "Schließen",
    },
  },
};
