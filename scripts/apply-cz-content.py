#!/usr/bin/env python3
"""
Apply processed Czech content to blog-content.ts
Replaces empty title_cz, excerpt_cz, content_cz fields with actual content.
"""

import json, re, os

BASE = os.path.dirname(os.path.dirname(__file__))
TS_FILE = os.path.join(BASE, 'src', 'lib', 'blog-content.ts')
CZ_DATA = '/tmp/cz_processed.json'

with open(CZ_DATA, 'r', encoding='utf-8') as f:
    cz_articles = json.load(f)

with open(TS_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Build lookup by id
cz_map = {a['id']: a for a in cz_articles}

def escape_for_ts(s: str) -> str:
    """Escape a string for use inside TypeScript single quotes."""
    s = s.replace('\\', '\\\\')
    s = s.replace("'", "\\'")
    return s

def escape_for_backtick(s: str) -> str:
    """Escape a string for use inside TypeScript backtick template literal."""
    s = s.replace('\\', '\\\\')
    s = s.replace('`', '\\`')
    s = s.replace('${', '\\${')
    return s

# For each article, replace the empty CZ fields
for post_id, data in cz_map.items():
    title_cz = escape_for_ts(data['title_cz'])
    excerpt_cz = escape_for_ts(data['excerpt_cz'])
    content_cz = escape_for_backtick(data['content_cz_html'])
    
    # Find the post block by looking for id: 'N' pattern, then replace the CZ fields
    # We use a targeted approach: find id: 'N', then find the nearest title_cz: '', etc.
    
    # Pattern to find post by id and then its title_cz
    id_pattern = f"id: '{post_id}',"
    id_pos = content.find(id_pattern)
    if id_pos == -1:
        print(f"WARNING: Could not find post id {post_id}")
        continue
    
    # Find the next post id to know boundaries
    next_id = str(int(post_id) + 1)
    next_id_pattern = f"id: '{next_id}',"
    next_id_pos = content.find(next_id_pattern, id_pos + 1)
    if next_id_pos == -1:
        next_id_pos = len(content)  # Last post
    
    # Work within this post's block
    post_block = content[id_pos:next_id_pos]
    
    # Replace title_cz: ''
    post_block = post_block.replace("title_cz: '',", f"title_cz: '{title_cz}',", 1)
    
    # Replace excerpt_cz: ''
    post_block = post_block.replace("excerpt_cz: '',", f"excerpt_cz: '{excerpt_cz}',", 1)
    
    # Replace content_cz: ''  (which uses either '' or ``)
    # Check what format is used
    if "content_cz: ''," in post_block:
        post_block = post_block.replace("content_cz: '',", f"content_cz: `\n{content_cz}\n`,", 1)
    elif "content_cz: ``," in post_block:
        post_block = post_block.replace("content_cz: ``,", f"content_cz: `\n{content_cz}\n`,", 1)
    
    content = content[:id_pos] + post_block + content[next_id_pos:]
    print(f"✅ Updated post {post_id}: {data['title_cz'][:50]}...")

# Write back
with open(TS_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nDone! Updated {len(cz_map)} posts in {TS_FILE}")
