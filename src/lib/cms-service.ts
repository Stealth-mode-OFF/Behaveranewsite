import { BlogPost, CaseStudy, Author } from './types';
import { format } from 'date-fns';

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
    title: 'How TechCorp Reduced Turnover by 30%',
    slug: 'techcorp-turnover-reduction',
    clientName: 'TechCorp Solutions',
    industry: 'Software Development',
    challenge: 'TechCorp was losing key senior developers every month, costing them over $1M annually.',
    solution: 'They implemented Echo Pulse to track team sentiment and identify "toxic spots" in real-time.',
    results: [
      { label: 'Turnover Reduction', value: '30%' },
      { label: 'ROI (Year 1)', value: '450%' },
      { label: 'eNPS Increase', value: '+24' }
    ],
    content: '<p>TechCorp Solutions is a leading software provider...</p>',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000',
    publishedAt: new Date().toISOString(),
    status: 'published'
  }
];

// Service Layer
export const CmsService = {
  // Posts
  getPosts: async (): Promise<BlogPost[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_POSTS];
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_POSTS.find(p => p.slug === slug);
  },

  createPost: async (post: Omit<BlogPost, 'id' | 'author' | 'publishedAt'>): Promise<BlogPost> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newPost: BlogPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      author: MOCK_AUTHORS[0], // Default author
      publishedAt: new Date().toISOString(),
    };
    MOCK_POSTS.push(newPost);
    return newPost;
  },
  
  updatePost: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost> => {
     await new Promise(resolve => setTimeout(resolve, 500));
     const index = MOCK_POSTS.findIndex(p => p.id === id);
     if (index === -1) throw new Error("Post not found");
     
     MOCK_POSTS[index] = { ...MOCK_POSTS[index], ...updates };
     return MOCK_POSTS[index];
  },
  
  deletePost: async (id: string): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = MOCK_POSTS.findIndex(p => p.id === id);
      if (index !== -1) MOCK_POSTS.splice(index, 1);
  },

  // Case Studies
  getCaseStudies: async (): Promise<CaseStudy[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_CASE_STUDIES];
  },

  getCaseStudyBySlug: async (slug: string): Promise<CaseStudy | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_CASE_STUDIES.find(c => c.slug === slug);
  },
  
  createCaseStudy: async (study: Omit<CaseStudy, 'id' | 'publishedAt'>): Promise<CaseStudy> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newStudy: CaseStudy = {
        ...study,
        id: Math.random().toString(36).substr(2, 9),
        publishedAt: new Date().toISOString()
    };
    MOCK_CASE_STUDIES.push(newStudy);
    return newStudy;
  },

  // Auth (Mock)
  login: async (password: string): Promise<boolean> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return password === 'admin123'; // Simple mock password
  }
};
