# Implementation Status — API

**Folder:** `main/api/` · **Worker:** `stfl-api` · **Domain:** `https://stflbd.app/api/v1`

---

## State: IMPLEMENTED

| Area | Evidence |
|---|---|
| Router | `main/api/src/app.ts` |
| Authorization engine | `main/api/src/authorization/` |
| Approval engine | `main/api/src/approval/engine.ts` |
| Document engine | `main/api/src/documents/engine.ts` |
| Print engine | `main/api/src/print/` |
| Communications gateway | `main/api/src/comms/engine.ts` |
| GrihostiOS engine | `main/api/src/grihosti/engine.ts` |
| Agent runtime | `main/api/src/agents/` |
| Migrations | `0001`, `0002_aio_parties_iam`, `0003_grihostios` |
| Tests | `main/api/test/` (Vitest) |

## Verification

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run typecheck` | NOT RUN |
| Tests | `npm run test` | NOT RUN |
| Dry-run deploy | `npm run build` | NOT RUN |