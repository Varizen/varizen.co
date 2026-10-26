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
| **Domain Separation Architecture** | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` | `STFL_DOMAIN_SEPARATION_EXECUTION_PROMPT.md` | `stflbd.org/src/`, `main/web/src/`, `main/api/src/config/domains.ts` | `scripts/verify-domain-separation.mjs` | **CONSTITUTIONAL** | None | 2026-10-18 |
| **Platform Constitution** | `STFL_VI_CONSTITUTION.md` | `STFL_VI_MIGRATION_BASELINE.md` | `main/api/src/approval/engine.ts` | `main/api/test/approval_engine.test.ts` | **CONSTITUTIONAL** | None | 2026-10-18 |
| **Master Architecture** | `STFL_VI_MASTER_CONTROL.md` | `STFL_VI_FEATURE_INDEX.md`, `STFL_WEB_ARCHITECTURE.md`, `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` | `stflbd.org/src/app`, `main/web/src/app`, `main/api/src` | `scripts/verify-live-domains.ps1` | **CANONICAL** | Reconciled (org vs app separation) | 2026-10-18 |
| **Identity & Party Model** | `STFL_VI_PARTY_MODEL.md` | `STFL_PROJECT_RELATIONSHIP_MODEL.md` | `main/api/src/authorization/resolver.ts` | `main/api/test/authorization_engine.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **IAM & User Classes** | `STFL_VI_IAM_MODEL.md` | `STFL_VI_ROLE_EXPERIENCE_MATRIX.md` | `stflbd.org/src/app/admin/iam/page.tsx` | `main/api/test/authorization_engine.test.ts` | **CANONICAL** | None (CLASS_00 to CLASS_12) | 2026-10-18 |
| **Contextual Authorization** | `STFL_VI_AUTHORIZATION_MODEL.md` | `STFL_WEB_SECURITY_MODEL.md` | `main/api/src/authorization/engine.ts` | `main/api/test/authorization_engine.test.ts` | **CANONICAL** | None (12-D evaluation active) | 2026-10-18 |
| **Approval Engine** | `STFL_VI_APPROVAL_MODEL.md` | `STFL_VI_FINANCE_MODEL.md` | `main/api/src/approval/engine.ts` | `main/api/test/approval_engine.test.ts` | **CANONICAL** | None (Anti-collusion active) | 2026-10-18 |
| **Projects & Multi-Tenancy** | `STFL_VI_PROJECT_MODEL.md` | `STFL_PROJECT_REGISTRY.json` | `stflbd.org/src/lib/initiativesRegistry.ts` | `main/api/test/demo_environment.test.ts` | **CANONICAL** | None (Tenant isolation verified) | 2026-10-18 |
| **Ledger & Finance** | `STFL_VI_FINANCE_MODEL.md` | `STFL_VI_OPEN_SOURCE_RESEARCH.md` | `stflbd.org/src/app/admin/finance/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None (NUMERIC(18,2) precision) | 2026-10-18 |
| **Property & GrihostiOS** | `STFL_WEB_GRIHOSTIOS_MODEL.md` | `STFL_AIO_PROPERTY_MODEL.md` (Historical) | `main/api/src/grihosti/engine.ts`, `stflbd.org/src/app/admin/property/page.tsx` | `main/api/test/grihosti.test.ts` | **CANONICAL** | Reconciled to STFL VI | 2026-10-18 |
| **Microfinance & Grants** | `STFL_VI_MICROFINANCE_MODEL.md` | `STFL_VI_FINANCE_MODEL.md` | `stflbd.org/src/app/admin/microfinance/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **Workforce & Payroll** | `STFL_VI_WORKFORCE_MODEL.md` | `STFL_VI_ROLE_EXPERIENCE_MATRIX.md` | `stflbd.org/src/app/admin/workforce/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **E-Shop & Relief Logistics** | `STFL_VI_ECOMMERCE_MODEL.md` | `main/eshop/stfl-impact-shop-showcase-v2-brand.html` | `stflbd.org/src/app/admin/eshop/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **Digital Documents** | `STFL_VI_DOCUMENT_MODEL.md` | `STFL_WEB_COMPLIANCE_UX.md` | `main/api/src/documents/engine.ts`, `stflbd.org/src/app/admin/documents/page.tsx` | `main/api/test/document_engine.test.ts` | **CANONICAL** | None (SHA-256 state roll) | 2026-10-18 |
| **Controlled Printing & PDF** | `STFL_VI_PRINT_MODEL.md` | `STFL_VI_SECURITY_AUDIT.md` | `main/api/src/print/pdf.ts`, `main/api/src/print/engine.ts` | `main/api/test/controlled_print.test.ts` | **CANONICAL** | None (One-time copy token) | 2026-10-18 |
| **Public Verification** | `STFL_VI_VERIFICATION_MODEL.md` | `STFL_WEB_ROUTES.md` | `main/api/src/routes/verify.ts`, `main/web/src/app/verify/page.tsx` | `main/api/test/document_engine.test.ts` | **CANONICAL** | Zero PII exposure verified (permanent on stflbd.app) | 2026-10-18 |
| **Communications Gateway** | `STFL_VI_COMMUNICATION_MODEL.md` | `STFL_VI_THREAT_MODEL.md` | `main/api/src/comms/engine.ts`, `stflbd.org/src/app/admin/communications/page.tsx` | `main/api/test/comms_gateway.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **Security & Penetration Audit** | `STFL_VI_SECURITY_AUDIT.md` | `STFL_VI_SECURITY_MODEL.md`, `STFL_WEB_SECURITY_MODEL.md` | `main/api/src/authorization/middleware.ts`, `stflbd.org/src/app/admin/security/page.tsx` | `main/api/test/agent_red_team.test.ts` | **CANONICAL** | Reconciled (0 secrets, 0 criticals) | 2026-10-18 |
| **Device Security & Hardware** | `STFL_VI_DEVICE_SECURITY.md` | `main/security/ScreenProtectionManager.kt` | `stflbd.org/src/app/admin/devices/page.tsx`, `main/security/` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **Autonomous Agents & AI Limits**| `STFL_VI_AGENT_MODEL.md` | `STFL_WEB_COMPLIANCE_UX.md` | `main/api/src/agents/runtime.ts`, `main/api/src/agents/killswitch.ts`, `stflbd.org/src/app/admin/agents/page.tsx` | `main/api/test/agent_runtime.test.ts` | **CANONICAL** | Level 3 ceiling enforced | 2026-10-18 |
| **Compliance & Regulatory Law** | `STFL_WEB_COMPLIANCE_UX.md` | `STFL_AIO_COMPLIANCE_ARCHITECTURE.md` (Historical) | `stflbd.org/src/app/admin/compliance/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None (21 statutory domains) | 2026-10-18 |
| **Knowledge & Training SOPs** | `STFL_WEB_KNOWLEDGE_UX.md` | `STFL_AIO_TRAINING_ARCHITECTURE.md` (Historical) | `stflbd.org/src/app/admin/knowledge/page.tsx` | `main/api/test/governed_consoles.test.ts` | **CANONICAL** | None | 2026-10-18 |
| **Brand Identity & Tokens** | `STFL_VI_BRAND_GUIDELINES.md` | `STFL_BRAND_SYSTEM.md`, `STFL_BRAND_IMPLEMENTATION.md` | `stflbd.org/src/app/globals.css`, `stflbd.org/src/app/stfl-tokens.css` | `stflbd.org/scripts/verify-icon-policy.mjs` | **CANONICAL** | Reconciled to STFL VI | 2026-10-18 |
| **Typography System** | `STFL_VI_TYPOGRAPHY_SYSTEM.md` | `STFL_VI_BRAND_GUIDELINES.md` | `stflbd.org/src/app/layout.tsx`, `main/web/src/app/layout.tsx` | `npm run build` | **CANONICAL** | Hind Siliguri + Baloo Da 2 | 2026-10-18 |
| **Iconography Policy** | `stflbd.org/STFL_ICONOGRAPHY_POLICY.md`| `stflbd.org/ICON_RULE_FOR_ALL_AGENTS.md` | `stflbd.org/scripts/verify-icon-policy.mjs` | `npm run verify:icons` | **CANONICAL** | Strict Iconoir Only | 2026-10-18 |
| **Web Application & UI Layer** | `STFL_WEB_ARCHITECTURE.md` | `STFL_WEB_COMPONENT_MAP.md`, `STFL_VI_DESIGN_SYSTEM_AUDIT.md` | `stflbd.org/src/` (Org + Workspace), `main/web/src/` (App Landing) | `npm run type-check`, `npm run build` | **CANONICAL** | Next.js 15 App Router | 2026-10-18 |
| **Route Map & Navigation** | `STFL_WEB_ROUTES.md` | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` | `stflbd.org/src/app/`, `main/web/src/app/` | `scripts/verify-domain-separation.mjs` | **CANONICAL** | Domain separated routes | 2026-10-18 |
| **API & Cloudflare Edge** | `main/docs/API.md` | `STFL_AIO_API_REPORT.md` (Historical) | `main/api/src/app.ts` | `main/api/test/harness.ts` | **CANONICAL** | Hono edge router active | 2026-10-18 |
| **Database & Ledger Migrations** | `main/api/migrations/README.md` | `STFL_AIO_DATABASE_REPORT.md` (Historical) | `main/api/migrations/` | `main/api/test/migration_destructive.test.ts` | **CANONICAL** | Migrations 0001, 0002, 0003 | 2026-10-18 |
| **Android Application Architecture** | `main/docs/ARCHITECTURE.md` | `apk/docs/ARCHITECTURE.md` | `main/app/src/`, `main/core/`, `main/security/` | `./gradlew test` (Android SDK) | **CANONICAL** | Native Kotlin Jetpack Compose | 2026-10-18 |
| **Android Play Store Distribution** | `main/docs/PLAY_STORE_LISTING.md` | `apk/docs/PLAY_STORE_LISTING.md` | `main/app/build.gradle.kts` | Play Store pre-flight checks | **CANONICAL** | Package `foundation.sohaeltasneem` | 2026-10-18 |
| **Open-Source Tech Pull** | `STFL_VI_OPEN_SOURCE_RESEARCH.md` | `STFL_AIO_DEPENDENCY_INDEX.json` (Historical) | `stflbd.org/package.json`, `main/web/package.json`, `main/api/package.json` | `npm audit` | **CANONICAL** | 12 architectural domains | 2026-10-18 |
| **Platform Roadmap** | `STFL_VI_ROADMAP.md` | `main/web/src/app/roadmap/page.tsx` | `main/web/src/app/roadmap/page.tsx` | `scripts/verify-domain-separation.mjs` | **CANONICAL** | Verified Now, Short, Med, Long | 2026-10-18 |
| **Go-Live Release Gate** | `STFL_VI_GO_LIVE_READINESS.md` | `STFL_VI_CHANGELOG.md` | Repository-wide build output | `verify-domain-separation.mjs` | **CANONICAL** | **GREEN — GO LIVE** | 2026-10-18 |

---

## 2. Source-of-Truth Hierarchy Rules

1. **Code Over Documentation:**
   When a conflict arises between what a markdown document claims and what the active codebase in `main/` implements, the active codebase is the ground truth. The documentation must be updated to match implementation.
2. **Canonical Over Supporting:**
   For any given domain, only the designated **Canonical Document** may introduce new architectural invariants or definitions. Supporting documents may explain, expand, or provide user guides, but cannot contradict the Canonical Document.
3. **Historical Preservation:**
   Historical documents (`STFL_AIO_*.md`, `md-s/STFL_AIO_PHASE_*.md`) must retain their status as `HISTORICAL / RETIRED` snapshots. They must never be treated as active specifications.
