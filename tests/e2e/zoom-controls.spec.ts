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

    // Fit-to-content (⤢), zoom out (-), slider, zoom in (+), and label
    const buttons = await zoomSlider.locator("button");
    await expect(buttons).toHaveCount(3); // fit, -, +

    const slider = await zoomSlider.locator('input[type="range"]');
    await expect(slider).toBeVisible();

    // The fit-to-content button is present.
    await expect(
      zoomSlider.locator('[aria-label="fitToContent"]')
    ).toBeVisible();
  });

  test("should zoom in when clicking + button", async ({ page }) => {
    // Get initial zoom level
    const initialZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });

    // Click zoom in button (the + button) — select by text so it's robust to
    // button order (a fit button was added as the first control).
    const zoomInBtn = page.locator(".slatebox-zoom-slider button", {
      hasText: "+",
    });
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

    // Click zoom out button (the - button) — select by text so it's robust to
    // button order (a fit button was added as the first control).
    const zoomOutBtn = page.locator(".slatebox-zoom-slider button", {
      hasText: "-",
    });
    await zoomOutBtn.click();
    await page.waitForTimeout(300);

    // Check zoom level decreased
    const newZoom = await page.evaluate(() => {
      return (window as any).currentSlate.panZoom.getZoom();
    });

    expect(newZoom).toBeLessThan(initialZoom);
  });

  test("fit-to-content button returns zoomed-in content to a fit view", async ({
    page,
  }) => {
    // Zoom in so the slate is no longer at 1:1.
    await page.evaluate(() => {
      (window as any).currentSlate.zoom(3);
    });
    await page.waitForTimeout(200);
    const zoomedIn = await page.evaluate(() =>
      (window as any).currentSlate.panZoom.getZoom()
    );
    expect(zoomedIn).toBeGreaterThan(1.5);

    // Click the fit button → zoom should change (fit recomputes zoom to frame
    // all content).
    await page
      .locator('.slatebox-zoom-slider [aria-label="fitToContent"]')
      .click();
    await page.waitForTimeout(400);

    const afterFit = await page.evaluate(() =>
      (window as any).currentSlate.panZoom.getZoom()
    );
    expect(afterFit).toBeLessThan(zoomedIn);
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
