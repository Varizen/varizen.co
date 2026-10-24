import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getSolution, solutions } from "@/content/site";
import { PageHero, Section, Stage } from "@/components/ui";

export const instant = false;
export function generateStaticParams() { return solutions.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> { const { slug } = await params; const item = getSolution(slug); return item ? { title: item.name, description: item.summary, alternates: { canonical: `/solutions/${slug}` } } : {}; }
export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params; const item = getSolution(slug); if (!item) notFound();
  return <><PageHero eyebrow="SOLUTIONS / OPERATIONAL ENTRY POINT" title={item.name} copy={item.summary}><Stage>Capability availability assessed per engagement</Stage></PageHero><Section><div className="detail-grid"><div><p className="eyebrow">THE CHALLENGE</p><h2>{item.problem}</h2><p>{item.audience}</p></div><div><p className="eyebrow">THE VARIZEN APPROACH</p><h2>{item.action}</h2><p>Connect context, ownership and evidence around the work. Technical capabilities are scoped and verified before deployment.</p></div></div><div className="detail-cta" style={{ marginTop: 75 }}><div><p className="eyebrow">INTENDED OUTCOME</p><h2>{item.outcome}</h2><p>Discuss what this should mean in your operating environment.</p></div><Link href={`/contact?reason=business&capability=${item.slug}`} className="button">Discuss this solution <ArrowUpRight size={16} /></Link></div></Section></>;
}
