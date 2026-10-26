# Implementation Status — Enterprise Workspace

**Folder:** `stflbd.org/src/app/admin/` · **Domain:** `https://stflbd.org/admin/*`

---

## State: IMPLEMENTED

| Console | Route | State |
|---|---|---|
| Overview | `/admin` | IMPLEMENTED |
| Agents | `/admin/agents` | IMPLEMENTED |
| Assets | `/admin/assets` | IMPLEMENTED |
| Communications | `/admin/communications` | IMPLEMENTED |
| Compliance | `/admin/compliance` | IMPLEMENTED |
| Devices | `/admin/devices` | IMPLEMENTED |
| Documents | `/admin/documents` | IMPLEMENTED |
| E-Shop | `/admin/eshop` | IMPLEMENTED |
| Executive | `/admin/executive` | IMPLEMENTED |
| Finance | `/admin/finance` | IMPLEMENTED |
| Governance | `/admin/governance` | IMPLEMENTED |
| IAM | `/admin/iam` | IMPLEMENTED |
| Knowledge | `/admin/knowledge` | IMPLEMENTED |
| Microfinance | `/admin/microfinance` | IMPLEMENTED |
| Projects | `/admin/projects` | IMPLEMENTED |
| Property | `/admin/property` | IMPLEMENTED |
| Security | `/admin/security` | IMPLEMENTED |
| System | `/admin/system` | IMPLEMENTED |
| Workforce | `/admin/workforce` | IMPLEMENTED |

## Constitutional constraints

| Constraint | Source |
|---|---|
| Desktop/PC first (mandatory), tablet supported | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` §1 |
| `noindex` | `STFL_DOMAIN_SEPARATION_ARCHITECTURE.md` §3 |
| Must not appear on `stflbd.app` | Enforced by `verify-domain-separation.mjs` |
| CORS to `stflbd.app/api/v1` | `main/api/wrangler.toml` `ALLOWED_ORIGINS` |