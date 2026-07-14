import { test, expect } from "@playwright/test";

test.describe("Rotation Preview Bug", () => {
  test("getRotation should return correct value after manual rotation", async ({ page }) => {
    // This tests the fix: getRotation() should return the correct rotation
    // after manual rotation via UI (which applies rotation to backgroundRect)

    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const slate = (window as any).slate;
      const node = slate.getAllNodes()[0];

      // Initial state
      const initial = {
        rotation: node.getRotation(),
        optionsRotation: node.options.rotate?.rotationAngle || 0
      };

      // Simulate what svg.resize.js does during manual rotation:
      // It applies rotation transform to backgroundRect
      // Then handleResize reads backgroundRect.transform().rotate to get cumulative rotation
      const manualRotationAngle = 30;
      const bbox = node.backgroundRect.bbox();
      node.backgroundRect.rotate(manualRotationAngle, bbox.cx, bbox.cy);

      // Now simulate what handleResize does: read the rotation and update options
      const backgroundRectRotation = node.backgroundRect.transform()?.rotate || 0;
      const svgGroupRotation = node.svgGroup.transform()?.rotate || 0;
      const totalRotation = svgGroupRotation + backgroundRectRotation;
      node.options.rotate.rotationAngle = totalRotation;

      const afterManualRotation = {
        rotation: node.getRotation(),
        optionsRotation: node.options.rotate?.rotationAngle || 0,
        svgGroupRotation: svgGroupRotation,
        backgroundRectRotation: backgroundRectRotation
      };

      return {
        initial,
        afterManualRotation,
        manualRotationAngle
      };
    });

    console.log("Manual rotation test:", JSON.stringify(result, null, 2));

    // Initial state: 0 rotation
    expect(result.initial.rotation).toBe(0);

    // After manual rotation: getRotation() should return the rotation angle
    // Use toBeCloseTo for floating point comparison
    expect(result.afterManualRotation.rotation).toBeCloseTo(result.manualRotationAngle, 5);
    expect(result.afterManualRotation.optionsRotation).toBeCloseTo(result.manualRotationAngle, 5);
    expect(result.afterManualRotation.backgroundRectRotation).toBeCloseTo(result.manualRotationAngle, 5);
  });

  test("getRotation should return combined rotation for duplicated+manually rotated node", async ({ page }) => {
    // This tests the scenario: node is duplicated (with rotation), then manually rotated more

    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    const result = await page.evaluate(() => {
      const slate = (window as any).slate;
      const node = slate.getAllNodes()[0];

      // Step 1: Apply rotation via setRotation (simulates duplicated node creation)
      // This puts rotation on svgGroup
      node.setRotation(45);
      const afterSetRotation = {
        rotation: node.getRotation(),
        svgGroupRotation: node.svgGroup.transform()?.rotate || 0
      };

      // Step 2: Simulate manual rotation on top of existing rotation
      // svg.resize.js applies rotation to backgroundRect (starting from 0)
      const additionalRotation = 30;
      const bbox = node.backgroundRect.bbox();
      node.backgroundRect.rotate(additionalRotation, bbox.cx, bbox.cy);

      // handleResize reads both rotations and combines them
      const backgroundRectRotation = node.backgroundRect.transform()?.rotate || 0;
      const svgGroupRotation = node.svgGroup.transform()?.rotate || 0;
      const totalRotation = svgGroupRotation + backgroundRectRotation;
      node.options.rotate.rotationAngle = totalRotation;

      const afterCombinedRotation = {
        rotation: node.getRotation(),
        optionsRotation: node.options.rotate?.rotationAngle || 0,
        svgGroupRotation: svgGroupRotation,
        backgroundRectRotation: backgroundRectRotation
      };

      return {
        afterSetRotation,
        afterCombinedRotation,
        expectedTotal: 45 + additionalRotation
      };
    });

    console.log("Combined rotation test:", JSON.stringify(result, null, 2));

    // After setRotation(45): rotation should be 45
    expect(result.afterSetRotation.rotation).toBe(45);
    expect(result.afterSetRotation.svgGroupRotation).toBe(45);

    // After combined rotation: getRotation() should return 75 (45 + 30)
    // Use toBeCloseTo for floating point comparison on backgroundRectRotation
    expect(result.afterCombinedRotation.rotation).toBe(result.expectedTotal);
    expect(result.afterCombinedRotation.optionsRotation).toBe(result.expectedTotal);
    expect(result.afterCombinedRotation.svgGroupRotation).toBe(45); // Still has original
    expect(result.afterCombinedRotation.backgroundRectRotation).toBeCloseTo(30, 5); // Has additional
  });

  test("programmatic rotation update should be reflected in getRotation", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Test that directly updating options.rotate.rotationAngle is reflected in getRotation
    const result = await page.evaluate(() => {
      const slate = (window as any).slate;
      const node = slate.getAllNodes()[0];

      // Start with clean state
      const initial = node.getRotation();

      // Set rotation via setRotation (applies to svgGroup)
      node.setRotation(30);
      const afterSetRotation = node.getRotation();

      // Directly update options (simulating what handleResize does)
      node.options.rotate.rotationAngle = 60;
      const afterOptionsUpdate = node.getRotation();

      return {
        initial,
        afterSetRotation,
        afterOptionsUpdate
      };
    });

    console.log("Programmatic rotation test:", result);

    expect(result.initial).toBe(0);
    expect(result.afterSetRotation).toBe(30);
    // After updating options directly, getRotation should return the new value
    // because options.rotate.rotationAngle has priority
    expect(result.afterOptionsUpdate).toBe(60);
  });
});
