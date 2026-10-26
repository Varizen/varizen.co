# Brand Governance

**Authority:** CONSTITUTIONAL — binding for all humans and AI agents.
**Version:** 1.0 · 2026-10-18

---

## 1. Authority chain

```
SohaelTasneem Foundation
        │
        ▼
Brand Center (this directory)  ── governs identity
        │
        ├──▶ stflbd.org        (Foundation site + Enterprise Workspace)
        ├──▶ main/web          (App landing)
        ├──▶ main/api          (API)
        └──▶ main              (Android app)
```

The Brand Center governs identity. It does **not** govern executable software. Production folders govern their own implementation.

---

## 2. The five rules

1. **One brand.** There is one STFL identity. No project may silently redefine it.
2. **One authority.** The Brand Center is the single source for brand assets and rules.
3. **Production is sacred.** A brand asset referenced by production code is never moved.
4. **Nothing is invented.** Unknown approval data is recorded as `NOT RECORDED`.
5. **Nothing is deleted.** Deprecated assets move to `archive/`, they do not disappear.

---

## 3. What the Brand Center governs

| Governed | Not governed |
|---|---|
| Official naming | Application architecture |
| Institutional naming | API contracts |
| Project naming | Database schema |
| Logo usage and variants | Deployment configuration |
| Colour systems | Infrastructure |
| Typography | Build tooling |
| Iconography | Production asset paths |
| Photography and illustration | — |
| Digital and print identity | — |
| Accessibility | — |
| Localization | — |
| Co-branding and partnership branding | — |
| Campaign branding | — |
| Approval rules | — |
| Asset lifecycle | — |
| Deprecated assets | — |
| Archive policy | — |

---

## 4. Prohibited uses

| Prohibited | Why |
|---|---|
| Recolouring the STFL mark | Breaks institutional recognition |
| Rotating, skewing or outlining the mark | Breaks form integrity |
| Placing the mark on a low-contrast background | Fails accessibility |
| Using a project logo as the STFL logo | Conflates two identities |
| Implying STFL ownership of Varizen Inc. | Violates strict separation |
| Using a non-Iconoir interface icon | Violates the iconography policy |
| Substituting a font for Hind Siliguri in BN headings | Violates the typography system |
| Publishing an unapproved asset | Violates the approval workflow |
| Moving a production asset | Breaks production |

---

## 5. Co-branding

| Situation | Rule |
|---|---|
| STFL + partner | STFL mark first, equal visual weight, a divider between marks |
| STFL + project | Project logo subordinate to STFL mark |
| STFL + external entity | Written agreement required; never implies ownership |
| Varizen Inc. | **Never** co-branded as an STFL entity |

---

## 6. Escalation

If a brand question is not answered by a governance document:

1. Do not improvise
2. Record the question in the affected project's `DOCS/`
3. Escalate to the Brand Center owner
4. Update the governance document **before** applying the answer

---

## 7. Related

- [`naming.md`](./naming.md)
- [`logo-governance.md`](./logo-governance.md)
- [`approval-workflow.md`](./approval-workflow.md)
- [`../BRAND_GOVERNANCE_INDEX.md`](../BRAND_GOVERNANCE_INDEX.md)