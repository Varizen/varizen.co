# STFL AIO — Enterprise Console Directory & Console 18 Specification

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-CNS-SPEC-V1`  
**Date:** 2026-10-15  
**Status:** SPECIFICATION — RATIFIED (SECTIONS 81, 82)  
**Security Level:** INTERNAL USE ONLY  

---

## 1. Executive Summary & Enterprise Console Directory

The STFL AIO Enterprise Platform decomposes institutional governance, operations, compliance, and learning into **18 Specialized Management Consoles**. Each console provides a strictly bounded operational domain, governed by 13-D contextual authorization, hardware attestation, and role-based workspace allocation.

### 1.1 Complete 18-Console Directory
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STFL AIO 18 MANAGEMENT CONSOLES                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  CORE INSTITUTIONAL COMMAND                                                 │
│   01. Governance Center             02. Executive Command                   │
│   03. Finance Control               04. Property Management                 │
│   05. Microfinance Center           06. Workforce Center (HR)               │
│   07. E-Commerce Operations         08. Projects & Agency Command           │
│   09. Asset Management              10. Document Control & Issuance         │
│   11. Communications & Dispatch     12. Security & Audit Operations         │
│   13. Autonomous Agent Command      14. Hardware Device Management          │
│   15. Identity & Access (IAM)       16. Core System Administration          │
├─────────────────────────────────────────────────────────────────────────────┤
│  REGULATORY & SERVICE EXTENSIONS                                            │
│   17. Compliance & Legal Console    18. Knowledge, Training & Service       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Console 18: Knowledge, Training & Service Console Specification (Section 81)

Console 18 establishes the operational command center for the entire learning, training, certification, SOP, and moderation ecosystem.

### 2.1 Mission & Functional Mandate
Console 18 manages:
1. **Curriculum & Courses**: Course authoring, module sequencing, lesson authoring, and prerequisites.
2. **Visual & Media Assets**: Pictorial guides, infographic flowcharts, animations, screen walkthroughs, and instructional videos.
3. **Standard Operating Procedures (SOPs)**: Runbook authoring, checklist generation, and step-by-step field guides.
4. **Knowledge Articles & FAQs**: Operational and public documentation with multilingual translations.
5. **Assessment & Question Banks**: Randomized question authoring, touch-based simulation definitions, passing score configurations.
6. **Certification Authority**: Certificate template design, validity windows, renewal triggers, and revocation management.
7. **Governance & Approvals**: 6-stage lifecycle transitions (`DRAFT ➔ REVIEW ➔ APPROVED ➔ PUBLISHED ➔ SUPERSEDED ➔ ARCHIVED`).
8. **Applicability Rules**: Mapping courses and SOPs to User Classes, Projects, Jurisdictions, and Devices.
9. **Controlled Moderation Queue**: Dedicated queue interfaces for `MODERATOR_A` and `MODERATOR_B`.

---

## 3. Console 18 Layout & Primary Workspace Views

Console 18 exposes six specialized functional views accessible via a unified sidebar navigation:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ CONSOLE 18: KNOWLEDGE, TRAINING & SERVICE COCKPIT                           │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ NAVIGATION   │ VIEW 1: CURRICULUM & COURSE MANAGER                          │
│              │                                                              │
│ [x] Courses  │ Active Courses: 42   Draft: 6   Pending Approval: 3          │
│ [ ] Visuals  │                                                              │
│ [ ] SOPs     │ + NEW COURSE    [FILTER: BY PROJECT / ROLE / JURISDICTION]   │
│ [ ] Quizzes  │ ───────────────────────────────────────────────────────────  │
│ [ ] Certs    │ • CRS-FIN-01: Microfinance Field Collection [Global STFL]    │
│ [ ] Queue    │   Version: 3  |  Mandatory: YES  |  Pass: 80%  |  Status: ACTIVE│
│ [ ] Analytics│ • CRS-HLTH-02: Cold-Chain Drug Storage [Project Health]      │
│ [ ] Settings │   Version: 1  |  Mandatory: YES  |  Pass: 90%  |  Status: ACTIVE│
│              │ • CRS-PROP-03: Commercial Tenant Dispute SOP [Global STFL]   │
│              │   Version: 2  |  Mandatory: NO   |  Pass: 75%  |  Status: REVIEW│
└──────────────┴──────────────────────────────────────────────────────────────┘
```

### 3.1 View Breakdown
1. **View 1: Curriculum & Course Manager**: Create, structure, and edit courses, modules, lessons, and learning paths.
2. **View 2: Visual & Media Studio**: Upload, tag, optimize, and preview 11 visual asset types (images, diagrams, flowcharts, animations, videos, interactive simulations). Computes SHA-256 asset hashes.
3. **View 3: SOP & Checklist Engine**: Author Standard Operating Procedures with embedded visual steps, required prerequisites, and escalation parameters.
4. **View 4: Assessments & Quizzes**: Construct randomized question pools, touch hotspots for mobile simulations, and pass/fail thresholds.
5. **View 5: Certification Authority**: Manage digital certificate templates, monitor expiring certifications, trigger bulk renewal notices, inspect audit logs.
6. **View 6: Moderation & Relief Work Queue**: The operational cockpit for `MODERATOR_A` and `MODERATOR_B` to process tickets (`USER_HELP`, `TRAINING_REVIEW`, `ACCOUNT_SUPPORT`, `SOP_UPDATE`, `ESCALATION`).

---

## 4. Console 18 API Specifications & Contracts

All Console 18 operations interact with backend services via versioned RESTful endpoints:

### 4.1 Knowledge & Course Endpoints
- `GET /api/v1/knowledge/courses`: Query courses filtered by `project_id`, `user_class`, `status`, and `jurisdiction`.
- `POST /api/v1/knowledge/courses`: Author a new course (Draft state). Requires `CLASS_04` or higher.
- `PUT /api/v1/knowledge/courses/:id`: Update course details (creates a new minor/major draft version).
- `POST /api/v1/knowledge/courses/:id/transition`: Transition course lifecycle state (`SUBMIT_REVIEW`, `APPROVE`, `PUBLISH`, `SUPERSEDE`, `ARCHIVE`). Requires dual-signature for compliance courses.
- `GET /api/v1/knowledge/assets`: Browse and search media assets with CDN and local caching metadata.
- `POST /api/v1/knowledge/assets/upload`: Upload visual diagrams, flowcharts, or videos; computes SHA-256 integrity hash.

### 4.2 Assessment & Certification Endpoints
- `POST /api/v1/knowledge/assessments/:id/submit`: Submit user assessment answers. Evaluates score, records attempts, emits digital certificate if score >= threshold.
- `GET /api/v1/knowledge/certificates/:cert_number`: Public and internal cryptographic certificate verification endpoint.
- `POST /api/v1/knowledge/certificates/:id/revoke`: Revoke certification with mandatory reason and audit receipt.

### 4.3 Moderation Queue Endpoints
- `GET /api/v1/moderation/queue`: Retrieve filtered work queue items (`status`, `priority`, `item_type`).
- `POST /api/v1/moderation/queue/:id/claim`: Moderator claims an unassigned ticket.
- `POST /api/v1/moderation/queue/:id/resolve`: Resolve ticket with documented actions. Enforces zero self-approval.
- `POST /api/v1/moderation/queue/:id/escalate`: Escalate ticket to designated authority (`FINANCE`, `LEGAL`, `SECURITY`, `SERVICE_MANAGER`).

---

## 5. Security & Permission Boundaries for Console 18

### 5.1 RBAC & Role Enforcement Matrix
| Action | Class 00 (Admin) | Class 01 (Trustee) | Service Mgr (`CLASS_03`) | MODERATOR_A | MODERATOR_B | Officer (`CLASS_04`) | Learner (`CLASS_05/12`) |
|---|---|---|---|---|---|---|---|
| View Courses | Full | Full | Full | Full | Full | Enrolled | Enrolled |
| Draft Course | Yes | Yes | Yes | No | Yes (Curate)| Yes | No |
| Approve SOP | Yes | Yes | Yes | No | No | No | No |
| Publish Course | Yes | Yes | Yes (Unit) | No | No | No | No |
| Process User Help Q | Yes | Oversight | Manage | **Full** | Assist | No | Self Only |
| Process Tech Triage Q| Yes | Oversight | Manage | Assist | **Full** | No | Self Only |
| Escalate Ticket | Yes | Yes | Yes | **Yes** | **Yes** | Yes | Yes |
| Revoke Certificate | Yes | Yes | Yes (Unit) | No | No | No | No |

### 5.2 Device Security & Audit Mandates
- Access to Console 18 for administrative, authoring, or moderation tasks requires **Tier 2 Enrolled Hardware Device** minimum.
- All lifecycle state transitions, quiz submissions, ticket escalations, and certificate issuances are written immutably to `audit_logs` with SHA-256 payload integrity hashing.

---

## 6. Summary of Console Guarantees

1. **Holistic Knowledge Governance**: Centralizes all 4 experience segments into an auditable, role-aware management console.
2. **Multi-Project Applicability**: Courses and SOPs are explicitly scoped to global STFL or specific project entities with inherited compliance rules.
3. **Structured Administrative Relief**: Provides relief moderators with high-productivity queue management without granting superadmin rights.
4. **Verifiable Certification**: Transforms training from a checkbox into a cryptographically enforced operational prerequisite.
