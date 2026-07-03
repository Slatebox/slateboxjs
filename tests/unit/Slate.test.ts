// ---------------------------------------------------------------------------
// Slate — comprehensive unit tests
//
// The Slate class is the main orchestrator. It creates an SVG canvas via
// @svgdotjs/svg.js and wires together a dozen sub-modules.  We mock
// *everything* that touches SVG or the DOM so these tests are quick and
// deterministic.
// ---------------------------------------------------------------------------
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

// ---------------------------------------------------------------------------
// SVG.js mock — SVG() factory returns a chaining mock canvas
// ---------------------------------------------------------------------------
// NOTE: vi.mock factories run once and their closures are cached across tests.
// We must NOT use vi.restoreAllMocks() because it would remove mockReturnThis etc.
// Instead we use vi.clearAllMocks() which preserves implementations but clears call history.
vi.mock("@svgdotjs/svg.js", () => {
  // Each call to this function creates a fresh set of mocks.
  const makeElement = () => ({
    addTo: vi.fn().mockReturnThis(),
    size: vi.fn().mockReturnThis(),
    viewbox: vi.fn().mockReturnThis(),
    move: vi.fn().mockReturnThis(),
    center: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    back: vi.fn().mockReturnThis(),
    front: vi.fn().mockReturnThis(),
    remove: vi.fn(),
    hide: vi.fn(),
    show: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    fire: vi.fn(),
    bbox: vi.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 60 }),
    group: vi.fn(() => makeElement()),
    rect: vi.fn(() => makeElement()),
    circle: vi.fn(() => makeElement()),
    line: vi.fn(() => makeElement()),
    node: { tagName: "svg", setAttribute: vi.fn(), getAttribute: vi.fn(), focus: vi.fn() },
  });

  // Single canvas shared across SVG() calls — the Slate class stores
  // a reference and calls methods on it.
  const canvas = makeElement();
  const SVG = vi.fn(() => canvas);

  return {
    SVG,
    Svg: vi.fn(),
    Element: vi.fn(),
    Container: vi.fn(),
    G: vi.fn(),
    Rect: vi.fn(),
    Circle: vi.fn(),
    Line: vi.fn(),
  };
});

// ---------------------------------------------------------------------------
// SVG.js plugin mocks — these modules are imported for side-effects only
// ---------------------------------------------------------------------------
vi.mock("@svgdotjs/svg.draggable.js", () => ({}));
vi.mock("@svgdotjs/svg.panzoom.js", () => ({}));
vi.mock("@svgdotjs/svg.resize.js", () => ({}));
vi.mock("@svgdotjs/svg.select.js", () => ({}));
vi.mock("svg.connectable.js", () => ({}));

// ---------------------------------------------------------------------------
// Sub-module mocks — every class instantiated inside Slate.init()
// ---------------------------------------------------------------------------
vi.mock("../../src/core/NodesManager", () => ({
  NodesManager: vi.fn().mockImplementation((_slate: any) => ({
    add: vi.fn((opts: any) => ({
      id: opts?.id ?? "mock-node",
      options: { ...opts },
      onSelected: vi.fn(),
      onDeselected: vi.fn(),
      resizeRotate: {
        isEnabled: vi.fn().mockReturnValue(false),
        enable: vi.fn(),
        disable: vi.fn(),
      },
      isConnectionHandlesEnabled: vi.fn().mockReturnValue(false),
      enableConnectionHandles: vi.fn(),
      disableConnectionHandles: vi.fn(),
      disableResizeRotate: vi.fn(),
      svgGroup: {
        bbox: vi.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 60 }),
      },
      setSize: vi.fn(),
      position: vi.fn(),
      getRotation: vi.fn().mockReturnValue(0),
      setRotation: vi.fn(),
      remove: vi.fn(),
    })),
    remove: vi.fn().mockReturnValue(true),
    one: vi.fn().mockReturnValue(null),
    allNodes: [],
    moveNodes: vi.fn(),
    addRelationship: vi.fn(),
    removeRelationship: vi.fn(),
    count: vi.fn().mockReturnValue(0),
  })),
}));

vi.mock("../../src/core/Invoker", () => ({
  Invoker: vi.fn().mockImplementation(() => ({
    execute: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
  })),
}));

vi.mock("../../src/core/PanZoom", () => ({
  PanZoom: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
    enablePan: vi.fn(),
    disablePan: vi.fn(),
    enableZoom: vi.fn(),
    disableZoom: vi.fn(),
    pan: vi.fn(),
    panBy: vi.fn(),
    zoom: vi.fn(),
    zoomBy: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    zoomAtPoint: vi.fn(),
    reset: vi.fn(),
    resetZoom: vi.fn(),
    resetPan: vi.fn(),
    fit: vi.fn(),
    center: vi.fn(),
    getZoom: vi.fn().mockReturnValue(1),
    getPan: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    resize: vi.fn(),
    isInitialized: vi.fn().mockReturnValue(true),
  })),
}));

vi.mock("../../src/core/BirdsEye", () => ({
  BirdsEye: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
    isEnabled: vi.fn().mockReturnValue(false),
    scheduleRefresh: vi.fn(),
  })),
}));

vi.mock("../../src/core/UndoRedo", () => ({
  UndoRedo: vi.fn().mockImplementation(() => ({
    undo: vi.fn(),
    redo: vi.fn(),
    snapshot: vi.fn(),
  })),
}));

vi.mock("../../src/core/MultiSelection", () => ({
  MultiSelection: vi.fn().mockImplementation(() => ({
    enable: vi.fn(),
    disable: vi.fn(),
  })),
}));

vi.mock("../../src/core/Grid", () => ({
  Grid: vi.fn().mockImplementation(() => ({
    show: vi.fn(),
    hide: vi.fn(),
    isShown: vi.fn().mockReturnValue(false),
    toggle: vi.fn(),
  })),
}));

vi.mock("../../src/core/Keyboard", () => ({
  Keyboard: vi.fn().mockImplementation(() => ({
    bindGlobal: vi.fn(),
    unbindGlobal: vi.fn(),
  })),
}));

vi.mock("../../src/core/Collab", () => ({
  Collab: vi.fn().mockImplementation(() => ({
    init: vi.fn(),
    destroy: vi.fn(),
  })),
}));

vi.mock("../../src/core/ZoomSlider", () => ({
  ZoomSlider: vi.fn().mockImplementation(() => ({
    show: vi.fn(),
    hide: vi.fn(),
    update: vi.fn(),
    destroy: vi.fn(),
  })),
}));

vi.mock("../../src/core/Presentation", () => ({
  Presentation: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
    isPresenting: vi.fn().mockReturnValue(false),
    extractLayout: vi.fn().mockReturnValue([]),
    goToStep: vi.fn(),
    getCurrentStep: vi.fn().mockReturnValue(0),
  })),
}));

// ---------------------------------------------------------------------------
// Static-function mocks (serialization, export, theme, layout, font-loader)
// ---------------------------------------------------------------------------
vi.mock("../../src/core/Serialization", () => ({
  serialize: vi.fn().mockReturnValue({}),
  deserialize: vi.fn().mockResolvedValue(undefined),
  snapshot: vi.fn().mockReturnValue({}),
}));

vi.mock("../../src/core/Export", () => ({
  exportSVG: vi.fn().mockReturnValue("<svg></svg>"),
  exportPNG: vi.fn().mockResolvedValue("data:image/png;base64,"),
}));

vi.mock("../../src/core/Theme", () => ({
  applyTheme: vi.fn(),
}));

vi.mock("../../src/core/Layout", () => ({
  removeLayoutOverlaps: vi.fn(),
  applyLayout: vi.fn(),
  packageLayout: vi.fn().mockReturnValue([]),
}));

vi.mock("../../src/core/FontLoader", () => ({
  loadAllFonts: vi.fn().mockResolvedValue(undefined),
}));

// ---------------------------------------------------------------------------
// Imports (resolved after mocks are installed)
// ---------------------------------------------------------------------------
import { Slate } from "../../src/core/Slate";
import { NodesManager } from "../../src/core/NodesManager";
import { Invoker } from "../../src/core/Invoker";
import { PanZoom } from "../../src/core/PanZoom";
import { BirdsEye } from "../../src/core/BirdsEye";
import { UndoRedo } from "../../src/core/UndoRedo";
import { MultiSelection } from "../../src/core/MultiSelection";
import { Grid } from "../../src/core/Grid";
import { Keyboard } from "../../src/core/Keyboard";
import { Collab } from "../../src/core/Collab";
import { ZoomSlider } from "../../src/core/ZoomSlider";
import { Presentation } from "../../src/core/Presentation";
import * as Serialization from "../../src/core/Serialization";
import * as Export from "../../src/core/Export";
import * as Theme from "../../src/core/Theme";
import * as Layout from "../../src/core/Layout";
import * as FontLoader from "../../src/core/FontLoader";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a real <div> container (jsdom), used as the Slate mount point. */
function createContainer(): HTMLElement {
  const el = document.createElement("div");
  el.id = "slate-test-container";
  el.style.width = "800px";
  el.style.height = "600px";
  document.body.appendChild(el);
  return el;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("Slate", () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    container = createContainer();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    document.body.removeChild(container);
  });

  // -----------------------------------------------------------------------
  // 1. Construction
  // -----------------------------------------------------------------------
  describe("construction", () => {
    it("stores the container element and sets default options", () => {
      const slate = new Slate(container);

      expect(slate.element).toBe(container);
      expect(slate.options.name).toBe("Untitled Slate");
      expect(slate.options.description).toBe("");
      expect(slate.options.viewPort?.originalWidth).toBe(800);
      expect(slate.options.viewPort?.originalHeight).toBe(600);
      expect(slate.options.containerStyle?.backgroundColor).toBe("#ffffff");
    });

    it("accepts a CSS selector string for the container", () => {
      const slate = new Slate("#slate-test-container");
      expect(slate.element).toBe(container);
    });

    it("throws when the CSS selector does not match any element", () => {
      expect(() => new Slate("#nonexistent-element")).toThrow(
        /Element with selector.*not found/
      );
    });

    it("merges user-supplied options with defaults", () => {
      const slate = new Slate(container, {
        name: "My Diagram",
        enabled: false,
        viewPort: { originalWidth: 1200, showGrid: true, gridSize: 10 },
      });

      expect(slate.options.name).toBe("My Diagram");
      expect(slate.options.enabled).toBe(false);
      expect(slate.options.viewPort?.originalWidth).toBe(1200);
      expect(slate.options.viewPort?.showGrid).toBe(true);
      expect(slate.options.viewPort?.gridSize).toBe(10);
      // viewPort object is shallow-merged so top-level defaults still apply
      expect(slate.options.defaultLineColor).toBe("#000000");
      expect(slate.options.layoutType).toBe("manual");
    });

    it("initialises the SVG canvas and all sub-modules", () => {
      const slate = new Slate(container);

      // Canvas — infinite canvas fills its container and is driven by the
      // viewBox (no fixed size() call)
      expect(slate.canvas).toBeDefined();
      expect(slate.canvas.viewbox).toHaveBeenCalled();

      // Core sub-modules
      expect(NodesManager).toHaveBeenCalledWith(slate);
      expect(Invoker).toHaveBeenCalledWith(slate);
      expect(PanZoom).toHaveBeenCalled();
      expect(BirdsEye).toHaveBeenCalled();
      expect(UndoRedo).toHaveBeenCalled();
      expect(MultiSelection).toHaveBeenCalled();
      expect(Grid).toHaveBeenCalled();
      expect(Keyboard).toHaveBeenCalled();
      expect(Collab).toHaveBeenCalled();
      expect(ZoomSlider).toHaveBeenCalled();

      // Public refs
      expect(slate.nodes).toBeDefined();
      expect(slate.invoker).toBeDefined();
      expect(slate.panZoom).toBeDefined();
      expect(slate.birdsEye).toBeDefined();
      expect(slate.undoRedo).toBeDefined();
      expect(slate.multiSelection).toBeDefined();
      expect(slate.grid).toBeDefined();
      expect(slate.keyboard).toBeDefined();
      expect(slate.collab).toBeDefined();
      expect(slate.zoomSlider).toBeDefined();
      expect(slate.presentation).toBeDefined();
    });

    it("does NOT create coordinate display when showCoordinates is false", () => {
      const slate = new Slate(container, {
        viewPort: { showCoordinates: false },
      });
      const coordEl = container.querySelector("#slate-coordinates");
      expect(coordEl).toBeNull();
    });

    it("attaches an svg click handler for deselection", () => {
      const slate = new Slate(container);
      expect(slate.canvas.on).toHaveBeenCalledWith("click", expect.any(Function));
    });
  });

  // -----------------------------------------------------------------------
  // 2. getViewport / getViewportAsync
  // -----------------------------------------------------------------------
  describe("getViewport / getViewportAsync", () => {
    it("getViewport returns canvas", () => {
      const slate = new Slate(container);
      expect(slate.getViewport()).toBe(slate.canvas);
    });

    it("getViewportAsync resolves to canvas", async () => {
      const slate = new Slate(container);
      const vp = await slate.getViewportAsync();
      expect(vp).toBe(slate.canvas);
    });
  });

  // -----------------------------------------------------------------------
  // 3. Node management (add, remove, get)
  // -----------------------------------------------------------------------
  describe("addNode", () => {
    it("delegates to nodes.add and returns the node", () => {
      const slate = new Slate(container);
      const node = slate.addNode({ id: "n1", text: "Hello" });

      expect(slate.nodes.add).toHaveBeenCalledWith({ id: "n1", text: "Hello" });
      expect(node.id).toBe("n1");
    });

    it("triggers birdsEye refresh via setTimeout", () => {
      const slate = new Slate(container);
      // Enable birdsEye so notifyNodeChanged actually calls scheduleRefresh
      slate.birdsEye.isEnabled.mockReturnValue(true);
      const refreshSpy = vi.spyOn(slate.birdsEye, "scheduleRefresh");

      slate.addNode({ id: "n1" });
      // flush the 100ms timeout
      vi.advanceTimersByTime(100);

      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe("removeNode", () => {
    it("delegates to nodes.remove and returns the result", () => {
      const slate = new Slate(container);
      slate.nodes.remove.mockReturnValue(true);

      const result = slate.removeNode("n1");
      expect(slate.nodes.remove).toHaveBeenCalledWith("n1");
      expect(result).toBe(true);
    });
  });

  describe("getNode / getAllNodes", () => {
    it("getNode delegates to nodes.one", () => {
      const slate = new Slate(container);
      const dummy = { id: "n1" };
      slate.nodes.one.mockReturnValue(dummy);

      expect(slate.getNode("n1")).toBe(dummy);
      expect(slate.nodes.one).toHaveBeenCalledWith("n1");
    });

    it("getAllNodes returns nodes.allNodes", () => {
      const slate = new Slate(container);
      const nodes = [{ id: "n1" }];
      slate.nodes.allNodes = nodes;

      expect(slate.getAllNodes()).toBe(nodes);
    });
  });

  // -----------------------------------------------------------------------
  // 4. Selection management
  // -----------------------------------------------------------------------
  describe("selectNodes", () => {
    it("selects nodes and updates resize/rotate", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNodes([n1, n2]);

      const selected = slate.getSelectedNodes();
      expect(selected).toHaveLength(2);
      expect(selected).toContain(n1);
      expect(selected).toContain(n2);
    });

    it("clears previous selection when addToSelection is false", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNodes([n1]);
      slate.selectNodes([n2]); // replaces

      const selected = slate.getSelectedNodes();
      expect(selected).toHaveLength(1);
      expect(selected[0]).toBe(n2);
    });

    it("adds to existing selection when addToSelection is true", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNodes([n1]);
      slate.selectNodes([n2], true); // adds

      const selected = slate.getSelectedNodes();
      expect(selected).toHaveLength(2);
    });
  });

  describe("selectNode (single, backward compat)", () => {
    it("selects a single node (replaces selection)", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNode(n1);
      expect(slate.getSelectedNodes()).toEqual([n1]);

      slate.selectNode(n2); // replaces
      expect(slate.getSelectedNodes()).toEqual([n2]);
    });
  });

  describe("deselectNode", () => {
    it("removes a node from the selection", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNodes([n1, n2]);
      slate.deselectNode(n1);

      expect(slate.getSelectedNodes()).toEqual([n2]);
    });

    it("no-ops for a node that is not selected", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });

      slate.deselectNode(n1); // never selected
      expect(slate.getSelectedNodes()).toEqual([]);
    });
  });

  describe("clearSelection", () => {
    it("clears all selected nodes", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNodes([n1, n2]);
      slate.clearSelection();

      expect(slate.getSelectedNodes()).toEqual([]);
    });
  });

  describe("getSelectedNode", () => {
    it("returns the first selected node", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      slate.selectNodes([n1, n2]);
      expect(slate.getSelectedNode()).toBe(n1);
    });

    it("returns null when nothing is selected", () => {
      const slate = new Slate(container);
      expect(slate.getSelectedNode()).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // 5. updateSelectionResizeRotate
  // -----------------------------------------------------------------------
  describe("updateSelectionResizeRotate", () => {
    it("disables all resize/rotate on all nodes before acting", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });
      const n2 = slate.addNode({ id: "n2" });

      // Give them enabled resizeRotate
      n1.resizeRotate.isEnabled.mockReturnValue(true);
      n2.resizeRotate.isEnabled.mockReturnValue(true);

      // Force nodes into allNodes
      slate.nodes.allNodes = [n1, n2];

      slate.updateSelectionResizeRotate();

      expect(n1.resizeRotate.disable).toHaveBeenCalled();
      expect(n2.resizeRotate.disable).toHaveBeenCalled();
    });

    it("enables resizeRotate for a single selected node", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });

      slate.selectNodes([n1]);

      expect(n1.resizeRotate.enable).toHaveBeenCalled();
      expect(n1.enableConnectionHandles).toHaveBeenCalled();
    });

    it("creates group resize/rotate for multi-selection", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1", x: 0, y: 0 });
      const n2 = slate.addNode({ id: "n2", x: 200, y: 100 });

      slate.selectNodes([n1, n2]);

      // Should have called canvas.group() to create the group controller
      expect(slate.canvas.group).toHaveBeenCalled();
      // The group's .rect() is called (not canvas.rect directly)
      const group = slate.canvas.group.mock.results[0].value;
      expect(group.rect).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 6. Pan / Zoom API
  // -----------------------------------------------------------------------
  describe("zoom/pan API delegation", () => {
    it("getZoom delegates to panZoom.getZoom", () => {
      const slate = new Slate(container);
      slate.panZoom.getZoom.mockReturnValue(2.5);

      expect(slate.getZoom()).toBe(2.5);
    });

    it("getPan delegates to panZoom.getPan", () => {
      const slate = new Slate(container);
      slate.panZoom.getPan.mockReturnValue({ x: 100, y: 200 });

      const pan = slate.getPan();
      expect(pan).toEqual({ x: 100, y: 200 });
    });

    it("zoom delegates to panZoom.zoom", () => {
      const slate = new Slate(container);
      slate.zoom(2);
      expect(slate.panZoom.zoom).toHaveBeenCalledWith(2);
    });

    it("zoomBy delegates to panZoom.zoomBy", () => {
      const slate = new Slate(container);
      slate.zoomBy(1.5);
      expect(slate.panZoom.zoomBy).toHaveBeenCalledWith(1.5);
    });

    it("zoomIn / zoomOut delegate", () => {
      const slate = new Slate(container);
      slate.zoomIn();
      slate.zoomOut();
      expect(slate.panZoom.zoomIn).toHaveBeenCalled();
      expect(slate.panZoom.zoomOut).toHaveBeenCalled();
    });

    it("zoomAtPoint delegates", () => {
      const slate = new Slate(container);
      slate.zoomAtPoint(3, { x: 400, y: 300 });
      expect(slate.panZoom.zoomAtPoint).toHaveBeenCalledWith(3, {
        x: 400,
        y: 300,
      });
    });

    it("pan / panBy delegate", () => {
      const slate = new Slate(container);
      slate.pan({ x: 10, y: 20 });
      slate.panBy({ x: 5, y: 5 });
      expect(slate.panZoom.pan).toHaveBeenCalledWith({ x: 10, y: 20 });
      expect(slate.panZoom.panBy).toHaveBeenCalledWith({ x: 5, y: 5 });
    });

    it("resetPanZoom / resetZoom / resetPan delegate", () => {
      const slate = new Slate(container);
      slate.resetPanZoom();
      slate.resetZoom();
      slate.resetPan();
      expect(slate.panZoom.reset).toHaveBeenCalled();
      expect(slate.panZoom.resetZoom).toHaveBeenCalled();
      expect(slate.panZoom.resetPan).toHaveBeenCalled();
    });

    it("fitToContent / centerContent delegate", () => {
      const slate = new Slate(container);
      slate.fitToContent();
      slate.centerContent();
      expect(slate.panZoom.fit).toHaveBeenCalled();
      expect(slate.panZoom.center).toHaveBeenCalled();
    });

    it("resizePanZoom delegates", () => {
      const slate = new Slate(container);
      slate.resizePanZoom();
      expect(slate.panZoom.resize).toHaveBeenCalled();
    });

    it("enablePanZoom / disablePanZoom delegate", () => {
      const slate = new Slate(container);
      slate.enablePanZoom();
      slate.disablePanZoom();
      expect(slate.panZoom.enable).toHaveBeenCalled();
      expect(slate.panZoom.disable).toHaveBeenCalled();
    });

    it("enablePan / disablePan / enableZoom / disableZoom delegate", () => {
      const slate = new Slate(container);
      slate.enablePan();
      slate.disablePan();
      slate.enableZoom();
      slate.disableZoom();
      expect(slate.panZoom.enablePan).toHaveBeenCalled();
      expect(slate.panZoom.disablePan).toHaveBeenCalled();
      expect(slate.panZoom.enableZoom).toHaveBeenCalled();
      expect(slate.panZoom.disableZoom).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 7. Serialization API
  // -----------------------------------------------------------------------
  describe("exportJSON", () => {
    it("returns a JSON string", () => {
      const slate = new Slate(container);
      const json = slate.exportJSON();
      expect(typeof json).toBe("string");
      expect(Serialization.serialize).toHaveBeenCalledWith(
        slate,
        undefined,
        undefined
      );
    });

    it("passes nodes and asPresentation through", () => {
      const slate = new Slate(container);
      const nodes = [slate.addNode({ id: "n1" })];
      slate.exportJSON(nodes, true);
      expect(Serialization.serialize).toHaveBeenCalledWith(slate, nodes, true);
    });
  });

  describe("loadJSON", () => {
    it("calls deserialize with the json string", async () => {
      const slate = new Slate(container);
      await slate.loadJSON('{"nodes":[]}');
      expect(Serialization.deserialize).toHaveBeenCalledWith(
        '{"nodes":[]}',
        slate,
        false,
        false
      );
    });

    it("passes preserve and skipZoom", async () => {
      const slate = new Slate(container);
      await slate.loadJSON({} as any, true, true);
      expect(Serialization.deserialize).toHaveBeenCalledWith(
        {},
        slate,
        true,
        true
      );
    });
  });

  describe("snapshot", () => {
    it("calls the snapshot serializer", () => {
      const slate = new Slate(container);
      slate.snapshot();
      expect(Serialization.snapshot).toHaveBeenCalledWith(slate);
    });
  });

  // -----------------------------------------------------------------------
  // 8. Export API (SVG / PNG)
  // -----------------------------------------------------------------------
  describe("svg export", () => {
    it("delegates to exportSVG", () => {
      const slate = new Slate(container);
      const result = slate.svg({});
      expect(Export.exportSVG).toHaveBeenCalledWith(slate, {}, undefined);
      expect(result).toBe("<svg></svg>");
    });

    it("passes callback", () => {
      const slate = new Slate(container);
      const cb = vi.fn();
      slate.svg({}, cb);
      expect(Export.exportSVG).toHaveBeenCalledWith(slate, {}, cb);
    });
  });

  describe("png / pngSync", () => {
    it("png delegates to exportPNG", async () => {
      const slate = new Slate(container);
      const result = await slate.png({});
      expect(Export.exportPNG).toHaveBeenCalledWith(slate, {}, undefined);
      expect(result).toBe("data:image/png;base64,");
    });

    it("pngSync returns a promise resolving to the png result", async () => {
      const slate = new Slate(container);
      const result = await slate.pngSync({});
      expect(Export.exportPNG).toHaveBeenCalledWith(slate, {}, undefined);
      expect(result).toBe("data:image/png;base64,");
    });
  });

  // -----------------------------------------------------------------------
  // 9. Theme API
  // -----------------------------------------------------------------------
  describe("applyTheme", () => {
    it("delegates to Theme.applyTheme", () => {
      const slate = new Slate(container);
      const themeDef = { id: "dark" } as any;
      slate.applyTheme(themeDef, true, false);
      expect(Theme.applyTheme).toHaveBeenCalledWith(slate, themeDef, true, false);
    });
  });

  // -----------------------------------------------------------------------
  // 10. Layout API
  // -----------------------------------------------------------------------
  describe("layout API", () => {
    it("removeLayoutOverlaps delegates", () => {
      const slate = new Slate(container);
      slate.removeLayoutOverlaps(true, 50);
      expect(Layout.removeLayoutOverlaps).toHaveBeenCalledWith(slate, true, 50);
    });

    it("applyLayout delegates", () => {
      const slate = new Slate(container);
      const moves = [{ nodeId: "n1", x: 100, y: 100 }];
      const cb = vi.fn();
      slate.applyLayout(moves, cb, true);
      expect(Layout.applyLayout).toHaveBeenCalledWith(slate, moves, cb, true);
    });

    it("packageLayout delegates", () => {
      const slate = new Slate(container);
      slate.packageLayout();
      expect(Layout.packageLayout).toHaveBeenCalledWith(slate);
    });
  });

  // -----------------------------------------------------------------------
  // v1 compat: getOrientation + emitSlateChange (drop-in contract §C/§F)
  // -----------------------------------------------------------------------
  describe("getOrientation", () => {
    it("computes the padded bounding box over all nodes", () => {
      const slate = new Slate(container);
      slate.nodes.allNodes = [
        { options: { x: 100, y: 100, width: 100, height: 50 } },
        { options: { x: 400, y: 200, width: 100, height: 50 } },
      ] as any;
      const orient = slate.getOrientation();
      expect(orient.width).toBe(420); // 90..510
      expect(orient.height).toBe(170); // 90..260
      expect(orient.left).toBe(90);
      expect(orient.top).toBe(90);
      expect(orient.orientation).toBe("landscape");
    });

    it("reports portrait when height exceeds width", () => {
      const slate = new Slate(container);
      slate.nodes.allNodes = [
        { options: { x: 0, y: 0, width: 50, height: 500 } },
      ] as any;
      expect(slate.getOrientation().orientation).toBe("portrait");
    });

    it("falls back to viewport dimensions when empty", () => {
      const slate = new Slate(container, {
        viewPort: { originalWidth: 800, originalHeight: 600 },
      });
      slate.nodes.allNodes = [] as any;
      const orient = slate.getOrientation();
      expect(orient.width).toBe(800);
      expect(orient.height).toBe(600);
    });
  });

  describe("emitSlateChange (v1 onSlateChanged contract)", () => {
    it("fires events.onSlateChanged with {type, data, instanceId} and a users array", () => {
      const onSlateChanged = vi.fn();
      const slate = new Slate(container, {
        instance: "inst-9",
        events: { onSlateChanged },
      });
      slate.emitSlateChange("onNodeToFront", { id: "n1" });

      expect(onSlateChanged).toHaveBeenCalledTimes(1);
      const [pkg, users] = onSlateChanged.mock.calls[0];
      expect(pkg).toMatchObject({
        type: "onNodeToFront",
        data: { id: "n1" },
        instanceId: "inst-9",
      });
      expect(Array.isArray(users)).toBe(true);
    });

    it("is suppressed between beginRemoteApply and endRemoteApply", () => {
      const onSlateChanged = vi.fn();
      const slate = new Slate(container, { events: { onSlateChanged } });
      slate.beginRemoteApply();
      slate.emitSlateChange("onNodeTextChanged", { id: "n1", text: "x" });
      slate.endRemoteApply();
      expect(onSlateChanged).not.toHaveBeenCalled();

      slate.emitSlateChange("onNodeTextChanged", { id: "n1", text: "y" });
      expect(onSlateChanged).toHaveBeenCalledTimes(1);
    });

    it("survives a throwing host handler", () => {
      const slate = new Slate(container, {
        events: {
          onSlateChanged: () => {
            throw new Error("host bug");
          },
        },
      });
      expect(() =>
        slate.emitSlateChange("onNodeToFront", { id: "n1" })
      ).not.toThrow();
    });

    it("deferEmits() queues packages; flushEmits() delivers them in order", () => {
      const onSlateChanged = vi.fn();
      const slate = new Slate(container, { events: { onSlateChanged } });
      slate.deferEmits();
      slate.emitSlateChange("onNodeAdded", { id: "q1" });
      slate.emitSlateChange("onNodeTextChanged", { id: "q1", text: "t" });
      expect(onSlateChanged).not.toHaveBeenCalled();

      slate.flushEmits();
      expect(onSlateChanged).toHaveBeenCalledTimes(2);
      expect(onSlateChanged.mock.calls[0][0].type).toBe("onNodeAdded");
      expect(onSlateChanged.mock.calls[1][0].type).toBe("onNodeTextChanged");

      // Emission is synchronous again after flush
      slate.emitSlateChange("onZoom", { zoomLevel: 1 });
      expect(onSlateChanged).toHaveBeenCalledTimes(3);
    });

    it("survives a rejecting async host handler", async () => {
      const slate = new Slate(container, {
        events: {
          onSlateChanged: async () => {
            throw new Error("collaborator.current is undefined");
          },
        },
      });
      expect(() =>
        slate.emitSlateChange("onNodeAdded", { id: "n1" })
      ).not.toThrow();
      // Allow the rejection to be handled (would fail the test as an
      // unhandled rejection otherwise). Microtasks only — the suite uses
      // fake timers.
      await Promise.resolve();
      await Promise.resolve();
    });

    it("zoom() emits an onZoom package with zoomLevel", () => {
      const onSlateChanged = vi.fn();
      const slate = new Slate(container, { events: { onSlateChanged } });
      slate.zoom(2);
      const zoomPkg = onSlateChanged.mock.calls.find(
        (c: any[]) => c[0].type === "onZoom"
      );
      expect(zoomPkg).toBeDefined();
      expect(zoomPkg![0].data).toEqual({ zoomLevel: 2 });
    });
  });

  // -----------------------------------------------------------------------
  // 11. Display locks
  // -----------------------------------------------------------------------
  describe("displayLocks / hideLocks", () => {
    it("displayLocks iterates locked nodes", () => {
      const slate = new Slate(container);
      const locked = slate.addNode({ id: "locked", isLocked: true });
      const unlocked = slate.addNode({ id: "unlocked", isLocked: false });
      slate.nodes.allNodes = [locked, unlocked];

      // Should not throw
      expect(() => slate.displayLocks()).not.toThrow();
    });

    it("hideLocks runs without error", () => {
      const slate = new Slate(container);
      expect(() => slate.hideLocks()).not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // 12. Font loading
  // -----------------------------------------------------------------------
  describe("loadAllFonts", () => {
    it("delegates to FontLoader.loadAllFonts", async () => {
      const slate = new Slate(container);
      await slate.loadAllFonts();
      expect(FontLoader.loadAllFonts).toHaveBeenCalledWith(slate);
    });
  });

  // -----------------------------------------------------------------------
  // 13. notifyNodeChanged
  // -----------------------------------------------------------------------
  describe("notifyNodeChanged", () => {
    it("schedules birdsEye refresh when birdsEye is enabled", () => {
      const slate = new Slate(container);
      slate.birdsEye.isEnabled.mockReturnValue(true);

      slate.notifyNodeChanged();
      expect(slate.birdsEye.scheduleRefresh).toHaveBeenCalled();
    });

    it("does nothing when birdsEye is disabled", () => {
      const slate = new Slate(container);
      slate.birdsEye.isEnabled.mockReturnValue(false);

      slate.notifyNodeChanged();
      expect(slate.birdsEye.scheduleRefresh).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 14. enableNodeResizeRotate / disableNodeResizeRotate
  // -----------------------------------------------------------------------
  describe("enableNodeResizeRotate / disableNodeResizeRotate", () => {
    it("selects the node if it is not already selected", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });

      slate.enableNodeResizeRotate(n1);
      expect(slate.getSelectedNodes()).toContain(n1);
    });
  });

  // -----------------------------------------------------------------------
  // 15. Event delegation (onXXXX methods)
  // -----------------------------------------------------------------------
  describe("event options (onXXXX)", () => {
    it("passes onSlateChanged to events config", () => {
      const onSlateChanged = vi.fn();
      const slate = new Slate(container, {
        events: { onSlateChanged },
      });
      expect(slate.options.events?.onSlateChanged).toBe(onSlateChanged);
    });

    it("passes multiple event callbacks through options", () => {
      const events = {
        onCanvasClicked: vi.fn(),
        onNodeDragged: vi.fn(),
        onMenuRequested: vi.fn(),
        isReadOnly: vi.fn().mockReturnValue(false),
      };

      const slate = new Slate(container, { events });

      expect(slate.options.events?.onCanvasClicked).toBe(events.onCanvasClicked);
      expect(slate.options.events?.onNodeDragged).toBe(events.onNodeDragged);
      expect(slate.options.events?.onMenuRequested).toBe(events.onMenuRequested);
      expect(slate.options.events?.isReadOnly).toBe(events.isReadOnly);
    });

    it("allows all defined event hooks in SlateEvents", () => {
      // Ensure every known event can be set without error
      const events: Record<string, any> = {
        onSlateChanged: vi.fn(),
        onInitCollaboration: vi.fn(),
        onTextPaneRequested: vi.fn(),
        onLineMenuRequested: vi.fn(),
        onTakeSnapshot: vi.fn(),
        onConfirmRequested: vi.fn(),
        onCollaborationUsersChanged: vi.fn(),
        onCollaborationUsersRemoved: vi.fn(),
        onCollaboration: vi.fn(),
        onNodeDragged: vi.fn(),
        onCanvasClicked: vi.fn(),
        onImagesRequested: vi.fn(),
        onRequestSave: vi.fn(),
        onCreateImage: vi.fn(),
        onMenuRequested: vi.fn(),
        isReadOnly: vi.fn(),
        isCommentOnly: vi.fn(),
        canRemoveComments: vi.fn(),
      };

      const slate = new Slate(container, { events });
      expect(slate.options.events).toMatchObject(events);
    });
  });

  // -----------------------------------------------------------------------
  // 16. Options that affect init behaviour
  // -----------------------------------------------------------------------
  describe("init behaviour driven by options", () => {
    it("shows grid when viewPort.showGrid is true", () => {
      const slate = new Slate(container, {
        viewPort: { showGrid: true, gridSize: 20 },
      });
      expect(slate.grid.show).toHaveBeenCalled();
    });

    it("enables birdsEye with a delay when birdsEye.enabled is true", () => {
      const slate = new Slate(container, {
        birdsEye: { enabled: true } as any,
      });
      // setTimeout hasn't fired yet
      expect(slate.birdsEye.enable).not.toHaveBeenCalled();
      // flush the 200ms timer
      vi.advanceTimersByTime(200);
      expect(slate.birdsEye.enable).toHaveBeenCalled();
    });

    it("binds keyboard globally when enabled is not false", () => {
      const slate = new Slate(container, { enabled: true });
      expect(slate.keyboard.bindGlobal).toHaveBeenCalled();
    });

    it("skips keyboard global bind when enabled is false", () => {
      const slate = new Slate(container, { enabled: false });
      expect(slate.keyboard.bindGlobal).not.toHaveBeenCalled();
    });

    it("creates coordinate display only when showCoordinates is opted in", () => {
      // Hidden by default (production / presentation must not show the debug readout)
      const slateDefault = new Slate(container);
      vi.advanceTimersByTime(150);
      expect(container.querySelector("#slate-coordinates")).toBeNull();

      // Opt-in shows it
      const container2 = document.createElement("div");
      container2.style.width = "800px";
      container2.style.height = "600px";
      document.body.appendChild(container2);
      const slate = new Slate(container2, { showCoordinates: true } as any);
      vi.advanceTimersByTime(150);
      const coordEl = container2.querySelector("#slate-coordinates");
      expect(coordEl).not.toBeNull();
      expect(coordEl?.textContent).toContain("zoom:");
    });
  });

  // -----------------------------------------------------------------------
  // 17. Edge cases
  // -----------------------------------------------------------------------
  describe("edge cases", () => {
    it("handles empty node list in lock display", () => {
      const slate = new Slate(container);
      slate.nodes.allNodes = [];
      expect(() => slate.displayLocks()).not.toThrow();
    });

    it("selecting the same node twice does not duplicate it", () => {
      const slate = new Slate(container);
      const n1 = slate.addNode({ id: "n1" });

      slate.selectNodes([n1]);
      slate.selectNodes([n1], true); // add same node again

      expect(slate.getSelectedNodes()).toHaveLength(1);
    });
  });
});
