"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowRight,
  NavArrowRight,
  ShieldCheck,
  Globe,
  Building,
  CheckCircle,
  Eye,
  Activity,
  ViewGrid,
  Spark
} from "iconoir-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { AmbientParticleBackground } from "@/components/AmbientParticleBackground";
import {
  getPublicInitiatives,
  ProjectCategory,
  EcosystemProject
} from "@/src/lib/initiativesRegistry";
import { VERIFY_ORIGIN } from "@/src/lib/domains";

export default function InitiativesPage() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";
  const initiatives = getPublicInitiatives();

  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    { id: "ALL", labelEn: "All Initiatives", labelBn: "সকল উদ্যোগ", count: initiatives.length },
    { id: "PROPERTY_AND_RURAL_ECONOMY", num: "03", labelEn: "Property & Rural Economy", labelBn: "সম্পত্তি ও গ্রামীণ অর্থনীতি", count: initiatives.filter(p => p.category === "PROPERTY_AND_RURAL_ECONOMY").length },
    { id: "OPPORTUNITY_AND_WORKFORCE", num: "02", labelEn: "Opportunity & Workforce", labelBn: "দক্ষতা ও কর্মসংস্থান", count: initiatives.filter(p => p.category === "OPPORTUNITY_AND_WORKFORCE").length },
    { id: "DIGITAL_AND_MARKETPLACE", num: "05", labelEn: "Digital & Marketplace", labelBn: "ডিজিটাল ও মার্কেটপ্লেস", count: initiatives.filter(p => p.category === "DIGITAL_AND_MARKETPLACE").length },
    { id: "FINANCE_AND_ACCESS", num: "06", labelEn: "Finance & Access", labelBn: "অর্থায়ন ও অন্তর্ভুক্তি", count: initiatives.filter(p => p.category === "FINANCE_AND_ACCESS").length },
    { id: "COMMUNITY_AND_CULTURE", num: "07", labelEn: "Community & Culture", labelBn: "কমিউনিটি ও সংস্কৃতি", count: initiatives.filter(p => p.category === "COMMUNITY_AND_CULTURE").length }
  ].filter(c => c.id === "ALL" || c.count > 0);

  const filteredInitiatives = activeCategory === "ALL"
    ? initiatives
    : initiatives.filter(p => p.category === activeCategory);

  // Separate into Primary Anchors vs Portfolio Ventures for editorial hierarchy
  const primaryAnchors = filteredInitiatives.filter(
    p => p.ecosystemPosition === "PRIMARY_ANCHOR" || p.ecosystemPosition === "KEY_INITIATIVE"
  );
  const secondaryVentures = filteredInitiatives.filter(
    p => p.ecosystemPosition === "PORTFOLIO_VENTURE"
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A]">
      {/* Editorial Hero Section with Subtle Living Field Canvas */}
      <section className="relative overflow-hidden border-b border-[#E7E7E2] bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AmbientParticleBackground className="opacity-45" particleDensity={4200} />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Breadcrumb / Institutional Authority Strip */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-mono text-[#5A6B75]">
            <Link href="/" className="hover:text-[#081F2D] transition-colors">
              STFL
            </Link>
            <span>/</span>
            <span className="text-[#FF6B35] font-semibold">
              {isBn ? "উদ্যোগ ও ভেঞ্চার" : "INITIATIVES & VENTURES"}
            </span>
            <span>•</span>
            <span className="bg-[#081F2D]/5 text-[#081F2D] px-2 py-0.5 border border-[#081F2D]/10">
              {isBn ? "প্রাতিষ্ঠানিক ইকোসিস্টেম" : "GOVERNED IMPACT ECOSYSTEM"}
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#081F2D] leading-[1.1] mb-6">
              {isBn ? (
                <>
                  উদ্যোগ ও ভেঞ্চার:{" "}
                  <span className="text-[#FF6B35]">আইডিয়া থেকে বাস্তব সমাধান</span>
                </>
              ) : (
                <>
                  Initiatives & Ventures:{" "}
                  <span className="text-[#FF6B35]">From ideas to practical progress</span>
                </>
              )}
            </h1>

            <p className="font-hind text-lg sm:text-xl text-[#5A6B75] leading-relaxed mb-8 max-w-3xl">
              {isBn
                ? "সোহেল তাসনীম ফাউন্ডেশন কেবল প্রচলিত কর্মসূচি পরিচালনা করে না। আমরা সমস্যা চিহ্নিত করি, সক্ষমতা বৃদ্ধি করি এবং বাস্তব উদ্যোগ গড়ে তুলি। কোনোটি রূপ নেয় কর্মসূচিতে, কোনোটি শক্তিশালী প্ল্যাটফর্মে, আবার কোনোটি স্বাধীন টেকসই ভেঞ্চারে।"
                : "SohaelTasneem Foundation does not merely run programs. We identify needs, build capability, and connect people with practical initiatives. Some work becomes a program, some an operating platform, and some an independent sustainable venture."}
            </p>

            {/* Living Impact Pipeline Indicator */}
            <div className="p-4 sm:p-5 bg-[#FAFAF8] border border-[#E7E7E2] shadow-xs max-w-3xl">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#FF6B35] font-bold mb-3 flex items-center gap-2">
                <ViewGrid width={14} height={14} />
                <span>{isBn ? "প্রভাব তৈরির স্তরক্রম" : "THE STFL ECOSYSTEM PIPELINE"}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono font-medium text-[#081F2D]">
                <span className="bg-white px-2 py-1 border border-[#E7E7E2]">{isBn ? "জনগণ" : "PEOPLE"}</span>
                <span className="text-[#FF6B35]">→</span>
                <span className="bg-white px-2 py-1 border border-[#E7E7E2]">{isBn ? "চাহিদা" : "NEEDS"}</span>
                <span className="text-[#FF6B35]">→</span>
                <span className="bg-white px-2 py-1 border border-[#E7E7E2]">{isBn ? "সক্ষমতা" : "CAPABILITY"}</span>
                <span className="text-[#FF6B35]">→</span>
                <span className="bg-white px-2 py-1 border border-[#E7E7E2]">{isBn ? "সুযোগ" : "OPPORTUNITY"}</span>
                <span className="text-[#FF6B35]">→</span>
                <span className="bg-[#FF6B35] text-white px-2 py-1 border border-[#e05a28] font-bold">{isBn ? "উদ্যোগ ও প্ল্যাটফর্ম" : "PROJECTS & PLATFORMS"}</span>
                <span className="text-[#FF6B35]">→</span>
                <span className="bg-[#081F2D] text-white px-2 py-1 border border-[#081F2D] font-bold">{isBn ? "পরিমাপযোগ্য প্রভাব" : "OUTCOMES & SCALE"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Controls */}
      <section className="sticky top-16 z-30 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-[#E7E7E2] py-3.5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-mono whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? "bg-[#081F2D] text-white border-[#081F2D] font-bold shadow-xs"
                      : "bg-white text-[#5A6B75] border-[#E7E7E2] hover:text-[#081F2D] hover:border-[#081F2D]/40"
                  }`}
                >
                  {cat.num && <span className="opacity-60 mr-1.5 font-normal">{cat.num}</span>}
                  <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                  <span className={`ml-1.5 px-1.5 py-0.2 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Initiatives Grid: Editorial Compositions */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        
        {/* Editorial Feature Group 1: Primary Anchors & Key Initiatives */}
        {primaryAnchors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E7E7E2]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#081F2D] tracking-tight">
                  {isBn ? "মূল নোঙর ও কৌশলগত প্ল্যাটফর্ম" : "Primary Anchors & Strategic Platforms"}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6B75] mt-1">
                  {isBn
                    ? "সরাসরি এসটিএফএল দ্বারা পরিচালিত প্রাতিষ্ঠানিক ডিজিটাল ও ভৌত সমাধান।"
                    : "STFL-controlled operational systems designed for direct scalable community impact."}
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs font-mono text-[#5A6B75]">
                {primaryAnchors.length} {isBn ? "টি উদ্যোগ" : "INITIATIVES"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {primaryAnchors.map((project) => (
                <article
                  key={project.projectId}
                  className="bg-white border border-[#E7E7E2] hover:border-[#081F2D]/50 transition-all flex flex-col justify-between group shadow-xs hover:shadow-md"
                >
                  <div className="p-6 sm:p-8">
                    {/* Header Strip with Native Logo and Badges */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="p-3 bg-[#FAFAF8] border border-[#E7E7E2] inline-flex items-center justify-center min-w-[70px] min-h-[50px]">
                        <Image
                          src={project.logoSource}
                          alt={`${project.name} Native Logo`}
                          width={110}
                          height={44}
                          className="h-9 w-auto object-contain max-w-[120px]"
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[11px] font-mono px-2 py-0.5 border font-semibold" style={{ borderColor: project.brandColors.border, backgroundColor: project.brandColors.surface, color: project.brandColors.primary }}>
                          {isBn ? project.statusLabelBn : project.statusLabelEn}
                        </span>
                        <span className="text-[10px] font-mono text-[#5A6B75]">
                          {isBn ? project.relationshipLabelBn : project.relationshipLabelEn}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-2xl font-bold text-[#081F2D] tracking-tight mb-2 group-hover:text-[#FF6B35] transition-colors">
                      {isBn ? project.displayNameBn : project.displayNameEn}
                    </h3>
                    <p className="text-xs font-mono font-medium text-[#FF6B35] mb-4">
                      {isBn ? project.taglineBn : project.taglineEn}
                    </p>

                    {/* Short Description */}
                    <p className="font-hind text-sm text-[#5A6B75] leading-relaxed mb-6">
                      {isBn ? project.shortDescriptionBn : project.shortDescriptionEn}
                    </p>

                    {/* Key Metrics Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-4 px-3 bg-[#FAFAF8] border border-[#E7E7E2] mb-6">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="text-center sm:text-left">
                          <div className="text-base font-extrabold text-[#081F2D] font-mono leading-none">
                            {metric.value}
                          </div>
                          <div className="text-[10px] text-[#5A6B75] mt-1 font-sans">
                            {isBn ? metric.labelBn : metric.labelEn}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Market & Category Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#5A6B75] pt-4 border-t border-[#E7E7E2]">
                      <span className="flex items-center gap-1.5">
                        <Globe width={13} height={13} className="text-[#FF6B35]" />
                        <span>{project.market}</span>
                      </span>
                      <span>•</span>
                      <span>{isBn ? project.categoryNameBn : project.categoryNameEn}</span>
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="px-6 sm:px-8 py-4 bg-[#FAFAF8] border-t border-[#E7E7E2] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#5A6B75]">
                      REF: {project.projectId}
                    </span>
                    <Link
                      href={project.canonicalPath}
                      className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#081F2D] group-hover:text-[#FF6B35] transition-colors"
                    >
                      <span>{isBn ? "উদ্যোগটি বিস্তারিত দেখুন" : "Explore Project Experience"}</span>
                      <ArrowRight width={14} height={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Editorial Feature Group 2: Portfolio Ventures & Partnerships */}
        {secondaryVentures.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E7E7E2]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#081F2D] tracking-tight">
                  {isBn ? "পোর্টফোলিও ভেঞ্চার ও কৌশলগত অংশীদারিত্ব" : "Portfolio Ventures & Strategic Partnerships"}
                </h2>
                <p className="text-xs sm:text-sm text-[#5A6B75] mt-1">
                  {isBn
                    ? "আঞ্চলিক ও বিশেষায়িত খাতে উদ্ভাবনী প্রভাব বিস্তারের সহায়ক ভেঞ্চার।"
                    : "Focused ventures expanding economic capability, cross-border remittance, and social infrastructure."}
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs font-mono text-[#5A6B75]">
                {secondaryVentures.length} {isBn ? "টি ভেঞ্চার" : "VENTURES"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secondaryVentures.map((project) => (
                <article
                  key={project.projectId}
                  className="bg-white border border-[#E7E7E2] hover:border-[#081F2D]/50 transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm"
                >
                  <div className="p-6">
                    {/* Top Native Mark & Status */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="p-2.5 bg-[#FAFAF8] border border-[#E7E7E2] inline-flex items-center justify-center min-w-[50px] min-h-[40px]">
                        <Image
                          src={project.logoSource}
                          alt={`${project.name} Logo`}
                          width={90}
                          height={36}
                          className="h-7 w-auto object-contain max-w-[100px]"
                        />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 border" style={{ borderColor: project.brandColors.border, backgroundColor: project.brandColors.surface, color: project.brandColors.primary }}>
                        {isBn ? project.statusLabelBn : project.statusLabelEn}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#081F2D] tracking-tight mb-1 group-hover:text-[#FF6B35] transition-colors">
                      {isBn ? project.displayNameBn : project.displayNameEn}
                    </h3>

                    <div className="text-[11px] font-mono text-[#FF6B35] font-semibold mb-3">
                      {isBn ? project.relationshipLabelBn : project.relationshipLabelEn}
                    </div>

                    <p className="font-hind text-xs text-[#5A6B75] leading-relaxed mb-4 line-clamp-3">
                      {isBn ? project.shortDescriptionBn : project.shortDescriptionEn}
                    </p>

                    <div className="text-[11px] font-mono text-stone-500 pt-3 border-t border-[#E7E7E2]">
                      <span className="block truncate">{project.market}</span>
                    </div>
                  </div>

                  <div className="px-6 py-3.5 bg-[#FAFAF8] border-t border-[#E7E7E2] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-stone-400">{project.country}</span>
                    <Link
                      href={project.canonicalPath}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#081F2D] group-hover:text-[#FF6B35] transition-colors"
                    >
                      <span>{isBn ? "বিস্তারিত" : "Explore"}</span>
                      <NavArrowRight width={13} height={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Institutional Governance Callout Box */}
        <div className="bg-[#081F2D] text-white p-8 sm:p-10 border border-[#0B2B43] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#FF6B35]">
              <ShieldCheck width={16} height={16} />
              <span>{isBn ? "প্রাতিষ্ঠানিক স্বচ্ছতা ও শাসননীতি" : "INSTITUTIONAL GOVERNANCE & INTEGRITY"}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
              {isBn
                ? "স্বতন্ত্র উদ্যোগ, সমন্বিত প্রাতিষ্ঠানিক শাসনকাঠামো"
                : "Distinct Project Identities, Shared Institutional Governance"}
            </h3>
            <p className="text-sm text-stone-300 font-hind leading-relaxed">
              {isBn
                ? "এসটিএফএল ইকোসিস্টেমের প্রতিটি উদ্যোগ নিজস্ব ব্র্যান্ড, বাজার এবং লক্ষ্য পূরণ করে। তবে সুরক্ষা, অডিট, ক্রিপ্টোগ্রাফিক ডকুমেন্ট ভেরিফিকেশন এবং আইনি সততার মানদণ্ডে সকলেই একই প্রাতিষ্ঠানিক নীতির অধীন।"
                : "Every initiative in the STFL ecosystem addresses its specific market and community needs with native identity, while adhering to unified standards of document verification, financial safeguarding, and institutional integrity."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={`${VERIFY_ORIGIN}/verify`}
              className="px-4 py-2.5 bg-white text-[#081F2D] text-xs font-mono font-bold hover:bg-[#FAFAF8] transition-colors text-center border border-white"
            >
              {isBn ? "ডকুমেন্ট যাচাইকরণ পোর্টাল" : "Verification Portal"}
            </Link>
            <Link
              href="/partner"
              className="px-4 py-2.5 bg-[#FF6B35] text-white text-xs font-mono font-bold hover:bg-[#e05a28] transition-colors text-center border border-[#e05a28]"
            >
              {isBn ? "অংশীদার হিসেবে যুক্ত হন" : "Partner With Us"}
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
