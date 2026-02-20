/**
 * Post-build script: generates static HTML pages with correct Open Graph meta
 * tags for every blog post and case study. This lets social-media crawlers
 * (LinkedIn, Facebook, Slack, Twitter/X) see the article's own image, title and
 * description when someone shares a link — without needing SSR.
 *
 * How it works:
 *   1. Reads the built dist/index.html (the SPA shell).
 *   2. For each article & case-study slug, replaces the default OG/Twitter meta
 *      tags with article-specific values.
 *   3. Writes the modified HTML to dist/blog/{slug}/index.html (or
 *      dist/case-studies/{slug}/index.html).
 *   4. Vercel serves static files first, so crawlers get the correct tags while
 *      real browsers still load the full SPA.
 *
 * ⚠️  When you add a new blog post or case study, add its OG entry here too.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const SITE_URL = 'https://cz.behavera.com';

// Read the built index.html
const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

// ── OG data for all blog posts ──────────────────────────────────────────────
const blogPosts = [
  {
    slug: '5-leaders-share-7-tips-to-kickstart-your-leadership',
    title: '5 lídrů a jejich 7 tipů pro ty, kdo s vedením lidí začínají',
    desc: 'První krok do role lídra bývá skok do neznáma. Žádný návod do ruky nedostanete a najednou už nejde jen o vaši práci, ale o lidi kolem vás.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'office-time-productive-time-or-is-it',
    title: 'Čas strávený v kanceláři = produktivní čas... nebo ne?',
    desc: 'Přes 70 % zaměstnanců by zvažovalo jinou práci, pokud by jim byla upřena možnost pracovat z domova. Pokud chcete stoprocentní přítomnost v kanceláři, možná byste měli zvážit i jiné možnosti.',
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'the-creeping-killer-of-your-business',
    title: 'Ticho v týmu neznamená klid — je to varovný signál',
    desc: 'Pouze 23 % zaměstnanců je plně zapojených v práci. Zbytek tiše odchází, vyhořel nebo ztrácí motivaci.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'hiring-only-top-performing-sales-reps',
    title: 'Jak už nikdy nepřijmout špatného obchodníka',
    desc: 'Najali jste obchodní superstar — tak proč neprodává? Po pár měsících přijde tvrdá realita: neuzavírá obchody a pipeline zeje prázdnotou.',
    image: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'valxons-discovery-journey-of-the-truth-behind-money-complaints',
    title: 'Valxon na cestě od stížností na peníze k řešení skutečných problémů',
    desc: 'Změna může být katalyzátorem růstu, ale bez struktury může vést k neúspěchu. Když Valxon prošel změnou vedení, nový CEO byl odhodlán podpořit tým.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'old-school-recruiting-is-the-new-blackberry',
    title: 'A recruiteři nebudou mít co „žrát".',
    desc: 'Expando je dynamická firma z e-commerce oblasti. S rychlým růstem přicházejí výzvy — jak efektivně nabírat talenty a volit správné lídry.',
    image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'how-to-do-1-1-meetings-effectively',
    title: 'Jak na 1:1 meetingy: Co funguje zkušeným team leaderům',
    desc: 'Pro některé leadery jsou 1:1 meetingy oblíbenou součástí práce a jiní bojují s tím, jak je uchopit. Praktické tipy od zkušených leaderů.',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'busting-6-myths-about-well-being-in-companies',
    title: 'Boříme 6 mýtů o well-beingu ve firmách',
    desc: 'Well-being zaplavil internety a s ním i mýty. Pojďme si posvítit na ty nejvíce šířené entre dveřmi kanceláří i provozoven.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'well-being-of-leaders-at-risk',
    title: 'Well-being leaderů v ohrožení: jak se o sebe postarat a stát se lepším vzorem',
    desc: 'V těžkých časech se spoléháme na leadery jako na maják v bouři. Co když i jim dojdou síly a zhasne jejich světlo?',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'hr-conferences-2023-international-online-events',
    title: 'HR konference 2023: přehled zahraničních akcí s možností virtuální účasti',
    desc: 'Rádi byste si odskočili pro inspiraci do zahraničí? Celá řada konferencí nabízí možnost virtuální účasti — a některé jsou zdarma.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'behavera-well-being-index',
    title: 'Behavera Well-being Index: moderní průzkum spokojenosti a praktická doporučení v jednom',
    desc: 'Co kdyby existoval nástroj, který za vás udělá průzkum, analýzu dat a doporučí, jak zlepšit well-being ve firmě?',
    image: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'how-to-deal-with-well-being-effectively',
    title: 'Řešíte well-being efektivně?',
    desc: '96 % firem poskytuje zaměstnancům více zdrojů pro zlepšení mentálního zdraví, ale pouze 1 ze 6 se cítí skutečně podpořeno zaměstnavatelem.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: '7-tips-for-improving-employee-engagement-in-hybrid-work',
    title: '7 tipů pro zlepšení angažovanosti zaměstnanců v hybridním modelu práce',
    desc: 'Dělala vám angažovanost vrásky ještě před pandemií? V hybridním nastavení je to pro mnohé firmy ještě větší výzva.',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'inspiring-ted-talks-for-hr-professionals',
    title: 'Inspirativní TED Talky pro HR profesionály a leadery',
    desc: 'Vybrali jsme pro vás nejlepší myšlenky od řečníků z oblasti lidských zdrojů a leadershipu. Připravte si otevřenou mysl.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: '5-trends-that-will-transform-the-way-we-work',
    title: '5 trendů, které změní jak pracujeme',
    desc: 'Svět se mění před očima a s ním i způsob jakým budeme pracovat. Co nás čeká za trendy v HR a leadershipu?',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'the-future-of-work-is-in-the-people-first-approach',
    title: 'Budoucnost úspěchu firem je v people-first přístupu',
    desc: 'Proč vám lidé odcházejí a kvalitní uchazeči se nehlásí? Zakopaný pes nemusí být v benefitech, ale v přístupu firem k lidem.',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'evolve-summit-2025-behavera-report',
    title: 'EVOLVE! Summit 2025: Jak jsme jako Behavera zažili největší HR festival ve střední Evropě',
    desc: 'V listopadu 2025 jsme se vydali na EVOLVE! Summit — největší HR a recruitment festival v Evropě. Keynote speaker Greg Savage, živá hudba a upřímné rozhovory o budoucnosti HR.',
    image: '/evolve-summit-2025.jpg',
  },
  {
    slug: 'msv-2025-manufacturing-employee-engagement',
    title: 'MSV 2025: Co nás strojírenský veletrh naučil o angažovanosti ve výrobě',
    desc: 'Na 66. ročníku MSV v Brně jsme se bavili s HR lídry z výrobních firem o fluktuaci na dělnických pozicích a jak ji řešit pomocí dat.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'innovation-week-ai-2025-startup-team-health',
    title: 'Innovation Week AI 2025: Proč startupy potřebují pulse check-iny víc než korporáty',
    desc: 'Dva dny na ČSOB Campusu mezi 15 000 inovátory. Ukázali jsme startupům, jak pulse check-iny chrání zdraví týmu při dynamickém růstu.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'czech-startup-week-2025-team-dynamics-startups',
    title: 'Czech Startup Week 2025: Rozhovory, které nikdo neplánuje, ale všichni potřebují',
    desc: 'Týden startupových akcí napříč Prahou. Rychle rostoucí týmy se rozpadají, protože se nikdo nezeptal, jak se lidé doopravdy cítí.',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200',
  },
];

// ── OG data for all case studies ────────────────────────────────────────────
const caseStudies = [
  {
    slug: 'za-3-minuty-jasno-jak-na-employer-branding',
    title: 'Za 3 minuty jasno, jak na Employer Branding — Průša Research',
    desc: 'Průša Research chtěla ověřit, jak jsou klíčové hodnoty a firemní kultura vnímány napříč organizací, a získat datový podklad pro strategická rozhodnutí.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'jak-expando-objevilo-skryty-talent',
    title: 'Jak Expando objevilo skrytý talent a otevřelo nové obchodní příležitosti',
    desc: 'Expando chtělo růst za hranice Amazonu, ale interně vládl chaos. Motivace klesala a týmy ztrácely čas hloubkovými rozhovory se zkreslenými výsledky.',
    image: 'https://cdn.prod.website-files.com/63d2c5297fe3f5119d5e8eba/68932021e3812af317591450_2025-05-13-expando-by-lukasneasi-48%20(1).jpg',
  },
  {
    slug: 'nove-vedeni-a-stiznosti-na-penize',
    title: 'Nové vedení a stížnosti na peníze. Behavera odhalila skutečný problém.',
    desc: 'Nové vedení čelilo záplavě stížností na pracovní zátěž a platy, stresové atmosféře, nedůvěře a nejistotě v týmech.',
    image: 'https://cdn.prod.website-files.com/63d2c5297fe3f5119d5e8eba/67c9b914d0abe99293d51d3b_Karel%20Valxon%202.jpeg',
  },
  {
    slug: 'from-data-to-action-how-vodafone-increased-sales-by-80-and-cut-attrition-by-40',
    title: 'Jak Vodafone zvýšil výkon a retenci díky datově řízenému talent managementu',
    desc: 'Vodafone čelil vysoké fluktuaci, nekonzistentnímu výkonu a nejasným profilům úspěšnosti.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'how-behaveras-data-helped-365-bank-achieve-a-successful-digital-transformation',
    title: 'Jak data od Behavery pomohla 365.bank k úspěšné digitální transformaci',
    desc: 'Transformace na plně digitální banku vyžadovala kompletní kulturní a manažerskou změnu. Tradiční metody náboru nedokázaly identifikovat správné lidi.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  },
];

// ── HTML Replacement Logic ──────────────────────────────────────────────────

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generatePage(pagePath, { title, desc, image }) {
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const ogUrl = `${SITE_URL}${pagePath}`;
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(desc);

  let html = baseHtml;

  // Title tag
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle} | Behavera</title>`);

  // Primary meta
  html = html.replace(
    /<meta name="title" content="[^"]*"/,
    `<meta name="title" content="${safeTitle}"`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${safeDesc}"`
  );

  // Canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${ogUrl}"`
  );

  // Open Graph
  html = html.replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="article"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${ogUrl}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${safeTitle}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${safeDesc}"`);
  html = html.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${ogImage}"`);

  // Twitter
  html = html.replace(/<meta property="twitter:url" content="[^"]*"/, `<meta property="twitter:url" content="${ogUrl}"`);
  html = html.replace(/<meta property="twitter:title" content="[^"]*"/, `<meta property="twitter:title" content="${safeTitle}"`);
  html = html.replace(/<meta property="twitter:description" content="[^"]*"/, `<meta property="twitter:description" content="${safeDesc}"`);
  html = html.replace(/<meta property="twitter:image" content="[^"]*"/, `<meta property="twitter:image" content="${ogImage}"`);

  // Write file
  const segments = pagePath.split('/').filter(Boolean);
  const dir = join(distDir, ...segments);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf-8');
}

// ── Generate pages ──────────────────────────────────────────────────────────

let count = 0;

for (const post of blogPosts) {
  generatePage(`/blog/${post.slug}`, post);
  count++;
}

for (const study of caseStudies) {
  generatePage(`/case-studies/${study.slug}`, study);
  count++;
}

console.log(`✅ Generated ${count} OG pages (${blogPosts.length} blog + ${caseStudies.length} case studies)`);
