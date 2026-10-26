# STFL AIO — Demo Environment Security Boundary & Isolation Specification
**Document ID:** `STFL_AIO_DEMO_SECURITY_BOUNDARY.md`  
**Phase:** Prompt 12.5 (Live Development Demo / Preview Environment)  
**Status:** IMPLEMENTED & LOCALLY VERIFIED  
**Production Verification Status:** PENDING

---

## 1. Absolute Non-Production Boundary

The STFL AIO demonstration environment is designed under a **Zero Production Leakage** mandate. It operates as an impenetrable demonstration sandbox sitting strictly between local development and the formal production release gate (Prompt 13).

```
                      [DEMO ENVIRONMENT]
                              │
             ┌────────────────┴────────────────┐
             │                                 │
             ▼                                 ▼
   [SIMULATED DISPATCH]             [DETERMINISTIC DATA]
   - 0 Outbound SMS                 - Prefixed STFL-DEMO-*
   - 0 Outbound WhatsApp            - Isolated dev Postgres
   - 0 Outbound Email               - Safe Reset API
             │                                 │
             └────────────────┬────────────────┘
                              │
               ═════════════════════════════════
               ❌  AIR GAP: HARD SECURITY DENY  ❌
               ═════════════════════════════════
                              │
                              ▼
                     [PRODUCTION EDGE]
                     - https://stflbd.app
                     - Production PostgreSQL
                     - Real Mobile Gateways
                     - Real Bank / Payment APIs
```

---

## 2. Hard Security Boundaries & Proof of Non-Interference

### 2.1 Database & Storage Isolation
- **Rule:** The demo environment NEVER connects to production PostgreSQL databases, R2 storage buckets, or production secret managers.
- **Enforcement:** The demo API backend connects strictly to local PostgreSQL (`postgresql://stfl:stfl_dev_pw@127.0.0.1:5433/stfl`).
- **Proof:** All demo data queries and mutations are isolated. Production database strings are absent from the demo environment configuration.

### 2.2 Zero Outbound Network Egress for Communications
- **Rule:** The demo environment MUST NOT transmit real SMS, WhatsApp, or Email messages to real phone numbers or inboxes.
- **Enforcement:** All dispatches triggered via `POST /api/v1/demo/comms/send` or the Communications Console in demo mode route to the in-memory simulated provider. The response explicitly returns:
  ```json
  {
    "dispatchStatus": "SIMULATED_LOCAL_ONLY",
    "networkEgress": false,
    "forensicHash": "..."
  }
  ```
- **Proof:** Network egress socket connections to Twilio, Meta WhatsApp Cloud API, Infobip, or SMTP servers are completely bypassed.

### 2.3 Non-Production Document Watermarking & Controlled Printing
- **Rule:** No document generated, displayed, or printed from the demo environment may ever be mistaken for a legally binding production document.
- **Enforcement:**
  - All rendered documents display a prominent, non-removable banner:  
    `DEMO — NOT A PRODUCTION DOCUMENT`
  - Print grants issued in demo mode inject the diagonal forensic watermark:  
    `STFL DEMO — NON-PRODUCTION`
  - Print tokens adhere to the one-time atomic consumption rule with a 60-second TTL.
- **Steganography Clarification:** The visible forensic watermark and copy ID remain the primary forensic mechanism. The system does not rely on fragile steganographic claims across arbitrary photocopying, scanning, or distortion.

### 2.4 Autonomous Agent Security Ceiling & Human Approval Boundary
- **Rule:** AI Agents (`CLASS_10`) operate under a strict constitutional ceiling and can never execute irreversible or financial actions without human approval.
- **Enforcement:**
  - Tools are constrained to Level 0–3 (read, calculate, analyze, draft).
  - Any Level 4 or Level 5 action (e.g., `execute_disbursement`, `create_lease`, `modify_policy`) automatically produces decision: `ESCALATE` and creates an approval ticket requiring human sign-off.
  - Confidence ceiling: Any agent confidence score `< 0.9800` results in immediate `ESCALATE` or `DENY`.
  - Kill Switch: An emergency kill switch terminates agent activity in `< 50ms`.
  - Anti-Collusion: Agents cannot self-approve, approve other agents, or disburse funds.

### 2.5 Demo Token Rejection against Production
- **Rule:** Demo JWTs and session tokens must never authenticate against production endpoints.
- **Enforcement:** Demo tokens carry claims `isDemo: true`, `env: "demo"`, and are signed with non-production development secrets. The production edge gateway rejects non-production signatures and claims.

---

## 3. Safe Demo Reset Mechanism

To prevent state buildup and allow repeatable demonstrations, a dedicated reset endpoint is provided:

`POST /api/v1/demo/reset`

### Security Safeguards:
1. **Explicit Confirmation String Required:** The request payload must supply:
   ```json
   { "confirmReset": "CONFIRM_DEMO_RESET" }
   ```
   Omitting or mistyping this string immediately returns `HTTP 400 Bad Request`.
2. **Deterministic Record Scope:** The reset mechanism exclusively purges and re-seeds records matching the `STFL-DEMO-*` prefix.
3. **Audit Trail:** Every execution of the demo reset emits an immutable audit event (`DEMO_STATE_RESET`).

---

## 4. Hard Audit Proof Matrix

| Attack / Breach Vector | Simulated Attempt | Expected Result | Actual Result | Security Verdict |
|---|---|---|---|---|
| **Demo to Production DB** | Connect demo backend to prod DB URI | Connection Blocked | Local DB only | **PASS — SECURE** |
| **Outbound Communication** | Dispatch SMS to real mobile number | Network egress denied | `SIMULATED_LOCAL_ONLY` | **PASS — SECURE** |
| **Agent Self-Approve** | Agent attempts to approve own disbursement | `DENY` (Anti-collusion) | `ESCALATE` to human | **PASS — SECURE** |
| **Agent Confidence < 0.98** | Execute action with confidence = 0.95 | `ESCALATE` | Decision: `ESCALATE` | **PASS — SECURE** |
| **Agent Level-4 Action** | Agent executes `execute_disbursement` | `ESCALATE` | Approval ticket created | **PASS — SECURE** |
| **Cross-Unit Scope Access** | Finance user attempts Property lease creation | `DENY` (Scope violation) | Decision: `DENY` | **PASS — SECURE** |
| **Public Document Access** | Class 12 user queries private finance ledger | `DENY` (Class ceiling) | Decision: `DENY` | **PASS — SECURE** |
| **Accidental Demo Reset** | Call `/api/v1/demo/reset` without body | `HTTP 400 Bad Request` | `HTTP 400 Bad Request` | **PASS — SECURE** |
| **Print Grant Reuse** | Attempt second print with consumed token | `HTTP 403 Forbidden` | `HTTP 403 Forbidden` | **PASS — SECURE** |
| **Non-Standard Icon** | Introduce third-party icon library | Verification failure | 0 violations found | **PASS — SECURE** |
