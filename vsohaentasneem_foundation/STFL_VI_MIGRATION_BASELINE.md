# STFL VI MIGRATION BASELINE
**Baseline Timestamp:** 2026-10-16T15:35:00+08:00  
**Phase:** Pre-Migration State  
**Institutional Custodian:** SohaelTasneem Foundation (STFL)  

---

## 1. System Metadata & Source Control

| Parameter | Current Value |
| :--- | :--- |
| **Repository Path (Canonical Git)** | `C:\Users\ShoebTahseen\Desktop\stfl\main` |
| **Active Web Application Root** | `C:\Users\ShoebTahseen\Desktop\stfl\main\web` |
| **Legacy / Inactive Web Snapshot** | `C:\Users\ShoebTahseen\Desktop\stfl\web` (Forensically confirmed earlier snapshot) |
| **Invalid Directory Audit** | `C:\Users\ShoebTahseen\Desktop\stfl\apk\web` — Forensically verified: **DOES NOT EXIST ON DISK** |
| **Active Git Branch** | `stfl/pre-playstore-2026` |
| **Latest Commit Hash** | `0b2469d chore: ignore nested preview/web repo to avoid accidental embed` |
| **Current Platform Identity** | `STFL AIO` (Legacy Platform Name) |
| **Target Platform Identity** | `STFL VI` (Canonical Unified Institutional Operating Platform) |

---

## 2. Framework & Technical Stack

| Component | Framework / Technology | Version | Key Libraries |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | Next.js (App Router) | 15.1.0 | React 19.0.0, TypeScript 5.7.2, TailwindCSS 4.0.0, iconoir-react |
| **Android Mobile** | Kotlin / Jetpack Compose | 2.0.0 | Material 3, AndroidX Security Crypto, Room Database, Retrofit |
| **API Backend** | Node.js / TypeScript | Node 20+ | Fastify / Express, PostgreSQL (`pg`), jsonwebtoken, WebSocket (`ws`) |
| **Database** | PostgreSQL | 15+ | SQL Migrations (`0001_initial.sql`, `0002_aio_parties_iam.sql`, `0003_grihostios.sql`) |
| **Cloudflare Services** | Cloudflare Workers & R2 | wrangler 3.x | Buckets: `stfl-documents-vault`, `stfl-media-public` |
| **API Domain** | `https://api.stflbd.app` | - | TLS 1.3, Strict CORS, JWT session authorization |
| **Production Domain** | `https://stflbd.app` | - | Canonical web ecosystem deployment |

---

## 3. Information Architecture & Consoles

### Public Web Routes (72 Static Pages Generated)
- **Institutional Core:** `/`, `/about`, `/mission`, `/team`, `/reports`, `/brandcenter`, `/brand`
- **Programs:** `/programs`, `/programs/education`, `/programs/health`, `/programs/community-development`, `/programs/emergency-relief`, `/programs/digital-inclusion`
- **Outcomes & Social Action:** `/impact`, `/projects`, `/events`, `/news`, `/gallery`, `/publications`, `/donate`, `/volunteer`, `/partner`, `/careers`
- **Initiatives & Specialist Verticals:**
  - `/initiatives`
  - `/initiatives/grihostios` (Property, Land, Leases, Agriculture)
  - `/initiatives/hakimsarker` (Prof. Dr. Abdul Hakim Sarker Academic Legacy Archive &bull; `hakimsarker.org`)
  - `/initiatives/qimai` (QiM-AI 2.1 AI Tutor & Research Intelligence Platform &bull; `qimai.codes`)
  - `/initiatives/skillconnect`, `/initiatives/aev-developments`, `/initiatives/maxremit`, `/initiatives/helpex`, `/initiatives/proiozon`, `/initiatives/perlu`, `/initiatives/oiix`
- **Verification & Compliance:** `/verify`, `/v/[id]`, `/demo`, `/contact`, `/faq`, `/privacy`, `/terms`, `/safeguarding`, `/cookies`
- **Roadmap Target:** `/roadmap` (and `/roadmap.html`)

### Governed Enterprise Consoles
- `/admin/executive` &mdash; Institutional Overview, Key Ratios, Real-time Alerts
- `/admin/governance` &mdash; Board Resolutions, Policy Registers, Dual-Control Approvals
- `/admin/iam` &mdash; Identity, Party Registry, RBAC Permissions, Session Suspension
- `/admin/property` &mdash; GrihostiOS Land, Buildings, Units, Tenancy Leases, Crop Shares
- `/admin/finance` &mdash; General Ledger, Vouchers, Disbursements, Microfinance
- `/admin/compliance` &mdash; Legal Obligations, Tax Withholding, Statutory Returns
- `/admin/knowledge` &mdash; Enterprise Knowledge Base, Document Intelligence, RAG Ingestion

---

## 4. Brand & Typography Baseline

| Token / Asset | Current Baseline State | Target Migration State |
| :--- | :--- | :--- |
| **Platform Name** | STFL AIO | **STFL VI** |
| **Tagline** | Autonomous Enterprise Platform | Unified Institutional Operating Platform |
| **Bengali Headers** | Hind Siliguri (weights: 400, 500, 600, 700) | **Hind Siliguri (PRESERVED UNCHANGED)** |
| **Bengali Body / UI** | Noto Sans Bengali | **Noto Sans Bengali & Baloo Da 2** |
| **English Typography** | Inter (weights: 300, 400, 500, 600, 700) | Inter (Preserved) |
| **Monospace Typography**| JetBrains Mono / Consolas | JetBrains Mono (Technical, Codes & Logs) |
| **Luminous Treatment** | Standard dark theme | Controlled **Bright-White / Neon Signal** (`--stfl-vi-neon`) |
| **Secondary Visual** | Photographic realism | Monochrome Halftone Dot Illustration (`dot-matrix-hero.png`) |
| **Icon Library** | `iconoir-react` exclusively | **Iconoir ONLY (Strict 0-violation policy)** |

---

## 5. Security & Isolation Baseline

- **Tenant & Project Isolation:** Projects maintain partition keys (`project_id`). API routes enforce contextual project scoping.
- **Agent Governance:** Level 3 autonomy ceiling strictly enforced. Agents cannot self-approve expenditures, override legal holds, or alter audit logs.
- **Document Security:** Documents generate SHA-256 digest on submission. QR codes on printed and PDF vouchers route to public verification `/verify` which exposes only sanitized public status (zero PII leakage).
- **Secrets Baseline:** Production secrets are injected via environment variables. Source code contains zero hardcoded production API keys.

---

## 6. Pre-Migration Verification Health

- `npm run verify:icons`: **100% PASS** (Zero prohibited libraries).
- `npm run type-check`: **0 errors**.
- `npm run build`: **Exit code 0** (72 pages built successfully).
- `scripts/verify-live-routes.ps1`: **70 of 70 routes HTTP 200 PASS** on port 4173.
