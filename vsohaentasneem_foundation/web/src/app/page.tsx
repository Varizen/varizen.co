import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "iconoir-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="max-w-[800px]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--stfl-ink)] leading-tight mb-6">
              SohaelTasneem Foundation
            </h1>
            <p className="text-xl md:text-2xl text-[var(--stfl-text-secondary)] leading-relaxed mb-8">
              Building better futures through education, health, and community development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#081F2D] text-white font-semibold rounded-lg hover:bg-[#0B2B43] transition-colors shadow-md"
              >
                <span>Launch Live Demo Lab</span>
                <ArrowRight width={18} height={18} aria-hidden="true" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--stfl-accent)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                <span>16 Consoles Hub</span>
                <ArrowRight width={18} height={18} aria-hidden="true" />
              </Link>
              <Link
                href="/brand"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--stfl-ink)] border border-stone-300 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
              >
                Brand Guidelines
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-[var(--stfl-snow)] py-20 md:py-32">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--stfl-ink)] mb-6">
                  Who we are
                </h2>
                <p className="text-lg text-[var(--stfl-text-secondary)] leading-relaxed">
                  The SohaelTasneem Foundation is a humanitarian organization working across Bangladesh. 
                  We focus on creating sustainable change through community-led initiatives in education, 
                  healthcare, and social development.
                </p>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--stfl-ink)] mb-6">
                  Our approach
                </h2>
                <p className="text-lg text-[var(--stfl-text-secondary)] leading-relaxed">
                  We work directly with communities to identify needs and develop solutions. Our programs 
                  are designed to be sustainable, locally owned, and accountable to the people we serve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="py-20 md:py-32">
          <div className="max-w-[var(--stfl-max-width)] mx-auto px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--stfl-ink)] mb-12">
              Areas of work
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[var(--stfl-ink)]">
                  Education
                </h3>
                <p className="text-[var(--stfl-text-secondary)] leading-relaxed">
                  Supporting access to quality education and learning opportunities for underserved communities.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[var(--stfl-ink)]">
                  Health
                </h3>
                <p className="text-[var(--stfl-text-secondary)] leading-relaxed">
                  Improving healthcare access and promoting public health initiatives in vulnerable areas.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-[var(--stfl-ink)]">
                  Community Development
                </h3>
                <p className="text-[var(--stfl-text-secondary)] leading-relaxed">
                  Building resilient communities through economic opportunity and social infrastructure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[var(--stfl-ink)] text-white py-20 md:py-24">
          <div className="max-w-[var(--stfl-content-width)] mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Learn more about our work
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-[600px] mx-auto">
              For more information about the SohaelTasneem Foundation, our programs, 
              or how to get involved, please reach out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brand"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--stfl-ink)] font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                Brand Guidelines
                <ArrowRight width={18} height={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
