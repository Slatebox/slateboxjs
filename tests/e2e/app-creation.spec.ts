import { expect, test } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";

const appUrl = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("new slates offer an interactive map before signup and from the dashboard and board", async ({ page }) => {
  await page.goto(appUrl + "/canvas/new");
  await expect(page.getByRole("heading", { name: "Start a new slate" })).toBeVisible();
  const map = page.getByRole("link", { name: "Build an interactive map" });
  await expect(map).toHaveAttribute("href", "/workshops?format=map");
  await map.click();
  await expect(page.locator(".workshop-paper svg").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("meteor_token"))).toBeNull();

  // The public proof ends before creating guest-owned data on production.
  if (!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname)) return;
  await openGuestCanvas(page, appUrl);
  const canvas = page.url();
  expect(new URL(canvas).search).toBe("");
  await page.getByRole("button", { name: "Board menu" }).click();
  await expect(page.getByRole("menuitem", { name: "Build an interactive map" })).toHaveAttribute("href", "/workshops?format=map");
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Slatebox home" }).click();
  await page.getByRole("button", { name: "New", exact: true }).click();
  await expect(page.getByRole("link", { name: "Back to my slates" })).toBeVisible();
  await map.click();
  await expect(page.locator(".workshop-paper svg").first()).toBeVisible();
  await page.goto(canvas);
  await expect(page.locator("#slateCanvas [data-node-id]").first()).toBeVisible();
});
