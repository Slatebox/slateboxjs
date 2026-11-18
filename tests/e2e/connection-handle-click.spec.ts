import { test, expect } from "@playwright/test";

// A plain click on a node's connection handle (the plug-dot that appears at
// top/right/bottom/left on select/hover) creates a new node in that direction and
// connects to it. This drives a REAL page.mouse click — the connection handles
// live in a global canvas group (not the node's draggable svgGroup), so unlike the
// link badge they should receive real clicks; this durably proves it.
test.describe("connection handle click creates a connected node (§connector)", () => {
  test("a real click on the right handle creates + connects a new node", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1100px;height:760px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__slate = s;
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 300, yPos: 300, width: 150, height: 90, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 400));
      s.v2.selectNodes([a.v2]); // reveals the connection handles
      await new Promise((r) => setTimeout(r, 300));
    });

    const before = await page.evaluate(
      () => (window as any).__slate.v2.nodes.allNodes.length
    );
    expect(before).toBe(1);

    // Locate the right-side connection handle in screen coords.
    const handle = await page.evaluate(() => {
      const hs = [
        ...document.querySelectorAll(
          "#slateCanvas .connection-handle-right, #slateCanvas .connection-handle"
        ),
      ].filter((e) => {
        const r = (e as SVGGraphicsElement).getBoundingClientRect();
        return r.width > 4 && r.width < 40;
      });
      if (!hs.length) return null;
      const r = (hs[0] as SVGGraphicsElement).getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    expect(handle).not.toBeNull();

    // Real click (no drag) → createConnectedNode.
    await page.mouse.click(handle!.x, handle!.y);
    await page.waitForTimeout(500);

    const res = await page.evaluate(() => {
      const s = (window as any).__slate.v2;
      const a = s.nodes.one("A");
      const assoc = a ? a.relationships.associations : [];
      const child = s.nodes.allNodes.find((node: {id: string}) => node.id !== "A");
      return {
        id: child?.id,
        label: child?.options.text,
        drawnText: child?.svgGroup.node.querySelector("text")?.textContent ?? "",
        count: s.nodes.allNodes.length,
        childCount: assoc.length,
        connectors: document.querySelectorAll(
          '#slateCanvas path[connectortype="default"]'
        ).length,
      };
    });
    // A new node was created and connected to A.
    expect(res.id).toBeTruthy();
    expect(res.label).toBe("");
    expect(res.drawnText.trim()).toBe("");
    expect(res.count).toBe(2);
    expect(res.childCount).toBeGreaterThan(0);
    expect(res.connectors).toBeGreaterThan(0);
  });
});
