import { test, expect } from "@playwright/test";
import {
  installHelpers,
  runCollabSurfaceMatrix,
} from "./collab-surfaces.shared";

// STANDALONE runner for the collab surface matrix: two isolated browser
// contexts on the library test page, joined through the local relay
// (tests/collab-server-standalone.cjs, auto-started by playwright.config.ts).
// The same matrix runs against the real Meteor app in
// tests/e2e/app-collab-surfaces.spec.ts.
test("every collab surface propagates A → B (standalone)", async ({
  browser,
}) => {
  test.setTimeout(120_000);
  const room = "matrix-" + Math.random().toString(36).slice(2);

  const mkClient = async (userName: string) => {
    const ctx = await browser.newContext({
      viewport: { width: 1200, height: 900 },
    });
    const page = await ctx.newPage();
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(
      async ({ roomId, name }: any) => {
        const div = document.createElement("div");
        div.id = "slateCanvas";
        div.style.cssText =
          "width:1100px;height:800px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
        document.body.appendChild(div);
        const sb = (window as any).Slatebox;
        await new sb.slate(
          { container: "slateCanvas", id: roomId, allowCollaboration: true },
          {
            onInitCollaboration: async () => ({
              websocketUrl: "ws://localhost:1234",
              websocketParams: {},
              userName: name,
              color: "#3366ff",
            }),
          }
        ).init();
      },
      { roomId: room, name: userName }
    );
    await installHelpers(page);
    return { ctx, page };
  };

  const A = await mkClient("MatrixA");
  const B = await mkClient("MatrixB");

  // Wait for both to connect
  for (const p of [A.page, B.page]) {
    await p.waitForFunction(
      () => (window as any).__ct.slate().collab.isCollabConnected(),
      undefined,
      { timeout: 20000 }
    );
  }

  // Seed the same node on both sides (the app's Collaboration relay does
  // this in production; here we seed directly)
  for (const p of [A.page, B.page]) {
    await p.evaluate(() => {
      const s = (window as any).__ct.slate();
      s.beginRemoteApply(); // seeding is not a local user action
      s.addNode({
        id: "mx_seed",
        x: 10000,
        y: 10000,
        width: 160,
        height: 100,
        text: "seed",
      });
      s.endRemoteApply();
    });
  }
  await A.page.waitForTimeout(600);
  // Center the seed node so mouse interactions land in the viewport
  for (const p of [A.page, B.page]) {
    await p.evaluate(() => {
      const s = (window as any).__ct.slate();
      s.fitToContent();
      s.centerContent();
    });
  }
  await A.page.waitForTimeout(400);

  const report = await runCollabSurfaceMatrix({
    a: A.page,
    b: B.page,
    seedId: "mx_seed",
  });

  console.log("COLLAB SURFACE MATRIX (standalone):");
  for (const r of report) {
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.surface}${r.detail ? ` (${r.detail})` : ""}`);
  }

  await A.ctx.close();
  await B.ctx.close();

  const failed = report.filter((r) => !r.ok);
  expect(
    failed.map((f) => f.surface),
    `Failed surfaces: ${failed.map((f) => `${f.surface}${f.detail ? ` [${f.detail}]` : ""}`).join("; ")}`
  ).toEqual([]);
});
