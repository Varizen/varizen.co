import "server-only";
import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
export type RateResult = { allowed: boolean; retryAfter: number };

/** Per-instance protection only. Use a shared atomic store for multi-instance production. */
export function rateLimit(key: string, limit = 5, windowMs = 10 * 60_000): RateResult {
  const now = Date.now();
  if (buckets.size > 5000) for (const [id, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(id);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, retryAfter: 0 }; }
  bucket.count += 1;
  return { allowed: bucket.count <= limit, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
}

export function requestKey(request: Request) {
  const configuredIp = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  const address = process.env.TRUST_PROXY_HEADERS === "true" ? configuredIp ?? "unknown" : "local";
  const secret = process.env.RATE_LIMIT_PEPPER;
  if (!secret && process.env.NODE_ENV === "production") throw new Error("Rate-limit protection is not configured.");
  return createHash("sha256").update(`${address}:${secret ?? "local-development-only"}`).digest("hex");
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}
