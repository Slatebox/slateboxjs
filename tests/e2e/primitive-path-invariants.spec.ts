import {
  test,
  expect,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";

type Client = { context: BrowserContext; page: Page };

const PRIMITIVES = [
  { id: "rectangle-node", shape: "rectangle", width: 180, height: 100 },
  {
    id: "rounded-node",
    shape: "roundedrectangle",
    width: 170,
    height: 90,
  },
  { id: "circle-node", shape: "circle", width: 110, height: 110 },
  { id: "ellipse-node", shape: "ellipse", width: 190, height: 100 },
] as const;

async function createClient(
  browser: Browser,
  room: string,
  name: string,
): Promise<Client> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(
    async ({ roomId, userName }) => {
      const container = document.createElement("div");
      container.id = "slateCanvas";
      container.style.cssText = "width:1000px;height:700px";
      document.body.appendChild(container);
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
        },
      ).init();
    },
    { roomId: room, userName: name },
  );
  await page.waitForFunction(
    () => (window as any).slate.v2.collab.isCollabConnected(),
    undefined,
    { timeout: 20_000 },
  );
  return { context, page };
}

async function seed(client: Client): Promise<void> {
  await client.page.evaluate(async (primitives) => {
    const s = (window as any).slate.v2;
    s.beginRemoteApply();
    for (const [index, primitive] of primitives.entries()) {
      const node = s.addNode({
        ...primitive,
        x: 80 + index * 215,
        y: 180,
        text: primitive.shape,
        backgroundColor: "#1f6feb",
        borderColor: "#f0c000",
        borderWidth: 5,
        borderStyle: "dashed",
        opacity: 0.72,
      });
      if (node.ready) await node.ready;
    }
    s.endRemoteApply();
    s.undoRedo.clear();
    s.undoRedo.forceSnapshot();
  }, PRIMITIVES);
}

async function readStates(page: Page, slateExpression = "slate") {
  return page.evaluate(
    ({ primitives, expression }) => {
      const slate = (window as any)[expression].v2;
      return primitives.map((primitive) => {
        const node = slate.nodes.one(primitive.id);
        return {
          id: primitive.id,
          shape: node?.options.shape,
          wrapperTag: node?.backgroundRect?.node?.tagName?.toLowerCase(),
          pathTag: node?.contentPath?.node?.tagName?.toLowerCase(),
          path: node?.contentPath?.attr?.("d") || null,
          proxyTag: node?.resizeTarget?.node?.tagName?.toLowerCase(),
          wrapperWidth: Math.round(node?.backgroundRect?.width?.() || 0),
          wrapperHeight: Math.round(node?.backgroundRect?.height?.() || 0),
          fill: node?.contentPath?.attr?.("fill"),
          stroke: node?.contentPath?.attr?.("stroke"),
          strokeWidth: Number(node?.contentPath?.attr?.("stroke-width")),
          opacity: Number(node?.contentPath?.attr?.("opacity")),
        };
      });
    },
    { primitives: PRIMITIVES, expression: slateExpression },
  );
}

function expectPathStates(states: Awaited<ReturnType<typeof readStates>>) {
  expect(states).toHaveLength(PRIMITIVES.length);
  for (const state of states) {
    expect(state.wrapperTag).toBe("svg");
    expect(state.pathTag).toBe("path");
    expect(state.path).toBeTruthy();
    expect(state.proxyTag).toBe("rect");
    expect(state.wrapperWidth).toBeGreaterThan(0);
    expect(state.wrapperHeight).toBeGreaterThan(0);
    expect(state.fill).toBe("#1f6feb");
    expect(state.stroke).toBe("#f0c000");
    expect(state.strokeWidth).toBe(5);
    expect(state.opacity).toBeCloseTo(0.72);
  }
}

test("primitive paths render, reload, collaborate, and undo/redo", async ({
  browser,
}) => {
  test.setTimeout(90_000);
  const room = `primitive-path-room-${Math.random().toString(36).slice(2)}`;
  const a = await createClient(browser, room, "Primitive A");
  const b = await createClient(browser, room, "Primitive B");

  try {
    await seed(a);
    await seed(b);

    expectPathStates(await readStates(a.page));
    expectPathStates(await readStates(b.page));

    const persisted = await a.page.evaluate(() =>
      (window as any).slate.exportJSON(),
    );
    await a.page.evaluate(async (json) => {
      const container = document.createElement("div");
      container.id = "reloadCanvas";
      container.style.cssText = "width:1000px;height:700px";
      document.body.appendChild(container);
      const sb = (window as any).Slatebox;
      (window as any).reloaded = await new sb.slate(
        { container: "reloadCanvas", allowCollaboration: false },
        {},
      ).init();
      await (window as any).reloaded.loadJSON(json);
    }, persisted);
    expectPathStates(await readStates(a.page, "reloaded"));

    await a.page.evaluate(() => {
      const s = (window as any).slate.v2;
      const pkg = {
        type: "onNodeShapeChanged",
        data: {
          id: "rectangle-node",
          shape: "roundedrectangle",
          vectorPath: "roundedrectangle",
        },
      };
      s.collab.invoke(pkg);
      s.collab.send(pkg);
    });
    await b.page.waitForFunction(
      () =>
        (window as any).slate.v2.nodes.one("rectangle-node")?.options.shape ===
        "roundedrectangle",
    );
    await a.page.waitForTimeout(650);

    for (const client of [a, b]) {
      const changed = await client.page.evaluate(() => {
        const node = (window as any).slate.v2.nodes.one("rectangle-node");
        return {
          shape: node.options.shape,
          path: node.contentPath?.attr?.("d") || null,
          proxies: node.svgGroup.node.querySelectorAll("[data-resize-proxy]")
            .length,
        };
      });
      expect(changed.shape).toBe("roundedrectangle");
      expect(changed.path).toContain("Q");
      expect(changed.proxies).toBe(1);
    }

    expect(
      await a.page.evaluate(() => (window as any).slate.v2.undoRedo.undo()),
    ).toBe(true);
    for (const client of [a, b]) {
      await client.page.waitForFunction(
        () =>
          (window as any).slate.v2.nodes.one("rectangle-node")?.options
            .shape === "rectangle",
      );
      const state = (await readStates(client.page))[0];
      expect(state.path).toContain("H 100 V 60");
    }

    expect(
      await a.page.evaluate(() => (window as any).slate.v2.undoRedo.redo()),
    ).toBe(true);
    for (const client of [a, b]) {
      await client.page.waitForFunction(
        () =>
          (window as any).slate.v2.nodes.one("rectangle-node")?.options
            .shape === "roundedrectangle",
      );
      const state = (await readStates(client.page))[0];
      expect(state.path).toContain("Q");
    }
  } finally {
    await Promise.all([a.context.close(), b.context.close()]);
  }
});
