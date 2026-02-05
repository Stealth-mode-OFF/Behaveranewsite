import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/app/LanguageContext';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { useSEO } from '@/app/hooks/useSEO';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Linkedin, 
  Mail, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Heart,
  Quote,
  ExternalLink
} from 'lucide-react';

// Team member images
import igorImg from '@/assets/imgi_23_63f4a99d1dc162409a74256f_igor.png';
import dusanImg from '@/assets/imgi_24_63f4ab8c6a107ed7cce0bcba_dusan.png';
import janaImg from '@/assets/imgi_25_686d2af4b3022512644e32a4_jana.png';
import veronikaImg from '@/assets/imgi_26_686d156a1cb983f39a6e470a_veru.png';
import josefImg from '@/assets/imgi_27_68e777c37c3e0ee92d4a6b2f_Pepa.png';
import igorTreslinImg from '@/assets/imgi_28_686d181e2536dd17ff0dda8c_Untitled design (30).png';
import jiriImg from '@/assets/imgi_22_68d3e452ae5a2da9698ea094_Untitled design (45) (1).png';

interface TeamMemberFull {
  id: string;
  name: string;
  role: string;
  focus: string;
  shortBio: string;
  fullBio: string;
  quote?: string;
  location: string;
  experience: string[];
  education?: string;
  funFacts: string[];
  linkedin: string;
  email?: string;
  image: string;
  isFounder?: boolean;
  isInvestor?: boolean;
}

const teamImages: Record<string, string> = {
  'jiri-valena': jiriImg,
  'igor-kubicek': igorImg,
  'dusan-svancara': dusanImg,
  'jana-sramkova': janaImg,
  'veronika-novakova': veronikaImg,
  'josef-hofman': josefImg,
  'igor-treslin': igorTreslinImg,
};

const translations = {
  cz: {
    backHome: 'Zpět domů',
    badge: 'Náš tým',
    title: 'Poznejte tým',
    titleHighlight: 'Echo Pulse',
    subtitle: 'Lidé, kteří stojí za transformací HR pomocí dat a AI.',
    experienceTitle: 'Zkušenosti',
    educationTitle: 'Vzdělání',
    funFactsTitle: 'Mimo práci',
    founderBadge: 'Co-founder',
    investorBadge: 'Investor',
    team: [
      {
        id: 'jiri-valena',
        name: 'Jiří Valena',
        role: 'CEO',
        focus: 'Growth · Sales · Leadership',
        shortBio: 'Ex-hockey. Teď skóruje v B2B.',
        fullBio: 'Jiří kombinuje kompetitivní mentalitu profesionálního sportovce s obchodní ostrostí. Po kariéře v hokejové Extralize přešel do B2B sales, kde během 5 let vybudoval several úspěšné obchodní týmy. V Behavera vede strategii a revenue growth.',
        quote: 'Nejlepší týmy nevyhrávají, protože mají talent. Vyhrávají, protože rozumí tomu, jak spolu pracovat.',
        location: 'Praha, Česká republika',
        experience: [
          'CEO @ Behavera (2022–)',
          'Sales Director @ Enterprise SaaS',
          'Professional Hockey Player',
        ],
        funFacts: [
          '🏒 Hrál hokejovou Extraligu',
          '⛷️ Závodní lyžař',
          '📚 Čte 2 knihy týdně',
        ],
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
        image: 'jiri-valena',
      },
      {
        id: 'igor-kubicek',
        name: 'Igor Kubíček',
        role: 'Head of Product',
        focus: 'HR Analytics · Digital Learning',
        shortBio: '40 knih/měsíc. Vysvětlí i multivarianty.',
        fullBio: 'Igor je mozkem za produktovou strategií Echo Pulse. S 15+ lety zkušeností v HR tech a digital learning designu přináší unikátní pohled na to, jak transformovat abstraktní behaviorální data do actionable insights. Je posedlý tím, aby komplexní věci byly jednoduché.',
        quote: 'Data bez kontextu jsou jen čísla. Náš úkol je dát jim příběh.',
        location: 'Praha, Česká republika',
        experience: [
          'Head of Product @ Behavera (2021–)',
          'Product Lead @ EdTech Startup',
          'HR Analytics Consultant',
          'Founder @ Digital Learning Agency',
        ],
        education: 'Psychologie, Karlova Univerzita',
        funFacts: [
          '📖 Čte 40 knih měsíčně',
          '🧠 Nadšenec do behavioral economics',
          '🎸 Hraje na kytaru',
        ],
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        image: 'igor-kubicek',
        isFounder: true,
      },
      {
        id: 'dusan-svancara',
        name: 'Dušan Švancara',
        role: 'CTO',
        focus: 'AI · Security · Infrastructure',
        shortBio: 'Systémy běží. Vždy.',
        fullBio: 'Dušan je architekt technologického stacku Echo Pulse. S 20+ lety v software engineering a security přináší stabilitu a škálovatelnost, kterou enterprise klienti vyžadují. Pod jeho vedením systémy běží s 99.99% uptime.',
        quote: 'Nejlepší infrastruktura je ta, o které nikdo neví. Protože prostě funguje.',
        location: 'Brno, Česká republika',
        experience: [
          'CTO @ Behavera (2021–)',
          'Principal Engineer @ Security Company',
          'Tech Lead @ Banking Software',
        ],
        education: 'Informatika, VUT Brno',
        funFacts: [
          '🔐 Certifikovaný security expert',
          '🏔️ Horolezec',
          '🤖 Staví vlastní home automation',
        ],
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        image: 'dusan-svancara',
        isFounder: true,
      },
      {
        id: 'jana-sramkova',
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        focus: 'Partnerships · Strategy',
        shortBio: 'Najde cestu k zákazníkovi. Na kole i v dealu.',
        fullBio: 'Jana vede go-to-market strategii a buduje strategická partnerství. Její background v managementu consultingu a B2B partnerships jí dává unikátní schopnost identifikovat a rozvíjet příležitosti tam, kde ostatní vidí jen překážky.',
        location: 'Praha, Česká republika',
        experience: [
          'GTM Lead @ Behavera (2023–)',
          'Partnerships Manager @ SaaS Scale-up',
          'Management Consultant @ Big Four',
        ],
        funFacts: [
          '🚴 Závodnická cyklistka',
          '🌍 Navštívila 40+ zemí',
          '🧘 Certified yoga instructor',
        ],
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
        image: 'jana-sramkova',
      },
      {
        id: 'veronika-novakova',
        name: 'Veronika Nováková',
        role: 'Customer Success',
        focus: 'HR Advisory · Content',
        shortBio: 'Propojuje lidi s produktem.',
        fullBio: 'Veronika zajišťuje, že každý klient získá maximální hodnotu z Echo Pulse. S pozadím v HR advisory přináší hluboké porozumění výzvám, kterým HR týmy čelí, a pomáhá jim transformovat data do reálných změn.',
        location: 'Praha, Česká republika',
        experience: [
          'Customer Success @ Behavera (2023–)',
          'HR Business Partner @ Enterprise',
          'People Operations @ Tech Startup',
        ],
        funFacts: [
          '🎨 Amatérská malířka',
          '🐕 Rescue dog mom',
          '☕ Káva = životní síla',
        ],
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
        image: 'veronika-novakova',
      },
      {
        id: 'josef-hofman',
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise · Relationships',
        shortBio: 'Kajakář. Směr drží i v jednání.',
        fullBio: 'Josef buduje vztahy s enterprise klienty a vede komplexní sales cycles. Jeho trpělivost a důslednost – vybroušená léty závodního kajakářství – mu pomáhá navigovat i ty nejnáročnější obchodní jednání.',
        location: 'Praha, Česká republika',
        experience: [
          'Enterprise Sales @ Behavera (2024–)',
          'Account Executive @ SaaS Company',
          'Business Development @ Consulting',
        ],
        funFacts: [
          '🛶 Závodní kajakář',
          '🏕️ Outdoor enthusiast',
          '🎯 Nikdy nemine deadline',
        ],
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
        image: 'josef-hofman',
      },
      {
        id: 'igor-treslin',
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        shortBio: '4× exit: Zomato, Dáme Jídlo, Foodora, Teya.',
        fullBio: 'Igor je sériový podnikatel a investor s impresivním track recordem čtyř úspěšných exitů. Jeho zkušenosti z budování a scalování tech společností v CEE regionu jsou neocenitelné pro strategické směřování Behavera.',
        quote: 'Největší příležitosti jsou tam, kde ostatní vidí jen problémy.',
        location: 'Praha, Česká republika',
        experience: [
          'Lead Investor @ Behavera (2023–)',
          'Co-founder @ Teya (exit)',
          'Co-founder @ Dáme Jídlo (acquired by Zomato)',
          'Advisor @ Multiple Startups',
        ],
        funFacts: [
          '🚀 4 úspěšné exity',
          '🌏 Investor v 10+ startupech',
          '🎿 Vášnivý lyžař',
        ],
        linkedin: 'https://linkedin.com/in/igortreslin',
        image: 'igor-treslin',
        isInvestor: true,
      },
    ],
  },
  en: {
    backHome: 'Back home',
    badge: 'Our Team',
    title: 'Meet the',
    titleHighlight: 'Echo Pulse team',
    subtitle: 'The people transforming HR with data and AI.',
    experienceTitle: 'Experience',
    educationTitle: 'Education',
    funFactsTitle: 'Outside of Work',
    founderBadge: 'Co-founder',
    investorBadge: 'Investor',
    team: [
      {
        id: 'jiri-valena',
        name: 'Jiří Valena',
        role: 'CEO',
        focus: 'Growth · Sales · Leadership',
        shortBio: 'Ex-hockey player. Now scores in B2B.',
        fullBio: 'Jiří combines the competitive mindset of a professional athlete with sharp business acumen. After a career in Czech Extraliga hockey, he transitioned to B2B sales, building several successful sales teams over 5 years. At Behavera, he leads strategy and revenue growth.',
        quote: 'The best teams don\'t win because they have talent. They win because they understand how to work together.',
        location: 'Prague, Czech Republic',
        experience: [
          'CEO @ Behavera (2022–)',
          'Sales Director @ Enterprise SaaS',
          'Professional Hockey Player',
        ],
        funFacts: [
          '🏒 Played in Czech Extraliga',
          '⛷️ Competitive skier',
          '📚 Reads 2 books per week',
        ],
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
        image: 'jiri-valena',
      },
      {
        id: 'igor-kubicek',
        name: 'Igor Kubíček',
        role: 'Head of Product',
        focus: 'HR Analytics · Digital Learning',
        shortBio: '40 books/month. Makes stats simple.',
        fullBio: 'Igor is the brain behind Echo Pulse\'s product strategy. With 15+ years in HR tech and digital learning design, he brings a unique perspective on transforming abstract behavioral data into actionable insights. He\'s obsessed with making complex things simple.',
        quote: 'Data without context is just numbers. Our job is to give them a story.',
        location: 'Prague, Czech Republic',
        experience: [
          'Head of Product @ Behavera (2021–)',
          'Product Lead @ EdTech Startup',
          'HR Analytics Consultant',
          'Founder @ Digital Learning Agency',
        ],
        education: 'Psychology, Charles University',
        funFacts: [
          '📖 Reads 40 books per month',
          '🧠 Behavioral economics enthusiast',
          '🎸 Plays guitar',
        ],
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        image: 'igor-kubicek',
        isFounder: true,
      },
      {
        id: 'dusan-svancara',
        name: 'Dušan Švancara',
        role: 'CTO',
        focus: 'AI · Security · Infrastructure',
        shortBio: 'Systems run. Always.',
        fullBio: 'Dušan is the architect of Echo Pulse\'s technology stack. With 20+ years in software engineering and security, he brings the stability and scalability that enterprise clients demand. Under his leadership, systems run with 99.99% uptime.',
        quote: 'The best infrastructure is one nobody knows about. Because it just works.',
        location: 'Brno, Czech Republic',
        experience: [
          'CTO @ Behavera (2021–)',
          'Principal Engineer @ Security Company',
          'Tech Lead @ Banking Software',
        ],
        education: 'Computer Science, BUT Brno',
        funFacts: [
          '🔐 Certified security expert',
          '🏔️ Mountain climber',
          '🤖 Builds custom home automation',
        ],
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        image: 'dusan-svancara',
        isFounder: true,
      },
      {
        id: 'jana-sramkova',
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        focus: 'Partnerships · Strategy',
        shortBio: 'Finds the path. On bike and in deals.',
        fullBio: 'Jana leads go-to-market strategy and builds strategic partnerships. Her background in management consulting and B2B partnerships gives her a unique ability to identify and develop opportunities where others see only obstacles.',
        location: 'Prague, Czech Republic',
        experience: [
          'GTM Lead @ Behavera (2023–)',
          'Partnerships Manager @ SaaS Scale-up',
          'Management Consultant @ Big Four',
        ],
        funFacts: [
          '🚴 Competitive cyclist',
          '🌍 Visited 40+ countries',
          '🧘 Certified yoga instructor',
        ],
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
        image: 'jana-sramkova',
      },
      {
        id: 'veronika-novakova',
        name: 'Veronika Nováková',
        role: 'Customer Success',
        focus: 'HR Advisory · Content',
        shortBio: 'Connects people with product.',
        fullBio: 'Veronika ensures every client gets maximum value from Echo Pulse. With a background in HR advisory, she brings deep understanding of the challenges HR teams face and helps them transform data into real change.',
        location: 'Prague, Czech Republic',
        experience: [
          'Customer Success @ Behavera (2023–)',
          'HR Business Partner @ Enterprise',
          'People Operations @ Tech Startup',
        ],
        funFacts: [
          '🎨 Amateur painter',
          '🐕 Rescue dog mom',
          '☕ Coffee = life force',
        ],
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
        image: 'veronika-novakova',
      },
      {
        id: 'josef-hofman',
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise · Relationships',
        shortBio: 'Kayaker. Keeps direction in deals too.',
        fullBio: 'Josef builds relationships with enterprise clients and leads complex sales cycles. His patience and persistence – honed through years of competitive kayaking – help him navigate even the most challenging business negotiations.',
        location: 'Prague, Czech Republic',
        experience: [
          'Enterprise Sales @ Behavera (2024–)',
          'Account Executive @ SaaS Company',
          'Business Development @ Consulting',
        ],
        funFacts: [
          '🛶 Competitive kayaker',
          '🏕️ Outdoor enthusiast',
          '🎯 Never misses a deadline',
        ],
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
        image: 'josef-hofman',
      },
      {
        id: 'igor-treslin',
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        shortBio: '4× exit: Zomato, Dáme Jídlo, Foodora, Teya.',
        fullBio: 'Igor is a serial entrepreneur and investor with an impressive track record of four successful exits. His experience building and scaling tech companies in the CEE region is invaluable for Behavera\'s strategic direction.',
        quote: 'The biggest opportunities are where others only see problems.',
        location: 'Prague, Czech Republic',
        experience: [
          'Lead Investor @ Behavera (2023–)',
          'Co-founder @ Teya (exit)',
          'Co-founder @ Dáme Jídlo (acquired by Zomato)',
          'Advisor @ Multiple Startups',
        ],
        funFacts: [
          '🚀 4 successful exits',
          '🌏 Investor in 10+ startups',
          '🎿 Passionate skier',
        ],
        linkedin: 'https://linkedin.com/in/igortreslin',
        image: 'igor-treslin',
        isInvestor: true,
      },
    ],
  },
  de: {
    backHome: 'Zurück zur Startseite',
    badge: 'Unser Team',
    title: 'Lernen Sie das',
    titleHighlight: 'Echo Pulse Team kennen',
    subtitle: 'Die Menschen, die HR mit Daten und KI transformieren.',
    experienceTitle: 'Erfahrung',
    educationTitle: 'Ausbildung',
    funFactsTitle: 'Außerhalb der Arbeit',
    founderBadge: 'Mitgründer',
    investorBadge: 'Investor',
    team: [
      {
        id: 'jiri-valena',
        name: 'Jiří Valena',
        role: 'CEO',
        focus: 'Growth · Sales · Leadership',
        shortBio: 'Ex-Eishockey. Trifft jetzt im B2B.',
        fullBio: 'Jiří verbindet die Wettbewerbsmentalität eines Profisportlers mit scharfem Geschäftssinn. Nach einer Karriere in der tschechischen Extraliga wechselte er in den B2B-Vertrieb und baute über 5 Jahre mehrere erfolgreiche Vertriebsteams auf.',
        quote: 'Die besten Teams gewinnen nicht, weil sie Talent haben. Sie gewinnen, weil sie verstehen, wie man zusammenarbeitet.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'CEO @ Behavera (2022–)',
          'Sales Director @ Enterprise SaaS',
          'Professioneller Eishockeyspieler',
        ],
        funFacts: [
          '🏒 Spielte in der tschechischen Extraliga',
          '⛷️ Wettkampfskifahrer',
          '📚 Liest 2 Bücher pro Woche',
        ],
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
        image: 'jiri-valena',
      },
      {
        id: 'igor-kubicek',
        name: 'Igor Kubíček',
        role: 'Head of Product',
        focus: 'HR Analytics · Digital Learning',
        shortBio: '40 Bücher/Monat. Macht Statistik einfach.',
        fullBio: 'Igor ist das Gehirn hinter der Produktstrategie von Echo Pulse. Mit über 15 Jahren Erfahrung in HR-Tech und Digital Learning Design bringt er eine einzigartige Perspektive ein.',
        quote: 'Daten ohne Kontext sind nur Zahlen. Unsere Aufgabe ist es, ihnen eine Geschichte zu geben.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Head of Product @ Behavera (2021–)',
          'Product Lead @ EdTech Startup',
          'HR Analytics Consultant',
        ],
        education: 'Psychologie, Karls-Universität',
        funFacts: [
          '📖 Liest 40 Bücher pro Monat',
          '🧠 Behavioral Economics Enthusiast',
          '🎸 Spielt Gitarre',
        ],
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        image: 'igor-kubicek',
        isFounder: true,
      },
      {
        id: 'dusan-svancara',
        name: 'Dušan Švancara',
        role: 'CTO',
        focus: 'AI · Security · Infrastructure',
        shortBio: 'Systeme laufen. Immer.',
        fullBio: 'Dušan ist der Architekt des Technologie-Stacks von Echo Pulse. Mit über 20 Jahren Erfahrung in Software Engineering und Sicherheit bringt er die Stabilität und Skalierbarkeit, die Enterprise-Kunden fordern.',
        quote: 'Die beste Infrastruktur ist die, von der niemand weiß. Weil sie einfach funktioniert.',
        location: 'Brünn, Tschechische Republik',
        experience: [
          'CTO @ Behavera (2021–)',
          'Principal Engineer @ Security Company',
          'Tech Lead @ Banking Software',
        ],
        education: 'Informatik, TU Brünn',
        funFacts: [
          '🔐 Zertifizierter Sicherheitsexperte',
          '🏔️ Bergsteiger',
          '🤖 Baut eigene Heimautomatisierung',
        ],
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        image: 'dusan-svancara',
        isFounder: true,
      },
      {
        id: 'jana-sramkova',
        name: 'Jana Šrámková',
        role: 'Go-to-Market',
        focus: 'Partnerships · Strategy',
        shortBio: 'Findet den Weg. Auf dem Rad und im Deal.',
        fullBio: 'Jana leitet die Go-to-Market-Strategie und baut strategische Partnerschaften auf. Ihr Hintergrund in Managementberatung und B2B-Partnerschaften gibt ihr eine einzigartige Fähigkeit, Chancen zu identifizieren.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'GTM Lead @ Behavera (2023–)',
          'Partnerships Manager @ SaaS Scale-up',
          'Management Consultant @ Big Four',
        ],
        funFacts: [
          '🚴 Wettkampfradfahrerin',
          '🌍 Hat 40+ Länder besucht',
          '🧘 Zertifizierte Yoga-Lehrerin',
        ],
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
        image: 'jana-sramkova',
      },
      {
        id: 'veronika-novakova',
        name: 'Veronika Nováková',
        role: 'Customer Success',
        focus: 'HR Advisory · Content',
        shortBio: 'Verbindet Menschen mit Produkt.',
        fullBio: 'Veronika stellt sicher, dass jeder Kunde den maximalen Wert aus Echo Pulse erhält. Mit einem Hintergrund in HR-Beratung bringt sie tiefes Verständnis für die Herausforderungen von HR-Teams mit.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Customer Success @ Behavera (2023–)',
          'HR Business Partner @ Enterprise',
          'People Operations @ Tech Startup',
        ],
        funFacts: [
          '🎨 Hobbymalerin',
          '🐕 Rettungshund-Mama',
          '☕ Kaffee = Lebenskraft',
        ],
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
        image: 'veronika-novakova',
      },
      {
        id: 'josef-hofman',
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise · Relationships',
        shortBio: 'Kajakfahrer. Hält Kurs auch im Vertrieb.',
        fullBio: 'Josef baut Beziehungen zu Enterprise-Kunden auf und führt komplexe Verkaufszyklen. Seine Geduld und Beharrlichkeit – geschärft durch Jahre des Wettkampfkajakfahrens – helfen ihm, auch die anspruchsvollsten Verhandlungen zu navigieren.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Enterprise Sales @ Behavera (2024–)',
          'Account Executive @ SaaS Company',
          'Business Development @ Consulting',
        ],
        funFacts: [
          '🛶 Wettkampfkajakfahrer',
          '🏕️ Outdoor-Enthusiast',
          '🎯 Verpasst nie eine Deadline',
        ],
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
        image: 'josef-hofman',
      },
      {
        id: 'igor-treslin',
        name: 'Igor Třeslín',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        shortBio: '4× Exit: Zomato, Dáme Jídlo, Foodora, Teya.',
        fullBio: 'Igor ist ein Serienunternehmer und Investor mit einer beeindruckenden Bilanz von vier erfolgreichen Exits. Seine Erfahrung beim Aufbau und der Skalierung von Tech-Unternehmen in der CEE-Region ist für die strategische Ausrichtung von Behavera von unschätzbarem Wert.',
        quote: 'Die größten Chancen liegen dort, wo andere nur Probleme sehen.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Lead Investor @ Behavera (2023–)',
          'Mitgründer @ Teya (Exit)',
          'Mitgründer @ Dáme Jídlo (von Zomato übernommen)',
          'Advisor @ Multiple Startups',
        ],
        funFacts: [
          '🚀 4 erfolgreiche Exits',
          '🌏 Investor in 10+ Startups',
          '🎿 Leidenschaftlicher Skifahrer',
        ],
        linkedin: 'https://linkedin.com/in/igortreslin',
        image: 'igor-treslin',
        isInvestor: true,
      },
    ],
  },
};

export function TeamPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useSEO({
    title: `${t.badge} | Echo Pulse`,
    description: t.subtitle,
    ogType: 'website',
    canonicalUrl: 'https://echopulse.cz/team',
  });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backHome}
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4">
              {t.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-4">
              {t.title}{' '}
              <span className="text-brand-primary">{t.titleHighlight}</span>
            </h1>
            <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="space-y-16">
            {t.team.map((member, index) => (
              <TeamMemberCard 
                key={member.id} 
                member={member as TeamMemberFull} 
                index={index}
                translations={t}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

interface TeamMemberCardProps {
  member: TeamMemberFull;
  index: number;
  translations: typeof translations.cz;
}

function TeamMemberCard({ member, index, translations: t }: TeamMemberCardProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-start`}
    >
      {/* Image */}
      <div className="lg:w-1/3 shrink-0">
        <div className="relative group">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-brand-background-secondary to-brand-primary/5">
            <img
              src={teamImages[member.image]}
              alt={member.name}
              className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          
          {/* Badges */}
          {(member.isFounder || member.isInvestor) && (
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                member.isInvestor 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-brand-primary text-white'
              }`}>
                {member.isInvestor ? t.investorBadge : t.founderBadge}
              </span>
            </div>
          )}

          {/* Social links */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-brand-text-secondary hover:text-brand-primary hover:bg-white transition-all duration-200 shadow-lg"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:w-2/3">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text-primary mb-2">
            {member.name}
          </h2>
          <p className="text-xl text-brand-primary font-medium mb-1">
            {member.role}
          </p>
          <p className="text-brand-text-muted">
            {member.focus}
          </p>
        </div>

        {/* Quote if available */}
        {member.quote && (
          <div className="mb-6 pl-4 border-l-2 border-brand-primary/30">
            <Quote className="w-5 h-5 text-brand-primary/50 mb-2" />
            <p className="text-lg italic text-brand-text-secondary">
              "{member.quote}"
            </p>
          </div>
        )}

        {/* Full bio */}
        <p className="text-brand-text-secondary leading-relaxed mb-8">
          {member.fullBio}
        </p>

        {/* Details grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Experience */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-text-primary uppercase tracking-wide">
              <Briefcase className="w-4 h-4 text-brand-primary" />
              {t.experienceTitle}
            </h3>
            <ul className="space-y-2">
              {member.experience.map((exp, i) => (
                <li key={i} className="text-sm text-brand-text-secondary">
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          {/* Fun facts */}
          <div className="space-y-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-text-primary uppercase tracking-wide">
              <Heart className="w-4 h-4 text-brand-primary" />
              {t.funFactsTitle}
            </h3>
            <ul className="space-y-2">
              {member.funFacts.map((fact, i) => (
                <li key={i} className="text-sm text-brand-text-secondary">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Location & Education */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-brand-border/30">
          <div className="flex items-center gap-2 text-sm text-brand-text-muted">
            <MapPin className="w-4 h-4" />
            {member.location}
          </div>
          {member.education && (
            <div className="flex items-center gap-2 text-sm text-brand-text-muted">
              <GraduationCap className="w-4 h-4" />
              {member.education}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
