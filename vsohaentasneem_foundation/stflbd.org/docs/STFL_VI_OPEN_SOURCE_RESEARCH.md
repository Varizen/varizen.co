# STFL VI OPEN-SOURCE TECHNOLOGY RESEARCH & PULL STRATEGY
**Evaluation Date:** October 2026  
**Auditor:** Open-Source Technology Research Lead & Systems Architect  
**Objective:** Maximize capability, eliminate redundant custom development, ensure sovereign data ownership, and enforce strict security/license compatibility.

---

## 1. Open-Source Pull Strategy Framework

Each candidate technology is classified into one of five operational tiers:
- **USE NOW:** Fully vetted, license-compliant, immediate drop-in integration with minimal glue code.
- **EVALUATE:** High-potential architecture; requires sandbox benchmark in dev before production deployment.
- **ADAPT:** Core algorithms or schemas adapted into STFL VI without importing massive external runtime dependencies.
- **INSPIRE:** Architectural patterns and UI workflows studied for design excellence, but implemented natively.
- **DO NOT USE:** Incompatible licensing (e.g. AGPL in client bundle), heavy SaaS lock-in, poor security posture, or abandoned codebase.

---

## 2. Master Technology Candidate Evaluations

### 2.1 Identity, Authorization & Policy Engines

#### Candidate 1: Cerbos (Context-Aware Authorization)
- **Repository:** `cerbos/cerbos` &bull; **URL:** `https://github.com/cerbos/cerbos`
- **License:** Apache-2.0
- **Technology:** Go, gRPC / REST API, WebAssembly
- **Maturity / Security:** Enterprise Production &bull; SOC 2 Type II certified &bull; Active commits weekly.
- **Why Useful:** Decouples authorization logic from application code using declarative YAML policies. Perfect for contextual project scoping (`is_officer && project_id == resource.project_id`).
- **What NOT to Use It For:** Identity provisioning or password storage (policy decision point only).
- **Potential STFL VI Module:** IAM & Access Engine (`api/src/authorization`).
- **Strategic Classification:** **EVALUATE**

#### Candidate 2: Casbin (RBAC / ABAC Framework)
- **Repository:** `casbin/node-casbin` &bull; **URL:** `https://github.com/casbin/node-casbin`
- **License:** Apache-2.0
- **Technology:** TypeScript / Node.js
- **Maturity / Security:** High &bull; 15,000+ GitHub Stars &bull; Well-maintained.
- **Why Useful:** Lightweight, in-memory RBAC evaluation with PostgreSQL adapter, eliminating need for external sidecar daemon.
- **What NOT to Use It For:** Large-scale distributed graph traversal across millions of nodes.
- **Potential STFL VI Module:** API Middleware (`main/api/src/authorization`).
- **Strategic Classification:** **USE NOW**

---

### 2.2 Digital Documents, E-Signature & OCR

#### Candidate 3: Documenso (Open Source Digital Signature)
- **Repository:** `documenso/documenso` &bull; **URL:** `https://github.com/documenso/documenso`
- **License:** AGPL-3.0 (Self-hosted standalone server)
- **Technology:** Next.js, TypeScript, Prisma, PostgreSQL
- **Maturity / Security:** Production ready &bull; Active developer ecosystem.
- **Why Useful:** Complete digital agreement workflow with cryptographic certificate signing, audit trails, and multi-party signing queues.
- **What NOT to Use It For:** Do NOT import directly as a library into proprietary frontend due to AGPL-3.0 copyleft. Must run as an isolated backend microservice or adapt signing verification routines.
- **Potential STFL VI Module:** GrihostiOS Tenancy Agreements & Lease Signatures.
- **Strategic Classification:** **ADAPT** (Adopt signing protocol and audit trail schema natively).

#### Candidate 4: Tesseract.js (Pure JS OCR Engine)
- **Repository:** `naptha/tesseract.js` &bull; **URL:** `https://github.com/naptha/tesseract.js`
- **License:** Apache-2.0
- **Technology:** WebAssembly (Wasm) port of Tesseract C++ engine.
- **Maturity / Security:** Very mature &bull; 34,000+ GitHub Stars &bull; Zero external server transmission.
- **Why Useful:** Client-side and Node.js OCR processing for Bengali script (`ben` language pack) to digitize vouchers, land deed titles, and academic monographs without sending data to third-party APIs.
- **What NOT to Use It For:** Heavily stylized calligraphic text or complex skewed tabular layouts (requires pre-processing).
- **Potential STFL VI Module:** Knowledge Archive (`main/api/src/documents` & HakimSarker Archive).
- **Strategic Classification:** **USE NOW**

---

### 2.3 Vector Search, RAG & Knowledge Systems

#### Candidate 5: Qdrant (Vector Similarity Engine)
- **Repository:** `qdrant/qdrant` &bull; **URL:** `https://github.com/qdrant/qdrant`
- **License:** Apache-2.0
- **Technology:** Rust, gRPC / REST API, HNSW vector indexing.
- **Maturity / Security:** Enterprise Grade &bull; Sub-10ms latency &bull; Payload filtering.
- **Why Useful:** Native payload filtering allows hard partitioning by `project_id` and `tenant_id` at the index level, preventing vector retrieval cross-contamination.
- **What NOT to Use It For:** Traditional relational SQL transactions.
- **Potential STFL VI Module:** QiM-AI 2.1 Knowledge Vaults & RAG Engine.
- **Strategic Classification:** **USE NOW**

#### Candidate 6: Apache AGE (Graph Database Extension for PostgreSQL)
- **Repository:** `apache/age` &bull; **URL:** `https://github.com/apache/age`
- **License:** Apache-2.0
- **Technology:** C extension for PostgreSQL (openCypher query support).
- **Maturity / Security:** Apache Top-Level Project &bull; Native PostgreSQL ACID compliance.
- **Why Useful:** Adds property graph query capabilities directly to existing STFL PostgreSQL database, connecting people, properties, land deeds, and programs without deploying a separate Neo4j cluster.
- **What NOT to Use It For:** Standalone non-Postgres environments.
- **Potential STFL VI Module:** Governance & Party Relationship Graph (`api/migrations`).
- **Strategic Classification:** **EVALUATE**

---

### 2.4 GIS, Property & Agriculture

#### Candidate 7: PostGIS (Spatial Database Extender)
- **Repository:** `postgis/postgis` &bull; **URL:** `https://github.com/postgis/postgis`
- **License:** GPL-2.0
- **Technology:** PostgreSQL extension, C/C++
- **Maturity / Security:** Gold standard for geospatial data worldwide.
- **Why Useful:** Native polygon storage, boundary intersection calculations, and GPS plot mapping for GrihostiOS land parcels and agricultural crop-share fields across Bangladesh.
- **What NOT to Use It For:** Simple non-spatial attribute queries.
- **Potential STFL VI Module:** GrihostiOS Land Registry & Parcellation (`main/api/src/grihosti`).
- **Strategic Classification:** **USE NOW**

#### Candidate 8: OpenLayers / MapLibre GL
- **Repository:** `maplibre/maplibre-gl-js` &bull; **URL:** `https://github.com/maplibre/maplibre-gl-js`
- **License:** BSD-3-Clause
- **Technology:** WebGL vector map rendering.
- **Maturity / Security:** High &bull; Community-governed open fork of Mapbox GL.
- **Why Useful:** High-performance vector tile rendering of land boundaries, district flood zones, and agricultural plots without proprietary SaaS licensing costs.
- **What NOT to Use It For:** Simple single-marker address previews (Leaflet is lighter for single pins).
- **Potential STFL VI Module:** GrihostiOS Land Viewer (`/admin/property`).
- **Strategic Classification:** **EVALUATE**

---

### 2.5 Security, Observability & Dependency Auditing

#### Candidate 9: Google OSV-Scanner (Vulnerability Scanner)
- **Repository:** `google/osv-scanner` &bull; **URL:** `https://github.com/google/osv-scanner`
- **License:** Apache-2.0
- **Technology:** Go, Open Source Vulnerabilities (OSV) database.
- **Maturity / Security:** Maintained directly by Google Open Source Security Team.
- **Why Useful:** Precise scanning of npm lockfiles, Gradle dependencies, and container images, matching transitive dependencies directly against the authoritative OSV database.
- **What NOT to Use It For:** Dynamic runtime penetration testing.
- **Potential STFL VI Module:** CI/CD DevSecOps Gate (`scripts/`).
- **Strategic Classification:** **USE NOW**

#### Candidate 10: OpenTelemetry (Distributed Tracing & Metrics)
- **Repository:** `open-telemetry/opentelemetry-js` &bull; **URL:** `https://github.com/open-telemetry/opentelemetry-js`
- **License:** Apache-2.0
- **Technology:** Vendor-neutral telemetry instrumentation.
- **Maturity / Security:** CNCF Graduated &bull; Global enterprise standard.
- **Why Useful:** Provides end-to-end trace context from Next.js web client to API microservices and database queries, pinpointing latency bottlenecks and failed authorizations.
- **What NOT to Use It For:** Storing sensitive PII payload logs.
- **Potential STFL VI Module:** Observability & Performance Monitoring (`main/api/src`).
- **Strategic Classification:** **EVALUATE**

---

## 3. Technology Pull Action Matrix

| Module | Open-Source Recommendation | Strategic Action | Immediate Impact |
| :--- | :--- | :--- | :--- |
| **IAM Authorization** | Casbin (`node-casbin`) | **USE NOW** | Standardizes contextual RBAC rules in `api/src/authorization`. |
| **Geospatial Land** | PostGIS | **USE NOW** | Enables GPS boundary polygons for GrihostiOS parcels. |
| **Vulnerability CI**| OSV-Scanner | **USE NOW** | Automates pre-commit dependency security audits in GitHub Actions. |
| **Bengali OCR** | Tesseract.js (ben) | **USE NOW** | Provides offline client-side and server OCR for scanned Bengali deeds. |
| **Vector Engine** | Qdrant | **USE NOW** | Provides sub-120ms vector retrieval with project isolation payload filters. |
| **Graph DB** | Apache AGE | **EVALUATE** | Test in dev for linking party ownership without Neo4j overhead. |
| **Digital Signing** | Documenso | **ADAPT** | Adapt schema and hash audit chaining without importing AGPL code. |
