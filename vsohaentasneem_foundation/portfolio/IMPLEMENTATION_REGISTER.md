# STFL Implementation Register

What is actually built, versus what is specified. Evidence-based only.

---

## 1. Implementation state by area

| Area | State | Evidence |
|---|---|---|
| Foundation website (`stflbd.org`) | **IMPLEMENTED** | 60+ routes under `stflbd.org/src/app/` |
| Enterprise Workspace (`stflbd.org/admin/*`) | **IMPLEMENTED** | 20 console routes |
| App landing (`main/web`) | **IMPLEMENTED** | 20 routes under `main/web/src/app/` |
| API (`main/api`) | **IMPLEMENTED** | Hono router, 3 migrations, test suite |
| Android app (`main`) | **PARTIAL** | Foundation + data + mock backend complete; full UI screens outstanding |
| Brand Center | **IMPLEMENTED** | This directory |
| Portfolio layer | **IMPLEMENTED** | This directory |
| Project workspaces | **IMPLEMENTED** | 13 workspaces under `projects/` |

---

## 2. Foundation website — route inventory

| Route group | Routes | State |
|---|---|---|
| Public foundation | `/`, `/about`, `/mission`, `/programs`, `/impact`, `/news`, `/events`, `/gallery`, `/publications`, `/reports`, `/team`, `/careers`, `/contact`, `/faq`, `/donate`, `/volunteer`, `/partner` | IMPLEMENTED |
| Initiatives | `/initiatives`, `/initiatives/[projectSlug]`, plus 10 explicit project pages | IMPLEMENTED |
| Brand | `/brand`, `/brandcenter` | IMPLEMENTED |
| Auth | `/login`, `/signup` | IMPLEMENTED |
| Legal | `/privacy`, `/terms`, `/safeguarding`, `/cookies` | IMPLEMENTED |
| Enterprise Workspace | `/admin` + 20 consoles (agents, assets, communications, compliance, devices, documents, eshop, executive, finance, governance, iam, knowledge, microfinance, projects, property, security, system, workforce) | IMPLEMENTED |

## 3. App landing — route inventory

| Route | State |
|---|---|
| `/` (AppLandingPage) | IMPLEMENTED |
| `/download` | IMPLEMENTED |
| `/demo` + 8 demo sub-routes | IMPLEMENTED |
| `/roadmap` | IMPLEMENTED |
| `/privacy`, `/terms`, `/safeguarding`, `/cookies`, `/account-deletion` | IMPLEMENTED |
| `/v/[code]`, `/verify`, `/verify/[documentId]` | IMPLEMENTED |

## 4. API — implementation inventory

| Area | State | Evidence |
|---|---|---|
| Router | IMPLEMENTED | `main/api/src/app.ts` |
| Authorization engine | IMPLEMENTED | `main/api/src/authorization/` |
| Approval engine | IMPLEMENTED | `main/api/src/approval/engine.ts` |
| Document engine | IMPLEMENTED | `main/api/src/documents/engine.ts` |
| Print engine | IMPLEMENTED | `main/api/src/print/` |
| Communications gateway | IMPLEMENTED | `main/api/src/comms/engine.ts` |
| GrihostiOS engine | IMPLEMENTED | `main/api/src/grihosti/engine.ts` |
| Agent runtime | IMPLEMENTED | `main/api/src/agents/` |
| Migrations | IMPLEMENTED | `0001`, `0002_aio_parties_iam`, `0003_grihostios` |
| Tests | IMPLEMENTED | `main/api/test/` (Vitest) |

## 5. Android — implementation inventory

| Module | State | Notes |
|---|---|---|
| `core` | IMPLEMENTED | Design system, brand, security primitives |
| `domain` | IMPLEMENTED | Models and contracts |
| `network` | IMPLEMENTED | API client, all endpoints defined |
| `database` | IMPLEMENTED | Room cache |
| `security` | IMPLEMENTED | Encrypted storage, screen protection |
| `data` | IMPLEMENTED | Repositories, DI container, tests |
| `devmockserver` | IMPLEMENTED | JDK `HttpServer`, development only |
| `app` | PARTIAL | Vertical slice wired (login → home → content) |
| `ui` | PARTIAL | Screens outstanding |
| `notifications` | NOT IMPLEMENTED | Firebase integration outstanding |

`main/README.md` records overall completion at ~35% with ~12,000 LOC remaining for full UI.

---

## 6. Production regression gate

Run before declaring any production-affecting change complete.

| # | Check | Command | Working directory | Baseline result |
|---|---|---|---|---|
| 1 | Domain separation linter | `node ../../scripts/verify-domain-separation.mjs` | `main/web` | **PASS** |
| 2 | Domain separation linter (org) | `node ../scripts/verify-domain-separation.mjs` | `stflbd.org` | **PASS** |
| 3 | Web type-check | `npm run type-check` | `main/web` | NOT RUN in this operation |
| 4 | Web lint | `npm run lint` | `main/web` | NOT RUN in this operation |
| 5 | Web build | `npm run build` | `main/web` | NOT RUN in this operation |
| 6 | Org type-check | `npm run type-check` | `stflbd.org` | NOT RUN in this operation |
| 7 | Org build | `npm run build` | `stflbd.org` | NOT RUN in this operation |
| 8 | API typecheck | `npm run typecheck` | `main/api` | NOT RUN in this operation |
| 9 | API tests | `npm run test` | `main/api` | NOT RUN in this operation |
| 10 | API dry-run deploy | `npm run build` | `main/api` | NOT RUN in this operation |
| 11 | Android build | `.\gradlew.bat :app:assembleDebug` | `main` | NOT RUN in this operation |
| 12 | Live domain smoke | `.\scripts\verify-live-domains.ps1` | root | **PASS** — 79 checks, 0 failures |

> Checks 3–11 were **not run** because this operation changed **no production file**. Running them would validate an unchanged tree. They remain the gate for any future production change. Check 12 **was** run and passed.

---

## 7. What this operation changed

| Category | Count | Detail |
|---|---|---|
| Production files modified | **0** | — |
| Production files moved | **0** | — |
| Production files deleted | **0** | — |
| Production references changed | **0** | — |
| Files added | 100+ | Portfolio, Brand Center, project workspaces, registries |
| Files copied (non-destructive) | 50 | 36 brand assets + 14 document templates |
| Directories created | 46 + 13 workspaces | — |

---

## 8. Blocked operations

| Operation | Status | Blocker |
|---|---|---|
| Move `main/` → `stfl-main/` | **BLOCKED** | Breaks `main/web/package.json` `../../scripts` path; invalidates canonical source map; live git working tree with uncommitted work |
| Move `stflbd.org/` → `stfl-main/stflbd.org/` | **BLOCKED** | Breaks `stflbd.org/package.json` `../scripts` path; invalidates Worker config paths |
| Move `scripts/` | **BLOCKED** | Referenced by both web builds |
| Relocate production assets | **BLOCKED** | Every canonical asset is referenced by production code |
| Consolidate `web/` and `apk/` into `_old/` | **DEFERRED** | Safe, but no benefit and it would obscure the legacy-mirror record |

---

## 9. Unresolved risks

| # | Risk | Severity | Detail |
|---|---|---|---|
| 1 | `main/` has 112 status entries (25 modified, 61 deleted, 26 untracked) | MEDIUM | Pre-existing. Not caused by this operation. A lost working tree would lose real work. |
| 2 | `apk/` is a divergent duplicate of `main/` | LOW | Pre-existing. No remote, no deploy path. Confusing but harmless. |
| 3 | `web/` is a deployable-looking legacy mirror | LOW | Mitigated by `predeploy` exit 1 and `wrangler.toml.disabled`. |
| 4 | Hyperdrive id is a placeholder in `main/api/wrangler.toml` | LOW | Correct by design — the real id is set at deploy time. |
| 5 | No CI/CD exists | MEDIUM | Every deploy is manual. No automated regression gate. |
| 6 | `STFL_VI_CANONICAL_SOURCE_MAP.md` references documents not present in this repository | LOW | `STFL_VI_CONSTITUTION.md`, `STFL_VI_PARTY_MODEL.md`, `STFL_VI_IAM_MODEL.md`, `STFL_VI_AUTHORIZATION_MODEL.md`, `STFL_VI_APPROVAL_MODEL.md`, `STFL_VI_PROJECT_MODEL.md`, `STFL_VI_FINANCE_MODEL.md`, `STFL_VI_MICROFINANCE_MODEL.md`, `STFL_VI_WORKFORCE_MODEL.md`, `STFL_VI_ECOMMERCE_MODEL.md`, `STFL_VI_DOCUMENT_MODEL.md`, `STFL_VI_PRINT_MODEL.md`, `STFL_VI_VERIFICATION_MODEL.md`, `STFL_VI_COMMUNICATION_MODEL.md`, `STFL_VI_DEVICE_SECURITY.md`, `STFL_VI_AGENT_MODEL.md`, `STFL_VI_THREAT_MODEL.md`, `STFL_VI_SECURITY_MODEL.md` are named as canonical but absent. |
| 7 | `official_doc/templates/` files are UUID-named with no recorded purpose | LOW | 14 images, 20 MB. Classified `WORKING`, not `APPROVED`. |
| 8 | `P1.pdf` (3.4 MB) is unclassified | LOW | `UNKNOWN`. Retained. |
| 9 | `_old/*.zip` archives are uninspected | LOW | `UNKNOWN`. Retained. |
| 10 | `hs_err_pid32616.log` is JVM crash debris | LOW | Build artefact. Retained. |
| 11 | **`https://stflbd.app/api/v1/*` returns 404 for every probed path** | **HIGH** | Live probe on 2026-10-18: `/api/v1/health`, `/api/v1/app/config`, `/api/v1/verify/test` all return 404 with the `stfl-web` Next.js 404 page, not the `stfl-api` JSON error envelope. The `stfl-api` Worker route (`stflbd.app/api/*`) appears not to be attached. **Pre-existing — not caused by this operation.** The live smoke test reports it as a WARN, not a FAIL. |

---

## 10. Recommendations

| # | Recommendation | Effort | Risk |
|---|---|---|---|
| 1 | Commit or stash the 112 status entries in `main/` | Low | None |
| 2 | Add a GitHub Actions workflow running the regression gate | Medium | None |
| 3 | Reconcile `STFL_VI_CANONICAL_SOURCE_MAP.md` against the files that actually exist | Low | None |
| 4 | Classify or archive `P1.pdf`, `_old/*.zip`, `official_doc/templates/*` | Low | None |
| 5 | Decide the fate of `web/` and `apk/` — archive or delete | Low | Low |
| 6 | Only after 1–5: consider the `stfl-main/` move as a separate, reviewed migration | High | High |
