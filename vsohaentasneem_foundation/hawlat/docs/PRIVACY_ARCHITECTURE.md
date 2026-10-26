# HAWLAT — Privacy Architecture

## Classification
`PUBLIC` · `INTERNAL` · `CONFIDENTIAL` (contact, profile) · `RESTRICTED` (NID, KYC documents, financial history).

## Principles
- Data minimisation; purpose limitation; consent versioned and revocable (`consents`).
- **No contact harvesting:** counterparties never receive contact details or bulk lists before an agreed, consented transaction; all communication goes through platform messaging.
- Reputation shown to counterparties as tier/badges, not raw events.
- Retention schedule per class `[LEGAL_REVIEW_REQUIRED]`; erasure requests handled with legal-hold exceptions (ledger/audit pseudonymised, not deleted).
- Access to RESTRICTED data is logged, justified and role-limited.
- Non-production environments use synthetic data only.
- Cross-border transfer blocked by default (gate `CROSS_BORDER`).
