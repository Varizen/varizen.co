"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Cpu,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Activity,
  ShieldCheck,
} from "iconoir-react";

export default function AgentsConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("agents");

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
            ? `স্বায়ত্তশাসিত এজেন্ট নিয়ন্ত্রণ কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৭ (নিরাপত্তা), ক্লাস ০২ (নির্বাহী) এবং ক্লাস ০৩ (বিভাগীয় প্রধান) এর জন্য সংরক্ষিত।`
            : `The Agent Control Center is not accessible for ${activeClass}. Permitted User Classes: CLASS_07, CLASS_02, and CLASS_03.`}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-xs text-stone-500 hover:text-[#0B2B43] flex items-center gap-1">
              <NavArrowLeft width={12} height={12} />
              {lang === "bn" ? "কনসোল তালিকা" : "Consoles"}
            </Link>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs font-mono text-stone-400">CONSOLE 14</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Cpu width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "স্বায়ত্তশাসিত এজেন্ট নিয়ন্ত্রণ কেন্দ্র" : "Agent Control Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "এজেন্ট রেজিস্ট্রি (STFL-AGT-*), টুল হোয়াইটলিস্টিং, দৈনিক বাজেট সীমা, কনফিডেন্স স্কোর ট্র্যাকিং ও তাৎক্ষণিক পজ।"
              : "Autonomous agent registry (STFL-AGT-*), tool whitelisting, daily budget limits, confidence score monitoring."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            LEVEL 3 CEILING ENFORCED
          </span>
        </div>
      </div>

      {/* Inviolable Ceiling Notice */}
      <div className="bg-[#0B2B43]/5 border border-[#0B2B43]/15 p-4 rounded-xl text-xs text-[#0B2B43] leading-relaxed flex items-start gap-3">
        <ShieldCheck width={18} height={18} className="text-[#FF6B35] flex-shrink-0 mt-0.5" />
        <div>
          <strong>
            {lang === "bn"
              ? "সাংবিধানিক লেভেল ৩ স্বায়ত্তশাসন সীমা (STFL VI সংবিধান):"
              : "Constitutional Level 3 Autonomous Authority Ceiling (STFL VI):"}
          </strong>{" "}
          {lang === "bn"
            ? "কোনো এআই এজেন্ট স্বায়ত্তশাসিতভাবে লেভেল ৩ এর বেশি কর্তৃত্ব প্রয়োগ করতে পারবে না। লেভেল ৪ (ব্যবস্থাপনা অনুমোদন) এবং লেভেল ৫ (দ্বৈত নিয়ন্ত্রণ) এর জন্য বাধ্যতামূলকভাবে মানব কর্মকর্তা ও শারীরিক ডিভাইসের প্রয়োজন।"
            : "No AI agent may autonomously execute actions exceeding Authority Level 3. Level 4 (Managerial Approval) and Level 5 (Dual Control) strictly require physical human credential signing."}
        </div>
      </div>

      {/* Registered Departmental Agents */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#081F2D]">
          {lang === "bn" ? "নিবন্ধিত বিভাগীয় স্বায়ত্তশাসিত এজেন্টসমূহ" : "Registered Autonomous Departmental Agents"}
        </h2>

        <div className="divide-y divide-[#E7E7E2] border border-[#E7E7E2] rounded-lg overflow-hidden">
          {[
            { id: "STFL-AGT-FIN-001", unit: "FINANCE", type: "Reconciliation Specialist", status: "ENABLED", tools: "read_ledger, draft_voucher", ceiling: "LEVEL 3" },
            { id: "STFL-AGT-PROP-001", unit: "PROPERTY", type: "Tenancy Analyst", status: "ENABLED", tools: "read_leases, calculate_due_rent", ceiling: "LEVEL 3" },
            { id: "STFL-AGT-MFI-001", unit: "MICROFINANCE", type: "Portfolio Risk Analyst", status: "ENABLED", tools: "calculate_repayment, query_borrower", ceiling: "LEVEL 3" },
            { id: "STFL-AGT-HR-001", unit: "WORKFORCE", type: "Shift Roster Assistant", status: "ENABLED", tools: "read_checkins, prepare_stipend_draft", ceiling: "LEVEL 3" },
          ].map((agt) => (
            <div key={agt.id} className="p-4 bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0B2B43]">{agt.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">{agt.unit}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{agt.ceiling}</span>
                </div>
                <div className="text-xs font-semibold text-[#081F2D]">{agt.type}</div>
                <div className="text-[11px] text-stone-500 font-mono">Permitted Tools: {agt.tools}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {agt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
