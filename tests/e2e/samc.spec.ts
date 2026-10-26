import { expect, test } from "@playwright/test";

const enRoutes = ["/samc/en", "/samc/en/about", "/samc/en/medical-care", "/samc/en/medical-education", "/samc/en/research", "/samc/en/people", "/samc/en/news", "/samc/en/contact", "/samc/en/admissions", "/samc/en/downloads", "/samc/en/brand"];
const bnRoutes = ["/samc/bn", "/samc/bn/about", "/samc/bn/medical-care", "/samc/bn/medical-education", "/samc/bn/research"];

test("SAMC English routes render with the crest and no runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of enRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("img", { name: /SAMC crest/ }).first()).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("SAMC Bangla routes render with lang=bn and the crest", async ({ page }) => {
  for (const route of bnRoutes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator(".samc-site")).toHaveAttribute("lang", "bn");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("SAMC preserves the exact institutional identity", async ({ page }) => {
  await page.goto("/samc/en");
  await expect(page.getByText("SOUTH APOLLO MEDICAL COLLEGE & HOSPITAL").first()).toBeVisible();
  await expect(page.getByText(/ESTD: 2021/).first()).toBeVisible();
  await expect(page.getByText("Care. Knowledge. Integrity.").first()).toBeVisible();
});

test("SAMC language switch navigates between EN and BN", async ({ page }) => {
  await page.goto("/samc/en/about");
  await page.getByRole("link", { name: "বাংলা" }).first().click();
  await expect(page).toHaveURL(/\/samc\/bn\/about/);
  await page.getByRole("link", { name: "EN" }).first().click();
  await expect(page).toHaveURL(/\/samc\/en\/about/);
});

test("SAMC unknown sections and languages return 404", async ({ page }) => {
  expect((await page.goto("/samc/en/not-a-section"))?.status()).toBe(404);
  expect((await page.goto("/samc/xx/about"))?.status()).toBe(404);
});

test("SAMC emergency information is always visible", async ({ page }) => {
  await page.goto("/samc/en");
  await expect(page.getByRole("region", { name: "Emergency" })).toBeVisible();
});

test("SAMC About page presents governance, departments and committee map", async ({ page }) => {
  await page.goto("/samc/en/about");
  await expect(page.getByText("Institutional Governance").first()).toBeVisible();
  await expect(page.getByText("Clinical authority").first()).toBeVisible();
  await expect(page.getByText("Academic authority").first()).toBeVisible();
  await expect(page.getByText("Committee map").first()).toBeVisible();
  await expect(page.getByText("Management Committee").first()).toBeVisible();
  await expect(page.getByText(/Basic & pre-clinical departments/).first()).toBeVisible();
  await expect(page.getByText("Clinical departments").first()).toBeVisible();
});

test("SAMC Bangla About page presents governance in Bangla", async ({ page }) => {
  await page.goto("/samc/bn/about");
  await expect(page.getByText("প্রাতিষ্ঠানিক পরিচালনা").first()).toBeVisible();
  await expect(page.getByText("কমিটি মানচিত্র").first()).toBeVisible();
  await expect(page.getByText("বেসিক ও প্রি-ক্লিনিক্যাল বিভাগ").first()).toBeVisible();
});

test("SAMC Brand page presents the approved logo family", async ({ page }) => {
  await page.goto("/samc/en/brand");
  await expect(page.getByText(/APPROVED LOGO FAMILY/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /One-color production master/ })).toBeVisible();
  const crests = page.locator(".samc-logo-card img");
  await expect(crests).toHaveCount(7);
  for (const crest of await crests.all()) {
    await expect(crest).toBeVisible();
  }
});

test("SAMC never publishes fabricated contact details", async ({ page }) => {
  await page.goto("/samc/en/contact");
  await expect(page.getByText("[OFFICIAL ADDRESS]").first()).toBeVisible();
  await expect(page.getByText("[OFFICIAL PHONE]").first()).toBeVisible();
  await expect(page.getByText("[OFFICIAL EMAIL]").first()).toBeVisible();
});

test("SAMC mobile navigation opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/samc/en");
  await page.getByRole("button", { name: "Menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("link", { name: /Medical Care/ }).click();
  await expect(page).toHaveURL(/\/samc\/en\/medical-care/);
});
