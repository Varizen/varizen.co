# STFL — Centralized Portfolio

**SohaelTasneem Foundation (সোহেল তাসনীম ফাউন্ডেশন)**

This directory is the **STFL central portfolio**: one place that answers *"what does STFL own, operate, build, maintain, archive, or plan?"* without requiring anyone to read the whole filesystem.

It is a **repository organization and portfolio-management layer**. It is **not** a production migration. Every production path, domain, Worker, binding, secret and signing key is unchanged.

---

## Structure

```
STFL/
├── stfl-main/      Canonical pointer to the production source (see note below)
├── brandcenter/    Brand identity, governance and reusable creative assets
├── projects/       One workspace per initiative / project
├── portfolio/      Registries, dependency map, status matrix, architecture
├── docs/           Cross-cutting documentation index
├── tools/          Portfolio tooling and validation helpers
└── README.md       This file
```

| Directory | Purpose | Authority |
|---|---|---|
| [`stfl-main/`](./stfl-main/README.md) | Canonical entry point to the production source tree | Points at `main/` — **does not contain a copy** |
| [`brandcenter/`](./brandcenter/README.md) | Single authority for STFL identity, brand governance and reusable assets | Governs brand; never overrides production code |
| [`projects/`](./projects/PROJECT_REGISTRY.md) | Portfolio workspace per initiative, with lifecycle status | Governs project records |
| [`portfolio/`](./portfolio/README.md) | Machine-readable and human-readable registries | Governs visibility and lifecycle |
| [`docs/`](./docs/README.md) | Index of cross-cutting documentation | Documentation only |
| [`tools/`](./tools/README.md) | Validation and portfolio maintenance scripts | Tooling only |

---

## Production source locations (unchanged)

| Deployable | Folder | Cloudflare Worker | Domain |
|---|---|---|---|
| Foundation website + Enterprise Workspace | `stflbd.org/` | `stfl-foundation-web` | `https://stflbd.org` |
| App landing site | `main/web/` | `stfl-web` | `https://stflbd.app` |
| API backend | `main/api/` | `stfl-api` | `https://stflbd.app/api/v1` |
| Android application | `main/` | — | `foundation.sohaeltasneem.app` |

> **Why `stfl-main/` is a pointer and not a folder move.**
> `main/` is a live git repository (`Varizen/stfl-vi`, branch `stfl/pre-playstore-2026`) with a working tree containing uncommitted work. `main/web/package.json` resolves `../../scripts/verify-domain-separation.mjs`, and `stflbd.org/package.json` resolves `../scripts/verify-domain-separation.mjs`. Moving either tree one level deeper breaks those build-time paths and invalidates every documented path in `STFL_VI_CANONICAL_SOURCE_MAP.md`.
> Per the operating rule *"production integrity has priority over aesthetic folder structure"*, the physical move was **not** performed. `stfl-main/` is a controlled canonical workspace that documents and links to the real source.

---

## Reading order

1. [`ARCHITECTURE.md`](./ARCHITECTURE.md) — the seven layers of the STFL estate
2. [`OPERATING_MODEL.md`](./OPERATING_MODEL.md) — how a new project is added
3. [`portfolio/PORTFOLIO_MASTER.md`](./portfolio/PORTFOLIO_MASTER.md) — the whole estate on one page
4. [`portfolio/STATUS_MATRIX.md`](./portfolio/STATUS_MATRIX.md) — what is live, what is not
5. [`brandcenter/BRANDCENTER_MASTER.md`](./brandcenter/BRANDCENTER_MASTER.md) — brand authority

---

## Non-negotiable invariants

These values are **permanent contracts**. No portfolio operation may change them.

| Invariant | Value |
|---|---|
| Foundation domain | `https://stflbd.org` |
| App domain | `https://stflbd.app` |
| API base | `https://stflbd.app/api/v1` |
| Android `FOUNDATION_URL` | `https://stflbd.org` |
| Android `APP_URL` | `https://stflbd.app` |
| Android `API_BASE_URL` | `https://stflbd.app/api/v1` |
| Android `applicationId` | `foundation.sohaeltasneem.app` |
| Worker names | `stfl-foundation-web`, `stfl-web`, `stfl-api` |
| `CONFIG_KV` id | `a2f247fbc4914040adc3c78befb6bb7a` |
| R2 media bucket | `stfl-media` |
| Hyperdrive binding | `HYPERDRIVE` |

See [`portfolio/DOMAIN_REGISTRY.md`](./portfolio/DOMAIN_REGISTRY.md) and [`portfolio/DEPLOYMENT_REGISTRY.md`](./portfolio/DEPLOYMENT_REGISTRY.md).

---

## Baseline and control records

| Record | Location |
|---|---|
| Pre-reorganization baseline | [`portfolio/.control/pre-reorganization-baseline.json`](./portfolio/.control/pre-reorganization-baseline.json) |
| Production dependency map | [`portfolio/.control/production-dependency-map.json`](./portfolio/.control/production-dependency-map.json) |
| Asset copy manifest (SHA-256) | [`brandcenter/registry/assets.json`](./brandcenter/registry/assets.json) |

---

## Status

**PORTFOLIO REORGANIZATION: PARTIAL — PRODUCTION PRESERVED**

The portfolio, brand center, project workspaces and registries are complete. The physical `main/` → `stfl-main/` move was deliberately **not** performed because it would break build-time relative paths and invalidate the canonical source map. See [`portfolio/IMPLEMENTATION_REGISTER.md`](./portfolio/IMPLEMENTATION_REGISTER.md) for the full record.
