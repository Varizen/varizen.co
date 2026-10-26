# STFL Web Knowledge, Training & Moderation Architecture
**Institution:** SohaelTasneem Foundation  
**Version:** 2026.10.15  
**Knowledge Console:** `/admin/knowledge`  
**Status:** LOCKED & IMPLEMENTED  

---

## 1. The Four Dedicated Centers

The STFL Knowledge Architecture organizes operational learning, capacity building, and procedural support into four structured operational centers:

1. **User Learning Center (ব্যবহারকারী শিখন কেন্দ্র):**
   - For community members, volunteers, scholarship recipients, and project participants.
   - Public literacy guides, how-to-apply walkthroughs, verification tutorials.
2. **Service / Operations Center (সেবা ও মাঠ পরিচালনা কেন্দ্র):**
   - For field officers, healthcare assistants, and agricultural supervisors.
   - Standard Operating Procedures (SOPs), mobile data collection manuals, crisis response protocols.
3. **Administration / Governance Center (প্রশাসন ও পরিচালনা পরিষদ কেন্দ্র):**
   - For trustees, unit directors, executive managers, and financial controllers.
   - Budget allocation governance, board meeting protocols, statutory reporting procedures.
4. **Moderation & Relief Center (সহায়তা ও মডারেশন কেন্দ্র):**
   - Bounded queues for support tickets, content reviews, knowledge base maintenance, and human escalation.

---

## 2. Training Lifecycle & Pedagogical Method

All training modules are engineered to be **visual, pictorial, mobile-first, and fully bilingual (BN/EN)**:

```
OVERVIEW (Learning Objectives & Scope)
  ↓
VISUAL FLOW (Diagrammatic & Pictorial Schema)
  ↓
STEP-BY-STEP ACTION (Numbered, Illustrated Procedures)
  ↓
GUIDED PRACTICE (Simulated Form Submission in Sandbox)
  ↓
ASSESSMENT (Comprehension & Edge-Case Quiz)
  ↓
CERTIFICATION (Cryptographic Digital Certificate: STFL-CER-...)
```

---

## 3. Bounded Moderation Identities (Moderator A & Moderator B)

To maintain strict segregation of duties without overwhelming senior leadership, the platform implements two bounded moderation roles:

### Moderator A: Service Moderator (সেবা মডারেটর)
- **Scope:** Frontline user help, volunteer inquiries, public training questions, documentation clarifications.
- **Queues:** `USER_HELP`, `TRAINING_REVIEW`, `COMMUNITY_INQUIRIES`.

### Moderator B: Administrative Relief Moderator (প্রশাসনিক সহায়তা মডারেটর)
- **Scope:** Technical support, document re-indexing, content validation, preliminary compliance referrals.
- **Queues:** `CONTENT_REVIEW`, `DOCUMENT_SUPPORT`, `TECHNICAL_SUPPORT`, `ESCALATION`.

### Absolute Prohibitions for Moderators:
❌ **Never granted access to:**
- Core IAM (cannot assign or alter roles).
- Sensitive Financial Releases (cannot disburse funds or approve payments).
- Audit Controls (cannot disable, edit, or purge audit logs).
- Production Cloudflare / Database Infrastructure.

---

## 4. Knowledge Provenance & AI Grounding

The AI Training Assistant is strictly grounded in approved knowledge bases. When answers or guidelines are rendered in the UI, their provenance is surfaced with explicit badges:
- `VERIFIED SOURCE`: Tied directly to an approved government gazette or board-ratified document.
- `APPROVED KNOWLEDGE`: Published in the official STFL Field SOP Manual.
- `INTERNAL POLICY`: STFL Board of Trustees governance rule.
- `AI-GENERATED DRAFT`: Algorithmic summary requiring human operational review.
- `HUMAN REVIEWED`: Signed off by a designated department lead.
