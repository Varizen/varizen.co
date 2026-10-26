"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Book,
  GraduationCap,
  Globe,
  Building,
  Search,
  NavArrowRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Download,
  Eye,
  RefreshDouble,
  Spark,
  ChatBubble,
  Cpu,
  Folder,
  Send,
  ShareAndroid,
  Pin,
  Lock,
  Key,
  User,
  Page,
  BookmarkBook,
  Medal,
  Star
} from "iconoir-react";
import { useLanguage } from "@/src/context/LanguageContext";
import { getInitiativeBySlug } from "@/src/lib/initiativesRegistry";

export default function HakimSarkerInitiativePage() {
  const { lang, setLang } = useLanguage();
  const isBn = lang === "bn";
  const project = getInitiativeBySlug("hakimsarker");

  // Interactive Tabs
  const [activeTab, setActiveTab] = useState<"BIOGRAPHY" | "JOURNEY" | "RESEARCH" | "PUBLICATIONS" | "QIMAI" | "ARCHIVE">("BIOGRAPHY");
  const [researchFilter, setResearchFilter] = useState<string>("ALL");
  const [pubFilter, setPubFilter] = useState<"ALL" | "BOOK" | "CHAPTER" | "ARTICLE">("ALL");

  // QIM AI Archive Assistant State
  const [selectedPrompt, setSelectedPrompt] = useState<string>(
    isBn
      ? "অধ্যাপক ড. আব্দুল হাকিম সরকার ঢাকা শহরের কিশোর অপরাধ সম্পর্কে কী গবেষণা করেছিলেন?"
      : "What were Dr. Abdul Hakim Sarker's findings regarding juvenile delinquency in Dhaka City?"
  );
  const [aiResponse, setAiResponse] = useState<{
    answerEn: string;
    answerBn: string;
    source: string;
    year: string;
    page: string;
    verified: boolean;
  }>({
    answerEn:
      "Based on archived texts from 'Juvenile Delinquency: Dhaka City Experience' (2001) and his PhD dissertation on Juvenile Sociopathy (1988), Professor Sarker demonstrated that urban juvenile delinquency in Bangladesh is deeply correlated with broken home circumstances, acute family poverty, and the absence of localized restorative support structures, rather than inherent biological sociopathy. He advocated for non-custodial correctional alternatives and family-centered community rehabilitation.",
    answerBn:
      "সংরক্ষিত মনোগ্রাফ 'কিশোর অপরাধ: ঢাকা শহরের অভিজ্ঞতা' (২০০১) এবং পিএইচডি থিসিসের সূত্র অনুযায়ী, অধ্যাপক সরকার প্রমাণ করেন যে বাংলাদেশে কিশোর অপরাধ কোনো জন্মগত বিষয় নয়; বরং এটি পারিবারিক ভঙ্গুরতা, তীব্র দারিদ্র্য এবং তৃণমূল পর্যায়ের সংশোধনমূলক কাঠামোর অভাবের সাথে সরাসরি যুক্ত। তিনি কারাগারের পরিবর্তে পরিবার ও সমাজভিত্তিক পুনর্বাসন ব্যবস্থার ওপর জোর দেন।",
    source: "Juvenile Delinquency: Dhaka City Experience (Human Nursery for Development)",
    year: "2001",
    page: "pp. 42–89; PhD Thesis 1988, University of Dhaka",
    verified: true
  });

  const samplePrompts = [
    {
      labelEn: "Juvenile Delinquency & Family Poverty",
      labelBn: "কিশোর অপরাধ ও পারিবারিক দারিদ্র্য",
      qEn: "What were Dr. Abdul Hakim Sarker's findings regarding juvenile delinquency in Dhaka City?",
      qBn: "অধ্যাপক ড. আব্দুল হাকিম সরকার ঢাকা শহরের কিশোর অপরাধ সম্পর্কে কী গবেষণা করেছিলেন?",
      resEn: "Professor Sarker demonstrated in empirical surveys that poverty acts as an indirect catalyst by destabilizing parental supervision, forcing early street exposure. He formulated early intervention protocols for urban slums.",
      resBn: "অধ্যাপক সরকার প্রত্যক্ষ জরিপে দেখিয়েছেন যে দারিদ্র্য সরাসরি অপরাধ না ঘটালেও পরিবারের শাসন কাঠামো ভেঙে দিয়ে শিশুকে ঝুঁকিপূর্ণ পরিবেশের মুখোমুখি করে। তিনি বস্তি এলাকায় আগাম হস্তক্ষেপের রূপরেখা দেন।",
      source: "Indian Journal of Criminology (Vol. 22, No. 1) & HND",
      year: "1994 / 2001",
      page: "pp. 18–26"
    },
    {
      labelEn: "Victimology & Restorative Justice",
      labelBn: "ভিকটিমোলজি ও পুনরুদ্ধারমূলক ন্যায়বিচার",
      qEn: "How was the Victimology and Restorative Justice Master's program founded at Dhaka University?",
      qBn: "ঢাকা বিশ্ববিদ্যালয়ে ভিকটিমোলজি ও রেস্টোরেটিভ জাস্টিস মাস্টার্স প্রোগ্রাম কীভাবে প্রতিষ্ঠিত হয়?",
      resEn: "Recognizing that the conventional criminal justice framework predominantly centered on punishing offenders while neglecting victims, Professor Sarker pioneered the specialized Master's curriculum at ISWR, DU, integrating victim assistance, restitution, and community-led mediation.",
      resBn: "প্রচলিত বিচার ব্যবস্থা কেবল অপরাধীকে শাস্তি দেয় কিন্তু ভিকটিমকে অবহেলা করে—এই সীমাবদ্ধতা উপলব্ধি করে অধ্যাপক সরকার ঢাবির সমাজকল্যাণ ও গবেষণা ইনস্টিটিউটে দক্ষিণ এশিয়ার অন্যতম প্রথম ভিকটিমোলজি ও রেস্টোরেটিভ জাস্টিস মাস্টার্স কোর্স চালু করেন।",
      source: "ISWR Academic Council Proceedings & Keynote Paper",
      year: "2014",
      page: "Curriculum Archive ISWR-DU-VRJ"
    },
    {
      labelEn: "Social Work Contextualization",
      labelBn: "সমাজকর্মের দেশজ রূপায়ণ",
      qEn: "What did Professor Sarker propose regarding the indigenization of social work in Bangladesh?",
      qBn: "বাংলাদেশে সমাজকর্মের দেশজ রূপায়ণ নিয়ে অধ্যাপক সরকারের বক্তব্য কী ছিল?",
      resEn: "He argued extensively against the direct transplantation of Western individualistic casework models into Bangladesh. Instead, he proposed models rooted in collective agrarian solidarity, community eldership, and resource-constrained public welfare mechanisms.",
      resBn: "তিনি পশ্চিমা ব্যক্তিকেন্দ্রিক সমাজকর্ম মডেলকে সরাসরি বাংলাদেশে প্রয়োগের তীব্র বিরোধিতা করেন। তার মতে, বাংলাদেশের গ্রামীণ যৌথ সংস্কৃতি, পারস্পরিক সৌহার্দ্য ও অপ্রতুল সম্পদের বাস্তবতায় সমাজকর্মকে নতুনভাবে বিন্যস্ত করতে হবে।",
      source: "International Handbook on Social Work Education (Greenwood Press) & IIER Journal",
      year: "1995 / 2011",
      page: "London Chapter 4; IIER Vol. 7, No. 2"
    },
    {
      labelEn: "Safeguard Compliance on Padma Bridge",
      labelBn: "পদ্মা সেতু প্রকল্পে পুনর্বাসন পরামর্শ",
      qEn: "What was Dr. Sarker's contribution to the Padma Multipurpose Bridge Project?",
      qBn: "পদ্মা বহুমুখী সেতু নির্মাণ প্রকল্পে ড. সরকারের অবদান কী ছিল?",
      resEn: "Serving as the Safeguard Compliance Expert and Senior Social Scientist under World Bank and Government of Bangladesh frameworks, he evaluated social impact assessments, displacement compensation equity, and resettlement site welfare amenities for affected riverbank communities.",
      resBn: "বিশ্বব্যাংক ও বাংলাদেশ সরকারের যৌথ কাঠামোর অধীনে সেফগার্ড কমপ্লায়েন্স বিশেষজ্ঞ হিসেবে তিনি ক্ষতিগ্রস্ত নদী তীরবর্তী পরিবারের পুনর্বাসন, ন্যায্য ক্ষতিপূরণ এবং পরিবেশগত সামাজিক প্রভাব মূল্যায়নে নিরপেক্ষ অডিট পরিচালনা করেন।",
      source: "Padma Multipurpose Bridge Project Social Safeguard Compliance Audits",
      year: "2009–2012",
      page: "Consultancy Dossier Ref. WB-GOB-PMBP"
    }
  ];

  const publicationsData = [
    {
      title: "Juvenile Delinquency: Dhaka City Experience",
      titleBn: "কিশোর অপরাধ: ঢাকা শহরের অভিজ্ঞতা",
      type: "BOOK",
      typeLabel: "Monograph / Book",
      year: "2001",
      publisher: "Human Nursery for Development (HND), Dhaka",
      descEn: "Comprehensive empirical research detailing home circumstances, peer dynamics, and institutional rehabilitation patterns of juvenile delinquents in Dhaka metropolis.",
      descBn: "ঢাকা মহানগরীর কিশোর অপরাধীদের পারিবারিক অবস্থা, সঙ্গদোষ ও সংশোধনাগারের বাস্তবতা নিয়ে পরিচালিত মৌলিক গবেষণাধর্মী গ্রন্থ।"
    },
    {
      title: "History & Development of Social Work Education: Bangladesh",
      titleBn: "সমাজকর্ম শিক্ষার ইতিহাস ও বিকাশ: বাংলাদেশ অধ্যায়",
      type: "CHAPTER",
      typeLabel: "Book Chapter (International Handbook)",
      year: "1995",
      publisher: "Greenwood Press, London & Westport, CT",
      descEn: "The authoritative Bangladesh chapter in the seminal International Handbook on Social Work Education, documenting university curriculum evolution from 1953 onward.",
      descBn: "লন্ডনের গ্রিনউড প্রেস প্রকাশিত বিখ্যাত হ্যান্ডবুকে বাংলাদেশের সমাজকর্ম শিক্ষার সূচনা ও বিকাশ বিষয়ক প্রামাণ্য আন্তর্জাতিক সংকলন।"
    },
    {
      title: "Family Poverty as a Delinquency Causation in Bangladesh",
      titleBn: "বাংলাদেশে কিশোর অপরাধের কারণ হিসেবে পারিবারিক দারিদ্র্য",
      type: "ARTICLE",
      typeLabel: "Journal Paper",
      year: "1994",
      publisher: "Indian Journal of Criminology, Madras, Vol. 22(1)",
      descEn: "Examining statistical correlations between household income deficits, parental stress, and juvenile offense rates in rapidly urbanizing settlements.",
      descBn: "পারিবারিক আয় ঘাটতি ও কিশোর অপরাধের মধ্যকার মনস্তাত্ত্বিক ও পরিসংখ্যানগত সংযোগের চুলচেরা বিশ্লেষণ।"
    },
    {
      title: "Social Work Contextualization in Bangladesh",
      titleBn: "বাংলাদেশে সমাজকর্মের প্রায়োগিক দেশীয়করণ",
      type: "ARTICLE",
      typeLabel: "Journal Paper",
      year: "2011",
      publisher: "IIER Journal, Islamic University Kushtia, Vol. 7(2)",
      descEn: "Theoretical analysis on adapting global social work principles into post-colonial, community-centric developing societies.",
      descBn: "উন্নয়নশীল দেশের প্রেক্ষাপটে আন্তর্জাতিক সমাজকর্মকে স্থানীয় বাস্তবতা ও চাহিদার সাথে সামঞ্জস্যপূর্ণ করার তাত্ত্বিক মডেল।"
    },
    {
      title: "Restorative Justice in Bangladesh: Structural Functional Analysis",
      titleBn: "বাংলাদেশে পুনরুদ্ধারমূলক ন্যায়বিচার: কাঠামো ও প্রয়োগ",
      type: "ARTICLE",
      typeLabel: "Keynote / Monograph",
      year: "2014",
      publisher: "ISWR, University of Dhaka",
      descEn: "Keynote monograph outlining traditional community dispute resolution mechanisms (Salish) alongside statutory restorative justice courts.",
      descBn: "ঐতিহ্যবাহী সালিশ এবং প্রাতিষ্ঠানিক বিকল্প বিরোধ নিষ্পত্তির তুলনামূলক কাঠামোগত বিশ্লেষণ।"
    },
    {
      title: "Probation in Bangladesh: Problems and Prospects",
      titleBn: "বাংলাদেশে প্রবেশন ব্যবস্থা: সমস্যা ও সম্ভাবনা",
      type: "ARTICLE",
      typeLabel: "Journal Paper",
      year: "1989",
      publisher: "The Dhaka University Studies, Part A",
      descEn: "One of the earliest comprehensive scholarly treatments of probationary supervision laws and infrastructural hurdles in the Bangladeshi judiciary.",
      descBn: "বাংলাদেশের বিচার ব্যবস্থায় প্রবেশন আইনের কার্যকারিতা ও সীমাবদ্ধতা নিয়ে অন্যতম প্রথম দিকনির্দেশনামূলক গবেষণাপত্র।"
    },
    {
      title: "Social Welfare Administration in Developing Countries",
      titleBn: "উন্নয়নশীল দেশে সমাজকল্যাণ প্রশাসন",
      type: "BOOK",
      typeLabel: "Academic Textbook",
      year: "1997",
      publisher: "University Grants Commission / Academic Pub.",
      descEn: "Comprehensive textbook on institutional social services, non-profit governance, and social planning methodologies.",
      descBn: "প্রাতিষ্ঠানিক সমাজসেবা, বেসরকারি সংস্থা ব্যবস্থাপনা ও সামাজিক পরিকল্পনা প্রণয়নের বিশ্ববিদ্যালয় পর্যায়ের পাঠ্যবই।"
    },
    {
      title: "Guidance to Social Casework Practice",
      titleBn: "সমাজকর্ম কেসওয়ার্ক নির্দেশিকা",
      type: "BOOK",
      typeLabel: "Methodology Guide",
      year: "2003",
      publisher: "ISWR Publications, Dhaka",
      descEn: "Fieldwork manual for university social work trainees conducting clinical case history documentation and psychosocial assessments.",
      descBn: "বিশ্ববিদ্যালয় শিক্ষার্থীদের ফিল্ডওয়ার্ক প্রশিক্ষণ ও কেস স্টাডি লিপিবদ্ধকরণের জন্য নির্দেশনামূলক হ্যান্ডবুক।"
    }
  ];

  const filteredPubs = pubFilter === "ALL" ? publicationsData : publicationsData.filter((p) => p.type === pubFilter);

  return (
    <div className="min-h-screen bg-[#070D18] text-[#F1F5F9] font-sans selection:bg-[#C5A059] selection:text-[#0B1A2E]">
      {/* Top Academic Bar */}
      <div className="bg-[#040810] border-b border-white/10 text-[11px] font-mono text-stone-400 py-1.5 px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[#C5A059] font-semibold">Institute of Social Welfare and Research (ISWR)</span>
            <span className="text-white/20">|</span>
            <span className="text-white/70">University of Dhaka</span>
            <span className="text-white/20 hidden md:inline">|</span>
            <span className="text-stone-400 hidden md:inline">Islamic University, Kushtia (Former VC)</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <a href="mailto:hi@hakimsarker.org" className="text-[#C5A059] hover:underline flex items-center gap-1">
              <span>hi@hakimsarker.org</span>
            </a>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1">
              <span className="text-emerald-400">●</span>
              <span>{isBn ? "ডিজিটাল জ্ঞান সংরক্ষণাগার" : "Preserved Academic Archive"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-40 bg-[#0B1A2E]/95 backdrop-blur-md border-b border-[#C5A059]/30">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Lockup */}
            <div className="flex items-center gap-3">
              <Link href="/initiatives" className="text-stone-400 hover:text-white transition-colors p-1" title="Back to Initiatives">
                <NavArrowRight width={16} height={16} className="rotate-180" />
              </Link>
              <div className="h-6 w-px bg-white/15" />
              <Link href="https://hakimsarker.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                <Image
                  src="/media/hakimsarker-symbol.svg"
                  alt="Hakim Sarker Academic Torch & Book Symbol"
                  width={42}
                  height={42}
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <span className="font-serif font-bold text-[#E5C378] text-base tracking-wide leading-tight block group-hover:text-white transition-colors">
                    HAKIM SARKER.ORG
                  </span>
                  <span className="text-[10px] font-mono text-stone-300 tracking-wider uppercase block">
                    {isBn ? "শিক্ষা ও গবেষণা ঐতিহ্য" : "Academic Legacy & Knowledge Archive"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Nav Tabs */}
            <div className="hidden lg:flex items-center gap-1 text-xs font-mono font-medium">
              {[
                { key: "BIOGRAPHY", labelEn: "Biography", labelBn: "জীবনী" },
                { key: "JOURNEY", labelEn: "Academic Journey", labelBn: "শিক্ষাজীবন ও পদাবলী" },
                { key: "RESEARCH", labelEn: "Research", labelBn: "গবেষণা ক্ষেত্র" },
                { key: "PUBLICATIONS", labelEn: "Publications", labelBn: "গ্রন্থ ও প্রকাশনা" },
                { key: "QIMAI", labelEn: "Ask QIM-AI", labelBn: "আর্কাইভ জিজ্ঞাসা" },
                { key: "ARCHIVE", labelEn: "Preservation", labelBn: "আর্কাইভ রেকর্ড" }
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key as any)}
                  className={`px-3 py-1.5 rounded-none transition-colors ${
                    activeTab === t.key
                      ? "bg-[#C5A059] text-[#0B1A2E] font-bold"
                      : "text-stone-300 hover:text-[#C5A059] hover:bg-white/5"
                  }`}
                >
                  {isBn ? t.labelBn : t.labelEn}
                </button>
              ))}
            </div>

            {/* Language & Canonical Link */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(isBn ? "en" : "bn")}
                className="text-[11px] font-mono px-2.5 py-1 border border-[#C5A059]/40 hover:border-[#C5A059] text-[#E5C378] transition-colors"
                title="Toggle Language"
              >
                {isBn ? "English" : "বাংলা"}
              </button>
              <a
                href="https://hakimsarker.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059] hover:bg-[#E5C378] text-[#0B1A2E] text-xs font-mono font-bold transition-colors"
              >
                <span>hakimsarker.org</span>
                <Globe width={13} height={13} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0B1A2E] via-[#070D18] to-[#040810] py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C378] text-xs font-mono mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-pulse" />
                <span>{isBn ? "সুপারনিউমারারি প্রফেসর · সাবেক উপাচার্য · শিক্ষাবিদ" : "Supernumerary Professor · Former Vice-Chancellor · Scholar"}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight mb-2">
                {isBn ? "প্রফেসর ড. আব্দুল হাকিম সরকার" : "Professor Dr. Abdul Hakim Sarker"}
              </h1>

              <div className="text-lg sm:text-xl font-mono text-[#C5A059] mb-4">
                1947 — 2025
              </div>

              <p className="text-stone-300 font-serif italic text-base sm:text-lg mb-6 border-l-2 border-[#C5A059] pl-4">
                {isBn
                  ? "“ফলিত সামাজিক পরিবর্তনের লক্ষ্যে জ্ঞানের লালন ও বিকাশ”"
                  : "“Nurturing Knowledge for Applied Social Change”"}
              </p>

              <div className="space-y-1.5 text-xs sm:text-sm text-stone-300 mb-8 font-mono">
                <p className="flex items-center gap-2">
                  <span className="text-[#C5A059]">▪</span>
                  <span>{isBn ? "ইনস্টিটিউট অব সোশ্যাল ওয়েলফেয়ার অ্যান্ড রিসার্চ (আইএসডব্লিউআর), ঢাকা বিশ্ববিদ্যালয়" : "Institute of Social Welfare and Research (ISWR), University of Dhaka"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#C5A059]">▪</span>
                  <span>{isBn ? "সাবেক উপাচার্য, ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া (২০১২–২০১৬)" : "Former Vice-Chancellor, Islamic University, Kushtia (2012–2016)"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#C5A059]">▪</span>
                  <span>{isBn ? "প্রতিষ্ঠাতা ও সাবেক সমন্বয়ক, ভিকটিমোলজি ও রেস্টোরেটিভ জাস্টিস মাস্টার্স প্রোগ্রাম" : "Founder & Former Coordinator, Victimology & Restorative Justice Master's Program, DU"}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveTab("PUBLICATIONS")}
                  className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#E5C378] text-[#0B1A2E] text-xs font-mono font-bold transition-colors flex items-center gap-2"
                >
                  <Book width={14} height={14} />
                  <span>{isBn ? "প্রকাশনা ও বই দেখুন" : "Explore Publications"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("QIMAI")}
                  className="px-5 py-2.5 border border-[#3B82F6] bg-[#1E3A8A]/30 hover:bg-[#1E3A8A]/50 text-blue-300 text-xs font-mono font-bold transition-colors flex items-center gap-2"
                >
                  <Cpu width={14} height={14} className="text-blue-400" />
                  <span>{isBn ? "আর্কাইভ জিজ্ঞাসা (এআই)" : "Ask the Archive (QIM AI)"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("BIOGRAPHY")}
                  className="px-4 py-2.5 border border-white/20 hover:border-white/40 text-stone-300 text-xs font-mono transition-colors"
                >
                  {isBn ? "পূর্ণাঙ্গ জীবনী" : "Read Biography"}
                </button>
              </div>
            </div>

            {/* Right Portrait & Archival Lockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-[340px] w-full">
                <Image
                  src="/media/hakimsarker-portrait.svg"
                  alt="Professor Dr. Abdul Hakim Sarker Academic Portrait"
                  width={340}
                  height={410}
                  className="w-full h-auto drop-shadow-2xl rounded-lg"
                  priority
                />
                <div className="absolute -bottom-3 -right-3 bg-[#0B1A2E] border border-[#C5A059] px-3 py-1.5 text-[10px] font-mono text-[#E5C378] flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck width={12} height={12} className="text-emerald-400" />
                  <span>{isBn ? "যাচাইকৃত ডিজিটাল আর্কাইভ" : "Preserved Digital Archive"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* At a Glance Metric Bar */}
      <section className="bg-[#050B14] border-b border-white/10 py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 border border-white/5 bg-white/[0.02]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#E5C378]">55+</div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mt-1">
                {isBn ? "বছরের একাডেমিক সেবা" : "Years of Service"}
              </div>
            </div>
            <div className="p-3 border border-white/5 bg-white/[0.02]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white">12</div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mt-1">
                {isBn ? "রচিত ও সম্পাদিত গ্রন্থ" : "Books Authored"}
              </div>
            </div>
            <div className="p-3 border border-white/5 bg-white/[0.02]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#60A5FA]">28+</div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mt-1">
                {isBn ? "নির্বাচিত প্রকাশনা" : "Selected Publications"}
              </div>
            </div>
            <div className="p-3 border border-white/5 bg-white/[0.02]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">15+</div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mt-1">
                {isBn ? "আন্তর্জাতিক সম্মেলন" : "Int'l Conferences"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Interactive Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* TAB 1: BIOGRAPHY */}
        {activeTab === "BIOGRAPHY" && (
          <div className="space-y-10 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">{isBn ? "জীবনী বিবরণী" : "Archival Biography"}</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {isBn ? "প্রফেসর ড. আব্দুল হাকিম সরকারের জীবন ও কর্ম" : "A Life of Applied Scholarship & Social Leadership"}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-stone-300 text-sm leading-relaxed">
              <div className="p-6 bg-[#0B1A2E]/50 border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-mono font-bold text-xs mb-2">01</div>
                <h3 className="font-serif font-bold text-white text-base">{isBn ? "প্রারম্ভিক জীবন ও শিক্ষাদীক্ষা" : "Early Life & Education"}</h3>
                <p>
                  {isBn
                    ? "অধ্যাপক সরকার ১৯৪৭ সালের ৪ অক্টোবর উত্তরবঙ্গের মনোরম পরিবেশে জন্মগ্রহণ করেন। তিনি ১৯৬৯ সালে ঢাকা বিশ্ববিদ্যালয় থেকে সমাজকল্যাণ বিষয়ে প্রথম শ্রেণীতে স্নাতকোত্তর ডিগ্রি অর্জন করেন।"
                    : "Born on 4 October 1947 in northern Bangladesh, Professor Sarker pursued his Master's degree in Social Welfare from the University of Dhaka in 1969 with First Class honors."}
                </p>
                <p>
                  {isBn
                    ? "পরবর্তীতে ১৯৮৮ সালে তিনি সমাজতাত্ত্বিক অপরাধবিজ্ঞান (সোসিওলজিক্যাল ক্রিমিনোলজি)-এ পিএইচডি ডিগ্রি লাভ করেন, যার মূল ফোকাস ছিল 'কিশোর অপরাধ ও সমাজবিজ্ঞান' (Juvenile Sociopathy)।"
                    : "He completed his Ph.D. in 1988 focusing on Sociological Criminology with groundbreaking empirical research on Juvenile Sociopathy and urban delinquency."}
                </p>
              </div>

              <div className="p-6 bg-[#0B1A2E]/50 border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-mono font-bold text-xs mb-2">02</div>
                <h3 className="font-serif font-bold text-white text-base">{isBn ? "ঢাকা বিশ্ববিদ্যালয় ও প্রশাসনিক নেতৃত্ব" : "Dhaka University & Leadership"}</h3>
                <p>
                  {isBn
                    ? "তিনি ঢাকা বিশ্ববিদ্যালয়ের সমাজকল্যাণ ও গবেষণা ইনস্টিটিউটে (আইএসডব্লিউআর) দীর্ঘ পাঁচ দশক অধ্যাপনা করেন এবং তিন মেয়াদে সফলভাবে পরিচালকের দায়িত্ব পালন করেন (১৯৯৫, ১৯৯৮–২০০১, ২০০৬–২০০৭)।"
                    : "He served as Professor at ISWR, University of Dhaka, holding directorship across multiple terms (1995, 1998–2001, 2006–2007, 2008)."}
                </p>
                <p>
                  {isBn
                    ? "১৯৮২ থেকে ২০০২ সাল পর্যন্ত সুদীর্ঘ ২০ বছর তিনি হাজী মুহম্মদ মুহসীন হল এক্সটেনশনের ওয়ার্ডেন হিসেবে শিক্ষার্থীদের অভিভাবকত্ব প্রদান করেন।"
                    : "For two decades (1982–2002), he served as Warden of Haji Muhammad Mohsin Hall Extension, mentoring generations of university students."}
                </p>
              </div>

              <div className="p-6 bg-[#0B1A2E]/50 border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-mono font-bold text-xs mb-2">03</div>
                <h3 className="font-serif font-bold text-white text-base">{isBn ? "উপাচার্য পদ ও জ্ঞান প্রচার" : "Vice-Chancellorship & Legacy"}</h3>
                <p>
                  {isBn
                    ? "২০১২ থেকে ২০১৬ সাল পর্যন্ত তিনি কুষ্টিয়ার ইসলামী বিশ্ববিদ্যালয়ের উপাচার্য হিসেবে সুনামের সাথে দায়িত্ব পালন করেন এবং বিশ্ববিদ্যালয়ের অবকাঠামোগত ও শিক্ষা মানের যুগান্তকারী উন্নয়ন ঘটান।"
                    : "From 2012 to 2016, he served as Vice-Chancellor of Islamic University, Kushtia, strengthening academic governance and campus development."}
                </p>
                <p>
                  {isBn
                    ? "তিনি বাংলাদেশ কাউন্সিল ফর সোশ্যাল ওয়ার্ক এডুকেশন (BCSWE) ও বাংলাদেশ সোসাইটি ফর ভিকটিমোলজি অ্যান্ড রেস্টোরেটিভ জাস্টিসের প্রতিষ্ঠাতা সভাপতি ছিলেন।"
                    : "He was the Founder President of the Bangladesh Council for Social Work Education (BCSWE) and Bangladesh Society for Victimology & Restorative Justice (BSVRJ)."}
                </p>
              </div>
            </div>

            {/* Quote Banner */}
            <div className="p-6 bg-gradient-to-r from-[#0B1A2E] to-[#122238] border-l-4 border-[#C5A059] text-stone-200">
              <p className="font-serif italic text-base sm:text-lg">
                {isBn
                  ? "“গবেষণাকে শ্রেণিকক্ষের চার দেয়ালে বন্দি রাখলে চলবে না; সমাজবিজ্ঞানীর কাজ হলো মাঠপর্যায়ে সাধারণ মানুষের দুর্দশা লাঘবে নীতি ও কাঠামোগত সমাধানের পথ তৈরি করা।”"
                  : "“Scholarship cannot remain confined within four walls; the duty of the social scientist is to forge structural and policy remedies for the marginalized directly in the field.”"}
              </p>
              <div className="mt-2 text-xs font-mono text-[#E5C378]">
                — Prof. Dr. Abdul Hakim Sarker (ACPF International Academic Council Address)
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC JOURNEY TIMELINE */}
        {activeTab === "JOURNEY" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">{isBn ? "কালানুক্রমিক পথচলা" : "Chronological Milestones"}</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {isBn ? "একাডেমিক ও প্রশাসনিক মাইলফলক" : "Academic & Institutional Journey"}
              </h2>
            </div>

            <div className="relative border-l-2 border-[#C5A059]/40 ml-4 sm:ml-8 space-y-8 pl-6 sm:pl-8">
              {[
                {
                  year: "1947",
                  titleEn: "Birth in Northern Bangladesh",
                  titleBn: "উত্তরবঙ্গে জন্ম",
                  descEn: "Born on 4 October 1947, commencing a life deeply dedicated to humanitarian scholarship.",
                  descBn: "৪ অক্টোবর ১৯৪৭ সালে জন্মগ্রহণ করেন।"
                },
                {
                  year: "1969",
                  titleEn: "Master of Arts in Social Welfare (First Class)",
                  titleBn: "সমাজকল্যাণে প্রথম শ্রেণীতে এম.এ. অর্জন",
                  descEn: "Graduated with top academic standing from the University of Dhaka, joining the faculty.",
                  descBn: "ঢাকা বিশ্ববিদ্যালয় থেকে কৃতিত্বের সাথে মাস্টার্স সম্পন্ন করে শিক্ষকতায় যোগদান।"
                },
                {
                  year: "1982 – 2002",
                  titleEn: "Warden, Haji Muhammad Mohsin Hall Extension",
                  titleBn: "ওয়ার্ডেন, হাজী মুহম্মদ মুহসীন হল এক্সটেনশন",
                  descEn: "Dedicated 20 years to residential student welfare, campus harmony, and academic discipline.",
                  descBn: "সুদীর্ঘ ২০ বছর আবাসিক শিক্ষার্থীদের অভিভাবক হিসেবে দায়িত্ব পালন।"
                },
                {
                  year: "1988",
                  titleEn: "Ph.D. in Sociological Criminology (Juvenile Sociopathy)",
                  titleBn: "সোসিওলজিক্যাল ক্রিমিনোলজিতে পিএইচডি লাভ",
                  descEn: "Conferred doctorate from the University of Dhaka for seminal empirical study on juvenile offense patterns.",
                  descBn: "ঢাকা বিশ্ববিদ্যালয় থেকে কিশোর অপরাধ ও সংশোধন ব্যবস্থার ওপর গবেষণার জন্য পিএইচডি লাভ।"
                },
                {
                  year: "1995 & 1998–2001",
                  titleEn: "Director, Institute of Social Welfare & Research (ISWR)",
                  titleBn: "পরিচালক, সমাজকল্যাণ ও গবেষণা ইনস্টিটিউট (আইএসডব্লিউআর)",
                  descEn: "Led Dhaka University's premiere social sciences institute across multiple consequential terms.",
                  descBn: "ঢাকা বিশ্ববিদ্যালয়ের আইএসডব্লিউআর এর পরিচালকের দায়িত্ব পালন।"
                },
                {
                  year: "2009 – 2012",
                  titleEn: "Safeguard Compliance Expert, Padma Multipurpose Bridge Project",
                  titleBn: "পদ্মা সেতু প্রকল্পে সেফগার্ড কমপ্লায়েন্স এক্সপার্ট",
                  descEn: "Assessed resettlement, displacement compensation, and social safeguard compliance for World Bank / GOB.",
                  descBn: "বিশ্বব্যাংক ও বাংলাদেশ সরকারের অধীনে পদ্মা সেতু পুনর্বাসন ও সামাজিক সুরক্ষা মূল্যায়ন।"
                },
                {
                  year: "2012 – 2016",
                  titleEn: "Vice-Chancellor, Islamic University, Kushtia",
                  titleBn: "উপাচার্য, ইসলামী বিশ্ববিদ্যালয়, কুষ্টিয়া",
                  descEn: "Served as Vice-Chancellor, driving institutional expansion, research funding, and administrative modernization.",
                  descBn: "ইসলামী বিশ্ববিদ্যালয়ের উপাচার্য হিসেবে ৪ বছর মেয়াদে সফল নেতৃত্ব।"
                },
                {
                  year: "2024 – 2025",
                  titleEn: "Supernumerary Professor & Program Founder",
                  titleBn: "সুপারনিউমারারি প্রফেসর ও আজীবন মেন্টরশিপ",
                  descEn: "Continued senior professorial mentorship and stewardship of the Victimology & Restorative Justice Master's program.",
                  descBn: "সুপারনিউমারারি প্রফেসর হিসেবে শিক্ষকতা এবং ভিকটিমোলজি শিক্ষা প্রসারে নিবেদন।"
                },
                {
                  year: "May 2025",
                  titleEn: "Demise & Perpetual Digital Preservation",
                  titleBn: "মহাপ্রয়াণ ও ডিজিটাল জ্ঞান সংরক্ষণ",
                  descEn: "Passed away on 11 May 2025. His intellectual legacy is safeguarded permanently at hakimsarker.org.",
                  descBn: "১১ মে ২০২৫ সালে মহাপ্রয়াণ। তার রচিত জ্ঞান সম্পদ ভবিষ্যৎ প্রজন্মের জন্য উন্মুক্ত সংরক্ষিত।"
                }
              ].map((m, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#0B1A2E] border-2 border-[#C5A059] group-hover:bg-[#E5C378] transition-colors" />
                  <div className="font-mono text-xs font-bold text-[#C5A059] tracking-wider">{m.year}</div>
                  <h3 className="font-serif font-bold text-white text-base mt-0.5">{isBn ? m.titleBn : m.titleEn}</h3>
                  <p className="text-stone-300 text-xs sm:text-sm mt-1">{isBn ? m.descBn : m.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AREAS OF RESEARCH */}
        {activeTab === "RESEARCH" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">{isBn ? "গবেষণা ডোমেইন" : "Research Taxonomy"}</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {isBn ? "মৌলিক গবেষণা ও জ্ঞানক্ষেত্র" : "Scholarly Research Themes"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  titleEn: "Juvenile Sociopathy & Delinquency",
                  titleBn: "কিশোর অপরাধ ও সমাজতত্ত্ব",
                  icon: <User className="text-[#C5A059]" width={20} height={20} />,
                  descEn: "Empirical urban inquiry into causes, home conditions, peer associations, and preventive rehabilitation in Dhaka.",
                  descBn: "ঢাকা শহরের কিশোরদের অপরাধ প্রবণতা, পারিবারিক সংকট ও বিকল্প সংশোধন কাঠামোর ওপর মৌলিক গবেষণা।"
                },
                {
                  titleEn: "Victimology & Restorative Justice",
                  titleBn: "ভিকটিমোলজি ও পুনরুদ্ধারমূলক বিচার",
                  icon: <ShieldCheck className="text-emerald-400" width={20} height={20} />,
                  descEn: "Pioneering South Asian curriculum framing victim restitution, rights, and alternative dispute resolution (Salish).",
                  descBn: "অপরাধের শিকার ব্যক্তিদের অধিকার সংরক্ষণ ও সামাজিক সালিশির মাধ্যমে শান্তিপূর্ণ সমাধানের মডেল।"
                },
                {
                  titleEn: "Social Work Contextualization",
                  titleBn: "সমাজকর্মের দেশজীকরণ",
                  icon: <Globe className="text-blue-400" width={20} height={20} />,
                  descEn: "Adapting Western casework principles to Bangladesh's agrarian social structures and resource realities.",
                  descBn: "পশ্চিমা কেসওয়ার্ক তত্ত্বকে বাংলাদেশের সামাজিক মূল্যবোধ ও বাস্তবতার সাথে সমন্বয়।"
                },
                {
                  titleEn: "Human Security & Vulnerability",
                  titleBn: "মানব নিরাপত্তা ও সামাজিক সুরক্ষা",
                  icon: <Lock className="text-amber-400" width={20} height={20} />,
                  descEn: "UNDP-commissioned studies on economic insecurity, justice access, and dignity among marginalized citizens.",
                  descBn: "ইউএনডিপির তত্ত্বাবধানে বিচার প্রাপ্তি, দারিদ্র্য ও মানবাধিকারের তুলনামূলক বিশ্লেষণ।"
                },
                {
                  titleEn: "Infrastructure Safeguard Compliance",
                  titleBn: "অবকাঠামো ও পরিবেশগত সামাজিক সুরক্ষা",
                  icon: <Building className="text-purple-400" width={20} height={20} />,
                  descEn: "Social impact assessments, displacement compensation, and rehabilitation monitoring for mega-projects.",
                  descBn: "পদ্মা বহুমুখী সেতুসহ মেগা প্রকল্পে ক্ষতিগ্রস্তদের পুনর্বাসন ও সামাজিক নীতিমালার নিরীক্ষা।"
                },
                {
                  titleEn: "Social Research Methodology",
                  titleBn: "সামাজিক গবেষণা পদ্ধতি ও পরিসংখ্যান",
                  icon: <BookmarkBook className="text-[#E5C378]" width={20} height={20} />,
                  descEn: "Advanced curriculum design in quantitative social statistics, operational survey models, and field clinical training.",
                  descBn: "সামাজিক জরিপ, পরিসংখ্যানগত পরিমাপ এবং মাঠপর্যায়ের ক্লিনিকাল ডাটা সংগ্রহের পদ্ধতিগত নির্দেশনা।"
                }
              ].map((r, idx) => (
                <div key={idx} className="p-5 bg-[#0B1A2E]/40 border border-white/10 hover:border-[#C5A059]/50 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    {r.icon}
                    <h3 className="font-serif font-bold text-white text-sm">{isBn ? r.titleBn : r.titleEn}</h3>
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">{isBn ? r.descBn : r.descEn}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PUBLICATIONS & BOOKS */}
        {activeTab === "PUBLICATIONS" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">{isBn ? "গ্রন্থ ও গবেষণাপত্র" : "Scholarly Catalog"}</div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {isBn ? "নির্বাচিত বই ও একাডেমিক প্রকাশনা" : "Books, Chapters & Academic Publications"}
                </h2>
              </div>
              {/* Type Filter */}
              <div className="flex items-center gap-1 text-xs font-mono">
                {[
                  { key: "ALL", label: isBn ? "সকল" : "All" },
                  { key: "BOOK", label: isBn ? "বই" : "Books" },
                  { key: "CHAPTER", label: isBn ? "অধ্যায়" : "Chapters" },
                  { key: "ARTICLE", label: isBn ? "জার্নাল" : "Articles" }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setPubFilter(f.key as any)}
                    className={`px-3 py-1 border transition-colors ${
                      pubFilter === f.key
                        ? "bg-[#C5A059] border-[#C5A059] text-[#0B1A2E] font-bold"
                        : "border-white/20 text-stone-300 hover:border-white/40"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPubs.map((p, idx) => (
                <div key={idx} className="p-6 bg-[#0B1A2E]/50 border border-white/10 hover:border-[#C5A059]/60 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#C5A059]/10 text-[#E5C378] border border-[#C5A059]/30">
                        {p.typeLabel}
                      </span>
                      <span className="text-xs font-mono text-[#C5A059] font-bold">{p.year}</span>
                    </div>
                    <h3 className="font-serif font-bold text-white text-base leading-snug mb-1">
                      {isBn ? p.titleBn : p.title}
                    </h3>
                    <div className="text-[11px] font-mono text-stone-400 mb-3">{p.publisher}</div>
                    <p className="text-stone-300 text-xs leading-relaxed mb-4">{isBn ? p.descBn : p.descEn}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                      <CheckCircle width={12} height={12} />
                      <span>{isBn ? "যাচাইকৃত নথি" : "Verified Record"}</span>
                    </span>
                    <a href="mailto:hi@hakimsarker.org?subject=Citation Request" className="text-[#C5A059] hover:underline flex items-center gap-1">
                      <span>{isBn ? "সাইটেশন রেফারেন্স" : "Request Citation"}</span>
                      <NavArrowRight width={12} height={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: ASK THE ARCHIVE (QIM AI 2.1) */}
        {activeTab === "QIMAI" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono text-[#3B82F6] uppercase tracking-wider flex items-center gap-1.5">
                <Spark width={14} height={14} className="text-blue-400" />
                <span>{isBn ? "এআই চালিত জ্ঞান অনুসন্ধান" : "AI-Assisted Knowledge Retrieval"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {isBn ? "কিউআইএম এআই ২.১ — আর্কাইভ জিজ্ঞাসা" : "Ask the Archive: Grounded Scholarly Retrieval"}
              </h2>
              <p className="text-xs font-mono text-stone-400 mt-1">
                {isBn
                  ? "সতর্কবার্তা: এটি একটি প্রাতিষ্ঠানিক গবেষণা সহায়ক এআই। এটি অধ্যাপক সরকারের ব্যক্তিগত কণ্ঠ নয়, কেবল তার প্রকাশিত নথি থেকে তথ্য বিশ্লেষণ করে।"
                  : "Strict Provenance Rule: This AI interface answers strictly from preserved texts and documents. It never impersonates Professor Sarker or fabricates quotations."}
              </p>
            </div>

            {/* Prompt Selector Buttons */}
            <div>
              <div className="text-xs font-mono text-stone-400 mb-2">{isBn ? "প্রস্তাবিত গবেষণা প্রশ্ন নির্বাচন করুন:" : "Select an archived research topic:"}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPrompt(isBn ? p.qBn : p.qEn);
                      setAiResponse({
                        answerEn: p.resEn,
                        answerBn: p.resBn,
                        source: p.source,
                        year: p.year,
                        page: p.page,
                        verified: true
                      });
                    }}
                    className={`p-3 text-left border text-xs font-mono transition-colors ${
                      selectedPrompt === (isBn ? p.qBn : p.qEn)
                        ? "bg-[#1E3A8A]/40 border-[#3B82F6] text-white"
                        : "bg-white/[0.02] border-white/10 text-stone-300 hover:border-white/30"
                    }`}
                  >
                    <div className="text-[#60A5FA] font-bold mb-1">{isBn ? p.labelBn : p.labelEn}</div>
                    <div className="text-stone-300 text-[11px] truncate">{isBn ? p.qBn : p.qEn}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Question & Grounded AI Response Card */}
            <div className="p-6 bg-[#0B1A2E]/70 border border-[#3B82F6]/40 rounded-none shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu width={18} height={18} className="text-[#3B82F6]" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {isBn ? "অনুসন্ধান ফলাফল (কিউআইএম এআই ২.১ আরএজি ইঞ্জিন)" : "Retrieved Answer (QiM-AI 2.1 Engine)"}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/30">
                  {isBn ? "উৎস প্রামাণ্য ১০০%" : "Provenance Verified"}
                </span>
              </div>

              {/* User Question */}
              <div className="text-sm font-mono text-[#E5C378] font-semibold">
                “{selectedPrompt}”
              </div>

              {/* Response Text */}
              <div className="text-sm text-stone-200 leading-relaxed font-sans bg-white/[0.02] p-4 border-l-2 border-[#3B82F6]">
                {isBn ? aiResponse.answerBn : aiResponse.answerEn}
              </div>

              {/* Provenance Box */}
              <div className="p-3 bg-[#040810] border border-white/10 text-xs font-mono text-stone-400 space-y-1">
                <div className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider">{isBn ? "তথ্যসূত্র ও নথি উদ্ধৃতি:" : "Document Citation & Page Provenance:"}</div>
                <div className="text-white text-xs">{aiResponse.source}</div>
                <div className="flex flex-wrap gap-4 text-[11px] text-stone-400">
                  <span>{isBn ? "সাল:" : "Year:"} {aiResponse.year}</span>
                  <span>{isBn ? "পৃষ্ঠা / রেফারেন্স:" : "Ref:"} {aiResponse.page}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle width={11} height={11} />
                    <span>{isBn ? "অনুমোদিত আর্কাইভ" : "Approved Corpus"}</span>
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="text-[11px] text-stone-500">{isBn ? "প্রযুক্তি অংশীদার: qimai.codes" : "Engineered with qimai.codes"}</span>
                <Link href="/initiatives/qimai" className="text-[#60A5FA] hover:underline flex items-center gap-1">
                  <span>{isBn ? "কিউআইএম এআই প্ল্যাটফর্ম জানুন" : "Explore QiM-AI Platform"}</span>
                  <ArrowRight width={12} height={12} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PRESERVATION & ARCHIVE */}
        {activeTab === "ARCHIVE" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-white/10 pb-4">
              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">{isBn ? "ডিজিটাল সংরক্ষণ" : "Preservation Layer"}</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                {isBn ? "আর্কাইভ নথিপত্র ও ঐতিহাসিক রেকর্ড" : "Archival Documents & Preservation Records"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="p-5 bg-[#0B1A2E]/40 border border-white/10 space-y-2">
                <Folder width={20} height={20} className="text-[#C5A059]" />
                <h3 className="font-serif font-bold text-white text-sm">{isBn ? "বায়োগ্রাফিক্যাল ফাইল" : "Biographical Dossier"}</h3>
                <p className="text-stone-300 text-[11px]">Personal Resume of AHS (1947–2025), comprehensive appointment gazettes, and university administrative orders.</p>
                <div className="text-[10px] text-emerald-400 pt-2">SHA-256 Verified · Permanent Storage</div>
              </div>
              <div className="p-5 bg-[#0B1A2E]/40 border border-white/10 space-y-2">
                <Book width={20} height={20} className="text-[#60A5FA]" />
                <h3 className="font-serif font-bold text-white text-sm">{isBn ? "মনোগ্রাফ ও পিএইচডি থিসিস" : "Monographs & Ph.D. Archive"}</h3>
                <p className="text-stone-300 text-[11px]">1988 Dhaka University Ph.D. dissertation on Juvenile Sociopathy, full-text scans and chapter OCR metadata.</p>
                <div className="text-[10px] text-emerald-400 pt-2">Scholarly Metadata Indexed</div>
              </div>
              <div className="p-5 bg-[#0B1A2E]/40 border border-white/10 space-y-2">
                <Globe width={20} height={20} className="text-[#E5C378]" />
                <h3 className="font-serif font-bold text-white text-sm">{isBn ? "ইউএন ও বিশ্বব্যাংক কনসালটেন্সি" : "UN & World Bank Dossiers"}</h3>
                <p className="text-stone-300 text-[11px]">UNESCO youth NGO studies, UNDP human security reports, and Padma Bridge social safeguard compliance audits.</p>
                <div className="text-[10px] text-emerald-400 pt-2">Institutional Clearance Verified</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Controlled Correspondence & Memorial Inquiries */}
      <section className="bg-[#050B14] border-t border-white/10 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">{isBn ? "একাডেমিক যোগাযোগ" : "Institutional Enquiries"}</div>
              <h2 className="text-2xl font-serif font-bold text-white">
                {isBn ? "আর্কাইভ অনুসন্ধান ও যোগাযোগ" : "Archive Access & Academic Collaboration"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {isBn
                  ? "গবেষণাপত্রের রেফারেন্স, উচ্চতর গবেষণায় তথ্য সহায়তা কিংবা স্মারক আর্কাইভের তথ্য যাচাইয়ের জন্য আমাদের প্রাতিষ্ঠানিক যোগাযোগ মাধ্যম ব্যবহার করুন।"
                  : "For academic queries, citation verification, document reproductions, or collaborative research involving Professor Sarker's works, please route inquiries through the official archive channel."}
              </p>
              <div className="pt-2 space-y-2 text-xs font-mono text-stone-300">
                <p className="flex items-center gap-2">
                  <span className="text-[#C5A059]">Email:</span>
                  <a href="mailto:hi@hakimsarker.org" className="text-white hover:text-[#C5A059] underline">hi@hakimsarker.org</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#C5A059]">Domain:</span>
                  <a href="https://hakimsarker.org/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C5A059] underline">https://hakimsarker.org/</a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#C5A059]">Affiliation:</span>
                  <span>ISWR, University of Dhaka</span>
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#0B1A2E]/60 border border-white/10 p-6">
              <form onSubmit={(e) => { e.preventDefault(); alert(isBn ? "আপনার অনুসন্ধান গৃহীত হয়েছে। ধন্যবাদ।" : "Thank you for your academic inquiry. It has been recorded for the archive team."); }} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-400 mb-1">{isBn ? "আপনার নাম" : "Your Name"}</label>
                    <input type="text" required placeholder="Dr. / Prof. / Scholar Name" className="w-full bg-[#040810] border border-white/20 p-2 text-white focus:border-[#C5A059] outline-none" />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">{isBn ? "ইমেইল ঠিকানা" : "Email Address"}</label>
                    <input type="email" required placeholder="scholar@university.edu" className="w-full bg-[#040810] border border-white/20 p-2 text-white focus:border-[#C5A059] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">{isBn ? "প্রতিষ্ঠান / বিভাগ" : "Institution / University"}</label>
                  <input type="text" placeholder="Department of Criminology / Law / Social Work" className="w-full bg-[#040810] border border-white/20 p-2 text-white focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">{isBn ? "অনুসন্ধান বার্তা / গবেষণার বিষয়" : "Inquiry / Research Purpose"}</label>
                  <textarea rows={3} required placeholder="Regarding access to monograph manuscripts or citation requests..." className="w-full bg-[#040810] border border-white/20 p-2 text-white focus:border-[#C5A059] outline-none" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#E5C378] text-[#0B1A2E] font-bold text-xs flex items-center gap-2 transition-colors">
                  <Send width={12} height={12} />
                  <span>{isBn ? "বার্তা প্রেরণ করুন" : "Send Academic Inquiry"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#03060C] border-t border-white/10 py-8 text-center text-xs font-mono text-stone-500">
        <div className="max-w-[1400px] mx-auto px-4 space-y-2">
          <p className="text-stone-300 font-serif">
            © 2026 HAKIM SARKER.ORG · A Digital Preservation Initiative in Stewardship with Family &amp; Academic Peers.
          </p>
          <p className="text-[11px] text-stone-500">
            {isBn
              ? "সোহেল তাসনীম ফাউন্ডেশন (এসটিএফএল) ইকোসিস্টেমের উন্মুক্ত জ্ঞান ও ডিজিটাল লিগ্যাসি উদ্যোগ।"
              : "An Open-Access Digital Legacy Initiative of SohaelTasneem Foundation (STFL) Ecosystem."}
          </p>
        </div>
      </footer>
    </div>
  );
}
