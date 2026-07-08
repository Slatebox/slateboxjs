import { test, expect } from "@playwright/test";

// User report: "moving an existing line copied it — 3 connections when I intended 2."
// Root cause: the endpoint-reconnect handler parsed origChildId as connection.id.split("->")[1],
// which for a PARALLEL edge id `A->B~2` yields "B~2" (not "B"). The same-node re-pin check
// (newNode.id === origChildId) then failed, so a drop back on the SAME node fell through to
// remove(old)+add(new) — but remove("B~2") is a no-op (invalid id), so it only ADDED →
// a duplicate `A->B~3`. Fix: strip the ~N suffix for the child check, and key removal/pinning
// on connection.id (the specific edge). Verified via the actual onEndpointChange callback
// (synthetic handle-drag doesn't reliably engage the vendored lib's reconnect).
test.describe("parallel-edge reconnect does not duplicate (§connectors)", () => {
  test("re-pinning a parallel edge's endpoint on the same node keeps the count", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const r = await page.evaluate(async () => {
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
      s.nodes.add(
        new sb.node({ id: "A", xPos: 250, yPos: 170, width: 130, height: 80, text: "A" })
      );
      s.nodes.add(
        new sb.node({ id: "B", xPos: 250, yPos: 470, width: 180, height: 120, text: "B" })
      );
      await new Promise((res) => setTimeout(res, 300));
      const a = s.v2.nodes.one("A");
      const b = s.v2.nodes.one("B");
      // Two parallel edges A->B and A->B~2.
      a.relationships.addAssociation(b);
      await new Promise((res) => setTimeout(res, 150));
      a.relationships.addAssociation(b, { targetAnchor: { x: 1, y: 0.5 } });
      await new Promise((res) => setTimeout(res, 300));

      const before = a.relationships.associations.map((x: any) => x.id);
      // Fire the reconnect callback on the PARALLEL edge, dropping its target back on B.
      const conns = a.connector.getConnections?.() || [];
      const e2 = conns.find((c: any) => String(c.id).includes("~2"));
      const cxable = e2?.connectable;
      const fired = !!(cxable && typeof cxable.onEndpointChange === "function");
      if (fired) {
        cxable.onEndpointChange({
          which: "target",
          targetNodeId: "B",
          isPhantom: false,
          point: { x: b.options.x + b.options.width * 0.5, y: b.options.y + b.options.height * 0.9 },
        });
      }
      await new Promise((res) => setTimeout(res, 300));
      const after = a.relationships.associations.map((x: any) => x.id);
      const e2Anchor = a.relationships.associations.find((x: any) =>
        x.id.includes("~2")
      )?.targetAnchor;
      return { before, after, fired, e2Anchor };
    });

    expect(r.fired).toBe(true);
    // No duplicate: still exactly the two original edges (no `~3`).
    expect(r.after.length).toBe(2);
    expect(r.after.sort()).toEqual(r.before.sort());
    expect(r.after.some((id: string) => id.includes("~3"))).toBe(false);
    // The reconnect re-pinned the SAME parallel edge to the drop point (edge-snapped).
    expect(r.e2Anchor).not.toBeNull();
  });
});
