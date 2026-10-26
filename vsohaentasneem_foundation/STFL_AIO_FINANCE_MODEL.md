# STFL AIO — Two-Tier Financial Ledger & Mathematical Precision Model

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-FIN-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Mathematical Precision Invariant (Invariant 3)

- **Zero Floating Point Math:** All financial calculations, fee schedules, loan amortizations, and ledgers strictly use PostgreSQL `NUMERIC(18,2)` or integer paisa representations.
- **Double-Entry Balance Verification:** Every financial transaction creates balanced debit and credit journal entries (`SUM(debits) = SUM(credits)`).
- **Immutable Reconciliation Ledger:** Bank statements, mobile financial service (MFS) feeds, and cash vouchers are reconciled against closed periods.

---

## 2. Two-Tier Accounting Hierarchy
1. **Tier 1 (Project Level):** Dedicated project chart of accounts, budget utilization tracking, project vouchers, and funder milestone releases.
2. **Tier 2 (Platform Consolidated):** Institutional general ledger, statutory donor-restricted funds (Zakat, Sadqah, Waqf Capital, Qard Hasan Revolving Pool), and NBR tax compliance.
