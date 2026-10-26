import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Coffee, HeartHandshake, ShieldCheck } from "lucide-react";
import { PageHero, Section, SectionHead, Stage } from "@/components/ui";
import { company, kofi } from "@/content/site";

export const metadata: Metadata = {
  title: "Support Varizen",
  description: "Voluntary support for Varizen's open research, documentation and public tooling through Ko-fi. Support is never a purchase, investment or entitlement.",
  alternates: { canonical: "/support" },
};

const boundaries = [
  ["Voluntary only", "A contribution is a gift. It buys no product, licence, priority support or roadmap influence."],
  ["Not an investment", "Supporting Varizen is not an offer of equity, securities or any financial return."],
  ["No data exchanged", "Payment is handled entirely by Ko-fi. Varizen never receives or stores your card details."],
  ["No obligation", "Public documentation, the Trust Center and product information stay free and unchanged."],
];

export default function SupportPage() {
  return <>
    <PageHero
      eyebrow="SUPPORT / VOLUNTARY"
      title="Fund the work that stays public."
      copy="Varizen publishes security guidance, governance models and documentation at no cost. If that work is useful to you, you can support it voluntarily through Ko-fi."
    >
      <a className="button button-large" href={kofi.url} target="_blank" rel="noopener noreferrer">
        <Coffee size={17} aria-hidden="true" /> {kofi.label} <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </PageHero>

    <Section>
      <SectionHead
        eyebrow="WHAT SUPPORT FUNDS"
        title="Public work, openly available."
        copy="Contributions are directed at material we publish rather than at commercial delivery."
      />
      <div className="detail-grid">
        <div>
          <h2>Research and reference material</h2>
          <p>Support helps maintain the public parts of Varizen: security and privacy guidance, the evidence and governance models behind ENOS, and the documentation that explains how our products are designed to behave.</p>
          <p>It does not accelerate commercial engagements, and it does not create a customer relationship.</p>
          <Stage>Voluntary contribution · No entitlement</Stage>
        </div>
        <div className="detail-list">
          {["Public security and privacy guidance", "Governance and evidence model documentation", "Trust Center reference material", "Open tooling and reference implementations"].map((item, i) => (
            <div key={item}><span>0{i + 1}</span>{item}</div>
          ))}
        </div>
      </div>
    </Section>

    <Section className="surface-section">
      <SectionHead
        eyebrow="CLEAR BOUNDARIES"
        title="What support is not."
        copy="We would rather be explicit than ambiguous about money."
      />
      <div className="detail-grid">
        <div className="detail-list">
          {boundaries.map(([title, copy], i) => (
            <div key={title}><span>0{i + 1}</span><span><strong>{title}</strong> — {copy}</span></div>
          ))}
        </div>
        <div>
          <h2>Handled by Ko-fi</h2>
          <p>Ko-fi processes the payment and holds the relationship with your payment provider. Varizen receives only the information Ko-fi chooses to share with a creator, such as a display name and an optional message.</p>
          <p>Read how we treat information in the <Link href="/trust/privacy" className="arrow-link">privacy notice <ArrowUpRight size={15} aria-hidden="true" /></Link></p>
          <p style={{ marginTop: 25, fontSize: 11 }}>
            <ShieldCheck size={14} aria-hidden="true" style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            Never send credentials, personal data or confidential material in a Ko-fi message.
          </p>
        </div>
      </div>
    </Section>

    <Section>
      <div className="detail-cta">
        <div>
          <h2>Prefer a commercial conversation?</h2>
          <p>For platforms, products, partnerships or procurement, use the normal contact route.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/contact" className="button">Talk to Varizen <ArrowUpRight size={16} aria-hidden="true" /></Link>
          <a className="button button-secondary" href={`mailto:${company.support}`}>
            <HeartHandshake size={16} aria-hidden="true" /> {company.support}
          </a>
        </div>
      </div>
    </Section>
  </>;
}
