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
  title: "Cookie Policy — SohaelTasneem Foundation",
  description: "Minimalist, tracker-free cookie practices supporting only essential session state and language preferences.",
  openGraph: {
    title: "Cookie Policy — SohaelTasneem Foundation",
    description: "Minimalist, tracker-free cookie practices supporting only essential session state and language preferences.",
    url: "https://stflbd.app/cookies",
    type: "website",
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <div className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <ShieldCheck width={14} height={14} />
              <span>RESPECTFUL WEB</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                    কুকিজ নীতিমালা
                  </span>
                  <span>Cookie Policy</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
                  Minimalist, tracker-free cookie practices supporting only essential session state and language preferences.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-xs font-mono text-stone-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Bilingual Constitutional Standard
                </div>
                <p className="font-hind text-sm text-stone-200 leading-relaxed">
                  কোনো প্রকার বাণিজ্যিক ট্র্যাকিংহীন ন্যূনতম কুকিজ ব্যবহার, যা কেবল ভাষা ও সেশন নির্ধারণে ব্যবহৃত হয়।
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
                We do not run third-party advertising trackers or commercial remarketing pixels. We use only strictly necessary technical cookies to keep you secure.
              </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/80">
              <div className="text-xs font-mono font-bold text-[#0B2B43] tracking-wider uppercase">
                বাংলা বিবরণী (BENGALI CORE)
              </div>
              <p className="font-hind text-lg text-stone-800 leading-relaxed font-normal">
                আমরা কোনো বাণিজ্যিক ট্র্যাকার বা থার্ড-পার্টি বিজ্ঞাপন কুকিজ ব্যবহার করি না। কেবল প্ল্যাটফর্মের নিরাপত্তা ও ভাষা পছন্দের জন্য প্রয়োজনীয় সেশন ডেটা ব্যবহৃত হয়।
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
                  Essential Technical Cookies
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  প্রয়োজনীয় টেকনিক্যাল কুকিজ
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Cookies stored include user interface language selection (Bengali or English), CSRF prevention tokens, and authenticated session identifiers.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  সংরক্ষিত কুকিজের মধ্যে রয়েছে ব্যবহারকারীর ভাষা পছন্দ (বাংলা বা ইংরেজি), সিএসআরএফ প্রতিরোধ টোকেন এবং নিরাপদ সেশন কি।
                </p>
              </div>
            </div>
            
            <div key="1" className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold">
                  LAYER 02
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Control & Privacy
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  নিয়ন্ত্রণ ও অধিকার
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  You can clear cookies at any time via browser settings without breaking public content access across the platform.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  আপনি যেকোনো সময় ব্রাউজার সেটিংস থেকে কুকিজ মুছে ফেলতে পারেন; এতে ওয়েবসাইটের সাধারণ তথ্য পাঠে কোনো ব্যাঘাত ঘটবে না।
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
