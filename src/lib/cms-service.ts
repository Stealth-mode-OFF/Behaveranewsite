import { BlogPost, CaseStudy, Author } from './types';
import { supabase as supabaseClient } from './supabase';
import { adminEnabled } from './config';
import { BLOG_POSTS, BLOG_AUTHORS } from './blog-content';

type AuthorRow = {
  id: string;
  name: string;
  avatar?: string | null;
  role?: string | null;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string | null;
  published_at: string;
  tags?: string[] | null;
  status: BlogPost["status"];
  authors?: AuthorRow | null;
  title_cz?: string | null;
  excerpt_cz?: string | null;
  content_cz?: string | null;
};

type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  industry: string;
  challenge: string;
  solution: string;
  results?: { label: string; value: string }[] | null;
  content: string;
  cover_image?: string | null;
  published_at: string;
  status: CaseStudy["status"];
  title_cz?: string | null;
  challenge_cz?: string | null;
  solution_cz?: string | null;
  content_cz?: string | null;
  industry_cz?: string | null;
  results_cz?: { label: string; value: string }[] | null;
  card_summary?: string | null;
  card_summary_cz?: string | null;
};

// Supabase client is imported from shared module

const resolveAuthor = (row?: AuthorRow | null): Author => {
  if (!row) return DEFAULT_AUTHORS[0];
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar || undefined,
    role: row.role || undefined
  };
};

const mapPostRow = (row: PostRow): BlogPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt,
  content: row.content,
  coverImage: row.cover_image || undefined,
  author: resolveAuthor(row.authors),
  publishedAt: row.published_at,
  tags: row.tags || [],
  status: row.status,
  conversionPrimary: 'balanced',
  title_cz: row.title_cz || undefined,
  excerpt_cz: row.excerpt_cz || undefined,
  content_cz: row.content_cz || undefined,
});

const mapCaseStudyRow = (row: CaseStudyRow): CaseStudy => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  clientName: row.client_name,
  industry: row.industry,
  challenge: row.challenge,
  solution: row.solution,
  results: row.results || [],
  content: row.content,
  coverImage: row.cover_image || undefined,
  publishedAt: row.published_at,
  status: row.status,
  title_cz: row.title_cz || undefined,
  challenge_cz: row.challenge_cz || undefined,
  solution_cz: row.solution_cz || undefined,
  content_cz: row.content_cz || undefined,
  industry_cz: row.industry_cz || undefined,
  results_cz: row.results_cz || undefined,
  cardSummary: row.card_summary || undefined,
  cardSummary_cz: row.card_summary_cz || undefined,
});

const isNoRowsError = (error: { code?: string } | null | undefined): boolean =>
  !!error && error.code === 'PGRST116';

/* ─── localStorage helpers ─── */
const LS_KEY_CASE_STUDIES = 'behavera_case_studies';
const LS_KEY_POSTS = 'behavera_posts';

function loadLocalCaseStudies(): CaseStudy[] {
  try {
    const raw = localStorage.getItem(LS_KEY_CASE_STUDIES);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveLocalCaseStudies(studies: CaseStudy[]) {
  localStorage.setItem(LS_KEY_CASE_STUDIES, JSON.stringify(studies));
}

/** Merge mock + localStorage, deduplicate by id (local overrides mock), respect deletions */
function getMergedCaseStudies(): CaseStudy[] {
  const local = loadLocalCaseStudies();
  const localIds = new Set(local.map(s => s.id));
  const deletedIds = new Set<string>(
    JSON.parse(localStorage.getItem('behavera_deleted_cs') || '[]')
  );
  const fromDefault = DEFAULT_CASE_STUDIES.filter(s => !localIds.has(s.id) && !deletedIds.has(s.id));
  return [...local, ...fromDefault].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Seed content — displayed when CMS (Supabase) is not configured
const DEFAULT_AUTHORS: Author[] = BLOG_AUTHORS;

const DEFAULT_POSTS: BlogPost[] = BLOG_POSTS.map((post) => ({
  ...post,
  conversionPrimary: post.conversionPrimary ?? 'balanced',
}));

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: '0',
    title: 'Za 3 minuty jasno, jak na Employer Branding',
    slug: 'za-3-minuty-jasno-jak-na-employer-branding',
    clientName: 'Prusa Research',
    industry: 'Technology / 3D Printing',
    industry_cz: 'Technologie / 3D tisk',
    challenge: 'Průša Research chtěla ověřit, jak jsou klíčové hodnoty a firemní kultura vnímány napříč organizací, a získat kvalitní datový podklad pro další strategická rozhodnutí v oblasti employer brandu.',
    challenge_cz: 'Průša Research chtěla ověřit, jak jsou klíčové hodnoty a firemní kultura vnímány napříč organizací, a získat kvalitní datový podklad pro další strategická rozhodnutí v oblasti employer brandu.',
    solution: 'Využili Echo Pulse od Behavery zaměřený na téma hodnot a firemní identity (Employee Value Proposition). Krátký, konverzační formát dotazníku zapojil 60,1 % zaměstnanců během několika dní.',
    solution_cz: 'Využili Echo Pulse od Behavery zaměřený na téma hodnot a firemní identity (Employee Value Proposition). Krátký, konverzační formát dotazníku zapojil 60,1 % zaměstnanců během několika dní.',
    results: [
      { label: 'Time to complete', value: '3 min' },
      { label: 'Employees incl. production', value: '1000+' }
    ],
    results_cz: [
      { label: 'Čas na vyplnění', value: '3 min' },
      { label: 'Zaměstnanců i ve výrobě', value: '1000+' }
    ],
    cardSummary: 'In just three minutes per employee, Prusa Research verified their core values and employer brand, engaging 60.1% of staff across production and office teams with Echo Pulse.',
    cardSummary_cz: 'Za pouhé tři minuty na zaměstnance ověřila Prusa Research své klíčové hodnoty a employer brand. Do Echo Pulse se zapojilo 60,1 % lidí napříč výrobou i kancelářskými týmy.',
    content: `
      <h2>Cíl</h2>
      <p>Cílem první fáze spolupráce s Behaverou bylo získat strukturovanou a otevřenou zpětnou vazbu od zaměstnanců a ověřit, jaký přínos může mít systematický sběr dat pro další rozvoj employer brandu. Zároveň chtělo vedení posoudit, jak může tento přístup zapadnout do jejich dlouhodobé HR a komunikační strategie.</p>

      <h2>Řešení</h2>
      <p>S cílem zapojit zaměstnance napříč celou organizací se v Průša Research rozhodli využít Echo Pulse od Behavery zaměřený na téma hodnot a firemní identity (Employee Value Proposition).</p>
      <p>Krátký, konverzační formát dotazníku a jeho integrace do interních nástrojů umožnily oslovit lidi napříč týmy během několika dní a získat jejich pohled na to, za čím firma skutečně stojí.</p>
      <p>Do průzkumu se zapojilo 60,1 % zaměstnanců, což je v kontextu velkých výrobních organizací nadprůměrný výsledek a potvrzuje vysokou míru zapojení i důvěry v celý proces.</p>
      <p>V týmech se často objevovala zpětná vazba – <blockquote>"Je super, že se někdo ptá, co si opravdu myslíme"</blockquote> a že vyplnění dotazníku bylo rychlejší a jednodušší, než čekali.</p>

      <h2>Výsledky</h2>
      <p>Výsledky průzkumu potvrdily silné hodnoty, na kterých Průša Research dlouhodobě staví svou firemní kulturu:</p>
      <ul>
        <li>Spolupráci a vzájemnou podporu mezi týmy</li>
        <li>Hrdost na produkty a globální dopad firmy</li>
        <li>Vysokou míru autonomie a férového přístupu</li>
      </ul>
      <p>Získaná data zároveň pomohla tyto hodnoty přesněji pojmenovat a převést je do konkrétních sdělení využitelných v employer brandingu, náborové komunikaci i interním rozvoji.</p>
      <p>Na základě výstupů má dnes HR a vedení k dispozici ověřené argumenty, příklady a autentické citace zaměstnanců, které podporují jednotnou a důvěryhodnou komunikaci značky zaměstnavatele.</p>
      <p>Průzkum také poskytl detailnější pohled na fungování firmy napříč různými týmy a rolemi a stal se dalším podkladem pro cílený rozvoj leadershipu, spolupráce a pracovního prostředí.</p>
      <p>A proč to funguje? Za pouhé tři minuty času každého zaměstnance získali v Průša Research data, která jim umožňují dlouhodobě posilovat svou reputaci atraktivního zaměstnavatele a přitahovat správné talenty na základě reálných zkušeností lidí uvnitř firmy.</p>
    `,
    content_cz: `
      <h2>Cíl</h2>
      <p>Cílem první fáze spolupráce s Behaverou bylo získat strukturovanou a otevřenou zpětnou vazbu od zaměstnanců a ověřit, jaký přínos může mít systematický sběr dat pro další rozvoj employer brandu. Zároveň chtělo vedení posoudit, jak může tento přístup zapadnout do jejich dlouhodobé HR a komunikační strategie.</p>

      <h2>Řešení</h2>
      <p>S cílem zapojit zaměstnance napříč celou organizací se v Průša Research rozhodli využít Echo Pulse od Behavery zaměřený na téma hodnot a firemní identity (Employee Value Proposition).</p>
      <p>Krátký, konverzační formát dotazníku a jeho integrace do interních nástrojů umožnily oslovit lidi napříč týmy během několika dní a získat jejich pohled na to, za čím firma skutečně stojí.</p>
      <p>Do průzkumu se zapojilo 60,1 % zaměstnanců, což je v kontextu velkých výrobních organizací nadprůměrný výsledek a potvrzuje vysokou míru zapojení i důvěry v celý proces.</p>
      <p>V týmech se často objevovala zpětná vazba – <blockquote>"Je super, že se někdo ptá, co si opravdu myslíme"</blockquote> a že vyplnění dotazníku bylo rychlejší a jednodušší, než čekali.</p>

      <h2>Výsledky</h2>
      <p>Výsledky průzkumu potvrdily silné hodnoty, na kterých Průša Research dlouhodobě staví svou firemní kulturu:</p>
      <ul>
        <li>Spolupráci a vzájemnou podporu mezi týmy</li>
        <li>Hrdost na produkty a globální dopad firmy</li>
        <li>Vysokou míru autonomie a férového přístupu</li>
      </ul>
      <p>Získaná data zároveň pomohla tyto hodnoty přesněji pojmenovat a převést je do konkrétních sdělení využitelných v employer brandingu, náborové komunikaci i interním rozvoji.</p>
      <p>Na základě výstupů má dnes HR a vedení k dispozici ověřené argumenty, příklady a autentické citace zaměstnanců, které podporují jednotnou a důvěryhodnou komunikaci značky zaměstnavatele.</p>
      <p>Průzkum také poskytl detailnější pohled na fungování firmy napříč různými týmy a rolemi a stal se dalším podkladem pro cílený rozvoj leadershipu, spolupráce a pracovního prostředí.</p>
      <p>A proč to funguje? Za pouhé tři minuty času každého zaměstnance získali v Průša Research data, která jim umožňují dlouhodobě posilovat svou reputaci atraktivního zaměstnavatele a přitahovat správné talenty na základě reálných zkušeností lidí uvnitř firmy.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    tags: ['Employer Branding', 'Culture', 'EVP'],
    employeeCount: '1000+',
    publishedAt: new Date('2024-05-01').toISOString(),
    status: 'published'
  },
  {
    id: '1',
    title: 'Jak Expando objevilo skrytý talent a otevřelo nové obchodní příležitosti.',
    slug: 'jak-expando-objevilo-skryty-talent',
    clientName: 'Expando',
    industry: 'E-Commerce',
    challenge: 'Expando wanted to grow beyond Amazon, but internally, things were chaotic. Motivation was low, and teams were wasting time on in-depth interviews that produced biased results — leading to poor decisions.',
    challenge_cz: 'Expando chtělo růst za hranice Amazonu, ale interně vládl chaos. Motivace klesala a týmy ztrácely čas hloubkovými rozhovory, které přinášely zkreslené výsledky — a tím i špatná rozhodnutí.',
    solution: 'Thanks to specific Playbook recommendations, they introduced regular 1:1 meetings, improved communication, and created expert roles with greater responsibility. Collecting regular feedback is now relevant and 80% faster.',
    solution_cz: 'Díky konkrétním doporučením z Playbooku zavedli pravidelné 1:1 schůzky, zlepšili komunikaci a vytvořili expertní role s větší zodpovědností. Sběr pravidelné zpětné vazby je nyní relevantní a o 80 % rychlejší.',
    results: [
      { label: 'Increase in client\'s sales', value: '37%' },
      { label: 'Saved annually', value: '€11,000' },
      { label: 'Higher response rate', value: '25%' }
    ],
    results_cz: [
      { label: 'Nárůst prodejů klienta', value: '37%' },
      { label: 'Ušetřeno ročně', value: '€11 000' },
      { label: 'Vyšší návratnost dotazníků', value: '25%' }
    ],
    cardSummary: 'Expando used Behavera\'s Engagement to uncover hidden talent and fix internal chaos. One promoted employee boosted marketplace sales by 37%, while feedback cycles became 80% faster.',
    cardSummary_cz: 'V Expandu díky Engagementu od Behavery zjistili, kde se skrývá talent a proč vládne vnitřní chaos. Jedna povýšená zaměstnankyně zvýšila prodeje na marketplace o 37 % a cykly zpětné vazby se zrychlily o 80 %.',
    content: `
      <h2>Problem</h2>
      <p>Expando faced the challenge of expanding beyond Amazon. They wanted to help clients grow also elsewhere but felt that internally, things weren't working as they should — employee motivation was declining, complaints about chaos were rising, and there was a lack of direction.</p>
      <p>Although the team put effort into identifying the root causes, their internal analyses were time-consuming, based on subjective impressions. Employee surveys and in-depth interviews took up to 7 working days per cycle, with only a 59% response rate despite repeated reminders. Poorly formulated questions and evaluator bias distorted the results.</p>

      <h2>Solution</h2>
      <p>Thanks to Behavera, Expando gained an objective understanding of the challenges they face for the first time. Analysis using the targeted Echo Pulse survey revealed key issues: not only ineffective communication within and between teams and a lack of recognition, but also low employee motivation and limited growth opportunities.</p>
      <p>For employees who felt stuck and demotivated — unable to fully use their potential and lacking a challenge to grow — Expando introduced expert roles. These roles gave them more responsibility, autonomy, and, most importantly, a sense of purpose.</p>
      <blockquote>"Echo Pulse nám dal objektivní pohled na problémy, které jsme tušili, ale neuměli pojmenovat." — Dominik Hegedüs, CEO Expando</blockquote>

      <h2>Result</h2>
      <p>Within three months of launching the first Echo Pulse, internal collaboration improved thanks to regular information sharing, clear goals, and a newly defined set of processes. One key achievement was the strong growth on the Kaufland marketplace, driven by an employee who, after stepping into her new role as Key Account Manager, activated 18% more clients on the platform and increased overall sales there by 14.5% in just 8 months. She even helped one of Expando's top clients boost their sales volume by 37%.</p>
      <p>Regular surveys now take employees just three minutes to complete and reach 84% participation — 25% more than with previous in-house questionnaires. HR can now complete the entire feedback cycle, including creation of a presentation, in one day instead of the original seven.</p>
    `,
    content_cz: `
      <h2>Problém</h2>
      <p>Expando stálo před výzvou expanze za hranice Amazonu. Chtěli pomoci klientům růst i na dalších platformách, ale interně vnímali, že věci nefungují, jak by měly — motivace zaměstnanců klesala, přibývaly stížnosti na chaos a chyběl jasný směr.</p>
      <p>Přestože tým investoval úsilí do identifikace příčin, jejich interní analýzy byly časově náročné a založené na subjektivních dojmech. Zaměstnanecké průzkumy a hloubkové rozhovory trvaly až 7 pracovních dní na cyklus, s pouze 59% návratností i přes opakované připomínky. Špatně formulované otázky a zaujatost hodnotitelů zkreslovaly výsledky.</p>

      <h2>Řešení</h2>
      <p>Díky Behaveře získalo Expando poprvé objektivní pohled na výzvy, kterým čelí. Analýza cíleným průzkumem Echo Pulse odhalila klíčové problémy: nejen neefektivní komunikaci uvnitř týmů i mezi nimi a nedostatek uznání, ale také nízkou motivaci zaměstnanců a omezené možnosti růstu.</p>
      <p>Pro zaměstnance, kteří se cítili zaseknutí a demotivovaní — nemohli plně využít svůj potenciál a chyběla jim výzva k růstu — Expando zavedlo expertní role. Ty jim daly více zodpovědnosti, autonomie a především smysl.</p>
      <blockquote>"Echo Pulse nám dal objektivní pohled na problémy, které jsme tušili, ale neuměli pojmenovat." — Dominik Hegedüs, CEO Expando</blockquote>

      <h2>Výsledky</h2>
      <p>Během tří měsíců od spuštění prvního Echo Pulse se interní spolupráce zlepšila díky pravidelnému sdílení informací, jasným cílům a nově definované sadě procesů. Klíčovým úspěchem byl silný růst na marketplace Kaufland — zaměstnankyně, která po přechodu na pozici Key Account Manager aktivovala o 18 % více klientů na platformě a zvýšila celkové prodeje o 14,5 % za pouhých 8 měsíců. Jednomu z top klientů Expanda dokonce pomohla zvýšit objem prodejů o 37 %.</p>
      <p>Pravidelné průzkumy nyní zaměstnancům zaberou jen tři minuty a dosahují 84% účasti — o 25 % více než dříve u interních dotazníků. HR nyní zvládne celý cyklus zpětné vazby včetně prezentace za jeden den místo původních sedmi.</p>
    `,
    coverImage: 'https://cdn.prod.website-files.com/63d2c5297fe3f5119d5e8eba/68932021e3812af317591450_2025-05-13-expando-by-lukasneasi-48%20(1).jpg',
    tags: ['Engagement', 'Promotion', 'Communication'],
    employeeCount: '50+',
    publishedAt: new Date('2024-04-15').toISOString(),
    status: 'published'
  },
  {
    id: '4',
    title: 'Nové vedení a stížnosti na peníze. Behavera odhalila skutečný problém.',
    slug: 'nove-vedeni-a-stiznosti-na-penize',
    clientName: 'Valxon',
    industry: 'Promotional Merchandise',
    industry_cz: 'Reklamní předměty',
    challenge: 'New leadership faced a flood of complaints on workload and pay, along with a stressful atmosphere, distrust, chaos and insecurity in teams.',
    challenge_cz: 'Nové vedení čelilo záplavě stížností na pracovní zátěž a platy, stresové atmosféře, nedůvěře, chaosu a nejistotě v týmech.',
    solution: "People hadn't lost interest — the issue wasn't money, but poor conditions, solved through flexibility, clear processes, and greater transparency.",
    solution_cz: 'Lidé neztratili zájem — problém nebyly peníze, ale špatné podmínky. Řešením byla flexibilita, jasné procesy a větší transparentnost.',
    results: [
      { label: 'Increase in employee satisfaction', value: '25%' },
      { label: 'Hours saved thanks to automation', value: '200+' },
      { label: 'Prevented from burnout and quitting', value: '1 person' }
    ],
    results_cz: [
      { label: 'Nárůst spokojenosti zaměstnanců', value: '25%' },
      { label: 'Hodin ušetřeno díky automatizaci', value: '200+' },
      { label: 'Zabráněno burnoutu a odchodu', value: '1 člověk' }
    ],
    cardSummary: 'New CEO Karel Poplstein used Behavera Engagement to discover that dissatisfaction wasn\'t about pay — it was about conditions. Satisfaction scores jumped from 4.4/10 to 9/10, and one employee on the edge of burnout decided to stay.',
    cardSummary_cz: 'Nový CEO Karel Poplstein pomocí Behavera Engagement zjistil, že nespokojenost není o penězích — ale o podmínkách. Spokojenost vyskočila ze 4,4/10 na 9/10 a jeden zaměstnanec na hranici burnoutu se rozhodl zůstat.',
    content: `
      <h2>Problem</h2>
      <p>Valxon, growing B2B company specializing in customized merchandise, faced significant internal challenges following a change in leadership. Employees expressed growing dissatisfaction, feeling overworked, frustrated and underpaid due to an increasingly chaotic work environment. Unclear priorities, high stress levels, and a lack of structured communication led to declining trust in management.</p>

      <h2>Solution</h2>
      <p>When Valxon's new CEO, Karel Poplstein stepped in, he wanted to address internal challenges at their core. So Karel turned to Behavera Engagement. The results not only confirmed his concerns but also revealed that employees weren't disengaged — response rate of the first round was 100% — but they lacked the right conditions to work effectively.</p>
      <blockquote>"Behavera nám ukázala, že lidé neztratili zájem — jen potřebovali lepší podmínky." — Karel Poplstein, CEO Valxon</blockquote>
      <p>Seeing these insights, Valxon's leadership took structured actions:</p>
      <ul>
        <li>Clarified roles and responsibilities</li>
        <li>Designed structured sales processes</li>
        <li>Automated manual workflows</li>
        <li>Established OKRs linked to individual KPIs</li>
        <li>Regular check-ins and stand-ups</li>
        <li>Shared engagement results transparently</li>
      </ul>

      <h2>Result</h2>
      <p>Valxon committed to improving employee working conditions, setting a goal to raise their well-being index score from 6.5 to 8.2 by the end of Q1. By the end of Q2, the score had reached 9/10 points!</p>
      <ul>
        <li>Automation of routine tasks saved over 200 hours of work</li>
        <li>Employee dissatisfaction with pay improved — satisfaction with recognition rose from 4.4/10 to 9/10</li>
        <li>An employee showing signs of burnout (2.8/10) improved to 8.8/10 and decided to stay</li>
        <li>Trust rebuilt between employees and leadership through transparent communication</li>
      </ul>
    `,
    content_cz: `
      <h2>Problém</h2>
      <p>Valxon, rostoucí B2B firma specializující se na reklamní předměty na míru, čelila po změně vedení významným interním výzvám. Zaměstnanci vyjadřovali rostoucí nespokojenost — cítili se přetížení, frustrovaní a nedostatečně ohodnocení kvůli stále chaotičtějšímu pracovnímu prostředí. Nejasné priority, vysoká míra stresu a nedostatek strukturované komunikace vedly k poklesu důvěry ve vedení.</p>

      <h2>Řešení</h2>
      <p>Když nastoupil nový CEO Karel Poplstein, chtěl interní problémy řešit v jejich jádru. Proto se obrátil na Behavera Engagement. Výsledky nejen potvrdily jeho obavy, ale také odhalily, že zaměstnanci nejsou nezapojení — návratnost prvního kola byla 100 % — ale chyběly jim správné podmínky pro efektivní práci.</p>
      <blockquote>"Behavera nám ukázala, že lidé neztratili zájem — jen potřebovali lepší podmínky." — Karel Poplstein, CEO Valxon</blockquote>
      <p>Na základě těchto poznatků přijalo vedení Valxonu strukturovaná opatření:</p>
      <ul>
        <li>Vyjasnění rolí a zodpovědností</li>
        <li>Návrh strukturovaných obchodních procesů</li>
        <li>Automatizace manuálních workflow</li>
        <li>Zavedení OKRs propojených s individuálními KPI</li>
        <li>Pravidelné check-iny a stand-upy</li>
        <li>Transparentní sdílení výsledků engagementu</li>
      </ul>

      <h2>Výsledky</h2>
      <p>Valxon se zavázal ke zlepšení pracovních podmínek zaměstnanců a stanovil si cíl zvýšit well-being index skóre z 6,5 na 8,2 do konce Q1. Do konce Q2 skóre dosáhlo 9/10 bodů!</p>
      <ul>
        <li>Automatizace rutinních úkolů ušetřila přes 200 hodin práce</li>
        <li>Nespokojenost s platem se zlepšila — spokojenost s uznáním vzrostla ze 4,4/10 na 9/10</li>
        <li>Zaměstnanec vykazující známky burnoutu (2,8/10) se zlepšil na 8,8/10 a rozhodl se zůstat</li>
        <li>Důvěra mezi zaměstnanci a vedením obnovena díky transparentní komunikaci</li>
      </ul>
    `,
    coverImage: 'https://cdn.prod.website-files.com/63d2c5297fe3f5119d5e8eba/67c9b914d0abe99293d51d3b_Karel%20Valxon%202.jpeg',
    tags: ['Engagement', 'Compensation', 'Retention'],
    employeeCount: '30+',
    publishedAt: new Date('2024-04-01').toISOString(),
    status: 'published'
  },
  {
    id: '2',
    title: 'How Vodafone Boosted Performance and Retention Through Data-Driven Talent Management',
    title_cz: 'Jak Vodafone zvýšil výkon a retenci díky datově řízenému talent managementu',
    slug: 'from-data-to-action-how-vodafone-increased-sales-by-80-and-cut-attrition-by-40',
    clientName: 'Vodafone Czech Republic',
    industry: 'Telecommunications',
    industry_cz: 'Telekomunikace',
    challenge: 'Vodafone faced high employee turnover, inconsistent sales and customer care performance, unclear success profiles, and uncertainty about which skills and competencies to invest in to maximize employee success and retention.',
    challenge_cz: 'Vodafone čelil vysoké fluktuaci zaměstnanců, nekonzistentnímu výkonu v prodeji a péči o zákazníky, nejasným profilům úspěšnosti a nejistotě, do jakých dovedností a kompetencí investovat pro maximalizaci úspěchu a retence.',
    solution: 'Key performance blockers such as low motivation and ineffective coaching revealed themselves. Vodafone responded by identifying ideal profiles for sales and customer care roles and implementing tailored hiring, coaching, and development plans to better support and retain employees.',
    solution_cz: 'Klíčové blokátory výkonu, jako nízká motivace a neefektivní koučink, se odhalily. Vodafone reagoval identifikací ideálních profilů pro obchodní a zákaznické role a implementací cíleného náboru, koučinku a rozvojových plánů.',
    results: [
      { label: 'Improvement in first call resolution', value: '5%' },
      { label: 'Increase in revenue per call', value: '70-80%' },
      { label: 'Increase in employee retention', value: '40%' }
    ],
    results_cz: [
      { label: 'Zlepšení vyřešení na první hovor', value: '5%' },
      { label: 'Nárůst tržeb na hovor', value: '70-80%' },
      { label: 'Zvýšení retence zaměstnanců', value: '40%' }
    ],
    cardSummary: 'Vodafone partnered with Behavera to identify ideal employee profiles. The result: 40% lower turnover, 70-80% higher revenue per call, and a data-driven approach to talent that transformed their customer care.',
    cardSummary_cz: 'Vodafone ve spolupráci s Behaverou identifikoval ideální profily zaměstnanců. Výsledek: o 40 % nižší fluktuace, o 70–80 % vyšší tržby na hovor a datově řízený přístup k talentu, který proměnil péči o zákazníky.',
    content: `
      <h2>Problem</h2>
      <p>Vodafone Czech Republic, a leader in telecommunications, faced a significant challenge: high employee turnover and inconsistent performance among its sales and customer care staff. Despite being known for excellent customer service, Vodafone struggled to align workforce potential with business needs. The company needed to identify the ideal profile for its Customer Care Expert role, understand what distinguished top performers, and improve employee retention.</p>

      <h2>Solution</h2>
      <p>To tackle these challenges, Vodafone partnered with Behavera, a people-first platform that leverages advanced behavioral assessments to uncover employee needs and potential. The collaboration began with a simulation game designed to evaluate employees' natural work styles and competencies, alongside chatbot-driven test that assessed engagement, motivation, and work-culture preferences. Data from 120 retail employees was collected and analyzed, providing valuable insights against Vodafone's key performance indicators (KPIs).</p>
      <p>The findings revealed significant performance blockers, including gaps in motivation and ineffective coaching strategies. Based on these insights, Vodafone identified ideal work-culture profiles for both sales and customer care roles. This allowed them to create tailored competency development plans, ensuring that employees received the support they needed to excel.</p>
      <blockquote>"Behavera nám pomohla předpovědět, kdo bude ve které roli úspěšný — a proč." — Ředitel Call Centra, Vodafone CZ</blockquote>

      <h2>Results</h2>
      <p>Vodafone's data-driven approach delivered impressive results:</p>
      <ul>
        <li>40% Reduction in Employee Turnover</li>
        <li>70-80% Increase in Revenue per Call</li>
        <li>5% Improvement in First Call Resolution (FCR)</li>
        <li>96% Participation in Well-Being Assessments</li>
        <li>8-Point Increase in Employee Engagement Scores</li>
      </ul>
    `,
    content_cz: `
      <h2>Problém</h2>
      <p>Vodafone Czech Republic, lídr v telekomunikacích, čelil významnému problému: vysoké fluktuaci zaměstnanců a nekonzistentnímu výkonu obchodního a zákaznického personálu. Přestože je Vodafone známý vynikající zákaznickou péčí, firma měla problém sladit potenciál pracovní síly s obchodními potřebami. Potřebovala identifikovat ideální profil pro roli Customer Care Expert, pochopit, co odlišuje top výkony, a zlepšit retenci zaměstnanců.</p>

      <h2>Řešení</h2>
      <p>Pro řešení těchto výzev navázal Vodafone spolupráci s Behaverou — platformou zaměřenou na lidi, která využívá pokročilé behaviorální hodnocení k odhalení potřeb a potenciálu zaměstnanců. Spolupráce začala simulační hrou hodnotící přirozené pracovní styly a kompetence zaměstnanců, spolu s chatbot testem měřícím engagement, motivaci a preference pracovní kultury. Data od 120 retailových zaměstnanců byla sesbírána a analyzována oproti klíčovým ukazatelům výkonu (KPI) Vodafonu.</p>
      <p>Zjištění odhalila významné blokátory výkonu, včetně mezer v motivaci a neefektivních koučovacích strategií. Na základě těchto poznatků Vodafone identifikoval ideální profily pracovní kultury pro obchodní i zákaznické role a vytvořil cílené kompetencní rozvojové plány.</p>
      <blockquote>"Behavera nám pomohla předpovědět, kdo bude ve které roli úspěšný — a proč." — Ředitel Call Centra, Vodafone CZ</blockquote>

      <h2>Výsledky</h2>
      <p>Datově řízený přístup Vodafonu přinesl působivé výsledky:</p>
      <ul>
        <li>40% snížení fluktuace zaměstnanců</li>
        <li>70–80% nárůst tržeb na hovor</li>
        <li>5% zlepšení vyřešení na první hovor (FCR)</li>
        <li>96% účast v hodnocení well-beingu</li>
        <li>8bodový nárůst skóre engagementu zaměstnanců</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
    tags: ['Retention', 'Productivity', 'Development'],
    employeeCount: '1,500+',
    publishedAt: new Date('2024-03-10').toISOString(),
    status: 'published'
  },
  {
    id: '3',
    title: "How Behavera's Data Helped 365.bank Achieve a Successful Digital Transformation",
    title_cz: 'Jak data od Behavery pomohla 365.bank k úspěšné digitální transformaci',
    slug: 'how-behaveras-data-helped-365-bank-achieve-a-successful-digital-transformation',
    clientName: '365.bank',
    industry: 'Banking',
    industry_cz: 'Bankovnictví',
    challenge: "Bank's transformation into a fully digital organization demanded a complete cultural and leadership shift — yet traditional hiring and promotion methods couldn't reliably identify the right people to drive that change.",
    challenge_cz: 'Transformace banky na plně digitální organizaci vyžadovala kompletní kulturní a manažerskou změnu — tradiční metody náboru a povyšování ale nedokázaly spolehlivě identifikovat správné lidi pro tuto změnu.',
    solution: "365.bank data-driven approach revealed how people actually work, helping them identify the right talent, support leadership development, and align teams with the new company culture.",
    solution_cz: 'Datově řízený přístup 365.bank odhalil, jak lidé skutečně pracují, a pomohl identifikovat správné talenty, podpořit rozvoj leadershipu a sladit týmy s novou firemní kulturou.',
    results: [
      { label: 'Reduced employee turnover', value: '14%' },
      { label: 'Faster hiring process', value: '36%' },
      { label: 'Higher employee productivity', value: '20%' }
    ],
    results_cz: [
      { label: 'Snížení fluktuace zaměstnanců', value: '14%' },
      { label: 'Rychlejší náborový proces', value: '36%' },
      { label: 'Vyšší produktivita zaměstnanců', value: '20%' }
    ],
    cardSummary: '365.bank used Behavera\'s assessments to power their digital transformation with data-driven hiring and leadership selection. The result: 14% lower turnover, 36% faster hiring, and promotions based on real capability.',
    cardSummary_cz: '365.bank využila hodnocení od Behavery k podpoře digitální transformace datově řízeným náborem a výběrem leaderů. Výsledek: o 14 % nižší fluktuace, o 36 % rychlejší nábor a povýšení na základě skutečných schopností.',
    content: `
      <h2>Problem</h2>
      <p>The transition from Post Bank to the fully digital 365.bank was not just a rebranding — it required a fundamental shift in mindset, culture, and leadership. The bank faced several key risks: hiring the wrong people, unclear leadership capabilities, misalignment of the team with the new culture, and increased hiring risks due to remote selection.</p>

      <h2>Solution</h2>
      <p>To enable clear, data-driven hiring and promotion decisions, 365.bank implemented Behavera's assessment tools. Instead of relying on what candidates and managers said about themselves, the bank now had objective data on actual workplace behavior.</p>
      <p>The results gave the HR department and leadership a clear overview of which employees were the best fit for their roles, ready to lead through the transformation, and a cultural fit for the new bank. Where gaps were identified, the bank adjusted onboarding, training, and internal mobility programs to address them.</p>
      <blockquote>"Díky Behaveře jsme dokázali objektivně posoudit, kdo je schopen vést změnu — a kdo potřebuje podporu." — Nina Juríková, HR Konzultantka, 365.bank</blockquote>

      <h2>Result</h2>
      <p>By shifting to behavior-based hiring and leadership selection, 365.bank saw immediate improvements:</p>
      <ul>
        <li>100% data-driven hiring and promotions — Stronger hiring decisions based on proven skills and cultural fit</li>
        <li>Leadership aligned with transformation — Only leaders with the ability to drive change were promoted</li>
        <li>Faster cultural adaptation — Early identification of resistance points enabled proactive support</li>
        <li>Significantly reduced hiring risks — Better role fit, smoother onboarding, and lower turnover</li>
      </ul>
    `,
    content_cz: `
      <h2>Problém</h2>
      <p>Přechod z Poštovní banky na plně digitální 365.bank nebyl jen rebrandingem — vyžadoval zásadní změnu myšlení, kultury a leadershipu. Banka čelila několika klíčovým rizikům: nábor nevhodných lidí, nejasné manažerské schopnosti, nesoulad týmu s novou kulturou a zvýšená rizikovost náboru kvůli vzdálenému výběru.</p>

      <h2>Řešení</h2>
      <p>Pro umožnění jasných, datově řízených rozhodnutí o náboru a povýšení implementovala 365.bank hodnotící nástroje Behavery. Namísto spoléhání na to, co kandidáti a manažeři říkali sami o sobě, měla banka nyní objektivní data o skutečném chování na pracovišti.</p>
      <p>Výsledky daly HR oddělení a vedení jasný přehled o tom, kteří zaměstnanci jsou pro své role nejvhodnější, připraveni vést transformaci a kulturně sedí k nové bance. Tam, kde byly identifikovány mezery, banka upravila onboarding, školení a programy interní mobility.</p>
      <blockquote>"Díky Behaveře jsme dokázali objektivně posoudit, kdo je schopen vést změnu — a kdo potřebuje podporu." — Nina Juríková, HR Konzultantka, 365.bank</blockquote>

      <h2>Výsledky</h2>
      <p>Přechodem na behaviorální nábor a výběr leaderů zaznamenala 365.bank okamžitá zlepšení:</p>
      <ul>
        <li>100% datově řízený nábor a povýšení — silnější rozhodnutí založená na prokázaných dovednostech a kulturní shodě</li>
        <li>Leadership sladěný s transformací — povýšeni byli pouze lídři schopní řídit změnu</li>
        <li>Rychlejší kulturní adaptace — včasná identifikace bodů odporu umožnila proaktivní podporu</li>
        <li>Výrazně snížená rizikovost náboru — lepší role-fit, plynulejší onboarding a nižší fluktuace</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    tags: ['Culture', 'Turnover', 'Leadership'],
    employeeCount: '400+',
    publishedAt: new Date('2024-02-05').toISOString(),
    status: 'published'
  }
];

// Service Layer
export const CmsService = {
  // ═══════════ Blog Posts ═══════════

  /** Public: returns only published posts (Supabase → fallback to static) */
  getPosts: async (): Promise<BlogPost[]> => {
    if (!supabaseClient) {
      return [...DEFAULT_POSTS].filter(p => p.status === 'published');
    }

    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const rows = (data as PostRow[] | null) || [];
      const dbPosts = rows
        .filter(r => r && r.title && r.slug)
        .map(mapPostRow);

      // Merge: DB posts take priority (by slug), then fill with DEFAULT_POSTS
      const dbSlugs = new Set(dbPosts.map(p => p.slug));
      const staticPosts = DEFAULT_POSTS
        .filter(p => p.status === 'published' && !dbSlugs.has(p.slug));

      return [...dbPosts, ...staticPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (err) {
      console.error('Error fetching posts:', err);
      return [...DEFAULT_POSTS].filter(p => p.status === 'published');
    }
  },

  /** Admin: returns ALL posts (drafts + published) */
  getAllPosts: async (): Promise<BlogPost[]> => {
    if (!supabaseClient) {
      return [...DEFAULT_POSTS];
    }

    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const rows = (data as PostRow[] | null) || [];
      const dbPosts = rows
        .filter(r => r && r.title && r.slug)
        .map(mapPostRow);

      const dbSlugs = new Set(dbPosts.map(p => p.slug));
      const staticPosts = DEFAULT_POSTS.filter(p => !dbSlugs.has(p.slug));

      return [...dbPosts, ...staticPosts].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (err) {
      console.error('Error fetching all posts:', err);
      return [...DEFAULT_POSTS];
    }
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    if (!supabaseClient) {
      return DEFAULT_POSTS.find(p => p.slug === slug);
    }

    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .eq('slug', slug)
        .single();

      if (error) {
        // Not found in DB — try static fallback
        if (error.code === 'PGRST116') {
          return DEFAULT_POSTS.find(p => p.slug === slug);
        }
        throw error;
      }

      return mapPostRow(data as PostRow);
    } catch (err) {
      console.error('Error fetching post by slug:', err);
      return DEFAULT_POSTS.find(p => p.slug === slug);
    }
  },

  getPostById: async (id: string): Promise<BlogPost | undefined> => {
    if (!supabaseClient) {
      return DEFAULT_POSTS.find(p => p.id === id);
    }

    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return DEFAULT_POSTS.find(p => p.id === id);
        }
        throw error;
      }

      return mapPostRow(data as PostRow);
    } catch (err) {
      console.error('Error fetching post by id:', err);
      return DEFAULT_POSTS.find(p => p.id === id);
    }
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'author' | 'publishedAt'>): Promise<BlogPost> => {
    if (!supabaseClient) {
      const newPost: BlogPost = {
        ...post,
        id: Math.random().toString(36).substr(2, 9),
        author: DEFAULT_AUTHORS[0],
        publishedAt: new Date().toISOString(),
        conversionPrimary: post.conversionPrimary ?? 'balanced',
      };
      DEFAULT_POSTS.push(newPost);
      return newPost;
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .insert([{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          cover_image: post.coverImage,
          tags: post.tags,
          status: post.status,
          published_at: new Date().toISOString(),
          title_cz: post.title_cz || null,
          excerpt_cz: post.excerpt_cz || null,
          content_cz: post.content_cz || null,
        }])
        .select('*, authors(*)')
        .single();
      
      if (error) throw error;

      return mapPostRow(data as PostRow);
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  },
  
  updatePost: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
    if (!supabaseClient) {
      const index = DEFAULT_POSTS.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Post not found");
      DEFAULT_POSTS[index] = { ...DEFAULT_POSTS[index], ...updates };
      return DEFAULT_POSTS[index];
    }

    try {
      const payload: Record<string, unknown> = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.excerpt !== undefined) payload.excerpt = updates.excerpt;
      if (updates.content !== undefined) payload.content = updates.content;
      if (updates.coverImage !== undefined) payload.cover_image = updates.coverImage;
      if (updates.tags !== undefined) payload.tags = updates.tags;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.title_cz !== undefined) payload.title_cz = updates.title_cz;
      if (updates.excerpt_cz !== undefined) payload.excerpt_cz = updates.excerpt_cz;
      if (updates.content_cz !== undefined) payload.content_cz = updates.content_cz;

      const { data, error } = await supabaseClient
        .from('posts')
        .update(payload)
        .eq('id', id)
        .select('*, authors(*)')
        .single();

      if (!error && data) {
        return mapPostRow(data as PostRow);
      }
      if (error && !isNoRowsError(error)) {
        throw error;
      }

      // Fallback path: editing static seed content (id not present in DB yet).
      const seedPost =
        DEFAULT_POSTS.find(p => p.id === id) ||
        (updates.slug ? DEFAULT_POSTS.find(p => p.slug === updates.slug) : undefined);
      const slug = updates.slug ?? seedPost?.slug;
      if (!slug) {
        throw error || new Error('Post not found in database and slug is missing.');
      }

      const { data: bySlugData, error: bySlugError } = await supabaseClient
        .from('posts')
        .update(payload)
        .eq('slug', slug)
        .select('*, authors(*)')
        .single();

      if (!bySlugError && bySlugData) {
        return mapPostRow(bySlugData as PostRow);
      }
      if (bySlugError && !isNoRowsError(bySlugError)) {
        throw bySlugError;
      }

      const title = updates.title ?? seedPost?.title;
      if (!title) {
        throw new Error('Unable to create post override: title is missing.');
      }

      const insertPayload = {
        title,
        slug,
        excerpt: updates.excerpt ?? seedPost?.excerpt ?? '',
        content: updates.content ?? seedPost?.content ?? '',
        cover_image: updates.coverImage ?? seedPost?.coverImage ?? null,
        tags: updates.tags ?? seedPost?.tags ?? [],
        status: updates.status ?? seedPost?.status ?? 'draft',
        published_at: seedPost?.publishedAt ?? new Date().toISOString(),
        title_cz: updates.title_cz ?? seedPost?.title_cz ?? null,
        excerpt_cz: updates.excerpt_cz ?? seedPost?.excerpt_cz ?? null,
        content_cz: updates.content_cz ?? seedPost?.content_cz ?? null,
      };

      const { data: insertedData, error: insertError } = await supabaseClient
        .from('posts')
        .insert([insertPayload])
        .select('*, authors(*)')
        .single();

      if (insertError) throw insertError;
      return mapPostRow(insertedData as PostRow);
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  },

  deletePost: async (id: string): Promise<void> => {
    if (!supabaseClient) {
      const index = DEFAULT_POSTS.findIndex(p => p.id === id);
      if (index !== -1) DEFAULT_POSTS.splice(index, 1);
      return;
    }
    
    try {
      const { error } = await supabaseClient
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting post:', err);
      throw err;
    }
  },

  // ═══════════ Case Studies ═══════════

  /** Public: returns only published case studies */
  getCaseStudies: async (): Promise<CaseStudy[]> => {
    if (!supabaseClient) {
      return getMergedCaseStudies().filter(s => s.status === 'published');
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      const rows = (data as CaseStudyRow[] | null) || [];
      const studies = rows
        .filter((study) => study && study.title && study.slug)
        .map(mapCaseStudyRow);
      // Fall back to hardcoded case studies when Supabase returns empty
      return studies.length > 0 ? studies : getMergedCaseStudies().filter(s => s.status === 'published');
    } catch (err) {
      console.error('Error fetching case studies:', err);
      return getMergedCaseStudies().filter(s => s.status === 'published');
    }
  },

  /** Admin: returns ALL case studies (drafts + published) */
  getAllCaseStudies: async (): Promise<CaseStudy[]> => {
    if (!supabaseClient) {
      return getMergedCaseStudies();
    }

    try {
      const { data, error } = await supabaseClient
        .from('case_studies')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const rows = (data as CaseStudyRow[] | null) || [];
      const studies = rows
        .filter((study) => study && study.title && study.slug)
        .map(mapCaseStudyRow);
      return studies.length > 0 ? studies : getMergedCaseStudies();
    } catch (err) {
      console.error('Error fetching all case studies:', err);
      return getMergedCaseStudies();
    }
  },

  getCaseStudyBySlug: async (slug: string): Promise<CaseStudy | undefined> => {
    if (!supabaseClient) return getMergedCaseStudies().find(c => c.slug === slug);
    
    try {
      const { data, error } = await supabaseClient
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      if (!data || !data.title || !data.slug) return undefined;
      return mapCaseStudyRow(data as CaseStudyRow);
    } catch (err) {
      console.error('Error fetching case study:', err);
      return getMergedCaseStudies().find(c => c.slug === slug);
    }
  },

  getCaseStudyById: async (id: string): Promise<CaseStudy | undefined> => {
    if (!supabaseClient) return getMergedCaseStudies().find(c => c.id === id);

    try {
      const { data, error } = await supabaseClient
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return undefined;
      return mapCaseStudyRow(data as CaseStudyRow);
    } catch (err) {
      console.error('Error fetching case study by id:', err);
      return getMergedCaseStudies().find(c => c.id === id);
    }
  },
  
  createCaseStudy: async (study: Omit<CaseStudy, 'id' | 'publishedAt'>): Promise<CaseStudy> => {
    if (!supabaseClient) {
      const newStudy: CaseStudy = {
        ...study,
        id: 'cs_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5),
        publishedAt: new Date().toISOString()
      };
      const all = loadLocalCaseStudies();
      all.push(newStudy);
      saveLocalCaseStudies(all);
      return newStudy;
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('case_studies')
        .insert([{
          title: study.title,
          slug: study.slug,
          client_name: study.clientName,
          industry: study.industry,
          challenge: study.challenge,
          solution: study.solution,
          results: study.results,
          content: study.content,
          cover_image: study.coverImage,
          status: study.status,
          published_at: new Date().toISOString(),
          title_cz: study.title_cz || null,
          challenge_cz: study.challenge_cz || null,
          solution_cz: study.solution_cz || null,
          content_cz: study.content_cz || null,
          industry_cz: study.industry_cz || null,
          card_summary: study.cardSummary || null,
          card_summary_cz: study.cardSummary_cz || null,
        }])
        .select('*')
        .single();
      
      if (error) throw error;
      
      return mapCaseStudyRow(data as CaseStudyRow);
    } catch (err) {
      console.error('Error creating case study:', err);
      throw err;
    }
  },

  updateCaseStudy: async (id: string, updates: Partial<CaseStudy>): Promise<CaseStudy> => {
    if (!supabaseClient) {
      // Check localStorage first
      const local = loadLocalCaseStudies();
      const localIdx = local.findIndex(s => s.id === id);
      if (localIdx !== -1) {
        local[localIdx] = { ...local[localIdx], ...updates };
        saveLocalCaseStudies(local);
        return local[localIdx];
      }
      // If it's a mock item, copy to localStorage with updates
      const mock = DEFAULT_CASE_STUDIES.find(s => s.id === id);
      if (mock) {
        const updated = { ...mock, ...updates };
        local.push(updated);
        saveLocalCaseStudies(local);
        return updated;
      }
      throw new Error('Case study not found');
    }

    try {
      const payload: Record<string, unknown> = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.slug !== undefined) payload.slug = updates.slug;
      if (updates.clientName !== undefined) payload.client_name = updates.clientName;
      if (updates.industry !== undefined) payload.industry = updates.industry;
      if (updates.challenge !== undefined) payload.challenge = updates.challenge;
      if (updates.solution !== undefined) payload.solution = updates.solution;
      if (updates.results !== undefined) payload.results = updates.results;
      if (updates.content !== undefined) payload.content = updates.content;
      if (updates.coverImage !== undefined) payload.cover_image = updates.coverImage;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.title_cz !== undefined) payload.title_cz = updates.title_cz;
      if (updates.challenge_cz !== undefined) payload.challenge_cz = updates.challenge_cz;
      if (updates.solution_cz !== undefined) payload.solution_cz = updates.solution_cz;
      if (updates.content_cz !== undefined) payload.content_cz = updates.content_cz;
      if (updates.industry_cz !== undefined) payload.industry_cz = updates.industry_cz;
      if (updates.cardSummary !== undefined) payload.card_summary = updates.cardSummary;
      if (updates.cardSummary_cz !== undefined) payload.card_summary_cz = updates.cardSummary_cz;

      const { data, error } = await supabaseClient
        .from('case_studies')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (!error && data) {
        return mapCaseStudyRow(data as CaseStudyRow);
      }
      if (error && !isNoRowsError(error)) {
        throw error;
      }

      // Fallback path: editing static seed content (id not present in DB yet).
      const seedCaseStudy =
        DEFAULT_CASE_STUDIES.find(s => s.id === id) ||
        (updates.slug ? DEFAULT_CASE_STUDIES.find(s => s.slug === updates.slug) : undefined);
      const slug = updates.slug ?? seedCaseStudy?.slug;
      if (!slug) {
        throw error || new Error('Case study not found in database and slug is missing.');
      }

      const { data: bySlugData, error: bySlugError } = await supabaseClient
        .from('case_studies')
        .update(payload)
        .eq('slug', slug)
        .select('*')
        .single();

      if (!bySlugError && bySlugData) {
        return mapCaseStudyRow(bySlugData as CaseStudyRow);
      }
      if (bySlugError && !isNoRowsError(bySlugError)) {
        throw bySlugError;
      }

      const title = updates.title ?? seedCaseStudy?.title;
      if (!title) {
        throw new Error('Unable to create case study override: title is missing.');
      }

      const insertPayload = {
        title,
        slug,
        client_name: updates.clientName ?? seedCaseStudy?.clientName ?? null,
        industry: updates.industry ?? seedCaseStudy?.industry ?? null,
        challenge: updates.challenge ?? seedCaseStudy?.challenge ?? null,
        solution: updates.solution ?? seedCaseStudy?.solution ?? null,
        results: updates.results ?? seedCaseStudy?.results ?? [],
        content: updates.content ?? seedCaseStudy?.content ?? '',
        cover_image: updates.coverImage ?? seedCaseStudy?.coverImage ?? null,
        status: updates.status ?? seedCaseStudy?.status ?? 'draft',
        published_at: seedCaseStudy?.publishedAt ?? new Date().toISOString(),
        title_cz: updates.title_cz ?? seedCaseStudy?.title_cz ?? null,
        challenge_cz: updates.challenge_cz ?? seedCaseStudy?.challenge_cz ?? null,
        solution_cz: updates.solution_cz ?? seedCaseStudy?.solution_cz ?? null,
        content_cz: updates.content_cz ?? seedCaseStudy?.content_cz ?? null,
        industry_cz: updates.industry_cz ?? seedCaseStudy?.industry_cz ?? null,
        card_summary: updates.cardSummary ?? seedCaseStudy?.cardSummary ?? null,
        card_summary_cz: updates.cardSummary_cz ?? seedCaseStudy?.cardSummary_cz ?? null,
      };

      const { data: insertedData, error: insertError } = await supabaseClient
        .from('case_studies')
        .insert([insertPayload])
        .select('*')
        .single();

      if (insertError) throw insertError;
      return mapCaseStudyRow(insertedData as CaseStudyRow);
    } catch (err) {
      console.error('Error updating case study:', err);
      throw err;
    }
  },

  deleteCaseStudy: async (id: string): Promise<void> => {
    if (!supabaseClient) {
      const local = loadLocalCaseStudies();
      const filtered = local.filter(s => s.id !== id);
      saveLocalCaseStudies(filtered);
      // Note: mock entries reappear on reload unless overridden.
      // Add a "deleted" marker for mock items.
      const isDefault = DEFAULT_CASE_STUDIES.some(s => s.id === id);
      if (isDefault) {
        const deleted = JSON.parse(localStorage.getItem('behavera_deleted_cs') || '[]') as string[];
        if (!deleted.includes(id)) {
          deleted.push(id);
          localStorage.setItem('behavera_deleted_cs', JSON.stringify(deleted));
        }
      }
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting case study:', err);
      throw err;
    }
  },

  // Auth is handled by Supabase Auth via auth-context.tsx
};
