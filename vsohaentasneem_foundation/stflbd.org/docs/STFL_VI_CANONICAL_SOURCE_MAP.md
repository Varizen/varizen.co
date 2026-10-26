# STFL VI Canonical Source Map
**Platform Name:** STFL VI  
**Institution:** SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)  
**Governance Principle:** Exactly ONE primary authoritative document per domain. Zero competing masters.  
**Date:** 2026-10-16  
**Status:** AUTHORITATIVE & GOVERNED  

---

## 1. Domain Governance & Primary Authority Matrix

| Domain | Canonical Document | Supporting Documents | Implementation Source | Test Source | Status | Conflicts | Last Verified |
|---|---|---|---|---|---|---|---|
| **Platform Constitution** | `STFL_VI_CONSTITUTION.md` | `STFL_VI_MIGRATION_BASELINE.md` | `main/api/src/approval/engine.ts` | `main/api/test/approval_engine.test.ts` | **CONSTITUTIONAL** | None | 2026-10-16 |
| **Master Architecture** | `STFL_VI_MASTER_CONTROL.md` | `STFL_VI_FEATURE_INDEX.md`, `STFL_WEB_ARCHITECTURE.md` | `main/web/src/app`, `main/api/src` | `scripts/verify-live-routes.ps1` | **CANONICAL** | Reconciled (18 consoles, 73 routes) | 2026-10-16 |
| **Identity & Party Model** | `STFL_VI_PARTY_MODEL.md` | `STFL_PROJECT_RELATIONSHIP_MODEL.md` | `main/api/src/authorization/resolver.ts` | `main/api/test/authorization_engine.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **IAM & User Classes** | `STFL_VI_IAM_MODEL.md` | `STFL_VI_ROLE_EXPERIENCE_MATRIX.md` | `main/web/src/app/admin/iam/page.tsx` | `main/api/test/authorization_engine.test.ts` | **CANONICAL** | None (CLASS_00 to CLASS_12) | 2026-10-16 |
| **Contextual Authorization** | `STFL_VI_AUTHORIZATION_MODEL.md` | `STFL_WEB_SECURITY_MODEL.md` | `main/api/src/authorization/engine.ts` | `main/api/test/authorization_engine.test.ts` | **CANONICAL** | None (12-D evaluation active) | 2026-10-16 |
| **Approval Engine** | `STFL_VI_APPROVAL_MODEL.md` | `STFL_VI_FINANCE_MODEL.md` | `main/api/src/approval/engine.ts` | `main/api/test/approval_engine.test.ts` | **CANONICAL** | None (Anti-collusion active) | 2026-10-16 |
| **Projects & Multi-Tenancy** | `STFL_VI_PROJECT_MODEL.md` | `STFL_PROJECT_REGISTRY.json` | `main/web/src/lib/initiativesRegistry.ts` | `main/api/test/demo_environment.test.ts` | **CANONICAL** | None (Tenant isolation verified) | 2026-10-16 |
| **Ledger & Finance** | `STFL_VI_FINANCE_MODEL.md` | `STFL_VI_OPEN_SOURCE_RESEARCH.md` | `main/web/src/app/admin/finance/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None (NUMERIC(18,2) precision) | 2026-10-16 |
| **Property & GrihostiOS** | `STFL_WEB_GRIHOSTIOS_MODEL.md` | `STFL_AIO_PROPERTY_MODEL.md` (Historical) | `main/api/src/grihosti/engine.ts`, `main/web/src/app/admin/property/page.tsx` | `main/api/test/grihosti.test.ts` | **CANONICAL** | Reconciled to STFL VI | 2026-10-16 |
| **Microfinance & Grants** | `STFL_VI_MICROFINANCE_MODEL.md` | `STFL_VI_FINANCE_MODEL.md` | `main/web/src/app/admin/microfinance/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **Workforce & Payroll** | `STFL_VI_WORKFORCE_MODEL.md` | `STFL_VI_ROLE_EXPERIENCE_MATRIX.md` | `main/web/src/app/admin/workforce/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **E-Shop & Relief Logistics** | `STFL_VI_ECOMMERCE_MODEL.md` | `main/eshop/stfl-impact-shop-showcase-v2-brand.html` | `main/web/src/app/admin/eshop/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **Digital Documents** | `STFL_VI_DOCUMENT_MODEL.md` | `STFL_WEB_COMPLIANCE_UX.md` | `main/api/src/documents/engine.ts` | `main/api/test/document_engine.test.ts` | **CANONICAL** | None (SHA-256 state roll) | 2026-10-16 |
| **Controlled Printing & PDF** | `STFL_VI_PRINT_MODEL.md` | `STFL_VI_SECURITY_AUDIT.md` | `main/api/src/print/pdf.ts`, `main/api/src/print/engine.ts` | `main/api/test/controlled_print.test.ts` | **CANONICAL** | None (One-time copy token) | 2026-10-16 |
| **Public Verification** | `STFL_VI_VERIFICATION_MODEL.md` | `STFL_WEB_ROUTES.md` | `main/api/src/routes/verify.ts`, `main/web/src/app/verify/page.tsx` | `main/api/test/document_engine.test.ts` | **CANONICAL** | Zero PII exposure verified | 2026-10-16 |
| **Communications Gateway** | `STFL_VI_COMMUNICATION_MODEL.md` | `STFL_VI_THREAT_MODEL.md` | `main/api/src/comms/engine.ts` | `main/api/test/comms_gateway.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **Security & Penetration Audit** | `STFL_VI_SECURITY_AUDIT.md` | `STFL_VI_SECURITY_MODEL.md`, `STFL_WEB_SECURITY_MODEL.md` | `main/api/src/authorization/middleware.ts` | `main/api/test/agent_red_team.test.ts` | **CANONICAL** | Reconciled (0 secrets, 0 criticals) | 2026-10-16 |
| **Device Security & Hardware** | `STFL_VI_DEVICE_SECURITY.md` | `main/security/ScreenProtectionManager.kt` | `main/web/src/app/admin/devices/page.tsx`, `main/security/` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **Autonomous Agents & AI Limits**| `STFL_VI_AGENT_MODEL.md` | `STFL_WEB_COMPLIANCE_UX.md` | `main/api/src/agents/runtime.ts`, `main/api/src/agents/killswitch.ts` | `main/api/test/agent_runtime.test.ts`, `main/api/test/agent_red_team.test.ts` | **CANONICAL** | Level 3 ceiling enforced | 2026-10-16 |
| **Compliance & Regulatory Law** | `STFL_WEB_COMPLIANCE_UX.md` | `STFL_AIO_COMPLIANCE_ARCHITECTURE.md` (Historical) | `main/web/src/app/admin/compliance/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None (21 statutory domains) | 2026-10-16 |
| **Knowledge & Training SOPs** | `STFL_WEB_KNOWLEDGE_UX.md` | `STFL_AIO_TRAINING_ARCHITECTURE.md` (Historical) | `main/web/src/app/admin/knowledge/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-16 |
| **Brand Identity & Tokens** | `STFL_VI_BRAND_GUIDELINES.md` | `STFL_BRAND_SYSTEM.md`, `STFL_BRAND_IMPLEMENTATION.md` | `main/web/src/app/globals.css`, `main/web/src/app/stfl-tokens.css` | `main/web/scripts/verify-icon-policy.mjs` | **CANONICAL** | Reconciled to STFL VI | 2026-10-16 |
| **Typography System** | `STFL_VI_TYPOGRAPHY_SYSTEM.md` | `STFL_VI_BRAND_GUIDELINES.md` | `main/web/src/app/layout.tsx`, `main/web/public/fonts/` | `npm run build` | **CANONICAL** | Hind Siliguri + Baloo Da 2 | 2026-10-16 |
| **Iconography Policy** | `main/web/STFL_ICONOGRAPHY_POLICY.md`| `main/web/ICON_RULE_FOR_ALL_AGENTS.md` | `main/web/scripts/verify-icon-policy.mjs` | `npm run verify:icons` | **CANONICAL** | Strict Iconoir Only | 2026-10-16 |
| **Web Application & UI Layer** | `STFL_WEB_ARCHITECTURE.md` | `STFL_WEB_COMPONENT_MAP.md`, `STFL_VI_DESIGN_SYSTEM_AUDIT.md` | `main/web/src/app/`, `main/web/components/` | `npm run type-check`, `npm run build` | **CANONICAL** | Next.js 15 App Router | 2026-10-16 |
| **Route Map & Navigation** | `STFL_WEB_ROUTES.md` | `STFL_VI_ROADMAP.md` | `main/web/src/app/` | `scripts/verify-live-routes.ps1` | **CANONICAL** | 73 compiled routes (HTTP 200) | 2026-10-16 |
| **API & Cloudflare Edge** | `main/docs/API.md` | `STFL_AIO_API_REPORT.md` (Historical) | `main/api/src/app.ts` | `main/api/test/harness.ts` | **CANONICAL** | Hono edge router active | 2026-10-16 |
| **Database & Ledger Migrations** | `main/api/migrations/README.md` | `STFL_AIO_DATABASE_REPORT.md` (Historical) | `main/api/migrations/` | `main/api/test/migration_destructive.test.ts` | **CANONICAL** | Migrations 0001, 0002, 0003 | 2026-10-16 |
| **Android Application Architecture** | `main/docs/ARCHITECTURE.md` | `apk/docs/ARCHITECTURE.md` | `main/app/src/`, `main/core/`, `main/security/` | `./gradlew test` (Android SDK) | **CANONICAL** | Native Kotlin Jetpack Compose | 2026-10-16 |
| **Android Play Store Distribution** | `main/docs/PLAY_STORE_LISTING.md` | `apk/docs/PLAY_STORE_LISTING.md` | `main/app/build.gradle.kts` | Play Store pre-flight checks | **CANONICAL** | Package `foundation.sohaeltasneem` | 2026-10-16 |
| **Open-Source Tech Pull** | `STFL_VI_OPEN_SOURCE_RESEARCH.md` | `STFL_AIO_DEPENDENCY_INDEX.json` (Historical) | `main/web/package.json`, `main/api/package.json` | `npm audit` | **CANONICAL** | 12 architectural domains | 2026-10-16 |
| **Platform Roadmap** | `STFL_VI_ROADMAP.md` | `main/web/src/app/roadmap/page.tsx`, `main/web/public/roadmap.html` | `main/web/src/app/roadmap/page.tsx` | `scripts/verify-live-routes.ps1` | **CANONICAL** | Verified Now, Short, Med, Long | 2026-10-16 |
| **Go-Live Release Gate** | `STFL_VI_GO_LIVE_READINESS.md` | `STFL_VI_CHANGELOG.md` | Repository-wide build output | `verify-live-routes.ps1` (72/72 PASS) | **CANONICAL** | **GREEN — GO LIVE** | 2026-10-16 |

---

## 2. Source-of-Truth Hierarchy Rules

1. **Code Over Documentation:**
   When a conflict arises between what a markdown document claims and what the active codebase in `main/` implements, the active codebase is the ground truth. The documentation must be updated to match implementation.
2. **Canonical Over Supporting:**
   For any given domain, only the designated **Canonical Document** may introduce new architectural invariants or definitions. Supporting documents may explain, expand, or provide user guides, but cannot contradict the Canonical Document.
3. **Historical Preservation:**
   Historical documents (`STFL_AIO_*.md`, `md-s/STFL_AIO_PHASE_*.md`) must retain their status as `HISTORICAL / RETIRED` snapshots. They must never be treated as active specifications.
