"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useGovernedWorkspace } from "../context";
import {
  Building,
  Lock,
  NavArrowLeft,
  Check,
  WarningTriangle,
  Page,
  Tree,
  Coins,
  QrCode,
  ShieldCheck,
  Download,
  Eye,
  ArrowRight,
  MapPin,
  Calculator,
  Refresh,
  Calendar,
  User,
  Shop,
  HomeSimple,
  Group,
  Clock,
  Printer,
} from "iconoir-react";

// ============================================================================
// 1. DATA MODELS & RATIFIED BANGLADESH TEMPLATES (9 SEGMENTS)
// ============================================================================

type AgreementSegmentId =
  | "residential"
  | "commercial"
  | "sublease"
  | "land"
  | "agriculture"
  | "cropshare"
  | "semibuilt"
  | "landinfra"
  | "jointproject";

interface GovernedTemplateMeta {
  id: string;
  segmentId: AgreementSegmentId;
  nameEn: string;
  nameBn: string;
  version: string;
  jurisdiction: string;
  status: "APPROVED_TEMPLATE" | "LEGALLY_REVIEWED";
  statutoryLaw: string;
  stampDuty: string;
  registrationReq: string;
  applicableProperty: string;
  typicalParties: string;
  financialModel: string;
  descriptionEn: string;
  descriptionBn: string;
  covers: string[];
  requiredInputs: string[];
  governedRules: string[];
  reviewTriggers: string[];
}

const GOVERNED_TEMPLATES: Record<AgreementSegmentId, GovernedTemplateMeta> = {
  residential: {
    id: "BD-RES-LEASE-V1.0",
    segmentId: "residential",
    nameEn: "Residential Tenancy Agreement",
    nameBn: "আবাসিক ভাড়ার চুক্তিনামা",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Premises Rent Control Act 1991 / Transfer of Property Act 1882",
    stampDuty: "৳300 Non-Judicial Stamp",
    registrationReq: "Mandatory if tenure exceeds 3 years (Registration Act 1908)",
    applicableProperty: "Apartment, Flat, Independent House, Residential Room",
    typicalParties: "Lessor (Landlord) ↔ Lessee (Tenant)",
    financialModel: "Monthly Rent + Security Deposit + Utility Pass-through",
    descriptionEn:
      "Standard governed agreement for residential occupancy, rent, deposit, utilities, maintenance, notice, and termination.",
    descriptionBn:
      "আবাসিক ফ্ল্যাট বা কক্ষ ভাড়ার জন্য প্রমিত গভর্ন্ড চুক্তি — ভাড়া, জামানত, ইউটিলিটি, রক্ষণাবেক্ষণ, নোটিশ ও সমাপ্তিকরণ বিধিমালা সহ।",
    covers: ["Monthly Rent", "Security Deposit", "Utilities", "Maintenance", "Notice Period", "Renewal", "Termination"],
    requiredInputs: ["Tenant Name", "NID / Passport", "Phone", "Permanent Address", "Property Unit", "Tenure Dates", "Rent", "Deposit", "Payment Reference"],
    governedRules: ["Standard Governed Clauses", "Statutory Eviction Protection", "Template Immutability", "SHA-256 Hashing", "QR Verification"],
    reviewTriggers: ["Tenure ≥ 3 Years", "Deposit > 12 Months", "Subletting Requested", "Special Conditions"],
  },
  commercial: {
    id: "BD-COM-LEASE-V1.0",
    segmentId: "commercial",
    nameEn: "Commercial Tenancy Agreement",
    nameBn: "বাণিজ্যিক ভাড়ার চুক্তিনামা",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Contract Act 1872 / Premises Rent Control Act 1991",
    stampDuty: "৳500+ Stamp depending on aggregate consideration",
    registrationReq: "Mandatory if tenure exceeds 1 year",
    applicableProperty: "Retail Shop, Corporate Office, Showroom, Warehouse, Commercial Floor",
    typicalParties: "Lessor (Property Owner) ↔ Commercial Lessee (Enterprise)",
    financialModel: "Commercial Rent + Service Charge + VAT/Tax Responsibility + Advance",
    descriptionEn:
      "Governed commercial lease for shops, corporate offices, and warehouses with explicit signage, trade license, and utility covenants.",
    descriptionBn:
      "দোকান, অফিস ও গুদামের জন্য প্রমিত বাণিজ্যিক চুক্তি — অনুমোদিত বাণিজ্যিক ব্যবহার, ট্রেড লাইসেন্স কমপ্লায়েন্স ও সার্ভিস চার্জ সহ।",
    covers: ["Commercial Rent", "Advance & Security", "Trade License", "Signage Rights", "Service Charges", "Sub-metering", "Dispute Resolution"],
    requiredInputs: ["Business Name", "Trade License No.", "Authorized Signatory", "NID", "Unit Code", "Monthly Rent", "Escalation %", "Payment Method"],
    governedRules: ["Contract Act 1872 Compliance", "Commercial Eviction Rules", "Fixed Escalation Formula", "Audited Service Charges"],
    reviewTriggers: ["Tenure > 1 Year", "Electrical Load > 15 kW", "Heavy Fit-Out Scope", "Sublease Clause Modification"],
  },
  sublease: {
    id: "BD-SUBLEASE-V1.0",
    segmentId: "sublease",
    nameEn: "Governed Sublease Agreement",
    nameBn: "অনুমোদিত উপ-ইজারা চুক্তি",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Transfer of Property Act 1882 (Section 108)",
    stampDuty: "৳300 Non-Judicial Stamp",
    registrationReq: "Head Lessor Written NOC & Sub-Registrar if > 1 yr",
    applicableProperty: "Partitioned Commercial Unit, Shared Office Desk, Residential Room",
    typicalParties: "Head Lessee (Sublessor) ↔ Sublessee (with Head Lessor Consent)",
    financialModel: "Proportional Rent + Shared Utilities + Sublease Deposit",
    descriptionEn:
      "Conditional sub-tenancy agreement strictly subordinate to master lease tenure and head lessor written approval.",
    descriptionBn:
      "মূল ইজারা চুক্তির অধীন অনুমোদিত উপ-ইজারা চুক্তি — মূল মালিকের লিখিত অনুমতি ও মূল মেয়াদের অধীন সীমাবদ্ধ।",
    covers: ["Derivative Tenancy", "Master Lease Bound", "Demarcated Space", "Shared Facilities", "Automatic Reversion", "Head Lessor Consent"],
    requiredInputs: ["Master Agreement Code", "Head Lessor Written NOC", "Sublessee NID", "Exact Space Demarcation", "Sublease Rent", "Deposit"],
    governedRules: ["Subordinate to Master Lease", "Strict Anti-Arbitrage Rule", "Zero Unauthorized Transfer", "Tri-partite Notification"],
    reviewTriggers: ["Missing Head Lessor NOC (BLOCK)", "Sublease Exceeds Master Tenure (BLOCK)", "Unauthorized Commercial Conversion"],
  },
  land: {
    id: "BD-LAND-LEASE-V1.0",
    segmentId: "land",
    nameEn: "Land Lease Agreement",
    nameBn: "জমি ইজারা চুক্তি",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "State Acquisition and Tenancy Act 1950",
    stampDuty: "৳300 Stamp Duty",
    registrationReq: "Mandatory if tenure exceeds 3 years",
    applicableProperty: "Vacant Land, Commercial Yard, Greenfield Plot, Open Storage",
    typicalParties: "Landowner ↔ Land Lessee",
    financialModel: "Annual / Quarterly Ground Rent + Boundary Deposit",
    descriptionEn:
      "Cadastral land parcel lease specifying exact Mouza, Khatian, and Dag coordinates with strict boundary and non-alienation terms.",
    descriptionBn:
      "মৌজা, খতিয়ান ও দাগ সম্বলিত খালি জমি ইজারা চুক্তি — সীমানা নির্ধারণ, ভূ-উন্নয়ন কর ও শর্তহীন ফেরত নীতিমালা সহ।",
    covers: ["Cadastral Dag & Khatian", "Mouza Boundaries", "Surface Use Only", "No Permanent Brick Structure", "Land Development Tax", "Reversion"],
    requiredInputs: ["Mouza & Upazila", "Khatian No.", "Dag / Plot No.", "Area (Decimals / Katha)", "Boundary Survey", "Annual Rent", "Deposit"],
    governedRules: ["State Acquisition Act 1950", "Non-Alienation of Title", "Survey Baseline Check", "Cadastral Integrity"],
    reviewTriggers: ["Tenure > 3 Years", "Waterbody / Low Land Classification", "Permanent Construction Rights Requested"],
  },
  agriculture: {
    id: "BD-AGRI-FIXED-V1.0",
    segmentId: "agriculture",
    nameEn: "Fixed Agricultural Land Lease",
    nameBn: "কৃষি জমি বার্ষিক ইজারা চুক্তি",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "State Acquisition and Tenancy Act 1950",
    stampDuty: "৳300 Stamp Duty",
    registrationReq: "Mandatory if > 3 years",
    applicableProperty: "Agricultural Farmland, Irrigated Paddy Field, Orchard, Pond",
    typicalParties: "Landowner ↔ Agricultural Cultivator / Farm Enterprise",
    financialModel: "Fixed Cash Consideration per Decimal / Bigha per Year",
    descriptionEn:
      "Fixed-cash annual farmland lease preserving topsoil, irrigation channels, and environmental agriculture standards without harvest splitting.",
    descriptionBn:
      "বার্ষিক নির্দিষ্ট নগদ অর্থে কৃষি জমি ইজারা চুক্তি — মাটির উর্বরতা সংরক্ষণ, সেচ সুবিধা ও পরিবেশগত কৃষি শর্তাবলী সহ।",
    covers: ["Crop Year Term", "Fixed Cash Rent", "Topsoil Protection", "Tube-well Access", "No Non-Agri Conversion", "Harvest Reversion"],
    requiredInputs: ["Parcel ID", "Dag / Khatian", "Cultivable Area (Decimals)", "Soil Type", "Irrigation Source", "Annual Cash Rent"],
    governedRules: ["Non-Agricultural Conversion Prohibited", "Irrigation Rights Preserved", "Statutory Agricultural Standards"],
    reviewTriggers: ["Tenure > 3 Years", "Change in Crop Category", "Disputed Canal / Irrigation Access"],
  },
  cropshare: {
    id: "BD-AGRI-BARGA-V1.0",
    segmentId: "cropshare",
    nameEn: "Statutory Barga / Crop-Share Agreement",
    nameBn: "বর্গা চাষ চুক্তি (অধ্যাদেশ ১৯৮৪)",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Land Reforms Ordinance 1984 (Section 8 to 16)",
    stampDuty: "Statutory Exemption / Standard Form",
    registrationReq: "Prescribed Barga Board Verification",
    applicableProperty: "Farmland, Two-Crop Paddy Project (Boro & Aman)",
    typicalParties: "Landowner ↔ Bargadar (Cultivator)",
    financialModel: "1/3 Landowner + 1/3 Cultivator Labor + 1/3 Input Cost Proportional Share",
    descriptionEn:
      "Statutory crop-sharing agreement under the Land Reforms Ordinance 1984 with physical maunds distribution and eviction protection.",
    descriptionBn:
      "ভূমি সংস্কার অধ্যাদেশ ১৯৮৪ অনুসারী বিধিবদ্ধ বর্গা চাষ চুক্তি — ১/৩ মালিক + ১/৩ শ্রম + ১/৩ উপকরণ ব্যয় বণ্টন এবং উচ্ছেদ সুরক্ষা সহ।",
    covers: ["1/3 Statutory Split", "Threshing Floor (Khamar)", "Seed & Fertilizer Input", "Disaster Relief", "Inheritance of Barga Rights", "Settlement"],
    requiredInputs: ["Bargadar Name", "NID", "Village / Union", "Parcel Dag", "Crop Season (Boro / Aman)", "Input Cost Sharing %"],
    governedRules: ["Land Reforms Ordinance 1984 Mandate", "Section 12 Eviction Protection", "Physical Maunds Ledger", "Dual Value Tracking"],
    reviewTriggers: ["Deviation from 1/3 Statutory Ratios", "Bargadar Dispossession Notice", "Natural Disaster Claim"],
  },
  semibuilt: {
    id: "BD-SEMI-BUILT-V1.0",
    segmentId: "semibuilt",
    nameEn: "Semi-Built Property / Fit-Out Agreement",
    nameBn: "অর্ধ-নির্মিত স্থাপনা উন্নয়ন ও ভাড়া চুক্তি",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Contract Act 1872 / Building Construction Act 1952",
    stampDuty: "৳1000 Non-Judicial Stamp",
    registrationReq: "Recommended Notarized & Registered",
    applicableProperty: "Shell Structure, Unfinished Commercial Floor, Semi-Built Unit",
    typicalParties: "Property Owner ↔ Fit-Out Contractor / Operator Tenant",
    financialModel: "Abated Base Rent + Capex Amortization against Future Rent",
    descriptionEn:
      "Comprehensive tenancy agreement where tenant completes structural fit-out and amortizes capital expenditure against future rent.",
    descriptionBn:
      "অর্ধ-নির্মিত ভবনে ভাড়াটিয়ার নিজস্ব খরচে সংস্কার ও ফিনিশিং সম্পন্ন করে ভবিষ্যৎ ভাড়ার সাথে সমন্বয়ের বিশেষ চুক্তি।",
    covers: ["Approved Fit-Out Drawings", "Capex Budget & Receipts", "Rent-Free Grace Window", "Amortization Table", "Fixtures Ownership", "Handover"],
    requiredInputs: ["Scope of Fit-Out", "Approved Budget (৳)", "Amortization Period", "Completion Milestone", "Base Rent Post-Completion", "NID"],
    governedRules: ["Building Construction Act 1952", "Structural Integrity Audit", "Audited Bills of Quantities", "Zero Collusion Rule"],
    reviewTriggers: ["Structural Wall Demolition", "Capex > ৳500,000", "Rent-Free Window > 6 Months", "Unclear Fixture Title"],
  },
  landinfra: {
    id: "BD-LAND-INFRA-V1.0",
    segmentId: "landinfra",
    nameEn: "Land + Rural Infrastructure Development",
    nameBn: "জমি ও গ্রামীণ অবকাঠামো যৌথ উন্নয়ন চুক্তি",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Contract Act 1872 / Partnership Act 1932",
    stampDuty: "৳2000 Non-Judicial Stamp",
    registrationReq: "Mandatory Registered Deed",
    applicableProperty: "Greenfield Land with Road, Deep Tube-Well & Solar Grid",
    typicalParties: "Land Provider ↔ Infrastructure Partner / STFL Agro Unit",
    financialModel: "Land Asset Contribution + Infra Capex + Revenue / Tariff Distribution",
    descriptionEn:
      "Multi-component development agreement distinguishing separate ownership of land, access roads, power lines, and irrigation equipment.",
    descriptionBn:
      "রাস্তা, গভীর নলকূপ, সোলার গ্রিড ও বিদ্যুৎ সুবিধাযুক্ত গ্রামীণ জমিতে আলাদা আলাদা সম্পদ মালিকানা ও যৌথ পরিচালন চুক্তি।",
    covers: ["Separate Component Ownership", "Road Easements", "Tube-Well Maintenance", "Power Tariff Sharing", "Depreciation Schedule", "Exit Protocol"],
    requiredInputs: ["Land Valuation (৳)", "Infra Asset Registry", "Equity / Contribution %", "Maintenance Reserve Fund", "Parties Registry", "NID"],
    governedRules: ["Partnership Act 1932 Principles", "Easement Rights Invariant", "Asset Register Verification", "Zero Title Dilution"],
    reviewTriggers: ["Grid Feed-in Licensing", "Public Road Dedication", "Third-party Easement Dispute"],
  },
  jointproject: {
    id: "BD-JOINT-PROJECT-V1.0",
    segmentId: "jointproject",
    nameEn: "Long-Term Joint Land Project",
    nameBn: "দীর্ঘমেয়াদী কৃষি ও বাণিজ্যিক যৌথ প্রকল্প",
    version: "V1.0",
    jurisdiction: "Bangladesh",
    status: "APPROVED_TEMPLATE",
    statutoryLaw: "Companies Act 1994 / Contract Act 1872",
    stampDuty: "৳2000 Non-Judicial Stamp",
    registrationReq: "Mandatory Board Resolution & Sub-Registrar Registration",
    applicableProperty: "Far-Village Agro Hub, Cold Storage, Processing Plant, Rural Enterprise",
    typicalParties: "Landowners + Cultivator Cooperatives + Machinery Investors + STFL Enterprise",
    financialModel: "Net Distributable Revenue Share (Formula-Driven Settlement)",
    descriptionEn:
      "Institutional multi-party long-term project agreement governing land, capital, operations, risk distribution, and annual audited profit share.",
    descriptionBn:
      "বহু-পক্ষীয় দীর্ঘমেয়াদী গ্রামীণ এন্টারপ্রাইজ ও কৃষি প্রক্রিয়াজাতকরণ চুক্তি — স্বচ্ছ রাজস্ব ভাগ ও বার্ষিক অডিট ব্যবস্থা সহ।",
    covers: ["Multi-Party Governance", "Operating Budget Approval", "Risk Allocation", "Annual Audited Waterfall", "Community Fund", "Dispute Escalation"],
    requiredInputs: ["Project Code", "Parties Registry", "Capital Contribution Proof", "Revenue Share Ratios", "Project Escrow Bank Details", "NID"],
    governedRules: ["Dual Control Governance (Level 5)", "Independent Seasonal Audits", "Escrow Accounting", "Zero Single Point of Failure"],
    reviewTriggers: ["Term > 5 Years", "Foreign Grant Interface", "Dispute Clause Amendment", "Dissolution Protocol"],
  },
};

const SEGMENTS_LIST: { id: AgreementSegmentId; labelEn: string; labelBn: string; icon: React.ComponentType<{ width?: number; height?: number; className?: string }> }[] = [
  { id: "residential", labelEn: "Residential", labelBn: "আবাসিক", icon: HomeSimple },
  { id: "commercial", labelEn: "Commercial", labelBn: "বাণিজ্যিক", icon: Shop },
  { id: "sublease", labelEn: "Sublease", labelBn: "উপ-ইজারা", icon: Group },
  { id: "land", labelEn: "Land Lease", labelBn: "জমি ইজারা", icon: MapPin },
  { id: "agriculture", labelEn: "Agriculture", labelBn: "কৃষি জমি", icon: Tree },
  { id: "cropshare", labelEn: "Crop Share", labelBn: "বর্গা ও ফসল ভাগ", icon: Coins },
  { id: "semibuilt", labelEn: "Semi-Built", labelBn: "অর্ধ-নির্মিত", icon: Building },
  { id: "landinfra", labelEn: "Land + Infra", labelBn: "জমি ও অবকাঠামো", icon: SettingsIcon },
  { id: "jointproject", labelEn: "Joint Project", labelBn: "যৌথ প্রকল্প", icon: Page },
];

function SettingsIcon({ width = 16, height = 16, className = "" }: { width?: number; height?: number; className?: string }) {
  return <Building width={width} height={height} className={className} />;
}

// ============================================================================
// 2. MAIN COMPONENT
// ============================================================================

export default function GrihostiOSTablistPage() {
  const { activeClass, lang, setLang, getConsoleAccess } = useGovernedWorkspace();
  const access = getConsoleAccess("property");

  // Selected Segment
  const [selectedSegment, setSelectedSegment] = useState<AgreementSegmentId>("residential");

  // Progressive Create Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Progressive Form Inputs
  const [formInputs, setFormInputs] = useState({
    // Step 1: Parties
    lessorName: "SohaelTasneem Foundation (STFL)",
    lessorNid: "19842691048201",
    lessorPhone: "+8801711000001",
    lessorAddress: "House 12, Road 4, Sector 3, Uttara, Dhaka-1230",
    lesseeName: "Kazi Farhan Ahmed",
    lesseeNid: "19902691048209",
    lesseePhone: "+8801819000002",
    lesseeAddress: "Bara Mirpur, Ward 12, Mirpur, Dhaka-1216",
    // Step 2: Property
    propertyCode: "STFL-PRP-DHK-0001",
    propertyAddress: "Sohael Mansion, Holding 42/A, Road 03, Mirpur-12, Dhaka",
    unitCode: "Unit G-01",
    purpose: "Residential Family Residence",
    // Step 3: Tenure
    startDate: "2026-11-01",
    endDate: "2027-10-31",
    // Step 4: Financials
    rentAmount: 25000,
    paymentFrequency: "MONTHLY",
    securityDeposit: 50000,
    serviceCharge: 3000,
    utilityResponsibility: "Tenant pays metered DESCO & WASA directly",
    maintenanceResponsibility: "Major structural: Landlord; Minor day-to-day: Tenant",
    // Step 5: Payment
    paymentMethod: "BANK_TRANSFER",
    paymentReference: "TRX-EBL-89210492",
    paymentAmount: 75000, // 1st month rent + deposit
    paymentDate: "2026-10-15",
    // Step 6: Special Conditions
    hasSpecialCondition: false,
    specialCategory: "NOTICE",
    specialTextBn: "উভয় পক্ষ বিশেষ পরিস্থিতিতে ৩০ দিনের পরিবর্তে ১৫ দিনের নোটিশে চুক্তি বাতিল করতে পারবেন।",
    specialTextEn: "In extraordinary circumstances, either party may terminate with 15 days written notice.",
  });

  // Tenure human-readable summary
  const tenureSummary = useMemo(() => {
    if (!formInputs.startDate || !formInputs.endDate) return "Tenure not specified";
    const start = new Date(formInputs.startDate);
    const end = new Date(formInputs.endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const approxMonths = Math.round(diffDays / 30.4);
    return `${approxMonths} Months (${formInputs.startDate} → ${formInputs.endDate})`;
  }, [formInputs.startDate, formInputs.endDate]);

  // Live Legal Readiness Gate
  const template = GOVERNED_TEMPLATES[selectedSegment];
  const readinessGate = useMemo(() => {
    const reasons: { type: "PASS" | "WARN" | "BLOCK"; textBn: string; textEn: string }[] = [];
    let isBlocked = false;
    let isReviewRequired = false;

    // Constitutional Invariant #2: SoD check
    if (activeClass === "CLASS_00") {
      isBlocked = true;
      reasons.push({
        type: "BLOCK",
        textBn: "সাংবিধানিক নীতি ২ (SoD): সুপার অ্যাডমিন (ক্লাস ০০) সরাসরি চুক্তি সম্পাদন বা সম্পত্তিতে পরিবর্তন করতে পারেন না। ক্লাস ০৪ প্রয়োজন।",
        textEn: "Constitutional Invariant #2 (SoD): Super Admin (CLASS_00) is barred from operational agreement mutations. Must be created by CLASS_04.",
      });
    }

    // Identity check
    if (!formInputs.lesseeNid || formInputs.lesseeNid.length < 10) {
      isBlocked = true;
      reasons.push({
        type: "BLOCK",
        textBn: "আইনি পরিচয় অসম্পূর্ণ: দ্বিতীয় পক্ষের বৈধ জাতীয় পরিচয়পত্র নম্বর (NID) আবশ্যক।",
        textEn: "Identity Incomplete: Second party valid National ID (NID) is mandatory.",
      });
    }

    // Inverted dates
    if (formInputs.startDate && formInputs.endDate && formInputs.endDate <= formInputs.startDate) {
      isBlocked = true;
      reasons.push({
        type: "BLOCK",
        textBn: "মেয়াদকাল ত্রুটি: সমাপ্তি তারিখ শুরুর তারিখের পূর্ববর্তী হতে পারে না।",
        textEn: "Tenure Inversion: End date cannot be prior to start date.",
      });
    }

    // Registration Act check
    if (formInputs.startDate && formInputs.endDate) {
      const start = new Date(formInputs.startDate);
      const end = new Date(formInputs.endDate);
      const diffYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (diffYears >= 3) {
        isReviewRequired = true;
        reasons.push({
          type: "WARN",
          textBn: "রেজিস্ট্রেশন আইন ১৯০৮ (ধারা ১৭): ৩ বছর বা তদূর্ধ্ব মেয়াদের ইজারা বাধ্যতামূলক সাব-রেজিস্ট্রার অফিসে নিবন্ধিত হতে হবে।",
          textEn: "Registration Act 1908 (Section 17): Leases exceeding 3 years require compulsory registration at Sub-Registrar office.",
        });
      }
    }

    // Special condition modification
    if (formInputs.hasSpecialCondition) {
      isReviewRequired = true;
      reasons.push({
        type: "WARN",
        textBn: "বিশেষ শর্ত সতর্কতা: ব্যবহারকারীর বিশেষ শর্ত স্ট্যান্ডার্ড গভর্ন্ড ক্লজ সংশোধন করতে পারে। আইনি পর্যালোচনা আবশ্যক।",
        textEn: "Special Condition Alert: User-entered condition modifies standard governed clause. Formal legal review required before execution.",
      });
    }

    // High deposit
    if (formInputs.securityDeposit > formInputs.rentAmount * 12) {
      isReviewRequired = true;
      reasons.push({
        type: "WARN",
        textBn: "আর্থিক ঝুঁকি: জামানতের পরিমাণ ১২ মাসের ভাড়ার বেশি।",
        textEn: "Financial Risk: Security deposit exceeds 12 months rent.",
      });
    }

    let status: "GREEN" | "AMBER" | "RED" = "GREEN";
    if (isBlocked) status = "RED";
    else if (isReviewRequired) status = "AMBER";

    return { status, reasons };
  }, [activeClass, formInputs]);

  // Preview Document View State
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [executedDoc, setExecutedDoc] = useState<{
    agreementCode: string;
    sha256Hash: string;
    verificationCode: string;
    verificationUrl: string;
    executedAt: string;
  } | null>(null);

  const handleExecuteAgreement = () => {
    if (readinessGate.status === "RED") {
      alert("Execution Blocked! Please resolve the red readiness gate flags first.");
      return;
    }
    const code = `STFL-LSE-2026-${Math.floor(Math.random() * 900000 + 100000)}`;
    const vCode = `V-BD-${Math.floor(Math.random() * 9000 + 1000)}-K2`;
    setExecutedDoc({
      agreementCode: code,
      sha256Hash: "8f4e2b10a9c4d3e5f7a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
      verificationCode: vCode,
      verificationUrl: `https://stflbd.app/v/${vCode}`,
      executedAt: new Date().toISOString(),
    });
  };

  if (access === "DENIED") {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-700 mx-auto flex items-center justify-center mb-4">
          <Lock width={24} height={24} />
        </div>
        <h2 className="text-lg font-bold text-[#081F2D] mb-2">
          {lang === "bn" ? "প্রবেশাধিকার সংরক্ষিত" : "Access Denied"}
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          {lang === "bn"
            ? `গৃহস্থালি চুক্তি নির্বাচন কেন্দ্র (${activeClass}) এর জন্য অনুমোদিত নয়। এই ব্যবস্থাটি ক্লাস ০৩ ও ক্লাস ০৪ এর জন্য সংরক্ষিত।`
            : `GrihostiOS Agreement Center is not accessible for ${activeClass}. Permitted User Classes: CLASS_03 and CLASS_04.`}
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#081F2D] hover:text-[#FF6B35]"
        >
          <NavArrowLeft width={14} height={14} />
          {lang === "bn" ? "হাব-এ ফিরে যান" : "Back to Hub"}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] pb-16">
      {/* ===================================================================== */}
      {/* COMPACT STFL HEADER (Section 5)                                       */}
      {/* ===================================================================== */}
      <header className="border-b border-[#E7E7E2] bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="text-stone-400 hover:text-[#081F2D] transition-colors p-1 -ml-1 rounded"
              title="Back to Admin"
            >
              <NavArrowLeft width={18} height={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono tracking-wider font-semibold text-[#081F2D]">
                  STFL VI
                </span>
                <span className="text-stone-300">/</span>
                <span className="text-xs font-mono uppercase text-stone-500 font-medium">
                  GrihostiOS
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-sans mt-0.5">
                SohaelTasneem Foundation • Property • Lease • Land • Agriculture
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Bilingual Toggle */}
            <div className="inline-flex items-center bg-[#FAFAF8] border border-[#E7E7E2] rounded-md p-0.5 text-[11px] font-mono">
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded transition-all ${
                  lang === "en" ? "bg-[#081F2D] text-white font-bold" : "text-stone-600 hover:text-[#081F2D]"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("bn")}
                className={`px-2 py-0.5 rounded transition-all ${
                  lang === "bn" ? "bg-[#081F2D] text-white font-bold" : "text-stone-600 hover:text-[#081F2D]"
                }`}
              >
                বাংলা
              </button>
            </div>

            <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-1 rounded border border-[#E7E7E2]">
              {activeClass}
            </span>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* MAIN CENTERED WORKSPACE (Max Width: ~900-1100px)                      */}
      {/* ===================================================================== */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Title & Philosophy */}
        <div className="text-center space-y-1.5 pb-2">
          <h1 className="text-2xl font-bold text-[#081F2D] tracking-tight">
            {lang === "bn" ? "চুক্তি টেমপ্লেট নির্বাচন কেন্দ্র" : "Agreement Template Selector"}
          </h1>
          <p className="text-xs text-stone-600 max-w-xl mx-auto leading-relaxed">
            {lang === "bn"
              ? "সোহেলতাসনীম ফাউন্ডেশনের প্রমিত আইনি চুক্তি নির্বাচন করুন। ব্যবহারকারী তথ্য প্রদান করবেন, সিস্টেম সার্বিক আইনি কাঠামো ও শর্তাবলী সরবরাহ করবে।"
              : "Select an approved SohaelTasneem Foundation agreement structure. You enter the facts; the system supplies the governed clauses and statutory compliance."}
          </p>
        </div>

        {/* =================================================================== */}
        {/* HORIZONTAL SCROLLABLE TAB BAR (Section 6)                           */}
        {/* =================================================================== */}
        <div className="overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 min-w-max p-1 bg-white rounded-lg border border-[#E7E7E2] shadow-2xs">
            {SEGMENTS_LIST.map((seg) => {
              const Icon = seg.icon;
              const isActive = selectedSegment === seg.id;
              return (
                <button
                  key={seg.id}
                  onClick={() => {
                    setSelectedSegment(seg.id);
                    setIsFormOpen(false);
                    setShowDocumentPreview(false);
                    setExecutedDoc(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all relative ${
                    isActive
                      ? "bg-[#081F2D] text-white shadow-xs"
                      : "text-stone-600 hover:text-[#081F2D] hover:bg-stone-50"
                  }`}
                >
                  <Icon width={13} height={13} className={isActive ? "text-[#FF6B35]" : "text-stone-400"} />
                  <span>{lang === "bn" ? seg.labelBn : seg.labelEn}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-[#FF6B35] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* THE ONE FOCUSED CONTEXTUAL AGREEMENT CARD (Section 7, 10)           */}
        {/* =================================================================== */}
        <div className="bg-white rounded-xl border border-[#E7E7E2] p-6 shadow-xs space-y-6">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E7E7E2] pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#FF6B35] uppercase tracking-wider">
                  {template.id}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  {template.status.replace("_", " ")}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-[10px] font-mono text-stone-500">
                  {template.jurisdiction}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#081F2D]">
                {template.nameEn}
              </h2>
              <div className="text-xs font-medium text-stone-600 font-sans">
                বাংলা: <span className="text-[#081F2D] font-semibold">{template.nameBn}</span>
              </div>
            </div>

            {/* Template Version & Statutory Reference Badge */}
            <div className="text-right sm:max-w-xs text-xs font-mono text-stone-500 bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E7E7E2]">
              <div className="text-[10px] uppercase text-stone-400">Statutory Authority</div>
              <div className="font-semibold text-stone-800 text-[11px] truncate">
                {template.statutoryLaw}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-stone-700 leading-relaxed">
            {lang === "bn" ? template.descriptionBn : template.descriptionEn}
          </p>

          {/* Structured Sections (Chips) */}
          <div className="space-y-4 pt-1">
            {/* Agreement Covers */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-2">
                Agreement Covers (চুক্তির আওতাভুক্ত বিষয়সমূহ)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.covers.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-xs font-medium bg-[#FAFAF8] text-[#081F2D] px-2.5 py-1 rounded-md border border-[#E7E7E2]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Required Information */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-2">
                Required Facts to Enter (ব্যবহারকারীকে যা পূরণ করতে হবে)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.requiredInputs.map((r, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-xs font-medium bg-stone-50 text-stone-700 px-2.5 py-1 rounded-md border border-stone-200"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Governed & Immutable */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-2">
                Governed by STFL System (সিস্টেম দ্বারা সম্পূর্ণ নিয়ন্ত্রিত ও সুরক্ষিত)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.governedRules.map((g, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-xs font-medium bg-blue-50 text-blue-900 px-2.5 py-1 rounded-md border border-blue-200"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Triggers */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mb-2">
                Review Triggers (আইনি পর্যালোচনা শর্তাবলী)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.reviewTriggers.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center text-xs font-medium bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md border border-amber-200"
                  >
                    <WarningTriangle width={11} height={11} className="mr-1 text-amber-600" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Compact Governance Panel (Section 19) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FAFAF8] p-3.5 rounded-lg border border-[#E7E7E2] text-xs">
            <div>
              <span className="text-[10px] font-mono text-stone-400 uppercase block">Stamp Duty</span>
              <span className="font-semibold text-stone-800 text-[11px]">{template.stampDuty}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-400 uppercase block">Registration</span>
              <span className="font-semibold text-stone-800 text-[11px] truncate block" title={template.registrationReq}>
                {template.registrationReq}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-400 uppercase block">Execution</span>
              <span className="font-semibold text-stone-800 text-[11px]">Electronic + Witness</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-stone-400 uppercase block">Verification</span>
              <span className="font-semibold text-stone-800 text-[11px]">QR + Verification ID</span>
            </div>
          </div>

          {/* Primary Action Button (Create Agreement) */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E7E7E2]">
            <div className="text-[11px] text-stone-500 font-mono">
              Mental Model: SELECT → FILL → CHECK → SIGN → RECEIVE
            </div>

            <button
              onClick={() => {
                setIsFormOpen(!isFormOpen);
                setCurrentStep(1);
              }}
              className="px-6 py-2.5 bg-[#081F2D] hover:bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Page width={15} height={15} className="text-[#FF6B35]" />
              <span>
                {isFormOpen
                  ? lang === "bn"
                    ? "তথ্য পূরণ বন্ধ করুন"
                    : "Close Agreement Form"
                  : lang === "bn"
                  ? "চুক্তি তৈরি করুন (Create Agreement)"
                  : "Create Agreement"}
              </span>
              <ArrowRight width={14} height={14} />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* QUICK CREATE PROGRESSIVE FORM (Section 11-16)                       */}
        {/* =================================================================== */}
        {isFormOpen && (
          <div className="bg-white rounded-xl border border-[#081F2D] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E7E2] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#081F2D] flex items-center gap-2">
                  <User width={16} height={16} className="text-[#081F2D]" />
                  {lang === "bn" ? "ধাপভিত্তিক তথ্য পূরণ (Progressive Data Entry)" : "Progressive Agreement Fact Entry"}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Template: {template.id} • {template.nameEn}
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-1 font-mono text-xs">
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCurrentStep(s as typeof currentStep)}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                      currentStep === s
                        ? "bg-[#081F2D] text-white"
                        : "bg-[#FAFAF8] text-stone-500 border border-[#E7E7E2]"
                    }`}
                  >
                    0{s}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: PARTIES */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#081F2D]">STEP 1 — PARTIES (পক্ষসমূহ)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Party (Lessor) */}
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2] space-y-2">
                    <div className="text-[11px] font-mono font-bold text-stone-500 uppercase">
                      First Party (মালিক / প্রতিষ্ঠান)
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Name</label>
                      <input
                        type="text"
                        value={formInputs.lessorName}
                        onChange={(e) => setFormInputs({ ...formInputs, lessorName: e.target.value })}
                        className="w-full text-xs font-medium p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">NID / Reg No.</label>
                      <input
                        type="text"
                        value={formInputs.lessorNid}
                        onChange={(e) => setFormInputs({ ...formInputs, lessorNid: e.target.value })}
                        className="w-full text-xs font-mono p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Address</label>
                      <input
                        type="text"
                        value={formInputs.lessorAddress}
                        onChange={(e) => setFormInputs({ ...formInputs, lessorAddress: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                  </div>

                  {/* Second Party (Lessee / Tenant) */}
                  <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-stone-500 uppercase">
                        Second Party (ভাড়াটিয়া / গ্রহীতা)
                      </span>
                      <button
                        onClick={() =>
                          setFormInputs({
                            ...formInputs,
                            lesseeName: "Md. Kazi Farhan Ahmed",
                            lesseeNid: "19902691048209",
                            lesseePhone: "+8801819000002",
                            lesseeAddress: "Bara Mirpur, Ward 12, Mirpur, Dhaka",
                          })
                        }
                        className="text-[10px] text-[#081F2D] hover:underline font-mono"
                      >
                        [Select Existing Party]
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Tenant Full Name</label>
                      <input
                        type="text"
                        value={formInputs.lesseeName}
                        onChange={(e) => setFormInputs({ ...formInputs, lesseeName: e.target.value })}
                        className="w-full text-xs font-semibold p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">NID / Passport Number (Mandatory)</label>
                      <input
                        type="text"
                        value={formInputs.lesseeNid}
                        onChange={(e) => setFormInputs({ ...formInputs, lesseeNid: e.target.value })}
                        className="w-full text-xs font-mono p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Phone</label>
                      <input
                        type="text"
                        value={formInputs.lesseePhone}
                        onChange={(e) => setFormInputs({ ...formInputs, lesseePhone: e.target.value })}
                        className="w-full text-xs font-mono p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500">Permanent Address</label>
                      <input
                        type="text"
                        value={formInputs.lesseeAddress}
                        onChange={(e) => setFormInputs({ ...formInputs, lesseeAddress: e.target.value })}
                        className="w-full text-xs p-1.5 bg-white border border-[#E7E7E2] rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#081F2D]">STEP 2 — PROPERTY & UNIT (সম্পত্তি ও ইউনিট)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Property Reference</label>
                    <input
                      type="text"
                      value={formInputs.propertyCode}
                      onChange={(e) => setFormInputs({ ...formInputs, propertyCode: e.target.value })}
                      className="w-full text-xs font-mono p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Demarcated Unit / Room / Dag</label>
                    <input
                      type="text"
                      value={formInputs.unitCode}
                      onChange={(e) => setFormInputs({ ...formInputs, unitCode: e.target.value })}
                      className="w-full text-xs font-mono font-semibold p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-stone-500 mb-1">Property Full Physical Address</label>
                    <input
                      type="text"
                      value={formInputs.propertyAddress}
                      onChange={(e) => setFormInputs({ ...formInputs, propertyAddress: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-stone-500 mb-1">Permitted Use / Purpose</label>
                    <input
                      type="text"
                      value={formInputs.purpose}
                      onChange={(e) => setFormInputs({ ...formInputs, purpose: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TENURE */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#081F2D]">STEP 3 — TENURE & DURATION (ইজারার মেয়াদ)</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Start Date (শুরুর তারিখ)</label>
                    <input
                      type="date"
                      value={formInputs.startDate}
                      onChange={(e) => setFormInputs({ ...formInputs, startDate: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">End Date (সমাপ্তি তারিখ)</label>
                    <input
                      type="date"
                      value={formInputs.endDate}
                      onChange={(e) => setFormInputs({ ...formInputs, endDate: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E7E2] flex items-center justify-between">
                  <div className="text-xs font-medium text-stone-700">Calculated Tenure Period:</div>
                  <div className="text-xs font-mono font-bold text-[#081F2D]">{tenureSummary}</div>
                </div>
              </div>
            )}

            {/* STEP 4: FINANCIAL TERMS */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#081F2D]">STEP 4 — FINANCIAL TERMS (ভাড়া ও জামানত)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Rent / Consideration (৳)</label>
                    <input
                      type="number"
                      value={formInputs.rentAmount}
                      onChange={(e) => setFormInputs({ ...formInputs, rentAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-mono font-bold p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Payment Frequency</label>
                    <select
                      value={formInputs.paymentFrequency}
                      onChange={(e) => setFormInputs({ ...formInputs, paymentFrequency: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md font-medium"
                    >
                      <option value="MONTHLY">Monthly (প্রতি মাসে)</option>
                      <option value="QUARTERLY">Quarterly (ত্রৈমাসিক)</option>
                      <option value="SEASONAL">Seasonal (মৌসুমভিত্তিক)</option>
                      <option value="ANNUAL">Annual (বার্ষিক)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Security Deposit (৳)</label>
                    <input
                      type="number"
                      value={formInputs.securityDeposit}
                      onChange={(e) => setFormInputs({ ...formInputs, securityDeposit: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-mono font-bold p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Service Charge (৳)</label>
                    <input
                      type="number"
                      value={formInputs.serviceCharge}
                      onChange={(e) => setFormInputs({ ...formInputs, serviceCharge: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-mono p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-stone-500 mb-1">Utility Arrangement</label>
                    <input
                      type="text"
                      value={formInputs.utilityResponsibility}
                      onChange={(e) => setFormInputs({ ...formInputs, utilityResponsibility: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: PAYMENT LINKAGE */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#081F2D]">STEP 5 — PAYMENT LINKAGE (প্রাথমিক পরিশোধ ট্র্যাকিং)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Payment Method</label>
                    <select
                      value={formInputs.paymentMethod}
                      onChange={(e) => setFormInputs({ ...formInputs, paymentMethod: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-[#E7E7E2] rounded-md font-medium"
                    >
                      <option value="BANK_TRANSFER">Bank Transfer (EBL / SCB / City)</option>
                      <option value="BKASH">bKash (বিকাশ মার্চেন্ট)</option>
                      <option value="NAGAD">Nagad (নগদ)</option>
                      <option value="CHEQUE">Cheque (ব্যাংক চেক)</option>
                      <option value="CASH">Cash (রসিদভুক্ত নগদ)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Transaction Reference</label>
                    <input
                      type="text"
                      value={formInputs.paymentReference}
                      onChange={(e) => setFormInputs({ ...formInputs, paymentReference: e.target.value })}
                      className="w-full text-xs font-mono p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 mb-1">Amount Paid (৳)</label>
                    <input
                      type="number"
                      value={formInputs.paymentAmount}
                      onChange={(e) => setFormInputs({ ...formInputs, paymentAmount: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs font-mono font-bold p-2 bg-white border border-[#E7E7E2] rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: SPECIAL CONDITIONS & LEGAL GATE */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-[#081F2D]">
                  STEP 6 — SPECIAL CONDITIONS & READINESS (বিশেষ শর্ত ও আইনি যাচাই)
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                    <input
                      type="checkbox"
                      checked={formInputs.hasSpecialCondition}
                      onChange={(e) => setFormInputs({ ...formInputs, hasSpecialCondition: e.target.checked })}
                      className="rounded text-[#081F2D]"
                    />
                    <span>Add Structured Special Condition Agreed by Parties (বিশেষ শর্ত যোগ করুন)</span>
                  </label>

                  {formInputs.hasSpecialCondition && (
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg space-y-2">
                      <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <WarningTriangle width={13} height={13} className="text-amber-600" />
                        <span>Special Condition (বিশেষ শর্ত)</span>
                      </div>
                      <textarea
                        rows={2}
                        value={formInputs.specialTextBn}
                        onChange={(e) => setFormInputs({ ...formInputs, specialTextBn: e.target.value })}
                        className="w-full p-2 text-xs border border-amber-300 rounded bg-white text-stone-800"
                      />
                      <div className="text-[10px] text-amber-800">
                        ⚠ স্ট্যান্ডার্ড ক্লজ অপরিবর্তনীয় থাকবে। বিশেষ শর্ত যদি অনুমোদিত কোনো ধারার সাথে সাংঘর্ষিক হয়, তবে স্বয়ংক্রিয়ভাবে লিগ্যাল রিভিউ তৈরি হবে।
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Legal Readiness Gate Banner */}
                <div
                  className={`p-4 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    readinessGate.status === "GREEN"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                      : readinessGate.status === "AMBER"
                      ? "bg-amber-50 text-amber-900 border-amber-300"
                      : "bg-rose-50 text-rose-900 border-rose-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-1.5 font-mono">
                      {readinessGate.status === "GREEN" && <Check width={14} height={14} className="text-emerald-700" />}
                      {readinessGate.status === "AMBER" && <WarningTriangle width={14} height={14} className="text-amber-700" />}
                      {readinessGate.status === "RED" && <Lock width={14} height={14} className="text-rose-700" />}
                      LEGAL READINESS: {readinessGate.status} — {readinessGate.status === "GREEN" ? "READY FOR EXECUTION" : readinessGate.status === "AMBER" ? "LEGAL REVIEW REQUIRED" : "BLOCKED"}
                    </div>
                    {readinessGate.reasons.map((r, i) => (
                      <div key={i} className="text-[11px] leading-relaxed">
                        • {lang === "bn" ? r.textBn : r.textEn}
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={readinessGate.status === "RED"}
                    onClick={() => setShowDocumentPreview(true)}
                    className={`px-4 py-2 rounded text-xs font-semibold whitespace-nowrap ${
                      readinessGate.status === "RED"
                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                        : "bg-[#081F2D] hover:bg-[#1A1A1A] text-white"
                    }`}
                  >
                    View Document Preview
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E7E7E2]">
              <button
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((currentStep - 1) as typeof currentStep)}
                className={`text-xs font-semibold px-3 py-1.5 rounded ${
                  currentStep === 1 ? "text-stone-300 cursor-not-allowed" : "text-stone-700 hover:bg-stone-100"
                }`}
              >
                ← Previous Step
              </button>

              <button
                disabled={currentStep === 6}
                onClick={() => setCurrentStep((currentStep + 1) as typeof currentStep)}
                className={`text-xs font-semibold px-4 py-1.5 rounded ${
                  currentStep === 6 ? "hidden" : "bg-[#081F2D] text-white hover:bg-[#1A1A1A]"
                }`}
              >
                Next Step →
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* INSTITUTIONAL AGREEMENT PREVIEW (Section 17, 25)                    */}
        {/* =================================================================== */}
        {showDocumentPreview && (
          <div className="bg-white rounded-xl border border-[#081F2D] p-8 shadow-md space-y-6 max-w-3xl mx-auto font-sans">
            {/* Document Header */}
            <div className="text-center border-b border-stone-800 pb-5 space-y-1">
              <div className="text-[10px] font-mono tracking-widest uppercase text-stone-500">
                গণপ্রজাতন্ত্রী বাংলাদেশ অনুমোদিত চুক্তি • PEOPLE'S REPUBLIC OF BANGLADESH
              </div>
              <div className="text-sm font-bold tracking-wider text-[#081F2D] uppercase">
                SOHAELTASNEEM FOUNDATION
              </div>
              <h2 className="text-lg font-bold text-[#081F2D]">{template.nameEn}</h2>
              <div className="text-xs font-semibold text-stone-700 font-sans">{template.nameBn}</div>
              <div className="text-[10px] font-mono text-stone-500 pt-1">
                Agreement ID: <span className="font-bold text-[#081F2D]">STFL-LSE-2026-PENDING</span> • Template: {template.id} ({template.version})
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 text-xs gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="font-bold text-stone-900 uppercase text-[10px] font-mono mb-1">
                  FIRST PARTY (প্রথম পক্ষ / LESSOR)
                </div>
                <div>{formInputs.lessorName}</div>
                <div className="text-stone-500 font-mono text-[10px]">NID/Reg: {formInputs.lessorNid}</div>
                <div className="text-stone-500 text-[10px]">{formInputs.lessorAddress}</div>
              </div>
              <div>
                <div className="font-bold text-stone-900 uppercase text-[10px] font-mono mb-1">
                  SECOND PARTY (দ্বিতীয় পক্ষ / LESSEE)
                </div>
                <div>{formInputs.lesseeName}</div>
                <div className="text-stone-500 font-mono text-[10px]">NID: {formInputs.lesseeNid}</div>
                <div className="text-stone-500 text-[10px]">{formInputs.lesseeAddress}</div>
              </div>
            </div>

            {/* Subject Matter & Tenure */}
            <div className="grid grid-cols-2 text-xs gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="font-bold text-stone-900 uppercase text-[10px] font-mono mb-1">PROPERTY / UNIT</div>
                <div>{formInputs.propertyCode} ({formInputs.unitCode})</div>
                <div className="text-stone-500 text-[10px]">{formInputs.propertyAddress}</div>
              </div>
              <div>
                <div className="font-bold text-stone-900 uppercase text-[10px] font-mono mb-1">TENURE & PURPOSE</div>
                <div>{tenureSummary}</div>
                <div className="text-stone-500 text-[10px]">Permitted Use: {formInputs.purpose}</div>
              </div>
            </div>

            {/* Financial Terms */}
            <div className="space-y-1 text-xs border-b border-stone-200 pb-4">
              <div className="font-bold text-stone-900 uppercase text-[10px] font-mono mb-1">FINANCIAL TERMS</div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-600">Monthly Rent:</span>
                <span className="font-mono font-bold text-[#081F2D]">৳{formInputs.rentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-600">Security Deposit:</span>
                <span className="font-mono font-semibold text-stone-800">৳{formInputs.securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-stone-600">Service Charge:</span>
                <span className="font-mono text-stone-800">৳{formInputs.serviceCharge.toLocaleString()}</span>
              </div>
            </div>

            {/* Governed Clauses Notice */}
            <div className="text-[11px] text-stone-600 leading-relaxed space-y-1">
              <div className="font-bold text-stone-800 uppercase text-[10px] font-mono">GOVERNED CLAUSES</div>
              <p>
                This agreement is governed by the standard ratified provisions of SohaelTasneem Foundation under {template.statutoryLaw}.
                The terms regarding quiet possession, timely payment, maintenance, utilities, notice, renewal, and dispute resolution remain immutable.
              </p>
              {formInputs.hasSpecialCondition && (
                <div className="p-2 bg-amber-50 text-amber-900 border border-amber-200 rounded mt-2">
                  <strong>Special Condition:</strong> {formInputs.specialTextBn}
                </div>
              )}
            </div>

            {/* Signature Blocks */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-xs border-t border-stone-300">
              <div className="text-center pt-8 border-t border-dashed border-stone-400">
                <div className="font-semibold">{formInputs.lessorName}</div>
                <div className="text-[10px] text-stone-400">Signature of First Party (Lessor)</div>
              </div>
              <div className="text-center pt-8 border-t border-dashed border-stone-400">
                <div className="font-semibold">{formInputs.lesseeName}</div>
                <div className="text-[10px] text-stone-400">Signature of Second Party (Lessee)</div>
              </div>
            </div>

            {/* Execution CTA */}
            <div className="pt-4 flex items-center justify-between border-t border-stone-200">
              <button
                onClick={() => setShowDocumentPreview(false)}
                className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
              >
                ← Back to Edit
              </button>

              <button
                onClick={handleExecuteAgreement}
                className="px-6 py-2.5 bg-[#081F2D] hover:bg-[#1A1A1A] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-xs"
              >
                <ShieldCheck width={15} height={15} className="text-[#FF6B35]" />
                <span>Execute & Cryptographically Sign</span>
              </button>
            </div>

            {/* Executed Result */}
            {executedDoc && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg space-y-2 text-xs font-mono">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <Check width={16} height={16} className="text-emerald-700" />
                  AGREEMENT EXECUTED & SEALED
                </div>
                <div>Code: <strong className="text-emerald-900">{executedDoc.agreementCode}</strong></div>
                <div className="text-[10px] text-stone-500 break-all">SHA-256: {executedDoc.sha256Hash}</div>
                <div className="text-[10px] text-stone-500">
                  Verification URL:{" "}
                  <a href={executedDoc.verificationUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline font-semibold">
                    {executedDoc.verificationUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
