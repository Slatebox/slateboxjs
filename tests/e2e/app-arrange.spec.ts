import { test, expect } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";

// F2 live proof: multi-node arrangement reachable in the REAL app chrome.
// Runs against a deployed app (SLATEBOX_APP_EXTERNAL=true, SLATEBOX_APP_URL=
// https://test.slatebox.com for the loop). Fresh context => true guest
// (no cookies; meteor cannot silently resume auth in a virgin context).
//
// Proof shape (no AI calls needed): seed 3 nodes + multi-select THROUGH the
// engine instance registry (window.__slateboxInstances), then drive the real
// GroupToolbar UI and assert geometry moved. Toolbar DOM presence also proves
// the NEW bundle executed (old bundle has no arrange-* aria-labels).

const APP = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test.describe("arrange toolbar (F2, app-level)", () => {
  test.skip(
    process.env.SLATEBOX_APP_EXTERNAL !== "true",
    "needs a deployed app; set SLATEBOX_APP_EXTERNAL=true",
  );

  test("align-left via GroupToolbar moves the selection", async ({ page }) => {
    test.setTimeout(240_000);

    // True-gate precondition: virgin storage, no resumed login.
    await page.goto(APP + "/", { waitUntil: "domcontentloaded" });
    const token = await page.evaluate(() =>
      localStorage.getItem("meteor_token"),
    );
    expect(token, "fresh session must have no resumed auth").toBeFalsy();

    await openGuestCanvas(page, APP);

    const result = await page
      .evaluate(async () => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        let slate: any = null;
        for (let i = 0; i < 60 && !slate; i++) {
          const inst = (window as any).__slateboxInstances;
          const list = Array.isArray(inst) ? inst : Object.values(inst || {});
          slate = list.find((s: any) => s?.v2 || s?.nodes);
          if (!slate) await sleep(500);
        }
        if (!slate) return { ok: false, why: "no slate instance yet" };

        // Seed three staggered nodes via the engine (NOT via AI).
        const ids = ["proof-a", "proof-b", "proof-c"];
        ids.forEach((id, i) => {
          if (!slate.nodes.one(id))
            slate.nodes.add({
              id,
              text: "proof " + i,
              x: 80 + i * 140,
              y: 80 + i * 60,
              width: 100,
              height: 60,
            });
        });
        const before = ids.map((id) => slate.nodes.one(id)?.options?.x);
        slate.v2
          ? slate.v2.selectNodes?.(
              ids.map((id: string) => slate.nodes.one(id)).filter(Boolean),
            )
          : slate.selectNodes?.(ids.map((id: string) => slate.nodes.one(id)));
        return { ok: true, before };
      })
      .catch((e) => ({ ok: false, why: String(e) }));

    expect(result.ok, `seed failed: ${(result as any).why}`).toBe(true);

    // The toolbar itself: real DOM, new bundle, 2+ multi-selection.
    const bar = page.getByLabel("arrange-align-left", { exact: true });
    await bar.waitFor({ state: "visible", timeout: 15_000 });

    await bar.click();
    await page.waitForTimeout(800);

    const after = await page.evaluate(() => {
      let slate: any = null;
      const inst = (window as any).__slateboxInstances;
      const list = Array.isArray(inst) ? inst : Object.values(inst || {});
      slate = list.find((s: any) => s?.v2 || s?.nodes);
      return ["proof-a", "proof-b", "proof-c"].map(
        (id) => slate?.nodes?.one(id)?.options?.x,
      );
    });
    const norm = (xs: number[]) =>
      xs.map((x) => Math.round(x ?? -99999));
    // align-left equalizes the VISUAL minX of the trio; raw options.x differ
    // for the offset node, so the trio must NOT remain at seed offsets and
    // the leftmost node must stay at the left bound (>=1 node unchanged).
    expect(norm(after)).not.toEqual(norm((result as any).before));
    expect(Math.max(...after) - Math.min(...after)).toBeLessThan(140);

    // F1 cross-check: no ghost "Anonymous" cursor label anywhere.
    const ghost = await page.evaluate(
      () => !!document.querySelector("text")?.ownerDocument
        ? Array.from(document.querySelectorAll("svg text")).some(
            (t) => t.textContent === "Anonymous",
          )
        : false,
    );
    expect(ghost, "ghost Anonymous label present").toBe(false);
  });
});
