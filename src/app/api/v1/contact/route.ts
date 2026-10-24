import { randomUUID } from "node:crypto";
import { getDb } from "@/db";
import { contactRequests } from "@/db/schema";
import { apiError, requestId, validationError } from "@/server/api";
import { rateLimit, requestKey, sameOrigin } from "@/server/rate-limit";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const id = requestId(request);
  try {
    if (!sameOrigin(request)) return apiError("The request origin could not be verified.", 403, id);
    const rate = rateLimit(requestKey(request));
    if (!rate.allowed) return Response.json({ error: { code: "RATE_LIMITED", message: "Too many submissions. Please try again later.", requestId: id } }, { status: 429, headers: { "Retry-After": String(rate.retryAfter), "Cache-Control": "no-store" } });
    if (Number(request.headers.get("content-length") ?? 0) > 20_000) return apiError("The submission is too large.", 413, id);
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return apiError("Please review the submitted information.", 422, id, validationError(parsed.error));
    const data = parsed.data;
    if (data.website) return Response.json({ message: "Thank you. Your enquiry has been received.", reference: randomUUID() }, { status: 201, headers: { "Cache-Control": "no-store" } });
    const reference = randomUUID();
    const key = request.headers.get("idempotency-key");
    if (!key || !/^[a-zA-Z0-9-]{16,100}$/.test(key)) return apiError("A valid idempotency key is required.", 400, id);
    const input = { reason: data.reason, name: data.name, organization: data.organization, role: data.role, email: data.email, message: data.message };
    const [record] = await getDb().insert(contactRequests).values({ id: reference, idempotencyKey: key, ...input, phone: data.phone || null, capability: data.capability || null, project: data.project || null, consentDocumentVersion: "public-privacy-draft-2026-10", consentedAt: new Date() }).onConflictDoNothing({ target: contactRequests.idempotencyKey }).returning({ id: contactRequests.id });
    if (!record) return apiError("A submission with this reference already exists. Please use the original reference.", 409, id);
    return Response.json({ message: "Your enquiry has been recorded for review. Please keep this reference for your records.", reference: record.id }, { status: 201, headers: { "Cache-Control": "no-store", "x-request-id": id } });
  } catch {
    return apiError("The enquiry service is not available. Please email hi@varizen.co.", 503, id);
  }
}
