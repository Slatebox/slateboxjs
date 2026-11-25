import { test, expect } from "@playwright/test";

// A slate that wears a style draws it as real content: its own dark background, its notes in the
// style's faces and outlines, and the style's art as notes marked options.styleRole. Wearing it is
// one whole-slate replacement drawn as the person's own step (ownStep + onSlateReplaced, as the app
// does), so one undo takes it off; the record (options.style) and the art survive a save, and the
// SVG export carries the background.
test.describe("a slate wears a style (real content, one undo step)", () => {
  test("background, art notes and record round-trip; export is dark; one undo restores", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false, containerStyle: { backgroundColor: "#f3f1e4" } }, {}).init();
      s.nodes.add(new sb.node({ id: "root", xPos: 100, yPos: 150, width: 220, height: 120, text: "Launch day", backgroundColor: "#f2d27c" }));
      await new Promise((r) => setTimeout(r, 300));
      const v2 = s.v2;
      v2.undoRedo.forceSnapshot();
      const before = JSON.parse(v2.exportJSON());

      const BOLT = "M60 0 L10 110 L48 110 L30 200 L95 80 L58 80 L80 0 Z";
      const styled = JSON.parse(JSON.stringify(before));
      styled.options = {
        ...styled.options,
        style: { id: "neon", v: 4 },
        containerStyle: { ...(styled.options.containerStyle || {}), backgroundColor: "#0b0016", backgroundColorAsGradient: false },
      };
      const root = styled.nodes.find((n: any) => n.options.id === "root");
      Object.assign(root.options, { backgroundColor: "#ff2bd6", foregroundColor: "#ffffff", fontColor: "#ffffff", fontFamily: "Anton", fontWeight: "bold" });
      styled.nodes.unshift({
        options: { id: "sb-style-1-bolt", text: "", xPos: 360, yPos: 60, width: 60, height: 120, shape: "custom", vectorPath: BOLT, backgroundColor: "#fff200", borderWidth: 0, isLocked: true, styleRole: "decor" },
        relationships: { associations: [] },
      });
      styled.nodes.push({
        options: { id: "sb-style-2-title", text: "Launch day war room", xPos: 100, yPos: 20, width: 420, height: 90, backgroundColor: "transparent", borderWidth: 0, fontFamily: "Anton", fontSize: 40, foregroundColor: "#ffffff", fontColor: "#ffffff", styleRole: "title" },
        relationships: { associations: [] },
      });
      const snapshot = JSON.stringify(styled);
      const stackBefore = v2.undoRedo.undoStack.length;
      await v2.ownStep(() => v2.invoker.onSlateReplaced({ type: "onSlateReplaced", data: { snapshot } }));
      await new Promise((r) => setTimeout(r, 300));

      const worn = JSON.parse(v2.exportJSON());
      const host = document.getElementById("slateCanvas")!;
      const painted = getComputedStyle(v2.element || host).backgroundColor;
      const svg: string = v2.svg();
      const drawn = {
        bolt: Boolean(document.querySelector('g[data-node-id="sb-style-1-bolt"]')),
        title: Boolean(document.querySelector('g[data-node-id="sb-style-2-title"]')),
      };
      const stackAfter = v2.undoRedo.undoStack.length;
      const undone = v2.undoRedo.undo();
      await new Promise((r) => setTimeout(r, 400));
      const after = JSON.parse(v2.exportJSON());
      return {
        record: worn.options.style,
        bg: worn.options.containerStyle.backgroundColor,
        roles: worn.nodes.map((n: any) => n.options.styleRole || null),
        rootFont: worn.nodes.find((n: any) => n.options.id === "root").options.fontFamily,
        painted,
        svgHasBackground: /<rect[^>]*data-background[^>]*fill="#0b0016"/.test(svg),
        drawn,
        grew: stackAfter - stackBefore,
        undone,
        afterIds: after.nodes.map((n: any) => n.options.id),
        afterBg: after.options.containerStyle?.backgroundColor,
        afterStyle: after.options.style ?? null,
      };
    });

    expect(res.record).toEqual({ id: "neon", v: 4 });
    expect(res.bg).toBe("#0b0016");
    expect(res.roles).toEqual(["decor", null, "title"]);
    expect(res.rootFont).toBe("Anton");
    expect(res.painted.replace(/\s/g, "")).toBe("rgb(11,0,22)");
    expect(res.svgHasBackground).toBe(true);
    expect(res.drawn).toEqual({ bolt: true, title: true });
    expect(res.undone).toBe(true);
    expect(res.afterIds).toEqual(["root"]);
    expect(res.afterBg).toBe("#f3f1e4");
    expect(res.afterStyle).toBeNull();
  });
});
