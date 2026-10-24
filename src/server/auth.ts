import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, userRoles, roles, users } from "@/db/schema";
import { canAny, privilegedRole, type Permission, type Role } from "./authorization";

export const SESSION_COOKIE = "__Host-vz_session";
export function hashToken(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function newToken() { return randomBytes(32).toString("base64url"); }
export function safeTokenEqual(a: string, b: string) { const first = Buffer.from(a); const second = Buffer.from(b); return first.length === second.length && timingSafeEqual(first, second); }

export type AuthContext = { userId: string; sessionId: string; roles: Role[]; mfaEnabled: boolean };
export async function getAuth(): Promise<AuthContext | null> {
  if (!process.env.DATABASE_URL) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const db = getDb();
    const [session] = await db.select({ id: sessions.id, userId: sessions.userId, authVersion: sessions.authVersion, mfaEnabled: users.mfaEnabled, disabledAt: users.disabledAt, activatedAt: users.activatedAt, currentAuthVersion: users.authVersion }).from(sessions).innerJoin(users, eq(users.id, sessions.userId)).where(and(eq(sessions.tokenHash, hashToken(token)), gt(sessions.expiresAt, new Date()), gt(sessions.absoluteExpiresAt, new Date()), isNull(sessions.revokedAt))).limit(1);
    if (!session || session.disabledAt || !session.activatedAt || session.authVersion !== session.currentAuthVersion) return null;
    const assigned = await db.select({ role: roles.name }).from(userRoles).innerJoin(roles, eq(roles.id, userRoles.roleId)).where(eq(userRoles.userId, session.userId));
    return { userId: session.userId, sessionId: session.id, mfaEnabled: session.mfaEnabled, roles: assigned.map(({ role }) => role) };
  } catch { return null; }
}
export async function requireAuth(permission: Permission): Promise<AuthContext | null> {
  const auth = await getAuth();
  if (!auth || !canAny(auth.roles, permission)) return null;
  if (auth.roles.some(privilegedRole) && !auth.mfaEnabled) return null;
  return auth;
}
