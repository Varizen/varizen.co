"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  ShieldCheck,
  Bank,
  Building,
  PiggyBank,
  Group,
  ShoppingBag,
  Folder,
  Package,
  Page,
  Message,
  Lock,
  Cpu,
  Phone,
  Server,
  User,
  Check,
  WarningTriangle,
  InfoCircle,
  NavArrowRight,
  NavArrowDown,
  Refresh,
  Eye,
  Printer,
  Send,
  Trash,
  TaskList,
  Coins,
  StatsReport,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  XmarkCircle,
  ShieldAlert,
  BookStack,
  Bell,
  Search,
  Filter,
  Download,
  ShareAndroid,
  Globe,
  Settings,
} from "iconoir-react";
import {
  CONSOLES_CATALOG,
  evaluateClientConsoleAccess,
  CANONICAL_PROJECTS,
  MANAGEMENT_CLUSTERS,
  ProjectEntity,
  UserClass,
} from "../../lib/adminContext";

export type DemoSegment =
  | "overview"
  | "projects"
  | "operations"
  | "outcomes"
  | "finance"
  | "people"
  | "documents"
  | "compliance"
  | "governance"
  | "admin"
  | "security"
  | "agents"
  | "system";

export type DemoClass =
  | "CLASS_00"
  | "CLASS_01"
  | "CLASS_02"
  | "CLASS_03"
  | "CLASS_04"
  | "CLASS_05"
  | "CLASS_06"
  | "CLASS_07"
  | "CLASS_08"
  | "CLASS_09"
  | "CLASS_10"
  | "CLASS_11"
  | "CLASS_12";

export interface IdentityCard {
  code: DemoClass;
  userId: string;
  partyId?: string;
  nameEn: string;
  nameBn: string;
  role: string;
  unit: string;
  scope: string;
  titleEn: string;
  titleBn: string;
  deviceId: string;
  deviceState: "ACTIVE" | "PENDING" | "SUSPENDED" | "REVOKED";
  notesEn: string;
  notesBn: string;
  primaryConsole: string;
}

export const DEMO_IDENTITIES: IdentityCard[] = [
  {
    code: "CLASS_00",
    userId: "STFL-DEMO-USR-000000",
    nameEn: "Dr. Tariq Rahman",
    nameBn: "ড. তারিক রহমান",
    role: "SUPER_ADMIN",
    unit: "EXECUTIVE",
    scope: "ORGANIZATION:ALL",
    titleEn: "Super Administrator & Chief Systems Architect",
    titleBn: "সুপার অ্যাডমিনিস্ট্রেটর ও প্রধান সিস্টেম আর্কিটেক্ট",
    deviceId: "STFL-DEMO-DVC-000000",
    deviceState: "ACTIVE",
    notesEn: "Constitutional Separation of Duties: Barred from operational finance disbursements and property leases.",
    notesBn: "সাংবিধানিক দায়িত্ব পৃথকীকরণ: সরাসরি আর্থিক তহবিল বিতরণ বা সম্পত্তি ইজারা সৃষ্টিতে নিষিদ্ধ।",
    primaryConsole: "iam",
  },
  {
    code: "CLASS_01",
    userId: "STFL-DEMO-USR-000001",
    nameEn: "Begum Rokeya Chowdhury",
    nameBn: "বেগম রোকেয়া চৌধুরী",
    role: "TRUSTEE",
    unit: "GOVERNANCE",
    scope: "ORGANIZATION:GOVERNANCE",
    titleEn: "Board Trustee & Endowment Custodian",
    titleBn: "বোর্ড ট্রাস্টি ও স্থায়ী তহবিল অভিভাবক",
    deviceId: "STFL-DEMO-DVC-000001",
    deviceState: "ACTIVE",
    notesEn: "High-level endowment oversight, Board resolutions, and Level 5 dual-control approvals.",
    notesBn: "স্থায়ী তহবিল অভিভাবকত্ব, বোর্ড রেজোলিউশন ও লেভেল ৫ ডুয়াল-কন্ট্রোল অনুমোদন।",
    primaryConsole: "governance",
  },
  {
    code: "CLASS_02",
    userId: "STFL-DEMO-USR-000002",
    nameEn: "Kazi Anis Ahmed",
    nameBn: "কাজী আনিস আহমেদ",
    role: "EXECUTIVE_COMMAND",
    unit: "EXECUTIVE",
    scope: "ORGANIZATION:OPERATIONS",
    titleEn: "Chief Executive Officer & Operational Commander",
    titleBn: "প্রধান নির্বাহী কর্মকর্তা ও অপারেশনাল কমান্ডার",
    deviceId: "STFL-DEMO-DVC-000002",
    deviceState: "ACTIVE",
    notesEn: "Cross-unit operational coordination, humanitarian emergency declarations, strategic resource allocation.",
    notesBn: "আন্তঃবিভাগীয় কার্যক্রম সমন্বয়, মানবিক জরুরি অবস্থা ঘোষণা এবং কৌশলগত বরাদ্দ।",
    primaryConsole: "executive",
  },
  {
    code: "CLASS_03",
    userId: "STFL-DEMO-USR-000003",
    nameEn: "Farhana Huq",
    nameBn: "ফারহানা হক",
    role: "FINANCE_DIRECTOR",
    unit: "FINANCE",
    scope: "UNIT:FINANCE",
    titleEn: "Finance Director & Chief Financial Officer",
    titleBn: "অর্থ পরিচালক ও প্রধান অর্থ কর্মকর্তা",
    deviceId: "STFL-DEMO-DVC-000003",
    deviceState: "ACTIVE",
    notesEn: "Financial disbursements, bank reconciliations, statutory audit ledgers, institutional budgets.",
    notesBn: "অর্থ বিতরণ, ব্যাংক সমন্বয়, বিধিবদ্ধ নিরীক্ষা খতিয়ান এবং প্রাতিষ্ঠানিক বাজেট।",
    primaryConsole: "finance",
  },
  {
    code: "CLASS_04",
    userId: "STFL-DEMO-USR-000004",
    nameEn: "Engr. Monirul Islam",
    nameBn: "প্রকৌশলী মনিরুল ইসলাম",
    role: "PROPERTY_OFFICER",
    unit: "PROPERTY",
    scope: "UNIT:PROPERTY",
    titleEn: "Estates & Commercial Property Officer",
    titleBn: "এস্টেট ও বাণিজ্যিক সম্পত্তি কর্মকর্তা",
    deviceId: "STFL-DEMO-DVC-000004",
    deviceState: "ACTIVE",
    notesEn: "Commercial lease creation, rent roll collection, tenant disputes, physical maintenance schedules.",
    notesBn: "বাণিজ্যিক ইজারা চুক্তি সৃষ্টি, ভাড়া সংগ্রহ, সম্পত্তি তদারকি ও রক্ষণাবেক্ষণ।",
    primaryConsole: "property",
  },
  {
    code: "CLASS_05",
    userId: "STFL-DEMO-USR-000005",
    nameEn: "Abdul Karim",
    nameBn: "আব্দুল করিম",
    role: "FIELD_SUPERVISOR",
    unit: "OPERATIONS",
    scope: "LOCATION:KURIGRAM",
    titleEn: "Senior Field Supervisor (Kurigram Char Projects)",
    titleBn: "সিনিয়র মাঠপর্যায় পরিদর্শক (কুড়িগ্রাম চরাঞ্চল প্রকল্প)",
    deviceId: "STFL-DEMO-DVC-000005",
    deviceState: "ACTIVE",
    notesEn: "Field relief distribution, biometric identity verification, offline attendance, incident reports.",
    notesBn: "ত্রাণ বিতরণ, সুবিধাভোগী যাচাইকরণ, অফলাইন উপস্থিতি এবং মাঠপর্যায়ের ঘটনা প্রতিবেদন।",
    primaryConsole: "projects",
  },
  {
    code: "CLASS_06",
    userId: "STFL-DEMO-USR-000006",
    nameEn: "Nasreen Akhter",
    nameBn: "নাসরিন আক্তার",
    role: "MICROFINANCE_OFFICER",
    unit: "MICROFINANCE",
    scope: "UNIT:MICROFINANCE",
    titleEn: "Qard Hasan Microfinance Specialist",
    titleBn: "ক্বরযে হাসানা ক্ষুদ্রঅর্থায়ন বিশেষজ্ঞ",
    deviceId: "STFL-DEMO-DVC-000006",
    deviceState: "ACTIVE",
    notesEn: "Interest-free loan disbursements, weekly installment schedules, borrower recovery ledgers.",
    notesBn: "সুদমুক্ত ক্ষুদ্রঋণ বিতরণ, সাপ্তাহিক কিস্তি আদায় এবং ঋণগ্রহীতা খতিয়ান।",
    primaryConsole: "microfinance",
  },
  {
    code: "CLASS_07",
    userId: "STFL-DEMO-USR-000007",
    nameEn: "Zakir Hossain",
    nameBn: "জাকির হোসেন",
    role: "SECURITY_OFFICER",
    unit: "SECURITY",
    scope: "ORGANIZATION:SECURITY",
    titleEn: "Chief Information Security Officer (CISO)",
    titleBn: "প্রধান তথ্য নিরাপত্তা কর্মকর্তা",
    deviceId: "STFL-DEMO-DVC-000007",
    deviceState: "ACTIVE",
    notesEn: "Device hardware enclave verification, cryptographic key rotations, autonomous agent kill-switches.",
    notesBn: "ডিভাইস এনক্লেভ যাচাই, ক্রিপ্টোগ্রাফিক কি রোটেশন এবং এআই এজেন্ট কিল-সুইচ নিয়ন্ত্রণ।",
    primaryConsole: "security",
  },
  {
    code: "CLASS_08",
    userId: "STFL-DEMO-USR-000008",
    nameEn: "Maj. (Retd.) Shamsul Huda",
    nameBn: "মেজর অব. শামসুল হুদা",
    role: "DOCUMENT_OFFICER",
    unit: "RESOURCES",
    scope: "ORGANIZATION:DOCUMENTS",
    titleEn: "Official Records & Controlled Print Registrar",
    titleBn: "অফিসিয়াল রেকর্ড ও নিয়ন্ত্রিত মুদ্রণ নিবন্ধক",
    deviceId: "STFL-DEMO-DVC-000008",
    deviceState: "ACTIVE",
    notesEn: "Official bilingual template seals, controlled single-use print grants with forensic watermarks.",
    notesBn: "দ্বিভাষিক অফিসিয়াল সিল ও ফরেনসিক জলছাপ সহ নিয়ন্ত্রিত একক-ব্যবহারের মুদ্রণ অনুদান।",
    primaryConsole: "documents",
  },
  {
    code: "CLASS_09",
    userId: "STFL-DEMO-USR-000009",
    nameEn: "Sadia Afrin",
    nameBn: "সাদিয়া আফরিন",
    role: "HR_SPECIALIST",
    unit: "HR",
    scope: "ORGANIZATION:WORKFORCE",
    titleEn: "Human Resources & Compliance Specialist",
    titleBn: "মানবসম্পদ ও কমপ্লায়েন্স বিশেষজ্ঞ",
    deviceId: "STFL-DEMO-DVC-000009",
    deviceState: "ACTIVE",
    notesEn: "Staff directory, geofenced mobile attendance logs, shift rosters, payroll staging.",
    notesBn: "কর্মী ডিরেক্টরি, জিওফেন্সড মোবাইল উপস্থিতি লগ এবং পে-রোল প্রস্তুতি।",
    primaryConsole: "workforce",
  },
  {
    code: "CLASS_10",
    userId: "STFL-DEMO-AGT-FIN-001",
    nameEn: "Autonomous Departmental Agent",
    nameBn: "স্বায়ত্তশাসিত বিভাগীয় এআই এজেন্ট",
    role: "AI_AGENT",
    unit: "FINANCE",
    scope: "UNIT:FINANCE",
    titleEn: "Autonomous AI Agent (Level 3 Ceiling)",
    titleBn: "স্বায়ত্তশাসিত এআই এজেন্ট (লেভেল ৩ সর্বোচ্চ ক্ষমতা)",
    deviceId: "STFL-DEMO-DVC-000010",
    deviceState: "ACTIVE",
    notesEn: "Non-human intelligence. Strict Level 3 ceiling. Level 4/5 actions (disbursements) escalate to human review.",
    notesBn: "অ-মানব বুদ্ধিমত্তা। লেভেল ৩ সর্বোচ্চ ক্ষমতা। অর্থ বিতরণ বাধ্যতামূলক মানব পর্যালোচনার জন্য এসকেলেট হয়।",
    primaryConsole: "agents",
  },
  {
    code: "CLASS_11",
    userId: "STFL-DEMO-USR-000011",
    nameEn: "Rafiqul Islam",
    nameBn: "রফিকুল ইসলাম",
    role: "EXTERNAL_PARTY",
    unit: "COMMERCIAL",
    scope: "ASSIGNED_RECORD:STFL-DEMO-LSE-000001",
    titleEn: "External Party (Commercial Tenant & Micro-borrower)",
    titleBn: "বহিরাগত অংশীদার (বাণিজ্যিক ভাড়াটিয়া ও ক্ষুদ্রঋণ গ্রহীতা)",
    deviceId: "STFL-DEMO-DVC-000011",
    deviceState: "ACTIVE",
    notesEn: "Scoped tenant access: Can only view own lease and receipts. Barred from other parties records.",
    notesBn: "সীমিত ভাড়াটিয়া প্রবেশাধিকার: কেবল নিজস্ব ইজারা ও রসিদ দেখতে পারে। অন্য পার্টির তথ্যে প্রবেশাধিকার নেই।",
    primaryConsole: "property",
  },
  {
    code: "CLASS_12",
    userId: "STFL-DEMO-USR-000012",
    nameEn: "Public Verifier / Citizen",
    nameBn: "সর্বজনীন যাচাইকারী / সাধারণ নাগরিক",
    role: "PUBLIC_USER",
    unit: "PUBLIC",
    scope: "PUBLIC",
    titleEn: "Public QR Verifier (Anonymous Citizen)",
    titleBn: "সর্বজনীন ডিজিটাল যাচাইকারী (পাবলিক নাগরিক)",
    deviceId: "STFL-DEMO-DVC-000012",
    deviceState: "ACTIVE",
    notesEn: "Public document verification via QR code (/v/:code). Zero access to confidential operational data.",
    notesBn: "কিউআর কোডের মাধ্যমে সার্বজনীন নথি যাচাইকরণ। কোনো গোপনীয় প্রাতিষ্ঠানিক তথ্যে প্রবেশাধিকার নেই।",
    primaryConsole: "documents",
  },
];

export interface DemoWorkspaceProps {
  initialSegment?: DemoSegment;
  initialProjectId?: string;
}

export function DemoWorkspace({
  initialSegment = "overview",
  initialProjectId = "STFL-PRJ-2026-0012",
}: DemoWorkspaceProps) {
  const [lang, setLang] = useState<"bn" | "en">("bn");
  const [activeSegment, setActiveSegment] = useState<DemoSegment>(initialSegment);
  const [detailMode, setDetailMode] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState<IdentityCard>(DEMO_IDENTITIES[0]);
  const [activeProjectId, setActiveProjectId] = useState<string>(initialProjectId);

  // Quick modals / drawers
  const [myWorkOpen, setMyWorkOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreNavOpen, setMoreNavOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetInput, setResetInput] = useState("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Selected project object
  const activeProject =
    CANONICAL_PROJECTS.find((p) => p.id === activeProjectId) || CANONICAL_PROJECTS[0];

  // 12-Dimensional Authorization Simulator State (Inside Security Segment)
  const [simDomain, setSimDomain] = useState("FINANCE");
  const [simAction, setSimAction] = useState("disburse");
  const [simAmount, setSimAmount] = useState(25000);
  const [simResult, setSimResult] = useState<{
    tested: boolean;
    granted: boolean;
    decision: string;
    reason: string;
    dimensions: Record<string, string>;
  }>({
    tested: false,
    granted: false,
    decision: "",
    reason: "",
    dimensions: {},
  });

  // Agent Sandbox State (Inside Agents Segment)
  const [agentTool, setAgentTool] = useState("read_ledger");
  const [agentConfidence, setAgentConfidence] = useState(0.99);
  const [agentOutput, setAgentOutput] = useState<string | null>(null);

  // Controlled Print Simulator State (Inside Documents Segment)
  const [printToken, setPrintToken] = useState<string | null>(null);
  const [printSecondsLeft, setPrintSecondsLeft] = useState(300);

  // Quick Approval Simulator State
  const [approvedItems, setApprovedItems] = useState<Record<string, "APPROVED" | "REJECTED">>({});
  const [techEvalOpen, setTechEvalOpen] = useState(false);

  // Run Auth Simulator
  const handleRunAuthCheck = () => {
    const dims: Record<string, string> = {
      "Dim 01: Party & Identity": "PASS (Cryptographically attested hardware enclave)",
      "Dim 02: Authority Ceiling": selectedIdentity.code === "CLASS_12" ? "FAIL (Public citizen Level 0)" : "PASS",
      "Dim 03: Delegation Window": "PASS (Active authorization window)",
      "Dim 04: Unit Boundary":
        selectedIdentity.code === "CLASS_04" && simDomain === "FINANCE"
          ? "FAIL (Property Officer bounded to Property Unit)"
          : "PASS",
      "Dim 05: Separation of Duties":
        selectedIdentity.code === "CLASS_00" && simDomain === "FINANCE" && simAction === "disburse"
          ? "FAIL (Constitutional SoD: Super Admin barred from disbursement)"
          : selectedIdentity.code === "CLASS_00" && simDomain === "PROPERTY" && simAction === "lease.create"
          ? "FAIL (Constitutional SoD: Super Admin barred from lease mutation)"
          : "PASS",
      "Dim 06: Dual Control Threshold": simAmount > 100000 ? "ESCALATE (Exceeds ৳100,000 Level 5 threshold)" : "PASS",
      "Dim 07: Resource & Scope":
        selectedIdentity.code === "CLASS_11" && simDomain !== "PROPERTY"
          ? "FAIL (External party confined to assigned lease record)"
          : "PASS",
      "Dim 08: Action Policy": "PASS (Evaluated against published policy matrix)",
      "Dim 09: Device Security Tier": "PASS (Tier-1 Enclave Attestation active)",
      "Dim 10: Session Freshness": "PASS (Session age < 15 minutes)",
      "Dim 11: Anomaly & Risk Score": "PASS (Risk score 0.04 below threshold 0.35)",
      "Dim 12: Immutable Ledger Chain": "PASS (Ledger hash verified, zero tampering)",
    };

    if (selectedIdentity.code === "CLASS_00" && simDomain === "FINANCE" && simAction === "disburse") {
      setSimResult({
        tested: true,
        granted: false,
        decision: "DENY",
        reason:
          "CONSTITUTIONAL_SEPARATION_OF_DUTIES: Super Admin (CLASS_00) is constitutionally barred from operational finance disbursements. Requires operational role (CLASS_03 / Finance Director).",
        dimensions: dims,
      });
      return;
    }

    if (selectedIdentity.code === "CLASS_00" && simDomain === "PROPERTY" && simAction === "lease.create") {
      setSimResult({
        tested: true,
        granted: false,
        decision: "DENY",
        reason:
          "CONSTITUTIONAL_SEPARATION_OF_DUTIES: Super Admin (CLASS_00) is barred from operational property lease mutations.",
        dimensions: dims,
      });
      return;
    }

    if (selectedIdentity.code === "CLASS_04" && simDomain === "FINANCE" && simAction === "disburse") {
      setSimResult({
        tested: true,
        granted: false,
        decision: "DENY",
        reason: "DIM_04_UNIT_BOUNDARY: Property Officer cannot mutate resources in the FINANCE unit.",
        dimensions: dims,
      });
      return;
    }

    if (selectedIdentity.code === "CLASS_10" && simAction === "disburse") {
      setSimResult({
        tested: true,
        granted: false,
        decision: "ESCALATE",
        reason:
          "CONSTITUTIONAL_LEVEL_3_CEILING: Autonomous AI Agents are barred from executing financial disbursements (Level 4). Escalated to human approval ticket.",
        dimensions: dims,
      });
      return;
    }

    if (selectedIdentity.code === "CLASS_11" && simDomain !== "PROPERTY" && simDomain !== "DOCUMENTS") {
      setSimResult({
        tested: true,
        granted: false,
        decision: "DENY",
        reason: "DIM_07_SCOPE_VIOLATION: External Party is strictly confined to own tenancy/loan records.",
        dimensions: dims,
      });
      return;
    }

    if (selectedIdentity.code === "CLASS_12" && simAction !== "public.verify") {
      setSimResult({
        tested: true,
        granted: false,
        decision: "DENY",
        reason: "DIM_02_AUTHORITY_CEILING: Public Citizens have Level 0 authority. Private operational endpoints are denied.",
        dimensions: dims,
      });
      return;
    }

    setSimResult({
      tested: true,
      granted: true,
      decision: "ALLOW",
      reason: "All 12 evaluation dimensions passed. Action authorized within assigned unit and operational scope.",
      dimensions: dims,
    });
  };

  // Run Agent Tool
  const handleRunAgentTool = () => {
    if (agentTool === "disburse_funds" || agentTool === "cancel_lease") {
      setAgentOutput(
        "ESCALATED TO HUMAN: AI Agents cannot execute Level 4 actions. Ticket STFL-DEMO-TKT-99120 created in approval_tickets for human CFO review. Autonomous execution halted."
      );
      return;
    }
    if (agentConfidence < 0.98) {
      setAgentOutput(
        `ESCALATED DUE TO UNCERTAINTY: Agent confidence (${agentConfidence.toFixed(
          2
        )}) is below required 0.98 threshold. Autonomous execution halted. Ticket STFL-DEMO-TKT-88421 created for human audit.`
      );
      return;
    }
    setAgentOutput(
      `AUTONOMOUSLY EXECUTED: Tool '${agentTool}' executed cleanly under Level 3 authority. 12 matching records audited. Task committed to agent_tasks and audit_logs.`
    );
  };

  // Generate Print Token
  const handleGeneratePrintToken = () => {
    const token = "DEMO-PRN-TOK-" + Math.floor(Math.random() * 900000 + 100000);
    setPrintToken(token);
    setPrintSecondsLeft(300);
  };

  // Handle Demo Reset
  const handleConfirmReset = () => {
    if (resetInput !== "CONFIRM_DEMO_RESET") {
      setResetMessage("Error: You must type CONFIRM_DEMO_RESET exactly.");
      return;
    }
    setResetMessage("SUCCESS: All STFL-DEMO-* fictional records have been reset. Production database was untouched.");
    setTimeout(() => {
      setResetModalOpen(false);
      setResetInput("");
      setResetMessage(null);
    }, 2000);
  };

  // Canonical Navigation Segments (Section 8 & 24)
  const primarySegments = [
    { id: "overview", num: "01", labelBn: "সারসংক্ষেপ", labelEn: "Overview", icon: Activity },
    { id: "projects", num: "02", labelBn: "প্রকল্পসমূহ", labelEn: "Projects", icon: Folder },
    { id: "operations", num: "03", labelBn: "কার্যক্রম", labelEn: "Operations", icon: TaskList },
    { id: "outcomes", num: "04", labelBn: "ফলাফল", labelEn: "Outcomes", icon: StatsReport },
    { id: "finance", num: "05", labelBn: "অর্থায়ন", labelEn: "Finance", icon: Coins },
    { id: "people", num: "06", labelBn: "ব্যক্তিবর্গ", labelEn: "People", icon: Group },
    { id: "documents", num: "07", labelBn: "নথিপত্র", labelEn: "Documents", icon: Page },
    { id: "compliance", num: "08", labelBn: "কমপ্লায়েন্স", labelEn: "Compliance", icon: ShieldAlert },
    { id: "governance", num: "09", labelBn: "শাসন ও নীতি", labelEn: "Governance", icon: ShieldCheck },
  ];

  const moreSegments = [
    { id: "admin", num: "10", labelBn: "প্রশাসন (১৮ কনসোল)", labelEn: "Administration", icon: Server },
    { id: "security", num: "11", labelBn: "নিরাপত্তা ও অথ ল্যাব", labelEn: "Security & Auth Lab", icon: Lock },
    { id: "agents", num: "12", labelBn: "এআই এজেন্ট ল্যাব", labelEn: "AI Agents", icon: Cpu },
    { id: "system", num: "13", labelBn: "সিস্টেম ও লেজার", labelEn: "System & Ledger", icon: DatabaseIcon },
  ];

  function DatabaseIcon(props: { width?: number; height?: number; className?: string }) {
    return <Server {...props} />;
  }

  const allSegments = [...primarySegments, ...moreSegments];
  const isMoreActive = moreSegments.some((s) => s.id === activeSegment);

  return (
    <div className="min-h-screen bg-white text-[#081F2D] flex flex-col font-sans selection:bg-[#FF6B35]/20 selection:text-[#081F2D]">
      {/* =========================================================================
          1. RESTORED GLOBAL APPLICATION SHELL (SECTION 7 & 9)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#081F2D] text-white border-b border-[#0B2B43] shadow-md">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
            
            {/* LEFT: Institutional Logo + Clear Demo Indicator (Section 9) */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 group">
                <Image
                  src="/stfl-mark-transparent.png"
                  alt="SohaelTasneem Foundation"
                  width={36}
                  height={36}
                  className="h-8 sm:h-9 w-auto flex-shrink-0 transition-opacity group-hover:opacity-90"
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold tracking-tight text-white block leading-none font-sans">
                    SohaelTasneem Foundation
                  </span>
                  <span className="text-[10px] text-cyan-400 font-semibold tracking-wider block mt-1 font-mono">
                    STFL VI · {lang === "bn" ? "প্রাতিষ্ঠানিক অপারেটিং সিস্টেম" : "Unified Institutional Operating Platform"}
                  </span>
                </div>
              </Link>

              {/* DEMO / NON-PRODUCTION INDICATOR (Section 9) */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-500/50 bg-amber-500/15 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>DEMO / NON-PROD</span>
              </div>
            </div>

            {/* CENTER / CONTEXT: Project Selector (Section 9) */}
            <div className="hidden md:flex items-center gap-2 bg-[#0B2B43] px-3 py-1.5 rounded-lg border border-stone-700 shadow-inner">
              <span className="text-[11px] font-medium text-stone-300 whitespace-nowrap flex items-center gap-1.5">
                <Folder width={14} height={14} className="text-[#FF6B35]" />
                <span>{lang === "bn" ? "প্রকল্প:" : "Project:"}</span>
              </span>
              <select
                value={activeProjectId}
                onChange={(e) => setActiveProjectId(e.target.value)}
                className="bg-[#081F2D] text-xs font-semibold text-white border border-stone-600 rounded px-2.5 py-1 focus:ring-1 focus:ring-[#FF6B35] cursor-pointer outline-none"
              >
                {CANONICAL_PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} • {lang === "bn" ? p.nameBn : p.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* RIGHT: Actions, My Work, Notifications, Language, Profile (Section 9) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* My Work Quick Trigger */}
              <button
                onClick={() => setMyWorkOpen(true)}
                className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border border-stone-700 bg-[#0B2B43] text-stone-300 hover:text-white hover:border-stone-500 transition-colors"
                title="View work items assigned to active role"
              >
                <TaskList width={13} height={13} className="text-[#FF6B35]" />
                <span>{lang === "bn" ? "আমার দায়িত্ব" : "My Work"}</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setNotifOpen(true)}
                className="relative p-1.5 rounded text-stone-300 hover:text-white hover:bg-[#0B2B43] transition-colors"
                title="Notifications & Approvals"
                aria-label="Notifications"
              >
                <Bell width={15} height={15} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF6B35]" />
              </button>

              {/* Language Switcher [BN | EN] (Section 5 & 9) */}
              <div className="flex items-center bg-[#0B2B43] rounded-md p-0.5 border border-stone-700/80 text-xs font-sans">
                <button
                  onClick={() => setLang("bn")}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    lang === "bn" ? "bg-[#FF6B35] text-white shadow-sm" : "text-stone-400 hover:text-white"
                  }`}
                >
                  বাং
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    lang === "en" ? "bg-[#FF6B35] text-white shadow-sm" : "text-stone-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Detail View Toggle (Section 25 & 46) */}
              <button
                onClick={() => setDetailMode(!detailMode)}
                className={`hidden xl:inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all border ${
                  detailMode
                    ? "bg-[#0B2B43] text-[#FF6B35] border-[#FF6B35] shadow-xs"
                    : "bg-[#081F2D] text-stone-300 border-stone-700 hover:text-white hover:border-stone-500"
                }`}
                title="Toggle between Normal Business View and Technical Governance Evaluation"
              >
                <Eye width={13} height={13} />
                <span>{detailMode ? (lang === "bn" ? "বিস্তারিত ভিউ চালু" : "DETAIL VIEW ON") : (lang === "bn" ? "স্বাভাবিক ভিউ" : "NORMAL VIEW")}</span>
              </button>

              {/* Active Role Quick Dropdown (Profile) */}
              <div className="flex items-center gap-1.5 bg-[#0B2B43] px-2 py-1 rounded-md border border-stone-700 text-xs">
                <User width={13} height={13} className="text-[#FF6B35]" />
                <select
                  value={selectedIdentity.code}
                  onChange={(e) => {
                    const found = DEMO_IDENTITIES.find((i) => i.code === e.target.value);
                    if (found) setSelectedIdentity(found);
                  }}
                  className="bg-[#081F2D] text-[11px] font-semibold text-stone-200 border border-stone-700 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer max-w-[120px] sm:max-w-[160px] truncate"
                >
                  {DEMO_IDENTITIES.map((ident) => (
                    <option key={ident.code} value={ident.code}>
                      {ident.code} — {lang === "bn" ? ident.nameBn : ident.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Administration Link (For Super Admin CLASS_00) */}
              {selectedIdentity.code === "CLASS_00" && (
                <Link
                  href="/admin"
                  className="hidden sm:inline-flex bg-[#FF6B35] hover:bg-[#e85a27] text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors shadow-sm items-center gap-1"
                >
                  <Server width={12} height={12} />
                  <span>{lang === "bn" ? "অ্যাডমিন" : "Admin"}</span>
                </Link>
              )}

              {/* Demo Reset Trigger */}
              <button
                onClick={() => setResetModalOpen(true)}
                className="text-stone-400 hover:text-rose-400 p-1.5 rounded transition-colors"
                title="Reset Demo Data"
                aria-label="Reset Demo Data"
              >
                <Trash width={15} height={15} />
              </button>
            </div>
          </div>

          {/* =========================================================================
              SEGMENTED NAVIGATION STRIP (SECTION 7, 8 & 24)
              ========================================================================= */}
          <nav className="flex items-center gap-1 border-t border-stone-800/80 pt-1 pb-1 overflow-x-auto text-xs font-medium scrollbar-thin">
            {primarySegments.map((s) => {
              const Icon = s.icon;
              const isActive = activeSegment === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSegment(s.id as DemoSegment);
                    setMoreNavOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-sans ${
                    isActive
                      ? "bg-[#FF6B35] text-white font-semibold shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
                  }`}
                >
                  <Icon width={13} height={13} />
                  <span className="font-mono text-[10px] opacity-75">{s.num}</span>
                  <span>{lang === "bn" ? s.labelBn : s.labelEn}</span>
                </button>
              );
            })}

            {/* MORE ▾ Dropdown (Section 24) */}
            <div className="relative">
              <button
                onClick={() => setMoreNavOpen(!moreNavOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-sans ${
                  isMoreActive
                    ? "bg-[#0B2B43] text-[#FF6B35] font-semibold border border-[#FF6B35]/40"
                    : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
                }`}
              >
                <span>{lang === "bn" ? "আরও সেগমেন্ট" : "More"}</span>
                <NavArrowDown width={12} height={12} className={`transition-transform ${moreNavOpen ? "rotate-180" : ""}`} />
              </button>

              {moreNavOpen && (
                <div className="absolute left-0 mt-1 w-56 rounded-lg bg-[#081F2D] border border-stone-700 shadow-xl py-1 z-50 text-xs">
                  {moreSegments.map((s) => {
                    const Icon = s.icon;
                    const isActive = activeSegment === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSegment(s.id as DemoSegment);
                          setMoreNavOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${
                          isActive
                            ? "bg-[#FF6B35] text-white font-semibold"
                            : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
                        }`}
                      >
                        <Icon width={14} height={14} />
                        <span className="font-mono text-[10px] opacity-75">{s.num}</span>
                        <span>{lang === "bn" ? s.labelBn : s.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* =========================================================================
          2. PROJECT CONTEXT BAR (SECTION 10)
          ========================================================================= */}
      <section className="bg-[#0B2B43] text-white border-b border-stone-700/80 px-4 sm:px-6 py-2 text-xs">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
              PROJECT
            </span>
            <span className="font-bold text-sm text-white flex items-center gap-1.5">
              <Folder width={14} height={14} className="text-[#FF6B35]" />
              {lang === "bn" ? activeProject.nameBn : activeProject.nameEn}
            </span>
            <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded text-stone-300 border border-white/10">
              {activeProject.id}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              {activeProject.status}
            </span>
            <span className="text-stone-400 hidden lg:inline">
              {lang === "bn" ? activeProject.jurisdictionBn : activeProject.jurisdictionEn}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-[11px] font-mono">
            <div>
              <span className="text-stone-400">Spend: </span>
              <strong>৳{(activeProject.finance.budgetSpent / 100000).toFixed(1)}L / ৳{(activeProject.finance.budgetTotal / 100000).toFixed(1)}L</strong>
            </div>
            <div>
              <span className="text-stone-400">Outcome: </span>
              <strong className="text-[#FF6B35]">{activeProject.kpis.outcomeAchievementPct}%</strong>
            </div>
            <div>
              <span className="text-stone-400">Health: </span>
              <span className="font-bold text-emerald-400">{activeProject.health}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Mode Technical Inspection Banner (Section 25 & 46) */}
      {detailMode && (
        <aside className="bg-[#0B2B43] text-stone-200 border-b border-[#081F2D] px-4 sm:px-6 py-2 text-xs font-mono flex flex-wrap items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-3">
            <span className="bg-[#FF6B35] text-white px-2 py-0.5 rounded font-bold text-[10px] tracking-wide">
              {lang === "bn" ? "কারিগরি মূল্যায়ন মোড সক্রিয়" : "TECHNICAL EVALUATION MODE ACTIVE"}
            </span>
            <span>Actor: <strong className="text-white">{selectedIdentity.userId}</strong></span>
            <span>Class: <strong className="text-white">{selectedIdentity.code}</strong></span>
            <span>Unit: <strong className="text-stone-300">{selectedIdentity.unit}</strong></span>
            <span>Scope: <strong className="text-stone-300">{selectedIdentity.scope}</strong></span>
            <span>Device: <strong className="text-stone-300">{selectedIdentity.deviceId} ({selectedIdentity.deviceState})</strong></span>
          </div>
          <div className="text-[11px] text-stone-300">
            <span>Invariant: SoD_12 Passed • Tamper Chain: 0x9f2a • Egress: ZERO</span>
          </div>
        </aside>
      )}

      {/* =========================================================================
          3. MAIN CONTENT CONTAINER (RESTORED STFL DESIGN SYSTEM)
          ========================================================================= */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">

        {/* =======================================================================
            SEGMENT 01: OVERVIEW (SECTION 11, 12 & 13)
            ======================================================================= */}
        {activeSegment === "overview" && (
          <div className="space-y-6">
            
            {/* Executive Overview Header */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <div className="max-w-4xl mb-4">
                <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                  SEGMENT 01 • EXECUTIVE PORTFOLIO & WORKSPACE OVERVIEW
                </span>
                <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                  {lang === "bn" ? "সার্বিক পোর্টফোলিও ও অপারেটিং ড্যাশবোর্ড" : "STFL VI Portfolio Operating Dashboard"}
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  {lang === "bn"
                    ? "৪টি সক্রিয় প্রকল্প, ২৫,০৯০ সুবিধাভোগী এবং ৳২.৯০ কোটি পরিচালিত তহবিলের সার্বিক অবস্থা। টাস্ক-ভিত্তিক সেগমেন্টেশন দ্বারা দীর্ঘ স্ক্রোলিং বন্ধ করে নিয়ন্ত্রিত অভিজ্ঞতা।"
                    : "Executive overview of 4 active projects, 25,090 verified beneficiaries, and ৳29.0M managed funds. Direct task-oriented segmented workspace."}
                </p>
              </div>

              {/* 1. WHERE WE ARE: 7 RESTRAINED STFL KPIS (SECTION 15 & 16) */}
              <div className="pt-4 border-t border-[#E7E7E2]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                    <span>1. WHERE WE ARE</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-sans font-normal">{lang === "bn" ? "সার্বিক পোর্টফোলিও পরিমাপক" : "Restrained Portfolio Metric System"}</span>
                  </span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {lang === "bn" ? "হালনাগাদ: আজ বিকাল ৫:০০" : "Updated: Today 5:00 PM"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "পরিচালিত তহবিল" : "MANAGED FUNDS"}</span>
                    <div className="text-lg font-bold text-[#081F2D] font-mono mt-0.5">৳62.90 Cr</div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">+4 active</span>
                  </div>
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "সক্রিয় প্রকল্প" : "ACTIVE PROJECTS"}</span>
                    <div className="text-lg font-bold text-[#081F2D] font-mono mt-0.5">12</div>
                    <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">4 need action</span>
                  </div>
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "উপকৃত মানুষ" : "PEOPLE REACHED"}</span>
                    <div className="text-lg font-bold text-[#081F2D] font-mono mt-0.5">25,090</div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">96.2% verified</span>
                  </div>
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "সরাসরি ব্যয়" : "DIRECT SPEND"}</span>
                    <div className="text-lg font-bold text-[#0B2B43] font-mono mt-0.5">৳31.87 Cr</div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">96.4% tracked</span>
                  </div>
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "ওভারহেড" : "OVERHEAD"}</span>
                    <div className="text-lg font-bold text-emerald-800 font-mono mt-0.5">3.1%</div>
                    <span className="text-[10px] text-stone-500 font-semibold block mt-0.5">Cap: 15%</span>
                  </div>
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "গড় ফলাফল" : "AVG OUTCOME"}</span>
                    <div className="text-lg font-bold text-[#081F2D] font-mono mt-0.5">80.8%</div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">On target</span>
                  </div>
                  <div className="bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase block">{lang === "bn" ? "প্রকল্প স্বাস্থ্য" : "PROJECT HEALTH"}</span>
                    <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">GOOD</div>
                    <span className="text-[10px] text-stone-500 font-semibold block mt-0.5">100% auditable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. WHAT WE ARE DOING: MONEY → WORK → OUTCOME PIPELINE & PROJECT MATRIX (SECTION 15 & 23) */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E7E2] pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                    <span>2. WHAT WE ARE DOING</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-sans font-normal">{lang === "bn" ? "প্রভাব বিস্তার ও কার্যক্রম পরিচালন পাইপলাইন" : "Impact Delivery & Operations Pipeline"}</span>
                  </span>
                  <h2 className="text-base font-bold text-[#081F2D] font-sans mt-1">
                    {lang === "bn" ? "অর্থায়ন → কার্যক্রম → আউটপুট → ফলাফল → টেকসই প্রভাব" : "Money → Operations → Outputs → Outcomes → Impact"}
                  </h2>
                </div>
                <span className="text-xs font-mono bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1.5">
                  <CheckCircle width={13} height={13} />
                  <span>VERIFIED IMPACT CHAIN</span>
                </span>
              </div>

              {/* 5-Stage Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {/* Step 1: Funds */}
                <div className="bg-[#FAFAF8] border border-[#E7E7E2] p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#5A6B75]">1. FUNDS</span>
                  <div className="text-xl font-bold font-mono text-[#081F2D]">৳12.0M</div>
                  <div className="text-[11px] text-stone-500 font-medium">Funds Received</div>
                </div>

                {/* Step 2: Operations */}
                <div className="bg-[#FAFAF8] border border-[#E7E7E2] p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#5A6B75]">2. OPERATIONS</span>
                  <div className="text-xl font-bold font-mono text-amber-700">120</div>
                  <div className="text-[11px] text-stone-500 font-medium">Activities Executed</div>
                </div>

                {/* Step 3: Outputs */}
                <div className="bg-[#FAFAF8] border border-[#E7E7E2] p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#5A6B75]">3. OUTPUTS</span>
                  <div className="text-xl font-bold font-mono text-[#0B2B43]">7,680</div>
                  <div className="text-[11px] text-stone-500 font-medium">People Served</div>
                </div>

                {/* Step 4: Outcomes */}
                <div className="bg-[#FAFAF8] border border-[#E7E7E2] p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#5A6B75]">4. OUTCOMES</span>
                  <div className="text-xl font-bold font-mono text-[#FF6B35]">91%</div>
                  <div className="text-[11px] text-stone-500 font-medium">Target Achieved</div>
                </div>

                {/* Step 5: Impact */}
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-800">5. IMPACT</span>
                  <div className="text-xl font-bold font-mono text-emerald-900">VERIFIED</div>
                  <div className="text-[11px] text-emerald-800 font-medium">Sustainable Literacy</div>
                </div>
              </div>

              {/* Active Project Matrix */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#081F2D] uppercase tracking-wider font-mono">
                    {lang === "bn" ? "সক্রিয় প্রকল্প কর্মক্ষমতা খতিয়ান" : "Active Project Performance Matrix"}
                  </h3>
                  <button
                    onClick={() => setActiveSegment("projects")}
                    className="text-xs text-[#FF6B35] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>{lang === "bn" ? "সকল প্রকল্প দেখুন" : "View All Projects"}</span>
                    <ArrowRight width={12} height={12} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E7E7E2] text-[#5A6B75] font-mono text-[10px] uppercase">
                        <th className="pb-2.5 font-bold">PROJECT</th>
                        <th className="pb-2.5 font-bold">STATUS</th>
                        <th className="pb-2.5 font-bold">OUTCOME</th>
                        <th className="pb-2.5 font-bold">SPENT</th>
                        <th className="pb-2.5 font-bold">HEALTH</th>
                        <th className="pb-2.5 font-bold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E7E2]">
                      {CANONICAL_PROJECTS.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                          <td className="py-3 pr-3">
                            <div className="font-bold text-[#081F2D] text-xs">
                              {lang === "bn" ? p.nameBn : p.nameEn}
                            </div>
                            <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                              {p.id}
                            </div>
                          </td>
                          <td className="py-3 pr-3">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#081F2D]">
                                {p.kpis.outcomeAchievementPct}%
                              </span>
                              <div className="w-16 bg-stone-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className="bg-[#FF6B35] h-full rounded-full"
                                  style={{ width: `${p.kpis.outcomeAchievementPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-3 font-mono text-xs font-semibold text-stone-700">
                            ৳{(p.finance.budgetSpent / 100000).toFixed(1)}M
                          </td>
                          <td className="py-3 pr-3">
                            <span
                              className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                                p.health === "GOOD"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : p.health === "WATCH"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {p.health}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setActiveProjectId(p.id);
                                setActiveSegment("operations");
                              }}
                              className="text-xs text-[#FF6B35] font-semibold hover:underline inline-flex items-center gap-1"
                            >
                              <span>{p.health === "WATCH" ? "Review →" : "View →"}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 3. WHAT HAS CHANGED: VERIFIED MILESTONES & TELEMETRY LOG (SECTION 15) */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E7E7E2] pb-4 mb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                    <span>3. WHAT HAS CHANGED</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-sans font-normal">{lang === "bn" ? "মাঠপর্যায় ও নিয়ন্ত্রক পরিবর্তন খতিয়ান" : "Verified Milestones & Field Telemetry"}</span>
                  </span>
                  <h2 className="text-base font-bold text-[#081F2D] font-sans mt-1">
                    {lang === "bn" ? "সাম্প্রতিক যাচাইকৃত মাইলফলক ও অপারেশনাল রূপান্তর" : "Recent Verified Milestones & Operational Updates"}
                  </h2>
                </div>
                <span className="text-xs font-mono bg-stone-100 text-[#081F2D] font-semibold px-2.5 py-1 rounded border border-[#E7E7E2] flex items-center gap-1.5">
                  <Clock width={13} height={13} className="text-[#FF6B35]" />
                  <span>LIVE AUDIT FEED</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Milestone 1 */}
                <div className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#FF6B35] uppercase">EDUCATION ACCESS</span>
                    <span className="text-[10px] font-mono text-stone-500">4h ago</span>
                  </div>
                  <div className="font-bold text-[#081F2D] text-xs">
                    {lang === "bn" ? "১,২০০ শিক্ষা উপকরণ ও ডিজিটাল স্লেট বিতরণ" : "1,200 Learning Kits & Digital Slates Dispatched"}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "সিলেট ও চট্টগ্রাম পাহাড়ি এলাকায় তৃতীয়-পঞ্চম শ্রেণির শিশুদের মাঝে বিতরণ সম্পন্ন ও যাচাইকৃত।"
                      : "Delivered to Grade 3-5 students across Sylhet & Chattogram hill tracts with biometric receipt."}
                  </p>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>Abdul Karim (CLASS_05)</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle width={11} height={11} /> 100% Biometric
                    </span>
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">SOLAR HEALTH</span>
                    <span className="text-[10px] font-mono text-stone-500">Yesterday</span>
                  </div>
                  <div className="font-bold text-[#081F2D] text-xs">
                    {lang === "bn" ? "সৌরচালিত কোল্ড-স্টোরেজ ইউনিট চালু" : "Solar Cold-Storage Unit Fully Commissioned"}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "কুড়িগ্রাম চরে দূরবর্তী মা ও শিশু স্বাস্থ্য কেন্দ্রের ভ্যাকসিন সংরক্ষণ কেন্দ্র স্বয়ংক্রিয় চালু।"
                      : "Vaccine storage center in Kurigram Char operational with autonomous IoT temperature telemetry."}
                  </p>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>Engr. Monirul Islam</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle width={11} height={11} /> Telemetry Link
                    </span>
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#0B2B43] uppercase">COMPLIANCE</span>
                    <span className="text-[10px] font-mono text-stone-500">2d ago</span>
                  </div>
                  <div className="font-bold text-[#081F2D] text-xs">
                    {lang === "bn" ? "এনজিও বিষয়ক ব্যুরো এফডি-৭ অনুমোদন ফাইল প্রস্তুত" : "NGOAB FD-7 6-Month Renewal File Assembled"}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "বিধিবদ্ধ ফাইলিং নিরীক্ষিত এবং নিয়ন্ত্রিত প্রিন্ট সিল সংযুক্ত করে পর্যালোচনার জন্য উপস্থাপিত।"
                      : "Statutory renewal docket assembled with controlled cryptographic verification seal."}
                  </p>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>Maj. Shamsul Huda</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle width={11} height={11} /> Sealed
                    </span>
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">SYSTEM & AUDIT</span>
                    <span className="text-[10px] font-mono text-stone-500">3d ago</span>
                  </div>
                  <div className="font-bold text-[#081F2D] text-xs">
                    {lang === "bn" ? "সংবিধানের ১২টি শর্ত খতিয়ান যাচাই সম্পন্ন" : "12-Invariant Ledger Cryptographic Audit"}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "পোস্টগ্রেস খতিয়ানের ব্লক হ্যাশ ও ডুয়াল-কন্ট্রোল রেকর্ড যাচাইয়ে শূন্য ডেটা ড্রিফ্ট নিশ্চিত।"
                      : "Zero cryptographic drift confirmed across PostgreSQL ledgers and dual-custody approval trees."}
                  </p>
                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>Zakir Hossain (CISO)</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle width={11} height={11} /> Block #104829
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. WHAT IT COST: DIRECT VS INDIRECT VS OVERHEAD FINANCIAL TRIAD (SECTION 15, 21 & 22) */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E7E2] pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                    <span>4. WHAT IT COST</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-sans font-normal">{lang === "bn" ? "ব্যয়ের ত্রিস্তরীয় বিভাজন (সরাসরি বনাম পরোক্ষ বনাম প্রশাসনিক)" : "3-Tier Financial Structure (Direct vs Indirect vs Overhead)"}</span>
                  </span>
                  <h2 className="text-base font-bold text-[#081F2D] font-sans mt-1">
                    {lang === "bn" ? "অর্থনৈতিক স্বচ্ছতা ও ব্যয়ের উদ্দেশ্যভিত্তিক শ্রেণীবিন্যাস" : "Financial Transparency & Expenditure Governance"}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveSegment("finance")}
                  className="text-xs text-[#FF6B35] font-semibold hover:underline flex items-center gap-1"
                >
                  <span>{lang === "bn" ? "পূর্ণ অর্থ খতিয়ান খুলুন" : "Open Finance Console"}</span>
                  <ArrowRight width={12} height={12} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Direct Project Expenditure */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-900 uppercase">DIRECT PROJECT EXPENDITURE</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">78.2%</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#081F2D]">৳31.87 Cr</div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "সরাসরি মাঠপর্যায়ে সুবিধাভোগীদের শিক্ষাসামগ্রী, পুষ্টি, চিকিৎসা ও কৃষি সহায়তা সামগ্রী প্রদানে ব্যয়।"
                      : "Funds directly utilized for field project activities, learner equipment, medical supply kits, and seeds."}
                  </p>
                  <div className="text-[10px] font-mono text-emerald-800 font-semibold pt-1">
                    • 100% Itemized • Biometrically Audited
                  </div>
                </div>

                {/* 2. Indirect / Shared Expenditure */}
                <div className="p-4 rounded-xl border border-stone-300 bg-[#FAFAF8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase">INDIRECT / SHARED EXPENDITURE</span>
                    <span className="text-xs font-mono font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded">18.7%</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-[#0B2B43]">৳7.62 Cr</div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "যৌথ ফিল্ড হাব, লজিস্টিকস পরিবহন, আইওটি টেলিমেট্রি এবং মাঠপর্যায় সমন্বয় অবকাঠামো খরচ।"
                      : "Shared field hubs, regional supply logistics, IoT cold-chain networks, and transport maintenance."}
                  </p>
                  <div className="text-[10px] font-mono text-stone-600 font-semibold pt-1">
                    • Prorated Allocation Matrix Enforced
                  </div>
                </div>

                {/* 3. Administrative Overhead */}
                <div className="p-4 rounded-xl border border-stone-300 bg-[#FAFAF8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#5A6B75] uppercase">ADMINISTRATIVE OVERHEAD</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">3.1%</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-900">৳1.26 Cr</div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {lang === "bn"
                      ? "সাংবিধানিক পরিচালনা, আইনি নিরীক্ষা, নিয়ন্ত্রক প্রতিবেদন ও অভ্যন্তরীণ আর্থিক নিয়ন্ত্রণ ব্যয় (সীমা: ১৫%)।"
                      : "Fiduciary governance, statutory external audits, regulatory dockets, and oversight. Statutory ceiling: 15.0%."}
                  </p>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold pt-1">
                    • Within Statutory Cap (3.1% &lt; 15.0%)
                  </div>
                </div>
              </div>

              {/* Fiduciary Control Strip */}
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#5A6B75] block">TOTAL MANAGED SPEND</span>
                    <span className="font-mono font-bold text-sm text-[#081F2D]">৳40.75 Cr (96.4% of Budget)</span>
                  </div>
                  <div className="h-6 w-px bg-stone-300 hidden sm:block" />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#5A6B75] block">COST PER BENEFICIARY</span>
                    <span className="font-mono font-bold text-sm text-[#081F2D]">৳12,702 / person</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-[#0B2B43] text-white px-2.5 py-1 rounded">
                    Dual-Control Threshold: ৳100,000
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded">
                    100% Reconciled
                  </span>
                </div>
              </div>
            </div>

            {/* 5. WHAT NEEDS ATTENTION: ACTION REQUIRED & STATUTORY FILING QUEUE (SECTION 15) */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E7E7E2] pb-4">
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                    <span>5. WHAT NEEDS ATTENTION</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-stone-500 font-sans font-normal">{lang === "bn" ? "জরুরি অনুমোদন ও নিয়ন্ত্রক ফাইলিং কিউ" : "Priority Action & Fiduciary Approval Queue"}</span>
                  </span>
                  <h2 className="text-base font-bold text-[#081F2D] font-sans mt-1">
                    {lang === "bn" ? "পদক্ষেপ অপেক্ষমাণ খতিয়ান (ডুয়াল কন্ট্রোল ও সময়সীমা)" : "Pending Escalations & Statutory Action Items"}
                  </h2>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded border border-amber-300 flex items-center gap-1.5">
                  <WarningTriangle width={13} height={13} />
                  <span>3 APPROVALS PENDING</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-900 uppercase">FINANCIAL VARIANCE</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">Level 3</span>
                  </div>
                  <div className="font-bold text-amber-950 text-xs">
                    Solar Tablet Procurement Variance (৳185,000)
                  </div>
                  <p className="text-[11px] text-amber-900/80 leading-snug">
                    Education Access 2026 • Initiator: Sarah Khan. Exceeds dual-control threshold.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-800">Requires Director Sign-off</span>
                    <button
                      onClick={() => setActiveSegment("governance")}
                      className="bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                    >
                      Review →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-blue-300 bg-blue-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-900 uppercase">STATUTORY FILING</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900">14 Days</span>
                  </div>
                  <div className="font-bold text-blue-950 text-xs">
                    NGOAB FD-7 6-Month Renewal Submission
                  </div>
                  <p className="text-[11px] text-blue-900/80 leading-snug">
                    Prime Minister&apos;s Office NGO Affairs Bureau 6-month statutory expenditure declaration.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-800">Controlled Print Sealed</span>
                    <button
                      onClick={() => setActiveSegment("compliance")}
                      className="bg-[#0B2B43] hover:bg-[#FF6B35] text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                    >
                      Inspect →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-rose-900 uppercase">EQUIPMENT MAINTENANCE</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-200 text-rose-900">Urgent</span>
                  </div>
                  <div className="font-bold text-rose-950 text-xs">
                    Deep-Tube Motor Maintenance & Inspection
                  </div>
                  <p className="text-[11px] text-rose-900/80 leading-snug">
                    Char Agro-Tech Seed Bank • Drought risk detected in northern Char sector.
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-rose-800">Field Unit Dispatched</span>
                    <button
                      onClick={() => setActiveSegment("operations")}
                      className="bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-semibold px-2.5 py-1 rounded transition-colors"
                    >
                      Action →
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 font-mono flex items-center justify-between">
                <span>Enforces Constitutional Separation of Duties</span>
                <span className="text-emerald-700 font-bold">100% Tamper-Evident Ledger</span>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 02: PROJECTS (SOVEREIGN TENANCY)
            ======================================================================= */}
        {activeSegment === "projects" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 02 • SOVEREIGN PROJECT WORKSPACES
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "প্রকল্প এক্সপ্লোরার ও স্বতন্ত্র কাজের ক্ষেত্র" : "Project Workspaces Explorer"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "প্রতিটি প্রকল্প স্বাধীন বাজেট, লক্ষ্যমাত্রা, দল ও নথি খতিয়ান দ্বারা পরিচালিত। যেকোনো প্রকল্পে প্রবেশ করে সরাসরি কাজ পরিচালনা করুন।"
                  : "Every project operates with independent financial ledgers, dedicated stakeholders, field teams, and verified outcome targets."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CANONICAL_PROJECTS.map((p) => {
                const isSelected = p.id === activeProjectId;
                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-xl border p-5 shadow-sm transition-all ${
                      isSelected ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/30" : "border-[#E7E7E2] hover:border-stone-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#FF6B35]">{p.id}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {p.code}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-[#081F2D] mb-1 font-sans">
                      {lang === "bn" ? p.nameBn : p.nameEn}
                    </h2>

                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                      {lang === "bn" ? p.objectiveBn : p.objectiveEn}
                    </p>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2] text-xs font-mono mb-4">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Spent</span>
                        <strong>৳{(p.finance.budgetSpent / 100000).toLocaleString()}L</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Outcome</span>
                        <strong className="text-[#FF6B35]">{p.kpis.outcomeAchievementPct}%</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase">Reached</span>
                        <strong>{p.kpis.peopleReached.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="text-stone-500">
                        Manager: {lang === "bn" ? p.managerBn : p.managerEn}
                      </span>
                      <button
                        onClick={() => {
                          setActiveProjectId(p.id);
                          setActiveSegment("operations");
                        }}
                        className="bg-[#081F2D] hover:bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
                      >
                        <span>{lang === "bn" ? "ওয়ার্কস্পেস খুলুন" : "Open Workspace"}</span>
                        <ArrowRight width={12} height={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 03: OPERATIONS (SECTION 15)
            ======================================================================= */}
        {activeSegment === "operations" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 03 • OPERATIONS & WORK BREAKDOWN
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? `${activeProject.nameBn}: মাঠপর্যায়ের কর্মপ্রচেষ্টা` : `${activeProject.nameEn}: Operations & Tasks`}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "মাঠে প্রকৃতপক্ষে কী কাজ হচ্ছে তা নিরীক্ষাযোগ্য প্রমাণপত্র এবং বাজেট বরাদ্দের সাথে যুক্ত।"
                  : "Tracks scheduled activities, delivery ownership, geographic locations, and immutable evidence links."}
              </p>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
              <div className="bg-white p-3 rounded-lg border border-[#E7E7E2] text-center">
                <span className="text-stone-400 block text-[10px]">TODAY</span>
                <span className="text-base font-bold text-[#081F2D]">2 Tasks</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200 text-center">
                <span className="text-blue-600 block text-[10px]">IN PROGRESS</span>
                <span className="text-base font-bold text-blue-700">2 Activities</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-stone-200 text-center">
                <span className="text-stone-400 block text-[10px]">UPCOMING</span>
                <span className="text-base font-bold text-stone-700">1 Scheduled</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
                <span className="text-emerald-600 block text-[10px]">COMPLETED</span>
                <span className="text-base font-bold text-emerald-700">1 Verified</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-rose-200 text-center">
                <span className="text-rose-600 block text-[10px]">BLOCKED</span>
                <span className="text-base font-bold text-rose-700">1 Gated</span>
              </div>
            </div>

            {/* Task Cards & Details */}
            <div className="space-y-3">
              {activeProject.operations.map((op) => (
                <div key={op.id} className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#FF6B35]">{op.id}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        op.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : op.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : op.status === "BLOCKED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-stone-100 text-stone-700"
                      }`}>
                        {op.status}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">{op.schedule}</span>
                    </div>

                    <h2 className="text-sm font-bold text-[#081F2D] font-sans">
                      {lang === "bn" ? op.nameBn : op.nameEn}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                      <span>Owner: <strong>{op.owner}</strong> ({op.team})</span>
                      <span>Location: {op.location}</span>
                      <span>Evidence: <strong className="font-mono text-[#0B2B43]">{op.evidenceId}</strong></span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs space-y-1">
                    <div>Budget: <strong>৳{op.budget.toLocaleString()}</strong></div>
                    <div className="text-stone-500">Spent: ৳{op.spent.toLocaleString()}</div>
                    {op.issuesCount > 0 && (
                      <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-200 inline-block">
                        {op.issuesCount} Issue Reported
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 04: OUTCOMES (SECTION 16)
            ======================================================================= */}
        {activeSegment === "outcomes" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 04 • OUTCOMES & VERIFIED IMPACT
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "প্রকল্প ফলাফল ও টেকসই প্রভাব নিরীক্ষা" : "Outcomes & Verified Impact Metrics"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "কার্যক্রমের সংখ্যা আর বাস্তব ফলাফল এক নয়। এখানে প্রতিটি ফলাফল বেসলাইন এবং তৃতীয় পক্ষীয় নিরীক্ষার মাধ্যমে যাচাইকৃত।"
                  : "Distinguishes Activity Counts from Verified Outcomes and Impact. Every outcome is benchmarked against baseline measurements."}
              </p>
            </div>

            {/* Distinction Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                <span className="font-mono text-[10px] text-stone-400 uppercase block font-bold">1. ACTIVITY</span>
                <div className="font-bold text-[#081F2D] text-sm mt-0.5">120 Sessions</div>
                <p className="text-[11px] text-stone-500 mt-1">Classroom sessions conducted</p>
              </div>
              <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
                <span className="font-mono text-[10px] text-blue-600 uppercase block font-bold">2. OUTPUT</span>
                <div className="font-bold text-blue-900 text-sm mt-0.5">7,680 Students</div>
                <p className="text-[11px] text-blue-700 mt-1">Enrolled and equipped with tablets</p>
              </div>
              <div className="bg-purple-50 p-3.5 rounded-lg border border-purple-200">
                <span className="font-mono text-[10px] text-purple-600 uppercase block font-bold">3. OUTCOME</span>
                <div className="font-bold text-purple-900 text-sm mt-0.5">91% Literacy Score</div>
                <p className="text-[11px] text-purple-700 mt-1">Standardized assessment gain</p>
              </div>
              <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200">
                <span className="font-mono text-[10px] text-emerald-600 uppercase block font-bold">4. IMPACT</span>
                <div className="font-bold text-emerald-900 text-sm mt-0.5">Zero Dropout Rate</div>
                <p className="text-[11px] text-emerald-700 mt-1">Sustainable generational change</p>
              </div>
            </div>

            {/* Outcomes Cards with Progress Bars */}
            <div className="space-y-4">
              {activeProject.outcomes.map((out) => {
                const progressPct = Math.min(100, Math.round((out.actual / out.target) * 100));
                return (
                  <div key={out.id} className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#FF6B35]">
                          {out.id} • {out.measurementPeriod}
                        </span>
                        <h2 className="text-sm font-bold text-[#081F2D] mt-0.5 font-sans">
                          {lang === "bn" ? out.titleBn : out.titleEn}
                        </h2>
                      </div>

                      <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded self-start sm:self-auto">
                        {out.verificationState} ({(out.confidence * 100).toFixed(0)}% Confidence)
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-stone-500">Baseline: {out.baseline} {out.unit}</span>
                        <span className="font-bold text-[#081F2D]">
                          Actual: {out.actual} / Target: {out.target} {out.unit} ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#FF6B35] h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
                      <span>Methodology: <strong>{out.methodology}</strong></span>
                      <span>Evidence Ref: <strong className="font-mono text-[#0B2B43]">{out.evidenceRef}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 05: FINANCE (SECTION 14)
            ======================================================================= */}
        {activeSegment === "finance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 05 • FINANCIAL DASHBOARD & RATIOS
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? `${activeProject.nameBn}: আর্থিক নিয়ন্ত্রণ ও ইউনিট ইকোনমিক্স` : `${activeProject.nameEn}: Financial Dashboard`}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "কম ব্যয় মানেই ভালো নয়। এখানে সরাসরি প্রকল্প ব্যয়, শেয়ার্ড অপারেশনাল ব্যয় এবং ওভারহেড স্পষ্টভাবে পৃথকীকৃত।"
                  : "Financial partition: Direct Spend vs Shared/Indirect vs Overhead. Never unformatted plain text."}
              </p>
            </div>

            {/* Primary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white p-3.5 rounded-xl border border-[#E7E7E2] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">FUNDS RECEIVED</span>
                <div className="text-lg font-bold font-mono text-[#081F2D] mt-1">
                  ৳{(activeProject.finance.fundingReceived / 100000).toFixed(1)}L
                </div>
                <span className="text-[10px] text-stone-500">100% credited</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E7E7E2] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">COMMITTED</span>
                <div className="text-lg font-bold font-mono text-amber-700 mt-1">
                  ৳{(activeProject.finance.fundingCommitted / 100000).toFixed(1)}L
                </div>
                <span className="text-[10px] text-stone-500">PO / Contracts</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E7E7E2] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">DIRECT COST</span>
                <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
                  ৳{(activeProject.finance.directExpenditure / 100000).toFixed(1)}L
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">96.8% Field direct</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E7E7E2] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">INDIRECT / SHARED</span>
                <div className="text-lg font-bold font-mono text-blue-700 mt-1">
                  ৳0.0L
                </div>
                <span className="text-[10px] text-stone-500">Central logistics</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E7E7E2] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">OVERHEAD</span>
                <div className="text-lg font-bold font-mono text-stone-700 mt-1">
                  ৳{(activeProject.finance.overheadExpenditure / 1000).toFixed(0)}k
                </div>
                <span className="text-[10px] text-stone-500">3.2% (Cap: 15%)</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E7E7E2] shadow-sm">
                <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">AVAILABLE</span>
                <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
                  ৳{(activeProject.finance.fundingAvailable / 100000).toFixed(1)}L
                </div>
                <span className="text-[10px] text-emerald-700 font-semibold">Unencumbered</span>
              </div>
            </div>

            {/* Budget vs Actual & Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Budget vs Actual */}
              <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[#081F2D] font-sans">
                  {lang === "bn" ? "বাজেট বনাম প্রকৃত ব্যয় (Budget vs Actual)" : "Budget vs Actual Expenditure"}
                </h2>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-stone-500">Total Budget: ৳{(activeProject.finance.budgetTotal / 100000).toLocaleString()}L</span>
                    <span className="font-bold text-[#081F2D]">Spent: ৳{(activeProject.finance.budgetSpent / 100000).toLocaleString()}L ({activeProject.finance.budgetUtilizationPct}%)</span>
                  </div>
                  <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${activeProject.finance.budgetUtilizationPct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                    <span className="text-stone-400 block text-[10px]">PAYABLES</span>
                    <strong className="text-amber-800">৳{activeProject.finance.payables.toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                    <span className="text-stone-400 block text-[10px]">RECEIVABLES</span>
                    <strong className="text-emerald-800">৳{activeProject.finance.receivables.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Efficiency Ratios */}
              <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[#081F2D] font-sans">
                  {lang === "bn" ? "অর্থনৈতিক দক্ষতা ও অনুপাত (Unit Economics)" : "Performance & Efficiency Ratios"}
                </h2>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                    <span className="text-stone-400 block font-mono text-[10px]">COST / BENEFICIARY</span>
                    <div className="font-bold font-mono text-base text-[#081F2D] mt-0.5">
                      ৳{activeProject.finance.costPerBeneficiary.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                    <span className="text-stone-400 block font-mono text-[10px]">COST / OUTCOME</span>
                    <div className="font-bold font-mono text-base text-[#FF6B35] mt-0.5">
                      ৳{activeProject.kpis.costPerOutcome.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                    <span className="text-stone-400 block font-mono text-[10px]">OVERHEAD %</span>
                    <div className="font-bold font-mono text-base text-emerald-800 mt-0.5">
                      {activeProject.kpis.overheadPct}%
                    </div>
                  </div>
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                    <span className="text-stone-400 block font-mono text-[10px]">FUNDING UTILIZATION</span>
                    <div className="font-bold font-mono text-base text-blue-700 mt-0.5">
                      {activeProject.finance.budgetUtilizationPct}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 06: PEOPLE (SECTION 17)
            ======================================================================= */}
        {activeSegment === "people" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 06 • PEOPLE, PARTIES & RELATIONSHIPS
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "ব্যক্তিবর্গ ও বহুমুখী সম্পর্ক মডেল" : "People, Parties & Relationship System"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "মৌলিক নীতি: পার্টি ≠ ব্যবহারকারী অ্যাকাউন্ট, সম্পর্ক ≠ ভূমিকা। ব্যক্তি রফিকুল ইসলাম একই সাথে বাণিজ্যিক ইউনিটের ইজারাগ্রহীতা এবং ক্ষুদ্রঋণগ্রহীতা।"
                  : "Party ≠ User ≠ Role ≠ Relationship. A person can simultaneously hold different project relationships."}
              </p>
            </div>

            {/* Relationship Demonstration */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#081F2D] font-sans">
                {lang === "bn" ? "বহুমুখী সম্পর্ক ম্যাট্রিক্স (Multi-Role Relationship Engine)" : "Party Multi-Role Demonstration"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] space-y-2 text-xs">
                  <div className="text-[11px] font-mono font-bold text-[#FF6B35]">STFL-DEMO-P-000004</div>
                  <div className="font-bold text-sm text-[#081F2D]">Rafiqul Islam</div>
                  <div className="text-stone-500 font-mono text-[11px]">Type: PERSON (Citizen)</div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      LESSEE (Unit 4B)
                    </span>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      BORROWER (Microfinance)
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] space-y-2 text-xs">
                  <div className="text-[11px] font-mono font-bold text-[#FF6B35]">STFL-DEMO-P-000002</div>
                  <div className="font-bold text-sm text-[#081F2D]">Community Philanthropic Estate Fund</div>
                  <div className="text-stone-500 font-mono text-[11px]">Type: COMMUNITY TRUST</div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      LESSOR (Agrabad Complex)
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] space-y-2 text-xs">
                  <div className="text-[11px] font-mono font-bold text-[#FF6B35]">STFL-DEMO-P-000003</div>
                  <div className="font-bold text-sm text-[#081F2D]">Agrabad Commercial Complex</div>
                  <div className="text-stone-500 font-mono text-[11px]">Type: COMMERCIAL ASSET</div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      LANDLORD (12 Units)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stakeholder Directory */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#081F2D] mb-4 font-sans">
                {lang === "bn" ? `${activeProject.nameBn}: সংশ্লিষ্ট ব্যক্তিবর্গ` : `${activeProject.nameEn}: Stakeholders`}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeProject.people.map((p) => (
                  <div key={p.partyId} className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] text-stone-400">{p.partyId}</span>
                        <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                          {p.relationship}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-[#081F2D] font-sans">{p.name}</div>
                      <div className="text-stone-600 mt-0.5">{lang === "bn" ? p.roleBn : p.roleEn}</div>
                    </div>
                    <div className="text-right text-stone-500 font-mono">
                      <div>{p.location}</div>
                      <div className="text-[11px] text-stone-400">{p.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 07: DOCUMENTS (SECTION 18)
            ======================================================================= */}
        {activeSegment === "documents" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 07 • IMMUTABLE DOCUMENTS & CONTROLLED PRINT
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "অফিসিয়াল নথিপত্র ও নিয়ন্ত্রিত মুদ্রণ" : "Official Documents & Controlled Print"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "নিয়ন্ত্রিত মুদ্রণ একটি মূল ড্যাশবোর্ডের অংশ নয়; এটি নথির ভেতরের সুরক্ষিত অ্যাকশন। একক ব্যবহারের টোকেন ও ফরেনসিক জলছাপ সহ।"
                  : "Controlled print belongs inside Documents -> Controlled Documents. Enforces ephemeral single-use tokens and forensic watermarks."}
              </p>
            </div>

            {/* Document Cards Table & Controlled Print Action */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Official Documents List */}
              <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-[#081F2D] font-sans">
                  {lang === "bn" ? "প্রকল্পের অফিসিয়াল নথি খতিয়ান" : "Official Project Documents"}
                </h2>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-stone-400">STFL-DEMO-DOC-000001</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        ISSUED
                      </span>
                    </div>
                    <div className="font-bold text-sm text-[#081F2D] font-sans">
                      Commercial Lease 4B Tenancy Agreement
                    </div>
                    <div className="text-stone-500 text-[11px] font-mono truncate">
                      Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                      <Link href="/v/DEMO-LSE-4B" className="text-xs text-[#FF6B35] font-semibold hover:underline flex items-center gap-1">
                        <Eye width={12} height={12} />
                        <span>Public QR Verify</span>
                      </Link>
                      <button
                        onClick={handleGeneratePrintToken}
                        className="bg-[#081F2D] hover:bg-[#FF6B35] text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Printer width={12} height={12} />
                        <span>Controlled Print Grant</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E7E7E2] bg-[#FAFAF8] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-stone-400">STFL-DEMO-DOC-000002</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        APPROVED
                      </span>
                    </div>
                    <div className="font-bold text-sm text-[#081F2D] font-sans">
                      Board Resolution 2026/04 (Community Endowment)
                    </div>
                    <div className="text-stone-500 text-[11px] font-mono truncate">
                      Hash: 8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-xs text-stone-500 font-mono">Dual Control Ratified</span>
                      <button
                        onClick={handleGeneratePrintToken}
                        className="bg-[#081F2D] hover:bg-[#FF6B35] text-white text-xs font-semibold px-2.5 py-1 rounded transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <Printer width={12} height={12} />
                        <span>Controlled Print Grant</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controlled Print Monitor */}
              <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Printer width={18} height={18} className="text-[#FF6B35]" />
                    <h2 className="text-base font-bold text-[#081F2D] font-sans">
                      {lang === "bn" ? "নিয়ন্ত্রিত প্রিন্ট গ্রান্ট ও ওয়াটারমার্ক" : "Controlled Print Token Grant"}
                    </h2>
                  </div>
                  <p className="text-xs text-stone-600 mb-4">
                    {lang === "bn"
                      ? "ডিফল্ট ব্রাউজার প্রিন্ট নিষিদ্ধ। একক-ব্যবহারের স্বল্পমেয়াদী টোকেন (TTL: ৩০০ সেকেন্ড) এবং দৃশ্যমান ফরেনসিক জলছাপ কার্যকর হয়।"
                      : "Zero uncontrolled printing. Enforces one-time print token, 300s TTL countdown, and forensic user/timestamp watermark."}
                  </p>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                    {printToken ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-emerald-800 font-bold text-sm">
                            TOKEN: {printToken}
                          </span>
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            ACTIVE GRANT
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-600">
                          TTL: 300 seconds • One-time consumption • Copy ID: CPY-01-DEMO
                        </div>
                        <div className="text-[11px] text-stone-700 bg-white p-2 rounded border border-amber-200 font-mono leading-relaxed">
                          Forensic Watermark Stamp:<br />
                          STFL DEMO — NON-PRODUCTION — USER: {selectedIdentity.nameEn} ({selectedIdentity.userId}) — {new Date().toISOString()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-stone-600 py-4 text-center font-mono">
                        No active print grant. Click &apos;Controlled Print Grant&apos; on any official document to issue an ephemeral forensic token.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-500 font-mono">
                  Enforces Invariant #6: Controlled Print & Forensic Attribution
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 08: COMPLIANCE (SECTION 19)
            ======================================================================= */}
        {activeSegment === "compliance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 08 • STATUTORY COMPLIANCE & LEGAL INTELLIGENCE
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "আইনগত ও নিয়ন্ত্রক সম্মতি (21 Statutory Domains)" : "Statutory Compliance & Legal Intelligence"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "এনজিও বিষয়ক ব্যুরো, শ্রম আইন, শিশু সুরক্ষা ও সম্পত্তি আইনসহ ২১টি আইনি ক্ষেত্রে স্বয়ংক্রিয় নজরদারি।"
                  : "Clear severity states: CLEAR, ADVISORY, WARNING, REVIEW REQUIRED, HOLD, BLOCKED. Restrained palette without excessive red."}
              </p>
            </div>

            {/* Severity Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-2 rounded-lg font-bold">CLEAR</div>
              <div className="bg-blue-50 border border-blue-300 text-blue-800 p-2 rounded-lg font-bold">ADVISORY</div>
              <div className="bg-amber-50 border border-amber-300 text-amber-800 p-2 rounded-lg font-bold">WARNING</div>
              <div className="bg-purple-50 border border-purple-300 text-purple-800 p-2 rounded-lg font-bold">REVIEW REQ</div>
              <div className="bg-orange-50 border border-orange-300 text-orange-800 p-2 rounded-lg font-bold">HOLD</div>
              <div className="bg-rose-50 border border-rose-300 text-rose-800 p-2 rounded-lg font-bold">BLOCKED</div>
            </div>

            {/* Compliance Domains List */}
            <div className="space-y-3">
              {activeProject.compliance.map((c) => (
                <div key={c.domainId} className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[#081F2D] font-sans">
                      {lang === "bn" ? c.nameBn : c.nameEn}
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                        c.status === "CLEAR"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : c.status === "BLOCKED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-stone-600 leading-relaxed">{c.details}</p>

                  <div className="text-[11px] font-mono text-stone-400 pt-1 border-t border-stone-100 flex justify-between">
                    <span>Statutory Ref: {c.statutoryRef}</span>
                    <span>Evaluated: {c.lastEvaluated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 09: GOVERNANCE (SECTION 20)
            ======================================================================= */}
        {activeSegment === "governance" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 09 • GOVERNANCE, APPROVALS & POLICIES
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "শাসন, অনুমোদন ও সাংবিধানিক দায়িত্ব পৃথকীকরণ" : "Governance, Approvals & Separation of Duties"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "প্রথমে ব্যবসায়িক ফলাফল ও অনুমোদন প্রক্রিয়া প্রদর্শিত হয়; প্রযুক্তিগত মূল্যায়ন বোতামের মাধ্যমে বিস্তারিত দেখা যায়।"
                  : "Business approvals presented first. Technical authorization details available through [View Technical Evaluation]."}
              </p>
            </div>

            {/* Dual Control Approvals */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#081F2D] font-sans">
                  {lang === "bn" ? "অপেক্ষমাণ আর্থিক ও নীতিগত অনুমোদন" : "Pending Approvals"}
                </h2>
                <button
                  onClick={() => setTechEvalOpen(!techEvalOpen)}
                  className="text-xs text-[#0B2B43] font-semibold border border-stone-300 px-2.5 py-1 rounded hover:bg-stone-50 transition-colors"
                >
                  {techEvalOpen ? "Hide Technical Evaluation" : "View Technical Evaluation"}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#FAFAF8] border border-[#E7E7E2] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      LEVEL 3 RELEASE
                    </span>
                    <span className="font-mono text-stone-500 font-semibold">{activeProject.nameEn}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#081F2D] font-sans">
                    Rural Solar Literacy Tablets Procurement Variance (৳185,000)
                  </h3>
                  <p className="text-stone-600 mt-0.5">
                    Quotation variance exceeds catalog threshold. Dual-Control Human Approval Required.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {approvedItems["APP-01"] === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded">
                      <CheckCircle width={14} height={14} /> Approved by {selectedIdentity.code}
                    </span>
                  ) : approvedItems["APP-01"] === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded">
                      <XmarkCircle width={14} height={14} /> Rejected
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setApprovedItems((prev) => ({ ...prev, "APP-01": "APPROVED" }))}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm"
                      >
                        Approve Release
                      </button>
                      <button
                        onClick={() => setApprovedItems((prev) => ({ ...prev, "APP-01": "REJECTED" }))}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Technical Evaluation Section */}
              {techEvalOpen && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs font-mono space-y-2 text-purple-950">
                  <div className="font-bold">Cryptographic Evaluation & Separation of Duties Invariant:</div>
                  <div className="text-[11px] leading-relaxed">
                    Hash: 0x9f28a7b6c5d4e3f2 • Signers Required: 2 • Current Signer: {selectedIdentity.userId} ({selectedIdentity.role})<br />
                    Constitutional Invariant SoD_03: Verified initiator (Sarah Khan) is different from approving officer.<br />
                    Dual-Ledger Commit: pending ticket state in approval_tickets and immutably broadcast to audit_logs.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 10: ADMINISTRATION (SECTION 23 - 18 CONSOLES DIRECTORY)
            ======================================================================= */}
        {activeSegment === "admin" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 10 • 18 GOVERNED MANAGEMENT CONSOLES
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "১৮টি পরিচালিত কনসোল ডিরেক্টরি" : "18 Governed Management Consoles"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? `বর্তমানে সক্রিয় পরিচয় '${selectedIdentity.code}' এর ভিত্তিতে প্রতিটি কনসোলের অনুমতি স্তর প্রদর্শিত হচ্ছে।`
                  : `Grouped consoles directory for active user class '${selectedIdentity.code}'. Operational tasks are separated from administrative consoles.`}
              </p>
            </div>

            <div className="space-y-5">
              {MANAGEMENT_CLUSTERS.map((cluster) => {
                const consolesInCluster = CONSOLES_CATALOG.filter((c) =>
                  cluster.consoleCodes.includes(c.code)
                );

                return (
                  <div key={cluster.clusterId} className="bg-white rounded-xl border border-[#E7E7E2] p-5 shadow-sm">
                    <div className="mb-3 pb-2 border-b border-[#E7E7E2]">
                      <h2 className="text-sm font-bold text-[#081F2D] font-sans">
                        {lang === "bn" ? cluster.nameBn : cluster.nameEn}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {consolesInCluster.map((item) => {
                        const access = evaluateClientConsoleAccess(item.code, selectedIdentity.code);
                        const isDenied = access === "DENIED";

                        return (
                          <Link
                            key={item.code}
                            href={item.route}
                            className={`p-3 rounded-xl border text-xs transition-all ${
                              isDenied
                                ? "bg-stone-50 border-stone-200 opacity-60 hover:opacity-80"
                                : "bg-[#FAFAF8] border-[#E7E7E2] hover:border-[#FF6B35] hover:bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[10px] text-stone-400">#{item.idNumber}</span>
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                                  access === "FULL"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : access === "MANAGE"
                                    ? "bg-blue-100 text-blue-800"
                                    : access === "DENIED"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-stone-200 text-stone-700"
                                }`}
                              >
                                {access}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-[#081F2D] truncate font-sans">
                              {lang === "bn" ? item.nameBn : item.nameEn}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 11: SECURITY & 12-DIMENSIONAL AUTHORIZATION LAB (SECTION 21)
            ======================================================================= */}
        {activeSegment === "security" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 11 • SECURITY & 12-DIMENSIONAL AUTHORIZATION LAB
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "নিরাপত্তা ও ১২-মাত্রিক অনুমোদন ল্যাব" : "Security Posture & 12-Dimensional Policy Lab"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "১২-মাত্রিক নীতি মূল্যায়ন সিমুলেটর এখন নিরাপত্তা সেগমেন্টের ভেতরে সংরক্ষিত। সাধারণ পৃষ্ঠায় অপ্রয়োজনীয় বিশৃঙ্খলা তৈরি করে না।"
                  : "The 12-dimensional authorization simulator is now properly housed inside Security -> Authorization Lab."}
              </p>
            </div>

            {/* 12-Dimensional Contextual Authorization Simulator */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#081F2D] font-sans">
                  {lang === "bn" ? "১২-মাত্রিক কনটেক্সচুয়াল পলিসি সিমুলেটর" : "12-Dimensional Contextual Evaluation Simulator"}
                </h2>
                <p className="text-xs text-stone-500">
                  Testing operational action under identity: <strong>{selectedIdentity.code} ({selectedIdentity.role})</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#E7E7E2] space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Target Domain</label>
                    <select
                      value={simDomain}
                      onChange={(e) => setSimDomain(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#FF6B35] outline-none"
                    >
                      <option value="FINANCE">FINANCE (অর্থ ও তহবিল বিতরণ)</option>
                      <option value="PROPERTY">PROPERTY (সম্পত্তি ও বাণিজ্যিক ইজারা)</option>
                      <option value="MICROFINANCE">MICROFINANCE (বিনা-সুদে ক্ষুদ্রঋণ)</option>
                      <option value="DOCUMENTS">DOCUMENTS (অফিসিয়াল আইনি নথি)</option>
                      <option value="SECURITY">SECURITY (নিরাপত্তা ও কিল সুইচ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Requested Action</label>
                    <select
                      value={simAction}
                      onChange={(e) => setSimAction(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#FF6B35] outline-none"
                    >
                      <option value="disburse">disburse (অর্থ বিতরণ — Level 4 Mutation)</option>
                      <option value="lease.create">lease.create (ইজারা চুক্তি সৃষ্টি — Level 3)</option>
                      <option value="read_ledger">read_ledger (খতিয়ান পরিদর্শন — Level 1)</option>
                      <option value="issue_document">issue_document (নথি প্রকাশ — Level 3)</option>
                      <option value="kill_agent">kill_agent (এজেন্ট বন্ধ — Level 5)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Amount (BDT)</label>
                    <input
                      type="number"
                      value={simAmount}
                      onChange={(e) => setSimAmount(Number(e.target.value))}
                      className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#FF6B35] outline-none"
                    />
                  </div>

                  <button
                    onClick={handleRunAuthCheck}
                    className="w-full bg-[#081F2D] hover:bg-[#FF6B35] text-white text-xs font-semibold py-2.5 rounded transition-colors shadow-sm"
                  >
                    Evaluate 12 Dimensions
                  </button>
                </div>

                <div className="lg:col-span-2 bg-[#FAFAF8] p-4 rounded-xl border border-[#E7E7E2] flex flex-col justify-between text-xs">
                  <div>
                    <div className="font-semibold text-stone-500 uppercase tracking-wider mb-2 font-mono text-[10px]">
                      DECISION RESULT
                    </div>

                    {simResult.tested ? (
                      <div
                        className={`p-4 rounded-xl border mb-3 ${
                          simResult.decision === "ALLOW"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                            : simResult.decision === "ESCALATE"
                            ? "bg-blue-50 border-blue-300 text-blue-950"
                            : "bg-rose-50 border-rose-300 text-rose-950"
                        }`}
                      >
                        <div className="font-bold text-sm mb-1 font-mono">DECISION: {simResult.decision}</div>
                        <p className="text-xs leading-relaxed">{simResult.reason}</p>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-stone-500 border border-dashed border-stone-300 rounded-xl mb-3 font-mono">
                        Click &apos;Evaluate 12 Dimensions&apos; to run the server policy engine.
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                      <div className="p-2 bg-white rounded border border-stone-200">
                        <span className="text-stone-400 block text-[9px]">Actor Masquerade</span>
                        <strong className="truncate block">{selectedIdentity.role}</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-stone-200">
                        <span className="text-stone-400 block text-[9px]">User Class</span>
                        <strong>{selectedIdentity.code}</strong>
                      </div>
                      <div className="p-2 bg-white rounded border border-stone-200">
                        <span className="text-stone-400 block text-[9px]">Separation of Duties</span>
                        <strong>{selectedIdentity.code === "CLASS_00" && simDomain === "FINANCE" ? "BLOCKED" : "CLEARED"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200 text-[10px] text-stone-500 flex justify-between font-mono">
                    <span>Deterministic evaluation</span>
                    <span className="text-emerald-700">Logged in audit_logs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 12: AGENTS & AGENT LAB (SECTION 22)
            ======================================================================= */}
        {activeSegment === "agents" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 12 • AUTONOMOUS AI AGENT RUNTIME & LAB
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "স্বায়ত্তশাসিত এআই এজেন্ট ড্যাশবোর্ড ও ল্যাব" : "Autonomous AI Agent Runtime & Lab"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "স্বায়ত্তশাসিত এজেন্টরা লেভেল ৩ (নীতি প্রয়োগ) পর্যন্ত কাজ করে। লেভেল ৪ (অর্থ বিতরণ) বা অনিশ্চয়তা (< ০.৯৮) ঘটলে বাধ্যতামূলকভাবে মানুষের অনুমোদনের টিকিট তৈরি হয়।"
                  : "Level 3 autonomous ceiling. Level 4 actions or confidence < 0.98 unconditionally trigger human approval tickets. Agents NEVER self-approve."}
              </p>
            </div>

            {/* Normal Agent View */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#081F2D] font-sans">
                    Departmental Finance Agent Fleet
                  </h2>
                  <span className="font-mono text-xs text-stone-400">ID: STFL-DEMO-AGT-FIN-001</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    STATUS: RUNNING
                  </span>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                    KILL SWITCH: READY (&lt;50ms)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                  <span className="text-stone-400 block text-[10px]">CURRENT TASKS</span>
                  <strong className="text-sm text-[#081F2D]">4 Audits Running</strong>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                  <span className="text-stone-400 block text-[10px]">RECOMMENDATIONS</span>
                  <strong className="text-sm text-amber-700">1 Variance Ticket</strong>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                  <span className="text-stone-400 block text-[10px]">CONFIDENCE</span>
                  <strong className="text-sm text-emerald-700">0.99 (High)</strong>
                </div>
                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                  <span className="text-stone-400 block text-[10px]">HUMAN REVIEW</span>
                  <strong className="text-sm text-blue-700">Mandatory on L4</strong>
                </div>
              </div>
            </div>

            {/* Agent Lab Sandbox */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#081F2D] font-sans">
                {lang === "bn" ? "এজেন্ট ল্যাব স্যান্ডবক্স (Agent Lab Sandbox)" : "Agent Lab Sandbox & Threshold Testing"}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#E7E7E2] space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Agent Experimental Tool</label>
                    <select
                      value={agentTool}
                      onChange={(e) => setAgentTool(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-[#FF6B35] outline-none"
                    >
                      <option value="read_ledger">read_ledger (লেভেল ১ — পঠন ও বিশ্লেষণ)</option>
                      <option value="prepare_voucher">prepare_voucher (লেভেল ২ — ড্রাফট ভাউচার)</option>
                      <option value="calculate_due_rent">calculate_due_rent (লেভেল ৩ — নিয়ম প্রয়োগ)</option>
                      <option value="disburse_funds">disburse_funds (লেভেল ৪ — অর্থ বিতরণ — Gated)</option>
                      <option value="cancel_lease">cancel_lease (লেভেল ৪ — চুক্তি বাতিল — Gated)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold text-stone-700 mb-1">
                      <span>Confidence Score:</span>
                      <span className="font-mono text-[#FF6B35] font-bold">{agentConfidence.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.80"
                      max="1.00"
                      step="0.01"
                      value={agentConfidence}
                      onChange={(e) => setAgentConfidence(Number(e.target.value))}
                      className="w-full accent-[#FF6B35]"
                    />
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Threshold: 0.98. Any score below 0.98 triggers human review ticket.
                    </span>
                  </div>

                  <button
                    onClick={handleRunAgentTool}
                    className="w-full bg-[#081F2D] hover:bg-[#FF6B35] text-white text-xs font-semibold py-2.5 rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Cpu width={14} height={14} />
                    <span>Execute Tool in Sandbox</span>
                  </button>
                </div>

                <div className="lg:col-span-2 bg-[#081F2D] text-white p-6 rounded-xl border border-[#0B2B43] flex flex-col justify-between text-xs">
                  <div>
                    <div className="flex items-center justify-between text-stone-400 mb-3 pb-2 border-b border-stone-800 font-mono text-[11px]">
                      <span>SANDBOX MONITOR</span>
                      <span className="text-emerald-400">DUAL LEDGER ACTIVE</span>
                    </div>

                    {agentOutput ? (
                      <div className="font-mono text-xs p-4 rounded-lg bg-black/40 border border-stone-700 leading-relaxed text-stone-200">
                        {agentOutput}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-stone-500 font-mono">
                        Select a tool and confidence score on the left, then click &apos;Execute Tool in Sandbox&apos;.
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between font-mono">
                    <span>Dual Ledger: agent_tasks + audit_logs</span>
                    <span className="text-[#FF6B35]">No recursive self-approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            SEGMENT 13: SYSTEM & LEDGER INTEGRITY (SECTION 8)
            ======================================================================= */}
        {activeSegment === "system" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <span className="text-[11px] font-mono font-bold text-[#FF6B35] uppercase">
                SEGMENT 13 • SYSTEM, POSTGRESQL AUTHORITY & AUDIT LEDGER
              </span>
              <h1 className="text-2xl font-bold text-[#081F2D] mt-1 font-sans">
                {lang === "bn" ? "সিস্টেম স্থিতি ও অপরিবর্তনীয় খতিয়ান" : "System Status & Immutable Ledger"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? "পোস্টগ্রেসকিউএল ডেটাবেস হলো সত্যের একমাত্র উৎস। সমস্ত ক্রিয়াকলাপের ক্রিপ্টোগ্রাফিক হ্যাশ চেইন এবং অডিট লগ নিরীক্ষাযোগ্য।"
                  : "PostgreSQL is the single source of truth. Continuous cryptographic hash-chain verification and zero network egress."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-2">
                <span className="text-stone-400 text-[10px] block font-bold">DATABASE AUTHORITY</span>
                <div className="text-emerald-700 font-bold text-base flex items-center gap-1.5">
                  <CheckCircle width={16} height={16} /> PostgreSQL Primary
                </div>
                <p className="text-stone-500 text-[11px] font-sans">
                  Fictional demo data strictly segregated. Invariant #1 enforced.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-2">
                <span className="text-stone-400 text-[10px] block font-bold">HASH CHAIN INTEGRITY</span>
                <div className="text-emerald-700 font-bold text-base flex items-center gap-1.5">
                  <CheckCircle width={16} height={16} /> 0 Tampering Detected
                </div>
                <p className="text-stone-500 text-[11px] font-sans">
                  Continuous SHA-256 state roll. Invariant #2 enforced.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-2">
                <span className="text-stone-400 text-[10px] block font-bold">EGRESS SECURITY</span>
                <div className="text-emerald-700 font-bold text-base flex items-center gap-1.5">
                  <CheckCircle width={16} height={16} /> Zero External Egress
                </div>
                <p className="text-stone-500 text-[11px] font-sans">
                  Guaranteed air-gapped demo isolation. Invariant #10 enforced.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          INSTITUTIONAL FOOTER & ATTRIBUTION (SECTIONS 02, 06, 48, 49)
          ========================================================================= */}
      <footer className="border-t border-[#E7E7E2] bg-white text-xs mt-12 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[#5A6B75]">
          <div className="flex items-center gap-3">
            <Image
              src="/stfl-mark-transparent.png"
              alt="SohaelTasneem Foundation"
              width={26}
              height={26}
              className="object-contain"
            />
            <div>
              <div className="font-bold text-[#081F2D] text-xs">
                SohaelTasneem Foundation
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                STFL VI · {lang === "bn" ? "প্রাতিষ্ঠানিক অপারেটিং সিস্টেম" : "Institutional Operating System"}
              </div>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <div className="text-[11px] text-[#081F2D] font-sans font-medium">
              {lang === "bn"
                ? "ঢাকা, কুয়ালালামপুর, ওয়াইওমিং ও ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসার সাথে নির্মিত।"
                : "Made with love from Dhaka, Kuala Lumpur, Wyoming & Varizen Inc."}
            </div>
            <div className="text-[10px] text-[#5A6B75] font-mono flex flex-wrap items-center justify-center md:justify-end gap-2">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <CheckCircle width={11} height={11} /> {lang === "bn" ? "অপরিবর্তনীয় খতিয়ান সুরক্ষিত" : "Immutable Ledger Verified"}
              </span>
              <span>•</span>
              <span>{lang === "bn" ? "সংবিধানের ১২টি শর্ত সক্রিয়" : "12 Invariants Active"}</span>
              <span>•</span>
              <span className="text-cyan-600 font-semibold font-mono">STFL VI 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          4. MY WORK DRAWER / MODAL
          ========================================================================= */}
      {myWorkOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E7E7E2] max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <TaskList width={18} height={18} className="text-[#FF6B35]" />
                <h3 className="font-bold text-base text-[#081F2D] font-sans">
                  {lang === "bn" ? "আমার দায়িত্ব তালিকা (My Work)" : "My Work Items"}
                </h3>
              </div>
              <button
                onClick={() => setMyWorkOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2">
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#081F2D]">Review Variance Approval APP-01</div>
                  <div className="text-[10px] text-stone-500 font-mono">Assigned to: {selectedIdentity.role}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  PENDING
                </span>
              </div>

              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#081F2D]">Quarterly Project Outcome Audit</div>
                  <div className="text-[10px] text-stone-500 font-mono">Education Access 2026</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                  DUE SOON
                </span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setMyWorkOpen(false)}
                className="px-4 py-1.5 rounded text-xs font-semibold bg-[#081F2D] text-white hover:bg-[#FF6B35] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. NOTIFICATIONS MODAL
          ========================================================================= */}
      {notifOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E7E7E2] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell width={18} height={18} className="text-[#FF6B35]" />
                <h3 className="font-bold text-base text-[#081F2D] font-sans">
                  {lang === "bn" ? "বিজ্ঞপ্তি ও বার্তা" : "Notifications & Approvals"}
                </h3>
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-600 space-y-2">
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs">
                <div className="font-bold text-amber-950">Level 3 Dual-Control Approval Required</div>
                <div className="text-[11px] text-amber-900 mt-0.5">Rural Solar Literacy Tablets Procurement Variance (৳185,000)</div>
              </div>
              <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-xs">
                <div className="font-bold text-blue-950">NGOAB FD-7 6-Month Renewal Window</div>
                <div className="text-[11px] text-blue-900 mt-0.5">Statutory Filing due within 14 days</div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setNotifOpen(false)}
                className="px-4 py-1.5 rounded text-xs font-semibold bg-[#081F2D] text-white hover:bg-[#FF6B35] transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. DEMO RESET CONFIRMATION MODAL (SECTION 30 & 33)
          ========================================================================= */}
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stone-300 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <WarningTriangle width={24} height={24} />
              <h3 className="font-bold text-base text-[#081F2D] font-sans">
                {lang === "bn" ? "ডেমো ডেটা রিসেট নিশ্চিতকরণ" : "Confirm Demo Data Reset"}
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {lang === "bn"
                ? "এটি শুধুমাত্র 'STFL-DEMO-*' চিহ্নিত ডেমো রেকর্ডগুলো পুনরুদ্ধার করবে। উৎপাদন ডেটাবেসে কোনো প্রভাব পড়বে না। নিশ্চিত করতে নিচে 'CONFIRM_DEMO_RESET' লিখুন:"
                : "This resets only 'STFL-DEMO-*' fictional records to default state. Production database is strictly isolated. Type 'CONFIRM_DEMO_RESET' to execute:"}
            </p>

            <input
              type="text"
              value={resetInput}
              onChange={(e) => setResetInput(e.target.value)}
              placeholder="CONFIRM_DEMO_RESET"
              className="w-full text-xs font-mono p-2.5 border border-stone-300 rounded focus:ring-1 focus:ring-rose-500 outline-none"
            />

            {resetMessage && (
              <div className="text-xs p-2.5 rounded bg-stone-100 font-mono text-stone-800">
                {resetMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setResetModalOpen(false);
                  setResetInput("");
                  setResetMessage(null);
                }}
                className="px-3 py-1.5 rounded text-xs text-stone-600 hover:bg-stone-100"
              >
                {lang === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 rounded text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow"
              >
                {lang === "bn" ? "রিসেট সম্পন্ন করুন" : "Execute Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
