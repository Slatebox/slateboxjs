import { test, expect } from "@playwright/test";

test.describe("Zoom Functionality", () => {
  test("zoom with ctrl+wheel should work", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Get initial zoom level
    const initialZoom = await page.evaluate(() => {
      const slate = (window as any).slate;
      return slate.panZoom?.getZoom() || 1;
    });

    // Simulate Ctrl+wheel to zoom in - dispatch to SVG element
    await page.evaluate(() => {
      const svg = document.querySelector("#slate svg");
      if (svg) {
        const event = new WheelEvent("wheel", {
          deltaY: -100,
          ctrlKey: true,
          clientX: 600,
          clientY: 350,
          bubbles: true,
          cancelable: true,
        });
        svg.dispatchEvent(event);
      }
    });

    await page.waitForTimeout(200);

    // Get zoom after
    const zoomAfter = await page.evaluate(() => {
      const slate = (window as any).slate;
      return slate.panZoom?.getZoom() || 1;
    });

    // Zoom should have increased
    expect(zoomAfter).toBeGreaterThan(initialZoom);
  });

  test("panning with wheel should change viewbox position", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Get initial pan position
    const initialPan = await page.evaluate(() => {
      const slate = (window as any).slate;
      return slate.panZoom?.getPan() || { x: 0, y: 0 };
    });

    // Simulate regular wheel to pan (no modifier keys)
    await page.evaluate(() => {
      const svg = document.querySelector("#slate svg");
      if (svg) {
        const event = new WheelEvent("wheel", {
          deltaY: 100,
          deltaX: 50,
          ctrlKey: false,
          clientX: 600,
          clientY: 350,
          bubbles: true,
          cancelable: true,
        });
        svg.dispatchEvent(event);
      }
    });

    await page.waitForTimeout(200);

    // Get pan position after
    const panAfter = await page.evaluate(() => {
      const slate = (window as any).slate;
      return slate.panZoom?.getPan() || { x: 0, y: 0 };
    });

    // Pan position should have changed
    expect(panAfter.x !== initialPan.x || panAfter.y !== initialPan.y).toBe(true);
  });

  test("panZoom should be properly initialized", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Check if panZoom is initialized
    const panZoomStatus = await page.evaluate(() => {
      const slate = (window as any).slate;
      return {
        panZoomExists: !!slate.panZoom,
        isInitialized: slate.panZoom?.isInitialized?.() ?? false,
        canvasExists: !!slate.canvas,
        canvasHasPanZoom: typeof slate.canvas?.panZoom === "function",
      };
    });

    expect(panZoomStatus.panZoomExists).toBe(true);
    expect(panZoomStatus.isInitialized).toBe(true);
    expect(panZoomStatus.canvasHasPanZoom).toBe(true);
  });
});
