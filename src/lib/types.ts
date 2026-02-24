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
  /** Czech title (optional — falls back to `title`) */
  title_cz?: string;
  /** Czech excerpt */
  excerpt_cz?: string;
  /** Czech HTML content */
  content_cz?: string;
  /** German title (optional — falls back to `title`) */
  title_de?: string;
  /** German excerpt */
  excerpt_de?: string;
  /** German HTML content */
  content_de?: string;
  coverImage?: string;
  author: Author;
  publishedAt: string;
  tags: string[];
  status: 'draft' | 'published';
  conversionPrimary?: 'lead' | 'demo' | 'balanced';
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
  tags?: string[];
  employeeCount?: string;
  publishedAt: string;
  status: 'draft' | 'published';
  /** Czech title (optional — falls back to `title`) */
  title_cz?: string;
  /** Czech challenge text */
  challenge_cz?: string;
  /** Czech solution text */
  solution_cz?: string;
  /** Czech HTML content */
  content_cz?: string;
  /** Short narrative summary for card back (optional — falls back to challenge) */
  cardSummary?: string;
  /** Czech card summary */
  cardSummary_cz?: string;
  /** Czech industry label */
  industry_cz?: string;
  /** Czech results labels */
  results_cz?: CaseStudyResult[];
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
