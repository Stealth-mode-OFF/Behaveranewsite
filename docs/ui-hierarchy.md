# UI Visual Hierarchy Rules

> This document defines the enforced visual hierarchy rules for the Behavera marketing site.
> All engineers must follow these rules. Violations will cause visual hierarchy inflation.

## 1. Button Hierarchy

### Sizes
| Size | Height | Where allowed |
|------|--------|---------------|
| `lg` | 52px | **Hero section ONLY** |
| `default` | 48px | All sections, modals, forms |
| `sm` | 40px | Inside cards, inline actions |

**Rule: `size="lg"` is forbidden outside the Hero component.**

### Variants
| Variant | Meaning | Usage |
|---------|---------|-------|
| `default` | Primary action | **Max 1 per section** |
| `outline` | Secondary action | Alternatives, "learn more" |
| `ghost` | Tertiary action | Cards, inline links, minor CTAs |
| `inverse` | Primary on dark bg | Dark sections (CTA, role-selection) |
| `link` | Text-only action | Inline, minimal UI weight |

**Rule: Only ONE primary-weight button (`default` or `inverse`) per section.**
If a section needs two CTAs, the second must be `outline` or `ghost`.

### CTA Label Mapping
| Label | Variant |
|-------|---------|
| "Otestovat 1 tým zdarma" | `default` (primary) |
| "Objednat pro celou firmu" | `default` (primary) |
| "Rezervovat demo" / "Domluvit demo" | `outline` (secondary) |
| "Vyzkoušet" | `ghost` |
| "Proč ne Google Forms?" | `ghost` or `link` |
| "Chci si to nejdřív projít na demu" | `link` (never custom styled) |

### Forbidden Patterns
- ❌ `className="h-14"` or `className="h-12"` on Button — use `size` prop
- ❌ `className="px-8"` or `className="px-6"` on Button — use `size` prop
- ❌ `className="text-[16px]"` on Button — use `size` prop
- ❌ `className="rounded-2xl"` on Button — uses `var(--button-radius)` automatically
- ❌ Raw `<a>` styled to look like a button — use `<Button asChild><a>...</a></Button>`

## 2. KPI / Metric Hierarchy

### Core Metrics (dominant)
| Component | Values | Typography |
|-----------|--------|------------|
| `StatsBar` | 50,000+ / 80%+ / 2 min | `text-display` (36→48px) |

These are the **primary statistical proof**. They must always be the largest numbers on the page.

### Supporting Proof (subordinate)
| Component | Values | Typography |
|-----------|--------|------------|
| `StatChip` | +37% / +25% / 60% | `text-caption` (13px) |

These are **case study proof chips**. They must NEVER visually compete with core metrics.

**Rule: Use `<StatChip>` for proof metrics. Never use `text-lg` or larger for proof numbers.**

## 3. Typography Scale

All text sizes must come from the token system (theme.css `:root`):

| Token | Size | Usage |
|-------|------|-------|
| `text-display` | 36→48px | KPI numbers, pricing hero |
| `text-h1` | 36→48→64px | Hero headline ONLY |
| `text-h2` | 28→36px | Section headings |
| `text-h3` | 20→24px | Subsection headings |
| `text-h4` | 18px | Card titles |
| `text-body-lg` | 18px | Section subtitles |
| `text-body` | 17px | Body text |
| `text-body-sm` | 15px | Secondary body |
| `text-caption` | 13px | Labels, chips, metadata |

**Rule: No arbitrary `text-[XXpx]` for headings or body. Card-internal tiny text (10-12px) is acceptable.**

## 4. Spacing & Layout

### Section Spacing
| Class | Vertical padding | Usage |
|-------|-----------------|-------|
| `section-spacing` | 80→112→148px | Full sections |
| `section-spacing-compact` | 48→64px | Logo bar, stats bar |

**Rule: Every section must use one of these classes. No raw `py-XX` on section elements.**

### Container Widths
| Class | Max-width | Usage |
|-------|-----------|-------|
| `container-default` | 1200px | Most sections |
| `container-narrow` | 800px | Text-heavy content |
| `container-wide` | 1400px | Full-bleed content |

**Rule: Use container classes. No inline `max-w-[XXXpx]` for section containers.**

## 5. Card Rules

- Cards must NOT contain `default` (primary) variant buttons
- Card CTAs must be `ghost` or `link` variant, `size="sm"`
- Card padding follows token scale (--space-3 = 24px typical)
- No `shadow-xl` or `shadow-2xl` on cards — use `shadow-md` max

## 6. Quick Checklist Before PR

- [ ] `size="lg"` only in Hero
- [ ] Max 1 primary button per section
- [ ] No inline height/padding overrides on Button
- [ ] KPI proof uses `<StatChip>`, not custom blocks
- [ ] Section uses `section-spacing` or `section-spacing-compact`
- [ ] Container uses `container-default` / `container-narrow` / `container-wide`
- [ ] No arbitrary `text-[XXpx]` for headings
