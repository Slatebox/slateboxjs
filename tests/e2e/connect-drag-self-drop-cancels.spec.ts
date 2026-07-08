import { test, expect } from "@playwright/test";

// Regression guard for the drag-to-empty feature: releasing a connect-drag back ON the
// SOURCE node is a CANCEL, not empty canvas. nodeUnder self-excludes the source, so the
// release arrives with target=null — the create-on-empty branch must NOT spawn a node on
// top of the source. Guarded by an over-self bbox check.
test.describe("connect-drag self-drop cancels (§canvas)", () => {
  test("releasing the connector back on the source creates nothing", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "A", xPos: 300, yPos: 250, width: 150, height: 100, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    const count = () =>
      page.evaluate(() => (window as any).__s.v2.nodes.allNodes.length);
    expect(await count()).toBe(1);

    // Select A, grab its right plug.
    const ac = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, right: r.right };
    });
    await page.mouse.click(ac.cx, ac.cy);
    await page.waitForTimeout(400);
    const handle = await page.evaluate((right) => {
      const dots = [...document.querySelectorAll("circle")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 6 && r.width < 28;
        })
        .map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
      return (
        dots.filter((h) => h.x > right - 30).sort((a, b) => b.x - a.x)[0] ||
        dots[0] ||
        null
      );
    }, ac.right);
    expect(handle).not.toBeNull();

    // Drag out, then back onto the source, and release there.
    await page.mouse.move(handle!.x, handle!.y);
    await page.mouse.down();
    await page.mouse.move(handle!.x + 160, handle!.y + 90, { steps: 8 });
    await page.mouse.move(ac.cx, ac.cy, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(600);

    // No node created, no connector, no rogue preview.
    expect(await count()).toBe(1);
    const conns = await page.evaluate(
      () =>
        document.querySelectorAll('#slateCanvas path[connectortype="default"]')
          .length
    );
    expect(conns).toBe(0);
    const rogue = await page.evaluate(
      () => document.querySelectorAll(".connect-drag-line").length
    );
    expect(rogue).toBe(0);
  });
});
