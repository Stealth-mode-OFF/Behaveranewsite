import { marked } from 'marked';
import type { Author, BlogPost } from './types';

type Frontmatter = Record<string, string>;

export const BLOG_MDX_AUTHORS: Author[] = [
  {
    id: 'mdx-1',
    name: 'Behavera Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
    role: 'Research & Insights',
  },
];

const FALLBACK_COVER_IMAGES = [
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200',
];

const rawMdxModules = import.meta.glob('/content/blog/*.mdx', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function removeWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const startsWithSingle = trimmed.startsWith("'") && trimmed.endsWith("'");
    const startsWithDouble = trimmed.startsWith('"') && trimmed.endsWith('"');
    if (startsWithSingle || startsWithDouble) {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
}

function parseFrontmatter(raw: string): { frontmatter: Frontmatter; body: string } {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: normalized.trim() };
  }

  const frontmatterRaw = match[1];
  const body = match[2].trim();
  const frontmatter: Frontmatter = {};

  for (const line of frontmatterRaw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf(':');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = removeWrappingQuotes(trimmed.slice(separator + 1));
    if (key) frontmatter[key] = value;
  }

  return { frontmatter, body };
}

function slugFromPath(path: string): string {
  const file = path.split('/').pop() || '';
  const noExt = file.replace(/\.mdx$/, '');
  return noExt.replace(/^\d+-/, '');
}

function toTitleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function normalizeMarkdownBody(markdown: string): string {
  const trimmed = markdown.trim();
  if (!trimmed) return trimmed;

  const withoutLeadingH1 = trimmed.replace(/^#\s+.+\n+/, '');
  return withoutLeadingH1.trim();
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/\*\*|__|~~|\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildExcerpt(frontmatter: Frontmatter, markdownBody: string): string {
  const fromMeta = frontmatter.meta_description?.trim();
  if (fromMeta) return fromMeta;

  const plain = markdownToPlainText(markdownBody);
  if (plain.length <= 220) return plain;
  return `${plain.slice(0, 217).trimEnd()}...`;
}

function parsePublishedAt(frontmatter: Frontmatter): string {
  const value = frontmatter.published_at?.trim();
  if (!value) return new Date(0).toISOString();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date(0).toISOString();
  return date.toISOString();
}

function buildTags(frontmatter: Frontmatter): string[] {
  const tags: string[] = [];
  if (frontmatter.persona) tags.push(frontmatter.persona.toUpperCase());
  if (frontmatter.funnel) tags.push(frontmatter.funnel.toUpperCase());
  if (tags.length === 0) tags.push('Blog');
  return tags;
}

function toBlogPost(path: string, raw: string, index: number): BlogPost {
  const { frontmatter, body } = parseFrontmatter(raw);
  const slug = frontmatter.slug || slugFromPath(path);
  const title = frontmatter.title || toTitleFromSlug(slug);
  const markdownBody = normalizeMarkdownBody(body);
  const rendered = marked.parse(markdownBody, {
    gfm: true,
    breaks: false,
  }) as string;
  const coverImage = frontmatter.cover_image?.trim() || FALLBACK_COVER_IMAGES[index % FALLBACK_COVER_IMAGES.length];

  return {
    id: `mdx-${String(index + 1).padStart(3, '0')}`,
    title,
    title_cz: title,
    slug,
    excerpt: buildExcerpt(frontmatter, markdownBody),
    excerpt_cz: buildExcerpt(frontmatter, markdownBody),
    content: rendered,
    content_cz: rendered,
    coverImage,
    author: BLOG_MDX_AUTHORS[0],
    publishedAt: parsePublishedAt(frontmatter),
    tags: buildTags(frontmatter),
    status: 'published',
    conversionPrimary: 'balanced',
  };
}

const parsedMdxPosts = Object.entries(rawMdxModules)
  .map(([path, raw], index) => toBlogPost(path, raw, index))
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const BLOG_MDX_POSTS: BlogPost[] = parsedMdxPosts;
