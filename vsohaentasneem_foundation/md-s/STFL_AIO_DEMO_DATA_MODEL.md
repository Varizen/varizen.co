# STFL AIO — Live Demo Data Model Specification
**Document ID:** `STFL_AIO_DEMO_DATA_MODEL.md`  
**Phase:** Prompt 12.5 (Live Development Demo / Preview Environment)  
**Status:** IMPLEMENTED & LOCALLY VERIFIED  
**Production Verification Status:** PENDING

---

## 1. Overview & Prefix Convention

To guarantee complete non-production isolation and prevent any data pollution, every entity, record, token, and party identifier generated for the demonstration environment is strictly deterministic and prefixed with:

`STFL-DEMO-*`

This prefix enables:
- Visual and programmatic separation from any production or standard test records.
- Safe, targeted demo resets via `POST /api/v1/demo/reset` that touch only demo-scoped records.
- Immediate recognition by human operators, reviewers, and automated verification tools.

---

## 2. Canonical Demo Identities (13 Classes)

The demo environment provisions 13 authenticated identities mapped to the authoritative STFL User Class Matrix (`STFL_USER_CLASS_MATRIX.md`):

| Class | Title | Name / Entity | User ID | Device ID | Primary Unit | Allowed Consoles |
|---|---|---|---|---|---|---|
| **CLASS_00** | Super Admin | Tech Lead Tariq | `STFL-DEMO-USR-000` | `STFL-DEMO-DVC-000` | `CORE_TECH` | All 16 Consoles *(SoD Restricted for Disbursement)* |
| **CLASS_01** | Trustee | Barrister Rafiq | `STFL-DEMO-USR-001` | `STFL-DEMO-DVC-001` | `BOARD` | Governance, Executive, Audit, Comms |
| **CLASS_02** | Executive | Director Zubaida | `STFL-DEMO-USR-002` | `STFL-DEMO-DVC-002` | `EXECUTIVE` | Executive, Governance, Finance, Projects |
| **CLASS_03** | Finance Officer | CA Farhan | `STFL-DEMO-USR-003` | `STFL-DEMO-DVC-003` | `FINANCE` | Finance, Audit, Executive |
| **CLASS_04** | Property Officer | Surveyor Karim | `STFL-DEMO-USR-004` | `STFL-DEMO-DVC-004` | `PROPERTY` | Property, Assets, Documents |
| **CLASS_05** | Microfinance Officer | Loan Officer Salma | `STFL-DEMO-USR-005` | `STFL-DEMO-DVC-005` | `MICROFINANCE` | Microfinance, Finance, Audit |
| **CLASS_06** | Workforce Manager | HR Lead Nusrat | `STFL-DEMO-USR-006` | `STFL-DEMO-DVC-006` | `WORKFORCE` | Workforce, Comms |
| **CLASS_07** | Project Officer | Engr. Kamal | `STFL-DEMO-USR-007` | `STFL-DEMO-DVC-007` | `PROJECTS` | Projects, Assets, Workforce |
| **CLASS_08** | Records & Security | Inspector Harun | `STFL-DEMO-USR-008` | `STFL-DEMO-DVC-008` | `SECURITY` | Security, Devices, Audit, Documents |
| **CLASS_09** | Field Worker | Agent / Field Jamal | `STFL-DEMO-USR-009` | `STFL-DEMO-DVC-009` | `OPERATIONS` | Workforce, Comms *(Field Operations Only)* |
| **CLASS_10** | AI Autonomous Agent | FinBot Alpha | `STFL-DEMO-AGT-FIN-001` | `STFL-DEMO-DVC-010` | `FINANCE` | Finance *(Level 3 Ceiling, No Self-Approve)* |
| **CLASS_11** | External Party | Green Delta Traders | `STFL-DEMO-USR-011` | `STFL-DEMO-DVC-011` | `EXTERNAL` | E-Shop *(Self-tenant / Self-records Only)* |
| **CLASS_12** | Public User | Public Citizen | `STFL-DEMO-USR-012` | `STFL-DEMO-DVC-012` | `PUBLIC` | Documents *(Public Verification Only)* |

---

## 3. Fictional Parties & Dynamic Relationships

The demo dataset rigorously demonstrates that **Parties are independent of User Accounts**, and **Relationships are dynamic and contextual rather than static roles**:

### 3.1 Demo Parties
- `STFL-DEMO-PTY-001`: Haji Abdul Gafur Trust (Institutional Waqf Trust - Landlord / Donor)
- `STFL-DEMO-PTY-002`: Green Delta Agro Ltd. (Commercial Enterprise - Lessee / Vendor)
- `STFL-DEMO-PTY-003`: Begum Rokeya Women's Cooperative (NGO / Beneficiary Group - Borrower)
- `STFL-DEMO-PTY-004`: Engr. Kamal Hossain (Individual - Employee / Project Lead)
- `STFL-DEMO-PTY-005`: Dr. Anwara Begum (Philanthropist - Major Donor)
- `STFL-DEMO-PTY-006`: Karim & Sons General Store (Retail Tenant - Lessee / Micro-merchant)

### 3.2 Dynamic Contextual Relationships
```
[Party: Haji Abdul Gafur Trust] ──(LANDLORD)──▶ [Property: Waqf Tower]
[Party: Green Delta Agro Ltd.] ──(LESSEE)──▶ [Unit: Commercial Space 4A]
[Party: Begum Rokeya Cooperative] ──(BORROWER)──▶ [Facility: Micro-Loan #402]
[Party: Engr. Kamal Hossain] ──(EMPLOYEE)──▶ [Org: STFL Projects Unit]
[Party: Dr. Anwara Begum] ──(DONOR)──▶ [Fund: Education Waqf Endowment]
[Party: Karim & Sons Store] ──(MERCHANT / VENDOR)──▶ [Platform: STFL E-Shop]
```

---

## 4. Waqf Property & Lease Hierarchy

Fictional property portfolio structured hierarchically:
- **Property:** `STFL-DEMO-PROP-001` (Gafur Heritage Tower, Motijheel C/A, Dhaka)
  - Type: Commercial Waqf Endowment
  - Valuation: ৳ 450,000,000
- **Units:**
  - `STFL-DEMO-UNIT-4A`: 2,400 sq.ft Office Suite (Occupied by Green Delta Agro)
  - `STFL-DEMO-UNIT-G01`: 850 sq.ft Retail Ground (Occupied by Karim & Sons)
  - `STFL-DEMO-UNIT-6B`: 1,800 sq.ft Office Space (Vacant / In-Review)
- **Leases:**
  - `STFL-DEMO-LSE-001`: Active 3-Year Commercial Lease (Green Delta Agro, Rent: ৳ 120,000/mo, Deposit: ৳ 360,000)
  - `STFL-DEMO-LSE-002`: Active 1-Year Retail Lease (Karim & Sons, Rent: ৳ 45,000/mo, Deposit: ৳ 90,000)

---

## 5. Microfinance & Disbursement Portfolio

- **Loan Facility:** `STFL-DEMO-MFI-001`
  - Borrower: Begum Rokeya Women's Cooperative (`STFL-DEMO-PTY-003`)
  - Amount: ৳ 150,000
  - Tenure: 12 months (Weekly installments)
  - Purpose: Community Seed & Fertilizer Distribution
  - Governance Rule: Requires Class 05 Officer initiation + Class 03 Finance disbursement (SoD enforced).

---

## 6. Governed Digital Documents

Representative demo documents showcasing the 7-state document lifecycle:
1. `STFL-DEMO-DOC-001` (Waqf Tower Deed of Endowment) — Status: `ACTIVE`
2. `STFL-DEMO-CER-002` (Commercial Tenancy Certificate) — Status: `ISSUED`
3. `STFL-DEMO-LSE-003` (Executed Lease Agreement 4A) — Status: `APPROVED`
4. `STFL-DEMO-VCH-004` (Qard-al-Hasan Disbursement Voucher) — Status: `DRAFT`
5. `STFL-DEMO-LET-005` (Superseded Maintenance Notice) — Status: `SUPERSEDED`
6. `STFL-DEMO-REV-006` (Revoked Vendor Clearance) — Status: `REVOKED`

All generated views and prints carry mandatory forensic marks:
`STFL DEMO — NON-PRODUCTION`

---

## 7. Governed Communication Templates

Fictional communication instances executed via simulated gateway:
- `STFL-DEMO-COM-001`: Tenancy Rent Demand Notice (WhatsApp / SMS simulated)
- `STFL-DEMO-COM-002`: Microfinance Installment Reminder (SMS simulated)
- `STFL-DEMO-COM-003`: Trustee Board Meeting Summons (Email simulated)

Each dispatch calculates an immutable anti-hallucination SHA-256 hash across template parameters before dispatch simulation.

---

## 8. Autonomous Agent Credentials & Budgets

- **Agent ID:** `STFL-DEMO-AGT-FIN-001`
  - Display Name: FinBot Alpha (Financial Reconciliation Agent)
  - Allowed Tools: `fetch_ledger_entries`, `compute_trial_balance`, `flag_discrepancies`
  - Authority Ceiling: Level 3 (Autonomous Analysis & Draft Generation)
  - Escalation Action: Level 4 (`execute_disbursement`) -> Enforces Human Approval Ticket
  - Minimum Confidence Threshold: `0.9800`
  - Daily Budget Limit: ৳ 50,000
