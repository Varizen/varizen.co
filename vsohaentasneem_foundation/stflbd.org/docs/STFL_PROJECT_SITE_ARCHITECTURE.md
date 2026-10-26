# STFL Project-Site Architecture & Multi-Tenant Experience Specification

**Document Identity:** `STFL-DOC-2026-SITE-ARCH-V1`  
**Parent System:** SohaelTasneem Foundation (STFL)  
**Effective Date:** 2026-10-16  
**Status:** RATIFIED & IMPLEMENTED  

---

## 1. Architectural Philosophy: One Platform, Distinct Experiences

The STFL ecosystem resolves the tension between centralized governance and decentralized initiative autonomy through a **Shared Foundation + Native Identity** model:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SHARED STFL PLATFORM FOUNDATION                      │
│ • Next.js 15 App Router & Server-Side Static Generation                │
│ • Iconoir SVG Iconography Substrate (Strictly Enforced)                │
│ • Hind Siliguri + Inter Typography Stack & CSS Variables               │
│ • Centralized Language Context (Persistent BN / EN Toggle)             │
│ • Universal Verification Engine (/verify/[documentId])                 │
│ • WCAG AA Accessibility & Performance Budgets                          │
└────────────────────────────────────────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│     STFL INSTITUTIONAL EXPERIENCES   │  │   AUTONOMOUS PROJECT SITES   │
│ • Homepage (stflbd.app/)             │  │ • GrihostiOS (/initiatives/..)│
│ • About, Governance, Reports         │  │ • SkillConnect               │
│ • Humanitarian Programs (/programs)  │  │ • Proiozon                   │
│ • Brand Center (/brand, /brandcenter)│  │ • MaxRemit, Helpex, Perlu... │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. Universal Project Detail Page Anatomy

Every project experience under `/initiatives/[projectSlug]` implements a comprehensive, structured editorial presentation answering every user and stakeholder requirement:

1. **Ecosystem Breadcrumb & Governance Bar:**
   - Visual link back to STFL Ecosystem (`STFL > Initiatives & Ventures > [Project Name]`).
   - Official relationship badge (`An STFL Controlled Project`, `Ecosystem Portfolio`, etc.).
   - Bilingual language selector.

2. **Project Hero & Native Identity:**
   - Full native logo and authentic mark (no generic replacement).
   - Authoritative display name and bilingual project title.
   - Core purpose statement & high-impact punchline.
   - Status, category, and target market metadata chips.
   - Primary action CTA (e.g. `Launch Workspace`, `Explore Agreements`, `Register Worker`).

3. **Why It Exists & The Human Problem:**
   - Unvarnished field context, systemic bottlenecks, and the real need that motivated the project.

4. **The Opportunity & Strategic Vision:**
   - How the initiative restructures incentives, unlocks community capital, or removes frictional barriers.

5. **What It Does (Core Functional Capabilities):**
   - Concrete feature pillars with structured cards and Iconoir indicators.
   - Interactive demos or workflows where applicable (e.g. GrihostiOS Agreement Simulator).

6. **How It Works (Operating Sequence):**
   - Step-by-step lifecycle flow (e.g. `SELECT → FILL → CHECK → SIGN → RECEIVE → VERIFY`).

7. **Who It Serves (Stakeholder & Beneficiary Matrix):**
   - Clear breakdown of end-users: tenants, landowners, migrant workers, small business owners, local cooperatives.

8. **Governance, Documentation & Legal Status:**
   - Regulatory framework, statutory disclaimers, and transparent operational status.
   - Links to cryptographic verification, official specifications, and compliance audit notes.

9. **Institutional Trust Footer:**
   - Mandatory STFL ecosystem seal: `"An initiative governed within the SohaelTasneem Foundation (STFL) ecosystem."`
   - Canonical domain reference and contact link.

---

## 3. Four-Tier Experience Lifecycle

Each project can graduate through four maturity tiers without requiring full technical rewrites:

```
Tier 1: Ecosystem Card (/initiatives#grid)
  ↓
Tier 2: Dedicated Initiative Landing Page (/initiatives/[slug])
  ↓
Tier 3: Interactive Web Application (/initiatives/[slug]/app or subdomain)
  ↓
Tier 4: Enterprise Governed Console (/admin/property, /admin/workforce)
```
