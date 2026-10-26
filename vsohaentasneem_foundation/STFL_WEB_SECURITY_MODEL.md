# STFL Web Security & Authorization Architecture Model
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Core Domain:** Defense-in-Depth, Contextual Authorization, and Data Privacy  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Foundational Security Rule

> **The Web UI is a projection of authorization. The Web UI is NOT the authorization engine.**

The backend (Cloudflare Worker API + PostgreSQL/RLS) is the single authoritative source of truth for authorization:
- Client-side checks are purely for UX ergonomics (e.g., greying out buttons or presenting explanation modals).
- Hiding a button or manipulating local storage state will **never** bypass server-side policy enforcement.
- Every mutating request to `https://stflbd.app/api/v1` is cryptographically validated with signed session tokens and strict permission assertions.

---

## 2. Contextual Authorization States

The frontend consumes authorization evaluations and renders UI elements across six contextual states:

```
[ACTOR + CLASS + ROLE + UNIT + PROJECT + RESOURCE + ACTION + SCOPE + RISK + AMOUNT]
                                     ↓
                     BACKEND POLICY EVALUATION
                                     ↓
    ┌────────────────────────────────────────────────────────┐
    │  • VISIBLE          (Permitted to view and execute)    │
    │  • DISABLED         (Visible for transparency, locked) │
    │  • HIDDEN           (Unauthorized, completely omitted) │
    │  • REQUIRES APPROVAL (Triggers dual-custody workflow)  │
    │  • REQUIRES STEP-UP  (Prompts for biometric/2FA key)   │
    │  • BLOCKED          (Statutory or security prohibition)│
    └────────────────────────────────────────────────────────┘
```

---

## 3. User Classes & Permission Hierarchy

| User Class | Description | Scope of Authority |
|---|---|---|
| `CLASS_00` | Platform Super Admin | Emergency platform recovery, infrastructure health, disaster recovery. |
| `CLASS_01` | Trustee / Board Member | Institutional governance, board resolutions, macro budget approval. |
| `CLASS_02` | Executive Management | Day-to-day operations, strategic portfolio oversight, cross-project reviews. |
| `CLASS_03` | Unit Head | Specific programmatic pillar oversight (Education, Health, Property). |
| `CLASS_04` | Supervisor / Field Officer | Field team dispatch, local voucher generation, beneficiary intake. |
| `CLASS_05` | Field Worker / Volunteer | Direct service delivery, survey data collection, kit distribution. |
| `CLASS_06` | Finance / Control Specialist | Ledger reconciliation, voucher verification, payment settlement. |
| `CLASS_07` | Security & Audit Officer | Threat inspection, cryptographic hash verification, audit logs. |
| `CLASS_08` | Document / Records Officer | Institutional archiving, document status updates (`ISSUED`, `REVOKED`). |
| `CLASS_09` | HR & Workforce Admin | Staff onboarding, duty assignment, training records. |
| `CLASS_10` | System Agent (Autonomous AI) | Level 1–3 autonomous calculations, draft generation, monitoring. |
| `CLASS_11` | External Stakeholder | Project partner, external auditor, cooperative representative. |
| `CLASS_12` | Public Verification User | Read-only public verification of documents, certificates, and receipts. |

---

## 4. Public Data Privacy & Minimal Disclosure Protocol

In compliance with the Bangladesh Data Protection Act and international privacy frameworks:
1. **Zero Public PII Exposure:** National IDs (NID), private phone numbers, home addresses, bank account numbers, and device fingerprints are **never** rendered on public pages or unauthenticated APIs.
2. **Minimal Safe Verification (`/verify`):**
   - **Exposed:** Document ID, Document Type, Issue Date, Cryptographic Hash Status (`VALID` / `REVOKED`), Issuing Officer Title.
   - **Redacted:** Full personal identity of vulnerable beneficiaries, exact disbursement amounts (unless public donor reporting requires), private notes.
3. **No Third-Party Trackers:** Zero Google Analytics, Facebook Pixels, or ad-tech scripts. The site operates on a zero-tracking privacy architecture.
4. **XSS Protection:** Pure React JSX rendering. Zero unsanitized `dangerouslySetInnerHTML`, zero `eval()`, zero inline executable scripts.
