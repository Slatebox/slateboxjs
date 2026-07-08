import { test, expect } from "@playwright/test";

// Orthogonal connectors between axis-aligned nodes used to show a ~22px L-jog (the
// source/target anchors carry a small inherent perpendicular offset even for
// center-aligned nodes). The router now snaps near-co-linear anchors to a straight run
// (ORTHO_SNAP), so aligned connectors are clean straight lines while genuinely-offset
// (diagonal) ones keep their L-route. Miro-clean routing.
test.describe("orthogonal routing: aligned connectors are straight (§connectors)", () => {
  test("up/down/left/right are straight; diagonal keeps its elbow", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const r = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:760px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const hub = s.nodes.add(
        new sb.node({ id: "H", xPos: 440, yPos: 340, width: 110, height: 70, text: "Hub" })
      );
      const mk = (id: string, dx: number, dy: number) =>
        s.nodes.add(
          new sb.node({
            id,
            xPos: 440 + dx,
            yPos: 340 + dy,
            width: 110,
            height: 70,
            text: id,
          })
        );
      mk("U", 0, -230);
      mk("D", 0, 230);
      mk("L", -300, 0);
      mk("R", 300, 0);
      mk("G", 280, 220);
      await new Promise((res) => setTimeout(res, 300));
      const h = s.v2.nodes.one("H");
      for (const id of ["U", "D", "L", "R", "G"])
        h.relationships.addAssociation(s.v2.nodes.one(id));
      await new Promise((res) => setTimeout(res, 300));
      for (const as of h.relationships.associations)
        h.relationships.applyLineProperty(as.id, "lineType", "orthogonal");
      await new Promise((res) => setTimeout(res, 500));

      const paths = [
        ...document.querySelectorAll('#slateCanvas path[connectortype="default"]'),
      ];
      const info = paths.map((p) => {
        const d = p.getAttribute("d") || "";
        const nums = (d.match(/-?\d+\.?\d*/g) || []).map(Number);
        const xs: number[] = [],
          ys: number[] = [];
        for (let i = 0; i < nums.length; i += 2) {
          xs.push(nums[i]);
          ys.push(nums[i + 1]);
        }
        return {
          pts: xs.length,
          jx: Math.max(...xs) - Math.min(...xs),
          jy: Math.max(...ys) - Math.min(...ys),
        };
      });
      // Straight = a 2-point path with ~0 perpendicular spread.
      const straight = info.filter(
        (i) => i.pts === 2 && (i.jx < 3 || i.jy < 3)
      ).length;
      const elbows = info.filter((i) => i.pts >= 3).length;
      return { straight, elbows, total: info.length };
    });

    // 4 aligned connectors straight, the diagonal keeps its elbow.
    expect(r.straight).toBe(4);
    expect(r.elbows).toBeGreaterThanOrEqual(1);
  });
});
