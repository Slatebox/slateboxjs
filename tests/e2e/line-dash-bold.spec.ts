import { expect, test, type Page } from "@playwright/test";

// Dashed and dotted lines, and bold note text: drawn, carried by the same packages as
// every other style (so they sync and undo), and kept when the slate is saved and loaded.

async function openBoard(page: Page) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async () => {
    const w = window as any;
    const sb = w.Slatebox;
    const div = document.createElement("div");
    div.id = "board";
    div.style.cssText = "position:fixed;left:0;top:0;width:1000px;height:700px;background:white";
    document.body.replaceChildren(div);
    w.sent = [] as any[];
    const s = await new sb.slate(
      { container: "board", allowCollaboration: false, showbirdsEye: false, contextToolbar: "host" },
      { onSlateChanged: (pkg: any) => w.sent.push(pkg.type) }
    ).init();
    s.nodes.add(new sb.node({ id: "a", xPos: 160, yPos: 300, width: 150, height: 80, text: "Alpha" }));
    s.nodes.add(new sb.node({ id: "b", xPos: 620, yPos: 300, width: 150, height: 80, text: "Beta" }));
    await Promise.all(s.v2.getAllNodes().map((n: any) => n.ready));
    s.v2.getNode("a").relationships.addAssociation(s.v2.getNode("b"));
    await new Promise((r) => setTimeout(r, 300));
    w.s = s;
  });
}

const dash = (page: Page) =>
  page.evaluate(() => document.querySelector('#board path[connectortype="default"]')!.getAttribute("stroke-dasharray"));
const weight = (page: Page, id: string) =>
  page.evaluate((id) => {
    const t = document.querySelector(`#board g[data-node-id="${id}"] text`)!;
    return t.getAttribute("font-weight") || getComputedStyle(t).fontWeight;
  }, id);

test("a line package with lineDash draws dashes, dots, and solid again", async ({ page }) => {
  await openBoard(page);
  expect(await dash(page)).toBeNull();
  const send = (val: string) =>
    page.evaluate((val) => {
      const s = (window as any).s;
      const assoc = s.v2.getNode("a").relationships.getAssociations()[0];
      const pkg = { type: "onLinePropertiesChanged", data: { id: "a", associationId: assoc.id, prop: "lineDash", val } };
      s.collab.invoke([pkg]);
      s.collab.send([pkg]);
    }, val);
  await send("dashed");
  expect(await dash(page)).toMatch(/^\d+(\.\d+)? \d+/);
  await send("dotted");
  expect(await dash(page)).toMatch(/^0\.1 /);
  await send("solid");
  expect(await dash(page)).toBeNull();
  await send("dashed");
  // Kept through a save and a load.
  const json = await page.evaluate(() => (window as any).s.exportJSON());
  expect(JSON.parse(json).nodes.find((n: any) => n.options.id === "a").relationships.associations[0].lineDash).toBe("dashed");
  await page.evaluate(async (json) => {
    await (window as any).s.loadJSON(json);
    await new Promise((r) => setTimeout(r, 400));
  }, json);
  expect(await dash(page)).toMatch(/^\d+(\.\d+)? \d+/);
});

test("a wider dashed line gets longer dashes", async ({ page }) => {
  await openBoard(page);
  const set = (prop: string, val: any) =>
    page.evaluate(
      ({ prop, val }) => {
        const s = (window as any).s;
        const assoc = s.v2.getNode("a").relationships.getAssociations()[0];
        s.v2.getNode("a").relationships.applyLineProperty(assoc.id, prop, val);
      },
      { prop, val }
    );
  await set("lineDash", "dashed");
  const thin = await dash(page);
  await set("lineWidth", 10);
  const thick = await dash(page);
  expect(parseFloat(thick!)).toBeGreaterThan(parseFloat(thin!));
});

test("bold text: drawn, sent, undone, kept through save and load", async ({ page }) => {
  await openBoard(page);
  expect(await weight(page, "a")).not.toBe("bold");
  // Let the board's own setup settle into an undo step of its own first.
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const s = (window as any).s;
    const pkg = { type: "onNodeTextChanged", data: { id: "a", fontWeight: "bold" } };
    s.collab.invoke([pkg]);
    s.collab.send([pkg]);
  });
  expect(await weight(page, "a")).toMatch(/bold|700/);
  expect(await page.evaluate(() => (window as any).s.v2.getNode("a").options.text)).toBe("Alpha");
  const json = await page.evaluate(() => (window as any).s.exportJSON());
  expect(JSON.parse(json).nodes.find((n: any) => n.options.id === "a").options.fontWeight).toBe("bold");
  await page.evaluate(async () => {
    const s = (window as any).s;
    await new Promise((r) => setTimeout(r, 600));
    s.v2.undoRedo.undo();
    await new Promise((r) => setTimeout(r, 600));
  });
  expect(await weight(page, "a")).not.toMatch(/bold|700/);
  await page.evaluate(async (json) => {
    await (window as any).s.loadJSON(json);
    await new Promise((r) => setTimeout(r, 400));
  }, json);
  expect(await weight(page, "a")).toMatch(/bold|700/);
});
