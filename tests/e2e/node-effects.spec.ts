import { test, expect } from "@playwright/test";

// U6: the node Effects tab was empty AND inert. Two bugs:
//  (a) slate.filters.availableFilters returned an array of {id}; the app reads
//      Object.keys(...) + [name].types, so no effects rendered.
//  (b) Invoker.onNodeEffectChanged was a stub (console.log) — nothing applied.
// Now slate.filters.availableFilters is keyed by name with `types`, and applying
// an effect sets the SVG filter on the node.
test.describe("node effects render + apply (§U6)", () => {
  test("availableFilters has the right shape and effects apply/remove", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "N", xPos: 300, yPos: 250, width: 160, height: 100, text: "N" }));
      await new Promise((r) => setTimeout(r, 300));

      // (a) shape of availableFilters via the node's slate (what the app reads).
      const avail = n.v2.slate.filters.availableFilters;
      const shapeOk =
        !Array.isArray(avail) &&
        typeof avail === "object" &&
        Array.isArray(avail.dropShadow?.types) &&
        avail.dropShadow.types.includes("vect");

      const el = () =>
        document.querySelector('#slateCanvas [data-node-id="N"] rect, #slateCanvas [data-node-id="N"] path') as SVGElement;
      const filterBefore = el().getAttribute("filter");

      // (b) apply via the Invoker path the app uses.
      s.v2.invoker.onNodeEffectChanged({ data: { id: "N", filter: { apply: "vect", id: "dropShadow" } } });
      await new Promise((r) => setTimeout(r, 100));
      const filterAfter = el().getAttribute("filter");
      const optAfter = n.v2.options.filters?.vect;

      // remove (exclusive toggle deselect → null id).
      s.v2.invoker.onNodeEffectChanged({ data: { id: "N", filter: { apply: "vect", id: null } } });
      await new Promise((r) => setTimeout(r, 100));
      const filterRemoved = el().getAttribute("filter");

      return { shapeOk, filterBefore, filterAfter, optAfter, filterRemoved };
    });

    expect(res.shapeOk).toBe(true);
    expect(res.filterBefore).toBeFalsy();
    expect(res.filterAfter).toContain("drop-shadow");
    expect(res.optAfter).toBe("dropShadow");
    expect(res.filterRemoved).toBeFalsy(); // removed on deselect
  });
});
