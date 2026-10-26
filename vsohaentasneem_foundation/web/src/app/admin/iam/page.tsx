"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  User,
  ShieldCheck,
  Lock,
  Key,
  Group,
  Phone,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Refresh,
} from "iconoir-react";

export default function IamConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("iam");

  const [activeTab, setActiveTab] = useState<"parties" | "users" | "scopes" | "policies">("parties");

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
            ? `পরিচয় ও প্রবেশাধিকার কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি শুধুমাত্র ক্লাস ০০ (সুপার অ্যাডমিন) এবং ক্লাস ০৭ (নিরাপত্তা কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Identity & Access Center is not accessible for ${activeClass}. Permitted User Classes: CLASS_00 (Super Admin) and CLASS_07 (Security Officer).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 01</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <User width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "পরিচয় ও প্রবেশাধিকার কেন্দ্র (IAM)" : "Identity & Access Center (IAM)"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "পার্টি, ব্যবহারকারী, পরিচয়পত্র, ভূমিকা, পরিধি এবং প্রতিনিধি ব্যবস্থাপনা।"
              : "Universal management of Parties, Users, Credentials, Roles, Scopes, and Delegations."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            POSTGRESQL 16 AUTHORITATIVE
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E7E7E2] gap-6 text-xs font-medium">
        {[
          { id: "parties", labelBn: "পার্টি ডিরেক্টরি", labelEn: "Parties Directory" },
          { id: "users", labelBn: "ব্যবহারকারী অ্যাকাউন্ট", labelEn: "User Accounts" },
          { id: "scopes", labelBn: "অপারেশনাল পরিধি (Scopes)", labelEn: "Operational Scopes" },
          { id: "policies", labelBn: "প্রবেশাধিকার নীতি", labelEn: "Access Policies" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 font-semibold transition-colors relative ${
              activeTab === tab.id ? "text-[#0B2B43] border-b-2 border-[#FF6B35]" : "text-stone-500 hover:text-[#081F2D]"
            }`}
          >
            {lang === "bn" ? tab.labelBn : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "parties" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#081F2D]">
              {lang === "bn" ? "নিবন্ধিত পার্টি ও সত্তা তালিকা" : "Registered Parties & Legal Entities"}
            </h2>
            <span className="text-xs text-stone-500 font-mono">Table: parties</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-stone-500 font-mono uppercase text-[10px] border-y border-[#E7E7E2]">
                <tr>
                  <th className="py-2.5 px-3">Party ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Legal Name (BN)</th>
                  <th className="py-2.5 px-3">Legal Name (EN)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E2]">
                {[
                  { id: "STFL-PER-000001", type: "PERSON", nameBn: "সোহেল তাসনীম", nameEn: "Sohael Tasneem", status: "ACTIVE" },
                  { id: "STFL-ORG-000001", type: "TRUST", nameBn: "সোহেল তাসনীম ফাউন্ডেশন ট্রাস্ট", nameEn: "SohaelTasneem Foundation Trust", status: "ACTIVE" },
                  { id: "STFL-PER-000042", type: "PERSON", nameBn: "আব্দুল করিম", nameEn: "Abdul Karim", status: "ACTIVE" },
                  { id: "STFL-COM-000014", type: "COMPANY", nameBn: "মেঘনা ট্রেডিং কর্পোরেশন", nameEn: "Meghna Trading Corp", status: "ACTIVE" },
                ].map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/60">
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0B2B43]">{p.id}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{p.type}</td>
                    <td className="py-2.5 px-3 font-medium">{p.nameBn}</td>
                    <td className="py-2.5 px-3 text-stone-600">{p.nameEn}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#081F2D]">
              {lang === "bn" ? "সিস্টেম ব্যবহারকারী ও পরিচয়পত্র" : "System Users & Argon2id Credentials"}
            </h2>
            <span className="text-xs text-stone-500 font-mono">Table: users</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAFAF8] text-stone-500 font-mono uppercase text-[10px] border-y border-[#E7E7E2]">
                <tr>
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Assigned Class</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">MFA State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E2]">
                {[
                  { id: "USR-0001", email: "admin@stfl.org", cls: "CLASS_00", role: "SUPER_ADMIN", mfa: "ENFORCED" },
                  { id: "USR-0002", email: "trustee1@stfl.org", cls: "CLASS_01", role: "TRUSTEE", mfa: "ENFORCED" },
                  { id: "USR-0003", email: "finance@stfl.org", cls: "CLASS_06", role: "FINANCE_SPECIALIST", mfa: "ENFORCED" },
                  { id: "USR-0004", email: "sec_officer@stfl.org", cls: "CLASS_07", role: "SECURITY_OFFICER", mfa: "ENFORCED" },
                ].map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/60">
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0B2B43]">{u.id}</td>
                    <td className="py-2.5 px-3 font-mono">{u.email}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-700">{u.cls}</td>
                    <td className="py-2.5 px-3 font-mono text-stone-600">{u.role}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                        {u.mfa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "scopes" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#081F2D]">
              {lang === "bn" ? "প্রথম-শ্রেণির অপারেশনাল পরিধি (First-Class IAM Scopes)" : "First-Class Operational Scopes"}
            </h2>
            <span className="text-xs text-stone-500 font-mono">Table: iam_scopes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { code: "SCP-GLOBAL-ALL", type: "GLOBAL", nameBn: "সার্বিক প্রতিষ্ঠান পরিধি", desc: "Covers all organizational units and regions" },
              { code: "SCP-REG-DHK-01", type: "REGION", nameBn: "ঢাকা উত্তর অঞ্চল পরিধি", desc: "Covers Mirpur, Uttara, and Keraniganj" },
              { code: "SCP-PRP-DHK-0001", type: "PROPERTY", nameBn: "সোহেল ম্যানশন পরিধি", desc: "Restricted exclusively to property STFL-PRP-DHK-0001" },
              { code: "SCP-UNIT-FIN-01", type: "UNIT", nameBn: "অর্থ বিভাগ পরিধি", desc: "Restricted to Finance operational ledgers" },
            ].map((s) => (
              <div key={s.code} className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0B2B43]">{s.code}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">{s.type}</span>
                </div>
                <div className="text-xs font-semibold text-[#081F2D]">{s.nameBn}</div>
                <div className="text-[11px] text-stone-500">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "policies" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#081F2D]">
              {lang === "bn" ? "কনসোল প্রবেশাধিকার নীতি ম্যাট্রিক্স" : "Console Access Policy Matrix"}
            </h2>
            <span className="text-xs text-stone-500 font-mono">Table: iam_console_policies</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {lang === "bn"
              ? "১৬টি পরিচালিত কনসোলের নীতিসমূহ পোস্টগ্রেসকিউএল ডেটাবেসে সংরক্ষিত এবং সার্ভার-সাইড হনো মিডলওয়্যারের মাধ্যমে কঠোরভাবে প্রয়োগ করা হয়। ক্লায়েন্ট-সাইড কোনো সিদ্ধান্ত অনুমোদিত নয়।"
              : "Access matrix policies are materialized in PostgreSQL 16 and evaluated dynamically by Hono middleware. Zero client-side trust is permitted."}
          </p>
        </div>
      )}
    </div>
  );
}
