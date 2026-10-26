# STFL Web Bilingual Governance & Localization Protocol
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Supported Locales:** `en` (English), `bn` (বাংলা)  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Constitutional Bilingual Principle

English and বাংলা are equal, first-class languages across the SohaelTasneem Foundation digital platform:
1. **Zero Secondary Status:** Bengali is never treated as a decorative translation or an afterthought.
2. **Explicit Hand-Crafted Copy:** Machine translation at runtime (e.g., Google Translate widgets or dynamic auto-translate) is **strictly prohibited**. All translations are verified, culturally attuned institutional Bengali.
3. **Typography Parity:** Font sizing, line heights, and padding are engineered specifically to accommodate Bengali vowel diacritics (কার ও ফলা) and conjunct characters (যুক্তাক্ষর).

---

## 2. Technical Architecture & State Machine

Bilingual reactivity is governed by `src/context/LanguageContext.tsx`, exposed to the entire Next.js client component tree via `src/components/ClientProviders.tsx`:

```typescript
export interface LanguageContextType {
  lang: "en" | "bn";
  setLang: (lang: "en" | "bn") => void;
  toggleLang: () => void;
  t: (key: string) => string;
}
```

### Persistence Protocol
- **Storage Key:** `stfl_language_preference` in `window.localStorage`.
- **Default Resolution:**
  1. If `stfl_language_preference` exists, respect user selection.
  2. If unset, inspect `navigator.language` (if starts with `bn`, default to `bn`; otherwise `en`).
  3. Hydration-safe: Initializes cleanly on client mount with zero server-client mismatch.

---

## 3. Bilingual Dictionary & Content Model

### Core Navigation & Institutional Keys:
```typescript
const translations = {
  // Navigation
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.about": { en: "About", bn: "পরিচিতি" },
  "nav.mission": { en: "Mission & Vision", bn: "মিশন ও ভিশন" },
  "nav.team": { en: "Leadership & Team", bn: "নেতৃত্ব ও পরিষদ" },
  "nav.reports": { en: "Annual Reports", bn: "বার্ষিক প্রতিবেদন ও অডিট" },
  "nav.programs": { en: "Programs", bn: "কার্যক্রম" },
  "nav.impact": { en: "Impact & Evidence", bn: "প্রভাব ও পরিমাপ" },
  "nav.projects": { en: "Projects", bn: "প্রকল্পসমূহ" },
  "nav.news": { en: "News & Media", bn: "সংবাদ ও ডিসপ্যাচ" },
  "nav.getInvolved": { en: "Get Involved", bn: "অংশগ্রহণ" },
  "nav.donate": { en: "Donate", bn: "অনুদান" },
  "nav.volunteer": { en: "Volunteer", bn: "স্বেচ্ছাসেবী" },
  "nav.partner": { en: "Partner", bn: "অংশীদারিত্ব" },
  "nav.careers": { en: "Careers", bn: "কর্মসংস্থান" },
  "nav.brand": { en: "Brand Guidelines", bn: "ব্র্যান্ড নির্দেশিকা" },
  "nav.verify": { en: "Verify", bn: "যাচাই" },
  "nav.contact": { en: "Contact", bn: "যোগাযোগ" },
  "nav.faq": { en: "FAQ", bn: "সাধারণ জিজ্ঞাসা" },

  // Institutional Hero
  "hero.headline": {
    en: "HUMAN DIGNITY. PRACTICAL ACTION. MEASURABLE IMPACT.",
    bn: "মানবিক মর্যাদা। বাস্তবমুখী পদক্ষেপ। পরিমাপযোগ্য প্রভাব।"
  },
  "hero.subheadline": {
    en: "We build opportunity. We connect people. We make impact measurable.",
    bn: "আমরা সুযোগ সৃষ্টি করি। মানুষকে সংযুক্ত করি। প্রভাবকে পরিমাপযোগ্য করি।"
  },
  "hero.cta.primary": { en: "Explore Our Work", bn: "আমাদের কার্যক্রম দেখুন" },
  "hero.cta.secondary": { en: "Let's build something that matters.", bn: "অর্থপূর্ণ কিছু গড়ে তুলি।" },
};
```

---

## 4. Dual-Language Editorial Rendering Pattern

For rich editorial sections (landing page, program pages, impact statements), the UI implements a dual-script typography lockup:

```tsx
<h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
  <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
    শিক্ষা ও প্রশিক্ষণ কর্মসূচি
  </span>
  <span>Education & Learning Initiatives</span>
</h1>
```

### Benefits:
1. **Immediate Context:** Visitors see both official national language and international diplomatic language simultaneously.
2. **Search Engine Indexing:** Crawlers index both Bengali and English keywords natively on the same canonical URL.
3. **Accessibility:** Screen readers parse appropriate language attributes seamlessly.
