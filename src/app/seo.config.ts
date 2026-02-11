/**
 * SEO Configuration for Echo Pulse
 * Optimized for: Google, Seznam.cz, and AI search engines (ChatGPT, Perplexity, Gemini)
 * 
 * Key principles for AI discoverability:
 * 1. Clear, factual statements with sources
 * 2. Question-answer format (FAQ schema)
 * 3. Structured data (JSON-LD)
 * 4. E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalPath?: string;
}

// Target personas and their search queries
export const targetPersonas = {
  hrDirector: {
    role: 'HR Director / CHRO',
    painPoints: ['high turnover costs', 'no early warning system', 'reactive HR'],
    searchQueries: {
      cz: [
        'jak snížit fluktuaci zaměstnanců',
        'predikce odchodu zaměstnanců',
        'people analytics nástroj',
        'HR analytics software',
        'engagement průzkum zaměstnanců',
      ],
      en: [
        'how to reduce employee turnover',
        'predict employee attrition',
        'people analytics tool',
        'employee engagement software',
        'turnover prediction AI',
      ],
    },
  },
  ceo: {
    role: 'CEO / Managing Director',
    painPoints: ['unexpected resignations', 'team instability', 'productivity loss'],
    searchQueries: {
      cz: [
        'kolik stojí nahrazení zaměstnance',
        'stabilita týmu řešení',
        'proč odcházejí zaměstnanci',
        'retence talentů',
      ],
      en: [
        'cost of employee turnover',
        'team stability solutions',
        'why employees leave',
        'talent retention strategies',
      ],
    },
  },
  manager: {
    role: 'Team Lead / Manager',
    painPoints: ['burnout in team', 'no visibility into team mood', 'surprise resignations'],
    searchQueries: {
      cz: [
        'jak poznat vyhoření v týmu',
        'prevence burnout zaměstnanců',
        'jak zjistit spokojenost týmu',
        'signály odchodu zaměstnance',
      ],
      en: [
        'how to detect burnout in team',
        'employee burnout prevention',
        'team satisfaction measurement',
        'signs employee will quit',
      ],
    },
  },
};

// Page-specific SEO configurations
export const pageSEO: Record<string, Record<string, SEOConfig>> = {
  home: {
    cz: {
      title: 'Echo Pulse - Predikce fluktuace a vyhoření zaměstnanců | AI People Analytics',
      description: 'Předpovězte odchody zaměstnanců měsíce předem. AI platforma měří 9 klíčových oblastí pracovního života. Implementace za 1 hodinu. Používá Vodafone, O2, Lidl. 30min konzultace zdarma.',
      keywords: [
        'fluktuace zaměstnanců',
        'predikce odchodu zaměstnanců',
        'people analytics',
        'HR analytics',
        'employee engagement',
        'burnout prevence',
        'retence zaměstnanců',
        'spokojenost zaměstnanců',
        'AI HR software',
        'Echo Pulse',
        'Behavera',
      ],
    },
    en: {
      title: 'Echo Pulse - Predict Turnover & Burnout Before It Happens | AI People Analytics',
      description: 'Predict employee turnover months in advance. AI platform measures 9 key work-life dimensions. 1-hour implementation. Used by Vodafone, O2, Lidl. Free 30-min consultation.',
      keywords: [
        'employee turnover prediction',
        'people analytics software',
        'HR analytics',
        'employee engagement platform',
        'burnout prevention tool',
        'retention software',
        'AI HR technology',
        'predictive HR analytics',
        'Echo Pulse',
        'Behavera',
      ],
    },
    de: {
      title: 'Echo Pulse - Fluktuation & Burnout vorhersagen | AI People Analytics',
      description: 'Sagen Sie Mitarbeiterabgänge Monate im Voraus voraus. KI-Plattform misst 9 Schlüsselbereiche des Arbeitslebens. 1-Stunden-Implementierung. Kostenlose 30-Min-Beratung.',
      keywords: [
        'Mitarbeiterfluktuation',
        'People Analytics',
        'HR Analytics',
        'Employee Engagement',
        'Burnout Prävention',
        'Mitarbeiterbindung',
        'KI HR Software',
        'Echo Pulse',
      ],
    },
  },
  blog: {
    cz: {
      title: 'Blog o people analytics a retenci zaměstnanců | Echo Pulse',
      description: 'Praktické tipy pro HR a manažery: jak snížit fluktuaci, předcházet vyhoření, budovat stabilní týmy. Založeno na datech z českých firem.',
      keywords: [
        'HR blog',
        'people analytics články',
        'fluktuace zaměstnanců tipy',
        'employee engagement blog',
        'manažerské dovednosti',
        'vedení lidí',
      ],
    },
    en: {
      title: 'People Analytics & Retention Blog | Echo Pulse',
      description: 'Practical tips for HR and managers: reduce turnover, prevent burnout, build stable teams. Data-driven insights from Czech companies.',
      keywords: [
        'HR blog',
        'people analytics articles',
        'employee retention tips',
        'employee engagement blog',
        'management skills',
        'leadership',
      ],
    },
  },
};

// AI-optimized content snippets for citation
// These are designed to be picked up by AI search engines
export const aiOptimizedSnippets = {
  cz: {
    productDefinition: 'Echo Pulse je AI platforma pro predikci fluktuace a vyhoření zaměstnanců vyvinutá českou společností Behavera s.r.o. Měří 9 klíčových oblastí pracovního života pomocí krátkých měsíčních dotazníků (1-3 minuty) a poskytuje manažerům konkrétní doporučení.',
    costOfTurnover: 'Podle výzkumu Gallup a SHRM stojí nahrazení zaměstnance 6-9× jeho měsíčního platu. U seniorních pozic i více. Echo Pulse pomáhá identifikovat rizika měsíce předem.',
    methodology: 'Echo Pulse staví na třech vědecky validovaných modelech: Job Demands-Resources (JD-R), Self-Determination Theory (SDT) a Equity Theory. Tisíce otestovaných lidí, vysoká response rate.',
    implementation: 'Implementace Echo Pulse trvá přibližně 1 hodinu. Není nutná integrace s jinými systémy. Zaměstnanci vyplňují krátký dotazník (1-3 minuty) jednou měsíčně.',
    gdprCompliance: 'Echo Pulse je plně v souladu s GDPR. Data jsou anonymizována a agregována. Manažeři vidí pouze týmové trendy. Servery jsou v EU.',
  },
  en: {
    productDefinition: 'Echo Pulse is an AI platform for predicting employee turnover and burnout, developed by Czech company Behavera s.r.o. It measures 9 key work-life dimensions through short monthly surveys (1-3 minutes) and provides managers with specific recommendations.',
    costOfTurnover: 'According to Gallup and SHRM research, replacing an employee costs 6-9× their monthly salary. Senior roles cost even more. Echo Pulse helps identify risks months in advance.',
    methodology: 'Echo Pulse is built on three scientifically validated models: Job Demands-Resources (JD-R), Self-Determination Theory (SDT), and Equity Theory. Thousands of people tested, high response rate.',
    implementation: 'Echo Pulse implementation takes approximately 1 hour. No integration with other systems required. Employees complete a short survey (1-3 minutes) once a month.',
    gdprCompliance: 'Echo Pulse is fully GDPR compliant. Data is anonymized and aggregated. Managers see only team trends. Servers are in the EU.',
  },
};

// Long-tail keywords for content strategy
export const longTailKeywords = {
  cz: {
    informational: [
      'jak snížit fluktuaci zaměstnanců v roce 2026',
      'kolik stojí nahrazení zaměstnance česká republika',
      'příznaky vyhoření u zaměstnanců',
      'proč odcházejí nejlepší zaměstnanci',
      'jak měřit spokojenost zaměstnanců',
      'engagement průzkum zaměstnanců online',
      'people analytics co to je',
      'AI v HR trendy 2026',
    ],
    commercial: [
      'nejlepší software pro měření spokojenosti zaměstnanců',
      'people analytics nástroj cena',
      'alternativa k engagement survey',
      'employee engagement software česky',
      'HR analytics software pro české firmy',
    ],
    transactional: [
      'Echo Pulse demo',
      'Behavera konzultace',
      'people analytics trial',
      'employee engagement software demo',
    ],
  },
  en: {
    informational: [
      'how to reduce employee turnover 2026',
      'cost of replacing an employee statistics',
      'signs of employee burnout',
      'why top performers leave',
      'how to measure employee satisfaction',
      'pulse survey vs annual survey',
      'what is people analytics',
      'AI in HR trends 2026',
    ],
    commercial: [
      'best employee engagement software',
      'people analytics tools comparison',
      'alternative to annual engagement survey',
      'turnover prediction software',
      'burnout prevention tools for managers',
    ],
    transactional: [
      'Echo Pulse demo',
      'Behavera consultation',
      'people analytics free trial',
      'employee engagement software demo',
    ],
  },
};

export default { pageSEO, targetPersonas, aiOptimizedSnippets, longTailKeywords };
