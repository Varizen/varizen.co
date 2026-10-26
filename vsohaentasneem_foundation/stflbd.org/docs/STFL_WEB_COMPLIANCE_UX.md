# STFL Web Compliance Engine & Legal Intelligence UX
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Compliance Console:** `/admin/compliance` & `/compliance`  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. Compliance Philosophy & Jurisdiction Dimensions

Compliance in the STFL digital architecture is multi-dimensional and context-aware. A single operation is evaluated across:
- **Jurisdiction:** Country (Bangladesh), Division, District, Upazila/Municipality.
- **Domain:** Property, Land Tenancy, Agricultural Labor, Statutory Tax, Corporate Trust Law, NGO Affairs Bureau regulations, Public Data Privacy, Child Safeguarding.
- **Entity Type:** Trust, Cooperative, Foundation, Individual Farmer, Corporate Donor.

---

## 2. Rule Evaluation Statuses

Every evaluated action, document, or expenditure is tagged with one of six authoritative statuses:

| Status | Visual Indicator | UI State & Behavior |
|---|---|---|
| `CLEAR` | Emerald Dot / Badge | Operation compliant with all applicable laws and internal policies. Execution proceeds without impediment. |
| `ADVISORY` | Sky Blue Badge | Informational best practice or non-binding statutory guideline. Action permitted with informational notice. |
| `WARNING` | Amber Badge | Potential operational conflict, nearing threshold limit, or approaching tax deadline. Requires acknowledgment. |
| `REVIEW_REQUIRED` | Violet Badge | Requires review and sign-off by a qualified legal officer or trustee before proceeding. |
| `HOLD` | Orange Badge | Execution paused pending external statutory approval (e.g., NGO Affairs Bureau clearance or local registry). |
| `BLOCKED` | Crimson Badge | Critical statutory or safeguarding violation. Action strictly prohibited. Cannot be bypassed. |

---

## 3. Strict AI Boundaries & Authority Limits

AI agents within STFL VI (Historical Architecture Name: STFL AIO) possess bounded capabilities governed by Level 3 autonomous ceilings:

### What AI MAY Do:
- ✅ Monitor regulatory deadline calendars and statutory tax filings.
- ✅ Classify land types, tenancy agreements, and expenditure line items.
- ✅ Calculate withholding taxes (TDS/VDS) according to statutory tax tables.
- ✅ Detect clause contradictions between special conditions and master agreements.
- ✅ Summarize long legal texts and draft advisory memos.
- ✅ Escalate potential compliance breaches to human compliance officers.

### What AI MAY NOT Do:
- ❌ **Cannot waive law** or statutory obligations under any circumstance.
- ❌ **Cannot override a compliance `HOLD` or `BLOCKED` state.**
- ❌ **Cannot self-grant legal authority** or sign agreements on behalf of trustees.
- ❌ **Cannot represent AI inference as certified legal advice or binding statutory law.**

---

## 4. Visual Provenance Tagging in the UI

The Web interface explicitly distinguishes the legal provenance of all rules and recommendations:
1. `STATUTORY LAW` (আইনগত বিধান): Formal Acts of Parliament (e.g., Agricultural Labour Act, Land Reforms Ordinance).
2. `REGULATORY REQUIREMENT` (নিয়ামক বিধি): Gazettes, SROs, and regulatory notices.
3. `CONTRACT CLAUSE` (চুক্তির ধারা): Legally binding terms agreed upon by contracting parties.
4. `INTERNAL POLICY` (অভ্যন্তরীণ নীতিমালা): SohaelTasneem Foundation trustees' ratified governance code.
5. `LOCAL PRACTICE` (স্থানীয় প্রথা): Customary rural farming or trading conventions.
6. `AI INFERENCE` (কৃত্রিম বুদ্ধিমত্তা বিশ্লেষণ): Algorithmic detection or automated draft recommendation.

*Rule: The UI never collapses these distinct sources into a single generic "legal answer."*
