// The CSS a slate's background paints (Slate.applyContainerStyle): a color, a gradient at an
// angle or radial, or a picture that covers, fits or tiles, with the color laid over it (dim).
import { describe, expect, it } from "vitest";
import { containerBackground, cssUrl } from "../../src/core/containerBackground";
import { Slate } from "../../src/core/Slate";

describe("containerBackground", () => {
  it("a color paints no image", () => {
    expect(containerBackground({ backgroundColor: "#102030" })).toEqual({ image: "", size: "", repeat: "", position: "" });
    expect(containerBackground(null).image).toBe("");
    expect(containerBackground({ backgroundColor: "#fff", backgroundImage: "none" }).image).toBe("");
  });

  it("a gradient saved before angles still runs top to bottom; a new one keeps its angle; radial is a circle", () => {
    const old = { backgroundColorAsGradient: true, backgroundGradientType: "linear", backgroundGradientColors: ["#111111", "#333333"], backgroundGradientStrategy: "horizontal" };
    expect(containerBackground(old).image).toBe("linear-gradient(#111111, #333333)");
    expect(containerBackground({ ...old, backgroundGradientColors: ["#111111", "#222222", "#333333"], backgroundGradientAngle: 135 }).image).toBe("linear-gradient(135deg, #111111, #222222, #333333)");
    expect(containerBackground({ ...old, backgroundGradientType: "radial", backgroundGradientAngle: 135 }).image).toBe("radial-gradient(circle, #111111, #333333)");
    // One stop is not a gradient.
    expect(containerBackground({ ...old, backgroundGradientColors: ["#111111"] }).image).toBe("");
  });

  it("a gradient stop that is not a color is left out, so no stop can add a url() or another layer", () => {
    const cs = { backgroundColorAsGradient: true, backgroundGradientColors: ["#111111", "red), url(http://evil.example/x.png", "rgba(0, 0, 0, 0.5) 50%", "expression(alert(1))", " #333333 "] };
    expect(containerBackground(cs).image).toBe("linear-gradient(#111111, rgba(0, 0, 0, 0.5) 50%, #333333)");
    // Fewer than two colors left: no gradient at all.
    expect(containerBackground({ ...cs, backgroundGradientColors: ["#111111", "url(x)"] }).image).toBe("");
  });

  it("a gradient wins over a picture stored beside it, as it always did", () => {
    const both = { backgroundColorAsGradient: true, backgroundGradientColors: ["#111111", "#333333"], backgroundImage: "https://example.com/a.jpg" };
    expect(containerBackground(both).image).toContain("gradient");
    expect(containerBackground(both).image).not.toContain("url(");
  });

  it("a picture covers, fits or tiles, centered", () => {
    const at = (fit?: string) => containerBackground({ backgroundColor: "#000000", backgroundImage: "https://example.com/a.jpg", backgroundSize: fit });
    expect(at("cover")).toEqual({ image: 'url("https://example.com/a.jpg")', size: "cover", repeat: "no-repeat", position: "center" });
    expect(at("contain")).toMatchObject({ size: "contain", repeat: "no-repeat" });
    expect(at("repeat")).toMatchObject({ size: "auto", repeat: "repeat" });
    expect(at(undefined)).toMatchObject({ size: "cover" });
  });

  it("dim lays the slate's color over the picture, at most 0.8", () => {
    const out = containerBackground({ backgroundColor: "#0b0016", backgroundImage: "/files/u1/a.png", backgroundSize: "contain", backgroundDim: 0.4 });
    expect(out.image).toBe('linear-gradient(rgba(11, 0, 22, 0.4), rgba(11, 0, 22, 0.4)), url("/files/u1/a.png")');
    expect(out.size).toBe("100% 100%, contain");
    expect(out.repeat).toBe("no-repeat, no-repeat");
    expect(containerBackground({ backgroundColor: "#ffffff", backgroundImage: "/a.png", backgroundDim: 5 }).image).toContain("rgba(255, 255, 255, 0.8)");
  });

  it("a stored address can never end the url()", () => {
    expect(cssUrl('https://e.com/a")b')).toBe('url("https://e.com/a\\22 )b")');
    expect(cssUrl("https://e.com/a\\b")).toBe('url("https://e.com/a\\5c b")');
  });

  it("applyContainerStyle paints the container and clears what the last background left", () => {
    const element = document.createElement("div");
    const host: any = { element, options: { containerStyle: { backgroundColor: "#123456", backgroundImage: "https://example.com/a.jpg", backgroundSize: "repeat" } } };
    Slate.prototype.applyContainerStyle.call(host);
    expect(element.style.backgroundImage).toContain("example.com/a.jpg");
    expect(element.style.backgroundRepeat).toBe("repeat");
    host.options.containerStyle = { backgroundColor: "#654321" };
    Slate.prototype.applyContainerStyle.call(host);
    expect(element.style.backgroundImage).toBe("");
    expect(element.style.backgroundRepeat).toBe("");
    expect(element.style.backgroundSize).toBe("");
  });
});
