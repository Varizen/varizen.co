"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  GovernedWorkspaceProvider,
  useGovernedWorkspace,
  CONSOLES_CATALOG,
  UserClass,
  ConsoleAccessLevel,
  WorkspaceTab,
  ProjectFacet,
} from "./context";
import {
  User,
  ShieldCheck,
  Activity,
  Bank,
  Building,
  PiggyBank,
  Group,
  ShoppingBag,
  Folder,
  Package,
  Page,
  Message,
  Lock,
  Cpu,
  Phone,
  Server,
  NavArrowRight,
  NavArrowDown,
  WarningTriangle,
  InfoCircle,
  Menu,
  Xmark,
  Check,
  ShieldAlert,
  BookStack,
  TaskList,
  List,
  Coins,
  Eye,
  StatsReport,
  MapPin,
  Clock,
} from "iconoir-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; width?: number; height?: number }>> = {
  iam: User,
  governance: ShieldCheck,
  executive: Activity,
  finance: Bank,
  property: Building,
  microfinance: PiggyBank,
  workforce: Group,
  eshop: ShoppingBag,
  projects: Folder,
  assets: Package,
  documents: Page,
  communications: Message,
  security: Lock,
  agents: Cpu,
  devices: Phone,
  system: Server,
  compliance: ShieldAlert,
  knowledge: BookStack,
};

function getBadgeStyle(level: ConsoleAccessLevel) {
  switch (level) {
    case "FULL":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "MANAGE":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "OVERSIGHT":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "OPERATIONAL":
      return "bg-cyan-100 text-cyan-800 border-cyan-300";
    case "FIELD":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "LIMITED":
    case "OWN_EVENTS":
    case "ISSUE_GATED":
      return "bg-stone-100 text-stone-700 border-stone-300";
    case "DENIED":
    default:
      return "bg-rose-100 text-rose-700 border-rose-300";
  }
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    activeClass,
    setActiveClass,
    lang,
    setLang,
    getConsoleAccess,
    activeTab,
    setActiveTab,
    activeProjectId,
    setActiveProjectId,
    activeProjectFacet,
    setActiveProjectFacet,
    projects,
    activeProject,
    myWorkData,
    managementClusters,
  } = useGovernedWorkspace();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDirectConsolePage = pathname !== "/admin";

  const userClassOptions: { code: UserClass; labelBn: string; labelEn: string }[] = [
    { code: "CLASS_00", labelBn: "ক্লাস ০০: প্ল্যাটফর্ম সুপার অ্যাডমিন", labelEn: "Class 00: Super Admin" },
    { code: "CLASS_01", labelBn: "ক্লাস ০১: বোর্ড ট্রাস্টি", labelEn: "Class 01: Trustee" },
    { code: "CLASS_02", labelBn: "ক্লাস ০২: নির্বাহী নেতৃত্ব (চেয়ারপারসন/সিইও)", labelEn: "Class 02: Executive Leadership" },
    { code: "CLASS_03", labelBn: "ক্লাস ০৩: বিভাগীয় প্রধান", labelEn: "Class 03: Unit Head" },
    { code: "CLASS_04", labelBn: "ক্লাস ০৪: অপারেশনাল অফিসার / পিএম", labelEn: "Class 04: Officer / Project Manager" },
    { code: "CLASS_05", labelBn: "ক্লাস ০৫: ফিল্ড কর্মী (১০,০০০ বিডিটি সীমা)", labelEn: "Class 05: Field Worker" },
    { code: "CLASS_06", labelBn: "ক্লাস ০৬: অর্থ ও হিসাব বিশেষজ্ঞ", labelEn: "Class 06: Finance Specialist" },
    { code: "CLASS_07", labelBn: "ক্লাস ০৭: নিরাপত্তা ও নিরীক্ষা কর্মকর্তা", labelEn: "Class 07: Security Officer" },
    { code: "CLASS_08", labelBn: "ক্লাস ০৮: নথি নিয়ন্ত্রণ কর্মকর্তা", labelEn: "Class 08: Document Officer" },
    { code: "CLASS_09", labelBn: "ক্লাস ০৯: মানবসম্পদ ও কর্মী প্রশাসন", labelEn: "Class 09: HR Specialist" },
    { code: "CLASS_10", labelBn: "ক্লাস ১০: স্বায়ত্তশাসিত এআই এজেন্ট (লেভেল ৩ সীমা)", labelEn: "Class 10: AI Agent (Level 3 Ceiling)" },
    { code: "CLASS_11", labelBn: "ক্লাস ১১: বহিরাগত অংশীদার (ভাড়াটিয়া/ঋণগ্রহীতা)", labelEn: "Class 11: External Party (Tenant/Borrower)" },
    { code: "CLASS_12", labelBn: "ক্লাস ১২: সর্বজনীন নাগরিক (পাবলিক যাচাই)", labelEn: "Class 12: Public Citizen / QR Verifier" },
    { code: "MODERATOR_A", labelBn: "মডারেটর এ: অপারেশনাল রিলিফ মডারেটর", labelEn: "Moderator A: Operational Relief" },
    { code: "MODERATOR_B", labelBn: "মডারেটর বি: কারিগরি ও কমপ্লায়েন্স রিলিফ", labelEn: "Moderator B: Technical Relief" },
  ];

  const handleTabClick = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    if (tab === "portfolio") {
      setActiveProjectId("ALL");
    } else if (tab === "project" && activeProjectId === "ALL") {
      setActiveProjectId("STFL-PRJ-2026-0012");
    }
    if (isDirectConsolePage) {
      router.push("/admin");
    }
  };

  const projectFacets: { code: ProjectFacet; labelBn: string; labelEn: string; icon: React.ComponentType<{ className?: string; width?: number; height?: number }> }[] = [
    { code: "overview", labelBn: "সারসংক্ষেপ", labelEn: "Overview", icon: Eye },
    { code: "operations", labelBn: "কার্যক্রম ও ফিল্ড", labelEn: "Operations", icon: TaskList },
    { code: "outcomes", labelBn: "ফলাফল ও অর্জন", labelEn: "Outcomes", icon: StatsReport },
    { code: "finance", labelBn: "প্রকল্প অর্থায়ন", labelEn: "Finance", icon: Coins },
    { code: "people", labelBn: "ব্যক্তিবর্গ ও দল", labelEn: "People", icon: Group },
    { code: "assets", labelBn: "স্থাবর-অস্থাবর সম্পদ", labelEn: "Assets", icon: Package },
    { code: "documents", labelBn: "নথিপত্র ও সনদ", labelEn: "Documents", icon: Page },
    { code: "compliance", labelBn: "আইন ও কমপ্লায়েন্স", labelEn: "Compliance", icon: ShieldAlert },
    { code: "governance", labelBn: "শাসন ও অনুমোদন", labelEn: "Governance", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#081F2D]">
      {/* 1. TOP GOVERNANCE & PRIMARY NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#081F2D] text-white border-b border-[#0B2B43] shadow-md">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Left: Mobile Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-stone-300 hover:text-white rounded-md focus:outline-none"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <Xmark width={20} height={20} /> : <Menu width={20} height={20} />}
              </button>
              
              <Link href="/admin" onClick={() => handleTabClick("portfolio")} className="flex items-center gap-2.5 group">
                <Image
                  src="/stfl-mark-transparent.png"
                  alt="STFL"
                  width={28}
                  height={28}
                  className="h-7 w-auto transition-opacity group-hover:opacity-85"
                />
                <div>
                  <span className="text-sm font-bold tracking-tight text-white block leading-none">
                    STFL VI
                  </span>
                  <span className="text-[10px] text-[#00D4FF] font-semibold tracking-wider block mt-0.5 font-mono">
                    {lang === "bn" ? "প্রাতিষ্ঠানিক অপারেটিং সিস্টেম" : "INSTITUTIONAL OPERATING SYSTEM"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Persistent Project Switcher */}
            <div className="hidden md:flex items-center gap-2 bg-[#0B2B43] px-3 py-1.5 rounded-lg border border-stone-700/70 shadow-inner">
              <span className="text-[11px] font-semibold text-stone-300 whitespace-nowrap flex items-center gap-1.5">
                <Folder width={14} height={14} className="text-[#FF6B35]" />
                {lang === "bn" ? "প্রকল্প:" : "Project:"}
              </span>
              <select
                value={activeProjectId}
                onChange={(e) => {
                  setActiveProjectId(e.target.value);
                  if (isDirectConsolePage) {
                    router.push("/admin");
                  }
                }}
                className="bg-[#081F2D] text-xs font-medium text-white border border-stone-600 rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] cursor-pointer"
              >
                <option value="ALL">
                  {lang === "bn" ? "🌐 সকল প্রকল্প (পোর্টফোলিও ভিউ)" : "🌐 All Projects (Portfolio View)"}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} • {lang === "bn" ? p.nameBn : p.nameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Middle-Right: Active Role Simulator */}
            <div className="hidden xl:flex items-center gap-2 bg-[#0B2B43] px-3 py-1.5 rounded-lg border border-stone-700/60">
              <span className="text-[11px] font-semibold text-stone-300 whitespace-nowrap flex items-center gap-1.5">
                <User width={14} height={14} className="text-[#FF6B35]" />
                {lang === "bn" ? "ভূমিকা:" : "Role:"}
              </span>
              <select
                value={activeClass}
                onChange={(e) => setActiveClass(e.target.value as UserClass)}
                className="bg-[#081F2D] text-xs text-white border border-stone-600 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] cursor-pointer"
              >
                {userClassOptions.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {lang === "bn" ? opt.labelBn : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Controls: Enclave Attestation, Demo Lab & Language */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Enclave Attestation Indicator */}
              <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/80 text-emerald-400 text-[11px] px-2.5 py-1 rounded-md">
                <ShieldCheck width={14} height={14} className="text-emerald-400" />
                <span className="font-mono text-[10px]">ENCLAVE ATTESTED</span>
              </div>

              {/* Demo Lab Link */}
              <Link
                href="/demo"
                className="flex items-center gap-1.5 bg-[#FF6B35]/20 border border-[#FF6B35]/60 text-[#FF6B35] text-xs font-semibold px-2.5 py-1 rounded-md hover:bg-[#FF6B35]/30 transition-colors shadow-sm"
              >
                <Activity width={13} height={13} />
                <span className="hidden sm:inline">{lang === "bn" ? "ডেমো ল্যাব" : "Demo Lab"}</span>
              </Link>

              {/* Bilingual Switcher */}
              <div className="flex items-center bg-[#0B2B43] rounded-md p-0.5 border border-stone-700/60 text-xs">
                <button
                  onClick={() => setLang("bn")}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    lang === "bn" ? "bg-[#FF6B35] text-white" : "text-stone-400 hover:text-white"
                  }`}
                >
                  বাং
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-2 py-1 rounded font-medium transition-colors ${
                    lang === "en" ? "bg-[#FF6B35] text-white" : "text-stone-400 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Public Portal Link */}
              <Link
                href="/"
                className="text-xs text-stone-300 hover:text-white hover:underline transition-colors hidden sm:inline"
              >
                {lang === "bn" ? "মূল সাইট" : "Public Site"}
              </Link>
            </div>
          </div>

          {/* 2. PRIMARY 4 PILLARS HORIZONTAL TABS */}
          <div className="flex items-center gap-1 border-t border-stone-800/80 pt-1 pb-1 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => handleTabClick("portfolio")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all ${
                activeTab === "portfolio" && !isDirectConsolePage
                  ? "bg-[#FF6B35] text-white font-semibold shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
              }`}
            >
              <Folder width={14} height={14} />
              <span>{lang === "bn" ? "পোর্টফোলিও" : "PORTFOLIO"}</span>
              <span className="text-[10px] font-mono opacity-80">({projects.length})</span>
            </button>

            <button
              onClick={() => handleTabClick("project")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all ${
                activeTab === "project" && !isDirectConsolePage
                  ? "bg-[#FF6B35] text-white font-semibold shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
              }`}
            >
              <Activity width={14} height={14} />
              <span>{lang === "bn" ? "বর্তমান প্রকল্প" : "CURRENT PROJECT"}</span>
              {activeProject && (
                <span className="text-[10px] font-mono bg-white/20 px-1 rounded max-w-[130px] truncate">
                  {activeProject.id}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick("work")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all ${
                activeTab === "work" && !isDirectConsolePage
                  ? "bg-[#FF6B35] text-white font-semibold shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
              }`}
            >
              <TaskList width={14} height={14} />
              <span>{lang === "bn" ? "আমার কাজ" : "MY WORK"}</span>
              {myWorkData.approvals.length > 0 && (
                <span className="text-[10px] font-mono bg-amber-500 text-black font-bold px-1.5 rounded-full">
                  {myWorkData.approvals.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick("management")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md whitespace-nowrap transition-all ${
                (activeTab === "management" || isDirectConsolePage)
                  ? "bg-[#0B2B43] text-white border border-stone-600 font-semibold shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-[#0B2B43]"
              }`}
            >
              <Server width={14} height={14} />
              <span>{lang === "bn" ? "ব্যবস্থাপনা ও কনসোলসমূহ" : "MANAGEMENT CONSOLES"}</span>
              <span className="text-[10px] font-mono opacity-80">(18)</span>
            </button>
          </div>
        </div>

        {/* Mobile Project & Role Bar */}
        <div className="md:hidden px-4 py-2 bg-[#0B2B43] border-t border-stone-800 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-300">{lang === "bn" ? "প্রকল্প:" : "Project:"}</span>
            <select
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-[#081F2D] text-xs text-white border border-stone-600 rounded px-2 py-1 max-w-[200px]"
            >
              <option value="ALL">
                {lang === "bn" ? "🌐 সকল প্রকল্প" : "🌐 All Projects"}
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-300">{lang === "bn" ? "ভূমিকা:" : "Role:"}</span>
            <select
              value={activeClass}
              onChange={(e) => setActiveClass(e.target.value as UserClass)}
              className="bg-[#081F2D] text-xs text-white border border-stone-600 rounded px-2 py-1 max-w-[200px]"
            >
              {userClassOptions.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {lang === "bn" ? opt.labelBn : opt.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* 3. BREADCRUMBS & CONSTITUTIONAL GUARD BANNERS */}
      {isDirectConsolePage && (
        <div className="bg-[#0B2B43]/90 text-white px-4 sm:px-8 py-2.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-stone-700">
          <div className="flex items-center gap-2">
            <Link href="/admin" onClick={() => handleTabClick("management")} className="text-stone-300 hover:text-white underline">
              {lang === "bn" ? "ম্যানেজমেন্ট কনসোল ডিরেক্টরি" : "Management Consoles"}
            </Link>
            <span className="text-stone-400">/</span>
            <span className="font-mono font-semibold text-[#FF6B35]">
              {pathname.replace("/admin/", "").toUpperCase()} CONSOLE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              onClick={() => handleTabClick("project")}
              className="bg-[#FF6B35] text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-[#e55a2b] transition-colors"
            >
              {lang === "bn" ? "← প্রকল্প ওয়ার্কস্পেসে ফিরুন" : "← Return to Project Workspace"}
            </Link>
          </div>
        </div>
      )}

      {/* Constitutional Invariant Banner for Super Admin */}
      {activeClass === "CLASS_00" && (
        <div className="bg-amber-500/10 border-b border-amber-300/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-center gap-2">
          <WarningTriangle width={16} height={16} className="text-amber-700 flex-shrink-0" />
          <span>
            <strong>
              {lang === "bn"
                ? "সংবিধানসম্মত দায়িত্ব পৃথকীকরণ সক্রিয়:"
                : "Constitutional Separation of Duties Enforced:"}
            </strong>{" "}
            {lang === "bn"
              ? "সুপার অ্যাডমিন প্ল্যাটফর্ম পরিকাঠামো নিয়ন্ত্রণ করতে পারেন, কিন্তু পরিচালনা নীতি অনুসারে আর্থিক বিতরণ ও সম্পত্তি ইজারা সম্পাদন থেকে সম্পূর্ণ অবরুদ্ধ।"
              : "Super Admin holds platform infrastructure authority, but is physically blocked by policy from operational finance disbursements and property leases."}
          </span>
        </div>
      )}

      {/* 4. MAIN WORKSPACE WITH CONTEXTUAL SIDEBAR */}
      <div className="flex-1 max-w-[1536px] w-full mx-auto flex">
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-[#E7E7E2] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block ${
            sidebarOpen ? "translate-x-0" : "-translate-x-0 hidden"
          }`}
        >
          <div className="h-full flex flex-col pt-4 pb-6 overflow-y-auto">
            {/* Sidebar Context Header */}
            <div className="px-5 mb-4 pb-3 border-b border-[#E7E7E2]">
              <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase block font-mono">
                {activeTab === "project" && !isDirectConsolePage
                  ? (lang === "bn" ? "প্রকল্প ওয়ার্কস্পেস" : "PROJECT WORKSPACE")
                  : activeTab === "portfolio" && !isDirectConsolePage
                  ? (lang === "bn" ? "পোর্টফোলিও স্তর" : "PORTFOLIO LAYER")
                  : activeTab === "work" && !isDirectConsolePage
                  ? (lang === "bn" ? "আমার দায়িত্ব ও কিউ" : "MY WORK QUEUE")
                  : (lang === "bn" ? "পরিচালিত ১৮টি কনসোল" : "18 GOVERNED CONSOLES")}
              </span>
              <div className="text-xs font-semibold text-[#081F2D] truncate mt-0.5">
                {activeTab === "project" && activeProject
                  ? (lang === "bn" ? activeProject.nameBn : activeProject.nameEn)
                  : activeTab === "portfolio"
                  ? (lang === "bn" ? "সার্বজনীন ৪টি প্রকল্প" : "Universal 4 Projects")
                  : activeTab === "work"
                  ? (lang === "bn" ? `অ্যাসাইন করা ব্যবহারকারী: ${activeClass}` : `Assigned: ${activeClass}`)
                  : (lang === "bn" ? "৬টি ক্লাস্টারে সংগঠিত" : "Organized in 6 Clusters")}
              </div>
            </div>

            {/* A. If viewing PROJECT TAB: Show the 9 Project Facets */}
            {activeTab === "project" && !isDirectConsolePage && (
              <nav className="flex-1 px-3 space-y-1">
                <div className="px-3 mb-2 text-[10px] font-bold text-stone-400 tracking-wider uppercase font-mono">
                  {lang === "bn" ? "৯টি প্রকল্প স্তর" : "9 PROJECT FACETS"}
                </div>
                {projectFacets.map((facet) => {
                  const Icon = facet.icon;
                  const isActive = activeProjectFacet === facet.code;
                  return (
                    <button
                      key={facet.code}
                      onClick={() => {
                        setActiveProjectFacet(facet.code);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#081F2D] text-white shadow-sm"
                          : "text-[#081F2D] hover:bg-[#FAFAF8]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon width={16} height={16} className={isActive ? "text-[#FF6B35]" : "text-[#0B2B43]"} />
                        <span>{lang === "bn" ? facet.labelBn : facet.labelEn}</span>
                      </div>
                      <NavArrowRight width={14} height={14} className={isActive ? "text-[#FF6B35]" : "text-stone-300"} />
                    </button>
                  );
                })}
              </nav>
            )}

            {/* B. If viewing PORTFOLIO TAB: Show Portfolio Sections */}
            {activeTab === "portfolio" && !isDirectConsolePage && (
              <nav className="flex-1 px-3 space-y-1">
                <div className="px-3 mb-2 text-[10px] font-bold text-stone-400 tracking-wider uppercase font-mono">
                  {lang === "bn" ? "পোর্টফোলিও নেভিগেশন" : "PORTFOLIO SECTIONS"}
                </div>
                {[
                  { code: "overview", labelBn: "সার্বিক পোর্টফোলিও মূল্যায়ন", labelEn: "Portfolio Overview", icon: StatsReport },
                  { code: "projects", labelBn: "চলমান ৪টি প্রকল্প তুলনা", labelEn: "Comparative Projects Table", icon: Folder },
                  { code: "funding", labelBn: "তহবিল ও সরাসরি ব্যয়ের অনুপাত", labelEn: "Funding & Expenditure Split", icon: Coins },
                  { code: "impact", labelBn: "যাচাইকৃত প্রভাব ও ফলাফল", labelEn: "Verified Impact & Outcomes", icon: ShieldCheck },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setSidebarOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#081F2D] hover:bg-[#FAFAF8]"
                  >
                    <item.icon width={16} height={16} className="text-[#0B2B43]" />
                    <span>{lang === "bn" ? item.labelBn : item.labelEn}</span>
                  </button>
                ))}
              </nav>
            )}

            {/* C. If viewing WORK TAB: Show My Work Sections */}
            {activeTab === "work" && !isDirectConsolePage && (
              <nav className="flex-1 px-3 space-y-1">
                <div className="px-3 mb-2 text-[10px] font-bold text-stone-400 tracking-wider uppercase font-mono">
                  {lang === "bn" ? "আমার কাজের বিভাগ" : "WORK QUEUES"}
                </div>
                {[
                  { labelBn: "আমার কাজ ও টাস্ক", labelEn: "My Tasks", count: myWorkData.tasks.length, icon: TaskList },
                  { labelBn: "অপেক্ষমাণ অনুমোদনসমূহ", labelEn: "Pending Approvals", count: myWorkData.approvals.length, icon: Check },
                  { labelBn: "অগ্রাধিকার সতর্কতা", labelEn: "Priority Alerts", count: myWorkData.alerts.length, icon: WarningTriangle },
                  { labelBn: "এজেন্ট পরামর্শ ও বার্তা", labelEn: "Agent Messages", count: myWorkData.messages.length, icon: Message },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#081F2D] hover:bg-[#FAFAF8]"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon width={16} height={16} className="text-[#0B2B43]" />
                      <span>{lang === "bn" ? item.labelBn : item.labelEn}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-bold">
                      {item.count}
                    </span>
                  </div>
                ))}
              </nav>
            )}

            {/* D. If viewing MANAGEMENT TAB or on a Direct Console page: Show 6 Clusters with 18 Consoles */}
            {(activeTab === "management" || isDirectConsolePage) && (
              <nav className="flex-1 px-3 space-y-5">
                {managementClusters.map((cluster) => {
                  const items = CONSOLES_CATALOG.filter((c) => cluster.consoleCodes.includes(c.code));
                  return (
                    <div key={cluster.clusterId}>
                      <div className="px-3 mb-1 text-[10px] font-bold text-stone-400 tracking-wider uppercase font-mono">
                        {lang === "bn" ? cluster.nameBn : cluster.nameEn}
                      </div>
                      <div className="space-y-0.5">
                        {items.map((item) => {
                          const IconComp = ICON_MAP[item.code] || Server;
                          const access = getConsoleAccess(item.code);
                          const isDenied = access === "DENIED";
                          const isActive = pathname === item.route;

                          return (
                            <Link
                              key={item.code}
                              href={isDenied ? "#" : item.route}
                              onClick={() => setSidebarOpen(false)}
                              className={`group flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isActive
                                  ? "bg-[#081F2D] text-white shadow-sm"
                                  : isDenied
                                  ? "text-stone-400 cursor-not-allowed opacity-60 hover:bg-stone-50"
                                  : "text-[#081F2D] hover:bg-[#FAFAF8]"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <IconComp
                                  width={15}
                                  height={15}
                                  className={isActive ? "text-[#FF6B35]" : isDenied ? "text-stone-300" : "text-[#0B2B43]"}
                                />
                                <span className="truncate text-[11px]">
                                  {lang === "bn" ? item.nameBn : item.nameEn}
                                </span>
                              </div>

                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                  isActive ? "bg-white/20 text-white border-white/30" : getBadgeStyle(access)
                                }`}
                              >
                                {access}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </nav>
            )}

            {/* Sidebar Footer */}
            <div className="px-5 mt-6 pt-4 border-t border-[#E7E7E2]">
              <div className="text-[11px] text-stone-500 leading-relaxed font-mono">
                STFL VI 2026 Institutional Backbone<br />
                Single PostgreSQL 16 • 12-D Policy Evaluator • Append-Only Audit Ledger
              </div>
            </div>
          </div>
        </aside>

        {/* Center Main Workspace Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <GovernedWorkspaceProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </GovernedWorkspaceProvider>
  );
}
