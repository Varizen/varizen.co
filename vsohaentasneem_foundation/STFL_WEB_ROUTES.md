# STFL Web Route Inventory & Domain Ownership Matrix

**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Binding Architecture:** [STFL_DOMAIN_SEPARATION_ARCHITECTURE.md](./STFL_DOMAIN_SEPARATION_ARCHITECTURE.md)  
**Domains:**
- `stflbd.org` — Foundation Public Website & Enterprise Workspace (`/admin/*`)
- `stflbd.app` — Mobile App Landing, Downloads, Demos, App Legal, QR Verification & API Backend (`/api/v1`)
**Status:** CONSTITUTIONAL & BINDING (Next.js 15 App Router)  

---

## 1. Domain Separation Overview

Per `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md`:
- **`stflbd.org` is the organisation.** It serves the public foundation web pages and the desktop-first Enterprise Workspace (`/admin/*`).
- **`stflbd.app` is the mobile app only.** It serves the mobile app landing page, download page, sandboxed demo workspace, app-specific legal disclosures (Play Store contract), permanent QR verification routes, and the `/api/v1` backend.

---

## 2. Route Ownership Matrix (§3.2)

Legend: **Org** = served on `stflbd.org` · **App** = served on `stflbd.app` · `301→` = permanent redirect to canonical host.

| Route | `stflbd.org` | `stflbd.app` | Purpose & Invariants |
|---|---|---|---|
| `/` | **Org** Foundation landing | **App** App landing (`AppLandingPage`) | Single link between them; never nested |
| `/foundation` | 301→ `stflbd.org/` | 301→ `stflbd.org/` | Legacy path cleanup |
| `/about`, `/mission`, `/team`, `/people` (public), `/programs/*`, `/initiatives/*`, `/projects`, `/impact`, `/news`, `/events`, `/gallery`, `/publications`, `/reports`, `/donate`, `/volunteer`, `/partner`, `/careers`, `/contact`, `/faq`, `/brand`, `/brandcenter` | **Org** | 301→ `.org` | Foundation public content |
| `/cookies` | **Org** | **App** (app-scoped) | Each domain maintains its own cookie policy |
| `/privacy`, `/terms`, `/safeguarding` | **Org** (foundation policies) | **App** (app policies, Play Store) | Both kept; `.app` version referenced in Play listing |
| `/account-deletion` | 301→ `.app` | **App** | Play Store requirement for Android app users |
| `/login`, `/signup` | **Org** (workspace sign-in) | 301→ `.org` | Staff & officer identity front door |
| `/admin`, `/admin/*` (18 consoles) | **Org** Enterprise Workspace | 301→ `.org` | Desktop-first, `noindex`, `X-Frame-Options: DENY` |
| `/demo` & demo sub-routes (`/demo/finance`, `/demo/operations`, `/demo/governance`, `/demo/outcomes`, `/demo/compliance`, `/demo/documents`, `/demo/people`, `/demo/projects`) | 301→ `.app/demo/*` | **App** under `/demo/*` | Sandboxed demo environment |
| `/download`, `/roadmap`, `/ecosystem` | 301→ `.app` | **App** | Product pages for mobile application; ecosystem directory (onboarded + pipeline projects) |
| `/v/{code}`, `/verify`, `/verify/{id}` | 301→ `.app` | **App — PERMANENT** | Physical document QR contract; never moved |
| `/api/*` | **never** (no route) | **App** `stfl-api` | Single API origin (`https://stflbd.app/api/v1`) |
| `/media/*` | — | **App** | Cloudflare R2 public assets |
| `/.well-known/assetlinks.json` | — | **App** (200 JSON) | Android App Links verification |
| `/sitemap.xml`, `/robots.txt` | **Org** (foundation URLs only) | **App** (app URLs only) | Domain-scoped search directives |

---

## 3. Governed Administrative Consoles on `stflbd.org/admin/*`

All 18 administrative consoles are served exclusively on `stflbd.org/admin/*`:

| Route | Mode | Console Name | Governed Capability |
|---|---|---|---|
| `/admin` | Static | STFL VI Workspace | Project-first dashboard answering "What changed? What requires action?" |
| `/admin/property` | Static | **GrihostiOS** | Property, lease, rent, land classification, agriculture, crop share. |
| `/admin/iam` | Static | IAM & Identity | Roles CLASS_00 to CLASS_12, credentials, scoped permissions. |
| `/admin/governance` | Static | Trustee Governance | Resolutions, committee records, policy ratifications. |
| `/admin/executive` | Static | Executive Management | Programmatic strategy, cross-project portfolio consolidation. |
| `/admin/finance` | Static | Finance & Ledger | Chart of accounts, vouchers, disbursements, reconciliations. |
| `/admin/microfinance` | Static | Microfinance & Grants | Revolving community funds, grant disbursements, repayment tracking. |
| `/admin/workforce` | Static | Workforce & HR | Officer assignments, field payroll, attendance records. |
| `/admin/eshop` | Static | E-Shop & Logistics | Fair-trade artisanal products, relief supply chain inventory. |
| `/admin/projects` | Static | Project Management | Multi-project setup, stakeholder provisioning, milestone tracking. |
| `/admin/assets` | Static | Asset Inventory | Fixed assets, vehicles, solar installations, medical devices. |
| `/admin/documents` | Static | Document Lifecycle | Draft, Review, Approve, Issue, Revoke, Hash auditing. |
| `/admin/communications`| Static | Communications Gateway | SMS broadcasts, emergency notifications, formal letters. |
| `/admin/security` | Static | Security & Audit | Threat detection, audit log streaming, session controls. |
| `/admin/agents` | Static | Autonomous Agents | Level 1–3 autonomous agents, kill switches, audit logs. |
| `/admin/devices` | Static | Device Fleet | Registered Android devices, hardware attestations. |
| `/admin/system` | Static | System Diagnostics | Cloudflare worker status, database connectivity, cache metrics. |
| `/admin/compliance` | Static | Compliance Engine | Rule definitions, statutory audits, compliance escalations. |
| `/admin/knowledge` | Static | Knowledge & Training | Training modules, operational SOPs, field manuals. |

---

## 4. App Product Routes on stflbd.app

| Route | Mode | Purpose |
|---|---|---|
| / | Static | App landing page (AppLandingPage) |
| /ecosystem | Static | Ecosystem Directory — all publication-approved projects (onboarded + pipeline), generated from src/lib/initiativesRegistry.ts; details link to stflbd.org/initiatives/{slug} |
| /download | Static | Android APK download & Play Store pre-flight |
| /roadmap | Static | Platform capability roadmap |
| /demo/* | Static | Sandboxed demo workspace (8 segments) |
| /verify, /verify/{id}, /v/{code} | Dynamic | Public QR document verification (permanent) |
| /privacy, /terms, /safeguarding, /account-deletion, /cookies | Static | App-scoped legal pages (Play Store contract) |
