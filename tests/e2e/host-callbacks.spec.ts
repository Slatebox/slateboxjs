import { test, expect } from "@playwright/test";

// §B of docs/drop-in-contract.md — host-driven callbacks: the library must
// call the app's UI hooks at the right moments and honor its permission
// checks (Canvas.jsx registers all of these).
test.describe("host-driven event callbacks (§B)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("onTextPaneRequested fires on dblclick; cb applies text", async ({
    page,
  }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:600px";
      document.body.appendChild(div);

      const calls: any[] = [];
      (window as any).__calls = calls;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {
          onTextPaneRequested: (node: any, cb: Function) => {
            calls.push(node.id);
            cb({ text: "edited by host" });
          },
          isReadOnly: () => false,
          isCommentOnly: () => false,
        }
      ).init();
      (window as any).__slate = s;
      s.nodes.add(
        new sb.node({ id: "tp1", xPos: 200, yPos: 200, width: 150, height: 80, text: "orig" })
      );
      await new Promise((r) => setTimeout(r, 500));
    });

    await page.dblclick('#slateCanvas svg g[data-node-id="tp1"]');
    await page.waitForTimeout(400);

    const result = await page.evaluate(() => ({
      calls: (window as any).__calls,
      text: (window as any).__slate.nodes.one("tp1")?.v2.options.text,
    }));
    expect(result.calls).toContain("tp1");
    expect(result.text).toBe("edited by host");
  });

  test("onGroupSelection fires with nodes then [] on clear", async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "gsCanvas";
      div.style.cssText = "width:800px;height:600px";
      document.body.appendChild(div);

      const groups: any[] = [];
      const s = await new sb.slate(
        { container: "gsCanvas", allowCollaboration: false },
        { onGroupSelection: (nodes: any[]) => groups.push(nodes.length) }
      ).init();
      const a = s.nodes.add(new sb.node({ id: "g1", xPos: 50, yPos: 50 }));
      const b = s.nodes.add(new sb.node({ id: "g2", xPos: 250, yPos: 50 }));
      await new Promise((r) => setTimeout(r, 500));

      s.v2.selectNodes([a.v2, b.v2]);
      s.v2.clearSelection();
      return groups;
    });

    expect(result).toEqual([2, 0]);
  });

  test("onCanvasClicked fires on empty-canvas click", async ({ page }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "ccCanvas";
      div.style.cssText = "width:800px;height:600px";
      document.body.appendChild(div);
      (window as any).__ccCount = 0;
      await new sb.slate(
        { container: "ccCanvas", allowCollaboration: false },
        { onCanvasClicked: () => (window as any).__ccCount++ }
      ).init();
      await new Promise((r) => setTimeout(r, 300));
    });

    // Dispatch directly on the svg element — a coordinate click can land on
    // overlay children whose tagName check would (correctly) not count as
    // an empty-canvas click
    await page.evaluate(() => {
      const svg = document.querySelector("#ccCanvas svg")!;
      svg.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    await page.waitForTimeout(200);

    expect(await page.evaluate(() => (window as any).__ccCount)).toBeGreaterThan(0);
  });

  test("isReadOnly blocks keyboard deletion and text pane", async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "roCanvas";
      div.style.cssText = "width:800px;height:600px";
      document.body.appendChild(div);

      let paneCalls = 0;
      const s = await new sb.slate(
        { container: "roCanvas", allowCollaboration: false },
        {
          isReadOnly: () => true,
          onTextPaneRequested: () => paneCalls++,
        }
      ).init();
      const n = s.nodes.add(new sb.node({ id: "ro1", xPos: 100, yPos: 100 }));
      await new Promise((r) => setTimeout(r, 500));

      // Try to delete via the keyboard path
      s.v2.selectNodes([n.v2]);
      (s.v2 as any).keyboard["deleteSelected"]?.(
        new KeyboardEvent("keydown", { key: "Delete" })
      );

      // Try to open the text pane via dblclick dispatch
      n.v2.svgGroup.node.dispatchEvent(
        new MouseEvent("dblclick", { bubbles: true })
      );
      await new Promise((r) => setTimeout(r, 200));

      return {
        stillExists: !!s.nodes.one("ro1"),
        paneCalls,
        isReadOnly: s.v2.isReadOnly(),
      };
    });

    expect(result.isReadOnly).toBe(true);
    expect(result.stillExists).toBe(true);
    expect(result.paneCalls).toBe(0);
  });
});
