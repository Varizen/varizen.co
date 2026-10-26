# Organizational Design Study
## A Medical College & Hospital in Bangladesh — Visitor-Facing and Internal Operating Model

**Version:** 1.0 · **Prepared:** 24 October 2026 · **Scope:** Private medical/dental college with attached teaching hospital, Bangladesh; benchmarked against global practice.

**How to read this document**

| Part | Content | Primary users |
|---|---|---|
| A | Regulatory & governance map (who controls what) | Promoter, Board, Legal, Principal |
| B | Establishment, licensing and accreditation pathway | Promoter, Project cell, Compliance |
| C | Target organizational architecture (layers, spans, committees) | Board, Principal/CEO, HR |
| D | Role cards — governance, academic, hospital, support | HR, department heads |
| E | Visitor / patient experience blueprint | Hospital Director, Front office, Nursing |
| F | Employee, faculty and student experience blueprint | HR, Registrar, Exam Controller |
| G | Global benchmarking (UK, US, Canada, Australia, Japan, Korea, Singapore, Malaysia, India, Thailand) | Board, Quality team |
| H | Gap analysis, phased roadmap, KPIs, risk register | Board, Principal/CEO |
| I | Appendices — templates, RACI, registers, sources | All |

> **Evidence discipline.** Statements marked **[Law]** are taken from the gazetted text of the *Private Medical College and Dental College Act, 2022* (Act No. 16 of 2022) and the *Bangladesh Medical Education Accreditation Act, 2023* (Act No. 30 of 2023), both downloaded from the Directorate General of Medical Education (DGME) law page. Statements marked **[Practice]** are standard operating practice in Bangladeshi medical colleges and should be validated against the affiliating university ordinance and BMDC's *Criteria and Standards*. Statements marked **[Benchmark]** come from WFME, JCI, NHS, AMC, LCME/CACMS and national accreditation bodies. Statements marked **[Verify]** are widely reported but were not confirmed from a primary document during this study.

---

## Executive summary — the ten design decisions

1. **Separate the three lines of accountability.** Ownership (trust/society/company) → Governing Body (Parichalana Parshad) → Executive management. The Principal is accountable for the college; the Hospital Director/Medical Director for the hospital; both report to the Governing Body, not to each other. Academic authority over curriculum and examinations flows from the affiliating public university and BMDC, not from the promoter.
2. **Build the statutory minimum first, then the excellence layer.** The 2022 Act mandates a Governing Body plus four committees (Management, Finance, Academic, Quality Control of Education) **[Law]**. Accreditation, patient-safety and digital committees are voluntary additions that later become mandatory under BMEAC.
3. **Treat the hospital as a licensed entity in its own right.** Hospital licence (DGHS Hospital & Clinic Section), environment clearance, fire NOC, medical waste authorization, drug sale licence, blood bank licence, radiology licence and biomedical waste contracts are separate from the college's academic approval. Two regulators, two files, one compliance calendar.
4. **Design for the visitor before designing for the org chart.** Every visitor-facing outcome (wayfinding, waiting time, bill transparency, grievance closure, emergency response) must have one named owner and one measurable standard. In Bangladeshi private hospitals the most common failure is that no single role owns the outpatient journey end-to-end.
5. **Give the academic side real operational teeth.** Registrar (academic), Controller of Examinations, Class Teacher/Module Coordinator, Curriculum Committee, Clinical Skill Lab Head and Research Cell must be funded posts with protected time — not additional duties of clinical faculty.
6. **Institutionalize clinical governance.** Medical Advisory Committee, Mortality & Morbidity review, Infection Prevention & Control Committee, Pharmacy & Therapeutics Committee, Transfusion Committee, Radiation Safety, Research Ethics Committee, Patient Safety/Incident Review. These are the mechanisms that convert "good doctors" into a safe institution.
7. **Plan staffing to the ratio the law states.** Teacher–student ratio 1:10 per department; part-time faculty capped at 25% of sanctioned posts **[Law]**. Design department establishments so that the 25% cap is a ceiling, not a staffing strategy.
8. **Fund the reserved and free-care obligations from day one.** Tk 3 crore reserved fund for a 50-seat medical college (Tk 2 crore dental), plus Tk 3 lakh per additional medical seat; 10% of hospital beds permanently free for poor patients with round-the-clock emergency **[Law]**. These are cash-flow commitments, not goodwill.
9. **Prepare for accreditation from the first admission.** BMEAC accreditation certificates run 5 years with renewal at least 6 months before expiry **[Law]**; WFME recognition is granted to the *agency*, not the school **[Benchmark]**. Self-assessment, documentation and evidence capture must be routine, not a pre-visit scramble.
10. **Digitize the spine, not the frills.** One patient identifier, one encounter record, one bill, one roster, one incident register, one dashboard. Digital maturity (HIMSS EMRAM-style staging) is the cheapest quality intervention available to a Bangladeshi private college hospital.

---

## Part A — Regulatory and governance map

### A1. The state architecture around a medical college hospital

```
President
  └── Ministry of Health and Family Welfare (MoHFW)
        ├── Health Services Division (HSD)
        │     └── Directorate General of Health Services (DGHS)
        │           ├── Hospital & Clinic Section  → private hospital/clinic licence
        │           ├── Hospital Services Management (HSM)
        │           └── National IPC / quality programmes
        └── Medical Education and Family Welfare Division (MEFWD)
              ├── Directorate General of Medical Education (DGME)
              │     ├── policy approval & inspection of private colleges
              │     ├── admission & seat regulation
              │     └── foreign student / certificate verification desks
              ├── Bangladesh Medical & Dental Council (BMDC)  [statutory]
              └── Bangladesh Medical Education Accreditation Council (BMEAC) [statutory, 2023]

Affiliating public university (e.g., Dhaka University, BSMMU, Rajshahi University…)
  └── Faculty of Medicine → curriculum, examinations, degrees, Governing Body approval

Cross-cutting regulators:
  Ministry of Environment, Forest and Climate Change → DoE clearance, EIA, waste rules
  Fire Service and Civil Defence → fire NOC / safety certificate
  City Corporation / Municipality → trade licence, building permit, signage
  Directorate General of Drug Administration (DGDA) → pharmacy & drug licences
  Bangladesh Standards and Testing Institution (BSTI) → some equipment/consumables
  Department of Explosives / Atomic Energy Commission → radiation sources, X-ray licences
  Bangladesh Accreditation Board (BAB) → laboratory accreditation (ISO 15189) [Benchmark]
  National Board of Revenue → tax, VAT, customs on equipment
  Department of Inspection for Factories and Establishments → labour law compliance
  Insurance Development and Regulatory Authority → health insurance interfaces
```

### A2. Who regulates what — the practical split

| Body | Legal basis | What it actually decides for a private college hospital |
|---|---|---|
| **MoHFW / MEFWD** | Rules of Business | Policy approval to establish; permission for new admissions; fee gazette; reserved fund acceptance; appointment/removal in BMEAC; overall policy |
| **DGME** | 2022 Act, 2023 Act, admission rules | Receives application; convenes Inspection Committee; issues initial policy approval and academic approval; monitors admissions; receives student lists; verifies certificates |
| **BMDC** | BMDC Act 2010 (Act 61 of 2010) | Recognises medical qualifications; registers doctors; sets teacher qualifications; approves curriculum changes; sets minimum standards for college/hospital; ethical jurisdiction over practitioners |
| **BMEAC** | 2023 Act (Act 30 of 2023) | Accredits medical education institutions and their courses; 5-year certificates; standards, framework, pre-survey and survey; sanctions |
| **Affiliating public university** | University Act + statutes/ordinances | Syllabus, examination conduct, degree award, Governing Body constitution, teacher appointment approval, affiliation inspection |
| **DGHS Hospital & Clinic Section** | Medical Practice and Private Clinics and Laboratories (Regulation) Ordinance, 1982 **[Verify]** | Hospital/clinic/diagnostic licence and renewal; bed strength; facility inspections; service obligations |
| **DoE** | Bangladesh Environment Conservation Act 1995; Medical Waste Management Rules 2008 **[Verify]** | Site clearance, EIA/EMP, medical waste handling authorization, effluent |
| **Fire Service & Civil Defence** | Fire Prevention and Extinguishment Act / rules | Fire safety NOC, evacuation plan, drills, equipment |
| **DGDA** | Drugs Act 1940 / Drugs Rules 1945 (as amended) | Retail/wholesale drug licence, narcotics, blood bank, quality complaints |
| **Atomic Energy Commission** | Nuclear Safety and Radiation Control Act 1993 | X-ray/CT/linac licensing, radiation safety officer, TLD badges |
| **City Corporation** | Local government acts | Trade licence, building occupancy, advertisement, waste connection |

### A3. Governance principles the design must satisfy

- **Fiduciary separation.** The Governing Body owns strategy and financial stewardship; the executive owns operations. No promoter should sign a payroll or a purchase order directly.
- **Academic independence.** Curriculum, assessment standards, results and promotions are governed by the affiliating university and BMDC. The Governing Body cannot direct a pass or a promotion.
- **Clinical independence.** Clinical judgement belongs to credentialed clinicians; management owns systems, resources and standards, not individual clinical decisions.
- **One accountable executive per outcome.** Patient safety, academic quality, financial control, workforce, digital, facilities — each has a single named accountable executive.
- **Statutory committees are not optional.** The four Act-mandated committees must exist with terms of reference, quorum, minutes and an annual report to the Governing Body **[Law]**.
- **Conflict-of-interest management.** Entrepreneur-members of the Governing Body must recuse from procurement, appointment and admission decisions affecting their own interests.

---

## Part B — Establishment, licensing and accreditation pathway

### B1. The statutory thresholds (Private Medical College and Dental College Act, 2022) **[Law]**

| Requirement | Medical college | Dental college |
|---|---|---|
| Minimum admitted seats | 50 | 50 |
| Land — metropolitan area | ≥ 2 acres | ≥ 1 acre |
| Land — outside metropolitan area | ≥ 4 acres | ≥ 2 acres |
| Land — already academically recognised, in metro | ≥ 1 acre | ≥ 1 acre |
| Land title | Absolute ownership, unencumbered, undivided, free of liability | Same |
| Rented/leased land or building | **Prohibited** for college and its hospital | Same |
| Reserved fund in a scheduled bank | Tk 3 crore | Tk 2 crore |
| Reserved fund — each seat above 50 | + Tk 3 lakh per seat | + Tk 2 lakh per seat |
| Reserved fund — individual (not institutional) ownership | + Tk 1 crore | + Tk 1 crore |
| Reserved fund — already academically recognised college | Tk 1 crore | Tk 1 crore |
| Reserved fund — college named after a national personality | No additional deposit | No additional deposit |
| Academic floor space | ≥ 1,00,000 sq ft | ≥ 50,000 sq ft |
| Hospital floor space | ≥ 1,00,000 sq ft | ≥ 50,000 sq ft |
| Hospital operating before application | ≥ 2 years, modern general hospital, ≥ 250 beds, ≥ 70% bed occupancy | ≥ 50-bed full dental hospital |
| Buildings | Separate buildings for college and hospital, department-wise facilities | Same |
| Free beds for poor | ≥ 10% of beds, permanently reserved, fully free treatment | Same |
| Emergency | Round-the-clock emergency service with all modern facilities | Same |
| Distance from existing college | As prescribed by rules | Same |
| Teacher–student ratio | 1:10 per department | 1:10 |
| Part-time faculty | ≤ 25% of sanctioned posts in a department | Same |
| Seats reserved for poor meritorious | 5% of seats | 5% |
| Clinical skill lab | Mandatory | Mandatory |
| Field site | 1 district/upazila health complex + 1 community clinic, with consent | Same |

### B2. The approval sequence

```
1. Promoter entity formed (trust / society / company) + land purchased freehold
2. Hospital built and OPERATING for ≥ 2 years at ≥ 70% occupancy, ≥ 250 beds
3. Application to Government (DGME) in prescribed form + fee
4. Inspection Committee constituted (Sec. 7) → physical inspection + report
5. Government scrutiny → INITIAL POLICY APPROVAL (Sec. 9(3)(a))
6. Compliance with conditions → application for ACADEMIC APPROVAL (Sec. 10)
7. Inspection Committee re-inspection → Government → ACADEMIC APPROVAL = FINAL APPROVAL (Sec. 10(4))
8. Academic approval valid 2 years → renewal (Sec. 11)
9. Admission only with Government permission (Sec. 16(7))
10. BMEAC accreditation (separate 2023 Act) → 5-year certificate
```

### B3. Inspection Committee composition (Sec. 7) **[Law]**

| # | Member | Role |
|---|---|---|
| 1 | Additional Director General or Director, DGME | Chair |
| 2 | Dean (Faculty of Medicine) or Professor of the affiliating public university | Member |
| 3 | Associate Professor or above, Basic Science | Member |
| 4 | Associate Professor or above, Clinical Science | Member |
| 5 | BMDC nominee | Member |
| 6 | Deputy Secretary / Senior Assistant Secretary, MEFWD | Member |
| 7 | Deputy/Assistant Director, DGME | Member Secretary |

### B4. Accreditation architecture (Bangladesh Medical Education Accreditation Act, 2023) **[Law]**

- **BMEAC** is a statutory body with perpetual succession, a common seal, power to own property and sue; head office in Dhaka; regional offices with government approval.
- **Council composition (17):** Chair (Professor-level senior physician, government-appointed, 4-year term); 2 government-nominated professors in medical education/research/development; DGME; DGHS; 5 retired professors (medical, dental, nursing, IHT, MATS); Additional Secretary (Medical Education), MEFWD; Additional Secretary, Health Services Division; DG Nursing & Midwifery; President BCPS; President BMDC; 1 Dean from medical universities; 1 Legislative Division officer (Joint Secretary or above); 1 UGC Director; Director (Medical Education), DGME; 1 biomedical engineer; 1 retired Alternative Medicine teacher; Registrar (Member-Secretary).
- **Advisory Council:** Minister (Chair), Secretary MEFWD, Chairman UGC, Chairman BMRC, VC BSMMU, Chairman BAB, Chairman BMEAC (Member-Secretary). At least one meeting a year.
- **Technical Committee and Accreditation Committee** constituted by the Council; experts may be co-opted.
- **Accreditation process:** institutional self-survey → application → Council pre-survey and formal survey → report → decision → certificate. Certificate valid **5 years**; renewal application at least **6 months** before expiry.
- **Sanctions:** refusal, suspension, revocation; administrative fine; appeal and review within 30 days.
- **Prohibition:** an institution may not advertise itself as "accredited" without a certificate.

### B5. Global accreditation reality check **[Benchmark]**

WFME does **not** accredit individual medical schools. It recognises *accrediting agencies*. WFME's country map currently lists Bangladesh's BMEAC among agencies **applying** in the Recognition Programme (not yet awarded at the time of retrieval). Some Bangladeshi institutions and student bodies have publicly claimed WFME recognition; that claim should be verified directly with WFME before it is used in marketing or student recruitment. Practical consequence: a Bangladeshi college's international standing depends on (a) BMEAC accreditation, (b) the affiliating university's recognition, and (c) BMDC registration of its graduates — not on a school-level "WFME certificate".

### B6. Hospital licensing and operating obligations (practical checklist) **[Practice]/[Verify]**

| Domain | Instrument / authority | Evidence to keep |
|---|---|---|
| Entity & trade | Trust deed / incorporation, TIN, BIN, trade licence | Certificates, board resolutions |
| Land & building | Title deed, mutation, RAJUK/City building permit, occupancy certificate | Approved plan, as-built drawings |
| Hospital licence | DGHS Hospital & Clinic Section application + inspection | Licence, bed-strength schedule, renewal file |
| Environment | DoE site clearance, EIA/EMP, medical waste authorization | Clearance letters, waste manifests, contracts |
| Fire | Fire Service & Civil Defence NOC | NOC, drill records, extinguisher logs |
| Pharmacy | DGDA drug sale licence, pharmacist registration | Licence, narcotics register, recall log |
| Blood bank | DGDA / safe blood transfusion programme | Licence, donor records, cold-chain logs |
| Radiology | Atomic Energy Commission licence, RSO appointment | Licence, TLD reports, shielding plan |
| Laboratory | DGHS/ISO 15189 pathway **[Benchmark]** | EQAS enrolment, SOPs, calibration |
| Waste | Medical Waste Management Rules 2008 | Segregation audit, incineration/contract records |
| Labour | Labour Act 2006, minimum wage, provident fund | Service rules, PF/gratuity records |
| Data | Digital health policy, DHIS2 reporting | Monthly returns, data-sharing agreements |

---

## Part C — Target organizational architecture

### C1. Design logic: five layers, three lines

```
LINE 1 — OWNERSHIP & GOVERNANCE (fiduciary, strategic, statutory)
LINE 2 — ACADEMIC (university/BMDC authority; quality of education)
LINE 3 — HOSPITAL OPERATIONS (licence, clinical services, patient experience)
        + SHARED SERVICES (finance, HR, IT, facilities, procurement, legal)
```

### C2. Layer 0–1: Ownership and Governing Body

| Body | Composition | Frequency | Accountable for |
|---|---|---|---|
| **General Body / Trustee Board / Shareholders** | Promoters, trustees, shareholders | Annual + extraordinary | Ownership, capital, appointment of Governing Body |
| **Governing Body (Parichalana Parshad)** — Sec. 18 **[Law]** | Chair from entrepreneurs; ≥50% members from entrepreneurs; representatives of Government, affiliating university and DGME | Quarterly (min.) | Strategy, budget, appointments, compliance, academic approval conditions |
| **Academic Council** | Principal (Chair), Vice-Principal, all Professors/Heads, Registrar, Controller of Examinations, university nominee, BMDC nominee | Quarterly | Curriculum, assessment policy, results ratification, faculty affairs |
| **Hospital Management Committee** | Hospital Director (Chair), Medical Director, Nursing Director, Finance, HR, Quality, Matron, Clinical Heads | Monthly | Service delivery, patient experience, safety, utilisation |
| **Finance Committee** — Sec. 19 **[Law]** | Chair (GB nominee), Finance Director, 2 GB members, internal auditor (invitee) | Monthly/quarterly | Budget, procurement approvals, audit follow-up, reserved fund |
| **Management Committee** — Sec. 19 **[Law]** | Principal/CEO, Hospital Director, Finance, HR, Registrar | Monthly | Cross-cutting operational decisions |
| **Quality Control of Education Committee** — Sec. 19 **[Law]** | Principal, Vice-Principal, senior professors, Registrar, student representative | Quarterly | Curriculum delivery, faculty development, accreditation readiness |
| **Audit & Risk Committee** (recommended) | GB non-executive members, external auditor | Quarterly | Internal audit, risk register, whistleblowing |

### C3. Layer 2: Academic structure

```
Principal (Academic Head) ── Vice-Principal (Academic) ── Vice-Principal (Administration)
   │
   ├── Registrar (Academic) ── Assistant Registrar ── Records/Transcripts Cell
   ├── Controller of Examinations ── Deputy Controller ── Examination Hall/Invigilation Cell ── Results Cell
   ├── Dean of Students / Student Affairs ── Hostel Wardens ── Counselling ── Co-curricular
   ├── Curriculum & Module Coordination Cell ── Phase Coordinators (I, II, III, IV, Internship)
   ├── Clinical Skill Lab (CSL) Head ── Simulation Technicians
   ├── Research Cell ── Research Ethics Committee ── Biostatistics ── Grant Management
   ├── Medical Education Unit (MEU) ── Faculty Development ── Assessment & Evaluation
   ├── Library ── Chief Librarian ── Digital Resources
   └── Departments (each with Head, Professors, Associate Professors, Assistant Professors, Lecturers, Demonstrators, Tutors)
         Basic: Anatomy, Physiology, Biochemistry, Pharmacology, Pathology, Microbiology, Forensic Medicine,
                Community Medicine, Forensic/Transfusion as applicable
         Clinical: Medicine, Surgery, Obstetrics & Gynaecology, Paediatrics, Orthopaedics, Ophthalmology,
                   ENT, Dermatology, Psychiatry, Radiology, Anaesthesiology, Cardiology, Neurology, Nephrology,
                   Urology, Neurosurgery, Oncology, Dentistry (for dental college), Nursing (for nursing programmes)
```

### C4. Layer 3: Hospital structure

```
Hospital Director (operations, licence, finance interface)
   ├── Medical Director / Chief Medical Officer (clinical governance, credentialing, quality of care)
   │     ├── Clinical Department Heads (as above)
   │     ├── Emergency Department Head
   │     ├── ICU/CCU/HDU Head
   │     ├── OT Complex Head
   │     └── Clinical Quality & Audit Unit
   ├── Nursing Director / Superintendent ── Matrons ── Ward In-charges ── Staff Nurses ── Nursing Assistants
   ├── Patient Experience & Front Office Manager ── Registration ── Help Desk ── Billing ── Insurance/TPA desk
   ├── Diagnostics Manager ── Laboratory ── Radiology ── Pathology ── Blood Bank
   ├── Pharmacy Manager ── Clinical Pharmacist ── Dispensing ── Stores
   ├── Support Services Manager ── Housekeeping ── Laundry ── CSSD ── Dietetics ── Mortuary ── Transport
   ├── Facilities & Biomedical Engineering Manager ── Plant ── Oxygen ── Maintenance ── Calibration
   ├── Infection Prevention & Control (IPC) Lead ── Surveillance ── Outbreak response
   ├── Health Information / Medical Records Manager ── Coding ── Statistics ── DHIS2 returns
   └── Security & Safety Manager ── Access control ── Fire safety ── Disaster response
```

### C5. Layer 4: Shared services and corporate functions

| Function | Head | Interfaces |
|---|---|---|
| Finance & Accounts | Finance Director / CFO | Governing Body, Finance Committee, external audit, NBR |
| Human Resources | HR Director / Manager | Payroll, credentialing, service rules, labour law |
| IT & Digital Health | CIO / IT Manager | HIS/EMR, DHIS2, cybersecurity, telemedicine |
| Procurement & Stores | Procurement Manager | Tender committee, DGDA, customs |
| Legal & Medico-legal | Legal Advisor | MRA, courts, police, consumer rights |
| Internal Audit & Compliance | Chief Internal Auditor | Audit & Risk Committee, BMEAC, DGHS |
| Communications & Marketing | Communications Manager | Website, patient information, media, complaints |
| Academic Administration | Registrar | University, BMDC, DGME, students |
| Quality & Patient Safety | Quality Director | Accreditation, incident reporting, KPIs |

### C6. Committee architecture (statutory + recommended)

| Committee | Chair | Secretariat | Frequency | Statutory? |
|---|---|---|---|---|
| Governing Body | GB Chair | Registrar/Secretary | Quarterly | Yes **[Law]** |
| Management Committee | Principal/CEO | Registrar | Monthly | Yes **[Law]** |
| Finance Committee | GB nominee | Finance Director | Monthly | Yes **[Law]** |
| Academic Committee | Principal | Registrar | Quarterly | Yes **[Law]** |
| Quality Control of Education Committee | Vice-Principal (Academic) | MEU Head | Quarterly | Yes **[Law]** |
| Medical Advisory Committee | Medical Director | Clinical Governance Officer | Monthly | Recommended |
| Mortality & Morbidity Review | Medical Director | Clinical Audit Officer | Monthly | Recommended |
| Infection Prevention & Control | IPC Lead | IPC Nurse | Monthly | Recommended |
| Pharmacy & Therapeutics | Clinical Pharmacist Head | Pharmacy Secretary | Quarterly | Recommended |
| Transfusion Committee | Blood Bank Head | Transfusion Officer | Quarterly | Recommended |
| Radiation Safety Committee | Radiology Head | RSO | Quarterly | Recommended |
| Research Ethics Committee | Senior Professor | Research Cell | Monthly | Recommended |
| Patient Safety & Incident Review | Quality Director | Risk Manager | Monthly | Recommended |
| Grievance Redress Committee | Patient Experience Manager | Help Desk | Weekly | Recommended |
| Admission Committee | Principal | Registrar | Annual | Yes (university rules) |
| Examination Committee | Controller of Examinations | Deputy Controller | Per exam | Yes (university rules) |
| Anti-ragging / Discipline Committee | Dean of Students | Student Affairs | As needed | Recommended |
| Sexual Harassment Prevention Committee | Senior female faculty | HR | As needed | Yes (per law) **[Verify]** |
| Procurement/Tender Committee | Finance Director | Procurement | Per tender | Yes (public procurement rules) |
| Fire & Disaster Management Committee | Hospital Director | Safety Manager | Quarterly | Recommended |

### C7. Span-of-control and layer norms

| Layer | Typical span | Notes |
|---|---|---|
| Governing Body → Principal/CEO | 1:1 | Single accountable executive |
| Principal → Vice-Principals/Registrar/Controller | 1:4–6 | Academic + admin split |
| Department Head → faculty | 1:8–15 | Depends on department size |
| Nursing Director → Matrons | 1:4–8 | By clinical zone |
| Matron → Ward In-charges | 1:6–12 | By ward cluster |
| Hospital Director → functional managers | 1:6–9 | Operations, support, diagnostics |
| Manager → supervisors | 1:8–12 | Front office, housekeeping, security |

---

## Part D — Role cards

### D1. Governance roles

#### D1.1 Chair, Governing Body (Parichalana Parshad)
- **Accountable to:** General Body / Trustee Board.
- **Accountable for:** Board effectiveness, strategy, financial stewardship, regulatory relationships, conflict-of-interest management.
- **Visitor-facing:** Ensures the institution's public commitments (free beds, emergency service, fee transparency, grievance closure) are resourced and audited; signs the annual public disclosure.
- **Internal-facing:** Sets the agenda; ensures the four statutory committees function; conducts the Principal's and Hospital Director's appraisal; approves service rules and pay structure (with government approval).
- **KPIs:** Board attendance ≥75%; statutory committee meetings held as scheduled; audit findings closed within 90 days; zero regulatory licence lapses.
- **Statutory interface:** MoHFW/MEFWD, DGME, BMDC, BMEAC, affiliating university.

#### D1.2 Governing Body members (entrepreneur bloc, ≥50%)
- **Accountable to:** Chair/General Body.
- **Accountable for:** Capital decisions, oversight of academic and hospital performance, community interest.
- **Visitor-facing:** Represent community interests; review patient complaints and free-bed utilisation.
- **Internal-facing:** Serve on Finance/Audit committees; declare conflicts; recuse from related-party decisions.
- **KPIs:** Attendance; declarations filed; no undisclosed related-party transactions.

#### D1.3 Government / University / DGME representatives on the Governing Body
- **Accountable to:** Their appointing authority and the Governing Body.
- **Accountable for:** Ensuring statutory compliance, academic standards and public-interest obligations.
- **Visitor-facing:** Monitor free-bed and emergency-service compliance.
- **Internal-facing:** Report non-compliance to the appointing authority; ensure university ordinances are followed.
- **KPIs:** Compliance exceptions reported; academic approval conditions met.

#### D1.4 Academic Council
- **Chair:** Principal. **Members:** Vice-Principals, all Professors/Heads, Registrar, Controller of Examinations, university nominee, BMDC nominee, student representative (non-voting on results).
- **Accountable for:** Curriculum implementation, assessment policy, results ratification, faculty development, research strategy.
- **Visitor-facing:** Ensures clinical training standards protect patient safety (supervision, consent, student scope).
- **Internal-facing:** Approves module plans, internal assessment schedules, question-paper moderation, promotion decisions.
- **KPIs:** On-time results; assessment blueprint coverage; faculty development hours; accreditation standards met.

### D2. Executive roles

#### D2.1 Principal / Chief Executive (College)
- **Accountable to:** Governing Body; academically to the affiliating university.
- **Accountable for:** Overall college performance, academic approval conditions, faculty establishment, student welfare, regulatory inspections, institutional reputation.
- **Visitor-facing:** Public face of the institution; signs MoUs with field sites; responds to media and regulatory notices.
- **Internal-facing:** Chairs Academic Council and Management Committee; approves appointments (with university/BMDC where required); controls academic budget; ensures teacher–student ratio and part-time cap.
- **KPIs:** Academic approval/accreditation status; admission compliance; pass rates; faculty vacancy rate; student satisfaction; inspection outcomes.
- **Deputies:** Vice-Principal (Academic), Vice-Principal (Administration), Registrar, Controller of Examinations.

#### D2.2 Hospital Director / Chief Operating Officer
- **Accountable to:** Governing Body; works jointly with Medical Director.
- **Accountable for:** Hospital licence, service operations, revenue cycle, patient experience, facilities, support services, statutory compliance (fire, waste, environment), emergency preparedness.
- **Visitor-facing:** Owns the end-to-end patient journey; chairs daily operations huddle; signs off patient-charter performance; owns grievance escalation.
- **Internal-facing:** Manages non-clinical workforce; approves rosters with Nursing Director; controls hospital budget; manages vendor contracts.
- **KPIs:** OPD waiting time; admission/discharge turnaround; bed occupancy; revenue per bed; complaint closure; licence renewal on time; fire/waste compliance.

#### D2.3 Medical Director / Chief Medical Officer
- **Accountable to:** Governing Body (clinically) and Hospital Director (operationally).
- **Accountable for:** Clinical governance, credentialing and privileging, clinical audit, mortality review, clinical protocols, medico-legal coordination, teaching–service balance.
- **Visitor-facing:** Final clinical escalation point; reviews serious incidents and complaints with clinical content; ensures informed consent and patient rights.
- **Internal-facing:** Chairs Medical Advisory Committee and M&M; approves clinical rosters with department heads; oversees junior doctor supervision and duty rosters; ensures faculty fulfil teaching hours.
- **KPIs:** Credentialing completion; clinical audit cycle completion; mortality review closure; incident reporting rate and closure; antibiotic stewardship compliance.

#### D2.4 Nursing Director / Superintendent
- **Accountable to:** Hospital Director; professionally to Medical Director.
- **Accountable for:** Nursing establishment, ward management, nursing quality, infection control practice, patient safety at the bedside, nurse training and licensure.
- **Visitor-facing:** Ward-level patient experience; visitor management; patient education; discharge instructions.
- **Internal-facing:** Rosters, skill mix, vacancy management, incident reporting, nursing audit, student nurse supervision.
- **KPIs:** Nurse–patient ratio; vacancy rate; falls/pressure injury rates; medication error rate; hand-hygiene compliance; patient satisfaction with nursing care.

#### D2.5 Finance Director / CFO
- **Accountable to:** Governing Body; administratively to Principal/CEO.
- **Accountable for:** Budget, accounting, revenue cycle, procurement finance, payroll control, reserved fund, statutory audit, tax compliance.
- **Visitor-facing:** Transparent billing, estimates before procedures, refund policy, insurance/TPA desk.
- **Internal-facing:** Payroll, provident fund, vendor payments, budget variance reporting, internal controls.
- **KPIs:** Budget variance; receivable days; audit opinion; payroll accuracy; billing complaint rate; reserved fund compliance.

#### D2.6 HR Director / Manager
- **Accountable to:** Principal/CEO.
- **Accountable for:** Workforce planning, recruitment, credentialing records, service rules, payroll inputs, leave, discipline, training records, labour-law compliance.
- **Visitor-facing:** Ensures staff identification, behaviour standards, complaint handling by staff.
- **Internal-facing:** Recruitment cycle time; onboarding; appraisal; promotion files; grievance handling; exit interviews.
- **KPIs:** Vacancy rate; time-to-fill; attrition; training compliance; appraisal completion; disciplinary case cycle time.

#### D2.7 Registrar (Academic)
- **Accountable to:** Principal.
- **Accountable for:** Student records, admission processing, registration with university/BMDC, transcripts, certificates, academic calendar, examination coordination logistics.
- **Visitor-facing:** Admission help desk; document verification; student certificate services.
- **Internal-facing:** Maintains student register, attendance records, migration/transfer files, university correspondence.
- **KPIs:** Admission file accuracy; registration timeliness; transcript turnaround; zero lost records.

#### D2.8 Controller of Examinations
- **Accountable to:** Principal; functionally to the affiliating university.
- **Accountable for:** Examination scheduling, question paper security, invigilation, script handling, tabulation, results publication, re-scrutiny, malpractice handling.
- **Visitor-facing:** Publishes examination schedules and results; handles student queries and appeals.
- **Internal-facing:** Coordinates with university exam controller; maintains confidentiality; manages exam halls and manpower; ensures question-paper moderation and blueprint compliance.
- **KPIs:** On-time exams; zero paper leakage; result publication within university timeline; appeal disposal time; malpractice case cycle time.

#### D2.9 Dean of Students / Student Affairs
- **Accountable to:** Principal.
- **Accountable for:** Student welfare, hostels, counselling, co-curricular activities, discipline, anti-ragging, mentoring.
- **Visitor-facing:** Parent communication; hostel visits; grievance handling.
- **Internal-facing:** Class teacher coordination; attendance monitoring; scholarship/free-seat administration; mental-health support.
- **KPIs:** Hostel occupancy and satisfaction; counselling uptake; discipline case cycle time; dropout rate.

#### D2.10 Quality & Patient Safety Director
- **Accountable to:** Governing Body (via Audit & Risk Committee) and Principal/CEO.
- **Accountable for:** Quality strategy, accreditation readiness (BMEAC), patient-safety programme, incident reporting, clinical indicators, patient experience measurement, document control.
- **Visitor-facing:** Complaint and feedback system; patient-rights charter; public reporting.
- **Internal-facing:** Runs quality committees; trains staff; conducts audits; maintains evidence repository; coordinates surveys.
- **KPIs:** Accreditation readiness score; incident reporting rate; closure rate; hand-hygiene compliance; patient satisfaction; document control compliance.

#### D2.11 IT / Digital Health Manager (CIO)
- **Accountable to:** Hospital Director/Principal.
- **Accountable for:** HIS/EMR, network, cybersecurity, data backup, DHIS2 reporting, telemedicine, digital identity, interoperability.
- **Visitor-facing:** Online appointment, registration kiosks, digital reports, patient portal, queue displays.
- **Internal-facing:** Role-based access, audit logs, uptime, help desk, training.
- **KPIs:** Uptime ≥99.5%; cybersecurity incidents; report turnaround; digital adoption; data-quality score.

#### D2.12 Facilities & Biomedical Engineering Manager
- **Accountable to:** Hospital Director.
- **Accountable for:** Building, plant, oxygen, HVAC, power backup, lifts, water, medical gas, equipment maintenance and calibration, fire systems.
- **Visitor-facing:** Clean, safe, functioning environment; signage; accessibility.
- **Internal-facing:** Preventive maintenance schedule; breakdown response; calibration records; vendor management.
- **KPIs:** PM compliance; mean time to repair; calibration compliance; utility downtime; fire-system readiness.

#### D2.13 IPC Lead (Infection Prevention & Control)
- **Accountable to:** Medical Director.
- **Accountable for:** Surveillance, isolation, sterilization, hand hygiene, outbreak response, waste segregation, staff vaccination.
- **Visitor-facing:** Visitor screening and hand-hygiene instructions; isolation signage.
- **Internal-facing:** Surveillance reports; staff training; audit; post-exposure prophylaxis.
- **KPIs:** HAI rates; hand-hygiene compliance; sterilization compliance; needle-stick reporting; waste segregation accuracy.

#### D2.14 Patient Experience & Front Office Manager
- **Accountable to:** Hospital Director.
- **Accountable for:** Registration, help desk, wayfinding, queue management, billing interface, visitor management, complaints, feedback, interpreter services.
- **Visitor-facing:** First and last point of contact; owns the patient charter; daily rounds of waiting areas; escalation of distressed patients.
- **Internal-facing:** Roster of front-desk staff; training in communication; complaint log and trend analysis; coordination with clinical units.
- **KPIs:** Registration time; OPD wait; complaint first-response time; closure rate; Net Promoter Score; wayfinding complaint rate.

### D3. Academic department roles

#### D3.1 Department Head (Professor)
- **Accountable to:** Principal/Academic Council.
- **Accountable for:** Teaching, assessment, research, faculty supervision, departmental quality, clinical service in the specialty, departmental budget and establishment.
- **Visitor-facing:** Specialty OPD/service quality; consultant availability; patient information.
- **Internal-facing:** Timetable, module delivery, internal assessment, faculty appraisal, leave planning, departmental audit, resident supervision.
- **KPIs:** Teaching hours delivered; assessment timeliness; research output; faculty vacancy; departmental clinical indicators; student feedback.

#### D3.2 Professor / Associate Professor / Assistant Professor / Lecturer / Demonstrator
- **Accountable to:** Department Head.
- **Accountable for:** Teaching, clinical service, assessment, research, student mentoring.
- **Visitor-facing:** Consultation quality, consent discussions, patient communication, supervision of trainees.
- **Internal-facing:** Lecture/practical/tutorial delivery, question setting and moderation, script marking, ward rounds, on-call duties, CME.
- **KPIs:** Teaching load; assessment contribution; research; patient feedback; punctuality; CME hours.

#### D3.3 Class Teacher / Module Coordinator / Mentor
- **Accountable to:** Phase Coordinator/Department Head.
- **Accountable for:** A cohort's academic progress, attendance, mentoring, early-warning support, parent communication, coordination with subject teachers.
- **Visitor-facing:** Parent/guardian meetings; student welfare escalation.
- **Internal-facing:** Attendance register; progress reviews; remedial plans; referral to counselling; maintain confidentiality.
- **KPIs:** Attendance rate; at-risk students identified and supported; pass rate; student satisfaction; parent-meeting coverage.

#### D3.4 Phase Coordinator (Phase I–IV and Internship)
- **Accountable to:** Vice-Principal (Academic).
- **Accountable for:** Integrated module delivery, timetabling, assessment alignment, clinical rotation logistics, internship supervision.
- **Visitor-facing:** Ensures students in clinical areas are supervised and introduced; patient consent for student involvement.
- **Internal-facing:** Phase committee; blueprint coverage; logbook verification; rotation scheduling; remediation.
- **KPIs:** Module completion; assessment blueprint coverage; rotation completion; logbook compliance; internship completion.

#### D3.5 Medical Education Unit (MEU) Head
- **Accountable to:** Principal.
- **Accountable for:** Faculty development, teaching methods, assessment quality, educational research, curriculum evaluation.
- **Visitor-facing:** Indirect — improves clinical teaching quality and patient communication.
- **Internal-facing:** Runs workshops (CBME, assessment, feedback), evaluates courses, supports accreditation evidence.
- **KPIs:** Faculty trained; workshop frequency; curriculum evaluation reports; educational publications.

#### D3.6 Clinical Skill Lab (CSL) Head
- **Accountable to:** Vice-Principal (Academic).
- **Accountable for:** Simulation-based training, equipment, safety, scheduling, assessment of procedural skills.
- **Visitor-facing:** Ensures trainees practise on simulators before patients; protects patient safety.
- **Internal-facing:** Lab inventory; scenario design; technician training; competency records.
- **KPIs:** Skills-lab sessions delivered; competency pass rates; equipment uptime; safety incidents.

#### D3.7 Research Cell Head / Research Ethics Committee Chair
- **Accountable to:** Principal/Academic Council.
- **Accountable for:** Research strategy, grants, ethics review, publications, data integrity.
- **Visitor-facing:** Protects research participants; informed consent; community engagement.
- **Internal-facing:** Ethics review timelines; grant management; plagiarism checks; research budget (Act requires a defined share of annual budget) **[Law]**.
- **KPIs:** Ethics review turnaround; funded projects; publications; protocol deviations; participant complaints.

#### D3.8 Chief Librarian
- **Accountable to:** Vice-Principal (Academic).
- **Accountable for:** Library services, digital resources, information literacy, archives.
- **Visitor-facing:** Student and faculty access; quiet study; accessibility.
- **Internal-facing:** Collection development; subscriptions; cataloguing; usage analytics.
- **KPIs:** Usage; resource availability; query resolution; budget utilisation.

### D4. Hospital clinical and support roles

#### D4.1 Emergency Department Head
- **Accountable to:** Medical Director.
- **Accountable for:** 24/7 emergency service, triage, resuscitation, disaster response, referral coordination.
- **Visitor-facing:** First clinical contact for emergencies; triage transparency; waiting-area communication; ambulance handover.
- **Internal-facing:** Roster; protocols; equipment readiness; trauma team activation; documentation.
- **KPIs:** Door-to-doctor time; triage accuracy; resuscitation outcomes; left-without-being-seen rate; ambulance turnaround.

#### D4.2 ICU/CCU/HDU Head
- **Accountable to:** Medical Director.
- **Accountable for:** Critical care protocols, bed allocation, infection control, family communication.
- **Visitor-facing:** Structured family briefings; visiting policy; consent for procedures.
- **Internal-facing:** Intensivist roster; ventilator management; antibiotic stewardship; transfer criteria.
- **KPIs:** VAP/CLABSI/CAUTI rates; mortality; readmission; bed utilisation; family satisfaction.

#### D4.3 OT Complex Manager / Head of Anaesthesia
- **Accountable to:** Medical Director/Hospital Director.
- **Accountable for:** OT scheduling, sterility, equipment, implant traceability, surgical safety checklist.
- **Visitor-facing:** Pre-operative counselling; waiting-area updates; post-operative information.
- **Internal-facing:** Utilization; on-time starts; cancellation rate; CSSD coordination; fire and gas safety.
- **KPIs:** First-case on-time start; cancellation rate; surgical site infection; checklist compliance; turnover time.

#### D4.4 Laboratory Manager
- **Accountable to:** Diagnostics Manager/Medical Director.
- **Accountable for:** Test menu, quality control, turnaround, critical-value reporting, biosafety.
- **Visitor-facing:** Sample collection experience; report delivery; price transparency.
- **Internal-facing:** EQAS, calibration, SOPs, staff competency, inventory.
- **KPIs:** TAT; error rate; critical-value notification; EQAS performance; contamination rate.

#### D4.5 Radiology Manager / Radiation Safety Officer
- **Accountable to:** Diagnostics Manager; RSO to Atomic Energy Commission.
- **Accountable for:** Imaging services, radiation safety, equipment QA, reporting turnaround.
- **Visitor-facing:** Appointment scheduling; preparation instructions; report delivery; pregnancy screening.
- **Internal-facing:** Licence compliance; TLD monitoring; shielding; downtime management.
- **KPIs:** TAT; repeat rate; radiation dose; licence compliance; equipment uptime.

#### D4.6 Blood Bank / Transfusion Officer
- **Accountable to:** Medical Director; licensed by DGDA.
- **Accountable for:** Donor selection, testing, storage, cross-match, transfusion reactions, cold chain.
- **Visitor-facing:** Donor experience; blood availability information; transfusion consent.
- **Internal-facing:** Inventory; traceability; haemovigilance; SOP compliance.
- **KPIs:** Discard rate; cold-chain compliance; reaction rate; donor retention.

#### D4.7 Pharmacy Manager / Clinical Pharmacist
- **Accountable to:** Hospital Director; DGDA for licence.
- **Accountable for:** Formulary, procurement, storage, dispensing, narcotics control, adverse drug reaction reporting, antimicrobial stewardship.
- **Visitor-facing:** Clear pricing; counselling; wait time; return policy.
- **Internal-facing:** Stock accuracy; expiry control; P&T committee; prescription audit.
- **KPIs:** Stock-out rate; dispensing error; ADR reporting; expiry write-off; counselling coverage.

#### D4.8 Medical Records / Health Information Manager
- **Accountable to:** Hospital Director/Medical Director.
- **Accountable for:** Patient records, coding, statistics, confidentiality, retention, DHIS2 returns.
- **Visitor-facing:** Copy-of-record service; correction requests; privacy.
- **Internal-facing:** Completeness audits; ICD coding; monthly statistics; data-sharing.
- **KPIs:** Record completeness; coding accuracy; release turnaround; breach incidents.

#### D4.9 Support Services Manager (Housekeeping, Laundry, CSSD, Dietetics, Mortuary, Transport)
- **Accountable to:** Hospital Director.
- **Accountable for:** Cleanliness, linen, sterile supply, food safety, mortuary, ambulance fleet.
- **Visitor-facing:** Clean wards and toilets; linen quality; food; mortuary process with dignity; ambulance response.
- **Internal-facing:** Contracts; rosters; audits; cold chain for food; mortuary register.
- **KPIs:** Cleaning audit score; linen availability; CSSD sterility; food complaints; ambulance response time.

#### D4.10 Security & Safety Manager
- **Accountable to:** Hospital Director.
- **Accountable for:** Access control, visitor management, crowd control, fire safety, disaster preparedness, CCTV, incident response.
- **Visitor-facing:** Gate management; visitor passes; lost-and-found; emergency evacuation.
- **Internal-facing:** Drills; guard rosters; incident logs; coordination with police.
- **KPIs:** Drill frequency; unauthorized access incidents; response time; CCTV uptime.

#### D4.11 Legal Advisor / Medico-legal Officer
- **Accountable to:** Principal/CEO.
- **Accountable for:** Contracts, licences, medico-legal cases, consumer complaints, insurance claims, regulatory notices.
- **Visitor-facing:** Explains patients' rights and complaint routes; handles legal notices with dignity.
- **Internal-facing:** Contract review; staff legal training; incident documentation; liaison with MRA/police/courts.
- **KPIs:** Case cycle time; contract review turnaround; claims settled; regulatory notices answered on time.

#### D4.12 Internal Auditor / Compliance Officer
- **Accountable to:** Audit & Risk Committee (functional) and Principal (administrative).
- **Accountable for:** Internal audit, compliance monitoring, whistleblowing, follow-up of external audit findings.
- **Visitor-facing:** Audits free-bed entitlement and billing fairness.
- **Internal-facing:** Risk-based audit plan; investigations; report to committee.
- **KPIs:** Audit plan completion; findings closed; fraud cases; compliance training.

---

## Part E — Visitor / patient experience blueprint

### E1. The visitor promise (publish this)

| Promise | Standard | Owner |
|---|---|---|
| Find your way | Directional signage at every decision point; help desk within 2 minutes of entry | Front Office Manager |
| Know the cost | Written estimate before any procedure; itemised bill; no surprise charges | Finance Director |
| Be seen on time | OPD consultation within 30 minutes of appointment slot; emergency triage within 5 minutes | Hospital Director |
| Understand your care | Diagnosis, plan and discharge instructions explained in Bangla; written copy | Treating consultant + Nursing |
| Complain and be heard | Complaint acknowledged same day; resolved within 7 working days; escalation number published | Patient Experience Manager |
| Be treated with dignity | Privacy screens, same-sex attendants where requested, interpreter, no discrimination | Nursing Director |
| Emergency never refused | Stabilise first; referral only after stabilisation; free emergency care for the poor | Medical Director |
| Free beds are real | 10% beds visibly designated and audited monthly | Hospital Director |

### E2. Outpatient journey — touchpoints and owners

| Step | Touchpoint | Owner | Failure mode to design out |
|---|---|---|---|
| 1 | Gate / security | Security Manager | Long queues, no shade, no information |
| 2 | Help desk / wayfinding | Front Office | Visitor cannot find OPD |
| 3 | Registration & unique ID | Front Office | Duplicate records, wrong demographics |
| 4 | Triage (if needed) | Nursing | Sick patient waits in general queue |
| 5 | Consultation | Department Head | No consultant, no notice |
| 6 | Diagnostics | Diagnostics Manager | Sample lost, report delayed |
| 7 | Pharmacy | Pharmacy Manager | Stock-out, unclear price |
| 8 | Billing & payment | Finance | Queue, unclear items, no receipt |
| 9 | Follow-up scheduling | Front Office | No reminder, no continuity |
| 10 | Feedback / grievance | Patient Experience | No closure loop |

### E3. Inpatient journey — touchpoints and owners

| Step | Touchpoint | Owner | Design control |
|---|---|---|---|
| 1 | Admission decision & bed allocation | Medical Director + Nursing | Bed management board; no corridor beds |
| 2 | Consent & financial counselling | Treating consultant + Finance | Documented consent; estimate |
| 3 | Ward admission & orientation | Ward In-charge | Patient charter; visitor rules; valuables |
| 4 | Daily clinical review | Consultant | Documented plan; family briefing time |
| 5 | Procedures / OT | OT Manager | WHO surgical safety checklist |
| 6 | Medication administration | Nursing + Pharmacy | Barcode/dual check; ADR reporting |
| 7 | Infection prevention | IPC Lead | Isolation; hand hygiene; surveillance |
| 8 | Discharge planning | Consultant + Nursing + Social worker | Discharge summary; follow-up; transport |
| 9 | Billing & clearance | Finance | Itemised final bill; refunds |
| 10 | Post-discharge follow-up | Front Office/Telehealth | Call-back; readmission flag |

### E4. Visitor management standards

- **Visiting hours** published in Bangla and English at every ward; enforced by security, not by nurses.
- **One attendant pass per patient**; additional visitors by pass only; ICU visiting by appointment.
- **Visitor code of conduct** (no smoking, no food in wards, hand hygiene, no photography) displayed and enforced.
- **Vulnerable visitor protocol**: children, elderly, persons with disability, non-Bengali speakers — escort and interpreter.
- **Bereavement and mortuary protocol**: single point of contact, dignity, documentation, police/medico-legal interface.
- **Complaint and feedback**: paper forms, QR code, hotline, WhatsApp, and a visible escalation matrix; all logged in one register.

### E5. Emergency and disaster visitor flow

```
Ambulance / walk-in → Triage (red/amber/green) → Resuscitation → Registration (can be after stabilisation)
   → Diagnostics (point-of-care) → Decision (admit / OT / refer) → Family information desk → Documentation
```
- **Never refuse emergency care**; stabilise before referral.
- **Disaster plan** with triage tents, extra oxygen, blood, security, and a public information point.
- **Fire evacuation** with ward-specific routes, fire marshal per shift, and drills at least twice a year.

---

## Part F — Employee, faculty and student experience blueprint

### F1. Employee lifecycle and owners

| Stage | Activities | Owner | Records |
|---|---|---|---|
| Workforce plan | Establishment, sanction, budget | HR + Finance | Sanctioned post list |
| Recruitment | Advertisement, shortlist, interview, credential check | HR + Department Head | Selection file |
| Credentialing | Degree, BMDC registration, experience, licence verification | Medical Director/HR | Credential file |
| Appointment | Offer, service rules, joining | HR | Appointment letter |
| Onboarding | Orientation, fire safety, IPC, HIS training, code of conduct | HR + Quality + IPC | Training record |
| Rostering | Duty roster, on-call, leave plan | Department Head/Nursing | Roster |
| Teaching assignment | Lectures, practicals, ward teaching, exam duties | Department Head | Workload record |
| Appraisal | Annual performance, teaching, research, clinical | Department Head + Principal | Appraisal form |
| Promotion | University/BMDC criteria, publication, experience | Academic Council | Promotion file |
| Payroll & benefits | Salary, PF, gratuity, insurance | Finance/HR | Payroll register |
| Development | CME, workshops, conferences, higher study | MEU/HR | CPD portfolio |
| Discipline | Show-cause, inquiry, penalty | HR/Discipline Committee | Disciplinary file |
| Exit | Resignation, clearance, final settlement, exit interview | HR | Exit file |

### F2. Faculty workload and accountability model

| Faculty role | Teaching | Clinical | Research | Admin |
|---|---|---|---|---|
| Professor/Head | 8–12 hours/week + ward teaching | Specialty sessions, OPD, on-call | Lead research | Department leadership |
| Associate Professor | 10–14 hours/week | OPD, ward, OT | Active research | Module lead |
| Assistant Professor | 12–16 hours/week | OPD, ward, on-call | Research participation | Class teacher |
| Lecturer/Demonstrator | 16–20 hours/week | Supervised clinical | Assist research | Tutorials, practicals |
| Resident/Registrar (hospital) | Teaching juniors | 24/7 roster | Case reports | Documentation |

> These are planning assumptions; the binding numbers come from BMDC's *Criteria and Standards* and the affiliating university's workload rules **[Verify]**.

### F3. Student lifecycle and owners

| Stage | Activities | Owner | Records |
|---|---|---|---|
| Admission | Merit list, verification, seat allocation, free seats | Admission Committee/Registrar | Admission file |
| Orientation | Curriculum, code of conduct, mentoring, safety | Dean of Students | Orientation record |
| Registration | University registration, BMDC tracking | Registrar | Student register |
| Teaching | Integrated modules, lectures, practicals, ward placement | Phase Coordinator | Attendance, logbook |
| Assessment | Formative, summative, OSCE, workplace-based | MEU/Department | Assessment blueprint |
| Examination | Question setting, moderation, invigilation, tabulation | Controller of Examinations | Exam file |
| Progression | Promotion, remediation, repeat | Academic Council | Result file |
| Internship | Rotations, supervision, logbook | Internship Coordinator | Logbook |
| Registration | BMDC registration after graduation | Registrar | Registration file |
| Alumni | Tracking, feedback, CME | Alumni Cell | Alumni register |

### F4. Class teacher / mentor operating standard

- **One class teacher per cohort** (typically 50–100 students), with a co-teacher.
- **Weekly 30-minute mentor slot**; monthly attendance and progress review; documented.
- **Early-warning triggers**: attendance <75%, two consecutive poor formative scores, repeated absence, mental-health concern, financial distress.
- **Escalation path**: Class Teacher → Phase Coordinator → Dean of Students → Principal → Counselling/Medical support.
- **Confidentiality**: academic and personal records separated; only need-to-know access.
- **Parent/guardian communication**: scheduled twice a year plus exception-based; never public ranking.

### F5. Examination controller operating standard

| Control | Standard |
|---|---|
| Question paper security | Two-person custody; sealed envelopes; log of movement; no digital copies on personal devices |
| Moderation | Every paper moderated by a second senior faculty; blueprint check |
| Invigilation | Roster published 7 days ahead; identity checks; seating plan |
| Script handling | Barcode anonymisation; central script room; chain of custody |
| Tabulation | Double entry; independent verification; controller sign-off |
| Results | Published within university timeline; grace/moderation rules applied transparently |
| Re-scrutiny/appeal | Window published; fee; disposal within 30 days |
| Malpractice | Immediate report; inquiry committee; student rights respected |
| Records | Retained per university rules; secure archive |

### F6. Internal communication and employee voice

- **Daily 15-minute operations huddle** (Hospital Director, Nursing, Admissions, OT, Emergency, Diagnostics).
- **Monthly staff town hall** with performance and safety data.
- **Quarterly faculty meeting** with curriculum and assessment issues.
- **Anonymous speak-up channel** with a closed-loop response.
- **Notice boards and intranet** in Bangla and English; roster and circulars in one place.
- **Recognition scheme** for teaching excellence, patient-safety champions and long service.

---

## Part G — Global benchmarking

### G1. What mature systems actually maintain

| Country / system | Accreditation & standards | Governance model | What Bangladesh can borrow |
|---|---|---|---|
| **United Kingdom (NHS)** | GMC for doctors; Medical Schools Council; CQC for hospitals; NICE guidance; ACHS-style quality | Trust Board: non-executive chair + NEDs + executive directors (CEO, Medical Director, Chief Nurse, Finance Director); clinical governance committees; foundation trust model | Board skills matrix; clinical governance; patient-safety incident reporting; medical revalidation; "duty of candour" |
| **United States** | LCME accredits medical schools; ACGME for residencies; JCI for hospitals; CMS conditions of participation; HIPAA | University-owned or non-profit board; dean + hospital CEO; graduate medical education committee | Competency-based education; simulation; resident duty-hour rules; quality measurement; patient rights |
| **Canada** | CACMS; CanMEDS competency framework; provincial colleges | University faculty of medicine + affiliated teaching hospitals; board with community members | CanMEDS roles (medical expert, communicator, collaborator, leader, health advocate, scholar, professional) |
| **Australia** | AMC accredits schools and assesses IMGs; ACHS/ACHSI hospital accreditation; NSQHS standards | Hospital board + executive; clinical governance; consumer representatives | National Safety and Quality Health Service standards; consumer partnership; open disclosure |
| **Japan** | JACME; national medical licensing; hospital accreditation (JCQHC) | University hospital + regional medical bureau; strong research mission | Research integration; regional coordination; long-term care interface |
| **South Korea** | KIMEE; Korean Institute for Healthcare Accreditation (KOIHA) | University hospital; government-run accreditation; strong IT | Hospital accreditation standards; EMR maturity; national health insurance data |
| **Singapore** | Medical registration; JCI and local licensing; cluster model (SingHealth, NUHS, NHG) | Cluster board + hospital CEO; strong central IT | Cluster governance; integrated care; digital health; manpower planning |
| **Malaysia** | MMC; MQA; MSQH hospital accreditation; JCI in private sector | Ministry/university boards; private hospital boards | MSQH-style standards; private-public split; medical school accreditation |
| **India** | NMC (medical schools, curriculum, licensing); NABH hospital accreditation; NAAC for universities | University/trust boards; dean/principal; hospital medical superintendent | NABH standards; "Kayakalp" cleanliness; digital health mission; district hospital teaching |
| **Thailand** | IMEAc (WFME-recognised); HA hospital accreditation; Medical Council | University hospital; Ministry of Public Health; hospital boards | HA standards; universal coverage purchasing; faculty development |
| **Sri Lanka / Nepal** | Medical Council; university grants commission; emerging accreditation | University + Ministry; teaching hospital | Low-cost quality systems; district hospital teaching |

### G2. The "fast country" operating habits

1. **Published standards and public reporting.** Accreditation standards, hospital performance and inspection results are public. Bangladesh's BMEAC Act already provides the legal basis; the missing piece is publication.
2. **Competency-based curriculum with blueprint assessment.** CanMEDS/ACGME-style roles, OSCEs, workplace-based assessment, logbooks. Bangladesh's MBBS Curriculum 2021 is competency-based; the gap is assessment capacity and faculty training.
3. **Clinical governance as a management system.** Mortality review, incident reporting, antibiotic stewardship, clinical audit cycles — with named owners and board reporting.
4. **Digital maturity.** One patient ID, EMR, e-prescribing, PACS, dashboards, patient portal. HIMSS EMRAM-style staging gives a roadmap. Bangladesh has DHIS2 and a digital health strategy; private hospitals lag in EMR adoption.
5. **Workforce planning and credentialing.** Revalidation, CPD requirements, credentialing committees. Bangladesh has BMDC registration but weak revalidation and CPD enforcement.
6. **Patient and family partnership.** Charters, shared decision-making, complaint closure, interpreter services, consumer representation on boards.
7. **Simulation and skills labs.** Mandatory in the 2022 Act; mature systems run them as assessed curricula, not showpieces.
8. **Research and innovation.** Protected research time, ethics committees, grant offices, biobanks. The 2022 Act requires a research budget share; the gap is research infrastructure.
9. **Financial transparency and cost control.** Activity-based costing, revenue-cycle management, internal audit. Bangladeshi private hospitals often lack costing discipline.
10. **Emergency and disaster readiness.** Mass-casualty plans, drills, oxygen resilience, blood supply. COVID-19 exposed gaps; design for surge capacity.

### G3. Benchmark standards to adopt voluntarily

| Standard | Use |
|---|---|
| WFME Global Standards for Basic Medical Education (2020) | Self-assessment framework for the college; aligns BMEAC criteria |
| JCI Hospital Standards (8th edition, 2025) | Patient safety, governance, facility, medication, infection control |
| ACHS/NSQHS (Australia) | Clinical governance and consumer partnership |
| ISO 15189 | Laboratory quality and competence |
| ISO 45001 / fire codes | Occupational and fire safety |
| HIMSS EMRAM | Digital maturity staging |
| CanMEDS / ACGME | Competency and residency training design |

---

## Part H — Gap analysis, roadmap, KPIs and risk

### H1. Typical gaps in Bangladeshi private medical college hospitals

| Domain | Typical gap | Consequence | Design fix |
|---|---|---|---|
| Governance | Promoter dominates; Governing Body meets irregularly; no minutes | No accountability; regulatory risk | Board charter, calendar, minutes, conflict register |
| Academic | Part-time faculty >25%; vacant professor posts; weak assessment | Poor graduate quality; accreditation failure | Establishment plan; full-time recruitment; MEU; assessment blueprint |
| Clinical governance | No M&M; no incident reporting; no credentialing | Preventable harm; medico-legal exposure | Medical Director; committees; incident system |
| Patient experience | No owner of OPD journey; unclear billing; weak complaints | Reputation loss; consumer cases | Front Office Manager; charter; single complaint register |
| Compliance | Licences scattered; renewals missed; fire/waste gaps | Closure risk; penalties | Compliance calendar; document register; single owner |
| Digital | Paper records; siloed systems; no unique ID | No data; no quality measurement | HIS/EMR; unique ID; dashboard |
| Workforce | No HR plan; ad-hoc hiring; no appraisal | Attrition; incompetence | HR Director; workforce plan; credentialing |
| Research | No ethics committee; no budget line | Weak academic standing | Research Cell; ethics committee; budget |
| Emergency | No triage protocol; no disaster plan | Avoidable deaths | ED Head; protocols; drills |
| Free beds | Not designated; not audited | Breach of Act; public criticism | 10% designation; monthly audit; public notice |

### H2. Phased roadmap

**Phase 0 — 0–100 days (stabilise and comply)**
- Constitute Governing Body with charter, conflict register and meeting calendar.
- Appoint Principal/CEO, Hospital Director, Medical Director, Nursing Director, Finance Director, HR Manager, Quality Director.
- Constitute the four statutory committees and the Medical Advisory Committee.
- Complete licence inventory: hospital, pharmacy, blood bank, radiology, fire, environment, waste, trade.
- Publish patient charter, visiting hours, complaint hotline and free-bed notice.
- Start daily operations huddle and monthly M&M.
- Baseline KPIs and incident reporting.

**Phase 1 — 3–12 months (build the system)**
- Workforce plan and establishment sanction; close >25% part-time exposure.
- Academic calendar, module plans, assessment blueprint, question bank.
- Credentialing and privileging policy; clinical protocols for top 20 conditions.
- HIS/EMR go-live for registration, OPD, IPD, pharmacy, billing; unique patient ID.
- IPC programme with surveillance and hand-hygiene audits.
- Fire and disaster drills; oxygen and power resilience.
- Internal audit plan; finance manual; procurement policy.
- Student mentoring and class-teacher system; counselling service.

**Phase 2 — 1–3 years (quality and accreditation)**
- BMEAC self-assessment against WFME-aligned standards; gap closure plan.
- Clinical audit cycles; patient-safety culture survey; complaint trend reduction.
- Faculty development programme; research ethics committee; grant office.
- Digital maturity: e-prescribing, PACS, patient portal, dashboards, DHIS2 automation.
- Teaching hospital expansion to meet bed and occupancy requirements; field-site MoUs.
- Accreditation application; pre-survey; formal survey; certificate.

**Phase 3 — 3–5 years (excellence and international standing)**
- International partnerships; elective and exchange programmes.
- Simulation centre; skills assessment; faculty fellowships.
- Research output and ethics compliance; publications.
- ISO 15189 laboratory accreditation; JCI/ACHS readiness if desired.
- Public reporting and community engagement.

### H3. KPI dashboard (minimum set)

| Domain | KPI | Target (design) | Owner |
|---|---|---|---|
| Access | OPD waiting time | ≤30 min | Hospital Director |
| Access | Emergency door-to-doctor | ≤5 min (red), ≤30 min (green) | ED Head |
| Quality | Hospital-acquired infection rate | Downward trend | IPC Lead |
| Quality | Surgical safety checklist compliance | ≥95% | OT Manager |
| Quality | Medication error reporting | 100% reported, 100% reviewed | Nursing/Pharmacy |
| Safety | Incident reports per 1,000 patient days | ≥5 (reporting culture) | Quality Director |
| Safety | Fire drill completion | 2/year | Safety Manager |
| Patient | Complaint closure within 7 days | ≥90% | Patient Experience |
| Patient | Patient satisfaction (NPS) | ≥50 | Patient Experience |
| Academic | Faculty vacancy rate | ≤10% | HR/Principal |
| Academic | Part-time faculty share | ≤25% | Principal |
| Academic | On-time result publication | 100% | Controller of Exams |
| Academic | Student attendance | ≥80% average | Dean of Students |
| Academic | Pass rate | ≥90% | Academic Council |
| Financial | Budget variance | ±5% | Finance Director |
| Financial | Audit findings closed in 90 days | 100% | Internal Audit |
| Compliance | Licence renewals on time | 100% | Compliance Officer |
| Compliance | Free-bed utilisation | ≥10% of beds | Hospital Director |
| Digital | HIS uptime | ≥99.5% | IT Manager |
| Workforce | Attrition (annual) | ≤15% | HR |

### H4. Risk register (top 12)

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| 1 | Academic approval delayed/refused | Medium | High | Pre-application gap audit; legal counsel; complete evidence file | Principal |
| 2 | Accreditation failure | Medium | High | Self-assessment; mock survey; quality team | Quality Director |
| 3 | Faculty shortage / >25% part-time | High | High | Recruitment plan; retention; visiting faculty within cap | HR/Principal |
| 4 | Hospital licence lapse | Low | High | Compliance calendar; single owner; early renewal | Hospital Director |
| 5 | Fire or disaster incident | Medium | High | NOC; drills; equipment; evacuation plan | Safety Manager |
| 6 | Medical waste/environment breach | Medium | Medium | Contracts; segregation audits; DoE compliance | IPC/Facilities |
| 7 | Medico-legal/consumer case surge | Medium | High | Documentation; consent; grievance closure; legal advisor | Legal |
| 8 | Data breach / cyber incident | Medium | High | Access control; backup; incident response; training | IT Manager |
| 9 | Free-bed non-compliance | Medium | High | Designated beds; monthly audit; public notice | Hospital Director |
| 10 | Financial distress / cash flow | Medium | High | Budget discipline; reserved fund; costing; internal audit | Finance Director |
| 11 | Patient experience failure (waiting, billing) | High | Medium | Front office owner; charter; queue design; digital payments | Patient Experience |
| 12 | Governance conflict / related-party transactions | Medium | High | Conflict register; recusal; audit committee | GB Chair |

---

## Part I — Appendices

### I1. Document register (minimum)

| Category | Documents |
|---|---|
| Governance | Trust deed, GB charter, GB minutes, conflict register, delegation matrix |
| Regulatory | Hospital licence, trade licence, fire NOC, environment clearance, waste authorization, drug licence, blood bank licence, radiation licence |
| Academic | Academic approval, affiliation letter, curriculum, module plans, assessment blueprint, question bank policy, result files |
| Clinical | Clinical protocols, credentialing files, consent forms, M&M minutes, incident reports, IPC surveillance |
| HR | Service rules, establishment list, credential files, appraisal forms, training records, disciplinary files |
| Finance | Budget, audited accounts, reserved fund statement, procurement files, payroll register |
| Quality | Quality manual, SOPs, audit reports, patient feedback, accreditation self-assessment |
| Legal | Contracts, MoUs, medico-legal files, insurance policies |

### I2. RACI for the top ten decisions

| Decision | Accountable | Responsible | Consulted | Informed |
|---|---|---|---|---|
| Annual budget | GB | Finance Director | Principal, Hospital Director, Department Heads | GB |
| Faculty appointment | GB/University | Principal/HR | Academic Council, BMDC | GB |
| Clinical protocol approval | Medical Director | Clinical Heads | Medical Advisory Committee | Hospital Director |
| Hospital licence renewal | Hospital Director | Compliance Officer | DGHS | GB |
| Accreditation application | Principal | Quality Director | BMEAC, University | GB |
| Fee structure | GB | Finance Director | BMDC, Government | Students, Parents |
| Capital purchase > threshold | GB | Finance Director | Procurement Committee | GB |
| Serious incident response | Medical Director | Quality Director | Legal, Nursing, IPC | GB |
| New programme/course | GB/University | Principal | BMDC, BMEAC | GB |
| Free-bed policy | GB | Hospital Director | Medical Director, Community reps | Public |

### I3. Committee calendar (annual)

| Month | Committee | Output |
|---|---|---|
| January | GB + Finance | Annual budget, audit report |
| February | Academic Council | Academic calendar |
| March | Quality Control of Education | Curriculum review |
| April | Medical Advisory | Clinical governance plan |
| May | IPC | Surveillance report |
| June | GB | Half-year review |
| July | Admission Committee | Admission plan |
| August | Academic Council | Examination schedule |
| September | Finance | Budget revision, reserved fund statement |
| October | Quality | Accreditation self-assessment |
| November | GB | Annual report, next-year plan |
| December | Audit & Risk | Risk register review |

### I4. Space programme (planning model for 100 seats / 500 beds)

| Block | Space | Indicative sq ft |
|---|---|---|
| Academic | Lecture halls (2 × 150 seats), tutorial rooms, demonstration rooms | 25,000 |
| Academic | Anatomy, physiology, biochemistry, pharmacology, pathology, microbiology labs | 30,000 |
| Academic | Library and digital learning | 10,000 |
| Academic | Clinical skill lab and simulation | 10,000 |
| Academic | Faculty offices, department rooms, meeting rooms | 15,000 |
| Academic | Student common rooms, cafeteria, recreation | 10,000 |
| Hospital | OPD, registration, waiting | 25,000 |
| Hospital | Emergency and triage | 10,000 |
| Hospital | Wards (500 beds at ~120 sq ft/bed plus support) | 90,000 |
| Hospital | ICU/CCU/HDU/NICU | 15,000 |
| Hospital | OT complex (8–10 theatres) + CSSD | 20,000 |
| Hospital | Diagnostics (lab, imaging) | 15,000 |
| Hospital | Pharmacy and stores | 8,000 |
| Hospital | Administration and records | 12,000 |
| Hospital | Kitchen, laundry, mortuary, utilities | 20,000 |
| Residential | Hostels, staff quarters | 60,000 |
| **Total** | | **~365,000 sq ft** |

> The Act sets minimums (1,00,000 sq ft academic + 1,00,000 sq ft hospital for 50 seats) and requires proportional increase with seats and beds **[Law]**. The table above is a design model, not a statutory schedule.

### I5. Indicative staffing model (100 MBBS seats / 500 beds)

> Planning model only. Binding numbers come from BMDC's *Criteria and Standards*, the affiliating university's workload rules and the DGHS hospital licence conditions **[Verify]**. The 1:10 teacher–student ratio and the 25% part-time cap are statutory **[Law]**.

| Group | Role | Indicative strength | Basis |
|---|---|---|---|
| Governance | Governing Body members | 9–13 | Act: chair + ≥50% entrepreneurs + govt/university/DGME reps |
| Executive | Principal, Vice-Principals (2), Hospital Director, Medical Director, Nursing Director, Finance Director, HR Manager, Quality Director, IT Manager | 10 | One accountable owner per outcome |
| Academic admin | Registrar, Deputy Registrar, Controller of Examinations, Deputy Controller, Dean of Students, MEU Head, CSL Head, Research Cell Head, Librarian | 9 | Protected academic posts |
| Basic science faculty | Professors 8, Associate Professors 12, Assistant Professors 20, Lecturers/Demonstrators 24 | 64 | 8 basic departments; 1:10 ratio |
| Clinical faculty | Professors 20, Associate Professors 30, Assistant Professors 45, Registrars/Residents 60 | 155 | 17+ clinical departments; teaching + service |
| Nursing | Nursing Director, Matrons 6, Ward In-charges 30, Staff Nurses 350, Nursing Assistants 120 | 507 | 1 nurse per 6–8 beds + ICU 1:1–1:2 |
| Medical officers | Emergency, ICU, ward, OT | 45 | 24/7 coverage |
| Diagnostics | Lab technologists 25, radiology technologists 15, sonographers 6, phlebotomists 12 | 58 | Service volume |
| Pharmacy | Pharmacists 18, clinical pharmacist 2, store 6 | 26 | 24/7 dispensing |
| Front office | Registration 20, help desk 8, billing 14, insurance/TPA 4 | 46 | OPD volume |
| Support | Housekeeping 120, laundry 15, CSSD 12, dietetics 20, mortuary 4, transport 20 | 191 | Contract or in-house |
| Facilities | Engineers 6, biomedical 8, technicians 20 | 34 | Plant + equipment |
| IT | Manager, analysts 4, support 6 | 11 | HIS/EMR + network |
| HR / Finance / Legal | HR 8, accounts 14, internal audit 4, legal 3 | 29 | Corporate functions |
| Security | Manager, supervisors 6, guards 60 | 67 | 24/7 gates and wards |
| **Total (approx.)** | | **~1,250** | |

### I6. Visitor-facing service catalogue

| Service | Channel | Standard | Owner |
|---|---|---|---|
| Appointment booking | Phone, web, app, walk-in | Confirmed within 2 hours | Front Office |
| Report delivery | Counter, portal, SMS | Same day for routine; 2 hours for urgent | Diagnostics |
| Bill estimate | Counter, portal | Before procedure | Finance |
| Discharge summary | Printed + digital | Within 2 hours of discharge | Medical Records |
| Complaint | Hotline, QR, counter, WhatsApp | Acknowledged same day; closed in 7 days | Patient Experience |
| Medical record copy | Counter, portal | Within 3 working days | Medical Records |
| Ambulance | Hotline | Dispatch within 5 minutes | Support Services |
| Blood availability | Counter, hotline | Real-time status | Blood Bank |
| Interpreter | On request | Within 30 minutes | Front Office |
| Free-bed information | Notice board, help desk | Published and updated monthly | Hospital Director |
| Visitor pass | Security desk | Within 5 minutes | Security |
| Feedback result | Notice board, website | Quarterly public summary | Quality Director |

### I7. Sources consulted

1. *Private Medical College and Dental College Act, 2022* (Act No. 16 of 2022), Bangladesh Gazette, 7 September 2022 — DGME law page (PDF).
2. *Bangladesh Medical Education Accreditation Act, 2023* (Act No. 30 of 2023), Bangladesh Gazette, 18 September 2023 — DGME law page (PDF).
3. *Bangladesh Medical and Dental Council Act, 2010* (Act No. 61 of 2010) — DGME law page (PDF).
4. DGME, "Laws" page — https://dgme.gov.bd/pages/laws/
5. MEFWD, "Notices" page — https://mefwd.gov.bd/pages/notices/
6. WFME, "BME Recognition Programme" and "Countries served by agencies with Recognition Status" — https://wfme.org/recognition/bme-recognition/
7. WFME, "WFME Global Standards for Quality Improvement: Basic Medical Education" (2020).
8. DGHS, Hospital & Clinic Section — https://dghs.gov.bd/ (and old DGHS pages).
9. JCI, Hospital Standards (8th edition, effective 1 January 2025) — public summaries.
10. NHS trust board composition and clinical governance guidance — public trust websites.
11. AMC (Australia), ACHS/NSQHS standards; LCME/CACMS; CanMEDS; KIMEE; IMEAc; MMC/MQA/MSQH; NMC/NABH — public standards pages.
12. Bangladesh Digital Health Strategy 2023–2027 — public summaries.

### I8. Caveats and verification tasks

- **BMDC's *Criteria and Standards*** for medical colleges (teacher numbers, department-wise staffing, space norms) could not be retrieved because the BMDC website was under scheduled maintenance during this study. Obtain the current document and replace the planning assumptions in Part D/F.
- **The 2023 draft Rules** under the 2022 Act (Private Medical College and Dental College (Establishment and Operation) Rules, 2023) were in draft on the MEFWD notices page. Confirm whether they have been gazetted and apply the final text.
- **Hospital licensing standards** (bed categories, ICU/OT requirements, minimum manpower) are administered by the DGHS Hospital & Clinic Section; obtain the current checklist and licence form.
- **WFME status of BMEAC** should be confirmed directly with WFME before any public claim; the WFME country map listed BMEAC as an applicant at the time of retrieval.
- **Fire, environment and waste** requirements vary by city corporation and category; confirm with the local authority.
- **Fee and admission rules** change annually; use the latest MEFWD/DGME circular.

---

*This study is a design and governance document, not legal advice. Statutory requirements must be confirmed against the gazetted text and the affiliating university's ordinances before implementation.*
