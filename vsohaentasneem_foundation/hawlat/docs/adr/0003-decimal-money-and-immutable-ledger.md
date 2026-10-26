# ADR-0003: Decimal money and immutable ledger

**Status:** Accepted
**Decision:** `Money` is `Decimal` + currency (`NUMERIC(20,4)` in DB); floats rejected at construction. Ledger entries are append-only, double-entry, corrected by reversal.
**Consequences:** Deterministic, auditable arithmetic; balances are derived.
