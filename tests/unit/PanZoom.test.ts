// ---------------------------------------------------------------------------
// PanZoom — comprehensive unit tests
//
// PanZoom wraps @svgdotjs/svg.panzoom.js to provide pan/zoom interactions
// with trackpad support.  We mock the SVG canvas and the panzoom plugin
// so these tests are fast and deterministic.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// SVG.js panzoom plugin mock — imported for side-effects (adds .panZoom()
// to the SVG canvas prototype).  Our canvas mock provides its own panZoom().
// ---------------------------------------------------------------------------
vi.mock("@svgdotjs/svg.panzoom.js", () => ({}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeMockCanvas() {
  return {
    // panZoom plugin method — called with config object to init, false to disable
    panZoom: vi.fn(),
    // zoom getter/setter
    zoom: vi.fn(),
    // viewbox getter/setter
    viewbox: vi.fn(),
    // dimensions
    width: vi.fn().mockReturnValue(1200),
    height: vi.fn().mockReturnValue(800),
    // bounding box
    bbox: vi.fn().mockReturnValue({ cx: 0, cy: 0, x: 0, y: 0, width: 1200, height: 800 }),
    // event binding
    on: vi.fn(),
    off: vi.fn(),
    // SVG DOM node — plain object (not a real Element) so clientWidth/Height are writable
    node: { clientWidth: 1200, clientHeight: 800 },
  };
}

function makeMockSlate(canvasOverrides: Record<string, any> = {}) {
  const canvas = { ...makeMockCanvas(), ...canvasOverrides };
  const element = document.createElement("div");
  element.id = "slate-container";
  return {
    canvas,
    element,
    nodes: {
      allNodes: [],
    },
    // Slate-level convenience methods (for reference; PanZoom doesn't call these)
    getZoom: vi.fn(),
    zoom: vi.fn(),
    zoomIn: vi.fn(),
    zoomOut: vi.fn(),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("PanZoom", () => {
  let PanZoom: typeof import("../../src/core/PanZoom").PanZoom;
  let mockSlate: ReturnType<typeof makeMockSlate>;

  beforeEach(async () => {
    // Clear module registry so each test gets fresh imports
    vi.resetModules();
    const mod = await import("../../src/core/PanZoom");
    PanZoom = mod.PanZoom;
    mockSlate = makeMockSlate();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // Construction & initialization
  // -----------------------------------------------------------------------
  describe("construction & initialization", () => {
    it("should create instance with default options", () => {
      const pz = new PanZoom(mockSlate);
      expect(pz).toBeInstanceOf(PanZoom);
      expect(pz.isInitialized()).toBe(true);
    });

    it("should auto-initialize when enabled option is true (default)", () => {
      const pz = new PanZoom(mockSlate);
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledTimes(1);
      expect(pz.isInitialized()).toBe(true);
    });

    it("should NOT auto-initialize when enabled option is false", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      expect(mockSlate.canvas.panZoom).not.toHaveBeenCalled();
      expect(pz.isInitialized()).toBe(false);
    });

    it("should pass correct options to canvas.panZoom() on init", () => {
      new PanZoom(mockSlate, {
        panning: true,
        pinchZoom: true,
        wheelZoom: true,
        panButton: 0,
        oneFingerPan: false,
        margins: false,
        zoomFactor: 0.3,
        zoomMin: 0.1,
        zoomMax: 10,
        wheelZoomDeltaModeLinePixels: 17,
        wheelZoomDeltaModeScreenPixels: 53,
        momentum: true,
        momentumSlowdown: 0.8,
      });

      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(
        expect.objectContaining({
          panning: true,
          pinchZoom: true,
          // wheel is handled by our own Miro-style handler, so the plugin's
          // wheelZoom is always disabled regardless of the option
          wheelZoom: false,
          panButton: 0,
          zoomFactor: 0.3,
          zoomMin: 0.1,
          zoomMax: 10,
          momentum: true,
          momentumSlowdown: 0.8,
        })
      );
    });

    it("should merge custom options with defaults", () => {
      new PanZoom(mockSlate, { zoomMin: 0.5, zoomMax: 5, momentum: false });

      const callArgs = mockSlate.canvas.panZoom.mock.calls[0][0];
      expect(callArgs.zoomMin).toBe(0.5);
      expect(callArgs.zoomMax).toBe(5);
      expect(callArgs.momentum).toBe(false);
      // Defaults preserved
      expect(callArgs.zoomFactor).toBe(0.3);
      expect(callArgs.panning).toBe(true);
    });

    it("should bind event listeners when callbacks are provided", () => {
      const onPan = vi.fn();
      const onZoom = vi.fn();
      const onPanStart = vi.fn();
      const onPanEnd = vi.fn();

      new PanZoom(mockSlate, { onPan, onZoom, onPanStart, onPanEnd });

      expect(mockSlate.canvas.on).toHaveBeenCalledWith("panStart", onPanStart);
      expect(mockSlate.canvas.on).toHaveBeenCalledWith("panning", onPan);
      expect(mockSlate.canvas.on).toHaveBeenCalledWith("panEnd", onPanEnd);
      expect(mockSlate.canvas.on).toHaveBeenCalledWith("zoom", onZoom);
    });

    it("should NOT bind event listeners when callbacks are omitted", () => {
      new PanZoom(mockSlate);
      expect(mockSlate.canvas.on).not.toHaveBeenCalled();
    });

    it("should use the slate's canvas reference", () => {
      const pz = new PanZoom(mockSlate);
      expect((pz as any).canvas).toBe(mockSlate.canvas);
    });

    it("should log success on initialization", () => {
      new PanZoom(mockSlate);
      expect(console.log).toHaveBeenCalledWith(
        "PanZoom initialized successfully with svg.panzoom.js"
      );
    });

    it("should handle panZoom() throwing gracefully", () => {
      mockSlate.canvas.panZoom.mockImplementation(() => {
        throw new Error("plugin error");
      });
      const pz = new PanZoom(mockSlate);
      expect(pz.isInitialized()).toBe(false); // isEnabled stays false
      expect(console.warn).toHaveBeenCalledWith(
        "Failed to initialize pan/zoom:",
        expect.any(Error)
      );
    });
  });

  // -----------------------------------------------------------------------
  // Zoom controls (showControls option)
  // -----------------------------------------------------------------------
  describe("zoom controls", () => {
    it("should create zoom control buttons when showControls is true", () => {
      new PanZoom(mockSlate, { showControls: true });
      const container = mockSlate.element.querySelector(".svg-pan-zoom-controls");
      expect(container).not.toBeNull();
      expect(container!.children.length).toBe(3); // +, −, ⟲
    });

    it("should NOT create zoom controls when showControls is false (default)", () => {
      new PanZoom(mockSlate);
      const container = mockSlate.element.querySelector(".svg-pan-zoom-controls");
      expect(container).toBeNull();
    });

    it("should position controls based on controlsPosition option", () => {
      new PanZoom(mockSlate, { showControls: true, controlsPosition: "bottom-right" });
      const container = mockSlate.element.querySelector(
        ".svg-pan-zoom-controls"
      ) as HTMLElement;
      expect(container).not.toBeNull();
      expect(container.style.bottom).toBe("10px");
      expect(container.style.right).toBe("10px");
    });

    it("should position controls at top-left when specified", () => {
      new PanZoom(mockSlate, {
        showControls: true,
        controlsPosition: "top-left",
      });
      const container = mockSlate.element.querySelector(
        ".svg-pan-zoom-controls"
      ) as HTMLElement;
      expect(container.style.top).toBe("10px");
      expect(container.style.left).toBe("10px");
    });

    it("should remove zoom controls on destroy", () => {
      const pz = new PanZoom(mockSlate, { showControls: true });
      expect(
        mockSlate.element.querySelector(".svg-pan-zoom-controls")
      ).not.toBeNull();

      pz.destroy();
      expect(
        mockSlate.element.querySelector(".svg-pan-zoom-controls")
      ).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // enable / disable lifecycle
  // -----------------------------------------------------------------------
  describe("enable / disable lifecycle", () => {
    it("should start enabled by default", () => {
      const pz = new PanZoom(mockSlate);
      expect(pz.isInitialized()).toBe(true);
    });

    it("should disable and call panZoom(false)", () => {
      const pz = new PanZoom(mockSlate);
      pz.disable();
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(false);
      expect(pz.isInitialized()).toBe(false);
    });

    it("should re-enable after disable", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      expect(pz.isInitialized()).toBe(false);

      pz.enable();
      expect(pz.isInitialized()).toBe(true);
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(
        expect.objectContaining({ panning: true })
      );
    });

    it("should not re-initialize on double enable", () => {
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.panZoom.mockClear();

      pz.enable();
      expect(mockSlate.canvas.panZoom).not.toHaveBeenCalled();
      expect(pz.isInitialized()).toBe(true);
    });

    it("should be no-op to disable when not enabled", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      const callCount = mockSlate.canvas.panZoom.mock.calls.length;

      pz.disable();
      // panZoom(false) should NOT have been called since already disabled
      expect(mockSlate.canvas.panZoom.mock.calls.length).toBe(callCount);
      expect(pz.isInitialized()).toBe(false);
    });

    it("should re-bind event listeners on re-enable", () => {
      const onPan = vi.fn();
      const pz = new PanZoom(mockSlate, { onPan });

      pz.disable();
      mockSlate.canvas.on.mockClear();

      pz.enable();
      expect(mockSlate.canvas.on).toHaveBeenCalledWith("panning", onPan);
    });
  });

  // -----------------------------------------------------------------------
  // Zoom operations
  // -----------------------------------------------------------------------
  describe("zoom operations", () => {
    beforeEach(() => {
      // Default: zoom() returns 1 for "get"
      mockSlate.canvas.zoom.mockReturnValue(1);
      // viewbox() returns current box for "get"
      mockSlate.canvas.viewbox.mockReturnValue({ x: 0, y: 0, width: 1200, height: 800 });
    });

    describe("zoomIn", () => {
      it("should multiply current zoom by 1.25", () => {
        const pz = new PanZoom(mockSlate);
        mockSlate.canvas.zoom.mockReturnValue(2);

        pz.zoomIn();

        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(2.5);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        mockSlate.canvas.zoom.mockClear();

        pz.zoomIn();
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
      });
    });

    describe("zoomOut", () => {
      it("should multiply current zoom by 0.8", () => {
        const pz = new PanZoom(mockSlate);
        mockSlate.canvas.zoom.mockReturnValue(2);

        pz.zoomOut();

        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(1.6);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        pz.zoomOut();
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
      });
    });

    describe("zoom", () => {
      it("should set zoom to given level", () => {
        const pz = new PanZoom(mockSlate);
        pz.zoom(2.5);
        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(2.5);
      });

      it("should set zoom to given level at a point", () => {
        const pz = new PanZoom(mockSlate);
        const point = { x: 100, y: 200 };
        pz.zoom(2.5, point);
        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(2.5, point);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        pz.zoom(3);
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
      });
    });

    describe("zoomBy", () => {
      it("should multiply current zoom by factor", () => {
        const pz = new PanZoom(mockSlate);
        mockSlate.canvas.zoom.mockReturnValue(2);
        pz.zoomBy(1.5);
        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(3);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        pz.zoomBy(2);
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
      });
    });

    describe("zoomAtPoint", () => {
      it("should zoom to level at a specific point", () => {
        const pz = new PanZoom(mockSlate);
        const point = { x: 300, y: 400 };
        pz.zoomAtPoint(1.5, point);
        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(1.5, point);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        pz.zoomAtPoint(2, { x: 0, y: 0 });
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
      });
    });

    describe("getZoom", () => {
      it("should return the current zoom level from canvas", () => {
        const pz = new PanZoom(mockSlate);
        mockSlate.canvas.zoom.mockReturnValue(2.5);
        expect(pz.getZoom()).toBe(2.5);
      });

      it("should return 1 when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        expect(pz.getZoom()).toBe(1);
      });

      it("should return 1 when canvas.zoom() throws", () => {
        const pz = new PanZoom(mockSlate);
        mockSlate.canvas.zoom.mockImplementation(() => {
          throw new Error("fail");
        });
        expect(pz.getZoom()).toBe(1);
      });
    });
  });

  // -----------------------------------------------------------------------
  // Pan operations
  // -----------------------------------------------------------------------
  describe("pan operations", () => {
    beforeEach(() => {
      mockSlate.canvas.viewbox.mockReturnValue({ x: 50, y: 100, width: 1200, height: 800 });
    });

    describe("pan", () => {
      it("should set viewbox x,y preserving width/height", () => {
        const pz = new PanZoom(mockSlate);
        pz.pan({ x: 200, y: 300 });
        expect(mockSlate.canvas.viewbox).toHaveBeenCalledWith(200, 300, 1200, 800);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        mockSlate.canvas.viewbox.mockClear();
        pz.pan({ x: 100, y: 200 });
        expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
      });
    });

    describe("panBy", () => {
      it("should offset viewbox by delta", () => {
        const pz = new PanZoom(mockSlate);
        // viewbox get returns { x: 50, y: 100, width: 1200, height: 800 }
        pz.panBy({ x: 10, y: 20 });
        expect(mockSlate.canvas.viewbox).toHaveBeenCalledWith(60, 120, 1200, 800);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        mockSlate.canvas.viewbox.mockClear();
        pz.panBy({ x: 10, y: 20 });
        expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
      });
    });

    describe("getPan", () => {
      it("should return current viewbox position", () => {
        const pz = new PanZoom(mockSlate);
        expect(pz.getPan()).toEqual({ x: 50, y: 100 });
      });

      it("should return { x:0, y:0 } when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        expect(pz.getPan()).toEqual({ x: 0, y: 0 });
      });

      it("should return { x:0, y:0 } when canvas.viewbox() throws", () => {
        const pz = new PanZoom(mockSlate);
        mockSlate.canvas.viewbox.mockImplementation(() => {
          throw new Error("fail");
        });
        expect(pz.getPan()).toEqual({ x: 0, y: 0 });
      });
    });
  });

  // -----------------------------------------------------------------------
  // Reset operations
  // -----------------------------------------------------------------------
  describe("reset operations", () => {
    beforeEach(() => {
      mockSlate.canvas.zoom.mockReturnValue(2);
      mockSlate.canvas.viewbox.mockReturnValue({ x: 100, y: 200, width: 1200, height: 800 });
    });

    describe("resetZoom", () => {
      it("should reset zoom to 1", () => {
        const pz = new PanZoom(mockSlate);
        pz.resetZoom();
        expect(mockSlate.canvas.zoom).toHaveBeenCalledWith(1);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        mockSlate.canvas.zoom.mockClear();
        pz.resetZoom();
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
      });
    });

    describe("resetPan", () => {
      it("should reset viewbox to 0,0 preserving dimensions", () => {
        const pz = new PanZoom(mockSlate);
        pz.resetPan();
        expect(mockSlate.canvas.viewbox).toHaveBeenCalledWith(0, 0, 1200, 800);
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        mockSlate.canvas.viewbox.mockClear();
        pz.resetPan();
        expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
      });
    });

    describe("reset", () => {
      it("recenters a container-sized viewBox (infinite-canvas reset)", () => {
        const pz = new PanZoom(mockSlate);
        // Current view centered at (100, 60) with a 200x120 viewBox
        mockSlate.canvas.viewbox.mockReturnValue({
          x: 0,
          y: 0,
          width: 200,
          height: 120,
        });

        pz.reset();

        // Resets to a px-sized (1200x800 from the mock container) viewBox
        // centered on the prior center (100, 60) → (100-600, 60-400, ...)
        expect(mockSlate.canvas.viewbox).toHaveBeenCalledWith(
          -500,
          -340,
          1200,
          800
        );
      });

      it("should be a no-op when not enabled", () => {
        const pz = new PanZoom(mockSlate, { enabled: false });
        mockSlate.canvas.zoom.mockClear();
        mockSlate.canvas.viewbox.mockClear();
        pz.reset();
        expect(mockSlate.canvas.zoom).not.toHaveBeenCalled();
        expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
      });
    });
  });

  // -----------------------------------------------------------------------
  // Pan/zoom enable/disable toggles
  // -----------------------------------------------------------------------
  describe("pan/zoom enable/disable toggles", () => {
    it("enablePan should re-configure canvas with panning:true", () => {
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.panZoom.mockClear();
      pz.enablePan();
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(
        expect.objectContaining({ panning: true })
      );
    });

    it("disablePan should re-configure canvas with panning:false", () => {
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.panZoom.mockClear();
      pz.disablePan();
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(
        expect.objectContaining({ panning: false })
      );
    });

    it("enableZoom should re-configure canvas with wheelZoom:true, pinchZoom:true", () => {
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.panZoom.mockClear();
      pz.enableZoom();
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(
        expect.objectContaining({ wheelZoom: true, pinchZoom: true })
      );
    });

    it("disableZoom should re-configure canvas with wheelZoom:false, pinchZoom:false", () => {
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.panZoom.mockClear();
      pz.disableZoom();
      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(
        expect.objectContaining({ wheelZoom: false, pinchZoom: false })
      );
    });

    it("enablePan should be no-op when not enabled", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      mockSlate.canvas.panZoom.mockClear();
      pz.enablePan();
      expect(mockSlate.canvas.panZoom).not.toHaveBeenCalled();
    });

    it("disablePan should be no-op when not enabled", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      mockSlate.canvas.panZoom.mockClear();
      pz.disablePan();
      expect(mockSlate.canvas.panZoom).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // fit() and center()
  // -----------------------------------------------------------------------
  describe("fit and center", () => {
    it("fit should compute bounds from nodes and set viewbox", () => {
      mockSlate.nodes.allNodes = [
        { options: { x: 100, y: 50, width: 200, height: 150 } },
        { options: { x: 400, y: 300, width: 150, height: 100 } },
      ];
      mockSlate.canvas.node.clientWidth = 800;
      mockSlate.canvas.node.clientHeight = 600;

      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.viewbox.mockReturnValue({});
      pz.fit();

      // Content bounds: minX=100, minY=50, maxX=550, maxY=400 → 450x350.
      // Aspect-corrected finalW would be 600 (< container 800), so the
      // no-zoom-in cap enlarges the viewBox to the container px size
      // (800x600) centered on the content center (325, 225):
      // viewbox(325-400=-75, 225-300=-75, 800, 600)
      expect(mockSlate.canvas.viewbox).toHaveBeenCalled();
      const args = mockSlate.canvas.viewbox.mock.calls[
        mockSlate.canvas.viewbox.mock.calls.length - 1
      ];
      expect(Math.round(args[0])).toBe(-75); // cx - finalW/2
      expect(Math.round(args[1])).toBe(-75); // cy - finalH/2
      expect(Math.round(args[2])).toBe(800); // finalW (capped to container)
      expect(Math.round(args[3])).toBe(600); // finalH (capped to container)
    });

    it("fit should return early when there are no nodes", () => {
      mockSlate.nodes.allNodes = [];
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.viewbox.mockClear();
      pz.fit();
      expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
    });

    it("fit should return early when not enabled", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      mockSlate.canvas.viewbox.mockClear();
      pz.fit();
      expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
    });

    it("fit should handle missing nodes object gracefully", () => {
      mockSlate.nodes.allNodes = undefined;
      const pz = new PanZoom(mockSlate);
      mockSlate.canvas.viewbox.mockClear();
      pz.fit();
      expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
    });

    it("center should set viewbox centered on canvas bbox", () => {
      mockSlate.canvas.bbox.mockReturnValue({ cx: 600, cy: 400, x: 0, y: 0, width: 1200, height: 800 });
      mockSlate.canvas.viewbox.mockReturnValue({ x: 100, y: 50, width: 800, height: 600 });
      const pz = new PanZoom(mockSlate);
      pz.center();

      // centerX = bbox.cx - vb.width/2 = 600 - 400 = 200
      // centerY = bbox.cy - vb.height/2 = 400 - 300 = 100
      expect(mockSlate.canvas.viewbox).toHaveBeenCalledWith(200, 100, 800, 600);
    });

    it("center should be a no-op when not enabled", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      mockSlate.canvas.viewbox.mockClear();
      pz.center();
      expect(mockSlate.canvas.viewbox).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // destroy
  // -----------------------------------------------------------------------
  describe("destroy", () => {
    it("should disable panzoom and remove event listeners", () => {
      const onPan = vi.fn();
      const onZoom = vi.fn();
      const pz = new PanZoom(mockSlate, { onPan, onZoom, showControls: true });

      expect(pz.isInitialized()).toBe(true);

      pz.destroy();

      expect(mockSlate.canvas.panZoom).toHaveBeenCalledWith(false);
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("panStart");
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("panning");
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("panEnd");
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("zoom");
      expect(
        mockSlate.element.querySelector(".svg-pan-zoom-controls")
      ).toBeNull();
      expect(pz.isInitialized()).toBe(false);
    });

    it("should be safe to call destroy when not enabled", () => {
      const pz = new PanZoom(mockSlate, { enabled: false });
      expect(() => pz.destroy()).not.toThrow();
      expect(mockSlate.canvas.panZoom).not.toHaveBeenCalledWith(false);
    });

    it("should be safe to call destroy multiple times", () => {
      const pz = new PanZoom(mockSlate);
      pz.destroy();
      // Second call should not throw or call anything
      mockSlate.canvas.panZoom.mockClear();
      mockSlate.canvas.off.mockClear();
      expect(() => pz.destroy()).not.toThrow();
      expect(mockSlate.canvas.panZoom).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // resize (passthrough / no-op)
  // -----------------------------------------------------------------------
  describe("resize", () => {
    it("should exist and not throw", () => {
      const pz = new PanZoom(mockSlate);
      expect(() => pz.resize()).not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases
  // -----------------------------------------------------------------------
  describe("edge cases", () => {
    it("should handle zoom with no canvas node (fit)", () => {
      mockSlate.canvas.node.clientWidth = 0;
      mockSlate.canvas.node.clientHeight = 0;
      mockSlate.canvas.width.mockReturnValue(1200);
      mockSlate.canvas.height.mockReturnValue(800);
      mockSlate.nodes.allNodes = [
        { options: { x: 0, y: 0, width: 100, height: 100 } },
      ];

      const pz = new PanZoom(mockSlate);
      expect(() => pz.fit()).not.toThrow();
      // Falls back to canvas.width() / canvas.height()
      expect(mockSlate.canvas.viewbox).toHaveBeenCalled();
    });

    it("should handle wheelZoomDeltaMode options correctly", () => {
      new PanZoom(mockSlate, {
        wheelZoomDeltaModeLinePixels: 20,
        wheelZoomDeltaModeScreenPixels: 60,
      });
      const args = mockSlate.canvas.panZoom.mock.calls[0][0];
      expect(args.wheelZoomDeltaModeLinePixels).toBe(20);
      expect(args.wheelZoomDeltaModeScreenPixels).toBe(60);
    });

    it("should pass margins:false by default", () => {
      new PanZoom(mockSlate);
      const args = mockSlate.canvas.panZoom.mock.calls[0][0];
      expect(args.margins).toBe(false);
    });

    it("should accept margins object", () => {
      new PanZoom(mockSlate, {
        margins: { top: 10, left: 10, right: 10, bottom: 10 },
      });
      const args = mockSlate.canvas.panZoom.mock.calls[0][0];
      expect(args.margins).toEqual({ top: 10, left: 10, right: 10, bottom: 10 });
    });
  });
});
