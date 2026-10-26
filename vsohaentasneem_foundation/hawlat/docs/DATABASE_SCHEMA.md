# HAWLAT — Database Schema (PostgreSQL)

## Conventions
- PKs: time-ordered UUID (v7/ULID) named `id`.
- Money: `NUMERIC(20,4)` + `currency CHAR(3)`; `CHECK (amount >= 0)` where applicable.
- Every table: `created_at timestamptz NOT NULL DEFAULT now()`; mutable tables add `updated_at`, `version int` (optimistic lock).
- Append-only tables (`ledger_entries, reputation_events, audit_logs, transaction_transitions`) have triggers rejecting UPDATE/DELETE.
- JSONB only for provider payloads, rule parameters and snapshots. Time stored UTC; display Asia/Dhaka.

## Tables

**Identity:** `users`, `identity_records` (unique `nid_hash`), `verification_records`, `devices`, `sessions`
**Participants:** `participants`, `participant_roles`, `organizations`
**Reputation:** `reputation_profiles`, `reputation_events` (`algorithm_version`), `reputation_snapshots`
**Marketplace:** `products`, `product_versions` (immutable once published), `financing_requests`, `financing_offers`, `matches`, `quotes`
**Agreements/Txn:** `agreements` (pins product/config/pricing versions + terms hash), `transactions`, `transaction_parties`, `transaction_transitions`, `repayment_schedules`, `repayment_events`
**Ledger/Pay:** `ledger_accounts`, `ledger_entries`, `payment_intents`, `settlements`
**Trust/Risk/Compliance:** `exposure_positions`, `risk_events`, `compliance_cases`, `regulatory_rules`, `gate_states`
**Ops:** `disputes`, `dispute_evidence`, `notifications`, `audit_logs`, `feature_flags`, `configuration_versions`, `outbox_events`, `idempotency_keys`

## Critical constraints

| Invariant | Mechanism |
|---|---|
| Exactly two distinct parties per txn | `UNIQUE(transaction_id, role)` + deferred trigger: count=2, funder≠recipient |
| HAWLAT never a party | `CHECK (participant_kind <> 'PLATFORM')` |
| Ledger balanced | deferred constraint trigger `SUM(debit)=SUM(credit)` per `journal_id` |
| Ledger immutable | UPDATE/DELETE blocked; corrections = reversing entries |
| Unique identity | `UNIQUE(nid_hash)`, `UNIQUE(participant_id, role)` |
| Idempotency | `UNIQUE(actor_id, route, key)` storing request hash + response |
| Valid states | `CHECK(state IN …)` + FK `(previous_state,new_state)` → `allowed_transitions` |
| Positive amounts | `CHECK (principal > 0)`; bounds from config at service layer |
| Outbox atomicity | `outbox_events` written in the same DB transaction as the change |

## Migrations
Alembic; one revision per domain group; forward-only in prod with tested downgrade in CI. Seed data (gate states, default config) via versioned data migrations.
