import Link from "next/link";
import Image from "next/image";
import { CheckCircle, WarningTriangle, XmarkCircle, ShieldCheck, Page, NavArrowLeft } from "iconoir-react";
import { Navigation } from "../../../../components/Navigation";
import { Footer } from "../../../../components/Footer";

interface PublicVerificationData {
  verificationStatus:
    | "VERIFIED_AUTHENTIC"
    | "DOCUMENT_SUPERSEDED"
    | "DOCUMENT_REVOKED"
    | "DOCUMENT_SUSPENDED"
    | "DOCUMENT_EXPIRED"
    | "MESSAGE_REVOKED"
    | "MESSAGE_QUEUED"
    | "NOT_ISSUED";
  organization: string;
  documentId: string;
  documentType: string;
  title: string;
  issuedDate: string | null;
  status: string;
  version: number;
  integrityHash: string;
  supersededBy?: {
    documentId: string;
    verificationUrl: string;
  };
  officialVerification: string;
}

interface PageProps {
  params: Promise<{ documentId: string }>;
}

async function fetchVerification(documentId: string): Promise<PublicVerificationData | null> {
  const apiBase =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://stflbd.app/api/v1";

  try {
    const res = await fetch(`${apiBase}/verify/${encodeURIComponent(documentId)}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: PublicVerificationData };
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export default async function VerifyPage({ params }: PageProps) {
  const { documentId } = await params;
  const data = await fetchVerification(documentId);

  return (
    <>
      <Navigation />
      <main className="flex-1 max-w-[var(--stfl-max-width)] mx-auto px-6 py-12 lg:px-8 w-full">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--stfl-text-secondary)] hover:text-[var(--stfl-ink)] mb-8 transition-colors"
          >
            <NavArrowLeft className="h-4 w-4" />
            <span>হোমে ফিরুন / Return to Home</span>
          </Link>

          {/* Header Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-[var(--stfl-surface-sand)] mb-4">
              <ShieldCheck className="h-8 w-8 text-[var(--stfl-teal)]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--stfl-ink)]">
              ডিজিটাল সনদ ও পত্র যাচাইকরণ
            </h1>
            <p className="text-sm sm:text-base text-[var(--stfl-text-secondary)] mt-1">
              Official Digital Document Authenticity Registry
            </p>
          </div>

          {!data ? (
            /* Document Not Found */
            <div className="p-8 rounded-2xl border border-[var(--stfl-border)] bg-white text-center shadow-sm">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-50 text-red-600 mb-4">
                <XmarkCircle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-[var(--stfl-ink)]">
                নথি পাওয়া যায়নি / Document Not Found
              </h2>
              <p className="text-sm text-[var(--stfl-text-secondary)] mt-2">
                অনুরোধকৃত রেফারেন্স নম্বর (<code className="text-red-700 bg-red-50 px-2 py-0.5 rounded">{documentId}</code>) সহায়েল তাসনিম ফাউন্ডেশনের কেন্দ্রীয় ডাটাবেজে পাওয়া যায়নি।
              </p>
              <p className="text-xs text-[var(--stfl-text-muted)] mt-4">
                অনুগ্রহ করে সনদের রেফারেন্স নম্বর অথবা কিউআর কোড পুনরায় স্ক্যান করে চেষ্টা করুন।
              </p>
            </div>
          ) : (
            /* Document Verified */
            <div className="rounded-2xl border border-[var(--stfl-border)] bg-white overflow-hidden shadow-sm">
              {/* Status Banner */}
              {data.verificationStatus === "VERIFIED_AUTHENTIC" && (
                <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex items-center gap-4 text-emerald-900">
                  <CheckCircle className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">
                      যাচাইকৃত প্রাতিষ্ঠানিক সনদ / পত্র
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-700">
                      VERIFIED AUTHENTIC OFFICIAL INSTRUMENT
                    </p>
                  </div>
                </div>
              )}

              {data.verificationStatus === "DOCUMENT_SUPERSEDED" && (
                <div className="bg-amber-50 border-b border-amber-100 p-6 flex items-center gap-4 text-amber-900">
                  <WarningTriangle className="h-8 w-8 text-amber-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">
                      পরবর্তী সংস্করণ দ্বারা প্রতিস্থাপিত
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-700">
                      SUPERSEDED BY NEW REVISION (v{data.version})
                    </p>
                  </div>
                </div>
              )}

              {(data.verificationStatus === "DOCUMENT_REVOKED" ||
                data.verificationStatus === "MESSAGE_REVOKED") && (
                <div className="bg-red-50 border-b border-red-100 p-6 flex items-center gap-4 text-red-900">
                  <XmarkCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">
                      অফিসিয়ালভাবে বাতিলকৃত / প্রত্যাহারকৃত
                    </h2>
                    <p className="text-xs sm:text-sm text-red-700">
                      OFFICIALLY REVOKED / CANCELLED
                    </p>
                  </div>
                </div>
              )}

              {/* Document Details Grid */}
              <div className="p-6 space-y-4 text-sm">
                <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-[var(--stfl-border)] gap-1">
                  <span className="text-[var(--stfl-text-secondary)]">প্রতিষ্ঠান / Organization:</span>
                  <span className="font-semibold text-[var(--stfl-ink)] sm:text-right">{data.organization}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-[var(--stfl-border)] gap-1">
                  <span className="text-[var(--stfl-text-secondary)]">নথির শিরোনাম / Document Title:</span>
                  <span className="font-bold text-[var(--stfl-ink)] sm:text-right">{data.title}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-[var(--stfl-border)] gap-1">
                  <span className="text-[var(--stfl-text-secondary)]">রেফারেন্স নম্বর / Document ID:</span>
                  <span className="font-mono text-[var(--stfl-teal)] font-semibold sm:text-right">{data.documentId}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-[var(--stfl-border)] gap-1">
                  <span className="text-[var(--stfl-text-secondary)]">নথির ধরন / Category:</span>
                  <span className="text-[var(--stfl-ink)] sm:text-right">{data.documentType}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-[var(--stfl-border)] gap-1">
                  <span className="text-[var(--stfl-text-secondary)]">ইস্যুর তারিখ / Issued Date:</span>
                  <span className="text-[var(--stfl-ink)] sm:text-right">{data.issuedDate || "—"}</span>
                </div>

                <div className="flex flex-col sm:flex-row justify-between py-2 border-b border-[var(--stfl-border)] gap-1">
                  <span className="text-[var(--stfl-text-secondary)]">সংস্করণ / Version:</span>
                  <span className="text-[var(--stfl-ink)] sm:text-right">v{data.version}</span>
                </div>

                {data.supersededBy && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mt-4">
                    <p className="text-xs font-semibold text-amber-800">
                      এই নথির একটি হালনাগাদ সংস্করণ বিদ্যমান / Newer revision available:
                    </p>
                    <Link
                      href={`/verify/${encodeURIComponent(data.supersededBy.documentId)}`}
                      className="text-sm font-mono font-bold text-[var(--stfl-teal)] hover:underline inline-block mt-1"
                    >
                      {data.supersededBy.documentId} →
                    </Link>
                  </div>
                )}

                {/* Cryptographic SHA-256 Digest */}
                <div className="pt-4">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--stfl-text-secondary)] mb-2">
                    ক্রিপ্টোগ্রাফিক ডিজিটাল হ্যাশ / SHA-256 Content Fingerprint
                  </span>
                  <div className="p-3 bg-[var(--stfl-surface-sand)] rounded-xl font-mono text-xs break-all text-[var(--stfl-ink)] border border-[var(--stfl-border)] select-all">
                    {data.integrityHash}
                  </div>
                </div>

                {/* Privacy Guarantee Notice */}
                <div className="pt-4 border-t border-[var(--stfl-border)]">
                  <p className="text-xs text-[var(--stfl-text-muted)] leading-relaxed">
                    গোপনীয়তা সুরক্ষা নীতি: সহায়েল তাসনিম ফাউন্ডেশন তথ্য সুরক্ষা নীতিমালা অনুযায়ী ব্যক্তি বা সুবিধাভোগীর ব্যক্তিগত তথ্য (PII), জাতীয় পরিচয়পত্র, ঠিকানা বা আর্থিক বিবরণী উন্মুক্ত তালিকায় প্রকাশ করা হয় না।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
