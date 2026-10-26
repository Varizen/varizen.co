import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ShortVerifyPage({ params }: PageProps) {
  const { code } = await params;
  const apiBase =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://stflbd.app/api/v1";

  try {
    const res = await fetch(`${apiBase}/verify/${encodeURIComponent(code)}`, {
      cache: "no-store",
    });

    if (!res.ok) notFound();

    const json = (await res.json()) as { success: boolean; data: { documentId: string } };
    if (json.success && json.data?.documentId) {
      redirect(`/verify/${encodeURIComponent(json.data.documentId)}`);
    }
  } catch {
    // If resolution fails, redirect directly to verify by code
    redirect(`/verify/${encodeURIComponent(code)}`);
  }

  notFound();
}
