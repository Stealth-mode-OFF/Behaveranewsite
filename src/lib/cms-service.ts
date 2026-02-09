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
    coverImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
    tags: ['Employer Branding', 'Culture', 'EVP'],
    publishedAt: new Date('2024-04-01').toISOString(),
    status: 'published'
  },
  {
    id: '1',
    title: 'Discovered Potential Led to New Business Opportunities',
    slug: 'discovered-potential-led-to-new-business-opportunities',
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
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    tags: ['Engagement', 'Promotion', 'Communication'],
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
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000',
    tags: ['Retention', 'Productivity', 'Development'],
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
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000',
    tags: ['Culture', 'Turnover', 'Leadership'],
    publishedAt: new Date('2024-03-05').toISOString(),
    status: 'published'
  },
  {
    id: '4',
    title: 'More Than Money: What Truly Drives Engagement in Times of Change',
    slug: 'more-than-money-what-truly-drives-engagement-in-times-of-change',
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
    coverImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000',
    tags: ['Engagement', 'Compensation', 'Retention'],
    publishedAt: new Date('2024-01-20').toISOString(),
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
