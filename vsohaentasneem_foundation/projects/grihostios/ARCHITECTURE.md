# Architecture — GrihostiOS

## Status of this record

This project has implementation source in this repository. The architecture below is derived from that source.

## Recorded implementation

- ``main/api/src/grihosti/engine.ts``
- ``main/api/migrations/0003_grihostios.sql``
- ``stflbd.org/src/app/initiatives/grihostios/page.tsx``
- ``stflbd.org/src/app/admin/property/page.tsx``

## Platform relationship

| Layer | Relationship |
|---|---|
| Institutional | SohaelTasneem Foundation |
| Brand | `NATIVE_VERIFIED` |
| Publication | `PUBLICATION_APPROVED` |
| Domain | ``grihostios.stflbd.app`` |
| Canonical path | `/initiatives/grihostios` |

## Shared platform components

This project is published through the STFL platform and therefore depends on:

- `stflbd.org` — Foundation website and Enterprise Workspace (Cloudflare Worker `stfl-foundation-web`)
- `stflbd.app/api/v1` — STFL API (Cloudflare Worker `stfl-api`)
- `stflbd.app/media` — R2 media bucket `stfl-media`

## Architecture documentation

- ``STFL_WEB_GRIHOSTIOS_MODEL.md``
- ``STFL_AIO_PROPERTY_MODEL.md``

## Unresolved

| Question | State |
|---|---|
| Deployment topology | Deployed — see `portfolio/DEPLOYMENT_REGISTRY.md` |
| Data model | See `main/api/migrations/` |
| External integrations | See [INTEGRATIONS/](./INTEGRATIONS/) |