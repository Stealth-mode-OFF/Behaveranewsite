/**
 * Post-build script: generates static HTML pages with article-specific Open Graph
 * tags. Crawlers get correct metadata without SSR.
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const blogContentDir = join(__dirname, '..', 'content', 'blog');
const SITE_URL = 'https://cz.behavera.com';

const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

const FALLBACK_BLOG_IMAGES = [
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200',
];

function removeWrappingQuotes(value) {
  const trimmed = value.trim();
  if (trimmed.length >= 2) {
    const isSingle = trimmed.startsWith("'") && trimmed.endsWith("'");
    const isDouble = trimmed.startsWith('"') && trimmed.endsWith('"');
    if (isSingle || isDouble) {
      return trimmed.slice(1, -1).trim();
    }
  }
  return trimmed;
}

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: normalized.trim() };
  }

  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf(':');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = removeWrappingQuotes(trimmed.slice(separator + 1));
    if (key) frontmatter[key] = value;
  }

  return { frontmatter, body: match[2].trim() };
}

function markdownToPlainText(markdown) {
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

function slugFromFileName(fileName) {
  return fileName.replace(/\.mdx$/, '').replace(/^\d+-/, '');
}

function loadBlogPostsFromMdx() {
  const files = readdirSync(blogContentDir)
    .filter((file) => file.endsWith('.mdx'))
    .sort((a, b) => a.localeCompare(b));

  return files
    .map((file, index) => {
      const raw = readFileSync(join(blogContentDir, file), 'utf-8');
      const { frontmatter, body } = parseFrontmatter(raw);
      const slug = frontmatter.slug || slugFromFileName(file);
      const title = frontmatter.title || slug.replace(/-/g, ' ');
      const plainBody = markdownToPlainText(body.replace(/^#\s+.+\n+/, '').trim());
      const desc = frontmatter.meta_description || (plainBody.length > 220 ? `${plainBody.slice(0, 217).trimEnd()}...` : plainBody);
      const publishedAt = frontmatter.published_at ? new Date(frontmatter.published_at) : new Date(0);

      return {
        slug,
        title,
        desc,
        image: FALLBACK_BLOG_IMAGES[index % FALLBACK_BLOG_IMAGES.length],
        publishedAt: Number.isNaN(publishedAt.getTime()) ? new Date(0) : publishedAt,
      };
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .map(({ publishedAt, ...post }) => post);
}

const blogPosts = loadBlogPostsFromMdx();

const caseStudies = [
  {
    slug: 'za-3-minuty-jasno-jak-na-employer-branding',
    title: 'Za 3 minuty jasno, jak na Employer Branding — Průša Research',
    desc: 'Průša Research chtěla ověřit, jak jsou klíčové hodnoty a firemní kultura vnímány napříč organizací, a získat datový podklad pro strategická rozhodnutí.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'jak-expando-objevilo-skryty-talent',
    title: 'Jak Expando objevilo skrytý talent a otevřelo nové obchodní příležitosti',
    desc: 'Expando chtělo růst za hranice Amazonu, ale interně vládl chaos. Motivace klesala a týmy ztrácely čas hloubkovými rozhovory se zkreslenými výsledky.',
    image: 'https://cdn.prod.website-files.com/63d2c5297fe3f5119d5e8eba/68932021e3812af317591450_2025-05-13-expando-by-lukasneasi-48%20(1).jpg',
  },
  {
    slug: 'nove-vedeni-a-stiznosti-na-penize',
    title: 'Nové vedení a stížnosti na peníze. Behavera odhalila skutečný problém.',
    desc: 'Nové vedení čelilo záplavě stížností na pracovní zátěž a platy, stresové atmosféře, nedůvěře a nejistotě v týmech.',
    image: 'https://cdn.prod.website-files.com/63d2c5297fe3f5119d5e8eba/67c9b914d0abe99293d51d3b_Karel%20Valxon%202.jpeg',
  },
  {
    slug: 'from-data-to-action-how-vodafone-increased-sales-by-80-and-cut-attrition-by-40',
    title: 'Jak Vodafone zvýšil výkon a retenci díky datově řízenému talent managementu',
    desc: 'Vodafone čelil vysoké fluktuaci, nekonzistentnímu výkonu a nejasným profilům úspěšnosti.',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'how-behaveras-data-helped-365-bank-achieve-a-successful-digital-transformation',
    title: 'Jak data od Behavery pomohla 365.bank k úspěšné digitální transformaci',
    desc: 'Transformace na plně digitální banku vyžadovala kompletní kulturní a manažerskou změnu. Tradiční metody náboru nedokázaly identifikovat správné lidi.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  },
];

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generatePage(pagePath, { title, desc, image }) {
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
  const ogUrl = `${SITE_URL}${pagePath}`;
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(desc);

  let html = baseHtml;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle} | Behavera</title>`);
  html = html.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${safeTitle}"`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${safeDesc}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${ogUrl}"`);
  html = html.replace(/<meta property="og:type" content="[^"]*"/, '<meta property="og:type" content="article"');
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${ogUrl}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${safeTitle}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${safeDesc}"`);
  html = html.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${ogImage}"`);
  html = html.replace(/<meta property="twitter:url" content="[^"]*"/, `<meta property="twitter:url" content="${ogUrl}"`);
  html = html.replace(/<meta property="twitter:title" content="[^"]*"/, `<meta property="twitter:title" content="${safeTitle}"`);
  html = html.replace(/<meta property="twitter:description" content="[^"]*"/, `<meta property="twitter:description" content="${safeDesc}"`);
  html = html.replace(/<meta property="twitter:image" content="[^"]*"/, `<meta property="twitter:image" content="${ogImage}"`);

  const segments = pagePath.split('/').filter(Boolean);
  const dir = join(distDir, ...segments);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf-8');
}

let count = 0;

for (const post of blogPosts) {
  generatePage(`/blog/${post.slug}`, post);
  count += 1;
}

for (const study of caseStudies) {
  generatePage(`/case-studies/${study.slug}`, study);
  count += 1;
}

console.log(`✅ Generated ${count} OG pages (${blogPosts.length} blog + ${caseStudies.length} case studies)`);
