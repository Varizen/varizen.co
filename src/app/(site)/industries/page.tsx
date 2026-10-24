import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/content/site";
import { PageHero, Section, SectionHead } from "@/components/ui";
export const metadata: Metadata = { title: "Industries", description: "Digital trust, cybersecurity and governed operations shaped around industry context.", alternates: { canonical: "/industries" } };
export default function IndustriesPage() { return <><PageHero eyebrow="INDUSTRIES" title="Built around your reality." copy="Different sectors carry different obligations, risks and operating constraints. The architecture must respect all three." /><Section><SectionHead eyebrow="CONTEXT BEFORE CONTROL" title="Technology that understands the environment." copy="Explore operational challenges and relevant capability directions. Sector references do not imply customers, contracts or certifications." /><div className="industries-grid">{industries.map((item, i) => <Link href={`/industries/${item.slug}`} className="industry-card" key={item.slug}><div><span>0{i + 1}</span><ArrowUpRight size={21} /></div><h2 style={{ fontSize: 20, fontWeight: 500 }}>{item.name}</h2><p>{item.summary}</p><span className="arrow-link">Explore context <ArrowUpRight size={14} /></span></Link>)}</div></Section></>; }
