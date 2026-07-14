import { test, expect } from "@playwright/test";

// Copy / paste / duplicate (Keyboard: Ctrl/Cmd+C, +V, +D). A core Miro-style
// interaction that was previously unimplemented. Copies get a new id, an offset
// position, and inherit the source node's paintable options; addNode() broadcasts
// onNodeAdded so copies persist + sync like any other added node.
test.describe("copy / paste / duplicate (§keyboard)", () => {
  test("Ctrl+D duplicates, Ctrl+C/V pastes; copies keep options + offset", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      (window as any).__s = s;
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 250, yPos: 200, width: 140, height: 90, text: "A" }));
      if (a.v2.ready) await a.v2.ready;
      await new Promise((r) => setTimeout(r, 300));
      a.v2.setColors("#e91e63");
      await new Promise((r) => setTimeout(r, 200));
      s.v2.selectNodes([a.v2]);
      await new Promise((r) => setTimeout(r, 100));

      const key = (k: string) =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: k, ctrlKey: true, bubbles: true, cancelable: true }));

      const countBefore = s.v2.nodes.allNodes.length;

      // Ctrl+D — duplicate
      key("d");
      await new Promise((r) => setTimeout(r, 500));
      const afterDup = s.v2.nodes.allNodes;
      const dup = afterDup.find((n: any) => n.id !== "A");

      // Ctrl+C then Ctrl+V — copy the (now-selected) duplicate, paste
      key("c");
      await new Promise((r) => setTimeout(r, 100));
      key("v");
      await new Promise((r) => setTimeout(r, 500));

      const orig = s.v2.nodes.one("A").options;
      return {
        countBefore,
        countAfterDup: afterDup.length,
        countAfterPaste: s.v2.nodes.allNodes.length,
        dupColor: dup?.options?.backgroundColor,
        dupNewId: dup?.id !== "A",
        dupOffsetX: dup ? Math.round(dup.options.x - orig.x) : 0,
        dupOffsetY: dup ? Math.round(dup.options.y - orig.y) : 0,
      };
    });

    expect(res.countBefore).toBe(1);
    expect(res.countAfterDup).toBe(2); // Ctrl+D added one
    expect(res.countAfterPaste).toBe(3); // Ctrl+C/V added one
    expect(res.dupNewId).toBe(true); // fresh id, not the source's
    expect(res.dupColor).toBe("#e91e63"); // inherited paintable options
    expect(res.dupOffsetX).toBe(20); // offset from the source
    expect(res.dupOffsetY).toBe(20);
  });
});
