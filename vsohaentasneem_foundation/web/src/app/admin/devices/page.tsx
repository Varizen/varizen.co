"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Phone,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  ShieldCheck,
} from "iconoir-react";

export default function DevicesConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("devices");

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
            ? `মোবাইল ডিভাইস ব্যবস্থাপনা কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৭ (নিরাপত্তা কর্মকর্তা) এর জন্য সংরক্ষিত।`
            : `The Device Management Center is not accessible for ${activeClass}. Permitted User Class: CLASS_07 (Security Officers).`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 15</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <Phone width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "মোবাইল ডিভাইস ব্যবস্থাপনা কেন্দ্র" : "Device Management Center"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "ফিল্ড ডিভাইস বাইন্ডিং অনুরোধ, কীস্টোর এনক্লেভ অ্যাটেস্টেশন স্ট্যাটাস এবং আপসকৃত ডিভাইস ব্ল্যাকলিস্টিং।"
              : "Mobile hardware binding requests, KeyStore attestation state, compromised device blacklisting."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            HARDWARE KEYSTORE ENFORCED
          </span>
        </div>
      </div>

      {/* Registered Devices Table */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[#081F2D]">
          {lang === "bn" ? "নিবন্ধিত ফিল্ড ও অ্যাডমিন ডিভাইসসমূহ" : "Registered Field & Management Devices"}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] text-stone-500 font-mono uppercase text-[10px] border-y border-[#E7E7E2]">
              <tr>
                <th className="py-2.5 px-3">Device ID</th>
                <th className="py-2.5 px-3">Model</th>
                <th className="py-2.5 px-3">OS</th>
                <th className="py-2.5 px-3">KeyStore Enclave</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E7E2]">
              {[
                { id: "stfl-dev-hardware-01", model: "Pixel 9 Pro", os: "Android 15 (API 35)", enclave: "TEE / StrongBox Backed", status: "ACTIVE" },
                { id: "stfl-dev-hardware-02", model: "Samsung Galaxy S25", os: "Android 15 (API 35)", enclave: "Knox TEE Backed", status: "ACTIVE" },
                { id: "stfl-dev-fld-0089", model: "Redmi Note 13", os: "Android 14 (API 34)", enclave: "Hardware KeyStore Backed", status: "ACTIVE" },
                { id: "stfl-dev-sus-0012", model: "Unknown Android", os: "Android 12 (API 31)", enclave: "Software Fallback (REVOKED)", status: "REVOKED" },
              ].map((d) => (
                <tr key={d.id} className="hover:bg-stone-50/60">
                  <td className="py-2.5 px-3 font-mono font-semibold text-[#0B2B43]">{d.id}</td>
                  <td className="py-2.5 px-3 font-medium">{d.model}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">{d.os}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">{d.enclave}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      d.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
