export const roles = ["PUBLIC", "QR_PROSPECT", "VERIFIED_APPLICANT", "SHOWCASE_INVESTOR", "INVESTMENT_INVESTOR", "REVIEWER", "CAMPAIGN_ADMIN", "CONTENT_ADMIN", "RELATIONSHIP_MANAGER", "SECURITY_AUDIT_ADMIN", "SUPER_ADMIN"] as const;
export type Role = (typeof roles)[number];
export type Permission = "app:read" | "showcase:read" | "investment:read" | "admin:read" | "audit:read" | "project:read";
const rolePermissions: Record<Role, readonly Permission[]> = {
  PUBLIC: [], QR_PROSPECT: [], VERIFIED_APPLICANT: [],
  SHOWCASE_INVESTOR: ["showcase:read"], INVESTMENT_INVESTOR: ["showcase:read", "investment:read"],
  REVIEWER: ["app:read", "showcase:read"], CAMPAIGN_ADMIN: ["app:read", "admin:read"],
  CONTENT_ADMIN: ["admin:read"], RELATIONSHIP_MANAGER: ["app:read", "admin:read"],
  SECURITY_AUDIT_ADMIN: ["app:read", "admin:read", "audit:read", "project:read"],
  SUPER_ADMIN: ["app:read", "showcase:read", "investment:read", "admin:read", "audit:read", "project:read"],
};
export function can(role: Role, permission: Permission) { return rolePermissions[role].includes(permission); }
export function canAny(roleList: readonly Role[], permission: Permission) { return roleList.some((role) => roles.includes(role) && can(role, permission)); }
export function privilegedRole(role: Role) { return ["REVIEWER", "CAMPAIGN_ADMIN", "CONTENT_ADMIN", "RELATIONSHIP_MANAGER", "SECURITY_AUDIT_ADMIN", "SUPER_ADMIN"].includes(role); }
export function immutableProjectId(opaqueId: string) {
  if (/^[A-Za-z0-9_-]{16,80}$/.test(opaqueId)) return `ENOS-PROJ-${opaqueId}`;
  return /^ENOS-PROJ-[A-Za-z0-9_-]{16,80}$/.test(opaqueId) ? opaqueId : null;
}
export function hasProjectAccess(context: { userId: string; projectOwnerIds: string[]; entitledProjectIds: string[] }, projectId: string, superAdmin = false) { return superAdmin || context.entitledProjectIds.includes(projectId); }
