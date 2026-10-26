# HAWLAT — Pricing Engine

Computes a **quote breakdown** between two participants. Party terms are agreed by the parties within product-template bounds; HAWLAT's only charge is a separate platform service fee. `[LEGAL_REVIEW_REQUIRED]` for charge caps, Shariah structuring and fee characterisation.

## Inputs
Principal, tenor (weeks), product version, reputation tier, exposure, risk band, jurisdiction ruleset, funder-set terms, configuration version.

## Output (`quotes`)
```
principal, currency, tenor_weeks, schedule[]
party_terms:  agreed charge (funder <-> recipient)
platform_fee: amount, basis, payer
total_payable_by_recipient
config_version_id, product_version_id, pricing_version, inputs_hash, reason_codes[]
```

## Rules
- Pure functions on `Decimal`; `ROUND_HALF_EVEN`; BDT scale 2; residue goes to the final instalment.
- Deterministic and replayable from stored inputs + versions.
- Bounds (৳50–৳500,000, ≤50 weeks, caps) come from versioned config/jurisdiction rules.
- Dynamic adjustments are bounded by product floor/ceiling; no hidden fees; full breakdown before acceptance.
- Quotes expire and are re-validated at agreement time.
- Tests: schedule sums equal total (property tests), no `float` anywhere.
