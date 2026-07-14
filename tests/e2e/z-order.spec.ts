import { test, expect } from "@playwright/test";

// Z-order via keyboard (Keyboard: Ctrl/Cmd+] = bring to front, Ctrl/Cmd+[ = send
// to back). node.toFront()/toBack() reorder the SVG group AND broadcast
// onNodeToFront/onNodeToBack, so the change persists + syncs to collab peers.
test.describe("z-order keyboard shortcuts (§keyboard)", () => {
  test("Ctrl+] brings to front, Ctrl+[ sends to back (+ broadcasts)", async ({
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
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 200, width: 140, height: 90, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 230, yPos: 230, width: 140, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));
      s.v2.selectNodes([a.v2], false);
      await new Promise((r) => setTimeout(r, 100));

      const casts: string[] = [];
      const orig = s.v2.broadcast.bind(s.v2);
      s.v2.broadcast = (type: string, data: any) => {
        if (type === "onNodeToFront" || type === "onNodeToBack") casts.push(type);
        return orig(type, data);
      };

      const order = () =>
        Array.from(document.querySelectorAll("#slateCanvas [data-node-id]")).map(
          (g) => g.getAttribute("data-node-id")
        );
      const key = (k: string) =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: k, ctrlKey: true, bubbles: true, cancelable: true }));

      const before = order();
      key("]"); // A → front
      await new Promise((r) => setTimeout(r, 100));
      const afterFront = order();
      key("["); // A → back
      await new Promise((r) => setTimeout(r, 100));
      const afterBack = order();

      return { before, afterFront, afterBack, casts };
    });

    // A started first (behind B); Ctrl+] moves it last (on top).
    expect(res.afterFront[res.afterFront.length - 1]).toBe("A");
    // Ctrl+[ moves it back to first (behind).
    expect(res.afterBack[0]).toBe("A");
    // Both broadcast so they persist + sync.
    expect(res.casts).toContain("onNodeToFront");
    expect(res.casts).toContain("onNodeToBack");
  });
});
