import { test, expect } from "@playwright/test";

// Lifecycle leak: the v1 facade (what the app creates via `new Slatebox.slate(...)`) did
// NOT expose destroy(), so a host app navigating between canvases had no way to tear a
// slate down — every navigation left the v2 Slate registered in window.__slateboxInstances
// with its ResizeObserver/timers/handlers live (the array grew unbounded). The v2 Slate has
// a comprehensive destroy() (deregisters + disconnects observers + clears timers + chains to
// sub-modules); the facade now delegates to it so the app can clean up on unmount.
test.describe("facade destroy() tears down + deregisters (§lifecycle)", () => {
  test("destroy() removes the slate from __slateboxInstances and flags the v2 destroyed", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const r = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:500px;height:360px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);

      const before = ((window as any).__slateboxInstances || []).length;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      s.nodes.add(new sb.node({ id: "DA", xPos: 40, yPos: 40, width: 90, height: 50, text: "DA" }));
      await new Promise((res) => setTimeout(res, 250));
      const during = ((window as any).__slateboxInstances || []).length;

      const hasDestroy = typeof s.destroy === "function";
      const v2 = s.v2;
      s.destroy();
      await new Promise((res) => setTimeout(res, 250));
      const after = ((window as any).__slateboxInstances || []).length;
      const stillRegistered = ((window as any).__slateboxInstances || []).includes(v2);
      const destroyedFlag = v2?._destroyed ?? v2?.destroyed ?? null;
      // destroy() must not throw if called again / after teardown.
      let doubleCallThrew = false;
      try { s.destroy(); } catch (e) { doubleCallThrew = true; }
      return { before, during, after, hasDestroy, stillRegistered, destroyedFlag, doubleCallThrew };
    });

    expect(r.hasDestroy).toBe(true);
    expect(r.during).toBe(r.before + 1); // creating registered one
    expect(r.after).toBe(r.before); // destroy() deregistered it
    expect(r.stillRegistered).toBe(false);
    expect(r.destroyedFlag).toBe(true);
    expect(r.doubleCallThrew).toBe(false); // idempotent / best-effort
  });
});
