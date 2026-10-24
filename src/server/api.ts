import "server-only";
import { randomUUID } from "node:crypto";
import type { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function requestId(request: Request) { const supplied = request.headers.get("x-request-id"); return supplied && /^[a-zA-Z0-9_-]{8,80}$/.test(supplied) ? supplied : randomUUID(); }
export function apiError(message: string, status: number, id: string, details?: unknown) { return Response.json({ error: { code: status === 429 ? "RATE_LIMITED" : status === 422 ? "VALIDATION_ERROR" : "REQUEST_FAILED", message, requestId: id, ...(details ? { details } : {}) } }, { status, headers: { "x-request-id": id, "Cache-Control": "no-store" } }); }
export function validationError(error: ZodError) { return error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })); }
export function securityHeaders(response: NextResponse) { response.headers.set("X-Content-Type-Options", "nosniff"); response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); return response; }
