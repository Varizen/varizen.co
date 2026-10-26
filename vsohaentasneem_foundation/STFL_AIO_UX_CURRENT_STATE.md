# STFL AIO — UX Current State Archaeological Discovery & Audit

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-UX-AUDIT-V1`  
**Phase:** Phase 1 — Read-Only Discovery & Current State Analysis  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.  
*(ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি)*  

---

## 1. Archaeological Context & Discovery

The STFL digital ecosystem was engineered through a series of rigorous constitutional prompts establishing:
1. Cryptographic device binding & hardware attestation (`AndroidKeyStore`).
2. Exact decimal PostgreSQL financial ledgers (`NUMERIC(18,2)`).
3. Immutable append-only enterprise audit logs (`enterprise_audit_logs`).
4. Strict multi-tier approval policies with anti-collusion triggers.
5. Autonomous AI agent boundaries capped at Level 3 Authority.
6. 18 dedicated management consoles mapped to 13 user classes.

While this backend architecture is mathematically sound and cryptographically verifiable, the **frontend user experience remained console-centric and administrative**.

---

## 2. The Current Problem: Console-Centric Cognitive Load

### Current Primary Mental Model:
```
CONSOLES → PERMISSIONS → MODULES → RECORDS
```

In the current `/admin` landing page:
- The user is immediately greeted by **"STFL-DOC-2026-MGMT-BKND-V1 • 16/18 DEDICATED CONSOLES"**.
- A grid of administrative consoles is displayed: *IAM Center, Governance Center, Executive Command, Finance Control, Property Management, Microfinance, Workforce, E-Commerce, Projects, Assets, Documents, Communications, Security, Agents, Devices, System, Compliance, Knowledge*.
- Each card displays technical metadata: *Console ID, Access Badge (FULL, MANAGE, OVERSIGHT, DENIED), Primary Roles, Technical Scope*.
- The user is required to select a user class from a technical dropdown (`CLASS_00` to `CLASS_12`) and deduce which console holds their work.

### Critical Deficiencies for Human Operators:
1. **No Immediate Project Context:** A project manager running the *Education Access 2026* program in Sylhet cannot tell what project they are currently looking at without navigating into Console 09 (Projects) or Console 04 (Finance).
2. **Fragmented Workflows:** Answering *"How much did we spend on Education in Kurigram, what activities were completed, and how many students actually benefited?"* requires cross-referencing four independent consoles:
   - Console 09 (*Projects*) for activity records.
   - Console 04 (*Finance*) for expenditure vouchers.
   - Console 11 (*Documents*) for field inspection proofs.
   - Console 07 (*Workforce*) for assigned teacher stipends.
3. **No Direct/Indirect/Overhead Clarity:** Financial views show raw vouchers without calculating the essential ratio between **Direct Project Expenditure**, **Shared Operational Cost**, and **Administrative Overhead**.
4. **No Attention-First Priority:** Routine tickets and critical compliance holds are buried inside individual console tables rather than surfaced on a unified **My Work / Action Required** queue.

---

## 3. Inventory of Current UI Components & Routes

| Existing Route | Current Purpose | Problem Analysis | Redesign Target in Project-Centric Model |
| :--- | :--- | :--- | :--- |
| `/admin` | 18 Console Card Directory | Console overload for non-admin operators | Becomes **Management / Administration / Governed Consoles**; default landing shifts to **Portfolio** or **Active Project Workspace**. |
| `/admin/iam` | Identity & Access Center | Too technical for non-superadmins | Accessible under **Management → Administration → IAM**. |
| `/admin/projects` | Project & Agency Management | List of raw project records | Upgrades into the **Universal Project Workspace** (`/project/[id]/*`). |
| `/admin/finance` | Finance Control Center | Global chart of accounts | Refactored into **Project-Centric Finance** (Direct, Indirect, Overhead, Cost/Outcome). |
| `/admin/documents` | Document Control Center | Generic document issuance table | Retained at canonical route; contextualized under **Project → Documents**. |
| `/admin/compliance` | Compliance & Legal Console | 21 domains static table | Retained at canonical route; contextualized under **Project → Compliance**. |
| `/admin/knowledge` | Knowledge & Training Console | 4 experience segments | Retained at canonical route; contextualized under **Management → Knowledge**. |

---

## 4. Preservation Invariant

> **CRITICAL ARCHITECTURAL MANDATE:**  
> The redesign is an **Information Architecture, UX and Navigation** transformation.  
> The underlying security policies, contextual authorization checks (`evaluateClientConsoleAccess`), database schemas (`0001_init.sql`, `0002_aio_parties_iam.sql`), approval engine triggers, and Fastify API endpoints (`236/236 Vitest tests passing`) **MUST REMAIN 100% UNTOUCHED, ACTIVE AND AUTHORITATIVE**.  
> The new project-centric UX will sit on top of these verified engines.
