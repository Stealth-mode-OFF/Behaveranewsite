# Behavera Blog — Zdroj pravdy (FACTS)

> Poslední aktualizace: 2026-02-21
> Tento soubor slouží jako jediný zdroj opakovaně používaných statistik a tvrzení v článcích.
> Každé číslo zde má primární zdroj. Pokud zdroj chybí nebo je nejistý, číslo sem nepatří.

---

## 1. Engagement — Gallup

### Globální stav engagementu
- **23 % zaměstnanců celosvětově je engagovaných** (aktivně zapojených). 59 % je „tichých odcházejících" (not engaged), 18 % je aktivně odpojených.
- **V Evropě je engagement ještě nižší — přibližně 13 %**, jeden z nejnižších regionů.
- Nízký engagement stojí globální ekonomiku odhadem **8,8 bilionu USD ročně** (cca 9 % globálního HDP).

> [G1] Gallup. *State of the Global Workplace 2023*. https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx. Přístup: 2026-02-21.

### Dopad engagementu na byznys výsledky (meta-analýza Q12)
Srovnání obchodních jednotek v horním vs. dolním kvartilu engagementu:
- **23 % vyšší ziskovost** (profitability)
- **18 % vyšší produktivita** (productivity in sales)
- **41 % nižší absence**
- **18–43 % nižší fluktuace** (18 % u firem s přirozeně vysokou fluktuací, 43 % u firem s nízkou)
- **10 % vyšší zákaznická loajalita / hodnocení**

> [G2] Harter, J.K. et al. *The Relationship Between Engagement at Work and Organizational Outcomes: 2020 Q12 Meta-Analysis (10th Edition)*. Gallup, 2020. https://www.gallup.com/workplace/321725/gallup-q12-meta-analysis-report.aspx. Přístup: 2026-02-21.

**Poznámka:** Starší edice meta-analýzy (2016) uváděly 21 % profitability a 17 % productivity. Při citaci vždy uvádějte edici.

### Role manažera
- **Manažeři ovlivňují přinejmenším 70 % rozptylu v engagementu** napříč týmy.

> [G3] Gallup. *Managers Account for 70% of Variance in Employee Engagement*. https://news.gallup.com/businessjournal/182792/managers-account-variance-employee-engagement.aspx. Přístup: 2026-02-21.

---

## 2. Náklady fluktuace

### Náklady na nahrazení zaměstnance
- Odhad: **50–200 % ročního platu** zaměstnance (závisí na senioritě a roli).
  - Řadový zaměstnanec: ~50 % ročního platu
  - Specialista / střední management: ~100–150 %
  - Senior / vedení: až 200 %
- Zahrnuje: nábor, onboarding, ztrátu produktivity v ramp-up období, ztrátu znalostí.

> [F1] Gallup. *This Fixable Problem Costs U.S. Businesses $1 Trillion*. https://www.gallup.com/workplace/247391/fixable-problem-costs-businesses-trillion.aspx. Přístup: 2026-02-21.
> [F2] SHRM. *Retaining Talent: A Guide to Analyzing and Managing Employee Turnover*. https://www.shrm.org/topics-tools/tools/toolkits/managing-employee-turnover. Přístup: 2026-02-21.

### Výpočetní vzorec pro české prostředí
Pro zjednodušený ROI model v článcích používejte:

```
Náklad fluktuace 1 zaměstnance ≈ roční hrubá mzda × koeficient (0,5–2,0)
Koeficient závisí na senioritě:
  - junior / výroba / retail: 0,5–0,75
  - specialista / administrativa: 0,75–1,25
  - management / senior expert: 1,25–2,0
```

Pro aktuální průměrnou mzdu v ČR odkazujte na ČSÚ (viz sekce 3).

---

## 3. České mzdy a trh práce — ČSÚ

### Průměrná mzda
- Pro aktuální údaje vždy odkazujte na nejnovější „Rychlou informaci" ČSÚ.
- **Neuvádějte konkrétní číslo v FACTS.md** — mění se čtvrtletně. V článku napište „podle aktuálních dat ČSÚ" + odkaz.
- Odkaz na sekci mezd: https://www.czso.cz/csu/czso/prace_a_mzdy_prace

> [C1] ČSÚ. *Práce a mzdy*. https://www.czso.cz/csu/czso/prace_a_mzdy_prace. Přístup: 2026-02-21.

### Míra nezaměstnanosti
- Obecná míra nezaměstnanosti v ČR patří dlouhodobě k nejnižším v EU.
- Pro aktuální číslo: https://www.czso.cz/csu/czso/zamestnanost_nezamestnanost_prace

> [C2] ČSÚ. *Zaměstnanost, nezaměstnanost*. https://www.czso.cz/csu/czso/zamestnanost_nezamestnanost_prace. Přístup: 2026-02-21.

---

## 4. GDPR a anonymita

### Klíčové principy
- **Recitál 26 GDPR:** Principy ochrany údajů by se neměly vztahovat na anonymní informace — tj. informace, které se nevztahují k identifikované či identifikovatelné fyzické osobě.
- **Pseudonymizace ≠ anonymizace.** Pseudonymizovaná data jsou stále osobní údaje.
- **Agregace + prahová hodnota** (typicky 5+ respondentů v segmentu) je klíčový technický prostředek pro dosažení anonymity v pulse surveys.

> [D1] GDPR Recitál 26. https://gdpr.eu/recital-26-not-applicable-to-anonymous-data/. Přístup: 2026-02-21.
> [D2] EDPB. *Guidelines on Pseudonymisation*. https://www.edpb.europa.eu. Přístup: 2026-02-21.

### Jak to řeší Behavera / Echo Pulse
- Role-based přístup: CEO, HR a manažer vidí různé úrovně detailu.
- Agregace pod prahovou hranici se nezobrazuje (ochrana malých týmů).
- Žádné propojení odpovědí s identitou respondenta v dashboardu.

*Zdroj: Behavera Trust Center, FAQ na webu.*

---

## 5. Pulse survey benchmarky

### Účast (response rate)
- **Dobrá účast:** 70–80 %+
- **Průměrná:** 50–70 %
- **Problematická:** pod 50 % (signál nedůvěry nebo survey fatigue)
- Klíčové faktory: komunikace před rozesláním, důvěra v anonymitu, viditelné akce po předchozím kole.

*Zdroj: Gallup best practices + interní benchmarky Behavera.*

### Cadence
- **Týdenní pulse:** 1–3 otázky, vhodné pro agilní týmy.
- **Měsíční pulse:** 5–8 otázek, nejčastější cadence pro české firmy 50–500 lidí.
- **Čtvrtletní:** 10–15 otázek, hlubší diagnostika.
- Roční průzkumy jako doplněk, ne náhrada pulzu.

---

## 6. Produktová tvrzení — Behavera / Echo Pulse

### Co je bezpečné tvrdit
- „První signály vidíte v dashboardu okamžitě po prvních odpovědích."
- „Pro stabilní obrázek týmu je klíčová účast — typicky během prvních 24–48 hodin po rozeslání."
- „Pilot na jednom týmu trvá typicky 2–4 týdny."
- „Vyplnění pulzu zabere zaměstnanci 1–2 minuty."

### Co netvrdit
- „Okamžitě vyřešíte fluktuaci" — přehnané.
- „Garantujeme zvýšení engagementu o X %" — neměřitelný slib.
- „Nejlepší nástroj na trhu" — subjektivní, nedokazatelné.

---

## Pravidla použití

1. Pokud v článku citujete číslo z tohoto souboru, **vždy uveďte odpovídající referenci** v sekci „Zdroje" článku.
2. Pokud potřebujete číslo, které zde není, **nejprve ho doplňte sem** (s primárním zdrojem), teprve pak použijte v článku.
3. Čísla, která nejde ověřit, sem nepatří. Nahraďte je principem nebo rozsahem.
