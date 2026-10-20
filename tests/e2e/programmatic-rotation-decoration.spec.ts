import { test, expect } from "@playwright/test";

// PROGRAMMIC rotation regression — the non-drag half of the rotation
// decoration bug family. The selection ring + plug-dots are positioned from
// the selected shape's axis-aligned box and their MutationObserver watches
// the SHAPE elements, while rotation lives on the PARENT group transform.
// Interactive drags re-key the overlay via finalizeInteraction; programmatic
// setRotation (collab onNodeRotated, group rotate, SlateOperations, host
// API) had NO refresh at all, so the harness stranded at the pre-rotation
// box — the original "handles don't match the rotated node" report.
//
// These specs rotate via the API with the node SELECTED and assert the
// overlay is re-keyed to the rotated geometry (affordances move AND the
// overlay extent tracks the new AABB, including shrinking at ~90 degrees).
// A stale overlay moves nothing; a correct one moves everything.

async function setupRot(page: any) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async () => {
    const sb = (window as any).Slatebox;
    const div = document.createElement("div");
    div.id = "slateCanvas";
    div.style.cssText =
      "width:760px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
    document.body.appendChild(div);
    const s = await new sb.slate(
      { container: "slateCanvas", allowCollaboration: false },
      {}
    ).init();
    (window as any).__s = s;
    const n = s.nodes.add(
      new sb.node({
        id: "PROT",
        xPos: 260,
        yPos: 200,
        width: 160,
        height: 120,
        text: "P",
      })
    );
    (window as any).__prot = n.v2 ?? n;
    await new Promise((r) => setTimeout(r, 500));
  });
}

const centerOf = (page: any) =>
  page.evaluate(() => {
    const g = document.querySelector('#slateCanvas [data-node-id="PROT"]')!;
    const r = g.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

// Snapshot the selection affordances: plug-dots + rotate handle positions
// and the union extent of anything selection-overlay-like.
const affordances = (page: any) =>
  page.evaluate(() => {
    const canvas = document.getElementById("slateCanvas")!;
    const out: Record<string, { x: number; y: number }> = {};
    canvas
      .querySelectorAll("[class*='connection-handle'], [class*='handle_rot']")
      .forEach((d) => {
        const r = d.getBoundingClientRect();
        const cls = d.getAttribute("class") || "";
        const name =
          cls.match(/connection-handle-(\w+)/)?.[1] ||
          cls.match(/handle_rot(\w*)/)?.[0] ||
          "rot";
        out[name] = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
    let unionW = 0;
    canvas
      .querySelectorAll("[class*='selection'], [class*='outline']")
      .forEach((d) => {
        const r = d.getBoundingClientRect();
        unionW = Math.max(unionW, r.width);
      });
    return { out, unionW };
  });

const movedCount = (a: any, b: any, min = 8) =>
  Object.keys(a.out).filter(
    (k) =>
      b.out[k] &&
      Math.hypot(a.out[k].x - b.out[k].x, a.out[k].y - b.out[k].y) > min
  ).length;

test.describe("programmatic rotation re-keys selection decorations", () => {
  test("immediate setRotation(45) moves the whole harness to the rotated box", async ({
    page,
  }) => {
    await setupRot(page);

    const c0 = await centerOf(page);
    await page.mouse.click(c0.x, c0.y);
    await page.waitForTimeout(400);
    expect(
      await page.evaluate(() => (window as any).__s.v2.selectedNodes.length),
      "node must be selected before the rotation"
    ).toBe(1);

    const pre = await affordances(page);
    expect(
      pre.out["handle_rot"],
      "rotate handle must exist before the rotation"
    ).toBeTruthy();
    // This fixture has no connectors, so only the rotate handle (+ any
    // always-on dots) exist. The discriminator is NOT the count: a stale
    // overlay strands EVERY affordance at the pre-rotation box.
    expect(Object.keys(pre).length).toBeGreaterThanOrEqual(2);

    await page.evaluate(() => {
      const node = (window as any).__prot;
      node.setRotation(45); // no duration: the collab-replay/host-API shape
    });
    await page.waitForTimeout(350); // rAF-coalesced rebuild lands within ~2 frames

    const post = await affordances(page);
    expect(
      post.out["handle_rot"],
      "overlay must be REBUILT (rotate handle present after refresh)"
    ).toBeTruthy();
    // A stranded overlay keeps every affordance exactly where it was; a
    // re-keyed one moves dots + handle to the rotated geometry.
    expect(
      movedCount(pre, post),
      "affordances must re-key to the rotated box (stale overlay moves none)"
    ).toBeGreaterThanOrEqual(Object.keys(pre).length);
    // 45 degrees on a 160x120 box grows the AABB width toward ~198.
    if (pre.unionW > 0 && post.unionW > 0) {
      expect(post.unionW / pre.unionW, "overlay extent must track the AABB").toBeGreaterThan(1.08);
    }
    expect(
      await page.evaluate(() => (window as any).__s.v2.selectedNodes.length),
      "selection must survive the refresh"
    ).toBe(1);
  });

  test("animated setRotation re-keys at tween end (collab path)", async ({
    page,
  }) => {
    await setupRot(page);

    const c0 = await centerOf(page);
    await page.mouse.click(c0.x, c0.y);
    await page.waitForTimeout(400);

    await page.evaluate(() => {
      (window as any).__prot.setRotation(45);
    });
    await page.waitForTimeout(350);

    const beforeAnim = await affordances(page);
    await page.evaluate(() => {
      (window as any).__prot.setRotation(90, 400); // the Invoker.onNodeRotated collab shape
    });
    await page.waitForTimeout(200);
    const mid = await affordances(page); // mid-tween: allowed to lag
    await page.waitForTimeout(700); // tween + completion refresh
    const after = await affordances(page);

    expect(
      after.out["handle_rot"],
      "handle must exist after the tween"
    ).toBeTruthy();
    expect(
      movedCount(mid, after),
      "tween-end refresh must re-key the overlay (stale keeps every dot frozen)"
    ).toBeGreaterThanOrEqual(2);
    // At ~90 degrees the 160x120 AABB WIDTH is 120 — narrower than the
    // 45-degree (~198) extent. A stranded overlay keeps the wide box.
    if (beforeAnim.unionW > 0 && after.unionW > 0) {
      expect(
        after.unionW / beforeAnim.unionW,
        "overlay must SHRINK to the ~90-degree AABB"
      ).toBeLessThan(0.85);
    }
    expect(
      await page.evaluate(() => (window as any).__s.v2.selectedNodes.length),
      "selection must survive the animated rotation"
    ).toBe(1);
  });
});