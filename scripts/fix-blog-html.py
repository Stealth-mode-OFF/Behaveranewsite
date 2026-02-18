#!/usr/bin/env python3
"""
Fix HTML quality in blog-content.ts.

The v1 generator created <h2> tags from every short line in the scraped text,
resulting in 791 h2 tags — most of which are garbage (commas, company names,
link text fragments).  This script:

1. Extracts each content/content_cz template-literal block.
2. Re-processes the HTML:
   - Only keeps <h2> for lines that look like REAL section headings.
   - Merges consecutive tiny <p>/<h2> fragments into flowing paragraphs.
   - Preserves <ul>/<li>, <strong>, <em>, <a> etc.
3. Writes the cleaned file back.
"""

import re, sys, textwrap

SRC = "src/lib/blog-content.ts"

# ── helpers ──────────────────────────────────────────────────────────

def is_real_heading(text: str) -> bool:
    """Return True only if *text* looks like a genuine section heading."""
    t = text.strip()
    if not t or len(t) < 3:
        return False

    # Numbered headings:  "1. …", "2. …"
    if re.match(r'^\d+[\.\)]\s+\S', t):
        return True

    # Numbered headings without dot: "1 …" (only if short-ish)
    if re.match(r'^\d+\s+[A-ZÁ-Ž]', t) and len(t) < 120:
        return True

    # "Step N:", "Tip N:", "Krok N:"
    if re.match(r'^(Step|Tip|Krok|Bod|Fáze)\s+\d', t, re.I):
        return True

    # ALL-CAPS short heading
    if t == t.upper() and len(t) > 4 and t.isalpha():
        return True

    # Known exact headings we want to keep (add as needed)
    keep_exact = {
        "Sources:", "Zdroje:", "Summary", "Shrnutí", "Závěr", "Conclusion",
        "Key Takeaways", "Klíčové poznatky",
    }
    if t in keep_exact:
        return True

    # Reject anything ≤ 25 chars that doesn't start with a digit
    # (these are almost always scraper fragments)
    if len(t) <= 25 and not re.match(r'^\d', t):
        return False

    # Reject if it looks like a sentence fragment (starts lowercase, or is
    # just punctuation/conjunctions)
    if t[0].islower():
        return False
    if t in (',', '.', ', and', ', see', '. For', ', the', ',"', '. U'):
        return False

    # Reject references like [1], [2] …
    if re.match(r'^\[\d+\]', t) and len(t) < 40:
        return False

    # Reject phone numbers, parenthetical names, emojis
    if re.match(r'^[\+\(\[]', t) and len(t) < 30:
        return False
    if any(ord(c) > 0x1F000 for c in t):
        return False

    # Reject if ends with comma — clearly a fragment
    if t.endswith(',') or t.endswith(', '):
        return False

    # Accept anything else that starts with uppercase and is > 25 chars
    # as a potential heading — but also filter out long sentence-like things
    if len(t) > 100:
        return False  # too long for a heading

    # If it starts uppercase (or digit) and is 26-100 chars, accept
    if t[0].isupper() or t[0].isdigit():
        return True

    return False


def clean_content_html(html: str) -> str:
    """Clean up a single content block's HTML."""

    # 1. Parse into a list of "elements" (tags + text)
    # We'll work line-by-line since the generated HTML is one-tag-per-line.
    lines = html.split('\n')
    
    # Collect elements: each is (tag, inner_text) or ('text', raw_text)
    elements = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        elements.append(stripped)

    # 2. Process elements: merge fragments, fix headings
    result_parts = []
    i = 0
    pending_paragraph_parts = []  # accumulate text for merging

    def flush_paragraph():
        """Flush accumulated paragraph parts into a single <p>."""
        nonlocal pending_paragraph_parts
        if pending_paragraph_parts:
            merged = ' '.join(pending_paragraph_parts)
            # Clean up spacing around punctuation
            merged = re.sub(r'\s+([,\.\!\?\;\:\)\]\}])', r'\1', merged)
            merged = re.sub(r'([\(\[\{])\s+', r'\1', merged)
            merged = re.sub(r'\s{2,}', ' ', merged)
            result_parts.append(f'<p>{merged.strip()}</p>')
            pending_paragraph_parts = []

    while i < len(elements):
        el = elements[i]

        # ── <ul>…</ul> block: pass through as-is ──
        if el.startswith('<ul>') or el.startswith('<li>') or el.startswith('</ul>') or el.startswith('</li>'):
            flush_paragraph()
            result_parts.append(el)
            i += 1
            continue

        # ── <h2>…</h2> ──
        m_h2 = re.match(r'^<h2>(.*?)</h2>$', el, re.DOTALL)
        if m_h2:
            inner = m_h2.group(1).strip()
            if is_real_heading(inner):
                flush_paragraph()
                result_parts.append(f'<h2>{inner}</h2>')
            else:
                # Demote to inline text — add to pending paragraph
                pending_paragraph_parts.append(inner)
            i += 1
            continue

        # ── <p>…</p> ──
        m_p = re.match(r'^<p>(.*?)</p>$', el, re.DOTALL)
        if m_p:
            inner = m_p.group(1).strip()
            # Check if this is a "lead" paragraph
            m_lead = re.match(r'^<p class="lead">(.*?)</p>$', el, re.DOTALL)
            if m_lead:
                flush_paragraph()
                result_parts.append(el)
                i += 1
                continue

            # If inner text is very short and looks like a fragment, merge
            if len(inner) < 60 and not inner.endswith('.') and not inner.endswith('!') and not inner.endswith('?') and not inner.endswith(':') and not inner.startswith('<'):
                pending_paragraph_parts.append(inner)
            else:
                # Could still be a continuation if pending parts exist
                if pending_paragraph_parts:
                    pending_paragraph_parts.append(inner)
                    # If this part ends a sentence, flush
                    if inner.endswith('.') or inner.endswith('!') or inner.endswith('?') or inner.endswith(':') or inner.endswith('."') or inner.endswith('."'):
                        flush_paragraph()
                else:
                    result_parts.append(f'<p>{inner}</p>')
            i += 1
            continue

        # ── anything else: pass through ──
        flush_paragraph()
        result_parts.append(el)
        i += 1

    flush_paragraph()

    # 3. Post-process: merge consecutive <p> tags that form one thought
    # Look for patterns like <p>short</p>\n<p>continuation</p>
    final = []
    i = 0
    while i < len(result_parts):
        part = result_parts[i]
        
        # If current is a short paragraph followed by more short paragraphs
        m = re.match(r'^<p>(.*)</p>$', part, re.DOTALL)
        if m and len(m.group(1)) < 80:
            inner = m.group(1)
            # Check if this looks like a fragment that should merge with next
            if not inner.endswith('.') and not inner.endswith('!') and not inner.endswith('?') and not inner.endswith(':'):
                # Look ahead
                merged_parts = [inner]
                j = i + 1
                while j < len(result_parts):
                    m2 = re.match(r'^<p>(.*)</p>$', result_parts[j], re.DOTALL)
                    if m2:
                        merged_parts.append(m2.group(1))
                        if m2.group(1).endswith('.') or m2.group(1).endswith('!') or m2.group(1).endswith('?') or m2.group(1).endswith(':'):
                            j += 1
                            break
                        j += 1
                    else:
                        break
                if len(merged_parts) > 1:
                    merged = ' '.join(merged_parts)
                    merged = re.sub(r'\s+([,\.\!\?\;\:\)\]\}])', r'\1', merged)
                    merged = re.sub(r'\s{2,}', ' ', merged)
                    final.append(f'<p>{merged.strip()}</p>')
                    i = j
                    continue
        
        final.append(part)
        i += 1

    return '\n' + '\n'.join(final) + '\n'


# ── main ─────────────────────────────────────────────────────────────

def main():
    with open(SRC, 'r', encoding='utf-8') as f:
        src = f.read()

    # Find all content template literals:  content: `…`  or  content_cz: `…`
    # We need to match the backtick-delimited content blocks
    pattern = re.compile(r'(content(?:_cz)?:\s*`)([^`]*?)(`)')
    
    count = 0
    def replacer(m):
        nonlocal count
        prefix = m.group(1)  # "content: `" or "content_cz: `"
        body = m.group(2)
        suffix = m.group(3)  # "`"
        cleaned = clean_content_html(body)
        count += 1
        return prefix + cleaned + suffix

    new_src = pattern.sub(replacer, src)

    # Count h2 in result
    old_h2 = len(re.findall(r'<h2>', src))
    new_h2 = len(re.findall(r'<h2>', new_src))

    with open(SRC, 'w', encoding='utf-8') as f:
        f.write(new_src)

    print(f"Processed {count} content blocks")
    print(f"h2 tags: {old_h2} → {new_h2}")
    print(f"File written: {SRC}")


if __name__ == '__main__':
    main()
