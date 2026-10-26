"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Server,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Activity,
  ShieldCheck,
} from "iconoir-react";

export default function SystemConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("system");

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
            ? `সিস্টেম ও অবকাঠামো প্রশাসন কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি শুধুমাত্র ক্লাস ০০ (প্ল্যাটফর্ম সুপার অ্যাডমিন) এর জন্য সংরক্ষিত।`
            : `The System Administration Center is not accessible for ${activeClass}. Permitted User Class: CLASS_00 (Platform Super Admin).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 16</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Server width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "সিস্টেম ও অবকাঠামো প্রশাসন কেন্দ্র" : "System Administration Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "ডেটাবেস মাইগ্রেশন এক্সিকিউশন, হাইপারড্রাইভ সংযোগ পুল মেট্রিক্স এবং ক্লাউডফ্লেয়ার এজ ক্যাশিং নীতি।"
              : "Database migration execution, Hyperdrive connection pool metrics, Cloudflare edge caching policies."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            PLATFORM INFRASTRUCTURE
          </span>
        </div>
      </div>

      {/* Production Verification Status Card */}
      <div className="bg-amber-500/10 border border-amber-300/80 p-5 rounded-xl shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WarningTriangle width={18} height={18} className="text-amber-700" />
            <h2 className="text-sm font-bold text-[#081F2D] uppercase tracking-wider font-mono">
              {lang === "bn" ? "প্রোডাকশন যাচাইকরণ অবস্থা" : "Production Verification Status"}
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
            PENDING
          </span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed">
          {lang === "bn"
            ? "এসটিএফএল স্থাপত্য সংবিধানের ধারা ২.২ অনুসারে: 'সরাসরি প্রোডাকশন প্রমাণ ছাড়া কখনোই প্রোডাকশন যাচাইকৃত দাবি করবেন না।' ক্লাউডফ্লেয়ার এজ ওয়ার্কার ও রিয়েল ক্যারিয়ার ইন্টিগ্রেশন সফলভাবে ডিপ্লয় না হওয়া পর্যন্ত এই অবস্থা 'PENDING' থাকবে।"
            : "In accordance with STFL Architecture Constitution §2.2: 'Never claim PRODUCTION VERIFIED without ACTUAL PRODUCTION EVIDENCE.' Production verification strictly remains PENDING until Cloudflare edge worker deployment and real carrier routes are executed."}
        </p>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-1">
          <span className="text-xs font-mono text-stone-500 block">Database Migrations</span>
          <span className="text-lg font-bold text-[#081F2D] block">0001_init + 0002_aio</span>
          <span className="text-xs text-emerald-700 font-medium">PostgreSQL 16 Idempotent</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-1">
          <span className="text-xs font-mono text-stone-500 block">Hyperdrive Connection Pool</span>
          <span className="text-lg font-bold text-[#081F2D] block">Pooled &amp; Accelerated</span>
          <span className="text-xs text-emerald-700 font-medium">&lt;10ms Edge RTT</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm space-y-1">
          <span className="text-xs font-mono text-stone-500 block">Edge Caching Policies</span>
          <span className="text-lg font-bold text-[#081F2D] block">Stateless Private No-Store</span>
          <span className="text-xs text-emerald-700 font-medium">Zero Leakage on /private</span>
        </div>
      </div>
    </div>
  );
}
