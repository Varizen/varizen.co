# STFL AIO — Bilingual & Typography Governance Specification

> **Document ID:** `STFL-DOC-2026-BILINGUAL-TYPOGRAPHY-V1`  
> **Master Version:** `1.0.0`  
> **Date:** October 15, 2026  
> **Author:** STFL AIO Principal Architecture, Brand Custodian & Typography Governance Committee  
> **Attribution:** *Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.*  
> **Bengali Attribution:** *ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি*  
> **Release Gate Status:** `PENDING (Prompt 13 Gate Closed)`  
> **Classification:** Constitutional Brand & Engineering Standard

---

## 1. Executive Mandate & Institutional Scope

The **SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform (STFL AIO)** mandates a first-class, fully bilingual **Bengali (BN)** and **English (EN)** system across all current and future touchpoints:
- **Public Platforms:** Institutional portal, zonal websites, project microsites, e-shop, public verification pages.
- **Client Applications:** Native Android application, web applications, desktop administration utilities.
- **Enterprise Consoles:** All 18 Management Consoles (CON-01 to CON-18).
- **Physical & Digital Artifacts:** Official documents, PDF templates, print letterheads, credentials, certificates, notices.
- **Governance & Legal:** Statutory compliance rules, legal escalation notices, training SOPs, certification exams.
- **System Communications:** Multi-channel messaging (SMS, WhatsApp, Push), automated alerts, error dialogues, security prompts.

---

## 2. Bilingual Architecture (BN / EN)

### 2.1 First-Class Status & Language Invariants
1. **Equal Operational Primacy:** Bengali and English are equal first-class citizens. No core workflow, security challenge, financial ledger, authorization decision, or legal notice may exist exclusively in one language, unless referencing an external third-party statutory instrument.
2. **Left-to-Right (LTR) Direction:** Both Bengali and English operate in Left-to-Right (LTR) text direction. UI layouts, flex orders, and typography grids remain structurally consistent.
3. **User Selection & Persistence:**
   - Users can toggle between `BN` and `EN` at any moment in any interface without session termination.
   - Preference persistence order: `User Profile Database Record` > `Secure stfl_lang Cookie` > `Browser localStorage` > `HTTP Accept-Language Header Fallback`.
   - The default language is configurable per deployment/project and **must never be permanently hard-coded**.
4. **Zero Runtime Machine Translation:**
   - Translating UI strings, labels, warnings, or legal terms at runtime via automated translation engines is **strictly prohibited**.
   - Every translatable component must maintain explicit, pre-vetted canonical `bn` and `en` string dictionaries.
   - Missing translations are detected automatically during CI/CD build validation.

---

## 3. Authoritative Typography System

The typography system is engineered to harmonize the visual weight and aesthetic dignity of the Bengali script with modern Latin typography.

```
+-----------------------------------------------------------------------------+
|                          STFL TYPOGRAPHY STACK                              |
+-----------------------+-----------------------------+-----------------------+
| SCRIPT / ROLE         | PRIMARY APPROVED FONT       | WEIGHTS & USAGE       |
+-----------------------+-----------------------------+-----------------------+
| Bangla Headers        | Hind Siliguri (Mandatory)   | 600 SemiBold, 700 Bold|
| Bangla Footers        | Hind Siliguri (Mandatory)   | 600 SemiBold, 700 Bold|
| Bangla Interactive UI | Baloo Da 2                  | 400 Regular, 500 Med  |
| Bangla Dense Data/Logs| Noto Sans Bengali           | 400 Regular, 500 Med  |
| English Headings      | Inter                       | 600, 700, 800         |
| English Body Copy     | Inter                       | 400 Regular, 500 Med  |
| Monospace / Code/Hash | JetBrains Mono              | 400 Regular, 500 Med  |
+-----------------------+-----------------------------+-----------------------+
```

### 3.1 Bangla Headers & Footers: Hind Siliguri (Mandatory)
- **Rationale:** Hind Siliguri delivers clean, confident letterforms with distinct terminal cuts and optimized horizontal proportions for display hierarchy.
- **Mandatory Embedding:** All digital documents, PDF generation substrates, print templates, official certificates, and letterhead footers **MUST** embed `Hind Siliguri`.
- **Fallback Hierarchy:**
  ```css
  font-family: 'Hind Siliguri', 'SolaimanLipi', 'Kalpurush', 'Noto Sans Bengali', sans-serif;
  ```

### 3.2 Bangla Body & Content: Baloo Da 2 / Noto Sans Bengali
- **Baloo Da 2:** Primary font for user-facing editorial copy, mobile reading, interactive buttons, modal dialogues, and card content.
- **Noto Sans Bengali:** Primary font for high-density administrative tables, general ledger entries, multi-tenant audits, and technical logs.
- **Fallback Hierarchy:**
  ```css
  font-family: 'Baloo Da 2', 'Noto Sans Bengali', 'SolaimanLipi', 'Vrinda', sans-serif;
  ```

### 3.3 English Typography: Inter & JetBrains Mono
- **Headings & Body:** `Inter` adheres to STFL brand standards, providing geometric clarity, neutral neutrality, and high legibility at micro sizes.
- **Audit & Monospace:** `JetBrains Mono` provides exact glyph distinctions (`0` vs `O`, `1` vs `l`) for hashes, tokens, and cryptographic keys.

---

## 4. Typographic Scale & Line-Height Governance

Bengali script includes conjuncts (*যুক্তবর্ণ*), upper-matras (*ঐ-কার, ৈ, ৌ*), and lower-matras (*ু-কার, ৃ-কার, হসন্ত*). Using standard Latin line-height causes severe visual clipping and glyph collision.

| Hierarchy Level | Desktop Size | Mobile Size | EN Line-Height | BN Line-Height (Increased) | Approved Weights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display H1** | 36px–48px | 28px–32px | 1.25 | **1.55 – 1.65** | 700 / 800 |
| **Section H2** | 24px–28px | 20px–24px | 1.30 | **1.60 – 1.70** | 700 |
| **Card / Modal H3** | 18px–20px | 16px–18px | 1.35 | **1.65 – 1.75** | 600 |
| **Body Large** | 16px–18px | 15px–16px | 1.45 | **1.70 – 1.80** | 400 / 500 |
| **Body Regular** | 14px–15px | 14px | 1.50 | **1.70 – 1.80** | 400 |
| **Caption / Chip** | 12px–13px | 12px | 1.40 | **1.60 – 1.70** | 500 / 600 |
| **Monospace / Hash** | 12px–14px | 11px–12px | 1.45 | **1.50** | 400 / 500 |

---

## 5. Script Rendering, Conjuncts & Diacritic Integrity

1. **Unicode NFC Canonical Normalization:** All text storage layers (PostgreSQL `VARCHAR`/`TEXT`, JSON documents, Redis caches) must enforce Unicode NFC normalization before commit to prevent broken dual-byte matra sequences.
2. **Ligature Preservation:** Font files and rendering CSS must enforce OpenType ligature features:
   ```css
   font-feature-settings: "kern" 1, "liga" 1;
   text-rendering: optimizeLegibility;
   ```
3. **No Character Masking / Truncation:** UI truncation must never cut inside a multi-byte Bengali cluster or between a consonant and its following matra.

---

## 6. Cross-Platform Font Embedding Specifications

### 6.1 Web Applications & Management Consoles
- **CDN Preconnect:** Include preconnects to Google Fonts in the document `<head>`.
- **Display Swap:** Enforce `font-display: swap;` across all font loading to prevent Flash of Invisible Text (FOIT).
- **Self-Hosted Fallback:** Production containers bundle local `.woff2` files for offline-first support.

### 6.2 Native Android Client
- **Local TTF Font Assets:** All approved fonts must be bundled into `apk/app/src/main/res/font/`:
  - `hind_siliguri_bold.ttf`
  - `hind_siliguri_semibold.ttf`
  - `baloo_da_2_regular.ttf`
  - `noto_sans_bengali_regular.ttf`
- **Zero OS Font Reliance:** The application must never rely on device system fonts, which vary across manufacturer Android forks.

### 6.3 Digital Documents, Certificates & PDF Print Substrates
- **TrueType Embedding:** The PDF generation engine (`@react-pdf/renderer` or headless browser print) must embed full TrueType subsets of Hind Siliguri and Noto Sans Bengali.
- **Zero Glyphs Dropped:** Validated by print tests in `test/controlled_print.test.ts`.

---

## 7. Creative Attribution Bilingual Standard

Where the platform's origin attribution is rendered, approved bilingual versions must be displayed:
- **English:** `"Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc."`
- **Bengali:** `"ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি"`
- **Governance Classification:** Creative attribution; distinctly separated from institutional legal entity naming (*SohaelTasneem Foundation*).

---

## 8. Automated Master Control Audit Protocol

The `STFL_AIO_MASTER_CONTROL.html` book and `validate_json.js` validator enforce automated bilingual audits:
- **Missing Translation Check:** Every feature record in `stfl-master-control-data` must possess valid `en` and `bn` translations.
- **Font Compliance Audit:** Validates presence of Hind Siliguri, Baloo Da 2, Noto Sans Bengali, Inter, and JetBrains Mono.
- **Embedding Verification:** Validates web font links, Android resource declarations, and print embedding configurations.

---

*Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.*  
*ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি*
