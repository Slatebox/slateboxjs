import { test, expect } from "@playwright/test";

// Proves §A against the real built bundle: window.Slatebox exists with the
// v1 namespace shape, and the v1 idiom
//   const s = await new Slatebox.slate({ container: 'slateCanvas' }, {}).init()
//   s.nodes.add(new Slatebox.node({ ... }))
// renders real nodes on the canvas.
test.describe("v1 compat facade (window.Slatebox)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("window.Slatebox has the v1 namespace shape", async ({ page }) => {
    const shape = await page.evaluate(() => {
      const sb = (window as any).Slatebox;
      return {
        slate: typeof sb.slate,
        node: typeof sb.node,
        base: typeof sb.base,
        guid: typeof sb.utils?.guid,
      };
    });
    expect(shape).toEqual({
      slate: "function",
      node: "function",
      base: "function",
      guid: "function",
    });
  });

  test("v1 idiom creates a working slate with nodes", async ({ page }) => {
    const result = await page.evaluate(async () => {
      // The Meteor app mounts into a bare div located by element id
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.width = "800px";
      div.style.height = "600px";
      document.body.appendChild(div);

      const sb = (window as any).Slatebox;
      const s = await new sb.slate(
        { container: "slateCanvas", name: "compat test" },
        {}
      ).init();

      const n1 = new sb.node({
        id: "c1",
        xPos: 100,
        yPos: 100,
        width: 120,
        height: 80,
        text: "facade A",
      });
      s.nodes.add(n1);
      s.nodes.add(new sb.node({ id: "c2", xPos: 300, yPos: 150, text: "facade B" }));

      // Give async node creation a beat
      await new Promise((r) => setTimeout(r, 500));

      return {
        initResolvedToSlate: !!s && typeof s.exportJSON === "function",
        nodeCount: s.nodes.allNodes.length,
        oneIsSame: s.nodes.one("c1") === n1,
        svgRendered: div.querySelectorAll("svg").length > 0,
        exportParses: !!JSON.parse(s.exportJSON()),
      };
    });

    expect(result.initResolvedToSlate).toBe(true);
    expect(result.nodeCount).toBe(2);
    expect(result.oneIsSame).toBe(true);
    expect(result.svgRendered).toBe(true);
    expect(result.exportParses).toBe(true);
  });

  test("onSlateChanged fires with v1-shaped packages; remote applies are suppressed", async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.width = "800px";
      div.style.height = "600px";
      document.body.appendChild(div);

      const received: any[] = [];
      const sb = (window as any).Slatebox;
      const s = await new sb.slate(
        { container: "slateCanvas", instance: "inst-1" },
        {
          onSlateChanged: (pkg: any, users: any[]) => {
            received.push({ pkg, usersIsArray: Array.isArray(users) });
          },
        }
      ).init();

      // Local add → onNodeAdded with v1-shaped nodeOptions
      const n = s.nodes.add(
        new sb.node({ id: "ev1", xPos: 120, yPos: 90, text: "before" })
      );
      await new Promise((r) => setTimeout(r, 400));

      // Local text change → onNodeTextChanged
      n.v2.setText("after");

      // Remote apply via collab.exe must NOT emit (echo suppression)
      const countBeforeRemote = received.length;
      s.v2.collab.exe({
        type: "onNodeTextChanged",
        data: { id: "ev1", text: "from-remote" },
      });

      // Local delete → onNodeDeleted with id + isComment
      s.v2.removeNode("ev1");

      return {
        types: received.map((r: any) => r.pkg.type),
        addedPkg: received.find((r: any) => r.pkg.type === "onNodeAdded")?.pkg,
        textPkg: received.find((r: any) => r.pkg.type === "onNodeTextChanged")
          ?.pkg,
        deletedPkg: received.find((r: any) => r.pkg.type === "onNodeDeleted")
          ?.pkg,
        usersAlwaysArray: received.every((r: any) => r.usersIsArray),
        remoteEmitted: received
          .slice(countBeforeRemote)
          .some(
            (r: any) =>
              r.pkg.type === "onNodeTextChanged" &&
              r.pkg.data.text === "from-remote"
          ),
      };
    });

    expect(result.types).toContain("onNodeAdded");
    expect(result.types).toContain("onNodeTextChanged");
    expect(result.types).toContain("onNodeDeleted");
    // v1 package shape: {type, data, instanceId}
    expect(result.addedPkg.instanceId).toBe("inst-1");
    expect(result.addedPkg.data.nodeOptions.xPos).toBe(120);
    expect(result.addedPkg.data.nodeOptions.yPos).toBe(90);
    expect(result.textPkg.data).toMatchObject({ id: "ev1", text: "after" });
    expect(result.deletedPkg.data).toMatchObject({
      id: "ev1",
      isComment: false,
    });
    expect(result.usersAlwaysArray).toBe(true);
    // The remote-applied text change must not have been echoed back
    expect(result.remoteEmitted).toBe(false);
  });
});
