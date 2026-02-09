import { BlogPost, CaseStudy, Author } from './types';
import { supabase as supabaseClient } from './supabase';
import { adminEnabled } from './config';

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
};

// Supabase client is imported from shared module

const resolveAuthor = (row?: AuthorRow | null): Author => {
  if (!row) return MOCK_AUTHORS[0];
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
  status: row.status
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
  status: row.status
});

// Mock Data
const MOCK_AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    role: 'HR Specialist'
  },
  {
    id: '2',
    name: 'John Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    role: 'Data Analyst'
  }
];

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Why "Quiet Quitting" is a Management Failure',
    slug: 'quiet-quitting-management-failure',
    excerpt: 'It is not about lazy employees. It is about leadership blindness. Here is what the data says.',
    content: '<p>Quiet quitting has become a buzzword, but the reality is much simpler...</p>',
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000',
    author: MOCK_AUTHORS[0],
    publishedAt: new Date().toISOString(),
    tags: ['Leadership', 'Retention', 'Data'],
    status: 'published'
  },
  {
    id: '2',
    title: '5 Signals Before an Employee Resigns',
    slug: '5-signals-before-resignation',
    excerpt: 'Most resignations are preventable if you catch the early warning signs.',
    content: '<p>Turnover is expensive. But it rarely happens overnight...</p>',
    coverImage: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&q=80&w=1000',
    author: MOCK_AUTHORS[1],
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    tags: ['Turnover', 'HR Tech'],
    status: 'published'
  }
];

const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Objevený potenciál otevřel nejen Expandu nové obchodní příležitosti',
    slug: 'discovered-potential-led-to-new-business-opportunities',
    clientName: 'Expando',
    industry: 'E-commerce',
    challenge: 'Ve firmě Expando díky Engagementu od Behavery zjistili, že zaměstnancům chybí motivace a příležitosti k růstu.',
    solution: 'Dali příležitost talentované zaměstnankyni – a ona rozproudila obchod na novém marketplace.',
    results: [
      { label: 'Navýšení prodejů', value: '14.5%' },
      { label: 'Aktivace klientů', value: '+18%' },
      { label: 'Nárůst tržeb klienta', value: '37%' },
      { label: 'Úspora času HR', value: '40 hodin/měsíc' }
    ],
    content: `
      <h2>Problém</h2>
      <p>Expando stálo před výzvou více rozvíjet trhy mimo Amazon. Chtěli pomoct klientům růst i jinde, ale zároveň cítili, že uvnitř firmy to nefunguje jak by mělo – lidé ztráceli chuť do práce, přibývalo stížností na chaos a chyběl impuls, který by vrátil směr.</p>
      <p>Přestože tým vynakládal úsilí na identifikaci příčin problému, jejich interní analýzy byly příliš časově náročné, založené na subjektivních dojmech a často vedly k chybným závěrům.</p>

      <h2>Řešení</h2>
      <p>Díky společnosti Behavera získala společnost Expando poprvé objektivní představu o výzvách, kterým čelí. Analýza pomocí cíleného dotazníku Echo Pulse odhalila, že mezi klíčové problémy patří nejen neefektivní komunikaci uvnitř týmů i mezi nimi a nedostatek uznání, ale také nízká motivace zaměstnanců a omezené příležitosti k růstu.</p>
      <p>U zaměstnanců, kteří se cítili zaseknutí a demotivovaní, protože nemohli naplno využít svůj potenciál, identifikovali expertní role. Například v týmu Account Management posunuli zaměstnankyni do expertní role Key Account Manager pro nový marketplace Kaufland.</p>

      <h2>Výsledek</h2>
      <p>Do tří měsíců se zlepšila vnitrofiremní spolupráce díky pravidelné výměně informací, jasným cílům a definování sady procesů. Jedním z klíčových úspěchů byl výrazný rozvoj marketplace Kaufland – zaměstnankyně aktivovala o 18 % více klientů a navýšila celkový objem prodejů o 14,5 % za 8 měsíců.</p>
      <p>HR navíc ušetřilo 40 hodin měsíčně díky automatizaci zpětné vazby.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2024-01-15').toISOString(),
    status: 'published'
  },
  {
    id: '2',
    title: 'Jak Vodafone zvýšil performance a udržel si své talenty díky datům',
    slug: 'from-data-to-action-how-vodafone-increased-sales-by-80-and-cut-attrition-by-40',
    clientName: 'Vodafone Czech Republic',
    industry: 'Telecommunications',
    challenge: 'Vodafone Czech Republic čelil vysoké fluktuaci a kolísajícím výsledkům prodeje i zákaznické péče.',
    solution: 'Implementovali behaviorální assessmenty od Behavery k odhalení potřeb a potenciálu zaměstnanců.',
    results: [
      { label: 'Snížení fluktuace', value: '40%' },
      { label: 'Nárůst příjmů za hovor', value: '70-80%' },
      { label: 'Zlepšení FCR', value: '5%' },
      { label: 'Účast na assessmentech', value: '96%' }
    ],
    content: `
      <h2>Problém</h2>
      <p>Společnost Vodafone Czech Republic se potýkala s významným problémem: vysokou fluktuací zaměstnanců a nekonzistentním výkonem prodejců a pracovníků péče o zákazníky. Potřebovali identifikovat ideální profil pro pozici odborníka na péči o zákazníky a pochopit, čím se vyznačují nejlepší pracovníci.</p>

      <h2>Řešení</h2>
      <p>Vodafone navázal spolupráci s platformou Behavera, která využívá pokročilé behaviorální assessmenty. Byla shromážděna a analyzována data od 120 zaměstnanců maloobchodu. Zjištění odhalila významné překážky výkonu, včetně nedostatků v motivaci a neúčinných strategií koučování.</p>
      <p>Na základě těchto poznatků Vodafone identifikoval ideální profily pracovní kultury pro pozice v oblasti prodeje i péče o zákazníky a vytvořil na míru šité plány rozvoje kompetencí.</p>

      <h2>Výsledky</h2>
      <p>Přístup založený na datech přinesl působivé výsledky:</p>
      <ul>
        <li>Snížení fluktuace zaměstnanců o 40 %</li>
        <li>70-80% nárůst příjmů za hovor</li>
        <li>5 % zlepšení vyřešení problému během prvního hovoru (FCR)</li>
        <li>96 % účast na assessmentech well-being</li>
        <li>Zvýšení skóre angažovanosti zaměstnanců o 8 bodů</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2024-02-10').toISOString(),
    status: 'published'
  },
  {
    id: '3',
    title: 'Jak data společnosti Behavera pomohla 365.bank dosáhnout úspěšné digitální transformace',
    slug: 'how-behaveras-data-helped-365-bank-achieve-a-successful-digital-transformation',
    clientName: '365.bank',
    industry: 'Banking',
    challenge: 'Při rebrandingu z Poštová banka na 365.bank bylo třeba vybudovat stabilní týmy, vybrat správné vedoucí a zajistit kulturní soulad s novou digitální strategií.',
    solution: 'Implementovali assessmenty od Behavery pro nábor a výběr vedoucích pracovníků založený na datech.',
    results: [
      { label: 'Nábor založený na datech', value: '100%' },
      { label: 'Vedení v souladu s transformací', value: '✓' },
      { label: 'Rychlejší kulturní adaptace', value: '✓' },
      { label: 'Snížení rizik při náboru', value: '✓' }
    ],
    content: `
      <h2>Problém</h2>
      <p>Přechod z Post Bank na plně digitální 365.bank vyžadoval zásadní změnu myšlení, kultury a vedení. Banka čelila několika klíčovým rizikům včetně najímání nesprávných lidí, nejasných schopností vedení a nesouladu týmu s novou kulturou.</p>

      <h2>Řešení</h2>
      <p>365.bank implementovala hodnotící nástroje společnosti Behavera - simulační hru The Office Day pro posouzení kompetencí a chatbot pro měření kulturní shody. Místo spoléhání na to, co kandidáti říkají, měli nyní k dispozici objektivní údaje o skutečném chování na pracovišti.</p>

      <h2>Výsledek</h2>
      <p>Přechodem na najímání a výběr vedoucích pracovníků na základě chování zaznamenali okamžité zlepšení:</p>
      <ul>
        <li>100% rozhodování o přijetí a povýšení na základě dat</li>
        <li>Vedení v souladu s transformací - povýšeni pouze schopní řídit změny</li>
        <li>Rychlejší kulturní adaptace díky včasné identifikaci bodů odporu</li>
        <li>Výrazné snížení rizik při náboru</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2024-03-05').toISOString(),
    status: 'published'
  },
  {
    id: '4',
    title: 'Více než peníze: Jak Valxon podpořil lidi i business v době změn',
    slug: 'more-than-money-what-truly-drives-engagement-in-times-of-change',
    clientName: 'Valxon',
    industry: 'B2B',
    challenge: 'Nový leadership Valxonu čelil vlně stížností a chaosu. Zaměstnanci se cítili přepracovaní, frustrovaní a nedostatečně placení.',
    solution: 'Využili Engagement nástroj Echo Pulse od Behavery k diagnostice skutečných příčin nespokojenosti.',
    results: [
      { label: 'Engagement Score', value: '9/10' },
      { label: 'Úspora času automatizací', value: '200+ hodin' },
      { label: 'Spokojenost s odměňováním', value: '9/10' },
      { label: 'Snížení fluktuace', value: '✓' }
    ],
    content: `
      <h2>Problém</h2>
      <p>Valxon, rostoucí B2B společnost, čelila po změně vedení významným interním problémům. Zaměstnanci vyjadřovali rostoucí nespokojenost, cítili se přepracovaní a frustrovaní. Nejasné priority, vysoká úroveň stresu a nedostatek strukturované komunikace vedly k poklesu důvěry ve vedení.</p>

      <h2>Řešení</h2>
      <p>Karel Poplstein, nový CEO, sáhl po Engagement nástroji Echo Pulse od Behavery. Výsledky potvrdily obavy – ale zároveň přinesly zásadní poznání: lidé byli stále zapojení, jen neměli podmínky, aby mohli dobře pracovat.</p>
      <p>Valxon zavedl:</p>
      <ul>
        <li>Jasně definované role a očekávání</li>
        <li>Strukturované procesy a automatizaci rutinních prací</li>
        <li>OKRs a KPIs pro sladění cílů</li>
        <li>Pravidelné check-ins a stand-upy</li>
        <li>Sdílení výsledků Echo Pulsů napříč firmou</li>
      </ul>

      <h2>Výsledek</h2>
      <p>Valxon si dal za cíl zlepšit Engagement Score z 6,5 na 8,2. Na konci Q2 dosáhli 9/10!</p>
      <ul>
        <li>Automatizace procesů ušetřila více než 200 hodin práce</li>
        <li>Spokojenost s odměňováním vzrostla z 4,4/10 na 9/10</li>
        <li>Zaměstnankyně na pokraji vyhoření (2,8/10) se zlepšila na 8,8/10 a zůstala</li>
        <li>Vybudování důvěry mezi zaměstnanci a vedením</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2024-01-20').toISOString(),
    status: 'published'
  },
  {
    id: '5',
    title: '20% úspora času: Jak Expando zlepšilo zákaznický servis s Behaverou',
    slug: '20-time-saved-how-expando-improved-customer-service-with-behavera',
    clientName: 'Expando',
    industry: 'E-commerce',
    challenge: 'Expando se potýkala s nízkou produktivitou a pomalým zákaznickým servisem. Zákazníci čekali na odpovědi i několik dní.',
    solution: 'Implementovali Echo Pulse, který odhalil klíčové problémy v komunikaci a motivaci.',
    results: [
      { label: 'Účast na průzkumech', value: '84%' },
      { label: 'Úspora času HR', value: '85%' },
      { label: 'Zlepšení komunikace', value: '3 měsíce' },
      { label: 'Úspora času týmu', value: '20%' }
    ],
    content: `
      <h2>Problém</h2>
      <p>Společnost Expando se potýkala s nízkou produktivitou a pomalým zákaznickým servisem. Snahy o diagnostiku problému byly neefektivní, subjektivní a vedly k chybným řešením. Průzkumy zabíraly celých 7 pracovních dní, ale přinesly jen 59% míru odpovědí a omezené poznatky.</p>

      <h2>Řešení</h2>
      <p>Díky Behaveře získala společnost Expando objektivní představu o svých výzvách. Test spokojenosti odhalil neefektivní komunikaci a nízkou motivaci zaměstnanců.</p>
      <p>Expando provedla klíčové změny:</p>
      <ul>
        <li>Týdenní aktualizace OKR pro přehlednost cílů</li>
        <li>Pravidelné schůzky 1:1 zaměřené na rozvoj</li>
        <li>Reorganizované kanály Slack</li>
        <li>Fin AI Bot pro automatizaci - zkrácení doby odezvy ze 7 na 2 minuty</li>
        <li>Systém nepeněžního ocenění</li>
      </ul>

      <h2>Výsledky</h2>
      <ul>
        <li>96% účast na čtvrtletním testování (nárůst 37%)</li>
        <li>O 85% méně času stráveného přípravou a analýzou - HR dokončí proces za jeden den místo sedmi</li>
        <li>Viditelné zlepšení spolupráce do 3 měsíců</li>
        <li>20% úspora času díky zkrácení doby vyhledávání informací</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2024-02-28').toISOString(),
    status: 'published'
  },
  {
    id: '6',
    title: 'Aktivace pasivních kandidátů',
    slug: 'activation-of-passive-candidates',
    clientName: 'Confidential Client',
    industry: 'Various',
    challenge: 'Organizace měla velkou návštěvnost kariérní stránky, ale konverzi nižší než 2 %. Věděli, že více než 70 % potenciálních uchazečů je pasivních.',
    solution: 'Na kariérní stránku přidali simulační hru The Office Day, která uchazečům umožňuje přihlásit se nepřímo.',
    results: [
      { label: 'Konverzní poměr', value: '8%' },
      { label: 'Nárůst konverze', value: '4x' },
      { label: 'Přihlášení po hře', value: '75%' }
    ],
    content: `
      <h2>Výzva</h2>
      <p>Organizace měla velkou návštěvnost kariérní stránky, ale konverzi nižší než 2 %. Věděli, že více než 70 % potenciálních uchazečů o zaměstnání je pasivních, a proto se o práci i v případě zájmu ihned neuchází.</p>

      <h2>Řešení</h2>
      <p>Na kariérní stránku jsme přidali simulační hru The Office Day, která uchazečům umožňuje přihlásit se nepřímo. Hraním získali informace o svých kompetencích, a pokud jejich profil odpovídal požadavkům, mohli přeskočit dvě kola přijímacího pohovoru a ušetřit spoustu času.</p>

      <h2>Výsledek</h2>
      <p>Zvýšili jsme konverzní poměr návštěvníků kariérní stránky z 2 % na 8 %. Navíc 75 % uchazečů, kteří si simulační hru zahráli, se rozhodli rovnou ucházet o pozici.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2023-11-15').toISOString(),
    status: 'published'
  },
  {
    id: '7',
    title: 'Zvýšení výkonu lídrů',
    slug: 'boosting-performance-of-leaders',
    clientName: 'Confidential Client',
    industry: 'Various',
    challenge: 'Současní leadeři byli orientovaní na vztahy a dynamické prostředí, ale firma tlačila na výkon a stabilitu.',
    solution: 'Použili assessmenty Culture Fit a Game Changer na odhalení kompetencí a pracovního chování.',
    results: [
      { label: 'Přeorientování chování', value: '✓' },
      { label: 'Zvýšení výkonu', value: '✓' },
      { label: 'Stabilita', value: '✓' }
    ],
    content: `
      <h2>Výzva</h2>
      <p>Současní leadeři byli orientovaní na vztahy a dynamické prostředí, které podporuje inovace, kreativitu a experimentování. Avšak firma tlačila na výkon a vytvářela stabilní prostředí zaměřené na jistoty, na které se lidé mohou spolehnout.</p>

      <h2>Řešení</h2>
      <p>Použili jsme assessment Culture Fit na zjištění preferencí ohledně pracovního prostředí a Game Changer na odhalení kompetencí a pracovního chování. Porovnáním výsledků jsme byli schopni identifikovat, kde se potřeby a preference firmy a zaměstnanců rozcházejí. Navrhli jsme konkrétní kroky pro jednotlivé manažery, abychom zvýšili jejich výkon a naplnili potřeby firmy.</p>

      <h2>Výsledek</h2>
      <p>Pomohli jsme přeorientovat pracovní chování u vedoucích pracovníků, aby podporovalo výkon a stabilita ho udržovala na vysoké úrovni.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2023-12-10').toISOString(),
    status: 'published'
  },
  {
    id: '8',
    title: 'Vybudování vlastního talent poolu během 1 měsíce',
    slug: 'build-own-talent-pool-in-1-month',
    clientName: 'Confidential Client',
    industry: 'Various',
    challenge: 'Klient potřeboval novou, dlouhodobou strategii pro získávání talentů podle benchmarků svých zaměstnanců.',
    solution: 'Vytvořili fond talentů s otevřenými pozicemi, inspirativním obsahem a simulačními hrami.',
    results: [
      { label: 'Nové profily (7 dní)', value: '167' },
      { label: 'Celkový růst fondu', value: '2,500' },
      { label: 'Kvalitní kandidáti', value: '✓' }
    ],
    content: `
      <h2>Výzva</h2>
      <p>Klient potřeboval novou, dlouhodobou strategii pro získávání talentů podle benchmarků svých zaměstnanců a týmů. Cíl byl jasný: použít stávající data a rychle vyhodnotit vhodnost kandidáta na kteroukoliv z mnoha otevřených pozic.</p>

      <h2>Řešení</h2>
      <p>Fond talentů je jedna z funkcí Behavery, kde jsme přímo pro klienta vytvořili stránku s otevřenými pozicemi, inspirativním obsahem o firmě a dalšími informacemi. Odkaz na stránku jsme propagovali prostřednictvím sociálních sítí a dali lidem možnost si zahrát naše simulační hry.</p>
      <p>Lidé se tak mohli připojit do fondu talentů, podle výsledků zjistit, na jaké pozice by se podle nich hodili a do jaké firmy by kulturně zapadli. Měli možnost se jednoduše přihlásit na dané pozice nebo začít sledovat obsah firem či dorazit na jejich akce.</p>

      <h2>Výsledek</h2>
      <p>167 nových profilů s velkým potenciálem ve fondu talentů během prvních 7 dní propagace na sociálních sítích. Nové profily přibývají každým dnem a fond se rozrostl o 2 500 lidí.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date('2023-10-20').toISOString(),
    status: 'published'
  }
];

// Service Layer
export const CmsService = {
  // Posts
  getPosts: async (): Promise<BlogPost[]> => {
    if (!supabaseClient) return [...MOCK_POSTS];
    
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      const rows = (data as PostRow[] | null) || [];
      return rows
        .filter((post) => post && post.title && post.slug)
        .map(mapPostRow);
    } catch (err) {
      console.error('Error fetching posts:', err);
      return [...MOCK_POSTS];
    }
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    if (!supabaseClient) return MOCK_POSTS.find(p => p.slug === slug);
    
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      if (!data || !data.title || !data.slug) return undefined;
      return mapPostRow(data as PostRow);
    } catch (err) {
      console.error('Error fetching post:', err);
      return MOCK_POSTS.find(p => p.slug === slug);
    }
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'author' | 'publishedAt'>): Promise<BlogPost> => {
    if (!supabaseClient) {
      const newPost: BlogPost = {
        ...post,
        id: Math.random().toString(36).substr(2, 9),
        author: MOCK_AUTHORS[0],
        publishedAt: new Date().toISOString(),
      };
      MOCK_POSTS.push(newPost);
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
          published_at: new Date().toISOString()
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
      const index = MOCK_POSTS.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Post not found");
      MOCK_POSTS[index] = { ...MOCK_POSTS[index], ...updates };
      return MOCK_POSTS[index];
    }
    
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .update({
          title: updates.title,
          slug: updates.slug,
          excerpt: updates.excerpt,
          content: updates.content,
          cover_image: updates.coverImage,
          tags: updates.tags,
          status: updates.status
        })
        .eq('id', id)
        .select('*, authors(*)')
        .single();
      
      if (error) throw error;

      return mapPostRow(data as PostRow);
    } catch (err) {
      console.error('Error updating post:', err);
      throw err;
    }
  },
  
  deletePost: async (id: string): Promise<void> => {
    if (!supabaseClient) {
      const index = MOCK_POSTS.findIndex(p => p.id === id);
      if (index !== -1) MOCK_POSTS.splice(index, 1);
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

  // Case Studies
  getCaseStudies: async (): Promise<CaseStudy[]> => {
    if (!supabaseClient) return [...MOCK_CASE_STUDIES];
    
    try {
      const { data, error } = await supabaseClient
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      const rows = (data as CaseStudyRow[] | null) || [];
      return rows
        .filter((study) => study && study.title && study.slug)
        .map(mapCaseStudyRow);
    } catch (err) {
      console.error('Error fetching case studies:', err);
      return [...MOCK_CASE_STUDIES];
    }
  },

  getCaseStudyBySlug: async (slug: string): Promise<CaseStudy | undefined> => {
    if (!supabaseClient) return MOCK_CASE_STUDIES.find(c => c.slug === slug);
    
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
      return MOCK_CASE_STUDIES.find(c => c.slug === slug);
    }
  },
  
  createCaseStudy: async (study: Omit<CaseStudy, 'id' | 'publishedAt'>): Promise<CaseStudy> => {
    if (!supabaseClient) {
      const newStudy: CaseStudy = {
        ...study,
        id: Math.random().toString(36).substr(2, 9),
        publishedAt: new Date().toISOString()
      };
      MOCK_CASE_STUDIES.push(newStudy);
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
          published_at: new Date().toISOString()
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

  // Auth is handled by Supabase Auth via auth-context.tsx
};
