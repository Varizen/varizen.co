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
  title: "Our Mission & Purpose — SohaelTasneem Foundation",
  description: "Human dignity. Practical action. Measurable impact. Good intentions are only the beginning — what changed?",
  openGraph: {
    title: "Our Mission & Purpose — SohaelTasneem Foundation",
    description: "Human dignity. Practical action. Measurable impact. Good intentions are only the beginning — what changed?",
    url: "https://stflbd.app/mission",
    type: "website",
  },
};

export default function MissionPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <div className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <ShieldCheck width={14} height={14} />
              <span>CORE CONSTITUTION</span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                  <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                    আমাদের লক্ষ্য ও উদ্দেশ্য
                  </span>
                  <span>Our Mission & Purpose</span>
                </h1>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl">
                  Human dignity. Practical action. Measurable impact. Good intentions are only the beginning — what changed?
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-xs font-mono text-stone-300 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Bilingual Constitutional Standard
                </div>
                <p className="font-hind text-sm text-stone-200 leading-relaxed">
                  মানুষের মর্যাদা। বাস্তবমুখী পদক্ষেপ। পরিমাপযোগ্য প্রভাব। সদিচ্ছা কেবল সূচনা মাত্র — বাস্তবে কী বদলালো?
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
                Our mission is to dismantle barriers to human flourishing. We believe good intentions are only the beginning. The fundamental question we ask of every initiative is: What changed in people's real lives?
              </p>
            </div>
            <div className="space-y-4 bg-stone-50 p-6 md:p-8 rounded-2xl border border-stone-200/80">
              <div className="text-xs font-mono font-bold text-[#0B2B43] tracking-wider uppercase">
                বাংলা বিবরণী (BENGALI CORE)
              </div>
              <p className="font-hind text-lg text-stone-800 leading-relaxed font-normal">
                আমাদের মিশন মানুষের আত্মবিকাশের পথে বিদ্যমান প্রতিবন্ধকতা দূর করা। আমরা বিশ্বাস করি শুভকামনা কেবল শুরু। আমাদের প্রতিটি প্রকল্পের মূল প্রশ্ন: মানুষের বাস্তব জীবনে কী ইতিবাচক পরিবর্তন এসেছে?
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
                  Core Positioning
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  মূল অবস্থান
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Build opportunity. Multiply impact. We do not engage in superficial charity; we engineer lasting pathways out of hardship through sustainable community platforms.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  সুযোগ তৈরি করুন। প্রভাব বহুগুণ করুন। আমরা কোনো ক্ষণস্থায়ী ত্রাণে সীমাবদ্ধ নই; টেকসই সামাজিক কাঠামোর মাধ্যমে মানুষের স্বাবলম্বিতার স্থায়ী পথ তৈরি করি।
                </p>
              </div>
            </div>
            
            <div key="1" className="border border-stone-200 rounded-xl p-8 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#0B2B43] mb-3 font-semibold">
                  LAYER 02
                </div>
                <h2 className="text-xl font-bold text-[#081F2D] mb-1">
                  Technology & Impact Philosophy
                </h2>
                <h3 className="font-hind text-base font-medium text-[#FF6B35] mb-4">
                  প্রযুক্তি ও সামাজিক প্রভাব দর্শন
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Impact and technology — connected, not confused. AI intelligence assists, human authority governs, and physical execution remains centered on human dignity.
                </p>
                <p className="font-hind text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-lg border border-stone-100">
                  প্রভাব ও প্রযুক্তির সঠিক সংযোগ — যেখানে এআই সহায়তা করে, মানব কর্তৃপক্ষ শাসন করে এবং প্রতিটি পদক্ষেপ মানুষের সম্মানকে সমুন্নত রাখে।
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
