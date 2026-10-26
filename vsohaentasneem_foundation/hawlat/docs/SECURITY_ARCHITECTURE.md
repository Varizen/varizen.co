# HAWLAT — Security Architecture

- **AuthN:** Argon2id password hashing, TOTP/WebAuthn MFA (mandatory for admin), device binding, rotating refresh tokens, session revocation.
- **AuthZ:** RBAC + object-level checks; admin actions need dedicated roles and four-eyes for gate/config changes.
- **Secrets:** environment/secret manager only; never in repo; `.env.example` has placeholders. Secret scanning in CI.
- **Transport/storage:** TLS 1.2+, HSTS; field-level encryption for NID and documents (envelope keys, rotation); NID stored as keyed hash + encrypted value.
- **API:** strict Pydantic validation, rate limiting, idempotency keys, CORS allow-list, CSRF protection for cookie flows, security headers/CSP.
- **Integrity:** append-only ledger/reputation/audit with DB triggers; audit log hash-chained.
- **Supply chain:** pinned dependencies, SCA + SAST in CI, signed images.
- **Abuse:** velocity limits, bot defence, anomaly alerts, kill switches.
- **Logging:** structured, PII-redacted; security events to audit.
- **Threat model:** STRIDE per module, reviewed each phase; pen-test before Phase 16 exit.
