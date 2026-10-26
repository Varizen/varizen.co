# Architecture — QiM-AI 2.1

## Status of this record

This project has **no** implementation source in this repository. No architecture is asserted. Only what the registry records is reproduced here.

## Recorded implementation

- ``stflbd.org/src/app/initiatives/qimai/page.tsx``
- ``stflbd.org/public/media/qimai-logo.svg``
- ``stflbd.org/public/media/qimai-symbol.svg``

## Platform relationship

| Layer | Relationship |
|---|---|
| Institutional | SohaelTasneem Foundation |
| Brand | `NATIVE_VERIFIED` |
| Publication | `PUBLICATION_APPROVED` |
| Domain | ``qimai.codes`` |
| Canonical path | `/initiatives/qimai` |

## Shared platform components

This project is published through the STFL platform and therefore depends on:

- `stflbd.org` — Foundation website and Enterprise Workspace (Cloudflare Worker `stfl-foundation-web`)
- `stflbd.app/api/v1` — STFL API (Cloudflare Worker `stfl-api`)
- `stflbd.app/media` — R2 media bucket `stfl-media`

## Architecture documentation

- ``QIMAI_PLATFORM_SPEC.md (referenced, not present in this repository)``

## Unresolved

| Question | State |
|---|---|
| Deployment topology | NOT RECORDED |
| Data model | NOT RECORDED |
| External integrations | See [INTEGRATIONS/](./INTEGRATIONS/) |