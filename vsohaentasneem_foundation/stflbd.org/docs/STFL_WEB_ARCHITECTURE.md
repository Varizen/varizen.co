# STFL Web Architecture Specification
**Institution:** SohaelTasneem Foundation  
**Canonical Domain:** `https://stflbd.app`  
**Canonical Web Source:** `C:\Users\ShoebTahseen\Desktop\stfl\main\web`  
**Version:** 2026.10.15  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Absolute Source-of-Truth Architectural Rule

The SohaelTasneem Foundation digital ecosystem maintains exactly **one** canonical Web application root:
```
C:\Users\ShoebTahseen\Desktop\stfl\main\web
```

### Hierarchy & Repository Topography
```
stfl/
├── main/
│   └── web/                   <-- CANONICAL PRODUCTION WEB APPLICATION (Next.js 15)
│       ├── src/
│       │   ├── app/           <-- App Router (59 routes, bilingual)
│       │   ├── context/       <-- LanguageContext (EN/BN State Machine)
│       │   ├── lib/           <-- API Client (https://stflbd.app/api/v1)
│       │   └── components/    <-- ClientProviders & Root Primitives
│       ├── components/        <-- Navigation, Footer, STFL Design Primitives
│       ├── public/            <-- Approved logos, brand marks, robots.txt, sitemap.xml
│       └── scripts/           <-- verify-icon-policy.mjs, automated QA gates
│
├── apk/                       <-- Android Application & Preview Resources
│   ├── app/                   <-- Android Native Application
│   ├── core/                  <-- Core Shared Definitions
│   ├── preview/               <-- Design previews & screenshots (Reference only)
│   └── web/                   <-- CLASSIFIED: LEGACY / DUPLICATE / INVALID (Non-production)
│
├── backend/                   <-- Cloudflare Worker API & Core Logic
├── migrations/                <-- Database Schemas & Ledger Migrations
└── START-STFL-AIO-DEMO.bat     <-- Unified Project Demo Launcher (Legacy Platform Launcher)
    STOP-STFL-AIO-DEMO.bat      <-- Unified Project Demo Stopper (Legacy Platform Stopper)
```

### Invalid / Legacy Candidate Classification
The directory `apk\web` has been formally inspected and classified as **LEGACY / DUPLICATE / INVALID**.
- **Finding:** It was an unreferenced artifact from earlier workspace renames.
- **Rule:** Under no circumstance is `apk\web` to be used as a competing web source or deployed to production.
- **Enforcement:** All build scripts, local batch runners, and deployment manifests target `main\web` exclusively.

---

## 2. Technology Stack & Framework

| Layer | Technology | Specification / Standard |
|---|---|---|
| **Core Framework** | Next.js 15.3.3 | App Router architecture, Server Components by default, Client Components where interactivity requires. |
| **Language Runtime** | TypeScript 5.8 | Strict mode, zero `any` types, zero compilation warnings. |
| **UI Library** | React 19.0.0 | Concurrent React, hydration-safe bilingual state rendering. |
| **Styling Engine** | Tailwind CSS v4.0.0 | CSS variables with `@theme inline` mapping in `globals.css` and `stfl-tokens.css`. |
| **Typography** | Google Fonts | `Hind Siliguri` (Bengali Headings/Footers), `Noto Sans Bengali` (Bengali Body), `Inter` (English Body/Headings), `JetBrains Mono` (Code/Monospace). |
| **Iconography** | `iconoir-react` (v7.10.1) | **Strict Exclusive Rule:** 100% of interface UI icons are Iconoir. Prohibited: Lucide, Heroicons, FontAwesome, React-icons. |
| **API Abstraction** | Custom Fetch Layer | `src/lib/api.ts` connecting to `https://stflbd.app/api/v1` with typed state classifications. |

---

## 3. Institutional Positioning & Narrative Engine

SohaelTasneem Foundation is structured not as a passive charity brochure, but as:
> **"A foundation with a digital backbone."**

### Master Narrative Architecture (5 Layers)
1. **HUMAN:** Grounded in inherent human dignity, rural realities, and community agency.
2. **PURPOSE:** "We build the conditions for people and communities to move forward."
3. **ACTION:** Practical interventions in Education, Health, Community Development, and Emergency Relief.
4. **EVIDENCE:** "We don't measure success by activity alone. We measure what changes."
5. **SCALE:** Roadmap from 2026 consolidation to 2032 Scale and 2035 Multiply.

### Core Institutional Philosophy
- **Name Rule:** Official institutional name is strictly **"SohaelTasneem Foundation"** (Bengali: **"সোহেল তাসনীম ফাউন্ডেশন"**). Never abbreviate in formal copy, and do not use foreign brand variants.
- **Truthfulness Pledge:** Zero fabricated statistics, donor counts, or beneficiary figures. Empty states and governed disclosure models are preferred over hypothetical numbers.

---

## 4. Backend & Separation of Concerns

The Web layer consumes backend services via approved RESTful API contracts:
- **Canonical API Base:** `https://stflbd.app/api/v1`
- **Security Boundaries:**
  - Web does **not** modify or reimplement PostgreSQL schemas, Cloudflare Worker business logic, IAM policies, or cryptographic signing keys.
  - Web consumes authorization results and renders contextually (`visible`, `disabled`, `hidden`, `requires_approval`, `compliance_hold`).
  - Web contains **zero** production secrets, server tokens, or private database credentials.

---

## 5. Local Demo & Port Governance

- **Demo URL:** `http://127.0.0.1:4173/`
- **Control Scripts:**
  - `START-STFL-AIO-DEMO.bat`: (Legacy Platform Launcher) Cleanly kills lingering processes on port 4173, starts Next.js in production preview mode, and verifies HTTP 200 response.
  - `STOP-STFL-AIO-DEMO.bat`: (Legacy Platform Stopper) Terminates Node.js instances listening on port 4173 cleanly.
