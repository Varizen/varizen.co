"use client";

import { useEffect } from "react";
import Link from "next/link";
import { WarningTriangle, RefreshDouble, HomeSimple } from "iconoir-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log non-sensitive error metric for observability
    console.error("STFL Web Runtime Caught:", error.message);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <WarningTriangle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            System Alert • কারিগরি সমস্যা
          </span>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight font-serif pt-2">
            একটি অপ্রত্যাশিত ত্রুটি ঘটেছে
          </h1>
          <p className="text-stone-600 text-sm leading-relaxed">
            An unexpected error occurred while loading this section.
            আমাদের কারিগরি দল বিষয়টি পর্যালোচনায় রেখেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 transition font-medium text-sm shadow-sm cursor-pointer"
          >
            <RefreshDouble className="w-4 h-4" />
            <span>পুনরায় চেষ্টা করুন (Retry)</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-50 transition font-medium text-sm"
          >
            <HomeSimple className="w-4 h-4" />
            <span>প্রধান পাতা (Home)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
