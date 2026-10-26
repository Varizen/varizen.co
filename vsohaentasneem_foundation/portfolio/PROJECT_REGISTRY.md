# STFL Project Registry

**13 registered initiatives.** Source of truth: `STFL_PROJECT_REGISTRY.json` (registry version 2026.10.16), reconciled against the repository on 2026-10-18.

Only facts discoverable from the repository are recorded. Unknown values are `UNKNOWN`.

---

## Registry table

| # | Project | Slug | Category | Type | Status | Production | Domain | Ownership | Brand | Visibility |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | GrihostiOS | `grihostios` | PROPERTY_AND_RURAL_ECONOMY | PLATFORM | `PILOT` | `ACTIVE_PILOT` | `grihostios.stflbd.app` | STFL_CONTROLLED | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 2 | SkillConnect | `skillconnect` | OPPORTUNITY_AND_WORKFORCE | INITIATIVE | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `skillconnect.stflbd.app` | STFL_CONTROLLED | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 3 | AEV Developments | `aev-developments` | PROPERTY_AND_RURAL_ECONOMY | VENTURE | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `aev.stflbd.app` | STFL_PARTNERSHIP | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 4 | MaxRemit | `maxremit` | FINANCE_AND_ACCESS | PLATFORM | `PROTOTYPE` | `PRE_REGULATORY_PILOT` | `maxremit.stflbd.app` | STFL_SUPPORTED | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 5 | Helpex | `helpex` | FINANCE_AND_ACCESS | VENTURE | `CONCEPT` | `REGULATED_SANDBOX_CONCEPT` | `helpex.my` | STFL_PARTNERSHIP | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 6 | Proiozon | `proiozon` | DIGITAL_AND_MARKETPLACE | DIGITAL_PLATFORM | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `proiozon.com` | STFL_CONTROLLED | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 7 | Perlu | `perlu` | DIGITAL_AND_MARKETPLACE | DIGITAL_PLATFORM | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `perlu.my` | STFL_PARTNERSHIP | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 8 | OIIX | `oiix` | COMMUNITY_AND_CULTURE | PUBLIC_INTEREST_PLATFORM | `PROTOTYPE` | `PROTOTYPE` | `oiix.fun` | STFL_SUPPORTED | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 9 | Hashify / Hashify.baby | `hashify` | EXPERIMENTAL_AND_EMERGING | RESEARCH_PROJECT | `CONCEPT` | `CONCEPT` | `hashify.baby` | UNVERIFIED | CONCEPT_ONLY | INTERNAL_ONLY |
| 10 | YourGiftCardSupply | `yourgiftcardsupply` | EXPERIMENTAL_AND_EMERGING | VENTURE | `ARCHIVED` | `ARCHIVED` | `yourgiftcardsupply.com` | INDEPENDENT_ENTITY | LEGACY | INTERNAL_ONLY |
| 11 | Cikgu Fatimah's Cloud Kitchen | `cikgu-fatimah` | COMMUNITY_AND_CULTURE | SOCIAL_ENTERPRISE | `CONCEPT` | `EXPLORATORY` | — | UNVERIFIED | CONCEPT_ONLY | INTERNAL_ONLY |
| 12 | Professor Dr. Abdul Hakim Sarker | `hakimsarker` | COMMUNITY_AND_CULTURE | PUBLIC_INTEREST_PLATFORM | `LIVE` | `ACTIVE_ARCHIVE` | `hakimsarker.org` | STFL_SUPPORTED | NATIVE_VERIFIED | PUBLICATION_APPROVED |
| 13 | QiM-AI 2.1 | `qimai` | DIGITAL_AND_MARKETPLACE | PLATFORM | `ACTIVE_DEVELOPMENT` | `DEVELOPMENT_AND_DEMO` | `qimai.codes` | STFL_PORTFOLIO | NATIVE_VERIFIED | PUBLICATION_APPROVED |

---

## Lifecycle summary

| State | Count | Projects |
|---|---|---|
| `LIVE` | 1 | HakimSarker.org |
| `PILOT` | 1 | GrihostiOS |
| `ACTIVE_DEVELOPMENT` | 5 | SkillConnect, AEV Developments, Proiozon, Perlu, QiM-AI 2.1 |
| `PROTOTYPE` | 2 | MaxRemit, OIIX |
| `CONCEPT` | 3 | Helpex, Hashify, Cikgu Fatimah's Cloud Kitchen |
| `ARCHIVED` | 1 | YourGiftCardSupply |
| `PAUSED` | 0 | — |
| `HISTORICAL` | 0 | — |
| `RETIRED` | 0 | — |
| `UNKNOWN` | 0 | — |

---

## Category summary

| Category | Projects |
|---|---|
| PROPERTY_AND_RURAL_ECONOMY | GrihostiOS, AEV Developments |
| OPPORTUNITY_AND_WORKFORCE | SkillConnect |
| FINANCE_AND_ACCESS | MaxRemit, Helpex |
| DIGITAL_AND_MARKETPLACE | Proiozon, Perlu, QiM-AI 2.1 |
| COMMUNITY_AND_CULTURE | OIIX, Cikgu Fatimah's Cloud Kitchen, HakimSarker.org |
| EXPERIMENTAL_AND_EMERGING | Hashify, YourGiftCardSupply |

---

## Ownership summary

| Ownership | Projects |
|---|---|
| `STFL_CONTROLLED` | GrihostiOS, SkillConnect, Proiozon |
| `STFL_PARTNERSHIP` | AEV Developments, Helpex, Perlu |
| `STFL_SUPPORTED` | MaxRemit, OIIX, HakimSarker.org |
| `STFL_PORTFOLIO` | QiM-AI 2.1 |
| `INDEPENDENT_ENTITY` | YourGiftCardSupply |
| `UNVERIFIED` | Hashify, Cikgu Fatimah's Cloud Kitchen |

---

## Excluded entity

| Entity | Rule | Rationale |
|---|---|---|
| **Varizen Inc.** | `STRICT_SEPARATION` | A separate commercial and technology entity. Excluded from the STFL Initiatives & Ventures public build. Never presented as an STFL venture or subsidiary. |

---

## Per-project detail

### 1 · GrihostiOS — `grihostios`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0001` |
| Display name | GrihostiOS — Property, Lease & Rural Economy OS |
| Category / Type | PROPERTY_AND_RURAL_ECONOMY / PLATFORM |
| Status | `PILOT` · production `ACTIVE_PILOT` |
| Ownership | `STFL_CONTROLLED` |
| Domain | `grihostios.stflbd.app` |
| Canonical path | `/initiatives/grihostios` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `PRIMARY_ANCHOR` |
| Source confidence | `AUTHORITATIVE_IMPLEMENTED` |
| Last verified | 2026-10-16 |
| Implementation | `main/api/src/grihosti/engine.ts`, `main/api/migrations/0003_grihostios.sql`, `stflbd.org/src/app/initiatives/grihostios/page.tsx`, `stflbd.org/src/app/admin/property/page.tsx` |
| Canonical docs | `STFL_WEB_GRIHOSTIOS_MODEL.md`, `STFL_AIO_PROPERTY_MODEL.md` |
| Workspace | [`projects/grihostios/`](../projects/grihostios/README.md) |

Comprehensive operating system for real estate, leases, agricultural land, crop-share seasons (Barga/Adhi), and governed digital agreements. Reference implementation for the STFL project ecosystem.

### 2 · SkillConnect — `skillconnect`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0002` |
| Display name | SkillConnect — Workforce & Opportunity Platform |
| Category / Type | OPPORTUNITY_AND_WORKFORCE / INITIATIVE |
| Status | `ACTIVE_DEVELOPMENT` |
| Ownership | `STFL_CONTROLLED` |
| Domain | `skillconnect.stflbd.app` |
| Canonical path | `/initiatives/skillconnect` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `KEY_INITIATIVE` |
| Source confidence | `HIGH_VERIFIED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/skillconnect/page.tsx`, `stflbd.org/src/lib/initiativesRegistry.ts` |
| Canonical docs | `STFL_AIO_MULTI_PROJECT_ARCHITECTURE.md` |
| Workspace | [`projects/skillconnect/`](../projects/skillconnect/README.md) |

Decentralized workforce registration, credential management, ethical recruitment matching, and migration guidance for skilled and semi-skilled workers.

### 3 · AEV Developments — `aev-developments`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0003` |
| Display name | AEV Developments — Real Estate & Social Infrastructure |
| Category / Type | PROPERTY_AND_RURAL_ECONOMY / VENTURE |
| Status | `ACTIVE_DEVELOPMENT` |
| Ownership | `STFL_PARTNERSHIP` |
| Domain | `aev.stflbd.app` |
| Canonical path | `/initiatives/aev-developments` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `INFRASTRUCTURE_PARTNER` |
| Source confidence | `HIGH_VERIFIED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/aev-developments/page.tsx` |
| Canonical docs | `STFL_AIO_PROJECT_MODEL.md`, `STFL_AIO_PARTY_RELATIONSHIP_MODEL.md` |
| Workspace | [`projects/aev-developments/`](../projects/aev-developments/README.md) |

Sustainable physical development, resilient community facilities, rural health centers, and low-cost ecological housing.

### 4 · MaxRemit — `maxremit`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0004` |
| Display name | MaxRemit — Remittance & Cross-Border Opportunity |
| Category / Type | FINANCE_AND_ACCESS / PLATFORM |
| Status | `PROTOTYPE` · production `PRE_REGULATORY_PILOT` |
| Ownership | `STFL_SUPPORTED` |
| Domain | `maxremit.stflbd.app` |
| Canonical path | `/initiatives/maxremit` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `FINANCIAL_INCLUSION` |
| Source confidence | `HIGH_VERIFIED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/maxremit/page.tsx` |
| Canonical docs | `STFL_AIO_FINANCE_MODEL.md`, `STFL_AIO_MULTI_PROJECT_API_SPEC.md` |
| Workspace | [`projects/maxremit/`](../projects/maxremit/README.md) |

Digital remittance access, diaspora support rails, and transparent cross-border financial empowerment for migrant worker families.

### 5 · Helpex — `helpex`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0005` |
| Display name | Helpex — Collateral Finance & Asset Security |
| Category / Type | FINANCE_AND_ACCESS / VENTURE |
| Status | `CONCEPT` · production `REGULATED_SANDBOX_CONCEPT` |
| Ownership | `STFL_PARTNERSHIP` |
| Domain | `helpex.my` |
| Canonical path | `/initiatives/helpex` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `FINANCIAL_INCLUSION` |
| Source confidence | `HIGH_VERIFIED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/helpex/page.tsx` |
| Canonical docs | `STFL_AIO_FINANCE_MODEL.md`, `STFL_AIO_PROJECT_MODEL.md` |
| Workspace | [`projects/helpex/`](../projects/helpex/README.md) |

Ethical collateral evaluation, transparent asset custody, and asset-backed micro-liquidity framework for small businesses and artisans.

### 6 · Proiozon — `proiozon`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0006` |
| Display name | Proiozon — Bangladesh Digital Marketplace |
| Category / Type | DIGITAL_AND_MARKETPLACE / DIGITAL_PLATFORM |
| Status | `ACTIVE_DEVELOPMENT` |
| Ownership | `STFL_CONTROLLED` |
| Domain | `proiozon.com` |
| Canonical path | `/initiatives/proiozon` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `COMMERCE_BACKBONE` |
| Source confidence | `AUTHORITATIVE_IMPLEMENTED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/proiozon/page.tsx` |
| Canonical docs | `STFL_AIO_PROJECT_MODEL.md` |
| Workspace | [`projects/proiozon/`](../projects/proiozon/README.md) |

Bangla-first hyperlocal digital commerce, empowering local artisans, women entrepreneurs, and trusted consumer goods across Bangladesh.

### 7 · Perlu — `perlu`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0007` |
| Display name | Perlu — Malaysia Vernacular Marketplace |
| Category / Type | DIGITAL_AND_MARKETPLACE / DIGITAL_PLATFORM |
| Status | `ACTIVE_DEVELOPMENT` |
| Ownership | `STFL_PARTNERSHIP` |
| Domain | `perlu.my` |
| Canonical path | `/initiatives/perlu` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `REGIONAL_COMMERCE` |
| Source confidence | `HIGH_VERIFIED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/perlu/page.tsx` |
| Canonical docs | `STFL_AIO_PROJECT_MODEL.md` |
| Workspace | [`projects/perlu/`](../projects/perlu/README.md) |

Community marketplace in Malaysia featuring verified electronics trade-in, circular economy lifecycle, and migrant household supplies.

### 8 · OIIX — `oiix`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0008` |
| Display name | OIIX — Social & Video Connection |
| Category / Type | COMMUNITY_AND_CULTURE / PUBLIC_INTEREST_PLATFORM |
| Status | `PROTOTYPE` |
| Ownership | `STFL_SUPPORTED` |
| Domain | `oiix.fun` |
| Canonical path | `/initiatives/oiix` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `COMMUNITY_ENGAGEMENT` |
| Source confidence | `HIGH_VERIFIED` |
| Last verified | 2026-10-16 |
| Implementation | `stflbd.org/src/app/initiatives/oiix/page.tsx` |
| Canonical docs | `STFL_AIO_COMMUNICATION_MODEL.md` |
| Workspace | [`projects/oiix/`](../projects/oiix/README.md) |

Next-generation video interaction, youth creative storytelling, and community WebRTC communications designed for regional connectivity.

### 9 · Hashify — `hashify`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0009` |
| Display name | Hashify — Cryptographic Attestation Research |
| Category / Type | EXPERIMENTAL_AND_EMERGING / RESEARCH_PROJECT |
| Status | `CONCEPT` |
| Ownership | `UNVERIFIED` |
| Domain | `hashify.baby` |
| Canonical path | `/internal/registry/hashify` (internal only) |
| Brand status | `CONCEPT_ONLY` |
| Ecosystem position | `RESEARCH_LAB` |
| Source confidence | `CONCEPTUAL` |
| Last verified | 2026-10-16 |
| Implementation | None in this repository |
| Canonical docs | `STFL_AIO_DEPENDENCY_INDEX.json` |
| Workspace | [`projects/hashify/`](../projects/hashify/README.md) |

Experimental micro-timestamping and digital credential integrity research.

### 10 · YourGiftCardSupply — `yourgiftcardsupply`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0010` |
| Display name | YourGiftCardSupply |
| Category / Type | EXPERIMENTAL_AND_EMERGING / VENTURE |
| Status | `ARCHIVED` |
| Ownership | `INDEPENDENT_ENTITY` |
| Domain | `yourgiftcardsupply.com` |
| Canonical path | `/internal/registry/yourgiftcardsupply` (internal only) |
| Brand status | `LEGACY` |
| Ecosystem position | `HISTORICAL_ARCHIVE` |
| Source confidence | `HISTORICAL_RECORD` |
| Last verified | 2026-10-16 |
| Implementation | None in this repository |
| Canonical docs | historical archive |
| Workspace | [`projects/yourgiftcardsupply/`](../projects/yourgiftcardsupply/README.md) |

Historical digital gift card inventory experiment. Archived — retained for record, never treated as active.

### 11 · Cikgu Fatimah's Cloud Kitchen — `cikgu-fatimah`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0011` |
| Display name | Cikgu Fatimah's Cloud Kitchen |
| Category / Type | COMMUNITY_AND_CULTURE / SOCIAL_ENTERPRISE |
| Status | `CONCEPT` · production `EXPLORATORY` |
| Ownership | `UNVERIFIED` |
| Domain | — |
| Canonical path | `/internal/registry/cikgu-fatimah` (internal only) |
| Brand status | `CONCEPT_ONLY` |
| Ecosystem position | `INCUBATION` |
| Source confidence | `EXPLORATORY` |
| Last verified | 2026-10-16 |
| Implementation | None in this repository |
| Canonical docs | community notes |
| Workspace | [`projects/cikgu-fatimah/`](../projects/cikgu-fatimah/README.md) |

Community food entrepreneurship and cloud kitchen micro-franchise model.

### 12 · Professor Dr. Abdul Hakim Sarker — `hakimsarker`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0012` |
| Display name | Professor Dr. Abdul Hakim Sarker — Academic Legacy & Knowledge Archive |
| Category / Type | COMMUNITY_AND_CULTURE / PUBLIC_INTEREST_PLATFORM |
| Status | `LIVE` · production `ACTIVE_ARCHIVE` |
| Ownership | `STFL_SUPPORTED` |
| Domain | `hakimsarker.org` |
| Canonical path | `/initiatives/hakimsarker` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `KEY_INITIATIVE` |
| Source confidence | `NOT RECORDED` |
| Last verified | `NOT RECORDED` |
| Implementation | `stflbd.org/src/app/initiatives/hakimsarker/page.tsx`, `stflbd.org/public/media/hakimsarker-*.svg` |
| Canonical docs | `HAKIMSARKER_DIGITAL_LEGACY_SPEC.md` (referenced, not present in this repository) |
| Workspace | [`projects/hakimsarker/`](../projects/hakimsarker/README.md) |

Preserving the academic scholarship, criminology research, victimology education, and social welfare legacy of Professor Dr. Abdul Hakim Sarker (1947–2025).

### 13 · QiM-AI 2.1 — `qimai`

| Field | Value |
|---|---|
| Project ID | `STFL-PRJ-2026-0013` |
| Display name | QiM-AI 2.1 — AI, Knowledge & Research Intelligence Platform |
| Category / Type | DIGITAL_AND_MARKETPLACE / PLATFORM |
| Status | `ACTIVE_DEVELOPMENT` · production `DEVELOPMENT_AND_DEMO` |
| Ownership | `STFL_PORTFOLIO` |
| Domain | `qimai.codes` |
| Canonical path | `/initiatives/qimai` |
| Brand status | `NATIVE_VERIFIED` |
| Ecosystem position | `ECOSYSTEM_PLATFORM` |
| Source confidence | `NOT RECORDED` |
| Last verified | `NOT RECORDED` |
| Implementation | `stflbd.org/src/app/initiatives/qimai/page.tsx`, `stflbd.org/public/media/qimai-*.svg` |
| Canonical docs | `QIMAI_PLATFORM_SPEC.md` (referenced, not present in this repository) |
| Workspace | [`projects/qimai/`](../projects/qimai/README.md) |

Enterprise RAG knowledge intelligence engine, AI Tutor, and citation intelligence workspace. *Knowledge In. Context Understood. Intelligence Out.*

---

## Classification pipeline

Every project passes through:

`DISCOVERED` → `IDENTIFIED` → `CLASSIFIED` → `OWNERSHIP_VERIFIED` → `BRAND_VERIFIED` → `PUBLICATION_APPROVED`

Current pipeline position is recorded per project in `STFL_PROJECT_REGISTRY.json`.
