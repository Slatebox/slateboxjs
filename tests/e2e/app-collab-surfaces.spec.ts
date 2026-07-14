import { test, expect } from "@playwright/test";
import {
  installHelpers,
  runCollabSurfaceMatrix,
} from "./collab-surfaces.shared";
import { bootstrapGuestSlate } from "./app-host.shared";

// REAL-APP runner for the collab surface matrix: two isolated browser
// contexts (same guest user via shared storageState) on the SAME slate in
// the Meteor app at localhost:3000. Exercises the exact transport the
// production app uses (yjs map over BroadcastChannel/websocket + the
// app's own Collaboration relay).
//
// playwright.app.config.ts builds and installs the current package, then boots
// the canonical app. This test is intentionally strict: an unavailable host is
// a failed integration gate, not a skip.
const APP_URL = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("every collab surface propagates A → B (real Meteor app)", async ({
  browser,
}) => {
  test.setTimeout(180_000);

  // ── Client A: guest login, create a slate ──
  const ctxA = await browser.newContext({
    viewport: { width: 1300, height: 1000 },
  });
  const a = await ctxA.newPage();
  await bootstrapGuestSlate(a, APP_URL);
  await a.waitForTimeout(2500);
  const slateUrl = a.url();

  // ── Client B: SAME user (storageState) in an isolated context, same slate ──
  const state = await ctxA.storageState();
  const ctxB = await browser.newContext({
    viewport: { width: 1300, height: 1000 },
    storageState: state,
  });
  const b = await ctxB.newPage();
  await b.goto(slateUrl);
  await b.waitForSelector("#slateCanvas [data-node-id]", { timeout: 30000 });
  await b.waitForTimeout(3000);

  await installHelpers(a);
  await installHelpers(b);

  // The welcome node created by the app is the seed — find its id
  const seedId = await a.evaluate(
    () =>
      document
        .querySelector("#slateCanvas [data-node-id]")!
        .getAttribute("data-node-id")!
  );
  const seedOnB = await b.evaluate(
    (id) => !!(window as any).__ct.state(id),
    seedId
  );
  expect(seedOnB, "seed node must exist on both clients").toBe(true);

  const report = await runCollabSurfaceMatrix({ a, b, seedId });

  console.log("COLLAB SURFACE MATRIX (real app):");
  for (const r of report) {
    console.log(
      `  ${r.ok ? "✓" : "✗"} ${r.surface}${r.detail ? ` (${r.detail})` : ""}`
    );
  }

  await ctxA.close();
  await ctxB.close();

  const failed = report.filter((r) => !r.ok);
  expect(
    failed.map((f) => f.surface),
    `Failed surfaces: ${failed
      .map((f) => `${f.surface}${f.detail ? ` [${f.detail}]` : ""}`)
      .join("; ")}`
  ).toEqual([]);
});
