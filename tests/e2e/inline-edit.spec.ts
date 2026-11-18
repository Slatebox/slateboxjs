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

  // The real human triggers: double-click to start, click-away (blur) to commit,
  // Shift+Enter for a newline. The test above drives startInline() directly; these
  // exercise the actual on-canvas interactions.
  async function bootNode(page: import("@playwright/test").Page) {
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
        new sb.node({ id: "A", xPos: 120, yPos: 120, width: 160, height: 80, text: "Old" })
      );
      await new Promise((r) => setTimeout(r, 300));
      (window as any).__A = A.v2;
    });
  }

  function nodeCenter(page: import("@playwright/test").Page) {
    return page.evaluate(() => {
      const el = document.querySelector(
        '#slateCanvas [data-node-id="A"]'
      ) as SVGGraphicsElement;
      const r = el.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
  }

  test("a real double-click starts inline editing", async ({ page }) => {
    await bootNode(page);
    const c = await nodeCenter(page);
    await page.mouse.dblclick(c.x, c.y);
    await expect(page.locator(".sb-inline-editor")).toBeVisible();
  });

  for (const gesture of ["mouse","touch"] as const) {
    test("the first "+gesture+" double activation opens an editor without the optional stylesheet",async({page,browserName})=>{
      test.skip(gesture==="touch" && browserName!=="chromium","Uses native Chromium touch input.")
      await bootNode(page)
      await page.evaluate(()=>{
        for(const sheet of document.styleSheets) sheet.disabled=true
      })
      const {x,y}=await nodeCenter(page)
      if(gesture==="mouse") await page.mouse.dblclick(x,y)
      else {
        const device=await page.context().newCDPSession(page)
        try {
          await device.send("Emulation.setTouchEmulationEnabled",{enabled:true,maxTouchPoints:2})
          for(let tap=0;tap<2;tap++){
            await device.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]})
            await device.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]})
          }
        } finally {await device.detach()}
      }
      const editor=page.locator(".sb-inline-editor")
      await expect(editor).toBeFocused()
      await editor.fill("Keep only the customer records")
      await editor.press("Enter")
      await expect(page.locator('[data-node-id="A"]')).toHaveAttribute("aria-label","Keep only the customer records")
    })
  }

  test("clicking away (blur) commits the edit", async ({ page }) => {
    await bootNode(page);
    await page.evaluate(() => (window as any).__A.editor.startInline());
    await expect(page.locator(".sb-inline-editor")).toBeVisible();
    await page.waitForTimeout(120);
    await page.keyboard.type("BlurCommit");
    // Click empty canvas away from the node → blur → commit.
    await page.mouse.click(480, 420);
    await expect(page.locator(".sb-inline-editor")).toHaveCount(0);
    const committed = await page.evaluate(() => (window as any).__A.options.text);
    expect(committed).toBe("BlurCommit");
  });

  test("Shift+Enter inserts a newline instead of committing", async ({ page }) => {
    await bootNode(page);
    await page.evaluate(() => (window as any).__A.editor.startInline());
    await expect(page.locator(".sb-inline-editor")).toBeVisible();
    await page.waitForTimeout(120);
    await page.keyboard.type("Line1");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("Line2");
    // Editor still open (Shift+Enter did NOT commit).
    await expect(page.locator(".sb-inline-editor")).toBeVisible();
    await page.keyboard.press("Enter"); // now commit
    await expect(page.locator(".sb-inline-editor")).toHaveCount(0);
    const committed = await page.evaluate(() => (window as any).__A.options.text);
    expect(committed).toContain("Line1");
    expect(committed).toContain("Line2");
    expect(committed).toMatch(/Line1[\s\S]*Line2/);
  });
});
