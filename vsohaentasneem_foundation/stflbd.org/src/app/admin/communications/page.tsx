"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Message,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
} from "iconoir-react";

export default function CommunicationsConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("communications");

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
            ? `যোগাযোগ ও বার্তা কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৩ (যোগাযোগ প্রধান) এবং ক্লাস ০৪ (যোগাযোগ কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Communications Center is not accessible for ${activeClass}. Permitted User Classes: CLASS_03 and CLASS_04.`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 12</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Message width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "যোগাযোগ ও বার্তা কেন্দ্র (Comms Gateway)" : "Communications Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "হোয়াটসঅ্যাপ, এসএমএস ও ইমেইল গেটওয়ে প্রেরণ, দ্বিভাষিক টেমপ্লেট নিবন্ধন, ডেলিভারি রশিদ ও হার সীমা নিয়ন্ত্রণ।"
              : "Governed WhatsApp, Email, and SMS gateway dispatch, bilingual template registration, delivery receipts."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            RATE LIMITED
          </span>
        </div>
      </div>

      {/* Gateway State */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { channel: "WhatsApp Business API", status: "ONLINE", rate: "60 msg/min limit" },
          { channel: "SMS Gateway (Grameenphone/Banglalink)", status: "ONLINE", rate: "120 msg/min limit" },
          { channel: "Transactional Email (SMTP/Worker)", status: "ONLINE", rate: "300 msg/min limit" },
        ].map((g) => (
          <div key={g.channel} className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#081F2D]">{g.channel}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {g.status}
              </span>
            </div>
            <div className="text-[11px] text-stone-500 font-mono">{g.rate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
