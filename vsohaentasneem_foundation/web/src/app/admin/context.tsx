"use client";

import React, { createContext, useContext, useState } from "react";

export type UserClass =
  | "CLASS_00" // Super Admin
  | "CLASS_01" // Trustee
  | "CLASS_02" // Executive Command
  | "CLASS_03" // Unit Head
  | "CLASS_04" // Officer
  | "CLASS_05" // Field Worker
  | "CLASS_06" // Finance Specialist
  | "CLASS_07" // Security Officer
  | "CLASS_08" // Document Officer
  | "CLASS_09" // HR Specialist
  | "CLASS_10" // AI Agent
  | "CLASS_11" // External Party
  | "CLASS_12" // Public Citizen
  | "MODERATOR_A" // User / Operational Support Relief
  | "MODERATOR_B"; // Technical / Compliance Relief

export type ConsoleAccessLevel =
  | "FULL"
  | "MANAGE"
  | "OVERSIGHT"
  | "OPERATIONAL"
  | "FIELD"
  | "LIMITED"
  | "ISSUE_GATED"
  | "OWN_EVENTS"
  | "DENIED";

export interface ConsoleInfo {
  code: string;
  idNumber: number;
  nameBn: string;
  nameEn: string;
  category: "governance_command" | "operational_units" | "trust_comms_docs" | "security_fleets" | "platform_core";
  route: string;
  primaryClasses: UserClass[];
  descriptionBn: string;
  descriptionEn: string;
}

export const CONSOLES_CATALOG: ConsoleInfo[] = [
  {
    code: "iam",
    idNumber: 1,
    nameBn: "পরিচয় ও প্রবেশাধিকার কেন্দ্র",
    nameEn: "Identity & Access Center",
    category: "platform_core",
    route: "/admin/iam",
    primaryClasses: ["CLASS_00", "CLASS_07"],
    descriptionBn: "পার্টি, ব্যবহারকারী, পরিচয়পত্র, ভূমিকা, পরিধি এবং প্রতিনিধি ব্যবস্থাপনা।",
    descriptionEn: "Universal management of Parties, Users, Credentials, Roles, Scopes, and Delegations.",
  },
  {
    code: "governance",
    idNumber: 2,
    nameBn: "শাসন ও পরিচালনা পর্ষদ কেন্দ্র",
    nameEn: "Governance Center",
    category: "governance_command",
    route: "/admin/governance",
    primaryClasses: ["CLASS_01"],
    descriptionBn: "বোর্ড রেজোলিউশন, স্থায়ী ট্রাস্ট দলিল তদারকি, প্রাতিষ্ঠানিক ঝুঁকি এবং লেভেল ৫ ডুয়াল-কন্ট্রোল অনুমোদন।",
    descriptionEn: "Board resolutions, statutory endowment oversight, institutional risk heatmaps, Level 5 dual-control approvals.",
  },
  {
    code: "executive",
    idNumber: 3,
    nameBn: "নির্বাহী কমান্ড সেন্টার",
    nameEn: "Executive Command Center",
    category: "governance_command",
    route: "/admin/executive",
    primaryClasses: ["CLASS_02"],
    descriptionBn: "আন্তঃবিভাগীয় কেপিআই, কৌশলগত বাজেট ব্যবহার, মানবিক জরুরি অবস্থা ঘোষণা ও উচ্চস্তরের সমন্বয়।",
    descriptionEn: "Cross-unit KPIs, strategic budget utilization, humanitarian emergency declarations, executive escalations.",
  },
  {
    code: "finance",
    idNumber: 4,
    nameBn: "অর্থ নিয়ন্ত্রণ কেন্দ্র",
    nameEn: "Finance Control Center",
    category: "operational_units",
    route: "/admin/finance",
    primaryClasses: ["CLASS_03", "CLASS_06"],
    descriptionBn: "হিসাব চার্ট, দ্বৈত-প্রবেশ ভাউচার, ব্যাংক সমন্বয় এবং বিশেষায়িত অনুদান ও স্থায়ী সমাজকল্যাণ তহবিল খতিয়ান।",
    descriptionEn: "Chart of accounts, double-entry vouchers, bank reconciliation, donor restricted fund ledgers (Donations, Endowments).",
  },
  {
    code: "property",
    idNumber: 5,
    nameBn: "সম্পত্তি ব্যবস্থাপনা কনসোল",
    nameEn: "Property Management Console",
    category: "operational_units",
    route: "/admin/property",
    primaryClasses: ["CLASS_03", "CLASS_04"],
    descriptionBn: "সম্পত্তি পোর্টফোলিও, ইউনিট শূন্যপদ, বাণিজ্যিক ও আবাসিক ইজারা চুক্তি, ইউটিলিটি মিটার ও মেরামত সূচি।",
    descriptionEn: "Property portfolio, unit vacancies, commercial vs residential tenancy classes, lease contracts, utility meters.",
  },
  {
    code: "microfinance",
    idNumber: 6,
    nameBn: "ক্ষুদ্রঋণ ব্যবস্থাপনা কনসোল",
    nameEn: "Microfinance Management Console",
    category: "operational_units",
    route: "/admin/microfinance",
    primaryClasses: ["CLASS_03", "CLASS_04"],
    descriptionBn: "বিনা-সুদে ঋণ পোর্টফোলিও, ঋণগ্রহীতার ঝুঁকি স্কোরিং, পরিশোধের সময়সূচী এবং আদায় রুট বরাদ্দ।",
    descriptionEn: "Zero-interest microfinance loan portfolios, borrower risk scoring, repayment schedules, collection route assignment.",
  },
  {
    code: "workforce",
    idNumber: 7,
    nameBn: "কর্মীবাহিনী ও মানবসম্পদ কনসোল",
    nameEn: "Workforce Management Console",
    category: "operational_units",
    route: "/admin/workforce",
    primaryClasses: ["CLASS_03", "CLASS_09"],
    descriptionBn: "কর্মী ও স্বেচ্ছাসেবক ডিরেক্টরি, জিওফেন্সড মোবাইল চেক-ইন অডিট, ছুটির আবেদন, রোস্টার এবং বেতন প্রস্তুতি।",
    descriptionEn: "Staff & volunteer directory, geofenced mobile check-in audits, leave requests, shift rosters, stipend/payroll.",
  },
  {
    code: "eshop",
    idNumber: 8,
    nameBn: "ই-কমার্স অপারেশনস কনসোল",
    nameEn: "E-Commerce Operations Console",
    category: "operational_units",
    route: "/admin/eshop",
    primaryClasses: ["CLASS_03", "CLASS_04"],
    descriptionBn: "হস্তশিল্প ও কারিগর ক্যাটালগ, গুদাম এসকেইউ ব্যালেন্স, স্বয়ংক্রিয় ক্রয় আদেশ এবং গ্রাহক ডেলিভারি ট্র্যাকিং।",
    descriptionEn: "Craft & artisan catalog, warehouse SKU balances, automated purchase orders, order dispatch routing.",
  },
  {
    code: "projects",
    idNumber: 9,
    nameBn: "প্রকল্প ও সংস্থা ব্যবস্থাপনা কনসোল",
    nameEn: "Projects & Agency Management Console",
    category: "operational_units",
    route: "/admin/projects",
    primaryClasses: ["CLASS_03", "CLASS_04"],
    descriptionBn: "ত্রাণ ও পুনর্বাসন লজিস্টিকস, সুবিধাভোগী জরিপ অভিযান, প্রকল্প মাইলফলক এবং ডোনার প্রভাব মূল্যায়ন প্রতিবেদন।",
    descriptionEn: "Disaster relief logistics, beneficiary survey campaigns, project milestones, donor impact reporting.",
  },
  {
    code: "assets",
    idNumber: 10,
    nameBn: "স্থাবর ও অস্থাবর সম্পদ কনসোল",
    nameEn: "Asset Management Console",
    category: "operational_units",
    route: "/admin/assets",
    primaryClasses: ["CLASS_03", "CLASS_04"],
    descriptionBn: "স্থায়ী সম্পদ রেজিস্টার, সরলরৈখিক অবচয় সূচি, শারীরিক কিউআর/এনএফসি ট্যাগ অডিট এবং সম্পদ নিষ্পত্তি।",
    descriptionEn: "Fixed asset register, straight-line depreciation schedules, physical QR/NFC tag audits, asset disposal.",
  },
  {
    code: "documents",
    idNumber: 11,
    nameBn: "নথিপত্র নিয়ন্ত্রণ কেন্দ্র",
    nameEn: "Document Control Center",
    category: "trust_comms_docs",
    route: "/admin/documents",
    primaryClasses: ["CLASS_08"],
    descriptionBn: "দ্বিভাষিক টেমপ্লেট (STFL-TPL-*), ক্রিপ্টোগ্রাফিক হ্যাশ যাচাইকরণ, নথি বাতিল ও পাবলিক যাচাই পোর্টাল পরিচালনা।",
    descriptionEn: "Official bilingual templates (STFL-TPL-*), digital document issuance, cryptographic hash verification.",
  },
  {
    code: "communications",
    idNumber: 12,
    nameBn: "যোগাযোগ ও বার্তা কেন্দ্র",
    nameEn: "Communications Center",
    category: "trust_comms_docs",
    route: "/admin/communications",
    primaryClasses: ["CLASS_03", "CLASS_04"],
    descriptionBn: "হোয়াটসঅ্যাপ, এসএমএস ও ইমেইল গেটওয়ে প্রেরণ, দ্বিভাষিক টেমপ্লেট নিবন্ধন, ডেলিভারি রশিদ ও হার সীমা নিয়ন্ত্রণ।",
    descriptionEn: "Governed WhatsApp, Email, and SMS gateway dispatch, bilingual template registration, delivery receipts.",
  },
  {
    code: "security",
    idNumber: 13,
    nameBn: "নিরাপত্তা ও নিরীক্ষা কেন্দ্র",
    nameEn: "Security & Audit Center",
    category: "security_fleets",
    route: "/admin/security",
    primaryClasses: ["CLASS_07"],
    descriptionBn: "হার্ডওয়্যার অ্যাটেস্টেশন পর্যালোচনা, সন্দেহজনক লগইন ফরেনসিক্স, প্রিন্ট টোকেন অডিট ও কুইক কিল-সুইচ পরিচালনা।",
    descriptionEn: "Hardware device attestation review, suspicious login forensics, session revocation, print token audits.",
  },
  {
    code: "agents",
    idNumber: 14,
    nameBn: "স্বায়ত্তশাসিত এজেন্ট নিয়ন্ত্রণ কেন্দ্র",
    nameEn: "Agent Control Center",
    category: "security_fleets",
    route: "/admin/agents",
    primaryClasses: ["CLASS_02", "CLASS_03", "CLASS_07"],
    descriptionBn: "এজেন্ট রেজিস্ট্রি (STFL-AGT-*), টুল হোয়াইটলিস্টিং, দৈনিক বাজেট সীমা, কনফিডেন্স স্কোর ট্র্যাকিং ও তাৎক্ষণিক পজ।",
    descriptionEn: "Autonomous agent registry (STFL-AGT-*), tool whitelisting, daily budget limits, confidence score monitoring.",
  },
  {
    code: "devices",
    idNumber: 15,
    nameBn: "মোবাইল ডিভাইস ব্যবস্থাপনা কেন্দ্র",
    nameEn: "Device Management Center",
    category: "security_fleets",
    route: "/admin/devices",
    primaryClasses: ["CLASS_07"],
    descriptionBn: "ফিল্ড ডিভাইস বাইন্ডিং অনুরোধ, কীস্টোর এনক্লেভ অ্যাটেস্টেশন স্ট্যাটাস এবং আপসকৃত ডিভাইস ব্ল্যাকলিস্টিং।",
    descriptionEn: "Mobile hardware binding requests, KeyStore attestation state, compromised device blacklisting.",
  },
  {
    code: "system",
    idNumber: 16,
    nameBn: "সিস্টেম ও অবকাঠামো প্রশাসন কেন্দ্র",
    nameEn: "System Administration Center",
    category: "platform_core",
    route: "/admin/system",
    primaryClasses: ["CLASS_00"],
    descriptionBn: "ডেটাবেস মাইগ্রেশন এক্সিকিউশন, হাইপারড্রাইভ সংযোগ পুল মেট্রিক্স এবং ক্লাউডফ্লেয়ার এজ ক্যাশিং নীতি।",
    descriptionEn: "Database migration execution, Hyperdrive connection pool metrics, Cloudflare edge caching policies.",
  },
  {
    code: "compliance",
    idNumber: 17,
    nameBn: "আইন ও কমপ্লায়েন্স নিয়ন্ত্রণ কেন্দ্র",
    nameEn: "Compliance & Legal Intelligence Console",
    category: "security_fleets",
    route: "/admin/compliance",
    primaryClasses: ["CLASS_07", "CLASS_02"],
    descriptionBn: "২১টি সংবিধিবদ্ধ আইনি ক্ষেত্র, স্বয়ংক্রিয় সম্মতি মূল্যায়ন, আইনি পর্যালোচনা ও নিয়ন্ত্রণমূলক পরিবর্তন ট্র্যাকিং।",
    descriptionEn: "21 universal statutory compliance domains, automated evaluations, legal holds, and regulatory change monitoring.",
  },
  {
    code: "knowledge",
    idNumber: 18,
    nameBn: "জ্ঞান, প্রশিক্ষণ ও সেবা কেন্দ্র",
    nameEn: "Knowledge, Training & Service Console",
    category: "trust_comms_docs",
    route: "/admin/knowledge",
    primaryClasses: ["CLASS_03", "CLASS_04", "CLASS_09"],
    descriptionBn: "ব্যবহারকারী শিখন কেন্দ্র, সেবা ও এসওপি ম্যানুয়াল, রিলিফ মডারেটর কিউ এবং প্রশিক্ষণ ও সনদ ব্যবস্থাপনা।",
    descriptionEn: "User learning center, operational SOPs, relief moderator triage queues, and verified course certification.",
  },
];

export function evaluateClientConsoleAccess(consoleCode: string, userClass: UserClass): ConsoleAccessLevel {
  switch (consoleCode) {
    case "governance":
      if (userClass === "CLASS_01") return "FULL";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_00") return "LIMITED";
      if (userClass === "CLASS_03" || userClass === "CLASS_06") return "OPERATIONAL";
      if (userClass === "CLASS_07") return "OVERSIGHT";
      return "DENIED";

    case "executive":
      if (userClass === "CLASS_02") return "FULL";
      if (userClass === "CLASS_00" || userClass === "CLASS_01" || userClass === "CLASS_07") return "OVERSIGHT";
      if (userClass === "CLASS_03") return "OPERATIONAL";
      if (userClass === "CLASS_10") return "LIMITED";
      return "DENIED";

    case "finance":
      if (userClass === "CLASS_06") return "FULL";
      if (userClass === "CLASS_03" || userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_01" || userClass === "CLASS_07") return "OVERSIGHT";
      if (userClass === "CLASS_00") return "LIMITED";
      if (userClass === "CLASS_05" || userClass === "CLASS_09") return "LIMITED";
      if (userClass === "CLASS_10") return "LIMITED";
      if (userClass === "CLASS_11") return "LIMITED";
      return "DENIED";

    case "property":
      if (userClass === "CLASS_03") return "FULL";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_05") return "FIELD";
      if (userClass === "CLASS_08") return "ISSUE_GATED";
      if (userClass === "CLASS_10") return "FIELD";
      if (userClass === "CLASS_11") return "LIMITED";
      return "DENIED";

    case "microfinance":
      if (userClass === "CLASS_03") return "FULL";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_05") return "FIELD";
      if (userClass === "CLASS_08") return "ISSUE_GATED";
      if (userClass === "CLASS_10") return "FIELD";
      if (userClass === "CLASS_11") return "LIMITED";
      return "DENIED";

    case "workforce":
      if (userClass === "CLASS_09") return "FULL";
      if (userClass === "CLASS_03" || userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_05") return "OWN_EVENTS";
      if (userClass === "CLASS_10") return "LIMITED";
      if (userClass === "CLASS_11") return "LIMITED";
      return "DENIED";

    case "eshop":
      if (userClass === "CLASS_03") return "FULL";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_05") return "FIELD";
      if (userClass === "CLASS_10") return "FIELD";
      if (userClass === "CLASS_11") return "LIMITED";
      return "DENIED";

    case "projects":
      if (userClass === "CLASS_03") return "FULL";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_05") return "FIELD";
      if (userClass === "CLASS_10") return "FIELD";
      if (userClass === "CLASS_11") return "LIMITED";
      if (userClass === "CLASS_12") return "LIMITED";
      return "DENIED";

    case "assets":
      if (userClass === "CLASS_03" || userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_00") return "LIMITED";
      if (userClass === "CLASS_05") return "FIELD";
      if (userClass === "CLASS_10") return "LIMITED";
      return "DENIED";

    case "documents":
      if (userClass === "CLASS_08") return "FULL";
      if (userClass === "CLASS_03" || userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_01" || userClass === "CLASS_07") return "OVERSIGHT";
      if (userClass === "CLASS_10") return "ISSUE_GATED";
      if (userClass === "CLASS_11") return "LIMITED";
      if (userClass === "CLASS_12") return "LIMITED";
      return "DENIED";

    case "communications":
      if (userClass === "CLASS_03" || userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_04") return "OPERATIONAL";
      if (userClass === "CLASS_01" || userClass === "CLASS_07") return "OVERSIGHT";
      if (userClass === "CLASS_00") return "LIMITED";
      if (userClass === "CLASS_10") return "LIMITED";
      if (userClass === "CLASS_11") return "LIMITED";
      return "DENIED";

    case "security":
      if (userClass === "CLASS_07") return "FULL";
      if (userClass === "CLASS_01" || userClass === "CLASS_02") return "OVERSIGHT";
      if (userClass === "CLASS_00") return "LIMITED";
      if (userClass === "CLASS_03" || userClass === "CLASS_04" || userClass === "CLASS_05") return "OWN_EVENTS";
      if (userClass === "CLASS_10") return "OWN_EVENTS";
      return "DENIED";

    case "agents":
      if (userClass === "CLASS_07") return "FULL";
      if (userClass === "CLASS_00" || userClass === "CLASS_02" || userClass === "CLASS_03") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_10") return "OWN_EVENTS";
      return "DENIED";

    case "devices":
      if (userClass === "CLASS_07") return "FULL";
      if (userClass === "CLASS_00") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_03") return "OPERATIONAL";
      if (userClass === "CLASS_05") return "LIMITED";
      return "DENIED";

    case "iam":
      if (userClass === "CLASS_00") return "FULL";
      if (userClass === "CLASS_07" || userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_03") return "OPERATIONAL";
      if (userClass === "CLASS_09") return "MANAGE";
      return "DENIED";

    case "system":
      if (userClass === "CLASS_00") return "FULL";
      if (userClass === "CLASS_07") return "OVERSIGHT";
      return "DENIED";

    case "compliance":
      if (userClass === "CLASS_07") return "FULL";
      if (userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_00") return "LIMITED";
      if (userClass === "CLASS_03" || userClass === "MODERATOR_B") return "OPERATIONAL";
      return "DENIED";

    case "knowledge":
      if (userClass === "CLASS_09" || userClass === "MODERATOR_A" || userClass === "MODERATOR_B") return "FULL";
      if (userClass === "CLASS_03" || userClass === "CLASS_04" || userClass === "CLASS_02") return "MANAGE";
      if (userClass === "CLASS_01") return "OVERSIGHT";
      if (userClass === "CLASS_05") return "OPERATIONAL";
      if (userClass === "CLASS_10" || userClass === "CLASS_11" || userClass === "CLASS_12") return "LIMITED";
      return "DENIED";

    default:
      return "DENIED";
  }
}

// -------------------------------------------------------------
// NEW PROJECT-CENTRIC OPERATING SYSTEM TYPES & INTERFACES
// -------------------------------------------------------------

export type WorkspaceTab = "portfolio" | "project" | "work" | "management";

export type ProjectFacet =
  | "overview"
  | "operations"
  | "outcomes"
  | "finance"
  | "people"
  | "assets"
  | "documents"
  | "compliance"
  | "governance";

export interface ProjectOperation {
  id: string;
  nameBn: string;
  nameEn: string;
  category: "field" | "procurement" | "service" | "inspection" | "milestone";
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED" | "OVERDUE";
  owner: string;
  team: string;
  location: string;
  schedule: string;
  budget: number;
  spent: number;
  dependencies: string[];
  evidenceId: string;
  issuesCount: number;
}

export interface ProjectOutcomeMetric {
  id: string;
  titleBn: string;
  titleEn: string;
  target: number;
  actual: number;
  baseline: number;
  unit: string;
  measurementPeriod: string;
  evidenceRef: string;
  verificationState: "VERIFIED" | "IN_PROGRESS" | "PENDING_AUDIT";
  methodology: string;
  confidence: number;
}

export interface ProjectPerson {
  partyId: string;
  name: string;
  roleBn: string;
  roleEn: string;
  relationship: "staff" | "volunteer" | "field_worker" | "contractor" | "partner" | "funder" | "beneficiary";
  phone: string;
  location: string;
}

export interface ProjectAsset {
  assetId: string;
  nameBn: string;
  nameEn: string;
  category: "vehicle" | "equipment" | "inventory" | "facility" | "digital";
  status: "ACTIVE" | "MAINTENANCE" | "DEPLOYED";
  location: string;
  tagId: string;
}

export interface ProjectDocument {
  documentId: string;
  titleBn: string;
  titleEn: string;
  type: "CHARTER" | "CONTRACT" | "VOUCHER" | "AUDIT_REPORT" | "MOA";
  issuedDate: string;
  hash: string;
  status: "VALID" | "UNDER_REVIEW" | "SUPERSEDED";
}

export interface ProjectComplianceItem {
  domainId: string;
  nameBn: string;
  nameEn: string;
  status: "CLEAR" | "ADVISORY" | "WARNING" | "REVIEW_REQUIRED" | "HOLD" | "BLOCKED";
  statutoryRef: string;
  lastEvaluated: string;
  details: string;
}

export interface ProjectGovernanceItem {
  id: string;
  type: "APPROVAL" | "RISK" | "POLICY" | "DELEGATION";
  titleBn: string;
  titleEn: string;
  status: string;
  level: number;
  actor: string;
  date: string;
}

export interface ProjectEntity {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  jurisdictionBn: string;
  jurisdictionEn: string;
  status: "ACTIVE" | "REVIEW" | "HOLD" | "COMPLETED";
  typeBn: string;
  typeEn: string;
  objectiveBn: string;
  objectiveEn: string;
  startDate: string;
  endDate: string;
  ownerBn: string;
  ownerEn: string;
  managerBn: string;
  managerEn: string;
  fundingStatus: "HEALTHY" | "WATCH" | "RESTRICTED" | "CRITICAL";
  outcomeStatus: "ON_TRACK" | "AT_RISK" | "EXCEEDED" | "PENDING";
  riskStatus: "LOW" | "MODERATE" | "HIGH";
  health: "GOOD" | "WATCH" | "RISK";
  
  // 10 Primary KPIs
  kpis: {
    peopleReached: number;
    peopleReachedTarget: number;
    activitiesCount: number;
    outputsCount: number;
    outcomeAchievementPct: number;
    fundsReceived: number;
    totalSpent: number;
    availableFunds: number;
    costPerOutcome: number;
    overheadPct: number;
    healthScore: number;
  };

  // Finance Partitioning (Direct vs Shared vs Overhead)
  finance: {
    fundingReceived: number;
    fundingCommitted: number;
    fundingRestricted: number;
    fundingAvailable: number;
    directExpenditure: number;
    sharedExpenditure: number;
    overheadExpenditure: number;
    budgetTotal: number;
    budgetSpent: number;
    budgetUtilizationPct: number;
    costPerBeneficiary: number;
    outcomePer1000Bdt: number;
    payables: number;
    receivables: number;
    bankReconciled: boolean;
  };

  // Money -> Work -> Outcome Pipeline
  pipeline: {
    fundsReceivedText: string;
    committedText: string;
    directExpenditureText: string;
    outputsText: string;
    outcomesTargetText: string;
    verifiedImpactText: string;
  };

  operations: ProjectOperation[];
  outcomes: ProjectOutcomeMetric[];
  people: ProjectPerson[];
  assets: ProjectAsset[];
  documents: ProjectDocument[];
  compliance: ProjectComplianceItem[];
  governance: ProjectGovernanceItem[];
}

export interface MyWorkTask {
  id: string;
  projectId: string;
  projectName: string;
  titleBn: string;
  titleEn: string;
  dueDate: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  assignedTo: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export interface MyWorkApproval {
  id: string;
  projectId: string;
  projectName: string;
  titleBn: string;
  titleEn: string;
  amount?: number;
  level: number;
  initiator: string;
  submittedAt: string;
  status: "PENDING_DUAL_CONTROL" | "AWAITING_FINANCE" | "EXECUTIVE_REVIEW";
  riskCategory: string;
}

export interface MyWorkAlert {
  id: string;
  projectId: string;
  projectName: string;
  severity: "CRITICAL" | "WARNING" | "ADVISORY" | "INFO";
  titleBn: string;
  titleEn: string;
  source: string;
  timestamp: string;
}

export interface MyWorkMessage {
  id: string;
  projectId?: string;
  titleBn: string;
  titleEn: string;
  bodyBn: string;
  bodyEn: string;
  sender: string;
  isAiAgentRecommendation?: boolean;
  confidence?: number;
  timestamp: string;
}

export interface ConsoleCluster {
  clusterId: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  consoleCodes: string[];
}

export const MANAGEMENT_CLUSTERS: ConsoleCluster[] = [
  {
    clusterId: "administration",
    nameBn: "১. প্ল্যাটফর্ম প্রশাসন ও ব্যবহারকারী",
    nameEn: "1. Administration & Access",
    descriptionBn: "ব্যবহারকারী পার্টি, ভূমিকা, ডিজিটাল ক্রেডেনশিয়াল ও মানবসম্পদ প্রশাসন।",
    descriptionEn: "Identity, credential lifecycle, role assignments, and workforce directory.",
    consoleCodes: ["iam", "workforce"],
  },
  {
    clusterId: "governance",
    nameBn: "২. ট্রাস্টি পর্ষদ ও নির্বাহী কমান্ড",
    nameEn: "2. Governance & Executive Command",
    descriptionBn: "বোর্ড রেজোলিউশন, স্থায়ী ট্রাস্ট নীতি, আন্তঃবিভাগীয় কেপিআই এবং জরুরি সমন্বয়।",
    descriptionEn: "Board resolutions, endowment stewardship, cross-unit escalation, strategic command.",
    consoleCodes: ["governance", "executive"],
  },
  {
    clusterId: "finance",
    nameBn: "৩. আর্থিক নিয়ন্ত্রণ ও অডিট লেজার",
    nameEn: "3. Financial Control & Ledger",
    descriptionBn: "দ্বৈত-প্রবেশ ভাউচার, নিয়ন্ত্রিত তহবিল (বিশেষ অনুদান/স্থায়ী তহবিল), এবং ব্যাংক সমন্বয়।",
    descriptionEn: "Authoritative double-entry vouchers, restricted fund ledgers, and bank reconciliation.",
    consoleCodes: ["finance"],
  },
  {
    clusterId: "operations",
    nameBn: "৪. পরিচালনা ও কর্মসূচি কেন্দ্র",
    nameEn: "4. Operations & Agency Management",
    descriptionBn: "সম্পত্তি ইজারা, ক্ষুদ্রঋণ পোর্টফোলিও, ই-কমার্স কারিগর এবং কর্মসূচি লজিস্টিকস।",
    descriptionEn: "Property leases, microfinance portfolios, e-shop artisans, and program agency operations.",
    consoleCodes: ["property", "microfinance", "eshop", "projects"],
  },
  {
    clusterId: "resources",
    nameBn: "৫. সম্পদ, বিশ্বাস, যোগাযোগ ও জ্ঞান",
    nameEn: "5. Resources, Trust, Comms & Knowledge",
    descriptionBn: "স্থায়ী সম্পদ অবচয়, ডিজিটাল দ্বিভাষিক নথি, বার্তা গেটওয়ে এবং প্রশিক্ষণ প্ল্যাটফর্ম।",
    descriptionEn: "Fixed assets register, digital immutable documents, comms dispatch, and knowledge training.",
    consoleCodes: ["assets", "documents", "communications", "knowledge"],
  },
  {
    clusterId: "control",
    nameBn: "৬. নিরাপত্তা, এজেন্ট ও সিস্টেম অবকাঠামো",
    nameEn: "6. Security, Autonomous Fleets & Infrastructure",
    descriptionBn: "আইনি বাধ্যবাধকতা, এনক্লেভ অ্যাটেস্টেশন, এআই এজেন্ট বাজেট এবং ক্লাউডফ্লেয়ার এজ কোর।",
    descriptionEn: "Statutory compliance, device attestations, agent boundaries, and database infrastructure.",
    consoleCodes: ["compliance", "security", "agents", "devices", "system"],
  },
];

export const CANONICAL_PROJECTS: ProjectEntity[] = [
  {
    id: "STFL-PRJ-2026-0012",
    code: "EDU-2026-SYL-KUR",
    nameBn: "শিক্ষা সহায়তা ২০২৬",
    nameEn: "Education Access 2026",
    jurisdictionBn: "বাংলাদেশ · সিলেট ও কুড়িগ্রাম চরাঞ্চল",
    jurisdictionEn: "Bangladesh · Sylhet & Kurigram Riverine Islands",
    status: "ACTIVE",
    typeBn: "মানবিক ও প্রাথমিক শিক্ষা অন্তর্ভুক্তি",
    typeEn: "Humanitarian & Primary Education Inclusion",
    objectiveBn: "সুবিধাবঞ্চিত নদী তীরবর্তী ও চরাঞ্চলের শিক্ষার্থীদের মানসম্মত শিক্ষা, বই-পোশাক ও ডিজিটাল সাক্ষরতা প্রদান।",
    objectiveEn: "Improve access to quality education, literacy, textbooks, uniforms, and solar learning tablets for underserved riverine communities.",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    ownerBn: "সোহেল তাসনীম ফাউন্ডেশন (বোর্ড তদারকি)",
    ownerEn: "SohaelTasneem Foundation (Trustee Oversight)",
    managerBn: "সারাহ খান (সিনিয়র প্রোগ্রাম লিড)",
    managerEn: "Sarah Khan (Senior Program Lead)",
    fundingStatus: "HEALTHY",
    outcomeStatus: "ON_TRACK",
    riskStatus: "LOW",
    health: "GOOD",

    kpis: {
      peopleReached: 7680,
      peopleReachedTarget: 8400,
      activitiesCount: 120,
      outputsCount: 7680,
      outcomeAchievementPct: 91,
      fundsReceived: 12000000,
      totalSpent: 8400000,
      availableFunds: 3600000,
      costPerOutcome: 1093.75,
      overheadPct: 3.2,
      healthScore: 94,
    },

    finance: {
      fundingReceived: 12000000,
      fundingCommitted: 9300000,
      fundingRestricted: 10000000,
      fundingAvailable: 3600000,
      directExpenditure: 8131200,
      sharedExpenditure: 0,
      overheadExpenditure: 268800,
      budgetTotal: 12000000,
      budgetSpent: 8400000,
      budgetUtilizationPct: 70.0,
      costPerBeneficiary: 1093.75,
      outcomePer1000Bdt: 0.91,
      payables: 185000,
      receivables: 0,
      bankReconciled: true,
    },

    pipeline: {
      fundsReceivedText: "৳১২,০০,০০,০০০ প্রাপ্ত অনুদান",
      committedText: "৳৯৩,০০,০০০ অনুমোদিত বরাদ্দ",
      directExpenditureText: "৳৮১,৩১,২০০ সরাসরি প্রকল্প ব্যয়",
      outputsText: "৭,৬৮০ জন শিক্ষার্থী নিবন্ধিত ও সজ্জিত",
      outcomesTargetText: "৯১% সাক্ষরতা উন্নয়ন লক্ষ্যমাত্রা অর্জিত",
      verifiedImpactText: "নিরীক্ষিত প্রাতিষ্ঠানিক টেকসই প্রভাব",
    },

    operations: [
      {
        id: "OP-012-01",
        nameBn: "১৮টি প্রত্যন্ত চরের স্কুলে পাঠ্যপুস্তক ও ইউনিফর্ম বিতরণ",
        nameEn: "Textbook & Uniform Distribution across 18 Riverine Schools",
        category: "service",
        status: "COMPLETED",
        owner: "Tareq Ahmed",
        team: "Field Team Sylhet-01",
        location: "Kurigram & Sylhet",
        schedule: "2026-01-15 to 2026-03-30",
        budget: 2400000,
        spent: 2385000,
        dependencies: ["SUPPLY-TEXTBOOK-Q1"],
        evidenceId: "STFL-EVD-2026-012",
        issuesCount: 0,
      },
      {
        id: "OP-012-02",
        nameBn: "শিক্ষক দক্ষতা বৃদ্ধি ও ডিজিটাল শিক্ষাদান বুটক্যাম্প",
        nameEn: "Teacher Capacity Building & Digital Pedagogy Bootcamp",
        category: "service",
        status: "IN_PROGRESS",
        owner: "Sarah Khan",
        team: "Academic Coordination Unit",
        location: "Sylhet Central Training Hub",
        schedule: "2026-04-01 to 2026-07-15",
        budget: 1200000,
        spent: 850000,
        dependencies: ["OP-012-01"],
        evidenceId: "STFL-EVD-2026-019",
        issuesCount: 0,
      },
      {
        id: "OP-012-03",
        nameBn: "স্কুল প্রাঙ্গণে সৌরচালিত ডিজিটাল লার্নিং স্টেশন স্থাপন",
        nameEn: "Mid-day Nutrition & Clean Water Station Installation",
        category: "field",
        status: "IN_PROGRESS",
        owner: "Nazmul Huda",
        team: "Infrastructure Works",
        location: "12 Primary Hubs",
        schedule: "2026-03-10 to 2026-08-30",
        budget: 3200000,
        spent: 2950000,
        dependencies: ["SOLAR-INVERTER-DELIVERY"],
        evidenceId: "STFL-EVD-2026-024",
        issuesCount: 1,
      },
      {
        id: "OP-012-04",
        nameBn: "তৃতীয় পক্ষীয় স্বাধীন সাক্ষরতা মানদণ্ড মূল্যায়ন নিরীক্ষা",
        nameEn: "Quarterly Independent Literacy Benchmark Audit",
        category: "inspection",
        status: "PLANNED",
        owner: "External Evaluator",
        team: "Quality Assurance",
        location: "Kurigram District",
        schedule: "2026-09-01 to 2026-10-30",
        budget: 600000,
        spent: 0,
        dependencies: ["OP-012-02"],
        evidenceId: "STFL-EVD-2026-031",
        issuesCount: 0,
      },
      {
        id: "OP-012-05",
        nameBn: "সৌর শিক্ষা ট্যাবলেট সংগ্রহ (লেভেল ৩ অনুমোদন অপেক্ষমাণ)",
        nameEn: "Procurement of Rural Solar Literacy Tablets (Level 3 Gated)",
        category: "procurement",
        status: "BLOCKED",
        owner: "Sarah Khan",
        team: "Procurement Logistics",
        location: "Dhaka Central Store",
        schedule: "2026-05-15 to 2026-06-30",
        budget: 1931200,
        spent: 0,
        dependencies: ["APP-01-VARIANCE-APPROVAL"],
        evidenceId: "STFL-REQ-889",
        issuesCount: 1,
      },
    ],

    outcomes: [
      {
        id: "OUT-012-01",
        titleBn: "প্রাথমিক বিদ্যালয়ে শিক্ষার্থী উপস্থিতি ও ধরে রাখার হার",
        titleEn: "Primary School Student Retention & Regular Attendance Rate",
        target: 95,
        actual: 93.4,
        baseline: 72.0,
        unit: "%",
        measurementPeriod: "Jan-Jun 2026",
        evidenceRef: "STFL-EVD-2026-012",
        verificationState: "VERIFIED",
        methodology: "Biometric Enclave Tablet Attendance Ledger",
        confidence: 0.98,
      },
      {
        id: "OUT-012-02",
        titleBn: "মানসম্মত বাংলা ও গণিত সাক্ষরতা অর্জনকারী শিক্ষার্থী",
        titleEn: "Students Achieving Standardized Bangla & Math Literacy",
        target: 8400,
        actual: 7680,
        baseline: 2100,
        unit: "Students",
        measurementPeriod: "Jan-Sep 2026",
        evidenceRef: "STFL-EVD-2026-024",
        verificationState: "VERIFIED",
        methodology: "Diagnostic Baseline vs Midterm Continuous Assessment",
        confidence: 0.94,
      },
      {
        id: "OUT-012-03",
        titleBn: "চরাঞ্চলের ঝরে পড়া রোধে খাদ্য ও পুষ্টি নিরাপত্তা প্রভাব",
        titleEn: "Nutritional Support Impact on Zero-Dropout Metric",
        target: 100,
        actual: 98.2,
        baseline: 64.0,
        unit: "%",
        measurementPeriod: "Continuous 2026",
        evidenceRef: "STFL-EVD-2026-031",
        verificationState: "IN_PROGRESS",
        methodology: "Monthly Household Socio-Economic Sample Surveys",
        confidence: 0.91,
      },
    ],

    people: [
      {
        partyId: "STFL-PTY-0092",
        name: "Sarah Khan",
        roleBn: "প্রকল্প পরিচালক / সিনিয়র প্রোগ্রাম ম্যানেজার",
        roleEn: "Project Director / Senior Program Manager",
        relationship: "staff",
        phone: "+880 1711-209841",
        location: "Sylhet Hub Office",
      },
      {
        partyId: "STFL-PTY-0144",
        name: "Tareq Ahmed",
        roleBn: "প্রধান মাঠ সমন্বয়কারী",
        roleEn: "Lead Field Operations Coordinator",
        relationship: "staff",
        phone: "+880 1819-450123",
        location: "Kurigram Sub-Office",
      },
      {
        partyId: "STFL-PTY-0312",
        name: "Nazmul Huda",
        roleBn: "প্রকল্প হিসাব কর্মকর্তা",
        roleEn: "Project Accounts Officer",
        relationship: "staff",
        phone: "+880 1912-789012",
        location: "Dhaka HQ",
      },
      {
        partyId: "STFL-PTY-0881",
        name: "Sylhet Rural Volunteer Corps (32 members)",
        roleBn: "কমিউনিটি স্বেচ্ছাসেবক দল",
        roleEn: "Community Volunteer Cohort",
        relationship: "volunteer",
        phone: "N/A",
        location: "Sylhet & Kurigram",
      },
      {
        partyId: "STFL-PTY-1002",
        name: "Global Education Endowment Syndicate",
        roleBn: "দাতা ও প্রধান পৃষ্ঠপোষক",
        roleEn: "Funder & Restricted Endowment Donor",
        relationship: "funder",
        phone: "Secretariat",
        location: "Kuala Lumpur & Dhaka",
      },
    ],

    assets: [
      {
        assetId: "AST-2026-VH-01",
        nameBn: "মোবাইল ক্লাসরুম ফিল্ড ভ্যান (হাই-এস টয়োটা)",
        nameEn: "Mobile Classroom Field Van (Toyota HiAce)",
        category: "vehicle",
        status: "ACTIVE",
        location: "Sylhet Zone",
        tagId: "TAG-GPS-99120",
      },
      {
        assetId: "AST-2026-SOL-12",
        nameBn: "সৌর চার্জিং ও ব্যাটারি পাওয়ার ব্যাকআপ স্টেশন (১২টি)",
        nameEn: "Solar Charging & Battery Backup Hubs (12 Units)",
        category: "facility",
        status: "DEPLOYED",
        location: "Kurigram Char Schools",
        tagId: "TAG-SOL-4410",
      },
      {
        assetId: "AST-2026-TAB-240",
        nameBn: "রাগডাইজড ফিল্ড লার্নিং ট্যাবলেট (২৪০টি এনক্লেভ বাইন্ডিং)",
        nameEn: "Ruggedized Field Literacy Tablets (240 Enclave Bound)",
        category: "equipment",
        status: "ACTIVE",
        location: "Field Schools",
        tagId: "TAG-HW-ENC-240",
      },
    ],

    documents: [
      {
        documentId: "STFL-DOC-2026-PRJ-012-CHARTER",
        titleBn: "প্রকল্প সনদ ও পরিচালনা পর্ষদ অনুমোদন আদেশ",
        titleEn: "Project Charter & Board Governance Mandate",
        type: "CHARTER",
        issuedDate: "2026-01-02",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        status: "VALID",
      },
      {
        documentId: "STFL-DOC-2026-PRJ-012-MOA",
        titleBn: "প্রাথমিক শিক্ষা অধিদপ্তর সহযোগিতা স্মারক (MoA)",
        titleEn: "Directorate of Primary Education Cooperation MoA",
        type: "MOA",
        issuedDate: "2026-01-10",
        hash: "f4a8b11298cc1b249aeaf4c8996fe11427ae41e4649b934ca495991b7852c912",
        status: "VALID",
      },
      {
        documentId: "STFL-DOC-2026-PRJ-012-AUDIT-Q1",
        titleBn: "প্রথম প্রান্তিক সংবিধিবদ্ধ নিরীক্ষা ও হিসাব প্রতিবেদন",
        titleEn: "Q1 Independent Statutory Financial & Impact Audit",
        type: "AUDIT_REPORT",
        issuedDate: "2026-04-12",
        hash: "8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d",
        status: "VALID",
      },
    ],

    compliance: [
      {
        domainId: "COMP-01",
        nameBn: "এনজিও বিষয়ক ব্যুরো এফডি-৭ অনুমোদন",
        nameEn: "NGO Affairs Bureau FD-7 Clearance",
        status: "CLEAR",
        statutoryRef: "FDR Act 2016 §4(b)",
        lastEvaluated: "2026-10-01",
        details: "Full clearance verified with no outstanding observations.",
      },
      {
        domainId: "COMP-02",
        nameBn: "শিশু সুরক্ষা ও নিরাপত্তা নীতিমালা (Child Safeguarding)",
        nameEn: "Child Safeguarding & Protection Policy",
        status: "CLEAR",
        statutoryRef: "Children Act 2013 §89",
        lastEvaluated: "2026-10-10",
        details: "100% staff and volunteer background checks verified.",
      },
      {
        domainId: "COMP-03",
        nameBn: "আইটি ভেন্ডর ক্রয় বৈষম্য নিরীক্ষা",
        nameEn: "IT Vendor Procurement Variance Review",
        status: "REVIEW_REQUIRED",
        statutoryRef: "Public Procurement & Internal Controls §12",
        lastEvaluated: "2026-10-14",
        details: "৳185,000 unusual variance detected by Finance Agent STFL-AGT-FIN-01. Dual-control approval required.",
      },
    ],

    governance: [
      {
        id: "GOV-012-01",
        type: "POLICY",
        titleBn: "বোর্ড রেজোলিউশন Res-2025-11-04 (অনুমোদিত)",
        titleEn: "Board Resolution Res-2025-11-04 (Unanimous)",
        status: "RATIFIED",
        level: 5,
        actor: "Board of Trustees",
        date: "2025-11-04",
      },
      {
        id: "GOV-012-02",
        type: "APPROVAL",
        titleBn: "সৌর ট্যাবলেট ক্রয় বরাদ্দ (৳১,৮৫,০০০ ভ্যারিয়েন্স)",
        titleEn: "Rural Solar Tablet Procurement Variance (৳185,000)",
        status: "PENDING_DUAL_CONTROL",
        level: 3,
        actor: "Executive Leadership & Trustee Dual Control",
        date: "2026-10-14",
      },
      {
        id: "GOV-012-03",
        type: "DELEGATION",
        titleBn: "দায়িত্ব পৃথকীকরণ (SoD): প্রস্তুতকারক ≠ অনুমোদনকারী ≠ বিতরণকারী",
        titleEn: "Segregation of Duties: Requisitioner ≠ Approver ≠ Disburser",
        status: "ENFORCED",
        level: 4,
        actor: "System PostgreSQL Trigger",
        date: "2026-01-01",
      },
    ],
  },

  {
    id: "STFL-PRJ-2026-0014",
    code: "HEALTH-2026-RAM-GAZ",
    nameBn: "মাতৃ ও শিশু স্বাস্থ্য সেবা ২০২৬",
    nameEn: "Community Health & Maternal Clinic",
    jurisdictionBn: "বাংলাদেশ · রামপুরা ও গাজীপুর শিল্পাঞ্চল",
    jurisdictionEn: "Bangladesh · Rampura & Gazipur Industrial Belt",
    status: "ACTIVE",
    typeBn: "বিনামূল্যে প্রাথমিক স্বাস্থ্য ও মাতৃত্বকালীন সেবা",
    typeEn: "Free Primary Maternal & Child Health Service",
    objectiveBn: "গার্মেন্টস শ্রমিক পরিবার ও নিম্নআয়ের মায়েদের জন্য বিনামূল্যে প্রসূতি সেবা, টিকাদান ও পুষ্টি নিশ্চিতকরণ।",
    objectiveEn: "Provide free antenatal care, safe deliveries, infant vaccinations, and nutritional guidance to RMG worker families.",
    startDate: "2026-02-01",
    endDate: "2026-12-31",
    ownerBn: "সোহেল তাসনীম ফাউন্ডেশন (স্বাস্থ্য শাখা)",
    ownerEn: "SohaelTasneem Foundation (Health Directorate)",
    managerBn: "ডা. ফারহানা ইয়াসমিন (মেডিকেল ডিরেক্টর)",
    managerEn: "Dr. Farhana Yasmin (Medical Director)",
    fundingStatus: "HEALTHY",
    outcomeStatus: "AT_RISK",
    riskStatus: "MODERATE",
    health: "WATCH",

    kpis: {
      peopleReached: 4120,
      peopleReachedTarget: 5400,
      activitiesCount: 88,
      outputsCount: 4120,
      outcomeAchievementPct: 76,
      fundsReceived: 8000000,
      totalSpent: 5200000,
      availableFunds: 2800000,
      costPerOutcome: 1262.14,
      overheadPct: 3.2,
      healthScore: 78,
    },

    finance: {
      fundingReceived: 8000000,
      fundingCommitted: 6100000,
      fundingRestricted: 6500000,
      fundingAvailable: 2800000,
      directExpenditure: 4992000,
      sharedExpenditure: 41600,
      overheadExpenditure: 166400,
      budgetTotal: 8000000,
      budgetSpent: 5200000,
      budgetUtilizationPct: 65.0,
      costPerBeneficiary: 1262.14,
      outcomePer1000Bdt: 0.79,
      payables: 310000,
      receivables: 0,
      bankReconciled: true,
    },

    pipeline: {
      fundsReceivedText: "৳৮০,০০,০০০ প্রাপ্ত অনুদান",
      committedText: "৳৬১,০০,০০০ অনুমোদিত বরাদ্দ",
      directExpenditureText: "৳৪৯,৯২,০০০ সরাসরি ক্লিনিক্যাল ব্যয়",
      outputsText: "৪,১২০ জন মা ও শিশুকে স্বাস্থ্যসেবা প্রদান",
      outcomesTargetText: "৭৬% লক্ষ্যমাত্রা সম্পন্ন (কোল্ড-চেইন বিলম্ব)",
      verifiedImpactText: "মাতৃমৃত্যু হার শূন্য এবং ১০০% টিকাদান",
    },

    operations: [
      {
        id: "OP-014-01",
        nameBn: "রামপুরা আউটডোর ক্লিনিক পরিচালনা ও চেকআপ",
        nameEn: "Rampura Outdoor Clinic Daily Operations & Checkups",
        category: "service",
        status: "IN_PROGRESS",
        owner: "Dr. Farhana Yasmin",
        team: "Clinical Team 1",
        location: "Rampura, Dhaka",
        schedule: "Daily 08:00 - 18:00",
        budget: 2800000,
        spent: 1950000,
        dependencies: [],
        evidenceId: "STFL-EVD-2026-CLIN-01",
        issuesCount: 0,
      },
      {
        id: "OP-014-02",
        nameBn: "গাজীপুর মোবাইল ভ্যাকসিনের কোল্ড-চেইন রক্ষণাবেক্ষণ",
        nameEn: "Gazipur Mobile Cold-Chain Vaccine Dispatch",
        category: "field",
        status: "IN_PROGRESS",
        owner: "Sr. Nurse Jahanara",
        team: "Mobile Immunization Unit",
        location: "Gazipur Industrial Zone",
        schedule: "2026-02-15 to 2026-11-30",
        budget: 1800000,
        spent: 1420000,
        dependencies: ["SOLAR-FREEZER-CHECK"],
        evidenceId: "STFL-EVD-2026-CLIN-02",
        issuesCount: 1,
      },
    ],

    outcomes: [
      {
        id: "OUT-014-01",
        titleBn: "নিবন্ধিত গার্মেন্টস কর্মী মায়েদের পূর্ণ টিকাদান সম্পন্ন",
        titleEn: "Fully Immunized Children of RMG Worker Mothers",
        target: 5400,
        actual: 4120,
        baseline: 1200,
        unit: "Mothers & Infants",
        measurementPeriod: "Feb-Sep 2026",
        evidenceRef: "STFL-EVD-2026-CLIN-01",
        verificationState: "VERIFIED",
        methodology: "EPI Card Cross-Verification & Biometric Record",
        confidence: 0.95,
      },
    ],

    people: [
      {
        partyId: "STFL-PTY-0112",
        name: "Dr. Farhana Yasmin",
        roleBn: "মেডিকেল ডিরেক্টর ও প্রধান চিকিৎসক",
        roleEn: "Medical Director & Chief Physician",
        relationship: "staff",
        phone: "+880 1713-998877",
        location: "Rampura Clinic",
      },
    ],

    assets: [
      {
        assetId: "AST-2026-CLIN-01",
        nameBn: "রামপুরা ক্লিনিক প্রাঙ্গণ ও প্যাথলজি ল্যাব ইকুইপমেন্ট",
        nameEn: "Rampura Clinic Premises & Pathology Lab Equipment",
        category: "facility",
        status: "ACTIVE",
        location: "Rampura",
        tagId: "TAG-MED-0091",
      },
    ],

    documents: [
      {
        documentId: "STFL-DOC-2026-PRJ-014-DGHS",
        titleBn: "স্বাস্থ্য অধিদপ্তর (DGHS) ক্লিনিক লাইসেন্স ও অনুমোদন",
        titleEn: "DGHS Statutory Clinical Facility Registration",
        type: "CONTRACT",
        issuedDate: "2026-01-18",
        hash: "3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c",
        status: "VALID",
      },
    ],

    compliance: [
      {
        domainId: "COMP-HLTH-01",
        nameBn: "বায়ো-মেডিকেল বর্জ্য ব্যবস্থাপনা ও পরিবেশ ছাড়পত্র",
        nameEn: "Biomedical Waste Management Compliance",
        status: "CLEAR",
        statutoryRef: "Biomedical Waste Rules 2008 §6",
        lastEvaluated: "2026-10-05",
        details: "Contract with certified hazardous waste incinerator verified.",
      },
    ],

    governance: [
      {
        id: "GOV-014-01",
        type: "APPROVAL",
        titleBn: "জরুরি ভ্যাকসিন কোল্ড-চেইন ব্যাকআপ ব্যাটারি ক্রয়",
        titleEn: "Emergency Vaccine Cold-Chain Backup Battery Procurement",
        status: "PENDING_DUAL_CONTROL",
        level: 3,
        actor: "Unit Head & Medical Lead",
        date: "2026-10-12",
      },
    ],
  },

  {
    id: "STFL-PRJ-2026-0018",
    code: "RELIEF-2026-FENI-NOA",
    nameBn: "পূর্বাঞ্চল বন্যা ত্রাণ ও পুনর্বাসন ২০২৬",
    nameEn: "Eastern Flood Relief & Rehabilitation 2026",
    jurisdictionBn: "বাংলাদেশ · ফেনী, নোয়াখালী ও কুমিল্লা",
    jurisdictionEn: "Bangladesh · Feni, Noakhali & Cumilla Flood Belt",
    status: "ACTIVE",
    typeBn: "জরুরি মানবিক ত্রাণ ও পুনর্বাসন",
    typeEn: "Disaster Emergency Relief & Shelter Reconstruction",
    objectiveBn: "স্মরণকালের বন্যায় ক্ষতিগ্রস্ত গৃহহীন পরিবারগুলোকে খাদ্য, বিশুদ্ধ পানি এবং টেকসই টিন-ছাদ গৃহ নির্মাণ সহায়তা।",
    objectiveEn: "Provide life-saving dry food, water purifiers, medical camps, and CI-sheet resilient house reconstruction to flash-flood victims.",
    startDate: "2026-08-20",
    endDate: "2026-12-31",
    ownerBn: "সোহেল তাসনীম ফাউন্ডেশন (জরুরি ত্রাণ পর্ষদ)",
    ownerEn: "SohaelTasneem Foundation (Emergency Relief Committee)",
    managerBn: "কামাল হোসেন (জরুরি রেসপন্স কোঅর্ডিনেটর)",
    managerEn: "Kamal Hossain (Emergency Response Coordinator)",
    fundingStatus: "HEALTHY",
    outcomeStatus: "EXCEEDED",
    riskStatus: "LOW",
    health: "GOOD",

    kpis: {
      peopleReached: 12400,
      peopleReachedTarget: 13200,
      activitiesCount: 64,
      outputsCount: 12400,
      outcomeAchievementPct: 94,
      fundsReceived: 4000000,
      totalSpent: 3100000,
      availableFunds: 900000,
      costPerOutcome: 250.0,
      overheadPct: 2.9,
      healthScore: 96,
    },

    finance: {
      fundingReceived: 4000000,
      fundingCommitted: 3600000,
      fundingRestricted: 4000000,
      fundingAvailable: 900000,
      directExpenditure: 3010000,
      sharedExpenditure: 0,
      overheadExpenditure: 90000,
      budgetTotal: 4000000,
      budgetSpent: 3100000,
      budgetUtilizationPct: 77.5,
      costPerBeneficiary: 250.0,
      outcomePer1000Bdt: 4.0,
      payables: 85000,
      receivables: 0,
      bankReconciled: true,
    },

    pipeline: {
      fundsReceivedText: "৳৪০,০০,০০০ প্রাপ্ত জরুরি অনুদান",
      committedText: "৳৩৬,০০,০০০ অনুমোদিত বরাদ্দ",
      directExpenditureText: "৳৩০,১০,০০০ সরাসরি খাদ্য ও নির্মাণ ব্যয়",
      outputsText: "১২,৪০০ জন বন্যাপীড়িত সুবিধাভোগী সাহায্যপ্রাপ্ত",
      outcomesTargetText: "৯৪% দ্রুত পুনরুদ্ধার ও গৃহ পুনর্বাসন সম্পন্ন",
      verifiedImpactText: "ক্ষতিগ্রস্ত পরিবারের নিরাপদ আশ্রয় ও জীবনরক্ষা",
    },

    operations: [
      {
        id: "OP-018-01",
        nameBn: "ফেনী ও পরশুরাম উপজেলায় জরুরি শুকনো খাবার ও পানি বিতরণ",
        nameEn: "Emergency Food Rations & Water Logistics (Feni & Parshuram)",
        category: "service",
        status: "COMPLETED",
        owner: "Kamal Hossain",
        team: "Relief Convoy A",
        location: "Feni & Noakhali",
        schedule: "2026-08-22 to 2026-09-15",
        budget: 1800000,
        spent: 1790000,
        dependencies: [],
        evidenceId: "STFL-EVD-2026-RLF-01",
        issuesCount: 0,
      },
      {
        id: "OP-018-02",
        nameBn: "গৃহহীনদের জন্য ঢেউউটিন ও টেকসই খুঁটি পুনর্বাসন প্যাকেজ",
        nameEn: "Corrugated CI-Sheet & Shelter Rehabilitation Package",
        category: "field",
        status: "IN_PROGRESS",
        owner: "Tareq Ahmed",
        team: "Reconstruction Field Unit",
        location: "Noakhali & Feni",
        schedule: "2026-09-10 to 2026-11-20",
        budget: 1300000,
        spent: 1220000,
        dependencies: ["OP-018-01"],
        evidenceId: "STFL-EVD-2026-RLF-02",
        issuesCount: 0,
      },
    ],

    outcomes: [
      {
        id: "OUT-018-01",
        titleBn: "নিরাপদ শুকনো বাসস্থান ও জরুরি পুষ্টি প্রাপ্ত পরিবার",
        titleEn: "Flood-Affected Families with Restored Safe Shelters",
        target: 13200,
        actual: 12400,
        baseline: 0,
        unit: "Persons",
        measurementPeriod: "Aug-Oct 2026",
        evidenceRef: "STFL-EVD-2026-RLF-02",
        verificationState: "VERIFIED",
        methodology: "GPS Verified Delivery Receipts & Geo-tagged Photographs",
        confidence: 0.99,
      },
    ],

    people: [
      {
        partyId: "STFL-PTY-0220",
        name: "Kamal Hossain",
        roleBn: "জরুরি রেসপন্স সমন্বয়কারী",
        roleEn: "Emergency Response Coordinator",
        relationship: "staff",
        phone: "+880 1817-665544",
        location: "Feni Operations Camp",
      },
    ],

    assets: [
      {
        assetId: "AST-2026-RLF-BOAT-02",
        nameBn: "রেসকিউ স্পিডবোট ও ইঞ্জিন (২টি)",
        nameEn: "Emergency Rescue Speedboats (2 Units)",
        category: "vehicle",
        status: "ACTIVE",
        location: "Feni River Logistics",
        tagId: "TAG-BOAT-02",
      },
    ],

    documents: [
      {
        documentId: "STFL-DOC-2026-PRJ-018-RELIEF-DEC",
        titleBn: "জরুরি মানবিক ত্রাণ ঘোষণা ও বোর্ড এক্সিকিউটিভ ডিক্রি",
        titleEn: "Humanitarian Emergency Declaration & Trustee Mandate",
        type: "CHARTER",
        issuedDate: "2026-08-21",
        hash: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        status: "VALID",
      },
    ],

    compliance: [
      {
        domainId: "COMP-EMERG-01",
        nameBn: "দুর্যোগ ব্যবস্থাপনা ও ত্রাণ মন্ত্রণালয় সমন্বয়",
        nameEn: "Ministry of Disaster Management & Relief Notification",
        status: "CLEAR",
        statutoryRef: "Disaster Management Act 2012 §22",
        lastEvaluated: "2026-09-01",
        details: "District Commissioner & UNO coordination protocols filed.",
      },
    ],

    governance: [
      {
        id: "GOV-018-01",
        type: "APPROVAL",
        titleBn: "অতিরিক্ত ৪,০০০ কম্বল ও শীতবস্ত্র নোয়াখালী স্থানান্তর",
        titleEn: "Emergency Winter Clothing Re-allocation (4,000 units)",
        status: "EXECUTIVE_REVIEW",
        level: 3,
        actor: "Executive Command Center",
        date: "2026-10-15",
      },
    ],
  },

  {
    id: "STFL-PRJ-2026-0022",
    code: "AGRO-2026-BOGURA",
    nameBn: "সমাজকল্যাণ কৃষি-প্রযুক্তি ও বীজ ভাণ্ডার",
    nameEn: "Agro-Tech & Sustainable Seed Bank",
    jurisdictionBn: "বাংলাদেশ · বগুড়া ও উত্তরবঙ্গ বরেন্দ্র অঞ্চল",
    jurisdictionEn: "Bangladesh · Bogura & North Bengal Barind Tract",
    status: "REVIEW",
    typeBn: "টেকসই জীবিকা ও সমবায় জমিভিত্তিক আধুনিক কৃষি",
    typeEn: "Sustainable Livelihood & Community Land Modern Agriculture",
    objectiveBn: "অনাবাদী সমাজকল্যাণ জমিতে আধুনিক সেচ, জৈব সার ও উচ্চফলনশীল সহনশীল বীজ ব্যাংকের মাধ্যমে প্রান্তিক কৃষকদের জীবিকা নিশ্চিতকরণ।",
    objectiveEn: "Transform underutilized community land into climate-resilient paddy seed banks, providing zero-interest equipment leasing to marginal sharecroppers.",
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    ownerBn: "সোহেল তাসনীম ফাউন্ডেশন (স্থায়ী সম্পদ ট্রাস্ট)",
    ownerEn: "SohaelTasneem Foundation (Community Estate Trust)",
    managerBn: "রফিকুল ইসলাম (কৃষিবিদ ও প্রকল্প প্রধান)",
    managerEn: "Rafiqul Islam (Agronomist & Project Lead)",
    fundingStatus: "WATCH",
    outcomeStatus: "PENDING",
    riskStatus: "HIGH",
    health: "RISK",

    kpis: {
      peopleReached: 890,
      peopleReachedTarget: 1440,
      activitiesCount: 42,
      outputsCount: 890,
      outcomeAchievementPct: 62,
      fundsReceived: 5000000,
      totalSpent: 2700000,
      availableFunds: 2300000,
      costPerOutcome: 3033.7,
      overheadPct: 3.2,
      healthScore: 64,
    },

    finance: {
      fundingReceived: 5000000,
      fundingCommitted: 3000000,
      fundingRestricted: 4500000,
      fundingAvailable: 2300000,
      directExpenditure: 2565000,
      sharedExpenditure: 48600,
      overheadExpenditure: 86400,
      budgetTotal: 5000000,
      budgetSpent: 2700000,
      budgetUtilizationPct: 54.0,
      costPerBeneficiary: 3033.7,
      outcomePer1000Bdt: 0.33,
      payables: 450000,
      receivables: 120000,
      bankReconciled: true,
    },

    pipeline: {
      fundsReceivedText: "৳৫০,০০,০০০ কৃষি উন্নয়ন তহবিল",
      committedText: "৳৩০,০০,০০০ অনুমোদিত বরাদ্দ",
      directExpenditureText: "৳২৫,৬৫,০০০ জমি সংস্কার ও বীজ ক্রয় ব্যয়",
      outputsText: "৮৯০ জন প্রান্তিক কৃষককে বীজ ও সেচ সুবিধা প্রদান",
      outcomesTargetText: "৬২% লক্ষ্যমাত্রা সম্পন্ন (অনাবৃষ্টি ও সেচ বিলম্ব)",
      verifiedImpactText: "কৃষি উৎপাদনশীলতা বৃদ্ধি ও ঋণমুক্তি",
    },

    operations: [
      {
        id: "OP-022-01",
        nameBn: "বরেন্দ্র চত্বরে গভীর সৌর সেচ পাম্প স্থাপন",
        nameEn: "Deep Solar Irrigation Pump Installation in Barind Hub",
        category: "procurement",
        status: "BLOCKED",
        owner: "Rafiqul Islam",
        team: "Agro Engineering",
        location: "Bogura Sub-station",
        schedule: "2026-03-15 to 2026-06-30",
        budget: 1500000,
        spent: 980000,
        dependencies: ["APP-02-LOAN"],
        evidenceId: "STFL-EVD-2026-AGRO-01",
        issuesCount: 2,
      },
    ],

    outcomes: [
      {
        id: "OUT-022-01",
        titleBn: "উচ্চফলনশীল সহনশীল বীজ গ্রহণকারী কৃষক পরিবার",
        titleEn: "Farmers Adopting High-Yield Climate-Resilient Seeds",
        target: 1440,
        actual: 890,
        baseline: 300,
        unit: "Farmers",
        measurementPeriod: "Mar-Sep 2026",
        evidenceRef: "STFL-EVD-2026-AGRO-01",
        verificationState: "IN_PROGRESS",
        methodology: "Field Agronomist Crop Yield Ledger",
        confidence: 0.88,
      },
    ],

    people: [
      {
        partyId: "STFL-PTY-0177",
        name: "Rafiqul Islam",
        roleBn: "প্রকল্প প্রধান ও কৃষিবিদ",
        roleEn: "Project Lead & Lead Agronomist",
        relationship: "staff",
        phone: "+880 1715-443322",
        location: "Bogura Field Station",
      },
    ],

    assets: [
      {
        assetId: "AST-2026-AGRO-TRACT-01",
        nameBn: "কৃষি জমি সেচ ও চাষের জন্য ট্র্যাক্টর ও সিডার",
        nameEn: "Agricultural Land Micro-Tractor & Mechanical Seeder",
        category: "equipment",
        status: "ACTIVE",
        location: "Bogura Warehouse",
        tagId: "TAG-AGRO-901",
      },
    ],

    documents: [
      {
        documentId: "STFL-DOC-2026-PRJ-022-TRUST-DEED",
        titleBn: "বগুড়া স্থায়ী সম্পত্তি ব্যবহার ও পরিচালনা চুক্তি",
        titleEn: "Bogura Community Land Stewardship Agreement",
        type: "CONTRACT",
        issuedDate: "2026-02-14",
        hash: "7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e",
        status: "VALID",
      },
    ],

    compliance: [
      {
        domainId: "COMP-TRUST-01",
        nameBn: "স্থায়ী ট্রাস্ট সম্পত্তি নিবন্ধন ও বিধিবদ্ধ বরাদ্দ",
        nameEn: "Statutory Trust & Property Compliance Review",
        status: "WARNING",
        statutoryRef: "Trust & Property Regulatory Framework",
        lastEvaluated: "2026-10-11",
        details: "Annual return filing due within 30 days. Revenue sharing review required.",
      },
    ],

    governance: [
      {
        id: "GOV-022-01",
        type: "APPROVAL",
        titleBn: "বিনা-সুদে ক্ষুদ্রঋণ কিস্তি ব্যাচ #১৪ অনুমোদন (৳৪,৫০,০০০)",
        titleEn: "Zero-Interest Microfinance Batch #14 (৳450,000)",
        status: "AWAITING_FINANCE_SPECIALIST",
        level: 3,
        actor: "Finance Specialist & Unit Head",
        date: "2026-10-13",
      },
    ],
  },
];

export const MY_WORK_DATA = {
  tasks: [
    {
      id: "TSK-01",
      projectId: "STFL-PRJ-2026-0012",
      projectName: "Education Access 2026",
      titleBn: "কুড়িগ্রামের ১৮টি চরে প্রথম প্রান্তিক সাক্ষরতা অগ্রগতি প্রতিবেদন পর্যালোচনা",
      titleEn: "Review Q1 Field Literacy Benchmark Report for Kurigram Schools",
      dueDate: "2026-10-18",
      priority: "HIGH" as const,
      assignedTo: "Sarah Khan / Officer",
      status: "PENDING" as const,
    },
    {
      id: "TSK-02",
      projectId: "STFL-PRJ-2026-0012",
      projectName: "Education Access 2026",
      titleBn: "সৌর লার্নিং ট্যাবলেট ব্যাচ ২৪০-এর কিউআর হার্ডওয়্যার এনক্লেভ নিরীক্ষা",
      titleEn: "Conduct Spot-Check on Solar Tablets Batch 240 QR Enclave Attestation",
      dueDate: "2026-10-20",
      priority: "MEDIUM" as const,
      assignedTo: "Tareq Ahmed",
      status: "IN_PROGRESS" as const,
    },
    {
      id: "TSK-03",
      projectId: "STFL-PRJ-2026-0014",
      projectName: "Community Health Clinic",
      titleBn: "রামপুরা ক্লিনিকের ভ্যাকসিন কোল্ড-চেইন দৈনিক তাপমাত্রা লগ দাখিল",
      titleEn: "Submit Cold-Chain Vaccine Temperature Log (Rampura Clinic)",
      dueDate: "2026-10-16",
      priority: "HIGH" as const,
      assignedTo: "Dr. Farhana Yasmin",
      status: "PENDING" as const,
    },
    {
      id: "TSK-04",
      projectId: "STFL-PRJ-2026-0018",
      projectName: "Eastern Flood Relief",
      titleBn: "ফেনী পরশুরামে ৪২টি ক্ষতিগ্রস্ত পরিবারের টিন ডেলিভারি জিপিএস যাচাই",
      titleEn: "Verify Tin-Roof Delivery GPS coordinates for 42 Homesteads (Feni)",
      dueDate: "2026-10-17",
      priority: "CRITICAL" as const,
      assignedTo: "Kamal Hossain / Field Worker",
      status: "PENDING" as const,
    },
  ],

  approvals: [
    {
      id: "APP-01",
      projectId: "STFL-PRJ-2026-0012",
      projectName: "Education Access 2026",
      titleBn: "লেভেল ৩ ডুয়াল-কন্ট্রোল: গ্রামীণ সৌর ট্যাবলেট ক্রয় ভ্যারিয়েন্স (৳১,৮৫,০০০)",
      titleEn: "Level 3 Dual-Control: Rural Solar Tablet Procurement Variance (৳185,000)",
      amount: 185000,
      level: 3,
      initiator: "Sarah Khan",
      submittedAt: "2026-10-14 11:20",
      status: "PENDING_DUAL_CONTROL" as const,
      riskCategory: "Budget Variance",
    },
    {
      id: "APP-02",
      projectId: "STFL-PRJ-2026-0022",
      projectName: "Agro-Tech Seed Bank",
      titleBn: "বিনা-সুদে কৃষি ঋণ ব্যাচ #১৪ বিতরণ অনুমোদন (৳৪,৫০,০০০)",
      titleEn: "Release of Zero-Interest Microfinance Batch #14 (৳450,000)",
      amount: 450000,
      level: 3,
      initiator: "Rafiqul Islam",
      submittedAt: "2026-10-13 16:45",
      status: "AWAITING_FINANCE" as const,
      riskCategory: "Standard Operational",
    },
    {
      id: "APP-03",
      projectId: "STFL-PRJ-2026-0018",
      projectName: "Eastern Flood Relief",
      titleBn: "জরুরি শীতকালীন ত্রাণ পুনর্বণ্টন: ৪,০০০ কম্বল ও হাইজিন কিট নোয়াখালী প্রেরণ",
      titleEn: "Emergency Relief Blanket Re-allocation (4,000 units to Noakhali)",
      amount: 600000,
      level: 2,
      initiator: "Kamal Hossain",
      submittedAt: "2026-10-15 09:10",
      status: "EXECUTIVE_REVIEW" as const,
      riskCategory: "Humanitarian Fast-Track",
    },
  ],

  alerts: [
    {
      id: "ALT-01",
      projectId: "STFL-PRJ-2026-0012",
      projectName: "Education Access 2026",
      severity: "WARNING" as const,
      titleBn: "অর্থনৈতিক অসঙ্গতি সতর্কতা: সৌর ট্যাবলেট সরবরাহকারী কোটেশনে ৳১,৮৫,০০০ ভ্যারিয়েন্স চিহ্নিত।",
      titleEn: "Unusual Procurement Variance Detected: ৳185,000 discrepancy in vendor quotation vs baseline.",
      source: "Finance Agent STFL-AGT-FIN-01",
      timestamp: "2026-10-14 11:22",
    },
    {
      id: "ALT-02",
      projectId: "STFL-PRJ-2026-0012",
      projectName: "Education Access 2026",
      severity: "ADVISORY" as const,
      titleBn: "এনজিও বিষয়ক ব্যুরো এফডি-৭ পরবর্তী ৬ মাসের প্রতিবেদন উইন্ডো ১৪ দিনের মধ্যে সক্রিয় হবে।",
      titleEn: "Statutory NGO Affairs Bureau FD-7 6-Month Renewal Window Opens in 14 Days.",
      source: "Compliance Intelligence Layer",
      timestamp: "2026-10-12 14:00",
    },
    {
      id: "ALT-03",
      projectId: "STFL-PRJ-2026-0022",
      projectName: "Agro-Tech Seed Bank",
      severity: "CRITICAL" as const,
      titleBn: "অনাবৃষ্টির কারণে সেচ পাম্প অকেজো: বরেন্দ্র অঞ্চলের ধান চারা রক্ষা ঝুঁকির মুখে।",
      titleEn: "Barind deep-tube irrigation motor malfunction: 400 acres paddy seed at severe drought risk.",
      source: "Field Monitoring Unit Bogura",
      timestamp: "2026-10-15 07:30",
    },
  ],

  messages: [
    {
      id: "MSG-01",
      projectId: "STFL-PRJ-2026-0012",
      titleBn: "কৌশলগত এআই এজেন্ট পরামর্শ: কুড়িগ্রাম শীতবস্ত্র সহায়তা সম্প্রসারণ",
      titleEn: "Strategic Agent Recommendation: Expand Kurigram Winter Clothing",
      bodyBn: "শিক্ষা সহায়তা ২০২৬ প্রকল্পে ৯১% লক্ষ্য অর্জিত হয়েছে এবং ৳৩৬,০০,০০০ উদ্বৃত্ত তহবিল রয়েছে। চরাঞ্চলের শীত তীব্র হওয়ার আগেই শিশুদের সোয়েটার সরবরাহে ৳৮,০০,০০০ পুনঃবরাদ্দ সুপারিশ করা হলো।",
      bodyEn: "Based on 91% milestone completion and ৳3.6M available liquidity, allocating ৳800,000 for child thermal sweaters ahead of November riverine fog is highly recommended.",
      sender: "STFL Strategic Planning Agent (STFL-AGT-STRAT-01)",
      isAiAgentRecommendation: true,
      confidence: 0.94,
      timestamp: "2026-10-15 08:30",
    },
    {
      id: "MSG-02",
      titleBn: "বোর্ড অব ট্রাস্টিজের যৌথ প্রান্তিক পর্যালোচনা বৈঠক",
      titleEn: "Board of Trustees Combined Q3 Portfolio Review",
      bodyBn: "আগামী ২৪ অক্টোবর ২০২৬ বিকাল ৩টায় ৪টি চলমান প্রকল্পের আর্থিক ও প্রভাব মূল্যায়ন অনুষ্ঠিত হবে। সকল প্রকল্প প্রধানকে আপডেট রিপোর্ট প্রস্তুত রাখার অনুরোধ জানানো হচ্ছে।",
      bodyEn: "The Q3 Comprehensive Projects Review with Trustee Board is scheduled for October 24, 2026 at 15:00 BST. All Project Leads should finalize outcome metrics.",
      sender: "Trustee Secretariat",
      timestamp: "2026-10-14 16:00",
    },
  ],
};

// -------------------------------------------------------------
// WORKSPACE CONTEXT & PROVIDER
// -------------------------------------------------------------

interface GovernedWorkspaceContextType {
  // Legacy / Fundamental IAM State
  activeClass: UserClass;
  setActiveClass: (cls: UserClass) => void;
  lang: "bn" | "en";
  setLang: (lang: "bn" | "en") => void;
  getConsoleAccess: (code: string) => ConsoleAccessLevel;
  isSuperAdminBlockedOnMutation: (code: string) => boolean;

  // New Project-Centric Operating System State
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  activeProjectId: string; // "ALL" or Project ID
  setActiveProjectId: (id: string) => void;
  activeProjectFacet: ProjectFacet;
  setActiveProjectFacet: (facet: ProjectFacet) => void;
  projects: ProjectEntity[];
  activeProject: ProjectEntity;
  myWorkData: typeof MY_WORK_DATA;
  managementClusters: ConsoleCluster[];
}

const GovernedWorkspaceContext = createContext<GovernedWorkspaceContextType | null>(null);

export function GovernedWorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeClass, setActiveClass] = useState<UserClass>("CLASS_00");
  const [lang, setLang] = useState<"bn" | "en">("bn");
  
  // Navigation & Project-Centric state
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("portfolio");
  const [activeProjectId, setActiveProjectIdRaw] = useState<string>("ALL");
  const [activeProjectFacet, setActiveProjectFacet] = useState<ProjectFacet>("overview");

  const projects = CANONICAL_PROJECTS;

  const setActiveProjectId = (id: string) => {
    setActiveProjectIdRaw(id);
    if (id === "ALL") {
      setActiveTab("portfolio");
    } else {
      setActiveTab("project");
    }
  };

  // Find active project or fallback to first
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  const getConsoleAccess = (code: string) => evaluateClientConsoleAccess(code, activeClass);
  const isSuperAdminBlockedOnMutation = (code: string) =>
    activeClass === "CLASS_00" && (code === "finance" || code === "property" || code === "microfinance");

  return (
    <GovernedWorkspaceContext.Provider
      value={{
        activeClass,
        setActiveClass,
        lang,
        setLang,
        getConsoleAccess,
        isSuperAdminBlockedOnMutation,
        activeTab,
        setActiveTab,
        activeProjectId,
        setActiveProjectId,
        activeProjectFacet,
        setActiveProjectFacet,
        projects,
        activeProject,
        myWorkData: MY_WORK_DATA,
        managementClusters: MANAGEMENT_CLUSTERS,
      }}
    >
      {children}
    </GovernedWorkspaceContext.Provider>
  );
}

export function useGovernedWorkspace() {
  const ctx = useContext(GovernedWorkspaceContext);
  if (!ctx) {
    throw new Error("useGovernedWorkspace must be used within a GovernedWorkspaceProvider");
  }
  return ctx;
}
