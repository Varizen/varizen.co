# HAWLAT — Deployment Architecture

- Environments: `local`, `ci`, `staging`, `production`; separate databases, secrets, keys; no prod data outside prod.
- Containers: `api`, `worker` (outbox/jobs), `web`, managed PostgreSQL (PITR), Redis only if needed for rate limits.
- IaC (Terraform) + CI/CD: lint → typecheck → unit → integration (ephemeral Postgres) → security scan → build signed image → deploy staging → smoke → manual approval → prod. Migrations run as a separate gated step; backward-compatible (expand/contract).
- Config via env/secret manager; feature flags and gates read from DB.
- Observability: structured logs, metrics, traces (OpenTelemetry), SLO alerts, audit-log monitoring.
- Reproducible: pinned lockfiles, deterministic builds, tagged releases.
- Production enablement is Phase 18 and requires gate approvals (see [REGULATORY_GATES.md](REGULATORY_GATES.md)).
