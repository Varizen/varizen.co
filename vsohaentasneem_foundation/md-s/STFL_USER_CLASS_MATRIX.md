# STFL AIO — User Class Access & Responsibility Matrix

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-CLS-MAT-V1`  
**Date:** 2026-10-15  
**Status:** SPECIFICATION — RATIFIED (PHASE 0B)  
**Security Level:** INTERNAL USE ONLY

---

## 1. System Console vs. User Class Authority Matrix

The STFL platform decomposes administrative operations into 16 distinct management consoles. Access is governed by server-side policy rules evaluated against the caller's verified User Class, active Role, and operational Scope.

### Access Levels:
* **FULL**: Complete read, write, configuration, and unit-level administrative control.
* **MANAGE**: Read, write, and execute operational workflows; cannot alter foundational security policies.
* **OVERSIGHT**: Comprehensive read-all and audit access; high-level approval authority; no routine data-entry.
* **OPERATIONAL**: Standard day-to-day data entry, review, and permitted task execution within assigned scope.
* **FIELD**: Task-driven mobile execution interface; access restricted exclusively to assigned field queues.
* **LIMITED**: Restricted access to self-service or strictly designated functional records.
* **ISSUE\***: Authority to draft or issue documents strictly subject to verified source contracts.
* **OWN**: Read access restricted exclusively to audit events or records initiated by the caller.
* **—**: Zero access (HTTP 403 Forbidden enforced at API gateway).

---

## 2. Master Console Access Matrix

| Management Console | Class 00 (Super Admin) | Class 01 (Trustee) | Class 02 (Executive) | Class 03 (Unit Head) | Class 04 (Officer) | Class 05 (Field Worker) | Class 06 (Finance) | Class 07 (Security) | Class 08 (Docs) | Class 09 (HR) | Class 10 (AI Agent) | Class 11 (External) | Class 12 (Public) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **1. Governance Center** | Limited | **FULL** | Manage | Read (Unit) | — | — | Read | Oversight | — | — | — | — | — |
| **2. Executive Command** | Oversight | Oversight | **FULL** | Read (Unit) | — | — | Read | Oversight | — | — | Read | — | — |
| **3. Finance Control** | Limited\* | Oversight | Manage | Manage\* | Operational | Limited | **FULL** | Audit | — | Read (Payroll) | Task Tools | Self (Receipts) | — |
| **4. Property Management** | — | Oversight | Manage | **FULL** | Operational | Field | Read | — | Issue\* | — | Task Tools | Self (Tenant) | — |
| **5. Microfinance Center** | — | Oversight | Manage | **FULL** | Operational | Field (Collect) | Read | — | Issue\* | — | Task Tools | Self (Borrower) | — |
| **6. Workforce Center (HR)** | — | Oversight | Manage | Manage (Unit) | Operational | Self (Duty) | Read (Stipend) | — | Issue\* | **FULL** | Task Tools | Self (Applicant)| — |
| **7. E-Commerce Ops** | — | Oversight | Manage | **FULL** | Operational | Field (Deliver)| Read | — | — | — | Task Tools | Self (Customer)| — |
| **8. Projects & Agency** | — | Oversight | Manage | **FULL** | Operational | Field (Survey) | Read | — | Issue\* | — | Task Tools | Self (Partner) | Public Stories |
| **9. Asset Management** | Limited | Oversight | Manage | Manage (Unit) | Operational | Field (Audit) | Read | — | — | — | Task Tools | — | — |
| **10. Document Control** | — | Oversight | Manage | Manage (Unit) | Operational | — | Read | Audit | **FULL** | Issue\* | Draft Tools | Self (Docs) | Public Verify |
| **11. Communications** | Limited | Oversight | Manage | Manage (Unit) | Operational | — | Read | Audit | — | — | Template Tools | Inbound/SMS | — |
| **12. Security & Audit** | Limited\* | Oversight | Oversight | Read (Own Unit)| Own Events | Own Events | Read (Fin Audit)| **FULL** | Audit | Read (Access) | Audit Logged | — | — |
| **13. Agent Control** | Manage | Oversight | Manage | Manage (Unit) | — | — | — | **FULL** (Kill/Audit)| — | — | Self (Heartbeat)| — | — |
| **14. Device Management** | Manage | Oversight | — | Read (Unit) | — | Self (Binding) | — | **FULL** | — | — | — | — | — |
| **15. Identity & Access** | **FULL** | Oversight | Manage | Read (Unit) | — | — | — | Oversight | — | Manage (Staff)| — | — | — |
| **16. System Admin** | **FULL** | — | — | — | — | — | — | Audit | — | — | — | — | — |

`*` Notes on Gated Operations:
- *Super Admin (Class 00)* cannot approve financial disbursements or alter transactional accounting ledgers (`Limited*`).
- *Unit Heads (Class 03)* manage finance only within their designated unit budgets.
- *Document Officers (Class 08)* issue documents strictly when a verified source contract (lease, loan, resolution) exists.

---

## 3. Server-Side Policy Storage Architecture

This matrix is **not** hard-coded into client-side web or mobile code. It is materialized in PostgreSQL 16 and evaluated dynamically by Hono middleware:

```sql
CREATE TABLE IF NOT EXISTS iam_console_policies (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    console_code         TEXT NOT NULL,                 -- e.g. FINANCE_CONTROL, PROPERTY_MGMT
    user_class           TEXT NOT NULL,                 -- e.g. CLASS_01, CLASS_03, etc.
    access_level         TEXT NOT NULL CHECK (access_level IN (
                           'FULL', 'MANAGE', 'OVERSIGHT', 'OPERATIONAL', 
                           'FIELD', 'LIMITED', 'ISSUE_GATED', 'OWN_EVENTS', 'DENIED'
                         )),
    conditions_json      JSONB NOT NULL DEFAULT '{}'::jsonb, -- e.g. {"requires_unit_match": true}
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT console_policy_unique UNIQUE (console_code, user_class)
);
```

### Dynamic Enforcement Middleware Rule
When an authenticated session requests access to a management console route (e.g. `/api/v1/property/*`):
1. The API extracts `user.class` and `user.roles` from the verified JWT.
2. The middleware queries `iam_console_policies` where `console_code = 'PROPERTY_MGMT'` and `user_class = user.class`.
3. If `access_level` is `DENIED` or missing, the gateway emits `403 Forbidden` with an audit event recorded in `audit_logs`.
4. If `conditions_json` demands unit matching (e.g. `requires_unit_match`), the caller's assigned unit is validated against the target resource's owning unit.
