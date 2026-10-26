# STFL VI Documentation Drift & Architectural Reconciliation Report
**Platform Name:** STFL VI  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Date:** 2026-10-16  
**Auditor:** Principal Documentation Architect & Systems Librarian  
**Status:** RECONCILED & DOCUMENTED  

---

## 1. Executive Summary

Documentation drift occurs when markdown descriptions, specifications, and architecture models fail to keep pace with the evolving codebase. This report catalogs every verified discrepancy between repository documentation and actual code across **Next.js (Web)**, **Cloudflare Workers (API)**, **PostgreSQL (Database)**, and **Kotlin (Android)**.

---

## 2. Findings Grouped by Severity

### 2.1 CRITICAL SEVERITY (Release Blockers / Core Integrity)

| ID | Finding | Documented Claim | Ground-Truth Implementation Evidence | Status & Reconciliation |
|---|---|---|---|---|
| **DRIFT-CRIT-01** | **Platform Identity Divergence** | Historical files (`STFL_AIO_*.md`, `md-s/`) define active platform as `STFL AIO` (Autonomous Enterprise Platform). | The canonical platform identity is officially **`STFL VI`** (Unified Institutional Operating Platform). | **RECONCILED:** All active UI, metadata, navigation, PDF engine metadata, and API headers migrated to `STFL VI`. Historical files labeled as `LEGACY / RETIRED`. |
| **DRIFT-CRIT-02** | **Canonical Web Root Path** | References in older scripts point to `stfl/web` or `stfl/apk/web`. | Forensic analysis proved `stfl/apk/web` does not exist on disk, and `stfl/web` is an older frozen snapshot. `stfl/main/web` is the canonical Next.js 15 production root. | **RECONCILED:** All build, test, and launch scripts locked to `stfl/main/web`. Legacy `web` updated for fallback consistency. |

---

### 2.2 HIGH SEVERITY (Functional & Architectural Discrepancies)

| ID | Finding | Documented Claim | Ground-Truth Implementation Evidence | Status & Reconciliation |
|---|---|---|---|---|
| **DRIFT-HIGH-01** | **Management Console Count** | Early specifications (`STFL_AIO_MASTER_CONTROL.html`, `STFL_AIO_NAVIGATION_MODEL.md`) cite **16 management consoles**. | The codebase implements **18 active consoles** (`/admin/*`): 16 core consoles plus `/admin/compliance` (Statutory Compliance Engine) and `/admin/knowledge` (Knowledge Base & Training SOPs). | **RECONCILED:** Master control and route inventory updated to reflect 18 governed administrative consoles. |
| **DRIFT-HIGH-02** | **Compiled Web Route Count** | `STFL_WEB_ROUTES.md` previously claimed **59 compiled routes**. | The production Next.js compiler builds **73 total static/dynamic routes** including `/roadmap`, `/roadmap.html`, and dynamic initiative paths (`/initiatives/[projectSlug]`). | **RECONCILED:** Updated route matrices in `STFL_WEB_ROUTES.md` and test suite `verify-live-routes.ps1` (72 verified HTTP 200). |
| **DRIFT-HIGH-03** | **Digital Rent Receipt Authority** | `main/api/src/routes/grihosti.ts` and `engine.ts` generated agreements under `STFL AIO Digital Document Governance Framework`. | Updated to canonical legal framework: `SohaelTasneem Foundation (STFL VI)`. | **RECONCILED:** Code updated and verified. |

---

### 2.3 MEDIUM SEVERITY (Interface & Dependency Evolution)

| ID | Finding | Documented Claim | Ground-Truth Implementation Evidence | Status & Reconciliation |
|---|---|---|---|---|
| **DRIFT-MED-01** | **Bengali Typography Stack** | Legacy design docs only referenced `Hind Siliguri` and Google Fonts CDN imports. | Modern STFL VI typography standard mandates local TTF assets for `Hind Siliguri` (headers/subheaders) and formalizes `Noto Sans Bengali` and `Baloo Da 2` for body/UI/tables. | **RECONCILED:** Font assets deployed to `main/web/public/fonts/` with `@font-face` fallbacks. Documented in `STFL_VI_TYPOGRAPHY_SYSTEM.md`. |
| **DRIFT-MED-02** | **Visual Accent Tokens** | Early design system referenced plain orange (`#FF6B35`) and standard dark blue (`#081F2D`). | STFL VI introduces the **Bright-White / Neon Signal** layer (`--stfl-vi-white`, `--stfl-vi-bright`, `--stfl-vi-neon: #00D4FF`). | **RECONCILED:** Added CSS custom properties in `globals.css` and `stfl-tokens.css`. Documented in `STFL_VI_BRAND_GUIDELINES.md`. |
| **DRIFT-MED-03** | **Icon Library Governance** | Several early prototype specs suggested possible Lucide or Heroicon usage. | Strict platform invariant enforces **Iconoir (v7.12.1) exclusively**. Zero external icon sets allowed. | **RECONCILED:** Automated test `npm run verify:icons` passes with 100% compliance. |

---

### 2.4 LOW SEVERITY (Documentation-Only Artifacts)

| ID | Finding | Documented Claim | Ground-Truth Implementation Evidence | Status & Reconciliation |
|---|---|---|---|---|
| **DRIFT-LOW-01** | **Batch Launch Script Naming** | Root folder contained only `START-STFL-AIO-DEMO.bat` and `STOP-STFL-AIO-DEMO.bat`. | Created canonical scripts [`START-STFL-VI-DEMO.bat`](file:///C:/Users/ShoebTahseen/Desktop/stfl/START-STFL-VI-DEMO.bat) and [`STOP-STFL-VI-DEMO.bat`](file:///C:/Users/ShoebTahseen/Desktop/stfl/STOP-STFL-VI-DEMO.bat). Old scripts labeled as `[LEGACY PLATFORM NAME]`. | **RECONCILED:** Canonical launchers operational. |
| **DRIFT-LOW-02** | **Android APK Distribution Names** | `apk/build-apk.bat` copies output to `apk/release/stfl-aio-release.apk`. | Target platform is STFL VI. Package name in Gradle is canonical `foundation.sohaeltasneem`. | **RECONCILED:** Documented in `STFL_VI_CANONICAL_SOURCE_MAP.md`. |

---

### 2.5 INFORMATIONAL (Architectural Notes & Clarifications)

| ID | Finding | Clarification |
|---|---|---|
| **DRIFT-INFO-01** | **Specialist Systems Independence** | GrihostiOS is an STFL-owned domain vertical. HakimSarker.org and QiM-AI 2.1 are distinct initiatives. Varizen Inc. is a completely independent corporate technology entity. Documentation must never merge Varizen into STFL. |
| **DRIFT-INFO-02** | **Database Migration Names** | Migrations `0001_init.sql`, `0002_aio_parties_iam.sql`, and `0003_grihostios.sql` preserve their immutable filesystem filenames to prevent breaking checksum-verified migration rollups. |
