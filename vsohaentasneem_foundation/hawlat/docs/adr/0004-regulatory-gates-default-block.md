# ADR-0004: Regulatory gates default to BLOCK

**Status:** Accepted
**Decision:** Regulated capabilities are guarded server-side by `GateRegistry`; only `ENABLED` allows. Real-money features stay behind `PAYMENT_SETTLEMENT`; only mock adapters until approved.
**Consequences:** Safe-by-default; legal progress is explicit data with two-person approval.
