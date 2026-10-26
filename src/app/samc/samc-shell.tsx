"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { sections, t, ui, type Lang } from "./content";
import { SamcFooter } from "./samc-footer";
import { SamcHeader } from "./samc-header";

/**
 * Client shell that derives the active visual system from the current route.
 * One page → one active visual system (blue / green / purple).
 */
export function SamcShell({ lang, year, children }: { lang: Lang; year: number; children: ReactNode }) {
  const pathname = usePathname();
  const prefix = `/samc/${lang}`;
  const rest = pathname.startsWith(prefix) ? pathname.slice(prefix.length).replace(/^\//, "") : "";
  const slug = rest.split("/")[0];
  const system = (slug && sections[slug]?.system) || "blue";

  return (
    <div className="samc-site" lang={lang} data-system={system}>
      <SamcHeader lang={lang} path={rest} />
      <div className="samc-emergency" role="region" aria-label={t(ui.emergency, lang)}>
        <div className="samc-container samc-emergency-inner">
          <strong>{t(ui.emergency, lang)}</strong>
          <span>{t(ui.emergencyTitle, lang)}</span>
          <span aria-hidden="true">·</span>
          <span>[EMERGENCY CONTACT]</span>
        </div>
      </div>
      <main id="samc-main">{children}</main>
      <SamcFooter lang={lang} year={year} />
    </div>
  );
}
