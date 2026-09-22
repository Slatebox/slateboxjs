import { test, expect, Page } from "@playwright/test";

// Miro-style groups — the full human experience, driven in a real browser:
// group/ungroup, select-as-one (real click), move-as-one (real drag),
// rotate-as-one (real knob drag), lock-as-one, enter-to-edit (real double-click),
// Escape to exit, and the Cmd/Ctrl+G / Cmd/Ctrl+Shift+G shortcuts.
//
// Groups are covered by unit tests (Slate.test.ts) with a fake nodes manager;
// this spec is the integration proof that the whole thing works against real
// Node/NodesManager/SVG.js with real pointer input.

async function boot(page: Page) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async () => {
    const sb = (window as any).Slatebox;
    const div = document.createElement("div");
    div.id = "slateCanvas";
    div.style.cssText =
      "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
    document.body.appendChild(div);
    const s = await new sb.slate(
      { container: "slateCanvas", allowCollaboration: false },
      {}
    ).init();
    (window as any).__s = s;
    s.nodes.add(
      new sb.node({ id: "A", xPos: 200, yPos: 200, width: 120, height: 80, text: "A" })
    );
    s.nodes.add(
      new sb.node({ id: "B", xPos: 480, yPos: 200, width: 120, height: 80, text: "B" })
    );
    await new Promise((r) => setTimeout(r, 300));
  });
}

/** Screen-space center of a node's SVG group. */
async function nodeCenter(page: Page, id: string) {
  return page.evaluate((id) => {
    const el = document.querySelector(
      `#slateCanvas [data-node-id="${id}"]`
    ) as SVGGraphicsElement;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, id);
}

const opts = (page: Page, id: string) =>
  page.evaluate(
    (id) => ({ ...(window as any).__s.v2.nodes.one(id).options }),
    id
  );

test.describe("Miro-style groups (e2e, real interactions)", () => {
  test("group → both share a groupId and select as one on a real click", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.groupNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
      v2.clearSelection();
    });

    const a = await opts(page, "A");
    const b = await opts(page, "B");
    expect(a.groupId).toBeTruthy();
    expect(b.groupId).toBe(a.groupId);

    // Real click on A should select the WHOLE group.
    const ca = await nodeCenter(page, "A");
    await page.mouse.click(ca.x, ca.y);
    await page.waitForTimeout(200);
    const selCount = await page.evaluate(
      () => (window as any).__s.v2.getSelectedNodes().length
    );
    expect(selCount).toBe(2);
  });

  test("move-as-one: dragging one member drags the whole group", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.groupNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
      v2.clearSelection();
    });
    const before = { a: await opts(page, "A"), b: await opts(page, "B") };
    const ca = await nodeCenter(page, "A");

    await page.mouse.move(ca.x, ca.y);
    await page.mouse.down();
    await page.waitForTimeout(60);
    for (let i = 1; i <= 8; i++) {
      await page.mouse.move(ca.x + i * 12, ca.y + i * 8, { steps: 2 });
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);

    const after = { a: await opts(page, "A"), b: await opts(page, "B") };
    const aDx = Math.round(after.a.x - before.a.x);
    const aDy = Math.round(after.a.y - before.a.y);
    const bDx = Math.round(after.b.x - before.b.x);
    const bDy = Math.round(after.b.y - before.b.y);
    expect(aDx).not.toBe(0);
    expect(Math.abs(bDx - aDx)).toBeLessThan(4);
    expect(Math.abs(bDy - aDy)).toBeLessThan(4);
  });

  test("rotate-as-one: dragging the group knob turns both nodes rigidly", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.selectNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
    });
    await page.waitForTimeout(300);

    // Locate the rotate knob (last <circle> in the group-selection overlay) and
    // the group centre (dashed outline centre), in screen coords.
    const geo = await page.evaluate(() => {
      const rect = document.querySelector(
        "#slateCanvas [stroke-dasharray]"
      ) as SVGGraphicsElement | null;
      if (!rect) return null;
      const circles = [...rect.parentNode!.querySelectorAll("circle")];
      if (!circles.length) return null;
      const knob = circles[circles.length - 1].getBoundingClientRect();
      const rb = rect.getBoundingClientRect();
      return {
        kx: knob.x + knob.width / 2,
        ky: knob.y + knob.height / 2,
        gcx: rb.x + rb.width / 2,
        gcy: rb.y + rb.height / 2,
      };
    });
    expect(geo).not.toBeNull();

    const before = { a: await opts(page, "A"), b: await opts(page, "B") };

    // Rotate the knob ~90° around the group centre: (dx,dy) -> (-dy,dx).
    const dx = geo!.kx - geo!.gcx;
    const dy = geo!.ky - geo!.gcy;
    const nx = geo!.gcx + -dy;
    const ny = geo!.gcy + dx;
    await page.mouse.move(geo!.kx, geo!.ky);
    await page.mouse.down();
    await page.waitForTimeout(40);
    await page.mouse.move(nx, ny, { steps: 6 });
    await page.waitForTimeout(40);
    await page.mouse.up();
    await page.waitForTimeout(300);

    const after = { a: await opts(page, "A"), b: await opts(page, "B") };
    const aRot = (after.a.rotate?.rotationAngle || 0) - (before.a.rotate?.rotationAngle || 0);
    const bRot = (after.b.rotate?.rotationAngle || 0) - (before.b.rotate?.rotationAngle || 0);
    // Both rotated a substantial amount…
    expect(Math.abs(aRot)).toBeGreaterThan(30);
    expect(Math.abs(bRot)).toBeGreaterThan(30);
    // …by the SAME delta (rigid group).
    expect(Math.abs(aRot - bRot)).toBeLessThan(2);
    // A member NOT at the group centre must also have revolved (position changed).
    const moved = Math.hypot(after.a.x - before.a.x, after.a.y - before.a.y);
    expect(moved).toBeGreaterThan(20);
  });

  test("lock-as-one: locking via one member locks all; drag is then a no-op", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.groupNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
      v2.lockNodes([v2.nodes.one("A")]);
    });
    const a = await opts(page, "A");
    const b = await opts(page, "B");
    expect(a.isLocked).toBe(true);
    expect(b.isLocked).toBe(true);

    // A locked node must not move on drag.
    const before = await opts(page, "A");
    const ca = await nodeCenter(page, "A");
    await page.mouse.move(ca.x, ca.y);
    await page.mouse.down();
    for (let i = 1; i <= 6; i++)
      await page.mouse.move(ca.x + i * 15, ca.y + i * 10, { steps: 2 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    const after = await opts(page, "A");
    expect(Math.round(after.x)).toBe(Math.round(before.x));
    expect(Math.round(after.y)).toBe(Math.round(before.y));
  });

  test("enter-to-edit: double-click a grouped node selects just that member; Escape exits", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.groupNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
      v2.clearSelection();
    });

    const ca = await nodeCenter(page, "A");
    await page.mouse.dblclick(ca.x, ca.y);
    await page.waitForTimeout(250);

    const entered = await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      return {
        enteredGid: v2.getEnteredGroupId(),
        sel: v2.getSelectedNodes().map((n: any) => n.id),
      };
    });
    expect(entered.enteredGid).toBeTruthy();
    expect(entered.sel).toEqual(["A"]);

    // Escape steps out of the group (re-selects the whole group).
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const exited = await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      return {
        enteredGid: v2.getEnteredGroupId(),
        selCount: v2.getSelectedNodes().length,
      };
    });
    expect(exited.enteredGid).toBeNull();
    expect(exited.selCount).toBe(2);
  });

  test("keyboard: Cmd/Ctrl+G groups, Cmd/Ctrl+Shift+G ungroups", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.selectNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
    });
    await page.waitForTimeout(150);

    const mod = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${mod}+g`);
    await page.waitForTimeout(200);
    let a = await opts(page, "A");
    let b = await opts(page, "B");
    expect(a.groupId).toBeTruthy();
    expect(b.groupId).toBe(a.groupId);

    await page.keyboard.press(`${mod}+Shift+g`);
    await page.waitForTimeout(200);
    a = await opts(page, "A");
    b = await opts(page, "B");
    expect(a.groupId).toBeFalsy();
    expect(b.groupId).toBeFalsy();
  });

  test("ungroup: after ungrouping, members are independent again", async ({
    page,
  }) => {
    await boot(page);
    await page.evaluate(() => {
      const v2 = (window as any).__s.v2;
      v2.groupNodes([v2.nodes.one("A"), v2.nodes.one("B")]);
      v2.ungroupNodes([v2.nodes.one("A")]);
      v2.clearSelection();
    });
    const a = await opts(page, "A");
    const b = await opts(page, "B");
    expect(a.groupId).toBeFalsy();
    expect(b.groupId).toBeFalsy();

    // Clicking A now selects ONLY A.
    const ca = await nodeCenter(page, "A");
    await page.mouse.click(ca.x, ca.y);
    await page.waitForTimeout(200);
    const sel = await page.evaluate(() =>
      (window as any).__s.v2.getSelectedNodes().map((n: any) => n.id)
    );
    expect(sel).toEqual(["A"]);
  });
});
