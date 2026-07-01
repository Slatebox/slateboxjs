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
const mockV2NodesManager = () => {
  const store = new Map<string, any>();
  return {
    store,
    add: vi.fn((options: any) => {
      const v2node = { id: options.id, options };
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
    constructor(element: any, options: any) {
      this.element = element;
      this.options = options;
      this.nodes = mockV2NodesManager();
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
