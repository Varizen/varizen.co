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
  title: "Privacy Policy — SohaelTasneem Foundation",
  description: "How SohaelTasneem Foundation handles, protects, and respects your personal and organizational data.",
  openGraph: {
    title: "Privacy Policy — SohaelTasneem Foundation",
    description: "How SohaelTasneem Foundation handles, protects, and respects your personal and organizational data.",
    url: "https://stflbd.app/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <div className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <ShieldCheck width={14} height={14} />
              <span>DATA INTEGRITY</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                    গোপনীয়তা নীতিমালা
                  </span>
                  <span>Privacy Policy</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
                  How SohaelTasneem Foundation handles, protects, and respects your personal and organizational data.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-xs font-mono text-stone-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Bilingual Constitutional Standard
                </div>
                <p className="font-hind text-sm text-stone-200 leading-relaxed">
                  সোহেল তাসনীম ফাউন্ডেশন কীভাবে আপনার ব্যক্তিগত ও প্রাতিষ্ঠানিক তথ্যের পূর্ণ নিরাপত্তা ও গোপনীয়তা রক্ষা করে।
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
                Your trust is paramount. STFL collects only the minimum information necessary to execute governed humanitarian services. We never sell, monetize, or disclose personal data.
              </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/80">
              <div className="text-xs font-mono font-bold text-[#0B2B43] tracking-wider uppercase">
                বাংলা বিবরণী (BENGALI CORE)
              </div>
              <p className="font-hind text-lg text-stone-800 leading-relaxed font-normal">
                আপনার আস্থা আমাদের কাছে সর্বাধিক গুরুত্বপূর্ণ। এসটিএফএল কেবল প্রয়োজনীয় প্রাতিষ্ঠানিক তথ্য সংগ্রহ করে এবং কখনোই তা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করে না।
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
                  Information We Collect
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  যেসব তথ্য আমরা সংগ্রহ করি
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Contact details provided voluntarily for inquiries, volunteer applications, or donation receipts; minimal device security telemetry for Android field staff.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  যোগাযোগের জন্য প্রদত্ত সাধারণ তথ্য, স্বেচ্ছাসেবী আবেদনের তথ্য এবং মাঠকর্মীদের জন্য প্রয়োজনীয় ডিভাইস নিরাপত্তা সংক্রান্ত ডেটা।
                </p>
              </div>
            </div>
            
            <div key="1" className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold">
                  LAYER 02
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Statutory Data Protection
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  আইনি সুরক্ষা ও সংরক্ষণ
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Data is processed in compliance with applicable Bangladesh cyber security and digital trust statutes, encrypted at rest and in transit.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  সকল ডেটা সাইবার নিরাপত্তা আইন অনুযায়ী সংরক্ষিত এবং ট্রানজিট ও স্টোরেজের প্রতিটি স্তরে শক্তিশালী এনক্রিপশন দ্বারা সুরক্ষিত।
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
