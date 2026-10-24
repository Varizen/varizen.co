# Security model

## Boundaries

Public pages contain only supplied corporate information, clearly labelled product direction and architectural explanations. `/app` and `/admin` are denied by default in the proxy and again in server-rendered layouts/actions. Proxy presence of a cookie is only an optimistic gate, never authorization. Protected API responses use no-store caching.

Authentication is deliberately not simulated. An identity provider must provision activated users and verify MFA before sessions are issued. Role permission checks are centralized in `src/server/authorization.ts`; every object query must additionally enforce project entitlement, expiry and revocation.

## Sessions

Only cryptographically random opaque tokens reach the browser. Database records contain token hashes. Cookies are HttpOnly, Secure, SameSite=Strict, `__Host-` prefixed and path-scoped. Idle expiry is 15 minutes, absolute expiry is 12 hours. Session rotation and family revocation are provided in `src/server/sessions.ts`. Passwords, QR codes and invitation tokens are never treated as authenticated sessions.

## Public mutations

Contact POST requires same-origin Origin validation, a zod-validated payload, an idempotency key and an allowed rate-limit bucket. A hidden field reduces basic automated spam. Honeypots alone are not bot protection; use a privacy-conscious edge challenge if abuse warrants it. All unexpected errors return a safe 503 and request ID; payloads and credentials are not logged.

## Audit and evidence

Audit/evidence entries have hash-chain fields and creation timestamps. Hash chains provide tamper evidence, not magical immutability. Restrict runtime UPDATE/DELETE privileges, secure the database, replicate audit exports and verify chain continuity independently. Administrative actions must include actor, target, before/after values, reason and request ID. Sensitive values must be redacted before hashing/logging.

## Reporting

Report potential vulnerabilities to `emmergency@varizen.co` (address supplied by the project owner). Do not include secrets, other users' data or disruptive testing. See the public Responsible Disclosure page for scope and boundaries.
