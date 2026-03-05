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
    enterpriseBullets: string[];
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
    tocTitle: string;
    tocEmpty: string;
    progressLabel: string;
    relatedLabel: string;
    midLeadLabel: string;
    midLeadTitle: string;
    midLeadDesc: string;
    midLeadCta: string;
    railLeadLabel: string;
    railLeadTitle: string;
    railLeadDesc: string;
    railLeadCta: string;
    endDemoLabel: string;
    endDemoTitle: string;
    endDemoDesc: string;
    endDemoCta: string;
  };
  caseStudies: {
    loading: string;
    notFound: string;
    backToList: string;
    resultsLabel: string;
    industryLabel: string;
    challengeTitle: string;
    solutionTitle: string;
    tocTitle: string;
    tocEmpty: string;
    progressLabel: string;
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
        desc: "Without Behavera: you react to resignations. With Behavera: you see risks in your dashboard months ahead and know where to act.",
      },
    },
    dashboard: {
      badge: "See it in action",
      title: "One dashboard.",
      titleHighlight: "Zero guesswork.",
      subtitle: "Behavera collects scattered signals and shows them in one place. Clear, real-time, and ready to act on.",
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
      button: "Start now",
      guaranteeShort: "30-day money-back guarantee.",
    },
    faq: {
      title: "Common questions,",
      titleHighlight: " honest answers",
      desc: "The concerns CEOs and HR directors raise most often before getting started.",
      contact: "Write to us →",
      items: [
        { q: "Will it annoy people?", a: "No. Each pulse takes 1–3 minutes and goes out once a month. It's not an 80-question annual survey — employees answer 5–6 short questions directly in the tools they already use (Slack, WhatsApp (coming soon), email). That's why we consistently see participation rates above 80 % without any pressure." },
        { q: "Does it require complex IT implementation?", a: "No. Behavera is a cloud service that connects to Slack or WhatsApp (coming soon) with no involvement from your IT department. There's nothing to install on your servers, no integration project, and no changes to existing infrastructure. Full implementation takes under one hour — competitors need weeks." },
        { q: "Is it truly anonymous?", a: "Yes — and it's enforced technically, not just contractually. Managers never see individual responses. Results are only displayed in aggregate from 5+ respondents. For smaller teams, data is automatically rolled up to the next organisational level. Employees know this, which is exactly why they answer honestly." },
        { q: "Will it add work for managers?", a: "Quite the opposite — it saves them time. Behavera analyses the responses and prepares concrete recommendations: what to address, with whom, and how. Managers don't need to interpret data; they get a clear action plan. The weekly overview takes about 2 minutes." },
        { q: "What if the results aren't pretty?", a: "That's exactly the point — to surface reality before it shows up in resignations or performance drops. A bad score isn't a failure, it's an early signal. Every finding comes with actionable guidance so you know not just what's wrong, but what to do about it." },
        { q: "Is this just another HR tool I'll never open?", a: "Behavera is built for company leadership, not just HR. The CEO dashboard shows key metrics: team risk, engagement trend, and action priority. It takes 2 minutes a week. This isn't a reporting system — it's a decision-making tool. And if it doesn't deliver value, you're covered by our 30-day money-back guarantee." },
        { q: "How do you guarantee anonymity in a team of 8 people?", a: "Results are only displayed once a group reaches 5 respondents. If a group falls below that threshold, data is automatically aggregated into the next organisational level. Managers never see individual answers — this rule is enforced at the database level, not just the UI. That means anonymity is guaranteed even in small teams." },
      ],
    },
    roleSelection: {
      title: "One tool.",
      titleHighlight: " Different answers.",
      subtitle: "Whether you're a CEO, HR, or team lead — Behavera gives you exactly what you need. No noise.",
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
      enterpriseBullets: [
        "DPIA completed & DPO available",
        "Role-based access — managers see only their teams",
        "Aggregated reporting only (5+ person threshold)",
        "DPA available on request",
      ],
      legalDocsTitle: "Legal documents",
      dpoLabel: "Data Protection Officer:",
      privacyFallbackTitle: "Privacy policy",
      termsFallbackTitle: "Terms and conditions",
      contentFallback: "Content coming soon.",
    },
    blog: {
      title: "Blog",
      pageTitle: "Blog",
      pageSubtitle: "Articles on people management, leadership, and what actually works in teams.",
      defaultTag: "Article",
      backToList: "Back to articles",
      loading: "Loading...",
      notFound: "Post not found",
      seoTitle: "Blog",
      seoDescription: "Practical articles on engagement, retention, and organizational psychology.",
      seoKeywords: "employee engagement, HR analytics, burnout prevention, organizational psychology, retention strategies",
      tocTitle: "In this article",
      tocEmpty: "No sections available",
      progressLabel: "Reading progress",
      relatedLabel: "Related articles",
      midLeadLabel: "Free resources",
      midLeadTitle: "Get 2 practical e-books on retention and engagement",
      midLeadDesc: "Actionable playbooks and data-backed insights you can use with your team immediately.",
      midLeadCta: "Get free e-books",
      railLeadLabel: "Quick download",
      railLeadTitle: "Keep the best people before they disengage",
      railLeadDesc: "Short, practical materials for leaders and HR teams.",
      railLeadCta: "Download",
      endDemoLabel: "See it in your team",
      endDemoTitle: "Want to turn these insights into action?",
      endDemoDesc: "See how Behavera helps you detect risks early and guide better 1:1 conversations.",
      endDemoCta: "Book a demo",
    },
    caseStudies: {
      loading: "Loading...",
      notFound: "Case study not found",
      backToList: "Back to Success Stories",
      resultsLabel: "Results",
      industryLabel: "Industry",
      challengeTitle: "The Challenge",
      solutionTitle: "The Solution",
      tocTitle: "In this case study",
      tocEmpty: "No sections available",
      progressLabel: "Reading progress",
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
        desc: "Bez Behavera: reagujete na výpovědi. S Behavera: vidíte rizika v dashboardu měsíce předem a víte, kam jít.",
      },
    },
    dashboard: {
      badge: "Pohled do praxe",
      title: "Jeden dashboard.",
      titleHighlight: "Žádné hádání.",
      subtitle: "Behavera sbírá rozptýlené signály a ukazuje je na jednom místě. Jasně, v reálném čase, připravené k akci.",
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
      button: "Začít teď",
      guaranteeShort: "30denní garance vrácení peněz.",
    },
    faq: {
      title: "Časté otázky,",
      titleHighlight: " upřímné odpovědi",
      desc: "Nejčastější obavy, které řešíme s CEO a HR řediteli ještě před spuštěním.",
      contact: "Napište nám →",
      items: [
        { q: "Bude to lidi otravovat?", a: "Ne. Pulse trvá 1–3 minuty a chodí jednou za měsíc. Není to klasický 80otázkový dotazník — zaměstnanci odpovídají na 5–6 krátkých otázek přímo v prostředí, které už používají (Slack, WhatsApp - připravujeme, e-mail). Díky tomu dosahujeme účasti přes 80 % bez jakéhokoli tlaku." },
        { q: "Vyžaduje to složitou IT implementaci?", a: "Ne. Behavera je cloudová služba, která se napojí na Slack nebo WhatsApp - připravujeme bez zásahu vašeho IT oddělení. Není potřeba instalovat nic na server, řešit integrační projekt ani měnit stávající infrastrukturu. Celá implementace zabere do jedné hodiny — konkurenti potřebují týdny." },
        { q: "Je to skutečně anonymní?", a: "Ano, a je to vynuceno technicky, ne jen smluvně. Manažeři nikdy nevidí individuální odpovědi — výsledky se zobrazují pouze agregovaně od 5 respondentů výš. U menších týmů se data automaticky sloučí do vyšší úrovně. Zaměstnanci to vědí a právě proto odpovídají upřímně." },
        { q: "Přidělá to práci manažerům?", a: "Naopak, ušetří jim čas. Behavera analyzuje odpovědi za ně a připraví konkrétní doporučení — co řešit, s kým a jak. Manažer nemusí data interpretovat, dostane jasný návod. Celý týdenní přehled zabere 2 minuty." },
        { q: "Co když nebudou výsledky hezké?", a: "Přesně to je smysl nástroje — ukázat realitu dřív, než se projeví ve výpovědích nebo výkonových propadech. Špatný výsledek není problém, je to včasný signál. Ke každému zjištění dostanete doporučení, jak situaci řešit, takže víte nejen co, ale i jak." },
        { q: "Není to jen další HR nástroj, který nikdo neotevře?", a: "Behavera je navržena pro vedení firmy, ne jen pro HR. CEO dashboard zobrazuje klíčové metriky: riziko týmu, trend angažovanosti a prioritu akce. Zabere 2 minuty týdně. Není to reportovací systém, ale rozhodovací nástroj. A pokud vám nepřinese hodnotu, máte 30denní garanci vrácení peněz." },
        { q: "Jak zaručíte anonymitu v týmu o 8 lidech?", a: "Výsledky se zobrazují až od 5 respondentů. Pokud skupina nedosáhne tohoto prahu, data se automaticky agregují do vyšší organizační úrovně. Manažer nikdy nevidí jednotlivé odpovědi — toto pravidlo je vynuceno na úrovni databáze, ne jen v uživatelském rozhraní. Díky tomu je anonymita zaručena i v malých týmech." },
      ],
    },
    roleSelection: {
      title: "Jeden nástroj.",
      titleHighlight: " Různé odpovědi.",
      subtitle: "Ať jste CEO, HR nebo team lead — Behavera vám dá přesně to, co potřebujete. Bez šumu.",
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
      enterpriseBullets: [
        "DPIA zpracována a DPO k dispozici",
        "Přístup dle rolí — manažeři vidí jen své týmy",
        "Pouze agregované reporty (práh 5+ lidí)",
        "Smlouva o zpracování (DPA) na vyžádání",
      ],
      legalDocsTitle: "Právní dokumenty",
      dpoLabel: "Pověřenec pro ochranu osobních údajů:",
      privacyFallbackTitle: "Zásady ochrany osobních údajů",
      termsFallbackTitle: "Obchodní a produktové podmínky",
      contentFallback: "Obsah připravujeme.",
    },
    blog: {
      title: "Blog",
      pageTitle: "Blog",
      pageSubtitle: "Články o řízení lidí, leadershipu a tom, co ve firmách skutečně funguje.",
      defaultTag: "Článek",
      backToList: "Zpět na články",
      loading: "Načítání...",
      notFound: "Článek nebyl nalezen",
      seoTitle: "Blog",
      seoDescription: "Praktické články o engagementu, retenci a organizační psychologii.",
      seoKeywords: "engagement, HR analytika, prevence vyhoření, organizační psychologie, retence",
      tocTitle: "Obsah článku",
      tocEmpty: "Sekce nejsou dostupné",
      progressLabel: "Průběh čtení",
      relatedLabel: "Další články k tématu",
      midLeadLabel: "Praktické materiály",
      midLeadTitle: "Stáhněte si 2 e-booky o retenci a angažovanosti",
      midLeadDesc: "Konkrétní postupy a data, které můžete využít ve firmě hned.",
      midLeadCta: "Stáhnout e-booky zdarma",
      railLeadLabel: "Rychlé stažení",
      railLeadTitle: "Udržte klíčové lidi dřív, než se odpojí",
      railLeadDesc: "Stručné a praktické materiály pro leadery a HR.",
      railLeadCta: "Stáhnout",
      endDemoLabel: "Převeďte to do praxe",
      endDemoTitle: "Chcete tyto poznatky použít ve vašem týmu?",
      endDemoDesc: "Podívejte se, jak Behavera odhalí rizika včas a zlepší vaše 1:1 rozhovory.",
      endDemoCta: "Domluvit demo",
    },
    caseStudies: {
      loading: "Načítání...",
      notFound: "Případová studie nebyla nalezena",
      backToList: "Zpět na případové studie",
      resultsLabel: "Výsledky",
      industryLabel: "Odvětví",
      challengeTitle: "Výzva",
      solutionTitle: "Řešení",
      tocTitle: "Obsah případové studie",
      tocEmpty: "Sekce nejsou dostupné",
      progressLabel: "Průběh čtení",
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
        desc: "Ohne Behavera: Sie reagieren auf Kündigungen. Mit Behavera: Sie sehen Risiken im Dashboard Monate vorher und wissen, wo Sie handeln müssen.",
      },
    },
    dashboard: {
      badge: "Überblick für die Führung",
      title: "Ein Dashboard.",
      titleHighlight: "Kein Raten.",
      subtitle: "Behavera sammelt verstreute Signale und zeigt sie an einem Ort. Klar, in Echtzeit, bereit zum Handeln.",
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
      button: "Jetzt starten",
      guaranteeShort: "30 Tage Geld-zurück-Garantie.",
    },
    faq: {
      title: "Häufige Fragen,",
      titleHighlight: " ehrliche Antworten",
      desc: "Die Bedenken, die CEOs und HR-Leiter am häufigsten vor dem Start äußern.",
      contact: "Schreiben Sie uns →",
      items: [
        { q: "Wird es die Leute nerven?", a: "Nein. Jede Pulse-Umfrage dauert 1–3 Minuten und wird einmal im Monat verschickt. Es ist keine klassische 80-Fragen-Jahresumfrage — Mitarbeitende beantworten 5–6 kurze Fragen direkt in den Tools, die sie bereits nutzen (Slack, WhatsApp (in Vorbereitung), E-Mail). Deshalb erreichen wir konstant Teilnahmequoten über 80 %, ganz ohne Druck." },
        { q: "Erfordert es komplexe IT-Implementierung?", a: "Nein. Behavera ist ein Cloud-Service, der sich ohne Beteiligung Ihrer IT-Abteilung mit Slack oder WhatsApp (in Vorbereitung) verbindet. Es muss nichts auf Ihren Servern installiert werden, kein Integrationsprojekt und keine Änderungen an der bestehenden Infrastruktur. Die gesamte Implementierung dauert unter einer Stunde — Wettbewerber brauchen Wochen." },
        { q: "Ist es wirklich anonym?", a: "Ja — und das wird technisch erzwungen, nicht nur vertraglich. Manager sehen nie einzelne Antworten. Ergebnisse werden erst ab 5 Befragten aggregiert angezeigt. Bei kleineren Teams werden Daten automatisch auf die nächste Organisationsebene hochgerechnet. Mitarbeitende wissen das — und genau deshalb antworten sie ehrlich." },
        { q: "Bedeutet es mehr Arbeit für Manager?", a: "Im Gegenteil — es spart ihnen Zeit. Behavera analysiert die Antworten und erstellt konkrete Empfehlungen: was angegangen werden sollte, mit wem und wie. Manager müssen keine Daten interpretieren, sie bekommen einen klaren Handlungsplan. Der wöchentliche Überblick dauert etwa 2 Minuten." },
        { q: "Was wenn die Ergebnisse nicht schön sind?", a: "Genau das ist der Sinn — Realität aufzeigen, bevor sie sich in Kündigungen oder Leistungseinbrüchen zeigt. Ein schlechtes Ergebnis ist kein Versagen, sondern ein frühzeitiges Signal. Zu jeder Erkenntnis gibt es konkrete Handlungsempfehlungen, damit Sie nicht nur wissen, was los ist, sondern auch, was zu tun ist." },
        { q: "Ist das nur ein weiteres HR-Tool, das niemand öffnet?", a: "Behavera ist für die Unternehmensführung gebaut, nicht nur für HR. Das CEO-Dashboard zeigt Schlüsselkennzahlen: Teamrisiko, Engagement-Trend und Handlungspriorität. Das dauert 2 Minuten pro Woche. Es ist kein Reporting-System, sondern ein Entscheidungswerkzeug. Und wenn es keinen Mehrwert bringt, greift unsere 30-Tage-Geld-zurück-Garantie." },
        { q: "Wie garantieren Sie Anonymität in einem Team mit 8 Personen?", a: "Ergebnisse werden erst angezeigt, wenn eine Gruppe 5 Befragte erreicht. Liegt eine Gruppe unter diesem Schwellenwert, werden die Daten automatisch auf die nächste Organisationsebene aggregiert. Manager sehen nie einzelne Antworten — diese Regel wird auf Datenbankebene durchgesetzt, nicht nur in der Oberfläche. Damit ist Anonymität auch in kleinen Teams garantiert." },
      ],
    },
    roleSelection: {
      title: "Jeder sieht das Unternehmen",
      titleHighlight: " aus einem anderen Blickwinkel.",
      subtitle: "Wählen Sie Ihre Rolle und sehen Sie, was Behavera Ihnen konkret bietet.",
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
      enterpriseBullets: [
        "DSFA durchgeführt & DSB verfügbar",
        "Rollenbasierter Zugriff — Manager sehen nur ihre Teams",
        "Nur aggregierte Berichte (Schwelle ab 5 Personen)",
        "AVV/DPA auf Anfrage",
      ],
      legalDocsTitle: "Rechtliche Dokumente",
      dpoLabel: "Datenschutzbeauftragter:",
      privacyFallbackTitle: "Datenschutzerklärung",
      termsFallbackTitle: "Allgemeine Geschäftsbedingungen",
      contentFallback: "Inhalt folgt in Kürze.",
    },
    blog: {
      title: "Blog",
      pageTitle: "Blog",
      pageSubtitle: "Artikel zu Personalführung, Leadership und dem, was in Teams wirklich funktioniert.",
      defaultTag: "Artikel",
      backToList: "Zurück zu Artikeln",
      loading: "Wird geladen...",
      notFound: "Beitrag nicht gefunden",
      seoTitle: "Blog",
      seoDescription: "Praktische Artikel zu Engagement, Retention und Organisationspsychologie.",
      seoKeywords: "Mitarbeiterengagement, HR-Analytik, Burnout-Prävention, Organisationspsychologie, Retentionsstrategien",
      tocTitle: "Inhaltsverzeichnis",
      tocEmpty: "Keine Abschnitte verfügbar",
      progressLabel: "Lesefortschritt",
      relatedLabel: "Ähnliche Artikel",
      midLeadLabel: "Kostenlose Ressourcen",
      midLeadTitle: "2 praktische E-Books zu Retention und Engagement",
      midLeadDesc: "Konkrete Vorgehensweisen und datenbasierte Insights für Ihr Team.",
      midLeadCta: "E-Books kostenlos",
      railLeadLabel: "Schnelldownload",
      railLeadTitle: "Schlüsselkräfte halten, bevor sie abspringen",
      railLeadDesc: "Kurze, praktische Materialien für Führung und HR.",
      railLeadCta: "Herunterladen",
      endDemoLabel: "In Ihrem Team testen",
      endDemoTitle: "Möchten Sie diese Erkenntnisse direkt nutzen?",
      endDemoDesc: "Sehen Sie, wie Behavera Risiken früh erkennt und bessere 1:1 Gespräche unterstützt.",
      endDemoCta: "Demo buchen",
    },
    caseStudies: {
      loading: "Wird geladen...",
      notFound: "Fallstudie nicht gefunden",
      backToList: "Zurück zu Erfolgsgeschichten",
      resultsLabel: "Ergebnisse",
      industryLabel: "Branche",
      challengeTitle: "Herausforderung",
      solutionTitle: "Lösung",
      tocTitle: "Inhalt der Fallstudie",
      tocEmpty: "Keine Abschnitte verfügbar",
      progressLabel: "Lesefortschritt",
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
