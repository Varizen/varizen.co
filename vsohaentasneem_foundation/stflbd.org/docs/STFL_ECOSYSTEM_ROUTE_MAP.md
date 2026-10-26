# STFL Ecosystem Route Map & URL Topology

**Document Identity:** `STFL-DOC-2026-RTE-MAP-V1`  
**Parent System:** SohaelTasneem Foundation (STFL)  
**Binding Architecture:** [STFL_DOMAIN_SEPARATION_ARCHITECTURE.md](../../STFL_DOMAIN_SEPARATION_ARCHITECTURE.md)  
**Effective Date:** 2026-10-18  
**Status:** RATIFIED & IMPLEMENTED  

---

## 1. Domain-Separated Ecosystem Route Architecture

Per `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md`:
- **`stflbd.org`** is the organisation: Foundation public website + Enterprise Workspace (`/admin/*`).
- **`stflbd.app`** is the mobile app only: app landing, `/download`, `/demo/*`, app legal pages, `/v` + `/verify` (permanent QR contract), `/api/v1` backend, and product subdomains (`*.stflbd.app`).

### A. Foundation Public Site & Enterprise Workspace (`stflbd.org`)
```
/ (Foundation Homepage)
  ├── /about (Institutional Profile)
  ├── /mission (Mission, Vision & Principles)
  ├── /team (Board & Executive Leadership)
  ├── /reports (Audits & Annual Filings)
  │
  ├── /programs (Core Programs Overview)
  │     ├── /programs/education (Education Pillar)
  │     ├── /programs/health (Healthcare Pillar)
  │     ├── /programs/community-development (Community Pillar)
  │     └── /programs/digital-inclusion (Digital Skills Pillar)
  │
  ├── /initiatives (CENTRAL ECOSYSTEM DIRECTORY & LIVING MAP)
  │     ├── /initiatives/grihostios (Reference OS: Property & Rural Economy)
  │     ├── /initiatives/skillconnect (Workforce & Migration Platform)
  │     ├── /initiatives/aev-developments (Infrastructure & Real Estate)
  │     ├── /initiatives/maxremit (Remittance & Cross-Border Rails)
  │     ├── /initiatives/helpex (Collateral Finance & Pawn Solutions)
  │     ├── /initiatives/proiozon (Bangladesh Digital Marketplace)
  │     ├── /initiatives/perlu (Malaysia Vernacular Marketplace)
  │     └── /initiatives/oiix (Social & Community Video Connection)
  │
  ├── /impact (Measurable Impact Evidence)
  ├── /projects (Field Activities & Workspaces)
  ├── /brandcenter & /brand (Brand Guidelines & Assets)
  ├── /news, /gallery, /publications, /events
  ├── /donate, /volunteer, /partner, /careers, /contact, /faq
  ├── /privacy, /terms, /safeguarding, /cookies (Foundation Policies)
  ├── /login, /signup (Staff & Officer Workspace Entry)
  └── /admin/* (Desktop-First Enterprise Workspace — 18 Consoles)
```

### B. Mobile Application Site & Permanent Services (`stflbd.app`)
```
/ (App Landing Page)
  ├── /download (Android APK & Play Store links)
  ├── /demo/* (Sandboxed demo consoles: /demo/finance, /demo/operations, etc.)
  ├── /roadmap (Mobile application roadmap)
  ├── /privacy, /terms, /safeguarding, /cookies (App Policies)
  ├── /account-deletion (Play Store requirement)
  ├── /v/[code] & /verify/[documentId] (PERMANENT Physical QR Verification Contract)
  ├── /api/v1/* (STFL API Cloudflare Worker)
  ├── /media/* (R2 Cloud Storage)
  └── /.well-known/assetlinks.json (Android App Links)
```

---

## 2. Route Health & Verification Matrix

Every route follows the ownership matrix in `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` §3.2. Verification is enforced by:
1. `npm run verify:domains` (`scripts/verify-domain-separation.mjs`) in both web repositories.
2. `scripts/verify-live-domains.ps1` for live smoke checks.
