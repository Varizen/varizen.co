# Iconography

**Authority:** CONSTITUTIONAL
**Version:** 1.0 · 2026-10-18
**Upstream:** `stflbd.org/STFL_ICONOGRAPHY_POLICY.md`

---

## 1. The rule

**Every interface icon must originate from Iconoir.**

| Field | Value |
|---|---|
| Source | https://iconoir.com/ |
| Package | `iconoir-react` |
| Version | `^7.12.1` (controlled by `package.json` and the lockfile) |
| Enforced by | `scripts/verify-icon-policy.mjs` |
| Runs in | `main/web`, `stflbd.org` (before `next build`) |

---

## 2. Scope

Applies to every interface icon:

navigation · menus · arrows · chevrons · search · account · login · logout · settings · notifications · status indicators · actions · forms · buttons · cards · dashboards · breadcrumbs · pagination · dialogs · tables · filters · sorting · sharing · downloads · uploads · contact · location · social and interface controls

---

## 3. Prohibited

| Prohibited | Reason |
|---|---|
| Any icon library other than Iconoir | Violates the constitutional rule |
| Hand-drawn interface icons | Violates the rule |
| Emoji used as interface icons | Violates the rule |
| Inline SVG icons not from Iconoir | Violates the rule |
| Mixing icon sets | Breaks visual consistency |
| Recolouring an icon outside the palette | Breaks the colour system |

---

## 4. Usage

```tsx
import { NavArrowRight, User, Settings } from "iconoir-react";

<NavArrowRight width={20} height={20} strokeWidth={1.5} aria-hidden="true" />
```

| Property | Guidance |
|---|---|
| Size | 16, 20 or 24 px |
| Stroke width | 1.5 (default) |
| Colour | `currentColor` — inherits from text |
| Decorative | `aria-hidden="true"` |
| Meaningful | `aria-label` required |

---

## 5. Brand marks are not icons

The STFL logo, project logos and favicon are **brand assets**, not interface icons. They live in [`../identity/`](../identity/) and [`../assets/`](../assets/), and are governed by [`logo-governance.md`](./logo-governance.md).

---

## 6. Related

- [`brand-governance.md`](./brand-governance.md)
- [`color-system.md`](./color-system.md)
- [`accessibility.md`](./accessibility.md)