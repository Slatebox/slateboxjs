import { test, expect } from "@playwright/test";

// Collab bug #4, edge-pin mode: a connection endpoint can be pinned to a fixed
// normalized local anchor on a node (e.g. top-center), and that point rotates
// WITH the node — unlike auto-flow, which re-solves to the nearest edge.
test.describe("connector edge-pin mode (§4)", () => {
  test("a pinned endpoint stays on its local anchor and rotates with the node", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
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
      const a = s.nodes.add(
        new sb.node({ id: "p1", xPos: 260, yPos: 260, width: 160, height: 100, text: "parent" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "c1", xPos: 560, yPos: 300, width: 160, height: 100, text: "child" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));

      const srcEndpoint = () => {
        const p = document.querySelector(
          "#slateCanvas path[stroke]:not([data-shape-path])"
        );
        const d = p?.getAttribute("d") || "";
        const m = d.match(/M\s*([\d.-]+)\s+([\d.-]+)/);
        return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
      };

      const autoFlow = srcEndpoint();

      // Pin the SOURCE endpoint to top-center (0.5, 0) of the parent node.
      a.v2.connector.setConnectionAnchor("c1", "source", { x: 0.5, y: 0 });
      await new Promise((r) => setTimeout(r, 150));
      const pinned0 = srcEndpoint();

      // Expected world top-center of the (unrotated) parent
      const n = a.v2;
      const cx = n.options.x + n.options.width / 2;
      const cy = n.options.y + n.options.height / 2;
      const expected0 = { x: cx, y: n.options.y };

      // Rotate the parent 90°; the pinned top-center should swing to the side.
      n.setRotation(90);
      await new Promise((r) => setTimeout(r, 250));
      const pinned1 = srcEndpoint();
      // After 90° about center, local top-center (0,-h/2) → (+h/2, 0) from center
      const rad = (90 * Math.PI) / 180;
      const expected1 = {
        x: cx + (n.options.height / 2) * Math.sin(rad),
        y: cy - (n.options.height / 2) * Math.cos(rad),
      };

      return { autoFlow, pinned0, expected0, pinned1, expected1 };
    });

    // Pinning moved the endpoint off the auto-flow position…
    expect(result.pinned0).not.toBeNull();
    const dAuto = Math.hypot(
      result.pinned0!.x - result.autoFlow!.x,
      result.pinned0!.y - result.autoFlow!.y
    );
    expect(dAuto).toBeGreaterThan(5);
    // …and it sat on the node's top-center…
    expect(Math.hypot(result.pinned0!.x - result.expected0.x, result.pinned0!.y - result.expected0.y)).toBeLessThan(6);
    // …and rotated WITH the node (matches the rotated top-center).
    expect(Math.hypot(result.pinned1!.x - result.expected1.x, result.pinned1!.y - result.expected1.y)).toBeLessThan(8);
  });
});
