# STFL AIO — Baseline Architecture & Inventory Report

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-BASELINE-V1`  
**Date:** 2026-10-15  
**Author:** Principal Systems Architect & Engineering Team  
**Status:** PHASE 0 DISCOVERY COMPLETE — BASELINE RATIFIED (NON-DESTRUCTIVE)

---

## 1. Executive Summary & Protective Declaration

This document establishes the authoritative baseline inventory of the entire SohaelTasneem Foundation repository before any new autonomous agent or enterprise capabilities are introduced.

> [!IMPORTANT]
> **PROTECTED ASSETS DECLARATION**  
> Under no circumstances will existing modules, codebases, schemas, migrations, API contracts, design tokens, UI slices, or official document templates be deleted, overwritten, or modified destructively. All additions are **strictly additive and non-breaking**.

---

## 2. Inventory of Existing Modules & Workspaces

The repository contains five distinct application sub-ecosystems operating under unified domain standards:

| Path / Module | Technology Stack | Status | Primary Purpose |
|---|---|---|---|
| `apk/` (Root) | Gradle 9.8.1, Kotlin 2.0+, Android SDK 26–37 | Active Build | Root project for official STFL Android application |
| `apk/app/` | Kotlin, Jetpack Compose, DI Container | Verified Pass | Android Application entrypoint (`StflApplication`, `MainActivity`) |
| `apk/core/` | Kotlin, Jetpack Compose, Material 3 | Complete | Design system: STFL brand colors, typography (Hind Siliguri / Inter), spacing, theme |
| `apk/domain/` | Pure Kotlin (no Android dependencies) | Complete | Enterprise models (`Account`, `Program`, `Story`, `Impact`, `Private`), repository contracts |
| `apk/data/` | Kotlin, Coroutines, Flow | Verified Pass | Repository implementations (`AuthRepositoryImpl`, `ContentRepositoryImpl`), session state |
| `apk/network/` | Ktor 3.6.0, OkHttp engine, kotlinx.serialization | Verified Pass | Client API contract (`StflApi`, `StflApiClient`), DTO mappings, auth interceptors |
| `apk/database/` | Room 2.8.5, SQLite | Complete | Offline-first reactive generic cache (`CachedEntity`, `StflDatabase`) |
| `apk/security/` | Android KeyStore, EncryptedSharedPreferences | Complete | Hardware-backed token storage (`SecureStorageImpl`), redacted logging (`SecureLogger`) |
| `apk/ui/` | Jetpack Compose, Flow, StateFlow | Slice Complete | Screen navigation slice (`VerticalSlice`: Splash → Login → Home → Profile) |
| `apk/notifications/` | FCM (Firebase Cloud Messaging) stub | Skeleton | Push notification channels, deep-link router structure |
| `apk/devmockserver/` | Pure JVM Kotlin, JDK `HttpServer` | Verified Pass | Standalone zero-dependency development mock backend (runs on port 8080) |
| `apk/api/` | TypeScript 5.9, Hono 4.9, Node/Cloudflare Worker | Verified Pass | Production Backend API (`https://stflbd.app/api/v1`) |
| `apk/preview/web/` | Next.js 15, React 19, TypeScript, Tailwind | Verified Pass | Official public portal & transparency web application |
| `apk/eshop/` | HTML5, Vanilla CSS, JS | Prototype | STFL Impact Gift Shop prototype showcases |
| `official_doc/` | Raw High-Res Visual Assets (PNG/JPG) | Protected | 12 authoritative letterheads, certificate backgrounds, notice templates |
| `files/web/aakutu-board/` | Electron 38, TypeScript 5.8, Vitest | Standalone | Cross-platform Bangla phonetic input & linguistic quality engine |

---

## 3. Existing Database Architecture & Schemas

The active database runtime is **PostgreSQL 16**. Authoritative migrations reside in [`apk/api/migrations/`](file:///c:/Users/ShoebTahseen/Desktop/stfl/apk/api/migrations).

### 3.1 Active Database Migration: `0001_init.sql`
The database uses `pgcrypto` for UUID generation and strictly enforces `NUMERIC(18, 2)` for monetary values (never floating-point numbers).

* **Identity & Access Management:**
  * `users`: `id` (UUID pk), `email` (unique), `password_hash` (argon2id/scrypt), `display_name`, `locale` ('bn'/'en'), `is_active`, `failed_logins`, `locked_until`, `last_login_at`, timestamps.
  * `roles`: `id` (Serial pk), `code` (unique: `'authenticated'`, `'staff'`, `'admin'`), `description`.
  * `permissions`: `id` (Serial pk), `code` (unique: `'content.read'`, `'content.write'`, `'submission.read'`, `'property.read'`, `'document.private.read'`, `'financial.read'`, `'user.manage'`, `'audit.read'`), `description`.
  * `role_permissions`: Composite PK (`role_id`, `permission_id`).
  * `user_roles`: Composite PK (`user_id`, `role_id`), `granted_at`.
  * `refresh_tokens`: `id` (UUID), `user_id`, `token_hash` (SHA-256 unique), `device_label`, `expires_at`, `revoked_at`, `replaced_by` (self-referential for reuse detection).

* **Public Content Tables:**
  * `programs`: `id`, `slug` (unique), `title_bn`, `title_en`, `summary_bn`, `summary_en`, `body_bn`, `body_en`, `category`, `accent`, `status` (`'draft'`, `'published'`, `'archived'`), `sort_order`, `published_at`.
  * `projects`: `id`, `slug`, `title_bn`, `title_en`, `summary_bn`, `summary_en`, `body_bn`, `body_en`, `program_id` (fk), `status`, `progress_note`, `started_on`, `published_at`.
  * `news`: `id`, `slug`, `title_bn`, `title_en`, `summary_bn`, `summary_en`, `body_bn`, `body_en`, `status`, `published_at`.
  * `events`: `id`, `slug`, `title_bn`, `title_en`, `location_bn`, `location_en`, `starts_at`, `ends_at`, `status`. Constraint: `ends_at >= starts_at`.
  * `gallery_items`: `id`, `slug`, `title_bn`, `title_en`, `r2_key` (`CHECK r2_key LIKE '/public/%'`), `mime_type`, `byte_size`, `width`, `height`.
  * `pages`: `id`, `slug`, `title_bn`, `title_en`, `body_bn`, `body_en`, `status`.
  * `impact_metrics`: `id`, `code` (unique), `label_bn`, `label_en`, `value` (`NUMERIC(18,2)`), `unit`, `verified` (boolean). Constraint: `CHECK (value IS NULL OR verified = TRUE)`.

* **Public Submissions:**
  * `contact_submissions`: `id`, `name`, `email`, `phone`, `subject`, `message`, `locale`, `status` (`'new'`, `'in_review'`, `'closed'`, `'spam'`).

* **Private Domain Tables (Restricted RBAC):**
  * `properties`: `id`, `owner_user_id` (fk users), `name`, `address`, `notes`, timestamps.
  * `private_documents`: `id`, `property_id` (fk properties), `title`, `r2_key` (`CHECK r2_key LIKE '/private/%'`), `mime_type`, `byte_size`.
  * `ledger_entries`: `id`, `property_id` (fk properties), `entry_date`, `description`, `amount` (`NUMERIC(18,2)`), `currency` (`CHAR(3)` DEFAULT `'BDT'`), `kind` (`'credit'`/`'debit'`).
  * `maintenance_records`: `id`, `property_id` (fk), `title`, `details`, `performed_on`.

* **Audit Logging:**
  * `audit_logs`: `id` (BigSerial pk), `actor_id` (fk users), `action`, `entity`, `entity_id`, `request_id`, `ip_hash`, `created_at`.

### 3.2 Architectural Blueprint in Documentation (`apk/docs/DATABASE.md`)
The design specification documents a dual-schema model (`public` vs `private` PostgreSQL schemas) with dedicated DB users (`stfl_api_public` and `stfl_api_private`).
* Future schemas to align: `tenancies`, `property_income`, `property_expenses`, `verification_codes`, `device_tokens`, and extended role hierarchy (`SUPER_ADMIN`, `AUTHORIZED_MEMBER`, `EDITOR`, `VOLUNTEER`).

---

## 4. Existing API Routes & Contracts

The API is built using **Hono v4** running on Cloudflare Workers / Node.js runtime, exposed under the canonical path:  
`https://stflbd.app/api/v1`

### 4.1 System & App Config
* `GET /api/v1/health` — Public liveness probe (status, environment, binding health without exposing secrets).
* `GET /api/v1/health/db` — Authenticated readiness probe (`SELECT 1 AS ok`).
* `GET /api/v1/app/config` — Bootstrap config (feature flags, contact info from pages table, legal URLs, version checks, ETag support).
* `GET /api/v1/media/url?key=...` — Resolves versioned public media URLs (`CHECK key LIKE '/public/%'`).

### 4.2 Authentication & Session Management
* `POST /api/v1/auth/login` — Rate-limited (10/min). Verifies credentials against Argon2id hash. Issues short-lived JWT access token (1h) + rotating refresh token (30 days). Increments `failed_logins` with account locking after 8 attempts for 15 minutes.
* `POST /api/v1/auth/refresh` — Rate-limited (30/min). Rotates refresh token on every use; presents reuse detection (revokes token family if reused).
* `POST /api/v1/auth/logout` — Revokes single refresh token.
* `GET /api/v1/auth/me` — Returns authenticated user profile, roles, and permissions.
* `GET /api/v1/me/sessions` — Lists active login sessions for current user.
* `DELETE /api/v1/me/sessions/:id` — Revokes specific session.

### 4.3 Content Endpoints (Cached Public Edge)
* `GET /api/v1/programs`, `GET /api/v1/programs/:slug`
* `GET /api/v1/projects`, `GET /api/v1/projects/:slug`
* `GET /api/v1/news`, `GET /api/v1/news/:slug`
* `GET /api/v1/events`, `GET /api/v1/events/:slug`
* `GET /api/v1/gallery`
* `GET /api/v1/pages/:slug`
* `GET /api/v1/impact`

### 4.4 Submissions
* `POST /api/v1/contact` — Rate-limited (5/5min). Validates name, email, phone, message; records in `contact_submissions`.

### 4.5 Private Domain Endpoints (Guarded by RBAC & Object Ownership)
* `GET /api/v1/private/properties` — Requires `property.read`. Scoped to caller's `owner_user_id`.
* `GET /api/v1/private/properties/:id` — Scoped query (returns 404 for non-owned properties to prevent IDOR enumeration).
* `GET /api/v1/private/properties/:id/documents` — Requires `document.private.read`.
* `POST /api/v1/private/documents/:id/url` — Requires `document.private.read`. Returns AWS S3/R2 signed URL valid for 300 seconds.
* `GET /api/v1/private/financial/ledger` — Requires `financial.read`. Lists user's ledger entries.
* `GET /api/v1/private/maintenance` — Requires `property.read`. Lists maintenance tasks.

---

## 5. Existing Android Architecture & Capabilities

* **Application ID:** `foundation.sohaeltasneem.app`
* **Architecture Pattern:** Clean Architecture (unidirectional dependencies: `app → ui → data → network/database/security → domain → core`).
* **Design System (`:core`):**
  * Brand Primary Navy: `#071b2b`, Brand Accent Orange: `#ff7a00`.
  * Typography: Google Fonts `Hind Siliguri` (Bengali) + `Inter` (Latin).
  * 4dp baseline grid system, Material 3 composables.
* **Security Subsystem (`:security`):**
  * Hardware-backed master key generated in `AndroidKeyStore`.
  * AES-256-GCM authenticated encryption via `EncryptedSharedPreferences`.
  * Zero-PII production logging via regex-redacted `SecureLogger`.
* **Offline-First Data Layer (`:data` & `:database`):**
  * `StflDatabase` Room store maintaining `CachedEntity` table.
  * `CacheStore` providing TTL-based cache reads, stale-while-revalidate fallbacks, and automatic cache invalidation.
* **Vertical Slice (`:ui`):**
  * Verified functional vertical slice: Splash Screen → Login Form → Home Dashboard → Session Profile.
  * State management handled via Kotlin `StateFlow` and `AppViewModel`.

---

## 6. Existing Web Application Capabilities

* **Framework:** Next.js 15 (App Router), React 19, TypeScript.
* **Location:** [`apk/preview/web/`](file:///c:/Users/ShoebTahseen/Desktop/stfl/apk/preview/web)
* **Bilingual Support:** Built-in Bangla/English context switcher (`LanguageContext.tsx`).
* **Active Routes (18 verified routes):**
  1. `/` (Landing page with Hero, Mission, Programs preview, Impact stats)
  2. `/about`
  3. `/mission`
  4. `/programs`, `/programs/[slug]`
  5. `/projects`, `/projects/[slug]`
  6. `/news`, `/news/[slug]`
  7. `/events`, `/events/[slug]`
  8. `/impact`
  9. `/gallery`
  10. `/donate`
  11. `/contact`
  12. `/faq`
  13. `/privacy`
  14. `/terms`
  15. `/safeguarding`
  16. `/account-deletion`
  17. `/sitemap.xml`

---

## 7. Existing Document Templates & Assets

The directory [`official_doc/templates/`](file:///c:/Users/ShoebTahseen/Desktop/stfl/official_doc/templates) houses 12 physical/print document templates used for institutional credentials:
* Institutional Letterheads (Bangla & English headers, foundation seal watermark, registered office footer).
* Certificate Backgrounds (Formal borders, trustee signature block, verification QR placeholder).
* Official Notice Layouts (Serial number format, executive issuance metadata).

---

## 8. Existing Security Controls & Guardrails

1. **Password Hashing:** Argon2id with work factor memory 64 MiB, 3 iterations, 4 parallelism.
2. **Token Security:** Short-lived access JWTs (15m to 60m) + single-use rotating refresh tokens stored as SHA-256 hashes.
3. **Session Revocation:** Detection of token reuse triggers instant revocation of the entire token family.
4. **Transport Security:** Strict HTTPS, TLS 1.2+ minimum, cleartext traffic explicitly disabled in Android manifest (`android:usesCleartextTraffic="false"`).
5. **Private Storage Isolation:** Database constraint enforcement ensuring private documents reside only under `/private/` R2 object keys, never under `/public/`.
6. **SQL Parameterization:** Zero string interpolation in SQL queries across repositories; fully parameterized queries prevent injection.
7. **Rate Limiting:** IP-hashed rate limiting on sensitive routes (login: 10/min, refresh: 30/min, contact: 5/5min).

---

## 9. Existing Deployment & Cloud Infrastructure

* **API Runtime:** Cloudflare Workers with Hyperdrive connection pooling.
* **Storage:** Cloudflare R2 bucket (`stfl-media` in production, `stfl-media-staging` in staging).
* **Database Origin:** Managed PostgreSQL 16 instance connected through Cloudflare Hyperdrive.
* **Android Release Pipeline:** Configuration ready in `apk/app/build.gradle.kts` with `minSdk 26`, `targetSdk 37`, `compileSdk 37`. Release build currently blocks dev/localhost URLs via automated safety gate. Blocked only on production `.jks` signing key.

---

## 10. Existing Test Suites & Verification Status

| Test Suite | Module | Test Count | Status | Scope |
|---|---|---|---|---|
| `CacheStoreTest` | `:data` | 5 | PASS | TTL expiry, cache write, stale cache fallback |
| `AuthRepositoryImplTest` | `:data` | 10 | PASS | Token persistence, rotation, session teardown |
| `ContentRepositoryImplTest` | `:data` | 8 | PASS | Network-to-cache sync, offline pagination |
| `SessionWireFormatTest` | `:network` | 6 | PASS | DTO serialization, Ktor payload contracts |
| `MockServerContractTest` | `:devmockserver` | 25 | PASS | Contract validation against API specifications |
| API End-to-End Suite | `apk/api` | 51 | Configured | Real Hono + PostgreSQL test harness |
| Web Build Check | `preview/web` | 18 routes | PASS | Next.js compilation & static asset generation |

---

## 11. Proposed Extension Points for Enterprise AIO Architecture

To implement the 7 autonomous units and the 3 high-security features without modifying existing contracts:

```
[Existing Core: PostgreSQL 16 + Hono API + Kotlin App + Next.js Web]
   │
   ├── Ext Point A: Schema Additions (Additive Migrations)
   │     ├── digital_documents (Canonical immutable document registry)
   │     ├── device_identities (Hardware-backed attestation & approval lifecycle)
   │     ├── print_grants & print_logs (OTPT tokens & forensic copy tracking)
   │     ├── comms_messages & templates (Governed WhatsApp, Email, SMS gateway)
   │     ├── microfinance_* (Borrower profiles, schedules, repayments)
   │     ├── hr_* (Field shifts, geofenced logs, payroll)
   │     └── agent_tasks & agent_audit (Orchestration loop records)
   │
   ├── Ext Point B: Backend Agent Orchestrator Subsystem (`apk/api/src/agents/`)
   │     ├── Tool interfaces with strict schemas (read_ledger, calculate_schedule, etc.)
   │     ├── Authority evaluator (Level 0 Read to Level 5 Dual Control)
   │     └── Human-in-the-loop escalation queues
   │
   ├── Ext Point C: Android Security & Field Subsystem (`apk/security/` & `:ui`)
   │     ├── DeviceIdentityProvider (Hardware KeyStore + MediaDrm + installation ID)
   │     ├── SecureScreenController (FLAG_SECURE for HIGHLY_SENSITIVE screens)
   │     ├── DynamicForegroundWatermark (Subtle moving forensic overlay)
   │     └── FieldProofCollector (Camera proof, signed hashes, optional GPS)
   │
   └── Ext Point D: Public Digital Document Verification (`/verify/:document_id`)
         └── Minimalist tamper-proof proof verification endpoint on Next.js web portal
```

---

## 12. Risks, Conflicts & Unknowns

### 12.1 Technical Risks
1. **Android Hardware Fragmentation:** Budget smartphones in field operations may lack StrongBox Keymaster hardware backing.
   * *Mitigation:* The `DeviceIdentityProvider` will detect KeyStore capabilities and fallback securely to software-backed Android KeyStore with elevated risk scoring.
2. **Offline Transaction Desynchronization:** Field workers recording microfinance cash receipts or property inspections in zero-connectivity areas.
   * *Mitigation:* Local operation UUIDs, cryptographic client signatures, and idempotent server reconciliation queue.
3. **AI Financial Drift / Hallucination:** Agents computing incorrect amortization or balances.
   * *Mitigation:* Strict policy: Autonomous agents **never** compute authoritative numbers internally; they execute PostgreSQL-backed stored calculations and domain arithmetic using `NUMERIC(18,2)`.

### 12.2 Architectural Conflicts Identified & Resolved
1. **Database Schema Divergence:** Active migration `0001_init.sql` uses a single public schema with table prefixes and basic roles (`authenticated`, `staff`, `admin`), while `apk/docs/DATABASE.md` specifies a multi-schema (`public` + `private`) with 8 roles.
   * *Resolution:* In additive migration `0002_aio_core.sql`, we will introduce the enterprise schema and role extensions cleanly while preserving backwards compatibility with `0001_init.sql`.

### 12.3 Known Operational Unknowns
1. **Production SMS/WhatsApp Provider Credentials:** Which specific gateway (e.g. Twilio, Meta WhatsApp Cloud API, Infobip) will be designated for Bangladesh operations. The communication gateway abstraction will support dynamic provider adapters.
2. **Production Android Signing Keystore:** Production `.jks` file is pending trustee generation; development builds continue using debug signing with release safety gates.

---

**Baseline Verification Decision:** Phase 0 Discovery is complete. All existing assets are protected. Baseline signed off for Phase 1 architectural and design specification drafting.
