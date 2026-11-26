// ---------------------------------------------------------------------------
// ResizeRotate — comprehensive unit tests
//
// ResizeRotate is an orchestration class that wires SVG selection (selectable
// handles) and resize/rotate (svg.resize.js) onto a node's backgroundRect.
// It also manages event listeners for the resize lifecycle and temporarily
// hides connection handles while the user is manipulating handles.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ResizeRotate,
  computeSelectHandlePlot,
} from "../../src/core/ResizeRotate";

describe("computeSelectHandlePlot (NaN-safe select handle)", () => {
  it("returns a finite 3-point L-bracket for normal input", () => {
    const plot = computeSelectHandlePlot([10, 10], [0, 10], [10, 0]);
    expect(plot).not.toBeNull();
    expect(plot).toHaveLength(3);
    // middle point is the handle point itself
    expect(plot![1]).toEqual([10, 10]);
    plot!.forEach((pt) => {
      expect(Number.isFinite(pt[0])).toBe(true);
      expect(Number.isFinite(pt[1])).toBe(true);
    });
  });

  it("does NOT produce NaN when adjacent points coincide (divide-by-zero guard)", () => {
    // prev === next === point → distances are 0; the default svg.select.js
    // updateHandle would divide by 0 and plot NaN. Ours must stay finite.
    const plot = computeSelectHandlePlot([5, 5], [5, 5], [5, 5]);
    expect(plot).not.toBeNull();
    plot!.forEach((pt) => {
      expect(Number.isFinite(pt[0])).toBe(true);
      expect(Number.isFinite(pt[1])).toBe(true);
    });
  });

  it("returns null when the handle point is non-finite (skip the plot)", () => {
    expect(computeSelectHandlePlot([NaN, NaN], [0, 0], [1, 1])).toBeNull();
    expect(computeSelectHandlePlot([0, 0], [NaN, 0], [1, 1])).toBeNull();
  });
});

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
    remember: vi.fn(),
    move: vi.fn(),
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
    setSize: vi.fn(function(this:any,width:number,height:number){Object.assign(this.options,{width,height});}),
    finalizeInteraction: vi.fn(),
    applyInteractionRotation: vi.fn(function(this:any,angle:number){this.options.rotate = {rotationAngle:angle};}),
    centerText: vi.fn(),
    isConnectionHandlesEnabled: vi.fn().mockReturnValue(false),
    disableConnectionHandles: vi.fn(),
    enableConnectionHandles: vi.fn(),
    slate: {
      getSelectedNodes: vi.fn().mockReturnValue([]),
      notifyNodeChanged: vi.fn(),
      broadcast: vi.fn(),
    },
    svgGroup: {
      fire: vi.fn(),
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
      expect(node.backgroundRect.select).toHaveBeenCalledWith(
        expect.objectContaining({ rotationPoint: true })
      );

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

      expect(node.backgroundRect.select).toHaveBeenCalledWith(
        expect.objectContaining({ rotationPoint: false })
      );
    });

    it("enable() does not call select/resize when the target lacks those methods", () => {
      const basicTarget = {
        on: vi.fn(),
        off: vi.fn(),
    remember: vi.fn(),
    move: vi.fn(),
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

      expect(node.backgroundRect.on).toHaveBeenCalledWith('beforeresize.resizerotate',expect.any(Function));
      expect(node.backgroundRect.on).toHaveBeenCalledWith('resize.resizerotate',expect.any(Function));
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

      expect(node.backgroundRect.off).toHaveBeenCalledWith('.resizerotate');
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
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith(
        expect.objectContaining({ rotationPoint: true })
      );
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
    it("preserves proportions only when Shift starts a resize", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      const beforeResize = getHandler(
        node.backgroundRect.on,
        "beforeresize.resizerotate",
      );
      const handler = { preserveAspectRatio: false };

      beforeResize({
        detail: {
          handler,
          event: { detail: { event: { shiftKey: true } } },
        },
      });
      expect(handler.preserveAspectRatio).toBe(true);

      beforeResize({
        detail: {
          handler,
          event: { detail: { event: { shiftKey: false } } },
        },
      });
      expect(handler.preserveAspectRatio).toBe(false);
    });

    it("keeps an explicitly constrained shape proportional without Shift", () => {
      const rr = new ResizeRotate(node, { preserveAspectRatio: true });
      rr.enable();
      const beforeResize = getHandler(
        node.backgroundRect.on,
        "beforeresize.resizerotate",
      );
      const handler = { preserveAspectRatio: false };

      beforeResize({
        detail: {
          handler,
          event: { detail: { event: { shiftKey: false } } },
        },
      });
      expect(handler.preserveAspectRatio).toBe(true);
    });

    function begin() {
      const before = getHandler(
        node.backgroundRect.on,
        "beforeresize.resizerotate",
      );
      before({
        detail: {
          handler: {},
          event: { detail: { event: { shiftKey: false } } },
        },
      });
    }
    function frame(eventType: string, angle = 0) {
      const e = {
        detail: {
          eventType,
          angle,
          box: { x: -8, y: 4, width: 218, height: 130 },
        },
        preventDefault: vi.fn(),
      };
      getHandler(node.backgroundRect.on, "resize.resizerotate")(e);
      return e;
    }
    it("applies plugin resize geometry and notifies callbacks once per frame", () => {
      const onResize = vi.fn();
      const rr = new ResizeRotate(node, { onResize });
      rr.enable();
      begin();
      const event = frame("lt");
      expect(event.preventDefault).toHaveBeenCalledOnce();
      expect(node.setSize).toHaveBeenCalledWith(218, 130);
      expect(node.backgroundRect.move).toHaveBeenCalledWith(-8, 4);
      expect(node.options.x).toBe(42);
      expect(node.options.y).toBe(44);
      expect(onResize).toHaveBeenCalledWith(event);
      expect(node.slate.notifyNodeChanged).toHaveBeenCalledWith(node);
    });
    it.each([true, false])(
      "restores handles only to selected nodes after the plugin final mouseup frame (selected=%s)",
      (selected) => {
        const rr = new ResizeRotate(node);
        rr.enable();
        begin();
        frame("rb");
        expect(node.disableConnectionHandles).toHaveBeenCalled();
        expect(node.enableConnectionHandles).not.toHaveBeenCalled();
        node.slate.getSelectedNodes.mockReturnValue(selected ? [node] : []);
        window.dispatchEvent(new MouseEvent("mouseup"));
        frame("rb");
        vi.runAllTimers();
        expect(node.finalizeInteraction).toHaveBeenCalledOnce();
        expect(node.slate.broadcast).toHaveBeenCalledOnce();
        expect(node.enableConnectionHandles).toHaveBeenCalledTimes(
          selected ? 1 : 0,
        );
      },
    );
    it("uses one parent rotation for all content and preserves text fit during the gesture", () => {
      const onRotate = vi.fn();
      const rr = new ResizeRotate(node, { onRotate });
      rr.enable();
      begin();
      frame("rot", 15);
      frame("rot", 25);
      expect(node.options.rotate.rotationAngle).toBe(40);
      expect(onRotate).toHaveBeenCalledTimes(2);
      expect(node.textElement.rotate).not.toHaveBeenCalled();
      expect(node.setSize).not.toHaveBeenCalled();
      expect(node.centerText).not.toHaveBeenCalled();
    });
    it("ignores non-gesture notifications and malformed geometry", () => {
      const rr = new ResizeRotate(node);
      rr.enable();
      frame("rb");
      begin();
      const resize = getHandler(node.backgroundRect.on, "resize.resizerotate");
      resize({});
      resize({ detail: {} });
      expect(node.setSize).not.toHaveBeenCalled();
    });
  });

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
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith(
        expect.objectContaining({ rotationPoint: true })
      );
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
      expect(node.backgroundRect.select).toHaveBeenLastCalledWith(
        expect.objectContaining({ rotationPoint: true })
      );
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
    it("makes svg.select.js selection overlays transparent and outlines the selection shape", () => {
      const classListOf = (cls: string) => ({ contains: (c: string) => c === cls });
      const selectionEls = [
        { setAttribute: vi.fn(), style: {}, classList: classListOf("svg_select_shape") },
        { setAttribute: vi.fn(), style: {}, classList: classListOf("svg_select_shape_pointSelect") },
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
      // Only the selection polygon gets the painted dashed outline.
      expect(selectionEls[0].setAttribute).toHaveBeenCalledWith("stroke", "#4A90E2");
      expect(selectionEls[1].setAttribute).not.toHaveBeenCalledWith("stroke", "#4A90E2");
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
    it("removes only its own SVG listeners and release hooks across repeated enable/disable cycles", () => {
      const remove = vi.spyOn(window, "removeEventListener");
      const rr = new ResizeRotate(node);
      for (let i = 0; i < 3; i++) {
        rr.enable();
        rr.disable();
      }
      expect(node.backgroundRect.off.mock.calls).toEqual(
        Array.from({ length: 3 }, () => [".resizerotate"]),
      );
      expect(
        remove.mock.calls.filter(([event]) => event === "mouseup"),
      ).toHaveLength(3);
      remove.mockRestore();
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

  });
});
