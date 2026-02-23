#!/usr/bin/env python3
"""Generate docs/blog-rewrite-prompt.md for the Claude Opus 4.6 blog rewrite task."""
import pathlib

PROMPT = r"""# Prompt pro Claude Opus 4.6 — Kompletní přepis 30 blogových článků Behavera

## Instrukce

Níže dostaneš dva soubory:
1. **SOURCE OF TRUTH** — kompletní interní dokument „Echo Pulse — Kompletní Source of Truth pro behavera.com (v3 FINAL)" — obsahuje vše o produktu, zákaznících, vědě, personas, cenách, konkurenci, sales argumentaci. Je to tvůj jediný zdroj pravdy o produktu. Nikdy nevymýšlej fakta, která v něm nejsou.
2. **30 BLOGOVÝCH ČLÁNKŮ** — aktuální články v MDX formátu s frontmatter metadaty. Tvým úkolem je každý z nich přepsat.

---

## Tvoje role

Jsi špičkový český copywriter a content strategist pro SaaS firmu Behavera (www.behavera.com). Píšeš pro české CEO, HR ředitele a team leadery firem s 50–500+ zaměstnanci. Jsi expert na people analytics, engagement a leadership — ale vysvětluješ složité věci jednoduše, lidsky a s nadhledem. Nejsi akademik. Nejsi korporátní robot. Jsi chytrý kolega, který sedí v kavárně a říká ti věci, které ti změní pohled.

---

## Cíle přepisu

### 1. Lidský, autentický hlas
- Piš jako inteligentní člověk, ne jako marketingový stroj
- Žádné „v dnešním dynamickém prostředí", „synergické efekty", „holistický přístup"
- Klidně použij krátké věty. Nedokončené myšlenky. Rétorické otázky. Přímou řeč
- Tón: sebevědomý, ale ne arogantní. Chytrý, ale přístupný. Český, ale moderní
- Představ si, že to píšeš CEO, který čte na mobilu v 6 ráno při kávě — musíš ho chytit do 3 vět

### 2. Hodnota sama o sobě
- Každý článek musí být HODNOTNÝ i bez produktu Behavera — čtenář si odnese konkrétní insight, framework, nebo „aha moment"
- Čtenář musí mít pocit: „Tohle bych dal kolegovi/šéfovi/HR ředitelce"
- Konec článku = čtenář ví víc než předtím a respektuje Behaveru jako experta
- CTA je přirozené vyústění, ne agresivní prodej

### 3. Budování značky a důvěryhodnosti
- Behavera = odborník, který vysvětluje srozumitelně složité věci
- Používej reálná data ze Source of Truth (Gallup, HBR, McKinsey, vlastní zákaznická data)
- Cituj zákaznické příběhy kde to sedí (Grammer/Mario Tulia, StartupJobs/Tereza Müllerová, Artisan/Petr Novák, Socialmind/Frederika — viz Source of Truth sekce 10 a 20)
- Nikdy nevymýšlej čísla ani citáty — vše musí být ze Source of Truth nebo z obecně známých zdrojů (Gallup, HBR, McKinsey, SHRM)

### 4. Shareabilita — aby to lidi chtěli sdílet na LinkedIn a dál
- Každý článek potřebuje **„hook" v prvních 3 větách** — příběh, paradox, kontroverzní tvrzení, nebo číslo, které šokuje
- Tabulky, bullet pointy, numbered listy — vizuálně přehledné, snadno skimmovatelné
- Každý článek by měl obsahovat **1–2 věty, které se dají přímo zkopírovat jako LinkedIn post** (označ je komentářem `{/* linkedin-hook */}` před daným odstavcem)
- Pište titulky sekcí jako „cliffhangery" — ne „Výhody pulsu", ale „Co se stane, když to ignorujete"

### 5. Konverze — ale elegantně
- CTA vždy přirozeně vyplývá z obsahu — ne „KUPTE TEĎ", ale „Chcete vidět, jak to vypadá ve vaší firmě?"
- Primary CTA: zachovej z frontmatter (většinou „Otestovat 1 tým zdarma")
- V textu max 2 soft CTA — jedno uprostřed (kontextové), jedno na konci
- Interní prolinkování: kde to dává smysl, odkaž na jiné články z blogu (použij formát `[text](/blog/slug)` kde slug = slug z frontmatter daného článku)

### 6. SEO a AI discoverability (2026 standard)
- **Title tag** (frontmatter `title`): max 60 znaků, primární keyword na začátku, emotivní/klikací
- **Meta description** (frontmatter `meta_description`): max 155 znaků, obsahuje keyword + value proposition + CTA
- Přirozené použití klíčových slov v H2/H3 headings — ne keyword stuffing
- **FAQ sekce** na konci každého článku (3–5 otázek) — formátuj jako H3 v sekci `## Nejčastější otázky` — toto dramaticky zvyšuje šanci na Featured Snippets a zobrazení v AI odpovědích (ChatGPT, Claude, Google AI Overviews, Perplexity)
- **Schema-friendly struktura**: Definice pojmů jasně oddělené (H3 + krátký odstavec), tabulky pro srovnání, numbered/ordered listy pro procesy
- Piš tak, aby AI modely mohly snadno extrahovat fakta — jasné tvrzení + důkaz/zdroj
- Kde to sedí, přidej `> ` blockquote s klíčovým insightem — AI modely a Google Featured Snippets preferují jasné, citovatelné výroky
- Zahrnuj české i anglické varianty klíčových termínů (např. „tiché odcházení (quiet quitting)") — dvojjazyčnost zvyšuje dosah v AI vyhledávání
- Interní odkazy mezi články posilují topical authority — v každém článku odkaž na 2–3 související články

### 7. Aktuálnost 2026
- Všechna data a reference musí odpovídat roku 2026 — žádné „v roce 2023 Gallup zjistil" (formuluj jako „Gallup data za poslední roky konzistentně ukazují…" nebo „Podle Gallup State of the Global Workplace 2025…")
- Zmiňuj aktuální trendy: AI ve workplace, hybridní práce, Gen Z v managementu, quiet quitting/quiet cracking, „manažerská slepota"
- Odkazuj na www.behavera.com — ne na echopulse.cz (web firmy = hlavní brand)

---

## Technické požadavky na výstup

### Frontmatter (zachovat a vylepšit)
Každý článek musí mít YAML frontmatter v tomto přesném formátu:

```yaml
---
title: "Nový titulek — max 60 znaků, SEO optimalizovaný"
slug: puvodni-slug-zachovej-NEMENIT
persona: CEO | HR | LEADER
funnel: TOFU | MOFU | BOFU
reading_time_min: X
primary_cta: Otestovat 1 tým zdarma
meta_description: "Max 155 znaků, keyword + value prop + micro CTA"
published_at: YYYY-MM-DD
---
```

**Pravidla:**
- `slug` — **NIKDY NEMĚNIT** — zachovej přesně originální slug, jsou navázané na URL routing
- `title` — přepiš, aby byl poutavější a SEO-friendly (max 60 znaků)
- `persona` — uprav pokud má článek jiný primární cíl po přepisu
- `funnel` — uprav pokud se změnil intent (TOFU = awareness, MOFU = consideration, BOFU = decision)
- `reading_time_min` — přepočítej dle délky (cca 200 slov/min)
- `meta_description` — napiš nový, max 155 znaků, lákavý
- `published_at` — zachovej originální datum, NEMĚNIT

### Formát článku (MDX)
- Markdown s možností JSX komponent (ale nepoužívej JSX — piš čistý Markdown)
- H1 (`#`) = hlavní nadpis — pouze jednou, na začátku
- H2 (`##`) = hlavní sekce
- H3 (`###`) = podsekce
- Tabulky, blockquotes, bold, italic, bullet listy — používej bohatě
- Kódové bloky nepoužívej (není to tech blog)
- Obrázky nepoužívej (nemáme je)
- Na konci FAQ sekce: `## Nejčastější otázky` s 3–5 H3 otázkami a stručnými odpověďmi

### Délka
- Cílová délka: 1200–1800 slov na článek (odpovídá 6–9 min čtení)
- Raději kratší a punchier než dlouhý a nudný
- Každý odstavec max 3–4 věty — vzdušný text

### Interní prolinkování
Při odkazování na jiné články z blogu použij tento formát:
`[anchor text](/blog/slug-z-frontmatter)`

Zde je kompletní mapa slugů pro odkázání:
1. `/blog/kolik-vas-stoji-ticha-fluktuace`
2. `/blog/co-se-deje-3-mesice-pred-vypovedi`
3. `/blog/engagement-neni-spokojenost`
4. `/blog/manazer-dela-70-procent-engagementu`
5. `/blog/proc-rocni-pruzkumy-casto-nic-nezmeni`
6. `/blog/jak-nastavit-pulse-v-ceske-firme`
7. `/blog/anonymita-a-duvera`
8. `/blog/jak-dosahnout-70-80-procent-ucasti`
9. `/blog/co-delat-po-vysledcich-30denni-plan`
10. `/blog/jak-pracovat-s-vysledky-s-manazery`
11. `/blog/jake-otazky-ma-mit-pulse`
12. `/blog/survey-fatigue`
13. `/blog/co-je-dobre-skore`
14. `/blog/segmentace-bez-bullshitu`
15. `/blog/korelace-vs-kauzalita`
16. `/blog/jak-funguje-echo-pulse`
17. `/blog/vysledky-vidite-okamzite`
18. `/blog/jak-z-pulzu-udelat-akcni-meeting`
19. `/blog/nejcastejsi-chyby-pri-pulzu`
20. `/blog/pilot-na-1-tym`
21. `/blog/je-to-opravdu-anonymni`
22. `/blog/kolik-casu-to-vezme`
23. `/blog/spatne-vysledky-krizovy-protokol`
24. `/blog/toxicke-odpovedi-ventilace`
25. `/blog/proc-ne-google-forms`
26. `/blog/quiet-quitting-ceske-firmy`
27. `/blog/burnout-riziko-vykonu`
28. `/blog/onboarding-mereni-vykonu`
29. `/blog/kultura-je-chovani`
30. `/blog/stredni-management-uzke-hrdlo`

---

## Co NEDĚLAT

❌ Nevymýšlej zákaznické citáty, čísla, ani studie — používej POUZE to, co je v Source of Truth nebo obecně ověřitelné (Gallup, HBR, McKinsey, SHRM)
❌ Neodkazuj na echopulse.cz — vše směřuj na www.behavera.com
❌ Nepoužívej slova: synergický, holistický, komplexní řešení, dynamické prostředí, paradigma, stakeholder, implementace (pokud nejde o technický kontext)
❌ Nepiš jako ChatGPT-default — žádné „V dnešní době...", „Je důležité si uvědomit…", „Pojďme se podívat na…"
❌ NEMĚŇ slugy — jsou napojené na URL routing webu
❌ Nepřidávej obrázky ani JSX komponenty
❌ NEZVEŘEJŇUJ interní informace ze Source of Truth: ceny, demo přihlášení, pipeline firmy, OKRs, sales skripty, churnované firmy
❌ Nezmiňuj interní procesy nebo sales flow — článek je pro čtenáře, ne pro sales team

## Co je OK zveřejnit (ze Source of Truth)

✅ Zákaznické citáty schválené pro publikaci (viz Source of Truth sekce 10 a 20): Grammer/Mario Tulia, StartupJobs/Tereza Müllerová, Artisan-Grow Rangers/Petr Novák, Socialmind/Frederika Schwarzová, Ponvia, Expando, Valxon, Vodafone, 365.bank
✅ Seznam aktivních zákazníků z Části 20 (jen ty pod „Aktivní zákazníci")
✅ ROI čísla a statistiky z Části 5
✅ Vědecké základy a teorie z Části 3 a 24
✅ Srovnání Echo vs. DIY z Části 6
✅ CEO fears z Části 21 a 22 (jako kontext, ne jako sales pitch)
✅ Behaviorální model účasti z Části 12

---

## Postup práce

1. Přečti SOURCE OF TRUTH celý — je to tvůj „mozek" o produktu
2. Přečti všech 30 článků
3. Přepiš je jeden po druhém, v pořadí 01–30
4. Každý článek vrať jako kompletní MDX soubor (frontmatter + obsah)
5. Mezi články vlož jasný oddělovač:

```
========================================
ČLÁNEK: XX-slug-nazev.mdx
========================================
```

### Pracuj v dávkách po 5–6 článcích (kvůli context window). Při každé dávce:
- Připomeň si Source of Truth
- Odkaz na články z jiných dávek dělej dle mapy slugů výše
- Na konci každé dávky shrň: co jsi změnil, klíčové vylepšení, na co si dát pozor při importu

---

## Vzorový výstup (ukázka stylu — NE kopírovat, jen inspirace pro tón)

```markdown
---
title: "Kolik stojí tichý odchod: čísla, která CEO nechtějí vidět"
slug: kolik-vas-stoji-ticha-fluktuace
persona: CEO
funnel: TOFU
reading_time_min: 8
primary_cta: Otestovat 1 tým zdarma
meta_description: "Propočítejte si skutečné náklady tiché fluktuace. ROI model s českými čísly — a vzorec, který změní pohled na odchody."
published_at: 2026-03-15
---

# Kolik stojí tichý odchod: čísla, která CEO nechtějí vidět

Mario Tulia řídí závod s 350 lidmi. Po prvním Echo Pulse řekl jednu větu: „To je zajímavé zrcadlo."

O dva měsíce později: „Money well spent."

Co viděl v tom zrcadle? Čísla, o kterých neměl tušení. Ne absenci. Ne stížnosti. Tiché náklady, které se nikde neprojevují — dokud neprorazí. Pak je pozdě.

Každý CEO zná svou měsíční fluktuaci. Skoro nikdo ale ví, kolik stojí ta **tichá** — lidé, kteří sice neodešli, ale dávno přestali pracovat naplno.

Tenhle článek vám dá vzorec. Dosaďte si svá čísla. A rozhodněte se.

## Tři čísla, která byste měli znát zpaměti

...
```

---

## A teď: začni přepisovat.

Začni články 01–05. U každého dodržuj všechna pravidla výše. Buď odvážný — radikálně vylepšuj, přepisuj, měň strukturu. Zachovej jádro tématu, ale neboj se ho podat úplně jinak, pokud to bude lepší.

Cíl: aby český CEO nebo HR ředitel ten článek dočetl, sdílel na LinkedIn, a Behaveru si zapamatoval jako firmu, která ví, o čem mluví.
"""

out = pathlib.Path("docs/blog-rewrite-prompt.md")
out.write_text(PROMPT.strip() + "\n", encoding="utf-8")
print(f"Written {out.stat().st_size:,} bytes → {out}")
