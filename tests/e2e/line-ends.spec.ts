import { test, expect, type Page } from "@playwright/test";

/**
 * A selected line's ends: a handle at each end that shows whether the end follows
 * its note (hollow circle), is pinned to a spot on the note's edge (filled square)
 * or is free on the canvas (diamond). Dragging an end onto a note's edge pins it
 * there, onto the note's middle makes it follow, onto empty canvas leaves it free.
 * The line keeps its id throughout. No padlocks. The line tool draws a new line
 * from a note without making a note.
 */

async function setup(page: Page) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async () => {
    const sb = (window as any).Slatebox;
    const div = document.createElement("div");
    div.id = "slateCanvas";
    div.style.cssText = "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
    document.body.appendChild(div);
    const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
    (window as any).__slate = s;
    s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 160, height: 100, text: "A" }));
    s.nodes.add(new sb.node({ id: "B", xPos: 600, yPos: 420, width: 160, height: 100, text: "B" }));
    s.nodes.add(new sb.node({ id: "C", xPos: 640, yPos: 110, width: 160, height: 100, text: "C" }));
    await new Promise((r) => setTimeout(r, 400));
    s.v2.nodes.one("A").relationships.addAssociation(s.v2.nodes.one("B"));
    await new Promise((r) => setTimeout(r, 300));
  });
}

const lines = (page: Page) =>
  page.evaluate(() => {
    const s = (window as any).__slate;
    return s.v2.nodes.allNodes.flatMap((n: any) =>
      n.relationships.associations.map((a: any) => ({
        owner: n.id, id: a.id, childId: a.childId, targetPoint: a.targetPoint ?? null,
        sourceAnchor: a.sourceAnchor ?? null, targetAnchor: a.targetAnchor ?? null,
        showParentArrow: !!a.showParentArrow, showChildArrow: a.showChildArrow !== false,
      }))
    );
  });

async function selectLine(page: Page) {
  const pt = await page.evaluate(() => {
    const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement;
    const m = p.getPointAtLength(p.getTotalLength() / 2).matrixTransform(p.getScreenCTM()!);
    return { x: m.x, y: m.y };
  });
  await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(250);
}

const handleAt = (page: Page, which: "source" | "target") =>
  page.evaluate((which) => {
    const h = document.querySelector(`#slateCanvas .connector-handle-${which}`) as SVGGraphicsElement;
    const r = h.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, which);

const nodeAt = (page: Page, id: string, fx = 0.5, fy = 0.5) =>
  page.evaluate(([id, fx, fy]) => {
    const r = document.querySelector(`#slateCanvas [data-node-id="${id}"]`)!.getBoundingClientRect();
    return { x: r.x + r.width * (fx as number), y: r.y + r.height * (fy as number) };
  }, [id, fx, fy] as const);

async function drag(page: Page, from: { x: number; y: number }, to: { x: number; y: number }) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) {
    await page.mouse.move(from.x + ((to.x - from.x) * i) / 12, from.y + ((to.y - from.y) * i) / 12);
    await page.waitForTimeout(15);
  }
  await page.mouse.up();
  await page.waitForTimeout(350);
}

const world = (page: Page, p: { x: number; y: number }) =>
  page.evaluate((p) => {
    const w = (window as any).__slate.v2.canvas.point(p.x, p.y);
    return { x: w.x, y: w.y };
  }, p);

test.describe("a selected line's ends", () => {
  test("show a handle each, named for what they do, and no padlocks", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await expect(page.locator("#slateCanvas .endpoint-lock")).toHaveCount(0);
    const target = page.locator("#slateCanvas .connector-handle-target");
    await expect(target).toHaveAttribute("role", "button");
    await expect(target).toHaveAttribute("tabindex", "0");
    await expect(target).toHaveAttribute("aria-label", /end of the line.*follows/i);
    await expect(page.locator('#slateCanvas .connector-handle-glyph[data-end="target"]')).toHaveAttribute("data-state", "follow");
    // The handle is drawn above the notes and is big enough to take a finger.
    const box = await target.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    // Its tooltip names every key that changes it (the arrow keys pin a following end too).
    await expect(target.locator("title")).toHaveText(/Enter pins it where it is; the arrow keys pin it/);
    // The mark of an end that follows is open: nothing in it is filled, so the arrowhead under it shows.
    const fills = await page.evaluate(() =>
      [...document.querySelectorAll('#slateCanvas .connector-handle-glyph[data-end="target"] *')].map((el) => el.getAttribute("fill"))
    );
    expect(fills.length).toBeGreaterThan(0);
    expect(fills.every((f) => f === "none")).toBe(true);
  });

  test("a click on an end, without moving it, leaves the line as it is: following, or free where it was", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    const before = await lines(page);
    const target = await handleAt(page, "target");
    await page.mouse.click(target.x, target.y);
    await page.waitForTimeout(350);
    expect(await lines(page)).toEqual(before);
    await expect(page.locator("#slateCanvas .connector-handle-target")).toHaveAttribute("aria-label", /end of the line.*follows/i);
    // The click selects the line, as a click on the line does: its ends stay shown.
    await expect(page.locator('#slateCanvas .connector-handle-target.connector-handle--revealed')).toHaveCount(1);
    // A free end clicked stays free, where it was.
    await drag(page, await handleAt(page, "target"), { x: 420, y: 600 });
    const free = await lines(page);
    expect(free[0].childId).toMatch(/^__free_/);
    const end = await handleAt(page, "target");
    await page.mouse.click(end.x, end.y);
    await page.waitForTimeout(350);
    expect(await lines(page)).toEqual(free);
  });

  test("an end dropped on empty canvas stays there, free, and the line keeps its id", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    const drop = { x: 420, y: 600 };
    await drag(page, await handleAt(page, "target"), drop);
    const [line] = await lines(page);
    const w = await world(page, drop);
    expect(line).toMatchObject({ owner: "A", id: "A->B" });
    expect(line.childId).toMatch(/^__free_/);
    expect(Math.abs(line.targetPoint.x - w.x)).toBeLessThan(3);
    expect(Math.abs(line.targetPoint.y - w.y)).toBeLessThan(3);
    // Still selected, now shown as free.
    await expect(page.locator('#slateCanvas .connector-handle-glyph[data-end="target"]')).toHaveAttribute("data-state", "free");
  });

  test("the starting end dropped on empty canvas: the other note keeps the line, drawn the same way", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await drag(page, await handleAt(page, "source"), { x: 120, y: 560 });
    const all = await lines(page);
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ owner: "B", id: "A->B", showParentArrow: true, showChildArrow: false });
    expect(all[0].targetPoint).not.toBeNull();
  });

  test("a line handed to another note keeps an id no other line has, when the first note connects again", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await drag(page, await handleAt(page, "source"), { x: 120, y: 560 });
    // B now holds A->B, with a free end. A connects to B again, in each way a line is made.
    await page.evaluate(async () => {
      const s = (window as any).__slate;
      s.v2.nodes.one("A").relationships.addAssociation(s.v2.nodes.one("B"));
      s.v2.nodes.one("A").relationships.addFloatingAssociation({ x: 40, y: 40 }, { childId: "B" } as any);
    });
    let ids = (await lines(page)).map((l) => l.id);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
    // And after saving and loading the slate.
    ids = await page.evaluate(async () => {
      const s = (window as any).__slate;
      const json = s.exportJSON();
      await s.loadJSON(json);
      await new Promise((r) => setTimeout(r, 400));
      return JSON.parse(s.exportJSON()).nodes.flatMap((n: any) => n.relationships.associations.map((a: any) => a.id));
    });
    expect(new Set(ids).size).toBe(3);
  });

  test("a note whose line was moved onto it takes the line with it when deleted", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await drag(page, await handleAt(page, "target"), await nodeAt(page, "C"));
    expect(await lines(page)).toMatchObject([{ owner: "A", id: "A->B", childId: "C" }]);
    await page.evaluate(() => (window as any).__slate.v2.removeNode("C"));
    expect(await lines(page)).toEqual([]);
    await expect(page.locator('#slateCanvas path[connectortype="default"]')).toHaveCount(0);
  });

  test("a free end dropped on a note's middle attaches and follows it", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await drag(page, await handleAt(page, "target"), { x: 420, y: 600 });
    await drag(page, await handleAt(page, "target"), await nodeAt(page, "C"));
    const [line] = await lines(page);
    expect(line).toMatchObject({ owner: "A", id: "A->B", childId: "C", targetPoint: null, targetAnchor: null });
  });

  test("an end dropped on a note's edge is pinned there; on its middle it follows", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await drag(page, await handleAt(page, "target"), await nodeAt(page, "B", 0.5, 0.06));
    let [line] = await lines(page);
    expect(line.childId).toBe("B");
    expect(line.targetAnchor).toEqual({ x: expect.any(Number), y: 0 });
    await expect(page.locator('#slateCanvas .connector-handle-glyph[data-end="target"]')).toHaveAttribute("data-state", "pinned");
    await drag(page, await handleAt(page, "target"), await nodeAt(page, "B"));
    [line] = await lines(page);
    expect(line.targetAnchor).toBeNull();
  });

  test("keyboard: Enter pins or frees an end to follow, arrows slide a pinned end round the edge", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await page.locator("#slateCanvas .connector-handle-target").focus();
    await page.keyboard.press("Enter");
    let [line] = await lines(page);
    expect(line.targetAnchor).not.toBeNull();
    const pinned = line.targetAnchor;
    await expect(page.locator("#slateCanvas .connector-handle-target")).toHaveAttribute("aria-label", /pinned/i);
    await page.keyboard.press(pinned.x === 0 || pinned.x === 1 ? "ArrowDown" : "ArrowRight");
    [line] = await lines(page);
    expect(line.targetAnchor).not.toEqual(pinned);
    await page.keyboard.press("Enter");
    [line] = await lines(page);
    expect(line.targetAnchor).toBeNull();
  });
});

test.describe("with touch", () => {
  test.use({ hasTouch: true });

  test("a finger drags an end onto empty canvas, then onto a note's edge", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    const cdp = await page.context().newCDPSession(page);
    const touchDrag = async (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const at = (p: { x: number; y: number }) => [{ x: p.x, y: p.y, id: 1 }];
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: at(from) });
      for (let i = 1; i <= 10; i++) {
        const p = { x: from.x + ((to.x - from.x) * i) / 10, y: from.y + ((to.y - from.y) * i) / 10 };
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: at(p) });
        await page.waitForTimeout(15);
      }
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForTimeout(350);
    };
    await touchDrag(await handleAt(page, "target"), { x: 420, y: 600 });
    let [line] = await lines(page);
    expect(line).toMatchObject({ owner: "A", id: "A->B" });
    expect(line.targetPoint).not.toBeNull();
    await touchDrag(await handleAt(page, "target"), await nodeAt(page, "C", 0.5, 0.06));
    [line] = await lines(page);
    expect(line).toMatchObject({ childId: "C", targetPoint: null });
    expect(line.targetAnchor).toEqual({ x: expect.any(Number), y: 0 });
  });
});

test.describe("export", () => {
  test("draws a line with a free end, and none of the end handles or their marks", async ({ page }) => {
    await setup(page);
    await selectLine(page);
    await drag(page, await handleAt(page, "target"), { x: 420, y: 600 });
    const svg = await page.evaluate(() => (window as any).__slate.v2.svg());
    expect(typeof svg).toBe("string");
    expect(svg).toContain('connectortype="default"');
    expect(svg).not.toContain("connector-handle");
    expect(svg).not.toContain("line-tool");
  });
});

test.describe("the line tool", () => {
  test("draws a line from a note to another note, or to a free point, without making a note; Esc cancels", async ({ page }) => {
    await setup(page);
    const count = () => page.evaluate(() => (window as any).__slate.v2.nodes.allNodes.length);
    const start = () => page.evaluate(() => { const s = (window as any).__slate; (window as any).__drawn = s.v2.startLineFrom(s.v2.nodes.one("A")); });

    await start();
    await page.mouse.move(400, 600);
    await expect(page.locator("#slateCanvas .line-tool-preview")).toHaveCount(1);
    const c = await nodeAt(page, "C");
    await page.mouse.click(c.x, c.y);
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "connected" });
    let all = await lines(page);
    expect(all.filter((l) => l.owner === "A").map((l) => l.childId).sort()).toEqual(["B", "C"]);

    await start();
    await page.mouse.click(400, 620);
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "free" });
    all = await lines(page);
    const free = all.find((l) => l.targetPoint);
    const w = await world(page, { x: 400, y: 620 });
    expect(Math.abs(free!.targetPoint.x - w.x)).toBeLessThan(3);

    await start();
    await page.mouse.move(300, 640);
    await page.keyboard.press("Escape");
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "cancelled" });
    await expect(page.locator("#slateCanvas .line-tool-preview")).toHaveCount(0);
    expect((await lines(page)).length).toBe(3);
    expect(await count()).toBe(3);
  });

  test("stops when the note it started from is deleted, and draws nothing from it", async ({ page }) => {
    await setup(page);
    const before = await lines(page);
    await page.evaluate(() => { const s = (window as any).__slate; (window as any).__drawn = s.v2.startLineFrom(s.v2.nodes.one("A")); });
    await page.mouse.move(400, 600);
    await page.evaluate(() => (window as any).__slate.v2.removeNode("A"));
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "cancelled" });
    expect(await page.evaluate(() => (window as any).__slate.v2.isDrawingLine())).toBe(false);
    await expect(page.locator("#slateCanvas .line-tool-preview")).toHaveCount(0);
    const c = await nodeAt(page, "C");
    await page.mouse.click(c.x, c.y);
    expect((await lines(page)).filter((l) => l.childId === "C")).toEqual([]);
    expect(before.length).toBe(1);
  });

  test("stops when the slate is replaced (undo) or destroyed", async ({ page }) => {
    await setup(page);
    // The slate loaded again: the note is a new one under the same id.
    await page.evaluate(() => { const s = (window as any).__slate; (window as any).__drawn = s.v2.startLineFrom(s.v2.nodes.one("A")); });
    await page.evaluate(async () => { const s = (window as any).__slate; await s.loadJSON(s.exportJSON()); });
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "cancelled" });
    await page.evaluate(() => { const s = (window as any).__slate; (window as any).__drawn = s.v2.startLineFrom(s.v2.nodes.one("A")); });
    await page.evaluate(() => (window as any).__slate.v2.destroy());
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "cancelled" });
  });
});

test.describe("the line tool with touch", () => {
  test.use({ hasTouch: true });

  test("a tap on a note connects to it; a pan or a pinch draws nothing; a tap on the canvas leaves the end free there", async ({ page }) => {
    await setup(page);
    const cdp = await page.context().newCDPSession(page);
    // A tap on a note connects to it, and the new line is what is selected, not the note.
    await page.evaluate(() => { const s = (window as any).__slate; (window as any).__drawn = s.v2.startLineFrom(s.v2.nodes.one("A")); });
    const c = await nodeAt(page, "C");
    await page.touchscreen.tap(c.x, c.y);
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "connected", associationId: "A->C" });
    expect(await page.evaluate(() => {
      const v2 = (window as any).__slate.v2;
      return { line: v2.getSelectedLine()?.association?.id ?? null, notes: v2.getSelectedNodes().length };
    })).toEqual({ line: "A->C", notes: 0 });

    const touch = (type: string, points: Array<{ x: number; y: number }>) =>
      cdp.send("Input.dispatchTouchEvent", { type, touchPoints: points.map((p, i) => ({ ...p, id: i + 1 })) });
    await page.evaluate(() => { const s = (window as any).__slate; (window as any).__drawn = s.v2.startLineFrom(s.v2.nodes.one("A")); });

    // One finger dragging across the canvas (a pan).
    await touch("touchStart", [{ x: 420, y: 600 }]);
    for (let i = 1; i <= 8; i++) {
      await touch("touchMove", [{ x: 420 + i * 12, y: 600 - i * 8 }]);
      await page.waitForTimeout(15);
    }
    await touch("touchEnd", []);
    await page.waitForTimeout(400);
    // Two fingers (a pinch).
    await touch("touchStart", [{ x: 380, y: 560 }]);
    await touch("touchStart", [{ x: 380, y: 560 }, { x: 480, y: 620 }]);
    for (let i = 1; i <= 6; i++) {
      await touch("touchMove", [{ x: 380 - i * 6, y: 560 - i * 4 }, { x: 480 + i * 6, y: 620 + i * 4 }]);
      await page.waitForTimeout(15);
    }
    await touch("touchEnd", []);
    await page.waitForTimeout(400);
    expect(await lines(page)).toHaveLength(2);
    expect(await page.evaluate(() => (window as any).__slate.v2.isDrawingLine())).toBe(true);

    // A tap on the canvas.
    await page.touchscreen.tap(400, 640);
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => (window as any).__drawn)).toMatchObject({ result: "free" });
    const free = (await lines(page)).find((l) => l.targetPoint);
    const w = await world(page, { x: 400, y: 640 });
    expect(Math.abs(free!.targetPoint.x - w.x)).toBeLessThan(3);
  });
});
