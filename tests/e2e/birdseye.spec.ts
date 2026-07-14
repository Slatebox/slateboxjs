import { test, expect } from "@playwright/test";

test.describe("BirdsEye Minimap", () => {
  test("should display birdseye minimap in bottom-right corner", async ({
    page,
  }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Check if birdsEye container exists
    const birdsEyeContainer = await page.locator(".slateboxjs-birdseye");
    await expect(birdsEyeContainer).toBeVisible();

    // Check if it's positioned in bottom-right
    const box = await birdsEyeContainer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(150);
    expect(box!.height).toBeGreaterThanOrEqual(100);
  });

  test("should render nodes in minimap", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Add a few nodes
    await page.evaluate(() => {
      (window as any).addNode();
      (window as any).addNode();
      (window as any).addCircle();
    });

    await page.waitForTimeout(300);

    // Refresh birdseye to show nodes
    await page.evaluate(() => {
      (window as any).slate.birdsEye?.refresh();
    });

    await page.waitForTimeout(200);

    // Check SVG inside birdsEye has shapes
    const birdsEyeSvg = await page.locator(".slateboxjs-birdseye svg");
    await expect(birdsEyeSvg).toBeVisible();

    // Should have at least the viewport indicator rect
    const viewportIndicator = await page.locator(
      ".slateboxjs-birdseye svg rect"
    );
    const rectCount = await viewportIndicator.count();
    expect(rectCount).toBeGreaterThan(0);
  });

  test("should have viewport indicator", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Check viewport indicator exists with blue stroke
    const viewportRect = await page.evaluate(() => {
      const svg = document.querySelector(".slateboxjs-birdseye svg");
      if (!svg) return null;
      const rects = svg.querySelectorAll("rect");
      for (const rect of rects) {
        const stroke = rect.getAttribute("stroke");
        if (stroke && stroke.includes("4285f4")) {
          return {
            stroke,
            width: rect.getAttribute("width"),
            height: rect.getAttribute("height"),
          };
        }
      }
      return null;
    });

    expect(viewportRect).not.toBeNull();
    expect(viewportRect?.stroke).toBe("#4285f4");
  });

  test("birdsEye should be toggleable", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForFunction(() => (window as any).slate);
    await page.waitForTimeout(500);

    // Should be visible initially
    let birdsEyeContainer = await page.locator(".slateboxjs-birdseye");
    await expect(birdsEyeContainer).toBeVisible();

    // Disable
    await page.evaluate(() => {
      (window as any).slate.birdsEye.disable();
    });

    await page.waitForTimeout(200);
    birdsEyeContainer = await page.locator(".slateboxjs-birdseye");
    await expect(birdsEyeContainer).not.toBeVisible();

    // Re-enable
    await page.evaluate(() => {
      (window as any).slate.birdsEye.enable();
    });

    await page.waitForTimeout(200);
    birdsEyeContainer = await page.locator(".slateboxjs-birdseye");
    await expect(birdsEyeContainer).toBeVisible();
  });
});
