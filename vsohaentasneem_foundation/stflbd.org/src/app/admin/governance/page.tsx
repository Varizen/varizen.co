"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  ShieldCheck,
  Lock,
  Page,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Activity,
} from "iconoir-react";

export default function GovernanceConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("governance");

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
            ? `শাসন ও পরিচালনা পর্ষদ কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি প্রধানত ক্লাস ০১ (বোর্ড ট্রাস্টি) এর জন্য সংরক্ষিত।`
            : `The Governance Center is not accessible for ${activeClass}. Primary User Class: CLASS_01 (Trustees & Board Members).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 02</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <ShieldCheck width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "শাসন ও পরিচালনা পর্ষদ কেন্দ্র" : "Governance Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "বোর্ড রেজোলিউশন, স্থায়ী ট্রাস্ট দলিল তদারকি, প্রাতিষ্ঠানিক ঝুঁকি এবং লেভেল ৫ ডুয়াল-কন্ট্রোল অনুমোদন।"
              : "Board resolutions, statutory endowment oversight, institutional risk heatmaps, Level 5 dual-control approvals."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-purple-50 text-purple-800 border border-purple-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            TRUSTEE JURISDICTION
          </span>
        </div>
      </div>

      {/* Board Resolutions Feed */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#081F2D]">
          {lang === "bn" ? "বোর্ড রেজোলিউশন ও দ্বৈত-নিয়ন্ত্রণ অনুমোদন কিউ" : "Board Resolutions & Dual-Control Approval Queue"}
        </h2>

        <div className="divide-y divide-[#E7E7E2] border border-[#E7E7E2] rounded-lg overflow-hidden">
          {[
            {
              code: "BOD-RES-2026-001",
              title: "Approval of FY2026 Humanitarian Relief Fund (5,000,000 BDT)",
              status: "APPROVED (Dual Control Complete)",
              signatures: "2 of 2 Board Members Signed",
              level: "LEVEL 5 DUAL-CONTROL",
            },
            {
              code: "BOD-RES-2026-002",
              title: "Statutory Trust Deed Mutation and Registration — Keraniganj Estate",
              status: "PENDING SECOND TRUSTEE SIGNATURE",
              signatures: "1 of 2 Board Members Signed",
              level: "LEVEL 5 DUAL-CONTROL",
            },
            {
              code: "BOD-RES-2026-003",
              title: "Autonomous Agent Authorization & Kill-Switch Threshold Ratification",
              status: "APPROVED (Dual Control Complete)",
              signatures: "2 of 2 Board Members Signed",
              level: "LEVEL 5 DUAL-CONTROL",
            },
          ].map((r) => (
            <div key={r.code} className="p-4 bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0B2B43]">{r.code}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">{r.level}</span>
                </div>
                <div className="text-xs font-semibold text-[#081F2D]">{r.title}</div>
                <div className="text-[11px] text-stone-500">{r.signatures}</div>
              </div>

              <div>
                <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                  r.status.includes("APPROVED") ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-amber-100 text-amber-800 border-amber-300"
                }`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
