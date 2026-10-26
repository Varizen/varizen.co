# HAWLAT — Production Readiness

## Implemented and tested (SQLite, 21 tests)
Identity (Argon2id, JWT), participants, append-only reputation + appeals, requests/offers, matching, Decimal pricing, eligibility/risk with stored reason codes, versioned configuration, two-party agreement, enforced transaction state machine with audit fields, double-entry immutable ledger, hash-chained audit, transactional outbox + notifications, idempotency keys, DB-backed regulatory gates (two-approver enable, kill switch), admin API, mock payment adapter (refused when `HAWLAT_ENV=production`), Alembic migration, Dockerfile, compose, CI.

## Not verified yet
- PostgreSQL triggers (append-only, journal balance) are written in migration 0001 but were never executed: no Docker/Postgres available when built. CI job runs them; confirm before staging.
- Python 3.12 image/CI untested locally (built on 3.10).

## Frontend (Phase 14)
Next.js (landing, sign-in/register, dashboard: passport, request/offer, matches, terms review and signing, transactions, repayments, disputes, history). Brand colours, Inter font and STFL marks from the brandcenter. Typechecks and builds; smoke-tested through the /api/v1 proxy. Not yet browser-tested for accessibility or responsive layout; Admin/compliance console at /admin (gates with two-approver enable and kill switch, verification queue, reputation appeals, versioned config, audit-chain check). Staff sign in at the same login page and are routed to it.

## Not built
Refresh tokens/MFA, rate limiting, document upload, messaging, real KYC/AML adapters, platform-fee collection, reconciliation job, observability stack, pen test, load test, DR drill.

## Blocked on humans (Phases 17-18) — cannot be done autonomously
1. `[LEGAL_REVIEW_REQUIRED]` Bangladesh regulatory opinion (see COMPLIANCE_ARCHITECTURE.md).
2. Authorised payment partner contract + real adapter.
3. KYC/AML provider.
4. Two named approvers to enable gates.
5. Production secrets, domain, TLS, backups, security review.
Production enablement stays OFF: all regulated gates default to BLOCK.
