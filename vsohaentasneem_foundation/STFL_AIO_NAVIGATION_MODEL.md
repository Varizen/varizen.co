# STFL AIO — Unified Navigation Model & Route Topology

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-NAV-V1`  
**Phase:** Phase 3 — Navigation Model & Route Hierarchy Specification  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.  
*(ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি)*  

---

## 1. Primary Four-Pillar Navigation Tree (Section 3)

```
STFL AIO
├── 1. PORTFOLIO (Multi-Project Strategic Control)
│   ├── Overview          → Consolidated cross-project health & outcome metrics
│   ├── Projects          → Comparative table of all active & archived projects
│   ├── Funding           → Institutional revenue, grants, restricted waqf/zakat
│   └── Impact            → Aggregate beneficiaries, poverty alleviation indicators
│
├── 2. CURRENT PROJECT (Scoped Project Operating System)
│   ├── [Project Switcher]→ Persistent dropdown selecting active project_id
│   ├── Overview          → Executive project pulse, 6 core questions, health card
│   ├── Operations        → Work activities, field tasks, milestones, issue logs
│   ├── Outcomes          → Input → Activity → Output → Outcome → Impact chain
│   ├── Finance           → Funding, Direct vs Indirect vs Overhead, Cost/Outcome
│   ├── People            → Staff, volunteers, partners, beneficiaries (Parties)
│   ├── Assets            → Fixed assets, equipment, facilities, QR/NFC tags
│   ├── Documents         → Contracts, leases, vouchers, proofs, /verify/ links
│   ├── Compliance        → 21 statutory domains, legal review cases, hold statuses
│   └── Governance        → Approval tickets, audit trails, risk heatmaps, SoD rules
│
├── 3. WORK (Universal Personalized Action Center)
│   ├── My Tasks          → Assigned tasks, deadlines, field check-in mandates
│   ├── Approvals         → Pending review items requiring user's class authority
│   ├── Alerts            → Overdue activities, financial variances, compliance flags
│   └── Messages          → Governed bilingual communications & system dispatch
│
└── 4. MANAGEMENT (Underlying Governed Consoles Layer for Authorized Users)
    ├── Administration    → IAM (Console 01)
    ├── Governance        → Governance Center (02), Executive Command (03)
    ├── Finance           → Finance Control Center (04)
    ├── Operations        → Property (05), Microfinance (06), Workforce (07),
    │                       E-Shop (08), Projects & Agency (09)
    ├── Resources         → Assets (10), Documents (11), Communications (12)
    ├── Control           → Compliance (17), Security (13), Agents (14), Devices (15)
    └── Platform          → System Administration (16), Knowledge & Training (18)
```

---

## 2. Persistent Context Chrome

The application shell provides four persistent global controls across all desktop and mobile screens:

1. **Active Project Switcher:**
   - Display: `[ 🏢 Education Access 2026 (STFL-PRJ-2026-0012) ▼ ]`
   - Options: List of authorized projects for the active identity, plus `[ 🌐 Portfolio View (All Projects) ]`.
   - Security: Zero cross-project leakage. Selection updates active JWT scope context `X-Project-Context`.
2. **View-As User Class Switcher:**
   - Dropdown for demo and testing: `CLASS_00` to `CLASS_12` + `MODERATOR_A` and `MODERATOR_B`.
   - UI seamlessly projects the permissions of the selected class.
3. **Bilingual Language Switcher:**
   - Toggle: `[ EN | বাংলা ]`
   - Persists user preference, updates typography to Hind Siliguri for Bengali headers/footers.
4. **Attention Indicator / Work Counter:**
   - Dynamic badge showing count of pending approvals and critical alerts.

---

## 3. URL Route Mapping & Backward Compatibility

To maintain 100% backward compatibility with all existing test suites, bookmarks, and automated scripts, **all existing `/admin/*` routes are preserved intact**.

| Operating System Feature | Canonical Clean Route | Underlying Admin Route (Preserved) | Access Requirement |
| :--- | :--- | :--- | :--- |
| **Portfolio Overview** | `/portfolio` or `/admin?tab=portfolio` | `/admin` | Class 00, 01, 02, 06, 07 |
| **Project Workspace** | `/project/[id]` or `/admin?tab=project` | `/admin/projects` | Project Members |
| **Project Operations** | `/project/[id]/operations` | `/admin/projects` | Class 03, 04, 05 |
| **Project Outcomes** | `/project/[id]/outcomes` | `/admin/projects` | Class 02, 03, 04 |
| **Project Finance** | `/project/[id]/finance` | `/admin/finance` | Class 03, 06 |
| **Project People** | `/project/[id]/people` | `/admin/workforce` | Class 03, 09 |
| **Project Assets** | `/project/[id]/assets` | `/admin/assets` | Class 03, 04 |
| **Project Documents** | `/project/[id]/documents` | `/admin/documents` | Class 04, 08 |
| **Project Compliance** | `/project/[id]/compliance` | `/admin/compliance` | Class 02, 07 |
| **Project Governance** | `/project/[id]/governance` | `/admin/governance` | Class 01, 02, 07 |
| **Universal My Work** | `/work` or `/admin?tab=work` | `/admin?tab=work` | All Authenticated Classes |
| **Governed Consoles Hub** | `/management` or `/admin?tab=management`| `/admin` | Authorized Classes |
| **Individual 18 Consoles**| `/admin/[consoleCode]` | `/admin/[consoleCode]` | Role-Gated per Console |
