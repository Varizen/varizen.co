import { identity, footer, t, ui, type Lang } from "./content";
import { SamcLink } from "./samc-header";

export function SamcFooter({ lang, year }: { lang: Lang; year: number }) {
  return (
    <footer className="samc-footer">
      <div className="samc-container">
        <div className="samc-footer-top">
          <div className="samc-footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/samc/brand/samc-crest-white.png" alt={`${identity.shortName} crest`} width={56} height={56} />
            <div>
              <strong>{identity.fullName}</strong>
              <span>{identity.shortName} · {identity.established}</span>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div className="samc-footer-col" key={t(column.title, lang)}>
              <h3>{t(column.title, lang)}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={`${link.slug}-${t(link.label, lang)}`}>
                    <SamcLink lang={lang} href={link.slug}>{t(link.label, lang)}</SamcLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="samc-footer-bottom">
          <div className="samc-footer-legal">
            {footer.legal.map((link) => (
              <SamcLink key={link.slug} lang={lang} href={link.slug}>{t(link.label, lang)}</SamcLink>
            ))}
          </div>
          <span>© {year} {identity.shortName}. {t({ en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" }, lang)}</span>
        </div>

        <div className="samc-footer-placeholders">
          <span>{t({ en: "Address", bn: "ঠিকানা" }, lang)}: <code>[OFFICIAL ADDRESS]</code></span>
          <span>{t({ en: "Phone", bn: "ফোন" }, lang)}: <code>[OFFICIAL PHONE]</code></span>
          <span>{t({ en: "Email", bn: "ইমেইল" }, lang)}: <code>[OFFICIAL EMAIL]</code></span>
        </div>
        <p className="samc-footer-placeholders" style={{ marginTop: 10 }}>
          {t(ui.placeholderNotice, lang)}
        </p>
      </div>
    </footer>
  );
}
