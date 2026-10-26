# STFL Roadmap

Derived from `STFL_VI_ROADMAP.md`, `STFL_VI_GO_LIVE_READINESS.md` and the project registry. Only items with repository evidence are listed.

---

## 1. Immediate — production readiness

| # | Item | Evidence | Owner | State |
|---|---|---|---|---|
| 1 | `stflbd.org` DNS must resolve on Cloudflare | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F1 — nameservers were `launch1/launch2.spaceship.net` | Infrastructure | OPEN |
| 2 | Remove foundation and admin routes from `main/web` | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F2 | Web | IN PROGRESS |
| 3 | Retarget `stflbd.org/src` canonical URLs from `.app` to `.org` | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F4 — ~45 files | Web | IN PROGRESS |
| 4 | Add `stflbd.org` to API `ALLOWED_ORIGINS` | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F5 | API | DONE — present in `main/api/wrangler.toml` |
| 5 | Resolve `api.stflbd.app` stale default in Android | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F6 | Android | DONE — `DataModule.kt:112` now uses `Brand.API_BASE_URL` |
| 6 | Archive `web/` and `apk/` legacy mirrors | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` §3.1 | Repo | OPEN |
| 7 | **Restore `stflbd.app/api/v1/*`** — every probed path returns 404 | Live probe 2026-10-18: `/api/v1/health`, `/api/v1/app/config`, `/api/v1/verify/test` | Infrastructure | **OPEN — HIGH** |

## 2. Near term — Android completion

| # | Item | Evidence | State |
|---|---|---|---|
| 1 | Full UI screens (`:ui`) | `main/README.md` — 25+ screens needed | OPEN |
| 2 | Firebase integration (`:notifications`) | `main/README.md` | OPEN |
| 3 | Release signing and AAB generation | `main/README.md` | OPEN |
| 4 | Play Store submission | `main/docs/PLAY_STORE_LISTING.md` | OPEN |

## 3. Near term — portfolio operations

| # | Item | State |
|---|---|---|
| 1 | Commit or stash the 112 status entries in `main/` | OPEN |
| 2 | Add CI running the regression gate | OPEN |
| 3 | Reconcile `STFL_VI_CANONICAL_SOURCE_MAP.md` with files that exist | OPEN |
| 4 | Classify `P1.pdf`, `_old/*.zip`, `official_doc/templates/*` | OPEN |
| 5 | Decide `web/` and `apk/` fate | OPEN |

## 4. Project roadmap

| Project | Next milestone | Evidence |
|---|---|---|
| GrihostiOS | Pilot → active | `STFL_WEB_GRIHOSTIOS_MODEL.md` |
| SkillConnect | Development → pilot | `STFL_AIO_MULTI_PROJECT_ARCHITECTURE.md` |
| AEV Developments | Development → pilot | `STFL_AIO_PROJECT_MODEL.md` |
| MaxRemit | Prototype → regulatory pilot | `STFL_AIO_FINANCE_MODEL.md` |
| Helpex | Concept → sandbox | `STFL_AIO_FINANCE_MODEL.md` |
| Proiozon | Development → launch | `STFL_AIO_PROJECT_MODEL.md` |
| Perlu | Development → launch | `STFL_AIO_PROJECT_MODEL.md` |
| OIIX | Prototype → pilot | `STFL_AIO_COMMUNICATION_MODEL.md` |
| Hashify | Concept → prototype | `STFL_AIO_DEPENDENCY_INDEX.json` |
| Cikgu Fatimah's Cloud Kitchen | Concept → pilot | community notes |
| HakimSarker.org | Maintain archive | `STFL_PROJECT_REGISTRY.json` |
| QiM-AI 2.1 | Development → demo → launch | `QIMAI_PLATFORM_SPEC.md` (referenced) |
| YourGiftCardSupply | None — archived | `STFL_PROJECT_REGISTRY.json` |

## 5. Deferred — the `stfl-main/` move

| # | Prerequisite | State |
|---|---|---|
| 1 | Freeze and commit the `main/` working tree | OPEN |
| 2 | Update `main/web/package.json` `verify:domains` path | OPEN |
| 3 | Update `stflbd.org/package.json` `verify:domains` path | OPEN |
| 4 | Rewrite `STFL_VI_CANONICAL_SOURCE_MAP.md` paths | OPEN |
| 5 | Rewrite `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` paths | OPEN |
| 6 | Re-run full regression gate | OPEN |
| 7 | Re-verify live domains | OPEN |

Until all seven are complete, the move stays blocked. See [`../stfl-main/README.md`](../stfl-main/README.md).

---

## 6. Roadmap rules

1. A roadmap item without repository evidence is not listed.
2. An item is `DONE` only when the change is present in the tree.
3. `OPEN` items are not commitments — they are recorded gaps.
4. Completing an item updates this file **and** the affected registry in the same change.
