import { describe, it, expect } from "vitest";
import { applyDelta, diffSlates } from "../../src/core/SlateDelta";

// Other people's changes are carried into each undo record (UndoRedo.absorbRemote).

const note = (id: string, text: string, links: Record<string, any>[] = [], extra: Record<string, any> = {}) => ({
  options: { id, text, xPos: 0, yPos: 0, ...extra },
  relationships: { associations: links },
});
const line = (parentId: string, childId: string, extra: Record<string, any> = {}) => ({
  id: `${parentId}->${childId}`,
  parentId,
  childId,
  lineColor: "#666",
  ...extra,
});
const slate = (nodes: any[], options: Record<string, any> = { id: "s" }) => ({ options, nodes, shareId: "" });
const texts = (s: any) => s.nodes.map((n: any) => n.options.text).sort();

describe("diffSlates", () => {
  it("is null when nothing in the drawing changed", () => {
    const a = slate([note("w", "Welcome")], { id: "s", viewPort: { zoom: 1 } });
    const b = slate([note("w", "Welcome")], { id: "s", viewPort: { zoom: 2 }, collabBaseline: { t: 1 } });
    expect(diffSlates(a, b)).toBeNull();
  });

  it("finds notes added, removed and changed, and lines added and removed", () => {
    const a = slate([note("w", "Welcome", [line("w", "x")]), note("x", "X"), note("y", "Y")]);
    const b = slate([note("w", "Hello", [line("w", "z")]), note("z", "Z"), note("y", "Y")]);
    const delta = diffSlates(a, b)!;
    expect(delta.added.map((n) => n.options.id)).toEqual(["z"]);
    expect(delta.removed).toEqual(["x"]);
    expect(delta.changed).toEqual([
      { id: "w", set: { text: "Hello" }, unset: [], links: { set: [line("w", "z")], removed: ["w->x"] } },
    ]);
  });
});

describe("applyDelta", () => {
  it("adds another person's note to a record taken before it", () => {
    const record = slate([note("w", "Welcome")]);
    const delta = diffSlates(slate([note("w", "Welcome"), note("a", "Alpha")]), slate([note("w", "Welcome"), note("a", "Alpha"), note("b", "FromB")]))!;
    expect(texts(applyDelta(record, delta))).toEqual(["FromB", "Welcome"]);
  });

  it("removes a note another person removed, with the lines into it", () => {
    const record = slate([note("w", "Welcome", [line("w", "b")]), note("b", "FromB")]);
    const delta = diffSlates(slate([note("b", "FromB")]), slate([]))!;
    const out = applyDelta(record, delta);
    expect(texts(out)).toEqual(["Welcome"]);
    expect(out.nodes[0].relationships.associations).toEqual([]);
  });

  it("changes only the fields another person changed, and leaves this person's own", () => {
    const record = slate([note("w", "Mine", [], { color: "red" })]);
    const delta = diffSlates(slate([note("w", "Mine", [], { color: "red" })]), slate([note("w", "Mine", [], { color: "blue" })]))!;
    expect(applyDelta(record, delta).nodes[0].options).toMatchObject({ text: "Mine", color: "blue" });
    // A note the record does not hold (this person added it later) is not brought in by a change to it.
    expect(applyDelta(slate([]), delta).nodes).toEqual([]);
  });

  it("does not add a line to a note the record does not hold", () => {
    const delta = diffSlates(
      slate([note("w", "W"), note("a", "A")]),
      slate([note("w", "W", [line("w", "a")]), note("a", "A")])
    )!;
    const withoutA = applyDelta(slate([note("w", "W")]), delta);
    expect(withoutA.nodes[0].relationships.associations).toEqual([]);
    const withA = applyDelta(slate([note("w", "W"), note("a", "A")]), delta);
    expect(withA.nodes[0].relationships.associations).toEqual([line("w", "a")]);
  });

  it("leaves the record it is given as it was", () => {
    const record = slate([note("w", "Welcome")]);
    const copy = JSON.parse(JSON.stringify(record));
    applyDelta(record, diffSlates(slate([note("w", "Welcome")]), slate([note("w", "Changed")]))!);
    expect(record).toEqual(copy);
  });
});
