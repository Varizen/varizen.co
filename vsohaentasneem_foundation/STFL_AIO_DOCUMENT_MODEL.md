# STFL AIO — Governed Digital Document Engine & Cryptographic Verification

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-DOC-V2`  
**Date:** 2026-10-15  
**Attribution:** Made with love from Dhaka, Kuala Lumpur, Wyoming and Varizen Inc.

---

## 1. Document Identifier Grammar

Every official document conforms to strict cryptographic grammar:
- Certificates: `STFL-CER-2026-000002-K7M2`
- Official Letters: `STFL-LET-2026-000003-F4Q8`
- Lease Deeds: `STFL-LSE-2026-000001-X8P4`
- Financial Vouchers: `STFL-VCH-2026-000004-B2N9`
- Donation Receipts: `STFL-RCP-2026-000005-P9W1`
- Statutory Notices: `STFL-NTC-2026-000006-T3C7`

---

## 2. Document Immutability & Public Verification
- **Issued Documents Are Immutable:** Once status transitions to `ISSUED`, content and SHA-256 hash are locked permanently. Corrections create a new superseding document version.
- **Public Verification Endpoints:**
  - Full Canonical URL: `https://stflbd.app/verify/{document_id}`
  - Compact QR URL: `https://stflbd.app/v/{verification_code}`
- **Minimal Public Exposure:** Public verifier displays ONLY verification status, issuer, issue date, category, and document title. Internal audit trails, financial details, and sensitive PII are strictly protected.
