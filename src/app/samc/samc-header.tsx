"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { identity, nav, t, ui, type Lang } from "./content";

/** Build a language-aware SAMC link. */
export function samcHref(lang: Lang, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `/samc/${lang}/${clean}` : `/samc/${lang}`;
}

type SamcLinkProps = {
  lang: Lang;
  href?: string;
  className?: string;
  children: React.ReactNode;
  "aria-current"?: "page" | undefined;
  onClick?: () => void;
};

export function SamcLink({ lang, href = "", className, children, onClick, ...rest }: SamcLinkProps) {
  return (
    <Link href={samcHref(lang, href)} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export function LanguageSwitch({ lang, path = "" }: { lang: Lang; path?: string }) {
  const other: Lang = lang === "en" ? "bn" : "en";
  return (
    <div className="samc-lang" role="group" aria-label={t(ui.language, lang)}>
      <Link href={samcHref("en", path)} aria-current={lang === "en" ? "true" : undefined} lang="en">
        EN
      </Link>
      <Link href={samcHref("bn", path)} aria-current={lang === "bn" ? "true" : undefined} lang="bn">
        বাংলা
      </Link>
      <span hidden>{other}</span>
    </div>
  );
}

export function SamcHeader({ lang, path = "" }: { lang: Lang; path?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (slug: string) => pathname === `/samc/${lang}/${slug}` || pathname.startsWith(`/samc/${lang}/${slug}/`);

  return (
    <>
      <a href="#samc-main" className="samc-skip">
        {t(ui.skipToContent, lang)}
      </a>
      <header className="samc-header">
        <div className="samc-container samc-header-inner">
          <SamcLink lang={lang} className="samc-brand" aria-label={`${identity.fullName} — ${t(ui.home, lang)}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/samc/brand/samc-crest-color.png" alt={`${identity.shortName} crest`} width={46} height={46} />
            <span className="samc-brand-text">
              <span className="samc-brand-name">{identity.fullName}</span>
              <span className="samc-brand-sub">{identity.shortName} · {identity.established}</span>
            </span>
          </SamcLink>

          <nav className="samc-nav" aria-label={t(ui.menu, lang)}>
            {nav.map((item) => (
              <SamcLink key={item.slug} lang={lang} href={item.slug} aria-current={isActive(item.slug) ? "page" : undefined}>
                {t(item.label, lang)}
              </SamcLink>
            ))}
          </nav>

          <div className="samc-header-actions">
            <LanguageSwitch lang={lang} path={path} />
            <button
              ref={toggle}
              type="button"
              className="samc-menu-toggle"
              aria-expanded={open}
              aria-controls="samc-mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              {t(ui.menu, lang)}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="samc-mobile-menu" id="samc-mobile-menu" role="dialog" aria-modal="true" aria-label={t(ui.menu, lang)}>
          <div className="samc-mobile-head">
            <SamcLink lang={lang} className="samc-brand" onClick={() => setOpen(false)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/samc/brand/samc-crest-color.png" alt={`${identity.shortName} crest`} width={40} height={40} />
              <span className="samc-brand-text">
                <span className="samc-brand-name">{identity.shortName}</span>
                <span className="samc-brand-sub">{identity.established}</span>
              </span>
            </SamcLink>
            <button type="button" className="samc-menu-toggle" onClick={() => setOpen(false)} aria-label={t(ui.close, lang)}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label={t(ui.menu, lang)}>
            {nav.map((item, index) => (
              <SamcLink key={item.slug} lang={lang} href={item.slug} onClick={() => setOpen(false)}>
                {t(item.label, lang)}
                <span>{String(index + 1).padStart(2, "0")}</span>
              </SamcLink>
            ))}
          </nav>
          <div className="samc-mobile-foot">
            <LanguageSwitch lang={lang} path={path} />
          </div>
        </div>
      )}
    </>
  );
}
