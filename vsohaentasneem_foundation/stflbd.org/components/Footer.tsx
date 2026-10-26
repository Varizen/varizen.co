"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, Phone, NavArrowRight, Globe } from "iconoir-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { APP_ORIGIN, VERIFY_ORIGIN } from "@/src/lib/domains";

export function Footer() {
  const { lang, setLang } = useLanguage();
  const isBn = lang === "bn";
  const currentYear = new Date().getFullYear();
  const foundingYear = 2001;
  const yearRange = `${foundingYear}–${currentYear}`;

  return (
    <footer className="bg-[#081F2D] text-white mt-auto border-t border-[#0B2B43]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        {/* Top Identity Band */}
        <div className="pb-8 mb-8 sm:pb-10 sm:mb-10 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <Image
                  src="/stfl-mark-white.png"
                  alt="SohaelTasneem Foundation Emblem"
                  width={24}
                  height={21}
                  className="h-5 w-auto opacity-95 shrink-0 transition-opacity group-hover:opacity-80"
                  priority
                />
                <span className="text-sm sm:text-base font-bold tracking-tight text-white leading-none group-hover:text-[#FF6B35] transition-colors">
                  {isBn ? "সোহেল তাসনীম ফাউন্ডেশন" : "SOHAELTASNEEM FOUNDATION"}
                </span>
              </Link>
              <span className="text-xs font-mono bg-white/10 text-[#FF6B35] px-2 py-0.5 rounded-none border border-white/15">
                CANONICAL: stflbd.org
              </span>
            </div>
              <p className="font-hind text-sm text-stone-300 max-w-2xl leading-relaxed">
                {isBn
                  ? "মানব মর্যাদা · বাস্তব পদক্ষেপ · পরিমাপযোগ্য প্রভাব — মানুষের ও সমাজের আত্মবিকাশের টেকসই পথ।"
                  : "Human Dignity · Practical Action · Measurable Impact — Building conditions for people and communities to move forward."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-300">
              <span className="flex items-center gap-1.5">
                <Phone width={14} height={14} className="text-[#FF6B35]" />
                +88018410506411
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail width={14} height={14} className="text-[#FF6B35]" />
                hi@stflbd.email
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-none border border-white/15 text-[11px]">
                <Globe width={12} height={12} className="text-[#FF6B35]" />
                <button
                  onClick={() => setLang("bn")}
                  className={`px-1 ${isBn ? "text-white font-bold underline" : "text-stone-400 hover:text-white"}`}
                >
                  বাংলা
                </button>
                <span>/</span>
                <button
                  onClick={() => setLang("en")}
                  className={`px-1 ${!isBn ? "text-white font-bold underline" : "text-stone-400 hover:text-white"}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* 6 Column Responsive Grid with High-Contrast Typography & Screen Scaling */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-8 lg:gap-10 xl:gap-6 2xl:gap-8 mb-12">
            {/* Column 1: About */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] mb-4 whitespace-nowrap">
                {isBn ? "পরিচিতি ও দর্শন" : "About STFL"}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/about" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "আমাদের সম্পর্কে" : "About Us"}
                  </Link>
                </li>
                <li>
                  <Link href="/mission" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "মিশন ও ভিশন" : "Mission & Vision"}
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "বোর্ড ও নেতৃত্ব" : "Board & Leadership"}
                  </Link>
                </li>
                <li>
                  <Link href="/reports" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "বার্ষিক অডিট ও প্রতিবেদন" : "Annual Reports & Audits"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Programs */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] mb-4 whitespace-nowrap">
                {isBn ? "কর্মসূচিসমূহ" : "Programs"}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/programs/education" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "শিক্ষা কর্মসূচি" : "Education"}
                  </Link>
                </li>
                <li>
                  <Link href="/programs/health" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "স্বাস্থ্যসেবা" : "Healthcare"}
                  </Link>
                </li>
                <li>
                  <Link href="/programs/community-development" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "সামাজিক উন্নয়ন" : "Community Development"}
                  </Link>
                </li>
                <li>
                  <Link href="/programs/digital-inclusion" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "ডিজিটাল সক্ষমতা ও দক্ষতা" : "Digital Inclusion & Skills"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Initiatives & Ventures */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] mb-4 whitespace-nowrap">
                {isBn ? "উদ্যোগ ও ভেঞ্চার" : "Initiatives & Ventures"}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/initiatives/grihostios" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "গৃহস্থী ওএস" : "GrihostiOS"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "সম্পত্তি ও জমি অপারেশন" : "Property & Land Operations"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="https://hakimsarker.org/" target="_blank" rel="noopener noreferrer" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "প্রফেসর ড. আব্দুল হাকিম সরকার" : "Prof. Dr. Abdul Hakim Sarker"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "শিক্ষা ও জ্ঞান আর্কাইভ" : "Academic Legacy & Knowledge Archive"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/initiatives/aev-developments" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "এইভি ডেভেলপমেন্টস" : "AEV Developments"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "রিয়েল এস্টেট ও অবকাঠামো" : "Infrastructure & Development"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/initiatives/maxremit" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "ম্যাক্সরেমিট" : "MaxRemit"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "রেমিট্যান্স ও পেমেন্ট" : "Remittance & Cross-Border"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/initiatives/helpex" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "হেল্পেক্স" : "Helpex"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "জামানতি অর্থায়ন সেবা" : "Collateral Finance"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/initiatives/proiozon" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "প্রয়োজন" : "Proiozon"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "বাংলাদেশ ডিজিটাল মার্কেট" : "Bangladesh Marketplace"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/initiatives/perlu" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#FF6B35] transition-colors block leading-snug">
                      {isBn ? "পেরলু" : "Perlu"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "মালয়েশিয়া মার্কেটপ্লেস" : "Malaysia Marketplace"}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="https://qimai.codes/" target="_blank" rel="noopener noreferrer" className="block py-0.5 group">
                    <span className="text-[13px] font-medium text-white/95 group-hover:text-[#00D4FF] transition-colors block leading-snug">
                      {isBn ? "কিউআইএম এআই ২.১" : "QiM-AI 2.1"}
                    </span>
                    <span className="block text-[11px] text-stone-400 group-hover:text-stone-300 transition-colors leading-tight mt-0.5">
                      {isBn ? "এআই ও নলেজ প্ল্যাটফর্ম" : "AI & Knowledge Intelligence Platform"}
                    </span>
                  </Link>
                </li>
                <li className="pt-2 border-t border-white/10">
                  <Link href="/initiatives" className="text-xs font-mono text-[#FF6B35] hover:text-white transition-colors font-semibold flex items-center gap-1 group">
                    <span>{isBn ? "সকল উদ্যোগ ও ভেঞ্চার →" : "More Initiatives →"}</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Get Involved */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] mb-4 whitespace-nowrap">
                {isBn ? "অংশগ্রহণ করুন" : "Get Involved"}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/donate" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "দান ও অনুদান" : "Donate"}
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "স্বেচ্ছাসেবা নেটওয়ার্ক" : "Volunteer Network"}
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "প্রাতিষ্ঠানিক অংশীদারিত্ব" : "Partner With Us"}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "ক্যারিয়ার ও সুযোগ" : "Careers & Positions"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Resources & Media */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] mb-4 whitespace-nowrap">
                {isBn ? "রিসোর্স ও মিডিয়া" : "Resources"}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/brandcenter" className="text-sm text-stone-200 hover:text-white transition-colors flex items-center justify-between group py-0.5">
                    <span className="group-hover:text-[#FF6B35] transition-colors">{isBn ? "ব্র্যান্ড সেন্টার ও মিডিয়া" : "Brand Center & Media"}</span>
                    <span className="text-[10px] font-mono text-[#FF6B35] bg-[#FF6B35]/15 px-1.5 py-0.5 border border-[#FF6B35]/30">HUB</span>
                  </Link>
                </li>
                <li>
                  <Link href="/brand" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "ব্র্যান্ড নির্দেশিকা" : "Brand Guidelines"}
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "সংবাদ ও ডিসপ্যাচ" : "News & Dispatches"}
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "ভিজ্যুয়াল গ্যালারি" : "Impact Gallery"}
                  </Link>
                </li>
                <li>
                  <Link href="/publications" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "গবেষণা ও প্রকাশনা" : "Publications"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 6: Legal & Trust */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6B35] mb-4 whitespace-nowrap">
                {isBn ? "আইন ও বিশ্বাসযোগ্যতা" : "Legal & Trust"}
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/privacy" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
                  </Link>
                </li>
                <li>
                  <Link href="/safeguarding" className="text-sm text-stone-200 hover:text-white transition-colors inline-block py-0.5">
                    {isBn ? "সুরক্ষা নীতিমালা" : "Safeguarding Policy"}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`${VERIFY_ORIGIN}/verify`}
                    className="inline-flex items-center gap-1.5 text-sm text-[#FF6B35] hover:text-[#ff8555] font-medium transition-colors pt-1 group"
                    title="Public Document Verification"
                  >
                    <ShieldCheck width={15} height={15} className="shrink-0 text-[#FF6B35]" />
                    <span className="group-hover:underline underline-offset-4">
                      {isBn ? "পাবলিক যাচাইকরণ" : "Document Verification"}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Institutional HQ & Creative Attribution */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/60">
            <div className="space-y-1.5 text-center md:text-left">
              <p>© {yearRange} SohaelTasneem Foundation. All rights reserved.</p>
              <p className="text-stone-300">
                STFL House, 173 E Ullan Road, W Rampura, Dhaka 1217, Bangladesh. Phone: +88018410506411
              </p>
              <p className="text-stone-400">
                Made with love from Dhaka, Kuala Lumpur, Wyoming & Varizen Inc.
                <span className="font-hind text-stone-400 ml-2">
                  (ঢাকা, কুয়ালালামপুর, ওয়াইওমিং এবং ভ্যারিজেন ইনকর্পোরেটেড থেকে ভালোবাসায় তৈরি)
                </span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/cookies" className="hover:text-white transition-colors">
                {isBn ? "কুকিজ নীতি" : "Cookie Policy"}
              </Link>
              <Link href={`${APP_ORIGIN}/roadmap`} className="hover:text-white transition-colors text-cyan-400">
                {isBn ? "রোডম্যাপ" : "Roadmap"}
              </Link>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
              <Link href="/admin" className="text-[#FF6B35] hover:text-white transition-colors font-semibold flex items-center gap-1">
                <ShieldCheck width={12} height={12} />
                <span>STFL VI</span>
              </Link>
            </div>
          </div>
        </div>
    </footer>
  );
}

