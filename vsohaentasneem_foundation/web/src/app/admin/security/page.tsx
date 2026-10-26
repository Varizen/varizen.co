"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Lock,
  ShieldCheck,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Activity,
} from "iconoir-react";

export default function SecurityConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("security");

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
            ? `নিরাপত্তা ও নিরীক্ষা কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৭ (নিরাপত্তা কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Security & Audit Center is not accessible for ${activeClass}. Permitted User Class: CLASS_07 (Security & Audit Officers).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 13</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Lock width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "নিরাপত্তা ও নিরীক্ষা কেন্দ্র (Security & Audit)" : "Security & Audit Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "হার্ডওয়্যার অ্যাটেস্টেশন পর্যালোচনা, সন্দেহজনক লগইন ফরেনসিক্স, প্রিন্ট টোকেন অডিট ও কুইক কিল-সুইচ পরিচালনা।"
              : "Hardware device attestation review, suspicious login forensics, session revocation, print token audits."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            AUDIT INTEGRITY LOCKED
          </span>
        </div>
      </div>

      {/* Security Health & Forensics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">System Threat Level</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">LOW / NORMAL</span>
          <span className="text-xs text-stone-500">Zero Infiltration Flags</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Emergency Kill Switch</span>
          <span className="text-2xl font-bold text-[#081F2D] mt-1 block font-mono">ARMED & READY</span>
          <span className="text-xs text-stone-500">&lt;15ms Fleet-Wide Halt</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">KeyStore Attested Devices</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">100% Attested</span>
          <span className="text-xs text-stone-500">Hardware Keystore Enclave Active</span>
        </div>
      </div>
    </div>
  );
}
