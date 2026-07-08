import { test, expect } from "@playwright/test";

// A marquee-select or node drag used to browser-text-select the SVG node labels (Miro
// never does this). Node groups carry no class — they're [data-node-id] — so the CSS
// disables user-select on [data-node-id] (+ its text/tspan), while the inline editor
// (.sb-inline-editor / [contenteditable]) stays selectable.
test.describe("canvas node text is not browser-selectable (§selection)", () => {
  test("node text has user-select:none; editor stays selectable", async ({
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
        new sb.node({ id: "A", xPos: 300, yPos: 250, width: 120, height: 70, text: "Label" })
      );
      await new Promise((res) => setTimeout(res, 400));

      const te = document.querySelector('#slateCanvas [data-node-id] text');
      const grp = document.querySelector('#slateCanvas [data-node-id]');
      return {
        textUserSelect: te ? getComputedStyle(te as Element).userSelect : null,
        groupUserSelect: grp ? getComputedStyle(grp as Element).userSelect : null,
        cssPresent: [...document.styleSheets].some((sheet) => {
          try {
            return [...(sheet as CSSStyleSheet).cssRules].some(
              (rule) =>
                /user-select/.test(rule.cssText) &&
                /data-node-id/.test(rule.cssText)
            );
          } catch (e) {
            return false;
          }
        }),
      };
    });

    // The stylesheet must ship the rule (guards against selector regressions).
    expect(r.cssPresent).toBe(true);
    // And it must resolve to none on the node + its text (guards the [data-node-id] target).
    expect(r.textUserSelect).toBe("none");
    expect(r.groupUserSelect).toBe("none");
  });
});
