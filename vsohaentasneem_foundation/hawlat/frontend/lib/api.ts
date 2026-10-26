export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public reasons: string[] = []) {
    super(message);
  }
}

import { API_BASE } from "./config";

const KEY = "hawlat.token";
export const getToken = () => (typeof window === "undefined" ? null : sessionStorage.getItem(KEY));
export const setToken = (t: string | null) => (t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY));

export async function api<T>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (method !== "GET") headers["Idempotency-Key"] = crypto.randomUUID();
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    method,
    headers,
    body: opts.body === undefined ? (method === "GET" ? undefined : "{}") : JSON.stringify(opts.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = typeof data.detail === "string" ? data.detail : "Request failed";
    throw new ApiError(res.status, data.code ?? "ERROR", detail, data.reasons ?? []);
  }
  return data as T;
}

export function explain(e: unknown): string {
  if (!(e instanceof ApiError)) return "Something went wrong. Please try again.";
  if (e.code === "GATE_BLOCKED") return "This capability is not yet enabled. It is awaiting legal and compliance approval.";
  if (e.code === "RISK_DENIED") return `Not eligible right now: ${e.reasons.map((r) => r.replaceAll("_", " ").toLowerCase()).join(", ")}.`;
  if (e.status === 401) return "Please sign in again.";
  return e.message;
}

export const taka = (v: string | number) =>
  "৳" + Number(v).toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
