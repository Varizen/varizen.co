"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useGovernedWorkspace,
  CONSOLES_CATALOG,
  ConsoleAccessLevel,
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
  Check,
  Search,
  ShieldAlert,
  BookStack,
  TaskList,
  List,
  Coins,
  Eye,
  StatsReport,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
  XmarkCircle,
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

export default function AdminHubPage() {
  const {
    activeClass,
    lang,
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

  // Search & filter state for management consoles
  const [mgmtSearch, setMgmtSearch] = useState("");
  const [mgmtCategory, setMgmtCategory] = useState("ALL");

  // State for interactive approval simulation
  const [approvalsState, setApprovalsState] = useState(myWorkData.approvals);
  const [operationFilter, setOperationFilter] = useState<string>("ALL");

  const handleApprove = (id: string) => {
    setApprovalsState((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "APPROVED" as any } : app
      )
    );
  };

  const handleReject = (id: string) => {
    setApprovalsState((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "REJECTED" as any } : app
      )
    );
  };

  // ===========================================================================
  // 1. PORTFOLIO VIEW (When activeTab === "portfolio")
  // ===========================================================================
  if (activeTab === "portfolio") {
    const totalFunding = projects.reduce((acc, p) => acc + p.finance.fundingReceived, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.finance.budgetSpent, 0);
    const totalDirect = projects.reduce((acc, p) => acc + p.finance.directExpenditure, 0);
    const totalBeneficiaries = projects.reduce((acc, p) => acc + p.kpis.peopleReached, 0);
    const avgOutcomePct = Math.round(
      projects.reduce((acc, p) => acc + p.kpis.outcomeAchievementPct, 0) / projects.length
    );
    const avgOverhead = (
      projects.reduce((acc, p) => acc + p.kpis.overheadPct, 0) / projects.length
    ).toFixed(1);

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Portfolio Header */}
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 sm:p-8 shadow-sm">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#0B2B43]/5 text-[#0B2B43] border border-[#0B2B43]/15 mb-3">
              <Folder width={14} height={14} className="text-[#FF6B35]" />
              <span>STFL ENTERPRISE PORTFOLIO • 4 ACTIVE GOVERNED PROJECTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#081F2D] leading-tight mb-2">
              {lang === "bn" ? "সার্বিক প্রকল্প পোর্টফোলিও ও প্রভাব মনিটর" : "Enterprise Portfolio & Strategic Impact Hub"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === "bn"
                ? "এসটিএফএল কোনো বিমূর্ত প্রশাসনিক কাঠামো নয়; এটি প্রকল্প, মাঠপর্যায়ের কর্মপ্রচেষ্টা এবং মানুষের জীবনমানের পরিমাপযোগ্য পরিবর্তনের সমষ্টি। সকল প্রকল্প স্বাধীন বাজেট, কর্মপরিকল্পনা ও ফলাফল খতিয়ান দ্বারা পরিচালিত।"
                : "STFL operates as an impact operating system organized around Projects, Operations, Outcomes, and Resources. Every project possesses sovereign accounting, verified delivery metrics, and immutable audit ledgers."}
            </p>
          </div>

          {/* Aggregate Portfolio KPI Blocks */}
          <div className="mt-6 pt-6 border-t border-[#E7E7E2] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "মোট প্রাপ্ত তহবিল" : "Total Funds"}
              </span>
              <span className="text-base sm:text-lg font-bold text-[#081F2D] font-mono mt-0.5 block">
                ৳{(totalFunding / 10000000).toFixed(2)}Cr
              </span>
              <span className="text-[11px] text-stone-500 font-mono">৳{totalFunding.toLocaleString()}</span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "মোট ব্যয়িত অর্থ" : "Total Spent"}
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-700 font-mono mt-0.5 block">
                ৳{(totalSpent / 10000000).toFixed(2)}Cr
              </span>
              <span className="text-[11px] text-stone-500 font-mono">{((totalSpent / totalFunding) * 100).toFixed(1)}% utilized</span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "সরাসরি মাঠ ব্যয়" : "Direct Project Cost"}
              </span>
              <span className="text-base sm:text-lg font-bold text-[#0B2B43] font-mono mt-0.5 block">
                {((totalDirect / totalSpent) * 100).toFixed(1)}%
              </span>
              <span className="text-[11px] text-stone-500 font-mono">৳{(totalDirect / 10000000).toFixed(2)}Cr direct</span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "প্রভাবিত জনসংখ্যা" : "People Reached"}
              </span>
              <span className="text-base sm:text-lg font-bold text-[#FF6B35] font-mono mt-0.5 block">
                {totalBeneficiaries.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500">Verified Citizens</span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "গড় অর্জন হার" : "Avg Outcome %"}
              </span>
              <span className="text-base sm:text-lg font-bold text-[#081F2D] font-mono mt-0.5 block">
                {avgOutcomePct}%
              </span>
              <span className="text-[11px] text-stone-500">Across 4 projects</span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "গড় ওভারহেড" : "Avg Overhead"}
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-800 font-mono mt-0.5 block">
                {avgOverhead}%
              </span>
              <span className="text-[11px] text-stone-500">Within statutory cap</span>
            </div>
          </div>
        </div>

        {/* Comparative Project Table */}
        <div className="bg-white rounded-xl border border-[#E7E7E2] overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#E7E7E2] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#081F2D]">
                {lang === "bn" ? "প্রকল্পসমূহের তুলনামূলক খতিয়ান ও স্বাস্থ্য সূচক" : "Comparative Project Matrix & Health Ratios"}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {lang === "bn"
                  ? "প্রকল্পসমূহকে শুধু মোট ব্যয়ের ভিত্তিতে বিচার করা হয় না; বরং লক্ষ্যমাত্রা অর্জন, ব্যয়দক্ষতা ও নিরীক্ষিত প্রভাবের ভিত্তিতে মূল্যায়ন করা হয়।"
                  : "Projects are evaluated on holistic achievement, verified unit-economics, overhead restraint, and risk health."}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAFAF8] border-b border-[#E7E7E2] text-stone-500 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4 font-semibold">{lang === "bn" ? "প্রকল্প ও আইডি" : "Project & ID"}</th>
                  <th className="py-3 px-3 font-semibold">{lang === "bn" ? "অবস্থা" : "Status"}</th>
                  <th className="py-3 px-3 font-semibold">{lang === "bn" ? "স্থান/এখতিয়ার" : "Jurisdiction"}</th>
                  <th className="py-3 px-3 font-semibold text-right">{lang === "bn" ? "প্রাপ্ত তহবিল" : "Funds"}</th>
                  <th className="py-3 px-3 font-semibold text-right">{lang === "bn" ? "মোট ব্যয়" : "Spent"}</th>
                  <th className="py-3 px-3 font-semibold text-right">{lang === "bn" ? "অর্জন %" : "Outcome %"}</th>
                  <th className="py-3 px-3 font-semibold text-right">{lang === "bn" ? "ব্যয়/ফলাফল" : "Cost/Outcome"}</th>
                  <th className="py-3 px-3 font-semibold text-right">{lang === "bn" ? "ওভারহেড" : "Overhead"}</th>
                  <th className="py-3 px-3 font-semibold text-center">{lang === "bn" ? "স্বাস্থ্য" : "Health"}</th>
                  <th className="py-3 px-4 font-semibold text-right">{lang === "bn" ? "অ্যাকশন" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E7E2]">
                {projects.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#081F2D] text-sm">
                          {lang === "bn" ? p.nameBn : p.nameEn}
                        </div>
                        <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                          {p.id} • {p.code}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600 truncate max-w-[150px]">
                        {lang === "bn" ? p.jurisdictionBn : p.jurisdictionEn}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-[#081F2D]">
                        ৳{(p.finance.fundingReceived / 100000).toLocaleString()}L
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-stone-700">
                        ৳{(p.finance.budgetSpent / 100000).toLocaleString()}L
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-bold text-[#FF6B35]">
                          {p.kpis.outcomeAchievementPct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600">
                        ৳{p.kpis.costPerOutcome.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-600">
                        {p.kpis.overheadPct}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            p.health === "GOOD"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : p.health === "WATCH"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}
                        >
                          {p.health}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setActiveProjectId(p.id);
                            setActiveTab("project");
                            setActiveProjectFacet("overview");
                          }}
                          className="inline-flex items-center gap-1 bg-[#081F2D] text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-[#FF6B35] transition-colors"
                        >
                          <span>{lang === "bn" ? "প্রবেশ" : "Enter"}</span>
                          <ArrowRight width={12} height={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 2. MY WORK VIEW (When activeTab === "work")
  // ===========================================================================
  if (activeTab === "work") {
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Work Header */}
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20 mb-2">
                <TaskList width={14} height={14} />
                <span>UNIVERSAL MY WORK • ATTENTION-FIRST CONSOLE</span>
              </div>
              <h1 className="text-2xl font-bold text-[#081F2D]">
                {lang === "bn" ? "আমার দায়িত্ব, অনুমোদন ও অগ্রাধিকার" : "My Work, Approvals & Priority Queue"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === "bn"
                  ? `বর্তমান সক্রিয় ব্যবহারকারী শ্রেণি: ${activeClass}। আপনার অনুমোদিত পরিধি এবং প্রকল্পের সাথে সম্পর্কিত কাজগুলো এখানে অগ্রাধিকার অনুযায়ী প্রদর্শিত হচ্ছে।`
                  : `Role projection for ${activeClass}. Actionable items requiring your decision or field execution are surfaced here without administrative noise.`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1.5 bg-[#0B2B43] text-white rounded-lg">
                Pending Approvals: {approvalsState.filter((a) => a.status === "PENDING_DUAL_CONTROL" || a.status === "AWAITING_FINANCE" || a.status === "EXECUTIVE_REVIEW").length}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Pending Approvals Queue (Dual-Control & Sovereign Ledger Gate) */}
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Check width={18} height={18} className="text-[#FF6B35]" />
              <h2 className="text-base font-bold text-[#081F2D]">
                {lang === "bn" ? "অনুমোদন অপেক্ষমাণ তালিকা (ডুয়াল-কন্ট্রোল)" : "Action Required: Approvals Queue"}
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              Levels 3, 4 & 5 Human Boundaries
            </span>
          </div>

          <div className="space-y-3">
            {approvalsState.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      Level {app.level}
                    </span>
                    <span className="text-xs font-mono text-stone-500 font-semibold">
                      {app.projectName}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {app.submittedAt}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#081F2D]">
                    {lang === "bn" ? app.titleBn : app.titleEn}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Initiator: <strong>{app.initiator}</strong> • Risk Category: <span className="font-mono text-amber-700">{app.riskCategory}</span>
                    {app.amount && (
                      <span className="ml-2 font-mono font-bold text-[#081F2D]">
                        Amount: ৳{app.amount.toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {(app.status as string) === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded border border-emerald-300">
                      <CheckCircle width={14} height={14} /> Approved
                    </span>
                  ) : (app.status as string) === "REJECTED" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded border border-rose-300">
                      <XmarkCircle width={14} height={14} /> Rejected
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm flex items-center gap-1"
                      >
                        <Check width={13} height={13} />
                        {lang === "bn" ? "অনুমোদন করুন" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm"
                      >
                        {lang === "bn" ? "প্রত্যাখ্যান" : "Reject"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Tasks & Assigned Field Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TaskList width={18} height={18} className="text-[#0B2B43]" />
                <h2 className="text-base font-bold text-[#081F2D]">
                  {lang === "bn" ? "নির্ধারিত কাজসমূহ" : "Assigned Tasks"}
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-mono">
                {myWorkData.tasks.length} Active
              </span>
            </div>

            <div className="space-y-2.5">
              {myWorkData.tasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-[#E7E7E2] hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-[#FF6B35]">
                      {task.id} • {task.projectName}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      task.priority === "CRITICAL"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : task.priority === "HIGH"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#081F2D]">
                    {lang === "bn" ? task.titleBn : task.titleEn}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                    <span>Due: {task.dueDate}</span>
                    <span>Assigned: {task.assignedTo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Priority Alerts & Agent Advisories */}
          <div className="space-y-6">
            {/* Priority Alerts */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <WarningTriangle width={18} height={18} className="text-amber-600" />
                <h2 className="text-base font-bold text-[#081F2D]">
                  {lang === "bn" ? "সিস্টেম ও কমপ্লায়েন্স সতর্কতা" : "Priority Alerts"}
                </h2>
              </div>

              <div className="space-y-2.5">
                {myWorkData.alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-lg border text-xs leading-relaxed ${
                      alt.severity === "CRITICAL"
                        ? "bg-rose-50 border-rose-200 text-rose-900"
                        : alt.severity === "WARNING"
                        ? "bg-amber-50 border-amber-200 text-amber-900"
                        : "bg-blue-50 border-blue-200 text-blue-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-[10px] uppercase">
                        [{alt.severity}] {alt.projectName}
                      </span>
                      <span className="text-[10px] font-mono opacity-80">{alt.timestamp}</span>
                    </div>
                    <div className="font-medium">
                      {lang === "bn" ? alt.titleBn : alt.titleEn}
                    </div>
                    <div className="text-[10px] opacity-75 mt-1 font-mono">
                      Source: {alt.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Agent Recommendations */}
            <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu width={18} height={18} className="text-[#0B2B43]" />
                  <h2 className="text-base font-bold text-[#081F2D]">
                    {lang === "bn" ? "স্বায়ত্তশাসিত এজেন্ট পর্যবেক্ষণ ও পরামর্শ" : "Autonomous Agent Advisories"}
                  </h2>
                </div>
                <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                  Level 0-3 Ceiling
                </span>
              </div>

              <div className="space-y-3">
                {myWorkData.messages.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/40 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#081F2D] text-xs">
                        {lang === "bn" ? msg.titleBn : msg.titleEn}
                      </span>
                      {msg.confidence && (
                        <span className="font-mono text-[10px] text-purple-700 font-semibold">
                          Confidence: {(msg.confidence * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="text-stone-700 leading-relaxed mt-1">
                      {lang === "bn" ? msg.bodyBn : msg.bodyEn}
                    </p>
                    <div className="text-[10px] font-mono text-stone-500 mt-2 flex items-center justify-between">
                      <span>Sender: {msg.sender}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 3. MANAGEMENT CONSOLES DIRECTORY (When activeTab === "management")
  // ===========================================================================
  if (activeTab === "management") {
    const accessibleCount = CONSOLES_CATALOG.filter((c) => getConsoleAccess(c.code) !== "DENIED").length;

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Management Directory Header */}
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 sm:p-8 shadow-sm">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#0B2B43]/5 text-[#0B2B43] border border-[#0B2B43]/15 mb-3">
              <Server width={14} height={14} className="text-[#FF6B35]" />
              <span>STFL CANONICAL GOVERNED INFRASTRUCTURE • 18 DEDICATED CONSOLES</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#081F2D] leading-tight mb-2">
              {lang === "bn" ? "প্রশাসনিক ও অবকাঠামো ব্যবস্থাপনা হাব" : "Governed Management & Administrative Consoles"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {lang === "bn"
                ? "এসটিএফএলের ১৮টি পরিচালিত কনসোল প্রকল্প পরিচালনাকারীদের প্রাথমিক কাজকে বিভ্রান্ত না করে ব্যাকএন্ড নিয়ন্ত্রণ স্তর হিসেবে সংরক্ষিত। ৬টি স্পষ্ট ক্লাস্টারে বিভক্ত এই কনসোলসমূহ সরাসরি প্ল্যাটফর্ম নিরাপত্তা ও সংবিধিবদ্ধ অডিটের সাথে যুক্ত।"
                : "The 18 canonical governed consoles serve as underlying administrative and control engines. Reorganized into 6 disciplined functional clusters, they protect separation of duties, hardware attestation, and statutory compliance."}
            </p>
          </div>

          {/* Quick Status Bar */}
          <div className="mt-6 pt-6 border-t border-[#E7E7E2] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "বর্তমান সিমুলেটেড ভূমিকা" : "Simulated Role"}
              </span>
              <span className="text-base font-bold text-[#081F2D] font-mono mt-0.5 block">
                {activeClass}
              </span>
              <span className="text-xs text-stone-500">
                {accessibleCount} of 18 consoles authorized
              </span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "দায়িত্ব পৃথকীকরণ" : "Separation of Duties"}
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                <Check width={14} height={14} />
                {activeClass === "CLASS_00"
                  ? (lang === "bn" ? "সুপার অ্যাডমিন অপারেশনাল ব্লকেড" : "Super Admin Mutations Blocked")
                  : (lang === "bn" ? "সাংবিধানিক নীতি সক্রিয়" : "Active & Enforced")}
              </span>
              <span className="text-[11px] text-stone-500 block">PostgreSQL Trigger Level</span>
            </div>

            <div className="bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2]">
              <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
                {lang === "bn" ? "এনক্লেভ হার্ডওয়্যার অবস্থা" : "Hardware Attestation"}
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 mt-1">
                <ShieldCheck width={14} height={14} />
                ATTESTATION ACTIVE
              </span>
              <span className="text-[11px] text-stone-500 block">Single KeyStore Bound</span>
            </div>
          </div>
        </div>

        {/* 6 Structured Clusters */}
        <div className="space-y-6">
          {managementClusters.map((cluster) => {
            const consolesInCluster = CONSOLES_CATALOG.filter((c) =>
              cluster.consoleCodes.includes(c.code)
            );

            return (
              <div key={cluster.clusterId} className="bg-white rounded-xl border border-[#E7E7E2] p-5 shadow-sm">
                <div className="mb-4 pb-3 border-b border-[#E7E7E2]">
                  <h2 className="text-base font-bold text-[#081F2D]">
                    {lang === "bn" ? cluster.nameBn : cluster.nameEn}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {lang === "bn" ? cluster.descriptionBn : cluster.descriptionEn}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {consolesInCluster.map((item) => {
                    const IconComp = ICON_MAP[item.code] || Server;
                    const access = getConsoleAccess(item.code);
                    const isDenied = access === "DENIED";
                    const isBlockedMutation =
                      activeClass === "CLASS_00" &&
                      (item.code === "finance" || item.code === "property" || item.code === "microfinance");

                    return (
                      <div
                        key={item.code}
                        className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${
                          isDenied
                            ? "bg-stone-50/50 border-stone-200 opacity-60"
                            : "bg-[#FAFAF8] border-[#E7E7E2] hover:border-[#0B2B43]/50 hover:shadow-sm"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded bg-white border border-[#E7E7E2] text-[#0B2B43]">
                                <IconComp width={16} height={16} />
                              </div>
                              <span className="text-[10px] font-mono font-bold text-stone-400">
                                CONSOLE {String(item.idNumber).padStart(2, "0")}
                              </span>
                            </div>

                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getBadgeStyle(access)}`}>
                              {access}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-[#081F2D] mb-1">
                            {lang === "bn" ? item.nameBn : item.nameEn}
                          </h3>

                          <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                            {lang === "bn" ? item.descriptionBn : item.descriptionEn}
                          </p>

                          {isBlockedMutation && (
                            <div className="mb-2 p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] text-amber-900 flex items-start gap-1">
                              <WarningTriangle width={12} height={12} className="text-amber-700 flex-shrink-0 mt-0.5" />
                              <span>Super Admin Mutation Blocked</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-[#E7E7E2] flex items-center justify-between text-xs">
                          <span className="text-[10px] font-mono text-stone-400 truncate max-w-[120px]">
                            {item.route}
                          </span>

                          {isDenied ? (
                            <span className="text-stone-400 text-[11px] flex items-center gap-1 cursor-not-allowed">
                              <Lock width={12} height={12} /> Denied
                            </span>
                          ) : (
                            <Link
                              href={item.route}
                              className="text-xs font-semibold text-[#0B2B43] hover:text-[#FF6B35] flex items-center gap-1 group"
                            >
                              <span>Enter</span>
                              <NavArrowRight width={13} height={13} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ===========================================================================
  // 4. CURRENT PROJECT WORKSPACE VIEW (When activeTab === "project")
  // ===========================================================================
  const project = activeProject;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4.1 CANONICAL PROJECT HEADER */}
      <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="max-w-3xl">
            {/* Project Status Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#081F2D] text-white">
                {project.id}
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                {project.status}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                {project.code}
              </span>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <MapPin width={13} height={13} className="text-[#FF6B35]" />
                {lang === "bn" ? project.jurisdictionBn : project.jurisdictionEn}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#081F2D] leading-tight mb-2">
              {lang === "bn" ? project.nameBn : project.nameEn}
            </h1>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              <strong>{lang === "bn" ? "উদ্দেশ্য:" : "Objective:"}</strong>{" "}
              {lang === "bn" ? project.objectiveBn : project.objectiveEn}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-500 pt-3 border-t border-stone-100">
              <span><strong>Owner:</strong> {lang === "bn" ? project.ownerBn : project.ownerEn}</span>
              <span><strong>Lead:</strong> {lang === "bn" ? project.managerBn : project.managerEn}</span>
              <span><strong>Timeline:</strong> {project.startDate} to {project.endDate}</span>
            </div>
          </div>

          {/* Quick Health & Risk Indicator Box */}
          <div className="bg-[#FAFAF8] p-4 rounded-xl border border-[#E7E7E2] flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">{lang === "bn" ? "প্রকল্প স্বাস্থ্য:" : "Health Score:"}</span>
              <span className="font-mono font-bold text-emerald-700">{project.kpis.healthScore}/100</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${project.kpis.healthScore}%` }}
              />
            </div>

            <div className="mt-2 pt-2 border-t border-stone-200/70 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">Funding</span>
                <span className="font-bold text-emerald-700">{project.fundingStatus}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">Risk Level</span>
                <span className={`font-bold ${project.riskStatus === "LOW" ? "text-emerald-700" : "text-amber-700"}`}>
                  {project.riskStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4.2 PROJECT FACET NAVIGATION TABS */}
        <div className="mt-6 pt-4 border-t border-[#E7E7E2] flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          {[
            { code: "overview", labelBn: "সারসংক্ষেপ", labelEn: "Overview", icon: Eye },
            { code: "operations", labelBn: "কার্যক্রম", labelEn: "Operations", icon: TaskList },
            { code: "outcomes", labelBn: "ফলাফল", labelEn: "Outcomes", icon: StatsReport },
            { code: "finance", labelBn: "অর্থায়ন", labelEn: "Finance", icon: Coins },
            { code: "people", labelBn: "ব্যক্তিবর্গ", labelEn: "People", icon: Group },
            { code: "assets", labelBn: "সম্পদ", labelEn: "Assets", icon: Package },
            { code: "documents", labelBn: "নথিপত্র", labelEn: "Documents", icon: Page },
            { code: "compliance", labelBn: "কমপ্লায়েন্স", labelEn: "Compliance", icon: ShieldAlert },
            { code: "governance", labelBn: "শাসন", labelEn: "Governance", icon: ShieldCheck },
          ].map((f) => {
            const Icon = f.icon;
            const isActive = activeProjectFacet === f.code;
            return (
              <button
                key={f.code}
                onClick={() => setActiveProjectFacet(f.code as ProjectFacet)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#081F2D] text-white shadow-sm font-semibold"
                    : "bg-[#FAFAF8] text-stone-600 hover:bg-stone-100 border border-[#E7E7E2]"
                }`}
              >
                <Icon width={14} height={14} className={isActive ? "text-[#FF6B35]" : "text-stone-500"} />
                <span>{lang === "bn" ? f.labelBn : f.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4.3 FACET CONTENT PROJECTIONS */}

      {/* =====================================================================
          FACET A: OVERVIEW (The 6 Questions + 10 Primary KPIs + Money->Work pipeline)
          ===================================================================== */}
      {activeProjectFacet === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          {/* 10 Primary KPI Blocks */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                1. PEOPLE REACHED
              </span>
              <span className="text-xl font-bold text-[#081F2D] font-mono mt-1 block">
                {project.kpis.peopleReached.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500">Target: {project.kpis.peopleReachedTarget.toLocaleString()}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                2. ACTIVITIES
              </span>
              <span className="text-xl font-bold text-[#081F2D] font-mono mt-1 block">
                {project.kpis.activitiesCount}
              </span>
              <span className="text-[11px] text-stone-500">Field Sessions</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                3. OUTPUTS
              </span>
              <span className="text-xl font-bold text-[#081F2D] font-mono mt-1 block">
                {project.kpis.outputsCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500">Verified Units</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                4. OUTCOMES %
              </span>
              <span className="text-xl font-bold text-[#FF6B35] font-mono mt-1 block">
                {project.kpis.outcomeAchievementPct}%
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">On Target</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                5. FUNDS RECEIVED
              </span>
              <span className="text-xl font-bold text-[#081F2D] font-mono mt-1 block">
                ৳{(project.kpis.fundsReceived / 10000000).toFixed(2)}Cr
              </span>
              <span className="text-[11px] text-stone-500">Endowment / Donor</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                6. TOTAL SPENT
              </span>
              <span className="text-xl font-bold text-emerald-800 font-mono mt-1 block">
                ৳{(project.kpis.totalSpent / 10000000).toFixed(2)}Cr
              </span>
              <span className="text-[11px] text-stone-500">{((project.kpis.totalSpent / project.kpis.fundsReceived) * 100).toFixed(1)}% of received</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                7. AVAILABLE FUNDS
              </span>
              <span className="text-xl font-bold text-[#0B2B43] font-mono mt-1 block">
                ৳{(project.kpis.availableFunds / 100000).toFixed(1)}L
              </span>
              <span className="text-[11px] text-stone-500">Uncommitted Liquidity</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                8. COST / OUTCOME
              </span>
              <span className="text-xl font-bold text-[#081F2D] font-mono mt-1 block">
                ৳{project.kpis.costPerOutcome.toFixed(2)}
              </span>
              <span className="text-[11px] text-stone-500">Per verified person</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                9. OVERHEAD %
              </span>
              <span className="text-xl font-bold text-emerald-700 font-mono mt-1 block">
                {project.kpis.overheadPct}%
              </span>
              <span className="text-[11px] text-stone-500">Statutory cap: 15%</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block">
                10. PROJECT HEALTH
              </span>
              <span className="text-xl font-bold text-emerald-700 font-mono mt-1 block">
                {project.health}
              </span>
              <span className="text-[11px] text-stone-500">Score: {project.kpis.healthScore}/100</span>
            </div>
          </div>

          {/* Money -> Work -> Outcome Pipeline Bar */}
          <div className="bg-[#081F2D] text-white p-6 rounded-xl shadow-sm border border-[#0B2B43]">
            <div className="flex items-center gap-2 mb-4">
              <Coins width={16} height={16} className="text-[#FF6B35]" />
              <span className="text-xs font-mono font-bold tracking-wider text-stone-300 uppercase">
                MONEY → WORK → OUTCOME VISUAL CHAIN
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-[#0B2B43] p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">1. Funds Received</span>
                <span className="font-bold text-sm text-white mt-1 block">{project.pipeline.fundsReceivedText}</span>
              </div>
              <div className="bg-[#0B2B43] p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">2. Committed</span>
                <span className="font-bold text-sm text-amber-300 mt-1 block">{project.pipeline.committedText}</span>
              </div>
              <div className="bg-[#0B2B43] p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">3. Direct Spend</span>
                <span className="font-bold text-sm text-emerald-400 mt-1 block">{project.pipeline.directExpenditureText}</span>
              </div>
              <div className="bg-[#0B2B43] p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">4. Outputs</span>
                <span className="font-bold text-sm text-white mt-1 block">{project.pipeline.outputsText}</span>
              </div>
              <div className="bg-[#0B2B43] p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">5. Outcomes</span>
                <span className="font-bold text-sm text-[#FF6B35] mt-1 block">{project.pipeline.outcomesTargetText}</span>
              </div>
              <div className="bg-[#0B2B43] p-3 rounded-lg border border-stone-700">
                <span className="text-[10px] font-mono text-stone-400 block uppercase">6. Impact</span>
                <span className="font-bold text-sm text-emerald-400 mt-1 block">{project.pipeline.verifiedImpactText}</span>
              </div>
            </div>
          </div>

          {/* The 6 Fundamental Operational Questions Answered */}
          <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#081F2D] mb-4">
              {lang === "bn" ? "প্রকল্প পরিচালনাকারীর ৬টি মৌলিক প্রশ্নের উত্তর" : "Executive Overview: The 6 Core Project Questions"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
              {/* Q1 */}
              <div className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2]">
                <span className="text-[10px] font-mono font-bold text-[#FF6B35] uppercase block mb-1">
                  1. WHAT ARE WE DOING?
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {lang === "bn"
                    ? "১৮টি প্রত্যন্ত চরের স্কুলে ৭,৬৮০ জন সুবিধাবঞ্চিত শিক্ষার্থীকে মানসম্পন্ন পাঠ্যপুস্তক, স্কুলের পোশাক এবং সৌর ট্যাবলেট লার্নিং স্টেশন প্রদান করা হচ্ছে।"
                    : "Delivering primary education support, textbooks, uniforms, and solar tablet learning stations across 18 remote riverine island schools in Sylhet and Kurigram."}
                </p>
              </div>

              {/* Q2 */}
              <div className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2]">
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block mb-1">
                  2. WHAT HAS BEEN DONE?
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {lang === "bn"
                    ? "১ম প্রান্তিকের পাঠ্যপুস্তক বিতরণ শতভাগ সম্পন্ন হয়েছে এবং ১২০টি শিক্ষক প্রশিক্ষণ সেশন পরিচালিত হয়েছে। ৭,৬৮০ জন শিক্ষার্থী নিবন্ধিত।"
                    : "Completed 100% textbook and uniform distribution across 18 schools. Executed 120 teacher digital pedagogy sessions, reaching 7,680 enrolled students."}
                </p>
              </div>

              {/* Q3 */}
              <div className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2]">
                <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block mb-1">
                  3. WHAT CHANGED?
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {lang === "bn"
                    ? "চরাঞ্চলে তীব্র নদীভাঙনের কারণে ৩টি স্কুল পয়েন্ট স্থানান্তর করা হয়েছে। অতিরিক্ত ২৪০টি রাগডাইজড সৌর ট্যাবলেট সংগ্রহ তালিকাভুক্ত হয়েছে।"
                    : "3 school hubs relocated due to riverbank erosion. Added 240 ruggedized solar literacy tablets to procurement pipeline to prevent seasonal disruption."}
                </p>
              </div>

              {/* Q4 */}
              <div className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2]">
                <span className="text-[10px] font-mono font-bold text-purple-700 uppercase block mb-1">
                  4. WHAT DID IT COST?
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {lang === "bn"
                    ? "মোট ব্যয় ৳৮৪,০০,০০০। এর মধ্যে সরাসরি প্রকল্প ব্যয় ৳৮১,৩১,২০০ (৯৬.৮%) এবং প্রশাসনিক ওভারহেড মাত্র ৳২,৬৮,৮০০ (৩.২%)।"
                    : "Total expenditure to date: ৳8,400,000. Partitioned into ৳8,131,200 (96.8%) direct field spend and only ৳268,800 (3.2%) administrative overhead."}
                </p>
              </div>

              {/* Q5 */}
              <div className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E7E7E2]">
                <span className="text-[10px] font-mono font-bold text-stone-600 uppercase block mb-1">
                  5. WHAT REMAINS?
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {lang === "bn"
                    ? "বাকি রয়েছে ৭২০ জন শিক্ষার্থীর ৩য় প্রান্তিক সাক্ষরতা নিরীক্ষা এবং অবরাদ্দকৃত ৳৩৬,০০,০০০ উদ্বৃত্ত তহবিল শীতবস্ত্রের জন্য বিবেচনাধীন।"
                    : "720 students remaining to reach full 8,400 target. ৳3,600,000 uncommitted liquidity available for planned winter clothing expansion."}
                </p>
              </div>

              {/* Q6 */}
              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-mono font-bold text-amber-800 uppercase block mb-1">
                  6. WHAT NEEDS ATTENTION?
                </span>
                <p className="text-amber-950 leading-relaxed">
                  {lang === "bn"
                    ? "সৌর ট্যাবলেট ক্রয়ে ৳১,৮৫,০০০ ভ্যারিয়েন্স চিহ্নিত হয়েছে; লেভেল ৩ ডুয়াল-কন্ট্রোল অনুমোদন না পাওয়া পর্যন্ত সরবরাহ আটকে রয়েছে।"
                    : "Level 3 dual-control approval required for ৳185,000 procurement variance flagged by Finance Agent. Solar tablet release remains gated."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET B: OPERATIONS (Activities, Status, Owner, Budget, Evidence)
          ===================================================================== */}
      {activeProjectFacet === "operations" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E7E2]">
            <div>
              <h2 className="text-base font-bold text-[#081F2D]">
                {lang === "bn" ? "মাঠপর্যায়ের কার্যক্রম ও কর্মপ্রচেষ্টা (Operations)" : "Project Operations & Field Activities"}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {lang === "bn"
                  ? "মাঠে প্রকৃতপক্ষে কী কাজ হচ্ছে তা নিরীক্ষাযোগ্য প্রমাণপত্র এবং বাজেট বরাদ্দের সাথে যুক্ত।"
                  : "Tracks scheduled activities, delivery ownership, geographic locations, and immutable evidence links."}
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {["ALL", "PLANNED", "IN_PROGRESS", "COMPLETED", "BLOCKED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setOperationFilter(st)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    operationFilter === st
                      ? "bg-[#081F2D] text-white"
                      : "bg-[#FAFAF8] text-stone-600 hover:bg-stone-100 border border-[#E7E7E2]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {project.operations
              .filter((op) => operationFilter === "ALL" || op.status === operationFilter)
              .map((op) => (
                <div
                  key={op.id}
                  className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#FF6B35]">
                        {op.id}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          op.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : op.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : op.status === "BLOCKED"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-stone-100 text-stone-700 border border-stone-200"
                        }`}
                      >
                        {op.status}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {op.schedule}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#081F2D]">
                      {lang === "bn" ? op.nameBn : op.nameEn}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
                      <span>Owner: <strong>{op.owner}</strong> ({op.team})</span>
                      <span>Location: {op.location}</span>
                      <span>Evidence: <strong className="font-mono text-[#0B2B43]">{op.evidenceId}</strong></span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs space-y-1">
                    <div>Budget: <strong>৳{op.budget.toLocaleString()}</strong></div>
                    <div className="text-stone-500">Spent: ৳{op.spent.toLocaleString()}</div>
                    {op.issuesCount > 0 && (
                      <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-200 inline-block">
                        {op.issuesCount} Issue Reported
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET C: OUTCOMES (Input -> Activity -> Output -> Outcome -> Impact)
          ===================================================================== */}
      {activeProjectFacet === "outcomes" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-[#081F2D]">
              {lang === "bn" ? "প্রভাব ও ফলাফল পরিমাপ (Outcomes & Impact Framework)" : "Outcomes & Verified Impact Framework"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {lang === "bn"
                ? "কর্মকান্ডের সংখ্যা আর বাস্তব প্রভাব এক নয়। এখানে প্রতিটি ফলাফল বেসলাইন ও তৃতীয় পক্ষীয় নিরীক্ষার মাধ্যমে যাচাইকৃত।"
                : "Distinguishes Activities from Outputs, Outcomes, and verified long-term Impact with baseline benchmarking."}
            </p>
          </div>

          <div className="space-y-4">
            {project.outcomes.map((out) => {
              const progressPct = Math.min(100, Math.round((out.actual / out.target) * 100));
              return (
                <div key={out.id} className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#FF6B35]">
                        {out.id} • {out.measurementPeriod}
                      </span>
                      <h3 className="text-sm font-bold text-[#081F2D] mt-0.5">
                        {lang === "bn" ? out.titleBn : out.titleEn}
                      </h3>
                    </div>

                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded self-start sm:self-auto">
                      {out.verificationState} ({(out.confidence * 100).toFixed(0)}% Confidence)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-stone-500">Baseline: {out.baseline} {out.unit}</span>
                      <span className="font-bold text-[#081F2D]">
                        Actual: {out.actual} / Target: {out.target} {out.unit} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#FF6B35] h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between text-[11px] text-stone-500">
                    <span>Methodology: <strong>{out.methodology}</strong></span>
                    <span>Evidence Ref: <strong className="font-mono text-[#0B2B43]">{out.evidenceRef}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET D: FINANCE (Direct vs Shared vs Overhead, Ledger Ratios)
          ===================================================================== */}
      {activeProjectFacet === "finance" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Expenditure Partitioning Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">
                DIRECT PROJECT EXPENDITURE
              </span>
              <span className="text-2xl font-bold text-[#081F2D] font-mono mt-1 block">
                ৳{project.finance.directExpenditure.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
                {((project.finance.directExpenditure / project.finance.budgetSpent) * 100).toFixed(1)}% of total project spend
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase block">
                INDIRECT / SHARED EXPENDITURE
              </span>
              <span className="text-2xl font-bold text-[#081F2D] font-mono mt-1 block">
                ৳{project.finance.sharedExpenditure.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
                {((project.finance.sharedExpenditure / project.finance.budgetSpent) * 100).toFixed(1)}% cross-unit allocation
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#E7E7E2] shadow-sm">
              <span className="text-[10px] font-mono font-bold text-purple-700 uppercase block">
                ADMINISTRATIVE OVERHEAD
              </span>
              <span className="text-2xl font-bold text-[#081F2D] font-mono mt-1 block">
                ৳{project.finance.overheadExpenditure.toLocaleString()}
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
                <strong>{project.kpis.overheadPct}%</strong> of total project spend
              </span>
            </div>
          </div>

          {/* Meaningful Financial Ratios & Control */}
          <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#081F2D] mb-4">
              {lang === "bn" ? "প্রকল্পের আর্থিক অনুপাত ও নিয়ন্ত্রণ সূচক" : "Project Control Ratios & Ledger Reconciliation"}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                <span className="text-stone-500 block">Cost per Verified Outcome</span>
                <span className="text-base font-bold text-[#081F2D] font-mono mt-0.5 block">
                  ৳{project.finance.costPerBeneficiary.toFixed(2)}
                </span>
              </div>
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                <span className="text-stone-500 block">Outcome per ৳1,000</span>
                <span className="text-base font-bold text-[#FF6B35] font-mono mt-0.5 block">
                  {project.finance.outcomePer1000Bdt} citizens
                </span>
              </div>
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                <span className="text-stone-500 block">Budget Utilization</span>
                <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block">
                  {project.finance.budgetUtilizationPct}%
                </span>
              </div>
              <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2]">
                <span className="text-stone-500 block">Bank Reconciled</span>
                <span className="text-base font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Check width={14} height={14} /> Reconciled
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E7E7E2] flex flex-wrap items-center justify-between text-xs text-stone-600">
              <span>Outstanding Payables: <strong className="font-mono text-amber-700">৳{project.finance.payables.toLocaleString()}</strong></span>
              <span>Receivables: <strong className="font-mono text-emerald-700">৳{project.finance.receivables.toLocaleString()}</strong></span>
              <span className="font-mono text-[11px] text-stone-400">PostgreSQL NUMERIC(18,4) Sovereign Precision</span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET E: PEOPLE (Party != User != Role != Relationship)
          ===================================================================== */}
      {activeProjectFacet === "people" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-[#081F2D]">
              {lang === "bn" ? "প্রকল্পের সংশ্লিষ্ট ব্যক্তিবর্গ ও অংশীদার (People)" : "Project People & Stakeholder Directory"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Party ≠ User ≠ Role ≠ Relationship. A person can simultaneously hold different project relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.people.map((p) => (
              <div key={p.partyId} className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-stone-400">{p.partyId}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                      {p.relationship}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#081F2D]">{p.name}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{lang === "bn" ? p.roleBn : p.roleEn}</p>
                </div>
                <div className="text-right text-xs text-stone-500 font-mono">
                  <div>{p.location}</div>
                  <div className="text-[11px] text-stone-400">{p.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET F: ASSETS (Equipment, Vehicles, QR Tags)
          ===================================================================== */}
      {activeProjectFacet === "assets" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-[#081F2D]">
              {lang === "bn" ? "প্রকল্পে ব্যবহৃত স্থায়ী ও চলমান সম্পদ (Assets)" : "Project Dedicated Assets & Fleet"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Governed by immutable asset registry, straight-line depreciation, and NFC/QR hardware attestation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.assets.map((ast) => (
              <div key={ast.assetId} className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#FF6B35]">{ast.assetId}</span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {ast.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#081F2D] mb-1">
                  {lang === "bn" ? ast.nameBn : ast.nameEn}
                </h3>
                <div className="text-[11px] text-stone-500 font-mono space-y-0.5 pt-2 border-t border-stone-200">
                  <div>Tag: <strong>{ast.tagId}</strong></div>
                  <div>Location: {ast.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET G: DOCUMENTS (Immutable Hash, Public Verification Link)
          ===================================================================== */}
      {activeProjectFacet === "documents" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-[#081F2D]">
              {lang === "bn" ? "প্রকল্পের ডিজিটাল নথিপত্র ও সনদ (Documents)" : "Immutable Project Documents & Contracts"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Public verification available via /verify/&#123;document_id&#125;. No private metadata leaked.
            </p>
          </div>

          <div className="space-y-3">
            {project.documents.map((doc) => (
              <div key={doc.documentId} className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                      {doc.type}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">Issued: {doc.issuedDate}</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#081F2D]">
                    {lang === "bn" ? doc.titleBn : doc.titleEn}
                  </h3>
                  <div className="text-[10px] font-mono text-stone-400 truncate max-w-md mt-0.5">
                    Hash: {doc.hash}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {doc.status}
                  </span>
                  <Link
                    href={`/verify/${doc.documentId}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B2B43] hover:text-[#FF6B35] underline"
                  >
                    <span>Verify QR</span>
                    <ArrowRight width={12} height={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET H: COMPLIANCE (21 Domains, Clearance States)
          ===================================================================== */}
      {activeProjectFacet === "compliance" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-[#081F2D]">
              {lang === "bn" ? "আইনগত ও নিয়ন্ত্রক সম্মতি (Compliance)" : "Statutory & Regulatory Compliance Status"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Continuously monitors statutory limits, labour laws, safeguarding, and NGO Affairs Bureau requirements.
            </p>
          </div>

          <div className="space-y-3">
            {project.compliance.map((c) => (
              <div key={c.domainId} className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#081F2D]">
                    {lang === "bn" ? c.nameBn : c.nameEn}
                  </h3>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      c.status === "CLEAR"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : c.status === "WARNING"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="text-[11px] text-stone-600">{c.details}</div>
                <div className="text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-200 flex justify-between">
                  <span>Ref: {c.statutoryRef}</span>
                  <span>Evaluated: {c.lastEvaluated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          FACET I: GOVERNANCE (Approvals, SoD, Risk Register)
          ===================================================================== */}
      {activeProjectFacet === "governance" && (
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-sm space-y-4 animate-fadeIn">
          <div>
            <h2 className="text-base font-bold text-[#081F2D]">
              {lang === "bn" ? "শাসন, অনুমোদন ও ঝুঁকি রেজিস্টার (Governance)" : "Project Governance, Dual-Control & Risk"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              PostgreSQL anti-collusion triggers enforce: Requisitioner ≠ Approver ≠ Disburser.
            </p>
          </div>

          <div className="space-y-3">
            {project.governance.map((gov) => (
              <div key={gov.id} className="p-4 rounded-lg border border-[#E7E7E2] bg-[#FAFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      Level {gov.level} {gov.type}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400">{gov.date}</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#081F2D]">
                    {lang === "bn" ? gov.titleBn : gov.titleEn}
                  </h3>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Authority: <strong>{gov.actor}</strong>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold text-[#0B2B43] bg-stone-100 px-2.5 py-1 rounded border border-stone-300">
                  {gov.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
