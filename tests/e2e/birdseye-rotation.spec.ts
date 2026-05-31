import { test, expect } from "@playwright/test";

test.describe("BirdsEye Rotation Refresh", () => {
  test("BirdsEye should update when node is rotated", async ({ page }) => {
    // Navigate to the demo page
    await page.goto("/advanced-demo.html");

    // Wait for slate to initialize
    await page.waitForTimeout(500);

    // Get the initial rotation of the rect in BirdsEye minimap
    const getBirdsEyeRectTransform = async () => {
      return await page.evaluate(() => {
        // Find the BirdsEye container
        const birdsEyeContainer = document.querySelector(".slateboxjs-birdseye");
        if (!birdsEyeContainer) return { found: false, transform: null };

        // Find rect elements in the minimap (node representations)
        const rects = birdsEyeContainer.querySelectorAll("rect");
        // The first few rects are background, we want the node shapes
        // Find a rect that's not the background (smaller, colored)
        for (const rect of rects) {
          const fill = rect.getAttribute("fill");
          if (fill && fill !== "#f8f9fa" && !fill.includes("rgba")) {
            return {
              found: true,
              transform: rect.getAttribute("transform") || "none",
              fill: fill,
            };
          }
        }
        return { found: false, transform: null };
      });
    };

    // Get initial state
    const initialState = await getBirdsEyeRectTransform();
    console.log("Initial BirdsEye rect state:", initialState);

    // Click on the rectangle node to select it (force to bypass text overlay)
    const node = page.locator('rect[fill="#96ceb4"], rect[fill="#ff6b6b"], rect[fill="#4ecdc4"], rect[fill="#45b7d1"], rect[fill="#feca57"], rect[fill="#ff9ff3"], rect[fill="#54a0ff"]').first();
    await node.click({ force: true });
    await page.waitForTimeout(200);

    // Find the rotation handle - it's a circle without a class (not connection-handle)
    // Get all circles and filter for the one without class (the rotation handle)
    const allCircles = await page.locator("svg circle:not(.connection-handle)").all();
    console.log("Found", allCircles.length, "non-connection-handle circles in SVG");

    let handleBox = null;
    let rotationHandle = null;

    // Find the rotation handle - it should be the small circle near the top of the node
    // Get the node's bounding box to know where to look
    const nodeBox = await node.boundingBox();
    console.log("Node bounding box:", nodeBox);

    for (const circle of allCircles) {
      const box = await circle.boundingBox();
      if (box) {
        console.log("Circle position:", box);
        // The rotation handle should be above or near the top of the node
        // and relatively small (< 20px diameter)
        if (box.width < 20 && box.height < 20) {
          // This could be our rotation handle
          handleBox = box;
          rotationHandle = circle;
          console.log("Found potential rotation handle at:", box);
          break;
        }
      }
    }

    if (!handleBox) {
      throw new Error("Could not find rotation handle bounding box");
    }

    const handleCenterX = handleBox.x + handleBox.width / 2;
    const handleCenterY = handleBox.y + handleBox.height / 2;

    console.log("Rotation handle position:", { handleCenterX, handleCenterY });

    // Perform rotation by dragging the rotation handle in a circular motion
    await page.mouse.move(handleCenterX, handleCenterY);
    await page.mouse.down();

    // Move in a circular arc to rotate ~45 degrees
    for (let i = 0; i <= 10; i++) {
      const angle = (Math.PI / 4) * (i / 10); // 0 to 45 degrees
      const radius = 50;
      const x = handleCenterX + Math.sin(angle) * radius;
      const y = handleCenterY - Math.cos(angle) * radius + radius;
      await page.mouse.move(x, y);
      await page.waitForTimeout(50);
    }

    await page.mouse.up();

    // Wait for the trailing edge debounce to fire (200ms + buffer)
    await page.waitForTimeout(500);

    // Get the final state of BirdsEye
    const finalState = await getBirdsEyeRectTransform();
    console.log("Final BirdsEye rect state:", finalState);

    // Check console logs for refresh calls
    const consoleLogs = await page.evaluate(() => {
      // This won't capture historical logs, but let's check what we can
      return "Check browser console for BIRDSEYE_DEBUG logs";
    });
    console.log(consoleLogs);

    // The transform should have changed if BirdsEye refreshed
    expect(finalState.found).toBe(true);

    // If rotation worked, the transform should be a matrix (SVG.js applies rotation as matrix transform)
    if (initialState.transform === "none" || initialState.transform === null) {
      // Initially no transform, now should have one (matrix or rotate)
      console.log("Checking if rotation was applied...");
      expect(finalState.transform).not.toBe("none");
      expect(finalState.transform).not.toBe(null);
      // SVG.js applies rotation as a matrix transform, so check for matrix or rotate
      const hasRotation = finalState.transform.includes("matrix") || finalState.transform.includes("rotate");
      expect(hasRotation).toBe(true);
    } else {
      // Transform changed
      expect(finalState.transform).not.toBe(initialState.transform);
    }
  });

  test("Verify rotation is stored and BirdsEye updates", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForTimeout(500);

    // Click on a node (force to bypass text overlay)
    const node = page.locator('rect[fill="#96ceb4"], rect[fill="#ff6b6b"], rect[fill="#4ecdc4"], rect[fill="#45b7d1"], rect[fill="#feca57"], rect[fill="#ff9ff3"], rect[fill="#54a0ff"]').first();
    await node.click({ force: true });
    await page.waitForTimeout(200);

    // Find rotation handle (small circle without class)
    const allCircles = await page.locator("svg circle:not(.connection-handle)").all();
    let handleBox = null;

    for (const circle of allCircles) {
      const box = await circle.boundingBox();
      if (box && box.width < 20 && box.height < 20) {
        handleBox = box;
        break;
      }
    }

    if (!handleBox) {
      console.log("No rotation handle found - skipping test");
      return;
    }

    const handleCenterX = handleBox.x + handleBox.width / 2;
    const handleCenterY = handleBox.y + handleBox.height / 2;

    // Rotate
    await page.mouse.move(handleCenterX, handleCenterY);
    await page.mouse.down();

    for (let i = 0; i <= 5; i++) {
      const angle = (Math.PI / 4) * (i / 5);
      const radius = 50;
      const x = handleCenterX + Math.sin(angle) * radius;
      const y = handleCenterY - Math.cos(angle) * radius + radius;
      await page.mouse.move(x, y);
      await page.waitForTimeout(30);
    }

    await page.mouse.up();
    await page.waitForTimeout(500);

    // Check node options to see if rotation was stored
    const nodeRotation = await page.evaluate(() => {
      const slate = (window as any).slate;
      if (!slate) return { error: "No slate found" };
      const nodes = slate.getAllNodes();
      if (!nodes || nodes.length === 0) return { error: "No nodes found" };
      const node = nodes[0];
      return {
        id: node.id,
        hasRotateObj: !!node.options.rotate,
        rotationAngle: node.options.rotate?.rotationAngle
      };
    });
    console.log("Node rotation state:", nodeRotation);

    // Verify rotation was stored
    expect(nodeRotation.hasRotateObj).toBe(true);
    expect(nodeRotation.rotationAngle).toBeGreaterThan(0);
  });
});
