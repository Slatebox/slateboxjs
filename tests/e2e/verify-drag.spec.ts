import { test, expect } from "@playwright/test";

test("verify mouse drag works", async ({ page }) => {
  // Capture console logs
  page.on('console', msg => {
    if (msg.text().includes('DRAG_DEBUG')) {
      console.log('BROWSER:', msg.text());
    }
  });

  await page.goto("/advanced-demo.html");
  await page.waitForFunction(() => (window as any).slate);
  await page.waitForTimeout(500);

  // Move the node to a known, visible position first
  await page.evaluate(() => {
    const slate = (window as any).slate;
    const node = slate.getAllNodes()[0];
    // Position the node at a reliable spot within the visible slate area
    node.position(200, 200);
  });
  await page.waitForTimeout(100);

  // Get node info before drag
  const before = await page.evaluate(() => {
    const slate = (window as any).slate;
    const node = slate.getAllNodes()[0];
    const rect = node.svgGroup.node.getBoundingClientRect();
    return {
      id: node.id,
      optionsX: node.options.x,
      optionsY: node.options.y,
      screenX: rect.x,
      screenY: rect.y,
      screenCenterX: rect.x + rect.width / 2,
      screenCenterY: rect.y + rect.height / 2,
    };
  });

  console.log("BEFORE drag:", before);

  // Do actual mouse drag - use the SVG element directly
  const startX = before.screenCenterX;
  const startY = before.screenCenterY;
  const dragDistance = 150;

  console.log(`Dragging from (${startX}, ${startY}) to (${startX + dragDistance}, ${startY + 75})`);

  // Check what element is at the click position
  const elementAtPoint = await page.evaluate(({x, y}) => {
    const el = document.elementFromPoint(x, y);
    return el ? {
      tagName: el.tagName,
      className: el.className,
      id: el.id,
      parentTag: el.parentElement?.tagName,
      parentClass: (el.parentElement as any)?.className?.baseVal || el.parentElement?.className
    } : null;
  }, {x: startX, y: startY});
  console.log("Element at click point:", elementAtPoint);

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + dragDistance, startY + 75, { steps: 20 });
  await page.mouse.up();

  await page.waitForTimeout(300);

  // Get node info after drag
  const after = await page.evaluate(() => {
    const slate = (window as any).slate;
    const node = slate.getAllNodes()[0];
    const rect = node.svgGroup.node.getBoundingClientRect();
    return {
      id: node.id,
      optionsX: node.options.x,
      optionsY: node.options.y,
      screenX: rect.x,
      screenY: rect.y,
    };
  });

  console.log("AFTER drag:", after);

  const movedX = after.optionsX - before.optionsX;
  const movedY = after.optionsY - before.optionsY;
  console.log(`Node moved: x=${movedX}, y=${movedY} (expected ~${dragDistance}, ~75)`);

  // Verify the node actually moved approximately the drag distance
  expect(movedX).toBeGreaterThan(100);
  expect(movedY).toBeGreaterThan(50);
});
