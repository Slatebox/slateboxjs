import { expect, test } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";
import { removeTestGuest, userId } from "./workshop-guests.shared";

const appUrl = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("map entry, gallery and dashboard New open their respective editors", async ({ page }) => {
  await page.goto(appUrl + "/canvas/new");
  await expect(page.getByRole("heading", { name: "Start a new slate" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Create an interactive map" })).toHaveAttribute("href", "/new/map");
  const sample = page.getByRole("link", { name: "Try a sample map" });
  await expect(sample).toHaveAttribute("href", "/workshops?format=map");
  await sample.click();
  await expect(page.locator(".workshop-paper svg").first()).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("meteor_token"))).toBeNull();

  // The public proof ends before creating guest-owned data on production.
  if (!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname)) return;
  await openGuestCanvas(page, appUrl);
  const ownerId = await userId(page);
  try {
    const canvas = page.url();
    expect(new URL(canvas).search).toBe("");
    await page.getByRole("button", { name: "Board menu" }).click();
    await expect(page.getByRole("menuitem", { name: "Create an interactive map" })).toHaveAttribute("href", "/new/map");
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
    await page.getByRole("main").getByRole("link", { name: "Create an interactive map" }).click();
    await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/);
    await expect(page.getByRole("heading", { name: "Untitled map" })).toBeVisible();
    await page.goto(canvas);
    await expect(node).toBeVisible();
  } finally {
    await removeTestGuest(page, ownerId);
  }
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

test("a collaboration visitor owns a private, connected incident timeline on first open", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname));
  await page.goto(appUrl + "/start");
  expect(await page.evaluate(() => localStorage.getItem("meteor_token"))).toBeNull();
  await page.goto(appUrl + "/new/incident-timeline");
  await page.waitForURL(/\/canvas\/[\w-]+$/);
  const key = new URL(page.url()).pathname.split("/").pop()!;
  try {
    const question = page.locator("#slateCanvas").getByRole("button", { name: "Who owns the retry limit?", exact: true });
    await expect(question).toBeVisible();
    const timeline = await page.evaluate(async shareId => {
      const meteor = (window as any).Meteor;
      const { slateBase } = await meteor.callAsync("slates.get", { shareId });
      return {
        owned: slateBase.userId === meteor.userId(),
        private: slateBase.options.isPrivate,
        public: slateBase.options.isPublic,
        unlisted: slateBase.options.isUnlisted,
        nodes: slateBase.nodes.map((node: any) => node.options.id).sort(),
        edges: slateBase.nodes.flatMap((node: any) => node.relationships.associations.map(
          (edge: any) => edge.parentId + " → " + edge.childId
        )).sort(),
      };
    }, key);
    expect(timeline).toEqual({
      owned: true, private: true, public: false, unlisted: false,
      nodes: ["handoff", "recovery", "retries", "trace"],
      edges: ["recovery → handoff", "retries → recovery", "trace → retries"],
    });
    await page.reload();
    await expect(question).toBeVisible();
  } finally {
    await page.evaluate(async shareId => {
      const meteor = (window as any).Meteor;
      const row = (await meteor.callAsync("slates.get", { shareId }))?.slateBase;
      if (meteor.user()?.isAnonymous && row && row.userId === meteor.userId()) {
        await meteor.callAsync("slates.remove", { slateIds: [row._id] });
        meteor.call("users.delete");
      }
    }, key);
  }
});
