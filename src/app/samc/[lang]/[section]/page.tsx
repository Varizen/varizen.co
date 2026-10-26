import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { identity, isLang, LANGS, sections, sectionSlugs, t, ui } from "../../content";
import { SamcGovernance } from "../../samc-governance";
import { SamcLink } from "../../samc-header";
import { SamcLogoFamily } from "../../samc-logo-family";
import { Card, Notice } from "../../samc-ui";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => sectionSlugs.map((section) => ({ lang, section })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}): Promise<Metadata> {
  const { lang, section } = await params;
  const page = sections[section];
  if (!isLang(lang) || !page) return {};
  return {
    title: t(page.title, lang),
    description: t(page.intro, lang),
    alternates: {
      canonical: `${identity.url}/${lang}/${section}`,
      languages: {
        en: `${identity.url}/en/${section}`,
        bn: `${identity.url}/bn/${section}`,
        "x-default": `${identity.url}/en/${section}`,
      },
    },
  };
}

export default function SamcSectionPage({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  return (
    <Suspense fallback={<section className="samc-interior-hero" aria-busy="true" />}>
      <SectionContent params={params} />
    </Suspense>
  );
}

async function SectionContent({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  const { lang, section } = await params;
  const page = sections[section];
  if (!isLang(lang) || !page) notFound();

  return (
    <>
      <section className="samc-interior-hero">
        <div className="samc-container">
          <nav className="samc-breadcrumb" aria-label="Breadcrumb">
            <SamcLink lang={lang}>{t(ui.home, lang)}</SamcLink>
            <i aria-hidden="true">/</i>
            <span aria-current="page">{t(page.title, lang)}</span>
          </nav>
          <span className="samc-eyebrow">{t(page.eyebrow, lang)}</span>
          <h1>{t(page.title, lang)}</h1>
          <p>{t(page.intro, lang)}</p>
        </div>
      </section>

      <section className="samc-section">
        <div className="samc-container">
          <div className="samc-grid samc-grid--3">
            {page.cards.map((card) => (
              <Card
                key={t(card.title, lang)}
                title={t(card.title, lang)}
                copy={t(card.copy, lang)}
                status={card.status ? t(card.status, lang) : undefined}
              />
            ))}
          </div>

          {page.note && <Notice>{t(page.note, lang)}</Notice>}
        </div>
      </section>

      {section === "about" && <SamcGovernance lang={lang} />}
      {section === "brand" && <SamcLogoFamily lang={lang} />}

      <section className="samc-section">
        <div className="samc-container" style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <SamcLink lang={lang} href="contact" className="samc-button">
            {t({ en: "Contact SAMC", bn: "SAMC-তে যোগাযোগ" }, lang)} <ArrowUpRight size={16} aria-hidden="true" />
          </SamcLink>
          <SamcLink lang={lang} className="samc-button samc-button--outline">
            {t(ui.backHome, lang)}
          </SamcLink>
        </div>
      </section>
    </>
  );
}
