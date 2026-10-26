# STFL Web Design System Specification
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Engine:** Tailwind CSS v4.0.0 + Custom CSS Custom Properties  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Visual Character & Core Philosophy

The visual language of SohaelTasneem Foundation is deliberately crafted to convey:
- **Institutional Gravitas:** Calm, trustworthy, and precise.
- **Human Warmth:** Generous whitespace, authentic imagery, dignified editorial pacing.
- **Editorial Restraint:** Monochrome-first foundations with strategic, purposeful accents.
- **Subtlety:** Hairline borders (`1px border-[#E7E7E2]`), subdued box shadows, controlled border radii (max `0.75rem` / `12px`).

### What STFL is NOT:
- ❌ Not a generic blue-heavy SaaS dashboard.
- ❌ Not an NGO/charity cliché with emotional manipulation or poverty tropes.
- ❌ Not a bureaucratic, dated government portal.
- ❌ Not a visual clone of another organization (OpenAI is referenced solely for editorial discipline and typography clarity, not visual copying).

---

## 2. Color Palette & Semantic Roles

| Token Name | Hex Code | Semantic Role | Usage Guidance |
|---|---|---|---|
| **Primary Dark** | `#081F2D` | Dominant brand anchor, hero backgrounds, primary text headings. | Used for high-contrast institutional headers, primary buttons, and navigational bars. |
| **Charcoal** | `#1A1A1A` | Secondary text, deep typography, body copy dark mode. | Standard primary text color on light backgrounds for soft contrast. |
| **Snow** | `#FAFAF8` | Neutral canvas, secondary section backgrounds, subtle zebra striping. | Warms the interface beyond harsh `#FFFFFF` pure white. |
| **Stone** | `#E7E7E2` | Structural borders, hairline dividers, card outlines. | Clean, neutral delimitation without harsh dark lines. |
| **Action Orange** | `#FF6B35` | Interactive accents, primary CTAs, active status indicators. | **Used strategically.** Never floods entire screens; reserved for action triggers. |
| **White** | `#FFFFFF` | Card surfaces, modal sheets, primary container backdrops. | Crisp foreground surface layer. |
| **Emerald** | `#059669` | Success states, verified cryptographic matches, active programs. | Reassuring, clear confirmation cues. |
| **Rose / Crimson** | `#E11D48` | Compliance holds, security alerts, revocations, errors. | Strict, unambiguous caution indicators. |

---

## 3. Typography System

The design system guarantees first-class typographical parity between English and Bengali:

```css
/* Font Family Definitions (globals.css) */
--font-inter: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-hind: var(--font-hind), "Hind Siliguri", sans-serif;
--font-noto: var(--font-noto), "Noto Sans Bengali", sans-serif;
--font-mono: var(--font-mono), "JetBrains Mono", monospace;
```

### Font Pairing Rules:
1. **Bengali Headings & Institutional Titles:** `Hind Siliguri` (Weights: 600, 700). High legibility for complex Bengali conjuncts and formal institutional phrasing.
2. **Bengali Body Text:** `Noto Sans Bengali` (Weights: 400, 500). Generous line height (`leading-relaxed` or `line-height: 1.65`) to ensure vowel diacritics (matras) never collide.
3. **English Headings & Body:** `Inter` (Weights: 400, 500, 600, 700). Clean, objective grotesque letterforms with excellent micro-legibility.
4. **Code, Technical Hashes & IDs:** `JetBrains Mono` (Weights: 400, 500). Tabular figures, distinct zeros, ideal for document IDs (`STFL-DOC-2026-X892`).

---

## 4. Iconography Specification

### The Absolute Iconoir Rule
Only `iconoir-react` is authorized for interface icons across all web pages.

```typescript
// ✅ Approved:
import { ShieldCheck, CheckCircle, ArrowRight, BookStack } from "iconoir-react";

// ❌ Strictly Prohibited:
// import { Shield, Check } from "lucide-react";
// import { CheckIcon } from "@heroicons/react/24/outline";
// import { FaCheck } from "react-icons/fa";
```

### Icon Standards:
- **Default Color:** `currentColor` (adapts to parent typography).
- **Default Stroke Width:** `1.5` to `1.75` for crisp rendering on high-DPI displays.
- **Approved Sizing Scales:**
  - Micro / Inline: `12px`, `14px`
  - Standard Action: `16px`, `18px`, `20px`
  - Feature / Section Head: `24px`, `32px`
  - Display / Empty State: `40px`, `48px`

---

## 5. Layout, Spacing & Container Hierarchy

- **Global Max Width:** `1440px` (`max-w-[1440px]` or `var(--stfl-max-width)`).
- **Reading Width:** `65ch` to `75ch` (`max-w-2xl` or `max-w-3xl`) for editorial and policy pages.
- **Section Padding:**
  - Desktop: `py-16` to `py-24` (80px – 120px) with expansive whitespace.
  - Mobile: `py-10` to `py-14` (40px – 56px) for compact, focused viewing.
- **Card Styling:**
  - Background: `#FFFFFF`
  - Border: `1px solid #E7E7E2`
  - Radius: `rounded-xl` (`0.75rem` / `12px`)
  - Hover: `hover:border-[#FF6B35]/40 hover:shadow-sm transition-all`
