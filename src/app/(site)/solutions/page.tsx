import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { solutions } from "@/content/site";
import { CardGrid, PageHero, Section, SectionHead } from "@/components/ui";
export const metadata: Metadata = { title: "Solutions", description: "Cybersecurity, privacy, AI and cloud governance solutions built around evidence-led operations.", alternates: { canonical: "/solutions" } };
export default function SolutionsPage() { return <><PageHero eyebrow="SOLUTIONS" title="Start with the decision, not the tool." copy="Practical entry points for understanding exposure, governing complex environments and proving that action worked." /><Section><SectionHead eyebrow="FROM CHALLENGE TO EVIDENCE" title="A clear operational outcome." copy="Each engagement begins with context. Capabilities and maturity are evaluated for your environment; no outcome is presumed." /><CardGrid className="solutions-grid">{solutions.map((item, i) => <Link className="solution-card" href={`/solutions/${item.slug}`} key={item.slug}><div className="card-top"><span>0{i + 1}</span><ArrowUpRight size={19} /></div><h3>{item.name}</h3><p>{item.summary}</p><div className="card-bottom"><span>{item.audience}</span><ArrowUpRight size={15} /></div></Link>)}</CardGrid></Section></>; }
