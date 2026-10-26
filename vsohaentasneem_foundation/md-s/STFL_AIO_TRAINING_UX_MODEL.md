# STFL AIO — Live Contextual Training & User Experience Model

**System:** SohaelTasneem Foundation (STFL) Autonomous Enterprise Platform  
**Document Identity:** `STFL-DOC-2026-TRN-UX-V1`  
**Date:** 2026-10-15  
**Status:** SPECIFICATION — RATIFIED (SECTIONS 69, 70, 74, 75)  
**Security Level:** INTERNAL USE ONLY  

---

## 1. Executive Summary & Purpose

A major failure mode of traditional enterprise software is the disconnect between training environments and production software. Users sit through classroom or slide presentations, yet make severe operational mistakes when confronted with complex production forms weeks later. Conversely, intrusive popups or confusing tooltips often frustrate experienced officers.

The **STFL Live Contextual Training & User Experience Model** introduces an integrated, multimodal training interface operating across:
1. **Dedicated Learning Portals**: Immersive visual, video, and simulation courses for role and project onboarding.
2. **In-Workflow Contextual Walkthroughs ("Step 3 of 7")**: Non-disruptive, visual guidance overlays embedded directly inside live operational forms (e.g. lease creation, microfinance disbursement, patient intake).
3. **Interactive Simulation & Sandbox Modes**: Realistic dry-run forms where learners practice high-stakes transactions on synthetic demo data before receiving production clearance.
4. **Context-Aware AI Training Tutor**: On-demand sidecar assistant that explains field requirements, translates instructions into regional dialects, and provides instant visual demonstrations without navigating away.
5. **Constitutional Guardrails**: The training and tutorial layer can never bypass, manipulate, or fake backend 13-D authorization. If an action breaches regulatory limits, the training overlay immediately converts into an immutable compliance block (`STOP / REVIEW REQUIRED`).

---

## 2. In-Workflow Contextual Walkthrough Architecture (Section 75)

When a field worker, tenant, or operational officer initiates an unfamiliar or high-stakes workflow, the system can dynamically render a structured, step-by-step contextual companion:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STFL AIO — OPERATIONAL COCKPIT: CREATE COMMERCIAL LEASE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ Step 3 of 7: Rental Terms & Security Deposit ]                           │
│                                                                             │
│  ┌───────────────────────────────┐  ┌────────────────────────────────────┐  │
│  │   FORM INPUTS                 │  │   LIVE CONTEXTUAL TRAINING PANEL   │  │
│  │                               │  │                                    │  │
│  │  Monthly Rent (BDT):          │  │  ┌──────────────────────────────┐  │  │
│  │  [ 45,000                   ] │  │  │ [GRAPHICAL / PICTORIAL STEP] │  │  │
│  │                               │  │  │  Diagram: Minimum Base Rate  │  │  │
│  │  Security Deposit (Months):   │  │  │  vs Commercial Category C    │  │  │
│  │  [ 3                        ] │  │  └──────────────────────────────┘  │  │
│  │                               │  │                                    │  │
│  │  Payment Due Day:             │  │  💡 WHY THIS MATTERS:              │  │
│  │  [ 5th of Month             ] │  │  Rent must match the approved   │  │
│  │                               │  │  valuation rate to prevent tax  │  │
│  │  Utility Escrow:              │  │  audit disqualification.        │  │
│  │  [X] Included in Base         │  │                                    │  │
│  │                               │  │  ⚖️ LEGAL / POLICY NOTICE:         │  │
│  │                               │  │  Section 14(b) Premises Rent   │  │
│  │                               │  │  Act 1991: Advance deposit      │  │
│  │                               │  │  capped at 3 calendar months.   │  │
│  │                               │  │                                    │  │
│  │  [ SAVE DRAFT ]  [ CONTINUE ] │  │  [ WATCH 30s CLIP ] [ ASK AI ]     │  │
│  └───────────────────────────────┘  └────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 The Dynamic Compliance Intercept
If a user enters an input that violates policy or statutory limits (e.g. entering a security deposit of 6 months when statutory ceiling is 3 months):
1. **Instant Form Validation**: Form turns red with inline error message.
2. **Contextual Training Alert**: The training panel immediately shifts to:
   ```
   🛑 STOP / REVIEW REQUIRED
   CRITICAL COMPLIANCE BREACH:
   Security Deposit of 6 months violates Section 14(b) Premises Rent Act.
   Maximum permitted deposit is 3 months (135,000 BDT).
   
   Resolution Options:
   1. Adjust deposit to <= 3 months.
   2. Request Special Board Exemption (Requires Form L-09).
   ```
3. **API Submission Lock**: The `[ CONTINUE ]` button is completely disabled; the backend rejects any forged bypass with HTTP 422 / 403.

---

## 3. Responsive Multi-Device UX Specifications

The training UX is built to cater to vastly different hardware constraints across the enterprise:

### 3.1 Mobile Field Worker UX (Android Jetpack Compose)
- **High-Contrast, Touch-Optimized UI**: Minimum tap target size 48x48 dp; large visual icons from `iconoir-react` (or matching Android Vector Drawables).
- **Offline Pictorial Guide Cache**: Visual steps and audio narrations are stored locally in Room DB / Cache Storage. When field workers lose 4G connectivity in rural zones, visual step-by-step cards continue functioning without interruption.
- **Audio Walkthrough Integration**: Low-literacy or multilingual field workers can tap a speaker icon to hear the step explained in Bengali, Sylheti, or Chittagonian.
- **Biometric Practice Check**: Interactive touch simulations test the worker's ability to scan a beneficiary's QR code or fingerprint correctly before real disbursements.

### 3.2 Desktop Operational Cockpit (Next.js 15 + Tailwind CSS)
- **Collapsible Training Sidebar**: Experienced officers can collapse the training drawer into a minimalist icon dock, or pin it side-by-side during complex reconciliations.
- **Visual Flowcharts & Interactive Mermaid Diagrams**: Embedded SVG diagrams show where the current document sits within the larger multi-departmental lifecycle.
- **Interactive Checklist Drawer**: Operators tick off compliance prerequisites with real-time green checkmark state transitions.

---

## 4. AI Training Assistant Interaction Model (Section 74)

The platform embeds an interactive AI Training Assistant (`@stfl-tutor`) accessible via floating action drawer or voice interface:

### 4.1 Permitted Tutor Capabilities
- **Explain**: Simplifies institutional legal jargon into clear, actionable guidelines.
- **Translate**: Instantly converts guidance between English and regional Bengali dialects.
- **Demonstrate**: Generates visual step-by-step simulations highlighting form fields.
- **Simulate**: Spins up an interactive sandbox with dummy records for practice.
- **Quiz**: Prompts quick, non-graded check questions to reinforce learning retention.
- **Recommend**: Analyzes user's role and flags upcoming mandatory compliance refreshers.

### 4.2 Constitutional Tutor Guardrails
1. **Provenance Grounding**: The AI assistant answers exclusively from ratified articles in `knowledge_items`. It must display: `Source: SOP-FIN-002 v3.1 (Ratified 2026-09-01)`.
2. **No Speculative Advice**: If asked about an edge case not covered in ratified manuals, it must declare:
   `"This scenario is not defined in approved SOPs. Please submit an escalation ticket to your Unit Supervisor."`
3. **Zero Authority Bypass**: The AI tutor cannot alter form data on behalf of the user, grant bypass codes, or simulate approval signatures.

---

## 5. UI Design System Tokens & Component Standards

To maintain visual beauty and strict brand consistency across all four experience segments, the Training UX adheres to the following system tokens:

```css
/* STFL Training & Knowledge Design Tokens */
:root {
  /* Visual Experience Palette */
  --stfl-learn-primary: #1e3a8a;       /* Deep Institutional Navy */
  --stfl-learn-accent: #0284c7;        /* Vibrant Learning Sky Blue */
  --stfl-learn-success: #15803d;       /* Compliance Green */
  --stfl-learn-warning: #b45309;       /* Cautionary Amber */
  --stfl-learn-danger: #b91c1c;        /* Compliance Stop Red */
  --stfl-learn-card-bg: #ffffff;
  --stfl-learn-sidebar-bg: #f8fafc;
  
  /* Modern Typography */
  --stfl-font-display: 'Inter', -apple-system, sans-serif;
  --stfl-font-code: 'JetBrains Mono', monospace;
  
  /* Elevation & Borders */
  --stfl-learn-border-radius: 12px;
  --stfl-learn-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --stfl-learn-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --stfl-learn-shadow-glow: 0 0 15px rgba(2, 132, 199, 0.25);
}
```

### 5.1 Iconography Standards
All icons in the Web frontend **must** import exclusively from `iconoir-react`:
- Book/Course: `<Book />`, `<Page />`
- Visual/Media: `<Play />`, `<MediaVideo />`, `<Eye />`
- Assessment/Quiz: `<CheckCircle />`, `<TaskList />`, `<HelpCircle />`
- Compliance Stop: `<WarningTriangle />`, `<ShieldAlert />`
- Navigation: `<NavArrowRight />`, `<NavArrowLeft />`, `<Refresh />`

---

## 6. Summary of Training UX Guarantees

1. **Zero Context Switching**: Operational personnel learn and master procedures inside the live workflow without leaving their desks or toggling external PDF readers.
2. **Inclusive Accessibility**: Multilingual audio and pictorial cards ensure field workers with varying literacy levels operate safely and competently.
3. **Active Regulatory Protection**: Unlawful inputs trigger immediate visual warnings and prevent illegal database submissions.
4. **Grounded AI Assistance**: Training advice is always verifiably sourced from ratified institutional documentation.
