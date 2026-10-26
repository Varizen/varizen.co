import { identity, LANGS, sectionSlugs } from "../content";

export function GET() {
  const base = identity.url;
  const urls: string[] = [];

  for (const lang of LANGS) {
    urls.push(`${base}/${lang}`);
    for (const section of sectionSlugs) {
      urls.push(`${base}/${lang}/${section}`);
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map((url) => {
    const path = url.replace(base, "");
    const section = path.split("/")[2] ?? "";
    const alternates = LANGS.map(
      (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${base}/${lang}${section ? `/${section}` : ""}"/>`,
    ).join("\n");
    return `  <url>
    <loc>${url}</loc>
${alternates}
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}/en${section ? `/${section}` : ""}"/>
    <changefreq>${section ? "monthly" : "weekly"}</changefreq>
    <priority>${section ? "0.7" : "1.0"}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
