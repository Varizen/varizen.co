# STFL AIO — Role Experience Matrix & User Class Projections

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-ROLE-UX-V1`  
**Phase:** Phase 5 — Role Experience & User Class Adaptations Matrix  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.  
*(ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি)*  

---

## 1. Constitutional Role Principle

> **UI IS A PROJECTION OF AUTHORIZATION. UI IS NOT A SECOND AUTHORIZATION SYSTEM.**

The application interface dynamically configures navigation menus, default landing pages, primary action buttons, KPI cards, and information visibility based on the server-evaluated authorization context:

$$\text{Experience} = \mathbf{F}(\text{Actor, Class, Role, Unit, Project, Scope, Device Security State})$$

---

## 2. Master Role Experience Matrix

| Class Code & Name | Primary Default Landing | Default Primary Navigation | Visible Project Facets | Visible Management Consoles | Restricted / Hidden Actions |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CLASS_00`**<br>Super Admin | **Portfolio & System Health** | Portfolio, Work, Management | Overview, Governance | System (16), IAM (01), Security (13), Devices (15) | **Barred from financial disbursements & lease creation (SoD)** |
| **`CLASS_01`**<br>Board / Trustee | **Portfolio Governance** | Portfolio, Work, Governance | Overview, Outcomes, Finance, Governance | Governance (02), Executive (03), Finance (04), Security (13) | Read-only operations; Level 5 dual-control approvals only |
| **`CLASS_02`**<br>Executive Command | **Executive Portfolio Pulse** | Portfolio, Project, Work, Management | All 9 Project Facets | Executive (03), Governance (02), Finance (04), Projects (09) | Cross-unit operational command & emergency relief |
| **`CLASS_03`**<br>Unit Head | **Unit Projects Hub** | Current Project, Work, Operations | Overview, Operations, Outcomes, Finance, People, Assets | Departmental console (Finance, Property, MF, or Workforce) | Bounded to assigned business unit & regional scopes |
| **`CLASS_04`**<br>Supervisor / Officer | **Current Project Operations** | Current Project, Work | Overview, Operations, Outcomes, People, Assets, Documents | Operational Consoles (Limited to operational tickets) | Approvals capped at ৳50,000; creator != approver |
| **`CLASS_05`**<br>Field Worker | **My Work & Today's Tasks** | Work (My Tasks, Submissions) | Operations (Assigned Tasks), Evidence | None (Irrelevant admin consoles hidden) | Financial approvals barred; transactions capped at ৳10,000 |
| **`CLASS_06`**<br>Finance Specialist | **Project Finance Hub** | Current Project (Finance), Work | Finance, Overview, Documents, Governance | Finance (04), Projects (09) | Independent reconciliation; creator != approver |
| **`CLASS_07`**<br>Security Officer | **Security & Device Command** | Work, Management (Control) | Compliance, Governance, Assets | Security (13), Devices (15), Compliance (17), Audit (02) | Hardware enclave device approvals; kill-switches |
| **`CLASS_08`**<br>Document Officer | **Document Control Hub** | Current Project (Docs), Work | Documents, Overview | Documents (11), Communications (12) | Official certificate issuance, template registration |
| **`CLASS_09`**<br>HR Specialist | **Workforce & Training Hub** | Current Project (People), Work | People, Operations | Workforce (07), Knowledge & Training (18) | Personnel records, stipend payroll, training verification |
| **`CLASS_10`**<br>System AI Agent | **Autonomous Task Ledger** | Edge API Task Queue | Scoped Project Datasets | Agents (14) (Self-metrics only) | **Capped at Level 3; zero high-risk self-approval** |
| **`CLASS_11`**<br>External Party | **Partner / Tenant Portal** | My Project, My Documents | Overview, Documents (Own records only) | None | Strict external isolation; self-service view only |
| **`CLASS_12`**<br>Public Verifier | **Verification Portal** | Public Route (`/verify/*`) | Public impact metrics | None | Internal metadata & PII strictly redacted |
| **`MODERATOR_A`**<br>Operational Relief | **Support Queue & Triage** | Work (Tickets), Management | Overview, Operations, Knowledge | Knowledge (18), Documents (11, read-only) | **Barred on IAM, System, Security & Funds mutation** |
| **`MODERATOR_B`**<br>Technical Relief | **Compliance Queue & Triage** | Work (Alerts), Management | Compliance, Documents, Knowledge | Compliance (17), Knowledge (18), Assets (10) | **Barred on IAM, System, Security & Funds mutation** |

---

## 3. The Universal "My Work" Area (Section 24)

Every human operator has a dedicated **My Work** space that eliminates administrative hunting:
- **My Tasks:** Actionable assignments, field survey mandates, document review deadlines.
- **Pending Approvals:** Filtered by the user's specific authority threshold (e.g. Finance Officer sees vouchers ≤ ৳50,000; Executive sees items ≤ ৳1,000,000).
- **Attention Alerts:** Color-coded severity banners:
  - `RED (CRITICAL):` Compliance hold active, budget overrun risk, compromised device attestation.
  - `AMBER (WARNING):` Milestone overdue, pending approval > 48h, teacher vacancy.
  - `BLUE (INFO):` New field proof submitted, scheduled agent reconciliation completed.
- **Governed Messages:** In-app inbox receiving verified template dispatches.
