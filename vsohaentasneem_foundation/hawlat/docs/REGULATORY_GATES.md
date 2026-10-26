# HAWLAT — Regulatory Gates

Every regulated capability has a gate. **Default = BLOCK.**

## States
`PLANNED → LEGAL_REVIEW → PARTNER_REQUIRED → PARTNER_CONNECTED → COMPLIANCE_APPROVED → ENABLED`, plus `SUSPENDED` (from any state). Only `ENABLED` with all requirements satisfied allows the capability.

## Initial gates
| Feature | Initial status | Requires |
|---|---|---|
| IDENTITY_VERIFICATION_PROVIDER | PLANNED | KYC partner |
| PAYMENT_SETTLEMENT | PLANNED | AUTHORIZED_PAYMENT_PARTNER |
| PARTY_REPAYMENT_COLLECTION | PLANNED | AUTHORIZED_PAYMENT_PARTNER |
| PUBLIC_REPUTATION_SHARING | LEGAL_REVIEW | Data-protection review |
| MARKETPLACE_MATCHING (record-only) | LEGAL_REVIEW | Legal opinion |
| CROSS_BORDER | PLANNED | Jurisdiction ruleset |

## Enforcement
- Server-side only: `GateRegistry.require(feature)` in the service layer; the frontend only reads state.
- Result carries the missing requirement.
- Moves toward `ENABLED` need two distinct approvers; all changes audited and emit `gate.changed`.
- Kill switch forces `SUSPENDED` immediately.
- Each regulated service method must have a test proving BLOCK unless `ENABLED`.

Reference implementation: [registry.py](../backend/src/hawlat/gates/registry.py).
