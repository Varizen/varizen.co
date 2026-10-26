# HAWLAT — Event Architecture

- **Envelope:** `event_id (ULID), type, version, occurred_at, actor, aggregate_type, aggregate_id, correlation_id, causation_id, payload`.
- **Outbox:** events written to `outbox_events` in the same DB transaction as the change; a worker publishes with retries/backoff; consumers are idempotent (dedupe by `event_id`) and tolerate duplicates/out-of-order via aggregate version.
- **Schema registry:** versioned JSON Schemas in `events/schemas`; additive changes only within a version.
- **Dead letters:** failed events parked with reason, alerting, replay tooling.
- **Core events:** `participant.created`, `identity.verified`, `request.published`, `offer.published`, `match.created`, `quote.issued`, `agreement.signed`, `transaction.transitioned`, `ledger.posted`, `repayment.recorded`, `reputation.changed`, `risk.flagged`, `gate.changed`, `dispute.opened`.
- Every state transition emits `transaction.transitioned` with `previous_state, new_state, actor, reason`.
