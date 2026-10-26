# STFL VI Master Migration Changelog
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Migration Scope:** Platform Identity Evolution, Brand Layer, Typography System, Route Inventory, Security Hardening, and Governance Reconciliation  
**Date:** 2026-10-16  
**Status:** COMPLETE & VERIFIED  

---

## 1. Executive Summary & Identity Evolution

| Metric / Dimension | Previous State (Legacy Architecture) | Target / Current Canonical State |
|---|---|---|
| **Platform Name** | `STFL AIO` (Legacy Platform Name) | **`STFL VI`** |
| **Institutional Tagline** | Autonomous Enterprise Platform | **Unified Institutional Operating Platform** |
| **Core Identity** | Broad automated dashboard | Institutional operating platform for people, projects, resources, governance, operations, knowledge, finance, property, documents, compliance, field activity, and responsible intelligence |
| **Specialist Systems** | GrihostiOS, HakimSarker.org, QiM-AI 2.1 | **Strictly Preserved** as first-class domain capabilities under STFL VI governance |
| **Corporate Exceptions** | Varizen Inc. | **Strictly Preserved** as an independent entity; zero rebranding or structural alterations |

---

## 2. Brand & Visual Design System Changes

### 2.1 Bright-White / Neon Signal Visual Layer
- Introduced controlled luminous accents and system signal tokens in `main/web/src/app/globals.css` and `main/web/src/app/stfl-tokens.css`:
  - `--stfl-vi-white: #FFFFFF` (High contrast pure typography & sharp surfaces)
  - `--stfl-vi-bright: #F8FAFC` (Luminous bright container surface)
  - `--stfl-vi-neon: #00D4FF` (Precision cyan signal highlight for system state & verification badges)
  - `--stfl-vi-neon-glow: rgba(0, 212, 255, 0.18)` (Restrained ambient signal glow)
  - `--stfl-vi-dark: #081F2D` (Canonical STFL primary deep institutional background)
  - `--stfl-vi-surface: #0E2A3A` (Sub-surface cards & elevated modals)
  - `--stfl-vi-border: #1B3B4E` (Governed structural borders)
  - `--stfl-vi-muted: #94A3B8` (Institutional secondary body & metadata)
  - `--stfl-vi-accent: #1B7A82` (Canonical STFL institutional teal accent)

### 2.2 Iconography Policy Strict Enforcement
- Validated 100% adherence to **Iconoir-only** icon policy via `scripts/verify-icon-policy.mjs`.
- Verified zero instances of Lucide, Heroicons, FontAwesome, Tabler, Phosphor, or React-icons in `main/web`.

---

## 3. Typography Architecture & Local Asset Deployment

### 3.1 Bengali Typography System
- **Headers & Subheaders:** Strictly preserved **Hind Siliguri** across all headings (`h1`–`h6`), section titles, drawer titles, and footer brand lockups.
- **Local Assets Bundled:** Downloaded and deployed true TTF font assets to `main/web/public/fonts/`:
  - `HindSiliguri-Regular.ttf` (Weight 400)
  - `HindSiliguri-Medium.ttf` (Weight 500)
  - `HindSiliguri-SemiBold.ttf` (Weight 600)
  - `HindSiliguri-Bold.ttf` (Weight 700)
- **Local `@font-face` Fallback:** Configured `@font-face` rules in `globals.css` with `font-display: swap` for offline-first and low-latency rendering.
- **Body, UI, Forms & Tables:** Formalized **Noto Sans Bengali** and **Baloo Da 2** for long-form reading, data tables, and interactive UI controls.

### 3.2 English & Monospace System
- English Body/Headings: `Inter` / System Sans-Serif fallback.
- Technical & Hashes: `JetBrains Mono` / Monospace fallback for SHA-256 strings, copy IDs, and vouchers.

---

## 4. Route Inventory & Navigation Modifications

### 4.1 New Canonical Routes
- **`/roadmap` (Next.js App Router):** Created `src/app/roadmap/page.tsx` featuring the complete STFL VI Capabilities Matrix (Foundational, Governance, Finance, GrihostiOS, Security, Audit), Short-Term Hardening, Medium-Term Horizon, and Long-Term Multi-Tenant Ecosystem.
- **`/roadmap.html` (Static Fallback):** Created `public/roadmap.html` with pure semantic HTML, responsive styling, and complete capability tables.

### 4.2 Navigation & UI Component Revisions
- **`src/components/Navigation.tsx`:**
  - Updated Command Hub badge from `STFL AIO` to `STFL VI`.
  - Added direct link to `/roadmap` in the primary top bar and slide-over navigation drawer.
- **`src/components/Footer.tsx`:**
  - Updated administrative link from `STFL AIO Console` to `STFL VI Console`.
  - Added public `/roadmap` route to footer links.
- **`src/app/admin/layout.tsx`:**
  - Header badge updated to `STFL VI`.
  - Footer backbone updated to `STFL VI Operational Backbone`.
- **`src/app/demo/DemoWorkspace.tsx`:**
  - Header branding updated to `STFL VI Workspace`.
  - Dashboard banner updated to `STFL VI Institutional Demo`.
  - Footer notice updated to `STFL VI Governed Architecture`.
- **`src/app/admin/property/page.tsx`:**
  - Breadcrumb lockup updated to `STFL VI / GrihostiOS`.
- **`src/app/initiatives/grihostios/page.tsx`:**
  - Action link updated to `VI Console`.
  - Verification badge updated to `STFL VI VERIFIED`.
- **`src/lib/initiativesRegistry.ts`:**
  - Engine label updated to `STFL VI Tenancy Engine`.

---

## 5. Backend, API & Document Engine Changes

### 5.1 Document Generation & Legal Framework
- **`main/api/src/grihosti/engine.ts`:**
  - Updated electronic signature clause to: `"Signed electronically under the STFL VI Digital Document Governance Framework."`
- **`main/api/src/routes/grihosti.ts`:**
  - Updated public verification authority to: `governingAuthority: 'SohaelTasneem Foundation (STFL VI)'`.
- **`main/api/src/print/pdf.ts`:**
  - Updated PDF info dictionary Producer to: `Producer (STFL VI)`.

### 5.2 Compatibility & Database Invariant Preservation
- Preserved existing database migration names (`0001_init`, `0002_aio`) and internal API route contracts to guarantee 100% backward compatibility without breaking active PostgreSQL constraints or Cloudflare Worker bindings.

---

## 6. Automation & Launcher Scripts

- **`START-STFL-VI-DEMO.bat`:** Created canonical STFL VI local preview launcher.
- **`STOP-STFL-VI-DEMO.bat`:** Created canonical STFL VI process stopper.
- **`START-STFL-AIO-DEMO.bat`:** Relabeled as `STFL AIO [LEGACY PLATFORM NAME] - COMPATIBILITY LAUNCHER`.
- **`STOP-STFL-AIO-DEMO.bat`:** Relabeled as `STFL AIO [LEGACY PLATFORM NAME] - STOPPING LOCAL DEMO`.
- **`scripts/verify-live-routes.ps1`:** Added `/roadmap` and `/roadmap.html` to live health-check suite (72 total endpoints).

---

## 7. Documentation Reconciliation

The following documentation assets were created or updated to establish the canonical STFL VI standard:
1. `STFL_VI_MIGRATION_BASELINE.md`: Comprehensive pre-migration technical inventory.
2. `STFL_VI_SECURITY_AUDIT.md`: Evidence-based security audit with strict 3-tier classification.
3. `STFL_VI_DESIGN_SYSTEM_AUDIT.md`: Design system tokens, bright-white/neon rules, and iconography audit.
4. `STFL_VI_TYPOGRAPHY_SYSTEM.md`: Complete Bengali/English typography matrix with Hind Siliguri rules.
5. `STFL_VI_BRAND_GUIDELINES.md`: Formal STFL VI brand identity and logo usage policies.
6. `STFL_VI_OPEN_SOURCE_RESEARCH.md`: Exhaustive evaluation of open-source technologies across 12 domains.
7. `STFL_VI_ROADMAP.md`: Multi-horizon roadmap (Verified Now, Short-Term, Medium-Term, Long-Term).
8. `STFL_WEB_ROUTES.md`: Updated to 61 compiled routes including `/roadmap`.
9. `STFL_WEB_GRIHOSTIOS_MODEL.md`: Updated parent platform identity to STFL VI.
10. `STFL_WEB_COMPLIANCE_UX.md`: Updated AI agent governance bounds to STFL VI.
11. `STFL_WEB_ARCHITECTURE.md`: Documented canonical vs. legacy launchers and web root classification.

---

## 8. Verification & Test Gate Results

- **Iconoir Policy Check:** PASS (100% compliant).
- **TypeScript Strict Compilation:** PASS (0 errors).
- **Next.js Production Build:** PASS (`next build` compiled cleanly).
- **Live HTTP Health Check:** PASS (72/72 routes returning HTTP 200).
- **Secret Scan (610 files):** PASS (0 production credentials exposed).
- **Cross-Project Isolation:** PASS (Strict context filtering verified).
- **Public Verification Privacy:** PASS (Zero PII or internal balances exposed).

---

## 9. Known Limitations & Non-Blockers

1. **PostCSS Source Map Advisory (DEV ONLY):**
   - Advisory in dev dependency `postcss` <=8.5.22 regarding `sourceMappingURL` handling during build.
   - Status: Accepted risk. Web application produces static pre-compiled assets; zero user-supplied CSS is executed or processed dynamically.
2. **Specialist External Systems:**
   - Varizen Inc. and HakimSarker.org maintain independent infrastructure and are linked via secure CORS-isolated gateways.

---

## 10. Domain Separation Architecture Implementation (2026-10-18)

- **Binding Specification:** Implemented `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` (Version 1.0).
- **Domain Separation:**
  - `stflbd.org` = Organisation Website & Desktop-First Enterprise Workspace (`/admin/*`).
  - `stflbd.app` = Mobile App Landing, `/download`, `/demo/*`, app legal policies, `/v` + `/verify` (permanent QR contract), and `/api/v1` backend.
- **Domain Constants Architecture:**
  - `stflbd.org/src/lib/domains.ts` & `main/web/src/lib/domains.ts`: Single source of truth (`FOUNDATION_ORIGIN`, `APP_ORIGIN`, `API_BASE_URL`, `WORKSPACE_BASE`, `canonical()`).
  - `main/api/src/config/domains.ts`: Single source of truth for API Worker (`APP_ORIGIN`, `FOUNDATION_ORIGIN`, `verifyUrl()`, `qrUrl()`).
  - `main/core/.../Brand.kt`: Android brand domain constants (`FOUNDATION_URL`, `APP_URL`, `API_BASE_URL`).
  - `DataModule.kt`: Default base URL mapped directly to `Brand.API_BASE_URL`.
- **API & CORS Alignment:**
  - `main/api/wrangler.toml`: Configured `ALLOWED_ORIGINS = "https://stflbd.org,https://www.stflbd.org,https://stflbd.app,https://www.stflbd.app"` and `FOUNDATION_ORIGIN`.
  - `main/api/src/routes/app.ts`: Emitted `foundationUrl` alongside `website`.
- **Automated Guardrails & Verification:**
  - `scripts/verify-domain-separation.mjs`: Automated CI domain separation linter enforcing §6.1 invariants.
  - Wired as `npm run verify:domains` into `package.json` and build pipelines for both `stflbd.org` and `main/web`.
  - `scripts/verify-live-domains.ps1`: Automated live smoke test verifying status codes, single-hop redirects, and asset links.
  - `DOMAIN_RULE_FOR_ALL_AGENTS.md`: Mandatory policy guide published in both web workspaces.
  - Legacy mirrors (`web/`, `apk/`) neutralised with predeploy exit-1 guards and `wrangler.toml.disabled`.
- **Follow-up hardening (2026-10-18):**
  - `stflbd.org/public/roadmap.html` removed — it was an app-only artifact declaring `canonical = https://stflbd.app/roadmap` on the organisation domain.
  - `stflbd.org/public/STFL_VI_DOCUMENTATION_INDEX.html` canonical domain label corrected to `https://stflbd.org`.
  - `stflbd.org/public/sitemap.xml` no longer lists `/verify` (permanent QR contract lives on `stflbd.app`).
  - `scripts/verify-domain-separation.mjs` now also audits `stflbd.org/public`: fails on app-only static assets and on any `rel="canonical"` pointing at `stflbd.app`.
  - `main/docs/PLAY_STORE_LISTING.md` corrected: `stflbd.app` resolves; only `/api/v1` is still undeployed.
- **Go-live (2026-10-18):**
  - Removed the stale DS record at Spaceship that was causing a hard DNSSEC SERVFAIL for `stflbd.org`.
  - `stflbd.org` zone became active on Cloudflare; `stfl-foundation-web-production` deployed via **Custom Domains** (Cloudflare provisions DNS + certificate, so no manual `AAAA 100::` placeholder is needed).
  - `stfl-web` redeployed with the slimmed app-only build; all foundation/admin paths now 308 to `stflbd.org`.
  - Cross-domain links on `stflbd.org` (`/verify`, `/demo`, `/roadmap`) converted from relative `next/link` to absolute `VERIFY_ORIGIN` / `APP_ORIGIN` URLs, removing RSC prefetch CORS errors.
  - `scripts/verify-live-domains.ps1` now accepts relative `Location` headers (RFC 7231) for same-origin redirects.
  - Live smoke test: **79/79 checks pass**.
  - Outstanding: `stfl-api` cannot deploy until real Hyperdrive + KV namespace IDs replace the `REPLACE_WITH_*` placeholders.
