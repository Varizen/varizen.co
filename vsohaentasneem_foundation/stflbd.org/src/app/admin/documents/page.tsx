"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Page,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  ShieldCheck,
} from "iconoir-react";

export default function DocumentsConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("documents");

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
            ? `নথিপত্র নিয়ন্ত্রণ কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৮ (নথি নিয়ন্ত্রণ কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Document Control Center is not accessible for ${activeClass}. Permitted User Class: CLASS_08 (Document Officers).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 11</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Page width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "নথিপত্র নিয়ন্ত্রণ কেন্দ্র (Document Control)" : "Document Control Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "দ্বিভাষিক টেমপ্লেট (STFL-TPL-*), ডিজিটাল নথি প্রদান, ক্রিপ্টোগ্রাফিক হ্যাশ যাচাই ও পাবলিক যাচাই পোর্টাল।"
              : "Official bilingual templates (STFL-TPL-*), digital document issuance, cryptographic hash verification."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            SHA-256 VERIFIED
          </span>
        </div>
      </div>

      {/* Official Templates Feed */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#081F2D]">
          {lang === "bn" ? "অনুমোদিত দ্বিভাষিক টেমপ্লেট ক্যাটালগ" : "Official Bilingual Templates Catalog"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { code: "STFL-TPL-LEASE-COM-01", titleBn: "বাণিজ্যিক ইজারা চুক্তিপত্র (দ্বিভাষিক)", titleEn: "Commercial Lease Agreement (Bilingual)", ver: "v2.1" },
            { code: "STFL-TPL-LEASE-RES-01", titleBn: "আবাসিক ভাড়া চুক্তিপত্র (দ্বিভাষিক)", titleEn: "Residential Tenancy Agreement (Bilingual)", ver: "v1.4" },
            { code: "STFL-TPL-LOAN-01", titleBn: "বিনা-সুদে কল্যাণ ঋণ চুক্তিপত্র", titleEn: "Zero-Interest Welfare Loan Contract", ver: "v2.0" },
            { code: "STFL-TPL-RES-BOARD-01", titleBn: "বোর্ড অব ট্রাস্টিজ রেজোলিউশন ফরম্যাট", titleEn: "Board of Trustees Resolution Template", ver: "v1.0" },
          ].map((t) => (
            <div key={t.code} className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#0B2B43]">{t.code}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">{t.ver}</span>
              </div>
              <div className="text-xs font-semibold text-[#081F2D]">{lang === "bn" ? t.titleBn : t.titleEn}</div>
              <div className="text-[11px] text-stone-500 font-mono">Issued via /api/v1/documents/print</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
