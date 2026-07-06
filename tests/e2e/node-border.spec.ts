import { test, expect } from "@playwright/test";

// U11: node border pane (width / color / style) was inert. The app sends one
// { prop, val } at a time, but onNodeBorderPropertiesChanged read pkg.data
// .borderColor/.borderWidth (the wrong shape) and only ever set stroke color via
// setColors (never width or dash). It now updates options[prop] and repaints the
// full stroke via node.applyBorder().
test.describe("node border width/color/style apply (§U11)", () => {
  test("border prop changes repaint the stroke", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "N", xPos: 250, yPos: 200, width: 160, height: 100, text: "N" }));
      await new Promise((r) => setTimeout(r, 300));
      const inv = s.v2.invoker;
      const stroke = () => {
        const el = document.querySelector('#slateCanvas [data-node-id="N"] rect, #slateCanvas [data-node-id="N"] path') as SVGElement;
        return { w: el.getAttribute("stroke-width"), c: el.getAttribute("stroke"), dash: el.getAttribute("stroke-dasharray") };
      };

      inv.onNodeBorderPropertiesChanged({ data: { id: "N", prop: "borderWidth", val: 8 } });
      const w = stroke();
      inv.onNodeBorderPropertiesChanged({ data: { id: "N", prop: "borderColor", val: "#ff0000" } });
      const c = stroke();
      inv.onNodeBorderPropertiesChanged({ data: { id: "N", prop: "borderStyle", val: "-" } });
      const dashed = stroke();
      inv.onNodeBorderPropertiesChanged({ data: { id: "N", prop: "borderStyle", val: null } });
      const solid = stroke();
      return { w, c, dashed, solid };
    });

    expect(res.w.w).toBe("8");
    expect(res.c.c).toBe("#ff0000");
    // Dashed → a non-empty dasharray scaled by width ([3,1] * 8 = "24,8").
    expect(res.dashed.dash).toBe("24,8");
    // Back to solid → no dashes.
    expect(res.solid.dash === "none" || !res.solid.dash).toBe(true);
  });

  // U12: border style (dash) must survive a reload — createBackground shares the
  // dash mapping with applyBorder so the app's symbol styles restore.
  test("border style survives serialize/deserialize (reload)", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const mk = (id: string) => {
        const d = document.createElement("div");
        d.id = id;
        d.style.cssText = "width:700px;height:450px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
        document.body.appendChild(d);
        return d;
      };
      mk("bd1");
      const s1 = await new sb.slate({ container: "bd1", allowCollaboration: false }, {}).init();
      s1.nodes.add(new sb.node({ id: "N", xPos: 200, yPos: 150, width: 160, height: 100, text: "N" }));
      await new Promise((r) => setTimeout(r, 300));
      s1.v2.invoker.onNodeBorderPropertiesChanged({ data: { id: "N", prop: "borderWidth", val: 6 } });
      s1.v2.invoker.onNodeBorderPropertiesChanged({ data: { id: "N", prop: "borderStyle", val: "-" } });
      await new Promise((r) => setTimeout(r, 150));
      const json = s1.exportJSON();
      s1.v2.destroy();

      mk("bd2");
      const s2 = await new sb.slate({ container: "bd2", allowCollaboration: false }, {}).init();
      await s2.loadJSON(json);
      await new Promise((r) => setTimeout(r, 500));
      const rect = document.querySelector('#bd2 [data-node-id="N"] rect') as SVGElement;
      return { dash: rect?.getAttribute("stroke-dasharray"), w: rect?.getAttribute("stroke-width") };
    });

    expect(res.w).toBe("6");
    // Dashed border restored after reload ([3,1] * 6 = "18,6").
    expect(res.dash).toBe("18,6");
  });
});
