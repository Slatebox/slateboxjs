import { expect, test } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { openGuestCanvas } from "./app-host.shared";

const origin = process.env.SLATEBOX_APP_URL || "http://localhost:3000";
const fixture = JSON.parse(readFileSync(join(__dirname, "../fixtures/real-slates/flowchart.json"), "utf8"));

test("a saved legacy flowchart keeps its shapes and connections after an editor adds a note", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(origin).hostname), "Uses an isolated owner and private test slate");
  await openGuestCanvas(page, origin);
  const shareId = randomBytes(5).toString("hex");
  const id = randomBytes(12).toString("hex");
  await page.evaluate(async ({ id, shareId, nodes }) => {
    await (window as any).Meteor.callAsync("slates.update", {
      slate: { shareId, options: { id, name: "Archived flowchart", isPrivate: true, isPublic: false }, nodes },
    });
  }, { id, shareId, nodes: fixture.nodes });

  await page.goto(origin + "/canvas/" + shareId);
  const node = (key: string) => page.locator('#slateCanvas g[data-node-id="' + key + '"]').first();
  const decision = fixture.nodes.find((entry: any) => entry.options.text === "Decision");
  await expect(node(decision.options.id)).toContainText("Decision");
  const cookieConsent = page.locator('[data-cookie-notice] button');
  if (await cookieConsent.isVisible()) await cookieConsent.click();
  await page.getByRole("button", {name: "Slatebox - quickly add a node"}).focus();
  const addText = page.getByRole("button", {name: "Add Text", exact: true});
  await expect(addText).toBeVisible();
  await addText.press("Enter");
  const newNote = "Ask the field team which path they took";
  // Restated 2026-11-19: the note pane's text box is gone; a new text note opens its editor on the canvas.
  await expect(page.locator(".sb-inline-editor")).toBeVisible();
  await page.keyboard.type(newNote);
  await page.keyboard.press("Enter");

  // Compare endpoint pairs. Legacy snapshots repeat some links on both nodes.
  const edges = (nodes: typeof fixture.nodes) => [...new Set<string>(nodes.flatMap((entry: any) =>
    (entry.relationships?.associations || []).map((a: any) => a.parentId + "/" + a.childId)))].sort();
  const oldEdges = edges(fixture.nodes);
  expect(oldEdges.length).toBeGreaterThan(1);
  await expect(async () => {
    const saved = await page.evaluate(async key => {
      const { slateBase } = await (window as any).Meteor.callAsync("slates.get", {shareId: key});
      return slateBase.nodes;
    }, shareId);
    expect(saved.some((entry: any) => entry.options.text === newNote)).toBe(true);
    expect(edges(saved)).toEqual(oldEdges);
    for (const old of fixture.nodes) {
      const current = saved.find((entry: any) => entry.options.id === old.options.id);
      expect(current?.options.text).toBe(old.options.text);
      expect(current?.options.vectorPath).toBe(old.options.vectorPath);
    }
  }).toPass({ timeout: 20000 });
  await page.reload();
  for (const old of fixture.nodes) await expect(node(old.options.id)).toContainText(old.options.text);
  await expect(page.locator("#slateCanvas").getByRole("button", {name: newNote, exact: true})).toHaveCount(1);
});
