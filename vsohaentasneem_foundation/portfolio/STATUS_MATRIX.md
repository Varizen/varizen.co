# STFL Status Matrix

Live / not live, at a glance. Reconciled 2026-10-18.

---

## 1. Production surfaces

| Surface | Domain | Worker | State | Verified |
|---|---|---|---|---|
| Foundation website | `stflbd.org` | `stfl-foundation-web` | DEPLOYED | Domain linter PASS |
| Enterprise Workspace | `stflbd.org/admin/*` | `stfl-foundation-web` | DEPLOYED | Domain linter PASS |
| App landing | `stflbd.app` | `stfl-web` | DEPLOYED | Domain linter PASS |
| API | `stflbd.app/api/v1` | `stfl-api` | DEPLOYED | Domain linter PASS |
| Media | `stflbd.app/media` | R2 `stfl-media` | DEPLOYED | — |
| Android app | `foundation.sohaeltasneem.app` | — | RELEASE CONFIGURED | — |

> "DEPLOYED" reflects the deployment configuration in this repository. Live HTTP verification **was** performed on 2026-10-18: `.\scripts\verify-live-domains.ps1` returned 79 checks, 0 failures.

---

## 2. Project matrix

| Project | Lifecycle | Production | Domain | Brand | Visibility | Source in repo |
|---|---|---|---|---|---|---|
| GrihostiOS | `PILOT` | `ACTIVE_PILOT` | `grihostios.stflbd.app` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| SkillConnect | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `skillconnect.stflbd.app` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| AEV Developments | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `aev.stflbd.app` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| MaxRemit | `PROTOTYPE` | `PRE_REGULATORY_PILOT` | `maxremit.stflbd.app` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| Helpex | `CONCEPT` | `REGULATED_SANDBOX_CONCEPT` | `helpex.my` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| Proiozon | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `proiozon.com` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| Perlu | `ACTIVE_DEVELOPMENT` | `ACTIVE_DEVELOPMENT` | `perlu.my` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| OIIX | `PROTOTYPE` | `PROTOTYPE` | `oiix.fun` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| Hashify | `CONCEPT` | `CONCEPT` | `hashify.baby` | CONCEPT_ONLY | INTERNAL_ONLY | No |
| YourGiftCardSupply | `ARCHIVED` | `ARCHIVED` | `yourgiftcardsupply.com` | LEGACY | INTERNAL_ONLY | No |
| Cikgu Fatimah's Cloud Kitchen | `CONCEPT` | `EXPLORATORY` | — | CONCEPT_ONLY | INTERNAL_ONLY | No |
| HakimSarker.org | `LIVE` | `ACTIVE_ARCHIVE` | `hakimsarker.org` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |
| QiM-AI 2.1 | `ACTIVE_DEVELOPMENT` | `DEVELOPMENT_AND_DEMO` | `qimai.codes` | NATIVE_VERIFIED | PUBLICATION_APPROVED | Yes |

---

## 3. Counts

| Dimension | Value |
|---|---|
| Projects registered | 13 |
| Publicly published | 10 |
| Internal only | 3 |
| With source in this repository | 9 |
| With a registered domain | 12 |
| With a verified native brand | 10 |
| Archived | 1 |

---

## 4. Folder classification

| Folder | Class | Deployable | State |
|---|---|---|---|
| `stflbd.org/` | A · PRODUCTION | Yes | Active |
| `main/web/` | A · PRODUCTION | Yes | Active |
| `main/api/` | A · PRODUCTION | Yes | Active |
| `main/` (Android) | A · PRODUCTION | Yes | Active |
| `main/docs/` | E · DOCUMENTATION | No | Active |
| `main/preview/web/` | G · EXPERIMENTAL | No | Gitignored nested repo |
| `web/` | H · ARCHIVE (legacy mirror) | No | Frozen |
| `apk/` | H · ARCHIVE (legacy mirror) | No | Frozen |
| `_old/` | H · ARCHIVE | No | Frozen |
| `md-s/` | E · DOCUMENTATION | No | Active |
| `official_doc/` | D · GOVERNANCE | No | Active |
| `scripts/` | I · BUILD/TOOLING | No | Active |
| `files/web/aakutu-board/` | J · UNKNOWN (unrelated project) | No | External |
| `files/shot.png` | J · UNKNOWN | No | Unclassified |
| `P1.pdf` | J · UNKNOWN | No | Unclassified |
| `hs_err_pid32616.log` | I · BUILD/TOOLING (debris) | No | Debris |
| `*.bat` launchers | I · BUILD/TOOLING | No | Local dev |
| Root `STFL_*.md` | D · GOVERNANCE | No | Active |
| `brandcenter/` | C · BRAND | No | New |
| `projects/` | F · PROJECT | No | New |
| `portfolio/` | E · DOCUMENTATION | No | New |
| `stfl-main/` | E · DOCUMENTATION (pointer) | No | New |
| `docs/` | E · DOCUMENTATION | No | New |
| `tools/` | I · BUILD/TOOLING | No | New |

---

## 5. Verification state

| Check | Result |
|---|---|
| Domain separation linter (`main/web`) | **PASS** |
| Domain separation linter (`stflbd.org`) | **PASS** |
| Web type-check | NOT RUN |
| Web lint | NOT RUN |
| Web build | NOT RUN |
| Org type-check | NOT RUN |
| Org build | NOT RUN |
| API typecheck | NOT RUN |
| API tests | NOT RUN |
| API dry-run deploy | NOT RUN |
| Android build | NOT RUN |
| Live domain smoke | **PASS** — 79 checks, 0 failures |

Checks marked NOT RUN were not executed because this operation modified **zero** production files. They remain the gate for any future production change. The live domain smoke test **was** executed and passed.
