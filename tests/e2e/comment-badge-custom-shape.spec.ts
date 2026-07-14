import { test, expect } from "@playwright/test";

// The comment badge sits at the node's top-right. For a plain rectangle that's the
// corner, but for custom vector shapes (diamond/hexagon/…) the bbox corner is empty
// space, so the badge is pulled inward to HUG the shape instead of floating off it.
test.describe("comment badge hugs custom shapes (§node)", () => {
  test("diamond/hexagon badge sits over the shape fill, not the empty corner", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();

      const check = async (shape: string, xPos: number) => {
        const n = s.nodes.add(
          new sb.node({ id: shape, xPos, yPos: 120, width: 150, height: 150, text: "", shape })
        );
        await new Promise((r) => setTimeout(r, 350));
        n.v2.setCommentBadge(3, "unresolved");
        await new Promise((r) => setTimeout(r, 150));
        const g = document.querySelector(`#slateCanvas [data-node-id="${shape}"]`)!;
        const c = g.querySelector(".comment-badge circle")!.getBoundingClientRect();
        const bc = { x: c.x + c.width / 2, y: c.y + c.height / 2 };
        const path = g.querySelector("path[data-shape-path]") as any;
        const svg = path.ownerSVGElement;
        const ctm = path.getScreenCTM().inverse();
        const p = svg.createSVGPoint();
        p.x = bc.x;
        p.y = bc.y;
        const lp = p.matrixTransform(ctm);
        const q = svg.createSVGPoint();
        q.x = lp.x;
        q.y = lp.y;
        return path.isPointInFill(q);
      };

      const diamond = await check("diamond", 60);
      const hexagon = await check("hexagon", 380);
      return { diamond, hexagon };
    });

    // Badge center falls inside the shape's fill (hugging it), not the empty corner.
    expect(res.diamond).toBe(true);
    expect(res.hexagon).toBe(true);
  });
});
