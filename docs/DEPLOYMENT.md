# Production deployment

## Release boundary

This repository provides the public website, Trust Center, contact API, protected application shell, RBAC/data foundations and admin starter. It does **not** include an identity provider, production telemetry, an email service, distributed rate limiting, protected document storage or investor content. Those must be connected and tested before their features are enabled. Legal drafts require counsel review.

## Prerequisites

- Node.js 24 LTS and npm
- PostgreSQL 16+ with TLS and least-privilege credentials
- Vercel or a Node.js 24 host; Docker is provided for standalone hosting
- A reverse proxy that sanitizes forwarding headers

## Environment

Copy `.env.example` into the deployment secret manager. Never commit `.env` or real credentials. Configure `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `DATABASE_SSL=true`, and a unique `RATE_LIMIT_PEPPER` generated with `openssl rand -base64 48`.

`TRUST_PROXY_HEADERS=true` must only be enabled on a trusted deployment such as Vercel that supplies a sanitized `x-vercel-forwarded-for`. Otherwise clients could spoof their rate-limit identity. On Vercel, `x-vercel-forwarded-for` is used only when this flag is true. No proxy-derived address is trusted in the default self-hosted configuration.

The included rate limiter is per-instance. **A multi-instance production deployment requires an atomic shared rate limiter and edge bot protection before enabling public contact submission.** Without a shared store, limits vary between instances. Keep the application at one instance only if that limitation is explicitly accepted.

## Build and verify

```sh
npm ci
npm run db:generate
npm run check
npm run test:e2e
```

Generate migrations in the development environment and review their SQL. Do not generate schema changes implicitly during deployment. `db:generate` requires no live database.

## Database

1. Take and verify a backup.
2. Apply reviewed SQL with `npm run db:migrate` against a controlled migration database role.
3. Use a separate least-privilege runtime role; deny runtime schema changes.
4. Apply the revocation policies in `drizzle/0001_integrity.sql` after migrations. Database roles need `REVOKE UPDATE, DELETE ON audit_events, evidence FROM <runtime_role>;` and equivalent controlled append permissions.
5. Never run seed data in production. No production seed or demo account is supplied.

Authentication requires a real identity integration that verifies email, activation and MFA, then calls `issueSession`. Privileged users without MFA are denied by `requireAuth`. Session tokens are opaque, stored only as SHA-256 hashes, and transmitted in `__Host-` HttpOnly Secure SameSite=Strict cookies. Sessions have 15-minute idle and 12-hour absolute lifetimes. Rotation invalidates the previous token; reuse revokes the session family.

Every project/document query must join active user entitlements and check expiry/revocation. Do not serve protected files from `public/` or signed URLs that outlive entitlement revocation without a proxy authorization check.

## Deploy

### Vercel

Import the repository, select Next.js, set environment variables in the encrypted project settings, and deploy the reviewed commit. Use a managed PostgreSQL connection with TLS and pooling appropriate to serverless concurrency. Keep protected and public responses separated by `Cache-Control: private, no-store`.

### Docker / standalone Node

```sh
docker build -t varizen-web .
docker run --rm -p 3000:3000 --env-file .env varizen-web
```

The image runs as an unprivileged user. Place it behind HTTPS with HSTS, configure proxy header trust correctly, run database migrations separately, and limit outbound network access where possible.

## Rollback

1. Stop routing traffic to the unhealthy release.
2. Roll back to the previous immutable deployment/container image.
3. Roll forward a compatible migration where possible. Never destructively reverse a migration without a reviewed recovery plan and verified backup.
4. Revoke affected session families or increment user `authVersion` if token integrity is in question.
5. Verify `/`, `/api/health`, protected-route denial and contact submission.

## Backup and restore

Use encrypted PostgreSQL point-in-time recovery. Define RPO/RTO with the business before launch. Restrict backup access and audit restores. Test restoration into an isolated environment before relying on it:

1. Provision an isolated database and network.
2. Restore the selected backup/PITR point.
3. Run integrity and row-count checks.
4. Verify application migration compatibility and audit-chain continuity.
5. Document actual recovery timing; do not publish an untested recovery claim.

## Monitoring and response

Monitor process health, database availability, 4xx/5xx rates, latency and certificate expiry. Structured logs may contain request IDs and status codes, never contact payloads, tokens, cookies, credentials or protected document names. Configure alerting before launch. `/api/health` returns only `ok` or `unavailable`, never infrastructure details.

Dependency and secret scanning are required in CI. Generate an SBOM with `npm run sbom` in the release environment; store CycloneDX output as a build artifact. Sign the container and record provenance using the selected registry/CI platform. Restore and incident exercises must have named owners.

## Go-live checklist

- Native Varizen logo and optimized derivatives reviewed at production sizes.
- Legal documents approved; entity addresses and contact routing confirmed.
- Product maturity and claims reviewed by owners; evidence attached where needed.
- Database migration, backup and restoration verified.
- Real identity provider, MFA and admin review flow completed before opening the app.
- Shared rate limiting and bot protection enabled; object-level authorization tested.
- Security headers and nonce CSP verified without browser violations.
- Keyboard, screen-reader, contrast, mobile and reduced-motion checks completed.
- Lighthouse and Core Web Vitals measured on the deployed environment.
- No secrets, investor material, demo users or fabricated telemetry present.
