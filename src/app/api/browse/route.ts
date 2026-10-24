import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return new NextResponse("URL parameter required", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(urlParam.startsWith("http") ? urlParam : `https://${urlParam}`);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  // Security guard: prevent SSRF to loopback/private addresses
  const host = target.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host.startsWith("192.168.") ||
    host.startsWith("10.") ||
    host.startsWith("172.16.")
  ) {
    return new NextResponse("Forbidden target origin", { status: 403 });
  }

  try {
    const res = await fetch(target.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 AiBrowser/0.1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
    });

    let html = await res.text();

    // Inject <base> tag so relative CSS, JS, and images resolve correctly to the target origin
    const baseTag = `<base href="${target.origin}${target.pathname}">`;
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head>${baseTag}`);
    } else if (html.includes("<html>")) {
      html = html.replace("<html>", `<html><head>${baseTag}</head>`);
    } else {
      html = `${baseTag}${html}`;
    }

    // Strip out client-side framebusting scripts like `if (top !== self) top.location = self.location`
    html = html.replace(/top\.location\s*=\s*self\.location/gi, "console.log('Framebusting prevented')");
    html = html.replace(/window\.top\s*!==\s*window\.self/gi, "false");

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Crucial: Omit X-Frame-Options and frame-ancestors so it renders cleanly in the modal!
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Fetch failed";
    return new NextResponse(
      `<div style="font-family:sans-serif;padding:40px;color:#eee;background:#121212;height:100vh;">
        <h3>Unable to fetch ${target.hostname}</h3>
        <p style="color:#888;">${msg}</p>
      </div>`,
      { status: 502, headers: { "Content-Type": "text/html" } }
    );
  }
}
