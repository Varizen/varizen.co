/**
 * SAMC — South Apollo Medical College & Hospital
 * Bilingual (EN / বাংলা) institutional content model.
 *
 * GOVERNANCE / NO-FABRICATION POLICY
 * ----------------------------------
 * This file contains only:
 *   1. Institutional identity that is fixed by the master build prompt.
 *   2. Structural / navigational copy (labels, headings, section intros).
 *   3. Clearly-marked placeholders for any fact that requires institutional
 *      verification (address, phone, email, accreditation, fees, personnel).
 *
 * Never invent doctors, faculty, facilities, bed counts, accreditation,
 * affiliation, fees, admission dates, phone numbers, statistics or outcomes.
 * Replace every [PLACEHOLDER] with verified institutional content before launch.
 */

export type Lang = "en" | "bn";

export const LANGS: Lang[] = ["en", "bn"];

export const isLang = (value: string): value is Lang => value === "en" || value === "bn";

/** Fixed institutional identity — must never be changed, shortened or reinterpreted. */
export const identity = {
  fullName: "SOUTH APOLLO MEDICAL COLLEGE & HOSPITAL",
  shortName: "SAMC",
  established: "ESTD: 2021",
  domain: "samc.varizen.co",
  url: "https://samc.varizen.co",
  philosophy: { en: "Care · Knowledge · Integrity", bn: "সেবা · জ্ঞান · সততা" },
  concept: {
    en: "One institution. Two missions. One healthier tomorrow.",
    bn: "একটি প্রতিষ্ঠান। দুটি মিশন। একটি সুস্থ আগামী।",
  },
} as const;

/** Copyright year — static so it can be prerendered (cacheComponents). */
export const copyrightYear = 2026;

/** Placeholders — replace with verified institutional data before launch. */
export const placeholders = {
  address: "[OFFICIAL ADDRESS]",
  phone: "[OFFICIAL PHONE]",
  email: "[OFFICIAL EMAIL]",
  emergency: "[EMERGENCY CONTACT]",
  affiliation: "[OFFICIAL AFFILIATION TO BE CONFIRMED]",
  approval: "[REGULATORY APPROVAL TO BE CONFIRMED]",
  campusPhoto: "[HD CAMPUS PHOTOGRAPH TO BE PROVIDED]",
  doctorProfile: "[DOCTOR PROFILE TO BE PROVIDED]",
  facultyProfile: "[FACULTY PROFILE TO BE PROVIDED]",
  content: "[CONTENT TO BE PROVIDED]",
} as const;

type Bilingual = { en: string; bn: string };

export const t = (value: Bilingual, lang: Lang): string => value[lang];

/* ──────────────────────────────────────────────────────────────────────────
   NAVIGATION
   ────────────────────────────────────────────────────────────────────────── */

export type NavItem = { slug: string; label: Bilingual };

export const nav: NavItem[] = [
  { slug: "about", label: { en: "About SAMC", bn: "SAMC সম্পর্কে" } },
  { slug: "medical-care", label: { en: "Medical Care", bn: "চিকিৎসা সেবা" } },
  { slug: "medical-education", label: { en: "Medical Education", bn: "চিকিৎসা শিক্ষা" } },
  { slug: "research", label: { en: "Research & Innovation", bn: "গবেষণা ও উদ্ভাবন" } },
  { slug: "people", label: { en: "People & Community", bn: "জনগণ ও সমাজ" } },
  { slug: "news", label: { en: "News & Events", bn: "সংবাদ ও ইভেন্ট" } },
  { slug: "contact", label: { en: "Contact", bn: "যোগাযোগ" } },
];

export const utilityNav: NavItem[] = [
  { slug: "admissions", label: { en: "Admissions", bn: "ভর্তি" } },
  { slug: "downloads", label: { en: "Downloads", bn: "ডাউনলোড" } },
  { slug: "careers", label: { en: "Careers", bn: "কর্মসংস্থান" } },
  { slug: "brand", label: { en: "Brand & 77 Library", bn: "ব্র্যান্ড ও ৭৭ লাইব্রেরি" } },
];

/* ──────────────────────────────────────────────────────────────────────────
   UI STRINGS
   ────────────────────────────────────────────────────────────────────────── */

export const ui = {
  skipToContent: { en: "Skip to content", bn: "মূল কনটেন্টে যান" },
  menu: { en: "Menu", bn: "মেনু" },
  close: { en: "Close", bn: "বন্ধ করুন" },
  language: { en: "Language", bn: "ভাষা" },
  explore: { en: "Explore SAMC", bn: "SAMC দেখুন" },
  viewInBangla: { en: "বাংলায় দেখুন", bn: "View in English" },
  learnMore: { en: "Learn more", bn: "আরও জানুন" },
  readMore: { en: "Read more", bn: "আরও পড়ুন" },
  backHome: { en: "Back to home", bn: "হোমে ফিরুন" },
  emergency: { en: "Emergency", bn: "জরুরি" },
  emergencyTitle: { en: "Emergency & Critical Care", bn: "জরুরি ও ক্রিটিক্যাল কেয়ার" },
  emergencyNote: {
    en: "Emergency information is always visible and never hidden behind animation, hover or language switching.",
    bn: "জরুরি তথ্য সর্বদা দৃশ্যমান থাকে; অ্যানিমেশন, হোভার বা ভাষা পরিবর্তনের পেছনে কখনো লুকানো থাকে না।",
  },
  placeholderNotice: {
    en: "Placeholder — to be replaced with verified institutional content.",
    bn: "প্লেসহোল্ডার — যাচাইকৃত প্রাতিষ্ঠানিক তথ্য দিয়ে প্রতিস্থাপন করতে হবে।",
  },
  comingSoon: { en: "Appointment system coming soon", bn: "অ্যাপয়েন্টমেন্ট সিস্টেম শীঘ্রই আসছে" },
  notFoundTitle: { en: "We couldn’t find that page.", bn: "এই পৃষ্ঠাটি খুঁজে পাওয়া যায়নি।" },
  notFoundBody: {
    en: "The page may have moved, or the address may be incorrect.",
    bn: "পৃষ্ঠাটি সরানো হয়েছে, অথবা ঠিকানাটি ভুল হতে পারে।",
  },
  search: { en: "Search", bn: "অনুসন্ধান" },
  searchPlaceholder: { en: "Search pages, departments, doctors…", bn: "পৃষ্ঠা, বিভাগ, ডাক্তার খুঁজুন…" },
  home: { en: "Home", bn: "হোম" },
  medicalCare: { en: "Medical Care", bn: "চিকিৎসা সেবা" },
  medicalEducation: { en: "Medical Education", bn: "চিকিৎসা শিক্ষা" },
} as const;

/* ──────────────────────────────────────────────────────────────────────────
   FOOTER
   ────────────────────────────────────────────────────────────────────────── */

export const footer = {
  columns: [
    {
      title: { en: "Medical Care", bn: "চিকিৎসা সেবা" },
      links: [
        { slug: "medical-care", label: { en: "Hospital Overview", bn: "হাসপাতাল পরিচিতি" } },
        { slug: "medical-care", label: { en: "Clinical Departments", bn: "ক্লিনিক্যাল বিভাগ" } },
        { slug: "medical-care", label: { en: "Emergency", bn: "জরুরি বিভাগ" } },
        { slug: "medical-care", label: { en: "Patient Services", bn: "রোগী সেবা" } },
      ],
    },
    {
      title: { en: "Medical Education", bn: "চিকিৎসা শিক্ষা" },
      links: [
        { slug: "medical-education", label: { en: "MBBS Programme", bn: "এমবিবিএস কোর্স" } },
        { slug: "admissions", label: { en: "Admissions", bn: "ভর্তি" } },
        { slug: "medical-education", label: { en: "Curriculum", bn: "পাঠ্যক্রম" } },
        { slug: "medical-education", label: { en: "Faculty", bn: "শিক্ষকমণ্ডলী" } },
      ],
    },
    {
      title: { en: "Institution", bn: "প্রতিষ্ঠান" },
      links: [
        { slug: "about", label: { en: "About SAMC", bn: "SAMC সম্পর্কে" } },
        { slug: "research", label: { en: "Research & Innovation", bn: "গবেষণা ও উদ্ভাবন" } },
        { slug: "people", label: { en: "People & Community", bn: "জনগণ ও সমাজ" } },
        { slug: "careers", label: { en: "Careers", bn: "কর্মসংস্থান" } },
      ],
    },
    {
      title: { en: "Resources", bn: "রিসোর্স" },
      links: [
        { slug: "downloads", label: { en: "Download Center", bn: "ডাউনলোড সেন্টার" } },
        { slug: "brand", label: { en: "Brand & 77 Library", bn: "ব্র্যান্ড ও ৭৭ লাইব্রেরি" } },
        { slug: "contact", label: { en: "Contact", bn: "যোগাযোগ" } },
        { slug: "news", label: { en: "News & Events", bn: "সংবাদ ও ইভেন্ট" } },
      ],
    },
  ],
  legal: [
    { slug: "privacy", label: { en: "Privacy", bn: "গোপনীয়তা" } },
    { slug: "terms", label: { en: "Terms", bn: "শর্তাবলী" } },
    { slug: "accessibility", label: { en: "Accessibility", bn: "অ্যাক্সেসিবিলিটি" } },
  ],
} as const;

/* ──────────────────────────────────────────────────────────────────────────
   HOMEPAGE
   ────────────────────────────────────────────────────────────────────────── */

export const home = {
  hero: {
    eyebrow: { en: "SOUTH APOLLO MEDICAL COLLEGE & HOSPITAL · ESTD: 2021", bn: "সাউথ অ্যাপোলো মেডিকেল কলেজ ও হাসপাতাল · প্রতিষ্ঠিত: ২০২১" },
    title: { en: "Care. Knowledge. Integrity.", bn: "সেবা। জ্ঞান। সততা।" },
    lead: {
      en: "One institution with two missions — caring for patients and developing medical professionals — connected by evidence and research.",
      bn: "একটি প্রতিষ্ঠান, দুটি মিশন — রোগীর সেবা এবং চিকিৎসা পেশাজীবী গড়ে তোলা — যা প্রমাণ ও গবেষণার মাধ্যমে সংযুক্ত।",
    },
    cta: { en: "Explore SAMC", bn: "SAMC দেখুন" },
    secondary: { en: "বাংলায় দেখুন", bn: "View in English" },
    imageAlt: {
      en: "South Apollo Medical College & Hospital campus",
      bn: "সাউথ অ্যাপোলো মেডিকেল কলেজ ও হাসপাতাল ক্যাম্পাস",
    },
  },
  intro: {
    eyebrow: { en: "INSTITUTIONAL INTRODUCTION", bn: "প্রাতিষ্ঠানিক পরিচিতি" },
    title: { en: "A serious medical institution.", bn: "একটি গুরুত্বপূর্ণ চিকিৎসা প্রতিষ্ঠান।" },
    body: {
      en: "SAMC brings together a teaching hospital and a medical college on one campus. Clinical care, professional education and research reinforce one another so that learning improves care and care informs learning.",
      bn: "SAMC একটি ক্যাম্পাসে একটি টিচিং হাসপাতাল ও একটি মেডিকেল কলেজকে একত্রিত করে। চিকিৎসা সেবা, পেশাগত শিক্ষা ও গবেষণা একে অপরকে শক্তিশালী করে — যাতে শিক্ষা সেবার মান বাড়ায় এবং সেবা শিক্ষাকে সমৃদ্ধ করে।",
    },
  },
  twoCores: {
    eyebrow: { en: "TWO CORE DIVISIONS", bn: "দুটি মূল বিভাগ" },
    title: { en: "One institution. Two missions.", bn: "একটি প্রতিষ্ঠান। দুটি মিশন।" },
    care: {
      tag: { en: "CORE 01", bn: "কোর ০১" },
      title: { en: "Medical Care Services", bn: "চিকিৎসা সেবা" },
      purpose: { en: "We care for patients.", bn: "আমরা রোগীর সেবা করি।" },
      areas: {
        en: ["Clinical Services", "Emergency & Critical Care", "Diagnostic Services", "Surgical & Procedural Services", "Nursing Services", "Pharmacy", "Rehabilitation", "Blood Transfusion", "Infection Prevention & Control", "Patient Safety", "Clinical Quality", "Patient Experience"],
        bn: ["ক্লিনিক্যাল সেবা", "জরুরি ও ক্রিটিক্যাল কেয়ার", "ডায়াগনস্টিক সেবা", "সার্জিক্যাল ও প্রসিডিউরাল সেবা", "নার্সিং সেবা", "ফার্মেসি", "পুনর্বাসন", "রক্ত সঞ্চালন", "সংক্রমণ প্রতিরোধ ও নিয়ন্ত্রণ", "রোগী নিরাপত্তা", "ক্লিনিক্যাল গুণমান", "রোগীর অভিজ্ঞতা"],
      },
    },
    education: {
      tag: { en: "CORE 02", bn: "কোর ০২" },
      title: { en: "Medical Professional Education", bn: "চিকিৎসা পেশাগত শিক্ষা" },
      purpose: { en: "We develop professionals.", bn: "আমরা পেশাজীবী গড়ে তুলি।" },
      areas: {
        en: ["Undergraduate Medical Education (MBBS)", "Basic & Pre-Clinical Sciences", "Clinical Medical Education", "Medical Education Unit", "Assessment & Examinations", "Simulation & Skills Centre", "Faculty Development", "Student Affairs", "Academic Registry", "Library & Learning Resources", "Postgraduate / Professional Training", "CME / CPD", "Academic Quality", "Accreditation"],
        bn: ["স্নাতক চিকিৎসা শিক্ষা (এমবিবিএস)", "বেসিক ও প্রি-ক্লিনিক্যাল সায়েন্স", "ক্লিনিক্যাল চিকিৎসা শিক্ষা", "মেডিকেল এডুকেশন ইউনিট", "মূল্যায়ন ও পরীক্ষা", "সিমুলেশন ও স্কিলস সেন্টার", "শিক্ষক উন্নয়ন", "শিক্ষার্থী বিষয়ক", "একাডেমিক রেজিস্ট্রি", "লাইব্রেরি ও শিক্ষা উপকরণ", "স্নাতকোত্তর / পেশাগত প্রশিক্ষণ", "সিএমই / সিপিডি", "একাডেমিক গুণমান", "অ্যাক্রেডিটেশন"],
      },
    },
    nexus: {
      tag: { en: "CLINICAL–ACADEMIC NEXUS", bn: "ক্লিনিক্যাল–একাডেমিক সংযোগ" },
      flow: { en: "CARE → LEARNING → EVIDENCE → BETTER CARE", bn: "সেবা → শিক্ষা → প্রমাণ → উন্নত সেবা" },
    },
  },
  research: {
    eyebrow: { en: "RESEARCH & INNOVATION", bn: "গবেষণা ও উদ্ভাবন" },
    title: { en: "Institution-wide research.", bn: "প্রতিষ্ঠানব্যাপী গবেষণা।" },
    body: {
      en: "Research & Innovation connects Medical Care Services and Medical Professional Education — turning clinical experience into evidence and evidence into better care.",
      bn: "গবেষণা ও উদ্ভাবন চিকিৎসা সেবা এবং চিকিৎসা পেশাগত শিক্ষাকে সংযুক্ত করে — ক্লিনিক্যাল অভিজ্ঞতাকে প্রমাণে এবং প্রমাণকে উন্নত সেবায় রূপান্তরিত করে।",
    },
    areas: {
      en: ["Clinical Research", "Educational Research", "Translational Research", "Laboratory Research", "Public Health Research", "Medical Technology", "Innovation", "Publications", "Research Ethics", "Research Partnerships", "Conferences", "Grants", "Knowledge Translation"],
      bn: ["ক্লিনিক্যাল গবেষণা", "শিক্ষা গবেষণা", "ট্রান্সলেশনাল গবেষণা", "ল্যাবরেটরি গবেষণা", "জনস্বাস্থ্য গবেষণা", "মেডিকেল টেকনোলজি", "উদ্ভাবন", "প্রকাশনা", "গবেষণা নীতি", "গবেষণা অংশীদারিত্ব", "সম্মেলন", "অনুদান", "জ্ঞান অনুবাদ"],
    },
  },
  departments: {
    eyebrow: { en: "DEPARTMENTS & SERVICES", bn: "বিভাগ ও সেবা" },
    title: { en: "Every department supports two mandates.", bn: "প্রতিটি বিভাগ দুটি দায়িত্ব পালন করে।" },
    body: {
      en: "Each clinical department carries a clinical mandate for patient care and an academic mandate for professional education.",
      bn: "প্রতিটি ক্লিনিক্যাল বিভাগ রোগীর সেবার জন্য ক্লিনিক্যাল দায়িত্ব এবং পেশাগত শিক্ষার জন্য একাডেমিক দায়িত্ব বহন করে।",
    },
    clinical: { en: "Clinical mandate", bn: "ক্লিনিক্যাল দায়িত্ব" },
    academic: { en: "Academic mandate", bn: "একাডেমিক দায়িত্ব" },
    list: {
      en: ["Medicine", "Surgery", "Obstetrics & Gynaecology", "Paediatrics", "Orthopaedics", "ENT", "Ophthalmology", "Dermatology"],
      bn: ["মেডিসিন", "সার্জারি", "প্রসূতি ও স্ত্রীরোগ", "শিশু", "অর্থোপেডিকস", "ইএনটি", "চক্ষু", "চর্ম"],
    },
  },
  admissions: {
    eyebrow: { en: "ADMISSIONS", bn: "ভর্তি" },
    title: { en: "Begin your medical education.", bn: "আপনার চিকিৎসা শিক্ষা শুরু করুন।" },
    body: {
      en: "Admission to the MBBS programme follows national procedures. Verified eligibility, seat numbers, fees and dates will be published here once confirmed.",
      bn: "এমবিবিএস কোর্সে ভর্তি জাতীয় পদ্ধতি অনুসরণ করে। যাচাইকৃত যোগ্যতা, আসন সংখ্যা, ফি ও তারিখ নিশ্চিত হওয়ার পর এখানে প্রকাশ করা হবে।",
    },
    cta: { en: "Admissions information", bn: "ভর্তি তথ্য" },
  },
  patient: {
    eyebrow: { en: "PATIENT SERVICES", bn: "রোগী সেবা" },
    title: { en: "Find care, step by step.", bn: "ধাপে ধাপে সেবা খুঁজুন।" },
    journey: {
      en: ["Find a Service", "Department", "Doctor", "Appointment", "Visit", "Diagnostics", "Treatment", "Follow-up"],
      bn: ["সেবা খুঁজুন", "বিভাগ", "ডাক্তার", "অ্যাপয়েন্টমেন্ট", "পরিদর্শন", "ডায়াগনস্টিকস", "চিকিৎসা", "ফলো-আপ"],
    },
  },
  faculty: {
    eyebrow: { en: "FACULTY & DOCTORS", bn: "শিক্ষক ও ডাক্তার" },
    title: { en: "Verified profiles only.", bn: "শুধুমাত্র যাচাইকৃত প্রোফাইল।" },
    body: {
      en: "Doctor and faculty profiles are published only after institutional verification. No personnel details are invented.",
      bn: "ডাক্তার ও শিক্ষকের প্রোফাইল প্রাতিষ্ঠানিক যাচাইয়ের পরেই প্রকাশ করা হয়। কোনো ব্যক্তিগত তথ্য বানানো হয় না।",
    },
    cta: { en: "View directory", bn: "ডিরেক্টরি দেখুন" },
  },
  campus: {
    eyebrow: { en: "CAMPUS & FACILITIES", bn: "ক্যাম্পাস ও সুবিধা" },
    title: { en: "A campus built for care and learning.", bn: "সেবা ও শিক্ষার জন্য নির্মিত ক্যাম্পাস।" },
    body: {
      en: "The college, hospital and student accommodation share one campus. HD photography will be published as verified images become available.",
      bn: "কলেজ, হাসপাতাল ও শিক্ষার্থী আবাসন একটি ক্যাম্পাসে অবস্থিত। যাচাইকৃত ছবি পাওয়া গেলে HD ফটোগ্রাফি প্রকাশ করা হবে।",
    },
  },
  news: {
    eyebrow: { en: "NEWS & EVENTS", bn: "সংবাদ ও ইভেন্ট" },
    title: { en: "Institutional updates.", bn: "প্রাতিষ্ঠানিক আপডেট।" },
    body: {
      en: "Notices, events and announcements will be published here as they are issued.",
      bn: "নোটিশ, ইভেন্ট ও ঘোষণা জারি হওয়ার সাথে সাথে এখানে প্রকাশ করা হবে।",
    },
  },
  community: {
    eyebrow: { en: "PEOPLE & COMMUNITY", bn: "জনগণ ও সমাজ" },
    title: { en: "Serving the community.", bn: "সমাজের সেবায়।" },
    body: {
      en: "Community health, outreach and health awareness programmes connect the institution to the people it serves.",
      bn: "কমিউনিটি স্বাস্থ্য, আউটরিচ ও স্বাস্থ্য সচেতনতা কার্যক্রম প্রতিষ্ঠানকে তার সেবাগ্রহীতা জনগণের সাথে সংযুক্ত করে।",
    },
  },
  cta: {
    title: { en: "One institution. Two missions. One healthier tomorrow.", bn: "একটি প্রতিষ্ঠান। দুটি মিশন। একটি সুস্থ আগামী।" },
    body: {
      en: "Explore how medical care, professional education and research come together at SAMC.",
      bn: "SAMC-তে চিকিৎসা সেবা, পেশাগত শিক্ষা ও গবেষণা কীভাবে একত্রিত হয় তা জানুন।",
    },
    primary: { en: "Explore SAMC", bn: "SAMC দেখুন" },
    secondary: { en: "Contact us", bn: "যোগাযোগ করুন" },
  },
} as const;

/* ──────────────────────────────────────────────────────────────────────────
   SECTION PAGES
   ────────────────────────────────────────────────────────────────────────── */

export type SectionCard = { title: Bilingual; copy: Bilingual; status?: Bilingual };
export type SectionPage = {
  eyebrow: Bilingual;
  title: Bilingual;
  intro: Bilingual;
  system: "blue" | "green" | "purple";
  cards: SectionCard[];
  note?: Bilingual;
};

export const sections: Record<string, SectionPage> = {
  about: {
    eyebrow: { en: "ABOUT SAMC", bn: "SAMC সম্পর্কে" },
    title: { en: "One institution, two missions.", bn: "একটি প্রতিষ্ঠান, দুটি মিশন।" },
    intro: {
      en: "South Apollo Medical College & Hospital is a medical college and teaching hospital. This section presents its identity, governance, campus and quality framework.",
      bn: "সাউথ অ্যাপোলো মেডিকেল কলেজ ও হাসপাতাল একটি মেডিকেল কলেজ ও টিচিং হাসপাতাল। এই বিভাগে এর পরিচয়, পরিচালনা, ক্যাম্পাস ও গুণমান কাঠামো উপস্থাপন করা হয়েছে।",
    },
    system: "blue",
    cards: [
      { title: { en: "Overview", bn: "পরিচিতি" }, copy: { en: "Institutional identity, purpose and the relationship between care and education.", bn: "প্রাতিষ্ঠানিক পরিচয়, উদ্দেশ্য এবং সেবা ও শিক্ষার সম্পর্ক।" } },
      { title: { en: "Vision & Mission", bn: "দৃষ্টিভঙ্গি ও মিশন" }, copy: { en: "The institution’s stated vision and mission.", bn: "প্রতিষ্ঠানের ঘোষিত দৃষ্টিভঙ্গি ও মিশন।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Leadership", bn: "নেতৃত্ব" }, copy: { en: "Institutional leadership and executive roles.", bn: "প্রাতিষ্ঠানিক নেতৃত্ব ও নির্বাহী ভূমিকা।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Governance", bn: "পরিচালনা" }, copy: { en: "Governing body, institutional governance and executive leadership.", bn: "পরিচালনা পর্ষদ, প্রাতিষ্ঠানিক পরিচালনা ও নির্বাহী নেতৃত্ব।" } },
      { title: { en: "History", bn: "ইতিহাস" }, copy: { en: "Institutional history and milestones.", bn: "প্রাতিষ্ঠানিক ইতিহাস ও মাইলফলক।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Campus", bn: "ক্যাম্পাস" }, copy: { en: "College, hospital and student accommodation on one campus.", bn: "একটি ক্যাম্পাসে কলেজ, হাসপাতাল ও শিক্ষার্থী আবাসন।" } },
      { title: { en: "Quality & Accreditation", bn: "গুণমান ও অ্যাক্রেডিটেশন" }, copy: { en: "Quality framework and accreditation status.", bn: "গুণমান কাঠামো ও অ্যাক্রেডিটেশন অবস্থা।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
    ],
    note: {
      en: "Affiliation, regulatory approval and accreditation statements are published only after institutional verification.",
      bn: "অধিভুক্তি, নিয়ন্ত্রক অনুমোদন ও অ্যাক্রেডিটেশন বিবৃতি প্রাতিষ্ঠানিক যাচাইয়ের পরেই প্রকাশ করা হয়।",
    },
  },
  "medical-care": {
    eyebrow: { en: "MEDICAL CARE SERVICES", bn: "চিকিৎসা সেবা" },
    title: { en: "We care for patients.", bn: "আমরা রোগীর সেবা করি।" },
    intro: {
      en: "Medical Care Services covers clinical care, diagnostics, surgery, nursing, pharmacy and patient experience across the teaching hospital.",
      bn: "চিকিৎসা সেবা টিচিং হাসপাতালের ক্লিনিক্যাল সেবা, ডায়াগনস্টিকস, সার্জারি, নার্সিং, ফার্মেসি ও রোগীর অভিজ্ঞতা অন্তর্ভুক্ত করে।",
    },
    system: "green",
    cards: [
      { title: { en: "Hospital Overview", bn: "হাসপাতাল পরিচিতি" }, copy: { en: "An overview of the teaching hospital and its services.", bn: "টিচিং হাসপাতাল ও তার সেবাসমূহের পরিচিতি।" } },
      { title: { en: "Clinical Departments", bn: "ক্লিনিক্যাল বিভাগ" }, copy: { en: "Clinical departments across approved specialties.", bn: "অনুমোদিত বিশেষত্বের ক্লিনিক্যাল বিভাগসমূহ।" } },
      { title: { en: "Doctors & Specialists", bn: "ডাক্তার ও বিশেষজ্ঞ" }, copy: { en: "Verified doctor profiles.", bn: "যাচাইকৃত ডাক্তার প্রোফাইল।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Emergency", bn: "জরুরি বিভাগ" }, copy: { en: "Emergency and critical care information.", bn: "জরুরি ও ক্রিটিক্যাল কেয়ার তথ্য।" } },
      { title: { en: "Diagnostics", bn: "ডায়াগনস্টিকস" }, copy: { en: "Laboratory, radiology and imaging services.", bn: "ল্যাবরেটরি, রেডিওলজি ও ইমেজিং সেবা।" } },
      { title: { en: "Surgery", bn: "সার্জারি" }, copy: { en: "Surgical and procedural services.", bn: "সার্জিক্যাল ও প্রসিডিউরাল সেবা।" } },
      { title: { en: "Nursing", bn: "নার্সিং" }, copy: { en: "Nursing services and patient care.", bn: "নার্সিং সেবা ও রোগীর যত্ন।" } },
      { title: { en: "Pharmacy", bn: "ফার্মেসি" }, copy: { en: "Hospital pharmacy services.", bn: "হাসপাতাল ফার্মেসি সেবা।" } },
      { title: { en: "Patient Services", bn: "রোগী সেবা" }, copy: { en: "Patient rights, information and support.", bn: "রোগীর অধিকার, তথ্য ও সহায়তা।" } },
      { title: { en: "Patient Information", bn: "রোগীর তথ্য" }, copy: { en: "Visiting, admission and discharge information.", bn: "পরিদর্শন, ভর্তি ও ছাড়পত্রের তথ্য।" } },
      { title: { en: "Contact / Appointment", bn: "যোগাযোগ / অ্যাপয়েন্টমেন্ট" }, copy: { en: "Contact the hospital or request an appointment.", bn: "হাসপাতালে যোগাযোগ করুন বা অ্যাপয়েন্টমেন্টের অনুরোধ করুন।" } },
    ],
    note: {
      en: "Doctor names, departments, phone numbers, hours, bed counts, services and accreditations are never fabricated. Unavailable information is shown as a clearly-marked placeholder.",
      bn: "ডাক্তারের নাম, বিভাগ, ফোন নম্বর, সময়সূচি, শয্যা সংখ্যা, সেবা ও অ্যাক্রেডিটেশন কখনো বানানো হয় না। অনুপলব্ধ তথ্য স্পষ্টভাবে চিহ্নিত প্লেসহোল্ডার হিসেবে দেখানো হয়।",
    },
  },
  "medical-education": {
    eyebrow: { en: "MEDICAL PROFESSIONAL EDUCATION", bn: "চিকিৎসা পেশাগত শিক্ষা" },
    title: { en: "We develop professionals.", bn: "আমরা পেশাজীবী গড়ে তুলি।" },
    intro: {
      en: "Medical Professional Education covers the MBBS programme, academic departments, assessment, student affairs, faculty development and continuing education.",
      bn: "চিকিৎসা পেশাগত শিক্ষা এমবিবিএস কোর্স, একাডেমিক বিভাগ, মূল্যায়ন, শিক্ষার্থী বিষয়ক, শিক্ষক উন্নয়ন ও অব্যাহত শিক্ষা অন্তর্ভুক্ত করে।",
    },
    system: "blue",
    cards: [
      { title: { en: "MBBS Programme", bn: "এমবিবিএস কোর্স" }, copy: { en: "Undergraduate medical education programme.", bn: "স্নাতক চিকিৎসা শিক্ষা কোর্স।" } },
      { title: { en: "Academic Overview", bn: "একাডেমিক পরিচিতি" }, copy: { en: "Academic structure and standards.", bn: "একাডেমিক কাঠামো ও মানদণ্ড।" } },
      { title: { en: "Departments", bn: "বিভাগ" }, copy: { en: "Basic, pre-clinical and clinical departments.", bn: "বেসিক, প্রি-ক্লিনিক্যাল ও ক্লিনিক্যাল বিভাগ।" } },
      { title: { en: "Curriculum", bn: "পাঠ্যক্রম" }, copy: { en: "Curriculum framework and learning outcomes.", bn: "পাঠ্যক্রম কাঠামো ও শিক্ষার ফলাফল।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Admissions", bn: "ভর্তি" }, copy: { en: "Admission process and eligibility.", bn: "ভর্তি প্রক্রিয়া ও যোগ্যতা।" } },
      { title: { en: "Academic Calendar", bn: "একাডেমিক ক্যালেন্ডার" }, copy: { en: "Academic sessions and key dates.", bn: "একাডেমিক সেশন ও গুরুত্বপূর্ণ তারিখ।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Examinations", bn: "পরীক্ষা" }, copy: { en: "Assessment and examination information.", bn: "মূল্যায়ন ও পরীক্ষার তথ্য।" } },
      { title: { en: "Student Affairs", bn: "শিক্ষার্থী বিষয়ক" }, copy: { en: "Student support and services.", bn: "শিক্ষার্থী সহায়তা ও সেবা।" } },
      { title: { en: "Faculty", bn: "শিক্ষকমণ্ডলী" }, copy: { en: "Verified faculty profiles.", bn: "যাচাইকৃত শিক্ষক প্রোফাইল।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Library", bn: "লাইব্রেরি" }, copy: { en: "Library and learning resources.", bn: "লাইব্রেরি ও শিক্ষা উপকরণ।" } },
      { title: { en: "Simulation & Skills", bn: "সিমুলেশন ও স্কিলস" }, copy: { en: "Simulation and clinical skills training.", bn: "সিমুলেশন ও ক্লিনিক্যাল স্কিলস প্রশিক্ষণ।" } },
      { title: { en: "CME / CPD", bn: "সিএমই / সিপিডি" }, copy: { en: "Continuing medical education and professional development.", bn: "অব্যাহত চিকিৎসা শিক্ষা ও পেশাগত উন্নয়ন।" } },
    ],
    note: {
      en: "Affiliation, approval, seat numbers, tuition fees and accreditation are never invented. Unavailable information is shown as a clearly-marked placeholder.",
      bn: "অধিভুক্তি, অনুমোদন, আসন সংখ্যা, টিউশন ফি ও অ্যাক্রেডিটেশন কখনো বানানো হয় না। অনুপলব্ধ তথ্য স্পষ্টভাবে চিহ্নিত প্লেসহোল্ডার হিসেবে দেখানো হয়।",
    },
  },
  research: {
    eyebrow: { en: "RESEARCH & INNOVATION", bn: "গবেষণা ও উদ্ভাবন" },
    title: { en: "Evidence that improves care.", bn: "যে প্রমাণ সেবার মান বাড়ায়।" },
    intro: {
      en: "Research & Innovation is institution-wide, connecting clinical practice and professional education through evidence, ethics and collaboration.",
      bn: "গবেষণা ও উদ্ভাবন প্রতিষ্ঠানব্যাপী, যা প্রমাণ, নীতি ও সহযোগিতার মাধ্যমে ক্লিনিক্যাল অনুশীলন ও পেশাগত শিক্ষাকে সংযুক্ত করে।",
    },
    system: "purple",
    cards: [
      { title: { en: "Research Overview", bn: "গবেষণা পরিচিতি" }, copy: { en: "The institution’s research approach.", bn: "প্রতিষ্ঠানের গবেষণা পদ্ধতি।" } },
      { title: { en: "Research Areas", bn: "গবেষণা ক্ষেত্র" }, copy: { en: "Clinical, educational, translational and public health research.", bn: "ক্লিনিক্যাল, শিক্ষা, ট্রান্সলেশনাল ও জনস্বাস্থ্য গবেষণা।" } },
      { title: { en: "Clinical Research", bn: "ক্লিনিক্যাল গবেষণা" }, copy: { en: "Research grounded in patient care.", bn: "রোগীর সেবাভিত্তিক গবেষণা।" } },
      { title: { en: "Educational Research", bn: "শিক্ষা গবেষণা" }, copy: { en: "Research into medical education and assessment.", bn: "চিকিৎসা শিক্ষা ও মূল্যায়ন নিয়ে গবেষণা।" } },
      { title: { en: "Publications", bn: "প্রকাশনা" }, copy: { en: "Verified publications.", bn: "যাচাইকৃত প্রকাশনা।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Research Ethics", bn: "গবেষণা নীতি" }, copy: { en: "Ethical review and research governance.", bn: "নৈতিক পর্যালোচনা ও গবেষণা পরিচালনা।" } },
      { title: { en: "Innovation", bn: "উদ্ভাবন" }, copy: { en: "Medical technology and innovation.", bn: "মেডিকেল টেকনোলজি ও উদ্ভাবন।" } },
      { title: { en: "Partnerships", bn: "অংশীদারিত্ব" }, copy: { en: "Research partnerships and collaboration.", bn: "গবেষণা অংশীদারিত্ব ও সহযোগিতা।" } },
    ],
    note: {
      en: "Research claims, publications and results are published only after verification.",
      bn: "গবেষণা দাবি, প্রকাশনা ও ফলাফল যাচাইয়ের পরেই প্রকাশ করা হয়।",
    },
  },
  people: {
    eyebrow: { en: "PEOPLE & COMMUNITY", bn: "জনগণ ও সমাজ" },
    title: { en: "Serving the community.", bn: "সমাজের সেবায়।" },
    intro: {
      en: "People & Community covers community health, outreach, health awareness, student and faculty life, events and community programmes.",
      bn: "জনগণ ও সমাজ কমিউনিটি স্বাস্থ্য, আউটরিচ, স্বাস্থ্য সচেতনতা, শিক্ষার্থী ও শিক্ষক জীবন, ইভেন্ট এবং কমিউনিটি কার্যক্রম অন্তর্ভুক্ত করে।",
    },
    system: "green",
    cards: [
      { title: { en: "Community Health", bn: "কমিউনিটি স্বাস্থ্য" }, copy: { en: "Community health programmes.", bn: "কমিউনিটি স্বাস্থ্য কার্যক্রম।" } },
      { title: { en: "Outreach", bn: "আউটরিচ" }, copy: { en: "Health outreach activities.", bn: "স্বাস্থ্য আউটরিচ কার্যক্রম।" } },
      { title: { en: "Health Awareness", bn: "স্বাস্থ্য সচেতনতা" }, copy: { en: "Public health awareness.", bn: "জনস্বাস্থ্য সচেতনতা।" } },
      { title: { en: "Student Life", bn: "শিক্ষার্থী জীবন" }, copy: { en: "Student activities and co-curricular life.", bn: "শিক্ষার্থী কার্যক্রম ও সহপাঠক্রমিক জীবন।" } },
      { title: { en: "Faculty Life", bn: "শিক্ষক জীবন" }, copy: { en: "Faculty community and development.", bn: "শিক্ষক সমাজ ও উন্নয়ন।" } },
      { title: { en: "Events", bn: "ইভেন্ট" }, copy: { en: "Institutional events.", bn: "প্রাতিষ্ঠানিক ইভেন্ট।" } },
      { title: { en: "Community Programs", bn: "কমিউনিটি কার্যক্রম" }, copy: { en: "Programmes serving the community.", bn: "সমাজের সেবায় কার্যক্রম।" } },
    ],
  },
  news: {
    eyebrow: { en: "NEWS & EVENTS", bn: "সংবাদ ও ইভেন্ট" },
    title: { en: "Institutional updates.", bn: "প্রাতিষ্ঠানিক আপডেট।" },
    intro: {
      en: "Notices, events and announcements from across the institution.",
      bn: "প্রতিষ্ঠানজুড়ে নোটিশ, ইভেন্ট ও ঘোষণা।",
    },
    system: "blue",
    cards: [
      { title: { en: "Notices", bn: "নোটিশ" }, copy: { en: "Official institutional notices.", bn: "প্রাতিষ্ঠানিক নোটিশ।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Events", bn: "ইভেন্ট" }, copy: { en: "Upcoming and past events.", bn: "আসন্ন ও পূর্ববর্তী ইভেন্ট।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Announcements", bn: "ঘোষণা" }, copy: { en: "Institutional announcements.", bn: "প্রাতিষ্ঠানিক ঘোষণা।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
    ],
  },
  admissions: {
    eyebrow: { en: "ADMISSIONS", bn: "ভর্তি" },
    title: { en: "Admissions to the MBBS programme.", bn: "এমবিবিএস কোর্সে ভর্তি।" },
    intro: {
      en: "Admission to the MBBS programme follows national procedures. Verified eligibility, seat numbers, fees and dates will be published here once confirmed.",
      bn: "এমবিবিএস কোর্সে ভর্তি জাতীয় পদ্ধতি অনুসরণ করে। যাচাইকৃত যোগ্যতা, আসন সংখ্যা, ফি ও তারিখ নিশ্চিত হওয়ার পর এখানে প্রকাশ করা হবে।",
    },
    system: "blue",
    cards: [
      { title: { en: "Eligibility", bn: "যোগ্যতা" }, copy: { en: "Eligibility criteria for admission.", bn: "ভর্তির যোগ্যতার মানদণ্ড।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Application Process", bn: "আবেদন প্রক্রিয়া" }, copy: { en: "How to apply.", bn: "কীভাবে আবেদন করবেন।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Seat Numbers", bn: "আসন সংখ্যা" }, copy: { en: "Approved seat numbers.", bn: "অনুমোদিত আসন সংখ্যা।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Fees", bn: "ফি" }, copy: { en: "Tuition and other fees.", bn: "টিউশন ও অন্যান্য ফি।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Important Dates", bn: "গুরুত্বপূর্ণ তারিখ" }, copy: { en: "Admission dates and deadlines.", bn: "ভর্তির তারিখ ও সময়সীমা।" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Downloads", bn: "ডাউনলোড" }, copy: { en: "Admission forms and documents.", bn: "ভর্তি ফরম ও নথি।" } },
    ],
    note: {
      en: "Fees, seat numbers, dates and eligibility are never invented. Unavailable information is shown as a clearly-marked placeholder.",
      bn: "ফি, আসন সংখ্যা, তারিখ ও যোগ্যতা কখনো বানানো হয় না। অনুপলব্ধ তথ্য স্পষ্টভাবে চিহ্নিত প্লেসহোল্ডার হিসেবে দেখানো হয়।",
    },
  },
  careers: {
    eyebrow: { en: "CAREERS", bn: "কর্মসংস্থান" },
    title: { en: "Work at SAMC.", bn: "SAMC-তে কাজ করুন।" },
    intro: {
      en: "Clinical, academic and administrative opportunities across the institution.",
      bn: "প্রতিষ্ঠানজুড়ে ক্লিনিক্যাল, একাডেমিক ও প্রশাসনিক সুযোগ।",
    },
    system: "blue",
    cards: [
      { title: { en: "Clinical Roles", bn: "ক্লিনিক্যাল পদ" }, copy: { en: "Medical, nursing and allied clinical roles.", bn: "চিকিৎসা, নার্সিং ও সংশ্লিষ্ট ক্লিনিক্যাল পদ।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Academic Roles", bn: "একাডেমিক পদ" }, copy: { en: "Faculty and academic roles.", bn: "শিক্ষক ও একাডেমিক পদ।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Administrative Roles", bn: "প্রশাসনিক পদ" }, copy: { en: "Administrative and support roles.", bn: "প্রশাসনিক ও সহায়ক পদ।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
    ],
  },
  contact: {
    eyebrow: { en: "CONTACT", bn: "যোগাযোগ" },
    title: { en: "Contact SAMC.", bn: "SAMC-তে যোগাযোগ করুন।" },
    intro: {
      en: "Official contact details are published only after verification. Until then, clearly-marked placeholders are shown.",
      bn: "অফিসিয়াল যোগাযোগের তথ্য যাচাইয়ের পরেই প্রকাশ করা হয়। ততক্ষণ স্পষ্টভাবে চিহ্নিত প্লেসহোল্ডার দেখানো হয়।",
    },
    system: "blue",
    cards: [
      { title: { en: "Address", bn: "ঠিকানা" }, copy: { en: "[OFFICIAL ADDRESS]", bn: "[অফিসিয়াল ঠিকানা]" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Phone", bn: "ফোন" }, copy: { en: "[OFFICIAL PHONE]", bn: "[অফিসিয়াল ফোন]" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Email", bn: "ইমেইল" }, copy: { en: "[OFFICIAL EMAIL]", bn: "[অফিসিয়াল ইমেইল]" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Emergency", bn: "জরুরি" }, copy: { en: "[EMERGENCY CONTACT]", bn: "[জরুরি যোগাযোগ]" }, status: { en: "To be confirmed", bn: "নিশ্চিত করতে হবে" } },
      { title: { en: "Appointment", bn: "অ্যাপয়েন্টমেন্ট" }, copy: { en: "Appointment system coming soon.", bn: "অ্যাপয়েন্টমেন্ট সিস্টেম শীঘ্রই আসছে।" } },
    ],
  },
  downloads: {
    eyebrow: { en: "DOWNLOAD CENTER", bn: "ডাউনলোড সেন্টার" },
    title: { en: "Documents and resources.", bn: "নথি ও রিসোর্স।" },
    intro: {
      en: "Official documents are published with title, language, document type, date, version and file size.",
      bn: "অফিসিয়াল নথি শিরোনাম, ভাষা, নথির ধরন, তারিখ, সংস্করণ ও ফাইল সাইজসহ প্রকাশ করা হয়।",
    },
    system: "blue",
    cards: [
      { title: { en: "Admission", bn: "ভর্তি" }, copy: { en: "Admission forms and notices.", bn: "ভর্তি ফরম ও নোটিশ।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Academic", bn: "একাডেমিক" }, copy: { en: "Academic documents.", bn: "একাডেমিক নথি।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Hospital", bn: "হাসপাতাল" }, copy: { en: "Hospital documents.", bn: "হাসপাতাল নথি।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Patient", bn: "রোগী" }, copy: { en: "Patient information sheets.", bn: "রোগীর তথ্য পত্র।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Research", bn: "গবেষণা" }, copy: { en: "Research documents.", bn: "গবেষণা নথি।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Governance", bn: "পরিচালনা" }, copy: { en: "Governance documents.", bn: "পরিচালনা নথি।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Forms", bn: "ফরম" }, copy: { en: "Institutional forms.", bn: "প্রাতিষ্ঠানিক ফরম।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Policies", bn: "নীতি" }, copy: { en: "Institutional policies.", bn: "প্রাতিষ্ঠানিক নীতি।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Reports", bn: "রিপোর্ট" }, copy: { en: "Institutional reports.", bn: "প্রাতিষ্ঠানিক রিপোর্ট।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Brand Assets", bn: "ব্র্যান্ড অ্যাসেট" }, copy: { en: "Logos, guidelines and templates.", bn: "লোগো, গাইডলাইন ও টেমপ্লেট।" } },
    ],
  },
  brand: {
    eyebrow: { en: "BRAND & 77 CREATIVE LIBRARY", bn: "ব্র্যান্ড ও ৭৭ ক্রিয়েটিভ লাইব্রেরি" },
    title: { en: "One master identity.", bn: "একটি মাস্টার পরিচয়।" },
    intro: {
      en: "SAMC uses one master crest with approved applications. The 77 Creative Library defines the institution’s production taxonomy across three visual systems.",
      bn: "SAMC একটি মাস্টার ক্রেস্ট এবং অনুমোদিত প্রয়োগ ব্যবহার করে। ৭৭ ক্রিয়েটিভ লাইব্রেরি তিনটি ভিজ্যুয়াল সিস্টেমে প্রতিষ্ঠানের প্রোডাকশন ট্যাক্সোনমি নির্ধারণ করে।",
    },
    system: "blue",
    cards: [
      { title: { en: "Master Crest", bn: "মাস্টার ক্রেস্ট" }, copy: { en: "The authoritative SAMC crest — never redrawn, recolored or replaced.", bn: "প্রামাণ্য SAMC ক্রেস্ট — কখনো পুনরায় আঁকা, রঙ পরিবর্তন বা প্রতিস্থাপন করা হয় না।" } },
      { title: { en: "Logo Family", bn: "লোগো পরিবার" }, copy: { en: "Seven approved logo applications for light, dark, monochrome and production use.", bn: "লাইট, ডার্ক, মনোক্রোম ও প্রোডাকশন ব্যবহারের জন্য সাতটি অনুমোদিত লোগো প্রয়োগ।" } },
      { title: { en: "Three Visual Systems", bn: "তিনটি ভিজ্যুয়াল সিস্টেম" }, copy: { en: "Blue Professional, Green Wellness and Purple Innovation — one page uses one system.", bn: "ব্লু প্রফেশনাল, গ্রিন ওয়েলনেস ও পার্পল ইনোভেশন — একটি পৃষ্ঠা একটি সিস্টেম ব্যবহার করে।" } },
      { title: { en: "77 Creative Library", bn: "৭৭ ক্রিয়েটিভ লাইব্রেরি" }, copy: { en: "77 creative types across stationery, signage, campaigns, digital and environmental applications.", bn: "স্টেশনারি, সাইনেজ, ক্যাম্পেইন, ডিজিটাল ও এনভায়রনমেন্টাল প্রয়োগে ৭৭ ধরনের ক্রিয়েটিভ।" } },
      { title: { en: "Typography", bn: "টাইপোগ্রাফি" }, copy: { en: "Aptos for English, Hind Siliguri for Bangla.", bn: "ইংরেজির জন্য Aptos, বাংলার জন্য Hind Siliguri।" } },
      { title: { en: "Color System", bn: "কালার সিস্টেম" }, copy: { en: "Crest-derived palette used intentionally across the institution.", bn: "ক্রেস্ট-উদ্ভূত প্যালেট প্রতিষ্ঠানজুড়ে সচেতনভাবে ব্যবহৃত।" } },
    ],
  },
  privacy: {
    eyebrow: { en: "PRIVACY", bn: "গোপনীয়তা" },
    title: { en: "Privacy & patient dignity.", bn: "গোপনীয়তা ও রোগীর মর্যাদা।" },
    intro: {
      en: "Photography and content respect patient consent, privacy, dignity and confidentiality. Identifiable patient information is never published without authorization.",
      bn: "ফটোগ্রাফি ও কনটেন্ট রোগীর সম্মতি, গোপনীয়তা, মর্যাদা ও গোপনীয়তা রক্ষা করে। অনুমোদন ছাড়া শনাক্তযোগ্য রোগীর তথ্য কখনো প্রকাশ করা হয় না।",
    },
    system: "blue",
    cards: [
      { title: { en: "Patient Consent", bn: "রোগীর সম্মতি" }, copy: { en: "Photography respects patient consent and dignity.", bn: "ফটোগ্রাফি রোগীর সম্মতি ও মর্যাদা রক্ষা করে।" } },
      { title: { en: "Data Collection", bn: "ডেটা সংগ্রহ" }, copy: { en: "Privacy-conscious analytics only; no unnecessary sensitive patient information.", bn: "শুধুমাত্র গোপনীয়তা-সচেতন অ্যানালিটিক্স; অপ্রয়োজনীয় সংবেদনশীল রোগীর তথ্য নয়।" } },
      { title: { en: "Confidentiality", bn: "গোপনীয়তা" }, copy: { en: "Patient confidentiality is protected.", bn: "রোগীর গোপনীয়তা সুরক্ষিত।" } },
    ],
  },
  terms: {
    eyebrow: { en: "TERMS", bn: "শর্তাবলী" },
    title: { en: "Terms of use.", bn: "ব্যবহারের শর্তাবলী।" },
    intro: {
      en: "Terms governing the use of this website will be published here.",
      bn: "এই ওয়েবসাইট ব্যবহারের শর্তাবলী এখানে প্রকাশ করা হবে।",
    },
    system: "blue",
    cards: [
      { title: { en: "Website Use", bn: "ওয়েবসাইট ব্যবহার" }, copy: { en: "Terms for using this website.", bn: "এই ওয়েবসাইট ব্যবহারের শর্ত।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
      { title: { en: "Content", bn: "কনটেন্ট" }, copy: { en: "Content ownership and use.", bn: "কনটেন্টের মালিকানা ও ব্যবহার।" }, status: { en: "To be provided", bn: "প্রদান করতে হবে" } },
    ],
  },
  accessibility: {
    eyebrow: { en: "ACCESSIBILITY", bn: "অ্যাক্সেসিবিলিটি" },
    title: { en: "Accessibility statement.", bn: "অ্যাক্সেসিবিলিটি বিবৃতি।" },
    intro: {
      en: "This website targets WCAG 2.2 AA: keyboard navigation, focus states, sufficient contrast, semantic HTML, alt text, accessible forms, reduced-motion support and no color-only communication.",
      bn: "এই ওয়েবসাইট WCAG 2.2 AA লক্ষ্য করে: কীবোর্ড নেভিগেশন, ফোকাস স্টেট, পর্যাপ্ত কনট্রাস্ট, সেমান্টিক HTML, অল্ট টেক্সট, অ্যাক্সেসিবল ফরম, রিডিউসড-মোশন সাপোর্ট এবং শুধুমাত্র রঙের মাধ্যমে যোগাযোগ নয়।",
    },
    system: "blue",
    cards: [
      { title: { en: "Keyboard Navigation", bn: "কীবোর্ড নেভিগেশন" }, copy: { en: "All interactive elements are keyboard accessible.", bn: "সব ইন্টারঅ্যাকটিভ উপাদান কীবোর্ড দিয়ে ব্যবহারযোগ্য।" } },
      { title: { en: "Contrast", bn: "কনট্রাস্ট" }, copy: { en: "Text and controls meet contrast requirements.", bn: "টেক্সট ও কন্ট্রোল কনট্রাস্টের শর্ত পূরণ করে।" } },
      { title: { en: "Reduced Motion", bn: "রিডিউসড মোশন" }, copy: { en: "Motion respects prefers-reduced-motion.", bn: "মোশন prefers-reduced-motion সম্মান করে।" } },
      { title: { en: "Bilingual", bn: "দ্বিভাষিক" }, copy: { en: "English and Bangla are equal institutional languages.", bn: "ইংরেজি ও বাংলা সমান প্রাতিষ্ঠানিক ভাষা।" } },
    ],
  },
};

export const sectionSlugs = Object.keys(sections);

/* ──────────────────────────────────────────────────────────────────────────
   GOVERNANCE & ORGANISATION
   Conceptual structure only — no statutory claims. Roles are institutional
   descriptors; named office-holders are never invented.
   ────────────────────────────────────────────────────────────────────────── */

export const governance = {
  eyebrow: { en: "INSTITUTIONAL GOVERNANCE", bn: "প্রাতিষ্ঠানিক পরিচালনা" },
  title: { en: "Governance and academic authority.", bn: "পরিচালনা ও একাডেমিক কর্তৃত্ব।" },
  intro: {
    en: "SAMC is one institution with two operating divisions. Governance, clinical authority and academic authority are kept distinct so that clinical decisions remain professionally governed and academic standards are visibly protected.",
    bn: "SAMC একটি প্রতিষ্ঠান, যার দুটি পরিচালন বিভাগ রয়েছে। পরিচালনা, ক্লিনিক্যাল কর্তৃত্ব ও একাডেমিক কর্তৃত্ব আলাদা রাখা হয় — যাতে ক্লিনিক্যাল সিদ্ধান্ত পেশাগতভাবে পরিচালিত থাকে এবং একাডেমিক মান স্পষ্টভাবে সুরক্ষিত থাকে।",
  },
  spine: {
    en: ["General Body / Ownership", "Governing Body", "Institutional Governance", "Executive Leadership", "Medical Care Services + Medical Professional Education + Research & Innovation"],
    bn: ["সাধারণ পরিষদ / মালিকানা", "পরিচালনা পর্ষদ", "প্রাতিষ্ঠানিক পরিচালনা", "নির্বাহী নেতৃত্ব", "চিকিৎসা সেবা + চিকিৎসা পেশাগত শিক্ষা + গবেষণা ও উদ্ভাবন"],
  },
  clinicalAuthority: {
    title: { en: "Clinical authority", bn: "ক্লিনিক্যাল কর্তৃত্ব" },
    note: { en: "Clinical decisions remain professionally governed.", bn: "ক্লিনিক্যাল সিদ্ধান্ত পেশাগতভাবে পরিচালিত থাকে।" },
    roles: {
      en: ["Hospital Director / COO", "Medical Director / CMO", "Nursing Director / CNO", "Academic leadership", "Finance leadership", "Quality & Patient Safety"],
      bn: ["হাসপাতাল পরিচালক / সিওও", "মেডিকেল ডিরেক্টর / সিএমও", "নার্সিং ডিরেক্টর / সিএনও", "একাডেমিক নেতৃত্ব", "অর্থ নেতৃত্ব", "গুণমান ও রোগী নিরাপত্তা"],
    },
  },
  academicAuthority: {
    title: { en: "Academic authority", bn: "একাডেমিক কর্তৃত্ব" },
    note: { en: "Ownership does not override academic standards.", bn: "মালিকানা একাডেমিক মানকে অতিক্রম করে না।" },
    roles: {
      en: ["Academic Council", "Dean / Academic leadership", "Registrar", "Controller of Examinations", "Medical Education Unit", "Student Affairs", "Faculty Development", "Assessment", "Research"],
      bn: ["একাডেমিক কাউন্সিল", "ডিন / একাডেমিক নেতৃত্ব", "রেজিস্ট্রার", "পরীক্ষা নিয়ন্ত্রক", "মেডিকেল এডুকেশন ইউনিট", "শিক্ষার্থী বিষয়ক", "শিক্ষক উন্নয়ন", "মূল্যায়ন", "গবেষণা"],
    },
  },
  committees: {
    title: { en: "Committee map", bn: "কমিটি মানচিত্র" },
    groups: [
      {
        title: { en: "Statutory", bn: "বিধিবদ্ধ" },
        items: {
          en: ["Management Committee", "Finance Committee", "Academic Committee", "Quality Control of Education Committee"],
          bn: ["ব্যবস্থাপনা কমিটি", "অর্থ কমিটি", "একাডেমিক কমিটি", "শিক্ষার গুণমান নিয়ন্ত্রণ কমিটি"],
        },
      },
      {
        title: { en: "Clinical governance", bn: "ক্লিনিক্যাল পরিচালনা" },
        items: {
          en: ["Medical Advisory", "Mortality & Morbidity", "Infection Prevention & Control", "Pharmacy & Therapeutics", "Transfusion", "Radiation Safety", "Patient Safety & Incident Review"],
          bn: ["মেডিকেল অ্যাডভাইজরি", "মৃত্যু ও রোগতত্ত্ব", "সংক্রমণ প্রতিরোধ ও নিয়ন্ত্রণ", "ফার্মেসি ও থেরাপিউটিকস", "রক্ত সঞ্চালন", "রেডিয়েশন নিরাপত্তা", "রোগী নিরাপত্তা ও ঘটনা পর্যালোচনা"],
        },
      },
      {
        title: { en: "Academic", bn: "একাডেমিক" },
        items: {
          en: ["Admission Committee", "Examination Committee", "Research Ethics Committee", "Anti-ragging / Discipline"],
          bn: ["ভর্তি কমিটি", "পরীক্ষা কমিটি", "গবেষণা নীতি কমিটি", "র্যাগিং বিরোধী / শৃঙ্খলা"],
        },
      },
      {
        title: { en: "Corporate", bn: "কর্পোরেট" },
        items: {
          en: ["Audit & Risk", "Procurement / Tender", "Fire & Disaster Management", "Grievance Redress", "Sexual Harassment Prevention"],
          bn: ["অডিট ও ঝুঁকি", "ক্রয় / টেন্ডার", "অগ্নি ও দুর্যোগ ব্যবস্থাপনা", "অভিযোগ নিষ্পত্তি", "যৌন হয়রানি প্রতিরোধ"],
        },
      },
    ],
  },
  note: {
    en: "This is a conceptual governance structure. Statutory composition, office-holders and regulatory representation are published only after institutional verification.",
    bn: "এটি একটি ধারণাগত পরিচালনা কাঠামো। বিধিবদ্ধ গঠন, পদাধিকারী ও নিয়ন্ত্রক প্রতিনিধিত্ব প্রাতিষ্ঠানিক যাচাইয়ের পরেই প্রকাশ করা হয়।",
  },
} as const;

/* ──────────────────────────────────────────────────────────────────────────
   DEPARTMENTS (academic + clinical)
   ────────────────────────────────────────────────────────────────────────── */

export const departments = {
  basic: {
    title: { en: "Basic & pre-clinical departments", bn: "বেসিক ও প্রি-ক্লিনিক্যাল বিভাগ" },
    items: {
      en: ["Anatomy", "Physiology", "Biochemistry", "Pharmacology", "Pathology", "Microbiology", "Forensic Medicine", "Community Medicine"],
      bn: ["অ্যানাটমি", "ফিজিওলজি", "বায়োকেমিস্ট্রি", "ফার্মাকোলজি", "প্যাথলজি", "মাইক্রোবায়োলজি", "ফরেনসিক মেডিসিন", "কমিউনিটি মেডিসিন"],
    },
  },
  clinical: {
    title: { en: "Clinical departments", bn: "ক্লিনিক্যাল বিভাগ" },
    items: {
      en: ["Medicine", "Surgery", "Obstetrics & Gynaecology", "Paediatrics", "Orthopaedics", "Ophthalmology", "ENT", "Dermatology", "Psychiatry", "Radiology", "Anaesthesiology", "Cardiology", "Neurology", "Nephrology", "Urology", "Neurosurgery", "Oncology"],
      bn: ["মেডিসিন", "সার্জারি", "প্রসূতি ও স্ত্রীরোগ", "শিশু", "অর্থোপেডিকস", "চক্ষু", "ইএনটি", "চর্ম", "মনোরোগ", "রেডিওলজি", "অ্যানেস্থেসিওলজি", "কার্ডিওলজি", "নিউরোলজি", "নেফ্রোলজি", "ইউরোলজি", "নিউরোসার্জারি", "অনকোলজি"],
    },
  },
  note: {
    en: "Department availability, faculty and services are published only after institutional verification.",
    bn: "বিভাগের প্রাপ্যতা, শিক্ষক ও সেবা প্রাতিষ্ঠানিক যাচাইয়ের পরেই প্রকাশ করা হয়।",
  },
} as const;

/* ──────────────────────────────────────────────────────────────────────────
   LOGO FAMILY (approved applications of one master identity)
   ────────────────────────────────────────────────────────────────────────── */

export const logoFamily = [
  { id: "01", name: { en: "Full-color crest / transparent", bn: "ফুল-কালার ক্রেস্ট / ট্রান্সপারেন্ট" }, use: { en: "Primary institutional master — website, digital platforms, presentations, prospectus, admissions, social media.", bn: "প্রধান প্রাতিষ্ঠানিক মাস্টার — ওয়েবসাইট, ডিজিটাল প্ল্যাটফর্ম, প্রেজেন্টেশন, প্রসপেক্টাস, ভর্তি, সোশ্যাল মিডিয়া।" }, asset: "/samc/brand/samc-crest-color.png" },
  { id: "02", name: { en: "Full-color crest / white", bn: "ফুল-কালার ক্রেস্ট / সাদা" }, use: { en: "Letterhead, reports, printed publications, reception identity, formal profiles.", bn: "লেটারহেড, রিপোর্ট, মুদ্রিত প্রকাশনা, রিসেপশন পরিচয়, আনুষ্ঠানিক প্রোফাইল।" }, asset: "/samc/brand/samc-crest-color-on-white.png" },
  { id: "03", name: { en: "Black crest / transparent", bn: "কালো ক্রেস্ট / ট্রান্সপারেন্ট" }, use: { en: "Internal documents, research papers, forms, HR and procurement documents, B/W printing.", bn: "অভ্যন্তরীণ নথি, গবেষণা পত্র, ফরম, এইচআর ও ক্রয় নথি, সাদা-কালো মুদ্রণ।" }, asset: "/samc/brand/samc-crest-black.png" },
  { id: "04", name: { en: "Black crest / pure white", bn: "কালো ক্রেস্ট / বিশুদ্ধ সাদা" }, use: { en: "Board papers, legal agreements, government submissions, certificates, transcripts, accreditation.", bn: "বোর্ড পেপার, আইনি চুক্তি, সরকারি দাখিল, সার্টিফিকেট, ট্রান্সক্রিপ্ট, অ্যাক্রেডিটেশন।" }, asset: "/samc/brand/samc-crest-black.png" },
  { id: "05", name: { en: "White crest / transparent", bn: "সাদা ক্রেস্ট / ট্রান্সপারেন্ট" }, use: { en: "Dark website sections, dark navigation, dark presentations, uniforms, vehicles, signage, video end cards.", bn: "ডার্ক ওয়েবসাইট সেকশন, ডার্ক নেভিগেশন, ডার্ক প্রেজেন্টেশন, ইউনিফর্ম, যানবাহন, সাইনেজ, ভিডিও এন্ড কার্ড।" }, asset: "/samc/brand/samc-crest-white.png" },
  { id: "06", name: { en: "White crest / pure black", bn: "সাদা ক্রেস্ট / বিশুদ্ধ কালো" }, use: { en: "Black signage, plaques, premium merchandise, black apparel, stage/backdrop, commemorative materials.", bn: "কালো সাইনেজ, প্লাক, প্রিমিয়াম মার্চেন্ডাইজ, কালো পোশাক, স্টেজ/ব্যাকড্রপ, স্মারক সামগ্রী।" }, asset: "/samc/brand/samc-crest-white-on-black.png" },
  { id: "07", name: { en: "One-color production master", bn: "এক-রঙ প্রোডাকশন মাস্টার" }, use: { en: "Embroidery, laser engraving, embossing, rubber stamps, screen printing, metal/CNC engraving. Vendors must not redraw.", bn: "এমব্রয়ডারি, লেজার এনগ্রেভিং, এমবসিং, রাবার স্ট্যাম্প, স্ক্রিন প্রিন্টিং, মেটাল/সিএনসি এনগ্রেভিং। ভেন্ডর পুনরায় আঁকবে না।" }, asset: "/samc/brand/samc-crest-black.png" },
] as const;

/* ──────────────────────────────────────────────────────────────────────────
   SEO
   ────────────────────────────────────────────────────────────────────────── */

export const seo = {
  title: {
    en: "South Apollo Medical College & Hospital (SAMC) — Care. Knowledge. Integrity.",
    bn: "সাউথ অ্যাপোলো মেডিকেল কলেজ ও হাসপাতাল (SAMC) — সেবা। জ্ঞান। সততা।",
  },
  description: {
    en: "South Apollo Medical College & Hospital (SAMC, ESTD: 2021) — a medical college and teaching hospital with two missions: medical care services and medical professional education.",
    bn: "সাউথ অ্যাপোলো মেডিকেল কলেজ ও হাসপাতাল (SAMC, প্রতিষ্ঠিত: ২০২১) — একটি মেডিকেল কলেজ ও টিচিং হাসপাতাল, দুটি মিশনসহ: চিকিৎসা সেবা এবং চিকিৎসা পেশাগত শিক্ষা।",
  },
} as const;
