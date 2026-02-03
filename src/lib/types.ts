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

export type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  challenge: string;
  solution: string;
  results: {
    label: string;
    value: string;
  }[];
  content: string;
  coverImage?: string;
  publishedAt: string;
  status: 'draft' | 'published';
};

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'editor';
};
