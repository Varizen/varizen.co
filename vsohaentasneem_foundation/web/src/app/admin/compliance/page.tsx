"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  InfoCircle,
  Clock,
  Eye,
  Refresh,
  Page,
  BookStack
} from "iconoir-react";

interface ComplianceDomain {
  id: string;
  nameEn: string;
  nameBn: string;
  statute: string;
  status: "CLEARED" | "ADVISORY" | "HOLD" | "IN_REVIEW";
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "STANDARD";
  lastAudit: string;
  requiresDualControl: boolean;
}

const DOMAINS: ComplianceDomain[] = [
  { id: "DOM-01", nameEn: "Statutory Trust & Property Administration", nameBn: "বিধিবদ্ধ ট্রাস্ট ও স্থায়ী সম্পত্তি প্রশাসন", statute: "Trust Act 1882 & Property Rules", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-02", nameEn: "Microfinance Regulatory Standards", nameBn: "ক্ষুদ্রঋণ নিয়ন্ত্রক মানদণ্ড (এমআরএ)", statute: "Microcredit Regulatory Authority Act 2006", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-14", requiresDualControl: true },
  { id: "DOM-03", nameEn: "Labour & Workforce Safety", nameBn: "শ্রম আইন ও কর্মক্ষেত্র নিরাপত্তা", statute: "Bangladesh Labour Act 2006 (Amended 2018)", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-15", requiresDualControl: false },
  { id: "DOM-04", nameEn: "National Building & Tenancy Code", nameBn: "ভবন ও ইজারা স্থায়িত্ব কোড (বিএনবিসি)", statute: "Bangladesh National Building Code (BNBC)", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-12", requiresDualControl: false },
  { id: "DOM-05", nameEn: "Direct Taxation & Withholding", nameBn: "প্রত্যক্ষ কর ও উৎসে কর কর্তন (এনবিআর)", statute: "Income Tax Act 2023", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-06", nameEn: "Non-Profit Corporate Governance", nameBn: "অলাভজনক সংস্থা ও ট্রাস্ট গভর্ন্যান্স", statute: "Societies Registration Act 1860 / Trust Act 1882", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-10", requiresDualControl: true },
  { id: "DOM-07", nameEn: "Foreign Donations Regulation", nameBn: "বৈদেশিক অনুদান নিয়ন্ত্রণ (এফডি-৭ / এনজিওএবি)", statute: "Foreign Donations (Voluntary Activities) Act 2016", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-08", nameEn: "Anti-Money Laundering & CFT", nameBn: "মানি লন্ডারিং ও সন্ত্রাসী অর্থায়ন প্রতিরোধ", statute: "Money Laundering Prevention Act 2012", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-09", nameEn: "Cyber Security & Digital Trust", nameBn: "সাইবার নিরাপত্তা ও ডেটা বিশ্বাসযোগ্যতা", statute: "Cyber Security Act 2023", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-15", requiresDualControl: false },
  { id: "DOM-10", nameEn: "Digital Signature Cryptography", nameBn: "ডিজিটাল স্বাক্ষর ও ক্রিপ্টোগ্রাফি মান", statute: "Information & Communication Technology Act 2006", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-15", requiresDualControl: false },
  { id: "DOM-11", nameEn: "Child Protection & Universal Safeguarding", nameBn: "শিশু সুরক্ষা ও সর্বজনীন সেইফগার্ডিং", statute: "Children Act 2013 & STFL Safeguarding Charter", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-12", nameEn: "Environmental Conservation", nameBn: "পরিবেশ সংরক্ষণ ও টেকসই অবকাঠামো", statute: "Bangladesh Environment Conservation Act 1995", status: "ADVISORY", riskLevel: "MEDIUM", lastAudit: "2026-10-08", requiresDualControl: false },
  { id: "DOM-13", nameEn: "Public Procurement Integrity", nameBn: "পণ্য ও সেবা ক্রয় স্বচ্ছতা (পিপিআর)", statute: "Public Procurement Act 2006 & PPR 2008", status: "CLEARED", riskLevel: "MEDIUM", lastAudit: "2026-10-11", requiresDualControl: false },
  { id: "DOM-14", nameEn: "Right to Information Compliance", nameBn: "তথ্য অধিকার আইন পরিপালন", statute: "Right to Information Act 2009", status: "CLEARED", riskLevel: "STANDARD", lastAudit: "2026-10-09", requiresDualControl: false },
  { id: "DOM-15", nameEn: "Disaster Emergency Management", nameBn: "দুর্যোগ ব্যবস্থাপনা ও জরুরি লজিস্টিকস", statute: "Disaster Management Act 2012", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-14", requiresDualControl: false },
  { id: "DOM-16", nameEn: "Clinical Safety & Drug Protocols", nameBn: "ক্লিনিক্যাল নিরাপত্তা ও ফার্মেসি প্রটোকল", statute: "Drugs Act 1940 & Medical Practice Ordinance", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-13", requiresDualControl: false },
  { id: "DOM-17", nameEn: "Consumer Rights in Impact E-Shop", nameBn: "ই-কমার্স ভোক্তা অধিকার সংরক্ষণ", statute: "Consumer Rights Protection Act 2009", status: "CLEARED", riskLevel: "STANDARD", lastAudit: "2026-10-12", requiresDualControl: false },
  { id: "DOM-18", nameEn: "Zero-Interest Microfinance & Ethical Lending", nameBn: "বিনা-সুদে ক্ষুদ্রঋণ ও কল্যাণ নীতিমালা", statute: "Ethical Microfinance Governance Standards", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-19", nameEn: "Copyright, Marks & Brand Assets", nameBn: "কপিরাইট, ট্রেডমার্ক ও বুদ্ধিবৃত্তিক সম্পদ", statute: "Copyright Act 2000 & Trademarks Act 2009", status: "CLEARED", riskLevel: "STANDARD", lastAudit: "2026-10-10", requiresDualControl: false },
  { id: "DOM-20", nameEn: "Institutional Grant Restrictions", nameBn: "প্রাতিষ্ঠানিক অনুদান ও চুক্তির শর্তাবলী", statute: "Specific Project Grant Bilateral Accords", status: "CLEARED", riskLevel: "HIGH", lastAudit: "2026-10-15", requiresDualControl: true },
  { id: "DOM-21", nameEn: "Property Tenure & Boundary Registry", nameBn: "সম্পত্তি স্বত্ব ও সীমানা নিবন্ধন যাচাই", statute: "Transfer of Property Act 1882 & Registration Act", status: "CLEARED", riskLevel: "CRITICAL", lastAudit: "2026-10-15", requiresDualControl: true },
];

export default function ComplianceConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("compliance");
  const [filter, setFilter] = useState<string>("ALL");

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
            ? `আইন ও কমপ্লায়েন্স নিয়ন্ত্রণ কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৭ (নিরাপত্তা ও নিরীক্ষা কর্মকর্তা) এবং ক্লাস ০২ (নির্বাহী নেতৃত্ব) এর জন্য সংরক্ষিত।`
            : `The Compliance & Legal Intelligence Console is not accessible for ${activeClass}. Permitted User Classes: CLASS_07 (Audit/Security Officers) and CLASS_02 (Executive Command).`}
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

  const filteredDomains = filter === "ALL" 
    ? DOMAINS 
    : DOMAINS.filter(d => d.riskLevel === filter || d.status === filter);

  return (
    <div className="space-y-6">
      {/* Console Header */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-xs text-stone-500 hover:text-[#0B2B43] flex items-center gap-1">
              <NavArrowLeft width={12} height={12} />
              {lang === "bn" ? "কনসোল তালিকা" : "Consoles"}
            </Link>
            <span className="text-xs text-stone-300">•</span>
            <span className="text-xs font-mono text-stone-400">CONSOLE 17</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <ShieldAlert width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "আইন ও কমপ্লায়েন্স নিয়ন্ত্রণ কেন্দ্র" : "Compliance & Legal Intelligence Console"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "২১টি সংবিধিবদ্ধ আইনি ক্ষেত্র, স্বয়ংক্রিয় সম্মতি মূল্যায়ন, আইনি পর্যালোচনা ও নিয়ন্ত্রণমূলক পরিবর্তন ট্র্যাকিং।"
              : "21 universal statutory compliance domains, automated evaluations, legal holds, and regulatory change monitoring."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            21/21 DOMAINS ACTIVE
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Total Domains</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">21</div>
          <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <Check width={12} height={12} /> 100% Statutorily Mapped
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Cleared & Compliant</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">20</div>
          <div className="text-xs text-stone-500 mt-1">Zero Statutory Violations</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Advisory Warnings</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">1</div>
          <div className="text-xs text-stone-500 mt-1">DOM-12 Environment Advisory</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-stone-200">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-mono">Active Legal Holds</div>
          <div className="text-2xl font-bold text-stone-900 mt-1">0</div>
          <div className="text-xs text-emerald-600 mt-1">Zero Blocked Disbursements</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["ALL", "CRITICAL", "HIGH", "MEDIUM", "ADVISORY"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              filter === f 
                ? "bg-[#081F2D] text-white" 
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Statutory Domains Table */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#E7E7E2] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#081F2D] flex items-center gap-2">
            <ShieldCheck width={16} height={16} className="text-[#FF6B35]" />
            {lang === "bn" ? "সংবিধিবদ্ধ আইনি ক্ষেত্রসমূহ" : "Statutory Compliance Registry"}
          </h2>
          <span className="text-xs font-mono text-stone-500">Showing {filteredDomains.length} of 21</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono">
                <th className="py-3 px-4">DOMAIN ID</th>
                <th className="py-3 px-4">DOMAIN / BENGALI TITLE</th>
                <th className="py-3 px-4">GOVERNING STATUTE</th>
                <th className="py-3 px-4">RISK</th>
                <th className="py-3 px-4">OUTCOME</th>
                <th className="py-3 px-4">DUAL CONTROL</th>
                <th className="py-3 px-4 text-right">AUDITED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredDomains.map(d => (
                <tr key={d.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B2B43]">{d.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900">{d.nameEn}</div>
                    <div className="font-hind text-stone-500 text-xs mt-0.5">{d.nameBn}</div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 max-w-xs">{d.statute}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      d.riskLevel === "CRITICAL" ? "bg-rose-100 text-rose-800" :
                      d.riskLevel === "HIGH" ? "bg-orange-100 text-orange-800" :
                      d.riskLevel === "MEDIUM" ? "bg-amber-100 text-amber-800" :
                      "bg-stone-100 text-stone-700"
                    }`}>
                      {d.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      d.status === "CLEARED" ? "bg-emerald-100 text-emerald-800" :
                      d.status === "ADVISORY" ? "bg-amber-100 text-amber-800" :
                      "bg-rose-100 text-rose-800"
                    }`}>
                      {d.status === "CLEARED" && <Check width={10} height={10} />}
                      {d.status === "ADVISORY" && <WarningTriangle width={10} height={10} />}
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">
                    {d.requiresDualControl ? "MANDATORY" : "STANDARD"}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-500">{d.lastAudit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
