# STFL AIO: Org Structure and Cryptographic Signature Framework (Core v0.1)

Goal: a green, paperless organization with digital adoption at every level, from the lowest position up to the Chairperson.

## 1. Phases (from root)

| Phase | Purpose | Output |
|---|---|---|
| Principal | Mandate, policy, signing authority rules | Charter, delegation policy |
| Provisioning | Create identities, roles, keys, devices | Org tree, user keys, role bindings |
| Implementing | Run workflows and sign documents digitally | Signed records, approvals |
| Realization | Measure, audit, report, reduce paper and carbon | Audit trail, green KPIs |

## 2. Org Hierarchy

Chairperson > Board Members > Executive Director > Directors > Managers > Team Leads > Officers > Staff > Volunteers (Guest access).

Each node has: `position_id`, `parent_id`, `level` (1 = Chairperson, 9 = Volunteer), `authority_limit`, `delegate_to`.

## 3. Signature Model

- **Identity:** each member gets a key pair (Ed25519 or ECDSA P-256) bound to a verified identity and position.
- **Signing:** documents are hashed (SHA-256); the hash is signed with the member's private key. Signature record = `{doc_hash, signer_id, position_id, timestamp, algorithm, signature}`.
- **Assurance levels:** L1 simple (login + OTP), L2 advanced (device-bound key), L3 qualified (hardware token or smart card, eIDAS-style QES).
- **Thresholds by level:** staff L1, managers L2, directors and above L3. Board and Chairperson actions require L3 and quorum where applicable.
- **Chain:** each signature references the previous document version hash, giving tamper-evident history.
- **Verification:** public key directory per organization; any signature can be verified offline.

## 4. Workflow Rules

1. Originator creates the document in the digital workspace (no print).
2. Routing follows the org tree up to the required authority level.
3. Each approver signs or rejects; rejections return with comments.
4. Final signed PDF plus signature manifest is archived; retention policy applies.
5. Delegation is recorded as a signed event with an expiry date.

## 5. Green Office Metrics (Realization)

- Paper pages avoided per month
- Share of documents signed digitally (target 100%)
- Average approval time per level
- Estimated CO2 avoided (paper and transport)

## 6. Market References (from known practice; live search was unavailable)

- **DocuSign / Adobe Acrobat Sign:** envelope routing, identity levels, audit certificates.
- **Estonia (e-Residency, ID-card, X-Road):** national-grade qualified digital signatures across government.
- **EU eIDAS:** legal framework for simple, advanced, and qualified electronic signatures.
- **Singapore Sign with Singpass:** verified-identity digital signing for citizens and agencies.
- **Microsoft Entra / Azure Key Vault:** managed identities and key storage for provisioning.

## 7. Next Steps (Core)

1. Define the position table with levels and authority limits.
2. Implement key provisioning per member (L1 first, then L2/L3).
3. Build the signing service (hash, sign, verify) and signature manifest.
4. Wire routing to the org tree and add the audit log.
5. Publish green KPIs in the realization dashboard.
