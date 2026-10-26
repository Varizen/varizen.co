"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Group,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
} from "iconoir-react";

export default function WorkforceConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("workforce");

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
            ? `কর্মীবাহিনী ও মানবসম্পদ কনসোল (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৯ (এইচআর বিশেষজ্ঞ) এবং ক্লাস ০৩ (বিভাগীয় প্রধান) এর জন্য সংরক্ষিত।`
            : `The Workforce Management Console is not accessible for ${activeClass}. Permitted User Classes: CLASS_09 (HR Specialist) and CLASS_03 (Unit Head).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 07</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Group width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "কর্মীবাহিনী ও মানবসম্পদ কনসোল (HR)" : "Workforce Management Console (HR)"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "কর্মী ও স্বেচ্ছাসেবক ডিরেক্টরি, জিওফেন্সড মোবাইল চেক-ইন অডিট, ছুটির আবেদন, রোস্টার এবং বেতন প্রস্তুতি।"
              : "Staff & volunteer directory, geofenced mobile check-in audits, leave requests, shift rosters, stipend/payroll."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            GEOFENCED AUDITS
          </span>
        </div>
      </div>

      {/* Workforce Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Active Staff & Volunteers</span>
          <span className="text-2xl font-bold text-[#081F2D] mt-1 block">48 Staff / 120 Vol</span>
          <span className="text-xs text-stone-500">Dhaka, Sylhet, Rangpur</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Geofenced Check-In Today</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">46 Checked In</span>
          <span className="text-xs text-stone-500">97.1% Attendance Rate</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Pending Leave Requests</span>
          <span className="text-2xl font-bold text-blue-700 mt-1 block">2 Pending</span>
          <span className="text-xs text-stone-500">Awaiting Manager Approval</span>
        </div>
      </div>
    </div>
  );
}
