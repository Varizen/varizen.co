# HAWLAT — Compliance Architecture

**Compliance as code:** jurisdiction rulesets (`regulatory_rules`: versioned, effective-dated) are evaluated by the Compliance service; results store the rule version. Rules are reviewed data, never ad-hoc edits.

## Boundary
HAWLAT is a technology marketplace and record-keeper. It does not lend, borrow, take deposits, pool funds, guarantee repayment or operate a wallet/payment institution. Anything approaching those needs an authorised partner and legal sign-off.

## Open questions `[LEGAL_REVIEW_REQUIRED]`
1. Is P2P matching + agreement recording a regulated activity in Bangladesh (Bangladesh Bank, MRA, BSEC, BFIU)?
2. Does the platform fee trigger brokerage/intermediary licensing?
3. Charge/interest caps; Shariah-compliant structuring.
4. Eligible recipients (consumers vs micro-entrepreneurs).
5. Data-protection, KYC retention, cross-border data.
6. Collection/recovery limits; enforceability of electronic agreements.
7. Whether the Financial Passport implies a credit-bureau function.

## Controls
- Case management (`compliance_cases`) with SLAs; four-eyes approval for gate changes.
- Versioned consents and role disclosures stored with timestamp.
- Suspicious-activity workflow handled manually by the compliance officer until an integration is approved.
- Evidence-grade audit export.
- Unknown jurisdiction ⇒ blocked.
