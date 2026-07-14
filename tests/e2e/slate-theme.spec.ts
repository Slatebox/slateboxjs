import { test, expect } from "@playwright/test";

// U9: onSlateThemeChanged was a stub (console.log). It now applies the theme:
// container background, and per-node parent/child styles cycling across nodes.
// The app's saved themes use v1 field names (nodeColor for fill, foregroundColor
// for text), which the theme engine now accepts.
test.describe("slate theme applies to nodes + background (§U9)", () => {
  test("applying a theme recolors nodes (parent/child cycle) and paints the bg", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 100, width: 120, height: 70, text: "A", backgroundColor: "#111111" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 300, yPos: 100, width: 120, height: 70, text: "B", backgroundColor: "#111111" }));
      s.nodes.add(new sb.node({ id: "C", xPos: 500, yPos: 100, width: 120, height: 70, text: "C", backgroundColor: "#111111" }));
      await new Promise((r) => setTimeout(r, 300));

      // App-shaped theme (v1 field names).
      const theme = {
        _id: "theme-xyz",
        containerStyle: { backgroundColor: "#223344" },
        defaultLineColor: "#ff0000",
        styles: {
          parent: { nodeColor: "#ff0000", foregroundColor: "#ffffff" },
          child_1: { nodeColor: "#00ff00", foregroundColor: "#000000" },
          child_2: { nodeColor: "#0000ff", foregroundColor: "#ffffff" },
        },
      };
      s.v2.invoker.onSlateThemeChanged({ data: { theme, syncWithTheme: false } });
      await new Promise((r) => setTimeout(r, 200));

      const el = document.getElementById("slateCanvas") as HTMLElement;
      const n = (id: string) => s.v2.nodes.one(id).options;
      return {
        themeId: s.v2.options.themeId,
        aBg: n("A").backgroundColor,
        bBg: n("B").backgroundColor,
        cBg: n("C").backgroundColor,
        aFont: n("A").fontColor,
        containerBg: el.style.backgroundColor,
      };
    });

    expect(res.themeId).toBe("theme-xyz");
    // Nodes cycle parent → child_1 → child_2.
    expect(res.aBg).toBe("#ff0000");
    expect(res.bBg).toBe("#00ff00");
    expect(res.cBg).toBe("#0000ff");
    // foregroundColor maps to fontColor.
    expect(res.aFont).toBe("#ffffff");
    // Container background painted.
    expect(res.containerBg).toContain("rgb(34, 51, 68)");
  });
});
