import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const SITE_ORIGIN = 'https://www.behavera.com';

const blogContentPath = join(repoRoot, 'src/lib/blog-content.ts');
const cmsServicePath = join(repoRoot, 'src/lib/cms-service.ts');
const sitemapPath = join(repoRoot, 'public/sitemap.xml');

const staticRoutes = [
  '/',
  '/terms',
  '/privacy-policy',
  '/blog',
  '/case-studies',
  '/team',
  '/start',
  '/pro-neziskovky',
  '/changelog',
  '/echo-pulse-vs-google-forms',
  '/for-ceos',
  '/for-hr',
  '/for-team-leads',
];

function extractSlugsFromFile(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const slugs = new Set();
  const slugRegex = /slug:[ \t]*['"]([^'"]+)['"]/g;
  let match;

  while ((match = slugRegex.exec(source)) !== null) {
    const slug = match[1].trim();
    if (/^[a-z0-9][a-z0-9-]*$/i.test(slug)) {
      slugs.add(slug);
    }
  }

  return Array.from(slugs);
}

function xmlEscape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

const blogSlugs = extractSlugsFromFile(blogContentPath).sort();
const caseStudySlugs = extractSlugsFromFile(cmsServicePath).sort();

const urls = [
  ...staticRoutes.map((path) => ({ path, changefreq: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? '1.0' : '0.7' })),
  ...blogSlugs.map((slug) => ({ path: `/blog/${slug}`, changefreq: 'monthly', priority: '0.6' })),
  ...caseStudySlugs.map((slug) => ({ path: `/case-studies/${slug}`, changefreq: 'monthly', priority: '0.7' })),
];

const unique = new Map();
for (const url of urls) {
  unique.set(url.path, url);
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Array.from(unique.values()).map(({ path, changefreq, priority }) => {
    const loc = xmlEscape(`${SITE_ORIGIN}${path}`);
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  }),
  '</urlset>',
  '',
].join('\n');

writeFileSync(sitemapPath, xml, 'utf8');

console.log(`Generated sitemap with ${unique.size} URLs`);
console.log(`Blog slugs: ${blogSlugs.length}, case-study slugs: ${caseStudySlugs.length}`);
