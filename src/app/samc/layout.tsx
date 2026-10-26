import { Hind_Siliguri } from "next/font/google";
import type { ReactNode } from "react";
import "./samc.css";

/**
 * Bangla institutional typeface.
 * English uses the system Aptos stack (declared in samc.css).
 */
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--samc-font-bn-loaded",
});

export default function SamcRootLayout({ children }: { children: ReactNode }) {
  return <div className={hindSiliguri.variable}>{children}</div>;
}
