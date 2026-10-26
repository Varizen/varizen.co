# STFL Web Project-Centric Architecture & Multi-Tenant Model
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Core Domain:** Autonomous Field Projects under Unified Foundation Governance  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Project Philosophy & Governance Hierarchy

SohaelTasneem Foundation does not operate as a single monolithic charity silo. It is an **operating system for autonomous community initiatives**:
- A **Project** is a first-class, legally and operationally governed environment.
- Projects may have independent objectives, dedicated field teams, separate geographic bounds, unique external stakeholders, and isolated budgets.
- All projects remain anchored to STFL platform security, audit trails, and measurement frameworks.

```
PARTY
  ↓
IDENTITY
  ↓
MEMBERSHIP / RELATIONSHIP
  ↓
PROJECT
  ↓
ROLE
  ↓
SCOPE
  ↓
PERMISSION
  ↓
ACTION
  ↓
AUDIT TRAIL
```

---

## 2. Dynamic Party & Relationship Model

A stakeholder’s relationship to a project does **not** assume full STFL foundation employment:
- `PARTY`: Individual person, cooperative, community committee, donor organization, local government authority.
- `RELATIONSHIP`: Project Director, Field Officer, Community Elder, Beneficiary Household, Independent Auditor.
- **Rule:** A person can simultaneously hold:
  - `CLASS_02 Executive` at STFL Foundation level.
  - `Project Director` for Project Bogura Agricultural Hub.
  - `External Observer` for Project Satkhira Saline Water Initiative.
- The Web UI dynamically renders permissions and controls scoped to the currently selected project workspace.

---

## 3. Project Finance Isolation & Consolidation

Each project maintains an isolated financial sub-ledger:
1. **Chart of Accounts (CoA):** Project-specific revenue, grant allocations, operational expenditures, and asset registries.
2. **Budgeting & Commitments:** Real-time variance tracking (Allocated vs. Committed vs. Disbursed vs. Available).
3. **No Floating Point Money:** All calculations are performed server-side in integer cents/poisha. Frontend only formats verified numbers.
4. **Voucher Reconciliation:** Every expenditure requires a cryptographic voucher (`STFL-VCH-...`), digitized invoice receipt, and approval signature.
5. **Portfolio Consolidation:** STFL Executive Management can view an aggregated cross-project portfolio balance sheet without data leakage between unauthorized field teams.

---

## 4. Multi-Tenant Project Websites Architecture

Future autonomous projects may possess their own branded digital identities or custom subdomains (e.g., `bogura.stflbd.app`):
- **Shared Codebase:** Built inside `main/web` without code duplication or competing forks.
- **Project Configuration:** Driven by project ID context and API metadata:
  - Project Title & Bilingual Tagline.
  - Theme Accent Tokens (primary color, badge accents).
  - Public Project Directory (`/projects/[projectId]`).
  - Scoped Stakeholder Sign-In and document repository.
