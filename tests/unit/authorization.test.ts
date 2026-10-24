import { describe, expect, it } from "vitest";
import { can, canAny, hasProjectAccess, immutableProjectId, privilegedRole } from "@/server/authorization";

describe("authorization boundaries", () => {
  it("denies public and applicant access to protected surfaces", () => {
    expect(can("PUBLIC", "app:read")).toBe(false);
    expect(can("QR_PROSPECT", "showcase:read")).toBe(false);
    expect(canAny(["VERIFIED_APPLICANT"], "investment:read")).toBe(false);
  });
  it("separates showcase and investment permissions", () => {
    expect(can("SHOWCASE_INVESTOR", "showcase:read")).toBe(true);
    expect(can("SHOWCASE_INVESTOR", "investment:read")).toBe(false);
    expect(can("INVESTMENT_INVESTOR", "investment:read")).toBe(true);
  });
  it("requires MFA for privileged roles", () => {
    expect(privilegedRole("SUPER_ADMIN")).toBe(true);
    expect(privilegedRole("CONTENT_ADMIN")).toBe(true);
    expect(privilegedRole("SHOWCASE_INVESTOR")).toBe(false);
  });
  it("requires a project entitlement, never ownership of a supplied ID", () => {
    expect(hasProjectAccess({ userId: "attacker", projectOwnerIds: ["attacker"], entitledProjectIds: [] }, "project-a")).toBe(false);
    expect(hasProjectAccess({ userId: "reader", projectOwnerIds: [], entitledProjectIds: ["project-a"] }, "project-a")).toBe(true);
    expect(hasProjectAccess({ userId: "reader", projectOwnerIds: [], entitledProjectIds: [] }, "project-a", true)).toBe(true);
  });
  it("accepts only opaque immutable project identifiers", () => {
    expect(immutableProjectId("0123456789abcdef")).toBe("ENOS-PROJ-0123456789abcdef");
    expect(immutableProjectId("My mutable project name")).toBeNull();
    expect(immutableProjectId("short")).toBeNull();
  });
});
