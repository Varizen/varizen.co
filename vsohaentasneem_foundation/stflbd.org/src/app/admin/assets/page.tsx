"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Package,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
} from "iconoir-react";

export default function AssetsConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("assets");

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
            ? `স্থাবর ও অস্থাবর সম্পদ কনসোল (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৩ (প্রশাসন প্রধান) এবং ক্লাস ০৪ (সম্পদ কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Asset Management Console is not accessible for ${activeClass}. Permitted User Classes: CLASS_03 and CLASS_04.`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 10</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Package width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "স্থাবর ও অস্থাবর সম্পদ কনসোল" : "Asset Management Console"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "স্থায়ী সম্পদ রেজিস্টার, সরলরৈখিক অবচয় সূচি, শারীরিক কিউআর/এনএফসি ট্যাগ অডিট এবং সম্পদ নিষ্পত্তি।"
              : "Fixed asset register, straight-line depreciation schedules, physical QR/NFC tag audits, asset disposal."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            QR/NFC TAGGED
          </span>
        </div>
      </div>

      {/* Asset Register Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Total Registered Assets</span>
          <span className="text-2xl font-bold text-[#081F2D] mt-1 block">234 Items</span>
          <span className="text-xs text-stone-500">Vehicles, Generators, IT Hardware</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Net Book Value</span>
          <span className="text-2xl font-bold text-[#081F2D] mt-1 block">18,450,000 BDT</span>
          <span className="text-xs text-emerald-700 font-medium">Straight-Line Depreciated</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Physical Audit Compliance</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">94.2%</span>
          <span className="text-xs text-stone-500">Q3 Physical Tag Scan</span>
        </div>
      </div>
    </div>
  );
}
