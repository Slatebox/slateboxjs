import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Slatebox v1 saved `textOffset` as the measured centre of the shape's bounding
// box relative to the node's top-left corner ({x: 0, y: height / 2, width,
// height}). v3 reads `textOffset` as a nudge away from the shape's centre, so
// a v1 value pushed every legacy label down by half its shape: ellipse labels
// sat on the bottom edge and multi-line labels spilled out of their boxes.
// The fixture keeps the exact geometry of four nodes from a production v1
// slate (rectangle, wide ellipse, circle, tall column) with neutral labels.
const legacySlate = readFileSync(
  join(__dirname, "../fixtures/legacy-text-offset-slate.json"),
  "utf8",
);

type Placement = {
  id: string;
  shapeTop: number;
  shapeBottom: number;
  shapeHeight: number;
  shapeCenterY: number;
  textTop: number;
  textBottom: number;
  textCenterY: number;
  modelHeight: number;
  storedOffset: Record<string, number> | undefined;
};

async function mountSlate(page: Page, json: string) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async (slateJson) => {
    const sb = (window as any).Slatebox;
    const div = document.createElement("div");
    div.id = "slateCanvas";
    div.style.cssText =
      "width:900px;height:640px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
    document.body.appendChild(div);
    const s = await new sb.slate(
      { container: "slateCanvas", allowCollaboration: false },
      {},
    ).init();
    (window as any).__s = s;
    await s.loadJSON(slateJson);
    await new Promise((r) => setTimeout(r, 400));
  }, json);
}

function placements(page: Page): Promise<Placement[]> {
  return page.evaluate(() => {
    const s = (window as any).__s;
    return s.v2.nodes.allNodes.map((n: any) => {
      const shape = n.backgroundRect.node.getBoundingClientRect();
      const text = n.textElement.node.getBoundingClientRect();
      return {
        id: n.id,
        shapeTop: shape.top,
        shapeBottom: shape.bottom,
        shapeHeight: shape.height,
        shapeCenterY: shape.top + shape.height / 2,
        textTop: text.top,
        textBottom: text.bottom,
        textCenterY: text.top + text.height / 2,
        modelHeight: n.options.height,
        storedOffset: n.options.textOffset,
      };
    });
  });
}

test.describe("text vertical placement for legacy and current node formats", () => {
  test("legacy v1 nodes centre their labels inside the shape", async ({ page }) => {
    await mountSlate(page, legacySlate);
    const rows = await placements(page);
    expect(rows.map((r) => r.id).sort()).toEqual([
      "legacy-circle",
      "legacy-rect-two-lines",
      "legacy-tall-column",
      "legacy-wide-ellipse",
    ]);

    for (const r of rows) {
      // Centred: the label's centre is within 12% of the shape height of the
      // shape's centre. The defect put it a full half-height (50%) below.
      expect(
        Math.abs(r.textCenterY - r.shapeCenterY) / r.shapeHeight,
        `${r.id} label centre offset`,
      ).toBeLessThan(0.12);
      // Contained: the label never crosses the shape's top or bottom edge.
      expect(r.textTop, `${r.id} label top`).toBeGreaterThanOrEqual(r.shapeTop - 1);
      expect(r.textBottom, `${r.id} label bottom`).toBeLessThanOrEqual(r.shapeBottom + 1);
      // The v1 measurement is dropped, so a later resize keeps the label centred
      // and the next save writes a v3 offset.
      expect(r.storedOffset, `${r.id} stored offset`).toEqual({ x: 0, y: 0 });
    }

    // Still centred after the node is resized (a stale v1 measurement would
    // drift as the height changes).
    await page.evaluate(() => {
      const n = (window as any).__s.v2.nodes.one("legacy-circle");
      n.setSize(n.options.width, n.options.height * 2);
    });
    await page.waitForTimeout(150);
    const circle = (await placements(page)).find((r) => r.id === "legacy-circle")!;
    expect(Math.abs(circle.textCenterY - circle.shapeCenterY) / circle.shapeHeight).toBeLessThan(0.12);
  });

  test("current-format nodes are unchanged: centred by default, nudged by textOffset", async ({
    page,
  }) => {
    const current = {
      options: { id: "current-format", name: "Current format" },
      nodes: [
        {
          options: {
            id: "current-rect",
            text: "Two\nlines",
            x: 120,
            y: 120,
            width: 160,
            height: 90,
            shape: "rectangle",
            fontSize: 18,
            textXAlign: "center",
            textYAlign: "middle",
            textOffset: { x: 0, y: 0 },
          },
        },
        {
          options: {
            id: "current-ellipse",
            text: "Centred",
            x: 340,
            y: 120,
            width: 150,
            height: 60,
            shape: "ellipse",
            fontSize: 16,
          },
        },
        {
          options: {
            id: "current-nudged",
            text: "Nudged",
            x: 540,
            y: 120,
            width: 160,
            height: 120,
            shape: "rectangle",
            fontSize: 16,
            textOffset: { x: 0, y: 20 },
          },
        },
      ],
    };
    await mountSlate(page, JSON.stringify(current));
    const rows = await placements(page);
    const byId = Object.fromEntries(rows.map((r) => [r.id, r]));

    for (const id of ["current-rect", "current-ellipse"]) {
      const r = byId[id];
      expect(Math.abs(r.textCenterY - r.shapeCenterY) / r.shapeHeight, `${id} centre`).toBeLessThan(0.12);
      expect(r.textTop).toBeGreaterThanOrEqual(r.shapeTop - 1);
      expect(r.textBottom).toBeLessThanOrEqual(r.shapeBottom + 1);
    }

    // A v3 offset is a nudge from the centre and is kept as authored.
    const nudged = byId["current-nudged"];
    expect(nudged.storedOffset).toEqual({ x: 0, y: 20 });
    const scale = nudged.shapeHeight / nudged.modelHeight;
    expect(nudged.textCenterY - nudged.shapeCenterY).toBeGreaterThan(20 * scale - 4);
    expect(nudged.textCenterY - nudged.shapeCenterY).toBeLessThan(20 * scale + 4);
  });
});
