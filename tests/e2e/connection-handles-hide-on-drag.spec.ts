import { test, expect } from "@playwright/test";

// User bug (Image #2): the 4 connection-plug dots stayed at the node's OLD position
// when the node was dragged away ("ghost" dots). They live in a global canvas group,
// so they don't follow the node — and selection re-runs updateSelectionResizeRotate()
// mid-drag (resize/rotate toggling) which re-showed them at the stale spot. Fix:
// enableConnectionHandles() stays pinned but does NOT show while the node is dragging;
// drag-end re-anchors them at the new position.
test.describe("connection handles hide during drag (§connector)", () => {
  test("plug dots hide mid-drag and reappear at the node's new position", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:640px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 160, width: 120, height: 70, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 300));
    });

    const center = async () =>
      page.evaluate(() => {
        const r = document
          .querySelector('#slateCanvas [data-node-id="A"]')!
          .getBoundingClientRect();
        return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
      });

    const visibleHandles = () =>
      page.evaluate(
        () =>
          [...document.querySelectorAll(".connection-handle")].filter((h) => {
            const r = h.getBoundingClientRect();
            const cs = getComputedStyle(h);
            return r.width > 3 && cs.display !== "none" && Number(cs.opacity) > 0.1;
          }).length
      );

    // Select → 4 plug handles appear.
    let c = await center();
    await page.mouse.click(c.cx, c.cy);
    await page.waitForTimeout(300);
    const beforePositions = await page.evaluate(() =>
      [...document.querySelectorAll(".connection-handle")]
        .filter((h) => h.getBoundingClientRect().width > 3)
        .map((h) => {
          const r = h.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        })
    );
    expect(beforePositions.length).toBe(4);

    // Drag the node well away, checking handle visibility mid-drag.
    await page.mouse.move(c.cx, c.cy);
    await page.mouse.down();
    await page.waitForTimeout(80);
    await page.mouse.move(c.cx + 130, c.cy + 150, { steps: 8 });
    await page.waitForTimeout(120);
    const midDragVisible = await visibleHandles();
    await page.mouse.move(c.cx + 260, c.cy + 300, { steps: 8 });
    await page.waitForTimeout(120);
    await page.mouse.up();
    await page.waitForTimeout(400);

    // Mid-drag: no visible handles (no ghost dots left behind).
    expect(midDragVisible).toBe(0);

    // After drop: handles reappear, none at an OLD position, all near the new node.
    const result = await page.evaluate((old: { x: number; y: number }[]) => {
      const nr = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      const handles = [...document.querySelectorAll(".connection-handle")]
        .filter((h) => {
          const r = h.getBoundingClientRect();
          return r.width > 3 && Number(getComputedStyle(h).opacity) > 0.1;
        })
        .map((h) => {
          const r = h.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
      const ghosts = handles.filter((h) =>
        old.some((o) => Math.abs(h.x - o.x) < 40 && Math.abs(h.y - o.y) < 40)
      ).length;
      const ncx = nr.x + nr.width / 2, ncy = nr.y + nr.height / 2;
      const nearNew = handles.filter(
        (h) => Math.hypot(h.x - ncx, h.y - ncy) < 170
      ).length;
      return { count: handles.length, ghosts, nearNew };
    }, beforePositions);

    expect(result.ghosts).toBe(0);
    expect(result.nearNew).toBeGreaterThanOrEqual(3);
  });

  // A click on a note that is already selected is a drag that never moves. The
  // dots used to be hidden on the press and shown again a moment after the
  // release, so they blinked, and a click on one of them right after missed.
  test("a click on a selected note keeps its plug dots in place, and one can be clicked straight after", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:640px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 160, width: 120, height: 70, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 300));
    });
    const box = (await page.locator('#slateCanvas [data-node-id="A"]').boundingBox())!;
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    await page.mouse.click(cx, cy);
    await page.waitForTimeout(300);

    const shown = () =>
      page.evaluate(() => {
        const a = (window as any).__s.v2.nodes.one("A");
        const dot = a.connectionHandles?.right?.node as SVGElement | undefined;
        const r = dot?.getBoundingClientRect();
        return { visible: a.isConnectionHandlesEnabled(), width: r ? Math.round(r.width) : 0 };
      });
    expect((await shown()).visible).toBe(true);

    await page.mouse.down();
    const pressed = await shown();
    await page.mouse.up();
    const released = await shown();
    expect(pressed.visible).toBe(true);
    expect(pressed.width).toBeGreaterThan(3);
    expect(released.visible).toBe(true);
    expect(released.width).toBeGreaterThan(3);

    // The right dot, clicked at once, adds a connected note.
    const dot = await page.evaluate(() => {
      const a = (window as any).__s.v2.nodes.one("A");
      const r = (a.connectionHandles.right.node as SVGElement).getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(dot.x, dot.y);
    await expect
      .poll(() => page.evaluate(() => (window as any).__s.v2.nodes.allNodes.length))
      .toBe(2);
  });
});
