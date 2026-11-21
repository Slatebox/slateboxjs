// ---------------------------------------------------------------------------
// BirdsEye layering — the viewport rectangle is the top layer of the minimap.
//
// Owner report (2026-11-21): on a workshop slate the lanes were drawn over the
// blue viewport rectangle and swallowed clicks and drags on it. These tests use
// the REAL SVG.js (no mock) so the actual DOM order and attributes are checked.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BirdsEye } from "../../src/core/BirdsEye";

type MockNode = { id: string; options: Record<string, any> };

function note(id: string, x: number, y: number, width = 300, height = 400, extra: Record<string, any> = {}): MockNode {
  return {
    id,
    options: { x, y, width, height, shape: "rectangle", backgroundColor: "#eef4ee", rotate: { rotationAngle: 0 }, ...extra },
  };
}

function makeSlate(nodes: MockNode[]) {
  const element = document.createElement("div");
  element.style.position = "relative";
  document.body.appendChild(element);
  return {
    element,
    canvas: { on: vi.fn(), off: vi.fn() },
    panZoom: {
      getZoom: vi.fn().mockReturnValue(1),
      getPan: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      pan: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      reset: vi.fn(),
    },
    getAllNodes: vi.fn(() => nodes),
    options: { viewPort: { originalWidth: 1200, originalHeight: 800 } },
  };
}

/** The <svg> of the minimap, the viewport rectangle and every node thumbnail. */
function parts(be: BirdsEye) {
  const svg = (be as any).miniCanvas.node as SVGSVGElement;
  const indicator = (be as any).viewportIndicator.node as SVGElement;
  const shapes = Array.from(((be as any).nodeShapes as Map<string, any>).values()).map((s) => s.node as SVGElement);
  return { svg, indicator, shapes };
}

/** True when the element, or an ancestor inside the minimap, is excluded from hit-testing. */
function ignoresPointer(el: Element, svg: Element): boolean {
  for (let cur: Element | null = el; cur && cur !== svg; cur = cur.parentElement) {
    const attr = cur.getAttribute("pointer-events");
    const style = (cur as HTMLElement).style?.pointerEvents;
    if (attr === "none" || style === "none") return true;
  }
  return false;
}

/** The viewport rectangle is painted after (above) every node thumbnail. */
function expectIndicatorOnTop(be: BirdsEye) {
  const { svg, indicator, shapes } = parts(be);
  expect(shapes.length).toBeGreaterThan(0);
  for (const shape of shapes) {
    expect(svg.contains(shape)).toBe(true);
    // DOCUMENT_POSITION_FOLLOWING (4): the indicator comes later in paint order.
    expect(shape.compareDocumentPosition(indicator) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
  // Nothing at all is painted after the indicator.
  const all = Array.from(svg.querySelectorAll("*"));
  const after = all.slice(all.indexOf(indicator) + 1).filter((el) => !indicator.contains(el));
  expect(after.map((el) => el.tagName)).toEqual([]);
}

function alphaOf(fill: string | null): number {
  const m = /rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)/.exec(fill || "");
  return m ? Number(m[1]) : 1;
}

describe("BirdsEye layering (viewport rectangle is the top layer)", () => {
  let nodes: MockNode[];
  let slate: ReturnType<typeof makeSlate>;
  let be: BirdsEye;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    // An ordinary note and a five-lane workshop board, as on the owner's slate.
    nodes = [note("plain", 560, 0, 160, 80)];
    for (let i = 0; i < 5; i++) nodes.push(note("column-" + i, i * 310, 300));
    slate = makeSlate(nodes);
    be = new BirdsEye(slate as any, { enabled: true });
    be.enable();
  });

  afterEach(() => {
    be.disable();
    slate.element.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("is above every note right after enable()", () => {
    expectIndicatorOnTop(be);
  });

  it("stays above the notes after a refresh (a note added, a workshop re-rendered, a remote change)", () => {
    nodes.push(note("card-1", 20, 340, 260, 60));
    be.refresh();
    expectIndicatorOnTop(be);
    // and a debounced refresh (the path Slate.notifyNodeChanged takes)
    nodes.push(note("card-2", 330, 340, 260, 60));
    be.scheduleRefresh();
    vi.advanceTimersByTime(400);
    expectIndicatorOnTop(be);
  });

  it("stays above the notes after addNodeShape and updateNodePosition", () => {
    const late = note("late", 900, 900, 400, 400);
    nodes.push(late);
    be.addNodeShape(late as any);
    late.options.x = 100;
    be.updateNodePosition(late as any);
    expectIndicatorOnTop(be);
  });

  it("no node thumbnail takes pointer events; the indicator does", () => {
    nodes.push(note("card-1", 20, 340, 260, 60));
    be.refresh();
    const { svg, indicator, shapes } = parts(be);
    for (const shape of shapes) expect(ignoresPointer(shape, svg)).toBe(true);
    expect(ignoresPointer(indicator, svg)).toBe(false);
  });

  it("uses a light fill so the content shows through, with a clear border", () => {
    const { indicator } = parts(be);
    const fill = indicator.getAttribute("fill");
    const fillOpacity = Number(indicator.getAttribute("fill-opacity") ?? 1);
    expect(alphaOf(fill) * fillOpacity).toBeLessThanOrEqual(0.15);
    expect(alphaOf(fill) * fillOpacity).toBeGreaterThan(0);
    expect(indicator.getAttribute("stroke")).toBe("#4285f4");
    expect(Number(indicator.getAttribute("stroke-width"))).toBeGreaterThanOrEqual(2);
  });

  it("a touch drag on the indicator pans the canvas", () => {
    const { indicator } = parts(be);
    (indicator as any).getBBox = () => ({ x: 10, y: 10, width: 60, height: 40 });
    const touch = (type: string, x: number, y: number, target: EventTarget) => {
      const ev = new Event(type, { bubbles: true, cancelable: true }) as any;
      const t = [{ clientX: x, clientY: y, identifier: 1, target }];
      Object.defineProperty(ev, "touches", { value: type === "touchend" ? [] : t });
      Object.defineProperty(ev, "changedTouches", { value: t });
      target.dispatchEvent(ev);
      return ev as Event;
    };
    const start = touch("touchstart", 100, 100, indicator);
    expect(start.defaultPrevented).toBe(true); // no page scroll / synthetic mouse
    touch("touchmove", 130, 120, document);
    expect(slate.panZoom.pan).toHaveBeenCalled();
    touch("touchend", 130, 120, document);
    slate.panZoom.pan.mockClear();
    touch("touchmove", 160, 140, document);
    expect(slate.panZoom.pan).not.toHaveBeenCalled();
  });
});
