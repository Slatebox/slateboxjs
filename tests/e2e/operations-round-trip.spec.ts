import { test, expect } from "@playwright/test";

// slateboxjs/operations writes stored JSON on a server; the engine loads that
// JSON in a browser. Every key the JSON applier writes must be read back by
// the loader, and the live applier on an open canvas must end in the same
// state as the stored JSON (what a reload shows equals what was on screen).

test("every key the JSON applier writes is read back by the loader, and the live canvas agrees", async ({ page }) => {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
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
    const a = live.nodes.add(new sb.node({ id: "a", xPos: 100, yPos: 100, width: 180, height: 100, text: "Alpha" }));
    const b = live.nodes.add(new sb.node({ id: "b", xPos: 400, yPos: 100, width: 180, height: 100, text: "Beta" }));
    live.nodes.add(new sb.node({ id: "c", xPos: 700, yPos: 100, width: 180, height: 100, text: "Gamma" }));
    await wait(400);
    a.v2.relationships.addAssociation(b.v2);
    await wait(200);

    const plan = {
      message: "Done.",
      operations: [
        {
          kind: "add_nodes", count: 1, shape: "ellipse", text: "New", ids: ["x1"], x: 120, y: 400, width: 200, height: 120,
          style: {
            rotationAngle: 30, textXAlign: "left", textYAlign: "top", animation: "pulse", fontFamily: "georgia", fontSize: 24,
            backgroundColor: "#224466", foregroundColor: "#ffffff", borderColor: "#ff0000", borderWidth: 3, borderOpacity: 0.5,
            borderStyle: "dashed", opacity: 0.9,
          },
        },
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["x1"] }, style: { label: "to new" } },
        {
          kind: "update_nodes", target: { ids: ["a"] },
          changes: {
            text: "Start", shape: "star", x: 150, y: 160, width: 220, height: 140, rotationAngle: 45, backgroundColor: "#112233",
            foregroundColor: "#000000", borderColor: "#00ff00", borderWidth: 2, borderOpacity: 0.7, borderStyle: "dotted", opacity: 0.8,
            fontFamily: "Roboto", fontSize: 30, textXAlign: "right", textYAlign: "bottom", animation: "breathe", locked: true,
          },
        },
        { kind: "connect_nodes", from: { ids: ["c"] }, to: { point: { x: 950, y: 300 } }, ids: ["c-loose"] },
        { kind: "update_connections", connectionIds: ["a->b"], changes: { label: "leads to", lineColor: "#ff0055", lineWidth: 5, lineType: "orthogonal", showParentArrow: true } },
        { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["c"] } },
        { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["c"] } },
        { kind: "disconnect_nodes", from: { ids: ["c"] }, to: { ids: ["b"] } },
        { kind: "update_slate", changes: { name: "Round trip", description: "Every key", background: { color: "#102030", gradient: { type: "radial", colors: ["#102030", "#405060"], direction: "vertical" } } } },
      ],
    };
    const userMessage = "change the background";

    // Server side: apply to stored JSON, then load it into a fresh canvas.
    const stored = JSON.parse(live.exportJSON());
    const applied = ops.applyPlanToJSON(stored, plan, { userMessage });
    const reloaded = await make("reloadCanvas", 620);
    await reloaded.loadJSON(JSON.stringify(applied.slate));
    await wait(800);
    const readBack = JSON.parse(reloaded.exportJSON());

    // Browser side: the run listener applies the materialized plan live.
    const liveResult = applySlateOperations(live, applied.materializedPlan, { userMessage, replay: true });
    await wait(1200);
    const liveAfter = JSON.parse(live.exportJSON());

    const keys = Object.keys(ops.NODE_KEYS);
    const notes = (slate: any) =>
      Object.fromEntries(
        slate.nodes.map((node: any) => [node.options.id, Object.fromEntries(keys.map((key) => [key, ops.NODE_KEYS[key].read(node.options)]))]),
      );
    const connectors = (slate: any) =>
      slate.nodes
        .flatMap((node: any) => node.relationships.associations)
        .map((a: any) => ({ id: a.id, parentId: a.parentId, childId: a.childId, label: a.label ?? "", lineColor: a.lineColor, lineWidth: a.lineWidth, lineType: a.lineType, showParentArrow: a.showParentArrow ?? false, targetPoint: a.targetPoint ?? null }))
        .sort((x: any, y: any) => x.id.localeCompare(y.id));
    const background = (slate: any) => {
      const style = slate.options.containerStyle || {};
      return [style.backgroundColor, style.backgroundColorAsGradient, style.backgroundGradientType, style.backgroundGradientColors, style.backgroundGradientStrategy, slate.options.name, slate.options.description];
    };
    return {
      expected: { notes: notes(applied.slate), connectors: connectors(applied.slate), background: background(applied.slate) },
      readBack: { notes: notes(readBack), connectors: connectors(readBack), background: background(readBack) },
      live: { notes: notes(liveAfter), connectors: connectors(liveAfter), background: background(liveAfter) },
      report: applied.report,
      liveReport: liveResult.report,
      domRotation: (reloaded.v2.nodes.one("a") as any).getRotation(),
    };
  });

  // The stored JSON holds what the plan asked for.
  expect(result.expected.notes.a).toMatchObject({ rotationAngle: 45, locked: true, fontFamily: "Roboto", shape: "star", animation: "breathe", x: 150, y: 160 });
  expect(result.expected.notes.x1).toMatchObject({ rotationAngle: 30, fontFamily: "Georgia", borderStyle: "dashed", x: 120, y: 400 });
  expect(result.report.connected).toEqual(["a->x1", "c-loose", "b->c"]);
  expect(result.report.operations[6]).toMatchObject({ matched: ["b->c"], changed: [] });
  expect(result.report.disconnected).toEqual(["b->c"]);
  // A reload reads back every key the applier wrote.
  expect(result.readBack).toEqual(result.expected);
  expect(result.domRotation).toBe(45);
  // The live canvas ends where the stored JSON ends.
  expect(result.live).toEqual(result.expected);
  expect(result.liveReport.created).toEqual(["x1"]);
});
