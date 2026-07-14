import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MultiSelection } from "../../src/core/MultiSelection";

/**
 * Helper to build a minimal mock SVG point that getSvgPoint returns.
 * The real method does: svgNode.createSVGPoint() → set x/y → matrixTransform(inverse(CTM)).
 */
function makeSvgPoint(x: number, y: number): { x: number; y: number } {
  return { x, y };
}

/**
 * Build a mock canvas suitable for MultiSelection tests.
 * Each call produces a fresh set of vi.fn() so per-test isolation is clean.
 */
function createMockCanvas() {
  const mockRect = {
    move: vi.fn().mockReturnThis(),
    size: vi.fn().mockReturnThis(),
    fill: vi.fn().mockReturnThis(),
    stroke: vi.fn().mockReturnThis(),
    attr: vi.fn().mockReturnThis(),
    remove: vi.fn(),
  };

  const listeners: Record<string, (event: any) => void> = {};

  return {
    node: {
      createSVGPoint: vi.fn().mockImplementation(() => ({
        x: 0,
        y: 0,
        matrixTransform: vi.fn().mockImplementation(function (
          this: any,
          _matrix: any
        ) {
          // After assigning clientX/clientY this.x and this.y are set
          return { x: this.x, y: this.y };
        }),
      })),
      getScreenCTM: vi.fn().mockReturnValue({
        inverse: vi.fn().mockReturnValue({}),
      }),
    },
    rect: vi.fn().mockReturnValue(mockRect),
    on: vi.fn((event: string, handler: (e: any) => void) => {
      listeners[event] = handler;
    }),
    off: vi.fn((event: string) => {
      delete listeners[event];
    }),
    group: vi.fn().mockReturnValue({
      attr: vi.fn().mockReturnThis(),
      line: vi.fn().mockReturnValue({ stroke: vi.fn().mockReturnThis() }),
      back: vi.fn(),
      remove: vi.fn(),
    }),
    // Expose the listeners so tests can simulate events
    _listeners: listeners,
    _lastRect: mockRect,
  };
}

function createMockSlate() {
  const canvas = createMockCanvas();
  const mockNode = (id: string, bbox: { x: number; y: number; width: number; height: number }) => ({
    id,
    svgGroup: {
      bbox: vi.fn().mockReturnValue(bbox),
    },
    // Rubber-band selection tests against world coords in node.options.
    options: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
    position: vi.fn(),
  });

  const allNodes: ReturnType<typeof mockNode>[] = [];

  return {
    canvas,
    nodes: {
      allNodes,
      add: vi.fn(),
      remove: vi.fn(),
    },
    selectNodes: vi.fn(),
    getSelectedNodes: vi.fn().mockReturnValue([]),
    removeNode: vi.fn(),
    clearSelection: vi.fn(),
    // Convenience factory so tests can create nodes that are automatically tracked
    _mockNode: mockNode,
    _allNodes: allNodes,
  };
}

describe("MultiSelection", () => {
  let mockSlate: ReturnType<typeof createMockSlate>;
  // Move/up are bound on window during a rubber-band drag (survives pointer
  // capture); capture those handlers so tests can drive them.
  let winListeners: Record<string, (e: any) => void>;

  const getWin = (type: string) => winListeners[type];

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    winListeners = {};
    vi.spyOn(window, "addEventListener").mockImplementation(
      (type: string, handler: any) => {
        winListeners[type] = handler;
      }
    );
    vi.spyOn(window, "removeEventListener").mockImplementation((type: string) => {
      delete winListeners[type];
    });

    mockSlate = createMockSlate();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Construction & initialization ──────────────────────────────────

  describe("construction & initialization", () => {
    it("should construct with default options when enabled is true", () => {
      const ms = new MultiSelection(mockSlate);
      expect(ms).toBeInstanceOf(MultiSelection);
      expect(ms.isEnabled()).toBe(true);
    });

    it("should construct and NOT bind events when enabled is false", () => {
      const ms = new MultiSelection(mockSlate, { enabled: false });
      expect(ms.isEnabled()).toBe(false);
      expect(mockSlate.canvas.on).not.toHaveBeenCalled();
    });

    it("should bind pointerdown on construction; move/up are added on drag start", () => {
      new MultiSelection(mockSlate);
      expect(mockSlate.canvas.on).toHaveBeenCalledWith(
        "pointerdown.multiselect",
        expect.any(Function)
      );
      // move/up are NOT bound until a drag starts (they live on window).
      expect(getWin("pointermove")).toBeUndefined();
      expect(getWin("pointerup")).toBeUndefined();

      // Start a drag → window move/up get bound.
      getHandler(mockSlate.canvas.on, "pointerdown.multiselect")({
        target: mockSlate.canvas.node,
        clientX: 10,
        clientY: 10,
        shiftKey: false,
      });
      expect(getWin("pointermove")).toBeInstanceOf(Function);
      expect(getWin("pointerup")).toBeInstanceOf(Function);
    });

    it("should accept custom selection color and opacity", () => {
      const ms = new MultiSelection(mockSlate, {
        selectionColor: "#ff0000",
        selectionOpacity: 0.5,
      });

      // We can't easily read private fields, but we can verify the rect is created with them
      // by triggering a pointerdown on the canvas
      const event = {
        target: mockSlate.canvas.node,
        clientX: 100,
        clientY: 200,
        shiftKey: false,
      };

      // Fire pointerdown to create the rect
      const handler = mockSlate.canvas.on.mock.calls.find(
        ([name]: [string]) => name === "pointerdown.multiselect"
      )?.[1];
      handler(event);

      expect(mockSlate.canvas.rect).toHaveBeenCalledWith(0, 0);
      expect(mockSlate.canvas._lastRect.fill).toHaveBeenCalledWith({
        color: "#ff0000",
        opacity: 0.5,
      });
      expect(mockSlate.canvas._lastRect.stroke).toHaveBeenCalledWith({
        color: "#ff0000",
        width: 1,
        dasharray: "4,4",
      });
    });

    it("should not bind events when canvas is missing", () => {
      const slateNoCanvas = { canvas: null };
      // @ts-expect-error — slate type mismatch is expected in test
      const ms = new MultiSelection(slateNoCanvas);
      expect(ms.isEnabled()).toBe(true);
      // No crash — silently returns from bindEvents
    });

    it("should use default option values when only partial options are given", () => {
      const ms = new MultiSelection(mockSlate, {});
      expect(ms.isEnabled()).toBe(true);

      // Trigger pointerdown on canvas to verify defaults
      const handler = mockSlate.canvas.on.mock.calls.find(
        ([name]: [string]) => name === "pointerdown.multiselect"
      )?.[1];
      handler({ target: mockSlate.canvas.node, clientX: 50, clientY: 60, shiftKey: false });

      expect(mockSlate.canvas._lastRect.fill).toHaveBeenCalledWith({
        color: "#4a90e2",
        opacity: 0.15,
      });
    });
  });

  // ─── enable / disable / isEnabled ───────────────────────────────────

  describe("enable / disable / isEnabled", () => {
    it("should toggle enabled state", () => {
      const ms = new MultiSelection(mockSlate, { enabled: false });
      expect(ms.isEnabled()).toBe(false);

      ms.enable();
      expect(ms.isEnabled()).toBe(true);
      // enable() re-binds events
      expect(mockSlate.canvas.on).toHaveBeenCalled();
    });

    it("should unbind events and cancel selection on disable", () => {
      const ms = new MultiSelection(mockSlate);
      vi.clearAllMocks();

      ms.disable();
      expect(ms.isEnabled()).toBe(false);
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("pointerdown.multiselect");
    });

    it("should remove the selection rectangle when disabled mid-drag", () => {
      const ms = new MultiSelection(mockSlate);

      // Start a drag selection
      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      const rect = mockSlate.canvas._lastRect;
      expect(rect.remove).not.toHaveBeenCalled();

      ms.disable();
      expect(rect.remove).toHaveBeenCalled();
    });
  });

  // ─── Shift-click selection (via pointer events) ─────────────────────

  describe("drag-select rectangle (pointer events)", () => {
    it("should start selection on pointerdown on canvas", () => {
      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 100, clientY: 200, shiftKey: false });

      expect(mockSlate.canvas.rect).toHaveBeenCalledWith(0, 0);
      expect(mockSlate.canvas._lastRect.move).toHaveBeenCalledWith(100, 200);
    });

    it("should NOT start selection on pointerdown on a node (non-canvas target)", () => {
      new MultiSelection(mockSlate);

      const nodeTarget = { tagName: "g" }; // A group element, not SVG root
      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: nodeTarget, clientX: 100, clientY: 200, shiftKey: false });

      expect(mockSlate.canvas.rect).not.toHaveBeenCalled();
    });

    it("should NOT start selection when disabled", () => {
      new MultiSelection(mockSlate, { enabled: false });

      // Events were never bound, so triggering a pointerdown manually on canvas
      // should have no effect — but there's no handler to fire.
      expect(mockSlate.canvas.rect).not.toHaveBeenCalled();
    });

    it("should update rectangle on pointermove during selection", () => {
      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 100, clientY: 200, shiftKey: false });

      const pointerMove = getWin("pointermove");
      pointerMove({ clientX: 300, clientY: 500 });

      // Rect should be moved to min(x1,x2), min(y1,y2) and sized to abs differences
      expect(mockSlate.canvas._lastRect.move).toHaveBeenCalledWith(100, 200);
      expect(mockSlate.canvas._lastRect.size).toHaveBeenCalledWith(200, 300);
    });

    it("should handle negative drag direction (right-to-left, bottom-to-top)", () => {
      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 300, clientY: 500, shiftKey: false });

      const pointerMove = getWin("pointermove");
      pointerMove({ clientX: 100, clientY: 200 });

      // min of start/end for position, abs for width/height
      expect(mockSlate.canvas._lastRect.move).toHaveBeenCalledWith(100, 200);
      expect(mockSlate.canvas._lastRect.size).toHaveBeenCalledWith(200, 300);
    });

    it("should not bind window move/up until a drag starts", () => {
      new MultiSelection(mockSlate);
      // No pointerdown happened, so the move/up handlers are not on window yet.
      expect(getWin("pointermove")).toBeUndefined();
      expect(getWin("pointerup")).toBeUndefined();
      expect(mockSlate.canvas._lastRect.move).not.toHaveBeenCalled();
    });

    it("should select nodes on pointerup when rectangle is large enough", () => {
      new MultiSelection(mockSlate);

      // Add two nodes that overlap with the drag rect
      const nodeA = mockSlate._mockNode("n1", { x: 50, y: 50, width: 100, height: 60 });
      const nodeB = mockSlate._mockNode("n2", { x: 300, y: 50, width: 80, height: 50 });
      mockSlate._allNodes.push(nodeA, nodeB);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      const pointerMove = getWin("pointermove");
      pointerMove({ clientX: 200, clientY: 200 });

      const pointerUp = getWin("pointerup");
      pointerUp({ clientX: 200, clientY: 200, shiftKey: false });

      // nodeA is inside (10-200 x 10-200), nodeB is at x=300 so outside
      expect(mockSlate.selectNodes).toHaveBeenCalledWith([nodeA], false);
    });

    it("should select nodes on pointerup with shiftKey to add to existing selection", () => {
      new MultiSelection(mockSlate);

      const nodeA = mockSlate._mockNode("n1", { x: 50, y: 50, width: 100, height: 60 });
      mockSlate._allNodes.push(nodeA);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      const pointerMove = getWin("pointermove");
      pointerMove({ clientX: 200, clientY: 200 });

      const pointerUp = getWin("pointerup");
      pointerUp({ clientX: 200, clientY: 200, shiftKey: true });

      expect(mockSlate.selectNodes).toHaveBeenCalledWith([nodeA], true);
    });

    it("should NOT select nodes when rectangle is too small (< 5px)", () => {
      new MultiSelection(mockSlate);

      const nodeA = mockSlate._mockNode("n1", { x: 50, y: 50, width: 100, height: 60 });
      mockSlate._allNodes.push(nodeA);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 100, clientY: 100, shiftKey: false });

      const pointerUp = getWin("pointerup");
      pointerUp({ clientX: 102, clientY: 103, shiftKey: false });

      // Width is 2, height is 3 — both under 5
      expect(mockSlate.selectNodes).not.toHaveBeenCalled();
    });

    it("should select nodes when width and height are strictly greater than 5", () => {
      new MultiSelection(mockSlate);

      // Place a node that overlaps the drag rectangle
      const nodeA = mockSlate._mockNode("n1", { x: 0, y: 0, width: 20, height: 20 });
      mockSlate._allNodes.push(nodeA);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 0, clientY: 0, shiftKey: false });

      const pointerUp = getWin("pointerup");
      // w=6, h=6 — both strictly > 5, so selection proceeds
      pointerUp({ clientX: 6, clientY: 6, shiftKey: false });

      // Node (0,0)-(20,20) overlaps drag (0,0)-(6,6)
      expect(mockSlate.selectNodes).toHaveBeenCalled();
    });

    it("should cancel selection rectangle on pointerup (remove visual rect)", () => {
      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      const rect = mockSlate.canvas._lastRect;

      const pointerUp = getWin("pointerup");
      pointerUp({ clientX: 100, clientY: 100, shiftKey: false });

      expect(rect.remove).toHaveBeenCalled();
    });

    it("should skip nodes whose bbox() throws", () => {
      new MultiSelection(mockSlate);

      const badNode = {
        id: "bad",
        svgGroup: {
          bbox: vi.fn().mockImplementation(() => {
            throw new Error("No bbox");
          }),
        },
      };
      const goodNode = mockSlate._mockNode("n1", { x: 50, y: 50, width: 10, height: 10 });
      mockSlate._allNodes.push(badNode, goodNode);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 0, clientY: 0, shiftKey: false });

      const pointerUp = getWin("pointerup");
      pointerUp({ clientX: 200, clientY: 200, shiftKey: false });

      // Only goodNode should be selected
      expect(mockSlate.selectNodes).toHaveBeenCalledWith([goodNode], false);
    });

    it("should log debug message when nodes are selected in rectangle", () => {
      new MultiSelection(mockSlate);

      const node = mockSlate._mockNode("n1", { x: 10, y: 10, width: 50, height: 50 });
      mockSlate._allNodes.push(node);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 0, clientY: 0, shiftKey: false });

      const pointerUp = getWin("pointerup");
      pointerUp({ clientX: 100, clientY: 100, shiftKey: false });

      expect(console.log).toHaveBeenCalledWith(
        "MULTISELECT_DEBUG: Selected",
        1,
        "nodes in rectangle"
      );
    });
  });

  // ─── AABB overlap logic (selectNodesInRect internals) ──────────────

  describe("AABB rectangle-overlap selection", () => {
    it("should select nodes whose bounding box overlaps the drag rectangle", () => {
      new MultiSelection(mockSlate);

      // Node fully inside rect
      const inside = mockSlate._mockNode("inside", { x: 30, y: 30, width: 40, height: 40 });
      // Node partially overlapping rect
      const partial = mockSlate._mockNode("partial", {
        x: 80,
        y: 10,
        width: 60,
        height: 60,
      });
      // Node completely outside rect (to the right)
      const outside = mockSlate._mockNode("outside", {
        x: 300,
        y: 300,
        width: 40,
        height: 40,
      });
      mockSlate._allNodes.push(inside, partial, outside);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 20, clientY: 20, shiftKey: false });

      const pointerUp = getWin("pointerup");
      // Rect from (20,20) to (120,100) → w=100, h=80
      pointerUp({ clientX: 120, clientY: 100, shiftKey: false });

      expect(mockSlate.selectNodes).toHaveBeenCalledWith([inside, partial], false);
      expect(mockSlate.selectNodes).not.toHaveBeenCalledWith(
        expect.arrayContaining([outside]),
        expect.anything()
      );
    });

    it("should not crash when nodes.allNodes is empty", () => {
      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 0, clientY: 0, shiftKey: false });

      const pointerUp = getWin("pointerup");
      expect(() => {
        pointerUp({ clientX: 100, clientY: 100, shiftKey: false });
      }).not.toThrow();

      expect(mockSlate.selectNodes).not.toHaveBeenCalled();
    });
  });

  // ─── deleteSelected ─────────────────────────────────────────────────

  describe("deleteSelected", () => {
    it("should remove all selected nodes and clear selection", () => {
      const ms = new MultiSelection(mockSlate);

      const nodeA = { id: "n1", options: { x: 0, y: 0 } };
      const nodeB = { id: "n2", options: { x: 0, y: 0 } };
      mockSlate.getSelectedNodes.mockReturnValue([nodeA, nodeB]);

      ms.deleteSelected();

      expect(mockSlate.removeNode).toHaveBeenCalledWith("n1");
      expect(mockSlate.removeNode).toHaveBeenCalledWith("n2");
      expect(mockSlate.clearSelection).toHaveBeenCalled();
    });

    it("should handle empty selection gracefully", () => {
      const ms = new MultiSelection(mockSlate);
      mockSlate.getSelectedNodes.mockReturnValue([]);

      expect(() => ms.deleteSelected()).not.toThrow();
      expect(mockSlate.removeNode).not.toHaveBeenCalled();
      expect(mockSlate.clearSelection).toHaveBeenCalled();
    });
  });

  // ─── moveSelected ───────────────────────────────────────────────────

  describe("moveSelected", () => {
    it("should move all selected nodes by the given delta", () => {
      const ms = new MultiSelection(mockSlate);

      const nodeA = { id: "n1", options: { x: 10, y: 20 }, position: vi.fn() };
      const nodeB = { id: "n2", options: { x: 100, y: 200 }, position: vi.fn() };
      mockSlate.getSelectedNodes.mockReturnValue([nodeA, nodeB]);

      ms.moveSelected(5, 15);

      expect(nodeA.position).toHaveBeenCalledWith(15, 35);
      expect(nodeB.position).toHaveBeenCalledWith(105, 215);
    });

    it("should handle nodes with missing x/y options (default to 0)", () => {
      const ms = new MultiSelection(mockSlate);

      const node = { id: "n1", options: {}, position: vi.fn() };
      mockSlate.getSelectedNodes.mockReturnValue([node]);

      ms.moveSelected(10, 20);

      expect(node.position).toHaveBeenCalledWith(10, 20);
    });

    it("should handle empty selection gracefully", () => {
      const ms = new MultiSelection(mockSlate);
      mockSlate.getSelectedNodes.mockReturnValue([]);

      expect(() => ms.moveSelected(10, 20)).not.toThrow();
    });
  });

  // ─── getSvgPoint error handling ─────────────────────────────────────

  describe("getSvgPoint error handling", () => {
    it("should abort selection if getSvgPoint returns null (pointerdown)", () => {
      // Make canvas.node.createSVGPoint throw
      mockSlate.canvas.node.createSVGPoint.mockImplementation(() => {
        throw new Error("SVG error");
      });

      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 100, clientY: 200, shiftKey: false });

      // Rect should not have been created since getSvgPoint returned null
      expect(mockSlate.canvas.rect).not.toHaveBeenCalled();
    });

    it("should safely skip pointermove when getSvgPoint fails", () => {
      new MultiSelection(mockSlate);

      // Start selection normally
      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      // Now break getSvgPoint for the move
      mockSlate.canvas.node.createSVGPoint.mockImplementation(() => {
        throw new Error("SVG error");
      });

      const pointerMove = getWin("pointermove");
      expect(() => {
        pointerMove({ clientX: 100, clientY: 100 });
      }).not.toThrow();

      // Rect should not have been updated
      expect(mockSlate.canvas._lastRect.move).toHaveBeenCalledTimes(1); // Only from pointerdown
    });

    it("should safely skip pointerup when getSvgPoint fails", () => {
      new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      mockSlate.canvas.node.createSVGPoint.mockImplementation(() => {
        throw new Error("SVG error");
      });

      const pointerUp = getWin("pointerup");
      expect(() => {
        pointerUp({ clientX: 100, clientY: 100, shiftKey: false });
      }).not.toThrow();

      // selectNodes should not have been called
      expect(mockSlate.selectNodes).not.toHaveBeenCalled();
    });
  });

  // ─── isEnabled ──────────────────────────────────────────────────────

  describe("isEnabled", () => {
    it("should reflect the enabled option passed to constructor", () => {
      expect(new MultiSelection(mockSlate, { enabled: true }).isEnabled()).toBe(true);
      expect(new MultiSelection(mockSlate, { enabled: false }).isEnabled()).toBe(false);
    });

    it("should return true by default", () => {
      expect(new MultiSelection(mockSlate).isEnabled()).toBe(true);
    });
  });

  // ─── Edge cases ─────────────────────────────────────────────────────

  describe("edge cases", () => {
    it("should unbind all events when disabled mid-operation", () => {
      const ms = new MultiSelection(mockSlate);

      // Start drag
      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 10, clientY: 10, shiftKey: false });

      ms.disable();

      // Disable unbinds events and cancels selection
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("pointerdown.multiselect");
      expect(window.removeEventListener).toHaveBeenCalledWith("pointermove", expect.any(Function), true);
      expect(window.removeEventListener).toHaveBeenCalledWith("pointerup", expect.any(Function), true);
    });

    it("should handle multiple subsequent drag selections cleanly", () => {
      new MultiSelection(mockSlate);

      const nodeA = mockSlate._mockNode("n1", { x: 10, y: 10, width: 50, height: 50 });
      mockSlate._allNodes.push(nodeA);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");

      // First selection — window move/up are (re)bound on each pointerdown.
      pointerDown({ target: mockSlate.canvas.node, clientX: 0, clientY: 0, shiftKey: false });
      getWin("pointermove")({ clientX: 100, clientY: 100 });
      getWin("pointerup")({ clientX: 100, clientY: 100, shiftKey: false });
      expect(mockSlate.selectNodes).toHaveBeenCalledTimes(1);

      // Second selection
      pointerDown({ target: mockSlate.canvas.node, clientX: 5, clientY: 5, shiftKey: false });
      getWin("pointermove")({ clientX: 80, clientY: 80 });
      getWin("pointerup")({ clientX: 80, clientY: 80, shiftKey: false });
      expect(mockSlate.selectNodes).toHaveBeenCalledTimes(2);

      // The rect should have been created twice
      expect(mockSlate.canvas.rect).toHaveBeenCalledTimes(2);
    });

    it("should not interfere with other namespaced events when disabled", () => {
      // Bind a separate handler under a different namespace
      const otherHandler = vi.fn();
      mockSlate.canvas.on("pointerdown.other", otherHandler);

      const ms = new MultiSelection(mockSlate);

      // Fire the multiselect pointerdown to confirm it works
      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 100, clientY: 100, shiftKey: false });
      expect(mockSlate.canvas.rect).toHaveBeenCalled();

      // Other handler should still be intact, not accidentally triggered
      expect(otherHandler).not.toHaveBeenCalled();

      // Disabling MultiSelection should unbind only its own namespaced events
      ms.disable();

      const offCalls = mockSlate.canvas.off.mock.calls.map(([name]: [string]) => name);
      expect(offCalls).toContain("pointerdown.multiselect");
      expect(window.removeEventListener).toHaveBeenCalledWith("pointermove", expect.any(Function), true);
      expect(window.removeEventListener).toHaveBeenCalledWith("pointerup", expect.any(Function), true);

      // The other namespace event should NOT have been unbound
      expect(offCalls).not.toContain("pointerdown.other");
    });
  });

  // ─── Selection state (internal reset) ───────────────────────────────

  describe("selection state reset on cancelSelection", () => {
    it("should clean up selection rectangle when disabled mid-drag", () => {
      const ms = new MultiSelection(mockSlate);

      const pointerDown = getHandler(mockSlate.canvas.on, "pointerdown.multiselect");
      pointerDown({ target: mockSlate.canvas.node, clientX: 100, clientY: 100, shiftKey: false });

      // Verify rect was created
      expect(mockSlate.canvas.rect).toHaveBeenCalled();

      // Make sure fill and stroke etc were set (the rect was configured)
      expect(mockSlate.canvas._lastRect.fill).toHaveBeenCalled();

      ms.disable();

      // Disable should cancel selection and unbind
      expect(window.removeEventListener).toHaveBeenCalledWith("pointermove", expect.any(Function), true);
      expect(mockSlate.canvas.off).toHaveBeenCalledWith("pointerdown.multiselect");
      expect(window.removeEventListener).toHaveBeenCalledWith("pointerup", expect.any(Function), true);
    });
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Retrieve the event handler registered for a given event name.
 * Returns a no-op if not found, so tests don't crash from undefined.
 */
function getHandler(
  onMock: ReturnType<typeof vi.fn>,
  eventName: string
): (...args: any[]) => void {
  const call = onMock.mock.calls.find(([name]: [string]) => name === eventName);
  return call?.[1] ?? (() => {});
}
