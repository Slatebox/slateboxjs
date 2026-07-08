import { test, expect } from "@playwright/test";

// User bug (Image #3): applying an effect distorted the text into a blob. The
// 'outline' effect strokes 3px over the fill; on TEXT (thin glyph strokes) the
// default paint order bleeds the stroke across the letters, making them illegible.
// Fix: paint the stroke BEHIND the fill (paint-order: stroke) on text so the outline
// reads as a clean halo. Shapes keep the default full-width border.
test.describe("outline text effect renders as a clean halo (§effects)", () => {
  test("text outline uses paint-order: stroke; shape outline does not", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:640px;height:420px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 120, width: 180, height: 90, text: "Welcome!" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 360, yPos: 120, width: 180, height: 90, text: "Shape" })
      );
      await new Promise((r) => setTimeout(r, 300));
      // A: outline on text. B: outline on shape.
      a.v2.filters.apply("outline", "text");
      b.v2.filters.apply("outline", "vect");
      await new Promise((r) => setTimeout(r, 200));

      const textEl = document.querySelector('#slateCanvas [data-node-id="A"] text') as any;
      const rectEl = (b.v2.backgroundRect as any).node;
      return {
        textPaintOrder: textEl?.getAttribute("paint-order"),
        textStroke: textEl?.getAttribute("stroke"),
        textStrokeW: textEl?.getAttribute("stroke-width"),
        rectPaintOrder: rectEl?.getAttribute("paint-order"),
        rectStrokeW: rectEl?.getAttribute("stroke-width"),
      };
    });

    // Text: outline sits behind the fill so glyphs stay legible.
    expect(res.textPaintOrder).toBe("stroke");
    expect(res.textStroke).toBe("#ff0000");
    expect(res.textStrokeW).toBe("3");
    // Shape: keeps a full border (no behind-fill paint order).
    expect(res.rectPaintOrder).toBeNull();
    expect(res.rectStrokeW).toBe("3");
  });
});
