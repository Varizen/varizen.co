import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { TrustMap } from "@/components/trust-map";
import { HomeSections } from "@/components/home-sections";

export default function Home() {
  return <>
    <section className="home-hero"><div className="hero-grid-bg" aria-hidden="true" /><div className="container hero-inner"><div className="hero-copy"><div className="hero-kicker"><span className="orange-dot" />DIGITAL OPERATIONS. GOVERNED.</div><h1>Digital trust,<br /><span>made operational<span className="hero-period">.</span></span></h1><p className="hero-lead">Cybersecurity, privacy, governed AI and cloud operating platforms that turn uncertainty into <strong>evidence-led action.</strong></p><div className="hero-buttons"><Link href="/contact" className="button button-large">Talk to Varizen <ArrowUpRight size={17} /></Link><Link href="/platform" className="button button-large button-secondary">Explore the platform <ArrowUpRight size={17} /></Link></div><p className="hero-support"><span />Know your exposure. Prove your protection.</p></div><div className="hero-visual"><TrustMap /><div className="hero-visual-note"><span>AN OPERATING SYSTEM FOR DIGITAL TRUST</span><span>VZ / 2026</span></div></div></div><div className="container hero-foot"><a href="#trust-snapshot" className="scroll-label"><ArrowDown size={14} />Scroll to understand</a><span>SECURITY <i /> PRIVACY <i /> GOVERNED AI <i /> CLOUD</span></div></section><HomeSections />
  </>;
}
