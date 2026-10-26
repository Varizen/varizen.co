# STFL AIO — Property Rental, Waqf Lease & Tenancy Architecture

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-PROP-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Property Relationships & Contractual Truth

The architecture explicitly differentiates between legal roles:
- **LESSOR != necessarily LANDLORD** (e.g., an authorized Waqf mutawalli or property manager can be lessor without being fee-simple landlord).
- **LESSEE != necessarily TENANT** (e.g., an institutional corporate entity can be lessee while sub-licensing units to operational occupants).

### 14 Supported Property Types
`RESIDENTIAL`, `COMMERCIAL`, `INDUSTRIAL`, `AGRICULTURAL`, `OFFICE`, `RETAIL`, `WAREHOUSE`, `MIXED_USE`, `INSTITUTIONAL`, `RELIGIOUS`, `CHARITABLE`, `COMMUNITY`, `VACANT`, `OTHER`.

---

## 2. First-Class Lease Entity (`leases`)
- **Identifier Grammar:** `STFL-LSE-{YEAR}-{SERIAL}-{HASH}` (e.g., `STFL-LSE-2026-000001-X8P4`).
- **Core Attributes:** Lessor Party, Lessee Party, Property Unit ID, Occupancy Type, Use Class, Term Start, Term End, Monthly Rent (`NUMERIC(18,2)`), Security Deposit, Escalation Formula, Utility Sub-Meters, Notice Period, Guarantor Party IDs.
- **Lifecycle:** `DRAFT` -> `PENDING` -> `ACTIVE` -> `EXPIRING` -> `EXPIRED` -> `RENEWAL_PENDING` -> `RENEWED` -> `TERMINATED` -> `CANCELLED` -> `DISPUTED`.
- **Decoupled Occupancy:** Physical occupancy is tracked independently in `unit_occupancies` allowing sub-tenancy, licenses, and inspection audits.
