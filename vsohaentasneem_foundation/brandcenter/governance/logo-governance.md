# Logo Governance

**Authority:** CANONICAL
**Version:** 1.0 · 2026-10-18

---

## 1. Approved variants

| Asset ID | Variant | File | Use on |
|---|---|---|---|
| `AST-STFL-0001` | Dark navy monochrome | `stfl-mark-dark.png` | Light backgrounds, sticky nav, letterheads |
| `AST-STFL-0002` | Pure white monochrome | `stfl-mark-white.png` | Dark backgrounds, footer band, dark cards |
| `AST-STFL-0003` | Symbol (transparent) | `stfl-mark-transparent.png` | Admin layout, brand pages |
| `AST-STFL-0004` | Master logo (transparent) | `stfl-logo-transparent.png` | Brand pages |
| `AST-STFL-0005` | Original logo | `stfl-original-logo.png` | Brandcenter, Play Store listing |
| `AST-STFL-0006` | Full logo (Android) | `logo_stfl_full.png` | Android `StflLogo` composable |
| `AST-STFL-0007` | Wordmark — cream | `stfl-wordmark-cream.png` | Brandcenter |
| `AST-STFL-0008` | Wordmark — white | `stfl-wordmark-white.png` | Brand pages |
| `AST-STFL-0009` | Wordmark — transparent | `stfl-wordmark-transparent.png` | Brand pages |
| `AST-STFL-0010` | Favicon | `favicon.ico` | Browser tab |

Canonical copies: [`../identity/`](../identity/).

---

## 2. Selection rule

| Background | Use |
|---|---|
| Light (`#FAFAF8`, `#FFFFFF`, `#E7E7E2`) | `stfl-mark-dark.png` |
| Dark (`#081F2D`, `#0B2B43`, `#000000`) | `stfl-mark-white.png` |
| Photographic / variable | `stfl-mark-white.png` with a scrim, or `stfl-mark-transparent.png` |
| Favicon slot | `favicon.ico` |

Never place the dark mark on a dark background. Never place the white mark on a light background.

---

## 3. Clear space

Minimum clear space on all sides = **the height of the mark's cap-height**, or 25% of the mark's height, whichever is greater.

No text, graphic, edge or other logo may enter the clear space.

---

## 4. Minimum size

| Medium | Minimum |
|---|---|
| Digital | 24 px height |
| Print | 10 mm height |
| Favicon | 16 px (use `favicon.ico` only) |

Below minimum size, use the symbol, not the full logo.

---

## 5. Prohibited

| Prohibited | Reason |
|---|---|
| Recolouring | Breaks recognition |
| Rotating or skewing | Breaks form |
| Outlining or adding stroke | Breaks form |
| Adding drop shadow or glow | Breaks the quiet institutional tone |
| Stretching non-proportionally | Breaks form |
| Placing on a busy photo without a scrim | Fails contrast |
| Recreating the mark in another typeface | Breaks authenticity |
| Using a project logo as the STFL logo | Conflates identities |
| Cropping the mark | Breaks form |
| Animating the mark | Not approved |

---

## 6. Project logos

| Rule | Detail |
|---|---|
| Each project has its own logo | Yes, where `brand_status = NATIVE_VERIFIED` |
| Project logo may replace STFL logo | **No** |
| Project logo may appear alongside STFL logo | Yes, subordinate |
| Project logo may be recoloured by STFL | **No** — project identity is preserved |
| Projects without a logo | `CONCEPT_ONLY` — do not fabricate one |

### Independence preservations

GrihostiOS, HakimSarker.org and QiM-AI 2.1 retain distinct identities. STFL does not rebrand them.

---

## 7. Production paths

Every logo above is served from a production path. Those paths are **unchanged**.

| Asset | Production path |
|---|---|
| Institutional marks | `stflbd.org/public/` |
| Project logos | `stflbd.org/public/media/` |
| Android logo | `main/core/src/main/res/drawable-nodpi/` |
| Favicon | `stflbd.org/src/app/`, `main/web/src/app/` |

See [`../../portfolio/DEPENDENCY_MAP.md`](../../portfolio/DEPENDENCY_MAP.md).

---

## 8. Related

- [`brand-governance.md`](./brand-governance.md)
- [`color-system.md`](./color-system.md)
- [`accessibility.md`](./accessibility.md)