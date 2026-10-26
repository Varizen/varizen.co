/**
 * STFL Initiatives & Ventures Machine-Readable Registry
 * Institutional source of truth for all public-facing and governed projects.
 * 
 * Strict Governance:
 * - Varizen Inc. is strictly excluded from Initiatives & Ventures.
 * - Only projects with public_visibility === "PUBLICATION_APPROVED" are exposed publicly.
 */

export type ProjectCategory =
  | "SOCIAL_IMPACT"
  | "OPPORTUNITY_AND_WORKFORCE"
  | "PROPERTY_AND_RURAL_ECONOMY"
  | "HEALTH_AND_WELLBEING"
  | "DIGITAL_AND_MARKETPLACE"
  | "FINANCE_AND_ACCESS"
  | "COMMUNITY_AND_CULTURE"
  | "EXPERIMENTAL_EMERGING";

export type ProjectType =
  | "PROGRAM"
  | "INITIATIVE"
  | "PROJECT"
  | "PLATFORM"
  | "VENTURE"
  | "SOCIAL_ENTERPRISE"
  | "DIGITAL_PLATFORM"
  | "COMMUNITY_PROJECT"
  | "PROPERTY_PROJECT"
  | "AGRICULTURAL_PROJECT"
  | "RESEARCH_PROJECT"
  | "PUBLIC_INTEREST_PLATFORM"
  | "PARTNERSHIP_PROJECT";

export type ProjectRelationship =
  | "STFL_PROGRAM"
  | "STFL_INITIATIVE"
  | "STFL_PROJECT"
  | "STFL_CONTROLLED_PROJECT"
  | "STFL_PORTFOLIO_PROJECT"
  | "STFL_SUPPORTED_PROJECT"
  | "STFL_PARTNERSHIP"
  | "INDEPENDENT_ENTITY"
  | "EXTERNAL_REFERENCE"
  | "UNVERIFIED";

export type ProjectMaturity =
  | "IDEA"
  | "RESEARCH"
  | "CONCEPT"
  | "PROTOTYPE"
  | "ACTIVE_DEVELOPMENT"
  | "PILOT"
  | "LIVE"
  | "SCALING"
  | "PAUSED"
  | "ARCHIVED"
  | "DEPRECATED";

export interface InitiativeMetric {
  value: string;
  labelEn: string;
  labelBn: string;
}

export interface InitiativeFeature {
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
}

export interface EcosystemProject {
  projectId: string;
  slug: string;
  name: string;
  displayNameEn: string;
  displayNameBn: string;
  taglineEn: string;
  taglineBn: string;
  shortDescriptionEn: string;
  shortDescriptionBn: string;
  category: ProjectCategory;
  categoryNumber: string;
  categoryNameEn: string;
  categoryNameBn: string;
  type: ProjectType;
  status: ProjectMaturity;
  statusLabelEn: string;
  statusLabelBn: string;
  ownership: string;
  relationship: ProjectRelationship;
  relationshipLabelEn: string;
  relationshipLabelBn: string;
  legalEntity: string;
  country: string;
  market: string;
  domain: string;
  canonicalPath: string;
  logoSource: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
    surface: string;
    border: string;
  };
  publicVisibility: "PUBLICATION_APPROVED" | "INTERNAL_ONLY" | "UNVERIFIED";
  ecosystemPosition: "PRIMARY_ANCHOR" | "KEY_INITIATIVE" | "PORTFOLIO_VENTURE" | "ECOSYSTEM_PLATFORM";
  whyItExistsEn: string;
  whyItExistsBn: string;
  theOpportunityEn: string;
  theOpportunityBn: string;
  whatItDoesEn: string;
  whatItDoesBn: string;
  howItWorksEn: string[];
  howItWorksBn: string[];
  whoItServesEn: string[];
  whoItServesBn: string[];
  ecosystemRoleEn: string;
  ecosystemRoleBn: string;
  whatIsBeingBuiltEn: string[];
  whatIsBeingBuiltBn: string[];
  impactOutcomesEn: string[];
  impactOutcomesBn: string[];
  legalStatusEn: string;
  legalStatusBn: string;
  partnershipsEn: string;
  partnershipsBn: string;
  metrics: InitiativeMetric[];
  keyFeatures: InitiativeFeature[];
  relatedPrograms: { nameEn: string; nameBn: string; path: string }[];
  sourceDocuments: string[];
  lastVerified: string;
}

export const PUBLICATION_APPROVED_INITIATIVES: EcosystemProject[] = [
  {
    projectId: "STFL-PRJ-2026-0001",
    slug: "grihostios",
    name: "GrihostiOS",
    displayNameEn: "GrihostiOS — Property, Lease & Rural Economy OS",
    displayNameBn: "গৃহস্থী ওএস — সম্পত্তি, ইজারা ও গ্রামীণ অর্থনীতি অপারেটিং সিস্টেম",
    taglineEn: "Governed Operating System for Property, Leases, Floodplain Agriculture & Crop-Share Settlements",
    taglineBn: "সম্পত্তি, বাণিজ্যিক লিজ, প্লাবনভূমি কৃষিজমি ও বর্গা/আধি চুক্তির প্রাতিষ্ঠানিক অপারেটিং সিস্টেম",
    shortDescriptionEn: "Comprehensive operating system for real estate, commercial leases, agricultural land, crop-share seasons (Barga/Adhi), and governed digital agreements.",
    shortDescriptionBn: "সম্পত্তি, বাণিজ্যিক ইজারা, কৃষিজমি, ফসল-ভাগ (বর্গা/আধি) ও নিয়ন্ত্রিত চুক্তি ব্যবস্থাপনার পূর্ণাঙ্গ প্রাতিষ্ঠানিক অপারেটিং সিস্টেম।",
    category: "PROPERTY_AND_RURAL_ECONOMY",
    categoryNumber: "03",
    categoryNameEn: "Property & Rural Economy",
    categoryNameBn: "সম্পত্তি ও গ্রামীণ অর্থনীতি",
    type: "PLATFORM",
    status: "PILOT",
    statusLabelEn: "Operational Pilot",
    statusLabelBn: "সক্রিয় পাইলট প্রকল্প",
    ownership: "STFL_CONTROLLED",
    relationship: "STFL_CONTROLLED_PROJECT",
    relationshipLabelEn: "An STFL Operating Initiative",
    relationshipLabelBn: "এসটিএফএল নিয়ন্ত্রিত প্ল্যাটফর্ম",
    legalEntity: "SohaelTasneem Foundation",
    country: "Bangladesh",
    market: "Bangladesh (Urban Rentals & Agrarian Floodplains)",
    domain: "grihostios.stflbd.app",
    canonicalPath: "/initiatives/grihostios",
    logoSource: "/media/grihostios-logo.svg",
    brandColors: {
      primary: "#14532D", // Earth Green
      secondary: "#081F2D",
      accent: "#16A34A",
      surface: "#F0FDF4",
      border: "#BBF7D0",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "PRIMARY_ANCHOR",
    whyItExistsEn: "In Bangladesh, over 80% of urban house rentals and 95% of agricultural crop-shares (Barga/Adhi) operate on informal, verbal, or vulnerable agreements prone to arbitrary eviction, unverified deposits, and exploitative revenue-shares. GrihostiOS provides institutional certainty, cryptographic proof, and mathematical fairness to property and agrarian operations.",
    whyItExistsBn: "বাংলাদেশে ৮০% এরও বেশি নগর আবাসন এবং ৯৫% কৃষিজমির বর্গা চুক্তি মৌখিক বা অনিরাপদ শর্তে পরিচালিত হয়, যা খেয়ালখুশিমতো উচ্ছেদ ও ন্যায্য ভাগের বঞ্চনার ঝুঁকি তৈরি করে। গৃহস্থী ওএস সম্পত্তি ও কৃষি অর্থনীতিতে প্রাতিষ্ঠানিক নিশ্চয়তা, ক্রিপ্টোগ্রাফিক যাচাই ও ন্যায়সঙ্গত চুক্তিকাঠামো নিশ্চিত করে।",
    theOpportunityEn: "By unifying urban tenancy management with rural agrarian land tenure (Khatiyan, Mauza, Plot, and Floodplain elevation classes), GrihostiOS transforms vulnerable land relationships into governed, bankable economic assets.",
    theOpportunityBn: "নগর আবাসন ও গ্রামীণ খতিয়ান-দাগভিত্তিক কৃষিজমির (উঁচু, মাঝারি, নিম্নাঞ্চল) শ্রেণীবিভাগকে এক প্ল্যাটফর্মে এনে গৃহস্থী ওএস প্রান্তিক চাষি ও বাড়িওয়ালা উভয়ের জন্য অর্থনৈতিক সুরক্ষা গড়ে তোলে।",
    whatItDoesEn: "Manages buildings, rooms, commercial spaces, and agricultural plots. Orchestrates automated 6-stage agreements (SELECT → FILL → CHECK → SIGN → RECEIVE → VERIFY), tracks utility meters, records crop-share yields (Aman, Boro, Aus), and generates cryptographically signed QR receipts.",
    whatItDoesBn: "বাড়ি, রুম, বাণিজ্যিক দোকান এবং কৃষি দাগ ব্যবস্থাপনা করে। ৬-ধাপের চুক্তি স্বয়ংক্রিয় করে (নির্বাচন → তথ্য পূরণ → নিরীক্ষা → ডিজিটাল স্বাক্ষর → নিশ্চিতকরণ → যাচাইকরণ), বিদ্যুৎ-পানি মিটার ট্র্যাক করে এবং বর্গা ফসলের নির্ভুল হিসাব রাখে।",
    howItWorksEn: [
      "Select Agreement Class (Residential Tenancy, Commercial Lease, Agrarian Barga, or Greenfield Land Partnership).",
      "Enter empirical facts (Landlord/Tenant National ID, Mauza/Khatiyan/Plot details, security deposit, monthly rent/yield split).",
      "System verifies regulatory safeguards and enforces non-exploitative legal clauses under Bangladesh Land & Tenancy laws.",
      "Parties execute digital/counterpart signatures with timestamped cryptographic hashes.",
      "Tenant and Owner receive governed official PDF documents with secure QR verification seals.",
      "Ongoing management tracks payments, utility bills, maintenance tickets, and seasonal harvest splits."
    ],
    howItWorksBn: [
      "চুক্তির ধরণ নির্বাচন (বাসাবাড়ির ভাড়া, বাণিজ্যিক লিজ, কৃষিজমির বর্গা বা দীর্ঘমেয়াদী যৌথ উদ্যোগ)।",
      "তথ্য প্রদান (জাতীয় পরিচয়পত্র, খতিয়ান/দাগ নম্বর, জামানত, মাসিক ভাড়া বা ফসলের আনুপাতিক বণ্টন)।",
      "আইনি কাঠামো নিরীক্ষা এবং অন্যায্য শর্ত নিরসন।",
      "ডিজিটাল ও কাউন্টারপার্ট স্বাক্ষর এবং টাইমস্ট্যাম্পযুক্ত ক্রিপ্টোগ্রাফিক হ্যাশ তৈরি।",
      "কিউআর ভেরিফিকেশন সিল সম্বলিত প্রাতিষ্ঠানিক চুক্তিপত্র হস্তান্তর।",
      "নিয়মিত ভাড়া, ইউটিলিটি বিল, রক্ষণাবেক্ষণ ও মৌসুমী ফসল বণ্টনের ডিজিটাল ট্র্যাকিং।"
    ],
    whoItServesEn: [
      "Urban Landlords & Property Managers managing multiple residential units",
      "Residential Tenants seeking protected leases with transparent security deposits",
      "Smallholder Farmers and Sharecroppers (Bargadars) cultivating land without exploitation",
      "Agrarian Landowners needing structured seasonal oversight of crop cycles",
      "Commercial Leaseholders and Rural Cooperatives"
    ],
    whoItServesBn: [
      "নগর বাড়িওয়ালা ও প্রপার্টি ম্যানেজার",
      "নিরাপদ ও লিখিত চুক্তির সুবিধা প্রত্যাশী ভাড়াটিয়া",
      "প্রান্তিক বর্গা চাষি ও আধি চাষি",
      "কৃষিজমির মালিক ও সমবায় উদ্যোক্তা",
      "বাণিজ্যিক দোকান ও গ্রামীণ এন্টারপ্রাইজ"
    ],
    ecosystemRoleEn: "Primary Anchor for STFL's physical asset, housing dignity, and rural agrarian economic resilience programs.",
    ecosystemRoleBn: "এসটিএফএল-এর আবাসন মর্যাদা, ভৌত অবকাঠামো ও গ্রামীণ অর্থনৈতিক সক্ষমতার প্রধান নোঙর।",
    whatIsBeingBuiltEn: [
      "STFL VI Tenancy Engine with automated Word & PDF legal agreement compiler",
      "Agrarian Land Ledger tracking Aman, Boro, Aus, and Rabi seasonal yields",
      "Offline-first mobile inspection tool for unit handover and property damage tracking",
      "Instant QR Verification Portal linked directly to public STFL verification rails"
    ],
    whatIsBeingBuiltBn: [
      "স্বয়ংক্রিয় আইনি চুক্তিপত্র সংকলক ও টেমপ্লেট ইঞ্জিন",
      "আমন, বোরো, আউশ ও রবি ফসলের উৎপাদন হিসাব ব্যবস্থা",
      "রুম হস্তান্তর ও ক্ষতিপূরণ নিরীক্ষার অফলাইন মোবাইল টুল",
      "এসটিএফএল ভেরিফিকেশন নেটওয়ার্কের সাথে সংযুক্ত পাবলিক কিউআর যাচাইকরণ পোর্টাল"
    ],
    impactOutcomesEn: [
      "100% elimination of arbitrary verbal eviction without notice",
      "Transparent deposit return schedules protecting vulnerable tenants",
      "Fair crop-share accounting ensuring smallholder farmers receive full entitlement",
      "Immutable audit records preventing boundary and rental disputes"
    ],
    impactOutcomesBn: [
      "মৌখিক উচ্ছেদ ও নোটিশহীন সংকট সম্পূর্ণ দূরীকরণ",
      "ভাড়াটিয়ার জামানত সুরক্ষার স্পষ্ট আইনি সময়সূচি",
      "ন্যায্য ফসল বণ্টনের মাধ্যমে প্রান্তিক কৃষকের অধিকার সুরক্ষা",
      "বিরোধমুক্ত খতিয়ান ও জমার অপরিবর্তনীয় ডিজিটাল খতিয়ান"
    ],
    legalStatusEn: "Operational pilot governed under Bangladesh Transfer of Property Act, Premises Rent Control Act, and State Acquisition & Tenancy Act. Does not provide legal advice; provides governed structured workflows.",
    legalStatusBn: "বাংলাদেশ সম্পত্তি হস্তান্তর আইন, বাড়িভাড়া নিয়ন্ত্রণ আইন ও প্রজাস্বত্ব আইনের কাঠামোর সাথে সামঞ্জস্যপূর্ণ। আইনি পরামর্শ নয়, বরং আইনি সম্মতি নিশ্চিতকারী কর্মপ্রবাহ প্রদান করে।",
    partnershipsEn: "Integrated with STFL Rural Development Unit and local land survey advisors.",
    partnershipsBn: "এসটিএফএল পল্লী উন্নয়ন শাখা ও স্থানীয় সার্ভেয়ারদের সহযোগিতায় পরিচালিত।",
    metrics: [
      { value: "100%", labelEn: "Governed Clauses", labelBn: "নিয়ন্ত্রিত আইনি ধারা" },
      { value: "6-Step", labelEn: "Agreement Workflow", labelBn: "চুক্তি কার্যপ্রণালী" },
      { value: "4 Zones", labelEn: "Floodplain Elevation Classes", labelBn: "প্লাবনভূমি কৃষি অঞ্চল" },
      { value: "SHA-256", labelEn: "Cryptographic Seal", labelBn: "ক্রিপ্টোগ্রাফিক সুরক্ষা" }
    ],
    keyFeatures: [
      {
        titleEn: "Urban Tenancy Operating System",
        titleBn: "নগর আবাসন ব্যবস্থাপনা",
        descEn: "Room and unit inventory, automated rent rolls, utility meter billing, and maintenance ticketing.",
        descBn: "রুম ও ফ্ল্যাট ইনভেন্টরি, স্বয়ংক্রিয় ভাড়া আদায় তালিকা, সাবমিটার বিলিং ও রক্ষণাবেক্ষণ ট্র্যাকিং।"
      },
      {
        titleEn: "Agrarian Barga & Adhi Engine",
        titleBn: "বর্গা ও আধি কৃষি ইঞ্জিন",
        descEn: "Supports seasonal crop-share splits, input cost sharing, and drought/flood risk allocations.",
        descBn: "মৌসুমী ফসল ভাগ, সার-বীজ খরচ বণ্টন এবং বন্যা-খরা ঝুঁকি ব্যবস্থাপনার স্পষ্ট নিয়ম।"
      },
      {
        titleEn: "SELECT → SIGN Agreement Pipeline",
        titleBn: "৬-ধাপের চুক্তি প্রবাহ",
        descEn: "Guards against predatory clauses and enforces standard notice periods and deposit protections.",
        descBn: "শোষণমূলক শর্ত প্রতিরোধ করে এবং লিখিত নোটিশ ও জামানত ফেরত নিশ্চিত করে।"
      },
      {
        titleEn: "Public Document Verification",
        titleBn: "পাবলিক ডকুমেন্ট ভেরিফিকেশন",
        descEn: "Every generated agreement and rent receipt carries a cryptographically verifiable QR code on stflbd.app.",
        descBn: "প্রতিটি চুক্তিপত্র ও রসিদে এসটিএফএল যাচাইকরণ কোড যুক্ত থাকে।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" },
      { nameEn: "Digital Inclusion & Skills", nameBn: "ডিজিটাল সক্ষমতা", path: "/programs/digital-inclusion" }
    ],
    sourceDocuments: [
      "STFL_WEB_GRIHOSTIOS_MODEL.md",
      "STFL_AIO_PROPERTY_MODEL.md",
      "main/api/migrations/0003_grihostios.sql",
      "STFL House/AIO/STFL_House_Room_০১_House_Rent_Agreement.docx"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0002",
    slug: "skillconnect",
    name: "SkillConnect",
    displayNameEn: "SkillConnect — Workforce & Opportunity Platform",
    displayNameBn: "স্কিলকানেক্ট — দক্ষতা, শ্রমশক্তি ও কর্মসংস্থান প্ল্যাটফর্ম",
    taglineEn: "Decentralized Workforce Onboarding, Verified Credentials & Ethical Migration Guidance",
    taglineBn: "শ্রমশক্তি নিবন্ধন, যাচাইকৃত দক্ষতা সনদ ও নিরাপদ অভিবাসন সহায়তা",
    shortDescriptionEn: "Workforce registration, verified skill credentials, ethical recruitment matching, and cross-border migrant worker protection.",
    shortDescriptionBn: "দক্ষ ও আধাদক্ষ কর্মীদের দক্ষতা যাচাই, সনদপত্র সংরক্ষণ, নিরাপদ অভিবাসন সহায়তা ও ন্যায্য কর্মসংস্থান সংযোগ প্ল্যাটফর্ম।",
    category: "OPPORTUNITY_AND_WORKFORCE",
    categoryNumber: "02",
    categoryNameEn: "Opportunity & Workforce",
    categoryNameBn: "দক্ষতা ও কর্মসংস্থান",
    type: "INITIATIVE",
    status: "ACTIVE_DEVELOPMENT",
    statusLabelEn: "Active Development",
    statusLabelBn: "সক্রিয় উন্নয়ন পর্যায়",
    ownership: "STFL_CONTROLLED",
    relationship: "STFL_INITIATIVE",
    relationshipLabelEn: "An STFL Strategic Initiative",
    relationshipLabelBn: "এসটিএফএল কৌশলগত উদ্যোগ",
    legalEntity: "SohaelTasneem Foundation",
    country: "Bangladesh",
    market: "Bangladesh, Malaysia & Cross-Border Migration Corridors",
    domain: "skillconnect.stflbd.app",
    canonicalPath: "/initiatives/skillconnect",
    logoSource: "/media/skillconnect-logo.svg",
    brandColors: {
      primary: "#1E3A8A", // Indigo Blue
      secondary: "#081F2D",
      accent: "#3B82F6",
      surface: "#EFF6FF",
      border: "#BFDBFE",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "KEY_INITIATIVE",
    whyItExistsEn: "Millions of Bangladeshi youth and cross-border migrant workers fall victim to predatory intermediaries, forged credential exploitation, exorbitant recruitment debt, and dangerous workplace contracts. SkillConnect restores dignity and transparency through verified skill passports and direct employer connections.",
    whyItExistsBn: "লাখো তরুণ ও প্রবাসী কর্মী দালাল চক্রের শোষণ, ভুয়া চাকরির প্রস্তাব ও মাত্রাতিরিক্ত অভিবাসন ব্যয়ের শিকার হন। স্কিলকানেক্ট যাচাইকৃত ডিজিটাল স্কিল পাসপোর্ট এবং স্বচ্ছ নিয়োগ প্রক্রিয়ার মাধ্যমে কর্মীর মর্যাদা রক্ষা করে।",
    theOpportunityEn: "By validating practical vocational competencies (welding, electrical, hospitality, caregiving, ICT) and providing safe legal pre-departure orientation, SkillConnect transforms workers from vulnerable jobseekers into empowered economic actors.",
    theOpportunityBn: "প্র্যাকটিক্যাল কারিগরি দক্ষতা (ওয়েল্ডিং, ইলেকট্রিক্যাল, কেয়ারগিভিং, আইসিটি) প্রমাণীকরণ এবং বহির্গমন পূর্ব আইনি নির্দেশনার মাধ্যমে কর্মীদের আত্মবিশ্বাসী ও ক্ষমতায়িত করে তোলা।",
    whatItDoesEn: "Provides standardized worker profiles, cryptographic skill credential wallets, wage transparent matching, and migrant rights orientation modules.",
    whatItDoesBn: "মানসম্মত কর্মী প্রোফাইল, ক্রিপ্টোগ্রাফিক সনদ ওয়ালেট, স্বচ্ছ মজুরি সংযোগ এবং প্রবাসী অধিকার সচেতনতা মডিউল সরবরাহ করে।",
    howItWorksEn: [
      "Worker profile creation with biometrically verified National ID or Passport.",
      "Skill competency assessment by certified vocational partners.",
      "Cryptographic credential issuance to the worker's digital credential wallet.",
      "Direct ethical matching with vetted domestic and international employers.",
      "Pre-departure legal briefing and ongoing consular hotline integration."
    ],
    howItWorksBn: [
      "এনআইডি বা পাসপোর্ট ভিত্তিক কর্মী প্রোফাইল তৈরি।",
      "স্বীকৃত কারিগরি প্রতিষ্ঠান কর্তৃক ব্যবহারিক দক্ষতা যাচাই।",
      "ডিজিটাল স্কিল ওয়ালেটে সুরক্ষিত সনদ প্রদান।",
      "যাচাইকৃত দেশি-বিদেশি নিয়োগকর্তাদের সাথে মধ্যস্বত্বভোগীহীন সরাসরি সংযোগ।",
      "আইনি অধিকার ব্রিফিং ও প্রবাসী সহায়তা হেল্পলাইন সংযোগ।"
    ],
    whoItServesEn: [
      "Vocational & technical graduates seeking dignified employment",
      "Migrant workers preparing for overseas employment in Southeast Asia & Gulf",
      "Ethical employers and contractors seeking verified, qualified talent",
      "Skills training institutes issuing digital credentials"
    ],
    whoItServesBn: [
      "কারিগরি ও ভোকেশনাল প্রশিক্ষণপ্রাপ্ত তরুণ",
      "মালয়েশিয়া ও মধ্যপ্রাচ্যে গমনেচ্ছু অভিবাসী কর্মী",
      "দক্ষ ও নির্ভরযোগ্য কর্মী সন্ধানকারী ন্যায্য নিয়োগকর্তা",
      "ডিজিটাল সনদ প্রদানে আগ্রহী কারিগরি প্রশিক্ষণ প্রতিষ্ঠান"
    ],
    ecosystemRoleEn: "Operational engine for STFL Digital Inclusion, Youth Skills, and Migrant Worker Dignity pillars.",
    ecosystemRoleBn: "এসটিএফএল ডিজিটাল অন্তর্ভুক্তি, যুব দক্ষতা ও অভিবাসী কর্মী সহায়তা স্তম্ভের বাস্তবায়ন ইঞ্জিন।",
    whatIsBeingBuiltEn: [
      "Worker digital credential passport supporting offline verification",
      "Bilingual employer onboarding and job requisition portal",
      "Fair recruitment fee tracker and anti-fraud reporting channel"
    ],
    whatIsBeingBuiltBn: [
      "অফলাইন যাচাইকরণ সুবিধাযুক্ত ডিজিটাল স্কিল পাসপোর্ট",
      "দ্বিভাষিক নিয়োগকর্তা অনবোর্ডিং পোর্টাল",
      "ন্যায্য অভিবাসন ফি ট্র্যাকার ও প্রতারণা প্রতিরোধ রিপোর্ট ব্যবস্থা"
    ],
    impactOutcomesEn: [
      "Zero recruitment debt through direct verified linkages",
      "100% credential verification eliminating fraudulent certificate risks",
      "Legal awareness training reaching migrant families before departure"
    ],
    impactOutcomesBn: [
      "মধ্যস্বত্বভোগী নির্মূলের মাধ্যমে অভিবাসন ব্যয় হ্রাস",
      "শতভাগ যাচাইকৃত সনদপত্রের নিশ্চয়তা",
      "বিদেশে যাত্রার পূর্বে বাধ্যতামূলক অধিকার ও আইনি সচেতনতা"
    ],
    legalStatusEn: "STFL non-profit workforce initiative. Works exclusively with licensed vocational institutes and authorized international recruitment frameworks.",
    legalStatusBn: "এসটিএফএল-এর অলাভজনক কর্মসংস্থান ও দক্ষতা উদ্যোগ। অনুমোদিত কারিগরি সংস্থা ও আইনি কাঠামোর অধীনে পরিচালিত।",
    partnershipsEn: "Collaborates with regional vocational centers and bilateral labor policy researchers.",
    partnershipsBn: "স্থানীয় টেকনিক্যাল ট্রেনিং সেন্টার ও দ্বিপাক্ষিক শ্রম অধিকার গবেষকদের সাথে যৌথভাবে সমন্বিত।",
    metrics: [
      { value: "100%", labelEn: "Verified Credentials", labelBn: "যাচাইকৃত সনদ" },
      { value: "0 Fee", labelEn: "Worker Registration", labelBn: "বিনামূল্যে কর্মী নিবন্ধন" },
      { value: "Bilingual", labelEn: "BN / EN Native Interface", labelBn: "সম্পূর্ণ দ্বিভাষিক ব্যবস্থা" },
      { value: "Ethical", labelEn: "Recruitment Standard", labelBn: "ন্যায্য নিয়োগ মানদণ্ড" }
    ],
    keyFeatures: [
      {
        titleEn: "Digital Skill Passport",
        titleBn: "ডিজিটাল স্কিল পাসপোর্ট",
        descEn: "Tamper-proof verifiable credentials that travel with the worker wherever they go.",
        descBn: "প্রতারণামুক্ত ও সহজে যাচাইযোগ্য ডিজিটাল কর্মী সনদপত্র।"
      },
      {
        titleEn: "Ethical Employer Matching",
        titleBn: "ন্যায্য নিয়োগ সংযোগ",
        descEn: "Direct connection with vetted employers who adhere to fair wage and safe housing standards.",
        descBn: "ন্যায্য মজুরি ও নিরাপদ কর্মপরিবেশ নিশ্চিতকারী যাচাইকৃত প্রতিষ্ঠানের সাথে সরাসরি সংযোগ।"
      },
      {
        titleEn: "Pre-Departure Legal Shield",
        titleBn: "বহির্গমন পূর্ব আইনি সুরক্ষা",
        descEn: "Standardized contract translation and emergency contact networks in destination countries.",
        descBn: "কাজের চুক্তির সহজ বাংলা অনুবাদ এবং গন্তব্য দেশের জরুরি সুরক্ষা নেটওয়ার্ক।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Digital Inclusion & Skills", nameBn: "ডিজিটাল সক্ষমতা ও দক্ষতা", path: "/programs/digital-inclusion" },
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" }
    ],
    sourceDocuments: [
      "STFL_AIO_MULTI_PROJECT_ARCHITECTURE.md",
      "official_doc/templates/skillconnect_spec.md"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0003",
    slug: "aev-developments",
    name: "AEV Developments",
    displayNameEn: "AEV Developments — Real Estate & Social Infrastructure",
    displayNameBn: "এইভি ডেভেলপমেন্টস — আবাসন, অবকাঠামো ও উন্নয়ন",
    taglineEn: "Sustainable Real Estate, Resilient Community Infrastructure & Social Housing",
    taglineBn: "টেকসই আবাসন, জলবায়ু-সহনশীল কমিউনিটি অবকাঠামো ও সামাজিক গৃহায়ন",
    shortDescriptionEn: "Physical development venture creating ecological community facilities, rural healthcare structures, and resilient affordable housing.",
    shortDescriptionBn: "টেকসই ভৌত অবকাঠামো, কমিউনিটি সুবিধা, পল্লী স্বাস্থ্যকেন্দ্র ও পরিবেশ-বান্ধব সাশ্রয়ী আবাসন উন্নয়ন উদ্যোগ।",
    category: "PROPERTY_AND_RURAL_ECONOMY",
    categoryNumber: "03",
    categoryNameEn: "Property & Rural Economy",
    categoryNameBn: "সম্পত্তি ও গ্রামীণ অর্থনীতি",
    type: "VENTURE",
    status: "ACTIVE_DEVELOPMENT",
    statusLabelEn: "Active Infrastructure Planning",
    statusLabelBn: "পরিকল্পনা ও উন্নয়ন পর্যায়",
    ownership: "STFL_PARTNERSHIP",
    relationship: "STFL_PORTFOLIO_PROJECT",
    relationshipLabelEn: "An STFL Portfolio Venture",
    relationshipLabelBn: "এসটিএফএল পোর্টফোলিও ভেঞ্চার",
    legalEntity: "AEV Developments Ltd.",
    country: "Bangladesh",
    market: "Bangladesh (Urban & Semi-Urban Growth Centers)",
    domain: "aev.stflbd.app",
    canonicalPath: "/initiatives/aev-developments",
    logoSource: "/media/aev-logo.svg",
    brandColors: {
      primary: "#78350F", // Amber / Structural Bronze
      secondary: "#081F2D",
      accent: "#D97706",
      surface: "#FFFBEB",
      border: "#FDE68A",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "PORTFOLIO_VENTURE",
    whyItExistsEn: "Rapid unplanned urbanization in Bangladesh leads to fragile structures, lack of civic sanitation, and environmental degradation in peri-urban and rural centers. AEV Developments develops engineered, climate-conscious physical environments with long-term community utility.",
    whyItExistsBn: "অপরিকল্পিত নগরায়নের ফলে ঝুঁকিপূর্ণ ভবন এবং স্বাস্থ্যসম্মত সুযোগ-সুবিধার ঘাটতি তৈরি হয়। এইভি ডেভেলপমেন্টস স্থায়িত্বশীল প্রকৌশল, পরিবেশবান্ধব উপাদান ও দীর্ঘমেয়াদী সামাজিক উপযোগিতা সমৃদ্ধ অবকাঠামো নির্মাণ করে।",
    theOpportunityEn: "Bridging the gap between commercial real estate discipline and social impact infrastructure: multi-purpose rural centers, vocational campuses, and dignified low-cost housing.",
    theOpportunityBn: "বাণিজ্যিক রিয়েল এস্টেটের পেশাদারিত্ব ও সামাজিক প্রভাবের সমন্বয়ে বহুমুখী কমিউনিটি কেন্দ্র, কারিগরি ক্যাম্পাস এবং সাশ্রয়ী টেকসই আবাসন নির্মাণ।",
    whatItDoesEn: "Undertakes structural planning, sustainable materials procurement, architectural design, and project execution for resilient community and commercial properties.",
    whatItDoesBn: "টেকসই নির্মাণ পরিকল্পনা, পরিবেশবান্ধব নির্মাণসামগ্রী নির্বাচন, স্থাপত্য নকশা এবং সামাজিক ও বাণিজ্যিক স্থাপনা বাস্তবায়ন করে।",
    howItWorksEn: [
      "Site and environmental risk analysis (flood levels, soil stability, drainage).",
      "Architectural planning prioritizing natural ventilation, solar energy, and rainwater harvesting.",
      "Community stakeholder review for shared social facilities.",
      "Governed structural development under strict safety and building codes."
    ],
    howItWorksBn: [
      "পরিবেশগত ও ভৌগোলিক ঝুঁকি বিশ্লেষণ (বন্যা মাত্রা, মাটির স্থায়িত্ব ও নিষ্কাশন)।",
      "প্রাকৃতিক আলো-বাতাস, সৌরশক্তি ও বৃষ্টির পানি সংরক্ষণ বান্ধব স্থাপত্য নকশা।",
      "স্থানীয় জনসাধারণের সুবিধার্থে কমিউনিটি স্পেস সমন্বয়।",
      "কঠোর নিরাপত্তা ও ভবন কোড মেনে নির্মাণ কাজ সম্পন্ন।"
    ],
    whoItServesEn: [
      "Rural communities requiring flood-resilient community centers",
      "Educational and medical foundations needing purpose-built campuses",
      "Municipalities and peri-urban families seeking affordable engineered housing"
    ],
    whoItServesBn: [
      "বন্যা-সহনশীল কমিউনিটি সেন্টারের প্রয়োজনীয় গ্রামীণ জনগণ",
      "ক্যাম্পাস ও চিকিৎসাকেন্দ্র নির্মাণে আগ্রহী দাতব্য ও সামাজিক সংস্থা",
      "সাশ্রয়ী ও নিরাপদ আবাসনের প্রত্যাশী পরিবার"
    ],
    ecosystemRoleEn: "Infrastructure and physical development partner within the STFL ecosystem, working in synergy with GrihostiOS operational systems.",
    ecosystemRoleBn: "এসটিএফএল ইকোসিস্টেমের ভৌত অবকাঠামো অংশীদার, যা গৃহস্থী ওএস-এর অপারেশনাল কাঠামোর সাথে যুক্ত হয়ে কাজ করে।",
    whatIsBeingBuiltEn: [
      "Prototype STFL Rural Digital & Healthcare Hub structures",
      "Pre-engineered low-cost modular housing blueprints"
    ],
    whatIsBeingBuiltBn: [
      "এসটিএফএল গ্রামীণ ডিজিটাল ও স্বাস্থ্য হাবের মডেল কাঠামো",
      "সাশ্রয়ী মডুলার আবাসন নকশা ও প্রকৌশল রূপরেখা"
    ],
    impactOutcomesEn: [
      "Climate-resilient structures built to withstand monsoon flooding",
      "Shared civic spaces integrating education, healthcare, and digital access"
    ],
    impactOutcomesBn: [
      "মৌসুমী বন্যা ও দুর্যোগ সহনশীল টেকসই অবকাঠামো",
      "একই ভবনে শিক্ষা, স্বাস্থ্য ও প্রযুক্তির সমন্বিত সামাজিক সেবা"
    ],
    legalStatusEn: "Incorporated development venture. Complies with Rajuk and National Building Code regulations.",
    legalStatusBn: "নিবন্ধিত উন্নয়ন প্রতিষ্ঠান। জাতীয় ইমারত নির্মাণ বিধিমালা ও স্থানীয় অনুমোদন সাপেক্ষে পরিচালিত।",
    partnershipsEn: "Architectural and structural engineering consortia across Bangladesh.",
    partnershipsBn: "বাংলাদেশি স্থাপত্য ও সিভিল ইঞ্জিনিয়ারিং বিশেষজ্ঞদের সমন্বয়ে পরিচালিত।",
    metrics: [
      { value: "Eco-Grade", labelEn: "Building Standards", labelBn: "পরিবেশবান্ধব মান" },
      { value: "Synergistic", labelEn: "GrihostiOS Integration", labelBn: "গৃহস্থী ওএস সমন্বয়" },
      { value: "100%", labelEn: "Safety Code Adherence", labelBn: "বিল্ডিং কোড সম্মতি" }
    ],
    keyFeatures: [
      {
        titleEn: "Social Infrastructure Engineering",
        titleBn: "সামাজিক অবকাঠামো প্রকৌশল",
        descEn: "Designed specifically for multi-use community benefit and climate adaptation.",
        descBn: "কমিউনিটি বহুমুখী ব্যবহার ও জলবায়ু পরিবর্তনের সাথে খাপ খাইয়ে চলার উপযোগী নকশা।"
      },
      {
        titleEn: "Integrated Land & Property Model",
        titleBn: "সমন্বিত জমি ও স্থাপনা মডেল",
        descEn: "Direct operational integration with GrihostiOS for seamless post-construction occupancy management.",
        descBn: "নির্মাণ পরবর্তী সুষ্ঠু পরিচালনার জন্য গৃহস্থী ওএস-এর সাথে সরাসরি ডেটা সমন্বয়।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" },
      { nameEn: "Healthcare", nameBn: "স্বাস্থ্যসেবা", path: "/programs/health" }
    ],
    sourceDocuments: [
      "AEV Developments Architecture Specification",
      "STFL_PROJECT_REGISTRY.json"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0004",
    slug: "maxremit",
    name: "MaxRemit",
    displayNameEn: "MaxRemit — Cross-Border Remittance & Financial Opportunity",
    displayNameBn: "ম্যাক্সরেমিট — রেমিট্যান্স ও ক্রস-বর্ডার ফাইন্যান্সিয়াল প্ল্যাটফর্ম",
    taglineEn: "Transparent Cross-Border Rails, Fair FX Corridors & Migrant Worker Economic Mobility",
    taglineBn: "স্বচ্ছ ক্রস-বর্ডার পেমেন্ট চ্যানেল, ন্যায্য মুদ্রা বিনিময় ও রেমিট্যান্স যোদ্ধাদের সুরক্ষা",
    shortDescriptionEn: "Cross-border payment and remittance platform focused on reducing extortionate transfer fees and protecting migrant worker earnings.",
    shortDescriptionBn: "প্রবাসীদের কষ্টার্জিত অর্থ নিরাপদে দেশে পাঠানো, মাত্রাতিরিক্ত ফি কমানো এবং ন্যায্য মুদ্রা বিনিময় নিশ্চিত করার রেমিট্যান্স প্ল্যাটফর্ম।",
    category: "FINANCE_AND_ACCESS",
    categoryNumber: "06",
    categoryNameEn: "Finance & Access",
    categoryNameBn: "অর্থায়ন ও অন্তর্ভুক্তি",
    type: "PLATFORM",
    status: "PROTOTYPE",
    statusLabelEn: "Architecture & Corridors Prototype",
    statusLabelBn: "প্রোটোটাইপ ও আইনি প্রস্তুতি পর্যায়",
    ownership: "STFL_PARTNERSHIP",
    relationship: "STFL_PORTFOLIO_PROJECT",
    relationshipLabelEn: "An STFL Strategic Platform",
    relationshipLabelBn: "এসটিএফএল কৌশলগত আর্থিক উদ্যোগ",
    legalEntity: "MaxRemit Global Pte. / STFL Partner Consortium",
    country: "Bangladesh & Malaysia",
    market: "Southeast Asia to South Asia Remittance Corridors",
    domain: "maxremit.stflbd.app",
    canonicalPath: "/initiatives/maxremit",
    logoSource: "/media/maxremit-logo.svg",
    brandColors: {
      primary: "#065F46", // Emerald / Monetary Trust
      secondary: "#081F2D",
      accent: "#059669",
      surface: "#ECFDF5",
      border: "#A7F3D0",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "PORTFOLIO_VENTURE",
    whyItExistsEn: "Millions of South Asian migrant workers pay 6% to 12% in hidden currency conversion markups and predatory fees to send money home to their families, while informal Hundi/Hawala networks expose them to severe legal and financial risks. MaxRemit advocates for transparent, regulated, low-cost financial corridors.",
    whyItExistsBn: "প্রবাসীদের কষ্টে উপার্জিত রেমিট্যান্সের উপর ৬% থেকে ১২% পর্যন্ত গোপন ফি ও অন্যায্য এক্সচেঞ্জ রেট আদায় করা হয়। অনানুষ্ঠানিক হুন্ডি চ্যানেলের ঝুঁকি থেকে প্রবাসীদের রক্ষা করতে ম্যাক্সরেমিট স্বচ্ছ, নিয়ন্ত্রিত ও সাশ্রয়ী চ্যানেলের রূপরেখা তৈরি করছে।",
    theOpportunityEn: "Providing seamless digital corridors linking Malaysian and Gulf wage payments directly to verified bank accounts and MFS wallets in Bangladesh, paired with financial literacy and savings tools.",
    theOpportunityBn: "মালয়েশিয়া ও উপসাগরীয় দেশ থেকে সরাসরি বাংলাদেশের ব্যাংক অ্যাকাউন্ট ও বিকাশ/নগদে সাশ্রয়ী খরচে টাকা প্রেরণের চ্যানেল এবং সঞ্চয় সহায়তা।",
    whatItDoesEn: "Designs transparent FX comparison engines, compliant KYC validation pipelines, and direct settlement architectures under central bank regulatory sandboxes.",
    whatItDoesBn: "স্বচ্ছ মুদ্রা বিনিময় হার তুলনা, স্বয়ংক্রিয় কেওয়াইসি নিরীক্ষা এবং কেন্দ্রীয় ব্যাংকের নিয়ন্ত্রক স্যান্ডবক্সের অধীনে সেটেলমেন্ট আর্কিটেকচার তৈরি করে।",
    howItWorksEn: [
      "Migrant worker registers identity using passport and valid employment visa.",
      "Instant transparent quote displaying mid-market exchange rate with zero hidden spreads.",
      "Secure localized payment via authorized banking rails.",
      "Beneficiary receives instant credit to bank account or mobile wallet in Bangladesh."
    ],
    howItWorksBn: [
      "পাসপোর্ট ও বৈধ ওয়ার্ক পারমিটের মাধ্যমে নিরাপদ নিবন্ধন।",
      "কোনো গোপন চার্জ ছাড়া সরাসরি স্বচ্ছ রিয়েল-টাইম এক্সচেঞ্জ রেট প্রদর্শন।",
      "অনুমোদিত ব্যাংকিং চ্যানেলে দ্রুত পেমেন্ট সম্পন্ন।",
      "বাংলাদেশে পরিবারের ব্যাংক হিসাব বা এমএফএস ওয়ালেটে তাৎক্ষণিক অর্থ জমা।"
    ],
    whoItServesEn: [
      "Overseas Bangladeshi and regional workers in Malaysia, Singapore, and Middle East",
      "Remittance-receiving families in rural Bangladesh",
      "SMEs engaged in authorized bilateral cross-border trade"
    ],
    whoItServesBn: [
      "মালয়েশিয়া, সিঙ্গাপুর ও মধ্যপ্রাচ্যে কর্মরত প্রবাসী বাংলাদেশি কর্মী",
      "বাংলাদেশের প্রত্যন্ত অঞ্চলে থাকা রেমিট্যান্স গ্রহণকারী পরিবার",
      "বৈধ দ্বিপাক্ষিক বাণিজ্যে নিয়োজিত ক্ষুদ্র ও মাঝারি প্রতিষ্ঠান"
    ],
    ecosystemRoleEn: "Financial mobility and migrant welfare vehicle connecting with SkillConnect's workforce ecosystem.",
    ecosystemRoleBn: "স্কিলকানেক্ট-এর কর্মী নেটওয়ার্কের সাথে সমন্বিত অর্থনৈতিক ও রেমিট্যান্স সুরক্ষা মাধ্যম।",
    whatIsBeingBuiltEn: [
      "Corridor simulation engine between MYR and BDT",
      "Regulatory sandbox compliance documentation for partner central banks"
    ],
    whatIsBeingBuiltBn: [
      "রিংগিত ও টাকার মধ্যকার রিয়েল-টাইম রেমিট্যান্স সিমুলেটর",
      "কেন্দ্রীয় ব্যাংকের অংশীদারিত্ব ও লাইসেন্সিং ফ্রেমওয়ার্ক প্রস্তুতি"
    ],
    impactOutcomesEn: [
      "Projected 50% reduction in average remittance fees for worker families",
      "Increased institutional foreign currency inflows through legal banking channels"
    ],
    impactOutcomesBn: [
      "প্রবাসী পরিবারের রেমিট্যান্স প্রেরণ ব্যয়ে ৫০% পর্যন্ত সাশ্রয়",
      "বৈধ ব্যাংকিং চ্যানেলে বৈদেশিক মুদ্রার প্রবাহ বৃদ্ধি"
    ],
    legalStatusEn: "LEGAL & REGULATORY REVIEW REQUIRED: MaxRemit is currently an architectural prototype and impact research initiative. Financial operations will be executed strictly in partnership with licensed Money Services Businesses and authorized banks under central bank regulations.",
    legalStatusBn: "আইনি ও নিয়ন্ত্রক পর্যালোচনাধীন: ম্যাক্সরেমিট বর্তমানে একটি গবেষণা ও কারিগরি প্রোটোটাইপ। সকল আর্থিক লেনদেন কেন্দ্রীয় ব্যাংক অনুমোদিত লাইসেন্সধারী ব্যাংক ও এমএসবি প্রতিষ্ঠানের মাধ্যমে পরিচালিত হবে।",
    partnershipsEn: "Exploring partnerships with authorized remittance banks in Dhaka and Kuala Lumpur.",
    partnershipsBn: "ঢাকা ও কুয়ালালামপুরের শীর্ষস্থানীয় অনুমোদিত ব্যাংকিং প্রতিষ্ঠানের সাথে প্রযুক্তিগত সমীক্ষা চলছে।",
    metrics: [
      { value: "0 Hidden", labelEn: "Spread Transparency", labelBn: "গোপন চার্জমুক্ত" },
      { value: "MYR → BDT", labelEn: "Primary Focus Corridor", labelBn: "প্রধান রেমিট্যান্স চ্যানেল" },
      { value: "Regulated", labelEn: "Bank Partnership Model", labelBn: "লাইসেন্সড ব্যাংকিং মডেল" }
    ],
    keyFeatures: [
      {
        titleEn: "Transparent FX Engine",
        titleBn: "স্বচ্ছ এক্সচেঞ্জ রেট ব্যবস্থা",
        descEn: "Live real-time mid-market rates without predatory spreads or unannounced deductions.",
        descBn: "প্রতারণামূলক চার্জহীন সরাসরি আন্তর্জাতিক বাজার দরের ভিত্তিতে বিনিময় হিসাব।"
      },
      {
        titleEn: "Direct Family Wallet Settlement",
        titleBn: "সরাসরি ওয়ালেট জমা",
        descEn: "Instant credit to rural bank branches and verified mobile financial services.",
        descBn: "গ্রামের ব্যাংকিং বুথ ও মোবাইল ওয়ালেটে সরাসরি জমা।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" },
      { nameEn: "Digital Inclusion & Skills", nameBn: "ডিজিটাল সক্ষমতা", path: "/programs/digital-inclusion" }
    ],
    sourceDocuments: [
      "FlexiRemit / MaxRemit Architecture Notes",
      "STFL_PROJECT_REGISTRY.json"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0005",
    slug: "helpex",
    name: "Helpex",
    displayNameEn: "Helpex — Collateral Finance & Asset Liquidity",
    displayNameBn: "হেল্পেক্স — জামানতি অর্থায়ন ও সম্পদ লিকুইডিটি",
    taglineEn: "Fair Collateral Valuation, Emergency Liquidity & Transparent Pawn Systems",
    taglineBn: "ন্যায্য জামানত মূল্যায়ন, জরুরি আর্থিক সহায়তা ও স্বচ্ছ জামানতি সেবা",
    shortDescriptionEn: "Ethical collateral finance and transparent pawn service model designed to protect vulnerable households from predatory loan sharks (Mohajons).",
    shortDescriptionBn: "মহাজনী সুদের শোষণ থেকে প্রান্তিক মানুষকে বাঁচাতে ন্যায্য মূল্যায়ন ও স্বচ্ছ জামানতি অর্থায়ন মডেল।",
    category: "FINANCE_AND_ACCESS",
    categoryNumber: "06",
    categoryNameEn: "Finance & Access",
    categoryNameBn: "অর্থায়ন ও অন্তর্ভুক্তি",
    type: "VENTURE",
    status: "CONCEPT",
    statusLabelEn: "Ethical Concept & Modeling",
    statusLabelBn: "ধারণা ও সামাজিক নীতি রূপরেখা",
    ownership: "STFL_SUPPORTED",
    relationship: "STFL_SUPPORTED_PROJECT",
    relationshipLabelEn: "An STFL-Supported Platform",
    relationshipLabelBn: "এসটিএফএল সমর্থিত অর্থনৈতিক মডেল",
    legalEntity: "Helpex Financial Solutions (Subject to Regulatory Licensing)",
    country: "Malaysia & Bangladesh",
    market: "Informal Asset Owners & Micro-Entrepreneurs",
    domain: "helpex.stflbd.app",
    canonicalPath: "/initiatives/helpex",
    logoSource: "/media/helpex-logo.svg",
    brandColors: {
      primary: "#854D0E", // Warm Gold / Collateral
      secondary: "#081F2D",
      accent: "#CA8A04",
      surface: "#FEFCE8",
      border: "#FEF08A",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "PORTFOLIO_VENTURE",
    whyItExistsEn: "When families face medical emergencies, crop failure, or sudden economic shocks, they often turn to predatory moneylenders who seize assets at a fraction of their value or charge compounding interest rates that trap generations in debt. Helpex pioneers transparent collateral valuation with fair redemption rights.",
    whyItExistsBn: "চিকিৎসার জরুরি খরচ বা আকস্মিক সংকটে প্রান্তিক মানুষ বাধ্য হয়ে চড়া সুদের মহাজনদের কাছে যায়, যার ফলে অল্প ঋণের জন্য ভিটেমাটি বা স্বর্ণালঙ্কার চিরতরে হারাতে হয়। হেল্পেক্স ন্যায্য মূল্যায়ন ও সম্পদ ফেরত পাওয়ার অধিকারযুক্ত মানবিক মডেল তৈরি করছে।",
    theOpportunityEn: "Transforming distress sales into dignified, regulated collateral agreements with fixed transparent fees, safekeeping vaults, and clear redemption periods.",
    theOpportunityBn: "জরুরি প্রয়োজনে কম মূল্যে সম্পদ বিক্রির বদলে নিরাপদ ভল্টে সংরক্ষণ এবং স্পষ্ট মেয়াদে সম্পদ ফেরতের আইনি সুরক্ষা।",
    whatItDoesEn: "Digital valuation framework for personal assets (gold, tools, machinery, agricultural implements) coupled with strict ethical redemption rules.",
    whatItDoesBn: "স্বর্ণালঙ্কার, কারিগরি যন্ত্রপাতি ও কৃষি উপকরণের ন্যায্য ডিজিটাল মূল্যায়ন এবং শোষণমুক্ত জামানত ব্যবস্থাপনা।",
    howItWorksEn: [
      "Physical asset inspection and objective weight/purity grading by certified appraisers.",
      "Transparent loan valuation based on verifiable market commodities.",
      "Cryptographic deposit receipt with secure vault tracking.",
      "Clear, non-predatory repayment terms with full redemption protection."
    ],
    howItWorksBn: [
      "স্বীকৃত মূল্যায়নকারী কর্তৃক সম্পদের নির্ভুল ওজন ও মান যাচাই।",
      "বর্তমান বাজার মূল্যের ওপর ভিত্তি করে স্বচ্ছ ঋণ মূল্যায়ন।",
      "নিরাপদ ভল্ট ট্র্যাকিং সম্বলিত ডিজিটাল জমার রসিদ।",
      "নির্দিষ্ট সময়ে সহজ কিস্তিতে সম্পদ ছাড়িয়ে নেওয়ার পূর্ণ সুযোগ।"
    ],
    whoItServesEn: [
      "Low-income households facing temporary acute medical emergencies",
      "Small artisans and tradespeople needing short-term working capital",
      "Micro-entrepreneurs without formal bank credit history"
    ],
    whoItServesBn: [
      "আকস্মিক স্বাস্থ্য বা পারিবারিক সংকটে পড়া নিম্ন আয়ের পরিবার",
      "চলতি মূলধনের প্রয়োজনে থাকা ছোট কারিগর ও দোকানদার",
      "ব্যাংকিং ক্রেডিট হিস্ট্রিবিহীন ক্ষুদ্র উদ্যোক্তা"
    ],
    ecosystemRoleEn: "Emergency financial resilience mechanism within STFL's social safety and economic protection portfolio.",
    ecosystemRoleBn: "এসটিএফএল-এর সামাজিক সুরক্ষা ও আকস্মিক আর্থিক অভিঘাত মোকাবিলার সহায়ক মাধ্যম।",
    whatIsBeingBuiltEn: [
      "Asset valuation matrix and vault custody tracking protocols",
      "Ethical pawnbroking regulatory compliance charter"
    ],
    whatIsBeingBuiltBn: [
      "স্বর্ণ ও ব্যবহারিক যন্ত্রপাতির স্বচ্ছ মূল্যায়ন ম্যাট্রিক্স",
      "নৈতিক জামানতি সেবার আইনি নির্দেশিকা"
    ],
    impactOutcomesEn: [
      "Elimination of predatory 120%+ compounding interest from informal moneylenders",
      "100% preservation of asset ownership rights with clear redemption timelines"
    ],
    impactOutcomesBn: [
      "মহাজনী চড়া সুদের দুষ্টচক্র থেকে মুক্তি",
      "সম্পদ বেদখল না হওয়ার শতভাগ আইনি নিশ্চয়তা"
    ],
    legalStatusEn: "LEGAL REVIEW REQUIRED: Helpex is a conceptual ethical finance architecture. No financial services or loans are offered prior to statutory licensing under applicable pawnbroking and money lending legislation.",
    legalStatusBn: "আইনি পর্যালোচনাধীন: হেল্পেক্স একটি মানবিক অর্থনৈতিক ধারণা। প্রযোজ্য আইন ও সরকারি লাইসেন্স অর্জন ব্যতিরেকে কোনো আর্থিক লেনদেন বা ঋণ কার্যক্রম পরিচালিত হবে না।",
    partnershipsEn: "Subject to ethical microfinance and pawnbroking regulatory licenses.",
    partnershipsBn: "নিয়ন্ত্রক কর্তৃপক্ষের অনুমোদন ও লাইসেন্সিং সাপেক্ষে বাস্তবায়নযোগ্য।",
    metrics: [
      { value: "Fair Mkt", labelEn: "Objective Valuation", labelBn: "ন্যায্য বাজার মূল্যায়ন" },
      { value: "0 Compound", labelEn: "Non-Predatory Terms", labelBn: "চক্রবৃদ্ধি সুদহীন" },
      { value: "Safe Vault", labelEn: "Custody Guarantee", labelBn: "নিরাপদ হেফাজত" }
    ],
    keyFeatures: [
      {
        titleEn: "Transparent Valuation Matrix",
        titleBn: "স্বচ্ছ মূল্যায়ন পদ্ধতি",
        descEn: "Standardized grading removing arbitrary appraiser markdowns.",
        descBn: "মনগড়া দাম কমিয়ে দেওয়ার প্রবণতা রোধে সুনির্দিষ্ট মানদণ্ড।"
      },
      {
        titleEn: "Guaranteed Redemption Period",
        titleBn: "নিশ্চিত সম্পদ ফেরত অধিকার",
        descEn: "Strict grace periods preventing premature forfeiture of family heirlooms.",
        descBn: "সম্পদ বাজেয়াপ্ত হওয়ার হাত থেকে সুরক্ষার জন্য নির্দিষ্ট সময়সীমা।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" }
    ],
    sourceDocuments: [
      "Helpex.my Domain & Concept Records",
      "STFL_PROJECT_REGISTRY.json"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0006",
    slug: "proiozon",
    name: "Proiozon",
    displayNameEn: "Proiozon — Bangladesh Digital Marketplace",
    displayNameBn: "প্রয়োজন — বাংলাদেশ ডিজিটাল মার্কেটপ্লেস ও প্ল্যাটফর্ম",
    taglineEn: "Bangla-First Digital Commerce, SME Enablement & Hyperlocal Essentials",
    taglineBn: "বাংলা-প্রথম ডিজিটাল বাণিজ্য, ক্ষুদ্র ব্যবসায়ী ক্ষমতায়ন ও নিত্যপ্রয়োজনীয় পণ্য সেবা",
    shortDescriptionEn: "Bangladesh-focused digital commerce ecosystem empowering local cottage industries, verified merchants, and consumers with Bangla-first workflows.",
    shortDescriptionBn: "দেশীয় ক্ষুদ্র কুটির শিল্প ও সৎ ব্যবসায়ীদের ক্ষমতায়ন এবং বাংলা ভাষায় সহজতম কেনাকাটার ডিজিটাল প্ল্যাটফর্ম।",
    category: "DIGITAL_AND_MARKETPLACE",
    categoryNumber: "05",
    categoryNameEn: "Digital & Marketplace",
    categoryNameBn: "ডিজিটাল ও মার্কেটপ্লেস",
    type: "DIGITAL_PLATFORM",
    status: "PILOT",
    statusLabelEn: "Commerce Pilot & Catalog Testing",
    statusLabelBn: "পণ্য ক্যাটালগ ও পাইলট পর্যায়",
    ownership: "STFL_CONTROLLED",
    relationship: "STFL_CONTROLLED_PROJECT",
    relationshipLabelEn: "An STFL Digital Platform",
    relationshipLabelBn: "এসটিএফএল ডিজিটাল প্ল্যাটফর্ম",
    legalEntity: "Proiozon Technologies Ltd. / SohaelTasneem Foundation",
    country: "Bangladesh",
    market: "Bangladesh (Dhaka, Chittagong & District Growth Centers)",
    domain: "proiozon.stflbd.app",
    canonicalPath: "/initiatives/proiozon",
    logoSource: "/media/proiozon-logo.png",
    brandColors: {
      primary: "#EA580C", // Vibrant Orange / Warm Mustard
      secondary: "#1A1A1A",
      accent: "#FF6B35",
      surface: "#FFF7ED",
      border: "#FED7AA",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "KEY_INITIATIVE",
    whyItExistsEn: "Conventional e-commerce in Bangladesh often alienates traditional merchants through complex English interfaces, predatory commission models, and counterfeit product listings. Proiozon offers a warm, Bangla-first, high-trust marketplace built on genuine local enterprise.",
    whyItExistsBn: "জটিল ইংরেজি ভাষা এবং মাত্রাতিরিক্ত কমিশনের কারণে দেশের অধিকাংশ সাধারণ ব্যবসায়ী ডিজিটাল বাণিজ্যের বাইরে থেকে যান। প্রয়োজন বাংলা-প্রথম সহজ ইন্টারফেস এবং ন্যায্য কমিশনের মাধ্যমে ক্ষুদ্র ও মাঝারি উদ্যোক্তাদের ডিজিটাল অর্থনীতিতে যুক্ত করে।",
    theOpportunityEn: "Connecting 7,000+ local lifestyle, grocery, and artisan product lines directly from district producers to urban consumers, powered by local payment rails and voice/AI-assisted ordering.",
    theOpportunityBn: "সাত হাজারেরও বেশি দেশীয় খাদ্য, হস্তশিল্প ও নিত্যপ্রয়োজনীয় পণ্য সরাসরি উৎপাদনকারী থেকে ক্রেতার কাছে পৌঁছে দেওয়া।",
    whatItDoesEn: "Provides full-featured inventory management, merchant onboarding in native Bangla, bKash/Nagad checkout, and consumer shopping interfaces.",
    whatItDoesBn: "সম্পূর্ণ বাংলায় ইনভেন্টরি পরিচালনা, বিকাশ/নগদে পেমেন্ট এবং সহজ অর্ডারিং সুবিধা প্রদান করে।",
    howItWorksEn: [
      "Local producer creates a verified store using their National ID and trade license.",
      "Products are cataloged with standardized photos, honest descriptions, and transparent pricing.",
      "Consumers order through clean, responsive web application or voice-assisted Harry companion.",
      "Reliable doorstep logistics with real-time SMS status updates and cash/MFS payment options."
    ],
    howItWorksBn: [
      "জাতীয় পরিচয়পত্র ও ট্রেড লাইসেন্সে নিরাপদ বিক্রেতা নিবন্ধন।",
      "সঠিক বিবরণ ও স্পষ্ট মূল্যে পণ্যের তালিকাভুক্তি।",
      "ওয়েব বা সহজে ভয়েস সহায়তায় পছন্দমতো পণ্য অর্ডার।",
      "দ্রুততম ডেলিভারি ও বিকাশ/ক্যাশ অন ডেলিভারিতে মূল্য পরিশোধ।"
    ],
    whoItServesEn: [
      "Cottage, micro, small, and medium enterprises (CMSMEs) across Bangladesh",
      "Traditional retail grocers, weavers, and agro-processors",
      "Consumers seeking verified authentic local products with fair pricing"
    ],
    whoItServesBn: [
      "দেশের প্রান্তিক ও মাঝারি কুটিরশিল্প উদ্যোক্তা",
      "ঐতিহ্যবাহী তাঁতি, মৃৎশিল্পী ও কৃষি খাদ্য প্রক্রিয়াজাতকারী",
      "ভেজালমুক্ত পণ্য ও ন্যায্য মূল্যে কেনাকাটায় আগ্রহী ক্রেতা"
    ],
    ecosystemRoleEn: "Primary digital commerce backbone connecting STFL artisan and rural producer livelihood initiatives.",
    ecosystemRoleBn: "এসটিএফএল গ্রামীণ উৎপাদনকারী ও কারিগরদের উৎপাদিত পণ্য সরাসরি বাজারে পৌঁছে দেওয়ার ডিজিটাল সেতু।",
    whatIsBeingBuiltEn: [
      "7,670+ item catalog indexing verified Bangladeshi consumer essentials",
      "Harry AI conversational shopping assistant for non-tech-savvy users",
      "Hyperlocal merchant delivery dispatch and settlement rails"
    ],
    whatIsBeingBuiltBn: [
      "৭,৬৭০টি পণ্যের যাচাইকৃত ক্যাটালগ ও ইনভেন্টরি সিস্টেম",
      "হ্যারি এআই সহায়ক—সহজ কথোপকথনে কেনাকাটার সুবিধা",
      "স্থানীয় কুরিয়ার ও সরাসরি মার্চেন্ট পেমেন্ট ব্যবস্থা"
    ],
    impactOutcomesEn: [
      "Fairer profit margins for rural producers compared to traditional wholesale middlemen",
      "Digital enablement for merchants who cannot read or navigate English software"
    ],
    impactOutcomesBn: [
      "মধ্যস্বত্বভোগীদের শোষণ কমিয়ে স্থানীয় উৎপাদকের ন্যায্য লাভ নিশ্চিতকরণ",
      "ইংরেজি না জানা ক্ষুদ্র ব্যবসায়ীদের জন্য ডিজিটাল বাণিজ্যের দুয়ার উন্মোচন"
    ],
    legalStatusEn: "Registered e-commerce initiative adhering to Bangladesh Digital Commerce Guidelines 2021 and Consumer Rights Protection Act.",
    legalStatusBn: "বাংলাদেশ ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ ও ভোক্তা অধিকার সংরক্ষণ আইনের পূর্ণ অনুগত।",
    partnershipsEn: "Integrated with local logistics carriers and certified indigenous product cooperatives.",
    partnershipsBn: "দেশীয় কুরিয়ার সেবা ও স্থানীয় সমবায় সমিতির সাথে সমন্বিত।",
    metrics: [
      { value: "7,670+", labelEn: "Cataloged Products", labelBn: "ক্যাটালগভুক্ত পণ্য" },
      { value: "Bangla 1st", labelEn: "Language Architecture", labelBn: "বাংলা-প্রথম ইন্টারফেস" },
      { value: "Zero Trap", labelEn: "Fair Merchant Commission", labelBn: "ন্যায্য মার্চেন্ট কমিশন" },
      { value: "bKash/Nagad", labelEn: "Direct Payment Rails", labelBn: "সহজ স্থানীয় পেমেন্ট" }
    ],
    keyFeatures: [
      {
        titleEn: "Bangla-First Navigation",
        titleBn: "বাংলা-প্রথম নেভিগেশন",
        descEn: "Engineered from the ground up in Hind Siliguri typography for clear readability.",
        descBn: "হিন্দ শিলিগুড়ি ফন্টে দৃষ্টিনন্দন ও স্বচ্ছ বাংলা ইন্টারফেস।"
      },
      {
        titleEn: "Harry Shopping Companion",
        titleBn: "হ্যারি শপিং সহকারী",
        descEn: "Intuitive guided assistant helping first-time digital shoppers find exact necessities.",
        descBn: "নতুন ব্যবহারকারীদের জন্য সহজে কাঙ্ক্ষিত পণ্য খুঁজে পাওয়ার সহায়ক।"
      },
      {
        titleEn: "Hyperlocal Producer Stores",
        titleBn: "স্থানীয় উৎপাদনকারী স্টোর",
        descEn: "Direct showcase for district-specific specialties (Tangail sarees, Dinajpur rice, Rajshahi silk).",
        descBn: "টাঙ্গাইলের শাড়ি, দিনাজপুরের চাল কিংবা রাজশাহীর সিল্কের মতো ঐতিহ্যবাহী পণ্যের সরাসরি প্রদর্শন।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" },
      { nameEn: "Digital Inclusion & Skills", nameBn: "ডিজিটাল সক্ষমতা", path: "/programs/digital-inclusion" }
    ],
    sourceDocuments: [
      "Desktop/icons/Bags/v1.4/proiyojon_catalog.json",
      "Desktop/icons/Bags/v1.4/THEME_CLEANUP_V1.3.md",
      "Desktop/icons/Bags/v1.4/hw_proi.png",
      "STFL_PROJECT_REGISTRY.json"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0007",
    slug: "perlu",
    name: "Perlu",
    displayNameEn: "Perlu — Malaysia Digital Marketplace & SME Platform",
    displayNameBn: "পেরলু — মালয়েশিয়া ডিজিটাল মার্কেটপ্লেস ও এসএমই প্ল্যাটফর্ম",
    taglineEn: "Empowering Malaysian Micro-SMEs, Local Merchants & Community Commerce",
    taglineBn: "মালয়েশিয়ার ক্ষুদ্র ও মাঝারি ব্যবসায়ী ক্ষমতায়ন এবং স্থানীয় কমিউনিটি বাণিজ্য",
    shortDescriptionEn: "Malaysia-focused localized commerce platform designed for small merchants, neighborhood food businesses, and regional artisans.",
    shortDescriptionBn: "মালয়েশিয়ার স্থানীয় ব্যবসা, ছোট রেস্তোরাঁ ও কমিউনিটি উদ্যোক্তাদের জন্য আধুনিক ডিজিটাল মার্কেটপ্লেস।",
    category: "DIGITAL_AND_MARKETPLACE",
    categoryNumber: "05",
    categoryNameEn: "Digital & Marketplace",
    categoryNameBn: "ডিজিটাল ও মার্কেটপ্লেস",
    type: "DIGITAL_PLATFORM",
    status: "ACTIVE_DEVELOPMENT",
    statusLabelEn: "Active Platform Development",
    statusLabelBn: "সক্রিয় প্ল্যাটফর্ম উন্নয়ন",
    ownership: "STFL_PARTNERSHIP",
    relationship: "STFL_PORTFOLIO_PROJECT",
    relationshipLabelEn: "An STFL Portfolio Venture",
    relationshipLabelBn: "এসটিএফএল পোর্টফোলিও ভেঞ্চার",
    legalEntity: "Perlu Malaysia Sdn. Bhd. (In Process) / Regional Partner",
    country: "Malaysia",
    market: "Malaysia (Klang Valley, Penang, Johor)",
    domain: "perlu.stflbd.app",
    canonicalPath: "/initiatives/perlu",
    logoSource: "/media/perlu-logo.svg",
    brandColors: {
      primary: "#0284C7", // Cyan / Maritime Blue
      secondary: "#081F2D",
      accent: "#0EA5E9",
      surface: "#F0F9FF",
      border: "#BAE6FD",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "PORTFOLIO_VENTURE",
    whyItExistsEn: "Independent Malaysian neighborhood shops, home bakers, and family warungs face steep marketplace fees (25%+) on multinational delivery platforms. Perlu provides a sustainable, low-take-rate alternative focused on neighborhood community loyalty.",
    whyItExistsBn: "মালয়েশিয়ার ছোট খাবার দোকান ও পারিবারিক ব্যবসাগুলো বহুজাতিক প্ল্যাটফর্মের অতিরিক্ত ফি-র চাপে ক্ষতিগ্রস্ত হয়। পেরলু সাশ্রয়ী কমিশন ও সহজ ব্যবস্থার মাধ্যমে কমিউনিটি ব্যবসার সুরক্ষা নিশ্চিত করে।",
    theOpportunityEn: "Enabling localized micro-merchants with zero-code online ordering, DuitNow QR integration, and peer-to-peer delivery options in Bahasa Malaysia and English.",
    theOpportunityBn: "ডুইটনাউ কিউআর পেমেন্ট ও সহজ অনলাইন অর্ডারের মাধ্যমে স্থানীয় ব্যবসায়ীদের ডিজিটাল সক্ষমতা বৃদ্ধি।",
    whatItDoesEn: "Delivers a lightweight digital storefront, customer WhatsApp ordering integration, and verified neighborhood delivery logistics.",
    whatItDoesBn: "সহজ ডিজিটাল স্টোরফ্রন্ট, হোয়াটসঅ্যাপ অর্ডার সমন্বয় এবং দ্রুত ডেলিভারি সুবিধা প্রদান করে।",
    howItWorksEn: [
      "Merchant creates menu or product catalog in minutes with automated pricing.",
      "Direct integration with DuitNow instant payment rails.",
      "Customer discovers local neighborhood products through location-aware directory.",
      "Fulfillment coordinated through local independent delivery partners."
    ],
    howItWorksBn: [
      "সহজেই পণ্যের তালিকা ও মূল্য নির্ধারণ করে মেনু তৈরি।",
      "ডুইটনাউ তাৎক্ষণিক পেমেন্ট সুবিধা।",
      "নিকটবর্তী গ্রাহকের কাছে পণ্যের নির্ভরযোগ্য পৌঁছানো।",
      "স্থানীয় ডেলিভারি সহযোগীদের মাধ্যমে দ্রুত পণ্য ডেলিভারি।"
    ],
    whoItServesEn: [
      "Malaysian home-based food businesses and cloud kitchens",
      "Traditional neighborhood sundry stores (Kedai Runcit)",
      "Independent artisans and boutique local creators in Peninsular Malaysia"
    ],
    whoItServesBn: [
      "মালয়েশিয়ার ঘরোয়া ক্যাটারিং ও হোম কিচেন উদ্যোক্তা",
      "স্থানীয় কেদাই রুঞ্চিত ও ক্ষুদ্র মুদি ব্যবসায়ী",
      "স্থানীয় কারিগর ও স্বাধীন সৃজনশীল উদ্যোক্তা"
    ],
    ecosystemRoleEn: "Cross-border market partner within the STFL portfolio, sharing technological infrastructure with Proiozon while maintaining distinct Malaysian localization.",
    ecosystemRoleBn: "এসটিএফএল পোর্টফোলিওর আন্তর্জাতিক বাজার অংশীদার, যা প্রয়োজনের সাথে প্রযুক্তি ভাগাভাগি করলেও সম্পূর্ণ নিজস্ব মালয়েশিয়ান ব্র্যান্ডে পরিচালিত।",
    whatIsBeingBuiltEn: [
      "DuitNow QR native payment checkout integration",
      "Bahasa Malaysia / English bilingual merchant dashboard",
      "Marketplace benchmark scanner based on live Malaysian market telemetry"
    ],
    whatIsBeingBuiltBn: [
      "ডুইটনাউ কিউআর পেমেন্ট সংযোগ",
      "বাহাসা মালয়েশিয়া ও ইংরেজি দ্বিভাষিক মার্চেন্ট ড্যাশবোর্ড",
      "মালয়েশিয়ার বাজার সমীক্ষার ওপর ভিত্তি করে নির্মিত মার্কেটপ্লেস আর্কিটেকচার"
    ],
    impactOutcomesEn: [
      "Over 60% reduction in platform commission burden for home-based cooks and micro-retailers",
      "Direct capital retention within local urban communities"
    ],
    impactOutcomesBn: [
      "প্ল্যাটফর্ম কমিশন হ্রাসের মাধ্যমে ক্ষুদ্র ব্যবসায়ীদের মুনাফা বৃদ্ধি",
      "স্থানীয় কমিউনিটির ভেতরেই আর্থিক লেনদেনের স্থায়িত্ব"
    ],
    legalStatusEn: "Subject to SSM registration and Bank Negara Malaysia payment guidelines. Operates under Malaysia Consumer Protection Act.",
    legalStatusBn: "মালয়েশিয়ার এসএসএম নিবন্ধন ও সেন্ট্রাল ব্যাংকের পেমেন্ট নীতিমালার আলোকে পরিচালিত।",
    partnershipsEn: "Benchmarked using Malaysian commercial data sets (MarketBench FM6 telemetry).",
    partnershipsBn: "মালয়েশিয়ান কমার্শিয়াল ডেটা সেটের সমন্বয়ে পরীক্ষিত।",
    metrics: [
      { value: "DuitNow", labelEn: "Instant Bank QR", labelBn: "তাৎক্ষণিক ব্যাংক কিউআর" },
      { value: "BM / EN", labelEn: "Market Localization", labelBn: "স্থানীয় ভাষা ব্যবস্থা" },
      { value: "Low Take", labelEn: "Commission Model", labelBn: "সাশ্রয়ী কমিশন" }
    ],
    keyFeatures: [
      {
        titleEn: "DuitNow QR Integration",
        titleBn: "ডুইটনাউ কিউআর সংযোগ",
        descEn: "Seamless mobile wallet and bank transfer payments native to the Malaysian ecosystem.",
        descBn: "মালয়েশিয়ার ব্যাংকিং ব্যবস্থার সাথে সরাসরি সংযুক্ত পেমেন্ট ব্যবস্থা।"
      },
      {
        titleEn: "Neighborhood Community Discovery",
        titleBn: "কমিউনিটি পণ্য অনুসন্ধান",
        descEn: "Connecting local residents with neighborhood home cooks and specialty stores within a 5km radius.",
        descBn: "নিকটবর্তী ৫ কিলোমিটারের মধ্যে গৃহিণীদের তৈরি খাবার ও প্রয়োজনীয় পণ্যের সন্ধান।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" },
      { nameEn: "Digital Inclusion & Skills", nameBn: "ডিজিটাল সক্ষমতা", path: "/programs/digital-inclusion" }
    ],
    sourceDocuments: [
      "Desktop/FM6/MarketBench/malaysia_locked_scan_live.json",
      "Perlu Project Specification & Logo Assets",
      "STFL_PROJECT_REGISTRY.json"
    ],
    lastVerified: "2026-10-16"
  },
  {
    projectId: "STFL-PRJ-2026-0008",
    slug: "oiix",
    name: "OIIX",
    displayNameEn: "OIIX — Social, Creator & Video Connection",
    displayNameBn: "ওইক্স — সোশ্যাল, ক্রিয়েটর ও ভিডিও মাধ্যম",
    taglineEn: "Dignified Community Spaces, Low-Latency Video & Regional Creative Expression",
    taglineBn: "মর্যাদাপূর্ণ সামাজিক সংযোগ, দ্রুততম ভিডিও স্ট্রিমিং ও আঞ্চলিক সৃজনশীল প্রকাশ",
    shortDescriptionEn: "Social connection and video engagement platform designed for positive community storytelling, cultural documentation, and youth creativity.",
    shortDescriptionBn: "ইতিবাচক সামাজিক সংযোগ, সাংস্কৃতিক ঐতিহ্য সংরক্ষণ ও তরুণদের সৃজনশীলতার ভিডিও প্ল্যাটফর্ম।",
    category: "COMMUNITY_AND_CULTURE",
    categoryNumber: "07",
    categoryNameEn: "Community & Culture",
    categoryNameBn: "কমিউনিটি ও সংস্কৃতি",
    type: "PLATFORM",
    status: "PROTOTYPE",
    statusLabelEn: "Interactive Prototype",
    statusLabelBn: "ইন্টারেক্টিভ প্রোটোটাইপ",
    ownership: "STFL_CONTROLLED",
    relationship: "STFL_INITIATIVE",
    relationshipLabelEn: "An STFL Digital Initiative",
    relationshipLabelBn: "এসটিএফএল ডিজিটাল উদ্যোগ",
    legalEntity: "SohaelTasneem Foundation",
    country: "Bangladesh",
    market: "South Asian & Diaspora Youth Creators",
    domain: "oiix.stflbd.app",
    canonicalPath: "/initiatives/oiix",
    logoSource: "/media/oiix-logo.svg",
    brandColors: {
      primary: "#7C3AED", // Violet / Vibrant Creative
      secondary: "#081F2D",
      accent: "#8B5CF6",
      surface: "#F5F3FF",
      border: "#DDD6FE",
    },
    publicVisibility: "PUBLICATION_APPROVED",
    ecosystemPosition: "KEY_INITIATIVE",
    whyItExistsEn: "Mainstream algorithmic social networks incentivize sensationalism, rage, and superficial content, marginalizing authentic rural voices, educational dispatches, and grassroots culture. OIIX builds community spaces prioritizing constructive human connection and creative empowerment.",
    whyItExistsBn: "জনপ্রিয় সোশ্যাল মিডিয়াগুলো প্রায়শই বিভেদ ও উসকানিমূলক বিষয়বস্তুকে প্রাধান্য দেয়, যার ফলে প্রান্তিক কণ্ঠস্বর ও শিক্ষণীয় উদ্যোগগুলো আড়ালে চলে যায়। ওইক্স ইতিবাচক সামাজিক সংযোগ ও সুস্থ সাংস্কৃতিক চর্চার বিকল্প মাধ্যম।",
    theOpportunityEn: "Providing low-bandwidth, high-fidelity WebRTC video feeds and community storytelling channels that work reliably even on modest mobile networks across rural Bangladesh.",
    theOpportunityBn: "ধীরগতির মোবাইল ইন্টারনেটেও পরিষ্কার ভিডিও স্ট্রিমিং এবং তরুণদের জন্য শিক্ষণীয় ও তথ্যভিত্তিক কন্টেন্ট তৈরির উন্মুক্ত প্ল্যাটফর্ম।",
    whatItDoesEn: "Enables real-time peer video interaction, verified community creator channels, and regional linguistic cultural archiving.",
    whatItDoesBn: "রিয়েল-টাইম ভিডিও ইন্টারেকশন, যাচাইকৃত ক্রিয়েটর চ্যানেল এবং আঞ্চলিক ভাষা ও সংস্কৃতির ডিজিটাল সংরক্ষণ করে।",
    howItWorksEn: [
      "Creator establishes verified profile with content safety pledges.",
      "Optimized WebRTC media pipelines deliver fluid video across variable network conditions.",
      "Positive engagement mechanics discourage abusive behavior.",
      "Integration with STFL Educational and Community knowledge streams."
    ],
    howItWorksBn: [
      "মর্যাদাপূর্ণ ও ইতিবাচক কন্টেন্ট তৈরির অঙ্গীকারে প্রোফাইল নিবন্ধন।",
      "স্বল্প ব্যান্ডউইথ বান্ধব ওয়েবআরটিসি ভিডিও স্ট্রিমিং।",
      "গঠনমূলক আলোচনা ও হয়রানিমুক্ত পরিবেশ নিশ্চিতকরণ।",
      "এসটিএফএল শিক্ষা ও সামাজিক জ্ঞানের সাথে সরাসরি যুক্ত হওয়া।"
    ],
    whoItServesEn: [
      "Grassroots storytellers, rural teachers, and community documentarians",
      "Youth creators seeking non-toxic creative expression platforms",
      "Diaspora families seeking intimate, high-quality audio-video connection"
    ],
    whoItServesBn: [
      "মাঠপর্যায়ের গল্পকার, শিক্ষক ও কমিউনিটি সংগঠক",
      "সাইবার বুলিংমুক্ত সুস্থ প্ল্যাটফর্ম সন্ধানকারী তরুণ ক্রিয়েটর",
      "প্রবাসী পরিবার যারা পরিচ্ছন্ন যোগাযোগ মাধ্যম পছন্দ করেন"
    ],
    ecosystemRoleEn: "Cultural expression, youth digital engagement, and public-interest community media channel within STFL.",
    ecosystemRoleBn: "এসটিএফএল-এর সাংস্কৃতিক প্রকাশ, যুব সম্পৃক্ততা ও গণমাধ্যম উদ্যোগের সহায়ক প্ল্যাটফর্ম।",
    whatIsBeingBuiltEn: [
      "Low-bandwidth WebRTC video transmission engine",
      "Cultural storytelling channel format tailored for regional languages"
    ],
    whatIsBeingBuiltBn: [
      "স্বল্প ব্যান্ডউইথে উচ্চমানের ভিডিও সঞ্চালন প্রযুক্তি",
      "আঞ্চলিক ভাষা ও ঐতিহ্যের ভিডিও ডকুমেন্টারি আর্কাইভ"
    ],
    impactOutcomesEn: [
      "Providing safe, harassment-free digital public spaces for youth and women",
      "Preserving indigenous and rural folklore, songs, and oral histories"
    ],
    impactOutcomesBn: [
      "নারী ও তরুণদের জন্য সাইবার হয়রানিমুক্ত নিরাপদ সামাজিক পরিবেশ",
      "গ্রামীণ লোকশিল্প, ঐতিহ্য ও মৌখিক ইতিহাসের আধুনিক সংরক্ষণ"
    ],
    legalStatusEn: "STFL public-interest digital media experiment. Complies with digital safety and youth protection mandates.",
    legalStatusBn: "এসটিএফএল-এর জনস্বার্থমুখী ডিজিটাল মিডিয়া প্ল্যাটফর্ম। ডিজিটাল সুরক্ষা ও শিশু সুরক্ষা নীতিমালার সাথে সম্পূর্ণ সামঞ্জস্যপূর্ণ।",
    partnershipsEn: "Collaborates with youth cultural groups and open-source WebRTC media developers.",
    partnershipsBn: "সাংস্কৃতিক কর্মী ও মুক্ত প্রযুক্তির গবেষকদের সাথে যৌথভাবে পরীক্ষিত।",
    metrics: [
      { value: "WebRTC", labelEn: "Low Latency Video", labelBn: "রিয়েল-টাইম ভিডিও" },
      { value: "Safe Space", labelEn: "Anti-Toxicity Guarantee", labelBn: "নিরাপদ পরিবেশ" },
      { value: "Low Bandwidth", labelEn: "Network Resilient", labelBn: "কম ইন্টারনেটেও সচল" }
    ],
    keyFeatures: [
      {
        titleEn: "Adaptive WebRTC Streaming",
        titleBn: "অ্যাডাপ্টিভ ভিডিও স্ট্রিমিং",
        descEn: "Smooth frame rates even on 3G and congested rural cellular towers.",
        descBn: "দুর্বল ইন্টারনেটেও কোনো রকম বাফারিং ছাড়া সাবলীল ভিডিও।"
      },
      {
        titleEn: "Constructive Community Moderation",
        titleBn: "মর্যাদাপূর্ণ সামাজিক পরিবেশ",
        descEn: "Designed explicitly without hate-optimizing rage algorithms.",
        descBn: "উসকানিমূলক অ্যালগরিদম মুক্ত সম্পূর্ণ পরিচ্ছন্ন সামাজিক নেটওয়ার্ক।"
      }
    ],
    relatedPrograms: [
      { nameEn: "Digital Inclusion & Skills", nameBn: "ডিজিটাল সক্ষমতা ও দক্ষতা", path: "/programs/digital-inclusion" },
      { nameEn: "Community Development", nameBn: "সামাজিক উন্নয়ন", path: "/programs/community-development" }
    ],
    sourceDocuments: [
      "OIIX.FUN Concept Specifications",
      "STFL_PROJECT_REGISTRY.json"
    ],
    lastVerified: "2026-10-16"
  }
];

export function getPublicInitiatives(): EcosystemProject[] {
  return PUBLICATION_APPROVED_INITIATIVES.filter(
    (p) => p.publicVisibility === "PUBLICATION_APPROVED"
  );
}

export function getInitiativeBySlug(slug: string): EcosystemProject | undefined {
  return PUBLICATION_APPROVED_INITIATIVES.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.publicVisibility === "PUBLICATION_APPROVED"
  );
}

export function getInitiativesByCategory(category: ProjectCategory): EcosystemProject[] {
  return PUBLICATION_APPROVED_INITIATIVES.filter(
    (p) => p.category === category && p.publicVisibility === "PUBLICATION_APPROVED"
  );
}
