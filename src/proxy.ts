import { NextResponse, type NextRequest } from "next/server";
import { industries, products, solutions, trustDocuments } from "@/content/site";

const knownSlugs: Record<string, Set<string>> = {
  products: new Set(products.map((item) => item.slug)),
  solutions: new Set(solutions.map((item) => item.slug)),
  industries: new Set(industries.map((item) => item.slug)),
  trust: new Set([...trustDocuments.map((item) => item.slug), "cookies"]),
};

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
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
