"use client";

import React from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  ShoppingBag,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
} from "iconoir-react";

export default function EshopConsolePage() {
  const { activeClass, lang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("eshop");

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
            ? `ই-কমার্স অপারেশনস কনসোল (${activeClass}) এর জন্য অনুমোদিত নয়। এই কনসোলটি ক্লাস ০৩ (ই-কমার্স প্রধান) এবং ক্লাস ০৪ (গুদাম সুপারভাইজার) এর জন্য সংরক্ষিত।`
            : `The E-Commerce Operations Console is not accessible for ${activeClass}. Permitted User Classes: CLASS_03 and CLASS_04.`}
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
            <span className="text-xs font-mono text-stone-400">CONSOLE 08</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#081F2D] flex items-center gap-2.5">
            <ShoppingBag width={22} height={22} className="text-[#0B2B43]" />
            {lang === "bn" ? "ই-কমার্স অপারেশনস কনসোল" : "E-Commerce Operations Console"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {lang === "bn"
              ? "হস্তশিল্প ও কারিগর ক্যাটালগ, গুদাম এসকেইউ ব্যালেন্স, স্বয়ংক্রিয় ক্রয় আদেশ এবং গ্রাহক ডেলিভারি ট্র্যাকিং।"
              : "Craft & artisan catalog, warehouse SKU balances, automated purchase orders, order dispatch routing."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded font-bold">
            {access} ACCESS
          </span>
          <span className="text-xs font-mono text-stone-500 bg-[#FAFAF8] border border-[#E7E7E2] px-2.5 py-1 rounded">
            ARTISAN WELFARE
          </span>
        </div>
      </div>

      {/* Catalog & Inventory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Artisan Partners</span>
          <span className="text-2xl font-bold text-[#081F2D] mt-1 block">28 Artisans</span>
          <span className="text-xs text-emerald-700 font-medium">Direct Fair-Trade</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Active SKUs</span>
          <span className="text-2xl font-bold text-[#081F2D] mt-1 block">85 Products</span>
          <span className="text-xs text-stone-500">Dhaka Central Warehouse</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
          <span className="text-xs font-mono text-stone-500 block">Orders Dispatched Today</span>
          <span className="text-2xl font-bold text-blue-700 mt-1 block">9 Dispatched</span>
          <span className="text-xs text-stone-500">14 Pending Packing</span>
        </div>
      </div>
    </div>
  );
}
