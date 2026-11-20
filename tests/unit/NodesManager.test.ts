import { describe, it, expect, vi, beforeEach } from "vitest";
import { NodesManager } from "../../src/core/NodesManager";

// ---------------------------------------------------------------------------
// Mock the Node module so we don't trigger SVG creation
// ---------------------------------------------------------------------------
vi.mock("../../src/core/Node", () => {
  // Keep a counter so each mock node gets a deterministic id when none is
  // supplied by the caller.
  let nextIdCounter = 0;

  const MockNode = vi.fn(function (
    this: any,
    options: any,
    _slate: any,
  ) {
    const id = options.id ?? `mock-node-${++nextIdCounter}`;
    this.id = id;
    this.options = { ...options };
    this._removed = false;
    this._positionCalls = [] as { x: number; y: number; dur: number }[];

    // Public API expected by NodesManager
    this.remove = vi.fn(() => {
      this._removed = true;
    });
    this.position = vi.fn((x: number, y: number, _a?: any, _b?: any, dur?: number) => {
      this._positionCalls.push({ x, y, dur: dur ?? 0 });
    });
    this.lock = vi.fn(() => {
      this.options.isLocked = true;
      this.options.allowDrag = false;
    });
    this.unlock = vi.fn(() => {
      this.options.isLocked = false;
      this.options.allowDrag = true;
    });
  });

  // Expose a helper to reset the counter between tests
  (MockNode as any)._resetIdCounter = () => {
    nextIdCounter = 0;
  };

  return {
    Node: MockNode as any,
    NodeOptions: {},
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
import { Node } from "../../src/core/Node";
const MockNode = Node as any;

/** Create a minimal slate stub. */
function createMockSlate() {
  return {
    id: "slate-1",
    // NodesManager doesn't directly call slate methods, but keep for realism
    getViewportAsync: vi.fn(),
    addNode: vi.fn(),
  };
}

/** Reset the shared id counter. */
function resetIdCounter() {
  MockNode._resetIdCounter();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("NodesManager", () => {
  let slate: ReturnType<typeof createMockSlate>;
  let manager: NodesManager;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});

    slate = createMockSlate();
    manager = new NodesManager(slate);
    resetIdCounter();
  });

  // -----------------------------------------------------------------------
  // Construction & initialization
  // -----------------------------------------------------------------------
  describe("construction", () => {
    it("creates an empty manager", () => {
      expect(manager.allNodes).toEqual([]);
      expect(manager.count()).toBe(0);
    });

    it("stores a reference to the slate", () => {
      expect((manager as any).slate).toBe(slate);
    });

    it("initialises with an empty internal Map", () => {
      expect((manager as any).nodes.size).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // add()
  // -----------------------------------------------------------------------
  describe("add()", () => {
    it("adds a node with the given options and returns it", () => {
      const node = manager.add({ id: "n1", x: 10, y: 20, text: "Hello" });
      expect(node).toBeDefined();
      expect(node.id).toBe("n1");
      expect(node.options.x).toBe(10);
      expect(node.options.y).toBe(20);
      expect(node.options.text).toBe("Hello");
      expect(manager.count()).toBe(1);
      expect(manager.one("n1")).toBe(node);
    });

    it("auto-generates an id when none is provided", () => {
      const node = manager.add({ x: 0, y: 0 });
      expect(node.id).toMatch(/^node_/);
      expect(manager.one(node.id)).toBe(node);
    });

    it("passes the slate reference to every Node", () => {
      const node = manager.add({ id: "n2" });
      // The mock constructor receives slate as the second argument
      expect(MockNode).toHaveBeenCalledWith(
        expect.objectContaining({ id: "n2" }),
        slate,
      );
    });

    it("returns the existing node and warns when a duplicate id is added", () => {
      const first = manager.add({ id: "dup" });
      expect(manager.count()).toBe(1);

      const second = manager.add({ id: "dup" });
      expect(second).toBe(first);
      expect(manager.count()).toBe(1);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('"dup" already exists'),
      );
    });

    it("accepts empty options (defaults to an empty object)", () => {
      const node = manager.add();
      expect(node).toBeDefined();
      expect(node.id).toBeTruthy();
      expect(manager.count()).toBe(1);
    });

    it("adds multiple nodes with unique ids", () => {
      const a = manager.add({ id: "a" });
      const b = manager.add({ id: "b" });
      const c = manager.add({ id: "c" });
      expect(manager.count()).toBe(3);
      expect(manager.allNodes).toEqual([a, b, c]);
    });

    it("stores every added node in the internal map", () => {
      const node = manager.add({ id: "map-test" });
      expect((manager as any).nodes.get("map-test")).toBe(node);
    });
  });

  // -----------------------------------------------------------------------
  // one() / get()
  // -----------------------------------------------------------------------
  describe("one()", () => {
    it("returns a node by id", () => {
      const node = manager.add({ id: "find-me" });
      expect(manager.one("find-me")).toBe(node);
    });

    it("returns undefined for a non-existent id", () => {
      expect(manager.one("i-dont-exist")).toBeUndefined();
    });

    it("returns undefined when the manager is empty", () => {
      expect(manager.one("anything")).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // allNodes (getter)
  // -----------------------------------------------------------------------
  describe("allNodes", () => {
    it("returns an empty array for a fresh manager", () => {
      expect(manager.allNodes).toEqual([]);
    });

    it("returns a snapshot of all nodes", () => {
      const a = manager.add({ id: "a" });
      const b = manager.add({ id: "b" });
      const result = manager.allNodes;
      expect(result).toHaveLength(2);
      expect(result).toContain(a);
      expect(result).toContain(b);
    });

    it("returns a new array each time (not the same reference)", () => {
      manager.add({ id: "x" });
      const first = manager.allNodes;
      const second = manager.allNodes;
      expect(first).toEqual(second);
      expect(first).not.toBe(second);
    });

    it("reflects removals", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      manager.remove("a");
      expect(manager.allNodes).toHaveLength(1);
      expect(manager.allNodes[0].id).toBe("b");
    });
  });

  // -----------------------------------------------------------------------
  // reorder(): the note list is the z-order a save keeps (P10 reorder-note)
  // -----------------------------------------------------------------------
  describe("reorder()", () => {
    it("moves a note to the end (front) or the start (back) of allNodes", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      manager.add({ id: "c" });
      manager.reorder("a", "front");
      expect(manager.allNodes.map((n) => n.id)).toEqual(["b", "c", "a"]);
      manager.reorder("c", "back");
      expect(manager.allNodes.map((n) => n.id)).toEqual(["c", "b", "a"]);
      manager.reorder("missing", "front");
      expect(manager.allNodes.map((n) => n.id)).toEqual(["c", "b", "a"]);
    });
  });

  // -----------------------------------------------------------------------
  // remove()
  // -----------------------------------------------------------------------
  describe("remove()", () => {
    it("removes a node by id and returns true", () => {
      const node = manager.add({ id: "removeme" });
      expect(manager.count()).toBe(1);

      const removed = manager.remove("removeme");
      expect(removed).toBe(true);
      expect(manager.count()).toBe(0);
      expect(manager.one("removeme")).toBeUndefined();
    });

    it("calls node.remove() on the removed node", () => {
      const node = manager.add({ id: "will-remove" });
      manager.remove("will-remove");
      expect(node._removed).toBe(true);
      expect(node.remove).toHaveBeenCalledOnce();
    });

    it("returns false for a non-existent id", () => {
      expect(manager.remove("non-existent")).toBe(false);
    });

    it("returns false on an empty manager", () => {
      expect(manager.remove("anything")).toBe(false);
    });

    it("does not affect other nodes", () => {
      const keep = manager.add({ id: "keep" });
      manager.add({ id: "remove" });
      manager.remove("remove");
      expect(manager.count()).toBe(1);
      expect(manager.one("keep")).toBe(keep);
    });

    it("can remove multiple nodes in succession", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      manager.add({ id: "c" });
      expect(manager.remove("a")).toBe(true);
      expect(manager.remove("c")).toBe(true);
      expect(manager.count()).toBe(1);
      expect(manager.one("b")).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // clear()
  // -----------------------------------------------------------------------
  describe("clear()", () => {
    it("removes every node from the manager", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      manager.add({ id: "c" });
      expect(manager.count()).toBe(3);

      manager.clear();
      expect(manager.count()).toBe(0);
      expect(manager.allNodes).toEqual([]);
    });

    it("calls remove() on every node", () => {
      const a = manager.add({ id: "a" });
      const b = manager.add({ id: "b" });
      manager.clear();
      expect(a._removed).toBe(true);
      expect(b._removed).toBe(true);
    });

    it("is a no-op on an already empty manager", () => {
      expect(() => manager.clear()).not.toThrow();
      expect(manager.count()).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // count()
  // -----------------------------------------------------------------------
  describe("count()", () => {
    it("starts at 0", () => {
      expect(manager.count()).toBe(0);
    });

    it("increments on add", () => {
      manager.add({ id: "a" });
      expect(manager.count()).toBe(1);
      manager.add({ id: "b" });
      expect(manager.count()).toBe(2);
    });

    it("decrements on remove", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      manager.remove("a");
      expect(manager.count()).toBe(1);
    });

    it("decrements correctly on clear", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      manager.clear();
      expect(manager.count()).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // forEach()
  // -----------------------------------------------------------------------
  describe("forEach()", () => {
    it("iterates over every node with (node, id)", () => {
      manager.add({ id: "a" });
      manager.add({ id: "b" });
      const seen: string[] = [];
      manager.forEach((node, id) => {
        seen.push(id);
      });
      expect(seen).toEqual(["a", "b"]);
    });

    it("does nothing on an empty manager", () => {
      const spy = vi.fn();
      manager.forEach(spy);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // filter()
  // -----------------------------------------------------------------------
  describe("filter()", () => {
    it("returns nodes matching the predicate", () => {
      manager.add({ id: "a", x: 0 });
      manager.add({ id: "b", x: 10 });
      manager.add({ id: "c", x: 20 });
      const result = manager.filter((n) => n.options.x! > 5);
      expect(result).toHaveLength(2);
      expect(result.map((n) => n.id)).toEqual(["b", "c"]);
    });

    it("returns an empty array when nothing matches", () => {
      manager.add({ id: "a" });
      const result = manager.filter(() => false);
      expect(result).toEqual([]);
    });

    it("returns an empty array on an empty manager", () => {
      expect(manager.filter(() => true)).toEqual([]);
    });
  });

  // -----------------------------------------------------------------------
  // find()
  // -----------------------------------------------------------------------
  describe("find()", () => {
    it("returns the first matching node", () => {
      manager.add({ id: "a", x: 0 });
      manager.add({ id: "b", x: 10 });
      const found = manager.find((n) => n.options.x! > 5);
      expect(found).toBeDefined();
      expect(found!.id).toBe("b");
    });

    it("returns undefined when nothing matches", () => {
      manager.add({ id: "a" });
      expect(manager.find(() => false)).toBeUndefined();
    });

    it("returns undefined on an empty manager", () => {
      expect(manager.find(() => true)).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // moveNodes()
  // -----------------------------------------------------------------------
  describe("moveNodes()", () => {
    beforeEach(() => {
      manager.add({ id: "n1", x: 0, y: 0 });
      manager.add({ id: "n2", x: 100, y: 100 });
    });

    it("repositions nodes and glides by default (~400ms)", () => {
      const pkg = {
        data: {
          nodes: [
            { id: "n1", x: 200, y: 300 },
            { id: "n2", x: 400, y: 500 },
          ],
        },
      };
      manager.moveNodes(pkg);

      const n1 = manager.one("n1")!;
      const n2 = manager.one("n2")!;
      expect(n1._positionCalls).toHaveLength(1);
      expect(n1._positionCalls[0]).toMatchObject({ x: 200, y: 300, dur: 400 });
      expect(n2._positionCalls[0]).toMatchObject({ x: 400, y: 500, dur: 400 });
    });

    it("honors an explicit dur from the package", () => {
      const pkg = {
        data: {
          dur: 350,
          nodes: [{ id: "n1", x: 99, y: 99 }],
        },
      };
      manager.moveNodes(pkg);
      const n1 = manager.one("n1")!;
      expect(n1._positionCalls[0].dur).toBe(350);
    });

    it("replays grouping, ungrouping, locking, and unlocking from nodeOptions", () => {
      const n1 = manager.one("n1")! as any;
      const n2 = manager.one("n2")! as any;

      manager.moveNodes({
        data: {
          nodeOptions: [
            { id: "n1", xPos: 0, yPos: 0, groupId: "grp-shared", isLocked: true },
            { id: "n2", xPos: 100, yPos: 100, groupId: "grp-shared", isLocked: true },
          ],
        },
      });

      expect(n1.options.groupId).toBe("grp-shared");
      expect(n2.options.groupId).toBe("grp-shared");
      expect(n1.lock).toHaveBeenCalledOnce();
      expect(n2.lock).toHaveBeenCalledOnce();

      manager.moveNodes({
        data: {
          nodeOptions: [
            { id: "n1", xPos: 0, yPos: 0, groupId: null, isLocked: false },
            { id: "n2", xPos: 100, yPos: 100, groupId: null, isLocked: false },
          ],
        },
      });

      expect(n1.options.groupId).toBeUndefined();
      expect(n2.options.groupId).toBeUndefined();
      expect(n1.unlock).toHaveBeenCalledOnce();
      expect(n2.unlock).toHaveBeenCalledOnce();
    });

    it("places instantly when options.animate is false", () => {
      const pkg = {
        data: {
          nodes: [{ id: "n1", x: 1, y: 2 }],
        },
      };
      manager.moveNodes(pkg, { animate: false });
      const n1 = manager.one("n1")!;
      expect(n1._positionCalls[0].dur).toBe(0);
    });

    it("silently skips unknown node ids", () => {
      const pkg = {
        data: {
          nodes: [
            { id: "n1", x: 10, y: 10 },
            { id: "ghost", x: 999, y: 999 },
          ],
        },
      };
      expect(() => manager.moveNodes(pkg)).not.toThrow();
      // n1 still gets moved
      expect(manager.one("n1")!._positionCalls).toHaveLength(1);
    });

    it("does nothing when packageData.data.nodes is missing", () => {
      const pkg = { data: {} };
      expect(() => manager.moveNodes(pkg)).not.toThrow();
      expect(manager.one("n1")!._positionCalls).toHaveLength(0);
    });

    it("does nothing when packageData.data is missing", () => {
      const pkg = {};
      expect(() => manager.moveNodes(pkg as any)).not.toThrow();
    });
  });

  // -----------------------------------------------------------------------
  // addRelationship() / removeRelationship()
  // -----------------------------------------------------------------------
  describe("addRelationship()", () => {
    it("creates an association between existing parent and child", () => {
      const parent = manager.add({ id: "relP" });
      const child = manager.add({ id: "relC" });
      (parent as any).relationships = { addAssociation: vi.fn() };
      manager.addRelationship({ parentId: "relP", childId: "relC", lineWidth: 3 });
      expect((parent as any).relationships.addAssociation).toHaveBeenCalledWith(
        child,
        expect.objectContaining({ parentId: "relP", childId: "relC" })
      );
    });

    it("waits for a note still being drawn, so connectors between new notes are not lost (P10 duplicate)", async () => {
      const parent = manager.add({ id: "newP" });
      const child = manager.add({ id: "newC" });
      let finish!: () => void;
      const ready = new Promise<void>((resolve) => (finish = resolve));
      (parent as any).ready = ready;
      (child as any).ready = ready;
      manager.addRelationship({ id: "newP->newC", parentId: "newP", childId: "newC" });
      const addAssociation = vi.fn();
      (parent as any).relationships = { addAssociation, hasAssociationId: () => false };
      finish();
      await ready;
      await Promise.resolve();
      expect(addAssociation).toHaveBeenCalledWith(child, expect.objectContaining({ id: "newP->newC" }));
    });

    it("warns when either node is missing", () => {
      manager.addRelationship({ parentId: "ghost", childId: "ghost2" });
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("removeRelationship()", () => {
    it("removes the association from the parent", () => {
      const parent = manager.add({ id: "relP2" });
      manager.add({ id: "relC2" });
      (parent as any).relationships = { removeAssociation: vi.fn() };
      manager.removeRelationship({ parentId: "relP2", childId: "relC2" });
      expect(
        (parent as any).relationships.removeAssociation
      ).toHaveBeenCalledWith("relC2");
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases & defensive behaviour
  // -----------------------------------------------------------------------
  describe("edge cases", () => {
    it("handles null/undefined passed to one()", () => {
      manager.add({ id: "n1" });
      expect(manager.one(null as any)).toBeUndefined();
      expect(manager.one(undefined as any)).toBeUndefined();
    });

    it("handles null/undefined passed to remove()", () => {
      manager.add({ id: "n1" });
      expect(manager.remove(null as any)).toBe(false);
      expect(manager.remove(undefined as any)).toBe(false);
      expect(manager.count()).toBe(1);
    });

    it("handles empty string id for one()", () => {
      expect(manager.one("")).toBeUndefined();
    });

    it("can add then remove then add the same id again", () => {
      const first = manager.add({ id: "reuse" });
      manager.remove("reuse");
      const second = manager.add({ id: "reuse" });
      expect(second).not.toBe(first); // new instance
      expect(manager.count()).toBe(1);
      expect(manager.one("reuse")).toBe(second);
    });

    it("does not mutate the original options object passed to add()", () => {
      const opts = { id: "frozen-opts", x: 10 };
      Object.freeze(opts);
      expect(() => manager.add(opts)).not.toThrow();
      const node = manager.one("frozen-opts")!;
      expect(node.options.x).toBe(10);
    });
  });

  // -----------------------------------------------------------------------
  // Interaction with Node (spies on mock)
  // -----------------------------------------------------------------------
  describe("Node lifecycle interaction", () => {
    it("calls Node constructor with the right arguments", () => {
      manager.add({ id: "lifecycle", text: "test", x: 1, y: 2 });
      expect(MockNode).toHaveBeenCalledWith(
        expect.objectContaining({ id: "lifecycle" }),
        slate,
      );
    });

    it("calls node.remove() when remove() is invoked", () => {
      const node = manager.add({ id: "lifecycle" });
      manager.remove("lifecycle");
      expect(node.remove).toHaveBeenCalledOnce();
    });

    it("calls node.remove() on every node during clear()", () => {
      const a = manager.add({ id: "a" });
      const b = manager.add({ id: "b" });
      manager.clear();
      expect(a.remove).toHaveBeenCalledOnce();
      expect(b.remove).toHaveBeenCalledOnce();
    });

    it("calls node.position() during moveNodes()", () => {
      manager.add({ id: "movable" });
      manager.moveNodes({
        data: { nodes: [{ id: "movable", x: 50, y: 60 }] },
      });
      const node = manager.one("movable")!;
      expect(node.position).toHaveBeenCalledWith(50, 60, undefined, undefined, 400);
    });
  });
});
