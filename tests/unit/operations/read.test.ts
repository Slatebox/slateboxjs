// readSlate: the one read of a slate (P07). It is built from the write contract's key tables,
// so the specification is a round trip: whatever a plan writes, a read returns equal.
import { describe, expect, it } from "vitest";
import {
  applyPlanToJSON,
  contractLists,
  CONNECTOR_STYLE_KEYS,
  NODE_KEYS,
  NOTE_READ_KEYS,
  readSlate,
  summarizeSlate,
  toSlateDocument,
  OperationPlanError,
} from "../../../src/operations";

const plan = (...operations: any[]) => ({ message: "Done.", operations });
const say = { userMessage: "change the slate" };

function note(id: string, text: string, xPos: number, yPos: number, extra: Record<string, any> = {}) {
  return {
    options: { id, text, shape: "rectangle", vectorPath: "rectangle", xPos, yPos, width: 200, height: 100, ...extra },
    relationships: { associations: [] as any[] },
  };
}

function slate() {
  const nodes = [note("a", "Alpha", 100, 100, { groupId: "g1" }), note("b", "Beta", 400, 100, { groupId: "g1" }), note("c", "alpha", 700, 400)];
  nodes[0].relationships.associations.push({ id: "a->b", parentId: "a", childId: "b", lineColor: "#333333", lineWidth: 3, lineType: "bezier" });
  return {
    _id: "s1",
    shareId: "share",
    userId: "owner",
    options: { id: "slate-1", name: "Demo", description: "D", isPublic: true, isUnlisted: false, accessKey: "secret", creationBrief: "b", containerStyle: { backgroundColor: "#ffffff" } },
    nodes,
  };
}

describe("open-slate: every key a write accepts reads back equal", () => {
  const lists = contractLists();
  const values: Record<string, any> = {
    text: "Hello there",
    shape: "ellipse",
    x: 120,
    y: 640,
    width: 150,
    height: 90,
    rotationAngle: 30,
    backgroundColor: "#112233",
    foregroundColor: "#445566",
    borderColor: "#778899",
    borderWidth: 2,
    borderOpacity: 0.5,
    borderStyle: "dashed",
    opacity: 0.8,
    fontFamily: lists.fonts[0],
    fontSize: 18,
    textXAlign: "left",
    textYAlign: "top",
    animation: lists.animations[0],
    textOpacity: 0.6,
    link: "https://example.com/more",
    effect: lists.effects[0],
    groupId: "g9",
    templateCategory: "Costs",
    hiddenControls: ["color", "ask"],
    locked: true,
  };

  it("has a test value for every note key, so a new key cannot be left out of the read", () => {
    expect(Object.keys(values).sort()).toEqual(Object.keys(NODE_KEYS).sort());
  });

  it("returns each note key as add_nodes wrote it", () => {
    const { text, shape, x, y, width, height, ...style } = values;
    const written = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, ids: ["n1"], text, shape, x, y, width, height, style }), say).slate;
    const read = readSlate(written, { ids: ["n1"] }).nodes[0];
    for (const [key, value] of Object.entries(values)) expect([key, read[key]]).toEqual([key, value]);
  });

  it("returns each note key as update_nodes wrote it", () => {
    const { locked, ...changes } = values;
    const updated = applyPlanToJSON(
      slate(),
      plan({ kind: "update_nodes", target: { ids: ["a"] }, changes }, { kind: "update_nodes", target: { ids: ["a"] }, changes: { locked } }),
      say,
    ).slate;
    const read = readSlate(updated, { ids: ["a"] }).nodes[0];
    for (const [key, value] of Object.entries(values)) expect([key, read[key]]).toEqual([key, value]);
  });

  it("returns every connector key as connect_nodes wrote it", () => {
    const style: Record<string, any> = {
      label: "yes",
      lineColor: "#123456",
      lineWidth: 4,
      lineOpacity: 0.7,
      lineType: "orthogonal",
      lineCurveType: "quadratic",
      lineCurviness: 0.4,
      showParentArrow: true,
      showChildArrow: false,
    };
    expect(Object.keys(style).sort()).toEqual([...CONNECTOR_STYLE_KEYS].sort());
    const written = applyPlanToJSON(slate(), plan({ kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["c"] }, style }), say).slate;
    const read = readSlate(written).connections.find((line) => line.from === "b");
    expect(read).toEqual({ id: "b->c", from: "b", to: "c", ...style });
  });

  it("returns the slate's name, description and background as update_slate wrote them", () => {
    const changes = {
      name: "Renamed",
      description: "Now with a gradient",
      background: { color: "#102030", gradient: { type: "radial", colors: ["#102030", "#405060"], direction: "vertical" } },
    };
    const background = { userMessage: "rename it and make the background a gradient" };
    const written = applyPlanToJSON(slate(), plan({ kind: "update_slate", changes }), background).slate;
    const read = readSlate(written);
    expect({ name: read.name, description: read.description, background: read.background }).toEqual(changes);
    const plain = applyPlanToJSON(written, plan({ kind: "update_slate", changes: { background: { color: "#ffffff" } } }), { userMessage: "white background" }).slate;
    expect(readSlate(plain).background).toEqual({ color: "#ffffff" });
  });

  it("carries the group, link and picture a person sees on a note", () => {
    const s = slate();
    Object.assign(s.nodes[1].options, { link: { show: true, type: "url", data: "https://example.com" }, image: "https://example.com/a.png" });
    const [a, b, c] = readSlate(s).nodes;
    expect([a.groupId, b.groupId, c.groupId]).toEqual(["g1", "g1", null]);
    // Restated (integrate-w2): P10 made link and groupId writable keys, so the read returns link
    // as the write takes it (the web address), not P07's {type, data} object.
    expect(b.link).toBe("https://example.com");
    expect(b.image).toBe("https://example.com/a.png");
    expect(a.link).toBeNull();
    expect(Object.keys(a)).toEqual([...NOTE_READ_KEYS]);
  });

  it("states the box around the drawing", () => {
    expect(readSlate(slate()).bounds).toEqual({ x: 100, y: 100, width: 800, height: 400 });
    expect(readSlate({ options: {}, nodes: [] }).bounds).toBeNull();
  });
});

describe("search-within-canvas: a read selects notes with the write's own matcher", () => {
  it("q finds whole text ignoring case, every match, and match contains searches", () => {
    expect(readSlate(slate(), { q: "ALPHA" }).nodes.map((n) => n.id)).toEqual(["a", "c"]);
    expect(readSlate(slate(), { q: "alp" }).nodes).toEqual([]);
    expect(readSlate(slate(), { q: "alp", match: "contains" }).nodes.map((n) => n.id)).toEqual(["a", "c"]);
    // The same notes a write naming that text would have to choose between.
    expect(() => applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { text: "ALPHA" }, changes: { text: "x" } }), say)).toThrow(/matches 2 notes \(a, c\)/);
  });

  it("selects by ids, within a rectangle and by group", () => {
    expect(readSlate(slate(), { ids: ["c", "a"] }).nodes.map((n) => n.id)).toEqual(["c", "a"]);
    expect(readSlate(slate(), { within: { x: 0, y: 0, width: 650, height: 300 } }).nodes.map((n) => n.id)).toEqual(["a", "b"]);
    expect(readSlate(slate(), { groupId: "g1" }).nodes.map((n) => n.id)).toEqual(["a", "b"]);
    expect(readSlate(slate(), { ids: ["c"] }).nodeCount).toBe(1);
  });

  it("refuses a selection that names notes two ways, and match without q", () => {
    expect(() => readSlate(slate(), { ids: ["a"], q: "Alpha" })).toThrow(OperationPlanError);
    expect(() => readSlate(slate(), { ids: ["a"], q: "Alpha" })).toThrow(/one way/);
    expect(() => readSlate(slate(), { match: "contains" })).toThrow(/match goes with q/);
  });
});

describe("apply-style-to-others: fields return only what was asked", () => {
  it("returns the id and the named keys", () => {
    expect(readSlate(slate(), { fields: ["text", "x", "y"] }).nodes[0]).toEqual({ id: "a", text: "Alpha", x: 100, y: 100 });
  });

  it("a note's style read can be sent back as changes", () => {
    const styled = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { backgroundColor: "#abcdef", borderStyle: "dotted", fontSize: 30 } }), say).slate;
    const { id: _id, ...style } = readSlate(styled, { ids: ["a"], fields: ["backgroundColor", "borderStyle", "fontSize"] }).nodes[0];
    const copied = applyPlanToJSON(styled, plan({ kind: "update_nodes", target: { ids: ["b", "c"] }, changes: style }), say).slate;
    expect(readSlate(copied, { fields: ["backgroundColor", "borderStyle", "fontSize"] }).nodes.map(({ id: _, ...rest }) => rest)).toEqual([style, style, style]);
  });

  it("refuses a field the read does not have", () => {
    try {
      readSlate(slate(), { fields: ["text", "isPublic"] });
      expect.unreachable();
    } catch (error: any) {
      expect([error.status, error.code]).toEqual([400, "invalid_selection"]);
      expect(error.message).toMatch(/Unknown note field: isPublic/);
    }
  });
});

describe("result-size-and-selection: cursor paging in place of the 150/250 cut", () => {
  const big = () => {
    const nodes = Array.from({ length: 400 }, (_, i) => note(`n${i}`, `Note ${i}`, (i % 20) * 220, Math.floor(i / 20) * 120));
    nodes.forEach((node, i) => {
      if (i < 399) node.relationships.associations.push({ id: `n${i}->n${i + 1}`, parentId: `n${i}`, childId: `n${i + 1}` });
    });
    return { options: { name: "Big" }, nodes };
  };

  const roomy = 10_000_000;

  it("pages a 400-note slate and returns every note and connector exactly once", () => {
    const seen: string[] = [];
    const lines: string[] = [];
    let cursor: string | undefined;
    let pages = 0;
    do {
      const page = readSlate(big(), { cursor, maxChars: roomy });
      expect(page.nodeCount).toBe(400);
      seen.push(...page.nodes.map((n) => n.id));
      lines.push(...page.connections.map((c) => c.id));
      cursor = page.nextCursor ?? undefined;
      pages += 1;
    } while (cursor);
    expect(pages).toBe(4);
    expect(seen).toEqual(big().nodes.map((n) => n.options.id));
    expect(new Set(lines).size).toBe(399);
    expect(lines.length).toBe(399);
  });

  it("takes a smaller or larger page, up to 500", () => {
    expect(readSlate(big(), { limit: 10 }).nodes).toHaveLength(10);
    expect(readSlate(big(), { limit: 500, maxChars: roomy }).nextCursor).toBeNull();
    expect(() => readSlate(big(), { limit: 501 })).toThrow(/1 to 500/);
  });

  it("cuts a page at the size ceiling, never to nothing, and says where to go on", () => {
    // The default ceiling already cuts a page of 100 full notes with their connectors.
    const first = readSlate(big());
    expect(first.nodes.length).toBeLessThan(100);
    expect(JSON.stringify(first.nodes).length + JSON.stringify(first.connections).length).toBeLessThanOrEqual(60000);
    const page = readSlate(big(), { limit: 500, maxChars: 2000 });
    expect(page.nodes.length).toBeGreaterThan(0);
    expect(page.nodes.length).toBeLessThan(20);
    expect(page.nextCursor).not.toBeNull();
    expect(readSlate(big(), { limit: 500, maxChars: 1 }).nodes).toHaveLength(1);
  });

  it("refuses a cursor it did not give, or one whose note is gone", () => {
    expect(() => readSlate(big(), { cursor: "nonsense!" })).toThrow(/cursor/);
    const page = readSlate(big(), { limit: 5 });
    const s = big();
    s.nodes.splice(4, 1);
    expect(() => readSlate(s, { cursor: page.nextCursor! })).toThrow(/gone/);
  });

  it("pages to the end when two notes share an id (stored slates can hold duplicates)", () => {
    const s = { options: {}, nodes: [note("x", "1", 0, 0), note("y", "2", 0, 0), note("x", "3", 0, 0), note("z", "4", 0, 0)] };
    const texts: string[] = [];
    let cursor: string | undefined;
    for (let pages = 0; pages < 10; pages += 1) {
      const page = readSlate(s, { limit: 1, cursor });
      texts.push(...page.nodes.map((n) => n.text));
      cursor = page.nextCursor ?? undefined;
      if (!cursor) break;
    }
    expect(texts).toEqual(["1", "2", "3", "4"]);
    expect(cursor).toBeUndefined();
  });

  it("a cursor still continues after the notes before it change", () => {
    const page = readSlate(big(), { limit: 5 });
    const s = big();
    s.nodes.splice(0, 2);
    expect(readSlate(s, { limit: 1, cursor: page.nextCursor! }).nodes[0].id).toBe("n5");
  });

  it("a cursor survives a note id that is not plain ASCII", () => {
    const s = { options: {}, nodes: [note("café-1", "x", 0, 0), note("ü2", "y", 0, 0)] };
    const first = readSlate(s, { limit: 1 });
    expect(readSlate(s, { limit: 1, cursor: first.nextCursor! }).nodes[0].id).toBe("ü2");
  });
});

describe("comment-badges and include=full: comment markers and visibility do not leak", () => {
  const withMarker = () => {
    const s = slate();
    const marker = note("m1", "?", 120, 120, { isComment: true });
    s.nodes.push(marker);
    s.nodes[0].relationships.associations.push({ id: "a->m1", parentId: "a", childId: "m1" });
    return s;
  };

  it("leaves comment markers out of the read and the summary", () => {
    const read = readSlate(withMarker());
    expect(read.nodes.map((n) => n.id)).toEqual(["a", "b", "c"]);
    expect(read.nodeCount).toBe(3);
    expect(read.connections.map((c) => c.id)).toEqual(["a->b"]);
    const summary = summarizeSlate(withMarker());
    expect(summary.nodeCount).toBe(3);
    expect(summary.connections.map((c) => c.id)).toEqual(["a->b"]);
  });

  it("toSlateDocument is the engine's document: no visibility flags, access key, app fields or markers", () => {
    const document = toSlateDocument(withMarker());
    expect(Object.keys(document).sort()).toEqual(["nodes", "options", "shareId"]);
    expect(document.shareId).toBe("share");
    expect(document.options).toEqual({ id: "slate-1", name: "Demo", description: "D", containerStyle: { backgroundColor: "#ffffff" } });
    expect(JSON.stringify(document)).not.toMatch(/isPublic|isUnlisted|accessKey|isComment|creationBrief|"m1"/);
    expect(document.nodes).toHaveLength(3);
  });
});
