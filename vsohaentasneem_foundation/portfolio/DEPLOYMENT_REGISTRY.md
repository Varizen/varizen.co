# STFL Deployment Registry

What is deployed, where, and from which folder. **Nothing here may be changed by portfolio work.**

---

## 1. Deployables

| # | Folder | Worker | Config | Domain | Build | Deploy | Status |
|---|---|---|---|---|---|---|---|
| 1 | `stflbd.org/` | `stfl-foundation-web` | `stflbd.org/wrangler.toml` | `stflbd.org`, `www.stflbd.org` | `npm run build` → `npx opennextjs-cloudflare build` | `wrangler deploy` | PRODUCTION |
| 2 | `main/web/` | `stfl-web` | `main/web/wrangler.toml` | `stflbd.app/*`, `www.stflbd.app/*` | `npm run build` → `npx opennextjs-cloudflare build` | `wrangler deploy` | PRODUCTION |
| 3 | `main/api/` | `stfl-api` | `main/api/wrangler.toml` | `stflbd.app/api/*`, `www.stflbd.app/api/*` | `wrangler deploy --dry-run --outdir dist` | `wrangler deploy` | PRODUCTION |
| 4 | `main/` | — | `main/settings.gradle.kts` | `foundation.sohaeltasneem.app` | `.\gradlew.bat :app:assembleDebug` / `bundleRelease` | Play Console (manual) | PRODUCTION |

### Environment variants

| Worker | Environment | Name | Routes |
|---|---|---|---|
| `stfl-foundation-web` | production | `stfl-foundation-web-production` | `stflbd.org`, `www.stflbd.org` |
| `stfl-web` | production | `stfl-web-production` | `stflbd.app/*`, `www.stflbd.app/*` |
| `stfl-web` | staging | `stfl-web-staging` | `staging.stflbd.app/*` |
| `stfl-api` | production | `stfl-api` | `stflbd.app/api/*`, `www.stflbd.app/api/*` |
| `stfl-api` | staging | `stfl-api` (staging env) | `staging.stflbd.app/api/*` |
| `stfl-api` | development | local only | `wrangler dev` |

---

## 2. Cloudflare bindings

| Binding | Type | Value | Changeable |
|---|---|---|---|
| `CONFIG_KV` | KV namespace | `a2f247fbc4914040adc3c78befb6bb7a` | **No** |
| `MEDIA_BUCKET` | R2 bucket | `stfl-media` | **No** |
| `HYPERDRIVE` | Hyperdrive | `REPLACE_WITH_HYPERDRIVE_ID` (placeholder in repo) | **No** |
| `ASSETS` | Workers assets | `.open-next/assets` | **No** |
| Account ID | Cloudflare account | `ffdc985581a586cce38fc03d38bd1e61` | **No** |

> The Hyperdrive id in `main/api/wrangler.toml` is the literal placeholder `REPLACE_WITH_HYPERDRIVE_ID`. The real id is set at deploy time and is **not** in this repository. This is correct — it is not a defect to fix.

---

## 3. Non-deployable folders

| Folder | Classification | Why it must not deploy |
|---|---|---|
| `web/` | LEGACY_MIRROR | `web/package.json` `predeploy` script exits 1 with *"LEGACY MIRROR — DO NOT DEPLOY"*. `web/wrangler.toml.disabled` is disabled. Deploying it would overwrite `stfl-web` on `stflbd.app`. |
| `apk/` | LEGACY_MIRROR | Duplicate of `main/` at commit `0b2469d`. No git remote. |
| `_old/` | ARCHIVE | Zips, old logo, drone video. |
| `files/web/aakutu-board/` | UNRELATED_PROJECT | Independent git repository with its own remote. Not an STFL initiative. |
| `main/preview/web/` | NESTED_REPO_IGNORED | Excluded by `main/.gitignore` (`/preview/web/`). |

---

## 4. CI/CD

| Field | Value |
|---|---|
| GitHub Actions workflows | **None.** No `.github/workflows/` directory exists in any repository in this workspace. |
| Deployment trigger | Manual (`wrangler deploy`, Play Console upload) |
| Deployment targets | Cloudflare Workers (3), Google Play (1) |

> There is no CI/CD path to break, because there is no CI/CD configuration. This is recorded as a fact, not a recommendation.

---

## 5. Secrets and credentials

| File | Purpose | Gitignored | Touched by portfolio work |
|---|---|---|---|
| `main/keystore.properties` | Android signing config | Yes | **No** |
| `apk/keystore.properties` | Legacy signing config | Yes | **No** |
| `main/local.properties` | Android SDK path | Yes | **No** |
| `apk/local.properties` | Legacy SDK path | Yes | **No** |
| `main/api/.dev.vars` | Local API secrets | Yes | **No** |
| `main/web/.env.production` | Web env | Yes | **No** |
| `stflbd.org/.env.production` | Org env | Yes | **No** |
| `web/.env.production` | Legacy env | Yes | **No** |

Worker secrets (`JWT_SECRET`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) are set with `wrangler secret put` and are **not** in this repository.

---

## 6. Deployment invariants

| Invariant | Value |
|---|---|
| Foundation domain | `https://stflbd.org` |
| App domain | `https://stflbd.app` |
| API base | `https://stflbd.app/api/v1` |
| Worker names | `stfl-foundation-web`, `stfl-web`, `stfl-api` |
| `CONFIG_KV` id | `a2f247fbc4914040adc3c78befb6bb7a` |
| R2 bucket | `stfl-media` |
| Hyperdrive binding | `HYPERDRIVE` |
| Android `applicationId` | `foundation.sohaeltasneem.app` |
| Play Store configuration | Unchanged |

---

## 7. Verification

| Check | Command | Working directory |
|---|---|---|
| API dry-run deploy | `npm run build` | `main/api` |
| Web build | `npm run build` | `main/web` |
| Org build | `npm run build` | `stflbd.org` |
| Android build | `.\gradlew.bat :app:assembleDebug` | `main` |
| Live domain smoke | `.\scripts\verify-live-domains.ps1` | root |
