import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/contexts/language-context';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { useSEO } from '@/app/hooks/use-seo';
import { SITE_ORIGIN } from '@/lib/urls';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Linkedin, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Heart,
  Quote,
  X,
} from 'lucide-react';

// Team member images
import igorImg from '@/assets/team/igor.webp';
import dusanImg from '@/assets/team/dusan.webp';
import janaImg from '@/assets/team/jana.webp';
import veronikaImg from '@/assets/team/veronika.webp';
import josefImg from '@/assets/team/josef.webp';
import igorTreslinImg from '@/assets/team/igor-treslin.webp';
import jiriImg from '@/assets/team/jiri.webp';

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
    backHome: 'Zp\u011bt dom\u016f',
    badge: 'N\u00e1\u0161 t\u00fdm',
    title: 'Poznejte t\u00fdm',
    titleHighlight: 'Behavera',
    subtitle: 'Lid\u00e9, kte\u0159\u00ed stoj\u00ed za transformac\u00ed HR pomoc\u00ed dat a AI.',
    experienceTitle: 'Zku\u0161enosti',
    educationTitle: 'Vzd\u011bl\u00e1n\u00ed',
    funFactsTitle: 'Mimo pr\u00e1ci',
    founderBadge: 'Co-founder',
    investorBadge: 'Investor',
    advisorLabel: 'Advisor & Investor',
    team: [
      {
        id: 'jiri-valena',
        name: 'Ji\u0159\u00ed Valena',
        role: 'CEO',
        focus: 'Growth \u00b7 Sales \u00b7 Leadership',
        shortBio: 'Ex-hockey. Te\u010f sk\u00f3ruje v B2B.',
        fullBio: 'Ji\u0159\u00ed kombinuje kompetitivn\u00ed mentalitu profesion\u00e1ln\u00edho sportovce s obchodn\u00ed ostrost\u00ed. Po kari\u00e9\u0159e v hokejov\u00e9 Extralize p\u0159e\u0161el do B2B sales, kde b\u011bhem 5 let vybudoval n\u011bkolik \u00fasp\u011b\u0161n\u00fdch obchodn\u00edch t\u00fdm\u016f. V Behavera vede strategii a revenue growth.',
        quote: 'Nejlep\u0161\u00ed t\u00fdmy nevyhr\u00e1vaj\u00ed, proto\u017ee maj\u00ed talent. Vyhr\u00e1vaj\u00ed, proto\u017ee rozum\u00ed tomu, jak spolu pracovat.',
        location: 'Praha, \u010cesk\u00e1 republika',
        experience: [
          'CEO @ Behavera (2022\u2013)',
          'Sales Director @ Enterprise SaaS',
          'Professional Hockey Player',
        ],
        funFacts: [
          '\ud83c\udfd2 Hr\u00e1l hokejovou Extraligu',
          '\u26f7\ufe0f Z\u00e1vodn\u00ed ly\u017ea\u0159',
          '\ud83d\udcda \u010cte 2 knihy t\u00fddn\u011b',
        ],
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
        image: 'jiri-valena',
      },
      {
        id: 'igor-kubicek',
        name: 'Igor Kub\u00ed\u010dek',
        role: 'Head of Product',
        focus: 'HR Analytics \u00b7 Digital Learning',
        shortBio: '40 knih/m\u011bs\u00edc. Vysv\u011btl\u00ed i multivarianty.',
        fullBio: 'Igor je mozkem za produktovou strategi\u00ed Behavera. S 15+ lety zku\u0161enost\u00ed v HR tech a digital learning designu p\u0159in\u00e1\u0161\u00ed unik\u00e1tn\u00ed pohled na to, jak transformovat abstraktn\u00ed behavior\u00e1ln\u00ed data do praktick\u00fdch poznatk\u016f pro mana\u017eery. Je posed\u00fd t\u00edm, aby komplexn\u00ed v\u011bci byly jednoduch\u00e9.',
        quote: 'Data bez kontextu jsou jen \u010d\u00edsla. N\u00e1\u0161 \u00fakol je d\u00e1t jim p\u0159\u00edb\u011bh.',
        location: 'Praha, \u010cesk\u00e1 republika',
        experience: [
          'Head of Product @ Behavera (2021\u2013)',
          'Product Lead @ EdTech Startup',
          'HR Analytics Consultant',
          'Founder @ Digital Learning Agency',
        ],
        education: 'Psychologie, Karlova Univerzita',
        funFacts: [
          '\ud83d\udcd6 \u010cte 40 knih m\u011bs\u00ed\u010dn\u011b',
          '\ud83e\udde0 Nad\u0161enec do behavioral economics',
          '\ud83c\udfb8 Hraje na kytaru',
        ],
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        image: 'igor-kubicek',
        isFounder: true,
      },
      {
        id: 'dusan-svancara',
        name: 'Du\u0161an \u0160vancara',
        role: 'CTO',
        focus: 'AI \u00b7 Security \u00b7 Infrastructure',
        shortBio: 'Syst\u00e9my b\u011b\u017e\u00ed. V\u017edy.',
        fullBio: 'Du\u0161an je architekt technologick\u00e9ho stacku Behavera. S 20+ lety v software engineering a security p\u0159in\u00e1\u0161\u00ed stabilitu a \u0161k\u00e1lovatelnost, kterou enterprise klienti vy\u017eaduj\u00ed. Pod jeho veden\u00edm syst\u00e9my b\u011b\u017e\u00ed s 99.99% uptime.',
        quote: 'Nejlep\u0161\u00ed infrastruktura je ta, o kter\u00e9 nikdo nev\u00ed. Proto\u017ee prost\u011b funguje.',
        location: 'Brno, \u010cesk\u00e1 republika',
        experience: [
          'CTO @ Behavera (2021\u2013)',
          'Principal Engineer @ Security Company',
          'Tech Lead @ Banking Software',
        ],
        education: 'Informatika, VUT Brno',
        funFacts: [
          '\ud83d\udd10 Certifikovan\u00fd security expert',
          '\ud83c\udfd4\ufe0f Horolezec',
          '\ud83e\udd16 Stav\u00ed vlastn\u00ed home automation',
        ],
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        image: 'dusan-svancara',
        isFounder: true,
      },
      {
        id: 'jana-sramkova',
        name: 'Jana \u0160r\u00e1mkov\u00e1',
        role: 'Go-to-Market',
        focus: 'Partnerships \u00b7 Strategy',
        shortBio: 'Najde cestu k z\u00e1kazn\u00edkovi. Na kole i v dealu.',
        fullBio: 'Jana vede go-to-market strategii a buduje strategick\u00e1 partnerstv\u00ed. Jej\u00ed background v managementu consultingu a B2B partnerships j\u00ed d\u00e1v\u00e1 unik\u00e1tn\u00ed schopnost identifikovat a rozv\u00edjet p\u0159\u00edle\u017eitosti tam, kde ostatn\u00ed vid\u00ed jen p\u0159ek\u00e1\u017eky.',
        location: 'Praha, \u010cesk\u00e1 republika',
        experience: [
          'GTM Lead @ Behavera (2023\u2013)',
          'Partnerships Manager @ SaaS Scale-up',
          'Management Consultant @ Big Four',
        ],
        funFacts: [
          '\ud83d\udeb4 Z\u00e1vodnick\u00e1 cyklistka',
          '\ud83c\udf0d Nav\u0161t\u00edvila 40+ zem\u00ed',
          '\ud83e\uddd8 Certified yoga instructor',
        ],
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
        image: 'jana-sramkova',
      },
      {
        id: 'veronika-novakova',
        name: 'Veronika Nov\u00e1kov\u00e1',
        role: 'Customer Success',
        focus: 'HR Advisory \u00b7 Content',
        shortBio: 'Propojuje lidi s produktem.',
        fullBio: 'Veronika zaji\u0161\u0165uje, \u017ee ka\u017ed\u00fd klient z\u00edsk\u00e1 maxim\u00e1ln\u00ed hodnotu z Behavera. S pozad\u00edm v HR advisory p\u0159in\u00e1\u0161\u00ed hlubok\u00e9 porozum\u011bn\u00ed v\u00fdzv\u00e1m, kter\u00fdm HR t\u00fdmy \u010del\u00ed, a pom\u00e1h\u00e1 jim transformovat data do re\u00e1ln\u00fdch zm\u011bn.',
        location: 'Praha, \u010cesk\u00e1 republika',
        experience: [
          'Customer Success @ Behavera (2023\u2013)',
          'HR Business Partner @ Enterprise',
          'People Operations @ Tech Startup',
        ],
        funFacts: [
          '\ud83c\udfa8 Amat\u00e9rsk\u00e1 mal\u00ed\u0159ka',
          '\ud83d\udc15 Rescue dog mom',
          '\u2615 K\u00e1va = \u017eivotn\u00ed s\u00edla',
        ],
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
        image: 'veronika-novakova',
      },
      {
        id: 'josef-hofman',
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise \u00b7 Relationships',
        shortBio: 'Kajak\u00e1\u0159. Sm\u011br dr\u017e\u00ed i v jedn\u00e1n\u00ed.',
        fullBio: 'Josef buduje vztahy s enterprise klienty a vede komplexn\u00ed sales cycles. Jeho trp\u011blivost a d\u016fslednost \u2013 vybrou\u0161en\u00e1 l\u00e9ty z\u00e1vodn\u00edho kajak\u00e1\u0159stv\u00ed \u2013 mu pom\u00e1h\u00e1 navigovat i ty nejn\u00e1ro\u010dn\u011bj\u0161\u00ed obchodn\u00ed jedn\u00e1n\u00ed.',
        location: 'Praha, \u010cesk\u00e1 republika',
        experience: [
          'Enterprise Sales @ Behavera (2024\u2013)',
          'Account Executive @ SaaS Company',
          'Business Development @ Consulting',
        ],
        funFacts: [
          '\ud83d\udea3 Z\u00e1vodn\u00ed kajak\u00e1\u0159',
          '\ud83c\udfd5\ufe0f Outdoor enthusiast',
          '\ud83c\udfaf Nikdy nemine deadline',
        ],
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
        image: 'josef-hofman',
      },
      {
        id: 'igor-treslin',
        name: 'Igor T\u0159esl\u00edn',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        shortBio: '4\u00d7 exit: Zomato, D\u00e1me J\u00eddlo, Foodora, Teya.',
        fullBio: 'Igor je s\u00e9riov\u00fd podnikatel a investor s impresivn\u00edm track recordem \u010dty\u0159 \u00fasp\u011b\u0161n\u00fdch exit\u016f. Jeho zku\u0161enosti z budov\u00e1n\u00ed a scalov\u00e1n\u00ed tech spole\u010dnost\u00ed v CEE regionu jsou neoceniteln\u00e9 pro strategick\u00e9 sm\u011b\u0159ov\u00e1n\u00ed Behavera.',
        quote: 'Nejv\u011bt\u0161\u00ed p\u0159\u00edle\u017eitosti jsou tam, kde ostatn\u00ed vid\u00ed jen probl\u00e9my.',
        location: 'Praha, \u010cesk\u00e1 republika',
        experience: [
          'Lead Investor @ Behavera (2023\u2013)',
          'Co-founder @ Teya (exit)',
          'Co-founder @ D\u00e1me J\u00eddlo (acquired by Zomato)',
          'Advisor @ Multiple Startups',
        ],
        funFacts: [
          '\ud83d\ude80 4 \u00fasp\u011b\u0161n\u00e9 exity',
          '\ud83c\udf0f Investor v 10+ startupech',
          '\ud83c\udfbf V\u00e1\u0161niv\u00fd ly\u017ea\u0159',
        ],
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
        image: 'igor-treslin',
        isInvestor: true,
      },
    ],
  },
  en: {
    backHome: 'Back home',
    badge: 'Our Team',
    title: 'Meet the',
    titleHighlight: 'Behavera team',
    subtitle: 'The people transforming HR with data and AI.',
    experienceTitle: 'Experience',
    educationTitle: 'Education',
    funFactsTitle: 'Outside of Work',
    founderBadge: 'Co-founder',
    investorBadge: 'Investor',
    advisorLabel: 'Advisor & Investor',
    team: [
      {
        id: 'jiri-valena',
        name: 'Ji\u0159\u00ed Valena',
        role: 'CEO',
        focus: 'Growth \u00b7 Sales \u00b7 Leadership',
        shortBio: 'Ex-hockey player. Now scores in B2B.',
        fullBio: 'Ji\u0159\u00ed combines the competitive mindset of a professional athlete with sharp business acumen. After a career in Czech Extraliga hockey, he transitioned to B2B sales, building several successful sales teams over 5 years. At Behavera, he leads strategy and revenue growth.',
        quote: 'The best teams don\u0027t win because they have talent. They win because they understand how to work together.',
        location: 'Prague, Czech Republic',
        experience: [
          'CEO @ Behavera (2022\u2013)',
          'Sales Director @ Enterprise SaaS',
          'Professional Hockey Player',
        ],
        funFacts: [
          '\ud83c\udfd2 Played in Czech Extraliga',
          '\u26f7\ufe0f Competitive skier',
          '\ud83d\udcda Reads 2 books per week',
        ],
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
        image: 'jiri-valena',
      },
      {
        id: 'igor-kubicek',
        name: 'Igor Kub\u00ed\u010dek',
        role: 'Head of Product',
        focus: 'HR Analytics \u00b7 Digital Learning',
        shortBio: '40 books/month. Makes stats simple.',
        fullBio: 'Igor is the brain behind Behavera\u0027s product strategy. With 15+ years in HR tech and digital learning design, he brings a unique perspective on transforming abstract behavioral data into actionable insights. He\u0027s obsessed with making complex things simple.',
        quote: 'Data without context is just numbers. Our job is to give them a story.',
        location: 'Prague, Czech Republic',
        experience: [
          'Head of Product @ Behavera (2021\u2013)',
          'Product Lead @ EdTech Startup',
          'HR Analytics Consultant',
          'Founder @ Digital Learning Agency',
        ],
        education: 'Psychology, Charles University',
        funFacts: [
          '\ud83d\udcd6 Reads 40 books per month',
          '\ud83e\udde0 Behavioral economics enthusiast',
          '\ud83c\udfb8 Plays guitar',
        ],
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        image: 'igor-kubicek',
        isFounder: true,
      },
      {
        id: 'dusan-svancara',
        name: 'Du\u0161an \u0160vancara',
        role: 'CTO',
        focus: 'AI \u00b7 Security \u00b7 Infrastructure',
        shortBio: 'Systems run. Always.',
        fullBio: 'Du\u0161an is the architect of Behavera\u0027s technology stack. With 20+ years in software engineering and security, he brings the stability and scalability that enterprise clients demand. Under his leadership, systems run with 99.99% uptime.',
        quote: 'The best infrastructure is one nobody knows about. Because it just works.',
        location: 'Brno, Czech Republic',
        experience: [
          'CTO @ Behavera (2021\u2013)',
          'Principal Engineer @ Security Company',
          'Tech Lead @ Banking Software',
        ],
        education: 'Computer Science, BUT Brno',
        funFacts: [
          '\ud83d\udd10 Certified security expert',
          '\ud83c\udfd4\ufe0f Mountain climber',
          '\ud83e\udd16 Builds custom home automation',
        ],
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        image: 'dusan-svancara',
        isFounder: true,
      },
      {
        id: 'jana-sramkova',
        name: 'Jana \u0160r\u00e1mkov\u00e1',
        role: 'Go-to-Market',
        focus: 'Partnerships \u00b7 Strategy',
        shortBio: 'Finds the path. On bike and in deals.',
        fullBio: 'Jana leads go-to-market strategy and builds strategic partnerships. Her background in management consulting and B2B partnerships gives her a unique ability to identify and develop opportunities where others see only obstacles.',
        location: 'Prague, Czech Republic',
        experience: [
          'GTM Lead @ Behavera (2023\u2013)',
          'Partnerships Manager @ SaaS Scale-up',
          'Management Consultant @ Big Four',
        ],
        funFacts: [
          '\ud83d\udeb4 Competitive cyclist',
          '\ud83c\udf0d Visited 40+ countries',
          '\ud83e\uddd8 Certified yoga instructor',
        ],
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
        image: 'jana-sramkova',
      },
      {
        id: 'veronika-novakova',
        name: 'Veronika Nov\u00e1kov\u00e1',
        role: 'Customer Success',
        focus: 'HR Advisory \u00b7 Content',
        shortBio: 'Connects people with product.',
        fullBio: 'Veronika ensures every client gets maximum value from Behavera. With a background in HR advisory, she brings deep understanding of the challenges HR teams face and helps them transform data into real change.',
        location: 'Prague, Czech Republic',
        experience: [
          'Customer Success @ Behavera (2023\u2013)',
          'HR Business Partner @ Enterprise',
          'People Operations @ Tech Startup',
        ],
        funFacts: [
          '\ud83c\udfa8 Amateur painter',
          '\ud83d\udc15 Rescue dog mom',
          '\u2615 Coffee = life force',
        ],
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
        image: 'veronika-novakova',
      },
      {
        id: 'josef-hofman',
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise \u00b7 Relationships',
        shortBio: 'Kayaker. Keeps direction in deals too.',
        fullBio: 'Josef builds relationships with enterprise clients and leads complex sales cycles. His patience and persistence \u2013 honed through years of competitive kayaking \u2013 help him navigate even the most challenging business negotiations.',
        location: 'Prague, Czech Republic',
        experience: [
          'Enterprise Sales @ Behavera (2024\u2013)',
          'Account Executive @ SaaS Company',
          'Business Development @ Consulting',
        ],
        funFacts: [
          '\ud83d\udea3 Competitive kayaker',
          '\ud83c\udfd5\ufe0f Outdoor enthusiast',
          '\ud83c\udfaf Never misses a deadline',
        ],
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
        image: 'josef-hofman',
      },
      {
        id: 'igor-treslin',
        name: 'Igor T\u0159esl\u00edn',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        shortBio: '4\u00d7 exit: Zomato, D\u00e1me J\u00eddlo, Foodora, Teya.',
        fullBio: 'Igor is a serial entrepreneur and investor with an impressive track record of four successful exits. His experience building and scaling tech companies in the CEE region is invaluable for Behavera\u0027s strategic direction.',
        quote: 'The biggest opportunities are where others only see problems.',
        location: 'Prague, Czech Republic',
        experience: [
          'Lead Investor @ Behavera (2023\u2013)',
          'Co-founder @ Teya (exit)',
          'Co-founder @ D\u00e1me J\u00eddlo (acquired by Zomato)',
          'Advisor @ Multiple Startups',
        ],
        funFacts: [
          '\ud83d\ude80 4 successful exits',
          '\ud83c\udf0f Investor in 10+ startups',
          '\ud83c\udfbf Passionate skier',
        ],
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
        image: 'igor-treslin',
        isInvestor: true,
      },
    ],
  },
  de: {
    backHome: 'Zur\u00fcck zur Startseite',
    badge: 'Unser Team',
    title: 'Lernen Sie das',
    titleHighlight: 'Behavera Team kennen',
    subtitle: 'Die Menschen, die HR mit Daten und KI transformieren.',
    experienceTitle: 'Erfahrung',
    educationTitle: 'Ausbildung',
    funFactsTitle: 'Au\u00dferhalb der Arbeit',
    founderBadge: 'Mitgr\u00fcnder',
    investorBadge: 'Investor',
    advisorLabel: 'Berater & Investor',
    team: [
      {
        id: 'jiri-valena',
        name: 'Ji\u0159\u00ed Valena',
        role: 'CEO',
        focus: 'Growth \u00b7 Sales \u00b7 Leadership',
        shortBio: 'Ex-Eishockey. Trifft jetzt im B2B.',
        fullBio: 'Ji\u0159\u00ed verbindet die Wettbewerbsmentalit\u00e4t eines Profisportlers mit scharfem Gesch\u00e4ftssinn. Nach einer Karriere in der tschechischen Extraliga wechselte er in den B2B-Vertrieb und baute \u00fcber 5 Jahre mehrere erfolgreiche Vertriebsteams auf.',
        quote: 'Die besten Teams gewinnen nicht, weil sie Talent haben. Sie gewinnen, weil sie verstehen, wie man zusammenarbeitet.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'CEO @ Behavera (2022\u2013)',
          'Sales Director @ Enterprise SaaS',
          'Professioneller Eishockeyspieler',
        ],
        funFacts: [
          '\ud83c\udfd2 Spielte in der tschechischen Extraliga',
          '\u26f7\ufe0f Wettkampfskifahrer',
          '\ud83d\udcda Liest 2 B\u00fccher pro Woche',
        ],
        linkedin: 'https://www.linkedin.com/in/valenajiri/',
        image: 'jiri-valena',
      },
      {
        id: 'igor-kubicek',
        name: 'Igor Kub\u00ed\u010dek',
        role: 'Head of Product',
        focus: 'HR Analytics \u00b7 Digital Learning',
        shortBio: '40 B\u00fccher/Monat. Macht Statistik einfach.',
        fullBio: 'Igor ist das Gehirn hinter der Produktstrategie von Behavera. Mit \u00fcber 15 Jahren Erfahrung in HR-Tech und Digital Learning Design bringt er eine einzigartige Perspektive ein.',
        quote: 'Daten ohne Kontext sind nur Zahlen. Unsere Aufgabe ist es, ihnen eine Geschichte zu geben.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Head of Product @ Behavera (2021\u2013)',
          'Product Lead @ EdTech Startup',
          'HR Analytics Consultant',
        ],
        education: 'Psychologie, Karls-Universit\u00e4t',
        funFacts: [
          '\ud83d\udcd6 Liest 40 B\u00fccher pro Monat',
          '\ud83e\udde0 Behavioral Economics Enthusiast',
          '\ud83c\udfb8 Spielt Gitarre',
        ],
        linkedin: 'https://www.linkedin.com/in/igorkubicek/',
        image: 'igor-kubicek',
        isFounder: true,
      },
      {
        id: 'dusan-svancara',
        name: 'Du\u0161an \u0160vancara',
        role: 'CTO',
        focus: 'AI \u00b7 Security \u00b7 Infrastructure',
        shortBio: 'Systeme laufen. Immer.',
        fullBio: 'Du\u0161an ist der Architekt des Technologie-Stacks von Behavera. Mit \u00fcber 20 Jahren Erfahrung in Software Engineering und Sicherheit bringt er die Stabilit\u00e4t und Skalierbarkeit, die Enterprise-Kunden fordern.',
        quote: 'Die beste Infrastruktur ist die, von der niemand wei\u00df. Weil sie einfach funktioniert.',
        location: 'Br\u00fcnn, Tschechische Republik',
        experience: [
          'CTO @ Behavera (2021\u2013)',
          'Principal Engineer @ Security Company',
          'Tech Lead @ Banking Software',
        ],
        education: 'Informatik, TU Br\u00fcnn',
        funFacts: [
          '\ud83d\udd10 Zertifizierter Sicherheitsexperte',
          '\ud83c\udfd4\ufe0f Bergsteiger',
          '\ud83e\udd16 Baut eigene Heimautomatisierung',
        ],
        linkedin: 'https://www.linkedin.com/in/dusan-svancara/',
        image: 'dusan-svancara',
        isFounder: true,
      },
      {
        id: 'jana-sramkova',
        name: 'Jana \u0160r\u00e1mkov\u00e1',
        role: 'Go-to-Market',
        focus: 'Partnerships \u00b7 Strategy',
        shortBio: 'Findet den Weg. Auf dem Rad und im Deal.',
        fullBio: 'Jana leitet die Go-to-Market-Strategie und baut strategische Partnerschaften auf. Ihr Hintergrund in Managementberatung und B2B-Partnerschaften gibt ihr eine einzigartige F\u00e4higkeit, Chancen zu identifizieren.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'GTM Lead @ Behavera (2023\u2013)',
          'Partnerships Manager @ SaaS Scale-up',
          'Management Consultant @ Big Four',
        ],
        funFacts: [
          '\ud83d\udeb4 Wettkampfradfahrerin',
          '\ud83c\udf0d Hat 40+ L\u00e4nder besucht',
          '\ud83e\uddd8 Zertifizierte Yoga-Lehrerin',
        ],
        linkedin: 'https://www.linkedin.com/in/jana-sramkova-b291a772/',
        image: 'jana-sramkova',
      },
      {
        id: 'veronika-novakova',
        name: 'Veronika Nov\u00e1kov\u00e1',
        role: 'Customer Success',
        focus: 'HR Advisory \u00b7 Content',
        shortBio: 'Verbindet Menschen mit Produkt.',
        fullBio: 'Veronika stellt sicher, dass jeder Kunde den maximalen Wert aus Behavera erh\u00e4lt. Mit einem Hintergrund in HR-Beratung bringt sie tiefes Verst\u00e4ndnis f\u00fcr die Herausforderungen von HR-Teams mit.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Customer Success @ Behavera (2023\u2013)',
          'HR Business Partner @ Enterprise',
          'People Operations @ Tech Startup',
        ],
        funFacts: [
          '\ud83c\udfa8 Hobbymalerin',
          '\ud83d\udc15 Rettungshund-Mama',
          '\u2615 Kaffee = Lebenskraft',
        ],
        linkedin: 'https://www.linkedin.com/in/veronika-novakova-9a5553b0/',
        image: 'veronika-novakova',
      },
      {
        id: 'josef-hofman',
        name: 'Josef Hofman',
        role: 'Sales',
        focus: 'Enterprise \u00b7 Relationships',
        shortBio: 'Kajakfahrer. H\u00e4lt Kurs auch im Vertrieb.',
        fullBio: 'Josef baut Beziehungen zu Enterprise-Kunden auf und f\u00fchrt komplexe Verkaufszyklen. Seine Geduld und Beharrlichkeit \u2013 gesch\u00e4rft durch Jahre des Wettkampfkajakfahrens \u2013 helfen ihm, auch die anspruchsvollsten Verhandlungen zu navigieren.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Enterprise Sales @ Behavera (2024\u2013)',
          'Account Executive @ SaaS Company',
          'Business Development @ Consulting',
        ],
        funFacts: [
          '\ud83d\udea3 Wettkampfkajakfahrer',
          '\ud83c\udfd5\ufe0f Outdoor-Enthusiast',
          '\ud83c\udfaf Verpasst nie eine Deadline',
        ],
        linkedin: 'https://www.linkedin.com/in/josef-hofman-950393391/',
        image: 'josef-hofman',
      },
      {
        id: 'igor-treslin',
        name: 'Igor T\u0159esl\u00edn',
        role: 'Investor & Advisor',
        focus: 'Serial Entrepreneur',
        shortBio: '4\u00d7 Exit: Zomato, D\u00e1me J\u00eddlo, Foodora, Teya.',
        fullBio: 'Igor ist ein Serienunternehmer und Investor mit einer beeindruckenden Bilanz von vier erfolgreichen Exits. Seine Erfahrung beim Aufbau und der Skalierung von Tech-Unternehmen in der CEE-Region ist f\u00fcr die strategische Ausrichtung von Behavera von unsch\u00e4tzbarem Wert.',
        quote: 'Die gr\u00f6\u00dften Chancen liegen dort, wo andere nur Probleme sehen.',
        location: 'Prag, Tschechische Republik',
        experience: [
          'Lead Investor @ Behavera (2023\u2013)',
          'Mitgr\u00fcnder @ Teya (Exit)',
          'Mitgr\u00fcnder @ D\u00e1me J\u00eddlo (von Zomato \u00fcbernommen)',
          'Advisor @ Multiple Startups',
        ],
        funFacts: [
          '\ud83d\ude80 4 erfolgreiche Exits',
          '\ud83c\udf0f Investor in 10+ Startups',
          '\ud83c\udfbf Leidenschaftlicher Skifahrer',
        ],
        linkedin: 'https://www.linkedin.com/in/igor-treslin-99a02422/',
        image: 'igor-treslin',
        isInvestor: true,
      },
    ],
  },
};

export function TeamPage() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMember = selectedId
    ? (t.team as TeamMemberFull[]).find((m) => m.id === selectedId) || null
    : null;

  useSEO({
    title: `${t.badge} | Behavera`,
    description: t.subtitle,
    ogType: 'website',
    canonicalUrl: `${SITE_ORIGIN}/team`,
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
              className="inline-flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backHome}
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-medium mb-4 backdrop-blur-sm border border-brand-primary/20">
              {t.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-text-primary mb-4 tracking-tight">
              {t.title}{' '}
              <span className="bg-gradient-to-r from-brand-primary to-brand-primary/70 bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
            </h1>
            <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {(t.team as TeamMemberFull[]).slice(0, 6).map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index}
                isSelected={selectedId === member.id}
                onSelect={() => setSelectedId(selectedId === member.id ? null : member.id)}
                t={t}
              />
            ))}
          </div>

          {/* Selected Member Detail (non-investor) */}
          <AnimatePresence mode="wait">
            {selectedMember && !selectedMember.isInvestor && (
              <MemberDetail
                key={selectedMember.id}
                member={selectedMember}
                onClose={() => setSelectedId(null)}
                t={t}
              />
            )}
          </AnimatePresence>

          {/* Advisor Section */}
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-border/40 to-transparent" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text-muted">
                {t.advisorLabel}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-brand-border/40 to-transparent" />
            </motion.div>

            {(t.team as TeamMemberFull[]).slice(6).map((member, index) => (
              <AdvisorCard
                key={member.id}
                member={member}
                index={index + 6}
                isSelected={selectedId === member.id}
                onSelect={() => setSelectedId(selectedId === member.id ? null : member.id)}
                t={t}
              />
            ))}

            {/* Selected Member Detail (investor) */}
            <AnimatePresence mode="wait">
              {selectedMember && selectedMember.isInvestor && (
                <MemberDetail
                  key={selectedMember.id}
                  member={selectedMember}
                  onClose={() => setSelectedId(null)}
                  t={t}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* --- Compact Team Card --- */

interface TeamCardProps {
  member: TeamMemberFull;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  t: typeof translations.cz;
}

function TeamCard({ member, index, isSelected, onSelect, t }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onSelect}
      className={`group relative rounded-2xl border p-6 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-brand-primary/50 bg-brand-primary/5 shadow-lg shadow-brand-primary/10'
          : 'border-brand-border/20 bg-brand-background-secondary/50 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        {/* Photo with ring */}
        <div className="relative mb-4">
          <div
            className={`w-24 h-24 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
              isSelected
                ? 'ring-brand-primary'
                : 'ring-brand-border/30 group-hover:ring-brand-primary/50'
            }`}
          >
            <img
              src={teamImages[member.image]}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
            />
          </div>
          {/* Co-founder badge */}
          {member.isFounder && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-primary text-white whitespace-nowrap">
              {t.founderBadge}
            </span>
          )}
        </div>

        {/* Name & Role */}
        <h3 className="text-lg font-bold text-brand-text-primary leading-tight">
          {member.name}
        </h3>
        <p className="text-sm font-medium text-brand-primary mt-0.5">
          {member.role}
        </p>
        <p className="text-xs text-brand-text-muted mt-1">{member.focus}</p>

        {/* Short bio */}
        <p className="text-sm text-brand-text-secondary mt-3 leading-relaxed line-clamp-2">
          {member.shortBio}
        </p>

        {/* LinkedIn */}
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-4 p-2 rounded-lg text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
}

/* --- Advisor Card (full-width, horizontal) --- */

function AdvisorCard({ member, index, isSelected, onSelect, t }: TeamCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onSelect}
      className={`group relative rounded-2xl border p-8 cursor-pointer transition-all duration-300 max-w-2xl mx-auto ${
        isSelected
          ? 'border-amber-500/50 bg-amber-500/5 shadow-lg shadow-amber-500/10'
          : 'border-brand-border/20 bg-brand-background-secondary/50 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        {/* Photo */}
        <div className="shrink-0">
          <div
            className={`w-24 h-24 rounded-full overflow-hidden ring-2 transition-all duration-300 ${
              isSelected
                ? 'ring-amber-500'
                : 'ring-amber-500/30 group-hover:ring-amber-500/60'
            }`}
          >
            <img
              src={teamImages[member.image]}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-brand-text-primary">
              {member.name}
            </h3>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white self-center sm:self-auto">
              {t.investorBadge}
            </span>
          </div>
          <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
            {member.focus}
          </p>
          <p className="text-sm text-brand-text-secondary mt-2 leading-relaxed">
            {member.shortBio}
          </p>

          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-text-muted hover:text-brand-primary transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* --- Expanded Detail Panel --- */

interface MemberDetailProps {
  member: TeamMemberFull;
  onClose: () => void;
  t: typeof translations.cz;
}

function MemberDetail({ member, onClose, t }: MemberDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="rounded-2xl border border-brand-border/20 bg-brand-background-secondary/30 backdrop-blur-sm p-8 mt-6">
        {/* Close */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-brand-text-muted hover:text-brand-text-primary hover:bg-brand-background-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header with photo */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-brand-primary/30 shrink-0">
            <img
              src={teamImages[member.image]}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-brand-text-primary">
              {member.name}
            </h3>
            <p className="text-brand-primary font-medium">{member.role}</p>
            {member.quote && (
              <div className="mt-3 flex items-start gap-2">
                <Quote className="w-4 h-4 text-brand-primary/50 shrink-0 mt-0.5" />
                <p className="text-sm italic text-brand-text-secondary">
                  &ldquo;{member.quote}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="text-brand-text-secondary leading-relaxed mb-8">
          {member.fullBio}
        </p>

        {/* Details grid */}
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Experience */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text-primary mb-3">
              <Briefcase className="w-3.5 h-3.5 text-brand-primary" />
              {t.experienceTitle}
            </h4>
            <ul className="space-y-2">
              {member.experience.map((exp: string, i: number) => (
                <li
                  key={i}
                  className="text-sm text-brand-text-secondary flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-primary/50 mt-2 shrink-0" />
                  {exp}
                </li>
              ))}
            </ul>
          </div>

          {/* Fun facts */}
          <div>
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-text-primary mb-3">
              <Heart className="w-3.5 h-3.5 text-brand-primary" />
              {t.funFactsTitle}
            </h4>
            <ul className="space-y-2">
              {member.funFacts.map((fact: string, i: number) => (
                <li key={i} className="text-sm text-brand-text-secondary">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Location & Education */}
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-brand-border/20">
          <span className="flex items-center gap-1.5 text-xs text-brand-text-muted">
            <MapPin className="w-3.5 h-3.5" />
            {member.location}
          </span>
          {member.education && (
            <span className="flex items-center gap-1.5 text-xs text-brand-text-muted">
              <GraduationCap className="w-3.5 h-3.5" />
              {member.education}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
