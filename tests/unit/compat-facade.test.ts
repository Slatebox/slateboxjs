// ---------------------------------------------------------------------------
// compat-facade — v1 runtime API facade tests
//
// Proves the §A/§B(partial)/§C(partial) items of docs/drop-in-contract.md:
// the `Slatebox` namespace shape, `new Slatebox.slate(options, events).init()`
// semantics (container-by-id resolution, async init resolving to the slate),
// the standalone `Slatebox.node` wrapper, and the v1 `slate.nodes` surface
// (add/addRange/one/allNodes) mapping v1 options onto the v2 engine.
//
// The v2 Slate class is mocked — these tests exercise the facade layer only.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mock the v2 Slate module. The facade should hand it (element, options) and
// await getViewportAsync().
// ---------------------------------------------------------------------------
const mockV2NodesManager = (slateRef?: any) => {
  const store = new Map<string, any>();
  return {
    store,
    add: vi.fn((options: any) => {
      const associations: any[] = [];
      const v2node = {
        id: options.id,
        options,
        slate: slateRef,
        setSize: vi.fn((w: number, h: number) => {
          options.width = w;
          options.height = h;
        }),
        relationships: {
          addAssociation: vi.fn((childV2: any, data?: any) => {
            const assoc = {
              id: `${options.id}-${childV2.id}`,
              parentId: options.id,
              childId: childV2.id,
              lineWidth: data?.lineWidth ?? 6,
              ...data,
            };
            associations.push(assoc);
            return assoc;
          }),
          getAssociations: vi.fn(() => associations),
        },
      };
      store.set(options.id, v2node);
      return v2node;
    }),
    one: vi.fn((id: string) => store.get(id)),
    get allNodes() {
      return Array.from(store.values());
    },
  };
};

const slateInstances: any[] = [];

vi.mock("../../src/core/Slate", () => {
  class MockSlate {
    element: any;
    options: any;
    nodes: any;
    exportJSON = vi.fn(() => '{"options":{},"nodes":[]}');
    loadJSON = vi.fn(async () => undefined);
    getViewportAsync = vi.fn(async () => ({ mockViewport: true }));
    addNode = vi.fn((options: any) => this.nodes.add(options));
    fitToContent = vi.fn();
    centerContent = vi.fn();
    emitSlateChange = vi.fn();
    getOrientation = vi.fn(() => ({
      orientation: "landscape",
      width: 420,
      height: 170,
      left: 90,
      top: 90,
    }));
    applyLayout = vi.fn((_moves: any[], cb?: () => void) => cb?.());
    png = vi.fn(async (_opts?: any, cb?: (r: any) => void) => {
      cb?.("png-blob");
      return "png-blob";
    });
    svg = vi.fn((_opts?: any, cb?: (r: string) => void) => {
      cb?.("<svg/>");
      return "<svg/>";
    });
    collab = {
      exe: vi.fn(),
      invoke: vi.fn(),
      send: vi.fn(),
      updateUserData: vi.fn(),
    };
    keyboard = { bindGlobal: vi.fn(), unbindGlobal: vi.fn() };
    undoRedo = { undo: vi.fn(), redo: vi.fn() };
    birdsEye = { enable: vi.fn(), disable: vi.fn() };
    enablePanZoom = vi.fn();
    disablePanZoom = vi.fn();
    getZoom = vi.fn(() => 1);
    constructor(element: any, options: any) {
      this.element = element;
      this.options = options;
      this.nodes = mockV2NodesManager(this);
      slateInstances.push(this);
    }
  }
  return { Slate: MockSlate };
});

import { Slatebox } from "../../src/compat-facade";
import * as utils from "../../src/utils";

beforeEach(() => {
  document.body.innerHTML = "";
  slateInstances.length = 0;
  vi.clearAllMocks();
});

const makeContainer = (id = "slateCanvas") => {
  const div = document.createElement("div");
  div.id = id;
  document.body.appendChild(div);
  return div;
};

// ---------------------------------------------------------------------------
// §A — namespace shape
// ---------------------------------------------------------------------------
describe("Slatebox namespace (§A)", () => {
  it("exposes slate, node, base, and utils", () => {
    expect(typeof Slatebox.slate).toBe("function");
    expect(typeof Slatebox.node).toBe("function");
    expect(typeof Slatebox.base).toBe("function");
    expect(Slatebox.utils).toBe(utils);
  });

  it("utils namespace carries the v1 helpers", () => {
    expect(typeof Slatebox.utils.guid).toBe("function");
    expect(typeof Slatebox.utils.randomInt).toBe("function");
    expect(typeof Slatebox.utils.whiteOrBlack).toBe("function");
    expect(typeof Slatebox.utils.createMultiLineText).toBe("function");
    expect(typeof Slatebox.utils.getTextWidth).toBe("function");
    expect(typeof Slatebox.utils.getBBox).toBe("function");
  });

  it("base supports the v1 static plugin registry contract", () => {
    expect(() => (Slatebox.base as any).registerPlugin({})).toThrow(
      /name and a plugin/
    );
    class MyPlugin extends (Slatebox.base as any) {}
    (Slatebox.base as any).registerPlugin({ name: "p1", plugin: MyPlugin });
    // no throw — registry accepts a named plugin class
  });
});

// ---------------------------------------------------------------------------
// §B (partial) — slate constructor + init
// ---------------------------------------------------------------------------
describe("new Slatebox.slate(options, events).init() (§B)", () => {
  it("resolves options.container as a bare element id (v1 semantics)", async () => {
    const el = makeContainer("slateCanvas");
    const s = await new Slatebox.slate(
      { container: "slateCanvas" },
      {}
    ).init();
    expect(s.v2).toBeDefined();
    expect((s.v2 as any).element).toBe(el);
  });

  it("accepts a CSS selector fallback and a direct element", async () => {
    const el = makeContainer("other");
    const bySel = await new Slatebox.slate({ container: "#other" }).init();
    expect((bySel.v2 as any).element).toBe(el);

    const direct = await new Slatebox.slate({ container: el }).init();
    expect((direct.v2 as any).element).toBe(el);
  });

  it("init() resolves to the slate itself and awaits viewport readiness", async () => {
    makeContainer();
    const facade = new Slatebox.slate({ container: "slateCanvas" });
    const s = await facade.init();
    expect(s).toBe(facade);
    expect((s.v2 as any).getViewportAsync).toHaveBeenCalled();
  });

  it("throws when the container is missing or not found", async () => {
    await expect(
      new Slatebox.slate({ container: "nope" }).init()
    ).rejects.toThrow(/not found/);
    await expect(new Slatebox.slate({}).init()).rejects.toThrow(/required/);
  });

  it("passes the v1 events object through to the v2 engine options", async () => {
    makeContainer();
    const events = { onSlateChanged: vi.fn(), isReadOnly: () => false };
    const s = await new Slatebox.slate(
      { container: "slateCanvas" },
      events
    ).init();
    expect((s.v2 as any).options.events).toBe(events);
  });

  it("stores the events object and generates ids/shareId like v1", () => {
    const events = { onSlateChanged: vi.fn() };
    const s = new Slatebox.slate({ container: "x" }, events);
    expect(s.events).toBe(events);
    expect(s.options.id).toBeTruthy();
    expect(s.shareId).toBeTruthy();

    // Regression: hosts pass `id: undefined` explicitly (createSlate.js does
    // `id: newSlate.options?.id`) — the generated guid must survive
    const sUndef = new Slatebox.slate({ container: "x", id: undefined });
    expect(sUndef.options.id).toBeTruthy();
  });

  it("shareId assigned AFTER init reaches v2 options (persistence path)", async () => {
    makeContainer();
    const s = await new Slatebox.slate({ container: "slateCanvas" }).init();
    // createSlate.js: `slate.shareId = newSlate.shareId` post-init
    s.shareId = "route-share-id";
    expect((s.v2 as any).options.shareId).toBe("route-share-id");
    expect(s.shareId).toBe("route-share-id");

    const s2 = new Slatebox.slate({
      container: "x",
      id: "myid",
      shareId: "share-1",
    });
    expect(s2.options.id).toBe("myid");
    expect(s2.shareId).toBe("share-1");
  });

  it("guards methods that require init()", () => {
    const s = new Slatebox.slate({ container: "x" });
    expect(() => s.exportJSON()).toThrow(/init/);
    expect(() => s.nodes.allNodes).toThrow(/init/);
  });
});

// ---------------------------------------------------------------------------
// §C (partial) — nodes facade + JSON I/O
// ---------------------------------------------------------------------------
describe("slate.nodes facade (§C partial)", () => {
  const initSlate = async () => {
    makeContainer();
    return new Slatebox.slate({ container: "slateCanvas" }).init();
  };

  it("add() accepts a v1 node instance and maps v1 options to v2", async () => {
    const s = await initSlate();
    const n = new Slatebox.node({
      id: "n1",
      xPos: 50,
      yPos: 60,
      foregroundColor: "#fff",
      text: "hello",
    });
    const added = s.nodes.add(n);

    expect(added).toBe(n);
    expect(added.v2).toBeDefined();
    expect(added.slate).toBe(s);

    const v2AddArgs = (s.v2 as any).nodes.add.mock.calls[0][0];
    expect(v2AddArgs.x).toBe(50);
    expect(v2AddArgs.y).toBe(60);
    expect(v2AddArgs.fontColor).toBe("#fff");
    expect(v2AddArgs.xPos).toBeUndefined();
    expect(v2AddArgs.foregroundColor).toBeUndefined();
  });

  it("add() also accepts plain options; node ids are preserved or generated", async () => {
    const s = await initSlate();
    const withId = s.nodes.add({ id: "abc", xPos: 1, yPos: 2 });
    expect(withId.options.id).toBe("abc");

    const anon = s.nodes.add(new Slatebox.node({ xPos: 3 }));
    expect(anon.options.id).toBeTruthy();
  });

  it("node.position() exists and never throws (shape-palette add called node.position('center'))", async () => {
    // Standalone (before add): stashes coordinates on options, no throw.
    const standalone = new Slatebox.node({ id: "p1" });
    expect(typeof standalone.position).toBe("function");
    standalone.position({ x: 10, y: 20 });
    expect(standalone.options.x).toBe(10);
    expect(standalone.options.y).toBe(20);

    // After add: 'center' must not throw (the app calls it right after adding a
    // shape; previously node.position wasn't a function and threw).
    const s = await initSlate();
    const n = s.nodes.add(new Slatebox.node({ id: "p2" }));
    expect(() => n.position("center")).not.toThrow();
  });

  it("addRange() adds every node and returns the wrappers", async () => {
    const s = await initSlate();
    const out = s.nodes.addRange([
      new Slatebox.node({ id: "r1" }),
      { id: "r2" },
    ]);
    expect(out).toHaveLength(2);
    expect(s.nodes.allNodes).toHaveLength(2);
  });

  it("one() returns the SAME wrapper instance that add() returned", async () => {
    const s = await initSlate();
    const n = s.nodes.add(new Slatebox.node({ id: "same" }));
    expect(s.nodes.one("same")).toBe(n);
    expect(s.nodes.one("missing")).toBeUndefined();
  });

  it("allNodes lazily wraps nodes created outside the facade (e.g. loadJSON)", async () => {
    const s = await initSlate();
    // Simulate a node the v2 engine created directly
    (s.v2 as any).nodes.store.set("ext", {
      id: "ext",
      options: { id: "ext", x: 9, y: 9 },
    });
    const all = s.nodes.allNodes;
    expect(all).toHaveLength(1);
    expect(all[0].options.id).toBe("ext");
    // Stable identity on repeat access
    expect(s.nodes.one("ext")).toBe(all[0]);
  });

  it("exportJSON()/loadJSON() delegate to the v2 engine", async () => {
    const s = await initSlate();
    const json = s.exportJSON();
    expect(typeof json).toBe("string");
    expect((s.v2 as any).exportJSON).toHaveBeenCalled();

    await s.loadJSON('{"options":{},"nodes":[]}');
    expect((s.v2 as any).loadJSON).toHaveBeenCalledWith(
      '{"options":{},"nodes":[]}'
    );
  });
});

// ---------------------------------------------------------------------------
// §C — slate-level methods: getOrientation, controller, canvas, png
// ---------------------------------------------------------------------------
describe("slate methods (§C)", () => {
  const initSlate = async (options: Record<string, any> = {}) => {
    makeContainer();
    return new Slatebox.slate({ container: "slateCanvas", ...options }).init();
  };

  it("getOrientation() delegates to the engine's v1-shaped implementation", async () => {
    const s = await initSlate();
    const orient = s.getOrientation();
    expect((s.v2 as any).getOrientation).toHaveBeenCalled();
    expect(orient).toMatchObject({
      orientation: "landscape",
      width: 420,
      height: 170,
      left: 90,
      top: 90,
    });
    // The bbox math itself is proven engine-side in Slate.test.ts
  });

  it("controller.scaleToFitAndCenter() fits (which also centers) and calls back", async () => {
    const s = await initSlate();
    const cb = vi.fn();
    s.controller.scaleToFitAndCenter(cb);
    expect((s.v2 as any).fitToContent).toHaveBeenCalled();
    // centerContent() is intentionally NOT called — fitToContent already
    // centers on node bounds; centerContent centers on the origin-
    // contaminated SVG bbox and would yank the view off content.
    expect((s.v2 as any).centerContent).not.toHaveBeenCalled();
    expect(cb).toHaveBeenCalled();
  });

  it("canvas.hideBg() clears the container background", async () => {
    const s = await initSlate();
    const el = (s.v2 as any).element as HTMLElement;
    el.style.backgroundColor = "red";
    s.canvas.hideBg(1);
    expect(el.style.backgroundColor).toBe("transparent");
    expect(el.style.backgroundImage).toBe("none");
  });

  it("png() delegates to the v2 engine with the callback", async () => {
    const s = await initSlate();
    const cb = vi.fn();
    const result = await s.png({ base64: true }, cb);
    expect((s.v2 as any).png).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledWith("png-blob");
    expect(result).toBe("png-blob");
  });

  it("exposes the v2 collab instance with exe/invoke/send/updateUserData", async () => {
    const s = await initSlate();
    expect(typeof s.collab.exe).toBe("function");
    expect(typeof s.collab.invoke).toBe("function");
    expect(typeof s.collab.send).toBe("function");
    expect(typeof s.collab.updateUserData).toBe("function");
    s.collab.send({ type: "onZoom", data: { zoomLevel: 2 } });
    expect((s.v2 as any).collab.send).toHaveBeenCalled();
  });

  it("maintains a live viewPort.zoom.r over the engine zoom", async () => {
    const s = await initSlate();
    expect(s.options.viewPort.zoom.r).toBe(1);
    ((s.v2 as any).getZoom as any).mockReturnValue(2.5);
    expect(s.options.viewPort.zoom.r).toBe(2.5);
  });

  it("exposes keyboard/undoRedo/birdsEye passthroughs + filters list (§C)", async () => {
    const s = await initSlate();
    expect(s.keyboard).toBe((s.v2 as any).keyboard);
    expect(s.undoRedo).toBe((s.v2 as any).undoRedo);
    expect(s.birdsEye).toBe((s.v2 as any).birdsEye);
    // v1 shape: object keyed by filter name, each with a `types` array.
    const avail = s.filters.availableFilters;
    expect(avail).toBeTypeOf("object");
    expect(Array.isArray(avail)).toBe(false);
    expect(Object.keys(avail).length).toBeGreaterThan(0);
    expect(Array.isArray(avail.dropShadow.types)).toBe(true);
  });

  it("disable()/enable() toggle interactivity flags and pan/zoom", async () => {
    const s = await initSlate();
    s.disable(null, null, true);
    expect(s.options.enabled).toBe(false);
    expect(s.options.allowDrag).toBe(false);
    s.enable();
    expect(s.options.enabled).toBe(true);
    expect(s.options.allowDrag).toBe(true);
  });

  it("exposes savingTemplateImage as a mutable flag", async () => {
    const s = await initSlate();
    expect(s.savingTemplateImage).toBe(false);
    s.savingTemplateImage = true;
    expect(s.savingTemplateImage).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// §C — layout: packageLayout / applyLayout / nodeMovePackage
// ---------------------------------------------------------------------------
describe("nodes layout facade (§C)", () => {
  const initSlate = async (options: Record<string, any> = {}) => {
    makeContainer();
    return new Slatebox.slate({ container: "slateCanvas", ...options }).init();
  };

  it("packageLayout() returns the v1 layout-calculation payload", async () => {
    const s = await initSlate({ layoutType: { val: "tree", rankdir: "TB" } });
    const a = s.nodes.add({
      id: "la",
      xPos: 0,
      yPos: 0,
      width: 100,
      height: 50,
      text: "A",
      backgroundColor: "#fff",
    });
    const b = s.nodes.add({ id: "lb", xPos: 200, yPos: 0, width: 100, height: 50 });
    a.relationships.addAssociation(b, { lineWidth: 3 });

    const pkg = s.nodes.packageLayout();
    expect(pkg.layoutType).toEqual({ val: "tree", rankdir: "TB" });
    expect(pkg.uniqueIds.sort()).toEqual(["la", "lb"]);
    expect(pkg.nodes.la).toMatchObject({ width: 100, height: 50, text: "A" });
    expect(pkg.associations).toHaveLength(1);
    expect(pkg.associations[0]).toMatchObject({
      parentId: "la",
      childId: "lb",
      lineWidth: 3,
    });
    expect(pkg.subgraphs).toBeDefined();
  });

  it("applyLayout() converts exportNodes (stringly x/y) into v2 moves", async () => {
    const s = await initSlate();
    s.nodes.add({ id: "m1", xPos: 0, yPos: 0 });
    s.nodes.add({ id: "m2", xPos: 10, yPos: 10 });

    s.nodes.applyLayout({
      exportNodes: {
        m1: { x: "279.5", y: "322" },
        m2: { x: "183.5", y: "186" },
        ghost: { x: "1", y: "1" }, // unknown ids are skipped
      },
    });

    const moves = (s.v2 as any).applyLayout.mock.calls[0][0];
    expect(moves).toEqual([
      { id: "m1", x: 279.5, y: 322 },
      { id: "m2", x: 183.5, y: 186 },
    ]);
    expect((s.v2 as any).centerContent).toHaveBeenCalled();
  });

  it("applyLayout({skipCenter: true}) skips centering", async () => {
    const s = await initSlate();
    s.nodes.add({ id: "m1", xPos: 0, yPos: 0 });
    s.nodes.applyLayout(
      { exportNodes: { m1: { x: "5", y: "5" } } },
      { skipCenter: true }
    );
    expect((s.v2 as any).centerContent).not.toHaveBeenCalled();
  });

  it("nodeMovePackage() applies relative moves to produce absolute v1 positions", async () => {
    const s = await initSlate();
    s.nodes.add({ id: "mv1", xPos: 100, yPos: 100, width: 50, height: 50 });
    s.nodes.add({ id: "mv2", xPos: 300, yPos: 300, width: 50, height: 50 });

    const pkg = s.nodes.nodeMovePackage({
      dur: 500,
      moves: [{ id: "mv1", x: 25, y: -10 }],
    });

    expect(pkg.dur).toBe(500);
    expect(pkg.nodeOptions).toHaveLength(1);
    expect(pkg.nodeOptions[0]).toMatchObject({
      id: "mv1",
      xPos: 125,
      yPos: 90,
    });
    expect(Array.isArray(pkg.textPositions)).toBe(true);
    expect(Array.isArray(pkg.associations)).toBe(true);
  });

  it("nodeMovePackage() without moves packages all nodes at current positions", async () => {
    const s = await initSlate();
    s.nodes.add({ id: "all1", xPos: 1, yPos: 2 });
    s.nodes.add({ id: "all2", xPos: 3, yPos: 4 });
    const pkg = s.nodes.nodeMovePackage();
    expect(pkg.dur).toBe(300);
    expect(pkg.nodeOptions.map((n: any) => n.id).sort()).toEqual([
      "all1",
      "all2",
    ]);
    expect(pkg.nodeOptions.find((n: any) => n.id === "all1")).toMatchObject({
      xPos: 1,
      yPos: 2,
    });
  });
});

// ---------------------------------------------------------------------------
// §D — node.resize and node.relationships facades
// ---------------------------------------------------------------------------
describe("node sub-facades (§D)", () => {
  const initSlate = async () => {
    makeContainer();
    return new Slatebox.slate({ container: "slateCanvas" }).init();
  };

  it("resize.set() applies dimensions to the live v2 node; send() re-applies", async () => {
    const s = await initSlate();
    const n = s.nodes.add({ id: "rz", xPos: 0, yPos: 0, width: 10, height: 10 });
    n.resize.set(200, 150);
    expect(n.options.width).toBe(200);
    expect(n.options.height).toBe(150);
    expect((n.v2 as any).setSize).toHaveBeenCalledWith(200, 150);
    n.resize.send();
    expect((n.v2 as any).setSize).toHaveBeenCalledTimes(2);
  });

  it("resize.send() broadcasts an onNodeResized package (v1 semantics)", async () => {
    const s = await initSlate();
    const n = s.nodes.add({ id: "rzb", xPos: 0, yPos: 0, width: 10, height: 10 });
    n.resize.set(300, 200);
    n.resize.send();
    expect((s.v2 as any).emitSlateChange).toHaveBeenCalledWith(
      "onNodeResized",
      expect.objectContaining({ id: "rzb", width: 300, height: 200 })
    );
    // send() consumes the pending resize — a second send is a no-op
    (s.v2 as any).emitSlateChange.mockClear();
    n.resize.send();
    expect((s.v2 as any).emitSlateChange).not.toHaveBeenCalled();
  });

  it("resize.set() before add() stages options without throwing", () => {
    const n = new Slatebox.node({ id: "unattached" });
    n.resize.set(80, 40);
    expect(n.options.width).toBe(80);
    expect(n.options.height).toBe(40);
  });

  it("relationships.addAssociation() links two facade nodes via v2", async () => {
    const s = await initSlate();
    const parent = s.nodes.add({ id: "pa", xPos: 0, yPos: 0 });
    const child = s.nodes.add({ id: "ch", xPos: 100, yPos: 0 });
    const assoc = parent.relationships.addAssociation(child);
    expect(assoc).toMatchObject({ parentId: "pa", childId: "ch" });

    const list = parent.relationships.associations;
    expect(list).toHaveLength(1);
    // v1 contract: entries carry live node references
    expect(list[0].parent.options.id).toBe("pa");
    expect(list[0].child.options.id).toBe("ch");
  });

  it("relationships.addAssociation() throws for unattached nodes", () => {
    const a = new Slatebox.node({ id: "x1" });
    const b = new Slatebox.node({ id: "x2" });
    expect(() => a.relationships.addAssociation(b)).toThrow(/add the node/);
  });

  it("node.png(cb) exports just this node with v1 options", async () => {
    const s = await initSlate();
    const n = s.nodes.add({ id: "png1", xPos: 0, yPos: 0 });
    const cb = vi.fn();
    n.png(cb);
    expect((s.v2 as any).png).toHaveBeenCalledWith(
      { nodes: ["png1"], noBackground: true, asBinary: true },
      expect.any(Function)
    );
    expect(cb).toHaveBeenCalledWith("png-blob");
  });

  it("node.png(groupIds, cb) exports the given group", async () => {
    const s = await initSlate();
    const n = s.nodes.add({ id: "png2", xPos: 0, yPos: 0 });
    s.nodes.add({ id: "png3", xPos: 10, yPos: 0 });
    const cb = vi.fn();
    n.png(["png2", "png3"], cb);
    expect((s.v2 as any).png).toHaveBeenCalledWith(
      { nodes: ["png2", "png3"], noBackground: true, asBinary: true },
      expect.any(Function)
    );
  });

  it("node.svg(cb) exports the SVG string", async () => {
    const s = await initSlate();
    const n = s.nodes.add({ id: "svg1", xPos: 0, yPos: 0 });
    const cb = vi.fn();
    n.svg(cb);
    expect((s.v2 as any).svg).toHaveBeenCalledWith(
      { nodes: ["svg1"], noBackground: true },
      expect.any(Function)
    );
    expect(cb).toHaveBeenCalledWith("<svg/>");
  });
});

// ---------------------------------------------------------------------------
// Slatebox.node wrapper
// ---------------------------------------------------------------------------
describe("Slatebox.node wrapper (§A/§D groundwork)", () => {
  it("constructs standalone with a generated id and v1-shaped options", () => {
    const n = new Slatebox.node({ xPos: 10, yPos: 20, text: "t" });
    expect(n.options.id).toBeTruthy();
    expect(n.options.xPos).toBe(10);
    expect(n.options.yPos).toBe(20);
    expect(n.v2).toBeUndefined();
    expect(n.slate).toBeUndefined();
  });

  it("preserves a caller-supplied id", () => {
    const n = new Slatebox.node({ id: "keep-me" });
    expect(n.options.id).toBe("keep-me");
  });
});
