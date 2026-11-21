import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Editor } from "../../src/core/Editor";

// Mock the FontLoader module
vi.mock("../../src/core/FontLoader", () => ({
  loadFont: vi.fn().mockResolvedValue(undefined),
}));

describe("Editor", () => {
  let mockNode: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {
        text: "Initial",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        fontColor: "#000000",
        textOpacity: 1,
        textXAlign: "center",
        textYAlign: "middle",
        width: 150,
        height: 80,
      },
      textElement: {
        text: vi.fn(),
        font: vi.fn(),
        bbox: vi.fn().mockReturnValue({ width: 50, height: 20 }),
      },
      centerText: vi.fn(),
      slate: {
        options: {},
      },
    };
  });

  describe("get", () => {
    it("should return current text properties", () => {
      const editor = new Editor(mockNode);
      const props = editor.get();

      expect(props.text).toBe("Initial");
      expect(props.fontSize).toBe(14);
      expect(props.fontFamily).toBe("Arial, sans-serif");
      expect(props.fontColor).toBe("#000000");
      expect(props.textOpacity).toBe(1);
      expect(props.textXAlign).toBe("center");
      expect(props.textYAlign).toBe("middle");
    });

    it("should return defaults for missing options", () => {
      mockNode.options = {};
      const editor = new Editor(mockNode);
      const props = editor.get();

      expect(props.text).toBe("");
      expect(props.fontSize).toBe(14);
      expect(props.fontFamily).toBe("Arial, sans-serif");
    });
  });

  describe("set", () => {
    it("should update text content", async () => {
      const editor = new Editor(mockNode);
      await editor.set("New Text");

      expect(mockNode.options.text).toBe("New Text");
      expect(mockNode.textElement.text).toHaveBeenCalledWith("New Text");
    });

    it("should update font size", async () => {
      const editor = new Editor(mockNode);
      await editor.set("Test", 20);

      expect(mockNode.options.fontSize).toBe(20);
    });

    it("should update font color", async () => {
      const editor = new Editor(mockNode);
      await editor.set("Test", undefined, undefined, "#ff0000");

      expect(mockNode.options.fontColor).toBe("#ff0000");
    });

    it("should call centerText after setting text", async () => {
      const editor = new Editor(mockNode);
      await editor.set("Centered");

      expect(mockNode.centerText).toHaveBeenCalled();
    });

    it("should skip SVG content nodes (no textElement)", async () => {
      mockNode.textElement = undefined;
      const editor = new Editor(mockNode);
      await editor.set("Test");

      // Should not throw
      expect(mockNode.options.text).toBe("Test");
    });
  });

  describe("calculateAutoOffset", () => {
    it("should calculate offset for centering text in node", () => {
      const editor = new Editor(mockNode);
      const offset = editor.calculateAutoOffset();

      // (150 - 50) / 2 = 50, (80 - 20) / 2 = 30
      expect(offset.x).toBe(50);
      expect(offset.y).toBe(30);
    });

    it("should return {0,0} when no textElement", () => {
      mockNode.textElement = undefined;
      const editor = new Editor(mockNode);
      expect(editor.calculateAutoOffset()).toEqual({ x: 0, y: 0 });
    });
  });
  describe("startInline", () => {
    let group: SVGGElement;
    let invoked: any[];
    let broadcasts: any[];

    const box = () => group.querySelector(".sb-inline-editor") as HTMLElement | null;
    const key = (target: Element, name: string, opts: KeyboardEventInit = {}, type = "keydown") => {
      const event = new KeyboardEvent(type, { key: name, bubbles: true, cancelable: true, ...opts });
      target.dispatchEvent(event);
      return event;
    };

    beforeEach(() => {
      // jsdom has no layout, so no innerText; the editor reads the edited text through it.
      Object.defineProperty(HTMLElement.prototype, "innerText", {
        configurable: true,
        get() { return this.textContent; },
      });
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("tabindex", "0");
      svg.appendChild(group);
      document.body.appendChild(svg);
      invoked = [];
      broadcasts = [];
      mockNode.svgGroup = { node: group };
      mockNode.textElement.hide = vi.fn();
      mockNode.textElement.show = vi.fn();
      mockNode.slate = {
        options: {},
        collab: { invoke: (pkg: any) => invoked.push(pkg), send: vi.fn() },
        broadcast: (type: string, data: any) => broadcasts.push({ type, data }),
      };
    });

    afterEach(() => {
      group.ownerSVGElement?.remove();
      delete (HTMLElement.prototype as any).innerText;
    });

    it("opens focused at once and reports that it opened; a second call does nothing", () => {
      const editor = new Editor(mockNode);
      expect(editor.startInline()).toBe(true);
      expect(document.activeElement).toBe(box());
      expect(editor.isInlineEditing()).toBe(true);
      expect(editor.startInline()).toBe(false);
      expect(group.querySelectorAll(".sb-inline-editor")).toHaveLength(1);
    });

    it("puts its text where the note draws it: Left and Bottom stay left and bottom while typing", () => {
      mockNode.options.textXAlign = "left";
      mockNode.options.textYAlign = "bottom";
      new Editor(mockNode).startInline();
      const style = box()!.style;
      expect(style.textAlign).toBe("left");
      expect(style.justifyContent).toBe("flex-start");
      expect(style.alignItems).toBe("flex-end");
    });

    it("follows each of the six alignments, and centres a note that names none", () => {
      const cases: [string | undefined, string | undefined, string, string, string][] = [
        ["right", "top", "right", "flex-end", "flex-start"],
        ["center", "middle", "center", "center", "center"],
        [undefined, undefined, "center", "center", "center"],
      ];
      for (const [x, y, textAlign, justify, align] of cases) {
        mockNode.options.textXAlign = x;
        mockNode.options.textYAlign = y;
        const editor = new Editor(mockNode);
        editor.startInline();
        const style = box()!.style;
        expect([style.textAlign, style.justifyContent, style.alignItems]).toEqual([textAlign, justify, align]);
        key(box()!, "Escape");
      }
    });

    it("selects all the text by default, the rename gesture", () => {
      new Editor(mockNode).startInline();
      const selection = window.getSelection()!;
      expect(selection.isCollapsed).toBe(false);
      expect(selection.toString()).toBe("Initial");
    });

    it("with caret 'end' keeps the text and puts a collapsed caret after it", () => {
      new Editor(mockNode).startInline({ caret: "end" });
      const selection = window.getSelection()!;
      expect(box()!.textContent).toBe("Initial");
      expect(selection.isCollapsed).toBe(true);
      const range = selection.getRangeAt(0);
      const tail = document.createRange();
      tail.selectNodeContents(box()!);
      tail.collapse(false);
      expect(range.compareBoundaryPoints(Range.START_TO_START, tail)).toBe(0);
    });

    it("appends the inserted character after the existing text", () => {
      new Editor(mockNode).startInline({ caret: "end", insert: "x" });
      expect(box()!.textContent).toBe("Initialx");
      expect(window.getSelection()!.isCollapsed).toBe(true);
    });

    it("broadcasts nothing when it opens, and nothing when closed unchanged", () => {
      const editor = new Editor(mockNode);
      editor.startInline({ caret: "end" });
      expect(invoked).toEqual([]);
      expect(broadcasts).toEqual([]);
      key(box()!, "Enter");
      expect(editor.isInlineEditing()).toBe(false);
      expect(invoked).toEqual([]);
      expect(broadcasts).toEqual([]);
    });

    it("commits a change on Enter as exactly one onNodeTextChanged", () => {
      const editor = new Editor(mockNode);
      editor.startInline({ caret: "end", insert: "x" });
      key(box()!, "Enter");
      expect(box()).toBeNull();
      expect(invoked).toEqual([{ type: "onNodeTextChanged", data: { id: "node1", text: "Initialx" } }]);
      expect(broadcasts).toEqual([{ type: "onNodeTextChanged", data: { id: "node1", text: "Initialx" } }]);
    });

    it("Escape discards what was typed", () => {
      const editor = new Editor(mockNode);
      editor.startInline({ caret: "end", insert: "x" });
      key(box()!, "Escape");
      expect(editor.isInlineEditing()).toBe(false);
      expect(broadcasts).toEqual([]);
      expect(mockNode.textElement.show).toHaveBeenCalled();
    });

    it("ignores the auto-repeat of a key that was already held when it opened", () => {
      const editor = new Editor(mockNode);
      mockNode.options.text = "";
      editor.startInline({ caret: "end" });
      const held = key(box()!, "Enter", { repeat: true });
      const heldSpace = key(box()!, " ", { repeat: true });
      expect(held.defaultPrevented).toBe(true);
      expect(heldSpace.defaultPrevented).toBe(true);
      expect(editor.isInlineEditing()).toBe(true);
      // Once released and pressed again it is an ordinary Enter.
      key(box()!, "Enter", {}, "keyup");
      key(box()!, "Enter");
      expect(editor.isInlineEditing()).toBe(false);
    });

    it("lets the key that started a type-to-edit keep repeating, and keys pressed inside repeat normally", () => {
      new Editor(mockNode).startInline({ caret: "end", insert: "x", heldKey: "x" });
      expect(key(box()!, "x", { repeat: true }).defaultPrevented).toBe(false);
      expect(key(box()!, "y").defaultPrevented).toBe(false);
      expect(key(box()!, "y", { repeat: true }).defaultPrevented).toBe(false);
    });

    it("keeps its keys and presses away from the canvas underneath", () => {
      new Editor(mockNode).startInline();
      const seen: string[] = [];
      for (const type of ["keydown", "pointerdown", "mousedown", "touchstart"]) {
        group.addEventListener(type, () => seen.push(type));
      }
      key(box()!, "Delete");
      for (const type of ["pointerdown", "mousedown", "touchstart"]) {
        box()!.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }));
      }
      expect(seen).toEqual([]);
    });

    it("returns focus to the note after Enter or Escape when the note had it", () => {
      const editor = new Editor(mockNode);
      group.focus();
      editor.startInline();
      key(box()!, "Enter");
      expect(document.activeElement).toBe(group);
      editor.startInline();
      key(box()!, "Escape");
      expect(document.activeElement).toBe(group);
    });

    it("leaves focus alone after a pointer-started edit, unless asked to return it", () => {
      const editor = new Editor(mockNode);
      (document.activeElement as HTMLElement | null)?.blur?.();
      editor.startInline();
      key(box()!, "Enter");
      expect(document.activeElement).not.toBe(group);

      editor.startInline({ returnFocus: true });
      key(box()!, "Enter");
      expect(document.activeElement).toBe(group);
    });

    it("commits on blur without pulling focus back", () => {
      const editor = new Editor(mockNode);
      group.focus();
      editor.startInline({ caret: "end", insert: "!" });
      const elsewhere = document.createElement("input");
      document.body.appendChild(elsewhere);
      elsewhere.focus();
      expect(editor.isInlineEditing()).toBe(false);
      expect(broadcasts).toEqual([{ type: "onNodeTextChanged", data: { id: "node1", text: "Initial!" } }]);
      expect(document.activeElement).toBe(elsewhere);
      elsewhere.remove();
    });

    it("does not open on artwork", () => {
      mockNode.nestedSvg = {};
      expect(new Editor(mockNode).startInline({ caret: "end", insert: "x" })).toBe(false);
      expect(box()).toBeNull();
    });
  });
});
