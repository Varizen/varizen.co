import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { canonical } from "@/src/lib/domains";
import {
  Download,
  ShieldCheck,
  CheckCircle,
  Eye,
  Camera,
  Palette,
  Text,
  Page,
  ArrowRight,
  InfoCircle,
  Spark,
  Folder,
  Group,
  Heart,
  BookStack
} from "iconoir-react";

export const metadata: Metadata = {
  title: "Brand Center & Media Library — SohaelTasneem Foundation",
  description: "Official brand identity assets, color tokens, typography, and curated HD photography library of SohaelTasneem Foundation.",
  openGraph: {
    title: "Brand Center & Media Library — SohaelTasneem Foundation",
    description: "Official brand identity assets, color tokens, typography, and curated HD photography library of SohaelTasneem Foundation.",
    url: canonical("/brandcenter"),
    type: "website",
  },
};

const brandPhotos = [
  {
    id: "STFL-PHOTO-01",
    titleEn: "Community Cooperative Leadership",
    titleBn: "কমিউনিটি সমবায় নেতৃত্ব ও সিদ্ধান্ত গ্রহণ",
    category: "Women in Leadership",
    domain: "Community Development",
    location: "Bogura Sadar, Rajshahi Division",
    subject: "Rural cooperative chairperson reviewing field accounts in open veranda pavilion",
    src: "/media/community-leader.jpg",
    specs: "35mm Documentary Portrait • Natural Daylight • High Resolution",
    desc: "Capturing authentic community agency: a woman cooperative leader presiding over local micro-savings records with dignity, intelligence, and pride.",
  },
  {
    id: "STFL-PHOTO-02",
    titleEn: "Indigenous Textile Artisan & Cultural Mentor",
    titleBn: "ক্ষুদ্র নৃগোষ্ঠীর তাঁতশিল্পী ও ঐতিহ্যবাহী শিক্ষা",
    category: "Indigenous & Tribal Heritage",
    domain: "Inclusion & Heritage",
    location: "Bandarban, Chittagong Hill Tracts",
    subject: "Indigenous tribal master artisan operating traditional backstrap loom in bamboo courtyard",
    src: "/media/tribal-artisan.jpg",
    specs: "Cultural Documentary • Natural Hill Lighting • High Resolution",
    desc: "Representing ethnic diversity and tribal inclusion: an indigenous master weaver crafting traditional geometric textiles amidst the lush hill tracts of Bangladesh.",
  },
  {
    id: "STFL-PHOTO-03",
    titleEn: "Frontline Community Health Visitor",
    titleBn: "মাঠপর্যায়ের নারী স্বাস্থ্যকর্মী ও ডিজিটাল ডায়াগনস্টিক",
    category: "Healthcare Outreach",
    domain: "Healthcare",
    location: "Shyamnagar, Coastal Satkhira",
    subject: "Female community health worker consulting an elderly patient using a clinical tablet",
    src: "/media/health-worker.jpg",
    specs: "Field Clinical Action • Ambient Clinic Light • High Resolution",
    desc: "Modern humanitarian action in practice: a caring, equipped community healthcare worker reviewing digital patient records with warmth and precision.",
  },
  {
    id: "STFL-PHOTO-04",
    titleEn: "Foundational Literacy & Study Hub Mentor",
    titleBn: "প্রাথমিক শিক্ষা ও শিশু সাক্ষরতা মেন্টরিং",
    category: "Education & Literacy",
    domain: "Education",
    location: "Rampura Study Hub, Dhaka",
    subject: "Encouraging female educator reading with primary students in a sunlit classroom",
    src: "/media/literacy-teacher.jpg",
    specs: "Classroom Documentary • Golden Morning Fill • High Resolution",
    desc: "Empowering the next generation: a dedicated teacher guiding young girls through interactive Bengali literature in an open, bright study center.",
  },
  {
    id: "STFL-PHOTO-05",
    titleEn: "Agro-Cooperative Farmer in Paddy Field",
    titleBn: "উপকূলীয় নারী কৃষক ও টেকসই ধান উৎপাদন",
    category: "Rural Livelihoods",
    domain: "Agriculture",
    location: "Satkhira Coastal Polder",
    subject: "Resilient woman farmer inspecting saline-tolerant rice crops at golden hour",
    src: "/media/coastal-farmer.jpg",
    specs: "Golden Hour Field Portrait • Natural Sunset • High Resolution",
    desc: "Dignity in agriculture: a woman agricultural leader standing proudly in flourishing paddy fields, embodying climate resilience and food sovereignty.",
  },
  {
    id: "STFL-PHOTO-06",
    titleEn: "Master Nakshi Kantha Quilt Artisan",
    titleBn: "ঐতিহ্যবাহী নকশিকাঁথা শিল্পী ও নারীর স্বাবলম্বিতা",
    category: "Artisanal Crafts",
    domain: "Enterprise",
    location: "Jamalpur Artisan Guild",
    subject: "Senior artisan master hand-stitching intricate folk quilt motifs in courtyard",
    src: "/media/artisan-craft.jpg",
    specs: "Craft Heritage Portrait • Courtyard Daylight • High Resolution",
    desc: "Artisanal mastery and economic autonomy: a skilled craftswoman hand-stitching traditional motifs, converting cultural heritage into sustainable income.",
  },
];

const colorTokens = [
  { name: "Primary Dark", hex: "#081F2D", rgb: "rgb(8, 31, 45)", role: "Institutional anchor, primary typography, formal headers", text: "text-white" },
  { name: "Action Orange", hex: "#FF6B35", rgb: "rgb(255, 107, 53)", role: "Active triggers, interactive emphasis, primary CTAs", text: "text-white" },
  { name: "Charcoal", hex: "#1A1A1A", rgb: "rgb(26, 26, 26)", role: "Body text on light backgrounds, deep secondary elements", text: "text-white" },
  { name: "Snow", hex: "#FAFAF8", rgb: "rgb(250, 250, 248)", role: "Canvas background, section alternates, warm whitespace", text: "text-stone-800", border: true },
  { name: "Stone", hex: "#E7E7E2", rgb: "rgb(231, 231, 226)", role: "Hairline dividers, structural card borders, subtle gridlines", text: "text-stone-800", border: true },
  { name: "White", hex: "#FFFFFF", rgb: "rgb(255, 255, 255)", role: "Card foreground surfaces, modal dialogs, crisp contrast", text: "text-stone-800", border: true },
];

const logoAssets = [
  {
    name: "Primary Transparent Mark",
    bn: "মূল প্রাতিষ্ঠানিক চিহ্ন (স্বচ্ছ)",
    src: "/stfl-mark-transparent.png",
    format: "PNG / WebP",
    use: "Header, app icons, favicons, avatar stamps",
    bg: "bg-[#FAFAF8]",
  },
  {
    name: "Full Transparent Logo Lockup",
    bn: "পূর্ণ প্রাতিষ্ঠানিক লোগো (স্বচ্ছ)",
    src: "/stfl-logo-transparent.png",
    format: "PNG / High-Res",
    use: "Co-branding, institutional publications, letterheads",
    bg: "bg-[#FAFAF8]",
  },
  {
    name: "Original Foundation Mark",
    bn: "ঐতিহ্যবাহী ব্র্যান্ড সিল",
    src: "/stfl-original-logo.png",
    format: "PNG / Master",
    use: "Historical seals, certificates, master archives",
    bg: "bg-[#FAFAF8]",
  },
  {
    name: "Wordmark (Cream Contrast)",
    bn: "ওয়ার্ডমার্ক (ক্রিম ব্যাকগ্রাউন্ড)",
    src: "/stfl-wordmark-cream.png",
    format: "PNG / Vector Equivalent",
    use: "Editorial covers, publication jackets",
    bg: "bg-[#081F2D]",
    dark: true,
  },
  {
    name: "Wordmark (Pure White)",
    bn: "ওয়ার্ডমার্ক (সাদা)",
    src: "/stfl-wordmark-white.png",
    format: "PNG / Transparent",
    use: "Dark headers, video titles, footer badges",
    bg: "bg-[#081F2D]",
    dark: true,
  },
  {
    name: "Wordmark (Transparent Dark)",
    bn: "ওয়ার্ডমার্ক (কালো/ডার্ক)",
    src: "/stfl-wordmark-transparent.png",
    format: "PNG / High-Res",
    use: "White paper print, legal notices, formal reports",
    bg: "bg-[#FAFAF8]",
  },
];

const initiativeMarks = [
  {
    name: "GrihostiOS Mark",
    bn: "গৃহস্থী ওএস মার্ক",
    slug: "grihostios",
    src: "/media/grihostios-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL Operating Initiative",
    primaryColor: "#14532D",
  },
  {
    name: "SkillConnect Mark",
    bn: "স্কিলকানেক্ট মার্ক",
    slug: "skillconnect",
    src: "/media/skillconnect-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL Strategic Initiative",
    primaryColor: "#1E3A8A",
  },
  {
    name: "AEV Developments Mark",
    bn: "এইভি ডেভেলপমেন্টস মার্ক",
    slug: "aev-developments",
    src: "/media/aev-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL Portfolio Venture",
    primaryColor: "#78350F",
  },
  {
    name: "MaxRemit Mark",
    bn: "ম্যাক্সরেমিট মার্ক",
    slug: "maxremit",
    src: "/media/maxremit-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL Strategic Platform",
    primaryColor: "#065F46",
  },
  {
    name: "Helpex Mark",
    bn: "হেল্পেক্স মার্ক",
    slug: "helpex",
    src: "/media/helpex-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL-Supported Platform",
    primaryColor: "#854D0E",
  },
  {
    name: "Proiozon Master Logo",
    bn: "প্রয়োজন মাস্টার লোগো",
    slug: "proiozon",
    src: "/media/proiozon-logo.png",
    format: "PNG / Native Original",
    relationship: "STFL Digital Platform",
    primaryColor: "#EA580C",
  },
  {
    name: "Perlu Mark",
    bn: "পেরলু মার্ক",
    slug: "perlu",
    src: "/media/perlu-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL Portfolio Venture",
    primaryColor: "#0284C7",
  },
  {
    name: "OIIX Mark",
    bn: "ওইক্স মার্ক",
    slug: "oiix",
    src: "/media/oiix-logo.svg",
    format: "SVG / Vector",
    relationship: "STFL Digital Initiative",
    primaryColor: "#7C3AED",
  },
];

export default function BrandCenterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <Spark width={14} height={14} />
              <span>OFFICIAL ASSET REPOSITORY & MEDIA CENTER</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                  ব্র্যান্ড সেন্টার ও মিডিয়া লাইব্রেরি
                </span>
                <span>Brand Center & Media Library</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8">
                The authoritative portal for SohaelTasneem Foundation brand assets, verified HD documentary photography, typography guidelines, and design system tokens.
              </p>

              <div className="flex flex-wrap gap-3 text-xs font-mono">
                <a
                  href="#photography"
                  className="px-4 py-2 rounded-lg bg-[#FF6B35] text-white font-semibold hover:bg-[#e05a28] transition flex items-center gap-2"
                >
                  <Camera width={14} height={14} />
                  <span>HD Photography Library</span>
                </a>
                <a
                  href="#logos"
                  className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Download width={14} height={14} />
                  <span>Official Logo Assets</span>
                </a>
                <a
                  href="#colors"
                  className="px-4 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Palette width={14} height={14} />
                  <span>Color Tokens</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section 01: Curated HD Photography Library */}
        <section id="photography" className="py-20 border-b border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-wider mb-2">
                  <Camera width={14} height={14} />
                  <span>Curated High-Definition Photography</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-[#081F2D]">
                  Human Dignity & Community Agency Series
                </h2>
                <p className="text-sm text-stone-600 mt-2 max-w-2xl font-hind">
                  বাংলাদেশের প্রত্যন্ত অঞ্চলের নারী নেতৃত্ব, শিক্ষা, স্বাস্থ্যসেবা, কৃষি ও আদিবাসী সংস্কৃতির প্রামাণ্য উচ্চমানের আলোকচিত্র।
                </p>
              </div>

              <div className="text-xs font-mono text-stone-500 bg-[#FAFAF8] p-3 rounded-lg border border-[#E7E7E2]">
                <span className="font-semibold text-[#081F2D] block">Ethical Standard:</span>
                Zero poverty tropes • Complete human dignity • Authentic South Asian context
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brandPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="border border-[#E7E7E2] rounded-xl overflow-hidden bg-white hover:border-[#FF6B35]/40 transition-all shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Surface */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={photo.src}
                        alt={photo.titleEn}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#081F2D]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-mono">
                        {photo.category}
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-2">
                        <span>{photo.id}</span>
                        <span>{photo.domain}</span>
                      </div>

                      <h3 className="text-lg font-bold text-[#081F2D] mb-1 group-hover:text-[#FF6B35] transition-colors">
                        {photo.titleEn}
                      </h3>
                      <div className="font-hind text-xs font-semibold text-stone-600 mb-3">
                        {photo.titleBn}
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed mb-4">
                        {photo.desc}
                      </p>

                      <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-500 space-y-1">
                        <div><strong className="text-stone-700">Location:</strong> {photo.location}</div>
                        <div><strong className="text-stone-700">Specs:</strong> {photo.specs}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0">
                    <a
                      href={photo.src}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#FAFAF8] hover:bg-[#081F2D] text-[#081F2D] hover:text-white border border-[#E7E7E2] transition-colors text-xs font-semibold"
                    >
                      <span className="flex items-center gap-2">
                        <Download width={14} height={14} />
                        Download High-Res Original
                      </span>
                      <span className="text-[10px] font-mono opacity-80">JPG</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 02: Ethical Visual Standards */}
        <section className="py-16 bg-[#FAFAF8] border-b border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <div className="text-xs font-mono text-[#081F2D] uppercase tracking-wider mb-2">
                Representation Protocol
              </div>
              <h2 className="text-2xl font-bold text-[#081F2D]">
                Ethical Photography & Visual Safeguarding Principles
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                Rules governing all field media production, partner communications, and publications.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-[#E7E7E2]">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-mono font-bold text-xs mb-4">
                  01
                </div>
                <h3 className="font-bold text-sm text-[#081F2D] mb-1">Human Agency Over Victimhood</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Never depict people as passive victims of poverty. Frame individuals as active protagonists in their own community progress.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E7E7E2]">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-mono font-bold text-xs mb-4">
                  02
                </div>
                <h3 className="font-bold text-sm text-[#081F2D] mb-1">Indigenous & Cultural Integrity</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Accurately acknowledge indigenous community heritage (Chakma, Marma, Garo, Santal). Respect traditional textiles, customs, and names.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E7E7E2]">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-mono font-bold text-xs mb-4">
                  03
                </div>
                <h3 className="font-bold text-sm text-[#081F2D] mb-1">Child & Vulnerable Adult Safety</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Zero photography without informed guardian consent. No identifiable images of vulnerable patients or distress situations.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#E7E7E2]">
                <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] flex items-center justify-center font-mono font-bold text-xs mb-4">
                  04
                </div>
                <h3 className="font-bold text-sm text-[#081F2D] mb-1">Natural, Unmanipulated Light</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Avoid extreme artificial color saturation or staged emotional sets. Prefer real environmental lighting, 35mm film discipline, and honest framing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Official Logo Assets & Marks */}
        <section id="logos" className="py-20 border-b border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-wider mb-2">
                  <ShieldCheck width={14} height={14} />
                  <span>Approved Marks</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#081F2D]">
                  Official Logo Suite & Assets
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Master institutional assets in vector-ready and high-resolution raster formats.
                </p>
              </div>
              <div className="text-xs font-mono text-stone-500">
                Rule: Never redraw, distort, recolor, or modify official logo ratios.
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logoAssets.map((logo, idx) => (
                <div
                  key={idx}
                  className="border border-[#E7E7E2] rounded-xl overflow-hidden bg-white flex flex-col justify-between"
                >
                  <div className={`${logo.bg} p-8 flex items-center justify-center min-h-[180px] border-b border-[#E7E7E2]/60`}>
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={160}
                      height={160}
                      className="max-h-24 w-auto object-contain"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#081F2D]">{logo.name}</div>
                      <div className="font-hind text-xs text-stone-500 mb-2">{logo.bn}</div>
                      <p className="text-[11px] text-stone-600 mb-4 leading-relaxed">
                        <strong className="text-stone-700">Usage:</strong> {logo.use}
                      </p>
                    </div>

                    <a
                      href={logo.src}
                      download
                      className="inline-flex items-center justify-between w-full px-3 py-2 rounded bg-[#FAFAF8] hover:bg-[#081F2D] text-[#081F2D] hover:text-white border border-[#E7E7E2] transition text-xs font-semibold"
                    >
                      <span className="flex items-center gap-1.5">
                        <Download width={12} height={12} />
                        Download Asset
                      </span>
                      <span className="font-mono text-[10px] opacity-70">{logo.format}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 03.5: Approved Ecosystem Initiative Marks & Co-Branding Governance */}
        <section id="initiatives-branding" className="py-20 border-b border-[#E7E7E2] bg-[#FAFAF8]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#14532D] uppercase tracking-wider mb-2">
                  <ShieldCheck width={14} height={14} />
                  <span>Ecosystem Brand Governance</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#081F2D]">
                  Native Initiative Marks & Co-Branding Rules
                </h2>
                <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
                  Every STFL project preserves its authentic native identity. Never merge native initiative logos into a generic STFL lockup without approved governance.
                </p>
              </div>
              <Link
                href="/initiatives"
                className="text-xs font-mono font-bold text-[#FF6B35] hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View Full Initiatives Directory &rarr;</span>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {initiativeMarks.map((mark, idx) => (
                <div
                  key={idx}
                  className="border border-[#E7E7E2] bg-white flex flex-col justify-between hover:border-[#081F2D]/40 transition shadow-xs"
                >
                  <div className="p-6 flex items-center justify-center min-h-[140px] bg-[#FAFAF8] border-b border-[#E7E7E2]">
                    <Image
                      src={mark.src}
                      alt={mark.name}
                      width={120}
                      height={48}
                      className="max-h-12 w-auto object-contain"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#081F2D]">{mark.name}</div>
                      <div className="font-hind text-xs text-stone-500 mb-2">{mark.bn}</div>
                      <span className="inline-block text-[10px] font-mono px-2 py-0.5 border text-stone-600 bg-stone-50 mb-3">
                        {mark.relationship}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-stone-400">{mark.format}</span>
                      <Link
                        href={`/initiatives/${mark.slug}`}
                        className="text-[#081F2D] font-bold hover:text-[#FF6B35] flex items-center gap-1"
                      >
                        <span>Project</span>
                        <ArrowRight width={12} height={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Co-Branding Governance Principles Card */}
            <div className="p-6 sm:p-8 bg-white border border-[#E7E7E2] max-w-4xl">
              <h3 className="text-sm font-bold font-mono text-[#081F2D] uppercase tracking-wider mb-2">
                Mandatory Co-Branding Lockup Rule
              </h3>
              <p className="text-xs text-stone-600 font-hind leading-relaxed mb-4">
                When displaying initiative branding in public media, marketing materials, or partner documents, the project mark must stand alone in its native colors and typography. The relationship to STFL must be stated via the governed secondary attribution:
              </p>
              <div className="p-4 bg-[#FAFAF8] border border-[#E7E7E2] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                <span className="text-[#081F2D] font-bold">[PROJECT NATIVE MARK]</span>
                <span className="text-stone-400">+</span>
                <span className="text-[#5A6B75]">"A project of SohaelTasneem Foundation"</span>
                <span className="text-stone-400">+</span>
                <span className="text-[#14532D] font-bold">stflbd.org/initiatives/[slug]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 04: Color Palette Swatches */}
        <section id="colors" className="py-20 border-b border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-wider mb-2">
                <Palette width={14} height={14} />
                <span>Color Palette</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#081F2D]">
                Core Chromatic System
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                Engineered for serene institutional gravitas, high accessibility contrast, and purposeful action accents.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {colorTokens.map((color, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E7E7E2] overflow-hidden bg-white shadow-xs"
                >
                  <div
                    className="h-28 flex items-end p-4"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className={`font-mono text-sm font-bold ${color.text}`}>
                      {color.hex}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="text-sm font-bold text-[#081F2D] mb-1">{color.name}</div>
                    <div className="font-mono text-[11px] text-stone-400 mb-2">{color.rgb}</div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {color.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 05: Typography Specifications */}
        <section id="typography" className="py-20 bg-[#FAFAF8] border-b border-[#E7E7E2]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-12">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#081F2D] uppercase tracking-wider mb-2">
                <Text width={14} height={14} />
                <span>Typographic Foundations</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#081F2D]">
                Dual First-Class Bilingual Typefaces
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                Explicit pairings ensuring flawless conjunct rendering, readable vowel diacritics, and harmonious English-Bengali visual pacing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl border border-[#E7E7E2] space-y-4">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  BENGALI HEADINGS & TITLES
                </span>
                <div className="font-hind text-2xl font-bold text-[#081F2D]">
                  হিন্দ শিলিগুড়ি (Hind Siliguri)
                </div>
                <p className="font-hind text-sm text-stone-600 leading-relaxed">
                  সবচেয়ে সুস্পষ্ট ও দৃষ্টিগ্রাহ্য বাংলা টাইপোগ্রাফি। যুক্তাক্ষর এবং জটিল শব্দগুচ্ছের সাবলীল উপস্থাপনার জন্য এটি প্রাতিষ্ঠানিক শিরোনামে ব্যবহৃত হয়।
                </p>
                <div className="font-mono text-xs text-stone-400 pt-2 border-t border-stone-100">
                  Weights: SemiBold (600), Bold (700)
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-[#E7E7E2] space-y-4">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  BENGALI BODY & EDITORIAL TEXT
                </span>
                <div className="font-noto text-2xl font-bold text-[#081F2D]">
                  নোটো সানস বাংলা (Noto Sans Bengali)
                </div>
                <p className="font-noto text-sm text-stone-600 leading-relaxed">
                  অনলাইন পাঠযোগ্যতার জন্য সর্বোচ্চ উপযোগী ফন্ট। পর্যাপ্ত লাইন-হাইট (১.৬৫) সহকারে দীর্ঘ অনুচ্ছেদ ও নথিপত্রের জন্য বাধ্যতামূলক।
                </p>
                <div className="font-mono text-xs text-stone-400 pt-2 border-t border-stone-100">
                  Weights: Regular (400), Medium (500)
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-[#E7E7E2] space-y-4">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  ENGLISH HEADINGS & EDITORIAL
                </span>
                <div className="text-2xl font-bold text-[#081F2D] font-sans">
                  Inter
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Modern grotesque geometric typeface with exceptional legibility across mobile screens and high-DPI displays.
                </p>
                <div className="font-mono text-xs text-stone-400 pt-2 border-t border-stone-100">
                  Weights: Regular (400), SemiBold (600), Bold (700)
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-[#E7E7E2] space-y-4">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  TECHNICAL CODE, METRICS & IDS
                </span>
                <div className="font-mono text-xl font-bold text-[#081F2D]">
                  JetBrains Mono
                </div>
                <p className="text-sm text-stone-600 leading-relaxed font-mono">
                  STFL-DOC-2026-X892 • SEC-NODE-01 • 8K_RAW
                </p>
                <div className="font-mono text-xs text-stone-400 pt-2 border-t border-stone-100">
                  Weights: Regular (400), Medium (500)
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 06: Press & Media Kit */}
        <section id="downloads" className="py-16 bg-[#081F2D] text-white">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="text-xs font-mono text-[#FF6B35] uppercase tracking-wider block mb-1">
                Official Press & Media Kit
              </span>
              <h3 className="text-2xl font-bold">Need official brand assets for press or publication?</h3>
              <p className="text-xs text-stone-300 mt-2 max-w-xl">
                Download the complete media package containing high-resolution logos, vector lockups, brand color palettes, and editorial press releases.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/brand"
                className="px-5 py-2.5 rounded-lg border border-white/20 text-xs font-semibold hover:bg-white/10 transition"
              >
                Detailed Brand Guidelines
              </Link>
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg bg-[#FF6B35] text-white text-xs font-semibold hover:bg-[#e05a28] transition"
              >
                Media Inquiries & Press Desk
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
