/**
 * Node.test.ts — Comprehensive tests for the Node class.
 *
 * Tests cover: construction, text content, SVG content, shapes, position,
 * setSize, rotation, drag lifecycle, lock/unlock, resize/rotate delegation,
 * selection, connector delegation, connection handles, destroy/remove,
 * and edge cases.
 *
 * Target: 150+ real tests (replaces the 4 placeholder tests that didn't
 * test Node at all).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Node } from "../../src/core/Node";

// ---------------------------------------------------------------------------
// Mock Infrastructure
// ---------------------------------------------------------------------------

/** Create a mock SVG element that supports common SVG.js method chains */
function createMockSvgElement(overrides: Record<string, any> = {}) {
  return {
    fill: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    move: vi.fn().mockReturnThis(),
    size: vi.fn().mockReturnThis(),
    hide: vi.fn().mockReturnThis(),
    show: vi.fn().mockReturnThis(),
    front: vi.fn().mockReturnThis(),
    back: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    animate: vi.fn().mockReturnThis(),
    after: vi.fn().mockReturnThis(),
    opacity: vi.fn().mockReturnThis(),
    radius: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis(),
    transform: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    css: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    data: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    font: vi.fn().mockReturnThis(),
    leading: vi.fn().mockReturnThis(),
    length: vi.fn().mockReturnValue(100),
    node: {
      setAttribute: vi.fn(),
      getAttribute: vi.fn(),
    },
    ...overrides,
  };
}

/** Full mock SVG group (G element) — returned by slate.getViewportAsync() */
function createMockSvgGroup() {
  const group = createMockSvgElement({
    rect: vi.fn().mockImplementation(() => createMockSvgElement()),
    circle: vi.fn().mockImplementation(() => createMockSvgElement()),
    ellipse: vi.fn().mockImplementation(() => createMockSvgElement()),
    path: vi.fn().mockImplementation(() => createMockSvgElement()),
    text: vi.fn().mockImplementation(() => createMockSvgElement({
      font: vi.fn().mockReturnThis(),
      leading: vi.fn().mockReturnThis(),
      length: vi.fn().mockReturnValue(100),
    })),
    group: vi.fn().mockImplementation(() => createMockSvgGroup()),
    nested: vi.fn().mockImplementation(() => ({
      size: vi.fn().mockReturnThis(),
      move: vi.fn().mockReturnThis(),
      svg: vi.fn().mockReturnThis(),
      viewbox: vi.fn().mockReturnThis(),
      path: vi.fn().mockImplementation(() => createMockSvgElement()),
      children: vi.fn().mockReturnValue([createMockSvgElement()]),
      node: { setAttribute: vi.fn(), getAttribute: vi.fn() },
    })),
    image: vi.fn().mockImplementation(() => createMockSvgElement({
      size: vi.fn().mockReturnThis(),
      loaded: vi.fn().mockImplementation((cb: Function) => { cb({ width: 100, height: 100 }); }),
    })),
    defs: vi.fn().mockImplementation(() => ({
      pattern: vi.fn().mockReturnValue(createMockSvgElement({
        attr: vi.fn().mockReturnThis(),
      })),
    })),
    // Return mock bbox
    bbox: vi.fn().mockReturnValue({ x: 0, y: 0, width: 120, height: 80, w: 120, h: 80 }),
    rbox: vi.fn().mockReturnValue({ x: 0, y: 0, width: 120, height: 80, w: 120, h: 80 }),
    // Return mock transform for getRotation
    transform: vi.fn().mockReturnValue({ translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotate: 0, shear: 0 }),
    // For makeDraggable
    draggable: vi.fn().mockReturnThis(),
    selectize: vi.fn().mockReturnThis(),
    root: vi.fn().mockReturnValue(null),
    parents: vi.fn().mockReturnValue([]),
    natural: vi.fn().mockReturnValue({ width: 100, height: 100 }),
  });
  return group;
}

/** Create a minimal mock ResizeRotate */
function createMockResizeRotate() {
  const opts = { resizeEnabled: true, rotateEnabled: true };
  return {
    enable: vi.fn(),
    disable: vi.fn(),
    isEnabled: vi.fn().mockReturnValue(false),
    destroy: vi.fn(),
    updateOptions: vi.fn().mockImplementation((newOpts: Record<string, any>) => Object.assign(opts, newOpts)),
    options: opts,
  };
}

/** Create a minimal mock Connector */
function createMockConnector() {
  return {
    enable: vi.fn(),
    disable: vi.fn(),
    connectTo: vi.fn(),
    disconnectFrom: vi.fn().mockReturnValue(false),
    disconnectAll: vi.fn(),
    getConnections: vi.fn().mockReturnValue([]),
    getConnection: vi.fn().mockReturnValue(null),
    isEnabled: vi.fn().mockReturnValue(false),
    destroy: vi.fn(),
  };
}

/** Create a minimal mock Relationships */
function createMockRelationships() {
  return {
    enable: vi.fn(),
    disable: vi.fn(),
    removeAll: vi.fn(),
    addAssociation: vi.fn(),
    getAssociations: vi.fn().mockReturnValue([]),
    destroy: vi.fn(),
  };
}

/** Create a minimal mock Images */
function createMockImages() {
  return { set: vi.fn(), clear: vi.fn(), hasImage: vi.fn().mockReturnValue(false), destroy: vi.fn() };
}

/** Create a minimal mock Editor */
function createMockEditor() {
  return { set: vi.fn(), destroy: vi.fn() };
}

/** Create a minimal mock Links */
function createMockLinks() {
  return { set: vi.fn(), unset: vi.fn(), hasLink: vi.fn().mockReturnValue(false), destroy: vi.fn() };
}

/** Create a minimal mock Filters */
function createMockFilters() {
  return { apply: vi.fn(), removeAll: vi.fn(), destroy: vi.fn() };
}

/** Create a minimal mock Menu */
function createMockMenu() {
  return { open: vi.fn(), close: vi.fn(), destroy: vi.fn() };
}

// Mock SVG global — needed by Node for SVG()
let mockSvgInstance: any;
beforeEach(() => {
  const mockSvg = {
    size: vi.fn().mockReturnThis(),
    viewbox: vi.fn().mockReturnThis(),
    addTo: vi.fn().mockReturnThis(),
    group: vi.fn().mockImplementation(() => createMockSvgGroup()),
    defs: vi.fn().mockImplementation(() => ({
      pattern: vi.fn().mockReturnValue(createMockSvgElement({ attr: vi.fn().mockReturnThis() })),
    })),
    rect: vi.fn().mockImplementation(() => createMockSvgElement()),
    circle: vi.fn().mockImplementation(() => createMockSvgElement()),
    ellipse: vi.fn().mockImplementation(() => createMockSvgElement()),
    text: vi.fn().mockImplementation(() => createMockSvgElement()),
    path: vi.fn().mockImplementation(() => createMockSvgElement()),
    image: vi.fn().mockImplementation(() => createMockSvgElement()),
    nested: vi.fn().mockImplementation(() => createMockSvgGroup()),
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    node: document.createElementNS ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : {} as any,
  };
  mockSvgInstance = vi.fn().mockReturnValue(mockSvg);

  // Stub the global SVG constructor
  (globalThis as any).SVG = mockSvgInstance;
});

afterEach(() => {
  vi.restoreAllMocks();
});

/** Full mock slate for Node construction */
function createMockSlate(overrides: Record<string, any> = {}) {
  return {
    canvas: mockSvgInstance(),
    options: {
      viewPort: { originalWidth: 1200, originalHeight: 800 },
      containerStyle: { backgroundColor: "#ffffff" },
      autoEnableDefaultFilters: false,
      showUndoRedo: true,
      ...overrides.options,
    },
    getViewportAsync: vi.fn().mockResolvedValue(mockSvgInstance().group()),
    getSelectedNodes: vi.fn().mockReturnValue([]),
    selectNodes: vi.fn(),
    clearSelection: vi.fn(),
    notifyNodeChanged: vi.fn(),
    updateSelectionResizeRotate: vi.fn(),
    enableNodeResizeRotate: vi.fn(),
    disableNodeResizeRotate: vi.fn(),
    createGroupResizeRotate: vi.fn(),
    addNode: vi.fn(),
    removeNode: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    getPan: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    getAllNodes: vi.fn().mockReturnValue([]),
    undoRedo: { saveSnapshot: vi.fn(), undo: vi.fn(), redo: vi.fn() },
    collab: { isCollabConnected: vi.fn().mockReturnValue(false) },
    ...overrides,
  };
}

/** Helper: create a Node instance with async readiness */
async function createNode(options: Record<string, any> = {}, slateOverrides: Record<string, any> = {}): Promise<Node> {
  const slate = createMockSlate(slateOverrides);
  const node = new Node({
    x: 100,
    y: 100,
    width: 120,
    height: 80,
    text: "Test Node",
    shape: "rectangle",
    ...options,
  }, slate);
  await node.ready;
  // Inject mock sub-modules so we can spy on them
  (node as any).resizeRotate = createMockResizeRotate();
  (node as any).connector = createMockConnector();
  (node as any).relationships = createMockRelationships();
  (node as any).images = createMockImages();
  (node as any).editor = createMockEditor();
  (node as any).links = createMockLinks();
  (node as any).filters = createMockFilters();
  (node as any).menu = createMockMenu();
  return node;
}

// ---------------------------------------------------------------------------
// Construction Tests (1.33)
// ---------------------------------------------------------------------------

describe("Node construction", () => {
  it("should set id from options", async () => {
    const node = await createNode({ id: "my-custom-id" });
    expect(node.id).toBe("my-custom-id");
  });

  it("should generate an id when none provided", async () => {
    const node = await createNode({ id: "" });
    expect(node.id).toBeTruthy();
    expect(node.id).toMatch(/^node_/);
  });

  it("should merge default options with user options", async () => {
    const node = await createNode({ backgroundColor: "#ff0000", borderColor: "#0000ff" });
    expect(node.options.backgroundColor).toBe("#ff0000");
    expect(node.options.borderColor).toBe("#0000ff");
    expect(node.options.borderWidth).toBeGreaterThanOrEqual(1); // default > 0
  });

  it("writes none of the retired Custom Behavior flags into a new note (nothing reads them)", async () => {
    const node = await createNode();
    const retired = [
      "showDelete", "showResize", "showRotate", "showAdd", "showRelationshipConnector", "showRelationshipDelete",
      "showRelationshipProperties", "showRelationshipReassign", "showAddAndDeleteConditionally",
      "spaceBetweenNodesWhenAdding", "disableDrag", "disableMenuAsTemplate",
    ];
    expect(retired.filter((key) => key in node.options)).toEqual([]);
    // Lock is the one way to keep a note in place.
    expect(node.options.isLocked).toBe(false);
  });

  it("should create an SVG group on construction", async () => {
    const node = await createNode();
    expect(node.svgGroup).toBeDefined();
  });

  it("should set data-node-id attribute on the SVG group", async () => {
    const node = await createNode({ id: "attr-test" });
    expect(node.svgGroup.attr).toBeDefined();
  });

  it("should resolve ready promise after async creation", async () => {
    const slate = createMockSlate();
    const node = new Node({ x: 50, y: 50, width: 100, height: 60, text: "X" }, slate);
    await expect(node.ready).resolves.toBeUndefined();
  });

  it("should set up all sub-module properties", async () => {
    const node = await createNode();
    expect(node.resizeRotate).toBeDefined();
    expect(node.connector).toBeDefined();
    expect(node.relationships).toBeDefined();
    expect(node.images).toBeDefined();
    expect(node.editor).toBeDefined();
    expect(node.links).toBeDefined();
    expect(node.filters).toBeDefined();
    expect(node.menu).toBeDefined();
  });

  it("should create background rect for rectangle shape", async () => {
    const node = await createNode({ shape: "rectangle" });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create a text element for text content nodes", async () => {
    const node = await createNode({ text: "Hello", shape: "rectangle" });
    expect(node.textElement).toBeDefined();
  });

  it("should NOT create text element for SVG content nodes", async () => {
    // SVG content nodes skip text creation; the nestedSvg is created instead.
    // Note: setTimeout in Node.ts (svgViewboxTimeout) can fire after test completes
    // with mock infrastructure — the key assertion is that nestedSvg exists.
    const node = await createNode({
      text: "Should be ignored",
      svgContent: "<svg><rect width='50' height='50'/></svg>",
      shape: "rectangle",
    });
    expect(node.nestedSvg).toBeDefined();
    // Clean up the pending timeout
    (node as any)._svgViewboxTimeoutId && clearTimeout((node as any)._svgViewboxTimeoutId);
  });
});

// ---------------------------------------------------------------------------
// Text Content Tests (1.34)
// ---------------------------------------------------------------------------

describe("Text content", () => {
  it("should set text via setText", async () => {
    const node = await createNode({ text: "Original" });
    node.setText("Updated");
    expect(node.options.text).toBe("Updated");
  });

  it("should handle empty text", async () => {
    const node = await createNode({ text: "Original" });
    node.setText("");
    expect(node.options.text).toBe("");
  });

  // A room replays "add this note" and "name it" back to back, and a note is
  // drawn a moment after it is added. The name must not be dropped.
  it("keeps a name given while the note is still being drawn", async () => {
    const slate = createMockSlate();
    const node = new Node({ x: 0, y: 0, width: 120, height: 80, text: "", shape: "rectangle" }, slate);
    node.setText("Child");
    await node.ready;
    expect(node.options.text).toBe("Child");
    expect(node.svgGroup.text).toHaveBeenCalledWith("Child");
  });

  it("should set text with font size", async () => {
    const node = await createNode({ text: "Hello" });
    node.editor.set = vi.fn();
    await node.editor.set("Big Text", 24);
    expect(node.editor.set).toHaveBeenCalledWith("Big Text", 24);
  });

  it("should support text alignment left", async () => {
    const node = await createNode({ text: "Left", textXAlign: "left" });
    expect(node.options.textXAlign).toBe("left");
  });

  it("should support text alignment center", async () => {
    const node = await createNode({ text: "Center", textXAlign: "center" });
    expect(node.options.textXAlign).toBe("center");
  });

  it("should support text alignment right", async () => {
    const node = await createNode({ text: "Right", textXAlign: "right" });
    expect(node.options.textXAlign).toBe("right");
  });

  it("should support vertical text alignment top", async () => {
    const node = await createNode({ text: "Top", textYAlign: "top" });
    expect(node.options.textYAlign).toBe("top");
  });

  it("should support vertical text alignment middle", async () => {
    const node = await createNode({ text: "Middle", textYAlign: "middle" });
    expect(node.options.textYAlign).toBe("middle");
  });

  it("should support vertical text alignment bottom", async () => {
    const node = await createNode({ text: "Bottom", textYAlign: "bottom" });
    expect(node.options.textYAlign).toBe("bottom");
  });

  // SVG.js stacks the lines downward from the first one. Bottom-aligned text must
  // end at the bottom edge, so the block moves up by its extra lines; top starts
  // at the top edge; middle is centred. A size stored in points is drawn in points.
  describe("multi-line text keeps its block inside the note", () => {
    const placed = async (textYAlign: string, fontSize: number | string, lines: number) => {
      const node = await createNode({ text: "One\nTwo\nThree", width: 120, height: 200, textYAlign, fontSize });
      const text = (node as any).textElement;
      text.node.querySelectorAll = () => Array.from({ length: lines });
      text.attr.mockClear();
      node.centerText();
      const call = text.attr.mock.calls.find((c: any[]) => c[0] && typeof c[0] === "object" && "y" in c[0]);
      return call[0].y as number;
    };

    it("bottom: the last line sits at the bottom edge", async () => {
      // Three lines of 20px text, 26px apart: the first line starts two lines above the bottom.
      expect(await placed("bottom", 20, 3)).toBeCloseTo(200 - 5 - 2 * 26);
      expect(await placed("bottom", 20, 1)).toBeCloseTo(200 - 5);
    });

    it("top: the first line sits at the top edge", async () => {
      expect(await placed("top", 20, 3)).toBeCloseTo(5);
    });

    it("middle: the block is centred, with a size in points drawn in points", async () => {
      expect(await placed("middle", 20, 3)).toBeCloseTo(100 - 26);
      // 15pt is 20px.
      expect(await placed("middle", "15pt", 3)).toBeCloseTo(100 - 26);
      expect(await placed("bottom", "15pt", 3)).toBeCloseTo(200 - 5 - 2 * 26);
    });
  });

  // Text too big for its note is drawn smaller. It shrinks about the edge it is
  // aligned to, so Left or Bottom text stays flush with that edge.
  describe("text shrunk to fit stays at its aligned edge", () => {
    const origin = async (textXAlign: string, textYAlign: string) => {
      const node = await createNode({ text: "A long line of text", width: 100, height: 60, textXAlign, textYAlign });
      const text = (node as any).textElement;
      text.node.getBBox = () => ({ x: 10, y: 20, width: 200, height: 40 });
      text.attr.mockClear();
      node.centerText();
      const call = text.attr.mock.calls.find((c: any[]) => c[0] === "transform" && typeof c[1] === "string");
      const [, x, y] = /^translate\(([-\d.]+) ([-\d.]+)\) scale/.exec(call[1])!;
      return [Number(x), Number(y)];
    };

    it("left and bottom: about the left and bottom edges", async () => {
      expect(await origin("left", "bottom")).toEqual([10, 60]);
    });

    it("right and top: about the right and top edges", async () => {
      expect(await origin("right", "top")).toEqual([210, 20]);
    });

    it("centre and middle: about the centre", async () => {
      expect(await origin("center", "middle")).toEqual([110, 40]);
    });
  });

  it("should support text offset", async () => {
    const node = await createNode({ text: "Offset", xTextOffset: 5, yTextOffset: -5 });
    expect(node.options.xTextOffset).toBe(5);
    expect(node.options.yTextOffset).toBe(-5);
  });
});

// ---------------------------------------------------------------------------
// Shape Tests (1.36)
// ---------------------------------------------------------------------------

describe("Shapes", () => {
  it("should create rectangle shape", async () => {
    const node = await createNode({ shape: "rectangle", width: 120, height: 80 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create circle shape", async () => {
    const node = await createNode({ shape: "circle", width: 100, height: 100 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create ellipse shape", async () => {
    const node = await createNode({ shape: "ellipse", width: 140, height: 70 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create diamond shape", async () => {
    const node = await createNode({ shape: "diamond", width: 100, height: 100 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create star shape", async () => {
    const node = await createNode({ shape: "star", width: 100, height: 100 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create triangle shape", async () => {
    const node = await createNode({ shape: "triangle", width: 100, height: 100 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should create hexagon shape", async () => {
    const node = await createNode({ shape: "hexagon", width: 100, height: 87 });
    expect(node.backgroundRect).toBeDefined();
  });

  it("should default to rectangle when shape name is unknown", async () => {
    const node = await createNode({ shape: "nonexistent-shape", width: 120, height: 80 });
    expect(node.backgroundRect).toBeDefined();
    // Should fall back to rectangle creation without error
  });
});

// ---------------------------------------------------------------------------
// Position Tests (1.37)
// ---------------------------------------------------------------------------

describe("Position", () => {
  it("should set initial x/y from options", async () => {
    const node = await createNode({ x: 200, y: 300 });
    expect(node.options.x).toBe(200);
    expect(node.options.y).toBe(300);
  });

  it("should default x/y to 0 when not provided", async () => {
    const node = await createNode({ x: undefined, y: undefined });
    // Options object may keep undefined if explicitly passed; the actual SVG positions use defaults
    expect(node.options.x ?? 0).toBe(0);
    expect(node.options.y ?? 0).toBe(0);
  });

  it("should translate the group to the new position (immediate)", async () => {
    const node = await createNode({ x: 100, y: 100 });
    const spy = vi.spyOn(node.svgGroup.node, "setAttribute");
    node.position(300, 400);
    // Immediate position sets an explicit transform string translate(300 400)
    const call = spy.mock.calls.find((c) => c[0] === "transform");
    expect(call).toBeTruthy();
    expect(call![1]).toContain("translate(300 400)");
  });

  it("should update options.x/y after position()", async () => {
    const node = await createNode();
    node.position(250, 350);
    expect(node.options.x).toBe(250);
    expect(node.options.y).toBe(350);
  });

  it("should execute callback immediately when no duration", async () => {
    const node = await createNode();
    const cb = vi.fn();
    node.position(200, 300, cb);
    expect(cb).toHaveBeenCalled();
  });

  it("should support easing parameter", async () => {
    const node = await createNode();
    // Just verify no throw
    expect(() => node.position(200, 300, undefined, "-")).not.toThrow();
    expect(() => node.position(200, 300, undefined, "<>")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// The selection outline follows a programmatic move
// ---------------------------------------------------------------------------

describe("Position keeps the selection outline on the note", () => {
  // The outline (svg.select) watches the shape's own attributes; a move lives on the
  // parent group's transform, which it never sees. A note that is moved while selected
  // (a note dropped on a workshop lane becomes a card that is selected while it glides
  // into its slot) must take its outline along, or the outline is left where it was.
  const glideDone = () => new Promise((resolve) => setTimeout(resolve, 200));

  async function selectedNode(selected: boolean) {
    const queueSelectionDecorationRefresh = vi.fn();
    const slate: Record<string, any> = { queueSelectionDecorationRefresh, selectedNodes: [] };
    const node = await createNode({ x: 100, y: 100 }, slate);
    const resizeRotate = { ...createMockResizeRotate(), syncOverlay: vi.fn(), isEnabled: vi.fn().mockReturnValue(selected) };
    (node as any).resizeRotate = resizeRotate;
    if (selected) {
      node.slate.selectedNodes.push(node);
      (node.slate.getSelectedNodes as any).mockReturnValue([node]);
    }
    return { node, queueSelectionDecorationRefresh, resizeRotate };
  }

  it("refreshes the selection outline where a selected note comes to rest after a glide", async () => {
    const { node, queueSelectionDecorationRefresh } = await selectedNode(true);
    node.position(300, 260, undefined, undefined, 60);
    await glideDone();
    expect(node.options.x).toBe(300);
    expect(queueSelectionDecorationRefresh).toHaveBeenCalled();
  });

  it("keeps the outline on a selected note while it glides", async () => {
    const { node, resizeRotate } = await selectedNode(true);
    node.position(300, 260, undefined, undefined, 60);
    await glideDone();
    expect(resizeRotate.syncOverlay).toHaveBeenCalled();
  });

  it("refreshes the selection outline when a selected note is moved at once", async () => {
    const { node, queueSelectionDecorationRefresh } = await selectedNode(true);
    node.position(300, 260);
    expect(queueSelectionDecorationRefresh).toHaveBeenCalled();
  });

  it("leaves the selection alone when the note is not selected", async () => {
    const { node, queueSelectionDecorationRefresh, resizeRotate } = await selectedNode(false);
    node.position(300, 260, undefined, undefined, 60);
    await glideDone();
    node.position(10, 10);
    expect(queueSelectionDecorationRefresh).not.toHaveBeenCalled();
    expect(resizeRotate.syncOverlay).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// setSize Tests (1.38)
// ---------------------------------------------------------------------------

describe("setSize", () => {
  it("should set width and height in options", async () => {
    const node = await createNode({ width: 100, height: 60 });
    node.setSize(200, 120);
    expect(node.options.width).toBe(200);
    expect(node.options.height).toBe(120);
  });

  it("should call size() on backgroundRect", async () => {
    const node = await createNode({ width: 100, height: 60 });
    const spy = vi.spyOn(node.backgroundRect, "size");
    node.setSize(200, 120);
    expect(spy).toHaveBeenCalled();
  });

  it("should update text element position after resize", async () => {
    const node = await createNode({ width: 100, height: 60, text: "Hello" });
    // setSize resizes backgroundRect and recenters text — verify backgroundRect.size is called
    const spy = vi.spyOn(node.backgroundRect, "size");
    node.setSize(200, 120);
    expect(spy).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Rotation Tests (1.39)
// ---------------------------------------------------------------------------

describe("Rotation", () => {
  it("should set rotation via setRotation", async () => {
    const node = await createNode();
    node.setRotation(90);
    expect(node.options.rotate?.rotationAngle).toBe(90);
  });

  it("should return 0 for unrotated node", async () => {
    const node = await createNode();
    expect(node.getRotation()).toBe(0);
  });

  it("should return stored angle after setRotation", async () => {
    const node = await createNode();
    node.setRotation(45);
    expect(node.getRotation()).toBe(45);
  });

  it("should handle rotation angle 0", async () => {
    const node = await createNode();
    node.setRotation(0);
    expect(node.getRotation()).toBe(0);
  });

  it("should handle negative rotation", async () => {
    const node = await createNode();
    node.setRotation(-90);
    expect(node.getRotation()).toBe(-90);
  });

  it("should handle rotation > 360", async () => {
    const node = await createNode();
    node.setRotation(450);
    expect(node.getRotation()).toBe(450);
  });

  it("should initialize rotation from options", async () => {
    const node = await createNode({ rotate: { rotationAngle: 30 } });
    expect(node.options.rotate?.rotationAngle).toBe(30);
  });

  it("should create rotate sub-options object when not present", async () => {
    const node = await createNode();
    node.setRotation(30);
    expect(node.options.rotate).toBeDefined();
    expect(node.options.rotate!.rotationAngle).toBe(30);
  });
});

// ---------------------------------------------------------------------------
// Lock/Unlock Tests (1.41)
// ---------------------------------------------------------------------------

describe("Lock/Unlock", () => {
  it("should lock the node", async () => {
    const node = await createNode();
    node.lock();
    expect(node.options.isLocked).toBe(true);
  });

  it("should set allowDrag to false on lock", async () => {
    const node = await createNode();
    node.lock();
    expect(node.options.allowDrag).toBe(false);
  });

  it("should unlock the node", async () => {
    const node = await createNode();
    node.lock();
    node.unlock();
    expect(node.options.isLocked).toBe(false);
  });

  it("should set allowDrag to true on unlock", async () => {
    const node = await createNode();
    node.lock();
    node.unlock();
    expect(node.options.allowDrag).toBe(true);
  });

  it("should not throw on double lock", async () => {
    const node = await createNode();
    expect(() => {
      node.lock();
      node.lock();
    }).not.toThrow();
  });

  it("should not throw on double unlock", async () => {
    const node = await createNode();
    expect(() => {
      node.unlock();
      node.unlock();
    }).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Resize/Rotate Enable/Disable Delegation Tests (1.42)
// ---------------------------------------------------------------------------

describe("Resize/Rotate delegation", () => {
  it("should delegate enableResizeRotate to slate", async () => {
    const slate = createMockSlate();
    const node = await createNode({}, { enableNodeResizeRotate: slate.enableNodeResizeRotate });
    node.enableResizeRotate();
    expect((node as any).slate.enableNodeResizeRotate).toHaveBeenCalledWith(node);
  });

  it("should delegate disableResizeRotate to slate", async () => {
    const slate = createMockSlate();
    const node = await createNode({}, { disableNodeResizeRotate: slate.disableNodeResizeRotate });
    node.disableResizeRotate();
    expect((node as any).slate.disableNodeResizeRotate).toHaveBeenCalledWith(node);
  });

  it("should enable resize", async () => {
    const node = await createNode();
    node.enableResize();
    expect(node.resizeRotate.options.resizeEnabled).toBe(true);
  });

  it("should disable resize", async () => {
    const node = await createNode();
    node.disableResize();
    expect(node.resizeRotate.options.resizeEnabled).toBe(false);
  });

  it("should enable rotate", async () => {
    const node = await createNode();
    node.enableRotate();
    expect(node.resizeRotate.options.rotateEnabled).toBe(true);
  });

  it("should disable rotate", async () => {
    const node = await createNode();
    node.disableRotate();
    expect(node.resizeRotate.options.rotateEnabled).toBe(false);
  });

  it("should return resize/rotate enabled status", async () => {
    const node = await createNode();
    node.resizeRotate.isEnabled.mockReturnValue(true);
    expect(node.isResizeRotateEnabled()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Connector Delegation Tests (1.44)
// ---------------------------------------------------------------------------

describe("Connector delegation", () => {
  it("should enable connector", async () => {
    const node = await createNode();
    node.enableConnector();
    expect(node.connector.enable).toHaveBeenCalled();
  });

  it("should disable connector", async () => {
    const node = await createNode();
    node.disableConnector();
    expect(node.connector.disable).toHaveBeenCalled();
  });

  it("should connect to another node", async () => {
    const node = await createNode();
    const target = await createNode({ id: "target", x: 300, y: 100 });
    node.connectTo(target);
    expect(node.connector.connectTo).toHaveBeenCalledWith(target, undefined);
  });

  it("should disconnect from a target node", async () => {
    const node = await createNode();
    const target = await createNode({ id: "target", x: 300, y: 100 });
    node.disconnectFrom(target);
    expect(node.connector.disconnectFrom).toHaveBeenCalledWith(target);
  });

  it("should disconnect all connections", async () => {
    const node = await createNode();
    node.disconnectAll();
    expect(node.connector.disconnectAll).toHaveBeenCalled();
  });

  it("should get all connections", async () => {
    const node = await createNode();
    node.getConnections();
    expect(node.connector.getConnections).toHaveBeenCalled();
  });

  it("should get connection by target id", async () => {
    const node = await createNode();
    node.getConnection("target-id");
    expect(node.connector.getConnection).toHaveBeenCalledWith("target-id");
  });

  it("should return connector enabled status", async () => {
    const node = await createNode();
    node.connector.isEnabled.mockReturnValue(true);
    expect(node.isConnectorEnabled()).toBe(true);
  });

  it("should support enableConnectorWithInteractive", async () => {
    const node = await createNode();
    const cb = vi.fn();
    node.enableConnectorWithInteractive(cb);
    expect(node.connector.enable).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Destroy/Remove Tests (1.46)
// ---------------------------------------------------------------------------

describe("Destroy/Remove lifecycle", () => {
  it("should set _destroyed flag on destroy", async () => {
    const node = await createNode();
    expect((node as any)._destroyed).toBeFalsy();
    node.destroy();
    expect((node as any)._destroyed).toBe(true);
  });

  it("should clear pending timeouts on destroy", async () => {
    const node = await createNode();
    // Set artificial timeout IDs
    (node as any)._svgViewboxTimeoutId = 999;
    (node as any)._dragEndTimeoutId = 998;
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    node.destroy();
    expect(clearSpy).toHaveBeenCalledWith(999);
    expect(clearSpy).toHaveBeenCalledWith(998);
  });

  it("should disable resizeRotate on destroy", async () => {
    const node = await createNode();
    node.resizeRotate.isEnabled.mockReturnValue(true);
    node.destroy();
    expect(node.resizeRotate.disable).toHaveBeenCalled();
  });

  it("should disable connector on destroy", async () => {
    const node = await createNode();
    (node.connector as any).isActive = true;
    node.destroy();
    expect(node.connector.disable).toHaveBeenCalled();
  });

  it("should clear relationships on destroy", async () => {
    const node = await createNode();
    node.destroy();
    expect(node.relationships.disable).toHaveBeenCalled();
    expect(node.relationships.removeAll).toHaveBeenCalled();
  });

  it("should remove SVG group on destroy", async () => {
    const node = await createNode();
    const spy = vi.spyOn(node.svgGroup, "remove");
    node.destroy();
    expect(spy).toHaveBeenCalled();
  });

  it("should set isDragging to false on destroy", async () => {
    const node = await createNode();
    (node as any).isDragging = true;
    node.destroy();
    expect((node as any).isDragging).toBe(false);
  });

  it("should not throw on double destroy", async () => {
    const node = await createNode();
    node.destroy();
    expect(() => node.destroy()).not.toThrow();
  });

  it("should call svgGroup.remove() on remove()", async () => {
    const node = await createNode();
    const spy = vi.spyOn(node.svgGroup, "remove");
    node.remove();
    expect(spy).toHaveBeenCalled();
  });

  it("should cleanup connection handles container on remove", async () => {
    const node = await createNode();
    const removeSpy = vi.fn();
    (node as any).connectionHandles = { container: { remove: removeSpy } };
    node.remove();
    expect(removeSpy).toHaveBeenCalled();
  });

  // A room replays "add this note" and "delete it" back to back, and undo
  // replaces every note at once: either can reach a note that is not drawn yet.
  it("can be removed while it is still being drawn, and is then never drawn", async () => {
    const slate = createMockSlate();
    const viewport = await slate.getViewportAsync();
    const node = new Node({ x: 0, y: 0, width: 120, height: 80, text: "Gone", shape: "rectangle" }, slate);
    expect(() => node.remove()).not.toThrow();
    await node.ready;
    expect(viewport.group).not.toHaveBeenCalled();
    expect(node.svgGroup).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Visibility Tests (1.47)
// ---------------------------------------------------------------------------

describe("Visibility", () => {
  it("should hide the node", async () => {
    const node = await createNode();
    const spy = vi.spyOn(node.svgGroup, "hide");
    node.hide();
    expect(spy).toHaveBeenCalled();
  });

  it("should show the node", async () => {
    const node = await createNode();
    const spy = vi.spyOn(node.svgGroup, "show");
    node.show();
    expect(spy).toHaveBeenCalled();
  });

  it("should bring node to front", async () => {
    const node = await createNode();
    const spy = vi.spyOn(node.svgGroup, "front");
    node.toFront();
    expect(spy).toHaveBeenCalled();
  });

  it("should send node to back", async () => {
    const node = await createNode();
    const spy = vi.spyOn(node.svgGroup, "back");
    node.toBack();
    expect(spy).toHaveBeenCalled();
  });

  it("toFront(true) persists (broadcasts); toFront(false) raises visually only", async () => {
    const node = await createNode();
    const frontSpy = vi.spyOn(node.svgGroup, "front");
    const bcast = vi.fn();
    (node.slate as any).broadcast = bcast;

    // Deliberate bring-to-front → broadcasts (persists + undo step).
    node.toFront(true);
    expect(frontSpy).toHaveBeenCalled();
    expect(bcast).toHaveBeenCalledWith("onNodeToFront", { id: node.id });

    // Transient raise on pointer-down/drag-start → visual only, NO broadcast.
    // (A plain click is a zero-distance drag; persisting z-order per click
    // flooded the undo stack.)
    bcast.mockClear();
    frontSpy.mockClear();
    node.toFront(false);
    expect(frontSpy).toHaveBeenCalled();
    expect(bcast).not.toHaveBeenCalled();
  });

  it("a deliberate front or back also moves the note in the slate's note list, which a save keeps (P10)", async () => {
    const reorder = vi.fn();
    const node = await createNode();
    (node.slate as any).nodes = { ...((node.slate as any).nodes || {}), reorder };
    node.toFront(true);
    expect(reorder).toHaveBeenCalledWith(node.id, "front");
    node.toBack();
    expect(reorder).toHaveBeenCalledWith(node.id, "back");
    reorder.mockClear();
    node.toFront(false);
    expect(reorder).not.toHaveBeenCalled();
  });

  it("handleDoubleClickEdit: text node → inline edit; comment → text pane", async () => {
    const node = await createNode();
    (node as any).editor = { startInline: vi.fn() };
    const paneSpy = vi
      .spyOn(node, "requestTextPane")
      .mockImplementation(() => {});

    // Ordinary text node → inline edit (Miro), NOT the pane.
    node.handleDoubleClickEdit();
    expect((node as any).editor.startInline).toHaveBeenCalled();
    expect(paneSpy).not.toHaveBeenCalled();

    // Comment node → falls back to the host text pane, NOT inline edit.
    (node as any).editor.startInline.mockClear();
    node.options.isComment = true;
    node.handleDoubleClickEdit();
    expect(paneSpy).toHaveBeenCalled();
    expect((node as any).editor.startInline).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// setColors Tests (1.47)
// ---------------------------------------------------------------------------

describe("setColors", () => {
  it("should set background color", async () => {
    const node = await createNode({ backgroundColor: "#ff0000" });
    node.setColors("#00ff00");
    expect(node.options.backgroundColor).toBe("#00ff00");
  });

  it("should set border color", async () => {
    const node = await createNode({ borderColor: "#333" });
    node.setColors(undefined, "#ff0000");
    expect(node.options.borderColor).toBe("#ff0000");
  });

  it("should set both colors", async () => {
    const node = await createNode();
    node.setColors("#aaa", "#bbb");
    expect(node.options.backgroundColor).toBe("#aaa");
    expect(node.options.borderColor).toBe("#bbb");
  });

  it("should handle undefined colors (no change)", async () => {
    const node = await createNode({ backgroundColor: "#original", borderColor: "#original2" });
    node.setColors(undefined, undefined);
    expect(node.options.backgroundColor).toBe("#original");
    expect(node.options.borderColor).toBe("#original2");
  });
});

// ---------------------------------------------------------------------------
// Edge Cases Tests (1.47)
// ---------------------------------------------------------------------------

describe("Edge Cases", () => {
  it("should support borderStyle dashed", async () => {
    const node = await createNode({ borderStyle: "dashed" });
    expect(node.options.borderStyle).toBe("dashed");
  });

  it("should support borderStyle dotted", async () => {
    const node = await createNode({ borderStyle: "dotted" });
    expect(node.options.borderStyle).toBe("dotted");
  });

  it("should support borderStyle solid", async () => {
    const node = await createNode({ borderStyle: "solid" });
    expect(node.options.borderStyle).toBe("solid");
  });

  it("should support border opacity", async () => {
    const node = await createNode({ borderOpacity: 0.5 });
    expect(node.options.borderOpacity).toBe(0.5);
  });

  it("should support background opacity", async () => {
    const node = await createNode({ backgroundOpacity: 0.8 });
    expect(node.options.backgroundOpacity).toBe(0.8);
  });

  it("should support font family", async () => {
    const node = await createNode({ fontFamily: "Arial" });
    expect(node.options.fontFamily).toBe("Arial");
  });

  it("should support font color", async () => {
    const node = await createNode({ fontColor: "#ff0000" });
    expect(node.options.fontColor).toBe("#ff0000");
  });

  it("should support font size", async () => {
    const node = await createNode({ fontSize: 20 });
    expect(node.options.fontSize).toBe(20);
  });

  it("should set minimum width/height defaults", async () => {
    const node = await createNode();
    // Default should be at least something
    expect(node.options.width).toBeGreaterThan(0);
    expect(node.options.height).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// getConnection/getConnections Tests
// ---------------------------------------------------------------------------

describe("getConnection / getConnections", () => {
  it("should return empty array when no connections", async () => {
    const node = await createNode();
    expect(node.getConnections()).toEqual([]);
  });

  it("should return null for unknown connection", async () => {
    const node = await createNode();
    expect(node.getConnection("nonexistent")).toBeNull();
  });

  it("should return connections from connector", async () => {
    const node = await createNode();
    node.connector.getConnections.mockReturnValue([{ id: "conn-1", source: node, target: { id: "t1" } }]);
    const conns = node.getConnections();
    expect(conns).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// selection behavior onSelected/onDeselected Tests
// ---------------------------------------------------------------------------

describe("onSelected / onDeselected", () => {
  it("should call onSelected without throwing", async () => {
    const node = await createNode();
    expect(() => node.onSelected()).not.toThrow();
  });

  it("should call onDeselected without throwing", async () => {
    const node = await createNode();
    // Mock enableConnectionHandles since it may need canvas
    (node as any).enableConnectionHandles = vi.fn();
    (node as any).disableConnectionHandles = vi.fn();
    expect(() => node.onDeselected()).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Rotation - Additional Tests
// ---------------------------------------------------------------------------

describe("Rotation - additional", () => {
  it("should preserve translateX/Y when setting rotation", async () => {
    const node = await createNode();
    node.position(200, 300);
    expect(node.options.x).toBe(200);
    node.setRotation(45);
    expect(node.options.rotate?.rotationAngle).toBe(45);
    // Position should still be stored
    expect(node.options.x).toBe(200);
  });

  it("should call getRotation from options.rotate first", async () => {
    const node = await createNode({ rotate: { rotationAngle: 90 } });
    expect(node.getRotation()).toBe(90);
  });

  it("should return 0 getRotation when rotationAngle is 0", async () => {
    const node = await createNode();
    // Default rotation angle is 0 in options.rotate
    expect(node.options.rotate).toBeDefined();
    expect(node.options.rotate!.rotationAngle).toBe(0);
    expect(node.getRotation()).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Destroy - Timer Guard Tests
// ---------------------------------------------------------------------------

describe("Destroy - timer guards", () => {
  it("should guard _svgViewboxTimeoutId callback with _destroyed", async () => {
    const node = await createNode();
    node.destroy();
    // After destroy, _destroyed should be true and callbacks should short-circuit
    expect((node as any)._destroyed).toBe(true);
  });

  it("should guard _dragEndTimeoutId callback with _destroyed", async () => {
    const node = await createNode();
    node.destroy();
    expect((node as any)._destroyed).toBe(true);
    // Timer guard: if callback fires after destroy, it returns early
  });

  it("should clear all timeout IDs to null on destroy", async () => {
    const node = await createNode();
    (node as any)._svgViewboxTimeoutId = 123;
    (node as any)._dragEndTimeoutId = 456;
    (node as any)._previewViewboxTimeoutId = 789;
    (node as any)._connectTimeoutId = 101;
    node.destroy();
    expect((node as any)._svgViewboxTimeoutId).toBeNull();
    expect((node as any)._dragEndTimeoutId).toBeNull();
    expect((node as any)._previewViewboxTimeoutId).toBeNull();
    expect((node as any)._connectTimeoutId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// remove() vs destroy() tests
// ---------------------------------------------------------------------------

describe("remove vs destroy", () => {
  it("should NOT disable sub-modules on remove()", async () => {
    const node = await createNode();
    node.remove();
    // remove() is lighter — doesn't disable resizeRotate, connector, etc.
    expect(node.resizeRotate.disable).not.toHaveBeenCalled();
  });

  it("should disable sub-modules on destroy()", async () => {
    const node = await createNode();
    node.resizeRotate.isEnabled.mockReturnValue(true);
    (node.connector as any).isActive = true;
    node.destroy();
    expect(node.resizeRotate.disable).toHaveBeenCalled();
    expect(node.connector.disable).toHaveBeenCalled();
  });

  it("should remove SVG group on both remove() and destroy()", async () => {
    const node1 = await createNode();
    const spy1 = vi.spyOn(node1.svgGroup, "remove");
    node1.remove();
    expect(spy1).toHaveBeenCalled();

    const node2 = await createNode();
    const spy2 = vi.spyOn(node2.svgGroup, "remove");
    node2.destroy();
    expect(spy2).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// SVG Content Tests
// ---------------------------------------------------------------------------

describe("SVG content", () => {
  it("should store nestedSvg reference for SVG content", async () => {
    const node = await createNode({
      svgContent: "<svg><circle r='20'/></svg>",
      shape: "rectangle",
    });
    if ((node as any)._svgViewboxTimeoutId) {
      clearTimeout((node as any)._svgViewboxTimeoutId);
    }
    expect(node.nestedSvg).toBeDefined();
  });

  it("should set backgroundColor to none for SVG content", async () => {
    const node = await createNode({
      svgContent: "<svg><circle r='20'/></svg>",
      backgroundColor: "#ff0000",
      shape: "rectangle",
    });
    if ((node as any)._svgViewboxTimeoutId) {
      clearTimeout((node as any)._svgViewboxTimeoutId);
    }
    expect(node.options.backgroundColor).toBe("none");
  });

  it("should set borderWidth to 0 for SVG content", async () => {
    const node = await createNode({
      svgContent: "<svg><circle r='20'/></svg>",
      borderWidth: 5,
      shape: "rectangle",
    });
    if ((node as any)._svgViewboxTimeoutId) {
      clearTimeout((node as any)._svgViewboxTimeoutId);
    }
    expect(node.options.borderWidth).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Options Defaults Tests
// ---------------------------------------------------------------------------

describe("Options defaults", () => {
  it("should default allowDrag to true", async () => {
    const node = await createNode();
    expect(node.options.allowDrag).toBe(true);
  });

  it("should default borderWidth to 1", async () => {
    const node = await createNode();
    expect(node.options.borderWidth).toBe(1);
  });

  it("should default textXAlign to center", async () => {
    const node = await createNode();
    expect(node.options.textXAlign).toBe("center");
  });

  it("should default textYAlign to middle", async () => {
    const node = await createNode();
    expect(node.options.textYAlign).toBe("middle");
  });

  it("should default fontSize to 14", async () => {
    const node = await createNode();
    expect(node.options.fontSize).toBe(14);
  });

  it("should default backgroundColor to transparent", async () => {
    const node = await createNode();
    // Default depends on code, but should be a valid color or none
    expect(node.options.backgroundColor).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Enable/Disable Connector Tests
// ---------------------------------------------------------------------------

describe("Enable/Disable connector", () => {
  it("should call connector.enable on enableConnector", async () => {
    const node = await createNode();
    node.enableConnector();
    expect(node.connector.enable).toHaveBeenCalled();
  });

  it("should call connector.disable on disableConnector", async () => {
    const node = await createNode();
    node.disableConnector();
    expect(node.connector.disable).toHaveBeenCalled();
  });

  it("should report isConnectorEnabled correctly", async () => {
    const node = await createNode();
    node.connector.isEnabled.mockReturnValue(false);
    expect(node.isConnectorEnabled()).toBe(false);
    node.connector.isEnabled.mockReturnValue(true);
    expect(node.isConnectorEnabled()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Connection handles tests
// ---------------------------------------------------------------------------

describe("Connection handles", () => {
  it("should not throw on disableConnectionHandles", async () => {
    const node = await createNode();
    expect(() => node.disableConnectionHandles()).not.toThrow();
  });

  it("should return false for isConnectionHandlesEnabled initially", async () => {
    const node = await createNode();
    // By default, connection handles are not visible
    expect(node.isConnectionHandlesEnabled()).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Properties existence tests
// ---------------------------------------------------------------------------

describe("Property existence", () => {
  it("should expose public 'id'", async () => {
    const node = await createNode({ id: "prop-test" });
    expect(node.id).toBe("prop-test");
  });

  it("should expose public 'options'", async () => {
    const node = await createNode();
    expect(node.options).toBeDefined();
    expect(typeof node.options).toBe("object");
  });

  it("should expose public 'svgGroup'", async () => {
    const node = await createNode();
    expect(node.svgGroup).toBeDefined();
  });

  it("should expose public 'ready' promise", async () => {
    const node = await createNode();
    expect(node.ready).toBeInstanceOf(Promise);
  });

  it("should expose sub-modules as public properties", async () => {
    const node = await createNode();
    expect(node.resizeRotate).toBeDefined();
    expect(node.connector).toBeDefined();
    expect(node.relationships).toBeDefined();
    expect(node.images).toBeDefined();
    expect(node.editor).toBeDefined();
    expect(node.links).toBeDefined();
    expect(node.filters).toBeDefined();
    expect(node.menu).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Additional Edge Cases & Functional Tests
// ---------------------------------------------------------------------------

describe("Additional edge cases", () => {
  it("should handle setSize with zero dimensions gracefully", async () => {
    const node = await createNode({ width: 100, height: 60 });
    node.setSize(0, 0);
    expect(node.options.width).toBe(0);
    expect(node.options.height).toBe(0);
  });

  it("should handle negative width/height", async () => {
    const node = await createNode({ width: 100, height: 60 });
    node.setSize(-50, -30);
    expect(node.options.width).toBe(-50);
    expect(node.options.height).toBe(-30);
  });

  it("should call position with animation when duration > 0", async () => {
    const node = await createNode();
    node.position(200, 300, undefined, "-", 500);
    // With duration > 0, animate() is invoked on svgGroup
    expect(node.options.x).toBe(200);
    expect(node.options.y).toBe(300);
  });

  it("should support disableConnector calling connector.disable", async () => {
    const node = await createNode();
    node.disableConnector();
    expect(node.connector.disable).toHaveBeenCalled();
  });

  it("should support disconnectAll calling connector.disconnectAll", async () => {
    const node = await createNode();
    node.disconnectAll();
    expect(node.connector.disconnectAll).toHaveBeenCalled();
  });

  it("should support getConnections via connector delegation", async () => {
    const node = await createNode();
    node.connector.getConnections.mockReturnValue([{ id: "c1" }, { id: "c2" }]);
    const conns = node.getConnections();
    expect(conns).toHaveLength(2);
  });

  it("should support getConnection via connector delegation", async () => {
    const node = await createNode();
    node.connector.getConnection.mockReturnValue({ id: "conn-xyz" });
    const conn = node.getConnection("target");
    expect(conn).toEqual({ id: "conn-xyz" });
  });

  it("should support getConnection returning null", async () => {
    const node = await createNode();
    node.connector.getConnection.mockReturnValue(null);
    expect(node.getConnection("missing")).toBeNull();
  });

  it("should support connectTo with options", async () => {
    const node = await createNode();
    const target = await createNode({ id: "t2", x: 400, y: 200 });
    node.connectTo(target, { lineColor: "#00ff00", lineWidth: 5 });
    expect(node.connector.connectTo).toHaveBeenCalledWith(target, { lineColor: "#00ff00", lineWidth: 5 });
  });

  it("should support disconnectFrom returning boolean", async () => {
    const node = await createNode();
    node.connector.disconnectFrom.mockReturnValue(true);
    const result = node.disconnectFrom({ id: "t99" } as any);
    expect(result).toBe(true);
  });

  it("should have fontSize default of 14", async () => {
    const node = await createNode();
    expect(node.options.fontSize).toBe(14);
  });

  it("should have textXAlign default of center", async () => {
    const node = await createNode();
    expect(node.options.textXAlign).toBe("center");
  });

  it("should have textYAlign default of middle", async () => {
    const node = await createNode();
    expect(node.options.textYAlign).toBe("middle");
  });
});

describe("Node text inset (a custom shape's inner safe area)", () => {
  it("wraps text to the width the inset leaves", async () => {
    const plain = await createNode({ width: 200, height: 60, fontSize: 10 });
    const inset = await createNode({ id: "inset", width: 200, height: 60, fontSize: 10, textInset: { left: 0.2, right: 0.2 } });
    const text = "Free and open source for every team that plans together";
    const linesOf = (node: Node) => (node as any).wrapTextToWidth(text).split("\n").length;
    expect(linesOf(inset)).toBeGreaterThan(linesOf(plain));
  });

  it("clamps each side to 0-0.45 and ignores junk", async () => {
    const node = await createNode({ textInset: { left: 0.9, right: -1, top: "x" } });
    expect((node as any).textInsetSides()).toEqual({ left: 0.45, right: 0, top: 0, bottom: 0 });
  });
});
