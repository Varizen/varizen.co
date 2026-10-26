import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { copyrightYear, identity, isLang, LANGS, seo, t } from "../content";
import { SamcShell } from "../samc-shell";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

/** The shell is the full page frame — allow blocking render for instant params. */
export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const base = identity.url;
  return {
    metadataBase: new URL(base),
    title: { default: t(seo.title, lang), template: `%s | ${identity.shortName}` },
    description: t(seo.description, lang),
    alternates: {
      canonical: `${base}/${lang}`,
      languages: {
        en: `${base}/en`,
        bn: `${base}/bn`,
        "x-default": `${base}/en`,
      },
    },
    openGraph: {
      type: "website",
      siteName: identity.fullName,
      title: t(seo.title, lang),
      description: t(seo.description, lang),
      url: `${base}/${lang}`,
      locale: lang === "bn" ? "bn_BD" : "en_US",
    },
  };
}

function StructuredData({ lang }: { lang: string }) {
  const base = identity.url;
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["CollegeOrUniversity", "MedicalOrganization", "Hospital"],
        "@id": `${base}/#organization`,
        name: identity.fullName,
        alternateName: identity.shortName,
        url: `${base}/${lang}`,
        foundingDate: "2021",
        description: t(seo.description, lang as "en" | "bn"),
        slogan: t(identity.philosophy, lang as "en" | "bn"),
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: identity.fullName,
        inLanguage: ["en", "bn"],
        publisher: { "@id": `${base}/#organization` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default async function SamcLangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <>
      <StructuredData lang={lang} />
      <SamcShell lang={lang} year={copyrightYear}>{children}</SamcShell>
    </>
  );
}
