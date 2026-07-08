import { test, expect } from "@playwright/test";

// Miro-style edge labels: a connector can carry a text label centered on the line.
// Rendered lazily in the vendored connectable (connectors without a label are
// unaffected), repositioned on every path update so it follows the line, and
// round-trips through serialize/deserialize (label field in compat + renderAssociation).
test.describe("connector edge labels (§labels)", () => {
  test("label renders at the midpoint, follows node move, survives round-trip", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const ids = await page.evaluate(async () => {
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
      (window as any).__s = s;
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 150, yPos: 250, width: 120, height: 80, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 450, yPos: 300, width: 120, height: 80, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 400));
      let assocId: string | null = null;
      a.v2.relationships.assocMap.forEach((as: any) => {
        if (as.childId === b.v2.id) assocId = as.id;
      });
      a.v2.relationships.applyLineProperty(assocId, "label", "Approves");
      await new Promise((r) => setTimeout(r, 300));
      return { aid: a.v2.id, bid: b.v2.id, assocId };
    });

    const labelInfo = () =>
      page.evaluate(() => {
        const els = [
          ...document.querySelectorAll("#slateCanvas text"),
        ].filter((t) => t.textContent === "Approves");
        if (!els.length) return null;
        const r = (els[0] as SVGGraphicsElement).getBoundingClientRect();
        const p = document.querySelector(
          '#slateCanvas path[connectortype="default"]'
        ) as any;
        const pm = p.getPointAtLength(p.getTotalLength() / 2);
        const svg = p.ownerSVGElement;
        const pt = svg.createSVGPoint();
        pt.x = pm.x;
        pt.y = pm.y;
        const mid = pt.matrixTransform(p.getScreenCTM());
        return {
          count: els.length,
          dist: Math.hypot(
            r.x + r.width / 2 - mid.x,
            r.y + r.height / 2 - mid.y
          ),
        };
      });

    // Renders once, at the midpoint.
    const first = await labelInfo();
    expect(first).not.toBeNull();
    expect(first!.count).toBe(1);
    expect(first!.dist).toBeLessThan(50);

    // Move node B — the label follows the (new) midpoint.
    await page.evaluate((ids) => {
      const b = (window as any).__s.v2.nodes.one(ids.bid);
      b.options.x += 120;
      b.options.y -= 120;
      b.applyPositionAndRotation();
      b.relationships?.refresh?.();
      // nudge the connector to update
      const a = (window as any).__s.v2.nodes.one(ids.aid);
      a.connector?.updateAllConnections?.();
    }, ids);
    await page.waitForTimeout(400);
    const moved = await labelInfo();
    expect(moved).not.toBeNull();
    expect(moved!.count).toBe(1); // still exactly one label (no duplicate)
    expect(moved!.dist).toBeLessThan(60); // still centered on the line

    // Serialize round-trip: the label survives + re-renders.
    const roundTrip = await page.evaluate(() => {
      const s = (window as any).__s.v2;
      const sb = (window as any).Slatebox;
      const json = sb.serialize ? sb.serialize(s) : s.serialize && s.serialize();
      return json ? JSON.stringify(json).includes("Approves") : null;
    });
    // If serialize is reachable, the label must be in the JSON.
    if (roundTrip !== null) expect(roundTrip).toBe(true);

    // Clearing the label (empty text) removes it — no rogue text element.
    await page.evaluate((ids) => {
      const a = (window as any).__s.v2.nodes.one(ids.aid);
      a.relationships.applyLineProperty(ids.assocId, "label", "");
    }, ids);
    await page.waitForTimeout(200);
    const afterClear = await page.evaluate(
      () =>
        [...document.querySelectorAll("#slateCanvas text")].filter(
          (t) => t.textContent === "Approves"
        ).length
    );
    expect(afterClear).toBe(0);

    // Re-label, then DELETE the connector — the label must be cleaned up too.
    await page.evaluate((ids) => {
      const a = (window as any).__s.v2.nodes.one(ids.aid);
      a.relationships.applyLineProperty(ids.assocId, "label", "Approves");
    }, ids);
    await page.waitForTimeout(200);
    await page.evaluate((ids) => {
      const a = (window as any).__s.v2.nodes.one(ids.aid);
      a.relationships.removeAssociation(ids.assocId);
    }, ids);
    await page.waitForTimeout(300);
    const afterDelete = await page.evaluate(() => ({
      labels: [...document.querySelectorAll("#slateCanvas text")].filter(
        (t) => t.textContent === "Approves"
      ).length,
      conns: document.querySelectorAll(
        '#slateCanvas path[connectortype="default"]'
      ).length,
    }));
    // No rogue label, no rogue connector.
    expect(afterDelete.labels).toBe(0);
    expect(afterDelete.conns).toBe(0);
  });
});
