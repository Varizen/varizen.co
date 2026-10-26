# STFL AIO — Development Feature Control Map & Component Governance
**Document Identity:** `STFL-DOC-2026-FEAT-CTRL-V1`  
**Phase:** Prompt 12.5 (Multi-Project Architecture & Feature Control Map)  
**Status:** LIVING ARCHITECTURE REGISTER — RATIFIED  
**Security Classification:** INTERNAL ENTERPRISE SPECIFICATION  
**Authoritative Precedent:** Bound by `STFL_AIO_CONSTITUTION.md`

---

## 1. Master Feature Governance Framework

To prevent unauthorized changes, architecture drift, or rogue feature implementation, every architectural and software component in the STFL AIO repository is cataloged under a strict governance contract:

### Component Status Definitions:
- **`CONSTITUTIONAL`**: Permanently frozen by `STFL_AIO_CONSTITUTION.md`. Inviolable across all agents, developers, and trustees.
- **`LOCKED`**: Ratified and hardened in earlier completed phases. Requires formal architectural review to modify.
- **`IMPLEMENTED`**: Fully built, verified locally and in integration tests.
- **`IN_PROGRESS`**: Active development within authorized engineering phases.
- **`PLANNED`**: Formally specified in architecture; queued for implementation.
- **`PROPOSED`**: Conceptual feature under architectural evaluation.
- **`DEPRECATED`**: Scheduled for safe phase-out without breaking historical data.
- **`REMOVED`**: Safely extracted and archived.

### Permitted Mutation Operations:
`CAN_ADD` | `CAN_MODIFY` | `CAN_REMOVE` | `CAN_REPLACE` | `CAN_DEPRECATE`

---

## 2. Comprehensive Architectural Component Register

| Component ID | Component Name | Domain / Subsystem | Status | Owner | Security Class | Dependencies | Dependents | Can Add | Can Mod | Can Rem | Can Rep | Can Dep |
|---|---|---|---|---|---|---|---|:---:|:---:|:---:|:---:|:---:|
| **SEC-001** | Device KeyStore Vault | Security Substrate | `CONSTITUTIONAL` | Security Lead | CLASS_00 | Android KeyStore | IAM-001, AUTH-001 | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SEC-002** | Flag Secure & Watermark | Mobile Security | `CONSTITUTIONAL` | Android Lead | CLASS_00 | Hardware Display | MOB-001 | ❌ | ❌ | ❌ | ❌ | ❌ |
| **DB-001** | PostgreSQL 16 Cluster | Authoritative Store | `CONSTITUTIONAL` | Principal DBA | CLASS_00 | pgcrypto | Entire Platform | ❌ | ❌ | ❌ | ❌ | ❌ |
| **DB-002** | Decimal Monetary Invariant | Accounting Substrate | `CONSTITUTIONAL` | Central Treasury | CLASS_01 | DB-001 | FIN-001, PRJ-FIN | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AUD-001** | Immutable Audit Engine | Compliance Substrate | `CONSTITUTIONAL` | Chief Auditor | CLASS_08 | DB-001 | Entire Platform | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AGT-001** | Agent Level 3 Ceiling | Autonomous Sandbox | `CONSTITUTIONAL` | AI Architect | CLASS_00 | APP-001 | AGT-002, PRJ-AGT | ❌ | ❌ | ❌ | ❌ | ❌ |
| **APP-001** | Anti-Collusion SoD Engine | Approval Substrate | `CONSTITUTIONAL` | Governance Lead | CLASS_01 | DB-001, IAM-001 | FIN-001, PRJ-WF | ❌ | ❌ | ❌ | ❌ | ❌ |
| **DOC-001** | SHA-256 Document Hasher | Document Substrate | `LOCKED` | Records Lead | CLASS_08 | DB-001 | DOC-002, PRJ-DOC | ❌ | ❌ | ❌ | ❌ | ❌ |
| **PRN-001** | Controlled Print Engine | Forensic Output | `LOCKED` | Security Lead | CLASS_08 | DB-001, SEC-001 | PRN-002 | ❌ | ❌ | ❌ | ❌ | ❌ |
| **COM-001** | Governed Comms Gateway | Multi-Channel Gateway | `LOCKED` | Comms Lead | CLASS_06 | DB-001, AUD-001 | PRJ-COM | ❌ | ❌ | ❌ | ❌ | ❌ |
| **AUTH-001**| 12-D Contextual Auth Engine | Core Authorization | `LOCKED` | Security Architect | CLASS_00 | DB-001, IAM-001 | Consoles 01-16 | ❌ | ⚠️* | ❌ | ❌ | ❌ |
| **CON-001** | IAM Console | Console 01 | `IMPLEMENTED` | IAM Officer | CLASS_00 | AUTH-001 | Web / Android | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-002** | Governance Console | Console 02 | `IMPLEMENTED` | Trustee | CLASS_01 | AUTH-001, APP-001| Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-003** | Executive Command Console | Console 03 | `IMPLEMENTED` | Executive Director | CLASS_02 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-004** | Finance Control Console | Console 04 | `IMPLEMENTED` | Central Finance Head| CLASS_03 | AUTH-001, DB-002 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-005** | Property Management Console | Console 05 | `IMPLEMENTED` | Property Officer | CLASS_04 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-006** | Microfinance Console | Console 06 | `IMPLEMENTED` | Microfinance Officer| CLASS_05 | AUTH-001 | Web / Mobile | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-007** | Workforce HR Console | Console 07 | `IMPLEMENTED` | HR Lead | CLASS_06 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-008** | E-Shop Operations Console | Console 08 | `IMPLEMENTED` | E-Commerce Lead | CLASS_11 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-009** | Projects & Agency Console | Console 09 | `IMPLEMENTED` | Project Director | CLASS_07 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-010** | Fixed Assets Console | Console 10 | `IMPLEMENTED` | Asset Manager | CLASS_04 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-011** | Document Control Console | Console 11 | `IMPLEMENTED` | Records Officer | CLASS_08 | AUTH-001, DOC-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-012** | Communications Console | Console 12 | `IMPLEMENTED` | Comms Officer | CLASS_06 | AUTH-001, COM-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-013** | Security & Audit Console | Console 13 | `IMPLEMENTED` | Security Officer | CLASS_08 | AUTH-001, AUD-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-014** | Agent Control Console | Console 14 | `IMPLEMENTED` | AI Controller | CLASS_08 | AUTH-001, AGT-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-015** | Device Management Console | Console 15 | `IMPLEMENTED` | Device Admin | CLASS_08 | AUTH-001, SEC-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **CON-016** | System Administration Console| Console 16 | `IMPLEMENTED` | Super Admin | CLASS_00 | AUTH-001 | Web | ❌ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-001** | First-Class Project Container| Multi-Project Core | `PLANNED` | Platform Architect | CLASS_00 | DB-001, IAM-001 | PRJ-002 to 010 | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-002** | 13-D Contextual Auth Engine | Project Authz | `PLANNED` | Security Architect | CLASS_00 | AUTH-001, PRJ-001 | All Project Portals| ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-003** | Project Identity & Memberships| Project IAM | `PLANNED` | IAM Architect | CLASS_00 | IAM-001, PRJ-001 | PRJ-002 | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-004** | Project Sub-Ledger & Finance | Project Finance | `PLANNED` | Treasury Architect | CLASS_03 | DB-002, PRJ-001 | Central Finance | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-005** | Multi-Domain Project Websites| Project Web | `PLANNED` | Web Lead | CLASS_12 | Next.js 15, PRJ-001| Public Internet | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-006** | Project Brand Configuration | Visual System | `PLANNED` | Brand Designer | CLASS_02 | PRJ-005 | Web / Documents | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-007** | Declarative Workflow Engine | Process Automation | `PLANNED` | Workflow Architect | CLASS_02 | APP-001, PRJ-001 | Project Lead | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-008** | Project Autonomous Agents | Agent Sandbox | `PLANNED` | AI Architect | CLASS_10 | AGT-001, PRJ-001 | Project Workflows | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-009** | Project Document Isolation | Document Vault | `PLANNED` | Records Officer | CLASS_08 | DOC-001, PRJ-001 | Project Members | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **PRJ-010** | Project Creation Factory | Instantiation Engine| `PLANNED` | Platform Architect | CLASS_00 | PRJ-001 to 009 | Board / Executive | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-001** | Compliance Rule Registry | Regulatory Store | `PLANNED` | Legal Counsel | CLASS_08 | DB-001, AUTH-001 | CMP-002 to 009 | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-002** | Jurisdictional Resolver | Multi-Jurisdiction | `PLANNED` | Legal Architect | CLASS_08 | CMP-001 | All Projects | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-003** | Compliance Evaluation Engine | Real-Time Evaluator | `PLANNED` | Security Architect | CLASS_00 | CMP-001, PRJ-002 | API Middleware | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-004** | Legal Escalation & Cases | Case Management | `PLANNED` | Legal Counsel | CLASS_08 | CMP-003, APP-001 | Web Console 17 | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-005** | Labour Compliance Subsystem | Workforce Law | `PLANNED` | HR & Legal Lead | CLASS_06 | CMP-001, CON-007 | Payroll / Clock-in| ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-006** | Property Compliance Subsystem | Land & Waqf Law | `PLANNED` | Property Counsel | CLASS_04 | CMP-001, CON-005 | Lease Agreements | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-007** | Compliance Agent Fleet | Autonomous Scanners | `PLANNED` | AI Architect | CLASS_10 | AGT-001, CMP-003 | Legal Cases | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-008** | Regulatory Change Ingestion | Gazette Scanners | `PLANNED` | Legal Researcher | CLASS_08 | CMP-001 | Counsel Alerts | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| **CMP-009** | Compliance Console | Console 17 | `PLANNED` | Legal Lead | CLASS_08 | CMP-001 to 004 | Web / Mobile | ✅ | ⚠️ | ❌ | ❌ | ❌ |

`⚠️*` Note on `AUTH-001`: Allowed modification is strictly additive—evolving from 12 Dimensions to 13 Dimensions via the formal change gate.
