"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Activity,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Bank,
  Building,
  Group,
  PiggyBank,
} from "iconoir-react";

export default function ExecutiveConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("executive");

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
            ? `নির্বাহী কমান্ড সেন্টার (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি প্রধানত ক্লাস ০২ (নির্বাহী নেতৃত্ব: সিইও/চেয়ারপারসন) এর জন্য সংরক্ষিত।`
            : `The Executive Command Center is not accessible for ${activeClass}. Primary User Class: CLASS_02 (Executive Command: CEO, Chairperson).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 03</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Activity width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "নির্বাহী কমান্ড সেন্টার (Executive Command)" : "Executive Command Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "আন্তঃবিভাগীয় কেপিআই, কৌশলগত বাজেট ব্যবহার, মানবিক জরুরি অবস্থা ঘোষণা ও উচ্চস্তরের সমন্বয়।"
              : "Cross-unit KPIs, strategic budget utilization, humanitarian emergency declarations, executive escalations."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            EXECUTIVE OVERSIGHT
          </span>
        </div>
      </div>

      {/* Cross-Unit KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "FY26 Strategic Budget", val: "25,000,000 BDT", sub: "50.6% Utilized", icon: Bank },
          { label: "Estate & Tenancy Occupancy", val: "96.2%", sub: "124 Units Managed", icon: Building },
          { label: "Zero-Interest Microfinance", val: "4,260,000 BDT", sub: "98.8% Recovery Rate", icon: PiggyBank },
          { label: "Workforce Deployment", val: "48 Staff / 120 Vol", sub: "97.1% Geofenced Active", icon: Group },
        ].map((k) => (
          <div key={k.label} className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs font-mono font-semibold">{k.label}</span>
              <k.icon width={18} height={18} />
            </div>
            <div className="text-lg font-bold text-[#081F2D]">{k.val}</div>
            <div className="text-xs text-emerald-700 font-medium">{k.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
