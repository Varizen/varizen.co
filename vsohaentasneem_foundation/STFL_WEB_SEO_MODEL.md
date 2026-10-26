# STFL Web Search Engine Optimization (SEO) & Domain Separation Model

**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Binding Architecture:** [STFL_DOMAIN_SEPARATION_ARCHITECTURE.md](./STFL_DOMAIN_SEPARATION_ARCHITECTURE.md)  
**Canonical Organization Domain:** `https://stflbd.org`  
**Canonical Mobile App Domain:** `https://stflbd.app`  
**Version:** 2026.10.18  
**Status:** CONSTITUTIONAL & BINDING  

---

## 1. Domain Separation & Canonical Indexing Policy

Per `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md`:
- **`stflbd.org` is the organisation.** It owns the public foundation site and Enterprise Workspace.
- **`stflbd.app` is the mobile app only.** It owns the mobile app landing page, download, sandboxed demos, and API backend.

Each domain maintains its own sitemap and search engine directives. There are **zero cross-domain URLs** in either sitemap.

### Canonical Hosts:
- Foundation & Enterprise Workspace: `https://stflbd.org` (apex canonical, `www.stflbd.org` 301s to apex)
- Mobile App & API: `https://stflbd.app` (apex canonical, `www.stflbd.app` 301s to apex)
- Legacy `sohaeltasneem.foundation`: Bulk 301 redirect to `https://stflbd.org`

---

## 2. Public vs. Private Route Indexation Matrix

### A. Foundation Domain (`stflbd.org`):
**Indexed Public Routes (`Allow: /`):**
- `/` (Foundation Home)
- `/about`, `/mission`, `/team`, `/reports`
- `/programs`, `/programs/*` (All strategic domains)
- `/initiatives`, `/initiatives/*`
- `/impact`, `/projects`, `/events`, `/news`, `/gallery`, `/publications`
- `/donate`, `/volunteer`, `/partner`, `/careers`
- `/brand`, `/brandcenter`, `/contact`, `/faq`
- `/privacy`, `/terms`, `/safeguarding`, `/cookies`

**Strictly Disallowed on `stflbd.org` (`robots.txt` + `X-Robots-Tag`):**
```txt
# stflbd.org/public/robots.txt
User-agent: *
Disallow: /admin
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /_next/
Allow: /

Sitemap: https://stflbd.org/sitemap.xml
```
*Note:* `/admin/*` additionally sends `X-Robots-Tag: noindex, nofollow, noarchive` and `X-Frame-Options: DENY`.

### B. App Domain (`stflbd.app`):
**Indexed Public Routes (`Allow: /`):**
- `/` (App Landing)
- `/download`, `/roadmap`
- `/privacy`, `/terms`, `/safeguarding`, `/account-deletion`, `/cookies` (App legal & Play Store contracts)
- `/verify` (Public document verification entry)

**Strictly Disallowed on `stflbd.app`:**
```txt
# main/web/public/robots.txt
User-agent: *
Disallow: /api/
Disallow: /demo/
Disallow: /_next/
Allow: /

Sitemap: https://stflbd.app/sitemap.xml
```

---

## 3. Metadata Standards & OpenGraph Architecture

Every public route exports typed `Metadata` using `canonical(path)` from `src/lib/domains.ts`:

```typescript
import { canonical, SITE_ORIGIN } from "@/src/lib/domains";

export const metadata: Metadata = {
  title: "Education & Learning Initiatives — SohaelTasneem Foundation",
  description: "Empowering next generations through quality schooling, digital literacy, and technical scholarships.",
  alternates: {
    canonical: canonical("/programs/education"),
  },
  openGraph: {
    title: "Education & Learning Initiatives — SohaelTasneem Foundation",
    description: "Empowering next generations through quality schooling, digital literacy, and technical scholarships.",
    url: canonical("/programs/education"),
    siteName: "SohaelTasneem Foundation",
    locale: "en_US",
    alternateLocale: "bn_BD",
    type: "website",
  },
};
```

---

## 4. Structured Data (JSON-LD)

The root layout of `stflbd.org` embeds schema.org institutional metadata:
```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "SohaelTasneem Foundation",
  "alternateName": "সোহেল তাসনীম ফাউন্ডেশন",
  "url": "https://stflbd.org",
  "logo": "https://stflbd.org/stfl-mark-transparent.png",
  "email": "hi@stflbd.email",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "STFL House, 173 East Ullon Road, West Rampura",
    "addressLocality": "Dhaka",
    "postalCode": "1219",
    "addressCountry": "BD"
  },
  "sameAs": [
    "https://stflbd.app"
  ]
}
```
