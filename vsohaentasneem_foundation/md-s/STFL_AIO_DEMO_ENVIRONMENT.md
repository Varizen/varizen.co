# STFL AIO — Live Demonstration & Preview Environment Specification
**Document ID:** `STFL_AIO_DEMO_ENVIRONMENT.md`  
**Phase:** Prompt 12.5 (Live Development Demo / Preview Environment)  
**Status:** IMPLEMENTED & LOCALLY VERIFIED  
**Production Verification Status:** PENDING (Strictly preserved for Prompt 13)

---

## 1. Purpose & Scope

The STFL AIO Live Demonstration & Preview Environment provides an isolated, interactive, and demonstrable deployment of the complete STFL AIO platform. It bridges the gap between local development and formal production release without altering, contaminating, or connecting to authoritative production resources.

The environment enables executive, operational, technical, and trustee stakeholders to experience and verify:
1. **The 13 Canonical User Classes (`CLASS_00` through `CLASS_12`)** via an authenticated "View System As" session switcher.
2. **The 16 Governed Management Consoles** running live with role-shaping and scope-isolation.
3. **The 12-Dimensional Contextual Authorization Engine** rendering live `ALLOW`, `DENY`, and `ESCALATE` decisions.
4. **The Dynamic Party/Relationship Model**, distinguishing dynamic business relationships (Lessor, Lessee, Borrower, Donor, Employee) from system user accounts.
5. **Waqf Property & Lease Lifecycle**, showcasing properties, rental units, leases, and occupancy.
6. **Digital Documents & Controlled Printing**, enforcing non-production watermarks (`STFL DEMO — NON-PRODUCTION`) and one-time token consumption.
7. **Governed Communications Gateway**, executing simulated multi-channel dispatch with zero outbound network egress.
8. **Autonomous Agent Runtime Sandbox**, enforcing Level 3 tool execution ceiling, 0.98 confidence thresholds, and Level 4/5 human escalation.
9. **Device Security & Audit Substrate**, demonstrating device binding and append-only audit event trails.

---

## 2. Environment Topology & Architectural Isolation

The environment is architected with strict unidirectional isolation:

```
┌─────────────────────────────────────────────────────────────┐
│                    STFL DEVELOPMENT                         │
│  - Local test suites (Vitest / Node.js)                     │
│  - Migration verification & Red-Team suites                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               STFL DEMO / PREVIEW ENVIRONMENT               │
│  - Web Frontend: http://localhost:3000                      │
│    Interactive Demo Lab: http://localhost:3000/demo         │
│  - Authoritative API: http://localhost:8787/api/v1          │
│    Demo Endpoints: /api/v1/demo/*                           │
│  - Database: postgresql://stfl:stfl_dev_pw@127.0.0.1:5433/stfl│
│  - Dataset: Deterministic fictional 'STFL-DEMO-*' records   │
│  - Outbound Communications: Strictly simulated (0 egress)   │
│  - Documents/Print: Watermarked 'STFL DEMO — NON-PRODUCTION'│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼  [AIR GAP / STRICT DENY]
┌─────────────────────────────────────────────────────────────┐
│                    STFL PRODUCTION                          │
│  - Domain: https://stflbd.app                               │
│  - Edge: Cloudflare WAF / Worker                            │
│  - Production Verification Status: PENDING                  │
│  - Gate: Prompt 13 (Production Release Gate)                │
└─────────────────────────────────────────────────────────────┘
```

### Safety & Boundary Guarantees:
- **Zero Production Mutation:** The demo environment cannot read, write, or access `stflbd.app` production infrastructure or production PostgreSQL.
- **Zero Outbound Egress:** Outbound SMS, WhatsApp, and Email dispatch is intercepted by the in-memory simulation gateway; no real messages are sent.
- **Deterministic Identifier Prefixing:** All demo records, entities, and tokens use the `STFL-DEMO-*` prefix.
- **Safe Reset:** The demo reset API requires explicit confirmation (`confirmReset: "CONFIRM_DEMO_RESET"`) and operates exclusively on `STFL-DEMO-*` records.

---

## 3. Component Architecture & Endpoints

### 3.1 Web Frontend (`apk/web`)
- **Runtime:** Next.js 14+ (React 18, TypeScript, Tailwind CSS, Iconoir icons exclusively).
- **Local Dev URL:** `http://localhost:3000`
- **Demo Workspace / Lab:** `http://localhost:3000/demo`
- **Consoles Directory:**
  - IAM: `/admin/iam`
  - Governance: `/admin/governance`
  - Executive: `/admin/executive`
  - Finance: `/admin/finance`
  - Property: `/admin/property`
  - Microfinance: `/admin/microfinance`
  - Workforce: `/admin/workforce`
  - E-Shop: `/admin/eshop`
  - Projects: `/admin/projects`
  - Assets: `/admin/assets`
  - Documents: `/admin/documents`
  - Comms: `/admin/communications`
  - Security: `/admin/security`
  - Agents: `/admin/agents`
  - Devices: `/admin/devices`
  - System: `/admin/system`

### 3.2 Backend API (`apk/api`)
- **Runtime:** Hono HTTP Framework (TypeScript, Node.js runtime).
- **Local API Base:** `http://localhost:8787/api/v1`
- **Demo API Routes (`/api/v1/demo/*`):**
  - `GET /api/v1/demo/identities` — Retrieves the 13 canonical demo identities, pre-signed JWTs, device state, and console permissions.
  - `POST /api/v1/demo/session` — Establishes a server-signed authenticated demo session.
  - `GET /api/v1/demo/data` — Provides the complete deterministic demo dataset.
  - `POST /api/v1/demo/authorize` — Evaluates real 12-dimensional contextual authorization decisions via `ContextualAuthorizationEngine`.
  - `POST /api/v1/demo/agent/run` — Simulates governed agent execution (Level 3 tool ceiling, 0.98 confidence check, Level 4/5 escalation).
  - `POST /api/v1/demo/comms/send` — Simulates governed template dispatch with anti-hallucination hash checking and zero outbound network egress.
  - `POST /api/v1/demo/reset` — Resets demo data safely with mandatory confirmation string verification.

---

## 4. Local Startup & Execution

### Prerequisites
1. **Node.js** (v18+ or v20+)
2. **PostgreSQL** running locally on port `5433` (e.g. via Docker: `docker compose up -d`)

### Quick Start
```bash
# 1. Start the backend API service (Port 8787)
cd apk/api
npm install
npm run dev

# 2. Start the web frontend application (Port 3000)
cd apk/web
npm install
npm run dev
```

### Verification Commands
```bash
# Verify icon policy compliance (Strictly iconoir-react exclusively)
cd apk/web
npm run verify:icons

# Run the backend test suite (including 15 demo tests)
cd apk/api
npm test
```

---

## 5. Deployment Classification

- **Current Deployment Mode:** `DEMO READY — LOCAL ONLY`
- **Cloud Preview Status:** Ready for Cloudflare Pages/Workers preview if preview tokens and pipeline are bound.
- **Production Status:** `PRODUCTION VERIFICATION: PENDING` (Prompt 13 release gate remains closed and unmodified).
