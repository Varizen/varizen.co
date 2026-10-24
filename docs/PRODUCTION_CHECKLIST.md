# Production readiness checklist

Status as of 2026-10-24. Each item states what to do, how to verify it, and what breaks if skipped.
Items marked **BLOCKER** must be resolved before the feature is exposed publicly.

---

## 0. Known blockers found in review

### B1 — RESOLVED: AiBrowser modal preview and CSP configured

`src/proxy.ts` includes `frame-src 'self' https:` in the CSP policy, and `src/components/aibrowser-modal.tsx` provides an isolated preview container with clear user guidance that external cross-origin sites restrict embedding via `X-Frame-Options`, pointing users to the native app download for full browsing.

**Verify:** load `/` in a production build (`npm run build && npm start`), open the AiBrowser modal, and confirm the preview mounts without CSP error.

### B2 — BLOCKER: the download zip does not exist on the deployed host

`public/downloads/AiBrowser-win-x64.zip` is git-ignored (81 MB), so it is absent from a fresh
clone and from any build that starts from the repository. `/api/download/aibrowser` returns
**503** with an explanatory body.

**Do one:**

- Set `AIBROWSER_RELEASE_URL` to a GitHub Release asset URL. The route then 307-redirects.
- Or upload the zip to the host out-of-band and keep it at `public/downloads/`.

**Verify:** `curl -sI https://varizen.co/api/download/aibrowser` returns `200` with
`content-type: application/zip`, or `307` to the release URL. A `503` means it is unconfigured.

### B3 — BLOCKER: Eye AI is fail-closed and will return 503 until configured

`/api/v1/eye-ai/chat` refuses to serve unless **both** `EYE_INSTALL_TOKENS` and at least one
`OPENROUTER_API_KEY_*` are set. This is intentional.

**Do:**

1. Revoke the OpenRouter key that was pasted into chat. Treat it as compromised.
2. Create a replacement in the OpenRouter dashboard.
3. Set on the host: `OPENROUTER_API_KEY_1`, optionally `OPENROUTER_API_KEY_2`,
   `EYE_INSTALL_TOKENS` (comma-separated, long random values), `EYE_AI_ENABLED=true`.
4. Distribute one install token to each AiBrowser user; they paste it into
   Settings → Install token.

**Verify:** `curl -s https://varizen.co/api/v1/eye-ai/status` returns
`{"ok":true,...,"status":"operational"}`. `ok:false` + `"misconfigured"` means a variable is missing.

---

## 1. Environment variables

Set these in the host's encrypted secret store. Never commit them.

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URL, no trailing slash. Drives metadata, sitemap, robots. |
| `DATABASE_URL` | yes | PostgreSQL 16+, TLS. Least-privilege runtime role. |
| `DATABASE_SSL` | yes | `true` in production. |
| `RATE_LIMIT_PEPPER` | yes | `openssl rand -base64 48`. **`requestKey` throws in production if unset.** |
| `TRUST_PROXY_HEADERS` | yes | `true` only on Vercel (sanitized `x-vercel-forwarded-for`). `false` self-hosted. |
| `OPENROUTER_API_KEY_1` | for Eye AI | Gateway key. Never shipped to the client. |
| `OPENROUTER_API_KEY_2` | optional | Second key for failover. |
| `EYE_INSTALL_TOKENS` | for Eye AI | Comma-separated. Unset ⇒ chat returns 503. |
| `EYE_AI_ENABLED` | optional | `false` is the kill switch. |
| `AIBROWSER_RELEASE_URL` | for download | Hosted zip URL. Unset ⇒ 503 when the local zip is absent. |
| `VZ_PRODUCT_OVERRIDES` | optional | JSON product overrides. |

`.env.example` currently documents only the first five. **Add the Eye AI and download
variables to it** so the next deployer sees them.

---

## 2. Database

1. Take and verify a backup before any migration.
2. `npm run db:generate` in development; review the generated SQL. Never generate during deploy.
3. Apply with `npm run db:migrate` using a controlled migration role.
4. Switch the runtime to a least-privilege role that cannot alter schema.
5. Apply the revocations in `drizzle/0001_integrity.sql`:
   `REVOKE UPDATE, DELETE ON audit_events, evidence FROM <runtime_role>;`
6. Never run seed data in production.

**Verify:** `/api/health` returns `{"status":"ok"}`. A `503` means the DB is unreachable.

---

## 3. Rate limiting — accepted limitation

`src/server/rate-limit.ts` is **per-instance, in-memory**. On serverless or multi-instance
hosts the effective limit is `limit × instances`, and it resets on cold start.

- Single instance: acceptable, document the decision.
- Multi-instance: replace with Redis/Upstash or equivalent atomic store **before** enabling
  public contact submission or Eye AI.

The Eye AI chat route uses this limiter at 30 req/min per install token.

---

## 4. Security headers

`src/proxy.ts` sets CSP, `X-Content-Type-Options: nosniff`, and `frame-ancestors 'none'`.
`vercel.json` sets `Cache-Control: no-store` on `/api/*`, `/app/*`, `/admin/*`.

**Verify:**

```sh
curl -sI https://varizen.co/ | grep -i content-security-policy
curl -sI https://varizen.co/api/v1/eye-ai/status | grep -i cache-control
```

Confirm the Eye AI routes emit **no** `access-control-allow-origin` header. They are
deliberately not CORS-enabled; the desktop app's main-process fetch does not preflight.

---

## 5. Build and test gate

```sh
npm ci
npm run db:generate
npm run lint          # currently FAILS on browser/** — see item 7
npm run typecheck
npm run test
npm run build
npm run test:e2e
cd browser && npm run check && npm run test:e2e
```

Expected today: site typecheck/build pass, 29 browser unit tests pass, 16 Electron smoke tests
pass, **root lint fails**.

---

## 6. AiBrowser desktop release

1. `cd browser && npm run dist` (Windows). First run may fail on `winCodeSign` symlinks when
   Developer Mode is off — see the AiBrowser Engineer agent notes for the workaround.
2. Artifacts land in `browser/dist/`: NSIS installer + portable exe.
3. **Code signing is not configured.** Windows SmartScreen will warn users. Obtain a code
   signing certificate before public distribution.
4. `browser/package.json` has no `author` and no app icon — both produce build warnings and an
   unbranded binary.
5. Publish the zip to a release, then set `AIBROWSER_RELEASE_URL`.

**Verify:** install on a clean Windows machine, launch, open a tab, confirm Eye Shield blocks a
tracker, confirm Settings → Eye AI shows a status.

---

## 7. Known non-blocking issues

| Issue | Impact | Fix |
|---|---|---|
| Root `npm run lint` fails on `browser/**` (20 `no-require-imports`) | CI red | Add `"browser/**"` to `globalIgnores` in `eslint.config.mjs` |
| `browser/package.json` missing `author`, `build.win.icon` | Cosmetic build warnings | Add both |
| Electron app never manually exercised | Unknown UI bugs | Manual pass: tabs, downloads, MCP, private mode |
| `main.js`, `preload.js`, `ai.js`, `downloads.js`, `mcp.js`, `settings.js`, `ui/app.js` untested | Regressions undetected | Extend the Playwright smoke test |
| Rate limiter per-instance | Limits vary by instance | Shared atomic store |

---

## 8. Launch verification

Run after deploy, in order:

```sh
curl -sI  https://varizen.co/                          # 200, CSP present
curl -s   https://varizen.co/api/health                # {"status":"ok"}
curl -s   https://varizen.co/api/v1/eye-ai/status      # ok:true, status:operational
curl -sI  https://varizen.co/api/download/aibrowser    # 200 zip, or 307 to release
curl -s -o /dev/null -w "%{http_code}" https://varizen.co/admin   # 307 to /login
curl -s -o /dev/null -w "%{http_code}" https://varizen.co/products/does-not-exist  # 404
```

Then manually: open the AiBrowser modal (expect the CSP decision from B1), submit the contact
form, and confirm the Eye AI status in the desktop app reads `Free · N models`.

---

## 9. Rollback

1. Stop routing traffic to the unhealthy release.
2. Roll back to the previous immutable deployment or container image.
3. Roll forward a compatible migration. Never destructively reverse one without a reviewed
   recovery plan and a verified backup.
4. Revoke affected session families or increment `authVersion` if token integrity is in doubt.
5. Re-run the section 8 checks.
