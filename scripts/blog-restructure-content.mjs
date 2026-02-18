#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sourceFile = path.join(root, 'src/lib/blog-content.ts');

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordCount(text) {
  const normalized = text.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

function pickSplitPoint(words, target, minTail = 20) {
  let split = -1;

  for (let delta = 0; delta < 22; delta += 1) {
    const right = target + delta;
    const left = target - delta;

    if (right > 18 && right < words.length - minTail && /[.!?;:]["']?$/.test(words[right])) {
      split = right + 1;
      break;
    }
    if (left > 18 && left < words.length - minTail && /[.!?;:]["']?$/.test(words[left])) {
      split = left + 1;
      break;
    }
  }

  if (split === -1) split = target;
  if (split < 18 || split > words.length - minTail) return -1;
  return split;
}

function chunkTextByWords(text, maxWords = 85) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return [text.trim()];

  const chunks = [];
  let start = 0;

  while (start < words.length) {
    const remaining = words.length - start;
    if (remaining <= maxWords) {
      chunks.push(words.slice(start).join(' '));
      break;
    }

    const target = start + maxWords;
    const local = words.slice(start);
    const localTarget = Math.min(maxWords, local.length - 20);
    const localSplit = pickSplitPoint(local, localTarget, 16);
    const split = localSplit === -1 ? target : start + localSplit;

    chunks.push(words.slice(start, split).join(' '));
    start = split;
  }

  return chunks.filter(Boolean);
}

function normalizeOneItemLists(html) {
  return html.replace(/<ul>\s*<li>([\s\S]*?)<\/li>\s*<\/ul>/gi, (_m, inner) => {
    const text = stripHtml(inner);
    return text ? `<p>${text}</p>` : '';
  });
}

function flattenLongBlockquotes(html) {
  return html.replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (match, inner) => {
    const text = stripHtml(inner);
    if (wordCount(text) > 90) {
      return `<p>${text}</p>`;
    }
    return match;
  });
}

function splitLongParagraphs(html) {
  return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, inner) => {
    const text = stripHtml(inner);
    if (wordCount(text) <= 95) return match;

    const chunks = chunkTextByWords(text, 85);
    if (chunks.length <= 1) return match;

    return chunks
      .map((chunk, idx) => (idx === 0 ? `<p${attrs}>${chunk}</p>` : `<p>${chunk}</p>`))
      .join('\n');
  });
}

function ensureMinH2(html, lang) {
  const textWords = wordCount(stripHtml(html));
  const h2Count = (html.match(/<h2\b/gi) || []).length;
  if (textWords <= 700 || h2Count >= 3) return html;

  const titles = lang === 'cz'
    ? ['Klíčový kontext', 'Co to znamená v praxi', 'Doporučený další krok']
    : ['Key context', 'What this means in practice', 'Recommended next step'];

  const needed = 3 - h2Count;
  const blocks = html.match(/<(?:h2|h3|p|blockquote|ul|ol)[^>]*>[\s\S]*?<\/(?:h2|h3|p|blockquote|ul|ol)>/gi);
  if (!blocks || blocks.length < 2) {
    const added = titles.slice(0, needed).map((title) => `<h2>${title}</h2>`).join('\n');
    return `${added}\n${html}`;
  }

  const insertBefore = new Map();
  for (let i = 0; i < needed; i += 1) {
    let pos = Math.floor(((i + 1) * blocks.length) / (needed + 1));
    if (pos < 1) pos = 1;
    while (insertBefore.has(pos) && pos < blocks.length) pos += 1;
    insertBefore.set(pos, titles[i]);
  }

  const result = [];
  blocks.forEach((block, idx) => {
    if (insertBefore.has(idx)) {
      result.push(`<h2>${insertBefore.get(idx)}</h2>`);
    }
    result.push(block);
  });

  const rebuilt = result.join('\n');
  const originalLen = stripHtml(html).length;
  const rebuiltLen = stripHtml(rebuilt).length;
  if (rebuiltLen < originalLen * 0.85) return html;

  return rebuilt;
}

function wrapLeadWords(inner, tag, count) {
  const plain = inner.trim();
  if (!plain || plain.startsWith('<')) return null;
  const words = plain.split(/\s+/);
  if (words.length < count + 4) return null;
  const lead = words.slice(0, count).join(' ');
  const tail = words.slice(count).join(' ');
  return `<${tag}>${lead}</${tag}> ${tail}`;
}

function enrichEmphasis(html) {
  let strongCount = (html.match(/<strong\b/gi) || []).length;
  let emCount = (html.match(/<em\b/gi) || []).length;
  let strongNeeded = Math.max(0, 3 - strongCount);
  let emNeeded = Math.max(0, 2 - emCount);

  if (strongNeeded === 0 && emNeeded === 0) return html;

  const out = html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, inner) => {
    if (strongNeeded === 0 && emNeeded === 0) return match;
    if (/<(strong|em|img|a)\b/i.test(inner)) return match;

    const text = stripHtml(inner);
    if (wordCount(text) < 12) return match;

    if (strongNeeded > 0) {
      let updated = inner.replace(/^\s*([^<]{18,160}?)([\.,!?:;](?:\s|$))/u, (_m, lead, end) => {
        return `<strong>${lead.trim()}</strong>${end}`;
      });
      if (updated === inner) {
        const fallback = wrapLeadWords(inner, 'strong', 9);
        if (fallback) updated = fallback;
      }
      if (updated !== inner) {
        strongNeeded -= 1;
        strongCount += 1;
        return `<p${attrs}>${updated}</p>`;
      }
    }

    if (emNeeded > 0) {
      let updated = inner.replace(/^\s*([^<]{16,130}?)([\.,!?:;](?:\s|$))/u, (_m, lead, end) => {
        return `<em>${lead.trim()}</em>${end}`;
      });
      if (updated === inner) {
        const fallback = wrapLeadWords(inner, 'em', 8);
        if (fallback) updated = fallback;
      }
      if (updated !== inner) {
        emNeeded -= 1;
        emCount += 1;
        return `<p${attrs}>${updated}</p>`;
      }
    }

    return match;
  });

  return out;
}

function transformLanguage(html, lang) {
  let output = html;
  output = normalizeOneItemLists(output);
  output = flattenLongBlockquotes(output);
  output = splitLongParagraphs(output);
  output = ensureMinH2(output, lang);
  output = enrichEmphasis(output);
  output = output.replace(/\n{3,}/g, '\n\n').trim();
  return output;
}

function main() {
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const re = /(\{\s*id:\s*'[^']+'[\s\S]*?content:\s*`)([\s\S]*?)(`,\s*content_cz:\s*`)([\s\S]*?)(`,)/g;

  let count = 0;
  const transformed = raw.replace(re, (_m, start, en, middle, cz, end) => {
    count += 1;
    const newEn = transformLanguage(en, 'en');
    const newCz = transformLanguage(cz, 'cz');
    return `${start}\n${newEn}\n${middle}\n${newCz}\n${end}`;
  });

  fs.writeFileSync(sourceFile, transformed, 'utf8');
  console.log(`Updated ${count} posts in src/lib/blog-content.ts`);
}

main();
