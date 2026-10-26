import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/server/rate-limit";

const OPENROUTER_CHAT_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const UNAVAILABLE = "Eye AI is temporarily unavailable. Please try again later.";

// No CORS headers are set on purpose. The only intended caller is the AiBrowser
// desktop app, whose main-process fetch is not subject to CORS. Emitting
// `Access-Control-Allow-Origin: *` here would let any website spend this
// deployment's OpenRouter quota.

export async function POST(req: NextRequest) {
  if (process.env.EYE_AI_ENABLED === "false") {
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }

  // Fail closed: when no install tokens are configured, refuse rather than
  // serving as an anonymous proxy. Set EYE_INSTALL_TOKENS in production.
  const installTokens = (process.env.EYE_INSTALL_TOKENS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (installTokens.length === 0) {
    return NextResponse.json(
      { error: "Gateway is not accepting requests: EYE_INSTALL_TOKENS is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!installTokens.includes(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Per-install-token budget, so one client cannot exhaust the shared key pool.
  const rate = rateLimit(`eye-ai:${token}`, 30, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: UNAVAILABLE },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter), "Cache-Control": "no-store" } }
    );
  }

  if (Number(req.headers.get("content-length") ?? 0) > 100_000) {
    return NextResponse.json({ error: "request too large" }, { status: 413 });
  }

  let body: { messages?: unknown[]; task?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "messages required" }, { status: 400 });
  }

  // Dual-key rotation
  const keys = [process.env.OPENROUTER_API_KEY_1, process.env.OPENROUTER_API_KEY_2].filter(Boolean) as string[];

  if (keys.length === 0) {
    // Fail closed and say so. Returning a 200 with a canned message would make a
    // misconfigured deployment look healthy to the client and to monitoring.
    return NextResponse.json(
      { error: "Gateway is not configured: no OpenRouter key is set." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const apiKey = keys[Math.floor(Math.random() * keys.length)];
  const fallbackModel = "meta-llama/llama-3.2-3b-instruct:free";

  try {
    const upstreamRes = await fetch(OPENROUTER_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://varizen.co",
        "X-Title": "Eye AI Gateway",
      },
      body: JSON.stringify({
        model: fallbackModel,
        messages: body.messages,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!upstreamRes.ok) {
      return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
    }

    const data = (await upstreamRes.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json(
      { text, model: fallbackModel.split("/")[0] },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ error: UNAVAILABLE }, { status: 503 });
  }
}

// No OPTIONS/CORS handler: this endpoint is not meant to be called from a browser
// origin. The desktop app's main-process fetch does not preflight.
