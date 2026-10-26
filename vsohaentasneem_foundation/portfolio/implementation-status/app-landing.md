# Implementation Status — App Landing

**Folder:** `main/web/` · **Worker:** `stfl-web` · **Domain:** `https://stflbd.app`

---

## State: IMPLEMENTED

| Route | State |
|---|---|
| `/` (AppLandingPage) | IMPLEMENTED |
| `/download` | IMPLEMENTED |
| `/demo` + 8 demo sub-routes | IMPLEMENTED |
| `/roadmap` | IMPLEMENTED |
| `/privacy`, `/terms`, `/safeguarding`, `/cookies`, `/account-deletion` | IMPLEMENTED |
| `/v/[code]`, `/verify`, `/verify/[documentId]` | IMPLEMENTED |

## Permanent contracts

| Pattern | Why permanent |
|---|---|
| `/v/{code}` | Printed on physical documents |
| `/verify/{id}` | Printed on physical documents |
| `/privacy`, `/terms`, `/safeguarding`, `/account-deletion` | Play Store listing URLs |

## Outstanding

| Item | Evidence |
|---|---|
| Foundation and admin routes still present | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F2 |

## Verification

| Check | Command | Result |
|---|---|---|
| Domain separation linter | `node ../../scripts/verify-domain-separation.mjs` | PASS |
| Type-check | `npm run type-check` | NOT RUN |
| Lint | `npm run lint` | NOT RUN |
| Build | `npm run build` | NOT RUN |