import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAuth } from "@/server/auth";
export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export default async function AdminPage() { const auth = await requireAuth("admin:read"); if (!auth) redirect("/login"); return <main className="container" style={{ paddingBlock: 70 }}><p className="eyebrow">PRIVILEGED ADMINISTRATION</p><h1 style={{ fontSize: 42, fontWeight: 550, margin: "20px 0" }}>Admin foundation</h1><div className="detail-cta"><div><h2>No administrative data connected.</h2><p>Campaigns, applicants, content, entitlements and audit modules require their own authorized server actions. Dangerous changes must require re-authentication, a reason and an append-only audit event.</p></div><span className="stage">MFA VERIFIED</span></div></main>; }
