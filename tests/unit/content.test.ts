import { describe, expect, it } from "vitest";
import { getIndustry, getProduct, getSolution, industries, kofi, products, solutions } from "@/content/site";

describe("content and public routing", () => {
  it("has unique, explicit content routes", () => {
    for (const collection of [products, solutions, industries]) {
      expect(new Set(collection.map(item => item.slug)).size).toBe(collection.length);
    }
  });
  it("does not expose unknown product or industry data", () => {
    expect(getProduct("internal-investment-room")).toBeUndefined();
    expect(getSolution("unknown")).toBeUndefined();
    expect(getIndustry("unknown")).toBeUndefined();
  });
  it("labels maturity for every public product", () => {
    for (const product of products) {
      expect(product.stage).toBeTruthy();
      expect(product.status).toBeTruthy();
      expect(product.stage).not.toBe("Published");
    }
  });
  it("publishes only the public Ko-fi page, never the private dashboard", () => {
    expect(kofi.url).toBe(`https://ko-fi.com/${kofi.slug}`);
    expect(kofi.url).not.toMatch(/manage/i);
    expect(kofi.embedUrl.startsWith(kofi.url)).toBe(true);
  });
});
