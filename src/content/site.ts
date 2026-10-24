export type Maturity = "Evidence required" | "Architecture" | "Concept" | "Published";
export type Product = { slug: string; name: string; category: string; stage: Maturity; summary: string; outcome: string; capabilities: string[]; status: string; index: string; contentVersion: string; lastReviewed: string; reviewedBy: string | null; };
export type Solution = { slug: string; name: string; summary: string; problem: string; action: string; audience: string; outcome: string };
export type Industry = { slug: string; name: string; summary: string; challenge: string; capability: string; consideration: string };

export const company = { name: "Varizen Inc.", url: "https://varizen.co", email: "hi@varizen.co", privacy: "privacy@varizen.co", support: "support@varizen.co", emergency: "emmergency@varizen.co" };

export const nav = [
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Trust", href: "/trust" },
  { label: "Company", href: "/company" },
];

const reviewed = { contentVersion: "2026-10-24.3", lastReviewed: "2026-10-24", reviewedBy: null } as const;

export const products: Product[] = [
  // ── PLATFORM ───────────────────────────────────────────────────────────────
  { slug: "varizen-cloud", name: "Varizen Cloud", category: "Platform", stage: "Architecture", summary: "Cloud and SaaS infrastructure for hosting, compute, storage and deployment.", outcome: "Hosting, compute, storage and deployment foundations for enterprise workloads.", capabilities: ["Cloud infrastructure", "Application hosting", "Storage and compute", "Deployment", "SaaS infrastructure", "Developer infrastructure"], status: "Core platform; availability assessed per capability", index: "01", ...reviewed },
  { slug: "varizen-enos", name: "Varizen ENOS", category: "Platform", stage: "Architecture", summary: "Enterprise Network & Operations Intelligence Layer.", outcome: "Central governance with distributed, isolated execution.", capabilities: ["Network operations", "Infrastructure management", "Device management", "Enterprise orchestration", "Operational intelligence", "Policy management", "Monitoring and control"], status: "Architecture direction; availability not published", index: "02", ...reviewed },
  { slug: "varizen-secure-connect", name: "Varizen Secure Connect", category: "Platform", stage: "Architecture", summary: "Secure connectivity and identity-aware private access.", outcome: "Private, identity-aware access to enterprise infrastructure.", capabilities: ["Secure connectivity", "Private access", "Enterprise network access", "Secure communication", "Identity-aware access", "Infrastructure connectivity"], status: "Architecture direction; availability not published", index: "03", ...reviewed },
  { slug: "varizen-trust-center", name: "Varizen Trust Center", category: "Platform", stage: "Architecture", summary: "Security posture, compliance, governance and evidence.", outcome: "Reviewable security posture and governance evidence.", capabilities: ["Security posture", "Compliance", "Governance", "Trust verification", "Evidence", "Audit readiness", "Risk visibility"], status: "Architecture direction; evidence required per claim", index: "04", ...reviewed },
  { slug: "varizen-titanium", name: "Varizen Titanium", category: "Platform", stage: "Architecture", summary: "The unified Varizen design language.", outcome: "A consistent design language across Varizen surfaces.", capabilities: ["Design tokens", "Typography", "Color", "Components", "Icon system", "Layout", "Motion", "Accessibility"], status: "Design system; applied across Varizen surfaces", index: "05", ...reviewed },

  // ── CYBERSECURITY ──────────────────────────────────────────────────────────
  { slug: "varizen-vector", name: "Varizen Vector", category: "Cybersecurity", stage: "Architecture", summary: "Cybersecurity and exposure intelligence platform.", outcome: "Digital exposure discovered, inspected, correlated, scored, verified and continuously monitored.", capabilities: ["Discovery and asset identification", "Web, DNS, mail, service, API, repository and cloud inspection", "Correlation engine", "Risk engine", "Exposure graph", "Scoring", "Rule, check and verification engines", "Verify Fix", "Planner and orchestration", "Findings and remediation", "Continuous monitoring", "Asset model and multi-tenant control plane"], status: "Flagship direction; maturity evidence pending", index: "06", ...reviewed },
  { slug: "zeon-cyberbridge", name: "ZEON CyberBridge", category: "Cybersecurity", stage: "Architecture", summary: "Cybersecurity and digital infrastructure platform.", outcome: "Security operations and cyber resilience across enterprise infrastructure.", capabilities: ["Cybersecurity", "Cyber infrastructure", "Cyber resilience", "Security operations", "Enterprise protection"], status: "Strategic initiative; maturity evidence pending", index: "07", ...reviewed },
  { slug: "fury-by-n3x4", name: "Fury by N3X4", category: "Cybersecurity", stage: "Concept", summary: "Specialized device and security utility.", outcome: "Focused device-level security tooling.", capabilities: ["Device technology", "Security utilities", "Specialized tooling"], status: "Concept; positioned separately from the enterprise portfolio", index: "08", ...reviewed },
  { slug: "osint-stack", name: "OSINT Stack", category: "Cybersecurity", stage: "Concept", summary: "Open-source intelligence collection and analysis infrastructure.", outcome: "Structured intelligence from open sources.", capabilities: ["Collection", "Aggregation", "Analysis", "Intelligence workflows", "Research", "Automated processing"], status: "Concept; research stage", index: "09", ...reviewed },

  // ── AI & INTELLIGENCE ──────────────────────────────────────────────────────
  {
    slug: "ai-si",
    name: "AI & SI",
    category: "AI & Intelligence",
    stage: "Architecture",
    summary: "Unified AI, Synthetic Intelligence and knowledge architecture: APIs, agent orchestration, enterprise RAG, vector retrieval, and governed knowledge graph synthesis.",
    outcome: "Retrieval-grounded, governed AI workflows, automated knowledge synthesis and enterprise assistance with verified human oversight.",
    capabilities: [
      "AI APIs & foundational models",
      "Synthetic Intelligence (SI) architectures",
      "Agent orchestration & workflows",
      "Vector search & semantic retrieval",
      "Enterprise RAG & knowledge graphs",
      "Memorial & curated intelligence systems",
      "AI governance & human approval gates"
    ],
    status: "Architecture direction; active research & platform integration",
    index: "10",
    ...reviewed
  },
  { slug: "aibrowser", name: "AiBrowser / Eye Browser", category: "AI & Intelligence", stage: "Architecture", summary: "Minimal Chromium-based desktop browser with zero-leak Eye AI, Eye Shield tracker blocking, and MCP client.", outcome: "Private, autonomous browsing with untrusted prompt-injection protection and local execution.", capabilities: ["Zero-leak Eye AI gateway", "Eye Shield tracker blocking", "MCP client stdio", "Tab memory sleeping", "HTTPS-first auto upgrade", "Portable standalone Windows binary"], status: "Available for Windows (.zip / .exe) & web preview", index: "11", ...reviewed },
  { slug: "autonomous-computer-operation", name: "Autonomous Computer Operation", category: "AI & Intelligence", stage: "Concept", summary: "AI computer-use (CUA) research and product direction.", outcome: "Research into controlled computer-use agents.", capabilities: ["Computer-use agents", "Desktop automation", "Application interaction", "OS interaction", "Autonomous workflows", "Enterprise automation"], status: "R&D; research stage", index: "12", ...reviewed },

  // ── DEVELOPER & IDENTITY ───────────────────────────────────────────────────
  { slug: "varizen-api-platform", name: "Varizen API Platform", category: "Developer & Identity", stage: "Architecture", summary: "API gateway, management and developer access.", outcome: "Governed, observable API access across Varizen services.", capabilities: ["API gateway", "API management", "Authentication", "Authorization", "Rate limiting", "Logging", "API keys", "Webhooks"], status: "Architecture direction; availability not published", index: "16", ...reviewed },
  { slug: "varizen-developer-platform", name: "Varizen Developer Platform", category: "Developer & Identity", stage: "Architecture", summary: "Developer portal, SDKs and environment management.", outcome: "A single developer surface for building on Varizen.", capabilities: ["Developer portal", "SDKs", "Documentation", "API testing", "Project management", "Application registration", "Environment management"], status: "Architecture direction; availability not published", index: "17", ...reviewed },
  { slug: "varizen-identity", name: "Varizen Identity", category: "Developer & Identity", stage: "Architecture", summary: "Unified identity, IAM and single sign-on.", outcome: "Controlled identity and access across enterprise systems.", capabilities: ["Authentication", "Identity", "User management", "Organization management", "Sessions", "MFA", "SSO", "OAuth/OIDC", "Enterprise identity"], status: "Architecture direction; availability not published", index: "18", ...reviewed },
  { slug: "varizen-audit", name: "Varizen Audit", category: "Developer & Identity", stage: "Architecture", summary: "Tamper-evident audit and event infrastructure.", outcome: "Every security-sensitive action leaves reviewable evidence.", capabilities: ["Immutable audit", "Event infrastructure", "Tamper evidence", "Security-sensitive logging"], status: "Architecture direction; availability not published", index: "19", ...reviewed },

  // ── CLOUD & ENTERPRISE SERVICES ────────────────────────────────────────────
  { slug: "varizen-studio", name: "Varizen Studio", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Developer and builder environment.", outcome: "A structured environment for building on Varizen.", capabilities: ["Builder environment", "Project scaffolding", "Development tooling"], status: "Future-ready service family; not commercially launched", index: "20", ...reviewed },
  { slug: "varizen-workspace", name: "Varizen Workspace", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Enterprise productivity workspace.", outcome: "Governed collaboration for enterprise teams.", capabilities: ["Productivity", "Collaboration", "Enterprise workspace"], status: "Future-ready service family; not commercially launched", index: "21", ...reviewed },
  { slug: "varizen-analytics", name: "Varizen Analytics", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Business and operational analytics.", outcome: "Operational visibility across governed systems.", capabilities: ["Business analytics", "Operational analytics", "Reporting"], status: "Future-ready service family; not commercially launched", index: "22", ...reviewed },
  { slug: "varizen-edge", name: "Varizen Edge", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Edge infrastructure.", outcome: "Distributed delivery closer to the point of use.", capabilities: ["Edge compute", "Edge delivery", "Distributed infrastructure"], status: "Future-ready service family; not commercially launched", index: "23", ...reviewed },
  { slug: "varizen-deploy", name: "Varizen Deploy", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Deployment and release infrastructure.", outcome: "Repeatable, controlled release management.", capabilities: ["Deployment", "Release management", "Environment promotion"], status: "Future-ready service family; not commercially launched", index: "24", ...reviewed },
  { slug: "varizen-forms", name: "Varizen Forms", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Structured data collection.", outcome: "Validated, structured intake of operational data.", capabilities: ["Form building", "Structured collection", "Data validation"], status: "Future-ready service family; not commercially launched", index: "25", ...reviewed },
  { slug: "varizen-docs", name: "Varizen Docs", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Document collaboration and management.", outcome: "Governed document lifecycle and collaboration.", capabilities: ["Document collaboration", "Document management", "Versioning"], status: "Future-ready service family; not commercially launched", index: "26", ...reviewed },
  { slug: "varizen-mail", name: "Varizen Mail", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Business communication infrastructure.", outcome: "Controlled business communication infrastructure.", capabilities: ["Business email", "Communication infrastructure", "Deliverability"], status: "Future-ready service family; not commercially launched", index: "27", ...reviewed },
  { slug: "varizen-meet", name: "Varizen Meet", category: "Cloud & Enterprise Services", stage: "Concept", summary: "Communication and meeting infrastructure.", outcome: "Real-time communication under enterprise governance.", capabilities: ["Meetings", "Real-time communication", "Conferencing infrastructure"], status: "Future-ready service family; not commercially launched", index: "28", ...reviewed },

  // ── ENTERPRISE ─────────────────────────────────────────────────────────────
  { slug: "kidon", name: "Kidon", category: "Enterprise", stage: "Architecture", summary: "A SaaS operations platform for business workflows and administration.", outcome: "Operational workflows, team management and reporting in one governed product.", capabilities: ["Business operations", "Workflow management", "SaaS administration", "Team and organization management", "Operational automation", "Reporting and analytics"], status: "Product direction; availability not published", index: "29", ...reviewed },
  { slug: "skillconnect", name: "SkillConnect", category: "Enterprise", stage: "Concept", summary: "Web3 ERP for skills, employability and institutional management.", outcome: "Verified skills, professional profiles and employer matching.", capabilities: ["Skills", "Professional profiles", "Education", "Verification", "Certification", "Employer matching", "ERP", "Institutional management", "Web3 identity"], status: "Concept; Bangla-first UX", index: "30", ...reviewed },
  { slug: "doctor360-earth", name: "Doctor360 Earth", category: "Enterprise", stage: "Concept", summary: "Healthcare EMR and AI platform.", outcome: "Connected clinical workflows with patient-controlled identity.", capabilities: ["EMR", "FHIR R4", "AI scoring", "Clinical visualization", "Patient identity", "Healthcare workflows", "IPFS anchoring direction", "Wallet-based patient ID"], status: "Concept; no clinical certification or deployment is claimed", index: "31", ...reviewed },
  { slug: "helpex-my", name: "Helpex.my", category: "Enterprise", stage: "Concept", summary: "Malaysia-focused financial and pawn-style platform.", outcome: "A dedicated Malaysia-market financial product identity.", capabilities: ["Financial workflows", "Pawn-style operations", "Malaysia market"], status: "Concept; no financial licensing is implied", index: "32", ...reviewed },

  // ── FINTECH ────────────────────────────────────────────────────────────────
  { slug: "maxremit", name: "MaxRemit", category: "Fintech", stage: "Concept", summary: "Remittance and liquidity technology.", outcome: "A structured path for cross-border value movement.", capabilities: ["Remittance", "Agent onboarding", "KYC", "Liquidity", "Matching", "Settlement workflows"], status: "Concept; no financial licensing is implied", index: "33", ...reviewed },
  { slug: "flexiremit", name: "FlexiRemit", category: "Fintech", stage: "Concept", summary: "Flexible remittance infrastructure.", outcome: "Configurable remittance flows for different corridors.", capabilities: ["Digital remittance", "Flexible routing", "Transaction infrastructure"], status: "Concept; no financial licensing is implied", index: "34", ...reviewed },
  { slug: "hawlat", name: "Hawlat", category: "Fintech", stage: "Concept", summary: "Peer-to-peer transaction matching platform.", outcome: "Independent parties can discover and connect to transact.", capabilities: ["P2P discovery", "Transaction matching", "Facilitation layer"], status: "Concept; does not provide loans, credit, financing or investment funding", index: "35", ...reviewed },
  { slug: "p2p-liquidity-os", name: "P2P Liquidity OS", category: "Fintech", stage: "Architecture", summary: "Institutional transaction operations platform.", outcome: "Controlled trade, treasury, risk and reconciliation operations.", capabilities: ["Trade state machine", "Agents", "Treasury", "Risk", "Reconciliation", "Audit", "Outbox", "Provider health", "Provider adapters", "Release Guard", "Idempotency", "Decimal financial calculations"], status: "Architecture direction; availability not published", index: "36", ...reviewed },
  { slug: "hashify", name: "Hashify", category: "Fintech", stage: "Concept", summary: "Financial and digital product concept.", outcome: "A focused digital finance product direction.", capabilities: ["Digital finance", "Product concept"], status: "Concept", index: "37", ...reviewed },
  { slug: "hashify-baby", name: "Hashify.baby", category: "Fintech", stage: "Concept", summary: "Hashify-related digital product.", outcome: "A companion digital product within the Hashify direction.", capabilities: ["Digital product", "Hashify ecosystem"], status: "Concept", index: "38", ...reviewed },

  // ── DATA & INTELLIGENCE ────────────────────────────────────────────────────
  { slug: "marketbench", name: "MarketBench", category: "Data & Intelligence", stage: "Architecture", summary: "Marketplace data collection, seller intelligence and competitive analytics.", outcome: "Structured marketplace intelligence from automated collection.", capabilities: ["Marketplace data", "Seller intelligence", "Listing intelligence", "Competitive intelligence", "Automated collection", "Apify integration", "Facebook Marketplace collection", "Data ingestion", "Analytics"], status: "Architecture direction; availability not published", index: "39", ...reviewed },
  { slug: "investor-scenario-lab", name: "Investor Scenario Lab", category: "Data & Intelligence", stage: "Concept", summary: "Scenario-analysis environment for investment modelling.", outcome: "Evidence-backed scenario modelling for investment decisions.", capabilities: ["Investment scenarios", "Accounting", "Banking", "Payments", "CRM", "Billing", "Payroll", "Cap tables", "Market research", "Evidence", "Calculations", "Scenario modelling"], status: "Concept", index: "40", ...reviewed },

  // ── CONSUMER ───────────────────────────────────────────────────────────────
  { slug: "oiix-fun", name: "OIIX.FUN", category: "Consumer", stage: "Concept", summary: "A video-first social networking platform.", outcome: "Real-time social discovery and communication.", capabilities: ["WebRTC", "Video-first interaction", "Social discovery", "Natural Beauty AI", "Referral systems", "Rewards"], status: "Concept; target markets include South and Southeast Asia", index: "41", ...reviewed },
  { slug: "maxvpn", name: "MaxVPN", category: "Consumer", stage: "Concept", summary: "Consumer privacy and secure networking.", outcome: "Protected network access for individual users.", capabilities: ["Privacy", "Secure networking", "VPN infrastructure", "Network protection", "Consumer security"], status: "Concept; consumer security branch", index: "42", ...reviewed },
  { slug: "yourgiftcardsupply", name: "YourGiftCardSupply.com", category: "Consumer", stage: "Concept", summary: "Digital gift-card commerce platform.", outcome: "Digital gift-card commerce operations.", capabilities: ["Digital commerce", "Gift-card supply", "Order handling"], status: "Concept", index: "43", ...reviewed },

  // ── NGO & CHARITABLE ───────────────────────────────────────────────────────
  { slug: "ngo-organization-platform", name: "NGO & Charitable Organization Platform", category: "NGO & Charitable", stage: "Concept", summary: "Configurable digital infrastructure for nonprofit and charitable organizations.", outcome: "Independent nonprofit organizations operating on shared, isolated infrastructure.", capabilities: ["Organization management", "Member management", "Beneficiary management", "Volunteer management", "Donation management", "Campaign management", "Program management", "Digital records", "Document management", "Communication", "Reporting", "Governance", "Compliance", "Transparency", "Analytics"], status: "Ecosystem vertical; not a named Varizen product", index: "44", ...reviewed },
  { slug: "ngo-operations", name: "NGO & Charitable Organization Operations", category: "NGO & Charitable", stage: "Concept", summary: "Administrative, financial and asset operations for nonprofit organizations.", outcome: "Governed administrative and financial operations with digital archives.", capabilities: ["Administrative workflows", "Financial administration", "Estate and asset management", "Rent and property management", "Organizational records", "Internal approvals", "Governance workflows", "Reporting", "Digital archives", "Operational dashboards"], status: "Ecosystem vertical; not a named Varizen product", index: "45", ...reviewed },
  { slug: "ngo-technology-infrastructure", name: "NGO & Charitable Technology Infrastructure", category: "NGO & Charitable", stage: "Concept", summary: "Reusable multi-tenant infrastructure deployable for independent organizations.", outcome: "Strict tenant isolation across multiple independent nonprofit organizations.", capabilities: ["Organization platform", "Program management", "Donation and fund management", "Operations", "Transparency and governance", "Audit", "Evidence", "Compliance", "Tenant isolation"], status: "Ecosystem vertical; not a named Varizen product", index: "46", ...reviewed },

  // ── R&D ────────────────────────────────────────────────────────────────────
  { slug: "enterprise-desktop-hub", name: "Enterprise Desktop Hub", category: "R&D", stage: "Concept", summary: "Enterprise operating-system and application management concept.", outcome: "A unified desktop management approach for enterprises.", capabilities: ["OS management", "Application management", "Enterprise desktop operations"], status: "R&D; not a launched product", index: "47", ...reviewed },
  { slug: "enterprise-os-deployment", name: "Enterprise OS Deployment Platform", category: "R&D", stage: "Concept", summary: "Profile-based operating-system deployment and configuration.", outcome: "Repeatable, profile-driven OS provisioning.", capabilities: ["Profile-based deployment", "Configuration management", "Provisioning automation"], status: "R&D; not a launched product", index: "48", ...reviewed },
  { slug: "office-365-deployment", name: "Office 365 Enterprise Deployment", category: "R&D", stage: "Concept", summary: "Enterprise deployment and device-management workflows.", outcome: "Integrated deployment aligned to organizational infrastructure.", capabilities: ["Enterprise deployment", "Device management", "Organizational integration"], status: "R&D; not a launched product", index: "49", ...reviewed },
  { slug: "windows-enterprise-profiles", name: "Windows Enterprise Login / Profile System", category: "R&D", stage: "Concept", summary: "Enterprise identity, login and device-profile orchestration.", outcome: "Controlled identity and profile lifecycle for enterprise devices.", capabilities: ["Enterprise identity", "Login orchestration", "Device profiles"], status: "R&D; not a launched product", index: "50", ...reviewed },
  { slug: "device-security-research", name: "Device Security Research", category: "R&D", stage: "Concept", summary: "Specialized device and security technology research.", outcome: "Applied research into device-level security.", capabilities: ["Device security", "Security research", "Specialized technology"], status: "R&D; research stage", index: "51", ...reviewed },
  { slug: "experimental-fintech-infrastructure", name: "Experimental Fintech Infrastructure", category: "R&D", stage: "Concept", summary: "Exploratory financial infrastructure research.", outcome: "Validated patterns for future financial infrastructure.", capabilities: ["Settlement experiments", "Liquidity modelling", "Financial infrastructure research"], status: "R&D; research stage", index: "52", ...reviewed },
  { slug: "emerging-ai-systems", name: "Emerging AI Systems", category: "R&D", stage: "Concept", summary: "Exploratory AI systems research.", outcome: "Evaluated AI directions before product commitment.", capabilities: ["Model evaluation", "Agent research", "Emerging AI systems"], status: "R&D; research stage", index: "53", ...reviewed },
];

export const solutions: Solution[] = [
  { slug: "cyber-healthcheck", name: "Cyber HealthCheck", summary: "Understand your current cyber posture and the decisions that matter next.", problem: "Security findings lack context and ownership.", action: "Structure posture, priorities and next actions.", audience: "Leaders and security teams establishing a baseline.", outcome: "A reviewable posture and action record." },
  { slug: "exposurewatch", name: "ExposureWatch", summary: "Discover what is externally visible and turn exposure into action.", problem: "Unknown assets and external exposure expand unnoticed.", action: "Map, contextualize and prioritize external exposure.", audience: "Teams responsible for internet-facing systems.", outcome: "Exposure records linked to remediation." },
  { slug: "cyberdesk", name: "CyberDesk", summary: "Move security work from disconnected signals into a clear workflow.", problem: "Security work is fragmented across tools and teams.", action: "Coordinate ownership, action and verification.", audience: "Operational security and IT teams.", outcome: "Accountable security operations." },
  { slug: "privacy-compliance", name: "Privacy & Compliance", summary: "Connect obligations, controls and evidence without inventing certainty.", problem: "Policies and audit evidence are disconnected.", action: "Map obligations to controls and reviewable evidence.", audience: "Privacy, risk and compliance owners.", outcome: "Traceable control and evidence mapping." },
  { slug: "ai-governance", name: "AI Governance", summary: "Give AI clear boundaries, observable actions and human approval.", problem: "AI adoption outpaces operational controls.", action: "Define policy, data boundaries and approval gates.", audience: "Teams deploying AI in governed environments.", outcome: "Reviewable AI workflow controls." },
  { slug: "cloud-governance", name: "Cloud Governance", summary: "Govern identity, infrastructure, data and resilience across environments.", problem: "Cloud growth creates inconsistency and blind spots.", action: "Unify policy without unifying failure domains.", audience: "Platform, cloud and infrastructure teams.", outcome: "Governed, isolated cloud operations." },
];

export const industries: Industry[] = [
  { slug: "financial-services", name: "Financial Services", summary: "Control risk across complex digital operations.", challenge: "Sensitive data, third parties and audit obligations intersect.", capability: "Exposure, identity, evidence and cloud governance.", consideration: "Data boundaries and auditability. No financial licensing is implied." },
  { slug: "healthcare", name: "Healthcare", summary: "Build connected systems with clear boundaries.", challenge: "Care workflows depend on sensitive data and system availability.", capability: "Isolation, access governance and evidence-led operations.", consideration: "Clinical governance. No medical certification is claimed." },
  { slug: "government", name: "Government", summary: "Make public technology governable and reviewable.", challenge: "Distributed services require accountability and controlled access.", capability: "Policy, evidence, infrastructure and controlled environments.", consideration: "Sovereignty and transparency. No government contracts are claimed." },
  { slug: "saas-technology", name: "SaaS & Technology", summary: "Scale software without losing operational control.", challenge: "Rapid delivery increases cloud and identity complexity.", capability: "Developer platforms, security command and governed AI.", consideration: "Tenant isolation, secure delivery and recovery." },
  { slug: "commerce", name: "Commerce", summary: "Protect digital experiences and operational continuity.", challenge: "Customer trust depends on many connected systems.", capability: "Exposure management, privacy and resilient operations.", consideration: "Data handling, availability and third-party risk." },
  { slug: "professional-services", name: "Professional Services", summary: "Turn sensitive work into governed workflows.", challenge: "Distributed teams handle confidential client information.", capability: "Identity, privacy, secure collaboration and evidence.", consideration: "Confidentiality and accountable access." },
];

export const platformLayers = ["Cloud foundation", "ENOS control plane", "Compute fabric", "Project tenancy", "Data fabric", "Integration fabric", "Security command", "SRE operations", "Developer platform", "AI & compute", "Operator interfaces", "Governance"];

export const offices = [
  { country: "United States", entity: "Varizen Inc.", address: "1712 Pioneer Ave, Cheyenne, Wyoming, USA" },
  { country: "Malaysia", entity: "Local partnership called off", address: "55 Jalan Hamzah, KG Baru, 50350 Kuala Lumpur, Malaysia" },
  { country: "Bangladesh", entity: "Varizen Inc. (P) Ltd. AFR", address: "STFL House, 173 E Ullon Road, W Rampura, Dhaka 1217, Bangladesh" },
];

export const trustDocuments = [
  { title: "Security overview", slug: "security", status: "Published", description: "Security principles, architecture direction and control boundaries." },
  { title: "Privacy notice", slug: "privacy", status: "Legal review required", description: "Draft information-handling notice for this public website." },
  { title: "Terms of use", slug: "terms", status: "Legal review required", description: "Draft website terms; not final legal documentation." },
  { title: "Responsible disclosure", slug: "responsible-disclosure", status: "Published", description: "How to report a potential security concern." },
  { title: "Data handling", slug: "data-handling", status: "Published", description: "Public contact-data handling and retention principles." },
  { title: "Accessibility", slug: "accessibility", status: "Published", description: "Our accessibility commitments and feedback channel." },
  { title: "Subprocessors", slug: "subprocessors", status: "Not yet published", description: "No verified subprocessor list has been supplied for publication." },
  { title: "Certifications & attestations", slug: "compliance", status: "Not yet published", description: "No certifications or attestations are claimed at this time." },
  { title: "System status", slug: "status", status: "Not yet published", description: "No live telemetry is connected. No uptime claim is made." },
];

export function getProduct(slug: string) { return products.find((item) => item.slug === slug); }
export function getSolution(slug: string) { return solutions.find((item) => item.slug === slug); }
export function getIndustry(slug: string) { return industries.find((item) => item.slug === slug); }

/**
 * CMS-ready content override.
 *
 * Place `content/products.override.json` in the project root to change product
 * copy, maturity labels, status or capabilities without editing code. Each entry
 * is matched by `slug`. Unknown fields are ignored; missing required fields fall
 * back to the compiled defaults above. This keeps placeholders intact while
 * allowing product content to evolve as maturity evidence is published.
 */
export function loadProductOverrides(): Record<string, Partial<Product>> {
  if (typeof process === "undefined" || !process.env) return {};
  const raw = process.env.VZ_PRODUCT_OVERRIDES;
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<Product>>;
    return parsed;
  } catch {
    return {};
  }
}

export function getProductWithOverride(slug: string): Product | undefined {
  const base = getProduct(slug);
  if (!base) return undefined;
  const override = loadProductOverrides()[slug];
  if (!override) return base;
  return { ...base, ...override };
}
