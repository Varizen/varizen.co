# STFL Brand System

## Brand

Official institutional name:

**SohaelTasneem Foundation**

The institutional brand must always use:

`SohaelTasneem`

Never use:

`Sohael Tasneem`

unless explicitly referring to a separate person's name.

---

## Design Direction

STFL should feel:

- institutional
- human
- calm
- intelligent
- contemporary
- trustworthy
- editorial
- generous
- precise

The visual system should use the discipline of high-end technology and
institutional brand systems without copying another company's identity.

---

# 01 — LOGO

The native STFL logo is the only primary identity.

Never redraw, stretch, distort, recolor arbitrarily, crop, rotate or add
effects to the logo.

Maintain a defined clear-space zone around the logo.

Preferred presentation:

- black on light backgrounds
- white on dark backgrounds
- full-color native logo only where appropriate

Do not place the logo over visually busy imagery.

---

# 02 — WHITESPACE

Whitespace is an active design element.

Prefer:

- large outer margins
- generous section spacing
- short readable text blocks
- breathing room around logos
- simple compositions
- fewer elements per screen

Avoid:

- crowded cards
- unnecessary borders
- excessive shadows
- dense icon grids
- decorative UI noise

---

# 03 — TYPOGRAPHY & BILINGUAL GOVERNANCE (BN / EN)

The STFL VI platform operates under a mandatory, first-class bilingual (BN / EN) typography system across Web, Android, Management Consoles, Projects, Digital Documents, Training, Compliance, Communications, and Print Substrates.

### 3.1 Language Invariants
- **First-Class Status:** Bengali (BN) and English (EN) are treated with equal operational rigor.
- **Direction:** Left-to-Right (LTR) for both Bengali and English.
- **Selection & Persistence:** User-selectable with persistence via cookies/profile; default language is configurable and never permanently hard-coded.
- **Zero Runtime Machine Translation:** UI strings and legal notices must use static, canonical `bn` and `en` content dictionaries. Machine translation at runtime is strictly prohibited.
- **No Monolingual Critical Workflows:** Security messages, authorization decisions, legal/compliance notices, and approval gates must never exist in only one language.

### 3.2 Font Family Stack & Usage

#### 1. Bangla Headers & Footers (MANDATORY: Hind Siliguri)
- **Primary Font:** `Hind Siliguri` (Weights: SemiBold 600, Bold 700)
- **Application:** All Bangla H1, H2, H3 display headings, modal titles, console headers, and institutional document footers.
- **Mandatory Embedding:** Digital documents, PDF/print templates, letterheads, certificates, and legal notices MUST embed Hind Siliguri.
- **Fallback Stack:** `'Hind Siliguri', 'SolaimanLipi', 'Kalpurush', 'Noto Sans Bengali', sans-serif`

#### 2. Bangla Body & Content Text (Baloo Da 2 / Noto Sans Bengali)
- **Primary Fonts:** 
  - `Baloo Da 2` (Weights: Regular 400, Medium 500) — Optimal for interactive UI, cards, forms, and editorial reading.
  - `Noto Sans Bengali` (Weights: Regular 400, Medium 500) — Optimal for high-density tables, system logs, code annotations, and compact data grids.
- **Fallback Stack:** `'Baloo Da 2', 'Noto Sans Bengali', 'SolaimanLipi', 'Vrinda', sans-serif`

#### 3. English Typography (STFL Approved Guidelines)
- **Headings & Display:** `Inter` (Weights: SemiBold 600, Bold 700, ExtraBold 800)
- **Body & Content:** `Inter` (Weights: Regular 400, Medium 500)
- **Fallback Stack:** `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace / Code / Hashes:** `JetBrains Mono` (Weights: Regular 400, Medium 500, SemiBold 600)
- **Fallback Stack:** `'JetBrains Mono', 'Courier New', monospace`

### 3.3 Typographic Scale & Line-Height Governance

| Level | Size (Desktop) | Size (Mobile) | English Line-Height | Bengali Line-Height (Increased) | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display (H1)** | 36px–44px | 28px–32px | 1.25 | **1.55 – 1.65** | 700 / 800 |
| **Section (H2)** | 24px–28px | 20px–24px | 1.30 | **1.60 – 1.70** | 700 |
| **Card / Panel (H3)** | 18px–20px | 16px–18px | 1.35 | **1.65 – 1.75** | 600 |
| **Body Large** | 16px–18px | 15px–16px | 1.45 | **1.70 – 1.80** | 400 / 500 |
| **Body Regular** | 14px–15px | 14px | 1.50 | **1.70 – 1.80** | 400 |
| **Caption / Chip** | 12px–13px | 12px | 1.40 | **1.60 – 1.70** | 500 / 600 |
| **Monospace / Audit**| 12px–14px | 11px–12px | 1.45 | **1.50** | 400 / 500 |

*CRITICAL LINGUISTIC RULE:* Bengali script requires increased line-height (1.6 to 1.8) compared to Latin text (1.4 to 1.5) to prevent vertical clipping of vowel diacritics (*matras* like *oi-kar*, *e-kar*, *ref*) and sub-base conjuncts (*u-kar*, *ri-kar*, *hasanta*).

### 3.4 Bengali Conjuncts & Diacritic Integrity
- **Normalization:** All stored and transmitted Bengali text must strictly adhere to Unicode NFC (Canonical Composition).
- **Zero Ligature Breaking:** Prohibit zero-width non-joiners (ZWNJ) or font sub-setting that clips complex conjuncts (*যুক্তবর্ণ* e.g., ক্ষ, জ্ঞ, ত্ত, ষ্ণ, ক্ত, ঙ্গ).
- **Text Rendering Engine:** Web must leverage OpenType features (`font-feature-settings: "kern" 1, "liga" 1;`); Android must use HarfBuzz OpenType layout.

### 3.5 Cross-Platform Embedding Requirements
- **Web Platform:** Preconnect to font CDNs; bundle local WOFF2 fallbacks with `font-display: swap`.
- **Android Platform:** Bundle TrueType font files in `apk/app/src/main/res/font/` (`hind_siliguri_bold.ttf`, `hind_siliguri_semibold.ttf`, `noto_sans_bengali_regular.ttf`). Never rely on host OS default fonts for Bengali.
- **PDF & Physical Print:** TrueType/OpenType font embedding is strictly mandatory in PDF export pipelines to guarantee physical print fidelity without missing glyph boxes.

### 3.6 Approved Creative Attribution
Where the creative platform attribution is displayed, approved bilingual forms must be used:
- **English:** `"Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc."`
- **Bengali:** `"ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি"`
*Governance Status:* Creative attribution only; does not replace or modify institutional legal entity identity (*SohaelTasneem Foundation*).

---

# 04 — COLOR

Primary:

STFL Ink       #081F2D
STFL Deep Navy #0B2B43
STFL Snow      #FAFAF8
STFL Stone     #E7E7E2
STFL Accent    #FF6B35
STFL Black     #000000

Use monochrome as the structural foundation.

Orange is an accent, not the dominant background.

Avoid gradients unless explicitly approved.

Avoid decorative color noise.

---

# 05 — GRID

Use a disciplined responsive grid.

Desktop:

maximum content width approximately 1200–1280px.

Mobile:

comfortable side padding approximately 20–24px.

Use consistent horizontal alignment across:

- navigation
- headings
- logo specimens
- body copy
- footer
- section numbering

---

# 06 — BRAND GUIDE NAVIGATION

The /brand page should behave like a professional design-guideline
publication.

Recommended sections:

01 Foundation
02 Logo System
03 Clear Space
04 Sizing
05 Misuse
06 Color
07 Typography
08 Digital Language
09 Applications
10 Partnerships
11 Governance

Navigation should remain simple.

No excessive animations.

---

# 07 — LOGO SPECIMENS

Show the native STFL logo in controlled environments:

Light:
black logo

Dark:
white logo

Full-color:
approved native version

Every specimen should show sufficient surrounding whitespace.

Provide dimensions and usage notes where appropriate.

---

# 08 — DO / DON'T

Use concise visual examples.

DO:

- preserve proportions
- maintain clear space
- use approved colors
- use generous whitespace
- maintain hierarchy
- keep backgrounds quiet

DON'T:

- stretch
- rotate
- crop
- add effects
- add unauthorized colors
- place on busy imagery
- alter the emblem
- create unofficial lockups

---

# 09 — PARTNERSHIPS

When STFL appears beside another organization:

- maintain balanced visual weight
- maintain equal optical height where appropriate
- use sufficient spacing
- preserve each organization's identity
- never imply endorsement unless authorized

---

# 10 — DIGITAL LANGUAGE

STFL digital products should feel:

Clear.
Human.
Quiet.
Useful.
Trustworthy.

Avoid marketing clichés.

Avoid excessive capitalization.

Avoid unnecessary exclamation marks.

Avoid decorative technology language.

---

# 11 — COMPONENT STYLE

Cards:

Prefer flat or extremely subtle surfaces.

Borders:

Use restrained 1px separators when needed.

Shadows:

Minimal.

Buttons:

Simple, high-contrast, accessible.

Icons:

Simple, consistent, monochrome-first.

Images:

Large, purposeful, editorial.

---

# 12 — MOTION

Motion must communicate hierarchy or state.

Preferred:

- subtle fade
- controlled reveal
- short transitions
- gentle hover states

Avoid:

- bouncing
- spinning
- excessive parallax
- flashy gradients
- continuous animation

---

# 13 — ACCESSIBILITY

Maintain:

- readable contrast
- keyboard navigation
- visible focus states
- semantic headings
- descriptive alt text
- reduced-motion support
- responsive typography

---

# 14 — BRAND GOVERNANCE

The design system must remain consistent across:

- website
- Android application
- social graphics
- documents
- presentations
- campaign materials
- partner materials

The website must not create a visually separate STFL identity.

---

# FINAL PRINCIPLE

The goal is not to look like another technology company.

The goal is for STFL to look like STFL:

Human.
Precise.
Calm.
Modern.
Credible.

Use restraint as the primary design tool.
