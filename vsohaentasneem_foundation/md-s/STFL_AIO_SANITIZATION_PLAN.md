# STFL AIO — Repository Sanitization & Safe Consolidation Plan

> **Document ID:** `STFL-DOC-2026-SANITIZE-PLAN-V1`  
> **Master Version:** `1.0.0`  
> **Date:** October 15, 2026  
> **Author:** STFL AIO Principal Architecture, Repository Archaeologist & Security Auditor  
> **Attribution:** *Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.*  
> **Release Gate Status:** `PENDING (Prompt 13 Gate Closed)`  
> **Execution Phase:** Staging & Planning Only — Non-Destructive

---

## 1. Sanitization Mandate & Governance Rules

The objective of this Sanitization Plan is to transition the STFL AIO repository from its current monolithic, build-polluted state into an organized, high-performance, and auditable enterprise monorepo.

### The Non-Destructive Invariant
1. **No deletions during this phase:** All files identified for archiving or removal remain in place until release gates are executed.
2. **Move before delete:** Every item marked for eventual deprecation must first be safely archived in an out-of-band `archive/` directory.
3. **Regression testing at every boundary:** Any proposed move must be verified by `npm test` across all 236 Vitest suites, `validate_json.js`, and TypeScript compile gates.

---

## 2. Safe Consolidation Lifecycle Workflow

In accordance with Section 35 of the Master Architecture Consolidation Brief:

```
  [ 1. INVENTORY ] 
        ↓  (1,082 files cataloged across 508 active source + 72 root specs)
  [ 2. DEPENDENCY ANALYSIS ] 
        ↓  (Mapped in STFL_AIO_DEPENDENCY_INDEX.json)
  [ 3. SOURCE-OF-TRUTH IDENTIFICATION ] 
        ↓  (Consolidated in STFL_AIO_MASTER_CONTROL.html)
  [ 4. DUPLICATE & REDUNDANCY DETECTION ] 
        ↓  (Identified in STFL_AIO_FILE_INDEX.json & Archive Candidates)
  [ 5. STAGED ARCHIVE PLAN ] 
        ↓  (Category B items planned for relocation)
  [ 6. STAGED MOVE PLAN ] 
        ↓  (Apps, services, and packages decoupled)
  [ 7. AUTOMATED TESTS & BUILDS ] 
        ↓  (Run 236 Vitest tests + Next.js build verification)
  [ 8. INTEGRITY & REGRESSION AUDIT ] 
        ↓  (Execute node validate_json.js - verify 85/85 checks pass)
  [ 9. MANUAL APPROVAL GATE ] 
        ↓  (Requires human administrator authorization)
  [ 10. REMOVAL OF VERIFIED REDUNDANCY ONLY ]
```

---

## 3. Sanitization Category Registers

### Category A: KEEP IN ACTIVE SOURCE (508 Files)
These files represent the living, canonical, and production-tested codebase. They must never be deleted or disrupted.

| Component / Subsystem | Location | Item Count | Rationale |
| :--- | :--- | :--- | :--- |
| **Living Master Control Book** | `STFL_AIO_MASTER_CONTROL.html` | 1 file | Single visual and machine-readable truth index. |
| **Authoritative Validator** | `validate_json.js` | 1 file | 85-check automated system invariant auditor. |
| **Machine-Readable DAGs** | `STFL_AIO_*.json` | 3 files | Feature, file, and dependency indexes. |
| **Platform Constitution** | `STFL_AIO_CONSTITUTION.md` | 1 file | Ratified constitutional invariants (INV-01 to INV-12). |
| **Backend API Engine** | `apk/api/src/` | ~95 files | Canonical Fastify API, IAM, auth, and crypto logic. |
| **PostgreSQL Migrations** | `apk/api/migrations/` | 2 files | Canonical `0001_init.sql` & `0002_aio_parties_iam.sql`. |
| **Backend Test Suite** | `apk/api/test/` | 11 files | 236 passing Vitest test cases. |
| **Production Web UI** | `apk/web/src/` | ~160 files | Canonical Next.js 15 App Router consoles & UI components. |
| **Android Security Layer** | `apk/security/` | ~38 files | Hardware KeyStore attestation & biometric bindings. |
| **Android Native App** | `apk/app/`, `apk/core/` | ~65 files | Native Kotlin Android implementation. |

---

### Category B: MOVE TO ARCHIVE / HISTORICAL (Proposed Move Plan)
These files contain valuable architectural history, audit provenance, or past phase progress reports that are now fully consolidated into `STFL_AIO_MASTER_CONTROL.html`. They should be moved into an `archive/` hierarchy when consolidation is authorized.

| Current Path | Proposed Destination | File Count | Rationale & Safety Check |
| :--- | :--- | :--- | :--- |
| `STFL_AIO_PHASE_*_REPORT.md` | `archive/reports/phases/` | 18 files | Phase reports (Prompts 1-12) are fully subsumed into Master Control. |
| `STFL_AIO_DEMO_*.md` | `archive/reports/demo/` | 5 files | Demo environment reports superseded by living architecture. |
| `_old/` | `archive/legacy/` | 6 files | Legacy video asset (`dhaka-drone.mp4`) and legacy mocks. |
| `STFL_AIO_BASELINE.md` | `archive/baseline/` | 1 file | Historical prompt baseline document. |
| `STFL_AIO_CONSISTENCY_GATE.md` | `archive/baseline/` | 1 file | Historical audit gate report. |

---

### Category C: REMOVE ONLY AFTER CONFIRMED SAFE (Deletion Candidates)
These artifacts represent pure disk bloat, unversioned backup snapshots, compiled local binaries, or duplicate prototype caches. They may only be deleted after Category B moves are validated and production release gates approve.

| Target Path | Size | Reason for Future Removal | Prerequisite Safety Gate |
| :--- | :--- | :--- | :--- |
| `stfl.zip` (Root) | 1,607.94 MB | Monolithic unversioned repository backup snapshot. | Confirm off-site cold storage copy exists. |
| `files/web/aakutu-board.zip` | 500.56 MB | Bundled Electron desktop distribution. | Confirm desktop release artifact is stored on Cloudflare R2 / S3. |
| `files/web/aakutu-board/release/` | 338.00 MB | Unpacked Windows Electron binaries (`.exe`, `.dll`). | Re-compilable from desktop source via CI pipeline. |
| `apk/preview/web/` | 468.17 MB | Redundant early Next.js prototype with stale `.next` cache. | Verify zero unique CSS or assets are missing from `apk/web/`. |
| `STFL_AGENT_AUTHORIZATION_MODEL.zip` | 151 KB | Redundant zip archive of agent documentation. | Markdown source is actively maintained in root. |
| `weworkhow/` | 0 B | Completely empty placeholder directory. | Safe to prune immediately. |

---

## 4. Target Clean Repository Topology

When Category B and C transitions are executed in future release phases, the repository will adhere to the following clean monorepo architecture:

```
stfl/
├── apps/
│   ├── android/              # Native Kotlin Android application (from apk/app)
│   ├── web/                  # Next.js 15 Canonical Web Platform (from apk/web)
│   └── admin/                # Desktop / Executive Management Console
│
├── services/
│   ├── api/                  # Canonical Node.js Fastify API (from apk/api)
│   └── workers/              # Background job runners & scheduled dispatchers
│
├── packages/
│   ├── core/                 # Shared types, validation schemas, and constants
│   ├── security/             # Cryptographic attestation, KeyStore & tokens
│   ├── authorization/        # IAM, scopes, user classes & permission gates
│   ├── documents/            # Document vault, metadata & SHA-256 hash locking
│   ├── communications/       # Multi-channel messaging & notifications
│   ├── compliance/           # 21 statutory compliance rule evaluators
│   ├── agents/               # Level 3 Autonomous Agent runtime & kill switches
│   ├── training/             # 4 experience segments & pictorial training
│   └── ui/                   # Shared UI primitives, design tokens & Iconoir icons
│
├── database/
│   ├── migrations/           # 0001_init.sql & 0002_aio_parties_iam.sql
│   └── seeds/                # Verified test fixtures & demo environments
│
├── projects/                 # Multi-tenant project configs & expansion templates
│   ├── archetypes/           # Agro, Clinic, Research, Community templates
│   └── zones/                # Dhaka, North, South, Global zonal division configs
│
├── docs/                     # Living canonical documentation hierarchy
│   ├── constitution/         # STFL_AIO_CONSTITUTION.md & Invariants
│   ├── architecture/         # Master architecture specifications
│   ├── security/             # Security models & red-team remediation notes
│   ├── compliance/           # Statutory instruments & regulatory mappings
│   └── training/             # SOPs, syllabi & moderator operational guides
│
├── archive/                  # Offline historical records & superseded reports
│   ├── phases/               # Historical phase reports (Prompts 1-12)
│   └── legacy/               # Deprecated media assets
│
├── STFL_AIO_MASTER_CONTROL.html   # Living Master Control Book
├── STFL_AIO_FEATURE_INDEX.json    # Machine-readable Feature DAG
├── STFL_AIO_FILE_INDEX.json       # Machine-readable File Inventory
├── STFL_AIO_DEPENDENCY_INDEX.json # Machine-readable Dependency Graph
├── validate_json.js               # Authoritative Master Control Validator
└── package.json
```

---

## 5. Rollback & Disaster Recovery Strategy

To ensure zero risk of business disruption:
1. **Pre-Sanitization Git Tagging:** Prior to executing any physical file movements, create an immutable annotated tag:  
   `git tag -a v1.0.0-pre-sanitization-freeze -m "Complete repository snapshot prior to consolidation"`
2. **Atomic Branch Execution:** All moves must occur on a dedicated `refactor/repo-sanitization` branch.
3. **Automated Verification Pipeline:**  
   - `npm test` in `services/api` (must report 236/236 PASS).
   - `node validate_json.js` (must report 85/85 PASS).
   - `npm run build` in `apps/web` (must build cleanly with 0 errors).

---

*Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.*
