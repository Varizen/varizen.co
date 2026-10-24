import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <><Navbar /><main id="main-content"><Suspense fallback={<div className="route-loading" role="status">Loading Varizen…</div>}>{children}</Suspense></main><Footer /><CookieConsent /></>;
}
