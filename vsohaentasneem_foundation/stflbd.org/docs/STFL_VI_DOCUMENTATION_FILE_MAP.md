# STFL VI — Master Documentation File Map & Target Taxonomy
**Platform Name:** STFL VI  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Classification:** Target Logical Architecture & Lifecycle Migration Map  
**Governance Principle:** Non-Destructive Phased Migration. Preserve existing physical paths until dependency decoupling is complete.  
**Date:** 2026-10-16  
**Status:** AUTHORITATIVE & GOVERNED  

---

## 1. Target Logical Architecture (14 Master Directories)

```
00_CONSTITUTION/       <-- Sovereign charter, platform purpose, foundation bylaws
01_MASTER/             <-- Master control, high-level architecture, feature index
02_SECURITY/           <-- Threat model, penetration audits, device security, secret register
03_IDENTITY/           <-- Party model, IAM, user classes (CLASS_00-12), authorization, approvals
04_PROJECTS/           <-- Project model, multi-tenancy, partner registries, relationship models
05_BUSINESS/           <-- GrihostiOS, finance, microfinance, workforce, e-commerce, assets
06_DOCUMENTS/          <-- Digital document engine, PDF compositor, public verification, print tokens
07_INTELLIGENCE/       <-- Agent runtime, constitutional Level 3 ceilings, tool schemas, killswitches
08_BRAND/              <-- Brand guidelines, typography system, iconography policy, visual tokens
09_DEVELOPMENT/        <-- Web Next.js architecture, Android Kotlin specs, API contracts, database schemas
10_OPERATIONS/         <-- Deployment manifests, Cloudflare Workers, backup/recovery, runbooks
11_COMPLIANCE/         <-- 21 statutory compliance domains, TDS/VDS calculators, safeguarding framework
12_KNOWLEDGE/          <-- Operational field manuals, role curricula, content moderation SOPs
13_ROADMAP/            <-- Public roadmap, horizon tracking (2026-2035), go-live release gates
99_ARCHIVE/            <-- Historical AIO specs, legacy phase reports, superseded snapshots
```

---

## 2. Comprehensive File Mapping & Action Register

| Current File Path | Document Role / Scope | Target Logical Hierarchy | Status Taxonomy | Recommended Action | Action Rationale |
|---|---|---|---|---|---|
| `STFL_VI_CONSTITUTION.md` | Sovereign Platform Charter | `00_CONSTITUTION/STFL_VI_CONSTITUTION.md` | **CONSTITUTIONAL** | **KEEP** | Core institutional rule root. |
| `STFL_VI_MASTER_CONTROL.md` | Authoritative Platform Index | `01_MASTER/STFL_VI_MASTER_CONTROL.md` | **CANONICAL** | **KEEP** | Primary operational map. |
| `STFL_WEB_ARCHITECTURE.md` | Web App Architecture (Next.js 15) | `01_MASTER/STFL_WEB_ARCHITECTURE.md` | **CANONICAL** | **KEEP** | Governs production web root. |
| `STFL_VI_FEATURE_INDEX.md` | Complete 40-Feature Catalog | `01_MASTER/STFL_VI_FEATURE_INDEX.md` | **CANONICAL** | **KEEP** | Master feature tracking. |
| `STFL_VI_IMPLEMENTATION_REGISTER.md` | "Where do I change this?" Developer Map | `01_MASTER/STFL_VI_IMPLEMENTATION_REGISTER.md` | **CANONICAL** | **KEEP** | Developer operational lookup. |
| `STFL_VI_CANONICAL_SOURCE_MAP.md` | Single-Source-of-Truth Domain Map | `01_MASTER/STFL_VI_CANONICAL_SOURCE_MAP.md` | **CANONICAL** | **KEEP** | Prevents competing specs. |
| `STFL_VI_DOCUMENTATION_DRIFT.md` | Claims vs. Ground-Truth Analysis | `01_MASTER/STFL_VI_DOCUMENTATION_DRIFT.md` | **CANONICAL** | **KEEP** | Audits implementation drift. |
| `STFL_VI_DOCUMENTATION_CONFLICTS.md` | Contradiction Reconciliation | `01_MASTER/STFL_VI_DOCUMENTATION_CONFLICTS.md` | **CANONICAL** | **KEEP** | Resolves competing claims. |
| `STFL_VI_UNDOCUMENTED_IMPLEMENTATION.md` | Reverse Code Gap Analysis | `01_MASTER/STFL_VI_UNDOCUMENTED_IMPLEMENTATION.md`| **CANONICAL** | **KEEP** | Catalogs hidden modules. |
| `STFL_VI_SECURITY_AUDIT.md` | Penetration Test & Secret Audit | `02_SECURITY/STFL_VI_SECURITY_AUDIT.md` | **CANONICAL** | **KEEP** | Production security gate. |
| `STFL_WEB_SECURITY_MODEL.md` | Web Edge & Threat Defense | `02_SECURITY/STFL_WEB_SECURITY_MODEL.md` | **SUPPORTING** | **KEEP** | Web security specifics. |
| `STFL_VI_SECRET_LOCATION_REGISTER.md` | Sanitized Secret Locations & Rotation | `02_SECURITY/STFL_VI_SECRET_LOCATION_REGISTER.md` | **CANONICAL** | **KEEP** | DevSecOps credential map. |
| `STFL_AIO_SECURITY_MODEL.md` | Early Security Specification | `99_ARCHIVE/legacy-aio/STFL_AIO_SECURITY_MODEL.md` | **SUPERSEDED** | **ARCHIVE** | Replaced by STFL VI Security Audit. |
| `STFL_AIO_DEVICE_SECURITY_MODEL.md` | Early Android Device Security Spec | `99_ARCHIVE/legacy-aio/STFL_AIO_DEVICE_SECURITY_MODEL.md`| **SUPERSEDED** | **ARCHIVE** | Replaced by STFL VI Device Security. |
| `STFL_AIO_IAM_ARCHITECTURE.md` | Early IAM & User Classes Spec | `99_ARCHIVE/legacy-aio/STFL_AIO_IAM_ARCHITECTURE.md` | **SUPERSEDED** | **ARCHIVE** | Replaced by STFL VI IAM Model. |
| `STFL_AIO_AUTHORIZATION_MODEL.md` | Early 12-D Authorization Model | `99_ARCHIVE/legacy-aio/STFL_AIO_AUTHORIZATION_MODEL.md`| **SUPERSEDED** | **ARCHIVE** | Implemented in `main/api`. |
| `STFL_AIO_APPROVAL_ENGINE.md` | Early Anti-Collusion Engine Spec | `99_ARCHIVE/legacy-aio/STFL_AIO_APPROVAL_ENGINE.md` | **SUPERSEDED** | **ARCHIVE** | Implemented in `main/api`. |
| `STFL_AIO_ROLE_EXPERIENCE_MATRIX.md` | User Class Experience Matrices | `03_IDENTITY/STFL_VI_ROLE_EXPERIENCE_MATRIX.md` | **SUPPORTING** | **RENAME** | Update to STFL VI naming. |
| `STFL_AIO_PARTY_RELATIONSHIP_MODEL.md` | Multi-Party Legal Topology Spec | `03_IDENTITY/STFL_VI_PARTY_MODEL.md` | **SUPPORTING** | **RENAME** | Update to STFL VI naming. |
| `STFL_PROJECT_REGISTRY.json` | Active Initiative Registry | `04_PROJECTS/STFL_PROJECT_REGISTRY.json` | **CANONICAL** | **KEEP** | Consumed by Next.js registry. |
| `STFL_PROJECT_RELATIONSHIP_MODEL.md` | Project Inter-entity Links | `04_PROJECTS/STFL_PROJECT_RELATIONSHIP_MODEL.md` | **SUPPORTING** | **KEEP** | Active project governance. |
| `STFL_AIO_PROJECT_MODEL.md` | Early Multi-Project Spec | `99_ARCHIVE/legacy-aio/STFL_AIO_PROJECT_MODEL.md` | **SUPERSEDED** | **ARCHIVE** | Replaced by STFL VI Project Model. |
| `STFL_WEB_GRIHOSTIOS_MODEL.md` | GrihostiOS Domain Operating Model | `05_BUSINESS/GRIHOSTIOS.md` | **CANONICAL** | **KEEP** | Authoritative GrihostiOS spec. |
| `STFL_AIO_PROPERTY_MODEL.md` | Early Real Estate Model | `99_ARCHIVE/legacy-aio/STFL_AIO_PROPERTY_MODEL.md` | **SUPERSEDED** | **ARCHIVE** | Consolidated into GrihostiOS Model. |
| `STFL_AIO_FINANCE_MODEL.md` | Double-Entry Ledger Principles | `05_BUSINESS/FINANCE.md` | **CANONICAL** | **RENAME** | Update to STFL VI Finance Model. |
| `STFL_VI_BRAND_GUIDELINES.md` | Brand Identity & Logo Standards | `08_BRAND/STFL_VI_BRAND_GUIDELINES.md` | **CANONICAL** | **KEEP** | Authoritative brand system. |
| `STFL_VI_TYPOGRAPHY_SYSTEM.md` | Bengali & English Typography Stack | `08_BRAND/STFL_VI_TYPOGRAPHY_SYSTEM.md` | **CANONICAL** | **KEEP** | Hind Siliguri mandatory rules. |
| `main/web/STFL_ICONOGRAPHY_POLICY.md` | Strict Iconoir Icon Policy | `08_BRAND/STFL_ICONOGRAPHY_POLICY.md` | **CANONICAL** | **KEEP** | Prohibits non-Iconoir icons. |
| `STFL_VI_DESIGN_SYSTEM_AUDIT.md` | Design System & Token Audit | `08_BRAND/STFL_VI_DESIGN_SYSTEM_AUDIT.md` | **CANONICAL** | **KEEP** | Bright-white/neon standards. |
| `STFL_WEB_ROUTES.md` | Web Route Map & Navigation Matrix | `09_DEVELOPMENT/STFL_WEB_ROUTES.md` | **CANONICAL** | **KEEP** | 73 compiled routes verified. |
| `main/docs/API.md` | API Routes & Contracts | `09_DEVELOPMENT/API.md` | **CANONICAL** | **KEEP** | Hono edge contracts. |
| `main/docs/ARCHITECTURE.md` | Android Kotlin Core Architecture | `09_DEVELOPMENT/ANDROID.md` | **CANONICAL** | **KEEP** | Android native client spec. |
| `apk/docs/*` | Duplicate Copies of Android Docs | `99_ARCHIVE/duplicate/apk-docs/` | **DUPLICATE** | **ARCHIVE** | Exact byte dupes of `main/docs`. |
| `_old/*` | Obsolete Prototype Code & Specs | `99_ARCHIVE/historical/pre-2026/` | **HISTORICAL** | **ARCHIVE** | Historical audit only. |
| `md-s/*` | Phase 1 to Phase 10 Generation Logs | `99_ARCHIVE/historical/phase-reports/` | **HISTORICAL** | **ARCHIVE** | Phase milestone reports. |
| `STFL_VI_OPEN_SOURCE_RESEARCH.md` | Open-Source Technology Pull Strategy | `09_DEVELOPMENT/OPEN_SOURCE_PULL.md` | **CANONICAL** | **KEEP** | 12 architecture domains. |
| `STFL_VI_ROADMAP.md` | Verified Capabilities & Horizons | `13_ROADMAP/STFL_VI_ROADMAP.md` | **CANONICAL** | **KEEP** | Multi-horizon roadmap. |
| `STFL_VI_CHANGELOG.md` | Migration Master Changelog | `13_ROADMAP/STFL_VI_CHANGELOG.md` | **CANONICAL** | **KEEP** | Full migration record. |
| `STFL_VI_GO_LIVE_READINESS.md` | Production Release Assessment | `13_ROADMAP/STFL_VI_GO_LIVE_READINESS.md` | **CANONICAL** | **KEEP** | Formal Green Release Gate. |

---

## 3. Migration Safety Invariants

1. **Zero Premature Deletion:**  
   No documentation file is to be physically removed. Legacy and historical documents are retained for statutory legal compliance, audit proof, and architectural traceability.
2. **Path Stability:**  
   Because external tools, batch runners, and git history rely on established root paths, all files remain at their active locations during the current release. The logical directory structure represents the target taxonomy for the upcoming repository restructuring phase.
3. **Canonical Resolution:**  
   In all automated searches and portal navigation, canonical documents are prioritized as the exclusive authoritative sources.
