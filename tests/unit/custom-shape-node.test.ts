// Custom (AI or library) shapes on a real note: fill rule, an even unclipped
// border, text placed in the shape's text box, no height growth, and the
// collaboration guard on shape packages.
import { beforeAll, describe, expect, it, vi } from "vitest";
import { SVG } from "@svgdotjs/svg.js";
import { Node } from "../../src/core/Node";
import { Invoker } from "../../src/core/Invoker";
import { prepareShape } from "../../src/shapes";

const BUBBLE = "M28,0 H92 Q100,0 100,8 V62 Q100,70 92,70 H28 Q20,70 20,62 V44 L0,52 L20,30 V8 Q20,0 28,0 Z";
const ROCKET = "M50,0 C64,10 72,28 72,50 L72,74 L88,90 L88,100 L70,92 L30,92 L12,100 L12,90 L28,74 L28,50 C28,28 36,10 50,0 Z M41,34 A9,9 0 1 1 59,34 A9,9 0 1 1 41,34 Z M40,92 L50,100 L60,92 Z";

beforeAll(() => {
  // jsdom has no SVG layout: give text and paths a box so the note renders.
  const box = function () {
    return { x: 0, y: 0, width: 60, height: 20 };
  };
  for (const proto of [window.Element.prototype, window.SVGElement.prototype] as any[]) {
    if (typeof proto.getBBox !== "function") proto.getBBox = box;
  }
});

function slateMock() {
  const draw = SVG().addTo(document.body).size(1200, 800);
  return {
    canvas: draw,
    options: { viewPort: { originalWidth: 1200, originalHeight: 800 }, containerStyle: { backgroundColor: "#fff" }, autoEnableDefaultFilters: false },
    getViewportAsync: vi.fn().mockResolvedValue(draw.group()),
    getSelectedNodes: () => [],
    updateSelectionResizeRotate: vi.fn(),
    undoRedo: { saveSnapshot: vi.fn() },
    collab: { isCollabConnected: () => false },
    broadcast: vi.fn(),
  } as any;
}

async function note(options: Record<string, any>) {
  const node = new Node({ id: "n1", x: 0, y: 0, width: 240, height: 160, text: "Customers keep asking", ...options }, slateMock());
  await node.ready;
  return node;
}

describe("a custom shape note", () => {
  it("draws holes with the fill rule, an even border and no clipping", async () => {
    const shape = prepareShape({ name: "Rocket", d: ROCKET, fillRule: "evenodd" });
    if (!shape.ok) throw new Error("rocket");
    const node = await note({ shape: "custom", vectorPath: shape.shape.d, fillRule: "evenodd", textBox: shape.shape.textBox });
    const path = (node as any).contentPath.node as SVGPathElement;
    expect(path.getAttribute("fill-rule")).toBe("evenodd");
    expect(path.getAttribute("vector-effect")).toBe("non-scaling-stroke");
    expect(path.closest("svg")!.getAttribute("overflow")).toBe("visible");
    expect(path.getAttribute("data-shape-path")).toBe("1");
  });

  it("leaves named shapes as they were", async () => {
    const node = await note({ shape: "diamond", vectorPath: "diamond" });
    const path = (node as any).contentPath.node as SVGPathElement;
    expect(path.getAttribute("vector-effect")).toBeNull();
    expect(node.textArea().custom).toBe(false);
  });

  it("places text in the stored text box", async () => {
    const textBox = { x: 0.21, y: 0.06, w: 0.77, h: 0.79 };
    const node = await note({ shape: "custom", vectorPath: BUBBLE, textBox });
    const area = node.textArea();
    expect(area).toMatchObject({ custom: true });
    expect(area.x).toBeCloseTo(0.21 * 240);
    expect(area.w).toBeCloseTo(0.77 * 240);
    const text = (node as any).textElement.node as SVGTextElement;
    // Centred on the text box, not the note's box.
    expect(Number(text.getAttribute("x"))).toBeCloseTo((0.21 + 0.77 / 2) * 240, 0);
    expect(Number(text.getAttribute("y"))).toBeCloseTo((0.06 + 0.79 / 2) * 160, 0);
  });

  it("measures a text box once for a custom shape that carries none", async () => {
    const node = await note({ shape: "custom", vectorPath: BUBBLE, fillRule: "nonzero" });
    const area = node.textArea();
    expect(area.custom).toBe(true);
    // The tail is on the left: the text box starts right of it.
    expect(area.x / 240).toBeGreaterThan(0.15);
  });

  it("does not grow to fit text (it would distort the outline)", async () => {
    const node = await note({ shape: "custom", vectorPath: BUBBLE, textBox: { x: 0.2, y: 0.1, w: 0.7, h: 0.7 } });
    const spy = vi.spyOn(node, "setSize");
    (node as any).textElement.node.getBBox = () => ({ x: 0, y: 0, width: 100, height: 600 });
    (node as any).fitHeightToText();
    expect(spy).not.toHaveBeenCalled();
    expect(node.options.height).toBe(160);
  });

  it("is not custom when only the shape name says so (a v1 icon note)", async () => {
    const node = await note({ shape: "custom", vectorPath: BUBBLE });
    expect(node.isCustomShape()).toBe(false);
  });

  it("drops custom-only options when it goes back to a named shape", async () => {
    const node = await note({ shape: "custom", vectorPath: BUBBLE, fillRule: "evenodd", textBox: { x: 0, y: 0, w: 1, h: 1 }, shapeRef: { name: "Bubble" } });
    node.setShape("ellipse");
    expect(node.options.fillRule).toBeUndefined();
    expect(node.options.textBox).toBeUndefined();
    expect(node.options.shapeRef).toBeUndefined();
  });
});

describe("shape packages from the room", () => {
  function invokerFor(node: any) {
    const slate: any = { nodes: { one: () => node } };
    return new Invoker(slate);
  }

  it("applies a custom shape with its fill rule and text box", () => {
    const node: any = { options: {}, setShape: vi.fn() };
    invokerFor(node).onNodeShapeChanged({ data: { id: "n1", shape: "custom", vectorPath: BUBBLE, fillRule: "evenodd", textBox: { x: 0.2, y: 0.1, w: 0.7, h: 0.7 } } } as any);
    expect(node.options).toMatchObject({ shape: "custom", vectorPath: BUBBLE, fillRule: "evenodd" });
    expect(node.setShape).toHaveBeenCalledWith("custom", BUBBLE);
  });

  it("ignores a package whose path is markup", () => {
    const node: any = { options: { shape: "rectangle" }, setShape: vi.fn() };
    invokerFor(node).onNodeShapeChanged({ data: { id: "n1", shape: "custom", vectorPath: 'M0 0"/><script>alert(1)</script>' } } as any);
    expect(node.options.shape).toBe("rectangle");
    expect(node.setShape).not.toHaveBeenCalled();
  });

  it("never carries svgContent", () => {
    const node: any = { options: {}, setShape: vi.fn() };
    invokerFor(node).onNodeShapeChanged({ data: { id: "n1", shape: "circle", svgContent: "<g onload='x()'/>" } } as any);
    expect(node.options.svgContent).toBeUndefined();
    expect(node.setShape).toHaveBeenCalledWith("circle", undefined);
  });

  it("drops an unknown fill rule", () => {
    const node: any = { options: {}, setShape: vi.fn() };
    invokerFor(node).onNodeShapeChanged({ data: { id: "n1", shape: "custom", vectorPath: BUBBLE, fillRule: "inherit" } } as any);
    expect(node.options.fillRule).toBeUndefined();
  });
});

describe("a theme style with a custom outline", () => {
  it("passes the fill rule and text box to the note", async () => {
    const { applyStyleToNode } = await import("../../src/core/Theme");
    const node: any = { options: {}, setShape: vi.fn((shape: string, path: string) => Object.assign(node.options, { shape, vectorPath: path })) };
    (applyStyleToNode as any)(node, { shape: "custom", vectorPath: BUBBLE, fillRule: "evenodd", textBox: { x: 0.2, y: 0.1, w: 0.7, h: 0.7 } });
    expect(node.options).toMatchObject({ fillRule: "evenodd", textBox: { w: 0.7 } });
    expect(node.setShape).toHaveBeenCalledWith("custom", BUBBLE);
  });
});

// Notes that store a raw path but are not custom shapes: the app's quick-add
// shapes (addNote stores the drawn path with shapeHint "rect", "star", ...),
// theme outlines (defaultThemes.json vectorPath), icons and comments. They
// keep growing with their text and keep the old inset text box.
describe("older raw-path notes stay as they were", () => {
  const QUICK_RECT = "M10 10 L190 10 L190 110 L10 110 Z";
  const THEMED_ROUNDED = "M0 73.99 C0 33.13 33.13 0 73.99 0 L226 0 C266.87 0 300 33.13 300 73.99 L300 126 C300 166.87 266.87 200 226 200 L73.99 200 C33.13 200 0 166.87 0 126 Z";

  function grows(node: Node) {
    (node as any).textElement.node.getBBox = () => ({ x: 0, y: 0, width: 100, height: 600 });
    (node as any).fitHeightToText();
    return node.options.height! > 160;
  }

  it("a quick-add rectangle grows with its text and uses the full box", async () => {
    const node = await note({ vectorPath: QUICK_RECT, shapeHint: "rect" });
    expect(node.isCustomShape()).toBe(false);
    expect(node.textArea()).toMatchObject({ x: 0, y: 0, w: 240, h: 160, custom: false });
    const path = (node as any).contentPath.node as SVGPathElement;
    expect(path.getAttribute("vector-effect")).toBeNull();
    expect(path.getAttribute("fill-rule")).toBeNull();
    expect(grows(node)).toBe(true);
  });

  it("a themed rounded rectangle (raw path as its shape) grows with its text", async () => {
    const { applyStyleToNode } = await import("../../src/core/Theme");
    const node = await note({ shape: "rectangle", vectorPath: "rectangle" });
    (applyStyleToNode as any)(node, { vectorPath: THEMED_ROUNDED });
    expect(node.options.shape).toBe(THEMED_ROUNDED);
    expect(node.isCustomShape()).toBe(false);
    expect(node.textArea().custom).toBe(false);
    expect(grows(node)).toBe(true);
  });

  it("a raw path with no name at all is not custom either", async () => {
    const node = await note({ vectorPath: QUICK_RECT });
    expect(node.isCustomShape()).toBe(false);
  });

  it("a theme outline with a fill rule becomes a custom shape", async () => {
    const { applyStyleToNode } = await import("../../src/core/Theme");
    const node = await note({ shape: "rectangle", vectorPath: "rectangle" });
    (applyStyleToNode as any)(node, { vectorPath: BUBBLE, fillRule: "evenodd" });
    expect(node.options.shape).toBe("custom");
    expect(node.isCustomShape()).toBe(true);
  });

  it("an icon applied after a custom shape loses the custom options", async () => {
    const node = await note({ shape: "custom", vectorPath: BUBBLE, fillRule: "evenodd", textBox: { x: 0.2, y: 0.1, w: 0.7, h: 0.7 } });
    node.setShape(QUICK_RECT, QUICK_RECT);
    expect(node.options.fillRule).toBeUndefined();
    expect(node.isCustomShape()).toBe(false);
  });
});
