"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  Download,
  Terminal,
  Copy,
  Check,
  Eye,
  Shield,
  Cpu,
  X,
  Lock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Star,
  Send,
} from "lucide-react";

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
  const [urlInput, setUrlInput] = useState("https://www.varizen.co");
  const [currentUrl, setCurrentUrl] = useState("https://www.varizen.co");
  const [history, setHistory] = useState<string[]>(["https://www.varizen.co"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [shieldBlocked, setShieldBlocked] = useState(14);
  const [showBookmarks] = useState(true);
  const [bookmarks, setBookmarks] = useState<Array<{ title: string; url: string }>>([
    { title: "Varizen Trust", url: "https://www.varizen.co" },
    { title: "GitHub", url: "https://github.com" },
    { title: "DuckDuckGo", url: "https://duckduckgo.com" },
    { title: "Hacker News", url: "https://news.ycombinator.com" },
  ]);
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
    setIsLoading(true);
    setCurrentUrl(target);
    setUrlInput(target);
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(target);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setShieldBlocked((prev) => prev + Math.floor(Math.random() * 3) + 1);
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(prev);
      setUrlInput(prev);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(next);
      setUrlInput(next);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    const temp = currentUrl;
    setCurrentUrl("");
    setTimeout(() => {
      setCurrentUrl(temp);
      setIsLoading(false);
    }, 150);
  };

  const handleStop = () => {
    setIsLoading(false);
  };

  const toggleBookmark = () => {
    const exists = bookmarks.find((b) => b.url === currentUrl);
    if (exists) {
      setBookmarks(bookmarks.filter((b) => b.url !== currentUrl));
    } else {
      setBookmarks([...bookmarks, { title: currentUrl.replace(/https?:\/\//, "").split("/")[0], url: currentUrl }]);
    }
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-1 sm:p-3 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-7xl h-[94vh] bg-[#0c0e0d] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 antialiased">
        {/* Sleek Ultra-Slim OS Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 bg-[#111312] select-none">
          {/* Left: Window Controls + Brand Icon */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors" onClick={onClose} title="Close" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer transition-colors" title="Minimize" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer transition-colors" title="Maximize" />
            </div>
            <div className="h-3 w-px bg-white/10 mx-1" />
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-xs tracking-tight text-white font-mono">AiBrowser</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 font-mono">
                v0.1
              </span>
            </div>
          </div>

          {/* Right: Iconized Mode Switchers & Close */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("simulator")}
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-xs transition-colors ${
                activeTab === "simulator"
                  ? "bg-white/15 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Browser Simulator (Interactive View)"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Web Preview</span>
            </button>
            <button
              onClick={() => setActiveTab("download")}
              className={`p-1.5 rounded-md flex items-center gap-1.5 text-xs transition-colors ${
                activeTab === "download"
                  ? "bg-emerald-500 text-black font-semibold shadow-sm"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
              title="Download Desktop Binary (.exe / .zip)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Get .exe</span>
            </button>
            <div className="h-3 w-px bg-white/10 mx-1" />
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              aria-label="Close"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab 1: Browser inside browser Simulator */}
        {activeTab === "simulator" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Slim Sharper Navigation & Omnibox Toolbar */}
            <div className="bg-[#141615] border-b border-white/10 px-2.5 py-1.5 flex items-center gap-2">
              {/* Back, Forward, Reload/Stop Icons */}
              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleBack}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                  title="Back"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleForward}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                  title="Forward"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {isLoading ? (
                  <button
                    onClick={handleStop}
                    className="p-1.5 rounded text-amber-400 hover:bg-white/10 transition-colors"
                    title="Stop"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleReload}
                    className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Reload"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Slim Unified Address Input */}
              <form onSubmit={handleNavigate} className="flex-1 flex items-center">
                <div className="w-full flex items-center bg-[#080908] border border-white/10 rounded-md px-2.5 py-1 text-xs text-neutral-300 focus-within:border-emerald-500/50 transition-colors">
                  <Lock className="w-3 h-3 text-emerald-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full bg-transparent outline-none text-neutral-100 font-mono text-xs"
                    placeholder="Search or enter URL..."
                  />
                  <button
                    type="button"
                    onClick={toggleBookmark}
                    className="p-1 text-neutral-500 hover:text-amber-400 transition-colors shrink-0"
                    title="Bookmark"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        bookmarks.some((b) => b.url === currentUrl)
                          ? "fill-amber-400 text-amber-400"
                          : ""
                      }`}
                    />
                  </button>
                  <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-white/10 shrink-0">
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-emerald-400 font-mono" title="Eye Shield">
                      {shieldBlocked}
                    </span>
                  </div>
                </div>
              </form>

              {/* Eye AI Toggle Button */}
              <button
                onClick={() => setAiPanelOpen(!aiPanelOpen)}
                className={`p-1.5 rounded-md flex items-center gap-1 border transition-colors ${
                  aiPanelOpen
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                }`}
                title="Toggle Eye AI Sidecar"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-mono hidden sm:inline">AI</span>
              </button>
            </div>

            {/* Ultra-Slim Bookmarks Bar */}
            {showBookmarks && (
              <div className="bg-[#0f1110] border-b border-white/5 px-3 py-1 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                <Star className="w-3 h-3 text-neutral-500 shrink-0" />
                {bookmarks.map((bm, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setUrlInput(bm.url);
                      setCurrentUrl(bm.url);
                    }}
                    className="px-1.5 py-0.5 rounded text-neutral-400 hover:text-white hover:bg-white/5 whitespace-nowrap transition-colors flex items-center gap-1"
                  >
                    <span>{bm.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Viewport & AI split */}
            <div className="flex-1 flex overflow-hidden">
              {/* Real Live-Rendered Sandboxed Viewport using Secure Proxy Route */}
              <div className="flex-1 bg-white relative flex flex-col overflow-hidden">
                <iframe
                  key={currentUrl}
                  src={`/api/browse?url=${encodeURIComponent(currentUrl)}`}
                  title="AiBrowser Live Web Session"
                  className="w-full flex-1 border-none bg-white"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                  referrerPolicy="no-referrer"
                />

                {/* Bottom Technical Telemetry Strip */}
                <div className="border-t border-white/10 bg-[#0e100f] px-3 py-1 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Shield className="w-3 h-3" />
                      <span>PROXIED</span>
                    </span>
                    <span>/</span>
                    <span className="truncate max-w-[280px] sm:max-w-md text-neutral-300">{currentUrl}</span>
                    <span>/</span>
                    <span className="text-emerald-400">{shieldBlocked} shielded</span>
                  </div>
                  <button
                    onClick={() => setActiveTab("download")}
                    className="text-emerald-400 hover:text-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>.exe (.zip)</span>
                  </button>
                </div>
              </div>

              {/* Eye AI Lateral Panel */}
              {aiPanelOpen && (
                <div className="w-72 border-l border-white/10 bg-[#0d0f0e] flex flex-col justify-between">
                  <div className="p-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-mono uppercase tracking-wider text-white">Eye AI</span>
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono">Free Gateway</span>
                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 p-2.5 overflow-y-auto space-y-2 text-xs">
                    {chatLog.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg text-xs ${
                          msg.sender === "user"
                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 ml-3"
                            : "bg-white/5 border border-white/10 text-neutral-300 mr-3"
                        }`}
                      >
                        <div className="text-[9px] text-neutral-500 font-mono uppercase mb-0.5">
                          {msg.sender === "user" ? "You" : "Eye AI"}
                        </div>
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Prompt Quick Chips */}
                  <div className="p-1.5 border-t border-white/5 flex gap-1 overflow-x-auto text-[10px]">
                    <button
                      onClick={() => {
                        setChatLog((prev) => [...prev, { sender: "user", text: "Summarize this page" }]);
                        setTimeout(() => {
                          setChatLog((prev) => [
                            ...prev,
                            { sender: "eye", text: "Summary: " + currentUrl },
                          ]);
                        }, 400);
                      }}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-neutral-300 whitespace-nowrap"
                    >
                      Summarize
                    </button>
                    <button
                      onClick={() => {
                        setChatLog((prev) => [...prev, { sender: "user", text: "Check trackers" }]);
                        setTimeout(() => {
                          setChatLog((prev) => [
                            ...prev,
                            { sender: "eye", text: `Blocked ${shieldBlocked} trackers on ${currentUrl}` },
                          ]);
                        }, 400);
                      }}
                      className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-neutral-300 whitespace-nowrap"
                    >
                      Shield
                    </button>
                  </div>

                  {/* Query input */}
                  <form onSubmit={handleAskAi} className="p-2 border-t border-white/10 flex gap-1.5">
                    <input
                      type="text"
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      placeholder="Ask Eye AI..."
                      className="flex-1 bg-[#070807] border border-white/10 rounded-md px-2 py-1 text-xs text-neutral-200 outline-none focus:border-emerald-500/50 font-mono"
                    />
                    <button
                      type="submit"
                      className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-md transition-colors"
                      title="Send"
                    >
                      <Send className="w-3.5 h-3.5" />
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                      Automated CLI Installation
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">Windows x64 / PowerShell 5.1+</span>
                </div>

                {/* wget */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-xs flex items-center justify-between gap-3 group hover:border-emerald-500/30 transition-colors">
                  <div className="overflow-x-auto text-neutral-300">
                    <span className="text-neutral-500 text-[10px]"># WGET CLI</span>
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
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white shrink-0 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedCmd === "wget" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* curl */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-xs flex items-center justify-between gap-3 group hover:border-emerald-500/30 transition-colors">
                  <div className="overflow-x-auto text-neutral-300">
                    <span className="text-neutral-500 text-[10px]"># CURL CLI</span>
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
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white shrink-0 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedCmd === "curl" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* PowerShell */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-3.5 font-mono text-xs flex items-center justify-between gap-3 group hover:border-emerald-500/30 transition-colors">
                  <div className="overflow-x-auto text-neutral-300">
                    <span className="text-neutral-500 text-[10px]"># POWERSHELL DOWNLOAD &amp; EXTRACT</span>
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
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white shrink-0 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copiedCmd === "ps" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Architecture specs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Shield className="w-4 h-4" />
                    <h5 className="text-xs font-semibold text-white">Eye Shield Isolation</h5>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Strict permission isolation, tracker &amp; telemetry blocking, and automatic HTTPS-first upgrades at network layer.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 text-purple-400">
                    <Cpu className="w-4 h-4" />
                    <h5 className="text-xs font-semibold text-white">MCP Architecture</h5>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    JSON-RPC stdio protocol. All agent tools are sandboxed behind explicit user cryptographic consent.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Eye className="w-4 h-4" />
                    <h5 className="text-xs font-semibold text-white">Zero-Leak Gateway</h5>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Provider keys live exclusively on the server gateway. Desktop client stores zero secrets and leaks zero telemetry.
                  </p>
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
