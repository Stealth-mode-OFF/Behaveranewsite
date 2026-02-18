#!/usr/bin/env python3
"""
Process articles_cz.json → extract clean Czech content → output as JSON
for insertion into blog-content.ts
"""

import json, re, sys, os

INPUT = os.path.join(os.path.dirname(__file__), '..', 'articles_cz.json')

with open(INPUT, 'r', encoding='utf-8') as f:
    articles = json.load(f)

START_MARKER = 'Naplánujte si demo\n'
END_MARKERS = [
    'Vyzkoušejte nyní!\nPřihlášeno k odběru.',
    'Vyzkoušejte nyní!\nPřihlášeno',
    '\nVyzkoušejte nyní!',
]

def extract_body(raw: str, title: str) -> str:
    """Strip nav boilerplate and footer from raw scraped text."""
    # Find start: after "Naplánujte si demo\n"
    idx = raw.find(START_MARKER)
    if idx == -1:
        print(f"  WARNING: start marker not found for '{title[:40]}'", file=sys.stderr)
        return raw
    body = raw[idx + len(START_MARKER):]
    
    # The article title appears right after the marker — skip it (it's already in title_cz)
    # But we want the first paragraph after the title (which is the excerpt/intro)
    
    # Find end marker
    for em in END_MARKERS:
        eidx = body.find(em)
        if eidx != -1:
            body = body[:eidx]
            break
    
    return body.strip()


def text_to_html(text: str, title: str) -> tuple:
    """
    Convert cleaned plain text to HTML.
    Returns (excerpt_cz, content_html).
    """
    lines = text.split('\n')
    
    # Skip the repeated article title at the very beginning
    start = 0
    if lines and lines[0].strip() == title.strip():
        start = 1
    
    # Find excerpt: the first substantial paragraph after the title
    excerpt = ''
    content_start = start
    for i in range(start, min(start + 5, len(lines))):
        line = lines[i].strip()
        if len(line) > 80:  # Long enough to be a real paragraph / excerpt
            excerpt = line
            content_start = i  # Include excerpt in content too
            break
    
    if not excerpt and start < len(lines):
        # Fallback: use the first non-empty line
        for i in range(start, len(lines)):
            if lines[i].strip():
                excerpt = lines[i].strip()
                content_start = i
                break
    
    # Now convert remaining lines to HTML
    html_parts = []
    i = content_start
    in_list = False
    
    while i < len(lines):
        line = lines[i].strip()
        i += 1
        
        if not line or line == '‍':
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            continue
        
        # Skip metadata lines (author, date, reading time patterns)
        if re.match(r'^\d+\.\s+(ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince)\s+\d{4}$', line):
            continue
        if re.match(r'^-$', line):
            continue
        if re.match(r'^\d+\s+minut[ay]?$', line):
            continue
        if re.match(r'^•$', line):
            continue
            
        # Detect list items (lines starting with ✅, ✔️, •, -, bullet)
        is_list_item = False
        list_content = line
        if re.match(r'^[✅✔️•\-🤝🗨️🤹🎯👩👱👨]\s*', line) or re.match(r'^[✅✔️]', line):
            is_list_item = True
            # Clean up emoji prefix
            list_content = re.sub(r'^[✅✔️•\-🤝🗨️🤹🎯]\s*', '', line).strip()
            # Also handle emoji pairs
            list_content = re.sub(r'^[\U0001F91D\U0001F5E8\U0001F939\U0001F3AF]\s*', '', list_content).strip()
        
        # Detect headings: numbered sections like "1. Title" or "1) Title" 
        heading_match = re.match(r'^(\d+[\.\)]\s+.+)$', line)
        # Also detect lines that are short (< 80 chars) and look like section headers
        is_heading = False
        if heading_match and len(line) < 120:
            is_heading = True
        # Lines that start with "Kde začít" or similar short phrases
        elif len(line) < 80 and not line.endswith('.') and not line.endswith(',') and not line.startswith('"') and not line.startswith('„') and not is_list_item:
            # Check if it looks like a heading (title case or short phrase)
            if re.match(r'^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]', line) and len(line) > 5:
                # Could be a heading - check context
                is_heading = True
        
        # Detect blockquotes (text in quotes from named people)
        is_quote = False
        if (line.startswith('„') or line.startswith('"')) and ('říká' in line or 'dodává' in line or 'prozradil' in line or 'doporučuje' in line or 'radí' in line or 'vysvětlil' in line or 'předpovídá' in line or 'doplňuje' in line or 'řekl' in line):
            is_quote = True
        elif (line.startswith('„') or line.startswith('"')) and len(line) > 150:
            is_quote = True
        
        if in_list and not is_list_item:
            html_parts.append('</ul>')
            in_list = False
        
        if is_list_item:
            if not in_list:
                html_parts.append('<ul>')
                in_list = True
            # Bold the first part if it has a colon structure
            if ':' in list_content and list_content.index(':') < 60:
                parts = list_content.split(':', 1)
                html_parts.append(f'  <li><strong>{escape_html(parts[0])}:</strong>{escape_html(parts[1])}</li>')
            else:
                html_parts.append(f'  <li>{escape_html(list_content)}</li>')
        elif is_quote:
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            html_parts.append(f'<blockquote>{escape_html(line)}</blockquote>')
        elif is_heading:
            if in_list:
                html_parts.append('</ul>')
                in_list = False
            html_parts.append(f'<h2>{escape_html(line)}</h2>')
        else:
            # Regular paragraph
            html_parts.append(f'<p>{escape_html(line)}</p>')
    
    if in_list:
        html_parts.append('</ul>')
    
    content_html = '\n'.join(html_parts)
    return excerpt, content_html


def escape_html(text: str) -> str:
    """Minimal HTML escaping, but keep quotes for readability."""
    # Don't escape quotes since they're Czech quotation marks, not HTML attributes
    return text


# Process all articles
results = []
for idx, art in enumerate(articles):
    post_id = str(idx + 1)
    title = art['title']
    raw = art['content']
    
    print(f"Processing article {post_id}: {title[:50]}...", file=sys.stderr)
    
    body = extract_body(raw, title)
    excerpt, content_html = text_to_html(body, title)
    
    results.append({
        'id': post_id,
        'title_cz': title,
        'excerpt_cz': excerpt,
        'content_cz_html': content_html,
    })

# Output as JSON
print(json.dumps(results, ensure_ascii=False, indent=2))
