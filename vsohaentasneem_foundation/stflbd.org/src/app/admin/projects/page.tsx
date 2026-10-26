"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Folder,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
} from "iconoir-react";

export default function ProjectsConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("projects");

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
            ? `প্রকল্প ও সংস্থা ব্যবস্থাপনা কনসোল (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৩ (সংস্থা প্রধান) এবং ক্লাস ০৪ (প্রকল্প কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Projects & Agency Management Console is not accessible for ${activeClass}. Permitted User Classes: CLASS_03 and CLASS_04.`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 09</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Folder width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "প্রকল্প ও সংস্থা ব্যবস্থাপনা কনসোল" : "Projects & Agency Management Console"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "ত্রাণ ও পুনর্বাসন লজিস্টিকস, সুবিধাভোগী জরিপ অভিযান, প্রকল্প মাইলফলক এবং ডোনার প্রভাব মূল্যায়ন প্রতিবেদন।"
              : "Disaster relief logistics, beneficiary survey campaigns, project milestones, donor impact reporting."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            RELIEF & CAMPAIGNS
          </span>
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#081F2D]">
          {lang === "bn" ? "সক্রিয় মানবিক প্রকল্পসমূহ" : "Active Humanitarian Projects"}
        </h2>

        <div className="divide-y divide-[#E7E7E2] border border-[#E7E7E2] rounded-lg overflow-hidden">
          {[
            { code: "PRJ-FL-2026", title: "Sylhet Flood Relief & Reconstruction Phase 2", progress: "68%", budget: "4,500,000 BDT", beneficiaries: "6,200 Families" },
            { code: "PRJ-ED-2026", title: "Rural Primary School Solar Electrification — Rangpur", progress: "82%", budget: "1,800,000 BDT", beneficiaries: "14 Schools" },
            { code: "PRJ-MD-2026", title: "Mobile Healthcare Clinic — Char Areas", progress: "45%", budget: "2,200,000 BDT", beneficiaries: "4,100 Patients" },
          ].map((p) => (
            <div key={p.code} className="p-4 bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#0B2B43]">{p.code}</span>
                <div className="text-xs font-semibold text-[#081F2D]">{p.title}</div>
                <div className="text-[11px] text-stone-500">
                  Budget: {p.budget} • Beneficiaries: {p.beneficiaries}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-24 bg-stone-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#FF6B35] h-full rounded-full" style={{ width: p.progress }}></div>
                </div>
                <span className="text-xs font-mono font-bold text-[#081F2D]">{p.progress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
