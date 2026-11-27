// update_slate's background takes a gradient at an angle and a picture (cover, contain or tiled,
// dimmed), checked as strictly as a color: an https address or a file this app stored, never
// another scheme. A slate that wears a style keeps the background in the style's record.
import { describe, expect, it } from "vitest";
import { applyPlanToJSON, readSlate, validatePlan, describeOperations } from "../../../src/operations";
import { backgroundOf, checkBackground, checkStyle, isPictureUrl } from "../../../src/operations/keys/slate";
import { packagesForOperation } from "../../../src/core/SlateOperations";
import { DEFAULT_FONTS } from "../../../src/operations/contract";

function slate(options: Record<string, any> = {}) {
  return {
    _id: "s1",
    shareId: "share",
    options: { name: "Demo", containerStyle: { backgroundColor: "#ffffff" }, ...options },
    nodes: [{ options: { id: "a", text: "Alpha", xPos: 0, yPos: 0, width: 200, height: 100 }, relationships: { associations: [] as any[] } }],
  };
}
const plan = (background: unknown) => ({ message: "Done.", operations: [{ kind: "update_slate", changes: { background } }] }) as any;
const picture = { color: "#102030", picture: { url: "https://images.example.com/a.jpg", fit: "contain", dim: 0.35 } };

describe("background picture and gradient angle", () => {
  it("stores a picture in the fields the canvas paints, and a color takes it away", () => {
    const out = applyPlanToJSON(slate(), plan(picture), { userMessage: "a picture background" }).slate;
    expect(out.options.containerStyle).toMatchObject({ backgroundColor: "#102030", backgroundColorAsGradient: false, backgroundImage: "https://images.example.com/a.jpg", backgroundSize: "contain", backgroundDim: 0.35 });
    expect(readSlate(out).background).toEqual(picture);
    const plain = applyPlanToJSON(out, plan({ color: "#ffffff" }), { userMessage: "a white background" }).slate.options.containerStyle;
    expect(plain.backgroundImage).toBeUndefined();
    expect(plain.backgroundDim).toBeUndefined();
  });

  it("stores a gradient's angle and reads it back", () => {
    const gradient = { color: "#111111", gradient: { type: "linear", colors: ["#111111", "#444444", "#777777"], angle: 135 } };
    const out = applyPlanToJSON(slate(), plan(gradient), { userMessage: "a gradient" }).slate;
    expect(out.options.containerStyle).toMatchObject({ backgroundColorAsGradient: true, backgroundGradientAngle: 135, backgroundGradientStrategy: "diagonal" });
    expect(out.options.containerStyle.backgroundImage).toBeUndefined();
    expect(backgroundOf(out.options.containerStyle)).toEqual({ ...gradient, gradient: { ...gradient.gradient, direction: "diagonal" } });
  });

  it("refuses bad pictures, angles and a gradient with a picture", () => {
    for (const url of ["http://e.com/a.jpg", "javascript:alert(1)", "data:image/png;base64,AAAA", "//evil.com/a.jpg", "/files/../secret", "https://e.com/a.jpg)", 'https://e.com/a"b', "files/a.png", "", "https://e.com/" + "a".repeat(2001)]) {
      expect(isPictureUrl(url), url).toBe(false);
      expect(validatePlan(plan({ color: "#000000", picture: { url } })).valid, url).toBe(false);
    }
    for (const url of ["https://images.example.com/a.jpg?w=1200&q=80", "/files/u1/abc.png", "/sbimages/abc.jpg"]) expect(isPictureUrl(url), url).toBe(true);
    expect(checkBackground({ color: "#000000", picture: { url: "/files/a.png", fit: "stretch" } }, "b").join(" ")).toMatch(/fit must be one of/);
    expect(checkBackground({ color: "#000000", picture: { url: "/files/a.png", dim: 0.9 } }, "b").join(" ")).toMatch(/dim must be a number from 0 to 0.8/);
    expect(checkBackground({ color: "#000000", picture: { url: "/files/a.png", size: "cover" } }, "b").join(" ")).toMatch(/unknown field: size/);
    expect(checkBackground({ color: "#000000", gradient: { type: "linear", colors: ["#000000", "#ffffff"], angle: 360 } }, "b").join(" ")).toMatch(/angle must be a whole number/);
    expect(checkBackground({ color: "#000000", gradient: { type: "linear", colors: ["#000000", "#ffffff"] }, picture: { url: "/files/a.png" } }, "b").join(" ")).toMatch(/not both/);
  });

  it("a worn style keeps the background in its record: bg and background", () => {
    const worn = slate({ style: { id: "neon", v: 4, overrides: { palette: ["#ff2bd6", "#00e5ff", "#7a5cff"] } } });
    const out = applyPlanToJSON(worn, plan(picture), { userMessage: "make the background a picture" }).slate;
    expect(out.options.style).toEqual({ id: "neon", v: 4, overrides: { palette: ["#ff2bd6", "#00e5ff", "#7a5cff"], bg: "#102030", background: { picture: picture.picture } } });
    const back = applyPlanToJSON(out, plan({ color: "#0b0016" }), { userMessage: "change the background color" }).slate;
    expect(back.options.style.overrides).toEqual({ palette: ["#ff2bd6", "#00e5ff", "#7a5cff"], bg: "#0b0016" });
    // A slate that wears no style gets no record.
    expect(applyPlanToJSON(slate(), plan(picture), { userMessage: "make the background a picture" }).slate.options.style).toBeUndefined();
  });

  it("the style record accepts the background beside bg, checked the same way", () => {
    expect(checkStyle({ id: "neon", overrides: { bg: "#000000", background: { gradient: { type: "radial", colors: ["#000000", "#ffffff"] } } } }, "s", DEFAULT_FONTS)).toEqual([]);
    expect(checkStyle({ id: "neon", overrides: { bg: "#000000", background: { picture: { url: "/files/a.png", fit: "repeat", dim: 0.2 } } } }, "s", DEFAULT_FONTS)).toEqual([]);
    expect(checkStyle({ id: "neon", overrides: { background: { picture: { url: "http://e.com/a.png" } } } }, "s", DEFAULT_FONTS).join(" ")).toMatch(/https address/);
    expect(checkStyle({ id: "neon", overrides: { background: { gradient: { type: "linear", colors: ["#000000", "#ffffff"] }, picture: { url: "/files/a.png" } } } }, "s", DEFAULT_FONTS).join(" ")).toMatch(/\{gradient\} or \{picture\}/);
    expect(checkStyle({ id: "neon", overrides: { background: "red" } }, "s", DEFAULT_FONTS).length).toBe(1);
  });

  it("the live package carries the picture and the angle to the canvas", () => {
    const before = slate();
    const operation = plan(picture).operations[0];
    const after = applyPlanToJSON(before, plan(picture), { userMessage: "make the background a picture" }).slate;
    const [pkg] = packagesForOperation(operation, before as any, after as any);
    expect(pkg).toMatchObject({ type: "onSlateBackgroundColorChanged", data: { color: "#102030", image: "https://images.example.com/a.jpg", size: "contain", dim: 0.35 } });
    expect(pkg.data.style).toBeUndefined();
  });

  it("on a slate that wears a style, the live package carries the style record too, so other copies keep the same one", () => {
    const worn = slate({ style: { id: "neon", v: 4 } });
    const operation = plan(picture).operations[0];
    const after = applyPlanToJSON(worn, plan(picture), { userMessage: "make the background a picture" }).slate;
    const [pkg] = packagesForOperation(operation, worn as any, after as any);
    expect(pkg.data.style).toEqual({ id: "neon", v: 4, overrides: { bg: "#102030", background: { picture: picture.picture } } });
  });

  it("is described for agents", () => {
    const described = describeOperations() as any;
    expect(described.slateKeys.background.properties.picture.properties.fit.enum).toEqual(["cover", "contain", "repeat"]);
    expect(described.slateKeys.background.properties.gradient.properties.angle.maximum).toBe(359);
    expect(described.slateKeys.style.properties.overrides.properties.background.properties.picture.required).toEqual(["url"]);
  });
});
