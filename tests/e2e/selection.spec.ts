import { test, expect } from "@playwright/test";

test.describe("Node Selection", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the test page
    await page.goto("/test.html");

    // Wait for SlateboxJS to initialize
    await page.waitForFunction(() => window.SlateboxJS);

    // Create a test slate with some nodes
    await page.evaluate(() => {
      const slate = window.SlateboxJS("#app");

      // Add test nodes
      slate.addNode({
        id: "node1",
        x: 100,
        y: 100,
        width: 120,
        height: 80,
        text: "Node 1",
        backgroundColor: "#f0f0f0",
      });

      slate.addNode({
        id: "node2",
        x: 300,
        y: 150,
        width: 120,
        height: 80,
        text: "Node 2",
        backgroundColor: "#e0e0e0",
      });

      slate.addNode({
        id: "node3",
        x: 200,
        y: 250,
        width: 120,
        height: 80,
        text: "Node 3",
        backgroundColor: "#d0d0d0",
      });
    });
  });

  test("should select a single node on click", async ({ page }) => {
    // Click on node1
    await page.locator('g[data-node-id="node1"]').click();

    // Verify selection state
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n) => n.id);
    });

    expect(selectedNodes).toEqual(["node1"]);

    // Verify visual selection indicators (resize handles should be visible)
    await expect(page.locator(".svg-select-point")).toBeVisible();
  });

  test("should support multi-selection with Ctrl+click", async ({ page }) => {
    // Select first node
    await page.locator('g[data-node-id="node1"]').click();

    // Ctrl+click second node to add to selection
    await page.locator('g[data-node-id="node2"]').click({
      modifiers: ["ControlOrMeta"],
    });

    // Verify both nodes are selected
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate
        .getSelectedNodes()
        .map((n) => n.id)
        .sort();
    });

    expect(selectedNodes).toEqual(["node1", "node2"]);
  });

  test("should clear selection when clicking empty canvas", async ({
    page,
  }) => {
    // Select a node first
    await page.locator('g[data-node-id="node1"]').click();

    // Verify node is selected
    let selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n) => n.id);
    });
    expect(selectedNodes).toEqual(["node1"]);

    // Click empty area of canvas
    await page.locator("svg").click({ position: { x: 50, y: 50 } });

    // Verify selection is cleared
    selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n) => n.id);
    });
    expect(selectedNodes).toEqual([]);

    // Verify resize handles are hidden
    await expect(page.locator(".svg-select-point")).not.toBeVisible();
  });

  test("should maintain selection during drag operation", async ({ page }) => {
    // Click to select node1
    await page.locator('g[data-node-id="node1"]').click();

    // Drag the node
    await page
      .locator('g[data-node-id="node1"]')
      .dragTo(page.locator("svg"), { targetPosition: { x: 200, y: 200 } });

    // Verify node is still selected after drag
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n) => n.id);
    });
    expect(selectedNodes).toEqual(["node1"]);

    // Verify node position changed
    const nodePosition = await page.evaluate(() => {
      const slate = window.currentSlate;
      const node = slate.getNode("node1");
      return { x: node.options.x, y: node.options.y };
    });

    // Position should have changed from original (100, 100)
    expect(nodePosition.x).not.toBe(100);
    expect(nodePosition.y).not.toBe(100);
  });

  test("should select dragged node if it was not selected", async ({
    page,
  }) => {
    // Select node1 first
    await page.locator('g[data-node-id="node1"]').click();

    // Drag node2 (which is not selected)
    await page
      .locator('g[data-node-id="node2"]')
      .dragTo(page.locator("svg"), { targetPosition: { x: 400, y: 200 } });

    // Verify that node2 is now selected and node1 is deselected
    const selectedNodes = await page.evaluate(() => {
      const slate = window.currentSlate;
      return slate.getSelectedNodes().map((n) => n.id);
    });
    expect(selectedNodes).toEqual(["node2"]);
  });

  test("should show resize handles for single selection", async ({ page }) => {
    // Select a single node
    await page.locator('g[data-node-id="node1"]').click();

    // Wait for resize handles to appear
    await expect(page.locator(".svg-select-point")).toBeVisible();

    // Should have 8 resize handles (corners + sides)
    const handleCount = await page.locator(".svg-select-point").count();
    expect(handleCount).toBeGreaterThanOrEqual(8);
  });

  test("should show group selection for multiple nodes", async ({ page }) => {
    // Multi-select two nodes
    await page.locator('g[data-node-id="node1"]').click();
    await page.locator('g[data-node-id="node2"]').click({
      modifiers: ["ControlOrMeta"],
    });

    // Should show group selection indicator
    await expect(page.locator(".svg-select-boundingRect")).toBeVisible();

    // Individual node resize handles should not be visible
    await expect(page.locator(".svg-select-point")).not.toBeVisible();
  });
});
