"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Xmark,
  ArrowRight,
  ShieldCheck,
  Globe,
  NavArrowRight,
  Folder,
  Heart,
  Phone,
  Mail,
  Building
} from "iconoir-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/src/context/LanguageContext";
import { APP_ORIGIN, VERIFY_ORIGIN } from "@/src/lib/domains";

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { lang, setLang, toggleLang } = useLanguage();

  const isBn = lang === "bn";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scrolling when burger menu drawer is open and support Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7E7E2]">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main Navigation">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Official STFL Wordmark Lockup (emblem retained in footer only) */}
          <Link href="/" className="flex items-center group min-w-0 mr-1 sm:mr-2">
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#081F2D] tracking-tight leading-none group-hover:text-[#FF6B35] transition-colors truncate">
              {isBn ? "সোহেল তাসনীম ফাউন্ডেশন" : "SOHAELTASNEEM FOUNDATION"}
            </span>
          </Link>

          {/* Right Action Bar: Language Switcher, Workspace Hub, Donate CTA & Burger Menu */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Switcher with Sharp Ruling */}
            <div className="flex items-center bg-[#FAFAF8] border border-[#E7E7E2] rounded-none p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded-none transition-colors cursor-pointer ${
                  lang === "en"
                    ? "bg-[#081F2D] text-white font-bold"
                    : "text-[#5A6B75] hover:text-[#081F2D]"
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLang("bn")}
                className={`px-2 py-1 rounded-none transition-colors cursor-pointer ${
                  lang === "bn"
                    ? "bg-[#081F2D] text-white font-bold"
                    : "text-[#5A6B75] hover:text-[#081F2D]"
                }`}
                title="বাংলায় দেখুন"
              >
                বাংলা
              </button>
            </div>

            {/* STFL VI Command Hub Link with Sharp Ruling */}
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2B43] text-white text-xs font-semibold rounded-none border border-[#081F2D] hover:bg-[#081F2D] transition shadow-xs"
              title="STFL VI Institutional Management Consoles"
            >
              <ShieldCheck width={14} height={14} />
              <span>{isBn ? "ম্যানেজমেন্ট হাব" : "Workspace Hub"}</span>
            </Link>

            {/* Donate CTA Button with Sharp Ruling */}
            <Link
              href="/donate"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF6B35] text-white text-xs font-semibold rounded-none border border-[#e05a28] hover:bg-[#e05a28] transition shadow-xs"
            >
              <span>{isBn ? "সহযোগিতা" : "Donate"}</span>
              <ArrowRight width={12} height={12} />
            </Link>

            {/* Sandwich / Burger Menu Button with Sharp Ruling */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none border border-[#081F2D]/20 hover:border-[#081F2D] bg-[#FAFAF8] hover:bg-white text-[#081F2D] text-xs font-semibold transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#081F2D]"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {menuOpen ? (
                <Xmark width={18} height={18} aria-hidden="true" className="text-[#FF6B35]" />
              ) : (
                <Menu width={18} height={18} aria-hidden="true" />
              )}
              <span className="font-mono tracking-wide uppercase text-xs">
                {menuOpen ? (isBn ? "বন্ধ করুন" : "Close") : (isBn ? "মেনু" : "Menu")}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sandwich / Burger Menu Overlay & Slide-over Drawer (Portalled to document.body to escape header containing block) */}
      {mounted && menuOpen && createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Site Navigation">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-[#081F2D]/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50 h-full pointer-events-auto">
            <div className="w-screen max-w-md sm:max-w-xl bg-white border-l border-[#E7E7E2] shadow-2xl flex flex-col h-full overflow-hidden">
              {/* Drawer Header with Sharp Ruling */}
              <div className="p-5 sm:p-6 border-b border-[#E7E7E2] flex items-center justify-between bg-[#FAFAF8] shrink-0">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/stfl-mark-dark.png"
                    alt="SohaelTasneem Foundation Emblem"
                    width={24}
                    height={21}
                    className="h-5 w-auto shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#081F2D] tracking-tight leading-none">
                      {isBn ? "সোহেল তাসনীম ফাউন্ডেশন" : "SOHAELTASNEEM FOUNDATION"}
                    </div>
                    <div className="text-[10px] font-mono text-[#5A6B75] mt-0.5">
                      {isBn ? "প্রাতিষ্ঠানিক সাইট সূচি" : "Institutional Directory"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-block text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-none border border-stone-200">
                    ESC
                  </span>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 text-stone-500 hover:text-[#081F2D] hover:bg-white rounded-none border border-[#E7E7E2] transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <Xmark width={18} height={18} />
                  </button>
                </div>
              </div>

              {/* Drawer Navigation Body */}
              <div className="p-5 sm:p-6 space-y-6 flex-1 min-h-0 overflow-y-auto overscroll-contain">
                {/* Section 1: About & Institutional */}
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B35] mb-2.5">
                    {isBn ? "পরিচিতি ও পরিচালনা" : "About & Governance"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "মূল পাতা (Home)" : "Home"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35] transition-colors" />
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "আমাদের সম্পর্কে" : "About STFL"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35] transition-colors" />
                    </Link>
                    <Link
                      href="/mission"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "মিশন ও ভিশন" : "Mission & Vision"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35] transition-colors" />
                    </Link>
                    <Link
                      href="/team"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "বোর্ড ও নেতৃত্ব" : "Board & Leadership"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35] transition-colors" />
                    </Link>
                    <Link
                      href="/reports"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "বার্ষিক অডিট ও প্রতিবেদন" : "Annual Reports & Audits"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35] transition-colors" />
                    </Link>
                    <Link
                      href="/safeguarding"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "সুরক্ষা নীতি" : "Safeguarding"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35] transition-colors" />
                    </Link>
                    <Link
                      href={`${APP_ORIGIN}/roadmap`}
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold text-cyan-700">{isBn ? "প্ল্যাটফর্ম রোডম্যাপ" : "Platform Roadmap"}</span>
                      <NavArrowRight width={14} height={14} className="text-cyan-600 transition-colors" />
                    </Link>
                  </div>
                </div>

                {/* Section 2: Programs */}
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B35] mb-2.5">
                    {isBn ? "মূল কর্মসূচিসমূহ" : "Programs & Interventions"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/programs"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group sm:col-span-2 bg-[#FAFAF8]/60"
                    >
                      <div>
                        <div className="font-bold">{isBn ? "সকল কর্মসূচি ওভারভিউ" : "All Programs Overview"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "৪টি মূল ধারা ও কার্যক্রম কাঠামো" : "4 core intervention pillars"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/programs/education"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "শিক্ষা কর্মসূচি" : "Education"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "স্কুল ও সাক্ষরতা" : "Foundational & Skills"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/programs/health"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "স্বাস্থ্যসেবা" : "Healthcare"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "প্রাথমিক চিকিৎসা ও পুষ্টি" : "Primary Care & Nutrition"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/programs/community-development"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "সামাজিক উন্নয়ন" : "Community Development"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "উদ্যোক্তা ও অবকাঠামো" : "Enterprise & Climate"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/programs/digital-inclusion"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "ডিজিটাল সক্ষমতা" : "Digital Inclusion"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "ল্যাব ও ভবিষ্যৎ দক্ষতা" : "Future Skills & Tech Labs"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                  </div>
                </div>

                {/* Section 3: Initiatives & Ventures (উদ্যোগ ও ভেঞ্চার) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B35]">
                      {isBn ? "উদ্যোগ ও ভেঞ্চার" : "Initiatives & Ventures"}
                    </h3>
                    <Link
                      href="/initiatives"
                      onClick={() => setMenuOpen(false)}
                      className="text-[10px] font-mono text-[#FF6B35] hover:underline font-semibold"
                    >
                      {isBn ? "সকল উদ্যোগ →" : "View All →"}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/initiatives/grihostios"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "গৃহস্থী ওএস" : "GrihostiOS"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "সম্পত্তি ও জমি ব্যবস্থাপনা" : "Property & Land Operations"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="https://hakimsarker.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold group-hover:text-[#FF6B35] transition-colors">{isBn ? "প্রফেসর ড. আব্দুল হাকিম সরকার" : "Prof. Dr. Abdul Hakim Sarker"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "শিক্ষা ও জ্ঞান আর্কাইভ" : "Academic Legacy & Archive"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/initiatives/aev-developments"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "এইভি ডেভেলপমেন্টস" : "AEV Developments"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "অবকাঠামো ও আবাসন" : "Infrastructure & Development"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/initiatives/maxremit"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "ম্যাক্সরেমিট" : "MaxRemit"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "রেমিট্যান্স ও ক্রস-বর্ডার" : "Cross-Border Remittance"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/initiatives/helpex"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "হেল্পেক্স" : "Helpex"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "জামানতি অর্থায়ন" : "Collateral Finance"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/initiatives/proiozon"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "প্রয়োজন" : "Proiozon"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "বাংলাদেশ ডিজিটাল মার্কেট" : "Bangladesh Marketplace"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/initiatives/perlu"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold">{isBn ? "পেরলু" : "Perlu"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "মালয়েশিয়া মার্কেটপ্লেস" : "Malaysia Marketplace"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="https://qimai.codes/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold group-hover:text-[#0066FF] transition-colors">{isBn ? "কিউআইএম এআই ২.১" : "QiM-AI 2.1"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "এআই ও নলেজ প্ল্যাটফর্ম" : "AI & Knowledge Platform"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#0066FF]" />
                    </Link>
                  </div>
                </div>

                {/* Section 4: Evidence & Field Media */}
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B35] mb-2.5">
                    {isBn ? "মাঠপর্যায় ও প্রমাণ" : "Impact, News & Media"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/impact"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "প্রভাব ও পরিমাপ" : "Impact & Measurement"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/projects"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "মাঠপর্যায়ের প্রকল্পসমূহ" : "Field Projects"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/news"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "সংবাদ ও ডিসপ্যাচ" : "News & Media"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/gallery"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "ফটোগ্রাফি গ্যালারি" : "Photo Gallery"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "ইভেন্ট ও আয়োজন" : "Events & Outreach"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/publications"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "প্রকাশনা ও গবেষণা" : "Publications"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                  </div>
                </div>

                {/* Section 4: Participation & Engagement */}
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B35] mb-2.5">
                    {isBn ? "অংশগ্রহণ ও সহযোগিতা" : "Get Involved"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Link
                      href="/donate"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-bold text-[#FF6B35]">{isBn ? "দান ও অনুদান" : "Donate"}</span>
                      <Heart width={14} height={14} className="text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/volunteer"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "স্বেচ্ছাসেবা নেটওয়ার্ক" : "Volunteer Network"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/partner"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "প্রাতিষ্ঠানিক অংশীদারিত্ব" : "Partner With Us"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/careers"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "ক্যারিয়ার ও সুযোগ" : "Careers"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                  </div>
                </div>

                {/* Section 5: Transparency, Brand & Verification */}
                <div>
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FF6B35] mb-2.5">
                    {isBn ? "স্বচ্ছতা, ব্র্যান্ড ও যোগাযোগ" : "Governance, Brand & Verification"}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <Link
                      href={`${VERIFY_ORIGIN}/verify`}
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-[#E7E7E2] bg-[#FAFAF8] hover:bg-white text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck width={14} height={14} className="text-emerald-600" />
                        <span className="font-bold">{isBn ? "যাচাইকরণ পোর্টাল" : "Verification Portal"}</span>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/brandcenter"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-[#FF6B35]/30 bg-[#FF6B35]/5 text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-[#FF6B35]">{isBn ? "ব্র্যান্ড সেন্টার ও মিডিয়া" : "Brand Center & Media"}</div>
                        <div className="text-[10px] text-stone-500">{isBn ? "এইচডি ছবি ও লোগো কিট" : "HD Photos & Brand Assets"}</div>
                      </div>
                      <NavArrowRight width={14} height={14} className="text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/brand"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "ব্র্যান্ড নির্দেশিকা" : "Brand Guidelines"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => setMenuOpen(false)}
                      className="p-2.5 rounded-none border border-transparent hover:border-[#E7E7E2] hover:bg-[#FAFAF8] text-[#081F2D] transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold">{isBn ? "যোগাযোগ ও প্রধান কার্যালয়" : "Contact & HQ"}</span>
                      <NavArrowRight width={14} height={14} className="text-stone-300 group-hover:text-[#FF6B35]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Drawer Footer & Workspace Hub Consoles */}
              <div className="p-5 sm:p-6 border-t border-[#E7E7E2] bg-[#081F2D] text-white space-y-4 shrink-0">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-3.5 py-2.5 bg-[#0B2B43] hover:bg-[#103d5e] text-white text-xs font-semibold rounded-none flex items-center justify-center gap-2 transition"
                  >
                    <ShieldCheck width={15} height={15} className="text-[#FF6B35]" />
                    <span>{isBn ? "STFL VI কমান্ড হাব (১৮ কনসোল)" : "STFL VI Command Hub"}</span>
                  </Link>
                  <Link
                    href="/admin/property"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-none flex items-center justify-center gap-2 transition"
                  >
                    <Folder width={15} height={15} className="text-amber-400" />
                    <span>GrihostiOS Legal Workflow</span>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/10 text-[11px] font-mono text-stone-300">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Phone width={12} height={12} className="text-[#FF6B35]" />
                      +88018410506411
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail width={12} height={12} className="text-[#FF6B35]" />
                      hi@stflbd.email
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-none border border-white/15 text-[10px]">
                      <button
                        onClick={() => setLang("bn")}
                        className={`px-1 cursor-pointer ${isBn ? "text-white font-bold underline" : "text-stone-400 hover:text-white"}`}
                      >
                        বাংলা
                      </button>
                      <span>/</span>
                      <button
                        onClick={() => setLang("en")}
                        className={`px-1 cursor-pointer ${!isBn ? "text-white font-bold underline" : "text-stone-400 hover:text-white"}`}
                      >
                        EN
                      </button>
                    </div>
                    <span className="text-stone-400">stflbd.app</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
