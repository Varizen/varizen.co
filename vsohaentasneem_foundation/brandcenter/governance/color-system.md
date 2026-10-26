# Colour System

**Authority:** CANONICAL
**Version:** 1.0 · 2026-10-18
**Upstream:** `STFL_VI_BRAND_GUIDELINES.md` §2

---

## 1. Institutional core palette

| Token | Hex | Usage |
|---|---|---|
| STFL Deep Ink | `#081F2D` | Primary text, terminal anchors, heavy contrast |
| STFL Royal Navy | `#0B2B43` | Primary headers, institutional banners, primary buttons |
| STFL Snow | `#FAFAF8` | Warm daylight surfaces, paper contrast |
| STFL Stone | `#E7E7E2` | Structural dividers, neutral card boundaries |
| STFL Sovereign Gold | `#C5A059` | Archival plaques, honours, ceremonial seals |
| STFL Living Tangerine | `#FF6B35` | Primary human action points, urgent CTAs |
| STFL Black | `#000000` | Absolute contrast |

## 2. Digital signal tokens

| Token | Hex | Usage |
|---|---|---|
| `--stfl-vi-white` | `#FFFFFF` | Ultra-pure white text, high-contrast surfaces |
| `--stfl-vi-bright` | `#F8FAFC` | Luminous elevated surface tint |
| `--stfl-vi-neon` | `#00D4FF` | Cyber cyan precision signal, active focus |

**Neon is a signal, never decoration.** It marks active state, focus and precision — not ornament.

---

## 3. CSS custom properties

```css
:root {
  --stfl-ink:        #081F2D;
  --stfl-deep-navy:  #0B2B43;
  --stfl-snow:       #FAFAF8;
  --stfl-stone:      #E7E7E2;
  --stfl-accent:     #FF6B35;
  --stfl-black:      #000000;

  --stfl-content-width: 1240px;

  --stfl-space-1: 4px;   --stfl-space-2: 8px;
  --stfl-space-3: 12px;  --stfl-space-4: 16px;
  --stfl-space-5: 24px;  --stfl-space-6: 32px;
  --stfl-space-7: 48px;  --stfl-space-8: 64px;
  --stfl-space-9: 96px;  --stfl-space-10: 128px;

  --stfl-radius-sm: 8px;
  --stfl-radius-md: 12px;
  --stfl-radius-lg: 20px;

  --stfl-border: rgba(8, 31, 45, 0.14);
  --stfl-shadow-soft: 0 1px 2px rgba(0, 0, 0, 0.04);
  --stfl-transition: 180ms ease;
}
```

Source of truth: `stflbd.org/stfl-brand-tokens.css`, `main/web/stfl-brand-tokens.css`.

---

## 4. Contrast requirements

| Pair | Ratio | WCAG |
|---|---|---|
| `#081F2D` on `#FAFAF8` | 15.8:1 | AAA |
| `#081F2D` on `#FFFFFF` | 16.9:1 | AAA |
| `#FFFFFF` on `#081F2D` | 16.9:1 | AAA |
| `#FFFFFF` on `#0B2B43` | 13.4:1 | AAA |
| `#FF6B35` on `#FAFAF8` | 3.1:1 | AA large text only |
| `#C5A059` on `#081F2D` | 6.4:1 | AA |

`#FF6B35` on light backgrounds is **large text only** (≥18.66px bold or ≥24px regular). For body-size CTAs, use `#081F2D` text on a `#FF6B35` fill.

---

## 5. Surface hierarchy

| Surface | Token | Use |
|---|---|---|
| Base | `#FAFAF8` | Page background |
| Elevated | `#FFFFFF` | Cards, modals |
| Structural | `#E7E7E2` | Dividers, borders |
| Inverse | `#081F2D` | Footer, dark sections |
| Signal | `#00D4FF` | Active state, focus ring |

---

## 6. Prohibited

| Prohibited | Reason |
|---|---|
| Introducing a colour outside this palette | Breaks institutional consistency |
| Using neon as a fill or decoration | Neon is a signal only |
| Using `#FF6B35` for body-size text on light | Fails contrast |
| Gradients on institutional surfaces | Not approved |
| Recolouring a project logo to match STFL | Violates project identity |

---

## 7. Related

- [`logo-governance.md`](./logo-governance.md)
- [`accessibility.md`](./accessibility.md)
- [`typography.md`](./typography.md)