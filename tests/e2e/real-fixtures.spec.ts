import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import { join } from "path";

// §G of docs/drop-in-contract.md: REAL slate documents from slatebox.com
// production data (extracted from the slatebox repo's internal templates,
// stored at tests/fixtures/real-slates/) must load, render, and round-trip
// through the v1 facade without loss.

const FIXTURES = join(__dirname, "..", "fixtures", "real-slates");

const loadFixture = (name: string) =>
  JSON.parse(readFileSync(join(FIXTURES, name), "utf8"));

const countAssociations = (doc: any) =>
  (doc.nodes || []).reduce(
    (sum: number, n: any) =>
      sum + (n.relationships?.associations?.length || 0),
    0
  );

async function loadInBrowser(page: any, doc: any) {
  return page.evaluate(async (slateDoc: any) => {
    const div = document.createElement("div");
    div.id = "slateCanvas";
    div.style.width = "1000px";
    div.style.height = "700px";
    document.body.appendChild(div);

    const sb = (window as any).Slatebox;
    const s = await new sb.slate(
      { container: "slateCanvas", allowCollaboration: false },
      {}
    ).init();
    await s.loadJSON(JSON.stringify(slateDoc));
    // Allow deferred rendering (fitToContent timer etc.) to settle
    await new Promise((r) => setTimeout(r, 500));
    (window as any).__slate = s;

    const nodes = s.nodes.allNodes;
    return {
      nodeCount: nodes.length,
      slateName: s.v2.options.name,
      assocCount: nodes.reduce(
        (sum: number, n: any) => sum + n.relationships.associations.length,
        0
      ),
      svgGroups: div.querySelectorAll("svg g[data-node-id], svg g").length > 0,
    };
  }, doc);
}

test.describe("real slatebox.com fixtures (§G)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("flowchart (9 nodes, 12 associations) loads with positions intact", async ({
    page,
  }) => {
    const doc = loadFixture("flowchart.json");
    const result = await loadInBrowser(page, doc);

    expect(result.nodeCount).toBe(doc.nodes.length);
    expect(result.assocCount).toBe(countAssociations(doc));
    expect(result.slateName).toBe(doc.options.name);

    // Node identity + position fidelity via the v1 facade surface
    const probe = doc.nodes[0];
    const facadeView = await page.evaluate((id: string) => {
      const s = (window as any).__slate;
      const n = s.nodes.one(id);
      return n
        ? {
            xPos: n.v2.options.x,
            yPos: n.v2.options.y,
            width: n.v2.options.width,
            text: n.v2.options.text,
            backgroundColor: n.v2.options.backgroundColor,
          }
        : null;
    }, probe.options.id);

    expect(facadeView).not.toBeNull();
    expect(facadeView!.xPos).toBeCloseTo(probe.options.xPos, 3);
    expect(facadeView!.yPos).toBeCloseTo(probe.options.yPos, 3);
    expect(facadeView!.width).toBeCloseTo(probe.options.width, 3);
    expect(facadeView!.text).toBe(probe.options.text);
    expect(facadeView!.backgroundColor).toBe(probe.options.backgroundColor);
  });

  test("flowchart round-trips: exportJSON → fresh slate → identical content", async ({
    page,
  }) => {
    const doc = loadFixture("flowchart.json");
    await loadInBrowser(page, doc);

    const roundTrip = await page.evaluate(async () => {
      const s = (window as any).__slate;
      const exported = s.exportJSON();

      const div2 = document.createElement("div");
      div2.id = "slateCanvas2";
      div2.style.width = "1000px";
      div2.style.height = "700px";
      document.body.appendChild(div2);

      const sb = (window as any).Slatebox;
      const s2 = await new sb.slate(
        { container: "slateCanvas2", allowCollaboration: false },
        {}
      ).init();
      await s2.loadJSON(exported);
      await new Promise((r) => setTimeout(r, 400));

      const ex = JSON.parse(exported);
      return {
        exportedNodeCount: ex.nodes.length,
        reloadedNodeCount: s2.nodes.allNodes.length,
        exportedHasXPos: ex.nodes.every(
          (n: any) => typeof n.options.xPos === "number"
        ),
        positionsMatch: s2.nodes.allNodes.every((n2: any) => {
          const orig = (window as any).__slate.nodes.one(n2.options.id);
          return (
            orig &&
            Math.abs(orig.v2.options.x - n2.v2.options.x) < 0.001 &&
            Math.abs(orig.v2.options.y - n2.v2.options.y) < 0.001
          );
        }),
        assocsMatch:
          s2.nodes.allNodes.reduce(
            (sum: number, n: any) =>
              sum + n.relationships.associations.length,
            0
          ) ===
          (window as any).__slate.nodes.allNodes.reduce(
            (sum: number, n: any) =>
              sum + n.relationships.associations.length,
            0
          ),
      };
    });

    expect(roundTrip.exportedNodeCount).toBe(doc.nodes.length);
    expect(roundTrip.reloadedNodeCount).toBe(doc.nodes.length);
    // exportJSON writes v1 field names (Mongo persistence shape)
    expect(roundTrip.exportedHasXPos).toBe(true);
    expect(roundTrip.positionsMatch).toBe(true);
    expect(roundTrip.assocsMatch).toBe(true);
  });

  test("workflow template (20 nodes, custom vectorPaths) loads", async ({
    page,
  }) => {
    const doc = loadFixture("workflow.json");
    const result = await loadInBrowser(page, doc);
    expect(result.nodeCount).toBe(doc.nodes.length);
  });

  test("loading is silent — no onSlateChanged spam during loadJSON", async ({
    page,
  }) => {
    const doc = loadFixture("connected-small.json");
    const emitted = await page.evaluate(async (slateDoc: any) => {
      const div = document.createElement("div");
      div.id = "slateCanvasSilent";
      document.body.appendChild(div);

      const received: any[] = [];
      const sb = (window as any).Slatebox;
      const s = await new sb.slate(
        { container: "slateCanvasSilent", allowCollaboration: false },
        { onSlateChanged: (pkg: any) => received.push(pkg.type) }
      ).init();
      await s.loadJSON(JSON.stringify(slateDoc));
      await new Promise((r) => setTimeout(r, 400));
      return received;
    }, doc);

    expect(emitted).toEqual([]);
  });

  test("fishbone stress fixture (384 nodes) loads completely", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const doc = loadFixture("fishbone.json");
    const result = await loadInBrowser(page, doc);
    expect(result.nodeCount).toBe(doc.nodes.length);
  });
});
