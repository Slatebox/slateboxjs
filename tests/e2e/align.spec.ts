import { test, expect } from "@playwright/test";

// Alignment / distribution (Slate.alignNodes / distributeNodes), surfaced in the
// right-click context menu for a multi-selection. Aligns to the shared bounding
// box; distribute evens the gaps. Broadcasts onNodesMove so it persists + syncs.
test.describe("align + distribute (§layout)", () => {
  test("alignNodes lines up edges; distributeNodes evens gaps; broadcasts", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 100, width: 100, height: 60, text: "A" }));
      const B = s.nodes.add(new sb.node({ id: "B", xPos: 300, yPos: 180, width: 100, height: 60, text: "B" }));
      const C = s.nodes.add(new sb.node({ id: "C", xPos: 600, yPos: 140, width: 100, height: 60, text: "C" }));
      await new Promise((r) => setTimeout(r, 300));
      s.v2.selectNodes([A.v2, B.v2, C.v2], false);

      const casts: string[] = [];
      const orig = s.v2.broadcast.bind(s.v2);
      s.v2.broadcast = (t: string, d: any) => {
        if (t === "onNodesMove") casts.push(t);
        return orig(t, d);
      };
      const xs = () => ["A", "B", "C"].map((id) => Math.round(s.v2.nodes.one(id).options.x));
      const ys = () => ["A", "B", "C"].map((id) => Math.round(s.v2.nodes.one(id).options.y));

      // Align left → all share the min x (100).
      s.v2.alignNodes("left");
      const afterLeft = xs();
      // Align top → all share the min y (100).
      s.v2.alignNodes("top");
      const afterTop = ys();

      // Reset x spread, then distribute horizontally → equal gaps.
      s.v2.nodes.one("A").position(100, 300);
      s.v2.nodes.one("B").position(250, 300);
      s.v2.nodes.one("C").position(700, 300);
      s.v2.distributeNodes("horizontal");
      const dx = xs().sort((a, b) => a - b);
      // gaps between right-edge of one and left of next (all width 100)
      const gap1 = dx[1] - (dx[0] + 100);
      const gap2 = dx[2] - (dx[1] + 100);

      // Menu shows align items for a multi-selection.
      const rc = (id: string) => {
        const g = document.querySelector(`#slateCanvas [data-node-id="${id}"]`) as SVGGraphicsElement;
        const r = g.getBoundingClientRect();
        g.dispatchEvent(new MouseEvent("contextmenu", { clientX: r.x + 5, clientY: r.y + 5, bubbles: true, cancelable: true }));
      };
      rc("A");
      const menuLabels = Array.from(document.querySelectorAll(".sb-context-menu > div"))
        .map((d) => d.textContent)
        .filter((t) => t);

      // Clicking an align item aligns the SNAPSHOT of the selection (robust to a
      // selection collapse between opening the menu and clicking). Spread the y's
      // first, reselect, open the menu, then click "Align top".
      s.v2.nodes.one("A").position(120, 100);
      s.v2.nodes.one("B").position(320, 250);
      s.v2.nodes.one("C").position(620, 400);
      s.v2.selectNodes([s.v2.nodes.one("A"), s.v2.nodes.one("B"), s.v2.nodes.one("C")], false);
      rc("A");
      const alignTop = Array.from(document.querySelectorAll(".sb-context-menu > div")).find(
        (d) => /align top/i.test(d.textContent || "")
      ) as HTMLElement | undefined;
      // Simulate the real-mouse collapse: reduce the live selection to one node
      // AFTER the menu opened; the snapshot must still align all three.
      s.v2.selectNodes([s.v2.nodes.one("A")], false);
      alignTop?.click();
      await new Promise((r) => setTimeout(r, 50));
      const menuAlignedY = ["A", "B", "C"].map((id) => Math.round(s.v2.nodes.one(id).options.y));

      return { afterLeft, afterTop, dx, gap1, gap2, casts: casts.length, menuLabels, menuAlignedY };
    });

    // All left-aligned to x=100; all top-aligned to y=100.
    expect(res.afterLeft).toEqual([100, 100, 100]);
    expect(res.afterTop).toEqual([100, 100, 100]);
    // Distribute: the two gaps are equal (±1 for rounding).
    expect(Math.abs(res.gap1 - res.gap2)).toBeLessThanOrEqual(1);
    // Each op broadcast onNodesMove (left, top, distribute).
    expect(res.casts).toBeGreaterThanOrEqual(3);
    // The multi-selection menu offers alignment.
    expect(res.menuLabels).toContain("Align left");
    expect(res.menuLabels).toContain("Distribute horizontally");
    // Clicking "Align top" aligns all three via the open-time snapshot, even
    // though the live selection was collapsed to one node after the menu opened.
    expect(res.menuAlignedY).toEqual([100, 100, 100]);
  });
});
