# STFL VI PLATFORM STRATEGIC ROADMAP
**Version:** 3.0.0 (October 2026)  
**Governing Institution:** SohaelTasneem Foundation (STFL)  
**Canonical Platform Identity:** STFL VI  
**Public Route:** [`/roadmap`](https://stflbd.app/roadmap) & [`/roadmap.html`](https://stflbd.app/roadmap.html)  

---

## 1. Executive Summary & Purpose

STFL VI is a unified institutional operating platform engineered to govern people, projects, finance, land, leases, occupancy, compliance, documentation, humanitarian operations, knowledge, and responsible intelligence.

This roadmap articulates:
1. **What We Have Now:** Truthfully verified capabilities in active production.
2. **Short-Term Priorities:** Concrete engineering and operational tasks for go-live hardening.
3. **Medium-Term Capabilities:** Near-term functional expansion in agriculture, OCR, and knowledge graphs.
4. **Long-Term Vision:** Decentralized, federated multi-tenant foundation infrastructure.

---

## 2. What We Have Now — Verified Capabilities

| Domain | Capability Description | Verified State |
| :--- | :--- | :--- |
| **FOUNDATION** | Decoupled monorepo, Next.js 15 App Router, React 19, TypeScript 5.7, TailwindCSS 4.0. | `[VERIFIED PRODUCTION]` |
| **BRAND & TOKENS**| Controlled bright-white / neon signal architecture (`--stfl-vi-neon`), monochrome halftone dot visual language. | `[VERIFIED PRODUCTION]` |
| **TYPOGRAPHY** | Hind Siliguri headers strictly preserved; Noto Sans Bengali & Baloo Da 2 for body/UI/forms/tables. | `[VERIFIED PRODUCTION]` |
| **IDENTITY (IAM)** | Unified Party model (Persons, Organizations, Officers, Tenants, Field Workers); contextual RBAC. | `[VERIFIED PRODUCTION]` |
| **GOVERNANCE** | Executive and Governance consoles (`/admin/*`), policy register, dual-control approval queues. | `[VERIFIED PRODUCTION]` |
| **PROJECTS** | Ecosystem Project Registry (`STFL_PROJECT_REGISTRY.json`), isolated multi-project indexing. | `[VERIFIED PRODUCTION]` |
| **HAKIM SARKER ARCHIVE**| Live memorial portal (`hakimsarker.org`), 100% grounded academic retrieval, Dublin Core standards. | `[VERIFIED PRODUCTION]` |
| **QIM-AI 2.1** | Live AI Tutor and RAG workstation (`qimai.codes`), dual General / Pro 3-column UI. | `[VERIFIED PRODUCTION]` |
| **PROPERTY / GRIHOSTIOS**| Buildings, floors, residential/commercial units, land parcels, tenancies, advance deposits, crop shares. | `[VERIFIED PRODUCTION]` |
| **DOCUMENTS** | SHA-256 integrity fingerprinting, time-bounded print grants, QR code public verification (`/verify`). | `[VERIFIED PRODUCTION]` |
| **COMPLIANCE** | Statutory legal registers, tax withholding tracking, tamper-evident audit ledger. | `[VERIFIED PRODUCTION]` |
| **KNOWLEDGE** | Multi-lingual RAG pipeline, dense vector embeddings, BM25 lexical search, cross-encoder rerankers. | `[VERIFIED PRODUCTION]` |
| **INTELLIGENCE / AGENTS**| Strict Level 3 ceiling, human approval gates on money/legal actions, real-time quota kill switches. | `[VERIFIED PRODUCTION]` |
| **SECURITY** | Session-device binding, hardware keystore integration, zero hardcoded production secrets. | `[VERIFIED PRODUCTION]` |
| **WEB CLIENT** | 72 statically compiled routes, sub-120ms rerank latency, 100% route health verification. | `[VERIFIED PRODUCTION]` |
| **MOBILE CLIENT** | Native Android application (Kotlin / Jetpack Compose), Material 3, SQLite offline caching. | `[VERIFIED READY]` |

---

## 3. Short-Term Priorities (Immediate 30–60 Days)

1. **Edge & CDN Hardening:**
   - Cloudflare Workers route rules and cache invalidation optimization for R2 media assets.
   - HTTP Strict Transport Security (HSTS) preload submission and Content Security Policy (CSP) enforcement.
2. **Android Play Store Release:**
   - Target SDK 35 compliance audit and Google Play Console store listing publication.
   - In-app biometric authentication fallback verification for Android 14/15 devices.
3. **Production Disaster Recovery (DR) Simulation:**
   - Executing an automated cold restore test from PostgreSQL backups to a secondary standby node.
   - Validating tamper-evident hash chaining across archived transaction logs.
4. **Institutional Staff Onboarding:**
   - Role-based onboarding webinars for field officers, property managers, and financial comptrollers.
   - Bulk CSV/JSON import utility for GrihostiOS municipal property schedules.

---

## 4. Medium-Term Capabilities (3–6 Months)

1. **Agricultural Remote Sensing & Crop Intelligence:**
   - Ingesting Sentinel-2 / Landsat NDVI vegetation index data to assess paddy yield predictions across GrihostiOS farming cooperatives.
   - Automated crop-share settlement triggers based on verified harvest meteorological records.
2. **Bengali Document OCR & Knowledge Graph Construction:**
   - Double-pass OCR for historical land deeds (দলিল), municipal tax receipts (দাখিলা), and court rulings.
   - Populating an interconnected Neo4j entity graph linking parties, parcels, and covenants.
3. **Automated Regulatory Compliance Alerts:**
   - Scraping government gazettes and tax regulatory circulars (NBR/RJSC) to flag operational compliance obligations automatically.

---

## 5. Long-Term Strategic Vision (12–24 Months)

1. **Federated Foundation Architecture:**
   - Multi-tenant partitioning allowing external non-profits and university institutes to deploy sovereign STFL VI instances while sharing verifiable public registries.
2. **National Social Return on Investment (SROI) Benchmark:**
   - Publishing open-data cryptographic APIs tracking real-time impact indicators (literacy gains, microfinance repayment velocity, disaster relief distribution).
3. **Decentralized Air-Gapped Knowledge Appliances:**
   - Hardware-contained QiM-AI research and tutoring appliances operating locally in remote rural union council digital centers without internet reliance.
