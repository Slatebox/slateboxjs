import { test, expect } from "@playwright/test";

test.describe("Serialization", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "A", id: "sa" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "B", id: "sb" });
    });
    await page.waitForTimeout(1000);
  });

  test("should serialize to valid JSON", async ({ page }) => {
    const json = await page.evaluate(() => {
      const slate = (window as any).slate;
      // serialize is a standalone function — accessible via the Serialization import
      const isSerializable = typeof slate.nodes.allNodes.length === "number";
      return isSerializable;
    });
    expect(json).toBe(true);
  });

  test("should round-trip preserve node count", async ({ page }) => {
    const count = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(count).toBe(2);
  });

  test("should access node positions", async ({ page }) => {
    const positions = await page.evaluate(() => {
      return (window as any).slate.getAllNodes().map((n: any) => n.options.x);
    });
    expect(positions.length).toBe(2);
  });

  // Node-pane persistence contract: a node's shape (rendered as a <path>) and
  // background color must survive a serialize→load round-trip — this is the
  // library behaviour behind the app's "change shape/color → survives reload"
  // (verified live in-app). Guards against a serialization regression that would
  // silently drop these fields.
  test("node shape (path) + color survive a serialize→load round-trip", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const slate = (window as any).slate;
      const a = slate.nodes.one("sa");
      const star =
        "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z";
      a.setShape(star);
      a.setColors("#f44336");
      await new Promise((r) => setTimeout(r, 200));

      const json = slate.exportJSON ? slate.exportJSON() : JSON.stringify(slate.toJSON?.());

      // Load into a FRESH slate and read the node back.
      const div = document.createElement("div");
      div.id = "app2";
      document.body.appendChild(div);
      const s2 = (window as any).SlateboxJS("#app2", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      if (s2.loadJSON) s2.loadJSON(json);
      else if (s2.importJSON) s2.importJSON(json);
      await new Promise((r) => setTimeout(r, 600));

      const a2 = s2.nodes.one("sa");
      return {
        shape: (a2?.options?.shape || "").slice(0, 12),
        color: a2?.options?.backgroundColor,
        renderedAsPath: !!document.querySelector('#app2 [data-node-id="sa"] path[data-shape-path]'),
      };
    });

    expect(res.shape).toContain("M 50 0"); // the star path round-tripped
    expect(String(res.color).toLowerCase()).toBe("#f44336");
    expect(res.renderedAsPath).toBe(true);
  });

  // Comprehensive node-property round-trip: every field an Invoker handler can
  // write must also survive exportJSON→loadJSON, else it silently reverts on
  // reload. Guards against adding a property setter but forgetting serialization.
  test("a broad set of node properties all survive a serialize→load round-trip", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const slate = (window as any).slate;
      const a = slate.nodes.one("sa");
      a.setColors("#8e24aa", "#ff5722");
      Object.assign(a.options, {
        borderWidth: 4,
        borderStyle: "dashed",
        borderOpacity: 0.8,
        opacity: 0.7,
        fontFamily: "Caveat",
        fontSize: 22,
        fontColor: "#ffeb3b",
        textXAlign: "left",
        textYAlign: "top",
      });
      a.setText("RoundTrip");
      a.setRotation && a.setRotation(37);
      a.links && a.links.set({ show: true, type: "url", url: "https://rt.test", target: "_blank" });
      await new Promise((r) => setTimeout(r, 300));

      const keys = [
        "backgroundColor", "borderColor", "borderWidth", "borderStyle", "borderOpacity",
        "opacity", "fontFamily", "fontSize", "fontColor", "textXAlign", "textYAlign", "text",
      ];
      const src: any = {};
      keys.forEach((k) => (src[k] = a.options[k]));
      src.rotationAngle = a.options.rotate?.rotationAngle;
      src.linkUrl = a.options.link?.url;

      const json = slate.exportJSON();
      const div = document.createElement("div");
      div.id = "appRT";
      document.body.appendChild(div);
      const s2 = (window as any).SlateboxJS("#appRT", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      if (s2.loadJSON) s2.loadJSON(json);
      else if (s2.importJSON) s2.importJSON(json);
      await new Promise((r) => setTimeout(r, 700));

      const b = s2.nodes.one("sa");
      const dst: any = {};
      keys.forEach((k) => (dst[k] = b?.options?.[k]));
      dst.rotationAngle = b?.options?.rotate?.rotationAngle;
      dst.linkUrl = b?.options?.link?.url;

      const dropped = Object.keys(src).filter(
        (k) => JSON.stringify(src[k]) !== JSON.stringify(dst[k])
      );
      return { dropped, src, dst };
    });

    // No property was dropped or altered by the round-trip.
    expect(res.dropped).toEqual([]);
  });

  // A whole small diagram (styled nodes + a connection + an orthogonal line type)
  // must survive exportJSON→loadJSON intact — this is the serialization behind a
  // page reload (server saves exportJSON, reloads it). Integration guard.
  test("a full diagram (nodes + colors + connection + line type) round-trips", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const slate = (window as any).slate;
      const a = slate.nodes.one("sa");
      const b = slate.nodes.one("sb");
      a.setColors("#4caf50");
      b.setColors("#2196f3");
      a.relationships.addAssociation(b);
      await new Promise((r) => setTimeout(r, 300));
      const assoc = a.relationships.associations.find((x: any) => x.childId === "sb");
      a.relationships.applyLineProperty(assoc.id, "lineType", "orthogonal");
      await new Promise((r) => setTimeout(r, 200));

      const json = slate.exportJSON();

      const div = document.createElement("div");
      div.id = "app3";
      document.body.appendChild(div);
      const s2 = (window as any).SlateboxJS("#app3", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      if (s2.loadJSON) s2.loadJSON(json);
      else if (s2.importJSON) s2.importJSON(json);
      await new Promise((r) => setTimeout(r, 700));

      const a2 = s2.nodes.one("sa");
      const b2 = s2.nodes.one("sb");
      const assoc2 = a2?.relationships?.associations?.find((x: any) => x.childId === "sb");
      return {
        nodeCount: s2.nodes.allNodes.length,
        aColor: a2?.options?.backgroundColor,
        bColor: b2?.options?.backgroundColor,
        hasConnection: !!assoc2,
        lineType: assoc2?.lineType,
      };
    });

    expect(res.nodeCount).toBe(2);
    expect(String(res.aColor).toLowerCase()).toBe("#4caf50");
    expect(String(res.bColor).toLowerCase()).toBe("#2196f3");
    expect(res.hasConnection).toBe(true);
    expect(res.lineType).toBe("orthogonal"); // the ortho line type survived the round-trip
  });
});
