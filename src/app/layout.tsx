import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Suspense } from "react";
import { RootScripts } from "@/components/root-scripts";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://varizen.co"),
  title: { default: "Varizen Inc. | Digital Trust, Cybersecurity & Governed AI", template: "%s | Varizen" },
  description: "Varizen builds cybersecurity, privacy, governed-AI and cloud operating platforms that turn uncertainty into evidence-led action.",
  openGraph: { title: "Varizen — Digital trust, made operational.", description: "Know your exposure. Prove your protection.", type: "website", siteName: "Varizen", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Varizen — Digital trust, made operational." }] },
  twitter: { card: "summary_large_image", title: "Varizen — Digital trust, made operational.", description: "Know your exposure. Prove your protection.", images: ["/opengraph-image"] },
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/brand/varizen-symbol.png", type: "image/png" }], apple: "/brand/varizen-symbol.png" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#f7f7f5", colorScheme: "light dark" };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}><body>{children}<Suspense fallback={null}><RootScripts /></Suspense></body></html>;
}
