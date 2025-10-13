import { test, expect } from "@playwright/test";

test.describe("Node Connectors", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => window.SlateboxJS);

    // Create test nodes for connection testing
    await page.evaluate(() => {
      const slate = window.SlateboxJS("#app");
      window.testSlate = slate;

      // Add source node
      slate.addNode({
        id: "source",
        x: 100,
        y: 100,
        width: 120,
        height: 80,
        text: "Source",
        backgroundColor: "#e8f4fd",
      });

      // Add target node
      slate.addNode({
        id: "target",
        x: 300,
        y: 200,
        width: 120,
        height: 80,
        text: "Target",
        backgroundColor: "#fff2e8",
      });
    });
  });

  test("should enable connector on node", async ({ page }) => {
    // Enable connector on source node
    const connectorEnabled = await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      sourceNode.enableConnector();
      return sourceNode.isConnectorEnabled();
    });

    expect(connectorEnabled).toBe(true);
  });

  test("should create connection between nodes", async ({ page }) => {
    // Enable connectors and create connection
    const connectionResult = await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      const targetNode = slate.getNode("target");

      // Enable connectors
      sourceNode.enableConnector();
      targetNode.enableConnector();

      // Create connection
      const connection = sourceNode.connectTo(targetNode);

      return {
        connectionExists: !!connection,
        connectionId: connection?.id,
        sourceConnections: sourceNode.getConnections().length,
      };
    });

    expect(connectionResult.connectionExists).toBe(true);
    expect(connectionResult.connectionId).toBe("source->target");
    expect(connectionResult.sourceConnections).toBe(1);
  });

  test("should render connection line visually", async ({ page }) => {
    // Create connection
    await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      const targetNode = slate.getNode("target");

      sourceNode.enableConnector();
      targetNode.enableConnector();
      sourceNode.connectTo(targetNode);
    });

    // Wait for connection line to appear in DOM
    await page.waitForSelector("line, path", { timeout: 2000 });

    // Verify connection line exists
    const connectionLine = page.locator("line, path").first();
    await expect(connectionLine).toBeVisible();
  });

  test("should disconnect nodes", async ({ page }) => {
    // Create and then remove connection
    const disconnectionResult = await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      const targetNode = slate.getNode("target");

      // Enable and connect
      sourceNode.enableConnector();
      targetNode.enableConnector();
      const connection = sourceNode.connectTo(targetNode);

      // Verify connection exists
      const beforeDisconnect = sourceNode.getConnections().length;

      // Disconnect
      const disconnected = sourceNode.disconnectFrom(targetNode);
      const afterDisconnect = sourceNode.getConnections().length;

      return {
        beforeDisconnect,
        afterDisconnect,
        disconnected,
      };
    });

    expect(disconnectionResult.beforeDisconnect).toBe(1);
    expect(disconnectionResult.afterDisconnect).toBe(0);
    expect(disconnectionResult.disconnected).toBe(true);
  });

  test("should handle connector drag interactions", async ({ page }) => {
    // Enable connectors
    await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      sourceNode.enableConnector();
    });

    // This test would be more complex - testing actual drag-to-connect behavior
    // For now, just verify that connector-enabled nodes don't interfere with drag
    await page
      .locator('g[data-node-id="source"]')
      .dragTo(page.locator("svg"), { targetPosition: { x: 150, y: 150 } });

    // Verify node moved despite having connector enabled
    const nodePosition = await page.evaluate(() => {
      const slate = window.testSlate;
      const node = slate.getNode("source");
      return { x: node.options.x, y: node.options.y };
    });

    // Position should have changed from original (100, 100)
    expect(nodePosition.x).not.toBe(100);
    expect(nodePosition.y).not.toBe(100);
  });

  test("should maintain connections during node movement", async ({ page }) => {
    // Create connection
    await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      const targetNode = slate.getNode("target");

      sourceNode.enableConnector();
      targetNode.enableConnector();
      sourceNode.connectTo(targetNode);
    });

    // Move source node
    await page
      .locator('g[data-node-id="source"]')
      .dragTo(page.locator("svg"), { targetPosition: { x: 50, y: 150 } });

    // Verify connection still exists
    const connectionExists = await page.evaluate(() => {
      const slate = window.testSlate;
      const sourceNode = slate.getNode("source");
      return sourceNode.getConnections().length > 0;
    });

    expect(connectionExists).toBe(true);

    // Verify connection line updated position (should still be visible)
    const connectionLine = page.locator("line, path").first();
    await expect(connectionLine).toBeVisible();
  });
});
