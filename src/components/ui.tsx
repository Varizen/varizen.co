import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

export function Section({ children, className = "", id, style }: { children: ReactNode; className?: string; id?: string; style?: CSSProperties }) {
  return <section id={id} className={`section ${className}`} style={style}><div className="container">{children}</div></section>;
}

export function SectionHead({ eyebrow, title, copy, index, action }: { eyebrow: string; title: ReactNode; copy?: string; index?: string; action?: ReactNode }) {
  return <div className="section-head"><div><p className="eyebrow">{index && <span>{index}</span>}{eyebrow}</p><h2>{title}</h2></div>{(copy || action) && <div className="section-head-aside">{copy && <p className="lead">{copy}</p>}{action}</div>}</div>;
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`arrow-link ${className}`}>{children}<ArrowUpRight size={16} aria-hidden="true" /></Link>;
}

export function Stage({ children }: { children: ReactNode }) {
  return <span className="stage"><span aria-hidden="true" />{children}</span>;
}

export function PageHero({ eyebrow, title, copy, children }: { eyebrow: string; title: string; copy: string; children?: ReactNode }) {
  return <section className="page-hero"><div className="container page-hero-inner"><p className="eyebrow"><span className="orange-dot" />{eyebrow}</p><h1>{title}</h1><p className="page-hero-copy">{copy}</p>{children}</div><div className="page-hero-grid" aria-hidden="true" /></section>;
}

export function CardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card-grid ${className}`}>{children}</div>;
}
