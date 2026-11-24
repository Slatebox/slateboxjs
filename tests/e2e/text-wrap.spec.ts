import { test, expect } from "@playwright/test";

// Long node text must WRAP within the node's width (like Miro), not render as a
// single line spilling far outside the shape. createText/setText now word-wrap to
// the node's inner width (SVG.js renders one tspan per line) and centerText shifts
// the multi-line block up to stay vertically centered.
test.describe("node text wrapping (§node)", () => {
  test("long text wraps to multiple lines that fit the node width", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:700px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 175, height: 100, text: "short" }));
      await new Promise((r) => setTimeout(r, 300));

      A.v2.setText(
        "This is a much longer piece of text that should wrap nicely inside the node instead of overflowing the shape"
      );
      await new Promise((r) => setTimeout(r, 200));

      const te = A.v2.textElement.node;
      const lines = te.querySelectorAll("tspan").length;
      const tb = te.getBBox();
      return { lines, textWidth: Math.round(tb.width), nodeWidth: A.v2.options.width };
    });

    // Wrapped to multiple lines, and each line fits within the node width.
    expect(res.lines).toBeGreaterThan(1);
    expect(res.textWidth).toBeLessThanOrEqual(res.nodeWidth);
  });

  test("wrapped text reflows when the node is resized", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 175, height: 100, text: "x" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.setText("This is a much longer piece of text that should wrap and reflow when the node is resized wider or narrower");
      await new Promise((r) => setTimeout(r, 150));
      const lines = () => A.v2.textElement.node.querySelectorAll("tspan").length;
      const narrow = lines();
      A.v2.setSize(420, A.v2.options.height);
      await new Promise((r) => setTimeout(r, 150));
      const wide = lines();
      return { narrow, wide };
    });
    // Wider node → fewer lines.
    expect(res.wide).toBeLessThan(res.narrow);
  });

  test("an over-long word / URL hard-breaks so it doesn't overflow", async ({
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
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 175, height: 100, text: "x" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.setText("https://www.example.com/some/really/long/path/that/never/breaks");
      await new Promise((r) => setTimeout(r, 150));
      const tb = A.v2.textElement.node.getBBox();
      return { overflowRatio: tb.width / A.v2.options.width, lines: A.v2.textElement.node.querySelectorAll("tspan").length };
    });
    // The URL is broken across lines and no longer overflows the node.
    expect(res.overflowRatio).toBeLessThanOrEqual(1.15);
    expect(res.lines).toBeGreaterThan(1);
  });

  test("text re-wraps when the font size changes", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:600px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 175, height: 100, text: "x" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.setText("This is a longer piece of text that wraps to several lines inside the node");
      await new Promise((r) => setTimeout(r, 150));
      const stat = () => {
        const tb = A.v2.textElement.node.getBBox();
        return { lines: A.v2.textElement.node.querySelectorAll("tspan").length, overflow: tb.width / A.v2.options.width };
      };
      const small = stat();
      A.v2.options.fontSize = 32;
      A.v2.applyTextStyle();
      await new Promise((r) => setTimeout(r, 150));
      const big = stat();
      return { small, big };
    });
    // Bigger font → more lines, and it still fits (didn't overflow).
    expect(res.big.lines).toBeGreaterThan(res.small.lines);
    expect(res.big.overflow).toBeLessThanOrEqual(1.15);
  });

  test("node grows vertically to fit wrapped text (no vertical overflow)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:600px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 175, height: 60, text: "x" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.setText("This is a very long paragraph of text that will wrap into many lines and exceed the short height of the node");
      await new Promise((r) => setTimeout(r, 200));
      const tb = A.v2.textElement.node.getBBox();
      return { nodeHeight: A.v2.options.height, textHeight: tb.height };
    });
    // The node grew past its initial 60px, and the text now fits inside it.
    expect(res.nodeHeight).toBeGreaterThan(60);
    expect(res.textHeight).toBeLessThanOrEqual(res.nodeHeight);
  });

  test("short text stays a single line (no regression)", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const lines = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:500px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 175, height: 100, text: "Hello" }));
      await new Promise((r) => setTimeout(r, 300));
      return A.v2.textElement.node.querySelectorAll("tspan").length;
    });
    expect(lines).toBeLessThanOrEqual(1);
  });
  test("a long word in a big font stays whole and the text shrinks to fit it (autofit, no 'Categor / y 1')", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const out: any[] = [];
      const texts = ["Internationalization", "Categories 1", "Right-to-left layouts"];
      for (const [i, text] of texts.entries()) {
        const N = s.nodes.add(new sb.node({ id: `W${i}`, xPos: 40 + i * 260, yPos: 100, width: 160, height: 68, fontSize: 44, text: "x" }));
        await new Promise((r) => setTimeout(r, 200));
        N.v2.setText(text);
        await new Promise((r) => setTimeout(r, 200));
        const te = N.v2.textElement.node;
        const lines = [...te.querySelectorAll("tspan")].map((t: any) => t.textContent);
        const box = te.getBoundingClientRect();
        const shape = N.v2.svgGroup.node.getBoundingClientRect();
        out.push({
          text,
          lines,
          inside: box.left >= shape.left - 1 && box.right <= shape.right + 1 && box.top >= shape.top - 1 && box.bottom <= shape.bottom + 1,
          height: N.v2.options.height,
        });
      }
      return out;
    });
    for (const r of res) {
      // Every word of the text is on one line, whole.
      for (const word of r.text.split(" ")) expect(r.lines.some((l: string) => l.split(" ").includes(word))).toBe(true);
      expect(r.inside).toBe(true);
      // The note grew only as tall as the shrunk text needs.
      expect(r.height).toBeLessThan(200);
    }
  });
});
