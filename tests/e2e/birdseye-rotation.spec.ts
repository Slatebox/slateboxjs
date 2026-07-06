import { test, expect } from "@playwright/test";

// The BirdsEye minimap must reflect a node's rotation (fidelity with the canvas).
// We rotate through the engine API rather than dragging the rotate handle — the
// handle drag is environment-fragile (heuristic handle-finding) and is covered by
// the interactive rotate specs; here we verify the minimap shape ends up rotated.
test.describe("BirdsEye Rotation Refresh", () => {
  const firstNodeId = (page: import("@playwright/test").Page) =>
    page.evaluate(() => (window as any).slate.getAllNodes()[0].id);

  const beTransform = (page: import("@playwright/test").Page, id: string) =>
    page.evaluate((nid) => {
      const be = (window as any).slate.birdsEye;
      const sh = be?.nodeShapes?.get(nid);
      return sh?.node?.getAttribute("transform") || "none";
    }, id);

  const rotate = (page: import("@playwright/test").Page, id: string, deg: number) =>
    page.evaluate(
      ({ nid, d }) => {
        const n = (window as any).slate.getNode(nid);
        n.options.rotate = { rotationAngle: d };
        n.applyPositionAndRotation();
        (window as any).slate.notifyNodeChanged(n);
      },
      { nid: id, d: deg }
    );

  test("BirdsEye should update when node is rotated", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForTimeout(600);

    const id = await firstNodeId(page);
    const before = await beTransform(page, id);

    await rotate(page, id, 45);
    await page.waitForTimeout(600);
    const after = await beTransform(page, id);

    // The minimap shape now carries a rotation transform, different from before.
    expect(after).not.toBe(before);
    expect(after).not.toBe("none");
    // 45° → rotation matrix with cos45 ≈ 0.707 (or an explicit rotate()).
    expect(after).toMatch(/matrix\(0\.70|rotate\(\s*45/);
  });

  test("Verify rotation is stored and BirdsEye updates", async ({ page }) => {
    await page.goto("/advanced-demo.html");
    await page.waitForTimeout(600);

    const id = await firstNodeId(page);
    await rotate(page, id, 30);
    await page.waitForTimeout(600);

    const state = await page.evaluate((nid) => {
      const n = (window as any).slate.getNode(nid);
      const sh = (window as any).slate.birdsEye?.nodeShapes?.get(nid);
      return {
        hasRotateObj: !!n.options.rotate,
        rotationAngle: n.options.rotate?.rotationAngle,
        beTransform: sh?.node?.getAttribute("transform") || "none",
      };
    }, id);

    expect(state.hasRotateObj).toBe(true);
    expect(state.rotationAngle).toBe(30);
    // The minimap reflects it (non-identity transform present).
    expect(state.beTransform).not.toBe("none");
  });
});
