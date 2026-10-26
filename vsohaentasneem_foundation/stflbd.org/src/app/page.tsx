"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AmbientParticleBackground } from "@/components/AmbientParticleBackground";
import { useLanguage } from "@/src/context/LanguageContext";
import { VERIFY_ORIGIN } from "@/src/lib/domains";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Page,
  Group,
  Folder,
  CheckCircle,
  Clock,
  NavArrowRight,
  InfoCircle,
  Globe,
  Heart,
  Eye,
  BookStack,
  ShoppingBag,
  Building,
  User,
  Spark
} from "iconoir-react";

export default function Home() {
  const { lang } = useLanguage();
  const isBn = lang === "bn";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* ===================================================================
            SECTION 01 — HERO
            =================================================================== */}
        <section className="relative overflow-hidden bg-[#FAFAF8] border-b border-[#E7E7E2] pt-16 pb-20 md:pt-28 md:pb-32">
          {/* Subtle Warm Backdrop Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(255,255,255,0.9),transparent_70%)] pointer-events-none" />

          {/* Premium Ambient Particle Dust Field (Antigravity Floating-Atmosphere) */}
          <AmbientParticleBackground className="z-0" />

          {/* Faded Large-Scale Dot Matrix Hero Artwork with Linear Fade */}
          <div
            className="absolute right-[-15%] sm:right-[-8%] lg:right-[-2%] xl:right-[2%] top-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] lg:w-[950px] xl:w-[1100px] pointer-events-none select-none opacity-15 lg:opacity-20 transition-opacity z-[1]"
            style={{
              maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)"
            }}
          >
            <Image
              src="/media/dot-matrix-hero.png"
              alt="STFL Community and Map Dot Matrix Artwork"
              width={1140}
              height={647}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              {/* Master Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#081F2D] tracking-tight leading-[1.08] mb-6">
                <span className="block font-hind text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0B2B43] mb-2 font-semibold">
                  {isBn ? "বাস্তব কর্মযজ্ঞ · দৃশ্যমান রূপান্তর" : "QUIET ACTION. MEASURABLE TRANSFORMATION."}
                </span>
                <span className="text-[#081F2D]">
                  {isBn
                    ? "মর্যাদাপূর্ণ অগ্রযাত্রার ভিত্তি গড়ি প্রতিটি মানুষের জন্য।"
                    : "Creating real opportunity for every community to move forward."}
                </span>
              </h1>

              {/* Readjusted Editorial Text Frame at the Bottom */}
              <div className="my-8 sm:my-10 p-5 sm:p-6 bg-[#FAFAF8] border-l-4 border-l-[#FF6B35] border border-[#E7E7E2] rounded-r-xl max-w-3xl shadow-xs">
                <p className="text-base sm:text-lg md:text-xl text-[#081F2D] leading-relaxed font-normal">
                  {isBn
                    ? "আমরা কেবল সদিচ্ছায় বিশ্বাস করি না। আমরা মানুষ ও সম্প্রদায়ের এগিয়ে চলার উপযুক্ত পরিবেশ সৃষ্টি করি—শিক্ষা, স্বাস্থ্য, সামাজিক উদ্যোক্তা ও দায়িত্বশীল প্রযুক্তির টেকসই সমন্বয়ে।"
                    : "We build the conditions for people and communities to move forward. Good intentions are only the beginning—what matters is verifiable, lasting change."}
                </p>
              </div>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/programs/education"
                  className="px-6 py-3.5 bg-[#FF6B35] hover:bg-[#e05a28] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <span>{isBn ? "আমাদের কর্মসূচি দেখুন" : "Explore Our Work"}</span>
                  <ArrowRight width={16} height={16} />
                </Link>

                <Link
                  href="/donate"
                  className="px-6 py-3.5 bg-[#081F2D] hover:bg-[#0B2B43] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
                >
                  <Heart width={16} height={16} className="text-[#FF6B35]" />
                  <span>{isBn ? "একটি অর্থপূর্ণ ভবিষ্যৎ গড়ি" : "Let's build something that matters"}</span>
                </Link>

                <Link
                  href="/admin"
                  className="px-5 py-3.5 bg-[#FAFAF8] hover:bg-[#E7E7E2] text-[#081F2D] border border-[#E7E7E2] font-semibold text-sm rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <ShieldCheck width={16} height={16} className="text-[#0B2B43]" />
                  <span>{isBn ? "ম্যানেজমেন্ট কনসোল হাব" : "Management Consoles"}</span>
                </Link>
              </div>

              {/* Fast Anchor Navigation Chips */}
              <div className="mt-12 pt-8 border-t border-[#E7E7E2] flex flex-wrap items-center gap-3 text-xs font-mono text-[#5A6B75]">
                <span className="font-bold text-[#081F2D] uppercase tracking-wider">{isBn ? "গুরুত্বপূর্ণ লিংক:" : "QUICK ACCESS:"}</span>
                <Link href="/about" className="px-2.5 py-1 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:text-[#081F2D]">
                  {isBn ? "পরিচিতি" : "About"}
                </Link>
                <Link href="/impact" className="px-2.5 py-1 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:text-[#081F2D]">
                  {isBn ? "প্রভাব কাঠামো" : "Impact Model"}
                </Link>
                <Link href="/admin/property" className="px-2.5 py-1 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:text-[#FF6B35] font-semibold">
                  GrihostiOS
                </Link>
                <Link href={`${VERIFY_ORIGIN}/verify`} className="px-2.5 py-1 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:text-[#081F2D]">
                  {isBn ? "নথি যাচাই" : "Verify"}
                </Link>
                <Link href="/brand" className="px-2.5 py-1 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:text-[#081F2D]">
                  {isBn ? "ব্র্যান্ড নির্দেশিকা" : "Brand Guidelines"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 02 — THE QUESTION
            =================================================================== */}
        <section className="bg-[#081F2D] text-white py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF6B35] uppercase mb-4 block">
                {isBn ? "জবাবদিহিতার মূল প্রশ্ন" : "THE ACCOUNTABILITY STANDARD"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
                <span className="block font-hind text-2xl sm:text-3xl font-semibold text-stone-300 mb-2">
                  {isBn ? "সদিচ্ছা কেবলই সূচনা।" : "GOOD INTENTIONS ARE ONLY THE BEGINNING."}
                </span>
                <span className="text-[#FF6B35]">
                  {isBn ? "মূল প্রশ্ন হলো: কী পরিবর্তিত হলো?" : "The real question is: What changed?"}
                </span>
              </h2>
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto">
                {isBn
                  ? "আমরা শুধু কয়টি অধিবেশন বা কত টাকার ত্রাণ বিতরণ করা হলো তা গণনা করে সাফল্য মাপি না। প্রতিটি উদ্যোগের প্রকৃত প্রভাব হলো মানুষের মর্যাদাপূর্ণ রূপান্তর ও দীর্ঘস্থায়ী আত্মনির্ভরশীলতা।"
                  : "We don't measure success by activity alone. We measure what changes in people's daily lives, their self-reliance, and their community dignity."}
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 03 — WHAT WE DO (8 Core Domains)
            =================================================================== */}
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
              {isBn ? "কাজের পরিধি" : "AREAS OF ACTION"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-4">
              {isBn ? "আটটি প্রধান কর্মসূচি ক্ষেত্র" : "Eight Core Institutional Domains"}
            </h2>
            <p className="text-sm md:text-base text-[#5A6B75] leading-relaxed">
              {isBn
                ? "সুনির্দিষ্ট ও দীর্ঘমেয়াদী পরিকল্পনার ভিত্তিতে আমরা ব্যক্তি ও সমাজের মৌলিক চাহিদাসমূহ পূরণ করতে কাজ করি।"
                : "Focused on structural human development through integrated, community-owned interventions."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                en: "Education",
                bn: "শিক্ষা",
                descEn: "Foundational literacy, digital learning labs, and community teacher empowerment.",
                descBn: "মৌলিক সাক্ষরতা, ডিজিটাল লার্নিং ল্যাব এবং শিক্ষকদের দক্ষতা বৃদ্ধি কর্মসূচি।",
                link: "/programs/education",
              },
              {
                num: "02",
                en: "Health",
                bn: "স্বাস্থ্যসেবা",
                descEn: "Preventive health outreach, maternal health checkups, and emergency nutrition support.",
                descBn: "প্রতিরোধমূলক স্বাস্থ্যসেবা, মা ও শিশু স্বাস্থ্য এবং জরুরি পুষ্টি সহায়তা।",
                link: "/programs/health",
              },
              {
                num: "03",
                en: "Community Development",
                bn: "সামাজিক উন্নয়ন",
                descEn: "Clean water infrastructure, community centers, and localized problem-solving forums.",
                descBn: "বিশুদ্ধ পানির অবকাঠামো, কমিউনিটি সেন্টার এবং স্থানীয় সমস্যা সমাধানের উদ্যোগ।",
                link: "/programs/community-development",
              },
              {
                num: "04",
                en: "Entrepreneurship",
                bn: "উদ্যোক্তা উন্নয়ন",
                descEn: "Micro-enterprise coaching, seed capital vouchers, and rural trade access.",
                descBn: "ক্ষুদ্র উদ্যোক্তা প্রশিক্ষণ, বীজ মূলধন অনুদান এবং গ্রামীণ ব্যবসা সংযোগ।",
                link: "/programs/community-development",
              },
              {
                num: "05",
                en: "Inclusion",
                bn: "অন্তর্ভুক্তি",
                descEn: "Direct dignity support for marginalized families, persons with disabilities, and seniors.",
                descBn: "প্রান্তিক জনগোষ্ঠী, প্রতিবন্ধী ব্যক্তি এবং প্রবীণদের মর্যাদাপূর্ণ সহায়তা।",
                link: "/about",
              },
              {
                num: "06",
                en: "Environment & Climate",
                bn: "পরিবেশ ও জলবায়ু সহনশীলতা",
                descEn: "Salinity-resilient agriculture, flood-safe shelters, and solar energy installations.",
                descBn: "লবণাক্ততা সহনশীল কৃষি, বন্যা-সহনশীল আশ্রয় এবং সৌরবিদ্যুৎ ব্যবস্থাপনা।",
                link: "/programs/emergency-relief",
              },
              {
                num: "07",
                en: "Research & Evidence",
                bn: "গবেষণা ও উদ্ভাবন",
                descEn: "Field evidence audits, socioeconomic studies, and verifiable outcome documentation.",
                descBn: "মাঠপর্যায়ের তথ্য অনুসন্ধান, আর্থ-সামাজিক জরিপ এবং ফলাফল অডিট।",
                link: "/publications",
              },
              {
                num: "08",
                en: "Responsible Technology",
                bn: "দায়িত্বশীল প্রযুক্তি",
                descEn: "Cryptographic document verification, offline-first mobile tools, and ethical AI assistance.",
                descBn: "ক্রিপ্টোগ্রাফিক নথি যাচাইকরণ, অফলাইন-বান্ধব মোবাইল টুলস এবং নৈতিক এআই সমন্বয়।",
                link: "/admin",
              },
            ].map((domain) => (
              <Link
                key={domain.num}
                href={domain.link}
                className="group p-6 bg-[#FAFAF8] rounded-xl border border-[#E7E7E2] hover:border-[#081F2D]/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest">
                    {domain.num}
                  </span>
                  <h3 className="text-lg font-bold text-[#081F2D] mt-2 mb-1 group-hover:text-[#FF6B35] transition-colors">
                    {isBn ? domain.bn : domain.en}
                  </h3>
                  <div className="text-[11px] font-mono text-stone-500 mb-3">
                    {isBn ? domain.en : domain.bn}
                  </div>
                  <p className="text-xs text-[#5A6B75] leading-relaxed">
                    {isBn ? domain.descBn : domain.descEn}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E7E7E2] flex items-center gap-1 text-xs font-semibold text-[#081F2D] group-hover:text-[#FF6B35]">
                  <span>{isBn ? "বিস্তারিত দেখুন" : "Learn more"}</span>
                  <NavArrowRight width={14} height={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 04 — FROM NEED TO OPPORTUNITY (Visual Pipeline)
            =================================================================== */}
        <section className="bg-[#FAFAF8] py-20 md:py-28 border-b border-[#E7E7E2]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "অপারেশন সিকোয়েন্স" : "OPERATING SEQUENCE"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-4">
                {isBn ? "প্রয়োজন থেকে দীর্ঘমেয়াদী সুযোগে উত্তরণ" : "From Need to Opportunity"}
              </h2>
              <p className="text-sm md:text-base text-[#5A6B75] leading-relaxed">
                {isBn
                  ? "আমাদের প্রতিটি প্রকল্পের কার্যপদ্ধতি ধারাবাহিক আটটি সুনির্দিষ্ট স্তরে পরিচালিত হয়।"
                  : "How programs transform into platforms, and platforms become sustainable community pathways."}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
              {[
                { step: "01", bn: "প্রয়োজন", en: "Need", sub: "Ground Assessment" },
                { step: "02", bn: "উপলব্ধি", en: "Understand", sub: "Deep Root Cause" },
                { step: "03", bn: "সক্ষমতা", en: "Enable", sub: "Tools & Knowledge" },
                { step: "04", bn: "সংযোগ", en: "Connect", sub: "People & Partners" },
                { step: "05", bn: "বাস্তবায়ন", en: "Act", sub: "Practical Execution" },
                { step: "06", bn: "পরিমাপ", en: "Measure", sub: "Audited Truth" },
                { step: "07", bn: "শিক্ষা", en: "Learn", sub: "Feedback Loop" },
                { step: "08", bn: "পরিধি বিস্তার", en: "Scale", sub: "Multiplied Impact" },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-3 sm:p-3.5 bg-white rounded-lg border border-[#E7E7E2] shadow-2xs text-center flex flex-col h-full hover:border-[#FF6B35]/40 transition-colors"
                >
                  {/* Step Number */}
                  <span className="text-[10px] font-mono font-bold text-[#FF6B35] block mb-2 shrink-0">
                    {item.step}
                  </span>

                  {/* Primary & Secondary Titles - Uniform Baseline */}
                  <div className="shrink-0 mb-3">
                    <h4
                      className="text-[13px] sm:text-sm font-bold text-[#081F2D] leading-tight truncate"
                      title={isBn ? item.bn : item.en}
                    >
                      {isBn ? item.bn : item.en}
                    </h4>
                    <p
                      className="text-[10px] font-mono text-stone-500 mt-1 truncate"
                      title={isBn ? item.en : item.bn}
                    >
                      {isBn ? item.en : item.bn}
                    </p>
                  </div>

                  {/* Subtitle / Description - Uniform Bottom Anchor */}
                  <div className="mt-auto pt-2 border-t border-stone-100 flex items-center justify-center min-h-[2.25rem]">
                    <p className="text-[10px] text-[#5A6B75] leading-tight text-center font-medium">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 05 — PROGRAMS (Four Core Focus Areas)
            =================================================================== */}
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "মাঠপর্যায়ের কার্যক্রম" : "CORE PROGRAMMES"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-3">
                {isBn ? "অগ্রাধিকারভিত্তিক কর্মসূচি" : "Priority Action Programs"}
              </h2>
              <p className="text-sm md:text-base text-[#5A6B75] leading-relaxed">
                {isBn
                  ? "শিক্ষা, স্বাস্থ্য, সামাজিক উন্নয়ন ও দুর্যোগ সহায়তা—প্রতিটি ক্ষেত্রে সুনির্দিষ্ট ফ্রেমওয়ার্কে কাজ পরিচালিত হয়।"
                  : "Structured, evidence-backed program units with permanent local leadership and audited accountability."}
              </p>
            </div>
            <Link
              href="/programs/education"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] hover:text-[#e05a28] uppercase tracking-wider font-mono"
            >
              <span>{isBn ? "সকল কর্মসূচি সূচি" : "Full Program Directory"}</span>
              <ArrowRight width={14} height={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Program 1: Education */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[#E7E7E2] text-[#0B2B43] font-bold">
                    EDUCATION
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-semibold">Active · Non-Stop</span>
                </div>
                <h3 className="text-2xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "শিক্ষা ও সাক্ষরতা কর্মসূচি" : "Education & Literacy Program"}
                </h3>
                <p className="text-xs font-mono text-stone-500 mb-4">
                  Foundational Skills · Digital Labs · School Infrastructure
                </p>
                <p className="text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "সুবিধাবঞ্চিত শিশুদের প্রাথমিক শিক্ষা নিশ্চিতকরণ, পাঠাগার স্থাপন এবং গ্রামীণ শিক্ষাপ্রতিষ্ঠানে কম্পিউটার ও ডিজিটাল বিজ্ঞান শিক্ষার উপকরণ প্রদান।"
                    : "Ensuring foundational learning access for children in remote areas, providing modern learning labs, and upgrading community school infrastructure."}
                </p>
              </div>
              <Link
                href="/programs/education"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#081F2D] hover:text-[#FF6B35] transition"
              >
                <span>{isBn ? "কর্মসূচির বিস্তারিত দেখুন" : "Explore Education Details"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>

            {/* Program 2: Healthcare */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[#E7E7E2] text-[#0B2B43] font-bold">
                    HEALTHCARE
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-semibold">Active · Outreach</span>
                </div>
                <h3 className="text-2xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "স্বাস্থ্য ও পুষ্টি সেবা" : "Healthcare & Nutrition Outreach"}
                </h3>
                <p className="text-xs font-mono text-stone-500 mb-4">
                  Primary Care · Maternal Health · Free Medicine Support
                </p>
                <p className="text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "প্রান্তিক পরিবারের জন্য ভ্রাম্যমাণ স্বাস্থ্য ক্যাম্প, বিনামূল্যে প্রয়োজনীয় ওষুধ সরবরাহ এবং মা ও শিশুর স্বাস্থ্য সুরক্ষায় নিয়মিত পরামর্শ কেন্দ্র পরিচালনা।"
                    : "Community medical clinics, essential medicine supply chains, and dedicated maternal-child health counseling in underserved unions."}
                </p>
              </div>
              <Link
                href="/programs/health"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#081F2D] hover:text-[#FF6B35] transition"
              >
                <span>{isBn ? "কর্মসূচির বিস্তারিত দেখুন" : "Explore Health Details"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>

            {/* Program 3: Community Development */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[#E7E7E2] text-[#0B2B43] font-bold">
                    COMMUNITY DEVELOPMENT
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-semibold">Sustainable · Enterprise</span>
                </div>
                <h3 className="text-2xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "সামাজিক উন্নয়ন ও উদ্যোক্তা" : "Community Development & Enterprise"}
                </h3>
                <p className="text-xs font-mono text-stone-500 mb-4">
                  Rural Infrastructure · Safe Water · Small Enterprise
                </p>
                <p className="text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "গভীর নলকূপ স্থাপন, স্যানিটেশন সুবিধা তৈরি এবং নারীদের কুটির শিল্প ও ক্ষুদ্র ব্যবসার মাধ্যমে স্বাবলম্বী করার বাস্তবমুখী পদক্ষেপ।"
                    : "Deep tubewell water infrastructure, sanitary sanitation access, and women-led micro-enterprise support for enduring financial independence."}
                </p>
              </div>
              <Link
                href="/programs/community-development"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#081F2D] hover:text-[#FF6B35] transition"
              >
                <span>{isBn ? "কর্মসূচির বিস্তারিত দেখুন" : "Explore Community Details"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>

            {/* Program 4: Digital Inclusion & Future Skills */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[#E7E7E2] text-[#0B2B43] font-bold">
                    DIGITAL INCLUSION
                  </span>
                  <span className="text-xs font-mono text-cyan-700 font-semibold">Future Skills · Livelihoods</span>
                </div>
                <h3 className="text-2xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "ডিজিটাল সক্ষমতা ও ভবিষ্যৎ দক্ষতা" : "Digital Inclusion & Future Skills"}
                </h3>
                <p className="text-xs font-mono text-stone-500 mb-4">
                  Community Tech Labs · Computational Literacy · Remote Livelihoods
                </p>
                <p className="text-sm text-stone-700 leading-relaxed mb-6 font-normal">
                  {isBn
                    ? "প্রান্তিক জনপদে কমিউনিটি ডিজিটাল ল্যাব স্থাপন, সুবিধাবঞ্চিত তরুণ-তরুণীদের আধুনিক কম্পিউটার ও সফটওয়্যার দক্ষতা প্রশিক্ষণ এবং দূরবর্তী কাজের মাধ্যমে টেকসই কর্মসংস্থান সৃষ্টি।"
                    : "Establishing community digital learning hubs, equipping underprivileged youth with market-ready software and technical skills, and creating remote livelihood pathways to bridge the opportunity divide."}
                </p>
              </div>
              <Link
                href="/programs/digital-inclusion"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#081F2D] hover:text-[#FF6B35] transition"
              >
                <span>{isBn ? "কর্মসূচির বিস্তারিত দেখুন" : "Explore Digital Skills Details"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>

          {/* Institutional Duty Note: Crisis Response Routine Standby */}
          <div className="mt-8 p-4 md:p-5 rounded-xl border border-[#E7E7E2] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              <span>
                <strong className="text-[#081F2D] font-mono uppercase tracking-wider">
                  {isBn ? "জরুরি সহায়তা নীতি:" : "Emergency Response Protocol:"}
                </strong>{" "}
                {isBn
                  ? "বন্যা, শৈত্যপ্রবাহ বা প্রাকৃতিক দুর্যোগে দ্রুত ত্রাণ ও খাদ্য সহায়তা পৌঁছানো আমাদের স্বাভাবিক ও অপরিবর্তনীয় দায়িত্ব হিসেবে সবসময় সক্রিয় থাকে।"
                  : "Rapid relief, food mobilization, and cold-wave shelter in natural disasters remain our permanent routine civic duty on continuous standby."}
              </span>
            </div>
            <Link
              href="/programs/emergency-relief"
              className="text-[11px] font-mono text-[#0B2B43] hover:text-[#FF6B35] underline shrink-0 font-semibold"
            >
              {isBn ? "জরুরি ত্রাণ প্রোটোকল দেখুন &rarr;" : "View Emergency Standby Archive &rarr;"}
            </Link>
          </div>
        </section>

        {/* ===================================================================
            SECTION 05.5 — INITIATIVES & VENTURES (WHAT WE BUILD)
            =================================================================== */}
        <section className="bg-[#FAFAF8] py-20 md:py-28 border-b border-[#E7E7E2]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "আমরা কী গড়ে তুলি" : "WHAT WE BUILD — INITIATIVES & VENTURES"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#081F2D] tracking-tight mt-2 mb-4 leading-tight">
                {isBn
                  ? "আইডিয়া থেকে কর্মসূচি, প্ল্যাটফর্ম ও নতুন পথ"
                  : "Some work becomes a programme. Some a platform. Some a new way."}
              </h2>
              <p className="text-base text-[#5A6B75] font-hind leading-relaxed">
                {isBn
                  ? "এসটিএফএল সমস্যা চিহ্নিত করে, সক্ষমতা তৈরি করে এবং বাস্তব উদ্যোগকে সংযুক্ত করে। প্রচলিত দাতব্য সহায়তার বাইরে আমরা এমন টেকসই অর্থনৈতিক ও প্রযুক্তিগত কাঠামো তৈরি করি যা মানুষের সক্ষমতাকে বহুগুণ বাড়িয়ে দেয়।"
                  : "STFL develops, supports, and connects initiatives that turn opportunity into practical progress. Beyond standard charity, we build institutional platforms, land operating systems, and decentralized marketplaces."}
              </p>
            </div>

            {/* Curated Grid of Key Initiatives */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  slug: "grihostios",
                  nameEn: "GrihostiOS",
                  nameBn: "গৃহস্থী ওএস",
                  descEn: "Property, Lease, Floodplain Agriculture & Crop-Share OS",
                  descBn: "সম্পত্তি, লিজ, কৃষিজমি ও বর্গা/আধি চুক্তি অপারেটিং সিস্টেম",
                  tagEn: "Property & Land OS",
                  tagBn: "সম্পত্তি ও জমি",
                  logo: "/media/grihostios-logo.svg",
                  badgeColor: "#14532D"
                },
                {
                  slug: "skillconnect",
                  nameEn: "SkillConnect",
                  nameBn: "স্কিলকানেক্ট",
                  descEn: "Workforce credentials, verified skills & migrant worker protection",
                  descBn: "শ্রমশক্তি নিবন্ধন, দক্ষতা সনদ ও নিরাপদ অভিবাসন",
                  tagEn: "Workforce Platform",
                  tagBn: "দক্ষতা ও কর্মসংস্থান",
                  logo: "/media/skillconnect-logo.svg",
                  badgeColor: "#1E3A8A"
                },
                {
                  slug: "proiozon",
                  nameEn: "Proiozon",
                  nameBn: "প্রয়োজন",
                  descEn: "Bangla-first digital marketplace & cottage enterprise enablement",
                  descBn: "বাংলা-প্রথম ডিজিটাল বাণিজ্য ও কুটিরশিল্প মার্কেটপ্লেস",
                  tagEn: "BD Marketplace",
                  tagBn: "মার্কেটপ্লেস",
                  logo: "/media/proiozon-logo.png",
                  badgeColor: "#EA580C"
                },
                {
                  slug: "maxremit",
                  nameEn: "MaxRemit",
                  nameBn: "ম্যাক্সরেমিট",
                  descEn: "Transparent cross-border rails & migrant remittance dignity",
                  descBn: "স্বচ্ছ ক্রস-বর্ডার পেমেন্ট ও প্রবাসীদের রেমিট্যান্স সুরক্ষা",
                  tagEn: "Remittance Corridor",
                  tagBn: "রেমিট্যান্স প্ল্যাটফর্ম",
                  logo: "/media/maxremit-logo.svg",
                  badgeColor: "#065F46"
                }
              ].map((item) => (
                <Link
                  key={item.slug}
                  href={`/initiatives/${item.slug}`}
                  className="bg-white p-6 border border-[#E7E7E2] hover:border-[#081F2D] transition-all group flex flex-col justify-between shadow-xs hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="p-2 bg-[#FAFAF8] border border-[#E7E7E2] inline-flex items-center justify-center min-w-[50px] min-h-[38px]">
                        <Image
                          src={item.logo}
                          alt={`${item.nameEn} Logo`}
                          width={75}
                          height={30}
                          className="h-6 w-auto object-contain max-w-[80px]"
                        />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 border" style={{ borderColor: item.badgeColor + "40", color: item.badgeColor, backgroundColor: item.badgeColor + "10" }}>
                        {isBn ? item.tagBn : item.tagEn}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#081F2D] group-hover:text-[#FF6B35] transition-colors mb-2">
                      {isBn ? item.nameBn : item.nameEn}
                    </h3>
                    <p className="text-xs text-[#5A6B75] font-hind leading-relaxed mb-4">
                      {isBn ? item.descBn : item.descEn}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E7E7E2] flex items-center justify-between text-xs font-mono font-semibold text-[#081F2D] group-hover:text-[#FF6B35]">
                    <span>{isBn ? "বিস্তারিত দেখুন" : "Explore Project"}</span>
                    <NavArrowRight width={14} height={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom Curiosity Bar */}
            <div className="p-6 bg-white border border-[#E7E7E2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-mono text-[#5A6B75] text-center sm:text-left">
                <span className="font-bold text-[#081F2D]">{isBn ? "৮টি সক্রিয় ও যাচাইকৃত উদ্যোগ:" : "8 Verified Ecosystem Initiatives:"}</span>{" "}
                GrihostiOS · SkillConnect · AEV Developments · MaxRemit · Helpex · Proiozon · Perlu · OIIX
              </div>
              <Link
                href="/initiatives"
                className="px-5 py-2.5 bg-[#081F2D] text-white text-xs font-mono font-bold hover:bg-[#FF6B35] transition-colors flex items-center gap-2 shrink-0"
              >
                <span>{isBn ? "সকল উদ্যোগ ও ভেঞ্চার এক্সপ্লোর করুন" : "Explore Full Initiatives Ecosystem"}</span>
                <ArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 06 — IMPACT & EVIDENCE
            =================================================================== */}
        <section className="bg-white py-20 md:py-28 border-b border-[#E7E7E2]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                  {isBn ? "প্রভাব দর্শন" : "MEASUREMENT CONSTITUTION"}
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-6">
                  {isBn ? "আমরা কার্যকলাপ নয়, স্থায়ী পরিবর্তন মাপি" : "We Measure What Changes."}
                </h2>
                <div className="space-y-4 text-sm md:text-base text-stone-700 leading-relaxed font-normal">
                  <p>
                    {isBn
                      ? "এনজিও বা দাতব্য কার্যক্রমে প্রায়শই শুধু ব্যয়িত টাকার পরিমাণ বা উপস্থিত মানুষের সংখ্যা তুলে ধরা হয়। কিন্তু সোহেল তাসনীম ফাউন্ডেশনের মূল লক্ষ্য হলো প্রকৃত রূপান্তর।"
                      : "Charitable activity is too often reduced to spending totals or attendance headcounts. STFL anchors its governance in authentic outcome measurement."}
                  </p>
                  <p>
                    {isBn
                      ? "আমাদের পরিমাপের স্তর: ইনপুট → কার্যক্রম → ফলাফল → অর্জন → টেকসই পরিবর্তন। প্রতিটি স্তর স্বাধীন অডিট ও ফিল্ড অফিসারদের যাচাইয়ের মাধ্যমে সংরক্ষিত থাকে।"
                      : "Every program flows through an audited causal pipeline. We never fabricate metrics when field data is under collection."}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href="/impact"
                    className="px-6 py-3 bg-[#081F2D] hover:bg-[#0B2B43] text-white text-xs font-semibold rounded-md transition shadow-xs flex items-center gap-2"
                  >
                    <span>{isBn ? "প্রভাব কাঠামো দেখুন" : "Explore Impact Architecture"}</span>
                    <ArrowRight width={14} height={14} />
                  </Link>
                  <Link
                    href="/reports"
                    className="px-6 py-3 bg-[#FAFAF8] hover:bg-[#E7E7E2] text-[#081F2D] text-xs font-semibold rounded-md border border-[#E7E7E2] transition"
                  >
                    {isBn ? "বার্ষিক অডিট রিপোর্ট" : "Annual Audited Reports"}
                  </Link>
                </div>
              </div>

              {/* Evidence Flow Card */}
              <div className="bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] p-8 shadow-xs">
                <h4 className="text-xs font-mono font-bold text-[#081F2D] uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>{isBn ? "তথ্য প্রমাণ কাঠামো" : "EVIDENCE ARCHITECTURE"}</span>
                  <span className="text-[#FF6B35]">LIVE STANDARD</span>
                </h4>

                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border border-[#E7E7E2]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#081F2D]">{isBn ? "আর্থিক সততা" : "Financial Integrity"}</span>
                      <span className="text-emerald-700 font-mono font-bold">100% Audited</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isBn ? "চার্টার্ড অ্যাকাউন্ট্যান্ট দ্বারা বার্ষিক নিরীক্ষিত আর্থিক বিবরণী।" : "Statutory audited financials verified by registered audit firms."}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[#E7E7E2]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#081F2D]">{isBn ? "মাঠপর্যায়ের তথ্য সত্যতা" : "Field Truthfulness"}</span>
                      <span className="text-sky-700 font-mono font-bold">Zero Fabrication</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isBn ? "কোনো কাল্পনিক সুবিধাভোগীর সংখ্যা বা অনুমানের স্থান নেই।" : "No fabricated numbers or exaggerated claims are permitted in any public release."}
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-[#E7E7E2]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-[#081F2D]">{isBn ? "ডিজিটাল প্রমাণপত্র" : "Digital Traceability"}</span>
                      <span className="text-indigo-700 font-mono font-bold">Cryptographic</span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {isBn ? "প্রতিটি রসিদ ও চুক্তিপত্র কিউআর ও ইউনিক আইডি দ্বারা যাচাইযোগ্য।" : "Immutable cryptographic hashes anchor issued receipts and legal agreements."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 07 — DIGITAL BACKBONE
            =================================================================== */}
        <section className="bg-[#0B2B43] text-white py-20 md:py-28">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "ডিজিটাল ভিত্তি" : "RESPONSIBLE INFRASTRUCTURE"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 mb-4 leading-tight">
                <span className="block font-hind text-2xl sm:text-3xl font-semibold text-stone-300 mb-2">
                  {isBn ? "একটি ডিজিটাল ব্যাকবোন সংবলিত মানবিক প্রতিষ্ঠান" : "A foundation with a digital backbone."}
                </span>
                <span>{isBn ? "প্রযুক্তি ও মানবিক প্রভাব—সংযুক্ত, তবে গুলিয়ে ফেলা নয়।" : "Impact and technology — connected, not confused."}</span>
              </h2>
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-normal">
                {isBn
                  ? "প্রযুক্তি আমাদের মানবিক লক্ষ্যকে পরিচালনা করে না; বরং স্বচ্ছতা, সমন্বয়, নিরপেক্ষ নিরীক্ষা এবং দ্রুত সাড়া দেওয়ার জন্য এটি এক অপরিহার্য সহায়ক অবকাঠামো হিসেবে কাজ করে।"
                  : "Responsible technology serves the humanitarian mission—enabling coordination, cryptographic verification, rigorous evidence, and seamless compliance."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
                <ShieldCheck width={24} height={24} className="text-[#FF6B35] mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  {isBn ? "১৮টি ম্যানেজমেন্ট কনসোল" : "18 Governed Consoles"}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isBn ? "আইএএম, অর্থ, সম্পত্তি, সুরক্ষা এবং অডিটের জন্য সুনির্দিষ্ট কনসোল।" : "Unified operational governance across finance, workforce, and document issuance."}
                </p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
                <Building width={24} height={24} className="text-[#FF6B35] mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  GrihostiOS
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isBn ? "সম্পত্তি, ভূমি, ইজারা ও কৃষি চুক্তিপত্র পরিচালনার স্বয়ংসম্পূর্ণ সিস্টেম।" : "Enterprise operating system for property, land, tenancy, and rural joint ventures."}
                </p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
                <Folder width={24} height={24} className="text-[#FF6B35] mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  {isBn ? "প্রকল্প স্বায়ত্তশাসন" : "Project Isolation"}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isBn ? "প্রতিটি মাঠপর্যায়ের প্রকল্পের স্বাধীন হিসাব ও নথি ব্যবস্থাপনা।" : "Multi-project financial isolation with institutional consolidated governance."}
                </p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xs">
                <Spark width={24} height={24} className="text-[#FF6B35] mb-3" />
                <h4 className="text-base font-bold text-white mb-1">
                  {isBn ? "নৈতিক এআই সহায়তা" : "Governed Agent Model"}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {isBn ? "সর্বোচ্চ লেভেল-৩ সহায়ক এজেন্ট; কোনো আইনি বা আর্থিক চূড়ান্ত সিদ্ধান্ত মানুষের বাইরে নয়।" : "Level-3 autonomous ceiling. Critical decisions strictly require human sign-off."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 08 — STORIES & FIELD DISPATCHES
            =================================================================== */}
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "মাঠপর্যায়ের বার্তা" : "STORIES & DISPATCHES"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-3">
                {isBn ? "মানুষ ও পরিবর্তনের গল্প" : "Voices From the Field"}
              </h2>
              <p className="text-sm md:text-base text-[#5A6B75] leading-relaxed max-w-2xl">
                {isBn
                  ? "সস্তা আবেগের প্রদর্শন বা দারিদ্র্য প্রদর্শন নয়—আমরা তুলে ধরি মানুষের মর্যাদা, সক্ষমতা ও এগিয়ে চলার বাস্তব অভিজ্ঞতা।"
                  : "Honoring dignity, resilience, and personal initiative without staged melodrama or exploitative stereotypes."}
              </p>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B35] hover:text-[#e05a28] uppercase tracking-wider font-mono"
            >
              <span>{isBn ? "সকল সংবাদ ও ডিসপ্যাচ" : "All Field Dispatches"}</span>
              <ArrowRight width={14} height={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-xl border border-[#E7E7E2] overflow-hidden bg-white hover:border-[#FF6B35]/40 transition-all shadow-xs flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/media/literacy-teacher.jpg"
                    alt="Digital Literacy Labs in Community Schools"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#081F2D]/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    Dhaka · Rampura Desk
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#081F2D] mb-2 group-hover:text-[#FF6B35] transition-colors">
                    {isBn ? "ডিজিটাল লার্নিং ল্যাবের অভিজ্ঞতা" : "Digital Literacy Labs in Community Schools"}
                  </h3>
                  <p className="text-xs text-[#5A6B75] leading-relaxed">
                    {isBn
                      ? "কম্পিউটার ও মৌলিক কোডিং শিক্ষার মাধ্যমে তৃণমূলের শিক্ষার্থীরা কীভাবে আধুনিক তথ্য প্রযুক্তির সুযোগ গ্রহণ করছে।"
                      : "How local youth in suburban hubs are leveraging foundational computer access to bridge educational disparities."}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#E7E7E2] text-xs font-semibold text-[#081F2D] flex items-center justify-between">
                  <span className="font-mono text-stone-500 text-[11px]">Oct 2026</span>
                  <Link href="/news" className="text-[#FF6B35] hover:underline flex items-center gap-1 font-mono text-xs">
                    <span>{isBn ? "বিস্তারিত পড়ুন" : "Read Dispatch"}</span>
                    <NavArrowRight width={12} height={12} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E7E7E2] overflow-hidden bg-white hover:border-[#FF6B35]/40 transition-all shadow-xs flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/media/community-leader.jpg"
                    alt="Shared Agricultural Revenue and Soil Health"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#081F2D]/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    Rural Hub · Bogura
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#081F2D] mb-2 group-hover:text-[#FF6B35] transition-colors">
                    {isBn ? "কৃষি অংশীদারি ও সমবায় নেতৃত্বের মডেল" : "Shared Agricultural Revenue and Cooperative Leadership"}
                  </h3>
                  <p className="text-xs text-[#5A6B75] leading-relaxed">
                    {isBn
                      ? "বরগা ও ফসলের অংশীদারিত্বে ন্যায্য চুক্তি কীভাবে কৃষকের আয় ও বিনিয়োগের নিরাপত্তা নিশ্চিত করেছে।"
                      : "Examining fair tenancy agreements and crop-share structures under the GrihostiOS operational system."}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#E7E7E2] text-xs font-semibold text-[#081F2D] flex items-center justify-between">
                  <span className="font-mono text-stone-500 text-[11px]">Sep 2026</span>
                  <Link href="/news" className="text-[#FF6B35] hover:underline flex items-center gap-1 font-mono text-xs">
                    <span>{isBn ? "বিস্তারিত পড়ুন" : "Read Dispatch"}</span>
                    <NavArrowRight width={12} height={12} />
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E7E7E2] overflow-hidden bg-white hover:border-[#FF6B35]/40 transition-all shadow-xs flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="/media/coastal-farmer.jpg"
                    alt="Desalination and Community Water Infrastructure"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#081F2D]/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
                    Coastal Belt · Satkhira
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#081F2D] mb-2 group-hover:text-[#FF6B35] transition-colors">
                    {isBn ? "উপকূলীয় কৃষির স্থায়িত্ব ও টেকসই ফসল" : "Coastal Agro-Resilience and Crop Adaptation"}
                  </h3>
                  <p className="text-xs text-[#5A6B75] leading-relaxed">
                    {isBn
                      ? "উপকূলীয় গ্রামে লবণাক্ততা সহনশীল ধান উৎপাদন ও নিরাপদ পানি সুরক্ষায় নারী কৃষকদের অগ্রণী ভূমিকা।"
                      : "Demonstrating saline-tolerant crop harvesting and local solar-powered water infrastructure stewardship."}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#E7E7E2] text-xs font-semibold text-[#081F2D] flex items-center justify-between">
                  <span className="font-mono text-stone-500 text-[11px]">Aug 2026</span>
                  <Link href="/news" className="text-[#FF6B35] hover:underline flex items-center gap-1 font-mono text-xs">
                    <span>{isBn ? "বিস্তারিত পড়ুন" : "Read Dispatch"}</span>
                    <NavArrowRight width={12} height={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 09 — PROJECTS (Multi-Project Governance)
            =================================================================== */}
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="bg-[#081F2D] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "প্রকল্প আর্কিটেকচার" : "MULTI-PROJECT ARCHITECTURE"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-2 mb-6 leading-tight">
                {isBn ? "স্বতন্ত্র প্রকল্প · সমন্বিত প্রাতিষ্ঠানিক মানদণ্ড" : "Autonomous Field Projects. Unified Governance."}
              </h2>
              <p className="text-base text-white/80 leading-relaxed mb-8 font-normal">
                {isBn
                  ? "সোহেল তাসনীম ফাউন্ডেশনের প্রতিটি প্রকল্পের রয়েছে স্বতন্ত্র বাজেট, স্টেকহোল্ডার নেটওয়ার্ক, ভূমিকা এবং হিসাবরক্ষণ। তবে সবগুলোই এসটিএফএল প্ল্যাটফর্মের অভিন্ন সততা ও সুরক্ষা নীতির আওতাধীন।"
                  : "Each field initiative operates with its own chart of accounts, local partner scope, and operational metrics—allowing community flexibility while maintaining strict portfolio transparency."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/projects"
                  className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e05a28] text-white font-semibold text-xs rounded-md transition shadow-xs flex items-center gap-2"
                >
                  <span>{isBn ? "প্রকল্প ডিরেক্টরি দেখুন" : "Explore Project Directory"}</span>
                  <ArrowRight width={14} height={14} />
                </Link>
                <Link
                  href="/admin/projects"
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-md border border-white/20 transition"
                >
                  {isBn ? "প্রকল্প কন্ট্রোল কনসোল" : "Project Control Console"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 10 — GET INVOLVED (4 Action Pathways)
            =================================================================== */}
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
              {isBn ? "অংশগ্রহণ ও অংশীদারিত্ব" : "PARTICIPATE & MULTIPLY"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-4">
              {isBn ? "আপনি কীভাবে যুক্ত হতে পারেন" : "Four Pathways to Participate"}
            </h2>
            <p className="text-sm md:text-base text-[#5A6B75] leading-relaxed">
              {isBn
                ? "আমাদের মিশনকে এগিয়ে নিতে মেধা, সময়, সম্পদ বা প্রাতিষ্ঠানিক সহযোগিতায় এগিয়ে আসুন।"
                : "Whether investing financial resources, volunteer expertise, or institutional partnership—every contribution has a verified home."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Donate */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <Heart width={28} height={28} className="text-[#FF6B35] mb-4" />
                <h3 className="text-xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "দান ও অনুদান" : "Donate"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-2 mb-4">
                  {isBn
                    ? "সাধারণ অনুদান ও স্থায়ী সমাজকল্যাণ তহবিলে আপনার অবদান সরাসরি শিক্ষা ও স্বাস্থ্যসেবায় ব্যবহৃত হয়।"
                    : "Direct capital deployment toward verified education scholarships, primary healthcare, and permanent community endowments."}
                </p>
              </div>
              <Link
                href="/donate"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6B35] hover:text-[#e05a28] uppercase tracking-wider font-mono pt-4 border-t border-[#E7E7E2]"
              >
                <span>{isBn ? "অনুদান তথ্য দেখুন" : "Donate Now"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>

            {/* Volunteer */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <Group width={28} height={28} className="text-[#0B2B43] mb-4" />
                <h3 className="text-xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "স্বেচ্ছাসেবা" : "Volunteer Network"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-2 mb-4">
                  {isBn
                    ? "চিকিৎসক, শিক্ষক, প্রকৌশলী ও সমাজকর্মীদের সমন্বয়ে আমাদের দেশব্যাপী স্বেচ্ছাসেবী নেটওয়ার্ক।"
                    : "Join verified task groups delivering field health camps, tutoring sessions, and emergency dispatch relief."}
                </p>
              </div>
              <Link
                href="/volunteer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2B43] hover:text-[#FF6B35] uppercase tracking-wider font-mono pt-4 border-t border-[#E7E7E2]"
              >
                <span>{isBn ? "নিবন্ধন করুন" : "Join Network"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>

            {/* Partner */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <Building width={28} height={28} className="text-[#0B2B43] mb-4" />
                <h3 className="text-xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "অংশীদারিত্ব" : "Partner With Us"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-2 mb-4">
                  {isBn
                    ? "বিশ্ববিদ্যালয়, কর্পোরেট সিএসআর এবং স্থানীয় সমাজকল্যাণ সংস্থাগুলোর সাথে যৌথ কর্মসূচি পরিচালনা।"
                    : "Structured institutional synergies with research centers, corporate CSR wings, and regional NGOs."}
                </p>
              </div>
              <Link
                href="/partner"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2B43] hover:text-[#FF6B35] uppercase tracking-wider font-mono pt-4 border-t border-[#E7E7E2]"
              >
                <span>{isBn ? "প্রস্তাব পাঠান" : "Partner Inquiries"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>

            {/* Careers */}
            <div className="p-8 bg-[#FAFAF8] rounded-2xl border border-[#E7E7E2] flex flex-col justify-between">
              <div>
                <User width={28} height={28} className="text-[#0B2B43] mb-4" />
                <h3 className="text-xl font-bold text-[#081F2D] mb-1">
                  {isBn ? "ক্যারিয়ার" : "Careers & Positions"}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-2 mb-4">
                  {isBn
                    ? "উচ্চ পেশাদারিত্ব এবং মানবিক মূল্যবোধসম্পন্ন মানুষদের জন্য এসটিএফএলে ফুল-টাইম ও প্রজেক্ট-ভিত্তিক কর্মসংস্থান।"
                    : "Work on institutional problems with high dignity, competitive standards, and clear accountability."}
                </p>
              </div>
              <Link
                href="/careers"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2B43] hover:text-[#FF6B35] uppercase tracking-wider font-mono pt-4 border-t border-[#E7E7E2]"
              >
                <span>{isBn ? "নিয়োগ বিজ্ঞপ্তি" : "View Openings"}</span>
                <NavArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 11 — GOVERNANCE & TRUST
            =================================================================== */}
        <section className="py-20 md:py-28 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#E7E7E2]">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase">
                {isBn ? "আইনগত সম্মতি ও বিশ্বাসযোগ্যতা" : "GOVERNANCE & TRUST"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#081F2D] tracking-tight mt-2 mb-6">
                {isBn ? "উন্মুক্ততা ও প্রাতিষ্ঠানিক সততা" : "Open Governance & Audited Integrity"}
              </h2>
              <p className="text-sm md:text-base text-stone-700 leading-relaxed mb-6 font-normal">
                {isBn
                  ? "সোহেল তাসনীম ফাউন্ডেশনের প্রাতিষ্ঠানিক সনদ, পরিচালনা পর্ষদের নীতিমালা, শিশু ও দুর্বল জনগোষ্ঠীর সুরক্ষা নীতি এবং আর্থিক অডিট রিপোর্ট সবার জন্য সর্বদা প্রকাশ্য।"
                  : "Trust is not assumed; it is continually proven. From transparent whistleblower channels to cryptographic document verification, every aspect of our governance is open to scrutiny."}
              </p>

              <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#081F2D]">
                <Link href="/reports" className="p-3 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:border-[#081F2D] transition flex items-center gap-2">
                  <Page width={16} height={16} className="text-[#FF6B35]" />
                  <span>{isBn ? "বার্ষিক অডিট রিপোর্টসমূহ" : "Annual Audit Reports"}</span>
                </Link>
                <Link href="/safeguarding" className="p-3 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:border-[#081F2D] transition flex items-center gap-2">
                  <ShieldCheck width={16} height={16} className="text-[#FF6B35]" />
                  <span>{isBn ? "সুরক্ষা নীতিমালা (Safeguarding)" : "Safeguarding Policy"}</span>
                </Link>
                <Link href="/privacy" className="p-3 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:border-[#081F2D] transition flex items-center gap-2">
                  <ShieldCheck width={16} height={16} className="text-[#FF6B35]" />
                  <span>{isBn ? "গোপনীয়তা রক্ষা নীতি" : "Privacy & Data Policy"}</span>
                </Link>
                <Link href={`${VERIFY_ORIGIN}/verify`} className="p-3 bg-[#FAFAF8] rounded border border-[#E7E7E2] hover:border-[#081F2D] transition flex items-center gap-2">
                  <CheckCircle width={16} height={16} className="text-[#FF6B35]" />
                  <span>{isBn ? "নথি যাচাইকরণ পোর্টাল" : "Public Verification"}</span>
                </Link>
              </div>
            </div>

            <div className="bg-[#081F2D] text-white rounded-2xl p-8 sm:p-10 border border-[#0B2B43]">
              <div className="text-xs font-mono text-[#FF6B35] font-bold uppercase tracking-wider mb-2">
                VERIFIED HEADQUARTERS
              </div>
              <h4 className="text-2xl font-bold mb-4">SohaelTasneem Foundation</h4>
              <p className="text-sm text-stone-300 leading-relaxed mb-6">
                STFL House, 173 E Ullan Road, W Rampura, Dhaka 1217, Bangladesh.<br />
                Official Hotline: +88018410506411<br />
                Institutional Email: hi@stflbd.email
              </p>
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-stone-400">
                <span>Canonical Web: stflbd.org</span>
                <span>•</span>
                <span>Established 2001</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 12 — FINAL CTA
            =================================================================== */}
        <section className="bg-white py-24 md:py-32 text-center">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <span className="text-xs font-mono font-bold text-[#FF6B35] tracking-widest uppercase mb-4 block">
              {isBn ? "ভবিষ্যতের ডাক" : "OUR INVITATION"}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#081F2D] tracking-tight mb-6">
              {isBn ? "একটি অর্থপূর্ণ ভবিষ্যৎ গড়ি।" : "Let's build something that matters."}
            </h2>
            <p className="text-base sm:text-lg text-[#5A6B75] leading-relaxed mb-10 max-w-xl mx-auto font-normal">
              {isBn
                ? "মানব মর্যাদা, বাস্তব পদক্ষেপ ও পরিমাপযোগ্য পরিবর্তনের সাথে যুক্ত হয়ে টেকসই বাংলাদেশ বিনির্মাণে ভূমিকা রাখুন।"
                : "Join the SohaelTasneem Foundation in building lasting opportunity, human dignity, and verified community transformation."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/donate"
                className="w-full sm:w-auto px-8 py-4 bg-[#FF6B35] hover:bg-[#e05a28] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>{isBn ? "আমাদের কর্মসূচিতে সহায়তা করুন" : "Support Our Programs"}</span>
                <ArrowRight width={16} height={16} />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 bg-[#081F2D] hover:bg-[#0B2B43] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>{isBn ? "আমাদের সাথে যোগাযোগ করুন" : "Get in Touch with HQ"}</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
