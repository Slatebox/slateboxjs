import { test, expect } from "@playwright/test";

// Dragging a node must not leave its connection-handle "plug" dots behind at the
// old position. The handles live in a global canvas group (not the node group),
// so they're hidden for the drag and re-anchored to the node's new position.
test.describe("drag leaves no ghost handles (§node)", () => {
  test("connection handles do not remain at the pre-drag position", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const A = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 120, width: 120, height: 70, text: "Drag" })
      );
      await new Promise((r) => setTimeout(r, 300));
      // Select → plug handles appear.
      s.v2.selectNodes([A.v2]);
      A.v2.showConnectionHandles?.();
      await new Promise((r) => setTimeout(r, 200));

      const handlePositions = () =>
        [...document.querySelectorAll(".connection-handle")]
          .filter((h) => (h as SVGElement).getBoundingClientRect().width > 0)
          .map((h) => {
            const r = (h as SVGElement).getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y) };
          });

      const before = handlePositions();

      // Move the node (simulate a drag by re-positioning + firing drag lifecycle).
      A.v2.svgGroup.fire("dragstart", { detail: { event: {} } });
      A.v2.options.x = 400;
      A.v2.options.y = 350;
      A.v2.applyPositionAndRotation();
      A.v2.svgGroup.fire("dragend", { detail: { event: {} } });
      await new Promise((r) => setTimeout(r, 400));

      const after = handlePositions();
      const ghosts = after.filter((h) =>
        before.some((o) => Math.hypot(h.x - o.x, h.y - o.y) < 15)
      );
      return { beforeCount: before.length, afterCount: after.length, ghosts: ghosts.length };
    });

    // Handles existed before the drag, and none remain at the old spot after.
    expect(res.beforeCount).toBeGreaterThan(0);
    expect(res.ghosts).toBe(0);
  });
});
