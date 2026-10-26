# STFL VI Documentation Conflict & Contradiction Resolution Report
**Platform Name:** STFL VI  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Governance Principle:** Zero silent conflict resolution. Ground truth in code and verifiable evidence.  
**Date:** 2026-10-16  
**Status:** AUDITED & RESOLVED  

---

## 1. Executive Summary

This report documents all verified contradictions identified across the repository's documentation corpus. Each conflict contrasts two competing claims, presents the implementation evidence, and states the authoritative resolution.

---

## 2. Verified Conflicts & Resolutions

### Conflict 01: Canonical Platform Identity & Scope
- **Document A:** `STFL_AIO_MASTER_CONTROL.html` & `STFL_AIO_ARCHITECTURE.md`  
  *Claim:* Platform is named `STFL AIO` (SohaelTasneem Foundation Autonomous Enterprise Platform), focused primarily on automated enterprise workflows.
- **Document B:** `STFL_VI_MASTER_CONTROL.md` & `STFL_VI_BRAND_GUIDELINES.md`  
  *Claim:* Platform is named **`STFL VI`** (Unified Institutional Operating Platform), integrating institutional governance, people, land, microfinance, documents, field activity, and responsible intelligence.
- **Implementation Evidence:**  
  Active Next.js user interface, navigation top bar (`Navigation.tsx`), footer (`Footer.tsx`), admin workspace layout (`admin/layout.tsx`), PDF engine metadata (`print/pdf.ts`), and route titles (`roadmap/page.tsx`) are unified under `STFL VI`.
- **Authoritative Resolution:**  
  **`STFL VI`** is the canonical active platform name. `STFL AIO` is officially classified as `HISTORICAL ARCHITECTURE NAME` and preserved exclusively in legacy changelogs and audit artifacts.

---

### Conflict 02: Governed Management Console Count
- **Document A:** `STFL_AIO_MASTER_CONTROL.html` (Line 108) & `STFL_AIO_NAVIGATION_MODEL.md`  
  *Claim:* The administrative portal comprises exactly **16 management consoles** (CLASS_00 to CLASS_12 mapping).
- **Document B:** `STFL_WEB_ROUTES.md` (Section 6) & `main/web/src/app/admin/layout.tsx`  
  *Claim:* The administrative portal comprises **18 governed management consoles** plus the main workspace dashboard (`/admin`).
- **Implementation Evidence:**  
  The file system under `main/web/src/app/admin/` contains 18 active sub-routes with dedicated `page.tsx` implementations:
  1. `/admin/property` (GrihostiOS)
  2. `/admin/iam` (IAM & Identity)
  3. `/admin/governance` (Trustee Governance)
  4. `/admin/executive` (Executive Portfolio)
  5. `/admin/finance` (Ledger & Finance)
  6. `/admin/microfinance` (Microfinance Grants)
  7. `/admin/workforce` (Workforce & HR)
  8. `/admin/eshop` (E-Shop & Logistics)
  9. `/admin/projects` (Project Management)
  10. `/admin/assets` (Fixed Asset Inventory)
  11. `/admin/documents` (Document Lifecycle)
  12. `/admin/communications` (Communications Gateway)
  13. `/admin/security` (Security & Audit)
  14. `/admin/agents` (Autonomous Agents)
  15. `/admin/devices` (Device Fleet)
  16. `/admin/system` (System Diagnostics)
  17. `/admin/compliance` (Statutory Compliance Engine)
  18. `/admin/knowledge` (Knowledge & Training SOPs)
- **Authoritative Resolution:**  
  The authoritative count is **18 Governed Management Consoles** (plus the root `/admin` Workspace Dashboard). Early documents referencing 16 consoles represent the pre-expansion phase before Compliance and Knowledge were spun out into dedicated consoles.

---

### Conflict 03: Canonical Public Web Route Total
- **Document A:** `STFL_WEB_ROUTES.md` (Header)  
  *Claim:* `Total Compiled Routes: 59`.
- **Document B:** Production Build Output (`npm run build`) & `scripts/verify-live-routes.ps1`  
  *Claim:* Production Next.js compiler generates **73 total routes** (including static SSG initiative routes and new roadmap endpoints).
- **Implementation Evidence:**  
  Next.js 15 build traces confirm 73 compiled routes: 59 original public/admin routes + `/roadmap` + `/roadmap.html` + 10 pre-rendered initiative paths under `/initiatives/[projectSlug]` + dynamic document verifiers.
- **Authoritative Resolution:**  
  Update `STFL_WEB_ROUTES.md` and `STFL_VI_ROADMAP.md` to document the 73 compiled endpoints. 59 was the pre-initiative, pre-roadmap static count.

---

### Conflict 04: Bengali Typography Hierarchy for Body and UI
- **Document A:** `main/web/STFL_BRAND_SYSTEM.md` (Line 88)  
  *Claim:* `Hind Siliguri` is used globally for both headers and body copy.
- **Document B:** `STFL_VI_TYPOGRAPHY_SYSTEM.md` & `STFL_VI_BRAND_GUIDELINES.md`  
  *Claim:* `Hind Siliguri` is reserved strictly for headers, subheaders, and brand lockups. `Noto Sans Bengali` and `Baloo Da 2` are the official body, UI, form, and table families.
- **Implementation Evidence:**  
  `main/web/src/app/layout.tsx` imports both `Hind_Siliguri` and `Noto_Sans_Bengali` via `next/font/google`. `globals.css` imports `Baloo Da 2` and local TTF files for `Hind Siliguri`.
- **Authoritative Resolution:**  
  `STFL_VI_TYPOGRAPHY_SYSTEM.md` is canonical:
  - **BN Headings / Subheadings:** `Hind Siliguri` (MANDATORY & PRESERVED)
  - **BN Body / Reading:** `Noto Sans Bengali` / `Baloo Da 2`
  - **BN UI Controls / Forms / Tables:** `Noto Sans Bengali`
  - **EN Headings / Body:** `Inter`
  - **Monospace / Hashes:** `JetBrains Mono`

---

### Conflict 05: GrihostiOS Product Scope & Ownership
- **Document A:** Generic external SaaS assumption: GrihostiOS is an independent multi-tenant property SaaS.
- **Document B:** `STFL_WEB_GRIHOSTIOS_MODEL.md` & `main/api/src/grihosti/engine.ts`  
  *Claim:* GrihostiOS is a first-class governed domain vertical owned by SohaelTasneem Foundation, specifically managing real estate, greenfield structures, and rural agricultural crop-share (Barga/Adhi).
- **Implementation Evidence:**  
  `main/api/src/grihosti/engine.ts` verifies that GrihostiOS agreements are electronically signed under STFL governance. `main/web/src/app/admin/property/page.tsx` is an integrated STFL console.
- **Authoritative Resolution:**  
  GrihostiOS is an official STFL VI vertical. It remains distinct in product branding but operates under STFL institutional governance.
