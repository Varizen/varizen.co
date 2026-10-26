import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HAWLAT — reputation-based financing marketplace",
  description: "HAWLAT helps independent parties discover, agree and record direct short-term financing. HAWLAT does not provide the financing.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
