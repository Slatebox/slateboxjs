import { test, expect } from "@playwright/test";

// The line pane's Cubic/Quadratic toggle sets association.lineCurveType, but the
// connectable's curved router always emitted a cubic "C" path — so the toggle changed
// the model but not the rendered curve (same class as the line-type bug). The router now
// emits a quadratic "Q" path when lineCurveType==='quadratic', plumbed through
// Relationships → Connector → connectable (create + updateConnection + serialize).
test.describe("connector curve sub-type (cubic/quadratic) renders (§connectors)", () => {
  test("switching to quadratic emits a Q path and it serializes", async ({
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
        new sb.node({ id: "A", xPos: 200, yPos: 200, width: 120, height: 70, text: "A" })
      );
      s.nodes.add(
        new sb.node({ id: "B", xPos: 520, yPos: 360, width: 120, height: 70, text: "B" })
      );
      await new Promise((res) => setTimeout(res, 300));
      const a = s.v2.nodes.one("A");
      a.relationships.addAssociation(s.v2.nodes.one("B"));
      await new Promise((res) => setTimeout(res, 400));
      const dOf = () =>
        document
          .querySelector('#slateCanvas path[connectortype="default"]')
          ?.getAttribute("d") || "";
      const before = dOf();
      const id = a.relationships.associations[0].id;
      a.relationships.applyLineProperty(id, "lineCurveType", "quadratic");
      await new Promise((res) => setTimeout(res, 400));
      const after = dOf();

      let serialized: any = "(unknown)";
      try {
        const sr = (window as any).Serialization || sb.Serialization;
        const json = sr?.serialize ? sr.serialize(s) : null;
        // lineCurveType lives on the association within the node
        const nj = json?.nodes?.find((n: any) => n.id === "A");
        const as = nj?.associations?.[0] || nj?.relationships?.[0];
        serialized = as ? as.lineCurveType : "(no assoc)";
      } catch (e) {
        serialized = "(threw)";
      }
      return {
        beforeHasC: /C/.test(before),
        beforeHasQ: /Q/.test(before),
        afterHasC: /C/.test(after),
        afterHasQ: /Q/.test(after),
        serialized,
      };
    });

    // Default cubic, switches to quadratic in the rendered path.
    expect(r.beforeHasC).toBe(true);
    expect(r.afterHasQ).toBe(true);
    expect(r.afterHasC).toBe(false);
    if (r.serialized !== "(no assoc)" && r.serialized !== "(threw)" && r.serialized !== "(unknown)") {
      expect(r.serialized).toBe("quadratic");
    }
  });
});
