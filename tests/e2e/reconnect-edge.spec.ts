import { test, expect } from "@playwright/test";

// Reconnecting a connector endpoint onto a node must pin the endpoint on the
// node's EDGE (touching it, on the side you dropped), not at the interior drop
// point. An interior anchor put the arrowhead inside/covered the node and made
// the line's edge-solve disagree with the pinned arrowhead — a detached/inverted
// arrow that didn't track the node. handleEndpointChange → pinDropAnchor now
// snaps the drop anchor to the nearest edge.
test.describe("connector reconnect edge-pin (§connector)", () => {
  test("reconnect drop pins the endpoint on the nearest EDGE + it stays relative", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 200, width: 140, height: 90, text: "A" }));
      const B = s.nodes.add(new sb.node({ id: "B", xPos: 500, yPos: 200, width: 180, height: 100, text: "B" }));
      // Reconnect targets (different nodes so the reattach isn't a no-op).
      const C = s.nodes.add(new sb.node({ id: "C", xPos: 500, yPos: 420, width: 180, height: 100, text: "C" }));
      const D = s.nodes.add(new sb.node({ id: "D", xPos: 150, yPos: 420, width: 180, height: 100, text: "D" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.relationships.addAssociation(B.v2);
      await new Promise((r) => setTimeout(r, 200));

      const conn = A.v2.connector.getConnections()[0];

      // Spy on broadcasts — the pinned anchor must be broadcast so it persists +
      // syncs (the reconnect's addAssociation save fires before the anchor).
      const anchorCasts: any[] = [];
      const orig = s.v2.broadcast.bind(s.v2);
      s.v2.broadcast = (t: string, d: any) => {
        if (t === "onLinePropertiesChanged" && (d?.prop === "targetAnchor" || d?.prop === "sourceAnchor")) anchorCasts.push(d);
        return orig(t, d);
      };

      const reconnectTo = async (node: any, fx: number, fy: number) => {
        const o = node.v2.options;
        // Drop point in the node INTERIOR at normalized (fx, fy).
        const point = { x: o.x + o.width * fx, y: o.y + o.height * fy };
        conn.connectable.onEndpointChange({ which: "target", targetNodeId: node.v2.id, isPhantom: false, point });
        await new Promise((r) => setTimeout(r, 60)); // setTimeout(0) in handler
        const assoc = A.v2.relationships.associations.find((a: any) => a.childId === node.v2.id);
        return assoc?.targetAnchor;
      };

      // Drop near the BOTTOM interior of C → projects to the bottom edge (y=1).
      const bottom = await reconnectTo(C, 0.5, 0.85);
      // Drop near the LEFT interior of D → projects to the left edge (x=0).
      const left = await reconnectTo(D, 0.15, 0.5);

      return { bottom, left, broadcastCount: anchorCasts.length, lastCast: anchorCasts[anchorCasts.length - 1] };
    });

    // Bottom drop → bottom edge; not an interior anchor.
    expect(res.bottom).toBeTruthy();
    expect(res.bottom.y).toBe(1);
    // Left drop → left edge.
    expect(res.left).toBeTruthy();
    expect(res.left.x).toBe(0);
    // The pinned anchor was broadcast (so it persists + syncs, not lost on reload).
    expect(res.broadcastCount).toBeGreaterThanOrEqual(2);
    expect(res.lastCast?.prop).toBe("targetAnchor");
    expect(res.lastCast?.val).toEqual({ x: 0, y: 0.5 });
  });
});
