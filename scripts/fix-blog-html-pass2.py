#!/usr/bin/env python3
"""Second-pass targeted fixes for remaining bad h2 tags."""
import re

SRC = "src/lib/blog-content.ts"

with open(SRC, 'r', encoding='utf-8') as f:
    text = f.read()

fixes = [
    # 1:1s as standalone h2 - merge into surrounding text
    (r'<p>Do regular</p>\n<h2>1:1s</h2>\n<p>', '<p>Do regular 1:1s '),
    (r'<p>schedule</p>\n<h2>1:1s</h2>\n<p>', '<p>Schedule 1:1s '),
    (r'<h2>1:1s</h2>', '<p><strong>1:1s</strong></p>'),
    (r'<h2>1:1 schůzky</h2>', '<p><strong>1:1 schůzky</strong></p>'),
    # Czechia Best Managed Companies - not a heading, inline emphasis
    (r'</p>\n<h2>Czechia Best Managed Companies</h2>\n<p>', ' <strong>Czechia Best Managed Companies</strong> '),
    # 2,4 mil. Kč - not a heading
    (r'<h2>2,4 mil. Kč</h2>', '<p><strong>2,4 mil. Kč</strong></p>'),
    # 43% more likely to leave - not a heading
    (r'<h2>43% more likely to leave</h2>', '<p><strong>43% more likely to leave</strong></p>'),
    # 50% HR professionals
    (r'<h2>50% of HR professionals</h2>', '<p><strong>50% of HR professionals</strong></p>'),
    (r'<h2>50 % HR profesionálů</h2>', '<p><strong>50 % HR profesionálů</strong></p>'),
    # "When solving a problem, ask:" - inline prompt, not section heading
    (r'<h2>When solving a problem, ask:</h2>', '<p><strong>When solving a problem, ask:</strong></p>'),
    (r'<h2>Při řešení problému se ptejte:</h2>', '<p><strong>Při řešení problému se ptejte:</strong></p>'),
    # "Connect work to outcomes:" - inline
    (r'<h2>Propojte práci s výsledky:</h2>', '<p><strong>Propojte práci s výsledky:</strong></p>'),
]

for pattern, replacement in fixes:
    text = re.sub(pattern, replacement, text)

with open(SRC, 'w', encoding='utf-8') as f:
    f.write(text)

h2_count = len(re.findall(r'<h2>', text))
print(f"h2 count after targeted fixes: {h2_count}")
