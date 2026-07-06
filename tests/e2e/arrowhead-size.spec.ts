import { test, expect } from "@playwright/test";

// Connector arrowheads must be slim and proportional (Miro-like), not giant
// triangles. The marker was rendered with markerUnits="strokeWidth" while the
// marker size ALSO scaled with strokeWidth (strokeWidth*3+6) — double-scaling
// blew the arrowhead up to ~10× the line width. It now uses userSpaceOnUse so
// the rendered head is a sensible absolute size (~markerSize px) that still grows
// modestly with thicker lines.
test.describe("connector arrowhead sizing (§connector)", () => {
  test("arrowhead marker is proportional (userSpaceOnUse), not double-scaled", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 180, width: 140, height: 90, text: "A" }));
      const B = s.nodes.add(new sb.node({ id: "B", xPos: 520, yPos: 180, width: 160, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.relationships.addAssociation(B.v2);
      await new Promise((r) => setTimeout(r, 300));

      const line = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGPathElement;
      const strokeWidth = line ? parseFloat(getComputedStyle(line).strokeWidth) : null;
      const marker = document.querySelector("#slateCanvas marker, defs marker") as SVGMarkerElement | null;
      const markerUnits = marker?.getAttribute("markerUnits");
      const markerWidth = marker ? parseFloat(marker.getAttribute("markerWidth") || "0") : null;
      // Rendered arrowhead width in px: userSpaceOnUse → markerWidth is absolute.
      const renderedPx = markerUnits === "userSpaceOnUse" ? markerWidth : (markerWidth || 0) * (strokeWidth || 0);
      return { strokeWidth, markerUnits, markerWidth, renderedPx };
    });

    expect(res.markerUnits).toBe("userSpaceOnUse");
    // Arrowhead should be a modest multiple of the line width — not the ~10×
    // blowup the double-scaling produced.
    expect(res.renderedPx).toBeGreaterThan(0);
    expect(res.renderedPx).toBeLessThanOrEqual((res.strokeWidth || 6) * 6);
  });
});
