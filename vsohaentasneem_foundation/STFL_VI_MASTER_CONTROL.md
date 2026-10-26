# STFL VI — Master Control & Platform Constitution Register
**Canonical Platform Identity:** **STFL VI**  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Classification:** Unified Institutional Operating Platform  
**Status:** CONSTITUTIONAL & AUTHORITATIVE  
**Version:** 2026.10 (LOCKED)  

---

## 1. Platform Identity & Constitutional Purpose

STFL VI is the sovereign institutional operating platform for the **SohaelTasneem Foundation**. It coordinates people, projects, resources, statutory governance, field operations, knowledge, double-entry finance, real estate, agricultural land, verifiable digital documents, regulatory compliance, and responsible bounded intelligence.

- **Canonical Name:** `STFL VI`
- **Legacy Platform Name:** `STFL AIO` (Officially retired; preserved in changelogs for historical traceability)
- **Tagline:** *Unified Institutional Operating Platform*
- **Organization & Enterprise Domain:** `https://stflbd.org` (Foundation website & `/admin/*` workspace)
- **Mobile App & API Domain:** `https://stflbd.app` (App landing, `/download`, `/demo`, permanent QR `/v` & `/verify`, `/api/v1`)
- **Domain Separation Spec:** [STFL_DOMAIN_SEPARATION_ARCHITECTURE.md](./STFL_DOMAIN_SEPARATION_ARCHITECTURE.md)
- **Official Institutional Email:** `hi@stflbd.email`
- **HQ Location:** STFL House, 173 E Ullan Road, W Rampura, Dhaka 1219, Bangladesh

---

## 2. Platform Architecture & Layering

```
SohaelTasneem Foundation (Governance & Trustees)
                      ↓
                   STFL VI
                      ↓
  ┌───────────────────┼───────────────────┐
  │                   │                   │
Web (Next.js 15)   API Edge (Hono)    Android Native
App Router         Cloudflare Workers  Jetpack Compose
Tailwind v4        PostgreSQL Ledger   Hardware Keystore
  └───────────────────┬───────────────────┘
                      ↓
         Core Platform Capabilities
 (18 Consoles · 13 User Classes · 17 Core Entities)
                      ↓
   Specialist Initiative Verticals & Projects
   ├── GrihostiOS (Property, Land, Agriculture)
   ├── HakimSarker.org (Public Heritage Portal)
   ├── QiM-AI 2.1 (Research & Knowledge Substrate)
   └── Field Initiatives (Education, Health, Relief)
```

---

## 3. The 17 Core Architecture Entities

All platform data models inherit from the 17 constitutional entities:

1. **Party:** Autonomous legal/natural entities (Individuals, Trusts, Corporations, Cooperatives).
2. **Identity:** Cryptographic authenticators and verified credential claims.
3. **User:** Active authenticated human sessions.
4. **Agent:** Bounded AI runtime personas operating strictly under Level 3 authority ceilings.
5. **Device:** Physical registered hardware (Android tablets, POS terminals) with hardware attestation.
6. **Class:** Standardized functional seniority tiers (`CLASS_00` to `CLASS_12`).
7. **Role:** Specific operational assignments (e.g., *Field Relief Officer*, *Trustee Auditor*).
8. **Unit:** Organizational divisions, departments, or field clinics.
9. **Relationship:** Governed multi-party links (Tenant, Landlord, Beneficiary, Guarantor).
10. **Resource:** Any ledger account, land parcel, document template, or inventory item.
11. **Project:** Isolated multi-tenant operational boundary.
12. **Scope:** Granular execution boundary (e.g., `read:finance`, `execute:disbursement`).
13. **Permission:** Atomic authorization tuple linking Party + Scope + Resource.
14. **Policy:** Declarative rules governing approvals, statutory holds, and compliance checks.
15. **Approval:** Cryptographically recorded multi-signature authorization events.
16. **Action:** Ledgered transactional execution.
17. **Audit:** Append-only, tamper-evident chronological event trail with continuous SHA-256 hash chaining.

---

## 4. The 13 User Classes (`CLASS_00` to `CLASS_12`)

| Class | Title | Governed Authority & Scope |
|---|---|---|
| **CLASS_00** | System Kernel / Invariant Root | Emergency hardware-bound recovery; programmatic invariant enforcement. |
| **CLASS_01** | Board of Trustees | Sovereign institutional resolutions; constitutional policy amendments. |
| **CLASS_02** | Advisory Council | Strategic oversight; non-voting advisory review. |
| **CLASS_03** | Executive Leadership | Cross-project portfolio orchestration; statutory budget sign-off. |
| **CLASS_04** | Compliance & Legal Counsel | Regulatory holds; statutory tax filings; safeguarding incident management. |
| **CLASS_05** | Chief Financial Officer | High-value disbursement authorization; treasury management; banking sign-off. |
| **CLASS_06** | Departmental Directors | Project creation; operational resource allocation; staff assignment. |
| **CLASS_07** | Senior Project Managers | Daily project execution; milestone tracking; field expense approval. |
| **CLASS_08** | Field Officers & Case Workers | Beneficiary intake; relief dispatch; mobile rent collection; survey recording. |
| **CLASS_09** | Specialized Professionals | Doctors, agronomists, civil engineers, and legal template authors. |
| **CLASS_10** | Partner Liaisons & Donors | External co-funding oversight; verified audit disclosure access. |
| **CLASS_11** | Community Volunteers | Task fulfillment; event assistance; read-only field rosters. |
| **CLASS_12** | Beneficiaries & Public | Public verification; application submission; digital rent receipt download. |

---

## 5. The 18 Governed Management Consoles (`/admin/*`)

1. **`/admin/property` (GrihostiOS):** Real estate units, greenfield structures, land flood-levels, and crop sharing.
2. **`/admin/iam` (IAM & Identity):** User classes, biometric credentials, and scoped permissions.
3. **`/admin/governance` (Trustee Governance):** Board resolutions, committee minutes, and policy ratifications.
4. **`/admin/executive` (Executive Portfolio):** Consolidated cross-project strategy and performance metrics.
5. **`/admin/finance` (Ledger & Finance):** General ledger, vouchers, bank reconciliations, and withholding tax.
6. **`/admin/microfinance` (Microfinance & Grants):** Community revolving funds, repayment schedules, and grant tracking.
7. **`/admin/workforce` (Workforce & HR):** Field rosters, staff assignments, payroll, and attendance.
8. **`/admin/eshop` (E-Shop & Logistics):** Fair-trade artisanal products and disaster relief inventories.
9. **`/admin/projects` (Project Management):** Multi-project workspaces and milestone governance.
10. **`/admin/assets` (Fixed Asset Inventory):** Solar installations, clinic machinery, vehicles, and serial tracking.
11. **`/admin/documents` (Document Lifecycle):** Draft, Review, Approve, Issue, Revoke, and Hash auditing.
12. **`/admin/communications` (Communications Gateway):** Governed SMS, emergency broadcasts, and formal notice dispatch.
13. **`/admin/security` (Security & Audit):** Threat telemetry, session controls, and tamper detection.
14. **`/admin/agents` (Autonomous Agents):** Level 1–3 agent supervision, invocation budgets, and kill switches.
15. **`/admin/devices` (Device Fleet):** Registered Android tablets, hardware attestation, and remote wipes.
16. **`/admin/system` (System Diagnostics):** Cloudflare worker health, database latency, and cache metrics.
17. **`/admin/compliance` (Statutory Compliance Engine):** 21 compliance domains, statutory tax, and audit escalations.
18. **`/admin/knowledge` (Knowledge & Training SOPs):** Operational field manuals, role curricula, and moderation SOPs.

---

## 6. Business Domains & Domain Verticals

- **Property & Agriculture ([GrihostiOS](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_WEB_GRIHOSTIOS_MODEL.md)):** First-class domain vertical. Governs urban tenancies, maintenance charges, and rural agricultural contracts (Barga, Adhi, Revenue-Share). Generates legally grounded contracts with continuous SHA-256 rolling verification.
- **Ledger & Microfinance:** Strict double-entry accounting with `NUMERIC(18,2)` currency precision. Four-eyes principle (initiator cannot approve) enforced algorithmically.
- **Autonomous Intelligence:** Strict **Level 3 ceiling**. Agents are restricted to classification, drafting, monitoring, and advisory recommendation. Zero autonomous disbursement or self-privilege escalation is permitted.
- **Digital Documents & Printing:** Cryptographic SHA-256 state roll, dynamic diagonal watermarking with Copy ID and Requester ID, one-time authorized print tokens, and public QR code authenticity verification (`/v/:code`).

---

## 7. Brand, Typography & Design Tokens

- **Emblem & Wordmark:** Official SohaelTasneem Foundation emblem. Standard clear-space and aspect ratios strictly enforced.
- **Header & Subheader Typography:** **`Hind Siliguri`** (MANDATORY across 100% of headers and subheaders; backed by bundled local TTF files).
- **Body & UI Typography:** **`Noto Sans Bengali`** and **`Baloo Da 2`** for long-form content, UI controls, forms, and data tables.
- **English Typography:** **`Inter`** for body copy and headings.
- **Monospace / Hash:** **`JetBrains Mono`** for cryptographic hashes, vouchers, and copy IDs.
- **Iconography Policy:** **`iconoir-react` exclusively**. 100% adherence enforced by automated test `verify:icons`.
- **Bright-White / Neon Signal Layer:** `--stfl-vi-white: #FFFFFF`, `--stfl-vi-bright: #F8FAFC`, `--stfl-vi-neon: #00D4FF`, `--stfl-vi-dark: #081F2D`, `--stfl-vi-surface: #0E2A3A`, `--stfl-vi-border: #1B3B4E`.

---

## 8. Current Implementation & Production Status

- **Web Portal:** 73 compiled routes (Next.js 15 App Router). 100% verified responding HTTP 200.
- **Security Audit:** 0 critical, 0 high vulnerabilities. 0 production secrets exposed across 610 scanned files.
- **TypeScript:** Strict mode enabled, 0 errors.
- **Release Decision:** **`GREEN — GO LIVE APPROVED`**.

---

## 9. Canonical Document Cross-References

| Domain | Canonical Specification |
|---|---|
| **Canonical Source Map** | [STFL_VI_CANONICAL_SOURCE_MAP.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_CANONICAL_SOURCE_MAP.md) |
| **Documentation Drift** | [STFL_VI_DOCUMENTATION_DRIFT.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_DOCUMENTATION_DRIFT.md) |
| **Conflict Resolutions** | [STFL_VI_DOCUMENTATION_CONFLICTS.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_DOCUMENTATION_CONFLICTS.md) |
| **Undocumented Code** | [STFL_VI_UNDOCUMENTED_IMPLEMENTATION.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_UNDOCUMENTED_IMPLEMENTATION.md) |
| **Feature Catalog** | [STFL_VI_FEATURE_INDEX.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_FEATURE_INDEX.md) |
| **Developer Map** | [STFL_VI_IMPLEMENTATION_REGISTER.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_IMPLEMENTATION_REGISTER.md) |
| **Secret Locations** | [STFL_VI_SECRET_LOCATION_REGISTER.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_SECRET_LOCATION_REGISTER.md) |
| **Security Audit** | [STFL_VI_SECURITY_AUDIT.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_SECURITY_AUDIT.md) |
| **Brand Guidelines** | [STFL_VI_BRAND_GUIDELINES.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_BRAND_GUIDELINES.md) |
| **Typography System** | [STFL_VI_TYPOGRAPHY_SYSTEM.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_TYPOGRAPHY_SYSTEM.md) |
| **Platform Roadmap** | [STFL_VI_ROADMAP.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_ROADMAP.md) |
| **Go-Live Readiness** | [STFL_VI_GO_LIVE_READINESS.md](file:///C:/Users/ShoebTahseen/Desktop/stfl/main/web/docs/STFL_VI_GO_LIVE_READINESS.md) |
