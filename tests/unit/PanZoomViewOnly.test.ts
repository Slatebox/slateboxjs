// A view-only slate (slate.isReadOnly()) moves no note, so a finger pans wherever it starts, on a
// note too, and the main mouse button pans as well. Editing keeps the usual split: a finger on empty
// canvas pans, a finger on a note moves the note, a mouse draws the selection rectangle.
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@svgdotjs/svg.panzoom.js", () => ({}));

import { PanZoom } from "../../src/core/PanZoom";

function makeSlate(readOnly: () => boolean) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  document.body.appendChild(node);
  node.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, width: 1000, height: 800, right: 1000, bottom: 800, toJSON() {} }) as DOMRect;
  const note = document.createElementNS("http://www.w3.org/2000/svg", "g");
  node.appendChild(note);
  let vb = { x: 0, y: 0, width: 1000, height: 800 };
  const dispatched: string[] = [];
  const canvas = {
    node,
    panZoom: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    viewbox: vi.fn((...args: number[]) => {
      if (args.length) {
        vb = { x: args[0], y: args[1], width: args[2], height: args[3] };
        return canvas;
      }
      return { ...vb };
    }),
    dispatch: vi.fn((type: string) => {
      dispatched.push(type);
      return { defaultPrevented: false };
    }),
  };
  return {
    slate: { canvas, element: document.createElement("div"), isReadOnly: vi.fn(readOnly) },
    node,
    note,
    dispatched,
    box: () => vb,
  };
}

function touch(type: string, target: EventTarget, points: Array<[number, number]>) {
  const ev = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(ev, "touches", { value: points.map(([clientX, clientY]) => ({ clientX, clientY, identifier: 1 })) });
  target.dispatchEvent(ev);
  return ev;
}

function mouse(type: string, target: EventTarget, x: number, y: number, button = 0) {
  const ev = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button });
  target.dispatchEvent(ev);
  return ev;
}

describe("PanZoom on a view-only slate", () => {
  let made: PanZoom[] = [];
  const panZoom = (slate: any) => {
    const pz = new PanZoom(slate);
    made.push(pz);
    return pz;
  };
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    for (const pz of made) pz.destroy();
    made = [];
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("a finger that starts on a note pans the canvas", () => {
    const t = makeSlate(() => true);
    panZoom(t.slate);
    touch("touchstart", t.note, [[100, 100]]);
    const move = touch("touchmove", document, [[60, 70]]);
    touch("touchend", document, []);
    expect(t.box()).toMatchObject({ x: 40, y: 30, width: 1000, height: 800 });
    expect(move.defaultPrevented).toBe(true);
    expect(t.dispatched).toEqual(["panStart", "panning", "panEnd"]);
  });

  it("on an editable slate a finger on a note leaves the canvas still (the note moves instead)", () => {
    const t = makeSlate(() => false);
    panZoom(t.slate);
    touch("touchstart", t.note, [[100, 100]]);
    touch("touchmove", document, [[60, 70]]);
    expect(t.box()).toMatchObject({ x: 0, y: 0 });
    // A finger on empty canvas still pans there.
    touch("touchend", document, []);
    touch("touchstart", t.node, [[100, 100]]);
    touch("touchmove", document, [[60, 70]]);
    expect(t.box()).toMatchObject({ x: 40, y: 30 });
  });

  it("the main mouse button pans a view-only slate, from a note or empty canvas", () => {
    const t = makeSlate(() => true);
    panZoom(t.slate);
    mouse("mousedown", t.note, 200, 200);
    mouse("mousemove", document, 150, 190);
    mouse("mouseup", document, 150, 190);
    expect(t.box()).toMatchObject({ x: 50, y: 10 });
    mouse("mousedown", t.node, 200, 200);
    mouse("mousemove", document, 210, 220);
    mouse("mouseup", document, 210, 220);
    expect(t.box()).toMatchObject({ x: 40, y: -10 });
    expect(t.dispatched.filter((d) => d === "panEnd")).toHaveLength(2);
  });

  it("a click that barely moves stays a click, and other buttons are left alone", () => {
    const t = makeSlate(() => true);
    panZoom(t.slate);
    mouse("mousedown", t.note, 200, 200);
    mouse("mousemove", document, 201, 202);
    mouse("mouseup", document, 201, 202);
    mouse("mousedown", t.node, 200, 200, 1);
    mouse("mousemove", document, 100, 100);
    mouse("mouseup", document, 100, 100);
    expect(t.box()).toMatchObject({ x: 0, y: 0 });
    expect(t.dispatched).toEqual([]);
  });

  it("an editable slate keeps the mouse for selecting", () => {
    const t = makeSlate(() => false);
    panZoom(t.slate);
    mouse("mousedown", t.node, 200, 200);
    mouse("mousemove", document, 100, 100);
    mouse("mouseup", document, 100, 100);
    expect(t.box()).toMatchObject({ x: 0, y: 0 });
  });

  it("checks read-only per gesture", () => {
    let readOnly = false;
    const t = makeSlate(() => readOnly);
    panZoom(t.slate);
    mouse("mousedown", t.node, 100, 100);
    mouse("mousemove", document, 50, 50);
    mouse("mouseup", document, 50, 50);
    expect(t.box()).toMatchObject({ x: 0, y: 0 });
    readOnly = true;
    mouse("mousedown", t.node, 100, 100);
    mouse("mousemove", document, 50, 50);
    mouse("mouseup", document, 50, 50);
    expect(t.box()).toMatchObject({ x: 50, y: 50 });
  });

  it("does not pan when panning is off, and stops listening on destroy", () => {
    const off = makeSlate(() => true);
    panZoom({ ...off.slate }).disablePan();
    mouse("mousedown", off.node, 100, 100);
    mouse("mousemove", document, 0, 0);
    mouse("mouseup", document, 0, 0);
    expect(off.box()).toMatchObject({ x: 0, y: 0 });

    const t = makeSlate(() => true);
    const pz = new PanZoom(t.slate);
    pz.destroy();
    mouse("mousedown", t.node, 100, 100);
    mouse("mousemove", document, 0, 0);
    touch("touchstart", t.note, [[100, 100]]);
    touch("touchmove", document, [[0, 0]]);
    expect(t.box()).toMatchObject({ x: 0, y: 0 });
  });
});
