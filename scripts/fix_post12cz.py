#!/usr/bin/env python3
"""Fix Post 12 CZ: merge h2 breaks and remove duplicate Team leadeři block."""
import sys

filepath = 'src/lib/blog-content.ts'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# The exact text to find (with all Czech characters)
old = (
    '<h2>12 nejv\u00fdznamn\u011bj\u0161\u00edch faktor\u016f</h2>\n'
    '<p>, kter\u00e9 stoj\u00ed za rizikem vyho\u0159en\u00ed, ztr\u00e1tou engagementu, sn\u00ed\u017een\u00e9 produktivity a nebo rizikem odchodu.</p>\n'
    '<h2>Team leade\u0159i a HR profesion\u00e1lov\u00e9 pak maj\u00ed</h2>\n'
    '<p>p\u0159\u00edstup do p\u0159ehledu, kde jsou sesb\u00edran\u00e1 data analyzovan\u00e1 a dopln\u011bn\u00e1 o praktick\u00e1 doporu\u010den\u00ed op\u0159en\u00e1 o behavior\u00e1ln\u00ed v\u011bdu. To v\u0161e v re\u00e1ln\u00e9m \u010dase, bez nutnosti platit extra za drah\u00e9 konzultace nebo se \u00fa\u010dastnit zdlouhav\u00fdch \u0161kolen\u00ed.</p>\n'
    '<h2>Team leade\u0159i a HR profesion\u00e1lov\u00e9 pak maj\u00ed</h2>\n'
    '<p>p\u0159\u00edstup do p\u0159ehledu, kde jsou sesb\u00edran\u00e1 data analyzovan\u00e1 a dopln\u011bn\u00e1 o praktick\u00e1 doporu\u010den\u00ed op\u0159en\u00e1 o behavior\u00e1ln\u00ed v\u011bdu. To v\u0161e v re\u00e1ln\u00e9m \u010dase, bez nutnosti platit extra za drah\u00e9 konzultace nebo se \u00fa\u010dastnit zdlouhav\u00fdch \u0161kolen\u00ed.</p>'
)

# Also need to fix the preceding paragraph that ends with "mapuje</p>"
old_with_context = 'mapuje</p>\n' + old

new_with_context = (
    'mapuje <strong>12 nejv\u00fdznamn\u011bj\u0161\u00edch faktor\u016f,</strong> kter\u00e9 stoj\u00ed za rizikem vyho\u0159en\u00ed, ztr\u00e1tou engagementu, sn\u00ed\u017een\u00e9 produktivity a nebo rizikem odchodu.</p>\n'
    '<p><strong>Team leade\u0159i a HR profesion\u00e1lov\u00e9 pak maj\u00ed p\u0159\u00edstup do p\u0159ehledu,</strong> kde jsou sesb\u00edran\u00e1 data analyzovan\u00e1 a dopln\u011bn\u00e1 o praktick\u00e1 doporu\u010den\u00ed op\u0159en\u00e1 o behavior\u00e1ln\u00ed v\u011bdu. To v\u0161e v re\u00e1ln\u00e9m \u010dase, bez nutnosti platit extra za drah\u00e9 konzultace nebo se \u00fa\u010dastnit zdlouhav\u00fdch \u0161kolen\u00ed.</p>'
)

if old_with_context in content:
    content = content.replace(old_with_context, new_with_context, 1)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: Post 12 CZ fixed')
    sys.exit(0)
else:
    # Debug: try to find partial matches
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if '12 nejv' in line:
            print(f'Found "12 nejv" at line {i+1}: {repr(line[:100])}')
        if 'Team leade' in line and 'HR' in line:
            print(f'Found "Team leade" at line {i+1}: {repr(line[:100])}')
        if 'mapuje' in line and '</p>' in line:
            print(f'Found "mapuje</p>" at line {i+1}: {repr(line[-80:])}')
    print('FAILED: Could not find exact match')
    sys.exit(1)
