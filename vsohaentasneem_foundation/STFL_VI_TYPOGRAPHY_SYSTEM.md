# STFL VI TYPOGRAPHY SYSTEM SPECIFICATION
**Version:** 2.0.0 (October 2026)  
**Governing Authority:** SohaelTasneem Foundation (STFL)  
**Platform Scope:** STFL VI Institutional Operating Platform  

---

## 1. Executive Principles & Architecture

Typography in STFL VI is a core institutional asset governing human dignity, readability, legibility, and precision across bilingual (Bengali & English) operational touchpoints.

### Core Rules
1. **Hind Siliguri System Preserved:** Hind Siliguri remains the immutable, mandatory typographic standard for all Bengali headers, section headers, subheaders, and major banners. The existing header system is untouched.
2. **Baloo Da 2 & Noto Sans Bengali Integrated:** Added as approved brand families for body text, administrative UI, form fields, statistical data tables, and formal digital documents.
3. **No Uncontrolled Mixing:** Visual hierarchies strictly separate heading display from body reading flow.
4. **Offline Resilience & Asset Bundling:** Critical fonts are self-hosted in `public/fonts/` (and Android `core/res/font/`) ensuring 100% functionality in air-gapped, offline, and remote low-bandwidth field settings.

---

## 2. Master Typography Matrix

| Context | Primary Font Family | Secondary Fallbacks | Approved Weights | Line Height | Tracking / Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **BN Heading (H1–H3)** | **Hind Siliguri** | SolaimanLipi, Noto Sans Bengali, sans-serif | 600 (SemiBold), 700 (Bold) | 1.25 – 1.4 | -0.01em |
| **BN Subheading (H4–H6)**| **Hind Siliguri** | SolaimanLipi, Noto Sans Bengali, sans-serif | 500 (Medium), 600 (SemiBold) | 1.4 – 1.5 | normal |
| **BN Body (Long-form)** | **Noto Sans Bengali** | Baloo Da 2, SolaimanLipi, sans-serif | 400 (Regular), 500 (Medium) | 1.7 – 1.8 | +0.01em |
| **BN UI Elements** | **Noto Sans Bengali** / **Baloo Da 2** | SolaimanLipi, system-ui, sans-serif | 500 (Medium), 600 (SemiBold) | 1.5 | normal |
| **BN Form Inputs** | **Noto Sans Bengali** | SolaimanLipi, sans-serif | 400 (Regular), 500 (Medium) | 1.5 | normal |
| **BN Data Tables** | **Noto Sans Bengali** | Baloo Da 2, sans-serif | 400 (Regular), 600 (SemiBold) | 1.4 | tabular-nums |
| **BN Official Documents**| **Noto Sans Bengali** (Legal/Cert) / **Hind Siliguri** (Title) | SolaimanLipi, Vrinda, Kalpurush | 400, 600, 700 | 1.6 – 1.75 | normal |
| **EN Heading** | **Inter** | system-ui, -apple-system, sans-serif | 600 (SemiBold), 700 (Bold), 800 | 1.15 – 1.3 | -0.02em |
| **EN Body & UI** | **Inter** | -apple-system, BlinkMacSystemFont, sans-serif | 400 (Regular), 500 (Medium) | 1.5 – 1.65 | normal |
| **Monospace / Code** | **JetBrains Mono** | Consolas, Menlo, monospace | 400 (Regular), 500 (Medium), 700 | 1.5 | normal |

---

## 3. Font Asset Inventory & Bundling Status

| Font Family | Source | Storage Location | Formats | Bundled vs Remote |
| :--- | :--- | :--- | :--- | :--- |
| **Hind Siliguri** | Local Asset + Next.js Font | `public/fonts/HindSiliguri-*.ttf`, `assets/branding/fonts/` | TTF, WOFF2 (via build self-host) | **100% Bundled Local** |
| **Noto Sans Bengali** | Next.js Font + Google Fonts | Next.js build cache (`.next/static/media/`) + Google CDN | WOFF2 | **Build Self-Hosted** |
| **Baloo Da 2** | Google Fonts + CSS import | `public/fonts/` + Google Fonts CSS2 | WOFF2 | **Hybrid (Local + CDN Cache)** |
| **Inter** | Next.js Font (`next/font/google`) | Next.js build cache (`.next/static/media/`) | WOFF2 | **Build Self-Hosted** |
| **JetBrains Mono** | System / Web Fonts | CSS imports / monospace fallback | WOFF2 | **Build Self-Hosted** |

---

## 4. Bengali Rendering & Linguistic Integrity Rules

1. **Conjunct (যুক্তবর্ণ) Preservation:**  
   Font rendering engine must enable OpenType ligatures (`liga`, `clig`). Never disable OpenType features in CSS. Tested with complex conjuncts:
   - `স্থ` (যেমন: সোহেলতাসনীম)
   - `ন্ট` (যেমন: অ্যাকাউন্ট)
   - `ন্ধ` (যেমন: গবেষণা)
   - `ক্ষ` (যেমন: প্রাতিষ্ঠানিক)
   - `জ্ঞ` (যেমন: বিজ্ঞান)
   - `ত্র` (যেমন: চরিত্র)
2. **Diacritic & Matra Placement:**  
   - Hasant (্), Ref (র্), and Japhala (্য) must maintain precise vertical spacing without overlapping baseline ascenders.
   - Line height for Bengali body text is set to **1.7–1.8** (compared to 1.5 for Latin script) to prevent matra collisions across adjacent lines.
3. **Responsive Scaling Matrix:**
   - Desktop (1280px+): Headings 32px–48px, Body 16px, UI 14px, Captions 12px.
   - Tablet (768px–1024px): Headings 28px–38px, Body 15px, UI 13px, Captions 11px.
   - Mobile (< 768px): Headings 24px–32px, Body 15px, UI 14px (minimum touch-readable size).

---

## 5. CSS Implementation & Token Map

```css
/* Hind Siliguri Local Font-Face Definition */
@font-face {
  font-family: 'Hind Siliguri Local';
  src: url('/fonts/HindSiliguri-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Hind Siliguri Local';
  src: url('/fonts/HindSiliguri-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Hind Siliguri Local';
  src: url('/fonts/HindSiliguri-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Typography Token Variables */
:root {
  --font-bn-header: var(--font-hind-siliguri), 'Hind Siliguri Local', 'Hind Siliguri', 'SolaimanLipi', sans-serif;
  --font-bn-body: var(--font-noto-sans-bengali), 'Noto Sans Bengali', 'Baloo Da 2', 'SolaimanLipi', sans-serif;
  --font-bn-ui: var(--font-noto-sans-bengali), 'Baloo Da 2', 'Noto Sans Bengali', sans-serif;
  --font-en-header: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
  --font-en-body: var(--font-inter), 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
}
```

---

## 6. Real Text Rendering Samples

### Bengali Header (Hind Siliguri)
> **সোহেলতাসনীম ফাউন্ডেশন &bull; এসটিএফএল ভি প্রাতিষ্ঠানিক প্ল্যাটফর্ম**  
> *"মানবিক মর্যাদা ও প্রাতিষ্ঠানিক জবাবদিহিতা নিশ্চিতকরণে সমন্বিত ডিজিটাল ব্যবস্থাপনা"*

### Bengali Body & UI (Noto Sans Bengali / Baloo Da 2)
> এসটিএফএল ভি প্ল্যাটফর্মের মাধ্যমে স্বচ্ছ ও পরিমাপযোগ্য সামাজিক উদ্যোগ, গ্রিহস্তআইওএস ভূমি ব্যবস্থাপনা, এবং নলেজ আর্কাইভিং পরিচালিত হয়। প্রতিটি আর্থিক লেনদেন ও আইনি নথি ক্রিপ্টোগ্রাফিক যাচাইকরণ দ্বারা সংরক্ষিত।

### English Header & Body (Inter)
> **SohaelTasneem Foundation (STFL VI)**  
> *Human Dignity. Practical Action. Measurable Impact. Unified Institutional Operating Platform.*
