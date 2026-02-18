import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "a",
  "p",
  "br",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "code",
  "pre",
  "span",
  "img"
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class"];

/**
 * Patterns that indicate embedded promotional/CTA content from scraping.
 * Paragraphs matching any of these are stripped from article HTML.
 */
const PROMO_PATTERNS = [
  /Book a demo/i,
  /Domluvte? si demo/i,
  /Sign up here/i,
  /Zaregistrujte se (zde|zdarma)/i,
  /\+420\s*724\s*256\s*447/,
  /hello@behavera\.com/i,
  /Echo Pulse (od |by )?Behaver/i,
  /Use Behavera['']s Echo Pulse/i,
  /Využijte k tomu Echo Pulse/i,
  /Behavera is completely free/i,
  /zcela zdarma/i,
  /Try our free Well-being Index/i,
  /Vyzkoušejte Behaveru ještě dnes/i,
  /Would you like to try Behavera/i,
  /Chcete si vyzkoušet Behavera/i,
  /Chcete se dozvědět více o Behavera/i,
  /Would you like to learn more about Behavera/i,
  /napište nám na hello/i,
  /Email us at hello/i,
];

/**
 * Clean up scraped blog content:
 * - Remove paragraphs with embedded promotional CTAs
 * - Fix broken h2 tags that are mid-sentence continuations (demote to <p><strong>)
 * - Remove empty <li> elements
 * - Remove trailing promotional blockquotes
 */
function cleanBlogContent(html: string): string {
  // 1. Remove <p> tags that are purely promotional
  html = html.replace(/<p[^>]*>([^<]*(?:<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*)<\/p>/gi, (match, inner) => {
    const text = inner.replace(/<[^>]*>/g, '').trim();
    if (PROMO_PATTERNS.some(p => p.test(text))) return '';
    return match;
  });

  // 2. Fix broken h2 tags that start with lowercase or are sentence continuations
  //    e.g. <h2>engagement can be supported</h2> → <p><strong>engagement can be supported</strong></p>
  html = html.replace(/<h2>([a-záčďéěíňóřšťúůýž])/gi, (_m, firstChar) => {
    if (firstChar === firstChar.toLowerCase()) {
      return `<p><strong>${firstChar}`;
    }
    return _m;
  });
  // Close the demoted h2→strong properly
  html = html.replace(/<p><strong>([^<]+)<\/h2>/gi, '<p><strong>$1</strong></p>');

  // 3. Remove specific broken h2s that are product pitches
  html = html.replace(/<h2>Behavera tento systém poskytuje<\/h2>/gi, '');
  html = html.replace(/<h2>Behavera is completely free[^<]*<\/h2>/gi, '');

  // 4. Remove empty <li> tags and their wrappers
  html = html.replace(/<ul>\s*<li>\s*<\/li>\s*<\/ul>/gi, '');
  html = html.replace(/<li>\s*<\/li>/gi, '');

  // 5. Remove consecutive empty lines / whitespace
  html = html.replace(/\n{3,}/g, '\n\n');

  return html.trim();
}

export const sanitizeHtml = (dirty: string): string => {
  if (typeof window === "undefined") return dirty;
  const cleaned = cleanBlogContent(dirty);
  return DOMPurify.sanitize(cleaned, {
    ALLOWED_TAGS,
    ALLOWED_ATTR
  });
};
