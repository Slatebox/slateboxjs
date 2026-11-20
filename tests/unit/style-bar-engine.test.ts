import { describe, it, expect, vi, beforeEach } from "vitest";
import { Invoker } from "../../src/core/Invoker";
import { v1AssociationToV2, v2AssociationToV1, v1NodeToV2, v2NodeToV1 } from "../../src/core/compat";
import { lineDashArray } from "../../src/core/Connector";

// The engine pieces the app's style bar needs: dashed lines and bold text, carried
// through the same packages, records and conversions as every other style.

describe("line dash", () => {
  it("maps solid, dashed and dotted to a dash pattern scaled by the line's width", () => {
    expect(lineDashArray("solid", 3)).toBeNull();
    expect(lineDashArray(undefined, 3)).toBeNull();
    expect(lineDashArray("", 3)).toBeNull();
    expect(lineDashArray("dashed", 3)).toBe("12 9");
    expect(lineDashArray("dotted", 3)).toBe("0.1 7.5");
    // A thicker line gets longer dashes, so the pattern still reads as dashes.
    expect(lineDashArray("dashed", 8)).toBe("32 24");
    // An unknown value draws a solid line rather than something unexpected.
    expect(lineDashArray("zigzag" as any, 3)).toBeNull();
  });

  it("survives the v1 <-> v2 association conversion, and defaults to solid", () => {
    const v2 = v1AssociationToV2({ parentId: "a", childId: "b", lineDash: "dotted" });
    expect(v2.lineDash).toBe("dotted");
    expect(v2AssociationToV1(v2).lineDash).toBe("dotted");
    expect(v1AssociationToV2({ parentId: "a", childId: "b" }).lineDash).toBe("solid");
  });
});

describe("bold text", () => {
  it("survives the v1 <-> v2 node conversion", () => {
    expect(v1NodeToV2({ id: "n", fontWeight: "bold" }).fontWeight).toBe("bold");
    expect(v2NodeToV1({ id: "n", fontWeight: "bold" } as any).fontWeight).toBe("bold");
  });
});

describe("Invoker carries the new styles", () => {
  let node: any;
  let invoker: Invoker;
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    node = {
      id: "n1",
      options: { fontSize: 14, fontWeight: "normal", text: "Hi" },
      setText: vi.fn(),
      applyTextStyle: vi.fn(),
      relationships: { applyLineProperty: vi.fn() },
    };
    const slate: any = { nodes: { one: vi.fn(() => node) } };
    invoker = new Invoker(slate);
  });

  it("onNodeTextChanged sets fontWeight and redraws, and leaves it alone when absent", () => {
    invoker.onNodeTextChanged({ type: "onNodeTextChanged", data: { id: "n1", fontWeight: "bold" } } as any);
    expect(node.options.fontWeight).toBe("bold");
    expect(node.applyTextStyle).toHaveBeenCalled();
    invoker.onNodeTextChanged({ type: "onNodeTextChanged", data: { id: "n1", fontSize: 18 } } as any);
    expect(node.options.fontWeight).toBe("bold");
    expect(node.setText).not.toHaveBeenCalled();
  });

  it("onLinePropertiesChanged passes lineDash to the association", () => {
    invoker.onLinePropertiesChanged({
      type: "onLinePropertiesChanged",
      data: { id: "n1", associationId: "n1->n2", prop: "lineDash", val: "dashed" },
    } as any);
    expect(node.relationships.applyLineProperty).toHaveBeenCalledWith("n1->n2", "lineDash", "dashed");
  });
});

import { loadFont } from "../../src/core/FontLoader";

describe("fonts the host serves itself", () => {
  it("are loaded from the host's own @font-face, never from Google Fonts", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const appended = vi.spyOn(document.head, "appendChild");
    const load = vi.fn(async () => []);
    // jsdom has no FontFaceSet: stand in for one that knows the host's face.
    (document as any).fonts = {
      check: () => false,
      load,
      forEach: (fn: (face: any) => void) => [{ family: '"Lora"' }, { family: "Caveat" }].forEach(fn),
    };
    try {
      await loadFont("Lora, serif");
      await loadFont("Caveat");
      expect(load).toHaveBeenCalledWith('12px "Lora"');
      expect(load).toHaveBeenCalledWith('12px "Caveat"');
      expect(appended).not.toHaveBeenCalled();
    } finally {
      delete (document as any).fonts;
      appended.mockRestore();
    }
  });
});
