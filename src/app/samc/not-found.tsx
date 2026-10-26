import Link from "next/link";
import { identity, ui } from "./content";

export default function SamcNotFound() {
  return (
    <div className="samc-site" lang="en" data-system="blue">
      <main id="samc-main">
        <section className="samc-404">
          <div className="samc-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/samc/brand/samc-crest-color.png"
              alt={`${identity.shortName} crest`}
              width={96}
              height={96}
              style={{ margin: "0 auto 24px" }}
            />
            <h1>{ui.notFoundTitle.en}</h1>
            <p lang="bn" style={{ marginTop: 8 }}>{ui.notFoundTitle.bn}</p>
            <p>{ui.notFoundBody.en}</p>
            <p lang="bn">{ui.notFoundBody.bn}</p>
            <div className="samc-404-actions">
              <Link href="/samc/en" className="samc-button">{ui.home.en}</Link>
              <Link href="/samc/en/medical-care" className="samc-button samc-button--outline">{ui.medicalCare.en}</Link>
              <Link href="/samc/en/medical-education" className="samc-button samc-button--outline">{ui.medicalEducation.en}</Link>
              <Link href="/samc/bn" className="samc-button samc-button--outline" lang="bn">{ui.home.bn}</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
