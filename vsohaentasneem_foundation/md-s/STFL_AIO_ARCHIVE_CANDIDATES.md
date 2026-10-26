# STFL AIO — Explicit Archive Candidates & Historical Inventory

> **Document ID:** `STFL-DOC-2026-ARCHIVE-CANDIDATES-V1`  
> **Master Version:** `1.0.0`  
> **Date:** October 15, 2026  
> **Author:** STFL AIO Principal Architecture, Repository Archaeologist & Security Auditor  
> **Attribution:** *Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.*  
> **Release Gate Status:** `PENDING (Prompt 13 Gate Closed)`  
> **Policy:** Proof Before Moving — Zero Immediate Deletion

---

## 1. Overview & Verification Protocol

This register enumerates all **24+ archive candidates** identified during the repository discovery and archaeology phase. 

Every candidate on this list meets the following criteria:
1. **Subsumed Content:** All operational facts, architecture diagrams, security findings, and invariants contained in these files have been fully migrated into `STFL_AIO_MASTER_CONTROL.html` and its embedded JSON truth model.
2. **Zero Runtime Dependency:** None of these files are imported by TypeScript/JavaScript runtimes, Kotlin source trees, database migration scripts, or automated Vitest suites.
3. **Preservation Guarantee:** Marking an item as an "Archive Candidate" does **NOT** mean immediate deletion. It specifies the item's planned relocation path to an out-of-band `archive/` folder once human authorization is received.

---

## 2. Master Archive Candidates Inventory

| # | Item Name / Path | Origin / Prompt | Size | Candidate Rationale | Target Archive Path | Dependencies | Verification Check | Confidence Level |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | `STFL_AIO_PHASE_1_IMPLEMENTATION_REPORT.md` | Prompt 1 | 23.8 KB | Milestone report; device security specs migrated to Master Control. | `archive/phases/` | None | No active imports; verified in Master Control Section 1. | **HIGH** |
| **02** | `STFL_AIO_PHASE_1_RED_TEAM_REPORT.md` | Prompt 2 | 17.3 KB | Red team findings on device attestation consolidated in security map. | `archive/phases/` | None | No runtime reliance; test vectors in `test/api.test.ts`. | **HIGH** |
| **03** | `STFL_AIO_PHASE_2_DATABASE_REPORT.md` | Prompt 3 | 9.7 KB | Database migration execution log; schema codified in `0001_init.sql`. | `archive/phases/` | None | Migration verified by PostgreSQL container tests. | **HIGH** |
| **04** | `STFL_AIO_PHASE_3_AUTHORIZATION_REPORT.md` | Prompt 5 | 8.9 KB | IAM and user class milestone report; fully mapped in Master Control. | `archive/phases/` | None | IAM middleware runs 236/236 Vitest tests. | **HIGH** |
| **05** | `STFL_AIO_PHASE_4_APPROVAL_REPORT.md` | Prompt 6 | 8.2 KB | Approval engine progress report; rules codified in `src/approval.ts`. | `archive/phases/` | None | Tested in `test/approval.test.ts`. | **HIGH** |
| **06** | `STFL_AIO_PHASE_5_DOCUMENT_REPORT.md` | Prompt 7 | 9.7 KB | Document ledger progress report; logic codified in `src/routes/documents.ts`. | `archive/phases/` | None | Verified in Master Control Vault Tab. | **HIGH** |
| **07** | `STFL_AIO_PHASE_6_PRINT_REPORT.md` | Prompt 8 | 8.9 KB | Print substrate progress report; logic codified in `src/routes/print.ts`. | `archive/phases/` | None | Subsumed into Feature Register (FEAT-027). | **HIGH** |
| **08** | `STFL_AIO_PHASE_7_COMMS_REPORT.md` | Prompt 9 | 12.8 KB | Communications engine report; logic codified in `src/routes/comms.ts`. | `archive/phases/` | None | Subsumed into Feature Register (FEAT-026). | **HIGH** |
| **09** | `STFL_AIO_PHASE_8_AGENT_REPORT.md` | Prompt 10 | 17.2 KB | Autonomous agent runtime report; codified in `src/agents/runtime.ts`. | `archive/phases/` | None | Level 3 ceiling tested in `test/agent.test.ts`. | **HIGH** |
| **10** | `STFL_AIO_PHASE_9_RED_TEAM_REPORT.md` | Prompt 11 | 12.6 KB | Agent adversarial red-team report; codified in security invariants. | `archive/phases/` | None | Attack vectors verified in automated test suite. | **HIGH** |
| **11** | `STFL_AIO_PHASE_10_CONSOLES_REPORT.md` | Prompt 12 | 16.8 KB | 16 Management Consoles report; directory codified in Master Control. | `archive/phases/` | None | Console specifications in `STFL_AIO_CONSOLE_SPECIFICATION.md`. | **HIGH** |
| **12** | `STFL_AIO_PHASE_12_5_MULTI_PROJECT_ARCHITECTURE_REPORT.md` | Prompt 12.5 | 18.3 KB | Multi-project architecture report; codified in Master Control. | `archive/phases/` | None | Architectural rules codified in Master JSON truth. | **HIGH** |
| **13** | `STFL_AIO_DEMO_ENVIRONMENT.md` | Demo Phase | 7.9 KB | Demo environment configuration guide; superseded by Master Control. | `archive/demo/` | None | Subsumed into Master Control deployment notes. | **HIGH** |
| **14** | `STFL_AIO_DEMO_DATA_MODEL.md` | Demo Phase | 7.1 KB | Demo mock dataset specification; superseded by seed scripts. | `archive/demo/` | None | Migrated into database seed definitions. | **HIGH** |
| **15** | `STFL_AIO_DEMO_SECURITY_BOUNDARY.md` | Demo Phase | 7.2 KB | Demo boundary report; superseded by production security invariants. | `archive/demo/` | None | Subsumed into Constitutional Invariants. | **HIGH** |
| **16** | `STFL_AIO_DEMO_USER_GUIDE.md` | Demo Phase | 7.3 KB | Demo user manual; superseded by Knowledge & Training ecosystem. | `archive/demo/` | None | Subsumed into Experience Segment 1 (SEG-01). | **HIGH** |
| **17** | `STFL_AIO_DEMO_VERIFICATION_REPORT.md` | Demo Phase | 8.5 KB | Demo verification run; superseded by Master Generation Report. | `archive/demo/` | None | Historical test run. | **HIGH** |
| **18** | `STFL_AIO_BASELINE.md` | Early Prompts | 18.6 KB | Baseline capability document; fully incorporated into Master Control. | `archive/baseline/` | None | Subsumed into living Master Control Book. | **HIGH** |
| **19** | `STFL_AIO_CONSISTENCY_GATE.md` | Audit Phase | 27.4 KB | Historical consistency gate; superseded by `validate_json.js`. | `archive/baseline/` | None | Invariants codified in automated validator. | **HIGH** |
| **20** | `stfl.zip` (Root Directory) | Snapshot | 1.61 GB | Unversioned full repository backup snapshot. | `archive/backups/` | None | Zero build references; verified via grep. | **HIGH** |
| **21** | `STFL_AGENT_AUTHORIZATION_MODEL.zip` | Prompt 10 | 151 KB | Redundant zip archive of markdown documentation. | `archive/backups/` | None | Markdown source active in root. | **HIGH** |
| **22** | `files/web/aakutu-board.zip` | Release | 500.6 MB | Packaged Electron desktop installer. | `archive/releases/` | None | Binary distributable; should reside on CDN/R2. | **HIGH** |
| **23** | `files/web/aakutu-board/release/` | Build Output | 338.0 MB | Unpacked Windows Electron binaries (`.exe`, `.dll`, `.pak`). | `archive/releases/` | None | Rebuildable build output; non-source. | **HIGH** |
| **24** | `apk/preview/web/` | Prototype | 468.2 MB | Duplicate early Next.js web prototype and stale `.next` cache. | `archive/prototypes/`| None | `apk/web/` is verified canonical production web. | **MEDIUM** |
| **25** | `_old/` | Legacy Assets | 14.2 MB | Legacy drone video (`dhaka-drone.mp4`) and early mockups. | `archive/legacy/` | None | Asset archive; zero code references. | **HIGH** |
| **26** | `weworkhow/` | Placeholder | 0 B | Completely empty directory. | Remove directly | None | Prune empty folder during cleanup. | **HIGH** |

---

## 3. What Must NEVER Be Archived or Deleted

The following assets are classified as **PERMANENT CANONICAL ASSETS** and must remain active in the repository under all circumstances:

1. **`STFL_AIO_MASTER_CONTROL.html`:** The definitive visual and machine-readable single source of truth for the entire platform.
2. **`validate_json.js`:** The authoritative 85-rule Master Control Validator script.
3. **`STFL_AIO_CONSTITUTION.md`:** The ratified institutional constitution and 12 immutable invariants.
4. **`STFL_AIO_FEATURE_INDEX.json`:** The machine-readable complete feature catalogue.
5. **`STFL_AIO_FILE_INDEX.json`:** The repository file inventory and active tracking ledger.
6. **`STFL_AIO_DEPENDENCY_INDEX.json`:** The multi-dimensional dependency graph connecting features, tables, APIs, and invariants.
7. **`apk/api/migrations/0001_init.sql` & `0002_aio_parties_iam.sql`:** The authoritative PostgreSQL database schemas.
8. **`apk/api/src/` & `apk/api/test/`:** The production backend API codebase and its 236 passing Vitest test suites.
9. **`apk/web/src/`:** The production Next.js 15 App Router web platform.
10. **`apk/security/`:** The hardware KeyStore cryptographic attestation and biometric integration layer.

---

*Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.*
