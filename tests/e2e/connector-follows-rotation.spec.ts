import { test, expect } from "@playwright/test";

// Regression guard for collab bug #4: a connector must re-solve its anchors and
// stay attached when a connected node rotates. svg.connectable's con.update()
// is triggered by a "transform" event on the connected group; applyPosition
// AndRotation() now fires it, so rotation (which sets the transform via
// setAttribute) re-layouts the connector.
test.describe("connector follows a rotated node (§4)", () => {
  test("rotating a connected node re-solves the connector path", async ({
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
        new sb.node({ id: "p1", xPos: 220, yPos: 240, width: 160, height: 100, text: "parent" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "c1", xPos: 520, yPos: 300, width: 160, height: 100, text: "child" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 400));

      const pathD = () => {
        const p = document.querySelector("#slateCanvas path[stroke]");
        return p ? p.getAttribute("d") : null;
      };
      const before = pathD();
      // Rotate the parent — the connector endpoint on the parent must move.
      a.v2.setRotation(65);
      await new Promise((r) => setTimeout(r, 300));
      const after = pathD();

      return { before, after, hadConnector: !!before };
    });

    expect(result.hadConnector).toBe(true);
    expect(result.after).not.toBeNull();
    // The path changed → the connector re-solved its anchor for the rotation.
    expect(result.after).not.toBe(result.before);
  });
});
