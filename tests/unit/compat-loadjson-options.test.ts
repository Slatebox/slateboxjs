// ---------------------------------------------------------------------------
// compat-loadjson-options — loadJSON must update the FACADE-VISIBLE options
//
// Root cause (iteration 19): the app's template journey reads
// `slate.options.basedOnTemplate` / `templatePrompt` / `templateName` from
// the compat facade object right after `await slate.loadJSON(templateJson)`.
// `init()` gives the v2 engine its OWN options object (v1SlateToV2 spreads),
// and the real `deserializeInner` merges loaded options into that v2 copy —
// so a load that changes options never reached the facade copy the host
// reads. Net effect: every template kickoff saw basedOnTemplate=null and
// aborted (or fired contentless) even when the template JSON loaded fine.
//
// These tests mock the v2 Slate with a FAITHFUL loadJSON (Object.assign onto
// v2 options + node rebuild — exactly what deserializeInner does) and assert
// the facade reflects the loaded state afterwards.
// ---------------------------------------------------------------------------
import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

vi.mock("../../src/core/Slate", () => {
  class FaithfulMockSlate {
    element: any;
    options: any;
    nodes: any;
    constructor(element: any, options: any) {
      this.element = element;
      // Real init(): `v1SlateToV2(this.options)` spreads into a NEW object —
      // facade options and v2 options are decoupled from the start.
      this.options = { ...options };
      const store = new Map<string, any>();
      this.nodes = {
        store,
        add: vi.fn((o: any) => {
          const n = { id: o.id, options: o };
          store.set(o.id, n);
          return n;
        }),
        one: vi.fn((id: string) => store.get(id)),
        clear: vi.fn(() => store.clear()),
        get allNodes() {
          return Array.from(store.values());
        },
      };
    }
    getViewportAsync = vi.fn(async () => ({}));
    applyContainerStyle = vi.fn();
    getZoom = vi.fn(() => 1);
    fitToContent = vi.fn();
    centerContent = vi.fn();
    emitSlateChange = vi.fn();
    exportJSON = vi.fn(() => '{"options":{},"nodes":[]}');
    // Faithful to real deserializeInner: options merge into the V2 copy and
    // nodes are rebuilt there.
    loadJSON = vi.fn(async (json: string) => {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      Object.assign(this.options, data.options || {});
      this.nodes.store.clear();
      const nodes = Array.isArray(data.nodes)
        ? data.nodes
        : Object.values(data.nodes || {});
      for (const n of nodes as any[]) {
        this.nodes.store.set(n.options.id, {
          id: n.options.id,
          options: { ...n.options },
        });
      }
    });
  }
  return { Slate: FaithfulMockSlate };
});

import { Slatebox } from "../../src/compat-facade";

beforeEach(() => {
  document.body.innerHTML = "";
});

const makeContainer = (id = "slateCanvas") => {
  const div = document.createElement("div");
  div.id = id;
  document.body.appendChild(div);
  return div;
};

// The REAL Pro/Con seed (same file the app bootstraps and the client loads).
const seed = JSON.parse(
  readFileSync(resolve(__dirname, "../fixtures/proConTemplate.json"), "utf8"),
);

// Mirror Chat.jsx loadTemplateIntoSlate: rewrite doc-level options, then load.
const templateJsonForCanvas = () => ({
  ...seed,
  options: {
    ...seed.options,
    id: "canvas-1",
    shareId: "canvas-1",
    createdViaIA: true,
    isTemplate: false,
    templateApproved: false,
    basedOnTemplate: "tplprocon001",
    templateName: seed.options.name,
  },
  nodes: (seed.nodes as any[]).map((n) => ({ ...n })),
});

// Real-world template exports (and the live canvas docs they get loaded into)
// carry a plain viewPort object; loading one must not clobber the facade's
// live zoom getter.
const viewPortBearingJson = () => {
  const j = templateJsonForCanvas();
  j.options.viewPort = {
    allowDrag: true,
    useInertiaScrolling: true,
    showGrid: false,
    snapToObjects: true,
    originalWidth: 1230,
    originalHeight: 569,
    zoom: { w: 4, h: 4, l: 0, t: 0, r: 0.72 },
  };
  return j;
};

describe("facade slate.loadJSON options mirroring", () => {
  it("exposes the loaded template context through slate.options (the gate the app reads)", async () => {
    makeContainer();
    const s = await new (Slatebox as any).slate({ container: "slateCanvas" }).init();

    // Pre-load state: fresh canvas has no template.
    expect(s.options.basedOnTemplate).toBeUndefined();

    await s.loadJSON(JSON.stringify(templateJsonForCanvas()));

    // The template gate in initAIConversation reads exactly these fields.
    expect(s.options.basedOnTemplate).toBe("tplprocon001");
    expect(s.options.templateName).toBe(seed.options.name);
    expect(typeof s.options.templatePrompt).toBe("string");
    expect((s.options.templatePrompt || "").length).toBeGreaterThan(40);
    expect(s.options.isTemplate).toBe(false);
  });

  it("category sections are visible through nodes.allNodes after load", async () => {
    makeContainer();
    const s = await new (Slatebox as any).slate({ container: "slateCanvas" }).init();
    await s.loadJSON(JSON.stringify(templateJsonForCanvas()));

    const cats = s.nodes.allNodes.filter(
      (n: any) => n.options.isCategory && n.options.categoryName,
    );
    expect(cats).toHaveLength(4);
    expect(cats.map((c: any) => c.options.categoryName)).toEqual([
      "Advantages",
      "Disadvantages",
      "Evaluation Criteria",
      "Costs",
    ]);
  });

  it("keeps the live viewPort.zoom getter alive across a load (QuickNodeActions reads zoom.r)", async () => {
    makeContainer();
    const s = await new (Slatebox as any).slate({ container: "slateCanvas" }).init();

    const json = viewPortBearingJson();
    // The payload carries a plain viewPort object — merging it verbatim
    // would clobber the facade's `zoom.r` getter and break host zoom reads.
    expect(json.options.viewPort).toBeTruthy();

    await s.loadJSON(JSON.stringify(json));

    expect(typeof s.options.viewPort.zoom.r).toBe("number");
    expect(s.options.viewPort.zoom.r).toBe(1);
  });

  it("non-template loads still merge options (imports, presets)", async () => {
    makeContainer();
    const s = await new (Slatebox as any).slate({ container: "slateCanvas" }).init();
    await s.loadJSON(
      JSON.stringify({ options: { name: "Imported", layoutType: "tree" }, nodes: [] }),
    );
    expect(s.options.name).toBe("Imported");
    expect(s.options.layoutType).toBe("tree");
  });
});
