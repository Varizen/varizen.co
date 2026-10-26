# HAWLAT — Risk Engine

Eligibility/risk evaluation, fraud signals, velocity checks, exposure/limit enforcement, AML/KYC adapter orchestration, case creation.

## Decision contract
```
RiskDecision { outcome: ALLOW | REVIEW | DENY, reason_codes[], rule_versions[], inputs_hash, decided_at }
```
Stored in `risk_events`. No opaque model may solely cause a denial; every decision lists human-readable reasons and is appealable. Model signals can only raise review flags unless a rule cites them.

## Checks (ordered, fail-closed)
1. Regulatory gate for the capability.
2. Identity verified to required level; sanctions/PEP via AML adapter (provider down ⇒ block).
3. Participant status (not suspended).
4. Limits: `MAX_ACTIVE_EXPOSURE`, `MAX_COUNTERPARTY_EXPOSURE`, `MAX_DAILY_VOLUME`, `MAX_PRODUCT_LIMIT`.
5. Reputation tier vs product minimum.
6. Velocity/device/graph anomalies.
7. Self-dealing/collusion.

## Operations
Kill switches (global/feature/participant), review queues with SLAs, immutable decision trail, rule back-testing.
