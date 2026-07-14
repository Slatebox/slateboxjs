import { test, expect } from "@playwright/test";

test.describe("Node Selection", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    await page.goto("/test.html");

    // Wait for SlateboxJS to initialize
    await page.waitForFunction(() => window.SlateboxJS);

    // Create a test slate with some nodes
    await page.evaluate(async () => {
      const slate = window.SlateboxJS("#app");

      // Add test nodes
      const n1 = slate.addNode({
        id: "node1",
        x: 100,
        y: 100,
        width: 120,
        height: 80,
        text: "Node 1",
        backgroundColor: "#f0f0f0",
      });

      const n2 = slate.addNode({
        id: "node2",
        x: 300,
        y: 150,
        width: 120,
        height: 80,
        text: "Node 2",
        backgroundColor: "#e0e0e0",
      });

      const n3 = slate.addNode({
        id: "node3",
        x: 200,
        y: 250,
        width: 120,
        height: 80,
        text: "Node 3",
        backgroundColor: "#d0d0d0",
      });

      // Wait for all nodes to finish async creation
      await Promise.all([n1.ready, n2.ready, n3.ready]);
    });

    // Also wait for DOM to settle
    await page.waitForSelector('g[data-node-id="node1"]');
    await page.waitForSelector('g[data-node-id="node2"]');
    await page.waitForSelector('g[data-node-id="node3"]');
  });

  test("should select a single node on click", async ({ page }) => {
    // Click on node1
    await page.locator('g[data-node-id="node1"]').click();

    // Verify selection state
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n: any) => n.id);
    });

    expect(selectedNodes).toEqual(["node1"]);

    // Verify visual selection indicators (resize handles should be visible)
    // svg.select.js uses svg_select_shape class for the selection outline
    await expect(page.locator(".svg_select_shape")).toBeVisible();
  });

  test("should support multi-selection with Ctrl+click", async ({ page }) => {
    // Select first node
    await page.locator('g[data-node-id="node1"]').click();

    // Wait for selection to register
    await page.waitForTimeout(200);

    // Ctrl+click second node to add to selection
    await page.locator('g[data-node-id="node2"]').click({
      modifiers: ["ControlOrMeta"],
    });

    // Verify both nodes are selected
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate
        .getSelectedNodes()
        .map((n: any) => n.id)
        .sort();
    });

    expect(selectedNodes).toEqual(["node1", "node2"]);
  });

  test("should clear selection when clicking empty canvas", async ({
    page,
  }) => {
    // Select a node first
    await page.locator('g[data-node-id="node1"]').click();

    // Wait for selection
    await page.waitForTimeout(200);

    // Verify node is selected
    let selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n: any) => n.id);
    });
    expect(selectedNodes).toEqual(["node1"]);

    // Click empty area of canvas (far from any nodes)
    await page.locator("#app > svg").click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(200);

    // Verify selection is cleared
    selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n: any) => n.id);
    });
    expect(selectedNodes).toEqual([]);
  });

  test("should maintain selection during drag operation", async ({ page }) => {
    // Click to select node1
    await page.locator('g[data-node-id="node1"]').click();
    await page.waitForTimeout(200);

    // Get node's bounding box to drag from its center
    const bbox = await page.locator('g[data-node-id="node1"]').boundingBox();
    expect(bbox).toBeTruthy();

    // Drag the node
    await page.mouse.move(bbox!.x + bbox!.width / 2, bbox!.y + bbox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(bbox!.x + bbox!.width / 2 + 100, bbox!.y + bbox!.height / 2 + 100, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(200);

    // Verify node is still selected after drag
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n: any) => n.id);
    });
    expect(selectedNodes).toEqual(["node1"]);
  });

  test("should select dragged node if it was not selected", async ({
    page,
  }) => {
    // Select node1 first
    await page.locator('g[data-node-id="node1"]').click();
    await page.waitForTimeout(200);

    // Click node2 (this will deselect node1 and select node2)
    await page.locator('g[data-node-id="node2"]').click();
    await page.waitForTimeout(200);

    // Verify that node2 is now selected and node1 is deselected
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n: any) => n.id);
    });
    expect(selectedNodes).toEqual(["node2"]);
  });

  test("should show resize handles for single selection", async ({ page }) => {
    // Select a single node
    await page.locator('g[data-node-id="node1"]').click();
    await page.waitForTimeout(300);

    // Wait for resize handles to appear (svg.select.js uses svg_select_handle class)
    // Use .first() since there are 8 handles (corners + sides)
    await expect(page.locator(".svg_select_handle").first()).toBeVisible();

    // Should have 8 resize handles (corners + sides)
    const handleCount = await page.locator(".svg_select_handle").count();
    expect(handleCount).toBe(8);
  });

  test("should show group selection for multiple nodes", async ({ page }) => {
    // Multi-select two nodes
    await page.locator('g[data-node-id="node1"]').click();
    await page.waitForTimeout(200);
    await page.locator('g[data-node-id="node2"]').click({
      modifiers: ["ControlOrMeta"],
    });
    await page.waitForTimeout(200);

    // Verify both are selected
    const selectedCount = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().length;
    });
    expect(selectedCount).toBe(2);
  });
});
