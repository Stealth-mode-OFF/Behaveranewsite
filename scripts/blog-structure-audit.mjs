#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sourceFile = path.join(root, 'src/lib/blog-content.ts');

const argOutIndex = process.argv.indexOf('--out');
const outFile = argOutIndex !== -1 ? process.argv[argOutIndex + 1] : null;
const strict = process.argv.includes('--strict');

const PROMO_PATTERNS = [
  /Book a demo/i,
  /Domluvte? si demo/i,
  /Sign up here/i,
  /Zaregistrujte se (zde|zdarma)/i,
  /\+420\s*724\s*256\s*447/,
  /hello@behavera\.com/i,
  /Echo Pulse (od |by )?Behaver/i,
  /Use Behavera['’]s Echo Pulse/i,
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

function decodeHtml(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}

function stripHtml(html) {
  return decodeHtml(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePosts(raw) {
  const re = /\{\s*id:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?content:\s*`([\s\S]*?)`,\s*content_cz:\s*`([\s\S]*?)`,/g;
  const posts = [];
  let match;
  while ((match = re.exec(raw))) {
    posts.push({
      id: match[1],
      title: match[2],
      en: match[3],
      cz: match[4],
    });
  }
  return posts;
}

function countTag(html, tag) {
  return (html.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
}

function maxParagraphWords(html) {
  const paragraphMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
  if (paragraphMatches.length === 0) return 0;
  let max = 0;
  for (const m of paragraphMatches) {
    const text = stripHtml(m[1]);
    const count = text ? text.split(/\s+/).length : 0;
    if (count > max) max = count;
  }
  return max;
}

function wordCount(html) {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

function promoHits(html) {
  const text = stripHtml(html);
  return PROMO_PATTERNS.reduce((acc, pattern) => acc + (pattern.test(text) ? 1 : 0), 0);
}

function measureLang(html) {
  return {
    words: wordCount(html),
    h2: countTag(html, 'h2'),
    h3: countTag(html, 'h3'),
    maxP: maxParagraphWords(html),
    strong: countTag(html, 'strong'),
    em: countTag(html, 'em'),
    blockquote: countTag(html, 'blockquote'),
    promo: promoHits(html),
  };
}

function evaluateGate(m) {
  const issues = [];
  if (m.words > 700 && m.h2 < 3) issues.push('h2<3 for 700+ words');
  if (m.maxP > 110) issues.push('paragraph>110 words');
  if (m.strong < 3) issues.push('few strong markers');
  if (m.em < 2) issues.push('few emphasis markers');
  return issues;
}

function toMd(posts) {
  const now = new Date().toISOString();
  const lines = [];

  lines.push('# Blog Structure Audit');
  lines.push('');
  lines.push(`Generated: ${now}`);
  lines.push('');
  lines.push('## Rules');
  lines.push('');
  lines.push('- For 700+ words: at least 3x `<h2>`');
  lines.push('- Max paragraph length: 110 words');
  lines.push('- Emphasis density: at least 3x `<strong>` and 2x `<em>`');
  lines.push('');

  const total = {
    enWords: 0,
    czWords: 0,
    enGateFail: 0,
    czGateFail: 0,
    posts: posts.length,
  };

  lines.push('## Per Post (EN)');
  lines.push('');
  lines.push('| id | title | words | h2 | h3 | maxP | strong | em | blockquote | promo | gate |');
  lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |');

  for (const post of posts) {
    total.enWords += post.en.words;
    if (post.enIssues.length > 0) total.enGateFail += 1;
    const gate = post.enIssues.length === 0 ? 'PASS' : `FAIL: ${post.enIssues.join(', ')}`;
    lines.push(`| ${post.id} | ${post.title.replace(/\|/g, '\\|')} | ${post.en.words} | ${post.en.h2} | ${post.en.h3} | ${post.en.maxP} | ${post.en.strong} | ${post.en.em} | ${post.en.blockquote} | ${post.en.promo} | ${gate} |`);
  }

  lines.push('');
  lines.push('## Per Post (CZ)');
  lines.push('');
  lines.push('| id | title | words | h2 | h3 | maxP | strong | em | blockquote | promo | gate |');
  lines.push('| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |');

  for (const post of posts) {
    total.czWords += post.cz.words;
    if (post.czIssues.length > 0) total.czGateFail += 1;
    const gate = post.czIssues.length === 0 ? 'PASS' : `FAIL: ${post.czIssues.join(', ')}`;
    lines.push(`| ${post.id} | ${post.title.replace(/\|/g, '\\|')} | ${post.cz.words} | ${post.cz.h2} | ${post.cz.h3} | ${post.cz.maxP} | ${post.cz.strong} | ${post.cz.em} | ${post.cz.blockquote} | ${post.cz.promo} | ${gate} |`);
  }

  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Posts: ${total.posts}`);
  lines.push(`- EN words: ${total.enWords}`);
  lines.push(`- CZ words: ${total.czWords}`);
  lines.push(`- EN gate failures: ${total.enGateFail}/${total.posts}`);
  lines.push(`- CZ gate failures: ${total.czGateFail}/${total.posts}`);

  return { markdown: lines.join('\n'), total };
}

function main() {
  const raw = fs.readFileSync(sourceFile, 'utf8');
  const basePosts = parsePosts(raw);
  const measured = basePosts.map((post) => {
    const en = measureLang(post.en);
    const cz = measureLang(post.cz);
    return {
      ...post,
      en,
      cz,
      enIssues: evaluateGate(en),
      czIssues: evaluateGate(cz),
    };
  });

  const { markdown, total } = toMd(measured);

  if (outFile) {
    const outPath = path.isAbsolute(outFile) ? outFile : path.join(root, outFile);
    fs.writeFileSync(outPath, markdown + '\n', 'utf8');
    console.log(`Wrote ${path.relative(root, outPath)}`);
  } else {
    console.log(markdown);
  }

  if (strict && (total.enGateFail > 0 || total.czGateFail > 0)) {
    process.exitCode = 1;
  }
}

main();
