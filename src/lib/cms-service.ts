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
  const fromMock = MOCK_CASE_STUDIES.filter(s => !localIds.has(s.id) && !deletedIds.has(s.id));
  return [...local, ...fromMock].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Mock Data
const MOCK_AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Veronika Nováková',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    role: 'Content Lead'
  },
  {
    id: '2',
    name: 'Barbora Slouková',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    role: 'People & Culture'
  },
  {
    id: '3',
    name: 'Behavera Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
    role: 'Research & Insights'
  }
];

const MOCK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Leaders Share 7 Tips to Kickstart Your Leadership',
    slug: '5-leaders-share-7-tips-to-kickstart-your-leadership',
    excerpt: 'Stepping into leadership feels like a leap into the unknown. Your role now isn\'t just about tasks — it\'s about people. Discover what five experienced leaders from Albi, DHL, CREDITAS and others have to say about leading high-performing teams.',
    content: `<p>You may have spent years as an expert in your field, the person others relied on because you knew how things worked. Then came the offer: "Would you like to lead a team?" It sounds logical — you understand the work, you have the experience, you know the company.</p>
      <p>But leadership isn't just a "higher level" of your current career. It's a completely new discipline. It's less about expertise and more about people.</p>
      <h2>1. Be present, listen, and act</h2>
      <p>As a new leader, you may feel like you need to have all the answers. In reality, it's far more important to ask questions, listen, and respond.</p>
      <p>"I regularly ask my team what helps them and what they'd like to improve. When a suggestion comes up, I try to make it happen so they see their voice has real weight," says Adela Pijaková, Customer Care Team Lead at snuggs.</p>
      <h2>2. Let your team find solutions</h2>
      <p>Leadership isn't about giving orders. It's much stronger when you involve the team in finding solutions. When solving a problem, ask: "How would you do it?"</p>
      <h2>3. Find and negotiate common ground</h2>
      <p>Requests don't only come from the top anymore — they also come from your team. Your role is to align interests and find common ground.</p>
      <h2>4. Trust matters more than control</h2>
      <p>Real motivation doesn't come from micromanagement — it comes from trust. Agree on goals, not steps. Give regular feedback — praise specifically, raise concerns empathetically.</p>
      <h2>5. Show purpose and results</h2>
      <p>People need to know their work has meaning. Connect work to outcomes: "Your campaign brought in 300 new customers — that's why we can expand further."</p>
      <h2>6. Be a teammate, not just "the boss"</h2>
      <p>"No topic is taboo on our team. We're all on the same level — partners, colleagues, not bosses and subordinates," says Jan Krejčí, Head of UX at CREDITAS Group.</p>
      <h2>7. Never stop paying attention</h2>
      <p>The true impact of leadership shows up in everyday details — laughter on calls, a willingness to help outside one's own role, or someone volunteering to take on extra responsibility. Don't rely only on your gut feeling. Collect data and build next steps on them.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[0],
    publishedAt: '2025-09-17T00:00:00.000Z',
    tags: ['Leadership'],
    status: 'published'
  },
  {
    id: '2',
    title: 'Office Time = Productive Time… Or Is It?',
    slug: 'office-time-productive-time-or-is-it',
    excerpt: 'Over 70% of employees would consider changing jobs if denied the option to work from home. If you want 100% office attendance, you might want to consider other ways to engage and motivate your people.',
    content: `<h2>Productivity, Productivity, and More Productivity</h2>
      <p>"We must increase productivity! The only way to achieve that is by keeping employees close and watching them more closely. Let's bring them back into the office!" — you may tell yourself, and expect a positive change.</p>
      <p>You likely have team members who prefer working from the office. But what works for one doesn't necessarily work for another. And not everything that looks productive is actually productive.</p>
      <h2>Let's Take a Look Behind the Scenes</h2>
      <p>Anna, a senior developer, had adapted herself to the digital nomad standard. The new rule that forced her to stay in one place made her realize she no longer wants to be part of it. She immediately started looking for new opportunities.</p>
      <p>Thomas, an HR manager, moved to a village outside Prague and welcomed a new baby. With the new rules, he doesn't want to see his children only when they're asleep.</p>
      <p>Clara, a data analyst, is rather shy and prefers quiet working environments. She saw the new rule as a betrayal of trust and autonomy.</p>
      <h2>Find Out (and Provide)</h2>
      <p>Employee engagement connects people with the company's vision, mission, and values. Measurably higher productivity — up to 20% — comes from employee engagement, whether people work from home, Bali, or the office.</p>
      <h2>A Successful Leader Knows How</h2>
      <p>Echo Pulse by Behavera can help — quickly, securely, and from anywhere. It enables employees to regularly, anonymously, and in just a few minutes share what helps them and what holds them back.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[1],
    publishedAt: '2025-08-18T00:00:00.000Z',
    tags: ['Remote Work'],
    status: 'published'
  },
  {
    id: '3',
    title: 'How to Do 1:1 Meetings Effectively',
    slug: 'how-to-do-1-1-meetings-effectively',
    excerpt: 'For some leaders, 1:1 meetings are a popular part of their work, while others struggle with how to grasp them properly. Practical tips from experienced leaders — what works for them? Take a peek under the hood.',
    content: `<h2>Why 1:1 Meetings Matter</h2>
      <p>One-on-one meetings are the backbone of great leadership. They're your chance to build trust, understand challenges, and guide professional development — but only if done right.</p>
      <h2>Set the Right Cadence</h2>
      <p>Weekly or bi-weekly 1:1s work best for most teams. The key is consistency — your team needs to know they have a regular space to be heard.</p>
      <h2>Create a Safe Space</h2>
      <p>The best 1:1s aren't status updates. They're conversations about growth, challenges, and feelings. Ask open-ended questions: "What's been on your mind lately?" or "Where do you feel stuck?"</p>
      <h2>Listen More Than You Talk</h2>
      <p>As a leader, your instinct might be to solve problems immediately. Resist that urge. Sometimes people just need to be heard. Use the 80/20 rule — let the other person talk 80% of the time.</p>
      <h2>Follow Through</h2>
      <p>Nothing kills trust faster than promises without action. Keep notes and follow up on commitments. When your team sees things actually change based on these conversations, engagement soars.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[0],
    publishedAt: '2025-07-10T00:00:00.000Z',
    tags: ['Leadership'],
    status: 'published'
  },
  {
    id: '4',
    title: "Silence In a Team Doesn't Mean Peace — It's a Warning Sign",
    slug: 'the-creeping-killer-of-your-business',
    excerpt: 'Only 23% of employees are engaged. The rest show signs of quiet quitting, burnout, or disengagement — hurting productivity, retention, and culture. Learn how to boost engagement before it\'s too late.',
    content: `<h2>The Silent Epidemic</h2>
      <p>When a team goes quiet, most leaders breathe a sigh of relief. No complaints, no drama — everything must be fine, right? Wrong. Silence is often the most dangerous signal of all.</p>
      <h2>What the Data Says</h2>
      <p>According to Gallup, only 23% of employees worldwide are actively engaged. The remaining 77% are either quietly disengaged or actively working against their organization's goals.</p>
      <h2>The Cost of Disengagement</h2>
      <p>Disengaged employees cost organizations approximately 34% of their annual salary in lost productivity. For a company of 100, that's hundreds of thousands in hidden losses every year.</p>
      <h2>How to Break the Silence</h2>
      <p>Create psychological safety. Use anonymous pulse surveys to give people a voice. Act on feedback visibly. Regular check-ins and transparent communication transform silent teams into engaged ones.</p>
      <p>Echo Pulse identifies these silent risks before they become costly departures — giving you actionable insights in minutes, not months.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2025-06-05T00:00:00.000Z',
    tags: ['Well-being'],
    status: 'published'
  },
  {
    id: '5',
    title: 'How to Never Hire a Bad Salesperson Again',
    slug: 'hiring-only-top-performing-sales-reps',
    excerpt: 'Hired a rockstar salesperson — so why aren\'t they selling? You go through the process, ask the right questions, and bring someone on board who ticks all the boxes. Then reality hits: they\'re not closing.',
    content: `<h2>The Hiring Paradox</h2>
      <p>You did everything right. Structured interviews, reference checks, even a trial task. The candidate was charming, confident, and said all the right things. Three months later, the pipeline is dry.</p>
      <h2>Why Traditional Hiring Fails</h2>
      <p>Sales interviews are inherently biased — you're evaluating people on their ability to sell themselves. Charismatic candidates who interview well aren't necessarily the ones who will close deals consistently.</p>
      <h2>The Behavioral Signal</h2>
      <p>Top-performing salespeople share specific behavioral patterns: resilience under rejection, intrinsic motivation, consultative listening, and strategic persistence. These traits don't show up in CVs or interviews.</p>
      <h2>Data-Driven Hiring</h2>
      <p>By profiling your existing top performers with behavioral assessments, you can create an ideal candidate profile. Then match new candidates against it — taking gut feeling out of the equation.</p>
      <p>Companies using Behavera's assessment in their sales hiring process have seen a 37% increase in new hire revenue within the first 8 months.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2025-05-12T00:00:00.000Z',
    tags: ['Future of Work'],
    status: 'published'
  },
  {
    id: '6',
    title: "Valxon's Discovery Journey of the Truth Behind Money Complaints",
    slug: 'valxons-discovery-journey-of-the-truth-behind-money-complaints',
    excerpt: 'When Valxon underwent a leadership change, the new CEO faced an overwhelming number of employee concerns. By leveraging Behavera\'s Engagement Survey, they uncovered the key challenges and transformed insights into action.',
    content: `<h2>The Challenge</h2>
      <p>When Karel Poplstein stepped in as Valxon's new CEO, he inherited a company buzzing with dissatisfaction. Employees felt overworked, frustrated, and underpaid. The loudest complaint? Money.</p>
      <h2>Looking Deeper</h2>
      <p>But Behavera's engagement survey revealed something surprising: money wasn't the real issue. The data showed that employees' frustration stemmed from unclear processes, lack of recognition, and feeling that their voice didn't matter.</p>
      <h2>The Transformation</h2>
      <p>Armed with real data instead of assumptions, Valxon's leadership took targeted actions: clarified roles and responsibilities, automated manual workflows, established OKRs, and shared engagement results transparently with the team.</p>
      <h2>The Results</h2>
      <p>Within one quarter, satisfaction scores jumped from 6.5 to 9 out of 10. An employee showing signs of burnout (2.8/10) improved to 8.8/10 and decided to stay. Over 200 hours were saved through automation. The lesson? Listen to what the data tells you, not just what people say.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2025-04-20T00:00:00.000Z',
    tags: ['Well-being'],
    status: 'published'
  },
  {
    id: '7',
    title: 'With Behavera, Old-school Recruiting is the New Blackberry in 2010',
    slug: 'old-school-recruiting-is-the-new-blackberry',
    excerpt: 'Expando helps online stores expand into international markets. With rapid growth come challenges — especially in recruiting talent and maximizing team productivity. They tested Behavera with 160 candidates.',
    content: `<h2>Expando's Challenge</h2>
      <p>Expando is a dynamic e-commerce company helping online stores expand into international markets. With rapid growth came a familiar problem: how do you hire the right people fast without sacrificing quality?</p>
      <h2>The Old Way</h2>
      <p>Traditional recruitment at Expando meant hours of subjective interviews, gut-feeling decisions, and a 59% survey response rate despite repeated reminders. Internal analyses took up to 7 working days per cycle.</p>
      <h2>The Behavera Way</h2>
      <p>After implementing Behavera, Expando tested 160 candidates with behavioral assessments. The platform identified candidates who matched their top-performer profiles — not just on paper, but in actual work behavior.</p>
      <h2>The Impact</h2>
      <p>Survey completion time dropped to 3 minutes with 84% participation (up from 59%). HR now completes the entire feedback cycle in one day instead of seven. One promoted employee increased client sales by 37% within 8 months. Total annual savings: €11,000.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[1],
    publishedAt: '2025-03-15T00:00:00.000Z',
    tags: ['Future of Work'],
    status: 'published'
  },
  {
    id: '8',
    title: 'Busting 6 Myths About Well-being in Companies',
    slug: 'busting-6-myths-about-well-being-in-companies',
    excerpt: 'Well-being has flooded the Internet, accompanied by myths. Let\'s shine a light on the most widely spread misconceptions — from anonymous surveys to doing well-being once a year.',
    content: `<h2>Myth 1: Anonymous surveys don't work</h2>
      <p>Actually, anonymity is exactly why they DO work. When people feel safe, they share the truth. The key is acting on the results visibly.</p>
      <h2>Myth 2: One annual survey is enough</h2>
      <p>Would you check your finances once a year? Employee sentiment changes constantly. Regular pulse checks catch issues before they become crises.</p>
      <h2>Myth 3: Well-being is just about yoga and fruit baskets</h2>
      <p>Real well-being is about psychological safety, meaningful work, fair leadership, and feeling heard. The perks are nice, but they're not the foundation.</p>
      <h2>Myth 4: It's too late to address well-being</h2>
      <p>It's never too late. Even teams in crisis can turn around with the right data and commitment. Valxon proved it — going from 6.5 to 9 out of 10 in one quarter.</p>
      <h2>Myth 5: DIY solutions are good enough</h2>
      <p>Homemade surveys often suffer from bias, poor question design, and lack of benchmarks. Professional tools give you comparable, actionable data.</p>
      <h2>Myth 6: Well-being is the same for everyone</h2>
      <p>What motivates a junior developer is different from what a senior manager needs. Effective well-being programs are personalized, not one-size-fits-all.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2024-11-08T00:00:00.000Z',
    tags: ['HR Tips'],
    status: 'published'
  },
  {
    id: '9',
    title: 'The Well-being of Leaders at Risk',
    slug: 'well-being-of-leaders-at-risk',
    excerpt: 'In challenging times, we rely on our leaders as a lighthouse in the storm. What if they too run out of strength and their light goes out? It\'s time to make the well-being of leaders a priority.',
    content: `<h2>The Invisible Burden</h2>
      <p>Leaders are expected to be pillars of strength — always composed, always having the answers. But behind that facade, many are struggling. Research shows that 60% of leaders report feeling burned out at the end of each day.</p>
      <h2>Why Leaders Don't Speak Up</h2>
      <p>There's a dangerous culture of "leadership stoicism." Admitting vulnerability feels like admitting weakness. So leaders push through, make increasingly poor decisions, and eventually burn out — taking their teams down with them.</p>
      <h2>The Ripple Effect</h2>
      <p>A burned-out leader doesn't just suffer personally. Their team's engagement drops by up to 40%. Decision quality deteriorates. Turnover increases. The entire organizational health is at stake.</p>
      <h2>What Organizations Can Do</h2>
      <p>Create peer support networks for leaders. Include leadership well-being in organizational metrics. Use tools like Echo Pulse to monitor stress signals early. Normalize vulnerability as a strength, not a weakness.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[1],
    publishedAt: '2024-09-22T00:00:00.000Z',
    tags: ['Well-being'],
    status: 'published'
  },
  {
    id: '10',
    title: 'HR Conferences 2023: International Online Events',
    slug: 'hr-conferences-2023-international-online-events',
    excerpt: 'Want to go abroad for inspiration but don\'t have the cash for a big trip? A number of international conferences offer virtual attendance in Europe-friendly times — and some are even free.',
    content: `<h2>Why Attend HR Conferences?</h2>
      <p>Even for experienced HR professionals, staying current matters. Conferences bring fresh perspectives, networking opportunities, and practical insights you won't find in articles alone.</p>
      <h2>Top Picks for Virtual Attendance</h2>
      <p>From SHRM Annual to Unleash World, the best HR events have embraced hybrid formats. You can join keynotes, workshops, and networking sessions from your home office.</p>
      <h2>What to Look For</h2>
      <p>Focus on conferences that offer interactive sessions, not just recordings. The value is in real-time Q&A, breakout rooms, and connecting with speakers. Look for events covering AI in HR, employee experience, and data-driven people strategies.</p>
      <h2>Make the Most of It</h2>
      <p>Take notes, share insights with your team, and implement at least one takeaway within a week. The ROI of conference attendance comes from application, not just inspiration.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2024-08-01T00:00:00.000Z',
    tags: ['HR Tips'],
    status: 'published'
  },
  {
    id: '11',
    title: 'HR Conferences 2023: Czech Republic and Slovakia',
    slug: 'hr-conferences-2023-czechia-and-slovakia',
    excerpt: 'Where to go this year to get educated and inspired? We\'ve put together a list of top events for HR professionals, leaders, and technology enthusiasts in the Czech Republic and Slovakia.',
    content: `<h2>The Czech & Slovak HR Scene</h2>
      <p>The Central European HR community is vibrant and growing. From Prague to Bratislava, events covering people analytics, employer branding, and future of work are attracting top speakers and practitioners.</p>
      <h2>Notable Events</h2>
      <p>HR Days, People Management Forum, and Future of Work Summit are among the must-attend events. Each offers a unique blend of local case studies and international best practices.</p>
      <h2>Why Local Events Matter</h2>
      <p>While international conferences provide broad perspectives, local events offer context-specific insights. Labor market dynamics, regulatory frameworks, and cultural norms differ — and local speakers address these nuances.</p>
      <h2>Networking Is Key</h2>
      <p>The Czech and Slovak HR communities are tight-knit. Attending local events builds relationships that lead to knowledge sharing, partnerships, and career opportunities long after the conference ends.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2024-07-15T00:00:00.000Z',
    tags: ['HR Tips'],
    status: 'published'
  },
  {
    id: '12',
    title: 'Behavera Well-being Index',
    slug: 'behavera-well-being-index',
    excerpt: 'What if there was a tool that could do the research for you, analyze the data, and recommend how to improve well-being? Forget boring surveys and hours spent evaluating — focus on taking care of your people.',
    content: `<h2>Beyond Traditional Surveys</h2>
      <p>Traditional well-being surveys are long, boring, and produce data that arrives too late to act on. By the time you've analyzed results, the situation has already changed.</p>
      <h2>How the Well-being Index Works</h2>
      <p>The Behavera Well-being Index combines short, conversational assessments with AI-powered analysis. Employees spend just 3 minutes sharing how they feel, and leaders get instant dashboards with specific recommendations.</p>
      <h2>What It Measures</h2>
      <p>The Index covers six dimensions: workload balance, psychological safety, recognition, growth opportunities, team dynamics, and leadership quality. Each dimension gets a score from 1-10 with trend tracking.</p>
      <h2>From Data to Action</h2>
      <p>The real value isn't in the data — it's in what you do with it. The Well-being Index doesn't just flag problems, it recommends specific actions: questions for your next 1:1, team activities, or process changes that address root causes.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2024-06-10T00:00:00.000Z',
    tags: ['Well-being'],
    status: 'published'
  },
  {
    id: '13',
    title: 'Are You Dealing With Well-being Effectively?',
    slug: 'how-to-deal-with-well-being-effectively',
    excerpt: 'Despite 96% of companies providing more resources for mental health, only 1 in 6 people feel truly supported. How can companies make the right investments and create an environment where people thrive?',
    content: `<h2>The Investment Paradox</h2>
      <p>Companies are spending more on employee well-being than ever before. Meditation apps, gym memberships, mental health days — the list keeps growing. Yet employee burnout is at an all-time high. What gives?</p>
      <h2>Surface vs. Systemic</h2>
      <p>Most well-being programs treat symptoms, not causes. A yoga class doesn't fix toxic management. Free snacks don't compensate for lack of autonomy. Real well-being requires systemic change.</p>
      <h2>What Actually Works</h2>
      <p>Research consistently points to five factors: meaningful work, psychological safety, fair leadership, growth opportunities, and work-life boundaries. Benefits and perks are the cherry on top — not the cake.</p>
      <h2>Measuring What Matters</h2>
      <p>If you can't measure it, you can't improve it. Regular pulse surveys, exit interview analysis, and engagement metrics give you a real picture — not assumptions about what employees need.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[1],
    publishedAt: '2024-05-05T00:00:00.000Z',
    tags: ['Well-being'],
    status: 'published'
  },
  {
    id: '14',
    title: '7 Tips for Improving Employee Engagement in Hybrid Work',
    slug: '7-tips-for-improving-employee-engagement-in-hybrid-work',
    excerpt: 'Did employee engagement give you wrinkles before the pandemic? In a hybrid setting, this poses an even greater challenge. If you\'re running out of inspiration, perhaps these practical tips will help.',
    content: `<h2>1. Intentional Communication</h2>
      <p>In hybrid setups, information doesn't flow naturally. Create structured channels and rhythms: async updates for status, sync meetings for decisions, and 1:1s for connection.</p>
      <h2>2. Equal Experience</h2>
      <p>Remote employees shouldn't be second-class citizens. Invest in good video conferencing, ensure remote voices are heard first in meetings, and share information digitally by default.</p>
      <h2>3. Results Over Presence</h2>
      <p>Measure output, not hours. Define clear deliverables and trust your team to manage their time. Productivity paranoia destroys engagement faster than any other management mistake.</p>
      <h2>4. Regular Pulse Checks</h2>
      <p>You can't read the room when half the team isn't in it. Weekly or bi-weekly pulse surveys replace the informal signals you'd normally pick up in the office.</p>
      <h2>5. Social Connection</h2>
      <p>Plan intentional social time — virtual coffee chats, team lunches when everyone's in the office, or off-site gatherings quarterly.</p>
      <h2>6. Development Opportunities</h2>
      <p>Remote employees often feel invisible when it comes to promotions. Create transparent development paths and ensure growth opportunities aren't biased toward office presence.</p>
      <h2>7. Listen and Adapt</h2>
      <p>What works for one team won't work for another. Ask your people what they need, experiment, and iterate. Engagement isn't a destination — it's a continuous journey.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2024-03-18T00:00:00.000Z',
    tags: ['Remote Work'],
    status: 'published'
  },
  {
    id: '15',
    title: 'Inspiring TED Talks for HR Professionals and Leaders',
    slug: 'inspiring-ted-talks-for-hr-professionals',
    excerpt: 'Want to brighten up your day with a cup of inspiration? We\'ve selected the best ideas worth spreading from speakers in the field of human resources and leadership. Get your notebook ready.',
    content: `<h2>Why TED Talks for HR?</h2>
      <p>In a world of long reports and dense whitepapers, TED Talks distill complex ideas into digestible, inspiring presentations. Here are our top picks for HR professionals and people leaders.</p>
      <h2>On Leadership</h2>
      <p>Simon Sinek's "How Great Leaders Inspire Action" remains a classic. His Golden Circle framework — start with WHY — is as relevant for internal leadership as for external marketing.</p>
      <h2>On Vulnerability</h2>
      <p>Brené Brown's "The Power of Vulnerability" changed how we think about workplace culture. Her research shows that vulnerability isn't weakness — it's the birthplace of innovation and trust.</p>
      <h2>On Motivation</h2>
      <p>Dan Pink's "The Puzzle of Motivation" dismantles outdated carrot-and-stick management. Autonomy, mastery, and purpose drive performance more than traditional rewards.</p>
      <h2>On Diversity</h2>
      <p>Vernā Myers' "How to Overcome Our Biases" provides practical steps for creating genuinely inclusive workplaces — beyond checking boxes and meeting quotas.</p>
      <h2>Apply, Don't Just Watch</h2>
      <p>The value of these talks lies in application. After watching, ask yourself: "What one thing can I implement this week?" Then do it.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[0],
    publishedAt: '2024-02-12T00:00:00.000Z',
    tags: ['HR Tips'],
    status: 'published'
  },
  {
    id: '16',
    title: '5 Trends That Will Transform the Way We Work',
    slug: '5-trends-that-will-transform-the-way-we-work',
    excerpt: 'The world is literally changing before our eyes and with it the way we work. What are the trends in HR and leadership? Which skills will make you the most desirable employee?',
    content: `<h2>1. AI-Augmented HR</h2>
      <p>Artificial intelligence isn't replacing HR — it's amplifying it. From automated screening to predictive attrition models, AI handles the data so humans can focus on what they do best: connecting with people.</p>
      <h2>2. Skills-Based Organizations</h2>
      <p>Job titles are becoming obsolete. Forward-thinking companies organize around skills and projects rather than rigid hierarchies. This creates more mobility, faster adaptation, and better talent utilization.</p>
      <h2>3. Employee Experience as Strategy</h2>
      <p>Just as customer experience became a competitive advantage, employee experience is following suit. Companies that design intentional employee journeys outperform those that don't — in engagement, retention, and innovation.</p>
      <h2>4. Continuous Listening</h2>
      <p>Annual surveys are dead. Real-time pulse checks, always-on feedback channels, and sentiment analysis give leaders an up-to-the-minute picture of organizational health.</p>
      <h2>5. Well-being as Business Metric</h2>
      <p>Well-being is moving from "nice to have" to board-level KPI. Companies tracking and improving employee well-being see measurable returns in productivity, retention, and employer brand strength.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[2],
    publishedAt: '2024-01-08T00:00:00.000Z',
    tags: ['Future of Work'],
    status: 'published'
  },
  {
    id: '17',
    title: 'The Future of Business Success is in the People-First Approach',
    slug: 'the-future-of-work-is-in-the-people-first-approach',
    excerpt: 'Why do people keep quitting and quality candidates not applying? The problem may not be in the benefits, but in the attitude of companies towards people. Leaders of successful companies understand that people are the beating heart.',
    content: `<h2>Beyond Human Resources</h2>
      <p>Long gone are the days when employees were mere "human resources" — cogs in a machine to be optimized and replaced. Leaders of successful companies understand that people are the beating heart of their organization.</p>
      <h2>What People-First Means</h2>
      <p>People-first isn't about unlimited PTO or beer taps. It's about fundamentally rethinking how decisions are made. Every strategic choice — from restructuring to product launches — considers the impact on people first.</p>
      <h2>The Business Case</h2>
      <p>People-first companies outperform their peers by 2-3x in revenue growth and profitability. They have 40% lower turnover, 21% higher productivity, and attract top talent without bidding wars on salary.</p>
      <h2>Getting Started</h2>
      <p>Start by listening. Really listening — not just conducting surveys, but acting on what you hear. Create feedback loops where employees see their input leading to real change. Use data to understand what your people actually need, not what you assume they need.</p>
      <p>Tools like Echo Pulse make this process simple, actionable, and continuous — transforming good intentions into measurable outcomes.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200',
    author: MOCK_AUTHORS[0],
    publishedAt: '2023-11-20T00:00:00.000Z',
    tags: ['Future of Work'],
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
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
    tags: ['Employer Branding', 'Culture', 'EVP'],
    employeeCount: '800+',
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
      return rows
        .filter((study) => study && study.title && study.slug)
        .map(mapCaseStudyRow);
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
      return rows
        .filter((study) => study && study.title && study.slug)
        .map(mapCaseStudyRow);
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
      const mock = MOCK_CASE_STUDIES.find(s => s.id === id);
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
      const isMock = MOCK_CASE_STUDIES.some(s => s.id === id);
      if (isMock) {
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
