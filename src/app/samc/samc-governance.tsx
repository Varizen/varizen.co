import { governance, departments, t, type Lang } from "./content";
import { Notice, SectionHead } from "./samc-ui";

export function SamcGovernance({ lang }: { lang: Lang }) {
  return (
    <>
      <section className="samc-section samc-section--surface">
        <div className="samc-container">
          <SectionHead eyebrow={governance.eyebrow} title={governance.title} body={governance.intro} lang={lang} />

          <ol className="samc-spine">
            {governance.spine[lang].map((step, index) => (
              <li key={step}>
                <span className="samc-spine-index">{String(index + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="samc-grid samc-grid--2" style={{ marginTop: 32 }}>
            <article className="samc-card">
              <span className="samc-card-tag">{t(governance.clinicalAuthority.title, lang)}</span>
              <ul className="samc-role-list">
                {governance.clinicalAuthority.roles[lang].map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
              <p style={{ marginTop: 14, fontStyle: "italic" }}>{t(governance.clinicalAuthority.note, lang)}</p>
            </article>
            <article className="samc-card">
              <span className="samc-card-tag">{t(governance.academicAuthority.title, lang)}</span>
              <ul className="samc-role-list">
                {governance.academicAuthority.roles[lang].map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
              <p style={{ marginTop: 14, fontStyle: "italic" }}>{t(governance.academicAuthority.note, lang)}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="samc-section">
        <div className="samc-container">
          <h2 className="samc-subhead">{t(governance.committees.title, lang)}</h2>
          <div className="samc-grid samc-grid--4">
            {governance.committees.groups.map((group) => (
              <article className="samc-card" key={t(group.title, lang)}>
                <h3>{t(group.title, lang)}</h3>
                <ul className="samc-role-list">
                  {group.items[lang].map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <Notice>{t(governance.note, lang)}</Notice>
        </div>
      </section>

      <section className="samc-section samc-section--surface">
        <div className="samc-container">
          <div className="samc-grid samc-grid--2">
            <div>
              <h2 className="samc-subhead">{t(departments.basic.title, lang)}</h2>
              <ul className="samc-chip-list">
                {departments.basic.items[lang].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="samc-subhead">{t(departments.clinical.title, lang)}</h2>
              <ul className="samc-chip-list">
                {departments.clinical.items[lang].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <Notice>{t(departments.note, lang)}</Notice>
        </div>
      </section>
    </>
  );
}
