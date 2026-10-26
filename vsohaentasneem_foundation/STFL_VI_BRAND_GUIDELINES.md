# STFL VI BRAND GUIDELINES
**Version:** 3.0.0 (October 2026)  
**Governing Institution:** SohaelTasneem Foundation (STFL)  
**Canonical Platform Identity:** STFL VI  

---

## 1. Brand Hierarchy & Architectural Positioning

```
                  +----------------------------------------------+
                  |           SohaelTasneem Foundation           |
                  |                (STFL Ecosystem)              |
                  +----------------------------------------------+
                                         |
                                         v
                  +----------------------------------------------+
                  |                   STFL VI                    |
                  |     Unified Institutional Operating Platform |
                  +----------------------------------------------+
                                         |
       +------------------+--------------+-----------------+------------------+
       |                  |                                |                  |
       v                  v                                v                  v
+--------------+   +---------------+                       |           +--------------+
|  Governance  |   |   Identity    |                       |           |  Compliance  |
|   & Audits   |   |   & Access    |                       |           |   & Legal    |
+--------------+   +---------------+                       |           +--------------+
                                                           v
                                            +------------------------------+
                                            | Specialist Initiatives & Labs|
                                            +------------------------------+
                                              |-- GrihostiOS (Property)
                                              |-- HakimSarker.org (Archive)
                                              |-- QiM-AI 2.1 (Intelligence)
                                              |-- SkillConnect (Workforce)
                                              |-- MaxRemit / HelpEx / Perlu
```

### Positioning Matrix
- **Identity Essence:** Mature, human, institutional, quiet, technologically precise, credible, impact-driven.
- **What STFL VI Is:** A unified institutional operating platform connecting people, projects, governance, finance, properties, documents, compliance, and responsible intelligence.
- **What STFL VI Is Not:** It is NOT a generic corporate ERP, crypto dashboard, cyber-gaming UI, or basic SaaS utility.
- **Independence Preservations:**
  - **GrihostiOS** retains its distinct specialized vertical product identity (Property, Lease, Land, Agriculture).
  - **HakimSarker.org** retains its distinct academic memorial archive identity.
  - **QiM-AI 2.1** retains its sovereign research intelligence identity.
  - **Varizen Inc.** remains an independent external corporate entity; STFL VI never rebrands or implies legal ownership of Varizen Inc.

---

## 2. Official Visual Architecture & Color Palette

### 2.1 Institutional Core Palette
- **STFL Deep Ink:** `#081F2D` &bull; Primary text, terminal anchors, heavy contrasts.
- **STFL Royal Navy:** `#0B2B43` &bull; Primary headers, institutional banners, primary buttons.
- **STFL Snow:** `#FAFAF8` &bull; Warm daylight surface backgrounds, paper contrast.
- **STFL Stone:** `#E7E7E2` &bull; Structural divider borders, neutral card boundaries.
- **STFL Sovereign Gold:** `#C5A059` &bull; Archival plaques, honors, ceremonial seals.
- **STFL Living Tangerine:** `#FF6B35` &bull; Primary human action points, urgent CTAs.

### 2.2 Controlled "Bright-White / Neon" Digital System
The STFL VI digital interface uses a restrained, high-contrast bright-white / neon signal architecture. Neon is treated as an active precision **signal**, never as generic decoration.

```css
:root {
  /* STFL VI Bright-White / Neon Signal Tokens */
  --stfl-vi-white:    #FFFFFF;                 /* Ultra-pure white text & high-contrast surfaces */
  --stfl-vi-bright:   #F8FAFC;                 /* Luminous elevated surface tint */
  --stfl-vi-neon:     #00D4FF;                 /* Cyber cyan precision signal & active focus */
  --stfl-vi-dark:     #070D18;                 /* Deep space base canvas */
  --stfl-vi-surface:  #0E1726;                 /* Console elevation surface */
  --stfl-vi-card:     #152238;                 /* Card container background */
  --stfl-vi-border:   rgba(0, 212, 255, 0.22); /* Precision glow boundary */
  --stfl-vi-muted:    #94A3B8;                 /* Secondary text & metadata */
  --stfl-vi-accent:   #0066FF;                 /* Core intelligence blue */
}
```

#### Signal Rules
- **Luminous Separators:** 1px hairline rules with `rgba(0, 212, 255, 0.2)` or `rgba(255, 255, 255, 0.1)`.
- **System Indicator Dots:** 6px/8px pulses with `#00D4FF` (Active), `#27C93F` (Operational), `#F59E0B` (Pending).
- **Prohibited:** Full neon background fields, low-contrast cyan text on white backgrounds, flickering animations, glowing paragraphs.

---

## 3. Secondary Visual Language: Monochrome Halftone Dot System

STFL VI incorporates the approved **Monochrome Halftone Dot Illustration** visual language.
- **Application Scope:** Hero section backdrops, impact storytelling banners, field photography treatment, thematic transitions (health, literacy, agriculture, community empowerment).
- **Asset Provenance:**
  - Primary Hero: `public/media/dot-matrix-hero.png`
  - Field Archetypes: `community-leader.jpg`, `tribal-artisan.jpg`, `health-worker.jpg`, `literacy-teacher.jpg`, `coastal-farmer.jpg`, `artisan-craft.jpg`.
- **Styling Treatment:** High-contrast duotone with soft dot rasterization, framed by restrained 1px hairline borders (`var(--stfl-vi-border)`).

---

## 4. Official Logo & Mark System

1. **STFL Shield Mark (Symbol):**
   - White variant: `public/stfl-mark-white.png` (for dark/neon surfaces).
   - Dark variant: `public/stfl-mark-dark.png` (for light/snow paper surfaces).
   - Transparent vector: `public/stfl-mark-transparent.png`.
2. **STFL Wordmark & Lockup:**
   - Full Lockup: `public/stfl-wordmark-white.png` & `public/stfl-wordmark-cream.png`.
   - Minimum Clear Space: Equivalent to 50% of the mark's height on all four sides.
   - Minimum Digital Display Height: 32px.
   - Prohibited Distortions: Never apply drop shadows, 3D extrusions, or hue shifts to the official STFL emblem.

---

## 5. Iconography Policy

- **Mandatory Library:** `iconoir-react` exclusively.
- **Prohibited Libraries:** Lucide, Heroicons, FontAwesome, Material Icons, Feather, Tabler, Radix Icons.
- **Stroke Width:** Uniform 1.5px or 2px across all UI states.
- **Verification Gate:** `npm run verify:icons` must exit with code 0 before every release.
