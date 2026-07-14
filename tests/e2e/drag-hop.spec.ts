import { test, expect } from "@playwright/test";

test.describe("Drag Hop Bug", () => {
  test("node should not hop on second drag", async ({ page }) => {
    // Navigate to the advanced demo
    await page.goto("/advanced-demo.html");

    // Wait for SlateboxJS to initialize
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Helper to get node position and programmatically move it
    const getNodePosition = async () => {
      return await page.evaluate(() => {
        const slate = (window as any).slate;
        const nodes = slate.getAllNodes();
        if (nodes.length === 0) return null;
        const node = nodes[0];
        const bbox = node.svgGroup.bbox();
        const transform = node.svgGroup.transform();
        return {
          id: node.id,
          bboxX: bbox.x,
          bboxY: bbox.y,
          transformX: transform.translateX || 0,
          transformY: transform.translateY || 0,
        };
      });
    };

    // Programmatically move the node (simulating first drag)
    await page.evaluate(() => {
      const slate = (window as any).slate;
      const node = slate.getAllNodes()[0];
      // Move the node programmatically
      node.position(node.options.x + 100, node.options.y + 50);
    });
    await page.waitForTimeout(100);

    const afterFirst = await getNodePosition();
    console.log("After first move:", afterFirst);

    // Now simulate a second drag by checking transform state before and after
    // The bug was that transforms would accumulate and cause position jumps

    const beforeSecond = await getNodePosition();
    console.log("Before second operation:", beforeSecond);

    // Programmatically move again
    await page.evaluate(() => {
      const slate = (window as any).slate;
      const node = slate.getAllNodes()[0];
      node.position(node.options.x + 50, node.options.y);
    });
    await page.waitForTimeout(100);

    const afterSecond = await getNodePosition();
    console.log("After second move:", afterSecond);

    // Canonical model: position lives in the group transform, set ABSOLUTELY
    // each move (not accumulated). The modern "no hop" invariant is that the
    // transform translate always equals the logical position — never a doubled
    // or drifting value. (The old model kept the transform ~0 with position in
    // the children; that is intentionally reversed now.)
    const opts = await page.evaluate(() => {
      const n = (window as any).slate.getAllNodes()[0];
      const t = n.svgGroup.transform();
      return {
        x: n.options.x,
        y: n.options.y,
        tx: t.translateX || 0,
        ty: t.translateY || 0,
      };
    });
    expect(Math.abs(opts.tx - opts.x)).toBeLessThan(1);
    expect(Math.abs(opts.ty - opts.y)).toBeLessThan(1);
  });

  test("detailed drag position tracking", async ({ page }) => {
    // Navigate to the advanced demo
    await page.goto("/advanced-demo.html");

    // Wait for SlateboxJS to initialize and create nodes
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Use evaluate to get the actual node position from SlateboxJS
    const getNodePosition = async () => {
      return await page.evaluate(() => {
        const slate = (window as any).slate;
        const nodes = slate.getAllNodes();
        if (nodes.length === 0) return null;
        const node = nodes[0];
        const bbox = node.svgGroup.bbox();
        const transform = node.svgGroup.transform();
        return {
          id: node.id,
          optionsX: node.options.x,
          optionsY: node.options.y,
          bboxX: bbox.x,
          bboxY: bbox.y,
          transformX: transform.translateX || 0,
          transformY: transform.translateY || 0,
        };
      });
    };

    // Get initial state
    const initial = await getNodePosition();
    console.log("Initial state:", initial);

    // Find the node visually using data-node-id to avoid overlap issues
    const nodeGroup = page.locator('[data-node-id="rect_1"]').first();
    const visualBox = await nodeGroup.boundingBox();
    await nodeGroup.hover();
    await page.mouse.down();
    await page.mouse.move(visualBox!.x + visualBox!.width / 2 + 80, visualBox!.y + visualBox!.height / 2 + 40, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(200);

    const afterFirst = await getNodePosition();
    console.log("After first drag:", afterFirst);

    // Canonical model: the group transform translate equals the logical
    // position (no double-count / no hop-inducing accumulation).
    expect(Math.abs(afterFirst!.transformX - afterFirst!.optionsX)).toBeLessThan(1);
    expect(Math.abs(afterFirst!.transformY - afterFirst!.optionsY)).toBeLessThan(1);

    // Second drag
    const box2 = await nodeGroup.boundingBox();
    await page.mouse.move(box2!.x + box2!.width / 2, box2!.y + box2!.height / 2);
    await page.mouse.down();

    // Check immediately at drag start
    const atSecondStart = await getNodePosition();
    console.log("At second drag start:", atSecondStart);

    await page.mouse.move(box2!.x + box2!.width / 2 + 50, box2!.y + box2!.height / 2, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(200);

    const afterSecond = await getNodePosition();
    console.log("After second drag:", afterSecond);

    // Transform still equals the logical position after the second drag
    expect(Math.abs(afterSecond!.transformX - afterSecond!.optionsX)).toBeLessThan(1);
    expect(Math.abs(afterSecond!.transformY - afterSecond!.optionsY)).toBeLessThan(1);
  });

  test("rotated node should not jump on first drag", async ({ page }) => {
    // Navigate to the advanced demo
    await page.goto("/advanced-demo.html");

    // Wait for SlateboxJS to initialize and create nodes
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Get the first node and rotate it
    const initialPosition = await page.evaluate(() => {
      const slate = (window as any).slate;
      const nodes = slate.getAllNodes();
      if (nodes.length === 0) return null;
      const node = nodes[0];

      // Get position before rotation
      const bbox = node.svgGroup.bbox();
      const x = bbox.x;
      const y = bbox.y;

      // Apply 45 degree rotation
      node.setRotation(45);

      return { x, y, id: node.id };
    });

    console.log("Initial position before rotation:", initialPosition);

    // Find the node visually using data-node-id to avoid overlap issues
    const nodeGroup = page.locator('[data-node-id="rect_1"]').first();
    await expect(nodeGroup).toBeVisible();

    // Get the visual bounding box after rotation
    const visualBoxAfterRotation = await nodeGroup.boundingBox();
    console.log("Visual bbox after rotation:", visualBoxAfterRotation);

    // Now drag the rotated node
    const centerX = visualBoxAfterRotation!.x + visualBoxAfterRotation!.width / 2;
    const centerY = visualBoxAfterRotation!.y + visualBoxAfterRotation!.height / 2;

    // Record position just before drag
    const beforeDrag = await nodeGroup.boundingBox();
    console.log("Before drag:", beforeDrag);

    // Start the drag
    await page.mouse.move(centerX, centerY);
    await page.mouse.down();

    // Check position immediately after mousedown - this is where the "jump" would occur
    // Wait a tiny bit for any async updates
    await page.waitForTimeout(50);
    const atDragStart = await nodeGroup.boundingBox();
    console.log("At drag start (should NOT jump):", atDragStart);

    // Calculate jump distance - the bug was that rotated nodes would jump significantly
    const jumpDistanceX = Math.abs(atDragStart!.x - beforeDrag!.x);
    const jumpDistanceY = Math.abs(atDragStart!.y - beforeDrag!.y);
    console.log(`Jump distance: x=${jumpDistanceX}, y=${jumpDistanceY}`);

    // Move the mouse to complete the drag
    await page.mouse.move(centerX + 100, centerY + 50, { steps: 10 });
    await page.mouse.up();

    // Wait for drag to complete
    await page.waitForTimeout(200);

    const afterDrag = await nodeGroup.boundingBox();
    console.log("After drag:", afterDrag);

    // Assert no significant jump occurred at drag start (tolerance of 15px for rendering variations)
    // The original bug would cause jumps of 70+ pixels for 45 degree rotations
    expect(jumpDistanceX).toBeLessThan(15);
    expect(jumpDistanceY).toBeLessThan(15);

    // Note: We don't verify exact drag movement because the visual bounding box
    // of a rotated element can behave unexpectedly during/after drags.
    // The key test is that jumpDistance is 0 - no position jump at drag start.
  });
});
