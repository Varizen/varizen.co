# Implementation Status — Foundation Website

**Folder:** `stflbd.org/` · **Worker:** `stfl-foundation-web` · **Domain:** `https://stflbd.org`

---

## State: IMPLEMENTED

| Route group | Routes | State |
|---|---|---|
| Public foundation | `/`, `/about`, `/mission`, `/programs`, `/impact`, `/news`, `/events`, `/gallery`, `/publications`, `/reports`, `/team`, `/careers`, `/contact`, `/faq`, `/donate`, `/volunteer`, `/partner` | IMPLEMENTED |
| Initiatives | `/initiatives`, `/initiatives/[projectSlug]`, 10 explicit project pages | IMPLEMENTED |
| Brand | `/brand`, `/brandcenter` | IMPLEMENTED |
| Auth | `/login`, `/signup` | IMPLEMENTED |
| Legal | `/privacy`, `/terms`, `/safeguarding`, `/cookies` | IMPLEMENTED |

## Outstanding

| Item | Evidence |
|---|---|
| DNS must resolve on Cloudflare | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F1 |
| ~45 files still declare `.app` canonical URLs | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` F4 |

## Verification

| Check | Command | Result |
|---|---|---|
| Domain separation linter | `node ../scripts/verify-domain-separation.mjs` | PASS |
| Type-check | `npm run type-check` | NOT RUN |
| Build | `npm run build` | NOT RUN |