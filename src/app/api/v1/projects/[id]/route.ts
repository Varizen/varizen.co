import { and, eq, gt, isNull, or } from "drizzle-orm";
import { getDb } from "@/db";
import { entitlements, projectEntitlements, projects } from "@/db/schema";
import { requireAuth } from "@/server/auth";
import { apiError, requestId } from "@/server/api";
import { uuidSchema } from "@/lib/validation";

export async function GET(request: Request, context: RouteContext<"/api/v1/projects/[id]">) {
  const id = requestId(request); const auth = await requireAuth("project:read");
  if (!auth) return apiError("Not authorized.", 403, id);
  const projectId = uuidSchema.safeParse((await context.params).id);
  if (!projectId.success) return apiError("Project not found.", 404, id);
  try {
    const [project] = await getDb().select({ id: projects.id, publicId: projects.publicId, name: projects.name }).from(projects).innerJoin(projectEntitlements, eq(projectEntitlements.projectId, projects.id)).innerJoin(entitlements, eq(entitlements.id, projectEntitlements.entitlementId)).where(and(eq(projects.id, projectId.data), eq(entitlements.userId, auth.userId), eq(entitlements.kind, "PROJECT"), isNull(entitlements.revokedAt), or(isNull(entitlements.expiresAt), gt(entitlements.expiresAt, new Date())))).limit(1);
    if (!project) return apiError("Project not found.", 404, id);
    return Response.json({ data: project }, { headers: { "Cache-Control": "private, no-store", "x-request-id": id } });
  } catch { return apiError("Project not available.", 503, id); }
}
