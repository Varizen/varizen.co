# HAWLAT — Reputation Engine

## Model
Reputation is a **derived view over an append-only event log**. `reputation_events` are never edited; corrections are compensating events. `reputation_snapshots` are periodic materialisations. Each event stores `algorithm_version`, `source`, `delta`, `reason_code`, `evidence_ref`.

## Inputs
Completed transactions, on-time/late repayments, defaults, dispute outcomes, verification level, account age, counterparty diversity, fraud flags.

## Output
`score`, `tier`, `completed_count`, `reason_codes[]`; full explanation visible to the participant.

## Three-instance principle
`COMPLETED_TXN_THRESHOLD` (config, default 3) sets `marketplace_privileges = ENHANCED` only. It never sets eligibility; the Eligibility Engine re-checks reputation, exposure, history, product rules, liquidity, limits and gates on every quote.

## Immutability and appeals
- DB triggers block UPDATE/DELETE on events.
- Appeal → independent reviewer → outcome appended as new events; original preserved; all steps audited.
- New algorithm ⇒ new `algorithm_version`; history is never silently rewritten.

## Anti-gaming
Circular-trade/collusion detection (trust graph), minimum counterparty diversity, weight caps for tiny transactions, velocity limits, fraud hooks to Risk.

## Visibility
Counterparties see tier + verification badges + chosen stats under consent; raw events and PII are private.
