# STFL Portfolio Master

**SohaelTasneem Foundation** · Bangladesh · canonical domain `stflbd.org`

| Field | Value |
|---|---|
| Registry version | 2026.10.18 |
| Baseline commit | `main` @ `b7f9939` (branch `stfl/pre-playstore-2026`) |
| Projects registered | 13 |
| Production deployables | 4 |
| Domains registered | 16 |
| Canonical brand assets | 36 |

---

## 1. The estate in one table

| Layer | What it is | Where |
|---|---|---|
| Institution | SohaelTasneem Foundation | `stflbd.org` |
| Platform | STFL VI — institutional operating platform | `stflbd.org` + `stflbd.app` |
| Production app | Android application | `foundation.sohaeltasneem.app` |
| Production web | Foundation site + Enterprise Workspace | `stflbd.org` |
| Production web | App landing | `stflbd.app` |
| Production API | Hono on Cloudflare Workers | `stflbd.app/api/v1` |
| Projects | 13 registered initiatives | `projects/` |
| Brand | Identity + governance + assets | `brandcenter/` |

---

## 2. Production deployables

| # | Folder | Worker | Domain | Status |
|---|---|---|---|---|
| 1 | `stflbd.org/` | `stfl-foundation-web` | `https://stflbd.org` | PRODUCTION |
| 2 | `main/web/` | `stfl-web` | `https://stflbd.app` | PRODUCTION |
| 3 | `main/api/` | `stfl-api` | `https://stflbd.app/api/v1` | PRODUCTION |
| 4 | `main/` | — | `foundation.sohaeltasneem.app` | PRODUCTION |

Non-deployable folders: `web/` (legacy mirror, `predeploy` exits 1), `apk/` (legacy mirror), `_old/` (archive), `files/web/aakutu-board/` (unrelated project), `main/preview/web/` (gitignored nested repo).

---

## 3. Project portfolio by lifecycle

| State | Count | Projects |
|---|---|---|
| `LIVE` | 1 | HakimSarker.org |
| `PILOT` | 1 | GrihostiOS |
| `ACTIVE_DEVELOPMENT` | 5 | SkillConnect, AEV Developments, Proiozon, Perlu, QiM-AI 2.1 |
| `PROTOTYPE` | 2 | MaxRemit, OIIX |
| `CONCEPT` | 3 | Helpex, Hashify, Cikgu Fatimah's Cloud Kitchen |
| `ARCHIVED` | 1 | YourGiftCardSupply |

Full detail: [`PROJECT_REGISTRY.md`](./PROJECT_REGISTRY.md).

---

## 4. Domain portfolio

| Domain | Role | Production |
|---|---|---|
| `stflbd.org` | Foundation website + Enterprise Workspace | Yes |
| `www.stflbd.org` | Redirect / alias | Yes |
| `stflbd.app` | App landing + API + media | Yes |
| `www.stflbd.app` | Redirect / alias | Yes |
| `staging.stflbd.app` | Staging | Yes (staging) |
| `grihostios.stflbd.app` | GrihostiOS product surface | Registered |
| `skillconnect.stflbd.app` | SkillConnect product surface | Registered |
| `aev.stflbd.app` | AEV Developments product surface | Registered |
| `maxremit.stflbd.app` | MaxRemit product surface | Registered |
| `helpex.my` | Helpex | Registered |
| `proiozon.com` | Proiozon | Registered |
| `perlu.my` | Perlu | Registered |
| `oiix.fun` | OIIX | Registered |
| `hashify.baby` | Hashify | Registered |
| `hakimsarker.org` | HakimSarker archive | Registered |
| `qimai.codes` | QiM-AI | Registered |

Full detail: [`DOMAIN_REGISTRY.md`](./DOMAIN_REGISTRY.md).

---

## 5. Technology portfolio

| Layer | Technology |
|---|---|
| Web (both domains) | Next.js 15 App Router, React 19, TypeScript 5, Tailwind CSS 4 |
| Web deployment | `@opennextjs/cloudflare` → Cloudflare Workers |
| API | Hono 4 on Cloudflare Workers, TypeScript |
| Database | PostgreSQL via Cloudflare Hyperdrive |
| Media | Cloudflare R2 (`stfl-media`) |
| Config | Cloudflare KV (`CONFIG_KV`) |
| Android | Kotlin, Jetpack Compose, Gradle 9.8.1, minSdk 26 |
| Android data | Room, encrypted storage |
| Icons | Iconoir only (`iconoir-react`) |
| Fonts | Hind Siliguri, Noto Sans Bengali, Baloo Da 2, Inter, JetBrains Mono |

Full detail: [`TECHNOLOGY_REGISTRY.md`](./TECHNOLOGY_REGISTRY.md).

---

## 6. Brand portfolio

| Category | Count | Canonical location |
|---|---|---|
| Master logo | 3 | `brandcenter/identity/master-logo/` |
| Monochrome marks | 2 | `brandcenter/identity/monochrome/` |
| Symbol | 1 | `brandcenter/identity/symbol/` |
| Wordmarks | 3 | `brandcenter/identity/horizontal/` |
| Favicon | 1 | `brandcenter/identity/favicon/` |
| Project logos (vector) | 11 | `brandcenter/assets/vector/` |
| Project logos (raster) | 1 | `brandcenter/assets/raster/` |
| Photography | 6 | `brandcenter/assets/raster/` |
| Hero artwork | 1 | `brandcenter/assets/digital/` |
| Fonts | 6 | `brandcenter/assets/digital/fonts/` |
| Document templates | 14 | `brandcenter/templates/documents/` |

Full detail: [`BRAND_REGISTRY.md`](./BRAND_REGISTRY.md).

---

## 7. What is not in this portfolio

| Item | Why |
|---|---|
| `files/web/aakutu-board/` | Independent project with its own git remote; not an STFL initiative |
| `main/preview/web/` | Gitignored nested repository inside `main/` |
| `_old/*.zip` | Uninspected archives; classified `UNKNOWN`, retained |
| `P1.pdf` | Unclassified document; retained as `UNKNOWN` |
| `hs_err_pid32616.log` | JVM crash log; build debris |

`UNKNOWN` items are never deleted and never relocated until classified.
