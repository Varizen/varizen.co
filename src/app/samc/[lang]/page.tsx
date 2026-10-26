import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { identity, isLang, seo, t } from "../content";
import { SamcHome } from "../samc-home";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return {
    title: t(seo.title, lang),
    description: t(seo.description, lang),
    alternates: {
      canonical: `${identity.url}/${lang}`,
      languages: { en: `${identity.url}/en`, bn: `${identity.url}/bn`, "x-default": `${identity.url}/en` },
    },
  };
}

export default async function SamcHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <SamcHome lang={lang} />;
}

/** Homepage is the full frame — allow blocking render for instant params. */
export const instant = false;
