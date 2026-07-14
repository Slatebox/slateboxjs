import {
  test,
  expect,
  type Browser,
  type BrowserContext,
  type Page,
} from "@playwright/test";

type Client = { context: BrowserContext; page: Page };

const THEME_PATH = "M0 50L50 0L100 50L50 100Z";

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

async function seed(client: Client): Promise<void> {
  await client.page.evaluate(async () => {
    const s = (window as any).slate.v2;
    s.beginRemoteApply();
    const node = s.addNode({
      id: "theme-node",
      x: 120,
      y: 120,
      width: 180,
      height: 110,
      text: "Theme me",
      shape: "rectangle",
      backgroundColor: "#eeeeee",
      borderColor: "#222222",
      borderWidth: 1,
      fontColor: "#111111",
      fontSize: 14,
    });
    if (node.ready) await node.ready;
    s.endRemoteApply();
    s.undoRedo.clear();
    s.undoRedo.forceSnapshot();
  });
}

async function readState(page: Page) {
  return page.evaluate(() => {
    const node = (window as any).slate.v2.nodes.one("theme-node");
    const path = node?.contentPath;
    return {
      shape: node?.options.shape,
      vectorPath: node?.options.vectorPath,
      backgroundColor: node?.options.backgroundColor,
      borderColor: node?.options.borderColor,
      borderWidth: node?.options.borderWidth,
      borderStyle: node?.options.borderStyle,
      fontColor: node?.options.fontColor,
      fontFamily: node?.options.fontFamily,
      fontSize: node?.options.fontSize,
      fontStyle: node?.options.fontStyle,
      renderedFontStyle: node?.textElement?.attr?.("font-style") || null,
      opacity: node?.options.opacity,
      vectFilter: node?.options.filters?.vect,
      renderedPath: path?.attr?.("d") || null,
      renderedFilter: (node?.backgroundRect as any)?.attr?.("filter") || null,
    };
  });
}

test("saved theme shape/style renders, reloads, collaborates, and undo/redoes", async ({
  browser,
}) => {
  test.setTimeout(90_000);
  const room = `theme-room-${Math.random().toString(36).slice(2)}`;
  const a = await createClient(browser, room, "Theme A");
  const b = await createClient(browser, room, "Theme B");

  try {
    await seed(a);
    await seed(b);

    await a.page.evaluate((path) => {
      const s = (window as any).slate.v2;
      const pkg = {
        type: "onSlateThemeChanged",
        data: {
          syncWithTheme: true,
          theme: {
            _id: "shape-theme",
            name: "Shape theme",
            styles: {
              parent: {
                vectorPath: path,
                backgroundColor: "#1355aa",
                foregroundColor: "#ffffff",
                opacity: 0.75,
                borderColor: "#ffeb3b",
                borderWidth: 6,
                borderStyle: "dashed",
                borderOpacity: 0.8,
                fontFamily: "Bangers",
                fontSize: 28,
                fontStyle: "italic",
                textOpacity: 0.9,
                filters: { vect: "postItNote" },
              },
            },
          },
        },
      };
      s.collab.invoke(pkg);
      s.collab.send(pkg);
    }, THEME_PATH);

    await b.page.waitForFunction(
      (path) =>
        (window as any).slate.v2.nodes.one("theme-node")?.options.vectorPath ===
        path,
      THEME_PATH
    );
    await a.page.waitForTimeout(650);

    for (const client of [a, b]) {
      const themed = await readState(client.page);
      expect(themed).toMatchObject({
        vectorPath: THEME_PATH,
        backgroundColor: "#1355aa",
        borderColor: "#ffeb3b",
        borderWidth: 6,
        borderStyle: "dashed",
        fontColor: "#ffffff",
        fontFamily: "Bangers",
        fontSize: 28,
        fontStyle: "italic",
        renderedFontStyle: "italic",
        opacity: 0.75,
        vectFilter: "postItNote",
      });
      expect(themed.renderedPath).toBeTruthy();
      expect(themed.renderedFilter).toContain("drop-shadow");
    }

    const persisted = await a.page.evaluate(() =>
      (window as any).slate.exportJSON()
    );
    const reloaded = await a.page.evaluate(async (json) => {
      const div = document.createElement("div");
      div.id = "reloadCanvas";
      div.style.cssText = "width:900px;height:700px";
      document.body.appendChild(div);
      const sb = (window as any).Slatebox;
      const slate = await new sb.slate(
        { container: "reloadCanvas", allowCollaboration: false },
        {}
      ).init();
      await slate.loadJSON(json);
      const node = slate.v2.nodes.one("theme-node");
      return {
        vectorPath: node.options.vectorPath,
        borderStyle: node.options.borderStyle,
        vectFilter: node.options.filters?.vect,
        fontStyle: node.options.fontStyle,
        renderedFontStyle: node.textElement?.attr?.("font-style") || null,
        renderedPath: node.contentPath?.attr?.("d") || null,
      };
    }, persisted);
    expect(reloaded).toMatchObject({
      vectorPath: THEME_PATH,
      borderStyle: "dashed",
      vectFilter: "postItNote",
      fontStyle: "italic",
      renderedFontStyle: "italic",
    });
    expect(reloaded.renderedPath).toBeTruthy();

    expect(
      await a.page.evaluate(() => (window as any).slate.v2.undoRedo.undo())
    ).toBe(true);
    for (const client of [a, b]) {
      await client.page.waitForFunction(
        () =>
          (window as any).slate.v2.nodes.one("theme-node")?.options.shape ===
          "rectangle"
      );
      expect(await readState(client.page)).toMatchObject({
        shape: "rectangle",
        backgroundColor: "#eeeeee",
        borderWidth: 1,
        fontSize: 14,
      });
    }

    expect(
      await a.page.evaluate(() => (window as any).slate.v2.undoRedo.redo())
    ).toBe(true);
    for (const client of [a, b]) {
      await client.page.waitForFunction(
        (path) =>
          (window as any).slate.v2.nodes.one("theme-node")?.options.vectorPath ===
          path,
        THEME_PATH
      );
      expect(await readState(client.page)).toMatchObject({
        vectorPath: THEME_PATH,
        borderWidth: 6,
        fontSize: 28,
        vectFilter: "postItNote",
      });
    }
  } finally {
    await Promise.all([a.context.close(), b.context.close()]);
  }
});
