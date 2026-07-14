import { test, expect } from "@playwright/test";

// Miro parity: shift-click adds a node to the current selection (not just
// ctrl/meta-click). Previously the node click handler only treated ctrlKey/metaKey
// as the additive modifier, so shift-click replaced the selection instead of
// extending it.
test.describe("shift-click additive selection (§selection)", () => {
  test("shift-clicking nodes accumulates the selection", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__t = s;
      s.nodes.add(new sb.node({ id: "A", xPos: 60, yPos: 150, width: 90, height: 60, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 260, yPos: 150, width: 90, height: 60, text: "B" }));
      s.nodes.add(new sb.node({ id: "C", xPos: 460, yPos: 150, width: 90, height: 60, text: "C" }));
      await new Promise((r) => setTimeout(r, 300));
    });

    const selCount = () =>
      page.evaluate(() => ((window as any).__t.v2.selectedNodes || []).length);
    const center = (id: string) =>
      page.evaluate((id) => {
        const r = document
          .querySelector(`#slateCanvas [data-node-id="${id}"]`)!
          .getBoundingClientRect();
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
      }, id);

    const a = await center("A");
    const b = await center("B");
    const c = await center("C");

    await page.mouse.click(a.x, a.y);
    await page.waitForTimeout(200);
    expect(await selCount()).toBe(1);

    await page.keyboard.down("Shift");
    await page.mouse.click(b.x, b.y);
    await page.waitForTimeout(200);
    expect(await selCount()).toBe(2);

    await page.mouse.click(c.x, c.y);
    await page.waitForTimeout(200);
    await page.keyboard.up("Shift");
    expect(await selCount()).toBe(3);
  });
});
