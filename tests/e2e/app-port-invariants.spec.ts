import { test, expect } from "@playwright/test";
import { bootstrapGuestSlate } from "./app-host.shared";

const APP_URL = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("Meteor host persists collaborative text and grouping through undo and redo", async ({
  browser,
}) => {
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

    // The canonical app's group toolbar receives live engine nodes from
    // onGroupSelection, but must perform mutations through its owned facade —
    // never by selecting the last entry in window.__slateboxInstances. Prove
    // that facade path across the same render → collab → Mongo → undo/redo
    // boundary as the text edit above.
    const groupedNodeIds = await a.evaluate(({ firstId }) => {
      const facade = (window as any).slate;
      const secondId = `port-group-${Date.now()}`;
      const second = new (window as any).Slatebox.node({
        id: secondId,
        xPos: 10300,
        yPos: 10000,
        width: 175,
        height: 100,
        text: "Group invariant",
      });
      facade.nodes.add(second);
      return [firstId, secondId];
    }, { firstId: baseline.id });

    for (const page of [a, b]) {
      await page.waitForFunction(
        (ids) => ids.every((id) => !!(window as any).slate.v2.nodes.one(id)),
        groupedNodeIds
      );
    }

    await a.evaluate(() => {
      const undoRedo = (window as any).slate.undoRedo;
      undoRedo.clear();
      undoRedo.forceSnapshot();
    });
    const groupId = await a.evaluate((ids) => {
      const facade = (window as any).slate;
      const nodes = ids.map((id) => facade.v2.nodes.one(id));
      const id = facade.groupNodes(nodes);
      facade.undoRedo.forceSnapshot();
      return id;
    }, groupedNodeIds);
    expect(groupId).toBeTruthy();

    const waitForGroup = async (expectedGroupId: string | null) => {
      for (const page of [a, b]) {
        await page.waitForFunction(
          ({ ids, expected }) =>
            ids.every((id) => {
              const actual = (window as any).slate.v2.nodes.one(id)?.options.groupId;
              return expected ? actual === expected : !actual;
            }),
          { ids: groupedNodeIds, expected: expectedGroupId }
        );
      }
      await a.waitForFunction(
        async ({ ids, expected, share }) => {
          const w = window as any;
          const meteor = w.Meteor || w.Package?.meteor?.Meteor;
          if (!meteor?.callAsync) return false;
          const result = await meteor.callAsync("slates.get", { shareId: share });
          const nodes = result?.slateBase?.nodes || [];
          return ids.every((id) => {
            const actual = nodes.find((item: any) => item?.options?.id === id)?.options
              ?.groupId;
            return expected ? actual === expected : !actual;
          });
        },
        { ids: groupedNodeIds, expected: expectedGroupId, share: shareId },
        { timeout: 30_000, polling: 500 }
      );
    };

    await waitForGroup(groupId);
    expect(await a.evaluate(() => (window as any).slate.undoRedo.undo())).toBe(true);
    await waitForGroup(null);
    expect(await a.evaluate(() => (window as any).slate.undoRedo.redo())).toBe(true);
    await waitForGroup(groupId);
  } finally {
    await Promise.all([ctxA.close(), ctxB.close()]);
  }
});
