import type { Metadata } from "next";
import { notFound } from "next/navigation";
const sections = ["overview", "projects", "security", "exposure", "evidence", "policies", "cloud", "ai", "incidents", "recovery", "audit", "settings"];
export const metadata: Metadata = { title: "Workspace", robots: { index: false, follow: false } };
export function generateStaticParams() { return sections.map((section) => ({ section })); }
export default async function WorkspaceSection({ params }: PageProps<"/app/[section]">) { const { section } = await params; if (!sections.includes(section)) notFound(); return <div className="container" style={{ paddingBlock: 70 }}><p className="eyebrow">AUTHORIZED WORKSPACE / {section.toUpperCase()}</p><h1 style={{ fontSize: 42, fontWeight: 550, textTransform: "capitalize", margin: "20px 0" }}>{section}</h1><div className="detail-cta"><div><h2>No connected data.</h2><p>This module is ready for an authorized data source. Project-level authorization must be applied before any object is returned.</p></div><span className="stage">EMPTY STATE</span></div></div>; }
