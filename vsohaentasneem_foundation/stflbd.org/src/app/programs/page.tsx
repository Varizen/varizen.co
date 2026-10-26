import type { Metadata } from "next";
import { canonical } from "@/src/lib/domains";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  BookStack,
  Heart,
  Group,
  Activity,
  Laptop,
  NavArrowRight,
  Clock,
  Spark
} from "iconoir-react";

export const metadata: Metadata = {
  title: "Programs & Strategic Initiatives — SohaelTasneem Foundation",
  description: "Core institutional program domains of SohaelTasneem Foundation: Education, Healthcare, Community Development, and Digital Inclusion & Future Skills.",
  openGraph: {
    title: "Programs & Strategic Initiatives — SohaelTasneem Foundation",
    description: "Core institutional program domains of SohaelTasneem Foundation: Education, Healthcare, Community Development, and Digital Inclusion & Future Skills.",
    url: canonical("/programs"),
    type: "website",
  },
};

const activePrograms = [
  {
    id: "education",
    num: "01",
    enTitle: "Education & Learning Initiatives",
    bnTitle: "শিক্ষা ও প্রশিক্ষণ কর্মসূচি",
    href: "/programs/education",
    taglineEn: "Foundational schooling, technical scholarships, and digital literacy pathways.",
    taglineBn: "মানসম্মত প্রাথমিক শিক্ষা, কারিগরি বৃত্তি এবং ডিজিটাল সাক্ষরতা সংযোগ।",
    problemEn: "Structural barriers preventing marginalized children and youth from completing continuous education and obtaining market-relevant skills.",
    approachEn: "Community-embedded study learning hubs, need-based scholarships, teacher stipend grants, and computational literacy kits.",
    icon: BookStack,
    accent: "border-blue-200 bg-blue-50/30 text-blue-800",
  },
  {
    id: "health",
    num: "02",
    enTitle: "Primary Healthcare & Community Wellness",
    bnTitle: "প্রাথমিক স্বাস্থ্যসেবা ও কমিউনিটি সুস্থতা",
    href: "/programs/health",
    taglineEn: "Mobile healthcare clinics, maternal health support, and preventive health screenings.",
    taglineBn: "ভ্রাম্যমাণ চিকিৎসা কেন্দ্র, মাতৃস্বাস্থ্য পরিচর্যা ও প্রতিরোধমূলক স্বাস্থ্য পরীক্ষা।",
    problemEn: "High out-of-pocket medical expenditure causing rural and informal urban families to fall into emergency debt traps.",
    approachEn: "Subsidized diagnostic camps, essential medication vouchers, telemedicine triage, and community health worker training.",
    icon: Heart,
    accent: "border-rose-200 bg-rose-50/30 text-rose-800",
  },
  {
    id: "community-development",
    num: "03",
    enTitle: "Community Development & Enterprise",
    bnTitle: "সামাজিক উন্নয়ন ও স্বাবলম্বিতা",
    href: "/programs/community-development",
    taglineEn: "Micro-enterprise grants, clean water infrastructure, and sustainable agricultural linkages.",
    taglineBn: "ক্ষুদ্র উদ্যোক্তা অনুদান, সুপেয় পানির অবকাঠামো ও টেকসই কৃষি সংযোগ।",
    problemEn: "Under-capitalization of rural households and severe vulnerability to seasonal salinity and economic shockwaves.",
    approachEn: "Asset-transfer packages, community deep tube-well installations, cooperative crop aggregation, and market linkages.",
    icon: Group,
    accent: "border-amber-200 bg-amber-50/30 text-amber-800",
  },
  {
    id: "digital-inclusion",
    num: "04",
    enTitle: "Digital Inclusion & Future Skills",
    bnTitle: "ডিজিটাল সক্ষমতা ও ভবিষ্যৎ দক্ষতা",
    href: "/programs/digital-inclusion",
    taglineEn: "Community tech labs, computational literacy, and remote livelihood pathways.",
    taglineBn: "কমিউনিটি ডিজিটাল ল্যাব, সফটওয়্যার দক্ষতা এবং দূরবর্তী কর্মসংস্থান সংযোগ।",
    problemEn: "Severe digital and skill divide leaving rural youth excluded from modern remote knowledge economies and computational employment.",
    approachEn: "Solar-powered community learning centers, coding bootcamps, computational thinking kits, and domestic/international remote work placement.",
    icon: Laptop,
    accent: "border-cyan-200 bg-cyan-50/30 text-cyan-800",
  },
];

const roadmapDomains = [
  { en: "Entrepreneurship & Micro-Venture", bn: "উদ্যোক্তা উন্নয়ন ও ক্ষুদ্র উদ্যোগ", status: "Roadmap 2028" },
  { en: "Inclusion & Assistive Pathways", bn: "অন্তর্ভুক্তি ও প্রতিবন্ধী সহায়তা", status: "Roadmap 2028" },
  { en: "Climate & Environmental Resilience", bn: "পরিবেশ ও জলবায়ু সহনশীলতা", status: "Roadmap 2030" },
  { en: "Civic Rights & Legal Dignity", bn: "আইনি সুরক্ষা ও নাগরিক অধিকার", status: "Roadmap 2030" },
  { en: "Empirical Policy & Field Research", bn: "প্রয়োগিক নীতি ও মাঠ পর্যায়ের গবেষণা", status: "Roadmap 2032" },
];

export default function ProgramsOverviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <ShieldCheck width={14} height={14} />
              <span>INSTITUTIONAL PROGRAM ARCHITECTURE</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                  আমাদের কর্মসূচি ও টেকসই উদ্যোগ
                </span>
                <span>Programs & Strategic Initiatives</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                SohaelTasneem Foundation executes structured, evidence-guided humanitarian programs designed to convert good intentions into verified, lasting community capability.
              </p>
            </div>
          </div>
        </section>

        {/* Operating Architecture Banner */}
        <section className="bg-[#FAFAF8] border-b border-[#E7E7E2] py-8">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]"></span>
                <span className="font-bold text-[#081F2D] uppercase tracking-wider">Continuous Lifecycle:</span>
                <span>Need &rarr; Intervention &rarr; Measurement &rarr; Learning &rarr; Scale</span>
              </div>
              <div className="text-stone-500">
                Measurement Rule: We measure what changes, not activity alone.
              </div>
            </div>
          </div>
        </section>

        {/* Active Programs Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="mb-12">
              <div className="text-xs font-mono text-[#FF6B35] uppercase tracking-widest mb-1">
                Active Operational Domains
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#081F2D]">
                Four Core Institutional Pillars
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {activePrograms.map((prog) => {
                const IconComponent = prog.icon;
                return (
                  <div
                    key={prog.id}
                    className="border border-[#E7E7E2] rounded-xl p-8 bg-white hover:border-[#FF6B35]/40 transition-all shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#081F2D]/5 border border-[#081F2D]/10 flex items-center justify-center text-[#081F2D]">
                            <IconComponent width={24} height={24} />
                          </div>
                          <div>
                            <span className="text-xs font-mono text-stone-400 block">
                              DOMAIN {prog.num}
                            </span>
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Active in Field
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-[#081F2D] mb-1">
                        {prog.enTitle}
                      </h3>
                      <div className="font-hind text-base font-semibold text-stone-600 mb-4">
                        {prog.bnTitle}
                      </div>

                      <p className="text-sm text-stone-700 leading-relaxed mb-6 font-medium">
                        {prog.taglineEn}
                      </p>

                      <div className="space-y-3 mb-8 pt-4 border-t border-[#E7E7E2]/60 text-xs">
                        <div>
                          <span className="font-mono text-stone-400 uppercase tracking-wider block mb-1">The Problem:</span>
                          <span className="text-stone-700">{prog.problemEn}</span>
                        </div>
                        <div>
                          <span className="font-mono text-stone-400 uppercase tracking-wider block mb-1">Our Approach:</span>
                          <span className="text-stone-700">{prog.approachEn}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={prog.href}
                      className="inline-flex items-center justify-between w-full px-5 py-3 rounded-lg bg-[#081F2D] text-white text-xs font-semibold hover:bg-[#FF6B35] transition-colors"
                    >
                      <span>Explore Program & Framework</span>
                      <ArrowRight width={14} height={14} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Future Roadmap Domains */}
        <section className="bg-[#FAFAF8] py-16 border-t border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#081F2D] uppercase tracking-wider mb-2">
                <Spark width={14} height={14} className="text-[#FF6B35]" />
                <span>Strategic Horizons</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#081F2D]">
                Roadmap Domains (2028–2035)
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                Governed expansion areas designed to scale community capability without compromising measurement integrity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roadmapDomains.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg border border-[#E7E7E2] bg-white flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 mb-2 inline-block">
                      {item.status}
                    </span>
                    <div className="font-bold text-sm text-[#081F2D]">{item.en}</div>
                    <div className="font-hind text-xs text-stone-500 mt-1">{item.bn}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Participation Banner */}
        <section className="bg-[#081F2D] text-white py-12">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Partner or Support a Program</h3>
              <p className="text-xs text-stone-300 mt-1">
                Collaborate with SohaelTasneem Foundation through institutional partnerships or verified donation funds.
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/partner"
                className="px-5 py-2.5 rounded-lg border border-white/20 text-xs font-semibold hover:bg-white/10 transition"
              >
                Partner With Us
              </Link>
              <Link
                href="/donate"
                className="px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-xs font-semibold hover:bg-[#e85a26] transition"
              >
                Support Financially
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
