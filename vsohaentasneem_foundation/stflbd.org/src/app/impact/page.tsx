"use client";

import React from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/src/context/LanguageContext";
import { VERIFY_ORIGIN } from "@/src/lib/domains";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Page,
  StatsReport,
  MapPin,
  CheckCircle,
  Clock,
  NavArrowRight,
  InfoCircle
} from "iconoir-react";

export default function ImpactPage() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Hero Header */}
        <div className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <Activity width={14} height={14} />
              <span>{isBn ? "প্রভাব পরিমাপ কাঠামো" : "IMPACT ARCHITECTURE"}</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  <span className="block font-hind text-2xl sm:text-3xl text-stone-300 font-semibold mb-2">
                    {isBn ? "আমরা কেবল কার্যক্রম দিয়ে সাফল্য মাপি না" : "We don't measure success by activity alone"}
                  </span>
                  <span>{isBn ? "আমরা মাপি কী পরিবর্তিত হলো" : "We measure what changes."}</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
                  {isBn
                    ? "উদ্দেশ্যমূলক উদ্যোগ থেকে শুরু করে মাঠপর্যায়ের টেকসই রূপান্তর—ইনপুট থেকে প্রভাব পর্যন্ত প্রতিটি স্তরে তথ্যভিত্তিক স্বচ্ছতা ও প্রমাণ।"
                    : "From good intentions to verified community transformation. Structural transparency and evidence across every stage of development."}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm space-y-3">
                <div className="text-xs font-mono text-stone-300 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{isBn ? "প্রভাব মাপকাঠি ২০২৬" : "Measurement Principle 2026"}</span>
                </div>
                <p className="font-hind text-sm text-stone-200 leading-relaxed">
                  {isBn
                    ? "ইনপুট (Input) → কার্যক্রম (Activity) → ফলাফল (Output) → অর্জন (Outcome) → দীর্ঘমেয়াদী রূপান্তর (Impact)।"
                    : "INPUT → ACTIVITY → OUTPUT → OUTCOME → IMPACT. Verified data without speculative fabrication."}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-stone-300 font-mono">
                  <span className="px-2 py-0.5 bg-white/10 rounded">Audit Gated</span>
                  <span className="px-2 py-0.5 bg-white/10 rounded">Zero Fabricated Facts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Impact Pipeline */}
        <section className="py-16 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#081F2D] tracking-tight">
              {isBn ? "প্রভাব সঞ্চালন পাইপলাইন (Impact Delivery Chain)" : "Impact Delivery Chain"}
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-2xl leading-relaxed">
              {isBn
                ? "আমাদের প্রাতিষ্ঠানিক ডিজিটাল ব্যাকবোনের সাহায্যে প্রতিটি অনুদান এবং কর্মসূচির সুনির্দিষ্ট রূপান্তর প্রক্রিয়া নিশ্চিত করা হয়।"
                : "Our digital backbone traces resources through verifiable stages from initial allocation to permanent community change."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {/* Step 1 */}
            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] relative">
              <span className="text-xs font-mono font-bold text-[#FF6B35]">STAGE 01</span>
              <h3 className="text-base font-bold text-[#081F2D] mt-2 mb-1">
                {isBn ? "১. ইনপুট (Input)" : "1. Input"}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isBn
                  ? "আর্থিক তহবিল, স্থায়ী সমাজকল্যাণ সম্পদ, প্রযুক্তিগত অবকাঠামো এবং মানবিক মেধা।"
                  : "Financial capital, permanent endowment assets, technical infrastructure, and expert volunteer hours."}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] relative">
              <span className="text-xs font-mono font-bold text-[#FF6B35]">STAGE 02</span>
              <h3 className="text-base font-bold text-[#081F2D] mt-2 mb-1">
                {isBn ? "২. কার্যক্রম (Activity)" : "2. Activity"}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isBn
                  ? "স্কুল সহায়তা, স্বাস্থ্য শিবির, কৃষি প্রশিক্ষণ ও জরুরি ত্রাণ বিতরণ।"
                  : "Field implementation, training sessions, medical clinics, and structural aid."}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] relative">
              <span className="text-xs font-mono font-bold text-[#FF6B35]">STAGE 03</span>
              <h3 className="text-base font-bold text-[#081F2D] mt-2 mb-1">
                {isBn ? "৩. আউটপুট (Output)" : "3. Output"}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isBn
                  ? "উপকৃত শিক্ষার্থীর সংখ্যা, প্রদত্ত স্বাস্থ্যসেবা এবং স্থাপিত কৃষি সহায়তা।"
                  : "Verified headcounts, clinics completed, educational hours delivered."}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] relative">
              <span className="text-xs font-mono font-bold text-[#FF6B35]">STAGE 04</span>
              <h3 className="text-base font-bold text-[#081F2D] mt-2 mb-1">
                {isBn ? "৪. আউটকাম (Outcome)" : "4. Outcome"}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isBn
                  ? "সাক্ষরতা বৃদ্ধি, রোগ প্রতিরোধ ক্ষমতা অর্জন, কৃষি ফলন ও আয় বৃদ্ধি।"
                  : "Measurable literacy improvements, reduced morbidity, increased harvest yields."}
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 bg-[#081F2D] text-white rounded-xl border border-[#0B2B43] relative shadow-sm">
              <span className="text-xs font-mono font-bold text-[#FF6B35]">STAGE 05</span>
              <h3 className="text-base font-bold text-white mt-2 mb-1">
                {isBn ? "৫. টেকসই প্রভাব (Impact)" : "5. Impact"}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {isBn
                  ? "দারিদ্র্য বিমোচন, আত্মনির্ভরশীল সমাজ এবং ভবিষ্যৎ প্রজন্মের সমৃদ্ধি।"
                  : "Permanent poverty reduction, self-governing local resilience, and human dignity."}
              </p>
            </div>
          </div>
        </section>

        {/* Governed Verification & Integrity Pledge */}
        <section className="py-16 md:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] p-8 md:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase mb-3">
                <ShieldCheck width={16} height={16} />
                <span>{isBn ? "তথ্য সত্যতা অঙ্গীকার" : "TRUTHFULNESS & GOVERNANCE PLEDGE"}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#081F2D] mb-4">
                {isBn
                  ? "কোনো মনগড়া সংখ্যা বা কাল্পনিক পরিসংখ্যান নয়"
                  : "Zero Fabricated Statistics Policy"}
              </h3>
              <p className="text-sm md:text-base text-stone-700 leading-relaxed mb-6 font-normal">
                {isBn
                  ? "সোহেল তাসনীম ফাউন্ডেশনের নীতি অনুযায়ী আমরা অপ্রমাণিত বা অনুমিত কোনো সুবিধাভোগীর সংখ্যা প্রচার করি না। প্রতিটি প্রকাশিত সংখ্যা আমাদের স্বাধীন আর্থিক অডিট এবং ফিল্ড অডিট অফিসারদের স্বাক্ষরিত দলিলের সাথে সংগতিপূর্ণ।"
                  : "In accordance with STFL constitutional policy, we never publish unverified beneficiary counts or speculative donor figures. Every disclosure is linked to audited financial ledgers, field verification reports, and cryptographic document identifiers."}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#E7E7E2]">
                <div className="flex items-start gap-3">
                  <CheckCircle width={18} height={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#081F2D] block">
                      {isBn ? "স্বাধীন বার্ষিক নিরীক্ষা" : "Independent Annual Audits"}
                    </span>
                    <span className="text-stone-500">
                      {isBn ? "আইনগত বিধিবদ্ধ নিরীক্ষক দ্বারা যাচাইকৃত" : "Statutory chartered accounting verification"}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle width={18} height={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#081F2D] block">
                      {isBn ? "পাবলিক ভেরিফিকেশন কোড" : "Public Document Verification"}
                    </span>
                    <span className="text-stone-500">
                      {isBn ? "রিসিপ্ট ও সার্টিফিকেটের হ্যাশ যাচাই" : "Tamper-proof cryptographic hashes"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 p-8 bg-[#081F2D] text-white rounded-xl">
            <div>
              <h4 className="text-xl font-bold">
                {isBn ? "বার্ষিক রিপোর্ট ও অডিট রিপোর্ট দেখতে চান?" : "Review Verified Annual Reports"}
              </h4>
              <p className="text-xs text-stone-300 mt-1">
                {isBn
                  ? "আমাদের প্রাতিষ্ঠানিক আর্থিক বিবরণী এবং পরিচালনা পর্ষদের প্রতিবেদন সবার জন্য উন্মুক্ত।"
                  : "Institutional financials, project audit ledgers, and governance reports are publicly accessible."}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/reports"
                className="px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e05a28] text-white text-xs font-semibold rounded-md transition shadow-xs flex items-center gap-2"
              >
                <span>{isBn ? "প্রতিবেদনসমূহ দেখুন" : "View Reports"}</span>
                <ArrowRight width={14} height={14} />
              </Link>
              <Link
                href={`${VERIFY_ORIGIN}/verify`}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md transition border border-white/20"
              >
                {isBn ? "নথি যাচাই করুন" : "Verify Document"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
