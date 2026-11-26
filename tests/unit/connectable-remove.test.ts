import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { SVG } from "@svgdotjs/svg.js";
import "../../src/vendor/svg-connectable/svg.connectable.js";

// Review (2026-11-25): con.remove() took a line's path, hit area and end handles down but not
// its arrowheads. createMarker returns { element, id, size } (no .remove()), so remove() calling
// rm(con.markerSource) did nothing and every line left its <marker> in <defs>: one more set per
// whole-slate replace (27 lines, 5 replaces: 27 -> 405 markers). jsdom has no layout, so the
// notes' boxes are a fixed 50x50.
const proto = (window as any).Element.prototype;
const hadBBox = Object.prototype.hasOwnProperty.call(proto, "getBBox");
const realBBox = proto.getBBox;

describe("svg.connectable con.remove()", () => {
  let draw: any;
  let markers: any;
  let lines: any;

  beforeEach(() => {
    proto.getBBox = function () {
      return { x: 0, y: 0, width: 50, height: 50 };
    };
    draw = SVG().addTo(document.body).size(800, 600);
    lines = draw.group();
    markers = draw.group();
  });

  afterEach(() => {
    draw.remove();
    if (hadBBox) proto.getBBox = realBBox;
    else delete proto.getBBox;
  });

  const note = (x: number) => {
    const g = draw.group();
    g.rect(50, 50).move(x, 0);
    return g;
  };
  const count = () => ({
    markers: document.querySelectorAll("marker").length,
    // The line's own path and hit area (an arrowhead's path is inside its <marker>).
    paths: [...document.querySelectorAll("path")].filter((p) => !p.closest("marker")).length,
    handles: document.querySelectorAll(".connector-handle").length,
  });

  it("takes the line's arrowheads out of <defs> with it (one end and both ends)", () => {
    const a = note(0);
    const b = note(300);
    const c = note(600);
    const before = count();
    const one = a.connectable({ container: lines, markers }, b);
    const both = b.connectable({ container: lines, markers, markerSource: "default", markerTarget: "default" }, c);
    expect(count().markers - before.markers).toBe(3);
    one.remove();
    expect(count().markers - before.markers).toBe(2);
    both.remove();
    expect(count()).toEqual(before);
  });

  it("keeps the marker count flat over many draw-and-remove rounds (a replace, again and again)", () => {
    const a = note(0);
    const b = note(300);
    const before = count();
    for (let round = 0; round < 5; round++) {
      const cons = [0, 1, 2].map(() => a.connectable({ container: lines, markers }, b));
      expect(count().markers - before.markers).toBe(3);
      for (const con of cons) con.remove();
      expect(count()).toEqual(before);
    }
  });

  it("removes the arrowhead a width or color change made, not the first one", () => {
    const a = note(0);
    const b = note(300);
    const before = count();
    const con = a.connectable({ container: lines, markers }, b);
    con.setConnectorColor?.("#ff0000");
    con.setStrokeWidth?.(6);
    expect(count().markers - before.markers).toBe(1);
    con.remove();
    expect(count().markers).toBe(before.markers);
  });
});
