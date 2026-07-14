import { test, expect } from "@playwright/test";
import { bootstrapGuestSlate } from "./app-host.shared";

const APP_URL = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("Meteor host persists collaborative undo and redo", async ({ browser }) => {
  test.setTimeout(180_000);
  const ctxA = await browser.newContext({ viewport: { width: 1300, height: 1000 } });
  const a = await ctxA.newPage();
  const slateUrl = await bootstrapGuestSlate(a, APP_URL);
  const shareId = new URL(slateUrl).pathname.split("/").filter(Boolean).at(-1)!;

  const state = await ctxA.storageState();
  const ctxB = await browser.newContext({
    viewport: { width: 1300, height: 1000 },
    storageState: state,
  });
  const b = await ctxB.newPage();

  try {
    await b.goto(slateUrl);
    await b.waitForSelector("#slateCanvas [data-node-id]", { timeout: 60_000 });
    await b.waitForFunction(() => !!(window as any).slate, undefined, {
      timeout: 30_000,
    });

    const baseline = await a.evaluate(() => {
      const s = (window as any).slate.v2;
      const node = s.nodes.allNodes[0];
      s.undoRedo.clear();
      s.undoRedo.forceSnapshot();
      return { id: node.id, text: node.options.text };
    });
    const editedText = `port-invariant-${Date.now()}`;

    await a.evaluate(
      ({ id, text }) => {
        const s = (window as any).slate.v2;
        s.nodes.one(id).setText(text);
        s.broadcast("onNodeTextChanged", { id, text });
        s.undoRedo.forceSnapshot();
      },
      { id: baseline.id, text: editedText }
    );
    await b.waitForFunction(
      ({ id, text }) =>
        (window as any).slate.v2.nodes.one(id)?.options.text === text,
      { id: baseline.id, text: editedText }
    );

    expect(await a.evaluate(() => (window as any).slate.v2.undoRedo.undo())).toBe(true);
    for (const page of [a, b]) {
      await page.waitForFunction(
        ({ id, text }) =>
          (window as any).slate.v2.nodes.one(id)?.options.text === text,
        { id: baseline.id, text: baseline.text }
      );
    }

    // Query the same server method used by a route reload. This proves Mongo
    // persistence independently of the live Yjs document shared by A and B.
    await a.waitForFunction(
      async ({ id, text, share }) => {
        const w = window as any;
        const meteor = w.Meteor || w.Package?.meteor?.Meteor;
        if (!meteor?.callAsync) return false;
        const result = await meteor.callAsync("slates.get", { shareId: share });
        const node = result?.slateBase?.nodes?.find(
          (item: any) => item?.options?.id === id
        );
        return node?.options?.text === text;
      },
      { id: baseline.id, text: baseline.text, share: shareId },
      { timeout: 30_000, polling: 500 }
    );

    expect(await a.evaluate(() => (window as any).slate.v2.undoRedo.redo())).toBe(true);
    for (const page of [a, b]) {
      await page.waitForFunction(
        ({ id, text }) =>
          (window as any).slate.v2.nodes.one(id)?.options.text === text,
        { id: baseline.id, text: editedText }
      );
    }
    await a.waitForFunction(
      async ({ id, text, share }) => {
        const w = window as any;
        const meteor = w.Meteor || w.Package?.meteor?.Meteor;
        if (!meteor?.callAsync) return false;
        const result = await meteor.callAsync("slates.get", { shareId: share });
        const node = result?.slateBase?.nodes?.find(
          (item: any) => item?.options?.id === id
        );
        return node?.options?.text === text;
      },
      { id: baseline.id, text: editedText, share: shareId },
      { timeout: 30_000, polling: 500 }
    );
  } finally {
    await Promise.all([ctxA.close(), ctxB.close()]);
  }
});
