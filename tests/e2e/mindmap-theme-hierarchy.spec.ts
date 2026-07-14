import { test, expect } from "@playwright/test";

// mindMapMode theme coloring: applying a theme to a connected tree colors by
// HIERARCHY (root = parent style, each level down = child_1, child_2, …). A flat
// slate (no associations) falls back to insertion-order cycling.
test.describe("mindMapMode hierarchy theme coloring (§theme)", () => {
  test("tree colors by depth; flat slate cycles by index", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const mk = (id: string) => {
        const div = document.createElement("div");
        div.id = id;
        div.style.cssText = "width:700px;height:520px;position:fixed;top:0;left:0;background:#fff";
        document.body.appendChild(div);
      };
      const theme = {
        _id: "t",
        styles: {
          parent: { nodeColor: "#ff0000" },
          child_1: { nodeColor: "#00cc00" },
          child_2: { nodeColor: "#0000ff" },
        },
      };
      const bg = (n: any) => n.v2.options.backgroundColor;

      // Tree A -> B -> C with mindMapMode on.
      mk("tree");
      const st = await new sb.slate(
        { container: "tree", allowCollaboration: false, mindMapMode: true },
        {}
      ).init();
      const a = st.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 100, width: 100, height: 60, text: "A" }));
      const b = st.nodes.add(new sb.node({ id: "B", xPos: 300, yPos: 100, width: 100, height: 60, text: "B" }));
      const c = st.nodes.add(new sb.node({ id: "C", xPos: 500, yPos: 100, width: 100, height: 60, text: "C" }));
      await new Promise((r) => setTimeout(r, 300));
      a.v2.relationships.addAssociation(b.v2);
      b.v2.relationships.addAssociation(c.v2);
      await new Promise((r) => setTimeout(r, 300));
      st.v2.applyTheme(theme);
      await new Promise((r) => setTimeout(r, 200));
      const tree = { a: bg(a), b: bg(b), c: bg(c) };

      // Flat slate: 3 unconnected nodes → index cycling (parent, child_1, child_2).
      mk("flat");
      const sf = await new sb.slate(
        { container: "flat", allowCollaboration: false, mindMapMode: true },
        {}
      ).init();
      const x = sf.nodes.add(new sb.node({ id: "X", xPos: 100, yPos: 100, width: 100, height: 60, text: "X" }));
      const y = sf.nodes.add(new sb.node({ id: "Y", xPos: 300, yPos: 100, width: 100, height: 60, text: "Y" }));
      const z = sf.nodes.add(new sb.node({ id: "Z", xPos: 500, yPos: 100, width: 100, height: 60, text: "Z" }));
      await new Promise((r) => setTimeout(r, 300));
      sf.v2.applyTheme(theme);
      await new Promise((r) => setTimeout(r, 200));
      const flat = { x: bg(x), y: bg(y), z: bg(z) };

      return { tree, flat };
    });

    // Tree → by hierarchy depth.
    expect(res.tree.a).toBe("#ff0000"); // root → parent
    expect(res.tree.b).toBe("#00cc00"); // depth 1 → child_1
    expect(res.tree.c).toBe("#0000ff"); // depth 2 → child_2
    // Flat → by insertion index (unchanged behavior; every node distinct).
    expect(res.flat.x).toBe("#ff0000");
    expect(res.flat.y).toBe("#00cc00");
    expect(res.flat.z).toBe("#0000ff");
  });
});
