# STFL Domain Registry

Every domain STFL owns, operates or has registered. **No domain value in this registry may be changed by portfolio work.**

---

## 1. Production domains (permanent contracts)

| Domain | Role | Owner | Worker | DNS | Changeable |
|---|---|---|---|---|---|
| `stflbd.org` | Foundation website + Enterprise Workspace | STFL | `stfl-foundation-web` | Cloudflare zone `stflbd.org` | **No** |
| `www.stflbd.org` | Alias / redirect | STFL | `stfl-foundation-web` | Cloudflare zone `stflbd.org` | **No** |
| `stflbd.app` | App landing + API + media | STFL | `stfl-web` + `stfl-api` | Cloudflare zone `stflbd.app` | **No** |
| `www.stflbd.app` | Alias / redirect | STFL | `stfl-web` + `stfl-api` | Cloudflare zone `stflbd.app` | **No** |
| `staging.stflbd.app` | Staging environment | STFL | `stfl-web-staging` + `stfl-api` (staging) | Cloudflare zone `stflbd.app` | **No** |

### Route ownership

| Route pattern | Worker | Zone |
|---|---|---|
| `stflbd.org` | `stfl-foundation-web` | `stflbd.org` |
| `www.stflbd.org` | `stfl-foundation-web` | `stflbd.org` |
| `stflbd.app/*` | `stfl-web` | `stflbd.app` |
| `www.stflbd.app/*` | `stfl-web` | `stflbd.app` |
| `staging.stflbd.app/*` | `stfl-web-staging` | `stflbd.app` |
| `stflbd.app/api/*` | `stfl-api` | `stflbd.app` |
| `www.stflbd.app/api/*` | `stfl-api` | `stflbd.app` |
| `staging.stflbd.app/api/*` | `stfl-api` (staging) | `stflbd.app` |

> More specific routes win. `stflbd.app/api/*` is served by `stfl-api`, not `stfl-web`.

---

## 2. API contract

| Field | Value |
|---|---|
| Base URL | `https://stflbd.app/api/v1` |
| Worker | `stfl-api` |
| Framework | Hono 4 |
| CORS origins | `https://stflbd.org`, `https://www.stflbd.org`, `https://stflbd.app`, `https://www.stflbd.app` |
| Media base | `https://stflbd.app/media` |
| Changeable | **No** |

---

## 3. Android endpoint contracts

| Constant | Value | Source |
|---|---|---|
| `FOUNDATION_URL` | `https://stflbd.org` | `main/core/src/main/kotlin/foundation/sohaeltasneem/core/brand/Brand.kt:13` |
| `WEBSITE` | `https://stflbd.org` | `Brand.kt:14` |
| `APP_URL` | `https://stflbd.app` | `Brand.kt:17` |
| `API_BASE_URL` | `https://stflbd.app/api/v1` | `Brand.kt:20` |
| `DEFAULT_BASE_URL` | `Brand.API_BASE_URL` | `main/data/.../di/DataModule.kt:112` |
| `privacyUrl` | `https://stflbd.app/privacy` | `main/domain/.../model/AppConfig.kt:98` |
| `termsUrl` | `https://stflbd.app/terms` | `AppConfig.kt:99` |
| `safeguardingUrl` | `https://stflbd.app/safeguarding` | `AppConfig.kt:100` |
| `accountDeletionUrl` | `https://stflbd.app/account-deletion` | `AppConfig.kt:101` |
| `foundationUrl` | `https://stflbd.org` | `AppConfig.kt:102` |
| `applicationId` | `foundation.sohaeltasneem.app` | `main/app/build.gradle.kts:36` |
| `namespace` | `foundation.sohaeltasneem.app` | `main/app/build.gradle.kts:32` |

---

## 4. Permanent QR / verification contracts

These URLs are printed on physical documents and must resolve forever.

| Pattern | Served by | Domain |
|---|---|---|
| `stflbd.app/v/{code}` | `stfl-web` | `stflbd.app` |
| `stflbd.app/verify/{id}` | `stfl-web` | `stflbd.app` |

---

## 5. Project domains

| Domain | Project | Status | Evidence |
|---|---|---|---|
| `grihostios.stflbd.app` | GrihostiOS | Registered | `STFL_PROJECT_REGISTRY.json` |
| `skillconnect.stflbd.app` | SkillConnect | Registered | `STFL_PROJECT_REGISTRY.json` |
| `aev.stflbd.app` | AEV Developments | Registered | `STFL_PROJECT_REGISTRY.json` |
| `maxremit.stflbd.app` | MaxRemit | Registered | `STFL_PROJECT_REGISTRY.json` |
| `helpex.my` | Helpex | Registered | `STFL_PROJECT_REGISTRY.json` |
| `proiozon.com` | Proiozon | Registered | `STFL_PROJECT_REGISTRY.json` |
| `perlu.my` | Perlu | Registered | `STFL_PROJECT_REGISTRY.json` |
| `oiix.fun` | OIIX | Registered | `STFL_PROJECT_REGISTRY.json` |
| `hashify.baby` | Hashify | Registered | `STFL_PROJECT_REGISTRY.json` |
| `yourgiftcardsupply.com` | YourGiftCardSupply | Archived | `STFL_PROJECT_REGISTRY.json` |
| `hakimsarker.org` | HakimSarker | Registered | `STFL_PROJECT_REGISTRY.json` |
| `qimai.codes` | QiM-AI 2.1 | Registered | `STFL_PROJECT_REGISTRY.json` |

> "Registered" means the domain is recorded in the project registry. It does **not** assert that DNS is configured or that the domain resolves. DNS state is `NOT RECORDED` for every project domain.

---

## 6. Legacy / non-production domains

| Domain | Status | Evidence |
|---|---|---|
| `sohaeltasneem.foundation` | Legacy — 301 to `stflbd.org` | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` §1 |
| `stflbd.email` | Official email (`hi@stflbd.email`), not a website | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` §1 |
| `api.stflbd.app` | **Does not resolve.** Referenced in a stale Android default only. | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F6 |

---

## 7. Domain rules

1. `stflbd.org` is the organisation. `stflbd.app` is the mobile app — its landing page and its backend. Nothing else.
2. Never hard-code a domain in application code. Import from `src/lib/domains.ts`.
3. Never introduce an alternate production domain.
4. Never change DNS as part of repository work.
5. Never point a foundation page's canonical URL at `stflbd.app`.

Enforced by [`scripts/verify-domain-separation.mjs`](../scripts/verify-domain-separation.mjs) and [`scripts/verify-live-domains.ps1`](../scripts/verify-live-domains.ps1).

---

## 8. Verification

| Check | Command | Working directory |
|---|---|---|
| Domain separation linter | `node ../../scripts/verify-domain-separation.mjs` | `main/web` |
| Domain separation linter (org) | `node ../scripts/verify-domain-separation.mjs` | `stflbd.org` |
| Live domain smoke | `.\scripts\verify-live-domains.ps1` | root |
