import { test, expect } from "@playwright/test";

// Animations.ts coverage: creation-option application (correct target per
// "vect"/"text"), single style-block injection, swap exclusivity (only one
// sb-animation-* class at a time), unknown-name no-op, and the JSON
// round-trip path (animations ride v2NodeToV1 spread and re-apply on load).
test.describe("node animations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("creation options apply to the correct target; style block injected once", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const mk = (id: string, left: number) => {
        const div = document.createElement("div");
        div.id = id;
        div.style.cssText = `width:450px;height:600px;position:fixed;top:0;left:${left}px;z-index:1000;background:#fff`;
        document.body.appendChild(div);
        return div;
      };
      mk("cA", 0);
      mk("cB", 460);
      const sA = await new sb.slate({ container: "cA", allowCollaboration: false }, {}).init();
      const sB = await new sb.slate({ container: "cB", allowCollaboration: false }, {}).init();
      const nA = sA.nodes.add(
        new sb.node({ id: "VA", xPos: 100, yPos: 200, width: 160, height: 100, text: "vect target", animations: { vect: "pulse" } })
      );
      // second animated node in the SAME slate → per-root style dedup proof
      const nA2 = sA.nodes.add(
        new sb.node({ id: "VA2", xPos: 220, yPos: 200, width: 140, height: 100, text: "also vect", animations: { vect: "rotate" } })
      );
      const nB = sB.nodes.add(
        new sb.node({ id: "TA", xPos: 100, yPos: 200, width: 160, height: 100, text: "text target", animations: { text: "mystery" } })
      );
      await new Promise((r) => setTimeout(r, 400));
      const rectA2 = nA2.v2.backgroundRect.node as SVGElement;
      const rectA = nA.v2.backgroundRect.node as SVGElement;
      const textA = nA.v2.textElement?.node as SVGElement | undefined;
      const rectB = nB.v2.backgroundRect.node as SVGElement;
      const textB = nB.v2.textElement.node as SVGElement;
      return {
        rectAHasPulse: rectA.classList.contains("sb-animation-pulse"),
        rectABase: rectA.classList.contains("sb-node-animation"),
        textAHasPulse: !textA || !textA.classList.contains("sb-animation-pulse"),
        textBHasMystery: textB.classList.contains("sb-animation-mystery"),
        rectBHasMystery: rectB.classList.contains("sb-animation-mystery"),
        rectA2HasRotate: rectA2.classList.contains("sb-animation-rotate"),
        // per-SVG-root dedup: cA applied 2 animations → exactly one style block
        styleInRootA: document.querySelectorAll("#cA #sb-node-animation-styles, #cA svg #sb-node-animation-styles").length,
        styleTotal: document.querySelectorAll("#sb-node-animation-styles").length,
      };
    });
    expect(res.rectAHasPulse).toBe(true); // vect animation lands on the shape
    expect(res.rectABase).toBe(true); // base transform class present
    expect(res.textAHasPulse).toBe(true); // ...not on its text element
    expect(res.textBHasMystery).toBe(true); // text animation lands on text
    expect(res.rectBHasMystery).toBe(false); // ...not on the shape
    expect(res.rectA2HasRotate).toBe(true);
    expect(res.styleInRootA).toBe(1); // dedup within one root despite 2 applications
    expect(res.styleTotal).toBe(2); // one block per SVG root (styles are scoped)
  });

  test("swap keeps exactly one animation class; unknown name is a no-op; remove clears", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "cS";
      div.style.cssText = "width:800px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "cS", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "SW", xPos: 200, yPos: 200, width: 160, height: 100, text: "swap" }));
      await new Promise((r) => setTimeout(r, 300));
      const el = () => n.v2.backgroundRect.node as SVGElement;
      const animClasses = () =>
        Array.from(el().classList).filter((c) => c.startsWith("sb-animation-"));

      const first = n.v2.filters.applyAnimation("mystery", "vect");
      const afterFirst = animClasses();
      const second = n.v2.filters.applyAnimation("rotate", "vect");
      const afterSwap = animClasses();
      const optAfterSwap = n.v2.options.animations?.vect;
      const invalid = n.v2.filters.applyAnimation("definitelyNotAnAnimation", "vect");
      const afterInvalid = animClasses();
      n.v2.filters.removeAnimation("vect");
      const afterRemove = animClasses();
      const optAfterRemove = n.v2.options.animations?.vect;
      return {
        first, second, invalid,
        afterFirst, afterSwap, afterInvalid, afterRemove,
        optAfterSwap, optAfterRemove,
      };
    });
    expect(res.first).toBe(true);
    expect(res.afterFirst).toEqual(["sb-animation-mystery"]);
    expect(res.second).toBe(true);
    expect(res.afterSwap).toEqual(["sb-animation-rotate"]); // swap is exclusive
    expect(res.optAfterSwap).toBe("rotate"); // option tracks applied animation
    expect(res.invalid).toBe(false); // unknown names rejected
    expect(res.afterInvalid).toEqual(["sb-animation-rotate"]); // and change nothing
    expect(res.afterRemove).toEqual([]);
    expect(res.optAfterRemove).toBeUndefined();
  });

  test("animations survive exportJSON → loadJSON and re-apply on the loaded node", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "cE";
      div.style.cssText = "width:800px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "cE", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "RT", xPos: 150, yPos: 200, width: 160, height: 100, text: "round trip", animations: { vect: "breathe" } }));
      await new Promise((r) => setTimeout(r, 300));
      const json = s.exportJSON();
      const jsonStr = typeof json === "string" ? json : JSON.stringify(json);
      const carried = jsonStr.includes('"breathe"');
      // fresh slate (own container) loads the same payload — re-create must re-apply breathe
      const div2 = document.createElement("div");
      div2.id = "cF";
      div2.style.cssText = "width:800px;height:600px;position:fixed;top:0;left:810px;z-index:1000;background:#fff";
      document.body.appendChild(div2);
      const s2 = await new sb.slate({ container: "cF", allowCollaboration: false }, {}).init();
      await s2.loadJSON(jsonStr);
      await new Promise((r) => setTimeout(r, 600));
      const loaded = div2.querySelector('[data-node-id="RT"]');
      const applied =
        !!loaded &&
        (!!loaded.querySelector(".sb-animation-breathe") ||
          loaded.classList?.contains("sb-animation-breathe"));
      return { carried, applied, hasRT: !!loaded };
    });
    expect(res.carried).toBe(true); // serialization carries the animation option
    expect(res.hasRT).toBe(true); // node rebuilt from JSON
    expect(res.applied).toBe(true); // and its animation re-applied (Node create path)
  });
});
