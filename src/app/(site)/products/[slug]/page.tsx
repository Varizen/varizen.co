import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getProductWithOverride, products } from "@/content/site";
import { PageHero, Section, SectionHead, Stage } from "@/components/ui";

export const instant = false;
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> { const { slug } = await params; const item = getProductWithOverride(slug); return item ? { title: item.name, description: item.summary, alternates: { canonical: `/products/${slug}` } } : {}; }
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params; const item = getProductWithOverride(slug); if (!item) notFound();
  const structured = { "@context": "https://schema.org", "@type": "Product", name: item.name, description: item.summary, brand: { "@type": "Organization", name: "Varizen Inc." }, category: item.category, additionalProperty: [{ "@type": "PropertyValue", name: "Maturity", value: item.stage }] };
  return <><PageHero eyebrow={`${item.category.toUpperCase()} / SELECTED PORTFOLIO`} title={item.name} copy={item.summary}><Stage>{item.stage}</Stage><p style={{ fontSize: 11, marginTop: 15 }}>{item.status}</p></PageHero><Section><SectionHead eyebrow="PRODUCT DIRECTION" title="A governed approach to the problem." copy={item.outcome} /><div className="detail-grid"><div><h2>Intended capabilities</h2><p>These capabilities describe product direction. Availability, integrations and deployment status must be confirmed for a specific environment.</p></div><div className="detail-list">{item.capabilities.map((capability, i) => <div key={capability}><span>0{i + 1}</span>{capability}</div>)}</div></div><div className="detail-cta" style={{ marginTop: 75 }}><div><h2>Explore what this could mean for you.</h2><p>Ask about current readiness, technical scope and evidence.</p></div><Link href={`/contact?reason=product&project=${item.slug}`} className="button">Talk to Varizen <ArrowUpRight size={16} /></Link></div></Section><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} /></>;
}
