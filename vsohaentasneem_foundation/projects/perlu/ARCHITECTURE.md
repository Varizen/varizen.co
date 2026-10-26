# Architecture — Perlu

## Status of this record

This project has **no** implementation source in this repository. No architecture is asserted. Only what the registry records is reproduced here.

## Recorded implementation

- ``stflbd.org/src/app/initiatives/perlu/page.tsx``

## Platform relationship

| Layer | Relationship |
|---|---|
| Institutional | SohaelTasneem Foundation |
| Brand | `NATIVE_VERIFIED` |
| Publication | `PUBLICATION_APPROVED` |
| Domain | ``perlu.my`` |
| Canonical path | `/initiatives/perlu` |

## Shared platform components

This project is published through the STFL platform and therefore depends on:

- `stflbd.org` — Foundation website and Enterprise Workspace (Cloudflare Worker `stfl-foundation-web`)
- `stflbd.app/api/v1` — STFL API (Cloudflare Worker `stfl-api`)
- `stflbd.app/media` — R2 media bucket `stfl-media`

## Architecture documentation

- ``STFL_AIO_PROJECT_MODEL.md``

## Unresolved

| Question | State |
|---|---|
| Deployment topology | Deployed — see `portfolio/DEPLOYMENT_REGISTRY.md` |
| Data model | NOT RECORDED |
| External integrations | See [INTEGRATIONS/](./INTEGRATIONS/) |