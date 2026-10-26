import type { Metadata } from "next";
import { canonical } from "@/src/lib/domains";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building,
  Code,
  Laptop,
  Network,
  Spark,
  NavArrowLeft,
  InfoCircle
} from "iconoir-react";

export const metadata: Metadata = {
  title: "Digital Inclusion & Future Skills — SohaelTasneem Foundation",
  description: "Community tech learning hubs, open digital infrastructure, computational literacy, and remote livelihood pathways for underprivileged youth.",
  openGraph: {
    title: "Digital Inclusion & Future Skills — SohaelTasneem Foundation",
    description: "Community tech learning hubs, open digital infrastructure, computational literacy, and remote livelihood pathways for underprivileged youth.",
    url: canonical("/programs/digital-inclusion"),
    type: "website",
  },
};

export default function ProgramsDigitalInclusionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <div className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <ShieldCheck width={14} height={14} />
              <span>PROGRAM DOMAIN 04 · FUTURE READINESS</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                    ডিজিটাল সক্ষমতা ও ভবিষ্যৎ দক্ষতা
                  </span>
                  <span>Digital Inclusion & Future Skills</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl font-normal">
                  Community technology hubs, computational literacy, software tools, and remote livelihood pathways for underserved youth and marginalized communities.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-xs font-mono text-stone-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  Institutional Capability Framework
                </div>
                <p className="font-hind text-sm text-stone-200 leading-relaxed font-normal">
                  প্রান্তিক জনপদে আধুনিক কম্পিউটার ল্যাব স্থাপন, তরুণ-তরুণীদের ব্যবহারিক ডিজিটাল কর্মদক্ষতা ও সফটওয়্যার প্রশিক্ষণ এবং বিশ্ববাজারের সাথে সরাসরি দূরবর্তী কর্মসংস্থানের সংযোগ।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Narrative Section */}
        <section className="py-16 md:py-20 max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 pb-16 border-b border-stone-200">
            <div className="space-y-4">
              <div className="text-xs font-mono font-bold text-[#FF6B35] tracking-wider uppercase">
                ENGLISH SPECIFICATION
              </div>
              <p className="text-lg text-stone-700 leading-relaxed font-normal">
                True human dignity in the 21st century requires computational literacy and fair digital access. STFL establishes solar-backed community learning hubs, trains grassroots youth in high-value digital disciplines, and turns passive consumers into independent creators and income earners.
              </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/80">
              <div className="text-xs font-mono font-bold text-[#0B2B43] tracking-wider uppercase">
                বাংলা বিবরণী (BENGALI CORE)
              </div>
              <p className="font-hind text-lg text-stone-800 leading-relaxed font-normal">
                একবিংশ শতাব্দীতে মানবিক মর্যাদা ও স্বাবলম্বিতা নিশ্চিত করতে ডিজিটাল দক্ষতার কোনো বিকল্প নেই। এসটিএফএল গ্রামীণ জনপদে সৌরবিদ্যুৎ-চালিত টেক ল্যাব প্রতিষ্ঠা করে, তরুণ প্রজন্মকে কোডিং, ডেটা ও আধুনিক পেশাদার দক্ষতায় সমৃদ্ধ করে বিশ্ব অর্থনীতির সমকক্ষ করে তুলছে।
              </p>
            </div>
          </div>

          {/* Detailed Sub-Sections */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-16">
            <div className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold flex items-center gap-1.5">
                  <Laptop width={14} height={14} className="text-[#FF6B35]" />
                  <span>PILLAR 01</span>
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Community Tech Learning Hubs
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  কমিউনিটি প্রযুক্তি কেন্দ্র ও আধুনিক ল্যাব
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                  Deploying high-speed connected learning centers in remote sub-districts and union parishads. Equipped with reliable computing hardware, offline-first digital repositories, and solar battery storage for uninterrupted learning.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                <CheckCircle width={14} height={14} className="text-emerald-600" />
                <span>Verified Metric: 24 Operational Labs Across 8 Districts</span>
              </div>
            </div>

            <div className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold flex items-center gap-1.5">
                  <Code width={14} height={14} className="text-[#FF6B35]" />
                  <span>PILLAR 02</span>
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Computational Literacy & Software Skills
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  প্রোগ্রামিং, ডেটা ও পেশাদার সফটওয়্যার দক্ষতা
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                  Structured bootcamps covering web engineering, basic software testing, computational problem-solving, AI productivity tools, and bilingual office management systems for rural school graduates.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                <CheckCircle width={14} height={14} className="text-emerald-600" />
                <span>Verified Metric: 12,500+ Trainees Certified</span>
              </div>
            </div>

            <div className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold flex items-center gap-1.5">
                  <Network width={14} height={14} className="text-[#FF6B35]" />
                  <span>PILLAR 03</span>
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Remote Livelihoods & Digital Work
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  দূরবর্তী কর্মসংস্থান ও আয়বর্ধক সংযোগ
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                  Mentorship networks connecting trained youth directly with domestic and international remote work, digital data processing, content operations, and local micro-business digitisation.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                <CheckCircle width={14} height={14} className="text-emerald-600" />
                <span>Verified Metric: 3,200+ Sustainable Income Earners</span>
              </div>
            </div>

            <div className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold flex items-center gap-1.5">
                  <Spark width={14} height={14} className="text-[#FF6B35]" />
                  <span>PILLAR 04</span>
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Open Digital Public Goods
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  উন্মুক্ত ডিজিটাল জ্ঞান ও জনকল্যাণ প্রযুক্তি
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6 font-normal">
                  Building open-access bilingual digital tools, civic agreement workflows, legal templates, and educational assets distributed freely to community schools, smallholders, and self-help groups.
                </p>
              </div>
              <div className="border-t border-stone-100 pt-4 flex items-center gap-2 text-xs font-mono text-stone-500">
                <CheckCircle width={14} height={14} className="text-emerald-600" />
                <span>Verified Metric: Open License · Free Community Distribution</span>
              </div>
            </div>
          </div>

          {/* Crisis & Routine Standby Institutional Note */}
          <div className="mt-16 bg-[#FAFAF8] border border-[#E7E7E2] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="text-xs font-mono font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <InfoCircle width={14} height={14} className="text-[#FF6B35]" />
                Institutional Duty Protocol
              </div>
              <div className="text-base font-bold text-[#081F2D]">
                Crisis Relief is Routine Responsibility — Not Our Limit
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                SohaelTasneem Foundation maintains an active emergency reserve fund for sudden climate events, flash floods, and winter cold waves. We consider immediate humanitarian response standard duty, while dedicating our strategic architecture to long-term digital, educational, and economic capability.
              </p>
            </div>
            <Link
              href="/programs/emergency-relief"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#081F2D]/20 hover:border-[#081F2D] bg-white text-xs font-semibold text-[#081F2D] transition shadow-xs whitespace-nowrap"
            >
              <span>View Emergency Protocol Archive</span>
              <ArrowRight width={12} height={12} />
            </Link>
          </div>

          {/* Navigation Back & CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-stone-200">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#081F2D] hover:text-[#FF6B35] transition"
            >
              <NavArrowLeft width={16} height={16} />
              <span>Back to All Programs Overview</span>
            </Link>

            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white text-sm font-semibold rounded-lg hover:bg-[#e05a28] transition shadow-sm"
            >
              <span>Sponsor a Student or Tech Lab</span>
              <ArrowRight width={14} height={14} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
