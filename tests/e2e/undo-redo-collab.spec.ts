import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";

type Client = { context: BrowserContext; page: Page };

async function createClient(
  browser: Browser,
  room: string,
  name: string
): Promise<Client> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(
    async ({ roomId, userName }) => {
      const container = document.createElement("div");
      container.id = "slateCanvas";
      container.style.cssText = "width:900px;height:700px";
      document.body.appendChild(container);

      (window as any).__snapshots = [];
      const sb = (window as any).Slatebox;
      (window as any).slate = await new sb.slate(
        {
          container: "slateCanvas",
          id: roomId,
          allowCollaboration: true,
        },
        {
          onInitCollaboration: async () => ({
            websocketUrl: "ws://localhost:1234",
            websocketParams: {},
            userName,
            color: "#3366ff",
          }),
          onTakeSnapshot: (opts: any) =>
            (window as any).__snapshots.push(opts),
        }
      ).init();
    },
    { roomId: room, userName: name }
  );
  await page.waitForFunction(
    () => (window as any).slate.v2.collab.isCollabConnected(),
    undefined,
    { timeout: 20_000 }
  );
  return { context, page };
}

test("undo/redo synchronizes, replays, and survives serialization", async ({
  browser,
}) => {
  test.setTimeout(90_000);
  const room = `undo-room-${Math.random().toString(36).slice(2)}`;
  const a = await createClient(browser, room, "Undo A");
  const b = await createClient(browser, room, "Undo B");
  let c: Client | undefined;

  try {
    // Seed both peers without emitting; this is their persisted starting state.
    for (const client of [a, b]) {
      await client.page.evaluate(async () => {
        const s = (window as any).slate.v2;
        s.beginRemoteApply();
        const node = s.addNode({
          id: "undo-node",
          x: 100,
          y: 100,
          width: 160,
          height: 100,
          text: "before",
        });
        if (node.ready) await node.ready;
        s.endRemoteApply();
        s.undoRedo.clear();
        s.undoRedo.forceSnapshot();
      });
    }

    await a.page.evaluate(() => {
      const s = (window as any).slate.v2;
      s.nodes.one("undo-node").setText("after");
      s.broadcast("onNodeTextChanged", { id: "undo-node", text: "after" });
      s.undoRedo.forceSnapshot();
    });
    await b.page.waitForFunction(
      () => (window as any).slate.v2.nodes.one("undo-node")?.options.text === "after"
    );

    expect(await a.page.evaluate(() => (window as any).slate.v2.undoRedo.undo())).toBe(true);
    for (const client of [a, b]) {
      await client.page.waitForFunction(
        () => (window as any).slate.v2.nodes.one("undo-node")?.options.text === "before"
      );
    }

    // A late-joining peer must replay only the new authoritative baseline.
    c = await createClient(browser, room, "Undo C");
    await c.page.waitForFunction(
      () => (window as any).slate.v2.nodes.one("undo-node")?.options.text === "before"
    );

    expect(await a.page.evaluate(() => (window as any).slate.v2.undoRedo.redo())).toBe(true);
    for (const client of [a, b, c]) {
      await client.page.waitForFunction(
        () => (window as any).slate.v2.nodes.one("undo-node")?.options.text === "after"
      );
    }

    const snapshotEvent = await a.page.evaluate(
      () => (window as any).__snapshots.at(-1)
    );
    expect(snapshotEvent).toMatchObject({
      action: "redo",
      slateId: room,
    });
    expect(JSON.parse(snapshotEvent.snapshot).nodes).toHaveLength(1);

    // Exercise the app's persistence shape: export the restored state and load
    // it into a fresh, non-collaborating slate.
    const persisted = await a.page.evaluate(() => (window as any).slate.exportJSON());
    const reloadedText = await a.page.evaluate(async (json) => {
      const div = document.createElement("div");
      div.id = "reloadCanvas";
      div.style.cssText = "width:900px;height:700px";
      document.body.appendChild(div);
      const sb = (window as any).Slatebox;
      const reload = await new sb.slate(
        { container: "reloadCanvas", allowCollaboration: false },
        {}
      ).init();
      await reload.loadJSON(json);
      return reload.nodes.one("undo-node")?.v2.options.text;
    }, persisted);
    expect(reloadedText).toBe("after");
  } finally {
    await Promise.all(
      [a, b, c].filter(Boolean).map((client) => client!.context.close())
    );
  }
});
