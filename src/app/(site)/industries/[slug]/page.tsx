import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getIndustry, industries } from "@/content/site";
import { PageHero, Section } from "@/components/ui";
export const instant = false;
export function generateStaticParams() { return industries.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> { const { slug } = await params; const item = getIndustry(slug); return item ? { title: item.name, description: item.summary, alternates: { canonical: `/industries/${slug}` } } : {}; }
export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) { const { slug } = await params; const item = getIndustry(slug); if (!item) notFound(); return <><PageHero eyebrow="INDUSTRIES / CONTEXT" title={item.name} copy={item.summary} /><Section><div className="detail-grid"><div><p className="eyebrow">THE OPERATING CHALLENGE</p><h2>{item.challenge}</h2><p>{item.consideration}</p></div><div><p className="eyebrow">RELEVANT VARIZEN CAPABILITIES</p><h2>{item.capability}</h2><p>Scope, technical controls and maturity must be assessed for each organization and use case.</p><Link href="/solutions" className="arrow-link">Explore solutions <ArrowUpRight size={15} /></Link></div></div><div className="detail-cta" style={{ marginTop: 75 }}><div><h2>Start with your environment.</h2><p>Tell us about the systems and obligations that shape your work.</p></div><Link href={`/contact?reason=business&industry=${item.slug}`} className="button">Start a conversation <ArrowUpRight size={16} /></Link></div></Section></>; }
