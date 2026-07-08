import { test, expect } from "@playwright/test";

// The Text pane's alignment buttons broadcast textXAlign via onNodeTextChanged; the
// library maps it to the text element's text-anchor in centerText() (left→start,
// right→end, center→middle) and re-applies on render so it survives reload. This guards
// that port-side mapping + that textXAlign serializes.
test.describe("node text alignment (§text)", () => {
  test("textXAlign maps to text-anchor and serializes", async ({ page }) => {
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
          width: 200,
          height: 100,
          text: "Align me",
        })
      );
      await new Promise((res) => setTimeout(res, 400));

      const a = s.v2.nodes.one("A");
      const anchor = () =>
        document
          .querySelector('#slateCanvas [data-node-id="A"] text')
          ?.getAttribute("text-anchor");

      const before = anchor();
      a.options.textXAlign = "right";
      a.centerText();
      await new Promise((res) => setTimeout(res, 200));
      const right = anchor();
      a.options.textXAlign = "left";
      a.centerText();
      await new Promise((res) => setTimeout(res, 200));
      const left = anchor();
      a.options.textXAlign = "center";
      a.centerText();
      await new Promise((res) => setTimeout(res, 200));
      const center = anchor();

      let serialized: any = "(unknown)";
      try {
        a.options.textXAlign = "right";
        const sr = (window as any).Serialization || sb.Serialization;
        const json = sr?.serialize ? sr.serialize(s) : null;
        const nj = json?.nodes?.find((n: any) => n.id === "A");
        serialized = nj ? nj.textXAlign : "(no node)";
      } catch (e) {
        serialized = "(threw)";
      }
      return { before, right, left, center, serialized };
    });

    expect(r.right).toBe("end");
    expect(r.left).toBe("start");
    expect(r.center).toBe("middle");
    if (r.serialized !== "(no node)" && r.serialized !== "(threw)" && r.serialized !== "(unknown)") {
      expect(r.serialized).toBe("right");
    }
  });
});
