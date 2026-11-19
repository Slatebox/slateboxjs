import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Keyboard } from "../../src/core/Keyboard";

describe("Keyboard", () => {
  let mockSlate: any;
  let keyboard: Keyboard;
  let canvasHost: HTMLElement;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    canvasHost = document.createElement("div");
    document.body.appendChild(canvasHost);

    mockSlate = {
      // The handler asks whether the key's target is inside this slate's element.
      element: canvasHost,
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
    canvasHost.remove();
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
  describe("typing with one note selected (type-to-edit)", () => {
    let note: any;

    /** A key press as the browser delivers it: targeted at whatever has focus. */
    function press(key: string, opts: KeyboardEventInit = {}, target: EventTarget = document.body) {
      const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts });
      target.dispatchEvent(event);
      return event;
    }

    beforeEach(() => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("tabindex", "0");
      canvasHost.appendChild(group);
      note = {
        id: "n1",
        options: { x: 100, y: 200, text: "Field recording" },
        position: vi.fn(),
        svgGroup: { node: group },
        canEditTextInline: vi.fn().mockReturnValue(true),
        editor: {
          startInline: vi.fn().mockReturnValue(true),
          isInlineEditing: vi.fn().mockReturnValue(false),
        },
      };
      mockSlate.getSelectedNodes.mockReturnValue([note]);
      mockSlate.selectedNodes = [note];
      mockSlate.getAllNodes = vi.fn().mockReturnValue([note]);
    });

    it("opens the editor with the caret at the end and the typed character appended", () => {
      const event = press("x");
      expect(note.editor.startInline).toHaveBeenCalledTimes(1);
      expect(note.editor.startInline).toHaveBeenCalledWith({ caret: "end", insert: "x", heldKey: "x" });
      expect(event.defaultPrevented).toBe(true);
    });

    it("takes capitals, digits, punctuation and characters outside the basic plane", () => {
      for (const key of ["T", "7", "-", "é", "😀"]) press(key, { shiftKey: key === "T" });
      expect(note.editor.startInline.mock.calls.map((call: any[]) => call[0].insert)).toEqual(["T", "7", "-", "é", "😀"]);
    });

    it("types letters that are shortcuts only with Ctrl/Cmd, and leaves the chords alone", () => {
      for (const key of ["z", "y", "a", "c", "v", "d", "g", "[", "]"]) press(key);
      expect(note.editor.startInline).toHaveBeenCalledTimes(9);
      expect(mockSlate.undoRedo.undo).not.toHaveBeenCalled();
      expect(mockSlate.undoRedo.redo).not.toHaveBeenCalled();

      note.editor.startInline.mockClear();
      press("z", { ctrlKey: true });
      press("z", { metaKey: true, shiftKey: true });
      press("y", { ctrlKey: true });
      expect(mockSlate.undoRedo.undo).toHaveBeenCalledTimes(1);
      expect(mockSlate.undoRedo.redo).toHaveBeenCalledTimes(2);
      expect(note.editor.startInline).not.toHaveBeenCalled();
    });

    it("ignores Ctrl, Cmd and Alt chords, composition and non-character keys", () => {
      press("x", { ctrlKey: true });
      press("x", { metaKey: true });
      press("x", { altKey: true });
      press("x", { isComposing: true });
      for (const key of ["Shift", "Tab", "Dead", "Process", "F5", "PageDown", "Home"]) press(key);
      expect(note.editor.startInline).not.toHaveBeenCalled();
    });

    it("keeps '?' as the shortcuts reference", () => {
      mockSlate.announce = vi.fn();
      press("?", { shiftKey: true });
      expect(note.editor.startInline).not.toHaveBeenCalled();
      expect(mockSlate.announce).toHaveBeenCalledWith("Keyboard shortcuts reference logged to console");
      const reference = (console.log as any).mock.calls.map((call: any[]) => String(call[0])).join("\n");
      expect(reference).toContain("SlateboxJS Keyboard Shortcuts");
      expect(reference).not.toContain("F2");
    });

    it("leaves Delete, arrows and Escape doing what they did", () => {
      press("ArrowUp");
      expect(note.position).toHaveBeenCalledWith(100, 195);
      press("Escape");
      expect(mockSlate.clearSelection).toHaveBeenCalledTimes(1);
      press("Delete");
      expect(mockSlate.removeNode).toHaveBeenCalledWith("n1");
      expect(note.editor.startInline).not.toHaveBeenCalled();
    });

    it("F2 and Enter still open the editor the rename way, with no options", () => {
      press("F2");
      expect(note.editor.startInline).toHaveBeenLastCalledWith();
      press("Enter");
      expect(note.editor.startInline).toHaveBeenCalledTimes(2);
      expect(note.editor.startInline).toHaveBeenLastCalledWith();
    });

    it("never starts for a note that cannot be edited (read-only, comment-only, locked, artwork)", () => {
      note.canEditTextInline.mockReturnValue(false);
      const event = press("x");
      expect(note.editor.startInline).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it("never starts with two notes selected, or with none", () => {
      const second = { ...note, id: "n2", editor: { startInline: vi.fn(), isInlineEditing: vi.fn() } };
      mockSlate.getSelectedNodes.mockReturnValue([note, second]);
      press("x");
      mockSlate.getSelectedNodes.mockReturnValue([]);
      press("x");
      expect(note.editor.startInline).not.toHaveBeenCalled();
      expect(second.editor.startInline).not.toHaveBeenCalled();
    });

    it("does not open a second editor while one is open", () => {
      note.editor.isInlineEditing.mockReturnValue(true);
      press("x");
      expect(note.editor.startInline).not.toHaveBeenCalled();
    });

    it("leaves a key the host already handled", () => {
      const event = new KeyboardEvent("keydown", { key: "x", bubbles: true, cancelable: true });
      event.preventDefault();
      document.body.dispatchEvent(event);
      expect(note.editor.startInline).not.toHaveBeenCalled();
    });

    it("types when focus is on the selected note itself", () => {
      press("x", {}, note.svgGroup.node);
      expect(note.editor.startInline).toHaveBeenCalledWith({ caret: "end", insert: "x", heldKey: "x" });
    });

    it("leaves keys to other controls: outside the canvas, another note, a canvas button", () => {
      const outside = document.createElement("button");
      document.body.appendChild(outside);
      const otherNote = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const plug = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      canvasHost.append(otherNote, plug);
      for (const target of [outside, otherNote, plug]) press("x", {}, target);
      expect(note.editor.startInline).not.toHaveBeenCalled();
      outside.remove();
    });

    it("Space types from the page, but on a focused note it still means select", () => {
      press(" ");
      expect(note.editor.startInline).toHaveBeenCalledWith({ caret: "end", insert: " ", heldKey: " " });

      note.editor.startInline.mockClear();
      note.svgGroup.node.focus();
      press(" ", {}, note.svgGroup.node);
      expect(note.editor.startInline).not.toHaveBeenCalled();
      expect(mockSlate.selectNodes).toHaveBeenCalledWith([note], false);
    });

    it("does nothing at all while keyboard handling is disabled", () => {
      keyboard.disable();
      press("x");
      expect(note.editor.startInline).not.toHaveBeenCalled();
    });
  });
});
