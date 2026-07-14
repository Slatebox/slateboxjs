import { test, expect } from "@playwright/test";

// Node links (Links.set broadcasts onNodeLinkAdded with data.link). The collab
// receive/replay path (Invoker.onNodeLinkAdded) must store the LINK OPTIONS on
// options.link — not the whole collab envelope. Passing the pkg corrupted the
// link on reload and for remote peers.
test.describe("node link collab replay (§links)", () => {
  test("onNodeLinkAdded stores the link options, not the collab envelope", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:600px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "LNK", xPos: 100, yPos: 100, width: 140, height: 90, text: "L" }));
      await new Promise((r) => setTimeout(r, 200));

      const link = { show: true, type: "url", url: "https://example.com/test", target: "_blank" };
      // Exercise the exact collab receive/replay path.
      s.v2.collab.exe({ type: "onNodeLinkAdded", data: { id: "LNK", link } });
      await new Promise((r) => setTimeout(r, 100));

      const stored = s.v2.nodes.one("LNK").options.link;
      return { stored };
    });

    // options.link is the clean link options — NOT the collab envelope.
    expect(res.stored.url).toBe("https://example.com/test");
    expect(res.stored.type).toBe("url");
    expect(res.stored.show).toBe(true);
    expect(res.stored.data).toBeUndefined(); // no nested package payload
    expect(res.stored.clientID).toBeUndefined(); // no collab envelope fields
  });
});
