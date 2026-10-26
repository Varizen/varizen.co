import Link from "next/link";
import { HomeSimple, ArrowLeft, HelpCircle } from "iconoir-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
          <HelpCircle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Error 404 • পৃষ্ঠাটি পাওয়া যায়নি
          </span>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight font-serif pt-2">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            The page you are looking for does not exist or may have been relocated.
            অনুগ্রহ করে প্রধান পাতায় ফিরে যান অথবা অনুসন্ধান করুন।
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 transition font-medium text-sm shadow-sm"
          >
            <HomeSimple className="w-4 h-4" />
            <span>প্রধান পাতা (Home)</span>
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>যোগাযোগ (Contact)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
