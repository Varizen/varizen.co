# STFL Web GrihostiOS Property & Agriculture Operating Model
**Product Name:** GrihostiOS (গৃহস্থিওএস)  
**Parent Platform:** STFL VI (Historical Architecture Name: STFL AIO) — SohaelTasneem Foundation Unified Institutional Operating Platform  
**Management Console:** `/admin/property`  
**Version:** 2026.10.15  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Operating Philosophy & Mental Model

GrihostiOS is the institutional operating system for managing:
- Real Estate & Urban Units (Residential, Commercial, Office, Mixed-Use).
- Semi-Built & Greenfield Structures (Construction, Fit-out, Service Charges).
- Land & Agricultural Parcels (Highland to Lowland flood classifications).
- Rural Enterprise & Crop Seasons (Paddy/Rice Barga, Adhi, Revenue-Share).
- Governed Agreements & Cryptographic Rent Receipts.

### Core User Mental Model:
```
SELECT (Template & Property Scope)
  ↓
FILL (Variable Facts & Contracting Parties)
  ↓
CHECK (Compliance Engine & Conflict Audit)
  ↓
SIGN (Authorized Signatures & Handover)
  ↓
RECEIVE (Immutable Cryptographic Receipt / Document)
```

---

## 2. Agreement Template Experience (Tablist Architecture)

The agreement creation interface in GrihostiOS follows the interaction philosophy of the STFL Tablist standard:
- **Horizontal Segment Tabs:** Compact, horizontally scrollable tabs for rapid switching between tenancy classes:
  1. Residential Tenancy
  2. Commercial Lease
  3. Residential Sublease
  4. Land-Only Lease
  5. Agricultural Crop-Share (Barga/Adhi)
  6. Semi-Built Structure & Fit-out
  7. Land + Infrastructure Development
  8. Long-Term Joint Project
- **One Focused Template Card:** Eliminates bloated multi-page forms; surfaces only active clauses and required variables.
- **Structured Information Chips:** Instant status badges for Jurisdiction, Tax Status, Governing Law, and Notice Periods.
- **Governed / Locked Clauses:** Statutory clauses cannot be silently overwritten by users. Special conditions prompt an explicit `LEGAL REVIEW REQUIRED` warning.

---

## 3. Bangladesh Land & Agricultural Productivity Classifications

GrihostiOS strictly distinguishes **legal land classification** from **agricultural productivity classification**:

### Agricultural Floodplain / Productivity Classes:
1. **High Land (উঁচু জমি):** Flood-free during monsoon; suitable for year-round homestead crops, vegetables, and fruit orchards.
2. **Medium High Land (মাঝারি উঁচু জমি):** Inundated up to 90 cm during peak monsoon; optimal for Aus and transplanted Aman paddy.
3. **Medium Low Land (মাঝারি নিচু জমি):** Inundated between 90 cm – 180 cm; suitable for deep-water Aman and Boro cultivation.
4. **Low Land (নিচু জমি):** Inundated between 180 cm – 300 cm; dry season Boro rice and seasonal fish culture.
5. **Very Low Land (অতি নিচু জমি / বিল ও হাওর):** Waterlogged for more than 9 months; dry season single-crop Boro and aquaculture.

### Rural Revenue-Share & Crop Models:
- **Fixed Cash Rent (নির্দিষ্ট নগদ খাজনা):** Fixed monetary sum per bigha/acre per annum or season.
- **Crop Share (বর্গা / আধি / তিন ভাগ):** Statutory distribution of harvested produce (e.g., Landowner 1/3, Farmer/Labor 1/3, Input/Fertilizer 1/3).
- **Revenue Share (মোট আয়ের অংশ):** Percentage share of gross market auction receipts.
- **Minimum Guarantee + Share:** Guaranteed baseline floor plus upside percentage.

---

## 4. Rent, Payment & Cryptographic Receipt Lifecycle

```
RENT DUE
  ↓
PAYMENT (bKash, Nagad, Bank Wire, Cash, Cheque)
  ↓
RECONCILIATION (Accountant & Field Officer Match)
  ↓
SIGNED RECEIPT (STFL-RCP-YYYY-XXXXX)
  ↓
DOWNLOAD & ARCHIVE (PDF with QR & Hash Seal)
  ↓
PUBLIC VERIFICATION (/v/[code] or /verify/[documentId])
```

### Immutable Financial Rules:
1. **Never Mix Deposits with Revenue:** Security deposits are held as balance sheet liabilities, not recognized as operational income.
2. **Immutability:** Once issued, an STFL receipt cannot be modified. Any billing adjustment generates an audited revision (`v2.0`) referencing the original document ID.
3. **Minimal Safe Verification:** Public verification confirms only: Receipt ID, Date, Amount (if authorized), Status (`RECONCILED`), and Issuer. Private tenant NIDs or contact phone numbers are never exposed.
