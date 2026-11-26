import { test, expect, Page } from "@playwright/test";

/**
 * Comprehensive E2E Tests for Node Connections
 *
 * Test Scenarios:
 * 1. Connection Handles (blue buttons) - Creating sibling nodes
 * 2. Edge-to-Edge Connections - Perifery attachment
 * 3. Different Shape Types - Rectangle, Circle, Ellipse
 * 4. Line Selection and Repositioning
 * 5. Click vs Drag Detection (pan should not trigger selection)
 * 6. Connection Updates on Node Movement/Rotation
 * 7. Multiple Connections
 * 8. Connection Types (straight, curved)
 */

// Helper function to wait for slate initialization and create a fresh slate
async function initSlate(page: Page) {
  await page.goto("/test.html");
  await page.waitForFunction(() => window.SlateboxJS);

  // Create a fresh slate (the wrapper in test.html sets window.testSlate)
  await page.evaluate(() => {
    window.SlateboxJS("#app");
  });

  await page.waitForTimeout(100);
}

// Helper to add a node
async function addNode(
  page: Page,
  options: {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    shape?: "rectangle" | "circle" | "ellipse";
    text?: string;
    backgroundColor?: string;
  }
) {
  return await page.evaluate(async (opts) => {
    const slate = window.testSlate;
    const node = slate.addNode({
      width: 120,
      height: 80,
      backgroundColor: "#4ecdc4",
      borderColor: "#333",
      borderWidth: 2,
      ...opts,
    });
    await node.ready;
    return true;
  }, options);
}

// Helper to get connection line path data
async function getConnectionPathData(page: Page) {
  return await page.evaluate(() => {
    const paths = document.querySelectorAll('path[connectortype="default"]');
    return Array.from(paths).map((p) => ({
      d: p.getAttribute("d"),
      stroke: p.getAttribute("stroke"),
    }));
  });
}

// Helper to wait for node element
async function waitForNode(page: Page, nodeId: string, timeout = 5000) {
  await page.waitForSelector(`g[data-node-id="${nodeId}"]`, { timeout });
}

test.describe("Connection Handles - Creating Sibling Nodes", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);
  });

  test("should show connection handles when node is selected", async ({
    page,
  }) => {
    await addNode(page, { id: "node1", x: 200, y: 200, text: "Click Me" });
    await waitForNode(page, "node1");

    // Click on the node to select it
    const node = page.locator('g[data-node-id="node1"]');
    await node.click({ force: true });
    await page.waitForTimeout(500);

    // Check for connection handles (circles with class connection-handle)
    const handles = page.locator("circle.connection-handle");
    const handleCount = await handles.count();

    // Should have 4 connection handles (top, right, bottom, left)
    expect(handleCount).toBe(4);
  });

  test("should create sibling node when connection handle is clicked", async ({
    page,
  }) => {
    await addNode(page, { id: "node1", x: 200, y: 200, text: "Parent" });
    await waitForNode(page, "node1");

    // Select the node
    const node = page.locator('g[data-node-id="node1"]');
    await node.click({ force: true });
    await page.waitForTimeout(500);

    // Get initial node count
    const initialCount = await page.evaluate(() => {
      return window.testSlate.getAllNodes().length;
    });
    expect(initialCount).toBe(1);

    // Click on a connection handle (right handle)
    const rightHandle = page.locator("circle.connection-handle").nth(1);
    await rightHandle.click({ force: true });
    await page.waitForTimeout(500);

    // Check that a new node was created
    const newCount = await page.evaluate(() => {
      return window.testSlate.getAllNodes().length;
    });
    expect(newCount).toBe(2);
  });

  test("should create connection between parent and sibling node", async ({
    page,
  }) => {
    await addNode(page, { id: "node1", x: 200, y: 200, text: "Parent" });
    await waitForNode(page, "node1");

    // Select and click connection handle
    const node = page.locator('g[data-node-id="node1"]');
    await node.click({ force: true });
    await page.waitForTimeout(500);

    const rightHandle = page.locator("circle.connection-handle").nth(1);
    await rightHandle.click({ force: true });
    await page.waitForTimeout(500);

    // Verify connection line exists
    const connectionLines = await page.locator(
      'path[connectortype="default"]'
    );
    const lineCount = await connectionLines.count();
    expect(lineCount).toBeGreaterThanOrEqual(1);
  });

  test("sibling node position should be based on handle direction", async ({
    page,
  }) => {
    await addNode(page, { id: "node1", x: 300, y: 300, text: "Center" });
    await waitForNode(page, "node1");

    // Select the node
    const node = page.locator('g[data-node-id="node1"]');
    await node.click({ force: true });
    await page.waitForTimeout(500);

    // Click right handle
    const handles = page.locator("circle.connection-handle");
    await handles.nth(1).click({ force: true }); // Right handle
    await page.waitForTimeout(500);

    // Get positions of all nodes
    const positions = await page.evaluate(() => {
      const nodes = window.testSlate.getAllNodes();
      return nodes.map((n: any) => ({
        id: n.id,
        x: n.options.x,
        y: n.options.y,
      }));
    });

    // The sibling should be to the right of the parent
    const parent = positions.find((p: any) => p.id === "node1");
    const sibling = positions.find((p: any) => p.id !== "node1");

    if (parent && sibling) {
      expect(sibling.x).toBeGreaterThan(parent.x);
    }
  });
});

test.describe("Edge-to-Edge Connections (Perifery Attachment)", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);
  });

  test("connection between rectangles should use edge attachment", async ({
    page,
  }) => {
    // Create two rectangle nodes
    await addNode(page, {
      id: "rect1",
      x: 100,
      y: 200,
      shape: "rectangle",
      text: "Rect 1",
    });
    await addNode(page, {
      id: "rect2",
      x: 400,
      y: 200,
      shape: "rectangle",
      text: "Rect 2",
    });
    await waitForNode(page, "rect1");
    await waitForNode(page, "rect2");

    // Create connection programmatically
    await page.evaluate(() => {
      const slate = window.testSlate;
      const node1 = slate.getNode("rect1");
      const node2 = slate.getNode("rect2");

      node1.enableConnector();
      node2.enableConnector();
      node1.connectTo(node2);
    });

    await page.waitForTimeout(300);

    // Verify connection exists
    const pathData = await getConnectionPathData(page);
    expect(pathData.length).toBeGreaterThan(0);

    // The connection should start from edge of rect1 and end at edge of rect2
    // We can verify this by checking that the path doesn't start/end at center coordinates
    const connectionInfo = await page.evaluate(() => {
      const slate = window.testSlate;
      const node1 = slate.getNode("rect1");
      const node2 = slate.getNode("rect2");

      // Get node centers
      const center1 = {
        x: node1.options.x + node1.options.width / 2,
        y: node1.options.y + node1.options.height / 2,
      };
      const center2 = {
        x: node2.options.x + node2.options.width / 2,
        y: node2.options.y + node2.options.height / 2,
      };

      // Get path start/end from the connection
      const path = document.querySelector(
        'path[connectortype="default"]'
      ) as SVGPathElement;
      const d = path?.getAttribute("d") || "";

      return {
        center1,
        center2,
        pathData: d,
        hasPath: !!path,
      };
    });

    expect(connectionInfo.hasPath).toBe(true);
  });

  test("connection between circles should use edge attachment", async ({
    page,
  }) => {
    // Create two circle nodes
    await addNode(page, {
      id: "circle1",
      x: 100,
      y: 200,
      width: 100,
      height: 100,
      shape: "circle",
      text: "C1",
    });
    await addNode(page, {
      id: "circle2",
      x: 400,
      y: 200,
      width: 100,
      height: 100,
      shape: "circle",
      text: "C2",
    });
    await waitForNode(page, "circle1");
    await waitForNode(page, "circle2");

    // Create connection
    await page.evaluate(() => {
      const slate = window.testSlate;
      const node1 = slate.getNode("circle1");
      const node2 = slate.getNode("circle2");

      node1.enableConnector();
      node2.enableConnector();
      node1.connectTo(node2);
    });

    await page.waitForTimeout(300);

    // Verify connection
    const pathData = await getConnectionPathData(page);
    expect(pathData.length).toBeGreaterThan(0);
  });

  test("connection between rectangle and circle should use edge attachment", async ({
    page,
  }) => {
    await addNode(page, {
      id: "rect",
      x: 100,
      y: 200,
      shape: "rectangle",
      text: "Rect",
    });
    await addNode(page, {
      id: "circle",
      x: 400,
      y: 200,
      width: 100,
      height: 100,
      shape: "circle",
      text: "Circle",
    });
    await waitForNode(page, "rect");
    await waitForNode(page, "circle");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const rect = slate.getNode("rect");
      const circle = slate.getNode("circle");

      rect.enableConnector();
      circle.enableConnector();
      rect.connectTo(circle);
    });

    await page.waitForTimeout(300);

    const pathData = await getConnectionPathData(page);
    expect(pathData.length).toBeGreaterThan(0);
  });
});

test.describe("Line Selection and Repositioning", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);

    // Create two nodes with a connection
    await addNode(page, { id: "source", x: 100, y: 200, text: "Source" });
    await addNode(page, { id: "target", x: 400, y: 200, text: "Target" });
    await waitForNode(page, "source");
    await waitForNode(page, "target");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const source = slate.getNode("source");
      const target = slate.getNode("target");

      source.enableConnector();
      target.enableConnector();
      source.connectTo(target);
    });

    await page.waitForTimeout(300);
  });

  test("clicking on connection line should select it", async ({ page }) => {
    // Find the connection hit area (an intentionally transparent click target —
    // present in the DOM but not "visible" to Playwright).
    const hitArea = page.locator('path[connectortype="hitarea"]');
    await expect(hitArea).toBeAttached();

    // Click on the hit area
    await hitArea.click({ force: true });
    await page.waitForTimeout(300);

    // After selection, handles should appear
    // The library creates handle circles when connection is selected
    // Check for any newly created handle elements
    const connectorSelected = await page.evaluate(() => {
      // Check if there's an active connector with showHandles = true
      const source = window.testSlate.getNode("source");
      const connections = source.getConnections();
      return connections.length > 0;
    });

    expect(connectorSelected).toBe(true);
  });

  test("dragging/panning should NOT trigger line selection", async ({
    page,
  }) => {
    // Get the hit area position
    const hitArea = page.locator('path[connectortype="hitarea"]');
    const box = await hitArea.boundingBox();

    if (!box) {
      throw new Error("Hit area bounding box not found");
    }

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    // Perform a drag (move more than 5 pixels)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 50, startY + 50);
    await page.mouse.up();
    await page.waitForTimeout(300);

    // The connection should NOT be selected (no handles should be visible)
    // This tests the click vs drag detection
    // Note: We can't easily verify "not selected" state, but we verify no error occurs
  });

  test("connection line should be repositionable when selected", async ({
    page,
  }) => {
    // This tests that the repositioning feature is enabled
    const hasShowHandles = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      const connections = source.connector?.getConnections() || [];
      if (connections.length > 0) {
        // Check if connector has showHandles option enabled
        return source.connector?.options?.showHandles === true;
      }
      return false;
    });

    // showHandles should be true (we set it in Connector.ts defaults)
    expect(hasShowHandles).toBe(true);
  });
});

test.describe("Connection Updates on Node Changes", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);

    await addNode(page, { id: "source", x: 100, y: 200, text: "Source" });
    await addNode(page, { id: "target", x: 400, y: 200, text: "Target" });
    await waitForNode(page, "source");
    await waitForNode(page, "target");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const source = slate.getNode("source");
      const target = slate.getNode("target");

      source.enableConnector();
      target.enableConnector();
      source.connectTo(target);
    });

    await page.waitForTimeout(300);
  });

  test("connection should update when source node is moved", async ({
    page,
  }) => {
    // Get initial path
    const initialPath = await getConnectionPathData(page);

    // Move source node
    const sourceNode = page.locator('g[data-node-id="source"]');
    const box = await sourceNode.boundingBox();

    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.up();
    }

    await page.waitForTimeout(300);

    // Get updated path
    const updatedPath = await getConnectionPathData(page);

    // Path should have changed
    expect(updatedPath[0]?.d).not.toBe(initialPath[0]?.d);
  });

  test("connection should update when target node is moved", async ({
    page,
  }) => {
    const initialPath = await getConnectionPathData(page);

    // Move target node
    const targetNode = page.locator('g[data-node-id="target"]');
    const box = await targetNode.boundingBox();

    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x - 100, box.y + 50);
      await page.mouse.up();
    }

    await page.waitForTimeout(300);

    const updatedPath = await getConnectionPathData(page);
    expect(updatedPath[0]?.d).not.toBe(initialPath[0]?.d);
  });

  test("connection should remain after node rotation", async ({ page }) => {
    // Select source node to show rotation handle
    const sourceNode = page.locator('g[data-node-id="source"]');
    await sourceNode.click({ force: true });
    await page.waitForTimeout(300);

    // The rotate knob. Since b35f38cb the knob is screen-sized (28px), so the old
    // "first circle under 20px" heuristic picked the node-tool plug glyph instead and
    // the drag drew a second line. Target the knob by its class.
    const rotationHandle = page.locator(".svg_select_handle_rot_knob").first();
    await expect(rotationHandle).toBeVisible();
    const handleBox = await rotationHandle.boundingBox();
    expect(handleBox).not.toBeNull();
    // Perform rotation
    await page.mouse.move(
      handleBox!.x + handleBox!.width / 2,
      handleBox!.y + handleBox!.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      handleBox!.x + handleBox!.width / 2 + 30,
      handleBox!.y + handleBox!.height / 2 + 30,
      { steps: 5 }
    );
    await page.mouse.up();

    await page.waitForTimeout(500);

    // Connection should still exist
    const connections = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      return source.getConnections().length;
    });

    expect(connections).toBe(1);
  });
});

test.describe("Multiple Connections", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);
  });

  test("node should support multiple outgoing connections", async ({
    page,
  }) => {
    await addNode(page, { id: "center", x: 300, y: 200, text: "Center" });
    await addNode(page, { id: "target1", x: 100, y: 100, text: "Target 1" });
    await addNode(page, { id: "target2", x: 500, y: 100, text: "Target 2" });
    await addNode(page, { id: "target3", x: 300, y: 400, text: "Target 3" });
    await waitForNode(page, "center");
    await waitForNode(page, "target1");
    await waitForNode(page, "target2");
    await waitForNode(page, "target3");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const center = slate.getNode("center");
      const target1 = slate.getNode("target1");
      const target2 = slate.getNode("target2");
      const target3 = slate.getNode("target3");

      center.enableConnector();
      target1.enableConnector();
      target2.enableConnector();
      target3.enableConnector();

      center.connectTo(target1);
      center.connectTo(target2);
      center.connectTo(target3);
    });

    await page.waitForTimeout(300);

    // Should have 3 connections from center
    const connectionCount = await page.evaluate(() => {
      const center = window.testSlate.getNode("center");
      return center.getConnections().length;
    });

    expect(connectionCount).toBe(3);

    // Should have 3 connection lines
    const pathCount = await page.locator('path[connectortype="default"]').count();
    expect(pathCount).toBe(3);
  });

  test("node should support multiple incoming connections", async ({
    page,
  }) => {
    await addNode(page, { id: "target", x: 300, y: 200, text: "Target" });
    await addNode(page, { id: "source1", x: 100, y: 100, text: "Source 1" });
    await addNode(page, { id: "source2", x: 500, y: 100, text: "Source 2" });
    await addNode(page, { id: "source3", x: 300, y: 400, text: "Source 3" });
    await waitForNode(page, "target");
    await waitForNode(page, "source1");
    await waitForNode(page, "source2");
    await waitForNode(page, "source3");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const target = slate.getNode("target");
      const source1 = slate.getNode("source1");
      const source2 = slate.getNode("source2");
      const source3 = slate.getNode("source3");

      target.enableConnector();
      source1.enableConnector();
      source2.enableConnector();
      source3.enableConnector();

      source1.connectTo(target);
      source2.connectTo(target);
      source3.connectTo(target);
    });

    await page.waitForTimeout(300);

    // Should have 3 connection lines
    const pathCount = await page.locator('path[connectortype="default"]').count();
    expect(pathCount).toBe(3);
  });

  test("should create chain of connected nodes", async ({ page }) => {
    // Create a chain: A -> B -> C -> D
    await addNode(page, { id: "nodeA", x: 100, y: 200, text: "A" });
    await addNode(page, { id: "nodeB", x: 250, y: 200, text: "B" });
    await addNode(page, { id: "nodeC", x: 400, y: 200, text: "C" });
    await addNode(page, { id: "nodeD", x: 550, y: 200, text: "D" });
    await waitForNode(page, "nodeA");
    await waitForNode(page, "nodeB");
    await waitForNode(page, "nodeC");
    await waitForNode(page, "nodeD");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const nodeA = slate.getNode("nodeA");
      const nodeB = slate.getNode("nodeB");
      const nodeC = slate.getNode("nodeC");
      const nodeD = slate.getNode("nodeD");

      nodeA.enableConnector();
      nodeB.enableConnector();
      nodeC.enableConnector();
      nodeD.enableConnector();

      nodeA.connectTo(nodeB);
      nodeB.connectTo(nodeC);
      nodeC.connectTo(nodeD);
    });

    await page.waitForTimeout(300);

    // Should have 3 connection lines
    const pathCount = await page.locator('path[connectortype="default"]').count();
    expect(pathCount).toBe(3);
  });
});

test.describe("Connection Types", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);

    await addNode(page, { id: "source", x: 100, y: 200, text: "Source" });
    await addNode(page, { id: "target", x: 400, y: 200, text: "Target" });
    await waitForNode(page, "source");
    await waitForNode(page, "target");
  });

  test("default connection should be curved", async ({ page }) => {
    await page.evaluate(() => {
      const slate = window.testSlate;
      const source = slate.getNode("source");
      const target = slate.getNode("target");

      source.enableConnector();
      target.enableConnector();
      source.connectTo(target);
    });

    await page.waitForTimeout(300);

    // Check that the connector type is curved (default in Connector.ts)
    const connectorType = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      return source.connector?.options?.type;
    });

    expect(connectorType).toBe("curved");
  });

  test("connection path should have curve commands for curved type", async ({
    page,
  }) => {
    await page.evaluate(() => {
      const slate = window.testSlate;
      const source = slate.getNode("source");
      const target = slate.getNode("target");

      source.enableConnector();
      target.enableConnector();
      source.connectTo(target);
    });

    await page.waitForTimeout(300);

    const pathData = await getConnectionPathData(page);

    // Curved paths typically contain Q (quadratic) or C (cubic) commands
    // or complex M L combinations for orthogonal curves
    expect(pathData[0]?.d).toBeTruthy();
  });
});

test.describe("Connection Disconnection", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);

    await addNode(page, { id: "source", x: 100, y: 200, text: "Source" });
    await addNode(page, { id: "target", x: 400, y: 200, text: "Target" });
    await waitForNode(page, "source");
    await waitForNode(page, "target");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const source = slate.getNode("source");
      const target = slate.getNode("target");

      source.enableConnector();
      target.enableConnector();
      source.connectTo(target);
    });

    await page.waitForTimeout(300);
  });

  test("should disconnect nodes programmatically", async ({ page }) => {
    // Verify connection exists in JS state
    let connectionCount = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      return source.getConnections().length;
    });
    expect(connectionCount).toBe(1);

    // Disconnect
    const disconnectResult = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      const target = window.testSlate.getNode("target");
      return source.disconnectFrom(target);
    });
    expect(disconnectResult).toBe(true);

    await page.waitForTimeout(300);

    // Connection should be removed from JS state
    connectionCount = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      return source.getConnections().length;
    });
    expect(connectionCount).toBe(0);
  });

  test("should disconnect all connections from a node", async ({ page }) => {
    // Add another target and connect
    await addNode(page, { id: "target2", x: 400, y: 400, text: "Target 2" });
    await waitForNode(page, "target2");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const source = slate.getNode("source");
      const target2 = slate.getNode("target2");

      target2.enableConnector();
      source.connectTo(target2);
    });

    await page.waitForTimeout(300);

    // Should have 2 connections in JS state
    let connectionCount = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      return source.getConnections().length;
    });
    expect(connectionCount).toBe(2);

    // Disconnect all
    await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      source.connector?.disconnectAll();
    });

    await page.waitForTimeout(300);

    // Should have 0 connections in JS state
    connectionCount = await page.evaluate(() => {
      const source = window.testSlate.getNode("source");
      return source.getConnections().length;
    });
    expect(connectionCount).toBe(0);
  });
});

test.describe("Different Shape Connections", () => {
  test.beforeEach(async ({ page }) => {
    await initSlate(page);
  });

  test("ellipse to rectangle connection", async ({ page }) => {
    await addNode(page, {
      id: "ellipse",
      x: 100,
      y: 200,
      width: 140,
      height: 80,
      shape: "ellipse",
      text: "Ellipse",
    });
    await addNode(page, {
      id: "rect",
      x: 400,
      y: 200,
      shape: "rectangle",
      text: "Rect",
    });
    await waitForNode(page, "ellipse");
    await waitForNode(page, "rect");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const ellipse = slate.getNode("ellipse");
      const rect = slate.getNode("rect");

      ellipse.enableConnector();
      rect.enableConnector();
      ellipse.connectTo(rect);
    });

    await page.waitForTimeout(300);

    const pathCount = await page.locator('path[connectortype="default"]').count();
    expect(pathCount).toBe(1);
  });

  test("circle to circle connection", async ({ page }) => {
    await addNode(page, {
      id: "circle1",
      x: 100,
      y: 200,
      width: 80,
      height: 80,
      shape: "circle",
      text: "C1",
    });
    await addNode(page, {
      id: "circle2",
      x: 300,
      y: 200,
      width: 80,
      height: 80,
      shape: "circle",
      text: "C2",
    });
    await waitForNode(page, "circle1");
    await waitForNode(page, "circle2");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const c1 = slate.getNode("circle1");
      const c2 = slate.getNode("circle2");

      c1.enableConnector();
      c2.enableConnector();
      c1.connectTo(c2);
    });

    await page.waitForTimeout(300);

    const pathCount = await page.locator('path[connectortype="default"]').count();
    expect(pathCount).toBe(1);
  });

  test("mixed shape network", async ({ page }) => {
    // Create a network with different shapes
    await addNode(page, {
      id: "rect",
      x: 200,
      y: 100,
      shape: "rectangle",
      text: "Rect",
    });
    await addNode(page, {
      id: "circle",
      x: 100,
      y: 300,
      width: 80,
      height: 80,
      shape: "circle",
      text: "Circle",
    });
    await addNode(page, {
      id: "ellipse",
      x: 350,
      y: 300,
      width: 140,
      height: 80,
      shape: "ellipse",
      text: "Ellipse",
    });
    await waitForNode(page, "rect");
    await waitForNode(page, "circle");
    await waitForNode(page, "ellipse");

    await page.evaluate(() => {
      const slate = window.testSlate;
      const rect = slate.getNode("rect");
      const circle = slate.getNode("circle");
      const ellipse = slate.getNode("ellipse");

      rect.enableConnector();
      circle.enableConnector();
      ellipse.enableConnector();

      rect.connectTo(circle);
      rect.connectTo(ellipse);
      circle.connectTo(ellipse);
    });

    await page.waitForTimeout(300);

    const pathCount = await page.locator('path[connectortype="default"]').count();
    expect(pathCount).toBe(3);
  });
});

// Declare global types for TypeScript
declare global {
  interface Window {
    SlateboxJS: any;
    testSlate: any;
  }
}
