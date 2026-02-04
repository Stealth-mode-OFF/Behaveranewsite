export type Author = {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML content from rich text editor
  coverImage?: string;
  author: Author;
  publishedAt: string;
  tags: string[];
  status: 'draft' | 'published';
};

export type BlogPostFormData = Omit<BlogPost, 'id' | 'author' | 'publishedAt'>;

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  results: CaseStudyResult[];
  content: string;
  coverImage?: string;
  publishedAt: string;
  status: 'draft' | 'published';
};

export type CaseStudyResult = {
  label: string;
  value: string;
};

export type CaseStudyFormData = Omit<CaseStudy, 'id' | 'publishedAt'>;

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
};
