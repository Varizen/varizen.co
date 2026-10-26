"use client";

import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  User,
  KeyRound,
  Upload,
  Lock,
  X,
} from "lucide-react";
import {
  generatePassphrase,
  createEncryptedPackage,
  unlockEncryptedPackage,
  UserProfileData,
  EncryptedProfilePackage,
} from "@/lib/aibrowser-profile";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfileData | null;
  onProfileUpdated: (profile: UserProfileData | null) => void;
}

export function AiBrowserProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onProfileUpdated,
}: ProfileModalProps) {
  const [profileMode, setProfileMode] = useState<"view" | "create" | "restore">("view");
  const [formUsername, setFormUsername] = useState("");
  const [formPin, setFormPin] = useState("");
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const [savedPackage, setSavedPackage] = useState<EncryptedProfilePackage | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedWords, setCopiedWords] = useState(false);

  // Restore state
  const [restorePin, setRestorePin] = useState("");
  const [restoreWordsInput, setRestoreWordsInput] = useState("");
  const [uploadedPackage, setUploadedPackage] = useState<EncryptedProfilePackage | null>(null);

  if (!isOpen) return null;

  const startCreate = () => {
    const words = generatePassphrase();
    setGeneratedWords(words);
    setProfileMode("create");
    setStatusMsg(null);
  };

  const copyWords = () => {
    navigator.clipboard.writeText(generatedWords.join(" "));
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2000);
  };

  const finalizeCreate = async () => {
    if (!formUsername.trim()) {
      setStatusMsg("Please choose a username.");
      return;
    }
    if (!/^\d{4}$/.test(formPin)) {
      setStatusMsg("Preset rescue code must be exactly 4 digits.");
      return;
    }

    const newProfile: UserProfileData = {
      username: formUsername.trim(),
      pin: formPin,
      createdAt: new Date().toISOString(),
      vaultId: `vault_${Date.now().toString(36)}`,
      settings: {
        theme: "dark",
        shieldLevel: "strict",
        searchEngine: "https://duckduckgo.com/?q=",
      },
      identities: {
        emailPlaceholder: `${formUsername.trim().toLowerCase()}@zmail.sec`,
        calendarLinked: true,
        meetingsHandle: `@${formUsername.trim().toLowerCase()}`,
        zletWalletAddress: `0x${Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")}`,
      },
    };

    const pkg = await createEncryptedPackage(newProfile, generatedWords, formPin);
    setSavedPackage(pkg);
    onProfileUpdated(newProfile);
    try {
      localStorage.setItem("vz_aibrowser_profile", JSON.stringify(newProfile));
    } catch {}

    setStatusMsg("Encrypted vault package generated! Download your .vault.json file below.");
  };

  const downloadFile = () => {
    if (!savedPackage) return;
    const blob = new Blob([JSON.stringify(savedPackage, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${savedPackage.username || "aibrowser"}.vault.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg("File downloaded. Keep it in your safe custody.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as EncryptedProfilePackage;
        if (parsed.format !== "AIBROWSER_ZERO_KNOWLEDGE_PROFILE_V1") {
          setStatusMsg("Invalid custody file format.");
          return;
        }
        setUploadedPackage(parsed);
        setStatusMsg(`Custody vault loaded for: @${parsed.username}`);
      } catch {
        setStatusMsg("Failed to parse vault file.");
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = async () => {
    if (!uploadedPackage) {
      setStatusMsg("Please upload your .vault.json file first.");
      return;
    }
    if (!/^\d{4}$/.test(restorePin)) {
      setStatusMsg("Please enter your preset 4-digit code.");
      return;
    }

    const words = restoreWordsInput.trim()
      ? restoreWordsInput.trim().split(/\s+/).filter(Boolean)
      : null;

    const res = await unlockEncryptedPackage(uploadedPackage, words, restorePin);
    if (!res.success || !res.profile) {
      setStatusMsg(res.error || "Unlock failed. Verify your 4-digit code.");
      return;
    }

    onProfileUpdated(res.profile);
    try {
      localStorage.setItem("vz_aibrowser_profile", JSON.stringify(res.profile));
    } catch {}
    setProfileMode("view");
    setStatusMsg("Vault unlocked & restored successfully.");
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 animate-in fade-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-xl bg-[#0e1110] border border-white/10 rounded-xl p-5 text-neutral-200 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-white">
              Zero-Knowledge Profile &amp; Passphrase Custody
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 0-byte Server Explainer */}
        <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] text-[11px] text-neutral-300 font-mono flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            0-Byte Server Custody: Varizen stores 0 bytes of your profile or secrets. Everything is
            controlled by your pre-encrypted custody file and 4-digit rescue code.
          </span>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 border-b border-white/5 pb-2 text-xs font-mono">
          <button
            onClick={() => {
              setProfileMode("view");
              setStatusMsg(null);
            }}
            className={`px-2.5 py-1 rounded transition-colors ${
              profileMode === "view"
                ? "bg-emerald-500 text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Active Profile
          </button>
          <button
            onClick={startCreate}
            className={`px-2.5 py-1 rounded transition-colors ${
              profileMode === "create"
                ? "bg-emerald-500 text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Create Vault
          </button>
          <button
            onClick={() => {
              setProfileMode("restore");
              setStatusMsg(null);
            }}
            className={`px-2.5 py-1 rounded transition-colors ${
              profileMode === "restore"
                ? "bg-emerald-500 text-black font-semibold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Rescue / Upload
          </button>
        </div>

        {statusMsg && (
          <div className="p-2 rounded bg-white/5 border border-white/10 text-emerald-300 text-[11px] font-mono">
            {statusMsg}
          </div>
        )}

        {/* View Mode */}
        {profileMode === "view" && (
          <div className="space-y-3">
            {currentProfile ? (
              <div className="p-3.5 rounded-lg border border-white/10 bg-black/40 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-500 uppercase">Username</span>
                  <span className="text-white font-bold">@{currentProfile.username}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5">
                  <span className="text-neutral-500 uppercase">Vault ID</span>
                  <span className="text-neutral-300">{currentProfile.vaultId}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5">
                  <span className="text-neutral-500 uppercase">Identity</span>
                  <span className="text-emerald-400">
                    {currentProfile.identities.emailPlaceholder}
                  </span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1.5">
                  <span className="text-neutral-500 uppercase">Zlet Wallet</span>
                  <span className="text-neutral-300 truncate max-w-[260px]">
                    {currentProfile.identities.zletWalletAddress}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      try {
                        localStorage.removeItem("vz_aibrowser_profile");
                      } catch {}
                      onProfileUpdated(null);
                      setStatusMsg("Local profile cleared from this browser session.");
                    }}
                    className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] rounded border border-red-500/30 transition-colors"
                  >
                    Clear Local Session
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center border border-white/10 rounded-lg space-y-2">
                <KeyRound className="w-8 h-8 text-neutral-600 mx-auto" />
                <div className="text-xs font-semibold text-white">No Profile Initialized</div>
                <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                  Create your profile to get a 12-word passphrase and pre-encrypted vault file you
                  keep in your custody.
                </p>
                <button
                  onClick={startCreate}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded transition-colors font-mono"
                >
                  Create New Profile
                </button>
              </div>
            )}
          </div>
        )}

        {/* Create Mode */}
        {profileMode === "create" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">Username</label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  placeholder="e.g. Satoshi"
                  className="w-full bg-[#080a09] border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                  Preset 4-Digit Rescue Code
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={formPin}
                  onChange={(e) => setFormPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="4 digits"
                  className="w-full bg-[#080a09] border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-emerald-500 tracking-widest"
                />
              </div>
            </div>

            {/* 12 Words */}
            <div className="p-3 rounded-lg border border-emerald-500/30 bg-black/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-emerald-400 font-semibold">12-Word Custody Passphrase</span>
                <button
                  onClick={copyWords}
                  className="text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  {copiedWords ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWords ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono pt-1">
                {generatedWords.map((word, i) => (
                  <div
                    key={i}
                    className="bg-[#121413] border border-white/10 rounded px-1.5 py-1 text-neutral-300 flex items-center gap-1"
                  >
                    <span className="text-neutral-500">{i + 1}.</span>
                    <span className="text-white">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 font-mono text-xs">
              <button
                onClick={finalizeCreate}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded transition-colors"
              >
                Encrypt &amp; Activate Vault
              </button>
              {savedPackage && (
                <button
                  onClick={downloadFile}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded flex items-center gap-1.5 border border-white/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .vault.json</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Restore Mode */}
        {profileMode === "restore" && (
          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400 uppercase block">
                1. Upload Encrypted .vault.json File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="text-[11px] text-neutral-300 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                  2. Preset 4-Digit Code
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={restorePin}
                  onChange={(e) => setRestorePin(e.target.value.replace(/\D/g, ""))}
                  placeholder="4 digits"
                  className="w-full bg-[#080a09] border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-emerald-500 tracking-widest"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                  3. 12 Words (Optional)
                </label>
                <input
                  type="text"
                  value={restoreWordsInput}
                  onChange={(e) => setRestoreWordsInput(e.target.value)}
                  placeholder="Optional if file verified"
                  className="w-full bg-[#080a09] border border-white/10 rounded px-2.5 py-1.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleRestore}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Verify &amp; Reopen Vault</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
