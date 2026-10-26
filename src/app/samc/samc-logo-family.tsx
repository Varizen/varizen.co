import { logoFamily, t, type Lang } from "./content";
import { Notice, SectionHead } from "./samc-ui";

export function SamcLogoFamily({ lang }: { lang: Lang }) {
  return (
    <section className="samc-section samc-section--surface">
      <div className="samc-container">
        <SectionHead
          eyebrow={{ en: "APPROVED LOGO FAMILY", bn: "অনুমোদিত লোগো পরিবার" }}
          title={{ en: "One master identity, multiple approved applications.", bn: "একটি মাস্টার পরিচয়, একাধিক অনুমোদিত প্রয়োগ।" }}
          body={{
            en: "The supplied SAMC crest is the authoritative visual identity. These are applications of one master identity — not separate brands. The crest is never redrawn, recolored, stretched or replaced.",
            bn: "প্রদত্ত SAMC ক্রেস্ট প্রামাণ্য ভিজ্যুয়াল পরিচয়। এগুলো একটি মাস্টার পরিচয়ের প্রয়োগ — আলাদা ব্র্যান্ড নয়। ক্রেস্ট কখনো পুনরায় আঁকা, রঙ পরিবর্তন, প্রসারিত বা প্রতিস্থাপন করা হয় না।",
          }}
          lang={lang}
        />
        <div className="samc-logo-grid">
          {logoFamily.map((logo) => (
            <article className="samc-logo-card" key={logo.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.asset} alt={`${t(logo.name, lang)} — SAMC crest`} width={120} height={120} />
              <div>
                <span className="samc-logo-id">{logo.id}</span>
                <h3>{t(logo.name, lang)}</h3>
                <p>{t(logo.use, lang)}</p>
              </div>
            </article>
          ))}
        </div>
        <Notice>
          {t(
            {
              en: "Decision engine: LIGHT + OFFICIAL → full color · FORMAL DOCUMENT → black · DARK → white · PURE WHITE MONOCHROME → black · PURE BLACK MONOCHROME → white · MANUFACTURING → one-color master. Never shrink the detailed crest until it becomes unreadable.",
              bn: "সিদ্ধান্ত ইঞ্জিন: লাইট + অফিসিয়াল → ফুল কালার · আনুষ্ঠানিক নথি → কালো · ডার্ক → সাদা · বিশুদ্ধ সাদা মনোক্রোম → কালো · বিশুদ্ধ কালো মনোক্রোম → সাদা · উৎপাদন → এক-রঙ মাস্টার। বিশদ ক্রেস্ট অ-পাঠযোগ্য হওয়া পর্যন্ত ছোট করা যাবে না।",
            },
            lang,
          )}
        </Notice>
      </div>
    </section>
  );
}
