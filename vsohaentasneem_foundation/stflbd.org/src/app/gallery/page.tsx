import type { Metadata } from "next";
import { canonical } from "@/src/lib/domains";
import Link from "next/link";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Camera,
  ShieldCheck,
  CheckCircle,
  Eye,
  Download,
  Pin,
  ArrowRight,
  InfoCircle
} from "iconoir-react";

export const metadata: Metadata = {
  title: "Visual Impact Gallery — SohaelTasneem Foundation",
  description: "High-resolution photographic evidence of field work, community resilience, and completed development projects.",
  openGraph: {
    title: "Visual Impact Gallery — SohaelTasneem Foundation",
    description: "High-resolution photographic evidence of field work, community resilience, and completed development projects.",
    url: canonical("/gallery"),
    type: "website",
  },
};

const galleryItems = [
  {
    id: "GAL-01",
    titleEn: "Community Cooperative Leadership",
    titleBn: "কমিউনিটি সমবায় নেতৃত্ব",
    category: "Community Development",
    location: "Bogura Sadar, Rajshahi",
    src: "/media/community-leader.jpg",
    descEn: "A woman cooperative leader presiding over local micro-savings records with dignity and strategic agency.",
    descBn: "গ্রামীণ সঞ্চয় ও ক্ষুদ্র উদ্যোক্তা কর্মসূচির পরিচালনা ও হিসাব নিরীক্ষা করছেন সমবায় প্রধান।",
  },
  {
    id: "GAL-02",
    titleEn: "Indigenous Textile Artisan & Cultural Mentor",
    titleBn: "ক্ষুদ্র নৃগোষ্ঠীর তাঁতশিল্পী ও ঐতিহ্যবাহী শিক্ষা",
    category: "Indigenous Inclusion",
    location: "Bandarban, Chittagong Hill Tracts",
    src: "/media/tribal-artisan.jpg",
    descEn: "Preserving indigenous cultural heritage and tribal livelihoods through traditional backstrap loom craft.",
    descBn: "পার্বত্য চট্টগ্রামের ঐতিহ্যবাহী কোমর তাঁতে বস্ত্র বুনন এবং ক্ষুদ্র নৃগোষ্ঠীর অর্থনৈতিক স্বাবলম্বিতা।",
  },
  {
    id: "GAL-03",
    titleEn: "Frontline Community Health Visitor",
    titleBn: "মাঠপর্যায়ের নারী স্বাস্থ্যকর্মী ও ডায়াগনস্টিক",
    category: "Healthcare",
    location: "Shyamnagar, Satkhira",
    src: "/media/health-worker.jpg",
    descEn: "Equipped female community health worker conducting digital diagnostic triage in a village clinic.",
    descBn: "উপকূলীয় স্বাস্থ্যকেন্দ্রে আধুনিক ডিজিটাল ট্যাবলেটের মাধ্যমে প্রবীণ রোগীর স্বাস্থ্য পরীক্ষা ও ট্রায়াজ।",
  },
  {
    id: "GAL-04",
    titleEn: "Foundational Literacy & Study Hub Mentor",
    titleBn: "প্রাথমিক শিক্ষা ও শিশু সাক্ষরতা মেন্টরিং",
    category: "Education",
    location: "Rampura Study Hub, Dhaka",
    src: "/media/literacy-teacher.jpg",
    descEn: "Dedicated female teacher fostering reading confidence and active learning among young primary students.",
    descBn: "উন্মুক্ত শ্রেণীকক্ষে আনন্দময় পরিবেশে শিশুদের মাতৃভাষায় সাবলীল পাঠদান কর্মসূচি।",
  },
  {
    id: "GAL-05",
    titleEn: "Agro-Cooperative Farmer in Paddy Field",
    titleBn: "উপকূলীয় নারী কৃষক ও টেকসই ধান উৎপাদন",
    category: "Agriculture",
    location: "Satkhira Coastal Polder",
    src: "/media/coastal-farmer.jpg",
    descEn: "A resilient woman agricultural leader inspecting saline-tolerant crops in coastal fields during golden hour.",
    descBn: "লবণাক্ততা সহনশীল জাতের ধান চাষে সফল নারী কৃষক, খাদ্য নিরাপত্তা ও জলবায়ু অভিযোজন।",
  },
  {
    id: "GAL-06",
    titleEn: "Master Nakshi Kantha Quilt Artisan",
    titleBn: "ঐতিহ্যবাহী নকশিকাঁথা শিল্পী ও নারীর স্বাবলম্বিতা",
    category: "Enterprise",
    location: "Jamalpur Artisan Guild",
    src: "/media/artisan-craft.jpg",
    descEn: "Master artisan hand-stitching intricate folk quilt motifs, transforming traditional craftsmanship into sustainable livelihood.",
    descBn: "হাতে বোনা ঐতিহ্যবাহী নকশিকাঁথা তৈরির মাধ্যমে গ্রামীণ নারীদের অর্থনৈতিক সাবলম্বিতা অর্জন।",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-1">
        {/* Editorial Hero Header */}
        <section className="bg-[#081F2D] text-white py-16 md:py-24 border-b border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FF6B35] tracking-wider mb-6">
              <Camera width={14} height={14} />
              <span>AUTHENTIC FIELD PHOTOGRAPHY</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                <span className="block font-hind text-2xl md:text-3xl font-semibold text-stone-200 mb-2">
                  চিত্রশালা ও প্রামাণ্য আলোকচিত্র
                </span>
                <span>Visual Impact Gallery</span>
              </h1>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                Authentic, high-definition photographic evidence of SohaelTasneem Foundation programs across Bangladesh: human agency, women leadership, indigenous inclusion, and community resilience.
              </p>
            </div>
          </div>
        </section>

        {/* Safeguarding Banner */}
        <section className="bg-[#FAFAF8] border-b border-[#E7E7E2] py-6">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck width={16} height={16} className="text-emerald-600" />
              <span>All photographs taken with full informed consent and strict adherence to STFL dignitarian guidelines.</span>
            </div>
            <Link
              href="/brandcenter"
              className="font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
            >
              <span>Visit Official Brand Center</span>
              <ArrowRight width={12} height={12} />
            </Link>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 md:py-24">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-[#E7E7E2] rounded-xl overflow-hidden bg-white hover:border-[#FF6B35]/40 transition-all shadow-sm flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={item.src}
                        alt={item.titleEn}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#081F2D]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-mono">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-2">
                        <span>{item.id}</span>
                        <span className="flex items-center gap-1 text-stone-600">
                          <Pin width={10} height={10} />
                          {item.location}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#081F2D] mb-1">
                        {item.titleEn}
                      </h3>
                      <div className="font-hind text-xs font-semibold text-stone-600 mb-3">
                        {item.titleBn}
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed mb-3">
                        {item.descEn}
                      </p>
                      <p className="font-hind text-xs text-stone-500 leading-relaxed">
                        {item.descBn}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <a
                      href={item.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between w-full px-4 py-2 rounded-lg bg-[#FAFAF8] hover:bg-[#081F2D] text-[#081F2D] hover:text-white border border-[#E7E7E2] transition text-xs font-semibold"
                    >
                      <span>View Full Resolution</span>
                      <Eye width={12} height={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Call to Action */}
        <section className="bg-[#081F2D] text-white py-12 border-t border-[#0B2B43]">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold">Looking for Press & Publication Assets?</h3>
              <p className="text-xs text-stone-300 mt-1">
                Access official logos, vector brand marks, color codes, and authorized media packs in the STFL Brand Center.
              </p>
            </div>
            <Link
              href="/brandcenter"
              className="px-6 py-3 rounded-lg bg-[#FF6B35] text-white text-xs font-semibold hover:bg-[#e05a28] transition flex items-center gap-2 shrink-0"
            >
              <span>Explore STFL Brand Center</span>
              <ArrowRight width={14} height={14} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
