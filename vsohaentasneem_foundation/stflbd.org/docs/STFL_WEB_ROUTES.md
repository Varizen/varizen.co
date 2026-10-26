# STFL Web Route Inventory & Navigation Matrix
**Institution:** SohaelTasneem Foundation  
**Canonical Domain:** `https://stflbd.app`  
**Total Compiled Routes:** 61  
**Status:** LOCKED & COMPILED (Next.js 15 App Router)  

---

## 1. Public Institutional Routes

| Route | Mode | Title (EN / BN) | Description |
|---|---|---|---|
| `/` | Static | Home / নীড়পাতা | Master 12-section institutional landing page. |
| `/about` | Static | About Us / আমাদের সম্পর্কে | Institutional origin, philosophy, governance, and history. |
| `/mission` | Static | Mission & Vision / লক্ষ্য ও দৃষ্টিভঙ্গি | Strategic vision, long-term roadmap (2032/2035), operating principles. |
| `/roadmap` | Static | Platform Roadmap / প্ল্যাটফর্ম রোডম্যাপ | STFL VI verified capabilities matrix and development horizons. |
| `/team` | Static | Leadership & Governance / পরিচালনা ও নেতৃত্ব | Board of Trustees, executive directors, advisory council. |
| `/reports` | Static | Annual Reports & Audits / বার্ষিক প্রতিবেদন ও অডিট | Audited financial disclosures, statutory filings, governance statements. |
| `/impact` | Static | Impact & Measurement / প্রভাব ও পরিমাপ | 5-stage impact pipeline, evidence framework, verifiable changes. |
| `/projects` | Static | Project Directory / প্রকল্পসমূহ | Autonomous field projects under STFL governance. |
| `/projects/[projectId]` | Dynamic | Project Workspace / প্রকল্প বিবরণ | Specific project public overview and stakeholder portal entry. |
| `/events` | Static | Events & Assemblies / অনুষ্ঠান ও সম্মেলন | Official stakeholder assemblies, verification clinics, community forums. |
| `/news` | Static | News & Media / সংবাদ ও ডিসপ্যাচ | Press releases, field updates, institutional announcements. |
| `/gallery` | Static | Media Gallery / চিত্রশালা | Authentic, dignified field photography and community documentation. |
| `/publications` | Static | Publications & Papers / প্রকাশনা ও গবেষণা | Whitepapers, field study findings, operational guidelines. |
| `/contact` | Static | Contact Us / যোগাযোগ | Verified Dhaka HQ address, official email (`hi@stflbd.email`), hotline. |
| `/faq` | Static | Frequently Asked Questions / সাধারণ জিজ্ঞাসা | Verified institutional queries, donation policies, governance. |

---

## 2. Programmatic Strategic Domains

| Route | Mode | Domain | Focus Area |
|---|---|---|---|
| `/programs` | Static | Overview / সার্বিক কর্মসূচি | Overview of 4 active pillars and roadmap horizons (2028–2035). |
| `/programs/education` | Static | Domain 01: Education / শিক্ষা | Schooling access, study hubs, digital literacy kits, scholarships. |
| `/programs/health` | Static | Domain 02: Healthcare / স্বাস্থ্য | Mobile health camps, maternal care, essential medicine vouchers. |
| `/programs/community-development`| Static | Domain 03: Community Dev / উন্নয়ন | Micro-enterprise grants, clean water tube-wells, rural linkages. |
| `/programs/emergency-relief` | Static | Domain 04: Emergency / জরুরি সহায়তা | Rapid-response disaster relief, flood recovery, winter clothing. |

---

## 3. Public Participation & Legal Disclosures

| Route | Mode | Title | Purpose |
|---|---|---|---|
| `/donate` | Static | Financial Support / অনুদান | Multi-channel donation instructions (Bank, bKash, Nagad, Wire). |
| `/volunteer` | Static | Volunteer Pathways / স্বেচ্ছাসেবী | Field volunteers, technical fellows, community organizers. |
| `/partner` | Static | Institutional Partnerships / অংশীদারিত্ব | NGO, academic, foundation, and corporate partnership pathways. |
| `/careers` | Static | Careers & Fellowships / কর্মসংস্থান | Mission-aligned employment, field research fellowships. |
| `/brand` | Static | Brand Guidelines / ব্র্যান্ড নির্দেশিকা | Complete logo rules, color tokens, typography, correct/incorrect usage. |
| `/privacy` | Static | Privacy Policy / গোপনীয়তা নীতি | Data protection, minimal data collection, zero third-party tracking. |
| `/terms` | Static | Terms of Service / ব্যবহারের শর্তাবলী | Platform terms, legal definitions, user obligations. |
| `/safeguarding` | Static | Safeguarding Framework / সুরক্ষা নীতিমালা | Child protection, vulnerable adult safety, whistleblowing channels. |
| `/cookies` | Static | Cookie Policy / কুকি নীতি | Strict zero-tracking stance, essential session cookies only. |

---

## 4. Cryptographic Verification Endpoints

| Route | Mode | Purpose | Minimal Safe Information Exposed |
|---|---|---|---|
| `/verify` | Static | Public Verification Portal | Interactive lookup for documents, receipts, vouchers, and certificates. |
| `/verify/[documentId]` | Dynamic | Document Direct Verification | Cryptographic hash match, issue date, status (`VALID`, `REVOKED`), issuer. |
| `/v/[code]` | Dynamic | Shortlink QR Target | Compact URL verification target embedded in physical QR codes. |

---

## 5. Operations & Workspace Experiences

| Route | Mode | Workspace | Operational Focus |
|---|---|---|---|
| `/operations` | Static | Field Operations | Daily project workflows, task queues, dispatch rosters. |
| `/outcomes` | Static | Outcome Metrics | Field evidence tracking, verified outcome reporting. |
| `/finance` | Static | Consolidated Finance | High-level ledger views, budget tracking, financial controls. |
| `/compliance` | Static | Compliance Desk | Multi-jurisdiction rules, regulatory holds, policy checks. |
| `/people` | Static | People & Workforce | Team directory, field staff roles, volunteers. |
| `/documents` | Static | Document Registry | Master repository of immutable STFL documents. |
| `/governance` | Static | Governance Oversight | Board resolutions, trustee decisions, audit trail. |
| `/demo` | Static | Isolated Demo Sandbox | Deterministic testing environment marked "DEMO / NON-PRODUCTION". |

---

## 6. Governed Administrative Consoles (`/admin/*`)

| Route | Mode | Console Name | Governed Capability |
|---|---|---|---|
| `/admin` | Static | STFL VI Workspace (Legacy: STFL AIO) | Project-first dashboard answering "What changed? What requires action?" |
| `/admin/property` | Static | **GrihostiOS** | Property, lease, rent, land classification, agriculture, crop share. |
| `/admin/iam` | Static | IAM & Identity | Roles CLASS_00 to CLASS_12, credentials, scoped permissions. |
| `/admin/governance` | Static | Trustee Governance | Resolutions, committee records, policy ratifications. |
| `/admin/executive` | Static | Executive Management | Programmatic strategy, cross-project portfolio consolidation. |
| `/admin/finance` | Static | Finance & Ledger | Chart of accounts, vouchers, disbursements, reconciliations. |
| `/admin/microfinance` | Static | Microfinance & Grants | Revolving community funds, grant disbursements, repayment tracking. |
| `/admin/workforce` | Static | Workforce & HR | Officer assignments, field payroll, attendance records. |
| `/admin/eshop` | Static | E-Shop & Logistics | Fair-trade artisanal products, relief supply chain inventory. |
| `/admin/projects` | Static | Project Management | Multi-project setup, stakeholder provisioning, milestone tracking. |
| `/admin/assets` | Static | Asset Inventory | Fixed assets, vehicles, solar installations, medical devices. |
| `/admin/documents` | Static | Document Lifecycle | Draft, Review, Approve, Issue, Revoke, Hash auditing. |
| `/admin/communications`| Static | Communications Gateway | SMS broadcasts, emergency notifications, formal letters. |
| `/admin/security` | Static | Security & Audit | Threat detection, audit log streaming, session controls. |
| `/admin/agents` | Static | Autonomous Agents | Level 1–3 autonomous agents, kill switches, audit logs. |
| `/admin/devices` | Static | Device Fleet | Registered Android devices, hardware attestations. |
| `/admin/system` | Static | System Diagnostics | Cloudflare worker status, database connectivity, cache metrics. |
| `/admin/compliance` | Static | Compliance Engine | Rule definitions, statutory audits, compliance escalations. |
| `/admin/knowledge` | Static | Knowledge & Training | Training modules, operational SOPs, field manuals. |
