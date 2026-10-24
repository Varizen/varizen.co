import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { auditEvents } from "@/db/schema";

type AuditInput = { actorId?: string; action: string; targetType: string; targetId?: string; before?: unknown; after?: unknown; reason?: string; requestId: string };
export function auditHash(input: Omit<AuditInput, "actorId" | "requestId"> & { actorId?: string; requestId: string; previousHash: string | null; createdAt: string }) { return createHash("sha256").update(JSON.stringify(input)).digest("hex"); }
/** Serialize the hash chain in a transaction. Actor/target data must already be authorized and redacted. */
export async function appendAuditEvent(input: AuditInput) {
  const db = getDb();
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(718203)`);
    const [previous] = await tx.select({ hash: auditEvents.entryHash }).from(auditEvents).orderBy(sql`${auditEvents.createdAt} desc`).limit(1);
    const createdAt = new Date();
    const entryHash = auditHash({ ...input, previousHash: previous?.hash ?? null, createdAt: createdAt.toISOString() });
    const [event] = await tx.insert(auditEvents).values({ ...input, entryHash, previousHash: previous?.hash ?? null, createdAt }).returning({ id: auditEvents.id });
    return event;
  });
}
