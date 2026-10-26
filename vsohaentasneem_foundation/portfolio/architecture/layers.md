# Portfolio Architecture — Layers

Seven layers, one authority each.

| # | Layer | Authority | Location |
|---|---|---|---|
| 1 | Institutional | The Foundation | `portfolio/PORTFOLIO_MASTER.md` |
| 2 | Brand & Governance | Brand Center | `brandcenter/` |
| 3 | Product / Application | Each deployable folder | `stflbd.org/`, `main/web/`, `main/api/`, `main/` |
| 4 | Project / Initiative | Project workspaces | `projects/` |
| 5 | Portfolio | Registries | `portfolio/` |
| 6 | Documentation | Distributed by domain | `docs/`, `md-s/`, `main/docs/`, `stflbd.org/docs/` |
| 7 | Infrastructure | Cloudflare + Play Console | Read-only from the portfolio |

Full description: [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md).