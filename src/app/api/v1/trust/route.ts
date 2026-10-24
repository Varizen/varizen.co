import { trustDocuments } from "@/content/site";
export function GET() { return Response.json({ data: trustDocuments.map(({ title, slug, status }) => ({ title, slug, status })), meta: { telemetryConnected: false, certificationsClaimed: false } }, { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" } }); }
