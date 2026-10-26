# STFL Portfolio

The portfolio layer answers one question:

> **What does STFL currently own, operate, build, maintain, archive, or plan?**

It answers it without requiring anyone to inspect the whole repository.

---

## Contents

| Document | Purpose |
|---|---|
| [`PORTFOLIO_MASTER.md`](./PORTFOLIO_MASTER.md) | The whole estate on one page |
| [`PROJECT_REGISTRY.md`](./PROJECT_REGISTRY.md) | Every initiative, with lifecycle state |
| [`BRAND_REGISTRY.md`](./BRAND_REGISTRY.md) | Canonical brand assets |
| [`DOMAIN_REGISTRY.md`](./DOMAIN_REGISTRY.md) | Every domain and its owner |
| [`DEPLOYMENT_REGISTRY.md`](./DEPLOYMENT_REGISTRY.md) | What is deployed where |
| [`TECHNOLOGY_REGISTRY.md`](./TECHNOLOGY_REGISTRY.md) | Stacks, runtimes, data stores |
| [`DEPENDENCY_MAP.md`](./DEPENDENCY_MAP.md) | What depends on what |
| [`IMPLEMENTATION_REGISTER.md`](./IMPLEMENTATION_REGISTER.md) | What is actually built |
| [`STATUS_MATRIX.md`](./STATUS_MATRIX.md) | Live / not live, at a glance |
| [`ROADMAP.md`](./ROADMAP.md) | What comes next |
| [`architecture/`](./architecture/) | Architecture records |

## Machine-readable registries

| File | Schema |
|---|---|
| [`registry/projects.json`](./registry/projects.json) | `stfl-portfolio-projects-v1` |
| [`registry/assets.json`](./registry/assets.json) | `stfl-portfolio-assets-v1` |
| [`registry/domains.json`](./registry/domains.json) | `stfl-portfolio-domains-v1` |
| [`registry/deployments.json`](./registry/deployments.json) | `stfl-portfolio-deployments-v1` |
| [`registry/technologies.json`](./registry/technologies.json) | `stfl-portfolio-technologies-v1` |

## Control records

| File | Purpose |
|---|---|
| [`.control/pre-reorganization-baseline.json`](./.control/pre-reorganization-baseline.json) | Frozen state before any portfolio work |
| [`.control/production-dependency-map.json`](./.control/production-dependency-map.json) | Every production path and its dependents |

## Sub-indexes

| Directory | Purpose |
|---|---|
| [`portfolio-registry/`](./portfolio-registry/) | Human-readable registry snapshots |
| [`project-index/`](./project-index/) | Per-project index cards |
| [`dependency-map/`](./dependency-map/) | Dependency detail by deployable |
| [`implementation-status/`](./implementation-status/) | Implementation state by area |

---

## Rules

1. **Registries describe; they never deploy.**
2. **No secrets.** No tokens, keys, connection strings or credentials in any registry.
3. **No invented facts.** Unknown values are `UNKNOWN` or `NOT RECORDED`.
4. **One row per entity.** Duplicates are merged, not appended.
5. **Update in the same change.** A change that alters a project's state updates its registry row.
