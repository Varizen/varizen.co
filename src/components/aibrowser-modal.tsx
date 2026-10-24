"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Download, Terminal, Copy, Check, Eye, Shield, Cpu, X, RotateCcw, ArrowLeft, ArrowRight, Lock, Sparkles } from "lucide-react";

interface AiBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function AiBrowserModal({ isOpen, onClose }: AiBrowserModalProps) {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [activeTab, setActiveTab] = useState<"simulator" | "download">("simulator");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Simulator state
  const [urlInput, setUrlInput] = useState("https://varizen.co");
  const [currentUrl, setCurrentUrl] = useState("https://varizen.co");
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [shieldBlocked, setShieldBlocked] = useState(3);
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "eye"; text: string }>>([
    {
      sender: "eye",
      text: "Eye AI initialized inside AiBrowser container. Web content is isolated in <web_content> untrusted envelopes.",
    },
  ]);

  if (!isOpen || !mounted) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target;
    }
    setCurrentUrl(target);
    setUrlInput(target);
    setShieldBlocked((prev) => prev + Math.floor(Math.random() * 3) + 1);
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    const q = aiQuery;
    setAiQuery("");
    setChatLog((prev) => [...prev, { sender: "user", text: q }]);

    setTimeout(() => {
      let reply = "Eye AI verified: no telemetry leaked, tracker requests dropped by Eye Shield.";
      if (q.toLowerCase().includes("summar")) {
        reply = "Summary for " + currentUrl + ": Governed enterprise digital headquarters foundation with isolated execution.";
      } else if (q.toLowerCase().includes("shield") || q.toLowerCase().includes("protect")) {
        reply = `Eye Shield active: blocked ${shieldBlocked} tracking & profiling calls on this origin.`;
      } else if (q.toLowerCase().includes("mcp")) {
        reply = "MCP Server connection status: Ready. Tools are guarded behind user approval.";
      }
      setChatLog((prev) => [...prev, { sender: "eye", text: reply }]);
    }, 400);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#121212] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-[#181818]">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block cursor-pointer" onClick={onClose} />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-sm tracking-tight text-white">AiBrowser / Eye Browser</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                v0.1.0 Portable
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                activeTab === "simulator"
                  ? "bg-white/10 text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Browse in Browser
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`px-3 py-1 text-xs rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === "download"
                  ? "bg-emerald-500 text-black font-semibold"
                  : "bg-white/5 text-neutral-300 hover:text-white border border-white/10"
              }`}
            >
              <Download className="w-3 h-3" />
              Get .exe (.zip)
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white ml-2 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Browser inside browser Simulator */}
        {activeTab === "simulator" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chrome Header */}
            <div className="bg-[#1e1e1e] border-b border-white/10 px-3 py-2 flex items-center gap-2">
              <div className="flex items-center gap-1 text-neutral-400">
                <button className="p-1 hover:bg-white/10 rounded"><ArrowLeft className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-white/10 rounded"><ArrowRight className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-white/10 rounded" onClick={() => setCurrentUrl(urlInput)}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Omnibox */}
              <form onSubmit={handleNavigate} className="flex-1 flex items-center">
                <div className="w-full flex items-center bg-[#121212] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus-within:border-emerald-500/50">
                  <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-transparent outline-none text-neutral-100"
                    placeholder="Search or enter URL..."
                  />
                  <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10 shrink-0">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] text-blue-400 font-mono font-medium">{shieldBlocked} blocked</span>
                  </div>
                </div>
              </form>

              {/* AI toggle */}
              <button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs border ${
                  aiPanelOpen
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                }`}
                title="Toggle Eye AI Sidebar"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Eye AI</span>
              </button>
            </div>

            {/* Viewport & AI split */}
            <div className="flex-1 flex overflow-hidden">
              {/* Interactive Virtual Sandboxed Viewport */}
              <div className="flex-1 bg-[#0d0f0e] relative flex flex-col overflow-y-auto">
                <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-6">
                  {/* Origin Banner */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-neutral-300">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono text-neutral-200">{currentUrl}</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        TLS Encrypted · Sandboxed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-neutral-400 font-mono">Isolated Context</span>
                    </div>
                  </div>

                  {/* Shield Interception Card */}
                  <div className="p-4 rounded-xl bg-blue-500/[0.05] border border-blue-500/20 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold">
                      <Shield className="w-4 h-4" />
                      <span>Eye Shield Active Protection</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      Blocked <strong className="text-blue-300">{shieldBlocked} telemetry beacons</strong>, analytics scripts, and third-party tracking pixels on this origin. No cookies or device fingerprints were permitted to cross origins.
                    </p>
                  </div>

                  {/* Mock Page Content Canvas */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <h4 className="text-base font-semibold text-white">
                        {currentUrl.includes("varizen") ? "Varizen Inc. Digital Headquarters" : "Sandboxed Web Session"}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-500">Rendered in Memory</span>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {currentUrl.includes("varizen")
                        ? "Operating platform for digital trust, cybersecurity, and governed AI. Enterprise infrastructure where security posture, evidence-led telemetry, and private execution are mathematically provable."
                        : `Viewing session for ${currentUrl}. External web content is strictly isolated within zero-privilege memory boundaries to prevent untrusted prompt-injection attacks.`}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                          MCP Interface
                        </span>
                        <span className="text-xs text-neutral-200 font-medium">Model Context Protocol Enabled</span>
                      </div>
                      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                          Execution Boundary
                        </span>
                        <span className="text-xs text-emerald-400 font-medium">Chromium Sandboxed (No Leak)</span>
                      </div>
                    </div>
                  </div>

                  {/* Native App Upsell Banner */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-white">Want to browse any website with native speed?</p>
                      <p className="text-[11px] text-neutral-400">
                        The native Windows app has unrestricted real-world navigation, zero iframe limits, and direct MCP tool servers.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("download")}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Get Native App
                    </button>
                  </div>
                </div>

                <div className="mt-auto border-t border-white/10 bg-neutral-950/90 backdrop-blur px-4 py-2 flex items-center justify-between text-xs text-neutral-300">
                  <span className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 inline" />
                    AiBrowser Web Sandbox. Safe, zero-leak simulated viewport.
                  </span>
                  <button
                    onClick={() => setActiveTab("download")}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" /> Download Native Windows .exe
                  </button>
                </div>
              </div>

              {/* Eye AI Lateral Panel */}
              {aiPanelOpen && (
                <div className="w-80 border-l border-white/10 bg-[#141414] flex flex-col justify-between">
                  <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">Eye AI Sidecar</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">Free Gateway</span>
                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
                    {chatLog.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl ${
                          msg.sender === "user"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 ml-4"
                            : "bg-white/5 border border-white/10 text-neutral-300 mr-4"
                        }`}
                      >
                        <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">
                          {msg.sender === "user" ? "You" : "Eye AI"}
                        </div>
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Prompt Quick Chips */}
                  <div className="p-2 border-t border-white/5 flex gap-1 overflow-x-auto text-[10px]">
                    <button
                      onClick={() => {
                        setChatLog((prev) => [...prev, { sender: "user", text: "Summarize this page" }]);
                        setTimeout(() => {
                          setChatLog((prev) => [
                            ...prev,
                            { sender: "eye", text: "Summarizing " + currentUrl + ": Verified private session." },
                          ]);
                        }, 400);
                      }}
                      className="whitespace-nowrap px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-neutral-300"
                    >
                      Summarize
                    </button>
                    <button
                      onClick={() => {
                        setChatLog((prev) => [...prev, { sender: "user", text: "Inspect tracking & scripts" }]);
                        setTimeout(() => {
                          setChatLog((prev) => [
                            ...prev,
                            { sender: "eye", text: `Eye Shield analysis: blocked ${shieldBlocked} trackers.` },
                          ]);
                        }, 400);
                      }}
                      className="whitespace-nowrap px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-neutral-300"
                    >
                      Shield status
                    </button>
                  </div>

                  {/* Query input */}
                  <form onSubmit={handleAskAi} className="p-3 border-t border-white/10 flex gap-2">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="Ask Eye AI about this page..."
                      className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 outline-none focus:border-emerald-500/50"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold rounded-lg transition-colors"
                    >
                      Ask
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Download PC Executable (.zip / .exe) + CLI Wget */}
        {activeTab === "download" && (
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Download AiBrowser for Windows</h3>
                <p className="text-neutral-400 text-sm">
                  Run the standalone native Chromium browser with built-in Eye Shield tracker blocking, local MCP client, and zero-leak Eye AI.
                </p>
              </div>

              {/* Direct Download Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">AiBrowser 0.1.0 (Windows Portable)</span>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Standalone ZIP
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Compressed 77 MB package containing <code>AiBrowser 0.1.0.exe</code>. Unzip and run directly — no installation or admin rights required.
                  </p>
                </div>

                <a
                  href="/api/download/aibrowser"
                  download="AiBrowser-win-x64.zip"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  Download .zip
                </a>
              </div>

              {/* Terminal CLI Wget / Curl Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                    Quick CLI Commands (wget / curl / powershell)
                  </h4>
                </div>

                {/* wget */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs flex items-center justify-between gap-3">
                  <div className="overflow-x-auto text-neutral-300">
                    <span className="text-neutral-500"># wget command</span>
                    <br />
                    <code>wget https://varizen.co/api/download/aibrowser -O AiBrowser-win-x64.zip</code>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "wget https://varizen.co/api/download/aibrowser -O AiBrowser-win-x64.zip",
                        "wget"
                      )
                    }
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedCmd === "wget" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* curl */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs flex items-center justify-between gap-3">
                  <div className="overflow-x-auto text-neutral-300">
                    <span className="text-neutral-500"># curl command</span>
                    <br />
                    <code>curl -L https://varizen.co/api/download/aibrowser -o AiBrowser-win-x64.zip</code>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "curl -L https://varizen.co/api/download/aibrowser -o AiBrowser-win-x64.zip",
                        "curl"
                      )
                    }
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedCmd === "curl" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* PowerShell */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-3 font-mono text-xs flex items-center justify-between gap-3">
                  <div className="overflow-x-auto text-neutral-300">
                    <span className="text-neutral-500"># PowerShell one-liner (Download &amp; Extract)</span>
                    <br />
                    <code>
                      irm https://varizen.co/api/download/aibrowser -OutFile AiBrowser.zip; Expand-Archive AiBrowser.zip .\AiBrowser
                    </code>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        "irm https://varizen.co/api/download/aibrowser -OutFile AiBrowser.zip; Expand-Archive AiBrowser.zip .\\AiBrowser",
                        "ps"
                      )
                    }
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedCmd === "ps" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Architecture specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <Shield className="w-4 h-4 text-blue-400 mb-2" />
                  <h5 className="text-xs font-semibold text-white mb-1">Eye Shield</h5>
                  <p className="text-[11px] text-neutral-400">Strict permission isolation, tracker blocking, HTTPS-first upgrades.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <Cpu className="w-4 h-4 text-purple-400 mb-2" />
                  <h5 className="text-xs font-semibold text-white mb-1">MCP Client</h5>
                  <p className="text-[11px] text-neutral-400">JSON-RPC stdio protocol. All agent tools require explicit user consent.</p>
                </div>
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.02]">
                  <Eye className="w-4 h-4 text-emerald-400 mb-2" />
                  <h5 className="text-xs font-semibold text-white mb-1">Free Dual-Key AI</h5>
                  <p className="text-[11px] text-neutral-400">Zero keys in client. Free models only, bounded by OpenRouter policy.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
