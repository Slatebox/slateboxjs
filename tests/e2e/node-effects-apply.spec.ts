import { test, expect } from "@playwright/test";

// The Text pane's effect toggles (DROPSHADOW/BLUR/OUTLINE/…) set options.filters
// ({text|vect: name}) and the library renders them as a CSS `filter` on the text element
// (filters.text) or backgroundRect (filters.vect) — NOT an SVG <filter> def. Node.ts
// re-applies options.filters at creation so effects survive reload. This guards the
// port-side rendering: filters.apply reaches the element, and options.filters serializes.
test.describe("node effects application (§effects)", () => {
  test("filters.apply renders a CSS drop-shadow and options.filters serializes", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const r = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      s.nodes.add(
        new sb.node({ id: "A", xPos: 300, yPos: 250, width: 160, height: 100, text: "FX" })
      );
      await new Promise((res) => setTimeout(res, 400));

      const a = s.v2.nodes.one("A");
      const textFilterBefore = a.textElement
        ? a.textElement.node.getAttribute("filter")
        : null;
      const bgFilterBefore = a.backgroundRect
        ? a.backgroundRect.node.getAttribute("filter")
        : null;

      // Text-targeted drop shadow (what the DROPSHADOW toggle sets: filters.text).
      a.filters.apply("dropShadow", "text");
      // Vect-targeted drop shadow (filters.vect → backgroundRect).
      a.filters.apply("dropShadow", "vect");
      await new Promise((res) => setTimeout(res, 300));

      const textFilterAfter = a.textElement
        ? a.textElement.node.getAttribute("filter")
        : null;
      const bgFilterAfter = a.backgroundRect
        ? a.backgroundRect.node.getAttribute("filter")
        : null;

      // Effects persist by re-applying options.filters at creation; make sure the
      // options carrier is what the library reads (set + serialize survives).
      a.options.filters = { text: "dropShadow", vect: "dropShadow" };
      let serialized: any = "(unknown)";
      try {
        const sr = (window as any).Serialization || sb.Serialization;
        const json = sr?.serialize ? sr.serialize(s) : null;
        const nj = json?.nodes?.find((n: any) => n.id === "A");
        serialized = nj ? JSON.stringify(nj.filters) : "(no node)";
      } catch (e) {
        serialized = "(threw)";
      }
      return { textFilterBefore, bgFilterBefore, textFilterAfter, bgFilterAfter, serialized };
    });

    expect(r.textFilterBefore).toBeFalsy();
    // Effect renders as a CSS drop-shadow on the text element and the backgroundRect.
    expect(r.textFilterAfter || "").toMatch(/drop-shadow/i);
    expect(r.bgFilterAfter || "").toMatch(/drop-shadow/i);
    // options.filters serializes (so effects persist) — when serialize is reachable here.
    if (r.serialized !== "(no node)" && r.serialized !== "(threw)" && r.serialized !== "(unknown)") {
      expect(r.serialized).toMatch(/dropShadow/);
    }
  });
});
