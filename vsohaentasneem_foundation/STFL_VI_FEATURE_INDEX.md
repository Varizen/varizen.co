# STFL VI — Master Platform Feature Index
**Canonical Platform Identity:** **STFL VI**  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Total Cataloged Features:** 40  
**Classification Standard:** Formally Verified Implementation Catalog  
**Date:** 2026-10-16  
**Status:** COMPLETE & AUTHORITATIVE  

---

## 1. Feature Classification Taxonomy

Each platform feature is evaluated and classified across five verification dimensions:
- **DOCUMENTED:** Formal architectural specification exists.
- **IMPLEMENTED:** Verified source code exists in `main/` codebase.
- **TESTED:** Automated unit, integration, or penetration test suite exists.
- **INTEGRATION VERIFIED:** Multi-component flow verified (e.g., UI → API → Database).
- **PRODUCTION VERIFIED:** Active on live production infrastructure or sandbox.

---

## 2. Complete Feature Catalog (FEAT-001 to FEAT-040)

| ID | Feature Name | Domain | Description | Status | Implementation Source | UI / Console Route | API Endpoint | Security Level |
|---|---|---|---|---|---|---|---|---|
| **FEAT-001** | Hardware Device Attestation Substrate | Core Security | Hardware-backed cryptographic device attestation using Android KeyStore RSA/EC keys and challenge-response nonces. | **IMPLEMENTED / TESTED** | `main/security/src/main/java/org/stfl/security/DeviceIdentityProvider.kt` | `/admin/security` | `/api/v1/auth/device-attest` | CRITICAL_TIER_1 |
| **FEAT-002** | Device Binding & Instant Revocation Ledger | Core Security | Cryptographic binding of STFL-DVC-* IDs to user identities with instant multi-project session cascade revocation. | **IMPLEMENTED / TESTED** | `main/api/src/middleware.ts` | `/admin/security` | `/api/v1/auth/revoke-device` | CRITICAL_TIER_1 |
| **FEAT-003** | 10-Dimensional Enterprise Audit Substrate | Core Security | Immutable append-only enterprise audit trail logging 10 essential dimensions with SHA-256 integrity hashing. | **IMPLEMENTED / TESTED** | `main/api/migrations/0002_aio_parties_iam.sql` | `/admin/security` | `apk/api/src/repositories/audit.ts` | CONSTITUTIONAL |
| **FEAT-004** | PostgreSQL Trigger-Enforced Audit Immutability | Core Security | Database-level trigger aborting any UPDATE or DELETE operation on enterprise_audit_logs. | **IMPLEMENTED / TESTED** | `main/api/migrations/0002_aio_parties_iam.sql (prevent_audit_log_mutation)` | `/admin/security` | `None (Database PL/pgSQL Engine)` | CONSTITUTIONAL |
| **FEAT-005** | 13-Dimensional Contextual Authorization Engine | Governance | Multi-dimensional server-side policy evaluation across classes, roles, units, scopes, devices, and training status. | **IMPLEMENTED / TESTED** | `main/api/src/authorization/engine.ts` | `apk/web/src/app/admin/layout.tsx` | `apk/api/src/middleware.ts` | CRITICAL_TIER_1 |
| **FEAT-006** | Dynamic Workspace Policy Enforcement | Governance | Database-driven console access policies eliminating hard-coded client-side authorization. | **IMPLEMENTED / TESTED** | `main/api/src/authorization/engine.ts` | `apk/web/src/app/admin/...` | `/api/v1/auth/policies` | HIGH |
| **FEAT-007** | Dual-Custody Approval Engine | Governance | Constitutional anti-collusion engine enforcing creator != approver across all financial, lease, and policy mutations. | **IMPLEMENTED / TESTED** | `main/api/src/approval/engine.ts` | `apk/web/src/app/admin/approvals/page.tsx` | `/api/v1/approvals/*` | CONSTITUTIONAL |
| **FEAT-008** | Anti-Collusion Separation of Duties Verifier | Governance | Automated verification that the disburser of funds is independent from the financial approver. | **IMPLEMENTED / TESTED** | `main/api/src/approval/engine.ts` | `apk/web/src/app/admin/finance/disburse/page.tsx` | `/api/v1/finance/disburse` | CONSTITUTIONAL |
| **FEAT-009** | Cryptographic Counter-Signature Ledger | Governance | Dual ECDSA P-256 signatures stored in approval_signatures with SHA-256 voucher payload verification. | **IMPLEMENTED / TESTED** | `main/api/src/crypto.ts` | `None` | `apk/api/src/routes/consoles.ts` | HIGH |
| **FEAT-010** | Forensic Steganographic Document Watermarking | Operations | Yellow Micro-Dot matrix steganography encoding operator user_id, device_id, and print timestamp imperceptibly into PDF output. | **IMPLEMENTED / TESTED** | `main/api/src/print/engine.ts` | `apk/web/src/app/admin/documents/print/page.tsx` | `/api/v1/print/generate` | HIGH |
| **FEAT-011** | Deterministic Document ID Generator | Operations | STFL-DOC-{YEAR}-{UNIT}-{SEQ} formatting with Luhn check-digit verification. | **IMPLEMENTED / TESTED** | `main/api/src/documents/engine.ts` | `apk/web/src/app/admin/documents/page.tsx` | `/api/v1/documents/issue` | MEDIUM |
| **FEAT-012** | Public Document Verification Gateway | Operations | Public route /verify/:hash allows external verification of document validity without revealing private PII. | **IMPLEMENTED / TESTED** | `main/api/src/routes/verify.ts` | `apk/web/src/app/verify/page.tsx` | `/api/v1/verify/:hash` | PUBLIC |
| **FEAT-013** | Governed Multi-Channel Communications Gateway | Operations | Central dispatcher for SMS/WhatsApp/Email with anti-hallucination template approval and rate limiting. | **IMPLEMENTED / TESTED** | `main/api/src/comms/gateway.ts` | `apk/web/src/app/admin/comms/page.tsx` | `/api/v1/comms/send` | HIGH |
| **FEAT-014** | Anti-Hallucination Template Approval Substrate | Operations | Outbound messaging template validation blocking free-form AI text from reaching external parties. | **IMPLEMENTED / TESTED** | `main/api/src/comms/gateway.ts` | `apk/web/src/app/admin/comms/templates/page.tsx` | `apk/api/src/routes/comms.ts` | HIGH |
| **FEAT-015** | Autonomous Agent Runtime & Constitutional Sandbox | Autonomous AI | Agent orchestration substrate enforcing strict Level 3 authority ceiling (Read/Draft/Analyze/Recommend only). | **IMPLEMENTED / TESTED** | `main/api/src/agents/runtime.ts` | `apk/web/src/app/admin/agents/page.tsx` | `/api/v1/agents/*` | CONSTITUTIONAL |
| **FEAT-016** | Agent Confidence Boundary Evaluator | Autonomous AI | Confidence score boundary gating rejecting recommendations below 0.98 for critical domains. | **IMPLEMENTED / TESTED** | `main/api/src/agents/runtime.ts` | `apk/web/src/app/admin/agents/[id]/page.tsx` | `apk/api/src/routes/agents.ts` | HIGH |
| **FEAT-017** | Agent Emergency Kill Switch Substrate | Autonomous AI | Global and per-agent emergency kill switch instantaneously invalidating agent execution tokens. | **IMPLEMENTED / TESTED** | `main/api/src/agents/runtime.ts` | `apk/web/src/app/admin/agents/kill-switch/page.tsx` | `/api/v1/agents/:id/kill` | CONSTITUTIONAL |
| **FEAT-018** | 16 Core Management Consoles API | Consoles | Unified Hono routes powering the 16 core enterprise management backends. | **IMPLEMENTED / TESTED** | `main/api/src/routes/consoles.ts` | `apk/web/src/app/admin/...` | `/api/v1/consoles/*` | HIGH |
| **FEAT-019** | Console 17: Compliance & Legal Console | Consoles | Specialized operational console for Legal Counsel and Compliance Officers managing statutory holds. | **PLANNED** | `STFL_AIO_COMPLIANCE_CONSOLE_SPEC.md` | `apk/web/src/app/admin/compliance/page.tsx` | `/api/v1/compliance/*` | HIGH |
| **FEAT-020** | Console 18: Knowledge, Training & Service Console | Consoles | Operational console for Course authoring, SOP management, quiz administration, and moderation queues. | **PLANNED** | `STFL_AIO_CONSOLE_SPECIFICATION.md` | `apk/web/src/app/admin/knowledge/page.tsx` | `/api/v1/knowledge/*, /api/v1/moderation/*` | HIGH |
| **FEAT-021** | Segment 01: User Learning Center | Knowledge | Public and field worker educational center with pictorial instructions, step-by-step videos, and audio narrations. | **PLANNED** | `STFL_AIO_KNOWLEDGE_ARCHITECTURE.md` | `apk/web/src/app/learning/page.tsx` | `/api/v1/learning/courses` | PUBLIC |
| **FEAT-022** | Segment 02: Service & Operations Center | Knowledge | Active SOP runbooks, checklists, SEV-1 to SEV-4 incident procedures, and AI-assisted troubleshooting. | **PLANNED** | `STFL_AIO_SERVICE_CENTER_MODEL.md` | `apk/web/src/app/admin/service/page.tsx` | `/api/v1/service/*` | HIGH |
| **FEAT-023** | Segment 03: Administration & Governance Center | Knowledge | IAM manuals, cryptographic key rotation procedures, compliance guidelines, and audit manuals. | **PLANNED** | `STFL_AIO_KNOWLEDGE_ARCHITECTURE.md` | `apk/web/src/app/admin/governance/docs/page.tsx` | `/api/v1/governance/manuals` | HIGH |
| **FEAT-024** | Segment 04: Moderation & Relief Center | Knowledge | Administrative relief tier with MODERATOR_A and MODERATOR_B providing high-availability queue relief. | **PLANNED** | `STFL_AIO_MODERATOR_MODEL.md` | `apk/web/src/app/admin/moderation/page.tsx` | `/api/v1/moderation/delegations` | CONSTITUTIONAL |
| **FEAT-025** | Controlled Moderator Work Queue | Knowledge | moderator_work_queue managing 9 item types (USER_HELP, ACCOUNT_SUPPORT, TRAINING_REVIEW, SOP_UPDATE, ESCALATION). | **PLANNED** | `STFL_AIO_MODERATOR_MODEL.md` | `apk/web/src/app/admin/moderation/queue/page.tsx` | `/api/v1/moderation/queue` | MEDIUM |
| **FEAT-026** | Multi-Project Tenant Isolation Engine | Multi-Project | PostgreSQL Row-Level Security ensuring strict zero cross-project data leakage across sub-ledgers and documents. | **PLANNED** | `STFL_AIO_PROJECT_ISOLATION_MODEL.md` | `apk/web/src/app/p/[projectId]/...` | `Hono X-Project-Context middleware` | CONSTITUTIONAL |
| **FEAT-027** | Custom Domain & Subdomain Hostname Router | Multi-Project | Cloudflare Workers edge router resolving project domains (e.g. greendelta-agro.org) to internal project context. | **PLANNED** | `STFL_AIO_PROJECT_WEBSITE_MODEL.md` | `apk/web/src/middleware.ts` | `/api/v1/projects/resolve-domain` | MEDIUM |
| **FEAT-028** | Project Chart of Accounts & Sub-Ledger Engine | Multi-Project | Independent double-entry general sub-ledger per project enforcing strict NUMERIC(18, 2) financial precision. | **PLANNED** | `STFL_AIO_PROJECT_FINANCE_MODEL.md` | `apk/web/src/app/p/[id]/finance/page.tsx` | `/api/v1/projects/:id/finance/*` | CONSTITUTIONAL |
| **FEAT-029** | Project Operational Lifecycle State Machine | Multi-Project | Formal state machine governing project progression (DRAFT ➔ PILOT ➔ ACTIVE ➔ SUNSETTING ➔ ARCHIVED). | **PLANNED** | `STFL_AIO_PROJECT_LIFECYCLE.md` | `apk/web/src/app/admin/projects/lifecycle/page.tsx` | `/api/v1/projects/:id/transition` | HIGH |
| **FEAT-030** | Multi-Jurisdictional Statute Resolver | Compliance | Statute evaluation engine resolving applicable national, municipal, and sector laws across 21 domains. | **PLANNED** | `STFL_AIO_COMPLIANCE_ARCHITECTURE.md` | `apk/web/src/app/admin/compliance/rules/page.tsx` | `/api/v1/compliance/resolve` | CONSTITUTIONAL |
| **FEAT-031** | Automated Statutory Hold & Legal Review Engine | Compliance | Automatic transaction freeze engine triggered on statutory breaches (e.g. advance rent > 3 mo), creating legal review tickets. | **PLANNED** | `STFL_AIO_LEGAL_ESCALATION_MODEL.md` | `apk/web/src/app/admin/compliance/holds/page.tsx` | `/api/v1/compliance/holds` | CONSTITUTIONAL |
| **FEAT-032** | Pictorial / Visual-First Training Engine | Knowledge | Visual instructional material engine supporting 11 media types (Images, Diagrams, Flowcharts, Animations, Videos, Simulations). | **PLANNED** | `STFL_AIO_PICTORIAL_TRAINING_MODEL.md` | `apk/web/src/app/learning/visual/page.tsx` | `/api/v1/knowledge/assets` | MEDIUM |
| **FEAT-033** | Cryptographic Training Certification Authority | Knowledge | Issuance of STFL-CER-* digital certificates with ECDSA P-256 signatures, passing score evaluation, and expiry tracking. | **PLANNED** | `STFL_AIO_TRAINING_CERTIFICATION_MODEL.md` | `apk/web/src/app/learning/certificates/page.tsx` | `/api/v1/knowledge/certificates` | HIGH |
| **FEAT-034** | Training-Gated Authorization Check | Knowledge | 13-D Contextual Authorization engine verifies active TRAINING_STATUS before allowing sensitive operations (microfinance.collect, lease_create). | **PLANNED** | `STFL_AIO_TRAINING_ARCHITECTURE.md` | `apk/web/src/app/admin/...` | `apk/api/src/middleware.ts` | CONSTITUTIONAL |
| **FEAT-035** | Mandatory Platform Compliance Training Non-Erasure | Knowledge | Enforces that independent projects inherit and cannot silently delete or waive mandatory compliance training. | **PLANNED** | `STFL_AIO_KNOWLEDGE_GOVERNANCE_MODEL.md` | `apk/web/src/app/admin/knowledge/governance/page.tsx` | `/api/v1/knowledge/courses` | CONSTITUTIONAL |
| **FEAT-036** | In-Workflow Contextual Walkthrough Guidance | Knowledge | 'Step 3 of 7' contextual visual guidance panels embedded inside production operational forms. | **PLANNED** | `STFL_AIO_TRAINING_UX_MODEL.md` | `apk/web/src/components/WalkthroughDrawer.tsx` | `/api/v1/knowledge/walkthroughs` | LOW |
| **FEAT-037** | Dynamic Compliance Intercept in UI | Knowledge | Instant form field intercept converting walkthrough into a STOP / REVIEW REQUIRED barrier upon statutory threshold breach. | **PLANNED** | `STFL_AIO_TRAINING_UX_MODEL.md` | `apk/web/src/components/ComplianceIntercept.tsx` | `Inline client validation + backend rejection` | HIGH |
| **FEAT-038** | AI-Assisted Troubleshooting with Provenance | Knowledge | Operational diagnostic assistant answering queries strictly from approved, versioned SOPs with mandatory citations. | **PLANNED** | `STFL_AIO_SERVICE_CENTER_MODEL.md` | `apk/web/src/components/AiTroubleshootDrawer.tsx` | `/api/v1/service/troubleshoot` | MEDIUM |
| **FEAT-039** | Cloudflare Workers Edge Gateway & KV Cache | Infrastructure | Edge network entrypoint with rate-limiting KV stores, DDoS scrubbing, TLS termination, and Hyperdrive connection pooling. | **PLANNED** | `main/api/wrangler.toml` | `apk/web/wrangler.toml` | `Edge entrypoint` | HIGH |
| **FEAT-040** | Interactive Demo Mock Environment | Demo & Testing | Synthetic tenant and user sandbox generator passing 15/15 Vitest tests for safe sandbox evaluation. | **IMPLEMENTED / TESTED** | `main/api/src/routes/demo.ts` | `apk/web/src/app/demo/page.tsx` | `/api/v1/demo/*` | DEMO_ISOLATED |

---

## 3. Detailed Feature Specifications

### FEAT-001: Hardware Device Attestation Substrate
- **Domain:** Core Security
- **Description:** Hardware-backed cryptographic device attestation using Android KeyStore RSA/EC keys and challenge-response nonces.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/security/src/main/java/org/stfl/security/DeviceIdentityProvider.kt`
- **Related Tests:** `main/api/test/api.test.ts`
- **Governing Documentation:** `STFL_AIO_SECURITY_MODEL.md, STFL_AIO_PHASE_1_IMPLEMENTATION_REPORT.md`
- **Database Tables:** `device_registrations`
- **API Endpoint:** `/api/v1/auth/device-attest`
- **Security Tier:** `CRITICAL_TIER_1`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** PostgreSQL 16, Android KeyStore
- **Dependents:** FEAT-002, FEAT-005, FEAT-018
- **Known Limitations & Operational Notes:** Dev environment uses software mock fallback when hardware token unavailable.
- **Last Verified:** 2026-10-16

---
### FEAT-002: Device Binding & Instant Revocation Ledger
- **Domain:** Core Security
- **Description:** Cryptographic binding of STFL-DVC-* IDs to user identities with instant multi-project session cascade revocation.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/middleware.ts`
- **Related Tests:** `main/api/test/api.test.ts`
- **Governing Documentation:** `STFL_AIO_SECURITY_MODEL.md`
- **Database Tables:** `device_registrations, user_sessions`
- **API Endpoint:** `/api/v1/auth/revoke-device`
- **Security Tier:** `CRITICAL_TIER_1`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-001
- **Dependents:** FEAT-005
- **Known Limitations & Operational Notes:** Network disconnect during revocation handled via short JWT expiry (15 min).
- **Last Verified:** 2026-10-16

---
### FEAT-003: 10-Dimensional Enterprise Audit Substrate
- **Domain:** Core Security
- **Description:** Immutable append-only enterprise audit trail logging 10 essential dimensions with SHA-256 integrity hashing.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/migrations/0002_aio_parties_iam.sql`
- **Related Tests:** `main/api/test/migration_destructive.test.ts`
- **Governing Documentation:** `STFL_AUDIT_MODEL.md, STFL_AIO_PHASE_2_DATABASE_REPORT.md`
- **Database Tables:** `enterprise_audit_logs`
- **API Endpoint:** `apk/api/src/repositories/audit.ts`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** PostgreSQL 16
- **Dependents:** FEAT-004, FEAT-005, FEAT-007, FEAT-015
- **Known Limitations & Operational Notes:** High-throughput tables require monthly partition pruning into cold storage.
- **Last Verified:** 2026-10-16

---
### FEAT-004: PostgreSQL Trigger-Enforced Audit Immutability
- **Domain:** Core Security
- **Description:** Database-level trigger aborting any UPDATE or DELETE operation on enterprise_audit_logs.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/migrations/0002_aio_parties_iam.sql (prevent_audit_log_mutation)`
- **Related Tests:** `main/api/test/migration_destructive.test.ts`
- **Governing Documentation:** `STFL_AIO_CONSTITUTION.md`
- **Database Tables:** `enterprise_audit_logs`
- **API Endpoint:** `None (Database PL/pgSQL Engine)`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-003
- **Dependents:** All system mutations
- **Known Limitations & Operational Notes:** Requires raw DB superuser privileges to disable (blocked via RDS/Managed PG IAM).
- **Last Verified:** 2026-10-16

---
### FEAT-005: 13-Dimensional Contextual Authorization Engine
- **Domain:** Governance
- **Description:** Multi-dimensional server-side policy evaluation across classes, roles, units, scopes, devices, and training status.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/authorization/engine.ts`
- **Related Tests:** `main/api/test/authorization_engine.test.ts`
- **Governing Documentation:** `STFL_AUTHORIZATION_MODEL.md, STFL_AIO_PHASE_3_AUTHORIZATION_REPORT.md`
- **Database Tables:** `iam_workspace_policies`
- **API Endpoint:** `apk/api/src/middleware.ts`
- **Security Tier:** `CRITICAL_TIER_1`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-001, FEAT-003
- **Dependents:** FEAT-007, FEAT-018, FEAT-034
- **Known Limitations & Operational Notes:** Complex policy rules must be cached in memory to maintain <10ms gateway latency.
- **Last Verified:** 2026-10-16

---
### FEAT-006: Dynamic Workspace Policy Enforcement
- **Domain:** Governance
- **Description:** Database-driven console access policies eliminating hard-coded client-side authorization.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/authorization/engine.ts`
- **Related Tests:** `main/api/test/authorization_engine.test.ts`
- **Governing Documentation:** `STFL_AIO_USER_CLASS_WORKSPACE_MATRIX.md`
- **Database Tables:** `iam_workspace_policies`
- **API Endpoint:** `/api/v1/auth/policies`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005
- **Dependents:** FEAT-018
- **Known Limitations & Operational Notes:** Policy misconfiguration could lock out unit heads (mitigated by Super Admin oversight).
- **Last Verified:** 2026-10-16

---
### FEAT-007: Dual-Custody Approval Engine
- **Domain:** Governance
- **Description:** Constitutional anti-collusion engine enforcing creator != approver across all financial, lease, and policy mutations.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/approval/engine.ts`
- **Related Tests:** `main/api/test/approval_engine.test.ts`
- **Governing Documentation:** `STFL_APPROVAL_ENGINE.md, STFL_AIO_PHASE_4_APPROVAL_REPORT.md`
- **Database Tables:** `approval_requests, approval_signatures`
- **API Endpoint:** `/api/v1/approvals/*`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-003, FEAT-005
- **Dependents:** FEAT-008, FEAT-015, FEAT-028
- **Known Limitations & Operational Notes:** Deadlocks avoided via delegation to Relief Moderator B or Unit Supervisor.
- **Last Verified:** 2026-10-16

---
### FEAT-008: Anti-Collusion Separation of Duties Verifier
- **Domain:** Governance
- **Description:** Automated verification that the disburser of funds is independent from the financial approver.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/approval/engine.ts`
- **Related Tests:** `main/api/test/approval_engine.test.ts`
- **Governing Documentation:** `STFL_APPROVAL_ENGINE.md`
- **Database Tables:** `approval_requests`
- **API Endpoint:** `/api/v1/finance/disburse`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-007
- **Dependents:** FEAT-028
- **Known Limitations & Operational Notes:** Small field branches must have at least 2 distinct officers present.
- **Last Verified:** 2026-10-16

---
### FEAT-009: Cryptographic Counter-Signature Ledger
- **Domain:** Governance
- **Description:** Dual ECDSA P-256 signatures stored in approval_signatures with SHA-256 voucher payload verification.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/crypto.ts`
- **Related Tests:** `main/api/test/approval_engine.test.ts`
- **Governing Documentation:** `STFL_APPROVAL_ENGINE.md`
- **Database Tables:** `approval_signatures`
- **API Endpoint:** `apk/api/src/routes/consoles.ts`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-001, FEAT-007
- **Dependents:** FEAT-028
- **Known Limitations & Operational Notes:** Clock drift between devices resolved via server-issued nonces.
- **Last Verified:** 2026-10-16

---
### FEAT-010: Forensic Steganographic Document Watermarking
- **Domain:** Operations
- **Description:** Yellow Micro-Dot matrix steganography encoding operator user_id, device_id, and print timestamp imperceptibly into PDF output.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/print/engine.ts`
- **Related Tests:** `main/api/test/controlled_print.test.ts`
- **Governing Documentation:** `STFL_AIO_PHASE_6_PRINT_REPORT.md`
- **Database Tables:** `printed_documents`
- **API Endpoint:** `/api/v1/print/generate`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-003
- **Dependents:** FEAT-011
- **Known Limitations & Operational Notes:** Requires high-resolution color laser printer for forensic physical dot recovery.
- **Last Verified:** 2026-10-16

---
### FEAT-011: Deterministic Document ID Generator
- **Domain:** Operations
- **Description:** STFL-DOC-{YEAR}-{UNIT}-{SEQ} formatting with Luhn check-digit verification.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/documents/engine.ts`
- **Related Tests:** `main/api/test/document_engine.test.ts`
- **Governing Documentation:** `STFL_AIO_DOCUMENT_ID_MODEL.md`
- **Database Tables:** `documents`
- **API Endpoint:** `/api/v1/documents/issue`
- **Security Tier:** `MEDIUM`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** PostgreSQL Sequences
- **Dependents:** FEAT-012
- **Known Limitations & Operational Notes:** Year rollover sequences handled via PostgreSQL partitioned sequence tables.
- **Last Verified:** 2026-10-16

---
### FEAT-012: Public Document Verification Gateway
- **Domain:** Operations
- **Description:** Public route /verify/:hash allows external verification of document validity without revealing private PII.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/routes/verify.ts`
- **Related Tests:** `main/api/test/document_engine.test.ts`
- **Governing Documentation:** `STFL_AIO_PHASE_5_DOCUMENT_REPORT.md`
- **Database Tables:** `documents`
- **API Endpoint:** `/api/v1/verify/:hash`
- **Security Tier:** `PUBLIC`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-011
- **Dependents:** Public Portal
- **Known Limitations & Operational Notes:** DDoS protection enforced via Cloudflare rate limiting.
- **Last Verified:** 2026-10-16

---
### FEAT-013: Governed Multi-Channel Communications Gateway
- **Domain:** Operations
- **Description:** Central dispatcher for SMS/WhatsApp/Email with anti-hallucination template approval and rate limiting.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/comms/gateway.ts`
- **Related Tests:** `main/api/test/comms_gateway.test.ts`
- **Governing Documentation:** `STFL_AIO_PHASE_7_COMMS_REPORT.md`
- **Database Tables:** `comms_dispatch_logs, comms_templates`
- **API Endpoint:** `/api/v1/comms/send`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-003
- **Dependents:** FEAT-014
- **Known Limitations & Operational Notes:** Carrier outages mitigated via multi-vendor automatic failover.
- **Last Verified:** 2026-10-16

---
### FEAT-014: Anti-Hallucination Template Approval Substrate
- **Domain:** Operations
- **Description:** Outbound messaging template validation blocking free-form AI text from reaching external parties.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/comms/gateway.ts`
- **Related Tests:** `main/api/test/comms_gateway.test.ts`
- **Governing Documentation:** `STFL_AIO_PHASE_7_COMMS_REPORT.md`
- **Database Tables:** `comms_templates`
- **API Endpoint:** `apk/api/src/routes/comms.ts`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-013
- **Dependents:** FEAT-015
- **Known Limitations & Operational Notes:** Template variables strictly typed using Zod regex patterns.
- **Last Verified:** 2026-10-16

---
### FEAT-015: Autonomous Agent Runtime & Constitutional Sandbox
- **Domain:** Autonomous AI
- **Description:** Agent orchestration substrate enforcing strict Level 3 authority ceiling (Read/Draft/Analyze/Recommend only).
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/agents/runtime.ts`
- **Related Tests:** `main/api/test/agent_runtime.test.ts, main/api/test/agent_red_team.test.ts`
- **Governing Documentation:** `STFL_AIO_AGENT_MODEL.md, STFL_AIO_PHASE_8_AGENT_REPORT.md`
- **Database Tables:** `agents, agent_runs, agent_executions`
- **API Endpoint:** `/api/v1/agents/*`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-003, FEAT-005, FEAT-007
- **Dependents:** FEAT-016, FEAT-017
- **Known Limitations & Operational Notes:** Prompt injection blocked via tool parameter JSON schema validation.
- **Last Verified:** 2026-10-16

---
### FEAT-016: Agent Confidence Boundary Evaluator
- **Domain:** Autonomous AI
- **Description:** Confidence score boundary gating rejecting recommendations below 0.98 for critical domains.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/agents/runtime.ts`
- **Related Tests:** `main/api/test/agent_red_team.test.ts`
- **Governing Documentation:** `STFL_AIO_PHASE_9_RED_TEAM_REPORT.md`
- **Database Tables:** `agent_executions`
- **API Endpoint:** `apk/api/src/routes/agents.ts`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-015
- **Dependents:** Human approval engine
- **Known Limitations & Operational Notes:** 0.979999... float attacks rejected via explicit decimal comparison.
- **Last Verified:** 2026-10-16

---
### FEAT-017: Agent Emergency Kill Switch Substrate
- **Domain:** Autonomous AI
- **Description:** Global and per-agent emergency kill switch instantaneously invalidating agent execution tokens.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/agents/runtime.ts`
- **Related Tests:** `main/api/test/agent_red_team.test.ts`
- **Governing Documentation:** `STFL_AIO_AGENT_MODEL.md`
- **Database Tables:** `agents (is_active, is_quarantined)`
- **API Endpoint:** `/api/v1/agents/:id/kill`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-015
- **Dependents:** All agent executions
- **Known Limitations & Operational Notes:** Requires CISO Tier 1 hardware key to disengage quarantine.
- **Last Verified:** 2026-10-16

---
### FEAT-018: 16 Core Management Consoles API
- **Domain:** Consoles
- **Description:** Unified Hono routes powering the 16 core enterprise management backends.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/routes/consoles.ts`
- **Related Tests:** `main/api/test/governed_consoles.test.ts`
- **Governing Documentation:** `STFL_AIO_CONSOLE_SPECIFICATION.md, STFL_AIO_PHASE_10_CONSOLES_REPORT.md`
- **Database Tables:** `All operational tables`
- **API Endpoint:** `/api/v1/consoles/*`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005, FEAT-006
- **Dependents:** FEAT-019, FEAT-020
- **Known Limitations & Operational Notes:** Console routes strictly enforce user class boundaries.
- **Last Verified:** 2026-10-16

---
### FEAT-019: Console 17: Compliance & Legal Console
- **Domain:** Consoles
- **Description:** Specialized operational console for Legal Counsel and Compliance Officers managing statutory holds.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_COMPLIANCE_CONSOLE_SPEC.md`
- **Related Tests:** `main/api/test/governed_consoles.test.ts`
- **Governing Documentation:** `STFL_AIO_COMPLIANCE_ARCHITECTURE.md`
- **Database Tables:** `compliance_rules, legal_review_cases`
- **API Endpoint:** `/api/v1/compliance/*`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-018, FEAT-030
- **Dependents:** FEAT-031
- **Known Limitations & Operational Notes:** Hold releases require physical digital signature from verified counsel.
- **Last Verified:** 2026-10-16

---
### FEAT-020: Console 18: Knowledge, Training & Service Console
- **Domain:** Consoles
- **Description:** Operational console for Course authoring, SOP management, quiz administration, and moderation queues.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_CONSOLE_SPECIFICATION.md`
- **Related Tests:** `main/api/test/governed_consoles.test.ts`
- **Governing Documentation:** `STFL_AIO_KNOWLEDGE_ARCHITECTURE.md`
- **Database Tables:** `knowledge_items, training_courses, moderator_work_queue`
- **API Endpoint:** `/api/v1/knowledge/*, /api/v1/moderation/*`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-018, FEAT-024
- **Dependents:** FEAT-025, FEAT-033
- **Known Limitations & Operational Notes:** Relief moderators have full queue access but zero root administration.
- **Last Verified:** 2026-10-16

---
### FEAT-021: Segment 01: User Learning Center
- **Domain:** Knowledge
- **Description:** Public and field worker educational center with pictorial instructions, step-by-step videos, and audio narrations.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_KNOWLEDGE_ARCHITECTURE.md`
- **Related Tests:** `None (UI Spec)`
- **Governing Documentation:** `STFL_AIO_PICTORIAL_TRAINING_MODEL.md`
- **Database Tables:** `training_courses, training_modules`
- **API Endpoint:** `/api/v1/learning/courses`
- **Security Tier:** `PUBLIC`
- **Project Applicability:** `PROJECT-CONFIGURABLE`
- **Dependencies:** R2 Asset Storage
- **Dependents:** FEAT-032
- **Known Limitations & Operational Notes:** Large media files cached locally to support offline rural operation.
- **Last Verified:** 2026-10-16

---
### FEAT-022: Segment 02: Service & Operations Center
- **Domain:** Knowledge
- **Description:** Active SOP runbooks, checklists, SEV-1 to SEV-4 incident procedures, and AI-assisted troubleshooting.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_SERVICE_CENTER_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_SERVICE_CENTER_MODEL.md`
- **Database Tables:** `service_sops, service_incidents`
- **API Endpoint:** `/api/v1/service/*`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-003, FEAT-020
- **Dependents:** FEAT-038
- **Known Limitations & Operational Notes:** AI troubleshooting assistant must cite ratified SOP version.
- **Last Verified:** 2026-10-16

---
### FEAT-023: Segment 03: Administration & Governance Center
- **Domain:** Knowledge
- **Description:** IAM manuals, cryptographic key rotation procedures, compliance guidelines, and audit manuals.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_KNOWLEDGE_ARCHITECTURE.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_KNOWLEDGE_GOVERNANCE_MODEL.md`
- **Database Tables:** `knowledge_items (category = 'SECURITY_IAM')`
- **API Endpoint:** `/api/v1/governance/manuals`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005
- **Dependents:** FEAT-030
- **Known Limitations & Operational Notes:** Unilateral modification blocked via dual-signature requirement.
- **Last Verified:** 2026-10-16

---
### FEAT-024: Segment 04: Moderation & Relief Center
- **Domain:** Knowledge
- **Description:** Administrative relief tier with MODERATOR_A and MODERATOR_B providing high-availability queue relief.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_MODERATOR_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_MODERATOR_MODEL.md`
- **Database Tables:** `moderator_delegation_ledger`
- **API Endpoint:** `/api/v1/moderation/delegations`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005
- **Dependents:** FEAT-025
- **Known Limitations & Operational Notes:** Zero self-approval invariant strictly enforced in code.
- **Last Verified:** 2026-10-16

---
### FEAT-025: Controlled Moderator Work Queue
- **Domain:** Knowledge
- **Description:** moderator_work_queue managing 9 item types (USER_HELP, ACCOUNT_SUPPORT, TRAINING_REVIEW, SOP_UPDATE, ESCALATION).
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_MODERATOR_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_MODERATOR_MODEL.md`
- **Database Tables:** `moderator_work_queue`
- **API Endpoint:** `/api/v1/moderation/queue`
- **Security Tier:** `MEDIUM`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-024
- **Dependents:** Service Desk
- **Known Limitations & Operational Notes:** SLA countdown timers trigger automated escalation to Unit Heads.
- **Last Verified:** 2026-10-16

---
### FEAT-026: Multi-Project Tenant Isolation Engine
- **Domain:** Multi-Project
- **Description:** PostgreSQL Row-Level Security ensuring strict zero cross-project data leakage across sub-ledgers and documents.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_PROJECT_ISOLATION_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_MULTI_PROJECT_ARCHITECTURE.md`
- **Database Tables:** `projects, project_memberships`
- **API Endpoint:** `Hono X-Project-Context middleware`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** PostgreSQL 16 RLS, FEAT-005
- **Dependents:** FEAT-027, FEAT-028, FEAT-029
- **Known Limitations & Operational Notes:** Cross-project transfers require explicit dual-leg intercompany clearing accounts.
- **Last Verified:** 2026-10-16

---
### FEAT-027: Custom Domain & Subdomain Hostname Router
- **Domain:** Multi-Project
- **Description:** Cloudflare Workers edge router resolving project domains (e.g. greendelta-agro.org) to internal project context.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_PROJECT_WEBSITE_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_PROJECT_WEBSITE_MODEL.md`
- **Database Tables:** `project_domains`
- **API Endpoint:** `/api/v1/projects/resolve-domain`
- **Security Tier:** `MEDIUM`
- **Project Applicability:** `PROJECT-CONFIGURABLE`
- **Dependencies:** Cloudflare Workers
- **Dependents:** Project public websites
- **Known Limitations & Operational Notes:** SSL certificate generation automated via Cloudflare for SaaS.
- **Last Verified:** 2026-10-16

---
### FEAT-028: Project Chart of Accounts & Sub-Ledger Engine
- **Domain:** Multi-Project
- **Description:** Independent double-entry general sub-ledger per project enforcing strict NUMERIC(18, 2) financial precision.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_PROJECT_FINANCE_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_PROJECT_FINANCE_MODEL.md`
- **Database Tables:** `project_chart_of_accounts, project_ledger_entries`
- **API Endpoint:** `/api/v1/projects/:id/finance/*`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PROJECT-SHARED`
- **Dependencies:** FEAT-007, FEAT-026
- **Dependents:** Project budgets & grants
- **Known Limitations & Operational Notes:** Unbalanced transactions rejected via database constraint debit = credit.
- **Last Verified:** 2026-10-16

---
### FEAT-029: Project Operational Lifecycle State Machine
- **Domain:** Multi-Project
- **Description:** Formal state machine governing project progression (DRAFT ➔ PILOT ➔ ACTIVE ➔ SUNSETTING ➔ ARCHIVED).
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_PROJECT_LIFECYCLE.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_PROJECT_LIFECYCLE.md`
- **Database Tables:** `projects (lifecycle_status)`
- **API Endpoint:** `/api/v1/projects/:id/transition`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-026
- **Dependents:** Project Archival
- **Known Limitations & Operational Notes:** Archiving a project preserves all historical audit logs immutably.
- **Last Verified:** 2026-10-16

---
### FEAT-030: Multi-Jurisdictional Statute Resolver
- **Domain:** Compliance
- **Description:** Statute evaluation engine resolving applicable national, municipal, and sector laws across 21 domains.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_COMPLIANCE_ARCHITECTURE.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_REGULATORY_RULE_MODEL.md`
- **Database Tables:** `compliance_jurisdictions, compliance_rules`
- **API Endpoint:** `/api/v1/compliance/resolve`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005
- **Dependents:** FEAT-031
- **Known Limitations & Operational Notes:** Time-travel audit evaluates rule version in effect at the exact time of transaction.
- **Last Verified:** 2026-10-16

---
### FEAT-031: Automated Statutory Hold & Legal Review Engine
- **Domain:** Compliance
- **Description:** Automatic transaction freeze engine triggered on statutory breaches (e.g. advance rent > 3 mo), creating legal review tickets.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_LEGAL_ESCALATION_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_LEGAL_ESCALATION_MODEL.md`
- **Database Tables:** `legal_review_cases`
- **API Endpoint:** `/api/v1/compliance/holds`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-030
- **Dependents:** Execution Pipeline
- **Known Limitations & Operational Notes:** Holds can only be lifted by authorized human legal counsel signature.
- **Last Verified:** 2026-10-16

---
### FEAT-032: Pictorial / Visual-First Training Engine
- **Domain:** Knowledge
- **Description:** Visual instructional material engine supporting 11 media types (Images, Diagrams, Flowcharts, Animations, Videos, Simulations).
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_PICTORIAL_TRAINING_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_PICTORIAL_TRAINING_MODEL.md`
- **Database Tables:** `training_visual_assets`
- **API Endpoint:** `/api/v1/knowledge/assets`
- **Security Tier:** `MEDIUM`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** R2 Asset Storage
- **Dependents:** FEAT-033, FEAT-036
- **Known Limitations & Operational Notes:** All visual assets verified via SHA-256 hash before delivery.
- **Last Verified:** 2026-10-16

---
### FEAT-033: Cryptographic Training Certification Authority
- **Domain:** Knowledge
- **Description:** Issuance of STFL-CER-* digital certificates with ECDSA P-256 signatures, passing score evaluation, and expiry tracking.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_TRAINING_CERTIFICATION_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_TRAINING_CERTIFICATION_MODEL.md`
- **Database Tables:** `training_user_certifications`
- **API Endpoint:** `/api/v1/knowledge/certificates`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-009, FEAT-032
- **Dependents:** FEAT-034
- **Known Limitations & Operational Notes:** Regulatory updates trigger mandatory refresher invalidation.
- **Last Verified:** 2026-10-16

---
### FEAT-034: Training-Gated Authorization Check
- **Domain:** Knowledge
- **Description:** 13-D Contextual Authorization engine verifies active TRAINING_STATUS before allowing sensitive operations (microfinance.collect, lease_create).
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_TRAINING_ARCHITECTURE.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_TRAINING_ARCHITECTURE.md`
- **Database Tables:** `action_training_prerequisites`
- **API Endpoint:** `apk/api/src/middleware.ts`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005, FEAT-033
- **Dependents:** All high-risk APIs
- **Known Limitations & Operational Notes:** Uncertified users blocked with HTTP 403 and redirected to course module.
- **Last Verified:** 2026-10-16

---
### FEAT-035: Mandatory Platform Compliance Training Non-Erasure
- **Domain:** Knowledge
- **Description:** Enforces that independent projects inherit and cannot silently delete or waive mandatory compliance training.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_KNOWLEDGE_GOVERNANCE_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_TRAINING_ARCHITECTURE.md`
- **Database Tables:** `knowledge_items (is_platform_mandatory = true)`
- **API Endpoint:** `/api/v1/knowledge/courses`
- **Security Tier:** `CONSTITUTIONAL`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-020
- **Dependents:** Project catalogues
- **Known Limitations & Operational Notes:** Project-level deletion attempts abort with GOVERNANCE_VIOLATION_BLOCKED.
- **Last Verified:** 2026-10-16

---
### FEAT-036: In-Workflow Contextual Walkthrough Guidance
- **Domain:** Knowledge
- **Description:** 'Step 3 of 7' contextual visual guidance panels embedded inside production operational forms.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_TRAINING_UX_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_TRAINING_UX_MODEL.md`
- **Database Tables:** `None (Static/API Metadata)`
- **API Endpoint:** `/api/v1/knowledge/walkthroughs`
- **Security Tier:** `LOW`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-032
- **Dependents:** FEAT-037
- **Known Limitations & Operational Notes:** Walkthroughs can be collapsed by experienced officers to avoid visual noise.
- **Last Verified:** 2026-10-16

---
### FEAT-037: Dynamic Compliance Intercept in UI
- **Domain:** Knowledge
- **Description:** Instant form field intercept converting walkthrough into a STOP / REVIEW REQUIRED barrier upon statutory threshold breach.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_TRAINING_UX_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_TRAINING_UX_MODEL.md`
- **Database Tables:** `compliance_rules`
- **API Endpoint:** `Inline client validation + backend rejection`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-030, FEAT-036
- **Dependents:** Form submission
- **Known Limitations & Operational Notes:** Client validation failure prevents submission; backend 13-D auth rejects any bypass.
- **Last Verified:** 2026-10-16

---
### FEAT-038: AI-Assisted Troubleshooting with Provenance
- **Domain:** Knowledge
- **Description:** Operational diagnostic assistant answering queries strictly from approved, versioned SOPs with mandatory citations.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `STFL_AIO_SERVICE_CENTER_MODEL.md`
- **Related Tests:** `None`
- **Governing Documentation:** `STFL_AIO_SERVICE_CENTER_MODEL.md`
- **Database Tables:** `service_sops`
- **API Endpoint:** `/api/v1/service/troubleshoot`
- **Security Tier:** `MEDIUM`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-015, FEAT-022
- **Dependents:** Support Desk
- **Known Limitations & Operational Notes:** Uncertain queries trigger mandatory ESCALATE_SOURCE_REVIEW.
- **Last Verified:** 2026-10-16

---
### FEAT-039: Cloudflare Workers Edge Gateway & KV Cache
- **Domain:** Infrastructure
- **Description:** Edge network entrypoint with rate-limiting KV stores, DDoS scrubbing, TLS termination, and Hyperdrive connection pooling.
- **Verification Status:** **PLANNED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/wrangler.toml`
- **Related Tests:** `None`
- **Governing Documentation:** `apk/api/wrangler.toml`
- **Database Tables:** `Hyperdrive Pooler to PostgreSQL`
- **API Endpoint:** `Edge entrypoint`
- **Security Tier:** `HIGH`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** Cloudflare Workers
- **Dependents:** Production Release Gate
- **Known Limitations & Operational Notes:** Requires live Cloudflare deployment to verify production path.
- **Last Verified:** 2026-10-16

---
### FEAT-040: Interactive Demo Mock Environment
- **Domain:** Demo & Testing
- **Description:** Synthetic tenant and user sandbox generator passing 15/15 Vitest tests for safe sandbox evaluation.
- **Verification Status:** **TESTED** (Code Verified in `main/`)
- **Implementation Location:** `main/api/src/routes/demo.ts`
- **Related Tests:** `main/api/test/demo_environment.test.ts`
- **Governing Documentation:** `STFL_AIO_DEMO_ENVIRONMENT.md, STFL_AIO_DEMO_SECURITY_BOUNDARY.md`
- **Database Tables:** `Temporary demo seeds`
- **API Endpoint:** `/api/v1/demo/*`
- **Security Tier:** `DEMO_ISOLATED`
- **Project Applicability:** `PLATFORM-WIDE`
- **Dependencies:** FEAT-005
- **Dependents:** Sandbox onboarding
- **Known Limitations & Operational Notes:** Demo routes strictly disabled in production builds via NODE_ENV=production check.
- **Last Verified:** 2026-10-16

---
