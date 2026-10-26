# STFL Web Search Engine Optimization (SEO) & Metadata Model
**Institution:** SohaelTasneem Foundation  
**Canonical Domain:** `https://stflbd.app`  
**Version:** 2026.10.15  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Canonical Domain & Indexing Policy

All public traffic resolves to the single authoritative canonical domain:
```
https://stflbd.app
```

### Prohibited Production Variants:
- ❌ `stflbd.org` (reserved for institutional email/DNS routing, redirects to `.app`).
- ❌ `sohaeltasneem.foundation` (alias).
- ❌ `api.stflbd.app` (API-only endpoint; never indexed as web pages).

---

## 2. Public vs. Private Route Indexation Matrix

### Indexed Public Routes (`Allow: /`):
- `/` (Home)
- `/about`, `/mission`, `/team`, `/reports`
- `/programs`, `/programs/*` (All 4 domains)
- `/impact`, `/projects`, `/events`, `/news`, `/gallery`, `/publications`
- `/donate`, `/volunteer`, `/partner`, `/careers`
- `/brand`, `/contact`, `/faq`
- `/privacy`, `/terms`, `/safeguarding`, `/cookies`
- `/verify` (Public verification entry)

### Strictly Disallowed from Search Engines (`Disallow: /`):
```txt
# robots.txt
User-agent: *
Disallow: /admin/
Disallow: /demo/
Disallow: /operations/
Disallow: /finance/
Disallow: /compliance/
Disallow: /documents/
Disallow: /people/
Disallow: /governance/
Disallow: /api/
Disallow: /_next/
Allow: /

Sitemap: https://stflbd.app/sitemap.xml
```

---

## 3. Metadata Standards & OpenGraph Architecture

Every public route exports typed `Metadata` complying with Next.js 15 standards:

```typescript
export const metadata: Metadata = {
  title: "Education & Learning Initiatives — SohaelTasneem Foundation",
  description: "Empowering next generations through quality schooling, digital literacy, and technical scholarships.",
  alternates: {
    canonical: "https://stflbd.app/programs/education",
  },
  openGraph: {
    title: "Education & Learning Initiatives — SohaelTasneem Foundation",
    description: "Empowering next generations through quality schooling, digital literacy, and technical scholarships.",
    url: "https://stflbd.app/programs/education",
    siteName: "SohaelTasneem Foundation",
    locale: "en_US",
    alternateLocale: "bn_BD",
    type: "website",
    images: [
      {
        url: "https://stflbd.app/stfl-mark-transparent.png",
        width: 1200,
        height: 630,
        alt: "SohaelTasneem Foundation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Education & Learning Initiatives — SohaelTasneem Foundation",
    description: "Empowering next generations through quality schooling, digital literacy, and technical scholarships.",
  },
};
```

---

## 4. Structured Data (JSON-LD)

The root layout embeds schema.org institutional metadata:
```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "SohaelTasneem Foundation",
  "alternateName": "সোহেল তাসনীম ফাউন্ডেশন",
  "url": "https://stflbd.app",
  "logo": "https://stflbd.app/stfl-mark-transparent.png",
  "telephone": "+88018410506411",
  "email": "hi@stflbd.email",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "STFL House, 173 E Ullan Road, W Rampura",
    "addressLocality": "Dhaka",
    "postalCode": "1217",
    "addressCountry": "BD"
  },
  "sameAs": [
    "https://www.stflbd.org"
  ]
}
```
