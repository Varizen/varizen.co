import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const ZIP_NAME = "AiBrowser-win-x64.zip";

// The zip is a build artifact and is git-ignored, so it is absent on a fresh clone
// and on hosts with a read-only or ephemeral filesystem. When that happens, redirect
// to a hosted release if configured instead of returning an opaque 404.
const RELEASE_URL = process.env.AIBROWSER_RELEASE_URL || "";

// Note: no `export const dynamic` here — this project enables `cacheComponents`,
// which rejects route segment config. The route stays dynamic because it reads
// the filesystem and request-time env.
export async function GET() {
  const filePath = path.join(process.cwd(), "public", "downloads", ZIP_NAME);

  if (!fs.existsSync(filePath)) {
    if (RELEASE_URL) return NextResponse.redirect(RELEASE_URL, 307);
    return NextResponse.json(
      {
        error: "Build package not available on this host",
        detail:
          "The AiBrowser zip is a build artifact and is not committed to the repository. " +
          "Build it with `cd browser && npm run dist`, copy the portable exe into " +
          `public/downloads as ${ZIP_NAME}, or set AIBROWSER_RELEASE_URL to a hosted release.`,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const stat = fs.statSync(filePath);
  const stream = Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream;

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${ZIP_NAME}"`,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
