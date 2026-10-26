# Source — GrihostiOS

This project has implementation source in this repository.

## Where the source actually lives

The source is **not** duplicated here. It remains at its production path:

- ``main/api/src/grihosti/engine.ts``
- ``main/api/migrations/0003_grihostios.sql``
- ``stflbd.org/src/app/initiatives/grihostios/page.tsx``
- ``stflbd.org/src/app/admin/property/page.tsx``

## Why it is not copied

Copying production source into a portfolio workspace creates a second, divergent master. The canonical source map requires exactly one authoritative implementation per domain.

See [STFL_VI_CANONICAL_SOURCE_MAP.md](../../STFL_VI_CANONICAL_SOURCE_MAP.md).

## Build and verification

| Target | Command | Working directory |
|---|---|---|
| API typecheck | `npm run typecheck` | `main/api` |
| API tests | `npm run test` | `main/api` |
| Org build | `npm run build` | `stflbd.org` |