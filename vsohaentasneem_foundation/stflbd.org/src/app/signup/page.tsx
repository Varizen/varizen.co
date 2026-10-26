"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle,
  Building,
} from "iconoir-react";
import { APP_ORIGIN } from "@/src/lib/domains";

export default function SignupPage() {
  const [role, setRole] = useState("CLASS_12");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          <Link href="/login" className="text-stone-300 hover:text-white">
            Already have an account? Sign In →
          </Link>
        </div>
      </header>

      {/* Main card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#0E1726] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle top neon glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="mb-6">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              Account Registration
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create an STFL VI Account
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Register for verified digital services, GrihostiOS deeds, and field participation.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 bg-cyan-500/10 border border-cyan-400/30 rounded-xl text-xs space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                <CheckCircle width={18} height={18} />
                <span>Enrollment Request Received</span>
              </div>
              <p className="text-stone-300 leading-relaxed">
                Your request has been logged into the STFL VI IAM provisioning ledger. For institutional
                classes (Officer, Trustee, Field Supervisor), manual four-eyes authorization is required.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href={`${APP_ORIGIN}/demo`}
                  className="w-full text-center py-2.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-lg text-xs transition"
                >
                  Explore in Live Demo Mode →
                </Link>
                <Link
                  href="/login"
                  className="w-full text-center py-2 px-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-lg text-xs transition"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1.5">
                  Full Name (Legal Name)
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tariqul Islam"
                  className="w-full bg-[#070D18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1.5">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full bg-[#070D18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-stone-300 mb-1.5">
                    Mobile Number (SMS verification)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1..."
                    className="w-full bg-[#070D18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1.5">
                  Requested User Class / Functional Seniority
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#070D18] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="CLASS_12">CLASS_12 — Public Citizen / Beneficiary</option>
                  <option value="CLASS_11">CLASS_11 — External Partner / Institutional Auditor</option>
                  <option value="CLASS_05">CLASS_05 — Field Operations Worker</option>
                  <option value="CLASS_04">CLASS_04 — Operations Officer</option>
                  <option value="CLASS_06">CLASS_06 — Finance & Accounts Specialist</option>
                </select>
                <p className="text-[10px] text-stone-500 mt-1 font-mono">
                  All institutional tiers require dual-custody approval before activation.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-cyan-400 hover:bg-cyan-300 text-black font-semibold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  <span>Submit Enrollment Request</span>
                  <ArrowRight width={14} height={14} />
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-stone-400">
            Already have credentials?{" "}
            <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
        <div>STFL Enterprise Workspace • stflbd.org</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-stone-300">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-stone-300">Terms of Service</Link>
          <a href={`${APP_ORIGIN}/download`} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
            Get Mobile App ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
