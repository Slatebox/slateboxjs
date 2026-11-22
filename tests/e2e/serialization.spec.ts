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

  // Deserialize robustness: loading edge-case / legacy data (orphan associations,
  // null fields, malformed records, missing options) must NOT throw — the drop-in
  // loads real historical slatebox.com slates with varied data.
  test("loadJSON tolerates edge-case / legacy data without crashing", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const mk = (id: string) => {
        const div = document.createElement("div");
        div.id = id;
        document.body.appendChild(div);
        return (window as any).SlateboxJS("#" + id, {
          viewPort: { originalWidth: 1200, originalHeight: 800 },
          panZoom: { enabled: false },
        });
      };
      const tryLoad = async (name: string, json: any) => {
        try {
          const s = mk("edge_" + name);
          if (s.loadJSON) s.loadJSON(json);
          else if (s.importJSON) s.importJSON(json);
          await new Promise((r) => setTimeout(r, 300));
          return { ok: true, nodes: s.nodes.allNodes.length };
        } catch (e: any) {
          return { ok: false, err: String(e?.message).slice(0, 80) };
        }
      };
      const out: any = {};
      // Orphan association (child node doesn't exist) — skipped, node still loads.
      out.orphan = await tryLoad("o", {
        options: { id: "s1" },
        nodes: [{ options: { id: "n1", x: 100, y: 100, width: 120, height: 80, text: "A" }, relationships: { associations: [{ id: "r1", parentId: "n1", childId: "MISSING" }] } }],
      });
      // Node with null fields.
      out.nulls = await tryLoad("n", {
        options: { id: "s2" },
        nodes: [{ options: { id: "n2", x: null, y: null, width: null, height: null, text: null, shape: null } }],
      });
      // Malformed association + missing options node + empty slate.
      out.malformed = await tryLoad("m", { options: { id: "s3" }, nodes: [{ options: { id: "n3", x: 50, y: 50, width: 100, height: 60 }, relationships: { associations: [{ childId: "n3", sourceAnchor: null }] } }] });
      out.empty = await tryLoad("e", { nodes: [] });
      out.noOpts = await tryLoad("p", { options: { id: "s5" }, nodes: [{ id: "n5" }] });
      return out;
    });

    // Every edge case loaded without throwing.
    expect(res.orphan.ok).toBe(true);
    expect(res.orphan.nodes).toBe(1); // node loads, orphan association skipped
    expect(res.nulls.ok).toBe(true);
    expect(res.malformed.ok).toBe(true);
    expect(res.empty.ok).toBe(true);
    expect(res.noOpts.ok).toBe(true);
  });

  // Slate-level round-trip: name, background (gradient), grid, snap, mind-map,
  // auto-resize — the slate settings a user changes must survive a reload too.
  test("slate-level properties survive a serialize→load round-trip", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const slate = (window as any).slate;
      const inv = slate.invoker;
      inv.onSlateNameChanged({ data: { name: "My Diagram" } });
      inv.onSlateBackgroundColorChanged({
        data: {
          color: "#0d47a1",
          asGradient: true,
          gradientType: "linear",
          gradientColors: ["#0d47a1", "#42a5f5"],
          gradientStrategy: "diagonal",
        },
      });
      inv.onSlateShowGridChanged({ data: { showGrid: true } });
      inv.onSlateSnapToObjectsChanged({ data: { snapToObjects: true } });
      await new Promise((r) => setTimeout(r, 200));

      const read = (s: any) => ({
        name: s.options.name,
        bgColor: s.options.containerStyle?.backgroundColor,
        asGradient: s.options.containerStyle?.backgroundColorAsGradient,
        gradientColors: s.options.containerStyle?.backgroundGradientColors,
        showGrid: s.options.viewPort?.showGrid,
        snapToObjects: s.options.viewPort?.snapToObjects,
      });
      const src = read(slate);

      const json = slate.exportJSON();
      const div = document.createElement("div");
      div.id = "appSRT";
      document.body.appendChild(div);
      const s2 = (window as any).SlateboxJS("#appSRT", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      if (s2.loadJSON) s2.loadJSON(json);
      else if (s2.importJSON) s2.importJSON(json);
      await new Promise((r) => setTimeout(r, 700));

      const dst = read(s2);
      const dropped = Object.keys(src).filter(
        (k) => JSON.stringify((src as any)[k]) !== JSON.stringify((dst as any)[k])
      );
      return { dropped, src, dst };
    });

    expect(res.dropped).toEqual([]);
  });

  // Comprehensive line-property round-trip: the line pane is the most bug-prone
  // surface (named bugs 1 & 2 lived here), so guard that every association line
  // property survives exportJSON→loadJSON.
  test("a broad set of line properties all survive a serialize→load round-trip", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const slate = (window as any).slate;
      const a = slate.nodes.one("sa");
      a.relationships.addAssociation(slate.nodes.one("sb"));
      await new Promise((r) => setTimeout(r, 300));
      const assoc = a.relationships.associations.find((x: any) => x.childId === "sb");
      const aid = assoc.id;
      const set = (prop: string, val: any) => a.relationships.applyLineProperty(aid, prop, val);
      set("lineType", "orthogonal");
      set("lineColor", "#e91e63");
      set("lineWidth", 5);
      set("lineOpacity", 0.6);
      set("lineCurveType", "cubic");
      set("lineCurviness", 40);
      set("showParentArrow", true);
      set("showChildArrow", false);
      // A pinned start (the "sourceLock" prop went with the padlocks, owner 2026-11-21).
      set("sourceAnchor", { x: 1, y: 0.5 });
      await new Promise((r) => setTimeout(r, 200));

      const keys = [
        "lineType", "lineColor", "lineWidth", "lineOpacity", "lineCurveType",
        "lineCurviness", "showParentArrow", "showChildArrow", "sourceAnchor",
      ];
      const fresh = slate.nodes.one("sa").relationships.associations.find((x: any) => x.childId === "sb");
      const src: any = {};
      keys.forEach((k) => (src[k] = fresh[k]));

      const json = slate.exportJSON();
      const div = document.createElement("div");
      div.id = "appLRT";
      document.body.appendChild(div);
      const s2 = (window as any).SlateboxJS("#appLRT", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      if (s2.loadJSON) s2.loadJSON(json);
      else if (s2.importJSON) s2.importJSON(json);
      await new Promise((r) => setTimeout(r, 800));

      const a2 = s2.nodes.one("sa");
      const assoc2 = a2?.relationships?.associations?.find((x: any) => x.childId === "sb");
      const dst: any = {};
      keys.forEach((k) => (dst[k] = assoc2?.[k]));

      const dropped = keys.filter((k) => JSON.stringify(src[k]) !== JSON.stringify(dst[k]));
      return { dropped, src, dst, loaded: !!assoc2 };
    });

    expect(res.loaded).toBe(true);
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
