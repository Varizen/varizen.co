"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  SmartphoneDevice,
  CheckCircle,
  Key,
} from "iconoir-react";
import { APP_ORIGIN } from "@/src/lib/domains";

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<"credentials" | "hardware">("credentials");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070D18] text-white flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/stfl-mark-white.png"
            alt="STFL Mark"
            width={24}
            height={21}
            className="h-5 w-auto"
          />
          <span className="font-semibold text-white tracking-tight text-sm">
            STFL VI <span className="text-cyan-400 font-mono text-xs ml-1">APP</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
          <Link href={`${APP_ORIGIN}/demo`} className="text-cyan-400 hover:underline">
            Launch Demo Workspace →
          </Link>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#0E1726] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top neon glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 mb-3">
              <ShieldCheck width={24} height={24} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Sign in to STFL VI</h1>
            <p className="text-xs text-stone-400 mt-1">
              Unified institutional workspace & governed services
            </p>
          </div>

          {/* Mode switch */}
          <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6 text-xs font-mono">
            <button
              type="button"
              onClick={() => setAuthMode("credentials")}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                authMode === "credentials"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              ID / Password
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("hardware")}
              className={`py-2 rounded-lg transition-colors cursor-pointer ${
                authMode === "hardware"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Device Keystore
            </button>
          </div>

          {submitted ? (
            <div className="p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <CheckCircle width={16} height={16} />
                <span>Production Authentication Gate</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Direct public login on the production ledger requires a registered institutional
                identity or enrollment token.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={`${APP_ORIGIN}/demo`}
                  className="w-full text-center py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-lg text-xs transition"
                >
                  Enter Interactive Demo Lab (No credentials required) →
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-2 px-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg text-xs transition"
                >
                  Request Institutional Access Token
                </Link>
              </div>
            </div>
          ) : authMode === "credentials" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1.5">
                  STFL Identity / Officer ID / Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. STFL-USR-0042 or officer@stflbd.email"
                    className="w-full bg-[#070D18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <User
                    width={14}
                    height={14}
                    className="absolute right-3.5 top-3 text-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#070D18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <Lock
                    width={14}
                    height={14}
                    className="absolute right-3.5 top-3 text-stone-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="rounded bg-black/40 border-white/20" />
                  <span>Remember device token</span>
                </label>
                <Link href={`${APP_ORIGIN}/demo`} className="text-cyan-400 hover:underline">
                  Try Demo instead
                </Link>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <span>Authenticate Session</span>
                <ArrowRight width={14} height={14} />
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <SmartphoneDevice width={16} height={16} />
                  <span>Hardware Key Attestation</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  Registered field tablets and Android terminals authenticate via hardware-backed
                  cryptographic keys (Keystore / TEE enclave).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-white/20"
              >
                <Key width={14} height={14} className="text-cyan-400" />
                <span>Verify Connected Hardware Device</span>
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-stone-400">
            Need institutional access?{" "}
            <Link href="/signup" className="text-cyan-400 hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
        <div>STFL Enterprise Workspace • stflbd.org</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-stone-300">Privacy</Link>
          <Link href="/terms" className="hover:text-stone-300">Terms</Link>
          <a href={`${APP_ORIGIN}/download`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Get Mobile App ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
