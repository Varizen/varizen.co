import type { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Building,
  Page,
  NavArrowLeft,
  InfoCircle
} from "iconoir-react";

export const metadata: Metadata = {
  title: "Volunteer With Us — SohaelTasneem Foundation",
  description: "Join our dedicated field brigades delivering physical aid, survey verifications, and educational support across Bangladesh.",
  openGraph: {
    title: "Volunteer With Us — SohaelTasneem Foundation",
    description: "Join our dedicated field brigades delivering physical aid, survey verifications, and educational support across Bangladesh.",
    url: "https://stflbd.app/volunteer",
    type: "website",
  },
};

export default function VolunteerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <div className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <ShieldCheck width={14} height={14} />
              <span>FIELD MOBILIZATION</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                    স্বেচ্ছাসেবক হিসেবে যোগ দিন
                  </span>
                  <span>Volunteer With Us</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
                  Join our dedicated field brigades delivering physical aid, survey verifications, and educational support across Bangladesh.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-xs font-mono text-stone-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Bilingual Constitutional Standard
                </div>
                <p className="font-hind text-sm text-stone-200 leading-relaxed">
                  মাঠপর্যায়ে সহায়তা প্রদান, সমীক্ষা যাচাই ও শিক্ষা কর্মসূচিতে অংশ নিতে আমাদের স্বেচ্ছাসেবী নেটওয়ার্কে যুক্ত হন।
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
                Volunteers are the heartbeat of STFL's field operations. We provide comprehensive safety training, mobile-first tools, and official participation certificates.
              </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/80">
              <div className="text-xs font-mono font-bold text-[#0B2B43] tracking-wider uppercase">
                বাংলা বিবরণী (BENGALI CORE)
              </div>
              <p className="font-hind text-lg text-stone-800 leading-relaxed font-normal">
                স্বেচ্ছাসেবকরা এসটিএফএল মাঠপর্যায়ের মূল শক্তি। আমরা দায়িত্বশীলদের উপযুক্ত প্রশিক্ষণ, আধুনিক ডিজিটাল টুলস এবং প্রাতিষ্ঠানিক প্রত্যয়ন প্রদান করি।
              </p>
            </div>
          </div>

          {/* Detailed Sub-Sections */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 pt-16">
            
            <div key="0" className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold">
                  LAYER 01
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Field Brigade Activities
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  ফিল্ড ব্রিগেডের দায়িত্বসমূহ
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Participate in health camp coordination, disaster food distribution, student mentoring, and physical site verification audits.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  স্বাস্থ্য ক্যাম্প পরিচালনা, ত্রাণ বিতরণ লজিস্টিকস, শিক্ষার্থীদের মেন্টরিং এবং মাঠপর্যায়ে তথ্য যাচাই কার্যক্রমে অংশগ্রহণ।
                </p>
              </div>
            </div>
            
            <div key="1" className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold">
                  LAYER 02
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Governed Onboarding & Badges
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  প্রশিক্ষণ ও ডিজিটাল ব্যাজ
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Complete our mobile training modules, receive verified digital volunteer credentials, and make a measurable difference in communities.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  আমাদের সংক্ষিপ্ত ট্রেনিং কোর্স সম্পন্ন করে ডিজিটাল ভলান্টিয়ার আইডি সংগ্রহ করুন এবং দেশের কল্যাণে ভূমিকা রাখুন।
                </p>
              </div>
            </div>
            
          </div>

          {/* Action Callout */}
          <div className="mt-16 bg-stone-900 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h4 className="text-2xl font-bold">
                Let's build something that matters.
              </h4>
              <p className="font-hind text-sm text-stone-300">
                আমাদের প্ল্যাটফর্মের সাথে যুক্ত হয়ে সমাজের ইতিবাচক পরিবর্তনে ভূমিকা রাখুন।
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/donate"
                className="px-6 py-3 bg-[#FF6B35] hover:bg-[#ff7a45] text-white font-semibold rounded-lg text-sm transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span>Support Our Work</span>
                <ArrowRight width={16} height={16} />
              </Link>
              <Link
                href="/admin"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-colors border border-white/20"
              >
                Admin Consoles
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
