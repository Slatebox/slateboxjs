// ---------------------------------------------------------------------------
// ResizeRotate — comprehensive unit tests
//
// ResizeRotate is an orchestration class that wires SVG selection (selectable
// handles) and resize/rotate (svg.resize.js) onto a node's backgroundRect.
// It also manages event listeners for the resize lifecycle and temporarily
// hides connection handles while the user is manipulating handles.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ResizeRotate } from "../../src/core/ResizeRotate";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a minimal mock SVG element like what svg.js returns. */
function makeMockSvgElement(overrides: Record<string, any> = {}) {
  return {
    // SVG.js plugin API (svg.select.js / svg.resize.js)
    select: vi.fn(),
    resize: vi.fn(),
    // Event system (SVG.js .on() / .off()) — real svg.js uses namespaced events
    on: vi.fn(),
    off: vi.fn(),
    // Used by widenHandleHitAreas
    node: {
      ownerSVGElement: {
        querySelectorAll: vi.fn().mockReturnValue([]),
      },
    },
    // Used by handleResize for rotation math
    transform: vi.fn().mockReturnValue({ rotate: 0 }),
    bbox: vi.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 60, cx: 50, cy: 30 }),
    ...overrides,
  };
}

/** Capture the callback registered via .on(eventName, cb) */
function getHandler(
  onFn: ReturnType<typeof vi.fn>,
  eventName: string,
): (...args: any[]) => void {
  const calls = onFn.mock.calls.filter(([name]) => name === eventName);
  if (calls.length === 0) {
    throw new Error(`No handler registered for event "${eventName}"`);
  }
  return calls[calls.length - 1][1];
}

/** Create a mock node with all properties ResizeRotate touches. */
function createMockNode(overrides: Record<string, any> = {}) {
  const backgroundRect = makeMockSvgElement();
  return {
    id: "test-node-1",
    backgroundRect,
    options: {
      width: 200,
      height: 120,
      x: 50,
      y: 40,
      rotate: { rotationAngle: 0 },
    },
    setSize: vi.fn(),
    centerText: vi.fn(),
    isConnectionHandlesEnabled: vi.fn().mockReturnValue(false),
    disableConnectionHandles: vi.fn(),
    enableConnectionHandles: vi.fn(),
    slate: {
      getSelectedNodes: vi.fn().mockReturnValue([]),
      notifyNodeChanged: vi.fn(),
    },
    svgGroup: {
      transform: vi.fn().mockReturnValue({ rotate: 0 }),
    },
    textElement: {
      rotate: vi.fn(),
    },
    nestedSvg: undefined,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("ResizeRotate", () => {
  let node: ReturnType<typeof createMockNode>;

  beforeEach(() => {
    vi.useFakeTimers();
    // requestAnimationFrame is already mocked in setup.ts to call setTimeout(cb, 16)
    node = createMockNode();
  });

  // -----------------------------------------------------------------------
  // 1. Construction
  // -----------------------------------------------------------------------
  describe("construction", () => {
    it("stores node and target (backgroundRect)", () => {
      const rr = new ResizeRotate(node);
      expect((rr as any).node).toBe(node);
      expect((rr as any).target).toBe(node.backgroundRect);
      expect(rr.isEnabled()).toBe(false);
    });

    it("applies default options when none are provided", () => {
      const rr = new ResizeRotate(node);
      const opts = (rr as any).options;
      expect(opts.resizeEnabled).toBe(true);
      expect(opts.rotateEnabled).toBe(true);
      expect(opts.preserveAspectRatio).toBe(false);
      expect(opts.aroundCenter).toBe(false);
      expect(opts.grid).toBe(0);
      expect(opts.degree).toBe(0);
    });

    it("merges custom options with defaults (custom wins)", () => {
      const rr = new ResizeRotate(node, {
        resizeEnabled: false,
        preserveAspectRatio: true,
        degree: 15,
      });
      const opts = (rr as any).options;
      expect(opts.resizeEnabled).toBe(false);     // custom
      expect(opts.rotateEnabled).toBe(true);       // default
      expect(opts.preserveAspectRatio).toBe(true); // custom
      expect(opts.degree).toBe(15);                // custom
      expect(opts.grid).toBe(0);                   // default
    });

    it("tolerates missing backgroundRect (target null)", () => {
      const badNode = { id: "orphan", backgroundRect: null, options: {} };
      const rr = new ResizeRotate(badNode);
      expect((rr as any).target).toBeNull();
      // Should not throw
      expect(() => rr.enable()).not.toThrow();
    });

    it("accepts onResize / onRotate callbacks in options", () => {
      const onResize = vi.fn();
      const onRotate = vi.fn();
      const rr = new ResizeRotate(node, { onResize, onRotate });
      expect((rr as any).options.onResize).toBe(onResize);
      expect((rr as any).options.onRotate).toBe(onRotate);
    });
  });

  // -----------------------------------------------------------------------
  // 2. enable / disable lifecycle
  // -----------------------------------------------------------------------
  describe("enable / disable lifecycle", () => {
    it("enable() calls element.select() with rotationPoint and element.resize()", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      expect(node.backgroundRect.select).toHaveBeenCalledTimes(1);
      expect(node.backgroundRect.select).toHaveBeenCalledWith({
        rotationPoint: true,
      });

      expect(node.backgroundRect.resize).toHaveBeenCalledTimes(1);
      expect(node.backgroundRect.resize).toHaveBeenCalledWith({
        preserveAspectRatio: false,
        aroundCenter: false,
        // Default options are 0/0; the nullish coalescing (?? 1) only applies
        // when the value is undefined/null, not when it's 0.
        grid: 0,
        degree: 0,
      });

      expect(rr.isEnabled()).toBe(true);
    });

    it("enable() skips resize when resizeEnabled=false", () => {
      const rr = new ResizeRotate(node, { resizeEnabled: false });
      rr.enable();

      expect(node.backgroundRect.select).toHaveBeenCalled();
      expect(node.backgroundRect.resize).not.toHaveBeenCalled();
    });

    it("enable() passes rotationPoint=false when rotateEnabled=false", () => {
      const rr = new ResizeRotate(node, { rotateEnabled: false });
      rr.enable();

      expect(node.backgroundRect.select).toHaveBeenCalledWith({
        rotationPoint: false,
      });
    });

    it("enable() does not call select/resize when the target lacks those methods", () => {
      const basicTarget = {
        on: vi.fn(),
        off: vi.fn(),
        node: { ownerSVGElement: { querySelectorAll: vi.fn().mockReturnValue([]) } },
        transform: vi.fn(),
        bbox: vi.fn(),
      };
      const basicNode = createMockNode({ backgroundRect: basicTarget });
      const rr = new ResizeRotate(basicNode);
      rr.enable();

      expect(basicTarget.select).toBeUndefined();
      expect(basicTarget.resize).toBeUndefined();
      // Should not throw
      expect(rr.isEnabled()).toBe(true);
    });

    it("enable() is idempotent — calling twice does nothing the second time", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      expect(node.backgroundRect.select).toHaveBeenCalledTimes(1);

      rr.enable(); // second call — early return
      expect(node.backgroundRect.select).toHaveBeenCalledTimes(1);
      expect(node.backgroundRect.resize).toHaveBeenCalledTimes(1);
    });

    it("enable() warns and returns when target (backgroundRect) is null", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const badNode = {
        id: "orphan",
        backgroundRect: null,
        options: {},
        setSize: vi.fn(),
        centerText: vi.fn(),
      };
      const rr = new ResizeRotate(badNode);
      rr.enable();

      expect(warnSpy).toHaveBeenCalledWith(
        "RESIZE_ROTATE_DEBUG: Cannot enable — target (backgroundRect) not available on",
        "orphan",
      );
      expect(rr.isEnabled()).toBe(false);
      warnSpy.mockRestore();
    });

    it("enable() registers event listeners on the target", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      // Should have registered resize + mousedown/touchstart handlers
      expect(node.backgroundRect.on).toHaveBeenCalledWith(
        "mousedown.resizerotate touchstart.resizerotate",
        expect.any(Function),
      );
      expect(node.backgroundRect.on).toHaveBeenCalledWith(
        "resize",
        expect.any(Function),
      );
    });

    it("disable() calls element.select(false) and element.resize(false)", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      expect(rr.isEnabled()).toBe(true);

      rr.disable();

      expect(node.backgroundRect.select).toHaveBeenLastCalledWith(false);
      expect(node.backgroundRect.resize).toHaveBeenLastCalledWith(false);
      expect(rr.isEnabled()).toBe(false);
    });

    it("disable() removes event listeners", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      rr.disable();

      expect(node.backgroundRect.off).toHaveBeenCalledWith("resize");
      expect(node.backgroundRect.off).toHaveBeenCalledWith(
        "mousedown.resizerotate touchstart.resizerotate",
      );
    });

    it("disable() is idempotent — calling when not active is a no-op", () => {
      const rr = new ResizeRotate(node);
      // Not enabled
      rr.disable();
      expect(node.backgroundRect.off).not.toHaveBeenCalled();
    });

    it("enable -> disable -> enable restarts cleanly", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      rr.disable();
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith(false);

      // Re-enable
      rr.enable();
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith({
        rotationPoint: true,
      });
      expect(rr.isEnabled()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // 3. isEnabled
  // -----------------------------------------------------------------------
  describe("isEnabled", () => {
    it("returns false before enable()", () => {
      const rr = new ResizeRotate(node);
      expect(rr.isEnabled()).toBe(false);
    });

    it("returns true after enable()", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      expect(rr.isEnabled()).toBe(true);
    });

    it("returns false after disable()", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      rr.disable();
      expect(rr.isEnabled()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // 4. Event callbacks
  // -----------------------------------------------------------------------
  describe("event callback propagation", () => {
    it("calls onResize when resize event fires", () => {
      const onResize = vi.fn();
      const rr = new ResizeRotate(node, { onResize });
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      const event = { detail: { box: { width: 300, height: 150, x: 40, y: 30 } } };
      resizeHandler(event);

      expect(onResize).toHaveBeenCalledWith(event);
    });

    it("does not crash when onResize is not provided", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      const event = { detail: { box: { width: 300, height: 150 } } };

      expect(() => resizeHandler(event)).not.toThrow();
    });

    it("resize event updates node options and calls setSize/centerText", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      const event = { detail: { box: { width: 300, height: 150, x: 40, y: 30 } } };
      resizeHandler(event);

      expect(node.options.width).toBe(300);
      expect(node.options.height).toBe(150);
      // options.x/y are WORLD coords: pre-interaction position (50,40) + the
      // plugin's local box (40,30) → (90,70). (Storing the raw local box would
      // double-count against the group translate on reload.)
      expect(node.options.x).toBe(90);
      expect(node.options.y).toBe(70);

      expect(node.setSize).toHaveBeenCalledWith(300, 150);
      expect(node.centerText).toHaveBeenCalled();
    });

    it("resize event notifies slate via notifyNodeChanged", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({ detail: { box: { width: 200, height: 100, x: 0, y: 0 } } });

      expect(node.slate.notifyNodeChanged).toHaveBeenCalledWith(node);
    });

    it("resize event re-enables connection handles if node is still selected", () => {
      // Make isConnectionHandlesEnabled return true for the mousedown test below
      // For the resize handler, we need getSelectedNodes to include this node
      node.slate.getSelectedNodes.mockReturnValue([node]);

      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({ detail: { box: { width: 200, height: 100, x: 0, y: 0 } } });

      // The re-enable is wrapped in setTimeout(50)
      expect(node.enableConnectionHandles).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(node.enableConnectionHandles).toHaveBeenCalled();
    });

    it("resize event does NOT re-enable connection handles if node is no longer selected", () => {
      node.slate.getSelectedNodes.mockReturnValue([]);

      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({ detail: { box: { width: 200, height: 100, x: 0, y: 0 } } });

      vi.advanceTimersByTime(50);
      expect(node.enableConnectionHandles).not.toHaveBeenCalled();
    });

    it("mousedown on a resize handle hides connection handles when they are enabled", () => {
      node.isConnectionHandlesEnabled.mockReturnValue(true);

      const rr = new ResizeRotate(node);
      rr.enable();

      const mousedownHandler = getHandler(
        node.backgroundRect.on,
        "mousedown.resizerotate touchstart.resizerotate",
      );

      // Simulate clicking a resize handle (has .svg_select_handle class)
      const handleTarget = {
        classList: { contains: vi.fn((cls) => cls === "svg_select_handle") },
      };
      mousedownHandler({ target: handleTarget });

      expect(node.disableConnectionHandles).toHaveBeenCalled();
    });

    it("mousedown on non-handle does not hide connection handles", () => {
      node.isConnectionHandlesEnabled.mockReturnValue(true);

      const rr = new ResizeRotate(node);
      rr.enable();

      const mousedownHandler = getHandler(
        node.backgroundRect.on,
        "mousedown.resizerotate touchstart.resizerotate",
      );

      // Click on the node background itself (not a handle)
      const nonHandleTarget = {
        classList: { contains: vi.fn().mockReturnValue(false) },
      };
      mousedownHandler({ target: nonHandleTarget });

      expect(node.disableConnectionHandles).not.toHaveBeenCalled();
    });

    it("mousedown on handle does nothing when connection handles are already hidden", () => {
      node.isConnectionHandlesEnabled.mockReturnValue(false);

      const rr = new ResizeRotate(node);
      rr.enable();

      const mousedownHandler = getHandler(
        node.backgroundRect.on,
        "mousedown.resizerotate touchstart.resizerotate",
      );

      const handleTarget = {
        classList: { contains: vi.fn((cls) => cls === "svg_select_handle") },
      };
      mousedownHandler({ target: handleTarget });

      expect(node.disableConnectionHandles).not.toHaveBeenCalled();
    });

    it("isResizeRotateHandle detects all handle class names", () => {
      const rr = new ResizeRotate(node);
      const handleClasses = [
        "svg_select_handle",
        "svg_select_handle_rot",
        "svg_select_handle_lt",
        "svg_select_handle_rt",
        "svg_select_handle_rb",
        "svg_select_handle_lb",
        "svg_select_handle_t",
        "svg_select_handle_r",
        "svg_select_handle_b",
        "svg_select_handle_l",
      ];

      for (const cls of handleClasses) {
        const target = { classList: { contains: vi.fn((c: string) => c === cls) } };
        expect((rr as any).isResizeRotateHandle(target)).toBe(true);
      }
    });

    it("isResizeRotateHandle returns false for non-handle targets", () => {
      const rr = new ResizeRotate(node);
      const target = { classList: { contains: vi.fn().mockReturnValue(false) } };
      expect((rr as any).isResizeRotateHandle(target)).toBe(false);
    });

    it("isResizeRotateHandle returns false for null/undefined targets", () => {
      const rr = new ResizeRotate(node);
      expect((rr as any).isResizeRotateHandle(null)).toBe(false);
      expect((rr as any).isResizeRotateHandle(undefined)).toBe(false);
    });

    it("isResizeRotateHandle returns false for targets without classList", () => {
      const rr = new ResizeRotate(node);
      expect((rr as any).isResizeRotateHandle({})).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // 5. Rotation handling in resize events
  // -----------------------------------------------------------------------
  describe("rotation handling", () => {
    it("reads backgroundRect rotation and updates node.options.rotate when angle present", () => {
      node.backgroundRect.transform.mockReturnValue({ rotate: 25 });
      node.svgGroup.transform.mockReturnValue({ rotate: 10 });

      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({
        detail: {
          box: { width: 200, height: 100, x: 0, y: 0 },
          angle: 15,
        },
      });

      // totalRotation = 10 (svgGroup) + 25 (backgroundRect) = 35
      expect(node.options.rotate.rotationAngle).toBe(35);
      // Text element should be rotated with deltaAngle around center
      expect(node.textElement.rotate).toHaveBeenCalledWith(15, 50, 30);
    });

    it("rotates nestedSvg instead of textElement when textElement is absent", () => {
      const nestedSvgMock = { rotate: vi.fn() };
      const nodeWithNestedSvg = createMockNode({
        textElement: undefined,
        nestedSvg: nestedSvgMock,
      });
      nodeWithNestedSvg.backgroundRect.transform.mockReturnValue({ rotate: 15 });
      nodeWithNestedSvg.svgGroup.transform.mockReturnValue({ rotate: 0 });

      const rr = new ResizeRotate(nodeWithNestedSvg);
      rr.enable();

      const resizeHandler = getHandler(nodeWithNestedSvg.backgroundRect.on, "resize");
      resizeHandler({
        detail: {
          box: { width: 200, height: 100, x: 0, y: 0 },
          angle: 15,
        },
      });

      expect(nestedSvgMock.rotate).toHaveBeenCalledWith(15, 50, 30);
    });

    it("skips rotation when event.detail has no angle", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({
        detail: {
          box: { width: 200, height: 100, x: 0, y: 0 },
          // no angle
        },
      });

      expect(node.textElement.rotate).not.toHaveBeenCalled();
      // rotationAngle should remain unchanged
      expect(node.options.rotate.rotationAngle).toBe(0);
    });

    it("creates rotate option object if it does not exist", () => {
      delete node.options.rotate;

      node.backgroundRect.transform.mockReturnValue({ rotate: 15 });
      node.svgGroup.transform.mockReturnValue({ rotate: 0 });

      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({
        detail: {
          box: { width: 200, height: 100, x: 0, y: 0 },
          angle: 15,
        },
      });

      expect(node.options.rotate).toBeDefined();
      expect(node.options.rotate.rotationAngle).toBe(15);
    });
  });

  // -----------------------------------------------------------------------
  // 6. updateOptions
  // -----------------------------------------------------------------------
  describe("updateOptions", () => {
    it("merges provided options into existing options", () => {
      const rr = new ResizeRotate(node, { resizeEnabled: true });
      rr.updateOptions({ resizeEnabled: false, grid: 5 });
      const opts = (rr as any).options;
      expect(opts.resizeEnabled).toBe(false);
      expect(opts.grid).toBe(5);
      // Should preserve other defaults
      expect(opts.rotateEnabled).toBe(true);
    });

    it("disables and re-enables when currently active", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      expect(node.backgroundRect.select).toHaveBeenCalledTimes(1);

      rr.updateOptions({ grid: 10 });

      // Should have disabled (select(false)) and re-enabled (select({rotationPoint:true}))
      expect(node.backgroundRect.select).toHaveBeenCalledWith(false);
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith({
        rotationPoint: true,
      });
    });

    it("does not disable/enable when not active", () => {
      const rr = new ResizeRotate(node);
      rr.updateOptions({ grid: 10 });

      expect(node.backgroundRect.select).not.toHaveBeenCalled();
      expect(node.backgroundRect.resize).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 7. refresh
  // -----------------------------------------------------------------------
  describe("refresh", () => {
    it("disables and re-enables when active", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      expect(node.backgroundRect.select).toHaveBeenCalledTimes(1);

      rr.refresh();

      expect(node.backgroundRect.select).toHaveBeenCalledWith(false);
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith({
        rotationPoint: true,
      });
      expect(rr.isEnabled()).toBe(true);
    });

    it("does nothing when not active", () => {
      const rr = new ResizeRotate(node);
      rr.refresh();

      expect(node.backgroundRect.select).not.toHaveBeenCalled();
      expect(node.backgroundRect.resize).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // 8. selection UI styling / handle hit-area widening
  // -----------------------------------------------------------------------
  describe("styleSelectionUi", () => {
    it("makes svg.select.js selection overlays transparent after a rAF", () => {
      const selectionEls = [
        { setAttribute: vi.fn(), style: {} },
        { setAttribute: vi.fn(), style: {} },
      ] as any;

      const ownerSVG = {
        querySelectorAll: vi.fn((selector: string) =>
          selector === ".svg_select_shape, .svg_select_shape_pointSelect"
            ? selectionEls
            : []
        ),
      };
      const nodeWithDom = createMockNode({
        backgroundRect: makeMockSvgElement({
          node: { ownerSVGElement: ownerSVG },
        }),
      });

      const rr = new ResizeRotate(nodeWithDom);
      rr.enable();

      vi.advanceTimersByTime(16);

      expect(ownerSVG.querySelectorAll).toHaveBeenCalledWith(
        ".svg_select_shape, .svg_select_shape_pointSelect"
      );
      for (const el of selectionEls) {
        expect(el.setAttribute).toHaveBeenCalledWith("fill", "none");
        expect(el.setAttribute).toHaveBeenCalledWith("fill-opacity", "0");
        expect(el.setAttribute).toHaveBeenCalledWith("pointer-events", "none");
        expect(el.style.fill).toBe("none");
        expect(el.style.fillOpacity).toBe("0");
        expect(el.style.pointerEvents).toBe("none");
      }
    });

    it("widens .svg_select_handle elements after a rAF", () => {
      // Simulate a DOM with handles
      const handleEls = [
        { setAttribute: vi.fn(), style: {} },
        { setAttribute: vi.fn(), style: {} },
      ] as any;

      const ownerSVG = {
        querySelectorAll: vi.fn((selector: string) =>
          selector === ".svg_select_handle" ? handleEls : []
        ),
      };
      const nodeWithDom = createMockNode({
        backgroundRect: makeMockSvgElement({
          node: { ownerSVGElement: ownerSVG },
        }),
      });

      const rr = new ResizeRotate(nodeWithDom);
      rr.enable();

      // The rAF callback was scheduled; advance timers to fire it
      vi.advanceTimersByTime(16);

      expect(ownerSVG.querySelectorAll).toHaveBeenCalledWith(".svg_select_handle");
      for (const el of handleEls) {
        expect(el.setAttribute).toHaveBeenCalledWith("stroke-width", "6");
        expect(el.setAttribute).toHaveBeenCalledWith("stroke", "#4A90E2");
        expect(el.style.pointerEvents).toBe("all");
      }
    });

    it("tolerates missing ownerSVGElement gracefully", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const target = makeMockSvgElement({
        node: { ownerSVGElement: null },
      });
      const basicNode = createMockNode({ backgroundRect: target });

      const rr = new ResizeRotate(basicNode);
      rr.enable();

      vi.advanceTimersByTime(16);
      // Should not throw
      expect(rr.isEnabled()).toBe(true);
      warnSpy.mockRestore();
    });

    it("tolerates querySelectorAll failure gracefully", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const target = makeMockSvgElement({
        node: {
          ownerSVGElement: {
            querySelectorAll: vi.fn(() => {
              throw new Error("DOM unavailable");
            }),
          },
        },
      });
      const basicNode = createMockNode({ backgroundRect: target });

      const rr = new ResizeRotate(basicNode);
      rr.enable();

      vi.advanceTimersByTime(16);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to widen handle"),
        expect.any(Error),
      );
      warnSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // 9. Cleanup / edge cases
  // -----------------------------------------------------------------------
  describe("cleanup and edge cases", () => {
    it("events are fully cleaned up after disable()", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      rr.disable();

      // After disable, no new events should be handled
      expect(node.backgroundRect.off).toHaveBeenCalledWith("resize");
      expect(node.backgroundRect.off).toHaveBeenCalledWith(
        "mousedown.resizerotate touchstart.resizerotate",
      );
    });

    it("no handle leak when enable is called after disable", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      rr.disable();
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith(false);

      rr.enable();
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith({
        rotationPoint: true,
      });

      // Event listeners should be re-registered (on called again)
      const onCallsForResize = node.backgroundRect.on.mock.calls.filter(
        ([name]) => name === "resize",
      );
      expect(onCallsForResize.length).toBe(2);
    });

    it("multiple enable/disable cycles do not accumulate listeners", () => {
      const rr = new ResizeRotate(node);

      for (let i = 0; i < 3; i++) {
        rr.enable();
        rr.disable();
      }

      // off should have been called 3 times for each event type
      const offCallsForResize = node.backgroundRect.off.mock.calls.filter(
        ([name]) => name === "resize",
      );
      expect(offCallsForResize.length).toBe(3);

      const offCallsForMouse = node.backgroundRect.off.mock.calls.filter(
        ([name]) => name === "mousedown.resizerotate touchstart.resizerotate",
      );
      expect(offCallsForMouse.length).toBe(3);
    });

    it("handleResize does not crash when event.detail is missing", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      // Simulate resize event with empty detail
      expect(() => resizeHandler({})).not.toThrow();
      expect(() => resizeHandler({ detail: {} })).not.toThrow();
    });

    it("handleResize does not crash when event.detail.box is missing", () => {
      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      expect(() => resizeHandler({ detail: { angle: 5 } })).not.toThrow();
      expect(node.setSize).not.toHaveBeenCalled();
    });

    it("enable() catches errors from select/resize and warns", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const throwingTarget = makeMockSvgElement({
        select: vi.fn(() => {
          throw new Error("select failed");
        }),
      });
      const badNode = createMockNode({ backgroundRect: throwingTarget });

      const rr = new ResizeRotate(badNode);
      rr.enable();

      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to enable resize/rotate:",
        expect.any(Error),
      );
      expect(rr.isEnabled()).toBe(false); // isActive only set after success
      warnSpy.mockRestore();
    });

    it("disable() catches errors from select/resize and warns", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      // select works for enable (arg is object), fails for disable (arg is false)
      const throwingTarget = makeMockSvgElement({
        select: vi.fn((arg: any) => {
          if (arg === false) {
            throw new Error("select(false) failed");
          }
        }),
      });
      const badNode = createMockNode({ backgroundRect: throwingTarget });

      const rr = new ResizeRotate(badNode);
      rr.enable();

      rr.disable();

      expect(warnSpy).toHaveBeenCalledWith(
        "Failed to disable resize/rotate:",
        expect.any(Error),
      );
      // isActive stays true because the error was thrown before
      // this.isActive = false (which is inside the try block)
      expect(rr.isEnabled()).toBe(true);
      warnSpy.mockRestore();
    });

    it("resize event with rotation reads transform from backgroundRect and svgGroup", () => {
      node.backgroundRect.transform.mockReturnValue({ rotate: 45, x: 0, y: 0 });
      node.svgGroup.transform.mockReturnValue({ rotate: 10 });

      const rr = new ResizeRotate(node);
      rr.enable();

      const resizeHandler = getHandler(node.backgroundRect.on, "resize");
      resizeHandler({
        detail: {
          box: { width: 150, height: 80, x: 10, y: 10 },
          angle: 35,
        },
      });

      expect(node.backgroundRect.transform).toHaveBeenCalled();
      expect(node.svgGroup.transform).toHaveBeenCalled();
      expect(node.options.rotate.rotationAngle).toBe(55); // 10 + 45
    });

    it("does not re-enable connection handles if resize was not on a handle (isConnectionHandlesEnabled false)", () => {
      // Setup: connection handles are disabled, mousedown fires on non-handle
      node.isConnectionHandlesEnabled.mockReturnValue(false);

      const rr = new ResizeRotate(node);
      rr.enable();

      const mouseHandler = getHandler(
        node.backgroundRect.on,
        "mousedown.resizerotate touchstart.resizerotate",
      );

      const nonHandleTarget = {
        classList: { contains: vi.fn().mockReturnValue(false) },
      };
      mouseHandler({ target: nonHandleTarget });

      expect(node.disableConnectionHandles).not.toHaveBeenCalled();
    });
  });
});
