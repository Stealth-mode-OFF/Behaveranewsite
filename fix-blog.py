#!/usr/bin/env python3
"""Fix Art 15 Key context + Art 10 takeaway."""

with open('src/lib/blog-content.ts', 'r', encoding='utf-8') as f:
    content = f.read()

original = content
fixes = 0

# ═══ Art 15 EN: Restructure Key context into TED talk headings ═══
# Uses ASCII double quotes " and en dash \u2013
old = (
    '<h2>Key context</h2>\n'
    '<p><em>\u201CChoose an underrated candidate whose secret weapon is passion and ambition.\u201D \u2013 Regina Hartley Simon Sinek</em>: How great leaders inspire action What distinguishes exceptional leaders from average ones? Why do we naturally follow some of them and the others don&#x27;t inspire us to take action? Simon Sinek looked into this and found that there are two kinds of leaders\u2013\u2013 those who are leaders and those who lead us.</p>\n'
    '<p>Leaders come from a position of authority and power. And those who lead inspire us with their WHY. We follow them because we want to, not because we have to. This principle then applies beautifully not only to leading people, but also to communicating with customers.</p>\n'
    '<p>\u201CPeople don&#x27;t buy what you do, but why you do it.\u201D \u2013 Simon Sinek Adam Grant: Are you a giver or a taker? According to Grant, you&#x27;ll find three types of people in every company:</p>\n'
    '<p>giver, receiver, and matchmaker. Which group do the most successful and productive employees belong to? The answer may surprise you. In his TED Talk, Adam Grant offered several practical tips on how to create the ideal environment for these ideal employees and how to protect them (from themselves and others).</p>\n'
    '<p>\u201CThe most meaningful way to succeed is to help others succeed.\u201D \u2013 Adam Grant Matt Mullenweg: Why working from home is good for business According to recent surveys, remote workers are 13% more productive than office commuters. Why? It\u2019s due to their work environment, which they can customize to suit their needs. According to Mullenweg, employee autonomy is one of the competitive advantages for companies.</p>\n'
    '<p>In his TED Talk, he passed on plenty of great tips on what to look for if you want to succeed in remote mode too. \u201CTalent and intelligence can be found in all people in the world. But not everyone has equal opportunity.\u201D \u2013 Matt Mullenweg Which ideas from the TED talks resonated with you the most?</p>\n'
    '<p>Join the discussion on LinkedIn and make us happy by sharing the article with your colleagues.</p>'
)

# Check exact chars
idx = content.find('<h2>Key context</h2>')
actual = content[idx:idx+len(old)]

if old == actual:
    print('Exact match confirmed for Art 15')
else:
    print('Mismatch detected, doing char-by-char comparison...')
    for i, (a, b) in enumerate(zip(old, actual)):
        if a != b:
            print(f'  Diff at pos {i}: expected {repr(a)} (U+{ord(a):04X}), got {repr(b)} (U+{ord(b):04X})')
            if i > 5:
                break
    # Use the actual content instead
    end_marker = '<p>Join the discussion on LinkedIn and make us happy by sharing the article with your colleagues.</p>'
    end_idx = content.find(end_marker, idx)
    if end_idx >= 0:
        old = content[idx:end_idx + len(end_marker)]
        print(f'  Using actual content ({len(old)} chars) for replacement')

new = (
    '<p><em>\u201CChoose an underrated candidate whose secret weapon is passion and ambition.\u201D</em> \u2013 Regina Hartley</p>\n'
    '<h2>Simon Sinek: How great leaders inspire action</h2>\n'
    '<p>What distinguishes exceptional leaders from average ones? Why do we naturally follow some of them and the others don&#x27;t inspire us to take action? Simon Sinek looked into this and found that there are two kinds of leaders \u2013 those who are leaders and those who lead us.</p>\n'
    '<p>Leaders come from a position of authority and power. And those who lead inspire us with their WHY. We follow them because we want to, not because we have to. This principle then applies beautifully not only to leading people, but also to communicating with customers.</p>\n'
    '<p><em>\u201CPeople don&#x27;t buy what you do, but why you do it.\u201D</em> \u2013 Simon Sinek</p>\n'
    '<h2>Adam Grant: Are you a giver or a taker?</h2>\n'
    '<p>According to Grant, you&#x27;ll find three types of people in every company: giver, receiver, and matchmaker. Which group do the most successful and productive employees belong to? The answer may surprise you. In his TED Talk, Adam Grant offered several practical tips on how to create the ideal environment for these ideal employees and how to protect them (from themselves and others).</p>\n'
    '<p><em>\u201CThe most meaningful way to succeed is to help others succeed.\u201D</em> \u2013 Adam Grant</p>\n'
    '<h2>Matt Mullenweg: Why working from home is good for business</h2>\n'
    '<p>According to recent surveys, remote workers are 13% more productive than office commuters. Why? It\u2019s due to their work environment, which they can customize to suit their needs. According to Mullenweg, employee autonomy is one of the competitive advantages for companies.</p>\n'
    '<p>In his TED Talk, he passed on plenty of great tips on what to look for if you want to succeed in remote mode too. <em>\u201CTalent and intelligence can be found in all people in the world. But not everyone has equal opportunity.\u201D</em> \u2013 Matt Mullenweg</p>\n'
    '<h2>Takeaways</h2>\n'
    '<ul>\n'
    '<li>Competency-based hiring reveals potential that CVs miss</li>\n'
    '<li>\u201CPeople don\u2019t buy what you do, but why you do it\u201D \u2013 inspiration beats authority</li>\n'
    '<li>Remote employees are 13% more productive than office commuters</li>\n'
    '</ul>\n'
    '<p>Which ideas from the TED talks resonated with you the most? Join the discussion on LinkedIn and make us happy by sharing the article with your colleagues.</p>'
)

if old in content:
    content = content.replace(old, new, 1)
    fixes += 1
    print('\u2713 Art 15 EN: Restructured TED talks + added Takeaways')
else:
    print('\u2717 Art 15 EN: Still could not match')

# ═══ Art 10 EN: Add takeaway before closing ═══
art10_marker = 'Have we forgotten an event that should definitely be on this list?'
art10_idx = content.find(art10_marker)
if art10_idx >= 0:
    p_start = content.rfind('<p', max(0, art10_idx - 100), art10_idx)
    if p_start >= 0:
        takeaway = (
            '<h2>Takeaways</h2>\n<ul>\n'
            '<li>Follow international HR conferences to stay ahead of industry trends</li>\n'
            '<li>Most events offer virtual attendance \u2014 no need to travel</li>\n'
            '<li>Topics like well-being, hybrid work, and engagement dominate the agenda</li>\n'
            '</ul>\n'
        )
        content = content[:p_start] + takeaway + content[p_start:]
        fixes += 1
        print('\u2713 Art 10 EN: Added Takeaways section')
    else:
        print('\u2717 Art 10 EN: Could not find paragraph start')
else:
    print('\u2717 Art 10 EN: Marker not found')

if content != original:
    with open('src/lib/blog-content.ts', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'\n=== {fixes} fixes applied ===')
else:
    print('\n--- No changes ---')
