# ADR-0001: HAWLAT is a neutral marketplace, never a party

**Status:** Accepted
**Decision:** Model transactions as `Participant A <-> Participant B`. No platform lender/borrower role exists in schema, API or code; a DB check forbids the platform as a transaction party. No custody, no pooling, no guarantees.
**Consequences:** Platform revenue is a separate service fee; money movement requires an authorised partner. `[LEGAL_REVIEW_REQUIRED]`
