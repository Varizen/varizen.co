# stfl-main — Canonical Production Source (Pointer)

**This directory does not contain a copy of the production source.**

It is the canonical *entry point* to the STFL production source tree, which physically remains at [`../main/`](../main/README.md).

---

## Why this is a pointer

The reorganization specification asks for `STFL/stfl-main/` to be the primary production source. Moving `main/` into it was evaluated and **rejected** for three concrete, verifiable reasons:

| # | Blocker | Evidence |
|---|---|---|
| 1 | **Build-time relative path breaks** | `main/web/package.json` → `"verify:domains": "node ../../scripts/verify-domain-separation.mjs"`. From `main/web` this resolves to `<root>/scripts/`. Moving `main/` one level deeper resolves to `<root>/stfl-main/scripts/` — which does not exist. `npm run build` runs `verify` first, so the production build would fail. |
| 2 | **Live git working tree with uncommitted work** | `main/` is a git repository at `Varizen/stfl-vi`, branch `stfl/pre-playstore-2026`, commit `b7f9939`, with 112 status entries (25 modified, 61 deleted, 26 untracked). A filesystem move would relocate the `.git` directory and invalidate every recorded path in the canonical source map. |
| 3 | **Canonical documentation would become wrong** | `STFL_VI_CANONICAL_SOURCE_MAP.md` names `main/api/src/...`, `main/web/src/...`, `main/core/...` as implementation sources for 30+ governed domains. Moving the tree silently falsifies all of them. |

The specification's own rule applies:

> *"If the physical `stfl-main` move would threaten production, preserve the current production source location and create a controlled canonical workspace instead. Do NOT force a filesystem move simply because the desired diagram shows one. Production integrity has priority over aesthetic folder structure."*

---

## Canonical source map

| Deployable | Physical path | Worker | Domain |
|---|---|---|---|
| Foundation website + Enterprise Workspace | [`../stflbd.org/`](../stflbd.org/) | `stfl-foundation-web` | `https://stflbd.org` |
| App landing | [`../main/web/`](../main/web/) | `stfl-web` | `https://stflbd.app` |
| API backend | [`../main/api/`](../main/api/) | `stfl-api` | `https://stflbd.app/api/v1` |
| Android application | [`../main/`](../main/README.md) | — | `foundation.sohaeltasneem.app` |

### Android module layout (`../main/`)

| Module | Purpose |
|---|---|
| `app` | Application shell, navigation, vertical slice |
| `core` | Design system, brand, security primitives |
| `domain` | Models and contracts |
| `data` | Repository implementations, DI |
| `network` | API client |
| `database` | Room cache |
| `security` | Encrypted storage, screen protection |
| `notifications` | Firebase integration |
| `ui` | Screens |
| `devmockserver` | Development-only mock backend (never shipped) |

---

## Repository facts

| Field | Value |
|---|---|
| Remote | `https://github.com/Varizen/stfl-vi.git` |
| Branch | `stfl/pre-playstore-2026` |
| Commit | `b7f9939` — *refactor(web): remove retired initiatives from active portfolio* |
| Submodules | none |
| Worktrees | none |

---

## If the move is ever performed

It is possible, but it is a **production migration**, not a portfolio tidy-up. It requires, in order:

1. Freeze and commit or stash all work in `main/`
2. Move `main/` → `stfl-main/`
3. Update `main/web/package.json` `verify:domains` to `node ../../scripts/...` → `node ../../../scripts/...`
4. Update `stflbd.org/package.json` `verify:domains` if `stflbd.org/` also moves
5. Rewrite every path in `STFL_VI_CANONICAL_SOURCE_MAP.md`
6. Rewrite every path in `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md`
7. Re-run the full regression gate
8. Re-verify live domains

Until all eight are done, the move stays blocked. See [`../portfolio/IMPLEMENTATION_REGISTER.md`](../portfolio/IMPLEMENTATION_REGISTER.md).
