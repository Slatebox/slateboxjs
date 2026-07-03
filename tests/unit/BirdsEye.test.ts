// ---------------------------------------------------------------------------
// BirdsEye — comprehensive unit tests
//
// BirdsEye creates a mini-map / overview panel showing a scaled-down version
// of the canvas with a viewport indicator.  We mock SVG.js and provide a
// minimal mock Slate so tests are fast and deterministic.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BirdsEye } from "../../src/core/BirdsEye";

// ---------------------------------------------------------------------------
// SVG.js mock — chaining mocks for all SVG element types used by BirdsEye
// ---------------------------------------------------------------------------
vi.mock("@svgdotjs/svg.js", () => {
  // Build a mock element object whose chainable methods return `el` itself.
  function makeElement(
    overrides: Record<string, any> = {}
  ): Record<string, any> {
    const el: Record<string, any> = {
      addTo: vi.fn(() => el),
      size: vi.fn(() => el),
      viewbox: vi.fn(() => el),
      move: vi.fn(() => el),
      center: vi.fn(() => el),
      fill: vi.fn(() => el),
      stroke: vi.fn(() => el),
      attr: vi.fn(() => el),
      back: vi.fn(() => el),
      front: vi.fn(() => el),
      remove: vi.fn(),
      hide: vi.fn(),
      show: vi.fn(),
      on: vi.fn(() => el),
      off: vi.fn(() => el),
      fire: vi.fn(),
      bbox: vi.fn(() => ({ x: 0, y: 0, width: 100, height: 60 })),
      rbox: vi.fn(() => ({
        x: 0, y: 0, width: 100, height: 60, cx: 50, cy: 30,
      })),
      css: vi.fn(() => el),
      clone: vi.fn(() => el),
      each: vi.fn(),
      first: vi.fn(),
      last: vi.fn(),
      circle: vi.fn(() => makeElement()),
      rect: vi.fn(() => makeElement()),
      line: vi.fn(() => makeElement()),
      group: vi.fn(() => makeElement()),
      nested: vi.fn(() => makeElement()),
      polygon: vi.fn(() => makeElement()),
      children: vi.fn(() => []),
      node: { tagName: "svg", setAttribute: vi.fn() },
      rotate: vi.fn(() => el),
    };
    Object.assign(el, overrides);
    return el;
  }

  // Single shared SVG canvas — each SVG() call returns the same object.
  const sharedCanvas = makeElement();
  const SVG = vi.fn(() => sharedCanvas);

  return { SVG, Svg: vi.fn(), Element: vi.fn(), Container: vi.fn(), G: vi.fn(), Rect: vi.fn(), Circle: vi.fn(), Line: vi.fn() };
});

// Also mock the panzoom plugin (imported for side-effects by PanZoom, not by BirdsEye directly)
vi.mock("@svgdotjs/svg.panzoom.js", () => ({}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a minimal mock node for rendering in the minimap. */
function createMockNode(
  id: string,
  overrides: Record<string, any> = {}
): Record<string, any> {
  return {
    id,
    options: {
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      shape: "rectangle",
      backgroundColor: "#f0f0f0",
      rotate: { rotationAngle: 0 },
      ...overrides,
    },
  };
}

/** Create a mock pan-zoom controller. */
function createMockPanZoom(
  overrides: Record<string, any> = {}
): Record<string, any> {
  return {
    getZoom: vi.fn().mockReturnValue(1),
    getPan: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    pan: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  };
}

/** Build a mock Slate object that BirdsEye depends on. */
function createMockSlate(
  nodes: Record<string, any>[] = [],
  panZoomOverrides: Record<string, any> = {}
): Record<string, any> {
  const element = document.createElement("div");
  element.style.position = "relative";
  element.style.width = "800px";
  element.style.height = "600px";

  return {
    element,
    canvas: {
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
    },
    panZoom: createMockPanZoom(panZoomOverrides),
    getAllNodes: vi.fn().mockReturnValue(nodes),
    options: {
      viewPort: {
        originalWidth: 800,
        originalHeight: 600,
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("BirdsEye", () => {
  let mockSlate: ReturnType<typeof createMockSlate>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, "log").mockImplementation(() => {});
    mockSlate = createMockSlate();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();

    // Ensure any leftover container is cleaned up
    if (mockSlate.element.parentNode) {
      mockSlate.element.parentNode.removeChild(mockSlate.element);
    }
  });

  // -----------------------------------------------------------------------
  // 1. Construction & initialisation
  // -----------------------------------------------------------------------
  describe("construction", () => {
    it("stores the slate reference", () => {
      const be = new BirdsEye(mockSlate);
      expect(be).toBeDefined();
    });

    it("applies default options when none are given", () => {
      const be = new BirdsEye(mockSlate);
      const opts = (be as any).options;
      expect(opts.enabled).toBe(false);
      expect(opts.position).toBe("bottom-right");
      expect(opts.width).toBe(200);
      expect(opts.height).toBe(150);
      expect(opts.backgroundColor).toBe("rgba(255, 255, 255, 0.95)");
      expect(opts.viewportColor).toBe("rgba(66, 133, 244, 0.3)");
      expect(opts.viewportBorderColor).toBe("#4285f4");
      expect(opts.nodeColor).toBe("#666666");
      expect(opts.borderRadius).toBe(4);
      expect(opts.margin).toBe(10);
      expect(opts.showZoomControls).toBe(true);
    });

    it("merges user-supplied options with defaults", () => {
      const be = new BirdsEye(mockSlate, {
        position: "top-left",
        width: 300,
        height: 200,
        showZoomControls: false,
        nodeColor: "#ff0000",
      });
      const opts = (be as any).options;
      expect(opts.position).toBe("top-left");
      expect(opts.width).toBe(300);
      expect(opts.height).toBe(200);
      expect(opts.showZoomControls).toBe(false);
      expect(opts.nodeColor).toBe("#ff0000");
      // Defaults still apply
      expect(opts.backgroundColor).toBe("rgba(255, 255, 255, 0.95)");
      expect(opts.borderRadius).toBe(4);
    });

    it("starts in disabled state", () => {
      const be = new BirdsEye(mockSlate);
      expect(be.isEnabled()).toBe(false);
    });

    it("is not enabled when constructed with enabled: false", () => {
      const be = new BirdsEye(mockSlate, { enabled: false });
      expect(be.isEnabled()).toBe(false);
    });

    it("starts with empty node shapes map", () => {
      const be = new BirdsEye(mockSlate);
      expect((be as any).nodeShapes.size).toBe(0);
    });

    it("starts with scale=0.1", () => {
      const be = new BirdsEye(mockSlate);
      expect((be as any).scale).toBe(0.1);
    });
  });

  // -----------------------------------------------------------------------
  // 2. enable / disable lifecycle
  // -----------------------------------------------------------------------
  describe("enable / disable", () => {
    it("enable() creates a container div in the slate element", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container).not.toBeNull();
      expect(container!.style.position).toBe("absolute");
      expect(container!.style.bottom).toBe("10px");
      expect(container!.style.right).toBe("10px");
      expect(container!.style.width).toBe("200px");
      expect(container!.style.height).toBe("150px");
    });

    it("enable() sets _enabled to true and returns isEnabled() true", () => {
      const be = new BirdsEye(mockSlate);
      expect(be.isEnabled()).toBe(false);
      be.enable();
      expect(be.isEnabled()).toBe(true);
    });

    it("enable() is idempotent — second call does nothing", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      const count = mockSlate.element.querySelectorAll(
        ".slateboxjs-birdseye"
      ).length;
      be.enable();
      expect(
        mockSlate.element.querySelectorAll(".slateboxjs-birdseye").length
      ).toBe(count);
    });

    it("enable() positions at top-right when configured", () => {
      const be = new BirdsEye(mockSlate, { position: "top-right" });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container!.style.top).toBe("10px");
      expect(container!.style.right).toBe("10px");
      expect(container!.style.bottom).toBe("");
      expect(container!.style.left).toBe("");
    });

    it("enable() positions at top-left when configured", () => {
      const be = new BirdsEye(mockSlate, { position: "top-left" });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container!.style.top).toBe("10px");
      expect(container!.style.left).toBe("10px");
    });

    it("enable() positions at bottom-left when configured", () => {
      const be = new BirdsEye(mockSlate, { position: "bottom-left" });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container!.style.bottom).toBe("10px");
      expect(container!.style.left).toBe("10px");
    });

    it("enable() honours a custom margin", () => {
      const be = new BirdsEye(mockSlate, { margin: 25 });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container!.style.bottom).toBe("25px");
      expect(container!.style.right).toBe("25px");
    });

    it("enable() creates zoom controls by default", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const zoomControls = mockSlate.element.querySelector(
        ".slateboxjs-birdseye-zoom-controls"
      );
      expect(zoomControls).not.toBeNull();
    });

    it("enable() does NOT create zoom controls when showZoomControls is false", () => {
      const be = new BirdsEye(mockSlate, { showZoomControls: false });
      be.enable();

      const zoomControls = mockSlate.element.querySelector(
        ".slateboxjs-birdseye-zoom-controls"
      );
      expect(zoomControls).toBeNull();
    });

    it("disable() removes the container from DOM", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye")
      ).not.toBeNull();

      be.disable();
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye")
      ).toBeNull();
    });

    it("disable() sets _enabled to false", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(be.isEnabled()).toBe(true);

      be.disable();
      expect(be.isEnabled()).toBe(false);
    });

    it("disable() clears internal references", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      be.disable();

      expect((be as any).container).toBeNull();
      expect((be as any).miniCanvas).toBeNull();
      expect((be as any).viewportIndicator).toBeNull();
      expect((be as any).nodeShapes.size).toBe(0);
    });

    it("disable() is idempotent", () => {
      const be = new BirdsEye(mockSlate);
      expect(() => be.disable()).not.toThrow();

      be.enable();
      be.disable();
      expect(() => be.disable()).not.toThrow();
    });

    it("disable() removes zoom controls when present", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye-zoom-controls")
      ).not.toBeNull();

      be.disable();
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye-zoom-controls")
      ).toBeNull();
    });

    it("disable() stops polling intervals", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect((be as any).pollIntervalId).not.toBeNull();

      be.disable();
      expect((be as any).pollIntervalId).toBeNull();
    });

    it("disable() stops zoom display interval", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect((be as any).zoomDisplayIntervalId).not.toBeNull();

      be.disable();
      expect((be as any).zoomDisplayIntervalId).toBeNull();
    });

    it("disable() clears any pending refresh timeout", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      be.scheduleRefresh();
      expect((be as any).refreshTimeoutId).not.toBeNull();

      be.disable();
      expect((be as any).refreshTimeoutId).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // 3. Update / refresh behaviour
  // -----------------------------------------------------------------------
  describe("refresh", () => {
    it("refresh() does nothing when disabled", () => {
      const be = new BirdsEye(mockSlate);
      expect(() => be.refresh()).not.toThrow();
    });

    it("refresh() re-renders nodes when enabled", () => {
      const node = createMockNode("n1");
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      // Add a second node and refresh
      const node2 = createMockNode("n2");
      mockSlate.getAllNodes.mockReturnValue([node, node2]);

      be.refresh();
      expect((be as any).nodeShapes.size).toBe(2);
    });

    it("refresh() calls updateViewport", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      const updateSpy = vi.spyOn(be, "updateViewport");

      be.refresh();
      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe("updateViewport", () => {
    it("updateViewport() does nothing when disabled", () => {
      const be = new BirdsEye(mockSlate);
      expect(() => be.updateViewport()).not.toThrow();
    });

    it("updateViewport() does nothing without panZoom", () => {
      mockSlate.panZoom = null;
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(() => be.updateViewport()).not.toThrow();
    });

    it("updateViewport() updates indicator size and position based on pan/zoom", () => {
      const node = createMockNode("n1", { x: 50, y: 50, width: 100, height: 60 });
      mockSlate = createMockSlate([node], {
        getZoom: vi.fn().mockReturnValue(1),
        getPan: vi.fn().mockReturnValue({ x: 50, y: 50 }),
      });
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      expect(indicator.move).toHaveBeenCalled();
      expect(indicator.size).toHaveBeenCalled();

      const lastMoveArgs = indicator.move.mock.calls[
        indicator.move.mock.calls.length - 1
      ];
      expect(typeof lastMoveArgs[0]).toBe("number");
      expect(typeof lastMoveArgs[1]).toBe("number");

      const lastSizeArgs = indicator.size.mock.calls[
        indicator.size.mock.calls.length - 1
      ];
      expect(lastSizeArgs[0]).toBeGreaterThanOrEqual(10);
      expect(lastSizeArgs[1]).toBeGreaterThanOrEqual(10);
    });

    it("updateViewport() recomputes scale from content bounds", () => {
      const node1 = createMockNode("n1", { x: 0, y: 0, width: 100, height: 60 });
      const node2 = createMockNode("n2", {
        x: 500, y: 400, width: 200, height: 100,
      });
      mockSlate = createMockSlate([node1, node2]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const scale = (be as any).scale;
      expect(scale).toBeGreaterThan(0);
      expect(scale).toBeLessThan(1);
    });

    it("updateViewport() handles zoom level > 1", () => {
      const node = createMockNode("n1");
      mockSlate = createMockSlate([node], {
        getZoom: vi.fn().mockReturnValue(2),
        getPan: vi.fn().mockReturnValue({ x: 100, y: 100 }),
      });
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      const lastSizeArgs = indicator.size.mock.calls[
        indicator.size.mock.calls.length - 1
      ];

      expect(lastSizeArgs[0]).toBeGreaterThan(0);
      expect(lastSizeArgs[1]).toBeGreaterThan(0);
    });
  });

  describe("scheduleRefresh", () => {
    it("debounces multiple calls — only one refresh after timeout", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      const refreshSpy = vi.spyOn(be, "refresh");

      be.scheduleRefresh();
      be.scheduleRefresh();
      be.scheduleRefresh();

      // Timeout not yet fired — refresh should not have been called
      expect(refreshSpy).not.toHaveBeenCalled();

      // Advance past the 300ms debounce
      vi.advanceTimersByTime(300);
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });

    it("does nothing when disabled", () => {
      const be = new BirdsEye(mockSlate);
      const refreshSpy = vi.spyOn(be, "refresh");

      be.scheduleRefresh();
      vi.advanceTimersByTime(300);

      // refresh() returns early when not enabled, but was still called
      expect(refreshSpy).toHaveBeenCalledTimes(1);
    });
  });

  // -----------------------------------------------------------------------
  // 4. Viewport rectangle positioning
  // -----------------------------------------------------------------------
  describe("viewport indicator", () => {
    it("is created with correct fill and stroke colors", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      expect(indicator).not.toBeNull();
      expect(indicator.fill).toHaveBeenCalledWith(
        "rgba(66, 133, 244, 0.3)"
      );
      expect(indicator.stroke).toHaveBeenCalledWith({
        color: "#4285f4",
        width: 2,
      });
    });

    it("is brought to front when a node is added after initial render", () => {
      const node = createMockNode("n1");
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      indicator.front.mockClear();

      // Adding a new node after enable should bring viewport to front
      const newNode = createMockNode("n2");
      be.addNodeShape(newNode);
      expect(indicator.front).toHaveBeenCalled();
    });

    it("has cursor:move CSS style", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      expect(indicator.css).toHaveBeenCalledWith({ cursor: "move" });
    });

    it("has a mousedown handler registered for dragging", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      expect(indicator.on).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function)
      );
    });
  });

  // -----------------------------------------------------------------------
  // 5. Click-to-navigate functionality (dragging the viewport indicator)
  // -----------------------------------------------------------------------
  describe("viewport dragging", () => {
    it("mousedown on indicator starts drag and sets up state", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      const mousedownHandler = indicator.on.mock.calls.find(
        (call: any[]) => call[0] === "mousedown"
      )?.[1];
      expect(mousedownHandler).toBeDefined();

      const fakeEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 50,
      };
      mousedownHandler(fakeEvent);

      expect(fakeEvent.preventDefault).toHaveBeenCalled();
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect((be as any).isDragging).toBe(true);
      expect((be as any).dragStartX).toBe(100);
      expect((be as any).dragStartY).toBe(50);
      expect((be as any).boundMouseMove).not.toBeNull();
      expect((be as any).boundMouseUp).not.toBeNull();
    });

    it("mouseup ends dragging and removes document listeners", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const indicator = (be as any).viewportIndicator;
      const mousedownHandler = indicator.on.mock.calls.find(
        (call: any[]) => call[0] === "mousedown"
      )?.[1];

      mousedownHandler({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 50,
      });

      expect((be as any).isDragging).toBe(true);

      const mouseupHandler = (be as any).boundMouseUp;
      expect(mouseupHandler).not.toBeNull();

      mouseupHandler({});

      expect((be as any).isDragging).toBe(false);
      expect((be as any).boundMouseMove).toBeNull();
      expect((be as any).boundMouseUp).toBeNull();
    });

    it("mousemove during drag calls panZoom.pan()", () => {
      const node = createMockNode("n1", { x: 0, y: 0, width: 100, height: 60 });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      // Override scale to a predictable value
      (be as any).scale = 0.25;

      const indicator = (be as any).viewportIndicator;
      const mousedownHandler = indicator.on.mock.calls.find(
        (call: any[]) => call[0] === "mousedown"
      )?.[1];

      // Make the indicator's bbox() return our desired viewportStart
      indicator.bbox.mockReturnValue({ x: 10, y: 10, width: 100, height: 60 });

      mousedownHandler({
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 50,
      });

      expect((be as any).viewportStartX).toBe(10);
      expect((be as any).viewportStartY).toBe(10);

      const mousemoveHandler = (be as any).boundMouseMove;
      // Clear any move calls from enable()
      indicator.move.mockClear();
      mousemoveHandler({ clientX: 120, clientY: 60 });

      // newX = viewportStartX + deltaX = 10 + 20 = 30
      expect(indicator.move).toHaveBeenCalledWith(30, 20);
      expect(mockSlate.panZoom.pan).toHaveBeenCalledWith(
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
        })
      );
    });
  });

  // -----------------------------------------------------------------------
  // 6. Node shape management
  // -----------------------------------------------------------------------
  describe("node shape management", () => {
    it("addNodeShape creates a rect for rectangular nodes", () => {
      const node = createMockNode("n1");
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const newNode = createMockNode("n2", { x: 200, y: 150 });
      be.addNodeShape(newNode);

      const shape = (be as any).nodeShapes.get("n2");
      expect(shape).toBeDefined();
      expect(shape.move).toHaveBeenCalled();
      expect(shape.fill).toHaveBeenCalled();
      expect(shape.stroke).toHaveBeenCalledWith({ width: 0 });
    });

    it("addNodeShape creates a circle for circular nodes", () => {
      const node = createMockNode("n1", { shape: "circle", width: 80, height: 80 });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const miniCanvas = (be as any).miniCanvas;
      expect(miniCanvas.circle).toHaveBeenCalled();
    });

    it("addNodeShape does nothing when disabled", () => {
      const node = createMockNode("n1");
      const be = new BirdsEye(mockSlate);
      be.addNodeShape(node);
      expect((be as any).nodeShapes.size).toBe(0);
    });

    it("removeNodeShape removes shape from map and DOM", () => {
      const node = createMockNode("n1");
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      expect((be as any).nodeShapes.has("n1")).toBe(true);

      be.removeNodeShape("n1");
      expect((be as any).nodeShapes.has("n1")).toBe(false);
    });

    it("removeNodeShape handles unknown id gracefully", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(() => be.removeNodeShape("does-not-exist")).not.toThrow();
    });

    it("updateNodePosition updates an existing node shape position", () => {
      const node = createMockNode("n1");
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const shape = (be as any).nodeShapes.get("n1");
      expect(shape).toBeDefined();
      shape.move.mockClear();

      node.options.x = 200;
      node.options.y = 150;
      mockSlate.getAllNodes.mockReturnValue([node]);

      be.updateNodePosition(node);
      // Position is now animated (Q4) via requestAnimationFrame — drive it.
      vi.advanceTimersByTime(300);
      expect(shape.move).toHaveBeenCalled();
    });

    it("updateNodePosition does nothing for unknown node", () => {
      const node = createMockNode("n1");
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(() => be.updateNodePosition(node)).not.toThrow();
    });

    it("updateNodePosition does nothing when disabled", () => {
      const node = createMockNode("n1");
      const be = new BirdsEye(mockSlate);
      expect(() => be.updateNodePosition(node)).not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // 7. Edge cases
  // -----------------------------------------------------------------------
  describe("edge cases", () => {
    it("handles empty node list without errors", () => {
      mockSlate = createMockSlate([]);
      const be = new BirdsEye(mockSlate);
      expect(() => be.enable()).not.toThrow();
      expect(be.isEnabled()).toBe(true);
    });

    it("renders nothing when there are no nodes", () => {
      mockSlate = createMockSlate([]);
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect((be as any).nodeShapes.size).toBe(0);
    });

    it("calculateContentBounds returns viewport bounds when no nodes exist", () => {
      mockSlate = createMockSlate([]);
      const be = new BirdsEye(mockSlate);
      const bounds = (be as any).calculateContentBounds();
      expect(bounds).toEqual({
        minX: 0,
        minY: 0,
        maxX: 800,
        maxY: 600,
      });
    });

    it("calculateContentBounds frames the node content, not the origin/viewport (M5)", () => {
      // Nodes live far out in world space; the minimap must frame the ACTUAL
      // node content (so it centers), NOT expand to include origin (0,0) or the
      // viewport size — that shoved content into the far corner / off the map.
      const node = createMockNode("n1", { x: -500, y: -500 });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      const bounds = (be as any).calculateContentBounds();
      expect(bounds.minX).toBe(-500);
      expect(bounds.minY).toBe(-500);
      // Bounds hug the node box (default 100x60) — no origin/viewport expansion.
      expect(bounds.maxX).toBe(-400);
      expect(bounds.maxY).toBe(-440);
    });

    it("handleMouseUp cleans up even if called without prior mousedown", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect(() => (be as any).handleMouseUp()).not.toThrow();
    });

    it("polling interval calls updateViewport", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();
      const updateSpy = vi.spyOn(be, "updateViewport");

      vi.advanceTimersByTime(100);
      expect(updateSpy).toHaveBeenCalled();
    });

    it("does not crash when canvas is null during enable", () => {
      mockSlate.canvas = null;
      const be = new BirdsEye(mockSlate);
      expect(() => be.enable()).not.toThrow();
    });

    it("handles very large coordinate values without overflow", () => {
      const node = createMockNode("n1", {
        x: 100000, y: 100000, width: 50000, height: 30000,
      });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      expect(() => be.enable()).not.toThrow();
    });

    it("scale is clamped to positive values for single tiny node", () => {
      const node = createMockNode("n1", { x: 0, y: 0, width: 1, height: 1 });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();
      expect((be as any).scale).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------------------
  // 8. Cleanup on disable
  // -----------------------------------------------------------------------
  describe("cleanup", () => {
    it("removes canvas event listeners for birdseye namespace", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      const spy = vi.spyOn(mockSlate.canvas, "off");
      be.disable();

      expect(spy).toHaveBeenCalledWith(".birdseye");
    });

    it("handleMouseUp cleans up bound handlers", () => {
      const be = new BirdsEye(mockSlate);
      be.enable();

      (be as any).boundMouseMove = vi.fn();
      (be as any).boundMouseUp = vi.fn();

      (be as any).handleMouseUp();
      expect((be as any).boundMouseMove).toBeNull();
      expect((be as any).boundMouseUp).toBeNull();
    });

    it("multiple enable/disable cycles work correctly", () => {
      const be = new BirdsEye(mockSlate);

      be.enable();
      expect(be.isEnabled()).toBe(true);
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye")
      ).not.toBeNull();

      be.disable();
      expect(be.isEnabled()).toBe(false);
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye")
      ).toBeNull();

      be.enable();
      expect(be.isEnabled()).toBe(true);
      expect(
        mockSlate.element.querySelector(".slateboxjs-birdseye")
      ).not.toBeNull();

      be.disable();
      expect(be.isEnabled()).toBe(false);
    });

    it("re-enabling creates a fresh container DOM element", () => {
      const be = new BirdsEye(mockSlate);

      be.enable();
      const firstContainer = (be as any).container;
      be.disable();

      be.enable();
      const secondContainer = (be as any).container;

      expect(secondContainer).not.toBe(firstContainer);
      expect(secondContainer).toBeInstanceOf(HTMLDivElement);
      // Both should be in the DOM
      expect(firstContainer.parentNode).toBeNull(); // old one removed
      expect(secondContainer.parentNode).toBe(mockSlate.element);
    });
  });

  // -----------------------------------------------------------------------
  // 9. Zoom controls
  // -----------------------------------------------------------------------
  describe("zoom controls", () => {
    it("creates zoom in/out buttons and percentage display", () => {
      const be = new BirdsEye(mockSlate, { showZoomControls: true });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      const zoomControls = container.querySelector(
        ".slateboxjs-birdseye-zoom-controls"
      ) as HTMLElement;
      expect(zoomControls).not.toBeNull();

      const buttons = zoomControls.querySelectorAll("button");
      expect(buttons.length).toBe(2);
      expect(buttons[0].textContent).toBe("\u2212"); // zoom out
      expect(buttons[1].textContent).toBe("+"); // zoom in

      const display = zoomControls.querySelector("#birdseye-zoom-display");
      expect(display).not.toBeNull();
      expect(display!.textContent).toBe("100%");
    });

    it("zoom out button calls panZoom.zoomOut()", () => {
      const be = new BirdsEye(mockSlate, { showZoomControls: true });
      be.enable();

      const buttons = mockSlate.element.querySelectorAll(
        ".slateboxjs-birdseye-zoom-controls button"
      );
      const zoomOutBtn = buttons[0] as HTMLElement;
      zoomOutBtn.click();
      expect(mockSlate.panZoom.zoomOut).toHaveBeenCalled();
    });

    it("zoom in button calls panZoom.zoomIn()", () => {
      const be = new BirdsEye(mockSlate, { showZoomControls: true });
      be.enable();

      const buttons = mockSlate.element.querySelectorAll(
        ".slateboxjs-birdseye-zoom-controls button"
      );
      const zoomInBtn = buttons[1] as HTMLElement;
      zoomInBtn.click();
      expect(mockSlate.panZoom.zoomIn).toHaveBeenCalled();
    });

    it("percentage display click calls panZoom.reset()", () => {
      const be = new BirdsEye(mockSlate, { showZoomControls: true });
      be.enable();

      const display = mockSlate.element.querySelector(
        "#birdseye-zoom-display"
      ) as HTMLElement;
      display.click();
      expect(mockSlate.panZoom.reset).toHaveBeenCalled();
    });

    it("updates zoom display via interval", () => {
      mockSlate.panZoom.getZoom.mockReturnValue(2);
      const be = new BirdsEye(mockSlate, { showZoomControls: true });
      be.enable();

      vi.advanceTimersByTime(200);

      const display = mockSlate.element.querySelector(
        "#birdseye-zoom-display"
      ) as HTMLElement;
      expect(display!.textContent).toBe("200%");
    });
  });

  // -----------------------------------------------------------------------
  // 10. Custom styling options
  // -----------------------------------------------------------------------
  describe("custom styling", () => {
    it("applies custom width and height", () => {
      const be = new BirdsEye(mockSlate, { width: 350, height: 250 });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container!.style.width).toBe("350px");
      expect(container!.style.height).toBe("250px");
    });

    it("applies custom background color", () => {
      const be = new BirdsEye(mockSlate, { backgroundColor: "#ff0000" });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      // jsdom converts hex to rgb(...) format
      expect(container!.style.backgroundColor).toBe("rgb(255, 0, 0)");
    });

    it("applies custom border radius", () => {
      const be = new BirdsEye(mockSlate, { borderRadius: 8 });
      be.enable();

      const container = mockSlate.element.querySelector(
        ".slateboxjs-birdseye"
      ) as HTMLElement;
      expect(container!.style.borderRadius).toBe("8px");
    });

    it("uses custom viewport colors when configured", () => {
      const be = new BirdsEye(mockSlate, {
        viewportColor: "rgba(255,0,0,0.5)",
        viewportBorderColor: "#ff0000",
      });
      be.enable();

      const indicator = (be as any).viewportIndicator;
      expect(indicator.fill).toHaveBeenCalledWith("rgba(255,0,0,0.5)");
      expect(indicator.stroke).toHaveBeenCalledWith({
        color: "#ff0000",
        width: 2,
      });
    });
  });

  // -----------------------------------------------------------------------
  // 11. Rotation handling
  // -----------------------------------------------------------------------
  describe("rotation", () => {
    it("renders rotated nodes with a rotate call", () => {
      const node = createMockNode("n1", {
        rotate: { rotationAngle: 45 },
      });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const shape = (be as any).nodeShapes.get("n1");
      expect(shape).toBeDefined();
      expect(shape.rotate).toHaveBeenCalled();
    });

    it("does not rotate nodes when rotationAngle is 0", () => {
      const node = createMockNode("n1", {
        rotate: { rotationAngle: 0 },
      });
      mockSlate = createMockSlate([node]);
      const be = new BirdsEye(mockSlate);
      be.enable();

      const shape = (be as any).nodeShapes.get("n1");
      expect(shape).toBeDefined();
    });
  });
});
