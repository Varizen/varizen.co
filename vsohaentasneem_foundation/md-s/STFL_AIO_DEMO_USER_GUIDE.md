# STFL AIO — Live Demo Environment User Guide
**Document ID:** `STFL_AIO_DEMO_USER_GUIDE.md`  
**Phase:** Prompt 12.5 (Live Development Demo / Preview Environment)  
**Status:** IMPLEMENTED & LOCALLY VERIFIED  
**Production Verification Status:** PENDING

---

## 1. Introduction

Welcome to the **STFL AIO Live Demonstration & Preview Environment**. This guide provides stakeholders, engineers, auditors, and leadership with clear instructions to explore, test, and experience the governed capabilities of the STFL AIO platform in a safe, completely isolated sandbox.

---

## 2. Launching the Demo Locally

### Step 1: Ensure Local PostgreSQL is Running
Verify local PostgreSQL is accessible on port 5433 (default development instance):
```bash
# Verify connection
psql postgresql://stfl:stfl_dev_pw@127.0.0.1:5433/stfl -c "SELECT 1;"
```

### Step 2: Start the Backend API (Port 8787)
In a dedicated terminal:
```bash
cd apk/api
npm run dev
```
*The API will start listening on `http://localhost:8787/api/v1`.*

### Step 3: Start the Web Frontend (Port 3000)
In a second terminal:
```bash
cd apk/web
npm run dev
```
*The web interface will be available at `http://localhost:3000`.*

---

## 3. Accessing the Interactive Demo Lab

Open your modern web browser and navigate to:

👉 **`http://localhost:3000/demo`**

Alternatively, from the root landing page (`http://localhost:3000`), click the prominent **"Launch Live Demo Lab"** banner or select **"Demo Lab"** from the top right navigation in any console.

---

## 4. How to "View System As" (Switching Identities)

At the top of the Demo Lab, you will find the **Canonical Identity Selector** displaying all 13 STFL User Classes:

```
[ CLASS_00: Super Admin ]    [ CLASS_01: Trustee ]         [ CLASS_02: Executive ]
[ CLASS_03: Finance ]        [ CLASS_04: Property ]        [ CLASS_05: Microfinance ]
[ CLASS_06: Workforce ]      [ CLASS_07: Projects ]        [ CLASS_08: Records/Sec ]
[ CLASS_09: Field Worker ]   [ CLASS_10: AI Agent ]        [ CLASS_11: External Party ]
[ CLASS_12: Public User ]
```

### To switch your identity:
1. Click any class badge (e.g., **CLASS_03: Finance** or **CLASS_04: Property**).
2. The UI immediately activates the server-backed identity.
3. The **Active Session Identity Card** updates in real-time, detailing:
   - User Name & ID (e.g. `CA Farhan`, `STFL-DEMO-USR-003`)
   - Bound Device ID (e.g. `STFL-DEMO-DVC-003`)
   - Primary Operational Unit & Target Scope
   - Allowed Consoles list
   - Live Device Security State (`ACTIVE`)
4. Any navigation to the **16 Management Consoles** automatically respects this identity's authorization boundaries.

---

## 5. Guided Demonstration Scenarios

### Scenario A: 12-Dimensional Contextual Authorization in Action
Scroll down to the **12-Dimensional Authorization Simulator** on `/demo`.
- **Test 1 (Allowed Action):**
  - Select **CLASS_03: Finance**.
  - Choose Action: `finance.disburse`.
  - Amount: `৳ 25,000` (within limit).
  - Click **"Evaluate Authorization Decision"**.
  - **Result:** `ALLOW` (Valid class, unit, and policy).
- **Test 2 (Cross-Unit Scope Violation):**
  - Keep **CLASS_03: Finance** selected.
  - Choose Action: `property.lease.create`.
  - Click **"Evaluate Authorization Decision"**.
  - **Result:** `DENY` — *Explanation: "CLASS_03 Finance is outside assigned PROPERTY unit scope."*
- **Test 3 (Constitutional Super Admin SoD Guard):**
  - Select **CLASS_00: Super Admin**.
  - Choose Action: `finance.disburse`.
  - Click **"Evaluate Authorization Decision"**.
  - **Result:** `DENY` — *Explanation: "Super Admin cannot disburse funds (Anti-collusion / SoD invariant)."*

### Scenario B: Dynamic Party / Relationship Model vs User Accounts
Explore the **Party & Relationship Model** section:
- Observe that **Haji Abdul Gafur Trust** is a `LANDLORD` to Property `STFL-DEMO-PROP-001`.
- Observe that **Green Delta Agro Ltd.** is a `LESSEE` holding Commercial Lease `STFL-DEMO-LSE-001`.
- Observe that **Engr. Kamal Hossain** is an `EMPLOYEE` assigned to the Projects Unit.
- *Key Takeaway:* Roles are contextual dynamic relationships attached to specific resources, not hardcoded database user classes!

### Scenario C: Governed Document Lifecycle & Controlled Printing
Navigate to the **Governed Documents & Controlled Printing Showcase**:
1. Review document states: `ACTIVE`, `ISSUED`, `APPROVED`, `DRAFT`, `SUPERSEDED`, and `REVOKED`.
2. Notice the permanent legal disclaimer: **`DEMO — NOT A PRODUCTION DOCUMENT`**.
3. Click **"Request Controlled Print Token"**:
   - A short-lived (60s) single-use token is minted.
   - Click **"Simulate Print & Consume"**:
   - The token is atomically consumed.
   - The document renders with diagonal forensic watermark: **`STFL DEMO — NON-PRODUCTION`** and unique Copy ID.
   - Re-attempting to print with the same token is rejected (`HTTP 403`).

### Scenario D: Multi-Channel Governed Communications (Zero Egress)
Navigate to the **Governed Communications Gateway**:
1. Select Template: `TENANCY_RENT_DEMAND` or `MFI_REPAYMENT_REMINDER`.
2. Select Channel: `WhatsApp`, `SMS`, or `Email`.
3. Click **"Dispatch Governed Communication"**:
   - The gateway resolves authoritative variables and generates a SHA-256 anti-hallucination hash.
   - Dispatch is safely intercepted: `SIMULATED_LOCAL_ONLY` (0 real messages transmitted).
   - The preview box displays the formatted message body and anti-hallucination token.

### Scenario E: Autonomous Agent Runtime & Human Approval Escalation
Navigate to the **Autonomous Agent Runtime Sandbox**:
- **Test Level 3 Tool (Autonomous Execution):**
  - Agent: `FinBot Alpha` (`CLASS_10`).
  - Action: `fetch_ledger_entries`.
  - Confidence: `0.9920` (>= 0.9800).
  - Click **"Execute Governed Agent Task"**.
  - **Result:** `LEVEL 3 AUTONOMOUS ALLOW` — Execution succeeds within budget.
- **Test Level 4 Action (Human Approval Required):**
  - Change Action to: `execute_disbursement`.
  - Click **"Execute Governed Agent Task"**.
  - **Result:** `LEVEL 4 ESCALATE: HUMAN APPROVAL REQUIRED`.
  - The runtime creates an approval ticket requiring human sign-off (Constitutional Invariant).
- **Test Low Confidence Violation:**
  - Lower confidence slider to `0.9500`.
  - Click **"Execute Governed Agent Task"**.
  - **Result:** `CONFIDENCE ESCALATE` — Confidence 0.9500 is below the mandatory 0.9800 threshold.

### Scenario F: Exploring the 16 Governed Consoles
Click the links in the **Governed Consoles Directory** to visit any console:
- `/admin/iam` — User and device registry.
- `/admin/governance` — Trustee resolutions and approvals.
- `/admin/finance` — General ledger and disbursements.
- `/admin/property` — Waqf estates, units, and leases.
- `/admin/microfinance` — Shariah-compliant microfinance facilities.
- `/admin/documents` — Digital document archive.
- `/admin/agents` — Autonomous agent registry, tools, and budgets.
*(All consoles adapt in real-time based on your currently selected demo identity).*

### Scenario G: Resetting Demo Data
At the bottom of `/demo`, click **"Reset Demo Data"**:
1. The confirmation modal will appear.
2. Type **`CONFIRM_DEMO_RESET`** into the verification input.
3. Click **"Execute Safe Demo Reset"**.
4. The system clears and re-seeds all `STFL-DEMO-*` records while preserving complete production safety.
