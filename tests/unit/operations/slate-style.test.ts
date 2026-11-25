// The slate's style record (SLATE_KEYS.style): what a slate wears, checked and stored as one slate
// option. The look itself is the host's (its notes, its background); the engine checks the record.
import { describe, expect, it } from "vitest";
import { applyPlanToJSON, describeOperations, readSlate, toSlateDocument, validatePlan, SLATE_KEYS } from "../../../src/operations";
import { checkStyle } from "../../../src/operations/keys/slate";
import { DEFAULT_FONTS } from "../../../src/operations/contract";

function slate() {
  return {
    _id: "s1",
    shareId: "share",
    options: { name: "Demo", containerStyle: { backgroundColor: "#ffffff" } },
    nodes: [{ options: { id: "a", text: "Alpha", xPos: 0, yPos: 0, width: 200, height: 100 }, relationships: { associations: [] as any[] } }],
  };
}
const plan = (style: unknown) => ({ message: "wear", operations: [{ kind: "update_slate", changes: { style } }] }) as any;

describe("slate style record", () => {
  it("is a slate key and the presentation styles' fonts are offered", () => {
    expect(Object.keys(SLATE_KEYS)).toContain("style");
    for (const font of ["Anton", "Space Grotesk", "Fraunces", "Inter", "Caveat", "IBM Plex Mono", "Abril Fatface", "PT Sans"]) {
      expect(DEFAULT_FONTS).toContain(font);
    }
  });

  it("accepts a known shape and stores it on options.style", () => {
    const value = { id: "neon", v: 4, overrides: { bg: "#0b0016", palette: ["#ff2bd6", "#00e5ff-#7a5cff"], fonts: { display: "Anton", body: "Inter" } } };
    expect(validatePlan(plan(value)).errors).toEqual([]);
    const out = applyPlanToJSON(slate(), plan(value)).slate;
    expect(out.options.style).toEqual(value);
  });

  it("null takes the style off", () => {
    const worn = { ...slate(), options: { ...slate().options, style: { id: "neon", v: 4 } } };
    expect(validatePlan(plan(null)).errors).toEqual([]);
    expect(applyPlanToJSON(worn, plan(null)).slate.options.style).toBeUndefined();
  });

  it("refuses records that are not a style", () => {
    const fonts = DEFAULT_FONTS;
    expect(checkStyle("neon", "style", fonts)).not.toEqual([]);
    expect(checkStyle({}, "style", fonts).join(" ")).toMatch(/id must be a style name/);
    expect(checkStyle({ id: "Neon!" }, "style", fonts).join(" ")).toMatch(/id must be a style name/);
    expect(checkStyle({ id: "neon", theme: 1 }, "style", fonts).join(" ")).toMatch(/unknown field: theme/);
    expect(checkStyle({ id: "neon", overrides: { bg: "not a colour<" } }, "style", fonts).length).toBe(1);
    expect(checkStyle({ id: "neon", overrides: { palette: [] } }, "style", fonts).join(" ")).toMatch(/1 to 12/);
    expect(checkStyle({ id: "neon", overrides: { palette: ["#fff-#000-#111"] } }, "style", fonts).join(" ")).toMatch(/from-to/);
    expect(checkStyle({ id: "neon", overrides: { fonts: { display: "Comic Sans" } } }, "style", fonts).join(" ")).toMatch(/font this instance offers/);
    expect(checkStyle({ id: "neon", v: 0 }, "style", fonts).join(" ")).toMatch(/whole number/);
    expect(validatePlan(plan({ id: 7 })).valid).toBe(false);
  });

  it("is in the document an agent reads, and in the described schema", () => {
    const worn = { ...slate(), options: { ...slate().options, style: { id: "blueprint", v: 4 } } };
    expect(toSlateDocument(worn).options.style).toEqual({ id: "blueprint", v: 4 });
    expect(readSlate(worn).style).toEqual({ id: "blueprint", v: 4 });
    expect(readSlate(slate()).style).toBeNull();
    const described = describeOperations() as any;
    expect(described.slateKeys.style.properties.id.pattern).toBe("^[a-z][a-z-]{0,39}$");
  });

  it("a note the style added reads with its role", () => {
    const s = slate();
    (s.nodes[0].options as any).styleRole = "title";
    const read = readSlate(s, { fields: ["styleRole"] }) as any;
    expect(read.nodes[0].styleRole).toBe("title");
  });
});
