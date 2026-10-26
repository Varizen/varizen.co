# STFL VI — Developer Implementation Register
## *"Where Do I Change This?" — Authoritative Architecture Map*
**Platform Name:** STFL VI  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Purpose:** Developer operational lookup for making safe, regression-free platform modifications.  
**Date:** 2026-10-16  
**Status:** AUTHORITATIVE & GOVERNED  

---

## 1. Quick Modification Safety Matrix

| Capability / Subsystem | Source of Truth | Web Location | Android Location | Backend / API Location | Database Location | Test Location | Safe to Modify? |
|---|---|---|---|---|---|---|---|
| **Platform Branding & Name** | `STFL_VI_BRAND_GUIDELINES.md` | `main/web/src/app/layout.tsx`, `components/Navigation.tsx`, `components/Footer.tsx` | `main/core/.../brand/Brand.kt` | `main/api/src/routes/grihosti.ts` | `migrations/0001_init.sql` | `npm run verify:icons`, `scripts/verify-live-routes.ps1` | **YES** (Follow Brand Rules) |
| **Bengali & English Typography** | `STFL_VI_TYPOGRAPHY_SYSTEM.md` | `main/web/src/app/globals.css`, `public/fonts/` | `main/core/.../design/StflTypography.kt` | `main/api/src/print/pdf.ts` | N/A | `npm run build` | **YES** (Hind Siliguri Headers Mandatory) |
| **Color Tokens & Neon Signals** | `STFL_VI_DESIGN_SYSTEM_AUDIT.md` | `main/web/src/app/globals.css`, `src/app/stfl-tokens.css` | `main/core/.../design/StflPalette.kt` | N/A | N/A | `npm run build` | **YES** (Use `--stfl-vi-*` tokens) |
| **Iconography** | `STFL_ICONOGRAPHY_POLICY.md` | `components/*.tsx`, `src/app/**/*.tsx` | Vector drawables in `res/drawable` | N/A | N/A | `npm run verify:icons` | **RESTRICTED** (Iconoir ONLY) |
| **Public Routes & Navigation** | `STFL_WEB_ROUTES.md` | `main/web/src/app/`, `components/Navigation.tsx` | `main/app/.../navigation/` | N/A | N/A | `scripts/verify-live-routes.ps1` | **YES** (Must register in route map) |
| **GrihostiOS Property & Land** | `STFL_WEB_GRIHOSTIOS_MODEL.md` | `main/web/src/app/admin/property/page.tsx` | `main/app/.../property/` | `main/api/src/grihosti/engine.ts`, `routes/grihosti.ts` | `migrations/0003_grihostios.sql` | `main/api/test/grihosti.test.ts` | **CAUTION** (Legal contract generation) |
| **Digital Rent Receipts** | `STFL_WEB_GRIHOSTIOS_MODEL.md` | `main/web/src/app/admin/property/page.tsx` | N/A | `main/api/src/grihosti/engine.ts` | `receipt_ledger` | `main/api/test/grihosti.test.ts` | **RESTRICTED** (Immutable SHA-256 roll) |
| **Controlled Print & Watermark** | `STFL_VI_PRINT_MODEL.md` | `main/web/src/app/admin/documents/page.tsx` | N/A | `main/api/src/print/pdf.ts`, `engine.ts` | `print_authorizations` | `main/api/test/controlled_print.test.ts` | **CAUTION** (Binary PDF Byte Offset Engine) |
| **Public Document Verification** | `STFL_VI_VERIFICATION_MODEL.md`| `main/web/src/app/verify/page.tsx`, `app/v/[code]/page.tsx` | N/A | `main/api/src/routes/verify.ts` | `document_registry` | `main/api/test/document_engine.test.ts` | **RESTRICTED** (Zero PII Disclosure Rule) |
| **Contextual RBAC (CLASS_00-12)**| `STFL_VI_AUTHORIZATION_MODEL.md`| `main/web/src/app/admin/iam/page.tsx` | `main/security/.../` | `main/api/src/authorization/engine.ts`, `resolver.ts` | `user_roles`, `role_permissions` | `main/api/test/authorization_engine.test.ts` | **HIGH RISK** (Security Boundary) |
| **Separation of Duties (Approval)**| `STFL_VI_APPROVAL_MODEL.md` | `main/web/src/app/admin/governance/page.tsx`| N/A | `main/api/src/approval/engine.ts` | `approvals`, `policies` | `main/api/test/approval_engine.test.ts` | **CRITICAL** (Anti-Collusion Invariant) |
| **Autonomous Agent Ceilings** | `STFL_VI_AGENT_MODEL.md` | `main/web/src/app/admin/agents/page.tsx` | N/A | `main/api/src/agents/runtime.ts`, `budget.ts`, `killswitch.ts` | `agent_registry` | `main/api/test/agent_runtime.test.ts` | **CRITICAL** (Level 3 Ceiling Invariant) |
| **General Ledger & Vouchers** | `STFL_VI_FINANCE_MODEL.md` | `main/web/src/app/admin/finance/page.tsx` | N/A | `main/api/src/routes/consoles.ts` | `accounts`, `journal_entries` | `main/api/test/governed_consoles.test.ts` | **CRITICAL** (Double-Entry Invariant) |
| **Microfinance Grants & Returns**| `STFL_VI_MICROFINANCE_MODEL.md`| `main/web/src/app/admin/microfinance/page.tsx` | N/A | `main/api/src/routes/consoles.ts` | `microfinance_loans` | `main/api/test/governed_consoles.test.ts` | **CAUTION** (Financial Math) |
| **Statutory TDS / VDS Tax Engine**| `STFL_WEB_COMPLIANCE_UX.md` | `main/web/src/app/admin/compliance/page.tsx` | N/A | `main/api/src/routes/consoles.ts` | `compliance_rules` | `main/api/test/governed_consoles.test.ts` | **CAUTION** (BD Statutory Rates) |
| **Communications Gateway (SMS)**| `STFL_VI_COMMUNICATION_MODEL.md`| `main/web/src/app/admin/communications/page.tsx` | N/A | `main/api/src/comms/engine.ts`, `routes/comms.ts` | `comm_logs` | `main/api/test/comms_gateway.test.ts` | **YES** (Provider Adapter) |
| **Device Hardware Attestation** | `STFL_VI_DEVICE_SECURITY.md` | `main/web/src/app/admin/devices/page.tsx` | `main/security/.../DeviceAttestation.kt` | `main/api/src/routes/consoles.ts` | `devices` | `main/api/test/governed_consoles.test.ts` | **HIGH RISK** (KeyStore Verification) |
| **Screen Protection (`FLAG_SECURE`)**| `STFL_VI_DEVICE_SECURITY.md`| N/A | `main/security/.../ScreenProtectionManager.kt` | N/A | N/A | Android Instrumentation Test | **YES** (Field Privacy Shield) |
| **Cloudflare R2 Blob Storage** | `STFL_VI_MASTER_CONTROL.md` | N/A | N/A | `main/api/src/r2.ts` | `document_blobs` | Integration Test | **YES** (S3 Protocol Compatible) |
| **Database Migrations** | `main/api/migrations/README.md` | N/A | N/A | `main/api/scripts/migrate.mjs` | `main/api/migrations/*.sql` | `main/api/test/migration_destructive.test.ts` | **RESTRICTED** (Immutable Rollups) |
| **Local Demo Server Port** | `STFL_WEB_ARCHITECTURE.md` | `main/web/package.json` | N/A | N/A | N/A | `scripts/verify-live-routes.ps1` | **YES** (Port 4173 Standard) |

---

## 2. Detailed Subsystem Modification Guides

### 2.1 Modifying Brand Typography
- **Where to edit:**
  - Headings / Subheadings: Preserve `font-hind` CSS utility or `font-family: 'Hind Siliguri'`. Local fonts reside in `main/web/public/fonts/`.
  - Body & UI: Use `font-noto-bengali` or `Baloo Da 2` imports.
  - Next.js Font Config: `main/web/src/app/layout.tsx`.
- **Files that must also be checked:**
  - `main/web/src/app/globals.css` (Font faces and CSS variables).
  - `main/core/src/main/kotlin/.../design/StflTypography.kt` (Android typography).
  - `main/api/src/print/pdf.ts` (PDF generator font dictionary).
- **Rule:** NEVER replace `Hind Siliguri` on headers or subheaders.

### 2.2 Modifying GrihostiOS Agreements & Clauses
- **Where to edit:**
  - Master Agreement Generator: `main/api/src/grihosti/engine.ts`.
  - Governed Legal Templates Registry: `main/api/src/grihosti/templates.ts`.
  - Web Management Console: `main/web/src/app/admin/property/page.tsx`.
- **Invariants that must not be broken:**
  - Cryptographic hash calculation (SHA-256 across normalized facts).
  - Continuous receipt sequence roll (`GRI-RCP-XXXXX`).
  - Strict zero-PII public verification code generation.
- **Verification Command:**
  - `npx tsx main/api/test/grihosti.test.ts`

### 2.3 Modifying Contextual Authorization & Roles
- **Where to edit:**
  - 12-Dimensional Context Engine: `main/api/src/authorization/engine.ts`.
  - Database Role Resolver: `main/api/src/authorization/resolver.ts`.
  - Hono Security Middleware: `main/api/src/authorization/middleware.ts`.
  - UI Permission Visualizer: `main/web/src/app/admin/iam/page.tsx`.
- **Invariants that must not be broken:**
  - Separation of Duties (Anti-Collusion): Initiator of a high-value disbursement or legal amendment cannot be the approver.
  - Multi-tenant Project Boundary: Tenant `A` cannot read or modify Tenant `B` resources.
- **Verification Command:**
  - `npx tsx main/api/test/authorization_engine.test.ts`
  - `npx tsx main/api/test/approval_engine.test.ts`

### 2.4 Modifying Public Routes
- **Where to edit:**
  - Create route folder under `main/web/src/app/<route-name>/page.tsx`.
  - Update navigation components: `main/web/components/Navigation.tsx` and `main/web/components/Footer.tsx`.
  - Register route in `main/web/docs/STFL_WEB_ROUTES.md`.
  - Add to live route health check: `main/web/scripts/verify-live-routes.ps1`.
- **Verification Command:**
  - `npm run build && pwsh -File scripts/verify-live-routes.ps1`
