# STFL Documentation Index

Cross-cutting documentation. Domain-specific documentation lives with its domain.

---

## 1. Canonical governance documents (root)

| Document | Governs |
|---|---|
| [`STFL_DOMAIN_SEPARATION_ARCHITECTURE.md`](../STFL_DOMAIN_SEPARATION_ARCHITECTURE.md) | Domain split — CONSTITUTIONAL |
| [`STFL_DOMAIN_SEPARATION_EXECUTION_PROMPT.md`](../STFL_DOMAIN_SEPARATION_EXECUTION_PROMPT.md) | Execution prompt for the above |
| [`STFL_VI_CANONICAL_SOURCE_MAP.md`](../STFL_VI_CANONICAL_SOURCE_MAP.md) | One authoritative document per domain |
| [`STFL_VI_MASTER_CONTROL.md`](../STFL_VI_MASTER_CONTROL.md) | Master architecture |
| [`STFL_VI_BRAND_GUIDELINES.md`](../STFL_VI_BRAND_GUIDELINES.md) | Brand hierarchy and palette |
| [`STFL_VI_TYPOGRAPHY_SYSTEM.md`](../STFL_VI_TYPOGRAPHY_SYSTEM.md) | Typography matrix |
| [`STFL_VI_SECURITY_AUDIT.md`](../STFL_VI_SECURITY_AUDIT.md) | Security audit |
| [`STFL_VI_SECRET_LOCATION_REGISTER.md`](../STFL_VI_SECRET_LOCATION_REGISTER.md) | Where secrets live (not the secrets) |
| [`STFL_VI_GO_LIVE_READINESS.md`](../STFL_VI_GO_LIVE_READINESS.md) | Go-live gate |
| [`STFL_VI_ROADMAP.md`](../STFL_VI_ROADMAP.md) | Roadmap |
| [`STFL_VI_IMPLEMENTATION_REGISTER.md`](../STFL_VI_IMPLEMENTATION_REGISTER.md) | Implementation state |
| [`STFL_VI_CHANGELOG.md`](../STFL_VI_CHANGELOG.md) | Change history |
| [`STFL_PROJECT_REGISTRY.json`](../STFL_PROJECT_REGISTRY.json) | Project registry (source of truth) |
| [`STFL_ECOSYSTEM_ASSET_REGISTER.json`](../STFL_ECOSYSTEM_ASSET_REGISTER.json) | Asset register (source of truth) |

---

## 2. Portfolio layer

| Document | Purpose |
|---|---|
| [`../README.md`](../README.md) | Portfolio entry point |
| [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | Seven-layer architecture |
| [`../OPERATING_MODEL.md`](../OPERATING_MODEL.md) | How the portfolio is operated |
| [`../portfolio/PORTFOLIO_MASTER.md`](../portfolio/PORTFOLIO_MASTER.md) | The estate on one page |
| [`../portfolio/PROJECT_REGISTRY.md`](../portfolio/PROJECT_REGISTRY.md) | Every initiative |
| [`../portfolio/BRAND_REGISTRY.md`](../portfolio/BRAND_REGISTRY.md) | Canonical brand assets |
| [`../portfolio/DOMAIN_REGISTRY.md`](../portfolio/DOMAIN_REGISTRY.md) | Every domain |
| [`../portfolio/DEPLOYMENT_REGISTRY.md`](../portfolio/DEPLOYMENT_REGISTRY.md) | What is deployed where |
| [`../portfolio/TECHNOLOGY_REGISTRY.md`](../portfolio/TECHNOLOGY_REGISTRY.md) | Stacks and runtimes |
| [`../portfolio/DEPENDENCY_MAP.md`](../portfolio/DEPENDENCY_MAP.md) | What depends on what |
| [`../portfolio/IMPLEMENTATION_REGISTER.md`](../portfolio/IMPLEMENTATION_REGISTER.md) | What is built |
| [`../portfolio/STATUS_MATRIX.md`](../portfolio/STATUS_MATRIX.md) | Live / not live |
| [`../portfolio/ROADMAP.md`](../portfolio/ROADMAP.md) | What comes next |

---

## 3. Brand Center

| Document | Purpose |
|---|---|
| [`../brandcenter/README.md`](../brandcenter/README.md) | Brand Center entry point |
| [`../brandcenter/BRANDCENTER_MASTER.md`](../brandcenter/BRANDCENTER_MASTER.md) | Master brand index |
| [`../brandcenter/BRAND_GOVERNANCE_INDEX.md`](../brandcenter/BRAND_GOVERNANCE_INDEX.md) | Governance document index |
| [`../brandcenter/governance/`](../brandcenter/governance/) | The ten governance documents |

---

## 4. Domain documentation

| Location | Content | Count |
|---|---|---|
| [`../md-s/`](../md-s/) | AIO / VI specification documents | 78 |
| [`../main/docs/`](../main/docs/) | Android, API, database, release, security | 11 |
| [`../stflbd.org/docs/`](../stflbd.org/docs/) | Ecosystem, brand, project, web architecture | 44 |
| [`../main/web/docs/`](../main/web/docs/) | App landing documentation | — |
| [`../main/api/docs/`](../main/api/docs/) | API deployment | — |

---

## 5. Agent rules

| Document | Location |
|---|---|
| Domain rule for all agents | [`../stflbd.org/DOMAIN_RULE_FOR_ALL_AGENTS.md`](../stflbd.org/DOMAIN_RULE_FOR_ALL_AGENTS.md) |
| Domain rule for all agents | [`../main/web/DOMAIN_RULE_FOR_ALL_AGENTS.md`](../main/web/DOMAIN_RULE_FOR_ALL_AGENTS.md) |
| Icon rule for all agents | [`../stflbd.org/ICON_RULE_FOR_ALL_AGENTS.md`](../stflbd.org/ICON_RULE_FOR_ALL_AGENTS.md) |
| Icon rule for all agents | [`../main/web/ICON_RULE_FOR_ALL_AGENTS.md`](../main/web/ICON_RULE_FOR_ALL_AGENTS.md) |

---

## 6. Documentation rules

1. **One authoritative document per domain.** No competing masters.
2. **Documentation never overrides production.** If a doc and the code disagree, the code is the fact and the doc is a defect.
3. **Paths in documentation are load-bearing.** Moving a folder falsifies every path that names it.
4. **No secrets in documentation.** Record where a secret lives, never its value.