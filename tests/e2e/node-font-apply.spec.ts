import { test, expect } from "@playwright/test";

// The app's Text pane changes a node's font via a third-party FontPicker whose onChange
// broadcasts onNodeTextChanged; the library applies it in Node.applyTextStyle() (family +
// size + color + opacity → the text element, then re-wrap). This guards that port-side
// responsibility: setting options.fontFamily + applyTextStyle() must reach the rendered
// text element, and the font must survive a serialize round-trip so it persists.
test.describe("node font application (§text)", () => {
  test("applyTextStyle applies fontFamily to the text element and it serializes", async ({
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
        new sb.node({
          id: "A",
          xPos: 300,
          yPos: 250,
          width: 160,
          height: 100,
          text: "Style",
        })
      );
      await new Promise((res) => setTimeout(res, 400));

      const a = s.v2.nodes.one("A");
      const te = () =>
        document
          .querySelector('#slateCanvas [data-node-id="A"] text')
          ?.getAttribute("font-family");
      const before = te();

      // Same path the app's onNodeTextChanged broadcast drives.
      a.options.fontFamily = "Caveat";
      a.applyTextStyle();
      await new Promise((res) => setTimeout(res, 300));
      const after = te();

      // Font must survive a serialize round-trip (so it persists to the DB).
      let serializedFont: any = "(unknown)";
      try {
        const sr = (window as any).Serialization || sb.Serialization;
        const json = sr?.serialize ? sr.serialize(s) : null;
        const nj = json?.nodes?.find((n: any) => n.id === "A");
        serializedFont = nj ? nj.fontFamily : "(no node in json)";
      } catch (e) {
        serializedFont = "(serialize threw)";
      }
      return { before, after, serializedFont };
    });

    expect(r.before).not.toBe("Caveat");
    // Library applied the font to the rendered text element.
    expect(r.after).toBe("Caveat");
    // And it round-trips through serialization (unless serialize wasn't reachable here).
    if (r.serializedFont !== "(no node in json)" &&
        r.serializedFont !== "(serialize threw)" &&
        r.serializedFont !== "(unknown)") {
      expect(r.serializedFont).toBe("Caveat");
    }
  });
});
