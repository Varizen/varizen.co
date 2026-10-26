import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircle,
  XmarkCircle,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  X,
  Mail,
} from "iconoir-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { canonical, FOUNDATION_ORIGIN, API_BASE_URL } from "@/src/lib/domains";

export const metadata: Metadata = {
  title: "Brandcentral — SohaelTasneem Foundation",
  description:
    "The official STFL Brand Guide. Premium, minimal, editorial identity for the SohaelTasneem Foundation.",
  openGraph: {
    title: "Brandcentral — SohaelTasneem Foundation",
    description:
      "The official STFL Brand Guide. Premium, minimal, editorial identity for the SohaelTasneem Foundation.",
    url: canonical("/brand"),
    type: "website",
  },
};

export default function BrandPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* Hero Section */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              STFL Brand Guidelines
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              The official brand identity system for SohaelTasneem Foundation. Premium,
              minimal, editorial, and completely original.
            </p>
          </div>
          <Image
            src="/stfl-logo-transparent.png"
            alt="STFL Logo — the complete identity mark"
            width={400}
            height={400}
            className="h-64 w-auto"
          />
        </section>

        {/* 01 — Brand Foundation */}
        <section id="foundation" className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">01</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Brand Foundation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  SohaelTasneem Foundation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  A humanitarian organization dedicated to education, health, and community
                  development across Bangladesh.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Brand Principles</h4>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Premium:</strong> Restrained, considered, never casual
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Minimal:</strong> Generous whitespace, few elements, clear hierarchy
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Editorial:</strong> Large typography, intentional composition
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Digital-first:</strong> Optimized for screens, responsive, accessible
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Human:</strong> Warm, deliberate, never mechanical
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Credible:</strong> No fake statistics, no overstatement
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">
                      <strong>Quietly confident:</strong> Let the work speak; no loud claims
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Voice and Tone</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  STFL communication is direct, respectful, and human. We speak to partners,
                  beneficiaries, and supporters as equals.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Do:</p>
                    <p className="text-gray-600 text-sm">
                      Be clear. Be specific. Be honest about what we have done and what remains.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Don't:</p>
                    <p className="text-gray-600 text-sm">
                      Make claims without evidence. Use jargon or emotional manipulation. Imitate
                      other organizations.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Identity</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Organization:</strong> SohaelTasneem Foundation
                  </p>
                  <p>
                    <strong>Short name:</strong> STFL
                  </p>
                  <p>
                    <strong>Primary domain:</strong> https://stflbd.org
                  </p>
                  <p>
                    <strong>Language:</strong> Bangla-first
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 — Logo System */}
        <section id="logo" className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">02</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Logo System</h2>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Primary Logo</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-12 flex items-center justify-center min-h-64">
                    <Image
                      src="/stfl-logo-transparent.png"
                      alt="STFL full-color logo on light background"
                      width={240}
                      height={240}
                      className="h-48 w-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Full-color on light background</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-900 rounded-lg p-12 flex items-center justify-center min-h-64">
                    <Image
                      src="/stfl-wordmark-white.png"
                      alt="STFL white wordmark on dark background"
                      width={240}
                      height={80}
                      className="h-16 w-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">White on dark background</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Logo Variants</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-12 flex items-center justify-center min-h-48">
                    <Image
                      src="/stfl-mark-transparent.png"
                      alt="STFL mark — compact emblem"
                      width={120}
                      height={120}
                      className="h-32 w-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Mark / emblem for compact contexts</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-12 flex items-center justify-center min-h-48">
                    <Image
                      src="/stfl-wordmark-transparent.png"
                      alt="STFL wordmark — horizontal text"
                      width={240}
                      height={60}
                      className="h-12 w-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Wordmark for horizontal layouts</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Approved Contexts</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-6">
                  <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle width={18} height={18} className="text-green-600" />
                    Do use the logo:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• On light, neutral backgrounds (white, off-white, light gray)</li>
                    <li>• On dark backgrounds (navy, charcoal) with the white wordmark</li>
                    <li>• At the head of documents, on websites, in presentations</li>
                    <li>• As the mark in app icons, favicons, and compact spaces</li>
                  </ul>
                </div>
                <div className="border border-red-200 bg-red-50 rounded-lg p-6">
                  <p className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <XmarkCircle width={18} height={18} className="text-red-600" />
                    Do not:
                  </p>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Alter, stretch, or rotate the logo</li>
                    <li>• Use the logo on overly busy or patterned backgrounds</li>
                    <li>• Combine the logo with other organization marks</li>
                    <li>• Use the logo in colors other than full-color or white</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03 — Logo Protection */}
        <section className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">03</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Logo Protection</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Clear Space</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Maintain a minimum clear space around the logo equal to the height of the
                  mark. No other elements may enter this zone.
                </p>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="border-2 border-dashed border-gray-400 p-8">
                    <Image
                      src="/stfl-mark-transparent.png"
                      alt="Logo with clear space demonstration"
                      width={80}
                      height={80}
                      className="h-16 w-auto mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Minimum Size</h4>
                <div className="space-y-3 text-sm">
                  <p>
                    <strong>Digital:</strong> Minimum 32px × 32px for the mark, 120px × 40px
                    for the full logo
                  </p>
                  <p>
                    <strong>Print:</strong> Minimum 1cm × 1cm for the mark, 5cm × 1.5cm for
                    the full logo
                  </p>
                  <p className="text-gray-600 mt-3">
                    Below these sizes, use the mark alone rather than the full logo.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Contrast</h4>
                <div className="space-y-3 text-sm">
                  <p>
                    The logo must have sufficient contrast against its background for
                    accessibility.
                  </p>
                  <p className="text-gray-600">
                    Use full-color on light backgrounds, white on dark backgrounds. Do not
                    place the logo on patterned or photographic backgrounds without a solid
                    underlay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 — Color System */}
        <section id="color" className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">04</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Color System</h2>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Core Palette</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div
                    className="w-full h-32 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: "#081F2D" }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">STFL Ink</p>
                    <p className="text-sm text-gray-600">#081F2D</p>
                    <p className="text-xs text-gray-500 mt-1">Primary text, headings</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className="w-full h-32 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: "#0B2B43" }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">STFL Deep Navy</p>
                    <p className="text-sm text-gray-600">#0B2B43</p>
                    <p className="text-xs text-gray-500 mt-1">Dark backgrounds, headers</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className="w-full h-32 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: "#FAFAF8" }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">STFL Snow</p>
                    <p className="text-sm text-gray-600">#FAFAF8</p>
                    <p className="text-xs text-gray-500 mt-1">Light backgrounds, cards</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className="w-full h-32 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: "#E7E7E2" }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">STFL Stone</p>
                    <p className="text-sm text-gray-600">#E7E7E2</p>
                    <p className="text-xs text-gray-500 mt-1">Borders, dividers</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Accent Colors</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div
                    className="w-full h-32 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: "#FF6B35" }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">STFL Accent</p>
                    <p className="text-sm text-gray-600">#FF6B35</p>
                    <p className="text-xs text-gray-500 mt-1">Primary CTA, buttons</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div
                    className="w-full h-32 rounded-lg border border-gray-200 shadow-sm"
                    style={{ backgroundColor: "#000000" }}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">STFL Black</p>
                    <p className="text-sm text-gray-600">#000000</p>
                    <p className="text-xs text-gray-500 mt-1">High contrast emphasis</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Usage Guidelines</h4>
              <div className="space-y-3 text-gray-700">
                <p>
                  • <strong>Navy:</strong> Primary dark surface for headers, heroes, and
                  top-level navigation
                </p>
                <p>
                  • <strong>Orange:</strong> Primary CTA button, leading stripe on accent
                  cards
                </p>
                <p>
                  • <strong>Accents (Red, Blue, Purple, Cyan, Green):</strong> Program
                  categories, small iconography; never as card backgrounds
                </p>
                <p>
                  • <strong>Stone/Snow:</strong> Borders, dividers, neutral backgrounds
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 05 — Typography */}
        <section id="typography" className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">05</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Typography</h2>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Type Families</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-8">
                    <p className="text-4xl font-bold text-gray-900 mb-2">বাংলা</p>
                    <p className="font-semibold text-gray-900">Bangla: Hind Siliguri</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Primary typeface for all Bangla text. Bundled in all digital products.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-8">
                    <p className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "system-ui" }}>
                      Abc
                    </p>
                    <p className="font-semibold text-gray-900">English: System Font</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Inter or system sans-serif for all English text in digital contexts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Type Scale</h3>
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <p style={{ fontSize: "40px", fontWeight: "700", lineHeight: "1.4" }}>
                    40px / 700
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Display Large — hero statement</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <p style={{ fontSize: "32px", fontWeight: "700", lineHeight: "1.4" }}>
                    32px / 700
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Display Medium — section hero</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <p style={{ fontSize: "26px", fontWeight: "700", lineHeight: "1.4" }}>
                    26px / 700
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Headline Large — screen title</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <p style={{ fontSize: "22px", fontWeight: "600", lineHeight: "1.4" }}>
                    22px / 600
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Headline Medium — section header</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <p style={{ fontSize: "16px", fontWeight: "400", lineHeight: "1.6" }}>
                    16px / 400
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Body Large — body copy</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <p style={{ fontSize: "14px", fontWeight: "400", lineHeight: "1.6" }}>
                    14px / 400
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Body Medium — secondary copy</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Principles</h4>
              <div className="space-y-3 text-gray-700">
                <p>
                  • <strong>Bangla-first:</strong> Type Bangla first, then fit English as a
                  companion
                </p>
                <p>
                  • <strong>Generous line height:</strong> Bangla matras and descenders require
                  1.45–1.6× the font size
                </p>
                <p>
                  • <strong>Scale responsively:</strong> Typography scales with the system font
                  size, up to 200%
                </p>
                <p>
                  • <strong>Hierarchy through weight and size:</strong> Never through color alone
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 06 — Digital Language */}
        <section className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">06</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Digital Language</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Navigation</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Clear, flat hierarchy. Primary navigation is top-level; secondary appears on
                  hover or in dropdowns. No mega-menus; maintain clarity.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Buttons</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Primary button: orange background, white text, 48px minimum height. Secondary:
                  outlined, gray border. Always center at least 48px height for touch targets.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Cards</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  White or Snow background, subtle border, optional accent stripe on the left
                  (4px). Never use accent color as card background.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Spacing</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Use a consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 56px. Generous
                  whitespace is a feature, not a luxury.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Photography</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Documentary, not staged. Real people, real contexts. Avoid stock imagery. Show
                  the work, not an idealized version.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Shadows & Depth</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Soft, consistent shadows. Dark blue-gray: rgba(7,27,43,.12). Never harsh
                  shadows; maintain the minimal aesthetic.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Accessibility</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  WCAG AA contrast (4.5:1 for body, 3:1 for large). All interactive elements
                  48px+. Support reduced motion. Provide alt text for all images.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Content-First Design</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Design containers around content, not the reverse. Reading paths are clear.
                  No decorative clutter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — Applications */}
        <section className="space-y-8">
          <div>
            <span className="text-sm font-semibold text-orange-600">07</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Brand Applications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Website</h4>
              <p className="text-sm text-gray-700">
                Bangla-first design, responsive layouts, large typography, generous whitespace.
                Logo in header. Primary CTA in orange. Accessible by default.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Android App</h4>
              <p className="text-sm text-gray-700">
                Exact same color palette and typography as the website. Responsive to 200% font
                scale. Bundled fonts ensure consistency across all devices.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
              <p className="text-sm text-gray-700">
                Logo on title page, top-left. Use navy headers and orange accents. Include page
                numbers. Follow the same hierarchy and spacing rules.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Social Media</h4>
              <p className="text-sm text-gray-700">
                Logo in profile image. Maintain consistent palette. Use the mark for square
                formats, full logo for wider fields. No filters or distortions.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Digital Materials</h4>
              <p className="text-sm text-gray-700">
                Email templates, presentations, infographics. Consistent spacing, typography,
                color. Logo and wordmark placement follows app/web guidelines.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Reporting</h4>
              <p className="text-sm text-gray-700">
                Annual reports, case studies, research publications. Premium design treatment.
                Use data visualization instead of decorative graphics. Always honest claims.
              </p>
            </div>
          </div>
        </section>

        {/* 08 — Governance */}
        <section className="space-y-8 pb-24">
          <div>
            <span className="text-sm font-semibold text-orange-600">08</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Governance</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Asset Usage</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                All STFL brand assets are canonical. Do not create variants. If a variant is
                needed, consult the STFL brand team before production.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Naming</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Use "STFL" in all formal contexts. "SohaelTasneem Foundation" in full for
                official documents. "The Foundation" in conversational contexts.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Approved Partners</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Partner logos appear only on explicit approval. Never combine marks without
                permission. STFL mark is always more prominent than partner mark.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Version & Support</h4>
              <p className="text-gray-700 leading-relaxed">
                This Brand Guide is version 1.0. For updates, clarifications, or asset requests,
                contact the STFL communications team.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer — OpenAI-style: full-screen tall, 6 columns */}
      <footer className="bg-[#0B2B43] text-white min-h-screen flex flex-col">
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 pt-24 pb-16">
          {/* Brand mark */}
          <div className="mb-20">
            <Image
              src="/stfl-mark-transparent.png"
              alt="STFL"
              width={56}
              height={56}
              className="h-14 w-auto mb-6"
            />
            <p className="text-2xl font-semibold tracking-tight">SohaelTasneem Foundation</p>
            <p className="text-white/50 text-sm mt-1">Building better futures</p>
          </div>

          {/* 6-column link grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Foundation</p>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#foundation" className="hover:text-white/70 transition-colors">About</a></li>
                <li><a href="#foundation" className="hover:text-white/70 transition-colors">Mission</a></li>
                <li><a href="#foundation" className="hover:text-white/70 transition-colors">Principles</a></li>
                <li><a href="#foundation" className="hover:text-white/70 transition-colors">Voice</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Logo</p>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#logo" className="hover:text-white/70 transition-colors">Logo System</a></li>
                <li><a href="#logo" className="hover:text-white/70 transition-colors">Clear Space</a></li>
                <li><a href="#logo" className="hover:text-white/70 transition-colors">Sizing</a></li>
                <li><a href="#logo" className="hover:text-white/70 transition-colors">Misuse</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Color</p>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#color" className="hover:text-white/70 transition-colors">Palette</a></li>
                <li><a href="#color" className="hover:text-white/70 transition-colors">Ink &amp; Navy</a></li>
                <li><a href="#color" className="hover:text-white/70 transition-colors">Accents</a></li>
                <li><a href="#color" className="hover:text-white/70 transition-colors">Usage</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Typography</p>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#typography" className="hover:text-white/70 transition-colors">Type Scale</a></li>
                <li><a href="#typography" className="hover:text-white/70 transition-colors">Hind Siliguri</a></li>
                <li><a href="#typography" className="hover:text-white/70 transition-colors">Hierarchy</a></li>
                <li><a href="#typography" className="hover:text-white/70 transition-colors">Line Height</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Resources</p>
              <ul className="space-y-3 text-[15px]">
                <li><a href={FOUNDATION_ORIGIN} className="hover:text-white/70 transition-colors">Website</a></li>
                <li><a href={API_BASE_URL} className="hover:text-white/70 transition-colors">API</a></li>
                <li><a href="/" className="hover:text-white/70 transition-colors">Home</a></li>
                <li><a href="#governance" className="hover:text-white/70 transition-colors">Governance</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">Legal</p>
              <ul className="space-y-3 text-[15px]">
                <li><a href="#governance" className="hover:text-white/70 transition-colors">Terms of Use</a></li>
                <li><a href="#governance" className="hover:text-white/70 transition-colors">Privacy Policy</a></li>
                <li><a href="#governance" className="hover:text-white/70 transition-colors">Asset License</a></li>
                <li><a href="#governance" className="hover:text-white/70 transition-colors">Permissions</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="w-full border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/50 text-sm">
              SohaelTasneem Foundation © 2001–{new Date().getFullYear()}
            </p>
            <div className="flex items-center gap-5 text-white/70">
              <span aria-label="Facebook" className="hover:text-white transition-colors cursor-pointer"><Facebook width={20} height={20} /></span>
              <span aria-label="Instagram" className="hover:text-white transition-colors cursor-pointer"><Instagram width={20} height={20} /></span>
              <span aria-label="LinkedIn" className="hover:text-white transition-colors cursor-pointer"><Linkedin width={20} height={20} /></span>
              <span aria-label="YouTube" className="hover:text-white transition-colors cursor-pointer"><Youtube width={20} height={20} /></span>
              <span aria-label="X" className="hover:text-white transition-colors cursor-pointer"><X width={20} height={20} /></span>
              <a href="mailto:hi@stflbd.email" aria-label="Email" className="hover:text-white transition-colors"><Mail width={20} height={20} /></a>
            </div>
            <p className="text-white/40 text-sm">Brand Guide v1.0</p>
          </div>
        </div>
      </footer>

      <Footer />
    </div>
  );
}
