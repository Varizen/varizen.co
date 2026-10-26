"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Cpu,
  Spark,
  Globe,
  Search,
  NavArrowRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Download,
  Eye,
  RefreshDouble,
  Folder,
  Send,
  Pin,
  Lock,
  Key,
  User,
  Page,
  BookmarkBook,
  Medal,
  Terminal,
  ChatBubble,
  Settings, Database } from "iconoir-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { getInitiativeBySlug } from "@/src/lib/initiativesRegistry";

export default function QiMAIInitiativePage() {
  const { lang, setLang } = useLanguage();
  const isBn = lang === "bn";
  const project = getInitiativeBySlug("qimai");

  // Mode Selection: General vs Professional Mode
  const [viewMode, setViewMode] = useState<"GENERAL" | "PROFESSIONAL">("PROFESSIONAL");
  const [activeWorkspace, setActiveWorkspace] = useState<"HAKIM_SARKER_ARCHIVE" | "SYLLABUS_DEMO" | "POLICY_DEMO">("HAKIM_SARKER_ARCHIVE");

  // Interactive Playground State
  const [queryInput, setQueryInput] = useState<string>(
    isBn
      ? "ঢাকা বিশ্ববিদ্যালয়ের আইএসডব্লিউআর এ ভিকটিমোলজি মাস্টার্স কোর্স কীভাবে পরিচালিত হতো?"
      : "Explain the curriculum framework of Victimology & Restorative Justice pioneered by Prof. Dr. Abdul Hakim Sarker."
  );

  const [activePillar, setActivePillar] = useState<number>(0);

  const playgroundData = {
    HAKIM_SARKER_ARCHIVE: {
      name: "Hakim Sarker Knowledge Archive (Verified Corpus)",
      badge: "Historical Academic Research",
      questionEn: "Explain the curriculum framework of Victimology & Restorative Justice pioneered by Prof. Dr. Abdul Hakim Sarker.",
      questionBn: "ঢাকা বিশ্ববিদ্যালয়ের আইএসডব্লিউআর এ ভিকটিমোলজি মাস্টার্স কোর্স কীভাবে পরিচালিত হতো?",
      answerEn:
        "The Victimology and Restorative Justice Master's curriculum designed by Professor Dr. Abdul Hakim Sarker at ISWR, University of Dhaka, integrated three core modules: (1) Victimological Theory and Structural Vulnerability, (2) Restorative Mediation and Alternative Dispute Resolution (Salish modernization), and (3) Clinical Psychosocial Support for institutional crime victims. The program emphasized non-custodial rehabilitation over punitive incarceration.",
      answerBn:
        "অধ্যাপক ড. আব্দুল হাকিম সরকার কর্তৃক প্রণীত ভিকটিমোলজি ও রেস্টোরেটিভ জাস্টিস মাস্টার্স পাঠ্যক্রমে তিনটি মূল ধারা সমন্বিত ছিল: (১) ভিকটিমোলজিক্যাল থিওরি ও কাঠামোগত দুর্বলতা, (২) ঐতিহ্যবাহী সালিশকে আধুনিক রূপ দিয়ে পুনরুদ্ধারমূলক বিরোধ নিষ্পত্তি, এবং (৩) অপরাধের শিকার ব্যক্তিদের ক্লিনিকাল মনস্তাত্ত্বিক সহায়তা। এই কোর্সে শাস্তিমূলক ব্যবস্থার পরিবর্তে সংশোধনমূলক সামাজিক পুনর্বাসনের ওপর গুরুত্ব দেওয়া হয়।",
      sourceDoc: "ISWR Academic Council Proceedings: Master's in Victimology (Ref: ISWR-DU-VRJ-2014)",
      chunksRetrieved: 4,
      confidence: "99.4%",
      latency: "284ms",
      citations: [
        { title: "Restorative Justice in Bangladesh: Structural Functional Analysis", page: "Section 3.2, pp. 14–22", author: "Prof. Dr. A. H. Sarker (2014)" },
        { title: "Probation and Non-Custodial Sanctions in Bangladeshi Jurisprudence", page: "Chapter 5, pp. 67–74", author: "ISWR Monograph Series (1989)" }
      ]
    },
    SYLLABUS_DEMO: {
      name: "Higher Education Course Syllabus (Social Policy 401)",
      badge: "Curriculum Ingestion Demo",
      questionEn: "Generate a 4-week lecture module on community-based poverty alleviation in agrarian Bangladesh.",
      questionBn: "গ্রামীণ বাংলাদেশে সমাজভিত্তিক দারিদ্র্য বিমোচনের ওপর ৪ সপ্তাহের লেকচার মডিউল তৈরি করুন।",
      answerEn:
        "Week 1: Agrarian land tenure systems and seasonal crop-share contracts (Barga/Adhi). Week 2: Micro-welfare solidarity and community-led tube-well/infrastructure management. Week 3: Gender equity in rural craft cooperatives and maternal nutrition. Week 4: Policy evaluation and participatory rural appraisal (PRA) metrics.",
      answerBn:
        "১ম সপ্তাহ: গ্রামীণ ভূমি ব্যবস্থা ও মৌসুমি ফসল-ভাগ চুক্তি (বর্গা/আধি)। ২য় সপ্তাহ: গ্রামীণ যৌথ নিরাপত্তা ও নিরাপদ পানি/অবকাঠামো ব্যবস্থাপনা। ৩য় সপ্তাহ: গ্রামীণ নারী সমবায় ও পুষ্টি উন্নয়ন। ৪র্থ সপ্তাহ: অংশগ্রহণমূলক গ্রামীণ সমীক্ষা (পিআরএ) ও সামাজিক নীতি মূল্যায়ন।",
      sourceDoc: "Curriculum Standard: Social Welfare & Community Development (HEC-BD-401)",
      chunksRetrieved: 6,
      confidence: "98.1%",
      latency: "312ms",
      citations: [
        { title: "Social Welfare Administration in Developing Countries", page: "Module 2, pp. 112–130", author: "UGC / ISWR Syllabus (1997)" },
        { title: "Community Intervention & Fieldwork Guidelines", page: "Unit 4", author: "BCSWE Standards (2005)" }
      ]
    },
    POLICY_DEMO: {
      name: "Institutional Safeguard Policy (Padma Bridge Infrastructure)",
      badge: "Mega-Infrastructure Dossier",
      questionEn: "What compliance standards were enforced for displaced riverbank families during resettlement?",
      questionBn: "পদ্মা সেতু প্রকল্পে নদী তীরবর্তী ক্ষতিগ্রস্ত পরিবারের জন্য কী কী পুনর্বাসন শর্ত নিশ্চিত করা হয়েছিল?",
      answerEn:
        "Under the Safeguard Compliance framework supervised by Prof. Dr. Abdul Hakim Sarker (World Bank / GOB), displaced families received: (1) replacement-cost compensation for lost homestead plots, (2) specialized civic resettlement villages equipped with schools and clinics, and (3) livelihood retraining stipends for river fishermen and subsistence sharecroppers.",
      answerBn:
        "অধ্যাপক ড. আব্দুল হাকিম সরকার কর্তৃক নিরীক্ষিত কমপ্লায়েন্স নীতিমালায় নদী ভাঙন ও ভূমি অধিগ্রহণে ক্ষতিগ্রস্ত পরিবারের জন্য নিশ্চিত করা হয়েছিল: (১) হারানো ভিটা জমির জন্য প্রতিস্থাপন মূল্যে আর্থিক ক্ষতিপূরণ, (২) স্কুল, স্বাস্থ্যকেন্দ্র ও বিদ্যুৎ সুবিধাসম্পন্ন আধুনিক পুনর্বাসন পল্লি, এবং (৩) জেলে ও বর্গাচাষীদের বিকল্প কর্মসংস্থান ভাতা ও প্রশিক্ষণ।",
      sourceDoc: "Padma Multipurpose Bridge Project: Environmental & Social Safeguard Audit",
      year: "2010",
      chunksRetrieved: 5,
      confidence: "99.8%",
      latency: "260ms",
      citations: [
        { title: "Social Safeguard Compliance Verification Report", page: "Section 4.1, Resettlement Action Plan", author: "PMBP Social Sciences Team (2010)" }
      ]
    }
  };

  const currentPlayground = playgroundData[activeWorkspace];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#F7F9FC] font-sans selection:bg-[#00D4FF] selection:text-[#0D1117]">
      {/* Top Engineering Header */}
      <div className="bg-[#080B10] border-b border-white/10 text-[11px] font-mono text-stone-400 py-1.5 px-4 sm:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[#00D4FF] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
              <span>QiM-AI 2.1 RAG ENGINE</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-stone-300">Knowledge In. Context Understood. Intelligence Out.</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-emerald-400">● Production Multi-Tenant Architecture</span>
            <span className="text-white/20">|</span>
            <span className="text-stone-400">pgvector · PostgreSQL · Zero Private Leakage</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0D1117]/95 backdrop-blur-md border-b border-[#0066FF]/30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/initiatives" className="text-stone-400 hover:text-white transition-colors p-1" title="Back to Initiatives">
                <NavArrowRight width={16} height={16} className="rotate-180" />
              </Link>
              <div className="h-6 w-px bg-white/15" />
              <Link href="https://qimai.codes/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group">
                <Image
                  src="/media/qimai-symbol.svg"
                  alt="QiM-AI 2.1 Q Mark Symbol"
                  width={38}
                  height={38}
                  className="h-9 w-auto object-contain"
                />
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-extrabold text-white text-lg tracking-tight">QIM</span>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#0066FF] text-white">AI 2.1</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00D4FF] tracking-wider block mt-0.5">
                    qimai.codes
                  </span>
                </div>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="hidden md:flex items-center gap-5 text-xs font-mono">
              <a href="#playground" className="text-stone-300 hover:text-[#00D4FF] transition-colors">{isBn ? "লাইভ প্লেগ্রাউন্ড" : "Live Playground"}</a>
              <a href="#pillars" className="text-stone-300 hover:text-[#00D4FF] transition-colors">{isBn ? "প্রোডাক্ট পিলার" : "Pillars"}</a>
              <a href="#rag" className="text-stone-300 hover:text-[#00D4FF] transition-colors">{isBn ? "আরএজি আর্কিটেকচার" : "RAG Pipeline"}</a>
              <a href="#labs" className="text-stone-300 hover:text-[#00D4FF] transition-colors">{isBn ? "হাকিম সরকার ল্যাব" : "Hakim Sarker Lab"}</a>
              <a href="#pricing" className="text-stone-300 hover:text-[#00D4FF] transition-colors">{isBn ? "প্রাইসিং" : "Pricing"}</a>
            </div>

            {/* Mode & Action Controls */}
            <div className="flex items-center gap-3">
              {/* Language Switch */}
              <button
                onClick={() => setLang(isBn ? "en" : "bn")}
                className="text-[11px] font-mono px-2.5 py-1 border border-white/20 hover:border-[#00D4FF] text-stone-300 transition-colors"
              >
                {isBn ? "EN" : "বাংলা"}
              </button>

              <a
                href="https://qimai.codes/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold transition-colors shadow-lg shadow-blue-500/20"
              >
                <span>qimai.codes</span>
                <Globe width={13} height={13} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0D1117] via-[#09101C] to-[#060A12] py-16 md:py-24">
        {/* Subtle Ambient Background Knowledge Field */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,102,255,0.18),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0066FF]/10 border border-[#0066FF]/30 text-[#00D4FF] text-xs font-mono">
              <Spark width={12} height={12} />
              <span>Smarter Intelligence. Better Tomorrow.</span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {isBn
                ? "আপনার জ্ঞান। আপনার প্রসঙ্গ। আপনার এআই।"
                : "Your Knowledge. Your Context. Your Intelligence."}
            </h1>

            <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
              {isBn
                ? "কিউআইএম এআই ২.১ হলো এমন একটি নলেজ ইন্টেলিজেন্স প্ল্যাটফর্ম যা সাধারণ চ্যাটবট নয়; এটি আপনার বই, সিলেবাস ও নথিপত্রকে সম্পূর্ণ বিশ্বাসযোগ্য, সঠিক রেফারেন্সযুক্ত ইন্টারেক্টিভ টিউটরে রূপান্তর করে।"
                : "QiM-AI 2.1 is an enterprise knowledge layer that transforms syllabi, academic archives, and institutional repositories into grounded, traceable AI tutors with deterministic citations."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href="#playground"
                className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <Terminal width={14} height={14} />
                <span>{isBn ? "লাইভ প্লেগ্রাউন্ড পরীক্ষা করুন" : "Test Live Playground"}</span>
              </a>
              <a
                href="#rag"
                className="px-6 py-3 border border-white/20 hover:border-[#00D4FF] hover:bg-white/[0.02] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-2"
              >
                <span>{isBn ? "আরএজি আর্কিটেকচার দেখুন" : "Explore RAG Engine"}</span>
                <NavArrowRight width={14} height={14} />
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 text-center border-t border-white/10 mt-10">
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#00D4FF]">&lt; 350ms</div>
                <div className="text-[11px] font-mono text-stone-400 mt-1">{isBn ? "ভেক্টর রিট্রিভাল লেটেন্সি" : "Retrieval Latency"}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <div className="text-xl sm:text-2xl font-mono font-bold text-white">100%</div>
                <div className="text-[11px] font-mono text-stone-400 mt-1">{isBn ? "সাইটেশন সঠিকতা" : "Citation Fidelity"}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">pgvector</div>
                <div className="text-[11px] font-mono text-stone-400 mt-1">{isBn ? "পোস্টগ্রেস ডাটাবেজ" : "PostgreSQL Vector Store"}</div>
              </div>
              <div className="p-3 bg-white/[0.02] border border-white/5">
                <div className="text-xl sm:text-2xl font-mono font-bold text-[#60A5FA]">Isolated</div>
                <div className="text-[11px] font-mono text-stone-400 mt-1">{isBn ? "মাল্টি-টেন্যান্ট নিরাপত্তা" : "Multi-Tenant Privacy"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PLAYGROUND (General vs Professional Mode) */}
      <section id="playground" className="py-16 bg-[#080C14] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-xs font-mono text-[#00D4FF] uppercase tracking-wider flex items-center gap-1.5">
                <Terminal width={14} height={14} />
                <span>{isBn ? "ইন্টারেক্টিভ এআই টেস্টবেড" : "Interactive AI Testbed"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {isBn ? "কিউআইএম এআই ২.১ প্লেগ্রাউন্ড" : "QiM-AI 2.1 Live Experience"}
              </h2>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 p-1 bg-[#0D1117] border border-white/15 text-xs font-mono">
              <button
                onClick={() => setViewMode("GENERAL")}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === "GENERAL"
                    ? "bg-[#0066FF] text-white font-bold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {isBn ? "জেনারেল মোড (সহজ)" : "General Mode (Simple)"}
              </button>
              <button
                onClick={() => setViewMode("PROFESSIONAL")}
                className={`px-3 py-1.5 transition-colors ${
                  viewMode === "PROFESSIONAL"
                    ? "bg-[#0066FF] text-white font-bold"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {isBn ? "প্রফেশনাল মোড (গবেষক)" : "Professional Mode (Workstation)"}
              </button>
            </div>
          </div>

          {/* Corpus Selector */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs font-mono">
            <span className="text-stone-400">{isBn ? "নলেজ কর্পাস নির্বাচন:" : "Select Grounded Corpus:"}</span>
            {[
              { key: "HAKIM_SARKER_ARCHIVE", label: isBn ? "হাকিম সরকার একাডেমিক আর্কাইভ" : "Hakim Sarker Archive" },
              { key: "SYLLABUS_DEMO", label: isBn ? "সোশ্যাল পলিসি সিলেবাস" : "Higher Ed Syllabus (401)" },
              { key: "POLICY_DEMO", label: isBn ? "পদ্মা সেতু সেফগার্ড পলিসি" : "Infrastructure Safeguards" }
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => {
                  setActiveWorkspace(c.key as any);
                  const p = playgroundData[c.key as keyof typeof playgroundData];
                  setQueryInput(isBn ? p.questionBn : p.questionEn);
                }}
                className={`px-3 py-1.5 border transition-colors ${
                  activeWorkspace === c.key
                    ? "bg-white/10 border-[#00D4FF] text-white font-bold"
                    : "border-white/10 text-stone-400 hover:border-white/30"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* WORKSTATION VIEW (3 COLUMNS in Professional Mode, Centered in General Mode) */}
          {viewMode === "PROFESSIONAL" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-[#0D1117] border border-white/15 p-4 rounded-none min-h-[520px]">
              {/* Left Column: Knowledge Sources & Tenant Context */}
              <div className="lg:col-span-3 border-r border-white/10 pr-4 space-y-4 text-xs font-mono">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Folder width={13} height={13} className="text-[#00D4FF]" />
                  <span>{isBn ? "সংযুক্ত জ্ঞান উৎস" : "Active Ingested Sources"}</span>
                </div>

                <div className="p-3 bg-white/[0.02] border border-white/10 space-y-1">
                  <div className="text-white font-bold truncate">{currentPlayground.name}</div>
                  <div className="text-[10px] text-blue-400">{currentPlayground.badge}</div>
                  <div className="text-[10px] text-stone-500 pt-1">
                    {currentPlayground.chunksRetrieved} chunks indexed · pgvector
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">{isBn ? "মডেল কনফিগারেশন:" : "Model Context:"}</div>
                  <div className="flex items-center justify-between text-[11px] text-stone-300 p-2 bg-white/[0.01] border border-white/5">
                    <span>Engine:</span>
                    <span className="text-[#00D4FF]">QiM-RAG v2.1</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-300 p-2 bg-white/[0.01] border border-white/5">
                    <span>Confidence:</span>
                    <span className="text-emerald-400">{currentPlayground.confidence}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-300 p-2 bg-white/[0.01] border border-white/5">
                    <span>Retrieval Time:</span>
                    <span className="text-white">{currentPlayground.latency}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-950/20 border border-blue-900/40 text-[10px] text-blue-300 leading-snug">
                  <span className="font-bold">Provenance Guarantee:</span> Answers strictly bounded to ingested vector chunks. Zero out-of-scope fabrication.
                </div>
              </div>

              {/* Middle Column: Chat & Synthesis Stream */}
              <div className="lg:col-span-6 px-2 lg:px-4 flex flex-col justify-between space-y-4">
                <div className="space-y-4 overflow-y-auto max-h-[400px]">
                  {/* User Query Message */}
                  <div className="p-3 bg-[#0066FF]/15 border border-[#0066FF]/30 text-xs font-mono text-white rounded-none">
                    <div className="text-[10px] text-[#00D4FF] mb-1 font-bold">USER INQUIRY</div>
                    <div>{isBn ? currentPlayground.questionBn : currentPlayground.questionEn}</div>
                  </div>

                  {/* AI Grounded Synthesis */}
                  <div className="p-4 bg-white/[0.03] border border-white/10 text-xs font-sans text-stone-200 leading-relaxed space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 border-b border-white/10 pb-1.5">
                      <span className="flex items-center gap-1 text-[#00D4FF] font-bold">
                        <Spark width={12} height={12} />
                        <span>QIM AI 2.1 SYNTHESIS</span>
                      </span>
                      <span className="text-emerald-400">Grounded Verified</span>
                    </div>
                    <p>{isBn ? currentPlayground.answerBn : currentPlayground.answerEn}</p>
                  </div>
                </div>

                {/* Simulated Input Bar */}
                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Ask anything grounded to this knowledge collection..."
                    className="flex-1 bg-[#05080E] border border-white/20 p-2.5 text-xs font-mono text-white focus:border-[#00D4FF] outline-none"
                  />
                  <button
                    onClick={() => alert(isBn ? "প্রশ্ন অনুসন্ধান সম্পন্ন হয়েছে।" : "Query verified against active vector corpus.")}
                    className="px-4 py-2.5 bg-[#0066FF] hover:bg-[#00D4FF] hover:text-[#0D1117] text-white font-mono font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send width={12} height={12} />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Context & Citations Panel */}
              <div className="lg:col-span-3 border-l border-white/10 pl-4 space-y-4 text-xs font-mono">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookmarkBook width={13} height={13} className="text-[#00D4FF]" />
                  <span>{isBn ? "প্রামাণ্য তথ্যসূত্র ও সাইটেশন" : "Retrieved Citations"}</span>
                </div>

                <div className="space-y-2.5">
                  {currentPlayground.citations.map((c, i) => (
                    <div key={i} className="p-2.5 bg-white/[0.02] border border-white/10 space-y-1">
                      <div className="text-white font-bold text-[11px]">{c.title}</div>
                      <div className="text-[10px] text-stone-400">{c.author}</div>
                      <div className="text-[10px] text-[#00D4FF] font-semibold">{c.page}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 space-y-1.5">
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">{isBn ? "এক্সপোর্ট ফরম্যাট:" : "Export Citation:"}</div>
                  <div className="flex gap-2">
                    <button onClick={() => alert("Copied APA 7th Edition Citation!")} className="px-2 py-1 bg-white/5 border border-white/15 hover:border-[#00D4FF] text-[10px] text-stone-300">APA</button>
                    <button onClick={() => alert("Copied MLA 9th Edition Citation!")} className="px-2 py-1 bg-white/5 border border-white/15 hover:border-[#00D4FF] text-[10px] text-stone-300">MLA</button>
                    <button onClick={() => alert("Copied BibTeX Record!")} className="px-2 py-1 bg-white/5 border border-white/15 hover:border-[#00D4FF] text-[10px] text-stone-300">BibTeX</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* General Mode (Simple & Calm) */
            <div className="max-w-3xl mx-auto bg-[#0D1117] border border-white/15 p-6 space-y-6">
              <div className="text-center space-y-1">
                <div className="text-xs font-mono text-[#00D4FF] font-bold uppercase">{currentPlayground.badge}</div>
                <h3 className="text-lg font-bold text-white">{isBn ? currentPlayground.questionBn : currentPlayground.questionEn}</h3>
              </div>

              <div className="p-4 bg-white/[0.02] border border-white/10 text-sm text-stone-200 leading-relaxed font-sans">
                {isBn ? currentPlayground.answerBn : currentPlayground.answerEn}
              </div>

              <div className="p-3 bg-[#05080E] border border-white/10 text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-stone-400">
                <span>Source: {currentPlayground.citations[0]?.title}</span>
                <span className="text-[#00D4FF]">{currentPlayground.citations[0]?.page}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CORE PRODUCT PILLARS */}
      <section id="pillars" className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="border-b border-white/10 pb-4 mb-10">
          <div className="text-xs font-mono text-[#00D4FF] uppercase tracking-wider">{isBn ? "প্রোডাক্ট আর্কিটেকচার" : "Product Pillars"}</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {isBn ? "কিউআইএম এআই ২.১ এর মূল ভিত্তি" : "The Core Architecture of QiM-AI 2.1"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              titleEn: "01 AI Tutor Engine",
              titleBn: "০১ এআই টিউটর ইঞ্জিন",
              descEn: "Pedagogical tutoring that begins simply and deepens iteratively. Uses structured conceptual breakdowns and source citations.",
              descBn: "শিক্ষার্থীদের জন্য সহজ ব্যাখ্যা থেকে শুরু করে গভীর তত্ত্বে প্রবেশের ধারাবাহিক শিক্ষণ কাঠামো।"
            },
            {
              titleEn: "02 Research Intelligence",
              titleBn: "০২ গবেষণা বুদ্ধিমত্তা",
              descEn: "Paper synthesis, literature map discovery, cross-reference extraction, and verifiable bibliography generation.",
              descBn: "গবেষণাপত্র পর্যালোচনা, সাইটেশন ম্যাপিং এবং নির্ভরযোগ্য সাহিত্য পর্যালোচনার স্বয়ংক্রিয় সহায়তা।"
            },
            {
              titleEn: "03 RAG Ingestion Pipeline",
              titleBn: "০৩ আরএজি ইনজেশন পাইপলাইন",
              descEn: "Multi-format document parsing (PDF, DOCX, TXT, syllabus), semantic normalization, chunking, and pgvector embeddings.",
              descBn: "যেকোনো নথিপত্রকে স্বয়ংক্রিয়ভাবে পাঠযোগ্য ভেক্টর ডাটাবেজে রূপান্তর ও দ্রুততম সময়ে রিট্রিভাল।"
            },
            {
              titleEn: "04 Citation Engine",
              titleBn: "০৪ সাইটেশন ইঞ্জিন",
              descEn: "Clickable provenance linking every sentence to exact pages, journal volumes, and author records with 100% fidelity.",
              descBn: "প্রতিটি উত্তরের সাথে মূল নথির পৃষ্ঠা নম্বর ও লেখকের প্রামাণ্য তথ্যসূত্র নিশ্চিতকরণ।"
            },
            {
              titleEn: "05 Institutional Workspaces",
              titleBn: "০৫ প্রাতিষ্ঠানিক ওয়ার্কস্পেস",
              descEn: "Multi-tenant isolation for universities, schools, NGOs, and labs with dedicated role-based permission control.",
              descBn: "বিশ্ববিদ্যালয় ও গবেষণা প্রতিষ্ঠানের জন্য সম্পূর্ণ আলাদা ও নিরাপদ মাল্টি-টেন্যান্ট ক্লাউড ওয়ার্কস্পেস।"
            },
            {
              titleEn: "06 Strict Data Privacy",
              titleBn: "০৬ কঠোর তথ্য গোপনীয়তা",
              descEn: "Zero training on private user documents. Cryptographic tenant segregation ensures documents never cross-pollinate.",
              descBn: "ব্যবহারকারীর নিজস্ব কোনো নথি কখনো সার্বজনীন মডেলের প্রশিক্ষণে ব্যবহার করা হয় না।"
            }
          ].map((p, idx) => (
            <div key={idx} className="p-6 bg-[#0D1117] border border-white/10 hover:border-[#0066FF] transition-all group">
              <div className="font-mono text-xs font-bold text-[#00D4FF] mb-2">{isBn ? p.titleBn : p.titleEn}</div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">{isBn ? p.descBn : p.descEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RAG PIPELINE VISUALIZATION */}
      <section id="rag" className="py-16 bg-[#090D14] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <div className="text-xs font-mono text-[#00D4FF] uppercase tracking-wider">{isBn ? "জ্ঞান প্রবাহ আর্কিটেকচার" : "End-to-End Pipeline"}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {isBn ? "নলেজ ইনজেশন থেকে সঠিক উত্তর পর্যন্ত" : "The 8-Stage Knowledge-to-Intelligence Pipeline"}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center text-xs font-mono">
            {[
              { step: "01", name: "UPLOAD", desc: "PDF/DOC/TXT" },
              { step: "02", name: "PARSE", desc: "Clean Text" },
              { step: "03", name: "CHUNK", desc: "Semantic Splits" },
              { step: "04", name: "EMBED", desc: "Dense Vectors" },
              { step: "05", name: "INDEX", desc: "pgvector" },
              { step: "06", name: "QUERY", desc: "User Prompt" },
              { step: "07", name: "RETRIEVE", desc: "Cosine Sim" },
              { step: "08", name: "SYNTHESIZE", desc: "Cited Output" }
            ].map((s, idx) => (
              <div key={idx} className="p-3 bg-[#0D1117] border border-white/10 relative group">
                <div className="text-[10px] text-[#00D4FF] font-bold mb-1">{s.step}</div>
                <div className="text-white font-bold text-[11px] mb-1">{s.name}</div>
                <div className="text-[10px] text-stone-400">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HAKIM SARKER LAB & SOCIAL WORK LAB */}
      <section id="labs" className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider flex items-center gap-1.5">
              <BookmarkBook width={14} height={14} />
              <span>Specialized Digital Legacy Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isBn ? "হাকিম সরকার ইন্টেলিজেন্স ও সোশ্যাল ওয়ার্ক ল্যাব" : "Hakim Sarker Intelligence & Social Work Lab"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
              {isBn
                ? "কিউআইএম এআই ২.১ প্ল্যাটফর্মের একটি বিশেষায়িত গবেষণা মডিউল যা অধ্যাপক ড. আব্দুল হাকিম সরকারের ৫৫ বছরের সমাজকল্যাণ, অপরাধবিজ্ঞান ও পুনরুদ্ধারমূলক ন্যায়বিচারের গবেষণাকে আধুনিক শিক্ষার্থীদের কাছে উন্মুক্ত করে।"
                : "QiM-AI 2.1 serves as the technological engine powering hakimsarker.org, providing source-traceable retrieval across 55 years of criminological and restorative justice scholarship."}
            </p>
            <div className="pt-2">
              <Link
                href="/initiatives/hakimsarker"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#E5C378] text-[#0B1A2E] text-xs font-mono font-bold transition-colors"
              >
                <span>{isBn ? "হাকিম সরকার আর্কাইভ পোর্টাল দেখুন" : "View Hakim Sarker Portal"}</span>
                <ArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>

          <div className="p-6 bg-[#080C14] border border-[#C5A059]/40 space-y-4 font-mono text-xs">
            <div className="text-[#C5A059] font-bold text-sm border-b border-white/10 pb-2 flex items-center justify-between">
              <span>HAKIM SARKER LAB CORPUS</span>
              <span className="text-[10px] text-emerald-400">STATUS: ACTIVE</span>
            </div>
            <div className="space-y-2 text-stone-300 text-[11px]">
              <div className="flex items-center justify-between p-2 bg-white/[0.02]">
                <span>Ph.D. Juvenile Sociopathy (1988)</span>
                <span className="text-white">100% Digitized</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/[0.02]">
                <span>Juvenile Delinquency Monograph (2001)</span>
                <span className="text-white">Indexed in Vector DB</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/[0.02]">
                <span>Victimology Curriculum (DU-ISWR)</span>
                <span className="text-white">Verified Chunks</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/[0.02]">
                <span>Padma Bridge Safeguard Audits (2010)</span>
                <span className="text-white">Archived Dossier</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & TIERS */}
      <section id="pricing" className="py-16 bg-[#080C14] border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="text-xs font-mono text-[#00D4FF] uppercase tracking-wider">{isBn ? "পরিকল্পনাসমূহ" : "Transparent Plans"}</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isBn ? "গবেষক, শিক্ষক ও প্রতিষ্ঠানের জন্য সাবস্ক্রিপশন" : "Built for Scholars, Educators & Institutions"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#0D1117] border border-white/10 space-y-4 font-mono text-xs">
              <div className="text-stone-400 font-bold uppercase">Researcher Tier</div>
              <div className="text-2xl font-bold text-white">Open Access</div>
              <p className="text-stone-400 text-[11px]">For students and independent scholars accessing public archives like hakimsarker.org.</p>
              <ul className="space-y-2 text-stone-300 text-[11px] border-t border-white/10 pt-4">
                <li>✓ Full public archive search</li>
                <li>✓ APA & MLA citation generator</li>
                <li>✓ 50 RAG queries / day</li>
              </ul>
              <button onClick={() => alert("Free tier active in playground!")} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">Start Free</button>
            </div>

            <div className="p-6 bg-[#0D1117] border border-[#0066FF] space-y-4 font-mono text-xs relative">
              <div className="absolute -top-3 right-4 px-2 py-0.5 bg-[#0066FF] text-[10px] text-white font-bold uppercase">Popular</div>
              <div className="text-[#00D4FF] font-bold uppercase">Educator / Lab</div>
              <div className="text-2xl font-bold text-white">Custom / Grant</div>
              <p className="text-stone-400 text-[11px]">For university departments and non-profit research teams ingesting custom course syllabi.</p>
              <ul className="space-y-2 text-stone-300 text-[11px] border-t border-white/10 pt-4">
                <li>✓ Up to 100 course textbooks / PDFs</li>
                <li>✓ Student workspace collaboration</li>
                <li>✓ Automated quiz & module builder</li>
              </ul>
              <a href="mailto:hi@qimai.codes?subject=Educator Plan" className="block text-center w-full py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold transition-colors">Request Access</a>
            </div>

            <div className="p-6 bg-[#0D1117] border border-white/10 space-y-4 font-mono text-xs">
              <div className="text-stone-400 font-bold uppercase">Enterprise & University</div>
              <div className="text-2xl font-bold text-white">Institutional</div>
              <p className="text-stone-400 text-[11px]">Dedicated VPC deployment with zero data retention and strict compliance auditing.</p>
              <ul className="space-y-2 text-stone-300 text-[11px] border-t border-white/10 pt-4">
                <li>✓ Dedicated pgvector instance</li>
                <li>✓ SSO / SAML integration</li>
                <li>✓ Custom API & Webhook rate limits</li>
              </ul>
              <a href="mailto:hi@qimai.codes?subject=Institutional Deployment" className="block text-center w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold transition-colors">Contact Enterprise</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05080E] py-8 text-center text-xs font-mono text-stone-500">
        <div className="max-w-[1440px] mx-auto px-4 space-y-2">
          <p className="text-stone-300">
            © 2026 QiM-AI 2.1 · Smarter Intelligence. Better Tomorrow.
          </p>
          <p className="text-[11px] text-stone-500">
            {isBn
              ? "সোহেল তাসনীম ফাউন্ডেশন (এসটিএফএল) ইকোসিস্টেমের প্রযুক্তি প্ল্যাটফর্ম।"
              : "A Technology Initiative in Association with SohaelTasneem Foundation (STFL) Ecosystem."}
          </p>
        </div>
      </footer>
    </div>
  );
}
