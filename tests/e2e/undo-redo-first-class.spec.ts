import { test, expect, type Page } from "@playwright/test";

// First-class undo and redo on the engine (the app's Undo and Redo controls call these
// same methods): every kind of edit a person makes goes back with Ctrl/Cmd+Z and forward
// again with Ctrl/Cmd+Shift+Z or Ctrl+Y, a drag is one step however long it lasts, and a
// host's own step (a board's change on its server) is undone and redone in the same history.

async function open(page: Page) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).SlateboxJS);
  await page.evaluate(async () => {
    const s = (window as any).SlateboxJS("#app", {
      viewPort: { originalWidth: 1200, originalHeight: 800 },
      panZoom: { enabled: false },
      showUndoRedo: true,
    });
    (window as any).slate = s;
    (window as any).undoStates = [];
    (window as any).outcomes = [];
    s.onUndoRedo((state: any, outcome: any) => {
      (window as any).undoStates.push(state);
      if (outcome) (window as any).outcomes.push(outcome);
    });
    for (const [id, x] of [["A", 160], ["B", 520]] as const) {
      const n = s.addNode({ id, x, y: 200, width: 140, height: 90, text: id });
      if (n.ready) await n.ready;
    }
    await new Promise((r) => setTimeout(r, 50));
    s.undoRedo.clear();
    s.undoRedo.snap(true); // the slate as it starts, with nothing to undo
  });
}

/** What a step changes, read back from the slate. */
const read = (page: Page) =>
  page.evaluate(() => {
    const s = (window as any).slate;
    return s.nodes.allNodes
      .map((n: any) => ({
        id: n.id,
        text: n.options.text,
        x: Math.round(n.options.x),
        y: Math.round(n.options.y),
        w: Math.round(n.options.width),
        h: Math.round(n.options.height),
        r: Math.round(n.options.rotate?.rotationAngle ?? n.options.rotationAngle ?? 0),
        bg: n.options.backgroundColor,
        group: n.options.groupId || null,
        lines: (n.relationships?.associations || []).filter((a: any) => a.parentId === n.id).map((a: any) => a.childId),
      }))
      .sort((a: any, b: any) => a.id.localeCompare(b.id));
  });

const settle = (page: Page) =>
  page.evaluate(async () => {
    const s = (window as any).slate;
    await new Promise((r) => setTimeout(r, 650)); // a burst's pause
    await s.undoRedo.whenRestored();
    await new Promise((r) => setTimeout(r, 50));
  });

const stackDepth = (page: Page) => page.evaluate(() => (window as any).slate.undoRedo.undoStack.length);

async function center(page: Page, id: string) {
  return page.evaluate((nid) => {
    const r = (document.querySelector(`#app [data-node-id="${nid}"]`) as SVGGraphicsElement).getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, id);
}

async function roundTrip(page: Page, edit: () => Promise<void>, redoKey = "Control+Shift+Z") {
  const before = await read(page);
  await edit();
  await settle(page);
  const after = await read(page);
  expect(after).not.toEqual(before);
  await page.locator("body").click({ position: { x: 5, y: 5 } }).catch(() => {});
  await page.keyboard.press("Control+Z");
  await settle(page);
  expect(await read(page)).toEqual(before);
  await page.keyboard.press(redoKey);
  await settle(page);
  expect(await read(page)).toEqual(after);
}

test.describe("first-class undo and redo (engine)", () => {
  test("every kind of edit goes back with Ctrl+Z and forward with Ctrl+Shift+Z or Ctrl+Y", async ({ page }) => {
    await open(page);
    const invoke = (pkgs: any[]) =>
      page.evaluate((p) => {
        const s = (window as any).slate;
        s.collab.invoke(p);
        s.collab.send(p);
      }, pkgs);

    // A note added.
    await roundTrip(page, () => page.evaluate(() => { (window as any).slate.addNode({ id: "C", x: 300, y: 450, width: 120, height: 80, text: "C" }); }));
    // Its text edited (the editor's package).
    await roundTrip(page, () => invoke([{ type: "onNodeTextChanged", data: { id: "A", text: "Alpha" } }]), "Control+Y");
    // Resized, rotated and restyled (the style bar's packages).
    await roundTrip(page, () => invoke([{ type: "onNodeResized", data: { id: "A", width: 220, height: 130 } }]));
    await roundTrip(page, () => invoke([{ type: "onNodeRotated", data: { id: "A", rotationAngle: 30 } }]));
    await roundTrip(page, () => invoke([{ type: "onNodeColorChanged", data: { id: "B", color: "#ff7755" } }]), "Control+Y");
    // Connected and grouped.
    await roundTrip(page, () => invoke([{ type: "addRelationship", data: { id: "A->B", parentId: "A", childId: "B", lineColor: "#333333", lineWidth: 3, showChildArrow: true } }]));
    await roundTrip(page, () => page.evaluate(() => {
      const s = (window as any).slate;
      s.groupNodes([s.nodes.one("A"), s.nodes.one("C")]);
    }));
    // Moved with the mouse.
    await roundTrip(page, async () => {
      const c = await center(page, "B");
      await page.mouse.move(c.x, c.y);
      await page.mouse.down();
      for (let i = 1; i <= 6; i++) await page.mouse.move(c.x + i * 15, c.y + i * 10, { steps: 2 });
      await page.mouse.up();
    });
    // Deleted with the Delete key.
    await roundTrip(page, async () => {
      await page.evaluate(() => { const s = (window as any).slate; s.selectNodes([s.nodes.one("C")]); });
      await page.keyboard.press("Delete");
    });
  });

  test("a drag with pauses longer than the burst's pause is still one step", async ({ page }) => {
    await open(page);
    const start = await read(page);
    const depth = await stackDepth(page);
    const c = await center(page, "A");
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    for (let i = 1; i <= 4; i++) {
      await page.mouse.move(c.x + i * 30, c.y + i * 12, { steps: 3 });
      await page.waitForTimeout(700); // held still mid-drag, longer than the pause
    }
    await page.mouse.up();
    await settle(page);
    expect(await stackDepth(page)).toBe(depth + 1);
    await page.keyboard.press("Control+Z");
    await settle(page);
    expect(await read(page)).toEqual(start);
  });

  test("a resize with its grip is one step", async ({ page }) => {
    await open(page);
    const start = await read(page);
    const depth = await stackDepth(page);
    await page.evaluate(() => { const s = (window as any).slate; s.selectNodes([s.nodes.one("A")]); });
    await page.waitForTimeout(100);
    // The bottom-right handle of the selection.
    const grip = await page.evaluate(() => {
      const handles = [...document.querySelectorAll("#app .svg_select_handle_rb, #app [class*='handle_rb'], #app .svg_select_points_rb")] as Element[];
      const el = handles.find((h) => (h as any).getBoundingClientRect().width > 0);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    test.skip(!grip, "this build draws no bottom-right grip");
    await page.mouse.move(grip!.x, grip!.y);
    await page.mouse.down();
    for (let i = 1; i <= 5; i++) {
      await page.mouse.move(grip!.x + i * 12, grip!.y + i * 8, { steps: 2 });
      await page.waitForTimeout(150);
    }
    await page.mouse.up();
    await settle(page);
    const resized = await read(page);
    expect(resized.find((n: any) => n.id === "A").w).toBeGreaterThan(start.find((n: any) => n.id === "A").w);
    expect(await stackDepth(page)).toBe(depth + 1);
    await page.keyboard.press("Control+Z");
    await settle(page);
    expect(await read(page)).toEqual(start);
  });

  test("Cmd+Shift+Z redoes on a Mac keyboard, and the listener hears there is something to redo", async ({ page }) => {
    await open(page);
    const start = await read(page);
    await page.evaluate(() => (window as any).slate.addNode({ id: "M", x: 300, y: 450, width: 120, height: 80, text: "M" }));
    await settle(page);
    const added = await read(page);
    await page.keyboard.press("Meta+Z");
    await settle(page);
    expect(await read(page)).toEqual(start);
    expect(await page.evaluate(() => (window as any).slate.undoRedoState())).toMatchObject({ canUndo: false, canRedo: true });
    await page.keyboard.press("Meta+Shift+Z");
    await settle(page);
    expect(await read(page)).toEqual(added);
    const states = await page.evaluate(() => (window as any).undoStates.map((s: any) => [s.canUndo, s.canRedo]));
    expect(states).toContainEqual([false, true]);
  });

  test("a host's own step is undone and redone by the host, between the drawing's steps", async ({ page }) => {
    await open(page);
    const start = await read(page);
    await page.evaluate(() => (window as any).slate.addNode({ id: "H", x: 300, y: 450, width: 120, height: 80, text: "H" }));
    await settle(page);
    await page.evaluate(() => {
      const w = window as any;
      w.boardMoves = [];
      w.slate.recordHostStep({
        label: "Move Audit log to Doing",
        undo: async () => { w.boardMoves.push("undo"); return true; },
        redo: async () => { w.boardMoves.push("redo"); return true; },
      });
    });
    expect(await page.evaluate(() => (window as any).slate.undoRedoState().undoLabel)).toBe("Move Audit log to Doing");
    await page.keyboard.press("Control+Z");
    await settle(page);
    await page.keyboard.press("Control+Z");
    await settle(page);
    expect(await read(page)).toEqual(start);
    await page.keyboard.press("Control+Y");
    await settle(page);
    await page.keyboard.press("Control+Y");
    await settle(page);
    expect(await page.evaluate(() => (window as any).boardMoves)).toEqual(["undo", "redo"]);
    expect((await read(page)).map((n: any) => n.id)).toContain("H");
  });

  test("a touch drag is one step, as on a phone", async ({ browser }) => {
    const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 }, isMobile: true });
    const page = await context.newPage();
    await open(page);
    const start = await read(page);
    const depth = await stackDepth(page);
    const c = await center(page, "A");
    // A finger's drag, as the browser's own touch input.
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: c.x, y: c.y }] });
    for (let i = 1; i <= 6; i++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: c.x + i * 8, y: c.y + i * 6 }] });
      await page.waitForTimeout(120);
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await settle(page);
    const moved = await read(page);
    expect(moved).not.toEqual(start);
    expect(await stackDepth(page)).toBe(depth + 1);
    await page.evaluate(() => (window as any).slate.undo());
    await settle(page);
    expect(await read(page)).toEqual(start);
    await page.evaluate(() => (window as any).slate.redo());
    await settle(page);
    expect(await read(page)).toEqual(moved);
    await context.close();
  });
});
