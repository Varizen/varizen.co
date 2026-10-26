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
  Building,
  Key,
  Calendar,
  Lock,
  Download,
  Eye,
  Page,
  User,
  Settings,
  Spark,
  Activity
} from "iconoir-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { VERIFY_ORIGIN } from "@/src/lib/domains";
import {
  EcosystemProject,
  getInitiativeBySlug
} from "@/src/lib/initiativesRegistry";

interface InitiativeDetailViewProps {
  slug: string;
}

export function InitiativeDetailView({ slug }: InitiativeDetailViewProps) {
  const { lang, setLang } = useLanguage();
  const isBn = lang === "bn";
  const project = getInitiativeBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAFAF8]">
        <h1 className="text-2xl font-bold text-[#081F2D] mb-2 font-mono">
          {isBn ? "উদ্যোগটি খুঁজে পাওয়া যায়নি" : "Initiative Not Found"}
        </h1>
        <p className="text-sm text-[#5A6B75] mb-6 max-w-md">
          {isBn
            ? "অনুরোধকৃত উদ্যোগটি অনুমোদিত পাবলিক তালিকায় অন্তর্ভুক্ত নয় অথবা এর যাচাইকরণ চলছে।"
            : "The requested initiative is not in the publication-approved registry or is currently under internal verification."}
        </p>
        <Link
          href="/initiatives"
          className="px-4 py-2 bg-[#081F2D] text-white text-xs font-mono font-bold hover:bg-[#FF6B35] transition-colors"
        >
          {isBn ? "← সকল উদ্যোগে ফিরুন" : "← Return to All Initiatives"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      {/* Project Native Identity Header */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E7E7E2]" aria-label={`${project.name} Navigation`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Native Project Mark & STFL Relationship Badge */}
            <div className="flex items-center gap-3">
              <Link href="/initiatives" className="text-stone-400 hover:text-[#081F2D] transition-colors p-1" title="Back to Initiatives">
                <NavArrowRight width={16} height={16} className="rotate-180" />
              </Link>
              <div className="h-4 w-px bg-stone-200" />
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-[#FAFAF8] border border-[#E7E7E2] inline-flex items-center justify-center min-w-[36px] min-h-[30px]">
                  <Image
                    src={project.logoSource}
                    alt={`${project.name} Native Logo`}
                    width={70}
                    height={28}
                    className="h-6 w-auto object-contain max-w-[80px]"
                  />
                </div>
                <div>
                  <span className="font-bold text-[#081F2D] text-base tracking-tight leading-none block">
                    {project.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#081F2D]/60 flex items-center gap-1">
                    <ShieldCheck width={10} height={10} style={{ color: project.brandColors.primary }} />
                    <span>{isBn ? project.relationshipLabelBn : project.relationshipLabelEn}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Language Switcher & Hub Link */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
              <div className="flex items-center bg-[#FAFAF8] border border-[#E7E7E2] p-0.5 text-[11px]">
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-0.5 ${lang === "en" ? "bg-[#081F2D] text-white font-bold" : "text-stone-500 hover:text-black"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("bn")}
                  className={`px-2 py-0.5 ${lang === "bn" ? "bg-[#081F2D] text-white font-bold" : "text-stone-500 hover:text-black"}`}
                >
                  বাংলা
                </button>
              </div>

              <Link
                href="/initiatives"
                className="hidden sm:inline-block px-3 py-1.5 border border-[#E7E7E2] hover:border-[#081F2D] text-[#081F2D] font-semibold transition"
              >
                {isBn ? "সকল উদ্যোগ" : "All Initiatives"}
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white border-b border-[#E7E7E2] py-16 lg:py-20 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 text-xs font-mono font-semibold border"
                  style={{
                    backgroundColor: project.brandColors.surface,
                    borderColor: project.brandColors.border,
                    color: project.brandColors.primary
                  }}
                >
                  {isBn ? project.statusLabelBn : project.statusLabelEn}
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {project.country} • {project.market}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#081F2D] leading-[1.15]">
                {isBn ? project.displayNameBn : project.displayNameEn}
              </h1>

              <p className="text-sm sm:text-base font-mono font-semibold text-[#FF6B35]">
                {isBn ? project.taglineBn : project.taglineEn}
              </p>

              <p className="font-hind text-base sm:text-lg text-[#5A6B75] leading-relaxed max-w-3xl">
                {isBn ? project.shortDescriptionBn : project.shortDescriptionEn}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#capabilities"
                  className="px-5 py-3 text-white text-xs font-mono font-bold transition shadow-xs flex items-center gap-2"
                  style={{ backgroundColor: project.brandColors.primary }}
                >
                  <span>{isBn ? "সক্ষমতা ও কর্মপ্রবাহ" : "Explore Capabilities"}</span>
                  <ArrowRight width={14} height={14} />
                </a>
                <Link
                  href={`${VERIFY_ORIGIN}/verify`}
                  className="px-5 py-3 bg-white text-[#081F2D] border border-[#E7E7E2] hover:border-[#081F2D] text-xs font-mono font-bold transition flex items-center gap-2"
                >
                  <ShieldCheck width={14} height={14} style={{ color: project.brandColors.primary }} />
                  <span>{isBn ? "ডকুমেন্ট যাচাইকরণ" : "Verify Document"}</span>
                </Link>
              </div>
            </div>

            {/* Right Native Card */}
            <div className="lg:col-span-4">
              <div className="bg-[#FAFAF8] border border-[#E7E7E2] p-6 sm:p-8 space-y-6 shadow-xs">
                {/* Large Logo Emblem Container */}
                <div className="p-6 bg-white border border-[#E7E7E2] flex items-center justify-center">
                  <Image
                    src={project.logoSource}
                    alt={`${project.name} Master Logo`}
                    width={180}
                    height={75}
                    className="h-14 w-auto object-contain"
                  />
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E2]">
                    <span className="text-stone-500">{isBn ? "ক্যাটাগরি" : "Category"}</span>
                    <span className="font-semibold text-[#081F2D]">
                      {isBn ? project.categoryNameBn : project.categoryNameEn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E2]">
                    <span className="text-stone-500">{isBn ? "আইনি সত্তা" : "Legal Entity"}</span>
                    <span className="font-semibold text-[#081F2D] text-right truncate max-w-[180px]">
                      {project.legalEntity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E7E2]">
                    <span className="text-stone-500">{isBn ? "প্রজেক্ট ডোমেইন" : "Domain"}</span>
                    <span className="font-semibold text-[#081F2D]">
                      {project.domain}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">{isBn ? "রেজিস্ট্রি আইডি" : "Registry ID"}</span>
                    <span className="font-semibold text-[#081F2D]">
                      {project.projectId}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Strip */}
                <div className="pt-4 border-t border-[#E7E7E2] grid grid-cols-2 gap-3">
                  {project.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="p-2.5 bg-white border border-[#E7E7E2] text-center">
                      <div className="text-base font-extrabold text-[#081F2D] font-mono leading-none">
                        {m.value}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-1 font-sans">
                        {isBn ? m.labelBn : m.labelEn}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Narrative Section: Why It Exists & The Opportunity */}
      <section className="py-16 lg:py-20 border-b border-[#E7E7E2] bg-[#FAFAF8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Why It Exists */}
            <div className="bg-white border border-[#E7E7E2] p-8 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#FF6B35] font-bold">
                {isBn ? "উদ্যোগের পটভূমি" : "WHY IT EXISTS"}
              </div>
              <h2 className="text-2xl font-bold text-[#081F2D] tracking-tight">
                {isBn ? "বাস্তব সমস্যা ও প্রতিকার" : "The Core Problem Being Solved"}
              </h2>
              <p className="font-hind text-sm sm:text-base text-[#5A6B75] leading-relaxed">
                {isBn ? project.whyItExistsBn : project.whyItExistsEn}
              </p>
            </div>

            {/* The Opportunity */}
            <div className="bg-white border border-[#E7E7E2] p-8 space-y-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#14532D] font-bold">
                {isBn ? "সুযোগ ও রূপান্তর" : "THE OPPORTUNITY"}
              </div>
              <h2 className="text-2xl font-bold text-[#081F2D] tracking-tight">
                {isBn ? "সম্ভাবনা ও মানুষের অগ্রগতি" : "Transforming Need into Opportunity"}
              </h2>
              <p className="font-hind text-sm sm:text-base text-[#5A6B75] leading-relaxed">
                {isBn ? project.theOpportunityBn : project.theOpportunityEn}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Capabilities & How It Works */}
      <section id="capabilities" className="py-16 lg:py-20 border-b border-[#E7E7E2] bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <div className="text-xs font-mono uppercase tracking-wider font-bold mb-2" style={{ color: project.brandColors.primary }}>
              {isBn ? "সক্ষমতা ও কর্মপ্রবাহ" : "CAPABILITIES & SYSTEM ARCHITECTURE"}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#081F2D] tracking-tight mb-4">
              {isBn ? "এটি কীভাবে কাজ করে এবং কী সুবিধা দেয়" : "How It Operates & What It Delivers"}
            </h2>
            <p className="font-hind text-sm sm:text-base text-[#5A6B75] leading-relaxed">
              {isBn ? project.whatItDoesBn : project.whatItDoesEn}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Step-by-Step Execution Workflow */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-[#081F2D] mb-4">
                {isBn ? "কার্যপ্রণালীর পর্যায়সমূহ" : "Step-by-Step Workflow"}
              </h3>
              <div className="space-y-3">
                {(isBn ? project.howItWorksBn : project.howItWorksEn).map((step, idx) => (
                  <div key={idx} className="p-4 bg-[#FAFAF8] border border-[#E7E7E2] flex items-start gap-3">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 text-white shrink-0"
                      style={{ backgroundColor: project.brandColors.primary }}
                    >
                      0{idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-hind text-stone-700 leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Audience & Who It Serves */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-lg font-bold text-[#081F2D] mb-4">
                {isBn ? "কারা উপকৃত হবেন" : "Who It Serves"}
              </h3>
              <div className="space-y-3">
                {(isBn ? project.whoItServesBn : project.whoItServesEn).map((audience, idx) => (
                  <div key={idx} className="p-4 bg-[#FAFAF8] border border-[#E7E7E2] flex items-center gap-3">
                    <CheckCircle width={16} height={16} className="text-[#16A34A] shrink-0" />
                    <span className="text-xs sm:text-sm font-hind text-stone-800">
                      {audience}
                    </span>
                  </div>
                ))}
              </div>

              {/* What is Being Built List */}
              <div className="p-5 bg-[#FAFAF8] border border-[#E7E7E2] mt-6">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF6B35] mb-2">
                  {isBn ? "উন্নয়নাধীন উপাদানসমূহ" : "WHAT IS BEING BUILT"}
                </div>
                <ul className="space-y-2 text-xs font-mono text-stone-600">
                  {(isBn ? project.whatIsBeingBuiltBn : project.whatIsBeingBuiltEn).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FF6B35] font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Legal & Regulatory Governance */}
      <section className="py-12 bg-[#081F2D] text-white border-t border-[#0B2B43]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="text-xs font-mono uppercase tracking-wider text-[#FF6B35] font-bold mb-1 flex items-center gap-2">
                <ShieldCheck width={14} height={14} />
                <span>{isBn ? "আইনি ও প্রাতিষ্ঠানিক নীতি" : "LEGAL & REGULATORY STATUS"}</span>
              </div>
              <p className="font-hind text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isBn ? project.legalStatusBn : project.legalStatusEn}
              </p>
            </div>
            <Link
              href={`${VERIFY_ORIGIN}/verify`}
              className="px-4 py-2 bg-white text-[#081F2D] text-xs font-mono font-bold hover:bg-[#FAFAF8] transition-colors shrink-0"
            >
              {isBn ? "এসটিএফএল ডকুমেন্ট অডিট" : "Audit Registry"}
            </Link>
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
              {project.name} is governed within the impact ecosystem of{" "}
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
            <Link href="/brand" className="hover:text-[#081F2D]">
              {isBn ? "ব্র্যান্ড নির্দেশিকা" : "Brand Guidelines"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
