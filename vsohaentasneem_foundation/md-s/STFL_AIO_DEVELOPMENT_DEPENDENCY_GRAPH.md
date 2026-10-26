# STFL AIO — Development Dependency Graph & Change Governance
**Document Identity:** `STFL-DOC-2026-DEP-GRAPH-V1`  
**Phase:** Prompt 12.5 (Multi-Project Architecture & Feature Control Map)  
**Status:** SPECIFICATION ONLY — RATIFIED (READ-ONLY ARCHITECTURE PHASE)  
**Security Classification:** INTERNAL ENTERPRISE SPECIFICATION  
**Authoritative Precedent:** Bound by `STFL_AIO_CONSTITUTION.md`

---

## 1. Topological Architecture Dependency Graph

Every enterprise capability in STFL AIO is strictly ordered in an acyclic directed graph (DAG). No component can be instantiated or invoked before its prerequisites are fully verified:

```mermaid
graph TD
    P1["1. Universal Party Registry (parties)"] --> P2["2. Credential & Identity Substrate (users)"]
    P1 --> P3["3. Hardware Device Vault (devices)"]
    
    P1 & P2 --> P4["4. First-Class Project Container (platform_projects)"]
    
    P4 --> P5["5. Project Memberships & Roles (project_memberships)"]
    P4 --> P6["6. Project Scopes (iam_scopes / scope_type='PROJECT')"]
    
    P2 & P3 & P5 & P6 --> P7["7. 13-D Contextual Authorization Engine (ContextualAuthz)"]
    
    P7 --> CMP["7b. Compliance Rule Registry & Engine (compliance_rules)"]
    
    P4 & P7 & CMP --> P8["8. Project Finance & Sub-Ledger (project_vouchers, COA)"]
    P4 & P7 --> P9["9. Project Document Vault (project_documents, SHA-256)"]
    P4 & P7 --> P10["10. Project Fixed Assets Register (project_assets)"]
    
    P7 & CMP & P8 & P9 --> P11["11. Declarative Workflow Engine (project_workflows)"]
    
    P7 & CMP & P8 & P11 --> P12["12. Project Autonomous Agent Sandbox (project_agents)"]
    
    P4 & P7 --> P13["13. Multi-Domain Project Websites & Portals (Next.js 15)"]
    P4 & P13 --> P14["14. Project Brand Configuration (project_branding_profiles)"]
    
    P5 & P8 & P11 & P12 & P13 & CMP --> P15["15. Project Creation Factory & Templates (Factory API)"]
```

---

## 2. Circular Dependency Analysis & Resolution

To maintain clean compilation, deterministic startup, and error-free database migrations, three potential circular traps were identified and resolved:

### Trap A: Project Finance vs. Workflow Engine
- *Potential Hazard:* Does `project_vouchers` depend on `project_workflows`, or does `project_workflows` depend on `project_vouchers`?
- *Resolution:* **Linear Decoupling.** `project_vouchers` is an authoritative, independent financial double-entry ledger. Workflows simply emit transition events that invoke voucher state updates (`SUBMITTED ➔ APPROVED ➔ DISBURSED`). The ledger has zero hard foreign keys pointing to workflow definitions.

### Trap B: Project Identity vs. Project Container
- *Potential Hazard:* A project needs an `owner_party_id` (a Party), but project memberships require a `project_id`.
- *Resolution:* **Party Exists First.** The human legal sponsor exists in the global `parties` table before the project is conceived. Once the project container is inserted, memberships link existing parties to the newly created project container.

### Trap C: Project Website vs. Context Resolution
- *Potential Hazard:* A website URL must resolve the project, but the project record defines the custom domain.
- *Resolution:* **Lookup Pre-Routing.** The edge middleware queries a high-speed cached reverse-lookup index (`domain ➔ project_id`) before entering the Next.js page renderer. The page renderer receives an explicit `X-Project-Context` header.

---

## 3. Strict Feature Change Governance Protocol

Developers, automated AI agents, and engineering teams must strictly execute the formal 13-stage change gate before altering any codebase component:

```mermaid
flowchart TD
    G01[1. CHANGE PROPOSAL: Document intent & requirements] --> G02[2. IMPACT ANALYSIS: Map affected downstream components]
    G02 --> G03[3. DEPENDENCY CHECK: Verify topological DAG compliance]
    G03 --> G04[4. SECURITY CHECK: Validate against 10-D Security Model]
    G04 --> G05[5. AUTHORIZATION CHECK: Verify 13-D policy rules]
    G05 --> G06[6. DATA MIGRATION CHECK: Ensure purely additive SQL]
    G06 --> G07[7. BACKWARD COMPATIBILITY: Zero breakages for mobile/web]
    G07 --> G08[8. EXPLICIT HUMAN APPROVAL: Trustee / Lead sign-off]
    G08 --> G09[9. VERSIONED SPECIFICATION: Update Markdown architecture]
    G09 --> G10[10. CODE IMPLEMENTATION: Write scoped, clean code]
    G10 --> G11[11. TEST SUITE EXECUTION: 100% unit & integration pass]
    G11 --> G12[12. REGRESSION RUN: Verify zero regressions across suites]
    G12 --> G13[13. RELEASE GATE: Tagged artifact / production gate]
```

### Inviolable Rules for AI Implementation Agents:
- **Zero Improvised Architecture:** If a prompt asks an AI agent to build a feature that contradicts the ratified dependency graph, the agent must **HALT AND REPORT THE CONFLICT**.
- **No Mock Production Code:** No agent may insert mock bypasses or hardcoded passwords into production branches.
- **Truthful Status Reporting:** A feature is never marked `IMPLEMENTED` merely because code compiled without errors.
