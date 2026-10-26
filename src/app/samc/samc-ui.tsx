import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { t, ui, type Lang } from "./content";

export function SectionHead({
  eyebrow,
  title,
  body,
  lang,
}: {
  eyebrow: { en: string; bn: string };
  title: { en: string; bn: string };
  body?: { en: string; bn: string };
  lang: Lang;
}) {
  return (
    <div className="samc-section-head">
      <span className="samc-eyebrow">{t(eyebrow, lang)}</span>
      <h2>{t(title, lang)}</h2>
      {body && <p>{t(body, lang)}</p>}
    </div>
  );
}

export function PhotoPlaceholder({ label, note, lang }: { label: string; note?: string; lang: Lang }) {
  return (
    <div className="samc-photo" role="img" aria-label={label}>
      <div>
        <span>{label}</span>
        <small>{note ?? t(ui.placeholderNotice, lang)}</small>
      </div>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="samc-notice" role="note">
      <Info size={18} aria-hidden="true" />
      <p style={{ margin: 0 }}>{children}</p>
    </div>
  );
}

export function Card({
  tag,
  title,
  copy,
  status,
}: {
  tag?: string;
  title: string;
  copy: string;
  status?: string;
}) {
  return (
    <article className="samc-card">
      {tag && <span className="samc-card-tag">{tag}</span>}
      <h3>{title}</h3>
      <p>{copy}</p>
      {status && <span className="samc-status">{status}</span>}
    </article>
  );
}
