import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Keyboard } from "../../src/core/Keyboard";

describe("Keyboard", () => {
  let mockSlate: any;
  let keyboard: Keyboard;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockSlate = {
      getSelectedNodes: vi.fn().mockReturnValue([]),
      clearSelection: vi.fn(),
      selectNodes: vi.fn(),
      removeNode: vi.fn(),
      undoRedo: {
        undo: vi.fn(),
        redo: vi.fn(),
      },
      nodes: {
        allNodes: [
          { id: "n1", options: { x: 100, y: 200 }, position: vi.fn() },
          { id: "n2", options: { x: 300, y: 400 }, position: vi.fn() },
        ],
      },
    };

    keyboard = new Keyboard(mockSlate);
    keyboard.bindGlobal();
  });

  afterEach(() => {
    keyboard.unbindGlobal();
  });

  function fireKey(key: string, opts: Partial<KeyboardEventInit> = {}) {
    const event = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      ...opts,
    });
    document.dispatchEvent(event);
  }

  describe("Delete key", () => {
    it("should delete selected nodes", () => {
      const selected = [{ id: "n1" }];
      mockSlate.getSelectedNodes.mockReturnValue(selected);

      fireKey("Delete");

      expect(mockSlate.removeNode).toHaveBeenCalledWith("n1");
      expect(mockSlate.clearSelection).toHaveBeenCalled();
    });

    it("should do nothing with no selection", () => {
      mockSlate.getSelectedNodes.mockReturnValue([]);
      fireKey("Delete");
      expect(mockSlate.removeNode).not.toHaveBeenCalled();
    });
  });

  describe("Ctrl+Z / Ctrl+Y", () => {
    it("should undo on Ctrl+Z", () => {
      fireKey("z", { ctrlKey: true });
      expect(mockSlate.undoRedo.undo).toHaveBeenCalled();
    });

    it("should redo on Ctrl+Y", () => {
      fireKey("y", { ctrlKey: true });
      expect(mockSlate.undoRedo.redo).toHaveBeenCalled();
    });

    it("should redo on Ctrl+Shift+Z", () => {
      fireKey("z", { ctrlKey: true, shiftKey: true });
      expect(mockSlate.undoRedo.redo).toHaveBeenCalled();
    });
  });

  describe("Ctrl+A", () => {
    it("should select all nodes", () => {
      fireKey("a", { ctrlKey: true });
      expect(mockSlate.selectNodes).toHaveBeenCalledWith(
        mockSlate.nodes.allNodes,
        false
      );
    });
  });

  describe("Escape", () => {
    it("should deselect all", () => {
      fireKey("Escape");
      expect(mockSlate.clearSelection).toHaveBeenCalled();
    });
  });

  describe("Arrow keys", () => {
    it("should nudge selected nodes with arrow keys", () => {
      const node = { id: "n1", options: { x: 100, y: 200 }, position: vi.fn() };
      mockSlate.getSelectedNodes.mockReturnValue([node]);

      fireKey("ArrowUp");
      expect(node.position).toHaveBeenCalledWith(100, 195);

      fireKey("ArrowDown");
      expect(node.position).toHaveBeenCalledWith(100, 205);

      fireKey("ArrowLeft");
      expect(node.position).toHaveBeenCalledWith(95, 200);

      fireKey("ArrowRight");
      expect(node.position).toHaveBeenCalledWith(105, 200);
    });
  });

  describe("enable/disable", () => {
    it("should ignore keys when disabled", () => {
      keyboard.disable();
      fireKey("Escape");
      expect(mockSlate.clearSelection).not.toHaveBeenCalled();
    });

    it("should process keys when re-enabled", () => {
      keyboard.disable();
      keyboard.enable();
      fireKey("Escape");
      expect(mockSlate.clearSelection).toHaveBeenCalled();
    });
  });

  describe("input fields", () => {
    it("should not intercept keys when target is an input", () => {
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      const event = new KeyboardEvent("keydown", {
        key: "Delete",
        bubbles: true,
      });
      Object.defineProperty(event, "target", { value: input });
      document.dispatchEvent(event);

      expect(mockSlate.removeNode).not.toHaveBeenCalled();
      document.body.removeChild(input);
    });
  });
});
