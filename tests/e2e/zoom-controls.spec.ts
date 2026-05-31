import { test, expect } from "@playwright/test";

test.describe("Zoom Controls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => window.SlateboxJS);

    // Create a slate with zoom controls enabled
    await page.evaluate(async () => {
      const slate = window.SlateboxJS("#app", {
        showZoom: true,
        viewPort: {
          allowZoom: true,
          allowPan: true,
        },
      });

      // Add a test node so there's content
      const node = slate.addNode({
        id: "test",
        x: 200,
        y: 200,
        width: 120,
        height: 80,
        text: "Test",
        backgroundColor: "#eee",
      });

      await node.ready;
    });

    await page.waitForTimeout(300);
  });

  test("should display zoom slider control", async ({ page }) => {
    // Check if zoom slider container exists
    const zoomSlider = await page.locator(".slatebox-zoom-slider");
    await expect(zoomSlider).toBeVisible();

    // Should have zoom out (-), slider, zoom in (+), and label
    const buttons = await zoomSlider.locator("button");
    await expect(buttons).toHaveCount(2); // - and +

    const slider = await zoomSlider.locator('input[type="range"]');
    await expect(slider).toBeVisible();
  });

  test("should zoom in when clicking + button", async ({ page }) => {
    // Get initial zoom level
    const initialZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });

    // Click zoom in button (the + button, second button in slider)
    const zoomInBtn = await page.locator(".slatebox-zoom-slider button").nth(1);
    await zoomInBtn.click();
    await page.waitForTimeout(300);

    // Check zoom level increased
    const newZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });

    expect(newZoom).toBeGreaterThan(initialZoom);
  });

  test("should zoom out when clicking - button", async ({ page }) => {
    // Get initial zoom level
    const initialZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });

    // Click zoom out button (the - button, first button in slider)
    const zoomOutBtn = await page.locator(".slatebox-zoom-slider button").first();
    await zoomOutBtn.click();
    await page.waitForTimeout(300);

    // Check zoom level decreased
    const newZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });

    expect(newZoom).toBeLessThan(initialZoom);
  });

  test("should support programmatic zoom", async ({ page }) => {
    // Zoom in programmatically
    await page.evaluate(() => {
      (window as any).currentSlate.zoom(2);
    });
    await page.waitForTimeout(200);

    const zoomedLevel = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });
    expect(zoomedLevel).toBeGreaterThan(1.5);

    // Reset zoom
    await page.evaluate(() => {
      (window as any).currentSlate.zoom(1);
    });
    await page.waitForTimeout(200);

    const resetZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });
    expect(resetZoom).toBeCloseTo(1, 1);
  });
});
