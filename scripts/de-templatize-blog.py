#!/usr/bin/env python3
"""
De-templatize blog articles to break AI-generated content fingerprint.
Each article gets unique section headings instead of identical template.
"""
import os
import re

BLOG_DIR = os.path.join(os.path.dirname(__file__), '..', 'content', 'blog')

# ──────────────────────────────────────────────────
# Per-article diversification plan
# ──────────────────────────────────────────────────
# Keys: article number
# Values: dict of old_h2 → new_h2 replacements, plus special instructions

PLANS = {
    1: {
        'h2': {
            'Co si z toho odnést': 'Klíčové body',
            'Příklad z praxe': 'Jak to vypadalo v brněnské IT firmě',
            'Závěr': 'Na závěr',
        },
        'ilustracni': 'remove',
    },
    2: {
        'h2': {
            'Časté otázky': 'Otázky, které HR typicky řeší',
            'Závěr': 'Co z toho plyne',
        },
    },
    3: {
        'h2': {
            'Časté otázky': 'FAQ',
        },
        'ilustracni': 'remove',
    },
    4: {
        'h2': {
            'Časté otázky': 'Otázky z boardu',
            'Závěr': 'Hlavní poselství',
        },
    },
    5: {
        'h2': {
            'Závěr': 'Shrnutí',
            'Zdroje': 'Odkazy a reference',
        },
        'ilustracni': 'remove',
    },
    6: {
        'h2': {
            'Co si z toho odnést': 'Na co se zaměřit',
            'Proč to HR řeší právě v roce 2026': 'Proč pulse právě teď',
            'Příklad z praxe': 'Jak to dopadlo v plzeňské logistice',
            'Časté otázky': 'Na co se nás ptají nejčastěji',
            'Závěr': 'Shrnutí a klíčové kroky',
        },
        'ilustracni': 'remove',
    },
    7: {
        'h2': {
            'Co si z toho odnést': 'V kostce',
            'Proč to řešit právě v roce 2026': 'Proč je to teď klíčové',
            'Příklad z praxe': 'Jak brněnská IT firma vybudovala důvěru',
            'Závěr': 'Na závěr',
            'Zdroje': 'Reference',
        },
        'ilustracni': 'remove',
    },
    8: {
        'h2': {
            'Co si z toho odnést': 'Hlavní principy',
            'Příklad z praxe': 'Když účast spadne na 29 %',
            'Časté otázky': 'Časté námitky',
            'Závěr': 'Závěrem: účast je signál, ne cíl',
        },
        'ilustracni': 'remove',
    },
    9: {
        'h2': {
            'Co si z toho odnést': 'Na co se zaměřit',
            'Proč to HR řeší právě teď': 'Kontext',
            'Příklad z praxe': 'Jak to řešila pardubická firma',
            'Časté otázky': 'Otázky z výsledkových schůzek',
            'Závěr': 'Co si zapamatovat',
        },
        'ilustracni': 'remove',
    },
    10: {
        'h2': {
            'Co si z toho odnést': 'TL;DR',
            'Příklad z praxe': 'Co se stane, když manažer cítí útok',
            'Časté otázky': 'FAQ pro HR',
            'Závěr': 'Hlavní myšlenka',
        },
        'ilustracni': 'remove',
    },
    11: {
        'h2': {
            'Co si z toho odnést': 'Proč na tom záleží',
            'Příklad z praxe': 'Jak pražská agentura zredukovala otázky',
            'Časté otázky': 'Co se nás ptají HR',
            'Závěr': 'Shrnutí',
        },
        'ilustracni': 'remove',
    },
    12: {
        'h2': {
            'Co si z toho odnést': 'Stručně',
            'Příklad z praxe': 'Když účast padá: příběh z Brna',
            'Závěr': 'Na závěr: fatigue je zpětná vazba',
        },
        'ilustracni': 'remove',
    },
    13: {
        'h2': {
            'Co si z toho odnést': 'Shrnutí pro vedení',
            'Příklad z praxe': 'Tři kola, jeden trend',
            'Časté otázky': 'Otázky, které padají na boardu',
        },
        'ilustracni': 'remove',
    },
    14: {
        'h2': {
            'Co si z toho odnést': 'O čem tento článek je',
            'Příklad z praxe': '15 poboček, 1 problém',
            'Časté otázky': 'Časté chyby a otázky',
            'Závěr': 'Hlavní pravidlo',
        },
        'ilustracni': 'remove',
    },
    15: {
        'h2': {
            'Co si z toho odnést': 'TL;DR',
            'Příklad z praxe': 'Korelace, která málem stála milion',
            'Časté otázky': 'Otázky z praxe',
            'Závěr': 'Na co nezapomenout',
            'Zdroje': 'Doporučené zdroje',
        },
        'ilustracni': 'remove',
    },
    16: {
        'h2': {
            'Co si z toho odnést': 'Co se dozvíte',
            'Proč na transparentnosti záleží': 'Proč záleží na tom, jak nástroj funguje',
            'Příklad z praxe': '90 minut od startu k prvnímu insightu',
            'Závěr': 'Shrnutí',
        },
        'ilustracni': 'remove',
    },
    17: {
        'h2': {
            'Co si z toho odnést': 'K čemu jsou ranné výsledky',
            'Proč na tom záleží': 'Proč je to důležité',
            'Příklad z praxe': 'Když CEO otevře dashboard příliš brzy',
            'Časté otázky': 'Na co se ptají CEO',
            'Závěr': 'Co z toho vyplývá',
        },
        'ilustracni': 'remove',
    },
    18: {
        'h2': {
            'Co si z toho odnést': '3 klíčové body',
            'Příklad z praxe': '45 minut místo 15stránkového PDF',
            'Časté otázky': 'Otázky z praxe',
            'Závěr': 'Na závěr',
        },
        'ilustracni': 'remove',
    },
    19: {
        'h2': {
            'Co si z toho odnést': 'Hlavní zjištění',
            'Proč na chybách záleží': 'Proč se vyplatí chyby znát dopředu',
            'Příklad z praxe': 'Když to pokazí i HR firma',
            'Časté otázky': 'Otázky, které klienti řeší',
            'Závěr': 'Závěrem',
        },
        'ilustracni': 'remove',
    },
    20: {
        'h2': {
            'Co si z toho odnést': 'Než začnete',
            'Proč pilot místo big-bangu': 'Proč nezačínat hned celou firmou',
            'Příklad z praxe': 'Ze zlínské stavební firmy',
            'Závěr': 'Co si odnést',
        },
        'ilustracni': 'remove',
    },
    21: {
        'h2': {
            'Co si z toho odnést': 'Proč číst dál',
            'Proč to řeší právě teď': 'Kontext: proč anonymita rezonuje',
            'Příklad z praxe': 'Jak transparentnost zvýšila důvěru',
            'Časté otázky': 'FAQ k anonymitě',
            'Závěr': 'Shrnutí',
        },
        'ilustracni': 'remove',
    },
    22: {
        'h2': {
            'Co si z toho odnést': 'Kolik to zabere — v číslech',
            'Proč to řeší právě teď': 'Kontext',
            'Příklad z praxe': 'Skutečné čísla z ostravské e-commerce',
            'Časté otázky': 'Otázky od vedení',
            'Závěr': 'Na závěr: méně času než myslíte',
        },
        'ilustracni': 'remove',
    },
    23: {
        'h2': {
            'Co si z toho odnést': 'Shrnutí pro krizové situace',
            'Proč to řeší právě teď': 'Proč se to teď děje častěji',
            'Příklad z praxe': 'Jak plzeňská logistika zvládla pokles',
            'Závěr': 'Klíčové ponaučení',
        },
        'ilustracni': 'remove',
    },
    24: {
        'h2': {
            'Co si z toho odnést': 'Na co se připravit',
            'Proč to řeší právě teď': 'Kontext: proč přibývá negativních odpovědí',
            'Příklad z praxe': '8 vulgarit v prvním kole: co dál',
            'Časté otázky': 'Otázky, co HR řeší',
            'Závěr': 'Závěrem: toxicita je informace',
        },
        'ilustracni': 'remove',
    },
    25: {
        'h2': {
            'Co si z toho odnést': 'V kostce',
            'Proč to řeší právě teď': 'Kontext: proč řešit nástroj právě teď',
            'Příklad z praxe': 'Příběh pražské agentury',
            'Časté otázky': 'Námitky a odpovědi',
            'Závěr': 'Verdikt',
        },
        'ilustracni': 'remove',
    },
    26: {
        'h2': {
            'Co si z toho odnést': 'Klíčová zjištění',
            'Proč to řeší právě teď': 'Proč quiet quitting rezonuje',
            'Příklad z praxe': 'Dva senioři, kteří přestali chodit na porady',
            'Závěr': 'Na závěr',
            'Zdroje': 'Reference a další čtení',
        },
        'ilustracni': 'remove',
    },
    27: {
        'h2': {
            'Co si z toho odnést': 'Co si odnést',
            'Proč to řeší právě teď': 'Proč burnout rezonuje',
            'Příklad z praxe': 'Tři sick days, jeden pattern',
            'Časté otázky': 'FAQ k burnoutu',
            'Závěr': 'Hlavní myšlenka',
        },
        'ilustracni': 'remove',
    },
    28: {
        'h2': {
            'Co si z toho odnést': 'Klíčové body',
            'Proč to řeší právě teď': 'Kontext: proč onboarding řešit dnes',
            'Příklad z praxe': '15 nových lidí, 4 odešli',
            'Časté otázky': 'Otázky z praxe',
            'Závěr': 'Shrnutí',
        },
        'ilustracni': 'remove',
    },
    29: {
        'h2': {
            'Co si z toho odnést': 'To hlavní',
            'Proč to řeší právě teď': 'Proč kultura rezonuje',
            'Příklad z praxe': 'Kvalita, týmovost, inovace — a realita',
            'Časté otázky': 'Nejčastější otázky k firemní kultuře',
            'Závěr': 'Na závěr',
        },
        'ilustracni': 'remove',
    },
    30: {
        'h2': {
            'Co si z toho odnést': 'Na čem záleží',
            'Proč to řeší právě teď': 'Kontext: přetížený střední management',
            'Příklad z praxe': '14 manažerů, 2 problémy',
            'Časté otázky': 'Co říkají manažeři',
            'Závěr': 'Co z toho plyne',
        },
        'ilustracni': 'remove',
    },
}


def get_article_number(filename: str) -> int:
    """Extract article number from filename like 01-kolik-vas-stoji.mdx"""
    m = re.match(r'^(\d+)-', filename)
    return int(m.group(1)) if m else 0


def process_article(filepath: str, plan: dict) -> tuple[int, list[str]]:
    """Apply de-templatization plan to an article. Returns (change_count, changes_list)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changes = []

    # 1. Replace H2 headings
    for old_h2, new_h2 in plan.get('h2', {}).items():
        old_pattern = f'## {old_h2}'
        new_pattern = f'## {new_h2}'
        if old_pattern in content:
            content = content.replace(old_pattern, new_pattern, 1)
            changes.append(f'  H2: "{old_h2}" → "{new_h2}"')

    # 2. Remove "Ilustrační scénář:" prefix
    if plan.get('ilustracni') == 'remove':
        # Long form: "*Ilustrační scénář na základě typických situací českých firem:* "
        long_prefix = '*Ilustrační scénář na základě typických situací českých firem:* '
        if long_prefix in content:
            content = content.replace(long_prefix, '', 1)
            changes.append('  Removed long "Ilustrační scénář" prefix')
        else:
            # Short form: "*Ilustrační scénář:* "
            short_prefix = '*Ilustrační scénář:* '
            if short_prefix in content:
                content = content.replace(short_prefix, '', 1)
                changes.append('  Removed "Ilustrační scénář:" prefix')

    # 3. Reduce "V roce 2026" — replace some with alternatives
    # Only change if there are 2+ occurrences in the article
    v_roce_count = content.count('V roce 2026')
    v_roce_lower = content.count('v roce 2026')
    total_v_roce = v_roce_count + v_roce_lower
    if total_v_roce >= 2:
        # Keep first occurrence, replace subsequent ones with alternatives
        alternatives = ['Aktuálně', 'Dnes', 'V současnosti', 'Nyní', 'V tomto roce']
        alt_idx = 0
        first_found = False
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            if ('V roce 2026' in line or 'v roce 2026' in line) and first_found:
                if alt_idx < len(alternatives):
                    line = line.replace('V roce 2026', alternatives[alt_idx], 1)
                    line = line.replace('v roce 2026', alternatives[alt_idx].lower(), 1)
                    alt_idx += 1
            elif 'V roce 2026' in line or 'v roce 2026' in line:
                first_found = True
            new_lines.append(line)
        new_content = '\n'.join(new_lines)
        if new_content != content:
            reduced = total_v_roce - new_content.count('V roce 2026') - new_content.count('v roce 2026')
            if reduced > 0:
                changes.append(f'  Reduced "V roce 2026" by {reduced} occurrences')
                content = new_content

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return len(changes), changes


def main():
    files = sorted(os.listdir(BLOG_DIR))
    total_changes = 0
    
    print("🔧 De-templatizing blog articles...\n")
    
    for filename in files:
        if not filename.endswith('.mdx'):
            continue
        num = get_article_number(filename)
        if num not in PLANS:
            print(f"  ⏭  Article {num:02d}: no plan (already unique)")
            continue
        
        filepath = os.path.join(BLOG_DIR, filename)
        plan = PLANS[num]
        count, changes = process_article(filepath, plan)
        
        if count > 0:
            print(f"  ✅ Article {num:02d}: {count} changes")
            for c in changes:
                print(c)
        else:
            print(f"  ⚠️  Article {num:02d}: no changes applied (already done?)")
        
        total_changes += count
    
    print(f"\n📊 Total: {total_changes} changes across 30 articles")


if __name__ == '__main__':
    main()
