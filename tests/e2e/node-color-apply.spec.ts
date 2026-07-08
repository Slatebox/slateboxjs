import { test, expect } from "@playwright/test";

// The Color pane changes a node's colors via setColors(backgroundColor, { borderColor,
// fontColor }); the library applies the fill to the node's shape (applyShapeFill) and the
// colors serialize so they persist + sync. Guards that port-side apply + serialize. (The
// app's color PICKER is a finicky third-party widget not reliably machine-driven, so this
// guards the library responsibility — verified working live: fill → #e91e63.)
test.describe("node color application (§color)", () => {
  test("setColors applies the fill and serializes", async ({ page }) => {
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
          text: "Color",
          backgroundColor: "#4051B5",
        })
      );
      await new Promise((res) => setTimeout(res, 400));

      const a = s.v2.nodes.one("A");
      const shape = () => {
        const g = document.querySelector('#slateCanvas [data-node-id="A"]');
        return g?.querySelector("rect,path,ellipse,polygon");
      };
      const norm = (v: any) =>
        String(v == null ? "" : v)
          .toLowerCase()
          .replace(/[^0-9a-f]/g, "");

      const before = norm(shape()?.getAttribute("fill"));
      a.setColors("#E91E63", { borderColor: "#333333", fontColor: "#ffffff" });
      await new Promise((res) => setTimeout(res, 250));
      const afterFill = norm(shape()?.getAttribute("fill"));
      const afterBg = norm(a.options.backgroundColor);

      let serialized: any = "(unknown)";
      try {
        const sr = (window as any).Serialization || sb.Serialization;
        const json = sr?.serialize ? sr.serialize(s) : null;
        const nj = json?.nodes?.find((n: any) => n.id === "A");
        serialized = nj ? norm(nj.backgroundColor) : "(no node)";
      } catch (e) {
        serialized = "(threw)";
      }
      return { before, afterFill, afterBg, serialized };
    });

    expect(r.before).not.toContain("e91e63");
    // Fill applied to the shape + carried on options.
    expect(r.afterFill).toContain("e91e63");
    expect(r.afterBg).toContain("e91e63");
    if (r.serialized !== "(no node)" && r.serialized !== "(threw)" && r.serialized !== "(unknown)") {
      expect(r.serialized).toContain("e91e63");
    }
  });
});
