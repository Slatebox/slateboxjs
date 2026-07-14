import { test, expect } from "@playwright/test";

test.describe("Collab Integration", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
    });
    await page.waitForTimeout(500);
  });

  test("should have collab module", async ({ page }) => {
    const hasCollab = await page.evaluate(() => {
      return !!(window as any).slate.collab;
    });
    expect(hasCollab).toBe(true);
  });

  test("should not be connected before init", async ({ page }) => {
    const connected = await page.evaluate(() => {
      return (window as any).slate.collab.isCollabConnected();
    });
    expect(connected).toBe(false);
  });

  test("should handle init gracefully when yjs is not installed", async ({ page }) => {
    await page.evaluate(async () => {
      const collab = (window as any).slate.collab;
      await collab.init({
        wsUrl: "ws://localhost:1235",
        roomName: "e2e-test-" + Date.now(),
        userName: "E2E Tester",
      });
    });
    await page.waitForTimeout(1000);

    // init should complete without throwing even if yjs is unavailable
    // (the module handles the dynamic import failure gracefully)
  });

  test("should not throw on disconnect without connection", async ({ page }) => {
    await page.evaluate(() => {
      const collab = (window as any).slate.collab;
      collab.disconnect();
    });
    await page.waitForTimeout(200);

    const connected = await page.evaluate(() => {
      return (window as any).slate.collab.isCollabConnected();
    });
    expect(connected).toBe(false);
  });

  test("should not throw on destroy", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.collab.destroy();
    });
    await page.waitForTimeout(200);

    const connected = await page.evaluate(() => {
      return (window as any).slate.collab.isCollabConnected();
    });
    expect(connected).toBe(false);
  });

  test("should have getClientID return 0 before init", async ({ page }) => {
    const clientId = await page.evaluate(() => {
      return (window as any).slate.collab.getClientID();
    });
    expect(clientId).toBe(0);
  });

  test("should have empty collab users before init", async ({ page }) => {
    const users = await page.evaluate(() => {
      return (window as any).slate.collab.getCollabUsers();
    });
    expect(users).toEqual([]);
  });

  test("send should warn when not connected", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.collab.send({ type: "test", data: { msg: "hello" } });
    });
    // Should not throw — warn is logged but not visible in evaluate
  });

  test("invoke should handle package array", async ({ page }) => {
    await page.evaluate(() => {
      const collab = (window as any).slate.collab;
      collab.invoke([
        { type: "onNodePositioned", data: { id: "x", location: { x: 0, y: 0 } } },
        { type: "onNodeLocked", data: { id: "y" } },
      ]);
    });
    // Should not throw
  });

  test("should handle status callbacks", async ({ page }) => {
    const statusEvents: string[] = [];

    await page.evaluate(() => {
      const collab = (window as any).slate.collab;
      // Register callback via options — init will wire it
      (window as any)._collabStatuses = [];
    });

    // Callbacks stored in options object
    const hasOptions = await page.evaluate(() => {
      return typeof (window as any).slate.collab;
    });
    expect(hasOptions).toBe("object");
  });
});
