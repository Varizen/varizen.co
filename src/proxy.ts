import { NextResponse, type NextRequest } from "next/server";
import { industries, products, solutions, trustDocuments } from "@/content/site";
import { sectionSlugs } from "@/app/samc/content";

const knownSlugs: Record<string, Set<string>> = {
  products: new Set(products.map((item) => item.slug)),
  solutions: new Set(solutions.map((item) => item.slug)),
  industries: new Set(industries.map((item) => item.slug)),
  trust: new Set([...trustDocuments.map((item) => item.slug), "cookies"]),
};

const samcSections = new Set(sectionSlugs);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hostname = (request.headers.get("host") ?? request.nextUrl.hostname).split(":")[0].toLowerCase();

  if (
    hostname === "aibrowser.varizen.co" &&
    !path.startsWith("/aibrowser") &&
    !path.startsWith("/downloads/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = path === "/" ? "/aibrowser" : `/aibrowser${path}`;
    return NextResponse.rewrite(url);
  }

  // SAMC institutional site — samc.varizen.co → /samc (bilingual EN/BN).
  // Defaults to English; an explicit /en or /bn prefix is preserved.
  if (
    hostname === "samc.varizen.co" &&
    !path.startsWith("/samc") &&
    !path.startsWith("/downloads/")
  ) {
    const hasLang = /^\/(en|bn)(\/|$)/.test(path);
    const effective = hasLang ? path : path === "/" ? "/en" : `/en${path}`;
    const section = effective.split("/")[2];
    if (section && !samcSections.has(decodeURIComponent(section))) {
      return new NextResponse("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
    }
    const url = request.nextUrl.clone();
    url.pathname = `/samc${effective}`;
    return NextResponse.rewrite(url);
  }

  const protectedPath = path.startsWith("/app") || path.startsWith("/admin");
  if (protectedPath && !request.cookies.has("__Host-vz_session")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Unknown detail slugs must return a real 404, not a streamed not-found page.
  const match = /^\/(products|solutions|industries|trust)\/([^/]+)\/?$/.exec(path);
  if (match && !knownSlugs[match[1]].has(decodeURIComponent(match[2]))) {
    return new NextResponse("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
  }

  // SAMC: unknown language or section slugs must return a real 404.
  // Skip static assets (paths with a file extension) and the brand asset folder.
  const samcMatch = /^\/samc\/([^/]+)(?:\/([^/]+))?\/?$/.exec(path);
  if (samcMatch && !/\.[a-z0-9]+$/i.test(path) && !path.startsWith("/samc/brand/")) {
    const [, lang, section] = samcMatch;
    if ((lang !== "en" && lang !== "bn") || (section && !samcSections.has(decodeURIComponent(section)))) {
      return new NextResponse("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
    }
  }
  if (path.startsWith("/api/browse")) {
    return NextResponse.next();
  }

  const csp = `default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; frame-src 'self' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'none';${process.env.NODE_ENV === "production" ? " upgrade-insecure-requests;" : ""}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}
export const config = { matcher: [{ source: "/((?!_next/static|_next/image|icon.svg|opengraph-image).*)", missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] }] };
