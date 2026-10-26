import { ArrowRight, ArrowUpRight } from "lucide-react";
import { home, identity, t, ui, type Lang } from "./content";
import { SamcLink } from "./samc-header";
import { Card, Notice, PhotoPlaceholder, SectionHead } from "./samc-ui";

export function SamcHome({ lang }: { lang: Lang }) {
  const otherLang: Lang = lang === "en" ? "bn" : "en";

  return (
    <>
      {/* Hero */}
      <section className="samc-hero">
        <div className="samc-container samc-hero-inner">
          <div className="samc-hero-copy">
            <span className="samc-eyebrow">{t(home.hero.eyebrow, lang)}</span>
            <h1>{t(home.hero.title, lang)}</h1>
            <p className="samc-hero-lead">{t(home.hero.lead, lang)}</p>
            <div className="samc-hero-actions">
              <SamcLink lang={lang} href="about" className="samc-button">
                {t(home.hero.cta, lang)} <ArrowRight size={17} aria-hidden="true" />
              </SamcLink>
              <SamcLink lang={otherLang} className="samc-button samc-button--outline">
                {t(home.hero.secondary, lang)}
              </SamcLink>
            </div>
          </div>
          <div className="samc-hero-crest">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/samc/brand/samc-crest-white.png" alt={`${identity.fullName} crest`} width={340} height={340} />
          </div>
        </div>
      </section>

      {/* Institutional introduction */}
      <section className="samc-section">
        <div className="samc-container">
          <SectionHead eyebrow={home.intro.eyebrow} title={home.intro.title} body={home.intro.body} lang={lang} />
          <PhotoPlaceholder label={t(home.hero.imageAlt, lang)} note="HD_PHOTO_HOSPITAL_01" lang={lang} />
        </div>
      </section>

      {/* Two core divisions */}
      <section className="samc-section samc-section--surface">
        <div className="samc-container">
          <SectionHead eyebrow={home.twoCores.eyebrow} title={home.twoCores.title} lang={lang} />
          <div className="samc-cores">
            <article className="samc-core">
              <span className="samc-card-tag">{t(home.twoCores.care.tag, lang)}</span>
              <h3>{t(home.twoCores.care.title, lang)}</h3>
              <p className="samc-core-purpose">{t(home.twoCores.care.purpose, lang)}</p>
              <ul>
                {home.twoCores.care.areas[lang].map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </article>

            <div className="samc-nexus">
              <span className="samc-card-tag">{t(home.twoCores.nexus.tag, lang)}</span>
              <p className="samc-nexus-flow">{t(home.twoCores.nexus.flow, lang)}</p>
            </div>

            <article className="samc-core">
              <span className="samc-card-tag">{t(home.twoCores.education.tag, lang)}</span>
              <h3>{t(home.twoCores.education.title, lang)}</h3>
              <p className="samc-core-purpose">{t(home.twoCores.education.purpose, lang)}</p>
              <ul>
                {home.twoCores.education.areas[lang].map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Research & Innovation */}
      <section className="samc-section">
        <div className="samc-container">
          <SectionHead eyebrow={home.research.eyebrow} title={home.research.title} body={home.research.body} lang={lang} />
          <div className="samc-grid samc-grid--4">
            {home.research.areas[lang].map((area) => (
              <div className="samc-card" key={area}>
                <h3 style={{ fontSize: 15 }}>{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="samc-section samc-section--surface">
        <div className="samc-container">
          <SectionHead eyebrow={home.departments.eyebrow} title={home.departments.title} body={home.departments.body} lang={lang} />
          <div className="samc-grid samc-grid--4">
            {home.departments.list[lang].map((dept) => (
              <article className="samc-card" key={dept}>
                <h3>{dept}</h3>
                <p style={{ marginTop: 10 }}>
                  <strong>{t(home.departments.clinical, lang)}:</strong> {t({ en: "Patient care", bn: "রোগীর সেবা" }, lang)}
                </p>
                <p style={{ marginTop: 4 }}>
                  <strong>{t(home.departments.academic, lang)}:</strong> {t({ en: "Professional education", bn: "পেশাগত শিক্ষা" }, lang)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions + Patient services */}
      <section className="samc-section">
        <div className="samc-container samc-grid samc-grid--2">
          <div>
            <SectionHead eyebrow={home.admissions.eyebrow} title={home.admissions.title} body={home.admissions.body} lang={lang} />
            <SamcLink lang={lang} href="admissions" className="samc-button">
              {t(home.admissions.cta, lang)} <ArrowUpRight size={16} aria-hidden="true" />
            </SamcLink>
          </div>
          <div>
            <SectionHead eyebrow={home.patient.eyebrow} title={home.patient.title} lang={lang} />
            <div className="samc-journey">
              {home.patient.journey[lang].map((step, index) => (
                <span key={step}>
                  {step}
                  {index < home.patient.journey[lang].length - 1 && <i aria-hidden="true"> →</i>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty & Doctors */}
      <section className="samc-section samc-section--surface">
        <div className="samc-container">
          <SectionHead eyebrow={home.faculty.eyebrow} title={home.faculty.title} body={home.faculty.body} lang={lang} />
          <div className="samc-grid samc-grid--3">
            <Card title={t({ en: "Doctors", bn: "ডাক্তার" }, lang)} copy={t({ en: "[DOCTOR PROFILE TO BE PROVIDED]", bn: "[ডাক্তার প্রোফাইল প্রদান করতে হবে]" }, lang)} status={t({ en: "To be provided", bn: "প্রদান করতে হবে" }, lang)} />
            <Card title={t({ en: "Faculty", bn: "শিক্ষকমণ্ডলী" }, lang)} copy={t({ en: "[FACULTY PROFILE TO BE PROVIDED]", bn: "[শিক্ষক প্রোফাইল প্রদান করতে হবে]" }, lang)} status={t({ en: "To be provided", bn: "প্রদান করতে হবে" }, lang)} />
            <Card title={t({ en: "Directory", bn: "ডিরেক্টরি" }, lang)} copy={t({ en: "Searchable directory of verified personnel.", bn: "যাচাইকৃত ব্যক্তিদের অনুসন্ধানযোগ্য ডিরেক্টরি।" }, lang)} />
          </div>
        </div>
      </section>

      {/* Campus */}
      <section className="samc-section">
        <div className="samc-container">
          <SectionHead eyebrow={home.campus.eyebrow} title={home.campus.title} body={home.campus.body} lang={lang} />
          <div className="samc-grid samc-grid--3">
            <PhotoPlaceholder label={t({ en: "College building", bn: "কলেজ ভবন" }, lang)} note="HD_PHOTO_CAMPUS_01" lang={lang} />
            <PhotoPlaceholder label={t({ en: "Hospital", bn: "হাসপাতাল" }, lang)} note="HD_PHOTO_HOSPITAL_01" lang={lang} />
            <PhotoPlaceholder label={t({ en: "Learning spaces", bn: "শিক্ষার স্থান" }, lang)} note="HD_PHOTO_STUDENTS_01" lang={lang} />
          </div>
        </div>
      </section>

      {/* News & Community */}
      <section className="samc-section samc-section--surface">
        <div className="samc-container samc-grid samc-grid--2">
          <div>
            <SectionHead eyebrow={home.news.eyebrow} title={home.news.title} body={home.news.body} lang={lang} />
            <SamcLink lang={lang} href="news" className="samc-button samc-button--outline">
              {t(ui.readMore, lang)} <ArrowUpRight size={16} aria-hidden="true" />
            </SamcLink>
          </div>
          <div>
            <SectionHead eyebrow={home.community.eyebrow} title={home.community.title} body={home.community.body} lang={lang} />
            <SamcLink lang={lang} href="people" className="samc-button samc-button--outline">
              {t(ui.learnMore, lang)} <ArrowUpRight size={16} aria-hidden="true" />
            </SamcLink>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="samc-section">
        <div className="samc-container">
          <div className="samc-cta">
            <h2>{t(home.cta.title, lang)}</h2>
            <p>{t(home.cta.body, lang)}</p>
            <div className="samc-cta-actions">
              <SamcLink lang={lang} href="about" className="samc-button">
                {t(home.cta.primary, lang)} <ArrowRight size={17} aria-hidden="true" />
              </SamcLink>
              <SamcLink lang={lang} href="contact" className="samc-button samc-button--outline">
                {t(home.cta.secondary, lang)}
              </SamcLink>
            </div>
          </div>
          <Notice>{t(ui.placeholderNotice, lang)}</Notice>
        </div>
      </section>
    </>
  );
}
