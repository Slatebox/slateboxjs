import { test, expect } from "@playwright/test";

test.describe("Presentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "Step 1", id: "p1" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "Step 2", id: "p2" });
    });
    await page.waitForTimeout(1000);
  });

  test("should start presentation", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      const steps = s.getAllNodes().map((n: any, i: number) => ({ nodeId: n.id, index: i }));
      s.presentation.start(steps);
    });
    await page.waitForTimeout(300);
    const active = await page.evaluate(() => (window as any).slate.presentation.isPresenting());
    expect(active).toBe(true);
  });

  test("should stop presentation", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.presentation.start(s.getAllNodes().map((n: any, i: number) => ({ nodeId: n.id, index: i })));
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => (window as any).slate.presentation.stop());
    await page.waitForTimeout(200);
    const active = await page.evaluate(() => (window as any).slate.presentation.isPresenting());
    expect(active).toBe(false);
  });

  test("should navigate to next step", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.presentation.start(s.getAllNodes().map((n: any, i: number) => ({ nodeId: n.id, index: i })));
    });
    await page.waitForTimeout(200);
    const result = await page.evaluate(() => (window as any).slate.presentation.next());
    expect(result).toBe(true);
  });

  test("should navigate back to the previous step", async ({ page }) => {
    const res = await page.evaluate(() => {
      const s = (window as any).slate;
      s.presentation.start(s.getAllNodes().map((n: any, i: number) => ({ nodeId: n.id, index: i })));
      s.presentation.next(); // advance to step 1
      const stepAfterNext = s.presentation.getCurrentStep();
      const prevOk = s.presentation.previous(); // back to step 0
      const stepAfterPrev = s.presentation.getCurrentStep();
      return { stepAfterNext, prevOk, stepAfterPrev };
    });
    expect(res.stepAfterNext).toBe(1);
    expect(res.prevOk).toBe(true);
    expect(res.stepAfterPrev).toBe(0);
  });
});
