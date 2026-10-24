import { describe, expect, it } from "vitest";
import { sameOrigin } from "@/server/rate-limit";
import { auditHash } from "@/server/audit";

describe("security helpers", () => {
  it("accepts only same-origin contact mutations", () => {
    const request = (origin?: string) => new Request("https://varizen.co/api/v1/contact", { headers: origin ? { origin } : {} });
    expect(sameOrigin(request("https://varizen.co"))).toBe(true);
    expect(sameOrigin(request("https://attacker.example"))).toBe(false);
    expect(sameOrigin(request())).toBe(false);
  });
  it("binds evidence hash to predecessor, timestamp and request", () => {
    const input = { action: "project.read", targetType: "project", requestId: "request-1", previousHash: null, createdAt: "2026-10-24T00:00:00.000Z" };
    expect(auditHash(input)).toHaveLength(64);
    expect(auditHash(input)).not.toBe(auditHash({ ...input, previousHash: "earlier" }));
    expect(auditHash(input)).not.toBe(auditHash({ ...input, requestId: "request-2" }));
  });
});
