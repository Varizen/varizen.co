import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { trustDocuments } from "@/content/site";
import { PageHero, Section, Stage } from "@/components/ui";

type SectionContent = { heading: string; paragraphs: string[]; bullets?: string[] };
const common: Record<string, SectionContent[]> = {
  security: [
    { heading: "Security architecture direction", paragraphs: ["Varizen’s target operating model connects identity, policy, project isolation, runtime controls, telemetry, evidence and recovery. These are architectural principles, not a statement that every control is deployed in every product."], bullets: ["Least privilege and explicit authorization boundaries", "Multi-factor authentication for privileged access", "Short-lived credentials and controlled session lifetimes", "Encryption in transit and protected storage", "Append-only audit design and reviewable evidence", "Human approval for sensitive operational decisions"] },
    { heading: "Application security", paragraphs: ["This public application uses security headers, validated input, origin checks for contact mutations, rate limiting and deny-by-default protected routes. Production deployment requires the environment, migration and operational checks described in the deployment documentation."] },
    { heading: "Claims and assurance", paragraphs: ["No independent certification, penetration-test result, uptime statistic or customer deployment is claimed on this page. Evidence must be supplied and reviewed before such claims are published."] },
  ],
  privacy: [
    { heading: "Information you choose to provide", paragraphs: ["When you submit the contact form, Varizen receives the reason, name, organization, role, email, optional phone number, message and any selected capability or project interest. The form does not request passwords or secret documents."] },
    { heading: "Why information is used", paragraphs: ["Contact information is used to evaluate and respond to your enquiry, maintain a record of the request, protect the service from abuse and meet applicable obligations. Optional analytics remain disabled unless a provider is configured and consent is recorded where required."] },
    { heading: "Storage, access and retention", paragraphs: ["Production contact submissions are stored in the configured PostgreSQL database. Access must be limited to authorized personnel. Contact requests should be reviewed after 24 months and deleted or anonymized when no longer needed, unless another documented obligation applies. This schedule requires operational approval before it becomes a final policy."], bullets: ["Do not submit confidential documents through the public form.", "Rate-limit identifiers are keyed hashes, not raw IP addresses in application logs.", "Contact payloads and credentials must never be written to application logs."] },
    { heading: "Your choices and contact", paragraphs: ["To ask about your information or request deletion, contact privacy@varizen.co. Identity may need to be verified before acting on a request. Legal review is required before this draft becomes the final privacy notice."] },
  ],
  terms: [
    { heading: "Using this website", paragraphs: ["This website provides general corporate and architectural information. You may use it for lawful evaluation and communication with Varizen. Do not attempt unauthorized access, disrupt availability, scrape at abusive rates or misrepresent your identity."] },
    { heading: "No professional or investment advice", paragraphs: ["Architectural descriptions do not constitute a guarantee of fitness for a particular environment. Product maturity and availability must be confirmed separately. Public pages contain no offer, investment recommendation or promise of return."] },
    { heading: "Intellectual property", paragraphs: ["Varizen branding, original site content and software are protected by applicable rights. No license is granted except for ordinary viewing of this public website. Third-party software remains subject to its respective licenses."] },
    { heading: "Draft status", paragraphs: ["These draft terms are provided for legal review and are not represented as final legal terms. Final terms require approval by qualified counsel and the company before publication."] },
  ],
  "responsible-disclosure": [
    { heading: "Report a concern", paragraphs: ["Send a concise description and reproduction context to emmergency@varizen.co. Do not include secrets, personal data or confidential documents. A report does not create a promise of response time or compensation."] },
    { heading: "Research boundaries", paragraphs: ["Use only systems and accounts you are authorized to test."], bullets: ["Do not access, alter or retain another person’s data.", "Do not perform denial-of-service testing or social engineering.", "Do not publicly disclose a potential issue before it has been reviewed.", "Stop testing and report if you encounter unexpected sensitive information."] },
    { heading: "Scope", paragraphs: ["This page covers the public varizen.co website. Authorization for other systems must be obtained separately and explicitly. No bug bounty or safe-harbor commitment is implied by this draft process."] },
  ],
  "data-handling": [
    { heading: "Public website data", paragraphs: ["The public site is designed to work without an analytics provider. Essential local storage remembers theme and cookie preferences. Contact submissions are stored only when the production database is configured."] },
    { heading: "Sensitive documents", paragraphs: ["Protected documents must be delivered only after session and object-level entitlement checks. Entitlement revocation must take effect on subsequent access. No protected document storage is enabled in this public deployment foundation."] },
    { heading: "Operational data", paragraphs: ["The application shell does not contain production telemetry. Illustrative website diagrams are labelled and never presented as live measurements."] },
  ],
  accessibility: [
    { heading: "Our approach", paragraphs: ["The site is built with semantic landmarks, labelled controls, keyboard navigation, visible focus, responsive type and reduced-motion support. Content and controls are intended to remain usable across mobile and desktop layouts."] },
    { heading: "Feedback", paragraphs: ["If you encounter an accessibility barrier, email support@varizen.co with the page address and a description of the issue. Do not include sensitive personal information."] },
    { heading: "Ongoing review", paragraphs: ["Accessibility is a continuing engineering responsibility. Automated checks support, but do not replace, manual keyboard, screen-reader and contrast evaluation."] },
  ],
  cookies: [
    { heading: "Essential local storage", paragraphs: ["The site stores your theme and cookie choice in your browser when storage is available. These preferences do not authenticate you and are not used for advertising."] },
    { heading: "Optional analytics", paragraphs: ["No analytics vendor is enabled by default. Allowing optional analytics records your choice only; a consented provider must be separately configured before any optional event collection occurs."] },
    { heading: "Your choice", paragraphs: ["You can clear site data through your browser to reset stored preferences. This draft notice requires legal review if analytics or other optional technologies are introduced."] },
  ],
  subprocessors: [{ heading: "Not yet published", paragraphs: ["No verified production subprocessor list has been supplied for this website. Hosting, database, email and other providers must be confirmed before a list is published. No list is inferred from the technical architecture."] }],
  compliance: [{ heading: "No certifications claimed", paragraphs: ["Varizen does not claim SOC 2, ISO 27001, HIPAA, GDPR certification, PCI DSS, FedRAMP or any government authorization on this website. Compliance obligations and independently verified assurance evidence are different things."] }, { heading: "Evidence-first publication", paragraphs: ["A future assurance entry should identify the exact entity, scope, assessment period, independent assessor and current evidence status before publication."] }],
  status: [{ heading: "Live status is not connected", paragraphs: ["There is no public live telemetry source configured for this website. No uptime percentage or operational incident history is displayed. Illustrative interface elements on the homepage are explicitly labelled and contain no production measurements."] }, { heading: "Incident communication", paragraphs: ["A verified incident communication process and authoritative status source must be established before publishing operational status or incident notices."] }],
};

export const instant = false;
export function generateStaticParams() { return [...trustDocuments.map(({ slug }) => ({ slug })), { slug: "cookies" }]; }
export async function generateMetadata({ params }: PageProps<"/trust/[slug]">): Promise<Metadata> { const { slug } = await params; const item = trustDocuments.find((doc) => doc.slug === slug) ?? (slug === "cookies" ? { title: "Cookie notice" } : undefined); return item ? { title: item.title, alternates: { canonical: `/trust/${slug}` } } : {}; }
export default async function TrustDocument({ params }: PageProps<"/trust/[slug]">) { const { slug } = await params; const sections = common[slug]; if (!sections) notFound(); const item = trustDocuments.find((doc) => doc.slug === slug); const title = item?.title ?? "Cookie notice"; return <><PageHero eyebrow="TRUST CENTER / PUBLIC DOCUMENT" title={title} copy={item?.description ?? "How this website uses essential storage and optional preferences."}><Stage>{item?.status ?? "Legal review required"}</Stage></PageHero><Section><article className="legal-document">{(slug === "privacy" || slug === "terms" || slug === "cookies") && <p className="legal-warning">Draft for legal review. This is transparent operational information, not a final legal document.</p>}{sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((p) => <p key={p}>{p}</p>)}{section.bullets && <ul>{section.bullets.map((li) => <li key={li}>{li}</li>)}</ul>}</section>)}<p style={{ marginTop: 45 }}><Link href="/trust" className="arrow-link"><ArrowLeft size={15} />Back to Trust Center</Link></p><p>Questions? <a href="mailto:privacy@varizen.co" style={{ color: "var(--accent)" }}>privacy@varizen.co <ArrowUpRight size={12} style={{ verticalAlign: "middle" }} /></a></p></article></Section></>; }
