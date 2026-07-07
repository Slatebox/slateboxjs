import { test, expect } from "@playwright/test";

// Comment-count badge (Miro-style): Node.setCommentBadge renders a non-destructive
// count bubble in the node's SVG group; clearCommentBadge removes it. Colors:
// red = unresolved, green = resolved.
test.describe("comment badge (§node)", () => {
  test("setCommentBadge renders a non-destructive bubble; clear removes it", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:600px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const A = s.nodes.add(
        new sb.node({ id: "A", xPos: 100, yPos: 100, width: 140, height: 80, text: "Keep me" })
      );
      await new Promise((r) => setTimeout(r, 300));
      const v2 = A.v2;

      const read = () => {
        const b = document.querySelector(
          '#slateCanvas [data-node-id="A"] .comment-badge'
        );
        return {
          exists: !!b,
          text: b?.querySelector("text")?.textContent,
          color: b?.querySelector("circle")?.getAttribute("fill"),
        };
      };

      v2.setCommentBadge(3, "unresolved");
      const unresolved = read();
      const textAfterBadge = v2.options.text;

      v2.setCommentBadge(1, "resolved");
      const resolved = read();

      v2.setCommentBadge(150, "unresolved");
      const capped = read();

      v2.clearCommentBadge();
      const afterClear = read();

      return { unresolved, resolved, capped, afterClear, textAfterBadge };
    });

    // Unresolved → red "3".
    expect(res.unresolved.exists).toBe(true);
    expect(res.unresolved.text).toBe("3");
    expect(res.unresolved.color).toBe("#e5484d");
    // Non-destructive: node text is untouched.
    expect(res.textAfterBadge).toBe("Keep me");
    // Resolved → green.
    expect(res.resolved.color).toBe("#2e7d32");
    // Count caps at 99+.
    expect(res.capped.text).toBe("99+");
    // Clear removes it.
    expect(res.afterClear.exists).toBe(false);
  });
});
