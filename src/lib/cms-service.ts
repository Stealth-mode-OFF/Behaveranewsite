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

const DEFAULT_POSTS: BlogPost[] = BLOG_POSTS;

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: '0',
    title: 'Za 3 minuty jasno, jak na Employer Branding',
    slug: 'za-3-minuty-jasno-jak-na-employer-branding',
    clientName: 'Prusa',
    industry: 'Technology / 3D Printing',
    challenge: 'Průša Research chtěla ověřit, jak jsou klíčové hodnoty a firemní kultura vnímány napříč organizací, a získat kvalitní datový podklad pro další strategická rozhodnutí v oblasti employer brandu.',
    solution: 'Využili Echo Pulse od Behavery zaměřený na téma hodnot a firemní identity (Employee Value Proposition). Krátký, konverzační formát dotazníku zapojil 60,1 % zaměstnanců během několika dní.',
    results: [
      { label: 'Zapojení zaměstnanců', value: '60.1%' },
      { label: 'Čas na vyplnění', value: '3 min' },
      { label: 'Ověřené hodnoty pro EB', value: '✓' }
    ],
    content: `
      <h2>Cíl</h2>
      <p>Cílem první fáze spolupráce s Behaverou bylo získat strukturovanou a otevřenou zpětnou vazbu od zaměstnanců a ověřit, jaký přínos může mít systematický sběr dat pro další rozvoj employer brandu. Zároveň chtělo vedení posoudit, jak může tento přístup zapadnout do jejich dlouhodobé HR a komunikační strategie.</p>

      <h2>Řešení</h2>
      <p>S cílem zapojit zaměstnance napříč celou organizací se v Průša Research rozhodli využít Echo Pulse od Behavery zaměřený na téma hodnot a firemní identity (Employee Value Proposition).</p>
      <p>Krátký, konverzační formát dotazníku a jeho integrace do interních nástrojů umožnily oslovit lidi napříč týmy během několika dní a získat jejich pohled na to, za čím firma skutečně stojí.</p>
      <p>Do průzkumu se zapojilo 60,1 % zaměstnanců, což je v kontextu velkých výrobních organizací nadprůměrný výsledek a potvrzuje vysokou míru zapojení i důvěry v celý proces.</p>
      <p>V týmech se často objevovala zpětná vazba – "Je super, že se někdo ptá, co si opravdu myslíme" a že vyplnění dotazníku bylo rychlejší a jednodušší, než čekali.</p>

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
    employeeCount: '800+',
    publishedAt: new Date('2024-04-01').toISOString(),
    status: 'published'
  },
  {
    id: '1',
    title: 'Jak Expando objevilo skrytý talent a otevřelo nové obchodní příležitosti.',
    slug: 'jak-expando-objevilo-skryty-talent',
    clientName: 'Expando',
    industry: 'E-Commerce',
    challenge: 'Expando wanted to grow beyond Amazon, but internally, things were chaotic. Motivation was low, and teams were wasting time on in-depth interviews that produced biased results — leading to poor decisions.',
    solution: 'Thanks to specific Playbook recommendations, they introduced regular 1:1 meetings, improved communication, and created expert roles with greater responsibility. Collecting regular feedback is now relevant and 80% faster.',
    results: [
      { label: 'Increase in client\'s sales', value: '37%' },
      { label: 'Saved annually', value: '€11,000' },
      { label: 'Higher response rate', value: '25%' }
    ],
    content: `
      <h2>Problem</h2>
      <p>Expando faced the challenge of expanding beyond Amazon. They wanted to help clients grow also elsewhere but felt that internally, things weren't working as they should — employee motivation was declining, complaints about chaos were rising, and there was a lack of direction.</p>
      <p>Although the team put effort into identifying the root causes, their internal analyses were time-consuming, based on subjective impressions. Employee surveys and in-depth interviews took up to 7 working days per cycle, with only a 59% response rate despite repeated reminders. Poorly formulated questions and evaluator bias distorted the results.</p>

      <h2>Solution</h2>
      <p>Thanks to Behavera, Expando gained an objective understanding of the challenges they face for the first time. Analysis using the targeted Echo Pulse survey revealed key issues: not only ineffective communication within and between teams and a lack of recognition, but also low employee motivation and limited growth opportunities.</p>
      <p>For employees who felt stuck and demotivated — unable to fully use their potential and lacking a challenge to grow — Expando introduced expert roles. These roles gave them more responsibility, autonomy, and, most importantly, a sense of purpose. For example, in the Account Management team, one employee moved from a Support Specialist role with routine tasks to a Key Account Manager position for a new marketplace, Kaufland.</p>

      <h2>Result</h2>
      <p>Within three months of launching the first Echo Pulse, internal collaboration improved thanks to regular information sharing, clear goals, and a newly defined set of processes. One key achievement was the strong growth on the Kaufland marketplace, driven by an employee who, after stepping into her new role as Key Account Manager, activated 18% more clients on the platform and increased overall sales there by 14.5% in just 8 months. She even helped one of Expando's top clients boost their sales volume by 37%.</p>
      <p>Regular surveys now take employees just three minutes to complete and reach 84% participation — 25% more than with previous in-house questionnaires. HR can now complete the entire feedback cycle, including creation of a presentation, in one day instead of the original seven.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200',
    tags: ['Engagement', 'Promotion', 'Communication'],
    employeeCount: '50+',
    publishedAt: new Date('2024-01-15').toISOString(),
    status: 'published'
  },
  {
    id: '2',
    title: 'How Vodafone Boosted Performance and Retention Through Data-Driven Talent Management',
    slug: 'from-data-to-action-how-vodafone-increased-sales-by-80-and-cut-attrition-by-40',
    clientName: 'Vodafone Czech Republic',
    industry: 'Telecommunications',
    challenge: 'Vodafone faced high employee turnover, inconsistent sales and customer care performance, unclear success profiles, and uncertainty about which skills and competencies to invest in to maximize employee success and retention.',
    solution: 'Key performance blockers such as low motivation and ineffective coaching revealed themselves. Vodafone responded by identifying ideal profiles for sales and customer care roles and implementing tailored hiring, coaching, and development plans to better support and retain employees.',
    results: [
      { label: 'Improvement in first call resolution', value: '5%' },
      { label: 'Increase in revenue per call', value: '70-80%' },
      { label: 'Increase in employee retention', value: '40%' }
    ],
    content: `
      <h2>Problem</h2>
      <p>Vodafone Czech Republic, a leader in telecommunications, faced a significant challenge: high employee turnover and inconsistent performance among its sales and customer care staff. Despite being known for excellent customer service, Vodafone struggled to align workforce potential with business needs. The company needed to identify the ideal profile for its Customer Care Expert role, understand what distinguished top performers, and improve employee retention.</p>

      <h2>Solution</h2>
      <p>To tackle these challenges, Vodafone partnered with Behavera, a people-first platform that leverages advanced behavioral assessments to uncover employee needs and potential. The collaboration began with a simulation game designed to evaluate employees' natural work styles and competencies, alongside chatbot-driven test that assessed engagement, motivation, and work-culture preferences. Data from 120 retail employees was collected and analyzed, providing valuable insights against Vodafone's key performance indicators (KPIs).</p>
      <p>The findings revealed significant performance blockers, including gaps in motivation and ineffective coaching strategies. Based on these insights, Vodafone identified ideal work-culture profiles for both sales and customer care roles. This allowed them to create tailored competency development plans, ensuring that employees received the support they needed to excel.</p>

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
    coverImage: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=1200',
    tags: ['Retention', 'Productivity', 'Development'],
    employeeCount: '1,500+',
    publishedAt: new Date('2024-02-10').toISOString(),
    status: 'published'
  },
  {
    id: '3',
    title: "How Behavera's Data Helped 365.bank Achieve a Successful Digital Transformation",
    slug: 'how-behaveras-data-helped-365-bank-achieve-a-successful-digital-transformation',
    clientName: '365.bank',
    industry: 'Banking',
    challenge: "Bank's transformation into a fully digital organization demanded a complete cultural and leadership shift — yet traditional hiring and promotion methods couldn't reliably identify the right people to drive that change.",
    solution: "365.bank data-driven approach revealed how people actually work, helping them identify the right talent, support leadership development, and align teams with the new company culture.",
    results: [
      { label: 'Reduced employee turnover', value: '14%' },
      { label: 'Faster hiring process', value: '36%' },
      { label: 'Higher employee productivity', value: '20%' }
    ],
    content: `
      <h2>Problem</h2>
      <p>The transition from Post Bank to the fully digital 365.bank was not just a rebranding — it required a fundamental shift in mindset, culture, and leadership. The bank faced several key risks: hiring the wrong people, unclear leadership capabilities, misalignment of the team with the new culture, and increased hiring risks due to remote selection.</p>

      <h2>Solution</h2>
      <p>To enable clear, data-driven hiring and promotion decisions, 365.bank implemented Behavera's assessment tools. Instead of relying on what candidates and managers said about themselves, the bank now had objective data on actual workplace behavior.</p>
      <p>The results gave the HR department and leadership a clear overview of which employees were the best fit for their roles, ready to lead through the transformation, and a cultural fit for the new bank. Where gaps were identified, the bank adjusted onboarding, training, and internal mobility programs to address them.</p>

      <h2>Result</h2>
      <p>By shifting to behavior-based hiring and leadership selection, 365.bank saw immediate improvements:</p>
      <ul>
        <li>100% data-driven hiring and promotions — Stronger hiring decisions based on proven skills and cultural fit</li>
        <li>Leadership aligned with transformation — Only leaders with the ability to drive change were promoted</li>
        <li>Faster cultural adaptation — Early identification of resistance points enabled proactive support</li>
        <li>Significantly reduced hiring risks — Better role fit, smoother onboarding, and lower turnover</li>
      </ul>
    `,
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    tags: ['Culture', 'Turnover', 'Leadership'],
    employeeCount: '400+',
    publishedAt: new Date('2024-03-05').toISOString(),
    status: 'published'
  },
  {
    id: '4',
    title: 'Nové vedení a stížnosti na peníze. Behavera odhalila skutečný problém.',
    slug: 'nove-vedeni-a-stiznosti-na-penize',
    clientName: 'Valxon',
    industry: 'Promotional Merchandise',
    challenge: 'New leadership faced a flood of complaints on workload and pay, along with a stressful atmosphere, distrust, chaos and insecurity in teams.',
    solution: "People hadn't lost interest — the issue wasn't money, but poor conditions, solved through flexibility, clear processes, and greater transparency.",
    results: [
      { label: 'Increase in employee satisfaction', value: '25%' },
      { label: 'Hours saved thanks to automation', value: '200+' },
      { label: 'Prevented from burnout and quitting', value: '1 person' }
    ],
    content: `
      <h2>Problem</h2>
      <p>Valxon, growing B2B company specializing in customized merchandise, faced significant internal challenges following a change in leadership. Employees expressed growing dissatisfaction, feeling overworked, frustrated and underpaid due to an increasingly chaotic work environment. Unclear priorities, high stress levels, and a lack of structured communication led to declining trust in management.</p>

      <h2>Solution</h2>
      <p>When Valxon's new CEO, Karel Poplstein stepped in, he wanted to address internal challenges at their core. So Karel turned to Behavera Engagement. The results not only confirmed his concerns but also revealed that employees weren't disengaged — response rate of the first round was 100% — but they lacked the right conditions to work effectively.</p>
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
    coverImage: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=1200',
    tags: ['Engagement', 'Compensation', 'Retention'],
    employeeCount: '30+',
    publishedAt: new Date('2024-01-20').toISOString(),
    status: 'published'
  }
];

// Service Layer
export const CmsService = {
  // Posts
  getPosts: async (): Promise<BlogPost[]> => {
    if (!supabaseClient) return [...DEFAULT_POSTS];
    
    try {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*, authors(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      
      const rows = (data as PostRow[] | null) || [];
      const posts = rows
        .filter((post) => post && post.title && post.slug)
        .map(mapPostRow);
      // Fall back to hardcoded posts when Supabase returns empty
      return posts.length > 0 ? posts : [...DEFAULT_POSTS];
    } catch (err) {
      console.error('Error fetching posts:', err);
      return [...DEFAULT_POSTS];
    }
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    if (!supabaseClient) return DEFAULT_POSTS.find(p => p.slug === slug);
    
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
      return DEFAULT_POSTS.find(p => p.slug === slug);
    }
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'author' | 'publishedAt'>): Promise<BlogPost> => {
    if (!supabaseClient) {
      const newPost: BlogPost = {
        ...post,
        id: Math.random().toString(36).substr(2, 9),
        author: DEFAULT_AUTHORS[0],
        publishedAt: new Date().toISOString(),
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
      const index = DEFAULT_POSTS.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Post not found");
      DEFAULT_POSTS[index] = { ...DEFAULT_POSTS[index], ...updates };
      return DEFAULT_POSTS[index];
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

      const { data, error } = await supabaseClient
        .from('case_studies')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return mapCaseStudyRow(data as CaseStudyRow);
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
