"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ShieldCheck,
  Globe,
  ArrowRight,
  NavArrowRight,
  CheckCircle,
  Page,
  Building,
  Key,
  Calendar,
  Lock,
  Download,
  Eye,
  RefreshDouble,
  Pin,
  MapPin,
  User,
  Settings,
  Spark
} from "iconoir-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { getInitiativeBySlug } from "@/src/lib/initiativesRegistry";
import { VERIFY_ORIGIN } from "@/src/lib/domains";

export default function GrihostiOSProjectPage() {
  const { lang, setLang } = useLanguage();
  const isBn = lang === "bn";
  const project = getInitiativeBySlug("grihostios");

  // Interactive Agreement Simulator State
  const [activeTab, setActiveTab] = useState<"RESIDENTIAL" | "AGRARIAN" | "COMMERCIAL" | "GREENFIELD">("RESIDENTIAL");
  const [workflowStep, setWorkflowStep] = useState<number>(2); // 1: SELECT, 2: FILL, 3: CHECK, 4: SIGN, 5: RECEIVE, 6: VERIFY

  // Sample Simulator Facts
  const [simLandlord, setSimLandlord] = useState("SohaelTasneem Foundation (STFL House)");
  const [simParty, setSimParty] = useState(isBn ? "মো. করিম উল্লাহ (জাতীয় পরিচয়পত্র: ১৯৮২...)" : "Md. Karim Ullah (NID: 1982...)");
  const [simScope, setSimScope] = useState(isBn ? "কক্ষ ০১ (STFL House ১ম তলা, উলান রোড, ঢাকা)" : "Room 01 (STFL House 1st Floor, Dhaka)");
  const [simRent, setSimRent] = useState("৳ 6,500 / month");
  const [simDeposit, setSimDeposit] = useState("৳ 13,000 (2 Months)");

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      {/* Project Native Identity Header */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E7E2]" aria-label="GrihostiOS Navigation">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Native Project Mark & STFL Relationship Badge */}
            <div className="flex items-center gap-3">
              <Link href="/initiatives" className="text-stone-400 hover:text-[#081F2D] transition-colors p-1" title="Back to Initiatives">
                <NavArrowRight width={16} height={16} className="rotate-180" />
              </Link>
              <div className="h-4 w-px bg-stone-200" />
              <div className="flex items-center gap-2.5">
                <Image
                  src="/media/grihostios-logo.svg"
                  alt="GrihostiOS Emblem"
                  width={34}
                  height={34}
                  className="h-8 w-auto object-contain"
                />
                <div>
                  <span className="font-bold text-[#14532D] text-base tracking-tight leading-none block">
                    GrihostiOS <span className="text-xs font-mono font-normal text-stone-500">গৃহস্থী ওএস</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#081F2D]/60 flex items-center gap-1">
                    <ShieldCheck width={10} height={10} className="text-[#16A34A]" />
                    <span>{isBn ? "সোহেল তাসনীম ফাউন্ডেশনের একটি প্রকল্প" : "A Project of SohaelTasneem Foundation"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Anchors */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
              <a href="#simulator" className="hidden md:inline-block text-[#5A6B75] hover:text-[#14532D] transition-colors">
                {isBn ? "চুক্তি সিমুলেটর" : "Agreement Simulator"}
              </a>
              <a href="#agrarian" className="hidden lg:inline-block text-[#5A6B75] hover:text-[#14532D] transition-colors">
                {isBn ? "কৃষি ও বর্গা মডেল" : "Agrarian Barga Model"}
              </a>
              <a href="#verification" className="hidden sm:inline-block text-[#5A6B75] hover:text-[#14532D] transition-colors">
                {isBn ? "ডকুমেন্ট সুরক্ষা" : "Verification"}
              </a>

              {/* Language Switcher */}
              <div className="flex items-center bg-[#FAFAF8] border border-[#E7E7E2] p-0.5 text-[11px]">
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-0.5 ${lang === "en" ? "bg-[#14532D] text-white font-bold" : "text-stone-500 hover:text-black"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("bn")}
                  className={`px-2 py-0.5 ${lang === "bn" ? "bg-[#14532D] text-white font-bold" : "text-stone-500 hover:text-black"}`}
                >
                  বাংলা
                </button>
              </div>

              <Link
                href="/admin"
                className="px-3 py-1.5 bg-[#14532D] text-white font-semibold hover:bg-[#0f3d21] transition shadow-xs"
              >
                {isBn ? "কন্ট্রোল হাব" : "VI Console"}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section: The Living Operating System */}
      <section className="relative bg-white border-b border-[#E7E7E2] py-16 lg:py-24 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#F0FDF4] border border-[#BBF7D0] text-[#14532D] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span>PILOT STAGE • BANGLADESH JURISDICTION • STFL CONTROLLED</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#081F2D] leading-[1.15]">
                {isBn ? (
                  <>
                    সম্পত্তি, জমি, লিজ ও গ্রামীণ কৃষি অর্থনীতির{" "}
                    <span className="text-[#16A34A]">নিয়ন্ত্রিত অপারেটিং সিস্টেম</span>
                  </>
                ) : (
                  <>
                    The Governed Operating System for{" "}
                    <span className="text-[#16A34A]">Property, Land, Leases & Agrarian Economics</span>
                  </>
                )}
              </h1>

              <p className="font-hind text-base sm:text-lg text-[#5A6B75] leading-relaxed">
                {isBn
                  ? "গৃহস্থী ওএস কেবলমাত্র একটি সাধারণ বাড়িভাড়া সফটওয়্যার নয়। এটি নগর আবাসন, বাণিজ্যিক দোকান এবং গ্রামীণ খতিয়ান-দাগভিত্তিক কৃষিজমির বর্গা/আধি চুক্তিকে একই সুদৃঢ় প্রাতিষ্ঠানিক ও আইনি শৃঙ্খলায় সংযুক্ত করে। যেখানে মৌখিক অনিরাপত্তার বদলে প্রতিষ্ঠিত হয় ক্রিপ্টোগ্রাফিক স্বচ্ছতা।"
                  : "GrihostiOS is far broader than generic property management software. It connects land parcels, multi-tenant buildings, statutory tenancy agreements, utility billing, seasonal crop-share models (Barga/Adhi), and cryptographically verified receipts into a single governed economic workflow."}
              </p>

              {/* Scope Sequence Strip */}
              <div className="p-4 bg-[#FAFAF8] border border-[#E7E7E2] text-xs font-mono text-[#081F2D] space-y-2">
                <div className="text-[10px] uppercase font-bold text-[#16A34A] tracking-wider">
                  {isBn ? "সমন্বিত অপারেশনাল চেইন" : "THE GRIHOSTIOS OPERATIONAL CHAIN"}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 leading-relaxed text-stone-700">
                  <span className="font-semibold text-[#14532D]">{isBn ? "জমি" : "LAND"}</span>
                  <span>→</span>
                  <span>{isBn ? "স্থাপনা" : "PROPERTY"}</span>
                  <span>→</span>
                  <span>{isBn ? "চুক্তি" : "AGREEMENT"}</span>
                  <span>→</span>
                  <span>{isBn ? "ভোগদখল" : "OCCUPANCY"}</span>
                  <span>→</span>
                  <span>{isBn ? "অর্থায়ন" : "MONEY"}</span>
                  <span>→</span>
                  <span>{isBn ? "অপারেশন" : "OPERATIONS"}</span>
                  <span>→</span>
                  <span className="font-semibold text-[#16A34A]">{isBn ? "কৃষি উৎপাদন" : "AGRICULTURE"}</span>
                  <span>→</span>
                  <span>{isBn ? "ফসল বণ্টন" : "REVENUE"}</span>
                  <span>→</span>
                  <span>{isBn ? "রসিদ" : "SETTLEMENT"}</span>
                  <span>→</span>
                  <span className="font-bold text-[#081F2D]">{isBn ? "ক্রিপ্টো যাচাই" : "VERIFICATION"}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#simulator"
                  className="px-5 py-3 bg-[#14532D] text-white text-xs font-mono font-bold hover:bg-[#0f3d21] transition shadow-xs flex items-center gap-2"
                >
                  <span>{isBn ? "চুক্তি সিমুলেটর চালু করুন" : "Open Agreement Simulator"}</span>
                  <ArrowRight width={14} height={14} />
                </a>
                <Link
                  href={`${VERIFY_ORIGIN}/verify`}
                  className="px-5 py-3 bg-white text-[#081F2D] border border-[#E7E7E2] hover:border-[#081F2D] text-xs font-mono font-bold transition flex items-center gap-2"
                >
                  <ShieldCheck width={14} height={14} className="text-[#16A34A]" />
                  <span>{isBn ? "পাবলিক যাচাইকরণ ট্রাই করুন" : "Verify a Document"}</span>
                </Link>
              </div>
            </div>

            {/* Right Card: Real-time Property & Ag Operational Telemetry */}
            <div className="lg:col-span-5">
              <div className="bg-[#081F2D] text-white p-6 sm:p-8 border border-[#0B2B43] shadow-xl relative">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Building width={16} height={16} className="text-[#16A34A]" />
                    <span className="font-bold text-white">STFL HOUSE (CANONICAL)</span>
                  </div>
                  <span className="bg-[#16A34A]/20 text-[#16A34A] px-2 py-0.5 border border-[#16A34A]/30">
                    ACTIVE UNITS
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="p-3 bg-white/5 border border-white/10 space-y-1">
                    <div className="text-stone-400 text-[10px]">{isBn ? "ভৌত অবকাঠামো" : "PHYSICAL SCOPE"}</div>
                    <div className="text-sm font-bold text-white">173 E Ullan Road, W Rampura, Dhaka 1217</div>
                    <div className="text-stone-400 text-[11px]">8 Residential Rooms • Ground Floor Staging • Rooftop Agri</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 border border-white/10">
                      <div className="text-stone-400 text-[10px]">{isBn ? "জামানত হিসাব" : "SECURITY DEPOSIT"}</div>
                      <div className="text-sm font-bold text-[#16A34A]">100% ESCROW</div>
                      <div className="text-[10px] text-stone-400">{isBn ? "ব্যবসায়ী আয়ে স্থানান্তর নিষিদ্ধ" : "Balance Sheet Liability"}</div>
                    </div>
                    <div className="p-3 bg-white/5 border border-white/10">
                      <div className="text-stone-400 text-[10px]">{isBn ? "চুক্তি কার্যপ্রণালী" : "WORKFLOW"}</div>
                      <div className="text-sm font-bold text-white">6-STAGE GOVERNED</div>
                      <div className="text-[10px] text-stone-400">SELECT → VERIFY</div>
                    </div>
                  </div>

                  <div className="p-3 bg-[#14532D]/40 border border-[#16A34A]/40 text-stone-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#BBF7D0]">{isBn ? "আইনি নীতি" : "LEGAL GUARANTEE"}</span>
                      <span className="text-[10px] text-stone-300">ACT 1882 / 1991</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {isBn
                        ? "মৌখিক উচ্ছেদ সম্পূর্ণ নিষিদ্ধ। নোটিশ পিরিয়ড এবং জামানত ফেরত সময়সূচি চুক্তিতে বাধ্যতামূলক।"
                        : "Predatory clauses strictly barred. Arbitrary verbal eviction impossible under signed counterpart hashes."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span>HASH: SHA-256 (CANONICAL)</span>
                  <span className="text-[#16A34A]">STFL VI VERIFIED</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The 6-Step Governed Agreement Simulator */}
      <section id="simulator" className="py-16 lg:py-24 border-b border-[#E7E7E2] bg-[#FAFAF8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono uppercase tracking-wider text-[#16A34A] font-bold mb-2">
              {isBn ? "ব্যবহারিক কার্যপ্রণালী" : "INTERACTIVE AGREEMENT SIMULATOR"}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#081F2D] tracking-tight mb-4">
              {isBn ? "৬-ধাপের নিয়ন্ত্রিত চুক্তি ইঞ্জিন" : "The 6-Step Governed Agreement Pipeline"}
            </h2>
            <p className="font-hind text-sm sm:text-base text-[#5A6B75] leading-relaxed">
              {isBn
                ? "ব্যবহারকারী কেবল সত্য ও বাস্তব তথ্য প্রবেশ করান—সিস্টেম স্বয়ংক্রিয়ভাবে আইনি কাঠামো, ধারা ও ক্রিপ্টোগ্রাফিক সিল প্রয়োগ করে।"
                : "The user enters empirical facts. The system supplies the governed structure, statutory clauses, and cryptographic verification."}
            </p>
          </div>

          {/* Workflow Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {[
              { step: 1, labelEn: "01. SELECT", labelBn: "০১. নির্বাচন", descEn: "Class & Scope", descBn: "চুক্তির শ্রেণি" },
              { step: 2, labelEn: "02. FILL", labelBn: "০২. তথ্য পূরণ", descEn: "Enter Real Facts", descBn: "প্রকৃত উপাত্ত" },
              { step: 3, labelEn: "03. CHECK", labelBn: "০৩. নিরীক্ষা", descEn: "Compliance Audit", descBn: "আইনি যাচাই" },
              { step: 4, labelEn: "04. SIGN", labelBn: "০৪. স্বাক্ষর", descEn: "Counterpart Hashes", descBn: "ডিজিটাল স্বাক্ষর" },
              { step: 5, labelEn: "05. RECEIVE", labelBn: "০৫. হস্তান্তর", descEn: "Official PDF + QR", descBn: "সুরক্ষিত দলিল" },
              { step: 6, labelEn: "06. VERIFY", labelBn: "০৬. যাচাই", descEn: "Public STFL Proof", descBn: "পাবলিক সত্যতা" },
            ].map((s) => {
              const isCurrent = workflowStep === s.step;
              const isPast = workflowStep > s.step;
              return (
                <button
                  key={s.step}
                  onClick={() => setWorkflowStep(s.step)}
                  className={`p-3 text-left border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-[#14532D] text-white border-[#14532D] shadow-sm"
                      : isPast
                      ? "bg-white text-[#081F2D] border-[#16A34A]/40"
                      : "bg-white text-stone-400 border-[#E7E7E2] hover:border-stone-400"
                  }`}
                >
                  <div className="text-xs font-mono font-bold">{isBn ? s.labelBn : s.labelEn}</div>
                  <div className={`text-[10px] mt-0.5 ${isCurrent ? "text-stone-200" : "text-stone-500"}`}>
                    {isBn ? s.descBn : s.descEn}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Simulator Workspace Card */}
          <div className="bg-white border border-[#E7E7E2] shadow-sm">
            {/* Agreement Class Tabs */}
            <div className="flex border-b border-[#E7E7E2] bg-[#FAFAF8] overflow-x-auto">
              {[
                { id: "RESIDENTIAL", labelEn: "Residential Tenancy", labelBn: "বাসাবাড়ির ভাড়া চুক্তি" },
                { id: "AGRARIAN", labelEn: "Agricultural Crop-Share (Barga)", labelBn: "কৃষিজমির বর্গা/আধি চুক্তি" },
                { id: "COMMERCIAL", labelEn: "Commercial Shop Lease", labelBn: "বাণিজ্যিক দোকান লিজ" },
                { id: "GREENFIELD", labelEn: "Greenfield Land Joint Venture", labelBn: "দীর্ঘমেয়াদী ভূমি উন্নয়ন চুক্তি" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 text-xs font-mono whitespace-nowrap border-b-2 font-semibold transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "border-[#14532D] text-[#14532D] bg-white"
                      : "border-transparent text-[#5A6B75] hover:text-[#081F2D]"
                  }`}
                >
                  {isBn ? tab.labelBn : tab.labelEn}
                </button>
              ))}
            </div>

            {/* Simulator Body */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Fact Inputs Panel */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E2]">
                    <span className="text-xs font-mono font-bold text-[#081F2D] uppercase">
                      {isBn ? "প্রবেশকৃত প্রকৃত উপাত্ত (User Facts)" : "EMPIRICAL FACTS (USER INPUT)"}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      LIVE VALIDATION
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#5A6B75] mb-1">
                      {isBn ? "মালিকানা / প্রদানকারী পক্ষ:" : "First Party (Lessor / Landowner):"}
                    </label>
                    <input
                      type="text"
                      value={simLandlord}
                      onChange={(e) => setSimLandlord(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 border border-[#E7E7E2] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#5A6B75] mb-1">
                      {isBn ? "ভাড়াটিয়া / কৃষক পক্ষ (NID সহ):" : "Second Party (Tenant / Bargadar with NID):"}
                    </label>
                    <input
                      type="text"
                      value={simParty}
                      onChange={(e) => setSimParty(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 border border-[#E7E7E2] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-[#5A6B75] mb-1">
                      {activeTab === "AGRARIAN"
                        ? (isBn ? "খতিয়ান, দাগ ও প্লাবনভূমির শ্রেণী:" : "Khatiyan, Plot & Floodplain Class:")
                        : (isBn ? "সম্পত্তির বিস্তারিত অবস্থান ও ইউনিট:" : "Property Scope & Unit:")}
                    </label>
                    <input
                      type="text"
                      value={simScope}
                      onChange={(e) => setSimScope(e.target.value)}
                      className="w-full text-xs font-mono p-2.5 border border-[#E7E7E2] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#14532D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-[#5A6B75] mb-1">
                        {activeTab === "AGRARIAN"
                          ? (isBn ? "ফসল বণ্টনের অনুপাত:" : "Crop Split Ratio:")
                          : (isBn ? "মাসিক ভাড়া / প্রতি বিঘার খাজনা:" : "Monthly Rent / Consideration:")}
                      </label>
                      <input
                        type="text"
                        value={simRent}
                        onChange={(e) => setSimRent(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 border border-[#E7E7E2] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-[#5A6B75] mb-1">
                        {isBn ? "জামানত / নিরাপত্তা তহবিল:" : "Security Deposit (Held):"}
                      </label>
                      <input
                        type="text"
                        value={simDeposit}
                        onChange={(e) => setSimDeposit(e.target.value)}
                        className="w-full text-xs font-mono p-2.5 border border-[#E7E7E2] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:border-[#14532D]"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] text-xs font-mono text-[#14532D] space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <ShieldCheck width={14} height={14} className="text-[#16A34A]" />
                      <span>{isBn ? "আইনি বাধ্যবাধকতা সংরক্ষিত" : "STATUTORY SAFEGUARDS LOCKED"}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#14532D]/80">
                      {isBn
                        ? "বাড়িভাড়া নিয়ন্ত্রণ আইন অনুযায়ী দুই মাসের লিখিত নোটিশ ব্যতীত উচ্ছেদ অবৈধ। জামানতের টাকা কোনো অবস্থাতেই মাসিক লাভ হিসেবে গণ্য করা যাবে না।"
                        : "Premises Rent Control Act applies. Mandatory minimum 60-day notice for residential tenancies. Arbitrary mid-term rent hikes mathematically blocked."}
                    </p>
                  </div>
                </div>

                {/* Generated Document Output Panel */}
                <div className="lg:col-span-6 bg-[#FAFAF8] border border-[#E7E7E2] p-6 flex flex-col justify-between">
                  <div>
                    {/* Document Header Preview */}
                    <div className="text-center pb-4 mb-4 border-b border-[#E7E7E2]">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[#5A6B75]">
                        SOHAELTASNEEM FOUNDATION • GRIHOSTIOS GOVERNED DEED
                      </div>
                      <div className="text-base font-bold text-[#081F2D] mt-1 font-serif">
                        {activeTab === "RESIDENTIAL" && (isBn ? "আবাসিক ফ্ল্যাট/কক্ষ ভাড়া চুক্তিপত্র" : "RESIDENTIAL TENANCY DEED")}
                        {activeTab === "AGRARIAN" && (isBn ? "কৃষিজমি ফসল-বণ্টন (বর্গা) চুক্তিপত্র" : "AGRARIAN CROP-SHARE (BARGA) DEED")}
                        {activeTab === "COMMERCIAL" && (isBn ? "বাণিজ্যিক দোকান ইজারা চুক্তিপত্র" : "COMMERCIAL LEASE AGREEMENT")}
                        {activeTab === "GREENFIELD" && (isBn ? "যৌথ ভূমি উন্নয়ন ফ্রেমওয়ার্ক" : "LAND DEVELOPMENT FRAMEWORK")}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500 mt-1">
                        DOC ID: STFL-AGR-2026-{activeTab.slice(0, 3)}-00492
                      </div>
                    </div>

                    {/* Clauses Synopsis */}
                    <div className="space-y-3 text-xs font-mono text-stone-700">
                      <div className="p-2 bg-white border border-[#E7E7E2]">
                        <span className="text-[10px] text-stone-400 block font-sans">প্রথম পক্ষ / মালিক:</span>
                        <span className="font-semibold">{simLandlord}</span>
                      </div>
                      <div className="p-2 bg-white border border-[#E7E7E2]">
                        <span className="text-[10px] text-stone-400 block font-sans">দ্বিতীয় পক্ষ / ভাড়াটিয়া বা চাষি:</span>
                        <span className="font-semibold">{simParty}</span>
                      </div>
                      <div className="p-2 bg-white border border-[#E7E7E2]">
                        <span className="text-[10px] text-stone-400 block font-sans">সম্পত্তি / জমি:</span>
                        <span>{simScope}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white border border-[#E7E7E2]">
                          <span className="text-[10px] text-stone-400 block font-sans">অর্থ বা ভাগ:</span>
                          <span className="font-bold text-[#14532D]">{simRent}</span>
                        </div>
                        <div className="p-2 bg-white border border-[#E7E7E2]">
                          <span className="text-[10px] text-stone-400 block font-sans">নিরাপত্তা জামানত:</span>
                          <span className="font-bold text-[#081F2D]">{simDeposit}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Seal Preview at bottom */}
                  <div className="pt-4 mt-6 border-t border-[#E7E7E2] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-white border border-[#081F2D] p-1 flex items-center justify-center">
                        <div className="w-7 h-7 bg-[#081F2D] text-white flex items-center justify-center text-[9px] font-mono font-bold">
                          QR
                        </div>
                      </div>
                      <div className="text-[10px] font-mono leading-tight text-[#5A6B75]">
                        <span className="font-bold text-[#081F2D] block">stflbd.app/v/GRI-492</span>
                        <span>SHA-256: 7f3b89...e19a</span>
                      </div>
                    </div>

                    <Link
                      href={`${VERIFY_ORIGIN}/verify`}
                      className="px-3 py-1.5 bg-[#081F2D] text-white text-[11px] font-mono font-bold hover:bg-[#FF6B35] transition-colors"
                    >
                      {isBn ? "যাচাই করুন" : "Verify Deed"}
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Agrarian Barga & Floodplain Architecture Deep-Dive */}
      <section id="agrarian" className="py-16 lg:py-24 border-b border-[#E7E7E2] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs font-mono uppercase tracking-wider text-[#16A34A] font-bold">
                {isBn ? "গ্রামীণ অর্থনৈতিক মডেল" : "AGRARIAN PRODUCTIVITY & FLOODPLAIN ZONES"}
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#081F2D] tracking-tight">
                {isBn
                  ? "প্লাবনভূমি কৃষি ও বর্গা/আধি অর্থনৈতিক ব্যবস্থাপনা"
                  : "Floodplain Agriculture & Crop-Share Economics"}
              </h2>
              <p className="font-hind text-sm sm:text-base text-[#5A6B75] leading-relaxed">
                {isBn
                  ? "বাংলাদেশে কৃষিজমির ভৌগোলিক উচ্চতা ও প্লাবনঝুঁকি সরাসরি উৎপাদনশীলতা নির্ধারণ করে। গৃহস্থী ওএস খতিয়ান ও দাগ নম্বরকে ৫টি প্লাবনভূমির উচ্চতাভিত্তিক স্তরে ভাগ করে স্বচ্ছ বর্গা চুক্তি নিশ্চিত করে।"
                  : "In deltaic Bangladesh, land elevation and flood duration determine true agricultural yield. GrihostiOS embeds the 5 national hydrological land classes into every agrarian contract, establishing mathematical fairness between landowner and sharecropper."}
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#FAFAF8] border-l-4 border-[#14532D] border-y border-r border-[#E7E7E2]">
                  <div className="font-bold text-[#081F2D]">{isBn ? "আইনি তিন ভাগ মডেল (Statutory 1/3 Rule)" : "Statutory 3-Way Barga Division"}</div>
                  <div className="text-[11px] text-[#5A6B75] mt-1 font-hind leading-relaxed">
                    {isBn
                      ? "১/৩ জমির মালিক · ১/৩ চাষি/শ্রমিক · ১/৩ সার ও সেচ খরচ প্রদানকারী। অন্যায্য ৫০/৫০ বাধ্যবাধকতা প্রতিহত করা হয়।"
                      : "1/3 Landowner · 1/3 Cultivator labor · 1/3 Input costs (seeds, fertilizer, irrigation). Prevents exploitative half-share burdens."}
                  </div>
                </div>

                <div className="p-3 bg-[#FAFAF8] border-l-4 border-[#16A34A] border-y border-r border-[#E7E7E2]">
                  <div className="font-bold text-[#081F2D]">{isBn ? "মৌসুমী ক্যালেন্ডার ট্র্যাকিং" : "Crop Season Synchronization"}</div>
                  <div className="text-[11px] text-[#5A6B75] mt-1 font-hind leading-relaxed">
                    {isBn
                      ? "আমন, বোরো, আউশ ও রবি শস্যের পৃথক উৎপাদন ক্যালেন্ডার এবং বন্যা-পরবর্তী ক্ষতিপূরণের স্পষ্ট নিয়ম।"
                      : "Independent accounting cycles for Aman, Boro, Aus paddy, and Rabi winter vegetables."}
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Hydrological Elevation Classes Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  tier: "F0",
                  nameEn: "High Land (উঁচু জমি)",
                  floodEn: "Flood-free throughout the monsoon",
                  cropsEn: "Homestead vegetables, fruit orchards, year-round multi-cropping",
                  cropsBn: "শাকসবজি, ফলদ বাগান ও বছরব্যাপী বহুমুখী ফসল",
                  color: "#14532D"
                },
                {
                  tier: "F1",
                  nameEn: "Medium High Land (মাঝারি উঁচু)",
                  floodEn: "Inundated up to 90 cm during peak monsoon",
                  cropsEn: "Aus and transplanted Aman paddy cycles",
                  cropsBn: "আউশ এবং রোপা আমন ধান চাষের জন্য শ্রেষ্ঠ",
                  color: "#15803D"
                },
                {
                  tier: "F2",
                  nameEn: "Medium Low Land (মাঝারি নিচু)",
                  floodEn: "Inundated between 90 cm – 180 cm",
                  cropsEn: "Deep-water broadcast Aman and high-yield dry Boro",
                  cropsBn: "গভীর পানির জলি আমন ও শুষ্ক মৌসুমের বোরো ধান",
                  color: "#0284C7"
                },
                {
                  tier: "F3",
                  nameEn: "Low Land (নিচু জমি)",
                  floodEn: "Inundated between 180 cm – 300 cm for 6+ months",
                  cropsEn: "Single-crop dry Boro rice + monsoon seasonal fish enclosure",
                  cropsBn: "একফসলী বোরো ধান এবং বর্ষাকালে মৌসুমী মৎস্য চাষ",
                  color: "#0369A1"
                },
                {
                  tier: "F4",
                  nameEn: "Very Low Land (হাওর ও বিল)",
                  floodEn: "Waterlogged for more than 9 months annually",
                  cropsEn: "Specialized wetland Boro rice, duck farming, capture fisheries",
                  cropsBn: "জলাভূমি বোরো ধান, হাঁস পালন ও প্রাকৃতিক মাছ আহরণ",
                  color: "#1E3A8A"
                },
              ].map((zone) => (
                <div key={zone.tier} className="p-4 bg-[#FAFAF8] border border-[#E7E7E2] hover:border-[#14532D] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 text-white" style={{ backgroundColor: zone.color }}>
                      ZONE {zone.tier}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">HYDROLOGICAL SPEC</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#081F2D] mb-1 font-sans">
                    {zone.nameEn}
                  </h3>
                  <div className="text-[11px] font-mono text-stone-500 mb-2">
                    {zone.floodEn}
                  </div>
                  <div className="text-xs font-hind text-stone-700 pt-2 border-t border-[#E7E7E2]">
                    {isBn ? zone.cropsBn : zone.cropsEn}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Cryptographic Verification & Audit Infrastructure */}
      <section id="verification" className="py-16 lg:py-24 border-b border-[#E7E7E2] bg-[#081F2D] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono uppercase tracking-wider text-[#16A34A] font-bold mb-2 flex items-center gap-2">
              <ShieldCheck width={14} height={14} />
              <span>{isBn ? "প্রতারণামুক্ত আইনি নিশ্চয়তা" : "CRYPTOGRAPHIC AUDIT TRAIL"}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4">
              {isBn
                ? "জালিয়াতিহীন ডকুমেন্ট ও ডিজিটাল সত্যতা যাচাই"
                : "Tamper-Proof Deeds & Instant Public Verification"}
            </h2>
            <p className="font-hind text-sm sm:text-base text-stone-300 leading-relaxed">
              {isBn
                ? "গৃহস্থী ওএস-এর প্রতিটি চুক্তিপত্র ও রসিদে একটি অপরিবর্তনীয় ক্রিপ্টোগ্রাফিক হ্যাশ এবং এসটিএফএল সেন্ট্রাল রেজিস্ট্রি লিঙ্ক থাকে। যেকোনো ব্যক্তি স্মার্টফোনে কিউআর কোড স্ক্যান করে সত্যতা নিশ্চিত করতে পারেন।"
                : "Every generated lease agreement and monthly receipt issued by GrihostiOS carries an SHA-256 hash seal registered in the STFL Central Ledger. Anyone can instantly verify authenticity without exposing private personal identifiers."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white/5 border border-white/10">
              <div className="text-[#16A34A] mb-3">
                <Lock width={24} height={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-mono">
                {isBn ? "জামানত বিচ্ছিন্নতা নীতি" : "Escrow Deposit Shield"}
              </h3>
              <p className="font-hind text-xs text-stone-300 leading-relaxed">
                {isBn
                  ? "ভাড়াটিয়ার জামানতকে কখনো পরিচালন ব্যয় হিসেবে খরচ করা যায় না। এটি ব্যালেন্স শিটের দায় হিসেবে আলাদা অ্যাকাউন্টে সংরক্ষিত থাকে।"
                  : "Security deposits are held as balance sheet liabilities, strictly segregated from operational income, guaranteeing full repayment upon exit."}
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <div className="text-[#16A34A] mb-3">
                <Page width={24} height={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-mono">
                {isBn ? "অপরিবর্তনীয় রসিদ খতিয়ান" : "Immutable Receipt Ledger"}
              </h3>
              <p className="font-hind text-xs text-stone-300 leading-relaxed">
                {isBn
                  ? "একবার রসিদ জারি হলে তা মুছে ফেলা যায় না। কোনো সমন্বয় প্রয়োজন হলে নতুন অডিট সংস্করণ তৈরি হয়।"
                  : "Once issued, an STFL rent receipt cannot be silently amended. Any billing adjustment generates a permanent audited revision."}
              </p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10">
              <div className="text-[#16A34A] mb-3">
                <Globe width={24} height={24} />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-mono">
                {isBn ? "পাবলিক ভেরিফিকেশন লিঙ্ক" : "Public Web Proof"}
              </h3>
              <p className="font-hind text-xs text-stone-300 leading-relaxed">
                {isBn
                  ? "stflbd.app/verify এ সরাসরি কোড দিয়ে ব্যাংকিং বা আইনি উদ্দেশ্যে দলিলের সঠিকতা পরীক্ষা করা যায়।"
                  : "Direct lookup on stflbd.app/verify enables courts, banks, and utility providers to confirm legal tenancy instantly."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer Seal */}
      <section className="py-12 bg-white border-t border-[#E7E7E2]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-mono text-[#5A6B75]">
          <div className="flex items-center gap-3">
            <Image
              src="/stfl-mark-dark.png"
              alt="STFL Mark"
              width={20}
              height={18}
              className="h-4 w-auto shrink-0"
            />
            <span>
              GrihostiOS is a governed operating project of{" "}
              <Link href="/" className="font-bold text-[#081F2D] hover:underline">
                SohaelTasneem Foundation
              </Link>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/initiatives" className="hover:text-[#081F2D] underline">
              {isBn ? "← সকল উদ্যোগ ও ভেঞ্চার" : "← All Initiatives"}
            </Link>
            <span>•</span>
            <Link href={`${VERIFY_ORIGIN}/verify`} className="text-[#14532D] font-bold hover:underline">
              {isBn ? "ডকুমেন্ট যাচাইকরণ" : "Document Verification"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
