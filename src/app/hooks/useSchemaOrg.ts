import { useEffect } from 'react';
import { useLanguage } from '@/app/LanguageContext';
import { SITE_ORIGIN } from '@/lib/urls';

/**
 * Injects comprehensive Schema.org JSON-LD for AI discoverability
 * This is critical for appearing in ChatGPT, Perplexity, Gemini results
 */
export function useSchemaOrg() {
  const { language } = useLanguage();

  useEffect(() => {
    // Remove any existing schema
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(s => s.remove());

    const schemas = getSchemas(language);
    
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(s => s.remove());
    };
  }, [language]);
}

function getSchemas(language: string) {
  const baseUrl = SITE_ORIGIN;
  
  // 1. Organization Schema
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Behavera s.r.o.",
    "alternateName": ["Echo Pulse", "Behavera"],
    "url": baseUrl,
    "logo": `${baseUrl}/favicon-512.png`,
    "description": language === 'cz' 
      ? "Echo Pulse je AI platforma pro predikci fluktuace a vyhoření zaměstnanců. Pomáháme HR a manažerům identifikovat rizika dříve, než se projeví v odchodech."
      : "Echo Pulse is an AI-powered platform for predicting employee turnover and burnout. We help HR and managers identify risks before they result in resignations.",
    "foundingDate": "2019",
    "founders": [{
      "@type": "Person",
      "name": "Behavera Team"
    }],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Křižíkova 148/34",
      "addressLocality": "Praha",
      "postalCode": "186 00",
      "addressCountry": "CZ"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+420-605-839-456",
      "contactType": "sales",
      "availableLanguage": ["Czech", "English", "German"]
    },
    "sameAs": [
      "https://linkedin.com/company/behavera"
    ],
    "taxID": "03525520",
    "areaServed": ["CZ", "SK", "DE", "AT"],
    "knowsAbout": [
      "Employee engagement",
      "Turnover prediction",
      "Burnout prevention",
      "People analytics",
      "HR technology",
      "Organizational psychology",
      "JD-R model",
      "Self-determination theory"
    ]
  };

  // 2. SoftwareApplication Schema (Product)
  const software = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${baseUrl}/#software`,
    "name": "Echo Pulse",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "People Analytics Software",
    "operatingSystem": "Web-based (SaaS)",
    "description": language === 'cz'
      ? "AI nástroj pro predikci fluktuace a vyhoření. Měříme 9 klíčových oblastí pracovního života pomocí krátkých měsíčních dotazníků (1-3 minuty). Manažeři dostávají jasná doporučení, co řešit jako první."
      : "AI tool for predicting turnover and burnout. We measure 9 key areas of work life through short monthly surveys (1-3 minutes). Managers receive clear recommendations on what to address first.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CZK",
      "description": language === 'cz' ? "30minutová konzultace zdarma" : "Free 30-minute consultation",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "50",
      "bestRating": "5"
    },
    "featureList": [
      "AI-powered turnover prediction",
      "Burnout risk detection",
      "9 work-life dimensions analysis",
      "1-3 minute monthly pulse surveys",
      "Manager action recommendations",
      "GDPR compliant",
      "1-hour implementation",
      "Czech, English, German support"
    ],
    "screenshot": `${baseUrl}/og-image.png`,
    "provider": {
      "@id": `${baseUrl}/#organization`
    }
  };

  // 3. FAQPage Schema - Critical for AI search results
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    "mainEntity": language === 'cz' ? [
      {
        "@type": "Question",
        "name": "Jak Echo Pulse predikuje fluktuaci zaměstnanců?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Echo Pulse využívá AI analýzu 9 klíčových oblastí pracovního života (nálada, stres, pracovní zátěž, nástroje, uznání, růst, odměny, benefity, hodnoty). Data sbíráme přes krátké měsíční dotazníky trvající 1-3 minuty. Náš algoritmus založený na modelu JD-R (Job Demands-Resources) identifikuje rizikové vzorce měsíce předtím, než se projeví v odchodech."
        }
      },
      {
        "@type": "Question",
        "name": "Kolik stojí nahrazení zaměstnance?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Podle výzkumu Gallup a SHRM stojí nahrazení zaměstnance 6-9× jeho měsíčního platu. U seniorních pozic i více. Zahrnuje to náklady na nábor, zaškolení, ztrátu produktivity a dopad na tým."
        }
      },
      {
        "@type": "Question",
        "name": "Jak dlouho trvá implementace Echo Pulse?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Základní implementace trvá přibližně 1 hodinu. Zahrnuje nastavení účtu, import zaměstnanců a spuštění prvního měření. Nevyžadujeme integraci s jinými systémy - fungujeme jako standalone řešení."
        }
      },
      {
        "@type": "Question",
        "name": "Jaký je rozdíl mezi Echo Pulse a běžnými engagement průzkumy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Běžné engagement průzkumy probíhají 1-2× ročně a trvají 20-30 minut. Echo Pulse sbírá data měsíčně v 1-3 minutách, což zajišťuje aktuální přehled bez únavy respondentů. Navíc poskytujeme prediktivní analýzu a konkrétní doporučení pro manažery, ne jen statistiky."
        }
      },
      {
        "@type": "Question",
        "name": "Je Echo Pulse v souladu s GDPR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, Echo Pulse je plně v souladu s GDPR. Data jsou anonymizována a agregována. Manažeři vidí pouze týmové trendy, nikoli odpovědi jednotlivců. Servery jsou v EU a máme uzavřenou DPA (Data Processing Agreement)."
        }
      },
      {
        "@type": "Question",
        "name": "Pro jak velké firmy je Echo Pulse vhodný?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Echo Pulse je navržen pro střední a velké firmy s 50+ zaměstnanci. Optimální je pro organizace, kde manažeři vedou týmy 5-15 lidí a potřebují včasné signály o rizicích. Používají nás firmy jako Vodafone, O2, Notino nebo Lidl."
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "How does Echo Pulse predict employee turnover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Echo Pulse uses AI analysis of 9 key work-life areas (mood, stress, workload, tools, recognition, growth, rewards, benefits, values). We collect data through short monthly surveys lasting 1-3 minutes. Our algorithm based on the JD-R model (Job Demands-Resources) identifies risk patterns months before they manifest in resignations."
        }
      },
      {
        "@type": "Question",
        "name": "How much does it cost to replace an employee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "According to Gallup and SHRM research, replacing an employee costs 6-9× their monthly salary. Senior roles cost even more. This includes recruitment costs, training, lost productivity, and team impact."
        }
      },
      {
        "@type": "Question",
        "name": "How long does Echo Pulse implementation take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Basic implementation takes approximately 1 hour. It includes account setup, employee import, and launching the first measurement. We don't require integration with other systems - we work as a standalone solution."
        }
      },
      {
        "@type": "Question",
        "name": "Is Echo Pulse GDPR compliant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Echo Pulse is fully GDPR compliant. Data is anonymized and aggregated. Managers see only team trends, not individual responses. Servers are in the EU and we have a signed DPA (Data Processing Agreement)."
        }
      }
    ]
  };

  // 4. HowTo Schema - For "how to reduce turnover" queries
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${baseUrl}/#howto`,
    "name": language === 'cz' 
      ? "Jak snížit fluktuaci zaměstnanců pomocí dat"
      : "How to reduce employee turnover using data",
    "description": language === 'cz'
      ? "Průvodce krok za krokem, jak využít Echo Pulse pro predikci a prevenci odchodů zaměstnanců."
      : "Step-by-step guide on using Echo Pulse to predict and prevent employee turnover.",
    "totalTime": "P30D",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "CZK",
      "value": "0",
      "description": language === 'cz' ? "Konzultace zdarma" : "Free consultation"
    },
    "step": language === 'cz' ? [
      {
        "@type": "HowToStep",
        "name": "Zarezervujte si konzultaci",
        "text": "30minutová konzultace zdarma s naším specialistou. Projdeme vaši situaci a identifikujeme hlavní rizika.",
        "url": `${baseUrl}/#booking`
      },
      {
        "@type": "HowToStep",
        "name": "Spusťte první měření",
        "text": "Implementace trvá 1 hodinu. Zaměstnanci dostanou krátký dotazník (1-3 minuty měsíčně).",
        "url": `${baseUrl}/#solutions`
      },
      {
        "@type": "HowToStep",
        "name": "Analyzujte výsledky",
        "text": "Echo Pulse AI identifikuje rizikové oblasti a konkrétní týmy. Manažeři dostávají jasná doporučení.",
        "url": `${baseUrl}/#solutions`
      },
      {
        "@type": "HowToStep",
        "name": "Jednejte proaktivně",
        "text": "Řešte problémy dříve, než se projeví v odchodech. Sledujte trend a měřte dopad vašich akcí.",
        "url": `${baseUrl}/#pricing`
      }
    ] : [
      {
        "@type": "HowToStep",
        "name": "Book a consultation",
        "text": "Free 30-minute consultation with our specialist. We'll review your situation and identify key risks."
      },
      {
        "@type": "HowToStep",
        "name": "Launch first measurement",
        "text": "Implementation takes 1 hour. Employees receive a short survey (1-3 minutes monthly)."
      },
      {
        "@type": "HowToStep",
        "name": "Analyze results",
        "text": "Echo Pulse AI identifies risk areas and specific teams. Managers receive clear recommendations."
      },
      {
        "@type": "HowToStep",
        "name": "Act proactively",
        "text": "Address issues before they result in resignations. Track trends and measure the impact of your actions."
      }
    ]
  };

  // 5. WebSite Schema with SearchAction
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "Echo Pulse",
    "description": language === 'cz'
      ? "AI platforma pro predikci fluktuace a vyhoření zaměstnanců"
      : "AI platform for predicting employee turnover and burnout",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "inLanguage": language === 'cz' ? "cs" : language === 'de' ? "de" : "en"
  };

  // 6. BreadcrumbList for navigation
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/blog`
      }
    ]
  };

  return [organization, software, faqPage, howTo, website, breadcrumb];
}

export default useSchemaOrg;
