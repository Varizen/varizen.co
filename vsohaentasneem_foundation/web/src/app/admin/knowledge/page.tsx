"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  BookStack,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  InfoCircle,
  Eye,
  Refresh,
  Page,
  Group,
  Activity,
  CheckCircle,
  Clock
} from "iconoir-react";

interface ExperienceSegment {
  id: string;
  nameEn: string;
  nameBn: string;
  targetAudience: string;
  capabilities: string[];
  activeCourses: number;
  certificationsIssued: number;
}

const SEGMENTS: ExperienceSegment[] = [
  {
    id: "SEG-01",
    nameEn: "User Learning Center",
    nameBn: "ব্যবহারকারী শিখন ও সচেতনতা কেন্দ্র",
    targetAudience: "Public citizens, beneficiaries, tenants, borrowers, field volunteers",
    capabilities: [
      "Visual & pictorial tutorials in Bengali & English",
      "Interactive onboarding flows for Android app users",
      "Rights, entitlements & public grievance procedures",
      "Self-paced financial literacy & ethical microfinance rules"
    ],
    activeCourses: 8,
    certificationsIssued: 1420
  },
  {
    id: "SEG-02",
    nameEn: "Service & Operations Center",
    nameBn: "সেবা ও অপারেশনাল জ্ঞান কেন্দ্র",
    targetAudience: "Field workers, project supervisors, clinical staff, logistics officers",
    capabilities: [
      "Standard Operating Procedures (SOPs) & checklists",
      "Disaster relief dispatch runbooks & safety protocols",
      "Physical field proof collection & GPS verification",
      "Incident triage & emergency escalation paths"
    ],
    activeCourses: 12,
    certificationsIssued: 840
  },
  {
    id: "SEG-03",
    nameEn: "Administration & Governance Center",
    nameBn: "প্রশাসন, শাসন ও নীতি কেন্দ্র",
    targetAudience: "Trustees, executive leadership, legal counsel, finance controllers",
    capabilities: [
      "IAM delegation rules & dual-control authorization manuals",
      "Statutory compliance reporting & NBR/NGOAB filings",
      "PostgreSQL audit trail inspection & data integrity",
      "Autonomous agent monitoring & kill-switch operations"
    ],
    activeCourses: 6,
    certificationsIssued: 95
  },
  {
    id: "SEG-04",
    nameEn: "Moderation & Relief Center",
    nameBn: "মডারেশন ও প্রাতিষ্ঠানিক রিলিফ কেন্দ্র",
    targetAudience: "Moderator A (Operational Support) & Moderator B (Technical Relief)",
    capabilities: [
      "Strictly bounded operational relief workflows",
      "Support ticket triage & non-financial escalation",
      "Restricted boundary validation (zero IAM / zero funds mutation)",
      "Continuous session audit & dual-verifier handoff"
    ],
    activeCourses: 4,
    certificationsIssued: 32
  }
];

export default function KnowledgeConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("knowledge");
  const [activeTab, setActiveTab] = useState<string>("SEG-01");

  if (access === "DENIED") {
    return (
      <div className="bg-white rounded-xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center mb-4">
          <Lock width={24} height={24} />
        </div>
        <h2 className="text-lg font-bold text-[#081F2D] mb-2">
          {lang === "bn" ? "প্রবেশাধিকার সংরক্ষিত (Access Denied)" : "Access Denied"}
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          {lang === "bn"
            ? `জ্ঞান, প্রশিক্ষণ ও সেবা কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৯ (মানবসম্পদ), ক্লাস ০৩/০৪ এবং রিলিফ মডারেটরদের জন্য উন্মুক্ত।`
            : `The Knowledge, Training & Service Console is not accessible for ${activeClass}. Permitted Classes: CLASS_09, CLASS_03/04, MODERATOR_A, and MODERATOR_B.`}
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B2B43] hover:text-[#FF6B35]"
        >
          <NavArrowLeft width={14} height={14} />
          {lang === "bn" ? "হাব-এ ফিরে যান" : "Back to Management Hub"}
        </Link>
      </div>
    );
  }

  const selectedSegment = SEGMENTS.find(s => s.id === activeTab) || SEGMENTS[0];

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-xs text-stone-500 hover:text-[#0B2B43] flex items-center gap-1">
              <NavArrowLeft width={12} height={12} />
              {lang === "bn" ? "কনসোল তালিকা" : "Consoles"}
            </Link>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs font-mono text-stone-400">CONSOLE 18</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <BookStack width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "জ্ঞান, প্রশিক্ষণ ও সেবা কেন্দ্র" : "Knowledge, Training & Service Console"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "৪টি প্রাতিষ্ঠানিক অভিজ্ঞতা স্তর, ব্যবহারকারী প্রশিক্ষণ, এসওপি ম্যানুয়াল ও রিলিফ মডারেটর কার্যপ্রবাহ।"
              : "4 governed experience segments, verified training curricula, operational SOPs, and bounded relief moderation."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            4 SEGMENTS ACTIVE
          </span>
        </div>
      </div>

      {/* Segment Selector Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SEGMENTS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`p-4 rounded-xl text-left border transition-all ${
              activeTab === s.id
                ? "bg-[#081F2D] text-white border-[#081F2D] shadow-sm"
                : "bg-white text-stone-700 border-stone-200 hover:border-stone-300"
            }`}
          >
            <div className={`text-[10px] font-mono font-bold tracking-wider uppercase mb-1 ${
              activeTab === s.id ? "text-[#FF6B35]" : "text-stone-400"
            }`}>
              {s.id}
            </div>
            <div className="font-bold text-sm leading-snug">{s.nameEn}</div>
            <div className={`font-hind text-xs mt-1 truncate ${
              activeTab === s.id ? "text-stone-300" : "text-stone-500"
            }`}>
              {s.nameBn}
            </div>
          </button>
        ))}
      </div>

      {/* Active Segment Detail Card */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 lg:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#FF6B35] tracking-wider uppercase">
              {selectedSegment.id} GOVERNED SEGMENT
            </div>
            <h2 className="text-2xl font-bold text-[#081F2D] mt-1">
              {selectedSegment.nameEn}
            </h2>
            <h3 className="font-hind text-base text-stone-600 mt-0.5">
              {selectedSegment.nameBn}
            </h3>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] font-mono text-stone-500 uppercase">Active Courses</div>
              <div className="text-xl font-bold text-stone-900">{selectedSegment.activeCourses}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-stone-500 uppercase">Certified Users</div>
              <div className="text-xl font-bold text-emerald-600">{selectedSegment.certificationsIssued}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
            Target Audience & Scope
          </h4>
          <p className="text-sm text-stone-700 bg-stone-50 p-4 rounded-lg border border-stone-100">
            {selectedSegment.targetAudience}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-3">
            Governed Capabilities & Training Modules
          </h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {selectedSegment.capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg border border-stone-100 bg-stone-50/50">
                <CheckCircle width={16} height={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-stone-800 leading-relaxed">{cap}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedSegment.id === "SEG-04" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <WarningTriangle width={16} height={16} className="text-amber-700" />
              Constitutional Invariant 10: Strict Relief Moderator Boundaries
            </div>
            <p className="leading-relaxed">
              Moderator A and Moderator B provide administrative relief during peak operational load or emergency leave.
              Neither role may be granted Super Admin credentials, financial disbursement release authority, or the ability
              to alter immutable audit ledgers. All moderation decisions are logged with 100% provenance in PostgreSQL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
