import { test, expect } from "@playwright/test";

// U6: the node Effects tab was empty AND inert. Two bugs:
//  (a) slate.filters.availableFilters returned an array of {id}; the app reads
//      Object.keys(...) + [name].types, so no effects rendered.
//  (b) Invoker.onNodeEffectChanged was a stub (console.log) — nothing applied.
// Now slate.filters.availableFilters is keyed by name with `types`, and applying
// an effect sets the SVG filter on the node.
test.describe("node effects render + apply (§U6)", () => {
  test("filter and animation catalogs have the right shape and apply/remove", async ({
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
      const animations = n.v2.slate.filters.availableAnimations;
      const animationsShapeOk =
        !Array.isArray(animations) &&
        animations.fadeSlideUp?.display === "Fade up" &&
        animations.fadeSlideUp.types.includes("text");

      const el = () => n.v2.backgroundRect.node as SVGElement;
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

      const textEl = n.v2.textElement.node as SVGElement;
      s.v2.invoker.onNodeEffectChanged({ data: { id: "N", filter: { apply: "text", isAnimation: true, id: "fadeSlideUp" } } });
      const animationClass = textEl.getAttribute("class");
      const animationOption = n.v2.options.animations?.text;
      const animationStyle = document.querySelector("#sb-node-animation-styles")?.textContent;
      s.v2.invoker.onNodeEffectChanged({ data: { id: "N", filter: { apply: "text", isAnimation: true, id: null } } });
      const animationClassRemoved = textEl.getAttribute("class");

      return { shapeOk, animationsShapeOk, filterBefore, filterAfter, optAfter, filterRemoved, animationClass, animationOption, animationStyle, animationClassRemoved };
    });

    expect(res.shapeOk).toBe(true);
    expect(res.filterBefore).toBeFalsy();
    expect(res.filterAfter).toContain("drop-shadow");
    expect(res.optAfter).toBe("dropShadow");
    expect(res.filterRemoved).toBeFalsy(); // removed on deselect
    expect(res.animationsShapeOk).toBe(true);
    expect(res.animationClass).toContain("sb-animation-fadeSlideUp");
    expect(res.animationOption).toBe("fadeSlideUp");
    expect(res.animationStyle).toContain("@keyframes sb-fade-slide-up");
    expect(res.animationClassRemoved).not.toContain("sb-animation-fadeSlideUp");
  });
});
