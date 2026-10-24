import { describe, expect, it } from "vitest";
import { contactSchema, uuidSchema } from "@/lib/validation";

const valid = { reason: "business", name: "Example Person", organization: "Example Org", role: "Technology", email: "PERSON@EXAMPLE.COM", message: "We would like to discuss our cloud governance approach.", website: "", consent: true };

describe("public input validation", () => {
  it("normalizes valid contact email", () => {
    expect(contactSchema.parse(valid).email).toBe("person@example.com");
  });
  it.each(["name", "organization", "role", "message", "consent"])("rejects missing %s", (key) => {
    expect(contactSchema.safeParse({ ...valid, [key]: undefined }).success).toBe(false);
  });
  it("rejects invalid reasons, email and bot field", () => {
    expect(contactSchema.safeParse({ ...valid, reason: "admin" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, website: "spam.example" }).success).toBe(false);
  });
  it("does not accept project names as internal identifiers", () => {
    expect(uuidSchema.safeParse("production").success).toBe(false);
    expect(uuidSchema.safeParse("4f5a4e7a-7e62-4b5a-a2b5-bba8a7b0be7e").success).toBe(true);
  });
});
