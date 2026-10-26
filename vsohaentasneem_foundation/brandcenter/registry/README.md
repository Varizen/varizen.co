# Registry

Machine-readable asset registry.

| File | Schema | Contents |
|---|---|---|
| [`assets.json`](./assets.json) | `stfl-portfolio-assets-v1` | 50 assets, all SHA-256 verified |

## Fields

Asset ID · Name · Type · Version · Status · Owner · Approved By · Created · Updated · Usage · Restrictions · Source · Canonical Location · Variants · Related Project · SHA-256 · Bytes · Hash Verified · Production Dependent · Action

## Rules

1. No secrets, tokens or credentials
2. No invented approval data — use `NOT RECORDED`
3. Every canonical copy carries a SHA-256 hash
4. Every production-dependent asset records its production path