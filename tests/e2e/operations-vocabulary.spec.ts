import { test, expect } from "@playwright/test";

// P10: the common-jobs vocabulary (connected notes, presets, link, effect,
// group, order, duplicate, layouts, slate settings). As in
// operations-round-trip.spec.ts: what the JSON applier stores is what a reload
// reads back and what the live applier leaves on an open canvas. Then the
// canvas's own controls (link dialog, effect picker, Group, Bring to front)
// store exactly what the same change written as a plan stores.

const setup = async (page: any) => {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
};

test("the vocabulary round-trips: stored JSON, a reload and the live canvas agree", async ({ page }) => {
  await setup(page);
  const result = await page.evaluate(async () => {
    const sb = (window as any).Slatebox;
    const ops = await import("/src/operations/index.ts");
    const { applySlateOperations } = await import("/src/core/SlateOperations.ts");
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const make = async (id: string, left: number) => {
      const div = document.createElement("div");
      div.id = id;
      div.style.cssText = `width:600px;height:500px;position:fixed;top:0;left:${left}px;z-index:1000;background:#fff`;
      document.body.appendChild(div);
      return new sb.slate({ container: id, allowCollaboration: false }, {}).init();
    };

    const live = await make("liveCanvas", 0);
    const a = live.nodes.add(new sb.node({ id: "a", xPos: 100, yPos: 100, width: 180, height: 100, text: "Alpha", backgroundColor: "#ff8800", borderColor: "#112233", borderWidth: 4, fontFamily: "Georgia", fontSize: 28 }));
    const b = live.nodes.add(new sb.node({ id: "b", xPos: 120, yPos: 120, width: 180, height: 100, text: "Beta" }));
    live.nodes.add(new sb.node({ id: "c", xPos: 140, yPos: 140, width: 180, height: 100, text: "Gamma" }));
    await wait(400);
    a.v2.relationships.addAssociation(b.v2);
    await wait(200);

    const plan = {
      message: "Done.",
      operations: [
        { kind: "add_nodes", count: 1, text: "Below", ids: ["k1"], placement: { relativeTo: "a", direction: "below", connect: true } },
        { kind: "add_nodes", count: 1, preset: "sticky", text: "Idea", ids: ["s1"], x: 900, y: 100 },
        { kind: "add_nodes", count: 1, preset: "text", text: "Label", ids: ["t1"], x: 900, y: 400 },
        { kind: "update_nodes", target: { ids: ["a"] }, changes: { link: "https://slatebox.com/docs", effect: "dropShadow", textOpacity: 0.6 } },
        { kind: "update_nodes", target: { ids: ["b", "c"] }, changes: { groupId: "grp-agent" } },
        { kind: "update_nodes", target: { ids: ["a"] }, changes: { order: "front" } },
        { kind: "duplicate_nodes", target: { ids: ["a", "b"] }, ids: ["a2", "b2"], offset: { x: 0, y: 600 } },
        { kind: "arrange_nodes", target: { ids: ["a", "b", "c", "k1"] }, layout: "tree" },
        { kind: "update_slate", changes: { mindMapMode: true, autoResizeNodesBasedOnText: false, showGrid: true, snapToObjects: true, defaultLineColor: "#ff0055" } },
      ],
    };

    const stored = JSON.parse(live.exportJSON());
    const applied = ops.applyPlanToJSON(stored, plan, {});
    const reloaded = await make("reloadCanvas", 620);
    await reloaded.loadJSON(JSON.stringify(applied.slate));
    await wait(800);
    const readBack = JSON.parse(reloaded.exportJSON());

    await applySlateOperations(live, applied.materializedPlan, { replay: true }).applied;
    await wait(1500);
    const liveAfter = JSON.parse(live.exportJSON());

    const keys = Object.keys(ops.NODE_KEYS);
    const round = (key: string, value: any) => (["x", "y", "width", "height"].includes(key) && typeof value === "number" ? Math.round(value) : value);
    const view = (slate: any) => ({
      order: slate.nodes.map((node: any) => node.options.id),
      notes: Object.fromEntries(
        slate.nodes.map((node: any) => [node.options.id, Object.fromEntries(keys.map((key) => [key, round(key, ops.NODE_KEYS[key].read(node.options))]))]),
      ),
      connectors: slate.nodes
        .flatMap((node: any) => node.relationships.associations)
        .map((x: any) => ({ id: x.id, parentId: x.parentId, childId: x.childId, lineColor: x.lineColor }))
        .sort((p: any, q: any) => p.id.localeCompare(q.id)),
      settings: [
        slate.options.mindMapMode, slate.options.autoResizeNodesBasedOnText, slate.options.viewPort?.showGrid,
        slate.options.viewPort?.snapToObjects, slate.options.defaultLineColor,
      ],
    });
    return { expected: view(applied.slate), readBack: view(readBack), live: view(liveAfter), report: applied.report };
  });

  expect(result.report.created).toEqual(["k1", "s1", "t1", "a2", "b2"]);
  expect(result.report.connected).toEqual(["a->k1", "a2->b2"]);
  expect(result.expected.notes.k1).toMatchObject({ backgroundColor: "#ff8800", borderColor: "#112233", borderWidth: 4, fontFamily: "Georgia", fontSize: 28 });
  expect(result.expected.notes.s1).toMatchObject({ shape: "roundedrectangle", effect: "postItNote", backgroundColor: "#fdeea6" });
  expect(result.expected.notes.a).toMatchObject({ link: "https://slatebox.com/docs", effect: "dropShadow", textOpacity: 0.6 });
  expect(result.expected.notes.b.groupId).toBe("grp-agent");
  expect(result.expected.order.slice(0, 6)).toEqual(["b", "c", "k1", "s1", "t1", "a"]);
  expect(result.expected.settings).toEqual([true, false, true, true, "#ff0055"]);
  expect(result.readBack).toEqual(result.expected);
  expect(result.live).toEqual(result.expected);
});

test("the canvas's own controls store what the same change written as a plan stores", async ({ page }) => {
  await setup(page);
  const result = await page.evaluate(async () => {
    const sb = (window as any).Slatebox;
    const ops = await import("/src/operations/index.ts");
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const div = document.createElement("div");
    div.id = "uiCanvas";
    div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
    document.body.appendChild(div);
    const s = await new sb.slate({ container: "uiCanvas", allowCollaboration: false }, {}).init();
    const a = s.nodes.add(new sb.node({ id: "a", xPos: 100, yPos: 100, width: 180, height: 100, text: "Alpha" }));
    const b = s.nodes.add(new sb.node({ id: "b", xPos: 400, yPos: 100, width: 180, height: 100, text: "Beta" }));
    s.nodes.add(new sb.node({ id: "c", xPos: 700, yPos: 100, width: 180, height: 100, text: "Gamma" }));
    await wait(400);
    const before = JSON.parse(s.exportJSON());

    // A person: the link dialog, the effect picker, the text pane's opacity,
    // Group, and Bring to front, each through the package that control sends.
    s.collab.invoke({ type: "onNodeLinkAdded", data: { id: "a", link: { show: true, type: "url", data: "https://slatebox.com" } } });
    s.collab.invoke({ type: "onNodeEffectChanged", data: { id: "a", filter: { apply: "vect", id: "blur" } } });
    s.collab.invoke({ type: "onNodeTextChanged", data: { id: "a", textOpacity: 0.3 } });
    s.v2.groupNodes([a.v2, b.v2]);
    a.v2.toFront();
    await wait(300);
    const byPerson = JSON.parse(s.exportJSON());

    // An agent: read those keys back from the person's slate and write them as a plan.
    const person = (id: string) => byPerson.nodes.find((n: any) => n.options.id === id).options;
    const read = (id: string, key: string) => ops.NODE_KEYS[key].read(person(id));
    const plan = {
      message: "Same as the person.",
      operations: [
        { kind: "update_nodes", target: { ids: ["a"] }, changes: { link: read("a", "link"), effect: read("a", "effect"), textOpacity: read("a", "textOpacity") } },
        { kind: "update_nodes", target: { ids: ["a", "b"] }, changes: { groupId: read("a", "groupId") } },
        { kind: "update_nodes", target: { ids: ["a"] }, changes: { order: "front" } },
      ],
    };
    const byAgent = ops.applyPlanToJSON(before, plan, {}).slate;
    const keys = ["link", "effect", "textOpacity", "groupId"];
    const view = (slate: any) => ({
      order: slate.nodes.map((n: any) => n.options.id),
      notes: slate.nodes.map((n: any) => [n.options.id, ...keys.map((key) => ops.NODE_KEYS[key].read(n.options))]),
      linkShape: slate.nodes.find((n: any) => n.options.id === "a").options.link,
    });
    return { person: view(byPerson), agent: view(byAgent) };
  });

  expect(result.person.order).toEqual(["b", "c", "a"]);
  expect(result.person.linkShape).toEqual({ show: true, type: "url", data: "https://slatebox.com" });
  expect(result.agent).toEqual(result.person);
});
