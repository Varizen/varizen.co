# STFL AIO — Universal Project Workspace Specification

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-WORKSPACE-SPEC-V1`  
**Phase:** Phase 4 — Project Workspace Component & Data Specification  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.  
*(ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি)*  

---

## 1. Universal Project Header Component

Every project view renders the canonical executive header:

```
+------------------------------------------------------------------------------------------------------+
| STFL AIO > PROJECTS > STFL-PRJ-2026-0012                                  [ STATUS: ACTIVE • GOOD ]  |
|                                                                                                      |
| 🏢 Education Access 2026 (শিক্ষা বিস্তার ও ডিজিটাল সাক্ষরতা ২০২৬)                                      |
| STFL-PRJ-2026-0012 • Bangladesh (Sylhet & Kurigram Divisions) • Active (Jan 2026 – Dec 2026)         |
| Sponsor: Zakat & Waqf Education Pool • Lead: Tahmidur Rahman (Class 03) • Mgr: Sharmin Akter (04)    |
|                                                                                                      |
| [ Overview ] [ Operations ] [ Outcomes ] [ Finance ] [ People ] [ Assets ] [ Documents ] [ Compliance ] [ Governance ] |
+------------------------------------------------------------------------------------------------------+
```

---

## 2. Project Overview Dashboard (The 6 Questions & 10 KPIs)

The default project overview screen answers the six essential human questions:
1. **WHAT ARE WE DOING?** — Objective: Deliver verified primary curriculum and digital literacy to 8,000 underserved rural children.
2. **WHAT HAS BEEN DONE?** — 94 of 120 scheduled learning sessions completed; 14 community classrooms established.
3. **WHAT CHANGED?** — 7,680 students enrolled; 91% pass rate on standardized competency evaluations.
4. **WHAT DID IT COST?** — ৳8.4M Direct Project Expenditure + ৳600k Shared Logistics + ৳300k Overhead (3.2%).
5. **WHAT REMAINS?** — 26 sessions scheduled; ৳3.6M available funding; 2 rural centers in Kurigram awaiting monsoon road repair.
6. **WHAT NEEDS ATTENTION?** — 2 pending voucher approvals (> ৳100k); 1 teacher vacancy in Sunamganj.

### The 10 Authoritative KPI Blocks

| KPI Block | Definition & Calculation | Target | Actual | Source & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **1. People Reached** | Unique verified beneficiaries with national ID or household survey | 8,000 | **7,680** (96%) | Survey Ledger (`parties`) |
| **2. Activities Completed** | Executed operational activities with verified field reports | 120 | **94** (78%) | Project Activities Table |
| **3. Verified Outputs** | Physical units delivered (Classroom sessions, book sets, tablets) | 8,000 sets | **7,820 sets** | Asset Custody Logs |
| **4. Outcome Target** | Primary evaluation benchmark (% students achieving grade level) | 85.0% | **91.2%** | Academic Evaluation Logs |
| **5. Funds Received** | Total grant revenue received in project bank sub-ledger | ৳12.0M | **৳12.0M** (100%) | PostgreSQL `NUMERIC(18,2)` |
| **6. Total Spent** | Direct Project Exp + Shared Cost + Overhead | ৳12.0M | **৳9.3M** (77.5%) | PostgreSQL Vouchers Ledger |
| **7. Available Funds** | Funds Received minus Total Spent | — | **৳2.7M** | Real-time Balance |
| **8. Cost per Outcome** | Total Expenditure divided by Verified Outcomes Achieved | < ৳1,500 | **৳1,093.75** | Automated Ratio Engine |
| **9. Overhead Ratio** | Administrative Overhead divided by Total Cost | < 7.0% | **3.2%** | Statutory Ratio Engine |
| **10. Project Health** | Composite index (Timeline, Budget, Outcomes, Compliance) | GOOD | **GOOD (94/100)**| Autonomous Health Metric |

---

## 3. The Nine Facets of the Project Workspace

### 3.1. Overview (`/project/[id]`)
Executive pulse, KPI matrix, high-level timeline, and attention-first action banners.

### 3.2. Operations (`/project/[id]/operations`)
- Operational activities broken down by status: **PLANNED**, **IN PROGRESS**, **COMPLETED**, **BLOCKED**, **OVERDUE**.
- Detailed item cards: Title, responsible supervisor, location, budget allocation, completion percentage, issues, and attached GPS/photo evidence proofs.

### 3.3. Outcomes (`/project/[id]/outcomes`)
- The explicit **Input → Activity → Output → Outcome → Impact** causal chain.
- Baseline measurements, target vs actual progress bars, methodology, confidence score, and verified beneficiary verification states.

### 3.4. Finance (`/project/[id]/finance`)
- **Funding:** Received, Committed, Restricted (Zakat/Waqf), Available balance.
- **Expenditure Breakdown:**
  - *Direct Project Cost:* Classroom leases, teacher stipends, student book kits.
  - *Indirect / Shared Cost:* Vehicle fuel, regional supervisor travel, mobile data connectivity.
  - *Administrative Overhead:* Central audit, cloud edge hosting, banking fees.
- **Financial Controls:** Budget vs Actual variance, Payables, Receivables, Bank Reconciliation status.

### 3.5. People (`/project/[id]/people`)
- Unified directory of parties associated with this project:
  - Project Staff (Teachers, Coordinators)
  - Field Workers (`CLASS_05`)
  - Community Volunteers
  - Institutional Partners & Donors
  - Verified Beneficiaries (Students & Households)
- Decoupled relationship view: A party's multiple roles are explicitly displayed without identity flattening.

### 3.6. Assets (`/project/[id]/assets`)
- Physical real estate units, classroom equipment, solar generators, tablets, and vehicles assigned to the project.
- Asset status, condition, serial number, physical QR/NFC tag verification date, and custodian party ID.

### 3.7. Documents (`/project/[id]/documents`)
- Project-scoped repository of official contracts, property leases (`STFL-LSE-*`), expense vouchers (`STFL-VCH-*`), letters (`STFL-LET-*`), and certificates (`STFL-CER-*`).
- Direct links to public verification at `https://stflbd.app/verify/{document_id}`.

### 3.8. Compliance (`/project/[id]/compliance`)
- Real-time status across applicable statutory domains (e.g. Labour Act 2006 for teachers, BNBC for classroom safety, Child Protection & Safeguarding).
- Active alerts, audit dates, and compliance outcome badges (`CLEAR`, `ADVISORY`, `HOLD`).

### 3.9. Governance (`/project/[id]/governance`)
- Project approval queue (pending purchases, leave requests, travel advances).
- Anti-collusion checks: Visual indicator verifying creator != approver.
- Append-only immutable project audit trail extracted from `enterprise_audit_logs`.
