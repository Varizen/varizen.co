# HAWLAT — Integration Architecture

Ports & adapters. Domain code depends on ports (`PaymentPort`, `SettlementPort`, `KycPort`, `AmlPort`, `NotificationPort`); adapters implement them.

| Port | MVP adapter | Real adapter gate |
|---|---|---|
| Payment / Settlement | `MockPaymentAdapter` (simulated, flagged `MOCK` on every record) | PAYMENT_SETTLEMENT |
| KYC / NID verification | `MockKycAdapter` | IDENTITY_VERIFICATION_PROVIDER |
| AML/sanctions | `MockAmlAdapter` | Compliance approval |
| Notifications | console/email sandbox | — |

## Failure policy
Timeouts + circuit breaker per provider; compliance/KYC/AML failures **fail closed**; notifications degrade/queue; settlement failures leave the transaction in `PENDING_SETTLEMENT` with alerts; webhooks verified (signature + replay window) and idempotent; reconciliation job compares provider reports with ledger.

No fake production integration: mocks cannot be enabled in production (config check at startup).
