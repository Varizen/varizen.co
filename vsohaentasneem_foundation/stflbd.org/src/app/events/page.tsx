import type { Metadata } from "next";
import { canonical } from "@/src/lib/domains";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Calendar,
  Pin,
  Clock,
  ShieldCheck,
  ArrowRight,
  InfoCircle,
  CheckCircle,
  NavArrowLeft
} from "iconoir-react";

export const metadata: Metadata = {
  title: "Institutional Events & Assemblies — SohaelTasneem Foundation",
  description: "Official calendar of community assemblies, public verification sessions, and annual stakeholder convenings.",
  openGraph: {
    title: "Institutional Events & Assemblies — SohaelTasneem Foundation",
    description: "Official calendar of community assemblies, public verification sessions, and annual stakeholder convenings.",
    url: canonical("/events"),
    type: "website",
  },
};

const events = [
  {
    id: "STFL-EVT-2026-01",
    enTitle: "Annual Trustee & Stakeholder Assembly 2026",
    bnTitle: "বার্ষিক ট্রাস্টি ও অংশীজন সম্মেলন ২০২৬",
    date: "November 28, 2026",
    time: "10:00 AM – 2:00 PM BST",
    location: "STFL House, Rampura, Dhaka & Hybrid Stream",
    category: "Governance & Reporting",
    status: "CONFIRMED",
    descEn: "Annual review of institutional operations, audit statement presentations, program outcomes, and ratification of the 2027 programmatic budget.",
    descBn: "বার্ষিক কার্যক্রম পর্যালোচনা, নিরীক্ষা প্রতিবেদন উপস্থাপন, কর্মসূচির প্রভাব মূল্যায়ন এবং ২০২৭ মেয়াদের কর্মপরিকল্পনা অনুমোদন।",
  },
  {
    id: "STFL-EVT-2026-02",
    enTitle: "Public Verification & Open Audit Clinic",
    bnTitle: "উন্মুক্ত অডিট ও যাচাইকরণ অধিবেশন",
    date: "December 12, 2026",
    time: "3:00 PM – 5:30 PM BST",
    location: "Public Knowledge Center & Online Portal",
    category: "Public Accountability",
    status: "SCHEDULED",
    descEn: "Live demonstration and walkthrough of STFL cryptographic verification tools, expenditure tracking, and community voucher reconciliation.",
    descBn: "এসটিএফএল যাচাইকরণ ব্যবস্থা, ব্যয় পর্যালোচনা এবং সহায়তা রসিদ যাচাইয়ের উন্মুক্ত প্রদর্শনী ও প্রশ্নোত্তর পর্ব।",
  },
  {
    id: "STFL-EVT-2027-01",
    enTitle: "Field Community Dialogues: Bogura & Satkhira",
    bnTitle: "মাঠ পর্যায়ের কমিউনিটি সংলাপ: বগুড়া ও সাতক্ষীরা",
    date: "January 18–20, 2027",
    time: "Full Day Field Sessions",
    location: "Field Hubs: Bogura Sadar & Satkhira Coastal Region",
    category: "Field Operations",
    status: "PLANNED",
    descEn: "Participatory evaluation sessions with local beneficiaries, agricultural cooperatives, and health outreach workers to calibrate 2027 priorities.",
    descBn: "স্থানীয় সুবিধাভোগী, কৃষি সমবায় এবং স্বাস্থ্যকর্মীদের সাথে সরাসরি অংশগ্রহণমূলক আলোচনা ও অগ্রাধিকার নির্ধারণ।",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <Calendar width={14} height={14} />
              <span>OFFICIAL CONVENINGS</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                  প্রাতিষ্ঠানিক অনুষ্ঠান ও সংলাপ
                </span>
                <span>Events & Assemblies</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                Official convenings, stakeholder forums, transparency clinics, and field dialogues conducted by SohaelTasneem Foundation.
              </p>
            </div>
          </div>
        </section>

        {/* Governed Disclosure Banner */}
        <section className="bg-[#FAFAF8] border-b border-[#E7E7E2] py-6">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck width={14} height={14} className="text-emerald-600" />
                <span>All convenings follow published STFL safeguarding, non-partisan, and transparency protocols.</span>
              </div>
              <div className="text-stone-500">
                Inquiries: hi@stflbd.email
              </div>
            </div>
          </div>
        </section>

        {/* Events Registry */}
        <section className="py-16 md:py-20">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="space-y-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="border border-[#E7E7E2] rounded-xl p-6 sm:p-8 bg-white hover:border-[#FF6B35]/40 transition shadow-sm"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {evt.status}
                        </span>
                        <span className="text-xs font-mono text-stone-500">
                          {evt.id}
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          • {evt.category}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-[#081F2D] mb-1">
                        {evt.enTitle}
                      </h2>
                      <div className="font-hind text-base font-semibold text-stone-600 mb-4">
                        {evt.bnTitle}
                      </div>

                      <p className="text-sm text-stone-700 leading-relaxed mb-4 max-w-2xl">
                        {evt.descEn}
                      </p>
                      <p className="font-hind text-xs text-stone-500 leading-relaxed max-w-2xl">
                        {evt.descBn}
                      </p>
                    </div>

                    <div className="lg:w-80 shrink-0 bg-[#FAFAF8] p-5 rounded-lg border border-[#E7E7E2] text-xs space-y-3 font-mono">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Calendar width={16} height={16} className="text-[#FF6B35]" />
                        <span className="font-semibold">{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-stone-600">
                        <Clock width={16} height={16} className="text-stone-400" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-start gap-2 text-stone-600">
                        <Pin width={16} height={16} className="text-stone-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{evt.location}</span>
                      </div>
                      <div className="pt-3 border-t border-[#E7E7E2]">
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-between w-full px-3 py-2 rounded bg-white border border-[#E7E7E2] hover:border-[#FF6B35] font-semibold text-[#081F2D] hover:text-[#FF6B35] transition text-[11px]"
                        >
                          <span>Request Registration / Access</span>
                          <ArrowRight width={12} height={12} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification / Protocol Note */}
        <section className="bg-[#FAFAF8] py-12 border-t border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-[#081F2D] mb-2">Event Conduct & Public Access</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                All assemblies are documented in official meeting minutes and cataloged in the institutional archives. Summary reports are published under the Publications and Reports repositories following governance ratification.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
