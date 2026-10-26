# STFL AIO — Property, Land & Waqf Regulatory Compliance Model
**Document Identity:** `STFL-DOC-2026-CMP-PROP-V1`  
**Phase:** Prompt 12.5 Extension (Compliance, Regulatory & Legal Intelligence Layer)  
**Status:** SPECIFICATION ONLY — RATIFIED (READ-ONLY ARCHITECTURE PHASE)  
**Security Classification:** INTERNAL ENTERPRISE SPECIFICATION  
**Authoritative Precedent:** Extends `STFL_AIO_COMPLIANCE_ARCHITECTURE.md` (Waqf Ordinance 1962, Rent Control Act 1991)

---

## 1. Domain Scope: Real Estate, Waqf Tenures & Statutory Zoning

The **Property & Land Compliance Subsystem** governs all real estate, endowed Waqf estates, commercial lease contracts, tenant occupancies, and agricultural land holdings operated across STFL Core and its multi-project ecosystem.

It enforces the statutory covenants of:
- **Waqf Ordinance 1962 (East Pakistan Ordinance I of 1962)** & Islamic Jurisprudence governing inalienable endowments.
- **Transfer of Property Act 1882 (Act IV of 1882)** (Sections 105–117 governing leases).
- **Premises Rent Control Act 1991 (Act III of 1991)** (advance rent caps, eviction safeguards, standard rent calculations).
- **State Acquisition and Tenancy Act 1950 (E.B. Act XXVIII of 1951)** (mutation, Khatian record-of-rights, land revenue).
- **Natural Water Reservoir Conservation Act 2000** (prohibition on agricultural/wetland conversion).
- **RAJUK Detailed Area Plan (DAP) & Bangladesh National Building Code (BNBC)** (zoning, occupancy certificates, fire safety).

```mermaid
graph TD
    subgraph PropertyAction ["Proposed Property Action"]
        ACT_LSE["Execute 3-Year Commercial Lease"]
        ACT_DEV["Demolish / Construct on Waqf Parcel"]
        ACT_SUB["Tenant Subleases 4th Floor to Third Party"]
        ACT_PUR["Acquire New Agricultural Land for Project A"]
    end

    subgraph PropertyComplianceEngine ["Property Compliance Engine"]
        CHK_WAQF{"Is Parcel Waqf Endowment?"}
        CHK_RENT{"Advance Rent > Statutory Cap?"}
        CHK_ZONE{"Zoning Compliant (DAP)?"}
        CHK_WET{"Wetland / Agricultural Restriction?"}
    end

    subgraph DecisionState ["Enforced Governance Decision"]
        DEC_HOLD["STATUTORY HOLD:<br/>Requires Waqf Administrator Sanction"]
        DEC_BLOCK["BLOCKED:<br/>Unlawful Sublease or Illegal Wetland Fill"]
        DEC_CLEAR["CLEARED:<br/>Execute Contract with Registered Stamp Duty"]
    end

    ACT_DEV & ACT_LSE --> CHK_WAQF
    ACT_LSE --> CHK_RENT
    ACT_DEV --> CHK_ZONE
    ACT_PUR --> CHK_WET

    CHK_WAQF -->|Corpus Alienation Detected| DEC_HOLD
    CHK_RENT -->|Advance Rent > 1 Month (Rent Control Sec. 10)| DEC_HOLD
    CHK_SUB --> DEC_BLOCK
    CHK_WET -->|Wetland Identified| DEC_BLOCK
    CHK_ZONE -->|Zoning Verified| DEC_CLEAR
```

---

## 2. Core Real Estate Invariants & Regulatory Boundaries

### 2.1 The Inviolable Waqf Corpus Invariant
- **Statutory Mandate (Waqf Ordinance 1962, Sec. 32):**  
  Land or permanent real property dedicated as *Waqf-lillah* or *Waqf-alal-aulad* is **constitutionally inalienable**. The underlying land corpus cannot be gifted, mortgaged, sold, or liquidated without the formal, written, gazetted sanction of the **Administrator of Waqfs, Government of Bangladesh**.
- **Platform Hard Stop:** Any transaction attempting to transfer title, mortgage waqf deeds, or register long-term encumbrances ($> 5$ years) automatically enters **`STATUTORY_HOLD`** requiring Trustee Board Resolution + Administrator of Waqfs clearance.

### 2.2 Tenancy & Rent Control Guardrails (Rent Control Act 1991)
- **Advance Rent Ceiling (Sec. 10):** No landlord or property manager can demand or accept advance rent or premium exceeding **one month's rent** without formal written tenancy registration.
- **Eviction Due Process (Sec. 18):** Eviction cannot be executed arbitrarily or via private lockouts. A formal 30-day statutory notice specifying lawful grounds (arrears $> 2$ months, breach of covenant, personal necessity) is mandatory. Private power shutoffs or harassment trigger instant compliance violation alerts.
- **Subleasing Prohibition (Sec. 14):** A tenant cannot sublet, transfer, or assign occupancy without the express written permission of the landlord/Mutawalli.

---

## 3. Title Cadastral Chain Verification

Before any capital expenditure, development, or major lease is authorized for a property parcel, the engine requires verified verification records across the **Five-Link Cadastral Chain**:

```
[1. C.S. Khatian (Cadastral Survey)]
         ↓
[2. S.A. Khatian (State Acquisition 1956)]
         ↓
[3. R.S. / B.S. Khatian (Revisional Survey)]
         ↓
[4. Mutation Khatian (Namjari) + DCR]
         ↓
[5. Up-to-date Khajna (Land Development Tax Receipt)]
```

If any link in the cadastral chain is missing or flagged with a title dispute in the land registry, the property profile status is marked **`TITLE_RESTRICTED`**, blocking new leases or financial mortgaging.

---

## 4. Proposed Database Schema Specification

```sql
-- ---------------------------------------------------------------------------
-- 1. Property Regulatory & Cadastral Profiles Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS property_compliance_profiles (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id          UUID NOT NULL UNIQUE,          -- FK to properties.id
    cadastral_cs_khatian TEXT,
    cadastral_sa_khatian TEXT,
    cadastral_rs_khatian TEXT,
    mutation_namjari_no  TEXT NOT NULL,
    dcr_number           TEXT NOT NULL,
    khajna_cleared_until_year INTEGER NOT NULL,
    
    -- Waqf & Legal Tenure Classification
    tenure_type          TEXT NOT NULL CHECK (tenure_type IN (
                           'FREEHOLD', 'WAQF_LILLAH', 'WAQF_ALAL_AULAD', 'LEASEHOLD_GOVT', 'PRIVATE_TRUST'
                         )),
    waqf_estate_ec_number TEXT,                         -- Official Enrollment Certificate from Waqf Admin
    is_corpus_alienable  BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Zoning & Approvals
    zoning_classification TEXT NOT NULL CHECK (zoning_classification IN (
                           'COMMERCIAL', 'RESIDENTIAL', 'MIXED_USE', 'AGRICULTURAL', 'INDUSTRIAL', 'WETLAND'
                         )),
    rajuk_dap_compliant  BOOLEAN NOT NULL DEFAULT TRUE,
    fire_license_status  TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (fire_license_status IN ('ACTIVE', 'EXPIRED', 'PENDING')),
    fire_license_expires DATE,
    occupancy_certificate_id TEXT,                      -- City Corporation / RAJUK Occupancy Permit
    
    legal_status         TEXT NOT NULL DEFAULT 'CLEAR' CHECK (legal_status IN (
                           'CLEAR', 'TITLE_RESTRICTED', 'DISPUTED_IN_COURT', 'STATUTORY_HOLD'
                         )),
    last_legal_audit_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_by_party_id UUID NOT NULL REFERENCES parties(id),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. Property Legal Restrictions & Encumbrances Table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS property_legal_restrictions (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id          UUID NOT NULL REFERENCES property_compliance_profiles(property_id) ON DELETE CASCADE,
    restriction_type     TEXT NOT NULL CHECK (restriction_type IN (
                           'WAQF_INALIENABLE', 'COURT_INJUNCTION', 'EASEMENT_RIGHT', 
                           'WETLAND_PROTECTION', 'DEVELOPMENT_HEIGHT_CAP', 'HERITAGE_PROTECTED'
                         )),
    governing_statute    TEXT NOT NULL,                 -- e.g. Waqf Ordinance 1962 Sec. 32
    court_case_reference TEXT,
    restricting_authority TEXT NOT NULL,
    effective_from       DATE NOT NULL,
    effective_until      DATE,
    description          TEXT NOT NULL,
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prop_cmp_tenure ON property_compliance_profiles(tenure_type, legal_status);
CREATE INDEX IF NOT EXISTS idx_prop_restr_prop ON property_legal_restrictions(property_id, is_active);
```
