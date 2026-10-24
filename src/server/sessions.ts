import "server-only";
import { randomUUID } from "node:crypto";
import { and, eq, isNull, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { sessions } from "@/db/schema";
import { hashToken, newToken, SESSION_COOKIE } from "./auth";

export const SESSION_IDLE_MS = 15 * 60_000;
export const SESSION_ABSOLUTE_MS = 12 * 60 * 60_000;
export async function setSessionCookie(token: string, expiresAt: Date) { (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: true, sameSite: "strict", path: "/", expires: expiresAt, priority: "high" }); }
export async function clearSessionCookie() { (await cookies()).set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 0 }); }

/** Called only by a verified identity-provider integration after MFA and activation checks. */
export async function issueSession(userId: string, authVersion: number, familyId = randomUUID()) {
  const token = newToken(); const now = Date.now(); const expiresAt = new Date(now + SESSION_IDLE_MS);
  await getDb().insert(sessions).values({ userId, tokenHash: hashToken(token), authVersion, familyId, expiresAt, absoluteExpiresAt: new Date(now + SESSION_ABSOLUTE_MS) });
  await setSessionCookie(token, expiresAt);
  return { expiresAt };
}
export async function rotateSession(token: string) {
  const db = getDb();
  return db.transaction(async (tx) => {
    const [current] = await tx.select().from(sessions).where(eq(sessions.tokenHash, hashToken(token))).limit(1).for("update");
    if (!current) return null;
    const invalid = current.revokedAt || current.rotatedAt || current.expiresAt <= new Date() || current.absoluteExpiresAt <= new Date();
    if (invalid) { await tx.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.familyId, current.familyId)); await clearSessionCookie(); return null; }
    const nextToken = newToken(); const expiresAt = new Date(Math.min(Date.now() + SESSION_IDLE_MS, current.absoluteExpiresAt.getTime()));
    await tx.insert(sessions).values({ userId: current.userId, authVersion: current.authVersion, familyId: current.familyId, tokenHash: hashToken(nextToken), expiresAt, absoluteExpiresAt: current.absoluteExpiresAt });
    await tx.update(sessions).set({ rotatedAt: new Date() }).where(eq(sessions.id, current.id));
    await setSessionCookie(nextToken, expiresAt);
    return { expiresAt };
  });
}
export async function revokeSessionFamily(token: string) {
  const db = getDb();
  const [current] = await db.select({ familyId: sessions.familyId }).from(sessions).where(eq(sessions.tokenHash, hashToken(token))).limit(1);
  if (current) await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.familyId, current.familyId));
  await clearSessionCookie();
}
export async function revokeAllSessions(userId: string) { await getDb().update(sessions).set({ revokedAt: new Date() }).where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt))); await clearSessionCookie(); }
export async function cleanupExpiredSessions() { await getDb().delete(sessions).where(lt(sessions.absoluteExpiresAt, new Date())); }
