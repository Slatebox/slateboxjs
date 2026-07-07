import { test, expect } from "@playwright/test";

// Inline (on-canvas) text editing — Miro-style. Editor.startInline() overlays a
// contenteditable box on the node; Enter commits, Escape cancels. Triggered in
// the app by F2 / Enter on a single selected node.
test.describe("inline text edit (§editor)", () => {
  test("startInline overlays an editor; Enter commits, Escape cancels", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
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
        new sb.node({ id: "A", xPos: 100, yPos: 100, width: 140, height: 70, text: "Old" })
      );
      await new Promise((r) => setTimeout(r, 300));
      (window as any).__A = A.v2;
    });

    // Start inline edit — box appears, pre-filled + focused.
    await page.evaluate(() => (window as any).__A.editor.startInline());
    const editor = page.locator(".sb-inline-editor");
    await expect(editor).toBeVisible();
    await expect(editor).toHaveText("Old");
    await page.waitForTimeout(120); // let the built-in select-all settle

    // Type replaces (all was selected) → Enter commits.
    await page.keyboard.type("NewLabel");
    await page.keyboard.press("Enter");
    await expect(editor).toHaveCount(0);
    const committed = await page.evaluate(() => (window as any).__A.options.text);
    expect(committed).toBe("NewLabel");

    // Escape cancels — text stays "NewLabel".
    await page.evaluate(() => (window as any).__A.editor.startInline());
    await expect(page.locator(".sb-inline-editor")).toBeVisible();
    await page.waitForTimeout(120);
    await page.keyboard.type("DISCARD");
    await page.keyboard.press("Escape");
    await expect(page.locator(".sb-inline-editor")).toHaveCount(0);
    const afterEscape = await page.evaluate(() => (window as any).__A.options.text);
    expect(afterEscape).toBe("NewLabel");
  });
});
