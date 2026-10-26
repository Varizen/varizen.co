import type { Metadata } from "next";
import { Inter, Hind_Siliguri, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import "./stfl-tokens.css";
import { ClientProviders } from "@/src/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-sans-bengali",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SohaelTasneem Foundation",
  description: "Human Dignity. Practical Action. Measurable Impact. Building opportunity and multiplying impact across Bangladesh.",
  metadataBase: new URL("https://stflbd.org"),
  openGraph: {
    title: "SohaelTasneem Foundation",
    description: "Human Dignity. Practical Action. Measurable Impact. Building opportunity and multiplying impact across Bangladesh.",
    url: "https://stflbd.org",
    siteName: "SohaelTasneem Foundation",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SohaelTasneem Foundation",
    description: "Human Dignity. Practical Action. Measurable Impact. Building opportunity and multiplying impact across Bangladesh.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${notoSansBengali.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#081F2D] font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
