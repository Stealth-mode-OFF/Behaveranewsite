#!/usr/bin/env python3
"""
Phase 2: De-templatize remaining repetitive headings.
Diversify "Zdroje" (26x) and remaining "Časté otázky" (8x).
"""
import os

BLOG_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'blog')

# "Zdroje" diversification — each article gets a unique variant
ZDROJE_MAP = {
    '01': 'Použité zdroje',
    '02': 'Zdroje a studie',
    '03': 'Literatura',
    '04': 'Citované studie',
    '06': 'Zdroje',            # keep some as-is for natural variance
    '08': 'Podklady',
    '09': 'Zdroje a literatura',
    '10': 'Odkud vycházíme',
    '11': 'Kde číst dál',
    '12': 'Zdroje',            # keep
    '13': 'Citované zdroje',
    '14': 'Použitá data a zdroje',
    '16': 'Zdroje',            # keep
    '17': 'Zdroje a data',
    '18': 'Podklady a zdroje',
    '19': 'Zdroje',            # keep
    '20': 'Zdroje',            # keep
    '21': 'Legislativa a zdroje',
    '22': 'Zdroje a benchmarky',
    '23': 'Zdroje',            # keep
    '24': 'Odborné zdroje',
    '25': 'Podklady',
    '27': 'Zdroje a výzkumy',
    '28': 'Zdroje',            # keep
    '29': 'Zdroje',            # keep
    '30': 'Citované studie a data',
}

# Remaining "Časté otázky" diversification
FAQ_MAP = {
    '01': 'Časté otázky',         # keep — it's #1 and original-ish
    '05': 'Námitky a odpovědi',
    '07': 'Časté otázky',         # keep — fits anonymity topic
    '12': 'Otázky kolem fatigue',
    '16': 'Časté obavy',
    '20': 'Co říká vedení',
    '23': 'Časté otázky',         # keep — crisis context
    '26': 'Časté otázky',         # keep — quiet quitting FAQ natural
}

def process():
    changes = 0
    
    for filename in sorted(os.listdir(BLOG_DIR)):
        if not filename.endswith('.mdx'):
            continue
        
        num = filename.split('-')[0]
        filepath = os.path.join(BLOG_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Replace Zdroje
        if num in ZDROJE_MAP and ZDROJE_MAP[num] != 'Zdroje':
            old = '## Zdroje'
            new = f'## {ZDROJE_MAP[num]}'
            if old + '\n' in content:
                # Make sure we only replace the standalone H2
                content = content.replace(old + '\n', new + '\n', 1)
                print(f'  {filename}: "Zdroje" → "{ZDROJE_MAP[num]}"')
                changes += 1
        
        # Replace Časté otázky
        if num in FAQ_MAP and FAQ_MAP[num] != 'Časté otázky':
            old = '## Časté otázky'
            new = f'## {FAQ_MAP[num]}'
            if old + '\n' in content:
                content = content.replace(old + '\n', new + '\n', 1)
                print(f'  {filename}: "Časté otázky" → "{FAQ_MAP[num]}"')
                changes += 1
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
    
    print(f'\n📊 Phase 2: {changes} additional changes')

if __name__ == '__main__':
    process()
