import { expect, test } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { seedFirstNote } from "./app-host.shared";

const origin = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("independent copies of private and published slates start private for a free individual", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Publishes a synthetic slate on a local test installation");
  await page.goto(origin + "/plans");
  await page.waitForFunction(() => (window as any).Accounts && (window as any).Meteor.status().connected);
  expect(await page.evaluate(() => (window as any).Meteor.userId())).toBeNull();
  const email = "copy-proof-" + randomBytes(12).toString("hex") + "@slatebox.invalid";
  const password = randomBytes(24).toString("hex");
  const owner = await page.evaluate(async credentials => {
    await new Promise<void>((resolve, reject) => (window as any).Accounts.createUser(credentials, (error: Error) => error ? reject(error) : resolve()));
    return (window as any).Meteor.userId();
  }, { email, password });

  const read = (key: string) => page.evaluate(async shareId => {
    const { slateBase: slate } = await (window as any).Meteor.callAsync("slates.get", { shareId });
    return slate && {
      id: slate.options.id, owner: slate.userId, text: slate.nodes.map((n: any) => n.options.text),
      visibility: [slate.options.isPrivate, slate.options.isUnlisted, slate.options.isPublic],
    };
  }, key);
  const privateBoard = [true, false, false];
  const publicBoard = [false, false, true];

  let sourceId: string | undefined;
  try {
    await page.goto(origin + "/new?empty=1");
    await page.waitForURL(/\/canvas\//);
    const key = new URL(page.url()).pathname.split("/").pop()!;
    // A new slate starts empty: its first note, as the welcome's "Add a note" makes it.
    await seedFirstNote(page);
    const welcome = page.getByRole("dialog", { name: /welcome/i });
    if (await welcome.waitFor({ timeout: 2000 }).then(() => true, () => false)) await welcome.getByRole("button", { name: "OK" }).click();
    const consent = page.getByRole("button", { name: "Accept cookies" });
    if (await consent.isVisible()) await consent.click();
    await page.getByRole("button", { name: "Slatebox - quickly add a node" }).focus();
    await page.getByRole("button", { name: "Add Text", exact: true }).press("Enter");
    const note = "Observe how visitors use the exhibit";
    // Restated 2026-11-19: the note pane's text box is gone; a new text note opens its editor on the canvas.
    await expect(page.locator(".sb-inline-editor")).toBeVisible();
    await page.keyboard.type(note);
    await page.keyboard.press("Enter");
    await expect.poll(async () => (await read(key))?.text ?? []).toContain(note);
    const source = await read(key);
    sourceId = source.id;
    expect(source.visibility).toEqual(privateBoard);
    for (const visibility of ["private", "public"]) {
      const name = visibility + " exhibit";
      await page.evaluate(async ({key, name, visibility}) => {
        const meteor = (window as any).Meteor;
        const {slateBase: slate} = await meteor.callAsync("slates.get", {shareId:key});
        slate.options.name = name;
        await meteor.callAsync("slates.update", {slate});
        if (visibility === "public") await meteor.callAsync("slateAccess.configureLink", {slateId:slate.options.id, type:visibility, permission:"READ"});
      }, {key, name, visibility});
      await page.goto(origin + "/");
      await page.getByRole("button", {name:"Options for " + name, exact:true}).click();
      await page.getByRole("menuitem", {name:"Make a copy"}).click();
      const boards = page.getByRole("button", {name:"Open " + name, exact:true});
      await expect(boards).toHaveCount(2);
      await boards.first().click();
      await page.waitForURL(/\/canvas\//);
      if (page.url().endsWith("/" + key)) {
        await page.goto(origin + "/");
        await boards.nth(1).click();
        await page.waitForURL(/\/canvas\//);
      }
      const copyKey = new URL(page.url()).pathname.split("/").pop()!;
      expect(copyKey).not.toBe(key);
      const copy = await read(copyKey);
      expect(copy.owner).toBe(owner);
      expect(copy.visibility).toEqual(privateBoard);
      expect(copy.text).toContain(note);
      expect((await read(key)).visibility).toEqual(visibility === "public" ? publicBoard : privateBoard);
    }
  } finally {
    const removed = await page.evaluate(async ({owner, sourceId}) => {
      const meteor = (window as any).Meteor;
      if (meteor.userId() !== owner) throw new Error("Unexpected fixture owner");
      // Remove the source's sharing grant before deleting its owner and copies.
      if (sourceId) await meteor.callAsync("slates.remove", {slateIds:[sourceId]});
      return meteor.callAsync("users.delete");
    }, {owner, sourceId});
    expect(removed).toBe(true);
    const check = await page.context().browser()!.newPage();
    try {
      await check.goto(origin + "/plans");
      await check.waitForFunction(() => (window as any).Meteor?.status().connected);
      expect(await check.evaluate(() => (window as any).Meteor.userId())).toBeNull();
      await expect.poll(() => check.evaluate(async credentials => new Promise(resolve => {
        (window as any).Meteor.loginWithPassword(credentials.email, credentials.password, (error: any) => resolve(error?.error));
      }), {email, password})).toBe(403);
    } finally {
      await check.close();
    }
  }
});
