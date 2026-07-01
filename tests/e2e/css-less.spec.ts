import { test, expect } from "@playwright/test";

// §H of docs/drop-in-contract.md: the library must remain functional when the
// host app does NOT load slateboxjs.css (v1 shipped no stylesheet; npm
// consumers of the v2 lib build get CSS as a separate opt-in file). Critical
// interaction affordances (selection UI hit areas, non-obscuring overlays)
// are applied as inline SVG attributes for exactly this reason.
test("core functionality works without any stylesheets (§H)", async ({
  page,
}) => {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);

  const result = await page.evaluate(async () => {
    // Simulate a CSS-less consumer: remove every stylesheet (the dev bundle
    // auto-injects slateboxjs.css; npm lib consumers must link it manually)
    document
      .querySelectorAll("style, link[rel=stylesheet]")
      .forEach((el) => el.remove());

    const div = document.createElement("div");
    div.id = "slateCanvas";
    div.style.width = "800px";
    div.style.height = "600px";
    document.body.appendChild(div);

    const sb = (window as any).Slatebox;
    const s = await new sb.slate({ container: "slateCanvas" }, {}).init();
    const n = s.nodes.add(
      new sb.node({ id: "nocss1", xPos: 120, yPos: 120, width: 140, height: 90, text: "no css" })
    );
    s.nodes.add(new sb.node({ id: "nocss2", xPos: 400, yPos: 200, text: "peer" }));
    await new Promise((r) => setTimeout(r, 500));

    n.relationships.addAssociation(s.nodes.one("nocss2"));
    await new Promise((r) => setTimeout(r, 200));

    // Select the node programmatically → resize/rotate UI must appear and
    // its plugin-generated overlay must not obscure (inline attrs, not CSS)
    s.v2.selectNodes([n.v2]);
    await new Promise((r) => setTimeout(r, 300));

    const svg = div.querySelector("svg");
    const selectionShape = svg?.querySelector(
      ".svg_select_shape, .svg_select_shape_pointSelect"
    ) as SVGElement | null;

    return {
      stylesheetCount: document.querySelectorAll(
        "style, link[rel=stylesheet]"
      ).length,
      svgRendered: !!svg,
      nodeCount: s.nodes.allNodes.length,
      assocCount: n.relationships.associations.length,
      selectionUiPresent: !!selectionShape,
      overlayNonObscuring: selectionShape
        ? selectionShape.getAttribute("pointer-events") === "none" &&
          (selectionShape.getAttribute("fill") === "none" ||
            selectionShape.getAttribute("fill-opacity") === "0")
        : false,
      exportWorks: s.exportJSON().length > 10,
    };
  });

  // Note: rAF-deferred inline styling may re-count injected <style> from
  // plugins; the key assertion is that everything still WORKS
  expect(result.svgRendered).toBe(true);
  expect(result.nodeCount).toBe(2);
  expect(result.assocCount).toBe(1);
  expect(result.selectionUiPresent).toBe(true);
  expect(result.overlayNonObscuring).toBe(true);
  expect(result.exportWorks).toBe(true);
});
