# STFL AIO — Compliance & Regulatory Management Console Specification
**Document Identity:** `STFL-DOC-2026-CMP-CON-V1`  
**Phase:** Prompt 12.5 Extension (Compliance, Regulatory & Legal Intelligence Layer)  
**Status:** SPECIFICATION ONLY — RATIFIED (READ-ONLY ARCHITECTURE PHASE)  
**Security Classification:** INTERNAL ENTERPRISE SPECIFICATION  
**Authoritative Precedent:** Extends `STFL_USER_CLASS_MATRIX.md` and `STFL_MANAGEMENT_BACKENDS.md`

---

## 1. Console Mission & Route Placement

The **Compliance & Regulatory Management Console** represents the dedicated operational interface for institutional legal counsel, compliance inspectors, statutory auditors, and trustees. 

- **Canonical Route:** `/admin/compliance`
- **Access Authority:**
  - `CLASS_01` (Trustee): Full Oversight & Board Dual-Control Override
  - `CLASS_02` (Executive Director): Full Executive Management & Review Authority
  - `CLASS_08` (Legal & Records Officer): Primary Case Investigator & Advice Sign-Off
  - `CLASS_00` (Super Admin): System Health & Rule Registry Administration (Zero legal override)
  - Other Classes: Denied (`403 Forbidden`)

---

## 2. Dashboard Information Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ STFL AIO — COMPLIANCE & REGULATORY INTELLIGENCE CONSOLE                │
├────────────────────────────────────────────────────────────────────────┤
│ [ Active Context: STFL Consolidated ] [ Jurisdiction: Bangladesh ]     │
├───────────────────────────────────┬────────────────────────────────────┤
│ 🚨 ACTIVE STATUTORY HOLDS: 2      │ ⚖️ OPEN LEGAL CASES: 5             │
│ ⚠️ HIGH-RISK ALERTS: 8            │ ⏳ EXPIRING LICENSES (30d): 3      │
├───────────────────────────────────┴────────────────────────────────────┤
│ MULTI-FACTOR COMPLIANCE HEALTH MATRIX (Zero Simplistic Single Scores): │
│ • Labour & Working Time Compliance:        98.4% [COMPLIANT]           │
│ • Waqf & Real Estate Title Chain:          94.2% [2 PENDING AUDITS]    │
│ • Tax & Withholding Deduction Accuracy:   100.0% [FULLY RECONCILED]    │
│ • Statutory Trade & Fire Licensing:        91.0% [3 EXPIRING SOON]     │
│ • Anti-Corruption / Procurement Ceilings:  99.1% [COMPLIANT]           │
├────────────────────────────────────────────────────────────────────────┤
│ RECENT COMPLIANCE CASES REQUIRING HUMAN COUNSEL ATTENTION:             │
│ 1. CAS-2026-0041: Timber Procurement > PPR Limit (Agro Project) [HOLD] │
│ 2. CAS-2026-0038: Overtime Exceeded 60 hrs/week (Clinic Shift)  [HOLD] │
│ 3. CAS-2026-0035: Waqf Lease Advance Rent Dispute (Tower 4A)   [IN_REV]│
├────────────────────────────────────────────────────────────────────────┤
│ REGULATORY CHANGE WATCH (National Gazettes & SROs):                    │
│ • NBR SRO 182/2026: Revision of Commercial Withholding Tax [NEW GAZE] │
│ • DIFE Circular 4/2026: Factory Emergency Heatwave Rest Hours [ADVISE] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dedicated Case Investigation Workspace

Clicking any case (e.g. `CAS-2026-0041`) opens the **Legal Case Deliberation Workspace**:
1. **Triggering Context:** Action verb, initiating officer, project ID, target voucher, monetary amount.
2. **Statutory Grounds:** Exact statutory citations (e.g. *Public Procurement Rules 2008, Rule 69(1)*), effective date, and primary source gazette download link.
3. **Automated Diagnostic Vector:** Machine calculation vs statutory threshold, four-factor confidence breakdown (`Composite: 0.9920`).
4. **Evidence Dossier:** Linked procurement quotes, vendor bids, and site inspection photos.
5. **Human Action Controls (Authorized Counsel Only):**
   - `[Request Additional Evidence from Project Director]`
   - `[Log Formal Written Legal Advice]`
   - `[Clear Hold — Authorize Action under Counsel Seal]`
   - `[Reject Action — Confirm Statutory Prohibition]`
   - `[Escalate to Board of Trustees for Dual-Control Override]`

---

## 4. Proposed REST API Contract Specification

```text
GET    /api/v1/compliance/dashboard/summary
GET    /api/v1/compliance/alerts
POST   /api/v1/compliance/alerts/:alertId/acknowledge
GET    /api/v1/compliance/cases
GET    /api/v1/compliance/cases/:caseId
POST   /api/v1/compliance/cases/:caseId/advice
POST   /api/v1/compliance/cases/:caseId/clear
POST   /api/v1/compliance/cases/:caseId/reject
POST   /api/v1/compliance/cases/:caseId/override
GET    /api/v1/compliance/rules
POST   /api/v1/compliance/rules
GET    /api/v1/compliance/changes
POST   /api/v1/compliance/changes/:changeId/evaluate-impact
```

---

## 5. Iconography & Design Compliance

In strict alignment with the STFL design system:
- **Icons:** Solely and exclusively imported from `iconoir-react` (e.g. `ShieldCheck`, `Scale`, `WarningTriangle`, `Page`, `Lock`, `CheckCircle`). Zero third-party icon libraries.
- **Typography:** Headings in `Hind Siliguri`, body in `Inter`.
- **Bilingual Interface:** Full localization support for English and Bengali.
