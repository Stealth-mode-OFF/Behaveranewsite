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
  "img",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class", "id"];

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

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
  /Behavera (od |by )?Behaver/i,
  /Use Behavera['']s Behavera/i,
  /Využijte k tomu Behavera/i,
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

function toSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Clean up scraped blog content:
 * - Remove paragraphs with embedded promotional CTAs
 * - Fix broken h2 tags that are mid-sentence continuations (demote to <p><strong>)
 * - Remove empty <li> elements
 */
function cleanBlogContent(html: string): string {
  html = html.replace(/<p[^>]*>([^<]*(?:<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*)<\/p>/gi, (match, inner) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    if (PROMO_PATTERNS.some((p) => p.test(text))) return "";
    return match;
  });

  html = html.replace(/<h2>([a-záčďéěíňóřšťúůýž])/gi, (_m, firstChar) => {
    if (firstChar === firstChar.toLowerCase()) {
      return `<p><strong>${firstChar}`;
    }
    return _m;
  });
  html = html.replace(/<p><strong>([^<]+)<\/h2>/gi, "<p><strong>$1</strong></p>");

  html = html.replace(/<h2>Behavera tento systém poskytuje<\/h2>/gi, "");
  html = html.replace(/<h2>Behavera is completely free[^<]*<\/h2>/gi, "");

  html = html.replace(/<ul>\s*<li>\s*<\/li>\s*<\/ul>/gi, "");
  html = html.replace(/<li>\s*<\/li>/gi, "");

  html = html.replace(/\n{3,}/g, "\n\n");
  return html.trim();
}

/**
 * Add deterministic ids to h2/h3 headings for TOC and deep-linking.
 */
function addHeadingIds(html: string): string {
  if (typeof window === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return html;

  const used = new Map<string, number>();
  const headings = root.querySelectorAll("h2, h3");
  headings.forEach((heading) => {
    const text = (heading.textContent || "").trim();
    if (!text) return;

    const base = toSlug(text) || "section";
    const count = (used.get(base) || 0) + 1;
    used.set(base, count);
    const id = count === 1 ? base : `${base}-${count}`;
    heading.setAttribute("id", id);
  });

  return root.innerHTML;
}

export function extractHeadingsFromHtml(html: string): BlogHeading[] {
  if (typeof window === "undefined") return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [];

  return Array.from(root.querySelectorAll("h2, h3"))
    .map((el) => {
      const id = el.getAttribute("id") || "";
      const text = (el.textContent || "").trim();
      const level = el.tagName.toLowerCase() === "h3" ? 3 : 2;
      return { id, text, level } as BlogHeading;
    })
    .filter((h) => h.id && h.text);
}

export const sanitizeHtml = (dirty: string): string => {
  if (typeof window === "undefined") return dirty;
  const cleaned = cleanBlogContent(dirty);
  const withHeadingIds = addHeadingIds(cleaned);
  return DOMPurify.sanitize(withHeadingIds, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
};
