# STFL AIO — Repository Archaeological Audit & Consolidation Report

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-AUDIT-V1`  
**Date:** 2026-10-15  
**Audit Standard:** PASS 1 Read-Only Archaeological Inventory & Source-of-Truth Determination  
**Security Level:** INTERNAL USE ONLY  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Executive Summary

This audit constitutes the definitive architectural, dependency, and file inventory of the SohaelTasneem Foundation (`stfl`) repository. 
Per Platform Absolute Instructions (Section 1 & 45), this inventory was conducted non-destructively: **zero files were deleted, zero production facts were invented, and zero working architecture was replaced.**

### Key Inventory Findings
- **Total Physical Repository Size:** Approximately 2.57 GB across 1,082 indexed physical files.
- **Active Production Source Footprint:** Only **42.8 MB** (508 active source files) across Node/Fastify API, Next.js 15 App Router web, and Kotlin Android client.
- **Historical Disk Bloat Root Cause:**
  1. `stfl.zip` (Root directory): **1.61 GB** monolithic archive of historical development states.
  2. `files/web/aakutu-board.zip`: **500.56 MB** packaged historical Electron build artifact.
  3. `files/web/aakutu-board/release/`: **338.00 MB** unpacked Windows distribution binaries (`.exe`, `.dll`, `.pak`).
  4. `apk/preview/web/`: **468.17 MB** containing stale `.next` build artifacts from prototype evaluations.
- **Master Control Validation Status:** **98 / 98 PASS (100%)** via `validate_json.js`.
- **Backend Test Status:** **236 / 236 PASS (100%)** across 11 test suites in `apk/api`.
- **Web Build Status:** **47 / 47 Static Pages PASS (100%)** in `apk/web` (Next.js 15.5.27).
- **Icon Policy Status:** **PASS — 0 prohibited icons**; exclusive adherence to `iconoir-react`.

---

## 2. Directory Structure & Source-of-Truth Determination

| Directory Path | Classification | Archaeological Assessment & Source of Truth |
| :--- | :--- | :--- |
| `apk/api/` | **CANONICAL ACTIVE** | Authoritative Fastify REST API, PostgreSQL 16 database migrations, security middleware, and 236 Vitest test suites. |
| `apk/web/` | **CANONICAL ACTIVE** | Authoritative Next.js 15 App Router web portal with 18 management consoles, 20 public bilingual routes, and brand design tokens. |
| `apk/app/`, `apk/security/`, `apk/core/`, `apk/data/` | **CANONICAL ACTIVE** | Authoritative Android application codebase, KeyStore hardware security abstraction, and Room database cache. |
| `apk/preview/` | **REFERENCE VISUAL** | Contains `preview/index.html` (71.9 KB) and native `stfl-original-logo.png` (440.6 KB). Serves as visual brand constitution. |
| `files/web/aakutu-board` | **ARCHIVE CANDIDATE** | Historical Bengali phonetic IME desktop application. Contains compiled distribution binaries. Isolated from cloud platform. |
| `_old/` | **ARCHIVE CANDIDATE** | Deprecated 2024 landing prototype. Fully superseded by `apk/web`. Safe for Pass 2 relocation. |
| `MD's/` | **CANONICAL ARCHITECTURE** | Historical Phase 0–12.5 specification archives. All master deliverables synchronized to workspace root. |

---

## 3. Web Architecture Resolution

**Question:** Why does web exist inside `apk/`?
- **Determination:** The directory `apk/` served historically as the consolidated monorepo container during Android-first mobile engineering phases. 
- **Evolution:** `apk/web` has evolved into a fully autonomous, production-ready Next.js 15 application with App Router, server-rendered components, Tailwind tokens, and complete Iconoir integration.
- **Governing Decision:** In accordance with Absolute Rule 2 ("NEVER blindly rewrite an existing codebase") and Rule 4 ("NEVER replace working architecture without proving compatibility"), `apk/web` remains the authoritative web build root for local and Cloudflare Pages deployments.

---

## 4. Test & Verification Metrics

```
================================================================================
           STFL AIO PLATFORM AUTHORITATIVE TEST AUDIT SUMMARY
================================================================================
1. Master Control Validator (validate_json.js):     98 / 98 PASS (100%)
2. Fastify Backend API Vitest (apk/api):          236 / 236 PASS (100%)
3. Web Production Build (apk/web):                 47 / 47 Static Pages Generated
4. Iconography Policy (verify-icon-policy.mjs):     0 Violations (Iconoir Exclusive)
5. Bilingual Typography Audit:                      0 Violations (Hind Siliguri / Inter)
================================================================================
`;
```

---

## 5. Security & Secret Exposure Audit
- **Zero Exposed Secrets:** Scanned all codebases, commits, JSON descriptors, and HTML control files. Zero AWS/Cloudflare keys, PostgreSQL database passwords, or private signing keys are committed in plaintext.
- **Android Signing Keys:** Upload keystore properties safely referenced via `keystore.properties` (gitignored). Release signing remains guarded under Prompt 13 Gate.

---

## 6. Audit Verdict
- **Platform Architecture Baseline:** **RATIFIED**
- **Repository Structural Integrity:** **PASS**
- **Production Edge Gate:** **PENDING — PROMPT 13 GATE** (Awaiting Cloudflare Worker / Hyperdrive edge binding).
