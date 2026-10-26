# STFL AIO — Centralized Identity, IAM & User Class Architecture

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-IAM-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. 13 User Classes & 2 Bounded Relief Roles

The platform strictly prohibits arbitrary roles. Every actor belongs to one authoritative class:

| Class Code | Class Designation | Bengali Title | Authority Scope & Ceiling |
| :--- | :--- | :--- | :--- |
| `CLASS_00` | Platform Super Admin | প্ল্যাটফর্ম সুপার অ্যাডমিন | Infrastructure, migrations, edge configs. **Blocked from financial mutation.** |
| `CLASS_01` | Board / Trustee | বোর্ড ট্রাস্টি | Institutional governance, waqf oversight, Level 5 dual-control approvals. |
| `CLASS_02` | Executive Management | নির্বাহী নেতৃত্ব | Chairperson/CEO. Cross-unit operational command, emergency relief declarations. |
| `CLASS_03` | Unit Head | বিভাগীয় প্রধান | Head of Finance, Property, Microfinance, Workforce, Projects, or E-Shop. |
| `CLASS_04` | Supervisor / Officer | অপারেশনাল অফিসার | Regional supervisors, field coordinators. Operational ticket approvals (≤ 50k BDT). |
| `CLASS_05` | Field Worker | মাঠপর্যায়ের কর্মী | Physical data collection, relief distribution, photo proofs (≤ 10k BDT). |
| `CLASS_06` | Finance Specialist | অর্থ ও হিসাব বিশেষজ্ঞ | Double-entry journal vouchers, bank reconciliations, restricted ledger audits. |
| `CLASS_07` | Security / Audit Officer | নিরাপত্তা ও নিরীক্ষা কর্মকর্তা | Enclave device approvals, session revocations, print token audits, red-team logs. |
| `CLASS_08` | Document Officer | নথি নিয়ন্ত্রণ কর্মকর্তা | Template issuance, certificate signing, public verification oversight. |
| `CLASS_09` | HR / Workforce Admin | মানবসম্পদ ও কর্মী প্রশাসন | Personnel files, rosters, biometric/geofenced check-in audits, payroll runs. |
| `CLASS_10` | Autonomous System Agent | স্বায়ত্তশাসিত এআই এজেন্ট | Level 3 ceiling. 24/7 reconciliation, anomaly detection, task preparation. |
| `CLASS_11` | External Party | বহিরাগত অংশীদার | Tenants, borrowers, donors, contractors. Self-service portal access only. |
| `CLASS_12` | Public / Verification User | সর্বজনীন নাগরিক | Public route viewers, QR code verifiers, anonymous whistleblowers. |
| `MODERATOR_A` | Operational Relief Moderator | অপারেশনাল সহায়তা রিলিফ | Service ticket triage, non-financial operational queues. **Blocked on IAM/Funds.** |
| `MODERATOR_B` | Technical Relief Moderator | কারিগরি ও কমপ্লায়েন্স রিলিফ | System health triage, compliance review cases. **Blocked on IAM/Funds.** |

---

## 2. Decoupling Dynamic Relationships from User Classes
- Dynamic business relationships (such as *tenant*, *borrower*, *volunteer*, *vendor*, *donor*) are modeled as contextual entries in `party_relationships`, never as static user classes.
- A single party may be an Executive (`CLASS_02`) within STFL, a Project Director in Project A, and an External Donor in Project B without identity conflict.
