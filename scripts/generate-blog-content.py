#!/usr/bin/env python3
"""
Parse articles.txt (CZ) and articles_en.txt (EN) and generate blog-content.ts
with full original article content as HTML.
"""

import re
import json
import html

# ── Configuration ──────────────────────────────────────────────────────

# Map from URL slug to our blog slug + metadata
POSTS_META = [
    {
        "id": "1",
        "url_slug": "5-leaders-share-7-tips-to-kickstart-your-leadership",
        "slug": "5-leaders-share-7-tips-to-kickstart-your-leadership",
        "author_idx": 0,
        "publishedAt": "2025-09-17T00:00:00.000Z",
        "tags": ["Leadership"],
        "coverImage": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "2",
        "url_slug": "office-time-productive-time-or-is-it",
        "slug": "office-time-productive-time-or-is-it",
        "author_idx": 1,
        "publishedAt": "2025-08-18T00:00:00.000Z",
        "tags": ["Remote Work"],
        "coverImage": "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "3",
        "url_slug": "the-creeping-killer-of-your-business-act-before-it-costs-you-millions",
        "slug": "the-creeping-killer-of-your-business",
        "author_idx": 0,
        "publishedAt": "2025-05-19T00:00:00.000Z",
        "tags": ["Leadership"],
        "coverImage": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "4",
        "url_slug": "hiring-only-top-performing-sales-reps",
        "slug": "hiring-only-top-performing-sales-reps",
        "author_idx": 2,
        "publishedAt": "2025-06-05T00:00:00.000Z",
        "tags": ["Future of Work"],
        "coverImage": "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "5",
        "url_slug": "valxons-discovery-journey-of-the-truth-behind-money-complaints",
        "slug": "valxons-discovery-journey-of-the-truth-behind-money-complaints",
        "author_idx": 2,
        "publishedAt": "2025-04-20T00:00:00.000Z",
        "tags": ["Well-being"],
        "coverImage": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "6",
        "url_slug": "https-www-behavera-com-blog-recruiters-will-have-nothing-left-to-feed-on",
        "slug": "old-school-recruiting-is-the-new-blackberry",
        "author_idx": 1,
        "publishedAt": "2025-03-15T00:00:00.000Z",
        "tags": ["Future of Work"],
        "coverImage": "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "7",
        "url_slug": "how-to-do-1-1-meetings-effectively-what-works-for-experienced-leaders",
        "slug": "how-to-do-1-1-meetings-effectively",
        "author_idx": 0,
        "publishedAt": "2025-07-10T00:00:00.000Z",
        "tags": ["Leadership"],
        "coverImage": "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "8",
        "url_slug": "busting-6-myths-about-well-being-in-companies",
        "slug": "busting-6-myths-about-well-being-in-companies",
        "author_idx": 2,
        "publishedAt": "2024-11-08T00:00:00.000Z",
        "tags": ["HR Tips"],
        "coverImage": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "9",
        "url_slug": "well-being-of-leaders-at-risk-how-to-take-care-of-yourself",
        "slug": "well-being-of-leaders-at-risk",
        "author_idx": 1,
        "publishedAt": "2024-09-22T00:00:00.000Z",
        "tags": ["Well-being"],
        "coverImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "10",
        "url_slug": "hr-conferences-2023-overview-international-online-events",
        "slug": "hr-conferences-2023-international-online-events",
        "author_idx": 2,
        "publishedAt": "2024-08-01T00:00:00.000Z",
        "tags": ["HR Tips"],
        "coverImage": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "11",
        "url_slug": "hr-conferences-2023-overview-best-events-in-czechia-and-slovakia",
        "slug": "hr-conferences-2023-czechia-and-slovakia",
        "author_idx": 2,
        "publishedAt": "2024-07-15T00:00:00.000Z",
        "tags": ["HR Tips"],
        "coverImage": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "12",
        "url_slug": "behavera-well-being-index-modern-happiness-survey-recommendations",
        "slug": "behavera-well-being-index",
        "author_idx": 2,
        "publishedAt": "2024-06-10T00:00:00.000Z",
        "tags": ["Well-being"],
        "coverImage": "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "13",
        "url_slug": "how-to-deal-with-well-being-effectively",
        "slug": "how-to-deal-with-well-being-effectively",
        "author_idx": 1,
        "publishedAt": "2024-05-05T00:00:00.000Z",
        "tags": ["Well-being"],
        "coverImage": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "14",
        "url_slug": "7-tips-for-improving-employee-engagement-in-hybrid-work-model-setup",
        "slug": "7-tips-for-improving-employee-engagement-in-hybrid-work",
        "author_idx": 2,
        "publishedAt": "2024-03-18T00:00:00.000Z",
        "tags": ["Remote Work"],
        "coverImage": "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "15",
        "url_slug": "inspiring-ted-talks-for-hr-professionals-and-leaders",
        "slug": "inspiring-ted-talks-for-hr-professionals",
        "author_idx": 0,
        "publishedAt": "2024-02-12T00:00:00.000Z",
        "tags": ["HR Tips"],
        "coverImage": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "16",
        "url_slug": "5-trends-that-will-transform-the-way-we-work",
        "slug": "5-trends-that-will-transform-the-way-we-work",
        "author_idx": 2,
        "publishedAt": "2024-01-08T00:00:00.000Z",
        "tags": ["Future of Work"],
        "coverImage": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200",
    },
    {
        "id": "17",
        "url_slug": "the-future-of-work-is-in-the-people-first-approach",
        "slug": "the-future-of-work-is-in-the-people-first-approach",
        "author_idx": 0,
        "publishedAt": "2023-11-20T00:00:00.000Z",
        "tags": ["Future of Work"],
        "coverImage": "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&q=80&w=1200",
    },
]

# ── Parser ─────────────────────────────────────────────────────────────

def parse_articles_file(filepath):
    """Parse a scraped articles txt file into a dict keyed by URL slug."""
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    # Find all article headers using regex
    # Pattern: ===...\n[N] Title\nURL: ...\n...\n===...\n<content until next ===...>
    header_pattern = re.compile(
        r'={10,}\n'
        r'\[(\d+)\]\s+(.+?)\n'
        r'URL:\s+(\S+)\n'
        r'.*?\n'  # Datum, Autor, Jazyk lines
        r'.*?\n'
        r'.*?\n'
        r'={10,}\n',
        re.DOTALL
    )

    headers = list(header_pattern.finditer(text))
    articles = {}

    for i, m in enumerate(headers):
        num = m.group(1)
        title = m.group(2).strip()
        url = m.group(3).strip()

        url_slug = url.rstrip('/').split('/blog/')[-1] if '/blog/' in url else ''

        content_start = m.end()
        content_end = headers[i + 1].start() if i + 1 < len(headers) else len(text)
        raw_content = text[content_start:content_end].strip()

        articles[url_slug] = {
            "num": num,
            "title": title,
            "url": url,
            "raw_content": raw_content,
        }

    return articles


def extract_article_body(raw_content, title, lang="en"):
    """
    Extract the actual article body from the raw scraped content.
    The raw content includes navigation, the article, and footer.
    We need to strip nav and footer.
    """
    lines = raw_content.split('\n')

    # Find the article start: after "Book a Demo" or "Naplánujte si demo"
    # then the title is repeated, followed by excerpt, author, date, then content
    start_idx = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped in ("Book a Demo", "Naplánujte si demo"):
            start_idx = i + 1
            break

    # From start_idx, find the title line (it should be next non-empty)
    title_idx = start_idx
    for i in range(start_idx, len(lines)):
        if lines[i].strip():
            title_idx = i
            break

    # After title comes excerpt (1-2 lines), then author name, then date, then content
    # Find the author/date pattern: "Name\nDate\n•\nN mins" or similar
    # Pattern: look for a line with a date pattern
    body_start = title_idx
    
    # Skip: title, excerpt, author, date, reading time
    # Find the "mins" or "minut" line which marks end of metadata
    for i in range(title_idx, min(title_idx + 20, len(lines))):
        stripped = lines[i].strip()
        if re.match(r'^\d+\s+min', stripped) or stripped in ('‍',):
            # Check if this is the reading time line
            if re.match(r'^\d+\s+min', stripped):
                body_start = i + 1
                break
    
    # Skip any leading ‍ (zero-width joiner used as spacer)
    for i in range(body_start, len(lines)):
        if lines[i].strip() and lines[i].strip() != '‍':
            body_start = i
            break

    # Find the article end - look for footer markers
    end_markers_en = [
        "Try Now!",
        "Přihlášeno k odběru.",
        "Echo Pulse is completely free",
    ]
    end_markers_cz = [
        "Vyzkoušejte nyní!",
        "Přihlášeno k odběru.",
        "Echo Pulse je zcela zdarma",
    ]
    end_markers = end_markers_en + end_markers_cz

    body_end = len(lines)
    for i in range(body_start, len(lines)):
        stripped = lines[i].strip()
        if stripped in end_markers:
            body_end = i
            break

    # Extract body lines
    body_lines = lines[body_start:body_end]

    # Strip trailing empty lines and ‍
    while body_lines and (not body_lines[-1].strip() or body_lines[-1].strip() == '‍'):
        body_lines.pop()

    return body_lines


def get_excerpt_and_title(raw_content, lang="en"):
    """Extract the title and excerpt from the article raw content."""
    lines = raw_content.split('\n')

    start_idx = 0
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped in ("Book a Demo", "Naplánujte si demo"):
            start_idx = i + 1
            break

    # Find first non-empty line = title
    title = ""
    excerpt_lines = []
    title_found = False
    excerpt_start = 0

    for i in range(start_idx, len(lines)):
        s = lines[i].strip()
        if s and not title_found:
            title = s
            title_found = True
            excerpt_start = i + 1
            continue
        if title_found:
            # Excerpt is until we hit the author name (usually a short name like "Veronika Nováková")
            # Author is followed by a date line
            # Heuristic: excerpt ends when we see a line that looks like author name
            # (2-3 words, capitalized) followed by a date-like line
            if s and excerpt_start > 0:
                # Check if next non-empty line looks like a date
                next_lines = [lines[j].strip() for j in range(i+1, min(i+5, len(lines))) if lines[j].strip()]
                is_date = False
                for nl in next_lines[:2]:
                    if re.match(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2}\.\s)', nl):
                        is_date = True
                        break
                    if re.match(r'\d{1,2}\.\s+(ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince|září)', nl):
                        is_date = True
                        break
                if is_date and len(s.split()) <= 4:
                    # This is the author name, excerpt is everything between title and here
                    break
                excerpt_lines.append(s)

    excerpt = ' '.join(excerpt_lines).strip()
    # Truncate excerpt if too long
    if len(excerpt) > 300:
        excerpt = excerpt[:297] + '...'

    return title, excerpt


def preprocess_lines(body_lines):
    """
    Merge orphan short lines (link text on separate lines from scraping) 
    back into their surrounding paragraphs.
    """
    merged = []
    i = 0
    while i < len(body_lines):
        stripped = body_lines[i].strip()

        # Skip empty / spacer
        if not stripped or stripped == '‍':
            merged.append('')
            i += 1
            continue

        # Collect a group of consecutive non-empty lines
        group = [stripped]
        j = i + 1
        while j < len(body_lines):
            ns = body_lines[j].strip()
            if not ns or ns == '‍':
                break
            group.append(ns)
            j += 1

        # Now decide: is this group a heading, list items, or paragraph(s)?
        # We'll join them and add as a single chunk, let the HTML converter handle it
        merged.append('\n'.join(group))
        i = j

    return merged


def is_heading_line(line):
    """
    Determine if a line is a section heading.
    Only match clear heading patterns to avoid false positives.
    """
    s = line.strip()
    if not s:
        return False

    # Numbered headings: "1. Title", "2) Title"
    if re.match(r'^\d+[\.\)]\s+\S', s) and len(s) < 120:
        return True

    # Named patterns: "Tip N", "Mýtus N", "Myth N"
    if re.match(r'^(Tip|Mýtus|Myth|Trend|Krok|Step)\s+\d', s, re.IGNORECASE):
        return True

    # "Where to Start:" style headings
    if re.match(r'^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ][^.!?]*:$', s) and len(s) < 80:
        return True

    # All-important heading patterns from the articles
    heading_keywords = [
        r'^Where to [Ss]tart',
        r'^How to ',
        r'^What (leaders|companies|managers|you)',
        r'^The (Hidden|Real|True|Business|Big)',
        r'^Why ',
        r'^Getting [Ss]tarted',
        r'^Sources:?$',
        r'^Zdroje:?$',
        r'^Kde začít',
        r'^Jak (začít|na to)',
        r'^Co (může|mohou|dělat)',
        r'^Na co ',
        r'^Proč ',
        r'^Meet your team',
        r'^Seznamte se',
        r'^Nahlédněme',
        r'^Let.s Take a Look',
        r'^Find Out',
        r'^Zjišťujte',
        r'^Úspěšný lídr',
        r'^A Successful Leader',
        r'^Listen with Behavera',
        r'^Poslouchejte s Behavera',
        r'^Závěr',
        r'^Conclusion',
        r'^Summary',
        r'^Shrnutí',
        r'^Bonus:',
    ]
    for pat in heading_keywords:
        if re.match(pat, s, re.IGNORECASE):
            return True

    return False


def lines_to_html(body_lines):
    """Convert plain text article lines to structured HTML."""

    # Phase 1: Join consecutive non-empty lines into paragraph blocks
    # separated by blank lines
    blocks = []
    current_block = []

    for line in body_lines:
        stripped = line.strip()
        if not stripped or stripped == '‍':
            if current_block:
                blocks.append(current_block)
                current_block = []
        else:
            current_block.append(stripped)

    if current_block:
        blocks.append(current_block)

    # Phase 2: Convert blocks to HTML
    html_parts = []
    first_para = True

    for block in blocks:
        # Join all lines of the block into a single string
        # (this merges orphan link-text lines back into their paragraphs)
        full_text = ' '.join(block)

        # Clean up scraping artifacts: " , " from link separators
        full_text = re.sub(r'\s+,\s+', ', ', full_text)
        full_text = re.sub(r'\s+\.\s+', '. ', full_text)
        full_text = re.sub(r'\s+a\s+', ' a ', full_text)
        full_text = re.sub(r'\s+and\s+', ' and ', full_text)

        # But check if the FIRST line of the block is a heading
        first_line = block[0]

        if is_heading_line(first_line):
            safe_heading = html.escape(first_line)
            html_parts.append(f'<h2>{safe_heading}</h2>')
            # Remaining lines are paragraph content
            if len(block) > 1:
                rest = ' '.join(block[1:])
                rest = re.sub(r'\s+,\s+', ', ', rest)
                safe = html.escape(rest)
                html_parts.append(f'<p>{safe}</p>')
            continue

        # Check for list items (✔️, •, -)
        list_items = []
        non_list = []
        for line in block:
            if re.match(r'^[✔️✅✔•▪►]\s*', line) or (line.startswith('- ') and len(line) > 3):
                list_items.append(line)
            elif line.startswith('✔️ ') or line.startswith('✅ '):
                list_items.append(line)
            else:
                non_list.append(line)

        if list_items and len(list_items) >= len(block) // 2:
            # This is primarily a list block
            if non_list:
                # Non-list lines before the list are a paragraph
                para = ' '.join(non_list)
                safe = html.escape(para)
                html_parts.append(f'<p><strong>{safe}</strong></p>')

            html_parts.append('<ul>')
            for item in list_items:
                item_text = re.sub(r'^[✔️✅✔•▪►\-–]\s*', '', item).strip()
                safe = html.escape(item_text)
                html_parts.append(f'<li>{safe}</li>')
            html_parts.append('</ul>')
            continue

        # Check for blockquote: starts with quotation marks
        if full_text.startswith(('"', '„', '"', '«')):
            safe = html.escape(full_text)
            html_parts.append(f'<blockquote>{safe}</blockquote>')
            continue

        # Regular paragraph
        safe = html.escape(full_text)
        if first_para:
            html_parts.append(f'<p class="lead">{safe}</p>')
            first_para = False
        else:
            html_parts.append(f'<p>{safe}</p>')

    return '\n'.join(html_parts)


def escape_for_template_literal(s):
    """Escape a string for use inside a JS template literal (backticks)."""
    # Escape backticks and ${
    s = s.replace('\\', '\\\\')
    s = s.replace('`', '\\`')
    s = s.replace('${', '\\${')
    return s


def main():
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    cz_file = os.path.join(base_dir, "dist", "articles.txt")
    en_file = os.path.join(base_dir, "dist", "articles_en.txt")

    print("Parsing EN articles...")
    en_articles = parse_articles_file(en_file)
    print(f"  Found {len(en_articles)} articles")
    for slug in en_articles:
        print(f"    - {slug}")

    print("\nParsing CZ articles...")
    cz_articles = parse_articles_file(cz_file)
    print(f"  Found {len(cz_articles)} articles")
    for slug in cz_articles:
        print(f"    - {slug}")

    # Generate blog-content.ts
    output_lines = []
    output_lines.append("""/**
 * Blog Post Content — Bilingual (EN + CZ)
 *
 * Full original articles from behavera.com / cz.behavera.com
 * Auto-generated from scraped article files.
 */

import type { BlogPost, Author } from './types';

// ─── Authors ────────────────────────────────────────────────────────

export const BLOG_AUTHORS: Author[] = [
  {
    id: '1',
    name: 'Veronika Nováková',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    role: 'Content Lead',
  },
  {
    id: '2',
    name: 'Barbora Slouková',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    role: 'People & Culture',
  },
  {
    id: '3',
    name: 'Behavera Team',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150',
    role: 'Research & Insights',
  },
  {
    id: '4',
    name: 'Lenka Šilhánová',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    role: 'Well-being Expert',
  },
];

// ─── Posts ───────────────────────────────────────────────────────────

export const BLOG_POSTS: BlogPost[] = [""")

    for idx, meta in enumerate(POSTS_META):
        url_slug = meta["url_slug"]

        en_art = en_articles.get(url_slug)
        cz_art = cz_articles.get(url_slug)

        if not en_art:
            print(f"\n⚠️  No EN article found for slug: {url_slug}")
            en_title = f"Article {meta['id']}"
            en_excerpt = ""
            en_html = "<p>Content not available.</p>"
        else:
            en_body = extract_article_body(en_art["raw_content"], en_art["title"], "en")
            en_title_ext, en_excerpt = get_excerpt_and_title(en_art["raw_content"], "en")
            en_title = en_art["title"]
            en_html = lines_to_html(en_body)
            print(f"\n✅ EN [{meta['id']}] {en_title}: {len(en_body)} lines -> {len(en_html)} chars HTML")

        if not cz_art:
            print(f"⚠️  No CZ article found for slug: {url_slug}")
            cz_title = ""
            cz_excerpt = ""
            cz_html = ""
        else:
            cz_body = extract_article_body(cz_art["raw_content"], cz_art["title"], "cz")
            cz_title_ext, cz_excerpt = get_excerpt_and_title(cz_art["raw_content"], "cz")
            cz_title = cz_art["title"]
            cz_html = lines_to_html(cz_body)
            print(f"✅ CZ [{meta['id']}] {cz_title}: {len(cz_body)} lines -> {len(cz_html)} chars HTML")

        # Escape for template literals
        en_html_escaped = escape_for_template_literal(en_html)
        cz_html_escaped = escape_for_template_literal(cz_html)
        en_title_escaped = en_title.replace("'", "\\'")
        cz_title_escaped = cz_title.replace("'", "\\'")
        en_excerpt_escaped = en_excerpt.replace("'", "\\'")
        cz_excerpt_escaped = cz_excerpt.replace("'", "\\'")

        tags_str = ', '.join(f"'{t}'" for t in meta["tags"])

        output_lines.append(f"""
  /* ───────────────────────── {meta['id']} ───────────────────────── */
  {{
    id: '{meta["id"]}',
    title: '{en_title_escaped}',
    title_cz: '{cz_title_escaped}',
    slug: '{meta["slug"]}',
    excerpt: '{en_excerpt_escaped}',
    excerpt_cz: '{cz_excerpt_escaped}',
    content: `
{en_html_escaped}
`,
    content_cz: `
{cz_html_escaped}
`,
    coverImage: '{meta["coverImage"]}',
    author: BLOG_AUTHORS[{meta["author_idx"]}],
    publishedAt: '{meta["publishedAt"]}',
    tags: [{tags_str}],
    status: 'published' as const,
  }},""")

    output_lines.append("""
];
""")

    output_path = os.path.join(base_dir, "src", "lib", "blog-content.ts")
    full_output = '\n'.join(output_lines)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(full_output)

    print(f"\n{'='*60}")
    print(f"Generated {output_path}")
    print(f"Total size: {len(full_output)} chars")
    print(f"Posts: {len(POSTS_META)}")


if __name__ == "__main__":
    main()
