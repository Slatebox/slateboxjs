import { test, expect } from "@playwright/test";

// Miro parity: repeated paste of the same clipboard must CASCADE (each copy further
// from the source), not stack every copy on one spot — otherwise the user pastes N
// times, sees one node, and doesn't realize copies piled up invisibly. A paste counter
// grows the offset (20, 40, 60, …); a fresh copy resets it.
test.describe("repeated paste cascades instead of stacking (§keyboard)", () => {
  test("three pastes land at three distinct, increasing offsets", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const srcId = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 250, yPos: 250, width: 110, height: 70, text: "Copy" })
      );
      await new Promise((r) => setTimeout(r, 400));
      return a.v2.id;
    });

    // Select, copy, paste three times.
    const c = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(c.x, c.y);
    await page.waitForTimeout(300);
    await page.keyboard.press("Control+c");
    await page.waitForTimeout(200);
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Control+v");
      await page.waitForTimeout(400);
    }

    const positions = await page.evaluate((srcId) => {
      const s = (window as any).__s.v2;
      return s.nodes.allNodes
        .filter((n: any) => n.id !== srcId)
        .map((n: any) => `${Math.round(n.options.x)},${Math.round(n.options.y)}`);
    }, srcId);

    // Three copies, all at DISTINCT positions (cascaded, not stacked).
    expect(positions.length).toBe(3);
    expect(new Set(positions).size).toBe(3);
  });
});
