import { expect, test } from "@playwright/test";

const routes = ["/", "/platform", "/solutions", "/products", "/industries", "/trust", "/company", "/contact", "/portfolio", "/insights", "/showcase", "/investment", "/products/kidon", "/solutions/ai-governance", "/industries/healthcare", "/trust/security"];

test("public routes render with real branding and no runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("img", { name: "Varizen logo" }).first()).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("hero controls and mobile navigation work", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Digital trust");
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog", { name: "Navigation" })).toBeVisible();
    await page.getByRole("dialog").getByRole("link", { name: "Trust" }).click();
  } else {
    await page.getByRole("link", { name: "Explore the platform", exact: true }).first().click();
  }
  await expect(page).toHaveURL(/\/(platform|trust)/);
});

test("contact form validates locally and safe-gates unavailable storage", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Enter your name.")).toBeVisible();
  await page.getByLabel("Name", { exact: true }).fill("Example Person");
  await page.getByLabel("Organization", { exact: true }).fill("Example Organization");
  await page.getByLabel("Role", { exact: true }).fill("Technology");
  await page.getByLabel("Work email").fill("person@example.com");
  await page.getByLabel("How can we help?").fill("We would like to discuss our security architecture.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Submission not completed.")).toBeVisible();
});

test("protected shell denies unauthenticated visitors", async ({ page }) => {
  for (const route of ["/app", "/app/evidence", "/admin"]) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/access|sign|workspace/i);
  }
});

test("unknown routes and project API fail safely", async ({ page, request }) => {
  expect((await page.goto("/not-a-public-route"))?.status()).toBe(404);
  const response = await request.get("/api/v1/projects/not-an-id");
  expect([401, 403]).toContain(response.status());
  expect(await response.text()).not.toContain("stack");
});

test("AiBrowser trigger button opens the modal popup", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "AiBrowser" }).first();
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByText("AiBrowser", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Get \.exe/ })).toBeVisible();

  // Test closing the modal with ESC
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /Get \.exe/ })).not.toBeVisible();
});
