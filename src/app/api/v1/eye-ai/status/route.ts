import { NextResponse } from "next/server";

// No CORS headers: this endpoint is consumed by the AiBrowser desktop app's main
// process, not by a browser origin. Exposing it cross-origin would let any site
// probe this deployment's configuration.

export async function GET() {
  const enabled = process.env.EYE_AI_ENABLED !== "false";
  const hasKey1 = !!process.env.OPENROUTER_API_KEY_1;
  const hasKey2 = !!process.env.OPENROUTER_API_KEY_2;
  const healthyKeys = (hasKey1 ? 1 : 0) + (hasKey2 ? 1 : 0);
  const hasInstallTokens = (process.env.EYE_INSTALL_TOKENS || "").split(",").some((s) => s.trim());

  // `ok` reflects whether the gateway can actually serve a chat request, so the
  // client shows "Unreachable"/"Disabled" instead of a misleading "Free".
  const ok = enabled && healthyKeys > 0 && hasInstallTokens;

  return NextResponse.json(
    {
      ok,
      enabled,
      healthyKeys,
      freeModels: healthyKeys > 0 ? 20 : 0,
      requiresInstallToken: hasInstallTokens,
      status: ok ? "operational" : enabled ? "misconfigured" : "disabled",
    },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
