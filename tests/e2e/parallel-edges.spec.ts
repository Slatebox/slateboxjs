import { test, expect } from "@playwright/test";

// User bug (Images #1 + #4): only ONE line was allowed between the same pair of
// nodes — a second connect-drop was swallowed by the pair-based dedup ("Connection
// already exists"), so the "second connector" never pinned at the drop point and
// didn't follow. Fix: parallel edges — the first edge keeps the canonical `A->B`
// id, additional edges to the same child get a unique `~N` id so they render as
// SEPARATE connections; the connect-drag pins each target endpoint at the drop
// point so they're visually distinct. Serialization + collab carry the id through.
test.describe("parallel edges: multiple lines between the same pair (§connector)", () => {
  test("two A→B edges render, follow, and delete independently", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 200, width: 100, height: 64, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 460, yPos: 180, width: 150, height: 120, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));

      // Two edges A→B, pinned at different anchors (as the connect-drag would).
      const e1 = a.v2.relationships.addAssociation(b.v2, {
        targetAnchor: { x: 0, y: 0.2 },
      });
      const e2 = a.v2.relationships.addAssociation(b.v2, {
        targetAnchor: { x: 0, y: 0.8 },
      });
      await new Promise((r) => setTimeout(r, 400));

      const conns = () =>
        document.querySelectorAll('#slateCanvas path[connectortype="default"]').length;
      const created = {
        ids: [e1.id, e2.id],
        assoc: a.v2.relationships.assocMap.size,
        connectors: conns(),
      };

      // Tips distinct (the two lines don't overlap).
      const tips = [
        ...document.querySelectorAll('#slateCanvas path[connectortype="default"]'),
      ].map((p: any) => {
        const e = p.getPointAtLength(p.getTotalLength());
        return { x: e.x, y: e.y };
      });
      const tipGap = Math.hypot(tips[0].x - tips[1].x, tips[0].y - tips[1].y);

      // Move A → both edges follow (both source endpoints track A).
      a.v2.options.x = 120;
      a.v2.options.y = 380;
      a.v2.applyPositionAndRotation();
      Array.from(a.v2.relationships.assocMap.values()).forEach((as: any) =>
        as.connector?.updateConnection?.(`${a.v2.id}->${as.childId}`, {})
      );
      await new Promise((r) => setTimeout(r, 300));
      const srcs = [
        ...document.querySelectorAll('#slateCanvas path[connectortype="default"]'),
      ].map((p: any) => p.getPointAtLength(0).y);

      // Delete ONE edge by its id → the other survives.
      a.v2.relationships.removeAssociation(e2.id);
      await new Promise((r) => setTimeout(r, 300));
      const afterDelete = {
        assoc: a.v2.relationships.assocMap.size,
        connectors: conns(),
        remaining: Array.from(a.v2.relationships.assocMap.keys()),
      };

      return { created, tipGap, srcs, afterDelete };
    });

    // Two distinct parallel edges created.
    expect(res.created.ids[0]).toBe("A->B");
    expect(res.created.ids[1]).toBe("A->B~2");
    expect(res.created.connectors).toBe(2);
    expect(res.tipGap).toBeGreaterThan(30);

    // Both followed the moved node.
    expect(res.srcs.filter((y) => Math.abs(y - res.srcs[0]) < 60).length).toBe(2);

    // Deleting one leaves exactly the other.
    expect(res.afterDelete.connectors).toBe(1);
    expect(res.afterDelete.remaining).toEqual(["A->B"]);
  });

  test("each parallel edge keeps independent line state that serializes", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 200, width: 100, height: 64, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 460, yPos: 180, width: 150, height: 120, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      a.v2.relationships.addAssociation(b.v2, { targetAnchor: { x: 0, y: 0.8 } });
      await new Promise((r) => setTimeout(r, 300));

      // Change ONLY the parallel edge to orthogonal (as the line pane would).
      a.v2.relationships.applyLineProperty("A->B~2", "lineType", "orthogonal");
      await new Promise((r) => setTimeout(r, 200));

      // The exported JSON (what the app persists) must carry both edges with their
      // own id + independent line state.
      const json = JSON.parse(s.exportJSON());
      const assocs: any[] = [];
      (json.nodes || []).forEach((n: any) => {
        const as = n.relationships?.associations;
        if (Array.isArray(as))
          as.forEach((x: any) =>
            assocs.push({ id: x.id, lineType: x.lineType, anchor: x.targetAnchor })
          );
      });
      const canonical = assocs.find((x) => x.id === "A->B");
      const parallel = assocs.find((x) => x.id === "A->B~2");

      // In-memory: only the parallel edge changed.
      const mem = {
        canonical: a.v2.relationships.assocMap.get("A->B")?.lineType,
        parallel: a.v2.relationships.assocMap.get("A->B~2")?.lineType,
      };
      return { count: assocs.length, canonical, parallel, mem };
    });

    expect(res.count).toBe(2);
    // Independent in memory…
    expect(res.mem.canonical).toBe("bezier");
    expect(res.mem.parallel).toBe("orthogonal");
    // …and independent + id-tagged in the persisted JSON.
    expect(res.canonical.lineType).toBe("bezier");
    expect(res.parallel.lineType).toBe("orthogonal");
    expect(res.parallel.anchor).toEqual({ x: 0, y: 0.8 });
  });
});
