import { expect, test } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";

const appUrl = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("map entry, gallery and dashboard New open their respective editors", async ({ page }) => {
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
  await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/);
  const second = page.url();
  expect(second).not.toBe(canvas);
  const node = page.locator("#slateCanvas [data-node-id]").first();
  await expect(node).toBeVisible();
  await page.reload();
  await expect(node).toBeVisible();
  expect(page.url()).toBe(second);
  await page.goBack();
  await expect(page.getByRole("button", { name: "New", exact: true })).toBeVisible();
  await page.goto(appUrl + "/templates");
  await page.getByRole("main").getByRole("link", { name: "Build an interactive map" }).click();
  await expect(page.locator(".workshop-paper svg").first()).toBeVisible();
  await page.goto(canvas);
  await expect(node).toBeVisible();
});

test("the marketing creation link opens a guest-owned native slate and preserves browser history", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname));
  await page.goto(appUrl + "/workshops?format=map");
  await expect(page.locator(".workshop-paper svg").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("meteor_token"))).toBeNull();
  await page.goto(appUrl + "/new");
  await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/);
  const canvas = page.url();
  const node = page.locator("#slateCanvas [data-node-id]").first();
  await expect(node).toBeVisible();
  const actor = await page.evaluate(() => (window as any).Meteor.userId());
  expect(actor).toBeTruthy();
  await page.reload();
  await expect(node).toBeVisible();
  expect(page.url()).toBe(canvas);
  expect(await page.evaluate(() => (window as any).Meteor.userId())).toBe(actor);
  await page.goBack();
  await expect(page.locator(".workshop-paper svg").first()).toBeVisible();
  await page.goForward();
  await expect(node).toBeVisible();
  expect(page.url()).toBe(canvas);
});
