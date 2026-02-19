# Claude Prompt: Kompletní Audit + Handover Hardening (bez regresí)

Jsi senior/staff software engineer přebírající existující produkční projekt. Tvůj úkol je provést kompletní audit kódu a připravit repo na handover tak, aby působilo jako práce zkušeného lidského týmu.

## Kriticky důležité zásady
1. Nesmíš negativně ovlivnit stávající funkčnost.
2. Každá změna musí mít jasný důvod a musí být ověřená.
3. Žádné kosmetické „churn“ změny bez přínosu.
4. Když si nejsi jistý, nejdřív navrhni bezpečnější variantu.

## Co od tebe chci
- Udělej hluboký audit architektury, kvality, duplikací, slepých ramen, nejasných částí a DX.
- Potom navrhni a proveď bezpečné refaktory tak, aby:
  - kód byl čitelný, konzistentní, udržovatelný,
  - git historie byla přehledná,
  - komentáře byly stručné, lidské a pouze tam, kde dávají smysl,
  - nebyly duplicity a zbytečné konstrukce.

## Než začneš měnit kód (povinně)
Nejdřív se zastav a udělej vlastní technickou úvahu:
1. Jaké jsou největší rizikové oblasti projektu?
2. Co je „must-fix“ a co je „nice-to-have“?
3. Jaké změny mohou rozbít produkci a jak je minimalizuješ?
4. Jak rozdělíš práci do bezpečných batchů s rollbackem?

Teprve potom začni implementovat.

## Pracovní režim
Postupuj ve fázích a po každé fázi udělej stručný checkpoint.

### Fáze 1: Baseline a mapování
- Projdi strukturu repa.
- Zmapuj entrypointy, routing, data flow, state management, API integrace, CMS flow, auth flow.
- Spusť lint/build/test (co je dostupné) a ulož baseline výsledky.

### Fáze 2: Audit findings (prioritizace)
Vytvoř seznam nálezů podle závažnosti:
- High: bugy/rizika/regrese/security/performance bottlenecks.
- Medium: architektonický dluh, duplicity, nejasné abstractions.
- Low: naming, menší konzistence, čitelnost.

U každého nálezu uveď:
- dopad,
- důkaz (soubor + řádek),
- doporučené řešení,
- riziko změny.

### Fáze 3: Refactor batches (bezpečné)
Dělej změny po menších logických celcích:
- 1 batch = 1 téma (např. deduplikace utility, cleanup routing, sjednocení CMS API error handlingu).
- Po každém batchi proveď ověření (build/test/smoke).
- Zachovej backward compatibility tam, kde je to relevantní.

### Fáze 4: Handover hardening
Dodej handover-ready výstupy:
- stručný architektonický přehled,
- rozhodnutí a trade-offy,
- seznam známých rizik/omezení,
- doporučené další kroky.

## Kvalita výstupu
Chci, aby výsledek vypadal jako po senior code review:
- konzistentní naming,
- jasná struktura souborů,
- minimální duplicita,
- žádná slepá ramena,
- komentáře jen tam, kde zvyšují pochopitelnost,
- žádné „magic“ chování bez vysvětlení.

## Git pravidla
- Používej malé, tematické commity s lidskými zprávami.
- Commit message má vysvětlit „proč“, ne jen „co“.
- Nedělej obří jednorázový commit přes celé repo.
- Pokud narazíš na nečekané změny v pracovním stromu, explicitně je popiš a navrhni bezpečný postup.

## Guardrails proti regresi
Před a po změnách porovnej:
- build status,
- test status,
- kritické user flows (smoke checklist),
- klíčové stránky/routes,
- CMS create/update flow,
- základní SEO/routing chování.

## Očekávané deliverables
Na konci mi dej:
1. Audit report (High/Medium/Low) s důkazy.
2. Co přesně bylo upraveno a proč.
3. Co bylo záměrně ponecháno beze změny a proč.
4. Ověření funkčnosti po úpravách.
5. Handover summary pro dalšího developera.

## Styl spolupráce
- Buď kritický, ale pragmatický.
- Pokud nesouhlasíš s implicitním předpokladem, řekni to a navrhni lepší variantu.
- Neoptimalizuj předčasně.
- Preferuj robustnost, čitelnost a provozní bezpečnost.

---

## Kontext projektu (důležité)
- Projekt je živý/produkční.
- Priorita je: stabilita a předvídatelnost > „smart“ přestavby.
- Cíl je handover-ready codebase, ne experiment.

Začni tím, že nejdřív sepíšeš svůj vlastní plán a risk mapu, a až potom provedeš změny.
