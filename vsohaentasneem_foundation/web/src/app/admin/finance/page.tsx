"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Bank,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Refresh,
  Page,
  ShieldCheck,
  InfoCircle,
} from "iconoir-react";

export default function FinanceConsolePage() {
  const { activeClass, lang, getConsoleAccess, isSuperAdminBlockedOnMutation } = useGovernedWorkspace();
  const access = getConsoleAccess("finance");
  const isSuperAdminBlocked = isSuperAdminBlockedOnMutation("finance");

  const [disburseAmount, setDisburseAmount] = useState<number>(5000);
  const [mutationResult, setMutationResult] = useState<{
    status: "IDLE" | "SUCCESS" | "BLOCKED" | "ESCALATED";
    message: string;
  }>({ status: "IDLE", message: "" });

  const handleTestDisbursement = () => {
    if (activeClass === "CLASS_00") {
      setMutationResult({
        status: "BLOCKED",
        message:
          "HTTP 403 Forbidden — CONSTITUTIONAL_SEPARATION_OF_DUTIES: Super Admin (CLASS_00) is barred from operational finance disbursements and voucher mutations.",
      });
    } else if (activeClass === "CLASS_06") {
      if (disburseAmount > 10000) {
        setMutationResult({
          status: "ESCALATED",
          message: `HTTP 202 Escalated — Amount ${disburseAmount} BDT exceeds Finance Officer single limit (10,000 BDT). Escalated to Unit Head for approval ticket.`,
        });
      } else {
        setMutationResult({
          status: "SUCCESS",
          message: `HTTP 200 OK — Disbursed ${disburseAmount} BDT successfully under voucher VCH-2026-00483.`,
        });
      }
    } else {
      setMutationResult({
        status: "BLOCKED",
        message: `HTTP 403 Forbidden — User Class ${activeClass} lacks operational disbursement permission.`,
      });
    }
  };

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
            ? `অর্থ নিয়ন্ত্রণ কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৬ (অর্থ বিশেষজ্ঞ) এবং ক্লাস ০৩ (বিভাগীয় প্রধান) এর জন্য সংরক্ষিত।`
            : `The Finance Control Center is not accessible for ${activeClass}. Permitted User Classes: CLASS_06 (Finance Specialist) and CLASS_03 (Unit Head).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 04</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Bank width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "অর্থ নিয়ন্ত্রণ কেন্দ্র (Finance Control)" : "Finance Control Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "হিসাব চার্ট, দ্বৈত-প্রবেশ ভাউচার, ব্যাংক সমন্বয় এবং বিশেষায়িত অনুদান ও স্থায়ী সমাজকল্যাণ তহবিল খতিয়ান।"
              : "Chart of accounts, double-entry vouchers, bank reconciliation, restricted fund ledgers (Donations, Endowments)."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          {isSuperAdminBlocked && (
            <span className="text-xs font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded font-bold">
              MUTATIONS BLOCKED
            </span>
          )}
        </div>
      </div>

      {/* Constitutional Invariant Notice */}
      {isSuperAdminBlocked && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <WarningTriangle width={18} height={18} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>
              {lang === "bn"
                ? "সাংবিধানিক দায়িত্ব পৃথকীকরণ নিয়ম (STFL VI সংবিধান):"
                : "Constitutional Separation of Duties Invariant (STFL VI):"}
            </strong>{" "}
            {lang === "bn"
              ? "সুপার অ্যাডমিন (CLASS_00) কেবল অর্থ কনসোলের তথ্য নিরীক্ষা (Oversight) করতে পারবেন। কোনো আর্থিক বিতরণ (Payment Disburse) বা খতিয়ান পরিবর্তন করার চেষ্টা সার্ভার-সাইড নীতি মিডলওয়্যার দ্বারা সরাসরি অবরুদ্ধ।"
              : "Super Admin (CLASS_00) has read/oversight access only. Any operational payment disbursement or ledger mutation is physically blocked by server-side policy middleware."}
          </div>
        </div>
      )}

      {/* Interactive Separation of Duties Test Simulator */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#081F2D] flex items-center gap-2">
          <ShieldCheck width={18} height={18} className="text-[#FF6B35]" />
          {lang === "bn"
            ? "অপারেশনাল রূপান্তর ও দায়িত্ব পৃথকীকরণ পরীক্ষক (Live Authorization Test)"
            : "Operational Mutation & Separation of Duties Simulator"}
        </h2>
        <p className="text-xs text-stone-600">
          {lang === "bn"
            ? "সক্রিয় ভূমিকা ব্যবহার করে অর্থ বিতরণ সম্পাদন করার চেষ্টা করুন এবং সার্ভার-সাইড যাচাইকরণ পর্যবেক্ষণ করুন:"
            : "Attempt an operational payment disbursement using the active role and observe server-side authorization enforcement:"}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <div className="flex items-center gap-2 bg-[#FAFAF8] border border-[#E7E7E2] px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="text-stone-500">Amount:</span>
            <input
              type="number"
              value={disburseAmount}
              onChange={(e) => setDisburseAmount(Number(e.target.value))}
              className="w-24 bg-white border border-stone-300 rounded px-2 py-0.5 text-[#081F2D] font-bold"
            />
            <span className="text-stone-500 font-bold">BDT</span>
          </div>

          <button
            onClick={handleTestDisbursement}
            className="px-4 py-2 bg-[#0B2B43] hover:bg-[#081F2D] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>
              {lang === "bn"
                ? `বিতরণ সম্পাদন পরীক্ষা (${activeClass})`
                : `Test Disburse Action (${activeClass})`}
            </span>
          </button>
        </div>

        {mutationResult.status !== "IDLE" && (
          <div
            className={`p-4 rounded-lg text-xs font-mono leading-relaxed border ${
              mutationResult.status === "SUCCESS"
                ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                : mutationResult.status === "ESCALATED"
                ? "bg-blue-50 text-blue-900 border-blue-300"
                : "bg-rose-50 text-rose-900 border-rose-300"
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {mutationResult.status === "SUCCESS" && <Check width={14} height={14} className="text-emerald-600" />}
              {mutationResult.status === "ESCALATED" && <InfoCircle width={14} height={14} className="text-blue-600" />}
              {mutationResult.status === "BLOCKED" && <Lock width={14} height={14} className="text-rose-600" />}
              RESULT: {mutationResult.status}
            </div>
            <div>{mutationResult.message}</div>
          </div>
        )}
      </div>

      {/* Chart of Accounts & Restricted Fund Ledgers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-[#081F2D] uppercase tracking-wider font-mono">
            {lang === "bn" ? "ব্যাংক ও নগদ ব্যালেন্স" : "Bank & Cash Accounts"}
          </h3>
          <div className="divide-y divide-[#E7E7E2] text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-600">Islami Bank Principal Operating</span>
              <span className="font-mono font-bold text-[#081F2D]">14,500,000.00 BDT</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-600">Al-Arafah Humanitarian Fund</span>
              <span className="font-mono font-bold text-[#081F2D]">6,850,000.00 BDT</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-600">Cash in Vault (Dhaka HQ)</span>
              <span className="font-mono font-bold text-[#081F2D]">450,000.00 BDT</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E7E2] p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-[#081F2D] uppercase tracking-wider font-mono">
            {lang === "bn" ? "সীমাবদ্ধ তহবিল খতিয়ান (Restricted Funds)" : "Restricted Fund Ledgers"}
          </h3>
          <div className="divide-y divide-[#E7E7E2] text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-600">Humanitarian Relief Ledger</span>
              <span className="font-mono font-bold text-purple-700">3,200,000.00 BDT</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-600">Endowment Maintenance Ledger</span>
              <span className="font-mono font-bold text-purple-700">1,850,000.00 BDT</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-stone-600">Zero-Interest Microfinance Pool</span>
              <span className="font-mono font-bold text-purple-700">5,000,000.00 BDT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
